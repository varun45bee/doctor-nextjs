"use client";

import { Variants } from "framer-motion";

export const easeOutQuint = [0.22, 1, 0.36, 1] as const;
export const easeInOutSoft = [0.4, 0, 0.2, 1] as const;

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutQuint },
  },
  exit: {
    opacity: 0,
    y: 14,
    transition: { duration: 0.3, ease: easeInOutSoft },
  },
};

export const softRiseVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutQuint },
  },
};

export const softSlideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeOutQuint },
  },
};

export const softSlideRightVariants: Variants = {
  hidden: { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: easeOutQuint },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const gentleScaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 18,
      mass: 0.9,
    },
  },
};

export const flipRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    rotateY: 90,
    y: 18,
    transformPerspective: 1200,
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    y: 0,
    transformPerspective: 1200,
    transition: { duration: 0.8, ease: easeOutQuint },
  },
};

export const iconBounceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
      delay: 0.15,
    },
  },
};

export const quoteMarkVariants: Variants = {
  hidden: { opacity: 0, scale: 0.35, rotate: -18 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 240,
      damping: 16,
    },
  },
};

export const drawLineVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0.2 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.4, ease: easeOutQuint },
  },
};

export const splitTextContainerVariants = (stagger = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
    },
  },
});

export const splitWordVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutQuint },
  },
};

export const splitCharVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutQuint },
  },
};
