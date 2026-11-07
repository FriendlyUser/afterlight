// Chapter 4a — Saltglass (town, Lantern, inn, Asha's house) and the Glass Caverns.
import TOWN from './layouts/c4a_saltglass.js';
import LANTERN from './layouts/c4a_sg_lantern.js';
import INN from './layouts/c4a_sg_inn.js';
import HOUSE from './layouts/c4a_sg_house.js';
import CAVERNS from './layouts/c4a_glass_caverns.js';
import NEST from './layouts/c4a_glass_nest.js';
import { C4A } from '../../story/ch4a.js';

const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'town', music: 'town' };
/** Exit along an interior's open bottom row, back out to the town door. */
const toTown = (layout, x, w, tx, ty) => ({ x, y: layout.h - 1, w, to: 'c4a_saltglass', tx, ty, dir: 'down' });
const done = (st) => st.flags.c4a_done;
const jorahHome = (st) => st.flags.c4a_jorah_freed;

export const saltglass = {
  ...TOWN,
  id: 'c4a_saltglass', name: 'Saltglass', region: 'Sunscar Desert',
  mood: 'desert', music: 'town', battleBg: 'desert', particles: 'dust_sand',
  signs: [{ x: 28, y: 22, text: 'SALTGLASS — last sweet water for thirty leagues.\nThe Lantern is open to pilgrims from dawn until dusk.\nCaravans north: ask at the yard.' }],
  npcs: [
    { id: 'marisol', name: 'Sister Marisol', look: 'c4a_marisol', x: 21, y: 7, dir: 'down', run: (s) => C4A.marisol(s) },
    { id: 'faroukh', name: 'Faroukh', look: 'c4a_faroukh', x: 18, y: 17, dir: 'down', hint: 'Shop',
      run: async (s) => { await s.say('Faroukh', ['Caravan Market! Everything that came across the sand and survived it.', 'Prices are fixed. Fixed by me. Daily. Sometimes hourly.']); await s.shop('saltglass'); } },
    { id: 'leyla', name: 'Leyla', look: 'c4a_yusra', x: 26, y: 17, dir: 'down', run: (s) => C4A.leyla(s) },
    { id: 'dima', name: 'Old Dima', look: 'c4a_dima', x: 25, y: 20, dir: 'left', run: (s) => C4A.dima(s) },
    { id: 'zeyneb', name: 'Grandmother Zeyneb', look: 'c4a_zeyneb', x: 7, y: 8, dir: 'down', run: (s) => C4A.zeyneb(s) },
    { id: 'ruel', name: 'Master Ruel', look: 'c4a_ruel', x: 11, y: 25, dir: 'left', run: (s) => C4A.ruel(s) },
    { id: 'idris', name: 'Captain Idris', look: 'c4a_idris', x: 3, y: 17, dir: 'right', run: (s) => C4A.idris(s) },
    { id: 'nim', name: 'Nim', look: 'c4a_nim', x: 3, y: 22, dir: 'left', cond: (st) => !jorahHome(st), run: (s) => C4A.nimGate(s) },
    { id: 'oyelaran', name: 'Oyelaran', look: 'c4a_oyelaran', x: 40, y: 7, dir: 'down', hint: 'Caravans', run: (s) => C4A.oyelaran(s) },
    { id: 'teo', name: 'Teo', look: 'c4a_teo', x: 22, y: 11, dir: 'up', run: (s) => C4A.teo(s) },
    { id: 'hesper', name: 'Hesper', look: 'c4a_hesper', x: 27, y: 11, dir: 'left',
      talk: (s) => s.say('Hesper', s.flag('c4a_pip_kindled')
        ? ['Teo hasn\'t stopped sulking since your little friend came out of the Lantern glowing.', 'Thirty days until his birthday. I\'m going to need a bigger sulk-bucket.']
        : ['We walked from Thistledown so my Teo could be Kindled in Saltglass light. His grandfather was. And his grandfather.', 'Now we wait thirty days for his birthday, in a town where water costs more than wine.']) },
    { id: 'kid1', name: 'Rafi', look: 'c4a_kid_a', x: 30, y: 28, wander: 2,
      talk: ['We\'re playing Lanterns and Gloam! I\'m the Gloam! RAAAH!'] },
    { id: 'kid2', name: 'Suri', look: 'c4a_kid_b', x: 32, y: 29, wander: 2,
      talk: ['Rafi is ALWAYS the Gloam. He says the Gloam is the best part.', 'The Gloam is NOT the best part. The best part is when the sun comes back.'] },
    { id: 'tolle_sg', name: 'Brother Tolle', look: 'c4a_tolle', x: 22, y: 8, dir: 'down', cond: done,
      talk: ['The children sing on the Lantern steps every morning. The Keeper sits with them.', 'She says it\'s the worst choir she\'s ever heard. She cried the first time.'] },
    { id: 'yrsa_sg', name: 'Yrsa', look: 'c4a_yrsa', x: 26, y: 8, dir: 'down', cond: done,
      talk: (s) => s.narrate('Yrsa looks up at you and hums three notes of the morning hymn. Then she goes back to drawing a bell in the sand.') },
  ],
  inspect: [
    { x: 24, y: 19, hint: 'Well', run: (s) => s.narrate(['The deep well of Saltglass. The rope goes down, and down, and down.', 'You drop a pebble. Four heartbeats later, very faintly: _plink._']) },
    { x: 7, y: 6, hint: 'Chimes', run: (s) => C4A.chimes(s) },
    { x: 12, y: 26, text: 'Master Ruel\'s furnace. The air above it wobbles like a mirage that can\'t make up its mind.' },
  ],
  exits: [
    { x: 0, y: 18, h: 4, to: 'c4a_dunes', tx: 60, ty: 26, dir: 'left' },
    { x: 47, y: 26, h: 3, to: 'c4a_glass_caverns', tx: 1, ty: 19, dir: 'right' },
  ],
  onEnter: (s) => C4A.saltglassArrival(s),
};

