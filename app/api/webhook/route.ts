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