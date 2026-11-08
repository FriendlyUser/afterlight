// CHAPTER 10 — "Lysa"
// The Noon Spire on the greatest Sun Shard. Inside it, Evernoon: Aurenne frozen
// on the afternoon before Lysa Lorne was lost. Sable, half-dissolved into her,
// chooses her own name. Cassian offers everyone their dead. Then, escape.

import { kitOut } from './ch9.js';

const LOOKS = { ilse: 'ilse_ruin', bram: 'bram_ruin', pip: 'pip_ruin', corvin: 'corvin', sable: 'sable' };

/** Spawn walking party members at given tiles (only those in the party). */
function crowd(s, spots) {
  for (const [id, [x, y, dir]] of Object.entries(spots)) {
    if (!s.state.party.includes(id)) continue;
    s.spawn(`${id}_10`, LOOKS[id], x, y, dir);
  }
}
function uncrowd(s) { for (const id of Object.keys(LOOKS)) s.remove(`${id}_10`); }

/** A frame of flicker: an actor half-there, half-memory. */
async function flicker(s, id, times = 3) {
  for (let i = 0; i < times; i++) {
    s.show(id, false);
    await s.wait(0.08);
    s.show(id, true);
    await s.wait(0.12);
  }
}

/** Evernoon's puppets repeat themselves. Exactly. Forever. */
export function puppet(name, line, reactions = [], glitch = null) {
  return async (s, actor) => {
    const key = `c10_puppet_${actor?.def?.id || name}`;
    const n = (s.vars[key] = (s.vars[key] || 0) + 1);
    if (s.flag('c10_escape')) return s.narrate(`${name} has stopped mid-word. The smile is still there. Nothing behind it is.`);
    if (n >= 3 && glitch) return s.say(name, glitch);
    await s.say(name, line);
    if (n === 2 && reactions.length) {
      for (const [who, text] of reactions) if (who === 'Wren' || s.state.party.includes(who.toLowerCase())) await s.say(who, text);
    }
  };
}

