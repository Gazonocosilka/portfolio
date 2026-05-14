'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = `Portfolio enquiry from ${form.name}`;
    const body = `${form.msg}\n\nReply to: ${form.email}`;
    window.location.href = `mailto:inka3553@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="relative z-10 px-8 py-[160px] lg:px-12" style={{ background: '#020203' }}>
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left — headline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="eyebrow mb-6 block">Let&apos;s build</span>
          <h2 className="display-1 mb-9 text-white" style={{ fontSize: 'clamp(48px, 5.5vw, 88px)' }}>
            Let&apos;s build something people <em style={{ fontStyle: 'normal', color: 'var(--accent-focus)' }}>remember</em>.
          </h2>
          <p className="mb-8 text-[18px] leading-[1.6] text-[var(--text-2)]" style={{ maxWidth: 480 }}>
            Available for freelance, internships and collaborations.
          </p>

          <a
            href="mailto:inka3553@gmail.com"
            data-hover
            className="inline-block text-[28px] font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            inka3553@gmail.com
          </a>

          <div className="mt-12 flex flex-wrap gap-3">
            {[
              { label: 'Instagram', href: '#' },
              { label: 'LinkedIn', href: '#' },
              { label: 'Behance', href: '#' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                data-hover
                className="rounded-full border border-white/[0.08] bg-white/[0.02] px-5 py-2 text-[13px] font-medium text-[var(--text-2)] transition-colors hover:border-[var(--accent-focus)] hover:text-[var(--accent-focus)]"
              >
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="grid gap-4 rounded-3xl border border-white/[0.06] p-8"
          style={{ background: 'var(--surface)' }}
        >
          {(['name', 'email'] as const).map((field) => (
            <label key={field} className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-2)]">
                {field === 'name' ? 'Your name' : 'Email'}
              </span>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                required
                className="rounded-xl border border-white/[0.06] bg-[var(--bg-2)] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[var(--accent-focus)]"
                style={{ cursor: 'none' }}
              />
            </label>
          ))}
          <label className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-2)]">
              Tell me about your project
            </span>
            <textarea
              rows={5}
              value={form.msg}
              onChange={(e) => setForm({ ...form, msg: e.target.value })}
              required
              className="resize-none rounded-xl border border-white/[0.06] bg-[var(--bg-2)] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[var(--accent-focus)]"
              style={{ cursor: 'none' }}
            />
          </label>
          <button
            type="submit"
            data-hover
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-[15px] font-bold text-black transition-opacity hover:opacity-90"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Send message <span>→</span>
          </button>
        </motion.form>
      </div>
    </section>
  );
}
