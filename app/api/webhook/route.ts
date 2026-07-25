import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  console.log("Webhook verification request:", {
    mode,
    token,
    challenge,
    expectedToken: process.env.VERIFY_TOKEN,
  });

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return new Response(challenge ?? "", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return NextResponse.json(
    {
      mode,
      token,
      challenge,
      expectedToken: process.env.VERIFY_TOKEN,
      error: "Verification failed",
    },
    { status: 403 }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("Incoming WhatsApp Webhook");
  console.log(JSON.stringify(body, null, 2));

  try {
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    // Webhook also fires for status updates (delivered/read) — ignore those
    if (!message) {
      console.log("No message object found (likely a status update). Skipping.");
      return NextResponse.json({ success: true });
    }

    const from = message.from; // sender's phone number
    const text = message.text?.body;

    if (!text) {
      console.log("No text body found (non-text message type). Skipping.");
      return NextResponse.json({ success: true });
    }

    console.log(`Message from ${from}: ${text}`);

    // 1. Get a reply from Gemini
    const geminiReply = await getGeminiReply(text);

    // 2. Send the reply back via WhatsApp
    await sendWhatsAppMessage(from, geminiReply);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Still return 200 so Meta doesn't retry aggressively
    return NextResponse.json({ success: false, error: String(error) });
  }
}

async function getGeminiReply(userMessage: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userMessage }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Gemini API error:", data);
    return "Sorry, I couldn't process that right now.";
  }

  const reply =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Sorry, I didn't understand that.";

  return reply;
}

async function sendWhatsAppMessage(to: string, text: string) {
  const response = await fetch(
    `https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("WhatsApp send error:", data);
  } else {
    console.log("Reply sent:", data);
  }
}