// CHAPTER 9 — "The Halcyon"
// Corvin's Roost: a grounded airship, a captain drowning his guilt, a smuggler
// queen who wants her money, and three broken parts. The adult who never grew
// up learns to stay. The Halcyon flies; the party learns where Sable is.

import { EQUIPMENT } from '../data/equipment.js';

/** Equip better gear on a rejoining character if what they carry is weaker. */
export function kitOut(s, id, kit) {
  const ch = s.state.characters[id];
  if (!ch) return;
  for (const [slot, item] of Object.entries(kit)) {
    const cur = EQUIPMENT[ch.equipment[slot]];
    if (!cur || (cur.tier || 0) < (EQUIPMENT[item]?.tier || 0)) ch.equipment[slot] = item;
  }
  ch.fullHeal();
}

/** Spawn the walking party around a point so scenes can talk to faces. */
function crowd(s, spots) {
  const looks = { ilse: 'ilse_ruin', bram: 'bram_ruin', pip: 'pip_ruin', corvin: 'corvin' };
  for (const [id, [x, y, dir]] of Object.entries(spots)) {
    if (id === 'corvin' && !s.state.party.includes('corvin')) continue;
    s.spawn(`${id}_c9`, looks[id], x, y, dir);
  }
}
function uncrowd(s) { for (const id of ['ilse', 'bram', 'pip', 'corvin']) s.remove(`${id}_c9`); }

