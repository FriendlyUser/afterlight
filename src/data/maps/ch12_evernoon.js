// Chapter 12 — Evernoon: the gate, the frozen festival, the night of the spill,
// the Noon Stair and the Noon Throne. Layouts: tools/maps/ch12_evernoon.py.
import GATE from './layouts/evernoon_gate.js';
import STREETS from './layouts/c12_streets.js';
import MEMORY from './layouts/c12_memory.js';
import STAIR from './layouts/c12_stair.js';
import THRONE from './layouts/c12_throne.js';
import { C12 } from '../../story/ch12.js';
import { C12F } from '../../story/ch12_finale.js';

const f = (name) => (st) => !!st.flags[name];
const clear = (st) => !!st.flags.gameClear;

// =====================================================================
// The Gate of Evernoon (entry map)
// =====================================================================
/** @type {import('../../types/data').MapDef} */
const gate = {
  ...GATE,
  id: 'evernoon_gate', name: 'The Gate of Evernoon', region: 'The Noon Spire',
  mood: (st) => (clear(st) ? 'c12_newdawn' : 'gloam'),
  music: (st) => (clear(st) ? 'afterlight' : 'gloam'),
  battleBg: 'gloam', treeType: 'tree_dead',
  backdrop: { plane: '#140a22', y: -6 },
  encounters: {
    rate: 1, bg: 'gloam', onTiles: 'aur', cond: (st) => !clear(st),
    troops: [['c12g_hounds', 3], ['c12g_revel', 3], ['c12g_golem', 2], ['c12g_wisps', 2], ['c12g_mix', 2]],
  },
  npcs: [
    { id: 'mott', name: 'Mott', look: 'c12_mott', x: 32, y: 26, dir: 'down', hint: 'Shop', cond: (st) => !clear(st), run: (s) => C12.mott(s) },
    { id: 'anselm', name: 'Brother Anselm', look: 'acolyte', x: 7, y: 22, dir: 'down', cond: (st) => !clear(st), run: (s) => C12.anselm(s) },
  ],
  chests: [
    { id: 'c12_gate1', x: 4, y: 23, item: 'mountainfall' },
    { id: 'c12_gate2', x: 35, y: 12, item: 'phoenix_charm' },
    { id: 'c12_gate3', x: 36, y: 29, item: 'gale_bomb', count: 3 },
    { id: 'c12_gate4', x: 12, y: 37, item: 'x_ether', count: 2 },
  ],
  blockers: [{ id: 'gate_seal', x: 19, y: 7, w: 3, h: 1, prop: 'crystal' }],
  inspect: [
    { x: 14, y: 10, text: 'A statue of the Hierophant as a young man, arms open. The plinth reads: HE WHO KEPT THE LIGHT. Someone has scratched underneath: AND KEPT IT. AND KEPT IT.' },
    { x: 26, y: 10, text: 'A statue of a girl of ten holding a book against her chest. The plinth has no name on it. It doesn\'t need one.' },
    { x: 20, y: 8, cond: (st) => !st.flags.c12_gate_open, text: 'Seven sockets are set into the paving before the arch, each shaped like a jagged piece of something round.' },
    { x: 8, y: 20, text: 'A belfry bell, toppled and cracked. Its clapper has been removed and laid neatly beside it, like a sleeping child.' },
    { x: 29, y: 29, text: 'A Vesper soldier\'s helmet, half-buried in ash. Inside, a folded note: "Mira — if the sun really stops, I\'ll be home for supper forever. Save me a seat." The ink has faded to violet.' },
    { x: 20, y: 9, cond: clear,
      text: 'A small stone at the foot of the arch. Two names, carved by an unpracticed hand: LYSA LORNE. CASSIAN LORNE. Underneath, smaller: "Now they both know where the sun goes."' },
  ],
  triggers: [
    { id: 'c12_gate', x: 16, y: 8, w: 9, h: 2, once: false, cond: (st) => st.flags.c12_arrived && !st.flags.c12_gate_open, run: (s) => C12.openGate(s) },
  ],
  exits: [
    { x: 19, y: 3, w: 3, h: 2, to: 'c12_streets', tx: 26, ty: 43, dir: 'up', cond: (st) => !clear(st),
      blocked: async (s) => { await s.narrate('Beyond the arch there is only a bright, ordinary morning, and a long way down.'); await s.step('player', 0, 2); } },
    { x: 19, y: 43, w: 3, h: 1, to: '@world', cond: clear,
      blocked: async (s) => {
        await s.say('Corvin', 'Halcyon\'s staying tied off till this is done, sparrow. No coming back — you said it yourself.');
        await s.step('player', 0, -2);
      } },
  ],
  onEnter: async (s) => {
    if (s.flag('gameClear')) {
      if (!s.flag('c12_postgame_visit')) {
        s.setFlag('c12_postgame_visit');
        await s.narrate('Where Evernoon stood there is only the shard, and the wall, and a quiet morning under the new sun. The golden afternoon is gone. Nobody misses it as much as they thought they would.');
      }
      return;
    }
    await C12.arrive(s);
  },
};

