// CHAPTER 12 — "Evernoon" (part 2): the Noon Throne, the choice, the Evernoon ending,
// Vesper, the Afterlight, the epilogue and the credits.
//
// Scenes hop between maps; each hop ends a script and the next map's onEnter picks up
// the thread (guarded by flags), so every scene below is re-entrant from a map load.

import { PARTY, stageParty, clearParty } from './ch12.js';
import { MAPS } from '../data/maps/index.js';

const has = (s, id) => s.state.party.includes(id);
const ALL = ['wren', ...PARTY];
const ACT1_LOOKS = { wren: 'wren', ilse: 'ilse', bram: 'bram', sable: 'sable', pip: 'pip', corvin: 'corvin' };
const AFTER_LOOKS = { wren: 'c12_wren_after', ilse: 'c12_ilse_after', bram: 'c12_bram_after', sable: 'c12_sable_after', pip: 'c12_pip_after', corvin: 'c12_corvin_after' };
const POSTGAME = { mapId: 'halcyon_deck', x: 12, y: 8, dir: 'down' };

/** Remember everyone's look once, so the dream and the epilogue can borrow other faces. */
function rememberLooks(s) {
  if (s.vars.c12_looks) return;
  s.vars.c12_looks = Object.fromEntries(ALL.map((id) => [id, s.state.characters[id]?.lookId || id]));
}
function wearLooks(s, table) { for (const id of ALL) s.setLook(id, table[id]); }
function restoreLooks(s) { if (s.vars.c12_looks) wearLooks(s, s.vars.c12_looks); }

/** A black sheet under the dialogue layer: narration on black (the fader sits above dialogue). */
function curtain(s, on) {
  let el = s.ui.layers.dialog.querySelector('.c12-curtain');
  if (!on) { el?.remove(); return; }
  if (!el) {
    el = document.createElement('div');
    el.className = 'c12-curtain';
    el.style.cssText = 'position:absolute;inset:0;background:#000;';
    s.ui.layers.dialog.prepend(el);
  }
}
async function onBlack(s, fn) {
  await s.fadeOut(1.2);
  curtain(s, true);
  await s.fadeIn(0.01);
  await fn();
  await s.fadeOut(0.01);
  curtain(s, false);
}

const THRONE_SPOTS = [['ilse', 13, 15, 'up'], ['bram', 17, 15, 'up'], ['sable', 14, 16, 'up'], ['pip', 16, 16, 'up'], ['corvin', 18, 16, 'up']];

