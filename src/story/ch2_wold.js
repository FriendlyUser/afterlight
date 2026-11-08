// CHAPTER 2 — "The Wider World", part two: the Whisperwold.
// The trees speak with the voices of the dead. A ghost-child wants to play.
// The Hollow Mother keeps every voice, so that nothing ever has to end.

import { spawnParty, clearParty, pc, whisper } from './ch2_common.js';

/** Where Merry hides: the Ring of Stones, the Cradle Glade, the Drowned Hollow. */
/** @type {Array<[number, number, string]>} where Merry hides: x, y, facing */
export const MERRY_SPOTS = [[31, 18, 'left'], [11, 7, 'down'], [19, 32, 'left']];
const STONE_ORDER = ['cradle', 'wedding', 'grave'];

/** Update a side quest's journal text without a toast. */
function questNote(s, id, desc) {
  const q = s.state.vars.quests?.[id];
  if (q) q.desc = desc;
}

/** Merry's NPC definition at hiding spot k. */
export function merryDef(k) {
  const [x, y, dir] = MERRY_SPOTS[k];
  return { id: 'merry', name: 'Merry', look: 'merry', x, y, dir, noTurn: true, run: (s) => WOLD.merry(s) };
}

/** @type {import('../types/data').StoryScripts} */
export const WOLD = {

  // ------------------------------------------------------------------ Into the wold
  async enter(s) {
    if (s.flag('c2_wold_enter')) return;
    s.setFlag('c2_wold_enter');
    s.music('forest');
    spawnParty(s, { ilse: [2, 19, 'right'], bram: [2, 21, 'right'], sable: [1, 20, 'right'] });
    s.place('player', 3, 20, 'right');
    await s.wait(0.6);
    await s.narrate('The wind drops. The birds stop. In the hush beneath the old trees, something begins to whisper.');
    await whisper(s, '...is anyone there...');
    await whisper(s, '...so cold... why is it so cold...');
    await whisper(s, '...tell her I\'m sorry... tell her...');
    s.face(pc('bram'), 'left');
    await s.say('Bram', 'That\'s the wind. In the leaves. Wind-leaves. Very common, wind-leaves.');
    await s.say('Ilse', 'There isn\'t any wind, Bram.');
    await s.say('Wren', 'They\'re voices. Real voices. Coming out of the trees.');
    await s.wait(0.6);
    s.face(pc('sable'), 'up');
    await s.say('Sable', 'Yes. I can hear them very clearly.');
    await s.say('Sable', 'They are like the ones in the water.');
    s.face('player', pc('sable'));
    await s.say('Wren', 'The water?');
    await s.say('Sable', 'Before the rocks. Before Lanternfall. I was in the water, and the water was full of voices like these. All talking. None of them listening.');
    await s.say('Ilse', 'Sable... that\'s—');
    await s.say('Sable', 'It is all right. They cannot hurt you. They can only remember.');
    await s.say('Bram', 'Mags said don\'t answer them. So. Policy. Nobody answers the trees.');
    clearParty(s);
    s.objective('Find a way through the Whisperwold. (Mags said: don\'t answer the trees.)');
    s.journal('The Whisperwold. The trees talk with the voices of dead people. Sable says they\'re like the voices she heard in the sea, before she washed up. She wasn\'t scared. I was.');
  },

  /** Voices that speak as you walk past. */
  async passing(s, key) {
    switch (key) {
      case 'kettle':
        return whisper(s, '...I left the kettle on. I left the kettle on. I left the...');
      case 'father':
        await whisper(s, '...don\'t tell Father I broke it... please don\'t tell Father...');
        return s.say('Ilse', 'Somebody\'s been sorry about a broken cup for a very long time.');
      case 'morning':
        return whisper(s, '...is it morning yet? Mama, is it morning yet?...');
      case 'line':
        await whisper(s, 'Hold the line! Hold the— why aren\'t you holding the LINE—');
        await s.emote('player', '!');
        await s.say('Bram', '...Not now. Not here. Not now.', { speed: 0.8 });
        return s.say('Wren', 'Bram?');
      case 'boats':
        await whisper(s, '...the boats came back without him... the boats came back...');
        return s.think('Wren', 'Don\'t. Don\'t think about it. Walk.');
      default:
        return null;
    }
  },

  // ------------------------------------------------------------------ Trees that remember
  async cradleTree(s) {
    await s.narrate('A tree of violet glass and old bark. It hums, very softly, the way a mother hums with her mouth closed.');
    await whisper(s, 'Hush now, little one, the lantern\'s lit... the sea\'s asleep, and so must you...');
    if (s.flag('c2_cradle_heard')) return;
    s.setFlag('c2_cradle_heard');
    await s.say('Ilse', 'Nana used to sing that. Every night, until I was ten and told her I was too old for it.');
    await s.say('Wren', 'Every mother in Solmere sings that.');
    await s.say('Ilse', '...It\'s never sounded like _that_ before.');
  },

  async joryTree(s) {
    if (s.flag('c2_jory_heard')) return s.narrate('The tree by the black pond is quiet now. Just bark, and the sound of water.');
    await s.narrate('By the black pond, a crooked tree with a split like a grin. Something in it laughs — a wheezing, honking laugh, like a seal choking on a herring.');
    if (!s.flag('c2_odile_asked')) return whisper(s, '...is the lamp lit?... somebody tell me if the lamp is lit...');
    s.setFlag('c2_jory_heard');
    await s.say('Wren', '...Odile said a seal choking on a herring. Jory? Is that— are you Jory Fenn?');
    await whisper(s, '...Odie? Is that you, Odie? ...Is the lamp still lit?');
    await s.say('Wren', 'It\'s lit. She\'s kept it lit. Six years.');
    await whisper(s, '...six years... stupid girl... stupid, lovely girl...');
    await whisper(s, 'Tell her it was my knot. Not hers. I tied it. I was showing off. Tell her to sell the boat.');
    await whisper(s, 'Tell her to sleep.');
    await s.narrate('The laugh comes once more, fainter, and then the tree is only a tree.');
    await s.say('Bram', 'Mags said not to answer them.');
    await s.say('Wren', 'Mags didn\'t say anything about _delivering mail_.');
    questNote(s, 'c2_lamp', 'Jory\'s voice spoke by the black pond: the knot was his fault; Odile should sell the boat, and sleep. Tell Odile in Port Gale.');
    s.toast('<span class="hl">Quest updated</span> — The Lamp in the Window');
  },

  async edrinTree(s) {
    await s.narrate('A lone tree at the edge of the overlook, its violet leaves turned toward the far-off sea.');
    if (s.flag('c2_edrin_heard')) return whisper(s, '...west...');
    s.setFlag('c2_edrin_heard');
    await whisper(s, '...west. Always west...');
    await s.narrate('A man\'s voice. Warm, and tired, like someone talking in his sleep.');
    await s.wait(1.2);
    await s.think('Wren', 'My hand is on the compass. When did I put my hand on the compass?');
    await s.say('Wren', '...Dad?', { speed: 0.6 });
    await s.wait(1.5);
    await s.narrate('The tree says nothing more.');
    await s.say('Ilse', 'Wren?');
    await s.say('Wren', 'Nothing. It\'s nothing. I\'m okay.');
    await s.say('Sable', 'Wren. The voices do not know who they are. They only know what they said. Over and over.');
    await s.say('Wren', '...Yeah. Okay.');
    s.journal('A voice in the trees at the overlook said "west, always west." It\'s a common enough thing to say. It\'s a common enough thing to say.');
  },

  async lysaTree(s) {
    await s.narrate('A slender tree, pale as bone. Its voice is very young.');
    await whisper(s, 'Brother? ...Brother, I can\'t find the door. It\'s so dark.');
    await whisper(s, 'You said the bells would bring me home. You promised...');
    if (s.flag('c2_lysa_heard')) return;
    s.setFlag('c2_lysa_heard');
    await s.wait(0.8);
    await s.say('Sable', '...That one is looking for someone.');
    await s.say('Wren', 'Who?');
    await s.say('Sable', 'I do not know. But I wanted to answer her.');
    await s.say('Ilse', 'Answer what?');
    await s.wait(0.8);
    await s.say('Sable', '...I do not know that either.');
  },

  async cantorTree(s) {
    await whisper(s, 'I sang every day of my life until I was sixteen. Then the light said Warden...');
    await whisper(s, '...I never sang again.');
    if (s.flag('c2_cantor_heard')) return;
    s.setFlag('c2_cantor_heard');
    await s.say('Bram', '...I know a lot of Wardens like that.');
    await s.say('Wren', 'One Crest, one life.');
    await s.say('Ilse', 'It sounds different when a tree says it.');
  },

  async grandmotherTree(s) {
    await s.narrate('In the center of the ring of stones stands the oldest tree you have ever seen. It does not whisper. It roars — hundreds of voices at once, rising and falling like surf.');
    if (s.flag('c2_grand_heard')) return;
    s.setFlag('c2_grand_heard');
    await s.say('Sable', 'It is the same as the water.');
    await s.say('Sable', 'When I was in the sea — before — they were all around me, like this. Talking and talking. None of them could stop.');
    await s.say('Ilse', 'Sable... what _were_ you, in the sea?');
    await s.wait(0.8);
    await s.say('Sable', 'Listening.');
  },

  // ------------------------------------------------------------------ Merry (hide and seek)
  async merry(s) {
    const k = s.vars.c2_merry || 0;
    s.face('merry', 'player');
    // The Mother is already at rest: the next time Merry is found, she says goodbye here.
    if (k > 0 && s.flag('c2_mother_done')) return WOLD.merryLate(s);
    if (k === 0) {
      s.setFlag('c2_merry_met');
      await s.say('Merry', 'You\'re loud. Are you new? You don\'t look new. You look _alive_.');
      await s.say('Wren', '...Are you lost?');
      await s.say('Merry', 'No! I live here. Mother says. Mother says the wold keeps everybody safe, and nobody has to go home, and nobody ever has to grow up.');
      await s.say('Sable', 'Who is Mother?');
      await s.say('Merry', 'The Hollow Mother. She\'s the biggest tree. She holds all the voices so they don\'t get lost in the dark.');
      await s.say('Merry', 'Do you want to play? Nobody plays anymore. They only talk and talk and talk.');
      await s.say('Merry', 'Hide-and-seek! I hide, you seek. Count to ten! No peeking, Big Shiny Man.');
      await s.say('Bram', 'Big Shiny— I— One. Two. Three...');
      s.quest('c2_merry', 'Hide and Seek', 'A little girl named Merry is hiding somewhere in the Whisperwold. She wants to be found.');
    } else if (k === 1) {
      await s.say('Merry', 'Found me! This is where Mother sings. I like it here best.');
      await s.say('Merry', 'Again! Count again! Big Shiny Man counts too fast. Shawl Lady, you count.');
      await s.say('Sable', 'One. Two. Three. Four...');
    } else {
      return WOLD.merryAcorn(s);
    }
    s.vars.c2_merry = k + 1;
    s.remove('merry');
    s.sfx('blip');
    s.spawn('merry', 'merry', ...MERRY_SPOTS[k + 1], merryDef(k + 1));
  },

  async merryAcorn(s) {
    s.setFlag('c2_merry_found');
    s.vars.c2_merry = 3;
    await s.say('Merry', 'You found me three times. That means you\'re my friends. That\'s the rule.');
    await s.say('Merry', 'Friends get the acorn. It\'s the key to my secret place. Past the thorns, by the stones.');
    await s.give('c2_merry_acorn');
    await s.say('Merry', 'Don\'t tell Mother. She doesn\'t like me going there. She says it makes me sad.');
    await s.say('Ilse', 'Merry... how long have you lived in the wold?');
    await s.say('Merry', 'Since the summer!');
    await s.wait(0.6);
    await s.say('Merry', '...Which summer is it?', { speed: 0.7 });
    await s.wait(0.8);
    s.remove('merry');
    s.sfx('blip');
    await s.narrate('When you look again, there is no one by the pond. Only the smell of rain, and a child\'s laugh fading into the trees.');
    questNote(s, 'c2_merry', 'Merry gave you her acorn: the key to her "secret place", past the thorns south-east of the Ring of Stones.');
    s.toast('<span class="hl">Quest updated</span> — Hide and Seek');
  },

  /** Found after the Hollow Mother has fallen: the acorn, then goodbye where she hid. */
  async merryLate(s) {
    s.setFlag('c2_merry_found');
    s.vars.c2_merry = 3;
    await s.say('Merry', 'Found me! ...Did you hear it? It\'s so quiet now. Mother\'s gone quiet.');
    await s.say('Merry', 'You found me, so you\'re my friends. That\'s the rule. Friends get the acorn — it opens my secret place, past the thorns by the stones.');
    await s.give('c2_merry_acorn');
    await s.say('Merry', 'I don\'t think I need it anymore.');
    await WOLD.merryFarewell(s, 'merry');
  },

  async thorns(s) {
    if (!s.has('c2_merry_acorn')) return s.narrate('A wall of black thorns, thick as a man\'s wrist. Woven, almost. As if someone made it to keep something in — or keep you out.');
    await s.narrate('You hold up Merry\'s acorn. The thorns shiver, then curl away from it like fingers opening.');
    s.clearBlocker('thorns');
  },

  async merryGrave(s) {
    await s.narrate(['A small stone, green with moss, half-hidden in flowers that should not be blooming in autumn.', '*MERIBEL ASH. SEVEN SUMMERS.*', '*SHE WENT TO PLAY IN THE WOLD.*']);
    // Found three times only after the Mother fell (saves from before Merry said goodbye
    // where she hid): she comes to her own stone to say it.
    if (s.flag('c2_mother_done') && s.flag('c2_merry_found') && !s.flag('c2_merry_done')) {
      const p = s.actor('player');
      const [x, y] = [[48, 29], [47, 30], [47, 29], [49, 29]].find(([tx, ty]) => (tx !== p.tileX || ty !== p.tileY) && s.field.grid.walkable(tx, ty)) || [47, 30];
      s.spawn('merry', 'merry', x, y, 'down');
      s.sfx('blip');
      await s.say('Merry', 'You found my secret place. Nobody ever finds it. ...It\'s so quiet now. Mother\'s gone quiet.');
      return WOLD.merryFarewell(s, 'merry');
    }
    if (s.flag('c2_grave_seen')) return;
    s.setFlag('c2_grave_seen');
    await s.wait(0.8);
    await s.say('Ilse', 'The moss on this is— Wren, this stone is older than Nana.');
    await s.say('Sable', 'She does not know.');
    await s.say('Wren', 'Or she knows, and the Mother won\'t let her stop.');
    await s.say('Bram', 'That\'s worse. I don\'t like that that\'s worse.');
    questNote(s, 'c2_merry', 'Merry\'s secret place is her own grave. The Hollow Mother keeps her in the wold, playing the same summer forever.');
  },

  // ------------------------------------------------------------------ The Hollow: riddle & stones
  async riddle(s) {
    await s.narrate(['Old letters cut into a standing stone, half-swallowed by moss:', '*WE ARE BORN. WE ARE BOUND. WE ARE BURIED.*', '*SPEAK TO US IN THE ORDER OF A LIFE, AND THE WOLD WILL LET YOU PASS.*']);
    if (s.flag('c2_riddle_read')) return;
    s.setFlag('c2_riddle_read');
    await s.say('Ilse', 'Three stones somewhere ahead, then. Three voices. A cradle, a wedding, a grave.');
    await s.say('Wren', 'In that order. Okay. How hard can it be?');
    await s.say('Ilse', 'Don\'t _say_ that. Not in a haunted forest. Not out loud.');
    s.objective('Find the three Listening Stones and answer them in the order of a life.');
  },

  async stone(s, which) {
    const lines = {
      cradle: 'Hush now, little one, the lantern\'s lit... the sea\'s asleep, and so must you...',
      wedding: '...I\'m yours. Till the sun forgets to rise. Till the sun forgets to rise, I\'m yours...',
      grave: 'Lay him down where the light can find him. Lay him down facing west...',
    };
    await s.narrate('A standing stone, warm to the touch. Voices move inside it like fish under ice.');
    await whisper(s, lines[which]);
    if (s.flag('c2_roots_open')) return;
    const seq = s.vars.c2_stones || [];
    if (seq.includes(which)) return s.narrate('This voice has already been answered. It waits, patient as stone.');
    if (!(await s.confirm('Answer the voice?', 'Answer it', 'Only listen'))) return;
    if (STONE_ORDER[seq.length] !== which) {
      s.vars.c2_stones = [];
      s.shake(0.2, 0.6);
      await s.narrate('The voices tangle into a single shriek! Something cold pours out of the stone!');
      await s.battle('c2_shades', { bg: 'wold' });
      await s.say('Ilse', 'In the order of a _life_, Wren. You\'re born, you marry, you die. Usually.');
      return;
    }
    seq.push(which);
    s.vars.c2_stones = seq;
    s.sfx('holy');
    await s.narrate('The stone hums, low and warm, and falls quiet.');
    if (seq.length < STONE_ORDER.length) return;
    s.setFlag('c2_roots_open');
    await s.narrate('Far off, deep in the wold, something old and wooden groans — and moves.');
    s.clearBlocker('roots');
    s.objective('The roots have parted. Go deeper into the Hollow.');
  },

  // ------------------------------------------------------------------ The Hollow Mother
  async mother(s) {
    if (s.flag('c2_mother_done')) return;
    s.stopMusic(1);
    spawnParty(s, { ilse: [29, 7, 'right'], bram: [29, 9, 'right'], sable: [28, 8, 'right'] });
    s.place('player', 30, 8, 'right');
    await s.pan(35, 7, 1.4);
    await s.narrate(['At the heart of the wold stands a tree so old it has forgotten it is a tree.', 'Its trunk has split open like a cupped hand. Inside, hundreds of violet lights flicker and murmur. Voices. Every voice in the wood.']);
    s.music('tension');
    await s.say('The Hollow Mother', 'Hush. Hush, little ones. More travelers. More voices.');
    await s.say('The Hollow Mother', 'Stay. Stay with me. Out there, the days end. Out there, you grow old, and then you are forgotten.');
    await s.say('The Hollow Mother', 'In here, no one is forgotten. In here, nothing ever has to end.');
    await s.say('Wren', 'Nothing ends because you won\'t _let_ it! They\'re not resting. They\'re stuck — saying the same thing over and over, forever!');
    await s.say('The Hollow Mother', 'Home is cold. Home is gone. I keep them warm.');
    await s.wait(0.6);
    await s.say('The Hollow Mother', '...You. Child of the deep water.');
    s.face(pc('sable'), 'right');
    await s.say('The Hollow Mother', 'I know your voice. You are made of the same dark as my little ones. You are one of mine. Come home.');
    await s.wait(1.0);
    await s.say('Sable', 'I am not yours.');
    await s.say('Sable', 'I do not know whose I am. But I am not yours.');
    await s.say('Bram', 'You heard her! Everybody behind me!');
    await s.say('Bram', '...Behind me and slightly to the left. Where I can see you. For morale.');
    await s.say('The Hollow Mother', 'Then I will keep you all. Forever. And ever. And ever.');
    await s.follow(0.5);
    clearParty(s);
    const r = await s.battle('boss_c2_hollow_mother', { bg: 'wold' });
    if (r !== 'win') return;
    s.setFlag('c2_mother_done');
    await WOLD.motherAfter(s);
  },

  async motherAfter(s) {
    s.music('sad');
    spawnParty(s, { ilse: [29, 7, 'right'], bram: [29, 9, 'right'], sable: [31, 8, 'right'] });
    s.place('player', 30, 8, 'right');
    await s.pan(35, 7, 1.0);
    s.flash('#d8b0ff', 0.8);
    await s.narrate('The lights rise out of the split trunk — tens, then hundreds — and drift upward through the branches like sparks from a fire. Like fireflies, leaving a jar.');
    await s.say('The Hollow Mother', '...so many... so many mornings I kept from them...', { speed: 0.7 });
    await s.say('The Hollow Mother', '...is it morning... out there?', { speed: 0.6 });
    await s.say('Sable', 'Yes.');
    await s.say('The Hollow Mother', '...Then go. Go, and be... unfinished...', { speed: 0.5 });
    await s.narrate('And then she is only a tree: very old, very tired, and quiet at last.');
    await s.wait(0.6);
    await s.say('Ilse', 'She wasn\'t cruel.');
    await s.say('Sable', 'She was afraid of the morning.');
    await s.say('Ilse', 'Is there a difference?');
    await s.wait(0.8);
    await s.say('Sable', '...I do not know yet.');
    s.clearBlocker('exit_roots');
    if (s.flag('c2_merry_found')) await WOLD.merryFarewell(s);
    await s.follow(0.6);
    clearParty(s);
    s.music('forest');
    s.objective('Leave the Whisperwold by the eastern path. Thistledown lies beyond.');
    s.journal('We fought the Hollow Mother, the tree that kept every voice in the wold. When she fell, the voices went up like sparks. She asked if it was morning. Sable told her yes.');
  },

  /** Merry goes home: after the Mother's fall (spawned by the tree), or where she hid (`id`). */
  async merryFarewell(s, id = null) {
    s.setFlag('c2_merry_done');
    const who = id || 'merry_end';
    if (!id) {
      s.spawn('merry_end', 'merry', 34, 10, 'up');
      await s.wait(0.6);
      await s.say('Merry', 'It\'s so quiet. Mother\'s gone quiet.');
    }
    s.face(who, 'player');
    await s.say('Merry', 'I think... I think I can go home now. Is it still summer, out there?');
    await s.wait(0.8);
    await s.say('Wren', '...It\'s autumn, Merry.');
    await s.say('Merry', 'Oh.');
    await s.say('Merry', 'I always liked autumn better anyway. The leaves go all colors, like they can\'t decide what to be.');
    await s.say('Merry', 'Here. My bracelet. Mother made it out of moss. It keeps you warm when you\'re hurt. I won\'t need it where I\'m going.');
    await s.give('regen_bangle');
    await s.say('Merry', 'Bye, Big Shiny Man. Bye, Grumpy— I mean, bye, Ilse. Bye, Wren.');
    if (!id) s.face('merry_end', pc('sable')); // the party is on stage only after the Mother
    await s.say('Merry', 'Bye, Sable. Don\'t let anybody keep you.');
    s.flash('#ffffff', 0.6);
    s.remove(who);
    await s.narrate('She goes the way the lights went: up, and out, and gone.');
    await s.say('Bram', 'I\'m not crying. It\'s the— wind-leaves.');
    await s.say('Ilse', 'There\'s no wind, Bram.');
    await s.say('Bram', 'I KNOW there\'s no wind, Ilse.');
    s.quest('c2_merry', null, null, 'done');
  },
};
