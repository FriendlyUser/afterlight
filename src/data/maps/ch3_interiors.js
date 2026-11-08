// Aurenne interiors (Chapter 3).
import INN from './layouts/c3_inn.js';
import SHOP from './layouts/c3_shop.js';
import CATHEDRAL from './layouts/c3_cathedral.js';
import STUDY from './layouts/c3_study.js';
import ARCHIVES from './layouts/c3_archives.js';
import TOLLIVER from './layouts/c3_tolliver.js';
import VENN from './layouts/c3_venn.js';
import ALMS from './layouts/c3_almshouse.js';
import { CH3 } from '../../story/ch3.js';
import { SIDE } from '../../story/ch3_side.js';

const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'town', music: 'aurenne' };
const toTown = (x, y, w, tx, ty) => ({ x, y, w, to: 'aurenne', tx, ty, dir: 'down' });
const after = (st) => !!st.flags.c3_mercy_down;
const pipIn = (s) => s.state.party.includes('pip');

// ------------------------------------------------------------------ The Ringing Bell
/** @type {import('../../types/data').MapDef} */
export const c3Inn = {
  ...INN, ...interior,
  id: 'c3_inn', name: 'The Ringing Bell', music: 'inn',
  npcs: [
    { id: 'marta', name: 'Marta', look: 'marta', x: 6, y: 3, dir: 'down', hint: 'Rest',
      run: async (s) => {
        if (s.flag('c3_met') && !s.flag('c3_night')) return CH3.innNight(s);
        await s.say('Marta', after(s.state)
          ? 'The little ones are scrubbing my pots. Never seen pots so clean, or children so proud of it. Bed and supper, Page? Forty gold.'
          : 'Welcome to the Ringing Bell! Bed, supper, and a bard who knows four songs. Forty gold.');
        await s.inn(40, 'the Ringing Bell');
      } },
    { id: 'lark', name: 'Lark', look: 'lark', x: 13, y: 7, dir: 'left',
      talk: async (s) => {
        await s.say('Lark', 'A song for the island folk? I know four. Three are about drinking. Here\'s the other one.');
        s.sfx('song');
        await s.narrate([
          '♪ _The festival lanterns were hung in a row, / and the Keeper\'s two children ran laughing below._ ♪',
          '♪ _Then the great light went out like a breath on a flame, / and the dark came to Aurenne and called them by name._ ♪',
          '♪ _He held up the Lantern, the Keeper so true — / and the city was saved, and a girl was lost too._ ♪',
        ]);
        await s.say('Lark', 'Not my best rhyme. The Choir doesn\'t care for it, so naturally it\'s the one everybody asks for.');
      } },
    { id: 'nim', name: 'Corporal Nim', look: 'dawnguard', x: 8, y: 6, dir: 'up',
      talk: async (s) => {
        await s.say('Corporal Nim', ['Off duty. Which means I\'m not here, and you didn\'t see me.', 'If the Lord-Commander asks, I\'m on patrol. This tankard is the patrol.']);
        if (s.state.party.includes('bram')) {
          await s.say('Corporal Nim', '...Wait. Kestrel? Venn\'s squire? Dawn, man, everyone said you went soft on some island.');
          await s.say('Bram', 'I went _salty._ It\'s different.');
        }
      } },
    { id: 'patron', name: 'Regular', look: 'villager_27', x: 2, y: 8, dir: 'right',
      talk: ['The Ringing Bell has the best stew in the city. It\'s also the only stew in the city that\'s never made anyone ill.', 'These are related facts.'] },
    { id: 'tuck_inn', name: 'Tuck', look: 'tuck', x: 6, y: 8, dir: 'up', cond: after,
      talk: (s) => s.say('Tuck', ['Marta says I can have pie if I scrub ALL the pots. I\'ve scrubbed all the pots twice.', 'Is it pie time? It feels like pie time.']) },
    { id: 'wick_inn', name: 'Wick', look: 'wick', x: 10, y: 9, dir: 'up', cond: after,
      talk: (s) => s.say('Wick', ['I don\'t remember being down there. Nell says that\'s good.', 'I can do bows now. On my shoes. Pip showed me. Double-knots are for babies.']) },
    { id: 'nell_inn', name: 'Nell', look: 'nell', x: 12, y: 5, dir: 'left', cond: after,
      talk: async (s) => {
        await s.say('Nell', 'Marta says we can stay. Dishes for beds. She doesn\'t sing, I checked.');
        if (pipIn(s)) await s.say('Nell', 'Look after him, Fish-Bird. He thinks he\'s a prince. He\'s mostly just loud.');
      } },
  ],
  inspect: [
    { x: 6, y: 2, text: 'A brass bell over the bar. A card beneath it: RING FOR SERVICE. DON\'T RING FOR FUN. WE MEAN YOU, TERRENCE.' },
    { x: 13, y: 5, text: 'A pot of stew big enough to bathe in. It smells of rosemary and something brown and comforting.' },
  ],
  exits: [toTown(6, 10, 3, 5, 21)],
  onEnter: (s) => CH3.morning(s),
};

