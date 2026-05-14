'use client';

/**
 * ProjectCard
 * ─────────────────────────
 * Bento-grid card. The span class (2x2 / 2x1 / 1x1) drives both the
 * grid placement and the proportional typography / padding.
 *
 * Hover state runs a perspective tilt sized to the card span — feature
 * cards tilt more dramatically, small cards less.
 */

import { useRef, type PointerEvent } from 'react';
import type { Project } from '@/lib/projects';

const spanClasses: Record<Project['span'], string> = {
  '2x2': 'col-span-2 row-span-2',
  '2x1': 'col-span-2 row-span-1',
  '1x1': 'col-span-1 row-span-1',
};

export function ProjectCard({ project, onOpen }: { project: Project; onOpen?: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const card = ref.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const span = project.span;
    const tiltY = span === '2x2' ? 8 : span === '1x1' ? 5 : 7;
    const tiltX = span === '2x2' ? 5 : span === '1x1' ? 3 : 4;
    const lift = span === '1x1' ? -4 : -8;
    card.style.transform = `perspective(1000px) rotateY(${x * tiltY}deg) rotateX(${
      -y * tiltX
    }deg) translateY(${lift}px) scale(1.015)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  const isFeature = project.span === '2x2';
  const isSmall = project.span === '1x1';

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      data-hover
      className={`${spanClasses[project.span]} group relative cursor-none overflow-hidden rounded-3xl border border-white/[0.05] bg-[var(--surface)] transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.12]`}
      style={{
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        boxShadow: '0 0 0 transparent',
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        style={{ background: project.gradient }}
        aria-hidden
      />

      {/* Coming-soon overlay for non-V&V cards */}
      {project.status === 'coming-soon' && (
        <div className="pointer-events-none absolute inset-0 z-[5] grid place-items-center opacity-0 transition-opacity duration-400 group-hover:opacity-100">
          <span
            className="rounded-full border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-xl"
            style={{ borderColor: 'var(--accent-focus)', color: 'var(--accent-focus)', background: 'rgba(5,5,7,0.7)' }}
          >
            Coming soon
          </span>
        </div>
      )}

      {/* Content (bottom) */}
      <div
        className="absolute inset-x-0 bottom-0 z-[2]"
        style={{
          padding: isFeature ? 32 : isSmall ? 18 : 24,
          background:
            'linear-gradient(to top, var(--surface) 0%, var(--surface) 45%, transparent 100%)',
        }}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-2)] transition-colors group-hover:border-[var(--accent-focus)] group-hover:text-[var(--accent-focus)]"
              style={{ fontSize: isSmall ? 10 : 11 }}
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-[12px] uppercase tracking-[0.06em] text-[var(--text-3)]">{project.year}</p>

        <h3
          className="mt-1 mb-2 text-white"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            fontSize: isFeature ? 34 : isSmall ? 17 : 22,
          }}
        >
          {project.title}
        </h3>

        {!isSmall && (
          <p
            className="text-[var(--text-2)]"
            style={{
              fontSize: isFeature ? 16 : 14,
              lineHeight: 1.55,
              marginBottom: 24,
              maxWidth: isFeature ? 460 : undefined,
            }}
          >
            {project.description}
          </p>
        )}

        {!isSmall && (
          <span
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-white transition-colors group-hover:text-[var(--accent-focus)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {project.status === 'live' ? 'View case study' : 'View project'}
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/[0.1] transition-colors group-hover:border-[var(--accent-focus)] group-hover:bg-[var(--accent-focus)] group-hover:text-black">
              →
            </span>
          </span>
        )}
      </div>
    </article>
  );
}
