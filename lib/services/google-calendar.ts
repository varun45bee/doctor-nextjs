import { google, calendar_v3 } from "googleapis";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  encryptToken,
  decryptToken,
  signOAuthState,
  verifyOAuthState,
} from "@/lib/security/encryption";
import type { Appointment, DoctorIntegrationGoogle } from "@/lib/types/appointment";
import { getSlotTimestamps, DEFAULT_TIMEZONE } from "@/lib/utils/timezone";

const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/meetings.space.created",
];

export function getAppBaseUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL ||
    process.env.URL;

  if (envUrl) {
    const trimmed = envUrl.trim().replace(/\/$/, "");
    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  }

  return "https://www.pratimaagale.in";
}

export function getGoogleOAuth2Client(redirectUri?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const effectiveRedirectUri =
    redirectUri ||
    process.env.GOOGLE_REDIRECT_URI ||
    `${getAppBaseUrl()}/api/integrations/google/callback`;

  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are required."
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, effectiveRedirectUri);
}

/**
 * Generates the Google OAuth authorization URL for the doctor.
 */
export function generateDoctorGoogleAuthUrl(doctorId: string, doctorEmail?: string): string {
  const oauth2Client = getGoogleOAuth2Client();

  const statePayload = {
    doctorId,
    doctorEmail: doctorEmail?.toLowerCase(),
    nonce: Math.random().toString(36).substring(2),
    timestamp: Date.now(),
  };

  const state = signOAuthState(statePayload);

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: CALENDAR_SCOPES,
    state,
  });
}

/**
 * Handles the OAuth callback, exchanges code for tokens, and stores them encrypted in Firestore.
 */
export async function handleGoogleOAuthCallback(
  code: string,
  state: string
): Promise<{ success: boolean; doctorId: string; email: string }> {
  const verifiedState = verifyOAuthState<{
    doctorId: string;
    doctorEmail?: string;
    timestamp: number;
  }>(state);

  if (!verifiedState || !verifiedState.doctorId) {
    throw new Error("INVALID_STATE: The OAuth state parameter is invalid or has expired.");
  }

  // Reject states older than 15 minutes
  if (Date.now() - verifiedState.timestamp > 15 * 60 * 1000) {
    throw new Error("EXPIRED_STATE: OAuth session timed out. Please try connecting again.");
  }

  const { doctorId } = verifiedState;
  const oauth2Client = getGoogleOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  // Get user info to verify email
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();
  const connectedEmail = userInfo.data.email?.toLowerCase();

  if (!connectedEmail) {
    throw new Error("Could not retrieve email address from connected Google account.");
  }

  if (!tokens.refresh_token) {
    console.warn(
      "Google did not return a new refresh_token. Re-using existing if available or prompt='consent' was needed."
    );
  }

  const db = getAdminDb();
  const docRef = db.collection("integrations").doc(`google_${doctorId}`);
  const existingSnap = await docRef.get();
  const existingData = existingSnap.exists ? existingSnap.data() : null;

  const refreshTokenToStore =
    tokens.refresh_token ||
    (existingData?.encryptedRefreshToken
      ? decryptToken(existingData.encryptedRefreshToken)
      : null);

  if (!refreshTokenToStore) {
    throw new Error(
      "NO_REFRESH_TOKEN: Google did not provide an offline refresh token. Please revoke clinic app permissions in your Google Account security settings and reconnect."
    );
  }

  const encryptedRefreshToken = encryptToken(refreshTokenToStore);
  const encryptedAccessToken = tokens.access_token
    ? encryptToken(tokens.access_token)
    : undefined;

  const integrationData: DoctorIntegrationGoogle = {
    doctorId,
    email: connectedEmail,
    connected: true,
    calendarId: "primary",
    encryptedRefreshToken,
    encryptedAccessToken,
    tokenExpiresAt: tokens.expiry_date || undefined,
    scope: tokens.scope || undefined,
    connectedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await docRef.set(integrationData, { merge: true });

  return { success: true, doctorId, email: connectedEmail };
}

/**
 * Returns an authenticated Google Calendar API client for a doctor.
 */
export async function getDoctorCalendarClient(
  doctorId = "default_doctor"
): Promise<{ calendar: calendar_v3.Calendar; calendarId: string; doctorEmail: string }> {
  const db = getAdminDb();
  const docRef = db.collection("integrations").doc(`google_${doctorId}`);
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error(`NO_INTEGRATION: Google Calendar is not connected for doctor ${doctorId}.`);
  }

  const data = snap.data() as DoctorIntegrationGoogle;
  if (!data.connected || !data.encryptedRefreshToken) {
    throw new Error("INTEGRATION_DISCONNECTED: Google Calendar integration is disconnected.");
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

  // Automatically refresh if expired or about to expire
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
      console.error("Failed to persist refreshed Google tokens:", err);
    }
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  return { calendar, calendarId: data.calendarId || "primary", doctorEmail: data.email };
}

