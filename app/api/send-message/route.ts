import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Use POST to send WhatsApp message" });
}

export async function POST() {
  console.log("PHONE_NUMBER_ID:", process.env.PHONE_NUMBER_ID);
console.log("ACCESS TOKEN EXISTS:", !!process.env.WHATSAPP_ACCESS_TOKEN);
  const response = await fetch(
    `https://graph.facebook.com/v25.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: "918446104790", // replace with your test number
        type: "text",
        text: {
          body: "Hello from my AI assistant 🚀",
        },
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json(data);
}