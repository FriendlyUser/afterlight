// Corvin's Roost (Ch9 hub) and its interiors: the Last Call and the Ledger House.
import ROOST from './layouts/corvins_roost.js';
import LAST_CALL from './layouts/c9_last_call.js';
import LEDGER from './layouts/c9_ledger_house.js';
import { CH9 } from '../../story/ch9.js';
import { CH9_SIDE } from '../../story/ch9_side.js';

const f = (name) => (st) => !!st.flags[name];
const notYet = (name) => (st) => !st.flags[name];
const shipHere = (st) => !st.flags.c9_done;

/** @type {import('../../types/data').MapDef} */
export const roost = {
  ...ROOST,
  id: 'corvins_roost', name: 'Corvin\'s Roost', region: 'The Sunscar Rift',
  mood: 'ruin',
  music: (st) => (st.flags.c9_long_bell && !st.flags.c9_done ? 'tension' : st.flags.c9_arrived ? 'town' : 'ruin'),
  battleBg: 'ruin', particles: 'ash',
  camera: { dist: 21, pitch: 0.7 },
  npcs: [
    { id: 'mags', name: 'Mags', look: 'mags', x: 29, y: 8, dir: 'left', cond: (st) => !st.flags.c9_long_bell, run: (s) => CH9.mags(s) },
    { id: 'penny', name: 'Penny', look: 'c9_penny', x: 21, y: 19, dir: 'down', hint: 'Shop',
      run: async (s) => {
        await s.say('Penny', s.flag('c9_long_bell')
          ? 'Aunt Odessa says to give you the family discount. We don\'t have a family discount. She says to invent one.'
          : 'The Ledger Exchange. Everything\'s for sale, and everything\'s written down. Aunt Odessa\'s rule.');
        await s.shop('c9_exchange');
      } },
    { id: 'ruddock', name: 'Ruddock', look: 'c9_ruddock', x: 5, y: 18, dir: 'right', hint: 'Ferry', run: (s) => CH9.ruddock(s) },
    { id: 'gemma', name: 'Gemma', look: 'c9_gemma', x: 24, y: 15, dir: 'down', cond: shipHere,
      talk: async (s) => {
        if (s.flag('c9_long_bell')) return s.say('Gemma', ['I saw him shoot the line. From up here, I saw it.', 'Tell him— no. Don\'t tell him anything. Just tell him Gemma says the paint\'s still ugly.']);
        if (s.flag('c9_corvin_joined')) return s.say('Gemma', ['He went up the plank? He actually went *up* it?', 'I crewed the Halcyon six years. I left when he turned east. Maybe I\'ll come back when he turns around.']);
        return s.say('Gemma', ['I was his bosun, once. Best crew in the sky.', 'When the sea went up, we had the engines hot and the kids\' island in sight. He looked at it for a long time. Then he said "east."', 'I got off at the first rock we came to. Haven\'t spoken to him since.']);
      } },
    { id: 'fen', name: 'Fen', look: 'c9_kid_a', x: 21, y: 13, dir: 'right', run: (s) => CH9_SIDE.kids(s, 'fen') },
    { id: 'dory', name: 'Dory', look: 'c9_kid_b', x: 22, y: 14, dir: 'up', run: (s) => CH9_SIDE.kids(s, 'dory') },
    { id: 'wick', name: 'Wick', look: 'c9_wick', x: 7, y: 23, dir: 'left', run: (s) => CH9_SIDE.wick(s) },
    { id: 'ox', name: 'Ox', look: 'c9_ox', x: 22, y: 28, dir: 'right', run: (s) => CH9_SIDE.ox(s) },
    { id: 'hesper', name: 'Hesper', look: 'c9_hesper', x: 17, y: 30, dir: 'right',
      talk: async (s) => {
        if (s.flag('c9_part_sail')) return s.say('Hesper', ['Stormsilk. You brought back stormsilk.', 'My Arlo flew a silk-rigger. Could I— no. No, it\'s for your ship. Just let me look at it a moment.', '...Thank you. It still smells of weather.']);
        return s.say('Hesper', ['I knit with sailcloth. It\'s all that falls out of the sky now — sails, and the people who were under them.', 'My Arlo went up the morning the sun broke. I keep knitting him scarves. I\'ve got eleven. He\'ll be ever so warm.']);
      } },
    { id: 'amsel', name: 'Brother Amsel', look: 'c9_amsel', x: 17, y: 22, dir: 'down',
      talk: async (s) => {
        if (s.flag('c9_long_bell')) return s.say('Brother Amsel', ['The Noon Spire. Of course it was the Spire.', 'I sang in the Choir for twenty years. There is nothing I want to say to the Hierophant that a hymn would carry.']);
        return s.say('Brother Amsel', ['I was a Cantor of the Choir. I took off the robe the night the sun broke. Kept the hood. It\'s cold.', 'Pilgrims still fly north, you know. To a white tower on the brightest shard. They say inside it is always the afternoon of a summer festival, and the dead are there, waiting.', 'They say a great many things. The pilgrims don\'t come back to say otherwise.']);
      } },
    { id: 'lonnie', name: 'Lonnie', look: 'c9_lonnie', x: 27, y: 24, dir: 'down', cond: notYet('c9_lonnie_free'), run: (s) => CH9_SIDE.lonnie(s) },
    { id: 'lonnie_free', name: 'Lonnie', look: 'c9_lonnie', x: 6, y: 20, dir: 'down', cond: f('c9_lonnie_free'), run: (s) => CH9_SIDE.lonnie(s) },
    { id: 'tamm', name: 'Bailiff Tamm', look: 'c9_bailiff', x: 32, y: 17, dir: 'left', run: (s) => CH9_SIDE.tamm(s) },
    { id: 'marta', name: 'Marta', look: 'villager_41', x: 29, y: 17, dir: 'left',
      talk: ['Bird stew! Bird stew! Don\'t ask what bird. I don\'t ask the birds what you are.', 'There used to be seagulls, you know. Before. I miss complaining about them.'] },
    { id: 'teo', name: 'Teo', look: 'villager_12', x: 14, y: 27, dir: 'right',
      talk: ['We came from the Mirefen shards. Walked the sky-bridges, three weeks.', 'Nia sleeps fine now. I don\'t. Somebody has to listen for the bridges creaking.'] },
    { id: 'nia', name: 'Nia', look: 'villager_9', x: 15, y: 28, dir: 'left',
      talk: async (s) => {
        if (s.flag('c9_nia_asked')) return s.say('Nia', 'You\'re going to try. You said. I heard you.');
        s.setFlag('c9_nia_asked');
        await s.say('Nia', 'Are you the girl from the song? The one with the red hair?');
        await s.wait(0.8);
        await s.say('Wren', '...Yes.');
        await s.say('Nia', 'Did you really break the sun?');
        await s.say('Wren', 'Yes. I did.');
        await s.say('Nia', 'Can you fix it?');
        await s.wait(1.0);
        await s.say('Wren', 'I\'m going to try.');
        await s.say('Nia', 'Okay.');
        await s.say('Nia', 'The song doesn\'t say that part. Somebody should put it in.');
      } },
    { id: 'rook', name: 'Rook', look: 'villager_30', x: 40, y: 21, dir: 'left',
      talk: async (s) => s.say('Rook', s.flag('c9_boneyard_open')
        ? ['Lift\'s yours, with Mags\'s key. Mind the bottom — it bites.', 'Not the lift. The Boneyard. The lift\'s very well behaved.']
        : ['Lift\'s chained. Mags keeps the key. Mags keeps everything.', 'Down there\'s the Boneyard. Everything that fell out of the sky. Some of it\'s still moving.']) },
  ],
  blockers: [
    { id: 'skiff', x: 2, y: 22, prop: 'boat' },
  ],
  inspect: [
    { x: 2, y: 22, hint: 'The skiff', run: async (s) => s.narrate(s.flag('c9_long_bell')
      ? 'An empty mooring post. The cut line trails over the edge into nothing.'
      : ['Corvin\'s skiff: a one-man sky-boat, sleek and patched, moored to the Lip by a single line.', 'Its tank is full. Someone has been keeping it full.']) },
    { x: 33, y: 7, hint: 'The bow', run: async (s) => s.narrate(s.flag('c9_done')
      ? 'Ash, and the long scar in it where a ship used to lie.'
      : ['HALCYON, in chipped gold leaf. Below it, smaller, an older name has been painted over. You can just make out the first letters: H-A-L.']) },
    { x: 23, y: 13, text: 'A campfire of kite-sticks and chair legs. Someone has drawn a ship in the ash beside it, with a very large flag and a very small captain.' },
    { x: 7, y: 24, text: 'A table made from a door. The chart on it is mostly blank, with careful notes in the margins: HERE BE NOTHING. HERE TOO. HERE, POSSIBLY, SOUP.' },
    { x: 13, y: 21, text: 'Kite-tails and prayer-flags snap on the lines. Someone has stitched names onto them. Dozens of names. Under the newest: COME HOME.' },
    { x: 23, y: 29, text: 'Ox\'s anvil, scattered with clock-hands. Dozens of them, all pointing different ways.' },
    { x: 41, y: 19, text: 'The lift winch. A chalk tally on its housing counts the people who went down to the Boneyard this year. A second tally counts the ones who came up. The second one is shorter.' },
    { x: 27, y: 25, text: 'The stocks. Someone has carved, very small, into the wood: THE GOAT WAS A DOG.', cond: f('c9_lonnie_free') },
  ],
  exits: [
    { x: 42, y: 20, h: 3, to: 'c9_boneyard', tx: 4, ty: 31, dir: 'up', cond: f('c9_boneyard_open'),
      blocked: async (s) => { await s.say('Rook', 'Lift\'s chained. Mags has the key.'); await s.step('player', -1, 0); } },
    { x: 12, y: 37, w: 6, to: '@world', cond: (st) => st.flags.c9_met_mags && !(st.flags.c9_long_bell && !st.flags.c9_done),
      blocked: async (s) => { await s.say('Wren', 'Not yet. We came here for a ship.'); await s.step('player', 0, -1); } },
  ],
  triggers: [
    { id: 'pip_flask', x: 10, y: 16, w: 5, h: 3, once: false, cond: (st) => st.flags.c9_met_corvin && !st.flags.c9_flask, run: (s) => CH9.pipFlask(s) },
    { id: 'plank_coil', x: 23, y: 12, w: 7, h: 6, once: false, cond: (st) => st.flags.c9_part_coil && !st.flags.c9_corvin_joined, run: (s) => CH9.corvinStays(s) },
    { id: 'plank_bell', x: 23, y: 12, w: 7, h: 6, once: false, cond: (st) => st.flags.c9_part_heart && !st.flags.c9_long_bell, run: (s) => CH9.longBell(s) },
  ],
  onEnter: async (s) => {
    if (!s.flag('c9_arrived')) await CH9.arrival(s);
    else if (s.flag('c9_after_permit')) await CH9.afterPermit(s);
  },
};

