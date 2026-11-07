// Chapter 4a — the Greyspine: the pass, Frosthollow, the Bell Stair and the eastern ledge.
import PASS from './layouts/c4a_greyspine_pass.js';
import TOWN from './layouts/c4a_frosthollow.js';
import HALL from './layouts/c4a_fh_hall.js';
import GUEST from './layouts/c4a_fh_guest.js';
import CAVES from './layouts/c4a_frost_caves.js';
import LEDGE from './layouts/c4a_bell_ledge.js';
import { C4M } from '../../story/ch4a_mountain.js';

const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'town' };
const night = (st) => st.flags.c4a_night && !st.flags.c4a_done;
const day = (st) => !st.flags.c4a_night;
const after = (st) => st.flags.c4a_done;
const gateHeld = (st) => night(st) && st.flags.c4a_gate_done;
const toTown = (layout, x, w, tx, ty) => ({ x, y: layout.h - 1, w, to: 'c4a_frosthollow', tx, ty, dir: 'down' });

export const greyspinePass = {
  ...PASS,
  id: 'c4a_greyspine_pass', name: 'Greyspine Pass', region: 'Greyspine Mountains',
  mood: 'snow', music: 'snow', battleBg: 'snow', treeType: 'pine_snow',
  encounters: {
    rate: 0.9, bg: 'snow', onTiles: '*i:',
    troops: [['c4a_gp_wolves', 2], ['c4a_gp_wolf2', 3], ['c4a_gp_harpy', 2], ['c4a_gp_rime', 2], ['c4a_gp_ogre', 1], ['c4a_gp_mix', 2]],
  },
  signs: [
    { x: 23, y: 53, text: 'GREYSPINE PASS — Frosthollow, a day\'s climb.\nWALK SOFTLY. THE SNOW LISTENS.' },
    { x: 24, y: 42, text: 'QUIET WAY. Do not run. Do not shout.\nDo not sing, Brother Tolle.' },
    { x: 19, y: 18, text: 'QUIET WAY. The snow above has been waiting all winter. Do not give it a reason.' },
  ],
  npcs: [
    { id: 'mae', name: 'Pilgrim Mae', look: 'c4a_davit', x: 8, y: 29, dir: 'down',
      talk: ['Resting my knees. They\'re older than the rest of me.', 'Grey cloaks passed me on the lower trail two days ago. Forty of them, with a big man in front who never once looked at the view.', 'Who climbs a mountain and doesn\'t look at the view?'] },
  ],
  chests: [
    { id: 'c4a_gp_1', x: 4, y: 2, item: 'silversteel_helm' },
    { id: 'c4a_gp_2', x: 33, y: 16, item: 'hi_ether', count: 2 },
    { id: 'c4a_gp_3', x: 5, y: 23, item: 'guard_fruit' },
    { id: 'c4a_gp_4', x: 37, y: 39, item: 'tonic_mist', count: 2 },
    { id: 'c4a_gp_5', x: 2, y: 55, item: 'fire_bomb', count: 3 },
    { id: 'c4a_gp_6', x: 35, y: 26, item: 'hunters_eye' },
  ],
  inspect: [
    { x: 32, y: 10, hint: 'Vigil Stone', run: (s) => C4M.vigil(s) },
    { x: 34, y: 10, hint: 'Cairn', run: (s) => C4M.vigil(s) },
    { x: 14, y: 49, hint: 'Frozen pack', run: (s) => C4M.frozenPack(s) },
    { x: 7, y: 26, text: 'A shrine to the Keepers of Frosthollow. Pilgrims have tied strips of cloth to it — prayers, names, a child\'s mitten.' },
    ...[[5, 44], [37, 31], [7, 16], [33, 6]].map(([x, y], i) => (
      { x, y, hint: 'Frost lily', cond: (st) => !st.flags[`c4a_lily_${i}`], run: (s) => C4M.lily(s, i) })),
  ],
  triggers: [
    { id: 'quiet_low', x: 14, y: 37, w: 10, h: 4, once: false, run: (s) => C4M.quietZone(s, [24, 39]) },
    { id: 'quiet_high', x: 21, y: 13, w: 10, h: 4, once: false, run: (s) => C4M.quietZone(s, [31, 15]) },
    { id: 'den', x: 32, y: 22, w: 5, h: 5, once: false, cond: (st) => !st.flags.c4a_whitefang_dead, run: (s) => C4M.whitefang(s) },
  ],
  exits: [
    { x: 17, y: 57, w: 6, to: '@world' },
    { x: 17, y: 0, w: 6, to: 'c4a_frosthollow', tx: 21, ty: 34, dir: 'up' },
  ],
  onEnter: (s) => C4M.passArrival(s),
};

