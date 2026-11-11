// Content pack: hunt — the Hunter's Ledger (data/hunt.js, story/hunt.js). The ten marks
// and the brood some of them bring, their moves and battle plans, Greer Thackery and
// her Compendium, the keepsakes she gives, and where all of them stand on the maps.

import { ITEMS } from '../items.js';
import { EQUIPMENT } from '../equipment.js';
import { SKILLS } from '../skills.js';
import { MARKS, markAt, greerHere } from '../hunt.js';
import { HUNT } from '../../story/hunt.js';

// ------------------------------------------------------------------ items
Object.assign(ITEMS, {
  hm_compendium: {
    name: 'Thackery\'s Compendium', kind: 'key', icon: '❦',
    desc: 'Greer Thackery\'s spare copy of her book of creatures. It fills in as you fight: open the Compendium from the menu.',
  },
});
const gear = (id, def) => { EQUIPMENT[id] = { id, slot: 'accessory', tier: 0, price: 0, ...def }; };
gear('hm_hunters_charm', { name: 'Hunter\'s Charm', mods: { crit: 5, dropPct: 25 }, desc: 'Critical rate +5%. Foes drop items 25% more often. A tracker\'s first token from the Collegium.' });
gear('hm_stalkers_cloak', { name: 'Stalker\'s Cloak', mods: { evade: 6, expPct: 10 }, desc: 'Evasion +6%. EXP +10%. It smells of every forest you have lain in, waiting.' });
gear('hm_huntmasters_horn', { name: 'Huntmaster\'s Horn', flags: ['firstStrike'], mods: { crit: 10, dropPct: 50 }, desc: 'You strike first more often. Critical rate +10%. Drops +50%. Greer\'s own, given to the only hunters who finished her Ledger.' });

// ------------------------------------------------------------------ moves
Object.assign(SKILLS, {
  hm_gore: { name: 'Gore', kind: 'phys', target: 'enemy', power: 230, elem: 'pierce', anim: 'bite' },
  hm_trample: { name: 'Trample', kind: 'phys', target: 'enemies', power: 105, elem: 'blunt', anim: 'quake' },
  hm_silk: { name: 'Silk Shroud', kind: 'support', target: 'enemies', status: [['slow', 0.6]], anim: 'status' },
  hm_venom: { name: 'Venom Fang', kind: 'phys', target: 'enemy', power: 140, elem: 'pierce', status: [['poison', 0.7]], anim: 'bite' },
  hm_plague: { name: 'Plague Breath', kind: 'mag', target: 'enemies', power: 75, elem: 'dark', status: [['poison', 0.45]], anim: 'dark' },
  hm_devour: { name: 'Devour', kind: 'special', target: 'ally', special: 'devour', anim: 'bite' },
  hm_gaze: { name: 'Glass Gaze', kind: 'support', target: 'enemy', status: [['stun', 0.55], ['slow', 0.6]], anim: 'status' },
  hm_shed: { name: 'Shed Skin', kind: 'heal', target: 'self', power: 0, cure: 'bad', selfBuffs: { def: 2, res: 2 }, anim: 'buff' },
  hm_croak: { name: 'Bog Croak', kind: 'support', target: 'enemies', status: [['sleep', 0.45]], anim: 'song' },
  hm_flop: { name: 'Belly Flop', kind: 'phys', target: 'enemy', power: 220, elem: 'blunt', anim: 'quake' },
  hm_hush: { name: 'Hymn of Hush', kind: 'mag', target: 'enemies', power: 100, elem: 'light', status: [['silence', 0.5]], anim: 'song' },
  hm_barrage: { name: 'Scrap Barrage', kind: 'phys', target: 'random', power: 65, hits: 4, elem: 'blunt', anim: 'blunt' },
  hm_whiteout: { name: 'Whiteout', kind: 'mag', target: 'enemies', power: 90, elem: 'ice', status: [['blind', 0.4]], anim: 'ice' },
  hm_dreamless: { name: 'Dreamless', kind: 'mag', target: 'enemy', power: 210, elem: 'dark', anim: 'dark' },
});

