// The Gloam Abyss — seeded floor generator (runs at module load).
// Every floor is built from a fixed seed, so layouts and chest flags are the
// same in every session. Output matches tools/mapkit.py layouts:
//   { w, h, ground[], height[], props[], buildings, structures, stairs, spots }
// plus `feat` (chest / hearthstone / lift / chalk positions) for the gameplay
// definitions in postgame_abyss.js.
//
// Floors 1–29 are caves (gloam, ice) or halls (ruin, white) with a stairwell up
// near the south and a stairwell down at the far end. Floor 30 is hand-shaped:
// a white hall, a bridge over nothing, and the First Dark's chamber.

const HEIGHT_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';
export const FLOORS = 30;
const BASE = 2; // walkable floor level; stairwells step up/down from here
const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const THEMES = {
  gloam: { floor: 'c', alt: 'u', path: 'c', wall: 'U', style: 'cave', fill: 0.46, pits: 3, lakes: 0, decor: ['G', 'G', 'x', 'o'], solid: ['%', 'Z', 'Z', 'A'], arch: 'wall_gloam' },
  ruin: { floor: 'r', alt: 'a', path: ';', wall: 'R', style: 'rooms', pits: 0, lakes: 0, decor: ['d', 'x', 'o', 'd'], solid: ['!', '|', 'D', 'R', '!'], arch: 'wall_ruin' },
  ice: { floor: 'i', alt: '*', path: '*', wall: 'I', style: 'cave', fill: 0.45, pits: 0, lakes: 3, decor: ['o', 'o', 'x'], solid: ['*', 'A', 'R', '*'], arch: 'wall_ice' },
  white: { floor: 'M', alt: '_', path: '_', wall: 'K', style: 'rooms', pits: 4, lakes: 0, decor: ['o', 'd'], solid: ['|', 'S', '!', '|'], arch: 'wall_marble' },
};

export function themeOf(n) {
  if (n <= 7) return 'gloam';
  if (n <= 15) return 'ruin';
  if (n <= 22) return 'ice';
  return 'white';
}

// ---------------------------------------------------------------------------
// Grid painter
// ---------------------------------------------------------------------------

class Grid {
  constructor(w, h, ground, height) {
    this.w = w;
    this.h = h;
    this.g = Array.from({ length: h }, () => Array(w).fill(ground));
    this.hg = Array.from({ length: h }, () => Array(w).fill(height));
    this.p = Array.from({ length: h }, () => Array(w).fill(' '));
    this.stairs = [];
    this.structures = [];
    this.solid = new Set(); // tiles occupied by solid props/chests/features
  }

  in(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h; }

  set(x, y, ground, height, prop) {
    if (!this.in(x, y)) return;
    if (ground !== undefined && ground !== null) this.g[y][x] = ground;
    if (height !== undefined && height !== null) this.hg[y][x] = height;
    if (prop !== undefined && prop !== null) this.p[y][x] = prop;
  }

