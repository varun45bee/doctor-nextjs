import type { AppointmentStatus } from "@/lib/types/appointment";

type MessageInput = {
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
};

function formatDate(date: string) {
  if (!date) return "your selected date";
  try {
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

function formatTime(time: string) {
  if (!time) return "";
  try {
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  } catch {
    return time;
  }
}

export function buildPatientStatusMessage({
  patientName,
  appointmentDate,
  appointmentTime,
  status,
}: MessageInput): string {
  const date = formatDate(appointmentDate);
  const time = formatTime(appointmentTime);
  const slot = time ? `${date} at ${time}` : date;

  switch (status) {
    case "Confirmed":
      return `Hello ${patientName}, your appointment with Dr. Pratima Agale is CONFIRMED for ${slot}. We look forward to seeing you at the clinic. For queries, call us or reply to this email.`;
    case "Cancelled":
      return `Hello ${patientName}, your appointment request for ${slot} could not be confirmed at this time. Please contact us to reschedule. Dr. Pratima Agale Homeopathy Clinic.`;
    case "Completed":
      return `Hello ${patientName}, thank you for visiting Dr. Pratima Agale. We hope your consultation on ${slot} was helpful. Take care!`;
    default:
      return `Hello ${patientName}, we received your appointment request for ${slot}. Status: ${status}. Dr. Pratima Agale Homeopathy Clinic.`;
  }
}

export function buildPatientStatusEmailSubject(status: AppointmentStatus): string {
  const subjects: Record<AppointmentStatus, string> = {
    Pending: "Appointment Request Received — Dr. Pratima Agale",
    Confirmed: "Appointment Confirmed — Dr. Pratima Agale",
    Completed: "Thank You for Your Visit — Dr. Pratima Agale",
    Cancelled: "Appointment Update — Dr. Pratima Agale",
  };
  return subjects[status];
}

export function getStatusLabel(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    Pending: "Under Review — we will confirm shortly",
    Confirmed: "Confirmed — your appointment is approved",
    Completed: "Completed — thank you for visiting",
    Cancelled: "Not Confirmed — please contact the clinic",
  };
  return labels[status];
}

export function getStatusColor(status: AppointmentStatus): string {
  const colors: Record<AppointmentStatus, string> = {
    Pending: "text-amber-600 bg-amber-50 border-amber-200",
    Confirmed: "text-blue-600 bg-blue-50 border-blue-200",
    Completed: "text-green-600 bg-green-50 border-green-200",
    Cancelled: "text-red-600 bg-red-50 border-red-200",
  };
  return colors[status];
}
