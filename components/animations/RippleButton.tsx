"use client";

import { MouseEvent, ReactNode, useState } from "react";

type Ripple = {
  id: number;
  x: number;
  y: number;
  size: number;
};

type RippleButtonProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

export default function RippleButton({
  children,
  className,
  href,
  target,
  rel,
  onClick,
  type = "button",
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const spawnRipple = (
    event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    const ripple = {
      id: Date.now(),
      x: event.clientX - rect.left - size / 2,
      y: event.clientY - rect.top - size / 2,
      size,
    };

    setRipples((current) => [...current, ripple]);

    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== ripple.id));
    }, 650);

    onClick?.();
  };

  const rippleContent = (
    <>
      <span className="ripple-button-label">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple-wave"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={spawnRipple}
        className={`ripple-button ${className ?? ""}`}
      >
        {rippleContent}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={spawnRipple}
      className={`ripple-button ${className ?? ""}`}
    >
      {rippleContent}
    </button>
  );
}
