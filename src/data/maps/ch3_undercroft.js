// The Undercroft beneath Aurenne (Chapter 3): sewers, ossuary, Mercy's laboratory.
import SEWERS from './layouts/c3_uc_sewers.js';
import OSSUARY from './layouts/c3_uc_ossuary.js';
import LAB from './layouts/c3_uc_lab.js';
import { CH3 } from '../../story/ch3.js';
import { SIDE } from '../../story/ch3_side.js';

// Low "lip" walls: walls just south of a walkway, lowered so they never hide the party.
const LOW_WALLS = {
  6: { wall: true, top: 'stone', side: 'wall_stone', raise: 0 },
  7: { wall: true, top: 'gloam', side: 'wall_gloam', raise: 0 },
  8: { wall: true, top: 'ruin', side: 'wall_ruin', raise: 0 },
  9: { wall: true, top: 'stone', side: 'wall_brick', raise: 0 },
};
const dungeon = { legend: LOW_WALLS, camera: { dist: 19, pitch: 0.78 }, region: 'Beneath Aurenne' };
const page = (flag, lines) => ({ cond: (st) => !st.flags[flag], hint: 'Search', run: (s) => SIDE.page(s, flag, lines) });
const freed = (st) => !!st.flags.c3_mercy_down;
const pipIn = (s) => s.state.party.includes('pip');

// ================================================================ B1 — the sewers
/** @type {import('../../types/data').MapDef} */
export const c3Sewers = {
  ...SEWERS, ...dungeon,
  id: 'c3_uc_sewers', name: 'The Undercroft: Sewers', mood: 'cave', music: 'cave', battleBg: 'undercroft', particles: 'dust',
  scatter: { types: ['debris', 'bones'], density: 0.03, seed: 80 },
  encounters: { rate: 1, troops: [['uc_rats', 2], ['c3_drain', 3], ['c3_moths', 2], ['uc_ooze', 1], ['c3_leeches', 2], ['c3_sewer_mix', 2]] },
  blockers: [
    { id: 'c3_sluice_n', x: 31, y: 11, h: 3, prop: 'fence' },
    { id: 'c3_sluice_s', x: 31, y: 16, h: 2, prop: 'fence' },
    { id: 'c3_crack', x: 27, y: 10, prop: 'rock' },
  ],
  chests: [
    { id: 'c3_sw_a', x: 9, y: 4, item: 'hi_tonic', count: 2 },
    { id: 'c3_sw_cache', x: 29, y: 7, item: 'steel_longsword' },
    { id: 'c3_sw_b', x: 14, y: 26, item: 'choir_vestment' },
    { id: 'c3_sw_east', x: 41, y: 5, item: 'focus_pendant' },
    { id: 'c3_sw_south', x: 39, y: 17, gold: 450 },
  ],
  inspect: [
    { x: 19, y: 2, hint: 'Valve', run: (s) => CH3.valve(s, 'a') },
    { x: 25, y: 23, hint: 'Valve', run: (s) => CH3.valve(s, 'b') },
    ...[11, 12, 13, 16, 17].map((y) => ({ x: 31, y, cond: (st) => !st.flags.c3_sluice, run: (s) => CH3.sluiceGate(s) })),
    { x: 27, y: 10, hint: 'Examine', cond: (st) => !st.flags['blocker:c3_uc_sewers:c3_crack'], run: async (s) => {
      await s.narrate('The brickwork here bulges outward, cracked and sweating. There is a hollow sound behind it.');
      if (!s.state.party.includes('bram')) return;
      await s.say('Ilse', 'Bram. Would you?');
      await s.say('Bram', 'With _pleasure._');
      s.shake(0.2, 0.5);
      s.clearBlocker('c3_crack');
      await s.say('Bram', 'I have been wanting to hit something that didn\'t hit back for _days._');
    } },
    { x: 3, y: 10, run: async (s) => {
      await s.narrate('Scratched into the brick in chalk, at about the height of an eleven-year-old: PIP WAS ERE.');
      if (pipIn(s)) await s.say('Pip', '...That\'s from last year. I was _exploring._');
    } },
    { x: 16, y: 12, run: async (s) => {
      await s.narrate('A child\'s shoe, much too small for anyone who should be down here. The laces are still tied — in a double knot.');
      if (pipIn(s)) await s.say('Pip', 'That\'s Wick\'s. He does double knots because he can\'t do bows. I keep telling him. I keep _telling_ him.');
    } },
    { x: 36, y: 5, text: 'A gray hooded lantern, dropped and cracked. The Sisters of Small Mercies carry ones just like it.' },
    { x: 16, y: 24, run: async (s) => {
      await s.narrate('A sheet of music, soaked through. The notes run from right to left.');
      if (s.state.party.includes('sable')) {
        await s.narrate('Sable reads it, and hums. The hum makes your back teeth ache.');
        await s.say('Sable', 'It is the Dawnsong. Backwards.');
      }
    } },
  ],
  exits: [
    { x: 0, y: 11, h: 3, to: 'aurenne', tx: 46, ty: 29, dir: 'left' },
    { x: 43, y: 11, h: 7, to: 'c3_uc_ossuary', tx: 1, ty: 16, dir: 'right' },
  ],
  onEnter: (s) => CH3.sewersEnter(s),
};

