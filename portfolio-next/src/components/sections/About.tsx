'use client';

import { motion } from 'framer-motion';

export function About() {
  return (
    <section id="about" className="relative z-10 hairline-t hairline-b px-8 py-[140px] lg:px-12" style={{ background: 'var(--bg-2)' }}>
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-20 lg:grid-cols-[380px_1fr]">
        {/* Photo placeholder */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -40, scale: 0.94 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="relative grid w-full place-items-center overflow-hidden rounded-3xl border border-white/[0.06] bg-[var(--surface)]"
            style={{ aspectRatio: '4 / 5' }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 30%, rgba(41,151,255,0.12) 0%, transparent 60%)',
              }}
            />
            <div
              className="grid h-24 w-24 place-items-center rounded-full border-2 border-dashed border-white/[0.18]"
              style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--text-3)' }}
            >
              IK
            </div>
          </div>

          <div
            className="absolute -bottom-4 -right-4 flex items-center gap-2.5 rounded-2xl border border-white/[0.1] bg-[var(--surface-2)] px-4 py-3 backdrop-blur-xl"
          >
            <span className="relative inline-block h-2 w-2 rounded-full bg-emerald-400">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60" />
            </span>
            <span className="whitespace-nowrap text-[12px] font-semibold text-[var(--text-2)]">
              Currently available
            </span>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="max-w-[580px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }}
        >
          <h2 className="display-1 mb-7 text-white" style={{ fontSize: 'clamp(40px, 4.5vw, 64px)' }}>
            Hello,<br /> I&apos;m <em style={{ fontStyle: 'normal', color: 'var(--accent-focus)' }}>Inna</em>.
          </h2>
          <p className="mb-5 text-[17px] leading-[1.7] text-[var(--text-2)]">
            I&apos;m a multidisciplinary designer at the University of the Arts London — drawn to interfaces that feel like products of taste, not templates. My work moves between brand systems, UX architecture and creative web development.
          </p>
          <p className="text-[17px] leading-[1.7] text-[var(--text-2)]">
            I believe digital experiences should be remembered the way a great film is — for the mood, the rhythm, the smallest details. That&apos;s the bar I hold myself to.
          </p>

          <div className="mt-9 flex flex-wrap gap-2">
            {['UX Design', 'Branding', 'Creative Coding', 'Web Dev', 'Social Media', 'Graphic Design'].map((skill) => (
              <span
                key={skill}
                data-hover
                className="rounded-full border border-white/[0.1] bg-[var(--surface-2)] px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.04em] text-[var(--text-2)] transition-colors hover:border-[var(--accent-focus)] hover:text-[var(--accent-focus)]"
              >
                {skill}
              </span>
            ))}
          </div>

          <blockquote
            className="mt-10 border-l-2 pl-5 text-[18px] italic leading-[1.6] text-white"
            style={{ borderColor: 'var(--accent-focus)', fontFamily: 'var(--font-display)' }}
          >
            &ldquo;Design is the way the brand whispers before it speaks.&rdquo;
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
