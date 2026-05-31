"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 400 : 140,
    damping: reduceMotion ? 45 : 28,
    mass: 0.25,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress-bar"
      style={{ scaleX, transformOrigin: "0% 50%" }}
    />
  );
}
