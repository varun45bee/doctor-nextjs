"use client";

import { useEffect, useState } from "react";
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
  Briefcase,
  AlertCircle,
  Video,
  MessageSquare,
  MapPin,
  ExternalLink,
  CheckCircle2,
  HeartPulse,
  AlertTriangle,
  FileDown,
  Pill,
  ShieldCheck,
  Activity,
  FolderOpen,
  RotateCw,
  Loader2,
} from "lucide-react";
import type { Appointment } from "@/lib/types/appointment";
import { saveAppointmentPrescription } from "@/lib/firestore/appointments";
import {
  getPatientProfile,
  getPatientProfileByEmail,
  getMedicalRecords,
} from "@/lib/services/patient-profile";
import type { UserProfile, MedicalRecord } from "@/lib/types/patient";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeAppointment } from "@/lib/types/appointment";

type PatientDrawerProps = {
  appointment: Appointment | null;
  onClose: () => void;
};

export default function PatientDrawer({ appointment, onClose }: PatientDrawerProps) {
  const [activeSubTab, setActiveSubTab] = useState<"case" | "prescription" | "history">("case");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Patient Dossier State (Loaded from users/{uid})
  const [patientProfile, setPatientProfile] = useState<UserProfile | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);
  const [patientPastAppointments, setPatientPastAppointments] = useState<Appointment[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Prescription Form State
  const [remedy, setRemedy] = useState("");
  const [potency, setPotency] = useState("30C");
  const [dosage, setDosage] = useState("4 globules, twice daily");
  const [duration, setDuration] = useState("7 days");
  const [instructions, setInstructions] = useState("Avoid raw onion, garlic, or strong perfumes 30 minutes before/after taking the remedy.");
  
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);
  const [retryingMeet, setRetryingMeet] = useState(false);

  const handleRetryMeet = async () => {
    if (!appointment) return;
    setRetryingMeet(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/meet`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(
          data.error ||
            "Failed to generate Google Meet room. Please verify that Google is connected in Settings."
        );
      } else {
        alert("Google Meet room successfully generated!");
        window.location.reload();
      }
    } catch {
      alert("Network error while creating Google Meet room.");
    } finally {
      setRetryingMeet(false);
    }
  };

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
        setInstructions("Avoid raw onion, garlic, or strong perfumes 30 minutes before/after taking the remedy.");
      }

      // Fetch patient profile, medical records, and appointment history
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
      }

      loadPatientDossier();
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

  const handleSavePrescription = async () => {
    if (!remedy) return;
    setSavingPrescription(true);
    setPrescriptionSaved(false);
    try {
      const rx = {
        remedy,
        potency,
        dosage,
        duration,
        instructions,
        prescribedAt: new Date().toISOString(),
      };
      await saveAppointmentPrescription(appointment.id, rx);
      setPrescriptionSaved(true);
      // Sync local state reference
      appointment.prescription = rx;
      setTimeout(() => setPrescriptionSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save prescription:", err);
    } finally {
      setSavingPrescription(false);
    }
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
              {/* Consultation Mode & Google Meet Action Banner */}
              <div
                className="p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: "var(--bg-surface-alt)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Consultation Mode
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sage-100 text-sage-800 dark:bg-sage-900/50 dark:text-sage-200">
                    {appointment.consultationType === "online" ? (
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

                {appointment.consultationType === "online" && (
                  <div className="pt-2">
                    {(() => {
                      const meetLink =
                        appointment.googleMeetLink || appointment.googleMeetUrl;
                      const status =
                        appointment.meetingStatus ||
                        (meetLink ? "ready" : "pending");

                      if (meetLink) {
                        return (
                          <div className="p-4 rounded-xl bg-sage-50 dark:bg-sage-950/60 border border-sage-200 dark:border-sage-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-sage-800 dark:text-sage-200 flex items-center gap-1.5">
                                <Video className="w-4 h-4 text-sage-600" /> Google Meet Video Room
                              </span>
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Ready
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-bold text-xs shadow-sm transition-colors"
                              >
                                <Video className="w-4 h-4" />
                                Join Google Meet Consultation
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(meetLink);
                                  alert("Google Meet link copied to clipboard!");
                                }}
                                className="p-2.5 rounded-xl border border-sage-300 dark:border-sage-700 hover:bg-sage-100 dark:hover:bg-sage-900 text-sage-700 dark:text-sage-300 transition-colors"
                                title="Copy Meet Link"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[11px] text-[var(--text-muted)] break-all text-center">
                              {meetLink}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                              {status === "failed"
                                ? "Google Meet Generation Failed"
                                : "Google Meet Pending"}
                            </span>
                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                              {status}
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-800 dark:text-amber-300">
                            Room was not automatically created. Click below to securely generate or retry the meeting room.
                          </p>
                          <button
                            type="button"
                            disabled={retryingMeet}
                            onClick={handleRetryMeet}
                            className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
                          >
                            {retryingMeet ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Generating Meet Room...</span>
                              </>
                            ) : (
                              <>
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>Generate / Retry Google Meet Room</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Notification Delivery Overview */}
                <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>Patient Notifications:</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      Email:{" "}
                      <strong className="capitalize">
                        {appointment.notificationStatus?.email || "pending"}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      WhatsApp:{" "}
                      <strong className="capitalize">
                        {appointment.notificationStatus?.whatsapp || "pending"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div
                className="p-4 rounded-xl border space-y-3"
                style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Contact Information
                  </h4>
                  {patientProfile?.uid && (
                    <Link
                      href={`/doctor/chat?patient=${patientProfile.uid}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-600 hover:bg-sage-700 text-white text-[11px] font-semibold transition-colors shadow-2xs"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat with Patient</span>
                    </Link>
                  )}
                </div>
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

              {/* Patient Dossier & Medical Profile (Connected to users/{uid}) */}
              <div
                className="p-4 rounded-xl border space-y-4"
                style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      Confidential Medical Dossier
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300">
                    {patientProfile?.bloodGroup && patientProfile.bloodGroup !== "Unknown"
                      ? `Blood Group: ${patientProfile.bloodGroup}`
                      : "Blood Group: Not Specified"}
                  </span>
                </div>

                {loadingProfile ? (
                  <p className="text-xs text-[var(--text-muted)] italic">
                    Loading confidential patient medical records...
                  </p>
                ) : patientProfile ? (
                  <div className="space-y-3 text-xs">
                    {/* Allergies Highlight Alert */}
                    {patientProfile.allergies ? (
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-1.5 font-bold mb-0.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Known Allergies:</span>
                        </div>
                        <p className="pl-5 font-medium">{patientProfile.allergies}</p>
                      </div>
                    ) : (
                      <div className="text-[var(--text-muted)] italic">No allergies reported by patient.</div>
                    )}

                    {/* Medications & Chronic Conditions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)]">
                        <span className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                          Current Medications:
                        </span>
                        <p className="font-medium text-[var(--text-primary)]">
                          {patientProfile.currentMedications || "None reported"}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)]">
                        <span className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                          Chronic Diseases:
                        </span>
                        <p className="font-medium text-[var(--text-primary)]">
                          {patientProfile.chronicDiseases || "None reported"}
                        </p>
                      </div>
                    </div>

                    {/* Surgeries & Lifestyle */}
                    {(patientProfile.previousSurgeries || patientProfile.lifestyleInformation) && (
                      <div className="space-y-2 pt-1 border-t border-[var(--border-color)]">
                        {patientProfile.previousSurgeries && (
                          <div>
                            <span className="text-[11px] font-semibold text-[var(--text-muted)] block">
                              Prior Surgeries & Hospitalizations:
                            </span>
                            <p className="font-medium text-[var(--text-primary)]">
                              {patientProfile.previousSurgeries}
                            </p>
                          </div>
                        )}
                        {patientProfile.lifestyleInformation && (
                          <div>
                            <span className="text-[11px] font-semibold text-[var(--text-muted)] block">
                              Lifestyle, Sleep & Modalities:
                            </span>
                            <p className="font-medium text-[var(--text-primary)]">
                              {patientProfile.lifestyleInformation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Address & Emergency Contact */}
                    <div className="pt-2 border-t border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[var(--text-muted)] block">Address:</span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {patientProfile.address || "Not provided"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--text-muted)] block">Emergency Contact:</span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {patientProfile.emergencyContact
                            ? `${patientProfile.emergencyContact} (${patientProfile.emergencyRelationship || "Contact"})`
                            : "Not set"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[var(--text-muted)] italic">
                    Patient has not created a detailed medical profile yet. Basic appointment details only.
                  </div>
                )}
              </div>

              {/* Diagnostic Records / Uploaded Documents */}
              <div
                className="p-4 rounded-xl border space-y-3"
                style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
              >
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
                        className="p-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="overflow-hidden">
                          <p className="font-semibold text-[var(--text-primary)] truncate">
                            {rec.title}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] capitalize">
                            {rec.type.replace("_", " ")} {rec.recordDate && `• Date: ${rec.recordDate}`}
                          </p>
                        </div>
                        <a
                          href={rec.documentURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-medium shrink-0 transition-colors"
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span>View</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--text-muted)] italic">
                    No diagnostic documents uploaded by patient.
                  </p>
                )}
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
                    Patient Description & Modalities
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
                Compose remedy information below to create a direct medical prescription.
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
                  className="w-full text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-sage-500 animate-none"
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

              {/* Save & Issue button */}
              <button
                type="button"
                onClick={handleSavePrescription}
                disabled={savingPrescription || !remedy}
                className="w-full flex items-center justify-center gap-2 text-sm py-2.5 px-4 rounded-xl bg-sage-700 hover:bg-sage-800 disabled:opacity-60 text-white font-semibold transition-colors shadow-sm"
              >
                {prescriptionSaved ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Prescription Saved & Issued!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{savingPrescription ? "Saving..." : "Save & Issue Prescription"}</span>
                  </>
                )}
              </button>

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
                Chronological list of patient's visits, remedies, and clinical/progress notes.
              </p>

              {/* Timeline Container */}
              <div className="relative border-l-2 ml-3 space-y-6 pl-5" style={{ borderColor: "var(--border-color)" }}>
                {/* Real Progress Logs Submitted By Patient */}
                {appointment.progressLogs && appointment.progressLogs.length > 0 ? (
                  appointment.progressLogs.map((log, idx) => (
                    <div key={`progress-${idx}`} className="relative border-b pb-3 border-dashed last:border-b-0" style={{ borderColor: "var(--border-color)" }}>
                      <span className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-teal-600 border-2 border-white dark:border-zinc-900"></span>
                      <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                        Patient Progress Rating
                      </div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {new Date(log.loggedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      <div className="mt-1 text-xs space-y-1" style={{ color: "var(--text-secondary)" }}>
                        <p>📉 Symptom Severity: <strong className="font-semibold text-red-500">{log.rating}/10</strong></p>
                        <p className="italic text-zinc-500 dark:text-zinc-400">"{log.notes}"</p>
                      </div>
                    </div>
                  ))
                ) : null}

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

                {/* Real Patient Past Consultations & Remedies Prescribed */}
                {patientPastAppointments.length > 0 ? (
                  patientPastAppointments.map((pastAppt) => (
                    <div key={pastAppt.id} className="relative">
                      <span className="absolute -left-7 top-1 w-4 h-4 rounded-full bg-zinc-300 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900"></span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          Consultation: {pastAppt.condition || "Clinical Visit"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[var(--text-muted)] font-medium">
                          {pastAppt.status}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {pastAppt.appointmentDate} · {pastAppt.appointmentTime} ({pastAppt.consultationType})
                      </div>
                      {pastAppt.prescription ? (
                        <div className="mt-2 p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-1">
                          <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                            💊 {pastAppt.prescription.remedy} {pastAppt.prescription.potency}
                          </p>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            Dosage: {pastAppt.prescription.dosage} ({pastAppt.prescription.duration})
                          </p>
                          {pastAppt.prescription.instructions && (
                            <p className="text-[10px] italic text-[var(--text-muted)]">
                              &ldquo;{pastAppt.prescription.instructions}&rdquo;
                            </p>
                          )}
                        </div>
                      ) : pastAppt.message ? (
                        <p className="text-xs italic text-[var(--text-muted)] mt-1">
                          Notes: &ldquo;{pastAppt.message}&rdquo;
                        </p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[var(--text-muted)] italic pt-2">
                    No prior clinic appointments recorded for this patient.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
