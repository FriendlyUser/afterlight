// CHAPTER 2 — "The Wider World", part one: Port Gale and the Gale Coast Road.
// Tobias sails home; Thorne's Own are hunting a black-haired girl; Mags hides
// the party; the hermit of the Gull Light shows them the goat path.

import { spawnParty, clearParty, pc } from './ch2_common.js';

/** The four soldiers watching the harbor while the party sneaks to the inn. */
export const STEALTH_GUARDS = [
  { id: 'pg_g1', x: 19, y: 17, dir: 'left' },    // the quay
  { id: 'pg_g2', x: 24, y: 13, dir: 'down' },    // the main street
  { id: 'pg_g3', x: 16, y: 10, dir: 'down' },    // Chandler's Row
  { id: 'pg_g4', x: 31, y: 10, dir: 'right' },   // the coast gate
];

const CAUGHT_LINES = [
  ['HALT! You — the girl in the shawl. Lower the hood.', 'Ilse', 'Run? Fight? Both. Both is good.'],
  ['Black hair! Lieutenant! LIEUTENANT, IT\'S HER—', 'Bram', 'He has a very carrying voice. Somebody stop his voice.'],
  ['You there! Lanternfall accent. Show me your hands. All of you.', 'Wren', 'We\'re fishmongers! Very... tall fishmongers.'],
];

