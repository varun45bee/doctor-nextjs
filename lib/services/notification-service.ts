import { getAdminDb } from "@/lib/firebase-admin";
import type { NotificationJob } from "@/lib/types/appointment";
import {
  buildConfirmationEmail,
  buildCancellationEmail,
  buildRescheduledEmail,
  buildDoctorNotificationEmail,
  buildWhatsAppTextMessage,
  EmailTemplateParams,
} from "@/lib/notifications/templates";
import { getAppBaseUrl } from "@/lib/services/google-calendar";

export async function sendEmailWithBrevo(
  to: string,
  subject: string,
  htmlContent: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM?.trim() || "clinic@pratimaagale.in";
  const fromName = process.env.EMAIL_FROM_NAME?.trim() || "Dr. Pratima Agale Clinic";

  if (!apiKey) {
    console.warn("BREVO_API_KEY is not configured; email sending skipped.");
    return { success: false, error: "BREVO_API_KEY not configured" };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: fromName, email: from },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("Brevo API error:", data);
      return {
        success: false,
        error: data?.message || data?.code || `HTTP ${res.status}`,
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    console.error("Brevo fetch error:", err);
    return { success: false, error: message };
  }
}

export async function sendWhatsAppViaCloud(
  toPhone: string,
  bodyText: string
): Promise<{ success: boolean; error?: string }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    console.warn("WhatsApp credentials not set; WhatsApp sending skipped.");
    return { success: false, error: "WhatsApp credentials not set" };
  }

  // Clean phone number: digits only
  const cleaned = toPhone.replace(/\D/g, "");
  const formattedPhone = cleaned.length === 10 ? `91${cleaned}` : cleaned;

  try {
    const res = await fetch(`https://graph.facebook.com/v23.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: formattedPhone,
        type: "text",
        text: { body: bodyText },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("WhatsApp Cloud API error:", data);
      return {
        success: false,
        error: data?.error?.message || `HTTP ${res.status}`,
      };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error";
    console.error("WhatsApp Cloud fetch error:", err);
    return { success: false, error: message };
  }
}

/**
 * Enqueues a notification job in the Firestore `notificationJobs` collection.
 */
export async function enqueueNotificationJob(
  job: Omit<NotificationJob, "id" | "status" | "retryCount" | "maxRetries" | "nextRetryAt" | "createdAt">
): Promise<string> {
  const db = getAdminDb();
  const now = new Date();
  const docRef = db.collection("notificationJobs").doc();

  const record: NotificationJob = {
    ...job,
    id: docRef.id,
    status: "pending",
    retryCount: 0,
    maxRetries: 3,
    nextRetryAt: now.toISOString(),
    createdAt: now.toISOString(),
  };

  await docRef.set(record);
  return docRef.id;
}

/**
 * Processes a single notification job and updates Firestore.
 */
export async function executeNotificationJob(
  job: NotificationJob
): Promise<{ emailSent: boolean; whatsappSent: boolean; errors: string[] }> {
  const db = getAdminDb();
  const errors: string[] = [];
  let emailSent = false;
  let whatsappSent = false;

  const tplParams: EmailTemplateParams = {
    patientName: job.patientName,
    appointmentDate: job.appointmentDate,
    appointmentTime: job.appointmentTime,
    consultationType: job.consultationType,
    googleMeetUrl: job.googleMeetUrl,
    appointmentId: job.appointmentId,
    baseUrl: getAppBaseUrl(),
  };

  // 1. Send Email if requested and available
  if ((job.channel === "email" || job.channel === "both") && job.patientEmail) {
    let emailPayload: { subject: string; html: string };

    if (job.type === "booking_confirmed") {
      emailPayload = buildConfirmationEmail(tplParams);
    } else if (job.type === "booking_cancelled") {
      emailPayload = buildCancellationEmail(tplParams);
    } else if (job.type === "booking_rescheduled") {
      emailPayload = buildRescheduledEmail(tplParams);
    } else {
      emailPayload = buildConfirmationEmail(tplParams);
    }

    const emailRes = await sendEmailWithBrevo(
      job.patientEmail,
      emailPayload.subject,
      emailPayload.html
    );

    if (emailRes.success) {
      emailSent = true;
    } else {
      errors.push(`Email error: ${emailRes.error}`);
    }

    // Also notify doctor on booking confirmation
    if (job.type === "booking_confirmed") {
      const doctorEmail =
        process.env.NEXT_PUBLIC_ALLOWED_DOCTOR_EMAIL?.split(",")[0]?.trim();
      if (doctorEmail) {
        const docTpl = buildDoctorNotificationEmail(tplParams);
        await sendEmailWithBrevo(doctorEmail, docTpl.subject, docTpl.html).catch(
          () => {}
        );
      }
    }
  }

  // 2. Send WhatsApp if requested and phone available
  if ((job.channel === "whatsapp" || job.channel === "both") && job.patientPhone) {
    const waType =
      job.type === "booking_confirmed"
        ? "confirmed"
        : job.type === "booking_cancelled"
        ? "cancelled"
        : job.type === "booking_rescheduled"
        ? "rescheduled"
        : "reminder";

    const waText = buildWhatsAppTextMessage(waType, tplParams);
    const waRes = await sendWhatsAppViaCloud(job.patientPhone, waText);

    if (waRes.success) {
      whatsappSent = true;
    } else {
      errors.push(`WhatsApp error: ${waRes.error}`);
    }
  }

  // Update appointment notificationStatus if appointmentId present
  if (job.appointmentId) {
    const apptUpdate: Record<string, unknown> = {};
    if (job.patientEmail) {
      apptUpdate["notificationStatus.email"] = emailSent ? "sent" : "failed";
      if (emailSent) {
        apptUpdate["notificationStatus.emailSentAt"] = new Date().toISOString();
      }
    }
    if (job.patientPhone) {
      apptUpdate["notificationStatus.whatsapp"] = whatsappSent ? "sent" : "failed";
      if (whatsappSent) {
        apptUpdate["notificationStatus.whatsappSentAt"] = new Date().toISOString();
      }
    }

    await db
      .collection("appointments")
      .doc(job.appointmentId)
      .update(apptUpdate)
      .catch((err) => console.warn("Failed to update appointment notification status:", err));
  }

  return { emailSent, whatsappSent, errors };
}

/**
 * Worker function to process pending or retryable notification jobs.
 */
export async function processNotificationJobsWorker(limit = 10): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
}> {
  const db = getAdminDb();
  const now = new Date();

  const snapshot = await db
    .collection("notificationJobs")
    .where("status", "in", ["pending", "processing"])
    .where("nextRetryAt", "<=", now.toISOString())
    .limit(limit)
    .get();

  let processed = 0;
  let succeeded = 0;
  let failed = 0;

  for (const doc of snapshot.docs) {
    const job = doc.data() as NotificationJob;
    processed++;

    // Mark processing
    await doc.ref.update({ status: "processing" });

    try {
      const res = await executeNotificationJob(job);
      const isComplete =
        (job.channel === "email" && res.emailSent) ||
        (job.channel === "whatsapp" && res.whatsappSent) ||
        (job.channel === "both" && (res.emailSent || res.whatsappSent));

      if (isComplete) {
        succeeded++;
        await doc.ref.update({
          status: "completed",
          completedAt: new Date().toISOString(),
          lastError: res.errors.length ? res.errors.join("; ") : null,
        });
      } else {
        throw new Error(res.errors.join("; ") || "Delivery incomplete");
      }
    } catch (err: unknown) {
      failed++;
      const errorMessage = err instanceof Error ? err.message : String(err);
      const newRetries = (job.retryCount || 0) + 1;

      if (newRetries >= job.maxRetries) {
        await doc.ref.update({
          status: "failed",
          retryCount: newRetries,
          lastError: errorMessage,
        });
      } else {
        // Exponential backoff: 2 min, 8 min, 32 min
        const backoffMs = Math.pow(4, newRetries) * 30 * 1000;
        const nextTime = new Date(Date.now() + backoffMs).toISOString();

        await doc.ref.update({
          status: "pending",
          retryCount: newRetries,
          nextRetryAt: nextTime,
          lastError: errorMessage,
        });
      }
    }
  }

  return { processed, succeeded, failed };
}
