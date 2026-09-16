import { useReducedMotion } from "framer-motion";

/**
 * Motion presets: use these across the app to keep motion consistent.
 * Rule: do not hardcode durations/easing elsewhere.
 */
export type MotionPreset = {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
};

export function useMotionPresets() {
  const prefersReduced = useReducedMotion();

  const durations = {
    fast: 0.12,
    base: 0.18,
    slow: 0.26,
  };

  const easing = {
    standard: [0.2, 0.0, 0.0, 1.0],
    emphasized: [0.2, 0.8, 0.2, 1.0],
  };

  const safe = (preset: MotionPreset): MotionPreset => {
    if (!prefersReduced) return preset;
    // Reduced motion: remove movement, keep opacity for clarity.
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: durations.fast },
    };
  };

  return {
    fadeIn: safe({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: durations.base, ease: easing.standard },
    }),

    slideUp: safe({
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 6 },
      transition: { duration: durations.base, ease: easing.standard },
    }),

    modalScale: safe({
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.98 },
      transition: { duration: durations.base, ease: easing.emphasized },
    }),

    stagger: {
      container: safe({
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { staggerChildren: 0.06, delayChildren: 0.02 },
      }),
      item: safe({
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: durations.base, ease: easing.standard },
      }),
    },

    meta: { prefersReduced, durations, easing },
  };
}
