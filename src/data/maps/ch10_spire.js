// Ch10: the approach across the greatest Sun Shard, and the Spire Halls.
import SPIRE from './layouts/noon_spire.js';
import HALLS from './layouts/c10_spire_halls.js';
import { CH10 } from '../../story/ch10.js';

const f = (name) => (st) => !!st.flags[name];

export const noonSpire = {
  ...SPIRE,
  id: 'noon_spire', name: 'The Noon Spire', region: 'The Greatest Shard',
  mood: 'dusk', music: 'cassian', particles: 'motes_gold', battleBg: 'temple',
  camera: { dist: 22, pitch: 0.7 },
  encounters: { rate: 0.9, troops: [['c10_ns_shards', 3], ['c10_ns_hounds', 2], ['c10_ns_glare', 2], ['c10_ns_lancers', 2], ['c10_ns_mix', 2]] },
  npcs: [
    { id: 'orla', name: 'Orla', look: 'villager_44', x: 11, y: 28, dir: 'up',
      talk: async (s) => s.say('Orla', s.flag('c10_named')
        ? ['You came out. Nobody comes out.', '...Was he there? A boy, nine, with a gap in his teeth? Tam. His name is Tam.', 'No. Don\'t tell me. I\'ve decided I\'m going home.']
        : ['My boy is in there. Tam. He was nine.', 'The Choir says when the Hierophant\'s work is done the gate will open, and I\'ll see him at the festival. I\'ve been waiting since the spring.', 'Is it still spring? I\'ve lost count. Nothing changes up here. That\'s the point, they say.']) },
    { id: 'gideon', name: 'Old Gideon', look: 'villager_55', x: 19, y: 29, dir: 'left',
      talk: ['Eleven months I\'ve sat here. My Marigold is inside. Forty-one years married.', 'Some nights I can hear her laughing, through the wall. Same laugh. Same moment. Over and over.', 'I tell myself that\'s a comfort.'] },
    { id: 'liesl', name: 'Liesl', look: 'villager_38', x: 8, y: 30, dir: 'right',
      talk: async (s) => {
        await s.say('Liesl', 'They say inside it\'s always the best day of your life. Isn\'t that what we all want? Isn\'t that what everyone has ever wanted?');
        if (s.state.party.includes('ilse')) {
          await s.say('Ilse', 'I wanted my patients to get better. "Better" means "different." It means tomorrow.');
          await s.say('Liesl', '...You sound very tired.');
          await s.say('Ilse', 'I am. That\'s how I know I\'m still alive.');
        }
      } },
    { id: 'cob', name: 'Cob', look: 'villager_19', x: 22, y: 29, dir: 'down',
      talk: async (s) => s.say('Cob', s.flag('c10_lift_cleared')
        ? ['You beat the Lift-Warden? He took my slingshot once. Did you get it back? ...No? Well. Still.']
        : ['The big gate never opens. Don\'t bother knocking; I knocked for a week.', 'But the white ships bring crates round the east side of the plaza. There\'s a lift. A man with a spear stands by it and says "halt" a lot.']) },
  ],
  chests: [
    { id: 'west', x: 3, y: 20, item: 'sunshard_staff' },
    { id: 'east', x: 31, y: 19, item: 'x_tonic', count: 2 },
    { id: 'landing', x: 20, y: 38, item: 'mega_tonic', count: 3 },
    { id: 'field', x: 26, y: 23, item: 'sunshard_sword' },
    { id: 'plaza_w', x: 6, y: 9, item: 'sunshard_rod' },
    { id: 'camp', x: 7, y: 28, item: 'hi_ether', count: 3 },
  ],
  inspect: [
    { x: 19, y: 32, hint: 'Supply line', run: (s) => CH10.supply(s) },
    { x: 17, y: 3, text: ['The great gate of the Spire is sealed with gold. Carved over it, in letters as tall as Pip:', 'AND THE GOOD DAY SHALL NOT END.'] },
    { x: 15, y: 6, text: 'A statue of the Hierophant, arms open, smiling. Someone has left a child\'s shoe at its feet. Then another. Then hundreds.' },
    { x: 20, y: 6, text: 'A statue of a little girl in a festival dress, holding a ribbon. There is no name on the plinth.' },
    { x: 17, y: 30, text: 'The pilgrims\' fire. Nobody needs it for warmth up here. They keep it lit so there is something that changes.' },
  ],
  triggers: [
    { id: 'lift_guards', x: 25, y: 5, w: 6, h: 4, once: false, cond: (st) => !st.flags.c10_lift_cleared, run: (s) => CH10.liftGuards(s) },
  ],
  exits: [
    { x: 28, y: 3, to: 'c10_spire_halls', tx: 20, ty: 37, dir: 'up', cond: f('c10_lift_cleared'),
      blocked: async (s) => { await s.say('Wren', 'The lift\'s guarded.'); await s.step('player', 0, 1); } },
  ],
  onEnter: (s) => CH10.landing(s),
};

