// CHAPTER 8 — "Children of the Wreck"
// Kiteholm: Pip runs twenty orphans; Bram drinks. The Penitent comes for the children.

import { rejoin, dress } from './ch7.js';

const IN = (s, id) => s.state.party.includes(id);

export const CH8 = {
  // =========================================================================
  // Arrival
  // =========================================================================
  async opening(s) {
    if (s.flag('c8_arrived')) return;
    s.setFlag('c8_arrived');
    dress(s, 'pip', 'pip_ruin');
    dress(s, 'bram', 'bram_ruin');
    s.music('town');
    s.spawn('ilse_s', 'ilse_ruin', 3, 20, 'right');
    await s.wait(0.6);
    await s.narrate([
      'Kiteholm. A spur of rock torn off the old world, hanging in the wind like a fist that refuses to open.',
      'Shacks of scrap and sailcloth cling to it. And everywhere — on poles, on roofs, on strings tied to children — kites.',
    ]);
    await s.say('Ilse', 'It\'s all... string.');
    await s.say('Wren', 'Fenna said it\'s held _together_ by kites. Held _up_ by stubbornness.');
    await s.say('Ilse', 'That\'s not how engineering works.');
    await s.say('Wren', 'That\'s not how anything works anymore.');
    s.sfx('slash');
    await s.emote('player', '!');
    await s.narrate('A pebble cracks off the planks between Wren\'s boots.');
    s.spawn('tansy_s', 'tansy', 10, 20, 'left');
    await s.move('tansy_s', [[8, 20]], 3);
    await s.say('Tansy', 'Toll\'s two silver or one secret. Slingshot says pay up.');
    await s.say('Wren', 'We\'re looking for someone. A boy called Pip.');
    await s.say('Tansy', 'Don\'t know him. Two silver.');
    await s.say('Ilse', 'Twelve years old. Talks like a pirate. Steals anything that isn\'t nailed down and most things that are.');
    await s.wait(0.6);
    await s.say('Tansy', '...Three silver. And you didn\'t hear it from me.');
    await s.say('???', 'She didn\'t hear it from anybody, Tansy. Go keep watch.', { portrait: false });
    s.spawn('pip_s', 'pip_ruin', 12, 18, 'left');
    await s.move('pip_s', [[11, 19], [9, 19]], 3);
    await s.move('tansy_s', [[10, 21], [13, 22]], 4);
    s.remove('tansy_s');
    s.face('pip_s', 'left');
    s.music('sad');
    await s.wait(0.8);
    await s.narrate('He is taller. Thinner. A scarf, a scavenged coat — and a patch over his left eye. He looks at Wren for a long time with the one that\'s left.');
    await s.say('Pip', 'Well. Look what the wind dragged in.');
    await s.say('Wren', 'Pip. Your eye—');
    await s.say('Pip', 'Lost it in a card game. You should see the other guy\'s eye.');
    await s.say('Pip', '...He\'s got both. I lost. That\'s how card games work.');
    await s.say('Ilse', 'Pip. Let me look at it.');
    await s.say('Pip', 'It\'s healed, Ilse. Healed ugly, but healed. Like everything.');
    await s.wait(0.6);
    await s.say('Pip', 'Thought you were dead, Halloway. Hoped so, some days.');
    await s.wait(1.2);
    await s.say('Wren', '...I know.');
    await s.say('Pip', 'Rules of Kiteholm. One: Kites look after Kites. Two: you ain\'t Kites. Three: the Baron owns the air, so pay your mooring fee and don\'t make trouble.');
    await s.say('Wren', 'We came to find you. You and Bram.');
    await s.say('Pip', 'Bram.');
    await s.narrate('Pip laughs. It is not a kid\'s laugh at all.');
    await s.say('Pip', 'Bram\'s at the Rusty Anchor, or the Baron\'s door, or face-down somewhere between \'em. Go find him. He won\'t want to be found. He\'s real good at that.');
    await s.move('pip_s', [[11, 19], [13, 18]], 3.5);
    s.remove('pip_s');
    await s.wait(0.6);
    await s.say('Ilse', 'He\'s twelve.');
    await s.say('Wren', 'He\'s twelve going on forty.');
    await s.say('Ilse', 'That\'s what I said.');
    s.remove('ilse_s');
    s.music('town');
    s.objective('Find Bram at the Rusty Anchor (the tavern on Kiteholm\'s west side).');
    s.journal('Kiteholm. Pip is twelve now, with one eye and twenty orphans who call him Boss. He said he hoped I was dead, some days. I can\'t blame him.');
  },

  // =========================================================================
  // Bram, at the bottom of a cup
  // =========================================================================
  async anchorMeet(s) {
    if (!s.flag('c8_arrived') || s.flag('c8_met_bram')) return;
    s.setFlag('c8_met_bram');
    s.place('player', 6, 8, 'up');
    s.spawn('ilse_s', 'ilse_ruin', 5, 8, 'up');
    s.spawn('bram_s', 'bram_ruin', 10, 7, 'right');
    s.spawn('dorran', 'villager_47', 12, 7, 'left');
    await s.wait(0.5);
    await s.say('Bram', 'Hah! Full Lantern! Read \'em and—');
    await s.wait(0.6);
    await s.say('Bram', '...oh. That\'s not a full Lantern. That\'s three bells and a fish.');
    await s.say('Dorran', 'That\'s nine silver, is what that is.');
    await s.move('player', [[6, 7], [8, 7]], 2.4);
    s.face('player', 'right');
    await s.say('Wren', 'Bram.');
    s.face('bram_s', 'left');
    await s.wait(1.0);
    await s.narrate('Bram looks up. His face does something complicated. Then he picks up his cup and drains it.');
    await s.say('Bram', 'No. Nope. I\'m drunk. I\'m seeing ghosts. It\'s the cider. This is mostly cider.');
    await s.move('ilse_s', [[6, 7], [7, 7]], 2.4);
    await s.say('Ilse', 'It is mostly not cider, Bram. I can smell it from here.');
    await s.wait(0.6);
    await s.say('Bram', '..._Ilse?_');
    await s.hop('bram_s');
    await s.narrate('He stands too fast. The chair goes over. For one second he looks like he\'s going to throw his arms around both of them —');
    await s.narrate('— and then he doesn\'t.');
    await s.say('Bram', 'You\'re... alive. Both of you. That\'s— that\'s—');
    await s.wait(0.8);
    await s.say('Bram', 'Good. That\'s good. I\'m glad.');
    await s.say('Bram', 'I\'m working. Guard duty. The Baron. I have to— I\'m _very_ important to the Baron.');
    await s.move('bram_s', [[9, 8], [7, 8], [6, 9]], 4);
    s.remove('bram_s');
    await s.wait(0.6);
    await s.say('Dorran', 'He talks about you. When he\'s far enough gone. "My girls from the island."');
    await s.say('Dorran', 'Then he cries and tries to fight the coat rack. Loses, mostly.');
    await s.say('Ilse', 'He ran.');
    await s.say('Wren', 'He ran _from us_. That\'s different.');
    await s.say('Ilse', 'Is it?');
    await s.say('Wren', '...I hope so.');
    s.remove('ilse_s');
    s.remove('dorran');
    s.objective('Go to the Kite Nest (the red-roofed house by the market) and talk to Pip.');
    s.journal('Bram is here. He saw us and ran — said he was "very important to the Baron." Dorran says he cries at the coat rack. I think he\'s been running for a year.');
  },

  // =========================================================================
  // The Kite Nest
  // =========================================================================
  async nestScene(s) {
    if (!s.flag('c8_met_bram') || s.flag('c8_underhang_open')) return;
    s.setFlag('c8_underhang_open');
    s.music('tension');
    s.place('player', 7, 8, 'up');
    s.place('tansy', 8, 6, 'down');
    await s.wait(0.4);
    await s.say('Tansy', 'He\'s not here.');
    await s.say('Wren', 'Pip? Where is he?');
    await s.say('Tansy', 'Wick and Moth went scavenging two days ago. Down the Underhang, to the old Choir wreck. Good scrap down there. They didn\'t come back.');
    await s.say('Tansy', 'Boss went after them. Alone. He told us to stay. He said grown-ups don\'t help, grown-ups just get you counted.');
    await s.wait(0.8);
    await s.say('Tansy', 'You\'re grown. Sort of.');
    await s.say('Wren', 'I\'m seventeen.');
    await s.say('Tansy', 'Exactly. Will you go after him?');
    await s.say('Ilse', 'Three things. One, we\'re going. Two, nobody else from this room is coming. Three—');
    await s.say('Tansy', 'Three, Boss\'ll be furious. I know. I\'ll tell the Kites to move the crates off the ladder.');
    s.objective('Follow Pip down the Underhang — the ladder at Kiteholm\'s south edge.');
    s.journal('Two of Pip\'s Kites went missing in a crashed Choir ship under the shard. Pip went after them alone. We\'re going down after him.');
    s.music('town');
  },

  async pip(s) {
    if (s.flag('c8_warned') && !s.flag('c8_raid')) return CH8.restBeforeRaid(s);
    if (s.flag('c8_back') && !s.flag('c8_warned')) return s.say('Pip', 'The Baron. Now. He\'s got guards and walls. Kiteholm\'s got kites.');
    return s.say('Pip', 'Kites look after Kites.');
  },

  async tansy(s) {
    if (s.flag('c8_hide_done')) return s.say('Tansy', ['When I grow up I\'m going to be the Boss of the Boss.', 'Don\'t tell him.']);
    if (s.flag('c8_hide_on')) {
      const n = ['burr', 'fig', 'nettle', 'pim', 'sprocket'].filter((k) => s.flag(`c8_found_${k}`)).length;
      if (n < 5) return s.say('Tansy', `${n} found. ${5 - n} to go. They\'re _good_ at hiding. Boss taught us. "Somewhere nobody looks, which is everywhere, if you\'re small."`);
      s.setFlag('c8_hide_done');
      await s.say('Tansy', 'ALL FIVE? Even Sprocket? Nobody ever finds Sprocket. _I_ don\'t find Sprocket.');
      await s.say('Tansy', 'Okay. Okay. You can have it. It\'s the tail off the first kite Boss ever built. It\'s lucky. It makes you fast. That\'s science.');
      await s.give('c8_kite_tail');
      s.quest('c8_q_hide', null, null, 'done');
      return;
    }
    if (s.flag('c8_met_bram')) {
      s.setFlag('c8_hide_on');
      await s.say('Tansy', 'Five of the lookouts are supposed to be on watch. They\'re not on watch. They\'re _hiding_. It\'s a game, but it\'s also a crime.');
      await s.say('Tansy', 'Burr, Fig, Nettle, Pim, and Sprocket. Find \'em all and I\'ll give you something good. Promise on my slingshot.');
      s.quest('c8_q_hide', 'Hide and Seek', 'Find the five Kites hiding around Kiteholm: Burr, Fig, Nettle, Pim and Sprocket. Report to Tansy.');
      return;
    }
    return s.say('Tansy', 'Toll\'s paid. You\'re fine. Don\'t touch the kites; they bite.');
  },

  async hider(s, key, name, lines) {
    if (s.flag(`c8_found_${key}`)) return s.say(name, 'Shh! I\'m still hiding. It counts if I keep hiding.');
    if (!s.flag('c8_hide_on')) return s.say(name, 'I\'m on watch. Very hard. Go away.');
    s.setFlag(`c8_found_${key}`);
    await s.say(name, lines);
    s.sfx('confirm');
    const n = ['burr', 'fig', 'nettle', 'pim', 'sprocket'].filter((k) => s.flag(`c8_found_${k}`)).length;
    s.toast(`Kites found: <span class="hl">${n} / 5</span>`);
  },

  // =========================================================================
  // The Underhang
  // =========================================================================
  async underhangEntry(s) {
    s.spawn('ilse_s', 'ilse_ruin', 21, 2, 'down');
    await s.narrate('Rope ladders. Ledges no wider than a table. Below them: nothing at all, for as far as the haze lets you see.');
    await s.say('Ilse', 'For the record, I hate this.');
    await s.say('Wren', 'Noted.');
    await s.say('Ilse', 'I want it _written down_.');
    s.remove('ilse_s');
  },

  async findPip(s) {
    if (s.flag('c8_pip_found')) return;
    s.setFlag('c8_pip_found');
    s.music('battle');
    s.spawn('pip_s', 'pip_ruin', 35, 16, 'left');
    s.spawn('ilse_s', 'ilse_ruin', 30, 17, 'right');
    s.place('player', 31, 16, 'right');
    await s.pan(34, 15, 0.8);
    await s.narrate('On the roc perch, a boy with a knife in each hand has his back to the cliff — and three gale-shrikes have him pinned.');
    await s.say('Pip', 'Come on then! Come _on!_ I\'ve got more knives than you\'ve got eyes!');
    await s.say('Wren', 'PIP!');
    await s.follow(0.4);
    const r = await s.battle('c8_shrike_rescue', { bg: 'ruin' });
    if (r !== 'win') return;
    s.music('sad');
    await s.move('player', [[33, 16]], 3);
    await s.say('Pip', 'I had them.');
    await s.say('Wren', 'You had them _surrounding you_.');
    await s.say('Pip', 'That\'s a strategy. Bram taught me. "Let them come to you."');
    await s.say('Ilse', 'Bram\'s strategies mostly involve falling over.');
    await s.say('Pip', '..._Tactically._');
    await s.wait(0.8);
    await s.say('Pip', 'Wick and Moth went into the wreck. The _Vigil_. I saw Vesper colors on the hull. Somebody\'s using it.');
    await s.say('Wren', 'Then we go in together.');
    await s.wait(1.0);
    await s.say('Pip', '...Fine. Kites look after Kites. You\'re temporary Kites. _Very_ temporary.');
    await s.say('Pip', 'And nobody calls me "kid". I\'m the Boss.');
    s.remove('pip_s');
    await rejoin(s, 'pip', 44, 'pip_ruin');
    s.remove('ilse_s');
    s.music('field');
    s.objective('Descend to the wreck of the Vigil and find Wick and Moth.');
    s.journal('Found Pip on a cliff ledge, fighting three shrikes and losing. He let us help. We\'re "temporary Kites." Very temporary.');
  },

  async scoutNiche(s) {
    await s.narrate(['A dead campfire. A bedroll. A Vesper scout\'s satchel, and a journal with a broken spine:', '"Day 9. Counted the shanty. Twenty-two children under fourteen. The Penitent will be pleased. He says children remember the best days best."', '"Day 10. A boy with one eye watched me from the kites all afternoon. I think he knows. I think he is waiting for me to come back up."', 'The rest of the pages are blank.']);
    if (IN(s, 'pip') && !s.flag('c8_niche_pip')) {
      s.setFlag('c8_niche_pip');
      await s.say('Pip', 'Huh. He never came back up.');
      await s.say('Wren', 'Pip...?');
      await s.say('Pip', 'Don\'t look at me like that. I didn\'t do nothing. The wind did. The wind takes care of Kiteholm.');
    }
  },

  async wickKite(s) {
    if (s.flag('c8_wick_kite')) return s.narrate('An empty nest of sticks and sailcloth.');
    s.setFlag('c8_wick_kite');
    await s.narrate('Tangled in a shrike\'s nest: a patched blue kite with a painted grin. The string is still tied to a little bone toggle carved like a W.');
    await s.give('c8_wick_kite');
    if (!s.flag('c8_wick_done')) s.quest('c8_q_kite', 'Wick\'s Kite', 'A blue kite with a painted grin, rescued from a shrike nest in the Underhang. It belongs to Wick, one of Pip\'s Kites.');
    if (IN(s, 'pip')) await s.say('Pip', 'That\'s Wick\'s. He\'s been looking for it for a month. Shrikes nick anything shiny. Or blue. Or Wick\'s.');
  },

  // =========================================================================
  // The wreck of the Vigil
  // =========================================================================
  async wreckEntry(s) {
    s.music('tension');
    await s.narrate('Inside the hull, everything leans. And somewhere ahead, very faintly, a music box is playing a lullaby.');
    if (IN(s, 'pip')) {
      await s.say('Pip', 'That\'s not ours. Kites don\'t do lullabies.');
      await s.say('Ilse', 'What do Kites do?');
      await s.say('Pip', 'Bedtime threats. "Go to sleep or the Baron gets your boots."');
    }
  },

  async captainsDesk(s) {
    if (s.flag('c8_brig_key_got')) return s.narrate('The captain\'s desk. Charts of the shards, with Kiteholm circled in violet ink.');
    s.setFlag('c8_brig_key_got');
    await s.narrate(['Orders, under a paperweight shaped like a sun:', '"_By the hand of the Penitent:_ The children of the Underhang shards are to be gathered and kept sleeping until the Hierophant\'s barge arrives. Children remember the best days best. Evernoon has need of them."', '"KITEHOLM is next. Twenty children. The Penitent will collect them personally."']);
    await s.give('c8_orders');
    await s.narrate('A ring of keys hangs from the captain\'s chair. One is stamped BRIG.');
    await s.give('c8_brig_key');
    if (IN(s, 'pip')) {
      await s.say('Pip', '"Twenty children."');
      await s.say('Pip', 'There\'s twenty-two. He can\'t even count my Kites right.');
      await s.say('Ilse', 'Pip.');
      await s.say('Pip', 'I\'m fine. I\'m _fine_. Brig\'s south. Move.');
    }
    s.objective('Open the brig (south of the gun deck) with the Brig Key.');
  },

  async brigDoor(s) {
    if (s.flag('c8_brig_open')) return;
    if (!s.has('c8_brig_key')) return s.narrate('A heavy door, banded in iron. A sign on it reads BRIG, and under that, in a child\'s hand: LET US OUT.');
    s.setFlag('c8_brig_open');
    await s.take('c8_brig_key');
    s.clearBlocker('c8_brig_door');
    await s.narrate('The key turns. The door swings in on a long, low groan.');
  },

  async brig(s) {
    if (s.flag('c8_brig_seen')) return;
    s.setFlag('c8_brig_seen');
    s.spawn('ilse_s', 'ilse_ruin', 19, 22, 'down');
    s.spawn('pip_s', 'pip_ruin', 21, 23, 'down');
    s.place('player', 20, 22, 'down');
    s.spawn('wick_sl', 'wick', 16, 25, 'up');
    s.spawn('moth_sl', 'moth', 20, 26, 'up');
    s.spawn('kid_sl', 'c8_kite_c', 24, 25, 'up');
    await s.narrate('Cages, built for livestock. And in every cage, a sleeping child — breathing slow and even, eyes moving under the lids.');
    await s.say('Pip', 'Wick! Moth! Up, you lazy— _WICK!_');
    await s.wait(0.6);
    await s.say('Ilse', 'They can\'t hear you. Pulse is fine. Breathing\'s fine. It\'s like... they\'re dreaming on purpose.');
    await s.say('Moth', '_(asleep)_ ...the cake has... _so many candles_...', { portrait: false });
    await s.say('Wick', '_(asleep)_ ...Mum, it\'s still sunny... five more minutes...', { portrait: false });
    await s.wait(0.8);
    await s.say('Wren', 'The lullaby. It\'s coming from the front of the ship. They\'re being _kept_ like this.');
    await s.say('Pip', 'Then we break the music box.');
    await s.say('Pip', 'We break it into so many pieces it plays every song at once.');
    s.remove('ilse_s');
    s.remove('pip_s');
    s.objective('Silence the lullaby at the forecastle (the bow of the Vigil).');
  },

  async engine(s) {
    if (s.flag('c8_engine_done')) return;
    s.spawn('ilse_s', 'ilse_ruin', 36, 14, 'right');
    s.spawn('pip_s', 'pip_ruin', 36, 16, 'right');
    s.place('player', 37, 15, 'right');
    s.spawn('cantor', 'c8_cantor', 40, 13, 'left');
    await s.pan(39, 12, 1);
    await s.narrate('In the bow sits a machine like a cathedral organ crossed with a cradle: brass pipes, bellows breathing, and a great drum studded with pins, turning, turning. The lullaby comes out of it, sweet and endless.');
    await s.say('Vesper Cantor', 'Shh. Shh. You\'ll wake them.');
    await s.say('Wren', 'That\'s the idea.');
    await s.say('Vesper Cantor', 'Why? They\'re _happy_. They\'re at their birthdays. Every one of them. In the noon they\'ll never have a bad day again.');
    await s.say('Pip', 'They\'re in _cages_.');
    await s.say('Vesper Cantor', 'Everyone is in a cage, little boy. Theirs just has a nicer song.');
    await s.follow(0.4);
    const r = await s.battle('c8_boss_engine', { bg: 'ruin' });
    if (r !== 'win') return;
    s.setFlag('c8_engine_done');
    s.remove('cantor');
    s.music('sad');
    s.shake(0.3, 1.0);
    await s.narrate('The drum seizes. The pins scream across the comb. The lullaby stops in the middle of a bar — and behind you, down in the brig, a child starts to cry.');
    await s.say('Pip', 'That\'s Moth. Moth always cries when she wakes up. Every time. Like it\'s a surprise.');
    await s.fadeOut(1.0);
    ['ilse_s', 'pip_s', 'wick_sl', 'moth_sl'].forEach((id) => s.remove(id));
    s.spawn('ilse_s', 'ilse_ruin', 18, 23, 'down');
    s.spawn('pip_s', 'pip_ruin', 20, 25, 'down');
    s.spawn('wick_s', 'wick', 19, 26, 'up');
    s.spawn('moth_s', 'moth', 21, 26, 'up');
    s.place('player', 20, 23, 'down');
    await s.fadeIn(1.0);
    await s.say('Moth', 'Boss? ...Boss, you came for us?');
    await s.say('Pip', 'Course I came. Kites look after Kites.');
    await s.say('Wick', 'I dreamed it was my birthday, and Mum was there, and it was sunny, and it was _never going to stop_. Boss, it was so nice.');
    await s.wait(1.0);
    await s.say('Pip', '...Yeah. Yeah, I bet it was.');
    await s.narrate('Pip turns away from them, very fast, so they won\'t see his face. He turns straight into Wren instead.');
    await s.say('Pip', 'Don\'t.');
    await s.say('Wren', 'I wasn\'t going to.');
    await s.say('Ilse', 'Everyone hold hands. Nobody lets go until we\'re on the ladder. That\'s a rule, not a request.');
    await s.fadeOut(1.5);
    ['ilse_s', 'pip_s', 'wick_s', 'moth_s', 'kid_sl'].forEach((id) => s.remove(id));
    s.setFlag('c8_kids_saved');
    s.journal('There was a machine in the wreck singing children to sleep — kept dreaming their best days for "Evernoon." We broke it. Wick dreamed it was his birthday forever. He said it was so nice.');
    await s.teleport('c8_kite_nest', 7, 8, 'up');
  },

  // =========================================================================
  // Back in Kiteholm: the warning
  // =========================================================================
  async homecoming(s) {
    if (!s.flag('c8_kids_saved') || s.flag('c8_back')) return;
    s.setFlag('c8_back');
    s.music('town');
    s.spawn('ilse_s', 'ilse_ruin', 5, 7, 'right');
    s.spawn('pip_s', 'pip_ruin', 8, 5, 'down');
    await s.wait(0.4);
    await s.narrate('The Kite Nest erupts. Kites everywhere — on beds, on crates, on Wick.');
    await s.say('Tansy', 'You found them! Boss, you found— and _them_, they helped, I _told_ you grown-ups—');
    await s.say('Pip', 'Tansy. Quiet. All of you, quiet.');
    await s.wait(0.6);
    await s.say('Pip', 'The Vespers are coming. Here. A knight called the Penitent. For you. All of you.');
    await s.narrate('Twenty faces go very still. Nobody cries. That is the worst part — nobody cries.');
    await s.say('Pip', 'So here\'s what we do. We go to the Baron. He\'s got walls and guards and a big stupid gun on his roof. He keeps the air; he can keep us.');
    await s.say('Ilse', 'And if he won\'t?');
    await s.say('Pip', 'Then he\'ll learn what twenty Kites can do to a man\'s boots.');
    s.remove('ilse_s');
    s.remove('pip_s');
    s.objective('Warn Baron Dask at the Baron\'s Hall (the north terrace).');
  },

  async baronWarn(s) {
    if (!s.flag('c8_back') || s.flag('c8_warned')) return;
    s.setFlag('c8_warned');
    s.spawn('pip_s', 'pip_ruin', 6, 6, 'up');
    s.spawn('ilse_s', 'ilse_ruin', 8, 6, 'up');
    s.place('player', 7, 6, 'up');
    await s.wait(0.4);
    await s.say('Baron Dask', 'Pipkin Tallow. In my hall. With _guests_. To what do I owe the inconvenience?');
    await s.say('Pip', 'Vespers. They\'re coming for my Kites. A knight they call the Penitent. We need your guards on the ladders and your gun on the east cliff.');
    await s.say('Baron Dask', 'My guards guard _my_ scrap. My gun guards _my_ air. Your orphans guard themselves; that was always the arrangement.');
    await s.say('Wren', 'They\'re children!');
    await s.say('Baron Dask', 'And I am a businessman, girl. Children are a _cost_.');
    await s.wait(0.8);
    await s.say('Bram', '...The Penitent?');
    s.face('player', 'down');
    await s.narrate('By the door, Bram has gone the color of old ash.');
    await s.say('Bram', 'Black armor. A mask like a weeping face. He fights with... with his blade held high. Like this.');
    await s.say('Pip', 'How d\'you know that?');
    await s.say('Bram', 'Everyone in the Dawnguard knows the stories. A knight who... never mind. It\'s stories.');
    await s.say('Ilse', 'Bram. Will you stand with us?');
    await s.wait(1.6);
    await s.say('Bram', '...I\'m off duty at midnight.');
    await s.say('Pip', 'Course you are.');
    s.remove('pip_s');
    s.remove('ilse_s');
    s.objective('Prepare Kiteholm for the raid. When ready, talk to Pip at the Kite Nest to keep watch for the night.');
    s.journal('Baron Dask won\'t help — "children are a cost." Bram knew the Penitent from his description. He went grey. He\'s "off duty at midnight."');
  },

  async restBeforeRaid(s) {
    await s.say('Pip', 'Kites are on the lines. Slingshots, whistles, and every pot in the Nest for banging. We\'ll hear \'em coming.');
    if (!await s.confirm('Keep watch with Pip through the night? (Kiteholm will be attacked.)', 'Keep watch', 'Not yet')) {
      return s.say('Pip', 'Don\'t take long. Night comes when it wants now.');
    }
    await s.say('Pip', 'Go on, sleep. I\'ll take first watch. I always take first watch.');
    await s.fadeOut(1.5);
    s.heal();
    s.setFlag('c8_raid');
    await s.wait(1.0);
    await s.teleport('kiteholm', 30, 19, 'down');
  },

  // =========================================================================
  // The raid — Bram freezes; Pip falls; Bram fights.
  // =========================================================================
  async raid(s) {
    if (!s.flag('c8_raid') || s.flag('c8_raid_done')) return;
    s.music('tension');
    s.spawn('ilse_s', 'ilse_ruin', 29, 19, 'down');
    s.spawn('pip_s', 'pip_ruin', 31, 19, 'down');
    await s.wait(0.6);
    s.sfx('surprise');
    await s.narrate('A whistle. Then twenty whistles. Then every pot in Kiteholm, banging at once.');
    await s.say('Tansy', '_(from the kite-lines)_ EAST CLIFF! BLACK SAILS ON THE EAST CLIFF!', { portrait: false });
    await s.pan(40, 13, 1.2);
    s.spawn('r1', 'c8_raider', 39, 12, 'left');
    s.spawn('r2', 'c8_raider', 41, 14, 'left');
    s.spawn('r3', 'c8_cantor', 40, 10, 'left');
    await s.narrate('A black sky-barge noses out of the haze, sails like torn mourning-cloth. Figures drop from it on ropes onto the Kite Cliffs.');
    await s.follow(0.8);
    await s.say('Pip', 'Kites! Positions! Littles in the Nest, bigs on the lines! _GO!_');
    await Promise.all([s.move('r1', [[36, 14], [33, 17]], 4), s.move('r2', [[36, 15], [33, 19]], 4)]);
    let r = await s.battle('c8_raid_a', { bg: 'ruin' });
    if (r !== 'win') return;
    ['r1', 'r2', 'r3'].forEach((id) => s.remove(id));
    s.spawn('h1', 'c8_hollow', 26, 16, 'down');
    s.spawn('h2', 'c8_hollow', 24, 17, 'down');
    await s.say('Ilse', 'More — by the market! Those aren\'t men. Look at them. They\'re _empty_.');
    await s.move('player', [[27, 19], [25, 19]], 4);
    r = await s.battle('c8_raid_b', { bg: 'ruin' });
    if (r !== 'win') return;
    s.remove('h1');
    s.remove('h2');
    s.stopMusic(1.5);
    s.place('ilse_s', 24, 20, 'up');
    s.place('pip_s', 26, 20, 'up');
    s.place('player', 25, 20, 'up');
    s.spawn('tansy_s', 'tansy', 22, 18, 'down');
    // The Penitent
    s.spawn('penitent', 'penitent', 25, 11, 'down');
    await s.pan(25, 14, 1.4);
    await s.narrate('He comes down the Baron\'s ramp like a funeral bell: slow, heavy, certain. Black armor. A mask carved into a face that has been weeping for a very long time.');
    await s.move('penitent', [[25, 13], [25, 15]], 1.2);
    await s.say('The Penitent', 'The children. Where are the children.');
    await s.say('Wren', 'You\'re not taking them.');
    await s.say('The Penitent', 'I am not _taking_ them. I am taking them _home_. To a summer afternoon that never ends. To mothers who never die. To birthdays.');
    await s.say('The Penitent', 'What do you offer them? This? Kites and ash?');
    await s.say('Pip', 'We offer them _knives_, you tin-plated—');
    // Bram arrives
    s.spawn('bram_s', 'bram_ruin', 12, 16, 'right');
    await s.move('bram_s', [[17, 17], [21, 19]], 6);
    await s.say('Bram', 'Wren! Ilse! I— I heard the pots, I came as fast as—');
    await s.wait(0.4);
    await s.narrate('The Penitent turns. Lifts his greatsword high over his right shoulder, point back, elbow up. Waits.');
    await s.wait(1.0);
    await s.say('Bram', '...That\'s the Venn Guard.', { speed: 0.6 });
    await s.say('Bram', 'Nobody uses the Venn Guard. Nobody but— nobody but _him_.');
    await s.say('The Penitent', 'Squire.');
    await s.narrate('Bram does not move. His sword is in his hand. His feet are on the planks. He does not move at all.');
    await s.say('Wren', 'Bram! BRAM!');
    await s.say('The Penitent', 'You froze then, too. At your trial. Do you remember? I stepped in front of the blow.');
    await s.say('The Penitent', 'Nobody will step in front of this one.');
    await s.move('penitent', [[24, 17], [23, 18]], 2.5);
    s.face('penitent', 'tansy_s');
    await s.say('Tansy', 'B-Boss—');
    await s.move('pip_s', [[23, 19], [22, 19]], 7);
    s.face('pip_s', 'up');
    await s.say('Pip', 'TANSY, DOWN—!');
    s.flash('#ffffff', 0.3);
    s.sfx('slash');
    s.shake(0.4, 0.6);
    await s.wait(0.6);
    await s.narrate('The stroke comes down like the end of the world. Tansy is on the planks, unhurt, shoved clear. And a boy with one eye is lying where she was standing.');
    s.place('pip_s', 22, 20, 'down');
    await s.emote('ilse_s', '!');
    await s.say('Ilse', '_PIP!_');
    s.leave('pip');
    await s.move('ilse_s', [[23, 20]], 7);
    await s.wait(0.6);
    await s.say('Ilse', 'He\'s breathing. He\'s— Wren, I need _time_, I need him to stop _bleeding_—');
    await s.wait(1.0);
    await s.say('Bram', '...no.');
    await s.say('Bram', 'No. Not again.');
    s.music('boss');
    await s.say('Bram', 'NOT AGAIN!');
    await s.move('bram_s', [[22, 18]], 8);
    s.shake(0.3, 0.4);
    s.sfx('slash');
    await s.narrate('Steel on steel. The Penitent\'s second stroke stops a hand\'s width from the children — on Bram\'s blade.');
    await s.say('Bram', 'I\'m _afraid_. You hear me? I\'m so afraid I can\'t feel my hands.');
    await s.say('Bram', 'I\'m doing it anyway.');
    s.remove('bram_s');
    await rejoin(s, 'bram', 44, 'bram_ruin');
    s.remove('tansy_s');
    r = await s.battle('c8_boss_penitent', { bg: 'ruin', music: 'boss' });
    if (r !== 'win') return;
    s.setFlag('c8_raid_done');
    await CH8.unmasking(s);
  },

  async unmasking(s) {
    s.music('sad');
    s.place('penitent', 23, 17, 'down');
    s.spawn('bram_s', 'bram_ruin', 23, 19, 'up');
    s.place('player', 25, 19, 'up');
    await s.narrate('The Penitent goes down on one knee. The weeping mask cracks clean in two, and falls, and rings on the planks.');
    s.remove('penitent');
    s.spawn('aldous', 'c8_aldous', 23, 17, 'down');
    s.flash('#a080ff', 0.4);
    await s.wait(1.0);
    await s.narrate('Under it is the face of a man in his fifties. Grey beard, a broken nose healed crooked — a kind face. And the eyes are empty. Not dark. _Empty_, like the windows of a house where nobody lives.');
    await s.say('Bram', 'Sir... Sir Aldous?');
    await s.say('The Penitent', 'Squire Kestrel. You are late for your trial.');
    await s.say('Bram', 'You died. You _died_. I saw you die. You stepped in front of—');
    await s.say('The Penitent', 'In the noon, I don\'t have to. The Hierophant gave me back the day before. I polish my armor. You bring me cider. You say you\'re ready. I say you\'re not. Over. And over.');
    await s.say('The Penitent', 'It is very kind of him.');
    await s.wait(1.0);
    await s.say('Wren', 'Evernoon. It\'s _real_?');
    await s.say('The Penitent', 'As real as a summer afternoon, little Keeper. He has filled it with us — the dead. We walk its streets. We wear ourselves like coats.');
    await s.say('The Penitent', 'When he needs a hand out here, he sends one of us. We fit very well. We remember our own swords.');
    await s.wait(1.2);
    await s.say('The Penitent', 'Bram. You froze. You froze again.');
    await s.say('Bram', 'I did.');
    await s.wait(1.0);
    await s.say('Bram', 'And then I didn\'t.');
    await s.wait(1.6);
    await s.narrate('Something moves in the empty eyes. A flicker — like a candle seen through a window, far back in the house.');
    await s.say('Sir Aldous', '..._Good lad._', { speed: 0.5 });
    s.flash('#e0d0ff', 0.8);
    s.sfx('dark');
    s.remove('aldous');
    await s.wait(1.2);
    await s.narrate('The armor falls in on itself, full of nothing, and the nothing blows away on the wind.');
    await s.give('c8_venn_signet');
    await s.wait(0.6);
    await s.say('Bram', 'He used to say that. After drills. Every time. Even when I was terrible.');
    await s.say('Bram', 'I was always terrible.');
    await s.fadeOut(1.6);
    s.remove('bram_s');
    s.journal('The Penitent was Sir Aldous — or something wearing him. Evernoon is real, and it\'s full of the dead, worn like coats. Bram froze. Then he didn\'t. At the very end, something in Aldous\'s eyes said "good lad."');
    await s.teleport('c8_kite_nest', 7, 8, 'up');
  },

  // =========================================================================
  // Aftermath: Bram stays. Pip wakes. A kite.
  // =========================================================================
  async aftermath(s) {
    if (!s.flag('c8_raid_done') || s.flag('c8_aftermath')) return;
    s.setFlag('c8_aftermath');
    s.music('sad');
    s.spawn('ilse_s', 'ilse_ruin', 2, 4, 'up');
    s.spawn('pip_s', 'pip_ruin', 1, 4, 'right');
    s.spawn('bram_s', 'bram_ruin', 9, 6, 'down');
    s.place('player', 8, 8, 'up');
    await s.wait(0.6);
    await s.narrate('Morning, if there were mornings. The Nest is full of sleeping children, and one small boy in a hammock, stitched up from collarbone to hip.');
    await s.say('Ilse', 'He\'s going to live. Two things: he\'s going to have a scar, and he\'s going to be insufferable about it.');
    await s.say('Pip', '_(weakly)_ ...already am.');
    await s.wait(0.6);
    await s.say('Pip', 'Did we win? Was that... was that _Bram_? Swinging that big stupid sword?');
    await s.say('Ilse', 'Go to sleep, Pip.');
    await s.say('Pip', 'Make me.');
    await s.narrate('He\'s asleep before she can answer. Ilse doesn\'t let go of his hand.');
    await s.wait(1.0);
    s.face('player', 'up');
    s.face('bram_s', 'down');
    await s.say('Bram', 'I froze.');
    await s.say('Wren', 'You did. Then you fought.');
    await s.say('Bram', 'Sir Aldous used to say courage was a thing you _do_, not a thing you _have_. "You act while you\'re afraid, lad, or you never act at all." I thought he was just being nice. He was always being nice.');
    await s.say('Bram', 'I spent a year making sure I never had to find out if he was right.');
    await s.wait(1.0);
    await s.say('Wren', 'I gave Cassian the Dawnstone, Bram. I\'m the reason any of this happened. I didn\'t freeze. I ran straight at it.');
    await s.say('Wren', 'If you\'re a coward, I don\'t know what that makes me.');
    await s.wait(1.4);
    await s.say('Bram', '...That makes you _ours_.');
    await s.say('Bram', 'If you\'ll have a coward.');
    await s.say('Wren', 'We\'ll have Bram.');
    if (s.flag('c8_debt_paid')) {
      await s.say('Bram', 'And— you paid the Baron. For my shield. I pawned it the first week. Thought I didn\'t deserve to carry it.');
      await s.say('Wren', 'You don\'t have to deserve it. You just have to carry it.');
    }
    s.remove('bram_s');
    await s.say('Bram', 'One thing. The Penitent\'s barge went west, toward the Noon Spire. If we\'re going after Evernoon, we need wings.');
    await s.say('Bram', 'The Baron\'s been dunning an airship captain for eleven thousand silver. Holed up at a place called Corvin\'s Roost.');
    await s.say('Wren', '..._Corvin?_ Corvin\'s alive?');
    await s.say('Bram', 'And owes everybody money. So: yes. Definitely Corvin.');
    await s.wait(0.8);
    await s.say('Ilse', 'Wren.');
    await s.say('Wren', 'Yeah?');
    await s.say('Ilse', 'When Pip went down, you went straight at that thing. You didn\'t even look back to see if I was behind you.');
    await s.say('Wren', 'I didn\'t have to. I knew you were there.');
    await s.wait(1.2);
    await s.say('Ilse', '...I was.');
    await s.narrate('It is not forgiveness. It is something smaller than that. But it is not nothing.');
    s.remove('ilse_s');
    s.remove('pip_s');
    s.objective('Pip wants to see you at the Kite Cliffs (east of the Nest) when he\'s on his feet.');
    s.journal('Bram is with us. "If you\'ll have a coward." We\'ll have Bram. Pip will live — scar and all. And Corvin is alive, hiding from his debts at a place called Corvin\'s Roost.');
  },

  async quietKite(s) {
    if (!s.flag('c8_aftermath') || s.flag('c8_quiet')) return;
    s.setFlag('c8_quiet');
    s.music('afterlight');
    s.spawn('pip_s', 'pip_ruin', 43, 14, 'right');
    await s.narrate('On the highest point of the Kite Cliffs, where the wind never stops, Pip sits with a kite across his knees. Red and gold. Brand new.');
    await s.move('player', [[42, 14]], 1.6);
    s.face('pip_s', 'left');
    await s.say('Pip', 'Ilse says I\'m not allowed up here. Ilse says a lot.');
    await s.say('Wren', 'That\'s a good kite.');
    await s.say('Pip', 'I\'ve built a hundred. For the littles. Best kites on the shard.');
    await s.wait(0.8);
    await s.say('Pip', 'Never flown one. Not once.');
    await s.say('Wren', 'Why not?');
    await s.say('Pip', 'Somebody\'s got to hold the string. Somebody\'s got to watch the ladders. Count heads. Find the food. Know where everybody is. That\'s the Boss.');
    await s.say('Pip', 'You can\'t do that and look up.');
    await s.wait(1.2);
    await s.say('Wren', 'I\'ll hold it.');
    await s.say('Pip', 'What?');
    await s.say('Wren', 'The Kites. For a bit. Tansy\'s got the ladders. Ilse\'s got the Nest — nobody\'s getting past Ilse. Bram\'s counting heads, very badly, out loud.');
    await s.say('Wren', 'You fly it.');
    await s.say('Pip', 'I\'m the _Boss_, I don\'t—');
    await s.say('Wren', 'You\'re twelve.');
    await s.wait(1.4);
    await s.say('Pip', '...Twelve and a half.');
    await s.narrate('He stands. He holds it up into the wind. The wind takes it — snatches it — and the string sings off the spool, up and up into the bruised sky.');
    await s.pan(43, 9, 2.0);
    await s.say('Pip', 'Look at it go— look at it _GO!_ Wren! WREN, LOOK!');
    await s.say('Wren', 'I\'m looking.');
    await s.narrate('Pip laughs. Not the hard, old laugh. A kid\'s laugh — too loud, cracking in the middle, completely helpless.');
    await s.follow(1.2);
    await s.wait(1.0);
    await s.say('Pip', '...Don\'t tell the Kites.');
    await s.say('Wren', 'Tell them what?');
    await s.say('Pip', 'That I\'m a kid.');
    await s.say('Wren', 'Pip. They know.');
    await s.wait(1.0);
    s.spawn('tansy_s', 'tansy', 39, 15, 'right');
    await s.move('tansy_s', [[41, 15]], 3);
    await s.say('Tansy', 'Boss! Ilse says you have to come down or she\'ll— whoa. Is that _yours?_');
    await s.say('Pip', 'Tansy. When we go — and we\'re going — who minds the Kites?');
    await s.say('Tansy', 'Me. I\'m nine and three-quarters. That\'s basically ten.');
    await s.wait(0.8);
    await s.say('Pip', '...Yeah. Yeah, okay. Basically ten.');
    s.remove('tansy_s');
    s.remove('pip_s');
    await rejoin(s, 'pip', 44, 'pip_ruin', true);
    await s.system('*Pip* rejoins the party.');
    s.music('town');
    s.objective('Take the Baron\'s skiff from the south-west dock to Corvin\'s Roost when you are ready.');
    s.journal('Pip flew a kite. His first one, ever. He laughed like a kid. Tansy will mind the Kites — she\'s "basically ten." Next: Corvin\'s Roost.');
  },

  async skiff(s) {
    if (!s.flag('c8_quiet')) return s.say('Skiff-Hand Rook', 'Baron\'s skiff. Baron\'s orders. Baron\'s bad mood. Come back with a reason.');
    await s.say('Skiff-Hand Rook', 'Baron says you\'re to have the skiff. Says it\'s "an investment." Said it like it hurt him.');
    if (!await s.confirm('Leave Kiteholm for Corvin\'s Roost? (You can return later by the world map.)', 'Cast off', 'Not yet')) {
      return s.say('Skiff-Hand Rook', 'Skiff\'ll wait. Baron won\'t, but the skiff will.');
    }
    return CH8.departure(s);
  },

  async departure(s) {
    if (s.flag('c8_done')) return;
    s.setFlag('c8_done');
    await s.say('Bram', 'Corvin Ashe. Last time I saw him he owed me four silver and a boot.');
    await s.say('Pip', 'Last time I saw him I _was_ the four silver.');
    await s.say('Ilse', 'Three things. One, he\'s a coward. Two, he\'s a liar. Three—');
    await s.say('Wren', 'Three, he\'s ours.');
    await s.wait(0.8);
    await s.say('Ilse', '...I was going to say "three, he has an airship." But fine.');
    await s.fadeOut(1.5);
    s.journal('We left Kiteholm on the Baron\'s skiff. Twenty Kites on the lines, waving. Tansy saluted. Pip pretended not to see, and then saluted back.');
    await s.chapter(9, 'The Halcyon');
    s.objective('Find Corvin Ashe at Corvin\'s Roost.');
    await s.teleport('corvins_roost', 10, 20, 'up');
  },

  // =========================================================================
  // Side quests
  // =========================================================================

  // ---- Bram's Debt (Baron Dask)
  async baron(s) {
    if (s.flag('c8_back') && !s.flag('c8_warned')) return CH8.baronWarn(s);
    if (s.flag('c8_debt_paid')) return s.say('Baron Dask', ['A pleasure doing business. Rarely is.']);
    if (s.flag('c8_met_bram') && !s.flag('c8_debt_on')) {
      s.setFlag('c8_debt_on');
      await s.say('Baron Dask', 'Kestrel\'s friends. Charming. Your Kestrel owes me fifteen hundred silver in drink, damages, and one very expensive coat rack.');
      await s.say('Baron Dask', 'He pawned me a shield against it his first week. Dawnguard steel. Dented. Sentimental garbage, but garbage is my trade.');
      s.quest('c8_q_debt', 'Bram\'s Debt', 'Bram owes Baron Dask 1,500 gold. Paying it will redeem the shield Bram pawned.');
    }
    if (s.flag('c8_debt_on')) {
      if (!await s.confirm(`Pay Bram's debt of 1,500 gold? (You have ${s.state.gold})`, 'Pay it', 'Not now')) return s.say('Baron Dask', 'The debt keeps. Interest is my love language.');
      if (s.state.gold < 1500) return s.say('Baron Dask', 'Your purse says no. I always listen to purses.');
      await s.gold(-1500);
      s.setFlag('c8_debt_paid');
      await s.say('Baron Dask', 'Paid in full. How sweet. Here — take the man\'s shield. It\'s been looking at me.');
      await s.give('c8_old_shield');
      s.quest('c8_q_debt', null, null, 'done');
      return;
    }
    return s.say('Baron Dask', 'I own the air. Breathe carefully.');
  },

  async bramDoor(s) {
    if (s.flag('c8_back')) return s.say('Bram', ['Midnight. I\'m off at midnight.', '...Don\'t look at me like that. Ilse\'s already looking at me like that. There\'s only so much _that_ a man can take.']);
    return s.say('Bram', ['I\'m on duty. Can\'t talk. Very important. Guarding.', '...Guarding a door. From people who want to come in and ask the Baron for money. It\'s mostly me telling them no.', 'I\'m good at telling people no. Started with myself.']);
  },

  // ---- The Kite-Wright (Gaffer Quill)
  async quill(s) {
    if (s.flag('c8_quill_done')) return s.say('Gaffer Quill', ['When you find Ashe, tell him Quill says his port wing still pulls left. He\'ll know. He\'ll pretend he doesn\'t, but he\'ll know.']);
    if (s.has('scrap_gear', 3)) {
      s.setFlag('c8_quill_done');
      await s.take('scrap_gear', 3);
      await s.say('Gaffer Quill', 'Airship cogs! Real ones! Oh, she\'ll fly now. Well — she\'ll fall slower. Same thing, up here.');
      await s.say('Gaffer Quill', 'I built wings for the _Halcyon_, you know. Years back. Corvin Ashe\'s ship. If he\'s alive, she\'s rusting at the Roost, and he\'s drinking next to her, telling her it\'s not her fault.');
      await s.say('Gaffer Quill', 'Take this. A wright\'s monocle. You see how things fit together, after a while.');
      await s.give('scholars_monocle');
      s.quest('c8_q_quill', null, null, 'done');
      return;
    }
    if (!s.flag('c8_quill_on')) {
      s.setFlag('c8_quill_on');
      await s.say('Gaffer Quill', 'Kite-wright. Glider-wright. Wright of anything that wants to be in the air and shouldn\'t be.');
      await s.say('Gaffer Quill', 'I\'m building a glider big enough to carry the Kites off this rock if it ever cracks. I need three airship cogs. The scrap-golems below have \'em in their bellies — don\'t ask how.');
      s.quest('c8_q_quill', 'The Kite-Wright', 'Gaffer Quill needs 3 Scrap Gears (scrap golems in the Underhang and the Vigil carry them) for an escape glider.');
      return;
    }
    return s.say('Gaffer Quill', `Three cogs. You\'ve got ${s.state.inventory.count('scrap_gear')}. The golems below keep \'em in their bellies.`);
  },

  // ---- Wick's Kite
  async wick(s) {
    if (s.has('c8_wick_kite')) {
      await s.take('c8_wick_kite');
      s.setFlag('c8_wick_done');
      await s.say('Wick', 'MY KITE! You got it off the shrikes? Nobody gets anything off the shrikes!');
      await s.say('Wick', 'Here. It\'s my best thing. A fruit off the Baron\'s roof-tree. He counts them. He\'ll never notice. He\'ll _definitely_ notice.');
      await s.give('swift_fruit');
      s.quest('c8_q_kite', null, null, 'done');
      return;
    }
    if (s.flag('c8_wick_done')) return s.say('Wick', 'I\'m teaching it to do loops. It doesn\'t want to. We\'re negotiating.');
    if (!s.flag('c8_wick_kite') && !s.vars.c8_kite_asked) {
      s.vars.c8_kite_asked = true;
      s.quest('c8_q_kite', 'Wick\'s Kite', 'The gale-shrikes of the Underhang stole Wick\'s blue kite. They nest on the western ledges.');
    }
    return s.say('Wick', ['I dreamed it was my birthday forever. It was nice. I don\'t want to go back.', 'Does that make sense? I don\'t want it even though it was nice.', 'Also the shrikes took my kite. That\'s a separate sadness.']);
  },

  // ---- The Scrap Arena (Madame Ratchet)
  async ratchet(s) {
    const ranks = [
      { flag: 'c8_arena1', troop: 'c8_arena_rustjaw', name: 'Rank I — Rustjaw', reward: async () => { await s.gold(1500); await s.give('mega_tonic', 2); } },
      { flag: 'c8_arena2', troop: 'c8_arena_twins', name: 'Rank II — Cog & Sprocket', reward: async () => s.give('haste_anklet') },
      { flag: 'c8_arena3', troop: 'c8_arena_moll', name: 'Rank III — Iron Moll', reward: async () => s.give('thiefs_glove') },
      { flag: 'c8_arena4', troop: 'c8_arena_roc', name: 'Champion — the Gale Roc', reward: async () => s.give('phoenix_charm') },
    ];
    const next = ranks.find((r) => !s.flag(r.flag));
    if (!s.flag('c8_arena_met')) {
      s.setFlag('c8_arena_met');
      await s.say('Madame Ratchet', 'Welcome to the Scrap Arena, darlings! Kiteholm\'s finest — and only — entertainment, now that the Baron\'s banned singing.');
      await s.say('Madame Ratchet', 'Four ranks. Win and you get prizes. Lose and you get carried out. The crowd enjoys both equally.');
      s.quest('c8_q_arena', 'The Scrap Arena', 'Fight through the four ranks of Madame Ratchet\'s Scrap Arena.');
    }
    if (!next) return s.say('Madame Ratchet', ['Champions! The crowd adores you. The crowd also adored a goat that could count, so don\'t let it go to your heads.']);
    if (!await s.confirm(`Enter ${next.name}?`, 'Fight!', 'Not now')) return s.say('Madame Ratchet', 'Cold feet? We have braziers for that.');
    s.music('tension');
    const r = await s.battle(next.troop, { bg: 'ruin', loseOk: true, canFlee: false });
    s.music('town');
    if (r !== 'win') { s.heal(); return s.say('Madame Ratchet', 'Carried out! The crowd is delighted. Do come again — we patch you for free. It\'s in the ticket price.'); }
    s.setFlag(next.flag);
    await s.say('Madame Ratchet', next.flag === 'c8_arena4'
      ? 'THE GALE ROC FALLS! Darlings, you\'re Kiteholm\'s champions! Here — the champion\'s purse. Don\'t spend it on the Baron.'
      : 'And the crowd goes _moderately_ wild! Your prize, darlings.');
    await next.reward();
    if (next.flag === 'c8_arena4') s.quest('c8_q_arena', null, null, 'done');
    return null;
  },
};
