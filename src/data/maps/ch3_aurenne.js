// Aurenne, the City of Bells — Chapter 3 hub.
import L from './layouts/aurenne.js';
import { CH3 } from '../../story/ch3.js';
import { SIDE } from '../../story/ch3_side.js';
import { startHourlyBells } from '../../story/ch3_fx.js';

// Story phases
const theft = (st) => st.flags.c3_arrived && !st.flags.c3_pip_joined;
const day1 = (st) => st.flags.c3_pip_joined && !st.flags.c3_night;
const crisis = (st) => st.flags.c3_morning && !st.flags.c3_mercy_down;
const after = (st) => !!st.flags.c3_mercy_down;
const dusk = (st) => st.flags.c3_met && !st.flags.c3_dream_done;
const pipIn = (s) => s.state.party.includes('pip');
const bramIn = (s) => s.state.party.includes('bram');

/** Pick dialogue by phase: lines({ before, day1, crisis, after, forks }) */
function phased(name, t) {
  return (s) => {
    const st = s.state;
    let lines = t.before;
    if (st.flags.c3_pip_joined && t.day1) lines = t.day1;
    if (crisis(st) && t.crisis) lines = t.crisis;
    if (after(st) && t.after) lines = t.after;
    if (st.flags.c3_forks && t.forks) lines = t.forks;
    return s.say(name, lines);
  };
}