export const spireHalls = {
  ...HALLS,
  id: 'c10_spire_halls', name: 'The Spire Halls', region: 'The Noon Spire',
  mood: (st) => (st.flags.c10_escape ? 'gloam' : 'temple'),
  music: (st) => (st.flags.c10_escape ? 'tension' : 'cassian'),
  particles: (st) => (st.flags.c10_escape ? 'gloam' : 'motes_gold'),
  battleBg: 'temple', camera: { dist: 21, pitch: 0.72 },
  encounters: { rate: 1, troops: [['c10_sh_knights', 3], ['c10_sh_moths', 2], ['c10_sh_cantors', 2], ['c10_sh_mix', 2], ['c10_esc_unravel', 1]] },
  chests: [
    { id: 'west', x: 3, y: 31, item: 'sunshard_knuckles' },
    { id: 'east', x: 38, y: 31, item: 'sun_codex' },
    { id: 'gallery', x: 11, y: 7, item: 'magic_fruit' },
    { id: 'nave', x: 18, y: 25, item: 'x_ether' },
    { id: 'landing', x: 26, y: 36, item: 'mega_tonic', count: 3 },
    { id: 'balcony', x: 38, y: 4, item: 'dawn_plume', count: 2 },
  ],
  blockers: [
    { id: 'dais_seal', x: 20, y: 13, w: 2, h: 2, prop: 'crystal' },
    { id: 'balcony_door', x: 25, y: 7, w: 2, h: 2, prop: 'pillar_broken' },
  ],
  inspect: [
    { x: 6, y: 28, hint: 'Clock', run: (s) => CH10.clock(s, 'west') },
    { x: 35, y: 28, hint: 'Clock', run: (s) => CH10.clock(s, 'east') },
    { x: 7, y: 10, hint: 'Clock', run: (s) => CH10.clock(s, 'gallery') },
    { x: 5, y: 25, text: 'Clock-cases, floor to ceiling. Each face is painted with the same summer sky. Each one has stopped at noon.' },
    { x: 34, y: 25, text: 'A clock with a child\'s drawing tucked into its glass: a girl, a boy, a big yellow sun, and the word ALWAYS.' },
    { x: 20, y: 3, text: 'The Noon Gate. Warm air breathes through it, smelling of honey and cut grass.', cond: (st) => !st.flags.c10_warden_done },
  ],
  triggers: [
    { id: 'warden', x: 17, y: 5, w: 8, h: 8, once: false, cond: (st) => !st.flags.c10_warden_done, run: (s) => CH10.warden(s) },
    { id: 'corridor', x: 27, y: 6, w: 6, h: 4, once: false, cond: (st) => st.flags.c10_escape && !st.flags.c10_corridor, run: (s) => CH10.corridorFight(s) },
    { id: 'balcony', x: 33, y: 3, w: 7, h: 11, once: false, cond: (st) => st.flags.c10_escape && !st.flags.c10_done, run: (s) => CH10.balcony(s) },
  ],
  exits: [
    { x: 19, y: 2, w: 4, to: 'c10_evernoon', tx: 23, ty: 41, dir: 'up', cond: (st) => st.flags.c10_warden_done && !st.flags.c10_escape,
      blocked: async (s) => { if (s.flag('c10_escape')) await s.say('Sable', 'Not back. Never back. East — the balcony.'); await s.step('player', 0, 1); } },
    { x: 14, y: 38, w: 14, to: 'noon_spire', tx: 28, ty: 6, dir: 'down', cond: (st) => !st.flags.c10_escape,
      blocked: async (s) => { await s.say('Corvin', 'Lift shaft\'s full of light! East, sparrow — the balcony!'); await s.step('player', 0, -1); } },
  ],
  onEnter: (s) => CH10.hallsArrive(s),
};
