'use client';

/**
 * SmoothScrollProvider
 * ─────────────────────────
 * Wires Lenis smooth scrolling into GSAP's ticker so every animation
 * (ScrollTrigger, useFrame in R3F, custom transforms) advances on the same
 * clock. Without this single-source-of-truth, scroll-driven 3D and DOM
 * animations drift apart and feel cheap.
 *
 * Also bridges Lenis -> ScrollTrigger so .scrollerProxy isn't needed.
 */

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.3,
    });

    /** Push every Lenis scroll into ScrollTrigger.update() — note we wrap
        in an arrow to avoid leaking Lenis's event payload into ScrollTrigger. */
    lenis.on('scroll', () => ScrollTrigger.update());

    /** Tie Lenis raf into GSAP's ticker — single render clock. */
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    /** Re-measure pin ranges once Lenis is alive and any pinned sections
        are committed. Without this, ScrollTrigger can measure pin distance
        before the layout is final. */
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 200);

    return () => {
      window.clearTimeout(refreshId);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