const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'town' };

/** @type {import('../../types/data').MapDef} */
export const lastCall = {
  ...LAST_CALL, ...interior,
  id: 'c9_last_call', name: 'The Last Call', music: 'town',
  npcs: [
    { id: 'corvin', name: 'Corvin', look: 'corvin', x: 8, y: 4, dir: 'up', cond: (st) => st.flags.c9_arrived && !st.flags.c9_corvin_joined,
      talk: async (s) => s.say('Corvin', s.flag('c9_part_coil')
        ? ['You... got a coil. Out of the Boneyard.', 'Huh.', '...Go show Mags. She\'ll be insufferable. Let her.']
        : ['Mags. Wreck. Up the canyon. I\'m not coming.', 'Don\'t look at me like that, sparrow. Your mother used to look at me like that.']) },
    { id: 'tuck', name: 'Tuck', look: 'c9_tuck', x: 9, y: 3, dir: 'down', hint: 'Inn',
      run: async (s) => {
        await s.say('Tuck', s.flag('c9_corvin_joined')
          ? 'Beds upstairs. Two hundred. The Captain\'s old room\'s free — first time in a year he isn\'t sleeping on my bar.'
          : 'Beds upstairs, two hundred a night. Breakfast is whatever Marta caught. Don\'t ask what.');
        await s.inn(200, 'the Last Call');
      } },
    { id: 'ferro', name: 'Ferro', look: 'c9_ferro', x: 11, y: 6, dir: 'left', hint: 'High-Low', run: (s) => CH9_SIDE.ferro(s) },
    { id: 'sal', name: 'Sal', look: 'villager_17', x: 2, y: 7, dir: 'right',
      talk: ['Zzz... five more minutes...', '...five more years...'] },
  ],
  inspect: [
    { x: 3, y: 3, run: async (s) => s.narrate(s.flag('c9_corvin_joined')
      ? 'Bottles, labeled in Tuck\'s square hand: NOT FOR CORVIN. One new label, the ink still wet: STILL NOT FOR CORVIN. GOOD.'
      : 'Bottles, mostly empty, all labeled in Tuck\'s square hand: NOT FOR CORVIN.') },
    { x: 10, y: 6, text: 'A card table. The felt is worn through in exactly one place: where the dealer\'s left hand rests.' },
  ],
  exits: [{ x: 5, y: 9, w: 3, to: 'corvins_roost', tx: 12, ty: 16, dir: 'down' }],
  onEnter: (s) => CH9.lastCall(s),
};

