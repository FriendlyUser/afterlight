// Side-quest markers (blue): every step of every optional quest the story sets with
// s.quest(id, title, desc) has an entry in src/data/objectives/side*.js (null `at` is
// fine: no marker), bounty steps included, and every target names a real map, an
// in-bounds tile and a real NPC. Errors name the story file, so they're easy to split up.
// Run: tools/test.sh side_quests 60000
import { MAPS } from '../src/data/maps/index.js';
import { contentReady } from '../src/data/content/index.js';
import { SIDE_TARGETS, sideQuestEntry } from '../src/data/objectives/side.js';
import { BOUNTIES } from '../src/story/side.js';
import { TileGrid } from '../src/world/MapBuilder.js';

const STR = String.raw`'((?:\\.|[^'\\])*)'`;
const CALL = new RegExp(String.raw`\bquest\(\s*(?:'([a-z0-9_]+)'|([A-Z_]+))\s*,\s*(?:null|${STR})\s*,\s*(null|${STR}|` + '`((?:\\\\.|[^`\\\\])*)`' + String.raw`)\s*(?:,\s*'(\w+)')?\s*\)`, 'g');
const unescape = (s) => s.replace(/\\(.)/g, '$1');

/** Every [id, desc] an active step sets in a story file (template descs: their fixed start). */
export function questStepsIn(src) {
  const consts = Object.fromEntries([...src.matchAll(/const ([A-Z_]+) = '([a-z0-9_]+)'/g)].map((m) => [m[1], m[2]]));
  const out = [];
  for (const m of src.matchAll(CALL)) {
    const id = m[1] || consts[m[2]];
    const status = m[7] || 'active';
    if (!id || status !== 'active' || m[4] === 'null') continue;
    const desc = m[5] !== undefined ? unescape(m[5]) : m[6] !== undefined ? unescape(m[6]).split('${')[0] : null;
    if (desc === null) continue;
    out.push([id, desc]);
  }
  return out;
}

export async function run(game, h) {
  await contentReady;
  const errors = [];
  const listing = await (await fetch('../src/story/')).text();
  const files = [...listing.matchAll(/href="([\w-]+\.js)"/g)].map((m) => m[1]);
  const seen = new Set();
  let steps = 0;
  for (const f of files) {
    const src = await (await fetch(`../src/story/${f}`)).text();
    for (const [id, desc] of questStepsIn(src)) {
      steps++;
      seen.add(id);
      if (!sideQuestEntry(id, desc)) errors.push(`${f}: ${id}: no marker entry for step "${desc.slice(0, 70)}"`);
    }
  }
  // Bounties set their quests from templates (story/side.js).
  for (const b of BOUNTIES) {
    const id = `side_b_${b.id}`;
    seen.add(id);
    for (const desc of [`Hunt ${b.name} — ${b.where}.`, `${b.name} is slain.`]) {
      steps++;
      if (!sideQuestEntry(id, desc)) errors.push(`side.js: ${id}: no marker entry for step "${desc}"`);
    }
  }

  const grids = new Map();
  for (const e of SIDE_TARGETS) {
    if (!seen.has(e.quest)) errors.push(`entry for unknown quest ${e.quest}`);
    for (const t of e.at ? [].concat(e.at) : []) {
      const where = `${e.quest}${e.step ? ` "${e.step.slice(0, 30)}…"` : ''} → ${t.map}`;
      const m = MAPS[t.map];
      if (!m) { errors.push(`${where}: unknown map`); continue; }
      if ((t.x === undefined) !== (t.y === undefined)) errors.push(`${where}: give both x and y`);
      if (t.x !== undefined) {
        if (!grids.has(t.map)) grids.set(t.map, new TileGrid(m));
        const g = grids.get(t.map);
        if (!g.inside(t.x, t.y)) errors.push(`${where}: (${t.x},${t.y}) is outside the ${g.w}x${g.h} map`);
        else if (g.def(t.x, t.y).void) errors.push(`${where}: (${t.x},${t.y}) is void`);
      }
      if (t.npc && !(m.npcs || []).some((n) => n.id === t.npc) && t.x === undefined) {
        errors.push(`${where}: npc ${t.npc} isn't in the map's npcs (a scripted spawn needs x, y too)`);
      }
    }
  }
  h.log(`side quests ${seen.size}, steps ${steps}, entries ${SIDE_TARGETS.length}, story files ${files.length}`);
  if (errors.length) {
    console.error(`SIDE QUEST ERRORS (${errors.length}):\n${errors.join('\n')}`);
    throw new Error(`${errors.length} side-quest marker problems`);
  }
}
