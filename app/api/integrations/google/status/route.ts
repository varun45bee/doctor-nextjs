import { NextRequest, NextResponse } from "next/server";
import { getDoctorGoogleStatus } from "@/lib/services/google-calendar";
import { authenticateDoctorRequest } from "@/lib/security/api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Authenticate doctor
    await authenticateDoctorRequest(req);

    const doctorId = req.nextUrl.searchParams.get("doctorId") || "default_doctor";
    const status = await getDoctorGoogleStatus(doctorId);

    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch status";
    const code = message.includes("UNAUTHORIZED")
      ? 401
      : message.includes("FORBIDDEN")
      ? 403
      : 500;
    return NextResponse.json({ success: false, error: message }, { status: code });
  }
}
