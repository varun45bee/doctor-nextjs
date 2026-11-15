"use client";

import { useEffect, useState } from "react";
import { X, Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { Appointment } from "@/lib/types/appointment";
import { doctorRescheduleAppointment, fetchAvailableSlotsForDate } from "@/lib/services/doctor-api";

type RescheduleModalProps = {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedAppt: Appointment) => void;
};

export default function RescheduleModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<{ time: string; available: boolean; reason?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Today in YYYY-MM-DD
  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  useEffect(() => {
    if (appointment && isOpen) {
      setError("");
      setReason("");
      setSelectedTime("");
      // Default to appointmentDate if future, otherwise today
      const initialDate =
        appointment.appointmentDate && appointment.appointmentDate >= todayStr
          ? appointment.appointmentDate
          : todayStr;
      setSelectedDate(initialDate);
    }
  }, [appointment, isOpen, todayStr]);

  // Load available slots whenever selectedDate changes
  useEffect(() => {
    if (!selectedDate || !isOpen) return;

    let isMounted = true;
    setLoadingSlots(true);
    setError("");

    fetchAvailableSlotsForDate(selectedDate)
      .then((data) => {
        if (!isMounted) return;
        setSlots(data.slots || []);
        // Reset selected time if it's no longer available in the new date
        setSelectedTime((prev) => {
          const match = data.slots?.find((s) => s.time === prev);
          return match?.available ? prev : "";
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load slots:", err);
        setError("Could not load slots for this date. Please try another date.");
        setSlots([]);
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, isOpen]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError("Please select both a date and an available time slot.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await doctorRescheduleAppointment(
        appointment.id,
        selectedDate,
        selectedTime,
        reason.trim() || "Rescheduled by doctor"
      );
      onSuccess(result.appointment);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reschedule appointment";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg p-6 rounded-2xl border shadow-2xl bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Reschedule Appointment
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Patient: <span className="font-semibold text-[var(--text-secondary)]">{appointment.patientName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Schedule Summary */}
        <div className="my-4 p-3 rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border-color)] text-xs flex items-center justify-between">
          <span className="text-[var(--text-muted)]">Current Slot:</span>
          <span className="font-semibold text-[var(--text-secondary)]">
            {appointment.appointmentDate} at {appointment.appointmentTime} ({appointment.consultationType})
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Select New Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          {/* Time Slots Grid */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[var(--text-secondary)]">
                Select New Time Slot
              </label>
              {loadingSlots && (
                <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin text-sage-600" /> Checking availability...
                </span>
              )}
            </div>

            {slots.length === 0 && !loadingSlots ? (
              <div className="p-4 rounded-xl border border-dashed border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
                No slots available on this date. Clinic may be closed.
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                {slots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`
                        px-2.5 py-2 rounded-xl text-xs font-semibold transition-all border
                        ${
                          isSelected
                            ? "bg-sage-600 border-sage-600 text-white shadow-xs"
                            : slot.available
                            ? "border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-sage-400 text-[var(--text-primary)]"
                            : "border-[var(--border-color)] bg-[var(--bg-muted)] text-[var(--text-muted)] opacity-50 cursor-not-allowed"
                        }
                      `}
                    >
                      {slot.time}
                      {!slot.available && (
                        <span className="block text-[9px] font-normal uppercase mt-0.5">
                          {slot.reason === "past" ? "Past" : "Booked"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Reschedule Reason (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Patient requested morning consultation, Doctor schedule change"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedDate || !selectedTime}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-sage-600 hover:bg-sage-700 disabled:opacity-50 text-white shadow-xs transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Rescheduling...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Confirm Reschedule</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

