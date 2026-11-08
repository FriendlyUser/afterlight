// The Emberhart — the party's mount, painted procedurally like everything else.
// A great umber hart whose antlers carry embers of the old Hearthsun: glowing tines,
// ember-flecked coat, a Keeper-blue saddle blanket and a little lantern.
//
// The sheet holds the hart with its rider (the current leader's field sprite, head
// and torso) composited on its back, so each rider gets their own cached sheet:
//   rows: down, left, right, up — cols: 0 standing, 1–4 gallop.
// A matching glow mask (embers and tines only) lights up at dusk and night.

import * as THREE from 'three';
import { PixelCanvas, hex, ramp, shade } from './PixelCanvas.js';
import { getCharacterSheet, FIELD_W, FIELD_H, FIELD_DIRS } from './SpriteFactory.js';

export const MOUNT_W = 44;
export const MOUNT_H = 46;
export const MOUNT_FRAMES = 5; // 0 standing, 1–4 gallop
const SHEET_W = MOUNT_W * MOUNT_FRAMES;
const SHEET_H = MOUNT_H * 4;
const GROUND = 44; // hooves stand on this row

const OUTLINE = hex('#1b1422');
const COAT = ramp('#7c4f37');
const FAR = COAT.map((c) => shade(c, -0.1));
const BELLY = ramp('#c69c74');
const CREAM = ramp('#efe2c8');
const ANTLER = ramp('#d8c6a0');
const GLOW = [hex('#ff8a3a'), hex('#ffb24a'), hex('#ffd77a'), hex('#ffeeb0'), hex('#fff8e0')];
const HOOF = hex('#2a1a16');
const BLANKET = ramp('#2f5180');
const TRIM = ramp('#d9a93c');
const GLOWSET = new Set(GLOW);

// Gallop: body bob and per-leg [dx, lift] for near/far fore and hind legs.
const BOB = [0, 0, -1, 0, -1];
const SIDE_LEGS = [
  { nf: [0, 0], ff: [-1, 0], nh: [0, 0], fh: [1, 0] },
  { nf: [5, 0], ff: [3, 1], nh: [-5, 0], fh: [-3, 1] },
  { nf: [-2, 3], ff: [0, 2], nh: [3, 3], fh: [1, 2] },
  { nf: [3, 1], ff: [5, 0], nh: [-3, 1], fh: [-5, 0] },
  { nf: [0, 2], ff: [-2, 3], nh: [1, 2], fh: [3, 3] },
];
// Front/back views: which leg is raised (left, right) per frame.
const LIFT = [[0, 0], [3, 0], [1, 1], [0, 3], [1, 1]];

/** A leg from the shoulder/hip to the hoof, with a knee bend. */
function leg(pc, x, top, dx, lift, R, fore) {
  const foot = GROUND - lift;
  const kx = x + Math.round(dx / 2) + (fore ? 0 : 1), ky = Math.round((top + foot) / 2) + 1;
  pc.thickLine(x, top, kx, ky, 3, R[1]);
  pc.thickLine(kx, ky, x + dx, foot - 1, 2, R[1]);
  pc.rect(x + dx - 1, foot - 1, 2, 2, HOOF);
}

/** Antler: a main beam through `pts`, tines off it; tips burn. */
function antler(pc, pts, tines, far) {
  const bone = far ? ANTLER[1] : ANTLER[2];
  // Bone at the base, ember-light toward the tips.
  const hot = far ? GLOW[1] : GLOW[2];
  for (let i = 1; i < pts.length; i++) pc.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], i === pts.length - 1 ? hot : bone);
  for (const [a, b] of tines) {
    const mx = Math.round((a[0] + b[0]) / 2), my = Math.round((a[1] + b[1]) / 2);
    pc.line(a[0], a[1], mx, my, bone);
    pc.line(mx, my, b[0], b[1], hot);
  }
  const tips = [pts[pts.length - 1], ...tines.map((t) => t[1])];
  for (const [x, y] of tips) {
    pc.set(x, y, far ? GLOW[2] : GLOW[4]);
    pc.set(x, y + 1, far ? GLOW[1] : GLOW[3]);
  }
}

function embers(pc, spots, b) {
  for (const [x, y, k] of spots) pc.over(x, y + b, GLOW[k]);
}

