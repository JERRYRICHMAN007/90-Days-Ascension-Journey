/** Shared framer-motion presets for Forge184 */

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

export const springTransition = { type: 'spring', stiffness: 260, damping: 24 };

export const flipTransition = { duration: 0.45, type: 'spring', stiffness: 260, damping: 22 };

export const tiltSpring = { stiffness: 300, damping: 30, mass: 0.5 };

export function staggerDelay(index, base = 0.06) {
  return { delay: index * base };
}
