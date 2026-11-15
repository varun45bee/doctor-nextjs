import { NextRequest, NextResponse } from "next/server";
import { processNotificationJobsWorker } from "@/lib/services/notification-service";
import { verifyWorkerSecret, authenticateDoctorRequest } from "@/lib/security/api-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Check authorization: worker secret OR doctor auth
  let authorized = verifyWorkerSecret(req);

  if (!authorized) {
    try {
      await authenticateDoctorRequest(req);
      authorized = true;
    } catch {
      // not authorized
    }
  }

  if (!authorized) {
    return NextResponse.json(
      { error: "UNAUTHORIZED: Invalid worker secret or authorization header." },
      { status: 401 }
    );
  }

  try {
    // 1. Process notification jobs
    const notifResults = await processNotificationJobsWorker(20);

    return NextResponse.json({
      success: true,
      notifications: notifResults,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Job processing failure";
    console.error("Worker processing error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
