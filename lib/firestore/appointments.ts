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
import { updateAppointmentLookup } from "@/lib/appointment-lookup";
import { db } from "@/lib/firebase";
import {
  normalizeAppointment,
  type Appointment,
  type AppointmentStatus,
  type Prescription,
  type ProgressLog,
} from "@/lib/types/appointment";

export async function fetchAppointments(): Promise<Appointment[]> {
  const snapshot = await getDocs(
    query(collection(db, "appointments"), orderBy("createdAt", "desc"))
  );

  return snapshot.docs.map((d) =>
    normalizeAppointment({ id: d.id, ...d.data() })
  );
}

export function filterAppointments(
  appointments: Appointment[],
  search: string,
  status: AppointmentStatus | "all"
): Appointment[] {
  const term = search.trim().toLowerCase();

  return appointments.filter((appt) => {
    const matchesStatus = status === "all" || appt.status === status;
    if (!matchesStatus) return false;
    if (!term) return true;

    return (
      appt.patientName.toLowerCase().includes(term) ||
      appt.patientEmail.toLowerCase().includes(term) ||
      appt.patientPhone.toLowerCase().includes(term)
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

export async function addPatientProgressLog(
  id: string,
  log: ProgressLog
): Promise<void> {
  await updateDoc(doc(db, "appointments", id), {
    progressLogs: arrayUnion(log),
  });
}