export const PORT = {
  // ------------------------------------------------------------------ Arrival
  async arrival(s) {
    if (s.flag('c2_arrived')) return;
    s.setFlag('c2_arrived');
    s.music('town');
    spawnParty(s, { ilse: [9, 21, 'up'], bram: [11, 21, 'up'], sable: [10, 22, 'up'] });
    s.spawn('tobias_pg', 'tobias', 10, 24, 'up');
    s.place('player', 10, 20, 'up');
    await s.wait(0.6);
    await s.say('Bram', 'Solid ground. Blessed, unmoving, non-serpent-infested ground.');
    await s.say('Ilse', 'You can let go of the rail now, Bram.');
    await s.say('Bram', 'I am *saluting* the rail. It served with honor.');
    await s.say('Sable', 'The ground is still moving.');
    await s.say('Ilse', 'That\'s your legs. They\'ll stop in an hour.');
    await s.say('Sable', 'I would like them to stop now.');
    s.face('player', 'down');
    await s.say('Wren', 'Tobias — you\'re not staying? Not even one night?');
    await s.say('Fisher Tobias', 'Tide turns within the hour. Miss it, and your mother sends a search party. And if she sends one, she leads it.');
    await s.move('tobias_pg', [[10, 23]]);
    await s.say('Fisher Tobias', 'She gave me a message for you, once you\'d made it across. Word for word, she said.');
    await s.say('Wren', '...What did she say?');
    await s.say('Fisher Tobias', '"Eat something green once a week."');
    await s.wait(0.8);
    await s.say('Fisher Tobias', 'Then she stood on the dock a long while, not saying the rest of it. I expect you can fill that part in yourself.');
    await s.say('Wren', '...Yeah. Okay.');
    await s.say('Fisher Tobias', 'Here. For the road. Don\'t tell her I\'m paying you in medicine again.');
    await s.give('hi_tonic', 2);
    await s.say('Fisher Tobias', 'Mind yourselves, the lot of you. Big lad — you mind _them_.');
    await s.say('Bram', 'With my life, sir. With my— yes. Absolutely. Minding.');
    await s.say('Sable', 'Goodbye, Tobias. Thank you for the boat. And for not letting the snake eat us.');
    await s.say('Fisher Tobias', 'Ha! That was mostly you lot. ...Strange girl. Good girl.');
    await s.move('tobias_pg', [[10, 26], [9, 26]], 2);
    s.remove('tobias_pg');
    await s.narrate('The little boat slips out past the breakwater, its sail like a folded letter, and turns west for home.');
    await s.wait(0.5);
    await s.think('Wren', 'West. Always west. Dad\'s compass agrees with her.');

    // Thorne's Own on the quay
    s.stopMusic(0.6);
    s.spawn('osric_q', 'osric', 17, 16, 'right');
    s.spawn('pg_harrow', 'harrow', 20, 16, 'left');
    s.spawn('pg_g1', 'vesper_soldier', 19, 17, 'left');
    s.face('player', 'up');
    await s.pan(17, 16, 1.4);
    s.music('tension');
    await s.say('Harrow', 'Once more, old man. A girl. Sixteen or so. Black hair. Pale as something pulled out of the sea.');
    await s.say('Old Osric', 'Pale girls with black hair? Sir, this is a fishing port. Half of us are pale and the other half are bald.');
    await s.say('Harrow', 'She came ashore on Lanternfall four nights ago. She will try to cross to the mainland. When she does, she comes through here.');
    await s.say('Harrow', 'The Lord-Commander is not a patient man. I am — but only professionally.');
    s.face('pg_harrow', 'down');
    await s.say('Harrow', 'Close the shops. Search the inns. Nobody takes the coast road without my leave.');
    await s.move('pg_harrow', [[22, 16], [22, 14], [28, 14]], 2.4);
    s.remove('pg_harrow');
    await s.move('osric_q', [[14, 16], [12, 16]], 1.6);
    s.remove('osric_q');
    await s.follow(1.0);
    s.face(pc('bram'), 'up');
    await s.wait(0.4);
    await s.say('Bram', '...Black trim on the pauldrons. A sun with a closed eye.', { speed: 0.8 });
    await s.say('Wren', 'Bram? Those are Dawnguard. Your people. We could just ask them what—');
    await s.say('Bram', 'They\'re not my people. They\'re *Thorne\'s Own*. The Lord-Commander\'s personal guard.');
    await s.say('Bram', 'They don\'t leave Aurenne. Not for bandits. Not for wars. Not for anything.');
    await s.wait(0.6);
    s.face('player', 'down');
    await s.say('Sable', 'They are looking for me.');
    await s.say('Ilse', 'They don\'t know that. They know "black hair". ...Which, I grant you, is a start.');
    await s.say('Ilse', '...How does he know she came ashore on Lanternfall? It\'s been four days. Nobody\'s crossed the strait but us.');
    await s.say('Wren', 'Gulls? Gossip? Lanternfall gossip could cross an ocean.');
    await s.say('Ilse', 'Mm.');
    s.face(pc('ilse'), 'right');
    await s.say('Ilse', 'Sable, hold still.');
    await s.narrate('Ilse unwinds the green shawl from her own shoulders and wraps it over Sable\'s head, tucking every black strand away with quick, exact fingers.');
    await s.say('Sable', 'It smells like you. Like rosemary.');
    await s.say('Ilse', 'It smells like _the plan_. Three things. One: they\'re watching the quay and the main street. Two: nobody\'s watching that alley by the chandler\'s, west of here. Three: if they see her, we run.');
    await s.say('Wren', 'Run where?');
    await s.say('Ilse', 'I had a plan for that too. It was "away".');
    await s.say('Bram', 'An inn. Inns have back doors. Every inn I\'ve ever been thrown out of had a back door.');
    await s.say('Wren', 'Okay. Okay! Stay out of their sight, get to an inn. Easy.');
    clearParty(s);
    s.objective('Sneak through Port Gale to an inn. Stay out of the soldiers\' sight — try the alley west of the pier.');
    s.journal('Port Gale. Tobias went home. Soldiers in black-trimmed armor — Thorne\'s Own, Bram says — are asking about a black-haired girl. Ilse hid Sable\'s hair under her shawl.');
    s.toast('Stay out of the soldiers\' line of sight — they watch the way they face.');
  },

  // ------------------------------------------------------------------ Stealth
  /** A soldier spots the party: fight, then scramble back to the pier. */
  async caught(s, guardId) {
    const n = s.vars.c2_caught = (s.vars.c2_caught || 0) + 1;
    const [shout, who, quip] = CAUGHT_LINES[(n - 1) % CAUGHT_LINES.length];
    s.face(guardId, 'player');
    await s.emote(guardId, '!');
    await s.say('Thorne\'s Own', shout);
    await s.say(who, quip);
    const r = await s.battle('c2_thornes_pair', { bg: 'town', music: 'battle', canFlee: false });
    if (r !== 'win') return;
    await s.say('Ilse', 'Whistles — they\'re calling the others! Back to the pier, now!');
    await s.fadeOut(0.5);
    s.place('player', 10, 19, 'up');
    await s.fadeIn(0.6);
    if (n === 1) await s.say('Wren', 'Okay. Not that way. The alley — west of the pier. Ilse said the alley.');
    else await s.say('Ilse', 'For the record, the alley is _still_ west of the pier.');
  },

  /** Old Osric, during the search: a hint for the quiet way. */
  async osricHint(s) {
    await s.say('Old Osric', ['_(not looking at you)_ Mind the soldiers, lass. They watch the way they face, like everyone.', 'Net Alley\'s behind the chandler\'s, west of here. Comes out on the back lane. Back lane runs past the Salt & Lantern\'s kitchen door.', 'I never said any of that. I\'m mending a net.']);
  },

  /** Reaching the inn's side door: Mags pulls them in. */
  async kitchenDoor(s) {
    if (s.flag('c2_stealth_done')) return;
    s.spawn('mags_door', 'mags', 19, 5, 'down');
    await s.say('???', 'Psst! You lot. Yes, you, with the very obvious shawl.');
    s.face('player', 'mags_door');
    await s.say('Mags', 'In. Kitchen door. Now, before the tin-cans come round the corner.');
    await s.fadeOut(0.5);
    s.remove('mags_door');
    await s.teleport('c2_pg_inn', 2, 4, 'right');
  },

  // ------------------------------------------------------------------ Hidden at the Salt & Lantern
  async hidden(s) {
    if (!s.flag('c2_arrived') || s.flag('c2_stealth_done')) return;
    s.setFlag('c2_stealth_done');
    s.music('tension');
    spawnParty(s, { ilse: [1, 5, 'right'], bram: [2, 6, 'up'], sable: [1, 4, 'right'] });
    s.place('player', 2, 4, 'right');
    s.show('mags', false);
    s.spawn('mags_k', 'mags', 4, 4, 'left');
    await s.wait(0.4);
    await s.say('Mags', 'Margarethe Salt. Everybody calls me Mags, except the tax man, who calls me a liar.');
    await s.say('Mags', 'I don\'t know who you are and I don\'t want to. Down behind the barrels. Not a word.');
    await s.move('mags_k', [[6, 4], [6, 5]]);
    s.spawn('harrow_i', 'harrow', 6, 9, 'up');
    s.spawn('guard_i', 'vesper_soldier', 7, 9, 'up');
    await s.move('harrow_i', [[6, 7]], 2);
    s.face('mags_k', 'down');
    await s.say('Harrow', 'Innkeeper. A girl, sixteen, black hair, pale. Possibly traveling with others. Possibly frightened.');
    await s.say('Mags', 'Lieutenant, every girl in this town is sixteen, frightened and traveling with others. Usually sailors. Usually my fault.');
    await s.say('Harrow', 'There is a reward.');
    await s.say('Mags', 'There\'s always a reward. You lot never say what the girl did.');
    await s.wait(0.8);
    await s.say('Harrow', '...She is to be brought to Aurenne unharmed. That is all I am permitted to say.');
    await s.say('Mags', 'Unharmed. Well. That\'s more than the last lot of you said about anybody.');
    await s.say('Harrow', 'Search the cellar.');
    await s.move('guard_i', [[7, 5], [4, 5]], 2.2);
    await s.wait(0.4);
    await s.say('Mags', 'Mind the third barrel, son. That\'s the bad cider. It\'s been bad since the Kindling of eleven-ten. It\'s _waiting_ for someone.');
    s.face('guard_i', 'left');
    await s.wait(1.0);
    await s.say('Thorne\'s Own', '...Nothing here but barrels, sir. And a smell.');
    await s.say('Harrow', 'Then we ride for the coast road at first light. Good day, Mistress Salt.');
    await s.move('guard_i', [[7, 5], [7, 9]], 2.4);
    await s.move('harrow_i', [[6, 9]], 2);
    s.remove('guard_i');
    s.remove('harrow_i');
    await s.wait(0.5);
    s.music('inn');
    await s.say('Mags', 'You can breathe now. Quietly. I charge extra for loud breathing.');
    await s.say('Wren', 'Why did you help us?');
    await s.say('Mags', 'I ran rum past the Dawnguard for twenty years, pet. Habits.');
    await s.say('Mags', 'And when tin-cans come asking after a frightened girl and won\'t say what she did — she didn\'t do anything. That\'s what that means.');
    s.face('mags_k', pc('sable'));
    await s.say('Mags', 'Keep the shawl on, love. Rooms upstairs. Nobody\'s paying tonight. Tomorrow you\'re paying double.');
    await s.move('mags_k', [[8, 4], [8, 3]]);
    s.remove('mags_k');
    s.show('mags', true);
    // Bram goes quiet.
    await s.wait(0.6);
    await s.say('Ilse', 'Bram hasn\'t said a word in an hour. Is that a record? I feel like we should write it down.');
    s.face('player', pc('bram'));
    await s.say('Wren', 'Bram. You know them. Thorne\'s Own.');
    await s.wait(1.0);
    await s.say('Bram', '...The Lord-Commander was at my trial. When I— when I froze.', { speed: 0.8 });
    await s.say('Bram', 'Sir Aldous was dead on the sand and I was standing there with my sword in my hand, not moving. Thorne walked over. Looked at me like I was something on his boot.');
    await s.say('Bram', '"Send the coward to the edge of the world," he said. "Somewhere he can\'t get anyone else killed."');
    await s.wait(1.0);
    await s.say('Bram', 'So. Lanternfall.');
    await s.say('Ilse', 'Bram...');
    await s.say('Bram', 'If Thorne sent his own guard all the way out here, it isn\'t for smugglers. It\'s for her. And he doesn\'t send them to _ask_.');
    await s.say('Sable', 'Then I should go a different way. Alone. You would be safer.');
    await s.say('Wren', 'No.');
    await s.say('Ilse', 'Absolutely not.');
    await s.say('Bram', 'Not a chance. They\'ll have to go through me.');
    await s.wait(0.4);
    await s.say('Bram', '...Through Wren, ideally. Then me. But through me eventually. _Definitely._');
    await s.say('Sable', 'I do not understand. But thank you.');
    await s.say('Sable', 'Wren. Is that what a friend is? People who stand in front of you, but argue about the order?');
    await s.say('Wren', 'Pretty much exactly that.');
    await s.fadeOut(1.2);
    clearParty(s);
    s.heal();
    await s.wait(1.0);
    await s.narrate(['That night, Wren lies awake listening to the harbor bells.', 'They ring the hours differently here. Rounder. As if the mainland has more time to spare.']);
    s.place('player', 6, 5, 'down');
    await s.fadeIn(1.0);
    s.music('town');
    await s.say('Mags', 'Morning, my little fugitives. Your tin-cans rode out along the coast road at dawn. Shops are open again. Town\'s yours.');
    await s.say('Mags', 'If you\'re for the Whisperwold — and you are, I can see it on you — mind the trees. Don\'t answer them.');
    s.objective('Explore Port Gale, then take the coast road east toward the Whisperwold.');
    s.journal('An innkeeper named Mags hid us from Thorne\'s Own. Bram told us about his trial — Garrick Thorne called him a coward and sent him to Lanternfall. The soldiers said Sable is to be brought to Aurenne "unharmed".');
  },

  // ------------------------------------------------------------------ Townsfolk with something to say
  async osric(s) {
    if (s.flag('c2_osric_story')) {
      return s.say('Old Osric', ['Your mother danced like she was trying to stamp the pier into the sea.', 'Then she went home and became the most serious woman on the Westmost Isle. People do that. They have one good night and then they guard it.']);
    }
    await s.say('Old Osric', 'Halloway, did you say? Red hair, Lanternfall accent... You\'re Edrin\'s girl.');
    await s.say('Wren', 'You knew my dad?');
    await s.say('Old Osric', 'Sold him that compass on your belt. Off this very pier, twenty years back. He haggled me down to nothing and then paid full price anyway, because he felt bad. Daft man. Lovely man.');
    await s.say('Old Osric', 'He brought a girl over from the island, that summer. Braid down to here. Never said two words to me.');
    await s.say('Old Osric', 'Danced till dawn on the pier, the pair of them, to a fiddler who only knew one song. Then she went home and never came back across.');
    await s.wait(0.8);
    await s.say('Wren', '...Mom? _Mom_ danced? On a pier?');
    await s.say('Old Osric', 'Carved their letters in the mooring post at the end of the long pier. Go and see, if you don\'t believe an old net-mender.');
    s.setFlag('c2_osric_story');
    s.journal('Old Osric sold Dad his compass, twenty years ago, on the Port Gale pier. He says Mom came across once — and danced till dawn. Mom.');
  },

  async mooringPost(s) {
    await s.narrate('Letters carved deep into a mooring post, worn soft by twenty years of salt: *E.H. + Y.*');
    if (!s.flag('c2_osric_story')) return s.think('Wren', 'E.H.... Somebody was happy here, once.');
    if (s.flag('c2_post_seen')) return s.think('Wren', 'E.H. + Y. She never told me. She never told me _anything_.');
    s.setFlag('c2_post_seen');
    await s.think('Wren', 'Edrin Halloway. And Y. She came here. She stood right here.');
    await s.think('Wren', 'All those years telling me there was nothing out here worth leaving for...');
    await s.think('Wren', '...and she knew. She _knew_ exactly what was out here.');
  },

  async bettany(s) {
    if (s.flag('c2_cat_done')) return s.say('Bettany', ['Admiral\'s asleep in the herring crate. He\'ll be there till spring.', 'Your friend in the shawl comes by to pet him. He lets her. He doesn\'t let _me_.']);
    if (s.flag('c2_cat_found')) return PORT.catReturn(s);
    if (s.flag('c2_cat_quest')) return s.say('Bettany', ['Ginger. Fat. One ear that points at heaven. Answers to "Admiral", in the sense that he doesn\'t.', 'He likes dark places near fish. This whole town is a dark place near fish. Good luck.']);
    await s.say('Bettany', 'Fresh cod! Fresh-ish haddock! Oh — sorry, love, you don\'t look like you\'re buying. You look like you\'re looking.');
    await s.say('Bettany', 'If you\'re looking anyway — my cat\'s gone. The Admiral. Big ginger tom. Ran off when those soldiers started kicking over my crates.');
    await s.say('Sable', 'A cat. A real cat?');
    await s.say('Bettany', 'Well, he\'s mostly real. About a third of him is herring I\'ve paid for.');
    await s.say('Sable', 'Wren. We have to find the cat.');
    await s.say('Wren', 'We\'re fugitives in a strange city, Sable.');
    await s.say('Sable', 'Yes. And so is the cat.');
    s.setFlag('c2_cat_quest');
    s.quest('c2_cat', 'Admiral Whiskers', 'Bettany\'s ginger tom fled when the soldiers searched the fish market. Somewhere dark, near fish...');
  },

  async catSpot(s) {
    if (s.flag('c2_cat_found') || s.flag('c2_cat_done')) return s.narrate('Behind the barrel: a dent in the dust the exact shape of a smug cat.');
    if (!s.flag('c2_cat_quest')) return s.narrate('Two green eyes glare at you from the dark behind the barrel. Something hisses. You decide it is none of your business.');
    s.setFlag('c2_cat_found');
    await s.narrate('Behind the barrel, wedged into a gap no cat should fit, is a great deal of ginger cat. One ear points at heaven.');
    await s.say('Wren', 'Here, Admiral. Here, puss. Nice puss. Come out and— OW.');
    await s.say('Sable', 'Let me.');
    await s.narrate('Sable kneels and holds out a hand, very still. The Admiral considers her for a long, long moment — then flows out of the gap and into her arms like poured honey.');
    await s.say('Sable', 'He is warm. He is... vibrating. Wren, is he broken?');
    await s.say('Wren', 'That\'s purring. It means he likes you.');
    await s.say('Sable', '...I would like to purr.');
    await s.say('Ilse', 'Please don\'t.');
    s.objective('Return the Admiral to Bettany at the fish market.', true);
  },

  async catReturn(s) {
    s.setFlag('c2_cat_done');
    await s.say('Bettany', 'ADMIRAL! You fat orange traitor! Come here— no, he\'s gone straight back to her. Of course he has.');
    await s.say('Sable', 'He says he would like to stay with me.');
    await s.say('Bettany', 'He says that to everyone with a lap, love. Here — for your trouble. And take a bit of smoked eel. No, take it. It\'s good for the hair.');
    await s.give('smoke_ball', 2);
    await s.give('antidote_charm');
    await s.say('Bettany', 'That feather\'s from the old gull that used to fight the Admiral for scraps. Lucky, they say. Never once got poisoned, that gull.');
    await s.say('Sable', 'Goodbye, Admiral. I will think about you when it rains.');
    s.quest('c2_cat', null, null, 'done');
    s.journal('We found Bettany\'s cat. Sable held him for ten minutes. She says she would like to purr. Ilse says please don\'t.');
  },

  // ------------------------------------------------------------------ The lamp in the window (Odile)
  async odile(s) {
    if (s.flag('c2_odile_done')) {
      return s.say('Odile', ['Slept twelve hours, last night. First time in six years.', 'I\'m going to sell the _Merry Widow_. Jory always hated that name. Said it was tempting fate.', 'Turns out fate doesn\'t need tempting. It comes anyway. Better to be asleep when it does.']);
    }
    if (s.flag('c2_jory_heard')) return PORT.odileMessage(s);
    if (s.flag('c2_odile_asked')) return s.say('Odile', ['If you hear him in there — Jory — you\'ll know. He laughs like a seal choking on a herring.', 'Tell him the lamp\'s still lit.']);
    await s.say('Odile', 'Mind the lamp, pet. Don\'t knock it. It\'s been burning six years and I\'ll not have it go out because of a stranger\'s elbow.');
    await s.say('Wren', 'Six years? Why?');
    await s.say('Odile', 'My little brother Jory took our boat out past the Gale rocks, six years ago this winter. Squall came down off the cliffs. Boat came back. Jory didn\'t.');
    await s.say('Odile', 'Sailors keep a lamp in the window so the lost can find the harbor. So I keep it. Every night. Trim the wick, fill the oil. Six years.');
    await s.wait(0.6);
    await s.say('Wren', '...My dad was lost at sea. When I was nine.');
    await s.say('Odile', 'Then you know. You know the worst part isn\'t that they\'re gone. It\'s that nobody told you _they were done_.');
    await s.say('Odile', 'You\'re headed for the Whisperwold. Everyone headed east is. They say the trees there talk in the voices of the dead.');
    await s.say('Odile', 'I\'m too old and too frightened to go and listen. But if you hear a man who laughs like a seal choking on a herring — tell him his sister kept the lamp lit.');
    s.setFlag('c2_odile_asked');
    s.quest('c2_lamp', 'The Lamp in the Window', 'Odile has kept a lamp lit for six years for her drowned brother, Jory. If his voice is among the Whisperwold\'s trees, she wants to know.');
  },

  async odileMessage(s) {
    s.setFlag('c2_odile_done');
    await s.say('Odile', 'You\'ve been to the wold. I can see it on you. People come back from that forest looking like they\'ve been listening too hard.');
    await s.say('Wren', 'We heard him. Jory. By the black pond.');
    await s.wait(0.8);
    await s.say('Odile', '...Go on.');
    await s.say('Wren', 'He asked if the lamp was still lit. He said— he said the knot was his fault. That you should sell the boat. That you should sleep.');
    await s.wait(1.5);
    await s.say('Odile', 'The knot. Six years I\'ve been sure I tied that bowline wrong. Six years.', { speed: 0.8 });
    await s.say('Odile', 'Stupid boy. Stupid, lovely boy. Always had to have the last word.');
    await s.narrate('Odile leans over the lamp. For a moment she only looks at it. Then she blows it out.');
    await s.say('Odile', 'There. He\'s home. He doesn\'t need it.');
    await s.say('Odile', 'This was his. He wore it for luck, the daft thing, and left it on the hook the day he needed it most. Take it. Somebody should be lucky in it.');
    await s.give('wake_charm');
    await s.gold(300);
    await s.say('Sable', 'The voices in the trees. They were not cruel. They were only... unfinished.');
    await s.say('Odile', 'Then you finished one. That\'s more than most of us manage.');
    s.quest('c2_lamp', null, null, 'done');
    s.journal('We gave Odile her brother\'s message. She blew out the lamp after six years. I keep thinking about what she said: the worst part is nobody tells you they\'re done.');
  },

  // ------------------------------------------------------------------ The Gale Coast Road
  async roadEnter(s) {
    if (s.flag('c2_road_enter')) return;
    s.setFlag('c2_road_enter');
    spawnParty(s, { ilse: [2, 13, 'right'], bram: [2, 15, 'right'], sable: [1, 13, 'right'] });
    await s.wait(0.4);
    await s.say('Wren', 'Look at it. The whole coast. Cliffs, and the sea all silver, and the road just... going.');
    await s.say('Wren', 'I could walk this road for a year.');
    await s.say('Ilse', 'Three things. One: you\'ve walked it for ten seconds. Two: the soldiers went this way. Three: you\'re doing the face.');
    await s.say('Wren', 'What face?');
    await s.say('Ilse', 'The atlas face.');
    await s.say('Sable', 'The wind is very loud here. It sounds like a lot of people far away.');
    await s.say('Bram', 'That\'s just the Gale. It howls. Nothing to worry about. Probably. I have never been told otherwise.');
    clearParty(s);
    s.objective('Follow the Gale Coast Road east toward the Whisperwold.');
  },

  /** Thorne's Own on the bridge; dx pushes the player back the way they came. */
  async checkpoint(s, dx) {
    await s.say('Ilse', 'Wren — stop. On the bridge.');
    await s.pan(38, 12, 0.8);
    await s.say('Harrow', 'Every cart. Every face. Under every hood. If the Lord-Commander asks whether the girl crossed this bridge, I want to be able to say no without lying.');
    await s.follow(0.6);
    await s.step('player', dx, 0);
    if (!s.flag('c2_cp_seen')) {
      s.setFlag('c2_cp_seen');
      await s.say('Bram', 'That\'s the only bridge over the gorge for miles. We can\'t go around by the hills, not with the river in flood.');
      await s.say('Wren', 'There\'s smoke up on the cliff, back the way we came. Somebody lives up there. Maybe they know another way across.');
      s.objective('Thorne\'s Own hold the bridge. Find another way across the gorge — someone is camped on the cliffs nearby.');
    }
  },

  async hermit(s) {
    if (s.flag('c2_hermit_met')) return PORT.hermitAgain(s);
    s.setFlag('c2_hermit_met');
    await s.say('Hesketh', 'Hah! Visitors! Real ones, not gulls. Sit, sit — no, not on Agatha, she\'s a log. Sit on Bartholomew.');
    await s.say('Wren', '...Which one is Bartholomew?');
    await s.say('Hesketh', 'Also a log. I name the logs. You\'d name the logs too, after twenty years up here.');
    await s.fadeOut(0.6);
    spawnParty(s, { ilse: [26, 9, 'right'], bram: [26, 11, 'up'], sable: [28, 10, 'up'] });
    s.place('player', 27, 10, 'up');
    await s.fadeIn(0.6);
    await s.say('Hesketh', 'Hesketh. I kept the Gull Light, down there on the point. Oil lamp, not a proper Lantern — no Dawnstone, no Kindling. Just a big lamp to keep ships off the Teeth.');
    await s.say('Ilse', 'It\'s dark now.');
    await s.say('Hesketh', 'Twenty years dark. My Marit used to climb the stairs with me. Hundred and twelve stairs. Then she couldn\'t. Then I couldn\'t, without her.');
    await s.say('Hesketh', 'Ships stopped coming this way anyhow. Dawnguard built their road. Now it\'s me and the gulls and the logs. Fish stew?');
    await s.say('Sable', 'Yes. Is it warm?');
    await s.say('Hesketh', 'It\'s _hot_, girl. It\'s stew.');
    await s.wait(0.5);
    await s.narrate('The stew is mostly fish and partly mystery. It is the best thing any of you have eaten in a week.');
    await s.say('Hesketh', 'So. A Dawnguard boy, a herb-girl, a redhead with a sword she\'s still getting used to, and a girl with black hair in a green shawl. Coming up the coast the morning after Thorne\'s dogs.');
    await s.wait(0.8);
    await s.say('Hesketh', 'Don\'t look so worried. I hate soldiers. They turned back a tinker yesterday for having a dark-haired daughter. Made the child cry. Nasty business.');
    await s.say('Bram', 'They\'re holding the bridge.');
    await s.say('Hesketh', 'They\'re holding _a_ bridge. There\'s the goat path. Down the cliff by my woodpile, along the cove at low tide, under the bridge where the river meets the sea, and up the far side.');
    await s.say('Hesketh', 'Rockfall\'s choked the top of it. But I\'ve a lever and twenty years of spite. Give me a moment.');
    s.spawn('hesketh_w', 'hesketh', 28, 10, 'down');
    s.show('hesketh', false);
    await s.move('hesketh_w', [[28, 14], [29, 17]], 2.2);
    await s.pan(29, 18, 0.6);
    s.shake(0.2, 0.6);
    s.clearBlocker('goat_rocks');
    await s.wait(0.6);
    await s.move('hesketh_w', [[28, 14], [28, 10]], 2.4);
    await s.follow(0.6);
    s.remove('hesketh_w');
    s.show('hesketh', true);
    s.face('hesketh', 'left');
    await s.say('Hesketh', 'There. Mind the tide.');
    await s.say('Wren', 'Thank you. Really. I— can I ask you something?');
    await s.say('Hesketh', 'Asking\'s free. Answers cost a log-name.');
    await s.say('Wren', 'What was your Crest? At your Kindling?');
    await s.say('Hesketh', 'Warden. Shield-and-stand-fast. Said so right there on my hand.');
    await s.say('Hesketh', 'Since then I\'ve been a lamp-keeper, a fisherman, a husband, a widower, a cook and a namer of logs. Not one of those was on my hand.');
    await s.say('Hesketh', 'The light tells you what you are at sixteen, girl. It doesn\'t tell you what you\'ll _do_ about it.');
    await s.wait(0.6);
    await s.say('Hesketh', 'One more thing. Down on the cove there\'s three stone cairns, west of the goat path. Marit\'s things are under the third one. Her ring. I buried it the year she went.');
    await s.say('Hesketh', 'She\'d hate it in the dark. Take it. Somebody should wear it in the light.');
    s.setFlag('c2_cairn_tip');
    s.quest('c2_cairn', 'Marit\'s Ring', 'Hesketh buried his late wife\'s ring under the third cairn on the cove, west of the goat path. He wants someone to wear it in the light.');
    await s.fadeOut(0.5);
    clearParty(s);
    s.heal();
    await s.fadeIn(0.5);
    await s.system('The party rests by Hesketh\'s fire and is fully restored.');
    s.objective('Take the goat path down the cliff, cross the cove under the bridge, and climb back up to the road.');
    s.journal('A hermit named Hesketh, who used to keep the Gull Light, fed us stew and showed us a goat path around the soldiers. He says the light tells you what you are — not what you\'ll do about it.');
  },

  async hermitAgain(s) {
    await s.say('Hesketh', 'Back again? Sit by the fire a while. Agatha\'s free.');
    if (await s.confirm('Rest by Hesketh\'s fire?')) {
      await s.fadeOut(0.5);
      s.heal();
      await s.fadeIn(0.5);
      await s.system('The party is fully restored.');
    }
    if (s.flag('c2_cairn_found')) await s.say('Hesketh', 'That\'s her ring. On your hand. ...It looks right in the light. Thank you.');
  },

  async cairn(s) {
    if (s.flag('c2_cairn_found')) return s.narrate('The third cairn, carefully rebuilt. A gull is sitting on top of it as if it has been asked to.');
    if (!s.flag('c2_cairn_tip')) return s.narrate('A cairn of sea-smoothed stones, stacked with care. Someone built this to last.');
    s.setFlag('c2_cairn_found');
    await s.narrate('You lift the stones one by one. Beneath them, wrapped in oilcloth gone stiff with salt: a plain silver ring.');
    await s.narrate('Inside the band, worn nearly smooth: _Keep the light._');
    await s.give('c2_marits_ring');
    await s.say('Ilse', 'We rebuild the cairn. Properly. He\'ll look.');
    await s.say('Wren', 'Yeah. Okay. Properly.');
    s.quest('c2_cairn', null, null, 'done');
  },

  async gullLight(s) {
    await s.narrate(['The Gull Light: a stubby tower of whitewashed stone, streaked with twenty years of gulls.', 'The lamp room is dark. Through the salt-fogged glass you can just make out a great brass lamp, its wick trimmed and waiting, as if someone means to come back.']);
    if (s.flag('c2_hermit_met')) await s.say('Sable', 'He said he cannot climb the stairs. But someone trims the wick.');
  },
};