// =====================================================================
// Evernoon — the festival streets
// =====================================================================
const dancer = (n, look, x, y) => ({ id: `dancer${n}`, name: 'Dancer', look, x, y, dir: 'down', cond: (st) => !st.flags.c12_procession_moved, run: (s) => C12.procession(s) });
const dancerAside = (n, look, x, y, dir) => ({ id: `dancer${n}_aside`, name: 'Dancer', look, x, y, dir, cond: f('c12_procession_moved'),
  talk: ['The dancer smiles at you. Somewhere, faintly, a clock is ticking.'] });

/** @type {import('../../types/data').MapDef} */
const streets = {
  ...STREETS,
  id: 'c12_streets', name: 'Evernoon', region: 'Aurenne, Forty Summers Ago',
  mood: 'evernoon', music: 'evernoon', battleBg: 'evernoon', treeType: 'tree_cherry', particles: 'motes_gold',
  encounters: {
    rate: 0.8, bg: 'evernoon', onTiles: ';.:',
    troops: [['c12s_lanterns', 3], ['c12s_sentinels', 2], ['c12s_carousel', 3], ['c12s_confetti', 2], ['c12s_mix', 2], ['c12s_mimic', 0.5]],
  },
  npcs: [
    { id: 'herald', name: 'Herald', look: 'c12_herald', x: 26, y: 36, dir: 'down',
      talk: ['Welcome, welcome, to the Festival of Long Light! The longest day of the year!', '...', 'Welcome, welcome, to the Festival of Long Light! The longest day of the year!'] },
    { id: 'bettany', name: 'Bettany', look: 'c12_bettany', x: 20, y: 38, dir: 'down', hint: 'Shop',
      run: async (s) => {
        await s.say('Bettany', 'Lemonade! Fresh lemonade! And... swords, apparently. I don\'t remember stocking swords. I don\'t remember stocking anything.');
        await s.shop('c12_bettany');
        await s.say('Bettany', 'Funny. Same lemon. I\'ve been squeezing the same lemon all afternoon.');
      } },
    { id: 'pim', name: 'Old Pim', look: 'villager_17', x: 18, y: 41, dir: 'right',
      talk: ['Lovely afternoon. Lovely.', 'I keep meaning to go home for supper. Mira will have the soup on.', 'Lovely afternoon.'] },
    { id: 'lover_a', name: 'Sweetheart', look: 'villager_6', x: 22, y: 41, dir: 'right',
      run: async (s) => {
        await s.narrate('Two sweethearts lean toward each other. They have been leaning toward each other for forty years.');
        await s.say('Pip', 'Just KISS already.');
        await s.say('Corvin', 'Let them have it, kid. Some moments are worth taking slow.');
        await s.say('Ilse', 'Forty years is not slow, Corvin. Forty years is a medical condition.');
      } },
    { id: 'lover_b', name: 'Sweetheart', look: 'villager_11', x: 23, y: 41, dir: 'left', talk: ['...'] },
    { id: 'juggler', name: 'Juggler', look: 'villager_25', x: 29, y: 39, dir: 'down',
      run: async (s) => {
        await s.narrate('Three balls in the air above the juggler\'s hands. They never come down. They never go up, either.');
        await s.say('Pip', 'That\'s the worst thing I\'ve ever seen.');
      } },
    { id: 'choirboy', name: 'Choirboy', look: 'villager_30', x: 31, y: 36, dir: 'down',
      run: async (s) => {
        await s.say('Choirboy', 'Laaaaaaaaaaaaaa—');
        await s.narrate('He is holding the first note of the Dawnsong. He has been holding it for forty years. He has not taken a breath.');
      } },
    { id: 'gossip', name: 'Gossip', look: 'villager_38', x: 16, y: 33, dir: 'right',
      talk: ['Did you hear? The Keeper\'s little girl has been asking about the purple lights by the old wall. Such a curious child.', 'Somebody ought to keep an eye on her tonight.'] },
    { id: 'auntie', name: 'Auntie Bel', look: 'villager_44', x: 28, y: 42, dir: 'left',
      run: async (s) => {
        if (!s.state.party.includes('sable')) return s.say('Auntie Bel', 'Have you seen Miss Lysa? Her brother\'s looking all over.');
        await s.say('Auntie Bel', 'Miss Lysa! There you are, love. Your brother\'s been looking all over for you.');
        await s.say('Sable', 'I am not her.');
        await s.say('Auntie Bel', 'Miss Lysa! There you are, love.');
      } },
    { id: 'haberdasher', name: 'Haberdasher', look: 'villager_52', x: 13, y: 16, dir: 'down', run: (s) => C12.haberdasher(s) },
    { id: 'fruiter', name: 'Fruit Seller', look: 'villager_19', x: 9, y: 16, dir: 'down',
      talk: ['Apples! Apples that never brown!', 'I\'d eat one, only then there\'d be one fewer. And I don\'t know how to grow more.'] },
    { id: 'sel', name: 'Lucky Sel', look: 'c12_sel', x: 5, y: 26, dir: 'up', run: (s) => C12.sel(s) },
    { id: 'drinker', name: 'Regular', look: 'villager_47', x: 3, y: 26, dir: 'right',
      talk: ['Sel\'s been about to win since lunch. Never shows his hand.', 'Somebody ought to call him. Not me. I\'m comfortable.'] },
    { id: 'aldous', name: 'Squire Venn', look: 'c12_aldous_young', x: 44, y: 7, dir: 'down', run: (s) => C12.aldous(s) },
    { id: 'sergeant', name: 'Sergeant', look: 'c12_sergeant', x: 41, y: 7, dir: 'down',
      talk: ['Squire Venn! Eyes front! You\'ll have the Lantern plaza tonight, lad, and the Keeper won\'t want a squire who fidgets.', 'Tonight. Ha. As if tonight\'s ever coming.'] },
    { id: 'ringer', name: 'Bell-Ringer', look: 'villager_56', x: 10, y: 5, dir: 'left',
      talk: ['Can\'t ring her. Rope\'s stuck fast.', 'You don\'t ring at noon, see. You ring at the turning of the hour. And the hour never turns.'] },
    { id: 'hollin', name: 'Hollin', look: 'c12_hollin', x: 4, y: 7, dir: 'down', run: (s) => C12.hollin(s) },
    { id: 'tomas', name: 'Tomas', look: 'c12_tomas', x: 38, y: 29, dir: 'up', run: (s) => C12.tomas(s) },
    { id: 'fen', name: 'Fen', look: 'c12_fen', x: 35, y: 23, dir: 'down', run: (s) => C12.fen(s) },
    { id: 'dawe', name: 'Mother Dawe', look: 'c12_dawe', x: 34, y: 40, dir: 'down', run: (s) => C12.dawe(s) },
    { id: 'tag1', name: 'Child', look: 'villager_58', x: 40, y: 32, dir: 'right', talk: ['You\'re it! ...You\'re it! ...You\'re it!'] },
    { id: 'tag2', name: 'Child', look: 'villager_61', x: 42, y: 32, dir: 'left', talk: ['I\'m not it. I\'ve never been it. I\'m never going to be it.'] },
    dancer(1, 'c12_dancer_a', 24, 10), dancer(2, 'c12_dancer_b', 25, 10), dancer(3, 'c12_dancer_c', 26, 10),
    dancer(4, 'c12_dancer_a', 27, 10), dancer(5, 'c12_dancer_b', 28, 10),
    dancerAside(1, 'c12_dancer_a', 22, 12, 'right'), dancerAside(2, 'c12_dancer_b', 21, 12, 'right'), dancerAside(3, 'c12_dancer_c', 30, 13, 'left'),
    dancerAside(4, 'c12_dancer_a', 31, 12, 'left'), dancerAside(5, 'c12_dancer_b', 32, 12, 'left'),
  ],
  chests: [
    { id: 'c12_st1', x: 49, y: 8, item: 'dawnguard_regalia' },
    { id: 'c12_st2', x: 3, y: 10, item: 'wall_of_dawn' },
    { id: 'c12_st3', x: 48, y: 33, item: 'godhand' },
    { id: 'c12_st4', x: 2, y: 44, item: 'elixir', count: 2 },
    { id: 'c12_st5', x: 49, y: 44, item: 'power_fruit', count: 2 },
  ],
  inspect: [
    { x: 11, y: 30, hint: 'Sundial', run: (s) => C12.sundial(s, 'market') },
    { x: 44, y: 29, hint: 'Sundial', run: (s) => C12.sundial(s, 'garden') },
    { x: 8, y: 8, hint: 'Sundial', run: (s) => C12.sundial(s, 'bell') },
    { x: 16, y: 30, hint: 'Books', run: (s) => C12.bookstall(s) },
    { x: 17, y: 30, hint: 'Books', run: (s) => C12.bookstall(s) },
    { x: 26, y: 40, hint: 'Fountain', run: (s) => C12.fountain(s) },
    { x: 21, y: 7, hint: 'Bench', run: (s) => C12.honeycakes(s) },
    { x: 8, y: 6, text: 'The bell tower. Its great bell hangs at the top of the swing, about to fall back and ring the hour. It has been about to for forty years.' },
    { x: 40, y: 8, text: 'An anvil with a half-forged sword on it, still glowing. The smith\'s hammer hangs in the air just above it.' },
  ],
  exits: [{ x: 24, y: 45, w: 5, h: 1, to: 'evernoon_gate', tx: 20, ty: 6, dir: 'down' }],
  onEnter: (s) => C12.streetsIntro(s),
};