/** @type {import('../types/data').StoryScripts} */
export const C12F = {
  // =================================================================== THE NOON THRONE
  async throneEnter(s) {
    if (s.flag('c12_afterlight') && !s.flag('c12_farewell')) return C12F.farewell(s);
    if (s.flag('c12_refused') && !s.flag('c12_vesper_down')) return C12F.vesper(s);
    if (s.flag('c12_hierophant_down')) return;
    s.spawn('cassian', 'cassian', 15, 5, 'down');
    if (s.flag('c12_throne_enter')) return;
    s.setFlag('c12_throne_enter');
    await s.wait(0.4);
    await s.pan(15, 8, 2.0);
    await s.narrate([
      'The top of the Grand Lantern. There is no roof. There is only the sky — white, enormous — and in the middle of it, the sun.',
      'Not whole. Seven-tenths of it, cracked like an eggshell, held perfectly still by a song nobody can hear anymore.',
      'Beneath it, on the steps of a marble throne, a man in white sits with his hands folded, waiting. He has been waiting a long time. He does not seem to mind.',
    ]);
    await s.follow(1.0);
    s.objective('Face Cassian at the Noon Throne.');
  },

  async confront(s) {
    if (s.flag('c12_hierophant_down')) return;
    rememberLooks(s);
    s.music('cassian');
    s.place('player', 15, 14, 'up');
    stageParty(s, THRONE_SPOTS);
    if (!s.actor('cassian')) s.spawn('cassian', 'cassian', 15, 5, 'down');
    await s.move('cassian', [[15, 9]], 1.4);
    await s.say('Cassian', 'Wren. You came all the way up. I\'m so glad.');
    if (has(s, 'sable')) {
      await s.say('Cassian', 'And Sable. You look well. Taller, I think.');
      await s.say('Sable', 'Half an inch.');
      await s.say('Cassian', '_(smiling)_ So you have.');
    }
    await s.say('Cassian', 'Did you meet him? Down there? The boy?');
    await s.say('Wren', 'He said to tell you he\'s sorry he was eating honeycake.');
    await s.narrate('For one moment, the Hierophant\'s face does something complicated. Then it smooths over, like water.');
    await s.say('Cassian', '...He would say that. He always thought it was his fault. It took me years to understand it was our father\'s.');
    await s.say('Wren', 'It wasn\'t anyone\'s. That\'s the worst part. It wasn\'t anyone\'s fault, and it happened anyway.');
    await s.say('Cassian', 'Yes. That is the worst part. That is exactly why it must never happen again.');
    await s.say('Cassian', 'Give me the Shards, Wren. All seven. I can finish the Vespersong. The sun will stop — not shatter, this time; I know where I went wrong — and it will be noon forever, and no one will ever lose anyone again.');
    await s.say('Cassian', 'Your mother. Your father. Sir Aldous, Bram, whole and laughing. Every child in Kiteholm fed and warm and never one day older than they want to be.');
    await s.say('Ilse', 'And never better. Never different. Never anything.');
    await s.say('Cassian', 'Is different so precious? Look what different has done to all of you.');
    await s.say('Bram', 'Made us, mostly.');
    await s.say('Corvin', 'You pulled me out of a fire once, Cassian. I owed you everything. Still do.');
    await s.say('Corvin', 'Answer\'s still no.');
    await s.say('Pip', 'What they said. But ruder.');
    await s.say('Wren', 'We came here to put the sun back. Not to stop it.');
    await s.wait(1.0);
    await s.say('Cassian', 'Ah.');
    await s.say('Cassian', 'Then I\'m afraid I\'ll have to take them.');
    await s.narrate('He doesn\'t raise his voice. He never has. He simply opens his hands, and all the light on the throne leans toward him, like flowers toward a window.');
    let r = await s.battle('c12_boss_hierophant', { bg: 'evernoon' });
    if (r !== 'win') return;
    s.setFlag('c12_hierophant_down');
    s.music('tension');
    await s.narrate('Cassian goes down on one knee. His robes are scorched. His face is perfectly calm.');
    await s.say('Cassian', 'You\'ve grown so strong. All of you. I\'m proud of you. Truly.');
    await s.say('Cassian', 'But you\'ve misunderstood something, Wren. I never needed you to give them to me.');
    await s.say('Cassian', 'I only needed you to bring them here.');
    s.shake(0.4, 2.0);
    s.sfx('summon');
    await s.narrate('The satchel at Wren\'s hip tears open. The seven Shards rise out of reach — and fly to him.');
    await s.narrate('And the broken sun overhead, the one he has held still for a year, comes down to meet them.');
    await s.flash('#ffffff', 1.4);
    s.remove('cassian');
    await s.narrate('When you can see again, there is no man on the throne. There is a king made of noon.');
    await s.say('Cassian', '_(from everywhere at once, gentle as ever)_ There. Isn\'t it beautiful?', { portrait: false });
    await s.say('Wren', 'Everyone up. Everyone UP.');
    s.sfx('revive');
    s.heal();
    await s.narrate('Something warm moves through you — the Lanternkeeper\'s light, answering the sun. Your wounds close.');
    r = await s.battle('c12_boss_noon_king', { bg: 'evernoon' });
    if (r !== 'win') return;
    s.setFlag('c12_king_down');
    s.stopMusic(2);
    await s.narrate('The King comes apart. Shards spin out of it like sparks from a struck anvil — and stop. Hang in the air. Everything stops.');
    await s.narrate('The light goes white.');
    clearParty(s);
    await s.fadeOut(1.6, '#ffffff');
    wearLooks(s, { ...s.vars.c12_looks, wren: 'wren' });
    await s.teleport('c12_dream_house', 2, 3, 'down', { color: '#ffffff' });
  },

  // =================================================================== THE CHOICE
  async dream(s) {
    if (!s.flag('c12_king_down') || s.flag('c12_choice_made')) return;
    s.music('lanternfall');
    s.place('player', 2, 3, 'down');
    await s.wait(0.8);
    await s.say('Ysolde', 'Wren! The sun\'s been up for an hour!', { portrait: false });
    s.spawn('ysolde', 'ysolde', 4, 7, 'up');
    await s.move('ysolde', [[4, 5], [3, 5], [3, 4]]);
    s.face('player', 'down');
    await s.say('Ysolde', 'There you are. I was starting to think the gulls had carried you off.');
    await s.narrate('The house smells of salt and woodsmoke and the sea lavender that never flowers. Two plates on the table.');
    await s.say('Wren', '...Mom?');
    await s.say('Ysolde', 'Who else would it be? Tomorrow you stand in the Lantern\'s light. You could at least do it with your eyes open.');
    await s.think('Wren', 'Tomorrow. The Kindling. I\'m sixteen tomorrow. I\'m sixteen tomorrow.');
    await s.say('Ysolde', 'Chores first. Tobias needs his net. Then you can go and gawk at the harbor with everyone else — the Hierophant\'s ship comes in today.');
    await s.say('Cassian', 'She\'s real, Wren. As real as anything is. I kept everything — every word she ever said to you, every look. Memory is all any of us is made of, in the end.', { portrait: false });
    await s.say('Cassian', 'Stay. It\'s the day before your Kindling. Your mother is alive. Nana Brisa is stewing kelp. Bram is at the inn telling lies about a spoon.', { portrait: false });
    await s.say('Cassian', 'Nobody has fought. Nobody has left. Nobody ever will. Tomorrow never has to come.', { portrait: false });
    await s.say('Ysolde', 'Wren? You\'ve gone pale. Sit. I\'ll put the kettle on.');
    await s.narrate('It would be so easy. It would be the easiest thing in the world.');
    let pick = await s.choice(['Stay.', 'Wake up.'], { prompt: 'Cassian: "Stay, Wren."' });
    if (pick === 0) {
      await s.think('Wren', 'Stay. Here. Forever. With her.');
      pick = await s.choice(['Stay. Forever.', '...No.'], { prompt: 'Ysolde: "Wren?"' });
      if (pick === 0) return C12F.accept(s);
    }
    return C12F.refuse(s);
  },

  async accept(s) {
    s.setFlag('c12_choice_made');
    s.setFlag('c12_evernoon_ending');
    await s.say('Wren', '...Okay. I\'ll stay.');
    await s.say('Ysolde', 'Of course you\'ll stay, little bird. Where else would you go?');
    wearLooks(s, ACT1_LOOKS);
    await s.fadeOut(2.0, '#fff8e0');
    await s.teleport('c12_dream_village', 23, 17, 'down', { color: '#fff8e0' });
  },

  async refuse(s) {
    s.setFlag('c12_choice_made');
    s.setFlag('c12_refused');
    await s.say('Wren', '...No.');
    await s.say('Cassian', 'Wren—', { portrait: false });
    await s.say('Wren', 'Mom. I have to go.');
    await s.say('Ysolde', 'Go? Go where? It\'s the day before your Kindling, you can\'t—');
    await s.say('Wren', 'I know. I know what day it is. It was a good day. It was one of the best days.');
    await s.say('Wren', 'But tomorrow I stood in the light. And the day after that I left. And the day after that I did something terrible, and then I kept going.');
    await s.say('Wren', 'If I stay here, none of that happened. And I don\'t get to not have done it, Mom. I don\'t get to not have become... whoever this is.');
    await s.wait(1.4);
    await s.narrate('For a moment it isn\'t Cassian\'s memory of her. It is just her.');
    await s.say('Ysolde', '...There\'s my girl.');
    await s.say('Ysolde', 'Go on, then. Before I change my mind.');
    await s.say('Wren', 'I love you. I never said it enough. I was too busy being angry.');
    await s.say('Ysolde', 'I knew. Little bird, I always knew.');
    await s.say('Ysolde', 'Grow up well.', { speed: 0.6 });
    s.sfx('holy');
    await s.fadeOut(1.6, '#ffffff');
    s.remove('ysolde');
    restoreLooks(s);
    await s.teleport('c12_throne', 15, 14, 'up', { color: '#ffffff' });
  },

  // =================================================================== THE EVERNOON ENDING
  async evernoonEnding(s) {
    if (!s.flag('c12_evernoon_ending') || s.flag('c12_evernoon_seen')) return;
    s.setFlag('c12_evernoon_seen');
    s.music('lanternfall');
    const stage = () => {
      s.place('player', 23, 17, 'down');
      for (const [id, look, x, y, dir] of DREAM_CAST) s.spawn(id, look, x, y, dir);
    };
    stage();
    await s.wait(0.8);
    await s.narrate('The Kindling-eve festival. Lanterns strung between the houses. Nana Brisa\'s kelp stew. Tobias telling the one about the eel again.');
    await s.say('Bram', '—and THEN I said, "Not today, Gloam-beast!"');
    await s.say('Ilse', 'You fought it with a spoon, Bram.');
    await s.say('Bram', 'Tactically.');
    await s.say('Pip', 'Can I have more honeycake? Can I? I\'m eleven, I\'m growing.');
    await s.say('Corvin', 'Kid, you\'ve had six.');
    await s.say('Sable', 'Bread is warm. I did not know food could be warm.');
    await s.narrate('Sable says it the way she said it the very first time. Exactly the way.');
    await s.say('Lysa', 'Cass, can we stay up for the lanterns?');
    await s.say('Cassian', 'We can stay up forever.');
    await s.say('Ysolde', 'Happy Kindling Eve, little bird.');
    await s.say('Wren', 'Happy Kindling Eve, Mom.');
    await s.fadeOut(1.6, '#fff8e0');
    for (const [id] of DREAM_CAST) s.remove(id);
    await s.wait(0.8);
    stage();
    await s.fadeIn(1.0);
    await s.narrate('And then it was morning.');
    await s.say('Ysolde', 'Wren! The sun\'s been up for an hour!');
    await s.say('Bram', '—and THEN I said, "Not today, Gloam-beast!"');
    await s.say('Sable', 'Bread is warm. I did not know food could be warm.');
    await s.fadeOut(0.8, '#fff8e0');
    await s.fadeIn(0.5);
    await s.say('Ysolde', 'Wren! The sun\'s been up for an hour!', { speed: 1.6 });
    await s.say('Sable', 'Bread is warm. I did not know food could be warm.', { speed: 1.6 });
    await s.say('Ysolde', 'Happy Kindling Eve, little bird.', { speed: 1.6 });
    await s.fadeOut(0.4, '#fff8e0');
    await s.fadeIn(0.3);
    await s.say('Ysolde', 'Happy Kindling Eve, little bird.', { speed: 2.2 });
    s.stopMusic(3);
    await s.narrate([
      'Tomorrow never came. Nobody minded. Nobody ever would.',
      'It was beautiful. It was the most beautiful day in the world.',
      'It was the only one.',
    ]);
    await s.fadeOut(3.0, '#fff8e0');
    curtain(s, true);
    await s.fadeIn(0.01);
    await s.card('THE END?', 'Evernoon', 4.5);
    await s.fadeOut(0.5);
    curtain(s, false);
    await s.game.returnToTitle?.();
  },

  // =================================================================== VESPER
  async vesper(s) {
    if (s.flag('c12_vesper_down')) return;
    s.stopMusic(1);
    s.place('player', 15, 14, 'up');
    stageParty(s, THRONE_SPOTS);
    s.spawn('cassian', 'cassian', 15, 9, 'down');
    await s.wait(0.8);
    await s.narrate('The throne. The Shards hang in the air where the King came apart, turning slowly, like the hands of a clock.');
    await s.narrate('On the steps, a man in scorched white robes kneels where the King fell. Smaller than you remember. Greyer.');
    await s.say('Cassian', '_(barely a whisper)_ You said no.');
    await s.say('Cassian', 'To her. To her face. How could you— I couldn\'t. I never could. Not once in forty years.');
    await s.say('Wren', 'I know. That\'s why you built all this.');
    s.sfx('quake');
    s.shake(0.3, 2.0);
    await s.narrate('Overhead, the hanging Shards begin to tick.');
    await s.say('Cassian', 'No. No — wait — I\'m not singing it. I\'ve stopped. I\'ve stopped! I\'m not—');
    await s.say('Sable', 'It does not need you anymore. Listen.');
    await s.narrate('Tick. Tick. Tick. Every clock in Evernoon, all at once. The Vespersong has been sung so long it has learned to sing itself.');
    await s.narrate('The Shards lock together into a face. A clock with a sun for a dial and no numbers at all. Only noon, and noon, and noon.');
    s.music('finalboss');
    await s.say('Vesper', 'STAY.', { portrait: false, speed: 0.4 });
    await s.say('Bram', 'Oh, I REALLY don\'t like that.');
    await s.say('Corvin', 'Cassian. What is that.');
    await s.say('Cassian', '...Every good day I ever wanted to keep. All at once. It doesn\'t want anything else. It never will.');
    await s.say('Wren', 'Then we\'re done going back.');
    await s.say('Wren', 'Everyone — with me. One more time.');
    s.sfx('revive');
    s.heal();
    await s.narrate('Something warm moves in Wren\'s chest — her mother\'s light, her own now — and runs through all six of them like a struck chord.');
    const r = await s.battle('c12_boss_vesper', { bg: 'gloam' });
    if (r !== 'win') return;
    s.setFlag('c12_vesper_down');
    return C12F.afterlight(s);
  },

  async afterlight(s) {
    if (s.flag('c12_afterlight')) return;
    s.stopMusic(2);
    await s.narrate('Vesper stops.');
    await s.narrate('Not the way Evernoon stopped. The way a clock stops when it is finally, finally allowed to rest.');
    await s.narrate('The seven Shards drift down into the middle of the throne room. Warm. Dim. Waiting.');
    await s.say('Wren', 'Now. Put it back — put the sun back together!');
    s.sfx('holy');
    await s.narrate('The Shards rise. They turn. They try to fit, edge to edge, the way they were.');
    await s.wait(1.2);
    await s.narrate('They don\'t fit.');
    await s.say('Ilse', 'Wren... it doesn\'t go. The edges have changed. They\'ve been out in the world too long.');
    await s.say('Sable', 'It remembers being a sun. Remembering is not the same as being.');
    await s.say('Corvin', 'So that\'s it? We broke the world, and the pieces don\'t— that\'s IT?');
    await s.say('Pip', 'No. No no no, I did not climb all those stairs for "that\'s it"—');
    await s.think('Wren', 'The Dawnsong called the old sun home. The Vespersong tried to make it stay.');
    await s.think('Wren', 'Neither of them is ours.');
    await s.say('Wren', '...We don\'t put it back.');
    await s.say('Wren', 'We sing something new.');
    await s.say('Bram', 'I cannot sing. I want that on record. I have been asked to stop by three separate choirs.');
    await s.say('Wren', 'Sing anyway.');
    s.music('afterlight');
    await s.narrate('Wren starts. She doesn\'t know the song — nobody does; it hasn\'t been written yet. She sings the tide coming in at Lanternfall, and the smell of Nana Brisa\'s kitchen, and the sound her mother made when she laughed.');
    await s.narrate('Ilse comes in under her, careful and exact — the hum she makes when she\'s stitching a wound.');
    await s.narrate('Then Bram — terribly, loudly, completely off-key — and he does not stop.');
    await s.narrate('Pip, with a gutter-song from Aurenne whose words are definitely not for children.');
    await s.narrate('Corvin, an old Dawnguard marching tune, slowed down until it sounds like a lullaby.');
    await s.narrate('And Sable, who has no song of her own — so she sings all of theirs back to them, a little wrong, and entirely hers.');
    s.shake(0.25, 2.5);
    await s.flash('#ffd8e8', 1.2);
    await s.narrate('The seven Shards melt together. Not into the old sun. Into something smaller, and stranger, and the color of no light any of them has ever seen.');
    await s.narrate('It rises.');
    s.setFlag('c12_afterlight');
    clearParty(s);
    s.remove('cassian');
    await s.fadeOut(2.2, '#ffffff');
    await s.teleport('c12_throne', 15, 14, 'up', { color: '#ffffff' });
  },

  async farewell(s) {
    if (s.flag('c12_farewell')) return;
    s.music('afterlight');
    s.place('player', 15, 14, 'up');
    stageParty(s, THRONE_SPOTS);
    s.spawn('cassian', 'cassian', 15, 10, 'down');
    await s.wait(1.0);
    await s.narrate([
      'Evernoon is coming apart around them — gently, like frost in the morning. Marble turning to light. Bunting turning to birds.',
      'Overhead there is a dawn. Not gold. A color nobody has a name for yet.',
    ]);
    await s.say('Cassian', '...She was afraid of the dark.');
    await s.say('Cassian', 'She walked toward it because she was scared of it. I never told anyone that. I never told anyone anything true about her. Only that she was gone.');
    await s.narrate('And the Hierophant of Solmere, who has not raised his voice in forty years, puts his face in his hands and weeps like a boy of twelve.');
    if (has(s, 'sable')) {
      await s.narrate('Sable crosses the throne room and kneels beside him. After a moment, she takes his hand.');
      await s.move('p_sable', [[14, 14], [14, 11], [14, 10]], 1.6);
      s.face('p_sable', 'right');
      await s.say('Cassian', '...What is your name?');
      await s.say('Sable', 'Sable. Wren gave it to me. Because of my hair.');
      await s.say('Cassian', 'Sable.');
      await s.say('Cassian', 'It suits you.');
      await s.say('Cassian', 'Will you— I\'m sorry. I\'m so sorry. Will you stay? Just until—');
      await s.say('Sable', 'Yes.');
    }
    if (s.has('c12_first_atlas')) {
      await s.move('player', [[15, 11]], 2);
      await s.say('Wren', 'Cassian. This is hers. It was always hers.');
      await s.take('c12_first_atlas');
      await s.narrate('He opens it to the flyleaf. _For Lysa, who wants to know where the sun goes._');
      await s.say('Cassian', '...Now she\'ll know. Now we both will.');
      s.quest('c12_q_atlas', null, null, 'done');
      s.setFlag('c12_atlas_returned');
    }
    await s.narrate('He is fading at the edges, the way the city is. He doesn\'t seem to mind. He is looking up at the new dawn the way a child looks at a kite.');
    await s.say('Cassian', 'Wren. What will you call it?');
    await s.wait(1.0);
    await s.say('Wren', '...The Afterlight.');
    await s.say('Cassian', '_(smiling)_ Restless heart. Like hers.');
    s.sfx('holy');
    await s.flash('#ffffff', 1.6);
    s.remove('cassian');
    await s.narrate('When the light cleared, Sable\'s hand was empty. She kept it closed anyway, for a long while.');
    if (has(s, 'sable')) await s.say('Sable', 'He was smiling. Or crying. I think both.');
    await s.say('Ilse', 'That\'s usually how it goes.');
    s.setFlag('c12_farewell');
    await s.take('sun_shard', s.state.inventory.count('sun_shard'));
    s.journal('We didn\'t put the old sun back. We couldn\'t. We sang a new one instead. Cassian cried, finally. Sable held his hand until there was nothing left to hold.');
    clearParty(s);
    await onBlack(s, async () => {
      await s.narrate(['_Two summers later._']);
    });
    wearLooks(s, AFTER_LOOKS);
    await s.teleport('c12_epi_square', 18, 16, 'up');
  },

  // =================================================================== EPILOGUE
  async epiSquare(s) {
    if (!s.flag('c12_farewell') || s.flag('c12_epi_square')) return;
    s.setFlag('c12_epi_square');
    s.music('afterlight');
    s.place('player', 18, 16, 'up');
    for (const [id, look, x, y, dir] of SQUARE_CAST) s.spawn(id, look, x, y, dir);
    await s.wait(0.6);
    await s.narrate([
      '_The sun we made is smaller than the old one. It rises a little late and sets a little early, and it\'s the wrong color, and the sea came back wrong too — shallower, warmer, full of fish nobody has names for._',
      '_We\'re getting used to it. That\'s the thing about the world. It lets you get used to it._',
    ]);
    await s.pan(8, 10, 1.6);
    await s.say('Builder', 'Mind the beam! — and the other beam! — that\'s a different beam, Hesk!');
    await s.narrate('_Aurenne is rebuilding. Not the City of Bells. Fewer bells. More windows._');
    // The new Kindling
    await s.pan(18, 9, 1.4);
    await s.say('The Crestless Sage', 'Step up, child. No — don\'t close your eyes. That was the old way.');
    await s.move('kid_a', [[18, 9]], 1.6);
    s.sfx('holy');
    await s.flash('#ffe8f0', 0.6);
    await s.say('The Crestless Sage', 'Well? What does the light say?');
    await s.say('Mira', 'It says... Ranger? I think?');
    await s.say('The Crestless Sage', 'And what do *you* say?');
    await s.say('Mira', '...I want to be a Ranger. And a Cantor. And maybe a baker.');
    await s.say('The Crestless Sage', 'Then be all three. Badly at first. That\'s how everyone starts.');
    await s.narrate('_One Crest, one life, they used to say. Nobody says it anymore. The children don\'t even know it was ever a saying._');
    // Bram's yard
    await s.pan(29, 18, 1.6);
    await s.say('Bram', 'Lesson one! Feet apart. Weight low. Grip it like you\'re holding a bird — firm enough it can\'t fly off, soft enough you don\'t hurt it.');
    await s.say('Dov', 'Sir Bram, were you ever scared?');
    await s.say('Bram', 'Lesson two: yes.');
    await s.say('Bram', 'Lesson three: you will be scared too. Every time. That\'s allowed. That\'s not a crack in you. That\'s just what brave feels like from the inside.');
    await s.say('Nell', 'What\'s lesson four?');
    await s.say('Bram', 'Lesson four: do it anyway. And if you can\'t — run, and come back tomorrow, and try again. That\'s brave too. Nobody tells you that one.');
    await s.say('Dov', 'Are you scared of US?');
    await s.say('Bram', 'Constantly. You lot are terrifying. Again! From the top!');
    // Pip on the green
    await s.pan(6, 19, 1.6);
    await s.say('Tansy', 'Pip! Pip, you\'re IT!');
    await s.say('Pip', 'I\'m not playing. I\'m thirteen. I\'m practically a—');
    await s.say('Tansy', 'PIP\'S IT! PIP\'S IT!');
    await s.say('Pip', '...Okay, ONE round.');
    await Promise.all([s.move('pip_e', [[4, 19], [4, 21], [8, 21]], 4.5), s.move('kid_b', [[9, 18], [9, 22]], 4.2)]);
    await s.hop('pip_e');
    await s.narrate('_He played for three hours. He lost every round. He has never, in his whole life, been so happy to lose._');
    if (s.flag('c12_q_kite_done')) await s.narrate('_Later he flew a red kite over the rooftops, string wrapped twice round his wrist. It came down when he wanted it to. He says that\'s the best part._');
    await s.follow(1.0);
    await s.narrate('_And then I went to see Ilse._');
    await s.teleport('c12_epi_ward', 7, 9, 'up');
  },

  async epiWard(s) {
    if (!s.flag('c12_epi_square') || s.flag('c12_epi_ward')) return;
    s.setFlag('c12_epi_ward');
    s.music('afterlight');
    s.place('player', 7, 8, 'up');
    s.spawn('ilse_e', 'c12_ilse_after', 11, 4, 'up');
    s.spawn('sable_e', 'c12_sable_after', 12, 2, 'down');
    s.spawn('nurse1', 'villager_33', 3, 4, 'up');
    s.spawn('nurse2', 'villager_41', 6, 4, 'up');
    await s.wait(0.6);
    await s.narrate('_Ilse runs the Ember Hospital now. It has windows. Forty-two of them. She counted._');
    await s.say('Apprentice', 'Doctor Marrow! The burns in bed three—');
    s.face('ilse_e', 'left');
    await s.say('Ilse', 'Salve, clean linen, and tell him that if he picks at it again I will tie his hands to the bedposts. Kindly.');
    s.face('ilse_e', 'up');
    await s.say('Ilse', 'Hold still, Sable.');
    await s.narrate('Ilse lays a pencil flat on Sable\'s head and marks the doorframe. There are a lot of marks on that doorframe. They go up.');
    await s.say('Ilse', '...A quarter of an inch.');
    await s.say('Sable', 'A quarter.');
    await s.say('Ilse', 'Since spring.');
    await s.say('Sable', '_(quietly delighted)_ I am going to be enormous.');
    s.face('sable_e', 'player');
    await s.say('Sable', 'Wren. Look. I found a grey hair. One. Corvin says it is from worrying about Pip.');
    await s.say('Wren', 'Are you worried about Pip?');
    await s.say('Sable', 'Constantly. It is wonderful.');
    s.face('ilse_e', 'player');
    await s.say('Ilse', 'Three things. One: I\'m taking tomorrow off.');
    await s.say('Wren', 'You have never taken a day off in your life.');
    await s.say('Ilse', 'Two: I\'m not telling anyone where I\'m going. Three—');
    await s.wait(0.8);
    await s.say('Ilse', 'That\'s it. That\'s the list. Isn\'t it wonderful?');
    await s.say('Ilse', 'I\'m learning the fiddle. I\'m appalling. The patients have petitioned for me to stop.');
    await s.say('Ilse', 'I\'m not going to stop.');
    await s.narrate('_I didn\'t tell Ilse I was leaving. She knew anyway. She always knows._');
    await s.say('Ilse', 'You\'re going, aren\'t you.');
    await s.say('Wren', '...Tomorrow. From Lanternfall.');
    await s.say('Ilse', 'Good.');
    await s.wait(0.8);
    await s.say('Ilse', 'No. That\'s a lie. It isn\'t good, it\'s awful, and I\'m happy for you, and I\'ll be on that dock, and I\'ll cry, and if you tell anyone I\'ll put salt in your bandages.');
    await s.teleport('c12_epi_shore', 10, 4, 'up');
  },

  async epiShore(s) {
    if (!s.flag('c12_epi_ward') || s.flag('c12_epi_shore')) return;
    s.setFlag('c12_epi_shore');
    s.music('lanternfall');
    s.place('player', 10, 4, 'up');
    await s.wait(0.6);
    await s.narrate([
      '_Lanternfall came back down with the sea. Not all of it. Enough._',
      '_We rebuilt the house. We rebuilt the Lantern — smaller. It doesn\'t call the sun anymore. It just lights the way home._',
    ]);
    await s.say('Wren', 'Hi, Mom.');
    await s.say('Wren', 'I\'m going. Tomorrow. I wanted to tell you first.');
    await s.say('Wren', 'East. All the way east. Somebody has to find out what the new sun does when it gets there.');
    await s.say('Wren', '...I\'ll come back. The last Halloway who sailed east never came back, I know. But I\'m going to. Okay?');
    await s.narrate([
      '_The wind came up off the sea. It smelled of salt and lavender._',
      '_The sea lavender in Mom\'s old garden flowered that spring. First time ever. I\'ve decided to take that personally._',
    ]);
    await s.fadeOut(1.2);
    s.place('player', 20, 25, 'up');
    for (const [id, look, x, y, dir] of DOCK_CAST) s.spawn(id, look, x, y, dir);
    await s.fadeIn(1.0);
    await s.say('Corvin', 'Make way, make way — Captain Ashe and the Halcyon Irregulars, here to see off a Halloway—');
    await s.say('Tansy', 'Dad, is that her? Is that the Lanternkeeper?');
    await s.narrate('_Corvin froze. Every time one of them calls him that, he freezes, like a man who\'s been handed something precious and is terrified he\'ll drop it._');
    await s.say('Corvin', '...Yeah. That\'s her. Go on, say hello. Mind the edge.');
    await s.say('Corvin', 'Twenty-one kids, one ship, no money. Best odds I ever played, sparrow.');
    await s.say('Pip', 'He cried at the last Kindling. In front of EVERYBODY.');
    await s.say('Corvin', 'Allergies.');
    await s.say('Pip', 'To what?');
    await s.say('Corvin', 'Children.');
    await s.say('Bram', 'Have you got everything? Rope? Biscuits? A spare compass? I bought you a spare compass—');
    await s.say('Wren', 'Bram, I have Dad\'s.');
    await s.say('Bram', 'It points WEST. You are going EAST. That is the opposite of helpful!');
    await s.say('Wren', 'That\'s the point. It\'ll always show me the way home.');
    await s.say('Sable', 'Bring me something back. From the far side. Anything. A rock.');
    await s.say('Wren', 'A rock?');
    await s.say('Sable', 'A rock from somewhere I have never been. I will keep it until I am old.');
    await s.move('ilse_e', [[20, 24]], 2);
    await s.narrate('_Ilse didn\'t say anything. She just held on, hard, the way she did when we were six._');
    await s.say('Ilse', 'Write.');
    await s.say('Wren', 'Every week.');
    await s.say('Ilse', 'Every day.');
    await s.say('Wren', 'Ilse—');
    await s.say('Ilse', 'Every. Day.');
    await s.move('player', [[20, 26], [22, 26]], 1.6);
    s.face('player', 'up');
    s.music('afterlight');
    await s.narrate([
      '_I left the island the next morning. The thing I\'d wanted since I was nine._',
      '_I thought it would feel like escaping. It didn\'t. It felt like being sent._',
    ]);
    await s.pan(7, 4, 3.0);
    await s.narrate('_Behind me, the little Lantern on the bluff came on, though it was morning. Somebody — I know exactly who — was holding the light._');
    await onBlack(s, async () => {
      await s.wait(1.0);
      await s.narrate(['_The world ended on the day I came of age._', '_This is what we built after._'], { speed: 0.6 });
      await s.wait(0.8);
      await rollCredits(s);
    });
    for (const [id] of DOCK_CAST) s.remove(id);
    return C12F.gameClear(s);
  },

  async gameClear(s) {
    s.setFlag('gameClear');
    restoreLooks(s);
    s.heal();
    await s.fadeIn(0.6);
    s.objective('The Afterlight has risen. The world — and the Gloam beneath it — is still out there.');
    s.journal('The world ended on the day I came of age. This is what we built after.');
    const postgame = !!MAPS[POSTGAME.mapId];
    if (postgame) s.state.setLocation(POSTGAME.mapId, POSTGAME.x, POSTGAME.y, POSTGAME.dir, MAPS[POSTGAME.mapId].name);
    await s.system('Thank you for playing. Save your clear data — the journey continues aboard the Halcyon.');
    await s.saveMenu();
    const pick = postgame ? await s.choice(['Continue aboard the Halcyon', 'Return to title'], { prompt: 'Where to?' }) : 1;
    if (pick === 0) return s.teleport(POSTGAME.mapId, POSTGAME.x, POSTGAME.y, POSTGAME.dir);
    return s.game.returnToTitle?.();
  },
};

