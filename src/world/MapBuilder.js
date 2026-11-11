// Builds the 3D diorama for a map definition (see docs/MAPS.md):
// terraced terrain with baked corner AO, water, billboard props, buildings,
// special structures, plus the collision grid and light sources.

import * as THREE from 'three';
import { GeometryBuilder } from './GeometryBuilder.js';
import { GROUND, PROP_CHARS, DECOR_TYPES, HEIGHT_STEP } from './Legend.js';
import { getTileAtlas } from '../render/TextureFactory.js';
import { getPropSprite } from '../render/PropFactory.js';
import { getTransitionMasks, MASK_VARIANTS } from '../render/TransitionMasks.js';
import { hash2 } from '../core/util.js';

// ---------------------------------------------------------------------------
// Shared materials
// ---------------------------------------------------------------------------

export const windUniform = { value: 0 };

/** Pixel sprite material with alpha cutout, optional glow and wind sway. */
export function makeSpriteMaterial(texture, { glowMap = null, glow = 0, sway = 0 } = {}) {
  const mat = new THREE.MeshLambertMaterial({
    map: texture, alphaTest: 0.5, side: THREE.DoubleSide,
  });
  if (glow > 0 && glowMap) {
    mat.emissive = new THREE.Color(0xffffff);
    mat.emissiveMap = glowMap;
    mat.emissiveIntensity = glow;
  }
  if (sway > 0) {
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uWind = windUniform;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uWind;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          #ifdef USE_INSTANCING
            vec3 wp = (instanceMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;
          #else
            vec3 wp = (modelMatrix * vec4(0.0,0.0,0.0,1.0)).xyz;
          #endif
          float bend = max(0.0, uv.y - 0.35);
          transformed.x += sin(uWind * 1.6 + wp.x * 0.7 + wp.z * 0.4) * bend * bend * ${(0.12 * sway).toFixed(3)};`);
    };
  }
  return mat;
}

export function makeDepthMaterial(texture) {
  return new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: texture, alphaTest: 0.5, side: THREE.DoubleSide });
}

/** Extract bright pixels of a canvas as an emissive mask texture. */
const glowCache = new WeakMap();
export function glowMaskFor(canvas) {
  if (glowCache.has(canvas)) return glowCache.get(canvas);
  const cv = document.createElement('canvas');
  cv.width = canvas.width; cv.height = canvas.height;
  const ctx = cv.getContext('2d');
  ctx.drawImage(canvas, 0, 0);
  const img = ctx.getImageData(0, 0, cv.width, cv.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const l = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
    const sat = (Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2])) / 255;
    const keep = l > 0.62 || (sat > 0.5 && l > 0.45);
    if (!keep) { d[i] = d[i + 1] = d[i + 2] = 0; }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  glowCache.set(canvas, tex);
  return tex;
}

// ---------------------------------------------------------------------------
// Water
// ---------------------------------------------------------------------------

/**
 * Water: a pixel-stepped surface over a distance field (vDist: tiles to the nearest
 * shore, per corner) and the floor's depth under it (vDepth). Shallows are light and
 * clear, the open water deep and opaque; two wave trains drift across it as thin
 * bright crests; foam hugs the shore and breathes in and out, and fresh foam lines
 * roll in toward it and fade; light ripples over shallow floors; glints sparkle.
 * Murky water (swamps) moves slowly and burps the odd bubble.
 */
function makeWaterMaterial(murky) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: true,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        time: { value: 0 },
        deep: { value: new THREE.Color(murky ? '#33432c' : '#174e80') },
        shallow: { value: new THREE.Color(murky ? '#5c6c40' : '#58b4cc') },
        foam: { value: new THREE.Color(murky ? '#8a9070' : '#eef9ff') },
        foamAmt: { value: murky ? 0.35 : 0.85 },
        speed: { value: murky ? 0.35 : 1.0 },
        murk: { value: murky ? 1 : 0 },
      },
    ]),
    vertexShader: /* glsl */`
      attribute float dist;
      attribute float depth;
      attribute vec4 landEdge;
      attribute vec4 landCorner;
      varying vec2 vWorld;
      varying float vDist;
      varying float vDepth;
      varying vec4 vEdge;
      varying vec4 vCorner;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xz;
        vDist = dist;
        vDepth = depth;
        vEdge = landEdge;
        vCorner = landCorner;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */`
      uniform float time, foamAmt, speed, murk;
      uniform vec3 deep, shallow, foam;
      varying vec2 vWorld;
      varying float vDist;
      varying float vDepth;
      varying vec4 vEdge;   // land beyond this tile's north, east, south, west edge
      varying vec4 vCorner; // land beyond its north-east, south-east, south-west, north-west corner
      #include <fog_pars_fragment>
      float h(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5); }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
      }
      void main() {
        float t = time * speed;
        vec2 p = floor(vWorld * 16.0) / 16.0;            // the pixel grid of the art
        // Tiles from the shore: exact inside a tile that touches land (so a one-tile
        // pool keeps open water in its middle), the smooth field farther out.
        vec2 l = fract(p + 0.001);
        float big = 9.0;
        float dl = big;
        dl = min(dl, mix(big, l.y, vEdge.x));
        dl = min(dl, mix(big, 1.0 - l.x, vEdge.y));
        dl = min(dl, mix(big, 1.0 - l.y, vEdge.z));
        dl = min(dl, mix(big, l.x, vEdge.w));
        dl = min(dl, mix(big, length(l - vec2(1.0, 0.0)), vCorner.x));
        dl = min(dl, mix(big, length(l - vec2(1.0, 1.0)), vCorner.y));
        dl = min(dl, mix(big, length(l - vec2(0.0, 1.0)), vCorner.z));
        dl = min(dl, mix(big, length(l), vCorner.w));
        float d = dl < big ? dl : max(vDist, 1.0);
        float n = vnoise(p * 0.9 + vec2(t * 0.05, -t * 0.04));
        // Color by depth: light over sand and near shore, deep in open water.
        float deepness = clamp(d * 0.32 + vDepth * 0.9 + (n - 0.5) * 0.25, 0.0, 1.0);
        vec3 c = mix(shallow, deep, deepness);
        // A slow swell, then two wave trains: thin crests that drift and break up.
        c *= 0.94 + 0.08 * sin(p.x * 0.45 + p.y * 0.3 + t * 0.6);
        // Wavelets: short two-tone ticks (a light row over a dark one) that form, drift
        // with the current and fade, a few to every patch of water.
        vec2 P = floor(vWorld * 16.0 + vec2(t * 1.6, 0.0));
        vec2 cell = floor(P / vec2(8.0, 4.0));
        vec2 lp = P - cell * vec2(8.0, 4.0);
        float life = fract(t * 0.3 + h(cell) * 7.0);
        float shown = step(0.4, h(cell + 3.1)) * step(life, 0.55);
        float len = floor((3.0 + h(cell + 5.3) * 4.0) * sin(life / 0.55 * 3.14159));
        float sx = floor(h(cell + 7.7) * (8.0 - len));
        float sy = floor(h(cell + 9.9) * 3.0);
        float inRow = step(sx, lp.x) * step(lp.x, sx + len - 1.0);
        float lite = shown * inRow * (1.0 - abs(sign(lp.y - sy)));
        float dark = shown * step(sx + 1.0, lp.x) * step(lp.x, sx + len - 2.0) * (1.0 - abs(sign(lp.y - sy - 1.0)));
        float calm = clamp(d * 1.5, 0.0, 1.0); // ripples settle right at the shore
        c += lite * mix(0.15, 0.06, murk) * calm;
        c -= dark * mix(0.08, 0.04, murk) * calm;
        // Light rippling over shallow floors.
        float ca = vnoise(p * 3.0 + vec2(t * 0.35, t * 0.2)) + vnoise(p * 3.0 - vec2(t * 0.25, -t * 0.3));
        float caustic = step(1.32, ca) * (1.0 - smoothstep(0.0, 1.6, d + vDepth)) * (1.0 - murk);
        c += caustic * 0.12;
        // Foam: a band on the shore that breathes, and lines rolling in that fade.
        float ragged = vnoise(p * 7.0 + vec2(t * 0.4, -t * 0.3)) - 0.5;
        float edge = 0.13 + 0.06 * sin(t * 1.6 + p.x * 1.3 + p.y * 1.1) + ragged * 0.12;
        float f = step(d, edge);
        float roll = fract(d * 1.1 + t * 0.32 + n * 0.35);
        float line = step(roll, 0.07) * step(d, 1.15) * step(0.3, d) * step(0.35, n);
        f = max(f, line * (1.15 - d));
        c = mix(c, foam, clamp(f, 0.0, 1.0) * foamAmt);
        // Glints on clear water; bubbles on murky.
        float glint = step(0.9975, h(p + floor(t * 3.0))) * (1.0 - murk);
        float bubble = step(0.9985, h(floor(p * 2.0) + floor(t * 0.7))) * murk;
        c += glint * 0.85 + bubble * 0.35;
        float alpha = mix(0.68, 0.97, deepness); // shallow floors show; deep ones barely
        alpha = mix(alpha, 0.95, f * foamAmt);
        gl_FragColor = vec4(c, alpha);
        #include <fog_fragment>
      }
    `,
  });
}

