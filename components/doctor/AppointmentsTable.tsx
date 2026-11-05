"use client";

import { useState } from "react";
import {
  Video,
  MapPin,
  Mail,
  MessageSquare,
  ExternalLink,
  AlertCircle,
  Clock,
  Copy,
  RotateCw,
  Loader2,
  Check,
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
  const [retryingMeetId, setRetryingMeetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRetryMeet = async (apptId: string) => {
    setRetryingMeetId(apptId);
    try {
      const res = await fetch(`/api/appointments/${apptId}/meet`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(
          data.error ||
            "Failed to generate Google Meet room. Please ensure Google Calendar & Meet are connected in Doctor Settings."
        );
      } else {
        alert("Google Meet room successfully generated!");
        window.location.reload();
      }
    } catch {
      alert("Network error while creating Google Meet room.");
    } finally {
      setRetryingMeetId(null);
    }
  };

  const handleCopyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-[var(--border-color)]">
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
              <th className="px-4 py-3.5 font-medium">Patient</th>
              <th className="px-4 py-3.5 font-medium">Contact</th>
              <th className="px-4 py-3.5 font-medium">Date & Time</th>
              <th className="px-4 py-3.5 font-medium">Mode</th>
              <th className="px-4 py-3.5 font-medium">Google Meet</th>
              <th className="px-4 py-3.5 font-medium">Delivery</th>
              <th className="px-4 py-3.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr
                key={appt.id}
                onClick={() => onSelectAppointment?.(appt)}
                className="border-b last:border-b-0 hover:bg-sage-50/50 dark:hover:bg-sage-900/20 transition-colors cursor-pointer"
                style={{ borderColor: "var(--border-color)" }}
              >
                {/* Patient Name & Condition */}
                <td className="px-4 py-3.5 font-medium" style={{ color: "var(--text-primary)" }}>
                  <div>
                    <span className="font-semibold">{appt.patientName || "—"}</span>
                    {appt.condition && (
                      <span className="block text-[11px] text-[var(--text-muted)] truncate max-w-[150px]">
                        {appt.condition}
                      </span>
                    )}
                  </div>
                </td>

                {/* Contact Details */}
                <td className="px-4 py-3.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <div className="space-y-0.5">
                    <p>{appt.patientPhone || "—"}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[170px]">
                      {appt.patientEmail || "—"}
                    </p>
                  </div>
                </td>

                {/* Date & Time */}
                <td className="px-4 py-3.5 text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                  <div>
                    <p>{formatDate(appt.appointmentDate)}</p>
                    <p className="text-[11px] text-sage-600 dark:text-sage-400 font-semibold">
                      {formatTime(appt.appointmentTime)}
                    </p>
                  </div>
                </td>

                {/* Consultation Mode */}
                <td className="px-4 py-3.5 text-xs">
                  {appt.consultationType === "online" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      <Video className="w-3 h-3" /> Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <MapPin className="w-3 h-3" /> Clinic
                    </span>
                  )}
                </td>

                {/* Google Meet Link */}
                <td className="px-4 py-3.5 text-xs" onClick={(e) => e.stopPropagation()}>
                  {appt.consultationType === "online" ? (
                    (() => {
                      const meetLink = appt.googleMeetLink || appt.googleMeetUrl;
                      const isRetrying = retryingMeetId === appt.id;

                      if (meetLink) {
                        return (
                          <div className="flex items-center gap-1.5">
                            <a
                              href={meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs transition-colors shadow-sm"
                            >
                              <Video className="w-3.5 h-3.5" />
                              Join
                              <ExternalLink className="w-3 h-3 opacity-80" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyLink(appt.id, meetLink)}
                              className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-surface-alt)] text-[var(--text-secondary)] transition-colors"
                              title="Copy Google Meet Link"
                            >
                              {copiedId === appt.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      }

                      if (isRetrying || appt.meetingStatus === "creating") {
                        return (
                          <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" /> Creating...
                          </span>
                        );
                      }

                      return (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-amber-600 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {appt.meetingStatus === "failed" ? "Failed" : "Pending"}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRetryMeet(appt.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 text-[11px] font-medium transition-colors"
                            title="Retry Google Meet Creation"
                          >
                            <RotateCw className="w-3 h-3" />
                            Retry
                          </button>
                        </div>
                      );
                    })()
                  ) : (
                    <span className="text-[11px] text-[var(--text-muted)]">—</span>
                  )}
                </td>

                {/* Delivery Status Icons */}
                <td className="px-4 py-3.5 text-xs" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    {/* Email Status */}
                    <span
                      title={`Email: ${appt.notificationStatus?.email || "pending"}`}
                      className={`p-1.5 rounded-lg flex items-center justify-center ${
                        appt.notificationStatus?.email === "sent"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
                          : appt.notificationStatus?.email === "failed"
                          ? "bg-red-50 text-red-600 dark:bg-red-950/40"
                          : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </span>

                    {/* WhatsApp Status */}
                    <span
                      title={`WhatsApp: ${appt.notificationStatus?.whatsapp || "pending"}`}
                      className={`p-1.5 rounded-lg flex items-center justify-center ${
                        appt.notificationStatus?.whatsapp === "sent"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
                          : appt.notificationStatus?.whatsapp === "failed"
                          ? "bg-red-50 text-red-600 dark:bg-red-950/40"
                          : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </td>

                {/* Status and Selector */}
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
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
            onClick={() => onSelectAppointment?.(appt)}
            className="p-4 rounded-2xl border cursor-pointer hover:border-sage-300 transition-colors space-y-3"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {appt.patientName || "—"}
                </p>
                <p className="text-xs text-sage-600 dark:text-sage-400 font-medium">
                  {formatDate(appt.appointmentDate)} · {formatTime(appt.appointmentTime)}
                </p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <StatusBadge status={appt.status} />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-color)]">
              <span className="text-[var(--text-secondary)]">Mode:</span>
              <span>
                {appt.consultationType === "online" ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
                    <Video className="w-3 h-3" /> Online
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                    <MapPin className="w-3 h-3" /> Clinic
                  </span>
                )}
              </span>
            </div>

            {appt.consultationType === "online" && (
              <div onClick={(e) => e.stopPropagation()} className="space-y-1.5">
                {(() => {
                  const meetLink = appt.googleMeetLink || appt.googleMeetUrl;
                  const isRetrying = retryingMeetId === appt.id;

                  if (meetLink) {
                    return (
                      <div className="flex items-center gap-2">
                        <a
                          href={meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-sage-600 text-white text-xs font-bold shadow-sm"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Join Google Meet
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(appt.id, meetLink)}
                          className="p-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-surface-alt)] text-[var(--text-secondary)]"
                          title="Copy Link"
                        >
                          {copiedId === appt.id ? (
                            <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    );
                  }

                  if (isRetrying || appt.meetingStatus === "creating") {
                    return (
                      <div className="py-2 text-center text-xs text-blue-600 flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating Google Meet room...
                      </div>
                    );
                  }

                  return (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs">
                      <span className="text-amber-800 dark:text-amber-200 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        {appt.meetingStatus === "failed" ? "Meet Failed" : "Meet Pending"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRetryMeet(appt.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 text-white font-semibold text-xs shadow-xs"
                      >
                        <RotateCw className="w-3 h-3" /> Retry
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="space-y-0.5 text-xs pt-1" style={{ color: "var(--text-secondary)" }}>
              {appt.patientPhone && <p>📞 {appt.patientPhone}</p>}
              {appt.patientEmail && <p>✉️ {appt.patientEmail}</p>}
            </div>

            <div onClick={(e) => e.stopPropagation()} className="pt-2">
              <StatusSelect
                value={appt.status}
                disabled={updatingId === appt.id}
                onChange={(status) => onStatusChange(appt.id, status)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