  rect(x, y, w, h, ground, height) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, ground, height);
  }

  ellipse(cx, cy, rx, ry, ground, height, onlyOpen = false, theme = null) {
    for (let j = Math.floor(cy - ry - 1); j <= Math.ceil(cy + ry + 1); j++) {
      for (let i = Math.floor(cx - rx - 1); i <= Math.ceil(cx + rx + 1); i++) {
        const d = ((i + 0.5 - cx) / rx) ** 2 + ((j + 0.5 - cy) / ry) ** 2;
        if (d > 1) continue;
        if (onlyOpen && !this.open(i, j, theme)) continue;
        this.set(i, j, ground, height);
      }
    }
  }

  /** Walkable terrain (ignores props). */
  open(x, y, theme) {
    if (!this.in(x, y)) return false;
    const c = this.g[y][x];
    return c !== theme.wall && c !== ' ' && c !== '~' && c !== '#';
  }

  /** Walkable and not occupied by a solid prop/feature. */
  free(x, y, theme) { return this.open(x, y, theme) && !this.solid.has(`${x},${y}`); }

  occupy(x, y, prop) {
    this.solid.add(`${x},${y}`);
    if (prop) this.p[y][x] = prop;
  }

  /** All 8 neighbours free: a solid placed here can never cut a path. */
  roomy(x, y, theme, need = 8) {
    if (!this.free(x, y, theme)) return false;
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      if (this.free(x + dx, y + dy, theme)) n++;
      else if (this.solid.has(`${x + dx},${y + dy}`)) return false;
    }
    return n >= need;
  }

  neighbours(x, y, theme) { return DIRS4.filter(([dx, dy]) => this.free(x + dx, y + dy, theme)).length; }

  /** BFS distances over free tiles from (sx, sy). */
  distances(sx, sy, theme) {
    const dist = new Map([[`${sx},${sy}`, 0]]);
    const q = [[sx, sy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      const d = dist.get(`${x},${y}`);
      for (const [dx, dy] of DIRS4) {
        const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
        if (dist.has(k) || !this.free(nx, ny, theme)) continue;
        dist.set(k, d + 1);
        q.push([nx, ny]);
      }
    }
    return dist;
  }

  /** Keep only the largest open region; everything else becomes wall. Returns its size. */
  keepLargest(theme) {
    const seen = new Set();
    let best = null;
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (seen.has(`${x},${y}`) || !this.open(x, y, theme)) continue;
      const region = [...this.distances(x, y, theme).keys()];
      region.forEach((k) => seen.add(k));
      if (!best || region.length > best.length) best = region;
    }
    const keep = new Set(best || []);
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.open(x, y, theme) && !keep.has(`${x},${y}`)) this.set(x, y, theme.wall, BASE);
    }
    return keep.size;
  }

  layers() {
    return {
      ground: this.g.map((r) => r.join('')),
      height: this.hg.map((r) => r.map((v) => HEIGHT_CHARS[Math.max(0, Math.min(35, v))]).join('')),
      props: this.p.map((r) => r.join('')),
    };
  }
}

// ---------------------------------------------------------------------------
// Terrain styles
// ---------------------------------------------------------------------------

function caveFill(G, R, theme) {
  const w = G.w - 2, h = G.h - 4;
  let cells = Array.from({ length: h }, () => Array.from({ length: w }, () => R() < theme.fill));
  for (let step = 0; step < 4; step++) {
    const nxt = cells.map((row) => row.slice());
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      let n = 0;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const ii = i + di, jj = j + dj;
        if (ii < 0 || jj < 0 || ii >= w || jj >= h || cells[jj][ii]) n++;
      }
      nxt[j][i] = n >= 5 || (n >= 4 && cells[j][i]);
    }
    cells = nxt;
  }
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    if (!cells[j][i]) G.set(1 + i, 3 + j, theme.floor, BASE);
  }
}

function roomsFill(G, R, theme) {
  const rooms = [];
  const target = 6 + Math.floor(R() * 4);
  for (let tries = 0; tries < 400 && rooms.length < target; tries++) {
    const rw = 5 + Math.floor(R() * 6), rh = 4 + Math.floor(R() * 4);
    const rx = 2 + Math.floor(R() * (G.w - rw - 4));
    const ry = 4 + Math.floor(R() * (G.h - rh - 6));
    const clash = rooms.some((r) => rx < r.x + r.w + 2 && rx + rw + 2 > r.x && ry < r.y + r.h + 2 && ry + rh + 2 > r.y);
    if (!clash) rooms.push({ x: rx, y: ry, w: rw, h: rh, cx: rx + (rw >> 1), cy: ry + (rh >> 1) });
  }
  for (const r of rooms) G.rect(r.x, r.y, r.w, r.h, theme.floor, BASE);
  const corridor = (a, b) => {
    const horizFirst = R() < 0.5;
    const mid = horizFirst ? [b.cx, a.cy] : [a.cx, b.cy];
    for (const [p, q] of [[[a.cx, a.cy], mid], [mid, [b.cx, b.cy]]]) {
      const steps = Math.max(Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1]), 1);
      for (let s = 0; s <= steps; s++) {
        const x = Math.round(p[0] + ((q[0] - p[0]) * s) / steps);
        const y = Math.round(p[1] + ((q[1] - p[1]) * s) / steps);
        for (let k = 0; k < 2; k++) {
          for (const [cx, cy] of [[x, y + k], [x + k, y]]) {
            if (G.in(cx, cy) && cx > 0 && cy > 2 && cx < G.w - 1 && cy < G.h - 1 && G.g[cy][cx] === theme.wall) G.set(cx, cy, theme.path, BASE);
          }
        }
      }
    }
  };
  rooms.sort((a, b) => a.cx - b.cx);
  for (let i = 1; i < rooms.length; i++) corridor(rooms[i - 1], rooms[i]);
  for (let k = 0; k < 2 && rooms.length > 3; k++) {
    const a = rooms[Math.floor(R() * rooms.length)], b = rooms[Math.floor(R() * rooms.length)];
    if (a !== b) corridor(a, b);
  }
}

