// Lanternfall Village — Wren's home isle. Prologue & Chapter 1 hub.
import L from './layouts/lanternfall.js';
import { PRO } from '../../story/prologue.js';
import { CH1 } from '../../story/ch1.js';

const day = (st) => !st.flags.lfNight;
const beforeKindling = (st) => day(st) && !st.flags.kindled;

export default {
  ...L,
  id: 'lanternfall',
  name: 'Lanternfall',
  region: 'The Westmost Isle',
  mood: (st) => (st.flags.lfNight ? 'storm' : st.flags.lfDusk ? 'dusk' : 'morning'),
  music: (st) => (st.flags.lfNight ? 'tension' : 'lanternfall'),
  backdrop: 'ocean',
  battleBg: 'beach',
  encounters: {
    rate: 0.6, bg: 'beach', onTiles: 's',
    cond: (st) => st.flags.p_net_got && !st.flags.lfNight,
    troops: [['lf_jelly2', 3], ['lf_jelly_crab', 2], ['lf_gulls', 1], ['lf_gull_jelly', 2], ['lf_crab2', 1]],
  },
  signs: [{ x: 20, y: 13, text: 'LANTERNFALL — Westmost Light of Solmere.\nThe Kindling: tomorrow at noon, at the Lantern.' }],
  npcs: [
    { id: 'tobias', name: 'Fisher Tobias', look: 'tobias', x: 33, y: 19, dir: 'left', cond: (st) => day(st) && !st.flags.ch1_ready, run: (s) => PRO.tobias(s) },
    { id: 'gossip1', name: 'Hanna', look: 'villager_3', x: 21, y: 15, wander: 2, cond: beforeKindling,
      talk: ['They say the Hierophant hasn\'t left Aurenne in eleven years. And he\'s coming *here*. For *our* children.', 'I\'ve swept my step four times.'] },
    { id: 'kid1', name: 'Pell', look: 'villager_9', x: 25, y: 18, wander: 3, cond: day,
      talk: (s) => s.flag('kindled') ? s.say('Pell', ['You got VANGUARD? That\'s the best one! Can I hold your sword? Can I? Just the handle?']) : s.say('Pell', ['Are you getting your Crest tomorrow? I hope I get Vanguard when I\'m sixteen. Or Arcanist. Something with explosions.']) },
    { id: 'oldman', name: 'Old Corrin', look: 'villager_17', x: 12, y: 17, dir: 'right', cond: day,
      talk: ['One Crest, one life, girl. My father was a Warden, I\'m a Warden, my boy\'s a Warden.', 'The light knows what you are. No sense arguing with the light.'] },
    { id: 'woman1', name: 'Dorrit', look: 'villager_22', x: 27, y: 11, wander: 1, cond: day,
      talk: ['My Tamsy got Mender last spring. Cried for a week — she wanted Cantor.', 'She\'s good at it now, though. Funny how the light knows.'] },
    { id: 'sailor', name: 'Old Sailor', look: 'villager_28', x: 26, y: 26, dir: 'down', cond: day,
      talk: (s) => s.say('Old Sailor', s.flag('p_cassian_arrived') ? ['That white ship\'s got sails like an angel\'s wings. Never seen the like.', 'Nor such a quiet crew.'] : ['Tide\'s out further than I\'ve ever seen. You can walk to the eel rocks.', 'The sea\'s waiting for something.']) },
    { id: 'lookout', name: 'Gull-Watcher', look: 'villager_31', x: 24, y: 31, dir: 'down', cond: (st) => day(st) && !st.flags.p_cassian_arrived,
      talk: ['Any minute now! The Hierophant\'s ship! I\'ve been here since dawn.', 'If you see white sails, scream. I will too. We\'ll scream together.'] },
    { id: 'fisherwife', name: 'Maela', look: 'villager_36', x: 41, y: 19, wander: 2, cond: day,
      talk: ['Tobias says the net\'s with Brisa. Tobias says a lot of things.', 'Good luck tomorrow, love. Whatever the light says, you\'re still our Wren.'] },
    { id: 'ilse_dock', name: 'Ilse', look: 'ilse', x: 24, y: 27, dir: 'down', cond: (st) => st.flags.ch1_ready && !st.flags.ch1_departed && false, talk: ['...'] },
  ],
  inspect: [
    { x: 23, y: 33, hint: 'Fish', run: (s) => s.fish('sea') },
    { x: 17, y: 32, hint: 'Fish', run: (s) => s.fish('sea') },
    { x: 28, y: 32, hint: 'Fish', run: (s) => s.fish('sea') },
    { x: 23, y: 15, text: 'The village well. Someone has carved WREN + ILSE + THE SEA into the stone. You remember carving it.' },
    { x: 14, y: 12, text: 'Your mother\'s herb garden. Rosemary, thyme, and a sea-lavender that has never once flowered.' },
  ],
  exits: [
    { x: 45, y: 15, h: 4, to: 'lf_tidecaves', tx: 1, ty: 16, dir: 'right',
      cond: (st) => st.flags.p_brooch_quest && !st.flags.lfNight && !st.flags.ch1_named,
      blocked: async (s) => {
        await s.say('Wren', s.flag('ch1_named') ? 'No time for the caves now.' : s.flag('lfNight') ? 'Not in this storm.' : 'The tide caves... Mom would kill me. I should do my chores first.');
        await s.step('player', -1, 0);
      } },
  ],
  triggers: [
    { id: 'dock_cassian', x: 18, y: 18, w: 12, h: 8, once: false, cond: (st) => st.flags.p_brooch_got && !st.flags.p_cassian_arrived, run: (s) => PRO.cassianArrives(s) },
    { id: 'rocks', x: 34, y: 21, w: 10, h: 8, once: false, cond: (st) => st.flags.lfNight && !st.flags.p_storm_done, run: (s) => PRO.blackRocks(s) },
    { id: 'depart', x: 21, y: 25, w: 5, h: 7, once: false, cond: (st) => st.flags.ch1_ready && !st.flags.ch1_departed, run: (s) => CH1.departure(s) },
  ],
  onEnter: async (s) => {
    if (s.flag('p_brooch_got') && !s.flag('p_cassian_arrived') && s.state.location.x > 40) await PRO.cassianArrives(s);
  },
};
