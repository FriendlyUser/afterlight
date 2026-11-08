// Chapter 2 — Port Gale, the harbor town of the Gale Coast, and its interiors.
import PG from './layouts/port_gale.js';
import INN from './layouts/c2_pg_inn.js';
import SHOP from './layouts/c2_pg_shop.js';
import ODILE from './layouts/c2_pg_odile.js';
import { PORT, STEALTH_GUARDS } from '../../story/ch2_port.js';
import { coachRide } from '../../story/ch2_common.js';

const searching = (st) => st.flags.c2_arrived && !st.flags.c2_stealth_done;
const calm = (st) => !!st.flags.c2_stealth_done;
const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'town' };
const toTown = (x, y, tx, ty, w = 2) => ({ x, y, w, to: 'port_gale', tx, ty, dir: 'down' });

/** Tiles each soldier can see while the harbor is being searched. */
const SIGHTLINES = [
  { guard: 'pg_g1', x: 14, y: 16, w: 5, h: 3 },
  { guard: 'pg_g2', x: 22, y: 14, w: 5, h: 4 },
  { guard: 'pg_g3', x: 15, y: 11, w: 3, h: 5 },
  { guard: 'pg_g4', x: 32, y: 9, w: 5, h: 3 },
];

/** @type {import('../../types/data').MapDef} */
export const portGale = {
  ...PG,
  id: 'port_gale', name: 'Port Gale', region: 'The Gale Coast',
  mood: 'day',
  music: (st) => (searching(st) ? 'tension' : 'town'),
  backdrop: 'ocean', battleBg: 'town', particles: 'pollen',
  signs: [
    { x: 27, y: 8, text: 'BY ORDER OF THE LORD-COMMANDER: any person sheltering a girl of about sixteen years, black hair, pale complexion, is to report to the Dawnguard. REWARD.\n\nBelow it: LOST — GINGER CAT. ANSWERS TO "ADMIRAL". (DOES NOT ANSWER.) — Bettany, Fish Market.' },
    { x: 19, y: 15, text: 'PORT GALE — Harbor of the Gale Coast.\nEast: the Coast Road, the Whisperwold, Thistledown and Aurenne.' },
  ],
  npcs: [
    // --- during the search
    ...STEALTH_GUARDS.map((g) => ({ ...g, name: 'Thorne\'s Own', look: 'vesper_soldier', cond: searching })),
    { id: 'pg_harrow_s', name: 'Harrow', look: 'harrow', x: 30, y: 14, dir: 'right', cond: searching },
    { id: 'osric_s', name: 'Old Osric', look: 'osric', x: 12, y: 16, dir: 'down', cond: searching, run: (s) => PORT.osricHint(s) },
    // --- the town at peace
    { id: 'osric', name: 'Old Osric', look: 'osric', x: 13, y: 17, dir: 'down', cond: calm, run: (s) => PORT.osric(s) },
    { id: 'bettany', name: 'Bettany', look: 'villager_36', x: 30, y: 14, dir: 'down', cond: calm, run: (s) => PORT.bettany(s) },
    { id: 'quill', name: 'Harbormaster Quill', look: 'villager_17', x: 34, y: 21, dir: 'down', cond: calm,
      talk: (s) => s.say('Harbormaster Quill', [
        'Black-sailed cutter tied up at my pier four days ago. No harbor fee. No manifest. "Dawnguard business."',
        'I\'ve been harbormaster thirty years. Dawnguard business used to mean pirates. Now it means asking old men about girls.',
        s.flag('c2_tam_done') ? 'Word is the cutter\'s sailed for Aurenne. In a hurry. Good riddance to it.' : 'If you\'re going east, the road\'s rough past the Whisperwold. Bandits. Red Tam\'s lot.',
      ]) },
    { id: 'rook', name: 'Rook', look: 'villager_28', x: 5, y: 17, wander: 1, cond: calm,
      talk: ['Did you see \'em? The black-trim lot? Tipped over every crate on the quay looking for one girl.', 'One girl! I\'ve lost whole cargoes and nobody sent a soldier for _them_.'] },
    { id: 'anselm', name: 'Brother Anselm', look: 'acolyte', x: 35, y: 8, dir: 'down', cond: calm,
      talk: (s) => s.say('Brother Anselm', [
        'Dawn\'s blessing on you, travelers. The shrine is closed, I\'m afraid — the Cathedral has recalled all the lamp-oil for "the harmonizing". Whatever that is.',
        'The Hierophant himself has gone west, they say. To the edge of the world. He is a good man. The best of us.',
        s.has('cassian_letter') ? '...Is that his seal? On your letter? Oh, my. Oh, my. Then you are in good hands, child. The very best.' : 'Go with the light.',
      ]) },
    { id: 'corisande', name: 'Madame Corisande', look: 'villager_40', x: 27, y: 11, dir: 'left', cond: calm,
      talk: ['Silks from Aurenne, dear. Finest in Solmere. Not that anyone there buys silk any more.', 'The city\'s gone strange. Bells ringing at odd hours. Beggars vanishing from the Undercroft — whole families, gone in a night. The Choir says they\'ve "moved to the country".', 'I\'ve been to the country. It\'s not that big.'] },
    { id: 'wenna', name: 'Wenna', look: 'villager_22', x: 11, y: 7, dir: 'down', cond: calm,
      talk: (s) => s.say('Wenna', [
        'Mind the smoke. I\'m a baker. Well. I bake. My Crest says Arcanist.',
        'Every loaf I make catches fire. The Choir says I\'m "fighting my calling". I say I\'m making toast.',
        s.flag('crestArtLearned') ? '...A woman in Thistledown who teaches you to _change_ your Crest? Don\'t tease me. That\'s cruel.' : 'One Crest, one life. I\'ll be a very warm baker forever.',
      ]) },
    { id: 'pim', name: 'Pim', look: 'villager_9', x: 21, y: 9, wander: 2, cond: calm,
      talk: ['I\'m Dawnguard and Tansy\'s the Gloam-beast. Then we swap.', 'The real Dawnguard didn\'t want to play. One of them shouted at me. I\'m not Dawnguard any more. I\'m a pirate now.'] },
    { id: 'tansy', name: 'Tansy', look: 'villager_45', x: 26, y: 10, wander: 2, cond: calm,
      talk: (s) => s.say('Tansy', s.flag('c2_cat_done') ? ['The Admiral\'s back! He scratched Pim. It was the best day.'] : ['Have you seen the Admiral? He\'s ginger. He\'s Bettany\'s. He hates me. I love him.']) },
    { id: 'fitch', name: 'Fitch', look: 'villager_51', x: 39, y: 12, dir: 'left', cond: calm,
      talk: ['Psst. Rumors, half a silver each. No? Fine, free sample.', 'Red Tam\'s gang has the Aurenne road sewn up tight. Something purple coming out of that quarry of his, too. Sells it by the sack.', 'And the Whisperwold\'s talking louder this year. Louder than I\'ve ever heard it. Make of that what you like. I make nothing of it. I\'m in commerce.'] },
    { id: 'hobb', name: 'Sergeant Hobb', look: 'dawnguard', x: 45, y: 11, dir: 'left', cond: calm,
      talk: ['Port Gale Watch. Sergeant Hobb. Thirty years keeping the peace in this town and some lieutenant from Aurenne tells me to "close the shops".', 'Coast road\'s east, through the gate. If you see any black-trim soldiers on it, I didn\'t say this, but: go round.'] },
    { id: 'nell', name: 'Deckhand Nell', look: 'villager_31', x: 10, y: 25, dir: 'down', cond: calm,
      talk: ['Waiting on the wind. The _Kestrel\'s Folly_ sails for Saltglass when the wind turns.', 'Been waiting nine days. The wind\'s very stubborn this year. Like it\'s holding its breath.'] },
    { id: 'prue', name: 'Auntie Prue', look: 'villager_54', x: 42, y: 20, dir: 'down', cond: calm,
      talk: ['I feed the gulls. They don\'t thank me. Gulls never thank you. That\'s why I like them. No obligations.', 'That one\'s Captain. That one\'s Other Captain. That one\'s a pigeon who thinks he\'s a gull. We don\'t tell him.'] },
    { id: 'pg_coach', name: 'Bellamy', look: 'villager_12', x: 42, y: 9, dir: 'down', cond: (st) => calm(st) && st.flags.c2_td_arrived, hint: 'Ride',
      run: (s) => coachRide(s, 'port_gale') },
  ],
  inspect: [
    { x: 12, y: 22, hint: 'Mooring post', run: (s) => PORT.mooringPost(s) },
    { x: 8, y: 12, hint: 'Barrel', run: (s) => PORT.catSpot(s) },
    { x: 24, y: 11, text: 'A bronze gull spouting water. Someone has knitted it a tiny hat.' },
    { x: 16, y: 5, text: 'An old well behind the inn. A bucket, a rope, and a great many wishes at the bottom, some of them probably about cider.' },
    { x: 33, y: 14, text: 'A sack of salted herring. The sack has teeth marks in it. The teeth marks are ginger.' },
  ],
  exits: [
    { x: 47, y: 9, h: 3, to: 'c2_gale_road', tx: 1, ty: 14, dir: 'right', cond: calm,
      blocked: async (s) => { await s.say('Ilse', 'Soldiers on the gate. Not with Sable. The inn, Wren — get to an inn.'); await s.step('player', -1, 0); } },
  ],
  triggers: [
    ...SIGHTLINES.map((t) => ({ id: `sight_${t.guard}`, x: t.x, y: t.y, w: t.w, h: t.h, once: false, cond: searching, run: (s) => PORT.caught(s, t.guard) })),
    { id: 'kitchen', x: 18, y: 3, w: 2, h: 7, once: false, cond: searching, run: (s) => PORT.kitchenDoor(s) },
  ],
  onEnter: async (s) => {
    if (!s.flag('c2_arrived')) {
      await PORT.arrival(s);
      // The soldiers took their posts while we talked (NPC conditions only apply on map load).
      for (const g of STEALTH_GUARDS) { s.remove(g.id); s.spawn(g.id, 'vesper_soldier', g.x, g.y, g.dir); }
      s.spawn('pg_harrow_s', 'harrow', 30, 14, 'right');
      s.spawn('osric_s', 'osric', 12, 16, 'down', { name: 'Old Osric', run: (c) => PORT.osricHint(c) });
    }
  },
};

