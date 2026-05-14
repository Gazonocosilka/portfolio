'use client';

/**
 * Scene
 * ─────────────────────────
 * The R3F <Canvas> wrapper. Holds the MacBook, camera rig, environment
 * lighting, ground shadow plane, and cinematic post-processing chain.
 *
 * The Canvas is fixed/full-viewport behind the DOM content. The page's
 * normal vertical scroll drives the animation via ScrollTrigger — see
 * Hero.tsx for the pin setup that publishes progress to scrollState.
 *
 * Postprocessing order:
 *   Render → Bloom → ChromaticAberration → Vignette → Noise
 */

import { Canvas } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
  SMAA,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { useRef } from 'react';
import * as THREE from 'three';
import { MacBook, type MacBookHandle } from './MacBook';
import { CameraRig } from './CameraRig';

export function Scene({ fadeTarget }: { fadeTarget: React.RefObject<HTMLElement | null> }) {
  const macbookRef = useRef<MacBookHandle>(null);

  return (
    <Canvas
      className="scene-canvas"
      frameloop="always"
      dpr={[1, 2]}
      gl={{
        antialias: false, // SMAA handles AA in post
        powerPreference: 'high-performance',
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      shadows={{ type: THREE.PCFSoftShadowMap, enabled: true }}
      style={{
        background: 'transparent',
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <PerspectiveCamera makeDefault fov={32} near={0.1} far={100} position={[0, 1.35, 5.6]} />

      {/* ─── Environment ─── */}
      <Environment preset="studio" environmentIntensity={0.85} />

      {/* Hemisphere wash for soft ambient skin */}
      <hemisphereLight args={['#9ab5ff', '#06060a', 0.55]} />

      {/* Key light — directional with soft shadows */}
      <directionalLight
        position={[3.4, 5.5, 4.2]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-radius={6}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
      />

      {/* Cool fill */}
      <directionalLight position={[-4.5, 2.0, 2.5]} intensity={0.35} color="#7fa6ff" />

      {/* Rim back-light — adds the subtle edge highlight on the lid */}
      <directionalLight position={[-2.5, 1.5, -4]} intensity={0.55} color="#ffffff" />

      {/* Soft overhead area light for the premium clearcoat highlight.
          Kept restrained — bloom amplifies any specular blow-out. */}
      <rectAreaLight
        position={[0, 5, 1.5]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={6}
        height={3}
        intensity={2.2}
        color="#ffffff"
      />

      {/* ─── MacBook ─── */}
      <MacBook ref={macbookRef} variant="space-black" />

      {/* ─── Ground contact shadow (drei) ─── */}
      <ContactShadows
        position={[0, -0.42, 0]}
        opacity={0.55}
        scale={9}
        blur={2.4}
        far={2.2}
        resolution={1024}
        color="#000000"
      />

      {/* ─── Camera animation rig ─── */}
      <CameraRig macbook={macbookRef} fadeTarget={fadeTarget} />

      {/* ─── Post-processing — cinematic finishing ─── */}
      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={0.72}
          luminanceThreshold={0.92}
          luminanceSmoothing={0.18}
          kernelSize={KernelSize.LARGE}
          mipmapBlur
        />
        <ChromaticAberration
          offset={[0.0006, 0.0006]}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
        <Noise opacity={0.04} premultiply blendFunction={BlendFunction.OVERLAY} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
