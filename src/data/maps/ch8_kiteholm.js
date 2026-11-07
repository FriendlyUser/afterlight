// Chapter 8 — Kiteholm and its interiors.
import L from './layouts/kiteholm.js';
import ANCHOR from './layouts/c8_rusty_anchor.js';
import NEST from './layouts/c8_kite_nest.js';
import HALL from './layouts/c8_baron_hall.js';
import ARENA from './layouts/c8_scrap_arena.js';
import { CH8 } from '../../story/ch8.js';

const raiding = (st) => st.flags.c8_raid && !st.flags.c8_raid_done;
const calm = (st) => !raiding(st);
const say = (name, lines) => async (s) => s.say(name, lines);
const hider = (key, name, lines) => (s) => CH8.hider(s, key, name, lines);

export const kiteholm = {
  ...L,
  id: 'kiteholm', name: 'Kiteholm', region: 'The Windward Shards',
  mood: (st) => (raiding(st) ? 'night' : 'ruin'),
  music: (st) => (raiding(st) ? 'tension' : 'town'),
  particles: (st) => (raiding(st) ? 'ash' : 'dust_sand'),
  backdrop: { plane: '#1a0e24', y: -14 },
  battleBg: 'ruin',
  camera: { dist: 21, pitch: 0.7 },
  npcs: [
    { id: 'fenna', name: 'Fenna', look: 'fenna', x: 6, y: 20, dir: 'right', cond: calm,
      talk: say('Fenna', ['My barge goes back down when the ember-wind turns. Which is whenever it likes.', 'You\'ll hate it up here. Then you\'ll never leave. Then you\'ll leave anyway, because that\'s what people like you do.']) },
    { id: 'brindle', name: 'Old Brindle', look: 'c8_brindle', x: 19, y: 18, dir: 'down', hint: 'Shop', cond: calm,
      run: async (s) => {
        await s.say('Old Brindle', s.flag('c8_raid_done')
          ? 'You saved my Kites. Everything\'s the same price, because I\'m poor, but I\'ll _feel_ generous at you.'
          : 'Scrap and Sundry! If it fell off something, I sell it. If it didn\'t fall off something, give it time.');
        await s.shop('kiteholm');
      } },
    { id: 'hask', name: 'Hask', look: 'villager_19', x: 14, y: 19, wander: 2, cond: calm,
      talk: say('Hask', ['Scrap-picker. I go down the ropes for metal. The Baron weighs it. The Baron\'s scale is a liar.', 'Don\'t go down the Underhang without rope. Don\'t go down with rope either. Just — don\'t.']) },
    { id: 'wynn', name: 'Old Wynn', look: 'villager_33', x: 38, y: 12, dir: 'right', cond: calm,
      talk: (s) => s.say('Old Wynn', s.flag('c8_quiet')
        ? ['Saw the Boss flying a kite up here. Laughing like a gull.', 'Been waiting a year to hear that. Didn\'t know I was waiting till I heard it.']
        : ['Flew kites on the Gale Coast sixty years. Now the whole world\'s the sky, and I\'m still flying kites.', 'Wind\'s honest. Wind doesn\'t promise you noon forever. It just blows.']) },
    { id: 'netta', name: 'Netta', look: 'villager_24', x: 12, y: 28, dir: 'down', cond: calm,
      talk: say('Netta', ['I wash for the whole shard. Ash in everything. You get used to grey.', 'The Boss brings me the Kites\' things once a week. Folded. He folds them. Twelve years old and he _folds_.']) },
    { id: 'ivo', name: 'Ivo', look: 'c8_thug', x: 26, y: 10, dir: 'down', cond: calm,
      talk: (s) => s.say('Ivo', s.flag('c8_raid_done')
        ? ['The Baron says he was always going to send us. He was getting his boots on. Big boots. Took a while.']
        : ['Baron\'s terrace. Baron\'s air. You\'re breathing it, so technically you owe him.', 'I\'m joking. Mostly. He\'s got a ledger for breaths.']) },
    { id: 'jessa', name: 'Jessa', look: 'villager_30', x: 25, y: 25, dir: 'left', cond: calm,
      talk: (s) => s.say('Jessa', s.flag('c8_raid_done')
        ? ['They came, and they didn\'t get one. Not one Kite. My Fig is asleep in the Nest with her boots on.', 'Thank you. Whoever you are. Thank you.']
        : ['My girl\'s a Kite. I\'m not allowed in the Nest. Boss\'s rule: no grown-ups.', 'I\'m not angry. When the raiders took Skerry\'s boy, nobody grown went after him. Pip did.']) },
    { id: 'mumbler', name: 'Mumbling Man', look: 'villager_55', x: 29, y: 31, dir: 'down', cond: calm,
      talk: say('Mumbling Man', ['I saw him. On the Gallows Shard, before they cut it loose. Black armor. A mask that weeps.', 'He held his sword high, like a man waiting for permission. He never got it. He swung anyway.']) },
    { id: 'lark', name: 'Lark', look: 'c8_kite_a', x: 15, y: 21, wander: 2, cond: calm,
      talk: say('Lark', ['I\'m a messenger Kite. I run messages. Mostly the message is "Boss says no."', 'Sometimes it\'s "Boss says NO." That one I shout.']) },
    { id: 'quill', name: 'Gaffer Quill', look: 'quill', x: 41, y: 12, dir: 'left', cond: calm, run: (s) => CH8.quill(s) },
    { id: 'rook', name: 'Skiff-Hand Rook', look: 'c8_thug', x: 10, y: 34, dir: 'down', cond: calm, run: (s) => CH8.skiff(s) },
    // Hide and seek
    { id: 'burr', name: 'Burr', look: 'c8_kite_b', x: 6, y: 16, dir: 'down', cond: calm,
      run: hider('burr', 'Burr', ['Aw, rats. Behind the shack was a _good_ spot.', 'Don\'t tell Tansy I was eating. I was eating.']) },
    { id: 'fig', name: 'Fig', look: 'c8_kite_c', x: 44, y: 15, dir: 'left', cond: calm,
      run: hider('fig', 'Fig', ['You found me! Up here you can see the whole sky. It\'s mostly purple.', 'I like it. Don\'t tell Mum, she thinks purple\'s sad.']) },
    { id: 'nettle', name: 'Nettle', look: 'c8_kite_d', x: 12, y: 33, dir: 'left', cond: calm,
      run: hider('nettle', 'Nettle', ['I was _guarding_ the skiff. Undercover. You blew my cover.', 'Fine. I\'ll go tell Tansy. She\'s going to be so smug.']) },
    { id: 'pim', name: 'Pim', look: 'c8_kite_e', x: 31, y: 8, dir: 'down', cond: calm,
      run: hider('pim', 'Pim', ['Shhh! The Baron\'s terrace is the best spot. Nobody looks at the Baron\'s stuff. It\'s all ugly.']) },
    { id: 'sprocket', name: 'Sprocket', look: 'c8_kite_b', x: 41, y: 24, dir: 'up', cond: calm,
      run: hider('sprocket', 'Sprocket', ['...', '...how.', 'Nobody finds Sprocket. I\'m Sprocket. _Nobody finds me._', 'I need a new spot. I need to think about my life.']) },
  ],
  inspect: [
    { x: 43, y: 12, text: 'The old signal mast. Someone has carved every Kite\'s name into it, from the bottom up. The top name is PIP. Under it, smaller, somebody else has carved: BOSS.' },
    { x: 22, y: 16, text: 'The town kite-pole. A hundred kite-tails flap from it, one for every child the shard has lost to the wind or the raiders. They snap in the gusts like applause.' },
    { x: 1, y: 20, text: 'The end of the dock. Below: nothing, then haze, then more nothing. The wind tugs at your coat like it has somewhere to show you.' },
    { x: 23, y: 34, text: 'The ladder down to the Underhang. The Kites have chalked a warning on the top rung: DONT. (BOSS SAYS.)' },
  ],
  exits: [
    { x: 0, y: 18, w: 1, h: 5, to: '@world' },
    { x: 22, y: 39, w: 3, to: 'c8_underhang', tx: 20, ty: 2, dir: 'down', cond: (st) => st.flags.c8_underhang_open },
  ],
  blockers: [
    { id: 'c8_ladder', x: 22, y: 36, w: 3, h: 1, prop: 'crate', cond: (st) => !st.flags.c8_underhang_open },
  ],
  triggers: [
    { id: 'c8_cliff', x: 40, y: 12, w: 5, h: 5, once: false, cond: (st) => st.flags.c8_aftermath && !st.flags.c8_quiet, run: (s) => CH8.quietKite(s) },
  ],
  onEnter: async (s) => {
    await CH8.opening(s);
    await CH8.raid(s);
  },
};

