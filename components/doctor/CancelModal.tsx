"use client";

import { useState } from "react";
import { X, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import type { Appointment } from "@/lib/types/appointment";
import { doctorCancelAppointment } from "@/lib/services/doctor-api";

type CancelModalProps = {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedAppt: Appointment) => void;
};

const CANCELLATION_PRESETS = [
  "Patient requested cancellation",
  "Patient unresponsive / did not attend",
  "Medical emergency / clinic schedule adjustment",
  "Duplicate booking",
];

export default function CancelModal({
  appointment,
  isOpen,
  onClose,
  onSuccess,
}: CancelModalProps) {
  const [reason, setReason] = useState(CANCELLATION_PRESETS[0]);
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = customReason.trim() ? customReason.trim() : reason;
    if (!finalReason) {
      setError("Please provide a reason for cancellation.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await doctorCancelAppointment(appointment.id, finalReason);
      onSuccess(result.appointment);
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to cancel appointment";
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
        className="relative w-full max-w-md p-6 rounded-2xl border shadow-2xl bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Cancel Appointment
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

        {/* Warning info */}
        <div className="my-4 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 text-xs text-rose-800 dark:text-rose-300 space-y-1">
          <p className="font-semibold">This action will:</p>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] opacity-90">
            <li>Mark the appointment as Cancelled</li>
            <li>Release the slot lock so another patient may book</li>
            <li>Send a cancellation notification to the patient</li>
            <li>Log an audit event with your doctor credentials</li>
          </ul>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Preset selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
              Cancellation Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {CANCELLATION_PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
              <option value="other">Other reason...</option>
            </select>
          </div>

          {/* Custom text if other */}
          {reason === "other" && (
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Specify Reason
              </label>
              <textarea
                rows={2}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter detailed cancellation reason..."
                required
                className="w-full px-3 py-2 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white shadow-xs transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Confirm Cancellation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

