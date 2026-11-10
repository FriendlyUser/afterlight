// CHAPTER 10 — side stories in Evernoon: the lemonade that never arrives, and
// the question that was never asked. Letting a memory finish sets it free.

/** @type {import('../types/data').StoryScripts} */
export const CH10_SIDE = {
  // ------------------------------------------------------------------ the lemonade
  async oldWoman(s) {
    if (s.flag('c10_q_lemon_done')) return;
    if (s.flag('c10_escape')) return s.narrate('She has stopped mid-word, still smiling. Nothing behind the smile is moving anymore.');
    if (s.has('c10_lemonade')) {
      s.setFlag('c10_q_lemon_done');
      await s.take('c10_lemonade');
      await s.say('Old Bess', 'Oh! Oh, there it is. My Tomas always gets the mint in. Every time.');
      await s.narrate('She drinks. Something in her face changes — the smile goes soft at the edges, the way a real smile does.');
      await s.say('Old Bess', 'It\'s warm. Lemonade\'s never warm. How long have I been sitting here, dears?');
      await s.say('Ilse', '...A long time.');
      await s.say('Old Bess', 'Then I think I\'ll go home. My feet hurt. Isn\'t that wonderful? They haven\'t hurt in ever so long.');
      await s.narrate('She stands up, and turns into a scatter of golden motes, and the motes drift up and away, and do not come down.');
      s.remove('bess');
      await s.narrate('On the bench where she sat lies a charm on a faded ribbon.');
      await s.give('phoenix_charm');
      s.quest('c10_q_lemon', null, null, 'done');
      return;
    }
    if (!s.flag('c10_q_lemon')) {
      s.setFlag('c10_q_lemon');
      await s.say('Old Bess', 'Sit, sit. My Tomas will be back with the lemonade any moment.');
      await s.say('Pip', 'How long has he been gone?');
      await s.say('Old Bess', 'Any moment, dear. Any moment.');
      s.quest('c10_q_lemon', 'Any Moment Now', 'Old Bess on the river bench has been waiting forty years for Tomas to come back with the lemonade.');
      return;
    }
    return s.say('Old Bess', 'Any moment now. He knows I like it with mint.');
  },

  async tomas(s) {
    if (s.flag('c10_escape')) return s.narrate('Tomas has stopped mid-stride. Both cups are empty now.');
    if (s.flag('c10_q_lemon_done')) return s.say('Tomas', 'Bess? ...Bess went home. Good. Good. Then so can I.');
    if (!s.flag('c10_q_lemon')) return s.say('Tomas', 'Two lemonades. Mint in one. I\'m going, I\'m going, I\'m nearly there.');
    if (s.has('c10_lemonade')) return s.say('Tomas', 'Go on. She\'s on the bench by the river. She always is.');
    await s.say('Tomas', 'Two lemonades. Mint in one. I\'m going, I\'m going...');
    await s.narrate('He is mid-stride, one foot lifted, a cup in each hand. He has been mid-stride for forty years.');
    await s.say('Tomas', '...My legs don\'t seem to want to move today. Would you take it to her, on the bench by the river? The one with the mint. Bess always has the mint.');
    await s.give('c10_lemonade');
  },

  // ------------------------------------------------------------------ ask me
  async lovers(s) {
    if (s.flag('c10_q_ask_done')) return;
    if (s.flag('c10_escape')) return s.narrate('They stand frozen on the bridge, his hand halfway to his pocket. The question will never be asked now.');
    await s.say('Della', 'Ask me.');
    await s.say('Rafe', 'Ask you what?');
    await s.say('Della', 'You know what.');
    if (!s.flag('c10_q_ask')) {
      s.setFlag('c10_q_ask');
      s.quest('c10_q_ask', 'Ask Me', 'Two lovers on the river bridge have been one question away from the rest of their lives for forty years.');
      await s.say('Corvin', 'He\'s got a ring in his coat. Left pocket. I can see the box from here.');
      await s.say('Ilse', 'He\'s been reaching for it for forty years.');
      return;
    }
    if (!s.state.party.includes('pip')) return;
    s.setFlag('c10_q_ask_done');
    await s.say('Pip', 'Oh, for— *fine*.');
    await s.narrate('Pip walks up behind Rafe and, with the deftness of a boy who has picked a thousand pockets, lifts the ring box from his coat and puts it *into* his hand.');
    await s.say('Rafe', '...Oh.');
    await s.narrate('He looks down at the box. He goes down on one knee — it creaks, forty years of creak — and he opens it.');
    await s.say('Rafe', 'Della. Will you—');
    await s.say('Della', 'Yes. Gods, *yes*. What took you so long?');
    await s.narrate('They laugh, and hold each other, and are gone — two drifts of gold, rising together. On the bridge rail, something glints.');
    s.remove('lover_m'); s.remove('lover_f');
    await s.give('regen_bangle');
    await s.say('Corvin', 'Smooth, kid.');
    await s.say('Pip', 'Somebody had to. Adults are *useless*.');
    s.quest('c10_q_ask', null, null, 'done');
  },
};
