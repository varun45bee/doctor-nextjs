import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

/**
 * Validates Meta's SHA-256 signature if APP_SECRET is configured.
 */
function validateMetaSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.APP_SECRET;
  if (!appSecret || !signatureHeader) {
    // If secret not configured in local environment, allow pass-through
    return true;
  }

  const expectedSignature = `sha256=${crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex")}`;

  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader),
    Buffer.from(expectedSignature)
  );
}

/**
 * Meta Webhook verification handshake
 */
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get("hub.mode");
  const token = req.nextUrl.searchParams.get("hub.verify_token");
  const challenge = req.nextUrl.searchParams.get("hub.challenge");

  const expectedToken = process.env.VERIFY_TOKEN;

  if (mode === "subscribe" && token === expectedToken) {
    return new Response(challenge ?? "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json(
    { error: "Webhook verification failed. Invalid verify token." },
    { status: 403 }
  );
}

/**
 * Meta Webhook event receiver for status updates & message deliveries
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-hub-signature-256");

    if (process.env.APP_SECRET && !validateMetaSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody || "{}");

    // Process status updates (e.g. sent, delivered, read, failed)
    const entries = payload.entry || [];
    const db = getAdminDb();

    for (const entry of entries) {
      for (const change of entry.changes || []) {
        const statuses = change.value?.statuses || [];
        for (const st of statuses) {
          const recipientId = st.recipient_id;
          const status = st.status; // "delivered", "read", "failed"

          if (recipientId && status) {
            // Find any recent appointment for this recipient to update delivery status
            try {
              const snapshot = await db
                .collection("appointments")
                .where("patientPhone", "==", recipientId)
                .orderBy("createdAt", "desc")
                .limit(1)
                .get();

              if (!snapshot.empty) {
                const apptDoc = snapshot.docs[0];
                await apptDoc.ref.update({
                  "notificationStatus.whatsapp": status === "failed" ? "failed" : "sent",
                  "notificationStatus.whatsappDelivery": status,
                  "notificationStatus.whatsappDeliveredAt": new Date().toISOString(),
                });
              }
            } catch (err) {
              console.warn("Could not record WhatsApp status in appointment:", err);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, status: "EVENT_RECEIVED" });
  } catch (err: unknown) {
    console.error("WhatsApp webhook error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