export const frosthollow = {
  ...TOWN,
  id: 'c4a_frosthollow', name: 'Frosthollow', region: 'Greyspine Mountains',
  mood: (st) => (night(st) ? 'night' : 'snow'),
  music: (st) => (night(st) ? 'tension' : after(st) ? 'sad' : 'snow'),
  battleBg: 'snow', treeType: 'pine_snow', particles: 'snow',
  signs: [{ x: 18, y: 33, text: 'FROSTHOLLOW. Pilgrims welcome. Beds free.\nThe goats are not for petting. (They bite.)' }],
  npcs: [
    { id: 'ansel', name: 'Brother Ansel', look: 'c4a_ansel', x: 24, y: 18, dir: 'down', hint: 'Shop', cond: (st) => !night(st), run: (s) => C4M.ansel(s) },
    { id: 'agathe', name: 'Sister Agathe', look: 'c4a_agathe', x: 10, y: 20, dir: 'down', cond: (st) => !night(st), run: (s) => C4M.agathe(s) },
    { id: 'ivo', name: 'Brother Ivo', look: 'c4a_ivo', x: 40, y: 22, dir: 'left', cond: (st) => !night(st), run: (s) => C4M.ivo(s) },
    { id: 'rhoswen', name: 'Sister Rhoswen', look: 'c4a_rhoswen', x: 9, y: 12, dir: 'left', cond: (st) => !night(st), run: (s) => C4M.rhoswen(s) },
    { id: 'wenna', name: 'Sister Wenna', look: 'c4a_wenna', x: 33, y: 25, dir: 'down', cond: day, run: (s) => C4M.wenna(s) },
    { id: 'davit', name: 'Pilgrim Davit', look: 'c4a_davit', x: 17, y: 27, dir: 'up', wander: 2, cond: day,
      talk: ['Came up for the Keeper\'s blessing. Stayed for the soup.', 'There\'s an army camped at the foot of the mountain. Sunburst banners. Holy soldiers, I thought — but I watched them a whole evening, and they never once prayed.'] },
    { id: 'sigurd', name: 'Brother Sigurd', look: 'c4a_monk', x: 26, y: 12, dir: 'down', wander: 1, cond: (st) => !night(st),
      talk: (s) => s.say('Brother Sigurd', s.flag('c4a_done')
        ? ['Sweep, sweep. I keep sweeping the steps to the tower.', 'Nobody climbs them now. I sweep them anyway. Somebody should keep the way clear.']
        : ['Snow, snow, snow. Sweep, sweep, sweep.', 'The mountain is very generous with its snow. I am very generous with my broom. We have an understanding.']) },
    // Hide-and-seek (daytime, before the chapter ends).
    { id: 'ebba', name: 'Ebba', look: 'c4a_ebba', x: 21, y: 21, dir: 'down', cond: day, run: (s) => C4M.ebba(s) },
    { id: 'tomas', name: 'Tomas', look: 'c4a_tomas', x: 38, y: 15, dir: 'up', cond: day, run: (s) => C4M.hider(s, 'tomas') },
    { id: 'lars', name: 'Lars', look: 'c4a_lars', x: 43, y: 29, dir: 'left', cond: day, run: (s) => C4M.hider(s, 'lars') },
    { id: 'oskar', name: 'Oskar', look: 'c4a_oskar', x: 42, y: 5, dir: 'up', cond: day, run: (s) => C4M.hider(s, 'oskar') },
    // The night of the ambush.
    { id: 'garrick_g', name: 'Garrick', look: 'garrick', x: 21, y: 28, dir: 'up', cond: gateHeld, talk: (s) => s.say('Garrick', 'Run, Halloway. It\'s what Keepers\' children are good at.') },
    { id: 'halvard_g', name: 'Halvard', look: 'halvard', x: 21, y: 25, dir: 'down', cond: gateHeld, talk: (s) => s.say('Halvard', 'The Bell Stair, Wren! GO!') },
    ...[[19, 29], [23, 29], [20, 31], [22, 31]].map(([x, y], i) => (
      { id: `vesper_g${i}`, name: 'Vesper Soldier', look: 'vesper_soldier', x, y, dir: 'up', cond: gateHeld, talk: ['...'] })),
  ],
  inspect: [
    { x: 6, y: 11, hint: 'Memorial', run: (s) => C4M.memorial(s) },
    { x: 8, y: 11, hint: 'Memorial', run: (s) => C4M.memorial(s) },
    { x: 24, y: 7, hint: 'Bell tower', run: (s) => C4M.bellTower(s) },
    { x: 23, y: 23, hint: 'Well', text: 'The well is frozen over. Someone has chipped a hole in the ice and left a ladle beside it, the way you\'d leave a key under a mat.' },
  ],
  exits: [
    { x: 20, y: 35, w: 3, to: 'c4a_greyspine_pass', tx: 19, ty: 1, dir: 'down', cond: (st) => !night(st),
      blocked: async (s) => { await s.say('Corvin', 'Gate road\'s crawling with grey cloaks, sparrow. Wrong way.'); await s.step('player', 0, -1); } },
    { x: 39, y: 1, w: 3, to: 'c4a_frost_caves', tx: 1, ty: 15, dir: 'right', cond: (st) => night(st) && st.flags.c4a_gate_done,
      blocked: async (s) => { await C4M.stairLocked(s); await s.step('player', 0, 1); } },
  ],
  onEnter: (s) => C4M.frosthollowEnter(s),
};

