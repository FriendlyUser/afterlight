// Procedural monster sprites for battle. Each archetype painter draws a
// creature facing RIGHT (enemies stand on the left of the battlefield).
// Descriptor: { type, color, accent, eye, size, seed, ... }

import * as THREE from 'three';
import { PixelCanvas, hex, ramp, shade } from './PixelCanvas.js';
import { RNG } from '../core/util.js';
import { getCharacterSheet, BATTLE_W, BATTLE_H } from './SpriteFactory.js';
import { LOOKS } from '../data/looks.js';

const OUT = hex('#160f1c');

function eye(pc, x, y, color = '#ffe060', r = 1) {
  if (r <= 1) {
    pc.set(x, y, hex('#1a1020'));
    pc.set(x + 1, y, hex(color));
    pc.set(x, y - 1, hex(color));
    pc.set(x + 1, y - 1, hex('#ffffff'));
  } else {
    pc.ellipse(x, y, r, r, hex(color));
    pc.ellipse(x + r * 0.3, y, r * 0.45, r * 0.6, hex('#1a1020'));
    pc.set(Math.round(x - r * 0.3), Math.round(y - r * 0.4), hex('#ffffff'));
  }
}

function legs(pc, xs, top, bottom, R, w = 2) {
  for (const x of xs) pc.rect(x, top, w, bottom - top, R[1]);
}

