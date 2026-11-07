// The Gloam Abyss, B1–B30: gameplay on top of the generated layouts.
// Themes shift every few stairs (gloam → drowned ruins → first winter → white);
// encounters climb from Lv 76 to 97, Hearthstones sit on every fifth stair,
// wardens on B10 and B20, and the First Dark waits on B30.

import { ABYSS_LAYOUTS, FLOORS, THEMES, themeOf, rng } from './postgame_abyss_gen.js';
import { GROUND } from '../../world/Legend.js';
import GATE from './layouts/postgame_gate.js';
import { PG } from '../../story/postgame.js';

const THEME_INFO = {
  gloam: { mood: 'cave', music: 'gloam', bg: 'gloam', particles: 'gloam' },
  ruin: { mood: 'ruin', music: 'ruin', bg: 'ruin' },
  ice: { mood: 'snow', music: 'snow', bg: 'snow' },
  white: { mood: 'snow', music: 'evernoon', bg: 'evernoon', particles: 'motes_gold' },
};

const SUBTITLES = [
  'Where the light gives up', 'Where lost things land', 'Where rain is remembered', 'Where the hounds were rumours',
  'Where someone sat down to rest', 'Where a child drew in chalk', 'Where the dark is deepest', 'Where a city fell out of the books',
  'Where the lamplighters still walk', 'Where the unnamed stand guard', 'Where the streets run out', 'Where the archive burned',
  'Where the saints lost their faces', 'Where no banner flies', 'Where the last page was', 'Where the first snow fell',
  'Where the wolves have no prey', 'Where the thaw never came', 'Where the glacier waits', 'Where a queen ruled no one',
  'Where something froze mid-reach', 'Where winter ends, eventually', 'Where colours were not yet invented', 'Where the shapes are unfinished',
  'Where light had no purpose', 'Where the sketches roam', 'Where the first hound ran', 'Where the first tree stood alone',
  'Where the edges end', 'Where everything began',
];

// Encounter bands: [last floor, troops]. Each floor also mixes in the band above it.
const BANDS = [
  [4, ['pg_ab1_hounds', 'pg_ab1_ooze', 'pg_ab1_moths', 'pg_ab1_mix', 'pg_ab1_pack']],
  [7, ['pg_ab2_dread', 'pg_ab2_weave', 'pg_ab2_golem', 'pg_ab2_mix', 'pg_ab2_eyes']],
  [11, ['pg_ab3_legion', 'pg_ab3_warden', 'pg_ab3_crows', 'pg_ab3_mix', 'pg_ab3_lamps']],
  [15, ['pg_ab4_saints', 'pg_ab4_drake', 'pg_ab4_knights', 'pg_ab4_creepers', 'pg_ab4_mix']],
  [19, ['pg_ab5_wolves', 'pg_ab5_lights', 'pg_ab5_sentinel', 'pg_ab5_serpent', 'pg_ab5_mix']],
  [22, ['pg_ab6_vigil', 'pg_ab6_eye', 'pg_ab6_wing', 'pg_ab6_thing', 'pg_ab6_mix']],
  [26, ['pg_ab7_unfinished', 'pg_ab7_seraph', 'pg_ab7_ooze', 'pg_ab7_beasts', 'pg_ab7_mix']],
  [29, ['pg_ab8_hounds', 'pg_ab8_knight', 'pg_ab8_tree', 'pg_ab8_eyes', 'pg_ab8_mix']],
];

function troopsFor(n) {
  const b = BANDS.findIndex(([last]) => n <= last);
  const list = BANDS[b][1].map((t) => [t, 2]);
  if (b > 0 && n - BANDS[b - 1][0] <= 1) list.push(...BANDS[b - 1][1].map((t) => [t, 0.6]));
  if (n >= 3) list.push(['pg_ab_mote', 0.35]);
  if (n >= 14) list.push(['pg_ab_motes', 0.12]);
  if (n >= 8) list.push(['pg_ab_mimic', 0.3]);
  return list;
}

// The first chest(s) on each floor hold something special; the rest roll from a pool.
const SPECIAL = {
  1: [['hi_ether', 3]], 2: [['mega_tonic', 3]], 3: [['pg_tobbs_letter', 1], ['power_fruit', 1]], 4: [['dusk_ring', 1]],
  5: [['magic_fruit', 1]], 6: [['crest_tome', 2]], 7: [['guard_fruit', 1]], 8: [['pg_abyss_heart', 1]], 9: [['spirit_fruit', 1]],
  10: [['x_ether', 2]], 11: [['crest_tome', 2]], 12: [['pg_last_lamplight', 1]], 13: [['ribbon', 1]], 14: [['swift_fruit', 1]],
  15: [['afterglow_vial', 3]], 16: [['power_fruit', 1]], 17: [['pg_dusk_mantle', 1]], 18: [['pg_rimeglass_band', 1]],
  19: [['crest_tome', 3]], 20: [['magic_fruit', 1], ['guard_fruit', 1]], 21: [['spirit_fruit', 1]], 22: [['star_pendant', 1]],
  23: [['pg_unwritten', 1]], 24: [['swift_fruit', 2]], 25: [['ribbon', 1]], 26: [['crest_tome', 4]], 27: [['pg_noonless_veil', 1]],
  28: [['pg_before_blade', 1]], 29: [['megalixir', 2]], 30: [['megalixir', 1], ['dawn_plume', 3]],
};
const POOL = [
  ['x_tonic', 2, 2], ['mega_tonic', 3, 2], ['hi_ether', 3, 2], ['x_ether', 1, 1.5], ['dawn_plume', 1, 1.5], ['elixir', 1, 1],
  ['megalixir', 1, 0.3], ['afterglow_vial', 2, 1.2], ['starfall_bomb', 2, 1], ['gloam_shard', 3, 1.2], ['crest_tome', 1, 0.8],
  ['vigor_seed', 2, 0.7], ['wisdom_seed', 2, 0.7], ['panacea', 3, 1], ['gold', 0, 1.6],
];

