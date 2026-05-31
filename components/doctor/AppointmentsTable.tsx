"use client";

import StatusBadge from "@/components/doctor/StatusBadge";
import StatusSelect from "@/components/doctor/StatusSelect";
import type { Appointment, AppointmentStatus } from "@/lib/types/appointment";

type AppointmentsTableProps = {
  appointments: Appointment[];
  updatingId: string | null;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
};

function formatDate(date: string) {
  if (!date) return "—";
  try {
    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

function formatTime(time: string) {
  if (!time) return "—";
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

export default function AppointmentsTable({
  appointments,
  updatingId,
  onStatusChange,
}: AppointmentsTableProps) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-[var(--border-color)]">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b text-left text-xs uppercase tracking-wide"
              style={{
                backgroundColor: "var(--bg-surface-alt)",
                borderColor: "var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              <th className="px-4 py-3 font-medium">Patient Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr
                key={appt.id}
                className="border-b last:border-b-0 hover:bg-sage-50/50 dark:hover:bg-sage-900/20 transition-colors"
                style={{ borderColor: "var(--border-color)" }}
              >
                <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                  {appt.patientName || "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                  {appt.patientEmail || "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                  {appt.patientPhone || "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                  {formatDate(appt.appointmentDate)}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                  {formatTime(appt.appointmentTime)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={appt.status} />
                    <StatusSelect
                      value={appt.status}
                      disabled={updatingId === appt.id}
                      onChange={(status) => onStatusChange(appt.id, status)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {appt.patientName || "—"}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {formatDate(appt.appointmentDate)} · {formatTime(appt.appointmentTime)}
                </p>
              </div>
              <StatusBadge status={appt.status} />
            </div>
            <div className="space-y-1 text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
              {appt.patientEmail && <p>{appt.patientEmail}</p>}
              {appt.patientPhone && <p>{appt.patientPhone}</p>}
            </div>
            <StatusSelect
              value={appt.status}
              disabled={updatingId === appt.id}
              onChange={(status) => onStatusChange(appt.id, status)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
