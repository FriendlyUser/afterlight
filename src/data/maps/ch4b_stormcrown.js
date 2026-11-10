// Chapter 4b — the Stormcrown: Stormfoot, the Halcyon's flight, Skyreach, Vasha's Lantern
// and the Undercradle. Story beats live in src/story/ch4b_sky.js.
import FOOT from './layouts/c4b_stormfoot.js';
import DECK from './layouts/c4b_halcyon_deck.js';
import SKY from './layouts/c4b_skyreach.js';
import HALL from './layouts/c4b_sky_lantern.js';
import UNDER from './layouts/c4b_undercradle.js';
import { C4S } from '../../story/ch4b_sky.js';

const at = (L, k) => ({ x: L.spots[k][0], y: L.spots[k][1] });
const f = (name) => (st) => !!st.flags[name];
const nf = (name) => (st) => !st.flags[name];
const STORM_BELOW = { plane: '#2a3048', y: -12 };

// =====================================================================
// Stormfoot
// =====================================================================
/** @type {import('../../types/data').MapDef} */
const stormfoot = {
  ...FOOT,
  id: 'c4b_stormfoot', name: 'Stormfoot', region: 'The Stormcrown',
  mood: 'storm', music: 'tension', battleBg: 'road', treeType: 'tree_dead',
  encounters: {
    rate: 1, bg: 'road', onTiles: 'qd_',
    troops: [['c4b_sf_harpies', 3], ['c4b_sf_golem', 2], ['c4b_sf_cells', 2], ['c4b_sf_eels', 2]],
  },
  npcs: [
    { id: 'corvin_f', name: 'Corvin', look: 'corvin', ...at(FOOT, 'corvin'), dir: 'down', cond: (st) => st.flags.c4b_foot_arrived && !st.flags.c4b_launched, run: (s) => C4S.corvinFoot(s) },
    { id: 'joss', name: 'Joss', look: 'c4b_joss', ...at(FOOT, 'joss'), dir: 'down', run: (s) => C4S.joss(s) },
  ],
  chests: [
    { id: 'west', ...at(FOOT, 'c_west'), item: 'starsteel_repeater' },
    { id: 'east', ...at(FOOT, 'c_east'), item: 'hi_ether', count: 2 },
    { id: 'crag', ...at(FOOT, 'c_crag'), item: 'swift_fruit' },
    { id: 'camp', ...at(FOOT, 'c_camp'), item: 'starsteel_plate' },
  ],
  inspect: [
    { ...at(FOOT, 'core1'), hint: 'Storm-seam', run: (s) => C4S.core(s, 1) },
    { ...at(FOOT, 'core2'), hint: 'Storm-seam', run: (s) => C4S.core(s, 2) },
    { ...at(FOOT, 'core3'), hint: 'Storm-seam', run: (s) => C4S.core(s, 3) },
    { x: 13, y: 12, text: 'A mooring post as thick as a man, scorched black on the side that faces the mountain. Lightning loves this place.' },
    { x: 19, y: 8, text: 'The Halcyon\'s mainmast. A tally of little lightning bolts is carved into it. Forty-one. The last one is very fresh, and very deep.', cond: f('c4b_foot_arrived') },
  ],
  exits: [{ x: 0, y: 28, h: 3, to: '@world' }],
  onEnter: (s) => C4S.footArrive(s),
};

// =====================================================================
// The Halcyon, aloft
// =====================================================================
const homeward = f('c4b_homeward');
/** @type {import('../../types/data').MapDef} */
const deck = {
  ...DECK, backdrop: { plane: '#3a4060', y: -10 },
  id: 'c4b_halcyon_deck', name: 'The Halcyon', region: 'Above the Stormcrown',
  mood: (st) => (st.flags.c4b_homeward ? 'dusk' : 'storm'),
  music: (st) => (st.flags.c4b_homeward ? 'sea' : 'tension'),
  battleBg: 'sky', camera: { dist: 16, pitch: 0.7 }, noMenu: true,
  particles: (st) => (st.flags.c4b_homeward ? 'embers_soft' : 'rain'),
  onEnter: (s) => (homeward(s.state) ? C4S.homeward(s) : C4S.flight(s)),
};