function chestsFor(n, spots) {
  const R = rng(n * 7717 + 3);
  const total = POOL.reduce((t, p) => t + p[2], 0);
  return spots.map(([x, y], i) => {
    const special = SPECIAL[n]?.[i];
    if (special) return { id: `c${i}`, x, y, item: special[0], count: special[1] };
    let r = R() * total;
    const [item, count] = POOL.find((p) => (r -= p[2]) <= 0) || POOL[0];
    if (item === 'gold') return { id: `c${i}`, x, y, gold: 2000 + n * 250 };
    return { id: `c${i}`, x, y, item, count };
  });
}

function floorMap(n) {
  const L = ABYSS_LAYOUTS[n];
  const S = L.spots;
  const info = THEME_INFO[themeOf(n)];
  const above = n === 1 ? { to: 'abyss_gate', at: GATE.spots.descent_front } : { to: `abyss_${n - 1}`, at: ABYSS_LAYOUTS[n - 1].spots.exitFront };
  const map = {
    ...L,
    id: `abyss_${n}`, name: `The Gloam Abyss · B${n}`, region: SUBTITLES[n - 1],
    mood: info.mood, music: info.music, battleBg: info.bg, particles: info.particles,
    camera: { dist: 18, pitch: 0.8 },
    // Low walls so the party is never lost behind a block of rock.
    legend: { [THEMES[themeOf(n)].wall]: { ...GROUND[THEMES[themeOf(n)].wall], raise: 3 } },
    encounters: n < FLOORS ? { rate: 0.95, troops: troopsFor(n) } : undefined,
    chests: chestsFor(n, L.feat.chests),
    exits: [{ x: S.upstair[0], y: S.upstair[1], to: above.to, tx: above.at[0], ty: above.at[1], dir: 'down' }],
    inspect: [],
    triggers: [],
    blockers: [],
    npcs: [],
    onEnter: (s) => PG.floorEnter(s, n),
  };
  if (S.downstair) {
    const below = ABYSS_LAYOUTS[n + 1].spots.entry;
    map.exits.push({ x: S.downstair[0], y: S.downstair[1], to: `abyss_${n + 1}`, tx: below[0], ty: below[1], dir: 'down' });
  }
  if (S.chalk) map.inspect.push({ x: S.chalk[0], y: S.chalk[1], hint: 'Chalk', run: (s) => PG.chalk(s, n) });
  if (n === 10 || n === 20) addWarden(map, n);
  if (n === FLOORS) addFinalChamber(map);
  return map;
}

/** B10 / B20: a warden blocks the stair down; the Lantern-lift wakes once it falls. */
function addWarden(map, n) {
  const S = map.spots;
  const [ex, ey] = S.exitFront;
  const flag = `pg_boss_${n}`;
  const run = n === 10 ? PG.knight : PG.sovereign;
  const sealed = n === 10 ? (st) => !st.flags[flag] || !st.flags.gameClear : (st) => !st.flags[flag];
  map.blockers.push({ id: 'seal', x: S.downstair[0], y: S.downstair[1] + 1, prop: n === 10 ? 'crystal_gloam' : 'crystal', cond: sealed });
  map.triggers.push({ id: 'warden', x: ex - 2, y: ey - 1, w: 5, h: 3, once: false, cond: (st) => !st.flags[flag], run });
  if (n === 10) {
    map.npcs.push({ id: 'pg_knight', name: 'Unremembered Knight', look: 'pg_knight', x: ex, y: ey, dir: 'down', cond: (st) => !st.flags[flag], run });
    map.inspect.push({ x: S.downstair[0], y: S.downstair[1] + 1, hint: 'Examine', cond: (st) => st.flags[flag] && !st.flags.gameClear, run: (s) => PG.deepSeal(s) });
  }
  map.inspect.push({ x: S.lift[0], y: S.lift[1], hint: 'Lantern-lift', cond: (st) => st.flags[flag], run: (s) => PG.liftUp(s, n) });
  map.inspect.push({ x: S.lift[0], y: S.lift[1], cond: (st) => !st.flags[flag], text: 'A lamp hangs from a chain that goes up and up into the dark. The lift will not come down while the warden of this stair still stands.' });
}

/** B30: the bridge, the chamber, and afterwards a lift home. */
function addFinalChamber(map) {
  const S = map.spots;
  map.mood = (st) => (st.flags.pg_first_dark ? 'dusk' : 'gloam');
  map.music = (st) => (st.flags.pg_first_dark ? 'afterlight' : 'gloam');
  map.particles = (st) => (st.flags.pg_first_dark ? 'motes_gold' : 'gloam');
  map.triggers.push({ id: 'first_dark', x: 12, y: 12, w: 13, h: 4, once: false, cond: (st) => !st.flags.pg_first_dark, run: PG.firstDark });
  map.blockers.push({ id: 'lift', x: S.lift[0], y: S.lift[1], prop: 'lamp', cond: (st) => st.flags.pg_first_dark });
  map.inspect.push({ x: S.lift[0], y: S.lift[1], hint: 'Lantern-lift', cond: (st) => st.flags.pg_first_dark, run: (s) => PG.liftUp(s, FLOORS) });
  map.inspect.push({ x: S.center[0], y: S.center[1] + 2, hint: 'Examine', cond: (st) => st.flags.pg_first_dark, text: 'A small patch of dusk, curled up on the marble. It is breathing, slowly. It is asleep.' });
}

export const ABYSS_MAPS = Array.from({ length: FLOORS }, (_, i) => floorMap(i + 1));
