/**
 * Custom easing functions — Apple-style cinematic curves.
 *
 * All functions take a normalised progress t in [0, 1] and return [0, 1].
 */

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

export const easeOut3 = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeOut4 = (t: number) => 1 - Math.pow(1 - t, 4);
export const easeIn3 = (t: number) => t * t * t;
export const easeInOut3 = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
export const easeInOut4 = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

/**
 * Physically-believable hinge motion.
 * Fast pickup (overcoming static friction), gentle slowdown, micro overshoot.
 */
export const easeHinge = (t: number): number => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const base = 1 - Math.pow(1 - t, 3.2);
  const overshoot = Math.sin(t * Math.PI) * 0.025 * (1 - Math.pow(1 - t, 2));
  return Math.min(1.03, base + overshoot);
};

/**
 * Apple keynote camera ease — long deceleration tail.
 */
export const easeKeynote = (t: number): number => {
  return 1 - Math.pow(1 - t, 5);
};
