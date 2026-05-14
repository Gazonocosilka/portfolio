'use client';

/**
 * CameraRig
 * ─────────────────────────
 * Scroll-driven camera animation pipeline.
 *
 *  Phase 1 (0.00 → 0.55) — Hinge opens (Apple-physics, mild overshoot)
 *  Phase 2 (0.10 → 0.55) — Subtle laptop yaw reveal
 *  Phase 3 (0.30 → 0.60) — Screen wakes (emissive + halo + Apple logo glow)
 *  Phase 4 (0.55 → 0.88) — Cinematic dolly into the screen plane
 *  Phase 5 (0.86 → 1.00) — Hand-off: Canvas opacity fades, DOM takes over
 *
 * Plus continuous:
 *  - Idle breathing while p < 0.05
 *  - Mouse parallax that decays as we approach the screen
 *  - Micro camera shake during the dolly (hand-held lens feel)
 *  - Dynamic exposure adaptation (darker scene as we push into screen)
 */

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CAMERA, HINGE } from '@/lib/poses';
import {
  clamp01,
  easeHinge,
  easeIn3,
  easeInOut4,
  easeOut3,
  lerp,
  remap,
} from '@/lib/easing';
import { scrollState } from '@/lib/scrollState';
import type { MacBookHandle } from './MacBook';

interface Props {
  macbook: React.RefObject<MacBookHandle | null>;
  /** Optional element to fade out for the WebGL→DOM hand-off. */
  fadeTarget?: React.RefObject<HTMLElement | null>;
}

export function CameraRig({ macbook, fadeTarget }: Props) {
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const lookAt = useRef(new THREE.Vector3().copy(CAMERA.establish.lookAt));

  /* Track DPR & mouse */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  /* Initial pose */
  useEffect(() => {
    camera.position.copy(CAMERA.establish.position);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = CAMERA.establish.fov;
      camera.updateProjectionMatrix();
    }
    lookAt.current.copy(CAMERA.establish.lookAt);
    camera.lookAt(lookAt.current);
  }, [camera]);

  /* Reusable temp vectors */
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  useFrame(({ clock }, dt) => {
    const p = scrollState.progress;
    const time = clock.getElapsedTime();

    /* ── Phase 1 — Lid opens ── */
    {
      const t = remap(p, 0.02, 0.55);
      const e = easeHinge(t);
      const angle = lerp(HINGE.closed, HINGE.open, e);
      if (macbook.current?.lidPivot) {
        macbook.current.lidPivot.rotation.x = angle;
      }
    }

    /* ── Phase 3 — Screen wakes ── */
    {
      const t = remap(p, 0.3, 0.6);
      const e = easeOut3(t);
      if (macbook.current?.appleLogoMaterial) {
        macbook.current.appleLogoMaterial.emissiveIntensity = lerp(0, 0.95, e);
      }
      if (macbook.current?.screenGlow) {
        macbook.current.screenGlow.intensity = lerp(0, 2.4, e);
      }
      if (macbook.current?.screenHaloMat) {
        macbook.current.screenHaloMat.opacity = e * 0.7;
      }
    }

    /* ── Phase 2 + 4 — Camera interpolation ──
       We segment the camera into three legs:
         establish → reveal (0.05 → 0.45)
         reveal    → dolly  (0.45 → 0.78)
         dolly     → finish (0.78 → 1.00) */
    const leg1 = easeInOut4(remap(p, 0.05, 0.45));
    const leg2 = easeInOut4(remap(p, 0.45, 0.78));
    const leg3 = easeIn3(remap(p, 0.78, 1.0));

    tmpPos.current
      .copy(CAMERA.establish.position)
      .lerp(CAMERA.reveal.position, leg1)
      .lerp(CAMERA.dolly.position, leg2)
      .lerp(CAMERA.finish.position, leg3);

    tmpLook.current
      .copy(CAMERA.establish.lookAt)
      .lerp(CAMERA.reveal.lookAt, leg1)
      .lerp(CAMERA.dolly.lookAt, leg2)
      .lerp(CAMERA.finish.lookAt, leg3);

    /* ── FOV breathing — subtle lens compression as we approach the screen ── */
    const fov =
      lerp(
        lerp(CAMERA.establish.fov, CAMERA.reveal.fov, leg1),
        lerp(CAMERA.dolly.fov, CAMERA.finish.fov, leg2),
        clamp01((p - 0.45) / 0.55)
      ) - clamp01(leg3) * 1.5;
    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    /* ── Mouse parallax — decays as we zoom in ── */
    const parallaxStrength = 1 - clamp01((p - 0.55) * 3);
    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * Math.min(1, dt * 6);
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * Math.min(1, dt * 6);
    tmpPos.current.x += smoothMouse.current.x * 0.32 * parallaxStrength;
    tmpPos.current.y += -smoothMouse.current.y * 0.15 * parallaxStrength;

    /* ── Cinematic micro-shake during the dolly (0.55 → 0.85) ── */
    const shakeActive = remap(p, 0.55, 0.85) * (1 - remap(p, 0.85, 1.0));
    if (shakeActive > 0.001) {
      const s = 0.008 * shakeActive;
      tmpPos.current.x += Math.sin(time * 17.3) * s * 0.7;
      tmpPos.current.y += Math.cos(time * 13.1) * s;
    }

    /* ── Idle breathing — only when nearly at rest ── */
    const idle = 1 - clamp01(p * 8);
    if (idle > 0.001) {
      tmpPos.current.y += Math.sin(time * 0.7) * 0.018 * idle;
      tmpPos.current.x += Math.sin(time * 0.55) * 0.012 * idle;
    }

    camera.position.copy(tmpPos.current);
    lookAt.current.copy(tmpLook.current);
    camera.lookAt(lookAt.current);

    /* ── Dynamic exposure — tone-mapping adapts as we move into the screen ── */
    gl.toneMappingExposure = lerp(1.05, 0.85, easeOut3(remap(p, 0.5, 0.95)));

    /* ── Hand-off — fade the entire canvas at the very end ── */
    if (fadeTarget?.current) {
      const fade = 1 - easeIn3(remap(p, 0.92, 1.0));
      fadeTarget.current.style.opacity = String(fade);
    }
  });

  return null;
}
