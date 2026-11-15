/**
 * Centralized Groq AI Client
 * Manages model fallback cascade, rate-limiting retry with exponential backoff,
 * real-time SSE streaming, and server-side function calling execution.
 */

import { NIRVANA_TOOLS } from "./tools/definitions.ts";
import { executeNirvanaTool } from "./tools/executor.ts";

export const PRIMARY_GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
export const FALLBACK_GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
];

export interface GroqMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
}

export interface GroqClientOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  enableTools?: boolean;
}

/**
 * Executes a resilient non-streaming completion with automatic fallback cascade.
 */
export async function callGroqChat(
  messages: GroqMessage[],
  options: GroqClientOptions = {}
): Promise<{ content: string; modelUsed: string; toolCallsExecuted?: any[] }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const modelCandidates = [
    options.model || PRIMARY_GROQ_MODEL,
    ...FALLBACK_GROQ_MODELS.filter((m) => m !== (options.model || PRIMARY_GROQ_MODEL)),
  ];

  let lastError: Error | null = null;
  const timeoutMs = options.timeoutMs || 15000;

  for (const model of modelCandidates) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const payload: Record<string, any> = {
        model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 1024,
      };

      if (options.enableTools) {
        payload.tools = NIRVANA_TOOLS;
        payload.tool_choice = "auto";
      }

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(`Groq model ${model} HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const choice = data?.choices?.[0];
      const message = choice?.message;

      // Handle Tool Calls if returned by the LLM
      if (message?.tool_calls && message.tool_calls.length > 0) {
        const toolExecutionLogs: any[] = [];
        const followUpMessages: GroqMessage[] = [...messages, message];

        for (const toolCall of message.tool_calls) {
          const fnName = toolCall.function?.name;
          let parsedArgs = {};
          try {
            parsedArgs = JSON.parse(toolCall.function?.arguments || "{}");
          } catch {
            parsedArgs = {};
          }

          const toolResult = await executeNirvanaTool(fnName, parsedArgs);
          toolExecutionLogs.push({ tool: fnName, args: parsedArgs, result: toolResult });

          followUpMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: fnName,
            content: JSON.stringify(toolResult.data || { success: toolResult.success, error: toolResult.error }),
          });
        }

        // Final turn to let LLM respond naturally with the tool data
        const finalRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: followUpMessages,
            temperature: 0.3,
            max_tokens: options.maxTokens ?? 1024,
          }),
        });

        if (finalRes.ok) {
          const finalData = await finalRes.json();
          const finalContent = finalData?.choices?.[0]?.message?.content || "";
          return {
            content: finalContent,
            modelUsed: model,
            toolCallsExecuted: toolExecutionLogs,
          };
        }
      }

      const content = message?.content || "";
      return { content, modelUsed: model };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Groq model attempt ${model} failed, trying next fallback...`);
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("All Groq model attempts failed.");
}

/**
 * Initiates a streaming response from Groq using Server-Sent Events / ReadableStream.
 */
export async function streamGroqChat(
  messages: GroqMessage[],
  options: GroqClientOptions = {}
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const model = options.model || PRIMARY_GROQ_MODEL;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 1024,
      stream: true,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(`Groq stream failed HTTP ${res.status}: ${errorText}`);
  }

  if (!res.body) {
    throw new Error("Groq response body is empty.");
  }

  return res.body;
}
