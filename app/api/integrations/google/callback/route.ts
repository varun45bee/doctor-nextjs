import { NextRequest, NextResponse } from "next/server";
import { handleGoogleOAuthCallback, getAppBaseUrl } from "@/lib/services/google-calendar";
import { logAuditEvent } from "@/lib/services/audit-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const baseUrl = getAppBaseUrl();
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    console.error("Google OAuth error in callback:", error);
    return NextResponse.redirect(
      `${baseUrl}/doctor?calendar_error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${baseUrl}/doctor?calendar_error=missing_code_or_state`
    );
  }

  try {
    const result = await handleGoogleOAuthCallback(code, state);

    await logAuditEvent({
      action: "GOOGLE_CALENDAR_CONNECTED",
      entityType: "integration",
      entityId: `google_${result.doctorId}`,
      actor: {
        type: "doctor",
        email: result.email,
      },
      details: { email: result.email },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.redirect(
      `${baseUrl}/doctor?calendar=connected&email=${encodeURIComponent(result.email)}`
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OAuth connection failed";
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(
      `${baseUrl}/doctor?calendar_error=${encodeURIComponent(message)}`
    );
  }
}
