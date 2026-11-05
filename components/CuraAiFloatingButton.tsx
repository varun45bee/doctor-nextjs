"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAppointment } from "@/lib/appointment-context";

export default function CuraAiFloatingButton() {
  const [mounted, setMounted] = useState(false);
  const { openAiIntake, isAiIntakeOpen } = useAppointment();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isAiIntakeOpen) return null;

  return (
    <div className="cura-floating-container">
      <button
        type="button"
        onClick={() => openAiIntake()}
        className="cura-char-btn group"
        aria-label="Say Hi to CuraAI"
      >
        {/* Tooltip on hover */}
        <span className="cura-speech-bubble">
          Say Hi to CuraAI 👋
        </span>

        {/* CuraAI Avatar Character */}
        <div className="relative w-11 h-11 rounded-full overflow-hidden">
          <Image
            src="/cura-avatar.png"
            alt="CuraAI"
            fill
            className="object-cover object-top"
            sizes="44px"
            priority
          />
        </div>
      </button>
    </div>
  );
}