const npcs = [
  // ---------------------------------------------------------------- the South Gate & the avenue
  { id: 'basil', name: 'Gate Warden Basil', look: 'dawnguard', x: 23, y: 37, dir: 'left',
    talk: phased('Gate Warden Basil', {
      before: ['Lost something already? Should\'ve minded your purse. I did say.', '...I was going to say.'],
      day1: ['Low Town folk keep asking the Watch about missing children. The Captain says Low Town is always losing people.', 'Says that\'s what Low Town is _for._ I didn\'t laugh. He noticed.'],
      after: ['Mercy Vale. I gave her a nod every morning at this gate. She\'d bless my boots.', 'Can you imagine. I\'ve thrown the boots in the river.'],
      forks: ['Heading south? The Pilgrim Road runs straight to the Sunscar. Take water.', 'Take more water than that.'],
    }) },
  { id: 'crier', name: 'Crier Dunstan', look: 'c3_crier', x: 18, y: 25, dir: 'right',
    talk: phased('Crier Dunstan', {
      before: ['HEAR YE! His Holiness the Hierophant returns from the western isles! The Grand Lantern burns bright!', 'Also bread is up a copper!'],
      day1: ['HEAR YE! The Choir reminds all citizens that the Undercroft is CLOSED and CONDEMNED and NOT A PLACE FOR CHILDREN!', 'Also bread is up another copper!'],
      after: ['HEAR YE! Sister Mercy Vale is CAST OUT of the Choir! A reward for information on her whereabouts!', 'And bread is DOWN a copper, by order of the Hierophant! Long live the Hierophant!'],
    }) },
  { id: 'tibbs', name: 'Bargeman Tibbs', look: 'villager_28', x: 30, y: 39, dir: 'down',
    talk: ['River\'s low. The Aure\'s never this low in autumn.', 'The old bargemen say the sea\'s pulling at it, way out west. Like it\'s holding its breath.'] },
  // ---------------------------------------------------------------- the Bell Market
  { id: 'pip_thief', name: '???', look: 'pip', x: 10, y: 35, dir: 'right', cond: (st) => st.flags.c3_thief && !st.flags.c3_chase,
    run: (s) => CH3.thiefClimbs(s) },
  { id: 'hettie', name: 'Hettie', look: 'hettie', x: 11, y: 24, dir: 'down', run: (s) => SIDE.hettie(s) },
  { id: 'rowan', name: 'Rowan', look: 'rowan', x: 10, y: 24, dir: 'down', cond: after,
    talk: (s) => s.say('Rowan', ['Hettie says I\'m to rest. I\'m resting standing up. It\'s a baker\'s skill.', 'I dream about the singing, sometimes. Then I wake up and there\'s bread to make. It helps, the bread.']) },
  { id: 'jasper', name: 'Jasper Quell', look: 'villager_6', x: 14, y: 25, dir: 'down',
    talk: phased('Jasper Quell', {
      before: ['Saltglass pepper! Sunscar cumin! Dried figs from the caravan roads!', 'The Keeper down south, Tamsin — blind as a stone, they say, and sees more than you or me. She told my caravan-master the day he\'d die.', 'He\'s been avoiding that day ever since. Very successfully.'],
      forks: ['South? To Saltglass? Give Keeper Tamsin my regards.', '...Actually, don\'t. She\'ll know exactly who I am.'],
    }) },
  { id: 'posy', name: 'Posy', look: 'posy', x: 8, y: 36, dir: 'down', wander: 1, run: (s) => SIDE.posy(s) },
  { id: 'fenwick', name: 'Fenwick the Fabulous', look: 'villager_33', x: 6, y: 26, dir: 'down',
    talk: phased('Fenwick the Fabulous', {
      before: ['Behold! Fenwick the Fabulous juggles THREE bells—', '_(CLANG)_', '—two bells. Behold! Two bells.'],
      after: ['A new act, in honor of the brave children of the Undercroft! I shall juggle FOUR bells!', '_(CLANG) (CLANG)_', 'In honor of the brave children, I shall juggle two bells.'],
    }) },
  { id: 'shopper', name: 'Market-goer', look: 'villager_5', x: 12, y: 29, wander: 2,
    talk: phased('Market-goer', {
      before: ['Did you see the Hierophant\'s ship come in? The _Aubade._ White as milk, sails like folded wings.', 'Fastest ship in the world. Lucky for him. Some of us walk.'],
      after: ['Fourteen people brought up out of the Undercroft! They say a girl from the islands led them. The Hierophant\'s own Page!', '...Wait. Is that—'],
    }) },
  { id: 'grumbler', name: 'Old Haberdasher', look: 'villager_12', x: 5, y: 33, dir: 'right',
    talk: ['The Bell Market\'s been here six hundred years. Prices have been going up for five hundred and ninety-nine of them.', 'The first year was lovely, they say.'] },
  // ---------------------------------------------------------------- Cathedral Square
  { id: 'annick', name: 'Widow Annick', look: 'villager_17', x: 36, y: 9, dir: 'up',
    talk: phased('Widow Annick', {
      before: ['Forty years ago this autumn, the Lantern went out for one night. I was nine.', 'My mother held her hand over my eyes until dawn. I\'ve come every day since to thank it. For coming back.'],
      after: ['Some didn\'t come back, that night. Three hundred and twelve, they say. The Keeper\'s own daughter among them.', 'The Hierophant was her brother, you know. Twelve years old. He saw it all. Imagine carrying that.'],
    }) },
  { id: 'sentry_l', name: 'Lantern Sentry', look: 'dawnguard', x: 33, y: 7, dir: 'down',
    talk: ['The Grand Lantern is open to the Choir only, citizen.', 'Admire it from there. It\'s very admirable from there.'] },
  { id: 'sentry_r', name: 'Lantern Sentry', look: 'dawnguard', x: 37, y: 7, dir: 'down',
    talk: phased('Lantern Sentry', {
      before: ['Eyes front. No touching the Lantern. No singing at the Lantern. No proposing marriage at the Lantern — we\'ve had a spate.'],
      after: ['The Lord-Commander\'s doubled the watch. Every Sister of Small Mercies is under guard.', 'They just sit in the almshouse and sing. Quietly. All day. I\'ve asked for a transfer.'],
    }) },
  { id: 'acolyte_sq', name: 'Acolyte', look: 'acolyte', x: 26, y: 10, wander: 2,
    talk: phased('Acolyte', {
      before: ['The dawn-office is at first bell. The noon-office at noon. The dusk-office... you can see where this is going.'],
      after: ['We\'ve been told not to speak of Sister Mercy. So I won\'t.', '...She taught me my letters. When I was small. She was so patient.'],
    }) },
  { id: 'orla', name: 'Pilgrim Orla', look: 'villager_23', x: 30, y: 12, dir: 'up',
    talk: ['I walked from Mirefen to see the Grand Lantern. Three weeks. My feet are a disgrace.', 'There\'s a sickness in the swamp. Mother Osk says it\'s the Gloam, getting into the water. Nobody listens to Mother Osk.', 'Then again, she\'s usually right.'] },
  { id: 'hollis', name: 'Squire Hollis', look: 'hollis', x: 6, y: 8, dir: 'down', run: (s) => SIDE.hollis(s) },
  // ---------------------------------------------------------------- the Lantern Quarter
  { id: 'ambrose', name: 'Master Ambrose', look: 'ambrose', x: 31, y: 19, dir: 'down', run: (s) => SIDE.ambrose(s) },
  { id: 'ivo', name: 'Magister Ivo', look: 'villager_41', x: 37, y: 19, dir: 'down',
    talk: phased('Magister Ivo', {
      before: ['Lantern resonance! The Seven Lanterns sing at seven _slightly_ different pitches. A sloppiness I find personally offensive.', 'Brother Halvard of Frosthollow wrote a monograph on it. Wrong, mostly. Elegantly wrong.'],
      forks: ['Tuning forks, to bring the Lanterns into harmony? ...Fascinating.', 'Dangerous, if it were done wrong, of course. A Lantern tuned to the wrong note would — well. Everything worth doing is dangerous.'],
    }) },
  { id: 'tobin', name: 'Master Tobin', look: 'villager_3', x: 39, y: 22, dir: 'left',
    talk: async (s) => {
      await s.say('Master Tobin', ['My Kindling\'s next spring. Father says I\'ll be an Arcanist, because Father was an Arcanist, and Father\'s father.', 'I want to be a Ranger. ...Don\'t tell Father.']);
      if (pipIn(s)) {
        await s.say('Master Tobin', 'Is that a _street kid?_ Father says street kids bite.');
        await s.say('Pip', 'Only on Tuesdays.');
        await s.say('Master Tobin', '...Is it Tuesday?');
      }
    } },
  { id: 'aubert', name: 'Madame Aubert', look: 'villager_19', x: 44, y: 24, dir: 'down',
    talk: phased('Madame Aubert', {
      before: ['Did you hear? The Hierophant has taken a Page. Some girl from the islands. _Fishing_ people.', 'Can you imagine? Smelling of mackerel, in the Cathedral.'],
      after: ['I always said that Mercy woman smiled too much.', 'I never said it _out loud_, you understand. But I always said it.'],
    }) },
  // ---------------------------------------------------------------- Low Town
  { id: 'mag', name: 'Old Mag', look: 'c3_mag', x: 27, y: 37, dir: 'up', run: (s) => CH3.oldMag(s) },
  { id: 'fitch', name: 'Gutterman Fitch', look: 'villager_47', x: 44, y: 36, dir: 'left',
    talk: async (s) => {
      if (pipIn(s)) {
        await s.say('Gutterman Fitch', 'Pip! Haven\'t seen you since you nicked my good boot.');
        await s.say('Pip', 'You had two.');
        await s.say('Gutterman Fitch', 'I _had_ two.');
      }
      await s.say('Gutterman Fitch', after(s.state)
        ? ['Rag and bone! Bone trade\'s back to normal, thank the dawn. Somebody\'d been buying up every bone in Low Town.', 'Now I know who, I\'d rather not have sold \'em.']
        : ['Rag and bone! ...Mostly rag, lately. The bone trade\'s gone strange.', 'Somebody\'s been buying up all the bone in Low Town. Paying in soup.']);
    } },
  { id: 'garrow', name: 'One-Boot Garrow', look: 'villager_55', x: 25, y: 32, dir: 'right',
    talk: phased('One-Boot Garrow', {
      before: ['Hic. The sh-sisters sing so pretty. Sing you right to sleep.', 'Sing you right to... where\'d everyone go?'],
      after: ['I\'ve given up the drink. And the soup. Especially the soup.'],
    }) },
  { id: 'dessa', name: 'Dessa', look: 'villager_30', x: 31, y: 31, dir: 'down',
    talk: phased('Dessa', {
      before: ['My Jory\'s fine. My Jory\'s at home. I keep checking.'],
      crisis: ['Jory\'s still home. Thank the dawn. But Nell — oh, that poor scrap. She mended my washing-line for a bun, last week.'],
      after: ['Jory wants to be a Dawnguard now. Or a Lantern Page. Or both. He\'s practicing on the cat.', 'Thank you for that. I think.'],
    }) },
  { id: 'nell_d1', name: 'Nell', look: 'nell', x: 27, y: 31, dir: 'down', cond: day1,
    talk: async (s) => {
      await s.say('Nell', 'You\'re Pip\'s new friends? Did he steal you?');
      await s.say('Nell', 'He says he\'ll find Tuck and Wick. He says it every night.');
      await s.say('Nell', 'I pretend I believe him, so he can sleep.');
    } },
  { id: 'grey_sister', name: 'Grey Sister', look: 'c3_grey_sister', x: 39, y: 32, dir: 'down', cond: (st) => !st.flags.c3_mercy_down,
    talk: phased('Grey Sister', {
      before: ['Soup at noon and vespers. Beds for any who ask. Sister Mercy says no one should ever have to be cold.'],
      crisis: ['Hush. Don\'t look so frightened, little lambs. It\'s only singing.'],
    }) },
];

