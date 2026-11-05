import { NextRequest, NextResponse } from "next/server";
import {
  buildEnterpriseSystemPrompt,
  validateAndSanitizeGroqResponse,
  type ConversationContextState,
} from "@/lib/ai/conversationContext";

// Primary Groq models supported by Groq API
const PRIMARY_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";
const FALLBACK_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, context } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const conversationHistory = Array.isArray(history)
      ? history.map((m: any) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: typeof m.content === "string" ? m.content : "",
        }))
      : [];

    const existingContext: Partial<ConversationContextState> =
      context && typeof context === "object" ? context : {};

    const systemPrompt = buildEnterpriseSystemPrompt(existingContext);

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10),
      { role: "user", content: message },
    ];

    // Enterprise Groq API Call with timeout and model fallback cascade
    let groqRawData: any = null;
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      const callGroq = async (model: string) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

        try {
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages,
              temperature: 0.3,
              response_format: { type: "json_object" },
            }),
            signal: controller.signal,
          });
          return res;
        } finally {
          clearTimeout(timeout);
        }
      };

      try {
        let res = await callGroq(PRIMARY_MODEL);

        if (!res.ok) {
          console.warn(`Groq primary model (${PRIMARY_MODEL}) failed with status ${res.status}. Cascading to fallbacks...`);
          for (const fallbackModel of FALLBACK_MODELS) {
            try {
              res = await callGroq(fallbackModel);
              if (res.ok) break;
            } catch (fallbackErr) {
              console.warn(`Fallback model ${fallbackModel} failed:`, fallbackErr);
            }
          }
        }

        if (res.ok) {
          const data = await res.json();
          const content = data?.choices?.[0]?.message?.content ?? "{}";
          groqRawData = JSON.parse(content);
        } else {
          console.error("All Groq models failed. Last status:", res.status);
        }
      } catch (groqErr) {
        console.warn("Groq API call exception, using clinical fallback engine:", groqErr);
      }
    } else {
      console.warn("GROQ_API_KEY is not configured, running on built-in clinical fallback engine.");
    }

    // Server-side validation, sanitization & safety guard
    const sanitizedResponse = validateAndSanitizeGroqResponse(
      groqRawData,
      message,
      existingContext,
      conversationHistory
    );

    return NextResponse.json(sanitizedResponse, { status: 200 });
  } catch (err) {
    console.error("Consult-AI route critical error:", err);

    // Guaranteed safe emergency/clinical fallback response
    const safeFallback = validateAndSanitizeGroqResponse(
      null,
      "General consultation inquiry",
      undefined,
      []
    );

    return NextResponse.json(safeFallback, { status: 200 });
  }
}
