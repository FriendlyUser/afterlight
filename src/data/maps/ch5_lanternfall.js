// Chapter 5 — Lanternfall at the last sunset (lf_sunset) and its houses.
// Reuses the Act I layouts; every door leads to this chapter's own interiors.
import L from './layouts/lanternfall.js';
import WREN from './layouts/lf_wren_house.js';
import NANA from './layouts/lf_nana_house.js';
import INN from './layouts/lf_inn.js';
import STORE from './layouts/lf_store.js';
import TOBIAS from './layouts/lf_tobias.js';
import { CH5 } from '../../story/ch5.js';

const before = (st) => !st.flags.c5_aftermath;
const running = (st) => st.flags.c5_aftermath && !st.flags.c5_boarded;

// Act I door targets -> Chapter 5 interiors (map, arrival x, y).
const DOORS = {
  lf_wren_house: ['c5_wren_house', 4, 7],
  lf_nana_house: ['c5_nana_house', 4, 6],
  lf_inn: ['c5_inn', 5, 8],
  lf_store: ['c5_store', 4, 5],
  lf_tobias: ['c5_tobias', 3, 4],
};
const buildings = L.buildings.map((b) => {
  const [to, tx, ty] = DOORS[b.door.to];
  return { ...b, door: { ...b.door, to, tx, ty, locked: true, unlockFlag: 'c5_homes', lockedText: 'No time. RUN.' } };
});

