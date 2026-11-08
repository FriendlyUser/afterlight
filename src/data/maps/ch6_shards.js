// Chapter 6 — Afterlight. Fennick's hut and shard, the Drift, Keelhaven and the
// Shattered Sea. Wren travels alone; encounters are tuned for one character.
import HUT from './layouts/shard_hermitage.js';
import SHARD from './layouts/c6_hermit_shard.js';
import DRIFT from './layouts/c6_drift.js';
import KEEL from './layouts/c6_keelhaven.js';
import KEEL_INN from './layouts/c6_keel_inn.js';
import KEEL_HALL from './layouts/c6_keel_hall.js';
import SEA from './layouts/c6_shattered_sea.js';
import { CH6 } from '../../story/ch6.js';

const RUIN = { mood: 'ruin', music: 'ruin', particles: 'ash', battleBg: 'ruin', backdrop: { plane: '#140a1c', y: -18 } };
const interior = { mood: 'interior', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'ruin' };
const f = (name) => (st) => !!st.flags[name];

// ------------------------------------------------------------------ Fennick's hut
/** @type {import('../../types/data').MapDef} */
export const shardHermitage = {
  ...HUT, ...interior,
  id: 'shard_hermitage', name: 'Fennick\'s Hut', music: (st) => (st.flags.c6_outside ? 'ruin' : 'sad'),
  npcs: [
    { id: 'fennick_h', name: 'Fennick', look: 'fennick', x: 7, y: 4, dir: 'down',
      cond: (st) => st.flags.c6_woke && (!st.flags.c6_outside || st.flags.c6_left_shard), run: (s) => CH6.hutFennick(s) },
  ],
  inspect: [
    { x: 8, y: 5, hint: 'Lamp', run: (s) => CH6.lanternTable(s) },
    { x: 8, y: 2, run: (s) => CH6.books(s) },
    { x: 9, y: 2, run: (s) => CH6.books(s) },
    { x: 10, y: 2, run: (s) => CH6.books(s) },
    { x: 2, y: 2, text: 'The cot you have slept in for a year. Someone has patched the blanket a dozen times, with whatever was to hand. One patch is a piece of a Dawnguard flag.' },
    { x: 1, y: 4, text: 'A pot of soup, gently burning. It smells of ash-potato and, very faintly, of fish.' },
  ],
  exits: [{ x: 5, y: 9, w: 2, to: 'c6_hermit_shard', tx: 14, ty: 9, dir: 'down' }],
  onEnter: (s) => CH6.wake(s),
};

