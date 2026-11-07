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
    for (const e of m.exits || []) {
      if (e.to === '@world') continue;
      if (!MAPS[e.to]) err(`map ${id}: exit to unknown map ${e.to}`);
      else if (MAPS[e.to].ground && (e.ty >= MAPS[e.to].ground.length || e.tx >= MAPS[e.to].ground[0].length)) err(`map ${id}: exit to ${e.to} lands out of bounds (${e.tx},${e.ty})`);
    }
    for (const b of m.buildings || []) if (b.door?.to && !MAPS[b.door.to]) err(`map ${id}: door to unknown map ${b.door.to}`);
    for (const s of m.structures || []) if (s.doorTo && !MAPS[s.doorTo]) err(`map ${id}: structure door to unknown map ${s.doorTo}`);
    for (const n of m.npcs || []) {
      if (typeof n.look === 'string' && !LOOKS[n.look]) err(`map ${id}: npc ${n.id} unknown look ${n.look}`);
      if (n.x >= w || n.y >= m.ground.length) err(`map ${id}: npc ${n.id} out of bounds`);
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