// ---------------------------------------------------------------------------
// Tile grid
// ---------------------------------------------------------------------------

export class TileGrid {
  constructor(map) {
    this.w = Math.max(...map.ground.map((r) => r.length));
    this.h = map.ground.length;
    this.ground = map.ground;
    this.heights = map.height || null;
    this.legend = { ...GROUND, ...(map.legend || {}) };
    this.blocked = new Uint8Array(this.w * this.h);
    this.tags = new Map(); // "x,y" -> tag info (doors, etc.)
    this.counters = new Set(); // "x,y" of tables: shopkeepers can be spoken to across them
  }

  inside(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }

  char(x, y) {
    if (!this.inside(x, y)) return ' ';
    return this.ground[y][x] ?? ' ';
  }

  def(x, y) { return this.legend[this.char(x, y)] || GROUND['.']; }

  level(x, y) {
    if (!this.heights || !this.inside(x, y)) return 0;
    const ch = this.heights[y]?.[x];
    if (!ch || ch === ' ' || ch === '.') return 0;
    const n = parseInt(ch, 36); // 0-9 then a-z for 10+
    return Number.isNaN(n) ? 0 : n;
  }

  /** Elevation of the walkable surface (world units). */
  surface(x, y) {
    const d = this.def(x, y);
    const base = this.level(x, y) * HEIGHT_STEP;
    if (d.water) return d.shallow ? base - 0.3 : base - 0.8;
    if (d.wall) return base + d.raise * HEIGHT_STEP;
    return base;
  }

  /** Top of geometry used for side faces (void = deep drop). */
  solidTop(x, y) {
    const d = this.def(x, y);
    if (!this.inside(x, y) || d.void) return -6;
    return this.surface(x, y);
  }

  walkable(x, y) {
    if (!this.inside(x, y)) return false;
    const d = this.def(x, y);
    if (d.void || d.wall || d.solid) return false;
    if (d.water && !d.shallow) return false;
    return !this.blocked[y * this.w + x];
  }

  canStep(fx, fy, tx, ty) {
    if (!this.walkable(tx, ty)) return false;
    const dh = Math.abs(this.level(tx, ty) - this.level(fx, fy));
    return dh <= 1 || this.isStairs(tx, ty) || this.isStairs(fx, fy);
  }

  /** A table/counter tile: talking reaches across it. */
  isCounter(x, y) { return this.counters.has(`${x},${y}`); }

  isStairs(x, y) { return this.tags.get(`${x},${y}`)?.stairs === true; }

  /**
   * Which way a stair tile climbs: [dx, dy] toward the higher neighbor it leads up to
   * (a stair first, else any walkable ground up to three levels higher), or null for a
   * flat stair tile (the top of a flight, a landing). Cached.
   */
  stairUp(x, y) {
    const key = `${x},${y}`;
    if (!this.upCache) this.upCache = new Map();
    if (this.upCache.has(key)) return this.upCache.get(key);
    let best = null, bestScore = -Infinity;
    if (this.isStairs(x, y)) {
      const lv = this.level(x, y);
      for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
        const nx = x + dx, ny = y + dy;
        const d = this.def(nx, ny);
        const diff = this.level(nx, ny) - lv;
        if (!this.inside(nx, ny) || d.void || d.wall || d.water || diff < 1 || diff > 3) continue;
        const score = (this.isStairs(nx, ny) ? 10 : 0) - diff;
        if (score > bestScore) { bestScore = score; best = [dx, dy]; }
      }
    }
    this.upCache.set(key, best);
    return best;
  }

  /**
   * Walking height at a point (world x, z): the tile's surface, except on a stair
   * tile, where it climbs evenly toward the step above so feet follow the steps.
   */
  surfaceAt(px, pz) {
    const x = Math.floor(px), y = Math.floor(pz);
    const base = this.surface(x, y);
    const up = this.stairUp(x, y);
    if (!up) return base;
    const rise = this.surface(x + up[0], y + up[1]) - base;
    const fx = px - x, fz = pz - y;
    const t = up[0] ? (up[0] > 0 ? fx : 1 - fx) : (up[1] > 0 ? fz : 1 - fz);
    return base + rise * Math.max(0, Math.min(1, t));
  }

  block(x, y, v = 1) { if (this.inside(x, y)) this.blocked[y * this.w + x] = v; }
}