// ------------------------------------------------------------------ the shard
/** @type {import('../../types/data').MapDef} */
export const c6HermitShard = {
  ...SHARD, ...RUIN,
  id: 'c6_hermit_shard', name: 'Fennick\'s Shard', region: 'The Drift',
  music: (st) => (st.flags.c6_cairns && !st.flags.c6_spar ? 'sad' : 'ruin'),
  encounters: { rate: 0.8, onTiles: 'a', cond: f('c6_spar'), troops: [['c6_shard_wraith', 3], ['c6_shard_moths', 2], ['c6_shard_mix', 2]] },
  npcs: [
    { id: 'fennick', name: 'Fennick', look: 'fennick', x: 27, y: 9, dir: 'up', cond: (st) => st.flags.c6_woke && !st.flags.c6_cairns, run: (s) => CH6.cairns(s) },
    { id: 'fennick_r', name: 'Fennick', look: 'fennick', x: 22, y: 16, dir: 'left', cond: (st) => st.flags.c6_cairns && !st.flags.c6_courier, run: (s) => CH6.spar(s) },
    { id: 'fennick_d', name: 'Fennick', look: 'fennick', x: 15, y: 10, dir: 'down', cond: (st) => st.flags.c6_courier && !st.flags.c6_left_shard, run: (s) => CH6.fennickTalk(s) },
  ],
  inspect: [
    { x: 3, y: 12, hint: 'Rock', run: (s) => CH6.rock(s) },
    { x: 26, y: 8, text: 'A cairn of stacked grey stones. Scratched on the flat stone at its foot: EDRIN HALLOWAY. HE\'D WANT A BETTER STONE.' },
    { x: 28, y: 8, text: 'A newer cairn. The stones are still sharp-edged. YSOLDE HALLOWAY. KEEPER. SHE HELD.' },
    { x: 21, y: 22, text: 'A little fishing boat, upright on the ash, a long way from any water. Painted on the bow: THE SEAGULL. Fennick\'s boat. It rose with the sea, and came down here, with him.' },
    { x: 8, y: 10, text: 'Fennick\'s garden. Ash-potatoes, a stubborn rosemary, and — tucked in a sheltered corner — one sprig of sea lavender, in a pot, carefully watered.' },
    { x: 21, y: 15, text: 'A practice post, hacked half through. Fennick\'s been keeping his arm in. Or keeping busy.' },
  ],
  exits: [
    { x: 37, y: 12, h: 2, to: 'c6_drift', tx: 1, ty: 13, dir: 'right', cond: f('c6_courier'),
      blocked: async (s) => { await s.think('Wren', 'Not yet. Fennick wanted to show me something first.'); await s.step('player', -1, 0); } },
  ],
  triggers: [
    { id: 'c6_ashmaw', x: 29, y: 12, w: 3, h: 2, once: false, cond: (st) => st.flags.c6_courier && !st.flags.c6_ashmaw, run: (s) => CH6.ashmaw(s) },
  ],
  onEnter: (s) => CH6.outside(s),
};

// ------------------------------------------------------------------ the Drift
/** @type {import('../../types/data').MapDef} */
export const c6Drift = {
  ...DRIFT, ...RUIN,
  id: 'c6_drift', name: 'The Drift', region: 'What Was Lanternfall',
  camera: { dist: 22, pitch: 0.7 },
  encounters: { rate: 1.0, troops: [['c6_drift_hound', 3], ['c6_drift_hounds', 2], ['c6_drift_sailor', 2], ['c6_drift_mix', 2], ['c6_drift_moths', 2], ['c6_drift_golem', 1]] },
  signs: [{ x: 22, y: 10, text: 'LANTERNFALL — Westmost Light of Solmere.\nThe chalk underneath has almost weathered away: ...ONIZATION IN PROGRE... KEEP TO YOUR HOMES.' }],
  chests: [
    { id: 'c6_dr1', x: 24, y: 14, item: 'hi_tonic', count: 3 },
    { id: 'c6_dr2', x: 38, y: 13, item: 'c6_letter_jory' },
    { id: 'c6_dr3', x: 32, y: 11, item: 'mega_tonic' },
    { id: 'c6_dr4', x: 31, y: 27, item: 'c6_letter_aldo' },
    { id: 'c6_dr5', x: 26, y: 28, item: 'guard_fruit' },
    { id: 'c6_dr6', x: 58, y: 17, gold: 1200 },
    { id: 'c6_dr7', x: 52, y: 28, item: 'x_ether' },
  ],
  inspect: [
    { x: 19, y: 12, text: 'The village well, torn up roots and all. WREN + ILSE + THE SEA + PIP. Somebody has added, in the last year, very small: COME HOME.' },
    { x: 2, y: 16, hint: 'Look west', run: (s) => CH6.lanternView(s) },
    { x: 21, y: 2, hint: 'Table', run: (s) => CH6.houseTable(s) },
    { x: 18, y: 2, text: 'Your bed, still made. Your mother made it the morning she wrote the letter. Nobody has slept in it since.' },
    { x: 23, y: 1, hint: 'Shelf', run: (s) => CH6.atlas(s) },
    { x: 36, y: 11, text: 'The cutter\'s mast, snapped clean. A Dawnguard pennant still flutters from the stump, red and gold, very bright against the ash.' },
  ],
  triggers: [
    { id: 'c6_house', x: 16, y: 1, w: 9, h: 5, run: (s) => CH6.house(s) },
  ],
  exits: [
    { x: 0, y: 13, h: 2, to: 'c6_hermit_shard', tx: 36, ty: 12, dir: 'left' },
    { x: 65, y: 15, h: 2, to: 'c6_keelhaven', tx: 2, ty: 16, dir: 'right' },
  ],
  onEnter: (s) => CH6.driftIn(s),
};

