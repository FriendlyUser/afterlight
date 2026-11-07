// Shared helpers for the Chapter 12 smoke tests.
import { FieldScene } from '../src/world/FieldScene.js';
import { contentReady } from '../src/data/content/index.js';

const CAST = ['wren', 'ilse', 'bram', 'sable', 'pip', 'corvin'];
const GEAR = {
  wren: { weapon: 'dawnforged_blade', body: 'wanderers_mantle', head: 'wanderers_hat' },
  ilse: { weapon: 'keepers_crook', body: 'keepers_raiment', head: 'keepers_crown' },
  bram: { weapon: 'dawnforged_blade', offhand: 'wall_of_dawn', body: 'dawnguard_regalia', head: 'crown_of_dawn' },
  sable: { weapon: 'rod_of_dusk', body: 'keepers_raiment' },
  pip: { weapon: 'last_whisper', body: 'wanderers_mantle' },
  corvin: { weapon: 'last_word', body: 'wanderers_mantle', head: 'wanderers_hat' },
};

/** The Chapter 11 handoff state, with a party strong enough for auto-battles to end quickly. */
export async function startCh12(game, h, mapId = 'evernoon_gate', x = 20, y = 40, dir = 'up', flags = {}) {
  await contentReady;
  const st = game.state;
  st.party = [];
  for (const id of CAST) {
    const ch = st.joinParty(id);
    ch.setLevel(80);
    Object.assign(ch.equipment, GEAR[id]);
    ch.sealed = false;
    ch.boosts = { str: 2500, mag: 2500, def: 1200, res: 1200, hp: 6000, spd: 30 };
    ch.fullHeal();
  }
  st.unlockCrest('lanternkeeper');
  st.inventory.add('sun_shard', 7);
  st.gold = 50000;
  st.settings.textSpeed = 3;
  st.settings.battleSpeed = 2;
  Object.assign(st.flags, { kindled: true, crestArtLearned: true, sundered: true, act3: true, noEncounters: true }, flags);
  st.chapter = 12;
  // Shop and save screens only close on cancel; the auto-confirm harness would never leave them.
  game.menus.openShop = async () => {};
  game.menus.openSave = async () => {};
  game.start(new FieldScene(game), { mapId, x, y, dir });
  game.fadeIn(0.1);
  await game.wait(0.5);
  await h.idle();
}

/** Run an inspect point's script on the current map. */
export async function inspect(game, h, x, y) {
  const d = (game.scene.map.inspect || []).find((i) => i.x === x && i.y === y && (!i.cond || i.cond(game.state)));
  if (!d) throw new Error(`No inspect at ${x},${y} on ${game.scene.mapId}`);
  await game.scene.runScript(async (s) => (d.run ? d.run(s) : s.narrate(d.text)));
  await h.idle();
}

/** Queue answers for upcoming choice boxes (index per choice); falls back to the UI afterwards. */
export function answer(game, ...picks) {
  const ui = game.ui;
  const orig = ui.__origChoice || ui.choice.bind(ui);
  ui.__origChoice = orig;
  const queue = [...picks];
  ui.choice = (options, opts) => (queue.length ? Promise.resolve(queue.shift()) : orig(options, opts));
}

/**
 * Every NPC, chest, inspect point and exit on the live map must be reachable from (sx, sy).
 * Blockers listed in `open` count as cleared.
 */
export function reachCheck(game, h, sx, sy, open = []) {
  const f = game.scene;
  const g = f.grid;
  const opened = new Set();
  for (const b of f.map.blockers || []) {
    if (!open.includes(b.id)) continue;
    for (let y = b.y; y < b.y + (b.h || 1); y++) for (let x = b.x; x < b.x + (b.w || 1); x++) opened.add(`${x},${y}`);
  }
  const passable = (x, y) => g.walkable(x, y) || opened.has(`${x},${y}`);
  const seen = new Set([`${sx},${sy}`]);
  const q = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
      if (seen.has(k) || !g.inside(nx, ny)) continue;
      const ok = g.canStep(x, y, nx, ny) || (opened.has(k) && Math.abs(g.level(x, y) - g.level(nx, ny)) <= 1);
      if (ok && passable(nx, ny)) { seen.add(k); q.push([nx, ny]); }
    }
  }
  const near = (x, y) => [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => seen.has(`${x + dx},${y + dy}`));
  const errs = [];
  for (const n of f.map.npcs || []) if (!near(n.x, n.y)) errs.push(`npc ${n.id} @${n.x},${n.y}`);
  for (const c of f.map.chests || []) if (!near(c.x, c.y)) errs.push(`chest ${c.id} @${c.x},${c.y}`);
  for (const i of f.map.inspect || []) if (!near(i.x, i.y)) errs.push(`inspect @${i.x},${i.y}`);
  for (const e of f.map.exits || []) {
    let any = false;
    for (let y = e.y; y < e.y + (e.h || 1); y++) for (let x = e.x; x < e.x + (e.w || 1); x++) if (seen.has(`${x},${y}`)) any = true;
    if (!any) errs.push(`exit to ${e.to} @${e.x},${e.y}`);
  }
  h.expect(!errs.length, `${f.mapId}: everything reachable${errs.length ? ` — unreachable: ${errs.join('; ')}` : ''}`);
}
