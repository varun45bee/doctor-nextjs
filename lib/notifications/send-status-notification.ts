import { auth } from "@/lib/firebase";
import type { AppointmentStatus } from "@/lib/types/appointment";

type NotifyInput = {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
};

export async function sendPatientStatusNotification(
  input: NotifyInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await auth.currentUser?.getIdToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch("/api/notify-status", {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error ?? "Failed to send email" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Could not reach notification service" };
  }
}