/** @type {import('../types/data').StoryScripts} */
export const CH10 = {
  // ------------------------------------------------------------------ landing on the shard
  async landing(s) {
    if (s.flag('c10_landed')) return;
    s.setFlag('c10_landed');
    s.music('cassian');
    crowd(s, { ilse: [14, 41, 'up'], bram: [16, 41, 'up'], pip: [15, 42, 'up'], corvin: [17, 40, 'up'] });
    await s.wait(0.6);
    await s.narrate([
      'The Noon Spire stands on the greatest shard of the broken sun.',
      'The shard is warm underfoot, like a stone that has lain all day in a summer field. Light comes up through it. Everything casts its shadow upward.',
    ]);
    await s.say('Mags', '_(from somewhere far above)_ I\'ll keep her circling! If you\'re not back by the Long Bell I\'m coming in after you, and I WILL scratch the paint!', { portrait: false });
    await s.say('Corvin', 'She means it about the paint.');
    await s.say('Corvin', 'Huh. Always wanted to see the sun up close. Thought it\'d be bigger.');
    await s.say('Pip', 'It\'s the *biggest piece*.');
    await s.say('Corvin', 'Like I said.');
    await s.say('Ilse', 'It\'s warm. The ground is warm. Nothing\'s been warm for a year.');
    await s.say('Bram', 'It\'s like standing on a stove that loves you.');
    await s.pan(17, 4, 2.0);
    await s.narrate('And above it all, the Spire: white and gold, too tall and too clean. Around its top hangs a circle of blue sky, like a halo — the only blue sky left anywhere in the world.');
    await s.say('Wren', 'She\'s in there.');
    await s.pan(17, 29, 1.4);
    await s.narrate('Halfway up the shard there are tents. Dozens of people sit among them, waiting, every face turned toward the Spire like flowers toward a window.');
    await s.say('Pip', 'So\'s everybody else, looks like.');
    await s.follow(1.2);
    uncrowd(s);
    s.objective('Climb the shard to the Noon Spire and find a way inside.');
    s.journal('The Noon Spire. The ground is warm. Around the top of the tower the sky is blue — the only blue sky left anywhere. Sable is inside. So are a lot of people\'s dead, they say.');
  },

  async supply(s) {
    await s.say('Mags', '_(down the rope)_ Supply line\'s open! Shout what you want and I\'ll lower it. Prices are Odessa\'s. I learned from the best.', { portrait: false });
    await s.shop('halcyon');
  },

  /** The Choir guards the supply lift on the east side of the plaza. */
  async liftGuards(s) {
    if (s.flag('c10_lift_cleared')) return;
    crowd(s, { corvin: [26, 8, 'up'] });
    await s.say('Vesper Lift-Warden', 'Halt. The Spire receives no visitors. The gate will open when the Hierophant\'s work is done, and not one Bell sooner.');
    await s.say('Corvin', 'We\'re not visitors. We\'re the garbage. Every fortress has a back door, sparrow — usually it\'s where they take the garbage out.');
    await s.say('Vesper Lift-Warden', '...Seize them.');
    uncrowd(s);
    const r = await s.battle('c10_lift_guards', { bg: 'temple' });
    if (r !== 'win') return;
    s.setFlag('c10_lift_cleared');
    await s.narrate('The supply lift waits on its chain, a wooden cage stacked with crates of honey, linen and paper lanterns.');
    s.objective('Ride the supply lift into the Spire.');
  },

  // ------------------------------------------------------------------ the Spire Halls
  async hallsArrive(s) {
    if (s.flag('c10_escape')) return CH10.escapeHalls(s);
    if (s.flag('c10_halls')) return;
    s.setFlag('c10_halls');
    s.music('cassian');
    crowd(s, { ilse: [19, 36, 'up'], bram: [21, 36, 'up'], pip: [18, 37, 'up'], corvin: [22, 37, 'up'] });
    await s.wait(0.5);
    await s.narrate('Inside, the Spire is cool and white and full of clocks. Clocks on every wall, in every niche, ten thousand faces. Every one of them has stopped at noon.');
    await s.say('Corvin', 'Somebody really likes noon.');
    await s.say('Ilse', 'Listen.');
    await s.wait(1.0);
    await s.narrate('Under the silence, faint, from three directions at once: tick. Tick. Tick.');
    await s.say('Ilse', 'Three of them are still going. West, east, and up in the gallery.');
    await s.say('Bram', 'And the big door at the end won\'t open. Let me guess.');
    await s.say('Ilse', 'To get to her, we stop the last three clocks. We help him stop time.');
    await s.wait(0.8);
    await s.say('Wren', '...Then we stop them.');
    uncrowd(s);
    s.objective('Find the three clocks that still tick (west wing, east wing, north-west gallery) and stop them at noon.');
    s.journal('The Spire is full of clocks, all stopped at noon. Three are still ticking. To reach Sable, we have to stop them ourselves.');
  },

  async clock(s, which) {
    const key = `c10_clock_${which}`;
    if (s.flag(key)) return s.narrate('Both hands point straight up. The clock is silent.');
    await s.narrate('A great clock, taller than Bram, its face painted with a summer sky. Its hands are moving — and as you watch, the painted sky dissolves, and the face becomes a window.');
    await CH10[`echo_${which}`](s);
    if (!(await s.confirm('Stop the hands at noon?', 'Stop them', 'Not yet'))) return;
    s.setFlag(key);
    s.sfx('debuff');
    await s.narrate('You push the hands up until they meet. The clock stops. Somewhere far above, something settles, like a held breath getting easier to hold.');
    const n = ['west', 'east', 'gallery'].filter((w) => s.flag(`c10_clock_${w}`)).length;
    if (n === 3) {
      s.clearBlocker('dais_seal');
      s.shake(0.3, 1.2);
      await s.narrate('All three clocks are still. At the end of the nave, the seal on the dais stairs melts away like frost — and something on the dais stirs.');
      s.objective('The dais is open. Approach the Noon Gate.');
    } else {
      await s.system(`Clocks stopped: ${n} of 3.`);
    }
  },

  async echo_west(s) {
    s.spawn('keeper_e', 'c10_keeper_lorne', 6, 26, 'down');
    s.spawn('boy_e', 'cassian_young', 5, 27, 'right');
    s.music('sad');
    await s.say('Young Cassian', 'Father! Lysa\'s still outside — she went to the bridge to see the fireworks, she\'s still *out there*—');
    await s.say('Keeper Lorne', 'The Lantern first, Cassian. If the light fails tonight, the whole city goes dark.');
    await s.say('Young Cassian', 'Then let it! Let it go dark! She\'s *out there*!');
    await s.say('Keeper Lorne', 'One child. Or ten thousand. You will understand one day. I pray you never have to.');
    await s.say('Young Cassian', 'She isn\'t *one child*. She\'s *Lysa*.');
    await s.wait(1.0);
    await s.say('Keeper Lorne', '...Hold the light steady, son.');
    s.remove('keeper_e'); s.remove('boy_e');
    await s.narrate('The window goes dark. The clock ticks on.');
    s.music('cassian');
    await s.say('Ilse', 'His father chose the Lantern.');
    await s.say('Wren', 'And Cassian\'s been choosing her ever since.');
  },

  async echo_east(s) {
    s.spawn('composer_e', 'cassian', 35, 27, 'down');
    s.music('sad');
    await s.narrate('A younger man, already grey at the temples, at a desk heaped with music. Night outside. A single candle.');
    await s.say('Cassian', 'Forward, the Dawnsong calls the sun up. Backward...');
    await s.say('Cassian', 'Backward, it might hold it still. Just one afternoon. Just one.');
    await s.narrate('He writes. Crosses it out. Writes again.');
    await s.say('Cassian', 'Forgive me, Father. I am going to save the wrong thing too.');
    s.remove('composer_e');
    s.music('cassian');
    await s.say('Corvin', 'He knew. Even then. He knew it was the wrong thing.');
    await s.say('Bram', 'Knowing doesn\'t stop anybody. Believe me.');
  },

  async echo_gallery(s) {
    s.spawn('reader_e', 'cassian', 7, 9, 'down');
    s.music('sad');
    await s.narrate('An old man at a reading-table, a letter in his hands. He reads it twice. He reads it a third time, smiling.');
    await s.say('???', '"Dear Hierophant. I\'m sorry to write again. Mom says I shouldn\'t bother you. But you said I could ask you anything, so: do you think a person can be more than one thing?"', { portrait: false });
    await s.say('???', '"Ilse says the light always knows best. I think the light might not have met me yet. — Wren Halloway, Lanternfall. (The westernmost one.)"', { portrait: false });
    await s.say('Cassian', '_(softly)_ A restless heart. Like mine.');
    s.remove('reader_e');
    s.music('cassian');
    await s.wait(0.8);
    await s.say('Wren', '...He kept them. He kept my letters.');
    await s.say('Ilse', 'Wren.');
    await s.say('Wren', 'I\'m fine. I\'m okay.');
    await s.say('Ilse', 'You always say "okay" when you aren\'t.');
    await s.say('Wren', '...Okay.');
  },

  async warden(s) {
    if (s.flag('c10_warden_done')) return;
    s.stopMusic(0.5);
    await s.pan(21, 7, 1.2);
    await s.narrate('On the dais, a figure of gold rises from its knees: a winged statue with a clock where its face should be. All twelve numerals are blank but one.');
    await s.say('Corvin', 'Let me guess. It counts to twelve.');
    await s.say('Ilse', 'And then it\'s noon.');
    await s.say('Pip', 'And then we\'re dead?');
    await s.say('Bram', 'Don\'t be there at twelve. Got it. Excellent plan. Love it.');
    await s.follow(0.5);
    const r = await s.battle('c10_boss_warden', { bg: 'temple' });
    if (r !== 'win') return;
    s.setFlag('c10_warden_done');
    s.music('cassian');
    await s.narrate('The Hour-Warden folds its wings over its blank face and is still. Behind it, the Noon Gate swings open on warm air, birdsong, and the smell of honey.');
    s.objective('Pass through the Noon Gate into Evernoon.');
    s.journal('We stopped the last three clocks. One of them showed me Cassian reading my letters. He smiled. I don\'t know what to do with that, so I\'m writing it down.');
  },

  // ------------------------------------------------------------------ Evernoon
  async evernoonArrive(s) {
    if (s.flag('c10_mercy_done') && !s.flag('c10_named')) return CH10.temptation(s);
    if (s.flag('c10_escape')) return CH10.escapeEvernoon(s);
    if (s.flag('c10_evernoon')) return;
    s.setFlag('c10_evernoon');
    crowd(s, { ilse: [22, 41, 'up'], bram: [24, 41, 'up'], pip: [21, 42, 'up'], corvin: [25, 42, 'up'] });
    await s.wait(0.6);
    await s.narrate([
      'White. Then gold. Then — a city.',
      'Aurenne. Not the ruin Ilse patched together in the Ember Ward — Aurenne whole, Aurenne young, on a summer afternoon with bunting on every line and the smell of honey-buns in the air.',
      'Somewhere, a band is about to start playing. It has been about to start for forty years.',
    ]);
    await s.say('Ilse', '...The Festival of the Long Light. Nana talked about it. The last one, the summer before the Lantern failed.');
    await s.say('Bram', 'Everyone\'s smiling.');
    await s.say('Corvin', 'Everyone\'s *always* smiling. Look at \'em. Nobody\'s blinked since we walked in.');
    await s.say('Pip', 'I don\'t like it. I don\'t like it, I don\'t like it, I don\'t like it.');
    await s.say('Wren', 'Stay close. She\'s here somewhere.');
    await s.say('Ilse', 'If he rebuilt the day his sister disappeared... she\'d be at home. The Keeper\'s house — next to the Lantern.');
    uncrowd(s);
    s.objective('Search Evernoon for Sable. (The Keeper\'s house stands in the north-east, beside the Lantern.)');
    s.journal('Evernoon. It\'s beautiful. Everyone smiles and says the same thing over and over, forever. Pip hasn\'t stopped holding my sleeve.');
  },

  async lysaRoom(s) {
    if (s.flag('c10_mercy_done')) return;
    s.music('evernoon');
    s.spawn('sable_l', 'sable_lysa', 5, 4, 'up');
    crowd(s, { ilse: [3, 7, 'up'], bram: [7, 7, 'up'], pip: [4, 7, 'up'], corvin: [8, 6, 'up'] });
    await s.move('player', [[5, 6]]);
    s.face('player', 'up');
    await s.narrate([
      'A girl\'s room. Paper stars on the ceiling. A ribbon on the bedpost. Jars of festival flowers on every surface, none of them wilting.',
      'At the vanity sits a girl in white and gold, brushing her black hair in long, slow strokes. In the mirror her face comes and goes, like a candle in a draught.',
    ]);
    await s.say('Wren', 'Sable?');
    await s.say('Sable', '...Cassian? You\'re late. Mama says the fireworks start at dusk.', { portrait: false });
    await s.say('Sable', 'Dusk. Why doesn\'t it ever get dark?', { portrait: false });
    s.face('sable_l', 'down');
    await flicker(s, 'sable_l');
    await s.say('Sable', 'Wren.');
    await s.say('Sable', 'Wren, you came. I asked them— I asked every—');
    s.sfx('dark');
    await flicker(s, 'sable_l', 4);
    await s.say('Sable', 'Who are you? Are you Cassian\'s friends? He never brings friends home.', { portrait: false });
    await s.say('Ilse', 'Sable, it\'s us. It\'s Ilse. I\'m the one who made you eat the soup.');
    await s.say('Sable', '...Soup.');
    await s.say('Sable', 'The soup was warm.');
    await flicker(s, 'sable_l', 2);
    await s.say('Sable', 'Mama makes soup. I don\'t like soup. I like honey-buns.', { portrait: false });
    await s.say('Pip', 'She\'s slipping. Wren, she\'s *slipping*—');
    await s.say('???', 'Shh.', { portrait: false });
    s.spawn('mercy_l', 'mercy_noon', 5, 8, 'up');
    await s.move('mercy_l', [[6, 7], [9, 6]], 1.4);
    s.face('mercy_l', 'left');
    s.face('player', 'right');
    s.music('tension');
    await s.say('Mercy', 'Don\'t wake her. She\'s sleeping so beautifully.');
    await s.say('Mercy', 'Hello again, little Keeper. I am so glad you came. She asked for you every day. Every day was the same day, of course. But she asked.');
    await s.say('Wren', 'Let her go.');
    await s.say('Mercy', 'Go? Go *where*, child? Out there? To ash, and hunger, and a sky with seven holes in it? I have seen your world. I walked out of it.');
    await s.say('Mercy', 'In here, no one is hungry. No one is sick. Nobody in the Undercroft coughs blood into their hands. Every child has a honey-bun, and it is always warm.');
    await s.say('Ilse', 'And none of them ever grow up.');
    await s.say('Mercy', 'Why would they want to? You did. Look at you. Look what it cost.');
    await s.say('Corvin', 'Lady, I\'ve met a lot of people selling a lot of things. You\'re the first one selling *nothing* this hard.');
    await s.wait(0.8);
    await s.say('Mercy', '...Then I shall keep her safe the old way.');
    await s.say('Mercy', 'Ring, bells. It is noon. It is always noon.');
    uncrowd(s);
    const r = await s.battle('c10_boss_mercy', { bg: 'evernoon' });
    if (r !== 'win') return;
    s.setFlag('c10_mercy_done');
    s.music('evernoon');
    await s.say('Mercy', 'It doesn\'t... matter. He\'s coming. He\'s always coming. It\'s always...');
    await s.wait(1.0);
    await s.say('Mercy', '...noon.');
    await s.move('mercy_l', [[6, 7], [5, 8]], 1.0);
    s.remove('mercy_l');
    await s.narrate('Sister Mercy walks out into the festival, still smiling, into the brightest part of the light — and then she is not there anymore.');
    s.face('sable_l', 'down');
    await s.say('Sable', 'Wren.');
    await s.say('Sable', 'Someone is coming. My — his —');
    await flicker(s, 'sable_l', 3);
    await s.say('Sable', 'Cassian\'s home!', { portrait: false });
    await s.move('sable_l', [[5, 8]], 3);
    s.remove('sable_l');
    await s.say('Wren', 'Sable, wait!');
    s.objective('Follow Sable to the festival square.');
    await s.fadeOut(0.8);
    await s.teleport('c10_evernoon', 23, 27, 'up');
  },

  /** In the square: Cassian, the dead, and a name. */
  async temptation(s) {
    if (s.flag('c10_named')) return;
    s.setFlag('c10_named');
    s.music('cassian');
    s.spawn('cassian_e', 'cassian', 23, 21, 'down');
    s.spawn('sable_e', 'sable_lysa', 22, 22, 'up');
    crowd(s, { ilse: [21, 27, 'up'], bram: [25, 27, 'up'], pip: [22, 28, 'up'], corvin: [24, 28, 'up'] });
    await s.pan(23, 23, 0.1);
    await s.wait(0.8);
    await s.narrate('By the fountain, where the water hangs glittering at the top of its arc, a tall man in white is holding a little girl\'s hand. Except the girl is sixteen. Except the girl is Sable.');
    await s.say('Cassian', 'Wren.');
    await s.say('Cassian', 'You came. I hoped you would. You must be so tired.');
    await s.say('Wren', '...Hello, Your Grace.');
    await s.say('Cassian', 'Oh, Wren. Cassian. You always wrote "Your Grace" and then crossed it out. I could see it through the paper.');
    await s.emote('player', '…');
    await s.say('Cassian', 'I am not going to fight you. I never wanted to fight anyone. I only wanted the afternoon to last.');
    await s.say('Cassian', 'Tonight the Lantern fails. My sister walks out onto the bridge to watch the fireworks, and the dark comes up off the river and takes her, and my father holds the light steady and lets it.');
    await s.say('Cassian', 'But tonight never comes. Not here. Here it is always the afternoon, and she is always ten, and she is always just upstairs.');
    await s.say('Cassian', 'And there is room. There is room for all of you. Every good day you ever had. Every face you ever lost.');
    s.flash('#fff0c0', 0.8);
    s.sfx('holy');
    await s.wait(0.6);
    // --- Wren
    s.spawn('ysolde_e', 'ysolde', 19, 24, 'right');
    s.spawn('edrin_e', 'c10_edrin', 18, 24, 'right');
    await s.say('Ysolde', 'Wren! Little bird — come here, you\'ve got ash in your hair.');
    await s.say('Edrin', 'There\'s my girl. Look how tall.');
    await s.step('player', -1, 0);
    await s.say('Wren', '...Mom.');
    await s.say('Wren', '...Dad?');
    // --- Ilse
    s.spawn('ana_e', 'c10_ana', 20, 25, 'right');
    await s.say('Ana Marrow', 'Ilse, sweetheart. Come and help me with the rosemary.');
    await s.say('Ilse', 'I don\'t — I don\'t even remember her voice. I was two.');
    await s.say('Ilse', 'That\'s not fair. That isn\'t *fair*, that he\'d know it and I wouldn\'t.');
    // --- Bram
    s.spawn('aldous_e', 'c10_aldous', 27, 24, 'left');
    await s.say('Sir Aldous', 'Bram, lad! There you are. Come and have an ale — your old knight\'s buying, for once.');
    await s.say('Bram', 'Sir... you\'re not... you\'re not the Penitent.');
    await s.say('Sir Aldous', 'Penitent? What have I got to be penitent about? Come here, boy. You did fine. You did *fine*.');
    await s.emote('bram_10', '…');
    // --- Pip
    s.spawn('mam_e', 'c10_pip_mam', 26, 25, 'left');
    await s.say('Mam', 'Pipkin Tallow. You come here this instant and let me wash that face.');
    await s.say('Pip', '...Mam?');
    // --- Corvin
    s.spawn('hal_e', 'c10_hal', 28, 25, 'left');
    await s.say('Hal', 'Corvin Ashe. You\'re late. You\'re *always* late.');
    await s.say('Corvin', '...No. No, no, no. Not you. Not *you*, Hal.');
    // --- Sable
    s.face('cassian_e', 'sable_e');
    await s.say('Cassian', 'And you, Lysa. Mother is waiting. I am here. You never have to be cold again.');
    await s.say('Sable', '...Cassian.', { portrait: false });
    await s.wait(1.6);
    // --- Sable chooses
    s.music('sad');
    await s.move('sable_e', [[22, 23]], 1.0);
    s.face('sable_e', 'up');
    await flicker(s, 'sable_e', 2);
    await s.say('Sable', 'I was cold.');
    await s.say('Sable', 'In the sea. Before I had a name. It was cold, and it was full, like a crowd.');
    await s.say('Sable', 'Then Wren gave me a name.');
    await s.say('Cassian', 'A name for a coat. From a picture in a book.');
    await s.say('Sable', 'Yes. It was the first thing anyone ever gave me.');
    await s.say('Sable', 'Lysa was ten. Here she is always ten. She will be ten forever.');
    await s.say('Sable', 'I am sixteen. I think. I would like to be seventeen.');
    await s.wait(0.8);
    await s.say('Cassian', '...Seventeen.');
    await s.say('Sable', 'And then eighteen. And then old, with white hair, like yours. I want to find out what I am like when I am old.');
    await s.say('Cassian', 'Lysa — you would *die*.');
    await s.say('Sable', 'Yes.');
    await s.say('Sable', 'That is why the bread is warm.');
    await s.say('Sable', 'The honey-buns here have been warm for forty years, and nobody eats them. Bread is only warm because it does not last.');
    await s.narrate('She reaches up and unties the ribbon from her hair, and holds it out to him.');
    await s.say('Sable', 'This is hers. I am not her.');
    await s.wait(0.8);
    s.flash('#2a1a40', 0.8);
    s.sfx('revive');
    s.remove('sable_e');
    s.spawn('sable_e', 'sable', 22, 23, 'up');
    await s.say('Sable', 'My name is Sable.');
    await s.narrate('The white and the gold drain out of the festival dress like light out of an evening sky. What is left is plain, and dark, and hers.');
    await s.say('Cassian', '...Keep it.');
    await s.say('Cassian', 'Please. I can\'t.');
    await s.say('Sable', 'Then I will keep it. For her. Not as her.');
    // --- everyone answers
    s.face('player', 'ysolde_e');
    await s.say('Wren', 'Mom told me to grow up well.');
    await s.say('Wren', 'I can\'t do that here.');
    await s.wait(0.6);
    await s.say('Wren', 'Goodbye, Mom.');
    await s.say('Ilse', 'I\'ll remember your voice wrong for the rest of my life. That\'s *mine*. He doesn\'t get to fix it.');
    await s.say('Bram', 'My knight died saving a coward. The coward\'s going to make it worth it.');
    await s.say('Bram', 'So — no. Thank you. No.');
    await s.wait(0.8);
    await s.say('Pip', '...Bye, Mam.');
    await s.narrate('Corvin\'s hand comes down on Pip\'s shoulder, and stays there.');
    await s.say('Corvin', 'Hal would\'ve shot you for this, Hierophant. I\'m thinking it over.');
    await s.wait(1.2);
    s.face('cassian_e', 'player');
    await s.say('Cassian', '...Then I will need all seven Shards.');
    await s.say('Wren', 'What?');
    await s.say('Cassian', 'She was the key. A memory wearing a face, to open the door from the inside. Without her, I must open it from the outside: all seven pieces of the sun.');
    await s.say('Cassian', 'It will take longer. It will cost more. I am so sorry, Wren. I would have given you every good day there ever was.');
    await s.say('Sable', 'I know. That is why it was a cage.');
    await s.move('cassian_e', [[23, 18], [23, 12]], 1.2);
    s.remove('cassian_e');
    // --- Evernoon comes apart
    s.music('gloam');
    s.shake(0.4, 2.0);
    s.flash('#8a5aff', 0.5);
    await s.narrate([
      'The dead stop mid-word. Their smiles stay where they are.',
      'Across the square the honey-buns go cold. Every falling petal hits the ground at once. The bandleader says "and-a-THREE" — and the music, finally, horribly, begins, and tears like paper.',
    ]);
    ['ysolde_e', 'edrin_e', 'ana_e', 'aldous_e', 'mam_e', 'hal_e'].forEach((id) => s.remove(id));
    await s.say('Corvin', 'Uh. Sparrow? The sky\'s coming apart.');
    await s.say('Ilse', 'She was holding it together. Without her it\'s all—');
    await s.say('Ilse', 'Here. Your coat. I\'ve been carrying it for a year. Don\'t ask.');
    await s.say('Sable', 'I won\'t ask. I will just wear it.');
    await s.say('Sable', 'Wren.');
    await s.say('Wren', 'Yeah?');
    await s.say('Sable', 'Thank you for my name. I would like to keep it.');
    await s.say('Wren', 'It\'s yours. It was always yours.');
    s.remove('sable_e');
    uncrowd(s);
    s.setLook('sable', 'sable');
    const sable = s.state.addCharacter('sable');
    sable.setLevel(52);
    kitOut(s, 'sable', { weapon: 'sunshard_rod', body: 'sunshard_robe', head: 'sunshard_tiara' });
    await s.join('sable');
    await s.learnCrest('gloamweaver');
    await s.say('Pip', 'Great. Lovely. Can we RUN now?');
    await s.say('Wren', 'RUN!');
    s.setFlag('c10_escape');
    s.objective('Escape! Back through the Noon Gate (south) and out of the Spire before Evernoon comes apart.');
    s.journal('Sable chose her name. She gave Lysa\'s ribbon back and he couldn\'t take it, so she kept it — "for her, not as her." Cassian says he\'ll need all seven Shards now. Evernoon is coming apart. We\'re running.');
    await s.fadeOut(0.5);
    await s.teleport('c10_evernoon', 23, 27, 'down');
  },

  async escapeEvernoon(s) {
    if (s.flag('c10_esc_ev')) return;
    s.setFlag('c10_esc_ev');
    await s.narrate('Evernoon is unravelling. Where the sky was, there are seams of violet dark. The puppets stand frozen mid-sentence, and the Gloam is coming in through the gaps between their words.');
    await s.say('Sable', 'The gate. South. The way you came in.');
  },

  async gateGuards(s) {
    if (s.flag('c10_gate_fight')) return;
    s.setFlag('c10_gate_fight');
    await s.narrate('The two festival guards at the gate turn to face you. Their faces are gone. Behind them, where the gate was, the light is pouring out like water from a cracked jar.');
    await s.say('Corvin', 'Fellas. We were just leaving.');
    const r = await s.battle('c10_esc_guards', { bg: 'gloam' });
    if (r !== 'win') return;
    await s.say('Bram', 'Gate\'s clear! Go, go, go!');
  },

  async escapeHalls(s) {
    if (s.flag('c10_esc_halls')) return;
    s.setFlag('c10_esc_halls');
    s.clearBlocker('balcony_door');
    s.shake(0.4, 1.6);
    await s.narrate('The Spire shakes. Cracks of violet light run up through the white marble, and every one of the ten thousand clocks begins, all at once, to tick.');
    await s.say('Pip', 'The lift! Back to the lift—');
    await s.say('Corvin', 'Lift shaft\'s full of light, kid. We\'d come out the bottom as a smell.');
    await s.say('Corvin', 'East side. Mags always comes round the east side; she says the light\'s better. There — that door\'s blown open. There\'ll be a balcony.');
    s.objective('Reach the Sky Balcony on the east side of the Spire — Mags will bring the Halcyon.');
  },

  async corridorFight(s) {
    if (s.flag('c10_corridor')) return;
    s.setFlag('c10_corridor');
    await s.narrate('The corridor is filling with things that were almost people — puppets with their strings cut, stitched together out of unfinished sentences.');
    await s.battle('c10_esc_corridor', { bg: 'gloam' });
  },

  async balcony(s) {
    if (s.flag('c10_done')) return;
    s.stopMusic(0.5);
    await s.pan(37, 7, 1.2);
    await s.narrate('On the balcony, the leftover pieces of Evernoon are pulling themselves together: every "lovely day," every "any moment now," every "ask me" that was never answered — knotted into one shape, the size of a house, with a hundred smiling mouths.');
    await s.say('Sable', 'It is everything they never finished saying.');
    await s.say('Ilse', 'Then let\'s finish it for them.');
    await s.follow(0.6);
    const r = await s.battle('c10_boss_forgot', { bg: 'gloam' });
    if (r !== 'win') return;
    return CH10.leap(s);
  },

  async leap(s) {
    s.setFlag('c10_done');
    crowd(s, { ilse: [35, 7, 'right'], bram: [35, 9, 'right'], pip: [36, 10, 'right'], corvin: [34, 8, 'right'], sable: [37, 9, 'right'] });
    s.shake(0.5, 2.0);
    s.music('afterlight');
    await s.narrate('Out of the bruised dark, engines howling, comes the Halcyon — listing, scorched, trailing smoke, and absolutely beautiful.');
    await s.say('Mags', 'DID SOMEBODY ORDER A SHIP?', { portrait: false });
    await s.say('Corvin', 'MAGS! You magnificent wrench!');
    await s.say('Mags', 'I scratched the paint! I\'m putting it on your tab!', { portrait: false });
    await s.say('Corvin', 'I don\'t *have* a tab anymore!');
    await s.say('Mags', 'YOU DO NOW!', { portrait: false });
    await s.say('Wren', 'Everybody — jump!');
    s.face('sable_10', 'player');
    await s.say('Sable', 'Wren. I have never jumped before.');
    await s.say('Wren', 'Me neither. Not like this.');
    await s.narrate('Wren holds out her hand. Sable looks at it for a moment, as if it were bread. Then she takes it.');
    await s.fadeOut(1.2, '#ffffff');
    uncrowd(s);
    await s.narrate([
      'They jump.',
      'For one long moment there is nothing under them at all —',
      '— and then there is a deck, and Bram landing on Corvin, and Pip landing on Bram, and Ilse landing on her feet because of course she does.',
      'Behind them the Noon Spire stands, white and untouched. The circle of blue sky at its top dims, just slightly. Then it steadies again.',
    ]);
    await s.fadeOut(0.6, '#000000');
    await s.say('Sable', 'The sky is the wrong colour.', { portrait: false });
    await s.say('Pip', 'It\'s been the wrong colour for a year.', { portrait: false });
    await s.say('Sable', 'I know. I like it. It is the colour of _after_.', { portrait: false });
    await s.say('Wren', 'What was it like? In there?', { portrait: false });
    await s.say('Sable', 'Warm. All the time. Like a hand on your forehead when you are sick.', { portrait: false });
    await s.say('Sable', 'I do not want to be held like that. I want to be let go of. A little at a time.', { portrait: false });
    await s.say('Corvin', '...Kid\'s a natural.', { portrait: false });
    await s.say('Ilse', 'Seven Shards. He\'s going after every piece of the sun.', { portrait: false });
    await s.say('Bram', 'Then we get there first.', { portrait: false });
    await s.say('Wren', 'All seven. Before he does.', { portrait: false });
    s.setFlag('act3');
    s.journal('We got Sable back. She chose her own name, and then she jumped. Cassian is going after the seven Shards. So are we.');
    // Chapter 11's card plays aboard the Halcyon, after its opening narration (CH11.deckEnter).
    s.objective('Find the seven Sun Shards before Cassian does.');
    await s.teleport('halcyon_deck', 12, 8, 'down');
  },
};