// ------------------------------------------------------------------ marks and brood
const SPRITES = {
  gnarlhide: { type: 'boar', color: '#86624a', accent: '#efe2c4', eye: '#ff4020', size: 2, seed: 201 },
  widow: { type: 'spider', color: '#3a2a3a', accent: '#c03040', eye: '#ff4060', size: 2, seed: 202 },
  knot: { type: 'horror', color: '#6a5a50', accent: '#c09080', eye: '#ff4040', size: 2, seed: 204 },
  glasseye: { type: 'drake', color: '#d8c8a0', accent: '#80e0ff', eye: '#ffffff', size: 2, seed: 205 },
  belcher: { type: 'slime', color: '#5a7a3a', accent: '#d0c060', eye: '#ffe040', size: 3, seed: 206 },
  cinderjaw: { type: 'drake', color: '#3a3030', accent: '#ff7030', eye: '#ffd060', size: 2, seed: 207 },
  hymnal: { type: 'serpent', color: '#3a4a6a', accent: '#e0d0a0', eye: '#80e0ff', size: 3, seed: 208 },
  scrapking: { type: 'golem', color: '#8a7a6a', accent: '#d0a040', eye: '#ff4020', size: 2, seed: 209 },
  frost: { type: 'ghost', color: '#e0f0ff', eye: '#4aa0ff', size: 2, seed: 210 },
  neverwake: { type: 'eye', color: '#2a1a3a', accent: '#a060ff', eye: '#ffe0ff', size: 2, seed: 211 },
};

/**
 * A mark (boss-built: HP authored directly, no fleeing, its own battle plan).
 * @param {string} key
 * @param {number} level
 * @param {Partial<import('../../types/data').EnemyDef>} opts
 * @returns {import('../../types/data').EnemyDef}
 */
const M = (key, level, opts) => ({ id: `hm_${key}`, name: MARKS[key].name, level, sprite: SPRITES[key], boss: true, mark: true, ai: `hm_${key}`, ...opts });

/** @type {import('../../types/data').EnemyDef[]} */
const enemies = [
  M('gnarlhide', 15, {
    stats: { hp: 12, str: 1.51, def: 1.2, spd: 0.9, exp: 6, gold: 5, cp: 4 }, weak: ['pierce', 'fire'], resist: { blunt: 0.7 }, poise: 6,
    drops: [['vigor_seed', 1]], steal: ['hi_tonic', 'vigor_seed'],
    desc: 'The farmers of Thistledown have lost three fences, two carts and a scarecrow to him. They have stopped counting the turnips.',
  }),
  M('widow', 16, {
    stats: { hp: 11, str: 1.23, mag: 1.34, spd: 1.1, exp: 6, gold: 5, cp: 4 }, weak: ['fire', 'slash'], immune: ['poison'], poise: 6, summons: ['hm_widowling'],
    drops: [['echo_herb', 1]], steal: ['antidote', 'ether'],
    desc: 'She has been spinning in the Whisperwold\'s heart since before the Mother. The web catches birds, deer and, once, a tax collector.',
  }),
  M('knot', 18, {
    stats: { hp: 10, str: 1.23, exp: 6, gold: 6, cp: 4 }, weak: ['fire', 'pierce'], resist: { dark: 0.5 }, immune: ['poison'], poise: 7, summons: ['sewer_rat'],
    drops: [['panacea', 1]], steal: ['antidote', 'panacea'],
    desc: 'A rat king: a hundred rats bound tail to tail, sharing one hunger. When it is hurt it eats a few of its own and grows back.',
  }),
  M('glasseye', 24, {
    stats: { hp: 13, mag: 1.51, def: 1.1, exp: 6, gold: 6, cp: 4 }, weak: ['blunt', 'ice'], resist: { fire: 0, light: 0.5 }, immune: ['stun'], poise: 7,
    drops: [['saltglass', 1]], steal: ['hi_ether', 'saltglass'],
    desc: 'A sun-basilisk of the Sunscar. Its glass eye holds the noon, and anyone who meets its gaze stands very still.',
  }),
  M('belcher', 30, {
    stats: { hp: 13, str: 1.4, mag: 1.34, spd: 0.8, exp: 6, gold: 6, cp: 4 }, weak: ['ice', 'pierce'], resist: { dark: 0.5, blunt: 0.6 }, immune: ['poison', 'sleep'], poise: 7, summons: ['c4b_rot_toad'],
    drops: [['mega_tonic', 1]], steal: ['echo_herb', 'mega_tonic'],
    desc: 'Grandfather of every toad in the Mirefen, by his own account. Sings to the marsh at dusk, and the marsh goes to sleep.',
  }),
  M('cinderjaw', 40, {
    stats: { hp: 14, str: 1.46, mag: 1.46, exp: 6, gold: 6, cp: 4 }, weak: ['ice', 'pierce'], resist: { fire: -1, dark: 0.5 }, poise: 8, summons: ['c6_ash_mote'],
    drops: [['mega_tonic', 1]], steal: ['burn_salve', 'mega_tonic'],
    desc: 'It swims through the Drift\'s ash as a pike swims through a pond. Where it surfaces, the ash remembers it was once fire.',
  }),
  M('hymnal', 46, {
    stats: { hp: 16, mag: 1.57, spd: 1.05, exp: 6, gold: 6, cp: 4 }, weak: ['bolt', 'slash'], resist: { ice: 0.5, light: 0.5 }, immune: ['silence'], poise: 8,
    drops: [['x_ether', 1]], steal: ['hi_ether', 'wake_charm'],
    desc: 'It lived under the Drowned Choir for a hundred years, listening. When the singers drowned, it took up the hymns.',
  }),
  M('scrapking', 53, {
    stats: { hp: 13, str: 1.51, def: 1.6, spd: 0.85, exp: 6, gold: 7, cp: 4 }, weak: ['bolt', 'blunt'], resist: { slash: 0.5, pierce: 0.5, fire: 0.7 }, poise: 9, summons: ['c9_rivet_drone'],
    drops: [['scrap_gear', 1]], steal: ['scrap_gear', 'x_tonic'],
    desc: 'Every engine that fell into the Boneyard went into it. It crowned itself with the rivets. It has never stopped building.',
  }),
  M('frost', 64, {
    stats: { hp: 15, mag: 1.57, def: 1.6, exp: 6, gold: 7, cp: 4 }, weak: ['fire', 'light'], resist: { ice: -1, dark: 0.5 }, immune: ['sleep', 'slow'], poise: 9, summons: ['c11_snow_stalker'],
    drops: [['frost_lily', 1]], steal: ['frost_lily', 'frost_ring'],
    desc: 'The pass\'s oldest story. She sings travelers to sleep in the snow, the monks say, and her wolves come for them after.',
  }),
  M('neverwake', 70, {
    stats: { hp: 15, mag: 1.62, def: 1.5, exp: 6, gold: 7, cp: 4 }, weak: ['light', 'pierce'], resist: { dark: -1 }, immune: ['sleep', 'doom', 'blind'], poise: 10,
    drops: [['megalixir', 1]], steal: ['x_ether', 'megalixir'],
    desc: 'An eye at the bottom of the Rift that has never once closed. It has been very tired for a very long time, and it wants company.',
  }),
  {
    id: 'hm_widowling', name: 'Widowling', level: 13, chapter: 'marks', sprite: { type: 'spider', color: '#5a3a4a', accent: '#c03040', eye: '#ff4060', seed: 203 },
    stats: { hp: 0.5, spd: 1.3, exp: 0.3, gold: 0.2 }, weak: ['fire', 'slash'], poise: 1,
    skills: [['e_sting', 2], ['e_web', 1]], drops: [], steal: ['antidote', 'antidote'],
    desc: 'One of the Widow\'s brood. She has hundreds. Mostly they are hungry.',
  },
];