export const fhHall = {
  ...HALL, ...interior,
  id: 'c4a_fh_hall', name: 'The Hall of Echoes', mood: 'temple', particles: 'motes_gold', camera: { dist: 17, pitch: 0.72 },
  music: (st) => (after(st) ? 'sad' : night(st) ? 'tension' : 'kindling'),
  npcs: [
    { id: 'halvard', name: 'Halvard', look: 'halvard', x: 8, y: 4, dir: 'down', cond: (st) => st.flags.c4a_halvard_met && day(st), run: (s) => C4M.halvardTalk(s) },
    { id: 'quill', name: 'Brother Quill', look: 'c4a_quill', x: 14, y: 6, dir: 'left', cond: (st) => !night(st), run: (s) => C4M.quill(s) },
    { id: 'yrsa', name: 'Yrsa', look: 'c4a_yrsa', x: 15, y: 3, dir: 'left', cond: (st) => st.flags.c4a_halvard_met && day(st), run: (s) => C4M.hider(s, 'yrsa') },
  ],
  inspect: [6, 8, 10].map((x) => ({ x, y: 1, hint: 'The Ice Score', run: (s) => C4M.iceScore(s) })),
  exits: [toTown(HALL, 7, 3, 14, 9)],
  onEnter: (s) => C4M.halvard(s),
};

