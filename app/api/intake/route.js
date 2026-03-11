// app/api/intake/route.js

import { callAI, getProviderInfo } from "@/lib/providers";

export async function POST(req) {
  try {
    const body = await req.json();

    let { messages } = body;

    // Ensure messages exists
    if (!messages) {
      return Response.json(
        { error: "messages field is required" },
        { status: 400 }
      );
    }

    // Convert non-array → array
    if (!Array.isArray(messages)) {
      messages = [
        {
          role: "user",
          content: String(messages),
        },
      ];
    }

    // Clean invalid messages
    messages = messages.filter(
      (m) =>
        m &&
        typeof m === "object" &&
        typeof m.content === "string"
    );

    if (messages.length === 0) {
      return Response.json(
        { error: "messages must contain valid messages" },
        { status: 400 }
      );
    }

    const text = await callAI(messages);

    return Response.json({
      success: true,
      text,
      provider: getProviderInfo(),
    });

  } catch (error) {
    console.error("[VitaIntake API Error]", error);

    return Response.json(
      { error: "AI provider error. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    status: "ok",
    provider: getProviderInfo(),
  });
}