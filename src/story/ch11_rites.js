// CHAPTER 11 — the Character Rites (one per companion) and the Starseer's Orrery.

import { mainObjective, returnToShip, stageParty, unstage } from './ch11.js';

const done = (s, who) => s.flag(`c11_rite_${who}_done`);
// Each rite sets its own objectives; finishing it puts the main one (mainObjective) back.

export const RITES = {
  // ================================================================== WREN — the Drowned Light
  async compass(s) {
    if (s.flag('c11_reef_open')) return;
    s.setFlag('c11_reef_open');
    s.music('sad');
    s.place('player', 3, 9, 'left');
    await s.wait(0.6);
    await s.narrate('Wren\'s hand goes to her pocket without her meaning it to. Dad\'s compass. It points west. It has always pointed west, wherever she was.');
    await s.say('Wren', '...That\'s not right.');
    await s.narrate('The needle swings, shivers, and points _down_ — through the deck, through the cloud, to somewhere south and west and very far below.');
    await s.say('Sable', 'There are Shards in the hold now. Their light is very loud. Perhaps it woke something in the compass.');
    await s.say('Corvin', 'South-west and down. That\'s the Drowned Reef. When the sea fell upward, the sea floor came with it. Every ship that ever sank off the Westmost Isle is out there, hanging in the dark. Sailors don\'t go.');
    await s.say('Wren', 'Dad\'s boat went down off Lanternfall.');
    await s.wait(1.2);
    await s.say('Corvin', '...I\'ll put it on the charts.');
    s.quest('c11_rite_wren', 'Wren\'s Rite: The Drowned Light', 'Dad\'s compass is pointing at the Drowned Reef, where the old sea floor floats. The Gull\'s Return went down off Lanternfall.');
    await s.system('The *Drowned Reef* can now be reached from the helm.');
    s.music('ruin');
    s.journal('Dad\'s compass stopped pointing west. It\'s pointing down, at the Drowned Reef, where all the ships the sea ever took are floating now. His boat went down off Lanternfall.');
  },

  async reefArrive(s) {
    s.music('sea');
    await s.narrate('The bottom of the Western Sea, hanging in the sky. Grey coral. Bones of fish the size of houses. Ships of every age lying on their sides in the sand, as if they had only lain down for a moment.');
    await s.say('Pip', 'Fish bones. Big fish bones. Unreasonably big fish bones.');
    await s.say('Ilse', 'Wren. Are you alright?');
    await s.say('Wren', 'The needle\'s pointing north. To the big wrecks. He\'s— it\'s up there.');
    s.objective('Follow the compass across the Drowned Reef.');
  },

  async reefBoat(s) {
    if (s.flag('c11_reef_boat')) return s.narrate('The Gull\'s Return, lying in the grey sand where the sea set her down.');
    s.setFlag('c11_reef_boat');
    stageParty(s, 15, 8, 'up');
    s.music('sad');
    await s.narrate('A fishing boat lies on its side in the grey sand, its paint long gone. On the bow, under the barnacles, letters you have known your whole life: _GULL\'S RETURN._');
    await s.say('Wren', 'It\'s his. It\'s Dad\'s boat.');
    await s.say('Ilse', 'Wren.');
    await s.say('Wren', 'He painted the name himself. He said the gull was me. Because I always came back.');
    await s.narrate('Under the thwart, wrapped in oilskin the way he wrapped everything: his cutlass.');
    await s.give('c11_edrins_cutlass');
    await s.narrate('And lashed to the mast-step, tied with a knot only the Keepers of Lanternfall are taught — a small brass signal lamp.');
    await s.give('c11_handlamp');
    await s.wait(1.0);
    await s.say('Wren', 'That\'s Mom\'s. That\'s Mom\'s knot.');
    await s.say('Wren', 'She was here. That night. She found the boat. She tied her lamp to it so if he was still in the water, he\'d see the light and swim to it.');
    await s.wait(1.2);
    await s.say('Wren', 'She never told me. She told me the sea took him, and that was all. I thought she didn\'t even— I thought she just stayed in the Lantern.');
    await s.say('Sable', 'Perhaps she did not want you to know she had been too late.');
    await s.say('Corvin', 'Or she didn\'t want you to know she\'d left the Lantern dark to do it. That\'s the one thing Keepers never do. Every sailor knows it.');
    await s.say('Wren', 'She did it anyway.');
    s.shake(0.4, 1.4);
    s.sfx('rumble');
    await s.narrate('The sky-water around the reef draws back all at once, the way the sea drew back on the night of the storm.');
    await s.say('Bram', 'Something\'s coming up. Something big. Everyone behind me!');
    s.music('boss');
    const r = await s.battle('c11_boss_undertow');
    if (r !== 'win') return;
    s.music('sad');
    await s.narrate('The Undertow sinks away into the dark below the reef, and does not come back.');
    await s.say('Wren', 'Dad oiled this every Sunday. He\'d hate it rusty.');
    await s.say('Corvin', 'Nell can fix it. Nell can fix anything, if you don\'t mind the shouting.');
    unstage(s);
    s.quest('c11_rite_wren', null, 'Found the Gull\'s Return, Dad\'s cutlass, and Mom\'s hand-lamp tied to the mast. Take the cutlass to Nell\'s forge below decks on the Halcyon.');
    s.objective('Take Edrin\'s Cutlass to Nell, below decks on the Halcyon.');
    s.journal('We found the Gull\'s Return. Dad\'s cutlass was under the thwart. Mom\'s hand-lamp was tied to the mast with a Keeper\'s knot. She went out after him. She left the Lantern dark and went out after him, and she never told me.');
    await returnToShip(s);
  },

  async reforgeCutlass(s) {
    await s.say('Nell', 'Now that\'s a blade. Rust\'s only skin-deep. Whose was it?');
    await s.say('Wren', 'My dad\'s. He was a fisherman. It was for cutting nets, mostly.');
    await s.say('Nell', 'Then it\'s cut more knots than throats. Best kind of sword there is. Hand it here.');
    await s.take('c11_edrins_cutlass');
    await s.fadeOut(0.8);
    s.sfx('burst');
    await s.wait(0.6);
    s.sfx('slash');
    await s.wait(0.6);
    await s.fadeIn(0.8);
    s.flash('#ffd080', 0.5);
    await s.say('Nell', 'Sun Shard heat, Halcyon steel, and your old man\'s edge. It\'ll cut anything now. It\'ll still cut nets too, if you ask it nicely.');
    await s.give('edrins_blade');
    await s.give('power_fruit', 2);
    await s.say('Wren', '...Hi, Dad.');
    s.setFlag('c11_rite_wren_done');
    s.quest('c11_rite_wren', null, null, 'done');
    s.objective(mainObjective(s), true); // the rite is done: back to the Sun Shards
    s.journal('Nell reforged Dad\'s cutlass in Sun Shard fire. Edrin\'s Blade. It\'s light in my hand. I said hi to it. Nobody laughed.');
  },

  // ================================================================== PIP — the Lucky Shiv
  async kiteLetter(s) {
    if (s.flag('c11_scrap_open')) return;
    s.setFlag('c11_scrap_open');
    await s.wait(0.4);
    s.shake(0.2, 0.5);
    await s.narrate('Something comes out of the clouds, tumbling, and lands on the deck in a heap of sailcloth and string: a kite, painted with a lopsided sun.');
    await s.say('Pip', 'That\'s one of ours. That\'s a Kiteholm kite.');
    await s.give('c11_kite_letter', 1, true);
    await s.narrate([
      'Tied to the spar, a letter in crayon. Mostly capital letters.',
      '_PIP. TILLY RAN OFF. SHE SAID SHE WAS GOING TO FIND THE LUCKY SHIV FROM YOUR STORY SO YOU WOULD NEVER LOSE AGAIN. SHE TOOK THE BIG KITE. SHE WENT DOWN TO SCRAPFALL. WE ARE SORRY. WE DIDNT STOP HER. — JUNIPER (AND EVERYONE)_',
    ]);
    await s.say('Pip', 'That idiot. That stupid, stupid little—');
    await s.say('Pip', 'I MADE that story up. There\'s no Lucky Shiv. There\'s no Magpie King. I made it up so they\'d go to sleep!');
    await s.say('Ilse', 'Pip—');
    await s.say('Pip', 'Corvin. Scrapfall. Now.');
    await s.say('Corvin', 'Scrapfall it is.');
    s.quest('c11_rite_pip', 'Pip\'s Rite: The Lucky Shiv', 'Tilly, one of the Kiteholm kids, has flown down to Scrapfall to find the "Lucky Shiv" from one of Pip\'s bedtime stories.');
    await s.system('*Scrapfall* can now be reached from the helm.');
    s.journal('A kite landed on the deck. Tilly — one of Pip\'s kids — has gone to Scrapfall looking for a magic knife from a story Pip made up. Pip went very quiet and very grown-up. I don\'t like it.');
  },

  async scrapArrive(s) {
    s.music('ruin');
    await s.say('Pip', 'Tilly\'s small, red hair, never shuts up. If you see a kite, that\'s her. If you see a giant bird, that\'s not her. Hit it.');
    await s.say('Bram', 'Pip, she\'ll be alright—');
    await s.say('Pip', 'You don\'t know that. Nobody knows that. That\'s the whole problem with everything.');
    s.objective('Find Tilly somewhere on Scrapfall.');
  },

  async scrapTilly(s) {
    if (s.flag('c11_scrap_found')) return;
    s.setFlag('c11_scrap_found');
    stageParty(s, 17, 9, 'up');
    await s.say('Tilly', 'PIP!');
    await s.say('Pip', 'Tilly! Are you— what were you THINKING, you—');
    await s.say('Tilly', 'I found it! The Lucky Shiv! The Rook Queen had it in her nest and I stole it right out from under her, and she was SO mad—');
    s.shake(0.4, 1.0);
    s.sfx('surprise');
    await s.narrate('The sky over Scrapfall goes dark with wings. Something enormous lands on the junk-heap, and every shiny thing on the island seems to lean toward it.');
    await s.say('Tilly', '...Oh no, she\'s back.');
    s.music('boss');
    const r = await s.battle('c11_boss_queen');
    if (r !== 'win') return;
    s.music('sad');
    await s.narrate('The Rook Queen flaps away over the edge, shrieking, trailing buttons.');
    await s.move('player', [[17, 7]], 2);
    await s.say('Pip', 'Do you know how dangerous— you could\'ve— there were BIRDS, Tilly, there were—');
    await s.wait(1.2);
    await s.say('Pip', '...');
    await s.say('Pip', '...Was it scary?');
    await s.say('Tilly', 'SO scary.');
    await s.say('Pip', 'Yeah. Me too.');
    await s.say('Tilly', 'You get scared?');
    await s.say('Pip', 'All the time. Don\'t tell anyone.');
    await s.say('Tilly', 'Here. It\'s the real one. I know it is. It was in the Queen\'s nest, and she\'s the best thief in the whole sky, so it has to be the best knife.');
    await s.narrate('It is a kitchen knife. It is very rusty. Someone has wrapped the handle in a strip of red ribbon.');
    await s.give('c11_tilly_knife');
    await s.wait(0.8);
    await s.say('Pip', '...Yeah. Yeah, it\'s the real one.');
    await s.say('Corvin', 'Come on, short stuff. We\'ll fly you home.');
    await s.say('Tilly', 'Can I fly my kite off the back of your ship?');
    await s.say('Corvin', 'Ask the captain.');
    await s.say('Tilly', 'You\'re the captain!');
    await s.say('Corvin', 'Then yes.');
    unstage(s);
    s.remove('tilly');
    s.setFlag('c11_pip_kite');
    s.quest('c11_rite_pip', null, 'Found Tilly, and the "Lucky Shiv" — a rusty kitchen knife. Pip says it is the real one. Maybe Nell can help it look the part.');
    s.objective('Take Tilly home. Show Nell the Lucky Shiv.');
    s.journal('We found Tilly at Scrapfall with a rusty kitchen knife she\'d stolen from a giant bird. Pip started to shout at her and then he didn\'t. He asked if she was scared. He said he was too.');
    await s.fadeOut(1.0);
    await s.teleport('halcyon_deck', 12, 8, 'down');
  },

  async kiteFlying(s) {
    s.setFlag('c11_pip_kite', false);
    s.spawn('tilly', 'c11_tilly', 3, 10, 'left');
    s.place('pip', 3, 9, 'left');
    s.place('player', 6, 9, 'left');
    await s.narrate([
      'Off the stern of the Halcyon, a kite with a lopsided sun climbs into the bruised sky.',
      'Pip holds the string. Tilly holds Pip\'s sleeve. Neither of them says anything for a long while.',
    ]);
    await s.say('Tilly', 'Higher!');
    await s.say('Pip', 'It\'s as high as it goes!');
    await s.say('Tilly', 'Make it go HIGHER, you\'re the BEST at everything—');
    await s.say('Pip', 'I\'m not the best at everything! I\'m twelve!');
    await s.wait(0.6);
    await s.narrate('He says it like it is a surprise to him.');
    await s.say('Bram', 'Let me try. I\'m nineteen. That\'s seven more years of kite.');
    await s.say('Pip', 'You\'ll break it.');
    await s.say('Bram', 'I will absolutely break it.');
    await s.say('Pip', '...Fine. Hold the string with me. Don\'t pull.');
    s.remove('tilly');
    s.place('pip', 17, 8, 'down');
    s.journal('Pip and Tilly flew a kite off the stern. Bram broke it. Everyone laughed, including Pip. We dropped Tilly home at Kiteholm after.');
  },

  async reforgeKnife(s) {
    await s.say('Nell', '...This is a kitchen knife.');
    await s.say('Pip', 'It\'s the Lucky Shiv.');
    await s.say('Nell', 'It\'s a kitchen knife with rust on it and a hair ribbon round the handle.');
    await s.say('Pip', 'It\'s the LUCKY SHIV. It was in the Rook Queen\'s nest. Stolen from the best.');
    await s.wait(0.8);
    await s.say('Nell', '...Right. The Lucky Shiv. Give me an hour.');
    await s.take('c11_tilly_knife');
    await s.fadeOut(0.8);
    s.sfx('burst');
    await s.wait(0.8);
    await s.fadeIn(0.8);
    await s.say('Nell', 'Kept the ribbon. Didn\'t seem right to take it off.');
    await s.give('pips_luck');
    await s.give('swift_fruit', 2);
    await s.say('Pip', 'Pip\'s Lucky Shiv. Stolen from the best.');
    await s.say('Corvin', 'Me?');
    await s.say('Pip', 'Tilly.');
    s.setFlag('c11_rite_pip_done');
    s.quest('c11_rite_pip', null, null, 'done');
    s.objective(mainObjective(s), true); // the rite is done: back to the Sun Shards
    s.journal('Nell turned Tilly\'s rusty knife into Pip\'s Lucky Shiv. She kept the ribbon on. Pip says it was stolen from the best. He means Tilly.');
  },

  async pipAfter(s) {
    return s.say('Pip', [
      'Tilly says when she grows up she\'s going to be a sky-pirate. I told her it\'s a terrible job.',
      'She asked if she could be one with me. I said only if she finishes growing up first. All the way. No skipping bits.',
    ]);
  },

  // ================================================================== BRAM — the Vigil
  async bramAsk(s) {
    await s.say('Bram', 'Halvard said look forward. I\'ve been trying. It\'s very hard to do on purpose.');
    await s.say('Bram', 'There\'s a place in the Greyspine. The Vigil Hall. Squires stand the night there before they\'re knighted. You kneel on the stone until dawn. You don\'t move. You don\'t sleep.');
    await s.say('Bram', 'That\'s where I froze. Something came out of the dark, and I froze, and Aldous stepped in front of it.');
    await s.say('Bram', 'I want to go back. I want to stand the vigil. Properly. All night.');
    await s.say('Wren', 'We\'ll come.');
    await s.say('Bram', 'It\'s supposed to be alone.');
    await s.say('Ilse', 'It\'s supposed to be a lot of things. Most of them stupid.');
    await s.say('Bram', '...You\'d come?');
    await s.say('Pip', 'Obviously.');
    await s.say('Corvin', 'And you\'ll need a knight to dub you, after. I might know one. Deserted. Disgraced. Technically never stripped of his spurs, because he ran before they could take them off him.');
    await s.say('Bram', '...Corvin?');
    await s.say('Corvin', 'Don\'t make it weird.');
    s.setFlag('c11_vigil_open');
    s.quest('c11_rite_bram', 'Bram\'s Rite: The Vigil', 'Bram wants to stand the knight\'s vigil at the Vigil Hall in the Greyspine, where he froze on the night Sir Aldous died.');
    await s.system('The *Vigil Hall* can now be reached from the helm.');
    s.journal('Bram wants to go back to the Vigil Hall and stand the vigil he never finished. Corvin says he\'ll knight him after. Bram cried a bit. Corvin told him not to make it weird.');
  },

  async vigilArrive(s) {
    s.music('snow');
    await s.say('Bram', 'It looks smaller.');
    await s.say('Sable', 'Places do that, I am told. When you come back to them bigger.');
    s.objective('Kneel on the vigil stone in the Vigil Hall.');
  },

  async vigilStone(s) {
    if (done(s, 'bram')) return s.narrate('The vigil stone. Worn in two shallow dips where a great many knees have been.');
    if (!(await s.confirm('Begin the vigil? (Bram will kneel until dawn.)'))) return;
    s.music('tension');
    s.place('player', 13, 11, 'up');
    s.spawn('v_bram', s.state.characters.bram.lookId, 13, 10, 'up');
    s.spawn('v_corvin', s.state.characters.corvin.lookId, 15, 12, 'up');
    s.spawn('v_ilse', s.state.characters.ilse.lookId, 11, 12, 'up');
    await s.narrate('Bram kneels on the vigil stone. The torches burn down. The hall gets very cold, and very quiet.');
    await s.wait(1.0);
    await s.narrate('Near midnight, the stone knights along the walls turn their heads.');
    await s.say('Bram', 'Don\'t— don\'t move for me. I\'m fine. Keep them off, and I\'ll keep kneeling.');
    let r = await s.battle('c11_vg_wave1', { bg: 'temple' });
    if (r !== 'win') return;
    await s.say('Bram', 'Still here.');
    await s.narrate('The small hours. The cold gets into your teeth. The knights come again, slower, heavier, testing.');
    r = await s.battle('c11_vg_wave2', { bg: 'temple' });
    if (r !== 'win') return;
    await s.say('Bram', 'Still— still here.');
    await s.wait(1.0);
    s.stopMusic(1.5);
    await s.narrate('The hour before dawn. At the far end of the hall the dark thickens, and gets up, and comes toward the stone. You knew it would. It was here the first time.');
    s.spawn('dread', { id: 'c11_dread_field', skin: '#1a0e1a', hair: { style: 'none' }, outfit: { style: 'cloak', main: '#140a14', accent: '#c03a3a' }, acc: ['horns', 'hood'], build: 'large' }, 13, 7, 'down');
    await s.say('Bram', 'I know you. You\'re what I saw. You\'re the thing I froze in front of.');
    await s.say('The Dread', '_You will freeze again._', { portrait: false });
    await s.say('Bram', 'Probably! I\'m terrified! Look at my _hands_!');
    await s.move('v_bram', [[13, 9]], 1.2);
    await s.say('Bram', 'But I didn\'t come here to stop being scared. I came here to stay. That\'s all the vigil is. I finally get it. You don\'t have to be brave. You just have to _stay_.');
    s.music('boss');
    r = await s.battle('c11_boss_dread');
    if (r !== 'win') return;
    s.remove('dread');
    s.flash('#ffe8c0', 1.0);
    s.music('kindling');
    await s.narrate('And through the high windows of the Vigil Hall, grey and thin and absolutely ordinary: dawn. Or the nearest thing the broken sky still has to one.');
    await s.move('v_bram', [[13, 6], [12, 5]], 1.6);
    await s.say('Bram', 'Sir Aldous Venn. He stood between.');
    await s.say('Bram', 'The Penitent carried a sword the Gloam made. The real one\'s here. We buried it with him.');
    await s.narrate('Bram takes the greatsword from the cairn. It comes out of the stones easily, as if it has been waiting to be asked.');
    await s.give('aldous_oath');
    await s.move('v_bram', [[13, 8]], 1.4);
    await s.move('v_corvin', [[13, 9]], 1.4);
    s.face('v_corvin', 'up');
    s.face('v_bram', 'down');
    await s.say('Corvin', 'Kneel, you great lump.');
    await s.wait(0.8);
    await s.say('Corvin', 'By the authority vested in me by the Dawnguard, which is dead; and the sky-wing, which is ash; and by me, who is mostly sober—');
    s.sfx('holy');
    await s.say('Corvin', 'Arise, Sir Bram Kestrel.');
    await s.wait(0.8);
    await s.say('Bram', 'That was beautiful.');
    await s.say('Corvin', 'I\'ve been practising in the mirror for eighteen years.');
    await s.say('Pip', 'You were going to knight _yourself_?');
    await s.say('Corvin', 'Tell anyone and I\'ll leave you on a rock.');
    await s.give('guard_fruit', 2);
    s.remove('v_bram'); s.remove('v_corvin'); s.remove('v_ilse');
    s.setFlag('c11_rite_bram_done');
    s.quest('c11_rite_bram', null, null, 'done');
    s.objective(mainObjective(s), true); // the rite is done: back to the Sun Shards
    s.journal('Bram stood the vigil. He shook the whole night and didn\'t move. At dawn he took Sir Aldous\'s sword from the cairn and Corvin knighted him. Sir Bram Kestrel. He keeps saying it under his breath.');
    await returnToShip(s);
  },

  // ================================================================== ILSE — the Staff of Small Mercies
  async ilseAsk(s) {
    await s.say('Ilse', 'Osk\'s staff.');
    await s.say('Ilse', 'It\'s stupid.');
    await s.say('Wren', 'It\'s not stupid.');
    await s.say('Ilse', 'Three reasons it\'s stupid. One: I have a staff. Two: it\'s a dead woman\'s staff. Three—');
    await s.say('Wren', 'Ilse. Do you want it?');
    await s.wait(1.2);
    await s.say('Ilse', '...Yes.');
    await s.say('Wren', 'Then that\'s one reason it isn\'t.');
    await s.say('Ilse', 'That isn\'t how lists work.');
    await s.say('Wren', 'It is now.');
    s.setFlag('c11_ilse_rite_open');
    s.quest('c11_rite_ilse', 'Ilse\'s Rite: Small Mercies', 'Mother Osk left her staff to Ilse, in the drowned infirmary on Mirefen\'s east island. Ilse wants it. She has said so out loud.');
    s.journal('Ilse wants Osk\'s staff. She said so. Out loud. With her mouth. I\'m writing it down in case she denies it later.');
  },

  async infirmaryEnter(s) {
    if (s.flag('c11_inf_entered')) return;
    s.setFlag('c11_inf_entered');
    s.music('sad');
    await s.narrate('Ilse cut the red cord herself. Inside: the smell of bitterleaf and old linen, and rows of beds, every one made with hospital corners.');
    await s.say('Ilse', 'She kept it so clean. A year with no one to see it, and she kept it so clean.');
    s.objective('Find Osk\'s staff in the infirmary.');
  },

  async infirmaryLedger(s) {
    await s.narrate('Osk\'s ward ledger. Every patient, every hour, every dose. The last forty pages are the same eleven names, over and over, and beside every one the same word: _comfortable._');
    await s.say('Ilse', 'She never wrote "died." Not once.');
  },

  async infirmaryStaff(s) {
    if (done(s, 'ilse')) return;
    stageParty(s, 9, 7, 'up', ['bram', 'corvin']);
    await s.narrate('On a stand at the head of the ward: a healer\'s staff of black willow, worn pale where a hand held it. Tied to it with string, a card: _For whoever comes next. — O._');
    await s.say('Ilse', 'For whoever comes next.');
    await s.wait(0.6);
    s.flash('#8a3aaa', 0.5);
    s.spawn('matron', 'c11_matron', 9, 5, 'down');
    await s.say('???', 'Put that down.', { portrait: false });
    await s.say('The Matron', 'Mender. You don\'t get to _want_ things. You get to work. Who will change the dressings while you\'re off wanting things? Who will hold the line?');
    await s.say('The Matron', 'One Crest. One life. Yours is _this_. Every night, every ward, forever.');
    await s.say('Ilse', '...She sounds like me.');
    await s.say('Wren', 'She sounds like you on a bad day.');
    await s.say('Ilse', 'Every day is a bad day, Wren. That\'s what a ward _is_.');
    await s.say('Wren', 'Then let\'s have a better one.');
    s.music('boss');
    const r = await s.battle('c11_boss_matron');
    if (r !== 'win') return;
    s.remove('matron');
    s.music('sad');
    await s.narrate('The Matron comes apart like wet ash and settles on the clean floor. Ilse stands very still for a long moment.');
    await s.say('Ilse', 'I want to study. Properly. In a real hospital with clean sheets and nobody bleeding on me before breakfast.');
    await s.say('Ilse', 'I want to sleep until noon. I want to grow lavender, badly, on a windowsill. I want—');
    await s.wait(0.8);
    await s.say('Wren', 'Go on.');
    await s.say('Ilse', 'I want my best friend back. Not the one who rang the end of the world. Not the one I stitched up in the Ember Ward and wouldn\'t speak to. Just you. Stupid, too-honest you.');
    await s.say('Wren', 'You never lost her. She just went somewhere really dumb for a while.');
    await s.say('Ilse', 'I forgave you, you know. A long time ago. I just never said it out loud, because I wanted to hold on to being angry a little longer. It was warm.');
    await s.say('Wren', 'And now?');
    await s.say('Ilse', 'Now I want something else more.');
    await s.narrate('She takes the staff from its stand.');
    await s.say('Ilse', 'The Staff of Small Mercies. That\'s what Osk called it, in the ledger. Because the big mercies were never hers to give. Only the small ones. Every scratch matters.');
    await s.give('mercy_staff');
    await s.give('spirit_fruit', 2);
    await s.give('crest_tome');
    unstage(s);
    s.setFlag('c11_rite_ilse_done');
    s.quest('c11_rite_ilse', null, null, 'done');
    s.objective(mainObjective(s), true); // the rite is done: back to the Sun Shards
    s.journal('Ilse took Osk\'s staff. Before she did, she told me everything she wants. It was a long list. I was on it. She says she forgave me a long time ago and just liked being angry. That\'s the most Ilse thing anyone has ever said.');
    s.music('swamp');
  },

  // ================================================================== CORVIN — the Stormwall
  async stormwallStart(s) {
    await s.wait(0.8);
    await s.say('Corvin', '...The Stormwall.');
    await s.wait(1.0);
    await s.say('Corvin', 'Alright. Alright. Everybody who isn\'t strapped to something, strap yourself to something.');
    s.setFlag('c11_storm_now');
    await s.fadeOut(1.0);
    await s.teleport('halcyon_deck', 12, 8, 'down');
  },

  async stormVoyage(s) {
    s.flash('#e0f0ff', 0.4);
    s.sfx('bolt');
    s.shake(0.4, 1.0);
    stageParty(s, 8, 9, 'left', ['corvin']);
    s.spawn('nell_s', 'c11_nell', 12, 6, 'down');
    await s.narrate('The Stormwall is a cliff of black cloud a hundred miles high, lit from inside. The Halcyon goes into it like a moth into a lamp.');
    await s.say('Nell', 'Captain! Starboard prop\'s taking water! We lose it in this and we _drop_!');
    await s.say('Corvin', 'I know. Hold her together, Nell.');
    await s.say('Nell', 'With _what_?');
    await s.say('Corvin', 'Spite. You\'ve got loads.');
    s.flash('#e0f0ff', 0.3);
    s.sfx('bolt');
    await s.narrate('Off the stern rail, the lifeboat swings on its davits. It would be the easiest thing in the world.');
    await s.say('Pip', 'Corvin?');
    await s.say('Corvin', 'Eighteen years ago I got in the lifeboat.');
    await s.say('Corvin', 'Hal was my captain. Hal Merrow. The Kingfisher, Dawnguard sky-wing. I would have followed her into the sun, and she told me to get in the boat, so I got in the boat.');
    await s.say('Corvin', 'Everybody tells it like I ran. I let them. It was easier than saying she sent me away.');
    await s.say('Pip', 'Why\'d she send you away?');
    await s.say('Corvin', 'Never found out. Never came back up to ask.');
    s.shake(0.6, 1.4);
    await s.narrate('Something vast moves in the cloud below the hull — and rises, and opens a mouth full of lightning.');
    await s.say('Corvin', 'Not now, you overgrown weather—! Wren! Get them off my deck!');
    await s.say('Wren', 'You\'re not coming?');
    await s.say('Corvin', 'I\'m staying at the helm. Somebody has to.');
    s.music('boss');
    const r = await s.battle('c11_boss_squall');
    if (r !== 'win') return;
    s.setFlag('c11_storm_now', false);
    s.remove('nell_s');
    unstage(s);
    s.stopMusic(2);
    await s.narrate([
      'The Squall King tears away into the storm, shrieking. And then — all at once — quiet.',
      'The eye. A bowl of still air, a mile wide, with a pale sky at the top of it. And hanging in the middle of the stillness: a broken gunship, her colours still flying.',
    ]);
    await s.say('Corvin', '...There she is.');
    s.quest('c11_rite_corvin', null, 'Corvin flew into the Stormwall and stayed at the helm. The wreck of the Kingfisher hangs in the eye of the storm.');
    await s.fadeOut(1.2);
    await s.teleport('c11_stormwall', 14, 22, 'up');
  },

  async wreckArrive(s) {
    if (s.flag('c11_sw_arrived')) return;
    s.setFlag('c11_sw_arrived');
    s.music('sad');
    await s.say('Corvin', 'The Kingfisher. Gunship, Dawnguard sky-wing. Fastest thing in the air, for about a week, eighteen years ago.');
    await s.say('Bram', 'There are people at the guns.');
    await s.say('Corvin', 'Yeah. There would be. Hal never let anyone leave a post.');
    await s.say('Corvin', 'Except me.');
    s.objective('Reach Captain Hal\'s cabin at the Kingfisher\'s stern.');
  },

  async wreckGunners(s) {
    if (s.flag('c11_sw_gunners')) return;
    await s.narrate('The gunners turn from their guns, very slowly. Their coats are Dawnguard blue. Their faces are rain.');
    await s.say('Corvin', 'Stand down, lads. Battle\'s over. It\'s been over a long time.');
    await s.narrate('They do not stand down.');
    const r = await s.battle('c11_sw_gunners', { bg: 'deck', mood: 'storm' });
    if (r !== 'win') return;
    s.setFlag('c11_sw_gunners');
    await s.say('Corvin', 'Rest easy. All of you. I\'ll tell her you held.');
  },

  async wreckCabin(s) {
    if (done(s, 'corvin')) return s.narrate('Hal\'s cabin. The chart table, the bunk, the empty peg where a coat used to hang.');
    if (!s.flag('c11_sw_gunners')) return s.say('Corvin', 'Not yet. The lads at the guns first. They were always first.');
    await s.narrate('Hal Merrow\'s cabin. The door is gone; the chart table is bolted down, and on it, held flat under a brass weight, the ship\'s log.');
    await s.give('c11_hal_log', 1, true);
    await s.say('Corvin', '"Kingfisher. Last entry. Starboard engine gone, fire in the magazine."');
    await s.say('Corvin', '"Sent Ashe to the boat. He\'ll hate me for it. He\'ll think I didn\'t trust him to stay."');
    await s.wait(0.8);
    await s.say('Corvin', '"It\'s the opposite, you great idiot. Somebody has to live long enough to be brave about something else. Go and be brave about something else, Corvin. — H."');
    await s.wait(1.5);
    await s.say('Corvin', '...She knew I\'d come back up here. Eventually. She always knew everything first. It was unbearable.');
    await s.say('Pip', 'Corvin, are you crying?');
    await s.say('Corvin', 'It\'s raining, Pip.');
    await s.say('Pip', 'It stopped raining.');
    await s.say('Corvin', 'It\'s raining on me specifically.');
    await s.narrate('On the bunk, wrapped in a sky-wing flag: a long silver pistol with a star set into the grip.');
    await s.say('Corvin', 'The Star. Hal\'s. She called it that because stars are the only lights in the sky that don\'t need anybody to keep them.');
    await s.say('Corvin', 'Named my ship after her. Now the gun after the ship. I\'m not a very imaginative man.');
    await s.give('halcyon_star');
    await s.give('lucky_coin');
    await s.give('crest_tome');
    await s.say('Ilse', 'I think it\'s lovely.');
    await s.wait(0.6);
    await s.say('Corvin', 'Something else to be brave about. Huh.');
    await s.say('Corvin', 'Turns out it\'s you lot.');
    await s.wait(0.6);
    await s.say('Corvin', 'Right. That\'s enough feelings for one decade. Everybody back on the ship.');
    s.setFlag('c11_rite_corvin_done');
    s.quest('c11_rite_corvin', null, null, 'done');
    s.objective(mainObjective(s), true); // the rite is done: back to the Sun Shards
    s.journal('Corvin flew into the Stormwall and didn\'t get in the lifeboat. Hal Merrow\'s last log said she sent him away so he\'d live to be brave about something else. He says it turns out to be us. He said it was raining on him specifically.');
    await returnToShip(s);
  },

  // ================================================================== SABLE — the girl under the roots
  async riftEnter(s) {
    if (s.flag('c11_rift_entered')) return;
    s.setFlag('c11_rift_entered');
    await s.say('Sable', 'It is cold here. It is like being inside a closed eye.');
    await s.say('Ilse', 'Stay close. All of you. I don\'t like how quiet it is.');
    await s.say('Sable', 'It is not quiet. Listen.');
    s.objective('Follow the echoes to the bottom of the Gloam Rift.');
  },

  async riftEcho(s, n) {
    const echoes = [
      ['_Cass? Cass, the lamp\'s gone out. It\'s so dark._', 'That is her voice. My voice. Hers.'],
      ['_Don\'t let go of my hand. Don\'t let go. Cass, you\'re hurting—_', 'He was holding on very tightly.'],
      ['_FATHER! Father, Lysa\'s still out there! Leave the lamp! FATHER!_', 'That is him. He was twelve.'],
      ['_...Cass? I can\'t see you. It\'s alright. I\'ll wait. I\'m good at waiting._', 'She has been waiting for forty years.'],
    ];
    const [echo, sable] = echoes[n];
    s.flash('#5a3a8a', 0.4);
    await s.narrate(echo);
    await s.say('Sable', sable);
  },

  async riftLysa(s) {
    if (done(s, 'sable')) return;
    stageParty(s, 15, 7, 'up', ['corvin', 'bram']);
    s.spawn('lysa', 'lysa', 15, 4, 'down');
    s.music('evernoon');
    await s.narrate('A bedroom, made of memory. A small bed. A shelf of wooden animals. A girl of ten in a white dress, sitting on the end of the bed swinging her feet.');
    await s.say('Lysa', 'Oh! You have my face.');
    await s.say('Sable', 'Yes. I am sorry. I did not choose it.');
    await s.say('Lysa', 'It looks good on you. You\'re older. I always wanted to be older.');
    await s.say('Sable', 'I am sixteen. Or I appear so.');
    await s.say('Lysa', 'I was going to be sixteen. I had plans. I was going to be a sky-pilot. And a baker. Both.');
    await s.say('Sable', 'Both is allowed. I am learning that.');
    await s.say('Lysa', 'Is Cass sad?');
    await s.say('Sable', 'Yes. Very. He is trying to bring you back. He has built a whole noon for you to live in.');
    await s.say('Lysa', 'I know. I can hear him. He sings all the time. It\'s very loud. It\'s always the same song.');
    await s.say('Lysa', 'Will you tell him something for me?');
    await s.say('Sable', 'Yes.');
    await s.say('Lysa', 'Tell him I\'m not in the noon. I\'m not anywhere. I\'m just a memory he\'s holding too tight. Memories don\'t grow up. People do.');
    await s.say('Lysa', 'And tell him he was a good brother. Tell him the lamp going out wasn\'t his fault. He always thinks everything\'s his fault.');
    await s.say('Sable', 'I will tell him.');
    await s.narrate('Lysa pulls the ribbon out of her hair and holds it out.');
    await s.say('Lysa', 'Here. For you. Not because you\'re me. Because I want somebody to wear it somewhere I never got to go.');
    await s.say('Lysa', 'Will you get old? Properly old? With wrinkles and everything?');
    await s.wait(0.8);
    await s.say('Sable', 'I would like that very much.');
    await s.say('Lysa', 'Good. Do it for both of us.');
    s.flash('#ffffff', 0.8);
    s.remove('lysa');
    await s.wait(0.8);
    s.shake(0.4, 1.2);
    await s.narrate('The dark at the edges of the room thickens. Everything the Gloam has ever kept, every forgotten thing, leaning in — wanting one thing more.');
    await s.say('???', '_You are made of us. Come home. Be no one again._', { portrait: false });
    await s.say('Sable', 'No. I have a name. And now I have a present. You cannot have either.');
    s.music('boss');
    const r = await s.battle('c11_boss_unremembered');
    if (r !== 'win') return;
    s.music('sad');
    await s.give('lysa_ribbon');
    await s.give('magic_fruit', 2);
    await s.say('Sable', 'I am keeping it. Not as Lysa. As someone who was given a present.');
    await s.say('Wren', 'It suits you.');
    await s.say('Sable', 'I know. I have decided to be a little vain about it. Pip says it is good for me.');
    unstage(s);
    s.setFlag('c11_rite_sable_done');
    s.quest('c11_rite_sable', null, null, 'done');
    s.objective(mainObjective(s), true); // the rite is done: back to the Sun Shards
    s.journal('Under Thornwood\'s roots we met Lysa — what\'s left of her. She gave Sable her ribbon and asked her to get old, properly old, for both of them. She gave her a message for Cassian. Sable says she\'ll deliver it.');
    await returnToShip(s);
  },

  // ================================================================== STARSEER — the Orrery
  async ottoline(s) {
    if (!s.flag('c11_orrery_met')) {
      s.setFlag('c11_orrery_met');
      await s.say('Ottoline', 'Visitors! Mind the brass. Don\'t mind the biscuits. Take two, they\'re mostly raisins.');
      await s.narrate('On the old woman\'s desk, under the biscuit tin, a brass nameplate: OTTOLINE MARSH, ASTRONOMER.');
      await s.hop('player');
      await s.say('Wren', 'Ottoline Marsh— you wrote _The Sunward Atlas_!');
      await s.say('Ottoline', 'Somebody READ it? Ha! That\'s both my readers in one week!');
      await s.say('Wren', 'Cassian gave me a copy. Before— everything.');
      await s.wait(0.8);
      await s.say('Ottoline', '...Oh. Well. He always did have excellent taste in books, and dreadful taste in absolutely everything else.');
      await s.say('Ottoline', 'When the sun broke, the stars came loose too. Only little ones. Starfall. They fell where the light was strongest — into the Lantern ruins, mostly, and the old sea floor.');
      await s.say('Ottoline', 'I\'m rebuilding my chart of the sky so I can see what\'s coming. I need the fragments. Seven, if my sums are right, and they usually are, except when they aren\'t.');
      await s.say('Ottoline', 'Bring me what you find. I have a great many things I don\'t need, and one thing I\'d very much like to give to the right person.');
      s.quest('c11_starseer', 'The Drowned Stars', 'Ottoline Marsh needs seven Starfall Fragments — splinters of starlight that fell into the Lantern ruins and the Drowned Reef.');
    }
    return RITES.starTurnIn(s);
  },

  async starTurnIn(s) {
    const given = s.vars.c11_stars_given || 0;
    const held = s.state.inventory.count('c11_star_fragment');
    if (given >= 7) {
      return s.say('Ottoline', s.flag('c11_fallen_star') ? 'Look at that sky. Seven little lights where there were none. I\'ll name one after you. Something dignified. "Wren\'s Embarrassment."' : 'It\'s still falling, you know. The one that didn\'t land. The telescope will show you, if you\'ve the nerve.');
    }
    if (!held) {
      return s.say('Ottoline', given ? `${given} of seven. Keep looking — they hum, if you get close. A bit like a kettle thinking about it.` : 'No starfall yet? Try the old Lanterns. Stars always did like a lighthouse.');
    }
    await s.take('c11_star_fragment', held);
    const total = given + held;
    s.vars.c11_stars_given = total;
    s.sfx('holy');
    await s.say('Ottoline', `Oh, _lovely_. Hold still, little one — there. That\'s ${total} of seven on the chart.`);
    const tiers = [[1, async () => s.give('crest_tome')], [3, async () => { await s.give('magic_fruit', 2); await s.give('spirit_fruit'); }],
      [5, async () => { await s.give('crest_tome', 2); await s.give('archmage_ring'); }]];
    for (const [n, reward] of tiers) {
      if (given < n && total >= n) {
        await s.say('Ottoline', 'And something for your trouble. Don\'t argue. I\'m old, I\'m allowed.');
        await reward();
      }
    }
    if (total >= 7) await RITES.starseer(s);
    return null;
  },

  async starseer(s) {
    s.music('afterlight');
    await s.narrate('Ottoline sets the last fragment into the great brass orrery. Seven small lights wink on across the dome, and the whole observatory hums like a held note.');
    await s.say('Ottoline', 'There. The drowned stars, back where they belong. Or near enough.');
    await s.say('Ottoline', 'You can\'t put the old sun back, you know. Nobody can. Not the Hierophant, not a hundred Keepers.');
    await s.say('Ottoline', 'But stars are only suns that are very far away. Perhaps the trick isn\'t to mend the big one. Perhaps it\'s to make a small one, close by, that belongs to everybody.');
    await s.say('Wren', '...A small one.');
    await s.say('Ottoline', 'It\'s only a theory. I\'ve written it in the margins of my own book. Nobody reads the margins.');
    await s.say('Ottoline', 'Now. The thing I wanted to give to the right person. It isn\'t a thing. It\'s a way of looking.');
    s.flash('#a0d0ff', 0.8);
    await s.learnCrest('starseer');
    await s.give('ribbon');
    await s.say('Ottoline', 'Read the sky. Bend fate a little, when it needs bending. Never more than a little. It sulks.');
    await s.wait(0.8);
    await s.say('Ottoline', '...Oh. Oh, dear. With the chart complete I can see it. One of them didn\'t land. It\'s still falling. Toward _us_.');
    await s.say('Pip', 'How fast?');
    await s.say('Ottoline', 'Tonight-ish. Look through the telescope if you\'re feeling brave. Or foolish. They\'re the same muscle.');
    s.quest('c11_starseer', null, null, 'done');
    s.journal('Ottoline Marsh finished her map of the drowned stars and taught us to read them. She says you can\'t mend the old sun — but maybe you can make a small one, close by, that belongs to everybody. I can\'t stop thinking about it.');
    s.music('ruin');
  },

  async telescope(s) {
    if (s.flag('c11_fallen_star')) return s.narrate('Through the great glass: seven small lights, and the dark between them, which is not as empty as it looks.');
    if ((s.vars.c11_stars_given || 0) < 7) return s.narrate('Through the great glass: cloud, cloud, and the faint hum of something very far away. Ottoline\'s chart has gaps in it.');
    await s.narrate('Through the great glass: one star, much brighter than the rest, getting brighter.');
    if (!(await s.confirm('Keep watching?'))) return;
    s.shake(0.5, 1.6);
    s.flash('#ffffff', 0.8);
    await s.narrate('It is not getting brighter. It is getting _closer_.');
    const r = await s.battle('c11_boss_star');
    if (r !== 'win') return;
    s.setFlag('c11_fallen_star');
    await s.say('Ottoline', 'Well! I\'ll be updating the chapter on falling stars. It\'ll be mostly exclamation marks.');
    await s.give('scholars_monocle');
    await s.say('Ottoline', 'Have these spectacles. Mine. They make you notice things. Dreadful habit, noticing.');
  },
};