export const fhGuest = {
  ...GUEST, ...interior,
  id: 'c4a_fh_guest', name: 'Frosthollow Guesthouse', music: (st) => (night(st) ? null : 'snow'),
  npcs: [
    { id: 'tolle', name: 'Brother Tolle', look: 'c4a_tolle', x: 6, y: 3, dir: 'down', cond: day, hint: 'Rest', run: (s) => C4M.tolle(s) },
    { id: 'linnea', name: 'Linnea', look: 'c4a_linnea', x: 9, y: 3, dir: 'up', cond: (st) => st.flags.c4a_halvard_met && day(st), run: (s) => C4M.hider(s, 'linnea') },
    { id: 'agathe_g', name: 'Sister Agathe', look: 'c4a_agathe', x: 4, y: 3, dir: 'down', cond: after,
      talk: ['I keep airing the beds. Tolle would want them aired.', 'He wrote from Saltglass. Two pages about the children and one line about himself: "I am managing." He underlined "managing." That boy.'] },
  ],
  inspect: [{ x: 5, y: 4, text: 'A guest book. Three winters back, in a big looping hand: "Sir Aldous Venn and squire. Couldn\'t sleep. Lovely tea."' }],
  exits: [toTown(GUEST, 4, 3, 32, 11)],
};

export const frostCaves = {
  ...CAVES,
  id: 'c4a_frost_caves', name: 'The Bell Stair', region: 'Greyspine Mountains', mood: 'cave', music: 'tension', battleBg: 'cave',
  scatter: { types: ['rock_small', 'bones', 'debris'], density: 0.05, seed: 76 },
  encounters: { rate: 0.9, bg: 'cave', onTiles: 'ci', troops: [['c4a_fc_bats', 2], ['c4a_fc_rime', 2], ['c4a_fc_squad', 3], ['c4a_fc_cantor', 2]] },
  blockers: [{ id: 'rubble', x: 29, y: 12, h: 3, prop: 'rock_snow' }],
  chests: [
    { id: 'c4a_fc_1', x: 18, y: 3, item: 'hi_ether', count: 2 },
    { id: 'c4a_fc_2', x: 10, y: 25, item: 'mega_tonic' },
    { id: 'c4a_fc_3', x: 20, y: 18, item: 'ember_feather', count: 2 },
    { id: 'c4a_fc_4', x: 39, y: 6, item: 'focus_pendant' },
    { id: 'c4a_fc_5', x: 37, y: 26, item: 'tonic_mist', count: 2 },
  ],
  inspect: [
    { x: 15, y: 6, text: 'Steps cut into the ice by hand, worn into shallow bowls by centuries of monks\' feet. Each step has a number carved beside it. You are on step four hundred and twelve.' },
    { x: 38, y: 22, text: 'Someone has carved a little bell into the wall by the Hearthstone, and under it: FOR THE ONES WHO HAD TO LEAVE IN A HURRY.' },
  ],
  triggers: [
    { id: 'stair_in', x: 1, y: 14, w: 3, h: 3, run: (s) => C4M.stairEntry(s) },
    { id: 'ambush', x: 18, y: 6, w: 5, h: 5, run: (s) => C4M.stairAmbush(s) },
    { id: 'rubble', x: 26, y: 11, w: 3, h: 5, once: false, cond: (st) => !st.flags['blocker:c4a_frost_caves:rubble'], run: (s) => C4M.rubble(s) },
  ],
  exits: [
    { x: 0, y: 14, h: 3, to: 'c4a_frosthollow', tx: 40, ty: 3, dir: 'down', cond: () => false,
      blocked: async (s) => { await s.say('Bram', 'Boots on the stair behind us. There\'s no going back.'); await s.step('player', 1, 0); } },
    { x: 45, y: 21, h: 3, to: 'c4a_bell_ledge', tx: 1, ty: 13, dir: 'right' },
  ],
};

export const bellLedge = {
  ...LEDGE,
  id: 'c4a_bell_ledge', name: 'Below the Bell Tower', region: 'Greyspine Mountains', mood: 'night', music: null, battleBg: 'snow', treeType: 'pine_snow', particles: 'snow',
  scatter: { types: ['rock_small'], density: 0.03, seed: 4 },
  exits: [
    { x: 0, y: 12, h: 3, to: 'c4a_frost_caves', tx: 44, ty: 22, dir: 'left', cond: () => false, blocked: async (s) => s.step('player', 1, 0) },
  ],
  onEnter: (s) => C4M.ledge(s),
};

export const GREYSPINE_MAPS = [greyspinePass, frosthollow, fhHall, fhGuest, frostCaves, bellLedge];
