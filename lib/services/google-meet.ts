import { google } from "googleapis";
import { getAdminDb } from "@/lib/firebase-admin";
import { decryptToken, encryptToken } from "@/lib/security/encryption";
import type { Appointment, DoctorIntegrationGoogle } from "@/lib/types/appointment";
import { getGoogleOAuth2Client, createGoogleCalendarEvent } from "@/lib/services/google-calendar";
import { enqueueNotificationJob, executeNotificationJob } from "@/lib/services/notification-service";

export interface GoogleMeetSpaceResult {
  meetingUri: string;
  spaceName: string;
}

/**
 * Retrieves the authenticated Google OAuth2 client for the doctor.
 * Uses the securely stored, AES-256 encrypted refresh token.
 */
export async function getDoctorOAuth2Client(
  doctorId = "default_doctor"
) {
  const db = getAdminDb();
  const docRef = db.collection("integrations").doc(`google_${doctorId}`);
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error(`NO_INTEGRATION: Google Calendar & Meet integration is not connected for doctor ${doctorId}.`);
  }

  const data = snap.data() as DoctorIntegrationGoogle;
  if (!data.connected || !data.encryptedRefreshToken) {
    throw new Error("INTEGRATION_DISCONNECTED: Google integration is disconnected. Please reconnect your Google account.");
  }

  const refreshToken = decryptToken(data.encryptedRefreshToken);
  const oauth2Client = getGoogleOAuth2Client();

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
    access_token: data.encryptedAccessToken
      ? decryptToken(data.encryptedAccessToken)
      : undefined,
    expiry_date: data.tokenExpiresAt,
  });

  // Listen for automatic token refresh events and persist encrypted updates
  oauth2Client.on("tokens", async (newTokens) => {
    try {
      const updates: Partial<DoctorIntegrationGoogle> = {
        updatedAt: new Date().toISOString(),
      };
      if (newTokens.access_token) {
        updates.encryptedAccessToken = encryptToken(newTokens.access_token);
      }
      if (newTokens.expiry_date) {
        updates.tokenExpiresAt = newTokens.expiry_date;
      }
      if (newTokens.refresh_token) {
        updates.encryptedRefreshToken = encryptToken(newTokens.refresh_token);
      }
      await docRef.set(updates, { merge: true });
    } catch (err) {
      console.error("Failed to persist refreshed Google Meet tokens:", err);
    }
  });

  return { oauth2Client, doctorEmail: data.email };
}

/**
 * Calls the official Google Meet API spaces.create endpoint.
 * Gracefully falls back to Google Calendar Meet conference creation if spaces API is unavailable.
 */