// ------------------------------------------------------------------ Keelhaven
/** @type {import('../../types/data').MapDef} */
export const c6Keelhaven = {
  ...KEEL, ...RUIN,
  id: 'c6_keelhaven', name: 'Keelhaven', region: 'The Shattered Sea',
  camera: { dist: 21, pitch: 0.68 },
  signs: [{ x: 5, y: 15, text: 'A sheet of white Choir paper, the gold sunburst at its head:\nTHE LAST STONE WAS GIVEN FREELY, BY THE KEEPER\'S DAUGHTER OF LANTERNFALL.\n— by order of His Radiance the Hierophant.\nSomeone has drawn a noose underneath.' }],
  blockers: [{ id: 'c6_east_gate', x: 46, y: 16, w: 1, h: 2, prop: 'fence', cond: (st) => !st.flags.c6_gate_open }],
  npcs: [
    { id: 'mott', name: 'Sentry Mott', look: 'c6_sentry', x: 4, y: 18, dir: 'right', cond: f('c6_keelhaven'),
      talk: ['Don\'t steal, don\'t fight, don\'t fall off. That\'s the whole law.', 'Folk keep falling off. You\'d think it\'d be the easy one.'] },
    { id: 'rook', name: 'Sentry Rook', look: 'c6_sentry', x: 44, y: 18, dir: 'left',
      talk: (s) => s.say('Sentry Rook', s.flag('c6_gate_open') ? ['Warden says you\'re going east. Alone.', 'I\'ll keep the soup warm. Hale says I\'m not to say that. I said it anyway.'] : ['East gate\'s shut. Strait\'s shut. Everything east of here\'s shut.', 'Warden Hale\'s orders. Big hull, north side.']) },
    { id: 'maela', name: 'Maela', look: 'maela', x: 14, y: 13, dir: 'down', hint: 'Talk', run: (s) => CH6.maela(s) },
    { id: 'pell', name: 'Pell', look: 'pell', x: 12, y: 14, wander: 1, cond: f('c6_maela'), run: (s) => CH6.pell(s) },
    { id: 'orla', name: 'Orla', look: 'orla', x: 27, y: 28, dir: 'up', run: (s) => CH6.orla(s) },
    { id: 'gus', name: 'Gus the Salvager', look: 'gus', x: 26, y: 13, dir: 'down', hint: 'Shop',
      run: async (s) => { await s.say('Gus the Salvager', ['Salvage and sundries! Everything I sell fell out of the sky, so it\'s all slightly dented.', 'Some of it\'s even better than new. The sky\'s full of dead rich men\'s luggage.']); await s.shop('c6_salvage'); } },
    { id: 'cinder', name: 'Brother Cinder', look: 'cinder', x: 36, y: 21, dir: 'down', cond: (st) => !st.flags.c6_cinder_mended, run: (s) => CH6.cinder(s) },
    { id: 'aldo', name: 'Brother Cinder', look: 'cinder', x: 15, y: 15, dir: 'up', cond: f('c6_cinder_mended'), run: (s) => CH6.cinder(s) },
    { id: 'linnet', name: 'Linnet', look: 'linnet', x: 41, y: 6, dir: 'down', hint: 'Kite-post', run: (s) => CH6.linnet(s) },
    { id: 'gannet', name: 'Mother Gannet', look: 'gannet', x: 30, y: 26, dir: 'left',
      talk: (s) => s.say('Mother Gannet', ['Seven wounds in the sky, child. I count them every hour. Somebody has to.', 'Six of them bleed white. One bleeds gold — far to the west, low down, near where Lanternfall was.', 'Somebody over there is still holding on to something. Holding very, very hard.']) },
    { id: 'haskel', name: 'Haskel', look: 'villager_29', x: 8, y: 19, dir: 'up',
      talk: ['Twenty years a sailor out of Port Gale. Now look up. No — UP. See that shimmer, past the wounds?', 'That\'s the sea. All of it. Hanging up there, upside down, fish and all.', 'Now and then a fish falls out. Free dinner, if it doesn\'t land on you.'] },
    { id: 'dunn', name: 'Dunn', look: 'villager_33', x: 12, y: 22, dir: 'down',
      talk: ['Ash-potatoes. They grow in anything. Taste of nothing. Keep you alive.', 'Like most things now, I suppose.'] },
    { id: 'kip', name: 'Kip', look: 'villager_13', x: 21, y: 23, wander: 1,
      talk: (s) => s.say('Kip', s.flag('c6_cinder_mended') ? ['We\'re playing Lost Wall! Kay writes letters and I deliver them. It\'s way better than the other game.'] : ['We\'re playing Catch the Keeper\'s Girl! You be her! You have to run, and if we catch you, we throw you off the edge!', '...PRETEND off the edge. Kay always cries if it\'s real off the edge.']) },
    { id: 'kay', name: 'Kay', look: 'villager_20', x: 22, y: 23, wander: 1,
      talk: ['I don\'t like that game. I think the Keeper\'s girl was probably just sad.', 'Mama says sad people do stupid things. Mama did one once. She married Papa.'] },
    { id: 'jessamy', name: 'Jessamy', look: 'villager_42', x: 31, y: 14, dir: 'down',
      talk: (s) => s.say('Jessamy', ['Trader, out of Kiteholm. North, past the wind-stacks. Town of kites and scrap.', 'There\'s a gang of orphans runs the scrap-yards there. Boss is a boy — twelve, maybe. Mouth like a sailor, fingers like a magpie. He took my purse, then gave it back because I "looked like I needed it more."', 'And a big blond sellsword who drinks too much and cries at sea shanties. Kiteholm\'s a strange place.']) },
    { id: 'ambrose', name: 'Ambrose', look: 'villager_50', x: 24, y: 32, dir: 'down',
      talk: ['I come out here to the edge every morning and I count to a hundred.', 'I don\'t jump. I just count. Then I go back and eat my soup.', 'It\'s a good number, a hundred. You should try it.'] },
  ],
  inspect: [
    { x: 25, y: 14, hint: 'Bounties', run: (s) => CH6.board(s) },
    { x: 24, y: 27, text: 'Letters, pinned three deep. "MAMA — I\'M ON THE BIG ROCK. THERE\'S SOUP." "TO WHOEVER HAS MY DOG: HIS NAME IS BISCUIT."' },
    { x: 26, y: 27, text: '"DAD — I KEPT THE BOAT. I KEPT IT. COME AND SEE." "To Corporal Hask, if you\'re alive: I forgive you for the thing with the goat."' },
    { x: 28, y: 27, hint: 'Lost Wall', run: (s) => s.narrate(s.flag('c6_own_letter') ? 'Right in the middle of the wall: "Dear Sun." And beside it, a small square of paper signed only "— W."' : 'Hundreds of letters to people nobody can find. The paper rustles in the ash-wind like a flock of birds that cannot quite take off.') },
    { x: 30, y: 27, text: '"Bram — if a girl with red hair asks, tell her I\'m sorry I never wrote back." The handwriting is shaky. There\'s no name.' },
    { x: 13, y: 13, text: 'Maela\'s kettle. Big enough to bathe a pony in. Always full. Always grey.' },
  ],
  exits: [
    { x: 0, y: 16, h: 2, to: 'c6_drift', tx: 64, ty: 15, dir: 'left' },
    { x: 49, y: 16, h: 2, to: 'c6_shattered_sea', tx: 2, ty: 20, dir: 'right' },
  ],
  triggers: [
    { id: 'c6_cinder_gate', x: 40, y: 15, w: 5, h: 4, once: false, cond: (st) => st.flags.c6_gate_open && !st.flags.c6_cinder_scene && !st.flags.c6_cinder_mended, run: (s) => CH6.cinderScene(s) },
  ],
  onEnter: (s) => CH6.keelGate(s),
};