/** @type {import('../../types/data').MapDef} */
export const pgInn = {
  ...INN, ...interior,
  id: 'c2_pg_inn', name: 'The Salt & Lantern',
  music: 'town',
  npcs: [
    { id: 'mags', name: 'Mags', look: 'mags', x: 8, y: 3, dir: 'down', hint: 'Rest',
      run: async (s) => {
        await s.say('Mags', s.flag('c2_tam_done') ? 'My little fugitives! Heard you sorted out Red Tam. Bed and chowder, thirty gold. Heroes pay full price — it\'s good for their characters.' : 'Bed, bath and a bowl of chowder. Thirty gold. Fugitives pay in advance.');
        await s.inn(30, 'the Salt & Lantern');
      } },
    { id: 'lark', name: 'Lark the Bard', look: 'villager_33', x: 12, y: 5, dir: 'left',
      talk: (s) => s.say('Lark the Bard', [
        '♪ _Go not to the Whisperwold, my love, where the old trees keep the dead..._ ♪',
        'Cheerful, isn\'t it? Everyone requests it. Nobody knows why.',
        s.flag('c2_mother_done') ? 'You\'ve BEEN there? And the trees went quiet? ...Hold on. I need a new verse.' : 'They say a mother-tree lives at the heart of it, holding all the voices. Like a lullaby that never ends.',
      ]) },
    { id: 'gulliver', name: 'Gulliver', look: 'villager_47', x: 3, y: 6, dir: 'right',
      talk: ['_(hic)_ Thorne\'s Own. Thorne\'s OWN. Y\'know what that means? Means Thorne OWNS \'em.', 'Means they don\'t answer to the Choir, nor the Watch, nor the King-what-we-haven\'t-got. Just him. _(hic)_ ...Just him and whoever he answers to.'] },
    { id: 'maddy', name: 'Old Maddy', look: 'villager_18', x: 9, y: 7, dir: 'up',
      talk: ['Mags hid my son from the press-gangs in eleven-oh-four. In that same kitchen. Behind that same bad cider.', 'Nobody\'s ever found anyone behind the bad cider. Nobody\'s ever been brave enough to move it.'] },
  ],
  inspect: [
    { x: 1, y: 2, text: 'The third barrel. It is labeled BAD CIDER — 1110 — DO NOT. Something inside it sloshes, menacingly.' },
    { x: 9, y: 2, text: 'A shelf of ships in bottles. One of them is a Dawnguard frigate, built upside down. Mags says it\'s "accurate".' },
  ],
  exits: [toTown(6, 9, 24, 8)],
  onEnter: (s) => PORT.hidden(s),
};

