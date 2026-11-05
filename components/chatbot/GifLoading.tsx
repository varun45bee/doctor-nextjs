"use client";

export default function GifLoading({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full h-full min-h-[96px] bg-zinc-200/70 dark:bg-zinc-800/70 animate-pulse flex flex-col items-center justify-center p-2 text-center select-none ${className}`}
      aria-label="Loading GIF"
    >
      <div className="w-5 h-5 border-2 border-sage-500/40 border-t-sage-600 rounded-full animate-spin mb-1.5" />
      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">
        Loading reaction...
      </span>
    </div>
  );
}