// ---------------------------------------------------------------------------

const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'ruin' };

export const rustyAnchor = {
  ...ANCHOR, ...interior,
  id: 'c8_rusty_anchor', name: 'The Rusty Anchor', music: 'inn',
  npcs: [
    { id: 'grudge', name: 'Grudge', look: 'c8_grudge', x: 7, y: 3, dir: 'down', hint: 'Rest',
      run: async (s) => {
        await s.say('Grudge', s.flag('c8_raid_done')
          ? 'Kestrel\'s tab is closed, by the way. He came in, paid what he had, and ordered a water. A _water_. I nearly called Ilse.'
          : 'Bed\'s a hammock, roof\'s a sail, breakfast is whatever the wind brings. Hundred and fifty.');
        await s.inn(150, 'the Rusty Anchor');
      } },
    { id: 'dorran', name: 'Dorran', look: 'villager_47', x: 12, y: 7, dir: 'left', cond: (st) => st.flags.c8_met_bram,
      talk: say('Dorran', ['Your big friend loses every hand. Every one. I used to think he was the worst card player alive.', 'Then I noticed he only loses when there\'s a Kite watching. Kites get the pot. Every time.']) },
    { id: 'lyle', name: 'Lyle', look: 'villager_26', x: 2, y: 6, dir: 'right',
      talk: say('Lyle', ['The Baron banned singing after the raiders\' lullabies started drifting up from below.', 'So now I hum. Very quietly. Hmmmm. That one\'s about a sailor.']) },
    { id: 'patron', name: 'Patron', look: 'villager_39', x: 4, y: 6, dir: 'left',
      talk: say('Patron', ['They say Evernoon is a city where it\'s always summer. They say the dead walk around in it, happy.', 'My wife\'s dead. I don\'t want her happy somewhere I can\'t go. That\'s selfish, isn\'t it. I\'m drinking about it.']) },
  ],
  inspect: [
    { x: 12, y: 2, text: 'A hammock with a blanket folded very neatly at the foot. A greatsword leans beside it. Scratched on the wall above, a tally of days — and beside every seventh mark, a tiny drawing of a shield.' },
  ],
  exits: [{ x: 5, y: 9, w: 3, to: 'kiteholm', tx: 11, ty: 15, dir: 'down' }],
  onEnter: async (s) => { await CH8.anchorMeet(s); },
};

