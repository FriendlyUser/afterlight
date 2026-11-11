// The Compendium: Greer Thackery's book of every creature (ui/menu/CompendiumScreen.js,
// story/hunt.js). Which section of the book a creature belongs in, its number, where
// it lives, how it fights in plain words, and how much the party has learned of it.
//
// What the party learns comes from battle (BattleSystem's bestiary records, kept from
// the very first fight whether or not the book has been found yet):
//   seen       met at least once: name, picture and the book's description
//   defeated   felled at least once: HP, rewards, drops, habitat
//   studied    felled STUDY_DEFEATS times (or once, for a boss or mark): its tactics
//              and every resistance written in
// Weaknesses fill in as they're struck (or Scanned); resistances and immunities as
// they're met; moves as they're seen used.

import { ENEMIES } from './enemies.js';
import { TROOPS } from './troops.js';
import { SKILLS } from './skills.js';
import { CHAPTERS } from '../story/chapters.js';
import { traitsOf } from '../battle/EnemyMind.js';

/** Felled this many times, a creature is fully studied. */
export const STUDY_DEFEATS = 3;

/** The book is Greer's gift (story/hunt.js); old saves past the point simply have it. */
export function compendiumOpen(st) {
  return !!st.flags.compendium || (st.chapter || 0) >= 5;
}

// The base roster (data/enemies.js) predates id prefixes; this says where each lives.
const BASE_CHAPTER = {
  1: ['brine_jelly', 'sand_crab', 'gull_harrier', 'cave_bat', 'tide_eel', 'drowned_hound', 'gloam_pup', 'brinefang'],
  2: ['wold_wolf', 'thornling', 'sporecap', 'wold_beetle', 'whisper_wisp', 'bandit', 'bandit_archer', 'red_tam', 'field_boar', 'scarecrow', 'murder_crow'],
  3: ['sewer_rat', 'bone_soldier', 'gloam_wraith', 'gloam_ooze', 'cultist', 'sister_mercy', 'gloam_beast'],
};
const BASE = Object.fromEntries(Object.entries(BASE_CHAPTER).flatMap(([c, ids]) => ids.map((id) => [id, Number(c)])));

/** The book's sections, in order. */
export const SECTIONS = [
  ...Object.keys(CHAPTERS).map(Number).filter((n) => n >= 1).map((n) => ({ id: n, name: `Chapter ${n}`, sub: CHAPTERS[n].title })),
  { id: 'side', name: 'Side Paths', sub: 'Off the road' },
  { id: 'marks', name: 'Marks', sub: 'The Hunter\'s Ledger' },
  { id: 'arena', name: 'Arenas', sub: 'The Bellring and the Echo Colosseum' },
  { id: 'postgame', name: 'The Gloam Abyss', sub: 'Below the Nadir Light' },
];

/** Which section a creature belongs in. */
export function sectionOf(def) {
  if (def.mark || def.id.startsWith('hm_')) return 'marks';
  if (def.chapter !== undefined) return def.chapter;
  if (BASE[def.id]) return BASE[def.id];
  const id = def.id;
  if (/^(bc_|pg_ar_)/.test(id)) return 'arena';
  if (id.startsWith('pg_')) return 'postgame';
  if (/^(side_|lc_)/.test(id)) return 'side';
  const m = id.match(/^c(\d+)[ab]?_/);
  if (m) return Number(m[1]);
  return 'side';
}

let ORDER = null;
/** Every creature in book order: by section, then level, then name. Built once, after packs load. */
export function bookOrder() {
  if (ORDER && ORDER.length === Object.keys(ENEMIES).length) return ORDER;
  const rank = new Map(SECTIONS.map((s, i) => [s.id, i]));
  ORDER = Object.values(ENEMIES)
    .map((e) => ({ id: e.id, def: e, section: sectionOf(e), no: 0 }))
    .sort((a, b) => (rank.get(a.section) ?? 99) - (rank.get(b.section) ?? 99) || a.def.level - b.def.level || a.def.name.localeCompare(b.def.name));
  ORDER.forEach((e, i) => { e.no = i + 1; });
  return ORDER;
}

/** "No. 042" */
export const entryNo = (n) => `No. ${String(n).padStart(3, '0')}`;

/** Maps whose wild encounters include this creature, by name (its habitat). */
let HABITAT = null;
export function habitatOf(id, maps) {
  if (!HABITAT) {
    HABITAT = {};
    for (const m of Object.values(maps)) {
      for (const [t] of m.encounters?.troops || []) {
        for (const e of TROOPS[t]?.enemies || []) {
          const list = (HABITAT[e] ||= []);
          if (!list.includes(m.name)) list.push(m.name);
        }
      }
    }
  }
  return HABITAT[id] || [];
}

/** The party's record of a creature (empty if never met). */
export function recordOf(st, id) {
  return st.bestiary?.[id] || null;
}

/** How well the party knows it: 0 unknown, 1 seen, 2 defeated, 3 studied. */
export function knowledge(st, def) {
  const r = recordOf(st, def.id);
  if (!r?.seen) return 0;
  if (!r.defeated) return 1;
  return r.defeated >= (def.boss || def.mark ? 1 : STUDY_DEFEATS) ? 3 : 2;
}

