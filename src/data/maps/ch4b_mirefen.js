// Chapter 4b — Mirefen: the swamp road, the stilt village, its inn, Mother Osk's Lantern
// and the Drownmere (dungeon). Story beats live in src/story/ch4b.js.
import ROAD from './layouts/mirefen_road.js';
import VILLAGE from './layouts/c4b_mirefen.js';
import INN from './layouts/c4b_mirefen_inn.js';
import LANTERN from './layouts/c4b_osk_lantern.js';
import MERE from './layouts/c4b_drownmere.js';
import { C4M } from '../../story/ch4b.js';

/** Deep, murky fen-water: 'V' in the layouts. */
export const SWAMP_LEGEND = { V: { water: true, murky: true, bottom: 'mud' } };
const FEN_BACKDROP = { plane: '#2c3a26', y: -0.45 };

const at = (L, k) => ({ x: L.spots[k][0], y: L.spots[k][1] });
const f = (name) => (st) => !!st.flags[name];
const nf = (name) => (st) => !st.flags[name];
const cured = f('c4b_osk_saved');
const ill = nf('c4b_osk_saved');

// =====================================================================
// The road into the fens
// =====================================================================
/** @type {import('../../types/data').MapDef} */
const mirefenRoad = {
  ...ROAD, legend: SWAMP_LEGEND, backdrop: FEN_BACKDROP,
  id: 'mirefen_road', name: 'The Fenward Causeway', region: 'The Fens of Mirefen',
  mood: 'swamp', music: 'swamp', battleBg: 'swamp', treeType: 'tree',
  encounters: {
    rate: 1, bg: 'swamp', onTiles: 'mp,',
    troops: [['c4b_mr_leeches', 3], ['c4b_mr_toads', 2], ['c4b_mr_wisp_toad', 3], ['c4b_mr_crawler', 2], ['c4b_mr_rotcaps', 2]],
  },
  signs: [{ x: 4, y: 18, text: 'GREYSPINE PASS — WEST.\nSomeone has scratched underneath, fresh: _CLOSED. SNOW._' }],
  npcs: [
    { id: 'gaspar', name: 'Gaspar', look: 'c4b_gaspar', ...at(ROAD, 'gaspar'), dir: 'down', run: (s) => C4M.gaspar(s) },
    { id: 'sick1', name: 'Coughing Pilgrim', look: 'villager_19', ...at(ROAD, 'sick1'), dir: 'up',
      talk: (s) => s.say('Coughing Pilgrim', s.flag('c4b_osk_saved')
        ? ['A girl with a black bob came out here with a bucket of something foul and made us all drink it.', 'I can breathe. I\'d kiss her, but she looked like she\'d stab me.']
        : ['We were walking to Mirefen for Mother Osk\'s blessing. Got as far as the fever.', 'They won\'t let us in the village. Can\'t say I blame them. Look at my hands.', '_(The veins on his wrists are black, like ink in water.)_']) },
    { id: 'sick2', name: 'Pilgrim\'s Daughter', look: 'villager_46', ...at(ROAD, 'sick2'), dir: 'up',
      talk: (s) => s.say('Pilgrim\'s Daughter', s.flag('c4b_osk_saved')
        ? ['Da\'s veins are going pink again. Pink! I never thought I\'d be glad of pink.']
        : ['The Choir men came by on a white barge, three weeks back. Da waved to them for help.', 'They didn\'t stop. They had something in a box that hummed.']) },
  ],
  chests: [
    { id: 'shrine', ...at(ROAD, 'shrine_chest'), item: 'starsteel_stiletto' },
    { id: 'north', ...at(ROAD, 'north_chest'), item: 'hi_tonic', count: 3 },
    { id: 'camp', ...at(ROAD, 'camp_chest'), item: 'antidote', count: 4 },
  ],
  inspect: [
    { ...at(ROAD, 'poster'), hint: 'Read', run: (s) => C4M.poster(s) },
    { x: 8, y: 26, text: 'A statue of a woman with a lantern, up to her knees in the fen. A string of dried frogs hangs around her neck. An offering, or a joke. In Mirefen it is hard to tell.' },
    { x: 23, y: 12, text: 'Gaspar\'s punt. The pole is worn smooth as bone where his hands go.' },
  ],
  exits: [
    { x: 47, y: 14, h: 3, to: 'c4b_mirefen', tx: 1, ty: 18, dir: 'right' },
    { x: 0, y: 19, h: 3, to: 'mirefen_road', tx: 2, ty: 20, dir: 'right', cond: () => false,
      blocked: async (s) => {
        await s.say('Bram', 'That\'s the way back to the mountains.');
        await s.say('Wren', '...There\'s nothing back there now. Come on.');
        await s.step('player', 1, 0);
      } },
  ],
  triggers: [
    { id: 'patrol', x: 31, y: 16, w: 2, h: 6, cond: nf('c4b_patrol_done'), run: (s) => C4M.patrol(s) },
  ],
  onEnter: (s) => C4M.opening(s),
};

