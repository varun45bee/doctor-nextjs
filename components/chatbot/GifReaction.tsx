"use client";

import { useState } from "react";
import type { IGif } from "@giphy/js-types";
import { Gif } from "@giphy/react-components";
import GifLoading from "./GifLoading";

interface GifReactionProps {
  gif: IGif;
  variant?: "below" | "side";
  width?: number;
  timestamp?: string;
}

export default function GifReaction({
  gif,
  variant = "below",
  width = 240,
  timestamp,
}: GifReactionProps) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError || !gif) return null;

  const gifUrl =
    gif.images?.fixed_width?.url ||
    gif.images?.downsized?.url ||
    gif.images?.original?.url;

  if (variant === "side") {
    return (
      <div className="relative w-full h-full min-h-[100px] self-stretch shrink-0 bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center select-none">
        {!loaded && (
          <div className="absolute inset-0 z-10">
            <GifLoading />
          </div>
        )}
        <div
          className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {gifUrl ? (
            <img
              src={gifUrl}
              alt={gif.title || "Reaction GIF"}
              className="w-full h-full object-cover min-h-[100px]"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setHasError(true)}
            />
          ) : (
            <Gif
              gif={gif}
              width={140}
              noLink
              hideAttribution
              onGifVisible={() => setLoaded(true)}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    );
  }

  // Variant "below" (displayed below the assistant text inside the card)
  return (
    <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/10 select-none">
      <div className="relative overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 max-w-[240px] sm:max-w-[280px] shadow-xs">
        {!loaded && (
          <div className="w-full h-36 bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse rounded-2xl flex items-center justify-center">
            <GifLoading />
          </div>
        )}
        <div
          className={`transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0 absolute inset-0"
          }`}
        >
          {gifUrl ? (
            <img
              src={gifUrl}
              alt={gif.title || "Reaction GIF"}
              className="rounded-2xl w-full h-auto max-h-[180px] sm:max-h-[220px] object-cover"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setHasError(true)}
            />
          ) : (
            <Gif
              gif={gif}
              width={width}
              noLink
              hideAttribution
              borderRadius={16}
              onGifVisible={() => setLoaded(true)}
              className="rounded-2xl overflow-hidden w-full h-auto object-cover"
            />
          )}
        </div>
      </div>

      {/* Message Timestamp */}
      {timestamp && (
        <div className="flex items-center justify-end mt-1.5 px-0.5">
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium select-none">
            {timestamp}
          </span>
        </div>
      )}
    </div>
  );
}