const T = (list, opts = {}) => ({ enemies: list, boss: true, music: 'boss', canFlee: false, ...opts });
/** @type {Record<string, import('../../types/data').TroopDef>} */
const troops = {
  hm_gnarlhide: T(['hm_gnarlhide']),
  hm_widow: T(['hm_widowling', 'hm_widow', 'hm_widowling']),
  hm_knot: T(['hm_knot']),
  hm_glasseye: T(['hm_glasseye'], { bg: 'desert' }),
  hm_belcher: T(['hm_belcher']),
  hm_cinderjaw: T(['hm_cinderjaw'], { bg: 'ruin' }),
  hm_hymnal: T(['hm_hymnal']),
  hm_scrapking: T(['c9_rivet_drone', 'hm_scrapking']),
  hm_frost: T(['c11_snow_stalker', 'hm_frost']),
  hm_neverwake: T(['hm_neverwake'], { bg: 'gloam' }),
};

// ------------------------------------------------------------------ battle plans
// Each mark has a rhythm a careful party can read: a tell before its big move (Guard,
// or Break it to interrupt), something it does when it's hurt, and a brood or a trick.
// Open turns go through EnemyMind's judgement (c.pick).

const live = (c, id) => c.allies.filter((a) => a.def.id === id);

const bossAI = {
  hm_gnarlhide(c) {
    if (c.m.goring) { c.m.goring = false; return c.use('hm_gore'); }
    if (c.hpPct < 0.5 && c.once('rage')) { c.say('Old Gnarlhide\'s hackles rise. He paws the earth.'); return c.use('e_enrage'); }
    if (c.turn % 4 === 3) { c.m.goring = true; c.say('Old Gnarlhide lowers his tusks and scrapes the ground...'); return c.use('e_gather'); }
    return c.pick([['e_tackle', 3], ['hm_trample', c.partyAlive.length >= 3 ? 2 : 0.5], ['e_slam', 1]]);
  },
  hm_widow(c) {
    if (c.turn === 1) { c.say('The Widow throws a shroud of silk over everything.'); return c.use('hm_silk'); }
    if (live(c, 'hm_widowling').length < 2 && c.turn % 3 === 0) { c.say('The web shivers. More of the brood come down it.'); return c.use('e_summon'); }
    const poisoned = c.partyAlive.filter((p) => p.hasStatus('poison'));
    if (poisoned.length && c.rnd() < 0.4) return c.use('e_drain', [poisoned[0]]);
    return c.pick([['hm_venom', 3], ['hm_silk', 1], ['e_bite', 1]]);
  },
  hm_knot(c) {
    const rats = live(c, 'sewer_rat');
    // It eats its own to mend (three times at most, never two turns running) and
    // calls more up every third turn: kill the rats and it starves.
    const fed = c.m.fed || 0;
    if (c.hpPct < 0.6 && rats.length && fed < 3 && c.turn - (c.m.lastFed || -9) >= 3) {
      c.m.fed = fed + 1; c.m.lastFed = c.turn;
      c.say('Mother Knot pulls one of its own rats into itself...');
      return c.use('hm_devour', [rats[0]]);
    }
    if (rats.length < 2 && c.turn % 3 === 2) { c.say('A hundred voices squeal. Rats boil up out of the drains.'); return c.use('e_summon'); }
    return c.pick([['hm_plague', 2], ['e_bite', 3], ['e_drain', 1]]);
  },
  hm_glasseye(c) {
    if (c.m.breathing) { c.m.breathing = false; return c.use('e_bigbreath'); }
    if (c.hpPct < 0.4 && c.once('shed')) { c.say('Glasseye\'s skin cracks and peels away. Fresh glass gleams underneath.'); return c.use('hm_shed'); }
    if (c.turn % 4 === 0) { c.m.breathing = true; c.say('The sun in Glasseye\'s eye flares white...'); return c.use('e_charge'); }
    return c.pick([['hm_gaze', 2], ['e_firebreath', 2], ['e_bite', 2]]);
  },
  hm_belcher(c) {
    const sleeper = c.partyAlive.find((p) => p.hasStatus('sleep'));
    if (sleeper && c.rnd() < 0.7) return c.use('hm_flop', [sleeper]);
    if (c.turn % 4 === 1) { c.say('Old Belcher\'s throat swells like a bellows...'); return c.use('hm_croak'); }
    if (c.hpPct < 0.6 && live(c, 'c4b_rot_toad').length < 2 && c.once(`toads${Math.floor(c.turn / 5)}`)) { c.say('Old Belcher croaks. The bog croaks back.'); return c.use('e_summon'); }
    return c.pick([['e_tackle', 2], ['e_poison', 1], ['hm_flop', 1]]);
  },
  hm_cinderjaw(c) {
    if (c.m.breathing) { c.m.breathing = false; return c.use('e_bigbreath'); }
    if (c.hpPct < 0.35 && c.once('rage')) { c.say('Cinderjaw\'s scales split open, and fire pours out of the cracks.'); return c.use('e_enrage'); }
    if (live(c, 'c6_ash_mote').length < 2 && c.turn % 3 === 2) { c.say('Cinderjaw thrashes. Burning motes spin up out of the ash.'); return c.use('e_summon'); }
    if (c.turn % 4 === 0) { c.m.breathing = true; c.say('Cinderjaw dives under the ash. The ground grows hot...'); return c.use('e_charge'); }
    return c.pick([['e_firebreath', 2], ['e_bite', 3], ['e_crush', 1]]);
  },
  hm_hymnal(c) {
    if (c.m.tide) { c.m.tide = false; return c.use('e_tidal'); }
    if (c.turn % 5 === 4) { c.m.tide = true; c.say('Hymnal takes a deep breath and holds it, like a singer before the last verse...'); return c.use('e_charge'); }
    // Hush the casters first; then crush whoever can still fight.
    const loud = c.partyAlive.filter((p) => !p.hasStatus('silence') && p.matk > p.atk);
    if (loud.length >= 2 && c.rnd() < 0.6) return c.use('hm_hush');
    return c.pick([['e_constrict', 2], ['e_silence', loud.length ? 1.5 : 0], ['e_spit', 2], ['hm_hush', 1]]);
  },
  hm_scrapking(c) {
    const drones = live(c, 'c9_rivet_drone');
    if (c.m.crushing) { c.m.crushing = false; return c.use('e_crush'); }
    if (c.hpPct < 0.5 && drones.length && (c.m.fed || 0) < 3 && c.turn - (c.m.lastFed || -9) >= 3) {
      c.m.fed = (c.m.fed || 0) + 1; c.m.lastFed = c.turn;
      c.say('The Scrap King tears a drone apart and bolts the pieces into himself.');
      return c.use('hm_devour', [drones[0]]);
    }
    if (drones.length < 2 && c.turn % 3 === 0) { c.say('The Scrap King hammers a new drone together out of nothing.'); return c.use('e_summon'); }
    if (c.turn % 4 === 1) { c.m.crushing = true; c.say('The Scrap King raises both fists over his crown...'); return c.use('e_gather'); }
    return c.pick([['hm_barrage', 2], ['attack', 2], ['e_quake', 1]]);
  },
  hm_frost(c) {
    const sleepers = c.partyAlive.filter((p) => p.hasStatus('sleep'));
    if (c.turn % 4 === 1) { c.say('Grandmother Frost begins to hum a lullaby...'); return c.use('e_sleep'); }
    if (live(c, 'c11_snow_stalker').length < 2 && c.turn % 3 === 0) { c.say('"Come, children. Supper."'); return c.use('e_summon'); }
    if (sleepers.length && c.rnd() < 0.5) return c.use('e_frost', [sleepers[0]]);
    return c.pick([['hm_whiteout', 2], ['e_icebreath', 2], ['e_drain', 1]]);
  },
  hm_neverwake(c) {
    if (c.m.dreaming) { c.m.dreaming = false; return c.use('e_lament'); }
    const sleeper = c.partyAlive.find((p) => p.hasStatus('sleep'));
    if (sleeper && c.rnd() < 0.6) return c.use('hm_dreamless', [sleeper]);
    if (c.turn % 3 === 1) { c.say('Neverwake looks at you. Your eyelids grow heavy...'); return c.use('e_sleep'); }
    if (c.hpPct < 0.5 && c.turn % 4 === 0) { c.m.dreaming = true; c.say('The dark in the Rift draws in toward the eye...'); return c.use('e_gather'); }
    return c.pick([['e_darkwave', 2], ['e_drain', 2], ['e_doom', 0.5]]);
  },
};

