'use client';

import { useEffect, useRef } from 'react';

/**
 * Cursor — soft lerping dot + ring with mix-blend-mode: difference.
 * Inspired by Awwwards / Apple keynote UI cursors.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const handleMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const enterHover = () => document.body.classList.add('cursor-hovering');
    const leaveHover = () => document.body.classList.remove('cursor-hovering');

    const interactiveSelector = 'a, button, [data-hover], input, textarea, [role="button"]';

    /** Re-attach hover listeners when DOM mutates */
    const attachHover = () => {
      document.querySelectorAll(interactiveSelector).forEach((el) => {
        el.removeEventListener('pointerenter', enterHover);
        el.removeEventListener('pointerleave', leaveHover);
        el.addEventListener('pointerenter', enterHover);
        el.addEventListener('pointerleave', leaveHover);
      });
    };
    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('pointermove', handleMove);

    const tick = () => {
      dx += (mx - dx) * 0.22;
      dy += (my - dy) * 0.22;
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