// =====================================================================
// Mirefen — the stilt village
// =====================================================================
/** @type {import('../../types/data').MapDef} */
const village = {
  ...VILLAGE, legend: SWAMP_LEGEND, backdrop: FEN_BACKDROP,
  id: 'c4b_mirefen', name: 'Mirefen', region: 'The Fens',
  mood: 'swamp', music: (st) => (st.flags.c4b_osk_saved ? 'town' : 'swamp'), battleBg: 'swamp', treeType: 'tree',
  signs: [{ x: 14, y: 17, text: 'MIREFEN. Mind the gaps. Mind the water. Mind your manners.\nBy order of Mother Osk, Keeper of the Mirefen Light.' }],
  npcs: [
    // --- the Rot House
    { id: 'vey', name: 'Doctor Vey', look: 'c4b_vey', ...at(VILLAGE, 'vey'), dir: 'down', run: (s) => C4M.vey(s) },
    { id: 'lisette', name: 'Cantor Lisette', look: 'c4b_lisette', ...at(VILLAGE, 'lisette'), dir: 'right', run: (s) => C4M.lisette(s) },
    { id: 'nettie', name: 'Nettie', look: 'c4b_nettie', ...at(VILLAGE, 'nettie'), dir: 'down', run: (s) => C4M.nettie(s) },
    { id: 'dace', name: 'Corporal Dace', look: 'c4b_dace', ...at(VILLAGE, 'dace'), dir: 'left', run: (s) => C4M.dace(s) },
    // --- the village
    { id: 'tiller', name: 'Mag Tiller', look: 'c4b_tiller', ...at(VILLAGE, 'tiller'), dir: 'up', hint: 'Shop',
      run: async (s) => {
        await s.say('Mag Tiller', s.flag('c4b_osk_saved')
          ? 'Business is back! Well. People are buying soap again. That\'s how you know a town\'s recovering — soap.'
          : 'Buying? Selling? Coughing? Two out of three, I can help.');
        await s.shop('mirefen');
      } },
    { id: 'pell', name: 'Widow Pell', look: 'c4b_pell', ...at(VILLAGE, 'pell'), dir: 'down', run: (s) => C4M.pell(s) },
    { id: 'corla', name: 'Corla', look: 'villager_36', ...at(VILLAGE, 'corla'), dir: 'left',
      talk: (s) => s.say('Corla', s.flag('c4b_osk_saved')
        ? ['Benet caught an eel this morning with two heads. Both of them looked healthy, though. That\'s progress.']
        : ['The Choir barge came the night Mother Osk took the fever. Very polite. Very white robes.', 'Left the next morning. The Lantern\'s been dark since. Funny, that.', 'Benet says I shouldn\'t say "funny." Benet says a lot of things.']) },
    { id: 'benet', name: 'Benet', look: 'villager_17', ...at(VILLAGE, 'benet'), dir: 'right',
      talk: (s) => s.say('Benet', s.flag('c4b_osk_saved')
        ? ['Corla\'s telling everyone about the two-headed eel, isn\'t she.', 'It had one head. The other one was a stick. I didn\'t have the heart.']
        : ['Don\'t listen to Corla. The Choir are holy folk.', 'Mind you, holy folk don\'t usually take the light with them when they leave.']) },
    { id: 'sedge', name: 'Sedge', look: 'villager_9', ...at(VILLAGE, 'sedge'), dir: 'down', wander: 1, run: (s) => C4M.sedge(s) },
    { id: 'wisk', name: 'Granny Wisk', look: 'villager_51', ...at(VILLAGE, 'weaver'), dir: 'down',
      talk: (s) => s.say('Granny Wisk', s.flag('c4b_osk_saved')
        ? ['Osk\'s sitting up and complaining about the soup. She\'ll outlive us all out of spite.', 'Here — I\'m weaving her a new blanket. The old one\'s been in the bog. Don\'t ask.']
        : ['Sixty years I\'ve known Osk. She\'s been dying three times and refused every time.', 'This time she\'s too tired to argue. That\'s what frightens me.']) },
    { id: 'hesk_v', name: 'Hesk', look: 'c4b_hesk', ...at(VILLAGE, 'hesk'), dir: 'down', cond: cured, run: (s) => C4M.heskAfter(s) },
    { id: 'kid_v', name: 'Little Moll', look: 'villager_5', x: 24, y: 18, dir: 'left', wander: 2, cond: cured,
      talk: ['I\'m playing Keepers and Gloam! I\'m the Gloam. Rarrr.', 'Nettie\'s the Keeper. She\'s better now. She keeps winning.'] },
    { id: 'guard_s', name: 'Jetty Warden', look: 'villager_28', x: 21, y: 30, dir: 'right', cond: ill,
      talk: (s) => s.say('Jetty Warden', s.flag('c4b_cure_quest')
        ? ['The Drownmere\'s due south, straight past me. Take the punt. Bring it back — it\'s the only one that doesn\'t leak.', 'And if you see my brother in the water... don\'t talk to him. He\'s been dead nine years.']
        : ['Nobody goes into the Drownmere. Not since the light went out. Doctor\'s orders.']) },
  ],
  chests: [
    { id: 'pell_porch', x: 7, y: 26, item: 'mire_pearl', count: 2 },
    { id: 'lantern_isle', x: 41, y: 9, item: 'starweave_hood' },
  ],
  inspect: [
    { x: 30, y: 16, text: 'A sack of willow bark, half-boiled. Doctor Vey\'s handwriting on the label: _does nothing. try anyway._' },
    { x: 38, y: 16, text: 'A cauldron of something gray. It smells like hope, if hope had been left out overnight.' },
    { x: 18, y: 20, text: 'Mag Tiller\'s stall: eel-skin boots, reed charms, a jar labeled ROT CURE (GENUINE). The jar is empty. The label is very confident.' },
    { x: 27, y: 14, text: 'A rain barrel, carefully covered. Everyone in Mirefen drinks rainwater now. Nobody trusts the fen.' },
  ],
  exits: [
    { x: 0, y: 17, h: 2, to: 'mirefen_road', tx: 45, ty: 15, dir: 'left' },
    { x: 21, y: 35, w: 3, to: 'c4b_drownmere', tx: 27, ty: 43, dir: 'up', cond: f('c4b_cure_quest'),
      blocked: async (s) => { await s.say('Jetty Warden', 'Nobody goes into the Drownmere. Turn around, please.'); await s.step('player', 0, -1); } },
    { x: 9, y: 0, w: 2, to: '@world', cond: cured,
      blocked: async (s) => { await s.say('Ilse', 'We\'re not leaving. Not while she\'s like this.'); await s.step('player', 0, 1); } },
  ],
  onEnter: (s) => C4M.arrival(s),
};

