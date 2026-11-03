"use client";

import { useEffect, useState, useId } from "react";
import {
  X,
  Send,
  CheckCircle,
  Video,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import type { ConsultationType, Appointment } from "@/lib/types/appointment";

const CONDITIONS = [
  "PCOD / PCOS",
  "Thyroid Disorder",
  "Menopause",
  "Child Immunity",
  "ADHD / Behavioral",
  "Allergies",
  "Arthritis",
  "Migraines",
  "Skin Disorders",
  "Digestive Issues",
  "Anxiety / Stress",
  "Other",
];

type AppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultCondition?: string;
};

export default function AppointmentModal({
  isOpen,
  onClose,
  defaultCondition = "",
}: AppointmentModalProps) {
  const { t, locale } = useLanguage();
  const modalId = useId();

  // Form State
  const [consultationType, setConsultationType] = useState<ConsultationType>("online");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    condition: "",
    date: "",
    time: "",
    message: "",
  });
  const [consentGiven, setConsentGiven] = useState(true);

  // Slot Fetching State
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean; reason?: string }[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Reschedule / Cancel inside modal state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState("");
  const [copiedMeet, setCopiedMeet] = useState(false);

  // Reset or init on open
  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        phone: "",
        email: "",
        age: "",
        condition: defaultCondition || "",
        date: "",
        time: "",
        message: "",
      });
      setConsultationType("online");
      setConsentGiven(true);
      setConfirmedAppointment(null);
      setError("");
      setAvailableSlots([]);
      setSlotError("");
      setIsRescheduling(false);
      setActionSuccessMessage("");

      // Default date to tomorrow in YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      handleDateChange(tomorrowStr);

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, defaultCondition]);

  const handleDateChange = async (selectedDateStr: string) => {
    setForm((prev) => ({ ...prev, date: selectedDateStr, time: "" }));
    setSlotError("");
    setAvailableSlots([]);

    if (!selectedDateStr) return;

    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/availability?date=${selectedDateStr}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSlotError(data.error || "Could not fetch slots for this date.");
      } else if (!data.isWorkingDay) {
        setSlotError("Clinic is closed on this day. Please pick another date.");
      } else {
        setAvailableSlots(data.slots || []);
        if (data.availableSlotsCount === 0) {
          setSlotError("No slots available for this date. Please pick another date.");
        }
      }
    } catch (err) {
      console.error("Availability fetch error:", err);
      setSlotError("Unable to connect to availability service.");
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name.trim()) {
      setError("Please enter patient name.");
      setLoading(false);
      return;
    }

    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) {
      setError("Please provide a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    if (!form.email.trim() || !form.email.includes("@")) {
      setError("Please provide a valid email address.");
      setLoading(false);
      return;
    }

    if (!form.date || !form.time) {
      setError("Please select both a date and an available time slot.");
      setLoading(false);
      return;
    }

    if (!consentGiven) {
      setError("Please accept the consultation consent notice to continue.");
      setLoading(false);
      return;
    }

    try {
      const idempotencyKey = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({
          patientName: form.name.trim(),
          patientPhone: form.phone.trim(),
          patientEmail: form.email.trim().toLowerCase(),
          appointmentDate: form.date,
          appointmentTime: form.time,
          consultationType,
          condition: form.condition,
          age: form.age,
          message: form.message,
          lang: locale,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to book appointment. Please try another slot.");
      } else {
        setConfirmedAppointment(data.appointment);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Network error while booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!confirmedAppointment) return;
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${confirmedAppointment.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: confirmedAppointment.accessSecret,
          reason: "Cancelled by patient via booking portal",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedAppointment(data.appointment);
        setActionSuccessMessage("Your appointment has been cancelled successfully.");
      } else {
        alert(data.error || "Could not cancel appointment.");
      }
    } catch (err) {
      alert("Error processing cancellation.");
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmedAppointment || !rescheduleDate || !rescheduleTime) {
      alert("Please select both a new date and time.");
      return;
    }

    setRescheduleLoading(true);
    try {
      const res = await fetch(`/api/appointments/${confirmedAppointment.id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: confirmedAppointment.accessSecret,
          newDate: rescheduleDate,
          newTime: rescheduleTime,
          reason: "Rescheduled by patient",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConfirmedAppointment(data.appointment);
        setIsRescheduling(false);
        setActionSuccessMessage("Your appointment was successfully rescheduled!");
      } else {
        alert(data.error || "Could not reschedule appointment.");
      }
    } catch (err) {
      alert("Error processing rescheduling.");
    } finally {
      setRescheduleLoading(false);
    }
  };

  const copyMeetLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedMeet(true);
    setTimeout(() => setCopiedMeet(false), 2000);
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400";
  const inputStyle = {
    backgroundColor: "var(--bg-surface)",
    borderColor: "var(--border-color)",
    color: "var(--text-primary)",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl flex flex-col"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
        </button>

        {/* Doctor Branding Banner */}
        <div className="p-6 sm:p-8 pb-4 border-b border-[var(--border-color)] bg-gradient-to-br from-sage-50 to-sage-100/40 dark:from-sage-950/40 dark:to-sage-900/20">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-sage-600 text-white flex items-center justify-center font-serif text-xl font-bold shadow-md">
              PA
            </div>
            <div>
              <h2
                id="appointment-modal-title"
                className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Dr. Pratima Agale
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                BHMS Classical Homeopath • 15+ Years Clinical Practice
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 pt-6">
          {/* CONFIRMATION SCREEN */}
          {confirmedAppointment ? (
            <div className="space-y-6">
              <div className="text-center">
                {confirmedAppointment.status === "Cancelled" ? (
                  <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center mx-auto mb-4 border border-red-200">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                )}

                <h3
                  className="font-serif text-2xl font-bold mb-1 text-[var(--text-primary)]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {confirmedAppointment.status === "Cancelled"
                    ? "Appointment Cancelled"
                    : "Appointment Confirmed!"}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Reference ID:{" "}
                  <span className="font-mono font-bold text-sage-600 dark:text-sage-400">
                    {confirmedAppointment.id}
                  </span>
                </p>
              </div>

              {actionSuccessMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}

              {/* Consultation Summary Card */}
              <div className="rounded-2xl border p-5 space-y-3 bg-[var(--bg-base)] border-[var(--border-color)]">
                <div className="flex items-center justify-between text-sm pb-2 border-b border-[var(--border-color)]">
                  <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sage-600" /> Date
                  </span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {confirmedAppointment.appointmentDate}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pb-2 border-b border-[var(--border-color)]">
                  <span className="text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sage-600" /> Time
                  </span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {confirmedAppointment.appointmentTime} (IST)
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm pb-2 border-b border-[var(--border-color)]">
                  <span className="text-[var(--text-secondary)]">Mode</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-800 dark:bg-sage-900/40 dark:text-sage-300">
                    {confirmedAppointment.consultationType === "online" ? (
                      <>
                        <Video className="w-3.5 h-3.5 text-sage-600" /> Online (Google Meet)
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3.5 h-3.5 text-sage-600" /> In-Person Clinic (Kalyan)
                      </>
                    )}
                  </span>
                </div>

                {/* Google Meet Link Display if Online */}
                {confirmedAppointment.consultationType === "online" && (
                  <div className="pt-2">
                    {confirmedAppointment.googleMeetUrl ? (
                      <div className="p-4 rounded-xl bg-sage-50/80 dark:bg-sage-950/60 border border-sage-200 dark:border-sage-800 text-center space-y-3">
                        <p className="text-xs font-semibold text-sage-800 dark:text-sage-200">
                          Your Google Meet Video Consultation Link:
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={confirmedAppointment.googleMeetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white text-xs font-bold shadow-md transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            Join Google Meet
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => copyMeetLink(confirmedAppointment.googleMeetUrl!)}
                            className="p-2.5 rounded-xl border border-sage-300 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-900 text-[var(--text-primary)] transition-colors"
                            title="Copy Meet URL"
                          >
                            {copiedMeet ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)] break-all">
                          {confirmedAppointment.googleMeetUrl}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>
                          Your Google Meet link will be generated and emailed shortly before your session.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* In-Person Clinic Address */}
                {confirmedAppointment.consultationType === "in-person" && (
                  <div className="pt-2 text-xs text-[var(--text-secondary)] space-y-1">
                    <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-sage-600" /> Clinic Address:
                    </p>
                    <p className="pl-5">
                      Dr. Pratima Agale Homeopathy Clinic, Near Station, Kalyan, Maharashtra 421301.
                    </p>
                    <p className="pl-5 text-[11px] text-[var(--text-muted)]">
                      Please arrive 10 minutes before your scheduled appointment time.
                    </p>
                  </div>
                )}
              </div>

              {/* Patient Next Steps & Notifications Info */}
              <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] space-y-2">
                <div className="flex items-center gap-2 font-semibold text-[var(--text-primary)]">
                  <ShieldCheck className="w-4 h-4 text-sage-600" /> What happens next?
                </div>
                <p>
                  • A confirmation email has been dispatched to <strong>{confirmedAppointment.patientEmail}</strong> with your calendar invitation.
                </p>
                <p>
                  • WhatsApp notifications will be delivered to <strong>{confirmedAppointment.patientPhone}</strong>.
                </p>
                <p>
                  • You can check appointment progress, access remedies, or submit symptom updates anytime at{" "}
                  <Link href="/check-appointment" className="text-sage-600 underline font-medium">
                    Patient Portal
                  </Link>.
                </p>
              </div>

              {/* Reschedule Form Accordion */}
              {isRescheduling && (
                <form
                  onSubmit={handleRescheduleSubmit}
                  className="p-5 rounded-2xl border border-sage-300 dark:border-sage-700 bg-[var(--bg-base)] space-y-4"
                >
                  <h4 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-sage-600" /> Select New Date & Time
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">
                        New Date
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={rescheduleDate}
                        onChange={(e) => {
                          setRescheduleDate(e.target.value);
                          handleDateChange(e.target.value);
                        }}
                        className={inputClass}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 text-[var(--text-secondary)]">
                        New Time
                      </label>
                      <select
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                        className={inputClass}
                        style={inputStyle}
                        required
                      >
                        <option value="">Select time</option>
                        {availableSlots
                          .filter((s) => s.available)
                          .map((s) => (
                            <option key={s.time} value={s.time}>
                              {s.time}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      className="px-4 py-2 text-xs rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={rescheduleLoading}
                      className="px-4 py-2 text-xs rounded-xl bg-sage-600 text-white font-semibold hover:bg-sage-700 disabled:opacity-50"
                    >
                      {rescheduleLoading ? "Rescheduling..." : "Confirm New Slot"}
                    </button>
                  </div>
                </form>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {confirmedAppointment.status !== "Cancelled" && !isRescheduling && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(true)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-sage-300 dark:border-sage-700 hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors text-sage-700 dark:text-sage-300 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelBooking}
                      disabled={loading}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="ml-auto bg-sage-600 text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-sage-700 transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* BOOKING FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Online Consultation Notice Card */}
              <div className="p-4 rounded-2xl border border-sage-300 dark:border-sage-800 bg-gradient-to-r from-sage-50/90 to-emerald-50/50 dark:from-sage-950/60 dark:to-emerald-950/30 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sage-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                      Online Video Consultation (Google Meet)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                    Consultations are conducted online via secure Google Meet video calls. An automatic calendar invitation and private meeting link are issued upon booking.
                  </p>
                </div>
              </div>

              {/* Date & Dynamic Slot Picker */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={form.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">
                    Available Time Slot (Asia/Kolkata) *
                  </label>

                  {loadingSlots ? (
                    <div className="p-4 border rounded-xl text-center text-xs text-[var(--text-secondary)] bg-[var(--bg-base)] border-[var(--border-color)]">
                      Checking doctor availability...
                    </div>
                  ) : slotError ? (
                    <div className="p-3 border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-xs text-amber-800 dark:text-amber-200">
                      {slotError}
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                      {availableSlots.map((slot) => {
                        const isSelected = form.time === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setForm((prev) => ({ ...prev, time: slot.time }))}
                            className={`py-2 px-2.5 text-xs font-medium rounded-xl border transition-all text-center ${
                              isSelected
                                ? "bg-sage-600 text-white border-sage-600 shadow-sm"
                                : slot.available
                                ? "border-[var(--border-color)] hover:border-sage-400 bg-[var(--bg-surface)] text-[var(--text-primary)]"
                                : "opacity-40 cursor-not-allowed bg-[var(--bg-subtle)] border-dashed border-[var(--border-color)] text-[var(--text-muted)]"
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-3 border rounded-xl text-center text-xs text-[var(--text-secondary)] bg-[var(--bg-base)] border-[var(--border-color)]">
                      Select a date above to view slots.
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">
                    Mobile Number * (for WhatsApp reminder)
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">
                    Email Address * (for Google Calendar & Meet link)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">
                    Primary Health Concern
                  </label>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm((prev) => ({ ...prev, condition: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Select health condition</option>
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--text-secondary)]">
                  Brief Medical Notes or Symptoms (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Share any key symptoms or questions for Dr. Pratima..."
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id={`consent-${modalId}`}
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-0.5 rounded text-sage-600 focus:ring-sage-400"
                />
                <label
                  htmlFor={`consent-${modalId}`}
                  className="text-[11px] text-[var(--text-secondary)] leading-relaxed cursor-pointer"
                >
                  I consent to receive consultation reminders, Google Meet calendar invitations, and clinical updates via WhatsApp and Email in accordance with clinic privacy practices.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !form.time}
                className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Reserving Slot & Syncing Calendar...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm Consultation</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