// ===================================================================== credits

const CREDITS = [
  ['big', 'AFTERLIGHT'],
  ['gap'],
  ['head', 'The Restless Heart'], ['line', 'Wren Halloway'],
  ['head', 'The Careful Hand'], ['line', 'Ilse Marrow'],
  ['head', 'The Frightened Shield'], ['line', 'Bram Kestrel'],
  ['head', 'The Girl from the Sea'], ['line', 'Sable'],
  ['head', 'The Gutter Prince'], ['line', 'Pipkin "Pip" Tallow'],
  ['head', 'The Runaway Captain'], ['line', 'Corvin Ashe'],
  ['gap'],
  ['head', 'The Hierophant'], ['line', 'Cassian Lorne'],
  ['head', 'His Sister'], ['line', 'Lysa Lorne'],
  ['gap'],
  ['head', 'Keepers of the Seven Lanterns'],
  ['line', 'Ysolde Halloway · Lanternfall'], ['line', 'Tamsin · Saltglass'], ['line', 'Brother Halvard · Frosthollow'],
  ['line', 'Mother Osk · Mirefen'], ['line', 'Elowen · Thornwood'], ['line', 'Ardent Vasha · Skyreach'], ['line', 'Aurel Lorne · Aurenne'],
  ['gap'],
  ['head', 'With'],
  ['line', 'Nana Brisa · Fisher Tobias · Old Fennick · the Crestless Sage'],
  ['line', 'Sister Mercy Vale · Lord-Commander Garrick Thorne · Sir Aldous Venn'],
  ['line', 'and everyone in Kiteholm, Port Gale, Thistledown and the City of Bells'],
  ['gap'],
  ['head', 'Made of'],
  ['line', 'Plain JavaScript, three.js, and a great deal of love'],
  ['line', 'Every sprite, sky and song drawn by code'],
  ['gap'],
  ['head', 'For'],
  ['line', 'everyone who was told who to be —'],
  ['line', 'and decided anyway.'],
  ['gap'], ['gap'],
  ['big', 'Thank you for playing.'],
];