// ------------------------------------------------------------------ Bellwright Arms & Sundries
/** @type {import('../../types/data').MapDef} */
export const c3Shop = {
  ...SHOP, ...interior,
  id: 'c3_shop', name: 'Bellwright Arms & Sundries',
  npcs: [
    { id: 'oswin', name: 'Oswin Bellwright', look: 'oswin', x: 7, y: 3, dir: 'down', hint: 'Shop',
      run: async (s) => {
        await s.say('Oswin', s.flag('c3_forks')
          ? 'The Hierophant\'s Page! Going south? You\'ll want boots, water, and something sharp. I sell two of those.'
          : 'Bellwright Arms & Sundries. Swords, salves, and the finest bell-bronze buckles in Aurenne.');
        await s.shop('aurenne');
      } },
  ],
  inspect: [
    { x: 9, y: 4, text: 'A bell-founder\'s anvil, cracked clean through. Oswin keeps it "for sentiment." There is a price tag on it anyway.' },
    { x: 1, y: 2, text: 'Ledgers going back three generations of Bellwrights. The earliest entry: ONE (1) BELL, LARGE. PAID IN GEESE.' },
  ],
  exits: [toTown(4, 7, 3, 13, 21)],
};

// ------------------------------------------------------------------ The Cathedral of Dawn
/** @type {import('../../types/data').MapDef} */
export const c3Cathedral = {
  ...CATHEDRAL, ...interior,
  id: 'c3_cathedral', name: 'The Cathedral of Dawn', mood: 'temple', music: 'kindling', particles: 'motes_gold',
  camera: { dist: 17, pitch: 0.72 },
  npcs: [
    { id: 'imre', name: 'Acolyte Imre', look: 'imre', x: 9, y: 6, dir: 'down',
      run: async (s) => {
        if (s.flag('c3_mercy_met') && !s.flag('c3_summoned')) return CH3.deliverLetter(s);
        if (s.flag('c3_condemned') && !s.flag('c3_forks')) return s.say('Imre', 'His Holiness is waiting for you in his study, Page. The left-hand door.');
        if (s.flag('c3_summoned')) return s.say('Imre', ['The Hierophant\'s study is through the left-hand door at the back. The archives, the right.', 'Brother Quill keeps the archives. He is older than some of the books and fonder of them than of people.']);
        return s.say('Imre', 'Welcome, pilgrim. The dawn-office is long over, but the light is always open.');
      } },
    { id: 'pilgrim_a', name: 'Pilgrim', look: 'villager_21', x: 13, y: 9, dir: 'up',
      talk: ['I pray for my son every day. He\'s a sailor.', 'The Choir says the sea belongs to the Gloam after dark. So I pray very loudly at dusk.'] },
    { id: 'pilgrim_b', name: 'Listening Woman', look: 'villager_44', x: 3, y: 12, dir: 'up',
      talk: ['Shh. I\'m listening for the Dawnsong. You can hear it in here, if you\'re quiet.', '...You\'re not being quiet.'] },
    { id: 'deacon', name: 'Deacon Feolan', look: 'acolyte', x: 19, y: 10, dir: 'left',
      talk: (s) => s.say('Deacon Feolan', after(s.state)
        ? ['Sister Mercy\'s name has been struck from the rolls. I struck it myself. My hand would not stop shaking.', 'Forty-one admitted. None discharged. How did none of us ever do the arithmetic?']
        : ['One Crest, one life, one light. It is carved under St. Aurel\'s feet. We say it every dawn.', 'I have said it eleven thousand times. I counted. That is my Crest, I think: Counter.']) },
  ],
  inspect: [
    { x: 11, y: 2, text: 'St. Aurel, holding up the first Lantern. Carved beneath her feet: *ONE CREST · ONE LIFE · ONE LIGHT.*' },
    { x: 5, y: 10, text: 'A pillar carved with the Seven Lanterns, from Lanternfall in the west to Skyreach above the storm. Someone has rubbed Lanternfall\'s carving smooth with their thumb, over many years.' },
  ],
  exits: [
    { x: 3, y: 1, to: 'c3_study', tx: 6, ty: 8, dir: 'up', cond: (st) => st.flags.c3_summoned,
      blocked: async (s) => { await s.say(null, 'The Hierophant\'s study. The acolyte by the altar would know if you\'re expected.', { style: 'system', portrait: false }); await s.step('player', 0, 1); } },
    { x: 19, y: 1, to: 'c3_archives', tx: 8, ty: 10, dir: 'up' },
    { x: 10, y: 20, w: 3, to: 'aurenne', tx: 21, ty: 8, dir: 'down' },
  ],
  triggers: [
    { id: 'mercy', x: 1, y: 14, w: 21, h: 2, once: false, cond: (st) => st.flags.c3_pip_joined && !st.flags.c3_mercy_met, run: (s) => CH3.meetMercy(s) },
  ],
};

