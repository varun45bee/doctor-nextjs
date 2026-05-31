"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, useRef, useState } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  magneticStrength?: number;
  href: string;
  target?: string;
  rel?: string;
};

export default function MagneticButton({
  children,
  className,
  magneticStrength = 0.18,
  ...props
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    setOffset({
      x: x * magneticStrength,
      y: y * magneticStrength,
    });
  };

  return (
    <motion.a
      {...props}
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={reduceMotion ? undefined : offset}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.35 }}
    >
      {children}
    </motion.a>
  );
}
