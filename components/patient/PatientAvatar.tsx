"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface PatientAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showRing?: boolean;
}

const SIZE_MAP = {
  xs: { px: 28, text: "text-[11px]", class: "w-7 h-7" },
  sm: { px: 34, text: "text-xs", class: "w-8 h-8 sm:w-9 sm:h-9" },
  md: { px: 44, text: "text-sm", class: "w-11 h-11" },
  lg: { px: 64, text: "text-base font-bold", class: "w-16 h-16" },
  xl: { px: 96, text: "text-xl font-bold", class: "w-24 h-24" },
  "2xl": { px: 128, text: "text-2xl font-bold", class: "w-32 h-32" },
};

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "P";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PatientAvatar({
  src,
  name,
  size = "md",
  className = "",
  showRing = true,
}: PatientAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const initials = getInitials(name);

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const ringStyle = showRing
    ? "border-2 border-sage-300 dark:border-sage-700 shadow-sm"
    : "";

  if (src && !imageError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 bg-sage-50 dark:bg-zinc-800 ${sizeConfig.class} ${ringStyle} ${className}`}
      >
        <Image
          src={src}
          alt={name || "Patient Profile"}
          fill
          unoptimized
          referrerPolicy="no-referrer"
          className="object-cover"
          onError={() => {
            setImageError(true);
          }}
        />
      </div>
    );
  }

  // Graceful fallback to Initials with medical sage gradient
  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center font-semibold text-white select-none bg-gradient-to-br from-sage-600 to-emerald-700 shadow-inner ${sizeConfig.class} ${sizeConfig.text} ${ringStyle} ${className}`}
      title={name || "Patient"}
      aria-label={name || "Patient"}
    >
      {initials}
    </div>
  );
}