// ================================================================ B2 — the ossuary
/** @type {import('../../types/data').MapDef} */
export const c3Ossuary = {
  ...OSSUARY, ...dungeon,
  id: 'c3_uc_ossuary', name: 'The Undercroft: Ossuary', mood: 'cave', music: 'cave', battleBg: 'undercroft', particles: 'dust',
  encounters: { rate: 1, troops: [['uc_bones', 2], ['c3_hounds', 2], ['c3_archers', 2], ['c3_votives', 2], ['uc_wraith', 1], ['c3_ossuary_mix', 2]] },
  blockers: [{ id: 'c3_vault_door', x: 4, y: 27, h: 2, prop: 'statue' }],
  chests: [
    { id: 'c3_os_hub', x: 19, y: 21, item: 'ember_feather', count: 2 },
    { id: 'c3_os_hall', x: 25, y: 7, item: 'choir_mitre' },
    { id: 'c3_os_vault1', x: 2, y: 26, item: 'c3_aurel_bell' },
    { id: 'c3_os_vault2', x: 1, y: 29, item: 'magic_fruit' },
    { id: 'c3_os_foundry', x: 40, y: 10, item: 'steel_plate' },
    { id: 'c3_os_landing', x: 44, y: 31, item: 'hi_ether' },
  ],
  inspect: [
    { x: 16, y: 2, hint: 'Memorial', run: (s) => CH3.lysaNiche(s) },
    { x: 8, y: 4, text: 'The names are worn almost smooth. Under every one, the same date: THE LONG NIGHT.' },
    { x: 20, y: 6, text: 'A family tomb: a mother, a father, and four small names in a row. Someone has left a wooden toy horse on it. It is very old.' },
    { x: 24, y: 4, ...page('c3_page_c', [
      'Tucked under a guttered candle on the last tomb: a loose, water-stained page.',
      '"...the Keeper, Aldric Lorne, was in the lamp-room when the light failed. He might have gone down to the square, where his daughter {dim|████} was. He chose the Lantern. The city lived."',
    ]) },
    { x: 35, y: 11, text: 'The great bell of the old foundry, cracked from crown to lip. Whatever was ringing it wanted very badly to be heard.' },
    { x: 8, y: 26, hint: 'Ring', run: (s) => SIDE.ringVaultBell(s, 'high') },
    { x: 13, y: 26, hint: 'Ring', run: (s) => SIDE.ringVaultBell(s, 'low') },
    { x: 18, y: 26, hint: 'Ring', run: (s) => SIDE.ringVaultBell(s, 'mid') },
    { x: 4, y: 27, cond: (st) => !st.flags.c3_vault_open, run: (s) => SIDE.vaultDoor(s) },
    { x: 4, y: 28, cond: (st) => !st.flags.c3_vault_open, run: (s) => SIDE.vaultDoor(s) },
  ],
  exits: [
    { x: 0, y: 15, h: 3, to: 'c3_uc_sewers', tx: 42, ty: 13, dir: 'left' },
    { x: 45, y: 28, h: 4, to: 'c3_uc_lab', tx: 1, ty: 5, dir: 'right' },
  ],
  triggers: [
    { id: 'wight', x: 28, y: 13, w: 2, h: 7, once: false, cond: (st) => !st.flags.c3_wight_down, run: (s) => CH3.wight(s) },
  ],
  onEnter: (s) => CH3.ossuaryEnter(s),
};

