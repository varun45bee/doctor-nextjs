"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { X, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { createAppointmentLookup } from "@/lib/appointment-lookup";
import {
  INDIAN_MOBILE_ERROR,
  isValidIndianMobileNumber,
} from "@/lib/phone-validation";
import { useLanguage } from "@/lib/language-context";
import {
  fetchAvailabilitySettings,
  fetchBookedSlotsForDate,
  type AvailabilitySettings,
} from "@/lib/firestore/availability";

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

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [availability, setAvailability] = useState<AvailabilitySettings | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        phone: "",
        email: "",
        age: "",
        condition: defaultCondition,
        date: "",
        time: "",
        message: "",
      });
      setSubmitted(false);
      setError("");
      setBookedSlots([]);
      setSlotError("");
      
      const getSettings = async () => {
        const settings = await fetchAvailabilitySettings();
        setAvailability(settings);
      };
      getSettings();

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
    setBookedSlots([]);

    if (!selectedDateStr) return;

    try {
      // Validate active day of the week
      const selectedDate = new Date(selectedDateStr + "T00:00:00");
      const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

      if (availability && !availability.weeklyDays.includes(dayOfWeek)) {
        const dayNames = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];
        setSlotError(`Doctor is not available on ${dayNames[dayOfWeek]}.`);
        return;
      }

      setLoadingSlots(true);
      const booked = await fetchBookedSlotsForDate(selectedDateStr);
      setBookedSlots(booked);
    } catch (err) {
      console.error("Error loading slots:", err);
      setSlotError("Failed to check slot availability.");
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

    const email = form.email.trim();
    if (!email) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    const phone = form.phone.trim();
    if (!isValidIndianMobileNumber(phone)) {
      setError(INDIAN_MOBILE_ERROR);
      setLoading(false);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "appointments"), {
        patientName: form.name,
        patientEmail: email,
        patientPhone: phone,
        appointmentDate: form.date,
        appointmentTime: form.time,
        status: "Pending",
        condition: form.condition,
        age: form.age,
        message: form.message,
        lang: locale,
        createdAt: serverTimestamp(),
      });

      await createAppointmentLookup({
        patientPhone: phone,
        patientName: form.name,
        appointmentDate: form.date,
        appointmentTime: form.time,
        appointmentId: docRef.id,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Firebase submission error:", err);
      setError("Could not save your details. Please try again.");
    }

    setLoading(false);
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
      className="fixed inset-0 z-[100] h-[100dvh] overflow-y-auto overscroll-contain p-4 sm:flex sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="appointment-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative mx-auto my-4 w-full max-w-lg max-h-[calc(100dvh-2rem)] scroll-pb-8 overflow-y-auto rounded-2xl border shadow-2xl [-webkit-overflow-scrolling:touch] sm:my-0"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-sage-100 dark:hover:bg-sage-800 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
        </button>

        <div className="p-6 pb-10 sm:p-8 sm:pb-12">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3
                id="appointment-modal-title"
                className="font-serif text-2xl mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {t.contact.successTitle}
              </h3>
              <p className="text-sage-600 text-sm mb-2">{t.contact.successDesc}</p>
              <p className="text-sage-500 text-xs mb-6">
                You will receive an email when your appointment is
                confirmed. You can also check status anytime using your phone
                number.
              </p>
              <Link
                href="/check-appointment"
                className="inline-block mb-4 text-sage-600 text-sm underline"
              >
                Check appointment status
              </Link>
              <br />
              <button
                onClick={onClose}
                className="bg-sage-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-sage-600 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2
                id="appointment-modal-title"
                className="font-serif text-2xl mb-1 pr-8"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "var(--text-primary)",
                }}
              >
                {t.contact.formTitle}
              </h2>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Fill in your details and we&apos;ll confirm your appointment shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  required
                  type="text"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    pattern="(?:\+?91[\s-]?)?[6-9][0-9\s-]{9,12}"
                    title={INDIAN_MOBILE_ERROR}
                    placeholder="Phone *"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  />
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

                <input
                  required
                  type="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                />

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

                <div className="space-y-3">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>
                    Select Consultation Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>
                    Select Available Time Slot *
                  </label>
                  {!form.date ? (
                    <div className="text-xs p-3 border border-dashed rounded-xl text-center" style={{ color: "var(--text-muted)", borderColor: "var(--border-mid)" }}>
                      Please select a date first to view slot availability.
                    </div>
                  ) : loadingSlots ? (
                    <div className="text-xs p-3 text-center animate-pulse" style={{ color: "var(--text-secondary)" }}>
                      Checking slot availability...
                    </div>
                  ) : slotError ? (
                    <div className="text-xs p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-center font-semibold">
                      {slotError}
                    </div>
                  ) : availability && availability.slots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availability.slots.map((slot) => {
                        const isBooked = bookedSlots.includes(slot);
                        const isSelected = form.time === slot;

                        // Format time to 12 hour AM/PM for neat display
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
                            className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                              isSelected
                                ? "bg-sage-600 border-sage-600 text-white shadow-sm"
                                : isBooked
                                ? "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/10 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed line-through"
                                : "hover:border-sage-400 text-zinc-700 dark:text-zinc-300"
                            }`}
                            style={{
                              backgroundColor: isSelected ? undefined : (isBooked ? undefined : "var(--bg-surface)"),
                              borderColor: isSelected ? undefined : (isBooked ? undefined : "var(--border-color)")
                            }}
                          >
                            <span>{displayTime}</span>
                            {isBooked && <span className="block text-[8px] opacity-75 font-normal">Booked</span>}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs p-3 border border-dashed rounded-xl text-center" style={{ color: "var(--text-muted)", borderColor: "var(--border-mid)" }}>
                      No consultation slots configured by doctor.
                    </div>
                  )}
                  {/* Keep hidden validation active */}
                  <input type="hidden" required value={form.time} />
                </div>

                {/* <textarea
                  rows={3}
                  placeholder="Additional message (optional)"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                /> */}

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sage-500 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-sage-600 transition-colors disabled:opacity-60"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.contact.submit}
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
