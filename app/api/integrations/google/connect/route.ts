import { NextRequest, NextResponse } from "next/server";
import { generateDoctorGoogleAuthUrl } from "@/lib/services/google-calendar";
import { isAllowedDoctorEmail } from "@/lib/doctor-access";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId") || "default_doctor";
    const doctorEmail = req.nextUrl.searchParams.get("email");

    // If an email was passed in query, verify it belongs to the allowed doctor list
    if (doctorEmail && !isAllowedDoctorEmail(doctorEmail)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized doctor email." },
        { status: 403 }
      );
    }

    const authUrl = generateDoctorGoogleAuthUrl(doctorId, doctorEmail || undefined);

    // Redirect doctor to Google consent screen
    return NextResponse.redirect(authUrl);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to initiate Google OAuth";
    console.error("Google connect error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
