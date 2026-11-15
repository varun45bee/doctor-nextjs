import { auth } from "@/lib/firebase";
import type { Appointment, AppointmentStatus, Prescription } from "@/lib/types/appointment";

/**
 * Retrieves authorization headers with the current doctor's Firebase ID Token.
 */
export async function getDoctorAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("UNAUTHORIZED: Doctor session not found. Please log in.");
  }
  const token = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Cancels an appointment via the verified server route.
 * Atomically releases the slot lock, records cancellation reason, and enqueues notification.
 */
export async function doctorCancelAppointment(
  appointmentId: string,
  reason: string
): Promise<{ success: boolean; appointment: Appointment }> {
  const headers = await getDoctorAuthHeaders();
  const res = await fetch(`/api/appointments/${encodeURIComponent(appointmentId)}/cancel`, {
    method: "POST",
    headers,
    body: JSON.stringify({ reason }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to cancel appointment");
  }
  return data;
}

/**
 * Reschedules an appointment to a new date and time via the verified server route.
 * Atomically swaps the slot locks, verifies capacity, and updates appointment record.
 */
export async function doctorRescheduleAppointment(
  appointmentId: string,
  newDate: string,
  newTime: string,
  reason?: string
): Promise<{ success: boolean; appointment: Appointment }> {
  const headers = await getDoctorAuthHeaders();
  const res = await fetch(`/api/appointments/${encodeURIComponent(appointmentId)}/reschedule`, {
    method: "POST",
    headers,
    body: JSON.stringify({ newDate, newTime, reason }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to reschedule appointment");
  }
  return data;
}

/**
 * Modifies appointment fields (status, prescription, notes) via authenticated PATCH route.
 * Automatically logs audit events with doctor credentials.
 */
export async function doctorUpdateAppointment(
  appointmentId: string,
  updates: {
    status?: AppointmentStatus;
    prescription?: Prescription;
    condition?: string;
    message?: string;
    doctorNotes?: string;
  }
): Promise<{ success: boolean; appointment: Appointment }> {
  const headers = await getDoctorAuthHeaders();
  const res = await fetch(`/api/appointments/${encodeURIComponent(appointmentId)}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update appointment");
  }
  return data;
}

/**
 * Fetches real-time slot availability for a specified date (YYYY-MM-DD).
 */
export async function fetchAvailableSlotsForDate(
  dateStr: string
): Promise<{
  isWorkingDay: boolean;
  slots: { time: string; available: boolean; reason?: string }[];
  availableSlotsCount: number;
}> {
  const res = await fetch(`/api/availability?date=${encodeURIComponent(dateStr)}`, {
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch availability");
  }
  return data;
}