export const sgLantern = {
  ...LANTERN, ...interior,
  id: 'c4a_sg_lantern', name: 'The Saltglass Lantern', mood: 'temple', music: 'kindling', particles: 'motes_gold', camera: { dist: 17, pitch: 0.72 },
  npcs: [
    { id: 'tamsin', name: 'Keeper Tamsin', look: 'tamsin', x: 7, y: 4, dir: 'down', cond: (st) => st.flags.c4a_tamsin_met, run: (s) => C4A.tamsinTalk(s) },
  ],
  inspect: [
    { x: 7, y: 2, hint: 'The Lamp', run: (s) => s.narrate(['The lamp of Saltglass burns inside a cage of saltglass panes. The light comes out of the glass in every direction at once.', 'Up close it hums — very low, like a cat that\'s pleased with itself. Or a cat that isn\'t.']) },
    { x: 2, y: 4, text: 'A mirror of polished saltglass. Your reflection is a half-step behind you, as if it\'s thinking things over.' },
    { x: 12, y: 7, text: 'A mirror of polished saltglass. In it, the Lantern\'s light looks like dawn. In the room, it looks like noon.' },
  ],
  exits: [toTown(LANTERN, 6, 3, 24, 7)],
  onEnter: (s) => C4A.tamsin(s),
};

export const sgInn = {
  ...INN, ...interior,
  id: 'c4a_sg_inn', name: 'The Cool Well',
  npcs: [
    { id: 'yusra', name: 'Innkeeper Yusra', look: 'c4a_yusra', x: 6, y: 3, dir: 'down', hint: 'Rest',
      run: async (s) => { await s.say('Innkeeper Yusra', 'A cool bed, a cold supper, and a jug of real water? Sixty gold. The water alone is worth forty.'); await s.inn(60, 'the Cool Well'); } },
    { id: 'ines', name: 'Velvet Ines', look: 'c4a_ines', x: 11, y: 5, dir: 'left', run: (s) => C4A.ines(s) },
    { id: 'drunk', name: 'Caravaneer', look: 'villager_28', x: 1, y: 5, dir: 'right',
      talk: ['The Hierophant\'s men used to ride through and bless the wells.', 'Now they ride through and _count_ them. Why would you count wells? Wells don\'t go anywhere.', '...Unless you\'re planning on needing to know where they are.'] },
    { id: 'amal', name: 'Amal the Lutenist', look: 'villager_19', x: 9, y: 7, dir: 'up',
      talk: ['I\'m writing a ballad about the Sunscar. So far it rhymes "sand" with "sand" eleven times.', 'Critics call it "accurate."'] },
  ],
  exits: [toTown(INN, 5, 3, 9, 14)],
};

export const sgHouse = {
  ...HOUSE, ...interior,
  id: 'c4a_sg_house', name: 'Asha\'s House',
  npcs: [
    { id: 'asha', name: 'Asha', look: 'c4a_asha', x: 5, y: 4, dir: 'left', run: (s) => C4A.asha(s) },
    { id: 'jorah', name: 'Jorah', look: 'c4a_jorah', x: 2, y: 4, dir: 'right', cond: jorahHome,
      talk: ['I used to run the salt road in four days. Now I walk to the well and back and call it a day\'s work.', 'Best days of my life, both of them. Just one of them\'s got Nim in it.'] },
    { id: 'nim_home', name: 'Nim', look: 'c4a_nim', x: 6, y: 5, dir: 'up', cond: jorahHome, wander: 1,
      talk: ['Papa came home! He was SO dirty. Mama made him take two baths.', 'I drew you a picture. It\'s you, and the big one, and the girl with black hair, and the little one with the Crest. The little one is the biggest because he asked.'] },
  ],
  inspect: [{ x: 6, y: 2, text: 'A shelf of maps — salt roads, caravan wells, wind patterns — all annotated in a quick, slanted hand. "J." in every corner.' }],
  exits: [toTown(HOUSE, 3, 3, 36, 15)],
  onEnter: (s) => C4A.jorahReunion(s),
};