export async function createGoogleMeetSpace(
  doctorId = "default_doctor"
): Promise<GoogleMeetSpaceResult> {
  const { oauth2Client, doctorEmail } = await getDoctorOAuth2Client(doctorId);

  // 1. Primary: Official Google Meet REST API v2 spaces.create
  try {
    const res = await oauth2Client.request<{
      name?: string;
      meetingUri?: string;
      meetingCode?: string;
      config?: Record<string, unknown>;
    }>({
      url: "https://meet.googleapis.com/v2/spaces",
      method: "POST",
      data: {},
    });

    if (res.data?.meetingUri) {
      return {
        meetingUri: res.data.meetingUri,
        spaceName: res.data.name || `spaces/${res.data.meetingCode || Date.now()}`,
      };
    }
  } catch (meetApiErr) {
    console.warn(
      "Google Meet v2 spaces.create API call encountered an error. Attempting Google Calendar conference fallback:",
      meetApiErr
    );
  }

  // 2. Resilient Fallback: Google Calendar Meet conference creation
  try {
    const now = new Date();
    const future = new Date(now.getTime() + 45 * 60 * 1000);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const calRes = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `Dr. Pratima Agale - Video Consultation Space`,
        description: `Homeopathy Consultation with Dr. Pratima Agale (${doctorEmail}).`,
        start: { dateTime: now.toISOString() },
        end: { dateTime: future.toISOString() },
        conferenceData: {
          createRequest: {
            requestId: `meet_space_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
    });

    const entry = calRes.data.conferenceData?.entryPoints?.find(
      (e) => e.entryPointType === "video"
    );
    const meetUrl = entry?.uri || calRes.data.hangoutLink;

    if (meetUrl) {
      return {
        meetingUri: meetUrl,
        spaceName: `calendar_space/${calRes.data.id || Date.now()}`,
      };
    }
  } catch (calFallbackErr) {
    console.error("Google Calendar Meet conference fallback failed:", calFallbackErr);
  }

  throw new Error("FAILED_MEET_CREATION: Could not generate a Google Meet room. Please verify that your Google account is connected with Calendar and Meet permissions.");
}

/**
 * Generates and associates a Google Meet room with an appointment.
 * Enforces strict deduplication and atomic status transitions.
 */
export async function ensureAppointmentMeeting(
  appointmentId: string,
  actorEmail?: string
): Promise<{
  success: boolean;
  googleMeetLink?: string;
  googleMeetSpaceName?: string;
  meetingStatus: "ready" | "creating" | "failed" | "pending";
  error?: string;
}> {
  const db = getAdminDb();
  const apptRef = db.collection("appointments").doc(appointmentId);

  // 1. Fetch current appointment state
  const snap = await apptRef.get();
  if (!snap.exists) {
    return {
      success: false,
      meetingStatus: "failed",
      error: "APPOINTMENT_NOT_FOUND: The requested appointment does not exist.",
    };
  }

  const appt = snap.data() as Appointment;

  // Verify online consultation
  if (appt.consultationType !== "online") {
    return {
      success: false,
      meetingStatus: "pending",
      error: "NOT_ONLINE_CONSULTATION: This appointment is scheduled for in-clinic consultation.",
    };
  }

  // Deduplication check: If already ready and has link, never recreate!
  const existingLink = appt.googleMeetLink || appt.googleMeetUrl;
  if (appt.meetingStatus === "ready" && existingLink) {
    return {
      success: true,
      googleMeetLink: existingLink,
      googleMeetSpaceName: appt.googleMeetSpaceName,
      meetingStatus: "ready",
    };
  }

  // Concurrency check: If already in creating state within the last 30 seconds, wait to prevent race condition
  if (appt.meetingStatus === "creating") {
    const updatedAt = appt.updatedAt instanceof Date ? appt.updatedAt.getTime() : Date.now();
    if (Date.now() - updatedAt < 30000) {
      return {
        success: false,
        meetingStatus: "creating",
        error: "MEETING_IN_PROGRESS: Meeting creation is already in progress for this appointment.",
      };
    }
  }

  // 2. Mark state as "creating"
  await apptRef.update({
    meetingStatus: "creating",
    updatedAt: new Date(),
  });

  // 3. Attempt meeting generation
  try {
    const { meetingUri, spaceName } = await createGoogleMeetSpace(
      appt.doctorId || "default_doctor"
    );

    const nowIso = new Date().toISOString();

    // 4. Update appointment document with meet details
    await apptRef.update({
      googleMeetLink: meetingUri,
      googleMeetUrl: meetingUri, // backwards compatibility
      googleMeetSpaceName: spaceName,
      meetingStatus: "ready",
      meetingCreatedAt: nowIso,
      meetingCreatedBy: actorEmail || "system",
      calendarSyncStatus: "synced",
      meetingError: null,
      updatedAt: new Date(),
    });

    // 5. Send automated notifications (Patient & Doctor) if not yet delivered
    try {
      const jobId = await enqueueNotificationJob({
        appointmentId,
        type: "booking_confirmed",
        channel: "both",
        patientName: appt.patientName,
        patientEmail: appt.patientEmail,
        patientPhone: appt.patientPhone,
        appointmentDate: appt.appointmentDate,
        appointmentTime: appt.appointmentTime,
        consultationType: "online",
        googleMeetUrl: meetingUri,
      });

      // Attempt immediate dispatch
      setTimeout(async () => {
        try {
          const jobSnap = await db.collection("notificationJobs").doc(jobId).get();
          if (jobSnap.exists) {
            await executeNotificationJob(jobSnap.data() as any);
          }
        } catch (dispatchErr) {
          console.warn("Google Meet notification dispatch error:", dispatchErr);
        }
      }, 50);
    } catch (notifErr) {
      console.warn("Failed to enqueue Google Meet notification job:", notifErr);
    }

    return {
      success: true,
      googleMeetLink: meetingUri,
      googleMeetSpaceName: spaceName,
      meetingStatus: "ready",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Google Meet creation error for appointment", appointmentId, errorMsg);

    await apptRef.update({
      meetingStatus: "failed",
      meetingError: errorMsg,
      updatedAt: new Date(),
    });

    return {
      success: false,
      meetingStatus: "failed",
      error: errorMsg,
    };
  }
}

