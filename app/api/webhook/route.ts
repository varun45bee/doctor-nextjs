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
      headers: { "Content-Type": "text/plain" },
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

    if (!message) {
      console.log("No message object found (likely a status update). Skipping.");
      return NextResponse.json({ success: true });
    }

    const from = message.from;
    const text = message.text?.body;

    if (!text) {
      console.log("No text body found (non-text message type). Skipping.");
      return NextResponse.json({ success: true });
    }

    console.log(`Message from ${from}: ${text}`);

    const aiReply = await getAIReply(text);
    await sendWhatsAppMessage(from, aiReply);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}

async function getAIReply(userMessage: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful WhatsApp assistant for Dr. Pratima Agale's homeopathy clinic. Keep replies concise, warm, and clear. You are not a substitute for a real medical consultation — encourage booking an appointment for anything requiring diagnosis or treatment.",
        },
        { role: "user", content: userMessage },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq API error:", data);
    return "Sorry, I couldn't process that right now.";
  }

  return data?.choices?.[0]?.message?.content ?? "Sorry, I didn't understand that.";
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