const DOOR = 'blocker:c4a_glass_caverns:queen_door';
const WALL = 'blocker:c4a_glass_caverns:jorah_wall';

export const glassCaverns = {
  ...CAVERNS,
  id: 'c4a_glass_caverns', name: 'The Glass Caverns', region: 'Sunscar Desert', mood: 'cave', music: 'cave', battleBg: 'cave',
  scatter: { types: ['rock_small', 'debris', 'bones'], density: 0.04, seed: 38 },
  encounters: { rate: 1.1, bg: 'cave', onTiles: 'cg', troops: [['c4a_gc_scorp', 3], ['c4a_gc_bats', 2], ['c4a_gc_golem', 2], ['c4a_gc_crawl', 2], ['c4a_gc_brood', 2], ['c4a_gc_mix', 2]] },
  npcs: [
    { id: 'jorah_trapped', name: 'Jorah', look: 'c4a_jorah', x: 38, y: 31, dir: 'left', cond: (st) => !jorahHome(st),
      talk: (s) => s.say('Jorah', 'Can you— is there a way through? Please. Please, I have a daughter.') },
  ],
  blockers: [
    { id: 'queen_door', x: 45, y: 17, h: 5, prop: 'crystal' },
    { id: 'jorah_wall', x: 34, y: 30, h: 3, prop: 'crystal' },
  ],
  chests: [
    { id: 'c4a_gc_1', x: 3, y: 5, item: 'silver_staff' },
    { id: 'c4a_gc_2', x: 23, y: 30, item: 'silversteel_plate' },
    { id: 'c4a_gc_3', x: 29, y: 4, item: 'hi_ether', count: 2 },
    { id: 'c4a_gc_4', x: 14, y: 5, item: 'magic_fruit' },
    { id: 'c4a_gc_5', x: 12, y: 30, item: 'panacea', count: 2 },
    { id: 'c4a_gc_6', x: 45, y: 5, item: 'silver_mail_shirt' },
    { id: 'c4a_gc_7', x: 16, y: 22, item: 'hi_tonic', count: 2 },
  ],
  inspect: [
    { x: 12, y: 4, hint: 'Singing pillar', run: (s) => C4A.pillar(s, 'a') },
    { x: 10, y: 32, hint: 'Singing pillar', run: (s) => C4A.pillar(s, 'b') },
    { x: 43, y: 4, hint: 'Singing pillar', run: (s) => C4A.pillar(s, 'c') },
    { x: 34, y: 31, hint: 'Humming wall', cond: (st) => !st.flags[WALL], run: (s) => C4A.jorahWall(s) },
    { x: 34, y: 30, hint: 'Humming wall', cond: (st) => !st.flags[WALL], run: (s) => C4A.jorahWall(s) },
    { x: 34, y: 32, hint: 'Humming wall', cond: (st) => !st.flags[WALL], run: (s) => C4A.jorahWall(s) },
    { x: 45, y: 19, hint: 'Glass door', cond: (st) => !st.flags[DOOR], run: (s) => C4A.queenDoor(s) },
    { x: 20, y: 22, text: 'A spring bubbles up through a crack in the glass. The water tastes of salt and, faintly, of thunder.' },
  ],
  triggers: [
    { id: 'entry', x: 1, y: 17, w: 3, h: 5, run: (s) => C4A.cavernsEntry(s) },
  ],
  exits: [
    { x: 0, y: 18, h: 3, to: 'c4a_saltglass', tx: 46, ty: 27, dir: 'left' },
    { x: 51, y: 17, h: 5, to: 'c4a_glass_nest', tx: 1, ty: 14, dir: 'right' },
  ],
};

export const glassNest = {
  ...NEST,
  id: 'c4a_glass_nest', name: 'The Queen\'s Nest', region: 'The Glass Caverns', mood: 'cave', music: 'cave', battleBg: 'cave', particles: 'motes_gold',
  chests: [
    { id: 'c4a_nest_1', x: 27, y: 6, item: 'elixir' },
    { id: 'c4a_nest_2', x: 30, y: 14, item: 'silver_rod' },
  ],
  inspect: [
    { x: 12, y: 8, text: 'An egg of saltglass as big as a barrel. Something inside is curled up, waiting for a warmer century.' },
    { x: 25, y: 20, text: 'Copper pots, a wagon wheel, a child\'s wooden horse. A whole caravan\'s worth of things, polished smooth by sand.' },
  ],
  triggers: [
    { id: 'queen', x: 13, y: 9, w: 9, h: 10, once: false, cond: (st) => !st.flags.c4a_queen_dead, run: (s) => C4A.queen(s) },
  ],
  exits: [{ x: 0, y: 13, h: 3, to: 'c4a_glass_caverns', tx: 50, ty: 19, dir: 'left' }],
};

export const SALTGLASS_MAPS = [saltglass, sgLantern, sgInn, sgHouse, glassCaverns, glassNest];
