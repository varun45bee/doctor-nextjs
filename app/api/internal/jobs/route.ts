import { NextRequest, NextResponse } from "next/server";
import { processNotificationJobsWorker } from "@/lib/services/notification-service";
import { verifyWorkerSecret, authenticateDoctorRequest } from "@/lib/security/api-auth";
import { getAdminDb } from "@/lib/firebase-admin";
import { createGoogleCalendarEvent } from "@/lib/services/google-calendar";
import { normalizeAppointment } from "@/lib/types/appointment";

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

    // 2. Recovery: Attempt to sync any appointments with pending or failed calendar status
    const db = getAdminDb();
    const unsyncedSnap = await db
      .collection("appointments")
      .where("calendarSyncStatus", "==", "failed")
      .where("status", "==", "Confirmed")
      .limit(5)
      .get();

    let calendarRecovered = 0;

    for (const doc of unsyncedSnap.docs) {
      const appt = normalizeAppointment({ id: doc.id, ...doc.data() });
      try {
        const cal = await createGoogleCalendarEvent(appt);
        await doc.ref.update({
          googleCalendarEventId: cal.eventId,
          googleMeetUrl: cal.meetUrl || null,
          calendarSyncStatus: "synced",
          calendarError: null,
          updatedAt: new Date(),
        });
        calendarRecovered++;
      } catch (recoveryErr: unknown) {
        const msg = recoveryErr instanceof Error ? recoveryErr.message : String(recoveryErr);
        await doc.ref.update({
          calendarError: `Retry failed: ${msg}`,
          updatedAt: new Date(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      notifications: notifResults,
      calendarRecovered,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Job processing failure";
    console.error("Worker processing error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
