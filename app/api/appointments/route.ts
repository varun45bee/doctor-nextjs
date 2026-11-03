import { NextRequest, NextResponse } from "next/server";
import { createAppointmentBooking } from "@/lib/services/booking-manager";
import { isValidPhone } from "@/lib/phone-validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      consultationType = "online",
      condition,
      age,
      message,
      lang = "en",
      doctorId = "default_doctor",
    } = body;

    // Idempotency key from header or body
    const idempotencyKey =
      req.headers.get("idempotency-key") ||
      req.headers.get("x-idempotency-key") ||
      body.idempotencyKey;

    // Validation
    if (!patientName || typeof patientName !== "string" || patientName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Patient name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (!patientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail.trim())) {
      return NextResponse.json(
        { success: false, error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!patientPhone || !isValidPhone(patientPhone)) {
      return NextResponse.json(
        { success: false, error: "A valid 10-digit mobile number is required." },
        { status: 400 }
      );
    }

    if (!appointmentDate || !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
      return NextResponse.json(
        { success: false, error: "Valid appointment date (YYYY-MM-DD) is required." },
        { status: 400 }
      );
    }

    if (!appointmentTime || !/^\d{1,2}:\d{2}$/.test(appointmentTime)) {
      return NextResponse.json(
        { success: false, error: "Valid appointment time (HH:mm) is required." },
        { status: 400 }
      );
    }

    if (consultationType !== "online" && consultationType !== "in-person") {
      return NextResponse.json(
        { success: false, error: "Consultation type must be 'online' or 'in-person'." },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for") || req.ip || undefined;

    const result = await createAppointmentBooking(
      {
        doctorId,
        patientName,
        patientEmail,
        patientPhone,
        appointmentDate,
        appointmentTime,
        consultationType,
        condition,
        age,
        message,
        lang,
        idempotencyKey,
      },
      ip
    );

    return NextResponse.json(
      {
        success: true,
        isDuplicate: result.isDuplicate,
        appointment: result.appointment,
      },
      { status: result.isDuplicate ? 200 : 201 }
    );
  } catch (err: unknown) {
    const errorStr = err instanceof Error ? err.message : String(err);

    if (errorStr.startsWith("SLOT_ALREADY_BOOKED") || errorStr.startsWith("SLOT_LOCKED")) {
      return NextResponse.json(
        { success: false, error: errorStr.split(": ")[1] || errorStr },
        { status: 409 }
      );
    }

    console.error("Booking error in POST /api/appointments:", err);
    return NextResponse.json(
      { success: false, error: errorStr || "Failed to create appointment." },
      { status: 500 }
    );
  }
}
