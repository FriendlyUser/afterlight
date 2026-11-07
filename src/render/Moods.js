// Lighting + atmosphere presets. A map (or battle) names a mood; the mood sets
// sky gradient, fog, sun, ambient light, window glow and the post grade.

import * as THREE from 'three';

export const MOODS = {
  day: {
    sky: ['#7fb6ef', '#e9f1f4'], fog: ['#d8e6ee', 26, 70],
    hemi: ['#dfeaff', '#6a5a40', 1.4], sun: ['#fff4e0', 2.8, [-6, 14, 8]],
    windows: false, particles: 'pollen',
    grade: { saturation: 1.06, contrast: 1.04, tint: '#fffaf2', shadowTint: '#e4ebff', bloom: 0.42, bloomThreshold: 0.9, vignette: 0.3, exposure: 1.1 },
  },
  morning: {
    sky: ['#9ac0e8', '#f8e0c0'], fog: ['#f0e0cc', 28, 70],
    hemi: ['#fff0e0', '#6a5a50', 1.45], sun: ['#ffe8c8', 2.7, [-10, 12, 7]],
    windows: false, particles: 'pollen',
    grade: { saturation: 1.05, contrast: 1.03, tint: '#fff6ec', shadowTint: '#e6eaff', bloom: 0.45, vignette: 0.32, exposure: 1.12 },
  },
  dusk: {
    sky: ['#40407a', '#f39a5a'], fog: ['#d08a6a', 20, 60],
    hemi: ['#ffb890', '#3a2a40', 0.85], sun: ['#ff9a5a', 2.2, [-14, 6, 4]],
    windows: true, particles: 'embers_soft',
    grade: { saturation: 1.12, contrast: 1.08, tint: '#ffe4cc', shadowTint: '#c8c0ff', bloom: 0.7, bloomThreshold: 0.75 },
  },
  night: {
    sky: ['#0a1030', '#2a3a6a'], fog: ['#1a2448', 16, 50],
    hemi: ['#6a80c0', '#101020', 0.55], sun: ['#9ab0ff', 0.7, [6, 14, 4]],
    windows: true, particles: 'fireflies', water: 0.45, spriteGlow: 0.22,
    playerLight: { color: '#c8d8ff', intensity: 1.6, distance: 7 },
    grade: { saturation: 0.95, contrast: 1.1, tint: '#d8e0ff', shadowTint: '#b0b8ff', bloom: 0.9, bloomThreshold: 0.6, vignette: 0.55 },
  },
  storm: {
    sky: ['#1a2030', '#4a5868'], fog: ['#38424e', 12, 44],
    hemi: ['#8090a8', '#181820', 0.6], sun: ['#a0b0c8', 0.8, [4, 14, 6]],
    windows: true, particles: 'rain', water: 0.4, spriteGlow: 0.2, lightning: true,
    playerLight: { color: '#d0e0ff', intensity: 1.4, distance: 7 },
    grade: { saturation: 0.8, contrast: 1.12, tint: '#d8e4f0', shadowTint: '#b8c4e0', bloom: 0.8, bloomThreshold: 0.65, vignette: 0.6 },
  },
  interior: {
    sky: ['#1a1410', '#1a1410'], fog: ['#1a1410', 30, 60],
    hemi: ['#fff0e0', '#3a3028', 1.15], sun: ['#ffe8d0', 1.3, [-4, 12, 8]],
    windows: true, particles: 'dust',
    grade: { saturation: 1.0, contrast: 1.04, tint: '#fff6ee', shadowTint: '#e0dcf0', bloom: 0.6, bloomThreshold: 0.75, vignette: 0.5, blurTop: 2.5, blurBottom: 1.5, exposure: 1.08 },
  },
  cave: {
    sky: ['#05060a', '#0a0c14'], fog: ['#0a0c14', 10, 34],
    hemi: ['#9aa8d0', '#2a2a34', 1.0], sun: ['#8090c0', 0.6, [2, 14, 4]],
    windows: false, particles: 'dust', water: 0.3, spriteGlow: 0.3,
    playerLight: { color: '#ffd8a8', intensity: 3.2, distance: 9 },
    grade: { saturation: 0.95, contrast: 1.1, tint: '#e0e8ff', shadowTint: '#b0b8e8', bloom: 1.0, bloomThreshold: 0.55, vignette: 0.6, exposure: 1.3 },
  },
  forest: {
    sky: ['#5a8a6a', '#c8e0b0'], fog: ['#7a9a7a', 14, 48],
    hemi: ['#d8f0c0', '#2a3a20', 0.9], sun: ['#fff0c0', 1.8, [-6, 14, 4]],
    windows: false, particles: 'leaves',
    grade: { saturation: 1.1, contrast: 1.06, tint: '#f4ffe8', shadowTint: '#d0e8e0', bloom: 0.55, bloomThreshold: 0.8 },
  },
  desert: {
    sky: ['#7ab0e0', '#fbe6b8'], fog: ['#f0dcb0', 24, 70],
    hemi: ['#fff0d0', '#8a6a40', 1.2], sun: ['#fff4d8', 2.8, [-4, 16, 6]],
    windows: false, particles: 'dust_sand',
    grade: { saturation: 1.05, contrast: 1.08, tint: '#fff4e0', shadowTint: '#e8e0ff', bloom: 0.5, bloomThreshold: 0.85, exposure: 1.05 },
  },
  snow: {
    sky: ['#a8c0d8', '#eef4f8'], fog: ['#dfe8f0', 16, 56],
    hemi: ['#e8f0ff', '#6a7080', 1.1], sun: ['#f0f4ff', 1.9, [-6, 14, 8]],
    windows: true, particles: 'snow',
    grade: { saturation: 0.92, contrast: 1.04, tint: '#f4f8ff', shadowTint: '#d0dcff', bloom: 0.5, bloomThreshold: 0.88 },
  },
  swamp: {
    sky: ['#4a5a4a', '#a8b890'], fog: ['#6a7a5a', 10, 40],
    hemi: ['#c8d8a8', '#202818', 0.8], sun: ['#e0e8b0', 1.3, [-4, 14, 4]],
    windows: true, particles: 'fireflies',
    grade: { saturation: 0.95, contrast: 1.06, tint: '#eef4d8', shadowTint: '#c8d8c0', bloom: 0.6, bloomThreshold: 0.75, vignette: 0.5 },
  },
  temple: {
    sky: ['#2a2238', '#6a5a7a'], fog: ['#2a2430', 18, 50],
    hemi: ['#ffe8c8', '#201820', 0.7], sun: ['#ffe8c0', 1.2, [-4, 14, 6]],
    windows: true, particles: 'dust',
    grade: { saturation: 1.0, contrast: 1.08, tint: '#fff0e0', shadowTint: '#d0c8f0', bloom: 0.8, bloomThreshold: 0.65, vignette: 0.55 },
  },
  ruin: {
    // The broken sky after the Sundering: bruised violet with ember light.
    sky: ['#1e1236', '#c8604a'], fog: ['#5a3a5e', 18, 60],
    hemi: ['#c8a8e0', '#2a1a34', 1.05], sun: ['#ffa070', 1.9, [-10, 9, 5]],
    windows: true, particles: 'ash', spriteGlow: 0.1, wounds: true,
    playerLight: { color: '#ffc8a0', intensity: 0.9, distance: 6 },
    grade: { saturation: 1.0, contrast: 1.06, tint: '#fff0ee', shadowTint: '#b8a8f0', bloom: 0.75, bloomThreshold: 0.72, vignette: 0.5, exposure: 1.15 },
  },
  gloam: {
    sky: ['#0a0614', '#3a1a5a'], fog: ['#1a0e2a', 10, 40],
    hemi: ['#a080ff', '#0a0610', 0.55], sun: ['#c090ff', 0.8, [2, 14, 4]],
    windows: false, particles: 'gloam', water: 0.5, spriteGlow: 0.25,
    playerLight: { color: '#d8b8ff', intensity: 2.2, distance: 8 },
    grade: { saturation: 1.0, contrast: 1.12, tint: '#e8d8ff', shadowTint: '#a090e0', bloom: 1.0, bloomThreshold: 0.55, vignette: 0.6 },
  },
  evernoon: {
    // Cassian's frozen, overexposed perfect afternoon.
    sky: ['#fff4d0', '#ffffff'], fog: ['#fff8e8', 20, 60],
    hemi: ['#fffaf0', '#c0a080', 1.4], sun: ['#fff8e0', 3.2, [-2, 18, 4]],
    windows: false, particles: 'motes_gold',
    grade: { saturation: 0.8, contrast: 0.96, tint: '#fff8ea', shadowTint: '#f0e8d8', bloom: 1.1, bloomThreshold: 0.7, vignette: 0.3, exposure: 1.1 },
  },
  evernoon_battle: {
    // The same afternoon, held back far enough to read a fight in: the battle
    // camera looks across a pale floor that the field mood blooms into white.
    sky: ['#fff0c8', '#fff8ec'], fog: ['#fff4e0', 26, 80],
    hemi: ['#fffaf0', '#b09070', 1.1], sun: ['#fff4d8', 2.4, [-2, 18, 4]],
    windows: false, particles: 'motes_gold',
    grade: { saturation: 0.9, contrast: 1.04, tint: '#fff6e6', shadowTint: '#d8c8b0', bloom: 0.55, bloomThreshold: 0.85, vignette: 0.35, exposure: 0.92 },
  },
};

/** Vertical gradient background texture for a sky. */
export function skyTexture([top, bottom]) {
  const cv = document.createElement('canvas');
  cv.width = 4; cv.height = 256;
  const ctx = cv.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 256);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Install lights/fog/background for a mood on a scene.
 * Returns handles so callers can move the sun with the camera.
 */
export function applyMood(scene, moodId, renderer, camDist = 10) {
  const mood = MOODS[moodId] || MOODS.day;
  scene.background = skyTexture(mood.sky);
  // Fog distances in presets are measured from ~10 units in front of the camera.
  const off = camDist - 10;
  scene.fog = new THREE.Fog(mood.fog[0], mood.fog[1] + off, mood.fog[2] + off);

  const hemi = new THREE.HemisphereLight(mood.hemi[0], mood.hemi[1], mood.hemi[2]);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(mood.sun[0], mood.sun[1]);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  const s = 18;
  Object.assign(sun.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 80 });
  sun.shadow.bias = -0.0008;
  sun.shadow.normalBias = 0.02;
  sun.shadow.radius = 3;
  scene.add(sun);
  scene.add(sun.target);

  renderer?.setGrade(mood.grade);
  return { mood, hemi, sun, sunOffset: new THREE.Vector3(...mood.sun[2]) };
}
