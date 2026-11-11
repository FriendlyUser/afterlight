// Map rendering details (world/MapBuilder.js, render/TransitionMasks.js): stairs know
// which way they climb, feet follow the steps, and each step gets a half-step block;
// ground spills raggedly onto lower ground (grass over a path) but never onto paving or
// up a cliff; grassy cliff tops hang a lip; water carries its distance to the shore and
// its depth for the shader; trees and rocks vary, the same way every time.
// Run: SIM=240 tools/test.sh map_render 60000
import { buildMap } from '../src/world/MapBuilder.js';
import { getTransitionMasks } from '../src/render/TransitionMasks.js';

/** A small map: grass, a dirt path, a stone floor, a cliff, a flight of stairs, a pond. */
const MAP = {
  ground: [
    '..........',
    '..........',
    '..::......',
    '..::.__...',
    '..::.__...',
    '..........',
    '...~~~....',
    '...~w~....',
    '..........',
  ],
  height: [
    '3333333333',
    '3333333333',
    '0022000000',
    '0011000000',
    '0000000000',
    '0000000000',
    '0000000000',
    '0000000000',
    '0000000000',
  ],
  props: [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'T R T R T',
  ],
  // A flight two tiles wide up the path to the terrace (levels 1, 2, then 3), and a
  // stray stair tile on flat ground at (7, 4).
  stairs: [{ x: 2, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 7, y: 4 }],
};

export async function run(game, h) {
  const built = buildMap(MAP);
  const g = built.grid;

  // 1. Stairs: which way they climb, and walking height along them.
  h.expect(['2,2', '3,2', '2,3', '3,3'].every((k) => JSON.stringify(g.stairUp(...k.split(',').map(Number))) === '[0,-1]'), 'the stair tiles climb north to the terrace');
  h.expect(g.stairUp(5, 5) === null && g.stairUp(7, 4) === null, 'flat ground and a stair tile with nothing above it climb nowhere');
  const foot = g.surfaceAt(2.5, 2.99), mid = g.surfaceAt(2.5, 2.5), top = g.surfaceAt(2.5, 2.01);
  h.expect(Math.abs(foot - g.surface(2, 2)) < 0.02 && Math.abs(top - g.surface(2, 1)) < 0.02 && mid > foot && mid < top, `feet climb the step evenly (${foot.toFixed(2)} → ${mid.toFixed(2)} → ${top.toFixed(2)})`);
  h.expect(g.surfaceAt(5.5, 5.5) === g.surface(5, 5), 'off the stairs, the ground is flat');

  // 2. Overlays: fringes where grass meets the path, none on the stone floor's far side
  // of a cliff; lips on grassy cliff tops. The overlay mesh samples the mask atlas.
  const overlay = built.group.children.find((m) => m.geometry?.attributes?.uv1);
  h.expect(overlay && overlay.material.alphaMap === getTransitionMasks().texture, 'one overlay mesh, cut by the transition masks');
  const pos = overlay.geometry.attributes.position;
  const quads = pos.count / 4;
  let onPath = 0, onStone = 0, vertical = 0;
  for (let q = 0; q < quads; q++) {
    const ys = [0, 1, 2, 3].map((k) => pos.getY(q * 4 + k));
    const xs = [0, 1, 2, 3].map((k) => pos.getX(q * 4 + k));
    const zs = [0, 1, 2, 3].map((k) => pos.getZ(q * 4 + k));
    if (Math.max(...ys) - Math.min(...ys) > 0.01) { vertical++; continue; }
    const tx = Math.floor(Math.min(...xs) + 0.01), ty = Math.floor(Math.min(...zs) + 0.01);
    if (g.char(tx, ty) === ':') onPath++;
    if (g.char(tx, ty) === '_') onStone++;
  }
  h.expect(onPath >= 4, `grass spills onto the path (${onPath} fringes)`);
  h.expect(onStone === 0, 'but never onto a paved stone floor');
  h.expect(vertical > 0, `the terrace's grassy cliff hangs a lip (${vertical} lips)`);

  // 3. Water: distance to the shore, depth, and which sides are land.
  const water = built.group.children.find((m) => m.geometry?.attributes?.dist);
  const a = water?.geometry.attributes;
  h.expect(a && a.depth && a.landEdge && a.landCorner, 'the pond carries distance, depth and its shores');
  const dists = Array.from(a.dist.array);
  h.expect(Math.min(...dists) === 0 && Math.max(...dists) <= 4, `shore distance from 0 at the bank (max ${Math.max(...dists).toFixed(2)})`);

  // 4. Trees and rocks vary, and the same way on every build.
  const props = built.group.children.filter((m) => ['tree', 'rock'].includes(m.userData?.propType));
  const xs = props.map((m) => (m.position.x - Math.floor(m.position.x)).toFixed(3));
  const again = buildMap(MAP).group.children.filter((m) => ['tree', 'rock'].includes(m.userData?.propType)).map((m) => (m.position.x - Math.floor(m.position.x)).toFixed(3));
  h.expect(props.length === 5 && new Set(xs).size > 1 && new Set(props.map((m) => m.scale.y.toFixed(3))).size > 1, 'props sit off-center and differ in size');
  h.expect(JSON.stringify(xs) === JSON.stringify(again), 'and identically on every build');
}
