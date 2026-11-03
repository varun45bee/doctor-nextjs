"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Loader2,
  FileText,
  AlertCircle,
  ExternalLink,
  Shield,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ChatMessage, MessageAttachment } from "@/lib/types/chat";
import {
  getOrCreateConversation,
  subscribeToMessages,
  sendChatMessage,
  markConversationRead,
  getConversationIdForPatient,
} from "@/lib/services/chat-service";
import { uploadChatAttachment } from "@/lib/storage/patient-storage";

export default function PatientChatPage() {
  const { user, userProfile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<MessageAttachment[]>([]);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or fetch conversation
  useEffect(() => {
    if (!user) return;

    let unsubMessages: (() => void) | undefined;

    async function initChat() {
      setLoading(true);
      try {
        const conv = await getOrCreateConversation({
          uid: user!.uid,
          fullName: userProfile?.fullName || user!.displayName || "Patient",
          email: user!.email || "",
          phone: userProfile?.phone || "",
          photoURL: userProfile?.photoURL || user!.photoURL || "",
        });

        // Mark read for patient
        await markConversationRead(conv.id, "patient");

        // Subscribe to real-time messages
        unsubMessages = subscribeToMessages(conv.id, (msgs) => {
          setMessages(msgs);
          setLoading(false);
          // Mark read whenever new messages arrive while patient has chat open
          markConversationRead(conv.id, "patient");
        });
      } catch (err) {
        console.error("Failed to load chat:", err);
        setLoading(false);
      }
    }

    initChat();

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [user, userProfile]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingAttachments]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const convId = getConversationIdForPatient(user.uid);
    setUploadingAttachment(true);
    try {
      const att = await uploadChatAttachment(convId, file);
      setPendingAttachments((prev) => [...prev, att]);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to upload attachment");
    } finally {
      setUploadingAttachment(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!inputText.trim() && pendingAttachments.length === 0)) return;

    setSending(true);
    const convId = getConversationIdForPatient(user.uid);
    const textToSend = inputText.trim();
    const attachmentsToSend = [...pendingAttachments];

    setInputText("");
    setPendingAttachments([]);

    try {
      await sendChatMessage({
        conversationId: convId,
        senderId: user.uid,
        senderRole: "patient",
        senderName: userProfile?.fullName || user.displayName || "Patient",
        senderPhotoURL: userProfile?.photoURL || user.photoURL || undefined,
        text: textToSend,
        attachments: attachmentsToSend,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
      // restore text on failure
      setInputText(textToSend);
      setPendingAttachments(attachmentsToSend);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-130px)] min-h-[550px]">
      {/* Emergency Disclaimer Banner */}
      <div className="mb-3 px-4 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            For medical emergencies, acute chest pain, or breathing distress, visit the nearest emergency hospital immediately.
          </span>
        </div>
      </div>

      {/* Main Chat Box Card */}
      <div
        className="flex-1 flex flex-col rounded-3xl border shadow-lg overflow-hidden"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0 bg-[var(--bg-subtle)]">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-sage-300 dark:border-sage-700 shadow-sm">
              <Image
                src="/images/doctor-portrait.jpg"
                alt="Dr. Pratima Agale"
                fill
                className="object-cover object-top"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[var(--text-primary)]">
                Dr. Pratima Agale
              </h2>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Homeopathic Consultant • Clinical Messages
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <Shield className="w-3.5 h-3.5 text-sage-600" />
            <span>End-to-End Encrypted Patient Portal</span>
          </div>
        </div>

        {/* Message Thread Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-sage-600" />
              <p className="text-xs text-[var(--text-muted)]">Connecting to clinic...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)]">
              <div className="w-14 h-14 rounded-full bg-sage-50 dark:bg-sage-950/40 text-sage-600 flex items-center justify-center mb-3">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="font-serif font-bold text-base text-[var(--text-primary)]">
                Consult Directly with Dr. Pratima Agale
              </h3>
              <p className="text-xs max-w-sm mt-1 mb-4">
                You can describe your symptoms, ask follow-up questions regarding your remedy dosage, or attach medical photos and reports.
              </p>
              <div className="text-[11px] px-3.5 py-1.5 rounded-full bg-sage-100 dark:bg-sage-900 text-sage-800 dark:text-sage-200">
                Dr. Pratima Agale typically responds during clinic hours (10:00 AM – 7:00 PM IST).
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderRole === "patient";
              const timeString = msg.createdAt?.toDate
                ? msg.createdAt.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Just now";

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-sage-200 shrink-0 mb-1">
                      <Image
                        src="/images/doctor-portrait.jpg"
                        alt="Dr. Pratima Agale"
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                      isMe
                        ? "bg-sage-600 text-white rounded-br-none"
                        : "bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-bl-none"
                    }`}
                  >
                    {!isMe && (
                      <p className="text-[11px] font-bold text-sage-700 dark:text-sage-300 mb-1">
                        Dr. Pratima Agale
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
                              className="block relative w-48 h-36 rounded-xl overflow-hidden border border-black/10 hover:opacity-90 transition-opacity"
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
                                isMe
                                  ? "bg-sage-700/50 border-white/20 text-white"
                                  : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                              }`}
                            >
                              <FileText className="w-4 h-4 shrink-0" />
                              <span className="truncate max-w-[180px]">{att.name}</span>
                              <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
                            </a>
                          );
                        })}
                      </div>
                    )}

                    {/* Message Body */}
                    {msg.text && (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">
                        {msg.text}
                      </p>
                    )}

                    {/* Footer / Time & Read Status */}
                    <div
                      className={`flex items-center justify-end gap-1.5 mt-1.5 text-[10px] ${
                        isMe ? "text-sage-100/80" : "text-[var(--text-muted)]"
                      }`}
                    >
                      <span>{timeString}</span>
                      {isMe && (
                        <span>
                          {msg.read ? (
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                          ) : (
                            <Check className="w-3.5 h-3.5 opacity-70" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Pending Attachment Previews */}
        {pendingAttachments.length > 0 && (
          <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-subtle)] flex items-center gap-3 overflow-x-auto">
            {pendingAttachments.map((att, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage-100 dark:bg-sage-900 text-xs text-sage-800 dark:text-sage-200 border border-sage-300 dark:border-sage-800 shrink-0"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{att.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    setPendingAttachments((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="ml-1 text-sage-500 hover:text-rose-600"
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
          className="p-3 sm:p-4 border-t border-[var(--border-color)] flex items-center gap-2 bg-[var(--bg-surface)] shrink-0"
        >
          {/* File Attachment Button */}
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
            disabled={uploadingAttachment || sending}
            className="p-2.5 rounded-full text-[var(--text-secondary)] hover:text-sage-600 hover:bg-[var(--bg-subtle)] transition-colors disabled:opacity-50"
            title="Attach image or report"
          >
            {uploadingAttachment ? (
              <Loader2 className="w-5 h-5 animate-spin text-sage-600" />
            ) : (
              <Paperclip className="w-5 h-5" />
            )}
          </button>

          {/* Text input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message to Dr. Pratima Agale..."
            className="flex-1 px-4 py-2.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sage-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={
              sending ||
              (!inputText.trim() && pendingAttachments.length === 0)
            }
            className="p-2.5 sm:px-5 sm:py-2.5 rounded-full bg-sage-600 hover:bg-sage-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-40"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

