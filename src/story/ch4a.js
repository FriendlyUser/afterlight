// CHAPTER 4 — "The Pilgrim Road" (first half, part one)
// The Sunscar: the road east, the wreck of the Halcyon, Saltglass, Keeper Tamsin,
// Pip's illegal Kindling, and the Glass Caverns.

/** Spawn temporary stand-ins for party members: [[id, x, y, dir], ...] -> actors `${id}_c`. */
export function crew(s, list) {
  for (const [id, x, y, dir] of list) if (s.state.party.includes(id)) s.spawn(`${id}_c`, id, x, y, dir);
}
export function dismiss(s, ids) { for (const id of ids) s.remove(`${id}_c`); }
export const has = (s, id) => s.state.party.includes(id);
const PARTY = ['ilse', 'bram', 'sable', 'pip', 'corvin'];

export const C4A = {
  // =================================================================== The Pilgrim Road
  async roadOpening(s) {
    if (s.flag('c4a_arrived')) return;
    s.setFlag('c4a_arrived');
    s.music('desert');
    crew(s, [['ilse', 2, 19, 'right'], ['bram', 2, 21, 'right'], ['sable', 3, 20, 'right'], ['pip', 1, 20, 'right']]);
    await s.wait(0.6);
    await s.narrate(['East of Aurenne, the Pilgrim Road leaves the green behind.', 'The grass goes yellow, then grey, then gives up altogether.']);
    await s.say('Pip', 'It\'s hot.');
    await s.say('Bram', 'It is a _dry_ heat.');
    await s.say('Pip', 'It\'s a _hot_ heat. My eyebrows are sweating. I didn\'t know eyebrows could _do_ that.');
    await s.move('sable_c', [[6, 20], [7, 21]]);
    s.face('sable_c', 'right');
    await s.say('Sable', 'The ground is the sea. But dry. And it does not move.');
    await s.say('Ilse', 'It moves. Dunes walk a few feet every year.');
    await s.wait(0.5);
    await s.say('Sable', '...I will watch one.');
    await s.say('Ilse', 'Three things. One: everyone drinks every hour whether they want to or not. Two: nobody takes their boots off. Scorpions. Three: Bram, take off that cape before you cook in it.');
    await s.say('Bram', 'A Dawnguard never removes his cape.');
    await s.say('Ilse', 'You were exiled.');
    await s.say('Bram', 'A Dawnguard never removes his cape _emotionally_.');
    s.face('player', 'left');
    await s.narrate('Wren checks the case at her hip for the hundredth time. Five silver tuning forks in velvet, sealed with the Choir\'s sunburst.');
    await s.say('Wren', 'Saltglass first. Keeper Tamsin. Then north to Frosthollow, then east. One fork for every Lantern.');
    await s.say('Pip', '"To harmonize the Lanterns against the rising Gloam." Fancy words for _delivery job_.');
    await s.say('Wren', 'It\'s not a delivery job. The Hierophant asked _us_, Pip. Out of everyone in Aurenne.');
    await s.say('Pip', 'Yeah. We\'re cheap, too.');
    s.face('player', 'right');
    await s.think('Wren', '"A restless heart, like mine." That\'s what he wrote to me, once. I\'m not going to let him down.');
    dismiss(s, PARTY);
    s.objective('Follow the Pilgrim Road east across the Sunscar to Saltglass.');
    s.journal('We left the green behind. Five forks in the case, one for every Keeper who still has a Lantern. Saltglass first. Pip says it\'s a delivery job. It is NOT a delivery job.');
  },

  async ysmay(s) {
    await s.say('Ysmay', s.flag('c4a_corvin_joined')
      ? ['Back again, loves? And with a sky-pirate in tow. Count your fingers after you shake his hand.']
      : ['Last sweet water before the Sunscar, loves. After this it\'s sand, glass, and liars.', 'I\'m only one of those. You can guess which.']);
    await s.shop('c4a_waystation');
  },

  async arch(s) {
    await s.narrate('The Pilgrim\'s Arch. Every traveler who passes taps it for luck; the stone is worn smooth at hand height.');
    if (has(s, 'sable') && !s.flag('c4a_arch_tap')) {
      s.setFlag('c4a_arch_tap');
      await s.say('Sable', 'Does it work?');
      await s.say('Bram', 'It\'s tradition. Tradition doesn\'t have to work, it just has to be old.');
      await s.narrate('Sable taps the arch. Then, after some thought, taps it again for Wren.');
    }
  },

  // =================================================================== The Sunscar
  async smoke(s) {
    if (s.flag('c4a_smoke_seen')) return;
    s.setFlag('c4a_smoke_seen');
    await s.say('Bram', 'Smoke! To the north — see it? Past the canyon.');
    await s.pan(41, 3, 1.4);
    await s.say('Ilse', 'Black smoke. That\'s not a campfire. Something big is burning.');
    await s.say('Pip', 'Could be loot. I mean, people. Could be people. In danger. Who might have loot.');
    await s.follow(0.8);
    await s.say('Wren', 'Come on!');
    s.objective('Investigate the smoke beyond the northern canyon.');
  },

  async mirageWren(s) {
    if (s.flag('c4a_mirage_wren')) return;
    s.setFlag('c4a_mirage_wren');
    await s.narrate('The glass flats shimmer. The horizon bends like a reflection in a spoon.');
    await s.say('Wren', '...Ilse. Look.');
    await s.pan(33, 31, 1.6);
    await s.narrate(['Out on the glass, impossibly far and impossibly clear: a lighthouse on a black bluff, its beam turning slowly over a sea that isn\'t there.', 'And on the dock below it, a woman with a long braid, shading her eyes. Looking east.']);
    await s.say('Wren', 'That\'s Lanternfall. That\'s— Mom?');
    await s.say('Ilse', 'Wren. It\'s a mirage. We\'re a hundred leagues from the sea.');
    await s.say('Wren', 'I know. I _know_.');
    await s.wait(0.8);
    await s.say('Wren', 'She\'d hate this, you know. The heat. She\'d say I was going to get sunstroke, and that I\'d forgotten my hat, and—');
    await s.say('Ilse', 'You did forget your hat.');
    await s.wait(0.6);
    await s.say('Wren', '...Okay.');
    await s.say('Ilse', 'Drink. All of it. Then we keep walking.');
    await s.narrate('When Wren looks again, the lighthouse is gone. Only glass, and the white sky, and the heat.');
    await s.follow(0.8);
    s.journal('On the glass flats I saw Lanternfall — and Mom on the dock, looking east. A mirage. Ilse made me drink a whole canteen and didn\'t say anything else, which is how I know she saw my face.');
  },

  async mirageSable(s) {
    if (s.flag('c4a_mirage_sable') || !has(s, 'sable')) return;
    s.setFlag('c4a_mirage_sable');
    await s.say('Sable', 'There is a city on the glass.');
    await s.say('Bram', 'Where? I see sand. And more sand. And— is that a cactus, or a very still man?');
    await s.say('Sable', 'White towers. Bells. Flags for a festival. Everyone is laughing. It is afternoon there.');
    await s.wait(0.6);
    await s.say('Sable', 'It is _always_ afternoon there.');
    await s.say('Wren', 'Sable? Have you seen it before?');
    await s.say('Sable', '...In the water. Before you found me. I think I was walking toward it.');
    await s.wait(0.8);
    await s.say('Sable', 'I do not want to walk toward it anymore.');
    s.journal('Sable saw a white city on the glass where it is always afternoon. She said she used to be walking toward it. She said she doesn\'t want to anymore.');
  },

  async skull(s) {
    await s.narrate('A skull the size of a fishing boat, bleached and polished by the wind. Its eye sockets are full of sand.');
    if (has(s, 'pip') && !s.flag('c4a_skull_pip')) {
      s.setFlag('c4a_skull_pip');
      await s.say('Pip', 'Bet I could fit in its mouth.');
      await s.say('Ilse', 'Please don\'t test that.');
      await s.say('Pip', 'Bet I could fit in its mouth _twice_.');
    }
  },

  async oasis(s) {
    await s.narrate('Water, clear as glass, in the middle of all that sand. It doesn\'t look real. It is.');
    if (has(s, 'sable') && !s.flag('c4a_oasis_sable')) {
      s.setFlag('c4a_oasis_sable');
      await s.say('Sable', 'It is warm on top and cold underneath. It has layers.');
      await s.say('Sable', 'Like bread.');
    }
  },

  async sef(s) {
    if (s.flag('c4a_sef_gift')) return s.say('Old Sef', ['Keep walking, young ones. Or don\'t.', 'Either one is a choice. That\'s the only thing the desert ever taught me.']);
    s.setFlag('c4a_sef_gift');
    await s.say('Old Sef', ['Visitors! Sit, sit. The palms don\'t mind.', 'Thirty years I\'ve lived by this water. Do you know what a desert is for?']);
    await s.say('Wren', 'Being... hot?');
    await s.say('Old Sef', 'Wanting things. Out there, every mirage is the thing you want most. The desert shows it to you. Then you decide whether to keep walking toward it.');
    const c = await s.choice(['"Have you ever seen one?"', '"That sounds lonely."']);
    if (c === 0) {
      await s.say('Old Sef', ['Every morning. A girl in a blue dress, at a well in Aurenne. I was going to ask her to dance.', 'I came out here to make enough money to deserve her. She married a baker. Forty years ago.']);
      await s.say('Old Sef', 'Still. I see her every morning, at her well, laughing at something. I\'ve decided it\'s a nice way to start the day.');
    } else {
      await s.say('Old Sef', ['Lonely? Child, I have palms, a pond, and the finest view of nothing in all Solmere.', '...Yes. Yes, it is. Thank you for noticing. Nobody notices.']);
    }
    await s.say('Old Sef', 'Here. Glass-cutter\'s goggles. They won\'t stop the mirages, but they stop the glare. The mirages, you have to stop yourself.');
    await s.give('sun_goggles');
  },

  // ------------------------------------------------------------------ Sarn the Jackal (bounty)
  async sentry(s) {
    if (!s.flag('c4a_sarn_taken')) {
      await s.say('Raider Sentry', 'Move along, glass-walkers. This is Sarn\'s water. Sarn\'s sand. Sarn\'s shade.');
      if (has(s, 'pip')) {
        await s.say('Pip', 'Sarn\'s very possessive.');
        await s.say('Raider Sentry', 'Sarn\'s very _stabby_.');
      }
      return;
    }
    await s.say('Raider Sentry', '...Wait. You\'re Idris\'s dogs. SARN! WE GOT COMPANY!');
    return C4A.sarn(s);
  },

  async sarn(s) {
    if (!s.flag('c4a_sarn_taken')) {
      return s.say('Sarn the Jackal', ['Ha! Pilgrims! Got water? Got gold? Got a pretty sword?', 'No? Then you\'ve got nothing I want. Walk on, little lambs. Walk on before I change my mind.']);
    }
    await s.say('Sarn the Jackal', 'Idris sent _children_? I\'m insulted. I\'m going to take your boots _and_ your dignity.');
    if (has(s, 'corvin')) await s.say('Corvin', 'Funny. That\'s exactly what my last landlady said.');
    const r = await s.battle('boss_c4a_sarn', { bg: 'desert' });
    if (r !== 'win') return;
    s.setFlag('c4a_sarn_dead');
    ['sarn', 'sentry', 'raider2'].forEach((id) => s.remove(id));
    await s.narrate('Sarn the Jackal staggers, spits sand, and bolts for the deep dunes, howling about revenge. His crew scatters after him like startled birds.');
    await s.say('Bram', 'And STAY OUT of... wherever this is!');
    s.journal('We ran Sarn the Jackal out of his camp. Captain Idris owes us a purse.');
  },

  // =================================================================== The Halcyon
  async halcyonWreck(s) {
    if (s.flag('c4a_corvin_joined')) return;
    s.music('tension');
    s.spawn('corvin_n', 'corvin', 19, 12, 'down');
    crew(s, [['ilse', 17, 28, 'up'], ['bram', 19, 28, 'up'], ['sable', 16, 28, 'up'], ['pip', 20, 28, 'up']]);
    await s.pan(18, 15, 1.4);
    await s.narrate('An airship lies nose-down in the dune like a beached whale. Smoke curls from her engine housing. Her name is painted on the bow in flaking gold: HALCYON.');
    s.sfx('gun');
    await s.say('???', 'Not the ship! Anything but the ship!', { portrait: false });
    s.shake(0.3, 1.2);
    await s.narrate('Between the ship and the party, the sand bulges — and something vast and pale turns over beneath it, like a fish under ice.');
    s.sfx('gun');
    await s.say('???', 'Eat the cargo! Eat the— no, not the cargo either, that\'s _paid for_—', { portrait: false });
    await s.follow(0.6);
    await s.move('player', [[18, 24]]);
    await s.say('Wren', 'Hey! Up there! Are you all right?');
    s.face('corvin_n', 'player');
    await s.say('Corvin', '...Civilians! Wonderful! Run away, quickly, it\'s very hungry!');
    await s.say('Bram', 'We\'re here to help!');
    await s.say('Corvin', 'Then help by being slower than me!');
    await s.move('corvin_n', [[19, 15], [19, 17], [19, 21]], 5);
    await s.say('Wren', 'Sable — keep Pip back!');
    await s.say('Pip', 'Oi! I can fight!');
    await s.say('Sable', 'You cannot. You have no light yet. I will stand with you.');
    await s.say('Pip', '...Fine. But I\'m _watching_. Aggressively.');
    s.shake(0.5, 1.5);
    await s.narrate('The dune splits open, and Sandmaw rises out of it, shedding sand like water.');
    // Corvin fights in Sable's place; Sable guards Pip.
    await s.join('corvin', true);
    s.state.characters.corvin.setLevel(18);
    const before = s.state.party.slice();
    s.state.party = ['wren', 'ilse', 'bram', 'corvin', ...before.filter((id) => !['wren', 'ilse', 'bram', 'corvin'].includes(id))];
    const r = await s.battle('boss_c4a_sandmaw', { bg: 'desert' });
    if (r !== 'win') return;
    s.setFlag('c4a_corvin_joined');
    s.state.party = ['wren', 'ilse', 'bram', 'sable', 'corvin', 'pip'].filter((id) => s.state.party.includes(id));
    s.music('desert');
    await s.narrate('Sandmaw shudders, sinks, and is gone — leaving only a long ripple in the dune, slowly smoothing itself away.');
    await s.move('corvin_n', [[19, 23]], 3);
    s.face('corvin_n', 'player');
    await s.say('Corvin', 'Well! That was terrifying. I was magnificent. Did you see me being magnificent?');
    await s.say('Ilse', 'You hid behind Bram.');
    await s.say('Corvin', 'Tactically. Behind a tactical Bram.');
    await s.say('Bram', 'I _knew_ that was a real word.');
    await s.say('Corvin', 'Corvin Ashe. Captain of the Halcyon — finest airship in Solmere.');
    await s.say('Ilse', 'It\'s on the ground.');
    await s.say('Corvin', 'Temporarily. We had a navigational disagreement with a sandstorm. The sandstorm won on points.');
    s.face('corvin_n', 'bram_c');
    await s.wait(0.6);
    await s.say('Corvin', '...Dawnguard red. Hm.');
    await s.say('Bram', 'Squire. Was. Am. ...Sort of.');
    await s.say('Corvin', 'Relax, big lad. I deserted them too. Not that I\'m saying you deserted. Or that I did. Hypothetically.');
    s.face('corvin_n', 'player');
    await s.narrate('His eyes catch on the case at Wren\'s hip — on the Choir\'s gold sunburst — and stay there a moment too long.');
    await s.say('Corvin', 'That\'s Cassian\'s seal.');
    await s.say('Wren', 'Tuning forks. For the Keepers. The Hierophant asked us to carry them.');
    await s.wait(0.8);
    await s.say('Corvin', 'Cassian\'s errand-runners. Small world.');
    await s.say('Corvin', 'I owe that man my life, you know. Don\'t tell him I said so. He\'d want it back.');
    await s.say('Corvin', 'Where are you headed? Saltglass? Funny — that\'s exactly where I need to be. My girl needs lift-glass, and I need someone to walk between me and the next thing with teeth.');
    await s.say('Corvin', 'How do you feel about escorting a charming, handsome, _financially embarrassed_ captain across the dunes?');
    await s.say('Ilse', 'No.');
    await s.say('Wren', 'Yes.');
    await s.say('Ilse', 'Wren.');
    await s.say('Wren', 'He shot a sand wyrm for us.');
    await s.say('Corvin', '_At_ a sand wyrm. Near it. In its general direction.');
    if (has(s, 'pip')) await s.say('Pip', 'He\'s got a gun. I like him.');
    await s.say('Ilse', '...Three things. One: if he steals anything, he walks. Two: if he gets us killed, he walks. Three—');
    await s.say('Corvin', 'If I\'m charming, I stay? I accept your terms.');
    s.remove('corvin_n');
    dismiss(s, PARTY);
    await s.join('corvin');
    await s.system('Tip — Only the first four in your *Formation* fight. Change the order from the menu, or *Swap* a reserve member in during battle.');
    s.objective('Cross the Sunscar east to Saltglass.');
    s.journal('We found a crashed airship called the Halcyon, and a sand wyrm trying to eat it, and a sky-pirate called Corvin Ashe trying very hard not to be eaten. He says he owes the Hierophant his life. He\'s coming with us to Saltglass. Ilse has rules.');
  },

  async liftHousing(s) {
    const n = s.state.inventory.count('c4a_singing_glass');
    if (s.flag('c4a_lift_done')) return s.narrate('Three shards of saltglass sit in the brass housing, humming quietly to themselves. The Halcyon is dreaming of the sky.');
    if (!s.flag('c4a_corvin_joined')) return;
    if (n < 3) {
      await s.narrate(`A ring of brass sockets, each the size of a fist. ${n ? `${n} of 3 shards would fit` : 'Something used to sit in them'}.`);
      if (has(s, 'corvin')) await s.say('Corvin', 'Three good pieces of singing glass, sparrow. Then she\'ll remember how to float.');
      return;
    }
    s.setFlag('c4a_lift_done');
    await s.take('c4a_singing_glass', 3);
    s.spawn('corvin_l', 'corvin', 19, 10, 'up');
    await s.say('Corvin', 'Well. Would you look at that.');
    await s.narrate('Corvin fits the shards into the brass housing one by one, the way a man sets the table for guests he\'d stopped expecting.');
    s.sfx('holy');
    s.flash('#e8fbff', 0.6);
    s.shake(0.15, 1.5);
    await s.narrate(['The glass begins to sing — a low, clean note you feel in your teeth. The deck shivers.', 'For one long breath, the Halcyon lifts a finger\'s width off the sand.', '...And settles back with a groan.']);
    if (has(s, 'pip')) await s.say('Pip', 'It didn\'t fly.');
    await s.say('Corvin', 'She _floated_. Briefly. With dignity. The rest is only engines, rigging, a new rudder and roughly nine thousand gold.');
    await s.say('Corvin', 'But she remembers how. That\'s the hard part.');
    await s.say('Wren', 'You\'ll come back for her?');
    await s.wait(0.8);
    await s.say('Corvin', '...Yeah, sparrow. I\'ll come back for her. Leaving\'s the thing I\'m good at. Coming back is the bit I\'m still learning.');
    await s.say('Corvin', 'Here. From her chronometer — no use to her while she\'s grounded. Keeps you half a step ahead of everything. Trust me, I\'ve needed it.');
    await s.give('haste_anklet');
    s.remove('corvin_l');
    s.quest('c4a_lift_glass', null, null, 'done');
    s.journal('We set the singing glass in the Halcyon. She lifted — just a little. Corvin says she remembers how. I don\'t think he was only talking about the ship.');
  },

  // =================================================================== Saltglass
  async saltglassArrival(s) {
    if (s.flag('c4a_saltglass_arrived')) return;
    s.setFlag('c4a_saltglass_arrived');
    crew(s, [['ilse', 3, 18, 'right'], ['bram', 2, 20, 'right'], ['sable', 4, 20, 'right'], ['corvin', 1, 19, 'right'], ['pip', 4, 18, 'right']]);
    await s.wait(0.4);
    await s.narrate('Saltglass rises out of the flats like something grown rather than built: white walls, blue doors, and glass everywhere — in the windows, in the streets, hung from every eave on strings, chiming in the hot wind.');
    await s.pan(24, 6, 1.6);
    await s.narrate('Above it all stands the Lantern, its lamp-room walled in saltglass panes. Even at noon you can see it burning.');
    await s.follow(1);
    await s.say('Corvin', 'Saltglass. Best card tables south of Aurenne, and the worst people sitting at them. I\'m one of them, so I\'m allowed to say that.');
    await s.say('Ilse', 'Who do you owe money to here?');
    await s.say('Corvin', 'Define "owe."');
    await s.say('Corvin', 'Listen, sparrow. While you do your holy errand, I need lift-glass for my girl. The singing kind, three good pieces. The market sells it for more than I\'m worth — which, granted, isn\'t much.');
    await s.say('Corvin', 'The cave folk dig it out of the Glass Caverns, out the east gate. Not that I\'m asking.');
    await s.say('Wren', 'We\'ll help.');
    await s.say('Corvin', 'I wasn\'t asking.');
    await s.say('Wren', 'I know.');
    await s.wait(0.6);
    await s.say('Corvin', '...Huh.');
    dismiss(s, PARTY);
    s.quest('c4a_lift_glass', 'The Halcyon\'s Lift-Glass', 'Corvin needs three pieces of singing saltglass to wake his airship. It grows deep in the Glass Caverns, out Saltglass\'s east gate. Bring them to the wreck of the Halcyon.');
    s.objective('Find Keeper Tamsin in the Saltglass Lantern (north plaza).');
    s.journal('Saltglass is all white walls and wind-chimes and glass. The Lantern burns at noon. Corvin "isn\'t asking" for help finding lift-glass. We\'re helping anyway.');
  },

  async marisol(s) {
    if (!s.flag('c4a_tamsin_met')) return s.say('Sister Marisol', ['The Keeper is expecting you. She\'s been expecting you since yesterday.', 'Don\'t ask me how. I stopped asking her how years ago. It\'s much more restful.']);
    if (s.flag('c4a_done')) return s.say('Sister Marisol', ['Six children came down from the mountain with a monk who keeps apologizing to doors.', 'The Keeper took one look at them and said, "Well. I suppose I\'m a grandmother now." She hasn\'t stopped smiling since.']);
    return s.say('Sister Marisol', ['The Keeper lost her sight looking into the lamp. Forty years of dawns.', 'She says she sees better now. She says most people only ever look at the light, never at what it\'s shining on.']);
  },

  async leyla(s) {
    await s.say('Leyla', ['Saffron, salt-pepper, dried sunfruit! Nothing fresh, everything delicious.', 'You came up the Pilgrim Road? Then you missed the soldiers. Grey cloaks, forty of them, riding north last week.', 'Didn\'t buy a thing. Didn\'t even _haggle_. That\'s how you know someone\'s dangerous.']);
  },

  async dima(s) {
    if (s.flag('c4a_done')) return s.say('Old Dima', ['The Lantern hums at dawn now. Lower than it used to. The Keeper sits up listening to it.', 'She says it\'s the sound of a song deciding something.']);
    return s.say('Old Dima', ['Water! Cool water, drawn this hour from the deep well! One gold a cup, and the cup\'s free.', 'Strange thing — the Lantern\'s been humming at dawn this season. Low, like a cat. The Keeper\'s been up all night listening to it.', 'I asked her what it was saying. She said, "I don\'t know, Dima. That\'s what frightens me."']);
  },

  async zeyneb(s) {
    if (s.flag('c4a_jorah_freed')) {
      if (!s.flag('c4a_zeyneb_chime')) {
        s.setFlag('c4a_zeyneb_chime');
        return s.say('Grandmother Zeyneb', ['Forty. There are forty chimes on my eaves now.', 'I took one down this morning. Jorah\'s. First one I\'ve ever taken down in eleven years.', 'My hands shook. Isn\'t that silly? An old woman, crying over a piece of glass on a string.']);
      }
      return s.say('Grandmother Zeyneb', 'Forty. I like forty better than forty-one. I\'d like thirty-nine even better. Bring me another miracle, child.');
    }
    return s.say('Grandmother Zeyneb', ['Every chime on my eaves is a caravan that didn\'t come back. Forty-one of them.', 'The wind plays them for me, so I don\'t have to remember alone.', 'The newest one is Jorah\'s. Asha won\'t look at it. I don\'t blame her.']);
  },

  async chimes(s) {
    await s.narrate(s.flag('c4a_jorah_freed')
      ? 'Glass chimes on strings — forty of them — ringing softly in the wind. There\'s a gap in the row where one used to hang.'
      : 'Glass chimes on strings — forty-one of them — ringing softly in the wind. Each one is scratched with a name.');
  },

  async ruel(s) {
    if (!s.flag('c4a_ruel_met')) {
      s.setFlag('c4a_ruel_met');
      await s.say('Master Ruel', ['Lift-glass? Ha! Everyone wants lift-glass. Sky-pirates, mostly. You have the look.']);
      if (has(s, 'corvin')) await s.say('Corvin', 'I have a _very_ trustworthy look.');
      await s.say('Master Ruel', ['Singing glass grows deep in the Glass Caverns, where the old Lantern-light soaked into the sand for a thousand years.', 'It hums to sunlight. And to music, they say — if you\'ve got the right note. Old Keeper\'s trick. Nobody\'s got the right note anymore.']);
      return;
    }
    return s.say('Master Ruel', ['Glass is just sand that\'s been through something.', 'Like people. Hotter the fire, clearer the glass. That\'s my philosophy, and also my sales pitch.']);
  },

  async idris(s) {
    if (s.flag('c4a_sarn_paid')) return s.say('Captain Idris', 'Not a raider in sight since you ran off the Jackal. My men are bored. Bored is beautiful.');
    if (s.flag('c4a_sarn_dead')) {
      s.setFlag('c4a_sarn_paid');
      await s.say('Captain Idris', ['Sarn ran? The Jackal himself? Ha! The caravans will drink to you for a month.', 'The council\'s purse, as promised. Don\'t spend it all in the inn. Do spend some of it in the inn. My cousin runs it.']);
      await s.gold(2000);
      s.quest('c4a_sarn', null, null, 'done');
      return;
    }
    if (s.flag('c4a_sarn_taken')) return s.say('Captain Idris', 'Sarn\'s camp is in the south-east flats, past the glass. Red tents. Mind his slingers — they aim for the eyes.');
    s.setFlag('c4a_sarn_taken');
    await s.say('Captain Idris', ['Pilgrims with swords. Good. I\'ve a job, if you want it.', 'Sarn the Jackal: raider-king of the southern dunes. Camp\'s in the south-east flats. He takes a tithe from every caravan — water, coin, sometimes people.', 'My men can\'t touch him; they\'re needed on the walls. The town council has put up two thousand gold to see him gone.']);
    s.quest('c4a_sarn', 'The Jackal\'s Tithe', 'Captain Idris will pay 2,000 gold to see Sarn the Jackal driven from his camp in the south-east of the Sunscar (west of Saltglass).');
  },

  async nimGate(s) {
    if (!s.flag('c4a_nim_met')) {
      s.setFlag('c4a_nim_met');
      await s.say('Nim', ['Papa\'s caravan is late. Mama says he\'s just slow.', 'Papa\'s not slow. Papa\'s the fastest scout on the whole salt road. So he\'s not late. He\'s just... not here yet.']);
      if (has(s, 'pip')) {
        await s.say('Pip', '...How long you been waiting?');
        await s.say('Nim', 'Nine days. I bring my lunch.');
      }
      return;
    }
    return s.say('Nim', 'If you see Papa, tell him I\'m waiting at the gate. He\'ll know which one. It\'s this one.');
  },

  async teo(s) {
    if (s.flag('c4a_pip_kindled')) return s.say('Teo', ['He\'s ELEVEN?! He got Kindled at ELEVEN?!', 'I\'ve been waiting fifteen years and eleven months! I\'ve been _good!_', '...What did he get? Rogue? Okay. Okay, I feel a little better.']);
    return s.say('Teo', ['Fifteen years and eleven months. ELEVEN MONTHS. And they won\'t let me stand in the light for thirty more days.', 'What if it changes its mind? What if the light was going to say Arcanist and in thirty days it says Accountant?']);
  },

  async oyelaran(s) {
    if (s.flag('c4a_queen_dead') && s.flag('c4a_queen_taken') && !s.flag('c4a_queen_paid')) {
      s.setFlag('c4a_queen_paid');
      await s.say('Oyelaran', ['The Queen is dead? Truly? ...My brother\'s caravan went into that dark eleven years ago.', 'Three thousand gold, as I promised. And this — it was his. He\'d have wanted it worn by someone braver than a caravan master.']);
      await s.gold(3000);
      await s.give('vigor_bangle');
      s.quest('c4a_queen', null, null, 'done');
    }
    if (!s.flag('c4a_tamsin_met')) {
      return s.say('Oyelaran', ['Caravans north leave when the Keeper says the stars are right. She hasn\'t said.', 'Go and see her. Everybody goes and sees her. Then they come back here looking thoughtful and pay me.']);
    }
    if (!s.flag('c4a_queen_taken')) {
      s.setFlag('c4a_queen_taken');
      await s.say('Oyelaran', ['Tamsin says I owe her? I owe her my eyes, my caravan, and my second wife. Fine. North it is, whenever you\'re ready.', 'One more thing, since you look like the sort who goes into caves. The Glass Caverns, out the east gate — there\'s a Queen down there.', 'A sand wyrm, old as sin and twice as hungry. She ate my brother\'s caravan. Ate the Kessel caravan nine days ago, I\'d wager. Kill her, and I\'ll pay three thousand gold.']);
      s.quest('c4a_queen', 'Queen of the Glass', 'Caravan Master Oyelaran will pay 3,000 gold for the death of the Sand Wyrm Queen, deep in the Glass Caverns beyond Saltglass\'s east gate.');
    }
    const c = await s.choice(['Travel north to the Greyspine', 'Not yet'], { prompt: 'Nine days north by caravan. (You can return to Saltglass later.)', cancel: 1 });
    if (c !== 0) return s.say('Oyelaran', 'The wagons will wait. The wagons always wait. It\'s the camels that get impatient.');
    return C4A.travelNorth(s);
  },

  async travelNorth(s) {
    await s.fadeOut(1.2);
    s.stopMusic(1.5);
    await s.narrate(['Nine days north by caravan: across the flats, through the scrublands, up into country where the air turns thin and the wind tastes of iron.', 'At the foot of the Greyspine, Oyelaran\'s wagons turn back.', '"This is as far as wheels go," he says. "The monastery\'s a day\'s climb. Walk softly. The mountain listens."']);
    s.setFlag('c4a_to_greyspine');
    await s.teleport('c4a_greyspine_pass', 20, 55, 'up');
  },

  // ------------------------------------------------------------------ Keeper Tamsin & Pip's Kindling
  async tamsin(s) {
    if (s.flag('c4a_tamsin_met') || !s.flag('c4a_saltglass_arrived')) return;
    s.setFlag('c4a_tamsin_met');
    s.spawn('tamsin_s', 'tamsin', 7, 4, 'down');
    crew(s, [['ilse', 6, 11, 'up'], ['bram', 8, 11, 'up'], ['sable', 5, 10, 'up'], ['pip', 9, 10, 'up'], ['corvin', 10, 11, 'up']]);
    s.place('player', 7, 10, 'up');
    await s.wait(0.5);
    await s.narrate(['Inside, the light comes from everywhere at once — from the lamp above, from the glass walls, from the glass floor — and none of it casts a shadow.', 'A woman sits on the steps of the dais with a cane across her knees. Her eyes are the milky white of saltglass. She is smiling at the door before it opens.']);
    await s.say('Tamsin', 'Six of you. No — five, and one who walks like a cat that\'s been told off.');
    await s.say('Pip', 'Oi!');
    await s.say('Tamsin', 'A big one who walks like he\'s apologizing to the floor.');
    await s.say('Bram', '...Sorry.');
    await s.say('Tamsin', 'A careful one who counts her steps. A man already looking for the back door.');
    await s.say('Corvin', 'In my defense, there usually is one.');
    await s.say('Tamsin', 'And one who doesn\'t walk quite the way the rest of you do. You... drift. Like a song somebody\'s humming.');
    await s.say('Sable', 'I walk. I have feet.');
    await s.say('Tamsin', 'So you do, sweetling. So you do.');
    await s.wait(0.6);
    await s.say('Tamsin', 'And the one in front walks like someone leaving. Come here, Wren Halloway.');
    await s.move('player', [[7, 7]]);
    await s.say('Wren', 'How do you know my—');
    await s.say('Tamsin', 'Ysolde\'s girl. I knew your grandmother\'s step, and your mother\'s. You have both. Your mother hated being told that.');
    await s.say('Wren', '...She still does.');
    await s.say('Tamsin', 'Good. Now. What has Cassian sent me?');
    await s.narrate('Wren opens the case. Tamsin\'s fingers find a fork without searching, the way you find a light switch in your own house.');
    s.sfx('holy');
    await s.narrate('She strikes it once against her cane and holds it to her ear. The note is pure and thin, and it goes on much longer than it should.');
    await s.wait(1.2);
    await s.narrate('Tamsin\'s smile goes away.');
    await s.say('Tamsin', '...It sings a note I almost know.', { speed: 0.7 });
    await s.say('Ilse', 'Is something wrong with it?');
    await s.say('Tamsin', 'Like a word in a language I used to speak. Like a name I heard in a dream and lost on waking.');
    await s.say('Tamsin', 'I\'ve listened to the Dawnsong every morning for fifty-one years, child. I know every note of it the way you know your mother\'s voice. This is one of them. And it is not.');
    await s.say('Wren', 'The Hierophant had them made in the Cathedral. To harmonize the Lanterns, against the Gloam—');
    await s.say('Tamsin', 'I know what he said. Cassian always says exactly the right thing.');
    await s.say('Tamsin', 'I\'ve known him since he was a boy who couldn\'t sleep unless a lamp was burning. I trust him to be exactly who he is.');
    await s.wait(1.0);
    await s.say('Tamsin', 'That is what worries me.');
    await s.narrate('She lays the fork back in its velvet, gently, like something that might bite.');
    await s.say('Tamsin', 'Take it to Halvard at Frosthollow, north in the Greyspine. He has forgotten more about the Dawnsong than the Choir ever knew. If Halvard says it is true, I will set it in my light with my own hands.');
    await s.say('Wren', 'And if he says it isn\'t?');
    await s.say('Tamsin', 'Then you will have learned something about the world, Wren Halloway. That\'s what sixteen is for.');
    if (has(s, 'pip')) await C4A.pipKindling(s);
    dismiss(s, PARTY);
    s.remove('tamsin_s');
    s.spawn('tamsin', 'tamsin', 7, 4, 'down', { name: 'Keeper Tamsin', run: (s2) => C4A.tamsinTalk(s2) });
    s.objective('Ask Caravan Master Oyelaran (north-east yard) for passage north to the Greyspine.');
  },

  async pipKindling(s) {
    await s.wait(0.6);
    await s.narrate('Pip has drifted up the dais steps, very casually, toward the little silver bell on Tamsin\'s belt.');
    s.sfx('steal');
    await s.move('pip_c', [[8, 6], [8, 5]], 2.5);
    s.face('tamsin_s', 'pip_c');
    await s.narrate('Tamsin\'s hand closes on his wrist without looking.');
    await s.say('Tamsin', 'And you, little cat.');
    await s.say('Pip', 'I was just — admiring. Professionally.');
    await s.say('Tamsin', 'How old are you?');
    await s.say('Pip', 'Sixteen.');
    await s.say('Tamsin', 'Mm.');
    await s.say('Pip', '...Fourteen.');
    await s.say('Tamsin', 'Mm.');
    await s.say('Pip', 'Twelve in the spring!');
    await s.say('Tamsin', 'Eleven, then.');
    await s.say('Pip', 'Eleven and a _HALF_.');
    await s.say('Tamsin', 'You\'re the only one of them without a light on you. I can feel it. Like a cold spot in a warm bath.');
    await s.say('Pip', 'Yeah, well. Choir says sixteen. Rules is rules. Not that I care. Crests are for people with houses.');
    await s.say('Tamsin', '_(quietly)_ Is that what they told you?');
    await s.wait(0.8);
    await s.say('Pip', '...Nobody had to tell me.');
    await s.wait(1.0);
    await s.say('Tamsin', 'The world\'s getting darker, little cat. I can\'t see much. But I can see that.');
    await s.say('Tamsin', 'I\'d like you to have something to hold on to.');
    await s.say('Ilse', 'Keeper — you can\'t. Kindling a child is forbidden. There are laws—');
    await s.say('Tamsin', 'Five years in an Aurenne cell, I believe. Are you going to tell on me, Mender?');
    await s.wait(0.6);
    await s.say('Ilse', '...I\'m going to write it down somewhere and not tell anyone where.');
    await s.say('Bram', 'Is it... safe? For him?');
    await s.say('Tamsin', 'Nothing worth doing is safe, squire. You of all people know that.');
    await s.wait(0.6);
    await s.say('Bram', '...Yes, ma\'am.');
    await s.say('Tamsin', 'Well, Pipkin Tallow? Will you step into my light?');
    await s.say('Pip', 'How do you know my— nobody calls me—', { speed: 0.8 });
    await s.wait(0.8);
    await s.say('Pip', '...Yeah. Yeah, okay. Yes.');
    s.music('kindling');
    await s.move('pip_c', [[8, 6], [7, 6]], 1.6);
    s.face('pip_c', 'up');
    s.face('tamsin_s', 'down');
    await s.narrate('Pip stands in the Lantern\'s light. His fists are clenched. His chin is up. He looks very small.');
    s.flash('#fff0c0', 0.9);
    s.sfx('revive');
    await s.wait(0.9);
    await s.narrate('The light goes all the way through him, warm as fresh bread — and for the first time anyone can remember, Pip forgets to look for the exits.');
    await s.say('Tamsin', 'Rogue.');
    await s.wait(1.0);
    await s.say('Pip', '...ROGUE?! The light called me a _THIEF?!_');
    await s.wait(0.8);
    await s.say('Pip', '...I mean. Fair.');
    s.awaken('pip');
    s.setFlag('c4a_pip_kindled');
    await s.system('Pip\'s Crest awakens — *Rogue*! His Crest Arts can now be used in battle.');
    s.face('pip_c', 'down');
    await s.hop('pip_c');
    await s.say('Pip', 'Wren. _Wren!_ I got one! I got a Crest! Nobody from the gutters ever— not before sixteen, not _ever_, some of \'em—');
    await s.hop('pip_c');
    await s.say('Bram', 'Make way! Rogue Pipkin Tallow, first of his name!');
    await s.move('bram_c', [[8, 9], [8, 7]], 3);
    await s.say('Pip', 'Put me DOWN, you big— okay, don\'t put me down yet.');
    if (has(s, 'corvin')) {
      await s.say('Corvin', 'Welcome to the trade, kid. Rule one: never tell anyone your real age.');
      await s.say('Pip', 'Way ahead of you.');
    }
    await s.say('Sable', 'Pip has a light now. It is small. It is very loud.');
    await s.narrate('Tamsin laughs — a real laugh, surprised out of her.');
    await s.say('Tamsin', 'They usually are, the small ones.');
    await s.say('Tamsin', 'Go on, all of you. The caravans for the Greyspine leave from the north yard. Ask for Oyelaran, and tell him I said he owes me.');
    await s.say('Tamsin', 'And Wren Halloway — you walk like someone leaving. Make sure you know what you\'re walking toward.');
    await s.system('Tip — Pip can fight now! Bring him into the active party from the menu\'s *Formation* screen.');
    s.journal('Keeper Tamsin listened to the fork and said it sings a note she almost knows. She sent us to Brother Halvard at Frosthollow. Then she Kindled Pip. ILLEGALLY. He\'s a Rogue. He hasn\'t stopped grinning, and neither has Bram.');
  },

  async tamsinTalk(s) {
    if (s.flag('c4a_done')) {
      return s.say('Tamsin', ['Tolle brought the little ones down the mountain. They sing on my steps every morning.', 'Badly. Loudly. Halvard would be delighted.', '...I heard his bell, you know. From here. The whole desert heard it.']);
    }
    const lines = [
      ['Cassian, as a boy? He used to sit right where you\'re standing and ask me why the sun needed help to come back.', 'I told him it didn\'t need help. It just liked being asked.'],
      ['Your friend with the drifting step. Keep her close, Wren.', 'Something is listening for her. I can hear it listening.'],
      ['The lamp has been humming at dawn this season. A little lower each morning, like a song deciding something.', 'Go to Halvard. Ask him what it\'s deciding.'],
    ];
    s.vars.c4aTamsin = ((s.vars.c4aTamsin ?? -1) + 1) % lines.length;
    return s.say('Tamsin', lines[s.vars.c4aTamsin]);
  },

  // ------------------------------------------------------------------ the inn: Corvin's debts
  async ines(s) {
    if (s.flag('c4a_debt_paid')) {
      return s.say('Velvet Ines', ['Ask him who the Halcyon\'s named after, little Keeper. Watch him lie.', 'He\'s a terrible liar. It\'s the only honest thing about him.']);
    }
    if (!has(s, 'corvin')) return s.say('Velvet Ines', 'You smell like a sky-pirate I know. Tell Corvin Ashe I can smell him from here.');
    if (!s.flag('c4a_debt_met')) {
      s.setFlag('c4a_debt_met');
      await s.say('Velvet Ines', 'Well, well. Corvin Ashe. Alive. My, my.');
      await s.say('Corvin', 'Ines! You look radiant. Have you done something with your— knives?');
      await s.say('Velvet Ines', 'Six hundred gold, Corvin. Plus the dignity you cost me when you left through the privy window.');
      await s.say('Corvin', '...It was a very dignified privy.');
      await s.say('Velvet Ines', 'Your captain bet me his lucky coin and lost it. Then he bet the coin I\'d won off him and lost it again — on credit. Six hundred.');
      s.quest('c4a_debt', 'Corvin\'s Debts', 'Velvet Ines, in the Cool Well inn, wants the 600 gold Corvin owes her.');
    }
    const c = await s.choice(['Pay 600 gold', 'Not today'], { prompt: `Pay Corvin's debt? (You have ${s.state.gold} gold)`, cancel: 1 });
    if (c !== 0) return s.say('Velvet Ines', 'I\'ll be here. I\'m always here. That\'s what makes me so frightening.');
    if (s.state.gold < 600) return s.say('Velvet Ines', 'Sweet of you. Come back when the sweetness has some gold in it.');
    await s.gold(-600, true);
    s.setFlag('c4a_debt_paid');
    await s.say('Velvet Ines', 'A Keeper\'s girl paying a pirate\'s debts. The world really is ending.');
    await s.say('Velvet Ines', 'Here. It was his. He\'ll tell you it\'s lucky. It isn\'t. It\'s just always been in his pocket while he was being stubborn.');
    await s.give('lucky_coin');
    await s.say('Corvin', 'That\'s my lucky coin.');
    await s.say('Wren', 'It doesn\'t seem very lucky.');
    await s.say('Corvin', 'It\'s still here, isn\'t it? So am I. That\'s the luck.');
    await s.say('Velvet Ines', 'Ask him who the Halcyon\'s named after, little Keeper.');
    await s.say('Corvin', '...It\'s a bird. A kingfisher. Very calm. Very— it\'s a _bird_, Ines.');
    s.quest('c4a_debt', null, null, 'done');
  },

  // ------------------------------------------------------------------ Asha, Nim & Jorah
  async asha(s) {
    if (s.flag('c4a_jorah_home')) return s.say('Asha', ['He sleeps eleven hours a night now. I let him.', 'For nine days I didn\'t sleep at all. Now we\'re taking turns being grateful.']);
    if (s.flag('c4a_jorah_freed')) return C4A.jorahReunion(s);
    if (s.flag('c4a_jorah_taken')) return s.say('Asha', 'The upper gallery of the Glass Caverns. That\'s where the Kessel caravan went in. Please.');
    s.setFlag('c4a_jorah_taken');
    await s.say('Asha', ['You\'ve met Nim, haven\'t you? Everyone meets Nim. She sits at the gate with her lunch.', 'Her father — my Jorah — went with the Kessel caravan through the Glass Caverns\' upper gallery. The short way to the eastern wells. Nine days ago.', 'The Kessel caravan never came out. Oyelaran says the Queen took it. Everyone says the Queen took it.']);
    await s.say('Asha', 'I don\'t believe it. I won\'t. Not until somebody has looked.');
    await s.say('Wren', 'We\'ll look.');
    s.quest('c4a_jorah', 'The Fastest Scout', 'Asha\'s husband Jorah went into the Glass Caverns with the Kessel caravan nine days ago and never came out. Search the caverns beyond Saltglass\'s east gate.');
  },

  async jorahReunion(s) {
    if (!s.flag('c4a_jorah_freed') || s.flag('c4a_jorah_home')) return;
    s.setFlag('c4a_jorah_home');
    await s.wait(0.3);
    await s.say('Nim', 'Papa came home! He came home and he was SO DIRTY!');
    await s.say('Jorah', 'And she made me take a bath before she\'d hug me. My own daughter.');
    await s.say('Asha', 'We owe you everything. We don\'t have everything. We have these.');
    await s.say('Asha', 'His running boots. Fastest scout on the salt road. He says he\'s finished running.');
    await s.give('swift_boots');
    await s.say('Jorah', 'I\'m finished running. Nine days in a glass box teaches you where you want to be standing.');
    if (has(s, 'pip')) {
      await s.say('Nim', 'You\'re the boy with the Crest! The little one!');
      await s.say('Pip', 'I\'m not little.');
      await s.say('Nim', 'You\'re littler than Papa.');
      await s.say('Pip', '...Everyone\'s littler than somebody.');
    }
    s.quest('c4a_jorah', null, null, 'done');
    s.journal('Jorah is home. Nim made him take a bath before she\'d hug him. Grandmother Zeyneb took a chime down.');
  },

  // =================================================================== The Glass Caverns
  async cavernsEntry(s) {
    await s.narrate('The caverns breathe out cool air that smells of salt and lightning. Somewhere deep inside, the walls are singing.');
    if (has(s, 'corvin')) await s.say('Corvin', 'Hear that? Singing glass. That\'s my girl\'s heartbeat, down there somewhere.');
    await s.say('Ilse', 'It\'s the wind.');
    if (has(s, 'sable')) await s.say('Sable', 'There is no wind.');
  },

  async pillar(s, key) {
    const flag = `c4a_res_${key}`;
    if (s.flag(flag)) return s.narrate('The pillar hums in harmony with its sisters. The note doesn\'t stop. You suspect it never will.');
    await s.narrate('A pillar of saltglass taller than Bram, clear as water. It hums — almost the note of the tuning fork, but not quite.');
    if (!(await s.confirm('Strike a tuning fork beside the pillar?'))) return;
    s.setFlag(flag);
    s.sfx('holy');
    s.flash('#d8f8ff', 0.5);
    await s.narrate('The fork rings. The pillar answers, a half-step lower, and the two notes lock together and hold.');
    const n = ['a', 'b', 'c'].filter((k) => s.flag(`c4a_res_${k}`)).length;
    if (n === 1) {
      if (has(s, 'corvin')) await s.say('Corvin', 'Your holy fork makes the glass sing, sparrow.');
      await s.say('Wren', 'It\'s _tuning_ it.');
      if (has(s, 'sable')) await s.say('Sable', 'It did not sound like tuning. It sounded like breaking. Slowly.');
    }
    await s.narrate('A shard of the pillar, still humming, comes away in Wren\'s hand.');
    await s.give('c4a_singing_glass');
    if (n < 3) return s.narrate(n === 1 ? 'Deep in the caverns, something answers the note.' : 'Deep in the caverns, something answers — louder now.');
    s.shake(0.4, 1.6);
    await s.narrate('Three notes ring through the caverns at once. Far to the east, something enormous made of glass cracks from top to bottom.');
    s.clearBlocker('queen_door');
    await s.say('Bram', 'Did anyone else hear a door open? I\'d like to not have heard a door open.');
  },

  async queenDoor(s) {
    await s.narrate(['A wall of saltglass seals the gallery, thick as a castle gate. Through it, blurred and huge, something pale slides past and is gone.', 'The glass hums three faint, different notes, as if waiting for an answer from somewhere else in the caverns.']);
  },

  async jorahWall(s) {
    await s.narrate('A wall of milky glass. Behind it, blurred, a shape moves — a man, waving both arms.');
    await s.say('???', '...ello? HELLO? Oh, sun and stars — are you REAL? Get me OUT of here!', { portrait: false });
    if (!(await s.confirm('Strike a tuning fork against the glass?'))) return;
    s.sfx('holy');
    s.flash('#ffffff', 0.5);
    await s.narrate('The note goes into the glass like a key into a lock. The wall goes white with cracks — and falls apart like sugar.');
    s.clearBlocker('jorah_wall');
    s.setFlag('c4a_jorah_freed');
    await s.say('Jorah', 'Nine days. _Nine days!_ I\'ve been drinking off the walls and eating— you don\'t want to know what I\'ve been eating.');
    await s.say('Wren', 'Are you Jorah? Asha\'s husband? Nim\'s father?');
    await s.say('Jorah', 'Nim! Is she— she thinks I\'m dead, doesn\'t she.');
    await s.say('Ilse', 'She thinks you\'re slow.');
    await s.say('Jorah', 'Ha— the fastest scout on the salt road. _Slow._ Ha.');
    await s.wait(0.6);
    await s.say('Jorah', 'The Queen took the Kessel caravan in the upper gallery. I ran, and the glass grew shut behind me. It _grows_ down here, did you know? Like ice.');
    await s.say('Jorah', 'I know the way out from here. Go on — I\'ll be home before you. And don\'t tell Nim. I want to tell her myself.');
    s.remove('jorah_trapped');
    s.journal('We found Jorah alive in the Glass Caverns, sealed behind a wall of glass. The fork broke it like sugar. I keep thinking about that.');
  },

  async queen(s) {
    if (s.flag('c4a_queen_dead')) return;
    await s.narrate('The cavern opens into a bowl of glass a hundred feet across, smooth as the inside of a bell. Bones lie in drifts against the walls: oxen, wagons, a caravan\'s worth of copper pots.');
    s.shake(0.4, 1.4);
    await s.narrate('In the center, the glass floor bulges. Then it _moves_.');
    if (has(s, 'corvin')) {
      await s.say('Corvin', 'Is it too late to mention I\'m allergic to queens?');
      if (has(s, 'pip')) await s.say('Pip', 'You\'re allergic to everything that\'s trying to eat us.');
      await s.say('Corvin', 'It\'s a very common allergy.');
    }
    await s.say('Bram', 'Stand together! She\'s— sweet Dawn, she\'s the size of a _street_—');
    const r = await s.battle('boss_c4a_queen', { bg: 'cave' });
    if (r !== 'win') return;
    s.setFlag('c4a_queen_dead');
    await s.narrate('The Sand Wyrm Queen coils, uncoils, and lies still. All through the caverns, the singing glass goes quiet — as if it had been holding a note for her, and could finally let it go.');
    await s.say('Ilse', 'The brood will scatter now. The caravans will be safe. For a while.');
    await s.say('Wren', 'Let\'s tell Oyelaran.');
    s.journal('We killed the Sand Wyrm Queen in the deep caverns. When she died, all the glass stopped singing at once.');
  },
};
