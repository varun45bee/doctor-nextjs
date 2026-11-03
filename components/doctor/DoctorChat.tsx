"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Search,
  MessageSquare,
  Send,
  Paperclip,
  Loader2,
  FileText,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Conversation, ChatMessage, MessageAttachment } from "@/lib/types/chat";
import { UserProfile, MedicalRecord } from "@/lib/types/patient";
import {
  subscribeToDoctorConversations,
  subscribeToMessages,
  sendChatMessage,
  markConversationRead,
} from "@/lib/services/chat-service";
import { getPatientProfile, getMedicalRecords } from "@/lib/services/patient-profile";
import { uploadChatAttachment } from "@/lib/storage/patient-storage";
import PatientAvatar from "@/components/patient/PatientAvatar";

export default function DoctorChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [patientProfile, setPatientProfile] = useState<UserProfile | null>(null);
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([]);

  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const [loadingConv, setLoadingConv] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Subscribe to all patient conversations
  useEffect(() => {
    const unsub = subscribeToDoctorConversations((convList) => {
      setConversations(convList);
      setLoadingConv(false);
      // If a conversation is already selected, keep it updated
      if (selectedConv) {
        const updated = convList.find((c) => c.id === selectedConv.id);
        if (updated) setSelectedConv(updated);
      }
    });

    return unsub;
  }, [selectedConv]);

  // 2. Select conversation & subscribe to messages and patient records
  useEffect(() => {
    if (!selectedConv) {
      setMessages([]);
      setPatientProfile(null);
      setPatientRecords([]);
      return;
    }

    // Mark as read for doctor
    markConversationRead(selectedConv.id, "doctor");

    // Subscribe to messages
    const unsub = subscribeToMessages(selectedConv.id, (msgs) => {
      setMessages(msgs);
      markConversationRead(selectedConv.id, "doctor");
    });

    // Load patient profile & medical records
    async function loadPatientDetails() {
      if (!selectedConv) return;
      try {
        const [prof, recs] = await Promise.all([
          getPatientProfile(selectedConv.patientId),
          getMedicalRecords(selectedConv.patientId),
        ]);
        setPatientProfile(prof);
        setPatientRecords(recs);
      } catch (err) {
        console.error("Failed to load patient records for doctor chat:", err);
      }
    }

    loadPatientDetails();

    return unsub;
  }, [selectedConv?.id]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingAttachments]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConv) return;

    setUploading(true);
    try {
      const att = await uploadChatAttachment(selectedConv.id, file);
      setPendingAttachments((prev) => [...prev, att]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedConv || (!inputText.trim() && pendingAttachments.length === 0)) {
      return;
    }

    setSending(true);
    const textToSend = inputText.trim();
    const attachmentsToSend = [...pendingAttachments];

    setInputText("");
    setPendingAttachments([]);

    try {
      await sendChatMessage({
        conversationId: selectedConv.id,
        senderId: user.uid,
        senderRole: "doctor",
        senderName: "Dr. Pratima Agale",
        text: textToSend,
        attachments: attachmentsToSend,
      });
    } catch (err) {
      console.error("Doctor failed to send message:", err);
      setInputText(textToSend);
      setPendingAttachments(attachmentsToSend);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    return (
      c.patientName.toLowerCase().includes(term) ||
      c.patientEmail.toLowerCase().includes(term) ||
      (c.patientPhone && c.patientPhone.includes(term))
    );
  });

  return (
    <div
      className="rounded-3xl border shadow-lg overflow-hidden flex flex-col md:flex-row h-[750px] max-h-[85vh]"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* LEFT: Conversation List Sidebar */}
      <div
        className="w-full md:w-80 lg:w-96 border-r flex flex-col shrink-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        {/* Search header */}
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-subtle)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-lg text-[var(--text-primary)]">
              Patient Messages
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-sage-100 dark:bg-sage-900 text-sage-800 dark:text-sage-200 font-semibold">
              {conversations.length} Active
            </span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-base)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-sage-500"
            />
          </div>
        </div>

        {/* List of Conversations */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-color)]">
          {loadingConv ? (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-sage-600 mb-2" />
              <p className="text-xs text-[var(--text-muted)]">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              No patient conversations found.
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = selectedConv?.id === c.id;
              const hasUnread = c.unreadDoctorCount > 0;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedConv(c)}
                  className={`w-full text-left p-4 flex items-start gap-3 transition-colors ${
                    isSelected
                      ? "bg-sage-50 dark:bg-sage-950/40 border-l-4 border-sage-600"
                      : "hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  <PatientAvatar
                    src={c.patientPhotoURL}
                    name={c.patientName}
                    size="sm"
                    className="shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`text-xs font-semibold truncate ${hasUnread ? "text-sage-800 dark:text-sage-200 font-bold" : "text-[var(--text-primary)]"}`}>
                        {c.patientName}
                      </span>
                      {hasUnread && (
                        <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {c.unreadDoctorCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] truncate">
                      {c.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* MIDDLE: Active Chat Thread Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConv ? (
          <>
            {/* Thread Header */}
            <div className="px-6 py-3 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-subtle)] shrink-0">
              <div className="flex items-center gap-3">
                <PatientAvatar
                  src={selectedConv.patientPhotoURL}
                  name={selectedConv.patientName}
                  size="sm"
                  className="shrink-0"
                />
                <div>
                  <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                    {selectedConv.patientName}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)]">
                    {selectedConv.patientEmail && <span>{selectedConv.patientEmail}</span>}
                    {selectedConv.patientPhone && <span>• {selectedConv.patientPhone}</span>}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`text-xs px-3 py-1.5 rounded-full border border-[var(--border-color)] transition-colors ${
                  showHistory
                    ? "bg-sage-600 text-white"
                    : "hover:bg-[var(--bg-base)] text-[var(--text-secondary)]"
                }`}
              >
                {showHistory ? "Hide Medical Profile" : "View Medical Profile"}
              </button>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-[var(--text-muted)]">
                  No messages yet. Send a greeting to begin consultation.
                </div>
              ) : (
                messages.map((msg) => {
                  const isDoctor = msg.senderRole === "doctor";
                  const time = msg.createdAt?.toDate
                    ? msg.createdAt.toDate().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isDoctor ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                          isDoctor
                            ? "bg-sage-600 text-white rounded-br-none"
                            : "bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-bl-none"
                        }`}
                      >
                        {!isDoctor && (
                          <p className="text-[10px] font-bold text-sage-700 dark:text-sage-300 mb-1">
                            {msg.senderName} (Patient)
                          </p>
                        )}

                        {/* Attachments */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="space-y-2 mb-2">
                            {msg.attachments.map((att, idx) => {
                              const isImg =
                                att.type?.startsWith("image/") ||
                                att.name.match(/\.(jpeg|jpg|png|webp|gif)$/i);
                              return isImg ? (
                                <a
                                  key={idx}
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block relative w-48 h-36 rounded-xl overflow-hidden border border-black/10 hover:opacity-90"
                                >
                                  <Image
                                    src={att.url}
                                    alt={att.name}
                                    fill
                                    className="object-cover"
                                  />
                                </a>
                              ) : (
                                <a
                                  key={idx}
                                  href={att.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border ${
                                    isDoctor
                                      ? "bg-sage-700/50 border-white/20 text-white"
                                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                                  }`}
                                >
                                  <FileText className="w-4 h-4 shrink-0" />
                                  <span className="truncate max-w-[160px]">{att.name}</span>
                                  <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                                </a>
                              );
                            })}
                          </div>
                        )}

                        {msg.text && (
                          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                            {msg.text}
                          </p>
                        )}

                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                            isDoctor ? "text-sage-100/80" : "text-[var(--text-muted)]"
                          }`}
                        >
                          <span>{time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Pending Attachments */}
            {pendingAttachments.length > 0 && (
              <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-subtle)] flex items-center gap-3 overflow-x-auto">
                {pendingAttachments.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-900 text-xs text-sage-800 dark:text-sage-200"
                  >
                    <Paperclip className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{att.name}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingAttachments((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="ml-1 text-sage-600 hover:text-rose-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-[var(--border-color)] flex items-center gap-2 bg-[var(--bg-surface)] shrink-0"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || sending}
                className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-sage-600 hover:bg-[var(--bg-subtle)] transition-colors"
                title="Send prescription or document"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-sage-600" />
                ) : (
                  <Paperclip className="w-5 h-5" />
                )}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Reply as Dr. Pratima Agale..."
                className="flex-1 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-base)] text-xs sm:text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-sage-500"
              />

              <button
                type="submit"
                disabled={sending || (!inputText.trim() && pendingAttachments.length === 0)}
                className="px-5 py-2 rounded-full bg-sage-600 hover:bg-sage-700 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all disabled:opacity-40"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Reply</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[var(--text-muted)]">
            <MessageSquare className="w-12 h-12 text-sage-400 mb-3" />
            <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
              No Patient Selected
            </h3>
            <p className="text-xs max-w-sm mt-1">
              Select any patient conversation from the left sidebar to review their medical dossier and chat in real time.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT: Patient Clinical Dossier Drawer (Collapsible) */}
      {selectedConv && showHistory && (
        <div
          className="w-full md:w-80 lg:w-96 border-l flex flex-col shrink-0 overflow-y-auto p-5 space-y-6"
          style={{
            borderColor: "var(--border-color)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
              Clinical Dossier
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sage-200 dark:bg-sage-800 text-sage-800 dark:text-sage-200">
              {patientProfile?.bloodGroup || "Blood Group: N/A"}
            </span>
          </div>

          {/* Vitals & Basics */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">DOB:</span>
              <span className="font-medium text-[var(--text-primary)]">
                {patientProfile?.dateOfBirth || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Gender:</span>
              <span className="font-medium text-[var(--text-primary)] capitalize">
                {patientProfile?.gender || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Emergency:</span>
              <span className="font-medium text-[var(--text-primary)]">
                {patientProfile?.emergencyContact || "Not provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Address:</span>
              <span className="font-medium text-[var(--text-primary)] truncate max-w-[150px]">
                {patientProfile?.address || "Not provided"}
              </span>
            </div>
          </div>

          {/* Clinical Alerts / Allergies */}
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Known Allergies:</span>
            </div>
            <p className="text-[11px] text-rose-900 dark:text-rose-300">
              {patientProfile?.allergies || "No allergies reported."}
            </p>
          </div>

          {/* Current Medications & Chronic Illnesses */}
          <div className="space-y-3 text-xs">
            <div>
              <p className="font-bold text-[var(--text-primary)] mb-1">
                Current Medications:
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                {patientProfile?.currentMedications || "None"}
              </p>
            </div>

            <div>
              <p className="font-bold text-[var(--text-primary)] mb-1">
                Chronic Diseases:
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                {patientProfile?.chronicDiseases || "None"}
              </p>
            </div>

            <div>
              <p className="font-bold text-[var(--text-primary)] mb-1">
                Medical History & Complaints:
              </p>
              <p className="text-[11px] text-[var(--text-secondary)] p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                {patientProfile?.medicalHistory || "None"}
              </p>
            </div>
          </div>

          {/* Diagnostic Records */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-xs text-[var(--text-primary)]">
                Uploaded Records ({patientRecords.length})
              </p>
            </div>
            {patientRecords.length === 0 ? (
              <p className="text-[11px] text-[var(--text-muted)] italic">
                No diagnostic files uploaded by patient.
              </p>
            ) : (
              <div className="space-y-1.5">
                {patientRecords.map((r) => (
                  <a
                    key={r.id}
                    href={r.documentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs hover:border-sage-500 transition-colors"
                  >
                    <span className="truncate max-w-[170px] font-medium text-[var(--text-primary)]">
                      {r.title}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

