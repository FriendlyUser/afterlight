// CHAPTER 4b — "The Pilgrim Road" (II): Verdance.
// Rootholm, the Tangle, and Elowen — who was there the night Aurenne went dark.
import { stage, unstage, moveAll } from './ch4b_common.js';

const CHILDREN = ['c4b_wick', 'c4b_bryony', 'c4b_tamsel'];
const childrenFound = (s) => CHILDREN.filter((k) => s.flag(k)).length;

/** @type {import('../types/data').StoryScripts} */
export const C4V = {
  // ================================================================ Rootholm
  async arrival(s) {
    if (s.flag('c4b_verdance_arrived')) return;
    s.setFlag('c4b_verdance_arrived');
    const P = stage(s, {
      wren: [7, 27, 'right'], ilse: [6, 26, 'right'], bram: [5, 27, 'right'],
      sable: [6, 28, 'right'], pip: [8, 28, 'right'], corvin: [4, 26, 'right'],
    });
    await s.wait(0.5);
    await s.narrate('Verdance. The oldest forest in Solmere. The trees here were old when the Lanterns were new.');
    await s.say('Pip', 'Trees. Lots of trees. Do these ones talk? The Whisperwold ones talked.');
    await s.say('Corvin', 'These ones just judge you silently.');
    await s.say('Sable', 'The leaves are turning. It isn\'t autumn.');
    await s.say('Ilse', 'She\'s right. Look — half that oak is brown. In early summer.');
    s.spawn('bracken_a', 'c4b_bracken', 18, 20, 'left');
    await s.move('bracken_a', [[14, 23], [10, 26]], 1.8);
    await s.say('Elder Bracken', 'Travellers. In Rootholm we say: may your roots find water.');
    await s.say('Bram', 'And, ah — may yours?');
    await s.say('Elder Bracken', 'Close enough.');
    await s.say('Elder Bracken', 'You\'ve come for the Keeper. Everyone who comes to Rootholm has come for the Keeper. Lately, they come with swords.');
    await s.say('Wren', 'We\'ve come to warn her. Mother Osk sent us.');
    await s.say('Elder Bracken', 'Then you are a month too late, child.');
    await s.say('Elder Bracken', 'Soldiers came. White and gold, the Hierophant\'s sun on their shields. They went into the Thornwood, and they came out carrying the Keeper\'s light in a box.');
    await s.say('Elder Bracken', 'Since then the forest has closed its fist. Thorns where the paths were. And the Warden — the great tree that has guarded the grove for six hundred years — attacks anything that moves.');
    await s.say('Elder Bracken', 'Elowen has not come out. We do not know if she still lives.');
    await s.wait(0.6);
    await s.say('Elder Bracken', 'And two days ago, three of our children went into the Tangle to bring her bread.');
    await s.say('Elder Bracken', 'They have not come back either.');
    await s.say('Ilse', 'Three children. In there. For two days.');
    await s.say('Wren', 'We\'re going in anyway. We\'ll find them.');
    await s.say('Elder Bracken', 'Wick, Bryony and Tamsel. Wick is the one who never stops talking. Bryony is the one who never starts. Tamsel is the one who thinks he is in charge.');
    await s.say('Pip', 'I like Tamsel already.');
    s.remove('bracken_a');
    unstage(s, P, [7, 27, 'right']);
    s.quest('c4b_q_saplings', 'Lost Saplings', 'Three Rootholm children — Wick, Bryony and Tamsel — went into the Thornwood to bring Elowen bread. Find them.');
    s.objective('Enter the Thornwood (north of Rootholm) and find Elowen — and Rootholm\'s three lost children.');
    s.journal('Verdance. The soldiers took Elowen\'s light a month ago, and the forest has been dying ever since. Three kids went in after her with a loaf of bread. Of course they did.');
  },

  async bracken(s) {
    if (s.flag('c4b_saplings_done')) {
      return s.say('Elder Bracken', s.flag('c4b_elowen_done')
        ? ['The leaves on the old oak have stopped browning. The forest is holding its breath, I think, to see what you do.']
        : ['Rootholm owes you three children. That is a debt we do not know how to pay. We will think of something.']);
    }
    const n = childrenFound(s);
    if (n === 3) {
      s.setFlag('c4b_saplings_done');
      await s.say('Elder Bracken', 'All three. All three, home, with scratches and appetites and not a single apology between them.');
      await s.say('Elder Bracken', 'This was Elowen\'s, long ago. She gave it to Rootholm\'s first Elder. Moss grows on it in any season. So do wounds close, on whoever wears it.');
      await s.give('regen_bangle');
      s.quest('c4b_q_saplings', null, null, 'done');
      return;
    }
    return s.say('Elder Bracken', n
      ? [`${n} of three. Thank you. The Tangle is north, past Old Holm at the gate.`]
      : ['Wick, Bryony and Tamsel. The Tangle is north, past Old Holm at the gate. Bring them home, if you can.']);
  },

  async holm(s) {
    if (s.flag('c4b_hollowbark_beaten')) return s.say('Old Holm', ['The Warden\'s quiet. First time in a month I\'ve slept through the night.', 'I dreamt of nothing at all. It was wonderful.']);
    await s.say('Old Holm', ['Fifty years I\'ve kept this gate. Never had to close it.', 'Now the forest closes it for me. Thorns as thick as your arm, and they glow at night. Violet. Like the inside of a bruise.']);
  },

  async parent(s, who) {
    const LINES = {
      hazel: { flag: 'c4b_wick', name: 'Hazel',
        before: ['My Wick. He\'s nine. He talks so much I sometimes pray for a quiet minute.', 'I\'ve had two days of quiet now. I\'d give anything to have him talk my ear off.'],
        after: ['He\'s home. He hasn\'t stopped talking since. About you, mostly. And the big man. And the "spooky girl" — his words, sorry.', 'I have never been so glad to be deafened.'] },
      juniper: { flag: 'c4b_bryony', name: 'Juniper',
        before: ['Bryony doesn\'t speak much. Not since her gran died, in the spring.', 'She said the lights in the forest were Gran, come to visit. I told her not to be silly. I wish I hadn\'t.'],
        after: ['She told me what the Mender said. That it\'s all right to miss Gran even though the lights weren\'t her.', 'She told me in _words_. A whole sentence. Thank you.'] },
      rowan: { flag: 'c4b_tamsel', name: 'Rowan',
        before: ['Tamsel\'s thirteen. Thinks he\'s a man grown. He\'ll have marched the other two in there.', 'If you find him — tell him he\'s not in trouble. He is. But tell him he isn\'t.'],
        after: ['He came home and announced he is going to be a Warden and a Rogue. At the same time.', 'I told him that\'s not allowed. He said your small friend said it was. Is it?'] },
    }[who];
    return s.say(LINES.name, s.flag(LINES.flag) ? LINES.after : LINES.before);
  },

  async willa(s) {
    await s.say('Willa', ['This is the Memory Tree. When someone in Rootholm dies, we tie a ribbon on it with their name.', 'So the forest remembers them. And remembers them _right_ — not the way the dark does.']);
    if (!s.flag('c4b_ribbon')) await s.say('Willa', 'If you\'ve someone of your own to remember, there\'s ribbon in the basket. Anyone may tie one.');
  },

  async memoryTree(s) {
    if (s.flag('c4b_ribbon')) {
      return s.narrate('Hundreds of ribbons stir in the blossoming branches. Near the bottom, tied in a careful double knot, a grey one reads: _BROTHER HALVARD. FROSTHOLLOW._');
    }
    s.setFlag('c4b_ribbon');
    await s.narrate('Hundreds of ribbons hang from the blossoming tree, each one knotted around a name. They stir in a wind you can\'t feel.');
    await s.say('Bram', '...Could we? For Halvard?');
    await s.say('Wren', 'Yeah. Yeah, Bram. We should.');
    await s.narrate('Bram picks a grey ribbon from the basket. His hands are too big for the knot. He does it anyway, twice, until it holds.');
    await s.say('Bram', 'Brother Halvard. Frosthollow. He made terrible tea, and he was the bravest man I ever met.');
    await s.say('Wren', 'You\'re the bravest man I ever met.');
    await s.say('Bram', 'I\'m not. That\'s the point. He was, and he\'s — and I\'m still here.');
    await s.wait(0.6);
    await s.say('Sable', 'You are still here because he chose that you would be.');
    await s.say('Bram', '...Yes. I suppose that\'s right.');
    await s.say('Corvin', 'Then you\'d better make it worth his while, big man.');
    await s.say('Bram', 'I\'ll try. I\'ll — I\'ll try.');
    s.journal('We tied a ribbon for Halvard on Rootholm\'s Memory Tree. Bram did the knot. It took him three tries. Nobody helped, because he needed to do it himself.');
  },

  // ================================================================ the Tangle
  async tangleEnter(s) {
    await s.narrate('The Tangle. The trees have grown together overhead, and the light down here is green and very old. Here and there, between the roots, something violet glows.');
    await s.say('Sable', 'The roots taste wrong. Like the sea.');
    await s.say('Pip', 'You _tasted_ them?');
    await s.say('Sable', 'Not with my mouth.');
    await s.say('Pip', '...I\'m not gonna ask what with.');
  },

  async thorns(s, which) {
    if (which === 'thornA') {
      await s.narrate('A wall of thorns blocks the trail — each spine as long as a finger, black at the root, glowing violet at the tip.');
      await s.say('Wren', 'Okay. Stand back.');
      s.sfx('slash');
      s.shake(0.15, 0.3);
      await s.narrate('Wren\'s blade rings off the thorns like a bell. Bram\'s does the same. Corvin\'s shot vanishes into them without a sound.');
      await s.say('Corvin', 'Well, that\'s insulting.');
      await s.say('Ilse', 'They\'re not wood. They\'re Gloam. The dark, grown up through the roots where the light used to be.');
      await s.wait(0.6);
      await s.say('Sable', 'Let me try.');
      await s.narrate('Sable reaches out a hand. Before her fingers touch them, the thorns _flinch_ — curling back on themselves, withering, sinking into the earth like frightened things.');
      s.sfx('dark');
      s.clearBlocker('thornA');
      await s.wait(0.6);
      await s.say('Sable', '...They know me.');
      await s.say('Pip', 'Okay, that\'s creepy.');
      await s.say('Ilse', 'Pip.');
      await s.say('Pip', 'It\'s a _little_ creepy!');
      await s.say('Sable', 'It is a little creepy.');
      return;
    }
    if (which === 'thornB') {
      await s.narrate('More thorns. Sable stands in front of them for a long moment without lifting her hand.');
      await s.say('Sable', 'When I touch them, they go quiet. Like a dog that knows its master.');
      await s.say('Sable', 'Wren. What if I _am_ the master?');
      await s.say('Wren', 'Then you\'re a master who tells them to get out of the way. That\'s a good master.');
      await s.say('Sable', '...That is a very Wren answer.');
      await s.say('Wren', 'Thank you?');
      s.sfx('dark');
      s.clearBlocker('thornB');
      await s.narrate('The thorns shrink away from her hand, and the path opens.');
      return;
    }
    await s.narrate('The last of the thorns. Beyond them, something enormous creaks, like a ship at anchor.');
    await s.say('Sable', 'I am not afraid of them any more. I think they are afraid of me.');
    await s.say('Sable', 'I would rather they weren\'t. But I will use it.');
    s.sfx('dark');
    s.clearBlocker('thornC');
    await s.say('Ilse', 'Whatever\'s behind that — it\'s big. Let\'s rest at the Hearthstone first.');
  },

  async wick(s) {
    s.setFlag('c4b_wick');
    await s.say('Wick', 'Are you the Gloam? Mum says the Gloam has nice faces so it can trick you. You\'ve got nice faces. Not him.');
    await s.say('Corvin', 'Charming.');
    await s.say('Wick', 'I twisted my ankle and Tamsel said wait here and he\'d come back and he didn\'t, and Bryony went to find him, and she didn\'t either, and I\'ve been here since yesterday, and I ate all the bread, and I\'m sorry about the bread.');
    await s.say('Ilse', 'Let me see the ankle.');
    s.sfx('heal');
    await s.say('Ilse', 'Sprained. Not broken. You\'ll live.');
    await s.say('Wick', 'Will Mum let me live?');
    await s.say('Ilse', 'That\'s outside my expertise.');
    await s.say('Wick', 'I can walk. I can limp. I can limp _fast_. Thank you, Gloam-people!');
    await s.fadeOut(0.5);
    s.remove('wick');
    await s.fadeIn(0.5);
    await C4V.childFound(s);
  },

  async bryony(s) {
    await s.narrate('A small girl in a yellow ribbon sits between the roots, very still, watching the dark between the trees.');
    await s.say('Bryony', '...');
    await s.say('Ilse', 'Bryony? Your mother sent us. Are you hurt?');
    await s.say('Bryony', 'The lights. They\'re Gran. She came to see me.');
    s.music('tension');
    await s.narrate('Between the trees, soft golden lights are gathering — drifting closer, humming, warm as lamplight.');
    await s.say('Sable', 'They are not your gran. They are what is left of the Lantern\'s light. They are lost, and they are frightened, and they will hurt you.');
    const r = await s.battle('c4b_tw_lights', { bg: 'verdance' });
    if (r !== 'win') return;
    s.setFlag('c4b_bryony');
    s.music('forest');
    await s.say('Bryony', '...Not Gran?');
    await s.say('Ilse', 'No. I\'m sorry.');
    await s.wait(0.8);
    await s.say('Ilse', 'My grandmother\'s still alive. I left her on an island at the edge of the world without saying goodbye properly. I think about her every day.');
    await s.say('Ilse', 'It\'s all right to miss her, Bryony. Even if the lights weren\'t her. Missing her is how you keep her.');
    await s.say('Bryony', '...Okay.');
    await s.say('Bryony', 'I\'m going to go home now and tell Mum.');
    await s.fadeOut(0.5);
    s.remove('bryony');
    await s.fadeIn(0.5);
    await C4V.childFound(s);
  },

  async tamsel(s) {
    s.setFlag('c4b_tamsel');
    await s.say('Tamsel', 'Halt! Who goes there? I\'m armed.');
    await s.say('Corvin', 'That\'s a bread knife.');
    await s.say('Tamsel', 'It\'s _very_ sharp bread.');
    await s.say('Tamsel', 'I\'m not lost. I\'m scouting. The Keeper\'s grove is that way, and I\'m bringing her the last loaf, and I\'m not going home until I do.');
    await s.say('Pip', 'Kid. Listen.');
    await s.say('Pip', 'I\'m eleven. I\'ve got a Crest. I\'ve been in four dungeons and a sewer. You know what I learned?');
    await s.say('Tamsel', 'What?');
    await s.say('Pip', 'Being brave is dumb. Go home and eat the bread.');
    await s.say('Tamsel', '...You\'re eleven?');
    await s.say('Pip', 'And a half.');
    await s.say('Tamsel', 'And you\'ve got a _Crest_?');
    await s.say('Pip', 'Rogue. And when I\'m older I\'ll get another one. Maybe Warden, like the big guy. You can have more than one now. It\'s allowed.');
    await s.say('Bram', 'Is it allowed?');
    await s.say('Ilse', 'It\'s complicated.');
    await s.say('Tamsel', 'Fine. I\'ll go home. But you have to take the bread to the Keeper.');
    await s.say('Pip', 'Deal.');
    await s.fadeOut(0.5);
    s.remove('tamsel');
    await s.fadeIn(0.5);
    await s.say('Pip', '...Don\'t look at me like that. All of you. Stop it.');
    await C4V.childFound(s);
  },

  async childFound(s) {
    const n = childrenFound(s);
    s.toast(`<span class="hl">Lost Saplings</span> — ${n} of 3 found`);
    if (n === 3) s.objective('All three children are on their way home. Push on through the Thornwood to Elowen\'s grove.', true);
  },

  async hollowbark(s) {
    if (s.flag('c4b_hollowbark_beaten')) return;
    s.music('tension');
    await s.narrate('The glade ahead is ringed with dead trees. Then one of them takes a step.');
    s.shake(0.4, 1.0);
    await s.narrate('It is taller than the Lanternfall bell-tower. Its bark is split and bleeding sap; violet thorns grow out of the wounds. Two knots of amber light, high up, turn toward you.');
    await s.say('Bram', 'That\'s — that\'s the Warden. That\'s a _tree_.');
    await s.say('Corvin', 'That\'s a building that\'s angry.');
    await s.say('Sable', 'It is not angry. It is frightened. It has been fighting the dark for a month and nobody came to help.');
    await s.say('Wren', 'Then let\'s help it stop.');
    const r = await s.battle('c4b_boss_hollowbark', { bg: 'verdance' });
    if (r !== 'win') return;
    s.setFlag('c4b_hollowbark_beaten');
    s.music('forest');
    await s.narrate([
      'Hollowbark sways. The violet thorns crumble out of its wounds like ash.',
      'Somewhere beyond the glade, a voice — old as rain — says: _Hush, old friend. Hush. They are not the ones who took it._',
      'The great tree lowers itself, root by root, into the earth. Its amber eyes close. In a moment, it is only a tree, and the path north lies open.',
    ]);
    await s.say('Ilse', 'Did everyone hear that?');
    await s.say('Wren', 'Elowen.');
    s.objective('Go north into the Heartwood and meet Elowen.');
  },

  // ================================================================ the Heartwood
  async heartEnter(s) {
    if (!s.flag('c4b_elowen_story')) return C4V.elowenStory(s);
    if (s.flag('c4b_heart_night') && !s.flag('c4b_elowen_done')) return C4V.campfire(s);
    return null;
  },

  async elowenStory(s) {
    s.setFlag('c4b_elowen_story');
    s.stopMusic(1.5);
    const P = stage(s, {
      wren: [16, 22, 'up'], ilse: [15, 23, 'up'], bram: [17, 23, 'up'],
      sable: [16, 24, 'up'], pip: [14, 24, 'up'], corvin: [18, 24, 'up'],
    });
    s.spawn('elowen_s', 'elowen', 16, 10, 'down');
    await s.pan(16, 12, 0.1);
    await s.wait(0.8);
    await s.narrate([
      'The Thornwood opens like a held breath let go.',
      'Inside is a grove of very old trees, and in the middle of the grove, a Lantern. Roots have climbed its walls. Blossom grows inside its lamp. It is dark.',
      'At its foot sits a woman so old she looks less like a person than like a tree that has decided, for now, to be one.',
    ]);
    s.music('forest');
    await s.say('Elowen', 'You quieted my Warden. Thank you. He has been so frightened.');
    await s.say('Elowen', 'Come closer, children. My eyes are not what they were. Nothing is.');
    await s.follow(0.6);
    await moveAll(s, [
      [P.wren, [[16, 14]]], [P.ilse, [[15, 15], [15, 14]]], [P.bram, [[17, 15], [18, 14]]],
      [P.sable, [[16, 16], [16, 15]]], [P.pip, [[14, 16], [14, 15]]], [P.corvin, [[18, 16], [19, 15]]],
    ], 2.2);
    await s.pan(16, 12, 0.8);
    await s.say('Wren', 'Keeper Elowen? I\'m Wren Halloway, from Lanternfall. Mother Osk sent us.');
    await s.say('Elowen', 'Osk. Is she well?');
    await s.say('Wren', 'She is now. She says you still owe her a goose.');
    await s.narrate('Elowen laughs — a sound like wind moving through high branches.');
    await s.say('Elowen', 'Forty-one years she has been saying that. It was a very good goose.');
    await s.say('Elowen', 'Halloway. Ysolde\'s daughter. Yes. You have her—');
    await s.say('Wren', 'Chin. I know.');
    await s.say('Elowen', 'I was going to say "hurry." Your mother was always in a hurry too.');
    await s.wait(0.6);
    await s.say('Ilse', 'Keeper — your stone. Rootholm says soldiers took it.');
    await s.say('Elowen', 'A month ago. White and gold, the Hierophant\'s sun on their shields. They were very polite, and very many.');
    await s.say('Elowen', 'I told them no. I stood in front of my light, and a young man in armor picked me up like a bundle of kindling and set me down on that root, there. Gently. He apologized.');
    await s.say('Elowen', 'Then they went into my Lantern, and came out carrying the morning in a box.');
    await s.say('Bram', 'Garrick\'s men.');
    await s.wait(0.6);
    await s.say('Wren', 'Why? What does he want them for? Osk said you\'d know. She said you were in Aurenne the night the city went dark.');
    await s.say('Elowen', 'Osk talks too much. It is her finest quality.');
    await s.wait(1.2);
    await s.say('Elowen', 'Sit down. All of you. This is a story for sitting down.');

    // ---- the story
    await s.fadeOut(1.0);
    s.music('sad');
    s.place(P.wren, 15, 13, 'up'); s.place(P.ilse, 14, 14, 'up'); s.place(P.bram, 18, 14, 'up');
    s.place(P.sable, 17, 13, 'up'); s.place(P.pip, 16, 14, 'up'); s.place(P.corvin, 19, 13, 'up');
    await s.zoom(14, 0.1);
    await s.fadeIn(1.2);
    await s.say('Elowen', 'Forty years ago, at Midsummer, the Seven Keepers came to Aurenne for the Festival of Long Light. The longest day of the year. The whole city was bells and paper lanterns and honey-cake.');
    await s.say('Elowen', 'The Keeper of the Grand Lantern then was Aurelian Lorne. A proud man, and a tired one. He had a son, twelve years old, who never stopped asking questions.');
    await s.say('Elowen', 'And a daughter. Lysa. She was ten.');
    await s.wait(1.0);
    await s.say('Elowen', 'Lysa Lorne had a gap in her front teeth she could whistle through. She was afraid of geese. And she had decided — because of my hair — that I was a witch.');
    await s.say('Elowen', 'She brought me a crown of clover, to see if I would turn into a tree.');
    await s.say('Pip', 'Did you?');
    await s.say('Elowen', 'Not that day.');
    await s.wait(1.2);
    await s.say('Elowen', 'That night, after the sun went down, the Grand Lantern failed.');
    await s.say('Elowen', 'Not dimmed. _Failed._ For the first time in a thousand years. Nobody has ever known why.');
    s.flash('#1a1030', 1.2);
    await s.say('Elowen', 'And the Gloam came into Aurenne the way the tide comes into a cave. Through the streets. Up the stairs. Into the houses. Cold, and grey, and full of whispering.');
    await s.say('Elowen', 'Everything it touched, it _remembered_ — and took into itself.');
    await s.wait(0.8);
    await s.say('Elowen', 'Aurelian had a choice. He could hold the light with both hands — pour every scrap of himself into the lamp until it caught again. Or he could let it go, and run for his children.');
    await s.wait(1.5);
    await s.say('Elowen', 'He held the light.');
    await s.wait(1.0);
    await s.say('Elowen', 'Every Keeper in the city would have done the same. It is what we are taught. It is what I told him afterwards, when he could not stop shaking. _You saved a hundred thousand people, Aurelian._');
    await s.say('Wren', '...And his children?');
    await s.say('Elowen', 'Cassian was twelve. He had his sister by the hand when the dark came down the Street of Bells.');
    await s.wait(1.2);
    await s.say('Elowen', 'And then he didn\'t.', { speed: 0.6 });
    await s.wait(2.0);
    await s.say('Elowen', 'When the Lantern caught again, the Gloam drew back to the edge of the world, the way it does. And it took everything it had remembered with it.');
    await s.say('Elowen', 'Cassian stood at the end of that street until morning, calling her name. When the sun came up — when we sang it up, all seven of us, with our voices breaking — he was still calling.');
    await s.say('Elowen', 'I carried him home myself. He weighed nothing at all.');
    await s.wait(1.5);
    await s.say('Corvin', '_(very quietly)_ ...Cassian Lorne.');
    await s.say('Elowen', 'He never cried, that I saw. He only asked his father, every day for a year: _why did you choose the light?_');
    await s.say('Elowen', 'Aurelian never had an answer. He died with that question still sitting at his table.');
    await s.say('Elowen', 'And the boy grew up, and became the Hierophant, and the whole world loves him. And I think he has spent forty years writing his father an answer.');
    await s.say('Ilse', 'The stones. The forks.');
    await s.say('Elowen', 'A song, I think. Something only all seven Lanterns could sing at once.');
    await s.say('Elowen', 'The Gloam remembers everything it takes, child. Every face. Every voice. If you could reach into it with enough light — the light of seven Lanterns at once—');
    await s.say('Wren', 'You could bring someone back.');
    await s.wait(1.0);
    await s.say('Elowen', '...Or something wearing them.');
    await s.wait(2.0);

    // ---- Sable
    await s.say('Elowen', 'Come here, child. The quiet one. I have been looking at you since you walked into my grove, and I am much too old to pretend I haven\'t.');
    await s.move(P.sable, [[17, 12], [16, 11]], 1.4);
    s.face(P.sable, 'up');
    await s.wait(1.0);
    await s.narrate('The old Keeper lifts one hand, slow as a branch in still air, and touches Sable\'s cheek.');
    await s.say('Elowen', 'No gap in the teeth. But the rest...');
    await s.say('Elowen', 'The rest is exactly as I remember it.');
    await s.wait(2.0);
    s.stopMusic(2.0);
    await s.say('Sable', 'Am I her?', { speed: 0.6 });
    await s.wait(2.5);
    await s.say('Elowen', 'Lysa Lorne would be fifty years old this summer. She would have grey in her hair. Children, perhaps. And she would still be afraid of geese.');
    await s.say('Elowen', 'You are sixteen. And I think you will be sixteen for exactly as long as someone wants you to be.');
    await s.say('Sable', 'He made me.');
    await s.say('Elowen', 'Someone remembered her very hard, for a very long time, at the edge of the dark. And the dark is made of remembering.');
    await s.say('Sable', 'Then I am his memory of her.');
    await s.say('Sable', 'That is why the Lantern went black at my Kindling. That is why he called me Lysa.');
    await s.say('Sable', 'I am a copy of a girl who died. Made by a boy who could not stop calling.');
    s.face(P.wren, P.sable);
    await s.say('Wren', 'Sable—');
    await s.say('Sable', 'I do not whistle. I have never met a goose.', { speed: 0.8 });
    await s.wait(1.2);
    s.music('afterlight');
    await s.say('Elowen', 'No. You haven\'t.');
    await s.say('Elowen', 'Do you know what I think, child? I think a face is the very least of what a person is.');
    await s.say('Elowen', 'Lysa was not her face. She was the gap in her teeth and the clover and the geese. She was all the things she found out about herself, one at a time, for ten years. And then she stopped finding out.');
    await s.say('Elowen', 'You haven\'t stopped. You have hardly begun.');
    await s.say('Elowen', 'Tell me. What do you like, Sable?');
    await s.wait(1.5);
    await s.say('Sable', 'Bread. When it is warm.');
    await s.say('Sable', 'Rain. Cats. The way Pip lies.');
    await s.say('Pip', 'Hey—');
    await s.say('Sable', 'When Wren reads out loud and does all the voices wrong.');
    await s.say('Wren', '_(a laugh that is mostly something else)_ I do _not_—');
    await s.say('Elowen', 'Lysa never had a single one of those. They are yours.');
    await s.say('Elowen', 'You will have to find out the rest. Whether you can whistle. What you think of geese. That is what a person is, I think. Not a face. The finding out.');
    await s.wait(1.5);
    await s.say('Sable', 'I would like to be the one who finds out.');
    await s.say('Elowen', 'Then you will be.');
    await s.wait(0.8);
    await s.say('Elowen', 'I have something that belongs to her. Or to you. I am not sure which, and I think that is for you to decide.');
    await s.narrate('From between the pages of an old book, Elowen draws a flat brown circle of pressed clover, forty years dry.');
    await s.say('Elowen', 'She made it for me. To see if I would turn into a tree.');
    await s.give('c4b_clover_crown');
    await s.say('Sable', '...Did it work?');
    await s.say('Elowen', '_(smiling)_ Slowly.');
    await s.wait(1.5);

    // ---- Wren
    s.face(P.wren, 'up');
    await s.say('Wren', 'Keeper Elowen. If the Lanternfall light failed — if it were my mother, holding it—');
    await s.say('Wren', 'Would she choose the light too?');
    await s.wait(1.5);
    await s.say('Elowen', 'Every Keeper would. Your mother too, I expect.');
    await s.say('Elowen', 'It is the worst thing about us. And the best.');
    await s.wait(1.5);
    await s.say('Elowen', 'Mirefen\'s light is gone. Mine is gone. I would be very surprised if Saltglass and Frosthollow still have theirs. And the Grand Lantern was always his.');
    await s.say('Elowen', 'That leaves Skyreach, and Lanternfall.');
    await s.say('Elowen', 'Vasha keeps Skyreach. She will not listen to you — she listens to the wind, and to Cassian, and lately mostly to Cassian. But if Skyreach still has its stone, there is still time.');
    await s.say('Corvin', 'Skyreach. A rock floating over the Stormcrown. Nobody gets up there without wings.');
    await s.say('Elowen', 'I am told you have some, Captain.');
    await s.say('Corvin', '...Had.');
    await s.say('Corvin', 'The Halcyon should be on her cradle at Stormfoot by now, at the bottom of the Stormcrown. I paid a caravan every coin I had to haul her up out of the sand. She floats. She doesn\'t _climb_.');
    await s.say('Corvin', 'Charge her Saltglass with enough lightning, though, and she might fly. Once. Maybe.');
    await s.say('Pip', '"Maybe."');
    await s.say('Corvin', 'Maybe is a very respectable word in my profession, kid.');
    await s.say('Elowen', 'Rest tonight. The grove is safe, now that my Warden sleeps. In the morning, the forest will let you out the short way.');
    await s.fadeOut(1.5);
    s.remove('elowen_s');
    unstage(s, P);
    s.setFlag('c4b_heart_night');
    s.journal('Elowen told us about the night Aurenne went dark. Cassian had his little sister by the hand, and then he didn\'t. Sable has her face. Sable asked "Am I her?" and Elowen said: a person is the finding out. I keep thinking about the Keeper\'s choice. Every Keeper would choose the light. Mom too.');
    await s.teleport('c4b_heartwood', 11, 19, 'up');
  },

  async campfire(s) {
    if (s.flag('c4b_camp_done')) return;
    s.setFlag('c4b_camp_done');
    const P = stage(s, {
      wren: [10, 18, 'up'], ilse: [9, 17, 'right'], bram: [12, 16, 'down'],
      sable: [12, 18, 'up'], pip: [13, 17, 'left'], corvin: [10, 16, 'down'],
    });
    await s.pan(11, 17, 0.1);
    await s.wait(1.0);
    await s.narrate('Night in the Heartwood. Fireflies drift between the old trees. Someone has made a fire; nobody remembers who.');
    await s.say('Corvin', 'I owe that man my life. Twice, if you count the court-martial he talked them out of.');
    await s.say('Corvin', 'And I keep thinking — what would I do, if it were my little sister at the end of that street?');
    await s.say('Ilse', 'Not this.');
    await s.say('Corvin', 'No. Something stupider, probably. I\'m not as clever as he is.');
    await s.say('Bram', 'It\'s not about clever. Halvard died. Osk nearly died. Mirefen was rotting. Rootholm\'s trees are dying. That\'s what his answer costs.');
    await s.say('Corvin', '...Yeah. I know, big man. I know.');
    await s.wait(1.0);
    await s.move(P.pip, [[13, 18]], 1.5);
    s.face(P.pip, P.sable);
    await s.say('Pip', 'Hey. Sable.');
    await s.say('Pip', 'For what it\'s worth — I don\'t remember my mum\'s face either. So I made one up.');
    await s.say('Pip', 'She\'s got a gold tooth. She sings really badly. She\'s _very_ proud of me.');
    await s.say('Sable', 'Is that a joke?');
    await s.say('Pip', 'Half.');
    await s.say('Sable', 'Which half?');
    await s.say('Pip', 'Dunno. That\'s the thing about making it up. You get to pick.');
    await s.wait(1.2);
    await s.narrate('Sable makes a small sound. It takes everyone a moment to work out that it is a laugh.');
    await s.emote(P.pip, '!');
    await s.say('Pip', 'Did — did she just laugh? At _me_? I\'m hilarious. I always knew I was hilarious.');
    await s.say('Bram', 'You made her laugh, Pip.');
    await s.say('Pip', 'Shut up. It was an accident.');
    await s.wait(1.0);
    await s.fadeOut(1.0);
    s.place(P.ilse, 8, 19, 'up'); s.place(P.bram, 13, 20, 'up'); s.place(P.corvin, 7, 18, 'up');
    s.place(P.pip, 14, 19, 'up');
    await s.fadeIn(1.0);
    await s.narrate('Later. The others are asleep, or pretending.');
    s.face(P.sable, P.wren);
    await s.say('Sable', 'Wren. When you named me. Did you know?');
    await s.say('Wren', 'Know what?');
    await s.say('Sable', 'That I didn\'t have one. That there was nothing for me to remember.');
    await s.say('Wren', 'I just thought you looked like a Sable.');
    await s.wait(1.0);
    await s.say('Sable', 'I am going to keep it.');
    await s.say('Wren', 'The name?');
    await s.say('Sable', 'All of it.');
    await s.wait(1.5);
    await s.think('Wren', 'Every Keeper would choose the light. Mom too.');
    await s.think('Wren', 'Dad\'s boat went down in sight of the Lantern. I always wondered why she didn\'t—');
    await s.think('Wren', '...Go to sleep, Wren.');
    await s.fadeOut(2.0);
    s.setFlag('c4b_elowen_done');
    unstage(s, P);
    s.objective('Morning in the Heartwood. Speak with Elowen before you go.', true);
    await s.teleport('c4b_heartwood', 16, 13, 'up');
  },

  /** Morning, and later visits. */
  async elowen(s) {
    if (!s.flag('c4b_elowen_farewell')) {
      s.setFlag('c4b_elowen_farewell');
      await s.say('Elowen', 'Good morning, Ysolde\'s daughter. You slept badly. Good. It means you were listening.');
      await s.say('Elowen', 'Go to the Stormcrown. And Wren — when you see Cassian, and you will—');
      await s.say('Elowen', 'remember that he was a boy at the end of a street, calling.');
      await s.say('Elowen', 'It will not make him less dangerous. But it may make you less cruel. And you will need to be less cruel than he is, if you are going to win.');
      await s.say('Elowen', 'The forest will let you out to the west now. The short way.');
      if (s.flag('c4b_tamsel') && !s.flag('c4b_bread')) {
        s.setFlag('c4b_bread');
        await s.say('Pip', 'Oh — uh. Tamsel from Rootholm sent you this. It\'s bread. It\'s, uh. Mostly bread.');
        await s.say('Elowen', 'Tamsel. The one who thinks he is in charge.');
        await s.say('Elowen', 'Tell him the Keeper said it was the best bread she has ever eaten. And give him this, from me, for his trouble.');
        await s.give('power_fruit');
      }
      s.objective('Travel to Stormfoot, at the base of the Stormcrown, where the Halcyon waits. (West path out of the grove → world map.)');
      s.journal('Elowen said: remember that he was a boy at the end of a street, calling. It won\'t make him less dangerous. It might make me less cruel. Next: the Stormcrown, and the Halcyon, and Skyreach — if Vasha still has her stone.');
      return;
    }
    return s.say('Elowen', ['Go on, children. The Stormcrown is north and west of here — follow the thunder.', 'And tell Osk I have not forgotten the goose.']);
  },
};
