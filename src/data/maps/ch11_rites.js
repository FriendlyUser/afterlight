// Chapter 11 — Character Rite maps and the Starseer's Orrery.
import REEF from './layouts/c11_reef.js';
import INF from './layouts/c11_infirmary.js';
import VIG from './layouts/c11_vigil.js';
import SCRAP from './layouts/c11_scrapfall.js';
import STORM from './layouts/c11_stormwall.js';
import RIFT from './layouts/c11_rift.js';
import ORR from './layouts/c11_orrery.js';
import { gangplank } from '../../story/ch11.js';
import { RITES } from '../../story/ch11_rites.js';
import { takeStar } from '../../story/ch11_remnants.js';

const at = (L, name) => ({ x: L.spots[name][0], y: L.spots[name][1] });
const chest = (L, prefix, spot, loot) => ({ id: `${prefix}_${spot}`, ...at(L, spot), ...loot });
const sky = { backdrop: { plane: '#3a2440', y: -12 } };
const notDone = (who) => (st) => !st.flags[`c11_rite_${who}_done`];

// ====================================================================== Wren — the Drowned Reef
const reef = {
  ...REEF, ...sky,
  id: 'c11_reef', name: 'The Drowned Reef', region: 'The Old Western Sea',
  mood: 'night', music: 'sea', battleBg: 'beach_night', particles: 'gloam',
  encounters: { rate: 1, troops: [['c11_rf_crabs', 3], ['c11_rf_jelly', 2], ['c11_rf_mix', 3]] },
  chests: [
    chest(REEF, 'c11_rf', 'c_west', { item: 'x_tonic', count: 2 }),
    chest(REEF, 'c11_rf', 'c_east', { item: 'vigor_seed', count: 2 }),
    chest(REEF, 'c11_rf', 'c_north', { item: 'megalixir' }),
    chest(REEF, 'c11_rf', 'c_pool', { item: 'crest_tome' }),
  ],
  blockers: [{ id: 'star', ...at(REEF, 'star'), prop: 'crystal' }],
  inspect: [
    { x: 15, y: 6, hint: 'Wreck', run: (s) => RITES.reefBoat(s) },
    { x: 21, y: 6, text: 'A Choir supply barge, sunk with its cargo: thousands of candles, still in their wrappers. Every one unlit.' },
    { x: 6, y: 20, text: 'An old Aurenne galleon, two hundred years down. The figurehead is a woman holding a lantern. Someone, long ago, gave her a face like a mother\'s.' },
    { x: 29, y: 19, text: 'A smuggler\'s sloop. In the hold, crates stamped PROPERTY OF C. ASHE — DO NOT OPEN. Corvin pretends not to see them.' },
    { ...at(REEF, 'star'), hint: 'Starlight', cond: (st) => !st.flags.c11_star_reef, run: (s) => takeStar(s, 'reef') },
  ],
  exits: [gangplank(17, 37)],
  triggers: [{ id: 'rf_arrive', x: 12, y: 28, w: 13, h: 4, run: (s) => RITES.reefArrive(s) }],
};

// ====================================================================== Ilse — the Drowned Infirmary
const infirmary = {
  ...INF,
  id: 'c11_infirmary', name: 'The Drowned Infirmary', region: 'Mirefen',
  mood: 'interior', music: 'swamp', camera: { dist: 15, pitch: 0.75 }, particles: 'dust', battleBg: 'undercroft',
  encounters: { rate: 0.6, cond: notDone('ilse'), troops: [['c11_inf_fever', 2], ['c11_inf_shrouds', 1]] },
  chests: [
    chest(INF, 'c11_inf', 'c_ward', { item: 'tonic_mist', count: 3 }),
    chest(INF, 'c11_inf', 'c_store', { item: 'panacea', count: 5 }),
  ],
  inspect: [
    { x: 9, y: 3, hint: 'Staff', cond: notDone('ilse'), run: (s) => RITES.infirmaryStaff(s) },
    { x: 8, y: 2, hint: 'Ledger', run: (s) => RITES.infirmaryLedger(s) },
    { x: 2, y: 3, text: 'A cot, made with hospital corners. A child\'s drawing is tucked under the pillow: a big woman in a hood, and the words MOTHER OSK MAKES IT STOP HURTING.' },
    { x: 16, y: 6, text: 'A cot, made with hospital corners. On the blanket, a single dried flower, placed very carefully.' },
  ],
  exits: [{ x: 8, y: 13, w: 3, to: 'c11_mirefen', tx: 34, ty: 26, dir: 'down' }],
  onEnter: (s) => RITES.infirmaryEnter(s),
};