// ---------------------------------------------------------------------------
// Ground transitions, cliff lips and stairs
// ---------------------------------------------------------------------------

// Which ground spills over which where two meet on one level: a higher number spills
// its edge (ragged, through TransitionMasks) onto a lower one. Only natural ground
// spills; paving and floors only receive (grass at the edge of a cobbled street).
const SPILL = {
  snow: 9, grass_dark: 8.6, grass: 8.4, grass_autumn: 8.2, moss: 7.6, grass_dead: 7, ash: 6.5,
  sand: 5, path: 4.2, dirt: 4, mud: 3.5,
};
const RECEIVE = { ...SPILL, cobble: 2, ruin: 2, cave: 2, ice: 2, glass: 2 };

// Tops that hang a ragged lip over the cliff faces below them.
const LIPPED = new Set(['grass', 'grass_dark', 'grass_autumn', 'grass_dead', 'moss', 'snow']);

/** The face of a stair step, by what the step is made of. */
function riserFor(top) {
  switch (top) {
    case 'stone': case 'cobble': case 'snow': case 'ice': return 'riser_stone';
    case 'marble': case 'carpet': case 'carpet_blue': return 'riser_marble';
    case 'wood': case 'wood_dark': return 'riser_wood';
    case 'ruin': return 'riser_ruin';
    case 'cave': case 'glass': case 'gloam': case 'ash': case 'lava': return 'riser_cave';
    default: return 'riser_earth';
  }
}

const DIRS4 = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const DIRS_DIAG = [[1, -1], [1, 1], [-1, 1], [-1, -1]];

/** Quads with two UV sets: the ground texture, and the mask that cuts its shape. */
class OverlayBuilder {
  constructor() { this.pos = []; this.norm = []; this.uv = []; this.uv1 = []; this.col = []; this.idx = []; }

  /** pts: four corners; tex/mask: [u, v] per corner; shade per corner. */
  quad(pts, tex, mask, normal, shades) {
    const base = this.pos.length / 3;
    for (let i = 0; i < 4; i++) {
      this.pos.push(...pts[i]);
      this.norm.push(...normal);
      this.uv.push(...tex[i]);
      this.uv1.push(...mask[i]);
      this.col.push(shades[i], shades[i], shades[i]);
    }
    this.idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }

