import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { updateAppointmentLookup } from "@/lib/appointment-lookup";
import { db } from "@/lib/firebase";
import {
  normalizeAppointment,
  type Appointment,
  type AppointmentStatus,
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