// ====================================================================== Bram — the Vigil Hall
const vigil = {
  ...VIG, ...sky,
  id: 'c11_vigil', name: 'The Vigil Hall', region: 'The Greyspine',
  mood: 'snow', music: 'snow', battleBg: 'temple', treeType: 'pine_snow',
  encounters: { rate: 0.7, cond: notDone('bram'), onTiles: '*', troops: [['c11_vg_snow', 1]] },
  chests: [
    chest(VIG, 'c11_vg', 'c_hall_w', { item: 'x_tonic', count: 2 }),
    chest(VIG, 'c11_vg', 'c_hall_e', { item: 'power_fruit' }),
    chest(VIG, 'c11_vg', 'c_snow', { item: 'mega_tonic', count: 3 }),
  ],
  inspect: [
    { ...at(VIG, 'vigil_stone'), hint: 'Vigil stone', run: (s) => RITES.vigilStone(s) },
    { x: 12, y: 3, text: 'A cairn of grey stones. On the largest, chiselled by someone who was not a mason: SIR ALDOUS VENN. HE STOOD BETWEEN.' },
    { x: 6, y: 6, text: 'A stone knight, sword point-down, head bowed. The plinth reads: DAME ORSOLA OF THE WESTMARCH. SHE WAS AFRAID OF HORSES.' },
    { x: 19, y: 9, text: 'A stone knight with a cracked shield. The plinth reads: SIR TEODOR BRAND. HE WEPT AT EVERY KNIGHTING, INCLUDING HIS OWN.' },
    { x: 6, y: 12, text: 'A stone knight, very young, very serious. The plinth reads: SIR ALDOUS VENN, AGE NINETEEN. Somebody has scratched underneath, much later: STILL AN IDIOT. — G.T.' },
  ],
  exits: [gangplank(12, 33)],
  triggers: [{ id: 'vg_arrive', x: 7, y: 26, w: 12, h: 4, run: (s) => RITES.vigilArrive(s) }],
};

// ====================================================================== Pip — Scrapfall
const scrapfall = {
  ...SCRAP, ...sky,
  id: 'c11_scrapfall', name: 'Scrapfall', region: 'Below Kiteholm',
  mood: 'ruin', music: 'ruin', battleBg: 'ruin', particles: 'ash',
  encounters: { rate: 1, troops: [['c11_sf_golems', 2], ['c11_sf_rooks', 3], ['c11_sf_mimic', 1]] },
  npcs: [{ id: 'tilly', name: 'Tilly', look: 'c11_tilly', ...at(SCRAP, 'tilly'), dir: 'down', cond: (st) => !st.flags.c11_scrap_found }],
  chests: [
    chest(SCRAP, 'c11_sf', 'c_west', { item: 'mega_tonic', count: 3 }),
    chest(SCRAP, 'c11_sf', 'c_east', { item: 'swift_fruit' }),
    chest(SCRAP, 'c11_sf', 'c_dump', { gold: 5000 }),
    chest(SCRAP, 'c11_sf', 'c_top', { item: 'crest_tome' }),
  ],
  inspect: [
    { x: 26, y: 15, text: 'The Rook Queen\'s nest: a ring of buttons, spoons, bottle caps, a brass doorknob, three wedding rings and, right in the middle, a child-sized empty space shaped like a knife.' },
    { x: 13, y: 4, text: 'A kite with a lopsided sun painted on it, tangled in the junk. A name on the spar in crayon: TILLY. PROPERTY OF. KEEP OFF.' },
  ],
  exits: [gangplank(16, 33)],
  triggers: [
    { id: 'sf_arrive', x: 10, y: 25, w: 15, h: 4, run: (s) => RITES.scrapArrive(s) },
    { id: 'sf_tilly', x: 12, y: 8, w: 11, h: 2, once: false, cond: (st) => !st.flags.c11_scrap_found, run: (s) => RITES.scrapTilly(s) },
  ],
};