// =====================================================================
// Interiors
// =====================================================================
const indoor = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'swamp' };

/** @type {import('../../types/data').MapDef} */
const inn = {
  ...INN, ...indoor,
  id: 'c4b_mirefen_inn', name: 'The Leaning Heron', music: 'town',
  npcs: [
    { id: 'rusk', name: 'Rusk', look: 'c4b_rusk', ...at(INN, 'rusk'), dir: 'down', hint: 'Rest', run: (s) => C4M.rusk(s) },
    { id: 'drinker', name: 'Fen-Tom', look: 'villager_33', ...at(INN, 'drinker'), dir: 'right',
      talk: (s) => s.say('Fen-Tom', s.flag('c4b_osk_saved')
        ? ['They say the Marrow girl walked into the Drownmere and walked out carrying its heart in a jar.', 'I\'m switching to tea.']
        : ['Black veins. That\'s how it starts. Then the cough. Then you start seeing people in the fog.', 'I\'ve got the cough. Haven\'t seen anyone yet.', 'Except you lot. Are you real?']) },
    { id: 'bard', name: 'Lark', look: 'villager_42', ...at(INN, 'bard'), dir: 'left', run: (s) => C4M.lark(s) },
  ],
  inspect: [
    { x: 6, y: 4, text: 'A pot of eel stew. Rusk swears there\'s nothing in it but eel. Rusk is not looking at you when he says it.' },
    { x: 10, y: 2, text: 'A shelf of books swollen fat with damp. _The Keepers of Old_, _Fen Remedies_, and a romance called _The Heron\'s Kiss_ with one page dog-eared to death.' },
  ],
  exits: [{ x: 5, y: 9, w: 3, to: 'c4b_mirefen', tx: 19, ty: 12, dir: 'down' }],
};

