// PROLOGUE — "The Eve of Kindling"
// Lanternfall, the day before Wren's sixteenth birthday.

import { keyCap } from '../core/Input.js';

export const PRO = {
  /** New game: narration, title card, waking up, Ysolde. */
  async opening(s) {
    if (s.flag('p_woke')) return;
    s.setFlag('p_woke');
    await s.fadeOut(0);
    s.stopMusic(0.1);
    s.place('player', 2, 3, 'down');
    s.show('ysolde', false);
    await s.wait(0.6);
    await s.narrate([
      'In the world of Solmere, the sun sets into the Western Sea every evening.',
      'Every dawn, the Seven Lanterns sing it back into the sky.',
      'And every child, at sixteen, stands in a Lantern\'s light to receive a Crest —',
      'the calling they will carry for the rest of their life.',
      '_One Crest. One life._',
      'That is how it has always been.',
    ]);
    await s.chapter(0, 'The Eve of Kindling');
    s.music('lanternfall');
    await s.fadeIn(1.2);
    await s.wait(0.4);
    await s.say('Ysolde', 'Wren! The sun\'s been up for an hour!', { portrait: false });
    await s.wait(0.3);
    s.show('ysolde', true);
    s.place('ysolde', 4, 7, 'up');
    await s.move('ysolde', [[4, 5], [3, 5], [3, 4]]);
    s.face('player', 'down');
    await s.say('Ysolde', 'There you are. I was starting to think the gulls had carried you off.');
    await s.say('Wren', 'I was reading.');
    await s.say('Ysolde', 'Until dawn. _Again._ Tomorrow you stand in the Lantern\'s light. You could at least do it with your eyes open.');
    await s.say('Wren', 'The Hierophant\'s ship comes in today, doesn\'t it? Ilse says he\'s coming himself. For *our* Kindling.');
    await s.wait(0.5);
    await s.say('Ysolde', '...He is.');
    await s.say('Wren', 'Mom. He\'s the *Hierophant*. He wrote back to me. Twice.');
    await s.say('Ysolde', 'I know. I read them.');
    await s.hop('player');
    await s.say('Wren', 'You read my—');
    await s.say('Ysolde', 'Chores. Tobias needs his net back from Nana Brisa\'s. After that you can go and gawk at the harbor with everyone else.');
    await s.move('ysolde', [[3, 5], [6, 5]]);
    s.face('ysolde', 'left');
    await s.think('Wren', 'Some mothers would be proud their daughter writes to the most important man in the world.');
    await s.say('Ysolde', 'Wren.');
    s.face('player', 'right');
    await s.wait(0.4);
    await s.say('Ysolde', 'Happy Kindling Eve, little bird.');
    s.objective('Fetch Fisher Tobias\'s mended net from Nana Brisa\'s house.');
    s.journal('The day before the Kindling. The Hierophant himself is coming to Lanternfall. Mom read my letters.');
    await s.wait(0.3);
    s.toast(`${keyCap('menu')} / <span class="key">Esc</span> opens the menu · hold ${keyCap('run')} to run`);
  },

  async ysoldeTalk(s) {
    if (s.flag('p_brooch_done')) return s.say('Ysolde', 'Supper soon. Wash the sea out of your hair first.');
    if (s.flag('p_brooch_quest')) return s.say('Ysolde', ['The tide caves? ...Of course you are.', 'Take Ilse. Stay out of the deep pools. And Wren — the tide comes back faster than you think.']);
    return s.say('Ysolde', ['Nana Brisa\'s house is the plaster one by the square. Red roof.', 'And don\'t let Tobias talk you into gutting fish. Not today.']);
  },

  // ------------------------------------------------------------------ Nana Brisa & Ilse
  async nanaFirst(s) {
    if (!s.flag('p_net_got')) {
      s.setFlag('p_net_got');
      await s.say('Ilse', 'You\'re late.');
      await s.say('Wren', 'I\'m *exactly* on time for someone who was reading.');
      await s.say('Nana Brisa', ['Wren, dear! Tobias\'s net is by the fire. Mended with my best knots — tell him that.']);
      await s.give('fishing_net');
      await s.say('Nana Brisa', 'If only everything mended so easily...');
      await s.say('Ilse', 'Nana lost her brooch. The silver gull Grandpa gave her.');
      await s.say('Nana Brisa', 'In the tide caves, years ago. I was gathering sea lavender and it simply... went into the water. I\'ve made my peace with it.');
      await s.say('Wren', 'The tide caves? I could get it back.');
      await s.say('Ilse', 'The tide caves are *full of things that bite*.');
      await s.say('Wren', 'Then you\'d better come with me. Bring your bandages.');
      s.face('ilse', 'down');
      await s.wait(0.4);
      await s.say('Ilse', 'Three things. One: we deliver the net first. Two: we\'re back before the ship comes in. Three: if you die, I\'m telling your mother.');
      await s.say('Wren', 'Deal.');
      s.remove('ilse');
      await s.join('ilse');
      s.state.characters.ilse.sealed = true;
      s.setFlag('p_brooch_quest');
      s.quest('p_brooch', 'Nana\'s Silver Gull', 'Find Nana Brisa\'s lost brooch in the Tide Caves, east of the village.');
      s.objective('Give the net to Fisher Tobias by the beach, then search the Tide Caves (east road) for Nana\'s brooch.');
      s.journal('Nana Brisa lost her silver gull brooch in the tide caves. Ilse and I are going to find it — after the net.');
      return;
    }
    if (s.flag('p_brooch_got') && !s.flag('p_brooch_done')) return PRO.nanaBrooch(s);
    if (s.flag('p_brooch_done')) return s.say('Nana Brisa', ['Tomorrow you\'ll both be grown. Sixteen.', 'I remember mine. My Crest burned so bright I couldn\'t see for an hour. Mender, same as Ilse will be — you mark my words.']);
    return s.say('Nana Brisa', ['The tide caves are east along the shore road. Mind the pools.']);
  },

  async nanaBrooch(s) {
    s.setFlag('p_brooch_done');
    s.quest('p_brooch', null, null, 'done');
    await s.say('Wren', 'Nana. Close your eyes and hold out your hand.');
    await s.take('nana_brooch');
    await s.wait(0.6);
    await s.say('Nana Brisa', '...Oh.', { speed: 0.5 });
    await s.say('Nana Brisa', 'Oh, my silly gull. Look at you. Still missing your wing tip.');
    await s.say('Nana Brisa', 'Thank you, my darlings. Here — I was saving these for after the Kindling, but I think you\'ve earned them early.');
    await s.give('sea_charm');
    await s.give('tonic', 3);
    await s.say('Ilse', 'She\'s going to cry.');
    await s.say('Nana Brisa', 'I am *not*. Off with you. Supper\'s at your mother\'s tonight, Wren, isn\'t it?');
    s.objective('Go home for supper.');
    s.journal('We found the brooch. Nana cried. (Ilse says she didn\'t.)');
  },

  // ------------------------------------------------------------------ Tobias
  async tobias(s) {
    if (s.flag('p_net_got') && !s.flag('p_net_done')) {
      s.setFlag('p_net_done');
      await s.take('fishing_net');
      await s.say('Fisher Tobias', 'Ha! Brisa\'s knots. I\'d know \'em in the dark.');
      await s.say('Fisher Tobias', 'Here — for your trouble. Don\'t tell your mother I\'m paying you in medicine. She\'ll think I\'m sweet on her.');
      await s.give('tonic', 3);
      await s.say('Fisher Tobias', 'Tide caves, is it? Careful. Tide\'s been strange all week. Pulls out further every morning, like the sea\'s holding its breath.');
      await s.say('Fisher Tobias', 'And take my old rod. A Halloway ought to fish. The dock end\'s good — face the water and give it a try.');
      await s.give('fishing_rod');
      s.objective('Search the Tide Caves (east road) for Nana\'s brooch.');
      return;
    }
    if (s.flag('p_storm_done')) return s.say('Fisher Tobias', ['A girl, out of the storm? The sea gives back strange things, Wren. Strange things.']);
    if (s.flag('p_net_done')) {
      const { anglerTalk } = await import('./fishing.js');
      return anglerTalk(s, 'Fisher Tobias');
    }
    return s.say('Fisher Tobias', ['Mornin\', Wren! Big day tomorrow, eh?', 'Brisa\'s got my net. I\'d fetch it myself but my knees and her stairs are not on speaking terms.']);
  },

  // ------------------------------------------------------------------ Tide caves
  async brooch(s) {
    if (s.flag('p_brooch_got')) return;
    await s.say('Wren', 'There — in the pool! Something silver.');
    await s.wait(0.3);
    s.shake(0.15, 0.6);
    await s.say('Ilse', 'Wren. The water\'s moving.');
    await s.emote('player', '!');
    const r = await s.battle('tc_eel', { bg: 'tidecave', music: 'boss' });
    if (r !== 'win') return;
    s.setFlag('p_brooch_got');
    await s.give('nana_brooch');
    await s.say('Ilse', 'A silver gull. Missing the tip of one wing. That\'s it!');
    await s.wait(0.4);
    await s.say('Wren', 'Ilse... look at the back of the cave.');
    await s.pan(39, 27, 1.2);
    await s.wait(0.5);
    await s.say('Ilse', 'Is that... a crystal? It\'s *purple*. Crystals in these caves are blue.');
    await s.say('Wren', 'It\'s cold. Colder than the water. Like it\'s breathing.');
    await s.say('Ilse', 'Don\'t touch it. Wren. _Wren._ Don\'t touch it.');
    await s.follow(0.8);
    await s.wait(0.3);
    await s.say(null, 'Far away, the harbor bells begin to ring.', { style: 'system', portrait: false });
    await s.say('Wren', 'The ship! The Hierophant\'s ship is coming in!');
    await s.say('Ilse', 'And we\'re in a cave. Covered in eel. Wonderful.');
    s.objective('Hurry back to Lanternfall\'s docks!');
    s.journal('There was a purple crystal deep in the tide caves. Cold, like it was breathing. Ilse made me promise not to touch it.');
  },

  // ------------------------------------------------------------------ Cassian arrives
  async cassianArrives(s) {
    if (s.flag('p_cassian_arrived') || !s.flag('p_brooch_got')) return;
    s.setFlag('p_cassian_arrived');
    s.music('cassian');
    s.place('player', 23, 22, 'down');
    s.spawn('ysolde_d', 'ysolde', 25, 23, 'down');
    s.spawn('crowd1', 'villager_3', 20, 23, 'down');
    s.spawn('crowd2', 'villager_7', 21, 22, 'down');
    s.spawn('crowd3', 'villager_12', 26, 22, 'down');
    s.spawn('crowd4', 'villager_9', 19, 22, 'down');
    s.spawn('cassian', 'cassian', 23, 31, 'up');
    s.spawn('acolyte1', 'acolyte', 22, 32, 'up');
    s.spawn('acolyte2', 'acolyte', 24, 32, 'up');
    await s.pan(23, 27, 1.2);
    await s.say(null, 'A white ship with sails like folded wings. The Choir\'s sunburst on every one.', { style: 'narration' });
    await Promise.all([s.move('cassian', [[23, 25]], 1.6), s.move('acolyte1', [[22, 26]], 1.6), s.move('acolyte2', [[24, 26]], 1.6)]);
    await s.follow(0.8);
    await s.say('Cassian', 'Keeper Ysolde. You haven\'t aged a day.');
    s.face('ysolde_d', 'down');
    await s.say('Ysolde', 'Hierophant. You have.');
    await s.wait(0.5);
    await s.say('Cassian', '...Ha. Honest as ever.');
    s.face('cassian', 'player');
    await s.say('Cassian', 'And you must be Wren. The girl who writes me about the stars.');
    await s.hop('player');
    await s.say('Wren', 'I— yes. Hello. Sir. Your Holiness? Your... Holy... sir.');
    await s.say('Cassian', 'Cassian will do.');
    await s.say('Cassian', 'In your last letter you asked why the sun sets in the west and never in the east. I\'ve brought you a book that doesn\'t answer that question at all — but asks it beautifully.');
    await s.say(null, 'Received *The Sunward Atlas*.', { style: 'system', portrait: false });
    s.sfx('item');
    await s.say('Ilse', '_(whispering)_ You\'re glowing.');
    await s.say('Wren', '_(whispering)_ I am *not*.');
    s.face('cassian', 'ysolde_d');
    await s.say('Cassian', 'May we speak tonight, Ysolde? At the Lantern.');
    await s.wait(0.4);
    await s.say('Ysolde', '...After supper.');
    // Bram, late.
    s.spawn('bram_late', 'bram', 23, 15, 'down');
    await s.move('bram_late', [[23, 21]], 6);
    await s.say('Bram', 'Make way! Squire Bram Kestrel of the Dawnguard, reporting for honor-guard du— oh.');
    await s.say('Bram', 'He\'s... already here. Of course he is.');
    s.face('cassian', 'up');
    await s.say('Cassian', 'Squire Kestrel. Sir Aldous spoke of you.');
    await s.wait(0.6);
    await s.say('Bram', '...Did he.');
    await s.say('Cassian', 'He spoke well of you. Often.');
    await s.wait(0.6);
    await s.say('Bram', '...He would.');
    await Promise.all([s.move('cassian', [[23, 21], [23, 16], [30, 16]], 2.2), s.move('ysolde_d', [[25, 21], [24, 16], [30, 15]], 2.2), s.move('acolyte1', [[22, 21], [22, 17]], 2.2), s.move('acolyte2', [[24, 21], [24, 17]], 2.2)]);
    ['cassian', 'ysolde_d', 'acolyte1', 'acolyte2', 'crowd1', 'crowd2', 'crowd3', 'crowd4'].forEach((id) => s.remove(id));
    s.face('bram_late', 'down');
    await s.say('Bram', 'Wren! Ilse! You saw that? He knew my name. The *Hierophant* knew my name.');
    await s.say('Ilse', 'You smell like the inn, Bram.');
    await s.say('Bram', 'Cider is a breakfast drink on islands. Everyone knows that.');
    await s.move('bram_late', [[23, 17], [31, 17], [31, 15]], 4);
    s.remove('bram_late');
    s.music('lanternfall');
    s.objective('Return the brooch to Nana Brisa.');
    s.journal('Hierophant Cassian arrived. He gave me a book! He knew my letters. Mom was... Mom.');
  },

  // ------------------------------------------------------------------ Supper & the storm
  async supper(s) {
    if (!s.flag('p_brooch_done') || s.flag('p_dinner')) return;
    s.setFlag('p_dinner');
    s.setFlag('lfDusk');
    s.music('sad');
    s.show('ysolde', true);
    s.place('ysolde', 5, 4, 'left');
    s.place('player', 3, 4, 'right');
    await s.wait(0.6);
    await s.say('Ysolde', 'He gave you a book.');
    await s.say('Wren', 'An atlas. Of the sun. Did you know there are cities in the east where it never quite gets dark in summer—');
    await s.say('Ysolde', 'Wren. What did he say to you?');
    await s.say('Wren', 'Nothing! He was *nice*. Is that so strange? That somebody important would be nice to me?');
    await s.say('Ysolde', 'Important people are nice when they want something.');
    await s.say('Wren', 'And what could he possibly want from *me*?');
    await s.wait(1.2);
    await s.say('Wren', 'After the Kindling... I want to go to Aurenne. Study at the Cathedral. He\'d sponsor me, I know he would—');
    await s.say('Ysolde', 'No.');
    await s.say('Wren', 'You didn\'t even let me—');
    await s.say('Ysolde', 'Tomorrow you\'ll be given your Crest. And then you\'ll learn the Lantern. As I did. As my mother did.');
    await s.say('Wren', 'Because _you_ never left, nobody can?');
    s.face('ysolde', 'right');
    await s.say('Ysolde', 'Because the last Halloway who sailed east never came back!');
    await s.wait(1.4);
    await s.say('Wren', '...Dad would have let me go.');
    await s.wait(1.0);
    await s.say('Ysolde', 'Your father would have gone _with_ you.', { speed: 0.6 });
    await s.move('player', [[3, 6], [2, 3]], 6);
    await s.fadeOut(1.2);
    s.heal(); // supper and an evening at home: the party meets the storm rested
    s.setFlag('lfNight');
    s.stopMusic(1.5);
    await s.wait(1.0);
    await s.narrate(['That night, a storm came in off the Western Sea.', 'Wren did not sleep.']);
    s.place('player', 2, 3, 'down');
    s.show('ysolde', false);
    await s.fadeIn(1.0);
    s.flash('#e8f0ff', 0.4);
    s.sfx('bolt');
    await s.wait(0.6);
    await s.think('Wren', 'Lightning over the black rocks... wait.');
    s.flash('#e8f0ff', 0.4);
    s.sfx('bolt');
    await s.think('Wren', 'There\'s someone down there. On the rocks. In _this_.');
    s.objective('Someone is on the black rocks (southeast beach). Go!');
    s.journal('Mom and I fought. She said Dad would have gone with me. Then there was someone on the black rocks, in the storm.');
    s.music('tension');
  },

  async blackRocks(s) {
    if (!s.flag('lfNight') || s.flag('p_storm_done')) return;
    s.setFlag('p_storm_done');
    s.spawn('girl', 'sable', 39, 26, 'down', { solid: false });
    s.spawn('pup1', { id: 'pup_field', skin: '#3a3050', hair: { style: 'none' }, outfit: { style: 'robe', main: '#2a2040', accent: '#8a6aff' }, acc: ['horns'] }, 37, 24, 'right');
    s.spawn('pup2', { id: 'pup_field2', skin: '#3a3050', hair: { style: 'none' }, outfit: { style: 'robe', main: '#2a2040', accent: '#8a6aff' }, acc: ['horns'] }, 41, 25, 'left');
    await s.pan(39, 25, 1);
    await s.say('Wren', 'A girl! And those— are those *dogs*?');
    await s.say(null, 'They are shaped like dogs the way smoke is shaped like a fire.', { style: 'narration' });
    await s.follow(0.6);
    // Ilse arrives
    s.spawn('ilse_n', 'ilse', 30, 18, 'down');
    await s.move('ilse_n', [[33, 21], [35, 22]], 6);
    s.remove('ilse_n');
    await s.say('Ilse', 'Wren! You saw it too? From my window, the lightning—');
    await s.say('Wren', 'Ilse, stay back—');
    await s.say('Ilse', 'Absolutely not. Who do you think is going to patch you up?');
    await s.system('Tip — Each foe has a *Poise* shield. Hit its *weaknesses* to chip it away. At zero, it *Breaks*: it loses its turn and takes extra damage.');
    let r = await s.battle('pups2', { bg: 'beach_night', music: 'battle' });
    if (r !== 'win') return;
    s.remove('pup1');
    s.remove('pup2');
    s.shake(0.3, 1.2);
    await s.say('Ilse', 'They\'re gone. Like smoke. Wren, what _were_ those?');
    await s.wait(0.4);
    await s.say(null, 'Something rose out of the surf. Something that had been a dog once, long ago, and had been at the bottom of the sea ever since.', { style: 'narration' });
    await s.say('Wren', '...Ilse. Run.');
    await s.say('Ilse', 'We are _not_ leaving her.');
    // Bram arrives in heroic fashion.
    s.spawn('bram_n', 'bram', 33, 19, 'down');
    await s.move('bram_n', [[36, 23]], 7);
    await s.say('Bram', 'HALT, foul— uh— dog-thing! You face Bram Kestrel of the Dawnguard!');
    await s.say('Ilse', 'Bram?!');
    await s.say('Bram', 'I saw your lanterns from the inn. Also I may have been awake for unrelated reasons. Stand behind me!');
    s.remove('bram_n');
    await s.join('bram', true);
    await s.system('Tip — Fill the *Afterglow* gauge by striking weaknesses and breaking foes. Press *Q* / *E* in the command menu to *Surge*, spending it to strengthen an action.');
    r = await s.battle('boss_drowned_hound', { bg: 'beach_night' });
    if (r !== 'win') return;
    s.music('sad');
    await s.say('Bram', 'Did you see that? I was magnificent.');
    await s.say('Ilse', 'You fell over twice.');
    await s.say('Bram', 'Tactically.');
    await s.move('player', [[38, 25]]);
    await s.say('Ilse', 'She\'s breathing. Cold as the sea, but breathing.');
    await s.wait(0.6);
    await s.say('???', '...don\'t... let him find me...', { speed: 0.5, portrait: false });
    await s.wait(0.8);
    await s.say('Wren', 'Who? Let _who_ find you?');
    await s.wait(1.0);
    await s.say('Ilse', 'She\'s fainted. Nana\'s is closest. Bram — carry her.');
    await s.say('Bram', 'Carrying. Yes. Very knightly. I am good at carrying.');
    s.remove('girl');
    await s.fadeOut(1.5);
    s.setFlag('ch1_morning');
    s.setFlag('lfNight', false);
    s.setFlag('lfDusk', false);
    await s.chapter(1, 'The Kindling');
    s.journal('We fought shadow-dogs on the black rocks, and something that came out of the sea. Bram helped (he says he saved us). The girl from the storm said: "Don\'t let him find me."');
    s.objective('Check on the girl at Nana Brisa\'s house.');
    await s.teleport('lf_nana_house', 4, 6, 'up');
  },
};
