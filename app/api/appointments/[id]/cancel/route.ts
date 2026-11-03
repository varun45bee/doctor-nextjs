import { NextRequest, NextResponse } from "next/server";
import { cancelAppointmentBooking } from "@/lib/services/booking-manager";
import { authenticateDoctorRequest } from "@/lib/security/api-auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const reason = body.reason;
    const token = body.token || req.nextUrl.searchParams.get("token");

    let actor: { type: "doctor" | "patient" | "admin"; id?: string; email?: string } = {
      type: "patient",
    };

    // If no patient token, verify if caller is doctor
    if (!token) {
      try {
        const docAuth = await authenticateDoctorRequest(req);
        actor = {
          type: "doctor",
          id: docAuth.uid,
          email: docAuth.email,
        };
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: "UNAUTHORIZED: Patient access token or doctor credentials required.",
          },
          { status: 401 }
        );
      }
    }

    const ip = req.headers.get("x-forwarded-for") || req.ip || undefined;

    const result = await cancelAppointmentBooking({
      appointmentId: id,
      actor: { ...actor, ip },
      reason,
      token,
    });

    return NextResponse.json({
      success: true,
      appointment: result.appointment,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to cancel appointment";
    const status = message.includes("UNAUTHORIZED")
      ? 401
      : message.includes("not found")
      ? 404
      : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
