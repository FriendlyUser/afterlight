// Validates all registered content: cross-references between maps, NPC looks,
// items, enemies, troops, skills, shops and world nodes. Run: tools/test.sh validate 20000
import { MAPS } from '../src/data/maps/index.js';
import { ENEMIES } from '../src/data/enemies.js';
import { TROOPS } from '../src/data/troops.js';
import { SKILLS } from '../src/data/skills.js';
import { ITEMS } from '../src/data/items.js';
import { EQUIPMENT } from '../src/data/equipment.js';
import { LOOKS } from '../src/data/looks.js';
import { SHOPS } from '../src/data/shops.js';
import { CRESTS } from '../src/data/crests.js';
import { PASSIVES } from '../src/data/passives.js';
import { BOSS_AI } from '../src/battle/AI.js';
import { WORLD_NODES } from '../src/data/worldmap.js';
import { MONSTER_TYPES } from '../src/render/MonsterFactory.js';
import { BATTLE_BACKGROUNDS } from '../src/battle/Backgrounds.js';
import { MOODS } from '../src/render/Moods.js';
import { SONGS } from '../src/audio/songs.js';
import { GROUND, PROP_CHARS } from '../src/world/Legend.js';
import { contentReady } from '../src/data/content/index.js';
import { CHARACTERS } from '../src/data/characters.js';
import { TileGrid } from '../src/world/MapBuilder.js';

const grids = new Map();
const inRect = (r, x, y) => x >= r.x && x < r.x + (r.w || 1) && y >= r.y && y < r.y + (r.h || 1);

/** Why arriving at (x, y) on map `to` is broken, or '' if it's a fine place to stand. */
function arrivalProblem(to, x, y) {
  const m = MAPS[to];
  if (!m) return 'goes to an unknown map';
  if (!grids.has(to)) grids.set(to, new TileGrid(m));
  const g = grids.get(to);
  if (!g.inside(x, y)) return `lands outside the ${g.w}x${g.h} map`;
  const d = g.def(x, y);
  if (d.void || d.wall) return `lands on ${d.void ? 'void' : 'a wall'}`;
  // Standing on an exit sends the player straight back out on their first step.
  if ((m.exits || []).some((e) => inRect(e, x, y))) return 'lands on an exit';
  // Buildings are solid, door tile included (walking into a door opens it).
  if ((m.buildings || []).some((b) => inRect({ x: b.x, y: b.y, w: b.w, h: b.d }, x, y))) return 'lands inside a building';
  return '';
}

