/**
 * Cinematic keyframe poses for the hero MacBook scene.
 * Each phase of the scroll choreography references these.
 */

import * as THREE from 'three';

/**
 * Hinge angles in radians.
 *
 * In our geometry the lid is modelled UPRIGHT in local space (its center
 * sits +1.0 above the hinge, screen facing +Z). To close, we tip the
 * lid FORWARD around X so it lies flat on top of the keyboard.
 *
 *  - closed = +π/2  (lid tipped 90° forward, screen-down on keyboard)
 *  - open   = -0.18 (≈ -10°, slight back-lean — typical Apple angle)
 */
export const HINGE = {
  closed: Math.PI / 2,
  open: -0.18,
};

/**
 * Camera waypoints in world space.
 *  - `position`: world-space camera position
 *  - `lookAt`: world-space lookAt target
 *  - `fov`: field of view (degrees)
 */
export const CAMERA = {
  /**
   * Establishing shot — cinematic top-front three-quarter angle.
   * The laptop sits centered, drama provided by tight composition.
   */
  establish: {
    position: new THREE.Vector3(0.0, 1.35, 5.6),
    lookAt: new THREE.Vector3(0, 0.7, 0),
    fov: 32,
  },
  /**
   * Reveal — same height but slight orbit; we keep the laptop frontal
   * for legibility as the screen powers on.
   */
  reveal: {
    position: new THREE.Vector3(0.0, 1.05, 4.9),
    lookAt: new THREE.Vector3(0, 0.95, 0),
    fov: 30,
  },
  /**
   * Dolly in — camera approaches the screen plane along its normal.
   * Final z places the screen filling ~90% of the viewport.
   */
  dolly: {
    position: new THREE.Vector3(0.0, 1.05, 1.95),
    lookAt: new THREE.Vector3(0, 1.05, 0),
    fov: 28,
  },
  /**
   * Final — perfectly fronto-parallel to the screen plane so the
   * hand-off to DOM is geometrically continuous.
   */
  finish: {
    position: new THREE.Vector3(0.0, 1.025, 1.45),
    lookAt: new THREE.Vector3(0, 1.025, 0),
    fov: 26,
  },
};

/**
 * Macbook physical dimensions (world units ≈ decimeters; visual only).
 * 14" MacBook Pro proportions normalised.
 */
export const MACBOOK = {
  base: { w: 3.12, h: 0.18, d: 2.15, radius: 0.06 },
  lid:  { w: 3.12, h: 2.0,  d: 0.085, radius: 0.04 },
  /** Screen visible area (inside bezel). Aspect 16:10. */
  screen: { w: 2.92, h: 1.78 },
  /** Lid bottom edge sits at this Y when pivot.rotation.x = 0 (closed). */
  hingeY: 0.09,
  /** Hinge Z (rear edge of base). */
  hingeZ: -1.04,
};
