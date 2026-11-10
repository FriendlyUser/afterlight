// Chapter 2 — Thistledown (village + interiors) and the East Fields below Red Tam's quarry.
import VILLAGE from './layouts/thistledown.js';
import INN from './layouts/c2_td_inn.js';
import SHOP from './layouts/c2_td_shop.js';
import SAGE from './layouts/c2_sage_house.js';
import FIELDS from './layouts/c2_td_fields.js';
import { THISTLE } from '../../story/ch2_thistle.js';
import { coachRide } from '../../story/ch2_common.js';
import { KINDLE } from '../../story/mount.js';

const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'town' };
const toVillage = (x, y, tx, ty, w = 2) => ({ x, y, w, to: 'thistledown', tx, ty, dir: 'down' });
const sageDone = (st) => !!st.flags.c2_sage_done;
const tamDone = (st) => !!st.flags.c2_tam_done;
const by = (st, lines) => (st.flags.c2_tam_done ? lines[2] : st.flags.c2_sage_done ? lines[1] : lines[0]);

/** @type {import('../../types/data').MapDef} */
export const thistledown = {
  ...VILLAGE,
  id: 'thistledown', name: 'Thistledown', region: 'The Heartland',
  mood: (st) => (st.flags.c2_tam_done ? 'dusk' : 'day'),
  music: 'town', battleBg: 'fields', treeType: 'tree_autumn', particles: 'pollen',
  backdrop: { plane: '#5a7a34', y: -0.3 },
  signs: [{ x: 20, y: 17, text: 'THISTLEDOWN — Est. by people who were tired of walking.\nInn · Trading Post · The Sage (up the hill, knock loudly, duck).' }],
  npcs: [
    { id: 'hesk', name: 'Hesk', look: 'villager_33', x: 5, y: 20, dir: 'up', hint: 'Forester',
      cond: (st) => !!st.flags.c2_mother_done, run: (s) => KINDLE.hesk(s) },
    { id: 'reeve', name: 'Reeve Alder', look: 'c2_reeve', x: 22, y: 11, dir: 'down',
      talk: (s) => s.say('Reeve Alder', by(s.state, [
        ['Old Bethan\'s up the hill, past Tobble\'s beehives. Knock loudly. Then duck.', 'And if anyone can talk sense into Red Tam, it\'s her. He\'s terrified of her. So am I.'],
        ['Bethan sent you after Tam? Of course she did. She sends everyone after something.', 'The quarry\'s north of the east fields. Corporal Fen will see you through the hedge.'],
        ['Red Tam in my root cellar! My grandmother would have died of joy. She did die, actually, but of something else.', 'Thistledown won\'t forget you. Come back for the harvest fair. Bring the tall one. He\'s good at lifting.'],
      ])) },
    { id: 'fen', name: 'Corporal Fen', look: 'c2_fen', x: 41, y: 17, dir: 'left',
      talk: (s) => s.say('Corporal Fen', by(s.state, [
        ['Thistledown militia. That\'s me. And the goose. Mostly the goose.', 'Fields are east. Quarry\'s north of the fields. Tam\'s lads shoot at anything climbing the track. Don\'t.'],
        ['Bethan\'s herb path? Pulled the hedge back myself. Far east end of the fields, then up the hill.', 'If you meet Tam — he cheats at arm-wrestling. Just so you know.'],
        ['Tam\'s locked in the Reeve\'s root cellar. The goose is on guard. The goose has never once lost a prisoner.', 'Road\'s open east. Aurenne\'s two days, if your feet are honest.'],
      ])) },
    { id: 'hester', name: 'Goodwife Hester', look: 'villager_38', x: 28, y: 15, wander: 1,
      talk: (s) => s.say('Goodwife Hester', s.flag('c2_tam_done')
        ? ['I always said Tam would come to a bad end. I said it about everyone, so I was bound to be right eventually.']
        : ['Two of those black-armored soldiers rode up to the old quarry a fortnight back. Bold as brass.', 'And they came back down again without a single bandit in chains. You tell me what that means. I know what it means. I want to hear you say it.']) },
    { id: 'poppy', name: 'Poppy', look: 'villager_45', x: 24, y: 13, wander: 2,
      talk: async (s) => {
        await s.say('Poppy', 'Are you a knight? You look like a knight.');
        await s.say('Bram', 'Squire.');
        await s.say('Poppy', 'What\'s a squire?');
        await s.say('Bram', 'A knight who\'s... still loading.');
      } },
    { id: 'dill', name: 'Dill', look: 'villager_9', x: 20, y: 15, wander: 2,
      talk: ['My sister says the Sage can turn into a bear. I asked her and she said "only on Tuesdays." It\'s Thursday. I\'m waiting.'] },
    { id: 'tobble', name: 'Old Tobble', look: 'villager_17', x: 37, y: 6, dir: 'left',
      talk: (s) => s.say('Old Tobble', s.flag('c2_tam_done')
        ? ['Bees are out again. Singing. They knew before I did — they always know.']
        : ['My bees know when trouble\'s coming. They\'ve been sulking for a month.', 'Not the bandits. Bees don\'t care about bandits. Something else. Something in the light.']) },
    { id: 'gage', name: 'Miller Gage', look: 'villager_28', x: 9, y: 15, dir: 'down',
      talk: ['Tam took my flour. Forty sacks! What does a bandit want with forty sacks of flour?', '...Bread, I suppose. Fair enough. Still.'] },
    { id: 'bryony', name: 'Sister Bryony', look: 'acolyte', x: 19, y: 13, dir: 'down',
      talk: (s) => s.say('Sister Bryony', [
        'The Cathedral has recalled every acolyte in the heartland for "the harmonizing of the Lanterns". I\'ve never heard of it before. Nobody has.',
        'But the Hierophant says something wonderful is coming. A dawn like no other. I believe him. I\'ve always believed him.',
        s.flag('crestArtLearned') ? '...You\'ve been up to see the heretic, haven\'t you? I can tell. You have that look. That _awake_ look.' : 'Dawn\'s blessing on your road.',
      ]) },
    { id: 'corley', name: 'Nan Corley', look: 'villager_54', x: 31, y: 16, dir: 'left',
      talk: (s) => s.say('Nan Corley', s.flag('crestArtLearned')
        ? ['Bethan taught you, then? ...Forty years I\'ve been a Vanguard who weaves. Maybe I\'ll go up the hill tomorrow.', 'Or the day after. Or... tomorrow. Yes. Tomorrow.']
        : ['Vanguard, the light said. I weave. Forty years, I weave. Bethan says it\'s never too late.', 'Bethan\'s mad. ...I think about it, though.']) },
    { id: 'td_coach', name: 'Bellamy', look: 'villager_12', x: 4, y: 16, dir: 'down', hint: 'Ride',
      run: (s) => coachRide(s, 'thistledown') },
  ],
  inspect: [
    { x: 23, y: 15, text: 'The village well. A bucket on a chain, and a smell of cold stone and moss. Someone has carved "TAM WAS HERE" on the rim. Someone else has carved "WE KNOW, TAM" underneath.' },
    { x: 36, y: 5, text: 'Beehives, humming. One bee lands on your hand, considers you thoroughly, and leaves unimpressed.' },
  ],
  exits: [
    { x: 0, y: 17, h: 3, to: 'c2_wold_heart', tx: 42, ty: 7, dir: 'left' },
    { x: 45, y: 17, h: 3, to: 'c2_td_fields', tx: 1, ty: 16, dir: 'right' },
  ],
  onEnter: async (s) => {
    await THISTLE.arrive(s);
    await THISTLE.celebration(s);
  },
};

