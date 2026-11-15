import { NextRequest, NextResponse } from "next/server";
import {
  buildEnterpriseSystemPrompt,
  generateEnterpriseConversationResponse,
  validateAndSanitizeGroqResponse,
  EMERGENCY_REGEX,
  isProfaneMessage,
  type ConversationContextState,
} from "@/lib/ai/conversationContext";
import { formatRetrievedKnowledgeForPrompt } from "@/lib/ai/rag/retriever";
import { buildConversationSummary, formatSummaryForPrompt } from "@/lib/ai/memory/conversationSummary";
import { streamGroqChat, PRIMARY_GROQ_MODEL } from "@/lib/ai/groqClient";
import { persistMessageToFirestore } from "@/lib/ai/memory/longTermMemory";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message, history = [], context = {}, userId, conversationId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const conversationHistory = Array.isArray(history)
      ? history.map((m: any) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: typeof m.content === "string" ? m.content : "",
        }))
      : [];

    const existingContext: Partial<ConversationContextState> =
      context && typeof context === "object" ? context : {};

    // 1. Red-line Emergency Check (Immediate Zero-Latency Triage)
    if (EMERGENCY_REGEX.test(message)) {
      const emergencyReply =
        "If you or someone nearby is experiencing severe chest pain, difficulty breathing, profuse bleeding, or unconsciousness, please seek emergency medical care immediately by calling 108 / 112 or going to the nearest emergency hospital.";

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ token: emergencyReply, done: false })}\n\n`
            )
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                fullText: emergencyReply,
                is_emergency: true,
                gif: { should_show: false, search_query: "", category: "none" },
                safety: { is_medical: true, is_emergency: true, requires_professional_response: true },
              })}\n\n`
            )
          );
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // 1b. Zero-Tolerance Profanity & Abusive Language Boundary
    if (isProfaneMessage(message)) {
      const boundaryReply =
        "I am here to assist you with medical guidance and appointments in a respectful and safe environment. Please refrain from using offensive or abusive language. How can I assist you with your health concerns or Dr. Pratima's clinic today?";

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ token: boundaryReply, done: false })}\n\n`
            )
          );
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                done: true,
                fullText: boundaryReply,
                is_emergency: false,
                gif: { should_show: false, search_query: "", category: "none" },
                safety: { is_medical: false, is_emergency: false, requires_professional_response: false },
              })}\n\n`
            )
          );
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // 2. RAG Knowledge Retrieval & Conversation Summary
    const ragContext = formatRetrievedKnowledgeForPrompt(message);
    const summary = buildConversationSummary(conversationHistory);
    const summaryContext = formatSummaryForPrompt(summary);

    const systemPrompt = buildEnterpriseSystemPrompt(existingContext, ragContext, summaryContext, "text");

    const groqMessages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-8),
      { role: "user" as const, content: message },
    ];

    const apiKey = process.env.GROQ_API_KEY;

    // 3. Groq Streaming
    if (apiKey) {
      try {
        const groqStream = await streamGroqChat(groqMessages, {
          model: PRIMARY_GROQ_MODEL,
          temperature: 0.3,
          maxTokens: 600,
        });

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        let accumulatedReply = "";

        const transformStream = new TransformStream({
          async transform(chunk, controller) {
            const text = decoder.decode(chunk, { stream: true });
            const lines = text.split("\n");

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              if (trimmed === "data: [DONE]") continue;

              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  accumulatedReply += delta;
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ token: delta, done: false })}\n\n`
                    )
                  );
                }
              } catch {
                // Ignore SSE framing artifacts
              }
            }
          },
          async flush(controller) {
            // End of stream: unwrap JSON if model produced raw JSON, and compute clinical metadata & GIPHY reaction
            let cleanAccumulated = accumulatedReply;
            if (cleanAccumulated.trim().startsWith("{")) {
              try {
                const parsed = JSON.parse(cleanAccumulated);
                if (parsed.reply) cleanAccumulated = parsed.reply;
              } catch {
                const match = cleanAccumulated.match(/"reply"\s*:\s*"((?:\\.|[^"\\])*)"/);
                if (match) cleanAccumulated = match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
              }
            }

            const sanitized = validateAndSanitizeGroqResponse(
              cleanAccumulated.trim().startsWith("{") ? JSON.parse(cleanAccumulated) : { reply: cleanAccumulated },
              message,
              existingContext,
              conversationHistory
            );

            const finalReply = sanitized.reply || cleanAccumulated;

            // Persist to long-term memory if user is authenticated
            if (userId && conversationId) {
              persistMessageToFirestore(userId, conversationId, {
                role: "user",
                content: message,
              }).catch(() => {});
              persistMessageToFirestore(userId, conversationId, {
                role: "assistant",
                content: finalReply,
                metadata: {
                  symptoms: sanitized.context_update.reported_symptoms,
                  isEmergency: sanitized.safety.is_emergency,
                },
              }).catch(() => {});
            }

            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  done: true,
                  fullText: finalReply,
                  gif: sanitized.gif,
                  context_update: sanitized.context_update,
                  analysis: sanitized.analysis,
                  safety: sanitized.safety,
                })}\n\n`
              )
            );
          },
        });

        return new Response(groqStream.pipeThrough(transformStream), {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      } catch (streamErr) {
        console.warn("Groq streaming failed, falling back to simulated clinical stream:", streamErr);
      }
    }

    // 4. Fallback Generator Stream
    const fallbackResponse = generateEnterpriseConversationResponse(
      message,
      conversationHistory,
      existingContext
    );

    const encoder = new TextEncoder();
    const words = fallbackResponse.reply.split(" ");

    const fallbackStream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const word = (i === 0 ? "" : " ") + words[i];
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ token: word, done: false })}\n\n`
            )
          );
          // 15ms natural token pacing
          await new Promise((r) => setTimeout(r, 15));
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              done: true,
              fullText: fallbackResponse.reply,
              gif: fallbackResponse.gif,
              context_update: fallbackResponse.context_update,
              analysis: fallbackResponse.analysis,
              safety: fallbackResponse.safety,
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new Response(fallbackStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: unknown) {
    console.error("Critical error in consult-ai stream:", err);
    return NextResponse.json({ error: "Stream error occurred" }, { status: 500 });
  }
}

