import type { ConsultationType } from "../types/appointment.ts";
import { formatInKolkata } from "../utils/timezone.ts";

export interface EmailTemplateParams {
  patientName: string;
  doctorName?: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: ConsultationType;
  googleMeetUrl?: string;
  clinicAddress?: string;
  cancellationReason?: string;
  appointmentId?: string;
  accessSecret?: string;
  baseUrl?: string;
}

const CLINIC_DEFAULT_ADDRESS =
  "Dr. Pratima Agale Homeopathy Clinic, Near Station, Kalyan, Maharashtra 421301";
const CLINIC_PHONE = "+91 93598 75511";
const CLINIC_SITE = "https://www.pratimaagale.in";

function baseEmailWrapper(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dr. Pratima Agale Homeopathy Clinic</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748;">
  <span style="display:none;font-size:0;line-height:0;max-height:0;mso-hide:all;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f4; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; max-width: 600px; width: 100%;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#2f4a3d; padding: 32px 40px; text-align:center;">
              <div style="color:#ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; font-family: Georgia, serif;">
                Dr. Pratima Agale
              </div>
              <div style="color:#d1e2d8; font-size: 13px; margin-top: 6px; letter-spacing: 0.3px;">
                Classical Homeopathic Practice & Holistic Health
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fcfdfc; padding: 24px 40px 32px; border-top: 1px solid #edf2f7; text-align:center;">
              <div style="font-size: 13px; color: #718096; line-height: 1.6;">
                <strong style="color:#2f4a3d;">Dr. Pratima Agale Homeopathy Clinic</strong><br>
                📞 ${CLINIC_PHONE} &nbsp;|&nbsp; 🌐 <a href="${CLINIC_SITE}" style="color:#3f6b56; text-decoration:none; font-weight: 500;">www.pratimaagale.in</a>
              </div>
              <div style="font-size: 11px; color: #a0aec0; margin-top: 16px; line-height: 1.5;">
                This is an automated notification regarding your clinical appointment. For questions or urgent schedule changes, please call the clinic directly.
              </div>
              <div style="font-size: 11px; color: #cbd5e0; margin-top: 8px;">
                © ${new Date().getFullYear()} Dr. Pratima Agale. All rights reserved.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildConfirmationEmail(p: EmailTemplateParams): { subject: string; html: string } {
  const isOnline = p.consultationType === "online";
  const typeText = isOnline ? "Online Consultation (Google Meet)" : "In-Person Consultation";
  const dateFormatted = formatInKolkata(`${p.appointmentDate}T00:00:00+05:30`, {
    dateStyle: "full",
  });

  const content = `
    <h2 style="color: #2f4a3d; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; font-family: Georgia, serif;">
      Appointment Confirmed ✅
    </h2>
    <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px;">
      Dear <strong>${p.patientName}</strong>,<br>
      Your appointment with <strong>${p.doctorName || "Dr. Pratima Agale"}</strong> has been confirmed. Below are your consultation details:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7faf8; border: 1px solid #e6f0ea; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <tr>
        <td style="padding-bottom: 12px; font-size: 14px; color: #718096;">Date:</td>
        <td style="padding-bottom: 12px; font-size: 15px; font-weight: 600; color: #2d3748; text-align: right;">${dateFormatted}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 12px; font-size: 14px; color: #718096;">Time:</td>
        <td style="padding-bottom: 12px; font-size: 15px; font-weight: 600; color: #2d3748; text-align: right;">${p.appointmentTime} (IST)</td>
      </tr>
      <tr>
        <td style="padding-bottom: 12px; font-size: 14px; color: #718096;">Consultation Mode:</td>
        <td style="padding-bottom: 12px; font-size: 14px; font-weight: 600; color: #2f4a3d; text-align: right;">${typeText}</td>
      </tr>
      ${
        isOnline && p.googleMeetUrl
          ? `<tr>
              <td colspan="2" style="padding-top: 12px; border-top: 1px dashed #cbd5e0; text-align: center;">
                <div style="font-size: 13px; color: #4a5568; margin-bottom: 10px;">Google Meet Video Consultation Link:</div>
                <a href="${p.googleMeetUrl}" target="_blank" style="display: inline-block; background-color: #2f4a3d; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
                  Join Google Meet
                </a>
                <div style="font-size: 11px; color: #718096; margin-top: 8px; word-break: break-all;">${p.googleMeetUrl}</div>
              </td>
            </tr>`
          : `<tr>
              <td style="padding-top: 12px; border-top: 1px dashed #cbd5e0; font-size: 14px; color: #718096;">Clinic Address:</td>
              <td style="padding-top: 12px; border-top: 1px dashed #cbd5e0; font-size: 13px; color: #2d3748; text-align: right;">${p.clinicAddress || CLINIC_DEFAULT_ADDRESS}</td>
            </tr>`
      }
    </table>

    <div style="background-color: #eef5f1; border-left: 4px solid #3f6b56; padding: 14px 18px; border-radius: 4px; font-size: 13px; line-height: 1.6; color: #2f4a3d; margin-bottom: 24px;">
      <strong>Consultation Guidelines:</strong><br>
      • Please be ready 5 minutes before your scheduled appointment time.<br>
      • Avoid strong foods (raw onion, garlic, coffee) 30 minutes before taking homeopathic remedies.<br>
      • Keep any recent lab reports or medical history summaries handy for the doctor.
    </div>

    ${
      p.appointmentId && p.accessSecret
        ? `<p style="font-size: 13px; color: #718096; text-align: center; margin-top: 20px;">
            Need to change your plans? You can 
            <a href="${p.baseUrl || CLINIC_SITE}/check-appointment?id=${p.appointmentId}&token=${p.accessSecret}" style="color: #3f6b56; text-decoration: underline;">
              reschedule or cancel your appointment online
            </a>.
          </p>`
        : ""
    }
  `;

  return {
    subject: `Appointment Confirmed — Dr. Pratima Agale (${p.appointmentDate} at ${p.appointmentTime})`,
    html: baseEmailWrapper(content, `Your appointment is confirmed for ${dateFormatted} at ${p.appointmentTime}`),
  };
}

export function buildCancellationEmail(p: EmailTemplateParams): { subject: string; html: string } {
  const content = `
    <h2 style="color: #c53030; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; font-family: Georgia, serif;">
      Appointment Cancelled
    </h2>
    <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 20px;">
      Dear <strong>${p.patientName}</strong>,<br>
      This email is to notify you that your consultation scheduled for <strong>${p.appointmentDate} at ${p.appointmentTime}</strong> has been cancelled.
    </p>

    ${
      p.cancellationReason
        ? `<div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 6px; padding: 14px; font-size: 13px; color: #9b2c2c; margin-bottom: 20px;">
            <strong>Reason:</strong> ${p.cancellationReason}
          </div>`
        : ""
    }

    <p style="font-size: 14px; line-height: 1.6; color: #4a5568; margin-bottom: 24px;">
      If you would like to book a new consultation, you can choose another available slot at any time on our website.
    </p>

    <div style="text-align: center; margin-bottom: 16px;">
      <a href="${p.baseUrl || CLINIC_SITE}" style="display: inline-block; background-color: #2f4a3d; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
        Book a New Appointment
      </a>
    </div>
  `;

  return {
    subject: `Appointment Cancelled — Dr. Pratima Agale`,
    html: baseEmailWrapper(content, `Your appointment on ${p.appointmentDate} has been cancelled.`),
  };
}

export function buildRescheduledEmail(p: EmailTemplateParams): { subject: string; html: string } {
  const isOnline = p.consultationType === "online";
  const typeText = isOnline ? "Online Consultation (Google Meet)" : "In-Person Consultation";

  const content = `
    <h2 style="color: #2f4a3d; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px; font-family: Georgia, serif;">
      Appointment Rescheduled 🗓️
    </h2>
    <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px;">
      Dear <strong>${p.patientName}</strong>,<br>
      Your consultation has been successfully rescheduled. Your new appointment details are:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7faf8; border: 1px solid #e6f0ea; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
      <tr>
        <td style="padding-bottom: 12px; font-size: 14px; color: #718096;">New Date:</td>
        <td style="padding-bottom: 12px; font-size: 15px; font-weight: 600; color: #2d3748; text-align: right;">${p.appointmentDate}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 12px; font-size: 14px; color: #718096;">New Time:</td>
        <td style="padding-bottom: 12px; font-size: 15px; font-weight: 600; color: #2d3748; text-align: right;">${p.appointmentTime} (IST)</td>
      </tr>
      <tr>
        <td style="padding-bottom: 12px; font-size: 14px; color: #718096;">Mode:</td>
        <td style="padding-bottom: 12px; font-size: 14px; font-weight: 600; color: #2f4a3d; text-align: right;">${typeText}</td>
      </tr>
      ${
        isOnline && p.googleMeetUrl
          ? `<tr>
              <td colspan="2" style="padding-top: 12px; border-top: 1px dashed #cbd5e0; text-align: center;">
                <a href="${p.googleMeetUrl}" target="_blank" style="display: inline-block; background-color: #2f4a3d; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 600;">
                  Join Google Meet
                </a>
                <div style="font-size: 11px; color: #718096; margin-top: 8px;">${p.googleMeetUrl}</div>
              </td>
            </tr>`
          : ""
      }
    </table>
  `;

  return {
    subject: `Appointment Rescheduled — Dr. Pratima Agale (${p.appointmentDate} at ${p.appointmentTime})`,
    html: baseEmailWrapper(content, `Your consultation has been rescheduled to ${p.appointmentDate} at ${p.appointmentTime}`),
  };
}

export function buildDoctorNotificationEmail(p: EmailTemplateParams): { subject: string; html: string } {
  const isOnline = p.consultationType === "online";
  const content = `
    <h2 style="color: #2f4a3d; font-size: 20px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">
      New Appointment Confirmed 📋
    </h2>
    <p style="font-size: 14px; line-height: 1.6; color: #4a5568;">
      A new appointment has been scheduled and added to your Google Calendar:
    </p>

    <div style="background-color: #f7faf8; border: 1px solid #e6f0ea; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px;">
      <p style="margin: 4px 0;"><strong>Patient:</strong> ${p.patientName}</p>
      <p style="margin: 4px 0;"><strong>Date:</strong> ${p.appointmentDate}</p>
      <p style="margin: 4px 0;"><strong>Time:</strong> ${p.appointmentTime} (IST)</p>
      <p style="margin: 4px 0;"><strong>Type:</strong> ${isOnline ? "Online (Google Meet)" : "In-Person Clinic"}</p>
      ${p.googleMeetUrl ? `<p style="margin: 4px 0;"><strong>Meet URL:</strong> <a href="${p.googleMeetUrl}">${p.googleMeetUrl}</a></p>` : ""}
    </div>

    <p style="font-size: 13px; color: #718096;">
      Access your full doctor schedule and EHR records at <a href="${p.baseUrl || CLINIC_SITE}/doctor" style="color:#2f4a3d;font-weight:600;">Doctor Dashboard</a>.
    </p>
  `;

  return {
    subject: `[New Appointment] ${p.patientName} — ${p.appointmentDate} at ${p.appointmentTime}`,
    html: baseEmailWrapper(content, `New appointment booked by ${p.patientName}`),
  };
}

export function buildWhatsAppTextMessage(
  type: "confirmed" | "cancelled" | "rescheduled" | "reminder",
  p: EmailTemplateParams
): string {
  const isOnline = p.consultationType === "online";
  const dateFormatted = formatInKolkata(`${p.appointmentDate}T00:00:00+05:30`, {
    dateStyle: "medium",
  });

  if (type === "confirmed") {
    return `*Dr. Pratima Agale Homeopathy Clinic* 🌿

Dear ${p.patientName}, your appointment is *CONFIRMED*.

📅 *Date:* ${dateFormatted}
🕒 *Time:* ${p.appointmentTime} IST
🏥 *Mode:* ${isOnline ? "Online (Google Meet)" : "In-Person Clinic (Kalyan)"}
${isOnline && p.googleMeetUrl ? `\n🔗 *Google Meet Link:*\n${p.googleMeetUrl}\n` : ""}
📍 *Clinic Address:* ${CLINIC_DEFAULT_ADDRESS}

Please be ready 5 minutes prior to your time.
📞 ${CLINIC_PHONE}
🌐 ${CLINIC_SITE}`;
  }

  if (type === "rescheduled") {
    return `*Dr. Pratima Agale Homeopathy Clinic* 🌿

Dear ${p.patientName}, your appointment has been *RESCHEDULED*.

📅 *New Date:* ${dateFormatted}
🕒 *New Time:* ${p.appointmentTime} IST
${isOnline && p.googleMeetUrl ? `\n🔗 *Google Meet Link:*\n${p.googleMeetUrl}\n` : ""}
📞 ${CLINIC_PHONE}
🌐 ${CLINIC_SITE}`;
  }

  if (type === "cancelled") {
    return `*Dr. Pratima Agale Homeopathy Clinic* 🌿

Dear ${p.patientName}, your appointment on ${dateFormatted} at ${p.appointmentTime} has been *CANCELLED*.
${p.cancellationReason ? `Reason: ${p.cancellationReason}\n` : ""}
To book a new appointment, please visit:
🌐 ${CLINIC_SITE}
📞 ${CLINIC_PHONE}`;
  }

  return `*Dr. Pratima Agale Homeopathy Clinic* 🌿

Reminder: You have an upcoming consultation with Dr. Pratima Agale on *${dateFormatted}* at *${p.appointmentTime} IST*.
${isOnline && p.googleMeetUrl ? `\n🔗 *Join Google Meet:* ${p.googleMeetUrl}` : ""}`;
}