/** @type {import('../../types/data').MapDef} */
export const tdInn = {
  ...INN, ...interior,
  id: 'c2_td_inn', name: 'The Sleepy Thistle', music: 'town',
  npcs: [
    { id: 'ros', name: 'Ros Thatch', look: 'villager_40', x: 6, y: 3, dir: 'down', hint: 'Rest',
      run: async (s) => {
        await s.say('Ros Thatch', 'Beds are straw, pillows are feathers, soup is mostly turnip. Forty gold. Breakfast is whatever the cat didn\'t eat.');
        await s.inn(40, 'the Sleepy Thistle');
      } },
    { id: 'farmhand', name: 'Farmhand Wat', look: 'villager_47', x: 9, y: 7, dir: 'left',
      talk: ['Old Strawman moved. In the north-east field. I saw it. I SAW it.', 'Dunstan says I was drunk. I _was_ drunk. It still moved.'] },
    { id: 'traveler', name: 'Weary Traveler', look: 'villager_24', x: 3, y: 6, dir: 'right',
      talk: (s) => s.say('Weary Traveler', s.flag('c2_tam_done')
        ? ['Road\'s open? Truly? Then I\'m off to Aurenne at dawn. My daughter\'s getting her Kindling at the Cathedral. She wants to be a Cantor.', 'I told her the light decides. ...Maybe I\'ll tell her something else.']
        : ['Stuck here a fortnight. Tam\'s lads took my cart, my mule, and my hat. Who takes a man\'s hat?']) },
  ],
  exits: [toVillage(6, 9, 15, 13, 1)],
};

/** @type {import('../../types/data').MapDef} */
export const tdShop = {
  ...SHOP, ...interior,
  id: 'c2_td_shop', name: 'Thistledown Trading Post', music: 'town',
  npcs: [
    { id: 'pedrick', name: 'Pedrick', look: 'villager_51', x: 6, y: 3, dir: 'left', hint: 'Shop',
      run: async (s) => {
        await s.say('Pedrick', s.flag('crestArtLearned')
          ? 'Crest Stones! Bethan sent you, didn\'t she. Six hundred apiece — they\'re old Lantern-glass, mind. Each one remembers a calling.'
          : 'Welcome, welcome. Seeds, salves, rope. And those pretty stones on the top shelf — don\'t mind them, nobody buys those. Unless Bethan sends them.');
        await s.shop('thistledown');
      } },
  ],
  exits: [toVillage(4, 6, 30, 13)],
};

