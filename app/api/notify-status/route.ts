import { NextRequest, NextResponse } from "next/server";
import {
  buildPatientStatusEmailSubject,
  buildPatientStatusMessage,
} from "@/lib/notifications/patient-message";
import { sendStatusEmail } from "@/lib/notifications/send-email";
import type { AppointmentStatus } from "@/lib/types/appointment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientName,
      patientEmail,
      appointmentDate,
      appointmentTime,
      status,
    } = body as {
      patientName: string;
      patientEmail?: string;
      appointmentDate: string;
      appointmentTime: string;
      status: AppointmentStatus;
    };

    if (!patientName || !status) {
      return NextResponse.json(
        { error: "Missing required fields: patientName, status" },
        { status: 400 }
      );
    }

    const email = patientEmail?.trim();
    if (!email) {
      return NextResponse.json(
        { error: "Patient has no email on file" },
        { status: 400 }
      );
    }

    const message = buildPatientStatusMessage({
      patientName,
      appointmentDate,
      appointmentTime,
      status,
    });
    const subject = buildPatientStatusEmailSubject(status);

    const result = await sendStatusEmail(email, subject, message);
    if (result.success) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: result.error ?? "Could not send email. Check RESEND_API_KEY." },
      { status: 500 }
    );
  } catch (err) {
    console.error("Status notify error:", err);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
