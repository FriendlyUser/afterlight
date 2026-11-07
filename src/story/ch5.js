// CHAPTER 5 — "The Last Sunset"
// The party comes home to a sun that will not set. Cassian is waiting in the
// Lantern. Wren gives him the Dawnstone. The sun breaks. Ysolde holds the light.

const CAST = ['ilse', 'bram', 'sable', 'pip', 'corvin'];

/** Spawn the companions as cutscene actors: spots = { ilse: [x, y, dir], ... } */
function spawnParty(s, spots) {
  for (const id of CAST) {
    const p = spots[id];
    if (p && s.state.characters[id]) s.spawn(`c_${id}`, id, p[0], p[1], p[2] || 'up');
  }
}
function removeParty(s) { for (const id of CAST) s.remove(`c_${id}`); }

/** Bring a map NPC (from map.npcs) on stage now, instead of on the next visit. */
function spawnNpc(s, id) {
  const def = (s.field.map.npcs || []).find((n) => n.id === id);
  if (def && !s.field.actors.has(id)) s.field.spawnActor(def);
}

export const CH5 = {
  // ================================================================== homecoming
  async arrival(s) {
    if (s.flag('c5_arrived')) return;
    s.setFlag('c5_arrived');
    s.setFlag('c5_homes');
    s.state.chapter = 5;
    s.place('player', 23, 30, 'up');
    spawnParty(s, { ilse: [22, 30], sable: [24, 30], bram: [22, 31], pip: [24, 31], corvin: [23, 31] });
    s.music('lanternfall');
    await s.wait(0.6);
    await s.narrate(['The sun was setting over Lanternfall.', 'It had been setting for a very long time.']);
    await s.say('Wren', 'We made it. We— okay. We made it.');
    await s.say('Corvin', 'Fastest flight the old girl ever made. Held together with storm cores and spite.');
    await s.narrate('Behind you, out in the shallows, the Halcyon settles onto the flat water with a long, tired groan of timber, like an old dog lying down.');
    await s.say('Corvin', 'And that\'s the last of the cores. She won\'t lift again without three more and a miracle.');
    await s.say('Pip', 'This is it? This is the whole island? I\'ve seen bigger puddles in the Undercroft.');
    await s.say('Ilse', 'Wren. Look at the sun.');
    await s.narrate('It sits on the edge of the sea, swollen and red, like a coin someone forgot to drop.');
    await s.say('Sable', 'It is not moving. I watched it the whole way in. It has not moved.');
    await s.say('Bram', 'Suns move. That\'s— that\'s the main thing about them. That\'s their whole job.');
    await s.pan(8, 4, 1.6);
    await s.narrate('On the bluff, the Lantern is lit. And it is humming — a low, steady note you feel in your teeth more than hear.');
    await s.say('Wren', 'That sound. I know that sound.');
    await s.say('Sable', 'The forks.');
    await s.say('Wren', '...The ones we carried. To every Lantern in the world.');
    await s.follow(0.8);
    s.spawn('tobias_a', 'tobias', 23, 24, 'down');
    await s.move('tobias_a', [[23, 28]], 3.2);
    await s.say('Fisher Tobias', 'Wren? Wren Halloway, as I live and— thank the tide. Your mother said you\'d come. She said it like a curse.');
    await s.say('Wren', 'Tobias. Where is she?');
    await s.say('Fisher Tobias', 'In the Lantern. Three days now. Hierophant\'s up there with her, comes and goes like he owns the place. And his soldiers are on the hill road. Nobody up. Nobody down.');
    await s.say('Fisher Tobias', 'Sun\'s been sat on that water since noon yesterday. Gulls stopped flying this morning. They just sit on the roofs. Staring at it.');
    await s.say('Corvin', '_(quietly)_ Six of seven, sparrow. And here we are at number seven.');
    await s.say('Ilse', 'Tobias — Nana. Is Nana—');
    await s.say('Fisher Tobias', 'Fine, love. Worried sick and cooking about it. Go see her.');
    await s.say('Fisher Tobias', 'And Wren — the soldiers turned back Old Corrin this morning, and he\'s eighty. Don\'t go starting a war on the hill road.');
    await s.say('Wren', 'I wasn\'t going to start one.');
    await s.say('Pip', '_(to Bram)_ She was totally gonna start one.');
    await s.move('tobias_a', [[23, 29], [19, 29], [19, 30]], 2.4);
    s.remove('tobias_a');
    spawnNpc(s, 'tobias');
    removeParty(s);
    s.objective('Find a way up to the Lantern. Look in on Nana Brisa and the village first.');
    s.journal('We came home. The sun won\'t set. The Lantern is humming the note from the forks we carried — and Mom has been up there with Cassian for three days.');
  },

  // ------------------------------------------------------------------ village NPCs
  async tobias(s) {
    if (s.flag('c5_soldiers') && !s.flag('c5_stair_known')) {
      s.setFlag('c5_stair_known');
      await s.say('Fisher Tobias', 'Turned you back, did they. ...Course they did.');
      await s.say('Fisher Tobias', 'There\'s another way up. The old Keeper\'s Stair. Your grandmother\'s grandmother\'s grandmother cut it, so a Keeper could bring the light down to the boats in a storm.');
      await s.say('Fisher Tobias', 'Top end comes out on the bluff, behind the Lantern. Bottom end\'s in the tide caves, way at the back. Your father found it when we were boys. Him, me, and Fen.');
      await s.say('Wren', 'Who\'s Fen?');
      await s.say('Fisher Tobias', 'Nobody you\'d remember. Point is, the bottom end\'s been sealed with rock since before you were born. And lately something\'s been growing over the rock. Something purple.');
      await s.say('Wren', '...The crystal.');
      await s.say('Fisher Tobias', 'You know it?');
      await s.say('Wren', 'We\'ve met.');
      await s.say('Fisher Tobias', 'Then mind yourselves. Folk say the caves have been singing lately. Low, like a man humming in the next room.');
      s.objective('Go through the Tide Caves (east road) and find the bottom of the Keeper\'s Stair.');
      s.journal('Tobias says there\'s a secret stair from the tide caves to the Lantern. Dad found it when he was a boy — with Tobias and someone called Fen.');
      return;
    }
    if (s.flag('c5_stair_known')) {
      return s.say('Fisher Tobias', ['Boat\'s ready. I\'ve readied her four times today. Keep her ready, your father always said. You never know when the sea\'s going to change its mind.', 'Go on. Bring your mother down off that hill.']);
    }
    return s.say('Fisher Tobias', ['Go see Brisa, see the house. Then go ask those soldiers what they think they\'re guarding.', 'Come tell me what they say. I\'ve got thoughts, but I\'d like to be wrong first.']);
  },

  async soldiers(s) {
    if (s.flag('c5_bluff')) return;
    if (s.flag('c5_soldiers')) {
      await s.say('Vesper Sergeant', 'Still closed, girl. Still orders.');
      await s.step('player', 0, 1);
      return;
    }
    s.setFlag('c5_soldiers');
    s.music('tension');
    spawnParty(s, { ilse: [30, 12, 'up'], bram: [31, 12, 'up'], sable: [29, 11, 'up'], pip: [32, 12, 'up'], corvin: [29, 12, 'up'] });
    await s.say('Vesper Sergeant', 'Halt. By order of Lord-Commander Thorne, the hill road is closed for the duration of the harmonization.');
    await s.say('Wren', 'My mother is up there. I\'m the Keeper\'s daughter.');
    await s.say('Vesper Sergeant', '...Then especially not you. Orders.');
    await s.say('Bram', 'Sergeant. What\'s the Lord-Commander afraid of? Five tired children and a pirate?');
    await s.say('Corvin', 'Privateer.');
    await s.say('Vesper Sergeant', 'He said you\'d say something like that, Kestrel. He said to tell you: "Go home."');
    await s.wait(0.6);
    await s.say('Bram', '_(quietly)_ ...I\'m trying.');
    await s.say('Ilse', 'Wren. Three things. One: there are at least twenty of them on that hill. Two: they\'re rested and we aren\'t. Three: your mother is at the top, and a fight would bring the whole Dawnguard down on her.');
    await s.say('Wren', 'Then we don\'t fight our way up. There\'s always another way. There has to be.');
    await s.say('Pip', 'Every rich man\'s house has a back door. Every single one. That\'s, like, the first thing they teach you.');
    await s.say('Wren', 'Tobias. Tobias knows every inch of this island.');
    removeParty(s);
    s.music('lanternfall');
    await s.step('player', 0, 1);
    s.objective('Ask Fisher Tobias (down at the docks) for another way up to the Lantern.');
  },

  async soldierTalk(s) {
    if (s.flag('c5_bluff')) {
      await s.say('Vesper Sergeant', '...How did you get up THERE?');
      await s.say('Pip', 'Magic. Also stairs.');
      return;
    }
    return s.say('Vesper Sergeant', 'Hill road\'s closed. Go home, girl. Watch the sunset like everyone else.');
  },

  // ------------------------------------------------------------------ the Halloway house
  async houseEnter(s) {
    if (s.flag('c5_house')) return;
    s.setFlag('c5_house');
    s.music('sad');
    await s.wait(0.4);
    await s.think('Wren', 'It smells like home. Salt and woodsmoke and Mom\'s awful lavender soap.');
    await s.think('Wren', 'There\'s a letter on the table. With my name on it.');
  },

  async letter(s) {
    if (s.flag('c5_letter')) {
      return s.narrate('Two plates. And your mother\'s letter, folded back along its creases. You don\'t need to read it again. You read it again anyway.');
    }
    s.setFlag('c5_letter');
    await s.narrate('Two plates on the table, as always. Between them, a letter, in your mother\'s narrow, careful hand.');
    await s.say('Ysolde', [
      '_Little bird —_',
      '_If you\'re reading this, you came home. I knew you would. You never could leave a door alone._',
      '_Stay in the house. Whatever you hear, whatever the sky does, stay in the house. I\'ll come down when it\'s over._',
      '_There\'s bread in the box. It isn\'t as good as Nana\'s._',
      '_— Mom_',
      '_P.S. I\'m proud of you. I should have said it at the dock._',
    ], { portrait: false });
    await s.wait(0.8);
    await s.think('Wren', '...She\'s never said that. Not once.');
    await s.think('Wren', 'Stay in the house. Sure, Mom. That\'s exactly what I\'ll do.');
    s.journal('Mom left me a letter. She told me to stay in the house. She said she\'s proud of me. She\'s never said that before.');
  },

  async breadBox(s) {
    if (s.flag('c5_bread')) return s.narrate('The bread box. Empty now, except for crumbs.');
    s.setFlag('c5_bread');
    await s.narrate('The bread box. Inside, a heavy, slightly burnt loaf wrapped in a cloth. It is not as good as Nana\'s. It never has been.');
    await s.give('c5_ysolde_bread', 2);
  },

  async cassianLetters(s) {
    await s.narrate([
      'Your father\'s books — and on top of them, a bundle of letters tied with string. The Choir\'s sunburst on every seal. Cassian\'s letters. To you.',
      'Your mother has read them all. In the margins, in her small hand, there are notes. Not angry ones. Careful ones. Like a Keeper reading weather.',
      'Beside the line _"You have a restless heart, Wren, like mine"_ she has written only: _That is what I am afraid of._',
    ]);
  },

  // ------------------------------------------------------------------ Nana Brisa & the tea
  async nana(s) {
    if (!s.flag('c5_nana')) return CH5.nanaReunion(s);
    if (s.flag('c5_tea_done')) {
      return s.say('Nana Brisa', ['Go on, my darlings. Go and bring Ysolde down off that hill.', 'And Ilse — keep your scarf on. Whatever the sky is doing, it\'s doing it in a draught.']);
    }
    if (s.has('sea_lavender')) return CH5.teaScene(s);
    return s.say('Nana Brisa', ['Sea lavender, love. Just one sprig. It grows in the tide-cave pools — or there\'s the one in Ysolde\'s garden, if it ever deigned to flower.']);
  },

  async nanaReunion(s) {
    s.setFlag('c5_nana');
    s.music('lanternfall');
    spawnParty(s, { ilse: [4, 5, 'up'], sable: [6, 5, 'up'], bram: [3, 6, 'up'], pip: [5, 6, 'up'], corvin: [7, 6, 'up'] });
    await s.say('Nana Brisa', 'Ilse? ...Ilse!');
    s.face('nana', 'c_ilse');
    await s.move('nana', [[4, 4]], 3);
    await s.narrate('Nana Brisa crosses the room faster than a woman her age has any right to and holds Ilse very tight for a very long time.');
    await s.say('Nana Brisa', 'Let me look at you. You\'ve grown.');
    await s.say('Ilse', 'I\'ve been gone two months, Nana. I haven\'t grown.');
    await s.say('Nana Brisa', 'You have. Around the eyes.');
    await s.wait(0.5);
    await s.say('Nana Brisa', 'And my duck from the sea! Have you been eating?');
    await s.say('Sable', 'I ate a pie in Aurenne. There was a bird in it. I was very surprised.');
    await s.say('Nana Brisa', 'And who\'s this scrap?');
    await s.say('Pip', 'Pip. And I ain\'t a scrap.');
    await s.say('Nana Brisa', 'We\'re all scrap, love. Sit down, I\'ll feed it. And you — the tall one with the hat and the guilty face?');
    await s.say('Corvin', 'Just the driver, ma\'am.');
    await s.say('Nana Brisa', 'You\'ve got a hungry look. Sit.');
    await s.say('Ilse', 'Nana. The sun—');
    await s.say('Nana Brisa', 'I know, dear. I\'ve been watching it from the step since yesterday noon. It isn\'t right.');
    await s.say('Nana Brisa', 'So I\'ve done the only thing I know how to do when things aren\'t right. I\'m making tea.');
    await s.say('Ilse', '...Of course you are.');
    await s.say('Nana Brisa', 'Kindling tea. Your great-grandmother brewed it the night before every hard thing. Only I\'m short the sea lavender.');
    await s.say('Nana Brisa', 'It grows in the tide-cave pools, and those are full of nasty things this week. The only other sprig on the island is in Ysolde\'s garden, and that plant has never once flowered.');
    await s.say('Ilse', 'We\'ll find you some, Nana.');
    await s.move('nana', [[4, 3]], 2);
    s.face('nana', 'down');
    removeParty(s);
    s.quest('c5_tea', 'Kindling Tea', 'Nana Brisa wants one sprig of sea lavender for her Kindling tea — the brew the Halloways drank before every hard thing. It grows in the tide-cave pools. Or in Ysolde\'s garden, if it ever flowered.');
    s.objective('Find a way up to the Lantern. (Optional: bring Nana Brisa a sprig of sea lavender.)');
  },

  async garden(s) {
    if (s.flag('c5_lavender_picked')) return s.narrate('Your mother\'s herb garden. Where the sea lavender was, there\'s a small torn stem.');
    if (!s.flag('c5_nana')) return s.narrate('Your mother\'s herb garden. Rosemary, thyme — and the sea lavender. It has flowered. After seven years of nothing, today, of all days, it has flowered.');
    await s.narrate('Your mother\'s herb garden. The sea lavender that never once flowered has flowered. Seven years of nothing — and today, of all days, a spray of tiny violet stars.');
    const pick = await s.confirm('Pick a sprig for Nana Brisa\'s tea?', 'Pick it', 'Leave it');
    if (!pick) return;
    s.setFlag('c5_lavender_picked');
    await s.give('sea_lavender');
    await s.think('Wren', 'Sorry, Mom. You can yell at me when you come down.');
  },

  async poolLavender(s) {
    if (s.has('sea_lavender') || s.flag('c5_tea_done') || !s.flag('c5_nana')) {
      return s.narrate('A tide pool, black and still. Something purple glimmers on the bottom and is gone.');
    }
    await s.narrate('In a crack at the edge of the pool, a stubborn little clump of sea lavender has found something to hold on to.');
    await s.give('sea_lavender');
  },

  async teaScene(s) {
    s.setFlag('c5_tea_done');
    await s.take('sea_lavender');
    s.music('sad');
    spawnParty(s, { ilse: [3, 4, 'right'], sable: [5, 5, 'up'], bram: [2, 5, 'right'], pip: [6, 4, 'left'], corvin: [7, 5, 'left'] });
    s.place('player', 4, 5, 'up');
    await s.say('Nana Brisa', 'Ah. There it is. Give it here.');
    await s.wait(0.6);
    await s.narrate('The kettle sings. Nana Brisa crumbles the lavender into the pot with her fingers, the way her mother did, and the whole house smells, for a moment, like the beach on a good day.');
    await s.say('Nana Brisa', 'Drink. It tastes like a beach and a hug.');
    await s.say('Pip', 'It tastes like a beach.');
    await s.say('Nana Brisa', 'Keep drinking.');
    await s.wait(0.6);
    await s.say('Pip', '...Okay that\'s a hug.');
    await s.say('Bram', 'My mother made something like this. The night before my knighting trial. I drank three cups and then I—');
    await s.wait(0.6);
    await s.say('Bram', 'It was good tea.');
    await s.say('Corvin', 'Haven\'t had tea since the Dawnguard. We used to put rum in it.');
    await s.say('Nana Brisa', 'I put rum in it.');
    await s.say('Corvin', '...Marry me.');
    await s.say('Nana Brisa', 'Drink your tea.');
    await s.say('Sable', 'Everyone is holding a warm cup at the same time. Is this a ceremony?');
    await s.say('Ilse', 'It\'s... yes. Sort of.');
    await s.say('Sable', 'I like it. I want to remember it.');
    await s.wait(0.6);
    await s.say('Ilse', 'Nana. When this is over, I\'m coming home. For good.');
    await s.say('Nana Brisa', 'No, you\'re not.');
    await s.say('Ilse', 'I— what?');
    await s.say('Nana Brisa', 'You\'re going to be a great Mender somewhere much bigger than this island. And you\'ll write to me twice a week in your tidy little letters, and I\'ll pretend I can read them.');
    await s.say('Ilse', '...Nana.');
    await s.say('Nana Brisa', 'And you, little Halloway. You haven\'t touched yours.');
    await s.say('Wren', 'Sorry.');
    await s.say('Nana Brisa', 'Your mother drank this the night before her Kindling. And the night before her wedding. And the night your father didn\'t come home.');
    await s.say('Wren', '...Did it help?');
    await s.say('Nana Brisa', 'No. But she wasn\'t alone while she drank it.');
    await s.wait(1.0);
    await s.narrate('You drink your tea.');
    await s.give('c5_kindling_tea', 3);
    await s.say('Nana Brisa', 'Take the rest of the pot with you. Corked. For later.');
    removeParty(s);
    s.music('lanternfall');
    s.quest('c5_tea', null, null, 'done');
    s.journal('We drank Nana\'s Kindling tea, all six of us. Corvin proposed to her. Nana told Ilse she\'s not allowed to come home and waste herself on this island.');
  },

  // ------------------------------------------------------------------ Pell and the sword
  async pell(s) {
    if (s.flag('c5_pell_lesson')) {
      return s.say('Pell', ['Rule one: be scared. Rule two: do it anyway.', 'I\'m being scared REALLY good, Bram!']);
    }
    s.setFlag('c5_pell_lesson');
    spawnParty(s, { bram: [24, 18, 'right'], pip: [24, 19, 'up'] });
    await s.say('Pell', 'Wren! You\'re back! Is that BRAM? Bram, teach me to fight! I\'m getting Vanguard when I\'m sixteen, I know I am.');
    await s.say('Bram', 'Ah. Well. A lesson. Yes. Ahem.');
    await s.say('Bram', 'Rule one of swordsmanship, young Pell: be scared.');
    await s.say('Pell', 'What? That\'s not a rule!');
    await s.say('Bram', 'It\'s the first rule. Everyone\'s scared. The ones who say they aren\'t are lying, or they\'re about to do something very stupid.');
    await s.say('Pell', 'What\'s rule two?');
    await s.say('Bram', '...Rule two is, do it anyway.');
    await s.wait(0.6);
    await s.say('Pip', 'That\'s a good rule. Where\'d you get that rule?');
    await s.say('Bram', 'From a man who was better at it than me.');
    await s.say('Pell', 'Here — I found this on the beach. For the lesson. It\'s probably magic.');
    await s.give('swift_fruit');
    removeParty(s);
  },

  // ------------------------------------------------------------------ the inn: Squire Toller
  async toller(s) {
    if (s.flag('c5_toller')) return s.say('Squire Toller', ['I\'m sick tonight, Kestrel. Very sick. Can\'t possibly stand a watch on any hill.', '...Good luck.']);
    s.setFlag('c5_toller');
    await s.say('Squire Toller', 'Bram Kestrel. The Lord-Commander said you\'d turn up.');
    await s.say('Bram', 'Toller! Look at you — you got your spurs!');
    await s.say('Squire Toller', 'Got \'em. Wish I hadn\'t, tonight.');
    await s.say('Squire Toller', 'Forty men on that hill, Bram, and every one of us heard what came out of the Lantern this morning. Nobody\'s saying it. But that\'s not a hymn. I grew up on hymns. That\'s something else.');
    await s.say('Bram', 'Then come with us.');
    await s.say('Squire Toller', 'I\'m not brave enough for that. I\'m brave enough for this, though.');
    await s.narrate('He pushes his field kit across the table.');
    await s.give('ember_feather', 2);
    await s.give('hi_ether', 2);
    await s.say('Squire Toller', 'I\'m sick tonight. Very sick. Can\'t possibly stand a watch on any hill. Go on.');
  },

  // ================================================================== the Tide Caves
  async cavesEnter(s) {
    if (s.flag('c5_caves')) return;
    s.setFlag('c5_caves');
    spawnParty(s, { ilse: [2, 15, 'right'], sable: [2, 17, 'right'], bram: [1, 15, 'right'], pip: [3, 16, 'right'], corvin: [1, 17, 'right'] });
    await s.wait(0.4);
    await s.say('Ilse', 'It smells like low tide and bad decisions.');
    await s.say('Wren', 'It smells like—');
    await s.wait(0.8);
    await s.say('Wren', '...It doesn\'t smell like adventure anymore.');
    await s.narrate('Violet light seeps out of the rock. Somewhere deep in the caves, something is humming. Low. Like a man in the next room, singing to himself.');
    await s.say('Sable', 'The Gloam is close here. Closer than it was. It is coming up through the stone like water through a boat.');
    removeParty(s);
    s.objective('Find the sealed bottom of the Keeper\'s Stair at the back of the Tide Caves.');
  },

  async crystal(s) {
    if (s.flag('c5_tidemourner')) return;
    s.music('gloam');
    spawnParty(s, { ilse: [36, 22, 'down'], sable: [38, 22, 'down'], bram: [35, 21, 'down'], pip: [37, 21, 'down'], corvin: [39, 21, 'down'] });
    s.place('player', 37, 23, 'down');
    await s.pan(38, 27, 1.2);
    await s.narrate('The violet crystal at the back of the cave has grown. It fills the passage now like a frozen wave, taller than Bram, veined with slow light.');
    await s.say('Ilse', 'That\'s the one. From before. It was the size of my fist.');
    await s.wait(0.8);
    await s.say('???', '_...Wren? Little bird?_', { speed: 0.6, portrait: false });
    await s.emote('player', '!');
    await s.say('???', '_...is the tide in? I can\'t... I can\'t see the light from here...._', { speed: 0.6, portrait: false });
    await s.say('Wren', '...Dad?');
    await s.say('Ilse', 'Wren. That isn\'t— Wren, that isn\'t him.');
    await s.say('???', '_Sing me the gull one, little bird. I forgot how it ends._', { speed: 0.6, portrait: false });
    await s.move('player', [[37, 25], [38, 26]], 1.4);
    await s.say('Ilse', 'Wren, you PROMISED. You promised me you\'d never touch it—');
    await s.wait(0.6);
    await s.narrate('You touch it.');
    s.flash('#b080ff', 0.6);
    s.shake(0.4, 1.2);
    s.sfx('dark');
    await s.narrate('The crystal cracks down the middle like ice on a pond. And out of the crack pours everything the sea has ever taken from Lanternfall — oilskins and nets and drowned lanterns and hands, so many hands — knotted together into something that wears them like a coat.');
    await s.say('Sable', 'It\'s not him. It\'s a memory of a memory. The Gloam remembers everything — it just remembers it wrong.');
    await s.say('Bram', 'Behind me! Everyone behind me!');
    const r = await s.battle('c5_boss_tidemourner', { bg: 'tidecave' });
    if (r !== 'win') return;
    s.setFlag('c5_tidemourner');
    s.clearBlocker('c5_crystal');
    s.music('cave');
    await s.narrate('The thing comes apart into seawater and old rope and is gone. The voice goes with it.');
    await s.wait(0.6);
    await s.say('Wren', '...It sounded like him. It sounded exactly like him.');
    await s.say('Ilse', 'You promised.');
    await s.say('Wren', 'I know.');
    await s.say('Corvin', 'Ladies. Later. There\'s a staircase where the rock used to be.');
    await s.follow(0.6);
    removeParty(s);
    s.objective('Climb the Keeper\'s Stair to the Lantern.');
    s.journal('The crystal in the tide caves spoke with Dad\'s voice. I touched it. I promised Ilse I never would. Behind it: the Keeper\'s Stair.');
  },

  // ================================================================== the Keeper's Stair
  async stairEnter(s) {
    if (s.flag('c5_stair')) return;
    s.setFlag('c5_stair');
    await s.wait(0.3);
    await s.narrate('Steps, cut by hand into the living rock. Worn into shallow bowls by four hundred years of Keepers\' feet. They go up, and up, into the dark.');
    await s.think('Wren', 'Mom\'s at the top of these. Mom, and him.');
  },

  async lamp(s, symbol) {
    if (s.flag('c5_gate_open')) return s.narrate('A bronze lamp, burning steadily. The gate beyond stands open.');
    const order = ['wave', 'stone', 'star'];
    const lit = s.vars.c5_lamps || [];
    if (lit.includes(symbol)) return s.narrate('This lamp is already burning.');
    const label = { star: 'a single star', wave: 'a curling wave', stone: 'a plain, square stone' }[symbol];
    await s.narrate(`A bronze lamp on a stone pedestal. Carved on its bowl: ${label}.`);
    if (!(await s.confirm('Light the lamp?', 'Light it', 'Leave it'))) return;
    lit.push(symbol);
    s.vars.c5_lamps = lit;
    s.sfx('holy');
    if (lit.some((v, i) => v !== order[i])) {
      s.vars.c5_lamps = [];
      s.sfx('cancel');
      await s.narrate('The flame catches — then shivers, and every lit lamp in the hall gutters out at once, as if someone had sighed.');
      return;
    }
    await s.narrate('The flame catches and holds, a small steady gold.');
    if (lit.length === order.length) {
      s.setFlag('c5_gate_open');
      s.clearBlocker('c5_gate');
      s.flash('#ffe8b0', 0.5);
      await s.narrate('All three lamps flare together. With a long groan of old bronze, the gate at the head of the hall swings open.');
    }
  },

  async gateWords(s) {
    await s.narrate([
      'A gate of green bronze bars. Above it, words cut deep into the lintel:',
      '_FIRST THE SEA THAT TAKES THEM._',
      '_THEN THE STONE THAT KEEPS THEM._',
      '_LAST THE SKY THAT CALLS THEM HOME._',
    ]);
    if (!s.flag('c5_gate_open')) await s.think('Wren', 'The sun. It\'s about the sun. The sea takes it every night, the Lantern\'s stone keeps it, and every morning the sky calls it home.');
  },

  async carving(s) {
    await s.narrate([
      'Low on the wall, scratched with something that was probably a fish-knife, in three very different hands:',
      '_EDRIN + TOBY + FEN WERE HERE_',
      'And underneath, in a fourth hand, small and furious: _AND NOW THEY ARE SCRUBBING THE STAIR. — I. HALLOWAY, KEEPER_',
    ]);
    if (!s.flag('c5_carving')) {
      s.setFlag('c5_carving');
      await s.think('Wren', 'Grandma Ide. She caught them. ...Dad was eleven. He carved his name on the wall and got made to scrub four hundred years of stairs.');
      await s.think('Wren', 'Edrin, Toby... and Fen. Whoever Fen is.');
    }
  },

  // ================================================================== the bluff
  async bluff(s) {
    if (s.flag('c5_bluff')) return;
    s.setFlag('c5_bluff');
    s.music('tension');
    spawnParty(s, { ilse: [11, 3, 'down'], sable: [13, 3, 'down'], bram: [11, 4, 'down'], pip: [13, 4, 'left'], corvin: [12, 4, 'down'] });
    await s.wait(0.4);
    await s.narrate('You come up out of the rock into red light. The bluff. The Lantern, huge and close, humming so loudly now that the grass shivers with it.');
    await s.narrate('Far below, the whole Western Sea lies still as a plate. Not a ripple. And on its edge, the sun, waiting.');
    await s.say('Corvin', 'Whatever he\'s doing, he\'s nearly done. You can feel it. Like the air before a bell.');
    await s.say('Bram', 'Whatever happens in there — I\'m first through the door. That\'s the job.');
    await s.say('Pip', 'Since when?');
    await s.say('Bram', 'Since just now. I\'ve decided.');
    await s.say('Sable', 'Wren. If he sings, I think I will hear it. I think I have heard it before.');
    await s.say('Wren', 'Then we stop him before he sings.');
    removeParty(s);
    s.objective('Enter the Lantern.');
    s.journal('We climbed the Keeper\'s Stair to the bluff. The Lantern is humming like a bell about to be struck.');
  },

  async lanternDoor(s) {
    if (s.flag('c5_ready')) return;
    await s.narrate('The Lantern\'s door. Behind it, the hum — and your mother.');
    const go = await s.confirm('Go inside? _(There will be no turning back.)_', 'Go in', 'Not yet');
    if (!go) { await s.step('player', 0, 1); return; }
    s.setFlag('c5_ready');
    await s.teleport('ch5_lantern', 7, 11, 'up');
  },

  // ================================================================== the Lantern
  async lantern(s) {
    if (s.flag('c5_lantern')) return;
    s.setFlag('c5_lantern');
    s.stopMusic(0.5);
    s.spawn('ysolde_l', 'ysolde', 7, 3, 'down');
    s.spawn('cassian', 'cassian', 9, 4, 'left');
    s.spawn('garrick', 'garrick', 7, 7, 'down');
    s.spawn('knight1', 'vesper_soldier', 6, 8, 'down');
    s.spawn('knight2', 'vesper_soldier', 8, 8, 'down');
    spawnParty(s, { ilse: [6, 11], bram: [8, 11], sable: [5, 12], pip: [9, 12], corvin: [7, 12] });
    s.place('player', 7, 10, 'up');
    await s.pan(7, 6, 0.1);
    await s.wait(0.8);
    await s.narrate('Inside, the hum is everywhere. In the stones. In your teeth. In the little bones of your ears.');
    await s.say('Cassian', 'Wren.', { speed: 0.6 });
    await s.say('Cassian', 'You came home. I hoped you would. I\'m sorry it had to be the hard way up.');
    s.music('cassian');
    await s.say('Garrick', 'I told the gate to turn you back.');
    await s.say('Garrick', 'Holiness. These are the children who cut through forty of my men between Saltglass and Greyspine.');
    await s.say('Cassian', 'Then perhaps you should stop sending men at children, Garrick.');
    await s.say('Ysolde', 'Wren. Go home. Go home right now.');
    await s.say('Wren', 'I read your letter.');
    await s.wait(0.8);
    await s.say('Ysolde', '...Then you know I meant it.');
    await s.say('Wren', 'I\'m not leaving you up here with him.');
    await s.say('Garrick', 'The Hierophant is too gentle with you, girl. I\'m not.');
    await s.move('c_bram', [[8, 10], [8, 9]], 2.4);
    await s.say('Bram', 'Lord-Commander.');
    await s.say('Garrick', 'Kestrel. Still carrying a sword you never earned?');
    await s.say('Bram', 'I am here to— to adjudicate you, Lord-Commander.');
    await s.say('Corvin', 'He means fight.');
    await s.say('Bram', 'I mean fight.');
    await s.say('Cassian', 'Garrick—');
    await s.say('Garrick', 'With respect, Holiness. You need the girl. You don\'t need the rest of them.');
    const r = await s.battle('c5_boss_garrick', { bg: 'lantern' });
    if (r !== 'win') return;
    s.music('cassian');
    await s.narrate('Garrick goes down on one knee, breathing hard, his greatsword ringing on the stones.');
    await s.say('Garrick', '...Kestrel. You didn\'t freeze.');
    await s.say('Bram', '...No. Huh. I didn\'t.');
    await s.wait(0.6);
    await s.say('Cassian', 'Enough. Please.');
    await s.narrate('Cassian lifts a slender silver tuning fork — the same make as the ones you carried across the whole of Solmere — and touches it, very gently, to the brass of the great lamp.');
    s.flash('#fff0c0', 0.8);
    s.sfx('holy');
    s.shake(0.2, 1.2);
    await s.narrate('The hum becomes a NOTE. Every Lantern in the world rings at once — you can feel them, far away, Saltglass, Frosthollow, Mirefen, Thornwood, Skyreach, Aurenne — six voices in a chord with one missing.');
    await s.narrate('And the chord holds everyone still.');
    for (const id of CAST) await s.emote(`c_${id}`, '…', 0.25);
    await s.say('Corvin', 'Can\'t... move... that\'s new...');
    await s.say('Sable', 'It\'s— it\'s the song. The one from the water. The one I came out of—');
    await s.move('knight1', [[6, 10]], 2);
    await s.move('knight2', [[8, 10]], 2);
    await s.say('Cassian', 'Not you, Wren. Never you. Lanternfall\'s light knows its own.');
    await s.move('cassian', [[9, 5], [8, 5], [8, 6]], 1.4);
    s.face('cassian', 'player');
    await s.move('player', [[7, 8], [7, 7]], 1.4);
    s.face('player', 'right');
    await s.say('Cassian', 'I promised myself I would never lie to you. I\'m not going to start tonight.');
    await s.say('Cassian', 'When I was twelve, the Lantern of Aurenne failed for a single night. The Gloam came into the city. It took my sister. Lysa. She was ten.');
    await s.say('Cassian', 'She had a yellow ribbon in her hair. She\'d lost the other one that morning. She was so angry about it.');
    await s.say('Cassian', 'My father was the Keeper. He could hold the light on the Lantern, or he could go down into the dark after her. He chose the light.');
    await s.say('Cassian', 'Everyone said he chose right.');
    await s.wait(1.0);
    await s.say('Cassian', 'I have spent forty years writing a song, Wren. The Dawnsong, sung backward through all seven Lanterns at once. The Vespersong.');
    await s.say('Cassian', 'It doesn\'t call the sun up. It holds it still. One perfect moment, kept. Forever. Evernoon.');
    await s.say('Cassian', 'And in Evernoon, no one is lost. The Gloam keeps every memory of every soul it ever took. I have heard them, Wren. I have heard Lysa singing in the dark.');
    await s.say('Cassian', 'The Vespersong pulls them back out. Whole. Not echoes. Not that poor drowned thing in your tide caves. _Whole._');
    await s.say('Cassian', 'Lysa. Brother Halvard. Sir Aldous.');
    await s.say('Bram', '_(through his teeth)_ ...Don\'t.');
    await s.say('Cassian', 'Your father.');
    await s.wait(1.0);
    await s.say('Wren', '...Dad?');
    await s.say('Cassian', 'Edrin Halloway, who went out in a storm and didn\'t come home. Who used to sing you the one about the gull that flew past the edge of the map.');
    await s.say('Wren', 'How do you know that?');
    await s.say('Cassian', 'You wrote me. You were twelve. It was the best letter I have ever received.');
    await s.say('Ysolde', 'That\'s why you wrote to her. Four years of letters.');
    await s.say('Cassian', 'I wrote to her because she wrote to me, and her letters were the best part of my year. Both things are true, Ysolde. They usually are.');
    await s.say('Cassian', 'The Dawnstones answer only to their Keepers. Some gave me theirs. Some I... collected. I am not proud of all of it.');
    await s.say('Cassian', 'The seventh answers to your mother. Or to her blood.');
    await s.say('Wren', 'The forks. The forks we carried. That\'s what they were for.');
    await s.say('Cassian', 'Yes. You tuned the whole world for me, Wren. You did it beautifully.');
    await s.say('Wren', 'You used me.');
    await s.say('Cassian', 'I asked you. You said yes. I\'m asking again.');
    await s.wait(0.8);
    await s.say('Ysolde', 'He\'s offering you a painting of your father, Wren. A painting that talks.');
    s.face('player', 'up');
    await s.say('Wren', 'And what did YOU offer him?!');
    await s.say('Wren', 'The night of the storm. I was up here. I was nine and I was hiding on the stairs and I SAW you. You turned the light. Away from his boat. Toward the harbor.');
    await s.wait(1.6);
    await s.say('Ysolde', '...Yes.', { speed: 0.5 });
    await s.say('Ysolde', 'Thirty boats were out that night, Wren. I turned the light toward thirty boats.');
    await s.say('Wren', 'And Dad was the thirty-first.');
    await s.wait(1.0);
    await s.say('Ysolde', '...Your father was the thirty-first.', { speed: 0.6 });
    await s.say('Ysolde', 'I\'ve turned that light a thousand times since. Every night. In my head. It never comes out different.');
    await s.wait(1.2);
    await s.say('Cassian', '_(softly)_ Your mother let him go, Wren. She will let you go too, someday.');
    await s.say('Cassian', 'I never will.');
    await s.wait(1.4);
    await s.say('Ysolde', 'I won\'t stop you. I never could. I\'m asking you. Please.');
    await s.move('ysolde_l', [[6, 3]], 1.2);
    s.face('ysolde_l', 'right');
    await s.say('Ilse', 'Wren.');
    s.face('player', 'down');
    await s.say('Ilse', 'You promised. On the ship. You said if he made you want to give it to him, you\'d look at me first.');
    await s.say('Ilse', 'So look at me. _Look at me._');
    await s.wait(1.4);
    await s.narrate('You look at her. You do. For a long moment.');
    await s.narrate('Then you turn around.');
    await s.move('player', [[7, 6], [7, 5], [7, 4], [7, 3]], 1.0);
    s.face('player', 'up');
    await s.wait(0.6);
    await s.narrate('The great lamp of Lanternfall. Inside the glass, the Dawnstone sleeps in its bed of brass, like a small sun. Warm as a hand.');
    const c = await s.choice(['Take the Dawnstone.', '...Step back.'], { prompt: 'The Dawnstone is warm under your palm.' });
    if (c === 1) {
      s.setFlag('c5_hesitated');
      await s.narrate('You take your hand away.');
      await s.wait(0.6);
      await s.narrate('Behind you, your mother lets out a breath she has been holding for seven years.');
      await s.wait(1.2);
      await s.say('Cassian', '...Do you remember how the gull song ends, Wren? I don\'t. You never wrote that part down.');
      await s.say('Wren', '_"...and the gull flew on past the edge of the map, and the map grew to—"_', { speed: 0.7 });
      await s.wait(1.2);
      await s.say('Wren', '...I don\'t remember either.', { speed: 0.6 });
      await s.say('Wren', 'He would.');
      await s.say('Ysolde', 'Wren—');
      await s.say('Wren', 'I\'m sorry, Mom.');
    }
    s.flash('#ffe8b0', 0.6);
    s.sfx('revive');
    await s.narrate('It comes away in your hand like it was waiting for you.');
    s.flash('#140820', 1.0);
    s.shake(0.35, 1.4);
    s.sfx('dark');
    s.stopMusic(0.3);
    await s.narrate('The Lantern goes dark.');
    await s.say('Sable', 'NO—!', { speed: 1.4 });
    await s.say('Sable', 'It isn\'t a dawn— it isn\'t a DAWN— I was inside it, I was INSIDE the song, it\'s a stopping, it\'s a STOPPING—');
    await s.say('Ilse', 'Wren. Wren, please. Please put it back. Please.');
    await s.say('Pip', 'Wren, c\'mon— this is a con, I know a con, I practically invented cons—');
    await s.say('Bram', 'Wren!');
    await s.say('Corvin', '_(quietly)_ ...Ah, sparrow.');
    await s.move('player', [[7, 4], [7, 5]], 1.2);
    s.face('player', 'right');
    await s.move('cassian', [[8, 5]], 1.2);
    s.face('cassian', 'left');
    await s.narrate('You hold it out. He takes it the way you would take a sleeping bird.');
    await s.say('Cassian', 'Thank you.');
    await s.say('Cassian', 'Come and watch, Wren. You, of everyone, should see it.');
    await Promise.all([
      s.move('cassian', [[8, 9], [7, 9], [7, 12]], 1.8),
      s.move('garrick', [[7, 9], [7, 12]], 1.6),
      s.move('knight1', [[6, 12]], 1.6),
      s.move('knight2', [[8, 12]], 1.6),
    ]);
    ['cassian', 'garrick', 'knight1', 'knight2'].forEach((id) => s.remove(id));
    s.flash('#ffffff', 0.3);
    await s.say('Ysolde', 'Cassian!');
    await s.move('ysolde_l', [[6, 5], [6, 9], [7, 12]], 3.2);
    s.remove('ysolde_l');
    await s.narrate('The note lets go of them. Bram stumbles. Pip sits down hard on the floor. Sable is shaking.');
    s.face('c_ilse', 'left');
    await s.narrate('Ilse will not look at you.');
    await s.say('Corvin', '...Well. Let\'s go see the end of the world, then.');
    await s.say('Pip', 'That ain\'t funny.');
    await s.say('Corvin', 'Wasn\'t joking, kid.');
    s.setFlag('c5_gave');
    s.journal('I gave Cassian the Dawnstone. Mom asked me not to. Ilse begged me. Sable screamed. I did it anyway.');
    await s.fadeOut(1.2);
    removeParty(s);
    await s.teleport('lf_sunset', 10, 6, 'left');
  },

  // ================================================================== the Vespersong
  async vespersong(s) {
    if (s.flag('c5_sunset')) return;
    s.setFlag('c5_sunset');
    s.stopMusic(0.1);
    s.spawn('cassian', 'cassian', 4, 5, 'left');
    s.spawn('garrick', 'garrick', 5, 3, 'left');
    s.spawn('knight1', 'vesper_soldier', 4, 3, 'left');
    s.spawn('ysolde_v', 'ysolde', 8, 6, 'left');
    spawnParty(s, { ilse: [11, 6, 'left'], bram: [10, 7, 'left'], sable: [9, 7, 'left'], pip: [11, 7, 'left'], corvin: [12, 6, 'left'] });
    s.place('player', 10, 6, 'left');
    await s.pan(6, 5, 0.1);
    await s.wait(1.0);
    await s.narrate('The whole of Lanternfall has come out onto the step to watch. You can see them from up here, little shapes in every doorway, all facing west.');
    await s.say('Cassian', 'Look at it. All of you. Don\'t look away. This is the last sunset anyone will ever have to watch end.');
    await s.say('Ysolde', 'Cassian. Please. You know what a world is. It\'s a thing that _moves._');
    await s.say('Cassian', 'So is a wound, Ysolde.');
    await s.wait(0.8);
    s.music('evernoon');
    await s.narrate('He lifts the Dawnstone toward the sun. And he begins to sing.');
    await s.say('Cassian', [
      '_Morning, morning, do not wake—_',
      '_Stay the hour and stay the light—_',
      '_Keep the ones you would not take—_',
      '_Hold them, hold them, hold them bright—_',
    ], { speed: 0.6 });
    s.flash('#fff4d0', 0.6);
    await s.narrate('Far to the east, six lights answer. You can feel the chord close, like a hand.');
    await s.narrate('And the sun — sitting on the very edge of the sea — stops.');
    await s.wait(1.0);
    await s.narrate([
      'Not slows. _Stops._',
      'A gull hangs over the harbor with its wings half-open and does not finish the beat. A wave stands up on the black rocks and stays there, like green glass.',
      'Everything is gold. Everything is still. It is the most beautiful thing you have ever seen.',
      'Somewhere very far away — and very close — a man laughs. A big, warm, salty laugh you have not heard in seven years.',
    ]);
    await s.say('Wren', '...Dad?', { speed: 0.6 });
    await s.wait(1.2);
    s.stopMusic(0.2);
    await s.wait(0.6);
    s.sfx('quake');
    s.shake(0.5, 2.0);
    s.flash('#ffffff', 0.5);
    await s.narrate('Then the sun cracked.');
    await s.narrate('A line of white fire runs across its face. Then another. Then seven.');
    s.flash('#ffd0a0', 0.8);
    s.sfx('burst');
    await s.narrate('The sun comes apart like a plate dropped on a stone floor — slowly, then all at once — seven burning pieces wheeling away into a sky that is suddenly the wrong color.');
    s.shake(0.6, 2.4);
    await s.narrate('And the Western Sea, which had been holding its breath since noon yesterday, lets go.');
    await s.narrate('Upward.');
    await s.narrate('It lifts off the world like a sheet off a bed, and falls into the sky.');
    await s.say('Cassian', '...No. No, that isn\'t— the measure was right. The measure was _right_—', { speed: 0.8 });
    s.flash('#fff8e0', 1.0);
    s.sfx('holy');
    await s.narrate('A pillar of white light comes down on the edge of the bluff, and takes Cassian, and Garrick, and the Dawnstone, up and east. And they are gone.');
    s.remove('cassian');
    s.remove('garrick');
    s.remove('knight1');
    s.setFlag('c5_sundering');
    s.setFlag('c5_ready', false);
    s.setFlag('c5_homes', false);
    await s.fadeOut(1.6, '#ffffff');
    removeParty(s);
    s.remove('ysolde_v');
    await s.teleport('lf_sunset', 10, 6, 'left', { color: '#ffffff' });
  },

  // ================================================================== Ysolde's choice
  async aftermath(s) {
    if (s.flag('c5_aftermath')) return;
    s.setFlag('c5_aftermath');
    s.stopMusic(0.1);
    s.spawn('ysolde_v', 'ysolde', 8, 6, 'right');
    spawnParty(s, { ilse: [11, 6, 'up'], bram: [10, 7, 'up'], sable: [9, 7, 'down'], pip: [11, 7, 'up'], corvin: [12, 6, 'up'] });
    s.place('player', 10, 6, 'left');
    await s.wait(1.2);
    await s.narrate([
      'The sky is torn open. Violet, bruised, burning at the edges.',
      'Seven fires hang in it where the sun used to be.',
      'The island shudders. Pieces of the bluff crack away from the edge — and do not fall. They float.',
      'Out past the harbor, the Western Sea is coming apart — lifting away in long, slow, glassy sheets toward the broken sky. What is left in the bay heaves and sloshes like water in a tipped bowl.',
    ]);
    s.shake(0.3, 1.5);
    await s.say('Bram', 'The sea. Where\'s the sea?!');
    await s.say('Corvin', '_(looking up)_ ...Going up there, big man. Most of it.');
    await s.say('Pip', 'Oh, that\'s— no. No no no. That\'s not allowed. That\'s not ALLOWED.');
    s.music('tension');
    await s.say('Ysolde', 'Listen to me. All of you.');
    await s.say('Ysolde', 'The Lantern has no stone. When its light goes out, the Gloam comes in — here, now, all at once. It will take the island and everyone on it.');
    await s.say('Ysolde', 'I can hold the light. For a while. Long enough.');
    await s.say('Wren', 'Hold it with what?');
    await s.say('Ysolde', '...With me.');
    await s.say('Wren', 'No.');
    s.face('ysolde_v', 'c_corvin');
    await s.say('Ysolde', 'Captain. Get them to Tobias\'s boat.');
    await s.say('Corvin', 'Lady, running\'s the only thing I\'m any good at.');
    await s.say('Ysolde', 'Then teach them.');
    await s.wait(0.6);
    await s.say('Corvin', '...Yes, ma\'am.');
    s.face('ysolde_v', 'player');
    await s.move('ysolde_v', [[9, 6]], 1.2);
    s.face('player', 'left');
    await s.narrate('She unhooks the little brass lamp from her belt — the one she has carried on every night watch of your life — and folds your fingers around it.');
    await s.say('Ysolde', 'Take this. It\'s a Keeper\'s lamp. It won\'t go out. I made sure.');
    await s.give('ysolde_lantern');
    await s.say('Wren', 'Mom, I— I\'m—');
    await s.narrate('She leans down and presses her forehead to yours, the way she did when you were small and had a fever.');
    await s.say('Ysolde', 'Tell me later. I\'ll be listening.');
    await s.move('ysolde_v', [[8, 6], [8, 5]], 2.6);
    s.face('ysolde_v', 'up');
    await s.wait(0.4);
    s.remove('ysolde_v');
    s.sfx('holy');
    s.flash('#ffffff', 1.2);
    s.shake(0.3, 1.0);
    await s.narrate('The Lantern\'s light comes back. Not gold now — white. Fierce. It pours out of every window and every crack in the old stone and pushes the dark back off the island like a hand.');
    await s.say('Corvin', 'MOVE! Down the hill — to the docks — GO!');
    removeParty(s);
    s.objective('RUN. Get down the hill road to Tobias\'s boat at the docks!');
    s.journal('The sun broke into seven pieces. The sea fell into the sky. Mom went back into the Lantern to hold the light. She gave me her lamp. She said, "Tell me later."');
  },

  async runHill(s) {
    s.shake(0.35, 1.0);
    spawnParty(s, { ilse: [24, 5, 'left'], bram: [26, 4, 'left'], pip: [26, 5, 'left'], corvin: [27, 5, 'left'] });
    await s.narrate('The hill road splits open in front of you. Things climb out of the crack — dogs made of dusk, with embers where their eyes should be.');
    await s.say('Bram', 'Through them! We go THROUGH them!');
    removeParty(s);
    const r = await s.battle('c5_run_hounds', { bg: 'ruin', music: 'battle', canFlee: false });
    if (r !== 'win') return;
    await s.say('Corvin', 'Don\'t stop. Don\'t look up. Keep moving.');
  },

  async runSquare(s) {
    spawnParty(s, { ilse: [29, 12, 'down'], bram: [31, 12, 'down'], pip: [30, 13, 'down'], sable: [28, 12, 'down'] });
    s.spawn('pell_r', 'villager_9', 25, 15, 'down');
    await s.pan(25, 15, 0.6);
    await s.narrate('In the square, by the well, a small boy is standing perfectly still with his hands over his ears. Pell.');
    s.spawn('hound_r', { id: 'c5_hound_field', skin: '#2a1830', hair: { style: 'none' }, outfit: { style: 'robe', main: '#1a1024', accent: '#ff7a3a' }, acc: ['horns'] }, 21, 15, 'right');
    await s.move('hound_r', [[23, 15]], 4);
    await s.move('c_pip', [[30, 15], [26, 15]], 6);
    s.face('c_pip', 'left');
    await s.say('Pip', 'Hey! HEY, ugly! Over here! The kid\'s with me!');
    s.remove('hound_r');
    const r = await s.battle('c5_run_square', { bg: 'ruin', music: 'battle', canFlee: false });
    if (r !== 'win') return;
    await s.follow(0.4);
    s.face('c_pip', 'pell_r');
    await s.say('Pip', 'I got you. I got you, I got you. It\'s okay. I\'m a professional.');
    await s.say('Pell', 'M-Mama said run to the boat—');
    await s.say('Pip', 'Then that\'s where we\'re going. Hold my hand. No— don\'t, I got knives in that hand. Hold my sleeve.');
    s.remove('pell_r');
    s.setFlag('c5_pell_saved');
    removeParty(s);
    s.objective('Get to Tobias\'s boat at the end of the dock!');
  },

  async runBeach(s) {
    s.shake(0.4, 1.0);
    s.sfx('burst');
    await s.narrate('Something falls out of the sky and hits the beach in a spray of glassy sand — a piece of the sun, no bigger than a cart, still burning. Things crawl out of the crater toward you.');
    const r = await s.battle('c5_run_embers', { bg: 'ruin', music: 'battle', canFlee: false });
    if (r !== 'win') return;
    await s.say('Corvin', 'Dock! Dock, dock, dock — there\'s Tobias!');
  },

  // ================================================================== the boat
  async dock(s) {
    if (s.flag('c5_boarded')) return;
    s.setFlag('c5_boarded');
    s.stopMusic(1.5);
    s.spawn('tobias_d', 'tobias', 19, 30, 'up');
    s.spawn('maela_d', 'villager_36', 18, 31, 'up');
    s.spawn('pell_d', 'villager_9', 20, 31, 'up');
    spawnParty(s, { ilse: [21, 31, 'up'], bram: [22, 31, 'left'], sable: [21, 30, 'right'], pip: [20, 30, 'up'], corvin: [24, 30, 'left'] });
    s.place('player', 23, 28, 'down');
    await s.move('player', [[23, 30]], 2.4);
    await s.say('Fisher Tobias', 'In! In, all of you! She\'ll float as long as there\'s something to float on—');
    s.spawn('nana_d', 'nana_brisa', 23, 26, 'down');
    await s.move('nana_d', [[23, 29], [22, 29]], 3.2);
    s.face('nana_d', 'c_ilse');
    await s.say('Nana Brisa', 'Ilse! Ilse, love—');
    await s.narrate('Nana Brisa unpins the silver gull from her collar — the brooch from the tide caves, chipped wing and all — and presses it into Ilse\'s hand.');
    await s.say('Nana Brisa', 'Hold onto this for me. Bring it back. That\'s how I\'ll know you\'re all right.');
    await s.say('Ilse', 'Nana, get in the boat.');
    await s.say('Nana Brisa', 'The Doyle children are still up the hill. Their mother\'s gone to pieces.');
    await s.say('Ilse', 'Nana— NANA—');
    await s.say('Nana Brisa', 'Stay with Wren. She\'s going to need somebody to tell her when she\'s being stupid.');
    await s.move('nana_d', [[23, 29], [23, 24]], 3.2);
    s.remove('nana_d');
    s.shake(0.5, 1.6);
    s.sfx('quake');
    await s.narrate('Up the hill, with a sound like a cliff sighing, the village square tears loose from the island — well, lamp posts, cobbles and all — and lifts, slowly, into the broken sky.');
    await s.narrate('Ilse watches it go. She does not make a sound.');
    await s.say('Corvin', 'Sparrow. Boat. _Now._');
    s.face('player', 'up');
    await s.wait(0.6);
    s.music('sad');
    await s.pan(8, 4, 2.4);
    await s.narrate('Up on the bluff, the Lantern burns white against the broken sky. In the window of the lamp room there is a small dark figure, standing very straight.');
    await s.wait(0.8);
    await s.narrate('In your hand, the little brass lamp flickers.');
    await s.say('Ysolde', 'Wren.', { portrait: false });
    await s.say('Wren', 'Mom? Mom, can you hear me?');
    await s.say('Ysolde', 'I said I\'d be listening.', { portrait: false });
    await s.wait(0.8);
    await s.say('Wren', 'I\'m sorry.', { speed: 0.6 });
    await s.say('Wren', 'I\'m sorry. I\'m sorry, I\'m so sorry—');
    await s.say('Ysolde', 'I know.', { portrait: false });
    await s.say('Ysolde', 'I know, little bird.', { portrait: false, speed: 0.7 });
    await s.say('Wren', 'Come down. Please. There\'s room on the boat, Tobias says she floats as long as—');
    await s.say('Ysolde', 'Wren. Someone has to hold the light.', { portrait: false });
    await s.say('Ysolde', 'I\'ve been practicing for seven years.', { portrait: false });
    await s.wait(1.0);
    await s.say('Ysolde', 'Listen to me. You\'re going to want to carry this. All of it. Don\'t.', { portrait: false });
    await s.say('Ysolde', 'Carry the lamp instead. It\'s lighter.', { portrait: false });
    await s.say('Wren', 'Mom—');
    await s.wait(1.2);
    await s.say('Ysolde', 'Grow up well, my little bird.', { portrait: false, speed: 0.5 });
    await s.wait(1.0);
    s.sfx('holy');
    s.flash('#ffffff', 1.5);
    await s.fadeOut(2.8, '#ffffff');
    s.stopMusic(2);
    removeParty(s);
    ['tobias_d', 'maela_d', 'pell_d'].forEach((id) => s.remove(id));
    if (!s.flag('c5_pell_saved')) s.setFlag('c5_pell_saved');
    await s.wait(2.0);
    s.music('afterlight');
    await s.card('AFTERLIGHT', '', 6);
    await s.fadeOut(0.1, '#000');
    await s.narrate([
      'The light held for eleven minutes.',
      'Long enough.',
      'Then the sea, falling upward, took Tobias\'s boat with it — and the night came apart — and one by one Wren Halloway lost hold of every hand she was holding.',
      'All except one small brass lamp, that would not go out.',
    ]);
    CH5.sunder(s);
    s.journal('Mom held the light. I heard her through her lamp. I told her I was sorry. She said, "Grow up well, my little bird." Then everything was white.');
    await s.wait(1.0);
    await s.chapter(6, 'Afterlight');
    s.objective('...');
    await s.teleport('shard_hermitage', 5, 5, 'down');
  },

  /** End-of-Act-I state change: the party is scattered. */
  sunder(s) {
    s.setFlag('sundered');
    for (const id of [...s.state.party]) if (id !== 'wren') s.leave(id);
    if (!s.state.party.includes('wren')) s.state.joinParty('wren');
    s.setLook('wren', 'wren_ruin');
    s.state.musicOverride = null;
  },
};
