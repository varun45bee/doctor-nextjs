import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { normalizeAppointment } from "@/lib/types/appointment";
import { authenticateDoctorRequest } from "@/lib/security/api-auth";
import { logAuditEvent } from "@/lib/services/audit-service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = req.nextUrl.searchParams.get("token");

    const db = getAdminDb();
    const docSnap = await db.collection("appointments").doc(id).get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    const appointment = normalizeAppointment({
      id: docSnap.id,
      ...docSnap.data(),
    });

    // Check authorization: doctor auth OR valid patient token
    let isAuthorized = false;
    if (token && token === appointment.accessSecret) {
      isAuthorized = true;
    } else {
      try {
        await authenticateDoctorRequest(req);
        isAuthorized = true;
      } catch {
        // Not doctor
      }
    }

    if (!isAuthorized) {
      // If neither, return limited public information (without private phone or accessSecret)
      return NextResponse.json({
        success: true,
        appointment: {
          id: appointment.id,
          patientName: appointment.patientName,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          consultationType: appointment.consultationType,
          status: appointment.status,
          googleMeetUrl: appointment.googleMeetUrl,
        },
      });
    }

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Only doctor can PATCH appointment directly (e.g. status, prescription)
    const doctor = await authenticateDoctorRequest(req);
    const { id } = params;
    const body = await req.json().catch(() => ({}));

    const db = getAdminDb();
    const apptRef = db.collection("appointments").doc(id);
    const snap = await apptRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Appointment not found" },
        { status: 404 }
      );
    }

    const allowedFields = [
      "status",
      "condition",
      "prescription",
      "progressLogs",
      "message",
    ];

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    await apptRef.update(updates);

    await logAuditEvent({
      action: "APPOINTMENT_UPDATED",
      entityType: "appointment",
      entityId: id,
      actor: {
        type: "doctor",
        email: doctor.email,
        id: doctor.uid,
      },
      details: updates,
      timestamp: new Date().toISOString(),
    });

    const updatedSnap = await apptRef.get();
    return NextResponse.json({
      success: true,
      appointment: normalizeAppointment({
        id: updatedSnap.id,
        ...updatedSnap.data(),
      }),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    const status = message.includes("UNAUTHORIZED")
      ? 401
      : message.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
