// CHAPTER 3 — "City of Bells"
// Aurenne. Pip steals the compass; the rooftop chase; Cassian's offer; Sable's
// dream; Nell vanishes; the Undercroft and Sister Mercy; the tuning forks.

import { ringBells, leap } from './ch3_fx.js';
import { SIDE } from './ch3_side.js';

// ------------------------------------------------------------------ staging helpers

const CAST = ['wren', 'ilse', 'bram', 'sable', 'pip'];

/** Spawn party members (except the leader, who is the player) at spots { id: [x, y, dir] }. */
function gather(s, spots) {
  const leader = s.state.party[0];
  for (const [id, [x, y, dir]] of Object.entries(spots)) {
    if (id === leader || !s.state.party.includes(id)) continue;
    s.spawn(`c_${id}`, s.state.characters[id].look, x, y, dir || 'up');
  }
}

function disperse(s) { for (const id of CAST) s.remove(`c_${id}`); }

/** Actor id for a cast member in a gathered scene ('player' if they lead). */
const who = (s, id) => (s.state.party[0] === id ? 'player' : `c_${id}`);

const hasPip = (s) => s.state.party.includes('pip');

/** Undo the dream's borrowed look (idempotent). */
function wake(s) {
  const [id, look] = s.vars.c3_dreamer || [];
  if (id && s.state.characters[id]?.lookId === 'lysa') s.setLook(id, look || id);
}

