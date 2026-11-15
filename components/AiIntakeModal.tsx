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
import { useAuth } from "@/lib/auth-context";
import {
  detectContextualReaction,
  fetchReactionGif,
  resolveReactionCategory,
  isProfanity,
  isEmergencySituation,
  isSensitiveMedicalSituation,
} from "@/lib/giphy/reactionDetector";
import { PREDEFINED_CATEGORY_QUERIES } from "@/lib/giphy/categoryPools";
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

const createWelcomeMessage = (): ChatMessageType => ({
  id: "welcome-nirvana",
  role: "assistant",
  content:
    "Hi! I'm Nirvana 💜 Your personal health companion. How can I help you feel better today?",
  timestamp: formatCurrentTime(),
});

export default function AiIntakeModal({ isOpen, onClose }: AiIntakeModalProps) {
  const { openAppointment } = useAppointment();
  const { user } = useAuth();
  const [conversationId] = useState(() => `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);

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
  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    // Only smooth-scroll when not actively streaming typewriter frames
    if (!chatMessages.some((m) => m.isStreaming)) {
      scrollToBottom(true);
    }
  }, [chatMessages, aiLoading]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }
    setChatMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
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

  // Helper to extract clean reply text from raw token stream or JSON
  const extractCleanReply = (raw: string): string => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (trimmed.startsWith("{")) {
      try {
        const p = JSON.parse(trimmed);
        if (typeof p.reply === "string") return p.reply;
      } catch {
        const m = raw.match(/"reply"\s*:\s*"((?:\\.|[^"\\])*)"?/);
        if (m) {
          return m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
        }
        return "";
      }
    }
    return raw;
  };

  const createSmoothTypewriter = (
    botMessageId: string,
    initialGifLoading: boolean
  ) => {
    let targetText = "";
    let displayedText = "";
    let streamDone = false;
    let messageInserted = false;

    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }

    const appendChunk = (chunk: string) => {
      targetText += chunk;
    };

    const setFullText = (text: string) => {
      targetText = text;
    };

    const finishStream = () => {
      streamDone = true;
    };

    const promise = new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        const cleanTarget = extractCleanReply(targetText);

        if (!messageInserted && cleanTarget.length > 0) {
          messageInserted = true;
          setChatMessages((prev) => [
            ...prev,
            {
              id: botMessageId,
              role: "assistant",
              content: "",
              isGifLoading: initialGifLoading,
              gif: null,
              timestamp: formatCurrentTime(),
              isStreaming: true,
            },
          ]);
        }

        if (displayedText.length < cleanTarget.length) {
          const diff = cleanTarget.length - displayedText.length;
          let step = 1;
          if (diff > 160) {
            step = Math.ceil(diff / 15);
          } else if (diff > 80) {
            step = 5;
          } else if (diff > 40) {
            step = 3;
          } else if (diff > 15) {
            step = 2;
          } else {
            step = 1;
          }

          displayedText = cleanTarget.slice(0, displayedText.length + step);

          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId
                ? { ...m, content: displayedText, isStreaming: true }
                : m
            )
          );

          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
        } else if (streamDone && (displayedText.length >= cleanTarget.length || cleanTarget.length === 0)) {
          clearInterval(timer);
          typewriterTimerRef.current = null;

          if (!messageInserted) {
            setChatMessages((prev) => [
              ...prev,
              {
                id: botMessageId,
                role: "assistant",
                content: cleanTarget || "I am here to assist you with your health concerns.",
                isGifLoading: initialGifLoading,
                gif: null,
                timestamp: formatCurrentTime(),
                isStreaming: false,
              },
            ]);
          } else {
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === botMessageId
                  ? { ...m, content: cleanTarget, isStreaming: false }
                  : m
              )
            );
          }

          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          }
          resolve();
        }
      }, 18);

      typewriterTimerRef.current = timer;
    });

    return { appendChunk, setFullText, finishStream, promise };
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

    // Contextual reaction pre-detection (synchronous, instant)
    // FIRST-MESSAGE-ONLY GIF RULE:
    // Only the very first user message of the conversation can show a GIF.
    // If the user has already sent a message or a GIF was already displayed, suppress all GIFs.
    const priorUserMessagesCount = chatMessages.filter((m) => m.role === "user").length;
    const hasAlreadyShownGif = chatMessages.some((m) => Boolean(m.gif));
    const isFirstTurn = priorUserMessagesCount === 0 && !hasAlreadyShownGif;

    const isPro = isProfanity(textToSend);
    const isEm = isEmergencySituation(textToSend);
    const isSens = isSensitiveMedicalSituation(textToSend);
    const isSuppressed = isPro || isEm || isSens || !isFirstTurn;
    const detected = !isSuppressed && isFirstTurn
      ? detectContextualReaction(textToSend, {
          history: chatMessages.map((m) => ({ role: m.role, content: m.content })),
        })
      : null;
    const detectedCategory = detected
      ? resolveReactionCategory(detected.subType || detected.query || detected.categoryId)
      : null;
    const initialResolvedCategory = !isSuppressed && isFirstTurn && detectedCategory ? detectedCategory : null;
    const initialGifCategory = initialResolvedCategory || "";
    const initialGifQuery = initialResolvedCategory
      ? PREDEFINED_CATEGORY_QUERIES[initialResolvedCategory]
      : "";
    const initialGifLoading = Boolean(isFirstTurn && initialResolvedCategory);

    const newMessages: ChatMessageType[] = [
      ...chatMessages,
      { id: userMessageId, role: "user", content: textToSend, timestamp: currentTime },
    ];
    setChatMessages(newMessages);
    setChatInput("");
    setAiLoading(true);

    // Concurrently fetch reaction GIF in background so it loads seamlessly with zero layout jump
    const currentRecentGifIds = chatMessages
      .map((m) => m.gif?.id)
      .filter(Boolean)
      .map(String);

    let earlyGifPromise: Promise<any> | null = null;
    if (initialGifLoading && initialResolvedCategory && isFirstTurn) {
      earlyGifPromise = fetchReactionGif(initialResolvedCategory, {
        conversationId,
        recentGifIds: currentRecentGifIds,
      }).catch(() => null);
    }

    try {
      // 1. Attempt Real-Time Token Streaming via /api/consult-ai/stream
      const streamRes = await fetch("/api/consult-ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: newMessages,
          context: conversationContext,
          userId: user?.uid,
          conversationId,
        }),
        signal: controller.signal,
      });

      if (streamRes.ok && streamRes.body) {
        const reader = streamRes.body.getReader();
        const decoder = new TextDecoder();
        let finalMetadata: any = null;

        const typewriter = createSmoothTypewriter(botMessageId, initialGifLoading);

        let streamDone = false;
        let sseBuffer = "";

        while (!streamDone) {
          const { value, done: readerDone } = await reader.read();
          if (readerDone) {
            streamDone = true;
            break;
          }

          sseBuffer += decoder.decode(value, { stream: true });
          const events = sseBuffer.split("\n\n");
          sseBuffer = events.pop() || "";

          for (const event of events) {
            const trimmed = event.trim();
            if (!trimmed.startsWith("data: ")) continue;

            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.token) {
                typewriter.appendChunk(data.token);
              }
              if (data.done) {
                finalMetadata = data;
              }
            } catch {
              // Frame parse ignore
            }
          }
        }

        typewriter.finishStream();
        await typewriter.promise;

        // Apply metadata updates from the stream completion
        if (finalMetadata) {
          if (finalMetadata.context_update) {
            setConversationContext((prev) => ({
              ...prev,
              ...finalMetadata.context_update,
              turnCount: prev.turnCount + 1,
            }));
          }

          if (finalMetadata.analysis) {
            setAnalysis(finalMetadata.analysis);
          }

          const serverCategory = finalMetadata.gif?.category || finalMetadata.gif?.search_query;
          const resolvedCategory = resolveReactionCategory(serverCategory || initialGifCategory) || initialResolvedCategory;

          if (finalMetadata.gif?.should_show === false || !resolvedCategory || isSuppressed) {
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === botMessageId
                  ? { ...m, isGifLoading: false, gif: null }
                  : m
              )
            );
          } else {
            const reactionGif = (earlyGifPromise && resolvedCategory === initialResolvedCategory)
              ? await earlyGifPromise
              : await fetchReactionGif(resolvedCategory, {
                  conversationId,
                  recentGifIds: currentRecentGifIds,
                  query: finalMetadata.gif?.search_query,
                }).catch(() => null);

            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === botMessageId
                  ? { ...m, gif: reactionGif, isGifLoading: false }
                  : m
              )
            );
          }
        }
      } else {
        // Fallback to non-streaming /api/consult-ai
        const res = await fetch("/api/consult-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: textToSend,
            history: newMessages,
            context: conversationContext,
            userId: user?.uid,
            conversationId,
          }),
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          const resolvedFallbackCategory = resolveReactionCategory(
            data.gif?.category || data.gif?.search_query || initialGifCategory
          ) || initialResolvedCategory;
          const shouldShowGif = Boolean(data.gif?.should_show !== false && resolvedFallbackCategory && !isSuppressed);

          // Typewriter pacing ensures even non-streaming response streams smoothly
          const typewriter = createSmoothTypewriter(botMessageId, shouldShowGif);
          typewriter.setFullText(data.reply || "I am here to guide your care. How can I help you today?");
          typewriter.finishStream();

          if (data.context_update) {
            setConversationContext((prev) => ({
              ...prev,
              ...data.context_update,
              turnCount: prev.turnCount + 1,
            }));
          }

          if (data.analysis) {
            setAnalysis(data.analysis);
          }

          if (shouldShowGif && resolvedFallbackCategory) {
            const reactionGif = earlyGifPromise
              ? await earlyGifPromise
              : await fetchReactionGif(resolvedFallbackCategory, {
                  conversationId,
                  recentGifIds: currentRecentGifIds,
                }).catch(() => null);

            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === botMessageId
                  ? { ...m, gif: reactionGif, isGifLoading: false }
                  : m
              )
            );
          } else {
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === botMessageId
                  ? { ...m, isGifLoading: false, gif: null }
                  : m
              )
            );
          }

          await typewriter.promise;
        } else {
          throw new Error("Server returned non-ok");
        }
      }
    } catch (e: any) {
      if (e?.name === "AbortError") {
        return;
      }
      console.warn("AI Intake network exception, activating clinical fallback engine:", e);
      const fallback = generateEnterpriseConversationResponse(
        textToSend,
        newMessages.map((m) => ({ role: m.role, content: m.content })),
        conversationContext
      );
      const resolvedOfflineCategory = resolveReactionCategory(
        fallback.gif?.category || fallback.gif?.search_query || initialGifCategory
      ) || initialResolvedCategory;
      const shouldShowGif = Boolean(fallback.gif?.should_show !== false && resolvedOfflineCategory && !isSuppressed);

      const typewriter = createSmoothTypewriter(botMessageId, shouldShowGif);
      typewriter.setFullText(fallback.reply);
      typewriter.finishStream();

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

      if (shouldShowGif && resolvedOfflineCategory) {
        const reactionGif = earlyGifPromise
          ? await earlyGifPromise
          : await fetchReactionGif(resolvedOfflineCategory, {
              conversationId,
              recentGifIds: currentRecentGifIds,
            }).catch(() => null);

        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId
              ? { ...m, gif: reactionGif, isGifLoading: false }
              : m
          )
        );
      } else {
        setChatMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId
              ? { ...m, isGifLoading: false, gif: null }
              : m
          )
        );
      }

      await typewriter.promise;
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
      {/* Backdrop to intercept outside clicks and prevent page scroll without adding gray overlay */}
      <div
        ref={backdropRef}
        data-lenis-prevent
        className="fixed inset-0 z-[99999] bg-transparent transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Chatbox UI with Pure Transparent Frosted Glass */}
      <div
        ref={modalContainerRef}
        data-lenis-prevent
        className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[100000] w-full sm:w-[420px] md:w-[440px] sm:max-w-[calc(100vw-24px)] h-[90dvh] sm:h-[690px] max-h-[92dvh] sm:max-h-[calc(100vh-48px)] rounded-t-[36px] sm:rounded-[36px] bg-transparent backdrop-blur-2xl backdrop-saturate-150 border border-black/15 dark:border-white/30 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(255,255,255,0.1)] overscroll-contain"
        role="dialog"
        aria-modal="true"
        aria-label="Nirvana Health Assistant"
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

        {/* Clean Specular Edge Rim Highlights for iPhone Liquid Glass */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-black/20 dark:via-white/50 to-transparent" />
          <div className="absolute bottom-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-black/10 dark:via-white/20 to-transparent" />
        </div>

        {/* Top Header: Doctor Branding & Circular Glass Action Controls */}
        <div
          onTouchMove={(e) => e.stopPropagation()}
          className="relative z-20 flex items-center justify-between px-5 pt-4 pb-2.5 shrink-0 select-none touch-none"
        >
          <div className="flex items-center gap-2 select-none">
            <span className="font-serif font-bold text-[17px] sm:text-lg tracking-wide text-black dark:text-white border-b-2 border-emerald-500 pb-0.5">
              Dr. Pratima Agale
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetChat}
              className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 border border-black/10 dark:border-white/20 backdrop-blur-md flex items-center justify-center text-black dark:text-white hover:opacity-80 transition-all cursor-pointer shadow-xs"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 border border-black/10 dark:border-white/20 backdrop-blur-md flex items-center justify-center text-black dark:text-white hover:opacity-80 transition-all cursor-pointer shadow-xs"
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
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-zinc-700 transition cursor-pointer text-left"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-indigo-950 dark:text-indigo-300">
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

        {/* Row 2: Chatbot Preview Hero Card (Smoothly slides UP and collapses once chat starts) */}
        <div
          className={`transition-all duration-400 ease-in-out overflow-hidden px-4 ${
            hasChatStarted
              ? "max-h-0 opacity-0 -translate-y-4 pointer-events-none pb-0"
              : "max-h-[240px] opacity-100 translate-y-0 pb-3"
          }`}
        >
          <div className="relative rounded-3xl bg-black/[0.03] dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-xl p-4 sm:p-5 flex items-center justify-between shadow-xs overflow-hidden">
            {/* Left Column: Assistant Title & Companion Subtitle */}
            <div className="flex flex-col gap-1 pr-2 relative z-10">
              <h2 className="text-base sm:text-lg font-bold text-black dark:text-white leading-snug">
                I&apos;m Nirvana, Dr. Pratima&apos;s
              </h2>
              <p className="text-xs sm:text-sm font-normal text-black/80 dark:text-white/90 leading-snug">
                personal digital assistant.
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium tracking-wide">
                  Your Personal Health Companion
                </span>
              </div>
            </div>

            {/* Right Column: Avatar Doctor Character Waving */}
            <div className="relative shrink-0 flex items-end justify-center">
              <div className="relative w-28 h-32 sm:w-32 sm:h-36 pointer-events-none drop-shadow-md">
                <Image
                  src="/cura-avatar.png"
                  alt="Nirvana - Personal Digital Assistant"
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 640px) 112px, 128px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Quick Action Navigation Capsule - Smoothly hides once chat starts */}
        <div
          onTouchMove={(e) => e.stopPropagation()}
          className={`transition-all duration-300 ease-in-out shrink-0 overflow-hidden px-4 ${
            hasChatStarted
              ? "max-h-0 opacity-0 pointer-events-none py-0 -translate-y-2"
              : "max-h-24 opacity-100 pb-3 translate-y-0"
          }`}
        >
          <div className="rounded-full bg-black/[0.03] dark:bg-white/10 border border-black/10 dark:border-white/20 backdrop-blur-xl p-1 sm:p-1.5 flex items-stretch divide-x divide-black/10 dark:divide-white/20 shadow-xs">
            {/* Tab 1: Health Queries */}
            <button
              type="button"
              onClick={() =>
                handleQuickAction(
                  "I have a health query about my symptoms. Can you help me understand them?"
                )
              }
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 text-center hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 rounded-full transition-all cursor-pointer group"
            >
              <Stethoscope className="w-5 h-5 text-black dark:text-white group-hover:scale-110 transition-transform stroke-[2]" />
              <span className="text-[11px] sm:text-xs font-medium text-black dark:text-white mt-1 line-clamp-1 leading-tight">
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
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 text-center hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 rounded-full transition-all cursor-pointer group"
            >
              <Leaf className="w-5 h-5 text-black dark:text-white group-hover:scale-110 transition-transform stroke-[2]" />
              <span className="text-[11px] sm:text-xs font-medium text-black dark:text-white mt-1 line-clamp-1 leading-tight">
                Homeopathy...
              </span>
            </button>

            {/* Tab 3: Book Appointment */}
            <button
              type="button"
              onClick={handleBookNow}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 text-center hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 rounded-full transition-all cursor-pointer group"
            >
              <Calendar className="w-5 h-5 text-black dark:text-white group-hover:scale-110 transition-transform stroke-[2]" />
              <span className="text-[11px] sm:text-xs font-medium text-black dark:text-white mt-1 line-clamp-1 leading-tight">
                Book Appointment
              </span>
            </button>
          </div>
        </div>

        {/* Middle Conversation Thread */}
        <div
          ref={chatContainerRef}
          data-lenis-prevent
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain chat-scroll-area p-3.5 sm:p-4 space-y-3 bg-transparent touch-pan-y"
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
            <span className="px-4 py-0.5 rounded-full bg-black/5 dark:bg-white/15 border border-black/10 dark:border-white/20 backdrop-blur-md text-black/75 dark:text-white/85 text-[11px] font-medium shadow-2xs select-none">
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
              {!chatMessages.some((m) => m.role === "assistant" && m.isStreaming) ? (
                <div className="flex items-center gap-2 text-xs text-black/80 dark:text-white/90 italic bg-black/5 dark:bg-white/15 backdrop-blur-md border border-black/10 dark:border-white/20 py-1.5 px-3 rounded-full shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="font-medium text-black dark:text-white">
                    Nirvana is thinking...
                  </span>
                </div>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={handleStopGeneration}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/5 dark:bg-white/15 hover:bg-black/10 dark:hover:bg-white/25 text-black/80 dark:text-white/90 border border-black/10 dark:border-white/20 transition-all cursor-pointer shadow-xs ml-auto"
                title="Stop generation"
              >
                <span className="w-2 h-2 rounded-[2px] bg-rose-500" />
                <span>Stop</span>
              </button>
            </div>
          )}

          {/* Consultation Ready CTA Card */}
          {analysis.readyToBook && (
            <div className="p-3.5 rounded-3xl bg-black/5 dark:bg-white/15 backdrop-blur-xl shadow-lg border border-emerald-500/30 text-center space-y-2 mt-2">
              <p className="text-xs font-semibold text-black dark:text-white">
                Symptom summary prepared for Dr. Pratima Agale.
              </p>
              <button
                type="button"
                onClick={handleBookNow}
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white dark:text-[#0d3326] font-semibold text-xs shadow-md transition-all cursor-pointer"
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
          className="p-3.5 bg-transparent shrink-0 sticky bottom-0 pb-[max(14px,env(safe-area-inset-bottom))] touch-none"
        >
          {/* Quick Suggestions Chips matching Reference Image */}
          {!hasChatStarted && (
            <div className="overflow-hidden mb-2.5">
              <div
                className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 no-scrollbar select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:!hidden [&::-webkit-scrollbar]:!w-0 [&::-webkit-scrollbar]:!h-0 [&::-webkit-scrollbar-track]:!bg-transparent [&::-webkit-scrollbar-thumb]:!bg-transparent"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleSendMessage("Hi")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 backdrop-blur-md text-xs font-medium text-black dark:text-white shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <span>👋</span>
                  <span>Hi!</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("I am not feeling well")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 backdrop-blur-md text-xs font-medium text-black dark:text-white shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <span>🤒</span>
                  <span>I&apos;m not feeling well</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage("I have a health question")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 backdrop-blur-md text-xs font-medium text-black dark:text-white shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <span>💬</span>
                  <span>Ask Doctor</span>
                </button>
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-black/10 dark:border-white/20 backdrop-blur-md text-xs font-medium text-black dark:text-white shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <span>📅</span>
                  <span>Book Video</span>
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center rounded-full bg-black/[0.04] dark:bg-white/10 border border-black/10 dark:border-white/25 backdrop-blur-xl shadow-xs px-4 py-1.5 sm:py-2 gap-2.5 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/25 transition-all"
          >
            {/* Input Field */}
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Dr. Pratima's assistant..."
              disabled={aiLoading}
              autoComplete="off"
              className="flex-1 bg-transparent text-[16px] sm:text-sm text-black dark:text-white placeholder:text-black/60 dark:placeholder:text-white/60 placeholder-black/60 dark:placeholder-white/60 focus:outline-none caret-black dark:caret-white"
              style={{ fontSize: "16px" }}
            />

            {/* Send or Stop Button */}
            {aiLoading ? (
              <button
                type="button"
                onClick={handleStopGeneration}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shrink-0 transition-transform cursor-pointer shadow-md"
                aria-label="Stop generating"
                title="Stop generating"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#34d399] hover:bg-[#2ed093] active:scale-95 text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:hover:bg-[#34d399] cursor-pointer shadow-[0_0_18px_rgba(52,211,153,0.55)]"
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