// Each painter: (pc, P, rng, W, H) where P = { body, accent, dark, eye } ramps/colors.
const ARCHETYPES = {
  slime(pc, P, rng, W, H) {
    const cx = W / 2, by = H - 3;
    pc.shadedEllipse(cx, by - H * 0.25, W * 0.4, H * 0.28, P.body);
    pc.rect(Math.round(cx - W * 0.38), Math.round(by - H * 0.12), Math.round(W * 0.76), Math.round(H * 0.12), P.body[1]);
    for (let i = 0; i < 3; i++) pc.ellipse(cx - W * 0.25 + i * W * 0.25, by, 2, 1.5, P.body[1]);
    pc.ellipse(cx - W * 0.12, by - H * 0.42, W * 0.08, H * 0.06, P.body[4]);
    eye(pc, Math.round(cx + W * 0.08), Math.round(by - H * 0.28), P.eye);
    eye(pc, Math.round(cx + W * 0.24), Math.round(by - H * 0.28), P.eye);
  },
  hound(pc, P, rng, W, H) {
    const by = H - 2;
    const R = P.body;
    legs(pc, [Math.round(W * 0.22), Math.round(W * 0.32)], Math.round(H * 0.6), by, R, 3);
    legs(pc, [Math.round(W * 0.62), Math.round(W * 0.72)], Math.round(H * 0.6), by, R, 3);
    pc.shadedEllipse(W * 0.47, H * 0.55, W * 0.32, H * 0.16, R);
    // tail
    pc.thickLine(Math.round(W * 0.16), Math.round(H * 0.5), Math.round(W * 0.04), Math.round(H * 0.36), 2, R[2]);
    // head
    pc.shadedEllipse(W * 0.8, H * 0.42, W * 0.14, H * 0.12, R);
    pc.poly([[W * 0.86, H * 0.42], [W * 0.99, H * 0.47], [W * 0.86, H * 0.53]], R[2]);
    pc.poly([[W * 0.72, H * 0.33], [W * 0.76, H * 0.2], [W * 0.8, H * 0.33]], R[1]);
    eye(pc, Math.round(W * 0.84), Math.round(H * 0.4), P.eye);
    pc.line(Math.round(W * 0.88), Math.round(H * 0.5), Math.round(W * 0.97), Math.round(H * 0.49), hex('#f0f0f0'));
    // mane accent
    for (let i = 0; i < 5; i++) pc.set(Math.round(W * (0.55 + i * 0.04)), Math.round(H * 0.4), P.accent[3]);
  },
  boar(pc, P, rng, W, H) {
    ARCHETYPES.hound(pc, P, rng, W, H);
    pc.shadedEllipse(W * 0.48, H * 0.52, W * 0.36, H * 0.22, P.body);
    pc.line(Math.round(W * 0.9), Math.round(H * 0.5), Math.round(W * 0.95), Math.round(H * 0.38), hex('#f0ead8'));
    for (let i = 0; i < 6; i++) pc.set(Math.round(W * (0.3 + i * 0.07)), Math.round(H * 0.32), P.accent[2]);
  },
  bird(pc, P, rng, W, H) {
    const cx = W * 0.5, cy = H * 0.45;
    pc.poly([[cx - W * 0.1, cy], [cx - W * 0.42, cy - H * 0.32], [cx - W * 0.3, cy + H * 0.05]], P.accent[2]);
    pc.shadedEllipse(cx, cy, W * 0.22, H * 0.16, P.body);
    pc.shadedEllipse(cx + W * 0.2, cy - H * 0.12, W * 0.1, H * 0.1, P.body);
    pc.poly([[cx + W * 0.28, cy - H * 0.14], [cx + W * 0.42, cy - H * 0.08], [cx + W * 0.28, cy - H * 0.06]], hex('#f0b040'));
    eye(pc, Math.round(cx + W * 0.22), Math.round(cy - H * 0.13), P.eye);
    pc.poly([[cx - W * 0.05, cy - H * 0.02], [cx - W * 0.2, cy - H * 0.4], [cx + W * 0.1, cy - H * 0.05]], P.accent[3]);
    pc.thickLine(Math.round(cx), Math.round(cy + H * 0.14), Math.round(cx), Math.round(H * 0.85), 1, hex('#d09030'));
    pc.poly([[cx - W * 0.2, cy + H * 0.05], [cx - W * 0.4, cy + H * 0.15], [cx - W * 0.25, cy + H * 0.12]], P.body[1]);
  },
  bat(pc, P, rng, W, H) {
    const cx = W * 0.5, cy = H * 0.45;
    const R = P.body;
    for (const s of [-1, 1]) {
      pc.poly([[cx, cy], [cx + s * W * 0.45, cy - H * 0.25], [cx + s * W * 0.38, cy + H * 0.05], [cx + s * W * 0.25, cy - H * 0.02], [cx + s * W * 0.15, cy + H * 0.1]], R[1]);
    }
    pc.shadedEllipse(cx, cy, W * 0.12, H * 0.14, R);
    pc.poly([[cx - W * 0.08, cy - H * 0.1], [cx - W * 0.05, cy - H * 0.24], [cx, cy - H * 0.1]], R[2]);
    pc.poly([[cx + W * 0.08, cy - H * 0.1], [cx + W * 0.05, cy - H * 0.24], [cx, cy - H * 0.1]], R[2]);
    eye(pc, Math.round(cx + 1), Math.round(cy - 1), P.eye);
    eye(pc, Math.round(cx + 4), Math.round(cy - 1), P.eye);
  },
  crab(pc, P, rng, W, H) {
    const cx = W * 0.5, by = H - 3;
    const R = P.body;
    for (let i = 0; i < 3; i++) {
      pc.thickLine(Math.round(cx - W * 0.1 - i * 3), Math.round(by - H * 0.2), Math.round(cx - W * 0.3 - i * 3), by, 1, R[1]);
      pc.thickLine(Math.round(cx + W * 0.1 + i * 3), Math.round(by - H * 0.2), Math.round(cx + W * 0.3 + i * 3), by, 1, R[1]);
    }
    pc.shadedEllipse(cx, by - H * 0.25, W * 0.3, H * 0.16, R);
    pc.shadedEllipse(cx + W * 0.36, by - H * 0.42, W * 0.12, H * 0.1, R);
    pc.poly([[cx + W * 0.36, by - H * 0.42], [cx + W * 0.5, by - H * 0.5], [cx + W * 0.46, by - H * 0.38]], OUT);
    pc.thickLine(Math.round(cx + W * 0.25), Math.round(by - H * 0.3), Math.round(cx + W * 0.32), Math.round(by - H * 0.38), 2, R[2]);
    pc.line(Math.round(cx + W * 0.05), Math.round(by - H * 0.4), Math.round(cx + W * 0.05), Math.round(by - H * 0.5), R[0]);
    pc.line(Math.round(cx + W * 0.15), Math.round(by - H * 0.4), Math.round(cx + W * 0.15), Math.round(by - H * 0.5), R[0]);
    eye(pc, Math.round(cx + W * 0.05), Math.round(by - H * 0.52), P.eye);
    eye(pc, Math.round(cx + W * 0.15), Math.round(by - H * 0.52), P.eye);
  },
  serpent(pc, P, rng, W, H) {
    const R = P.body;
    const pts = [];
    for (let t = 0; t <= 1; t += 0.02) pts.push([W * (0.1 + t * 0.6), H * (0.85 - t * 0.5) + Math.sin(t * 9) * H * 0.08]);
    pts.forEach(([x, y], i) => pc.shadedEllipse(x, y, W * 0.07 + (i / pts.length) * W * 0.03, W * 0.07 + (i / pts.length) * W * 0.03, R));
    const [hx, hy] = pts[pts.length - 1];
    pc.shadedEllipse(hx + W * 0.08, hy - H * 0.04, W * 0.14, H * 0.09, R);
    pc.poly([[hx + W * 0.1, hy], [hx + W * 0.28, hy + H * 0.02], [hx + W * 0.12, hy + H * 0.06]], R[1]);
    eye(pc, Math.round(hx + W * 0.12), Math.round(hy - H * 0.07), P.eye);
    for (let i = 0; i < 6; i++) pc.poly([[hx - W * 0.04 - i * 4, hy - H * 0.1], [hx - W * 0.01 - i * 4, hy - H * 0.2], [hx + W * 0.01 - i * 4, hy - H * 0.1]], P.accent[3]);
  },
  insect(pc, P, rng, W, H) {
    const cx = W * 0.5, by = H - 3;
    const R = P.body;
    for (let i = 0; i < 3; i++) pc.thickLine(Math.round(cx - W * 0.15 + i * W * 0.15), Math.round(by - H * 0.2), Math.round(cx - W * 0.22 + i * W * 0.18), by, 1, R[0]);
    pc.shadedEllipse(cx - W * 0.1, by - H * 0.28, W * 0.3, H * 0.18, R);
    pc.line(Math.round(cx - W * 0.1), Math.round(by - H * 0.45), Math.round(cx - W * 0.1), Math.round(by - H * 0.12), R[0]);
    pc.shadedEllipse(cx + W * 0.26, by - H * 0.28, W * 0.12, H * 0.11, P.accent);
    pc.line(Math.round(cx + W * 0.3), Math.round(by - H * 0.36), Math.round(cx + W * 0.42), Math.round(by - H * 0.55), R[1]);
    eye(pc, Math.round(cx + W * 0.3), Math.round(by - H * 0.3), P.eye);
    if (rng.chance(0.5)) pc.poly([[cx + W * 0.36, by - H * 0.24], [cx + W * 0.48, by - H * 0.2], [cx + W * 0.36, by - H * 0.18]], R[3]);
  },
  spider(pc, P, rng, W, H) {
    const cx = W * 0.5, cy = H * 0.6;
    const R = P.body;
    for (let i = 0; i < 4; i++) {
      for (const s of [-1, 1]) {
        const kx = cx + s * W * (0.2 + i * 0.05), ky = cy - H * 0.2;
        pc.line(Math.round(cx + s * W * 0.05), Math.round(cy), Math.round(kx), Math.round(ky), R[1]);
        pc.line(Math.round(kx), Math.round(ky), Math.round(kx + s * W * 0.08), Math.round(H - 3), R[1]);
      }
    }
    pc.shadedEllipse(cx - W * 0.12, cy - H * 0.02, W * 0.2, H * 0.16, R);
    pc.shadedEllipse(cx + W * 0.12, cy, W * 0.11, H * 0.1, R);
    for (let i = 0; i < 3; i++) eye(pc, Math.round(cx + W * 0.12 + i * 2), Math.round(cy - 2 + (i % 2)), P.eye);
    pc.ellipse(cx - W * 0.14, cy - H * 0.06, W * 0.06, H * 0.05, P.accent[3]);
  },
  plant(pc, P, rng, W, H) {
    const cx = W * 0.5, by = H - 2;
    const leaf = ramp('#4a8a3a');
    pc.thickLine(Math.round(cx), by, Math.round(cx + W * 0.05), Math.round(H * 0.45), 3, leaf[1]);
    for (const s of [-1, 1]) pc.poly([[cx, by - H * 0.2], [cx + s * W * 0.35, by - H * 0.35], [cx + s * W * 0.1, by - H * 0.1]], leaf[2]);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pc.shadedEllipse(cx + W * 0.05 + Math.cos(a) * W * 0.16, H * 0.38 + Math.sin(a) * H * 0.14, W * 0.1, H * 0.08, P.body);
    }
    pc.shadedEllipse(cx + W * 0.05, H * 0.38, W * 0.12, H * 0.1, P.accent);
    pc.poly([[cx + W * 0.02, H * 0.38], [cx + W * 0.16, H * 0.33], [cx + W * 0.16, H * 0.43]], OUT);
    for (let i = 0; i < 3; i++) pc.set(Math.round(cx + W * 0.07 + i * 2), Math.round(H * 0.36), hex('#ffffff'));
  },
  mushroom(pc, P, rng, W, H) {
    const cx = W * 0.5, by = H - 2;
    pc.shadedRect(Math.round(cx - W * 0.12), Math.round(H * 0.45), Math.round(W * 0.24), Math.round(by - H * 0.45), ramp('#e8dcc8'));
    pc.shadedEllipse(cx, H * 0.4, W * 0.4, H * 0.22, P.body);
    for (let i = 0; i < 5; i++) pc.ellipse(cx - W * 0.25 + rng.range(0, W * 0.5), H * 0.32 + rng.range(-3, 3), 2, 1.5, P.accent[4]);
    eye(pc, Math.round(cx + W * 0.02), Math.round(H * 0.6), P.eye);
    eye(pc, Math.round(cx + W * 0.1), Math.round(H * 0.6), P.eye);
    legs(pc, [Math.round(cx - W * 0.1), Math.round(cx + W * 0.06)], by - 3, by, ramp('#c8b8a0'));
  },
  golem(pc, P, rng, W, H) {
    const R = P.body;
    const by = H - 2;
    pc.shadedRect(Math.round(W * 0.28), Math.round(H * 0.68), Math.round(W * 0.14), by - Math.round(H * 0.68), R);
    pc.shadedRect(Math.round(W * 0.56), Math.round(H * 0.68), Math.round(W * 0.14), by - Math.round(H * 0.68), R);
    pc.shadedEllipse(W * 0.5, H * 0.5, W * 0.3, H * 0.24, R);
    pc.shadedEllipse(W * 0.22, H * 0.52, W * 0.11, H * 0.2, R);
    pc.shadedEllipse(W * 0.8, H * 0.55, W * 0.12, H * 0.22, R);
    pc.shadedEllipse(W * 0.55, H * 0.22, W * 0.14, H * 0.11, R);
    pc.rect(Math.round(W * 0.58), Math.round(H * 0.2), Math.round(W * 0.1), 2, hex(P.eyeHex || '#ffe060'));
    for (let i = 0; i < 6; i++) pc.over(Math.round(W * rng.range(0.25, 0.75)), Math.round(H * rng.range(0.35, 0.65)), R[0]);
    pc.over(Math.round(W * 0.5), Math.round(H * 0.5), P.accent[4]);
    pc.ellipse(W * 0.5, H * 0.5, 2, 2, P.accent[3]);
  },
  wisp(pc, P, rng, W, H) {
    const cx = W * 0.5, cy = H * 0.5;
    for (let i = 0; i < 6; i++) pc.ellipse(cx - W * 0.05 - i * 2, cy + H * 0.05 + i * 2, W * (0.18 - i * 0.025), H * (0.18 - i * 0.025), P.body[Math.max(0, 3 - i)]);
    pc.poly([[cx - W * 0.15, cy], [cx, cy - H * 0.42], [cx + W * 0.15, cy]], P.body[3]);
    pc.shadedEllipse(cx, cy, W * 0.2, H * 0.2, P.body);
    pc.ellipse(cx, cy, W * 0.1, H * 0.1, P.body[4]);
    eye(pc, Math.round(cx + 1), Math.round(cy), '#1a1020');
    eye(pc, Math.round(cx + 5), Math.round(cy), '#1a1020');
  },
  ghost(pc, P, rng, W, H) {
    const cx = W * 0.5;
    const R = P.body;
    pc.shadedEllipse(cx, H * 0.38, W * 0.26, H * 0.25, R);
    pc.rect(Math.round(cx - W * 0.26), Math.round(H * 0.38), Math.round(W * 0.52), Math.round(H * 0.3), R[2]);
    for (let i = 0; i < 4; i++) pc.poly([[cx - W * 0.26 + i * W * 0.13, H * 0.68], [cx - W * 0.2 + i * W * 0.13, H * 0.82], [cx - W * 0.13 + i * W * 0.13, H * 0.68]], R[1]);
    pc.ellipse(cx + W * 0.06, H * 0.36, 2, 3, OUT);
    pc.ellipse(cx + W * 0.16, H * 0.36, 2, 3, OUT);
    pc.ellipse(cx + W * 0.12, H * 0.5, 2, 2, OUT);
    pc.thickLine(Math.round(cx + W * 0.2), Math.round(H * 0.45), Math.round(cx + W * 0.4), Math.round(H * 0.55), 2, R[2]);
  },
  skeleton(pc, P, rng, W, H) {
    const bone = ramp('#e8e0cc');
    const cx = W * 0.5, by = H - 2;
    pc.shadedEllipse(cx + W * 0.04, H * 0.22, W * 0.12, H * 0.12, bone);
    pc.rect(Math.round(cx + W * 0.04), Math.round(H * 0.2), 2, 2, OUT);
    pc.rect(Math.round(cx + W * 0.1), Math.round(H * 0.2), 2, 2, OUT);
    pc.line(Math.round(cx), Math.round(H * 0.34), Math.round(cx), Math.round(H * 0.62), bone[2]);
    for (let i = 0; i < 4; i++) pc.line(Math.round(cx - W * 0.1), Math.round(H * 0.38 + i * 3), Math.round(cx + W * 0.1), Math.round(H * 0.38 + i * 3), bone[3]);
    pc.line(Math.round(cx), Math.round(H * 0.62), Math.round(cx - W * 0.1), by, bone[2]);
    pc.line(Math.round(cx), Math.round(H * 0.62), Math.round(cx + W * 0.08), by, bone[2]);
    pc.line(Math.round(cx), Math.round(H * 0.38), Math.round(cx + W * 0.22), Math.round(H * 0.5), bone[2]);
    pc.thickLine(Math.round(cx + W * 0.22), Math.round(H * 0.5), Math.round(cx + W * 0.42), Math.round(H * 0.2), 2, P.accent[3]);
    pc.set(Math.round(cx + W * 0.08), Math.round(H * 0.2), hex(P.eyeHex || '#ff5040'));
  },
  eye(pc, P, rng, W, H) {
    const cx = W * 0.5, cy = H * 0.45;
    for (let i = 0; i < 5; i++) {
      const a = Math.PI * (0.2 + i * 0.15);
      pc.thickLine(Math.round(cx), Math.round(cy), Math.round(cx - Math.cos(a) * W * 0.4), Math.round(cy + Math.sin(a) * H * 0.45), 2, P.accent[1 + (i % 3)]);
    }
    pc.shadedEllipse(cx, cy, W * 0.28, H * 0.28, P.body);
    pc.ellipse(cx + W * 0.06, cy, W * 0.14, H * 0.14, hex('#f8f0e8'));
    pc.ellipse(cx + W * 0.1, cy, W * 0.07, H * 0.09, hex(P.eyeHex || '#c02040'));
    pc.ellipse(cx + W * 0.11, cy, W * 0.03, H * 0.05, OUT);
    pc.set(Math.round(cx + W * 0.05), Math.round(cy - H * 0.05), hex('#ffffff'));
  },
  treant(pc, P, rng, W, H) {
    const bark = ramp('#6a4a32');
    const by = H - 2;
    pc.shadedRect(Math.round(W * 0.35), Math.round(H * 0.35), Math.round(W * 0.3), by - Math.round(H * 0.35), bark);
    for (const dx of [-0.2, 0, 0.2]) pc.thickLine(Math.round(W * 0.5), by - 4, Math.round(W * (0.5 + dx * 1.6)), by, 2, bark[1]);
    for (let i = 0; i < 8; i++) {
      const a = rng.range(Math.PI, Math.PI * 2);
      pc.shadedEllipse(W * 0.5 + Math.cos(a) * W * 0.28, H * 0.3 + Math.sin(a) * H * 0.2, W * 0.16, H * 0.12, P.body);
    }
    pc.thickLine(Math.round(W * 0.62), Math.round(H * 0.5), Math.round(W * 0.9), Math.round(H * 0.4), 3, bark[2]);
    pc.rect(Math.round(W * 0.5), Math.round(H * 0.45), 3, 2, hex(P.eyeHex || '#ffe060'));
    pc.rect(Math.round(W * 0.58), Math.round(H * 0.45), 3, 2, hex(P.eyeHex || '#ffe060'));
    pc.rect(Math.round(W * 0.5), Math.round(H * 0.55), Math.round(W * 0.12), 2, OUT);
  },
  elemental(pc, P, rng, W, H) {
    const cx = W * 0.5, cy = H * 0.48;
    const R = P.body;
    // orbiting shards
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + 0.3;
      const x = cx + Math.cos(a) * W * 0.32, y = cy + Math.sin(a) * H * 0.3;
      pc.poly([[x, y - H * 0.1], [x + W * 0.05, y], [x, y + H * 0.08], [x - W * 0.05, y]], R[1 + (i % 4)]);
    }
    // body: stacked crystal
    pc.poly([[cx, cy - H * 0.36], [cx + W * 0.16, cy - H * 0.05], [cx + W * 0.1, cy + H * 0.3], [cx - W * 0.1, cy + H * 0.3], [cx - W * 0.16, cy - H * 0.05]], R[2]);
    pc.poly([[cx, cy - H * 0.36], [cx - W * 0.16, cy - H * 0.05], [cx - W * 0.1, cy + H * 0.3], [cx - W * 0.02, cy + H * 0.3]], R[4]);
    pc.poly([[cx, cy - H * 0.36], [cx + W * 0.16, cy - H * 0.05], [cx + W * 0.1, cy + H * 0.3], [cx + W * 0.05, cy + H * 0.3]], R[1]);
    pc.ellipse(cx, cy - H * 0.02, W * 0.06, H * 0.07, hex('#ffffff'));
    pc.ellipse(cx + 1, cy - H * 0.02, W * 0.025, H * 0.04, hex(P.eyeHex || '#202040'));
  },
  horror(pc, P, rng, W, H) {
    const cx = W * 0.5, cy = H * 0.52;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + rng.range(-0.2, 0.2);
      const len = rng.range(0.32, 0.48);
      const steps = 16;
      for (let k = 0; k < steps; k++) {
        const t = k / steps;
        const wob = Math.sin(t * 6 + i) * 0.35;
        const x = cx + Math.cos(a + wob) * W * len * t;
        const y = cy + Math.sin(a + wob) * H * len * t;
        const r = Math.max(1, 3.4 * (1 - t));
        pc.ellipse(x, y, r, r, P.body[k % 3 === 0 ? 1 : 2]);
      }
    }
    pc.shadedEllipse(cx, cy, W * 0.24, H * 0.22, P.body);
    eye(pc, Math.round(cx + W * 0.04), Math.round(cy), P.eye, Math.max(2, Math.round(W * 0.08)));
    for (let i = 0; i < 4; i++) eye(pc, Math.round(cx + rng.range(-W * 0.16, W * 0.14)), Math.round(cy + rng.range(-H * 0.14, H * 0.14)), P.eye);
  },
  drake(pc, P, rng, W, H) {
    const R = P.body;
    const by = H - 2;
    // wing
    pc.poly([[W * 0.45, H * 0.4], [W * 0.2, H * 0.05], [W * 0.1, H * 0.35], [W * 0.3, H * 0.5]], P.accent[1]);
    for (let i = 0; i < 3; i++) pc.line(Math.round(W * 0.45), Math.round(H * 0.4), Math.round(W * (0.15 + i * 0.05)), Math.round(H * (0.1 + i * 0.1)), P.accent[0]);
    legs(pc, [Math.round(W * 0.3), Math.round(W * 0.58)], Math.round(H * 0.6), by, R, 4);
    pc.shadedEllipse(W * 0.45, H * 0.56, W * 0.26, H * 0.16, R);
    pc.thickLine(Math.round(W * 0.2), Math.round(H * 0.6), Math.round(W * 0.02), Math.round(H * 0.82), 3, R[1]);
    pc.thickLine(Math.round(W * 0.62), Math.round(H * 0.5), Math.round(W * 0.74), Math.round(H * 0.3), 4, R[2]);
    pc.shadedEllipse(W * 0.8, H * 0.27, W * 0.12, H * 0.09, R);
    pc.poly([[W * 0.84, H * 0.25], [W * 0.98, H * 0.3], [W * 0.84, H * 0.34]], R[2]);
    pc.poly([[W * 0.76, H * 0.2], [W * 0.7, H * 0.06], [W * 0.8, H * 0.18]], hex('#e8dcc8'));
    eye(pc, Math.round(W * 0.84), Math.round(H * 0.24), P.eye);
    for (let i = 0; i < 6; i++) pc.set(Math.round(W * (0.3 + i * 0.05)), Math.round(H * 0.44), P.accent[3]);
  },
  angler(pc, P, rng, W, H) {
    // A deep-water angler facing right: round body, tail fin, a jaw full of teeth,
    // and the lure that lights its way.
    const R = P.body, A = P.accent;
    const cx = W * 0.45, cy = H * 0.58;
    pc.poly([[W * 0.08, cy - H * 0.16], [W * 0.22, cy], [W * 0.08, cy + H * 0.16]], R[1]); // tail
    pc.shadedEllipse(Math.round(cx), Math.round(cy), Math.round(W * 0.3), Math.round(H * 0.26), R);
    pc.poly([[cx - W * 0.05, cy - H * 0.24], [cx + W * 0.12, cy - H * 0.36], [cx + W * 0.1, cy - H * 0.2]], R[0]); // dorsal fin
    pc.poly([[cx + W * 0.14, cy + H * 0.02], [cx + W * 0.36, cy - H * 0.04], [cx + W * 0.34, cy + H * 0.18], [cx + W * 0.12, cy + H * 0.16]], hex('#2a0c14')); // open jaw
    for (let i = 0; i < 5; i++) {
      const x = cx + W * (0.16 + i * 0.04);
      pc.poly([[x, cy + H * 0.0], [x + W * 0.015, cy + H * 0.06], [x + W * 0.03, cy + H * 0.0]], hex('#f4ecd8'));
      pc.poly([[x, cy + H * 0.16], [x + W * 0.015, cy + H * 0.1], [x + W * 0.03, cy + H * 0.16]], hex('#f4ecd8'));
    }
    eye(pc, Math.round(cx + W * 0.1), Math.round(cy - H * 0.1), P.eyeHex || '#ffe060', Math.max(1, Math.round(W * 0.03)));
    pc.thickLine(Math.round(cx + W * 0.04), Math.round(cy - H * 0.24), Math.round(cx + W * 0.3), Math.round(cy - H * 0.44), 1, R[0]); // stalk
    pc.shadedEllipse(Math.round(cx + W * 0.32), Math.round(cy - H * 0.44), Math.max(2, Math.round(W * 0.045)), Math.max(2, Math.round(W * 0.045)), ramp(P.accentHex || '#c8ffe0'));
    pc.set(Math.round(cx + W * 0.31), Math.round(cy - H * 0.46), hex('#ffffff'));
  },
  orrery(pc, P, rng, W, H) {
    // A brass orrery that woke up: tilted orbit rings, planets on them, an eyed sun.
    const R = P.body, A = P.accent;
    const cx = W * 0.5, cy = H * 0.46;
    const ring = (rx, ry, c) => { for (let a = 0; a < Math.PI * 2; a += 0.02) pc.set(Math.round(cx + Math.cos(a) * rx), Math.round(cy + Math.sin(a) * ry), c); };
    pc.thickLine(Math.round(cx), Math.round(cy), Math.round(cx), Math.round(H * 0.92), 2, R[0]); // stand
    pc.shadedRect(Math.round(cx - W * 0.14), Math.round(H * 0.9), Math.round(W * 0.28), Math.round(H * 0.06), R);
    const orbits = [[0.44, 0.26], [0.32, 0.19], [0.21, 0.13]];
    orbits.forEach(([rx, ry], i) => ring(W * rx, H * ry, R[3 - i]));
    pc.shadedEllipse(Math.round(cx), Math.round(cy), Math.round(W * 0.14), Math.round(W * 0.14), A); // sun
    eye(pc, Math.round(cx + 1), Math.round(cy), P.eyeHex || '#402010', Math.max(2, Math.round(W * 0.05)));
    orbits.forEach(([rx, ry], i) => {
      const a = rng.next() * Math.PI * 2;
      pc.shadedEllipse(Math.round(cx + Math.cos(a) * W * rx), Math.round(cy + Math.sin(a) * H * ry), Math.max(2, Math.round(W * (0.06 - i * 0.012))), Math.max(2, Math.round(W * (0.06 - i * 0.012))), ramp(['#7aa0d0', '#d07a5a', '#a0d080'][i]));
    });
  },
  storm(pc, P, rng, W, H) {
    // A thundercloud with a temper: billowing puffs, one lit eye, forks of lightning.
    const R = P.body;
    const cx = W * 0.5, cy = H * 0.4;
    const bolt = hex(P.accentHex || '#f0f080');
    for (let i = 0; i < 3; i++) {
      let x = cx + (i - 1) * W * 0.18, y = cy + H * 0.16;
      for (let k = 0; k < 4; k++) {
        const nx = x + (rng.next() - 0.5) * W * 0.12, ny = y + H * 0.08;
        pc.thickLine(Math.round(x), Math.round(y), Math.round(nx), Math.round(ny), 2, bolt);
        x = nx; y = ny;
      }
    }
    const puffs = [[-0.28, 0.06, 0.16], [0.28, 0.06, 0.16], [-0.14, -0.06, 0.2], [0.14, -0.08, 0.2], [0, -0.16, 0.22], [0, 0.08, 0.24]];
    for (const [dx, dy, r] of puffs) pc.shadedEllipse(Math.round(cx + dx * W), Math.round(cy + dy * H), Math.round(r * W), Math.round(r * H * 0.85), R);
    pc.ellipse(Math.round(cx + W * 0.05), Math.round(cy), Math.round(W * 0.07), Math.round(H * 0.06), bolt);
    pc.ellipse(Math.round(cx + W * 0.07), Math.round(cy), Math.round(W * 0.025), Math.round(H * 0.035), hex('#202030'));
  },
  bell(pc, P, rng, W, H) {
    // A great bell that rings itself: banded bronze, one staring eye, a clapper
    // for a tongue.
    const R = P.body;
    const cx = W * 0.5, top = H * 0.14, lip = H * 0.74;
    pc.shadedRect(Math.round(cx - W * 0.05), Math.round(top - H * 0.07), Math.round(W * 0.1), Math.round(H * 0.08), R); // crown
    pc.poly([[cx - W * 0.14, top], [cx + W * 0.14, top], [cx + W * 0.2, H * 0.4], [cx + W * 0.3, lip], [cx - W * 0.3, lip], [cx - W * 0.2, H * 0.4]], R[2]);
    pc.poly([[cx - W * 0.14, top], [cx - W * 0.06, top], [cx - W * 0.12, H * 0.45], [cx - W * 0.22, lip], [cx - W * 0.3, lip], [cx - W * 0.2, H * 0.4]], R[1]);
    pc.poly([[cx + W * 0.08, top], [cx + W * 0.14, top], [cx + W * 0.2, H * 0.4], [cx + W * 0.3, lip], [cx + W * 0.22, lip], [cx + W * 0.14, H * 0.42]], R[3]);
    pc.shadedRect(Math.round(cx - W * 0.32), Math.round(lip), Math.round(W * 0.64), Math.round(H * 0.05), R); // lip
    pc.rect(Math.round(cx - W * 0.18), Math.round(H * 0.3), Math.round(W * 0.36), 2, R[0]); // bands
    pc.rect(Math.round(cx - W * 0.27), Math.round(H * 0.64), Math.round(W * 0.54), 2, R[0]);
    eye(pc, Math.round(cx + W * 0.03), Math.round(H * 0.47), P.eyeHex || '#402010', Math.max(2, Math.round(W * 0.06)));
    pc.thickLine(Math.round(cx), Math.round(lip), Math.round(cx + W * 0.06), Math.round(H * 0.86), 2, hex('#3a2a20')); // clapper
    pc.shadedEllipse(Math.round(cx + W * 0.07), Math.round(H * 0.88), Math.max(2, Math.round(W * 0.045)), Math.max(2, Math.round(W * 0.045)), ramp('#5a4a3a'));
  },
  mimic(pc, P, rng, W, H) {
    const w = ramp('#9a5a2a'), g = ramp('#d9a93c');
    pc.shadedRect(Math.round(W * 0.2), Math.round(H * 0.5), Math.round(W * 0.6), Math.round(H * 0.42), w);
    pc.poly([[W * 0.2, H * 0.48], [W * 0.8, H * 0.48], [W * 0.75, H * 0.18], [W * 0.25, H * 0.2]], w[3]);
    pc.rect(Math.round(W * 0.2), Math.round(H * 0.48), Math.round(W * 0.6), 2, g[2]);
    pc.rect(Math.round(W * 0.22), Math.round(H * 0.42), Math.round(W * 0.56), Math.round(H * 0.08), hex('#5a1020'));
    for (let i = 0; i < 6; i++) pc.poly([[W * (0.24 + i * 0.09), H * 0.42], [W * (0.28 + i * 0.09), H * 0.5], [W * (0.32 + i * 0.09), H * 0.42]], hex('#f8f0e0'));
    pc.thickLine(Math.round(W * 0.6), Math.round(H * 0.48), Math.round(W * 0.85), Math.round(H * 0.6), 2, hex('#d05070'));
    eye(pc, Math.round(W * 0.5), Math.round(H * 0.32), '#ffe060');
  },
  scorpion(pc, P, rng, W, H) {
    ARCHETYPES.insect(pc, P, rng, W, H);
    const R = P.body;
    let x = W * 0.2, y = H * 0.6;
    for (let k = 0; k < 8; k++) {
      x -= W * 0.02; y -= H * 0.06;
      pc.shadedEllipse(x + k * 1.5, y, 3, 3, R);
    }
    pc.poly([[x + 12, y], [x + 18, y + 4], [x + 12, y + 6]], P.accent[3]);
  },
  knight(pc, P, rng, W, H, desc) {
    // Big armored humanoid built from the character generator, scaled 2x.
    const look = {
      id: `mk_${desc.seed}_${desc.color}`, skin: '#8a8a98', hair: { style: 'none' },
      outfit: { style: 'armor', main: desc.color, metal: desc.color, accent: desc.accent || '#6a3aa8', trim: '#c9a24a', pants: '#2a2a30' },
      acc: ['helmet', 'cape'], capeColor: desc.accent || '#2a2a40', weapon: desc.weapon || 'greatsword', build: 'large',
    };
    blitHumanoid(pc, look, W, H);
  },
  humanoid(pc, P, rng, W, H, desc) {
    blitHumanoid(pc, typeof desc.look === 'string' ? LOOKS[desc.look] : desc.look, W, H);
  },
  angel(pc, P, rng, W, H) {
    const cx = W * 0.5;
    const wing = ramp('#f8f0d8');
    for (const s of [-1, 1]) {
      for (let i = 0; i < 4; i++) pc.poly([[cx, H * 0.4], [cx + s * W * (0.45 - i * 0.05), H * (0.1 + i * 0.12)], [cx + s * W * (0.3 - i * 0.04), H * (0.3 + i * 0.12)]], wing[3 - (i % 2)]);
    }
    pc.shadedEllipse(cx, H * 0.55, W * 0.12, H * 0.25, P.body);
    pc.shadedEllipse(cx, H * 0.26, W * 0.08, H * 0.08, ramp('#f0e0c8'));
    pc.ellipse(cx, H * 0.14, W * 0.1, H * 0.025, hex('#ffe080'));
    pc.rect(Math.round(cx + 1), Math.round(H * 0.25), 2, 1, OUT);
  },
};