/**
 * Creates an event in Google Calendar with Google Meet video conference link for online consultations.
 */
export async function createGoogleCalendarEvent(
  appointment: Appointment
): Promise<{ eventId: string; meetUrl?: string; calendarId: string }> {
  const { calendar, calendarId, doctorEmail } = await getDoctorCalendarClient(
    appointment.doctorId
  );

  const { startIso, endIso } = getSlotTimestamps(
    appointment.appointmentDate,
    appointment.appointmentTime
  );

  const isOnline = appointment.consultationType === "online";
  const typeLabel = isOnline ? "Online Consultation (Google Meet)" : "In-Person Consultation";

  const summary = `Consultation: ${appointment.patientName} (${typeLabel})`;
  const description = [
    `Dr. Pratima Agale Homeopathy Clinic`,
    `Patient: ${appointment.patientName}`,
    `Phone: ${appointment.patientPhone}`,
    `Type: ${typeLabel}`,
    isOnline
      ? `Online consultation will be held via Google Meet.`
      : `Location: Dr. Pratima Agale Homeopathy Clinic, Kalyan, Maharashtra.`,
    appointment.message ? `Patient note: ${appointment.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const attendees: calendar_v3.Schema$EventAttendee[] = [];
  if (appointment.patientEmail) {
    attendees.push({
      email: appointment.patientEmail,
      displayName: appointment.patientName,
    });
  }
  if (doctorEmail) {
    attendees.push({
      email: doctorEmail,
      displayName: "Dr. Pratima Agale",
      responseStatus: "accepted",
    });
  }

  const requestBody: calendar_v3.Schema$Event = {
    summary,
    description,
    start: {
      dateTime: startIso,
      timeZone: DEFAULT_TIMEZONE,
    },
    end: {
      dateTime: endIso,
      timeZone: DEFAULT_TIMEZONE,
    },
    attendees,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 30 },
      ],
    },
  };

  // Add Google Meet conference request if online
  if (isOnline) {
    requestBody.conferenceData = {
      createRequest: {
        requestId: `meet_${appointment.id}_${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    };
  }

  const res = await calendar.events.insert({
    calendarId,
    requestBody,
    conferenceDataVersion: isOnline ? 1 : 0,
    sendUpdates: "all",
  });

  const eventId = res.data.id;
  if (!eventId) {
    throw new Error("Google Calendar API did not return an event ID.");
  }

  let meetUrl: string | undefined;
  if (isOnline) {
    const entryPoints = res.data.conferenceData?.entryPoints;
    const videoEntry = entryPoints?.find((ep) => ep.entryPointType === "video");
    meetUrl = videoEntry?.uri || res.data.hangoutLink || undefined;

    // If meet link is pending, attempt one bounded retry
    if (!meetUrl && res.data.conferenceData?.createRequest?.status?.statusCode === "pending") {
      try {
        await new Promise((r) => setTimeout(r, 1500));
        const refreshed = await calendar.events.get({
          calendarId,
          eventId,
        });
        const refEp = refreshed.data.conferenceData?.entryPoints?.find(
          (ep) => ep.entryPointType === "video"
        );
        meetUrl = refEp?.uri || refreshed.data.hangoutLink || undefined;
      } catch (retryErr) {
        console.warn("Conference retry failed:", retryErr);
      }
    }
  }

  return {
    eventId,
    meetUrl,
    calendarId,
  };
}

