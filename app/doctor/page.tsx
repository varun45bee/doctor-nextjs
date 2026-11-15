"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
  List,
  Calendar as CalendarIcon,
  BarChart2,
  Clock,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Activity,
  CalendarCheck,
  Video,
} from "lucide-react";
import AppointmentFilters from "@/components/doctor/AppointmentFilters";
import AppointmentsTable from "@/components/doctor/AppointmentsTable";
import EmptyState from "@/components/doctor/EmptyState";
import LoadingState from "@/components/doctor/LoadingState";
import PatientDrawer from "@/components/doctor/PatientDrawer";
import DoctorCalendar from "@/components/doctor/DoctorCalendar";
import DoctorAnalytics from "@/components/doctor/DoctorAnalytics";
import DoctorAvailability from "@/components/doctor/DoctorAvailability";
import DoctorChat from "@/components/doctor/DoctorChat";
import RescheduleModal from "@/components/doctor/RescheduleModal";
import CancelModal from "@/components/doctor/CancelModal";
import {
  fetchAppointments,
  filterAppointments,
  sortAppointmentsByDate,
  type DateQuickFilter,
} from "@/lib/firestore/appointments";
import {
  doctorUpdateAppointment,
} from "@/lib/services/doctor-api";
import { sendPatientStatusNotification } from "@/lib/notifications/send-status-notification";
import type { Appointment, AppointmentStatus } from "@/lib/types/appointment";
import { APPOINTMENT_STATUSES } from "@/lib/types/appointment";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [modeFilter, setModeFilter] = useState<"all" | "online" | "in-person">("all");
  const [dateFilter, setDateFilter] = useState<DateQuickFilter>("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notifyMessage, setNotifyMessage] = useState("");

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    "appointments" | "calendar" | "analytics" | "availability" | "chat" | "blog"
  >("appointments");

  // EHR Drawer & Modal state
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Today in YYYY-MM-DD (Kolkata)
  const todayStr = useMemo(() => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }, []);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setError("Failed to load clinic appointments. Please check network connection.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Filtered & Sorted list
  const filtered = useMemo(() => {
    const filteredList = filterAppointments(
      appointments,
      search,
      statusFilter,
      modeFilter,
      dateFilter
    );
    return sortAppointmentsByDate(filteredList, sortDirection);
  }, [appointments, search, statusFilter, modeFilter, dateFilter, sortDirection]);

  // Aggregate stats
  const stats = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = { total: appointments.length };
    APPOINTMENT_STATUSES.forEach((s) => {
      counts[s] = appointments.filter((a) => a.status === s).length;
    });
    const todayCount = appointments.filter((a) => a.appointmentDate === todayStr).length;
    counts.today = todayCount;
    return counts;
  }, [appointments, todayStr]);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    const appt = appointments.find((a) => a.id === id);
    if (!appt) return;

    // If changing to Cancelled, trigger CancelModal to capture reason and release slot lock
    if (status === "Cancelled") {
      setSelectedAppointment(appt);
      setIsCancelOpen(true);
      return;
    }

    setUpdatingId(id);
    setNotifyMessage("");
    try {
      // Update appointment via authenticated doctor endpoint
      await doctorUpdateAppointment(id, { status });

      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );

      // If drawer has this active appointment, sync its status too
      if (selectedAppointment && selectedAppointment.id === id) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status } : null));
      }

      // Notify patient of status transition
      if (
        appt?.patientEmail &&
        (status === "Confirmed" || status === "Completed")
      ) {
        const result = await sendPatientStatusNotification({
          patientName: appt.patientName,
          patientEmail: appt.patientEmail,
          patientPhone: appt.patientPhone,
          appointmentDate: appt.appointmentDate,
          appointmentTime: appt.appointmentTime,
          status,
        });
        if (result.success) {
          setNotifyMessage(`Notification email dispatched to ${appt.patientName}.`);
        } else {
          setNotifyMessage(`Status updated to ${status}. Notification: ${result.error}`);
        }
      }
    } catch (err: unknown) {
      console.error("Failed to update status:", err);
      const msg = err instanceof Error ? err.message : "Failed to update appointment status.";
      setError(msg);
    }
    setUpdatingId(null);
  };

  const handleAppointmentUpdated = (updated: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    if (selectedAppointment?.id === updated.id) {
      setSelectedAppointment(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Top Clinical Stats KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Total Bookings",
            value: stats.total,
            color: "text-sage-700 dark:text-sage-300",
            bg: "border-[var(--border-color)] bg-[var(--bg-surface)]",
          },
          {
            label: "Today's Consults",
            value: stats.today ?? 0,
            color: "text-emerald-700 dark:text-emerald-300",
            bg: "border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20",
          },
          {
            label: "Pending Review",
            value: stats.Pending ?? 0,
            color: "text-amber-700 dark:text-amber-300",
            bg: "border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20",
          },
          {
            label: "Confirmed Slots",
            value: stats.Confirmed ?? 0,
            color: "text-sky-700 dark:text-sky-300",
            bg: "border-sky-200/80 dark:border-sky-900/50 bg-sky-50/40 dark:bg-sky-950/20",
          },
          {
            label: "Completed",
            value: stats.Completed ?? 0,
            color: "text-emerald-700 dark:text-emerald-300",
            bg: "border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20",
          },
          {
            label: "Cancelled",
            value: stats.Cancelled ?? 0,
            color: "text-rose-700 dark:text-rose-300",
            bg: "border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-4 rounded-2xl border transition-all hover:shadow-xs ${stat.bg}`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold mt-1 font-mono ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Toolbar */}
      <div className="p-2 sm:p-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: "appointments", label: "Appointments", icon: List },
            { id: "calendar", label: "Calendar Schedule", icon: CalendarIcon },
            { id: "chat", label: "Patient Chats", icon: MessageSquare },
            { id: "analytics", label: "Clinic Analytics", icon: BarChart2 },
            { id: "availability", label: "Availability Settings", icon: Clock },
            { id: "blog", label: "Blog Articles", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (tab.id === "blog") {
                    router.push("/doctor/blog");
                  } else {
                    setActiveTab(
                      tab.id as
                        | "appointments"
                        | "calendar"
                        | "chat"
                        | "analytics"
                        | "availability"
                        | "blog"
                    );
                  }
                }}
                className={`
                  flex items-center justify-center gap-2
                  px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all
                  ${
                    active
                      ? "bg-sage-700 text-white shadow-2xs"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-alt)] hover:text-[var(--text-primary)]"
                  }
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Toolbar Controls */}
        <div className="flex items-center justify-end gap-2.5 w-full md:w-auto">
          {activeTab === "appointments" && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sage-50 dark:bg-sage-950/40 text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-sage-800">
              Showing {filtered.length} of {appointments.length}
            </span>
          )}
          <button
            type="button"
            onClick={loadAppointments}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Status notification */}
        {notifyMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notifyMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotifyMessage("")}
              className="text-emerald-400 hover:text-emerald-700 font-bold ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* TAB 1: APPOINTMENTS WORKSTATION */}
        {activeTab === "appointments" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <AppointmentFilters
              search={search}
              onSearchChange={setSearch}
              status={statusFilter}
              onStatusChange={setStatusFilter}
              mode={modeFilter}
              onModeChange={setModeFilter}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              sortDirection={sortDirection}
              onSortChange={setSortDirection}
              totalCount={appointments.length}
              filteredCount={filtered.length}
              statusCounts={stats}
            />

            <div>
              {loading ? (
                <LoadingState message="Fetching clinic appointments..." />
              ) : filtered.length === 0 ? (
                <EmptyState />
              ) : (
                <AppointmentsTable
                  appointments={filtered}
                  updatingId={updatingId}
                  onStatusChange={handleStatusChange}
                  onSelectAppointment={(appt) => setSelectedAppointment(appt)}
                  onReschedule={(appt) => {
                    setSelectedAppointment(appt);
                    setIsRescheduleOpen(true);
                  }}
                  onCancel={(appt) => {
                    setSelectedAppointment(appt);
                    setIsCancelOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CALENDAR SCHEDULE */}
        {activeTab === "calendar" && (
          <div className="animate-in fade-in duration-150">
            {loading ? (
              <LoadingState message="Loading clinic calendar schedule..." />
            ) : (
              <DoctorCalendar
                appointments={appointments}
                onSelectAppointment={(appt) => setSelectedAppointment(appt)}
              />
            )}
          </div>
        )}

        {/* TAB 3: CLINIC ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="animate-in fade-in duration-150">
            {loading ? (
              <LoadingState message="Analyzing clinic performance metrics..." />
            ) : (
              <DoctorAnalytics appointments={appointments} />
            )}
          </div>
        )}

        {/* TAB 4: AVAILABILITY SETTINGS */}
        {activeTab === "availability" && (
          <div className="animate-in fade-in duration-150">
            <DoctorAvailability />
          </div>
        )}

        {/* TAB 5: PATIENT REAL-TIME CHATS */}
        {activeTab === "chat" && (
          <div className="animate-in fade-in duration-150">
            <DoctorChat />
          </div>
        )}
      </div>

      {/* Integrated Electronic Health Record sliding drawer */}
      <PatientDrawer
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onAppointmentUpdated={handleAppointmentUpdated}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        appointment={selectedAppointment}
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onSuccess={(updated) => {
          handleAppointmentUpdated(updated);
          setNotifyMessage(`Appointment successfully rescheduled to ${updated.appointmentDate} at ${updated.appointmentTime}.`);
        }}
      />

      {/* Cancel Modal */}
      <CancelModal
        appointment={selectedAppointment}
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onSuccess={(updated) => {
          handleAppointmentUpdated(updated);
          setNotifyMessage(`Appointment for ${updated.patientName} was cancelled and slot lock released.`);
        }}
      />
    </div>
  );
}
