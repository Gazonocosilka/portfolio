'use client';

/**
 * Hero
 * ─────────────────────────
 * The pinned section that drives the entire MacBook reveal.
 *
 * Layout:
 *  - <section id="hero"> takes the height of the scroll choreography
 *    (multiple viewports tall) and pins itself for that duration.
 *  - The R3F <Scene /> Canvas is fixed full-screen, so it stays visible
 *    while the user scrolls through the pinned range.
 *  - ScrollTrigger publishes hero progress to `scrollState`, which the
 *    R3F CameraRig consumes in useFrame.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scene } from '@/components/three/Scene';
import { scrollState } from '@/lib/scrollState';

/**
 * The Hero is a TALL "scroll proxy" section (5x viewport).
 * Its only job is to provide scroll distance for the choreography.
 *
 * The Canvas itself is fixed/full-viewport — it doesn't need pinning.
 * We just track scroll progress within this section and publish it
 * to scrollState. This avoids ScrollTrigger.pin() interfering with
 * R3F's internal IntersectionObserver / render loop.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sceneFadeRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate(self) {
        scrollState.set(self.progress);
        if (indicatorRef.current) {
          const fade = Math.max(0, 1 - self.progress * 18);
          indicatorRef.current.style.opacity = String(fade);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <>
      {/* Canvas — fixed full-viewport, ALWAYS mounted (separate from scroll proxy) */}
      <div ref={sceneFadeRef} className="pointer-events-none fixed inset-0 z-[1]">
        <Scene fadeTarget={sceneFadeRef} />

        {/* Floor vignette overlay (also fixed so it stays during the dolly) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
          style={{
            background:
              'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(0,0,0,0.55) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Scroll-proxy section: 500vh of empty scroll drives the choreography */}
      <section
        ref={sectionRef}
        id="hero"
        className="relative w-full"
        style={{ height: '500vh' }}
        aria-label="Cinematic MacBook reveal"
      >
        {/* Scroll indicator — sticky so it stays visible until faded */}
        <div
          ref={indicatorRef}
          className="pointer-events-none sticky top-[calc(100vh-90px)] z-[3] mx-auto flex w-fit flex-col items-center gap-2"
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-3)]">Scroll</span>
          <span
            className="block h-10 w-px"
            style={{
              background: 'linear-gradient(to bottom, var(--text-3), transparent)',
              animation: 'scrollPulse 2s ease-in-out infinite',
            }}
          />
        </div>
      </section>

      <style jsx>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
          50%      { opacity: 1;   transform: scaleY(1); }
        }
      `}</style>
    </>
  );
}