/** Holes into nothing (void) or frozen lakes, placed inside open ground. */
function hazards(G, R, theme) {
  const opens = [];
  for (let y = 4; y < G.h - 3; y++) for (let x = 3; x < G.w - 3; x++) if (G.roomy(x, y, theme)) opens.push([x, y]);
  const place = (count, fn) => {
    for (let i = 0; i < count && opens.length; i++) {
      const [x, y] = opens[Math.floor(R() * opens.length)];
      fn(x, y, 1.2 + R() * 1.6, 1 + R() * 1.2);
    }
  };
  place(theme.pits, (x, y, rx, ry) => G.ellipse(x + 0.5, y + 0.5, rx, ry, ' ', 0, true, theme));
  place(theme.lakes, (x, y, rx, ry) => {
    G.ellipse(x + 0.5, y + 0.5, rx + 1, ry + 1, 'w', BASE, true, theme);
    G.ellipse(x + 0.5, y + 0.5, rx, ry, '~', BASE, true, theme);
  });
}

/** Raised platforms (+1 level: still walkable) and patches of the alternate floor. */
function texture(G, R, theme) {
  for (let k = 0; k < 3; k++) {
    const w = 5 + Math.floor(R() * 6), h = 3 + Math.floor(R() * 4);
    const x0 = 2 + Math.floor(R() * (G.w - w - 4)), y0 = 4 + Math.floor(R() * (G.h - h - 6));
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) if (G.open(x, y, theme) && G.g[y][x] !== 'w') G.hg[y][x] = BASE + 1;
  }
  for (let k = 0; k < 6; k++) {
    const cx = 2 + R() * (G.w - 4), cy = 4 + R() * (G.h - 6);
    for (let y = Math.floor(cy - 3); y <= cy + 3; y++) for (let x = Math.floor(cx - 4); x <= cx + 4; x++) {
      if (!G.in(x, y) || G.g[y][x] !== theme.floor) continue;
      if (((x + 0.5 - cx) / 4) ** 2 + ((y + 0.5 - cy) / 3) ** 2 + (R() - 0.5) * 0.5 <= 1) G.g[y][x] = theme.alt;
    }
  }
}

// ---------------------------------------------------------------------------
// Stairwells and features
// ---------------------------------------------------------------------------

/** Free tiles with solid wall in the 3x3 block directly north (room for a stairwell). */
function stairCandidates(G, theme) {
  const out = [];
  for (let y = 4; y < G.h - 1; y++) for (let x = 2; x < G.w - 2; x++) {
    if (!G.free(x, y, theme) || G.g[y][x] === 'w') continue;
    let ok = true;
    for (let dy = 1; dy <= 3 && ok; dy++) for (let dx = -1; dx <= 1; dx++) if (G.g[y - dy][x + dx] !== theme.wall) { ok = false; break; }
    if (ok && G.neighbours(x, y, theme) >= 2) out.push([x, y]);
  }
  return out;
}