// ================================================================ B3 — Mercy's laboratory
const cell = (x0, run) => [0, 1, 2, 3].map((i) => ({ x: x0 + i, y: 4, hint: 'Bars', ...run }));
/** @type {import('../../types/data').MapDef} */
export const c3Lab = {
  ...LAB, ...dungeon,
  id: 'c3_uc_lab', name: 'The Undercroft: Laboratory', mood: 'gloam', music: (st) => (freed(st) ? 'sad' : 'gloam'), battleBg: 'gloam',
  encounters: { rate: 0.9, cond: (st) => !st.flags.c3_mercy_down,
    troops: [['uc_cult', 2], ['c3_cantors', 3], ['c3_vessels', 2], ['c3_lab_mix', 2], ['c3_hulk', 1]] },
  npcs: [
    { id: 'mercy', name: 'Sister Mercy', look: 'mercy', x: 24, y: 25, dir: 'down', noTurn: true, cond: (st) => !freed(st) },
    { id: 'cap_rowan', name: 'Rowan', look: 'rowan', x: 11, y: 3, dir: 'down', cond: (st) => !freed(st) },
    { id: 'cap_b', name: 'Captive', look: 'villager_29', x: 16, y: 3, dir: 'down', cond: (st) => !freed(st) },
    { id: 'cap_c', name: 'Captive', look: 'villager_37', x: 21, y: 2, dir: 'right', cond: (st) => !freed(st) },
    { id: 'cap_nell', name: 'Nell', look: 'nell', x: 33, y: 3, dir: 'down', cond: (st) => !freed(st) },
    { id: 'cap_tuck', name: 'Tuck', look: 'tuck', x: 35, y: 3, dir: 'down', cond: (st) => !freed(st) },
    { id: 'cap_wick', name: 'Wick', look: 'wick', x: 34, y: 2, dir: 'down', cond: (st) => !freed(st) },
  ],
  chests: [
    { id: 'c3_lab_ops', x: 5, y: 18, item: 'holy_water', count: 3 },
    { id: 'c3_lab_store1', x: 37, y: 13, item: 'ember_rod' },
    { id: 'c3_lab_store2', x: 36, y: 19, item: 'brigandine' },
    { id: 'c3_lab_walk', x: 37, y: 7, item: 'vigor_bangle' },
  ],
  inspect: [
    ...cell(10, { run: (s) => SIDE.rowanCell(s) }),
    ...cell(15, { text: 'A woman curled on a cot, humming. When you say hello, she says it back — in exactly your voice.' }),
    ...cell(20, { text: 'An old man counting on his fingers. He gets to nine and starts again. He has been doing it, he says, for a very long time. Or possibly since this morning.' }),
    ...cell(25, { text: 'This cell is empty, except for a pair of boots standing neatly side by side. The boots are still warm.' }),
    ...[31, 32, 33, 34, 35, 36, 37].map((x) => ({ x, y: 4, hint: 'Bars', run: (s) => SIDE.childrenPen(s) })),
    { x: 22, y: 13, run: async (s) => {
      await s.narrate([
        'Mercy\'s notes, in a neat round hand:',
        '_Subject 31: no resistance. Children rarely resist — their memories are short and sweet. The body accepts the Gloam if it is given a memory to hold. Without one, the Gloam makes only beasts._',
        '_Day 40. Another beast. What did HE do differently? What did he give her to hold?_',
      ]);
      await s.say('Ilse', '"He." Who\'s "he"?');
      if (pipIn(s)) await s.say('Pip', 'Her boss, maybe. Everyone\'s got a boss.');
      await s.narrate('Sable says nothing at all.');
    } },
    { x: 13, y: 13, text: 'A cot with leather straps. The straps are child-sized.' },
    { x: 6, y: 13, ...page('c3_page_d', [
      'Pressed inside one of Mercy\'s ledgers, a page from an old chronicle, annotated in red ink.',
      '"His son, {dim|███████}, aged twelve, was found at dawn upon the gallery stair, holding nothing. He did not speak for a year."',
      'In the margin, in fresh red ink: _Not lost. Only waiting._',
    ]) },
    { x: 24, y: 24, text: 'The crucible. At the bottom, a residue like burnt sugar, and a smell like a summer afternoon.' },
  ],
  exits: [{ x: 0, y: 4, h: 3, to: 'c3_uc_ossuary', tx: 44, ty: 29, dir: 'left' }],
  triggers: [
    { id: 'mercy', x: 18, y: 23, w: 11, h: 1, once: false, cond: (st) => !freed(st), run: (s) => CH3.mercyBoss(s) },
  ],
  onEnter: (s) => CH3.labEnter(s),
};
