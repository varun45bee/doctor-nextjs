"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import AppointmentFilters from "@/components/doctor/AppointmentFilters";
import AppointmentsTable from "@/components/doctor/AppointmentsTable";
import EmptyState from "@/components/doctor/EmptyState";
import LoadingState from "@/components/doctor/LoadingState";
import {
  fetchAppointments,
  filterAppointments,
  sortAppointmentsByDate,
  updateAppointmentStatus,
} from "@/lib/firestore/appointments";
import { sendPatientStatusNotification } from "@/lib/notifications/send-status-notification";
import type { Appointment, AppointmentStatus } from "@/lib/types/appointment";
import { APPOINTMENT_STATUSES } from "@/lib/types/appointment";

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notifyMessage, setNotifyMessage] = useState("");

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setError("Failed to load appointments. Please try again.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const filtered = useMemo(() => {
    const filteredList = filterAppointments(appointments, search, statusFilter);
    return sortAppointmentsByDate(filteredList, sortDirection);
  }, [appointments, search, statusFilter, sortDirection]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = { total: appointments.length };
    APPOINTMENT_STATUSES.forEach((s) => {
      counts[s] = appointments.filter((a) => a.status === s).length;
    });
    return counts;
  }, [appointments]);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    const appt = appointments.find((a) => a.id === id);
    setUpdatingId(id);
    setNotifyMessage("");
    try {
      await updateAppointmentStatus(id, status, appt?.patientPhone ?? "");
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );

      if (
        appt?.patientEmail &&
        (status === "Confirmed" || status === "Cancelled" || status === "Completed")
      ) {
        const result = await sendPatientStatusNotification({
          patientName: appt.patientName,
          patientEmail: appt.patientEmail,
          appointmentDate: appt.appointmentDate,
          appointmentTime: appt.appointmentTime,
          status,
        });
        if (result.success) {
          setNotifyMessage(`Email sent to ${appt.patientName}.`);
        } else {
          setNotifyMessage(
            `Status updated, but email failed: ${result.error}`
          );
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update appointment status.");
    }
    setUpdatingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total", value: stats.total, color: "text-sage-600" },
          { label: "Pending", value: stats.Pending ?? 0, color: "text-amber-600" },
          { label: "Confirmed", value: stats.Confirmed ?? 0, color: "text-blue-600" },
          { label: "Completed", value: stats.Completed ?? 0, color: "text-green-600" },
          { label: "Cancelled", value: stats.Cancelled ?? 0, color: "text-red-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl border"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
            <p className={`text-2xl font-semibold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="font-serif text-lg"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "var(--text-primary)",
          }}
        >
          Appointments
        </h2>
        <button
          type="button"
          onClick={loadAppointments}
          disabled={loading}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors disabled:opacity-50"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <AppointmentFilters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        sortDirection={sortDirection}
        onSortChange={setSortDirection}
        totalCount={appointments.length}
        filteredCount={filtered.length}
      />

      {error && (
        <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
      )}

      {notifyMessage && (
        <p className="mt-4 text-sage-600 text-sm text-center">{notifyMessage}</p>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingState message="Loading appointments..." />
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <AppointmentsTable
            appointments={filtered}
            updatingId={updatingId}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
