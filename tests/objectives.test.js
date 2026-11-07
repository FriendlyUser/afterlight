// Quest markers: every objective the story sets has an entry in src/data/objectives,
// and every target names a real map, an in-bounds tile and a real NPC.
// Run: tools/test.sh objectives 60000
import { MAPS } from '../src/data/maps/index.js';
import { contentReady } from '../src/data/content/index.js';
import { OBJECTIVE_TARGETS, hasObjectiveEntry } from '../src/data/objectives/index.js';
import { TileGrid } from '../src/world/MapBuilder.js';

/**
 * Every objective text in a story source file: string literals on s.objective(...)
 * lines, and the returns of helper functions named like mainObjective().
 */
function objectivesIn(src) {
  const out = [];
  let helper = false;
  for (const line of src.split('\n')) {
    if (/function \w*Objective\(/.test(line)) helper = true;
    else if (line.startsWith('}')) helper = false;
    const at = helper ? line.search(/return\s/) : line.search(/\.objective\(|vars\.objective\s*=/);
    if (at < 0 || line.includes('objective(text')) continue;
    const call = line.slice(at).replace(/\b(flag|has|setFlag)\('[^']*'\)/g, ''); // s.flag('x') ? … : … names a flag, not an objective
    for (const m of call.matchAll(/'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\])*)`/g)) {
      let text = (m[1] ?? m[2] ?? m[3]).replace(/\\(.)/g, '$1');
      if (m[3] !== undefined) text = text.split('${')[0]; // template: the fixed start
      if (text.length >= 8) out.push(text);
    }
  }
  return out;
}

export async function run(game, h) {
  await contentReady;
  const errors = [];
  const listing = await (await fetch('../src/story/')).text();
  const files = [...listing.matchAll(/href="([\w-]+\.js)"/g)].map((m) => m[1]);
  let count = 0;
  for (const f of files) {
    const src = await (await fetch(`../src/story/${f}`)).text();
    for (const text of objectivesIn(src)) {
      count++;
      if (!hasObjectiveEntry(text)) errors.push(`${f}: no quest-marker entry for "${text}"`);
    }
  }

  const grids = new Map();
  for (const e of OBJECTIVE_TARGETS) {
    if (!e.text) errors.push('entry without text');
    for (const t of e.at ? [].concat(e.at) : []) {
      const where = `"${e.text.slice(0, 40)}…" → ${t.map}`;
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
  h.log(`objectives ${count}, entries ${OBJECTIVE_TARGETS.length}, story files ${files.length}`);
  if (errors.length) {
    console.error(`OBJECTIVE ERRORS (${errors.length}):\n${errors.join('\n')}`);
    throw new Error(`${errors.length} objective problems`);
  }
}
