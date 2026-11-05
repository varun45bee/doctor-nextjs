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

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = message.content;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Patient / User message bubble (Deep forest green matching reference screenshot)
  if (!isBot) {
    return (
      <div className="flex justify-end select-text animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="max-w-[85%] sm:max-w-[80%] rounded-2xl rounded-tr-xs px-4 py-2.5 bg-[#184433] text-white shadow-xs">
          <p className="text-xs sm:text-sm font-normal leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-100/75 select-none">
            <span>{timeDisplay}</span>
            <CheckCheck className="w-3.5 h-3.5 text-[#34d399] stroke-[2.5]" />
          </div>
        </div>
      </div>
    );
  }

  const hasGif = Boolean(message.gif);
  const isGifLoading = Boolean(message.isGifLoading && !hasGif);
  const isShortMessage =
    message.content.length <= 320 &&
    !message.content.includes("###") &&
    !message.content.includes("|") &&
    !message.content.includes("\n\n");
  const useSideLayout = (hasGif || isGifLoading) && isShortMessage;

  // Assistant message bubble (Clean white card with Dr. Pratima CuraAI circular avatar)
  return (
    <div className="flex gap-2.5 items-start justify-start select-text animate-in fade-in slide-in-from-bottom-2 duration-200 group">
      {/* CuraAI Avatar Badge (Transparent background - only picture of her) */}
      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 mt-0.5 border border-[#c6dfce]/60 dark:border-emerald-800 bg-transparent shadow-xs">
        <Image
          src="/cura-avatar.png"
          alt="CuraAI"
          fill
          className="object-cover object-top"
          sizes="32px"
        />
      </div>

      {/* Assistant Bubble Card: Side-by-side Feddy layout for short/greeting messages, or vertical for long clinical messages */}
      {useSideLayout ? (
        <div className="max-w-[94%] sm:max-w-[88%] rounded-2xl sm:rounded-3xl rounded-tl-xs bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#e4ede7] dark:border-zinc-700/60 overflow-hidden flex flex-row items-stretch">
          {/* Left Text Column */}
          <div className="flex-1 p-3.5 sm:p-4 flex flex-col justify-between min-w-0">
            <div className="text-xs sm:text-sm leading-relaxed text-[#1e2e25] dark:text-zinc-100 break-words pr-2">
              <MarkdownRenderer content={message.content} />
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center justify-between mt-2.5 pt-1 border-t border-zinc-100/80 dark:border-zinc-700/50 text-[10px] text-zinc-400 select-none">
              <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-emerald-50 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  title="Copy response"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 stroke-[2]" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>

              </div>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                {timeDisplay}
              </span>
            </div>
          </div>

          {/* Right Side GIF Column (Federal Bank Feddy Layout) */}
          <div className="w-28 sm:w-36 md:w-44 shrink-0 self-stretch relative bg-zinc-100 dark:bg-zinc-900 border-l border-zinc-100 dark:border-zinc-700/50">
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
        <div className="max-w-[88%] sm:max-w-[82%] rounded-2xl rounded-tl-xs p-3.5 sm:p-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#e4ede7] dark:border-zinc-700/60">
          {/* Assistant Response with Enterprise Markdown Rendering */}
          <div className="text-xs sm:text-sm leading-relaxed text-[#1e2e25] dark:text-zinc-100 break-words">
            <MarkdownRenderer content={message.content} />
          </div>

          {/* Loading placeholder when GIF is loading asynchronously */}
          {isGifLoading && (
            <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-700/50">
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
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-100/80 dark:border-zinc-700/50 text-[10px] text-zinc-400 select-none">
            <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyText}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-emerald-50 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
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
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium ml-auto">
                {timeDisplay}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
