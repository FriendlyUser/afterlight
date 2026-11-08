// CHAPTER 6 — "Afterlight"
// One year later. Wren wakes on a floating shard of Lanternfall in Old Fennick's
// hut, learns to fight alone, crosses the Drift to the refugee camp of Keelhaven
// under a false name, and crosses the Shattered Sea toward Aurenne.

const LETTERS = ['c6_letter_jory', 'c6_letter_aldo', 'c6_letter_teo', 'c6_letter_sun'];

/** Bring a map NPC (from map.npcs) on stage now, instead of on the next visit. */
function spawnNpc(s, id) {
  const def = (s.field.map.npcs || []).find((n) => n.id === id);
  if (def && !s.field.actors.has(id)) s.field.spawnActor(def);
}

/** @type {import('../types/data').StoryScripts} */
export const CH6 = {
  // ================================================================== waking
  async wake(s) {
    if (s.flag('c6_woke')) return;
    s.setFlag('c6_woke');
    s.state.chapter = 6;
    await s.fadeOut(0);
    s.stopMusic(0.1);
    s.place('player', 5, 5, 'down');
    spawnNpc(s, 'fennick_h');
    s.face('fennick_h', 'left');
    if (!s.has('ysolde_lantern')) await s.give('ysolde_lantern', 1, true);
    s.heal();
    await s.wait(0.8);
    await s.narrate([
      'There was a light that would not go out.',
      'There was a long time of nothing.',
      'There was soup. Someone kept making soup.',
    ]);
    s.music('sad');
    await s.fadeIn(2.0);
    await s.wait(0.8);
    await s.say('Wren', '...Where—');
    await s.say('Fennick', 'Ah. There you are.');
    s.face('player', 'right');
    await s.say('Fennick', 'Sit. No — sit. You stand up too fast every morning, and every morning you fall over, and every morning I pick you up. My back\'s tired, girl.');
    await s.say('Wren', 'Every morning?');
    await s.say('Fennick', 'Three hundred and some. Hard to count. There aren\'t days anymore. Just the light changing color.');
    await s.say('Wren', '...Who are you?');
    await s.say('Fennick', 'Ha!');
    await s.say('Fennick', 'Now that\'s new. Three hundred mornings you\'ve sat at my table, and that\'s the first question you\'ve ever asked me.');
    await s.say('Fennick', 'Fennick. Old Fennick, the children used to say, up on the north cliffs. Dared each other to knock on my door.');
    await s.say('Wren', '...We said you ate gulls.');
    await s.say('Fennick', 'Only on holidays.');
    await s.wait(1.0);
    await s.say('Wren', 'Where is everyone? Ilse. Bram. My—');
    await s.wait(1.0);
    await s.say('Fennick', 'I found you on my doorstep the night the sky broke. Just you. Holding that.');
    await s.narrate('On the table: a small brass lamp. The flame inside is the size of a fingernail. It has not flickered.');
    await s.say('Fennick', 'Wouldn\'t let go of it. Fevers, sleep, nothing. I had to feed you one-handed for a month.');
    await s.say('Wren', '...Mom. She held the light. She—');
    await s.say('Fennick', 'I know. I watched it from the cliff. Eleven minutes. Longest light I ever saw.');
    await s.wait(1.2);
    await s.say('Wren', 'It was me. I gave him the stone. It was me.');
    await s.wait(1.4);
    await s.say('Fennick', '...I know that too, girl. You told me. Every night for three months, in your sleep.');
    await s.wait(1.0);
    await s.say('Fennick', 'Eat your soup.');
    await s.say('Wren', 'How can you— I broke the SUN, and you want me to eat soup?');
    await s.say('Fennick', 'And I burned the soup. Today it\'s the soup I can do something about.');
    await s.wait(1.0);
    await s.say('Fennick', 'When you\'re ready — and not before — come outside. There\'s something you should see.');
    s.objective('Step outside Fennick\'s hut.');
    s.journal('I woke up. Fennick says it\'s been a year. He says there are no days anymore. He made me eat soup.');
  },

  async hutFennick(s) {
    if (s.flag('c6_left_shard')) {
      return s.say('Fennick', ['Back, are you? Good. Not to sit on that rock, I hope.', 'Eat something. Then go on. They\'re out there waiting for you, whether they know it or not.']);
    }
    return s.say('Fennick', ['Go on outside. The sky won\'t bite.', '...Much.']);
  },

  async lanternTable(s) {
    await s.narrate('Your mother\'s lamp. The flame inside is the size of a fingernail. In a year, it has not flickered once.');
    if (!s.flag('c6_outside')) await s.think('Wren', 'It won\'t go out. She made sure.');
  },

  async books(s) {
    if (s.flag('c6_cairns')) return s.narrate('Fennick\'s books. Every one of them has a twin on a shelf in a house that is gone now. He bought two of everything, for years, so he would know which ones you had already read.');
    return s.narrate('Books. Hundreds of them, swollen with salt. Some of the titles are strangely familiar. _The Pirate Queen of Gale_. _A Child\'s Book of Stars_. _Tides, and How They Lie_.');
  },

  // ================================================================== the shard
  async outside(s) {
    if (s.flag('c6_outside') || !s.flag('c6_woke')) return;
    s.setFlag('c6_outside');
    s.music('ruin');
    await s.wait(0.8);
    await s.pan(14, 14, 1.6);
    await s.narrate([
      'The sky is a bruise. Violet at the top, going to a sick orange at the edges, like a sunset that has forgotten how to finish.',
      'Seven fires hang in it, where the sun used to be. Seven burning wounds scattered across the heavens — each too bright to look at, and too far away to warm anything.',
      'Past the edge of the grass there is no sea. There is no anything. Only more sky, going down and down forever — and islands, hundreds of them, big and small, hanging in it like crumbs on a dark cloth.',
      'Ash falls. It is always falling.',
    ]);
    await s.follow(1.0);
    await s.say('Wren', '...Okay.');
    await s.say('Wren', 'Okay. Okay.');
    s.objective('Look around Fennick\'s shard. Fennick is waiting at the cairns on the rise to the east.');
  },

  async rock(s) {
    if (!s.flag('c6_rock')) {
      s.setFlag('c6_rock');
      await s.narrate('A rock at the very edge of the shard, worn smooth and faintly hollowed on top. Facing west.');
      await s.say('Fennick', '_(from across the shard)_ That\'s your rock. You sat on it every day for a year. Looking at nothing.');
      await s.think('Wren', '...West. I was looking west. Toward home.');
      return;
    }
    return s.narrate('Your rock. It is a good rock. You are not going to sit on it today.');
  },

  async cairns(s) {
    if (s.flag('c6_cairns')) return CH6.fennickTalk(s);
    s.setFlag('c6_cairns');
    s.music('sad');
    s.face('fennick', 'up');
    await s.say('Fennick', 'Here. This is what I wanted you to see.');
    await s.narrate('Two small cairns of stacked stone on the rise, under a dead tree. Words scratched into a flat stone at the foot of each.');
    await s.narrate('_EDRIN HALLOWAY. HE\'D WANT A BETTER STONE._');
    await s.narrate('_YSOLDE HALLOWAY. KEEPER. SHE HELD._');
    await s.wait(1.4);
    await s.say('Fennick', 'Built his the year he went into the sea. Couldn\'t think what to write. Wrote the truth.');
    await s.say('Fennick', 'Built hers the week you came. Same problem.');
    await s.wait(1.2);
    await s.say('Wren', '"She held."', { speed: 0.6 });
    await s.wait(1.6);
    s.face('fennick', 'player');
    await s.say('Wren', 'You knew my dad.');
    await s.say('Fennick', 'Fished with him twenty years. Him, me and Tobias. We were the terror of the eel rocks.');
    await s.say('Wren', '..."Edrin, Toby and Fen were here."');
    await s.say('Fennick', '_(startled)_ You found that? Under the bluff? We were eleven. Your grandmother caught us and made us scrub the whole Stair with a brush. Four hundred years of steps.');
    await s.say('Fennick', '...Fen. Nobody\'s called me that since he went.');
    await s.wait(0.8);
    await s.say('Fennick', 'I was supposed to be on the boat with him that night. I had a cold. A _cold._ He went out alone.');
    await s.say('Fennick', 'I spent seven years on that north cliff being sorry. Didn\'t bring him back. Didn\'t do anyone a scrap of good.');
    await s.say('Fennick', 'Except — your books.');
    await s.say('Wren', 'My books?');
    await s.say('Fennick', 'The ones that washed up on your step. Every month, since you were five.');
    await s.wait(1.0);
    await s.say('Wren', '...That was you?');
    await s.say('Fennick', 'Your father paid me in fish to leave \'em. Said you\'d read them faster if you thought the sea sent them. After he was gone, I kept on.');
    await s.say('Fennick', 'It was the only part of being sorry that was any use to anybody.');
    await s.wait(1.4);
    await s.say('Wren', 'I don\'t know how to carry this.');
    await s.say('Fennick', 'Nobody does. Here\'s what I know, for what an old fool\'s worth.');
    await s.say('Fennick', 'Sorry looks backward. It stands with its face to the wall. What you _owe_ — that looks forward.');
    await s.say('Fennick', 'Same weight, girl. You just carry it facing the other way.');
    await s.wait(1.2);
    await s.say('Fennick', 'Now. You\'ve sat on that rock for a year. Today you\'re going to pick up a sword.');
    await s.narrate('He has been carrying a long bundle wrapped in sailcloth. He unwraps it.');
    await s.say('Fennick', 'Took this off a Dawnguard wreck that drifted by in the spring. Good steel. Better than that driftwood thing you used to swing at gulls.');
    await s.give('starsteel_sword');
    await s.say('Fennick', 'And the coat. Three old sails and a Dawnguard cloak. My stitching\'s terrible. It\'ll keep the ash off.');
    await s.give('c6_fennicks_coat');
    await s.system('Equip new gear from the menu (*C* / *Esc* → Equip). You are fighting alone now: there is no one to heal you or take a hit for you.');
    s.music('ruin');
    s.objective('Meet Fennick at the training ring south of the hut.');
    s.journal('Fennick built cairns for Mom and Dad. He was Dad\'s friend — "Fen." He\'s the one who left books on my step, every month, for eleven years. He gave me a sword.');
    await s.move('fennick', [[27, 10], [24, 13], [22, 13], [22, 15]], 2.6);
    s.remove('fennick');
    spawnNpc(s, 'fennick_r');
  },

  async spar(s) {
    if (s.flag('c6_spar')) return CH6.fennickTalk(s);
    await s.say('Fennick', 'Right. You and me. Don\'t hold back — I won\'t.');
    await s.say('Fennick', 'Three things your father never learned and I did. One: when something winds up for a big swing, _Guard._ Halves the blow and gets your turn back quicker.');
    await s.say('Fennick', 'Two: hit what they hate. Every beast has a weakness. Find it, keep hitting it, and they Break.');
    await s.say('Fennick', 'Three: you\'re alone now. Nobody\'s going to heal you. If you\'ve a Crest that can mend, put it to work. If you don\'t — carry tonics. Lots of tonics.');
    if (!(await s.confirm('Spar with Fennick?', 'Ready', 'Not yet'))) return;
    const r = await s.battle('c6_spar_fennick', { bg: 'ruin', music: 'battle', loseOk: true, canFlee: false });
    s.setFlag('c6_spar');
    s.heal();
    if (r === 'win') {
      await s.say('Fennick', 'Hah! HA! There\'s Edrin\'s girl!');
      await s.say('Fennick', '...Don\'t tell anyone an old man got put on his back by a child. I have a reputation. For eating gulls.');
    } else {
      await s.say('Fennick', 'Hff. Not bad. Not good. Not bad.');
      await s.say('Fennick', 'Again tomorrow. That\'s the whole secret, girl. Again tomorrow.');
    }
    return CH6.courier(s);
  },

  async courier(s) {
    if (s.flag('c6_courier')) return;
    s.setFlag('c6_courier');
    s.spawn('linnet', 'linnet', 30, 13, 'left');
    await s.wait(0.4);
    await s.narrate('A shadow sweeps over the training ring — a kite the size of a sail, with a girl hanging from the bar beneath it. She drops onto the bridge, runs ten steps to bleed off speed, and skids to a stop.');
    await s.move('linnet', [[26, 13], [24, 15]], 4);
    await s.say('Linnet', 'Post! Post for the hermit of— oh! You\'re UP!');
    await s.say('Linnet', 'Fen, she\'s up! She\'s standing! Does she talk? Do you talk?');
    await s.say('Wren', '...Hello.');
    await s.say('Linnet', 'She TALKS. Hello! I\'m Linnet. Kite-post, Keelhaven to everywhere, rain or ash. I\'ve brought him his letters every month and you\'ve looked straight through me every time.');
    await s.say('Fennick', 'Any news worth the trip, Linnet?');
    await s.say('Linnet', 'Keelhaven\'s swelled to six hundred. Warden Hale\'s rationing the soup again. Kiteholm\'s got a new gang of brats running the scrap-yards.');
    await s.say('Linnet', 'And there\'s a hospital in the ruins of Aurenne now. The old Bellwrights\' Hall. The Ember Ward, they call it.');
    await s.say('Linnet', 'Run by a Mender girl about your age. Dark hair, spectacles, never smiles. They say she hasn\'t slept since the sky broke.');
    await s.wait(1.2);
    await s.say('Wren', '...Ilse.', { speed: 0.6 });
    await s.say('Linnet', 'Oh, and — heralds came through Keelhaven, all in white. Said the Hierophant lives. Said he\'s building something up on the biggest sun-shard. Said—');
    await s.say('Linnet', 'Said the last Dawnstone was given freely. By the Keeper\'s daughter of Lanternfall.');
    await s.wait(1.4);
    await s.say('Linnet', 'Folk in Keelhaven would like a word with her, I\'ll tell you that much.');
    await s.wait(0.8);
    await s.say('Fennick', 'Linnet. Have you met my granddaughter? This is Lark.');
    await s.wait(0.8);
    await s.say('Wren', '...Lark.');
    await s.say('Linnet', 'Didn\'t know you had a granddaughter, Fen!');
    await s.say('Fennick', 'Neither did I, till recently.');
    await s.say('Linnet', 'Well — Keelhaven\'s two bridges east, past what\'s left of the old village square. Mind the hounds on the Drift! Bye, Lark!');
    await s.move('linnet', [[26, 13], [33, 13]], 4.5);
    s.remove('linnet');
    await s.wait(0.8);
    await s.say('Wren', 'Ilse\'s alive.');
    await s.say('Fennick', 'Sounds like.');
    await s.say('Wren', 'Then maybe the others— I have to go. I have to find them.');
    await s.say('Fennick', 'I know.');
    await s.say('Fennick', 'You\'ll find folk out there who hate the Keeper\'s girl. Let them. You don\'t owe them your name. You owe them better than sitting on a rock.');
    await s.narrate('He works a bracelet off his own wrist — old braided cord, so overgrown with moss it is almost alive — and ties it onto yours.');
    await s.say('Fennick', 'Moss grows on anything if you leave it long enough. Even an old man. It\'ll knit you up a little in a fight.');
    await s.give('regen_bangle');
    await s.say('Fennick', 'I\'ll want you back sometimes. Not to sit on that rock.');
    await s.move('fennick_r', [[22, 13], [16, 13], [15, 11], [15, 10]], 2.4);
    s.remove('fennick_r');
    spawnNpc(s, 'fennick_d');
    s.objective('Cross the Drift east to Keelhaven. (The bridge is on the east side of the shard.)');
    s.journal('A kite-courier named Linnet says there\'s a Mender girl running a hospital in the ruins of Aurenne. Ilse. She\'s alive. Folk blame "the Keeper\'s daughter." Fennick told Linnet my name is Lark.');
  },

  async fennickTalk(s) {
    if (s.flag('c6_courier')) return s.say('Fennick', ['East bridge, girl. Two bridges to the old square, then on to Keelhaven.', 'And Lark — eat when you\'re hungry. Sleep when you\'re tired. Grief\'s no excuse for bad manners to your own body.']);
    if (s.flag('c6_cairns')) return s.say('Fennick', 'Training ring, south of the hut. Come on, before my knees seize up.');
    return s.say('Fennick', 'Come up here a moment, girl. There\'s something you should see.');
  },

  async ashmaw(s) {
    if (s.flag('c6_ashmaw')) return;
    s.remove('fennick_r');
    s.remove('fennick_d');
    s.spawn('fen_b', 'fennick', 26, 13, 'right');
    s.shake(0.35, 1.0);
    s.sfx('surprise');
    await s.narrate('Something lands on the far end of the bridge hard enough to make the planks jump — a hound the size of a cart, made of packed ash, with embers for eyes and smoke pouring off its back.');
    await s.say('Fennick', 'That\'s the Ashmaw. It\'s been taking my chickens all winter.');
    await s.say('Wren', 'You have chickens?');
    await s.say('Fennick', 'Had.');
    await s.say('Fennick', 'Go on, Lark. Remember: watch the shoulders. Guard the big one.');
    const r = await s.battle('c6_boss_ashmaw', { bg: 'ruin' });
    if (r !== 'win') return;
    s.setFlag('c6_ashmaw');
    s.setFlag('c6_left_shard');
    await s.narrate('The Ashmaw comes apart in a long grey sigh, and the wind takes it over the edge.');
    await s.say('Wren', 'I— okay. I\'m okay.');
    await s.say('Fennick', 'You\'re not. But you\'re standing.');
    await s.say('Fennick', '...There she is.');
    await s.say('Fennick', 'Go on. Before I say something sentimental and we both have to live with it.');
    await s.move('fen_b', [[22, 13], [16, 11]], 2.4);
    s.remove('fen_b');
    s.journal('The Ashmaw — Fennick\'s chicken-thief — attacked on the bridge. I fought it alone. I won. Fennick said, "There she is."');
  },

  // ================================================================== the Drift
  async driftIn(s) {
    if (s.flag('c6_drift_in')) return;
    s.setFlag('c6_drift_in');
    await s.wait(0.6);
    await s.narrate('Islands drift past in the dusk — and some of them, you realize slowly, have cobblestones on them. Lamp posts. Fences you used to climb.');
    await s.think('Wren', 'These are... these are pieces of home.');
    s.objective('Cross the Drift to Keelhaven, in the east.');
  },

  async lanternView(s) {
    await s.narrate('Far to the west, on a shard of its own, the stump of a stone tower stands against the bruised sky. At its top, impossibly, a light still burns. Not white now. A small, stubborn gold.');
    if (!s.flag('c6_lantern_seen')) {
      s.setFlag('c6_lantern_seen');
      await s.think('Wren', '...The Lantern. It\'s still lit.');
      await s.think('Wren', 'Not yet. I can\'t. Not yet.');
      s.journal('From the Drift you can see the Lantern on its own shard far to the west. It is still burning. I couldn\'t go. Not yet.');
    }
  },

  async house(s) {
    if (s.flag('c6_house')) return;
    s.setFlag('c6_house');
    s.music('sad');
    await s.wait(0.4);
    await s.narrate('Half a room, hanging in the sky. Two walls, a floor, a bed, a table. The rest of the house is just... gone, sheared off as clean as bread.');
    await s.think('Wren', 'That\'s my bed.');
    await s.think('Wren', 'That\'s our table.');
  },

  async houseTable(s) {
    await s.narrate('The kitchen table. Two plates, still set, filmed with a year of ash. Your mother\'s letter is gone. The wind must have taken it.');
  },

  async atlas(s) {
    if (s.flag('c6_atlas')) return s.narrate(s.flag('c6_atlas_kept') ? 'Your father\'s shelf. The atlas is in your pack now. You still don\'t know why.' : 'Your father\'s shelf, with a gap in it where a book used to be.');
    s.setFlag('c6_atlas');
    await s.narrate('Your father\'s shelf. Most of the books have gone over the edge. One is wedged in tight, swollen with damp: a big blue book with a gold sunburst on the spine.');
    await s.narrate('_The Sunward Atlas._ Inside the cover, in a fine, kind hand: _For Wren, who asks the best questions. — C._');
    const c = await s.choice(['Keep it.', 'Throw it over the edge.'], { prompt: 'What do you do with Cassian\'s gift?' });
    if (c === 0) {
      s.setFlag('c6_atlas_kept');
      await s.give('c6_sunward_atlas');
      await s.think('Wren', 'I don\'t know why I\'m keeping it. I just— am.');
    } else {
      s.sfx('cancel');
      await s.narrate('You throw it as hard as you can. It opens in the air like a bird, pages flapping, and falls, and falls, and is gone.');
      await s.think('Wren', '...That didn\'t help at all.');
    }
  },

  // ================================================================== Keelhaven
  async keelGate(s) {
    if (s.flag('c6_keelhaven')) return;
    s.setFlag('c6_keelhaven');
    s.music('ruin');
    s.spawn('mott', 'c6_sentry', 4, 17, 'left');
    s.place('player', 2, 16, 'right');
    await s.wait(0.4);
    await s.narrate('A town built out of boats. Dozens of hulls, turned keel-up and lashed to the rock to make roofs. Cookfires. Washing lines. A child chasing a goat. Six hundred people who were, a year ago, somewhere else.');
    await s.say('Sentry Mott', 'Hold up. New face. Where from?');
    await s.say('Wren', 'West. The Drift.');
    await s.say('Sentry Mott', 'Nobody lives on the Drift but hounds and old Fennick. Name?');
    await s.narrate('Nailed to the gatepost beside him, a sheet of white paper with the Choir\'s gold sunburst: _THE LAST STONE WAS GIVEN FREELY, BY THE KEEPER\'S DAUGHTER OF LANTERNFALL._ Someone has drawn a noose under it.');
    const c = await s.choice(['"...Lark."', '"Wren. Wren Halloway."'], { prompt: 'Your name?' });
    if (c === 1) {
      s.setFlag('c6_tried_truth');
      await s.say('Wren', 'Wren. Wren Hal—');
      await s.wait(1.0);
      await s.narrate('Your eyes go to the noose. Your mouth closes on its own.');
      await s.say('Sentry Mott', 'Wren what?');
      await s.wait(0.8);
    }
    await s.say('Wren', '...Lark. My name\'s Lark. Fennick\'s granddaughter.');
    await s.say('Sentry Mott', 'Lark. Welcome to Keelhaven. Don\'t steal, don\'t fight, don\'t fall off. Soup\'s free at the kettle, twice a day.');
    await s.say('Sentry Mott', 'You want work or passage, Warden Hale\'s in the big hull on the north side.');
    s.remove('mott');
    spawnNpc(s, 'mott');
    s.objective('Find a way east across the Shattered Sea toward Aurenne. Warden Hale runs Keelhaven (the big hull, north side).');
    s.journal('Keelhaven: a town made of upturned boats. There\'s a notice on the gate about "the Keeper\'s daughter," with a noose drawn under it. I told them my name is Lark.');
  },

  async hale(s) {
    // Bounties first: proof brought back after the Unmoored (or after the chapter) still pays.
    const paid = await CH6.bountyPay(s);
    if (paid) return;
    if (s.flag('c6_brinefang')) return s.say('Warden Hale', ['You killed the Unmoored. Alone. I\'ve had the salvagers out on the strait all morning just to look at the bones.', 'Keelhaven owes you, Lark. Whoever you are.']);
    if (s.flag('c6_hale')) {
      return s.say('Warden Hale', ['Both winches, Lark. North spoke and south spoke. Then the strait bridge comes down.', 'And the bounties stand, if you\'re out there anyway. Bring me proof.']);
    }
    s.setFlag('c6_hale');
    await s.say('Warden Hale', 'You\'re Fennick\'s granddaughter. Mott said. Funny — Fennick never mentioned one. Sit.');
    await s.say('Warden Hale', 'I was harbormaster at Port Gale for nineteen years. I ran three hundred ships a season. Now I run six hundred people on a rock, and I\'m worse at it.');
    await s.say('Wren', 'I need to get to Aurenne.');
    await s.say('Warden Hale', 'Across the old strait? Nobody\'s crossed in four months.');
    await s.say('Warden Hale', 'Something big lives out there now. A serpent the length of a street, swimming in the sky like it\'s still water. Eats rafts. Broke our chain-bridge twice. The salvagers call it the Unmoored.');
    await s.say('Wren', 'I\'ll go.');
    await s.say('Warden Hale', 'Alone? You\'re a child.');
    await s.wait(0.8);
    await s.say('Wren', 'I\'m used to alone.');
    await s.wait(1.0);
    await s.say('Warden Hale', '...The salvagers winched the strait bridge up and chained it, after the last raft went down. Two winches — one out on the north spoke, one on the wreck of the _Gilded Psalm_ on the south spoke. Turn both, and the bridge comes down.');
    await s.say('Warden Hale', 'I\'ll have Rook open the east gate. I won\'t stop you. I won\'t come and pull you out, either.');
    await s.say('Warden Hale', 'And — if you\'re going out there anyway. Two bounties on the board. Glassback, the golem that\'s been smashing the salvage quarry. And the Lidless, up on its perch. Proof brings coin.');
    s.setFlag('c6_gate_open');
    s.quest('c6_bounty_glass', 'Bounty: Glassback', 'A golem of living glass has been wrecking the salvagers\' quarry, west of the north spoke of the Shattered Sea. Defeat it and bring proof to Warden Hale.');
    s.quest('c6_bounty_lidless', 'Bounty: The Lidless', 'Something with too many eyes has made a perch north of the Last Hearth, past the strait bridge. Defeat it and bring proof to Warden Hale.');
    s.objective('Go east into the Shattered Sea. Turn the salvagers\' winches on the north and south spokes to lower the strait bridge.');
    s.journal('Warden Hale says a sky-serpent called the Unmoored blocks the old strait. Two winches lower the bridge across. I said I\'d go. Alone. I\'m used to alone.');
  },

  async bountyPay(s) {
    let paid = false;
    if (s.has('c6_glass_core') && !s.flag('c6_glass_paid')) {
      s.setFlag('c6_glass_paid');
      await s.take('c6_glass_core');
      await s.say('Warden Hale', 'Glassback\'s heart. Gods, it\'s still warm. The salvagers will cry.');
      await s.gold(1500);
      await s.give('swift_boots');
      s.quest('c6_bounty_glass', null, null, 'done');
      paid = true;
    }
    if (s.has('c6_lidless_eye') && !s.flag('c6_lidless_paid')) {
      s.setFlag('c6_lidless_paid');
      await s.take('c6_lidless_eye');
      await s.say('Warden Hale', 'Put it AWAY. Put it— thank you. I\'ll never sleep again. Here.');
      await s.gold(2000);
      await s.give('feather_cape');
      s.quest('c6_bounty_lidless', null, null, 'done');
      paid = true;
    }
    return paid;
  },

  async maela(s) {
    if (s.flag('c6_maela')) {
      if (s.flag('c6_cinder_scene')) return s.say('Maela', ['Eat something before you go out there, Lark. That\'s not a request.', '...And come back. That\'s not one either.']);
      return s.say('Maela', ['Soup\'s ash-potato. It\'s always ash-potato. Eat it anyway.']);
    }
    s.setFlag('c6_maela');
    s.music('sad');
    await s.narrate('A woman at a huge iron kettle, ladling grey soup into a line of tin cups. She looks up to hand you one — and stops.');
    await s.say('Maela', '...');
    s.spawn('pell_k', 'pell', 12, 14, 'up');
    await s.say('Pell', 'WREN!');
    await s.move('pell_k', [[13, 14]], 5);
    await s.narrate('A boy hits you around the middle at full speed. A year taller. A year thinner. Pell.');
    await s.say('Maela', 'Pell. Hush.');
    await s.narrate('Her eyes flick to the pulpit across the square, where a man in ash-smeared robes is preaching to nobody in particular.');
    await s.say('Maela', 'This is Lark. Isn\'t it, Lark.');
    await s.say('Wren', '...Yes. Hello, Maela.');
    await s.say('Pell', '_(whispering, enormous)_ I won\'t tell. I won\'t EVER tell.');
    await s.wait(0.8);
    await s.say('Wren', 'Maela. Where\'s Tobias?');
    await s.wait(1.2);
    await s.say('Maela', 'Tobias got the boat down on this rock with eleven of us aboard. When the sea came down the other way.');
    await s.say('Maela', 'Then he went back out on a raft for more.');
    await s.say('Maela', '...That was three hundred mornings ago.');
    await s.say('Wren', 'I\'m sorry. Maela, I\'m so—');
    await s.say('Maela', 'Everybody\'s sorry. Have some soup.');
    await s.give('c6_maela_soup', 3);
    if (s.flag('c5_run_square') || s.flag('c5_boarded')) {
      await s.say('Pell', 'Pip saved me. By the well. He said I was a professional now. Like him.');
      await s.say('Pell', 'Is Pip— is Bram— are they—');
      await s.say('Wren', 'I don\'t know, Pell. I\'m going to find out.');
    }
    s.remove('pell_k');
    spawnNpc(s, 'pell');
    s.music('ruin');
    s.journal('Maela and Pell are alive, in Keelhaven. Tobias got eleven people to safety, then went back out for more and never came back. Maela called me Lark without even blinking.');
  },

  async pell(s) {
    if (s.flag('c6_kite_done')) return s.say('Pell', ['It went NORTH. Linnet says the wind up high goes to Kiteholm.', 'If Pip sees it, he\'ll know. He\'ll KNOW.']);
    if (s.has('c6_choir_silk')) return CH6.kite(s);
    if (s.flag('c6_kite')) return s.say('Pell', ['Silk, Lark. Real silk, the kind that doesn\'t rot. The Choir\'s fancy banners were made of it.', 'Linnet says there\'s a whole Choir ship wrecked out on the south spoke.']);
    if (!s.flag('c6_maela')) return s.say('Pell', 'Are you new? Maela gives extra soup to new people. Not really. But she might.');
    s.setFlag('c6_kite');
    await s.say('Pell', 'Lark! I\'m building a kite. Like Linnet\'s. Not to ride — to send.');
    await s.say('Pell', 'I\'m going to paint names on it. Everybody we\'re looking for. And fly it as high as it goes and cut the string, and the wind will take it everywhere, and somebody will SEE it.');
    await s.say('Pell', 'But the sailcloth\'s too heavy. I need silk. Real silk. The Choir\'s banners were made of it — and there\'s a Choir ship wrecked out on the south spoke of the strait.');
    s.quest('c6_pell_kite', 'Pell\'s Kite', 'Pell wants to fly a message-kite with the names of the lost painted on it. He needs Choir silk — from the banners of the wrecked Gilded Psalm on the south spoke of the Shattered Sea.');
  },

  async kite(s) {
    s.setFlag('c6_kite_done');
    await s.take('c6_choir_silk');
    await s.say('Pell', 'SILK! Real silk! With a sunburst on it! I\'ll paint over the sunburst.');
    await s.fadeOut(0.8);
    await s.wait(0.6);
    await s.fadeIn(0.8);
    await s.narrate('An hour later, on the rock above the town, Pell holds up a kite made of white Choir silk, with names painted on it in big careful letters.');
    await s.narrate('_PELL IS ALIVE. KEELHAVEN. MAELA. — PIP? — TOBIAS?_');
    await s.say('Pell', 'Lark. Do you want to add any?');
    await s.wait(1.0);
    await s.narrate('You take the brush.');
    await s.narrate('_ILSE. BRAM. SABLE. PIP. CORVIN._');
    await s.narrate('You think for a long time. Then you add one more, small, in the corner: _— W._');
    await s.narrate('Pell lets the kite climb until it is a white speck against the seven wounds of the sky. Then he cuts the string. The wind takes it north.');
    await s.say('Pell', 'There. Now they\'ll know where to come.');
    await s.give('lucky_coin');
    s.quest('c6_pell_kite', null, null, 'done');
    s.journal('Pell and I flew a kite with the names of everyone we\'re looking for painted on it. The wind took it north. I signed it "W."');
  },

  async orla(s) {
    const letters = LETTERS.filter((id) => s.has(id) && !(id === 'c6_letter_aldo' && s.flag('c6_aldo_shown')));
    if (!s.flag('c6_orla')) {
      s.setFlag('c6_orla');
      await s.say('Orla', 'Every letter on this wall is for somebody nobody can find. Folk write them anyway. Pin them up. Come back every morning to see if theirs has been taken down.');
      await s.say('Orla', 'Sometimes the somebody turns up. Twice, so far.');
      await s.say('Orla', 'The sky\'s full of letters, love. Satchels, sea-chests, pockets. If you find any out there in the wreckage, bring them to me. Somebody\'s waiting.');
      s.quest('c6_letters', 'The Lost Wall', 'Orla keeps a wall of letters for the missing in Keelhaven. Lost letters drift in the wreckage of the Drift and the Shattered Sea — bring any you find to her.');
    }
    if (!letters.length) {
      if (CH6.lettersDone(s)) return CH6.ownLetter(s);
      return s.say('Orla', 'No letters today? That\'s all right. Neither does anyone else, most days.');
    }
    for (const id of letters) await CH6.deliver(s, id);
    if (CH6.lettersDone(s)) await CH6.ownLetter(s);
  },

  lettersCount(s) { return LETTERS.filter((id) => s.flag(`${id}_done`)).length; },
  lettersDone(s) { return CH6.lettersCount(s) === LETTERS.length; },

  async deliver(s, id) {
    if (id === 'c6_letter_jory') {
      await s.take(id);
      s.setFlag(`${id}_done`);
      await s.say('Orla', '"To Mama, at Port Gale. From Jory." — Jory! His mother comes every single morning. She\'ll— oh, she\'ll—');
      await s.narrate('Orla presses the letter to her chest for a moment before she can go on.');
      await s.say('Orla', 'Here. For bringing a boy home. Near enough.');
      await s.give('hi_ether', 2);
    } else if (id === 'c6_letter_teo') {
      await s.take(id);
      s.setFlag(`${id}_done`);
      await s.say('Orla', '"To my brother Teo, in Kiteholm." A Choir sailor, off the _Psalm_. I\'ll send it north on Linnet\'s next kite. That\'s the best any of us can do.');
      await s.give('mega_tonic', 2);
    } else if (id === 'c6_letter_sun') {
      await s.take(id);
      s.setFlag(`${id}_done`);
      await s.say('Orla', '"Dear Sun. Please come back. I will be good. I will be so good." ...No name. No address.');
      await s.narrate('Orla pins it in the very middle of the wall, where everyone will see it.');
      await s.say('Orla', 'It doesn\'t need one.');
      await s.give('elixir');
    } else if (id === 'c6_letter_aldo') {
      s.setFlag('c6_aldo_shown');
      await s.say('Orla', '"To Aldo Brannock." Aldo...');
      await s.say('Orla', '...You\'ll know him as Brother Cinder. The one at the pulpit, shouting about the Keeper\'s girl. Aldo had a wife called Bett. She never made it to the big rock.');
      await s.say('Orla', 'You should give this one to him yourself, love. I don\'t think I could.');
    }
  },

  async ownLetter(s) {
    if (s.flag('c6_own_letter')) return s.say('Orla', ['Your letter\'s up, Lark. Right next to "Dear Sun."', 'Come by in the mornings. You never know.']);
    s.setFlag('c6_own_letter');
    s.music('sad');
    await s.say('Orla', 'Four letters home. Four more than anybody else has managed this year.');
    await s.say('Orla', 'Here — paper, and a stub of charcoal. Everybody writes one, sooner or later. You\'ve been staring at the wall like you\'ve got one in you.');
    await s.wait(1.0);
    await s.narrate('You write for a long time. You cross out most of it. In the end there are only a few lines left.');
    await s.narrate('_Mom._');
    await s.narrate('_I\'m going to find them. All of them. Then I\'m going to figure out what I owe, and pay it._');
    await s.narrate('_I\'m carrying the lamp. You were right. It\'s lighter._');
    await s.narrate('_— W._');
    await s.say('Orla', 'No address?');
    await s.say('Wren', 'She knows where I am.');
    await s.say('Orla', 'Then this is for the one who brought them all home.');
    await s.give('ember_heart');
    s.quest('c6_letters', null, null, 'done');
    s.music('ruin');
    s.journal('I brought Orla four lost letters. Then I wrote one of my own, to Mom, and pinned it on the Lost Wall.');
  },

  async cinder(s) {
    if (s.flag('c6_cinder_mended')) return s.say('Brother Cinder', ['Aldo. Just Aldo, now.', 'I\'m learning to make soup. Bett would laugh herself sick.']);
    if (s.has('c6_letter_aldo')) return CH6.cinderLetter(s);
    if (s.flag('c6_cinder_scene')) return s.say('Brother Cinder', '...Go on, then. Go east. Fall off the edge of the world, Lark Tobiasdaughter.');
    return s.say('Brother Cinder', [
      'Seven wounds in the sky! Seven! And who opened them? The Choir says it plain: the last stone was GIVEN. Given, by the Keeper\'s daughter of Lanternfall!',
      'Somewhere out there she\'s eating, and sleeping, and breathing our air. Find her! Give her to the abyss, and maybe — maybe — the sky will close!',
    ]);
  },

  async cinderLetter(s) {
    s.setFlag('c6_cinder_mended');
    await s.take('c6_letter_aldo');
    s.setFlag('c6_letter_aldo_done');
    await s.say('Wren', 'Brother Cinder. Aldo. This is for you. It was out in the wreckage.');
    await s.say('Brother Cinder', 'What is— that\'s Bett\'s hand.', { speed: 0.6 });
    await s.narrate('He reads it standing up. Then he sits down on the step of his own pulpit, very suddenly, like his strings have been cut.');
    await s.say('Bett', [
      '_Aldo. If I don\'t make it to the big rock, don\'t you dare turn this into anybody\'s fault._',
      '_Not the Keepers\'. Not the Choir\'s. Not God\'s. Not yours._',
      '_Things break. Then you pick up the pieces that are left, and you make soup. — Bett._',
    ], { portrait: false });
    await s.wait(1.6);
    await s.say('Brother Cinder', 'She always did make soup out of everything.', { speed: 0.6 });
    await s.wait(1.0);
    await s.say('Brother Cinder', 'I wanted it to be somebody\'s fault. If it\'s somebody\'s fault, then it isn\'t just... the sky. Then you can do something about it. Throw somebody off a rock.');
    await s.say('Wren', '...I know.');
    await s.say('Brother Cinder', 'Here. It was Bett\'s. She\'d want it on somebody going somewhere.');
    await s.give('vigor_bangle');
    s.journal('I gave Brother Cinder his wife\'s last letter. She told him not to make it anybody\'s fault. He stepped down off his pulpit.');
  },

  async cinderScene(s) {
    if (s.flag('c6_cinder_scene')) return;
    s.setFlag('c6_cinder_scene');
    s.music('tension');
    s.spawn('cinder_g', 'cinder', 44, 16, 'left');
    s.spawn('fol1', 'villager_44', 44, 17, 'left');
    s.spawn('fol2', 'villager_57', 43, 15, 'left');
    await s.say('Brother Cinder', 'And where are you going, girl?');
    await s.say('Wren', 'East.');
    await s.say('Brother Cinder', 'Nobody goes east. Nobody but fools and the guilty.');
    await s.say('Brother Cinder', 'Red hair. Lanternfall accent. Came in off the Drift — from the west, where Lanternfall used to be. Fennick\'s "granddaughter," that nobody ever heard of.');
    await s.say('Brother Cinder', 'The Keeper\'s girl had red hair, they say. Lanternfall red.');
    await s.narrate('People are stopping. Turning. A crowd gathers the way weather gathers — slowly, then all at once.');
    await s.wait(1.0);
    s.spawn('maela_g', 'maela', 36, 16, 'right');
    await s.move('maela_g', [[40, 16]], 3.6);
    await s.say('Maela', 'That\'s enough, Aldo.');
    await s.say('Brother Cinder', 'Maela. You\'re from Lanternfall. You tell them who she is.');
    await s.say('Maela', 'I will.');
    await s.wait(1.0);
    await s.say('Maela', 'This is Lark. Lark Tobiasdaughter. I\'ve known her since she was a baby. My Tobias taught her to gut a fish when she was six, and she cried, and he gave her the fish to keep as a pet. It went off in a week.');
    await s.say('Maela', 'Pell calls every red-haired girl "Wren" because he misses her. So do I.');
    await s.say('Maela', 'Go home, Aldo. Pray at your pillar. Leave my girl be.');
    await s.wait(1.0);
    await s.say('Brother Cinder', '...Maela.');
    await s.move('cinder_g', [[42, 16], [38, 18], [36, 21]], 2.4);
    s.remove('cinder_g');
    s.remove('fol1');
    s.remove('fol2');
    s.music('sad');
    await s.wait(0.6);
    s.face('maela_g', 'player');
    await s.say('Maela', 'I don\'t know what you did up there.');
    await s.say('Maela', 'I know what they say. And I know Tobias went back for more boats and didn\'t come back, and I am not losing anybody else from Lanternfall to a lot of shouting.');
    await s.say('Wren', '...Thank you, Maela.');
    await s.say('Maela', 'Don\'t. Just come back.');
    await s.move('maela_g', [[36, 16]], 3);
    s.remove('maela_g');
    s.music('ruin');
    s.journal('Brother Cinder almost had me, at the east gate. Maela told the whole crowd I was Lark Tobiasdaughter. She lied for me. She said, "Just come back."');
  },

  async ottilie(s) {
    if (s.flag('c6_ottilie')) return s.say('Sister Ottilie', ['Wash your hands, Lark. Then wash them again.', 'The Ember Ward\'s girl says the rot spreads through dirty hands faster than through bad luck.']);
    s.setFlag('c6_ottilie');
    await s.say('Sister Ottilie', 'Careful — don\'t touch the cots. Gloam-rot. It starts as a grey patch on the skin and it doesn\'t stop.');
    await s.say('Sister Ottilie', 'I wore the Choir\'s white for eleven years. I sang the Dawnsong every morning of my life. I don\'t sing anymore.');
    await s.say('Sister Ottilie', 'The only one who\'s ever beaten the rot is a Mender in Aurenne. The Ember Ward. She wrote me, once, by kite. Told me how to keep them alive longer.');
    await s.say('Sister Ottilie', 'Her letter began: "Three things. One: wash your hands. Two: wash them again. Three: nobody is beyond help until they\'re dead, and then they\'re beyond help, so stop crying and go to the next bed."');
    await s.wait(1.0);
    await s.say('Wren', '..."Three things."', { speed: 0.6 });
    await s.say('Sister Ottilie', 'You know her?');
    await s.say('Wren', 'I used to.');
    await s.give('panacea', 3);
  },

  async board(s) {
    await s.narrate([
      'A plank nailed to two oars. Notices pinned three deep. MISSING: GOAT, ANSWERS TO "COUNCILLOR". WANTED: ANYONE WHO CAN FIX A KITE-WINCH.',
      'And, in Warden Hale\'s blocky capitals:',
      '_BOUNTY — "GLASSBACK." GLASS GOLEM, SALVAGE QUARRY, WEST OF THE NORTH SPOKE. 1,500 GOLD._',
      '_BOUNTY — "THE LIDLESS." ON THE PERCH NORTH OF THE LAST HEARTH. DO NOT LOOK AT IT. 2,000 GOLD._',
      '_PROOF TO THE WARDEN._',
    ]);
  },

  async linnet(s) {
    await s.say('Linnet', 'Lark! Kite-post\'s open — I can fly you anywhere I\'ve flown before. Costs nothing. Well, costs your stomach.');
    if (await s.confirm('Take the kite-post?', 'Fly', 'Not now')) await s.worldMap();
  },

  // ================================================================== the Shattered Sea
  async seaIn(s) {
    if (s.flag('c6_sea_in')) return;
    s.setFlag('c6_sea_in');
    await s.wait(0.6);
    await s.narrate('The old strait between Lanternfall and the mainland. You crossed it once in Tobias\'s boat with your friends, and Bram was sick over the side, and a sea serpent tried to eat you.');
    await s.narrate('Now there is no water in it. Only wreckage, hanging in the air, and the long drop underneath.');
    await s.think('Wren', 'Two winches. North spoke, south spoke. Then the bridge. Then Aurenne. Then Ilse.');
    s.objective('Turn the salvagers\' winches on the north spoke (the Chainyard) and the south spoke (the wreck of the Gilded Psalm).');
  },

  async winch(s, which) {
    const flag = `c6_winch_${which}`;
    if (s.flag(flag)) return s.narrate('The winch is turned and locked. Somewhere east, a chain hangs slack.');
    await s.narrate(which === 'a'
      ? 'A salvagers\' winch, as big as a cart, chained to the rock. The crank is stiff with ash.'
      : 'The _Gilded Psalm_\'s anchor-winch, rigged by the salvagers to haul the strait chain. The crank is wedged with debris.');
    if (!(await s.confirm('Turn the winch?', 'Turn it', 'Leave it'))) return;
    if (!s.flag(`${flag}_fight`)) {
      s.setFlag(`${flag}_fight`);
      s.shake(0.3, 0.8);
      await s.narrate(which === 'a'
        ? 'The noise carries. Something heavy and glittering hauls itself up over the edge of the island.'
        : 'The noise carries through the hull. Down in the dark of the hold, something answers, and comes up the ladder.');
      const r = await s.battle(which === 'a' ? 'c6_sea_winch_a' : 'c6_sea_winch_b', { bg: 'ruin' });
      if (r !== 'win') return;
    }
    s.setFlag(flag);
    s.sfx('rumble');
    s.clearBlocker(`c6_chain_${which}`);
    await s.narrate('You put your whole weight on the crank. It gives, all at once. Far off to the east, with a sound like a bell dropped down a well, a chain-lock comes open.');
    if (s.flag('c6_winch_a') && s.flag('c6_winch_b')) {
      s.objective('Both winches are turned. Cross the strait bridge east of the hub.');
      s.journal('I turned both salvagers\' winches. The strait bridge is open.');
    }
  },

  async hymnal(s) {
    await s.narrate('A Choir hymnal, swollen with damp, wedged under a crate. It falls open by itself at a page that has been opened many times. The song is called _The Vespersong — Draft Thirty-One._');
    await s.narrate('In the margin, in a small, careful hand: _Not yet. The measure is wrong. Lysa would laugh at this line._');
    if (!s.flag('c6_hymnal')) {
      s.setFlag('c6_hymnal');
      await s.think('Wren', '...I know that handwriting. I have forty letters in that handwriting.');
      await s.think('Wren', '"The measure is wrong." He knew. Some part of him knew it was wrong, and he sang it anyway.');
      await s.think('Wren', '...So did I.');
    }
  },

  async silk(s) {
    if (s.has('c6_choir_silk') || s.flag('c6_kite_done')) return s.narrate('What\'s left of the _Psalm_\'s banner, flapping in the ash-wind.');
    if (!s.flag('c6_kite')) return s.narrate('A Choir banner of white silk, still bright under the soot. The gold sunburst on it is almost the color of the real thing.');
    await s.narrate('A Choir banner of white silk, still bright under the soot. You cut a good wide piece free.');
    await s.give('c6_choir_silk');
  },

  async glassback(s) {
    if (s.flag('c6_glassback')) return;
    s.shake(0.3, 1.0);
    await s.narrate('The quarry floor heaves. A shape unfolds out of the glass — man-shaped, almost, twice as tall as a man, and so clear you can see the seven wounds of the sky bent through its body.');
    const r = await s.battle('c6_bounty_glassback', { bg: 'ruin' });
    if (r !== 'win') return;
    s.setFlag('c6_glassback');
    await s.narrate('Glassback shatters into a million pieces. In the middle of the heap, something still glows: a fist-sized core, warm as a hearthstone.');
    await s.give('c6_glass_core');
  },

  async lidless(s) {
    if (s.flag('c6_lidless')) return;
    s.music('gloam');
    await s.narrate('The perch is quiet. Too quiet. Then the dark at the edge of the island opens, and keeps opening, and is an eye.');
    const r = await s.battle('c6_bounty_lidless', { bg: 'gloam' });
    if (r !== 'win') return;
    s.setFlag('c6_lidless');
    s.music('ruin');
    await s.narrate('The Lidless closes, at last. Where it was, a single cold violet orb rolls across the stones and stops against your boot.');
    await s.give('c6_lidless_eye');
  },

  async hearth(s) {
    if (s.flag('c6_hearth')) return;
    s.setFlag('c6_hearth');
    s.music('sad');
    await s.narrate('Someone made a camp here once — a ring of stones, a cold firepit, a Hearthstone humming quietly to itself. Beyond the next bridge, the ash in the air goes thick and dark, and something very large is moving through it.');
    await s.narrate('You take out your mother\'s lamp and set it on a stone beside you.');
    await s.say('Wren', 'Mom. I\'m going to find them. All of them.');
    await s.say('Wren', 'And then I\'m going to— I don\'t know yet. Something. I\'m going to fix something.');
    await s.wait(1.2);
    await s.narrate('The little flame doesn\'t answer.');
    await s.narrate('It doesn\'t go out, either.');
    s.music('ruin');
  },

  async brinefang(s) {
    if (s.flag('c6_brinefang')) return;
    s.stopMusic(0.5);
    await s.wait(0.6);
    s.shake(0.4, 1.6);
    await s.narrate('The island lurches. Up from the abyss below — slowly, the way a whale rises — comes a serpent the length of a street, swimming through the empty air as if it were still the sea.');
    await s.narrate('Its scales are crusted white with old brine. Its eyes are the violet of the Gloam. And across its jaw there\'s a long, ragged scar, the shape of a Dawnguard shield.');
    await s.say('Wren', '...Brinefang?');
    await s.say('Wren', 'You\'re the one from the strait. From the boat. Bram threw up on you.');
    await s.narrate('It does not remember. Or it remembers wrong. It opens its mouth.');
    await s.say('Wren', 'Okay. Okay. Last time it took four of us.');
    await s.say('Wren', '...I guess I\'ll just have to be four people.');
    const r = await s.battle('c6_boss_brinefang', { bg: 'sky' });
    if (r !== 'win') return;
    s.setFlag('c6_brinefang');
    s.music('sad');
    await s.narrate('Brinefang shudders all down its endless length. Then it stops swimming. It hangs in the air for a moment, as if surprised — and slides, gently, tail first, down off the edge of the island into the dark.');
    await s.say('Wren', 'Go on. Go find your sea. It\'s up there somewhere.');
    s.objective('Cross the last bridge east, toward Aurenne.');
    s.journal('The Unmoored was Brinefang — the serpent from the strait, the one we fought on Tobias\'s boat. It took four of us last time. This time it took one.');
  },

  async farShore(s) {
    if (s.flag('c6_done') || !s.flag('c6_brinefang')) return;
    s.setFlag('c6_done');
    s.music('afterlight');
    await s.pan(71, 21, 2.0);
    await s.narrate([
      'Past the last bridge the islands crowd closer together, and then closer still, until they are not islands anymore but the broken edge of a continent.',
      'Far ahead, across a field of floating rubble, the towers of Aurenne stand against the bruised sky. Half of them are gone. Smoke rises from the rest — cookfires, not burning.',
      'And from the top of a broken bell-tower on the east side, someone has hung a white sheet, painted with a red cross.',
    ]);
    await s.say('Wren', '...Ilse.');
    await s.wait(1.0);
    await s.say('Wren', 'Okay.');
    await s.say('Wren', 'Okay. Let\'s go.');
    s.journal('I crossed the Shattered Sea. Aurenne is ahead — and a hospital flag on the cathedral. I\'m coming, Ilse.');
    await s.fadeOut(1.5);
    await s.chapter(7, 'The Mender of Ash');
    s.objective('Find the Ember Ward in the ruins of Aurenne.');
    await s.teleport('ruined_aurenne', 20, 38, 'up');
  },
};