/** @type {import('../../types/data').MapDef} */
export const c6KeelInn = {
  ...KEEL_INN, ...interior,
  id: 'c6_keel_inn', name: 'The Upturned Keel', music: 'town',
  npcs: [
    { id: 'wynn', name: 'Wynn', look: 'villager_38', x: 7, y: 2, dir: 'down', hint: 'Rest',
      run: async (s) => { await s.say('Wynn', 'A cot and a cup of something hot. Forty gold. The beds are hammocks. Don\'t ask what the hammocks used to be.'); await s.inn(40, 'the Upturned Keel'); } },
    { id: 'drinker', name: 'Old Drinker', look: 'villager_61', x: 5, y: 6, dir: 'right',
      talk: ['There was a sky-captain through here, back in the spring. Tried to buy a whole barrel of rum on a promise.', 'Said he had a ship. Said she was grounded at some place called the Roost. Said a lot of things. Sang most of them.'] },
    { id: 'gambler', name: 'Card Player', look: 'villager_26', x: 11, y: 6, dir: 'left',
      talk: ['We play for ash-potatoes. Stakes are high. Very high. I\'m down eleven potatoes.', 'Funny. Nothing to buy, and we still gamble. People are strange.'] },
  ],
  inspect: [{ x: 6, y: 3, text: 'The bar: a ship\'s rail laid across two barrels. A brass bell hangs over it. Nobody rings it. Nobody likes bells anymore.' }],
  exits: [{ x: 6, y: 9, to: 'c6_keelhaven', tx: 11, ty: 9, dir: 'down' }],
};

