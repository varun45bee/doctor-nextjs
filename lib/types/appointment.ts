import { Timestamp } from "firebase/firestore";

export type AppointmentStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export const APPOINTMENT_STATUSES: AppointmentStatus[] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  createdAt: Date | null;
  condition?: string;
  age?: string;
  message?: string;
  lang?: string;
}

export interface AppointmentWrite {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
  condition?: string;
  age?: string;
  message?: string;
  lang?: string;
}

type RawAppointment = Record<string, unknown> & { id: string };

function toDate(value: unknown): Date | null {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return null;
}

export function normalizeAppointment(doc: RawAppointment): Appointment {
  const data = doc;

  return {
    id: doc.id,
    patientName: String(data.patientName ?? data.name ?? ""),
    patientEmail: String(data.patientEmail ?? data.email ?? ""),
    patientPhone: String(data.patientPhone ?? data.phone ?? ""),
    appointmentDate: String(data.appointmentDate ?? data.date ?? ""),
    appointmentTime: String(data.appointmentTime ?? data.time ?? ""),
    status: (data.status as AppointmentStatus) ?? "Pending",
    createdAt: toDate(data.createdAt),
    condition: data.condition ? String(data.condition) : undefined,
    age: data.age ? String(data.age) : undefined,
    message: data.message ? String(data.message) : undefined,
    lang: data.lang ? String(data.lang) : undefined,
  };
}
