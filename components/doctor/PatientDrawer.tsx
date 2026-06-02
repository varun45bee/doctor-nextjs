"use client";

import { useEffect, useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  Send,
  Copy,
  Calendar,
  Check,
  Briefcase,
  AlertCircle
} from "lucide-react";
import type { Appointment } from "@/lib/types/appointment";

type PatientDrawerProps = {
  appointment: Appointment | null;
  onClose: () => void;
};

export default function PatientDrawer({ appointment, onClose }: PatientDrawerProps) {
  const [activeSubTab, setActiveSubTab] = useState<"case" | "prescription" | "history">("case");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Prescription Form State
  const [remedy, setRemedy] = useState("");
  const [potency, setPotency] = useState("30C");
  const [dosage, setDosage] = useState("4 globules, twice daily");
  const [duration, setDuration] = useState("7 days");
  const [instructions, setInstructions] = useState("Avoid raw onion, garlic, or strong perfumes 30 minutes before/after taking the remedy.");

  useEffect(() => {
    if (appointment) {
      setIsOpen(true);
      // Reset prescription inputs for a new patient
      setRemedy("");
      setPotency("30C");
      setDosage("4 globules, twice daily");
      setDuration("7 days");
    } else {
      setIsOpen(false);
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Allow animation to complete
  };

  const getPrescriptionText = () => {
    return `*PRESCRIPTION & MEDICAL ADVICE*
---------------------------------
*Patient:* ${appointment.patientName}
*Date:* ${appointment.appointmentDate}

*Remedy prescribed:*
💊 *${remedy || "[Remedy Not Set]"} ${potency}*
*Dosage:* ${dosage}
*Duration:* ${duration}

*Instructions:*
${instructions}

---------------------------------
Dr. Pratima Agale (BHMS)
Homeopathy Clinic`;
  };

  const handleCopyPrescription = () => {
    navigator.clipboard.writeText(getPrescriptionText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(getPrescriptionText());
    const phone = appointment.patientPhone.replace(/[^0-9]/g, "");
    const formattedPhone = phone.length === 10 ? `91${phone}` : phone; // Assume Indian country code if 10 digits
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ backgroundColor: "rgba(10, 16, 10, 0.4)", backdropFilter: "blur(4px)" }}
      onClick={handleClose}
    >
      <div
        className={`w-full max-w-lg h-full overflow-hidden flex flex-col shadow-2xl transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "var(--bg-surface)", borderLeft: "1px solid var(--border-color)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          className="p-6 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-surface-alt)" }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-full bg-sage-100 dark:bg-sage-900 text-sage-600 dark:text-sage-300">
                <User className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                {appointment.patientName}
              </h3>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Appointment ID: {appointment.id.substring(0, 8)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg border hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs Panel */}
        <div className="flex border-b text-sm" style={{ borderColor: "var(--border-color)" }}>
          {[
            { id: "case", label: "Case Details", icon: FileText },
            { id: "prescription", label: "Prescription Builder", icon: Send },
            { id: "history", label: "History Timeline", icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as "case" | "prescription" | "history")}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 font-medium transition-all ${
                  active
                    ? "border-sage-600 text-sage-600 dark:text-sage-400 bg-sage-50/30 dark:bg-sage-900/10"
                    : "border-transparent hover:text-sage-600"
                }`}
                style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* CASE DETAILS TAB */}
          {activeSubTab === "case" && (
            <div className="space-y-6 page-enter">
              {/* Contact Card */}
              <div
                className="p-4 rounded-xl border space-y-3"
                style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
              >
                <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {appointment.patientPhone && (
                    <div className="flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                      <Phone className="w-4 h-4 text-sage-500" />
                      <a href={`tel:${appointment.patientPhone}`} className="hover:underline">
                        {appointment.patientPhone}
                      </a>
                    </div>
                  )}
                  {appointment.patientEmail && (
                    <div className="flex items-center gap-2 overflow-hidden text-ellipsis" style={{ color: "var(--text-secondary)" }}>
                      <Mail className="w-4 h-4 text-sage-500" />
                      <a href={`mailto:${appointment.patientEmail}`} className="hover:underline truncate">
                        {appointment.patientEmail}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
                >
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Patient Age
                  </p>
                  <p className="text-lg font-semibold mt-0.5" style={{ color: "var(--text-primary)" }}>
                    {appointment.age ? `${appointment.age} yrs` : "—"}
                  </p>
                </div>
                <div
                  className="p-4 rounded-xl border"
                  style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
                >
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Language Preference
                  </p>
                  <p className="text-lg font-semibold mt-0.5 capitalize" style={{ color: "var(--text-primary)" }}>
                    {appointment.lang || "—"}
                  </p>
                </div>
              </div>

              {/* Chief Complaints / Condition */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Chief Complaint
                </h4>
                <div
                  className="p-4 rounded-xl border"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <p className="font-serif text-md" style={{ color: "var(--text-primary)", fontFamily: "'Cormorant Garamond', serif" }}>
                    {appointment.condition || "General consultation / wellness check"}
                  </p>
                </div>
              </div>

              {/* Message from Patient */}
              {appointment.message && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Patient Description & Modalties
                  </h4>
                  <div
                    className="p-4 rounded-xl border border-dashed text-sm italic"
                    style={{ borderColor: "var(--border-mid)", backgroundColor: "var(--bg-muted)", color: "var(--text-secondary)" }}
                  >
                    "{appointment.message}"
                  </div>
                </div>
              )}

              {/* Homeopathy Diagnostic Hint */}
              <div
                className="p-4 rounded-xl border flex gap-3 text-sm"
                style={{ borderColor: "rgba(90, 127, 90, 0.2)", backgroundColor: "rgba(90, 127, 90, 0.05)" }}
              >
                <AlertCircle className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
                <div style={{ color: "var(--text-secondary)" }}>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Clinical Guidance Hint</p>
                  <p className="text-xs mt-1">
                    Based on patient's symptoms, verify modals: thermal response (chilly vs. hot), thirst levels, and aggravation times (e.g. evening or night) during case taking to select the exact homeopathic simillimum.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PRESCRIPTION BUILDER TAB */}
          {activeSubTab === "prescription" && (
            <div className="space-y-5 page-enter">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Compose remedy information below to create a direct medical prescription printable and shareable format.
              </p>

              {/* Remedy Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Remedy Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Nux Vomica, Arsenicum Album"
                  value={remedy}
                  onChange={(e) => setRemedy(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sage-500"
                />
              </div>

              {/* Potency & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Potency
                  </label>
                  <select
                    value={potency}
                    onChange={(e) => setPotency(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none"
                  >
                    {["Q (Mother Tincture)", "6C", "30C", "200C", "1M", "10M", "LM1", "LM2"].map((pot) => (
                      <option key={pot} value={pot}>
                        {pot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 7 days, 1 month"
                    className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none"
                  />
                </div>
              </div>

              {/* Dosage */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Dosage / Frequency
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 4 pills, thrice a day"
                  className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none"
                />
              </div>

              {/* Instructions */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Special Instructions
                </label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Special instructions or precautions..."
                  className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none"
                />
              </div>

              {/* Preview Box */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Live Preview
                </span>
                <pre
                  className="p-4 rounded-xl border text-xs font-mono overflow-x-auto"
                  style={{
                    backgroundColor: "var(--bg-surface-alt)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)"
                  }}
                >
                  {getPrescriptionText()}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCopyPrescription}
                  className="flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-xl border hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors font-medium"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  disabled={!remedy}
                  className="flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-medium transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>Send WhatsApp</span>
                </button>
              </div>
            </div>
          )}

          {/* HISTORY TIMELINE TAB */}
          {activeSubTab === "history" && (
            <div className="space-y-6 page-enter">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Chronological list of patient's visits, remedies prescribed, and clinical notes over time.
              </p>

              {/* Timeline Container */}
              <div className="relative border-l-2 ml-3 space-y-6 pl-5" style={{ borderColor: "var(--border-color)" }}>
                {/* Timeline Item Current */}
                <div className="relative">
                  <span className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-sage-600 border-2 border-white dark:border-zinc-900"></span>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Today's Consultation
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {appointment.appointmentDate} · Scheduled at {appointment.appointmentTime}
                  </div>
                  <div className="text-xs mt-2 italic" style={{ color: "var(--text-secondary)" }}>
                    Status: {appointment.status} (Complaint: {appointment.condition || "General Wellness"})
                  </div>
                </div>

                {/* Timeline Item 2 Mock */}
                <div className="relative">
                  <span className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900"></span>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Follow-Up Consultation
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    April 14, 2026
                  </div>
                  <div className="mt-2 text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
                    <p>💊 <strong className="font-semibold text-xs">Pulsatilla 200C</strong> (4 globules, twice daily)</p>
                    <p className="italic text-zinc-500 mt-0.5">"Improvement reported in skin rash. Modalities: Worse in hot room, better in open air."</p>
                  </div>
                </div>

                {/* Timeline Item 3 Mock */}
                <div className="relative">
                  <span className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900"></span>
                  <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Initial Consultation & Case Taking
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    March 10, 2026
                  </div>
                  <div className="mt-2 text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
                    <p>💊 <strong className="font-semibold text-xs">Arsenicum Album 30C</strong> (twice daily for 1 week)</p>
                    <p className="italic text-zinc-500 mt-0.5">"Severe itching and dry skin patches. Modalities: agg. from cold application, amel. by warm wraps. Thirst for small quantities frequently."</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