/** Cut a two-step stairwell north of (x, y). Returns the exit tile. */
function stairwell(G, theme, x, y, up) {
  const h0 = G.hg[y][x];
  const d = up ? 1 : -1;
  const ground = up ? theme.floor : 'u';
  G.set(x, y - 1, ground, h0 + d);
  G.set(x, y - 2, ground, h0 + 2 * d);
  G.stairs.push({ x, y: y - 1 }, { x, y: y - 2 });
  G.structures.push({ type: 'arch', x: x - 1, y: y - 1, w: 3, tex: theme.arch });
  for (const dx of [-1, 1]) if (G.free(x + dx, y, theme) && G.p[y][x + dx] === ' ') G.p[y][x + dx] = 'G';
  G.solid.add(`${x},${y - 1}`);
  G.solid.add(`${x},${y - 2}`);
  return [x, y - 2];
}

function pickFar(cands, dist, R, avoid = []) {
  let best = null, bestScore = -1;
  for (const [x, y] of cands) {
    const d = dist.get(`${x},${y}`);
    if (d === undefined || avoid.some(([ax, ay]) => Math.abs(ax - x) + Math.abs(ay - y) < 5)) continue;
    const score = d + R() * 3;
    if (score > bestScore) { bestScore = score; best = [x, y]; }
  }
  return best;
}

function placeFeatures(G, R, theme, n, entry, exitFront) {
  const feat = { chests: [], hearth: null, lift: null, chalk: null };
  const reserved = new Set();
  for (const [x, y] of [entry, exitFront]) {
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) reserved.add(`${x + dx},${y + dy}`);
  }
  const far = (x, y, list, gap) => list.every(([ax, ay]) => Math.abs(ax - x) + Math.abs(ay - y) >= gap);
  const fromEntry = G.distances(entry[0], entry[1], theme);
  const fromExit = G.distances(exitFront[0], exitFront[1], theme);
  const near = (x, y, r) => Math.abs(x - entry[0]) + Math.abs(y - entry[1]) < r || Math.abs(x - exitFront[0]) + Math.abs(y - exitFront[1]) < r;
  const taken = [];
  const claim = (x, y, prop) => { G.occupy(x, y, prop); taken.push([x, y]); for (const [dx, dy] of DIRS4) reserved.add(`${x + dx},${y + dy}`); };

  // Hearthstone and lift sit a few steps before the stair down.
  const nearExit = (lo, hi, want) => {
    let best = null, bestD = Infinity;
    for (const [k, d] of fromExit) {
      if (d < lo || d > hi) continue;
      const [x, y] = k.split(',').map(Number);
      if (reserved.has(k) || !G.roomy(x, y, theme) || !far(x, y, taken, 3)) continue;
      if (Math.abs(x - exitFront[0]) <= 2 && Math.abs(y - exitFront[1]) <= 1) continue;
      const score = Math.abs(d - want) + R();
      if (score < bestD) { bestD = score; best = [x, y]; }
    }
    return best;
  };
  if (n % 5 === 0) {
    feat.hearth = nearExit(4, 14, 7);
    if (feat.hearth) claim(...feat.hearth, '$');
  }
  if (n === 10 || n === 20) {
    feat.lift = nearExit(2, 8, 3);
    if (feat.lift) {
      claim(...feat.lift, 'L');
      const [lx, ly] = feat.lift;
      feat.liftArrive = [[lx, ly + 1], [lx - 1, ly], [lx + 1, ly], [lx, ly - 1]].find(([x, y]) => G.free(x, y, theme)) || exitFront;
    }
  }

  // Chests in dead ends first (blocking a dead end never cuts a path), then open floor.
  const deadEnds = [], roomy = [];
  for (let y = 1; y < G.h - 1; y++) for (let x = 1; x < G.w - 1; x++) {
    const k = `${x},${y}`;
    if (!fromEntry.has(k) || reserved.has(k) || near(x, y, 6) || G.g[y][x] === 'w') continue;
    if (G.free(x, y, theme) && G.neighbours(x, y, theme) === 1) deadEnds.push([x, y]);
    else if (G.roomy(x, y, theme)) roomy.push([x, y]);
  }
  const byDist = (list) => list.map((p) => [p, fromEntry.get(`${p[0]},${p[1]}`) + R() * 8]).sort((a, b) => b[1] - a[1]).map(([p]) => p);
  const pool = [...byDist(deadEnds), ...byDist(roomy)];
  const want = 3 + (n % 3) + (n % 4 === 0 ? 1 : 0);
  for (const [x, y] of pool) {
    if (feat.chests.length >= want) break;
    if (!far(x, y, taken, 5) || reserved.has(`${x},${y}`)) continue;
    if (!G.free(x, y, theme) || (G.neighbours(x, y, theme) !== 1 && !G.roomy(x, y, theme))) continue;
    feat.chests.push([x, y]);
    claim(x, y, null);
  }

  // A chalk drawing (Lysa's hide-and-seek trail) on a quiet patch of floor.
  if ([6, 13, 21, 27].includes(n)) {
    for (const [x, y] of pool) {
      if (!G.free(x, y, theme) || reserved.has(`${x},${y}`) || !far(x, y, taken, 4)) continue;
      feat.chalk = [x, y];
      G.p[y][x] = 'f';
      reserved.add(`${x},${y}`);
      break;
    }
  }
  return { feat, reserved };
}

