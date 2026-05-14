import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { Cursor } from '@/components/ui/Cursor';
import { Nav } from '@/components/ui/Nav';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Inna Krachun — Designer',
  description:
    'UX Designer, Branding, Creative Development. A cinematic portfolio by Inna Krachun.',
  metadataBase: new URL('https://gazonocosilka.github.io'),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="antialiased">
        <SmoothScrollProvider>
          <Cursor />
          <Nav />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
