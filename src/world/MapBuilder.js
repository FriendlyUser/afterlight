// Builds the 3D diorama for a map definition (see docs/MAPS.md):
// terraced terrain with baked corner AO, water, billboard props, buildings,
// special structures, plus the collision grid and light sources.

import * as THREE from 'three';
import { GeometryBuilder } from './GeometryBuilder.js';
import { GROUND, PROP_CHARS, DECOR_TYPES, HEIGHT_STEP } from './Legend.js';
import { getTileAtlas } from '../render/TextureFactory.js';
import { getPropSprite } from '../render/PropFactory.js';
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

function makeWaterMaterial(murky) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    fog: true,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        time: { value: 0 },
        deep: { value: new THREE.Color(murky ? '#3a4a30' : '#1f5a8a') },
        shallow: { value: new THREE.Color(murky ? '#5a6a40' : '#4fa8c8') },
        foam: { value: new THREE.Color(murky ? '#8a9070' : '#eaf8ff') },
        foamAmt: { value: murky ? 0.3 : 0.75 },
      },
    ]),
    vertexShader: /* glsl */`
      attribute float shore;
      varying vec2 vWorld;
      varying float vShore;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorld = wp.xz;
        vShore = shore;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */`
      uniform float time;
      uniform vec3 deep, shallow, foam;
      uniform float foamAmt;
      varying vec2 vWorld;
      varying float vShore;
      #include <fog_pars_fragment>
      float h(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5); }
      void main() {
        vec2 p = floor(vWorld * 16.0) / 16.0;
        float w = sin(p.x * 2.1 + time * 1.3) * sin(p.y * 1.7 - time * 1.1) + 0.5 * sin((p.x + p.y) * 3.3 + time * 2.0);
        vec3 c = mix(deep, shallow, clamp(vShore * 0.7, 0.0, 1.0));
        c += step(1.05, w) * 0.10;
        c -= step(w, -1.0) * 0.05;
        float f = step(0.78, vShore + 0.12 * sin(time * 2.2 + p.x * 3.0 + p.y * 2.0));
        c = mix(c, foam, f * foamAmt);
        float glint = step(0.996, h(p + floor(time * 3.0)));
        c += glint * 0.9;
        gl_FragColor = vec4(c, 0.84);
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

  isStairs(x, y) { return this.tags.get(`${x},${y}`)?.stairs === true; }

  block(x, y, v = 1) { if (this.inside(x, y)) this.blocked[y * this.w + x] = v; }
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

  // Stairs tags
  for (const s of map.stairs || []) grid.tags.set(`${s.x},${s.y}`, { stairs: true });

  // ---------------- terrain ----------------
  const gb = new GeometryBuilder();
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
      const tint = d.water ? [0.8, 0.85, 0.9] : [1, 1, 1];
      gb.quad(
        [x, top, y + 1], [x + 1, top, y + 1], [x + 1, top, y], [x, top, y],
        atlas.uv(topTex, variant(x, y, topTex)), [0, 1, 0],
        [ao(x, y + 1), ao(x + 1, y + 1), ao(x + 1, y), ao(x, y)], tint,
      );

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
        gb.tiledQuad(o, s.u, [0, 1, 0], 1, height, s.n,
          (i, j) => atlas.uv(sideTex, variant(x + j, y + i * 3, sideTex)),
          (v0, v1) => [0.55 + 0.45 * v0, 0.55 + 0.45 * v1]);
      }
    }
  }
  const terrainMat = new THREE.MeshLambertMaterial({ map: atlas.texture, vertexColors: true });
  const terrain = new THREE.Mesh(gb.build(), terrainMat);
  terrain.receiveShadow = true;
  terrain.castShadow = true;
  group.add(terrain);

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
      if (obj.def.solid) for (let dx = -(obj.def.footprint || 0); dx <= (obj.def.footprint || 0); dx++) grid.block(x + dx, y);
      if (obj.def.h > 48) fadeables.push(obj.mesh);
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

  return { group, grid, lightSources, animated, fadeables, interactables };
}

// ---------------------------------------------------------------------------

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
  mesh.position.set(x, y, z);
  mesh.rotation.x = -0.12;
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
  const shore = { clear: [], murky: [] };
  const isWater = (x, y) => !!grid.def(x, y).water || !grid.inside(x, y);
  const cornerShore = (cx, cy) => {
    let land = 0;
    for (const [ox, oy] of [[cx - 1, cy - 1], [cx, cy - 1], [cx - 1, cy], [cx, cy]]) if (!isWater(ox, oy)) land++;
    return land ? 1 : 0;
  };
  const dummyUv = { u0: 0, v0: 0, u1: 1, v1: 1 };
  for (let y = 0; y < grid.h; y++) for (let x = 0; x < grid.w; x++) {
    const d = grid.def(x, y);
    if (!d.water) continue;
    const key = d.murky ? 'murky' : 'clear';
    const lvl = grid.level(x, y) * HEIGHT_STEP - 0.12;
    groups[key].quad([x, lvl, y + 1], [x + 1, lvl, y + 1], [x + 1, lvl, y], [x, lvl, y], dummyUv, [0, 1, 0]);
    shore[key].push(cornerShore(x, y + 1), cornerShore(x + 1, y + 1), cornerShore(x + 1, y), cornerShore(x, y));
  }
  const out = [];
  for (const key of ['clear', 'murky']) {
    if (!shore[key].length) continue;
    const geo = groups[key].build();
    geo.setAttribute('shore', new THREE.Float32BufferAttribute(shore[key], 1));
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

  // Collision: whole footprint except door tile.
  const doorX = b.door ? b.x + (b.door.dx ?? Math.floor(b.w / 2)) : null;
  for (let ty = b.y; ty < b.y + b.d; ty++) for (let tx = b.x; tx < b.x + b.w; tx++) {
    if (tx === doorX && ty === b.y + b.d - 1) continue;
    grid.block(tx, ty);
  }

  // Door & windows decals
  const dec = new GeometryBuilder();
  const lights = [];
  if (b.door) {
    const dx = doorX;
    dec.quad([dx + 0.12, base, z1 + 0.02], [dx + 0.88, base, z1 + 0.02], [dx + 0.88, base + 1.3, z1 + 0.02], [dx + 0.12, base + 1.3, z1 + 0.02], atlas.uv('door', 0), [0, 0, 1]);
    grid.tags.set(`${dx},${b.y + b.d - 1}`, { door: b.door });
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
  return { mesh, windowMesh, lights };
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
    grid.block(s.x, s.y + 1, 0);
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
