"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, List, Calendar as CalendarIcon, BarChart2, Clock } from "lucide-react";
import AppointmentFilters from "@/components/doctor/AppointmentFilters";
import AppointmentsTable from "@/components/doctor/AppointmentsTable";
import EmptyState from "@/components/doctor/EmptyState";
import LoadingState from "@/components/doctor/LoadingState";
import PatientDrawer from "@/components/doctor/PatientDrawer";
import DoctorCalendar from "@/components/doctor/DoctorCalendar";
import DoctorAnalytics from "@/components/doctor/DoctorAnalytics";
import DoctorAvailability from "@/components/doctor/DoctorAvailability";
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

  // Premium dashboard tab controls
  const [activeTab, setActiveTab] = useState<"appointments" | "calendar" | "analytics" | "availability">("appointments");
  // EHR Drawer patient reference state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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

      // If drawer has this active appointment, sync its status too
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment((prev) => prev ? { ...prev, status } : null);
      }

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Stats KPI Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: "Total Bookings", value: stats.total, color: "text-sage-600 dark:text-sage-400" },
          { label: "Pending Reviews", value: stats.Pending ?? 0, color: "text-amber-600 dark:text-amber-400" },
          { label: "Confirmed Slots", value: stats.Confirmed ?? 0, color: "text-blue-600 dark:text-blue-400" },
          { label: "Completed Cycles", value: stats.Completed ?? 0, color: "text-green-600 dark:text-green-400" },
          { label: "Cancelled", value: stats.Cancelled ?? 0, color: "text-red-600 dark:text-red-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl border transition-all hover:shadow-sm"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Premium Navigation Toolbar */}
      <div
        className="p-3 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
      >
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "appointments", label: "Appointments", icon: List },
            { id: "calendar", label: "Calendar Schedule", icon: CalendarIcon },
            { id: "analytics", label: "Clinic Analytics", icon: BarChart2 },
            { id: "availability", label: "Availability Settings", icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "appointments" | "calendar" | "analytics" | "availability")}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all ${
                  active
                    ? "bg-sage-600 text-white shadow-sm"
                    : "hover:bg-sage-50 dark:hover:bg-sage-900/30 text-zinc-600 dark:text-zinc-400"
                }`}
                style={{
                  color: active ? "#ffffff" : "var(--text-secondary)"
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Toolbar Action buttons */}
        <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
          {activeTab === "appointments" && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sage-50 dark:bg-sage-900/20 text-sage-600 border border-sage-100 dark:border-sage-800">
              Showing {filtered.length} of {appointments.length}
            </span>
          )}
          <button
            type="button"
            onClick={loadAppointments}
            disabled={loading}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors disabled:opacity-50"
            style={{
              borderColor: "var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {/* Error notification */}
        {error && (
          <p className="mb-4 text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-950/20 p-3 rounded-xl border border-red-200/50 dark:border-red-900/30">{error}</p>
        )}

        {/* Status notification */}
        {notifyMessage && (
          <p className="mb-4 text-sage-600 dark:text-sage-400 text-sm text-center font-semibold bg-sage-50 dark:bg-sage-900/30 p-3 rounded-xl border border-sage-200/30">{notifyMessage}</p>
        )}

        {/* TAB 1: APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-4 page-enter">
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

            <div className="mt-4">
              {loading ? (
                <LoadingState message="Fetching clinic appointments..." />
              ) : filtered.length === 0 ? (
                <EmptyState />
              ) : (
                <AppointmentsTable
                  appointments={filtered}
                  updatingId={updatingId}
                  onStatusChange={handleStatusChange}
                  onSelectAppointment={setSelectedAppointment}
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CALENDAR SCHEDULE */}
        {activeTab === "calendar" && (
          <div>
            {loading ? (
              <LoadingState message="Loading clinic calendar schedule..." />
            ) : (
              <DoctorCalendar
                appointments={appointments}
                onSelectAppointment={setSelectedAppointment}
              />
            )}
          </div>
        )}

        {/* TAB 3: CLINIC ANALYTICS */}
        {activeTab === "analytics" && (
          <div>
            {loading ? (
              <LoadingState message="Analyzing patient demographics..." />
            ) : (
              <DoctorAnalytics appointments={appointments} />
            )}
          </div>
        )}

        {/* TAB 4: AVAILABILITY SETTINGS */}
        {activeTab === "availability" && (
          <div>
            <DoctorAvailability />
          </div>
        )}
      </div>

      {/* Integrated Electronic Health Record sliding drawer */}
      <PatientDrawer
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
