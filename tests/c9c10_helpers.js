// Shared helpers for the ch9 / ch10 smoke tests.
import { MAPS } from '../src/data/maps/index.js';
import { FieldScene } from '../src/world/FieldScene.js';
import { kitCharacter } from './party_kit.js';

/** Fresh Act II party: join, level, re-look and refit everyone. */
export function setupParty(game, members, level, gear = {}) {
  const st = game.state;
  st.party = [];
  for (const [id, look] of members) {
    const ch = st.joinParty(id);
    if (look) ch.lookId = look;
    ch.setLevel(level);
    kitCharacter(ch, level); // Crest ranks, secondary and Supports, as the balance sim assumes
    Object.assign(ch.equipment, gear[id] || {});
    ch.sealed = false;
    ch.fullHeal();
  }
  st.gold = 20000;
}

/** Begin a test mid-story: Act II flags, a party, and a field scene on the given map. */
export async function startAt(game, mapId, x, y, { flags = {}, party, level, gear, items = {} }) {
  const st = game.state;
  Object.assign(st.flags, { p_woke: true, kindled: true, crestArtLearned: true, sundered: true }, flags);
  setupParty(game, party, level, gear);
  for (const [id, n] of Object.entries(items)) st.inventory.add(id, n);
  game.start(new FieldScene(game), { mapId, x, y, dir: 'up', skipEnterScript: true });
  game.fadeIn(0.1);
  await game.wait(0.5);
}

/** Log with the game clock, so slow steps show up in the test title. */
export function stamp(game, h, msg) { h.log(`${msg} @${Math.round(game.time)}s`); }

/** Run an inspect point's script on the current map. */
export async function inspect(game, h, x, y) {
  const d = (game.scene.map.inspect || []).find((i) => i.x === x && i.y === y && (!i.cond || i.cond(game.state)));
  if (!d) throw new Error(`No inspect at ${x},${y} on ${game.scene.mapId}`);
  await game.scene.runScript(async (s) => (d.run ? d.run(s) : s.narrate(d.text)));
  await h.idle();
}

/**
 * Layout sanity for the current map: every NPC / chest stands on an open tile,
 * and every NPC, chest, inspect point and exit can be reached from (sx, sy)
 * (map blockers are treated as cleared).
 */
export function sanity(game, sx, sy) {
  const f = game.scene;
  const g = f.grid;
  const map = f.map;
  const errs = [];
  const opened = new Set();
  for (const b of map.blockers || []) {
    for (let y = b.y; y < b.y + (b.h || 1); y++) for (let x = b.x; x < b.x + (b.w || 1); x++) opened.add(`${x},${y}`);
  }
  const ok = (x, y) => g.inside(x, y) && (g.walkable(x, y) || opened.has(`${x},${y}`));
  const seen = new Set([`${sx},${sy}`]);
  const q = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
      if (seen.has(k) || !ok(nx, ny)) continue;
      const dh = Math.abs(g.level(nx, ny) - g.level(x, y));
      if (dh > 1 && !g.isStairs(nx, ny) && !g.isStairs(x, y)) continue;
      seen.add(k);
      q.push([nx, ny]);
    }
  }
  const near = (x, y) => [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => seen.has(`${x + dx},${y + dy}`));
  const prop = (x, y) => map.props?.[y]?.[x] || ' ';
  for (const n of map.npcs || []) {
    const d = g.def(n.x, n.y);
    if (d.wall || d.void || d.solid || !' jqgfoxdmnG^'.includes(prop(n.x, n.y))) errs.push(`npc ${n.id} on blocked tile ${n.x},${n.y}`);
    if (!near(n.x, n.y)) errs.push(`npc ${n.id} unreachable ${n.x},${n.y}`);
  }
  for (const c of map.chests || []) {
    const d = g.def(c.x, c.y);
    if (d.wall || d.void || d.solid || prop(c.x, c.y) !== ' ') errs.push(`chest ${c.id} on blocked tile ${c.x},${c.y}`);
    if (!near(c.x, c.y)) errs.push(`chest ${c.id} unreachable ${c.x},${c.y}`);
  }
  for (const i of map.inspect || []) if (!near(i.x, i.y)) errs.push(`inspect unreachable ${i.x},${i.y}`);
  for (const e of map.exits || []) {
    let any = false;
    for (let y = e.y; y < e.y + (e.h || 1); y++) for (let x = e.x; x < e.x + (e.w || 1); x++) if (seen.has(`${x},${y}`)) any = true;
    if (!any) errs.push(`exit to ${e.to} unreachable at ${e.x},${e.y}`);
  }
  return errs.map((e) => `${f.mapId}: ${e}`);
}

/** Visit each map at its entry and collect layout problems. */
export async function sanityAll(game, h, entries) {
  const errs = [];
  for (const [id, x, y] of entries) {
    if (!MAPS[id]) { errs.push(`missing map ${id}`); continue; }
    await game.scene.goto(id, x, y, 'up', { skipEnterScript: true });
    await game.wait(0.4);
    errs.push(...sanity(game, x, y));
  }
  if (errs.length) throw new Error(`layout problems:\n${errs.join('\n')}`);
  h.log(`layouts ok (${entries.length} maps)`);
}