/** Copy rows 0..rows of a rider's field frame into a PixelCanvas. */
function riderCrop(sheetCanvas, dir, rows) {
  const ctx = sheetCanvas.getContext('2d', { willReadFrequently: true });
  const row = FIELD_DIRS.indexOf(dir);
  const img = ctx.getImageData(0, row * FIELD_H, FIELD_W, rows);
  const pc = new PixelCanvas(FIELD_W, rows);
  pc.data.set(new Uint32Array(img.data.buffer.slice(0)));
  // Close the cut at the waist with the outline color.
  for (let x = 0; x < FIELD_W; x++) if (pc.get(x, rows - 1) && pc.get(x, rows - 1) !== OUTLINE) pc.set(x, rows - 1, shade(pc.get(x, rows - 1), -0.15));
  return pc;
}

/** Leg and boot colors sampled from the rider's front frame. */
function riderColors(sheetCanvas) {
  const ctx = sheetCanvas.getContext('2d', { willReadFrequently: true });
  const px = (x, y) => { const d = ctx.getImageData(x, y, 1, 1).data; return hex(`#${[d[0], d[1], d[2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`); };
  return { pants: px(10, 26), boots: px(10, 29) };
}

// ------------------------------------------------------------------ side (facing right)

function paintSide(f, rider, rc) {
  rc = rc || {};
  const b = BOB[f], L = SIDE_LEGS[f];
  const back = new PixelCanvas(MOUNT_W, MOUNT_H);
  // Far legs, far antler, tail.
  leg(back, 25, 32 + b, L.ff[0], L.ff[1], FAR, true);
  leg(back, 12, 32 + b, L.fh[0], L.fh[1], FAR, false);
  antler(back, [[32, 11 + b], [30, 6 + b], [27, 2 + b]], [[[31, 8 + b], [34, 4 + b]], [[29, 4 + b], [29, 1 + b]]], true);
  back.ellipse(6.5, 25 + b, 1.4, 1.8, CREAM[2]);
  back.set(6, 24 + b, COAT[2]);
  // Body: haunch, barrel, chest; pale belly.
  back.shadedEllipse(11, 28 + b, 6, 6.5, COAT);
  back.shadedEllipse(19, 29 + b, 11.5, 6, COAT);
  back.shadedEllipse(27, 29 + b, 6, 6, COAT);
  for (let x = 9; x <= 31; x++) for (let y = 32 + b; y <= 35 + b; y++) back.over(x, y, BELLY[y - b > 33 ? 1 : 2]);
  // Neck, chest ruff, head, muzzle, ear.
  back.poly([[24, 28 + b], [31, 30 + b], [36, 17 + b], [33, 12 + b], [28, 15 + b]], COAT[2]);
  back.ellipse(31, 25 + b, 2.2, 4.2, CREAM[2]);
  back.shadedEllipse(35, 14 + b, 3.6, 3.1, COAT);
  back.poly([[34, 12 + b], [41, 15 + b], [40, 18 + b], [34, 17 + b]], COAT[3]);
  back.set(41, 15 + b, HOOF);
  back.poly([[31, 12 + b], [28, 9 + b], [32, 10 + b]], COAT[1]);
  back.set(36, 13 + b, GLOW[3]);
  // Saddle blanket with gold trim and a little lantern hung at the front.
  back.poly([[13, 23 + b], [24, 23 + b], [25, 30 + b], [12, 30 + b]], BLANKET[2]);
  back.rect(12, 30 + b, 14, 1, TRIM[2]);
  back.rect(13, 23 + b, 11, 1, BLANKET[3]);
  embers(back, [[8, 25, 2], [11, 23, 3], [9, 29, 1], [27, 25, 2], [29, 28, 1], [17, 33, 1]], b);
  back.outline(OUTLINE);

  const front = new PixelCanvas(MOUNT_W, MOUNT_H);
  leg(front, 28, 32 + b, L.nf[0], L.nf[1], COAT, true);
  leg(front, 10, 31 + b, L.nh[0], L.nh[1], COAT, false);
  antler(front, [[34, 11 + b], [33, 5 + b], [30, 1 + b]], [[[33, 7 + b], [37, 3 + b]], [[33, 5 + b], [35, 1 + b]], [[31, 3 + b], [28, 2 + b]]], false);
  // Rider's near leg down the flank.
  if (rider) {
    front.thickLine(19, 27 + b, 20, 32 + b, 2, rc.pants);
    front.rect(19, 32 + b, 3, 2, rc.boots);
  }
  front.rect(25, 29 + b, 2, 3, TRIM[1]);
  front.set(25, 30 + b, GLOW[4]);
  front.set(26, 30 + b, GLOW[3]);
  front.outline(OUTLINE);

  const pc = new PixelCanvas(MOUNT_W, MOUNT_H);
  pc.blit(back, 0, 0);
  if (rider) pc.blit(rider, 7, b);
  pc.blit(front, 0, 0);
  return pc;
}

