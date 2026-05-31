"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const blobs = [
  { size: 220, left: "6%", top: "12%", delay: 0.1, duration: 8.8 },
  { size: 180, left: "18%", top: "70%", delay: 0.4, duration: 10.2 },
  { size: 140, left: "38%", top: "18%", delay: 1.2, duration: 7.6 },
  { size: 200, left: "56%", top: "74%", delay: 0.8, duration: 9.7 },
  { size: 160, left: "68%", top: "24%", delay: 1.8, duration: 8.3 },
  { size: 130, left: "80%", top: "58%", delay: 0.6, duration: 9.9 },
  { size: 170, left: "90%", top: "20%", delay: 1.1, duration: 7.4 },
  { size: 120, left: "48%", top: "56%", delay: 1.5, duration: 8.9 },
];

export default function FloatingBlobs() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const transforms = useMemo(
    () =>
      blobs.map((_, index) => ({
        x: (index % 2 === 0 ? 1 : -1) * (22 + index * 2),
        y: index % 3 === 0 ? -26 : 24 + index,
        rotate: index % 2 === 0 ? 8 : -10,
      })),
    []
  );

  useGSAP(
    () => {
      if (reduceMotion || !rootRef.current) {
        return;
      }

      const nodes = rootRef.current.querySelectorAll<HTMLElement>("[data-blob]");

      nodes.forEach((node, index) => {
        const transform = transforms[index];

        gsap.to(node, {
          x: transform.x,
          y: transform.y,
          rotate: transform.rotate,
          duration: blobs[index].duration,
          delay: blobs[index].delay,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: rootRef, dependencies: [reduceMotion, transforms] }
  );

  return (
    <div ref={rootRef} className="hero-floating-blobs" aria-hidden="true">
      {blobs.map((blob, index) => (
        <span
          key={`${blob.left}-${blob.top}`}
          data-blob
          className="hero-floating-blob"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.left,
            top: blob.top,
          }}
        />
      ))}
    </div>
  );
}
