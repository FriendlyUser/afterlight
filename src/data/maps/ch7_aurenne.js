// Chapter 7 — the ruins of Aurenne, the Ember Ward, and the Last Bell.
import L from './layouts/ruined_aurenne.js';
import WARD from './layouts/c7_ember_ward.js';
import BELL from './layouts/c7_last_bell.js';
import { CH7 } from '../../story/ch7.js';

const joined = (st) => st.party.includes('ilse');
const say = (name, lines) => async (s) => s.say(name, lines);

/** @type {import('../../types/data').MapDef} */
export const ruinedAurenne = {
  ...L,
  id: 'ruined_aurenne', name: 'Ruins of Aurenne', region: 'The City of Bells',
  mood: (st) => (st.flags.c7_night ? 'night' : 'ruin'),
  music: (st) => (st.flags.c7_bell_rung ? 'aurenne' : 'ruin'),
  particles: 'ash',
  backdrop: { plane: '#1a0e24', y: -14 },
  battleBg: 'ruin',
  camera: { dist: 21, pitch: 0.7 },
  signs: [{ x: 24, y: 17, text: 'ASH SQUARE NOTICES\n· Water: one bucket per family. Ask Sorrel.\n· Violet under the skin? The Ember Ward. NOW.\n· The Undercroft is SEALED. — S.\n· BOUNTY: the thing in the Reliquary. See Sorrel.' }],
  npcs: [
    { id: 'sorrel', name: 'Sorrel', look: 'sorrel', x: 19, y: 33, dir: 'down', run: (s) => CH7.sorrel(s) },
    { id: 'hobb', name: 'Quartermaster Hobb', look: 'c7_hobb', x: 17, y: 22, dir: 'down', hint: 'Shop',
      run: async (s) => {
        await s.say('Quartermaster Hobb', s.flag('c7_returned')
          ? 'Ward supply\'s open, and for once it\'s got supplies. The Ward Mother\'s friends pay what it costs. That\'s the friend discount.'
          : 'Ward supply. Everything costs more than it\'s worth, because everything\'s worth more than it costs. Don\'t think about it too hard.');
        await s.shop('ember_ward');
      } },
    { id: 'fenna', name: 'Fenna', look: 'fenna', x: 27, y: 20, dir: 'left', run: (s) => CH7.fenna(s) },
    { id: 'osric', name: 'Osric', look: 'osric', x: 7, y: 12, dir: 'up', run: (s) => CH7.osric(s) },
    { id: 'petra', name: 'Petra', look: 'petra', x: 22, y: 18, wander: 2, run: (s) => CH7.petra(s) },
    { id: 'hollis', name: 'Hollis', look: 'hollis', x: 8, y: 33, dir: 'down', run: (s) => CH7.hollis(s) },
    { id: 'gant', name: 'Mother Gant', look: 'c7_gant', x: 19, y: 23, dir: 'down',
      talk: (s) => s.say('Mother Gant', s.flag('c7_returned')
        ? ['Soup\'s got salt in it today. Real salt! Somebody\'s been generous with somebody.', 'Eat, girl. You\'ve the look of someone who forgets.']
        : ['Ash soup. Ash bread. Ash, if you\'re still hungry after.', 'Don\'t make that face. It\'s warm, and warm is the only flavor that matters now.']) },
    { id: 'dimmy', name: 'Dimmy', look: 'c7_dimmy', x: 21, y: 20, wander: 1,
      talk: (s) => s.say('Dimmy', s.flag('c7_bell_rung')
        ? ['Did you HEAR it? It went BONNNG. Osric says he\'ll teach me to ring it when my arms are long enough.', 'My arms are growing. I checked this morning.']
        : ['I\'m playing bells. _Tonk. Tonk._ That\'s a tin can, but you have to pretend.', 'Mum says the real bells were so loud you couldn\'t hear yourself think. I think a lot. I\'d like a break.']) },
    { id: 'fell', name: 'Brother Fell', look: 'c7_fell', x: 27, y: 8, dir: 'left',
      talk: async (s) => {
        await s.say('Brother Fell', ['I was an acolyte. Third Choir, tenor. I wore white.', 'I sang the Vespersong that night. Not in the Lantern — just in the nave, with three hundred others. We didn\'t know. We thought it was a hymn for a long summer.']);
        await s.say('Brother Fell', 'I burned my robes. People here know anyway. They let me carry water. I think that\'s worse than if they spat.');
        await s.think('Wren', 'I know exactly what he means.');
      } },
    { id: 'vance', name: 'Vance', look: 'dawnguard', x: 14, y: 13, dir: 'right',
      talk: async (s) => {
        await s.say('Vance', ['Dawnguard. Was. Garrick\'s lot went up to the Noon Spire with the Hierophant. The rest of us took off our tabards and learned to dig latrines.']);
        if (s.flag('c7_met_ilse')) {
          await s.say('Vance', 'Kestrel? Bram Kestrel? The squire who froze at his trial? Ha — I knew him. Big lad. Good lad, for a coward.');
          await s.say('Vance', 'Heard he\'s swinging a sword for a scrap baron up at Kiteholm now. Heard he drinks. Can\'t say I blame him.');
        }
      } },
    { id: 'ada', name: 'Ada', look: 'villager_22', x: 25, y: 23, dir: 'right',
      talk: say('Ada', ['Jory wants to go to Kiteholm. "There\'s wind up there," he says. "Wind means weather. Weather means maybe a morning."', 'I told him there are no mornings anymore. He said that\'s what everybody said about the bells.']) },
    { id: 'jory', name: 'Jory', look: 'villager_17', x: 26, y: 23, dir: 'left',
      talk: say('Jory', ['Ada thinks I\'m a dreamer. Ada married a dreamer. Ada should\'ve read the label.', 'If the Ward Mother can make medicine out of a flooded hole, I can find a morning on a kite.']) },
    { id: 'lin', name: 'Watcher Lin', look: 'villager_36', x: 41, y: 29, dir: 'right',
      talk: say('Watcher Lin', ['My husband was on the far side of the bridge when the city broke away.', 'I come every evening. It\'s always evening. So I\'m always here.']) },
    { id: 'toll', name: 'Granny Toll', look: 'c7_toll', x: 24, y: 22, dir: 'left',
      talk: (s) => s.say('Granny Toll', s.flag('c7_ilse_joined')
        ? ['Our Ward Mother, going below? With _you_?', 'Then you\'d better bring her back, or there\'s an old woman in Ash Square who will learn to swing a poker.']
        : ['Come sit by the fire, girl. I tell the children stories so they don\'t ask questions.', 'Once upon a time, the sun came up every morning. They don\'t believe me. Neither do I, some days.']) },
    { id: 'bex', name: 'Orderly Bex', look: 'c7_orderly', x: 34, y: 19, wander: 2,
      talk: say('Orderly Bex', ['Overflow cots. When the hall fills, the Ward comes outside. When the outside fills, we stop counting.', 'The Ward Mother hasn\'t slept a whole night since she got here. I\'ve checked. I sleep across her door.']) },
    { id: 'rook', name: 'Old Rook', look: 'c7_patient', x: 32, y: 19, dir: 'down',
      talk: (s) => s.say('Old Rook', s.flag('c7_returned')
        ? ['Sunsalt. Tastes like licking a hot coin. Best thing I\'ve had in my mouth in a year, and I was married forty.']
        : ['I\'m on the outside cots. That means I\'m getting better. Or worse. Nobody says which.']) },
  ],
  inspect: [
    { x: 23, y: 6, hint: 'The Lantern', run: (s) => CH7.lanternBase(s) },
    { x: 22, y: 6, hint: 'The Lantern', run: (s) => CH7.lanternBase(s) },
    { x: 24, y: 6, hint: 'The Lantern', run: (s) => CH7.lanternBase(s) },
    { x: 20, y: 19, hint: 'Well', run: (s) => CH7.well(s) },
    { x: 7, y: 19, hint: 'Rubble', cond: (st) => !st.flags.c7_stair_open, run: (s) => CH7.gateRubble(s) },
    { x: 8, y: 19, hint: 'Rubble', cond: (st) => !st.flags.c7_stair_open, run: (s) => CH7.gateRubble(s) },
    { x: 5, y: 11, text: 'The Bellwrights\' Tenor tower, snapped off at the shoulder. Up in the ruined belfry, one great bell still hangs. It has no clapper. It sways in the ember-wind without a sound.' },
    { x: 17, y: 6, text: 'Saint Aurel the Tuner, patron of the Choir. Someone has knocked off her head and set a cooking pot in its place. It\'s a good pot.' },
    { x: 29, y: 6, text: 'Saint Lumen, holding up a lantern of stone. Underneath, scratched into the plinth: HE SAID IT WOULD BE NOON FOREVER.' },
    { x: 9, y: 34, text: 'Driftwood markers with names chalked on them. Some have little things left on top: a spoon, a ribbon, a single boot.', cond: (st) => !st.flags.c7_seeds_done },
    { x: 9, y: 34, text: 'Driftwood markers with names chalked on them — and around every one, a ring of tiny gold-green shoots pushing up through the ash. Dawnmoss.', cond: (st) => st.flags.c7_seeds_done },
    { x: 43, y: 29, text: 'The east bridge ends in nothing. Far, far below, through the violet haze, something glitters — another shard, maybe. Maybe a whole country, falling slower than you.' },
    { x: 15, y: 31, text: 'A doorframe with no house behind it. Somebody has hung a wreath of wire and rag flowers on it, and swept the step.' },
    { x: 18, y: 24, text: 'The common soup pot. It smells of ash and onion and, faintly, of hope. Mostly ash.' },
  ],
  exits: [
    { x: 17, y: 43, w: 7, to: '@world' },
    { x: 7, y: 18, w: 2, to: 'ch7_drowned_undercroft', tx: 23, ty: 37, dir: 'up', cond: (st) => st.flags.c7_stair_open },
  ],
  blockers: [
    { id: 'c7_rubble', x: 7, y: 19, w: 2, h: 1, prop: 'rock' },
  ],
  triggers: [
    { id: 'c7_stair', x: 4, y: 20, w: 8, h: 7, once: false, cond: (st) => st.flags.c7_ilse_joined && !st.flags.c7_stair_open, run: (s) => CH7.stairOpen(s) },
  ],
  onEnter: async (s) => {
    await CH7.opening(s);
    await CH7.thaw(s);
  },
};