export const lfSunset = {
  ...L,
  buildings,
  id: 'lf_sunset',
  name: 'Lanternfall',
  region: 'The Last Sunset',
  mood: (st) => (st.flags.c5_sundering ? 'ruin' : 'dusk'),
  music: (st) => (st.flags.c5_sundering ? 'tension' : 'lanternfall'),
  particles: (st) => (st.flags.c5_sundering ? 'ash' : 'embers_soft'),
  backdrop: 'ocean',
  battleBg: 'beach',
  structures: [
    { type: 'lantern', x: 8, y: 3, doorTo: 'ch5_lantern', tx: 7, ty: 11, dir: 'up', unlockFlag: 'c5_ready', lockedText: 'The Lantern door is barred from inside. White light leaks from every crack.' },
    { type: 'arch', x: 11, y: 2, w: 3, tex: 'wall_stone' },
  ],
  encounters: {
    rate: 0.5, bg: 'beach', onTiles: 's', cond: (st) => st.flags.c5_arrived && before(st),
    troops: [['c5_shore_jellies', 3], ['c5_shore_crabs', 2], ['c5_shore_mix', 2]],
  },
  signs: [{ x: 20, y: 13, text: 'LANTERNFALL — Westmost Light of Solmere.\nChalked beneath, in a soldier\'s square capitals: HARMONIZATION IN PROGRESS. KEEP TO YOUR HOMES.' }],
  npcs: [
    { id: 'tobias', name: 'Fisher Tobias', look: 'tobias', x: 19, y: 30, dir: 'down', cond: (st) => st.flags.c5_arrived && before(st), run: (s) => CH5.tobias(s) },
    { id: 'sarge', name: 'Vesper Sergeant', look: 'vesper_soldier', x: 30, y: 9, dir: 'right', cond: before, run: (s) => CH5.soldierTalk(s) },
    { id: 'vs1', name: 'Vesper Soldier', look: 'vesper_soldier', x: 31, y: 8, dir: 'down', cond: before, talk: ['...', '_(He doesn\'t look at you. He\'s looking at the sun.)_'] },
    { id: 'vs2', name: 'Vesper Soldier', look: 'vesper_soldier', x: 32, y: 8, dir: 'down', cond: before, talk: ['Move along, miss. Please.', 'That hum. Does it ever stop? It\'s in my teeth.'] },
    { id: 'hanna', name: 'Hanna', look: 'villager_3', x: 21, y: 15, wander: 1, cond: before,
      talk: ['I\'ve swept my step eleven times today, Wren.', 'Every time I look up, the sun\'s still there. Watching me sweep.'] },
    { id: 'pell', name: 'Pell', look: 'pell', x: 25, y: 18, wander: 2, cond: before, run: (s) => CH5.pell(s) },
    { id: 'mira', name: 'Mira Doyle', look: 'villager_14', x: 16, y: 16, dir: 'down', cond: before,
      talk: (s) => s.say('Mira Doyle', ['Wren! Remember me? Kindling day, right before you — Ranger! I\'ve been practicing every morning.', 'Everyone\'s acting like the world\'s ending. It\'s just a really long sunset. ...Right?']) },
    { id: 'corrin', name: 'Old Corrin', look: 'villager_17', x: 12, y: 17, dir: 'right', cond: before,
      talk: ['One Crest, one life, girl. And one sun, one sky.', 'Something up there has forgotten the rules. Eighty years, and I\'ve never seen the sky forget the rules.'] },
    { id: 'dorrit', name: 'Dorrit', look: 'villager_22', x: 27, y: 11, wander: 1, cond: before,
      talk: ['My Tamsy\'s been up all night with folk who say the hum gives them headaches.', 'She says it isn\'t a headache. She says it\'s like remembering something you never did.'] },
    { id: 'sailor', name: 'Old Sailor', look: 'villager_28', x: 26, y: 26, dir: 'down', cond: before,
      talk: ['Tide went out at noon yesterday. Hasn\'t come back.', 'You can walk to the eel rocks now. You can walk to the rocks past the eel rocks. Sea\'s holding its breath, girl. Long breath.'] },
    { id: 'brin', name: 'Acolyte Brin', look: 'acolyte', x: 27, y: 31, dir: 'down', cond: before,
      talk: (s) => s.say('Acolyte Brin', ['The Hierophant asked us to wait with the ship. He said tonight we would see the most beautiful sunset of our lives.', 'He said, "Remember it."', '...Why would he tell us to remember it?']) },
    { id: 'maela', name: 'Maela', look: 'maela', x: 38, y: 22, wander: 1, cond: before,
      talk: ['Tobias won\'t come in for supper. Says the boat needs readying. He\'s readied it four times.', 'Talk to him, Wren. He listens to Halloways. Always did.'] },
  ],
  inspect: [
    { x: 23, y: 15, text: 'The village well. WREN + ILSE + THE SEA, carved years ago. Underneath, freshly scratched, the knife marks still pale: + PIP.' },
    { x: 14, y: 12, hint: 'Garden', run: (s) => CH5.garden(s), cond: before },
  ],
  exits: [
    { x: 45, y: 15, h: 4, to: 'c5_tidecaves', tx: 1, ty: 16, dir: 'right',
      cond: (st) => st.flags.c5_stair_known && before(st),
      blocked: async (s) => {
        if (s.flag('c5_aftermath')) await s.say('Corvin', 'Wrong way, sparrow! The DOCKS!');
        else await s.say('Wren', s.flag('c5_soldiers') ? 'The tide caves... Tobias would know if there\'s another way up. Ask him first.' : 'The tide caves. Not now. Mom first.');
        await s.step('player', -1, 0);
      } },
    { x: 12, y: 2, to: 'c5_keepers_stair', tx: 17, ty: 1, dir: 'down',
      cond: (st) => st.flags.c5_bluff && before(st),
      blocked: async (s) => { await s.say('Corvin', 'No time! Down the hill!'); await s.step('player', 0, 1); } },
  ],
  triggers: [
    { id: 'c5_soldiers', x: 28, y: 9, w: 7, h: 2, once: false, cond: (st) => st.flags.c5_arrived && !st.flags.c5_soldiers, run: (s) => CH5.soldiers(s) },
    { id: 'c5_door', x: 8, y: 5, once: false, cond: (st) => st.flags.c5_bluff && !st.flags.c5_ready && !st.flags.c5_gave, run: (s) => CH5.lanternDoor(s) },
    { id: 'c5_run_hill', x: 20, y: 3, w: 8, h: 3, cond: running, run: (s) => CH5.runHill(s) },
    { id: 'c5_run_square', x: 19, y: 11, w: 10, h: 7, cond: running, run: (s) => CH5.runSquare(s) },
    { id: 'c5_run_beach', x: 20, y: 19, w: 7, h: 4, cond: running, run: (s) => CH5.runBeach(s) },
    { id: 'c5_dock', x: 21, y: 24, w: 5, h: 6, once: false, cond: running, run: (s) => CH5.dock(s) },
  ],
  onEnter: async (s) => {
    if (!s.flag('c5_arrived')) return CH5.arrival(s);
    if (s.flag('c5_gave') && !s.flag('c5_sundering')) return CH5.vespersong(s);
    if (s.flag('c5_sundering') && !s.flag('c5_aftermath')) return CH5.aftermath(s);
    if (s.flag('c5_gate_open') && !s.flag('c5_bluff') && s.state.location.y < 8) return CH5.bluff(s);
    return null;
  },
};

