// Masks for soft ground transitions (MapBuilder: ground fringes and cliff lips). One
// small atlas of 32×32 cells, white where the overlay shows:
//   edge    a band along the top edge, ragged underneath, with a few strays past it:
//           grass spilling onto a path, sand onto a quay, snow over stone
//   corner  the same band wrapped around the top-left corner, for a neighbor that only
//           touches diagonally
//   lip     a shorter band with drips, hanging over the top of a cliff face
// Each kind has VARIANTS shapes. Every band has the same depth at its two ends, so the
// edges of neighboring tiles join without a seam. MapBuilder rotates the cells into
// place through the overlay's second UV set.

import * as THREE from 'three';
import { hash2 } from '../core/util.js';

const PX = 32;
export const MASK_VARIANTS = 4;
const KINDS = ['edge', 'corner', 'lip'];
const DEPTH = 6; // edge band depth at the tile ends, pixels

/** Smooth 1-D value noise, 0..1. */
function noise1(x, seed) {
  const i = Math.floor(x), f = x - i;
  const a = hash2(i, seed, 71), b = hash2(i + 1, seed, 71);
  const t = f * f * (3 - 2 * f);
  return a + (b - a) * t;
}

/** Band depth along x: pinned to `ends` at both tile ends, wandering in between. */
function bandDepth(x, seed, ends, amp) {
  const w = Math.sin((Math.PI * x) / (PX - 1)); // 0 at the ends
  const n = noise1(x / 5, seed) * 0.7 + noise1(x / 2.2, seed + 9) * 0.3;
  return ends + w * amp * (n * 2 - 1);
}

function paintEdge(set, v) {
  for (let x = 0; x < PX; x++) {
    let d = Math.round(bandDepth(x, 10 + v, DEPTH, 3.5));
    if (hash2(x, v, 3) > 0.8) d += 1 + Math.floor(hash2(x, v, 4) * 2); // a tuft
    for (let y = 0; y < d; y++) set(x, y);
    if (hash2(x, v, 5) > 0.86) set(x, d + 1 + Math.floor(hash2(x, v, 6) * 2)); // a stray
  }
}

function paintCorner(set, v) {
  for (let y = 0; y < PX; y++) {
    for (let x = 0; x < PX; x++) {
      const r = Math.hypot(x + 0.5, y + 0.5);
      const ang = Math.atan2(y, x);
      const R = DEPTH + 2 + (noise1(ang * 6, 20 + v) * 2 - 1) * 2;
      if ((x < DEPTH && y < DEPTH) || r < R) set(x, y);
      else if (r < R + 2 && hash2(x, y, 30 + v) > 0.82) set(x, y);
    }
  }
}

function paintLip(set, v) {
  for (let x = 0; x < PX; x++) {
    let d = Math.round(bandDepth(x, 40 + v, 4, 2));
    if (hash2(x, v, 13) > 0.78) d += 1 + Math.floor(hash2(x, v, 14) * 3); // a drip
    for (let y = 0; y < d; y++) set(x, y);
  }
}

const PAINT = { edge: paintEdge, corner: paintCorner, lip: paintLip };

let MASKS = null;

/** The mask atlas: { texture, uv(kind, variant) -> {u0,u1,v0,v1} }. */
export function getTransitionMasks() {
  if (MASKS) return MASKS;
  const cols = KINDS.length * MASK_VARIANTS;
  const cv = document.createElement('canvas');
  cv.width = cols * PX; cv.height = PX;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#fff';
  KINDS.forEach((kind, k) => {
    for (let v = 0; v < MASK_VARIANTS; v++) {
      const ox = (k * MASK_VARIANTS + v) * PX;
      PAINT[kind]((x, y) => { if (x >= 0 && y >= 0 && x < PX && y < PX) ctx.fillRect(ox + x, y, 1, 1); }, v);
    }
  });
  const texture = new THREE.CanvasTexture(cv);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.channel = 1; // sampled through the overlay's second UV set
  const W = cv.width;
  MASKS = {
    texture,
    canvas: cv,
    /** UV rect of a mask cell (half-texel inset). */
    uv(kind, variant) {
      const i = KINDS.indexOf(kind) * MASK_VARIANTS + (variant % MASK_VARIANTS);
      const e = 0.5;
      return { u0: (i * PX + e) / W, u1: ((i + 1) * PX - e) / W, v0: e / PX, v1: (PX - e) / PX };
    },
  };
  return MASKS;
}
