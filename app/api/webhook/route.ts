import { NextRequest, NextResponse } from "next/server";

const DOCTOR_NOTIFY_NUMBER = "919359875511";

const SYSTEM_PROMPT = `You are the official WhatsApp assistant for Dr. Pratima Agale's Homeopathy Clinic.

## VERIFIED FACTS (use ONLY these — never invent alternatives)
- Clinic booking/contact number: +91 93598 75511
- Official website: https://www.pratimaagale.in/
- You are an AI assistant, not Dr. Agale herself — always be clear about this if asked.

## CRITICAL RULES
1. NEVER invent phone numbers, addresses, timings, prices, or website links. If you don't have a fact, direct the user to call +91 93598 75511 or visit https://www.pratimaagale.in/ instead of guessing.
2. NEVER diagnose, prescribe remedies, or give specific medical/treatment advice. Discuss general homeopathy concepts only, and steer toward booking a real consultation for anything personal or symptom-related.
3. For appointment booking: confirm you've noted their request and that the clinic will follow up to confirm timing — you don't book appointments directly, but their request has been forwarded.
4. If a user describes a medical emergency (severe symptoms, chest pain, breathing difficulty, suicidal thoughts, etc.), immediately tell them to seek emergency medical care or call local emergency services.
5. Keep replies SHORT for WhatsApp — 2-4 sentences max unless asked for detail.
6. Tone: warm, respectful, reassuring — like a caring clinic receptionist.
7. Never mention you are built on Groq, Llama, or any underlying AI provider/model.`;

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
    { mode, token, challenge, expectedToken: process.env.VERIFY_TOKEN, error: "Verification failed" },
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

    const contactName =
      body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name ?? "Unknown";

    // Check if this message is a booking request
    const booking = await detectBookingIntent(text);
    if (booking.isBooking) {
      console.log("Booking intent detected:", booking.summary);
      await notifyDoctor(from, contactName, booking.summary);
    }

    // Generate and send the AI reply to the patient
    const aiReply = await getAIReply(text);
    await sendWhatsAppMessage(from, aiReply);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ success: false, error: String(error) });
  }
}

async function detectBookingIntent(
  userMessage: string
): Promise<{ isBooking: boolean; summary: string }> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Analyze if this WhatsApp message is a request to book/schedule an appointment with the doctor.
Respond ONLY with valid JSON, no other text:
{"isBooking": true or false, "summary": "brief one-line summary, e.g. 'wants morning appointment', or empty string if not a booking"}`,
        },
        { role: "user", content: userMessage },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    }),
  });

  const data = await response.json();
  try {
    const parsed = JSON.parse(data?.choices?.[0]?.message?.content ?? "{}");
    return { isBooking: !!parsed.isBooking, summary: parsed.summary ?? "" };
  } catch {
    return { isBooking: false, summary: "" };
  }
}

async function notifyDoctor(patientNumber: string, patientName: string, summary: string) {
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
        to: DOCTOR_NOTIFY_NUMBER,
        type: "template",
        template: {
          name: "appointment_notification",
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: patientName },
                { type: "text", text: patientNumber },
                { type: "text", text: summary },
              ],
            },
          ],
        },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.error("WhatsApp template send error:", data);
  } else {
    console.log("Doctor notified via template:", data);
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
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 300,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq API error:", data);
    return "Sorry, I'm having trouble responding right now. Please call us directly at +91 93598 75511.";
  }

  return (
    data?.choices?.[0]?.message?.content ??
    "Sorry, I didn't quite understand. You can reach the clinic at +91 93598 75511."
  );
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