// =====================================================================
// Skyreach
// =====================================================================
/** @type {import('../../types/data').MapDef} */
const skyreach = {
  ...SKY, backdrop: STORM_BELOW,
  id: 'c4b_skyreach', name: 'Skyreach', region: 'Above the Stormcrown',
  mood: 'day', music: (st) => (st.flags.c4b_vasha_met && !st.flags.c4b_thunderhead_beaten ? 'tension' : 'town'),
  battleBg: 'sky', particles: 'pollen', camera: { dist: 21, pitch: 0.66 },
  npcs: [
    { id: 'ilka', name: 'Ilka', look: 'c4b_ilka', ...at(SKY, 'ilka'), dir: 'left', run: (s) => C4S.ilka(s) },
    { id: 'kesi', name: 'Kesi', look: 'c4b_kesi', ...at(SKY, 'chime_girl'), dir: 'down', run: (s) => C4S.kesi(s) },
    { id: 'kites', name: 'Kite-flier', look: 'villager_13', ...at(SKY, 'kite_kids'), dir: 'up', wander: 1, run: (s) => C4S.kites(s) },
    { id: 'oona', name: 'Oona', look: 'c4b_skyfolk', ...at(SKY, 'innkeep'), dir: 'down', hint: 'Rest',
      run: async (s) => { await s.say('Oona', 'The Gull\'s Nest — highest beds in Solmere! Eighty gold. The view\'s free. The vertigo\'s also free.'); await s.inn(80, 'the Gull\'s Nest'); } },
    { id: 'quill', name: 'Quill', look: 'c4b_skyfolk2', ...at(SKY, 'merchant'), dir: 'left', hint: 'Shop',
      run: async (s) => { await s.say('Quill', 'Windward Exchange! Everything up here came up on a ship, so everything up here costs a ship\'s worth. Have a browse.'); await s.shop('c4b_skyreach'); } },
    { id: 'brannagh', name: 'Old Brannagh', look: 'villager_57', ...at(SKY, 'elder'), dir: 'right',
      talk: (s) => s.say('Old Brannagh', s.flag('c4b_thunderhead_beaten')
        ? ['The isle\'s risen a full fathom since this morning. I could feel it in my knees.', 'Skyreach floats on light, they say. Seems it can float on stubbornness too, in a pinch.']
        : ['Skyreach floats on the Lantern\'s light, child. Has done for three hundred years.', 'And the light holds the Thunderhead down beneath us. Two jobs, one Lantern. That\'s the old story.', 'The Ardent says it\'s just a story. The Ardent gave our stone away. I\'m old. I notice things.']) },
    { id: 'cael', name: 'Windspeaker Cael', look: 'acolyte', ...at(SKY, 'priest'), dir: 'down',
      talk: (s) => s.say('Windspeaker Cael', s.flag('c4b_thunderhead_beaten')
        ? ['You went down beneath the isle for us. Even though you think the Hierophant is wrong.', 'I don\'t know what to do with that. I have been praying about it. The wind has not answered.']
        : ['When the Vespersong is sung, no one will ever be lost to the storm again. No more empty chairs at supper.', 'Don\'t you want that? Doesn\'t everyone want that?']) },
    { id: 'sorrel', name: 'Wing-pilot Sorrel', look: 'c4b_skyfolk', ...at(SKY, 'pilot'), dir: 'up',
      talk: (s) => s.say('Wing-pilot Sorrel', s.flag('c4b_six_of_seven')
        ? ['Ilka\'s put Skyreach-cut lift-crystals in that old tub. She\'ll climb like a lark now.', 'Your captain flew her up through the Stormcrown on _desert glass_. Nobody up here will ever buy him a drink again — they\'ll be too busy telling the story.']
        : ['I saw you come up through the storm. Thought you were a falling barn.', 'Then I thought: no, a barn would fly better.']) },
    { id: 'dockhand', name: 'Dockhand', look: 'villager_29', ...at(SKY, 'dockhand'), dir: 'up',
      talk: ['The Lord-Commander came on a black warship, three weeks back. The Ardent handed him our stone on the steps of the Lantern, and everybody cheered.', 'I cheered. Loudest of anyone.', '...I don\'t know why I cheered.'] },
    { id: 'tamm', name: 'Keel-warden Tamm', look: 'villager_32', ...at(SKY, 'lift'), dir: 'left', run: (s) => C4S.tamm(s) },
    { id: 'corvin_d', name: 'Corvin', look: 'corvin', ...at(SKY, 'corvin_dock'), dir: 'down', cond: f('c4b_six_of_seven'), hint: 'Depart', run: (s) => C4S.depart(s) },
  ],
  chests: [
    { id: 'garden', x: 7, y: 22, item: 'starweave_coat' },
    { id: 'mill', x: 43, y: 13, item: 'starsteel_aegis' },
    { id: 'yard', x: 16, y: 31, item: 'bolt_bomb', count: 3 },
  ],
  inspect: [
    { x: 23, y: 17, text: 'A fountain fed by rain-catchers. Coins glint at the bottom: offerings to the wind, for safe flights. There are a great many coins.' },
    { x: 8, y: 28, text: 'The Halcyon, nose-down in what used to be Ilka\'s shed. One mast is broken. The other is somehow holding a chicken.', cond: nf('c4b_six_of_seven') },
    { x: 8, y: 28, text: 'Ilka\'s yard. Where the Halcyon crashed, there is a neat pile of salvaged timber labeled, in large letters, CORVIN\'S. YOU\'RE PAYING FOR THIS.', cond: f('c4b_six_of_seven') },
  ],
  exits: [
    { x: 49, y: 17, h: 5, to: 'c4b_undercradle', tx: 25, ty: 4, dir: 'down', cond: f('c4b_vasha_met'),
      blocked: async (s) => { await s.say('Keel-warden Tamm', 'The Keel Lift\'s for the Keel-crew only. Ardent\'s orders.'); await s.step('player', -1, 0); } },
  ],
  onEnter: (s) => C4S.skyArrive(s),
};