export default {
  ...L,
  id: 'aurenne', name: 'Aurenne', region: 'The City of Bells',
  mood: (st) => (dusk(st) ? 'dusk' : st.flags.c3_morning && !st.flags.c3_uc_open ? 'morning' : 'day'),
  music: 'aurenne',
  battleBg: 'town',
  backdrop: { plane: '#4f6e3e', y: -0.4 },
  particles: (st) => (dusk(st) ? 'motes_gold' : undefined),
  signs: [
    { x: 9, y: 20, text: 'THE RINGING BELL — Rooms · Suppers · Songs.\nNo rooks.' },
    { x: 17, y: 20, text: 'BELLWRIGHT ARMS & SUNDRIES — swords, salves and bell-bronze buckles.' },
    { x: 39, y: 19, text: 'THE LANTERN QUARTER.\nResidents only after dusk. (We mean it.)' },
    { x: 33, y: 32, text: 'LOW TOWN.\nMind the mud. Mind your purse. Mind your business.' },
  ],
  npcs,
  inspect: [
    { x: 35, y: 7, hint: 'The Grand Lantern', run: async (s) => {
      await s.narrate(['The Grand Lantern of Aurenne, eldest of the Seven. Its light is so steady you can feel it on your face, like warm water.', 'The door is barred with gold.']);
      if (s.flag('c3_forks')) await s.say('Sable', 'It is humming. The same note as the forks.');
    } },
    { x: 11, y: 10, text: 'A fountain ringed with seven bronze lanterns. So many coins have been thrown in that the water runs copper-green.' },
    { x: 17, y: 12, text: 'St. Aurel, the first Keeper, holding up the first Lantern. Someone has tied a red ribbon round her wrist. Several someones, by the layers.' },
    { x: 25, y: 12, text: 'The Hierophant Cassian, carved in white marble. The sculptor gave him a gentler face than any statue has a right to.' },
    { x: 9, y: 34, hint: 'Climb', run: (s) => CH3.climb(s) },
    { x: 44, y: 29, hint: 'Grate', cond: (st) => !st.flags.c3_uc_open, run: (s) => CH3.undercroftGate(s) },
    { x: 44, y: 30, hint: 'Grate', cond: (st) => !st.flags.c3_uc_open, run: (s) => CH3.undercroftGate(s) },
    { x: 5, y: 9, run: async (s) => {
      await s.narrate('A straw training dummy in a Dawnguard tabard. Someone has drawn a face on it. The face looks a great deal like Lord-Commander Garrick Thorne.');
      if (bramIn(s)) await s.say('Bram', '...That\'s been there since my year. I didn\'t draw it. I would like that on the record.');
    } },
    { x: 26, y: 30, text: 'Scratched into the drain-house wall at child height: four crowns, and under them, GUTTER CORT. One crown is fresh.' },
    { x: 13, y: 39, text: 'The river Aure, low and brown. A gull stands on a sandbar in the middle of it, looking personally betrayed.' },
  ],
  blockers: [
    { id: 'c3_uc_gate', x: 44, y: 29, w: 1, h: 2, prop: 'fence' },
  ],
  exits: [
    { x: 19, y: 47, w: 4, to: '@world', cond: (st) => st.flags.c3_pip_joined && !st.flags.c3_forks && !crisis(st) },
    { x: 47, y: 29, h: 2, to: 'c3_uc_sewers', tx: 1, ty: 12, dir: 'right', cond: (st) => st.flags.c3_uc_open },
  ],
  triggers: [
    { id: 'market_thief', x: 7, y: 32, w: 7, h: 6, once: false, cond: (st) => st.flags.c3_thief && !st.flags.c3_chase, run: (s) => CH3.thiefClimbs(s) },
    { id: 'gate_hold', x: 19, y: 45, w: 4, h: 2, once: false, cond: (st) => theft(st) || crisis(st),
      run: async (s) => {
        await s.say('Wren', crisis(s.state) ? 'Not while Nell and the others are down there.' : 'Not without Dad\'s compass.');
        await s.step('player', 0, -2);
      } },
    { id: 'departure', x: 19, y: 45, w: 4, h: 2, once: false, cond: (st) => st.flags.c3_forks && !st.flags.c3_done, run: (s) => CH3.departure(s) },
  ],
  onEnter: async (s) => {
    startHourlyBells(s);
    if (!s.flag('c3_arrived')) return CH3.arrival(s);
    if (s.flag('c3_mercy_down') && !s.flag('c3_condemned')) return CH3.condemnation(s);
    const onSteps = s.actor('player').tileY <= 9;
    if (onSteps && s.flag('c3_forks')) return CH3.forksTalk(s);
    if (onSteps && s.flag('c3_met')) return CH3.duskTalk(s);
    return null;
  },
};
