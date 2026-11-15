"use client";

import { useState, useMemo } from "react";
import {
  Video,
  MapPin,
  Mail,
  MessageSquare,
  Clock,
  Calendar,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  ArrowRight,
  Phone,
  FileText,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import StatusBadge from "@/components/doctor/StatusBadge";
import StatusSelect from "@/components/doctor/StatusSelect";
import type { Appointment, AppointmentStatus } from "@/lib/types/appointment";

type AppointmentsTableProps = {
  appointments: Appointment[];
  updatingId: string | null;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  onSelectAppointment?: (appt: Appointment) => void;
  onReschedule?: (appt: Appointment) => void;
  onCancel?: (appt: Appointment) => void;
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
  onSelectAppointment,
  onReschedule,
  onCancel,
}: AppointmentsTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Today in YYYY-MM-DD
  const todayStr = useMemo(() => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }, []);

  const totalItems = appointments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAppointments = useMemo(() => {
    return appointments.slice(startIndex, startIndex + pageSize);
  }, [appointments, startIndex, pageSize]);

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Consultation Mode</th>
                <th className="px-4 py-3.5">Contact</th>
                <th className="px-4 py-3.5">Notifications</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {paginatedAppointments.map((appt) => {
                const isToday = appt.appointmentDate === todayStr;
                const cleanPhone = (appt.patientPhone || "").replace(/\D/g, "");
                const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

                return (
                  <tr
                    key={appt.id}
                    onClick={() => onSelectAppointment?.(appt)}
                    className="hover:bg-sage-50/50 dark:hover:bg-sage-950/20 transition-colors cursor-pointer group"
                  >
                    {/* Patient Name & Condition */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-sage-100 dark:bg-sage-900/60 text-sage-700 dark:text-sage-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {appt.patientName ? appt.patientName.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-sage-600 transition-colors">
                            {appt.patientName || "Anonymous Patient"}
                            {appt.age && (
                              <span className="ml-1.5 text-xs text-[var(--text-muted)] font-normal">
                                ({appt.age}y)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">
                            {appt.condition || "General consultation"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-4 text-xs font-medium">
                      <div>
                        <div className="flex items-center gap-1.5 text-[var(--text-primary)] font-semibold">
                          <span>{formatDate(appt.appointmentDate)}</span>
                          {isToday && (
                            <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[9px] uppercase">
                              Today
                            </span>
                          )}
                        </div>
                        <p className="text-sage-600 dark:text-sage-400 font-bold text-xs mt-0.5">
                          {formatTime(appt.appointmentTime)}
                        </p>
                      </div>
                    </td>

                    {/* Mode */}
                    <td className="px-4 py-4 text-xs">
                      {appt.consultationType === "online" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                          <Video className="w-3.5 h-3.5 text-blue-500" /> Online Video
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-xs bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
                          <MapPin className="w-3.5 h-3.5 text-emerald-500" /> In-Clinic
                        </span>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4 text-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-0.5 text-[var(--text-secondary)]">
                        {appt.patientPhone && (
                          <a
                            href={`tel:${appt.patientPhone}`}
                            className="hover:text-sage-600 flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Phone className="w-3 h-3 text-[var(--text-muted)]" />
                            {appt.patientPhone}
                          </a>
                        )}
                        {appt.patientEmail && (
                          <a
                            href={`mailto:${appt.patientEmail}`}
                            className="hover:text-sage-600 truncate block text-[11px] text-[var(--text-muted)] max-w-[160px]"
                          >
                            {appt.patientEmail}
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Notifications */}
                    <td className="px-4 py-4 text-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span
                          title={`Email Status: ${appt.notificationStatus?.email || "pending"}`}
                          className={`p-1.5 rounded-lg flex items-center justify-center ${
                            appt.notificationStatus?.email === "sent"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50"
                              : appt.notificationStatus?.email === "failed"
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50"
                              : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                          }`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </span>
                        <span
                          title={`WhatsApp Status: ${appt.notificationStatus?.whatsapp || "pending"}`}
                          className={`p-1.5 rounded-lg flex items-center justify-center ${
                            appt.notificationStatus?.whatsapp === "sent"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50"
                              : appt.notificationStatus?.whatsapp === "failed"
                              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50"
                              : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </td>

                    {/* Status Select */}
                    <td className="px-4 py-4 text-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={appt.status} />
                        <StatusSelect
                          value={appt.status}
                          disabled={updatingId === appt.id}
                          onChange={(status) => onStatusChange(appt.id, status)}
                        />
                      </div>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-5 py-4 text-right text-xs" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {waPhone && (
                          <a
                            href={`https://wa.me/${waPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 text-[var(--text-secondary)] transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {onReschedule && appt.status !== "Cancelled" && (
                          <button
                            type="button"
                            onClick={() => onReschedule(appt)}
                            title="Reschedule Slot"
                            className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 text-[var(--text-secondary)] transition-colors"
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {onCancel && appt.status !== "Cancelled" && (
                          <button
                            type="button"
                            onClick={() => onCancel(appt)}
                            title="Cancel Appointment"
                            className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-[var(--text-secondary)] transition-colors"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onSelectAppointment?.(appt)}
                          className="px-2.5 py-1.5 rounded-lg bg-sage-50 hover:bg-sage-100 dark:bg-sage-950/50 dark:hover:bg-sage-900/60 text-sage-700 dark:text-sage-300 font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <span>EHR</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs font-semibold focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-[var(--text-muted)] ml-2">
              Showing {totalItems === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} of {totalItems}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-muted)] disabled:opacity-40 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-bold text-[var(--text-primary)]">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-muted)] disabled:opacity-40 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card Stack */}
      <div className="lg:hidden space-y-3">
        {paginatedAppointments.map((appt) => {
          const isToday = appt.appointmentDate === todayStr;
          const cleanPhone = (appt.patientPhone || "").replace(/\D/g, "");
          const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

          return (
            <div
              key={appt.id}
              onClick={() => onSelectAppointment?.(appt)}
              className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs space-y-3 cursor-pointer hover:border-sage-400 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--text-primary)]">
                      {appt.patientName || "Anonymous Patient"}
                    </span>
                    {isToday && (
                      <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[9px] uppercase">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-sage-600 dark:text-sage-400 font-semibold mt-0.5">
                    {formatDate(appt.appointmentDate)} · {formatTime(appt.appointmentTime)}
                  </p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <StatusBadge status={appt.status} />
                </div>
              </div>

              {/* Condition & Mode */}
              <div className="flex items-center justify-between text-xs py-1.5 border-y border-[var(--border-color)]">
                <span className="text-[var(--text-muted)] truncate max-w-[180px]">
                  {appt.condition || "General consultation"}
                </span>
                <span>
                  {appt.consultationType === "online" ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                      <Video className="w-3.5 h-3.5" /> Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <MapPin className="w-3.5 h-3.5" /> Clinic
                    </span>
                  )}
                </span>
              </div>

              {/* Contact and Status Changer */}
              <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                {appt.patientPhone && <p className="font-mono text-[11px]">📞 {appt.patientPhone}</p>}
                {appt.patientEmail && <p className="truncate text-[11px] text-[var(--text-muted)]">✉️ {appt.patientEmail}</p>}
              </div>

              {/* Action Buttons Row */}
              <div
                className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <StatusSelect
                    value={appt.status}
                    disabled={updatingId === appt.id}
                    onChange={(status) => onStatusChange(appt.id, status)}
                  />
                  {waPhone && (
                    <a
                      href={`https://wa.me/${waPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-emerald-50 text-emerald-600 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {onReschedule && appt.status !== "Cancelled" && (
                    <button
                      type="button"
                      onClick={() => onReschedule(appt)}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-[var(--border-color)] hover:bg-blue-50 text-blue-600 transition-colors"
                    >
                      Reschedule
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectAppointment?.(appt)}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg bg-sage-600 hover:bg-sage-700 text-white transition-colors"
                  >
                    View EHR
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Mobile Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-xs">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] disabled:opacity-40"
            >
              Previous
            </button>
            <span className="font-bold text-[var(--text-primary)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
