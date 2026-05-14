'use client';

/**
 * Works
 * ─────────────────────────
 * Bento grid (4×N, varied spans) of selected projects.
 * Layout pattern recommended by the UI/UX Pro Max skill for Apple-style
 * portfolio presentations.
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '@/lib/projects';
import { ProjectCard } from '@/components/ui/ProjectCard';

export function Works() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
      });
      gsap.from(gridRef.current?.children ?? [], {
        y: 70, opacity: 0, duration: 1.0, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 80%', once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="works" className="relative z-10 px-8 py-[140px] lg:px-12">
      <div ref={headerRef} className="mb-16 flex items-end justify-between gap-6">
        <div className="max-w-[520px]">
          <span className="eyebrow mb-4 block">Selected Work</span>
          <h2 className="display-2 text-white" style={{ fontSize: 'clamp(36px, 4vw, 56px)' }}>
            Projects that<br />tell a story.
          </h2>
        </div>
        <span className="self-end pb-1 text-[13px] tracking-[0.05em] text-[var(--text-3)] whitespace-nowrap">
          0{projects.length} projects
        </span>
      </div>

      <div
        ref={gridRef}
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: '260px',
        }}
      >
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {/* Responsive overrides — Tailwind v4 can't fully express grid spans across breakpoints cleanly, so we drop a small style block. */}
      <style jsx>{`
        @media (max-width: 1024px) {
          section :global(.grid) {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 240px !important;
          }
        }
        @media (max-width: 640px) {
          section :global(.grid) {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 320px !important;
          }
          section :global(article.col-span-2),
          section :global(article.row-span-2) {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
