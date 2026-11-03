"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  RotateCcw,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAppointment } from "@/lib/appointment-context";

const QUICK_SUGGESTIONS = [
  "🌸 PCOD / Hormones",
  "🦋 Thyroid & Fatigue",
  "🌱 Child Immunity",
  "⚡ Chronic Migraines",
  "🌿 Joint Pain & Arthritis",
  "💆‍♀️ Hair Fall & Rash",
  "🧘‍♀️ Anxiety & Sleep",
];

type Message = {
  role: "assistant" | "user";
  content: string;
};

type IntakeAnalysis = {
  detectedCondition: string;
  duration: string;
  severity: string;
  careStream: string;
  modalities?: string;
  prepTip: string;
  readyToBook?: boolean;
};

type AiIntakeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good Morning!", emoji: "☀️" };
  if (hour < 17) return { text: "Good Afternoon!", emoji: "🌤️" };
  return { text: "Good Evening!", emoji: "🌙" };
}

export default function AiIntakeModal({ isOpen, onClose }: AiIntakeModalProps) {
  const { openAppointment } = useAppointment();

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am CuraAI, Dr. Pratima's clinical intake assistant. Tell me what symptoms or health concerns you are experiencing, and I'll help guide your care.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [greeting, setGreeting] = useState<{ text: string; emoji: string }>({
    text: "Good Day!",
    emoji: "✨",
  });
  const [analysis, setAnalysis] = useState<IntakeAnalysis>({
    detectedCondition: "Constitutional Consultation",
    duration: "New Case",
    severity: "Standard",
    careStream: "Classical Individualized Homeopathy",
    modalities: "To be evaluated",
    prepTip: "Keep past lab reports or medical history handy.",
    readyToBook: false,
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setGreeting(getGreeting());
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, aiLoading]);

  const handleSendMessage = async (userText?: string) => {
    const textToSend = userText || chatInput.trim();
    if (!textToSend || aiLoading) return;

    const newMessages: Message[] = [...chatMessages, { role: "user", content: textToSend }];
    setChatMessages(newMessages);
    setChatInput("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/consult-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        if (data.analysis) {
          setAnalysis(data.analysis);
        }
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Thank you for sharing your symptoms. How long have you been experiencing this, and does anything make it better or worse?",
          },
        ]);
      }
    } catch (e) {
      console.error("AI Intake error:", e);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Thank you for sharing that. Whenever you are ready, you can book a direct video consultation with Dr. Pratima.",
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleBookNow = () => {
    onClose();
    openAppointment({ condition: analysis.detectedCondition });
  };

  const handleResetChat = () => {
    setChatMessages([
      {
        role: "assistant",
        content:
          "Hello! I am CuraAI, Dr. Pratima's clinical intake assistant. Tell me what symptoms or health concerns you are experiencing, and I'll help guide your care.",
      },
    ]);
    setAnalysis({
      detectedCondition: "Constitutional Consultation",
      duration: "New Case",
      severity: "Standard",
      careStream: "Classical Individualized Homeopathy",
      modalities: "To be evaluated",
      prepTip: "Keep past lab reports or medical history handy.",
      readyToBook: false,
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .cura-glass-card {
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(28px) saturate(190%);
          -webkit-backdrop-filter: blur(28px) saturate(190%);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
        }
        .dark .cura-glass-card {
          background: rgba(20, 32, 25, 0.92);
          backdrop-filter: blur(28px) saturate(190%);
          -webkit-backdrop-filter: blur(28px) saturate(190%);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }
        .cura-welcome-banner {
          background: linear-gradient(135deg, rgba(253, 247, 237, 0.95) 0%, rgba(240, 248, 243, 0.92) 100%);
          border-bottom: 1px solid rgba(47, 74, 61, 0.1);
        }
        .dark .cura-welcome-banner {
          background: linear-gradient(135deg, rgba(32, 48, 38, 0.95) 0%, rgba(24, 38, 30, 0.92) 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
      `}</style>

      {/* Floating Glass UI Pop-up Window Docked at Bottom-Right */}
      <div
        className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[100000] w-[370px] sm:w-[410px] max-w-[calc(100vw-24px)] h-[620px] max-h-[calc(100vh-80px)] rounded-[28px] cura-glass-card border border-white/70 dark:border-white/10 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="CuraAI Health Assistant"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/5 dark:border-white/10 bg-white/40 dark:bg-black/20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-serif font-bold text-sm text-[var(--text-primary)] tracking-wide">
              Dr. Pratima Agale Clinic
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Reset conversation"
              aria-label="Reset chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[var(--text-secondary)] hover:text-rose-600 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Upper Welcome Banner (Styled like Feddy Glass Card in screenshot) */}
        <div className="cura-welcome-banner p-4 shrink-0 relative overflow-hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#253e31] dark:text-[#a3cfb5] flex items-center gap-1.5">
                <span>{greeting.text}</span>
                <span>{greeting.emoji}</span>
              </h3>
              <p className="text-xs text-[#3a5848] dark:text-[#c4ded0] leading-relaxed mt-1">
                I&apos;m <strong>CuraAI</strong>, Dr. Pratima&apos;s digital health assistant. Ask me about symptoms and homeopathic care.
              </p>
            </div>

            {/* Character Avatar Preview */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-[#5a8a72]/40 shadow-md bg-white dark:bg-zinc-800">
              <Image
                src="/cura-avatar.png"
                alt="CuraAI Assistant"
                fill
                className="object-cover object-top"
                sizes="80px"
                priority
              />
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-black/5 dark:border-white/10">
            <p className="font-serif font-extrabold text-xs text-[#1e3427] dark:text-[#e1f0e8] tracking-wider uppercase">
              CURAAI • Conversational Health Intake
            </p>
          </div>
        </div>

        {/* Middle: Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs sm:text-sm">
          {chatMessages.map((msg, index) => {
            const isBot = msg.role === "assistant";
            return (
              <div
                key={index}
                className={`flex gap-2 ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 mt-1 border border-sage-400">
                    <Image
                      src="/cura-avatar.png"
                      alt="CuraAI"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    isBot
                      ? "bg-white/95 dark:bg-zinc-800/95 text-[var(--text-primary)] border border-black/5 dark:border-white/10 rounded-tl-sm"
                      : "bg-[#2f4a3d] text-white rounded-tr-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {aiLoading && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] italic pl-8">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-bounce [animation-delay:0.4s]" />
              <span>CuraAI is reviewing your symptoms...</span>
            </div>
          )}

          {/* Book Consultation CTA if ready */}
          {analysis.readyToBook && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2 mt-2">
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                Symptom summary prepared for Dr. Pratima Agale.
              </p>
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-sage-600 hover:bg-sage-700 text-white font-medium text-xs shadow-sm transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Video Consultation with Doctor</span>
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Symptom Chips */}
        <div className="px-3 py-1.5 border-t border-black/5 dark:border-white/10 bg-white/40 dark:bg-black/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {QUICK_SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              type="button"
              disabled={aiLoading}
              onClick={() => handleSendMessage(sug)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-black/10 dark:border-white/15 text-[var(--text-secondary)] hover:text-sage-700 hover:border-sage-400 dark:hover:text-sage-300 transition-colors shrink-0 shadow-2xs"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Bottom Pill Input Bar (Exact look of Feddy Input Bar) */}
        <div className="p-3 border-t border-black/5 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center rounded-full bg-white dark:bg-zinc-800 border border-black/15 dark:border-white/15 shadow-sm px-3.5 py-1.5 gap-2 focus-within:ring-2 focus-within:ring-sage-500/50"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="What is your health concern..."
              disabled={aiLoading}
              className="flex-1 bg-transparent text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || aiLoading}
              className="w-8 h-8 rounded-full bg-[#2f4a3d] hover:bg-[#3f6352] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-40 disabled:hover:bg-[#2f4a3d]"
              aria-label="Send message"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