  build() {
    if (!this.idx.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.norm, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('uv1', new THREE.Float32BufferAttribute(this.uv1, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    return g;
  }
}

const lerpRect = (r, u, v) => [r.u0 + u * (r.u1 - r.u0), r.v0 + v * (r.v1 - r.v0)];

/**
 * Mask coordinates for a corner of a top face (lx east, ly north, 0..1), turned so
 * the mask's edge (its top, v = 1) lies toward neighbor direction [dx, dy].
 */
function maskLocal(dx, dy, lx, ly) {
  if (dx && dy) return [dx > 0 ? 1 - lx : lx, dy > 0 ? 1 - ly : ly]; // a corner: mask corner at top-left
  if (dy < 0) return [lx, ly]; // north
  if (dy > 0) return [1 - lx, 1 - ly]; // south
  if (dx > 0) return [ly, lx]; // east
  return [1 - ly, 1 - lx]; // west
}

/** Ragged overlays where a spilling ground meets a receiving one on the same level. */
function addFringes(ob, grid, atlas, masks, x, y, top, topTex, ao, variant) {
  const mine = RECEIVE[topTex];
  if (mine === undefined) return;
  const lv = grid.level(x, y);
  const spill = (nx, ny) => {
    const nd = grid.def(nx, ny);
    if (!grid.inside(nx, ny) || nd.void || nd.wall || nd.water || grid.level(nx, ny) !== lv) return null;
    const p = SPILL[nd.top];
    return p !== undefined && p > mine && nd.top !== topTex ? nd.top : null;
  };
  const found = [];
  for (const [dx, dy] of DIRS4) { const t = spill(x + dx, y + dy); if (t) found.push([dx, dy, t]); }
  for (const [dx, dy] of DIRS_DIAG) {
    const t = spill(x + dx, y + dy);
    // A diagonal only adds its corner where neither edge beside it already spills.
    if (t && !found.some(([ex, ey, et]) => et === t && ((ex === dx && ey === 0) || (ey === dy && ex === 0)))) found.push([dx, dy, t]);
  }
  found.sort((a, b) => SPILL[a[2]] - SPILL[b[2]]);
  const corners = [[0, 0], [1, 0], [1, 1], [0, 1]]; // lx, ly of SW, SE, NE, NW
  const pts = [[x, 0, y + 1], [x + 1, 0, y + 1], [x + 1, 0, y], [x, 0, y]];
  const shades = [ao(x, y + 1), ao(x + 1, y + 1), ao(x + 1, y), ao(x, y)];
  found.forEach(([dx, dy, tex], k) => {
    const lift = top + 0.003 + k * 0.001;
    const r = atlas.uv(tex, variant(x, y, tex));
    const m = masks.uv(dx && dy ? 'corner' : 'edge', Math.floor(hash2(x * 3 + dx, y * 3 + dy, 61) * MASK_VARIANTS));
    ob.quad(
      pts.map((p) => [p[0], lift, p[2]]),
      corners.map(([lx, ly]) => lerpRect(r, lx, ly)),
      corners.map(([lx, ly]) => lerpRect(m, ...maskLocal(dx, dy, lx, ly))),
      [0, 1, 0], shades,
    );
  });
}

/** A ragged lip of the top ground hanging over a cliff face (origin, along, normal). */
function addLip(ob, atlas, masks, x, y, top, height, topTex, origin, along, normal, variant) {
  const h = Math.min(0.25, height);
  const out = 0.006;
  const o = [origin[0] + normal[0] * out, top - h, origin[2] + normal[2] * out];
  const p1 = [o[0] + along[0], o[1], o[2] + along[2]];
  const pts = [o, p1, [p1[0], top, p1[2]], [o[0], top, o[2]]];
  const r = atlas.uv(topTex, variant(x, y, topTex));
  const m = masks.uv('lip', Math.floor(hash2(x + normal[0] * 7, y + normal[2] * 7, 67) * MASK_VARIANTS));
  const quad = [[0, 1 - h], [1, 1 - h], [1, 1], [0, 1]];
  ob.quad(pts, quad.map(([u, v]) => lerpRect(r, u, v)), quad.map(([u, v]) => lerpRect(m, u, v)), normal, [0.9, 0.9, 1, 1]);
}

/**
 * A stair tile's half-step: a block on the half of the tile toward the step above,
 * half the rise high, so every rise of the flight reads as two shallow steps with a
 * proper tread and riser. Returns nothing; adds to the terrain geometry.
 */
function addHalfStep(gb, grid, atlas, x, y, top, topTex, variant) {
  const up = grid.stairUp(x, y);
  if (!up) return;
  const rise = (grid.surface(x + up[0], y + up[1]) - top) / 2;
  if (rise <= 0.01) return;
  const h = top + rise;
  // The block's footprint: [x0, x1] × [z0, z1].
  let x0 = x, x1 = x + 1, z0 = y, z1 = y + 1;
  if (up[0] > 0) x0 = x + 0.5; else if (up[0] < 0) x1 = x + 0.5;
  else if (up[1] > 0) z0 = y + 0.5; else z1 = y + 0.5;
  const tread = atlas.uv(topTex, variant(x, y, topTex));
  const half = up[0] ? { u0: tread.u0, u1: tread.u0 + (tread.u1 - tread.u0) / 2, v0: tread.v0, v1: tread.v1 } : { ...tread, v0: tread.v0 + (tread.v1 - tread.v0) / 2 };
  gb.quad([x0, h, z1], [x1, h, z1], [x1, h, z0], [x0, h, z0], half, [0, 1, 0]);
  // Faces: the riser facing down the flight, and the flanks where they show.
  const riserTex = riserFor(topTex);
  const faces = [
    { n: [0, 0, 1], o: [x0, top, z1], u: [1, 0, 0], len: x1 - x0, nx: x, ny: y + 1 },
    { n: [1, 0, 0], o: [x1, top, z1], u: [0, 0, -1], len: z1 - z0, nx: x + 1, ny: y },
    { n: [-1, 0, 0], o: [x0, top, z0], u: [0, 0, 1], len: z1 - z0, nx: x - 1, ny: y },
    { n: [0, 0, -1], o: [x1, top, z0], u: [-1, 0, 0], len: x1 - x0, nx: x, ny: y - 1 },
  ];
  for (const f of faces) {
    const facingUp = f.n[0] === up[0] && f.n[2] === up[1];
    if (facingUp) continue; // into the step above
    const facingDown = f.n[0] === -up[0] && f.n[2] === -up[1];
    if (!facingDown) {
      // A flank: hidden by a neighbor as high, or by the same half-step beside it.
      const nUp = grid.stairUp(f.nx, f.ny);
      const same = nUp && nUp[0] === up[0] && nUp[1] === up[1] && grid.level(f.nx, f.ny) === grid.level(x, y);
      if (same || grid.solidTop(f.nx, f.ny) >= h - 0.001) continue;
    }
    const tex = atlas.uv(riserTex, 0);
    gb.tiledQuad(f.o, f.u, [0, 1, 0], f.len, rise, f.n, () => tex, () => [0.8, 1]);
  }
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

const AO = 0.62;

/**
 * Optional `map.scatter = { types: ['rock_small', 'mushroom_glow'], density: 0.05, seed }`:
 * sprinkle non-solid decor over open dry floor (deterministic per tile), so sparse
 * caves and halls get texture without hand-placing every pebble. Decor never blocks
 * movement, so reachability is unaffected.
 */
function scatterDecor(map, grid) {
  const { types = ['rock_small'], density = 0.05, seed = 7 } = map.scatter;
  const decorChars = types.map((t) => Object.keys(PROP_CHARS).find((c) => PROP_CHARS[c] === t && DECOR_TYPES.has(t))).filter(Boolean);
  const rows = map.props || [];
  return Array.from({ length: grid.h }, (_, y) => [...(rows[y] || '').padEnd(grid.w, ' ')].map((ch, x) => {
    if ((ch !== ' ' && ch !== '.') || !decorChars.length || !grid.walkable(x, y) || grid.def(x, y).water) return ch;
    return hash2(x, y, seed) < density ? decorChars[Math.floor(hash2(x, y, seed + 1) * decorChars.length)] : ch;
  }).join(''));
}

export function buildMap(map, { windows = false } = {}) {
  const atlas = getTileAtlas();
  const grid = new TileGrid(map);
  const group = new THREE.Group();
  const lightSources = [];
  const animated = [];
  const fadeables = [];
  const interactables = [];
  const doors = new Map(); // "x,y" of a door tile -> its animated door (see makeDoor)

  // Stairs tags
  for (const s of map.stairs || []) grid.tags.set(`${s.x},${s.y}`, { stairs: true });

  // ---------------- terrain ----------------
  const gb = new GeometryBuilder();
  const ob = new OverlayBuilder(); // ragged ground fringes and cliff lips
  const masks = getTransitionMasks();
  const variant = (x, y, tex) => Math.floor(hash2(x, y, 7) * atlas.variantCount(tex));

  for (let y = 0; y < grid.h; y++) {
    for (let x = 0; x < grid.w; x++) {
      const d = grid.def(x, y);
      if (d.void) continue;
      const top = d.water ? grid.surface(x, y) : grid.surface(x, y);
      const topTex = d.water ? d.bottom : d.top;
      // Top face with corner AO from higher neighbours.
      const ao = (cx, cy) => {
        let occ = 0;
        for (const [ox, oy] of [[cx - 1, cy - 1], [cx, cy - 1], [cx - 1, cy], [cx, cy]]) {
          if (grid.solidTop(ox, oy) > top + 0.01) occ++;
        }
        return occ ? AO + (1 - AO) * (1 - Math.min(occ, 2) / 2) : 1;
      };
      // Seabeds darken with depth (the water over them does the rest).
      const tint = d.water ? (d.shallow ? [0.8, 0.85, 0.9] : [0.5, 0.58, 0.68]) : [1, 1, 1];
      gb.quad(
        [x, top, y + 1], [x + 1, top, y + 1], [x + 1, top, y], [x, top, y],
        atlas.uv(topTex, variant(x, y, topTex)), [0, 1, 0],
        [ao(x, y + 1), ao(x + 1, y + 1), ao(x + 1, y), ao(x, y)], tint,
      );
      if (!d.water && !d.wall) {
        addFringes(ob, grid, atlas, masks, x, y, top, topTex, ao, variant);
        if (grid.isStairs(x, y)) addHalfStep(gb, grid, atlas, x, y, top, topTex, variant);
      }

      // Side faces toward lower neighbours.
      const sideTex = d.side || 'cliff_rock';
      const sides = [
        { nx: x, ny: y + 1, origin: [x, 0, y + 1], u: [1, 0, 0], n: [0, 0, 1] },        // south (faces camera)
        { nx: x + 1, ny: y, origin: [x + 1, 0, y + 1], u: [0, 0, -1], n: [1, 0, 0] },   // east
        { nx: x - 1, ny: y, origin: [x, 0, y], u: [0, 0, 1], n: [-1, 0, 0] },           // west
        { nx: x, ny: y - 1, origin: [x + 1, 0, y], u: [-1, 0, 0], n: [0, 0, -1] },      // north
      ];
      for (const s of sides) {
        const nTop = grid.solidTop(s.nx, s.ny);
        const nDef = grid.def(s.nx, s.ny);
        const bottom = nDef.water && !d.water ? Math.min(nTop, grid.surface(s.nx, s.ny)) : nTop;
        if (bottom >= top - 0.001) continue;
        const height = top - bottom;
        const o = [s.origin[0], bottom, s.origin[2]];
        // A step of a flight shows a riser, not a cliff: this tile's face down the
        // stairs, or a landing's face toward the stair below that climbs to it.
        const dx = s.nx - x, dy = s.ny - y;
        const myUp = grid.stairUp(x, y), theirUp = grid.stairUp(s.nx, s.ny);
        const step = !d.wall && height <= 1.6 && ((myUp && myUp[0] === -dx && myUp[1] === -dy) || (theirUp && theirUp[0] === -dx && theirUp[1] === -dy));
        const faceTex = step ? riserFor(d.top) : sideTex;
        gb.tiledQuad(o, s.u, [0, 1, 0], 1, height, s.n,
          (i, j) => atlas.uv(faceTex, step ? 0 : variant(x + j, y + i * 3, faceTex)),
          (v0, v1) => (step ? [0.8, 1] : [0.55 + 0.45 * v0, 0.55 + 0.45 * v1]));
        if (!step && !d.wall && LIPPED.has(d.top) && !nDef.water) addLip(ob, atlas, masks, x, y, top, height, d.top, [s.origin[0], 0, s.origin[2]], s.u, s.n, variant);
      }
    }
  }
  const terrainMat = new THREE.MeshLambertMaterial({ map: atlas.texture, vertexColors: true });
  const terrain = new THREE.Mesh(gb.build(), terrainMat);
  terrain.receiveShadow = true;
  terrain.castShadow = true;
  group.add(terrain);
  const overlayGeo = ob.build();
  if (overlayGeo) {
    const overlay = new THREE.Mesh(overlayGeo, new THREE.MeshLambertMaterial({
      map: atlas.texture, alphaMap: masks.texture, alphaTest: 0.5, vertexColors: true,
      polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2,
    }));
    overlay.receiveShadow = true;
    group.add(overlay);
  }

  // Lava / glowing ground
  // (handled through emissive tint on the same atlas would bloom everything; keep simple: lights)
  for (let y = 0; y < grid.h; y++) for (let x = 0; x < grid.w; x++) {
    const d = grid.def(x, y);
    if (d.glow && (x + y) % 3 === 0) {
      lightSources.push({ x: x + 0.5, y: grid.surface(x, y) + 0.6, z: y + 0.5, color: '#ff7a3a', intensity: 1.2, distance: 4, flicker: true });
    }
  }

  // ---------------- water ----------------
  const water = buildWater(grid);
  for (const w of water) { group.add(w.mesh); animated.push((t) => { w.mesh.material.uniforms.time.value = t; }); }

  // ---------------- props ----------------
  const propsLayer = map.scatter ? scatterDecor(map, grid) : map.props || [];
  const decorInstances = new Map(); // key -> matrices[]
  const signs = new Map((map.signs || []).map((s) => [`${s.x},${s.y}`, s]));
  for (let y = 0; y < propsLayer.length; y++) {
    const row = propsLayer[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === ' ' || ch === '.') continue;
      let type = PROP_CHARS[ch];
      if (!type) continue;
      if (type === 'tree' && map.treeType) type = map.treeType;
      const v = Math.floor(hash2(x, y, 3) * 4);
      const tile = grid.def(x, y);
      // Props on water (boats, reeds) float at the surface rather than the seabed.
      const elev = tile.water ? grid.level(x, y) * HEIGHT_STEP - 0.35 : grid.surface(x, y);
      if (DECOR_TYPES.has(type)) {
        const key = `${type}:${v}`;
        if (!decorInstances.has(key)) decorInstances.set(key, []);
        decorInstances.get(key).push([x + 0.5 + (hash2(x, y, 9) - 0.5) * 0.5, elev, y + 0.5 + (hash2(x, y, 11) - 0.5) * 0.4]);
        continue;
      }
      const obj = addProp(group, type, v, x + 0.5, elev, y + 0.5, lightSources, windows);
      if (NATURAL.has(type) && !obj.def.footprint) {
        // Trees, bushes and rocks: nudged off the grid, a little bigger or smaller,
        // some mirrored, so a row of them reads as growth and not as a fence.
        const k = 0.9 + hash2(x, y, 47) * 0.22;
        obj.mesh.position.x += (hash2(x, y, 41) - 0.5) * 0.34;
        obj.mesh.position.z += (hash2(x, y, 43) - 0.5) * 0.2;
        obj.mesh.scale.set(hash2(x, y, 53) > 0.5 ? -k : k, k, 1);
      }
      if (obj.def.solid) for (let dx = -(obj.def.footprint || 0); dx <= (obj.def.footprint || 0); dx++) grid.block(x + dx, y);
      if (obj.def.h > 48) fadeables.push(obj.mesh);
      if (type === 'table') grid.counters.add(`${x},${y}`);
      if (type === 'save') interactables.push({ kind: 'save', x, y });
      if (type === 'sign') interactables.push({ kind: 'sign', x, y, text: signs.get(`${x},${y}`)?.text || '...' });
    }
  }
  // Tall grass auto-decor
  for (let y = 0; y < grid.h; y++) for (let x = 0; x < grid.w; x++) {
    if (!grid.def(x, y).tall) continue;
    for (let k = 0; k < 2; k++) {
      const key = `grass_tuft:${k}`;
      if (!decorInstances.has(key)) decorInstances.set(key, []);
      decorInstances.get(key).push([x + 0.25 + hash2(x, y, 20 + k) * 0.5, grid.surface(x, y), y + 0.2 + k * 0.5]);
    }
  }
  for (const [key, list] of decorInstances) {
    const [type, v] = key.split(':');
    const spr = getPropSprite(type, Number(v));
    const geo = new THREE.PlaneGeometry(spr.width, spr.height);
    geo.translate(0, spr.height / 2, 0);
    const mat = makeSpriteMaterial(spr.texture, { sway: spr.def.sway || 0, glow: spr.def.glow || 0, glowMap: spr.def.glow ? glowMaskFor(spr.canvas) : null });
    const inst = new THREE.InstancedMesh(geo, mat, list.length);
    const m = new THREE.Matrix4();
    list.forEach(([px, py, pz], i) => { m.makeTranslation(px, py, pz); inst.setMatrixAt(i, m); });
    inst.receiveShadow = true;
    group.add(inst);
    if (spr.def.light) {
      list.forEach(([px, py, pz], i) => { if (i % 3 === 0) lightSources.push({ x: px, y: py + spr.def.light.y, z: pz, ...spr.def.light }); });
    }
  }

  // ---------------- buildings ----------------
  for (const b of map.buildings || []) {
    const res = buildBuilding(b, grid, atlas, windows);
    group.add(res.mesh);
    if (res.windowMesh) group.add(res.windowMesh);
    if (res.door) { group.add(res.door.object); doors.set(`${res.door.x},${res.door.y}`, res.door); }
    fadeables.push(res.mesh);
    for (const l of res.lights) lightSources.push(l);
  }

  // ---------------- structures ----------------
  for (const s of map.structures || []) {
    const res = buildStructure(s, grid);
    if (!res) continue;
    group.add(res.object);
    if (res.update) animated.push(res.update);
    for (const l of res.lights || []) lightSources.push(l);
  }

  return { group, grid, lightSources, animated, fadeables, interactables, doors };
}

// ---------------------------------------------------------------------------

/** Props that grow or lie where they fell, and get a little natural variation. */
const NATURAL = new Set(['tree', 'pine', 'palm', 'tree_dead', 'tree_cherry', 'tree_crystal', 'bush', 'bush_flower', 'rock', 'stalagmite', 'cactus', 'crystal', 'crystal_gloam']);

function addProp(group, type, variant, x, y, z, lightSources, night = true) {
  const spr = getPropSprite(type, variant);
  const def = spr.def;
  const lit = !def.nightOnly || night;
  const geo = new THREE.PlaneGeometry(spr.width, spr.height);
  geo.translate(0, spr.height / 2 - 0.05, 0);
  const mat = makeSpriteMaterial(spr.texture, {
    sway: def.sway || 0,
    glow: lit ? def.glow || 0 : 0,
    glowMap: def.glow && lit ? glowMaskFor(spr.canvas) : null,
  });
  const mesh = new THREE.Mesh(geo, mat);
  // Most props stand up as billboards; a few lie back toward the floor (beds), their
  // foot near the front of the tile.
  mesh.position.set(x, y, z + (def.lean ? def.leanOffset ?? 0.4 : 0));
  mesh.rotation.x = -(def.lean ?? 0.12);
  if (def.shadow) {
    mesh.castShadow = true;
    mesh.customDepthMaterial = makeDepthMaterial(spr.texture);
  }
  mesh.receiveShadow = true;
  mesh.userData.propType = type;
  group.add(mesh);
  if (def.light && lit) {
    lightSources.push({ x, y: y + def.light.y, z: z + 0.2, ...def.light });
  }
  return { mesh, def };
}

function buildWater(grid) {
  const groups = { clear: new GeometryBuilder(), murky: new GeometryBuilder() };
  const dist = { clear: [], murky: [] };
  const depth = { clear: [], murky: [] };
  const isWater = (x, y) => !!grid.def(x, y).water || !grid.inside(x, y);
  // Distance from each tile corner to the nearest shore (a corner touching land),
  // in tiles, out to CAP: the open sea past the map's edge counts as water.
  const CAP = 4;
  const W = grid.w + 1, H = grid.h + 1;
  const field = new Float32Array(W * H).fill(CAP);
  const queue = [];
  for (let cy = 0; cy < H; cy++) for (let cx = 0; cx < W; cx++) {
    for (const [ox, oy] of [[cx - 1, cy - 1], [cx, cy - 1], [cx - 1, cy], [cx, cy]]) {
      if (!isWater(ox, oy)) { field[cy * W + cx] = 0; queue.push(cx, cy); break; }
    }
  }
  for (let qi = 0; qi < queue.length; qi += 2) {
    const cx = queue[qi], cy = queue[qi + 1];
    const here = field[cy * W + cx];
    for (const [ox, oy, w] of [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.41], [1, -1, 1.41], [-1, 1, 1.41], [-1, -1, 1.41]]) {
      const nx = cx + ox, ny = cy + oy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const nd = here + w;
      if (nd < field[ny * W + nx] - 1e-3) { field[ny * W + nx] = nd; queue.push(nx, ny); }
    }
  }
  // Floor depth at a corner: how deep the water around it is (shallow 0, deep 1).
  const cornerDepth = (cx, cy) => {
    let sum = 0, n = 0;
    for (const [ox, oy] of [[cx - 1, cy - 1], [cx, cy - 1], [cx - 1, cy], [cx, cy]]) {
      const d = grid.def(ox, oy);
      if (!grid.inside(ox, oy)) { sum += 1; n++; } else if (d.water) { sum += d.shallow ? 0 : 1; n++; }
    }
    return n ? sum / n : 0;
  };
  const edges = { clear: [], murky: [] };
  const cornersOut = { clear: [], murky: [] };
  const land = (x, y) => (isWater(x, y) ? 0 : 1);
  const dummyUv = { u0: 0, v0: 0, u1: 1, v1: 1 };
  for (let y = 0; y < grid.h; y++) for (let x = 0; x < grid.w; x++) {
    const d = grid.def(x, y);
    if (!d.water) continue;
    const key = d.murky ? 'murky' : 'clear';
    const e = [land(x, y - 1), land(x + 1, y), land(x, y + 1), land(x - 1, y)];
    const c = [land(x + 1, y - 1), land(x + 1, y + 1), land(x - 1, y + 1), land(x - 1, y - 1)];
    for (let k = 0; k < 4; k++) { edges[key].push(...e); cornersOut[key].push(...c); }
    const lvl = grid.level(x, y) * HEIGHT_STEP - 0.12;
    groups[key].quad([x, lvl, y + 1], [x + 1, lvl, y + 1], [x + 1, lvl, y], [x, lvl, y], dummyUv, [0, 1, 0]);
    for (const [cx, cy] of [[x, y + 1], [x + 1, y + 1], [x + 1, y], [x, y]]) {
      dist[key].push(field[cy * W + cx]);
      depth[key].push(cornerDepth(cx, cy));
    }
  }
  const out = [];
  for (const key of ['clear', 'murky']) {
    if (!dist[key].length) continue;
    const geo = groups[key].build();
    geo.setAttribute('dist', new THREE.Float32BufferAttribute(dist[key], 1));
    geo.setAttribute('depth', new THREE.Float32BufferAttribute(depth[key], 1));
    geo.setAttribute('landEdge', new THREE.Float32BufferAttribute(edges[key], 4));
    geo.setAttribute('landCorner', new THREE.Float32BufferAttribute(cornersOut[key], 4));
    const mesh = new THREE.Mesh(geo, makeWaterMaterial(key === 'murky'));
    mesh.renderOrder = 2;
    out.push({ mesh });
  }
  return out;
}

/** House: walls + gabled roof + door/window decals on the south face. */
function buildBuilding(b, grid, atlas, windowsLit) {
  const gb = new GeometryBuilder();
  const wallTex = b.wall || 'wall_timber';
  const roofTex = b.roof || 'roof_red';
  const H = b.h ?? 2.6;
  const x0 = b.x, x1 = b.x + b.w, z0 = b.y, z1 = b.y + b.d;
  const base = grid.level(b.x, b.y + b.d - 1) * HEIGHT_STEP;
  const shade = (v0, v1) => [0.7 + 0.3 * v0, 0.7 + 0.3 * v1];
  const uvW = () => atlas.uv(wallTex, 0);

  // Walls
  gb.tiledQuad([x0, base, z1], [1, 0, 0], [0, 1, 0], b.w, H, [0, 0, 1], uvW, shade);   // south
  gb.tiledQuad([x1, base, z1], [0, 0, -1], [0, 1, 0], b.d, H, [1, 0, 0], uvW, shade);  // east
  gb.tiledQuad([x0, base, z0], [0, 0, 1], [0, 1, 0], b.d, H, [-1, 0, 0], uvW, shade);  // west
  gb.tiledQuad([x1, base, z0], [-1, 0, 0], [0, 1, 0], b.w, H, [0, 0, -1], uvW, shade); // north

  // Gabled roof, ridge along X.
  const over = 0.35;
  const ridgeH = b.roofH ?? Math.max(1.2, b.d * 0.55);
  const zm = (z0 + z1) / 2;
  const top = base + H;
  const slopeLen = Math.hypot(b.d / 2 + over, ridgeH);
  const uvR = () => atlas.uv(roofTex, 0);
  const southN = new THREE.Vector3(0, b.d / 2 + over, ridgeH).normalize();
  const northN = new THREE.Vector3(0, b.d / 2 + over, -ridgeH).normalize();
  const sDir = [0, ridgeH / slopeLen, -(b.d / 2 + over) / slopeLen];
  gb.tiledQuad([x0 - over, top - over * 0.4, z1 + over], [1, 0, 0], sDir, b.w + over * 2, slopeLen, southN.toArray(), uvR, (v0, v1) => [0.8 + 0.2 * v0, 0.8 + 0.2 * v1]);
  const nDir = [0, ridgeH / slopeLen, (b.d / 2 + over) / slopeLen];
  gb.tiledQuad([x1 + over, top - over * 0.4, z0 - over], [-1, 0, 0], nDir, b.w + over * 2, slopeLen, northN.toArray(), uvR);
  // Gable triangles (east & west) using wall texture — approximated by quads collapsing at top.
  const gableUv = atlas.uv(wallTex, 0);
  for (const [gx, n, flip] of [[x1, [1, 0, 0], false], [x0, [-1, 0, 0], true]]) {
    const a = [gx, top, flip ? z0 : z1], c = [gx, top, flip ? z1 : z0], apex = [gx, top + ridgeH, zm];
    gb.quad(a, c, apex, apex, gableUv, n, [0.8, 0.8, 0.9, 0.9]);
  }

  const mat = new THREE.MeshLambertMaterial({ map: atlas.texture, vertexColors: true, side: THREE.DoubleSide, transparent: false });
  const mesh = new THREE.Mesh(gb.build(), mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // Collision: the whole footprint, door tile included. Walking into the door from
  // the front opens it (FieldScene.tryDoor), so the player never steps into the wall.
  for (let ty = b.y; ty < b.y + b.d; ty++) for (let tx = b.x; tx < b.x + b.w; tx++) grid.block(tx, ty);

  // Door & windows decals
  const dec = new GeometryBuilder();
  const lights = [];
  let door = null;
  if (b.door) {
    const dx = b.x + (b.door.dx ?? Math.floor(b.w / 2));
    door = makeDoor(atlas, dx, base, z1, windowsLit);
    door.x = dx;
    door.y = b.y + b.d - 1;
    grid.tags.set(`${door.x},${door.y}`, { door: b.door });
  }
  const winTex = windowsLit ? 'window' : 'window_dark';
  for (const wx of b.windows || []) {
    const x = b.x + wx;
    dec.quad([x + 0.22, base + 0.9, z1 + 0.02], [x + 0.78, base + 0.9, z1 + 0.02], [x + 0.78, base + 1.5, z1 + 0.02], [x + 0.22, base + 1.5, z1 + 0.02], atlas.uv(winTex, 0), [0, 0, 1]);
    if (windowsLit) lights.push({ x: x + 0.5, y: base + 1.2, z: z1 + 0.6, color: '#ffc880', intensity: 0.9, distance: 3.5 });
  }
  let windowMesh = null;
  if (dec.vertexCount) {
    const dm = new THREE.MeshLambertMaterial({ map: atlas.texture, vertexColors: true, polygonOffset: true, polygonOffsetFactor: -2 });
    if (windowsLit) { dm.emissive = new THREE.Color('#ffb060'); dm.emissiveIntensity = 0.25; }
    windowMesh = new THREE.Mesh(dec.build(), dm);
    windowMesh.receiveShadow = true;
  }
  return { mesh, windowMesh, lights, door };
}

/**
 * A hinged door on a south wall at (x, z): a panel that swings out (setOpen(0..1))
 * over a dark doorway — warm-lit when the windows are.
 */
function makeDoor(atlas, x, base, z, lit) {
  const W = 0.76, H = 1.3;
  const plane = () => new THREE.PlaneGeometry(W, H).translate(W / 2, H / 2, 0); // hinge on the left edge
  const object = new THREE.Group();
  object.position.set(x + 0.12, base, z);

  const doorway = new THREE.Mesh(plane(), new THREE.MeshBasicMaterial({ color: lit ? '#4a2c14' : '#140e0a', polygonOffset: true, polygonOffsetFactor: -2 }));
  doorway.position.z = 0.015;

  const geo = plane();
  const uv = atlas.uv('door', 0);
  const at = geo.attributes.uv; // PlaneGeometry corners: top-left, top-right, bottom-left, bottom-right
  at.setXY(0, uv.u0, uv.v1); at.setXY(1, uv.u1, uv.v1); at.setXY(2, uv.u0, uv.v0); at.setXY(3, uv.u1, uv.v0);
  const mat = new THREE.MeshLambertMaterial({ map: atlas.texture, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -3 });
  if (lit) { mat.emissive = new THREE.Color('#ffb060'); mat.emissiveIntensity = 0.25; }
  const panel = new THREE.Mesh(geo, mat);
  panel.position.z = 0.03;
  panel.receiveShadow = true;

  object.add(doorway, panel);
  return { object, panel, setOpen(k) { panel.rotation.y = -1.45 * k; } };
}

// ---------------------------------------------------------------------------
// Structures
// ---------------------------------------------------------------------------

function repeatTex(name, rx, ry) {
  const t = getTileAtlas().standalone(name);
  t.repeat.set(rx, ry);
  return t;
}

/** The great Lantern tower: stone spire, glowing lamp room and sweeping beam. */
function buildLantern(s, grid) {
  const g = new THREE.Group();
  const base = grid.level(s.x, s.y) * HEIGHT_STEP;
  const lit = s.lit !== false;
  const stone = new THREE.MeshLambertMaterial({ map: repeatTex('wall_stone', 8, 7) });
  const trim = new THREE.MeshLambertMaterial({ color: '#d8c8a8' });
  const roofM = new THREE.MeshLambertMaterial({ map: repeatTex('roof_blue', 6, 2) });

  const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.5, 7.5, 16, 1, true), stone);
  tower.position.y = 3.75;
  tower.castShadow = tower.receiveShadow = true;
  g.add(tower);
  const gallery = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.25, 16), trim);
  gallery.position.y = 7.6;
  gallery.castShadow = true;
  g.add(gallery);
  const glassMat = new THREE.MeshLambertMaterial({
    color: lit ? '#fff2c0' : '#4a5a6a', emissive: lit ? '#ffd27a' : '#000000', emissiveIntensity: lit ? 2.2 : 0, transparent: true, opacity: 0.92,
  });
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 1.3, 12), glassMat);
  lamp.position.y = 8.4;
  g.add(lamp);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.3, 1.4, 12), roofM);
  roof.position.y = 9.75;
  roof.castShadow = true;
  g.add(roof);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.4), new THREE.MeshLambertMaterial({ map: getTileAtlas().standalone('door') }));
  door.position.set(0, 0.7, 1.47);
  g.add(door);

  let beam = null;
  if (lit) {
    const beamMat = new THREE.MeshBasicMaterial({ color: '#ffe6a0', transparent: true, opacity: 0.2, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const beamGeo = new THREE.ConeGeometry(2.2, 22, 16, 8, true);
    beamGeo.translate(0, -11, 0);
    beamGeo.rotateZ(Math.PI / 2); // apex at the lamp, opening along +x
    // Fade toward the open end (additive blending: darker = fainter), so the beam
    // dissolves into the air instead of ending in a hard rim.
    const pos = beamGeo.attributes.position;
    const fade = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) fade.fill(Math.pow(1 - Math.min(1, Math.max(0, pos.getX(i) / 22)), 1.6), i * 3, i * 3 + 3);
    beamGeo.setAttribute('color', new THREE.BufferAttribute(fade, 3));
    beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 8.4;
    g.add(beam);
  }

  g.position.set(s.x + 0.5, base, s.y + 0.5);
  for (let ty = s.y - 1; ty <= s.y + 1; ty++) for (let tx = s.x - 1; tx <= s.x + 1; tx++) grid.block(tx, ty);
  if (s.doorTo) {
    grid.tags.set(`${s.x},${s.y + 1}`, { door: { to: s.doorTo, tx: s.tx, ty: s.ty, dir: s.dir, locked: !!s.unlockFlag, unlockFlag: s.unlockFlag, lockedText: s.lockedText } });
  }
  const lights = lit ? [{ x: s.x + 0.5, y: base + 8.4, z: s.y + 0.5, color: '#ffd890', intensity: 6, distance: 16, priority: 10 }] : [];
  const update = beam ? (t) => { beam.rotation.y = t * 0.6; } : null;
  return { object: g, lights, update };
}

