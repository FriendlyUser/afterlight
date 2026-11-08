// Procedural 32x32 pixel-art tile textures packed into a single atlas.
// Ground "top" textures get several variants to break repetition; side
// textures (cliffs, walls) and roofs get one or two.

import * as THREE from 'three';
import { PixelCanvas, hex, ramp, shade, mix } from './PixelCanvas.js';
import { RNG, fbm, hash2 } from '../core/util.js';

export const TILE_PX = 32;
const ATLAS_COLS = 16;

// --- painting helpers -------------------------------------------------------

/** Fill with a ramp chosen by periodic fBm noise. */
function noiseFill(pc, rmp, { scale = 6, seed = 1, cuts = [0.38, 0.47, 0.56, 0.66], octaves = 3 } = {}) {
  for (let y = 0; y < pc.h; y++) {
    for (let x = 0; x < pc.w; x++) {
      const n = fbm((x / pc.w) * scale, (y / pc.h) * scale, seed, octaves, scale);
      let i = 0;
      while (i < cuts.length && n > cuts[i]) i++;
      pc.set(x, y, rmp[Math.min(rmp.length - 1, i)]);
    }
  }
}

function speckle(pc, rng, count, colors) {
  for (let i = 0; i < count; i++) pc.set(rng.int(0, pc.w - 1), rng.int(0, pc.h - 1), rng.pick(colors));
}

function blades(pc, rng, count, colors, maxLen = 3) {
  for (let i = 0; i < count; i++) {
    const x = rng.int(0, pc.w - 1), y = rng.int(2, pc.h - 1);
    const len = rng.int(1, maxLen);
    for (let k = 0; k < len; k++) pc.set(x + (k === len - 1 && rng.chance(0.4) ? 1 : 0), y - k, colors[Math.min(colors.length - 1, k)]);
  }
}

function pebbles(pc, rng, count, rmp) {
  for (let i = 0; i < count; i++) {
    const x = rng.int(1, pc.w - 3), y = rng.int(1, pc.h - 3);
    const w = rng.int(1, 3), h = rng.int(1, 2);
    pc.rect(x, y, w, h, rmp[2]);
    pc.rect(x, y, w, 1, rmp[3]);
    pc.rect(x, y + h, w, 1, rmp[0]);
  }
}

function bricks(pc, rmp, mortar, bw = 8, bh = 4, rng) {
  for (let y = 0; y < pc.h; y++) {
    const row = Math.floor(y / bh);
    for (let x = 0; x < pc.w; x++) {
      const off = row % 2 ? bw / 2 : 0;
      const bx = (x + off) % bw, by = y % bh;
      if (by === bh - 1 || bx === bw - 1) { pc.set(x, y, mortar); continue; }
      const id = Math.floor((x + off) / bw) + row * 7;
      const tone = hash2(id, row, 3);
      let c = rmp[tone > 0.66 ? 3 : tone > 0.33 ? 2 : 1];
      if (by === 0) c = shade(c, 0.06);
      pc.set(x, y, c);
    }
  }
  if (rng) speckle(pc, rng, 12, [rmp[0], rmp[4]]);
}

function planks(pc, rmp, vertical, rng, plankW = 6) {
  for (let y = 0; y < pc.h; y++) {
    for (let x = 0; x < pc.w; x++) {
      const a = vertical ? x : y, b = vertical ? y : x;
      const idx = Math.floor(a / plankW);
      const seam = a % plankW === plankW - 1;
      const grain = fbm(b / 6, idx * 3.1, 9, 2) + hash2(idx, 0, 2) * 0.3;
      let c = rmp[grain > 0.72 ? 3 : grain > 0.5 ? 2 : 1];
      if (seam) c = rmp[0];
      pc.set(x, y, c);
    }
  }
  // nail heads and plank ends
  for (let i = 0; i < 6; i++) {
    const idx = rng.int(0, Math.floor(pc.w / plankW));
    const along = rng.int(0, pc.h - 1);
    const a = idx * plankW + 1;
    if (vertical) pc.set(a, along, rmp[4]); else pc.set(along, a, rmp[4]);
    if (rng.chance(0.5)) {
      for (let k = 0; k < plankW - 1; k++) vertical ? pc.set(idx * plankW + k, along, rmp[0]) : pc.set(along, idx * plankW + k, rmp[0]);
    }
  }
}