// ====================================================================== Corvin — the Kingfisher in the Stormwall
const stormwall = {
  ...STORM, ...sky,
  id: 'c11_stormwall', name: 'The Eye of the Stormwall', region: 'Stormcrown',
  mood: 'storm', music: 'sad', battleBg: 'deck', battleMood: 'storm', particles: 'rain',
  camera: { dist: 18, pitch: 0.7 },
  inspect: [
    { x: 5, y: 10, hint: 'Hal\'s cabin', run: (s) => RITES.wreckCabin(s) },
    { x: 9, y: 11, text: 'The Kingfisher\'s mainmast, snapped. Her colours still fly from the stump: Dawnguard blue, with a kingfisher stitched over the sunburst by someone who could not sew.' },
    { x: 25, y: 13, text: 'A bow gun, still loaded. The gunner\'s gloves are on the breech, laid down neatly side by side, as if he meant to come back for them.' },
  ],
  exits: [{ x: 14, y: 27, w: 2, to: 'halcyon_deck', tx: 12, ty: 8, dir: 'down' }],
  triggers: [{ id: 'sw_gunners', x: 17, y: 9, w: 9, h: 9, once: false, cond: (st) => !st.flags.c11_sw_gunners, run: (s) => RITES.wreckGunners(s) }],
  onEnter: (s) => RITES.wreckArrive(s),
};

// ====================================================================== Sable — the Gloam Rift
const ECHOES = [[8, 20], [8, 13], [21, 14], [22, 20]];
const rift = {
  ...RIFT,
  id: 'c11_rift', name: 'The Gloam Rift', region: 'Under Thornwood',
  mood: 'gloam', music: 'gloam', battleBg: 'gloam',
  encounters: { rate: 1, cond: notDone('sable'), troops: [['c11_rift_forgotten', 2], ['c11_rift_shades', 2]] },
  chests: [
    chest(RIFT, 'c11_rift', 'c_west', { item: 'x_ether', count: 2 }),
    chest(RIFT, 'c11_rift', 'c_east', { item: 'gloam_shard', count: 3 }),
    chest(RIFT, 'c11_rift', 'c_deep', { item: 'dawn_plume' }),
  ],
  inspect: [
    { x: 11, y: 3, text: 'A small bed with a patchwork quilt. Every patch is a different shade of yellow.' },
    { x: 18, y: 3, text: 'A shelf of wooden animals: a gull, a cat, a lopsided horse. Carved by a twelve-year-old, badly, with enormous care.' },
  ],
  exits: [{ x: 13, y: 29, w: 3, to: 'c11_thornwood', tx: 6, ty: 11, dir: 'down' }],
  triggers: [
    ...ECHOES.map(([x, y], i) => ({ id: `rift_echo${i}`, x: x - 1, y: y - 1, w: 3, h: 3, run: (s) => RITES.riftEcho(s, i) })),
    { id: 'rift_lysa', x: 11, y: 6, w: 9, h: 2, once: false, cond: notDone('sable'), run: (s) => RITES.riftLysa(s) },
  ],
  onEnter: (s) => RITES.riftEnter(s),
};

// ====================================================================== the Orrery (Starseer)
const orrery = {
  ...ORR, ...sky,
  id: 'c11_orrery', name: 'The Orrery', region: 'Adrift',
  mood: 'night', music: 'title', battleBg: 'sky', particles: 'motes_gold',
  npcs: [{ id: 'ottoline', name: 'Ottoline', look: 'c11_ottoline', ...at(ORR, 'ottoline'), dir: 'down', run: (s) => RITES.ottoline(s) }],
  inspect: [
    { x: 13, y: 7, hint: 'Telescope', run: (s) => RITES.telescope(s) },
    { x: 6, y: 10, text: 'A star chart, inked on sailcloth. Half the stars are crossed out. Beside the gaps, in tiny writing: "fell?" "fell." "FELL. Bother."' },
    { x: 19, y: 10, text: 'A copy of The Sunward Atlas, annotated in red ink by its own author. The margins are fuller than the pages.' },
    { x: 5, y: 5, text: 'A shelf of books about the sun. Every one ends with the same chapter title: "And Then It Rose Again."' },
  ],
  exits: [gangplank(12, 25)],
};

export const RITE_MAPS = [reef, infirmary, vigil, scrapfall, stormwall, rift, orrery];