// ------------------------------------------------------------------ front (facing the camera)

function paintFront(f, rider, rc) {
  const b = BOB[f], [la, ra] = LIFT[f];
  const back = new PixelCanvas(MOUNT_W, MOUNT_H);
  // Hind legs peeking out behind, the back and blanket the rider sits on.
  leg(back, 16, 33 + b, 0, ra, FAR, false);
  leg(back, 28, 33 + b, 0, la, FAR, false);
  back.shadedEllipse(22, 27 + b, 9, 5, COAT);
  back.poly([[13, 24 + b], [31, 24 + b], [32, 29 + b], [12, 29 + b]], BLANKET[2]);
  back.rect(12, 29 + b, 21, 1, TRIM[2]);
  back.outline(OUTLINE);

  const front = new PixelCanvas(MOUNT_W, MOUNT_H);
  // Rider's legs either side of the chest.
  if (rider) for (const x of [11, 31]) { front.rect(x, 27 + b, 2, 4, rc.pants); front.rect(x, 31 + b, 2, 2, rc.boots); }
  leg(front, 19, 34 + b, 0, la, COAT, true);
  leg(front, 25, 34 + b, 0, ra, COAT, true);
  front.shadedEllipse(22, 32 + b, 7, 5.5, COAT);
  front.ellipse(22, 31 + b, 3.2, 3.2, CREAM[2]);
  // Antlers sweep out to the sides, framing the rider.
  antler(front, [[19, 25 + b], [14, 21 + b], [9, 14 + b]], [[[14, 21 + b], [9, 20 + b]], [[12, 18 + b], [13, 13 + b]]], false);
  antler(front, [[25, 25 + b], [30, 21 + b], [35, 14 + b]], [[[30, 21 + b], [35, 20 + b]], [[32, 18 + b], [31, 13 + b]]], false);
  front.poly([[17, 25 + b], [15, 23 + b], [18, 24 + b]], COAT[1]);
  front.poly([[27, 25 + b], [29, 23 + b], [26, 24 + b]], COAT[1]);
  front.shadedEllipse(22, 27 + b, 3.6, 3, COAT);
  front.ellipse(22, 30.5 + b, 2.4, 2, BELLY[2]);
  front.rect(21, 31 + b, 2, 1, HOOF);
  front.set(20, 27 + b, GLOW[3]);
  front.set(24, 27 + b, GLOW[3]);
  embers(front, [[17, 31, 2], [27, 30, 2], [19, 35, 1], [26, 35, 1]], b);
  front.outline(OUTLINE);

  const pc = new PixelCanvas(MOUNT_W, MOUNT_H);
  pc.blit(back, 0, 0);
  if (rider) pc.blit(rider, 10, b - 1);
  pc.blit(front, 0, 0);
  return pc;
}

// ------------------------------------------------------------------ back (riding away)