function cracks(pc, rng, count, color) {
  for (let i = 0; i < count; i++) {
    let x = rng.int(0, pc.w - 1), y = rng.int(0, pc.h - 1);
    const len = rng.int(3, 8);
    for (let k = 0; k < len; k++) {
      pc.set(x, y, color);
      x += rng.int(-1, 1); y += rng.int(0, 1) || 1;
    }
  }
}

// --- painters ---------------------------------------------------------------
// Each painter: (pc, rng, variant) => void

const G = {
  grass: ramp('#6a9a46'), grassDark: ramp('#3f7a3a'), grassAutumn: ramp('#a68a3c'), grassDead: ramp('#7d7a5a'),
  dirt: ramp('#9a7048'), sand: ramp('#e3cc8e'), snow: ramp('#e6eef5'), mud: ramp('#5c4a34'),
  stone: ramp('#9a978e'), cobble: ramp('#8c8478'), cave: ramp('#6a6274'), ruin: ramp('#8a8478'),
  glass: ramp('#9fd6d6'), ash: ramp('#6a6266'), wood: ramp('#9a6a3e'), woodDark: ramp('#6a4a30'),
  brick: ramp('#a65a42'), plaster: ramp('#e8dcc4'), slate: ramp('#5a6274'), roofRed: ramp('#b04a3a'),
  roofBlue: ramp('#3f5f8f'), thatch: ramp('#c9a45a'), roofGreen: ramp('#4a7a5a'), carpet: ramp('#a8323a'),
  carpetBlue: ramp('#2f4f8a'), ice: ramp('#a8d8f0'), moss: ramp('#5a7a4a'), marble: ramp('#e4e0d8'),
  lava: ramp('#e0602a'), gloam: ramp('#3a2a5a'), gold: ramp('#d9a93c'), metal: ramp('#8a94a4'),
};

