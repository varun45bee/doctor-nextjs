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

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {
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

  return NextResponse.json({
    success: true,
  });
}