// =====================================================================
// The night of the spill (Cassian's memory)
// =====================================================================
const before = (st) => st.flags.c12_mem_enter && !st.flags.c12_mem_lost;
/** @type {import('../../types/data').MapDef} */
const memory = {
  ...MEMORY,
  id: 'c12_memory', name: 'The Night of the Spill', region: 'Cassian\'s Memory',
  mood: 'gloam', music: (st) => (st.flags.c12_mem_lost ? 'sad' : 'gloam'), battleBg: 'gloam', particles: 'gloam',
  encounters: {
    rate: 1, bg: 'gloam', onTiles: ';_our', cond: (st) => !st.flags.c12_mem_lost || st.flags.c12_mem_done,
    troops: [['c12m_forgotten', 3], ['c12m_tide', 2], ['c12m_mix', 3], ['c12m_hounds', 2]],
  },
  npcs: [
    { id: 'm_cass', name: 'Cass', look: 'cassian_young', x: 18, y: 19, dir: 'up', cond: before,
      talk: (s) => s.say('Cass', ['Lysa! LYSA!', 'She\'s not by the old wall. The lights are all over the plaza now. Please — please hurry.']) },
    { id: 'm_lysa', name: 'Lysa', look: 'lysa', x: 22, y: 10, dir: 'up', cond: before,
      talk: (s) => s.say('Lysa', 'It\'s so pretty...') },
    { id: 'm_cass_kneel', name: 'Cass', look: 'cassian_young', x: 22, y: 12, dir: 'up',
      cond: (st) => st.flags.c12_mem_lost && !st.flags.c12_mem_done, run: (s) => C12.understand(s) },
    { id: 'm_aurel', name: 'Aurel', look: 'c12_aurel', x: 24, y: 7, dir: 'down', cond: f('c12_mem_lost'), run: (s) => C12.aurel(s) },
    { id: 'folk1', name: 'Frightened Man', look: 'villager_27', x: 16, y: 24, dir: 'right', cond: before,
      talk: ['Get indoors! The Lantern\'s guttering — the dark\'s coming up through the drains!'] },
    { id: 'folk2', name: 'Mother', look: 'villager_36', x: 28, y: 35, dir: 'left', cond: before,
      talk: ['Hush, hush. Keep your eyes shut, sweetheart. If you don\'t look at it, it can\'t see you.'] },
    { id: 'watchman', name: 'Old Watchman', look: 'villager_50', x: 24, y: 26, dir: 'down', cond: before,
      talk: ['Forty years I\'ve walked this street, and I\'ve never once seen the Lantern flicker.', 'It\'s flickering.'] },
    { id: 'm_aldous', name: 'Squire Venn', look: 'c12_aldous_young', x: 14, y: 16, dir: 'up', cond: f('c12_q_aldous_done'), run: (s) => C12.youngAldousNight(s) },
  ],
  chests: [
    { id: 'c12_mem1', x: 4, y: 35, item: 'dawnsong_lyre' },
    { id: 'c12_mem2', x: 39, y: 34, item: 'the_last_chronicle' },
    { id: 'c12_mem3', x: 40, y: 18, item: 'breakers_gem' },
    { id: 'c12_mem4', x: 2, y: 46, item: 'megalixir' },
  ],
  inspect: [
    { x: 8, y: 30, hint: 'Logbook', run: (s) => C12.lorneJournal(s) },
    { x: 6, y: 33, text: 'A chalk drawing on the flagstones: the sun, with a little door drawn in its side. Underneath, in a child\'s capitals: WHERE DOES IT GO?' },
    { x: 34, y: 30, text: 'A child\'s white shoe, the buckle undone. It is facing the wall, as if whoever wore it walked straight on without it.' },
    { x: 37, y: 24, text: 'Here the old city wall is thinnest. The stones don\'t meet. Through the cracks, violet light, and a sound like the sea a long way down.' },
    { x: 22, y: 11, cond: f('c12_mem_lost'),
      text: 'Lysa\'s ribbon, on the cobbles. When Sable reaches for it, it isn\'t there. It was never really there.' },
  ],
  triggers: [
    { id: 'c12_rift', x: 8, y: 15, w: 28, h: 2, once: false, cond: before, run: (s) => C12.rift(s) },
  ],
  exits: [{ x: 19, y: 47, w: 7, h: 1, to: 'c12_streets', tx: 26, ty: 6, dir: 'down' }],
  onEnter: (s) => C12.memoryIntro(s),
};

