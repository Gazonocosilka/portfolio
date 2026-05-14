import { Hero } from '@/components/sections/Hero';
import { Works } from '@/components/sections/Works';
import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <Works />
      <About />
      <Contact />

      <footer
        className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-8 py-6 text-[12px] text-[var(--text-3)] lg:px-12"
        style={{ background: '#020203', borderTop: '1px solid var(--hairline)' }}
      >
        <span>© {new Date().getFullYear()} Inna Krachun</span>
        <span>Designed &amp; coded with care · London</span>
      </footer>
    </main>
  );
}