export const kiteNest = {
  ...NEST, ...interior,
  id: 'c8_kite_nest', name: 'The Kite Nest', music: (st) => (st.flags.c8_raid_done ? 'sad' : 'town'),
  npcs: [
    { id: 'pip', name: 'Pip', look: 'pip_ruin', x: 8, y: 5, dir: 'up', cond: (st) => st.flags.c8_back && !st.flags.c8_raid, run: (s) => CH8.pip(s) },
    { id: 'tansy', name: 'Tansy', look: 'tansy', x: 5, y: 7, dir: 'down', run: (s) => CH8.tansy(s) },
    { id: 'wick', name: 'Wick', look: 'wick', x: 12, y: 8, dir: 'down', cond: (st) => st.flags.c8_kids_saved, run: (s) => CH8.wick(s) },
    { id: 'moth', name: 'Moth', look: 'moth', x: 13, y: 8, dir: 'left', cond: (st) => st.flags.c8_kids_saved,
      talk: say('Moth', ['I cried when I woke up. I always cry when I wake up. Boss says it\'s because I\'m surprised to be alive.', 'I think it\'s because waking up is sad. Even when it\'s good.']) },
    { id: 'kite_a', name: 'Kite', look: 'c8_kite_d', x: 3, y: 4, dir: 'down',
      talk: (s) => s.say('Kite', s.flag('c8_raid_done')
        ? ['Bram swung his sword so hard the Baron\'s gun fell off the roof. Probably. I wasn\'t looking. I was hiding. Hiding\'s a job.']
        : ['Rule nine: no grown-ups in the Nest.', '...You\'re the Boss\'s friends? Rule nine-and-a-half: unless they\'re the Boss\'s friends. I just made that up. It\'s allowed.']) },
    { id: 'kite_b', name: 'Kite', look: 'c8_kite_e', x: 13, y: 5, dir: 'left',
      talk: say('Kite', ['I\'m building my own kite. It\'s a dragon. Well. It\'s a triangle. It\'s a dragon on the inside.']) },
  ],
  inspect: [
    { x: 7, y: 4, text: 'A map of Kiteholm drawn on a sail, covered in pins and string. Every Kite has a pin. Every pin has a name. In the corner, a list in a careful child\'s hand: FOOD. WATER. SLINGSHOTS. COUNT HEADS. COUNT AGAIN.' },
    { x: 8, y: 4, text: 'Tucked under the map\'s corner: a folded scrap of paper. Inside, in pencil, a drawing of four tall people and two short ones on a beach. One of the tall ones has a sword. The short one is holding her hand.' },
  ],
  exits: [{ x: 6, y: 10, w: 3, to: 'kiteholm', tx: 30, ty: 18, dir: 'down' }],
  onEnter: async (s) => {
    await CH8.nestScene(s);
    await CH8.homecoming(s);
    await CH8.aftermath(s);
  },
};