// ---------------------------------------------------------------------------

const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'ruin' };

/** @type {import('../../types/data').MapDef} */
export const emberWard = {
  ...WARD, ...interior,
  id: 'c7_ember_ward', name: 'The Ember Ward',
  music: 'sad',
  npcs: [
    { id: 'ilse', name: 'Ilse', look: 'ilse_ruin', x: 10, y: 3, dir: 'up', noTurn: true, cond: (st) => !st.flags.c7_ilse_joined, run: (s) => CH7.ilseTalk(s) },
    { id: 'noll', name: 'Noll', look: 'noll', x: 7, y: 7, dir: 'down', run: (s) => CH7.noll(s) },
    { id: 'pell', name: 'Pell', look: 'c7_pell', x: 5, y: 4, dir: 'down',
      talk: (s) => s.say('Pell', s.flag('c7_returned')
        ? ['When I\'m better, I\'m going to be a Vanguard. Like Wren.', 'Ilse says I can be anything. She said it like she was cross about it.']
        : ['...Wren? You\'re real? I thought the rot was making me see things again.', 'Everybody from home is gone except me and Ilse. Ilse says that makes us family. She says it angry, but I think she means it.']) },
    { id: 'aurel', name: 'Old Aurel', look: 'aurel', x: 14, y: 7, dir: 'down', run: (s) => CH7.aurel(s) },
    { id: 'bette', name: 'Bette', look: 'c7_bette', x: 16, y: 4, dir: 'down', run: (s) => CH7.bette(s) },
    { id: 'bette_mum', name: 'Bette\'s Mother', look: 'villager_42', x: 15, y: 4, dir: 'right',
      talk: say('Bette\'s Mother', ['She\'s doing better. The Ward Mother sat with her all last night. She sits with everyone, one night each, in turn.', 'I don\'t know when she sleeps. I don\'t think she knows either.']) },
    { id: 'rafe', name: 'Rafe', look: 'c7_patient', x: 3, y: 7, dir: 'down',
      talk: (s) => s.say('Rafe', s.flag('c7_returned')
        ? ['My hand\'s pink again. Pink! I\'ve never been so happy to look like a boiled ham.']
        : ['Cut my hand on a scrap of the old Cathedral. A _holy_ scrap. Didn\'t help.', 'Ward Mother says the violet\'s stopped at my wrist. She says it like a promise. She doesn\'t make promises.']) },
    { id: 'sallow', name: 'Widow Sallow', look: 'c7_patient_b', x: 17, y: 7, dir: 'down',
      talk: say('Widow Sallow', ['That girl with the bun? Ilse? She held my hand while my Tam went. Didn\'t say anything. Didn\'t need to.', 'You\'re the one she won\'t look at. I\'ve been watching. Whatever you did, girl — she still knows exactly where you\'re standing, every second.']) },
  ],
  inspect: [
    { x: 0, y: 8, hint: 'The wall', run: (s) => CH7.wallOfNames(s) },
    { x: 9, y: 2, text: 'A cauldron of boiling bandages. Ilse\'s labels on every jar nearby, in the same tiny, exact handwriting you remember. One says: DO NOT. EVER. — I.M.' },
    { x: 10, y: 2, text: 'Shelves of empty phial-racks. Someone has counted them in chalk: 2. Then the 2 is crossed out: 1.', cond: (st) => !st.flags.c7_returned },
    { x: 10, y: 2, text: 'Shelves stacked with sunsalt phials, glowing like coals. Someone has written a new number in chalk, and underlined it twice.', cond: (st) => st.flags.c7_returned },
  ],
  exits: [{ x: 9, y: 11, w: 2, to: 'ruined_aurenne', tx: 36, ty: 16, dir: 'down' }],
  onEnter: async (s) => {
    await CH7.wardFirst(s);
    await CH7.returnWard(s);
  },
};