/** Solid scenery where it cannot block a path, then small decor. */
function dress(G, R, theme, reserved) {
  for (let y = 1; y < G.h - 1; y++) for (let x = 1; x < G.w - 1; x++) {
    if (reserved.has(`${x},${y}`) || G.p[y][x] !== ' ' || G.g[y][x] === 'w') continue;
    if (R() < 0.07 && G.roomy(x, y, theme)) G.occupy(x, y, theme.solid[Math.floor(R() * theme.solid.length)]);
  }
  for (let y = 1; y < G.h - 1; y++) for (let x = 1; x < G.w - 1; x++) {
    if (reserved.has(`${x},${y}`) || G.p[y][x] !== ' ' || !G.free(x, y, theme) || G.g[y][x] === 'w') continue;
    if (R() < 0.06) G.p[y][x] = theme.decor[Math.floor(R() * theme.decor.length)];
  }
  // Glowing crystal growths in the walls next to open ground (light in the dark).
  for (let y = 3; y < G.h - 1; y++) for (let x = 1; x < G.w - 1; x++) {
    if (G.g[y][x] !== theme.wall || G.g[y + 1]?.[x] === theme.wall || !G.open(x, y + 1, theme)) continue;
    if (theme.wall !== 'K' && R() < 0.09) G.p[y][x] = theme === THEMES.ice ? '*' : '%';
  }
}

// ---------------------------------------------------------------------------
// Floors
// ---------------------------------------------------------------------------

function buildFloor(n) {
  const theme = THEMES[themeOf(n)];
  const W = 38 + (n % 3) * 4, H = 30 + ((n * 7) % 3) * 2;
  for (let attempt = 0; attempt < 30; attempt++) {
    const R = rng(7919 * n + 104729 * attempt + 1301);
    const G = new Grid(W, H, theme.wall, BASE);
    if (theme.style === 'cave') caveFill(G, R, theme);
    else roomsFill(G, R, theme);
    hazards(G, R, theme);
    if (G.keepLargest(theme) < W * H * (theme.style === 'cave' ? 0.26 : 0.2)) continue;
    texture(G, R, theme);
    const cands = stairCandidates(G, theme);
    if (cands.length < 6) continue;
    // Arrive near the south; the way down is the farthest stairwell.
    const entry = cands.reduce((best, c) => (c[1] + R() * 4 > best[1] + R() * 4 ? c : best));
    const fromEntry = G.distances(entry[0], entry[1], theme);
    const exitFront = pickFar(cands, fromEntry, R, [entry]);
    if (!exitFront || fromEntry.get(`${exitFront[0]},${exitFront[1]}`) < 22) continue;
    const upstair = stairwell(G, theme, entry[0], entry[1], true);
    const downstair = n < FLOORS ? stairwell(G, theme, exitFront[0], exitFront[1], false) : null;
    const { feat, reserved } = placeFeatures(G, R, theme, n, entry, exitFront);
    if (feat.chests.length < 3 || (n % 5 === 0 && !feat.hearth) || ((n === 10 || n === 20) && !feat.lift)) continue;
    if ([6, 13, 21, 27].includes(n) && !feat.chalk) continue;
    dress(G, R, theme, reserved);
    return finish(G, n, { entry, upstair, exitFront, downstair, ...flatFeat(feat) }, feat);
  }
  throw new Error(`Abyss floor ${n}: generation failed`);
}