const PAINTERS = {
  // ----- ground tops -----
  grass(pc, rng) {
    noiseFill(pc, [G.grass[1], G.grass[2], G.grass[2], G.grass[3], G.grass[3]], { seed: 11, scale: 4 });
    blades(pc, rng, 40, [G.grass[1], G.grass[3], G.grass[4]]);
    speckle(pc, rng, 6, [G.grass[0]]);
  },
  grass_dark(pc, rng) {
    noiseFill(pc, [G.grassDark[0], G.grassDark[1], G.grassDark[2], G.grassDark[2], G.grassDark[3]], { seed: 12, scale: 4 });
    blades(pc, rng, 46, [G.grassDark[1], G.grassDark[3], G.grassDark[4]]);
  },
  grass_autumn(pc, rng) {
    noiseFill(pc, [G.grassAutumn[1], G.grassAutumn[2], G.grassAutumn[2], G.grassAutumn[3], G.grassAutumn[3]], { seed: 13, scale: 4 });
    blades(pc, rng, 36, [G.grassAutumn[1], G.grassAutumn[3], G.grassAutumn[4]]);
    speckle(pc, rng, 6, [hex('#c0502a'), hex('#d08a2a')]);
  },
  grass_dead(pc, rng) {
    noiseFill(pc, [G.grassDead[0], G.grassDead[1], G.grassDead[2], G.grassDead[2], G.grassDead[3]], { seed: 14, scale: 4 });
    blades(pc, rng, 24, [G.grassDead[1], G.grassDead[3]]);
    speckle(pc, rng, 10, [G.ash[1], G.ash[2]]);
  },
  dirt(pc, rng) {
    noiseFill(pc, [G.dirt[1], G.dirt[2], G.dirt[2], G.dirt[3], G.dirt[3]], { seed: 21, scale: 5 });
    pebbles(pc, rng, 5, G.stone);
    speckle(pc, rng, 14, [G.dirt[0], G.dirt[4]]);
  },
  path(pc, rng) {
    noiseFill(pc, [G.dirt[2], G.dirt[3], G.dirt[3], G.dirt[4], G.dirt[4]], { seed: 22, scale: 5 });
    pebbles(pc, rng, 7, G.stone);
    speckle(pc, rng, 10, [G.dirt[1]]);
  },
  cobble(pc, rng) {
    // irregular rounded stones
    pc.rect(0, 0, 32, 32, G.cobble[0]);
    const cells = [];
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) cells.push([i * 8 + rng.int(2, 6), j * 8 + rng.int(2, 6)]);
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
      let d1 = 1e9, d2 = 1e9, id = 0;
      for (let k = 0; k < cells.length; k++) {
        for (const ox of [-32, 0, 32]) for (const oy of [-32, 0, 32]) {
          const dx = x - cells[k][0] - ox, dy = y - cells[k][1] - oy;
          const d = dx * dx + dy * dy;
          if (d < d1) { d2 = d1; d1 = d; id = k; } else if (d < d2) d2 = d;
        }
      }
      const edge = Math.sqrt(d2) - Math.sqrt(d1);
      if (edge < 1.2) continue;
      const tone = hash2(id, 1, 7);
      pc.set(x, y, edge < 2.2 ? G.cobble[1] : G.cobble[tone > 0.6 ? 3 : 2]);
    }
    speckle(pc, rng, 8, [G.cobble[4]]);
  },
  stone(pc, rng) {
    // large slabs with subtle tone variation
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
      const sx = Math.floor(x / 16), sy = Math.floor((y + (sx ? 8 : 0)) / 16);
      const seam = x % 16 === 15 || (y + (sx ? 8 : 0)) % 16 === 15;
      const t = hash2(sx, sy, 5);
      const n = fbm(x / 10, y / 10, 31, 2, 3.2);
      const tone = t > 0.66 ? 3 : t > 0.33 ? 2 : 2;
      pc.set(x, y, seam ? G.stone[0] : n > 0.68 ? G.stone[tone === 3 ? 3 : 1] : G.stone[tone]);
    }
    speckle(pc, rng, 8, [G.stone[4], G.stone[1]]);
  },
  marble(pc, rng) {
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
      const seam = x % 16 === 15 || y % 16 === 15;
      const vein = Math.abs(Math.sin((x + y * 0.6) / 3 + fbm(x / 6, y / 6, 33, 2, 6) * 6)) < 0.1;
      pc.set(x, y, seam ? G.marble[0] : vein ? G.marble[1] : G.marble[(x >> 4) ^ (y >> 4) ? 3 : 2]);
    }
  },
  wood(pc, rng) { planks(pc, G.wood, false, rng); },
  wood_dark(pc, rng) { planks(pc, G.woodDark, false, rng); },
  sand(pc, rng) {
    noiseFill(pc, [G.sand[1], G.sand[2], G.sand[2], G.sand[2], G.sand[3]], { seed: 41, scale: 4, cuts: [0.3, 0.42, 0.58, 0.7] });
    // a few soft wind ripples at random offsets
    for (let i = 0; i < 3; i++) {
      const y0 = rng.int(3, 28), x0 = rng.int(0, 31), len = rng.int(6, 12);
      for (let k = 0; k < len; k++) pc.set((x0 + k) % 32, y0 + Math.round(Math.sin((x0 + k) / 3) * 0.8), G.sand[1]);
    }
    speckle(pc, rng, 14, [G.sand[4], G.sand[0], G.sand[3]]);
  },
  snow(pc, rng) {
    noiseFill(pc, [G.snow[1], G.snow[2], G.snow[3], G.snow[3], G.snow[4]], { seed: 51, scale: 3 });
    speckle(pc, rng, 10, [hex('#ffffff'), G.snow[1]]);
  },
  mud(pc, rng) {
    noiseFill(pc, [G.mud[0], G.mud[1], G.mud[2], G.mud[2], G.mud[3]], { seed: 61, scale: 4 });
    for (let i = 0; i < 4; i++) {
      const x = rng.int(3, 28), y = rng.int(3, 28);
      pc.ellipse(x, y, rng.int(2, 4), rng.int(1, 2), hex('#4a5a4a'));
      pc.set(x - 1, y - 1, hex('#8aa0a0'));
    }
  },
  cave(pc, rng) {
    noiseFill(pc, [G.cave[0], G.cave[1], G.cave[2], G.cave[2], G.cave[3]], { seed: 71, scale: 5 });
    pebbles(pc, rng, 4, G.cave);
    cracks(pc, rng, 2, G.cave[0]);
  },
  ruin(pc, rng) {
    PAINTERS.stone(pc, rng);
    cracks(pc, rng, 4, G.ruin[0]);
    for (let i = 0; i < 3; i++) pc.ellipse(rng.int(0, 31), rng.int(0, 31), rng.int(2, 4), rng.int(1, 3), G.moss[rng.int(1, 3)]);
  },
  glass(pc, rng) {
    noiseFill(pc, [G.glass[1], G.glass[2], G.glass[2], G.glass[3], G.glass[4]], { seed: 81, scale: 3 });
    for (let i = 0; i < 5; i++) {
      const x = rng.int(0, 31), y = rng.int(0, 31);
      pc.line(x, y, x + 5, y - 5, hex('#e8ffff'));
    }
    speckle(pc, rng, 10, [G.sand[2]]);
  },
  ash(pc, rng) {
    noiseFill(pc, [G.ash[0], G.ash[1], G.ash[2], G.ash[2], G.ash[3]], { seed: 91, scale: 4 });
    speckle(pc, rng, 6, [hex('#e08a4a'), hex('#c04a2a')]);
    cracks(pc, rng, 3, G.ash[0]);
  },
  carpet(pc) {
    pc.rect(0, 0, 32, 32, G.carpet[2]);
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if ((x + y) % 8 === 0 || (x - y + 64) % 8 === 0) pc.set(x, y, G.carpet[1]);
    pc.rect(0, 0, 32, 2, G.gold[2]); pc.rect(0, 30, 32, 2, G.gold[2]);
  },
  carpet_blue(pc) {
    pc.rect(0, 0, 32, 32, G.carpetBlue[2]);
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) if ((x * 3 + y) % 11 === 0) pc.set(x, y, G.carpetBlue[3]);
  },
  ice(pc, rng) {
    noiseFill(pc, [G.ice[1], G.ice[2], G.ice[3], G.ice[3], G.ice[4]], { seed: 101, scale: 3 });
    for (let i = 0; i < 4; i++) { const x = rng.int(0, 31), y = rng.int(0, 31); pc.line(x, y, x + 6, y - 3, hex('#ffffff')); }
    cracks(pc, rng, 2, G.ice[0]);
  },
  moss(pc, rng) {
    noiseFill(pc, [G.moss[0], G.moss[1], G.moss[2], G.stone[2], G.stone[1]], { seed: 111, scale: 4 });
    speckle(pc, rng, 10, [G.moss[3]]);
  },
  lava(pc, rng) {
    noiseFill(pc, [G.lava[0], G.lava[1], G.lava[2], G.lava[3], G.lava[4]], { seed: 121, scale: 4 });
    cracks(pc, rng, 5, hex('#3a1a1a'));
  },
  gloam(pc, rng) {
    noiseFill(pc, [G.gloam[0], G.gloam[1], G.gloam[1], G.gloam[2], G.gloam[3]], { seed: 131, scale: 4 });
    speckle(pc, rng, 8, [hex('#c08aff'), hex('#6a4aaa')]);
  },
  water(pc, rng) {
    const W = ramp('#2f6f9f');
    noiseFill(pc, [W[1], W[2], W[2], W[3], W[3]], { seed: 141, scale: 3 });
    speckle(pc, rng, 6, [W[4]]);
  },

  // ----- sides / walls -----
  cliff_grass(pc, rng) {
    noiseFill(pc, [G.dirt[0], G.dirt[1], G.dirt[1], G.dirt[2], G.dirt[2]], { seed: 201, scale: 4 });
    // strata
    for (let y = 8; y < 32; y += 7) for (let x = 0; x < 32; x++) if (hash2(x, y, 3) > 0.25) pc.set(x, y + (x % 5 === 0 ? 1 : 0), G.dirt[0]);
    pebbles(pc, rng, 4, G.stone);
    // grass lip with hanging blades
    for (let x = 0; x < 32; x++) {
      const h = 3 + Math.round(hash2(x, 0, 9) * 3);
      for (let y = 0; y < h; y++) pc.set(x, y, y === h - 1 ? G.grass[1] : G.grass[y === 0 ? 3 : 2]);
    }
  },
  cliff_rock(pc, rng) {
    noiseFill(pc, [G.stone[0], G.stone[1], G.stone[1], G.stone[2], G.stone[3]], { seed: 211, scale: 4 });
    for (let i = 0; i < 6; i++) {
      const x = rng.int(0, 31), y = rng.int(0, 31), w = rng.int(5, 12), h = rng.int(3, 6);
      pc.rect(x, y, w, 1, G.stone[3]);
      pc.rect(x, y + h, w, 1, G.stone[0]);
    }
    cracks(pc, rng, 3, G.stone[0]);
  },
  cliff_sand(pc, rng) {
    noiseFill(pc, [G.sand[0], G.sand[1], G.sand[1], G.sand[2], G.sand[2]], { seed: 221, scale: 4 });
    for (let y = 4; y < 32; y += 5) for (let x = 0; x < 32; x++) if (hash2(x, y, 7) > 0.3) pc.set(x, y, G.sand[0]);
  },
  cliff_snow(pc, rng) {
    PAINTERS.cliff_rock(pc, rng);
    for (let x = 0; x < 32; x++) {
      const h = 3 + Math.round(hash2(x, 1, 9) * 4);
      for (let y = 0; y < h; y++) pc.set(x, y, G.snow[y === h - 1 ? 1 : 3]);
    }
  },
  cliff_cave(pc, rng) {
    noiseFill(pc, [G.cave[0], G.cave[0], G.cave[1], G.cave[1], G.cave[2]], { seed: 231, scale: 4 });
    cracks(pc, rng, 4, hex('#2a2430'));
  },
  wall_stone(pc, rng) { bricks(pc, G.stone, G.stone[0], 10, 6, rng); },
  wall_brick(pc, rng) { bricks(pc, G.brick, hex('#d8ccb8'), 8, 4, rng); },
  wall_ruin(pc, rng) { bricks(pc, G.ruin, G.ruin[0], 10, 6, rng); cracks(pc, rng, 4, G.ruin[0]); for (let i = 0; i < 4; i++) pc.ellipse(rng.int(0, 31), rng.int(0, 31), 3, 2, G.moss[2]); },
  wall_wood(pc, rng) { planks(pc, G.wood, true, rng, 5); },
  wall_plaster(pc, rng) {
    noiseFill(pc, [G.plaster[1], G.plaster[2], G.plaster[2], G.plaster[3], G.plaster[3]], { seed: 241, scale: 3 });
    speckle(pc, rng, 8, [G.plaster[0]]);
  },
  wall_timber(pc, rng) {
    PAINTERS.wall_plaster(pc, rng);
    const T = G.woodDark;
    pc.rect(0, 0, 32, 3, T[2]); pc.rect(0, 29, 32, 3, T[1]);
    pc.rect(0, 0, 3, 32, T[2]); pc.rect(29, 0, 3, 32, T[1]);
    pc.thickLine(2, 30, 29, 2, 2, T[2]);
  },
  wall_marble(pc, rng) { PAINTERS.marble(pc, rng); for (let x = 0; x < 32; x += 8) pc.rect(x, 0, 1, 32, G.marble[1]); },
  wall_ice(pc, rng) { PAINTERS.ice(pc, rng); },
  wall_gloam(pc, rng) { PAINTERS.gloam(pc, rng); cracks(pc, rng, 5, hex('#b07aff')); },

  // ----- roofs -----
  roof_red(pc) { roofTiles(pc, G.roofRed); },
  roof_blue(pc) { roofTiles(pc, G.roofBlue); },
  roof_green(pc) { roofTiles(pc, G.roofGreen); },
  roof_slate(pc) { roofTiles(pc, G.slate, 4); },
  roof_thatch(pc, rng) {
    noiseFill(pc, [G.thatch[0], G.thatch[1], G.thatch[2], G.thatch[3], G.thatch[3]], { seed: 251, scale: 6 });
    for (let i = 0; i < 70; i++) { const x = rng.int(0, 31), y = rng.int(0, 31); pc.line(x, y, x, y + 3, G.thatch[rng.int(1, 4)]); }
    for (let y = 7; y < 32; y += 8) pc.rect(0, y, 32, 1, G.thatch[0]);
  },

  // ----- decals -----
  door(pc) {
    const W = G.woodDark;
    pc.rect(0, 0, 32, 32, W[0]);
    const inner = new PixelCanvas(28, 30);
    planks(inner, W, true, new RNG(5), 7);
    pc.blit(inner, 2, 2);
    pc.rect(22, 16, 3, 3, G.gold[3]);
    pc.rect(0, 0, 32, 2, W[0]); pc.rect(0, 0, 2, 32, W[0]); pc.rect(30, 0, 2, 32, W[0]);
  },
  window(pc) {
    const W = G.woodDark;
    pc.rect(0, 0, 32, 32, W[1]);
    pc.rect(3, 3, 26, 26, hex('#ffd890'));
    pc.rect(3, 3, 26, 8, hex('#fff0c0'));
    pc.rect(15, 3, 2, 26, W[1]); pc.rect(3, 15, 26, 2, W[1]);
  },
  window_dark(pc) {
    const W = G.woodDark;
    pc.rect(0, 0, 32, 32, W[1]);
    pc.rect(3, 3, 26, 26, hex('#2a3448'));
    pc.rect(5, 5, 6, 3, hex('#5a6a8a'));
    pc.rect(15, 3, 2, 26, W[1]); pc.rect(3, 15, 26, 2, W[1]);
  },
};