/** @type {import('../../types/data').MapDef} */
export const ledgerHouse = {
  ...LEDGER, ...interior,
  id: 'c9_ledger_house', name: 'The Ledger House', music: 'town',
  npcs: [
    { id: 'odessa', name: 'Odessa', look: 'odessa', x: 6, y: 4, dir: 'down', run: (s) => CH9.odessa(s) },
    { id: 'quentin', name: 'Quentin', look: 'villager_25', x: 9, y: 6, dir: 'left',
      talk: ['Debits on the left, credits on the right. Debtors on the carpet.', 'Madam Quill has never once been wrong about a number. She\'s been wrong about people. Twice. She keeps a ledger of that too.'] },
  ],
  inspect: [
    { x: 1, y: 2, text: 'Ledgers to the ceiling, each spine labeled with a year. The newest are labeled only: AFTER.' },
    { x: 9, y: 2, run: async (s) => s.narrate(s.flag('c9_long_bell')
      ? 'A ledger lies open to a page near the back. There is a tidy gap where one page was torn out.'
      : 'A ledger lies open to a page near the back, worn soft with handling. ASHE, C. The column of figures runs to the bottom and over the page.') },
    { x: 10, y: 6, text: 'A small statue of a woman holding scales. Someone has balanced a coin on each pan. They are perfectly level.' },
  ],
  exits: [{ x: 4, y: 8, w: 3, to: 'corvins_roost', tx: 33, ty: 16, dir: 'down' }],
};
