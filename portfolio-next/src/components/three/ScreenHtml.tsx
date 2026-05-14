'use client';

/**
 * ScreenHtml
 * ─────────────────────────
 * Live DOM rendered inside the laptop screen via drei's <Html transform>.
 *
 * The DOM is authored at 1280×800 px (16:10) and scaled down by the
 * `scale` prop so 1280 px ≈ 2.92 world units (the screen plane width).
 * Because Html transform=true projects through the same camera matrix
 * as the WebGL scene, perspective is preserved — when the camera
 * zooms in, the DOM also visually zooms exactly in step with the
 * surrounding 3D world. No texture, no canvas, real DOM.
 */

import { Html } from '@react-three/drei';
import { MACBOOK } from '@/lib/poses';

const PX_W = 1280;
const SCALE = MACBOOK.screen.w / PX_W; // ≈ 0.00228

export function ScreenHtml() {
  return (
    <Html
      transform
      occlude="blending"
      position={[0, 0, 0.034]}
      distanceFactor={1}
      scale={SCALE}
      style={{ width: `${PX_W}px`, height: '800px', pointerEvents: 'none' }}
      zIndexRange={[100, 0]}
    >
      <div className="screen-ui">
        <div className="relative z-[1] flex h-full flex-col p-14">
          {/* Top bar */}
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-3 font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>
              <span
                className="grid h-9 w-9 place-items-center rounded-[10px] text-[15px]"
                style={{ background: 'linear-gradient(135deg, #4f8ef7, #7ab3ff)', color: '#07070b', fontWeight: 800 }}
              >
                IK
              </span>
              Inna Krachun
            </div>
            <div className="flex gap-8 text-[16px] font-medium" style={{ color: 'rgba(245,245,247,0.55)' }}>
              <span>Works</span>
              <span>About</span>
              <span>Contact</span>
            </div>
            <div className="rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-black" style={{ fontFamily: 'var(--font-display)' }}>
              Let&apos;s talk
            </div>
          </div>

          {/* Hero */}
          <div className="flex flex-1 flex-col justify-center" style={{ maxWidth: 920 }}>
            <div className="mb-6 inline-flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em]" style={{ color: '#7ab3ff' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#7ab3ff' }} />
              UX · Branding · Creative Dev
            </div>
            <h1 className="display-1 mb-7" style={{ fontSize: 80, color: '#f4f4f8' }}>
              Designing digital<br />experiences people{' '}
              <em
                style={{
                  fontStyle: 'normal',
                  background: 'linear-gradient(135deg, #7ab3ff 0%, #b58cff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                remember
              </em>
              .
            </h1>
            <p className="mb-10 text-[20px] leading-[1.5]" style={{ color: 'rgba(245,245,247,0.6)', maxWidth: 620 }}>
              Multidisciplinary designer at UAL — crafting cinematic interfaces, refined brand systems and emotional digital products.
            </p>
            <div className="flex items-center gap-4">
              <span
                className="rounded-full px-7 py-4 text-[16px] font-bold text-black"
                style={{ background: '#f0f0f4', fontFamily: 'var(--font-display)' }}
              >
                View works →
              </span>
              <span className="rounded-full border px-7 py-4 text-[16px]" style={{ borderColor: 'rgba(245,245,247,0.18)', color: '#f5f5f7' }}>
                About me
              </span>
            </div>
          </div>

          {/* Project strip */}
          <div className="mt-auto grid grid-cols-4 gap-3">
            {[
              { tag: 'UX · Branding', name: 'V&V Boutique', g: 'linear-gradient(135deg,#1a0a14,#3d1a2a)' },
              { tag: 'Identity', name: 'Beextrart', g: 'linear-gradient(135deg,#100c06,#2e2410)' },
              { tag: 'Web · UI', name: 'NexGen', g: 'linear-gradient(135deg,#020e1f,#0a2748)' },
              { tag: 'UI Design', name: 'Car Service', g: 'linear-gradient(135deg,#0c0e12,#20243a)' },
            ].map((p) => (
              <div
                key={p.name}
                className="relative flex flex-col justify-between overflow-hidden rounded-[14px] border p-5"
                style={{ height: 110, background: p.g, borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'rgba(245,245,247,0.45)' }}>
                  {p.tag}
                </span>
                <span className="text-[20px] font-bold" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.015em' }}>
                  {p.name}
                </span>
                <span className="absolute right-4 top-4 text-[16px]" style={{ color: 'rgba(245,245,247,0.5)' }}>
                  ↗
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Html>
  );
}