function buildTent(s, grid) {
  const g = new THREE.Group();
  const base = grid.level(s.x, s.y) * HEIGHT_STEP;
  const cloth = new THREE.MeshLambertMaterial({ color: s.color || '#c8a878', side: THREE.DoubleSide });
  const geo = new THREE.ConeGeometry(1.4, 2.0, 4, 1, true);
  geo.rotateY(Math.PI / 4);
  const m = new THREE.Mesh(geo, cloth);
  m.position.y = 1.0;
  m.castShadow = m.receiveShadow = true;
  g.add(m);
  g.position.set(s.x + 0.5, base, s.y + 0.5);
  grid.block(s.x, s.y);
  return { object: g };
}

/** A simple arch/gate spanning tiles (x..x+w-1) at row y. */
function buildArch(s, grid) {
  const g = new THREE.Group();
  const base = grid.level(s.x, s.y) * HEIGHT_STEP;
  const mat = new THREE.MeshLambertMaterial({ map: repeatTex(s.tex || 'wall_stone', 1, 3) });
  const w = s.w || 3;
  for (const px of [0, w - 1]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.8), mat);
    p.position.set(px + 0.5, 1.6, 0.5);
    p.castShadow = p.receiveShadow = true;
    g.add(p);
    grid.block(s.x + px, s.y);
  }
  const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.6, 0.9), mat);
  top.position.set(w / 2, 3.4, 0.5);
  top.castShadow = true;
  g.add(top);
  g.position.set(s.x, base, s.y);
  return { object: g };
}