// ------------------------------------------------------------------ interiors
const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'town', music: 'lanternfall' };
const out = (x, y, tx, ty, w = 2) => ({ x, y, w, to: 'lf_sunset', tx, ty, dir: 'down' });

export const c5WrenHouse = {
  ...WREN, ...interior,
  id: 'c5_wren_house', name: 'Halloway House', music: 'sad',
  inspect: [
    { x: 4, y: 4, hint: 'Letter', run: (s) => CH5.letter(s) },
    { x: 7, y: 2, run: (s) => CH5.cassianLetters(s) },
    { x: 8, y: 2, text: 'Your own shelf. Every book on it washed up on the beach at some point. You used to think the sea liked you.' },
    { x: 1, y: 2, text: 'Your bed. Made. Mom made your bed. She never makes your bed.' },
    { x: 8, y: 4, hint: 'Bread box', run: (s) => CH5.breadBox(s) },
  ],
  exits: [out(4, 8, 16, 12)],
  onEnter: (s) => CH5.houseEnter(s),
};

export const c5NanaHouse = {
  ...NANA, ...interior,
  id: 'c5_nana_house', name: 'Nana Brisa\'s House',
  npcs: [{ id: 'nana', name: 'Nana Brisa', look: 'nana_brisa', x: 4, y: 3, dir: 'down', run: (s) => CH5.nana(s) }],
  inspect: [
    { x: 1, y: 2, text: 'Ilse\'s herb jars, labeled in her tiny, exact handwriting. Nana has kept every one of them dusted while she was away.' },
    { x: 5, y: 3, text: 'The kettle. Nana Brisa has had it on the boil since yesterday noon, just in case.' },
  ],
  exits: [out(4, 7, 24, 12)],
};

export const c5Inn = {
  ...INN, ...interior,
  id: 'c5_inn', name: 'The Gull\'s Rest',
  npcs: [
    { id: 'rosa', name: 'Innkeeper Rosa', look: 'villager_40', x: 6, y: 3, dir: 'down', hint: 'Rest',
      run: async (s) => { await s.say('Innkeeper Rosa', 'Wren, love! A bed and a bowl of chowder? Thirty gold. Prices went up — the sun\'s making everyone nervous.'); await s.inn(30, 'the Gull\'s Rest'); } },
    { id: 'toller', name: 'Toller', look: 'toller', x: 10, y: 6, dir: 'left', run: (s) => CH5.toller(s) },
    { id: 'inn_sailor', name: 'Sailor', look: 'villager_47', x: 2, y: 6, dir: 'right',
      talk: ['Forty years at sea, and I was never once frightened of calm water.', 'Till today.'] },
  ],
  exits: [out(5, 9, 31, 15)],
};

export const c5Store = {
  ...STORE, ...interior,
  id: 'c5_store', name: 'Marlow\'s Goods',
  npcs: [
    { id: 'marlow', name: 'Marlow', look: 'villager_51', x: 6, y: 3, dir: 'down', hint: 'Shop',
      run: async (s) => { await s.say('Marlow', 'Wren! Homecoming special: everything\'s the same price as always.'); await s.shop('c5_marlow'); } },
  ],
  exits: [out(4, 6, 10, 16)],
};

export const c5Tobias = {
  ...TOBIAS, ...interior,
  id: 'c5_tobias', name: 'Tobias\'s Shack',
  inspect: [
    { x: 5, y: 3, text: 'A crate of salted fish and a note: "MAELA — DON\'T." Below it: "I DID." Below that, newer: "TOBY — THE BOAT\'S FINE. COME IN FOR SUPPER."' },
    { x: 3, y: 2, text: 'A charcoal sketch pinned over the stove: three skinny boys in a rowboat, grinning. Someone has labeled them: EDRIN. TOBY. FEN.' },
  ],
  chests: [{ id: 'c5_tobias_chest', x: 1, y: 3, item: 'mega_tonic', count: 1 }],
  exits: [out(3, 5, 37, 21)],
};
