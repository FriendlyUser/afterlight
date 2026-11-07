// CHAPTER 9 — side stories in Corvin's Roost: Ferro's cards, Ox's clock,
// Lonnie in the stocks, Wick's charts, and two kids who need a pirate captain.

const CARD_NAMES = ['', 'Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Knave', 'Queen', 'King'];
const draw = () => 1 + Math.floor(Math.random() * 13);
const inParty = (s, id) => s.state.party.includes(id);

export const CH9_SIDE = {
  // ------------------------------------------------------------------ High-Low
  async ferro(s) {
    if (s.flag('c9_q_ferro_done')) {
      return s.say('Ferro', ['You took my Ace, girl. I\'ve had that Ace since before the sun broke.', 'Mind you treat it well. It\'s never been treated well in its life.']);
    }
    if (!s.flag('c9_q_ferro')) {
      s.setFlag('c9_q_ferro');
      await s.say('Ferro', 'Sit, sit. Ferro\'s the name, and High-Low\'s the game. I turn a card; you call the next one higher or lower.');
      await s.say('Ferro', 'Call three in a row, and you win my lucky Ace. Miss one, and I win five hundred of your gold. Fair as daylight.');
      await s.say('Ferro', '...Fair as daylight *used* to be.');
      s.quest('c9_q_ferro', 'High-Low', 'Ferro, a card-sharp in the Last Call, stakes his lucky Ace against 500 gold. Call three cards in a row, higher or lower.');
    }
    if (!(await s.confirm('Play High-Low for 500 gold?'))) return s.say('Ferro', 'The cards will wait. Cards are patient. It\'s the only good thing about them.');
    if (s.state.gold < 500) return s.say('Ferro', 'Five hundred, love. I can count, even if you can\'t.');
    s.state.gold -= 500;
    const honest = inParty(s, 'corvin');
    if (honest && !s.flag('c9_ferro_caught')) {
      s.setFlag('c9_ferro_caught');
      await s.say('Corvin', 'Ferro. Deal off the *top* of the deck this time. And leave the second deck in your boot.');
      await s.say('Ferro', '...Captain. I didn\'t see you there.');
      await s.say('Corvin', 'Nobody ever does. It\'s my best feature.');
    }
    let card = draw();
    for (let streak = 0; streak < 3; streak++) {
      await s.say('Ferro', `The card is the *${CARD_NAMES[card]}*. Higher, or lower?`);
      const higher = (await s.choice(['Higher', 'Lower'])) === 0;
      let next = draw();
      while (next === card) next = draw();
      const wins = (n) => (higher ? n > card : n < card);
      if (!honest && wins(next) && Math.random() < 0.3) {
        const losers = Array.from({ length: 13 }, (_, i) => i + 1).filter((n) => n !== card && !wins(n));
        if (losers.length) next = losers[Math.floor(Math.random() * losers.length)];
      }
      s.sfx('cursor');
      await s.say('Ferro', `...the *${CARD_NAMES[next]}*.`);
      if (!wins(next)) {
        await s.say('Ferro', streak === 2 ? 'Oh, so close. So close. Closeness pays nothing, love; I\'ve checked.' : 'Ah. The house thanks you for your contribution.');
        if (!honest && streak > 0) await s.think('Wren', 'Did his left hand just... move?');
        return;
      }
      card = next;
    }
    s.setFlag('c9_q_ferro_done');
    await s.say('Ferro', 'Three. Three in a row. Hah! Well. Well, well.');
    await s.say('Ferro', 'A deal\'s a deal. Here\'s my Ace — and your five hundred back. I\'m a cheat, not a thief.');
    await s.gold(500, true);
    await s.give('c9_gamblers_ace');
    s.quest('c9_q_ferro', null, null, 'done');
  },

  // ------------------------------------------------------------------ Ox's clock
  async ox(s) {
    if (s.flag('c9_q_clock_done')) {
      return s.say('Ox', ['Listen. Hear it? Tick. Tick.', 'Folks come by just to stand here. Little ones mostly. They never heard a clock before.']);
    }
    if (s.has('c9_pilgrim_clock')) {
      s.setFlag('c9_q_clock_done');
      await s.say('Ox', 'Is that— oh. Oh, look at her. Brass and glass. Somebody loved this.');
      await s.take('c9_pilgrim_clock');
      await s.fadeOut(0.6);
      await s.narrate('Ox works with fingers as thick as rope and as gentle as moths. It takes a long time. Nobody minds.');
      await s.fadeIn(0.6);
      s.sfx('cursor');
      await s.wait(0.4);
      s.sfx('cursor');
      await s.say('Ox', 'There. Hear that?');
      await s.say('Ox', 'It says it\'s a quarter past three.');
      await s.say('Wren', 'Is it?');
      await s.say('Ox', 'Who knows. But now we can *say* it. A clock that\'s moving is worth more than a clock that\'s right.');
      await s.say('Ox', 'Here. Found this in the same heap as my best gears. It never stops moving either. Maybe you two will get on.');
      await s.give('haste_anklet');
      s.quest('c9_q_clock', null, null, 'done');
      return;
    }
    if (!s.flag('c9_q_clock')) {
      s.setFlag('c9_q_clock');
      await s.say('Ox', 'Hullo. I\'m Ox. I fix clocks.');
      await s.say('Ox', 'Haven\'t had one tick since the sun broke. Time\'s gone soft in the Roost. Folk don\'t know how old their kids are. They argue about it.');
      await s.say('Ox', 'If you find a clock with its works still in — brass, glass, anything — bring it me? I\'d like to hear one go again.');
      s.quest('c9_q_clock', 'The Stopped Clock', 'Ox the tinkerer wants a clock with its works intact. Somewhere out in the ruin, someone must have carried one.');
      return;
    }
    return s.say('Ox', 'Brass and glass. Works still in. Somebody somewhere must\'ve been carrying one when the sky fell.');
  },

  async pilgrimClock(s) {
    if (s.flag('c9_got_clock') ) return s.narrate('An empty shelf, ringed in brass-coloured dust.');
    s.setFlag('c9_got_clock');
    await s.narrate('On the shelf above the captain\'s bunk: a brass carriage clock, its glass unbroken. The hands stand at seven minutes past the end of the world.');
    await s.give('c9_pilgrim_clock');
    if (s.flag('c9_q_clock')) await s.say('Ilse', 'Ox will want that.');
  },

  // ------------------------------------------------------------------ Lonnie in the stocks
  async lonnie(s) {
    if (s.flag('c9_q_lonnie_done')) {
      return s.say('Lonnie', ['Feels strange, standing up straight. My back keeps trying to bow to people.', 'Thanks again. Mind the goat. It\'s still a dog.']);
    }
    if (s.flag('c9_lonnie_free')) {
      s.setFlag('c9_q_lonnie_done');
      await s.say('Lonnie', 'My rescuers! Here — found it under the stocks, wedged in the boards. Someone before me must have dropped it.');
      await s.say('Lonnie', 'Didn\'t bring them much luck. Maybe it was saving up for you.');
      await s.give('lucky_coin');
      s.quest('c9_q_lonnie', null, null, 'done');
      return;
    }
    if (!s.flag('c9_q_lonnie')) {
      s.setFlag('c9_q_lonnie');
      await s.say('Lonnie', 'Don\'t mind me. Just hanging about. Ha. Ha.');
      await s.say('Lonnie', 'Fifteen hundred gold I owe the Ledger. For a goat. Which turned out to be a dog. Which ran off. Which I\'m *still paying for*.');
      await s.say('Lonnie', 'Big Tamm by the Ledger House door holds my marker. If some kind soul paid it, I\'d stand up for the first time in a month.');
      s.quest('c9_q_lonnie', 'In the Stocks', 'Lonnie owes the Ledger 1,500 gold for a goat that was a dog. Bailiff Tamm, by the Ledger House door, holds his marker.');
      return;
    }
    return s.say('Lonnie', 'Tamm. Big fellow. Ledger House door. Smells of ink and disappointment.');
  },

  async tamm(s) {
    if (s.flag('c9_q_lonnie') && !s.flag('c9_lonnie_free')) {
      await s.say('Bailiff Tamm', 'Lonnie\'s marker? Fifteen hundred. Cash. The Ledger doesn\'t take sympathy.');
      if (!(await s.confirm('Pay Lonnie\'s debt? (1,500 gold)'))) return;
      if (s.state.gold < 1500) return s.say('Bailiff Tamm', 'You\'re short. I can tell. I have a gift.');
      s.state.gold -= 1500;
      s.setFlag('c9_lonnie_free');
      s.sfx('item');
      await s.say('Bailiff Tamm', 'Paid. I\'ll let him out.');
      await s.say('Bailiff Tamm', '...Don\'t tell anyone I said this, but it\'s good to let one out. Doesn\'t happen much.');
      return;
    }
    if (s.flag('c9_long_bell')) return s.say('Bailiff Tamm', 'The Queen tore up the Captain\'s marker. In front of witnesses. I have never been so frightened.');
    return s.say('Bailiff Tamm', ['Ledger House. Business only. Debtors on the carpet, guests in the chairs.', 'You look like guests. For now.']);
  },

  // ------------------------------------------------------------------ Wick's charts
  async wick(s) {
    const done = ['boneyard', 'benediction', 'cinderdeep'].filter((k) => s.flag(`c9_chart_${k}`)).length;
    if (s.flag('c9_q_charts_done')) {
      return s.say('Wick', ['The chart\'s pinned over my bed. I wake up and the world is the right shape, for a minute.', 'Seven wounds and a needle. Funny thing to fall asleep to.']);
    }
    if (!s.flag('c9_q_charts')) {
      s.setFlag('c9_q_charts');
      await s.say('Wick', 'Mind the table. That\'s the world, there. Well. It was.');
      await s.say('Wick', 'Every old map is wrong now. The world\'s in pieces, and the pieces drift. I need sightlines — high places where you can see the shards line up, and sketch which way they\'re going.');
      await s.say('Wick', 'You\'re heading out there anyway. The Boneyard has a crane-tower. The Benediction had a crow\'s nest. And the Cinderdeep has a chimney-crack to the sky, if the miners are telling it true.');
      await s.say('Wick', 'Sketch me the view from all three? I\'ll make it worth your while. Cartographers are poor, but we\'re *precise* about it.');
      s.quest('c9_q_charts', 'Charting the Ruin', 'Wick the cartographer needs sightlines: sketch the view from the Boneyard crane-tower, the Benediction\'s fallen crow\'s nest, and the Cinderdeep\'s chimney-crack.');
      return;
    }
    if (done < 3) return s.say('Wick', `Sightlines so far: ${done} of 3. The world\'s waiting to be the right shape.`);
    s.setFlag('c9_q_charts_done');
    await s.say('Wick', 'All three! Give them here — careful, careful—');
    await s.narrate('Wick lays the three sketches over his chart and joins them with a ruler and a stub of pencil. Lines run out across the abyss and cross.');
    await s.say('Wick', 'Seven bright points. The pieces of the sun. They\'re drifting — all of them — but slowly, slowly, toward each other.');
    await s.say('Wick', 'And here, in the middle, where the lines meet... the brightest one. The one with the white needle on it. It isn\'t drifting at all.');
    await s.say('Wick', 'Everything is moving toward the one thing that doesn\'t move. I don\'t like that. Maps shouldn\'t be frightening.');
    await s.say('Wick', 'Take this. My old master gave it me. Said a good chart teaches you as much as a good teacher; this does the same for your Crest.');
    await s.give('crest_brooch');
    s.quest('c9_q_charts', null, null, 'done');
  },

  async vantage(s, key, lines) {
    if (!s.flag('c9_q_charts') || s.flag(`c9_chart_${key}`)) return s.narrate(lines[0]);
    s.setFlag(`c9_chart_${key}`);
    await s.narrate(lines);
    await s.system('Wren sketches the sightline for Wick.');
  },

  // ------------------------------------------------------------------ Captains and Pirates
  async kids(s, who) {
    if (s.flag('c9_q_kids_done')) {
      return s.say(who === 'fen' ? 'Fen' : 'Dory', who === 'fen'
        ? ['Captain Pip says we can be his crew when we\'re bigger. On the real ship.', 'I\'m going to be the one who shouts "LAND HO." Even if there isn\'t any.']
        : ['Captain Pip is the best pirate. He stole my nose and gave it back.', 'He said his captain taught him. Is his captain the ghost?']);
    }
    if (!s.flag('c9_corvin_joined')) {
      return s.say(who === 'fen' ? 'Fen' : 'Dory', who === 'fen'
        ? ['That\'s a real sky-ship. A *real* one. Its captain\'s a ghost.', 'He comes up the canyon at night and stands at the bottom of the plank. Dory saw him.']
        : ['I saw the ghost captain! He had a hat. Ghosts don\'t usually have hats.', 'He looked sad. Ghosts are probably always sad. That\'s why they\'re ghosts.']);
    }
    s.setFlag('c9_q_kids_done');
    s.quest('c9_q_kids', 'Captains and Pirates', 'Fen and Dory need a pirate captain for their game. They\'ve chosen Pip.');
    await s.say('Fen', 'You! You\'re a real sky-pirate, aren\'t you? With the eyepatch! Play Captains and Pirates with us! You can be Captain!');
    await s.say('Pip', 'I don\'t play.');
    await s.say('Dory', 'Everybody plays.');
    await s.say('Pip', 'I\'m busy. Adult stuff.');
    await s.say('Corvin', 'Kid. Go be a pirate.');
    await s.say('Pip', 'I\'m *working*, Corvin.');
    await s.say('Corvin', 'Adult stuff\'ll keep. Trust me — I\'ve been ignoring it for years and it\'s still right where I left it.');
    await s.wait(1.0);
    await s.say('Pip', '...Fine. ONE game. And I\'m Captain.');
    await s.fadeOut(0.6);
    await s.narrate([
      'There is a great deal of shouting. Somebody walks a plank, which is a crate. Somebody is marooned, which is the well-cover.',
      '"AVAST," shouts a twelve-year-old pirate captain, at the top of his lungs, and then — for a long time, for the first time in a year — he laughs.',
    ]);
    await s.fadeIn(0.6);
    await s.say('Dory', 'Captain Pip! This is for you. It\'s a fruit. It\'s very old. We were saving it for somebody brave.');
    await s.give('power_fruit');
    await s.say('Pip', '_(red-faced)_ ...That was a stupid game.');
    await s.say('Corvin', 'Yeah. Best kind.');
    s.quest('c9_q_kids', null, null, 'done');
  },
};
