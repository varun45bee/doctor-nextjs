import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { normalizePhone } from "@/lib/utils/phone";
import { normalizeAppointment } from "@/lib/types/appointment";

export const dynamic = "force-dynamic";

/**
 * POST /api/appointments/lookup
 * Secure server-mediated appointment lookup by registered patient phone.
 * Prevents client-side database enumeration and respects clinical privacy.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Please enter your registered 10-digit mobile number." },
        { status: 400 }
      );
    }

    const phoneKey = normalizePhone(phone);
    if (!phoneKey || phoneKey.length < 10) {
      return NextResponse.json(
        { success: false, error: "Invalid mobile number format." },
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const lookupSnap = await db.collection("appointment_lookup").doc(phoneKey).get();

    if (!lookupSnap.exists) {
      return NextResponse.json(
        { success: false, error: "No appointment found matching this phone number." },
        { status: 404 }
      );
    }

    const lookupData = lookupSnap.data();
    const appointmentId = lookupData?.appointmentId;

    if (!appointmentId) {
      return NextResponse.json(
        { success: false, error: "No active appointment associated with this number." },
        { status: 404 }
      );
    }

    const apptSnap = await db.collection("appointments").doc(appointmentId).get();
    if (!apptSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Appointment document could not be located." },
        { status: 404 }
      );
    }

    const appointment = normalizeAppointment({
      id: apptSnap.id,
      ...apptSnap.data(),
    });

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lookup failed";
    console.error("POST /api/appointments/lookup error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

