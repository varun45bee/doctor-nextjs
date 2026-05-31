import type { AppointmentStatus } from "@/lib/types/appointment";

type NotifyInput = {
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
};

export async function sendPatientStatusNotification(
  input: NotifyInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/notify-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