// =====================================================================
// The Noon Stair (Hearthstone + last camp)
// =====================================================================
/** @type {import('../../types/data').MapDef} */
const stair = {
  ...STAIR,
  id: 'c12_stair', name: 'The Noon Stair', region: 'Evernoon',
  mood: 'evernoon', music: (st) => (st.flags.c12_camp && !st.flags.c12_camp_rested ? 'lanternfall' : 'evernoon'),
  battleBg: 'evernoon', particles: 'motes_gold', treeType: 'tree_cherry', camera: { dist: 19, pitch: 0.7 },
  encounters: {
    rate: 0.9, bg: 'evernoon', onTiles: 'Mx', cond: (st) => !st.flags.c12_camp || st.flags.c12_camp_rested,
    troops: [['c12t_seraph', 3], ['c12t_knights', 2], ['c12t_mix', 3], ['c12t_watchers', 2]],
  },
  chests: [
    { id: 'c12_sta1', x: 10, y: 37, item: 'x_tonic', count: 3 },
    { id: 'c12_sta2', x: 25, y: 37, item: 'dawn_plume', count: 2 },
    { id: 'c12_sta3', x: 3, y: 30, item: 'champions_belt' },
    { id: 'c12_sta4', x: 32, y: 30, item: 'archmage_ring' },
    { id: 'c12_sta5', x: 6, y: 4, item: 'crown_of_dawn' },
    { id: 'c12_sta6', x: 29, y: 4, item: 'megalixir' },
  ],
  blockers: [{ id: 'bell_gate', x: 16, y: 20, w: 4, h: 1, prop: 'pillar' }],
  inspect: [
    { x: 3, y: 21, hint: 'Bell', run: (s) => C12.bell(s, 'w') },
    { x: 32, y: 21, hint: 'Bell', run: (s) => C12.bell(s, 'e') },
    { x: 4, y: 23, run: (s) => C12.statue(s, 'fisher') },
    { x: 6, y: 23, run: (s) => C12.statue(s, 'aldous') },
    { x: 8, y: 23, run: (s) => C12.statue(s, 'tamsin') },
    { x: 10, y: 23, run: (s) => C12.statue(s, 'fisher') },
    { x: 6, y: 26, run: (s) => C12.statue(s, 'edrin') },
    { x: 10, y: 26, run: (s) => C12.statue(s, 'lysa') },
    { x: 8, y: 29, run: (s) => C12.statue(s, 'ysolde') },
    { x: 4, y: 26, run: (s) => C12.statue(s, 'fisher') },
    { x: 26, y: 21, run: (s) => C12.statue(s, 'letters') },
    { x: 28, y: 21, run: (s) => C12.statue(s, 'wren_letters') },
    { x: 30, y: 21, run: (s) => C12.statue(s, 'drafts') },
    { x: 28, y: 25, run: (s) => C12.statue(s, 'unsent') },
    { x: 22, y: 10, hint: 'Rest', run: (s) => C12.rest(s) },
  ],
  triggers: [
    { id: 'c12_camp', x: 5, y: 14, w: 26, h: 2, once: false, cond: (st) => st.flags.c12_bell_w && st.flags.c12_bell_e && !st.flags.c12_camp, run: (s) => C12.camp(s) },
  ],
  exits: [
    { x: 16, y: 43, w: 4, h: 1, to: 'c12_memory', tx: 22, ty: 5, dir: 'down' },
    { x: 16, y: 1, w: 4, h: 1, to: 'c12_throne', tx: 15, ty: 26, dir: 'up', cond: f('c12_camp_rested'),
      blocked: async (s) => { await s.say('Wren', s.flag('c12_camp') ? 'Not yet. Everyone\'s by the fire. One last night first.' : 'Not like this. We should catch our breath first.'); await s.step('player', 0, 1); } },
  ],
  onEnter: (s) => C12.stairIntro(s),
};