export async function run(game, h) {
  await contentReady;
  const errors = [];
  const err = (m) => errors.push(m);
  const item = (id) => ITEMS[id] || EQUIPMENT[id];

  for (const [id, c] of Object.entries(CHARACTERS)) {
    for (const [slot, it] of Object.entries(c.equip || {})) if (!EQUIPMENT[it]) err(`character ${id}: unknown ${slot} ${it}`);
    if (!LOOKS[c.look]) err(`character ${id}: unknown look ${c.look}`);
  }
  for (const [id, c] of Object.entries(CRESTS)) {
    for (const r of c.ranks) {
      if (r.skill && !SKILLS[r.skill]) err(`crest ${id}: unknown skill ${r.skill}`);
      if (r.passive && !PASSIVES[r.passive]) err(`crest ${id}: unknown passive ${r.passive}`);
    }
    // Two Mastery Arts, at stars 1 and 3, each a real Art with a description, used by no other Crest.
    const mastery = c.mastery || [];
    if (mastery.map((m) => m.stars).join() !== '1,3') err(`crest ${id}: Mastery Arts should unlock at ★1 and ★3`);
    for (const m of mastery) {
      if (!SKILLS[m.skill]) err(`crest ${id}: unknown Mastery Art ${m.skill}`);
      else if (!SKILLS[m.skill].desc) err(`crest ${id}: Mastery Art ${m.skill} has no description`);
      for (const [other, o] of Object.entries(CRESTS)) {
        if (other !== id && [...o.ranks, ...(o.mastery || [])].some((u) => u.skill === m.skill)) err(`crest ${id}: Mastery Art ${m.skill} is also taught by ${other}`);
      }
    }
  }
  for (const [id, e] of Object.entries(ENEMIES)) {
    for (const [s] of e.skills || []) if (!SKILLS[s]) err(`enemy ${id}: unknown skill ${s}`);
    for (const [d] of e.drops || []) if (!item(d)) err(`enemy ${id}: unknown drop ${d}`);
    for (const d of e.steal || []) if (!item(d)) err(`enemy ${id}: unknown steal ${d}`);
    for (const s of e.summons || []) if (!ENEMIES[s]) err(`enemy ${id}: unknown summon ${s}`);
    if (e.ai && !BOSS_AI[e.ai]) err(`enemy ${id}: unknown ai ${e.ai}`);
    if (!e.sprite || !MONSTER_TYPES.includes(e.sprite.type)) err(`enemy ${id}: bad sprite type ${e.sprite?.type}`);
    if (e.sprite?.type === 'humanoid' && typeof e.sprite.look === 'string' && !LOOKS[e.sprite.look]) err(`enemy ${id}: unknown look ${e.sprite.look}`);
    if (!e.level) err(`enemy ${id}: missing level`);
  }
  for (const [id, t] of Object.entries(TROOPS)) {
    for (const e of t.enemies) if (!ENEMIES[e]) err(`troop ${id}: unknown enemy ${e}`);
    if (t.bg && !BATTLE_BACKGROUNDS[t.bg]) err(`troop ${id}: unknown bg ${t.bg}`);
    if (t.music && !SONGS[t.music]) err(`troop ${id}: unknown music ${t.music}`);
  }
  for (const [id, s] of Object.entries(SHOPS)) for (const it of s.items) if (!item(it)) err(`shop ${id}: unknown item ${it}`);
  for (const n of WORLD_NODES) if (!MAPS[n.mapId]) err(`world node ${n.id}: unknown map ${n.mapId}`);

  const st = game.state;
  for (const [id, m] of Object.entries(MAPS)) {
    const w = m.ground?.[0]?.length;
    if (!m.ground?.length) { err(`map ${id}: no ground`); continue; }
    m.ground.forEach((row, y) => {
      if (row.length !== w) err(`map ${id}: ground row ${y} width ${row.length} != ${w}`);
      for (const ch of row) if (!GROUND[ch] && !(m.legend && m.legend[ch])) { err(`map ${id}: unknown ground char '${ch}' row ${y}`); break; }
    });
    (m.props || []).forEach((row, y) => { for (const ch of row) if (ch !== ' ' && ch !== '.' && !PROP_CHARS[ch]) { err(`map ${id}: unknown prop '${ch}' row ${y}`); break; } });
    const mood = typeof m.mood === 'function' ? m.mood(st) : m.mood;
    if (mood && !MOODS[mood]) err(`map ${id}: unknown mood ${mood}`);
    const music = typeof m.music === 'function' ? m.music(st) : m.music;
    if (music && !SONGS[music]) err(`map ${id}: unknown music ${music}`);
    if (m.battleBg && !BATTLE_BACKGROUNDS[m.battleBg]) err(`map ${id}: unknown battleBg ${m.battleBg}`);
    const arrivals = [
      ...(m.exits || []).filter((e) => e.to !== '@world').map((e) => ({ via: 'exit', to: e.to, tx: e.tx, ty: e.ty })),
      ...(m.buildings || []).filter((b) => b.door?.to).map((b) => ({ via: 'door', to: b.door.to, tx: b.door.tx, ty: b.door.ty })),
      ...(m.structures || []).filter((s) => s.doorTo).map((s) => ({ via: 'structure door', to: s.doorTo, tx: s.tx, ty: s.ty })),
    ];
    for (const a of arrivals) {
      const problem = arrivalProblem(a.to, a.tx, a.ty);
      if (problem) err(`map ${id}: ${a.via} to ${a.to} (${a.tx},${a.ty}) ${problem}`);
    }
    for (const n of m.npcs || []) {
      if (typeof n.look === 'string' && !LOOKS[n.look]) err(`map ${id}: npc ${n.id} unknown look ${n.look}`);
      if (n.x >= w || n.y >= m.ground.length) err(`map ${id}: npc ${n.id} out of bounds`);
      if ((m.buildings || []).some((b) => inRect({ x: b.x, y: b.y, w: b.w, h: b.d }, n.x, n.y))) err(`map ${id}: npc ${n.id} stands inside a building (${n.x},${n.y})`);
    }
    for (const c of m.chests || []) if (c.item && !item(c.item)) err(`map ${id}: chest unknown item ${c.item}`);
    for (const [t] of m.encounters?.troops || []) if (!TROOPS[t]) err(`map ${id}: encounter unknown troop ${t}`);
  }
  h.log(`maps ${Object.keys(MAPS).length}, enemies ${Object.keys(ENEMIES).length}, troops ${Object.keys(TROOPS).length}`);
  if (errors.length) {
    console.error(`VALIDATION ERRORS (${errors.length}):\n${errors.join('\n')}`);
    throw new Error(`${errors.length} validation errors`);
  }
}
