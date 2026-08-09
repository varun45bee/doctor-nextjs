import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fetchAvailabilitySettings, fetchBookedSlotsForDate } from "@/lib/firestore/availability";

const PRIVATE_KEY = process.env.WHATSAPP_FLOW_PRIVATE_KEY!
  .replace(/\\n/g, "\n")
  .replace(/\r\n/g, "\n")
  .trim();

const CONDITIONS = [
  { id: "pcod", title: "PCOD / PCOS" },
  { id: "thyroid", title: "Thyroid Disorder" },
  { id: "menopause", title: "Menopause" },
  { id: "child_immunity", title: "Child Immunity" },
  { id: "adhd", title: "ADHD / Behavioral" },
  { id: "allergies", title: "Allergies" },
  { id: "arthritis", title: "Arthritis" },
  { id: "migraines", title: "Migraines" },
  { id: "skin", title: "Skin Disorders" },
  { id: "digestive", title: "Digestive Issues" },
  { id: "anxiety", title: "Anxiety / Stress" },
  { id: "other", title: "Other" },
];

function decryptRequest(body: any) {
  const { encrypted_aes_key, encrypted_flow_data, initial_vector } = body;
  const aesKey = crypto.privateDecrypt(
    { key: PRIVATE_KEY, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    Buffer.from(encrypted_aes_key, "base64")
  );
  const flowDataBuffer = Buffer.from(encrypted_flow_data, "base64");
  const iv = Buffer.from(initial_vector, "base64");
  const tag = flowDataBuffer.subarray(flowDataBuffer.length - 16);
  const encrypted = flowDataBuffer.subarray(0, flowDataBuffer.length - 16);

  const decipher = crypto.createDecipheriv("aes-128-gcm", aesKey, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return { decryptedBody: JSON.parse(decrypted.toString("utf-8")), aesKey, iv };
}

function encryptResponse(response: object, aesKey: Buffer, iv: Buffer) {
  const flippedIv = Buffer.from(iv.map((b) => ~b));
  const cipher = crypto.createCipheriv("aes-128-gcm", aesKey, flippedIv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(response), "utf-8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([encrypted, tag]).toString("base64");
}

function formatSlotLabel(slot: string) {
  const [h, m] = slot.split(":");
  const hours = parseInt(h, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// Next 21 din me se sirf wo dates jo doctor ke weeklyDays me aate hain
async function getAvailableDates() {
  const availability = await fetchAvailabilitySettings();
  const dates: { id: string; title: string }[] = [];
  const today = new Date();

  for (let i = 1; i <= 21 && dates.length < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.getDay();

    if (availability.weeklyDays.includes(dayOfWeek)) {
      const dateStr = d.toISOString().split("T")[0];
      dates.push({ id: dateStr, title: formatDateLabel(dateStr) });
    }
  }
  return dates;
}

export async function POST(req: NextRequest) {
  try {
    console.log("🔥 FLOW ENDPOINT HIT");

    const body = await req.json();

    console.log("🔐 ENCRYPTED REQUEST RECEIVED");
    console.log("Has AES key:", !!body.encrypted_aes_key);
    console.log("Has flow data:", !!body.encrypted_flow_data);
    console.log("Has IV:", !!body.initial_vector);

    const { decryptedBody, aesKey, iv } = decryptRequest(body);

    console.log(
      "✅ DECRYPTED BODY:",
      JSON.stringify(decryptedBody)
    );

    // 1. PING
    if (decryptedBody.action === "ping") {
      console.log("🏥 PING REQUEST");

      const response = encryptResponse(
        {
          data: {
            status: "active",
          },
        },
        aesKey,
        iv
      );

      console.log("📤 PING RESPONSE ENCRYPTED");

      return new NextResponse(response, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // 2. INIT
    if (decryptedBody.action === "INIT") {
      console.log("🚀 INIT REQUEST");

      const dates = await getAvailableDates();

      const responsePayload = {
        version: "3.0",
        screen: "APPOINTMENT",
        data: {
          condition: CONDITIONS,
          date: dates,
          is_date_enabled: true,
          time: [],
          is_time_enabled: false,
        },
      };

      console.log(
        "📤 INIT RESPONSE:",
        JSON.stringify(responsePayload)
      );

      const response = encryptResponse(
        responsePayload,
        aesKey,
        iv
      );

      return new NextResponse(response, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Date selected
    const { data } = decryptedBody;

    if (data?.trigger === "date_selected") {
      console.log("� DATE SELECTED:", data.date);

      const dateStr = data.date;

      const [availability, booked] = await Promise.all([
        fetchAvailabilitySettings(),
        fetchBookedSlotsForDate(dateStr),
      ]);

      let timeSlots = availability.slots
        .filter((slot) => !booked.includes(slot))
        .map((slot) => ({
          id: slot,
          title: formatSlotLabel(slot),
        }));

      if (timeSlots.length === 0) {
        timeSlots = [
          {
            id: "none",
            title: "No slots available",
          },
        ];
      }

      const responsePayload = {
        version: "3.0",
        screen: "APPOINTMENT",
        data: {
          condition: CONDITIONS,
          date: await getAvailableDates(),
          is_date_enabled: true,
          time: timeSlots,
          is_time_enabled: true,
        },
      };

      const response = encryptResponse(
        responsePayload,
        aesKey,
        iv
      );

      return new NextResponse(response, {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    console.log(
      "⚠️ UNKNOWN ACTION:",
      decryptedBody.action
    );

    const response = encryptResponse(
      {
        data: {
          status: "active",
        },
      },
      aesKey,
      iv
    );

    return new NextResponse(response, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("❌ FLOW ENDPOINT ERROR:", error);

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