/** A great lamp on a pedestal (the Dawnstone's housing, shrines, beacons). */
function buildBeacon(s, grid) {
  const g = new THREE.Group();
  const base = grid.level(s.x, s.y) * HEIGHT_STEP;
  const brass = new THREE.MeshLambertMaterial({ color: '#b08a40' });
  const stone = new THREE.MeshLambertMaterial({ map: repeatTex('marble', 2, 1) });
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.8, 12), stone);
  ped.position.y = 0.4;
  ped.castShadow = ped.receiveShadow = true;
  g.add(ped);
  const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.1, 8, 1, true), new THREE.MeshLambertMaterial({ color: '#c8a050', wireframe: true }));
  cage.position.y = 1.4;
  g.add(cage);
  const lit = s.lit !== false;
  const color = s.color || '#ffd27a';
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.32, 1), new THREE.MeshLambertMaterial({ color: lit ? '#fff4d0' : '#4a4a5a', emissive: lit ? color : '#000000', emissiveIntensity: lit ? 2.6 : 0 }));
  core.position.y = 1.4;
  g.add(core);
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.4, 8), brass);
  cap.position.y = 2.15;
  cap.castShadow = true;
  g.add(cap);
  g.position.set(s.x + 0.5, base, s.y + 0.5);
  grid.block(s.x, s.y);
  const lights = lit ? [{ x: s.x + 0.5, y: base + 1.5, z: s.y + 0.8, color, intensity: 4, distance: 9, priority: 5 }] : [];
  const update = lit ? (t) => { core.rotation.y = t * 0.5; core.scale.setScalar(1 + Math.sin(t * 2) * 0.05); } : null;
  return { object: g, lights, update };
}

function buildStructure(s, grid) {
  switch (s.type) {
    case 'beacon': return buildBeacon(s, grid);
    case 'lantern': return buildLantern(s, grid);
    case 'tent': return buildTent(s, grid);
    case 'arch': return buildArch(s, grid);
    default: return null;
  }
}
