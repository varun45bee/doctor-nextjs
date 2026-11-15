"use client";

import { useEffect, useState, useMemo } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  X,
  Send,
  CheckCircle,
  Video,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { createAppointmentLookup } from "@/lib/appointment-lookup";
import { useLanguage } from "@/lib/language-context";
import { useAuth } from "@/lib/auth-context";
import {
  fetchAvailabilitySettings,
  fetchBookedSlotsForDate,
  type AvailabilitySettings,
} from "@/lib/firestore/availability";
import { isValidIndianMobileNumber, getIndianMobileDigits } from "@/lib/phone-validation";
import type { ConsultationType } from "@/lib/types/appointment";

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

const DEFAULT_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
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
  const { user, userProfile } = useAuth();

  const consultationType: ConsultationType = "online";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    condition: defaultCondition || "",
    date: "",
    time: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [confirmedData, setConfirmedData] = useState<{
    id: string;
    name: string;
    phone: string;
    date: string;
    time: string;
    type: ConsultationType;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [availability, setAvailability] = useState<AvailabilitySettings | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");

  // Minimum date is today
  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Prepopulate form if user is signed in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || userProfile?.fullName || user.displayName || "",
        email: prev.email || user.email || "",
        phone: prev.phone || userProfile?.phone || "",
      }));
    }
  }, [user, userProfile]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      setForm((prev) => ({
        name: userProfile?.fullName || user?.displayName || prev.name || "",
        phone: userProfile?.phone || prev.phone || "",
        email: user?.email || prev.email || "",
        age: prev.age || "",
        condition: defaultCondition || prev.condition || "",
        date: tomorrowStr,
        time: "",
        message: "",
      }));
      setSubmitted(false);
      setConfirmedData(null);
      setError("");
      setBookedSlots([]);
      setSlotError("");

      const getSettings = async () => {
        try {
          const settings = await fetchAvailabilitySettings();
          setAvailability(settings);
        } catch (e) {
          console.warn("Could not load availability settings:", e);
        }
      };
      getSettings();
      loadSlotsForDate(tomorrowStr);

      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, defaultCondition]);

  const loadSlotsForDate = async (selectedDateStr: string) => {
    setSlotError("");
    setBookedSlots([]);

    if (!selectedDateStr) return;

    try {
      // Validate active day of week (0 = Sunday)
      const selectedDate = new Date(selectedDateStr + "T00:00:00");
      const dayOfWeek = selectedDate.getDay();

      if (dayOfWeek === 0) {
        setSlotError("The clinic is closed on Sundays. Please select Monday to Saturday.");
        return;
      }

      setLoadingSlots(true);
      const booked = await fetchBookedSlotsForDate(selectedDateStr);
      setBookedSlots(booked);
    } catch (err) {
      console.error("Error loading booked slots:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (selectedDateStr: string) => {
    setForm((prev) => ({ ...prev, date: selectedDateStr, time: "" }));
    loadSlotsForDate(selectedDateStr);
  };

  // Keyboard navigation: Escape to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // 1. Validation
    const name = form.name.trim();
    if (!name || name.length < 2) {
      setError("Please enter the patient's full name (at least 2 characters).");
      return;
    }

    const cleanDigits = form.phone.replace(/\D/g, "");
    if (!cleanDigits || cleanDigits.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const email = form.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!form.date) {
      setError("Please select an appointment date.");
      return;
    }

    if (!form.time) {
      setError("Please select an available time slot.");
      return;
    }

    setLoading(true);

    try {
      // 2. Direct write to Firebase Firestore appointments collection
      const docRef = await addDoc(collection(db, "appointments"), {
        patientName: name,
        patientEmail: email,
        patientPhone: form.phone.trim(),
        appointmentDate: form.date,
        appointmentTime: form.time,
        consultationType,
        status: "Pending",
        condition: form.condition || "General Consultation",
        age: form.age ? String(form.age) : "",
        message: form.message ? form.message.trim() : "",
        lang: locale,
        patientId: user?.uid || null,
        doctorId: "default_doctor",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 3. Create appointment lookup record for phone-based status checking
      try {
        await createAppointmentLookup({
          patientPhone: form.phone.trim(),
          patientName: name,
          appointmentDate: form.date,
          appointmentTime: form.time,
          appointmentId: docRef.id,
        });
      } catch (lookupErr) {
        console.warn("Could not create phone lookup record:", lookupErr);
      }

      setConfirmedData({
        id: docRef.id,
        name,
        phone: form.phone.trim(),
        date: form.date,
        time: form.time,
        type: consultationType,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      console.error("Firebase booking submission error:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(`Could not save your appointment (${errMsg}). Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 dark:focus:ring-emerald-500 transition-all";
  const inputStyle = {
    backgroundColor: "var(--bg-surface)",
    borderColor: "var(--border-color)",
    color: "var(--text-primary)",
  };

  const activeSlots = availability?.slots?.length ? availability.slots : DEFAULT_SLOTS;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all"
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
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
        </button>

        <div className="p-6 sm:p-8">
          {submitted && confirmedData ? (
            /* ──────────────────────────────────────────────────────── */
            /* SUCCESS CONFIRMATION SCREEN                             */
            /* ──────────────────────────────────────────────────────── */
            <div className="text-center py-4 sm:py-6 space-y-5 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-700">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div>
                <h3
                  id="appointment-modal-title"
                  className="font-serif text-2xl sm:text-3xl font-bold mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "var(--text-primary)",
                  }}
                >
                  {t?.contact?.successTitle || "Appointment Request Received!"}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  {t?.contact?.successDesc ||
                    "Thank you. Your consultation has been booked directly in our clinic records."}
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-secondary)]">Patient:</span>
                  <span className="font-semibold text-[var(--text-primary)]">{confirmedData.name}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-secondary)]">Mobile:</span>
                  <span className="font-semibold text-[var(--text-primary)]">{confirmedData.phone}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[var(--border-color)]/60">
                  <span className="text-[var(--text-secondary)]">Date &amp; Time:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {confirmedData.date} at {confirmedData.time}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[var(--text-secondary)]">Consultation:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" />
                    <span>Online Consultation</span>
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                You will receive confirmation via WhatsApp and email. You can check your appointment status anytime
                using your phone number.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/check-appointment"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-[var(--border-color)] hover:border-emerald-600 text-xs font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all text-center"
                >
                  Check Appointment Status
                </Link>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-[#184433] hover:bg-[#123628] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ──────────────────────────────────────────────────────── */
            /* BOOKING FORM                                            */
            /* ──────────────────────────────────────────────────────── */
            <>
              <div className="mb-5">
                <h2
                  id="appointment-modal-title"
                  className="font-serif text-2xl sm:text-3xl font-bold pr-8 mb-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "var(--text-primary)",
                  }}
                >
                  {t?.contact?.formTitle || "Book an Appointment"}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  Enter your phone number &amp; details for your online consultation. We&apos;ll confirm your slot shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 100% Online Clinic Badge */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40">
                  <div className="w-8 h-8 rounded-xl bg-[#184433] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                      100% Online Consultation
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Video &amp; audio calls • Doorstep homeopathic medicine delivery
                    </p>
                  </div>
                </div>

                {/* Patient Name */}
                <div>
                  <label className="text-xs font-semibold block mb-1 text-[var(--text-secondary)]">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Ramesh Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                {/* Phone & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold block mb-1 text-[var(--text-secondary)]">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile (e.g. 9876543210)"
                        value={form.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setForm({ ...form, phone: val });
                        }}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1 text-[var(--text-secondary)]">
                      Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Age"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-semibold block mb-1 text-[var(--text-secondary)]">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                {/* Condition / Concern */}
                <div>
                  <label className="text-xs font-semibold block mb-1 text-[var(--text-secondary)]">
                    Primary Concern / Condition *
                  </label>
                  <select
                    required
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Select Condition *</option>
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    {defaultCondition && !CONDITIONS.includes(defaultCondition) && (
                      <option value={defaultCondition}>{defaultCondition}</option>
                    )}
                  </select>
                </div>

                {/* Preferred Date */}
                <div>
                  <label className="text-xs font-semibold block mb-1 text-[var(--text-secondary)]">
                    Select Consultation Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    min={minDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                {/* Time Slot Picker */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold block text-[var(--text-secondary)]">
                    Select Available Time Slot *
                  </label>

                  {!form.date ? (
                    <div className="text-xs p-3 border border-dashed rounded-xl text-center text-zinc-400 border-[var(--border-color)]">
                      Please pick a date first to view slots.
                    </div>
                  ) : loadingSlots ? (
                    <div className="text-xs p-3 text-center text-zinc-400 flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Checking slot availability...</span>
                    </div>
                  ) : slotError ? (
                    <div className="text-xs p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-xl text-center font-medium">
                      {slotError}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {activeSlots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = form.time === slot;

                        // 12-hour AM/PM label
                        let displayTime = slot;
                        try {
                          const [h, m] = slot.split(":");
                          const hours = parseInt(h, 10);
                          const ampm = hours >= 12 ? "PM" : "AM";
                          const h12 = hours % 12 || 12;
                          displayTime = `${h12}:${m} ${ampm}`;
                        } catch {}

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setForm({ ...form, time: slot })}
                            className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#184433] border-[#184433] text-white shadow-sm font-semibold"
                                : isBooked
                                ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed line-through"
                                : "border-[var(--border-color)] hover:border-emerald-600 hover:bg-[var(--bg-subtle)] text-[var(--text-primary)]"
                            }`}
                            style={{
                              backgroundColor: isSelected ? undefined : (isBooked ? undefined : "var(--bg-surface)"),
                            }}
                          >
                            <span>{displayTime}</span>
                            {isBooked && (
                              <span className="block text-[8px] opacity-75 font-normal">Booked</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <input type="hidden" required value={form.time} />
                </div>

                {/* Additional Message */}
                <div>
                  <label className="text-xs font-semibold block mb-1 text-[var(--text-secondary)]">
                    Additional Message (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe your symptoms or medical history..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#184433] hover:bg-[#123628] text-white py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold shadow-md transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Clinic Records...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t?.contact?.submit || "Confirm & Book Appointment"}</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
