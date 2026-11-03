"use client";

import Image from "next/image";
import { useAppointment } from "@/lib/appointment-context";

export default function CuraAiFloatingButton() {
  const { openAiIntake, isAiIntakeOpen } = useAppointment();

  if (isAiIntakeOpen) return null;

  return (
    <>
      <style>{`
        @keyframes cura-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes cura-wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          20%, 60% {
            transform: rotate(-20deg) scale(1.1);
          }
          40%, 80% {
            transform: rotate(14deg) scale(1.1);
          }
        }
        @keyframes cura-pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(77, 124, 99, 0.45);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(77, 124, 99, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(77, 124, 99, 0);
          }
        }

        .cura-floating-container {
          position: fixed;
          bottom: 88px;
          right: 20px;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cura-char-btn {
          position: relative;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #ffffff;
          border: 2.5px solid #3f6b56;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
          cursor: pointer;
          animation: cura-float 3.5s ease-in-out infinite, cura-pulse 2.8s infinite;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          padding: 0;
          outline: none;
        }

        .cura-char-btn:hover {
          transform: scale(1.12) translateY(-2px);
          animation: none;
          box-shadow: 0 8px 24px rgba(47, 74, 61, 0.35);
        }

        /* Waving hand indicator */
        .cura-waving-hand {
          position: absolute;
          top: -4px;
          right: -4px;
          font-size: 16px;
          line-height: 1;
          background: #ffffff;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
          border: 1.5px solid #3f6b56;
          animation: cura-wave 2s ease-in-out infinite;
          transform-origin: 70% 70%;
          pointer-events: none;
        }

        /* Hover Tooltip: "Say Hi to CuraAI" */
        .cura-speech-bubble {
          position: absolute;
          right: 68px;
          white-space: nowrap;
          background: #243c30;
          color: #ffffff;
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.2px;
          padding: 7px 14px;
          border-radius: 9999px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          opacity: 0;
          visibility: hidden;
          transform: translateX(6px);
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cura-speech-bubble::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -6px;
          transform: translateY(-50%);
          border-width: 6px 0 6px 7px;
          border-style: solid;
          border-color: transparent transparent transparent #243c30;
        }

        .cura-char-btn:hover .cura-speech-bubble {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
      `}</style>

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
    </>
  );
}