function blitHumanoid(pc, look, W, H) {
  const sheet = getCharacterSheet(look);
  const frame = document.createElement('canvas');
  frame.width = BATTLE_W; frame.height = BATTLE_H;
  // idle battle pose (index 0), un-mirror to face right
  const ctx = frame.getContext('2d');
  ctx.translate(BATTLE_W, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(sheet.canvas, 0, 128, BATTLE_W, BATTLE_H, 0, 0, BATTLE_W, BATTLE_H);
  const data = ctx.getImageData(0, 0, BATTLE_W, BATTLE_H).data;
  const scale = Math.max(1, Math.round(Math.min(W / BATTLE_W, H / BATTLE_H)));
  const ox = Math.floor((W - BATTLE_W * scale) / 2), oy = H - BATTLE_H * scale;
  for (let y = 0; y < BATTLE_H; y++) for (let x = 0; x < BATTLE_W; x++) {
    const i = (y * BATTLE_W + x) * 4;
    if (data[i + 3] < 128) continue;
    const c = ((255 << 24) | (data[i + 2] << 16) | (data[i + 1] << 8) | data[i]) >>> 0;
    pc.rect(ox + x * scale, oy + y * scale, scale, scale, c);
  }
}

// Base pixel sizes per size class.
const SIZES = { 1: [36, 32], 1.5: [52, 46], 2: [72, 64], 3: [104, 92], 4: [140, 124] };

const cache = new Map();

/** Build (cached) monster texture. Returns { canvas, texture, width, height } in world units. */
export function getMonsterSprite(desc) {
  const key = JSON.stringify(desc);
  if (cache.has(key)) return cache.get(key);
  let [W, H] = SIZES[desc.size || 1] || SIZES[1];
  if (desc.type === 'knight' || desc.type === 'humanoid') {
    const k = Math.max(1, Math.round(desc.size || 1));
    [W, H] = [40 * k, 32 * k];
  }
  const art = new PixelCanvas(W, H);
  const P = {
    body: ramp(desc.color || '#6a9a5a'),
    accent: ramp(desc.accent || shadeHex(desc.color || '#6a9a5a')),
    eye: desc.eye || '#ffe060',
    eyeHex: desc.eye,
    accentHex: desc.accent,
  };
  const painter = ARCHETYPES[desc.type] || ARCHETYPES.slime;
  painter(art, P, new RNG(desc.seed || 1), W, H, desc);
  const pc = new PixelCanvas(W + 2, H + 2);
  pc.blit(art, 1, 1);
  pc.outline(OUT);
  const canvas = pc.toCanvas();
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  const entry = { canvas, texture, width: (W + 2) / 20, height: (H + 2) / 20 };
  cache.set(key, entry);
  return entry;
}

function shadeHex(h) {
  const c = shade(hex(h), 0.15);
  const r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255;
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export const MONSTER_TYPES = Object.keys(ARCHETYPES);

/**
 * A monster's battle sprite dressed as a field sheet (Actor look { kind: 'monster',
 * sprite }): one frame, mirrored to face left, scaled so a big beast stands about two
 * tiles tall on the field instead of filling the screen.
 * @param {object} sprite  an EnemyDef sprite descriptor
 * @param {number} [maxH]  tallest it may stand, in field pixels
 */
export function getMonsterFieldSheet(sprite, maxH = 44) {
  const m = getMonsterSprite(sprite);
  const k = Math.min(1, maxH / m.canvas.height);
  return {
    texture: m.texture,
    w: m.canvas.width * k,
    h: m.canvas.height * k,
    walkSeq: [0, 0, 0, 0],
    stride: 1,
    // Painted facing right (toward the party in battle).
    fieldFrame: (dir) => (dir === 'left' ? { u0: 1, u1: 0, v0: 0, v1: 1 } : { u0: 0, u1: 1, v0: 0, v1: 1 }),
  };
}
