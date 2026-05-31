import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AppointmentStatus } from "@/lib/types/appointment";

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

export async function createAppointmentLookup(data: {
  patientPhone: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentId: string;
}) {
  const phoneKey = normalizePhone(data.patientPhone);
  if (!phoneKey) return;

  await setDoc(doc(db, "appointment_lookup", phoneKey), {
    patientName: data.patientName,
    patientPhone: data.patientPhone,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    status: "Pending" as AppointmentStatus,
    appointmentId: data.appointmentId,
    updatedAt: serverTimestamp(),
  });
}

export async function updateAppointmentLookup(
  patientPhone: string,
  status: AppointmentStatus
) {
  const phoneKey = normalizePhone(patientPhone);
  if (!phoneKey) return;

  const ref = doc(db, "appointment_lookup", phoneKey);
  const existing = await getDoc(ref);
  if (!existing.exists()) return;

  await updateDoc(ref, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function getAppointmentByPhone(phone: string) {
  const phoneKey = normalizePhone(phone);
  if (!phoneKey) return null;

  const snapshot = await getDoc(doc(db, "appointment_lookup", phoneKey));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    patientName: String(data.patientName ?? ""),
    patientPhone: String(data.patientPhone ?? phone),
    appointmentDate: String(data.appointmentDate ?? ""),
    appointmentTime: String(data.appointmentTime ?? ""),
    status: (data.status as AppointmentStatus) ?? "Pending",
  };
}
