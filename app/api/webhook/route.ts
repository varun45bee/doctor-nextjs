import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {
    return new Response(challenge ?? "", { status: 200 });
  }

  return NextResponse.json(
    { error: "Verification failed" },
    { status: 403 }
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("Webhook:", body);

  return NextResponse.json({ success: true });
}
