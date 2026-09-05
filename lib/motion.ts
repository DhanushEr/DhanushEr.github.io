import type { Variants } from 'framer-motion';

/**
 * Shared motion variants.
 *
 * Content-bearing reveals never animate opacity from 0: if the IntersectionObserver
 * never fires — no-JS, a crawler, a link-preview screenshot — the text must still be
 * fully readable. The reveal is therefore a transform-only rise. Opacity fades are
 * reserved for decorative elements via `fadeIn`.
 */

export const riseIn: Variants = {
  hidden: { opacity: 1, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Decorative-only: safe to fade from invisible because nothing is lost if it never runs. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const staggerChildren: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Standard viewport config: animate once, trigger comfortably before centre. */
export const inView = { once: true, margin: '-12% 0px -12% 0px' } as const;
