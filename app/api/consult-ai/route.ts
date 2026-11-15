import { NextRequest, NextResponse } from "next/server";
import {
  buildEnterpriseSystemPrompt,
  validateAndSanitizeGroqResponse,
  isProfaneMessage,
  EMERGENCY_REGEX,
  type ConversationContextState,
} from "@/lib/ai/conversationContext";
import { formatRetrievedKnowledgeForPrompt } from "@/lib/ai/rag/retriever";
import { buildConversationSummary, formatSummaryForPrompt } from "@/lib/ai/memory/conversationSummary";
import { callGroqChat, type GroqMessage } from "@/lib/ai/groqClient";
import { persistMessageToFirestore } from "@/lib/ai/memory/longTermMemory";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history, context, userId, conversationId } = body;

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

    // 0. Emergency Immediate Safety Triage
    if (EMERGENCY_REGEX.test(message)) {
      return NextResponse.json({
        reply:
          "If you or someone nearby is experiencing severe chest pain, difficulty breathing, profuse bleeding, or unconsciousness, please seek emergency medical care immediately by calling 108 / 112 or going to the nearest emergency hospital.",
        language: "en",
        intent: "emergency",
        emotion: "concerned",
        sentiment: "negative",
        conversation_topic: "emergency",
        context_update: {
          current_topic: "emergency",
          current_emotion: "alarmed",
          reported_symptoms: ["emergency"],
          recovery_status: "none",
        },
        gif: { should_show: false, category: "none", search_query: "", reason: "Emergency suppressed", confidence: 1.0 },
        safety: { is_medical: true, is_emergency: true, requires_professional_response: true },
        analysis: {
          detectedCondition: "Emergency Medical Triage",
          duration: "Immediate",
          severity: "Urgent",
          careStream: "Immediate Hospital Emergency Care",
          prepTip: "Please go to the nearest emergency room without delay.",
          readyToBook: false,
        },
      });
    }

    // 0b. Zero-Tolerance Profanity & Conduct Boundary
    if (isProfaneMessage(message)) {
      return NextResponse.json({
        reply:
          "I am here to assist you with medical guidance and appointments in a respectful and safe environment. Please refrain from using offensive or abusive language. How can I assist you with your health concerns or Dr. Pratima's clinic today?",
        language: "en",
        intent: "profanity_boundary",
        emotion: "neutral",
        sentiment: "neutral",
        conversation_topic: "conduct_boundary",
        context_update: {
          current_topic: "general",
          current_emotion: "neutral",
          reported_symptoms: existingContext?.reportedSymptoms || [],
          recovery_status: "none",
        },
        gif: { should_show: false, category: "none", search_query: "", reason: "Profanity strictly suppressed", confidence: 1.0 },
        safety: { is_medical: false, is_emergency: false, requires_professional_response: false },
        analysis: {
          detectedCondition: "General Consultation",
          duration: "Standard",
          severity: "Standard",
          careStream: "General Practice",
          prepTip: "Please maintain respectful communication.",
          readyToBook: false,
        },
      });
    }

    // 1. RAG Knowledge Retrieval & Conversation Summary
    const ragContext = formatRetrievedKnowledgeForPrompt(message);
    const summary = buildConversationSummary(conversationHistory);
    const summaryContext = formatSummaryForPrompt(summary);

    const systemPrompt = buildEnterpriseSystemPrompt(existingContext, ragContext, summaryContext);

    const messages: GroqMessage[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10),
      { role: "user", content: message },
    ];

    let groqRawData: any = null;
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      try {
        const groqResult = await callGroqChat(messages, {
          temperature: 0.3,
          maxTokens: 1024,
          enableTools: true,
        });

        if (groqResult.content) {
          try {
            groqRawData = JSON.parse(groqResult.content);
          } catch {
            groqRawData = { reply: groqResult.content };
          }
        }
      } catch (groqErr) {
        console.warn("Groq API call exception, using clinical fallback engine:", groqErr);
      }
    } else {
      console.warn("GROQ_API_KEY is not configured, running on built-in clinical fallback engine.");
    }

    // 2. Server-side validation, sanitization & safety guard
    const sanitizedResponse = validateAndSanitizeGroqResponse(
      groqRawData,
      message,
      existingContext,
      conversationHistory
    );

    // 3. Persist to long-term Firestore memory if user is signed in
    if (userId && conversationId) {
      persistMessageToFirestore(userId, conversationId, {
        role: "user",
        content: message,
      }).catch(() => {});
      persistMessageToFirestore(userId, conversationId, {
        role: "assistant",
        content: sanitizedResponse.reply,
        metadata: {
          symptoms: sanitizedResponse.context_update.reported_symptoms,
          isEmergency: sanitizedResponse.safety.is_emergency,
        },
      }).catch(() => {});
    }

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