/** @type {import('../../types/data').MapDef} */
export const c6KeelHall = {
  ...KEEL_HALL, ...interior,
  id: 'c6_keel_hall', name: 'Warden\'s Hall', music: 'ruin',
  npcs: [
    { id: 'hale', name: 'Warden Hale', look: 'hale', x: 6, y: 4, dir: 'down', run: (s) => CH6.hale(s) },
    { id: 'ottilie', name: 'Sister Ottilie', look: 'ottilie', x: 10, y: 4, dir: 'left', run: (s) => CH6.ottilie(s) },
  ],
  inspect: [
    { x: 6, y: 3, text: 'A chart of the Shattered Sea, drawn on the back of a sail. Shards marked in charcoal. Most of them have notes: HOUNDS. GLASS. DON\'T. One, far to the east, just says: AURENNE? and underneath, smaller: HOSPITAL.' },
    { x: 9, y: 3, text: 'A man asleep under a thin blanket. A grey patch has crept up his neck like frost on a window. Gloam-rot.' },
  ],
  exits: [{ x: 6, y: 8, to: 'c6_keelhaven', tx: 34, ty: 8, dir: 'down' }],
};

// ------------------------------------------------------------------ the Shattered Sea
const winchDone = (st) => st.flags.c6_winch_a && st.flags.c6_winch_b;

