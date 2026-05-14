/**
 * Shared scroll-progress signal between the Lenis page scroll and the R3F render loop.
 *
 * ScrollTrigger fires onUpdate at native scroll frequency (synced with Lenis via gsap.ticker).
 * We publish the hero progress here so the R3F useFrame loop can read it without
 * re-renders or context overhead.
 */
type Listener = (p: number) => void;

let _progress = 0;
const _listeners = new Set<Listener>();

export const scrollState = {
  get progress() {
    return _progress;
  },
  set(p: number) {
    _progress = p;
    _listeners.forEach((l) => l(p));
  },
  subscribe(fn: Listener) {
    _listeners.add(fn);
    return () => _listeners.delete(fn);
  },
};
