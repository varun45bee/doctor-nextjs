import { Timestamp } from "firebase/firestore";

export type ConsultationType = "online" | "in-person";

export type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "Failed";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
  "Failed",
];

export interface Prescription {
  remedy: string;
  potency: string;
  dosage: string;
  duration: string;
  instructions: string;
  prescribedAt: string;
}

export interface ProgressLog {
  rating: number;
  notes: string;
  loggedAt: string;
}

export interface NotificationDeliveryStatus {
  email?: "pending" | "sent" | "failed" | "not_provided";
  emailError?: string;
  emailSentAt?: string;
  whatsapp?: "pending" | "sent" | "failed" | "not_provided" | "not_consented";
  whatsappError?: string;
  whatsappSentAt?: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm (Asia/Kolkata)
  startTimestamp?: string; // ISO 8601
  endTimestamp?: string; // ISO 8601
  timezone: string; // e.g. "Asia/Kolkata"
  consultationType: ConsultationType;
  status: AppointmentStatus;
  condition?: string;
  age?: string;
  message?: string;
  lang?: string;

  // Google Calendar & Meet
  googleCalendarEventId?: string;
  calendarId?: string;
  googleMeetUrl?: string;
  calendarSyncStatus?: "pending" | "synced" | "failed" | "not_applicable";
  calendarError?: string;

  // Clinical EHR
  prescription?: Prescription;
  progressLogs?: ProgressLog[];

  // Notifications & Audit
  notificationStatus?: NotificationDeliveryStatus;
  accessSecret?: string; // Secret token for patient self-service cancellation / rescheduling
  idempotencyKey?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: "patient" | "doctor" | "system";
  rescheduledFrom?: string;
  consentGiven?: boolean;

  createdAt: Date | null;
  updatedAt?: Date | null;
}

export interface AppointmentWrite {
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId?: string;
  appointmentDate: string;
  appointmentTime: string;
  startTimestamp?: string;
  endTimestamp?: string;
  timezone?: string;
  consultationType?: ConsultationType;
  status: AppointmentStatus;
  condition?: string;
  age?: string;
  message?: string;
  lang?: string;
  googleCalendarEventId?: string;
  calendarId?: string;
  googleMeetUrl?: string;
  calendarSyncStatus?: "pending" | "synced" | "failed" | "not_applicable";
  calendarError?: string;
  notificationStatus?: NotificationDeliveryStatus;
  accessSecret?: string;
  idempotencyKey?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: "patient" | "doctor" | "system";
  rescheduledFrom?: string;
  consentGiven?: boolean;
  prescription?: Prescription;
  progressLogs?: ProgressLog[];
}

export interface SlotLock {
  id: string; // e.g. `${doctorId}_${date}_${time}`
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  appointmentId?: string;
  lockedAt: Date | Timestamp;
  expiresAt: Date | Timestamp;
  status: "reserved" | "confirmed";
}

export interface DoctorIntegrationGoogle {
  doctorId: string;
  email: string;
  connected: boolean;
  calendarId: string;
  encryptedRefreshToken: string;
  encryptedAccessToken?: string;
  tokenExpiresAt?: number;
  scope?: string;
  connectedAt?: string;
  updatedAt?: string;
  lastSyncError?: string;
}

export interface NotificationJob {
  id: string;
  appointmentId: string;
  type: "booking_confirmed" | "booking_cancelled" | "booking_rescheduled" | "reminder" | "booking_failed";
  channel: "email" | "whatsapp" | "both";
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  appointmentDate: string;
  appointmentTime: string;
  consultationType: ConsultationType;
  googleMeetUrl?: string;
  status: "pending" | "processing" | "completed" | "failed";
  retryCount: number;
  maxRetries: number;
  nextRetryAt: string;
  lastError?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AuditLogEntry {
  id?: string;
  action: string;
  entityType: "appointment" | "slotLock" | "integration" | "availability";
  entityId: string;
  actor: {
    type: "doctor" | "patient" | "system" | "admin";
    id?: string;
    email?: string;
    ip?: string;
  };
  details: Record<string, unknown>;
  timestamp: string;
}

type RawAppointment = Record<string, unknown> & { id: string };

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

function normalizeStatus(raw: unknown): AppointmentStatus {
  if (!raw) return "Pending";
  const s = String(raw).toLowerCase();
  if (s === "confirmed") return "Confirmed";
  if (s === "cancelled") return "Cancelled";
  if (s === "completed") return "Completed";
  if (s === "failed") return "Failed";
  return "Pending";
}

export function normalizeAppointment(doc: RawAppointment): Appointment {
  const data = doc;

  return {
    id: doc.id,
    patientId: data.patientId ? String(data.patientId) : undefined,
    patientName: String(data.patientName ?? data.name ?? ""),
    patientEmail: String(data.patientEmail ?? data.email ?? ""),
    patientPhone: String(data.patientPhone ?? data.phone ?? ""),
    doctorId: String(data.doctorId ?? "default_doctor"),
    appointmentDate: String(data.appointmentDate ?? data.date ?? ""),
    appointmentTime: String(data.appointmentTime ?? data.time ?? ""),
    startTimestamp: data.startTimestamp ? String(data.startTimestamp) : undefined,
    endTimestamp: data.endTimestamp ? String(data.endTimestamp) : undefined,
    timezone: String(data.timezone ?? "Asia/Kolkata"),
    consultationType: (data.consultationType as ConsultationType) || "online",
    status: normalizeStatus(data.status),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    condition: data.condition ? String(data.condition) : undefined,
    age: data.age ? String(data.age) : undefined,
    message: data.message ? String(data.message) : undefined,
    lang: data.lang ? String(data.lang) : undefined,

    // Google Calendar & Meet
    googleCalendarEventId: data.googleCalendarEventId ? String(data.googleCalendarEventId) : undefined,
    calendarId: data.calendarId ? String(data.calendarId) : undefined,
    googleMeetUrl: data.googleMeetUrl ? String(data.googleMeetUrl) : undefined,
    calendarSyncStatus: (data.calendarSyncStatus as Appointment["calendarSyncStatus"]) || undefined,
    calendarError: data.calendarError ? String(data.calendarError) : undefined,

    // Notifications
    notificationStatus: data.notificationStatus ? (data.notificationStatus as NotificationDeliveryStatus) : undefined,
    accessSecret: data.accessSecret ? String(data.accessSecret) : undefined,
    idempotencyKey: data.idempotencyKey ? String(data.idempotencyKey) : undefined,
    cancellationReason: data.cancellationReason ? String(data.cancellationReason) : undefined,
    cancelledAt: data.cancelledAt ? String(data.cancelledAt) : undefined,
    cancelledBy: data.cancelledBy ? (data.cancelledBy as Appointment["cancelledBy"]) : undefined,
    rescheduledFrom: data.rescheduledFrom ? String(data.rescheduledFrom) : undefined,
    consentGiven: typeof data.consentGiven === "boolean" ? data.consentGiven : true,

    // Clinical EHR
    prescription: data.prescription ? (data.prescription as Prescription) : undefined,
    progressLogs: data.progressLogs ? (data.progressLogs as ProgressLog[]) : undefined,
  };
}
