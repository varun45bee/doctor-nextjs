"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
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
  Save,
  AlertCircle,
  Video,
  MessageSquare,
  MapPin,
  HeartPulse,
  AlertTriangle,
  FileDown,
  Pill,
  ShieldCheck,
  Activity,
  FolderOpen,
  Printer,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
} from "lucide-react";
import type { Appointment, Prescription } from "@/lib/types/appointment";
import {
  saveAppointmentPrescription,
  saveDoctorNotes,
} from "@/lib/firestore/appointments";
import { doctorUpdateAppointment } from "@/lib/services/doctor-api";
import {
  getPatientProfile,
  getPatientProfileByEmail,
  getMedicalRecords,
} from "@/lib/services/patient-profile";
import type { UserProfile, MedicalRecord } from "@/lib/types/patient";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeAppointment } from "@/lib/types/appointment";
import RescheduleModal from "@/components/doctor/RescheduleModal";
import CancelModal from "@/components/doctor/CancelModal";

type PatientDrawerProps = {
  appointment: Appointment | null;
  onClose: () => void;
  onAppointmentUpdated?: (updated: Appointment) => void;
};

const COMMON_REMEDIES = [
  "Arsenicum Album",
  "Arnica Montana",
  "Belladonna",
  "Bryonia Alba",
  "Calcarea Carbonica",
  "Cantharis",
  "Carbo Vegetabilis",
  "Chamomilla",
  "Gelsemium",
  "Hepar Sulphuris",
  "Ignatia Amara",
  "Lycopodium Clavatum",
  "Mercurius Solubilis",
  "Natrum Muriaticum",
  "Nux Vomica",
  "Phosphorus",
  "Pulsatilla",
  "Rhus Toxicodendron",
  "Sepia Officinalis",
  "Silicea",
  "Sulphur",
  "Thuja Occidentalis",
];

const POTENCIES = [
  "Q (Mother Tincture)",
  "6C",
  "30C",
  "200C",
  "1M",
  "10M",
  "LM1",
  "LM2",
  "LM3",
  "LM4",
  "LM5",
];

