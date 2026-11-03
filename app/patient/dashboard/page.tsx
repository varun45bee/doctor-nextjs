"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Calendar,
  MessageSquare,
  FileText,
  Video,
  ArrowRight,
  PlusCircle,
  HeartPulse,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { calculateProfileCompletion, MedicalRecord } from "@/lib/types/patient";
import { getMedicalRecords } from "@/lib/services/patient-profile";
import { getConversationIdForPatient, subscribeToConversation } from "@/lib/services/chat-service";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { normalizeAppointment, Appointment } from "@/lib/types/appointment";
import { Conversation } from "@/lib/types/chat";

export default function PatientDashboardPage() {
  const { user, userProfile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  // Profile completion calculation
  const completionPercentage = useMemo(() => {
    return calculateProfileCompletion(userProfile);
  }, [userProfile]);

  useEffect(() => {
    if (!user) return;

    let unsubConv: (() => void) | undefined;

    async function loadData() {
      try {
        // 1. Fetch appointments matching patient email
        if (user?.email) {
          try {
            const apptsCol = collection(db, "appointments");
            const q = query(apptsCol, where("patientEmail", "==", user.email));
            const snap = await getDocs(q);
            const appts = snap.docs.map((d) =>
              normalizeAppointment({ id: d.id, ...d.data() })
            );
            // Sort by date desc
            appts.sort((a, b) => (b.appointmentDate || "").localeCompare(a.appointmentDate || ""));
            setAppointments(appts);
          } catch (err) {
            console.error("Failed to fetch appointments:", err);
          }
        }

        // 2. Fetch medical records
        if (user?.uid) {
          const recs = await getMedicalRecords(user.uid);
          setRecords(recs);

          // 3. Subscribe to real-time conversation state
          const convId = getConversationIdForPatient(user.uid);
          unsubConv = subscribeToConversation(convId, (conv) => {
            setConversation(conv);
          });
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    }

    loadData();

    return () => {
      if (unsubConv) unsubConv();
    };
  }, [user]);

  const upcomingAppointments = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return appointments.filter(
      (a) =>
        a.appointmentDate >= today &&
        (a.status === "Confirmed" || a.status === "Pending")
    );
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return appointments.filter(
      (a) => a.appointmentDate < today || a.status === "Completed" || a.status === "Cancelled"
    );
  }, [appointments]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div
        className="rounded-3xl border p-6 sm:p-8 relative overflow-hidden shadow-sm"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sage-100 dark:bg-sage-900/60 text-sage-800 dark:text-sage-200 border border-sage-200 dark:border-sage-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Patient Health Portal
            </div>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[var(--text-primary)]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Welcome back, {userProfile?.fullName || user?.displayName || "Patient"}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-2xl">
              Manage your homeopathic treatments, review consultation notes, upload diagnostic records, and communicate directly with Dr. Pratima Agale.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/patient/chat"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sage-600 hover:bg-sage-700 text-white font-medium text-xs sm:text-sm shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Doctor Chat</span>
              {conversation && conversation.unreadPatientCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {conversation.unreadPatientCount}
                </span>
              )}
            </Link>
            <Link
              href="/patient/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border-color)] text-xs sm:text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              <User className="w-4 h-4 text-sage-600" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[var(--text-primary)]">Profile Completion</span>
              {completionPercentage >= 80 ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
                  Complete
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium">
                  Action Recommended
                </span>
              )}
            </div>
            <span className="font-bold text-sage-700 dark:text-sage-300">
              {completionPercentage}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                completionPercentage >= 80
                  ? "bg-emerald-600"
                  : completionPercentage >= 50
                  ? "bg-sage-600"
                  : "bg-amber-500"
              }`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {completionPercentage < 80 && (
            <p className="mt-2 text-xs text-[var(--text-muted)] flex items-center justify-between">
              <span>Add your emergency contact, blood group, and medical history to assist Dr. Pratima Agale with personalized care.</span>
              <Link href="/patient/profile" className="text-sage-600 dark:text-sage-400 font-semibold hover:underline ml-2">
                Complete now →
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Grid: Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Direct Doctor Chat Preview */}
        <div
          className="rounded-3xl border p-6 flex flex-col justify-between shadow-sm"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden relative border border-sage-300 dark:border-sage-700 shadow-xs">
                  <Image
                    src="/doctor.webp"
                    alt="Dr. Pratima Agale"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                    Dr. Pratima Agale
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online Clinic Consultation
                  </p>
                </div>
              </div>
              <span className="p-2 rounded-xl bg-sage-50 dark:bg-sage-950/40 text-sage-600 dark:text-sage-300">
                <MessageSquare className="w-4 h-4" />
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-subtle)] text-xs text-[var(--text-secondary)] mb-4">
              {conversation?.lastMessage ? (
                <>
                  <p className="font-medium text-[var(--text-primary)] mb-1">
                    {conversation.lastSenderRole === "doctor" ? "Doctor:" : "You:"}
                  </p>
                  <p className="line-clamp-2">{conversation.lastMessage}</p>
                </>
              ) : (
                <p className="italic text-[var(--text-muted)]">
                  No messages yet. Send a message to Dr. Pratima Agale anytime.
                </p>
              )}
            </div>
          </div>

          <Link
            href="/patient/chat"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-sage-50 dark:bg-sage-950/60 text-sage-800 dark:text-sage-200 text-xs font-semibold border border-sage-200 dark:border-sage-800 hover:bg-sage-100 transition-colors"
          >
            <span>Open Consultation Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 2: Medical Profile Summary */}
        <div
          className="rounded-3xl border p-6 flex flex-col justify-between shadow-sm"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                    Clinical Overview
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Essential health vitals
                  </p>
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 font-semibold text-[var(--text-primary)]">
                {userProfile?.bloodGroup || "Blood Group: N/A"}
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">Allergies:</span>
                <span className="font-medium text-[var(--text-primary)] max-w-[150px] truncate text-right">
                  {userProfile?.allergies || "None reported"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">Current Medications:</span>
                <span className="font-medium text-[var(--text-primary)] max-w-[150px] truncate text-right">
                  {userProfile?.currentMedications || "None"}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[var(--text-secondary)]">Emergency Contact:</span>
                <span className="font-medium text-[var(--text-primary)]">
                  {userProfile?.emergencyContact || "Not set"}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/patient/profile"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-semibold border border-[var(--border-color)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors mt-4"
          >
            <span>Update Medical History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Card 3: Medical Documents & Prescriptions */}
        <div
          className="rounded-3xl border p-6 flex flex-col justify-between shadow-sm"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                    Diagnostic Records
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {records.length} {records.length === 1 ? "document" : "documents"} attached
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {records.slice(0, 3).map((r) => (
                <a
                  key={r.id}
                  href={r.documentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-subtle)] transition-colors text-xs"
                >
                  <span className="font-medium text-[var(--text-primary)] truncate max-w-[170px]">
                    {r.title}
                  </span>
                  <span className="text-[10px] text-sage-600 dark:text-sage-400 capitalize">
                    {r.type.replace("_", " ")}
                  </span>
                </a>
              ))}
              {records.length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
                  No records uploaded yet.
                </div>
              )}
            </div>
          </div>

          <Link
            href="/patient/medical-history"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs font-semibold border border-[var(--border-color)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-sage-600" />
            <span>Upload New Record</span>
          </Link>
        </div>
      </div>

      {/* Upcoming & Recent Appointments Section */}
      <div
        className="rounded-3xl border p-6 sm:p-8 shadow-sm"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2
              className="text-xl sm:text-2xl font-serif text-[var(--text-primary)]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Consultations & Bookings
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Scheduled Google Meet video consultations and past appointment records.
            </p>
          </div>
          <Link
            href="/#appointment"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-600 text-white text-xs font-medium hover:bg-sage-700 transition-colors shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* List of Upcoming Consultations */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-sage-300">
              Upcoming Online Consultations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-5 rounded-2xl border border-sage-200 dark:border-sage-800 bg-sage-50/50 dark:bg-sage-950/20 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
                        {appt.status}
                      </span>
                      <h4 className="font-serif font-bold text-base text-[var(--text-primary)]">
                        Online Consultation with Dr. Pratima Agale
                      </h4>
                      <p className="text-xs text-[var(--text-secondary)] flex items-center gap-2 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-sage-600" />
                        <span>{appt.appointmentDate} at {appt.appointmentTime}</span>
                      </p>
                    </div>
                  </div>

                  {/* Google Meet Link if available */}
                  {appt.googleMeetUrl ? (
                    <a
                      href={appt.googleMeetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-sm"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Google Meet Consultation</span>
                    </a>
                  ) : (
                    <div className="text-xs text-[var(--text-muted)] italic">
                      Google Meet link will be activated prior to consultation.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Consultations */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3">
            Consultation History
          </h3>
          {pastAppointments.length > 0 ? (
            <div className="divide-y divide-[var(--border-color)]">
              {pastAppointments.map((appt) => (
                <div
                  key={appt.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-medium text-[var(--text-primary)]">
                      {appt.appointmentDate} ({appt.appointmentTime})
                    </span>
                    <span className="text-[var(--text-muted)] ml-2">
                      • {appt.consultationType || "Online Consultation"}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-medium w-fit ${
                      appt.status === "Completed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : appt.status === "Cancelled"
                        ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            upcomingAppointments.length === 0 && (
              <div className="text-center py-8 text-xs text-[var(--text-muted)]">
                No appointment history found. Book your first online consultation with Dr. Pratima Agale above.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