export const CH9 = {
  // ------------------------------------------------------------------ arrival
  async arrival(s) {
    if (s.flag('c9_arrived')) return;
    s.setFlag('c9_arrived');
    s.music('ruin');
    crowd(s, { ilse: [9, 21, 'up'], bram: [11, 21, 'up'], pip: [10, 22, 'up'] });
    await s.wait(0.6);
    await s.narrate([
      'Corvin\'s Roost. A crack in a fallen mountain, too narrow for the wind to find and too ugly for the Choir to bother with.',
      'Kite-lines hum between the canyon walls. Somebody, somewhere, is frying something that used to be a bird.',
    ]);
    await s.say('Pip', 'For the record? I said this was stupid.');
    await s.say('Ilse', 'Noted. On the kite, off the kite, and twice in the middle when you thought we were going to die.');
    await s.say('Pip', 'We *were* going to die.');
    await s.say('Bram', 'The man saved our lives in the desert. Several times. Mostly by accident, but a save is a save.');
    await s.say('Pip', 'He saved his *ship*. We happened to be standing on it.');
    s.face('player', 'down');
    await s.say('Wren', 'Everything left in the world is floating, Pip. We need wings. Corvin\'s the only captain we know.');
    await s.say('Pip', '...Knew.');
    await s.emote('pip_c9', '…');
    await s.think('Wren', 'A year ago Pip followed Corvin around the Halcyon like a gull after a fishing boat. Now he won\'t say his name.');
    s.face('player', 'up');
    await s.pan(22, 7, 1.6);
    await s.narrate('At the head of the canyon, half-buried in ash, lies a ship. Her masts are snapped. Her lift-sail hangs in rags. On her bow, in chipped gold paint: HALCYON.');
    await s.say('Bram', 'Oh. Oh, no. Look at her.');
    await s.say('Wren', 'That\'s not wings. That\'s a grave.');
    await s.follow(1.0);
    await s.say('Ilse', 'Three things. One: find Corvin. Two: find out if that can fly. Three: nobody punches anybody until we\'ve done one and two.');
    s.face('ilse_c9', 'pip_c9');
    await s.say('Pip', 'Why are you looking at me?');
    uncrowd(s);
    s.objective('Find Corvin. Someone in the Roost will know where he drinks.');
    s.journal('Corvin\'s Roost. The Halcyon is here, broken in the ash. Pip didn\'t want to come. I think he wanted to come more than any of us.');
  },

  // ------------------------------------------------------------------ the Last Call
  async lastCall(s) {
    if (!s.flag('c9_arrived') || s.flag('c9_met_corvin')) return;
    s.setFlag('c9_met_corvin');
    s.music('sad');
    crowd(s, { ilse: [5, 7, 'up'], bram: [9, 7, 'up'], pip: [7, 7, 'up'] });
    s.place('corvin', 8, 4, 'up');
    await s.move('player', [[6, 6], [8, 6]]);
    s.face('player', 'up');
    await s.say('Corvin', 'Bar\'s closed.', { portrait: false });
    await s.say('Tuck', 'Bar\'s open.');
    await s.say('Corvin', 'Bar\'s closed to people who want something. You can tell by the shoes. Hopeful shoes.', { portrait: false });
    await s.say('Wren', 'Corvin.');
    await s.wait(1.2);
    s.face('corvin', 'down');
    await s.wait(0.6);
    await s.say('Corvin', '...Huh.');
    await s.say('Corvin', 'Sparrow.');
    s.face('corvin', 'ilse_c9');
    await s.say('Corvin', 'Doc.');
    s.face('corvin', 'bram_c9');
    await s.say('Corvin', 'Tin-can.');
    await s.say('Bram', 'It\'s *Sir* Tin— no. No, it isn\'t. Carry on.');
    s.face('corvin', 'pip_c9');
    await s.say('Corvin', 'Hey, kid.');
    await s.say('Pip', 'Don\'t.');
    await s.say('Corvin', 'You got taller.');
    await s.say('Pip', 'You got *drunker*.');
    await s.say('Corvin', 'That\'s fair. That\'s very fair. I worked hard at it.');
    await s.say('Ilse', 'Three things. One: we need your ship. Two: you\'re going to stop drinking. Three: I wasn\'t asking.');
    await s.say('Corvin', 'Doc, I missed you. Nobody else in this canyon makes lists at me.');
    await s.say('Corvin', 'Halcyon\'s dead. Broke her back coming down into this crack the day the sky did. She\'s a very expensive place for spiders to live now.');
    await s.say('Bram', 'Then we fix her.');
    await s.say('Corvin', 'With what? Good intentions? Odessa doesn\'t take those. I\'ve tried.');
    await s.say('Wren', 'Who\'s Odessa?');
    s.sfx('door');
    s.shake(0.15, 0.4);
    await s.say('???', 'CORVIN ASHE!', { portrait: false });
    await s.say('Corvin', '...That\'s Odessa. Well. That\'s Odessa\'s mail.');
    s.spawn('crane', 'c9_bailiff', 5, 9, 'up');
    s.spawn('pike', 'c9_bailiff', 7, 9, 'up');
    await s.move('crane', [[5, 8]]);
    s.face('player', 'down');
    await s.say('Bailiff Crane', 'By order of the Ledger, your marker has come due. The Ledger Queen sends her regards, and two large men.');
    await s.say('Bailiff Pike', 'Also a dog.');
    await s.say('Corvin', 'Fellas. Kids. Kids, fellas. I\'m going to finish my drink.');
    await s.say('Bailiff Crane', 'And the children?');
    await s.say('Wren', '*The children* are standing right here.');
    const r = await s.battle('c9_bailiffs', { bg: 'town' });
    if (r === 'lose') return;
    s.remove('crane'); s.remove('pike');
    s.spawn('odessa_b', 'odessa', 6, 9, 'up');
    await s.move('odessa_b', [[6, 8]], 1.4);
    s.music('tension');
    await s.say('Odessa', 'Well. That was a great deal of my furniture.');
    await s.say('Corvin', 'Odessa. You look expensive.');
    await s.say('Odessa', 'I *am* expensive, darling. That\'s rather the point of me.');
    await s.say('Odessa', 'Odessa Quill. I keep the Ledger. Every crate in the Roost is written in it — every bed, every debt, every drink this man has poured into himself since the sky fell.');
    await s.say('Odessa', 'Fifty-one thousand, four hundred gold. Plus interest on his charm, which I stopped extending last spring.');
    await s.say('Corvin', 'Put it on my tab.');
    await s.say('Odessa', 'You *are* the tab, darling.');
    await s.say('Odessa', 'At the next Long Bell I take the Halcyon. Grounded, she\'s firewood. But firewood is worth something, in a world without a sun.');
    await s.say('Wren', 'Then we\'ll make her fly. And you\'ll get your money.');
    await s.wait(0.8);
    s.face('odessa_b', 'player');
    await s.say('Odessa', '...Red hair. Lanternfall vowels. Halloway, isn\'t it? The Keeper\'s girl.');
    await s.emote('player', '…');
    await s.say('Odessa', 'There\'s a song about you. They sing it on the eastern shards. It isn\'t a nice one.');
    await s.say('Ilse', 'She\'s heard it.');
    await s.wait(0.6);
    await s.say('Odessa', '...Hm.');
    await s.say('Odessa', 'Fix the ship, little Keeper. If she flies before the Long Bell, we\'ll talk terms. If she doesn\'t, I\'ll sell her for kindling and him for parts.');
    await s.say('Corvin', 'Which parts?');
    await s.say('Odessa', 'The charming ones. It won\'t take long.');
    await s.move('odessa_b', [[6, 9]], 1.4);
    s.remove('odessa_b');
    s.music('sad');
    await s.say('Corvin', 'She likes you.');
    await s.say('Wren', 'That was *liking*?');
    await s.say('Corvin', 'She didn\'t charge you for the conversation.');
    s.face('corvin', 'up');
    await s.say('Corvin', 'Mags is up at the wreck. She\'ll tell you what\'s broken. Short version: everything. Long version: everything, slowly.');
    await s.say('Wren', 'Come with us.');
    await s.wait(1.0);
    await s.say('Corvin', 'Sparrow. Look at me. Look real close.');
    await s.say('Corvin', 'This is what\'s left. You don\'t want it on your ship.');
    await s.move('pip_c9', [[7, 5]], 3);
    s.sfx('steal');
    await s.move('pip_c9', [[7, 8]], 3);
    await s.wait(0.5);
    await s.say('Corvin', '...Hey—');
    await s.say('Corvin', '_(quietly)_ Kid\'s still got fast hands.');
    uncrowd(s);
    s.objective('Talk to Mags, the Halcyon\'s engineer, aboard the grounded ship at the head of the canyon.');
    s.journal('Corvin\'s alive. He drinks at a bar called the Last Call, which is the least subtle thing I\'ve ever seen. He owes a woman named Odessa more money than Lanternfall ever had.');
  },

  /** Outside the Last Call: Pip and the flask. */
  async pipFlask(s) {
    if (s.flag('c9_flask')) return;
    s.setFlag('c9_flask');
    crowd(s, { pip: [12, 18, 'left'], ilse: [11, 19, 'up'], bram: [13, 19, 'up'] });
    s.face('player', 'pip_c9');
    await s.narrate('Pip unscrews a dented silver flask. He holds it out over the ash, and pours, and does not look away.');
    await s.say('Wren', 'Pip—');
    await s.say('Pip', 'Don\'t.');
    await s.say('Bram', 'That was probably his last one.');
    await s.say('Pip', 'Good.');
    await s.wait(1.0);
    await s.say('Pip', 'He taught me to cheat at cards. On the deck, nights. Said a man should know how to lose on purpose, so he\'d know how to win when it counted.');
    await s.say('Pip', 'Then the sky broke and he flew *away*.');
    await s.say('Ilse', 'Pip.');
    await s.say('Pip', 'I\'m fine. I\'m twelve. I\'ve been fine for a year.');
    uncrowd(s);
    s.journal('Pip poured out Corvin\'s flask. He said he\'s been fine for a year. He said it the way people say it when they haven\'t.');
  },

  // ------------------------------------------------------------------ Mags
  async mags(s) {
    if (!s.flag('c9_met_corvin')) {
      await s.say('Mags', ['Stop right there. That plank\'ll hold you, but it won\'t enjoy it.', 'If you\'re looking for the Captain, try the bottom of a glass. The Last Call. Can\'t miss it; it\'s the building that smells like regret.']);
      return;
    }
    if (!s.flag('c9_met_mags')) return CH9.magsBriefing(s);
    if (s.flag('c9_part_heart')) return s.say('Mags', 'All three? Then what are you standing there for? Bring \'em to the plank and let me work.');
    if (s.flag('c9_part_sail')) return s.say('Mags', ['Coil and sail. Two out of three.', 'Last one\'s the heart, and the heart\'s in Odessa\'s pocket. Go and charm her. Or let the redhead do it — the Captain\'s charm is mortgaged.']);
    if (s.flag('c9_corvin_joined')) return s.say('Mags', ['Ruddock\'s barge will take you to the Benediction. West, at the Lip.', 'Bring me stormsilk. And bring *him* back. I\'ve only just got him up the plank.']);
    if (s.flag('c9_part_coil')) return s.say('Mags', 'Hold on to that coil. I\'m not bolting anything in until I\'ve got all three — she\'ll tear herself apart if she lifts half-healed.');
    return s.say('Mags', ['The lift\'s on the east wall. Key\'s in your pocket.', 'Something down there\'s been dragging the good scrap into a pile. Miners call it the Foreman.']);
  },

  async magsBriefing(s) {
    s.setFlag('c9_met_mags');
    await s.say('Mags', 'So you\'re the kids. He talks about you. When he\'s drunk enough, which is always, so: constantly.');
    await s.say('Wren', 'Can she fly?');
    await s.say('Mags', 'Can she— ha! Girl, she\'s the Halcyon. She was built to fly by people who hated the ground. She *wants* to fly. It\'s the parts that object.');
    await s.say('Mags', 'Here\'s the butcher\'s bill.');
    await s.say('Mags', 'One. Her lift-coil\'s slag — cracked clean through when we came down. There\'s a dozen wrecks in the Boneyard below the canyon. Sky fell, ships fell with it. Find me a coil that isn\'t cracked.');
    await s.say('Mags', 'Two. Her lift-sail\'s rags. I need stormsilk, and the only stormsilk this side of the abyss is on the *Benediction* — a Choir pilgrim galleon stuck in the Squall east of here. Been stuck a year. The lightning never stops.');
    await s.say('Mags', 'Three. Her heart. Sun-ember core, cracked the day the sun did. The only embers big enough are in the Cinderdeep. Odessa\'s mine. Odessa\'s embers. Odessa\'s terms.');
    await s.say('Bram', 'So: a graveyard, a haunted ship, and a mine owned by a woman who wants to sell our friend for parts.');
    await s.say('Mags', 'The *charming* parts? She told you that one. She\'s proud of that one.');
    await s.say('Mags', 'Start with the Boneyard. Lift\'s on the east wall. Here.');
    await s.give('c9_lift_key');
    await s.say('Mags', 'Something down there\'s been dragging the good scrap into a pile. The scrappers call it the Foreman. You\'ll know it when it steps on you.');
    await s.say('Wren', 'Why are you still here, Mags? If the ship\'s dead, and the captain\'s...');
    await s.say('Mags', 'Somebody has to be.');
    await s.wait(0.8);
    await s.say('Mags', 'He comes up here, you know. Nights. Never comes aboard. Just stands at the bottom of the plank like a dog that\'s been put out of the house.');
    await s.say('Mags', 'Go on. Bring me a coil.');
    s.setFlag('c9_boneyard_open');
    s.objective('Take the lift on the east wall down to the Boneyard. Find a lift-coil that isn\'t cracked.');
    s.journal('Mags needs three things: a lift-coil from the Boneyard, stormsilk from a wrecked galleon, and a sun-ember heart from Odessa\'s mine. A graveyard, a ghost ship and a debt.');
  },

  // ------------------------------------------------------------------ the Boneyard
  async boneyardEntry(s) {
    await s.say('Bram', 'It\'s like a graveyard. For ships.');
    await s.say('Pip', 'It\'s called the *Boneyard*, Bram.');
    await s.say('Bram', 'And they named it *well*.');
    await s.say('Ilse', 'Stay together. Anything that moves down here is either hungry or sharp.');
    await s.say('Pip', 'Or both. It\'s usually both.');
  },

  /** The two crane winches open the gate to the Foreman's yard. */
  async winch(s, which) {
    const key = `c9_winch_${which}`;
    if (s.flag(key)) return s.narrate('The winch is thrown. Its chain hangs slack and ticking.');
    await s.narrate('A rusted crane winch, still chained to a magnet crane that hangs out over the yard like a fishing rod.');
    if (!(await s.confirm('Throw the winch?'))) return;
    s.setFlag(key);
    s.sfx('rumble');
    s.shake(0.3, 1.0);
    await s.wait(0.8);
    if (which === 'se') {
      s.clearBlocker('heap');
      await s.narrate('The crane swings. Its magnet drags a heap of wreckage aside with a scream of metal — there is a way back toward the lift now.');
    } else {
      await s.narrate('Somewhere to the north, a magnet crane groans and swings into place.');
    }
    if (s.flag('c9_winch_nw') && s.flag('c9_winch_se')) {
      s.clearBlocker('gate');
      await s.narrate('With both cranes pulling, the wall of fused hulls to the north tears itself open. Something beyond it stops moving, and listens.');
      s.objective('The way to the Foreman\'s yard (north) is open.');
    } else {
      await s.narrate('Not enough. The northern gate is still held shut — there must be another winch.');
    }
  },

  async foreman(s) {
    if (s.flag('c9_part_coil')) return;
    s.stopMusic(0.5);
    await s.pan(37, 3, 1.4);
    await s.narrate('In the yard, wreckage moves. Hull plates slide together with a sound like teeth. A ship\'s furnace swings up into the place where a heart should be — and lights.');
    await s.say('Pip', 'It\'s building something.');
    await s.say('Ilse', 'It\'s building *itself*.');
    await s.say('Bram', 'Can we fight it before it finishes? I\'d like to fight the unfinished version.');
    await s.follow(0.6);
    const r = await s.battle('c9_boss_foreman');
    if (r !== 'win') return;
    s.setFlag('c9_part_coil');
    await s.narrate('The Foreman comes apart like a sentence nobody finishes. In the cradle of its chest, wrapped in copper and still humming, sits a lift-coil. Whole.');
    await s.give('airship_part');
    await s.narrate('It is stamped GILDED GULL — SKYREACH YARDS.');
    await s.say('Wren', 'One.');
    await s.say('Pip', 'Don\'t count. It\'s bad luck to count.');
    await s.say('Bram', 'Is it?');
    await s.say('Pip', 'Corvin says it is.');
    await s.wait(0.6);
    await s.say('Pip', '_Said._');
    s.objective('Bring the lift-coil to Mags at the Halcyon.');
    s.journal('The thing in the Boneyard was made of fallen ships, with a furnace for a heart. It had a lift-coil in its chest. Now we do. One down.');
  },

  // ------------------------------------------------------------------ Corvin comes up the plank
  async corvinStays(s) {
    if (!s.flag('c9_part_coil') || s.flag('c9_corvin_joined')) return;
    s.setFlag('c9_corvin_joined');
    s.music('sad');
    s.spawn('corvin_r', 'corvin', 26, 14, 'up');
    crowd(s, { ilse: [23, 17, 'up'], bram: [25, 18, 'up'], pip: [24, 16, 'up'] });
    s.place('player', 25, 16, 'up');
    await s.pan(26, 12, 1.0);
    await s.wait(0.5);
    await s.say('Mags', 'Well, look who\'s at the bottom of my plank again. And look who\'s behind him.');
    s.face('corvin_r', 'down');
    await s.say('Corvin', 'Sparrow. You... came back.');
    await s.say('Wren', 'We came back.');
    await s.say('Corvin', 'People don\'t, much. From the Boneyard.');
    await s.move('pip_c9', [[25, 15]], 2.5);
    await s.say('Pip', 'People come back, Corvin. It\'s a thing they *do*. You should try it.');
    await s.wait(1.4);
    await s.say('Mags', 'Coil. Now. Before the pair of you start crying in my ash.');
    await s.narrate('Wren holds up the coil. Mags squints down at it from the deck.');
    await s.say('Mags', 'Gilded Gull. Skyreach yards. Good bones. She\'ll sing on that.');
    await s.say('Mags', 'Hold on to it. I\'m not bolting anything in till I\'ve got all three.');
    await s.say('Corvin', 'Next is the Benediction.');
    await s.say('Ilse', 'You know it?');
    await s.say('Corvin', 'I\'ve flown pilgrims. Choir pays in gold and hymns, and only one of those spends.');
    await s.say('Corvin', 'A galleon like that, broke open in a storm — she\'ll kill you in ways you won\'t find funny. Stairs that go nowhere. Holds full of things that used to pray.');
    await s.say('Ilse', 'Is that an offer?');
    await s.say('Corvin', 'It\'s a weather report.');
    await s.say('Wren', 'Corvin. Come with us.');
    await s.wait(1.6);
    await s.say('Corvin', 'I\'m coming for the *ship*, sparrow. Not for—');
    await s.say('Corvin', '—any of this. She\'s the only thing I own that doesn\'t owe somebody money.');
    await s.say('Ilse', '_(to Wren, quietly)_ That\'s almost word for word what I said to you. In the Ward.');
    await s.say('Wren', '_(quietly)_ I know. I\'m trying very hard not to smile.');
    await s.say('Mags', 'Captain. Catch.');
    await s.narrate('Something heavy sails down from the deck. Corvin catches it without looking: a long-barrelled hand-cannon, oiled, gleaming.');
    await s.say('Mags', 'Cleaned it every week. Didn\'t know who for.');
    await s.say('Corvin', 'Mags. You beautiful wrench.');
    await s.say('Pip', 'You\'re not staying.');
    s.face('corvin_r', 'pip_c9');
    await s.say('Corvin', 'I\'m here, ain\'t I?');
    await s.say('Pip', 'You were here before, too.');
    await s.emote('corvin_r', '…');
    s.remove('corvin_r');
    uncrowd(s);
    const corvin = s.state.addCharacter('corvin');
    corvin.setLevel(48);
    kitOut(s, 'corvin', { weapon: 'ashen_hand_cannon', body: 'ashen_coat', head: 'ashen_hood' });
    await s.join('corvin');
    await s.follow(0.6);
    s.setFlag('c9_benediction_open');
    s.objective('Ask Ruddock the ferryman (the Lip, west of town) to take you to the wreck of the Benediction.');
    s.journal('Corvin is coming. "For the ship," he says. Ilse made a face at me like she was remembering something. Pip didn\'t say anything. Then he said the worst possible thing, which was the truth.');
  },

  // ------------------------------------------------------------------ the Toll Barge
  async ruddock(s) {
    if (!s.flag('c9_met_corvin')) {
      return s.say('Ruddock', ['Toll Barge. Odessa\'s barge, Odessa\'s toll.', 'Goes where she says. Today she says nowhere.']);
    }
    const dests = [];
    if (s.flag('c9_cinderdeep_open') && !s.flag('c9_part_heart')) dests.push(['The Cinderdeep', 'c9_cinderdeep', 3, 37, 'up']);
    if (s.flag('c9_benediction_open')) dests.push(['Wreck of the Benediction', 'c9_benediction', 22, 39, 'up']);
    if (s.flag('c9_cinderdeep_open') && s.flag('c9_part_heart')) dests.push(['The Cinderdeep', 'c9_cinderdeep', 3, 37, 'up']);
    if (!dests.length) {
      return s.say('Ruddock', ['Nowhere to go but where she says.', 'Get the Captain up that plank first, then we\'ll talk about where. Odessa wants that ship flying. Says it\'s worth more alive.']);
    }
    if (!s.flag('c9_barge_toll')) {
      s.setFlag('c9_barge_toll');
      await s.say('Ruddock', 'Toll\'s two hundred a head.');
      await s.say('Corvin', 'Put it on my tab.');
      await s.say('Ruddock', '...She said you\'d say that.');
      await s.say('Ruddock', 'She said to say yes.');
      await s.say('Corvin', 'That woman frightens me in ways I\'ve never been frightened.');
    } else {
      await s.say('Ruddock', 'Where to?');
    }
    const i = await s.choice([...dests.map((d) => d[0]), 'Stay in the Roost'], { cancel: dests.length });
    if (i >= dests.length) return;
    const [, map, x, y, dir] = dests[i];
    await s.narrate('The Toll Barge drops off the Lip on a sigh of hot air and slides out across the dark.');
    await s.teleport(map, x, y, dir);
  },

  // ------------------------------------------------------------------ the Benediction
  async benedictionArrive(s) {
    if (s.flag('c9_bn_arrived')) return;
    s.setFlag('c9_bn_arrived');
    await s.wait(0.4);
    await s.narrate([
      'The Squall has not stopped for a year. Rain falls sideways, upward, every way but down.',
      'Pinned to the crag like a moth to a board, the galleon Benediction groans in the wind.',
      'Somewhere aboard, people are singing.',
    ]);
    await s.say('Bram', 'Please tell me that\'s the wind.');
    await s.say('Corvin', 'That\'s not the wind, tin-can.');
    await s.say('Corvin', 'Pilgrim hymn. "Rest Ye, Dawn-Bound." They\'d sing it on the approach to Aurenne.');
    await s.wait(0.6);
    await s.say('Corvin', 'They were flying in to hear the Vespersong. Best seats in the sky.');
    await s.emote('player', '…');
    await s.say('Ilse', 'There\'s a ward of light around the mainmast. It pulses when they sing.');
    await s.say('Corvin', 'Then we stop the singing. Galleons like her carry two hymn-censers: one on the forecastle, one in the chapel down in the hold.');
    await s.say('Corvin', 'And kid — the masts on these things are hollow. Something always nests in a hollow mast.');
    await s.say('Pip', 'Why would you tell me that.');
    s.objective('Silence the two hymn-censers — on the forecastle and in the spilled hold — to break the ward around the mainmast.');
    s.journal('The Benediction. A Choir pilgrim galleon, pinned in a storm that hasn\'t stopped for a year. The pilgrims are still singing. They were flying in to hear the Vespersong.');
  },

  async censer(s, which) {
    const key = `c9_censer_${which}`;
    if (s.flag(key)) return s.narrate('The censer is cold and shut. This part of the hymn is over.');
    await s.narrate('A brass censer, still smoking after a year. The hymn rises out of it like heat off a road.');
    if (!(await s.confirm('Close the censer?'))) return;
    await s.narrate('As your hand touches the lid, the singing stops. All of it. Then, behind you, every pilgrim on the deck turns its head at once.');
    const r = await s.battle(which === 'fore' ? 'c9_choir_fore' : 'c9_choir_hold');
    if (r !== 'win') return;
    s.setFlag(key);
    s.sfx('debuff');
    await s.narrate('You shut the censer. The smoke thins and stops. Half of the hymn goes with it.');
    if (s.flag('c9_censer_fore') && s.flag('c9_censer_hold')) {
      s.clearBlocker('ward');
      s.flash('#d8e8ff', 0.6);
      s.sfx('holy');
      await s.narrate('The ward around the mainmast cracks like a bell dropped on stone. High above, in the torn mainsail, something enormous unfolds.');
      s.objective('The ward is broken. Climb to the mainmast.');
    } else {
      await s.say('Corvin', 'One down. The other half\'s still going — hear it?');
    }
  },

  /** On the main deck: Corvin tells Wren where he was when the sea went up. */
  async deckTalk(s) {
    if (s.flag('c9_deck_talk') || !s.state.party.includes('corvin')) return;
    s.setFlag('c9_deck_talk');
    const p = s.actor('player');
    s.spawn('corvin_d', 'corvin', p.tileX + 1, p.tileY, 'left');
    s.face('player', 'right');
    await s.narrate('Along the rail, the pilgrims\' luggage is still strapped down. Name-tags. A child\'s mitten. A letter, folded small, the ink gone blue with rain.');
    await s.say('Wren', 'They came to watch. Because of what I did.');
    await s.say('Corvin', 'Because of what *he* did.');
    await s.say('Wren', 'I gave him the stone, Corvin. I climbed into the light and took it out with my own hands.');
    await s.wait(1.2);
    await s.say('Corvin', '...Yeah. And I had a ship.');
    await s.say('Wren', 'What?');
    await s.say('Corvin', 'When the sea went up, the Halcyon was in the air. Engines hot. Close enough to see the light on your mother\'s tower.');
    await s.say('Corvin', 'I could have come back for you. I did the arithmetic. And I turned her east.');
    await s.wait(1.4);
    await s.say('Corvin', 'Guilt\'s a bar tab, sparrow. You can drink on it forever, and it never gets any smaller.');
    await s.say('Wren', 'Or?');
    await s.say('Corvin', 'Or nothing. That\'s as far as I ever got.');
    await s.say('Corvin', 'Figured you might work out the rest. You were always the one reading.');
    s.remove('corvin_d');
    await s.think('Wren', 'Or you pay it down. One piece at a time. And you don\'t get to stop.');
    s.journal('Corvin told me he could have come back for us when the sea went up. He did the arithmetic and turned east. He says guilt is a bar tab. I think he wants me to tell him what comes after "or".');
  },

  async squallmaw(s) {
    if (s.flag('c9_part_sail')) return;
    s.stopMusic(0.5);
    await s.pan(23, 13, 1.2);
    await s.narrate('The torn mainsail is not a sail. It opens. It has eyes.');
    await s.say('Corvin', 'Squall drake. They nest in storms. This one\'s been nesting in a hymn.');
    await s.say('Pip', 'Is that bad?');
    await s.say('Corvin', 'It\'s been eating lightning for a year, kid. Everything\'s bad.');
    await s.follow(0.5);
    const r = await s.battle('c9_boss_squallmaw', { bg: 'deck' });
    if (r !== 'win') return;
    s.setFlag('c9_part_sail');
    s.music('sad');
    await s.narrate([
      'Squallmaw falls into the rigging and is still. The wind lets go of the ship.',
      'For the first time in a year, the rain falls _down_.',
      'Tangled in the mainmast hangs a lift-sail of grey stormsilk, scorched at one corner and otherwise whole.',
    ]);
    await s.give('airship_part');
    await s.narrate('And through a tear in the clouds — far to the north, on a shard brighter than anything left in the sky — stands a needle of white light.');
    await s.say('Corvin', 'That wasn\'t there last year.');
    await s.say('Ilse', 'It\'s standing on the biggest shard. Right where the sun broke.');
    await s.say('Wren', '...It looks like noon over there.');
    await s.say('Bram', 'It\'s not noon anywhere. It hasn\'t been noon for a year.');
    await s.say('Wren', 'I know.');
    s.objective('Take the stormsilk back to the Roost. Ruddock\'s barge waits at the south pier.');
    s.journal('We killed the storm drake. The rain fell down. Far away, on the biggest shard of the sun, there\'s a white tower that looks like noon. Two parts.');
  },

  async cabinLog(s) {
    await s.narrate([
      'The captain\'s log, swollen with rain. The last pages are legible.',
      '"Day of the Vespersong. Pilgrims in high spirits. The Hierophant will sing the sun to sleep tonight, and it will never set on us again. The Abbess asks if we may circle the Cathedral twice for the view."',
      '"Later. The sun is wrong. The sun is —"',
      'The rest is water.',
    ]);
  },

  // ------------------------------------------------------------------ Odessa's permit
  async odessa(s) {
    if (!s.flag('c9_part_sail')) {
      return s.say('Odessa', s.flag('c9_corvin_joined')
        ? ['You got him up the plank. I\'m almost impressed.', 'Don\'t let him near my bar on the way out. He has a tab, and the tab has a tab.']
        : ['The Long Bell is coming, little Keeper. Bells always do.', 'Do sit. Debtors stand on the carpet. Guests may sit. You\'ll know which you are by the end.']);
    }
    if (!s.flag('c9_permit')) return CH9.permit(s);
    if (s.flag('c9_q_miners_saved') && !s.flag('c9_q_miners_done')) return CH9.minersReward(s);
    if (!s.flag('c9_part_heart')) return s.say('Odessa', 'The Cinderdeep, darling. Ruddock knows the way. Try not to die on my property; it does terrible things to the price of land.');
    return s.say('Odessa', ['The Long Bell is close. I can feel it in my ledgers.', 'Go and finish your ship. I\'ll be along to see what it\'s worth.']);
  },

  async permit(s) {
    s.setFlag('c9_permit');
    crowd(s, { ilse: [4, 6, 'up'], bram: [8, 6, 'up'], pip: [5, 7, 'up'], corvin: [7, 7, 'up'] });
    s.place('player', 6, 5, 'up');
    await s.say('Odessa', 'The Keeper\'s girl and her keeper. Sit. Don\'t touch the ledgers; they bite.');
    await s.say('Odessa', 'You want into my mine. Everyone wants into my mine. It\'s the only warm place left in the world.');
    await s.say('Odessa', 'My miners stopped coming up two Bells ago. The ones who did talk about a worm made of light, coiled round the biggest ember we ever dug. It\'s eating my embers. And three of my debtors.');
    await s.say('Wren', 'We\'ll kill it.');
    await s.say('Odessa', 'I adore a girl who skips the negotiation.');
    await s.say('Odessa', 'Kill it, and take one heart-ember for your ship. Bring my three debtors out alive, and I shall be... grateful. I\'m told it\'s a pleasant feeling.');
    await s.give('c9_permit');
    s.quest('c9_q_miners', 'Down in the Deep', 'Odessa\'s three missing miners — Dagny, Hobb and Ines — are somewhere in the Cinderdeep. Bring them out alive.');
    await s.say('Odessa', 'Now. Children, out. I need a word with the Captain. Adult business.');
    await s.say('Pip', 'I\'m *twelve*.');
    await s.say('Odessa', 'Then you\'re very nearly a third of the way there.');
    await s.fadeOut(0.6);
    uncrowd(s);
    s.show('player', false);
    s.spawn('corvin_o', 'corvin', 6, 5, 'up');
    await s.fadeIn(0.6);
    s.music('tension');
    await s.wait(0.6);
    await s.say('Odessa', 'The Choir came calling, darling. A knight-captain in a white ship. Very polite. Very *armed*.');
    await s.say('Corvin', 'They want the sparrow.');
    await s.say('Odessa', 'They want the Keeper\'s daughter, alive and unbruised. The Hierophant misses her, apparently. They\'ll pay enough to clear your marker four times over.');
    await s.say('Corvin', 'And you said...');
    await s.say('Odessa', 'I said I\'d think about it. I\'m thinking about it, darling. Are you?');
    await s.wait(1.2);
    await s.say('Corvin', '...I\'m always thinking. It\'s the doing I\'m bad at.');
    await s.say('Odessa', 'Your little skiff\'s still fuelled, I notice. Moored at the Lip. Pointed at open sky.');
    await s.say('Odessa', 'You always keep a door open, Corvin. It\'s the most honest thing about you.');
    await s.wait(1.5);
    await s.say('Corvin', '...Is that all?');
    await s.say('Odessa', 'That\'s all. Mind the step on your way out. People trip on it. It\'s how I like them.');
    await s.fadeOut(0.8);
    s.remove('corvin_o');
    s.show('player', true);
    s.setFlag('c9_cinderdeep_open');
    s.setFlag('c9_after_permit');
    await s.teleport('corvins_roost', 33, 16, 'down');
  },

  /** Outside the Ledger House, right after Odessa's private word. */
  async afterPermit(s) {
    if (!s.flag('c9_after_permit')) return;
    s.setFlag('c9_after_permit', false);
    crowd(s, { pip: [32, 17, 'up'], corvin: [33, 17, 'left'], ilse: [31, 18, 'up'], bram: [35, 18, 'up'] });
    await s.wait(0.4);
    await s.say('Pip', 'What\'d she want?');
    await s.say('Corvin', 'To tell me I\'m handsome. She does it every Bell. It\'s in my contract.');
    await s.emote('pip_c9', '?');
    await s.say('Pip', 'You\'re lying. Your left hand does a thing when you\'re lying.');
    await s.say('Corvin', '...Who taught you that?');
    await s.say('Pip', 'You did.');
    uncrowd(s);
    s.objective('Ride the Toll Barge to the Cinderdeep. Find the heart-ember — and Odessa\'s three missing miners.');
    s.journal('Odessa gave us a permit for her mine. Then she sent us out and kept Corvin. He came out smiling. Pip didn\'t believe the smile. Neither did I.');
  },

  // ------------------------------------------------------------------ the Cinderdeep
  async cinderEntry(s) {
    await s.narrate('Heat rolls up the shaft like breath. Somewhere far below, something enormous breathes back.');
    await s.say('Bram', 'Why is it always *down*? Why is the worst thing never at the top of a nice hill?');
    await s.say('Corvin', 'Because people who build on hills charge rent.');
    await s.say('Ilse', 'Odessa\'s miners will be in the side-galleries if they\'re anywhere. Keep your eyes open.');
  },

  async valve(s, which) {
    const key = `c9_valve_${which}`;
    if (s.flag(key)) return s.narrate('The valve is open. Steam whistles through the pipes, thin and steady.');
    await s.narrate('A steam valve, its wheel crusted with slag. The pipe runs off into the dark toward the deep galleries.');
    if (!(await s.confirm('Open the valve?'))) return;
    s.setFlag(key);
    s.sfx('wind');
    s.shake(0.25, 1.2);
    await s.wait(0.6);
    if (which === 'west') {
      s.clearBlocker('slag_a');
      await s.narrate('Steam screams through the pipes. Far to the east, a river of slag hisses, cools, and cracks into rubble.');
    } else {
      s.clearBlocker('slag_b');
      await s.narrate('Steam roars up a shaft to the north. Somewhere above, molten slag goes grey and breaks apart.');
    }
  },

  async miner(s, id) {
    const MINERS = {
      dagny: ['I owe Odessa six hundred gold for a bed I never slept in.', 'I\'ve been sleeping down here instead. It\'s very warm. That\'s the only good thing about it.', 'Out? Oh, gods. Yes. Yes please.'],
      hobb: ['Leg\'s gone bad. Fell when the worm came through. Been eating mushrooms and telling myself jokes.', 'They\'re terrible jokes. I\'ve heard them all.', 'You\'ll take me up? ...Then here. Found this when I fell. Never had a use for it.'],
      ines: ['My daughter\'s in the Roost. Nell. She\'s six. She\'ll think I left.', 'I didn\'t leave. I didn\'t. I just couldn\'t get *up*.', 'Thank you. Thank you. I\'ll tell her — I\'ll tell her someone came.'],
    };
    const key = `c9_miner_${id}`;
    if (s.flag(key)) return;
    s.setFlag(key);
    const name = { dagny: 'Dagny', hobb: 'Hobb', ines: 'Ines' }[id];
    await s.say(name, MINERS[id]);
    if (id === 'hobb') await s.give('vigor_seed');
    await s.narrate(`${name} limps off toward the mine head, following the rails up toward the cold.`);
    s.remove(`miner_${id}`);
    const saved = ['dagny', 'hobb', 'ines'].filter((m) => s.flag(`c9_miner_${m}`)).length;
    if (saved === 3) {
      s.setFlag('c9_q_miners_saved');
      await s.system('All three miners are on their way out. Tell Odessa.');
    } else {
      await s.system(`Miners found: ${saved} of 3.`);
    }
  },

  async minersReward(s) {
    s.setFlag('c9_q_miners_done');
    await s.say('Odessa', 'Dagny. Hobb. Ines. All three, walking into my Roost on their own legs, smelling of brimstone and gratitude.');
    await s.say('Odessa', 'I said I\'d be grateful. Here is the strange part: I am. Name your price, little Keeper.');
    const i = await s.choice(['Forgive their debts.', 'Five thousand gold.']);
    if (i === 0) {
      await s.say('Odessa', '...Their debts.');
      await s.say('Odessa', 'You walked out of my mine with a fortune in your pocket, and you spend it on three people who can\'t even thank you properly.');
      await s.narrate('Odessa takes three pages out of the Ledger. She looks at them for a long moment. Then she feeds them, one by one, to the lamp.');
      await s.say('Odessa', 'Don\'t tell anyone. I have a reputation.');
      await s.say('Odessa', 'Ines asked me to give you this. Her girl made it. It\'s hideous. I\'m told it\'s lucky.');
      await s.give('crest_tome');
      await s.give('megalixir');
    } else {
      await s.say('Odessa', 'Gold. Sensible. I could almost love you.');
      await s.gold(5000);
    }
    s.quest('c9_q_miners', null, null, 'done');
  },

  async sunworm(s) {
    if (s.flag('c9_part_heart')) return;
    s.stopMusic(0.5);
    await s.pan(18, 4, 1.4);
    await s.narrate('The chamber is bright as noon. At its center lies a well of molten light — and coiled around it, drinking, a worm the length of a street, its scales like stained glass with the sun behind them.');
    await s.say('Corvin', 'Well. That\'s the biggest ember I ever saw.');
    await s.say('Pip', 'It\'s *eating* it.');
    await s.say('Ilse', 'It\'s eating the sun.');
    await s.say('Wren', 'Then it can learn to share.');
    await s.follow(0.5);
    const r = await s.battle('c9_boss_sunworm', { bg: 'cave' });
    if (r !== 'win') return;
    s.setFlag('c9_part_heart');
    s.music('cave');
    await s.narrate('The Sunworm uncoils, slow as a sunset, and goes dark. The well of light settles. At its bottom, cooling from white to gold, sits an ember the size of a heart.');
    await s.give('airship_part');
    await s.say('Corvin', 'Mags is gonna cry.');
    await s.say('Bram', 'I might cry.');
    await s.say('Corvin', 'You cry at bread, tin-can.');
    await s.say('Bram', 'Bread is *moving*.');
    await s.wait(0.6);
    await s.say('Bram', '...Sable used to say that. About bread. That it was warm, and she didn\'t know food could be warm.');
    await s.wait(1.0);
    await s.say('Wren', 'She still says it. Somewhere. She has to.');
    s.objective('Take the heart-ember back to the Halcyon. Mags is waiting.');
    s.journal('Three parts. The heart is gold and still warm. Bram said Sable\'s line about bread, and nobody could say anything for a while.');
  },

  // ------------------------------------------------------------------ the Long Bell
  async longBell(s) {
    if (!s.flag('c9_part_heart') || s.flag('c9_long_bell') || !s.has('airship_part', 3)) return;
    s.setFlag('c9_long_bell');
    s.stopMusic(0.6);
    crowd(s, { ilse: [24, 17, 'up'], bram: [28, 17, 'up'], pip: [25, 16, 'up'], corvin: [27, 15, 'up'] });
    s.place('player', 26, 16, 'up');
    await s.pan(26, 12, 1.0);
    await s.say('Mags', 'Coil. Sail. Heart.');
    await s.take('airship_part', 3);
    await s.narrate('Mags takes the three parts up the plank as tenderly as if they were newborns.');
    await s.say('Mags', 'Give me the time it takes to swear properly, and she\'ll fly.');
    await s.fadeOut(0.8);
    await s.narrate('Mags swears properly. It takes about an hour. Some of it is in languages that no longer have countries.');
    await s.fadeIn(0.8);
    s.sfx('holy');
    await s.narrate('Across the Roost, the Long Bell tolls. There is no sun to mark the days anymore, so the Roost rings a bell and agrees to believe it.');
    s.spawn('odessa_l', 'odessa', 24, 23, 'up');
    s.spawn('bail1', 'c9_bailiff', 23, 24, 'up');
    s.spawn('bail2', 'c9_bailiff', 26, 24, 'up');
    await s.move('odessa_l', [[24, 19]], 1.6);
    s.face('player', 'down');
    s.face('corvin_c9', 'down');
    s.music('tension');
    await s.say('Odessa', 'The Long Bell, darling. I\'ve come for my ship.');
    await s.say('Mags', 'Your ship\'s about to leave, Quill.');
    await s.say('Odessa', 'Then I\'m just in time.');
    s.shake(0.45, 2.2);
    s.flash('#ffffff', 0.5);
    await s.wait(1.0);
    await s.narrate('A shadow falls across the canyon. Something white and enormous blots out the bruised sky — a warship, its hull painted with the Choir\'s golden sunburst, lowering itself between the canyon walls on singing engines.');
    await s.say('Bram', 'That\'s the *Steadfast*. They used to show it to the squires. To make us proud.');
    s.spawn('sev', 'severine', 23, 11, 'down');
    s.spawn('mar1', 'c9_sky_marine', 21, 12, 'down');
    s.spawn('mar2', 'c9_sky_marine', 25, 12, 'down');
    s.face('player', 'up');
    s.face('corvin_c9', 'up');
    await s.move('sev', [[23, 13]], 2);
    await s.say('Severine', 'By order of the Hierophant: Wren Halloway, the Keeper\'s daughter. Unharmed.');
    await s.say('Severine', 'The rest of you are... optional.');
    s.face('sev', 'corvin_c9');
    await s.say('Severine', 'Ashe. Corvin Ashe. They still teach you at the academy, you know. In the lecture on desertion.');
    await s.say('Corvin', 'Sev. You got old.');
    await s.say('Severine', 'You got *drunk*.');
    s.face('sev', 'bram_c9');
    await s.say('Severine', 'And Kestrel. The squire who froze. Aldous Venn died so you could run away — and here you are, running with a deserter. How fitting.');
    await s.say('Bram', '...I\'m not running, Captain.');
    await s.say('Severine', 'We\'ll see.');
    await s.move('odessa_l', [[26, 17]], 1.6);
    s.face('odessa_l', 'corvin_c9');
    await s.say('Odessa', '_(quietly)_ Your skiff\'s at the Lip, darling. Fuelled. Pointed at open sky.');
    await s.say('Odessa', '_(quietly)_ Go now, and I\'ll burn your marker myself. Nobody would blame you. Nobody ever expected anything else.');
    await s.pan(3, 22, 1.6);
    await s.narrate('At the canyon\'s lip, Corvin\'s skiff rocks on its mooring line. Small. Fast. Pointed at nothing at all.');
    await s.wait(0.8);
    await s.pan(26, 14, 1.4);
    s.face('corvin_c9', 'left');
    await s.wait(1.4);
    s.face('corvin_c9', 'pip_c9');
    await s.say('Pip', '...Go on, then.');
    await s.say('Pip', '_(quietly)_ You\'re good at it.');
    await s.wait(1.4);
    await s.say('Corvin', 'Yeah.');
    await s.say('Corvin', 'I am.');
    await s.wait(0.8);
    s.face('corvin_c9', 'left');
    s.sfx('gun');
    s.flash('#ffe0a0', 0.3);
    await s.narrate('Corvin draws, turns, and fires — once — down the whole length of the canyon.');
    await s.pan(3, 22, 1.0);
    s.clearBlocker('skiff');
    await s.narrate('At the Lip, the skiff\'s mooring line parts. The little boat tips, slides, and drops into the dark without a sound.');
    await s.pan(26, 14, 1.0);
    s.face('corvin_c9', 'up');
    await s.say('Corvin', 'Huh.');
    await s.say('Corvin', 'Always wondered what that would feel like.');
    await s.say('Pip', '...How\'s it feel?');
    await s.say('Corvin', 'Terrible. Get behind me, kid.');
    s.flash('#f0f0ff', 0.5);
    await s.system('Something in Corvin\'s Crest turns over, like a card laid face-up on the table.');
    await s.learnCrest('gambler');
    await s.say('Corvin', 'Sev. Let\'s play a hand. You win, you get the sparrow. I win, you go home and tell the Hierophant Corvin Ashe says hello.');
    await s.say('Severine', 'I don\'t gamble, deserter.');
    await s.say('Corvin', 'Everybody gambles, Sev. Only some of us admit it.');
    await s.say('Severine', 'Marines. Take the girl.');
    const r = await s.battle('c9_boss_severine', { bg: 'ruin' });
    if (r !== 'win') return;
    s.music('sad');
    s.remove('mar1'); s.remove('mar2');
    await s.say('Severine', 'This isn\'t... over, Ashe.');
    await s.say('Corvin', 'Nothing ever is, Sev. That\'s the trouble with things.');
    await s.say('Severine', 'Steadfast! Lift!');
    await s.move('sev', [[23, 11]], 3);
    s.remove('sev');
    s.shake(0.35, 1.6);
    await s.narrate('The warship\'s engines scream. It claws its way up out of the canyon, scraping stone, and is gone. A sealed letter flutters down where the Knight-Captain stood.');
    await s.say('Ilse', 'Her orders. That\'s not the Hierophant\'s seal...');
    await s.say('Ilse', '"Bring the Keeper\'s daughter to the Noon Spire, unharmed. The vessel grows restless, and asks for her by name. — M."');
    await s.say('Bram', '"M." Mercy.');
    await s.say('Wren', 'The vessel...');
    await s.hop('pip_c9');
    await s.say('Pip', 'Sable. That\'s *Sable*. She\'s alive!');
    await s.say('Wren', '...And she\'s asking for me.');
    await s.say('Odessa', 'The Noon Spire. It stands on the greatest shard, where the sun broke. The Choir ferries supplies in every Bell. Everyone who goes in comes out smiling.');
    await s.say('Odessa', 'That\'s what frightens me.');
    await s.say('Corvin', 'You sold us out, Quill.');
    await s.say('Odessa', 'I never told the Choir a thing, darling. Severine found you all on her own; she\'s very thorough.');
    await s.say('Odessa', 'I only wanted to see what you\'d do with an open door.');
    await s.narrate('Odessa opens her ledger to a page near the back, worn soft with handling. She tears it out.');
    await s.say('Odessa', 'Fifty-one thousand, four hundred gold. Paid in full.');
    await s.say('Corvin', 'Paid with what?');
    await s.say('Odessa', 'With the look on your face when that skiff went over. I\'ve held your marker nine years, waiting to see it.');
    await s.say('Odessa', 'Don\'t make me regret the investment. Regret is terrible for business.');
    await s.say('Corvin', '...You\'re a terrible woman.');
    await s.say('Odessa', 'I\'m a *banker*.');
    await s.move('odessa_l', [[24, 23]], 1.6);
    ['odessa_l', 'bail1', 'bail2'].forEach((id) => s.remove(id));
    await s.say('Mags', 'CAPTAIN! Are we flying, or are we *chatting*?');
    s.face('corvin_c9', 'up');
    await s.say('Corvin', 'Mags.');
    await s.say('Corvin', 'Take her up.');
    uncrowd(s);
    await s.fadeOut(1.4);
    await s.teleport('c9_halcyon_flight', 20, 8, 'right');
  },

  // ------------------------------------------------------------------ the Halcyon flies
  async maidenFlight(s) {
    if (s.flag('c9_done')) return;
    s.setFlag('c9_done');
    s.music('afterlight');
    s.spawn('corvin_f', 'corvin', 10, 8, 'left');
    s.spawn('mags_f', 'mags', 11, 10, 'up');
    crowd(s, { ilse: [18, 9, 'up'], bram: [16, 7, 'right'], pip: [14, 9, 'left'] });
    await s.wait(0.8);
    await s.narrate([
      'The Halcyon rises out of Corvin\'s Roost like a held breath let go.',
      'Below, the canyon shrinks to a crack, then a line, then nothing at all. Above, the bruised sky opens its arms.',
    ]);
    await s.say('Mags', 'Coil\'s singing. Sail\'s full. Heart\'s burning hot as a scandal.');
    await s.say('Mags', 'She\'s flying, Captain.');
    await s.say('Corvin', '_(quietly)_ She\'s flying.');
    await s.wait(1.0);
    await s.say('Corvin', 'Kid. C\'mere.');
    await s.move('pip_c9', [[11, 9], [11, 8]], 2.2);
    s.face('pip_c9', 'left');
    await s.say('Corvin', 'Both hands. She doesn\'t like being held loose.');
    await s.say('Pip', 'Like this?');
    await s.say('Corvin', 'Like that. Feel her pull? She wants to go up. Everything does. You just let her, a little at a time.');
    await s.wait(1.2);
    await s.hop('pip_c9');
    await s.say('Pip', 'I\'M FLYING. I\'M FLYING THE—');
    await s.wait(0.6);
    await s.say('Pip', 'Ahem. I mean. It\'s fine. It\'s basically a boat.');
    await s.say('Bram', 'He\'s beaming. Look at him. He\'s *beaming*.');
    await s.say('Ilse', 'He\'s twelve.');
    await s.narrate('Wren laughs. It surprises her. It is the first time in a year.');
    await s.move('corvin_f', [[12, 9], [17, 9], [18, 8]], 2);
    s.face('corvin_f', 'right');
    await s.say('Corvin', 'Hey. Sparrow.');
    await s.say('Corvin', 'Found the "or".');
    s.face('player', 'left');
    await s.say('Wren', 'Yeah?');
    await s.say('Corvin', 'You pay it down. A bit at a time. And you don\'t get to stop.');
    await s.say('Wren', '...I know.');
    await s.say('Corvin', 'Figured you did. Took me nine years and a skiff.');
    await s.wait(0.6);
    s.face('player', 'right');
    await s.say('Wren', 'Mags. Set a course for the Noon Spire.');
    await s.say('Corvin', 'The sparrow\'s giving orders on my deck now?');
    s.face('player', 'left');
    await s.say('Wren', 'Captain?');
    await s.wait(0.8);
    await s.say('Corvin', '...You heard her, Mags.');
    await s.say('Mags', 'Course for the big shiny tower of certain death. Aye aye.');
    await s.say('Mags', 'And you, kid — if you\'re going to stand at my wheel, you\'ll want these.');
    await s.give('c9_mags_goggles');
    await s.say('Pip', 'They\'re too big.');
    await s.say('Mags', 'You\'ll grow.');
    s.journal('The Halcyon flies. Corvin let Pip take the wheel. I laughed — I\'d forgotten how. Sable is in the Noon Spire, and she\'s asking for me. We\'re coming.');
    await s.fadeOut(1.5);
    uncrowd(s);
    await s.chapter(10, 'Lysa');
    s.objective('Find Sable in the Noon Spire.');
    await s.teleport('noon_spire', 15, 40, 'up');
  },
};