function creditsHtml() {
  return CREDITS.map(([kind, text]) => {
    if (kind === 'gap') return '<div style="height:90px"></div>';
    if (kind === 'big') return `<div style="font-family:var(--font-title);font-size:52px;color:#fff4dc;letter-spacing:.1em;text-shadow:0 0 24px rgba(255,200,160,.4);margin:24px 0">${text}</div>`;
    if (kind === 'head') return `<div style="font-family:var(--font-caps);letter-spacing:.35em;color:var(--gold);font-size:16px;margin-top:26px">${text}</div>`;
    return `<div style="font-size:24px;margin-top:6px">${text}</div>`;
  }).join('');
}

/** Scrolling credits over black. Confirm speeds them up. */
async function rollCredits(s) {
  const root = document.createElement('div');
  root.style.cssText = 'position:absolute;inset:0;background:#000;overflow:hidden;pointer-events:none';
  const col = document.createElement('div');
  col.style.cssText = 'position:absolute;left:0;right:0;top:100%;text-align:center;color:#f4ead6;font-family:var(--font-body)';
  col.innerHTML = creditsHtml();
  root.appendChild(col);
  let fast = false;
  const widget = {
    el: root,
    handleInput: (input) => {
      if (input.pressed('confirm') || input.pressed('cancel')) { input.consumeAll(); fast = true; }
    },
  };
  s.ui.push(widget, 'top');
  await s.wait(0.1);
  const total = col.offsetHeight + root.offsetHeight;
  let y = 0;
  await new Promise((resolve) => {
    s.game.tasks.add((dt) => {
      y += dt * 55 * (fast ? 6 : 1);
      col.style.transform = `translateY(${-y}px)`;
      if (y >= total) { resolve(); return true; }
      return false;
    });
  });
  s.ui.remove(widget);
}

