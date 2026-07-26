import { NextRequest, NextResponse } from "next/server";
import {
  buildPatientStatusEmailSubject,
  buildPatientStatusMessage,
  buildWhatsAppMessage,
} from "@/lib/notifications/patient-message";
import { sendStatusEmail } from "@/lib/notifications/send-email";
import { sendWhatsAppMessage } from "@/lib/notifications/send-whatsapp";
import type { AppointmentStatus } from "@/lib/types/appointment";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      status,
    } = body as {
      patientName: string;
      patientEmail?: string;
      patientPhone?: string;
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
    const phone = patientPhone?.trim();

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Patient has no email or phone number on file" },
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

    const results: {
      email?: { success: boolean; error?: string };
      whatsapp?: { success: boolean; error?: unknown };
    } = {};

    if (email) {
      results.email = await sendStatusEmail(email, subject, message);
    }

    if (phone) {
      const whatsappText = buildWhatsAppMessage({
        patientName,
        appointmentDate,
        appointmentTime,
        status,
      });
      results.whatsapp = await sendWhatsAppMessage(phone, whatsappText);
    }

    const emailOk = !email || results.email?.success;
    const whatsappOk = !phone || results.whatsapp?.success;

    if (emailOk && whatsappOk) {
      return NextResponse.json({ success: true, results });
    }

    return NextResponse.json(
      {
        error: "One or more notifications failed",
        results,
      },
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
