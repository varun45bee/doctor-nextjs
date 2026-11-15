import {
  collection,
  doc,
  getDocs,
  getDoc,
  orderBy,
  query,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { updateAppointmentLookup } from "../appointment-lookup.ts";
import { db } from "../firebase.ts";
import {
  normalizeAppointment,
  type Appointment,
  type AppointmentStatus,
  type Prescription,
  type ProgressLog,
} from "../types/appointment.ts";

export async function fetchAppointments(): Promise<Appointment[]> {
  const snapshot = await getDocs(
    query(collection(db, "appointments"), orderBy("createdAt", "desc"))
  );

  return snapshot.docs.map((d) =>
    normalizeAppointment({ id: d.id, ...d.data() })
  );
}

export type DateQuickFilter = "all" | "today" | "upcoming" | "past";

export function filterAppointments(
  appointments: Appointment[],
  search: string,
  status: AppointmentStatus | "all",
  mode: "all" | "online" | "in-person" = "all",
  dateFilter: DateQuickFilter = "all"
): Appointment[] {
  const term = search.trim().toLowerCase();

  // Current date in Asia/Kolkata (YYYY-MM-DD)
  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return appointments.filter((appt) => {
    // 1. Status Filter
    if (status !== "all" && appt.status !== status) return false;

    // 2. Mode Filter
    if (mode !== "all" && appt.consultationType !== mode) return false;

    // 3. Date Quick Filter
    if (dateFilter === "today" && appt.appointmentDate !== todayStr) return false;
    if (dateFilter === "upcoming" && (appt.appointmentDate || "") < todayStr) return false;
    if (dateFilter === "past" && (appt.appointmentDate || "") >= todayStr) return false;

    // 4. Search Term
    if (!term) return true;

    return (
      Boolean(appt.patientName && appt.patientName.toLowerCase().includes(term)) ||
      Boolean(appt.patientEmail && appt.patientEmail.toLowerCase().includes(term)) ||
      Boolean(appt.patientPhone && appt.patientPhone.toLowerCase().includes(term)) ||
      Boolean(appt.condition && appt.condition.toLowerCase().includes(term)) ||
      Boolean(appt.id && appt.id.toLowerCase().includes(term))
    );
  });
}

export function sortAppointmentsByDate(
  appointments: Appointment[],
  direction: "asc" | "desc"
): Appointment[] {
  return [...appointments].sort((a, b) => {
    const dateA = a.appointmentDate || "";
    const dateB = b.appointmentDate || "";
    if (dateA === dateB) {
      const timeCompare = a.appointmentTime.localeCompare(b.appointmentTime);
      return direction === "asc" ? timeCompare : -timeCompare;
    }
    return direction === "asc"
      ? dateA.localeCompare(dateB)
      : dateB.localeCompare(dateA);
  });
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
  patientPhone?: string
): Promise<void> {
  await updateDoc(doc(db, "appointments", id), { status });
  if (patientPhone) {
    await updateAppointmentLookup(patientPhone, status);
  }
}

export async function fetchAppointmentById(id: string): Promise<Appointment | null> {
  const snapshot = await getDoc(doc(db, "appointments", id));
  if (!snapshot.exists()) return null;
  return normalizeAppointment({ id: snapshot.id, ...snapshot.data() });
}

export async function saveAppointmentPrescription(
  id: string,
  prescription: Prescription
): Promise<void> {
  await updateDoc(doc(db, "appointments", id), {
    prescription,
  });
}

export async function saveDoctorNotes(
  id: string,
  doctorNotes: string
): Promise<void> {
  await updateDoc(doc(db, "appointments", id), {
    doctorNotes,
  });
}

export async function addPatientProgressLog(
  id: string,
  log: ProgressLog
): Promise<void> {
  await updateDoc(doc(db, "appointments", id), {
    progressLogs: arrayUnion(log),
  });
}