// ------------------------------------------------------------------ people and places
const looks = {
  greer: {
    id: 'greer', skin: '#e8c8a8', hair: { style: 'bun', color: '#8a5a3a' }, eyes: '#4a7a4a',
    outfit: { style: 'coat', main: '#5a6a3a', accent: '#d8c8a0', trim: '#8a5a2a' }, acc: ['glasses', 'hat_wide'], weapon: 'tome', build: 'adult',
  },
};

/** A mark standing where it lives, as a monster in the field. */
const markNpc = (id, where) => {
  const spot = MARKS[id][where];
  return {
    id: `mark_${id}`, name: MARKS[id].name, look: { kind: 'monster', sprite: SPRITES[id] }, x: spot.x, y: spot.y, dir: 'left',
    hint: 'Hunt', cond: (st) => markAt(st, id) === where, run: (s) => HUNT.mark(s, id),
  };
};

const npcs = {
  aurenne: [{
    id: 'greer', name: 'Greer Thackery', look: 'greer', x: 17, y: 38, dir: 'right', hint: 'The Hunter\'s Ledger',
    cond: (st) => greerHere(st) === 'aurenne' && (st.flags.hunt_met || st.chapter >= 4), run: (s) => HUNT.greer(s),
  }],
  c6_keelhaven: [{
    id: 'greer', name: 'Greer Thackery', look: 'greer', x: 21, y: 15, dir: 'down', hint: 'The Hunter\'s Ledger',
    cond: (st) => greerHere(st) === 'c6_keelhaven', run: (s) => HUNT.greer(s),
  }],
};
for (const id of Object.keys(MARKS)) {
  for (const where of ['home', 'after']) {
    const spot = MARKS[id][where];
    if (spot) (npcs[spot.map] ||= []).push(markNpc(id, where));
  }
}

// Greer finds the party on Aurenne's canal bridge, the first time they cross it once
// they are free to roam the city (any later visit, if the story kept them busy).
const triggers = {
  aurenne: [{
    id: 'greer_meet', x: 19, y: 39, w: 4, h: 2, once: false,
    cond: (st) => !!st.flags.c3_pip_joined && !st.flags.hunt_met && !(st.flags.c3_morning && !st.flags.c3_mercy_down),
    run: (s) => HUNT.meet(s),
  }],
};

/** @type {import('../../types/data').ContentPack} */
export default { enemies, troops, bossAI, looks, npcs, triggers };