/** @type {import('../../types/data').MapDef} */
export const c6ShatteredSea = {
  ...SEA, ...RUIN,
  id: 'c6_shattered_sea', name: 'The Shattered Sea', region: 'The Strait That Was',
  camera: { dist: 22, pitch: 0.7 },
  encounters: { rate: 1.0, cond: (st) => !st.flags.c6_done,
    troops: [['c6_sea_golem', 2], ['c6_sea_crawlers', 3], ['c6_sea_eel', 3], ['c6_sea_wisps', 2], ['c6_sea_eye', 2], ['c6_sea_sailors', 2], ['c6_sea_mimic', 1]] },
  blockers: [
    { id: 'c6_chain_a', x: 34, y: 20, w: 1, h: 2, prop: 'fence' },
    { id: 'c6_chain_b', x: 37, y: 20, w: 1, h: 2, prop: 'fence' },
  ],
  chests: [
    { id: 'c6_ss1', x: 22, y: 6, item: 'c6_letter_sun' },
    { id: 'c6_ss2', x: 8, y: 8, item: 'starsteel_claymore' },
    { id: 'c6_ss3', x: 31, y: 35, item: 'c6_letter_teo' },
    { id: 'c6_ss4', x: 19, y: 39, item: 'spirit_fruit' },
    { id: 'c6_ss5', x: 6, y: 7, gold: 2500 },
    { id: 'c6_ss6', x: 48, y: 5, item: 'x_tonic' },
    { id: 'c6_ss7', x: 26, y: 23, item: 'mega_tonic', count: 2 },
    { id: 'c6_ss8', x: 47, y: 22, item: 'power_fruit' },
  ],
  npcs: [
    { id: 'quill', name: 'Old Quill', look: 'villager_63', x: 22, y: 23, dir: 'down',
      talk: (s) => s.say('Old Quill', winchDone(s.state) ? ['Bridge is down. Gods help you.', 'If you see the Unmoored... don\'t look it in the eye. It looks back. It remembers things.'] : ['Salvager. Was. North spoke\'s the Chainyard — winch is on the old deck. South spoke\'s the Psalm — winch is in the deckhouse.', 'Turn both and the strait bridge comes down. I\'d do it myself, but I like being alive. It\'s a habit.']) },
  ],
  inspect: [
    { x: 29, y: 4, hint: 'Winch', run: (s) => CH6.winch(s, 'a') },
    { x: 28, y: 36, hint: 'Winch', run: (s) => CH6.winch(s, 'b') },
    { x: 20, y: 38, hint: 'Hymnal', run: (s) => CH6.hymnal(s) },
    { x: 17, y: 38, hint: 'Banner', run: (s) => CH6.silk(s) },
    { x: 24, y: 36, text: 'The Gilded Psalm\'s mainmast, snapped off at the deck. Gold leaf still clings to it. The Choir built its ships to be looked at.' },
    { x: 34, y: 20, text: 'A chain-lock as big as a barrel, padlocked to the bridge. The chain runs away north, toward the Chainyard.', cond: (st) => !st.flags.c6_winch_a },
    { x: 37, y: 20, text: 'A second chain-lock. This chain runs south, toward the wreck of the Psalm.', cond: (st) => !st.flags.c6_winch_b },
  ],
  triggers: [
    { id: 'c6_glassback', x: 2, y: 2, w: 9, h: 8, once: false, cond: (st) => !st.flags.c6_glassback, run: (s) => CH6.glassback(s) },
    { id: 'c6_lidless', x: 41, y: 3, w: 11, h: 6, once: false, cond: (st) => !st.flags.c6_lidless, run: (s) => CH6.lidless(s) },
    { id: 'c6_hearth', x: 40, y: 18, w: 9, h: 7, run: (s) => CH6.hearth(s) },
    { id: 'c6_unmoored', x: 54, y: 17, w: 4, h: 8, once: false, cond: (st) => !st.flags.c6_brinefang, run: (s) => CH6.brinefang(s) },
    { id: 'c6_far', x: 68, y: 19, w: 4, h: 4, once: false, cond: (st) => st.flags.c6_brinefang && !st.flags.c6_done, run: (s) => CH6.farShore(s) },
  ],
  exits: [{ x: 0, y: 20, h: 2, to: 'c6_keelhaven', tx: 47, ty: 16, dir: 'left' }],
  onEnter: (s) => CH6.seaIn(s),
};

export const CH6_MAPS = [shardHermitage, c6HermitShard, c6Drift, c6Keelhaven, c6KeelInn, c6KeelHall, c6ShatteredSea];
