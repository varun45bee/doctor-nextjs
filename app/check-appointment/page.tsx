"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Printer,
  Heart,
  Activity,
  FileText,
  Sliders,
  CheckCircle,
  AlertCircle,
  Video,
  MapPin,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { getAppointmentByPhone } from "@/lib/appointment-lookup";
import { fetchAppointmentById, addPatientProgressLog } from "@/lib/firestore/appointments";
import {
  getStatusColor,
  getStatusLabel,
} from "@/lib/notifications/patient-message";
import type { Appointment, ProgressLog } from "@/lib/types/appointment";

function CheckAppointmentContent() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  
  // Patient Portal Session State
  const [patientAppointment, setPatientAppointment] = useState<Appointment | null>(null);
  const [activePortalTab, setActivePortalTab] = useState<"status" | "prescription" | "progress">("status");
  const [copiedMeet, setCopiedMeet] = useState(false);

  // Auto-login if id and token are in URL
  useEffect(() => {
    const id = searchParams?.get("id");
    const token = searchParams?.get("token");

    if (id && token) {
      setLoading(true);
      fetch(`/api/appointments/${id}?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.appointment) {
            setPatientAppointment(data.appointment);
            setActivePortalTab("status");
          }
        })
        .catch((err) => console.error("Direct appointment load error:", err))
        .finally(() => setLoading(false));
    }
  }, [searchParams]);

  // Progress Log form state
  const [symptomRating, setSymptomRating] = useState(5);
  const [progressNotes, setProgressNotes] = useState("");
  const [submittingLog, setSubmittingLog] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [logError, setLogError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setPatientAppointment(null);

    try {
      const lookupData = await getAppointmentByPhone(phone);
      if (lookupData && lookupData.appointmentId) {
        // Fetch full clinical appointment containing prescriptions & logs
        const fullAppointment = await fetchAppointmentById(lookupData.appointmentId);
        if (fullAppointment) {
          setPatientAppointment(fullAppointment);
          setActivePortalTab("status");
        } else {
          setNotFound(true);
        }
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!patientAppointment) return;
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${patientAppointment.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: patientAppointment.accessSecret,
          reason: "Cancelled by patient via portal",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPatientAppointment(data.appointment);
        alert("Appointment successfully cancelled.");
      } else {
        alert(data.error || "Could not cancel appointment.");
      }
    } catch {
      alert("Error cancelling appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setPatientAppointment(null);
    setPhone("");
    setNotFound(false);
  };

  const handleSubmitProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientAppointment) return;

    setSubmittingLog(true);
    setLogError("");
    setLogSuccess(false);

    try {
      const log: ProgressLog = {
        rating: symptomRating,
        notes: progressNotes,
        loggedAt: new Date().toISOString()
      };

      await addPatientProgressLog(patientAppointment.id, log);
      setLogSuccess(true);
      setProgressNotes("");
      
      // Update local state to sync timeline in UI
      setPatientAppointment((prev) => {
        if (!prev) return null;
        const existingLogs = prev.progressLogs || [];
        return {
          ...prev,
          progressLogs: [log, ...existingLogs]
        };
      });

      setTimeout(() => setLogSuccess(false), 4000);
    } catch (err) {
      console.error("Log submission error:", err);
      setLogError("Failed to submit progress log. Please try again.");
    } finally {
      setSubmittingLog(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date: string) => {
    if (!date) return "—";
    try {
      return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="pt-24 min-h-screen px-4 sm:px-6 pb-16 page-enter">
      <div className="max-w-2xl mx-auto">
        
        {/* LOGGED OUT: Enter Phone Number */}
        {!patientAppointment ? (
          <div className="max-w-md mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm mb-6 hover:text-sage-600 transition-colors"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <h1
              className="font-serif text-3xl mb-2"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "var(--text-primary)",
              }}
            >
              Secure Patient Portal
            </h1>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              Access your digital prescriptions, treatment tracking, and appointment details securely using your registered phone number.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 mb-8">
              <input
                required
                type="tel"
                placeholder="Phone number (+91 XXXXX XXXXX)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sage-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-sage-600 transition-colors disabled:opacity-60"
              >
                <Search className="w-4 h-4" />
                {loading ? "Verifying..." : "Enter Portal"}
              </button>
            </form>

            {notFound && (
              <div
                className="p-5 rounded-xl border text-center"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-color)",
                }}
              >
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  No active consultation file found for this number. Check details or contact the clinic.
                </p>
                <a
                  href="https://wa.me/917045532232?text=Hello%2C%20I%20would%20like%20to%20access%20the%20Patient%20Portal."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sage-600 text-sm underline"
                >
                  Contact on WhatsApp
                </a>
              </div>
            )}
          </div>
        ) : (
          /* LOGGED IN: Secured Care Dashboard */
          <div className="space-y-6">
            {/* Portal Header */}
            <div
              className="p-5 rounded-2xl border flex items-center justify-between gap-4"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-sage-600 dark:text-sage-400">
                  Welcome to Patient Portal
                </span>
                <h2 className="font-serif text-xl sm:text-2xl mt-0.5" style={{ color: "var(--text-primary)", fontFamily: "'Cormorant Garamond', serif" }}>
                  {patientAppointment.patientName}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border hover:bg-sage-50 dark:hover:bg-sage-900/20 transition-all"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>

            {/* Portal Tab Switcher */}
            <div className="flex border-b text-sm" style={{ borderColor: "var(--border-color)" }}>
              {[
                { id: "status", label: "Booking Status", icon: Calendar },
                { id: "prescription", label: "My Prescriptions", icon: FileText },
                { id: "progress", label: "Symptom Tracker", icon: Activity }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activePortalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePortalTab(tab.id as "status" | "prescription" | "progress")}
                    className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 font-semibold transition-all ${
                      active
                        ? "border-sage-600 text-sage-600 dark:text-sage-400 bg-sage-50/20 dark:bg-sage-900/10"
                        : "border-transparent text-zinc-500 hover:text-sage-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(" ")[1] || tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT PANELS */}
            <div className="min-h-[300px]">
              {/* TAB 1: BOOKING STATUS */}
              {activePortalTab === "status" && (
                <div className="space-y-4 page-enter">
                  <div
                    className="p-6 rounded-2xl border space-y-4"
                    style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
                  >
                    <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-color)" }}>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                        Consultation Status
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(patientAppointment.status)}`}>
                        {getStatusLabel(patientAppointment.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-sage-50 dark:bg-sage-900/40 text-sage-600 dark:text-sage-400">
                          <User className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-[10px] text-zinc-400 font-medium uppercase">Consultant</p>
                          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Dr. Pratima Agale (BHMS)</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-sage-50 dark:bg-sage-900/40 text-sage-600 dark:text-sage-400">
                          <Calendar className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-[10px] text-zinc-400 font-medium uppercase">Scheduled Date</p>
                          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{formatDate(patientAppointment.appointmentDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-sage-50 dark:bg-sage-900/40 text-sage-600 dark:text-sage-400">
                          <Clock className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-[10px] text-zinc-400 font-medium uppercase">Time Slot</p>
                          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{patientAppointment.appointmentTime || "Not Assigned"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-xl bg-sage-50 dark:bg-sage-900/40 text-sage-600 dark:text-sage-400">
                          <Heart className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-[10px] text-zinc-400 font-medium uppercase">Condition Under Care</p>
                          <p className="font-semibold capitalize" style={{ color: "var(--text-primary)" }}>{patientAppointment.condition || "General Wellness"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Mode & Google Meet Details */}
                    <div className="pt-4 border-t border-[var(--border-color)]">
                      {patientAppointment.consultationType === "online" ? (
                        <div className="p-5 rounded-2xl bg-sage-50/70 dark:bg-sage-950/40 border border-sage-200 dark:border-sage-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-sage-800 dark:text-sage-200 flex items-center gap-1.5">
                              <Video className="w-4 h-4 text-sage-600" /> Online Video Consultation (Google Meet)
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-600">Video Consultation</span>
                          </div>

                          {patientAppointment.googleMeetUrl ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <a
                                  href={patientAppointment.googleMeetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-bold text-xs shadow-md transition-colors"
                                >
                                  <Video className="w-4 h-4" />
                                  Join Google Meet
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(patientAppointment.googleMeetUrl!);
                                    setCopiedMeet(true);
                                    setTimeout(() => setCopiedMeet(false), 2000);
                                  }}
                                  className="p-2.5 rounded-xl border border-sage-300 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-900 text-[var(--text-primary)]"
                                  title="Copy Meet URL"
                                >
                                  {copiedMeet ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                              <p className="text-[11px] text-[var(--text-muted)] break-all">
                                {patientAppointment.googleMeetUrl}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-[var(--text-secondary)]">
                              Google Meet room is being prepared and will appear here shortly before your session.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] space-y-1">
                          <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-sage-600" /> Clinic Location:
                          </p>
                          <p className="pl-5">
                            Dr. Pratima Agale Homeopathy Clinic, Near Station, Kalyan, Maharashtra 421301.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Self-service Cancellation */}
                    {patientAppointment.status !== "Cancelled" && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={handleCancelAppointment}
                          disabled={loading}
                          className="px-4 py-2 rounded-xl text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    )}

                    {patientAppointment.status === "Pending" && (
                      <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-250/30 rounded-xl text-xs flex gap-2.5" style={{ color: "var(--text-secondary)" }}>
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-800 dark:text-amber-400">Awaiting Clinical Review</p>
                          <p className="mt-1">Dr. Pratima Agale is currently reviewing slot schedules. Once approved, slot confirmation will be dispatched directly to your registered email.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVE PRESCRIPTION */}
              {activePortalTab === "prescription" && (
                <div className="space-y-4 page-enter">
                  {!patientAppointment.prescription ? (
                    <div className="p-10 border border-dashed rounded-2xl text-center text-zinc-400 dark:text-zinc-600" style={{ backgroundColor: "var(--bg-surface)" }}>
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>No Active Prescription</h4>
                      <p className="text-xs max-w-sm mx-auto mt-1">Prescriptions are issued digitally following clinical checkups. Ask Dr. Pratima's desk if this has not yet been loaded.</p>
                    </div>
                  ) : (
                    <div
                      id="prescription-print-area"
                      className="p-6 sm:p-8 rounded-2xl border space-y-6 shadow-sm relative overflow-hidden"
                      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
                    >
                      {/* Branded strip */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sage-500 to-teal-500"></div>

                      {/* Branded Header */}
                      <div className="flex justify-between items-start border-b pb-5" style={{ borderColor: "var(--border-color)" }}>
                        <div>
                          <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-wide" style={{ color: "var(--text-primary)", fontFamily: "'Cormorant Garamond', serif" }}>
                            Dr. Pratima Agale (BHMS)
                          </h3>
                          <p className="text-xs text-sage-600 dark:text-sage-400 font-medium">Homeopathic Consultant & Wellness Care</p>
                          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Reg No. 56241 | Yogidham Kalyan, MH</p>
                        </div>
                        <button
                          type="button"
                          onClick={handlePrint}
                          className="p-2 border rounded-xl hover:bg-sage-50 dark:hover:bg-sage-900/30 text-sage-600 dark:text-sage-400 flex items-center gap-1.5 text-xs font-semibold no-print"
                          style={{ borderColor: "var(--border-color)" }}
                        >
                          <Printer className="w-4 h-4" />
                          <span>Print Rx</span>
                        </button>
                      </div>

                      {/* Patient metadata */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-zinc-400 uppercase font-medium">Patient Name</p>
                          <p className="font-semibold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>{patientAppointment.patientName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-zinc-400 uppercase font-medium">Date Prescribed</p>
                          <p className="font-semibold text-sm mt-0.5" style={{ color: "var(--text-primary)" }}>
                            {new Date(patientAppointment.prescription.prescribedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Rx remedy info */}
                      <div className="p-5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-sage-50/20 dark:bg-sage-950/10" style={{ borderColor: "var(--border-color)" }}>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-red-500">Rx Remedy</span>
                          <h4 className="text-lg font-bold mt-1 text-sage-700 dark:text-sage-300">
                            {patientAppointment.prescription.remedy} {patientAppointment.prescription.potency}
                          </h4>
                          <p className="text-xs mt-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                            Dosage: {patientAppointment.prescription.dosage}
                          </p>
                        </div>
                        <span className="px-4 py-1.5 rounded-full border border-sage-200 dark:border-sage-800 text-xs font-bold bg-white dark:bg-zinc-900 text-sage-600 dark:text-sage-400">
                          {patientAppointment.prescription.duration}
                        </span>
                      </div>

                      {/* Diet Instructions advice */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">Diet & Intake Precautions</span>
                        <div className="p-4 rounded-xl border border-dashed text-xs italic bg-zinc-50/30 dark:bg-zinc-800/10" style={{ borderColor: "var(--border-mid)", color: "var(--text-secondary)" }}>
                          "{patientAppointment.prescription.instructions}"
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SYMPTOM TRACKER WIDGET */}
              {activePortalTab === "progress" && (
                <div className="space-y-6 page-enter">
                  {/* Submission Form Card */}
                  <div
                    className="p-6 rounded-2xl border space-y-4"
                    style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
                  >
                    <div className="flex items-center gap-2 border-b pb-3 mb-2" style={{ borderColor: "var(--border-color)" }}>
                      <Activity className="w-5 h-5 text-sage-500" />
                      <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                        Report Remedy Feedback
                      </h3>
                    </div>

                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Submit regular updates on symptom intensity and any changes you feel. This helps Dr. Pratima monitor your recovery progress before your next visit.
                    </p>

                    <form onSubmit={handleSubmitProgress} className="space-y-4 pt-2">
                      {/* Rating slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span style={{ color: "var(--text-secondary)" }}>Current Symptom Severity</span>
                          <span className="text-sm font-bold text-red-500">{symptomRating}/10</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={symptomRating}
                          onChange={(e) => setSymptomRating(parseInt(e.target.value, 10))}
                          className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 accent-sage-600 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
                          <span>1 - Completely Cured</span>
                          <span>10 - Very Severe</span>
                        </div>
                      </div>

                      {/* Notes textarea */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold block" style={{ color: "var(--text-secondary)" }}>
                          Progress Notes (Modality Changes, Side-effects, or Wellness updates)
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={progressNotes}
                          onChange={(e) => setProgressNotes(e.target.value)}
                          placeholder="e.g. Throat pain is much less today. Felt a bit thirsty in the afternoon. Modality: aggregates in evening."
                          className="w-full text-sm px-3.5 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-sage-500"
                        />
                      </div>

                      {/* Success alerts */}
                      {logSuccess && (
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs rounded-xl flex items-center gap-2 border border-green-200/30 font-semibold">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Progress log saved successfully. Thank you for updating!</span>
                        </div>
                      )}

                      {logError && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs rounded-xl flex items-center gap-2 border border-red-200/30 font-semibold">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{logError}</span>
                        </div>
                      )}

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={submittingLog || !progressNotes}
                        className="w-full bg-sage-600 hover:bg-sage-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm text-sm"
                      >
                        <Sliders className="w-4 h-4" />
                        {submittingLog ? "Submitting..." : "Submit Progress Update"}
                      </button>
                    </form>
                  </div>

                  {/* Previous Logs Timeline */}
                  {patientAppointment.progressLogs && patientAppointment.progressLogs.length > 0 && (
                    <div
                      className="p-6 rounded-2xl border space-y-4"
                      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                        Your Symptom Progress Logs
                      </h4>
                      <div className="relative border-l-2 ml-2 pl-4 space-y-4" style={{ borderColor: "var(--border-color)" }}>
                        {patientAppointment.progressLogs.map((log, idx) => (
                          <div key={idx} className="relative">
                            <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-sage-500 border-2 border-white dark:border-zinc-900"></span>
                            <div className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                              Logged Severity: <span className="text-red-500 font-bold">{log.rating}/10</span>
                            </div>
                            <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>
                              {new Date(log.loggedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </div>
                            <p className="text-xs italic mt-1" style={{ color: "var(--text-secondary)" }}>
                              "{log.notes}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-sage-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckAppointmentContent />
    </Suspense>
  );
}
