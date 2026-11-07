// Billboard prop sprites (trees, rocks, lamps, furniture...). Each prop type
// has a painter producing a PixelCanvas plus metadata describing how it sits
// in the world: solidity (and `footprint`, extra tiles blocked either side for
// wide props), lights, emissive glow, shadow casting.

import * as THREE from 'three';
import { PixelCanvas, hex, ramp, shade } from './PixelCanvas.js';
import { RNG } from '../core/util.js';

export const PX_PER_UNIT = 20;
const OUT = hex('#1b1422');

// --- painter helpers --------------------------------------------------------

function canopy(pc, rng, cx, cy, rx, ry, leaf, blobs = 9) {
  // Cluster of shaded blobs, back-to-front, giving a lumpy crown.
  const items = [];
  for (let i = 0; i < blobs; i++) {
    const a = rng.range(0, Math.PI * 2), r = rng.range(0, 0.65);
    items.push([cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r, rng.range(rx * 0.38, rx * 0.6)]);
  }
  items.sort((a, b) => a[1] - b[1]);
  pc.shadedEllipse(cx, cy, rx, ry, leaf);
  for (const [x, y, r] of items) pc.shadedEllipse(x, y, r, r * 0.85, leaf);
  // a few highlight leaves
  for (let i = 0; i < blobs * 2; i++) {
    const x = cx + rng.range(-rx * 0.7, rx * 0.2), y = cy + rng.range(-ry * 0.8, 0);
    pc.over(x, y, leaf[4]);
  }
}

function trunk(pc, cx, top, bottom, w, bark) {
  pc.rect(Math.round(cx - w / 2), top, w, bottom - top, bark[2]);
  pc.rect(Math.round(cx - w / 2), top, 1, bottom - top, bark[3]);
  pc.rect(Math.round(cx + w / 2) - 1, top, 1, bottom - top, bark[1]);
  pc.rect(Math.round(cx - w / 2) - 1, bottom - 2, w + 2, 2, bark[1]); // root flare
}

// --- prop catalog -----------------------------------------------------------
// w,h: pixel size. solid: blocks movement. light: {color, intensity, distance, y}.
// glow: emissive strength for bloom. shadow: casts shadows. sway: wind sway amount.