export const baronHall = {
  ...HALL, ...interior,
  id: 'c8_baron_hall', name: 'The Baron\'s Hall', music: 'town',
  npcs: [
    { id: 'dask', name: 'Baron Dask', look: 'dask', x: 7, y: 3, dir: 'down', run: (s) => CH8.baron(s) },
    { id: 'bram_door', name: 'Bram', look: 'bram_ruin', x: 8, y: 8, dir: 'left', cond: (st) => st.flags.c8_met_bram && !st.flags.c8_raid, run: (s) => CH8.bramDoor(s) },
    { id: 'thug', name: 'Baron\'s Guard', look: 'c8_thug', x: 4, y: 5, dir: 'right',
      talk: say('Baron\'s Guard', ['The Baron\'s statue is of the Baron. By the Baron. He posed for eleven days.', 'He says it captures his "essence." Its essence is mostly chin.']) },
  ],
  inspect: [
    { x: 7, y: 2, text: 'A statue of Baron Dask, welded from scrap, gazing nobly at nothing. A plaque reads: "THE AIR IS FREE. BREATHING IT IS NOT."' },
    { x: 2, y: 3, text: 'Crates of salvage stamped with the Choir\'s sunburst. The Baron does business with everyone. Everyone does business with the Baron. That is what makes him a Baron.' },
  ],
  exits: [{ x: 6, y: 10, w: 3, to: 'kiteholm', tx: 24, ty: 8, dir: 'down' }],
  onEnter: async (s) => { await CH8.baronWarn(s); },
};

export const scrapArena = {
  ...ARENA,
  id: 'c8_scrap_arena', name: 'The Scrap Arena', region: 'Kiteholm',
  mood: 'ruin', music: 'town', particles: 'embers_soft', battleBg: 'ruin', noBanner: false,
  camera: { dist: 16, pitch: 0.74 },
  npcs: [
    { id: 'ratchet', name: 'Madame Ratchet', look: 'ratchet', x: 11, y: 3, dir: 'down', hint: 'Arena', run: (s) => CH8.ratchet(s) },
    { id: 'fan1', name: 'Arena Fan', look: 'villager_12', x: 5, y: 3, dir: 'down',
      talk: say('Arena Fan', ['I bet on the Gale Roc every week. The Gale Roc has never lost.', 'I am very rich and very sad.']) },
    { id: 'fan2', name: 'Arena Fan', look: 'villager_44', x: 16, y: 3, dir: 'down',
      talk: say('Arena Fan', ['Iron Moll used to be a Dawnguard sergeant. Now she fights scrap for scrap.', 'She says it\'s the same job with better hours.']) },
  ],
  inspect: [
    { x: 2, y: 2, text: 'Chalked rankings: RUSTJAW. COG & SPROCKET (THE TWINS, NOT THE KITE). IRON MOLL. THE GALE ROC — UNDEFEATED. Underneath, someone has added: THE BARON (IN HIS DREAMS).' },
  ],
  exits: [{ x: 9, y: 17, w: 4, to: 'kiteholm', tx: 36, ty: 28, dir: 'down' }],
};