/** @type {import('../../types/data').MapDef} */
const hall = {
  ...HALL, mood: 'temple', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'temple',
  id: 'c4b_sky_lantern', name: 'The Skyreach Lantern', music: (st) => (st.flags.c4b_vasha_met ? 'cassian' : 'tension'),
  npcs: [
    { id: 'vasha', name: 'Ardent Vasha', look: 'vasha', ...at(HALL, 'vasha'), dir: 'down', cond: f('c4b_vasha_met'), run: (s) => C4S.vasha(s) },
  ],
  inspect: [
    { ...at(HALL, 'cradle'), hint: 'The cradle', run: async (s) => s.narrate(['In the brass cradle where Skyreach\'s Dawnstone should sit, a single silver tuning fork stands upright, humming to itself.', 'You know that note. You have been carrying it in your pack for weeks.']) },
  ],
  exits: [{ x: 6, y: 11, w: 3, to: 'c4b_skyreach', tx: 25, ty: 7, dir: 'down' }],
  onEnter: (s) => C4S.hallEnter(s),
};

// =====================================================================
// The Undercradle
// =====================================================================
const U = UNDER.spots;
/** @type {import('../../types/data').MapDef} */
const undercradle = {
  ...UNDER, backdrop: STORM_BELOW,
  id: 'c4b_undercradle', name: 'The Undercradle', region: 'Beneath Skyreach',
  scatter: { types: ['mushroom_glow', 'rock_small'], density: 0.05, seed: 22 },
  mood: 'storm', music: 'cave', battleBg: 'sky', particles: 'rain', camera: { dist: 19, pitch: 0.7 },
  encounters: {
    rate: 1.1, bg: 'sky', onTiles: 'c=',
    troops: [['c4b_uc_drake', 3], ['c4b_uc_sentinels', 2], ['c4b_uc_mix', 3], ['c4b_uc_golems', 2], ['c4b_sf_harpies', 1]],
  },
  chests: [
    { id: 'w', x: U.c_w[0], y: U.c_w[1], item: 'starsteel_helm' },
    { id: 'e', x: U.c_e[0], y: U.c_e[1], item: 'mega_tonic', count: 2 },
    { id: 's', x: U.c_s[0], y: U.c_s[1], item: 'starstring_lute' },
    { id: 'hub', x: U.c_hub[0], y: U.c_hub[1], item: 'hi_ether', count: 3 },
    { id: 'entry', x: U.c_entry[0], y: U.c_entry[1], item: 'frost_bomb', count: 3 },
    { id: 'save', x: U.c_save[0], y: U.c_save[1], item: 'dawn_plume' },
  ],
  blockers: [
    { id: 'gate1', x: U.gate1[0], y: U.gate1[1], w: 3, prop: 'crystal' },
    { id: 'gate2', x: U.gate2[0], y: U.gate2[1], w: 3, prop: 'crystal' },
    { id: 'gate3', x: U.gate3[0], y: U.gate3[1], w: 3, prop: 'crystal' },
  ],
  inspect: [
    { ...at(UNDER, 'pylon_w'), hint: 'Lift-pylon', run: (s) => C4S.pylon(s, 'w') },
    { ...at(UNDER, 'pylon_e'), hint: 'Lift-pylon', run: (s) => C4S.pylon(s, 'e') },
    { ...at(UNDER, 'pylon_s'), hint: 'Lift-pylon', run: (s) => C4S.pylon(s, 's') },
    { ...at(UNDER, 'glider'), hint: 'Wreckage', run: (s) => C4S.glider(s) },
    { x: U.gate1[0] + 1, y: U.gate1[1], hint: 'Storm-crystal', cond: nf('blocker:c4b_undercradle:gate1'), run: (s) => C4S.gate(s) },
    { x: U.gate2[0] + 1, y: U.gate2[1], hint: 'Storm-crystal', cond: nf('blocker:c4b_undercradle:gate2'), run: (s) => C4S.gate(s) },
    { x: U.gate3[0] + 1, y: U.gate3[1], hint: 'Storm-crystal', cond: nf('blocker:c4b_undercradle:gate3'), run: (s) => C4S.gate(s) },
  ],
  exits: [{ x: 23, y: 1, w: 5, to: 'c4b_skyreach', tx: 47, ty: 19, dir: 'left' }],
  triggers: [
    { id: 'enter', x: 23, y: 5, w: 5, h: 3, run: (s) => C4S.underEnter(s) },
    { id: 'eye', x: 22, y: 36, w: 7, h: 2, once: false, cond: nf('c4b_thunderhead_beaten'), run: (s) => C4S.thunderhead(s) },
  ],
};

export const STORMCROWN_MAPS = [stormfoot, deck, skyreach, hall, undercradle];
