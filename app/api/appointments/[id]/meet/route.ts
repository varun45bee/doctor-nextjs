import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin";
import { authenticateDoctorRequest, verifyWorkerSecret } from "@/lib/security/api-auth";
import { ensureAppointmentMeeting } from "@/lib/services/google-meet";
import { normalizeAppointment } from "@/lib/types/appointment";
import { logAuditEvent } from "@/lib/services/audit-service";

export const dynamic = "force-dynamic";

/**
 * POST /api/appointments/[id]/meet
 * Generates or retries Google Meet creation for an appointment.
 * Only accessible by authorized clinic doctors or internal recovery workers.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let actorEmail = "system";

    // 1. Verify Doctor Authentication or Worker Secret
    if (verifyWorkerSecret(req)) {
      actorEmail = "internal_worker";
    } else {
      try {
        const doctor = await authenticateDoctorRequest(req);
        actorEmail = doctor.email;
      } catch (authErr) {
        return NextResponse.json(
          {
            success: false,
            error: "UNAUTHORIZED: Only authorized doctors can trigger Google Meet generation.",
          },
          { status: 403 }
        );
      }
    }

    // 2. Execute idempotent meeting creation
    const result = await ensureAppointmentMeeting(id, actorEmail);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          meetingStatus: result.meetingStatus,
        },
        { status: 400 }
      );
    }

    // 3. Log Audit Event
    await logAuditEvent({
      action: "GOOGLE_MEET_GENERATED",
      entityType: "appointment",
      entityId: id,
      timestamp: new Date().toISOString(),
      actor: {
        type: actorEmail === "internal_worker" ? "system" : "doctor",
        email: actorEmail,
      },
      details: {
        googleMeetLink: result.googleMeetLink,
        googleMeetSpaceName: result.googleMeetSpaceName,
        meetingStatus: result.meetingStatus,
      },
    });

    return NextResponse.json({
      success: true,
      googleMeetLink: result.googleMeetLink,
      googleMeetSpaceName: result.googleMeetSpaceName,
      meetingStatus: result.meetingStatus,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("POST /api/appointments/[id]/meet error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * GET /api/appointments/[id]/meet
 * Returns Google Meet status and join link for authorized patient or doctor.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = req.nextUrl.searchParams.get("token");

    const db = getAdminDb();
    const snap = await db.collection("appointments").doc(id).get();

    if (!snap.exists) {
      return NextResponse.json(
        { success: false, error: "Appointment not found." },
        { status: 404 }
      );
    }

    const appt = normalizeAppointment({ id: snap.id, ...snap.data() });

    // Authorization check: Patient ownership via token/auth OR Doctor role
    let isAuthorized = false;

    // Check token (self-service patient access token)
    if (token && token === appt.accessSecret) {
      isAuthorized = true;
    }

    // Check doctor auth header
    if (!isAuthorized) {
      try {
        await authenticateDoctorRequest(req);
        isAuthorized = true;
      } catch {
        // Not doctor
      }
    }

    // Check Firebase user token if patient is logged in
    if (!isAuthorized) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        try {
          const idToken = authHeader.substring(7).trim();
          const auth = getAdminAuth();
          const decoded = await auth.verifyIdToken(idToken);
          if (
            (appt.patientId && decoded.uid === appt.patientId) ||
            (appt.patientEmail && decoded.email?.toLowerCase() === appt.patientEmail.toLowerCase())
          ) {
            isAuthorized = true;
          }
        } catch {
          // Token verification failed
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED: You do not have permission to view this meeting link." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      appointmentId: appt.id,
      patientName: appt.patientName,
      appointmentDate: appt.appointmentDate,
      appointmentTime: appt.appointmentTime,
      consultationType: appt.consultationType,
      meetingStatus: appt.meetingStatus || (appt.googleMeetLink || appt.googleMeetUrl ? "ready" : "pending"),
      googleMeetLink: appt.googleMeetLink || appt.googleMeetUrl,
      googleMeetSpaceName: appt.googleMeetSpaceName,
      meetingCreatedAt: appt.meetingCreatedAt,
      meetingCreatedBy: appt.meetingCreatedBy,
      meetingError: appt.meetingError,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