// =====================================================================
// The Noon Throne
// =====================================================================
/** @type {import('../../types/data').MapDef} */
const throne = {
  ...THRONE,
  id: 'c12_throne', name: 'The Noon Throne', region: 'Evernoon',
  mood: (st) => (st.flags.c12_afterlight ? 'c12_newdawn' : st.flags.c12_refused ? 'gloam' : 'evernoon'),
  music: (st) => (st.flags.c12_afterlight ? 'afterlight' : st.flags.c12_refused ? null : 'evernoon'),
  battleBg: 'evernoon', particles: (st) => (st.flags.c12_afterlight ? 'pollen' : st.flags.c12_refused ? 'gloam' : 'motes_gold'),
  noSave: true,
  triggers: [
    { id: 'c12_confront', x: 4, y: 12, w: 22, h: 3, once: false, cond: (st) => st.flags.c12_throne_enter && !st.flags.c12_hierophant_down, run: (s) => C12F.confront(s) },
  ],
  exits: [{ x: 14, y: 27, w: 3, h: 1, to: 'c12_stair', tx: 17, ty: 2, dir: 'down', cond: (st) => !st.flags.c12_hierophant_down }],
  onEnter: (s) => C12F.throneEnter(s),
};

export const C12_DUNGEON_MAPS = [gate, streets, memory, stair, throne];