/** @type {import('../../types/data').MapDef} */
export const lastBell = {
  ...BELL, ...interior,
  id: 'c7_last_bell', name: 'The Last Bell',
  music: (st) => (st.flags.c7_bell_rung ? 'inn' : 'ruin'),
  npcs: [
    { id: 'marguerite', name: 'Marguerite', look: 'c7_marguerite', x: 7, y: 3, dir: 'down', hint: 'Rest',
      run: async (s) => {
        await s.say('Marguerite', joined(s.state)
          ? 'The Ward Mother? In _my_ chapel? Sit, sit. I\'ll not take her coin. Yours, though.'
          : 'A pew to sleep on and a bowl of something hot. Hundred and twenty. We used to be a chapel; now we\'re a mercy with a bar.');
        await s.inn(120, 'the Last Bell');
      } },
    { id: 'brannoc', name: 'Brannoc', look: 'villager_28', x: 2, y: 6, dir: 'right',
      talk: say('Brannoc', ['I cast bells. Forty years. Every bell in this city, I could tell you its voice blindfolded.', 'Now I cast spoons. Spoons don\'t sing. But you can\'t eat soup with a bell, can you? Can you. I\'ve tried.']) },
    { id: 'cardA', name: 'Card Player', look: 'villager_47', x: 9, y: 6, dir: 'right',
      talk: say('Card Player', ['There\'s a sellsword at Kiteholm loses every hand on purpose so the orphans can eat. Or he\'s just that bad.', 'Either way, I\'d like to play him.']) },
    { id: 'cardB', name: 'Card Player', look: 'villager_51', x: 11, y: 6, dir: 'left',
      talk: say('Card Player', ['Shh. I\'m bluffing. I\'ve been bluffing for a year. About everything.']) },
  ],
  inspect: [
    { x: 11, y: 7, text: 'A broken pillar from the old chapel. Someone has carved a tally of every day since the Sundering. The count stopped at 300 and started over at 1, in a different hand.' },
  ],
  exits: [{ x: 5, y: 9, w: 3, to: 'ruined_aurenne', tx: 36, ty: 28, dir: 'down' }],
};