// ------------------------------------------------------------------ Cassian's study
/** @type {import('../../types/data').MapDef} */
export const c3Study = {
  ...STUDY, ...interior,
  id: 'c3_study', name: 'The Hierophant\'s Study', music: 'cassian',
  inspect: [
    { x: 6, y: 1, run: async (s) => {
      await s.narrate('A painting hangs on the wall beneath a white sheet. The sheet is spotless — not a speck of dust. Someone uncovers it often.');
      await s.say('Wren', '...It\'s not ours to lift.');
    } },
    { x: 6, y: 4, run: async (s) => {
      await s.narrate('Letters, stacked neatly on the desk. The one on top is in your own handwriting: your letter about the stars, from two winters ago.');
      await s.say('Wren', 'He kept it.');
    } },
    { x: 11, y: 5, text: 'An armillary sphere of brass rings. The little golden sun that should sit at its center is missing. There is only an empty socket.' },
    { x: 2, y: 2, text: 'Treatises on the Dawnsong, scored and annotated in a fine hand. One spine has been read until it broke: *On the Inversion of Hymns.*' },
    { x: 10, y: 2, text: 'Correspondence with the Keepers, filed by Lantern. The Lanternfall folder is very thin. On top, in Ysolde\'s hand, one word: NO.' },
  ],
  exits: [{ x: 5, y: 9, w: 3, to: 'c3_cathedral', tx: 3, ty: 2, dir: 'down' }],
  onEnter: async (s) => {
    if (s.flag('c3_summoned') && !s.flag('c3_met')) return CH3.cassianMeeting(s);
    if (s.flag('c3_condemned') && !s.flag('c3_forks')) return CH3.mission(s);
    return null;
  },
};

// ------------------------------------------------------------------ The Choir archives
const page = (flag, lines) => ({ cond: (st) => !st.flags[flag], hint: 'Search', run: (s) => SIDE.page(s, flag, lines) });
/** @type {import('../../types/data').MapDef} */
export const c3Archives = {
  ...ARCHIVES, ...interior,
  id: 'c3_archives', name: 'The Choir Archives', music: 'cassian',
  npcs: [
    { id: 'quill', name: 'Brother Quill', look: 'quill', x: 8, y: 4, dir: 'down', run: (s) => SIDE.quill(s) },
    { id: 'scholar', name: 'Visiting Scholar', look: 'villager_38', x: 13, y: 9, dir: 'left',
      talk: ['Shh.', '...No, I don\'t know where the bestiaries are. I\'ve been looking for the bestiaries since spring.'] },
  ],
  blockers: [{ id: 'c3_rope', x: 13, y: 6, prop: 'fence' }],
  chests: [{ id: 'c3_ar_alcove', x: 15, y: 4, item: 'magic_fruit' }],
  inspect: [
    { x: 3, y: 8, ...page('c3_page_a', [
      'Misfiled between a hymnal and a cookbook: a loose page.',
      '"...and so the Seven Lanterns were raised along the edge of the world, that the Hearthsun might never lose its way home. Each Keeper sings her own light. The Grand Lantern of Aurenne, first and eldest, sings for the city, and for the six."',
    ]) },
    { x: 3, y: 8, text: 'A shelf of hymnals. And one cookbook, which explains the stains.' },
    { x: 12, y: 2, ...page('c3_page_b', [
      'In a locked box marked LONG NIGHT — DO NOT LEND: a single page.',
      '"At the turning of the summer festival, the Grand Lantern failed. The Gloam came into Aurenne through the dark, as water fills a footprint. Three hundred and twelve were taken before dawn."',
    ]) },
    { x: 12, y: 2, text: 'Restricted shelves: Lantern schematics, Keepers\' confessions, and one very old, very angry letter from Lanternfall.' },
    { x: 3, y: 5, run: async (s) => {
      await s.narrate('*A Lexicon of Crests*, with margin notes in four different hands, arguing about Gloamweaver. None of them agree on anything, except that it should not exist.');
      if (s.state.party.includes('sable')) await s.say('Sable', 'I exist.');
    } },
  ],
  exits: [{ x: 7, y: 11, w: 3, to: 'c3_cathedral', tx: 19, ty: 2, dir: 'down' }],
};