function flatFeat(feat) {
  const spots = {};
  if (feat.hearth) spots.hearth = feat.hearth;
  if (feat.lift) { spots.lift = feat.lift; spots.liftArrive = feat.liftArrive; }
  if (feat.chalk) spots.chalk = feat.chalk;
  return spots;
}

/** Rock far from any floor falls away into nothing: the floors float in the dark. */
function hollowOut(G, theme) {
  const keep = (x, y) => {
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const c = G.in(x + dx, y + dy) ? G.g[y + dy][x + dx] : theme.wall;
      if (c !== theme.wall && c !== ' ') return true;
    }
    return false;
  };
  const drop = [];
  for (let y = 0; y < G.h; y++) for (let x = 0; x < G.w; x++) if (G.g[y][x] === theme.wall && !keep(x, y)) drop.push([x, y]);
  for (const [x, y] of drop) { G.set(x, y, ' ', 0); G.p[y][x] = ' '; }
}

function finish(G, n, spots, feat) {
  hollowOut(G, THEMES[themeOf(n)]);
  const { ground, height, props } = G.layers();
  return {
    w: G.w, h: G.h, ground, height, props,
    buildings: [], structures: G.structures, stairs: G.stairs, spots, feat, floor: n,
  };
}

/**
 * Floor 30: a white hall, a bridge across nothing, and a round chamber where
 * the white is stained dark at the centre. Hand-shaped, still deterministic.
 */
function buildFinalFloor() {
  const theme = THEMES.white;
  const R = rng(30303);
  const W = 36, H = 42;
  const G = new Grid(W, H, ' ', 0);
  // The hall (south), walled in marble.
  G.rect(8, 29, 20, 11, theme.wall, BASE);
  G.rect(9, 32, 18, 7, theme.floor, BASE);
  G.rect(16, 29, 4, 3, theme.floor, BASE);              // doorway to the bridge
  G.rect(11, 34, 14, 3, theme.alt, BASE);                // worn aisle
  // Bridge across the void.
  G.rect(17, 16, 2, 13, theme.alt, BASE);
  // The chamber.
  G.ellipse(18, 9, 12.5, 7.2, theme.floor, BASE);
  G.ellipse(18, 9, 5.5, 3.2, 'u', BASE);
  G.ellipse(18, 9, 2.5, 1.4, 'u', BASE + 1);
  for (const [x, y] of [[8, 5], [28, 5], [7, 10], [29, 10], [10, 14], [25, 14]]) G.occupy(x, y, '|');
  for (const [x, y] of [[12, 7], [24, 7], [13, 12], [23, 12]]) G.p[y][x] = '%';
  // Stairwell up into the hall's north wall.
  const entry = [11, 32];
  const upstair = stairwell(G, theme, entry[0], entry[1], true);
  G.occupy(21, 33, '$');
  G.occupy(14, 37, null);
  G.occupy(24, 37, null);
  for (const [x, y] of [[10, 33], [25, 33], [10, 37], [25, 37]]) G.occupy(x, y, '|');
  for (let i = 0; i < 18; i++) {
    const x = 9 + Math.floor(R() * 18), y = 33 + Math.floor(R() * 6);
    if (G.p[y][x] === ' ' && !G.solid.has(`${x},${y}`) && Math.abs(x - entry[0]) + Math.abs(y - entry[1]) > 2) G.p[y][x] = R() < 0.5 ? 'o' : 'd';
  }
  return finish(G, 30, { entry, upstair, hearth: [21, 33], arena: [18, 13], center: [18, 9], lift: [24, 5], liftArrive: [24, 6] },
    { chests: [[14, 37], [24, 37]], hearth: [21, 33], lift: [24, 5], chalk: null });
}

export const ABYSS_LAYOUTS = {};
for (let n = 1; n <= FLOORS; n++) ABYSS_LAYOUTS[n] = n === FLOORS ? buildFinalFloor() : buildFloor(n);