function paintBack(f, rider, rc) {
  const b = BOB[f], [la, ra] = LIFT[f];
  const back = new PixelCanvas(MOUNT_W, MOUNT_H);
  // Head and antlers beyond the rider.
  back.shadedEllipse(22, 20 + b, 3.2, 3.4, FAR);
  back.poly([[18, 19 + b], [15, 17 + b], [19, 18 + b]], FAR[1]);
  back.poly([[26, 19 + b], [29, 17 + b], [25, 18 + b]], FAR[1]);
  antler(back, [[20, 18 + b], [15, 13 + b], [11, 6 + b]], [[[15, 13 + b], [10, 12 + b]], [[13, 10 + b], [15, 5 + b]]], true);
  antler(back, [[24, 18 + b], [29, 13 + b], [33, 6 + b]], [[[29, 13 + b], [34, 12 + b]], [[31, 10 + b], [29, 5 + b]]], true);
  back.shadedEllipse(22, 25 + b, 6, 3.5, COAT);
  back.outline(OUTLINE);

  const front = new PixelCanvas(MOUNT_W, MOUNT_H);
  if (rider) for (const x of [12, 30]) { front.rect(x, 26 + b, 2, 4, rc.pants); front.rect(x, 30 + b, 2, 2, rc.boots); }
  leg(front, 18, 34 + b, 0, la, COAT, false);
  leg(front, 26, 34 + b, 0, ra, COAT, false);
  front.poly([[13, 24 + b], [31, 24 + b], [32, 29 + b], [12, 29 + b]], BLANKET[2]);
  front.rect(12, 29 + b, 21, 1, TRIM[2]);
  front.shadedEllipse(22, 32 + b, 8.5, 5.5, COAT);
  front.ellipse(22, 27.5 + b, 2, 2.2, CREAM[3]);
  front.ellipse(22, 29.5 + b, 1.4, 1.4, CREAM[2]);
  embers(front, [[16, 31, 2], [28, 30, 3], [19, 34, 1], [25, 35, 2], [14, 33, 1]], b);
  front.outline(OUTLINE);

  const pc = new PixelCanvas(MOUNT_W, MOUNT_H);
  pc.blit(back, 0, 0);
  if (rider) pc.blit(rider, 10, b - 1);
  pc.blit(front, 0, 0);
  return pc;
}

// ------------------------------------------------------------------ sheet

const cache = new Map();

/**
 * The Emberhart carrying `riderLook` (null: riderless): { canvas, texture, glow, w, h,
 * frame(dir, i) and fieldFrame(dir, i) -> uv rect, walkSeq, stride }. Cached per rider look.
 * `fieldFrame`/`walkSeq`/`stride` let world/Actor.js treat it like a character sheet.
 * @param {any} riderLook
 */
export function getMountSheet(riderLook) {
  const key = riderLook ? riderLook.id || JSON.stringify(riderLook) : '(none)';
  if (cache.has(key)) return cache.get(key);
  const riderSheet = riderLook ? getCharacterSheet(riderLook).canvas : null;
  const rc = riderSheet ? riderColors(riderSheet) : null;
  const rows = riderLook?.build === 'child' ? 27 : 25;
  const sheet = new PixelCanvas(SHEET_W, SHEET_H);
  FIELD_DIRS.forEach((dir, row) => {
    const rider = riderSheet ? riderCrop(riderSheet, dir === 'left' ? 'right' : dir, rows) : null;
    for (let f = 0; f < MOUNT_FRAMES; f++) {
      let pc;
      if (dir === 'down') pc = paintFront(f, rider, rc);
      else if (dir === 'up') pc = paintBack(f, rider, rc);
      else pc = paintSide(f, rider, rc);
      sheet.blit(pc, f * MOUNT_W, row * MOUNT_H, { flipX: dir === 'left' });
    }
  });
  const glow = new PixelCanvas(SHEET_W, SHEET_H);
  for (let i = 0; i < sheet.data.length; i++) if (GLOWSET.has(sheet.data[i])) glow.data[i] = hex('#ffffff');

  const tex = (cv) => {
    const t = new THREE.CanvasTexture(cv);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const canvas = sheet.toCanvas();
  const frame = (dir, i) => {
    const x = i * MOUNT_W, y = FIELD_DIRS.indexOf(dir) * MOUNT_H;
    return { u0: x / SHEET_W, v0: 1 - (y + MOUNT_H) / SHEET_H, u1: (x + MOUNT_W) / SHEET_W, v1: 1 - y / SHEET_H };
  };
  const entry = {
    canvas,
    texture: tex(canvas),
    glow: tex(glow.toCanvas()),
    w: MOUNT_W,
    h: MOUNT_H,
    frame,
    fieldFrame: frame,
    walkSeq: [1, 2, 3, 4],
    stride: 0.95, // tiles per gallop frame
  };
  cache.set(key, entry);
  return entry;
}
