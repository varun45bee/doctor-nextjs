import { NextRequest, NextResponse } from "next/server";
import { disconnectDoctorGoogle } from "@/lib/services/google-calendar";
import { authenticateDoctorRequest } from "@/lib/security/api-auth";
import { logAuditEvent } from "@/lib/services/audit-service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const doctor = await authenticateDoctorRequest(req);
    const body = await req.json().catch(() => ({}));
    const doctorId = body.doctorId || "default_doctor";

    await disconnectDoctorGoogle(doctorId);

    await logAuditEvent({
      action: "GOOGLE_CALENDAR_DISCONNECTED",
      entityType: "integration",
      entityId: `google_${doctorId}`,
      actor: {
        type: "doctor",
        email: doctor.email,
        id: doctor.uid,
      },
      details: { doctorId },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Google Calendar disconnected successfully.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Disconnect failed";
    const status = message.includes("UNAUTHORIZED")
      ? 401
      : message.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