/** How many kinds the party has felled (the count Greer pays for). */
export function kindsDefeated(st) {
  return Object.keys(st.bestiary || {}).filter((id) => ENEMIES[id] && st.bestiary[id].defeated > 0).length;
}

/** Completion of the book and of each section: { seen, defeated, total }. */
export function completion(st) {
  const all = { seen: 0, defeated: 0, total: 0 };
  const by = {};
  for (const e of bookOrder()) {
    const s = (by[e.section] ||= { seen: 0, defeated: 0, total: 0 });
    const r = recordOf(st, e.id);
    for (const c of [all, s]) {
      c.total++;
      if (r?.seen) c.seen++;
      if (r?.defeated) c.defeated++;
    }
  }
  return { all, by };
}

/**
 * How it fights, in a few plain lines, read off its kit and traits (its battle plan is
 * EnemyMind's or a boss script's; this is what a careful watcher would write down).
 * @returns {string[]}
 */
export function tacticsOf(def) {
  const out = [];
  const traits = traitsOf(def);
  const skills = (def.skills || []).map(([id]) => SKILLS[id]).filter(Boolean);
  const has = (pred) => skills.some(pred);
  if (def.mark) out.push('A mark: a named beast, far stronger than its kind. It fights to the end and can\'t be fled.');
  else if (def.boss) out.push('A singular foe. It follows a plan of its own and can\'t be fled.');
  if (traits.has('pack')) out.push('Hunts as a pack: once one of them picks its prey, the others pile on. A Marked ally is the pack\'s next meal.');
  if (has((s) => s.kind === 'heal' && s.power)) out.push('Heals wounded allies. Put it down first.');
  if (has((s) => s.cure)) out.push('Cures its allies\' ailments.');
  if (traits.has('guardian')) out.push('Shields hurt or Broken allies with Protect.');
  if (has((s) => (s.target === 'ally' || s.target === 'allies') && (s.status || []).some(([k]) => k === 'haste'))) out.push('Hastens its allies.');
  if (has((s) => (s.target === 'allies') && s.buffs)) out.push('Rallies its allies to hit harder.');
  if (traits.has('thief')) out.push('Steals gold and then tries to run with it. Fell it first and you get the gold back.');
  if (traits.has('coward')) out.push('Runs when it is the last one left.');
  if (traits.has('enrage')) out.push('Flies into a rage when badly hurt.');
  const ails = new Set(skills.flatMap((s) => (s.status || []).map(([k]) => k)).filter((k) => ['poison', 'sleep', 'silence', 'blind', 'stun', 'slow', 'doom', 'burn', 'marked'].includes(k)));
  if (ails.size) out.push(`Inflicts ${[...ails].join(', ')}. It won't waste a turn on anyone already suffering it, and it remembers who shrugged it off.`);
  if (has((s) => s.debuffs)) out.push('Weakens the party\'s strength and defense.');
  if (has((s) => s.drain)) out.push('Drains life to heal itself, more eagerly the more it is hurt.');
  if (has((s) => s.special === 'selfDestruct')) out.push('Bursts when nearly dead, burning everyone near it. Finish it quickly.');
  if (has((s) => s.special === 'mpDrain')) out.push('Leeches MP, preferring casters.');
  if (has((s) => s.special === 'summon') || (def.summons || []).length) out.push('Calls others of its kind to the fight.');
  if (has((s) => s.target === 'enemies' && s.power)) out.push('Strikes the whole party at once. It prefers that while all of you are standing.');
  if (has((s) => (s.power || 0) >= 150 || (s.delay || 1) >= 1.3)) out.push('Has a heavy blow. Guard when it winds up.');
  if (!out.length || (out.length === 1 && (def.boss || def.mark))) out.push('Goes for the wounded and the exposed, and favors blows that will land.');
  return out;
}

/** "Common" / "Uncommon" / "Rare" for a drop chance. */
export function rarity(chance) {
  if (chance >= 0.5) return 'Common';
  if (chance >= 0.2) return 'Uncommon';
  return 'Rare';
}

const FAMILY = {
  slime: 'Ooze', hound: 'Beast', boar: 'Beast', bird: 'Bird', bat: 'Bat', crab: 'Shellfolk', serpent: 'Serpent',
  insect: 'Vermin', spider: 'Vermin', scorpion: 'Vermin', plant: 'Plant', mushroom: 'Fungus', treant: 'Plant',
  golem: 'Construct', orrery: 'Construct', bell: 'Construct', mimic: 'Construct', wisp: 'Wisp', elemental: 'Elemental',
  storm: 'Elemental', ghost: 'Spirit', skeleton: 'Undead', eye: 'Gloam-born', horror: 'Gloam-born', angler: 'Fish',
  drake: 'Dragon', knight: 'Humanoid', humanoid: 'Humanoid', angel: 'Choir',
};

/** Its kind, from the shape it's painted in. */
export function familyOf(def) {
  return FAMILY[def.sprite?.type] || 'Creature';
}
