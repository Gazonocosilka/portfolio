'use client';

/**
 * MacBook
 * ─────────────────────────
 * Procedural MacBook Pro geometry with physically-based materials.
 * Inspired by Apple's actual product proportions (14" Space Black).
 *
 * NOTE: We use procedural geometry because shipping a 5–10 MB GLTF
 * model adds load time without meaningfully improving silhouette at
 * this composition. RoundedBox from drei + MeshPhysicalMaterial gives
 * us soft chamfered edges and convincing aluminum at <50 KB.
 *
 * The model is built in OPEN orientation: the lid stands up from the
 * hinge with the screen facing +Z. To close, rotate the LidPivot
 * group by +PI/2 around the X axis — lid tips forward onto base.
 */

import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { MACBOOK, HINGE } from '@/lib/poses';
import { ScreenHtml } from './ScreenHtml';

export interface MacBookHandle {
  lidPivot: THREE.Group | null;
  appleLogoMaterial: THREE.MeshStandardMaterial | null;
  screenGlow: THREE.PointLight | null;
  screenHaloMat: THREE.MeshBasicMaterial | null;
}

interface Props {
  /** Optional: skin theme. */
  variant?: 'space-black' | 'silver';
}

export const MacBook = forwardRef<MacBookHandle, Props>(function MacBook(
  { variant = 'space-black' },
  ref
) {
  const lidPivotRef = useRef<THREE.Group>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const appleLogoMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const screenGlowRef = useRef<THREE.PointLight>(null);

  useImperativeHandle(
    ref,
    () => ({
      get lidPivot() {
        return lidPivotRef.current;
      },
      get appleLogoMaterial() {
        return appleLogoMatRef.current;
      },
      get screenGlow() {
        return screenGlowRef.current;
      },
      get screenHaloMat() {
        return haloMatRef.current;
      },
    }),
    []
  );

  /* ── Materials ──
     Aluminum body uses MeshPhysicalMaterial with clearcoat for the
     subtle "wet" anodised look real MacBooks have under studio lights. */
  const bodyMaterial = useMemo(() => {
    const color = variant === 'space-black' ? '#1a1a1d' : '#c7c8cc';
    return new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.95,
      roughness: variant === 'space-black' ? 0.34 : 0.28,
      clearcoat: 0.55,
      clearcoatRoughness: 0.42,
      envMapIntensity: 1.15,
    });
  }, [variant]);

  const keyboardMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#0c0c0f', roughness: 0.62, metalness: 0.55 }),
    []
  );
  const keyMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#15151a', roughness: 0.68, metalness: 0.42 }),
    []
  );
  const trackpadMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#16161a',
        roughness: 0.18,
        metalness: 0.22,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
      }),
    []
  );
  const bezelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#04040a', roughness: 0.42, metalness: 0.32 }),
    []
  );

  /* ── Procedural key matrix ── */
  const { keysGeo, keysMatrix, keysCount } = useMemo(() => {
    const cols = 24,
      rows = 6;
    const geo = new THREE.BoxGeometry(0.085, 0.012, 0.085);
    const count = cols * rows;
    const mtx = new THREE.Matrix4();
    const positions: THREE.Matrix4[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = -1.13 + (c / (cols - 1)) * 2.26;
        const z = -0.55 + (r / (rows - 1)) * 0.95;
        mtx.makeTranslation(x, 0.105, z - 0.08);
        positions.push(mtx.clone());
      }
    }
    return { keysGeo: geo, keysMatrix: positions, keysCount: count };
  }, []);

  return (
    <group dispose={null}>
      {/* ─── BASE (keyboard chassis) ─── */}
      <RoundedBox
        args={[MACBOOK.base.w, MACBOOK.base.h, MACBOOK.base.d]}
        radius={MACBOOK.base.radius}
        smoothness={6}
        bevelSegments={5}
        creaseAngle={0.4}
        material={bodyMaterial}
        castShadow
        receiveShadow
      />

      {/* Keyboard recessed panel */}
      <mesh
        position={[0, 0.097, -0.05]}
        material={keyboardMat}
        receiveShadow
      >
        <boxGeometry args={[2.6, 0.005, 1.32]} />
      </mesh>

      {/* Keys — InstancedMesh */}
      <instancedMesh
        args={[keysGeo, keyMat, keysCount]}
        castShadow={false}
        receiveShadow
        ref={(mesh) => {
          if (mesh) {
            keysMatrix.forEach((m, i) => mesh.setMatrixAt(i, m));
            mesh.instanceMatrix.needsUpdate = true;
          }
        }}
      />

      {/* Trackpad */}
      <mesh position={[0, 0.097, 0.62]} material={trackpadMat} receiveShadow>
        <boxGeometry args={[1.25, 0.014, 0.78]} />
      </mesh>

      {/* ─── LID PIVOT — hinge at the rear-top edge of the base ─── */}
      <group ref={lidPivotRef} position={[0, MACBOOK.hingeY, MACBOOK.hingeZ]} rotation={[HINGE.closed, 0, 0]}>
        {/* The lid is modelled in OPEN orientation: standing up
            with screen facing +Z. We translate so its bottom edge
            sits exactly on the hinge axis. */}
        <group position={[0, MACBOOK.lid.h * 0.5, 0]}>
          {/* Lid panel (Apple-logo side faces -Z, screen side +Z) */}
          <RoundedBox
            args={[MACBOOK.lid.w, MACBOOK.lid.h, MACBOOK.lid.d]}
            radius={MACBOOK.lid.radius}
            smoothness={6}
            bevelSegments={5}
            creaseAngle={0.4}
            position={[0, 0, -0.02]}
            material={bodyMaterial}
            castShadow
            receiveShadow
          />

          {/* Apple logo — etched into the lid back, base color matches
              the body so it stays nearly invisible when "off". Emissive
              ramps up when the screen powers on. */}
          <mesh position={[0, 0.05, -0.063]} rotation={[0, Math.PI, 0]}>
            <circleGeometry args={[0.16, 48]} />
            <meshStandardMaterial
              ref={appleLogoMatRef}
              color="#1f1f22"
              emissive="#4f8ef7"
              emissiveIntensity={0}
              roughness={0.55}
              metalness={0.62}
            />
          </mesh>

          {/* Screen bezel — thin black frame around the panel */}
          <mesh position={[0, 0, 0.026]} material={bezelMat}>
            <boxGeometry args={[MACBOOK.lid.w * 0.96, MACBOOK.lid.h * 0.94, 0.01]} />
          </mesh>

          {/* Camera notch */}
          <mesh position={[0, MACBOOK.lid.h * 0.46, 0.034]}>
            <boxGeometry args={[0.34, 0.058, 0.008]} />
            <meshStandardMaterial color="#000000" roughness={0.55} metalness={0.1} />
          </mesh>

          {/* Screen panel — dark backdrop. Real content is the <ScreenHtml />
              that lives at the same z position. */}
          <mesh position={[0, 0, 0.032]}>
            <planeGeometry args={[MACBOOK.screen.w, MACBOOK.screen.h]} />
            <meshBasicMaterial color="#000000" />
          </mesh>

          {/* Bloom-friendly halo — additive plane behind the screen.
              Drives the cinematic "screen-on" glow under post-processing. */}
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[MACBOOK.screen.w * 1.18, MACBOOK.screen.h * 1.16]} />
            <meshBasicMaterial
              ref={haloMatRef}
              color="#6aa9ff"
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          {/* Inline point light — the "screen is emitting photons" effect.
              Intensity is driven from the scroll choreography. */}
          <pointLight
            ref={screenGlowRef}
            position={[0, 0, 0.5]}
            color="#6aa9ff"
            intensity={0}
            distance={4.5}
            decay={2.2}
          />

          {/* The live DOM portfolio rendered in 3D space */}
          <ScreenHtml />
        </group>
      </group>
    </group>
  );
});
