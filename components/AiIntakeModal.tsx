"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Menu,
  RotateCcw,
  X,
  Calendar,
  Stethoscope,
  Leaf,
  Paperclip,
  Phone,
  Info,
  Square,
  Home,
} from "lucide-react";
import { useAppointment } from "@/lib/appointment-context";
import { detectContextualReaction, fetchReactionGif } from "@/lib/giphy/reactionDetector";
import ChatMessage, { type ChatMessageType } from "@/components/chatbot/ChatMessage";
import {
  generateEnterpriseConversationResponse,
  type ConversationContextState,
} from "@/lib/ai/conversationContext";

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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning!";
  if (hour >= 12 && hour < 17) return "Good Afternoon!";
  return "Good Evening!";
}

const formatCurrentTime = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export default function AiIntakeModal({ isOpen, onClose }: AiIntakeModalProps) {
  const { openAppointment } = useAppointment();

  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [greeting, setGreeting] = useState("Good Evening!");

  const [conversationContext, setConversationContext] = useState<ConversationContextState>({
    currentTopic: "general_greeting",
    currentEmotion: "neutral",
    reportedSymptoms: [],
    duration: "",
    modalities: "",
    recoveryStatus: "none",
    isEmergency: false,
    lastIntent: "greeting",
    turnCount: 0,
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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if conversation has started (user has sent at least one message)
  const hasChatStarted = chatMessages.some((m) => m.role === "user");

  // Smoothly scroll the messages container internally without scrolling the parent window
  const scrollToBottom = (smooth = true) => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Initialize greeting on mount
  useEffect(() => {
    setGreeting(getGreeting());
    setChatMessages([]);
  }, []);

  // Bulletproof Body Scroll Lock (Position Fixed + ScrollY preserve + Lenis Pause)
  useEffect(() => {
    if (!isOpen) return;

    // 1. Pause Lenis smooth scrolling so background page never scrolls
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (lenis) {
      lenis.stop();
    }

    // 2. Prevent Lenis scrolling on document and body
    document.body.setAttribute("data-lenis-prevent", "true");
    document.documentElement.setAttribute("data-lenis-prevent", "true");

    // 3. Lock window scroll using position:fixed technique to physically freeze background on iOS & Mac
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const origPosition = document.body.style.position;
    const origTop = document.body.style.top;
    const origLeft = document.body.style.left;
    const origRight = document.body.style.right;
    const origWidth = document.body.style.width;
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    const origBodyOverscroll = document.body.style.overscrollBehavior;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.removeAttribute("data-lenis-prevent");
      document.documentElement.removeAttribute("data-lenis-prevent");
      if (lenis) {
        lenis.start();
      }
      document.body.style.position = origPosition;
      document.body.style.top = origTop;
      document.body.style.left = origLeft;
      document.body.style.right = origRight;
      document.body.style.width = origWidth;
      document.body.style.overflow = origBodyOverflow;
      document.body.style.overscrollBehavior = origBodyOverscroll;
      document.documentElement.style.overflow = origHtmlOverflow;
      document.documentElement.style.overscrollBehavior = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Non-passive wheel and touch listeners on the modal dialog to prevent scroll chaining
  useEffect(() => {
    if (!isOpen) return;

    const modalEl = modalContainerRef.current;
    if (!modalEl) return;

    const handleWheel = (e: WheelEvent) => {
      const scrollArea = chatContainerRef.current;
      if (!scrollArea) return;

      const isInside = scrollArea.contains(e.target as Node);
      if (!isInside) {
        // Scrolling outside the messages area (e.g. header, input) -> prevent window scroll
        e.preventDefault();
        return;
      }

      // Check boundary conditions inside messages area
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      const isAtTop = scrollTop <= 0 && e.deltaY < 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;

      if (isAtTop || isAtBottom) {
        e.preventDefault();
      }
    };

    modalEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      modalEl.removeEventListener("wheel", handleWheel);
    };
  }, [isOpen]);

  // Non-passive backdrop touch listener to completely prevent mobile background drag bleed
  useEffect(() => {
    if (!isOpen) return;
    const backdropEl = backdropRef.current;
    if (!backdropEl) return;

    const preventBackdropTouch = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };

    backdropEl.addEventListener("touchmove", preventBackdropTouch, { passive: false });
    return () => {
      backdropEl.removeEventListener("touchmove", preventBackdropTouch);
    };
  }, [isOpen]);

  // Auto-scroll chat container to bottom when messages or loading state change
  useEffect(() => {
    scrollToBottom(true);
  }, [chatMessages, aiLoading]);

  // Scroll to bottom when header finishes collapsing
  useEffect(() => {
    if (hasChatStarted) {
      const timer = setTimeout(() => scrollToBottom(true), 320);
      return () => clearTimeout(timer);
    }
  }, [hasChatStarted]);

  // Reset scroll to bottom when modal initially opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => scrollToBottom(false), 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setAiLoading(false);
  };

  const handleRegenerate = () => {
    if (aiLoading) return;

    let lastUserIndex = -1;
    for (let i = chatMessages.length - 1; i >= 0; i--) {
      if (chatMessages[i].role === "user") {
        lastUserIndex = i;
        break;
      }
    }
    if (lastUserIndex === -1) return;

    const userQuery = chatMessages[lastUserIndex].content;
    const historyBefore = chatMessages.slice(0, lastUserIndex);
    setChatMessages(historyBefore);

    setTimeout(() => {
      handleSendMessage(userQuery);
    }, 40);
  };

  const handleSendMessage = async (userText?: string) => {
    const textToSend = userText || chatInput.trim();
    if (!textToSend || aiLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentTime = formatCurrentTime();
    const userMessageId = `user-${Date.now()}`;
    const botMessageId = `bot-${Date.now()}`;

    const newMessages: ChatMessageType[] = [
      ...chatMessages,
      { id: userMessageId, role: "user", content: textToSend, timestamp: currentTime },
    ];
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
          context: conversationContext,
        }),
        signal: controller.signal,
      });

      if (res.ok) {
        const data = await res.json();

        // 1. Instantly display assistant response without waiting for GIF
        const shouldShowGif = Boolean(data.gif?.should_show && data.gif?.search_query);
        const assistantMessage: ChatMessageType = {
          id: botMessageId,
          role: "assistant",
          content:
            data.reply ||
            "I am here to guide your care. How can I help you today?",
          isGifLoading: shouldShowGif,
          gif: null,
          timestamp: formatCurrentTime(),
        };

        setChatMessages((prev) => [...prev, assistantMessage]);

        // 2. Update multi-turn conversation memory context
        if (data.context_update) {
          setConversationContext((prev) => ({
            ...prev,
            ...data.context_update,
            turnCount: prev.turnCount + 1,
          }));
        }

        // 3. Update Doctor Appointment Analysis
        if (data.analysis) {
          setAnalysis(data.analysis);
        }

        // 4. Asynchronously load GIPHY reaction without blocking the chat
        if (shouldShowGif) {
          fetchReactionGif(data.gif.search_query)
            .then((reactionGif) => {
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === botMessageId
                    ? { ...m, gif: reactionGif, isGifLoading: false }
                    : m
                )
              );
            })
            .catch(() => {
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === botMessageId ? { ...m, isGifLoading: false } : m
                )
              );
            });
        }
      } else {
        // Fallback for API error using Enterprise Conversation Engine
        const fallback = generateEnterpriseConversationResponse(
          textToSend,
          newMessages.map((m) => ({ role: m.role, content: m.content })),
          conversationContext
        );
        const shouldShowGif = Boolean(fallback.gif?.should_show && fallback.gif?.search_query);
        const assistantMessage: ChatMessageType = {
          id: botMessageId,
          role: "assistant",
          content: fallback.reply,
          isGifLoading: shouldShowGif,
          gif: null,
          timestamp: formatCurrentTime(),
        };
        setChatMessages((prev) => [...prev, assistantMessage]);

        if (fallback.context_update) {
          setConversationContext((prev) => ({
            ...prev,
            ...fallback.context_update,
            turnCount: prev.turnCount + 1,
          }));
        }

        if (fallback.analysis) {
          setAnalysis(fallback.analysis);
        }

        if (shouldShowGif) {
          fetchReactionGif(fallback.gif.search_query)
            .then((reactionGif) => {
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === botMessageId
                    ? { ...m, gif: reactionGif, isGifLoading: false }
                    : m
                )
              );
            })
            .catch(() => {
              setChatMessages((prev) =>
                prev.map((m) =>
                  m.id === botMessageId ? { ...m, isGifLoading: false } : m
                )
              );
            });
        }
      }
    } catch (e: any) {
      if (e?.name === "AbortError") {
        return;
      }
      console.warn("AI Intake network exception, activating client clinical engine:", e);
      const fallback = generateEnterpriseConversationResponse(
        textToSend,
        newMessages.map((m) => ({ role: m.role, content: m.content })),
        conversationContext
      );
      const shouldShowGif = Boolean(fallback.gif?.should_show && fallback.gif?.search_query);
      setChatMessages((prev) => [
        ...prev,
        {
          id: botMessageId,
          role: "assistant",
          content: fallback.reply,
          isGifLoading: shouldShowGif,
          gif: null,
          timestamp: formatCurrentTime(),
        },
      ]);

      if (fallback.context_update) {
        setConversationContext((prev) => ({
          ...prev,
          ...fallback.context_update,
          turnCount: prev.turnCount + 1,
        }));
      }

      if (fallback.analysis) {
        setAnalysis(fallback.analysis);
      }

      if (shouldShowGif) {
        fetchReactionGif(fallback.gif.search_query)
          .then((reactionGif) => {
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === botMessageId
                  ? { ...m, gif: reactionGif, isGifLoading: false }
                  : m
              )
            );
          })
          .catch(() => {
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === botMessageId ? { ...m, isGifLoading: false } : m
              )
            );
          });
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setAiLoading(false);
    }
  };

  const handleQuickAction = (actionPrompt: string) => {
    handleSendMessage(actionPrompt);
  };

  const handleBookNow = () => {
    onClose();
    openAppointment({ condition: analysis.detectedCondition });
  };

  const handleResetChat = () => {
    setShowMenu(false);
    setChatMessages([]);
    setConversationContext({
      currentTopic: "general_greeting",
      currentEmotion: "neutral",
      reportedSymptoms: [],
      duration: "",
      modalities: "",
      recoveryStatus: "none",
      isEmergency: false,
      lastIntent: "greeting",
      turnCount: 0,
    });
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

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const timeStr = formatCurrentTime();
    const userMessageId = `user-file-${Date.now()}`;
    const botMessageId = `bot-file-${Date.now()}`;

    setChatMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: `📎 Attached report: ${fileName}`,
        timestamp: timeStr,
      },
      {
        id: botMessageId,
        role: "assistant",
        content: `I've noted your report "${fileName}". Please keep it handy during your consultation with Dr. Pratima so she can review the full clinical findings.`,
        timestamp: timeStr,
      },
    ]);

    e.target.value = "";
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
      {/* Backdrop to prevent background touch bleed and page scroll */}
      <div
        ref={backdropRef}
        data-lenis-prevent
        className="fixed inset-0 z-[99999] bg-black/40 sm:bg-black/35 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Chatbox UI matching Reference Image */}
      <div
        ref={modalContainerRef}
        data-lenis-prevent
        className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[100000] w-full sm:w-[420px] md:w-[440px] sm:max-w-[calc(100vw-24px)] h-[90dvh] sm:h-[690px] max-h-[92dvh] sm:max-h-[calc(100vh-48px)] rounded-t-[32px] sm:rounded-[32px] bg-[#f4f7f4] dark:bg-[#121c15] border border-[#cde2d4] dark:border-emerald-950/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-label="CuraAI Health Assistant"
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Hidden File Input for Attachment */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileUpload}
        />

        {/* Top Header Hero matching Reference Image */}
        <div
          onTouchMove={(e) => e.stopPropagation()}
          className="relative bg-[#103b2b] text-white shrink-0 select-none overflow-hidden touch-none"
        >
          {/* Subtle Organic Background Waves */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
            <svg
              viewBox="0 0 500 200"
              preserveAspectRatio="none"
              className="w-full h-full fill-emerald-700/40"
            >
              <path d="M0,100 C180,180 320,40 500,120 L500,200 L0,200 Z" />
            </svg>
          </div>

          {/* Row 1: Doctor Branding & Navigation Controls */}
          <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5 relative z-20">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 select-none">
                <span className="font-serif font-bold text-[15px] sm:text-base tracking-wide text-white border-b-2 border-emerald-400 pb-0.5">
                  Dr. Pratima Agale
                </span>

                {/* Compact Online Status Pill when Header is Collapsed */}
                <div
                  className={`flex items-center gap-1.5 transition-all duration-300 ${
                    hasChatStarted
                      ? "opacity-100 scale-100 translate-x-0 ml-1"
                      : "opacity-0 scale-95 -translate-x-2 pointer-events-none w-0 overflow-hidden"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-400/30 text-[10.5px] font-medium text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CuraAI
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.2]" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-white/90 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                title="Close"
                aria-label="Close"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Dropdown Menu when Hamburger is Clicked */}
          {showMenu && (
            <div className="absolute top-12 left-4 z-50 w-64 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-2 text-zinc-800 dark:text-zinc-200 text-xs animate-in fade-in zoom-in-95 duration-150">
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-zinc-700 transition cursor-pointer text-left"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-950 dark:text-emerald-300">
                  Book Video Consultation
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetChat}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition cursor-pointer text-left"
              >
                <RotateCcw className="w-4 h-4 text-zinc-500" />
                <span>Start New Conversation</span>
              </button>
              <a
                href="tel:+919136509988"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition cursor-pointer text-left"
              >
                <Phone className="w-4 h-4 text-zinc-500" />
                <span>Call Clinic (+91 91365 09988)</span>
              </a>
              <div className="px-3 py-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-700 mt-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Clinic: 10:30 AM - 9:00 PM</span>
              </div>
            </div>
          )}

          {/* Row 2: Hero Greeting & CuraAI 3D Avatar (Smoothly slides UP and collapses once chat starts) */}
          <div
            className={`transition-all duration-400 ease-in-out overflow-hidden ${
              hasChatStarted
                ? "max-h-0 opacity-0 -translate-y-4 pointer-events-none pb-0"
                : "max-h-[220px] opacity-100 translate-y-0 pb-2 sm:pb-3"
            }`}
          >
            <div className="flex items-center justify-between px-4 sm:px-5 relative z-10 py-1 sm:py-2">
              {/* Left Column: Blue House Icon + Assistant Title (Exact Feddy/Reference Layout) */}
              <div className="flex items-center gap-3 pr-2">
                
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white leading-snug">
                    I&apos;m CuraAI, Dr. Pratima&apos;s
                  </h2>
                  <p className="text-xs sm:text-sm font-normal text-white/90 leading-snug mt-0.5">
                    personal digital assistant.
                  </p>
                </div>
              </div>

              {/* Right Column: CuraAI Doctor 3D Character */}
              <div className="relative shrink-0 flex items-end justify-center">
                <div className="relative w-24 h-28 sm:w-28 sm:h-32 pointer-events-none drop-shadow-md">
                  <Image
                    src="/cura-avatar.png"
                    alt="CuraAI - Dr. Pratima's Digital Assistant"
                    fill
                    className="object-contain object-bottom"
                    sizes="(max-width: 640px) 96px, 112px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Chips Bar (Suggestions) - Smoothly hides once chat starts */}
        <div
          onTouchMove={(e) => e.stopPropagation()}
          className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden ${
            hasChatStarted
              ? "max-h-0 opacity-0 pointer-events-none py-0 -translate-y-2"
              : "max-h-32 opacity-100 py-2.5 translate-y-0"
          } px-3 bg-[#f4f7f4] dark:bg-[#121c15]`}
        >
          <div className="grid grid-cols-3 bg-[#def0e5] dark:bg-[#1c3024] rounded-2xl border border-[#cde5d5] dark:border-[#274633] p-1.5 sm:p-2 divide-x divide-[#c2ddcb] dark:divide-[#274633] shadow-xs">
            {/* Tab 1: Health Queries */}
            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "I have a health query about my symptoms. Can you help me understand them?"
                )
              }
              className="flex flex-col items-center justify-center text-center px-1 py-1 hover:bg-[#d0e6d7] dark:hover:bg-[#233d2e] rounded-xl transition cursor-pointer group"
            >
              <Stethoscope className="w-5 h-5 text-[#184433] dark:text-emerald-300 group-hover:scale-105 transition-transform stroke-[2]" />
              <span className="text-[11px] sm:text-xs font-semibold text-[#184433] dark:text-emerald-200 mt-1 line-clamp-1 leading-tight">
                Health Queries
              </span>
            </button>

            {/* Tab 2: Homeopathy Guidance */}
            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "Can you explain how constitutional homeopathy guidance can treat root causes?"
                )
              }
              className="flex flex-col items-center justify-center text-center px-1 py-1 hover:bg-[#d0e6d7] dark:hover:bg-[#233d2e] rounded-xl transition cursor-pointer group"
            >
              <Leaf className="w-5 h-5 text-[#184433] dark:text-emerald-300 group-hover:scale-105 transition-transform stroke-[2]" />
              <span className="text-[11px] sm:text-xs font-semibold text-[#184433] dark:text-emerald-200 mt-1 line-clamp-1 leading-tight">
                Homeopathy Guidance
              </span>
            </button>

            {/* Tab 3: Book Appointment */}
            <button
              type="button"
              onClick={handleBookNow}
              className="flex flex-col items-center justify-center text-center px-1 py-1 hover:bg-[#d0e6d7] dark:hover:bg-[#233d2e] rounded-xl transition cursor-pointer group"
            >
              <Calendar className="w-5 h-5 text-[#184433] dark:text-emerald-300 group-hover:scale-105 transition-transform stroke-[2]" />
              <span className="text-[11px] sm:text-xs font-semibold text-[#184433] dark:text-emerald-200 mt-1 line-clamp-1 leading-tight">
                Book Appointment
              </span>
            </button>
          </div>
        </div>

        {/* Middle Conversation Thread */}
        <div
          ref={chatContainerRef}
          data-lenis-prevent
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain chat-scroll-area p-3.5 sm:p-4 space-y-3 bg-[#f4f7f4] dark:bg-[#121c15] touch-pan-y"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
          }}
          onWheel={(e) => {
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Centered Date Badge matching Reference Image */}
          <div className="flex justify-center pt-0.5 pb-1">
            <span className="px-3.5 py-0.5 rounded-full bg-[#d7e7de] dark:bg-[#1f3629] text-[#3d5a49] dark:text-emerald-300 text-[11px] font-medium shadow-2xs select-none">
              Today
            </span>
          </div>

          {/* Messages */}
          {(() => {
            const latestAssistantIndex = chatMessages
              .map((m) => m.role)
              .lastIndexOf("assistant");
            return chatMessages.map((msg, idx) => (
              <ChatMessage
                key={msg.id || `${msg.content}-${idx}`}
                message={msg}
                isLatestAssistant={idx === latestAssistantIndex && idx > 0}
                onRegenerate={handleRegenerate}
                disabledActions={aiLoading}
              />
            ));
          })()}

          {/* Typing Indicator with Stop Generation Button */}
          {aiLoading && (
            <div className="flex items-center justify-between pl-2 pr-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 italic bg-white/80 dark:bg-black/30 backdrop-blur-xs py-1.5 px-3 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                <span className="font-medium text-zinc-800 dark:text-zinc-200">
                  CuraAI is generating...
                </span>
              </div>
              {/* <button
                type="button"
                onClick={handleStopGeneration}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 shadow-2xs transition-colors cursor-pointer text-xs font-medium"
                title="Stop generating"
              >
                <Square className="w-3 h-3 fill-current text-red-500" />
                <span>Stop</span>
              </button> */}
            </div>
          )}

          {/* Consultation Ready CTA Card */}
          {analysis.readyToBook && (
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800 shadow-md border border-emerald-300 dark:border-emerald-700 text-center space-y-2 mt-2">
              <p className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                Symptom summary prepared for Dr. Pratima Agale.
              </p>
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-[#184433] hover:bg-[#123628] text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Video Consultation with Doctor</span>
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Bottom Pill Input Bar matching Reference Image */}
        <div
          onTouchMove={(e) => e.stopPropagation()}
          className="p-3 bg-[#f4f7f4] dark:bg-[#121c15] shrink-0 sticky bottom-0 pb-[max(12px,env(safe-area-inset-bottom))] touch-none"
        >
          {/* Quick Suggestions Chips matching Feddy reference pill (e.g. "Hi!") */}
          {!hasChatStarted && (
            <div className="overflow-hidden pb-1 -mb-1">
              <div
                className="flex items-center gap-1.5 overflow-x-auto pb-4 -mb-4 px-0.5 no-scrollbar select-none"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleSendMessage("Hi")}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-[#cde2d4] dark:border-emerald-950/80 text-xs font-semibold text-[#184433] dark:text-emerald-300 shadow-2xs hover:bg-[#def0e5] dark:hover:bg-[#1c3024] transition-colors cursor-pointer shrink-0"
                >
                  <span>👋</span>
                  <span>Hi!</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("I am not feeling well")}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-[#cde2d4] dark:border-emerald-950/80 text-xs font-medium text-zinc-700 dark:text-zinc-200 shadow-2xs hover:bg-[#def0e5] dark:hover:bg-[#1c3024] transition-colors cursor-pointer shrink-0"
                >
                  <span>🤒</span>
                  <span>I&apos;m not feeling well</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("I have a health question")}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-[#cde2d4] dark:border-emerald-950/80 text-xs font-medium text-zinc-700 dark:text-zinc-200 shadow-2xs hover:bg-[#def0e5] dark:hover:bg-[#1c3024] transition-colors cursor-pointer shrink-0"
                >
                  <span>💬</span>
                  <span>Ask Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-[#cde2d4] dark:border-emerald-950/80 text-xs font-medium text-zinc-700 dark:text-zinc-200 shadow-2xs hover:bg-[#def0e5] dark:hover:bg-[#1c3024] transition-colors cursor-pointer shrink-0"
                >
                  <span>📅</span>
                  <span>Book Video Visit</span>
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center rounded-full bg-white dark:bg-zinc-800 border border-[#cadfd2] dark:border-zinc-700 shadow-sm px-3.5 py-1.5 sm:py-2 gap-2.5 focus-within:border-[#184433] dark:focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-[#184433]/15 transition-all"
          >
           

            {/* Input Field */}
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Dr. Pratima's assistant..."
              disabled={aiLoading}
              autoComplete="off"
              className="flex-1 bg-transparent text-[16px] sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none"
              style={{ fontSize: "16px" }}
            />

            {/* Send or Stop Button */}
            {aiLoading ? (
              <button
                type="button"
                onClick={handleStopGeneration}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-900 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shrink-0 transition-transform cursor-pointer shadow-xs"
                aria-label="Stop generating"
                title="Stop generating"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#184433] hover:bg-[#123628] active:scale-95 text-white flex items-center justify-center shrink-0 transition-transform disabled:opacity-40 disabled:hover:bg-[#184433] cursor-pointer shadow-xs"
                aria-label="Send message"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-white rotate-0 -translate-y-[1px] translate-x-[1px]"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
