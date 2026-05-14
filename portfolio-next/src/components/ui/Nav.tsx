'use client';

import { useEffect, useState } from 'react';

/**
 * Fixed navigation with glass blur once scrolled past 60px.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[500] flex h-16 items-center justify-between px-8 transition-all duration-500 lg:px-12 ${
        scrolled ? 'glass border-b border-white/[0.06]' : 'border-b border-transparent'
      }`}
    >
      <a href="#top" className="flex items-center gap-3">
        <span
          className="grid h-8 w-8 place-items-center rounded-[10px] text-[13px] font-extrabold text-white"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-focus))',
          }}
        >
          IK
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.01em' }}>
          Inna Krachun
        </span>
      </a>

      <ul className="hidden items-center gap-9 md:flex">
        {['Works', 'About', 'Contact'].map((label) => (
          <li key={label}>
            <a
              href={`#${label.toLowerCase()}`}
              className="text-sm font-medium text-[var(--text-2)] transition-colors hover:text-white"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href="#contact"
        className="rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-black transition-opacity hover:opacity-85"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Let&apos;s talk
      </a>
    </nav>
  );
}
