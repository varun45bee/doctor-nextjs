import { NextRequest, NextResponse } from "next/server";

const BOT_URL = process.env.WHATSAPP_BOT_URL || "http://localhost:3001/send";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(BOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // ✅ Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Bot returned non-JSON:", text);
      return NextResponse.json({ error: "Bot server error" }, { status: 500 });
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("WhatsApp bot error:", err);
    return NextResponse.json({ error: "Failed to connect to bot" }, { status: 500 });
  }
}