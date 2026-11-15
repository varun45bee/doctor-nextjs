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
        aria-label="Say Hi to Nirvana"
      >
        {/* Tooltip on hover */}
        <span className="cura-speech-bubble">
          Say Hi to Nirvana 💜
        </span>

        {/* Nirvana Avatar Character (transparent cutout, no circular background) */}
        <div className="cura-char-avatar relative w-[58px] h-[70px] select-none pointer-events-none">
          <Image
            src="/cura-avatar.png"
            alt="Nirvana AI Assistant"
            fill
            className="object-contain object-bottom"
            sizes="60px"
            priority
          />
        </div>
      </button>
    </div>
  );
}