// ------------------------------------------------------------------ Tolliver's bell tower
/** @type {import('../../types/data').MapDef} */
export const c3Tolliver = {
  ...TOLLIVER, ...interior,
  id: 'c3_tolliver', name: 'St. Aurel\'s Bell Tower',
  npcs: [{ id: 'tolliver', name: 'Old Tolliver', look: 'tolliver', x: 4, y: 3, dir: 'down', run: (s) => SIDE.tolliver(s) }],
  inspect: [
    { x: 7, y: 4, text: 'A tuning anvil. Forty years of bells were tuned on it. There is a dent in it shaped like a word you can\'t quite read.' },
    { x: 7, y: 2, run: async (s) => {
      await s.narrate(s.flag('c3_hammer_done')
        ? 'A ledger of every noon since Tolliver began. Every entry reads RANG TRUE — except seven that read FLAT — and then, today, in large shaky letters: RANG TRUE!!!'
        : 'A ledger of every noon since Tolliver began. Every entry reads RANG TRUE. Except the last seven, which read FLAT. FLAT. FLAT. FLAT. FLAT. FLAT. FLAT.');
    } },
  ],
  exits: [toTown(3, 8, 3, 4, 31)],
};

// ------------------------------------------------------------------ The Venn house
/** @type {import('../../types/data').MapDef} */
export const c3Venn = {
  ...VENN, ...interior,
  id: 'c3_venn', name: 'Venn House',
  npcs: [{ id: 'orsolya', name: 'Dame Orsolya Venn', look: 'orsolya', x: 6, y: 3, dir: 'down', run: (s) => SIDE.orsolya(s) }],
  inspect: [
    { x: 8, y: 4, text: 'A suit of Dawnguard plate on a stand, polished to a mirror. There is a notch in the breastplate, over the heart, that has never been hammered out.' },
    { x: 4, y: 1, text: 'A portrait: a broad, laughing knight with a ridiculous moustache, and a young woman trying very hard not to laugh with him.' },
  ],
  exits: [toTown(4, 7, 3, 43, 19)],
};

// ------------------------------------------------------------------ The almshouse
/** @type {import('../../types/data').MapDef} */
export const c3Almshouse = {
  ...ALMS, ...interior,
  id: 'c3_almshouse', name: 'House of Small Mercies', music: (st) => (st.flags.c3_mercy_down ? 'sad' : 'aurenne'),
  npcs: [
    { id: 'constance', name: 'Sister Constance', look: 'constance', x: 4, y: 4, dir: 'down', run: (s) => CH3.constance(s) },
    { id: 'sleeper', name: 'Sleeper', look: 'villager_49', x: 6, y: 3, dir: 'down', cond: (st) => !st.flags.c3_mercy_down,
      talk: ['Mm. Warm. So warm.', 'They said I\'d never be cold again.'] },
    { id: 'alms_kid', name: 'Hungry Boy', look: 'villager_61', x: 9, y: 6, dir: 'left', cond: (st) => !st.flags.c3_mercy_down,
      talk: ['Sister Mercy says if I\'m good, I can go downstairs where it\'s warm.', 'I\'m being SO good.'] },
    { id: 'alms_guard', name: 'Dawnguard', look: 'dawnguard', x: 9, y: 6, dir: 'left', cond: after,
      talk: ['The Sisters stay under watch until the Lord-Commander says otherwise.', 'They keep offering me soup. I keep saying no. It\'s the longest conversation I\'ve ever had.'] },
  ],
  inspect: [
    { x: 2, y: 5, text: 'The almshouse ledger, in a neat round hand. ADMITTED: forty-one. DISCHARGED: none. Beside each name, a small mark like a closed eye.' },
    { x: 12, y: 3, run: async (s) => {
      await s.narrate('Leek and barley soup. It smells wonderful. Under the wonderful, faintly, something sweet and sleepy.');
      if (s.state.party.includes('ilse')) await s.say('Ilse', 'Poppy-milk. Enough to make a grown man very, very agreeable. Nobody eat the soup.');
    } },
  ],
  exits: [toTown(5, 9, 3, 37, 32)],
};
