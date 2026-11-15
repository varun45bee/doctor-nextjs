"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCheck, Copy, Check, RotateCcw } from "lucide-react";
import type { IGif } from "@giphy/js-types";
import GifReaction from "./GifReaction";
import GifLoading from "./GifLoading";
import MarkdownRenderer from "./MarkdownRenderer";

export type ChatMessageType = {
  id?: string;
  role: "assistant" | "user";
  content: string;
  gif?: IGif | null;
  isGifLoading?: boolean;
  timestamp?: string;
  isStreaming?: boolean;
};

interface ChatMessageProps {
  message: ChatMessageType;
  isLatestAssistant?: boolean;
  onRegenerate?: () => void;
  disabledActions?: boolean;
}

export default function ChatMessage({
  message,
  isLatestAssistant = false,
  onRegenerate,
  disabledActions = false,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isBot = message.role === "assistant";
  const timeDisplay =
    message.timestamp ||
    new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  // Defensive unwrap: if message content was accidentally raw JSON, extract the clean reply text
  let cleanContent = message.content || "";
  if (cleanContent.trim().startsWith("{") && cleanContent.includes('"reply"')) {
    try {
      const parsed = JSON.parse(cleanContent);
      if (parsed.reply) cleanContent = parsed.reply;
    } catch {
      const match = cleanContent.match(/"reply"\s*:\s*"((?:\\.|[^"\\])*)"/);
      if (match) cleanContent = match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
    }
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(cleanContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = cleanContent;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Patient / User message bubble (Frosted glass bubble)
  if (!isBot) {
    return (
      <div className="flex justify-end select-text animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-tr-xs px-4 py-2.5 bg-black/5 dark:bg-white/20 backdrop-blur-xl border border-black/10 dark:border-white/30 text-black dark:text-white shadow-xs">
          <p className="text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-black/60 dark:text-white/70 select-none">
            <span>{timeDisplay}</span>
            <CheckCheck className="w-3.5 h-3.5 text-black/70 dark:text-white/90 stroke-[2.5]" />
          </div>
        </div>
      </div>
    );
  }

  const hasGif = Boolean(message.gif);
  const isGifLoading = Boolean(message.isGifLoading && !hasGif);
  const isShortMessage =
    cleanContent.length <= 320 &&
    !cleanContent.includes("###") &&
    !cleanContent.includes("|") &&
    !cleanContent.includes("\n\n");
  const useSideLayout = (hasGif || isGifLoading) && isShortMessage;

  // Assistant message bubble (Frosted translucent glass card)
  return (
    <div className="flex gap-2.5 items-start justify-start select-text animate-in fade-in slide-in-from-bottom-2 duration-200 group">
      {/* Nirvana Avatar Character (transparent cutout, no circular background or border) */}
      <div className="relative w-8 h-9 shrink-0 mt-0.5 select-none pointer-events-none drop-shadow-xs">
        <Image
          src="/cura-avatar.png"
          alt="Nirvana"
          fill
          className="object-contain object-bottom"
          sizes="36px"
        />
      </div>

      {/* Assistant Bubble Card: Side-by-side Feddy layout for short/greeting messages, or vertical for long clinical messages */}
      {useSideLayout ? (
        <div className="max-w-[94%] sm:max-w-[88%] rounded-2xl sm:rounded-3xl rounded-tl-xs bg-black/[0.03] dark:bg-white/15 backdrop-blur-xl text-black dark:text-white shadow-xs border border-black/10 dark:border-white/25 overflow-hidden flex flex-row items-stretch transition-all duration-300 ease-out">
          {/* Left Text Column */}
          <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed text-black dark:text-white break-words pr-2">
              <MarkdownRenderer content={cleanContent} />
              {message.isStreaming && (
                <span
                  className="inline-block w-1.5 h-3.5 ml-1 bg-emerald-500 rounded-xs animate-pulse align-middle"
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Action Toolbar */}
            {!message.isStreaming && (
              <div className="flex items-center justify-between mt-2.5 pt-1 border-t border-black/10 dark:border-white/15 text-[10px] text-black/60 dark:text-white/60 select-none animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/15 text-black/70 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                    title="Copy response"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-300 stroke-[2.5]" />
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 stroke-[2]" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <span className="text-[10px] text-black/60 dark:text-white/60 font-medium">
                  {timeDisplay}
                </span>
              </div>
            )}
          </div>

          {/* Right Side GIF Column (Federal Bank Feddy Layout) */}
          <div className="w-28 sm:w-36 md:w-44 shrink-0 self-stretch relative bg-black/5 dark:bg-white/10 border-l border-black/10 dark:border-white/15">
            {hasGif ? (
              <GifReaction
                gif={message.gif!}
                variant="side"
                timestamp={timeDisplay}
              />
            ) : (
              <div className="w-full h-full min-h-[100px] flex items-center justify-center p-2">
                <GifLoading />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-[88%] sm:max-w-[82%] rounded-2xl rounded-tl-xs p-3.5 sm:p-4 bg-black/[0.03] dark:bg-white/15 backdrop-blur-xl text-black dark:text-white shadow-xs border border-black/10 dark:border-white/25 transition-all duration-300 ease-out">
          {/* Assistant Response with Enterprise Markdown Rendering */}
          <div className="text-xs sm:text-sm leading-relaxed text-black dark:text-white break-words">
            <MarkdownRenderer content={cleanContent} />
            {message.isStreaming && (
              <span
                className="inline-block w-1.5 h-3.5 ml-1 bg-emerald-500 rounded-xs animate-pulse align-middle"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Loading placeholder when GIF is loading asynchronously */}
          {isGifLoading && (
            <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/15">
              <div className="max-w-[240px] rounded-xl overflow-hidden">
                <GifLoading />
              </div>
            </div>
          )}

          {/* Reaction GIF embedded directly below assistant's text */}
          {hasGif && (
            <GifReaction
              gif={message.gif!}
              variant="below"
              timestamp={timeDisplay}
            />
          )}

          {/* Action Toolbar: Copy Response, Regenerate & Timestamp */}
          {!message.isStreaming && (
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/10 dark:border-white/15 text-[10px] text-black/60 dark:text-white/60 select-none animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-black/5 dark:hover:bg-white/15 text-black/70 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                  title="Copy response"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-300 stroke-[2.5]" />
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-medium">
                        Copied
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 stroke-[2]" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Timestamp */}
              {!hasGif && (
                <span className="text-[10px] text-black/50 dark:text-white/50 font-medium ml-auto">
                  {timeDisplay}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