/** @type {import('../../types/data').MapDef} */
export const pgShop = {
  ...SHOP, ...interior,
  id: 'c2_pg_shop', name: 'Harborside Outfitters',
  music: 'town',
  npcs: [
    { id: 'tolliver', name: 'Tolliver', look: 'villager_14', x: 6, y: 3, dir: 'left', hint: 'Shop',
      run: async (s) => {
        await s.say('Tolliver', 'Harborside Outfitters! Swords, mail, rope, and remedies. The soldiers closed me for a whole day. A whole day! Buy something. Buy two things.');
        await s.shop('port_gale');
      } },
  ],
  inspect: [{ x: 2, y: 2, text: 'An anvil, polished to a mirror. It has never once been used. "It\'s for atmosphere," says Tolliver.' }],
  exits: [toTown(4, 6, 4, 14)],
};

/** @type {import('../../types/data').MapDef} */
export const pgOdile = {
  ...ODILE, ...interior,
  id: 'c2_pg_odile', name: 'Odile\'s Cottage',
  music: (st) => (st.flags.c2_odile_done ? 'town' : 'sad'),
  npcs: [{ id: 'odile', name: 'Odile', look: 'odile', x: 6, y: 3, dir: 'down', run: (s) => PORT.odile(s) }],
  inspect: [
    { x: 7, y: 2, hint: 'The lamp', run: async (s) => s.narrate(s.flag('c2_odile_done')
      ? 'The oil lamp on the sill is cold. The wick has been trimmed one last time, very neatly.'
      : 'An oil lamp on the sill, burning low and steady. The glass is spotless. Someone cleans it every single day.') },
    { x: 3, y: 2, text: 'A shelf of sailors\' knots, tied and labeled in a careful hand. Bowline. Sheet bend. Clove hitch. The bowline has been tied and untied so many times the rope is frayed white.' },
  ],
  exits: [toTown(4, 6, 43, 17)],
};