/** @type {import('../../types/data').MapDef} */
const oskLantern = {
  ...LANTERN, ...indoor,
  id: 'c4b_osk_lantern', name: 'The Mirefen Lantern', mood: 'interior', music: (st) => (st.flags.c4b_osk_saved ? 'swamp' : 'sad'),
  npcs: [
    { id: 'osk', name: 'Mother Osk', look: 'osk', ...at(LANTERN, 'osk'), dir: 'right', run: (s) => C4M.osk(s) },
    { id: 'hesk', name: 'Hesk', look: 'c4b_hesk', ...at(LANTERN, 'hesk'), dir: 'left', cond: ill, run: (s) => C4M.heskBefore(s) },
  ],
  inspect: [
    { ...at(LANTERN, 'cradle'), hint: 'The cradle', run: async (s) => s.narrate(s.flag('c4b_osk_saved')
      ? ['The brass cradle where Mirefen\'s Dawnstone should sleep. Empty. Osk has put a jar of fireflies in it, out of spite.']
      : ['The brass cradle at the heart of the Lantern. Empty. The metal is still warm in the shape of something that is not there.']) },
    { x: 1, y: 2, text: 'Jars of herbs, eel-oil, dried frogs and something labeled in Osk\'s cramped hand: _DO NOT. EVER. (YES, YOU, HESK.)_' },
    { x: 11, y: 5, text: 'A cauldron, scrubbed clean. Somebody has been making soup every day for a woman who cannot eat it.' },
  ],
  exits: [{ x: 6, y: 11, w: 3, to: 'c4b_mirefen', tx: 37, ty: 8, dir: 'down' }],
  onEnter: (s) => C4M.lanternEnter(s),
};

// =====================================================================
// The Drownmere
// =====================================================================
const S = MERE.spots;
/** @type {import('../../types/data').MapDef} */
const drownmere = {
  ...MERE, legend: SWAMP_LEGEND, backdrop: FEN_BACKDROP,
  id: 'c4b_drownmere', name: 'The Drownmere', region: 'The Fens', mood: 'swamp', music: 'cave', battleBg: 'swamp',
  particles: 'fireflies', camera: { dist: 18, pitch: 0.7 },
  encounters: {
    rate: 1.1, bg: 'swamp', onTiles: 'mpc',
    troops: [['c4b_dm_drowned', 3], ['c4b_dm_lurker', 2], ['c4b_dm_mix', 3], ['c4b_dm_crawlers', 2], ['c4b_dm_toads', 2], ['c4b_dm_grotto', 1]],
  },
  chests: [
    { id: 'hub', x: S.c_hub[0], y: S.c_hub[1], item: 'hi_ether', count: 2 },
    { id: 'islet', x: S.c_islet[0], y: S.c_islet[1], item: 'starweave_robe' },
    { id: 'west', x: S.c_west[0], y: S.c_west[1], item: 'ember_feather', count: 2 },
    { id: 'shrine', x: S.c_shrine[0], y: S.c_shrine[1], item: 'starwood_staff' },
    { id: 'grotto1', x: S.c_grotto1[0], y: S.c_grotto1[1], item: 'starsteel_gauntlets' },
    { id: 'grotto2', x: S.c_grotto2[0], y: S.c_grotto2[1], item: 'magic_fruit' },
    { id: 'chapel', x: S.c_chapel[0], y: S.c_chapel[1], item: 'focus_pendant' },
    { id: 'north', x: S.c_north[0], y: S.c_north[1], item: 'tonic_mist', count: 2 },
  ],
  blockers: [{ id: 'rotwall', x: S.wall[0], y: S.wall[1], w: 3, prop: 'tree_dead' }],
  inspect: [
    { x: S.moss[0], y: S.moss[1], hint: 'Gather', cond: nf('c4b_got_moss'), run: (s) => C4M.moss(s) },
    { x: S.lily[0], y: S.lily[1], hint: 'Gather', cond: nf('c4b_got_lily'), run: (s) => C4M.lily(s) },
    { x: S.wall[0] + 1, y: S.wall[1], hint: 'Examine', cond: nf('blocker:c4b_drownmere:rotwall'), run: (s) => C4M.rotWall(s) },
    { x: S.ring[0], y: S.ring[1], hint: 'Examine', cond: nf('c4b_pell_ring'), run: (s) => C4M.ring(s) },
    { x: 27, y: 28, text: 'A statue of a Keeper, half swallowed by the bog. Her lantern is full of frogspawn. The frogs, at least, seem happy.' },
    { x: 8, y: 13, text: 'The Sunken Shrine. Someone kept a lamp burning here for two hundred years, until the fen rose. You can still see the soot on the stones.', cond: f('c4b_got_moss') },
  ],
  exits: [{ x: 25, y: 45, w: 5, to: 'c4b_mirefen', tx: 22, ty: 33, dir: 'up' }],
  triggers: [
    { id: 'enter', x: 25, y: 41, w: 5, h: 3, run: (s) => C4M.mereEnter(s) },
    { id: 'boss', x: 23, y: 8, w: 10, h: 3, cond: nf('c4b_mawmire_beaten'), once: false, run: (s) => C4M.mawmire(s) },
  ],
};

export const MIREFEN_MAPS = [mirefenRoad, village, inn, oskLantern, drownmere];