export const CH3 = {
  // ================================================================ ARRIVAL
  async arrival(s) {
    if (s.flag('c3_arrived')) return;
    s.setFlag('c3_arrived');
    s.music('aurenne');
    s.place('player', 20, 38, 'up');
    gather(s, { ilse: [19, 39], bram: [21, 39], sable: [22, 38] });
    await s.pan(21, 10, 2.4);
    ringBells(s, 6, 196);
    await s.narrate([
      'Aurenne. The City of Bells.',
      'Seven hundred bell towers, give or take. The city has never agreed on the count.',
    ]);
    await s.wait(0.6);
    await s.follow(1.4);
    await s.say('Wren', 'Ilse. _Ilse._ Look at it.');
    await s.say('Ilse', 'I\'m looking. Three things. One, it\'s enormous. Two, we\'re going to get lost. Three—');
    await s.say('Wren', '—it\'s _beautiful_.');
    await s.say('Ilse', 'Three was "keep a hand on your purse."');
    await s.say('Bram', 'Ah, Aurenne! I did my squire-years here. I know every street. Every tavern. Several of the taverns twice.');
    await s.say('Sable', 'Why are there so many bells?');
    await s.say('Bram', 'So everyone knows what time it is.');
    await s.say('Sable', 'Does everyone need to know?');
    await s.wait(0.5);
    await s.say('Bram', '...I\'ve never thought about it.');
    await s.say('Sable', 'That tower is bright. Even in the day.');
    await s.say('Wren', 'The Grand Lantern. Cassian\'s Lantern. The story goes the other six were lit from it, a thousand years ago.');
    // The thief.
    s.spawn('pip_thief', 'pip', 20, 30, 'down');
    await s.move('pip_thief', [[20, 37]], 7.5);
    s.shake(0.12, 0.3);
    s.sfx('hurt');
    await s.hop('player');
    await s.say('???', 'Oi— sorry, miss! Big city, small kid, it happens!', { portrait: false });
    await s.say('???', 'You\'ve got a— hang on— there. Leaf. Welcome to Aurenne!', { portrait: false });
    await s.move('pip_thief', [[18, 36], [10, 36], [10, 35]], 7.5);
    s.face('pip_thief', 'right');
    await s.wait(0.8);
    await s.take('edrins_compass');
    await s.say('Wren', '...');
    await s.say('Wren', 'My compass.');
    await s.emote('player', '!');
    await s.say('Wren', 'MY COMPASS!');
    s.sfx('debuff');
    await s.system('*Edrin\'s Compass* was stolen!');
    await s.say('Ilse', 'What did I say. What was three.');
    await s.say('Bram', 'Stop, thief! In the name of the Dawn— he\'s very fast, isn\'t he.');
    await s.say('Sable', 'He went into the market. The one with the tents.');
    disperse(s);
    s.setFlag('c3_thief');
    s.objective('Catch the boy who stole Dad\'s compass! He ran into the Bell Market (west).');
    s.journal('Aurenne! Forty seconds in the City of Bells and a boy stole Dad\'s compass.');
  },

  /** In the Bell Market: the thief goes up the crates and onto the roofs. */
  async thiefClimbs(s) {
    if (!s.flag('c3_thief') || s.flag('c3_chase')) return;
    s.setFlag('c3_chase');
    if (!s.field.actors.has('pip_thief')) s.spawn('pip_thief', 'pip', 10, 35, 'right');
    s.face('pip_thief', 'player');
    await s.say('???', 'You\'re persistent! I respect that. I don\'t _reward_ it, but I respect it.', { portrait: false });
    await s.say('Wren', 'Give. It. Back.');
    await s.say('???', 'Can\'t. Finders keepers. It\'s practically a law. It\'s in the Choir\'s big book, page one.', { portrait: false });
    await s.move('pip_thief', [[9, 35]], 4);
    s.face('pip_thief', 'up');
    await s.hop('pip_thief');
    await s.hop('pip_thief');
    s.remove('pip_thief');
    s.sfx('jump');
    await s.narrate('He goes up the stacked crates like a squirrel up a tree, and over the gutter.');
    await s.say('???', 'Catch me on the roofs, Fish-Girl!', { portrait: false });
    await s.say('Wren', 'Did he just call me _Fish-Girl?_');
    await s.say('Ilse', 'You do smell a little bit like—');
    await s.say('Wren', 'Don\'t.');
    s.objective('Climb the crates behind the market (by the brick warehouse) and chase the thief across the rooftops!');
  },

  /** Inspect on the crate stack: up to the rooftops. */
  async climb(s) {
    if (!s.flag('c3_chase')) return s.narrate('A stack of fruit crates against the warehouse wall. They look climbable. They also look like fruit crates.');
    if (s.flag('c3_pip_joined') && !(await s.confirm('Climb up to the rooftops?'))) return;
    s.sfx('jump');
    await s.teleport('c3_rooftops', 3, 15, 'up');
  },

  // ================================================================ THE ROOFTOP CHASE
  async roofIntro(s) {
    if (!s.flag('c3_chase') || s.flag('c3_roof_intro')) return;
    s.setFlag('c3_roof_intro');
    s.music('tension');
    s.spawn('pip_b', 'pip', 8, 10, 'down');
    await s.pan(8, 11, 0.8);
    await s.say('???', 'Up here it\'s my city, Fish-Girl. Down there it\'s yours.', { portrait: false });
    await s.say('???', '...Mostly it\'s mine down there too.', { portrait: false });
    await s.follow(0.6);
    await s.say('Bram', 'I was not built for roofs. Roofs are for birds, and regrets.');
    await s.say('Ilse', 'Then don\'t look down.');
    await s.say('Bram', 'I wasn\'t going to until you said that.');
    await leap(s, 'pip_b', 12, 10);
    await s.move('pip_b', [[16, 10], [20, 11]], 5);
    await s.system('Face a gap between roofs and press *Z* to *Leap* across.');
    s.objective('Chase the thief across the rooftops (east).');
  },

  /** First taunt on St. Aurel's roof; he races ahead to his hideout. */
  async roofTaunt(s) {
    if (s.flag('c3_roof_t1')) return;
    s.setFlag('c3_roof_t1');
    if (!s.field.actors.has('pip_b')) s.spawn('pip_b', 'pip', 20, 11, 'left');
    s.face('pip_b', 'left');
    await s.say('???', 'Not bad for a fish! Bet you can\'t do it twice!', { portrait: false });
    await leap(s, 'pip_b', 23, 11);
    await s.move('pip_b', [[23, 15], [31, 15], [31, 14]], 5.5);
    await leap(s, 'pip_b', 34, 14);
    await s.move('pip_b', [[37, 14], [37, 10], [39, 9], [39, 7]], 5.5);
    s.remove('pip_b');
    s.spawn('pip_nook', 'pip', 39, 7, 'down');
  },

  async roofRooks(s) {
    await s.narrate('A black cloud lifts off the bell-gable of St. Aurel\'s, screaming.');
    await s.say('Pip', 'Hope you like birds! They don\'t like you!', { portrait: false });
    await s.battle('c3_rooks', { bg: 'town' });
  },

  async roofHole(s) {
    await s.say('Sable', 'There is a hole in this roof.');
    await s.say('???', 'Mind that! Lost a mate down there once!', { portrait: false });
    await s.say('???', '...He\'s fine. He lives there now. Rents it out.', { portrait: false });
  },

  /** Cornered beneath St. Aurel's bell tower. Pip joins. */
  async cornered(s) {
    if (s.flag('c3_pip_joined')) return;
    s.setFlag('c3_pip_joined');
    s.music('town');
    if (!s.field.actors.has('pip_nook')) s.spawn('pip_nook', 'pip', 39, 7, 'down');
    s.place('player', 38, 10, 'up');
    gather(s, { ilse: [37, 11], bram: [39, 11], sable: [36, 10] });
    await s.pan(39, 8, 0.6);
    await s.move('pip_nook', [[40, 7]], 3);
    s.face('pip_nook', 'down');
    await s.say('Pip', 'Alright. Alright! Truce. Parley. Whatever it is knights say.');
    await s.say('Bram', 'Squire Bram Kestrel of the Dawnguard. You\'re under— uh. Citizen\'s arrest? Is that a thing?');
    await s.say('Pip', 'You\'re a squire? Bit old for a squire, aren\'t you?');
    await s.wait(0.5);
    await s.say('Bram', '...That is a very rude question.');
    await s.say('Wren', 'Give it back.');
    await s.say('Pip', 'This? It\'s broken. Points the wrong way. North\'s _that_ way. Everybody knows that.');
    await s.say('Wren', 'It points west. It always points west. It was my dad\'s.');
    await s.say('Pip', '...Your dad\'s a sailor?');
    await s.wait(0.8);
    await s.say('Wren', 'He was.');
    await s.wait(1.2);
    await s.say('Pip', '...Here.');
    s.sfx('throw');
    await s.give('edrins_compass');
    await s.say('Pip', 'Didn\'t want it anyway. Wouldn\'t have fenced for more than four coppers. Five, tops.');
    s.face(who(s, 'sable'), 'right');
    await s.say('Sable', 'Why do you steal?');
    await s.say('Pip', 'Why do you breathe?');
    await s.say('Sable', 'I don\'t know. I didn\'t ask to.');
    await s.wait(0.6);
    await s.say('Pip', '...You\'re weird.');
    await s.say('Sable', 'Yes.');
    await s.say('Ilse', 'How old are you?');
    await s.say('Pip', 'Fourteen.');
    await s.wait(0.9);
    await s.say('Pip', 'Thirteen.');
    await s.wait(0.9);
    await s.say('Pip', 'Twelve in the spring, alright?! I\'m eleven. Eleven and three-quarters. Happy?');
    await s.say('Wren', 'Where are your parents?');
    await s.say('Pip', '_(shrugs)_ Where\'s anybody\'s.');
    await s.wait(0.6);
    await s.say('Pip', 'Hey. Big one. That sash. You\'re Dawnguard? A real one?');
    await s.say('Bram', '...More or less.');
    await s.say('Pip', 'Then you have to help me. It\'s the oath. Or the law. Or whatever it is you lot swear on.');
    await s.say('Pip', 'My crew\'s been going missing. Low Town kids. Tuck, two weeks back. Wick, last week. They go to sleep in the drain-house and in the morning they\'re just... not.');
    await s.say('Pip', 'No blood. No nothing. And the Watch won\'t come down to Low Town for anything smaller than a fire.');
    await s.say('Wren', 'Vanishing...?');
    await s.say('Ilse', 'Wren. We have a letter to deliver. To the Cathedral. _Today._');
    await s.say('Pip', 'The Cathedral! Even better. You\'ve got friends up there? White-robes listen to people with letters.');
    await s.move('pip_nook', [[40, 8], [39, 9]], 4);
    await s.say('Pip', 'I\'m coming with you.');
    await s.say('Wren', 'Absolutely not.');
    await s.say('Ilse', 'Absolutely not.');
    await s.say('Bram', 'Absolutely— well. He\'s very small.');
    await s.say('Pip', 'I know every street, every drain, every back door in the City of Bells. You\'ll be lost inside an hour without me. Fish-Girl.');
    await s.say('Wren', 'Stop calling me—');
    await s.say('Pip', 'What\'s your name, then?');
    await s.say('Wren', 'Wren.');
    await s.say('Pip', 'Ha! That\'s a _bird_. Fish-Bird.');
    await s.say('Sable', 'I like him.');
    await s.say('Ilse', 'Of course you do.');
    await s.wait(0.6);
    await s.say('Wren', '...Fine. Until we find your friends.');
    await s.say('Pip', 'Pipkin Tallow. Prince of the Gutters. At your service.');
    await s.narrate('He bows, very low and very elaborately. When he straightens up, Wren\'s purse is in his hand.');
    await s.say('Pip', '...Force of habit.');
    s.sfx('steal');
    await s.say('Wren', '_Pip._');
    await s.say('Pip', 'Giving it back! See? Giving it back. Character growth.');
    s.remove('pip_nook');
    const pip = s.state.addCharacter('pip');
    pip.setLevel(Math.max(12, s.state.leader().level));
    await s.join('pip');
    s.state.characters.pip.sealed = true;
    await s.system('Pip is eleven: too young to have been Kindled. He fights without Crest Arts — for now.');
    disperse(s);
    s.objective('Deliver Cassian\'s letter at the Cathedral of Dawn (Cathedral Square, north).');
    s.journal('The thief is called Pip. He is eleven (and three-quarters). He gave the compass back when I told him it was Dad\'s. His friends have been vanishing in Low Town. Somehow he\'s coming with us.');
    await s.fadeOut(0.8);
    await s.teleport('aurenne', 10, 36, 'down');
  },

  // ================================================================ THE CATHEDRAL
  /** Walking up the nave: Sister Mercy, on her way out. */
  async meetMercy(s) {
    if (!s.flag('c3_pip_joined') || s.flag('c3_mercy_met')) return;
    s.setFlag('c3_mercy_met');
    s.place('player', 11, 14, 'up');
    gather(s, { ilse: [10, 15], bram: [12, 15], sable: [13, 14], pip: [9, 15] });
    s.spawn('mercy', 'mercy', 11, 7, 'up');
    await s.say('Pip', '_(whispering)_ Candles. So many candles. I\'m going to stand right here and be extremely good.');
    await s.wait(0.4);
    s.face('mercy', 'down');
    await s.move('mercy', [[11, 12]], 1.8);
    await s.say('Mercy', 'Oh! You must be the Hierophant\'s guests. From the islands. Welcome to the house of the dawn.');
    await s.say('Mercy', 'Sister Mercy Vale. I keep the almshouse in Low Town — soup, beds, and as much kindness as the Choir\'s purse allows.');
    await s.say('Wren', 'I\'m Wren. This is Ilse, Bram, Sable, and—');
    s.face('mercy', who(s, 'sable'));
    await s.wait(0.8);
    await s.say('Mercy', '...What a lovely face. Like a painting I saw once.');
    await s.say('Sable', 'I have only had it for a little while.');
    await s.say('Mercy', '_(laughing softly)_ Haven\'t we all.');
    if (hasPip(s)) {
      await s.move(who(s, 'pip'), [[12, 16]], 3);
      s.face('mercy', who(s, 'pip'));
      await s.say('Mercy', 'And Pipkin. Hiding behind a knight. You know there\'s always a bed for you at the almshouse.');
      await s.say('Pip', 'I\'m good.');
      await s.say('Mercy', 'One day you\'ll be tired, little one. Everyone gets tired. And I\'ll be there.');
      await s.wait(0.6);
    }
    await s.say('Mercy', 'Peace on your road, children. Noon comes for all of us.');
    await s.move('mercy', [[13, 13], [13, 20]], 2);
    s.remove('mercy');
    await s.wait(0.4);
    await s.say('Bram', 'What a kind woman.');
    await s.say('Pip', '...');
    await s.say('Ilse', 'Pip?');
    await s.say('Pip', 'Every kid who takes one of her beds gets fed. Real food. Meat, sometimes.');
    await s.say('Pip', 'I just don\'t like how quiet they come back.');
    disperse(s);
    s.objective('Give Cassian\'s letter to the acolyte by the altar.');
  },

  /** Acolyte Imre takes the letter; Cassian is already back. */
  async deliverLetter(s) {
    if (s.flag('c3_summoned')) return;
    s.setFlag('c3_summoned');
    await s.say('Imre', 'Pilgrims? The dawn-office is at— oh. That seal.');
    if (s.has('cassian_letter')) await s.take('cassian_letter');
    await s.say('Imre', 'The Hierophant\'s own hand. Then you\'re expected. His Holiness returned last night aboard the _Aubade_.');
    await s.say('Wren', 'He\'s _here?_ He said he\'d stay at Lanternfall for days—');
    await s.say('Imre', 'The _Aubade_ is the fastest ship in Solmere. They say the wind follows the Hierophant like a dog.');
    await s.say('Imre', 'He asked that you be brought to him the moment you arrived. This way — his study.');
    await s.fadeOut(0.6);
    await s.teleport('c3_study', 6, 8, 'up');
  },

  /** Cassian's study: the warm welcome, the Lantern Page, "not yet". */
  async cassianMeeting(s) {
    if (!s.flag('c3_summoned') || s.flag('c3_met')) return;
    s.setFlag('c3_met');
    s.music('cassian');
    s.place('player', 6, 7, 'up');
    gather(s, { ilse: [5, 8], bram: [7, 8], sable: [4, 7], pip: [8, 8] });
    s.spawn('cassian', 'cassian', 6, 2, 'up');
    await s.wait(0.8);
    await s.narrate('The Hierophant stands at the back of the room, facing a painting hung beneath a white sheet. For a moment he doesn\'t move at all.');
    s.face('cassian', 'down');
    await s.say('Cassian', 'Wren Halloway. You came.');
    await s.move('cassian', [[8, 3], [8, 5], [6, 5]], 2);
    await s.say('Wren', 'You said the archives might help Sable. And you said... well. I came.');
    await s.say('Cassian', 'Forgive me for leaving Lanternfall without a word. The Choir called, and the _Aubade_ does not like to wait.');
    s.face('cassian', who(s, 'ilse'));
    await s.say('Cassian', 'Mender Marrow. Your grandmother taught half of Lanternfall to set a bone, and the other half to fear her.');
    await s.say('Ilse', '...Thank you?');
    s.face('cassian', who(s, 'bram'));
    await s.say('Cassian', 'Squire Kestrel. The Dawnguard Hall will want to see you.');
    await s.say('Bram', 'Will it.');
    s.face('cassian', who(s, 'sable'));
    await s.wait(1.0);
    await s.say('Cassian', 'And you. Are you well, child? Have you remembered anything?');
    await s.say('Sable', 'I remember being cold.');
    await s.wait(0.8);
    await s.say('Cassian', '...Yes. The sea is very cold.');
    s.face('cassian', 'down');
    if (hasPip(s)) {
      s.face('cassian', who(s, 'pip'));
      await s.say('Cassian', 'And who is this?');
      await s.say('Pip', 'Nobody. Just a nobody. Nobody important.');
      await s.say('Cassian', 'Everyone is somebody. What is your name?');
      await s.say('Pip', '...Pip.');
      await s.say('Pip', 'And kids are going missing in Low Town, and nobody up here cares, so maybe you could. Care. Sir. Your Holiness.');
      await s.wait(0.6);
      await s.say('Cassian', 'Missing?');
      await s.say('Pip', 'Three of mine. Gone in the night. No blood, no nothing.');
      await s.say('Cassian', '...I will speak to the Dawnguard tonight. And to Sister Mercy at the almshouse — no one knows Low Town\'s children better.');
      await s.say('Pip', '...');
    }
    s.face('cassian', 'player');
    await s.say('Cassian', 'Wren. I have been looking for someone for a long time.');
    await s.say('Cassian', 'Someone to walk beside me. To carry my word to the Keepers. To learn the Lanterns as I learned them, when I was young.');
    await s.say('Cassian', 'A Lantern Page.');
    await s.wait(1.0);
    await s.say('Cassian', 'It is not an easy post. It means the road. It means being very far from home.');
    await s.hop('player');
    await s.say('Wren', 'I— yes. _Yes._ I mean— are you sure? I\'ve only been Kindled for—');
    await s.say('Cassian', 'Your mother is the finest Keeper in Solmere. And you have something she does not.');
    await s.say('Wren', 'What?');
    await s.say('Cassian', 'You want to leave.');
    await s.wait(1.2);
    await s.narrate('Ilse says nothing. She is watching the Hierophant\'s hands.');
    await s.say('Cassian', 'Think on it tonight. Rooms are taken for you at the Ringing Bell, on the Choir\'s account. And the archives are open to you — all of them. Brother Quill will help Sable look.');
    await s.move(who(s, 'sable'), [[5, 6]], 2);
    await s.say('Sable', 'Who is Lysa?');
    s.stopMusic(0.5);
    await s.wait(1.6);
    await s.say('Cassian', '...Someone I lost. A long time ago.');
    await s.say('Cassian', 'Forgive me — you resemble her. It startled an old man, at your Kindling.');
    await s.say('Sable', 'Did you find her?');
    await s.wait(1.4);
    await s.say('Cassian', 'Not yet.');
    s.music('cassian');
    await s.wait(0.6);
    await s.say('Cassian', 'Go. Eat something. Aurenne is beautiful at dusk.');
    disperse(s);
    s.remove('cassian');
    s.journal('Cassian asked me to be his Lantern Page. ME. Sable asked him who Lysa is. He said: someone I lost. She asked if he\'d found her. He said: not yet.');
    await s.fadeOut(0.8);
    await s.teleport('aurenne', 21, 8, 'down');
  },

  /** Outside on the Cathedral steps at dusk. */
  async duskTalk(s) {
    if (!s.flag('c3_met') || s.flag('c3_dusk_talk')) return;
    s.setFlag('c3_dusk_talk');
    gather(s, { ilse: [20, 9, 'up'], bram: [22, 9, 'up'], sable: [21, 10, 'up'], pip: [20, 10, 'up'] });
    s.face('player', 'down');
    await s.say('Wren', 'A Lantern Page. _Me._ Ilse, do you know what that means?');
    await s.say('Ilse', 'It means he\'s known you for three days and already wants you working for him.');
    await s.say('Wren', 'He\'s known me for _two years_. Letters count.');
    await s.say('Ilse', 'Letters count. Right.');
    await s.say('Bram', 'It\'s a great honor, Ilse. The last Lantern Page became an Archdeacon.');
    await s.say('Ilse', 'And the one before that?');
    await s.wait(0.6);
    await s.say('Bram', '...I don\'t actually know.');
    await s.say('Sable', 'He said "not yet."');
    await s.say('Wren', 'What?');
    await s.say('Sable', 'When I asked if he found her. People don\'t say "not yet" about the dead.');
    if (hasPip(s)) {
      await s.say('Pip', 'Can we talk about _my_ people now? The ones who are actually missing?');
      await s.say('Wren', 'Tomorrow. First thing. Cassian said he\'d talk to the Dawnguard tonight.');
      await s.say('Pip', '...Tomorrow. Sure. That\'s how it always goes.');
      await s.say('Pip', 'I\'m going to check on Nell. Drain-house in Low Town. Don\'t wait up, Fish-Bird.');
    }
    disperse(s);
    s.objective('Evening falls on Aurenne. Rest at the Ringing Bell (Bell Market) — the Choir is paying.');
    s.journal('Ilse thinks Cassian wants something. Ilse thinks everyone wants something. Pip went back to Low Town to check on Nell.');
  },

  // ================================================================ NIGHT, AND THE DREAM
  async innNight(s) {
    if (s.flag('c3_night')) return;
    s.setFlag('c3_night');
    await s.say('Marta', 'The Hierophant\'s guests! Put your coin away, loves — the Choir\'s paying, and the Choir tips. Rooms at the top of the stairs.');
    await s.fadeOut(1.2);
    s.stopMusic(1);
    ringBells(s, 12, 150, 0.5);
    await s.narrate(['That night, the bells of Aurenne rang twelve times.', 'And then they were quiet.']);
    s.heal();
    await s.say('Wren', '_(whispering)_ Ilse? You awake?');
    await s.say('Ilse', 'No.');
    await s.say('Wren', 'He asked _me._');
    await s.say('Ilse', 'I know.');
    await s.say('Wren', 'Nobody\'s ever asked me to be anything. They just told me what I was going to be. Keeper. Like Mom. Like her mom.');
    await s.wait(0.8);
    await s.say('Ilse', '...I know, Wren.');
    if (s.flag('c3_ambrose')) {
      await s.say('Ilse', 'Master Ambrose offered me a place. At the Infirmary.');
      await s.say('Wren', 'Ilse! That\'s— are you going to take it?');
      await s.say('Ilse', 'No.');
      await s.say('Wren', 'Why not?');
      await s.say('Ilse', 'Because somebody has to read your fine print.');
    } else {
      await s.say('Ilse', 'Just— read the fine print. Whatever he\'s offering. Read all of it.');
      await s.say('Wren', 'Since when do you read fine print?');
      await s.say('Ilse', 'Since always. You never noticed, because you were busy reading the fun part.');
    }
    await s.wait(1.0);
    await s.narrate('Across the room, Sable is dreaming.');
    const lead = s.state.party[0];
    s.vars.c3_dreamer = [lead, s.state.characters[lead].lookId];
    s.setLook(lead, 'lysa');
    await s.teleport('c3_dream', 13, 17, 'up', { color: '#fff6e0' });
  },

  async dreamOpen(s) {
    if (!s.flag('c3_night') || s.flag('c3_dream_done') || s.flag('c3_dream_open')) return;
    s.setFlag('c3_dream_open');
    s.music('evernoon');
    await s.narrate(['Summer.', 'It smells like cut grass and honey-bread and warm stone.', 'Somewhere, a boy is calling a name.']);
    await s.say('???', 'Lysa! Lysa, _come on!_', { portrait: false });
  },

  async dreamClimax(s) {
    if (s.flag('c3_dream_done')) return;
    s.setFlag('c3_dream_done');
    s.place('player', 13, 10, 'up');
    s.face('boy', 'down');
    await s.say('Boy', 'There you are! Father\'s lighting it early tonight, for the festival. We can watch from the gallery if we\'re quiet.');
    await s.say('Boy', 'You\'re never quiet.');
    await s.wait(0.8);
    await s.say('Boy', '...Lysa? Why are you looking at me like that?');
    await s.say('???', 'I don\'t know you.', { portrait: false });
    await s.say('Boy', '_(laughing)_ Stop it. You always do this.');
    await s.move('boy', [[13, 9]], 1.2);
    await s.say('Boy', 'Here. Take my hand. It\'s getting dark.');
    await s.wait(1.0);
    s.stopMusic(0.2);
    s.sfx('dark');
    s.flash('#20103a', 0.5);
    s.shake(0.3, 1.4);
    await s.fadeOut(0.6, '#0e0618');
    await s.narrate(['The light goes out. All of it, all at once.', 'Something cold comes in where the light was.']);
    await s.say('Boy', 'LYSA! TAKE MY HAND— _LYSA!_', { portrait: false });
    await s.narrate(['His hand is so warm.', 'And then it isn\'t there.']);
    await s.wait(0.8);
    wake(s);
    await s.teleport('c3_inn', 10, 4, 'right');
  },

  /** Morning at the Ringing Bell: the dream, and Nell is gone. */
  async morning(s) {
    if (!s.flag('c3_dream_done') || s.flag('c3_morning')) return;
    s.setFlag('c3_morning');
    wake(s);
    s.music('sad');
    gather(s, { sable: [12, 3, 'down'], ilse: [11, 4, 'left'], bram: [9, 4, 'right'] });
    s.face('player', 'right');
    await s.wait(0.6);
    await s.say('Wren', 'Sable? You\'re shaking.');
    await s.say('Sable', 'I had a dream. I think it was a dream.');
    await s.say('Sable', 'There was a boy. He called me Lysa. He wanted me to take his hand.');
    await s.say('Sable', 'Then the light went out.');
    await s.wait(0.8);
    await s.say('Bram', 'Lysa. That\'s what the Hierophant called you. At the Kindling.');
    await s.say('Sable', 'He had grey eyes. Like the Hierophant\'s.');
    await s.say('Wren', 'It\'s just a dream. You heard the name, and dreams— they take things and stir them up.');
    await s.say('Sable', 'Do dreams smell like summer?');
    await s.wait(1.0);
    await s.say('Ilse', '...Some do.');
    // Pip bursts in.
    s.spawn('c_pip', s.state.characters.pip?.look || 'pip', 7, 9, 'up');
    await s.move('c_pip', [[7, 6], [9, 5]], 6.5);
    await s.say('Pip', 'Nell\'s gone.');
    await s.say('Wren', 'What?');
    await s.say('Pip', 'She was in the drain-house. I told her stay put. I _told_ her— and this morning her blanket\'s there and she isn\'t.');
    await s.wait(0.8);
    await s.say('Pip', 'You said tomorrow.');
    await s.say('Wren', 'Pip, I—');
    await s.say('Pip', 'Doesn\'t matter. Old Mag sleeps by the river. She saw something, she won\'t say it to me. She might to you.');
    await s.say('Pip', 'Come on. Or don\'t.');
    await s.move('c_pip', [[7, 6], [7, 9]], 6.5);
    disperse(s);
    s.objective('Find out what happened to Nell. Ask Old Mag in Low Town (south-east, by the river).');
    s.journal('Sable dreamed that a boy called her Lysa, and then the light went out. In the morning, Nell was gone. I told Pip "tomorrow."');
  },

  // ================================================================ LOW TOWN
  async oldMag(s) {
    if (!s.flag('c3_morning')) {
      return s.say('Old Mag', ['A coin for an old woman? No? Then a smile. No? Then move along, you\'re in my sun.']);
    }
    if (s.flag('c3_mag')) return s.say('Old Mag', ['Behind the almshouse. The old stair. Mind the singing.']);
    s.setFlag('c3_mag');
    await s.say('Old Mag', 'Pip\'s new friends. Fancy boots. You\'ll want to know about last night.');
    await s.say('Old Mag', 'Singing. I heard singing. Sisters in grey with little lanterns, walking slow and pretty.');
    await s.say('Old Mag', 'They led the young ones out of the drain-house like ducklings. And the young ones went _smiling_.');
    await s.say('Pip', 'Nell went with them? _Smiling?_');
    await s.say('Old Mag', 'Smiling like they\'d been promised supper. Round the back of the almshouse they went. Down the old stair, where the Undercroft starts.');
    await s.say('Old Mag', 'There\'s a grate down there. Always locked. Who locks a sewer, I ask you.');
    await s.say('Ilse', 'Someone who wants to be sure of who comes out.');
    await s.say('Old Mag', 'Sister Constance keeps the keys on her belt. Rattles like a jailer\'s.');
    s.objective('The Undercroft grate behind the almshouse is locked. Sister Constance at the almshouse keeps the keys.');
    s.journal('Old Mag saw grey Sisters lead the children down the old stair behind the almshouse — singing. The children were smiling.');
  },

  /** The almshouse: keep Sister Constance talking while Pip lifts her keys. */
  async constance(s) {
    if (s.flag('c3_mercy_down')) return s.say('Constance', ['...She told us it was a mercy. She told us they felt nothing.', 'The Dawnguard says I may go. I don\'t know where.']);
    if (!s.flag('c3_mag') || s.flag('c3_key')) {
      if (s.flag('c3_key')) return s.say('Constance', 'Was there something else? Sister Mercy is... at prayer. Below— _at prayer_.');
      return s.say('Constance', ['Welcome to the house of Small Mercies. Soup at noon and vespers. Beds for those who ask.', 'Sister Mercy says no one should ever have to be cold. Isn\'t that beautiful?']);
    }
    s.setFlag('c3_key');
    gather(s, { pip: [6, 6, 'up'], ilse: [3, 7, 'up'], bram: [5, 7, 'up'], sable: [2, 6, 'up'] });
    s.place('player', 4, 6, 'up');
    await s.say('Wren', 'Sister. The children from the drain-house. Where did your Sisters take them last night?');
    await s.say('Constance', '...Take them? No one took anyone. We feed them. We give them beds.');
    await s.say('Wren', 'Then where are the beds?');
    await s.say('Constance', 'Sister Mercy is at prayer below— _at prayer._ You may come back at vespers.');
    await s.say('Pip', '_(whispering)_ Keep her talking.');
    const pick = await s.choice(['Ask about the soup.', 'Ask about Sister Mercy.', 'Have Bram ask about the beds.'], { prompt: 'Keep her talking!' });
    if (pick === 0) {
      await s.say('Wren', 'The soup! It smells— amazing. Is that... leek?');
      await s.say('Constance', 'Leek and barley. And a little thyme, when the Choir\'s purse allows.');
      await s.say('Wren', 'Thyme! My mother grows thyme. Well, she grows _at_ it. It mostly refuses.');
    } else if (pick === 1) {
      await s.say('Wren', 'Sister Mercy seems so... devoted. How long have you known her?');
      await s.say('Constance', 'Eleven years. She found me on the cathedral steps. She found all of us, one way or another.');
      await s.say('Constance', 'She says the sun should never have to set on anyone. Isn\'t that lovely?');
    } else {
      await s.say('Bram', 'Sister! As a knight of— as a squire of the Dawnguard, I must ask about the, ah. The beds. Their... softness. Specifically.');
      await s.say('Constance', '...Their softness.');
      await s.say('Bram', 'For a report. A very official report. About beds.');
    }
    await s.move(who(s, 'pip'), [[6, 5], [5, 4]], 3.5);
    s.face(who(s, 'pip'), 'left');
    s.sfx('steal');
    await s.wait(0.3);
    await s.move(who(s, 'pip'), [[6, 5], [6, 6]], 3.5);
    s.face(who(s, 'pip'), 'up');
    await s.say('Constance', 'Now, if you\'ll excuse me. Vespers.');
    await s.give('undercroft_key');
    await s.say('Ilse', '_(whispering)_ Pip. That\'s stealing from a nun.');
    await s.say('Pip', '_(whispering)_ It\'s borrowing with confidence.');
    disperse(s);
    s.objective('Open the old Undercroft grate behind the almshouse (east end of Low Town).');
    s.journal('Pip lifted Sister Constance\'s keys while Bram interrogated her about beds. Ilse is appalled. I\'m a little impressed.');
  },

  async undercroftGate(s) {
    if (s.flag('c3_uc_open')) return;
    if (!s.has('undercroft_key')) {
      return s.narrate(s.flag('c3_mag')
        ? 'An iron grate across the old stair, chained and locked. The chain is new. The lock is newer.'
        : 'An iron grate across a stair that goes down into the dark. A cold draft breathes up through it, smelling of wet stone and candle-smoke.');
    }
    s.setFlag('c3_uc_open');
    s.sfx('door');
    s.clearBlocker('c3_uc_gate');
    await s.say('Pip', 'Nell. I\'m coming.');
    await s.say('Ilse', 'Three things. One: we stay together. Two: nobody touches anything purple.');
    await s.say('Bram', 'And three?');
    await s.say('Ilse', 'Three: if anyone sings at us, we hit them.');
    await s.say('Sable', 'I like three.');
    s.objective('Descend into the Undercroft and find the missing children.');
  },

  // ================================================================ THE UNDERCROFT
  async sewersEnter(s) {
    if (s.flag('c3_uc_entered')) return;
    s.setFlag('c3_uc_entered');
    s.music('cave');
    await s.say('Bram', 'Ugh. The smell.');
    await s.say('Pip', 'That\'s the smell of the whole city, going somewhere else. You get used to it.');
    await s.say('Sable', 'There are footprints. Small ones. And bigger ones, walking beside them.');
  },

  async valve(s, which) {
    const flag = `c3_valve_${which}`;
    if (s.flag(flag)) return s.narrate('The valve wheel is turned as far as it will go.');
    s.setFlag(flag);
    s.sfx('rumble');
    s.shake(0.12, 0.8);
    await s.narrate('The wheel shrieks, sticks, and then turns. Somewhere down the tunnel, iron grinds against iron.');
    if (s.flag('c3_valve_a') && s.flag('c3_valve_b')) {
      s.setFlag('c3_sluice');
      s.clearBlocker('c3_sluice_n');
      s.clearBlocker('c3_sluice_s');
      await s.narrate('With a long groan, the great sluice gate in the main tunnel lifts.');
      await s.say('Bram', 'Was that us? I think that was us.');
      s.objective('The sluice gate is open. Press on east, deeper into the Undercroft.');
    } else {
      await s.say('Ilse', 'One more, I think. These gates always come in pairs. Like shoes. Or bad ideas.');
      s.objective('Turn the second valve wheel to raise the sluice gate.');
    }
  },

  async sluiceGate(s) {
    if (s.flag('c3_sluice')) return;
    await s.narrate('A rusted sluice gate seals the tunnel from wall to wall. Two pipes run from it — one north, one south — to valve wheels somewhere in the dark.');
    s.objective('Find the two valve wheels (north and south passages) to raise the sluice gate.');
  },

  async ossuaryEnter(s) {
    if (s.flag('c3_oss_entered')) return;
    s.setFlag('c3_oss_entered');
    await s.say('Pip', 'I\'ve never been this deep. Nobody comes this deep.');
    await s.say('Bram', 'Bones. Lots of bones. Ilse, are there meant to be this many bones?');
    await s.say('Ilse', 'Aurenne buried its dead under its streets for six hundred years. There are meant to be _more_.');
    await s.narrate('Far ahead, a bell tolls once — low and cracked — though there is no tower down here.');
  },

  async lysaNiche(s) {
    await s.narrate([
      'A small niche, set apart from the others. A child\'s name is carved over it:',
      '*LYSA LORNE · TEN YEARS · NOT LOST, ONLY WAITING*',
      'A candle burns in the niche. It is fresh. Someone has lit it in the last day or two.',
    ]);
    if (s.flag('c3_niche_seen')) return;
    s.setFlag('c3_niche_seen');
    await s.say('Pip', 'Somebody comes all the way down here. Regular.');
    await s.say('Sable', '...');
    await s.say('Wren', 'Sable?');
    await s.say('Sable', 'It is the name from my dream.');
    await s.say('Ilse', 'Lorne. Wren — the Hierophant\'s name is Cassian _Lorne._');
    await s.wait(1.0);
    await s.say('Wren', '...Then she was his sister. That\'s all. He lost his sister, and he still lights her a candle. That\'s not strange. That\'s _sad._');
    await s.say('Sable', 'Yes. It is sad.');
    s.journal('In the catacombs there\'s a niche for a girl called LYSA LORNE, ten years old. Someone keeps a candle burning there. Cassian Lorne lost a sister.');
  },

  /** The bell foundry: the Carillon Wight. */
  async wight(s) {
    if (s.flag('c3_wight_down')) return;
    s.music('tension');
    await s.pan(35, 14, 1.2);
    await s.narrate('In the old bell-foundry, among cold furnaces, something enormous is ringing a cracked bell with a hammer. Very slowly. Over and over.');
    await s.say('Bram', 'Is that... a skeleton? Ringing a bell?');
    await s.say('Pip', 'At least it\'s not singing.');
    await s.narrate('The ringing stops. The skull turns.');
    await s.follow(0.6);
    const r = await s.battle('c3_boss_wight');
    if (r !== 'win') return;
    s.setFlag('c3_wight_down');
    s.music('cave');
    await s.narrate('The Wight comes apart like a dropped armful of firewood. Among the bones lies a bronze hammer, worn smooth.');
    await s.give('c3_bell_hammer');
    SIDE.hammerFound(s);
    await s.say('Bram', 'GLORIA, it says on the handle. Who names a hammer?');
    await s.say('Pip', 'Old Tolliver does. The bell-ringer up in the market. He\'s been crying about it for a week. Says the noon bell won\'t ring true without her.');
    s.objective('Press on toward the stair at the far end of the ossuary.');
  },

  async labEnter(s) {
    if (s.flag('c3_lab_entered')) return;
    s.setFlag('c3_lab_entered');
    s.music('gloam');
    await s.narrate([
      'The stone gives way to something else. The walls breathe. Violet light pools on the floor like spilled wine.',
      'And there are cells. And in the cells there are people.',
    ]);
    await s.say('Ilse', '...Oh, no.');
    await s.say('Pip', 'NELL! _NELL!_');
    await s.say('Sable', 'This place is made of the same thing I am made of.');
    await s.say('Wren', 'What?');
    await s.say('Sable', 'I don\'t know why I said that.');
    s.objective('Find Nell and the missing — and whoever is doing this.');
  },

  /** The Crucible: Sister Mercy. */
  async mercyBoss(s) {
    if (s.flag('c3_mercy_down')) return;
    s.stopMusic(1);
    s.place('player', 24, 23, 'down');
    gather(s, { ilse: [23, 22, 'down'], bram: [25, 22, 'down'], sable: [22, 23, 'down'], pip: [26, 23, 'down'] });
    s.face('mercy', 'down');
    await s.pan(24, 25, 1.0);
    await s.say('Mercy', '...and the sun shall not go down, and the night shall not come, and every good day shall be the last day, forever...', { speed: 0.7 });
    s.face('mercy', 'up');
    await s.say('Mercy', 'Pipkin. You came to me after all. They always come to me in the end — when they\'re tired.');
    await s.say('Pip', 'Where\'s Nell.');
    await s.say('Mercy', 'Safe. Warm. Waiting. Soon she\'ll never be cold again, or hungry, or eleven years old in a city that steps over her.');
    await s.say('Ilse', 'You\'re turning people into those— _things._');
    await s.say('Mercy', 'Into _vessels_, dear. The Gloam is only memory. Pour enough into a body and the body forgets its pain.');
    await s.say('Mercy', 'Most of them forget everything else, too. That is the part I\'m still working on.');
    await s.say('Wren', 'The Choir trusted you. _Cassian_ trusted you!');
    await s.say('Mercy', '_(softly)_ Oh, child. You really don\'t know anything, do you.');
    s.face('mercy', who(s, 'sable'));
    await s.wait(0.8);
    await s.say('Mercy', '...And you. So _you\'re_ the one.');
    await s.say('Sable', 'The one what?');
    await s.say('Mercy', 'The one that worked.');
    await s.wait(1.2);
    await s.say('Bram', 'Enough! Stand aside, Sister, in the name of the Dawnguard!');
    s.face('mercy', who(s, 'bram'));
    await s.say('Mercy', 'Squire Kestrel. The one who froze.');
    await s.wait(1.0);
    await s.say('Bram', '...');
    await s.say('Wren', 'Leave him alone.');
    await s.say('Mercy', 'I\'ll leave all of you alone. For ever and ever. Hush now. Let me sing.');
    await s.follow(0.4);
    const r = await s.battle('c3_boss_mercy');
    if (r !== 'win') return;
    s.setFlag('c3_mercy_down');
    s.music('tension');
    await s.say('Mercy', '...Well. Aren\'t you all so very... _awake._');
    await s.move('mercy', [[24, 26]], 1);
    await s.say('Mercy', 'Keep them, then. Keep your cold, hungry little lives. I have what I needed.');
    s.face('mercy', who(s, 'sable'));
    await s.say('Mercy', 'You\'ll see. All of you.');
    await s.say('Mercy', '_Noon is coming._', { speed: 0.6 });
    s.sfx('dark');
    s.flash('#2a1040', 0.6);
    s.remove('mercy');
    await s.narrate('She steps backward into her own shadow, and the shadow closes over her like water.');
    await s.say('Pip', 'She— where\'d she _go?_');
    await s.say('Sable', 'Into the dark. The dark has back doors.');
    await s.say('Bram', 'Noon? It\'s barely morning.');
    await s.say('Sable', 'She didn\'t mean the time.');
    s.sfx('burst');
    await s.narrate('Somewhere behind them, every cell door in the laboratory unlocks at once.');
    await CH3.rescue(s);
  },

  async rescue(s) {
    s.music('sad');
    s.spawn('nell_r', 'nell', 24, 29, 'up');
    await s.move('nell_r', [[24, 25]], 4);
    if (hasPip(s)) {
      await s.move(who(s, 'pip'), [[25, 24]], 4);
      s.face(who(s, 'pip'), 'left');
      s.face('nell_r', 'right');
      await s.say('Nell', 'Pip? ...You came.');
      await s.say('Pip', 'Course I came. I\'m the Prince.');
      await s.say('Nell', 'You\'re not a prince.');
      await s.say('Pip', 'Shut up. I came.');
      await s.narrate('He hugs her so hard she squeaks. Neither of them mentions it, then or ever.');
    }
    await s.say('Nell', 'Tuck\'s here. And Wick. They\'re cold, and Wick won\'t stop crying, but they\'re _them._ They\'re still them.');
    await s.say('Ilse', 'Bram. Help me with the adults. Some of them can\'t walk.');
    await s.say('Bram', 'Carrying. Yes. I am good at carrying.');
    s.remove('nell_r');
    disperse(s);
    s.journal('Sister Mercy was making Gloam beasts out of the poor of Low Town. We beat her, but she walked into her own shadow and was gone. "Noon is coming," she said. We got Nell, Tuck and Wick out — and Rowan the baker, and eleven others.');
    await s.fadeOut(1.5);
    await s.narrate(['They bring fourteen people up out of the dark that morning.', 'By noon, all of Aurenne knows.']);
    await s.teleport('aurenne', 21, 13, 'up');
  },

  // ================================================================ AFTERMATH
  /** Cathedral Square: Cassian condemns Mercy before the city. */
  async condemnation(s) {
    if (!s.flag('c3_mercy_down') || s.flag('c3_condemned')) return;
    s.setFlag('c3_condemned');
    s.music('cassian');
    s.place('player', 21, 13, 'up');
    gather(s, { ilse: [20, 14, 'up'], bram: [22, 14, 'up'], sable: [19, 13, 'up'], pip: [23, 13, 'up'] });
    s.spawn('cassian', 'cassian', 21, 9, 'down');
    s.spawn('garrick', 'garrick', 19, 10, 'down');
    s.spawn('aco1', 'acolyte', 17, 9, 'down');
    s.spawn('aco2', 'acolyte', 25, 9, 'down');
    s.spawn('dg1', 'dawnguard', 16, 11, 'down');
    s.spawn('dg2', 'dawnguard', 26, 11, 'down');
    const crowd = [[14, 13], [16, 13], [18, 12], [24, 12], [26, 13], [28, 13], [15, 11], [27, 11], [15, 12], [27, 12]];
    crowd.forEach(([x, y], i) => s.spawn(`crowd${i}`, `villager_${40 + i}`, x, y, 'up'));
    await s.pan(21, 10, 1.2);
    ringBells(s, 3, 150, 1.2);
    await s.wait(1.6);
    await s.say('Cassian', 'People of Aurenne. Last night, the Choir failed you.');
    await s.say('Cassian', 'A woman who wore our sunburst — who fed your children with one hand — took them with the other.');
    await s.say('Cassian', 'Sister Mercy Vale is no longer of the Choir. She is cast out. Her name is struck from every book we keep.');
    await s.narrate('A sound goes through the crowd. Not a cheer. Something lower, and older.');
    await s.say('Cassian', 'To the families of Low Town: I am sorry. Words are small. Today they are what I have. Tomorrow, the Choir\'s coffers open to you.');
    await s.say('Cassian', 'And to the children who went down into the dark when the Choir would not —');
    await s.narrate('He looks straight at Wren.');
    await s.say('Cassian', '— thank you.');
    s.sfx('holy');
    await s.narrate('Now the crowd cheers. It goes on for a long time.');
    await s.say('Garrick', 'The Dawnguard will find her, Holiness. Wherever she\'s crawled to.');
    await s.say('Cassian', 'I know you will, Garrick.');
    await s.move('cassian', [[21, 8], [21, 7]], 1.6);
    s.remove('cassian');
    await s.follow(0.6);
    await s.move('garrick', [[19, 12], [21, 12]], 2.2);
    s.face('garrick', who(s, 'bram'));
    await s.say('Garrick', 'Kestrel. They let you hold a sword again. Brave of them.');
    await s.wait(0.8);
    await s.say('Bram', '...Lord-Commander.');
    await s.move('garrick', [[19, 11], [13, 11], [13, 9], [9, 9]], 2.2);
    s.remove('garrick');
    await s.say('Pip', 'Who\'s the walking anvil?');
    await s.say('Bram', 'Lord-Commander Garrick Thorne. Head of the Dawnguard. He... trained me.');
    await s.say('Pip', 'He\'s a jerk.');
    await s.say('Bram', 'He\'s the Lord-Commander.');
    await s.say('Pip', 'Can\'t he be both?');
    await s.wait(0.6);
    await s.say('Bram', '..._(very quietly)_ Yes. He can.');
    ['aco1', 'aco2', 'dg1', 'dg2'].forEach((id) => s.remove(id));
    crowd.forEach((_, i) => s.remove(`crowd${i}`));
    s.spawn('imre_sq', 'imre', 21, 9, 'down');
    await s.move('imre_sq', [[21, 11]], 2);
    await s.say('Imre', 'His Holiness asks for you in his study. All of you. ...Especially the Page.');
    s.remove('imre_sq');
    disperse(s);
    s.objective('Cassian has asked for you in his study (Cathedral of Dawn, back-left door).');
    s.journal('Cassian cast Mercy out in front of the whole city and thanked us in front of the whole city. Garrick Thorne was there. Bram went very quiet.');
  },

  /** The study: the tuning forks. */
  async mission(s) {
    if (!s.flag('c3_condemned') || s.flag('c3_forks')) return;
    s.setFlag('c3_forks');
    s.music('cassian');
    s.place('player', 6, 7, 'up');
    gather(s, { ilse: [5, 8], bram: [7, 8], sable: [4, 7], pip: [8, 8] });
    s.spawn('cassian', 'cassian', 6, 5, 'down');
    await s.wait(0.6);
    await s.say('Cassian', 'Fourteen people. Fourteen people who would be in the Gloam tonight, if not for you.');
    await s.say('Cassian', 'The Gloam is rising, Wren. Mercy was a symptom. Rot always finds the weak places first — a city\'s poor. A Lantern\'s flicker.');
    await s.say('Cassian', 'For a thousand years the Seven Lanterns have sung the sun up. But they sing _apart_, each Keeper to her own light.');
    await s.say('Cassian', 'If they sang together — in true harmony — no darkness could stand against them. Not ever again.');
    await s.narrate('He sets a long case on the desk and opens it. Inside, on blue velvet, lie six silver tuning forks.');
    await s.say('Cassian', 'Blessed in the Grand Lantern\'s light. A Keeper need only strike one beside her Dawnstone, and her Lantern will learn the note. Six Lanterns. One song.');
    await s.say('Cassian', 'I would carry them myself. But Aurenne needs its Hierophant now, more than it has in forty years.');
    await s.say('Cassian', 'I need a Page.');
    await s.wait(0.8);
    await s.say('Wren', 'Yes. Yes — we\'ll do it. I\'ll do it.');
    await s.give('tuning_fork');
    await s.say('Cassian', 'Start south. Saltglass, in the Sunscar. Keeper Tamsin is... difficult. You\'ll like her. Then Frosthollow, Mirefen, Thornwood, and Skyreach above the storm.');
    await s.say('Ilse', 'That\'s five. You said six forks. And there are seven Lanterns.');
    await s.say('Cassian', 'The Grand Lantern is mine to tune. And Lanternfall\'s... your mother\'s Lantern I will see to myself.');
    await s.wait(0.6);
    await s.say('Ilse', '...And the sixth fork?');
    await s.say('Cassian', 'A spare. Roads are long, and things are lost on them.');
    await s.move(who(s, 'sable'), [[5, 6]], 2);
    await s.say('Sable', 'It hums.');
    await s.say('Cassian', 'Every true note does.');
    await s.say('Sable', 'This one hums backwards.');
    await s.wait(1.4);
    await s.say('Cassian', '_(smiling)_ What a curious ear you have.');
    if (hasPip(s)) {
      s.face('cassian', who(s, 'pip'));
      await s.say('Cassian', 'And Pip. Your friends will be cared for — the Choir will see to it. Truly cared for, this time.');
      await s.say('Pip', '...Marta at the Ringing Bell already said she\'d take them. Dishes for beds. She doesn\'t sing.');
      await s.say('Cassian', '_(a small laugh)_ A wise arrangement.');
    }
    s.face('cassian', 'player');
    await s.say('Cassian', 'Wren. If you write to your mother — tell her the Hierophant sends his regards. And that her daughter is doing great things.');
    await s.say('Wren', 'I will. I— thank you. For everything.');
    s.remove('cassian');
    disperse(s);
    s.objective('The Pilgrim Road leads south to Saltglass. Leave Aurenne by the South Gate when you\'re ready.');
    s.journal('Cassian named me his Lantern Page and gave us six blessed tuning forks for the Keepers. Ilse says read the fine print. Sable says the forks hum backwards. The road goes south.');
    await s.fadeOut(0.8);
    await s.teleport('aurenne', 21, 8, 'down');
  },

  async forksTalk(s) {
    if (!s.flag('c3_forks') || s.flag('c3_forks_talk')) return;
    s.setFlag('c3_forks_talk');
    gather(s, { ilse: [20, 9, 'up'], bram: [22, 9, 'up'], sable: [21, 10, 'up'], pip: [20, 10, 'up'] });
    s.face('player', 'down');
    await s.say('Wren', 'The Lantern Page. Carrying the Hierophant\'s blessing to every Keeper in the world. Ilse, this is— this is a _story._ We\'re in a story.');
    await s.say('Ilse', 'Three things.');
    await s.say('Ilse', 'One: yesterday we walked out of a cellar full of monsters made out of people. Two: a woman in the Choir\'s robes made them, under the Choir\'s own floor.');
    await s.say('Ilse', 'Three: we are now carrying the Choir\'s mail.');
    await s.say('Wren', 'Cassian _condemned_ her. In front of the whole city. What more do you want?');
    await s.say('Ilse', 'I want to know how the Hierophant of the whole world didn\'t notice what was under his own feet.');
    await s.wait(0.8);
    await s.say('Sable', 'The note in the forks. I don\'t like it.');
    if (hasPip(s)) {
      await s.say('Pip', 'So we\'re going to the desert? I\'ve never seen a desert. Is it just a really big beach?');
      await s.say('Bram', '...Yes. Essentially.');
      await s.say('Pip', 'Brilliant. Fish-Bird\'ll feel right at home.');
    }
    disperse(s);
  },

  /** South Gate: goodbyes, and the road. */
  async departure(s) {
    if (!s.flag('c3_forks') || s.flag('c3_done')) return;
    s.setFlag('c3_done');
    s.music('sad');
    s.place('player', 20, 45, 'down');
    gather(s, { ilse: [19, 45, 'down'], bram: [21, 45, 'down'], sable: [22, 45, 'down'] });
    if (hasPip(s)) {
      s.spawn('c_pip', s.state.characters.pip.look, 20, 46, 'up');
      s.spawn('nell_g', 'nell', 20, 42, 'down');
      s.spawn('tuck_g', 'tuck', 19, 41, 'down');
      s.spawn('wick_g', 'wick', 21, 41, 'down');
      await s.move('nell_g', [[20, 44]], 4);
      await s.move('c_pip', [[20, 45]], 3);
      await s.say('Nell', 'You\'re really going.');
      await s.say('Pip', 'Somebody\'s got to keep Fish-Bird out of trouble. You\'ve seen her. She\'s a disaster.');
      await s.say('Nell', 'You\'re coming back?');
      await s.say('Pip', 'Course. I\'m the Prince. Princes come back. That\'s the whole point of them.');
      await s.say('Pip', 'You\'re in charge while I\'m gone. Mind Wick. And don\'t let Tuck near Marta\'s pies.');
      await s.say('Nell', 'I was always in charge, Pip.');
      await s.say('Pip', '...Yeah. I know.');
      await s.narrate('Tuck waves with both arms. Wick has stopped crying. Nell does not wave at all; she watches, the way you watch something you mean to remember.');
      s.remove('c_pip');
      await s.move('nell_g', [[20, 42]], 3);
    }
    await s.say('Wren', 'Ready?');
    await s.say('Ilse', 'No. Let\'s go.');
    ringBells(s, 8, 196, 0.7);
    await s.narrate('Behind them, the bells of Aurenne ring the noon. They ring true.');
    await s.fadeOut(1.5);
    s.stopMusic(1.5);
    await s.chapter(4, 'The Pilgrim Road');
    s.objective('Follow the Pilgrim Road south across the Sunscar to Saltglass, and Keeper Tamsin.');
    s.journal('We left Aurenne at noon. Six forks, five Keepers, one road. Nell watched us go like she was memorizing us.');
    await s.teleport('sunscar_road', 4, 20, 'right');
  },
};