function roofTiles(pc, rmp, rowH = 5) {
  for (let y = 0; y < 32; y++) {
    const row = Math.floor(y / rowH);
    const off = row % 2 ? 4 : 0;
    for (let x = 0; x < 32; x++) {
      const bx = (x + off) % 8, by = y % rowH;
      let c = rmp[2];
      if (by === rowH - 1) c = rmp[0];
      else if (by === 0) c = rmp[3];
      else if (bx === 0) c = rmp[1];
      else if (bx === 1 && by < 3) c = rmp[4];
      pc.set(x, y, c);
    }
  }
}

// Number of variants per texture.
const VARIANTS = {
  grass: 4, grass_dark: 3, grass_autumn: 3, grass_dead: 3, dirt: 3, path: 3, cobble: 3, stone: 2, sand: 3,
  snow: 3, mud: 2, cave: 3, ruin: 3, glass: 2, ash: 3, ice: 2, moss: 2, gloam: 2, lava: 2,
  cliff_grass: 2, cliff_rock: 2, cliff_cave: 2,
};

// ---------------------------------------------------------------------------

export class TileAtlas {
  constructor() {
    this.index = new Map(); // name -> [slot,...]
    const names = Object.keys(PAINTERS);
    /** @type {Array<[string, number]>} */
    const slots = [];
    for (const name of names) {
      const n = VARIANTS[name] || 1;
      const list = [];
      for (let v = 0; v < n; v++) { list.push(slots.length); slots.push([name, v]); }
      this.index.set(name, list);
    }
    const rows = Math.ceil(slots.length / ATLAS_COLS);
    this.cols = ATLAS_COLS;
    this.rows = rows;
    const atlas = new PixelCanvas(ATLAS_COLS * TILE_PX, rows * TILE_PX);
    slots.forEach(([name, v], i) => {
      const pc = new PixelCanvas(TILE_PX, TILE_PX);
      PAINTERS[name](pc, new RNG(1000 + i * 31 + v * 7), v);
      atlas.blit(pc, (i % ATLAS_COLS) * TILE_PX, Math.floor(i / ATLAS_COLS) * TILE_PX);
    });
    this.canvas = atlas.toCanvas();
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.generateMipmaps = false;
    this.texture.colorSpace = THREE.SRGBColorSpace;
  }

  has(name) { return this.index.has(name); }

  variantCount(name) { return (this.index.get(name) || [0]).length; }

  /** UV rect for a texture variant; half-texel inset avoids bleeding. */
  uv(name, variant = 0) {
    const list = this.index.get(name) || this.index.get('grass');
    const slot = list[variant % list.length];
    const W = this.cols * TILE_PX, H = this.rows * TILE_PX;
    const x = (slot % this.cols) * TILE_PX, y = Math.floor(slot / this.cols) * TILE_PX;
    const e = 0.5;
    return { u0: (x + e) / W, u1: (x + TILE_PX - e) / W, v0: 1 - (y + TILE_PX - e) / H, v1: 1 - (y + e) / H };
  }

  /** A standalone repeating texture of one tile (for large planes). */
  standalone(name, variant = 0) {
    const pc = new PixelCanvas(TILE_PX, TILE_PX);
    PAINTERS[name](pc, new RNG(77 + variant), variant);
    const tex = new THREE.CanvasTexture(pc.toCanvas());
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
}

let atlasSingleton = null;
export function getTileAtlas() {
  if (!atlasSingleton) atlasSingleton = new TileAtlas();
  return atlasSingleton;
}

export { mix };