/**
 * Updates an existing calendar event (e.g. on rescheduling).
 */
export async function updateGoogleCalendarEvent(
  appointment: Appointment
): Promise<{ eventId: string; meetUrl?: string }> {
  if (!appointment.googleCalendarEventId) {
    // If no existing calendar event, create one
    const created = await createGoogleCalendarEvent(appointment);
    return { eventId: created.eventId, meetUrl: created.meetUrl };
  }

  const { calendar, calendarId } = await getDoctorCalendarClient(appointment.doctorId);

  const { startIso, endIso } = getSlotTimestamps(
    appointment.appointmentDate,
    appointment.appointmentTime
  );

  const res = await calendar.events.patch({
    calendarId,
    eventId: appointment.googleCalendarEventId,
    requestBody: {
      start: {
        dateTime: startIso,
        timeZone: DEFAULT_TIMEZONE,
      },
      end: {
        dateTime: endIso,
        timeZone: DEFAULT_TIMEZONE,
      },
    },
    sendUpdates: "all",
  });

  const entryPoints = res.data.conferenceData?.entryPoints;
  const videoEntry = entryPoints?.find((ep) => ep.entryPointType === "video");
  const meetUrl = videoEntry?.uri || res.data.hangoutLink || appointment.googleMeetUrl;

  return {
    eventId: appointment.googleCalendarEventId,
    meetUrl,
  };
}

/**
 * Deletes or cancels a Google Calendar event.
 */
export async function deleteGoogleCalendarEvent(
  doctorId: string,
  eventId: string,
  calendarId = "primary"
): Promise<void> {
  try {
    const { calendar } = await getDoctorCalendarClient(doctorId);
    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: "all",
    });
  } catch (err) {
    console.warn(`Failed to delete Google Calendar event ${eventId}:`, err);
  }
}

/**
 * Disconnects the doctor's Google Calendar integration.
 */
export async function disconnectDoctorGoogle(doctorId = "default_doctor"): Promise<void> {
  const db = getAdminDb();
  const docRef = db.collection("integrations").doc(`google_${doctorId}`);

  const snap = await docRef.get();
  if (snap.exists) {
    const data = snap.data() as DoctorIntegrationGoogle;
    if (data.encryptedRefreshToken) {
      try {
        const token = decryptToken(data.encryptedRefreshToken);
        const oauth2Client = getGoogleOAuth2Client();
        await oauth2Client.revokeToken(token);
      } catch (err) {
        console.warn("Could not revoke token with Google:", err);
      }
    }
  }

  await docRef.set(
    {
      connected: false,
      encryptedRefreshToken: "",
      encryptedAccessToken: "",
      disconnectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Fetches Google Calendar connection status for the doctor dashboard.
 */
export async function getDoctorGoogleStatus(
  doctorId = "default_doctor"
): Promise<{
  connected: boolean;
  email?: string;
  connectedAt?: string;
  lastSyncError?: string;
}> {
  const db = getAdminDb();
  const docRef = db.collection("integrations").doc(`google_${doctorId}`);
  const snap = await docRef.get();

  if (!snap.exists) {
    return { connected: false };
  }

  const data = snap.data() as DoctorIntegrationGoogle;
  return {
    connected: !!data.connected && !!data.encryptedRefreshToken,
    email: data.email,
    connectedAt: data.connectedAt,
    lastSyncError: data.lastSyncError,
  };
}