// ===================================================================== casts

/** @type {Array<[string, string, number, number, string]>} id, look, x, y, facing */
const DREAM_CAST = [
  ['d_ysolde', 'ysolde', 25, 16, 'left'], ['d_ilse', 'ilse', 21, 17, 'right'], ['d_bram', 'bram', 22, 19, 'up'],
  ['d_sable', 'sable', 24, 19, 'up'], ['d_pip', 'pip', 20, 18, 'right'], ['d_corvin', 'corvin', 26, 18, 'left'],
  ['d_nana', 'nana_brisa', 19, 16, 'right'], ['d_tobias', 'tobias', 27, 15, 'left'],
  ['d_cassian', 'cassian', 22, 14, 'down'], ['d_lysa', 'lysa', 23, 14, 'down'],
  ['d_folk1', 'villager_3', 20, 14, 'down'], ['d_folk2', 'villager_9', 26, 14, 'down'], ['d_folk3', 'villager_22', 18, 18, 'right'],
];

/** @type {Array<[string, string, number, number, string]>} id, look, x, y, facing */
const SQUARE_CAST = [
  ['sage', 'sage', 18, 8, 'down'], ['kid_a', 'c12_kid_a', 16, 11, 'up'], ['kid_x', 'villager_14', 20, 11, 'up'],
  ['builder1', 'villager_12', 4, 11, 'up'], ['builder2', 'villager_28', 31, 11, 'up'], ['builder3', 'villager_17', 9, 9, 'right'],
  ['bram_e', 'c12_bram_after', 29, 17, 'down'], ['kid_c', 'c12_kid_c', 28, 20, 'up'], ['kid_d', 'c12_kid_d', 30, 20, 'up'],
  ['pip_e', 'c12_pip_after', 6, 19, 'right'], ['kid_b', 'c12_kid_b', 8, 19, 'left'], ['kid_y', 'villager_45', 5, 21, 'up'],
];

/** @type {Array<[string, string, number, number, string]>} id, look, x, y, facing */
const DOCK_CAST = [
  ['ilse_e', 'c12_ilse_after', 19, 23, 'down'], ['bram_e', 'c12_bram_after', 21, 23, 'down'], ['sable_e', 'c12_sable_after', 20, 22, 'down'],
  ['pip_e', 'c12_pip_after', 19, 21, 'down'], ['corvin_e', 'c12_corvin_after', 21, 21, 'down'],
  ['kid_b', 'c12_kid_b', 20, 20, 'down'], ['kid_a', 'c12_kid_a', 19, 19, 'down'], ['kid_d', 'c12_kid_d', 21, 19, 'down'],
];
