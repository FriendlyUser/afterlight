// The Halcyon — the party's airship and Act III hub: the deck and below decks.
import DECK from './layouts/halcyon_deck.js';
import HOLD from './layouts/c11_halcyon_hold.js';
import { CH11, HOLD_CREW, spawnCrew } from '../../story/ch11.js';

const deck = {
  ...DECK,
  id: 'halcyon_deck', name: 'The Halcyon', region: 'Above the Ruin',
  mood: (st) => (st.flags.c11_storm_now ? 'storm' : st.flags.c11_eve ? 'night' : 'dusk'),
  music: (st) => (st.flags.c11_storm_now ? 'tension' : st.flags.c11_eve ? 'lanternfall' : 'ruin'),
  backdrop: { plane: '#3a2440', y: -10 },
  battleBg: 'deck', camera: { dist: 18, pitch: 0.7 },
  particles: (st) => (st.flags.c11_storm_now ? 'rain' : 'embers_soft'),
  signs: [{ x: 14, y: 13, text: 'THE HALCYON — Capt. C. Ashe.\nGangplank. Mind the gap. The gap is the whole sky.' }],
  npcs: [
    { id: 'mags', name: 'Mags', look: 'c11_mags', x: 19, y: 9, dir: 'down', hint: 'Shop', run: (s) => CH11.magsTalk(s) },
  ],
  inspect: [
    { x: 1, y: 8, hint: 'Look west', run: (s) => CH11.sternView(s) },
    { x: 1, y: 9, hint: 'Look west', run: (s) => CH11.sternView(s) },
    { x: 25, y: 8, text: 'The bow cuts through cloud the color of a bruise. Below: nothing at all, for a very long way.' },
    { x: 8, y: 6, text: 'The mainmast. Someone has carved PIP into it at a height that suggests standing on a barrel. Below it, smaller: CORVIN SAYS NO.' },
    { x: 17, y: 6, text: 'The foremast. A patched sail, a patched patch, and a single kite tangled in the rigging.' },
  ],
  exits: [{ x: 12, y: 18, w: 2, to: '@world' }],
  onEnter: (s) => CH11.deckEnter(s),
};

const hold = {
  ...HOLD,
  id: 'c11_halcyon_hold', name: 'Below Decks', mood: 'interior', music: 'inn',
  camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'dust', battleBg: 'deck',
  npcs: [
    { id: 'nell', name: 'Nell', look: 'c11_nell', x: 20, y: 4, dir: 'up', hint: 'Forge', run: (s) => CH11.nellTalk(s) },
  ],
  inspect: [
    { x: 15, y: 2, hint: 'Rest', run: (s) => CH11.bunks(s) },
    { x: 13, y: 2, hint: 'Rest', run: (s) => CH11.bunks(s) },
    { x: 17, y: 2, hint: 'Rest', run: (s) => CH11.bunks(s) },
    { x: 4, y: 3, text: 'Corvin\'s chart table. Under the charts, a small painting of a woman in a Dawnguard sky-wing coat, laughing at whoever held the brush. On the back: "H.M. — don\'t you DARE frame this." It is framed.' },
    { x: 2, y: 2, text: 'Corvin\'s books: "Navigation for the Reluctant," "Debts and How to Outlive Them," and a much-read book of children\'s bedtime stories with the price still on it.' },
    { x: 7, y: 2, text: 'Ilse\'s stove. Something is simmering. It smells like home, if home were mostly onions.' },
    { x: 8, y: 2, text: 'Ilse\'s shelf: bandages rolled tight, tinctures labelled in tiny exact handwriting. One jar just says: PIP. NO.' },
    { x: 20, y: 2, text: 'Nell\'s forge, built into the ship\'s boiler. It runs on coal, spite and, lately, the heat of a Sun Shard on a long chain.' },
  ],
  exits: [{ x: 11, y: 10, w: 2, to: 'halcyon_deck', tx: 13, ty: 5, dir: 'down' }],
  onEnter: async (s) => { spawnCrew(s, HOLD_CREW); },
};

export const HALCYON_MAPS = [deck, hold];
