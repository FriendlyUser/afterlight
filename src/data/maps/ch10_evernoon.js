// Ch10: Evernoon — the festival that never ends — and the Lorne house.
import EVERNOON from './layouts/c10_evernoon.js';
import LORNE from './layouts/c10_lorne_house.js';
import { CH10, puppet } from '../../story/ch10.js';
import { CH10_SIDE } from '../../story/ch10_side.js';

export const evernoon = {
  ...EVERNOON,
  id: 'c10_evernoon', name: 'Evernoon', region: 'Aurenne, forty years ago',
  mood: (st) => (st.flags.c10_escape ? 'gloam' : 'evernoon'),
  music: (st) => (st.flags.c10_escape ? 'gloam' : 'evernoon'),
  particles: (st) => (st.flags.c10_escape ? 'gloam' : 'motes_gold'),
  treeType: 'tree_cherry', battleBg: 'evernoon', camera: { dist: 22, pitch: 0.7 },
  encounters: { rate: 0.8, onTiles: ';',
    troops: [['c10_ev_puppets', 3], ['c10_ev_lanterns', 2], ['c10_ev_guards', 2], ['c10_ev_dancers', 2], ['c10_ev_mix', 2]] },
  npcs: [
    { id: 'hollis', name: 'Hollis the Baker', look: 'c10_baker', x: 16, y: 20, dir: 'down',
      run: puppet('Hollis the Baker', 'Honey-buns! Fresh from the oven! Still warm — they\'re always still warm!',
        [['Pip', '...She said that exact same thing. *Exactly* the same.'], ['Ilse', 'Same pitch. Same breath in the same place.']],
        'Honey-buns! Fresh from the— fresh from the— Still warm. Still warm. Still warm.') },
    { id: 'kite_boy', name: 'Wim', look: 'c10_kite_boy', x: 24, y: 26, dir: 'up',
      run: puppet('Wim', 'Look how high it goes! Mama, look! Look how high it goes!', [['Bram', 'There isn\'t a kite. He\'s holding nothing.']]) },
    { id: 'kite_mother', name: 'Wim\'s Mother', look: 'c10_kite_mother', x: 25, y: 26, dir: 'right',
      run: puppet('Wim\'s Mother', 'Yes, love. Very high.', [['Corvin', 'She\'s not looking at him. She\'s looking at the wrong bit of sky. Forty years, the wrong bit of sky.']]) },
    { id: 'bandleader', name: 'The Bandleader', look: 'c10_bandleader', x: 28, y: 20, dir: 'down',
      run: puppet('The Bandleader', 'And-a-one, and-a-two, and-a—', [['Pip', 'Play it! Just *play* it!']], 'And-a-one, and-a-two, and-a-one, and-a-two, and-a-one, and-a-two, and-a—') },
    { id: 'musician', name: 'Fiddler', look: 'c10_musician', x: 27, y: 19, dir: 'down',
      run: puppet('Fiddler', '_(her bow hovers a hair above the strings, trembling, waiting for the count)_') },
    { id: 'lover_m', name: 'Rafe', look: 'c10_lover_m', x: 7, y: 23, dir: 'right', cond: (st) => !st.flags.c10_q_ask_done, run: (s) => CH10_SIDE.lovers(s) },
    { id: 'lover_f', name: 'Della', look: 'c10_lover_f', x: 8, y: 23, dir: 'left', cond: (st) => !st.flags.c10_q_ask_done, run: (s) => CH10_SIDE.lovers(s) },
    { id: 'bess', name: 'Old Bess', look: 'c10_bess', x: 10, y: 23, dir: 'right', cond: (st) => !st.flags.c10_q_lemon_done, run: (s) => CH10_SIDE.oldWoman(s) },
    { id: 'tomas', name: 'Tomas', look: 'c10_tomas', x: 42, y: 23, dir: 'left', run: (s) => CH10_SIDE.tomas(s) },
    { id: 'keeper', name: 'Keeper Lorne', look: 'c10_keeper_lorne', x: 12, y: 11, dir: 'down',
      run: puppet('Keeper Lorne', 'The Lantern\'s humming oddly. I\'ll look at it after the festival. There\'s always time after the festival.',
        [['Ilse', 'He doesn\'t know. He\'ll never know. He\'ll never get to tonight.']]) },
    { id: 'acolyte', name: 'Lantern Acolyte', look: 'c10_old_acolyte', x: 13, y: 12, dir: 'right',
      run: puppet('Lantern Acolyte', 'The Keeper says it\'s probably the heat. Probably the heat. It\'s a very hot day.') },
    { id: 'kid_a', name: 'Little Girl', look: 'c10_child_a', x: 21, y: 25, dir: 'right',
      run: puppet('Little Girl', 'You\'re the Gloam! You have to catch us before the sun goes down!', [['Sable', '...I played this. In the window. Every day.']]) },
    { id: 'kid_b', name: 'Little Boy', look: 'c10_child_b', x: 26, y: 23, dir: 'left',
      run: puppet('Little Boy', 'But the sun never goes down! Ha ha! The sun never goes down!', [['Pip', 'Don\'t laugh like that. Don\'t— just don\'t.']]) },
    { id: 'fortune', name: 'Madame Sorrel', look: 'c10_fortune', x: 34, y: 25, dir: 'down',
      run: puppet('Madame Sorrel', 'Your future, dear? Oh — there isn\'t one. Isn\'t that wonderful?',
        [['Wren', 'She looked at me. She actually *looked* at me.']], 'You\'re not from today, are you. Sister Mercy knows you\'re here. She knew before you did.') },
    { id: 'squire', name: 'Young Squire', look: 'c10_squire', x: 37, y: 20, dir: 'down',
      run: async (s, a) => {
        if (!s.flag('c10_squire_seen') && s.state.party.includes('bram')) {
          s.setFlag('c10_squire_seen');
          await s.say('Young Squire', 'Some day I\'ll be a knight. A real one. The kind that doesn\'t run.');
          await s.say('Bram', '...');
          await s.say('Bram', 'That\'s him. That\'s Sir Aldous. He\'s— he\'s younger than *me*.');
          await s.say('Young Squire', 'Some day I\'ll be a knight. A real one. The kind that doesn\'t run.');
          await s.say('Bram', 'You will be. You were. You were the best one.');
          await s.say('Bram', '_(quietly)_ And you ran, once. Back for me. That\'s the only running you ever did.');
          return;
        }
        return puppet('Young Squire', 'Some day I\'ll be a knight. A real one. The kind that doesn\'t run.')(s, a);
      } },
    { id: 'mrs_lorne', name: 'Mrs. Lorne', look: 'c10_mrs_lorne', x: 32, y: 12, dir: 'down',
      run: puppet('Mrs. Lorne', 'Have you seen my Lysa? She was just here. She\'s wearing her festival dress — white and gold, with a ribbon.',
        [['Sable', '...She asks every hour. I used to answer her.']], 'Have you seen my— have you seen— she was just here. She was just here. She was just here.') },
    { id: 'townsman', name: 'Cheerful Man', look: 'c10_townsman', x: 18, y: 24, dir: 'right',
      run: puppet('Cheerful Man', 'Lovely day for it!', [['Corvin', 'For *what*, friend?'], ['Corvin', '...Yeah. That\'s what I figured.']], 'Lovely day for— lovely day for— lovely day for—') },
    { id: 'guard_w', name: 'Festival Guard', look: 'c10_fest_guard', x: 19, y: 39, dir: 'up',
      run: puppet('Festival Guard', 'Welcome to the Festival of the Long Light. Enjoy the day.') },
    { id: 'guard_e', name: 'Festival Guard', look: 'c10_fest_guard', x: 26, y: 39, dir: 'up',
      run: puppet('Festival Guard', 'Enjoy the day. Enjoy the day. Enjoy the day.') },
  ],
  chests: [
    { id: 'river', x: 3, y: 18, item: 'sunshard_tiara' },
    { id: 'lantern', x: 6, y: 11, item: 'elixir' },
    { id: 'market', x: 43, y: 21, item: 'mega_tonic', count: 3 },
    { id: 'cathedral', x: 29, y: 7, item: 'sunshard_greatsword' },
    { id: 'south_w', x: 9, y: 36, item: 'guard_fruit' },
    { id: 'south_e', x: 34, y: 35, item: 'x_tonic', count: 2 },
  ],
  inspect: [
    { x: 23, y: 23, text: 'The fountain. Its water arcs up and hangs at the top of the arc, glittering, and does not come down.' },
    { x: 15, y: 19, text: ['Trays of honey-buns, glazed and golden. They are warm. They have been warm for forty years.', 'Nobody has ever eaten one.'] },
    { x: 23, y: 5, text: 'The Cathedral doors are painted on. There is no inside. He never went in that day.' },
    { x: 10, y: 8, text: 'The Grand Lantern, humming oddly in the heat. Its light is the colour of honey. It will fail tonight. It never gets to.' },
    { x: 14, y: 10, text: 'A cherry tree in full bloom. Petals fall from it constantly, turning in the air — and never land.' },
    { x: 7, y: 16, text: 'The river doesn\'t flow. It glitters in place, every ripple exactly where it was.' },
  ],
  triggers: [
    { id: 'gate_guards', x: 19, y: 35, w: 8, h: 3, once: false, cond: (st) => st.flags.c10_escape && !st.flags.c10_gate_fight, run: (s) => CH10.gateGuards(s) },
  ],
  exits: [
    { x: 21, y: 43, w: 4, to: 'c10_spire_halls', tx: 20, ty: 5, dir: 'down' },
  ],
  onEnter: (s) => CH10.evernoonArrive(s),
};

export const lorneHouse = {
  ...LORNE,
  id: 'c10_lorne_house', name: 'The Keeper\'s House', mood: (st) => (st.flags.c10_escape ? 'gloam' : 'interior'),
  music: 'evernoon', camera: { dist: 15, pitch: 0.75 }, noBanner: true, particles: 'motes_gold', battleBg: 'evernoon',
  inspect: [
    { x: 5, y: 3, text: 'The vanity. A hairbrush with long black hairs in it, and a jar of ribbons, white and gold.' },
    { x: 9, y: 2, text: 'Lysa\'s bed. Under the pillow, a list in a child\'s hand: THINGS TO DO WHEN I AM GROWN UP. The list is very long.' },
    { x: 1, y: 2, text: 'Picture books. One is open to a drawing of an animal with a glossy black coat. Under it, in careful letters: SABLE.' },
    { x: 10, y: 2, text: 'A shelf of paper stars, each with a wish written inside. Most of them are about fireworks.' },
  ],
  exits: [{ x: 4, y: 8, w: 3, to: 'c10_evernoon', tx: 35, ty: 11, dir: 'down' }],
  onEnter: (s) => CH10.lysaRoom(s),
};