/** @type {import('../../types/data').MapDef} */
export const sageHouse = {
  ...SAGE, ...interior,
  id: 'c2_sage_house', name: 'The Sage\'s Cottage', music: (st) => (st.flags.c2_sage_done ? 'town' : 'lanternfall'),
  npcs: [{ id: 'bethan', name: 'Bethan', look: 'sage', x: 7, y: 3, dir: 'left', run: (s) => THISTLE.sage(s) }],
  inspect: [
    { x: 1, y: 2, text: 'Books the Choir tried to burn. Some of them are singed at the edges. One is titled _On the Braiding of Callings, and Why the Cathedral Is Wrong About Everything_.' },
    { x: 2, y: 2, text: 'A notebook of names and Crests, in a hundred different inks. The oldest pages are dated sixty years ago. Near the middle, a single line: "C. — the Keeper\'s boy. Mender, Arcanist, Cantor, Warden. Wants more. Too much more."' },
    { x: 6, y: 2, text: 'A cauldron of something that smells of mint, honey and righteous indignation.' },
  ],
  exits: [{ x: 4, y: 8, w: 2, to: 'thistledown', tx: 41, ty: 6, dir: 'down' }],
};

/** @type {import('../../types/data').MapDef} */
export const tdFields = {
  ...FIELDS,
  id: 'c2_td_fields', name: 'The East Fields', region: 'Thistledown',
  mood: (st) => (st.flags.c2_tam_done ? 'dusk' : 'day'),
  music: 'field', battleBg: 'fields', treeType: 'tree_autumn', particles: 'pollen',
  backdrop: { plane: '#7a6a34', y: -0.3 },
  encounters: {
    rate: 0.9, bg: 'fields', onTiles: 'kd":',
    troops: [['td_boars', 3], ['td_crows', 3], ['td_mix', 1], ['gw_bandits', 2]],
  },
  signs: [{ x: 30, y: 17, text: 'EAST — AURENNE, 2 days.\nNORTH — THE OLD QUARRY (CLOSED. BY ORDER OF RED TAM. SIGNED, RED TAM.)\nWEST — THISTLEDOWN.' }],
  npcs: [
    { id: 'dunstan', name: 'Farmer Dunstan', look: 'villager_20', x: 10, y: 10, dir: 'down', run: (s) => THISTLE.farmer(s) },
    { id: 'sc1', name: 'Scarecrow', look: 'c2_scarecrow', x: 13, y: 22, dir: 'down', cond: (st) => !st.flags.c2_scare_1, run: (s) => THISTLE.scarecrow(s, 'sc1', 1) },
    { id: 'sc2', name: 'Scarecrow', look: 'c2_scarecrow', x: 29, y: 22, dir: 'down', cond: (st) => !st.flags.c2_scare_2, run: (s) => THISTLE.scarecrow(s, 'sc2', 2) },
    { id: 'sc3', name: 'Old Strawman', look: 'c2_strawman', x: 35, y: 10, dir: 'down', cond: (st) => !st.flags.c2_scare_3, run: (s) => THISTLE.scarecrow(s, 'sc3', 3) },
    { id: 'pk1', name: 'Bandit', look: 'bandit', x: 44, y: 7, dir: 'down', cond: (st) => !tamDone(st) },
    { id: 'pk2', name: 'Bandit', look: 'bandit', x: 45, y: 7, dir: 'down', cond: (st) => !tamDone(st) },
  ],
  chests: [
    { id: 'tf_meadow', x: 20, y: 6, item: 'iron_helm' },
    { id: 'tf_orchard', x: 49, y: 10, item: 'leather_jerkin' },
    { id: 'tf_corner', x: 54, y: 26, item: 'ether', count: 2 },
  ],
  blockers: [
    { id: 'hedge', x: 51, y: 13, w: 3, h: 1, prop: 'bush', cond: (st) => !sageDone(st) },
    { id: 'barricade', x: 55, y: 14, w: 1, h: 3, prop: 'crate', cond: (st) => !tamDone(st) },
  ],
  inspect: [
    { x: 52, y: 13, hint: 'Hedge', run: (s) => THISTLE.hedge(s), cond: (st) => !sageDone(st) },
    { x: 55, y: 15, text: 'A barricade of stolen crates, barrels and one very surprised-looking hay cart. Painted on it: AURENNE ROAD — TOLL — ASK FOR TAM.', cond: (st) => !tamDone(st) },
    { x: 7, y: 11, text: 'The Pell well. A rope, a bucket, and three generations of initials carved round the rim. The newest just says: SORRY ABOUT THE SCARECROWS.' },
  ],
  exits: [
    { x: 0, y: 15, h: 3, to: 'thistledown', tx: 44, ty: 18, dir: 'left' },
    { x: 42, y: 1, w: 6, to: 'c2_quarry', tx: 23, ty: 39, dir: 'up' },
  ],
  triggers: [
    { id: 'picket', x: 44, y: 9, w: 2, h: 1, once: false, cond: (st) => !tamDone(st), run: (s) => THISTLE.picket(s) },
    { id: 'finale', x: 54, y: 14, w: 1, h: 3, once: false, cond: (st) => tamDone(st) && !st.flags.c2_done, run: (s) => THISTLE.finale(s) },
  ],
};
