"use client";
// components/vitaintake/PatientChat.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Patient-facing AI interview chat UI
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { parseCaseReport, cleanMessage } from "@/lib/vitaintake";
import styles from "./vitaintake.module.css";

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className={styles.typingBubble}>
      <span className={styles.dot} style={{ animationDelay: "0s" }} />
      <span className={styles.dot} style={{ animationDelay: "0.18s" }} />
      <span className={styles.dot} style={{ animationDelay: "0.36s" }} />
    </div>
  );
}

// ── Completion card ──────────────────────────────────────────────────────────
function CompletionCard({ onViewReport }) {
  return (
    <div className={styles.completionCard}>
      <div className={styles.completionIcon}>✅</div>
      <div className={styles.completionTitle}>Case Report Generated</div>
      <div className={styles.completionSub}>
        Your complete case study has been prepared for the doctor's review.
      </div>
      <button className={styles.completionBtn} onClick={onViewReport}>
        View Doctor's Report →
      </button>
    </div>
  );
}

// ── Main PatientChat ─────────────────────────────────────────────────────────
export default function PatientChat({ onReportReady }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [caseReport, setCaseReport] = useState(null);
  const [questionNum, setQuestionNum] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Call the API route ─────────────────────────────────────────────────────
  async function callAPI(msgs) {

  // send only last 10 messages to keep context small
  const trimmed = msgs.slice(-10);

  const res = await fetch("/api/intake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({
      messages: trimmed
    }),
  });

  if (!res.ok) throw new Error("API error");

  const data = await res.json();
  return data.text;
}

  // ── Start the session ──────────────────────────────────────────────────────
  async function startSession() {
    setStarted(true);
    setLoading(true);
    try {
      const text = await callAPI([
        { role: "user", content: "Please begin the homeopathic case-taking." },
      ]);
      setMessages([{ role: "assistant", content: text }]);
    } catch {
      setMessages([
        {
          role: "assistant",
          content:
            "Namaste 🙏 Welcome. I'm Dr. Pratima's Ai Assistant, your homeopathic intake guide. To help the doctor understand your case fully, I'll be asking you some questions. Let's start — could you please share your name, age, and gender?",
        },
      ]);
    }
    setLoading(false);
    inputRef.current?.focus();
  }

  // ── Send a message ─────────────────────────────────────────────────────────
  async function sendMessage() {
    const text = input.trim();
    if (!text || loading || caseReport) return;

const newMessages = [
  ...messages,
  { role: "user", content: text }
];    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setQuestionNum((q) => q + 1);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const raw = await callAPI(
        newMessages.map((m) => ({ role: m.role, content: m.content }))
      );
      const report = parseCaseReport(raw);
      const clean = cleanMessage(raw);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: clean, hasReport: !!report },
      ]);

      if (report) {
        setCaseReport(report);
        if (onReportReady) onReportReady(report);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm sorry, there was a connection issue. Please try again.",
        },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

const progress = Math.min((questionNum / 20) * 100, 100);
  // ── Landing screen ─────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className={styles.landing}>
        <div className={styles.landingInner}>
          <div className={styles.landingIcon}>🌿</div>
          <div className={styles.landingTag}>Homeopathic Case Taking</div>
          <h1 className={styles.landingTitle}>VitaIntake</h1>
          <p className={styles.landingSubtitle}>
            Classical homeopathy, intelligently guided
          </p>
          <p className={styles.landingDesc}>
            Our AI will guide you through a thorough case-taking interview —
            just like speaking with a classical homeopath. Your answers help the
            doctor choose the right remedy for you.
          </p>
          <div className={styles.trustBadges}>
            {[
              ["🔒", "Confidential"],
              ["💬", "Non-judgmental"],
              ["⏱️", "~10 minutes"],
              ["🎯", "Personalized"],
            ].map(([icon, label]) => (
              <div key={label} className={styles.badge}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <button className={styles.startBtn} onClick={startSession}>
            Begin Case Taking →
          </button>
        </div>
      </div>
    );
  }

  // ── Chat screen ────────────────────────────────────────────────────────────
  return (
    <div className={styles.chatWrapper}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderIcon}>🌿</div>
        <div>
          <div className={styles.chatHeaderTitle}>Dr. Pratima's AI Assistant</div>
          <div className={styles.chatHeaderSub}>
            Homeopathic Case Taking · Confidential
          </div>
        </div>
        <div className={styles.progressArea}>
          <div className={styles.progressLabel}>
            {caseReport ? "Complete ✓" : `Q ${questionNum} / 23`}
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{ width: `${caseReport ? 100 : progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg, i) => {
          const isAI = msg.role === "assistant";
          return (
            <div
              key={i}
              className={`${styles.msgRow} ${isAI ? styles.msgRowAI : styles.msgRowUser}`}
            >
              {isAI && <div className={styles.avatar}>🌿</div>}
              <div className={styles.msgCol}>
                <div
                  className={`${styles.bubble} ${isAI ? styles.bubbleAI : styles.bubbleUser}`}
                >
                  {msg.content}
                </div>
                {msg.hasReport && caseReport && (
                  <CompletionCard onViewReport={() => onReportReady?.(caseReport, true)} />
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className={`${styles.msgRow} ${styles.msgRowAI}`}>
            <div className={styles.avatar}>🌿</div>
            <TypingDots />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!caseReport && (
        <div className={styles.inputArea}>
          <div className={styles.inputInner}>
            <textarea
              ref={(el) => {
                inputRef.current = el;
                textareaRef.current = el;
              }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your answer here…"
              rows={1}
              className={styles.textarea}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={`${styles.sendBtn} ${input.trim() && !loading ? styles.sendBtnActive : ""}`}
            >
              ↑
            </button>
          </div>
          <div className={styles.inputHint}>
            Press Enter to send · Your answers are private and secure
          </div>
        </div>
      )}
    </div>
  );
}
