// CHAPTER 4 — "The Pilgrim Road" (first half, part two)
// The Greyspine: the pass and Bram's Vigil, Frosthollow and Brother Halvard, the fork
// tuned to the Dawnsong's reflection, Garrick's ambush, and the bell.

import { crew, dismiss, has } from './ch4a.js';

const PARTY = ['ilse', 'bram', 'sable', 'pip', 'corvin'];
const KIDS = ['ebba', 'tomas', 'linnea', 'lars', 'yrsa', 'oskar'];
const KID_NAMES = { tomas: 'Tomas', linnea: 'Linnea', lars: 'Lars', yrsa: 'Yrsa', oskar: 'Oskar' };

function spawnKids(s, spots, dir = 'down') {
  KIDS.forEach((k, i) => s.spawn(`kid_${k}`, `c4a_${k}`, spots[i][0], spots[i][1], dir));
}
const removeKids = (s) => KIDS.forEach((k) => s.remove(`kid_${k}`));

/** @type {import('../types/data').StoryScripts} */
export const C4M = {
  // =================================================================== Greyspine Pass
  async passArrival(s) {
    if (s.flag('c4a_pass_arrived')) return;
    s.setFlag('c4a_pass_arrived');
    s.music('snow');
    crew(s, [['ilse', 19, 56, 'up'], ['bram', 21, 56, 'up'], ['sable', 22, 55, 'up'], ['pip', 18, 55, 'up'], ['corvin', 20, 57, 'up']]);
    await s.fadeIn(1.2);
    await s.wait(0.4);
    if (has(s, 'pip')) {
      await s.say('Pip', 'Okay. Okay. I take it back. I take back every word I said about the desert. Come back, desert. I\'m _sorry_.');
    }
    if (has(s, 'sable')) {
      s.face('sable_c', 'up');
      await s.say('Sable', 'The sky is falling apart. Slowly. In pieces.');
      await s.say('Wren', 'It\'s snow, Sable.');
      await s.narrate('Sable holds out her hand. A snowflake lands on it, and is gone.');
      await s.say('Sable', 'It was here, and then it was water.');
      await s.wait(0.6);
      await s.say('Sable', 'I like it anyway.');
    }
    await s.say('Ilse', 'Bram? You\'ve gone quiet. You\'re never quiet.');
    await s.wait(0.8);
    await s.say('Bram', 'I\'ve been here before. My knighting trial — the Vigil. It\'s up there. On the pass.');
    await s.say('Bram', '...It\'s fine. It\'s just a mountain. Mountains can\'t hurt you. Except by falling on you. Which they do. Up here. Regularly.');
    dismiss(s, PARTY);
    s.objective('Climb the Greyspine Pass to Frosthollow monastery.');
    s.journal('Nine days north with Oyelaran\'s caravan, and then the snow. Sable likes it. Pip has threatened to fight it. Bram has been here before — this is where his knighting trial happened.');
  },

  /** The quiet ways: walk and the snow keeps still; run and it comes down. */
  async quietZone(s, back) {
    if (!s.flag('c4a_quiet_warned')) {
      s.setFlag('c4a_quiet_warned');
      await s.narrate('Above the trail, the snow hangs in a smooth white lip, heavy as a held breath. It creaks.');
      await s.say('Ilse', 'Nobody run. Nobody shout. Bram, that includes _humming_.');
      await s.say('Bram', 'I wasn\'t humming.');
      await s.say('Ilse', 'You were humming the Dawnguard march.');
      await s.say('Bram', '...Quietly.');
      await s.system('Tip — In the *Quiet Ways*, walk. Running shakes the snow loose.');
      return;
    }
    if ((s.actor('player')?.speed || 0) <= 5) return;
    s.sfx('quake');
    s.shake(0.45, 1.6);
    s.flash('#ffffff', 0.5);
    await s.narrate('A soft, enormous WHUMP — and the lip of snow above lets go.');
    for (const c of s.state.allMembers()) c.hp = Math.max(1, c.hp - Math.round(c.maxHp * 0.15));
    s.place('player', back[0], back[1], 'down');
    if (!s.flag('c4a_avalanche_ogre')) {
      s.setFlag('c4a_avalanche_ogre');
      await s.narrate('When you dig yourselves out, something else is digging itself out too — and it is very, very annoyed.');
      await s.battle('c4a_gp_avalanche', { bg: 'snow' });
      return;
    }
    await s.say('Ilse', s.flag('c4a_avalanche_twice') ? 'Walk. _Walk._' : 'What did I say. What did I _literally just say._');
    s.setFlag('c4a_avalanche_twice');
  },

  async lily(s, i) {
    s.setFlag(`c4a_lily_${i}`);
    await s.narrate('A frost lily, pale blue and perfectly still, growing straight out of the snow.');
    if (!s.flag('c4a_lily_explained')) {
      s.setFlag('c4a_lily_explained');
      await s.say('Ilse', 'Frost lilies! They only bloom above the snowline. Nana used them for fevers and frostbite salve. Take it by the root — gently.');
    }
    await s.give('frost_lily');
  },

  async frozenPack(s) {
    await s.narrate(['Half-buried in a drift: a pilgrim\'s pack, a walking staff, a tin cup frozen solid.', 'Inside the pack, a letter. "Dear Ma — the Keeper at the top says the pass will be clear by spring. I\'ll be home for the Kindling. Save me some honey cake."', 'The letter is dated four winters ago.']);
    if (has(s, 'pip') && !s.flag('c4a_pack_pip')) {
      s.setFlag('c4a_pack_pip');
      await s.say('Pip', '...I\'m gonna walk in the middle. Of everyone. For a bit.');
    }
  },

  async vigil(s) {
    await s.narrate('A standing stone at the cliff\'s edge, carved with the Dawnguard sunburst. At its foot, a cairn of grey rocks, and a sword driven into the top of it, rusting.');
    if (!has(s, 'bram') || s.flag('c4a_vigil_seen')) return;
    s.setFlag('c4a_vigil_seen');
    s.music('sad');
    await s.say('Bram', 'The Vigil Stone.');
    await s.say('Wren', 'Bram?');
    await s.say('Bram', 'Every squire of the Dawnguard comes here at the end of their training. One night, alone, on the pass. You hold it until dawn — wolves, cold, whatever comes. That\'s the trial.');
    await s.say('Bram', 'Sir Aldous walked me up. He said, "Kestrel, you\'re the most stubborn lad I ever trained. Stubborn\'s half of courage." Then he went down to the monastery to wait for morning.');
    await s.wait(1.0);
    await s.say('Bram', 'The wolves came about midnight. A big white one leading them. And I...');
    await s.say('Bram', 'I couldn\'t move. I couldn\'t _move_, Wren. My sword arm just... wouldn\'t.');
    await s.say('Bram', 'Sir Aldous heard the howling. He came back up. Fifty years old, in the dark, in the snow. He got between me and them.');
    await s.wait(1.2);
    await s.say('Bram', 'That\'s his sword. On the cairn.');
    await s.say('Ilse', 'Bram...');
    await s.say('Bram', 'Lord-Commander Thorne said it was the worst trade the Dawnguard ever made. A knight for a squire who froze.');
    await s.say('Bram', '...He wasn\'t wrong.');
    if (has(s, 'sable')) {
      await s.say('Sable', 'He was wrong.');
      await s.say('Bram', 'Sable—');
      await s.say('Sable', 'You keep standing in front of us. Every time. I have watched you. Your hands shake, and you stand in front of us anyway.');
      await s.say('Sable', 'I do not know very much. But I know that is not the same as freezing.');
      await s.wait(1.0);
      await s.say('Bram', '...Thank you.');
    }
    await s.narrate('Bram kneels and brushes the snow from the old sword\'s hilt. He stays there a long moment. When he stands, his eyes are red.');
    await s.say('Bram', 'It\'s the wind.');
    if (has(s, 'corvin')) await s.say('Corvin', 'Cold wind up here. Gets everyone.');
    s.music('snow');
    s.journal('Bram showed us the Vigil Stone, where his knighting trial went wrong and Sir Aldous died. His sword is still on the cairn. Sable told Bram the truth about himself, and he said it was the wind.');
  },

  async whitefang(s) {
    if (s.flag('c4a_whitefang_dead')) return;
    await s.narrate('The den reeks of old blood. Goat bones everywhere. At the back of the cave, something huge and white uncurls and lifts its head.');
    if (s.flag('c4a_vigil_seen') && has(s, 'bram')) {
      await s.say('Bram', '...That\'s him.');
      await s.say('Wren', 'Bram?');
      await s.say('Bram', 'The white one. From the Vigil. He\'s — he\'s gone grey round the muzzle.');
      await s.say('Bram', '...So have I, a bit. Let\'s go.');
    } else {
      await s.say('Bram', 'Wolf. A very, very large wolf. Everyone stand behind me. Please.');
    }
    if (!(await s.confirm('Fight Whitefang?'))) {
      s.place('player', 29, 25, 'left');
      return;
    }
    const r = await s.battle('boss_c4a_whitefang', { bg: 'snow' });
    if (r !== 'win') return;
    s.setFlag('c4a_whitefang_dead');
    await s.narrate('Whitefang lies down in the snow like an old dog by a fire, sighs once, and is still.');
    if (s.flag('c4a_vigil_seen') && has(s, 'bram')) {
      await s.say('Bram', '...Huh.');
      await s.say('Bram', 'He\'s just a wolf. An old, mean wolf. I\'ve been afraid of him for three years.');
      if (has(s, 'corvin')) await s.say('Corvin', 'That\'s the trick with monsters, big lad. Up close, they\'re mostly just tired.');
    }
    s.journal('We put down Whitefang, the old white wolf of the pass. Bram looked at him for a long time.');
  },

  // =================================================================== Frosthollow
  async frosthollowEnter(s) {
    if (!s.flag('c4a_frosthollow_arrived')) return C4M.arrival(s);
    if (s.flag('c4a_night') && !s.flag('c4a_gate_done')) return C4M.gate(s);
  },

  async arrival(s) {
    s.setFlag('c4a_frosthollow_arrived');
    crew(s, [['ilse', 20, 34, 'up'], ['bram', 22, 34, 'up'], ['sable', 23, 33, 'up'], ['pip', 19, 33, 'up'], ['corvin', 21, 35, 'up']]);
    await s.pan(22, 12, 1.6);
    await s.narrate('Frosthollow clings to the mountain like a swallow\'s nest: grey stone, slate roofs heavy with snow, and above it all the bell tower that holds the Lantern.');
    await s.follow(1);
    s.spawn('kidrun1', 'c4a_tomas', 16, 28, 'right');
    s.spawn('kidrun2', 'c4a_lars', 15, 28, 'right');
    await Promise.all([s.move('kidrun1', [[30, 28]], 4.5), s.move('kidrun2', [[29, 28]], 4.2)]);
    s.remove('kidrun1');
    s.remove('kidrun2');
    s.spawn('tolle_a', 'c4a_tolle', 21, 26, 'down');
    await s.move('tolle_a', [[21, 31]], 3.4);
    await s.say('Brother Tolle', 'Pilgrims! In _this_ weather! Oh — oh, you\'re _armed_ pilgrims. That\'s fine. That\'s — welcome to Frosthollow!');
    await s.say('Brother Tolle', 'I\'m Brother Tolle. I do the guesthouse. And the goats, on Tuesdays. And the— sorry. Welcome.');
    await s.say('Wren', 'We\'ve come from Saltglass to see Brother Halvard. Keeper Tamsin sent us.');
    await s.say('Brother Tolle', 'The Keeper\'s in the Hall of Echoes, teaching the little ones the morning hymn. They\'re terrible at it. He says that\'s the point.');
    await s.say('Brother Tolle', 'The hall\'s the big one at the top of the steps. The guesthouse is just east — beds are free for pilgrims. The Keeper insists. I insist too, but nobody listens to me.');
    await s.move('tolle_a', [[21, 24], [30, 13]], 3.4);
    s.remove('tolle_a');
    dismiss(s, PARTY);
    s.objective('Find Brother Halvard in the Hall of Echoes (top of the steps).');
    s.journal('We reached Frosthollow. A monk called Tolle apologized to us four times in one minute. Brother Halvard is teaching children to sing.');
  },

  async ansel(s) {
    if (s.flag('c4a_done')) {
      await s.say('Brother Ansel', ['Grey cloaks came back, after the snow settled. Three days later. Ten of them, very polite.', 'They climbed the tower and did something to the light. Nobody stopped them. Nobody was left who knew how.', 'It sounds different at dawn now. Flatter. Like a bell with a crack in it that only you can hear.']);
    } else {
      await s.say('Brother Ansel', ['The monastery stores! Everything blessed. Nothing refunded.', 'The cheese is from our own goats. The goats have opinions about this.']);
    }
    await s.shop('frosthollow');
  },

  async agathe(s) {
    if (s.flag('c4a_lilies_done')) return s.say('Sister Agathe', s.flag('c4a_done') ? ['Both my novices are well. The salve worked.', 'Your Mender ground those lilies like she\'d been born doing it. Tell her an old woman said so. Tell her twice.'] : ['Both fevers broke this morning. Your Mender has good hands.', 'Not the Crest. The _hands_. Different thing.']);
    if (s.flag('c4a_done')) return s.say('Sister Agathe', 'Tend your wounds, children. All of them. Even the ones that don\'t bleed.');
    if (!s.flag('c4a_lilies_taken')) {
      s.setFlag('c4a_lilies_taken');
      await s.say('Sister Agathe', ['Two of my novices have mountain fever, and I\'m out of frost lilies. The lily slopes are thick with wolves this winter.', 'Three would do. If you happen to come across any on the pass. If you happen to.']);
      s.quest('c4a_lilies', 'Frost Lilies', 'Sister Agathe of Frosthollow needs three frost lilies for her fevered novices. They grow off the trail in the Greyspine Pass.');
    }
    if (!s.has('frost_lily', 3)) return s.say('Sister Agathe', `Three lilies, child. ${s.state.inventory.count('frost_lily') ? 'You\'ve found some — bless you. A few more.' : 'Off the trail, in the quiet places. Mind the snow.'}`);
    s.setFlag('c4a_lilies_done');
    await s.take('frost_lily', 3);
    await s.say('Sister Agathe', 'Three! Bless you. Here — you, the girl with the careful hands. Grind these while I boil the water.');
    if (has(s, 'ilse')) {
      await s.say('Ilse', 'Me? I— yes. Of course.');
      await s.narrate('Ilse grinds the lilies in quick, neat circles, without being shown how.');
      await s.say('Sister Agathe', 'You\'ve done this before.');
      await s.say('Ilse', 'My grandmother\'s an herbalist. And I\'m a Mender. The light said so.');
      await s.say('Sister Agathe', 'The light said _Mender_. The light didn\'t say _good_. That\'s not the light\'s to say. That\'s you.');
      await s.wait(0.8);
      await s.say('Ilse', '...Nobody\'s ever put it like that. They always say the light knew.');
      await s.say('Sister Agathe', 'The light knows the job, child. It doesn\'t know _you_. Only you get to know you. Takes most of us sixty years. I\'m still working on it.');
    }
    await s.say('Sister Agathe', 'Moss from the infirmary roof, woven round copper. Old novices\' trick. Keeps the blood moving and the heart stubborn.');
    await s.give('regen_bangle');
    s.quest('c4a_lilies', null, null, 'done');
    s.journal('Sister Agathe told Ilse the light knows the job but not the person. Ilse didn\'t say anything for a whole hour. I think that\'s the most important thing anyone has said to her in years.');
  },

  async ivo(s) {
    if (s.flag('c4a_whitefang_paid')) return s.say('Brother Ivo', ['Not one goat lost since the old wolf went. They\'ve grown insufferable. They know they\'re safe.']);
    if (s.flag('c4a_whitefang_dead')) {
      s.setFlag('c4a_whitefang_paid');
      if (!s.flag('c4a_whitefang_taken')) await s.say('Brother Ivo', 'Wait — you\'re the ones who put down Whitefang? Before I even asked?');
      await s.say('Brother Ivo', ['Seventy years that wolf ran this mountain. My father hunted him. His father hunted him.', 'Here. My father\'s, and my grandfather\'s before. They never needed them in the end. You\'ve earned them.']);
      await s.give('power_fruit');
      await s.give('swift_fruit');
      s.quest('c4a_whitefang', null, null, 'done');
      return;
    }
    if (s.flag('c4a_done')) return s.say('Brother Ivo', 'The goats are frightened of the quiet. So am I.');
    if (!s.flag('c4a_whitefang_taken')) {
      s.setFlag('c4a_whitefang_taken');
      await s.say('Brother Ivo', ['Another goat gone. Whitefang again — the old white wolf. He\'s been raiding this mountain since before I was born.', 'His den\'s on the middle terrace of the pass, east side, behind the rocks. If someone were to... persuade him to retire, I\'d make it worth their while.']);
      s.quest('c4a_whitefang', 'The Old Wolf', 'Brother Ivo\'s goats keep vanishing. Whitefang, the great white wolf, dens on the east side of the Greyspine Pass\'s middle terrace.');
      return;
    }
    return s.say('Brother Ivo', 'Middle terrace of the pass, east side. You\'ll smell it before you see it.');
  },

  async rhoswen(s) {
    if (s.flag('c4a_done')) return s.say('Sister Rhoswen', ['We\'ll carve his name tomorrow. Halvard. Just the one word. He\'d hate anything longer.', 'He\'d say: "Save the stone for someone who did something interesting."']);
    return s.say('Sister Rhoswen', ['These stones carry the names of the Dawnguard who died on the pass. Most from the old wars.', 'One is newer than the rest. Three winters old. The Keeper carved it himself and wouldn\'t let anyone help.']);
  },

  async wenna(s) {
    await s.say('Sister Wenna', ['I was Kindled last spring. Cantor. I\'ll sing in the hall for fifty years.', 'I always wanted to climb the high peaks. The ones nobody\'s named. They\'re right there — look. And I\'ll be singing at them.']);
    if (s.flag('c4a_wenna')) return;
    s.setFlag('c4a_wenna');
    await s.say('Wren', 'You could do both.');
    await s.say('Sister Wenna', 'That\'s not how it works. One Crest, one life.');
    await s.wait(0.6);
    await s.say('Wren', '...I\'m not sure anyone knows how it works anymore.');
  },

  async memorial(s) {
    await s.narrate('Names cut into the stone, row on row, the old ones softened by weather. At the very end, a newer cut, sharp-edged: SIR ALDOUS VENN. HE HELD THE LINE.');
    if (!has(s, 'bram') || s.flag('c4a_memorial_bram')) return;
    s.setFlag('c4a_memorial_bram');
    await s.wait(0.8);
    await s.say('Bram', '"He held the line."');
    await s.say('Bram', '...He did. That\'s exactly what he did.');
  },

  async bellTower(s) {
    if (s.flag('c4a_done')) return s.narrate('The tower leans a little to the east now. The great bell hangs crooked in its frame and does not move, even in the wind. The Lantern still burns.');
    await s.narrate(['The bell tower of Frosthollow, with the Lantern burning at its crown. Below the lamp hangs a great bronze bell, green with age.', 'A brass plate on the door: THIS BELL IS NOT TO BE RUNG. THE MOUNTAIN IS LISTENING.']);
  },

  async stairLocked(s) {
    if (s.flag('c4a_done')) return s.narrate('Snow has filled the Bell Stair to the roof.');
    await s.narrate('The Bell Stair: steps cut down into the mountain, behind an iron gate. A hand-painted sign: KEEPER ONLY. EVEN IF THERE IS A DRAGON. — H.');
  },

  // ------------------------------------------------------------------ hide-and-seek
  async ebba(s) {
    if (s.flag('c4a_hide_done')) return s.say('Ebba', ['Next time I\'m hiding and YOU\'RE it.', 'I\'ll hide in the bell. Nobody ever looks in the bell.']);
    const found = Object.keys(KID_NAMES).filter((k) => s.flag(`c4a_found_${k}`));
    if (!s.flag('c4a_hide_taken')) {
      s.setFlag('c4a_hide_taken');
      await s.say('Ebba', ['I\'m IT and I can\'t find ANYONE. They cheat. They\'re too good at hiding.', 'There\'s five: Tomas, Linnea, Lars, Yrsa and Oskar. Will you help? You\'re tall. Tall people can see more.']);
      s.quest('c4a_hide', 'Hide-and-Seek', 'Ebba can\'t find the other novices: Tomas, Linnea, Lars, Yrsa and Oskar. They\'re hiding somewhere around Frosthollow (and its hall and guesthouse).');
      if (has(s, 'pip')) await s.say('Pip', 'Finding people who don\'t wanna be found? I\'m a _professional_.');
      return;
    }
    if (found.length < 5) {
      const left = Object.keys(KID_NAMES).filter((k) => !found.includes(k)).map((k) => KID_NAMES[k]);
      return s.say('Ebba', `${found.length} found! Still hiding: ${left.join(', ')}.`);
    }
    s.setFlag('c4a_hide_done');
    await s.say('Ebba', 'You found EVERYONE? Even _Yrsa_? Nobody ever finds Yrsa!');
    await s.say('Ebba', 'Here. It\'s the Abbot\'s brooch. I borrowed it. From the Abbot. Who\'s been dead for ninety years. So it\'s more like _finding_ than borrowing.');
    await s.give('crest_brooch');
    if (has(s, 'pip')) await s.say('Pip', 'She stole it. I respect that.');
    s.quest('c4a_hide', null, null, 'done');
  },

  async hider(s, k) {
    const name = KID_NAMES[k];
    const lines = {
      tomas: ['Aw! Don\'t tell Ebba I was behind the woodshed.', 'Tell her I was somewhere cleverer. Tell her I was in the bell.'],
      linnea: ['Shh! Lars always hides with me. Lars? LARS.', '...He\'s not here. Rude.'],
      lars: ['I\'m a tree.', '...You can see me? I\'m a very small tree.'],
      oskar: ['I\'m not IN the Bell Stair! I\'m NEXT to it!', 'Brother Halvard says nobody goes in except the Keeper. Not even if there\'s a dragon. _Especially_ if there\'s a dragon.'],
    };
    if (s.flag(`c4a_found_${k}`)) {
      return k === 'yrsa' ? s.narrate('Yrsa holds a finger to her lips, very seriously, and points at the bookshelf. She is still hiding. She has decided it counts.') : s.say(name, 'Go and find the others! I\'m staying here. It\'s a good spot.');
    }
    if (!s.flag('c4a_hide_taken')) {
      return k === 'yrsa' ? s.narrate('A small girl in a novice robe is crouched behind the bookshelf, perfectly silent, perfectly still.') : s.say(name, 'Shh! We\'re playing hide-and-seek! Ebba\'s it! Go away, you\'ll give me away!');
    }
    s.setFlag(`c4a_found_${k}`);
    s.sfx('blip');
    if (k === 'yrsa') await s.narrate('Yrsa looks up at you with enormous eyes and holds one finger to her lips. Then she sighs, stands up, and solemnly shakes your hand.');
    else await s.say(name, lines[k]);
    const n = Object.keys(KID_NAMES).filter((kk) => s.flag(`c4a_found_${kk}`)).length;
    s.toast(`Found ${name}! (${n}/5)`);
  },

  // ------------------------------------------------------------------ the Hall of Echoes
  async halvard(s) {
    if (s.flag('c4a_halvard_met') || !s.flag('c4a_frosthollow_arrived') || s.flag('c4a_night')) return;
    s.setFlag('c4a_halvard_met');
    s.spawn('halvard_h', 'halvard', 8, 4, 'down');
    spawnKids(s, [[3, 7], [5, 7], [6, 7], [10, 7], [11, 7], [13, 7]], 'up');
    s.place('player', 8, 11, 'up');
    crew(s, [['ilse', 7, 11, 'up'], ['bram', 9, 11, 'up'], ['sable', 6, 11, 'up'], ['pip', 10, 11, 'up'], ['corvin', 9, 12, 'up']]);
    await s.wait(0.5);
    await s.narrate('Six children in grey novice robes stand in two crooked rows, singing at the top of their lungs. The hymn is old and beautiful. They are murdering it.');
    s.sfx('song');
    await s.say('Halvard', 'Lovely! Lovely. Oskar, a little less like a goat being sat on. Yrsa, a little more like anything at all. Again, from "the sun is kind"—');
    s.face('halvard_h', 'down');
    await s.emote('halvard_h', '!');
    await s.say('Halvard', 'Ah! Pilgrims! Either you\'re very holy or very lost. Children — that\'ll do. Go and practice on the goats.');
    for (const k of KIDS) s.move(`kid_${k}`, [[8, 9], [8, 12]], 3.2);
    await s.wait(1.6);
    removeKids(s);
    await s.move('halvard_h', [[8, 7]], 1.6);
    await s.move('player', [[8, 8]]);
    await s.say('Halvard', 'Halvard. Keeper of Frosthollow, abbot of nothing, teacher of the worst choir in Solmere.');
    await s.say('Halvard', 'And you have Ysolde\'s chin. Wren, is it? Tamsin\'s bird flew faster than your caravan.');
    await s.say('Wren', 'Tamsin sent a _bird?_');
    await s.say('Halvard', 'Tamsin sends birds the way other people breathe. This one said: "Ysolde\'s girl is coming with one of Cassian\'s forks. Listen to it. Tell her the truth." Underlined. Twice.');
    await s.narrate('Wren opens the case. Halvard lifts out a fork and turns it in the light, the way a jeweler turns a stone he already suspects is false.');
    await s.move('halvard_h', [[8, 3]], 1.4);
    s.face('halvard_h', 'up');
    await s.say('Halvard', 'Do you know what this is? The Ice Score. The Dawnsong, as the first Keepers heard it, carved into the glacier this monastery is built on. Every note.');
    await s.say('Halvard', 'It\'s read from the bottom up. It rises — like the sun.');
    s.sfx('holy');
    s.flash('#e0f4ff', 0.6);
    await s.narrate(['He strikes the fork and touches it to the ice.', 'The note goes into the wall and runs up the carved staves like water finding cracks. Then it stops — high up, near the top of the score — and the whole wall gives off a sound like a held breath.']);
    s.stopMusic(2);
    await s.wait(1.6);
    await s.say('Halvard', '...No.', { speed: 0.6 });
    s.face('halvard_h', 'down');
    await s.say('Halvard', 'Every morning for forty years I\'ve heard this song in children\'s voices. I know it better than my own name.');
    await s.say('Halvard', 'Your fork is tuned to the last note. The highest. The note where the Dawnsong lets go of the sun and lets it rise on its own.');
    await s.say('Halvard', 'But it\'s flat. Not by much. By exactly enough.');
    await s.wait(1.0);
    s.music('tension');
    await s.say('Halvard', 'This is not tuned to the Dawnsong, Wren.');
    await s.say('Halvard', 'It is tuned to its _reflection_.');
    await s.say('Ilse', 'Its reflection? What does that mean?');
    await s.say('Halvard', 'The same note, turned upside down. Sung downward instead of up. A song that doesn\'t let go of the sun — a song that _holds_ it.');
    await s.say('Halvard', 'The oldest texts have a name for the Dawnsong sung backward. Only a name: _the Vespersong_. And after the name, someone has scratched out the rest of the page.');
    if (has(s, 'pip')) {
      await s.say('Pip', '...Vesper. Like those grey-cloak soldiers? The ones who keep sniffing after Sable?');
      await s.wait(0.8);
      await s.say('Halvard', '...Grey cloaks?');
    }
    await s.say('Wren', 'There\'s a mistake. There has to be. The forks were made in the Cathedral foundry — a hundred people could have touched them. Sister Mercy was _in_ the Cathedral, she could have—');
    await s.say('Ilse', 'Wren.');
    await s.say('Wren', 'He _wouldn\'t_, Ilse. He wouldn\'t. He\'s the one trying to _stop_ the Gloam—');
    await s.wait(0.8);
    await s.say('Halvard', '_(gently)_ Perhaps not. Perhaps a careless hand at the foundry. Perhaps an old monk\'s ears are going.');
    await s.say('Halvard', 'But I won\'t set it in my light. And I\'d ask you not to give the others to anyone until we know. I\'ll write to Osk, and Elowen, and Vasha tonight.');
    await s.say('Halvard', 'Leave me this one. I want to listen to it again when the hall is quiet.');
    await s.say('Halvard', 'Stay the night. The pass is no place after dark, and Tolle has been airing the guesthouse beds for a week out of sheer hope. We\'ll talk in the morning, with tea, when the world is warmer.');
    await s.think('Wren', 'He wouldn\'t. ...Would he?');
    await s.think('Wren', 'He wouldn\'t.');
    dismiss(s, PARTY);
    s.remove('halvard_h');
    // The hall's NPCs only spawn on map load; stand them up now so they can be talked to.
    s.spawn('halvard', 'halvard', 8, 4, 'down', { name: 'Halvard', run: (s2) => C4M.halvardTalk(s2) });
    s.spawn('yrsa', 'c4a_yrsa', 15, 3, 'left', { name: 'Yrsa', run: (s2) => C4M.hider(s2, 'yrsa') });
    s.music('kindling');
    s.objective('Explore Frosthollow. When you\'re ready, rest at the guesthouse — talk to Brother Tolle.');
    s.journal('Brother Halvard held the fork to the Ice Score. He says it isn\'t tuned to the Dawnsong — it\'s tuned to its reflection. The Vespersong. It has to be a mistake. Someone at the foundry. Mercy. Anyone. It HAS to be.');
  },

  async halvardTalk(s) {
    if (has(s, 'bram') && !s.flag('c4a_halvard_bram')) {
      s.setFlag('c4a_halvard_bram');
      await s.say('Halvard', 'You. The big one with the red cape. You\'re Bram Kestrel.');
      await s.say('Bram', '...Yes, Brother.');
      await s.say('Halvard', 'Aldous stayed in my guesthouse the night before your Vigil. He couldn\'t sleep. Kept me up till two.');
      await s.say('Halvard', 'He kept saying, "That boy is the best I\'ve trained in thirty years, Halvard, and he hasn\'t the faintest idea."');
      await s.wait(1.2);
      await s.say('Bram', '...He never said.');
      await s.say('Halvard', 'Men like Aldous never do. They say it to old monks at midnight and leave us to pass it on.');
      await s.say('Halvard', 'Consider it passed.');
      s.journal('Halvard told Bram that Sir Aldous called him the best squire he\'d trained in thirty years. Bram went outside to look at the mountains for a while.');
      return;
    }
    const lines = [
      ['Tea in the morning. I make it badly, but with tremendous conviction.'],
      ['The children? Foundlings, all six. Left at the gate in baskets, in blankets — one in a cheese crate. That was Oskar. He still smells faintly of cheddar.'],
      ['I keep striking your fork, and listening. It doesn\'t get better, child. I\'m sorry.', 'Cassian was a sweet boy. Sweet boys grow into all sorts of things.'],
    ];
    if (s.flag('c4a_hide_done')) lines.push(['Ebba gave you the Abbot\'s brooch? Keep it. The Abbot hasn\'t needed it in ninety years. He\'d be thrilled it\'s finally going somewhere.']);
    s.vars.c4aHalvard = ((s.vars.c4aHalvard ?? -1) + 1) % lines.length;
    return s.say('Halvard', lines[s.vars.c4aHalvard]);
  },

  async quill(s) {
    if (s.flag('c4a_done')) return s.say('Brother Quill', ['I\'m copying the Ice Score onto vellum. All of it. Before anyone else comes to "tune" anything.', 'He\'d have done it himself. He kept meaning to. He kept saying there was time.']);
    if (s.flag('c4a_halvard_met')) return s.say('Brother Quill', ['The Keeper\'s been at the score for an hour, striking that fork and listening.', 'He\'s not singing. He always sings. Even at funerals. _Especially_ at funerals.']);
    return s.say('Brother Quill', ['The Ice Score is read from the bottom up — it rises, like the sun.', 'Twelve hundred years old. The first Keepers carved it while the glacier was still warm from their hands. That\'s the legend, anyway. Glaciers aren\'t warm. I\'ve checked.']);
  },

  async iceScore(s) {
    await s.narrate(['The Dawnsong, carved into the living ice: staves and notes in an alphabet older than the Choir. It climbs the wall from floor to ceiling.', 'Near the very top, the last note has been carved deeper than all the others, as if the carver wanted to be sure no one could ever wear it away.']);
  },

  // ------------------------------------------------------------------ the guesthouse & the night
  async tolle(s) {
    if (!s.flag('c4a_halvard_met')) {
      await s.say('Brother Tolle', 'Beds are free for pilgrims! Blankets are... mostly goat-free.');
      return s.inn(0, 'the guesthouse');
    }
    await s.say('Brother Tolle', ['Beds are aired! Lamps are trimmed! I even found the good pillow. There\'s only one. Fight for it.']);
    const ok = await s.confirm('Turn in for the night? (The story will move on. Anything unfinished in Frosthollow will have to wait.)');
    if (!ok) return s.say('Brother Tolle', 'Take your time! The beds aren\'t going anywhere. Neither am I. I never go anywhere.');
    return C4M.night(s);
  },

  async night(s) {
    s.setFlag('c4a_night');
    await s.fadeOut(1.2);
    s.stopMusic(1.5);
    s.heal();
    s.remove('tolle');
    s.remove('linnea');
    await s.narrate(['That night the snow stops.', 'The wind stops.', 'In the quiet, Wren lies awake listening to the forks in their case. They hum, very faintly — a note that goes down instead of up.']);
    await s.wait(0.6);
    s.sfx('surprise');
    await s.narrate('Then: a bell. Not the great bell — the small gate-bell, ringing and ringing and ringing.');
    s.place('player', 2, 3, 'down');
    s.spawn('tolle_n', 'c4a_tolle', 5, 6, 'up');
    await s.fadeIn(0.6);
    s.music('tension');
    await s.move('tolle_n', [[5, 4]], 5);
    await s.say('Brother Tolle', 'Up! Everyone up! Soldiers at the gate — grey cloaks, dozens of them — the Keeper says come _now_, quietly, and bring your swords!');
    if (has(s, 'corvin')) await s.say('Corvin', 'Grey cloaks. Of course it\'s grey cloaks. It is _always_ grey cloaks.');
    await s.move('tolle_n', [[5, 7]], 5);
    s.remove('tolle_n');
    s.objective('Go outside and find Brother Halvard.');
  },

  async gate(s) {
    s.setFlag('c4a_gate_done');
    await s.fadeOut(0.3);
    s.place('player', 25, 21, 'left');
    crew(s, [['ilse', 26, 20, 'left'], ['bram', 26, 22, 'left'], ['sable', 27, 21, 'left'], ['pip', 27, 20, 'left'], ['corvin', 27, 22, 'left']]);
    s.spawn('halvard_g', 'halvard', 21, 25, 'down');
    s.spawn('garrick_g', 'garrick', 21, 28, 'up');
    [[19, 29], [23, 29], [20, 31], [22, 31]].forEach(([x, y], i) => s.spawn(`vesper_g${i}`, 'vesper_soldier', x, y, 'up'));
    s.spawn('tolle_g', 'c4a_tolle', 14, 10, 'down');
    spawnKids(s, [[13, 10], [15, 10], [12, 11], [16, 11], [14, 11], [13, 12]]);
    await s.pan(21, 26, 0.1);
    await s.fadeIn(0.8);
    await s.say('Garrick', 'Brother Halvard. The Hierophant sends his regards. And his patience, which is at an end.');
    await s.say('Halvard', 'Lord-Commander Thorne. Forty soldiers, to visit a monastery of six children and an old man. Cassian\'s regards have grown heavy.');
    await s.say('Garrick', 'The fork, Keeper. Set it in your light, and we are gone by morning. Refuse, and I set it myself, and we are gone anyway. The only thing you choose tonight is how many of your monks are standing when we go.');
    await s.wait(0.8);
    await s.say('Halvard', 'This fork?');
    await s.narrate('Halvard turns and, with an old soldier\'s arm, throws the fork out over the cliff. It glints once in the lantern-light and is gone into the dark.');
    await s.say('Halvard', 'Fetch.');
    if (has(s, 'corvin')) await s.say('Corvin', '_(whispering)_ Oh, I _like_ him.');
    await s.wait(0.8);
    await s.say('Garrick', '...You always did mistake stubbornness for faith, Halvard.');
    await s.follow(0.8);
    s.face('garrick_g', 'player');
    await s.emote('garrick_g', '!');
    if (has(s, 'sable')) {
      await s.say('Garrick', 'And there she is. Black hair. Pale as milk. The Hierophant described her well.');
      await s.say('Garrick', 'The girl comes with me. She is wanted home.');
      await s.wait(0.6);
      await s.say('Sable', 'I do not have a home.');
      await s.wait(0.6);
      await s.say('Sable', 'I have Wren.');
    }
    if (has(s, 'bram')) {
      await s.move('bram_c', [[25, 22], [24, 22]], 3);
      s.face('bram_c', 'left');
      await s.say('Garrick', '...Kestrel?');
      await s.say('Garrick', 'Kestrel! The boy who froze. On my mountain again. Have you come to finish your Vigil? Aldous is still up there, if you\'d like to apologize.');
      await s.narrate('Bram\'s sword hand is shaking. He doesn\'t move. He can\'t.');
    }
    s.face('halvard_g', 'up');
    await s.say('Halvard', 'CHILDREN — TO TOLLE! Wren Halloway — the Bell Stair! Take them down to the eastern face. Tolle knows the way!');
    await s.say('Garrick', 'Take them.');
    await Promise.all([s.move('vesper_g2', [[20, 24], [23, 22]], 4), s.move('vesper_g3', [[22, 24], [24, 23]], 4)]);
    const r = await s.battle('c4a_fh_gate', { bg: 'snow', mood: 'night' });
    if (r !== 'win') return;
    s.remove('vesper_g2');
    s.remove('vesper_g3');
    await s.say('Halvard', 'GO! I\'ll keep Thorne busy. I\'ve been boring soldiers to death for forty years — I\'m very good at it.');
    await s.say('Wren', 'Come with us!');
    await s.say('Halvard', 'Someone has to mind the light, child.');
    await s.say('Halvard', 'And take this — my copy of the Score, with the note marked. Show Osk. Show Elowen. Show anyone who\'ll listen. NOW, Wren!');
    await s.give('c4a_halvard_score');
    for (const k of KIDS) s.move(`kid_${k}`, [[14, 12], [32, 12], [40, 6], [40, 3]], 3.6);
    s.move('tolle_g', [[14, 12], [32, 12], [40, 6], [40, 3]], 3.4);
    await s.wait(1.5);
    if (has(s, 'bram')) {
      await s.say('Ilse', 'Bram. _Bram._ We have to go.');
      await s.say('Bram', '...Going. I\'m going.');
    }
    dismiss(s, PARTY);
    await s.wait(3);
    removeKids(s);
    s.remove('tolle_g');
    s.objective('Escape down the Bell Stair (north-east cliff, behind the guesthouse) with the children.');
    s.journal('Garrick came to Frosthollow in the night with forty soldiers and demanded Halvard set the fork in his light. Halvard threw it off the cliff. Then he sent us and the children down the Bell Stair, and stayed behind. He gave me his copy of the Score.');
  },

  // =================================================================== The Bell Stair
  async stairEntry(s) {
    s.spawn('tolle_c', 'c4a_tolle', 8, 15, 'left');
    await s.say('Brother Tolle', 'This way! The Bell Stair comes out on the eastern face, right under the tower. Mind the ice — it\'s older than the monastery and twice as slippery!');
    await s.say('Ebba', '_(from the dark ahead)_ Brother Tolle? Is the Keeper coming?', { portrait: false });
    await s.wait(0.8);
    await s.say('Brother Tolle', '...He\'s right behind us, Ebba. Keep walking. Hold Yrsa\'s hand.');
    await s.move('tolle_c', [[14, 9]], 4);
    s.remove('tolle_c');
    if (has(s, 'corvin')) {
      await s.say('Corvin', 'For the record, every bone in my body is telling me to run the other way.');
      if (has(s, 'pip')) await s.say('Pip', 'So run!');
      await s.say('Corvin', 'I _am_ running. I just keep running in the same direction as you lot. It\'s very confusing for me.');
    }
  },

  async stairAmbush(s) {
    await s.say('???', 'There! Down the stair! The girl is with them!', { portrait: false });
    s.shake(0.2, 0.6);
    await s.say('Bram', 'Behind us! Rearguard — everyone turn around!');
    const r = await s.battle('c4a_fc_ambush', { bg: 'cave' });
    if (r !== 'win') return;
    await s.say('Ilse', 'They\'ll keep coming. Faster. _Move._');
  },

  async rubble(s) {
    await s.narrate('The tunnel ahead is choked with fallen ice — great blocks of it, shaken loose by the soldiers\' boots overhead.');
    await s.say('Brother Tolle', '_(from beyond the ice)_ Wren? WREN! The little ones are through — but the roof came down behind us! Can you get past?', { portrait: false });
    if (!has(s, 'bram')) {
      await s.narrate('It takes all of you, heaving together, a long time. The ice gives way at last.');
      s.clearBlocker('rubble');
      return;
    }
    await s.say('Ilse', 'It\'s too heavy. Even for— Bram?');
    await s.wait(0.6);
    await s.say('Bram', 'Stand back.');
    await s.narrate('Bram sets his shoulder against the biggest block. For a long moment nothing happens except Bram going red, then purple. Then the ice groans, and shifts, and topples sideways with a crash that echoes all the way down the stair.');
    s.shake(0.4, 1.0);
    s.clearBlocker('rubble');
    await s.say('Bram', 'Ha. HA. Lifting! I\'m good at lifting. Lifting is— lifting I can _do_.');
    await s.say('Ilse', 'You were magnificent.');
    await s.say('Bram', 'I— really?');
    await s.say('Ilse', 'Don\'t make me say it twice.');
  },

  // =================================================================== The eastern ledge: Garrick, and the bell
  async ledge(s) {
    if (s.flag('c4a_done')) return;
    if (!s.flag('c4a_garrick_beaten')) {
      s.stopMusic(1);
      s.place('player', 9, 13, 'right');
      crew(s, [['ilse', 8, 12, 'right'], ['bram', 10, 14, 'right'], ['sable', 8, 14, 'right'], ['pip', 7, 13, 'right'], ['corvin', 10, 12, 'right']]);
      s.spawn('tolle_l', 'c4a_tolle', 4, 13, 'right');
      spawnKids(s, [[3, 12], [5, 12], [2, 13], [3, 14], [5, 14], [4, 12]], 'right');
      await s.narrate('The Bell Stair opens onto a shelf of snow on the mountain\'s eastern face. Far below, the world is dark. Far above, the bell tower burns — its Lantern the only light for a hundred miles.');
      await s.say('Brother Tolle', 'We made it! We— oh. Oh no.');
      s.spawn('garrick_l', 'garrick', 31, 15, 'left');
      s.spawn('guard1', 'c4a_vesper_guard', 32, 14, 'left');
      s.spawn('guard2', 'c4a_vesper_guard', 32, 16, 'left');
      await s.say('Garrick', 'You think I don\'t know this mountain, Keeper\'s girl? I kept my own Vigil on it before you were born.', { portrait: false });
      s.music('tension');
      await Promise.all([s.move('garrick_l', [[17, 14]], 2.2), s.move('guard1', [[18, 13]], 2.2), s.move('guard2', [[18, 15]], 2.2)]);
      await s.say('Garrick', 'Halvard sent you down his little stair. Halvard always was predictable.');
      await s.say('Wren', 'What did you do to him?');
      await s.say('Garrick', 'Nothing, yet. He\'s barred himself in his tower with his bell and his principles. My men will have him out by dawn.');
      if (has(s, 'sable')) await s.say('Garrick', 'The girl, Halloway. Give her to me, and the rest of you walk down this mountain alive. Even the coward.');
      await s.say('Wren', 'No.');
      await s.say('Garrick', 'The Hierophant asked nicely, girl. I am what comes after nicely.');
      await s.wait(0.6);
      await s.say('Wren', '...He didn\'t send you. He _wouldn\'t_. You\'re lying.');
      await s.say('Garrick', 'Believe whatever lets you sleep.');
      if (has(s, 'bram')) {
        await s.move('bram_c', [[12, 14], [13, 14]], 2.5);
        await s.say('Bram', 'Lord-Commander.');
        await s.say('Garrick', 'Kestrel. Still shaking?');
        await s.wait(0.8);
        await s.say('Bram', 'Yes.');
        await s.say('Bram', 'You were right. I froze. On this mountain. Sir Aldous died because I froze, and I think about it every day. Every single day.');
        await s.say('Garrick', 'Good.');
        await s.wait(1.0);
        await s.say('Bram', '...And I\'m still standing here.');
        await s.say('Bram', 'My hands are shaking, and I\'m standing here. Between you and them. Sable says that\'s not the same as freezing. I think she\'s right.');
        await s.wait(0.8);
        await s.say('Garrick', 'Then you\'ll die standing. Aldous would have liked that.');
      }
      if (has(s, 'corvin')) {
        await s.say('Corvin', 'Garrick.');
        await s.say('Garrick', 'Ashe? ...Corvin Ashe. Deserter. Smuggler. Drunk. Still running?');
        await s.say('Corvin', 'Constantly. Just — not tonight, apparently.');
        await s.say('Corvin', 'Nobody\'s more surprised than me.');
      }
      await s.say('Garrick', 'Then come.');
      const r = await s.battle('boss_c4a_garrick', { bg: 'snow', mood: 'night' });
      if (r !== 'win') return;
      s.setFlag('c4a_garrick_beaten');
    }
    return C4M.bell(s);
  },

  async bell(s) {
    s.music('tension');
    await s.narrate('Garrick goes down on one knee in the snow. For a moment he only breathes. Then he laughs — a short, ugly bark.');
    if (has(s, 'bram')) await s.say('Garrick', 'Good. Kestrel. _Good._ Maybe Aldous didn\'t waste himself after all.');
    await s.say('Garrick', 'But you\'ve won a skirmish, children. I have forty more men on this mountain.');
    [[30, 10], [32, 10], [34, 10], [28, 11]].forEach(([x, y], i) => s.spawn(`ridge${i}`, 'vesper_soldier', x, y, 'left'));
    await s.pan(31, 11, 1.2);
    await s.narrate('Torches crest the ridge to the east — a line of them, then another. Grey cloaks, coming down.');
    s.stopMusic(0.5);
    await s.wait(0.8);
    s.sfx('holy');
    s.shake(0.2, 1.4);
    s.spawn('halvard_l', 'halvard', 19, 7, 'down');
    await s.pan(19, 6, 1.8);
    await s.narrate(['And above them all, in the tower, a bell begins to ring.', 'Not the little gate-bell. The great bell of Frosthollow, that has not been rung in two hundred years — because everyone on the mountain knows what happens when it is.']);
    await s.say('Garrick', '_(looking up)_ He wouldn\'t. The whole slope will—');
    await s.say('Halvard', 'WREN HALLOWAY! GET THEM INTO THE STAIR!');
    await s.say('Halvard', 'CHILDREN! SING THE MORNING HYMN, THE WHOLE WAY DOWN! LOUD! I\'LL BE LISTENING!');
    s.sfx('holy');
    s.shake(0.35, 2.0);
    await s.narrate('The bell rings again. The mountain answers — a sound deeper than thunder, from everywhere at once.');
    await s.follow(0.8);
    await s.say('Garrick', 'FALL BACK! _FALL BACK!_');
    s.move('garrick_l', [[26, 15], [37, 17]], 3.2);
    s.move('guard1', [[26, 14], [37, 16]], 3.4);
    s.move('guard2', [[26, 16], [37, 18]], 3.4);
    for (let i = 0; i < 4; i++) s.move(`ridge${i}`, [[37, 9 + i]], 3);
    await s.say('Wren', 'Halvard — _HALVARD!_');
    await s.narrate('Up in the tower, Halvard is still ringing the bell. From here he looks very small. He does not look afraid.');
    await Promise.all([s.move('player', [[3, 13]], 5), ...PARTY.map((id) => s.move(`${id}_c`, [[2 + (id.length % 3), 12 + (id.length % 3)]], 5))]);
    s.sfx('quake');
    s.shake(0.8, 3.0);
    await s.fadeOut(1.6, '#ffffff');
    await s.narrate(['White.', 'Then a roar like the end of the world.', 'Then nothing at all.']);
    ['garrick_l', 'guard1', 'guard2', 'halvard_l', 'ridge0', 'ridge1', 'ridge2', 'ridge3'].forEach((id) => s.remove(id));
    await s.wait(1.5);
    s.place('player', 9, 13, 'right');
    await s.fadeIn(2.2);
    await C4M.aftermath(s);
  },

  async aftermath(s) {
    await s.narrate(['When they dig their way out of the stair-mouth, the ledge is gone beneath a slope of new snow, smooth as a bedsheet. The ridge is empty. No torches. No grey cloaks.', 'Far down the mountain, small dark shapes are limping east. One of them is very large, and walks like a man who is used to giving orders.']);
    await s.pan(19, 6, 2);
    await s.narrate('Above, the bell tower stands half-buried, leaning a little to one side. The bell is silent.');
    await s.wait(1.0);
    await s.narrate('For a long moment, the Lantern\'s light flickers.');
    await s.wait(1.6);
    await s.narrate('...And holds.');
    await s.follow(1.2);
    s.music('sad');
    await s.say('Brother Tolle', 'Keeper?', { speed: 0.7 });
    await s.wait(1.0);
    await s.say('Brother Tolle', '_(quietly)_ Keeper Halvard?');
    await s.wait(1.6);
    await s.say('Ilse', '...He\'s not coming down. Is he.');
    await s.wait(1.4);
    s.stopMusic(2);
    await s.narrate('And then a voice, thin and wobbling and completely out of tune: Yrsa, who never speaks, singing the morning hymn.');
    await s.hop('kid_yrsa');
    await s.wait(0.6);
    s.music('kindling');
    await s.narrate('One by one, the other children join in. They are still terrible at it.');
    if (has(s, 'pip')) {
      await s.say('Pip', '_(roughly)_ He said loud.');
      await s.narrate('Pip sings. Badly. Loud.');
    }
    if (has(s, 'sable')) await s.say('Sable', 'He was singing too. While the snow came. I heard him.');
    if (has(s, 'bram')) {
      await s.say('Bram', 'I should have— if I\'d gone back up, if I\'d been faster, I could have—');
      if (has(s, 'corvin')) {
        await s.say('Corvin', 'Big lad. He rang that bell so you\'d be down here and not up there.');
        await s.say('Corvin', 'Don\'t you dare waste it.');
      }
    }
    await s.think('Wren', 'Garrick said the Hierophant sent him. Garrick is a liar. Garrick hates everyone.');
    await s.think('Wren', '...Halvard said the fork was tuned backward. I don\'t think Halvard ever lied about anything in his whole life.');
    await s.think('Wren', 'Cassian. What did you give me?');
    await s.wait(1.0);
    await s.say('Ilse', 'Three things.');
    await s.say('Ilse', 'One: Tolle takes the children down the eastern trail, then south to Saltglass. Tamsin will take them in.');
    await s.say('Ilse', 'Two: we warn the other Keepers. All of them. Before anyone in a grey cloak gets there first.');
    await s.wait(0.8);
    await s.say('Ilse', 'Three—', { speed: 0.6 });
    await s.wait(1.2);
    await s.say('Ilse', '...I don\'t have a three.');
    await s.say('Wren', 'Mirefen\'s closest. Mother Osk. Then Thornwood. Then Skyreach.');
    if (has(s, 'corvin')) {
      await s.say('Corvin', 'Mirefen. Swamps, leeches, and a Keeper older than dirt. My favorite.');
      await s.wait(0.8);
      await s.say('Corvin', 'Had a speech ready, you know. For the bottom of the mountain. "Been a pleasure, kids. The Halcyon calls." Very moving. There was a bit with a sunset.');
      await s.say('Corvin', '...Ah, hell. Somebody has to carry the little one.');
      await s.say('Wren', 'Corvin—');
      await s.say('Corvin', 'Don\'t. Don\'t make it a thing, sparrow. Walk.');
    }
    s.setFlag('c4a_done');
    s.journal('Brother Halvard rang the great bell of Frosthollow and brought the mountain down between Garrick\'s soldiers and us. Between them and the children. He didn\'t come down. The children sang the whole way, like he told them. Badly. Loud.');
    s.journal('Garrick said the Hierophant sent him. I don\'t believe it. I don\'t want to believe it. We\'re going to warn the other Keepers — Mother Osk in Mirefen first.');
    s.objective('Warn the remaining Keepers. Take the eastern road down to Mirefen and find Mother Osk.');
    await s.fadeOut(2.2);
    s.stopMusic(2);
    removeKids(s);
    s.remove('tolle_l');
    dismiss(s, PARTY);
    await s.card('The Pilgrim Road', 'Chapter 4 — continued', 2.8);
    await s.teleport('mirefen_road', 4, 20, 'right');
  },
};
