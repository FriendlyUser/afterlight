// CHAPTER 1 — "The Kindling"
// Sable is named; the Kindling ceremony; the overheard argument; leaving home.

/** @type {import('../types/data').StoryScripts} */
export const CH1 = {
  /** Kindling morning: out of the front door, a look at the island dressed for the ceremony. */
  async morning(s) {
    if (!s.flag('ch1_morning') || s.flag('ch1_named') || s.flag('ch1_sunrise')) return;
    s.setFlag('ch1_sunrise');
    s.music('lanternfall');
    await s.wait(0.4);
    await s.pan(9, 6, 2.4);
    await s.narrate([
      'Morning. The storm has scrubbed the sky clean.',
      'Lanternfall has been up since before dawn: bunting on every line, the Choir\'s white boats rocking in the harbour, the Lantern swept and shining.',
      'At noon, every sixteen-year-old on the island will step into its light. Today, Wren Halloway is sixteen.',
    ]);
    await s.follow(1.4);
    await s.say('Wren', 'Happy birthday to me.');
    await s.say('Wren', 'The girl from the rocks — Nana has her. I should see if she\'s awake.');
  },

  async namingSable(s) {
    if (!s.flag('ch1_morning') || s.flag('ch1_named')) return;
    s.setFlag('ch1_named');
    s.music('lanternfall');
    s.spawn('girl', 'sable', 8, 3, 'left');
    s.place('nana', 4, 3, 'right');
    s.spawn('bram_h', 'bram', 6, 5, 'up');
    await s.wait(0.5);
    await s.say('Nana Brisa', 'She woke an hour ago. Ate three bowls of porridge and asked what porridge was.');
    await s.move('player', [[6, 4], [7, 4]]);
    s.face('player', 'right');
    s.face('girl', 'left');
    await s.say('???', 'You are the one from the rocks.');
    await s.say('Wren', 'I\'m Wren. That\'s Ilse, and the big loud one is Bram.');
    await s.say('Bram', 'Charmed. Truly.');
    await s.say('Wren', 'What\'s your name?');
    await s.wait(1.0);
    await s.say('???', 'I don\'t have one.');
    await s.say('Ilse', 'You don\'t remember it?');
    await s.say('???', 'I don\'t think there was one to remember.');
    await s.wait(0.8);
    await s.say('Wren', 'Then... Sable. Your hair — it\'s like a sable\'s coat. There\'s a picture in my atlas.');
    await s.wait(0.6);
    await s.say('Sable', '"Sable."', { speed: 0.5 });
    await s.say('Sable', '...Yes. I will be that.');
    await s.say('Sable', 'The porridge was warm. I did not know food could be warm.');
    await s.say('Nana Brisa', 'Oh, you poor duck.');
    await s.say('Ilse', 'Wren. Look at her hand.');
    await s.say(null, 'On the back of Sable\'s left hand, a mark like a closed eye. Black as the inside of a shell.', { style: 'narration' });
    await s.say('Ilse', 'That\'s a Crest. But she can\'t be older than us, and she\'s never been Kindled— has she?');
    await s.say('Sable', 'It has always been there. It is cold, sometimes.');
    await s.say('Bram', 'The Hierophant\'s here. If anyone can tell us what that is, he can.');
    await s.say('Wren', 'And the Kindling is at noon. He\'ll be there. Sable — will you come?');
    await s.say('Sable', 'If you are going, I am going.');
    s.remove('girl');
    s.remove('bram_h');
    await s.join('sable');
    s.heal(); // the morning after the storm: everyone slept, and Nana fed them
    s.objective('The Kindling begins at noon. Go to the Lantern on the northwest bluff.');
    s.journal('The girl from the sea has no name, so I gave her one: Sable. She has a Crest already — black, like a closed eye.');
  },

  // ------------------------------------------------------------------ The ceremony
  async kindling(s) {
    if (s.flag('kindled')) return;
    s.setFlag('kindled');
    s.music('kindling');
    // Stage the hall.
    s.spawn('cassian', 'cassian', 7, 4, 'down');
    s.spawn('ysolde_l', 'ysolde', 9, 3, 'down');
    s.spawn('acolyte1', 'acolyte', 4, 3, 'down');
    s.spawn('acolyte2', 'acolyte', 10, 4, 'down');
    s.spawn('kid', 'villager_14', 5, 9, 'up');
    s.spawn('ilse_c', 'ilse', 9, 8, 'up');
    s.spawn('sable_c', 'sable', 6, 9, 'up');
    s.spawn('bram_c', 'bram', 10, 9, 'up');
    for (let i = 0; i < 6; i++) s.spawn(`folk${i}`, `villager_${20 + i}`, 2 + (i % 3) * 2 + (i > 2 ? 7 : 0), 10 + (i % 2), 'up');
    s.place('player', 5, 8, 'up');
    await s.pan(7, 5, 0.1);
    await s.wait(0.8);
    await s.say('Cassian', 'In the beginning there was the Gloam, and the Gloam was all things, and nothing.');
    await s.say('Cassian', 'Then came the sun, and the sun was kind, and it gave us edges. A here and a there. A today, and a tomorrow.');
    await s.say('Cassian', 'Every evening it leaves us. Every dawn the Lanterns call it home.');
    await s.say('Cassian', 'And every child of Solmere, at sixteen, steps into that light — and the light tells them who they are.');
    await s.say('Cassian', 'Mira Doyle. Come.');
    await s.move('kid', [[5, 7], [7, 7], [7, 6]], 1.8);
    s.flash('#fff4d0', 0.6);
    s.sfx('holy');
    await s.wait(0.5);
    await s.say('Cassian', 'Ranger. The light gives you clear eyes and a far horizon, Mira.');
    await s.move('kid', [[7, 7], [4, 7], [3, 9]], 2);
    await s.say('Cassian', 'Wren Halloway.');
    await s.follow(0.1);
    await s.move('player', [[5, 7], [7, 7], [7, 6]], 1.8);
    await s.wait(0.5);
    await s.say(null, 'The Lantern\'s light is warm. Warmer than sunlight. It goes all the way through you, like you are made of glass.', { style: 'narration' });
    s.flash('#ffe8b0', 0.8);
    s.sfx('revive');
    await s.wait(0.8);
    await s.say('Cassian', 'Vanguard.');
    await s.say('Cassian', 'The first into the dark, so that others may follow. It suits you.');
    s.awaken('wren');
    await s.system('Wren\'s Crest awakens — *Vanguard*! Crest Arts are now usable in battle.');
    s.face('player', 'right');
    await s.say('Ysolde', '...It suits her.', { speed: 0.7 });
    await s.move('player', [[7, 7], [5, 8]], 2);
    s.face('player', 'up');
    await s.say('Cassian', 'Ilse Marrow.');
    await s.move('ilse_c', [[9, 7], [7, 7], [7, 6]], 1.8);
    s.flash('#d8ffe0', 0.6);
    s.sfx('heal');
    await s.wait(0.5);
    await s.say('Cassian', 'Mender. Hands that close wounds.');
    await s.say('Ilse', '_(quietly)_ I knew it would be.');
    s.awaken('ilse');
    await s.system('Ilse\'s Crest awakens — *Mender*!');
    await s.move('ilse_c', [[7, 7], [9, 8]], 2);
    s.face('ilse_c', 'up');
    await s.wait(0.5);
    await s.say('Cassian', 'And... our guest. The girl from the sea. Come, child. Let the light see you.');
    await s.move('sable_c', [[6, 7], [7, 7], [7, 6]], 1.6);
    await s.wait(0.6);
    s.stopMusic(0.3);
    s.flash('#2a1040', 0.9);
    s.shake(0.25, 1.0);
    s.sfx('dark');
    await s.wait(0.6);
    await s.say(null, 'The Lantern _gutters_. For one heartbeat the hall goes dark as the bottom of the sea.', { style: 'narration' });
    await s.emote('player', '!');
    await s.say(null, 'When the light returns, the black mark on Sable\'s hand is open. An eye. Looking back.', { style: 'narration' });
    await s.wait(0.6);
    s.music('cassian');
    await s.say('Cassian', '...', { speed: 0.3 });
    await s.say(null, 'The Hierophant has gone white as his robes. He is looking at Sable\'s face, not her hand.', { style: 'narration' });
    await s.say('Cassian', '_(barely a whisper)_ ...Lysa?', { speed: 0.6 });
    await s.wait(0.8);
    await s.say('Cassian', 'Forgive me. A Crest unknown to the Choir. How... remarkable.');
    await s.say('Cassian', 'The light names you, child, though it names you strangely. _Gloamweaver._');
    await s.say('Ysolde', 'The ceremony is over. Everyone — home. Now.');
    ['kid', 'acolyte1', 'acolyte2', 'folk0', 'folk1', 'folk2', 'folk3', 'folk4', 'folk5'].forEach((id) => s.remove(id));
    await s.move('sable_c', [[6, 7], [6, 9]], 2);
    s.remove('sable_c'); s.remove('ilse_c'); s.remove('bram_c'); s.remove('cassian'); s.remove('ysolde_l');
    await s.wait(0.3);
    await s.say('Bram', 'Did he just call her "Lysa"?');
    await s.say('Ilse', 'Who\'s Lysa?');
    await s.say('Sable', 'I don\'t know. But I think I have heard it before. In the water.');
    s.objective('Home at last. It has been a very long day — rest in your bed.');
    s.journal('The Kindling. I am a Vanguard. Ilse is a Mender, like she always knew. When Sable stepped into the light, the Lantern went dark — and the Hierophant called her "Lysa."');
    s.setFlag('lfDusk');
    s.setFlag('ch1_evening');
    await s.fadeOut(1);
    await s.teleport('lf_wren_house', 4, 7, 'up', { faded: true });
  },

  /** Home: after the Kindling (dusk), the night of the voices, and the next dawn. */
  async home(s) {
    if (s.flag('ch1_ready') && !s.flag('ch1_dawn')) {
      s.setFlag('ch1_dawn');
      s.heal();
      await s.narrate(['You don\'t sleep. You lie listening to the sea until the window goes grey, and then gold.', 'Down at the docks, Tobias is already loading his boat.']);
      await s.say('Wren', 'Aurenne. I\'m really going.');
      return;
    }
    if (s.flag('ch1_rested') && !s.flag('ch1_voices')) {
      s.setFlag('ch1_voices');
      await s.narrate('Late in the night, voices. Down the hill, carried up from the Lantern: your mother\'s, sharp as a gull\'s — and the Hierophant\'s.');
      await s.say('Wren', 'Mom? At this hour?');
      s.objective('Voices from the Lantern — Mom and the Hierophant. Go and listen.');
      return;
    }
    if (s.flag('ch1_evening') && !s.flag('ch1_rested') && !s.flag('ch1_home')) {
      s.setFlag('ch1_home');
      await s.say('Wren', ['Home. Mom\'s still up at the Lantern with the Hierophant.', 'I feel like I\'ve been awake for a week.']);
    }
  },

  /** Wren's bed: rest any time to restore HP and MP; the night after the Kindling, it moves the story on. */
  async bed(s) {
    if (s.flag('ch1_evening') && !s.flag('ch1_rested')) return CH1.restEvening(s);
    if (s.flag('lfNight')) return s.narrate('Not with the storm howling like that — and something is out there on the black rocks.');
    if (!await s.confirm('Rest in your bed? (Restores HP and MP.)', 'Rest', 'Not now')) return null;
    await s.fadeOut(0.6);
    s.heal();
    s.sfx('save');
    await s.wait(0.5);
    await s.fadeIn(0.6);
    return s.system('You rest a while. HP and MP restored.');
  },

  /** The night after the Kindling: Wren tries to sleep, and wakes in the dark to voices. */
  async restEvening(s) {
    await s.narrate(['You lie down in your clothes. The bed smells of salt and old books.', 'Sleep won\'t come. Every time you close your eyes, the Lantern goes dark again — and the eye opens on Sable\'s hand.']);
    await s.fadeOut(1.2);
    s.heal();
    s.setFlag('ch1_rested');
    s.setFlag('ch1_night');
    await s.wait(0.8);
    await s.teleport('lf_wren_house', 2, 3, 'down', { faded: true, sfx: false }); // the same room, at night
  },

  /** Evening: overhear Cassian and Ysolde at the Lantern. */
  async overhear(s) {
    if (!s.flag('ch1_evening') || s.flag('ch1_overheard')) return;
    s.setFlag('ch1_overheard');
    s.music('tension');
    s.spawn('cassian', 'cassian', 7, 3, 'right');
    s.spawn('ysolde_l', 'ysolde', 9, 3, 'left');
    s.place('player', 7, 11, 'up');
    await s.move('player', [[7, 10]], 1.2);
    await s.say('Cassian', '—only for a season, Ysolde. The Cathedral can attune the Dawnstone. Strengthen it.');
    await s.say('Ysolde', 'No. Lanternfall\'s light stays in Lanternfall.');
    await s.say('Cassian', 'You felt it tonight. The Gloam is rising at every Lantern. Mirefen. Saltglass. Here.');
    await s.say('Ysolde', 'And I know what my mother told me about the night Aurenne went dark. About the Keeper\'s choice. About your sister.');
    await s.wait(1.2);
    await s.say('Cassian', '...Then you know why I would never let it happen again.');
    await s.say('Ysolde', 'That is _exactly_ what frightens me.');
    await s.wait(0.8);
    await s.move('ysolde_l', [[9, 6], [8, 9], [8, 12]], 3);
    s.remove('ysolde_l');
    await s.wait(0.6);
    s.face('cassian', 'down');
    await s.say('Cassian', 'Ah. Wren.');
    await s.move('cassian', [[7, 6], [7, 8]], 1.4);
    await s.say('Cassian', 'I\'m afraid you\'ve heard two grown-ups being tiresome. Your mother is a remarkable Keeper. And remarkably stubborn.');
    await s.say('Wren', 'You could say that.');
    await s.say('Cassian', 'Your friend. Sable. She needs answers I can\'t give her on an island. The Choir\'s archives in Aurenne might hold them.');
    await s.say('Cassian', 'I must stay on at the Lantern a few days. But someone could take her ahead. Someone with a new Crest and a restless heart.');
    await s.hop('player');
    await s.say('Wren', 'Me? You mean— to Aurenne? Yes. _Yes._');
    await s.say('Cassian', 'Take your friends. Go by Port Gale and the Whisperwold road. Deliver this to the Cathedral; they will take care of you.');
    await s.give('cassian_letter');
    await s.say('Cassian', 'Your mother will object.');
    await s.say('Wren', 'She objects to everything.');
    await s.say('Cassian', '_(smiling)_ So did mine. Goodnight, Wren Halloway.');
    s.remove('cassian');
    s.objective('Leave for the mainland. Tobias will sail you from the docks.');
    s.journal('Mom refused to give the Hierophant the Dawnstone. He asked me — ME — to take Sable to Aurenne.');
    s.setFlag('ch1_ready');
    await s.fadeOut(1);
    s.setFlag('lfDusk', false);
    s.setFlag('ch1_night', false);
    await s.teleport('lf_wren_house', 2, 3, 'down', { faded: true }); // home to bed; dawn
  },

  /** Dawn at the docks: Ysolde's goodbye. */
  async departure(s) {
    if (!s.flag('ch1_ready') || s.flag('ch1_departed')) return;
    s.setFlag('ch1_departed');
    s.music('sad');
    s.spawn('ysolde_d', 'ysolde', 23, 29, 'up');
    s.spawn('tobias_d', 'tobias', 21, 31, 'right');
    await s.move('player', [[23, 27]]);
    await s.say('Ysolde', 'You\'re not going.');
    await s.say('Wren', 'I\'m sixteen. I have a Crest. The Hierophant asked me himself. You can\'t stop me.');
    await s.wait(1.5);
    await s.say('Ysolde', '...No. I suppose I can\'t.');
    await s.wait(0.8);
    await s.say('Ysolde', 'Then take this.');
    await s.give('edrins_compass');
    await s.say('Wren', 'Dad\'s compass.');
    await s.say('Ysolde', 'It points west. Always west. Wherever you are, it will show you the way home.');
    await s.say('Wren', 'Mom—');
    await s.say('Ysolde', 'Go. Before I change my mind.');
    await s.wait(0.6);
    await s.say('Ysolde', 'Come back to me, little bird.', { speed: 0.6 });
    await s.fadeOut(1.5);
    s.remove('ysolde_d');
    s.remove('tobias_d');
    s.journal('Mom gave me Dad\'s compass. It points west, always. She said: come back to me, little bird.');
    await s.teleport('sea_crossing', 10, 7, 'right');
  },

  /** The crossing — Brinefang. */
  async crossing(s) {
    if (s.flag('ch1_crossed')) return;
    s.music('sea');
    await s.wait(1.0);
    await s.say('Fisher Tobias', 'Strait\'s calm as a millpond. Too calm, if you ask me.');
    await s.say('Bram', 'I\'ve been on a ship before. Several. I am not seasick. This is my normal color.');
    await s.say('Sable', 'The sea is very big.');
    await s.say('Ilse', 'You came out of it.');
    await s.say('Sable', 'I don\'t remember it being big. I remember it being... full. Like a crowd.');
    await s.wait(0.6);
    s.shake(0.3, 1.0);
    await s.say('Fisher Tobias', 'Hold on to something! There\'s something under the hull!');
    await s.say(null, 'The water rises in a green wall — and the wall has eyes.', { style: 'narration' });
    const r = await s.battle('boss_brinefang', { bg: 'deck' });
    if (r !== 'win') return;
    s.setFlag('ch1_crossed');
    s.music('sea');
    await s.say('Fisher Tobias', 'Thirty years! Thirty years and I\'ve never— you kids. You _kids!_');
    await s.say('Bram', 'All in a day\'s work for the Dawnguard.');
    await s.say('Ilse', 'You threw up on it.');
    await s.say('Bram', 'Strategically.');
    await s.wait(0.6);
    await s.say('Fisher Tobias', 'There — Port Gale. The mainland. Your mother\'s whole world ends at that coast, Wren. Yours starts there.');
    await s.fadeOut(1.5);
    await s.chapter(2, 'The Wider World');
    s.objective('Explore Port Gale, then take the Whisperwold road toward Aurenne.');
    s.journal('A sea serpent attacked the boat. We won. Bram was sick on it. Then — the mainland.');
    await s.teleport('port_gale', 10, 20, 'up');
  },
};
