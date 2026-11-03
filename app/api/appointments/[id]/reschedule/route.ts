import { NextRequest, NextResponse } from "next/server";
import { rescheduleAppointmentBooking } from "@/lib/services/booking-manager";
import { authenticateDoctorRequest } from "@/lib/security/api-auth";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const { newDate, newTime, reason } = body;
    const token = body.token || req.nextUrl.searchParams.get("token");

    if (!newDate || !/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      return NextResponse.json(
        { success: false, error: "Valid newDate (YYYY-MM-DD) is required." },
        { status: 400 }
      );
    }

    if (!newTime || !/^\d{1,2}:\d{2}$/.test(newTime)) {
      return NextResponse.json(
        { success: false, error: "Valid newTime (HH:mm) is required." },
        { status: 400 }
      );
    }

    let actor: { type: "doctor" | "patient" | "admin"; id?: string; email?: string } = {
      type: "patient",
    };

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

    const result = await rescheduleAppointmentBooking({
      appointmentId: id,
      newDate,
      newTime,
      actor: { ...actor, ip },
      reason,
      token,
    });

    return NextResponse.json({
      success: true,
      appointment: result.appointment,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reschedule appointment";
    const status = message.includes("SLOT_ALREADY_BOOKED")
      ? 409
      : message.includes("UNAUTHORIZED")
      ? 401
      : message.includes("not found")
      ? 404
      : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