export default function PatientDrawer({
  appointment,
  onClose,
  onAppointmentUpdated,
}: PatientDrawerProps) {
  const [activeTab, setActiveTab] = useState<"case" | "prescription" | "history" | "notes">("case");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modals for Reschedule & Cancel
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Patient Dossier State (users/{uid})
  const [patientProfile, setPatientProfile] = useState<UserProfile | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  const [patientPastAppointments, setPatientPastAppointments] = useState<Appointment[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Prescription Builder State
  const [remedy, setRemedy] = useState("");
  const [potency, setPotency] = useState("30C");
  const [dosage, setDosage] = useState("4 globules, twice daily");
  const [duration, setDuration] = useState("7 days");
  const [instructions, setInstructions] = useState(
    "Avoid raw onion, garlic, or strong perfumes 30 minutes before/after taking the remedy."
  );
  const [avoidOnionGarlic, setAvoidOnionGarlic] = useState(true);
  const [avoidCoffee, setAvoidCoffee] = useState(true);
  const [avoidCamphorPerfumes, setAvoidCamphorPerfumes] = useState(true);

  const [savingPrescription, setSavingPrescription] = useState(false);
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);

  // Doctor Clinical Private Notes State
  const [doctorNotes, setDoctorNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    if (appointment) {
      setIsOpen(true);
      if (appointment.prescription) {
        setRemedy(appointment.prescription.remedy);
        setPotency(appointment.prescription.potency);
        setDosage(appointment.prescription.dosage);
        setDuration(appointment.prescription.duration);
        setInstructions(appointment.prescription.instructions);
      } else {
        setRemedy("");
        setPotency("30C");
        setDosage("4 globules, twice daily");
        setDuration("7 days");
        setInstructions(
          "Avoid raw onion, garlic, or strong perfumes 30 minutes before/after taking the remedy."
        );
      }

      setDoctorNotes(appointment.doctorNotes || "");

      // Load patient dossier, medical records, and appointment history
      const loadPatientDossier = async () => {
        if (!appointment) return;
        setLoadingProfile(true);
        try {
          let profile: UserProfile | null = null;
          if (appointment.patientId) {
            profile = await getPatientProfile(appointment.patientId);
          }
          if (!profile && appointment.patientEmail) {
            profile = await getPatientProfileByEmail(appointment.patientEmail);
          }
          setPatientProfile(profile);

          if (profile?.uid) {
            const docs = await getMedicalRecords(profile.uid);
            setPatientRecords(docs);
          } else {
            setPatientRecords([]);
          }

          if (appointment.patientEmail) {
            const apptsCol = collection(db, "appointments");
            const q = query(apptsCol, where("patientEmail", "==", appointment.patientEmail));
            const snap = await getDocs(q);
            const historyList = snap.docs
              .map((d) => normalizeAppointment({ id: d.id, ...d.data() }))
              .filter((a) => a.id !== appointment.id)
              .sort((a, b) => (b.appointmentDate || "").localeCompare(a.appointmentDate || ""));
            setPatientPastAppointments(historyList);
          }
        } catch (err) {
          console.error("Error fetching patient dossier in drawer:", err);
        } finally {
          setLoadingProfile(false);
        }
      };

      loadPatientDossier();
    } else {
      setIsOpen(false);
    }
  }, [appointment]);

  if (!appointment) return null;

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 250);
  };

  const fullInstructions = useMemo(() => {
    const precautions: string[] = [];
    if (avoidOnionGarlic) precautions.push("Avoid raw onion and garlic 30 minutes before and after remedy.");
    if (avoidCoffee) precautions.push("Avoid coffee and strong caffeinated beverages.");
    if (avoidCamphorPerfumes) precautions.push("Keep medicine away from camphor, eucalyptus, and strong perfumes.");

    if (precautions.length === 0) return instructions;
    return `${instructions}\n\nClinical Precautions:\n• ${precautions.join("\n• ")}`;
  }, [instructions, avoidOnionGarlic, avoidCoffee, avoidCamphorPerfumes]);

  const getPrescriptionText = () => {
    return `*DR. PRATIMA AGALE HOMEOPATHY CLINIC*
----------------------------------------
*Patient Name:* ${appointment.patientName}
*Date:* ${appointment.appointmentDate}
*Consultation Mode:* Online Video Consultation

*Rx Prescribed Remedy:*
💊 *${remedy || "[Remedy Not Set]"} ${potency}*
*Dosage:* ${dosage}
*Duration:* ${duration}

*Instructions & Dietary Guidelines:*
${fullInstructions}

----------------------------------------
Dr. Pratima Agale (BHMS)
Consulting Homeopath · Reg. Clinical Practice
WhatsApp Support: https://www.pratimaagale.in`;
  };

  const handleCopyPrescription = () => {
    navigator.clipboard.writeText(getPrescriptionText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(getPrescriptionText());
    const phone = appointment.patientPhone.replace(/\D/g, "");
    const formattedPhone = phone.length === 10 ? `91${phone}` : phone;
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
  };

  const handleSavePrescription = async () => {
    if (!remedy) return;
    setSavingPrescription(true);
    setPrescriptionSaved(false);
    try {
      const rx: Prescription = {
        remedy,
        potency,
        dosage,
        duration,
        instructions: fullInstructions,
        prescribedAt: new Date().toISOString(),
      };

      // Authenticated doctor route update
      try {
        await doctorUpdateAppointment(appointment.id, { prescription: rx });
      } catch (apiErr) {
        // Fallback to client firestore update
        await saveAppointmentPrescription(appointment.id, rx);
      }

      appointment.prescription = rx;
      onAppointmentUpdated?.({ ...appointment, prescription: rx });
      setPrescriptionSaved(true);
      setTimeout(() => setPrescriptionSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save prescription:", err);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setSavingPrescription(false);
    }
  };

  const handleSaveDoctorNotes = async () => {
    setSavingNotes(true);
    setNotesSaved(false);
    try {
      try {
        await doctorUpdateAppointment(appointment.id, { doctorNotes });
      } catch (apiErr) {
        await saveDoctorNotes(appointment.id, doctorNotes);
      }
      appointment.doctorNotes = doctorNotes;
      onAppointmentUpdated?.({ ...appointment, doctorNotes });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save doctor notes:", err);
      alert("Failed to save private clinical notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(10, 16, 12, 0.5)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      >
        <div
          className={`w-full max-w-2xl h-full overflow-hidden flex flex-col shadow-2xl transition-transform duration-300 ease-out transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } bg-[var(--bg-surface)] border-l border-[var(--border-color)]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-sage-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {appointment.patientName ? appointment.patientName.charAt(0).toUpperCase() : "P"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {appointment.patientName || "Anonymous Patient"}
                  </h3>
                  {appointment.age && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)] font-medium">
                      {appointment.age} yrs
                    </span>
                  )}
                  {patientProfile?.bloodGroup && patientProfile.bloodGroup !== "Unknown" && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-900/50">
                      {patientProfile.bloodGroup}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Slot: <span className="font-semibold text-sage-600 dark:text-sage-400">{appointment.appointmentDate} at {appointment.appointmentTime}</span> · ID: #{appointment.id.substring(0, 8)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] transition-colors"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="px-5 py-2.5 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Contact Actions */}
            <div className="flex items-center gap-2">
              {appointment.patientPhone && (
                <>
                  <a
                    href={`https://wa.me/91${appointment.patientPhone.replace(/\D/g, "").slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-2xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${appointment.patientPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] font-semibold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </>
              )}
              {patientProfile?.uid && (
                <Link
                  href={`/doctor/chat?patient=${patientProfile.uid}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-sage-600 dark:text-sage-400 font-semibold transition-colors"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Portal Chat</span>
                </Link>
              )}
            </div>

            {/* Lifecycle Actions */}
            <div className="flex items-center gap-2">
              {appointment.status !== "Cancelled" && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsRescheduleOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reschedule</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCancelOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-xs font-semibold">
            {[
              { id: "case", label: "Case Dossier", icon: FileText },
              { id: "prescription", label: "Prescription Studio", icon: Pill },
              { id: "history", label: "Clinical History", icon: Clock },
              { id: "notes", label: "Doctor Notes", icon: Lock },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 py-3 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    active
                      ? "border-sage-600 text-sage-700 dark:text-sage-300 bg-[var(--bg-surface)] font-bold"
                      : "border-transparent text-[var(--text-secondary)] hover:text-sage-600 hover:bg-[var(--bg-surface)]/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: CASE DOSSIER */}
            {activeTab === "case" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* Consultation Telehealth Banner */}
                <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      Consultation Channel
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                      <Video className="w-3.5 h-3.5 text-blue-500" />
                      Online Teleconsultation
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Direct video consultation scheduled on{" "}
                    <strong>{appointment.appointmentDate}</strong> at{" "}
                    <strong>{appointment.appointmentTime} IST</strong>. Call or video chat via WhatsApp at the scheduled time.
                  </p>
                </div>

                {/* Confidential Medical Dossier */}
                <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                        Confidential Health Profile
                      </h4>
                    </div>
                    {loadingProfile && (
                      <span className="text-[11px] text-[var(--text-muted)] animate-pulse">
                        Loading EHR profile...
                      </span>
                    )}
                  </div>

                  {patientProfile ? (
                    <div className="space-y-3.5 text-xs">
                      {/* Allergies Alert Box */}
                      {patientProfile.allergies ? (
                        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Clinical Safety: Known Allergies</span>
                          </div>
                          <p className="pl-5 font-semibold text-xs">{patientProfile.allergies}</p>
                        </div>
                      ) : (
                        <div className="text-[var(--text-muted)] italic text-xs">
                          No known medical allergies reported.
                        </div>
                      )}

                      {/* Current Medications & Chronic Diseases */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                            Current Medications
                          </span>
                          <p className="font-semibold text-xs text-[var(--text-primary)]">
                            {patientProfile.currentMedications || "None reported"}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-1">
                            Chronic Diseases
                          </span>
                          <p className="font-semibold text-xs text-[var(--text-primary)]">
                            {patientProfile.chronicDiseases || "None reported"}
                          </p>
                        </div>
                      </div>

                      {/* Surgeries & Lifestyle Modalities */}
                      {(patientProfile.previousSurgeries || patientProfile.lifestyleInformation) && (
                        <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
                          {patientProfile.previousSurgeries && (
                            <div>
                              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                                Surgical & Hospitalization History
                              </span>
                              <p className="font-medium text-xs text-[var(--text-primary)] mt-0.5">
                                {patientProfile.previousSurgeries}
                              </p>
                            </div>
                          )}
                          {patientProfile.lifestyleInformation && (
                            <div>
                              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                                Lifestyle, Diet, Thermal Modalities & Sleep
                              </span>
                              <p className="font-medium text-xs text-[var(--text-primary)] mt-0.5">
                                {patientProfile.lifestyleInformation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-[var(--text-muted)] italic p-2">
                      Guest booking without an extended patient profile. Basic booking records only.
                    </div>
                  )}
                </div>

                {/* Diagnostic Documents */}
                <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-blue-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                        Diagnostic Records ({patientRecords.length})
                      </h4>
                    </div>
                  </div>

                  {patientRecords.length > 0 ? (
                    <div className="space-y-2">
                      {patientRecords.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-[var(--text-primary)] truncate">
                              {rec.title}
                            </p>
                            <p className="text-[11px] text-[var(--text-muted)] capitalize">
                              {rec.type.replace("_", " ")} {rec.recordDate && `• Date: ${rec.recordDate}`}
                            </p>
                          </div>
                          <a
                            href={rec.documentURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-semibold transition-colors"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] italic">
                      No external lab reports or scans uploaded by patient.
                    </p>
                  )}
                </div>

                {/* Chief Complaint & Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Chief Complaint & Symptoms
                  </h4>
                  <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                    <p className="font-semibold text-sm text-[var(--text-primary)]">
                      {appointment.condition || "General consultation / wellness evaluation"}
                    </p>
                    {appointment.message && (
                      <p className="text-xs text-[var(--text-secondary)] italic mt-2 border-t border-[var(--border-color)] pt-2">
                        &ldquo;{appointment.message}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRESCRIPTION STUDIO */}
            {activeTab === "prescription" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[var(--text-muted)]">
                    Formulate and issue an official homeopathic prescription slip.
                  </p>
                  <button
                    type="button"
                    onClick={handlePrintSlip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-xs font-semibold transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>

                {/* Remedy Name & Suggestions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)]">
                    Homeopathic Remedy Name
                  </label>
                  <input
                    type="text"
                    list="remedy-suggestions"
                    placeholder="e.g., Arsenicum Album, Nux Vomica, Pulsatilla"
                    value={remedy}
                    onChange={(e) => setRemedy(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500 font-semibold"
                  />
                  <datalist id="remedy-suggestions">
                    {COMMON_REMEDIES.map((r) => (
                      <option key={r} value={r} />
                    ))}
                  </datalist>
                </div>

                {/* Potency & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-secondary)]">
                      Potency / Scale
                    </label>
                    <select
                      value={potency}
                      onChange={(e) => setPotency(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500 font-semibold"
                    >
                      {POTENCIES.map((pot) => (
                        <option key={pot} value={pot}>
                          {pot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-secondary)]">
                      Course Duration
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 7 days, 14 days, 1 month"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
                    />
                  </div>
                </div>

                {/* Dosage */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)]">
                    Dosage & Repetition
                  </label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g., 4 globules twice daily on empty tongue"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>

                {/* Dietary Precautions Checkbox Presets */}
                <div className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] space-y-2.5">
                  <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                    Dietary Restrictions & Clinical Advice
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={avoidOnionGarlic}
                        onChange={(e) => setAvoidOnionGarlic(e.target.checked)}
                        className="rounded-sm border-[var(--border-color)] text-sage-600 focus:ring-sage-500"
                      />
                      <span>Avoid raw onion & garlic</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={avoidCoffee}
                        onChange={(e) => setAvoidCoffee(e.target.checked)}
                        className="rounded-sm border-[var(--border-color)] text-sage-600 focus:ring-sage-500"
                      />
                      <span>Avoid coffee & caffeinated tea</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={avoidCamphorPerfumes}
                        onChange={(e) => setAvoidCamphorPerfumes(e.target.checked)}
                        className="rounded-sm border-[var(--border-color)] text-sage-600 focus:ring-sage-500"
                      />
                      <span>Keep away from strong perfumes & camphor</span>
                    </label>
                  </div>
                </div>

                {/* Custom Instructions */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)]">
                    Additional Doctor Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Specific patient advice, hydration guidelines, follow-up timeline..."
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>

                {/* Save Button */}
                <button
                  type="button"
                  onClick={handleSavePrescription}
                  disabled={savingPrescription || !remedy}
                  className="w-full flex items-center justify-center gap-2 text-xs py-3 px-5 rounded-xl bg-sage-700 hover:bg-sage-800 disabled:opacity-50 text-white font-bold transition-all shadow-xs"
                >
                  {prescriptionSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Prescription Issued & Saved to Patient Record!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{savingPrescription ? "Saving & Issuing..." : "Save & Issue Prescription"}</span>
                    </>
                  )}
                </button>

                {/* Live Preview & Sharing */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-secondary)]">
                      Digital Prescription Slip Preview
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyPrescription}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSendWhatsApp}
                        disabled={!remedy}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  <pre className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[11px] font-mono whitespace-pre-wrap text-[var(--text-secondary)] max-h-56 overflow-y-auto">
                    {getPrescriptionText()}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB 3: CLINICAL HISTORY */}
            {activeTab === "history" && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <p className="text-xs text-[var(--text-muted)]">
                  Longitudinal history of consultations, remedies, and patient progress logs.
                </p>

                <div className="relative border-l-2 ml-3 pl-5 space-y-6 border-[var(--border-color)]">
                  {/* Real Symptom Progress Logs */}
                  {appointment.progressLogs && appointment.progressLogs.length > 0 && (
                    appointment.progressLogs.map((log, idx) => (
                      <div
                        key={`log-${idx}`}
                        className="relative pb-3 border-b border-dashed last:border-b-0 border-[var(--border-color)]"
                      >
                        <span className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-teal-500 border-2 border-white dark:border-zinc-900" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                            Patient Progress Check-In
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {new Date(log.loggedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="mt-1 text-xs space-y-1 text-[var(--text-secondary)]">
                          <p>
                            Severity Rating:{" "}
                            <strong className="font-bold text-rose-500">
                              {log.rating}/10
                            </strong>
                          </p>
                          {log.notes && (
                            <p className="italic text-[var(--text-muted)]">
                              &ldquo;{log.notes}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Current Active Visit */}
                  <div className="relative">
                    <span className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-sage-600 border-2 border-white dark:border-zinc-900" />
                    <div className="text-sm font-bold text-[var(--text-primary)]">
                      Current Scheduled Visit
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">
                      {appointment.appointmentDate} · {appointment.appointmentTime} IST ({appointment.status})
                    </p>
                    {appointment.prescription && (
                      <div className="mt-2 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs">
                        <p className="font-bold text-emerald-800 dark:text-emerald-300">
                          💊 Prescribed: {appointment.prescription.remedy} {appointment.prescription.potency}
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                          {appointment.prescription.dosage} · {appointment.prescription.duration}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Past Visits */}
                  {patientPastAppointments.length > 0 ? (
                    patientPastAppointments.map((past) => (
                      <div key={past.id} className="relative">
                        <span className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-zinc-900" />
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            Past Consultation ({past.condition || "Clinical Visit"})
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] font-semibold">
                            {past.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {past.appointmentDate} · {past.appointmentTime}
                        </p>
                        {past.prescription && (
                          <div className="mt-1.5 p-2 rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border-color)] text-xs">
                            <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                              💊 {past.prescription.remedy} {past.prescription.potency}
                            </p>
                            <p className="text-[11px] text-[var(--text-secondary)]">
                              {past.prescription.dosage}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] italic pt-2">
                      No prior appointments recorded under this patient&apos;s email.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: DOCTOR PRIVATE NOTES */}
            {activeTab === "notes" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                    <Lock className="w-3.5 h-3.5 text-sage-600" />
                    <span>Confidential Clinical Observations</span>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Visible only to clinic doctors
                  </span>
                </div>

                <p className="text-xs text-[var(--text-muted)]">
                  Record miasmatic assessments, constitutional analysis, differential remedies, or sensitive notes. These are never shared with the patient.
                </p>

                <textarea
                  rows={8}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="e.g., Miasm: Psora predominant with Sycotic overlay. Constitutional remedy considerations: Pulsatilla vs Ignatia based on tearful disposition and grief history. Patient showed rapid response to 30C potency. Plan for next follow-up: evaluate thermal reaction and thirst..."
                  className="w-full text-sm p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500 font-sans"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveDoctorNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sage-700 hover:bg-sage-800 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    {notesSaved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>Notes Saved Securely</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{savingNotes ? "Saving..." : "Save Clinical Notes"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      <RescheduleModal
        appointment={appointment}
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onSuccess={(updated) => {
          onAppointmentUpdated?.(updated);
        }}
      />

      {/* Cancel Modal */}
      <CancelModal
        appointment={appointment}
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onSuccess={(updated) => {
          onAppointmentUpdated?.(updated);
        }}
      />
    </>
  );
}
