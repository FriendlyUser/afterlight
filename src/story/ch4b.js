// CHAPTER 4b — "The Pilgrim Road" (II): Mirefen.
// Down out of the Greyspine without Halvard. The fens, the gloam-rot, Mother Osk —
// and Ilse, for once, leading the way.
import { stage, unstage, moveAll } from './ch4b_common.js';

export const C4M = {
  // ================================================================ the causeway
  async opening(s) {
    if (s.flag('c4b_arrived')) return;
    s.setFlag('c4b_arrived');
    s.music('sad');
    const P = stage(s, {
      wren: [4, 20, 'right'], ilse: [3, 19, 'right'], bram: [2, 20, 'right'],
      sable: [3, 21, 'right'], pip: [5, 21, 'up'], corvin: [2, 21, 'right'],
    });
    await s.wait(0.6);
    await s.narrate([
      'Three days down out of the Greyspine. The snow became rain, the rain became fen,',
      'and nobody said very much at all.',
    ]);
    await s.say('Pip', 'So. Swamp.');
    await s.say('Corvin', 'Fen, kid. A swamp is a fen that\'s let itself go.');
    await s.say('Pip', 'It smells like a swamp.');
    await s.say('Corvin', 'They all do.');
    await s.wait(0.8);
    s.face(P.bram, 'down');
    await s.say('Bram', 'He\'d have had a word for it. Halvard. Some old monk word for "place that smells."');
    await s.say('Ilse', 'Bram.');
    await s.say('Bram', 'I\'m fine. I am entirely — I\'m fine.');
    s.face(P.sable, 'left');
    await s.say('Sable', 'You are not fine. Your face is doing the thing.');
    await s.say('Bram', 'What thing?');
    await s.say('Sable', 'The thing Wren\'s face did at the Kindling. Before she cried.');
    await s.say('Wren', 'I did _not_—');
    await s.say('Wren', '...Okay. A little.');
    await s.wait(0.5);
    await s.narrate('Wren takes the case of tuning forks out of her pack. Seven silver forks in blue velvet, humming faintly in the rain.');
    await s.say('Wren', 'Halvard said they\'re not tuned to the Dawnsong. They\'re tuned to its _reflection_.');
    s.face(P.ilse, P.wren);
    await s.say('Ilse', 'Three things. One: the Hierophant gave you those. Two: Garrick\'s soldiers have been a day behind us since Saltglass. Three: Halvard is dead because of whatever they\'re for.');
    await s.say('Wren', 'We don\'t know that.');
    await s.say('Ilse', 'Wren.');
    await s.say('Wren', 'We don\'t _know_ it.');
    await s.wait(0.6);
    await s.say('Corvin', 'Here\'s what I know. Cassian Lorne once pulled me out of a burning troop-ship by my collar.');
    await s.say('Corvin', 'And in twenty years I have never once seen that man do anything without knowing exactly why.');
    s.face(P.sable, 'up');
    await s.say('Sable', 'They are singing. Very quietly.');
    await s.say('Sable', 'The same song the Lantern sang when I stood in it. But backwards.');
    await s.say('Pip', 'Can we chuck \'em in the swamp?');
    await s.say('Corvin', 'Fen.');
    await s.wait(0.6);
    await s.say('Wren', '...No. We keep them. We just don\'t give them to anybody else.');
    await s.narrate('She shuts the case. It goes on humming.');
    await s.say('Wren', 'Mother Osk keeps the Mirefen Lantern. If the Choir\'s been here—');
    await s.say('Ilse', 'Then she needs to know what Halvard knew.');
    await s.say('Bram', 'And we need a roof. And soup. Halvard used to say soup was a sacrament.');
    await s.say('Pip', 'Was that a joke? Did the big guy just make a joke?');
    await s.say('Bram', 'It was a _tribute_.');
    unstage(s, P, [4, 20, 'right']);
    s.music('swamp');
    s.objective('Follow the causeway east to Mirefen and find its Keeper, Mother Osk.');
    s.journal('Halvard is gone. We came down out of the mountains into the fens without him. The forks are still in my pack. I can\'t make myself throw them away.');
  },

  async poster(s) {
    await s.narrate('A notice, nailed to the post. The rain has run the ink — but not enough.');
    await s.system('*WANTED* by order of the Lord-Commander of the Dawnguard:\nA GIRL, black hair, pale, about sixteen, answers to "Sable."\nTravelling with a red-haired Vanguard; a Mender; a disgraced squire; a street child; and a man who owes money.\n*5,000 gold — ALIVE.*');
    if (s.flag('c4b_poster_read')) return;
    s.setFlag('c4b_poster_read');
    await s.say('Pip', '"A street child." I\'ve got a _name_.');
    await s.say('Corvin', '"A man who owes money." That\'s slander.');
    await s.say('Corvin', '...It\'s accurate. But it\'s slander.');
    await s.say('Bram', '"Disgraced squire." They didn\'t even spell it wrong. I\'d have preferred they spelled it wrong.');
    await s.say('Sable', '"Alive." He wants me alive.');
    await s.say('Ilse', 'That\'s... good?');
    await s.say('Sable', 'I don\'t know. I don\'t know what he wants me alive _for_.');
    await s.say('Pip', 'Five thousand gold. We could turn you in and steal you back.');
    await s.say('Corvin', 'I like how the kid thinks.');
    await s.say('Ilse', 'No.');
  },

  async patrol(s) {
    if (s.flag('c4b_patrol_done')) return;
    s.music('tension');
    s.spawn('dg1', 'dawnguard', 34, 18, 'left');
    s.spawn('dg2', 'c4b_dg_crossbow', 35, 20, 'left');
    s.spawn('dg3', 'dawnguard', 34, 20, 'left');
    await s.say('Dawnguard Sergeant', 'Halt! By order of the Lord-Commander, every traveller on this causeway is to be searched for—');
    await s.emote('dg1', '!');
    await s.say('Dawnguard Sergeant', 'Black hair. Pale. That\'s _her_. That\'s the—');
    await s.say('Bram', 'Sergeant! Is it Sergeant? I can\'t tell with the helmet. Hello. We are a travelling theatre troupe.');
    await s.say('Dawnguard Sergeant', '...Kestrel? Bram _Kestrel_?');
    await s.say('Bram', 'Not a very _good_ theatre troupe.');
    await s.say('Dawnguard Sergeant', 'Take the girl! The rest are worth nothing!');
    const r = await s.battle('c4b_dg_patrol', { bg: 'swamp' });
    if (r !== 'win') return;
    s.setFlag('c4b_patrol_done');
    await s.say('Dawnguard Sergeant', 'The Lord-Commander will hear of this, Kestrel! He\'ll — he\'ll—');
    await moveAll(s, [['dg1', [[40, 18], [46, 15]]], ['dg2', [[40, 20], [46, 16]]], ['dg3', [[40, 19], [46, 15]]]], 4.5);
    ['dg1', 'dg2', 'dg3'].forEach((id) => s.remove(id));
    await s.say('Bram', 'They knew my name.');
    await s.say('Corvin', 'Everybody knows your name, big man. You say it very loudly.');
    await s.say('Ilse', 'Garrick has pickets this far south. Either he\'s ahead of us, or he\'s everywhere.');
    await s.say('Wren', 'Then we keep moving.');
    s.music('swamp');
  },

  async gaspar(s) {
    if (s.flag('c4b_osk_saved')) {
      return s.say('Gaspar', ['Word came down the water: Mother Osk\'s sitting up and shouting at people. Best news I\'ve had in a month.', 'If you\'re ever back this way, my punt\'s yours. Free. Well. Half price.']);
    }
    await s.say('Gaspar', ['Gaspar\'s the name, poling\'s the game. Was the game. Nobody\'s crossing the fen since the light went out.']);
    await s.say('Gaspar', ['Mother Osk took the fever the very night the Choir barge came. Coincidence, the Choir said. Very sure of themselves, the Choir.']);
    await s.say('Gaspar', ['The village is east. Mind the toads. They\'ve gone strange.', '...Stranger.']);
  },

  // ================================================================ Mirefen
  async arrival(s) {
    if (s.flag('c4b_mirefen_arrived')) return;
    s.setFlag('c4b_mirefen_arrived');
    const P = stage(s, {
      wren: [4, 18, 'right'], ilse: [3, 17, 'right'], bram: [2, 18, 'right'],
      sable: [2, 17, 'right'], pip: [5, 17, 'right'], corvin: [1, 18, 'right'],
    });
    s.spawn('hesk_r', 'c4b_hesk', 15, 17, 'left');
    await s.wait(0.4);
    await s.move('hesk_r', [[7, 17]], 5);
    await s.say('Hesk', 'Are you from the Cathedral? Did they send it back? Did they—');
    await s.wait(0.4);
    await s.say('Hesk', 'Oh. You\'re... you\'re children.');
    await s.say('Pip', 'Rude.');
    await s.say('Wren', 'We\'re carrying letters to the Keepers. From Aurenne. The Hierophant sent us.');
    await s.say('Hesk', '_The Hierophant._', { speed: 0.6 });
    await s.say('Hesk', 'Then you\'re too late. Or too early. I don\'t know which.');
    await s.say('Hesk', 'Mother Osk has the rot. The black-vein fever. Doctor Vey says she won\'t see morning.');
    await s.move(P.ilse, [[6, 17]], 3);
    await s.say('Ilse', 'Where is she?');
    await s.say('Hesk', 'In the Lantern. She won\'t let us move her. She says a Keeper dies at her light.');
    await s.say('Hesk', '...Even when the light\'s gone out.');
    await s.say('Ilse', 'I\'m a Mender. Take me to her. Now, please.');
    await s.wait(0.3);
    await s.say('Hesk', 'The Lantern — north-east, past the Rot House! Hurry!');
    await s.move('hesk_r', [[15, 17], [28, 16]], 5);
    s.remove('hesk_r');
    await s.say('Corvin', 'Well. That\'s the soup off.');
    await s.say('Bram', 'Corvin.');
    await s.say('Corvin', 'I know. I know. Jokes are a reflex. Like flinching.');
    unstage(s, P, [4, 18, 'right']);
    s.objective('Go to Mother Osk in the Mirefen Lantern, north-east of the village.');
    s.journal('Mirefen. Mother Osk is dying of the gloam-rot, and her Lantern is dark. Ilse didn\'t even wait to be asked.');
  },

  async lanternEnter(s) {
    if (!s.flag('c4b_osk_seen')) return C4M.oskFirst(s);
    if (s.flag('c4b_mawmire_beaten') && !s.flag('c4b_osk_saved')) return C4M.cure(s);
    return null;
  },

  async oskFirst(s) {
    s.setFlag('c4b_osk_seen');
    s.music('sad');
    const P = stage(s, {
      wren: [6, 7, 'up'], ilse: [5, 7, 'left'], bram: [8, 9, 'up'],
      sable: [7, 8, 'up'], pip: [8, 8, 'up'], corvin: [9, 9, 'up'],
    });
    s.spawn('vey_l', 'c4b_vey', 4, 6, 'left');
    await s.wait(0.5);
    await s.narrate([
      'The room smells of willow bark and fever. In the bed against the wall, under three blankets, a small old woman is shivering hard enough to rattle the frame.',
    ]);
    await s.say('Mother Osk', '...told him no. Told him no, told him _no_—', { speed: 0.7 });
    await s.say('Hesk', 'She\'s been saying that for two days.');
    await s.move(P.ilse, [[4, 5], [3, 5]], 3);
    s.face(P.ilse, 'up');
    await s.wait(0.4);
    await s.say('Mother Osk', '...Ysolde?');
    await s.say('Mother Osk', 'Ysolde Halloway, you\'ve got _old_. Where are your manners? Where\'s my tea?');
    s.face(P.wren, 'left');
    await s.say('Wren', '...That\'s my mother.');
    await s.say('Mother Osk', 'Course it is. Same chin. Stubborn chin. I told your mother no too, didn\'t I. No, no—', { speed: 0.7 });
    await s.wait(0.6);
    await s.say('Ilse', 'Three things. Black veins to the elbow. Fever — very high. And her breath—');
    await s.wait(0.5);
    await s.say('Ilse', 'It rattles. It\'s in her lungs.');
    s.face('vey_l', P.ilse);
    await s.say('Doctor Vey', 'Three weeks of rot, four days of fever. It\'s at her shoulder now. I\'ve tried willow, feverfew, eel-oil and prayer. In that order, then in every other order.');
    await s.say('Doctor Vey', 'You\'re the Mender? You\'re _sixteen_.');
    await s.say('Ilse', 'And you\'re out of ideas.');
    await s.wait(0.4);
    await s.say('Ilse', '...Sorry. That was — I\'m sorry.');
    await s.say('Doctor Vey', 'Don\'t be. It\'s true.');
    await s.say('Ilse', 'My grandmother has a book. There\'s a recipe in it — _for the black-vein fever of the fens._');
    await s.say('Ilse', 'Lanternmoss, for the light it remembers. A weepcap lily, for the dark it grew in. And the gall of the thing that\'s making it.');
    await s.say('Doctor Vey', 'The old bog remedy. Every grandmother in Mirefen knows it.');
    await s.say('Doctor Vey', 'Every grandmother in Mirefen also knows that lanternmoss only grows on the Sunken Shrine, weepcaps only in the Root Grotto, and whatever\'s making the rot lives in the black pool at the heart of the Drownmere.');
    await s.say('Doctor Vey', 'Nobody has come back out of the Drownmere since the Lantern went dark.');
    await s.say('Ilse', 'Nobody has gone in with a Vanguard, a Warden, a — whatever Sable is—');
    await s.say('Sable', 'Gloamweaver.');
    await s.say('Ilse', '—a thief and a pirate.');
    await s.say('Corvin', 'Captain.');
    await s.say('Pip', 'Rogue. It\'s a Crest now. I\'m _official_.');
    await s.move(P.ilse, [[4, 5], [5, 6]], 3);
    s.face(P.ilse, P.wren);
    s.face(P.wren, P.ilse);
    await s.say('Ilse', 'Three things. One: Doctor Vey keeps her breathing until we\'re back. Two: I\'ll need a mortar and a clean pot. Three—');
    await s.say('Wren', 'Three: we\'re going into the bog.');
    await s.say('Ilse', 'Three: _I\'m_ going into the bog. You\'re coming because you\'d follow me anyway.');
    await s.wait(0.5);
    await s.say('Wren', '_(grinning)_ Same as always?');
    await s.say('Ilse', 'Opposite of always.');
    await s.say('Hesk', 'Take the punt from the south jetty. I\'ll tell the warden to let you through.');
    await s.say('Hesk', '...Thank you. You don\'t even know her.');
    await s.say('Ilse', 'I know what a fever is.');
    s.setFlag('c4b_cure_quest');
    s.remove('vey_l');
    unstage(s, P, [7, 9, 'down']);
    s.music('sad');
    s.objective('In the Drownmere (south jetty): gather Lanternmoss at the Sunken Shrine (west) and a Weepcap Lily in the Root Grotto (east).');
    s.journal('Ilse has a plan. Ilse always has a plan — but this one is HERS, and I\'m following it into a bog. I think she\'s been waiting her whole life for someone to need her this much.');
  },

  async osk(s) {
    if (!s.flag('c4b_osk_saved')) {
      return s.narrate(['Mother Osk is asleep, or something like it. Her lips keep moving.', '_No. No. No._']);
    }
    if (!s.flag('c4b_elowen_done')) {
      return s.say('Mother Osk', ['Still here? Elowen\'s in the Heartwood, past Rootholm, through the Thornwood. North out of the village, then east.', 'Tell her Osk says she still owes me a goose. She\'ll know.']);
    }
    return s.say('Mother Osk', ['Ysolde\'s girl. Go on, then. Go and be stubborn somewhere useful.', 'And if you see your mother before I do — tell her I said she was right. She\'ll hate that.']);
  },

  async heskBefore(s) {
    if (s.flag('c4b_mawmire_beaten')) return s.say('Hesk', 'You did it? You really — go on, go to her! Quickly!');
    if (s.flag('c4b_cure_quest')) return s.say('Hesk', ['The Drownmere\'s past the south jetty. Bring the punt back. Bring yourselves back.', 'I keep making her soup. She can\'t eat it. I keep making it.']);
    return s.say('Hesk', 'Please. Whatever you can do.');
  },

  async heskAfter(s) {
    if (s.flag('c4b_hesk_talk')) return s.say('Hesk', ['I polish the cradle every morning. For when the stone comes back.', 'It will come back. Won\'t it?']);
    s.setFlag('c4b_hesk_talk');
    await s.say('Hesk', 'I gave it to them, you know. The stone.');
    await s.say('Hesk', 'I stood there and let them carry it out of the Lantern, because they had a seal and I had a fever and a frightened face.');
    await s.say('Hesk', 'Mother Osk says it isn\'t my fault.');
    await s.say('Wren', '...She\'s right.');
    await s.say('Hesk', 'Is she? Then how do you stop feeling like it is?');
    await s.wait(0.8);
    await s.say('Wren', 'I don\'t know. I\'ll tell you if I find out.');
    await s.say('Hesk', 'Here. Lamp-oil from the Lantern. The last of it. It burns blue, and the Gloam hates it.');
    await s.give('holy_water', 3);
  },

  async rusk(s) {
    await s.say('Rusk', s.flag('c4b_osk_saved')
      ? 'Welcome to the Leaning Heron! It leans. The beer doesn\'t. Sixty gold a bed, and tonight the beds are full of the _living_. Cheers to the Mender!'
      : 'Welcome to the Leaning Heron. It leans. The beer doesn\'t. Half my rooms are full of folk waiting to die, half are full of folk waiting to bury them. Sixty gold and I\'ll find you a third half.');
    await s.inn(60, 'the Leaning Heron');
  },

  async lark(s) {
    await s.say('Lark', [
      '_Seven lights at the edge of the world, / seven Keepers keeping; / one by the sea and one in the sand, / one where the snow lies sleeping;_',
      '_one in the fen and one in the wood, / one where the storm-winds wander, / and one in the City of Bells, my love — / and the dark on the other side, yonder._',
    ]);
    if (s.flag('c4b_lark_heard')) return;
    s.setFlag('c4b_lark_heard');
    await s.say('Lark', 'Old fen song. Older than the Choir. My gran sang the last verse different.');
    await s.say('Wren', 'Different how?');
    await s.say('Lark', '"_And one in the City of Bells, my love, that went out once — and grew fonder._"');
    await s.say('Lark', 'Never understood it. Nice rhyme, though.');
  },

  // ================================================================ the Rot House
  async vey(s) {
    if (s.flag('c4b_osk_saved')) {
      if (!s.flag('c4b_vey_gift')) {
        s.setFlag('c4b_vey_gift');
        await s.say('Doctor Vey', 'Twenty-four patients. Twenty-four draughts. The girl brewed them all and then fell asleep standing up.');
        await s.say('Doctor Vey', 'Thirty years a doctor, and a sixteen-year-old taught me something. I\'m going to go and be humbled somewhere private.');
        await s.say('Doctor Vey', 'Take these. I won\'t need them now. Well — I will. Take them anyway.');
        await s.give('panacea', 3);
        return;
      }
      return s.say('Doctor Vey', 'I\'ve written her recipe on the inside of my sleeve. I\'m never washing this coat again.');
    }
    if (s.flag('c4b_cure_quest')) return s.say('Doctor Vey', ['If the girl can really make the Marrow remedy, she\'ll want my mortar. It\'s the one that isn\'t cracked.', '...Less cracked.']);
    return s.say('Doctor Vey', ['The Rot House. Twenty beds. Twenty-four patients. I\'ve stopped being good at sums.', 'Don\'t touch anyone\'s hands. Don\'t breathe near the coughing ones. Don\'t, on the whole, be here.']);
  },

  async lisette(s) {
    if (s.flag('c4b_osk_saved')) {
      return s.say('Cantor Lisette', [
        'I wrote to the Cathedral. I told them the Rot House is empty and asked them to send Mirefen\'s stone home.',
        'They haven\'t answered. They always answer.',
        '...I\'m going back on the next barge. I\'m going to ask in person.',
      ]);
    }
    await s.say('Cantor Lisette', 'I came on the Cathedral\'s barge to tend the sick. When it left, I stayed.');
    await s.say('Cantor Lisette', 'His Grace took the Dawnstone to keep it safe. The Gloam is rising everywhere. Better the stones rest in the Cathedral than be lost.');
    await s.say('Cantor Lisette', 'That\'s what I was told. That\'s what I believe.');
    await s.say('Cantor Lisette', 'Please don\'t look at me like that.');
    if (s.flag('c4b_lisette_sable')) return;
    s.setFlag('c4b_lisette_sable');
    await s.say('Cantor Lisette', '...You. The girl with the black hair. Have we met?');
    await s.say('Sable', 'I don\'t think so.');
    await s.say('Cantor Lisette', 'I know your face. From a painting, I think. In the Cathedral — above the door of His Grace\'s private chapel.');
    await s.say('Cantor Lisette', 'A little girl, holding a lantern. The Hierophant lights a candle under it every morning.');
    await s.wait(0.8);
    await s.say('Sable', '...');
  },

  async nettie(s) {
    if (s.flag('c4b_osk_saved')) {
      await s.say('Nettie', '"—four for the eel and five for the frog, six for the Keeper who sings through the fog!"');
      await s.say('Nettie', 'I can say the whole thing now! The Mender-girl made me drink a boot.');
      if (s.flag('c4b_nettie_rhyme') && !s.flag('c4b_nettie_seven')) {
        s.setFlag('c4b_nettie_seven');
        await s.say('Sable', 'There is no seven.');
        await s.say('Nettie', 'Seven\'s for you. You choose what it\'s for. That\'s the rule.');
        await s.say('Sable', '...I will think about it carefully.');
      }
      return;
    }
    if (s.flag('c4b_nettie_rhyme')) return s.say('Nettie', ['I\'m not scared. Mother Osk says the rot is just the dark being rude.', '_(She coughs for a long time.)_']);
    s.setFlag('c4b_nettie_rhyme');
    await s.say('Nettie', 'Are you the Gloamweaver? Hesk says there\'s a girl with a black Crest.');
    await s.say('Sable', 'Yes.');
    await s.say('Nettie', 'Is it scary?');
    await s.say('Sable', 'It is cold. Sometimes it is lonely.');
    await s.say('Nettie', 'Mine\'s going to be Mender, I think. Like Mother Osk. Or the one that gets to ride the boats.');
    await s.say('Sable', 'I don\'t know which one that is. I have only had one Crest, and nobody gave it to me.');
    await s.say('Nettie', 'Do you know the counting rhyme? The Mirefen one?');
    await s.say('Sable', 'No.');
    await s.say('Nettie', '"One for the lantern, two for the light, three for the heron that fishes at night—"');
    await s.say('Nettie', '...I can\'t do the rest. It makes me cough.');
    await s.say('Sable', 'Then I will wait, and you will tell me the rest when you can.');
  },

  async dace(s) {
    if (s.flag('c4b_osk_saved')) {
      if (s.flag('c4b_dace_done')) return s.say('Corporal Dace', 'Serve the light, not the man holding the lamp. I\'m going to try that for a while. See how it fits.');
      s.setFlag('c4b_dace_done');
      await s.say('Corporal Dace', 'The Mender brought me the draught herself. Didn\'t ask whose side I was on.');
      await s.say('Corporal Dace', 'So here\'s what I owe you. The Lord-Commander\'s gone north, to the Stormcrown. His warship\'s waiting there. Something to do with Skyreach.');
      await s.say('Corporal Dace', 'And he\'s left pickets on every road between here and there, looking for your black-haired friend.');
      await s.say('Corporal Dace', 'Take this. Dawnguard issue. It\'s supposed to keep the dark off you.');
      await s.give('star_pendant');
      await s.say('Corporal Dace', 'Didn\'t work for me. Maybe you\'ll have better luck.');
      await s.say('Bram', 'Will you go back? To them?');
      await s.say('Corporal Dace', 'Don\'t know. Sir Aldous used to say a Dawnguard serves the light, not the man holding the lamp.');
      await s.say('Corporal Dace', 'Seems to me the man holding the lamp has forgotten that.');
      await s.say('Bram', '_(quietly)_ He said that to me, too.');
      return;
    }
    if (s.flag('c4b_dace_met')) return s.say('Corporal Dace', ['Garrick\'s column went north, two days back. Toward the Stormcrown.', 'A soldier who can\'t march is a soldier who can\'t serve. That\'s what he said when they left me.']);
    s.setFlag('c4b_dace_met');
    await s.say('Corporal Dace', 'Don\'t — don\'t come closer. I\'ve got the rot.');
    await s.wait(0.5);
    await s.say('Corporal Dace', '...Kestrel? Bram Kestrel? The squire who froze at the Trial?');
    await s.say('Bram', '...That\'s me.');
    await s.say('Corporal Dace', 'I was in the stands. Third row. You were very... still.');
    await s.say('Bram', 'Yes. I\'ve had notes.');
    await s.say('Corporal Dace', 'The Lord-Commander\'s column came through two days ago, limping down off the Greyspine like whipped dogs. I\'d caught the fever on the march. They left me where I fell.');
    await s.say('Corporal Dace', 'Garrick says a soldier who can\'t march is a soldier who can\'t serve.');
    await s.say('Bram', 'Garrick says a lot of things.');
    await s.say('Corporal Dace', 'He says a lot of things about you.');
    await s.wait(0.6);
    await s.say('Bram', '...I expect he does.');
  },

  async sedge(s) {
    if (s.flag('c4b_osk_saved')) return s.say('Sedge', ['Mother Osk says she\'ll Kindle me by candlelight if she has to. Is that allowed?', 'She says she doesn\'t care if it\'s allowed. I like her a lot.']);
    await s.say('Sedge', 'I\'m sixteen next spring. Mirefen kids get Kindled at our own Lantern.');
    await s.say('Sedge', 'If the light doesn\'t come back... do I just not get a Crest?');
    if (s.flag('c4b_sedge_talk')) return;
    s.setFlag('c4b_sedge_talk');
    await s.say('Pip', 'I got mine early. From a blind lady in a desert. It\'s not that great.');
    await s.say('Pip', '...It\'s a little bit great.');
    await s.say('Sedge', 'What if the light gets me wrong?');
    await s.wait(0.5);
    await s.say('Wren', 'Then you tell it so.');
  },

  async pell(s) {
    if (s.flag('c4b_pell_done')) return s.say('Widow Pell', ['I closed the shutters last night. First time in two winters.', 'I slept like a stone. I\'d forgotten how.']);
    if (s.has('c4b_pell_ring')) {
      s.setFlag('c4b_pell_done');
      await s.say('Wren', 'We found this. In the chapel, in the Drownmere.');
      await s.take('c4b_pell_ring');
      await s.wait(1.0);
      await s.say('Widow Pell', '..._Tobin._', { speed: 0.5 });
      await s.say('Widow Pell', '"Always the long way home." He had that put on it as a joke. He was always late for supper.');
      await s.wait(0.6);
      await s.say('Widow Pell', 'He isn\'t really out there, is he. On the water. It\'s just the fog, remembering him wrong.');
      await s.say('Sable', 'The Gloam remembers things. It does not remember them _right_.');
      await s.say('Widow Pell', 'Then I\'ll remember him right. That will have to do.');
      await s.narrate('She threads the ring onto the string around her neck, and tucks it under her collar, close.');
      await s.say('Widow Pell', 'Tobin grew these on the roof. Swore they\'d make you strong. They never did a thing for him. Maybe you\'ll have better luck.');
      await s.give('vigor_seed', 2);
      s.quest('c4b_q_pell', null, null, 'done');
      return;
    }
    if (s.flag('c4b_pell_asked')) return s.say('Widow Pell', 'The old chapel in the Drownmere. He always went the long way round, past it. Please — if you see a ring...');
    s.setFlag('c4b_pell_asked');
    await s.say('Widow Pell', 'Every night, when the fog comes up, my Tobin walks on the water. Out there, past the reeds.');
    await s.say('Widow Pell', 'He drowned two winters ago. Since the Lantern went dark, he comes back. He doesn\'t look at me. He just... walks.');
    await s.say('Widow Pell', 'He lost his ring the day he went under. He always took the long way home — past the old chapel in the Drownmere.');
    await s.say('Widow Pell', 'I know it isn\'t really him. I know. But if he found it, maybe he\'d stop walking.');
    await s.say('Wren', 'We\'re going into the Drownmere anyway. We\'ll look.');
    s.quest('c4b_q_pell', 'The Long Way Home', 'Widow Pell\'s husband drowned with his wedding ring. Look for it near the old chapel in the Drownmere.');
  },

  // ================================================================ the Drownmere
  async mereEnter(s) {
    await s.narrate('The punt bumps against a rotten jetty. Beyond it lies the Drownmere: black water, white fog, and a silence with something breathing in it.');
    await s.say('Corvin', 'Lovely. Really. Who wants to go first?');
    await s.say('Ilse', 'I do.');
    await s.say('Bram', 'Ilse — I\'m the Warden, I should—');
    await s.say('Ilse', 'You should stay behind me and be large.');
    await s.say('Bram', 'I can do that.');
  },

  async moss(s) {
    if (s.flag('c4b_got_moss')) return;
    s.setFlag('c4b_got_moss');
    await s.narrate('Pale gold moss grows thick on the shrine stones, in the shape of the lamp that once stood here. It is warm, like a hand.');
    await s.say('Ilse', 'Lanternmoss. It drank the shrine-lamp\'s light for two hundred years. It still remembers.');
    await s.say('Sable', 'It is humming. Like the forks. But _forwards_.');
    await s.give('c4b_lanternmoss');
    await C4M.ingredients(s);
  },

  async lily(s) {
    if (s.flag('c4b_got_lily')) return;
    s.setFlag('c4b_got_lily');
    await s.narrate('In the deepest hollow of the grotto, a single white lily grows out of the black mud, its petals closed tight.');
    await s.say('Ilse', 'A weepcap. It\'s never seen the sun — if light touches it, it wilts. Everybody, shade it.');
    await s.say('Pip', 'With what?');
    await s.say('Ilse', 'With Bram.');
    await s.say('Bram', 'Happy to help!');
    await s.narrate('Bram looms helpfully. Ilse lifts the lily out of the mud by its roots, as gently as lifting a sleeping child.');
    await s.give('c4b_weepcap');
    await C4M.ingredients(s);
  },

  async ingredients(s) {
    if (s.flag('c4b_got_moss') && s.flag('c4b_got_lily')) {
      await s.say('Ilse', 'That\'s two. The third is whatever\'s making the rot. North, past the shrine island — the black pool.');
      s.objective('Burn through the rot-wood north of the shrine island and find the source of the rot in the black pool.');
      s.journal('Lanternmoss and a weepcap lily. Ilse knows exactly what she\'s doing. I\'m mostly carrying things and trying not to fall in.');
    } else {
      await s.say('Ilse', s.flag('c4b_got_moss') ? 'One. Now the weepcap — the Root Grotto, east of the shrine island.' : 'One. Now the lanternmoss — the Sunken Shrine, west of the shrine island.');
    }
  },

  async rotWall(s) {
    if (!(s.flag('c4b_got_moss') && s.flag('c4b_got_lily'))) {
      await s.narrate('A wall of black, rotted saplings chokes the path north. The wood is soft and wet and warm, and it is moving — very slightly, like something breathing.');
      await s.say('Ilse', 'It\'s the rot. Grown solid.');
      await s.say('Sable', 'It flinches from light. I can feel it flinch.');
      await s.say('Ilse', s.flag('c4b_got_moss')
        ? 'The lanternmoss would burn it, but it\'ll gutter out in a breath. I need the weepcap\'s sap to make it last. Lily first.'
        : 'We need something brighter than a torch. Something it remembers.');
      return;
    }
    await s.narrate('Ilse crushes a pinch of lanternmoss into a drop of weepcap sap and blows on it. It catches like a coal — a small, fierce, golden light.');
    s.flash('#ffe8a0', 0.8);
    s.sfx('holy');
    await s.wait(0.4);
    s.clearBlocker('rotwall');
    await s.narrate('The rot-wood shrivels from the light like a hand from a stove, and crumbles into wet black ash.');
    await s.say('Ilse', 'The sap makes the moss burn longer. Nana\'s book was right about everything.');
    await s.say('Wren', 'Nana\'s book is always right.');
    await s.say('Ilse', 'Don\'t tell her. She\'ll be unbearable.');
  },

  async ring(s) {
    if (s.flag('c4b_pell_ring')) return;
    s.setFlag('c4b_pell_ring');
    await s.narrate(['On the drowned altar, half-buried in silt, something glints. A plain copper ring.', 'Inside the band, worn nearly smooth: _T. — always the long way home._']);
    await s.give('c4b_pell_ring');
    await s.say('Wren', s.flag('c4b_pell_asked') ? 'Tobin Pell\'s ring. She\'ll want this back.' : 'Someone\'s wedding ring. Someone in Mirefen might know whose.');
  },

  async mawmire(s) {
    if (s.flag('c4b_mawmire_beaten')) return;
    s.music('tension');
    await s.narrate([
      'The black pool is perfectly still. Bones ring its shore — fish, birds, something larger.',
      'In the middle of the water, bubbles rise. Slowly. Like breathing.',
    ]);
    await s.say('Corvin', 'I want it on record that I said "who wants to go first" and meant it rhetorically.');
    s.shake(0.35, 1.2);
    await s.wait(0.6);
    await s.narrate('The pool heaves. Something rises out of it — a bloated, eyeless thing of black mud and gristle, ringed with mouths.');
    await s.say('Ilse', 'That\'s it. That\'s the rot. That\'s what\'s in her lungs.');
    await s.say('Wren', 'Then let\'s get it out.');
    const r = await s.battle('c4b_boss_mawmire', { bg: 'swamp' });
    if (r !== 'win') return;
    s.setFlag('c4b_mawmire_beaten');
    s.music('swamp');
    await s.narrate('When it is over, Ilse wades into the shallows with her knife and her jaw set, and comes back with something black and dense in a jar.');
    await s.say('Ilse', 'Rot-gall. The sickness, made solid.');
    await s.say('Pip', 'You just — you just stuck your whole arm in that.');
    await s.say('Ilse', 'It was in Mother Osk\'s lungs. My arm can cope.');
    await s.give('c4b_rot_gall');
    s.objective('Hurry back to Mother Osk in the Mirefen Lantern.');
    s.journal('We killed the thing in the black pool. Ilse cut its heart out and put it in a jar. I have never been so proud of anyone, or so glad she\'s on my side.');
  },

  // ================================================================ the cure
  async cure(s) {
    s.setFlag('c4b_osk_saved');
    s.music('sad');
    s.remove('hesk');
    const P = stage(s, {
      wren: [6, 7, 'left'], ilse: [11, 6, 'up'], bram: [8, 9, 'up'],
      sable: [7, 8, 'left'], pip: [9, 8, 'up'], corvin: [9, 9, 'up'],
    });
    s.spawn('vey_l', 'c4b_vey', 4, 6, 'left');
    s.spawn('hesk_l', 'c4b_hesk', 3, 6, 'up');
    await s.wait(0.5);
    await s.narrate('Ilse works for an hour without speaking. Moss, sap, gall — ground, steeped, strained. The Lantern fills with a smell like a boot that drowned and came back angry.');
    await s.say('Pip', 'Smells like a boot.');
    await s.say('Corvin', 'Like a boot that drowned.');
    await s.say('Ilse', 'Thank you both. Hold her head, Doctor.');
    await s.move(P.ilse, [[9, 6], [5, 5], [3, 5]], 2.6);
    s.face(P.ilse, 'up');
    for (const id of ['c4b_lanternmoss', 'c4b_weepcap', 'c4b_rot_gall']) await s.take(id);
    await s.narrate('Ilse tips the draught between the old woman\'s lips, a spoonful at a time. Nobody breathes.');
    await s.wait(1.2);
    await s.narrate('Under Osk\'s skin, the black veins tremble — and begin, very slowly, to fade.');
    s.sfx('heal');
    s.flash('#d8ffe0', 0.6);
    await s.wait(0.6);
    s.music('swamp');
    await s.say('Mother Osk', '...Who in the name of every frog in the fen fed me a _boot_?');
    await s.hop('hesk_l');
    await s.say('Hesk', 'Mother Osk!');
    await s.say('Mother Osk', 'Hesk. You look terrible. Have you been making soup again? I can smell it from here.');
    await s.say('Hesk', 'Every day.');
    await s.say('Mother Osk', 'Daft heron.');
    await s.wait(0.5);
    await s.say('Mother Osk', 'You. Girl. You did this.');
    await s.say('Ilse', 'With help.');
    await s.say('Mother Osk', 'Your hands didn\'t shake.');
    await s.say('Ilse', 'They did. You just couldn\'t see.');
    await s.say('Mother Osk', 'That\'s the whole trick of it, girl.');
    await s.move(P.wren, [[4, 7]], 2.4);
    s.face(P.wren, 'up');
    await s.say('Mother Osk', 'And you\'re Ysolde\'s. I thought I dreamed you.');
    await s.say('Wren', 'You called me by her name.');
    await s.say('Mother Osk', 'I\'ve known your mother since she was smaller than that scruffy one.');
    await s.say('Pip', 'Hey.');
    await s.say('Mother Osk', 'Came to every Keepers\' Conclave with her nose in a book. Just like you, I expect.');
    await s.wait(0.8);
    await s.narrate('Osk turns her head toward the brass cradle at the heart of the room. It is empty. She looks at it for a long time.');
    await s.say('Mother Osk', 'Hesk. Where\'s my stone.');
    await s.wait(1.0);
    await s.say('Hesk', 'They took it.');
    await s.say('Hesk', 'The Choir. The night your fever broke out. They had the Hierophant\'s seal. They said the Gloam was rising, that the stone was safer in the Cathedral, that they\'d harmonize it and bring it home—');
    await s.say('Hesk', 'And you were saying "take it, take it, it\'s too heavy"—');
    await s.say('Mother Osk', 'I was talking about the _blanket_, you great soggy heron.');
    await s.wait(0.8);
    await s.say('Mother Osk', '...It\'s not your fault, boy. I\'d told him no twice. To his face.');
    await s.say('Mother Osk', 'They didn\'t come for safekeeping. They came because I was too sick to say it a third time.');
    await s.say('Wren', 'Told _who_ no?');
    s.music('cassian');
    await s.say('Mother Osk', 'Cassian.');
    await s.say('Mother Osk', 'He wanted my stone. Said he needed all seven for something. A "harmony," he called it. He sent me one of those last spring.');
    await s.narrate('Her eyes have gone to Wren\'s pack. Wren takes out the case of forks.');
    await s.say('Mother Osk', 'Put that away. I can hear it from here.');
    await s.say('Mother Osk', 'I threw mine in the bog. Then the rot came up out of the bog. Make of that what you like.');
    await s.say('Sable', 'It sings to the others. All the forks, everywhere. They are waiting for something.');
    await s.wait(0.8);
    await s.say('Mother Osk', '...Well. Aren\'t you a strange one. Come here, child. Let me see your face.');
    await s.move(P.sable, [[5, 6]], 2);
    s.face(P.sable, 'left');
    await s.wait(1.2);
    await s.say('Mother Osk', '_(very quietly)_ Oh, Cassian. What have you done.', { speed: 0.6 });
    await s.say('Sable', 'Do you know who I am?');
    await s.say('Mother Osk', 'I know who you look like. That isn\'t the same thing.');
    await s.say('Mother Osk', 'And it isn\'t my story to tell. I wasn\'t there.');
    await s.say('Mother Osk', 'Go to Elowen. In Verdance, at the heart of the Thornwood. She\'s older than dirt and twice as honest — and she was in Aurenne the night the city went dark.');
    await s.say('Ilse', 'The night the city went — what?');
    await s.say('Mother Osk', 'Ask Elowen.');
    await s.say('Mother Osk', 'And tell her Osk says she still owes me a goose.');
    await s.wait(0.6);
    await s.say('Mother Osk', 'Now. Mender. There are twenty-three people in my Rot House with black in their veins.');
    await s.say('Ilse', 'Twenty-four. I counted.');
    await s.say('Mother Osk', 'Then what are you standing here for?');
    await s.fadeOut(1.2);
    await s.narrate([
      'Ilse doesn\'t sleep that night. Neither does Doctor Vey.',
      'By dawn there is a draught beside every bed in the Rot House, and Vey has the recipe written on the inside of his sleeve.',
    ]);
    s.place(P.ilse, 3, 5, 'up');
    s.place(P.wren, 5, 6, 'left');
    s.place(P.sable, 7, 8, 'up');
    s.remove('vey_l');
    s.place('hesk_l', 9, 6, 'left');
    await s.fadeIn(1.0);
    await s.say('Mother Osk', 'Mirefen will need a Mender when I\'m gone, you know. A proper one.');
    await s.say('Ilse', 'I\'m not—');
    await s.say('Mother Osk', 'Don\'t tell me what you\'re not. Tell me what you want.');
    await s.wait(1.2);
    await s.say('Ilse', 'I want to go to the Collegium in Aurenne. To study. Properly.');
    await s.say('Ilse', 'Not out of Nana\'s book. Not because I happen to be the one standing there.');
    s.face(P.wren, P.ilse);
    await s.say('Wren', '...You never told me that.');
    await s.say('Ilse', 'You never asked.');
    await s.wait(0.6);
    await s.say('Wren', 'I— ...No. I didn\'t.');
    await s.say('Mother Osk', 'Then want it out loud, girl. Wanting quietly never got anybody anything.');
    await s.say('Mother Osk', 'Here. For your rounds. Reed and silver wire — keeps the fen-fevers off. Mostly.');
    await s.give('c4b_mire_charm');
    s.remove('hesk_l');
    unstage(s, P, [7, 9, 'down']);
    s.objective('Find Elowen, the oldest Keeper, at the heart of the Thornwood in Verdance. (Leave Mirefen by the north path.)');
    s.journal('Mother Osk is alive. The Choir took her Dawnstone while she was too sick to stop them — Cassian\'s people. She looked at Sable and said, "Oh, Cassian. What have you done." Ilse wants to go to the Collegium. She never told me. I never asked.');
  },
};