export const PROPS = {
  tree: {
    w: 56, h: 72, solid: true, shadow: true, sway: 1,
    paint(pc, rng) {
      trunk(pc, 28, 38, 70, 6, ramp('#6a4a32'));
      canopy(pc, rng, 28, 28, 24, 22, ramp('#4f8f3a'), 10);
    },
  },
  tree_autumn: {
    w: 56, h: 72, solid: true, shadow: true, sway: 1,
    paint(pc, rng) {
      trunk(pc, 28, 38, 70, 6, ramp('#6a4a32'));
      canopy(pc, rng, 28, 28, 24, 22, ramp(rng.pick(['#c8762e', '#d0a03a', '#b8502e'])), 10);
    },
  },
  tree_cherry: {
    w: 56, h: 72, solid: true, shadow: true, sway: 1,
    paint(pc, rng) {
      trunk(pc, 28, 38, 70, 5, ramp('#5a3a3a'));
      canopy(pc, rng, 28, 28, 24, 21, ramp('#f0a8c0'), 11);
    },
  },
  pine: {
    w: 44, h: 84, solid: true, shadow: true, sway: 0.6,
    paint(pc, rng) {
      trunk(pc, 22, 60, 82, 5, ramp('#5a3e2c'));
      const leaf = ramp('#2f6a4a');
      for (let i = 0; i < 5; i++) {
        const y = 8 + i * 12, w = 7 + i * 4;
        pc.poly([[22, y - 8], [22 + w, y + 10], [22 - w, y + 10]], leaf[i % 2 ? 2 : 1]);
        pc.poly([[22, y - 8], [22 - w, y + 10], [22 - w + 4, y + 10]], leaf[3]);
        for (let k = 0; k < w; k += 3) pc.over(22 + k - w / 2, y + 9, leaf[0]);
      }
    },
  },
  pine_snow: {
    w: 44, h: 84, solid: true, shadow: true, sway: 0.4,
    paint(pc, rng) {
      PROPS.pine.paint(pc, rng);
      const snow = ramp('#eef4fa');
      for (let i = 0; i < 5; i++) {
        const y = 8 + i * 12, w = 7 + i * 4;
        pc.poly([[22, y - 8], [22 + w * 0.6, y + 2], [22 - w * 0.6, y + 2]], snow[3]);
      }
    },
  },
  palm: {
    w: 56, h: 80, solid: true, shadow: true, sway: 1.2,
    paint(pc) {
      const bark = ramp('#8a6a44');
      for (let y = 22; y < 78; y++) {
        const x = 28 + Math.sin(y / 14) * 4;
        pc.rect(Math.round(x - 2), y, 5, 1, y % 4 ? bark[2] : bark[1]);
      }
      const leaf = ramp('#4a9a4a');
      const fronds = [[-24, 6], [-18, -10], [0, -16], [18, -10], [24, 6], [-10, 14], [12, 14]];
      for (const [dx, dy] of fronds) {
        for (let t = 0; t <= 1; t += 0.04) {
          const x = 28 + dx * t, y = 20 + dy * t + Math.sin(t * Math.PI) * -4 + t * t * 8;
          pc.ellipse(x, y, 2.6 - t * 1.5, 1.6, t < 0.5 ? leaf[2] : leaf[3]);
        }
      }
      pc.ellipse(26, 23, 2, 2, ramp('#6a4a2a')[2]);
      pc.ellipse(30, 24, 2, 2, ramp('#6a4a2a')[1]);
    },
  },
  tree_dead: {
    w: 48, h: 68, solid: true, shadow: true, sway: 0.2,
    paint(pc, rng) {
      const bark = ramp('#5e5048');
      trunk(pc, 24, 24, 66, 5, bark);
      const branch = (x, y, a, len, depth) => {
        if (depth <= 0 || len < 3) return;
        const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
        pc.thickLine(x, y, x2, y2, depth > 2 ? 2 : 1, bark[depth > 1 ? 2 : 3]);
        branch(x2, y2, a - rng.range(0.3, 0.7), len * 0.7, depth - 1);
        branch(x2, y2, a + rng.range(0.3, 0.7), len * 0.7, depth - 1);
      };
      branch(24, 30, -Math.PI / 2, 14, 4);
    },
  },
  tree_crystal: {
    w: 48, h: 72, solid: true, shadow: true, glow: 0.8, light: { color: '#b07aff', intensity: 1.2, distance: 5, y: 2 },
    paint(pc, rng) {
      PROPS.tree_dead.paint(pc, rng);
      const cr = ramp('#a070ff');
      for (let i = 0; i < 7; i++) {
        const x = rng.int(8, 40), y = rng.int(6, 34);
        pc.poly([[x, y - 5], [x + 3, y], [x, y + 5], [x - 3, y]], cr[rng.int(2, 4)]);
      }
    },
  },
  bush: {
    w: 28, h: 20, solid: true, shadow: true, sway: 0.5,
    paint(pc, rng) { canopy(pc, rng, 14, 12, 12, 7, ramp('#4a8a3a'), 6); },
  },
  bush_flower: {
    w: 28, h: 20, solid: true, shadow: true, sway: 0.5,
    paint(pc, rng) {
      canopy(pc, rng, 14, 12, 12, 7, ramp('#3f7f3a'), 6);
      for (let i = 0; i < 8; i++) pc.over(rng.int(4, 24), rng.int(5, 16), hex(rng.pick(['#f0e060', '#f08080', '#ffffff'])));
    },
  },
  rock: {
    w: 30, h: 22, solid: true, shadow: true,
    paint(pc, rng) {
      const r = ramp('#8a8680');
      pc.shadedEllipse(15, 13, 13, 9, r);
      pc.shadedEllipse(9, 14, 7, 6, r);
      for (let i = 0; i < 4; i++) pc.over(rng.int(6, 22), rng.int(8, 18), r[0]);
    },
  },
  rock_small: {
    w: 14, h: 10, solid: false,
    paint(pc) { pc.shadedEllipse(7, 6, 6, 4, ramp('#8a8680')); },
  },
  rock_snow: {
    w: 30, h: 22, solid: true, shadow: true,
    paint(pc, rng) { PROPS.rock.paint(pc, rng); pc.ellipse(14, 8, 10, 4, hex('#eef4fa')); },
  },
  flowers: {
    w: 20, h: 10, solid: false, sway: 0.5,
    paint(pc, rng) {
      const cols = ['#f0e060', '#f07a8a', '#ffffff', '#8ab0f0', '#f0a040'];
      for (let i = 0; i < 7; i++) {
        const x = rng.int(2, 17), y = rng.int(3, 8);
        pc.line(x, y, x, 9, hex('#3f7f3a'));
        pc.set(x, y - 1, hex(rng.pick(cols)));
        pc.set(x - 1, y - 1, shade(hex(rng.pick(cols)), -0.1));
      }
    },
  },
  grass_tuft: {
    w: 14, h: 10, solid: false, sway: 1,
    paint(pc, rng) {
      const g = ramp('#5f9a3c');
      for (let i = 0; i < 6; i++) {
        const x = rng.int(2, 11);
        pc.line(x, 9, x + rng.int(-2, 2), rng.int(1, 5), g[rng.int(2, 4)]);
      }
    },
  },
  reeds: {
    w: 16, h: 24, solid: false, sway: 1,
    paint(pc, rng) {
      const g = ramp('#6a8a3a');
      for (let i = 0; i < 5; i++) {
        const x = rng.int(2, 13), top = rng.int(2, 10);
        pc.line(x, 23, x, top, g[rng.int(1, 3)]);
        pc.rect(x - 1, top, 2, 4, ramp('#6a4a2a')[2]);
      }
    },
  },
  mushroom: {
    w: 14, h: 12, solid: false, glow: 0.3,
    paint(pc) {
      pc.rect(6, 6, 2, 6, hex('#e8e0d0'));
      pc.shadedEllipse(7, 5, 6, 4, ramp('#c04a5a'));
      pc.set(5, 3, hex('#ffffff')); pc.set(8, 4, hex('#ffffff'));
    },
  },
  mushroom_glow: {
    w: 14, h: 12, solid: false, glow: 1, light: { color: '#60e0d0', intensity: 0.6, distance: 3, y: 0.4 },
    paint(pc) {
      pc.rect(6, 6, 2, 6, hex('#d0f0e8'));
      pc.shadedEllipse(7, 5, 6, 4, ramp('#40d0c0'));
    },
  },
  stalagmite: {
    w: 18, h: 30, solid: true, shadow: true,
    paint(pc) {
      const r = ramp('#6a6070');
      pc.poly([[9, 0], [16, 29], [2, 29]], r[2]);
      pc.poly([[9, 0], [5, 29], [2, 29]], r[3]);
      pc.poly([[9, 0], [16, 29], [13, 29]], r[1]);
    },
  },
  crystal: {
    w: 18, h: 26, solid: true, glow: 1.2, light: { color: '#8ad8ff', intensity: 1.0, distance: 4, y: 0.6 },
    paint(pc) {
      const c = ramp('#6ac8f0');
      pc.poly([[9, 0], [14, 8], [12, 25], [6, 25], [4, 8]], c[2]);
      pc.poly([[9, 0], [4, 8], [6, 25], [8, 25]], c[4]);
      pc.poly([[3, 12], [6, 14], [5, 25], [1, 25]], c[3]);
      pc.poly([[15, 14], [17, 18], [16, 25], [13, 25]], c[1]);
    },
  },
  crystal_gloam: {
    w: 18, h: 26, solid: true, glow: 1.3, light: { color: '#b070ff', intensity: 1.1, distance: 4, y: 0.6 },
    paint(pc) {
      const c = ramp('#9a5af0');
      pc.poly([[9, 0], [14, 8], [12, 25], [6, 25], [4, 8]], c[2]);
      pc.poly([[9, 0], [4, 8], [6, 25], [8, 25]], c[4]);
      pc.poly([[3, 12], [6, 14], [5, 25], [1, 25]], c[3]);
    },
  },
  lamp: {
    w: 12, h: 44, solid: true, shadow: true, glow: 1.4, nightOnly: true, light: { color: '#ffc070', intensity: 2.2, distance: 6, y: 1.9 },
    paint(pc) {
      const m = ramp('#3a3a44');
      pc.rect(5, 10, 2, 33, m[2]);
      pc.rect(3, 41, 6, 3, m[1]);
      pc.rect(2, 2, 8, 9, m[1]);
      pc.rect(3, 3, 6, 7, hex('#ffe6a0'));
      pc.rect(4, 4, 4, 2, hex('#ffffff'));
      pc.rect(1, 1, 10, 2, m[2]);
    },
  },
  torch: {
    w: 10, h: 22, solid: false, glow: 1.6, light: { color: '#ff9a40', intensity: 1.8, distance: 5, y: 1.0, flicker: true },
    paint(pc) {
      pc.rect(4, 8, 2, 14, ramp('#6a4a2a')[2]);
      pc.ellipse(5, 5, 3, 5, hex('#ff8a30'));
      pc.ellipse(5, 6, 2, 3, hex('#ffe080'));
    },
  },
  campfire: {
    w: 22, h: 14, solid: true, glow: 1.5, light: { color: '#ff8a3a', intensity: 2.5, distance: 7, y: 0.6, flicker: true },
    paint(pc) {
      const w = ramp('#6a4a2a');
      pc.thickLine(2, 12, 19, 8, 2, w[2]);
      pc.thickLine(2, 8, 19, 12, 2, w[1]);
      pc.ellipse(11, 6, 5, 6, hex('#ff7a2a'));
      pc.ellipse(11, 7, 3, 4, hex('#ffd060'));
      pc.ellipse(11, 8, 1.5, 2, hex('#fff8d0'));
      for (let x = 2; x < 20; x += 3) pc.set(x, 13, hex('#7a7470'));
    },
  },
  sign: {
    w: 18, h: 20, solid: true, shadow: true,
    paint(pc) {
      const w = ramp('#8a643c');
      pc.rect(8, 9, 2, 11, w[1]);
      pc.shadedRect(1, 2, 16, 9, w);
      pc.rect(3, 5, 9, 1, w[0]); pc.rect(3, 7, 11, 1, w[0]);
    },
  },
  fence: {
    w: 20, h: 16, solid: true, shadow: true,
    paint(pc) {
      const w = ramp('#9a7048');
      pc.rect(2, 2, 3, 14, w[2]); pc.rect(15, 2, 3, 14, w[2]);
      pc.rect(0, 5, 20, 2, w[3]); pc.rect(0, 10, 20, 2, w[1]);
      pc.set(2, 2, w[4]); pc.set(15, 2, w[4]);
    },
  },
  barrel: {
    w: 16, h: 20, solid: true, shadow: true,
    paint(pc) {
      const w = ramp('#9a6a3a');
      pc.shadedEllipse(8, 10, 7, 9.5, w);
      pc.rect(1, 4, 14, 1, ramp('#5a5a62')[2]);
      pc.rect(1, 15, 14, 1, ramp('#5a5a62')[2]);
      pc.ellipse(8, 2, 6, 1.5, w[3]);
    },
  },
  crate: {
    w: 18, h: 18, solid: true, shadow: true,
    paint(pc) {
      const w = ramp('#b0844a');
      pc.shadedRect(0, 0, 18, 18, w);
      pc.rect(0, 0, 18, 2, w[1]); pc.rect(0, 16, 18, 2, w[1]);
      pc.rect(0, 0, 2, 18, w[1]); pc.rect(16, 0, 2, 18, w[1]);
      pc.thickLine(2, 15, 15, 2, 2, w[1]);
    },
  },
  sack: {
    w: 14, h: 14, solid: true,
    paint(pc) { pc.shadedEllipse(7, 8, 6, 6, ramp('#c8b080')); pc.rect(5, 1, 4, 3, ramp('#a89060')[2]); },
  },
  haybale: {
    w: 22, h: 16, solid: true, shadow: true,
    paint(pc, rng) {
      const h = ramp('#d8b860');
      pc.shadedRect(1, 2, 20, 14, h);
      for (let i = 0; i < 20; i++) pc.set(rng.int(2, 19), rng.int(3, 14), h[rng.int(1, 4)]);
      pc.rect(1, 6, 20, 1, h[0]); pc.rect(1, 11, 20, 1, h[0]);
    },
  },
  well: {
    w: 30, h: 34, solid: true, shadow: true,
    paint(pc) {
      const s = ramp('#9a978e'), w = ramp('#7a5634');
      pc.shadedEllipse(15, 26, 13, 7, s);
      pc.ellipse(15, 24, 9, 4, hex('#1a2a3a'));
      pc.rect(3, 6, 2, 20, w[2]); pc.rect(25, 6, 2, 20, w[1]);
      pc.poly([[0, 8], [30, 8], [26, 1], [4, 1]], ramp('#b04a3a')[2]);
      pc.rect(13, 9, 4, 8, w[2]);
    },
  },
  tombstone: {
    w: 16, h: 18, solid: true, shadow: true,
    paint(pc) {
      const s = ramp('#8a8a90');
      pc.shadedRect(2, 4, 12, 14, s);
      pc.shadedEllipse(8, 5, 6, 4, s);
      pc.rect(7, 6, 2, 7, s[0]); pc.rect(5, 8, 6, 2, s[0]);
    },
  },
  statue: {
    w: 26, h: 56, solid: true, shadow: true,
    paint(pc) {
      const s = ramp('#c8c4b8');
      pc.shadedRect(2, 44, 22, 12, s);
      pc.shadedRect(8, 22, 10, 22, s);
      pc.shadedEllipse(13, 16, 5, 6, s);
      pc.thickLine(16, 24, 22, 10, 2, s[3]);
      pc.shadedEllipse(22, 8, 3, 3, ramp('#ffd070'));
    },
  },
  pillar: {
    w: 20, h: 60, solid: true, shadow: true,
    paint(pc) {
      const s = ramp('#d8d2c4');
      pc.shadedRect(0, 0, 20, 5, s);
      pc.shadedRect(0, 55, 20, 5, s);
      pc.shadedRect(3, 5, 14, 50, s);
      for (let x = 5; x < 16; x += 3) pc.rect(x, 5, 1, 50, s[1]);
    },
  },
  pillar_broken: {
    w: 20, h: 36, solid: true, shadow: true,
    paint(pc) {
      const s = ramp('#b8b2a4');
      pc.shadedRect(0, 31, 20, 5, s);
      pc.poly([[3, 31], [17, 31], [17, 8], [12, 4], [8, 10], [3, 6]], s[2]);
      for (let x = 5; x < 16; x += 3) pc.rect(x, 12, 1, 19, s[1]);
    },
  },
  chest: {
    w: 20, h: 16, solid: true, shadow: true,
    paint(pc) {
      const w = ramp('#9a5a2a'), g = ramp('#d9a93c');
      pc.shadedRect(1, 6, 18, 10, w);
      pc.shadedEllipse(10, 6, 9, 4, w);
      pc.rect(1, 7, 18, 1, g[2]);
      pc.rect(8, 7, 4, 4, g[3]);
      pc.set(10, 9, hex('#2a1a10'));
    },
  },
  chest_open: {
    w: 20, h: 16, solid: true, shadow: true,
    paint(pc) {
      const w = ramp('#9a5a2a'), g = ramp('#d9a93c');
      pc.shadedRect(1, 7, 18, 9, w);
      pc.rect(2, 8, 16, 3, hex('#2a1a10'));
      pc.shadedRect(1, 1, 18, 5, w);
      pc.rect(1, 5, 18, 1, g[2]);
    },
  },
  save: {
    w: 18, h: 32, solid: true, glow: 1.6, light: { color: '#ffd890', intensity: 2, distance: 5, y: 1.0 },
    paint(pc) {
      const s = ramp('#8a8478');
      pc.shadedRect(2, 24, 14, 8, s);
      const c = ramp('#ffcf70');
      pc.poly([[9, 0], [15, 12], [9, 24], [3, 12]], c[2]);
      pc.poly([[9, 0], [3, 12], [9, 24]], c[4]);
      pc.poly([[9, 4], [12, 12], [9, 19]], hex('#fffbe8'));
    },
  },
  bed: {
    w: 24, h: 30, solid: true,
    paint(pc) {
      const w = ramp('#7a5634');
      pc.shadedRect(0, 0, 24, 30, w);
      pc.shadedRect(2, 3, 20, 7, ramp('#f0ece0'));
      pc.shadedRect(2, 10, 20, 18, ramp('#4a6aa0'));
    },
  },
  bookshelf: {
    w: 28, h: 40, solid: true, shadow: true,
    paint(pc, rng) {
      const w = ramp('#6a4a30');
      pc.shadedRect(0, 0, 28, 40, w);
      for (let s = 0; s < 4; s++) {
        const y = 3 + s * 9;
        pc.rect(2, y, 24, 7, hex('#2a1e18'));
        for (let x = 2; x < 26;) {
          const bw = rng.int(2, 3);
          pc.rect(x, y + rng.int(0, 2), bw, 7 - rng.int(0, 1), hex(rng.pick(['#a83a3a', '#3a5a9a', '#4a8a4a', '#c8a040', '#7a4a8a', '#d8d0c0'])));
          x += bw;
        }
        pc.rect(1, y + 7, 26, 2, w[1]);
      }
    },
  },
  table: {
    w: 30, h: 18, solid: true, shadow: true,
    paint(pc) {
      const w = ramp('#9a6a3e');
      pc.shadedRect(0, 0, 30, 8, w);
      pc.rect(2, 8, 3, 10, w[1]); pc.rect(25, 8, 3, 10, w[1]);
      pc.rect(10, 2, 4, 3, hex('#e8e0d0')); pc.rect(18, 1, 3, 4, ramp('#5a7aa0')[3]);
    },
  },
  chair: {
    w: 12, h: 18, solid: false,
    paint(pc) {
      const w = ramp('#8a5a32');
      pc.rect(1, 0, 10, 9, w[2]); pc.rect(1, 9, 10, 3, w[3]); pc.rect(1, 12, 2, 6, w[1]); pc.rect(9, 12, 2, 6, w[1]);
    },
  },
  cauldron: {
    w: 20, h: 18, solid: true, glow: 0.5,
    paint(pc) {
      pc.shadedEllipse(10, 11, 9, 7, ramp('#3a3a44'));
      pc.ellipse(10, 6, 7, 2, hex('#70d070'));
    },
  },
  anvil: {
    w: 20, h: 14, solid: true,
    paint(pc) {
      const m = ramp('#5a5a66');
      pc.poly([[0, 1], [20, 1], [16, 6], [4, 6]], m[3]);
      pc.rect(7, 6, 6, 5, m[2]); pc.rect(4, 11, 12, 3, m[1]);
    },
  },
  boat: {
    w: 64, h: 28, solid: true, shadow: true,
    paint(pc) {
      const w = ramp('#8a5a32');
      pc.poly([[0, 8], [64, 8], [56, 26], [8, 26]], w[2]);
      pc.rect(2, 8, 60, 2, w[4]);
      for (let y = 13; y < 26; y += 5) pc.line(4, y, 60, y, w[1]);
      pc.rect(30, 0, 3, 9, w[1]);
    },
  },
  cactus: {
    w: 20, h: 32, solid: true, shadow: true,
    paint(pc) {
      const g = ramp('#4a8a4a');
      pc.shadedRect(7, 2, 7, 30, g);
      pc.shadedRect(1, 10, 4, 10, g); pc.rect(3, 18, 4, 3, g[2]);
      pc.shadedRect(16, 6, 4, 9, g); pc.rect(13, 13, 4, 3, g[2]);
    },
  },
  bones: {
    w: 20, h: 10, solid: false,
    paint(pc) {
      const b = ramp('#e8dcc8');
      pc.shadedEllipse(5, 5, 4, 4, b); pc.set(4, 5, OUT); pc.set(6, 5, OUT);
      pc.thickLine(9, 8, 18, 5, 2, b[3]);
    },
  },
  debris: {
    w: 24, h: 12, solid: false,
    paint(pc, rng) {
      const s = ramp('#8a8478');
      for (let i = 0; i < 6; i++) pc.shadedRect(rng.int(0, 18), rng.int(2, 8), rng.int(3, 6), rng.int(2, 4), s);
    },
  },
  banner: {
    w: 14, h: 40, solid: false,
    paint(pc) {
      const r = ramp('#a83232');
      pc.rect(0, 0, 14, 2, ramp('#d9a93c')[2]);
      pc.poly([[1, 2], [13, 2], [13, 34], [7, 39], [1, 34]], r[2]);
      pc.rect(1, 2, 2, 32, r[3]);
      pc.shadedEllipse(7, 16, 3, 3, ramp('#ffd070'));
    },
  },
  bell: {
    // A great bronze bell hung from a timber beam between two posts.
    w: 56, h: 64, solid: true, shadow: true, footprint: 1, // blocks one tile either side too
    paint(pc) {
      const wood = ramp('#6a4a2a');
      const bronze = ramp('#b08a3a');
      pc.shadedRect(3, 6, 5, 58, wood); // posts
      pc.shadedRect(48, 6, 5, 58, wood);
      pc.shadedRect(0, 2, 56, 6, wood); // beam
      pc.shadedRect(25, 8, 6, 5, bronze); // crown
      pc.poly([[17, 13], [39, 13], [42, 24], [44, 40], [49, 48], [7, 48], [12, 40], [14, 24]], bronze[2]);
      pc.poly([[17, 13], [24, 13], [20, 40], [12, 48], [7, 48], [12, 40], [14, 24]], bronze[1]); // shaded flank
      pc.poly([[34, 13], [39, 13], [42, 24], [44, 40], [49, 48], [42, 48], [38, 40]], bronze[3]); // lit flank
      pc.shadedRect(6, 47, 44, 4, bronze); // lip
      pc.rect(14, 22, 28, 2, bronze[0]); // bands
      pc.rect(11, 40, 34, 2, bronze[0]);
      pc.shadedEllipse(28, 53, 3, 3, ramp('#5a4a3a')); // clapper
      pc.rect(27, 48, 2, 3, hex('#3a2a20'));
    },
  },
  fountain: {
    w: 40, h: 36, solid: true, shadow: true, glow: 0.4,
    paint(pc) {
      const s = ramp('#c8c4b8');
      pc.shadedEllipse(20, 28, 19, 7, s);
      pc.ellipse(20, 27, 15, 5, hex('#5aa0d0'));
      pc.shadedRect(17, 8, 6, 20, s);
      pc.shadedEllipse(20, 9, 8, 3, s);
      pc.ellipse(20, 8, 6, 2, hex('#8ad0f0'));
      pc.line(20, 1, 20, 7, hex('#cfefff'));
    },
  },
};

// ---------------------------------------------------------------------------

const cache = new Map();

/** Texture + metadata for a prop type and variant seed. */
export function getPropSprite(type, variant = 0) {
  const def = PROPS[type];
  if (!def) throw new Error(`Unknown prop type: ${type}`);
  const key = `${type}:${variant}`;
  if (cache.has(key)) return cache.get(key);
  const art = new PixelCanvas(def.w, def.h);
  def.paint(art, new RNG(variant * 977 + type.length * 13 + 1));
  const pc = new PixelCanvas(def.w + 2, def.h + 2); // 1px margin for the outline
  pc.blit(art, 1, 1);
  pc.outline(OUT);
  const canvas = pc.toCanvas();
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  const entry = {
    def,
    canvas,
    texture,
    width: (def.w + 2) / PX_PER_UNIT,
    height: (def.h + 2) / PX_PER_UNIT,
  };
  cache.set(key, entry);
  return entry;
}
