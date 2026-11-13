// KINDLE — the Emberhart (data/mount.js). An optional Act I meeting in the Whisperwold's
// Hollow, once the Mother is at rest: a forester in Thistledown has seen a hart there
// whose antlers burn like a Lantern. After the Sundering, Kindle finds Wren in the ash
// of Lanternfall either way — a reunion, or (if she never went looking) a first meeting.

import { MOUNT, HART_LOOK, hasMount } from '../data/mount.js';

const QUEST = 'mount_kindle';

/** Ownership, the key item, the journal; then Wren climbs up. */
async function bond(s, journal) {
  s.setFlag(MOUNT.flag);
  s.sfx('hart');
  if (!s.state.inventory.count(MOUNT.item)) await s.give(MOUNT.item);
  await s.tutorial('riding');
  s.journal(journal);
}

export const KINDLE = {
  /** Thistledown: Hesk the forester has seen it. */
  async hesk(s) {
    if (hasMount(s.state)) {
      return s.say('Hesk', ['So it went with you. Good. A light like that shouldn\'t stand alone in a wood.', 'Mind you feed it. I\'ve no idea what. Sunsets, maybe.']);
    }
    await s.say('Hesk', [
      'You came through the Hollow? Then you\'ve seen what\'s changed. It\'s quiet now. Birds back.',
      'And something else. A hart. Big as a carthorse — and its antlers burn. Not fire. Light. Like a Lantern\'s mantle, walking.',
      'My granddad said the first Keepers lit the Lanterns from an Emberhart\'s antlers. I said that\'s a story. Now I don\'t know what I say.',
      'It\'s been standing by the Mother\'s old tree since the dark went out of it. It looks... tired. Like it\'s waiting for someone.',
    ]);
    if (!s.state.vars.quests?.[QUEST]) s.quest(QUEST, 'The Emberhart', 'A forester in Thistledown has seen a hart with burning antlers in the Whisperwold\'s Hollow, by the Mother\'s old tree.');
    return null;
  },

  /** The Hollow: the Emberhart, its light guttering, harried by shades. */
  async hollow(s) {
    await s.narrate('A great hart stands by the Mother\'s split tree. Its antlers burn like a Lantern\'s mantle — soft, steady, gold — and embers drift in its coat.');
    await s.say('Sable', 'It is made of the light. The same light as the Kindling.');
    await s.say('Wren', 'Easy. We\'re not here to hurt you.');
    await s.narrate('It lowers its head. The embers on its flank are guttering. And at the edge of the clearing, something cold has noticed them too.');
    s.sfx('encounter');
    const r = await s.battle('c2_shade_pair', { loseOk: true });
    if (r !== 'win') {
      s.heal();
      return s.narrate('When you come to, the shades are gone and the hart is still there, watching you. It hasn\'t run. It\'s still waiting.');
    }
    await s.narrate('The shades come apart like smoke in a wind. The hart\'s light steadies a little.');
    await s.say('Ilse', 'It isn\'t hurt. It\'s... going out. Like a lamp nobody\'s tending.');
    await s.say('Wren', 'Then we tend it.');
    await s.narrate('Wren puts her hand to the burning antler. It is warm, not hot — warm like a hand. The light leans into her, the way the Lantern\'s light used to lean toward her mother.');
    await s.say('Bram', 'I think it just picked you.');
    await s.say('Wren', 'Kindle. Your name\'s Kindle.');
    await s.say('Sable', 'Because of the Kindling?');
    await s.say('Wren', 'Because it\'s the one thing about that day I want to keep.');
    s.remove('kindle');
    await bond(s, 'In the Whisperwold\'s Hollow we met an Emberhart, a hart whose antlers burn with Lantern-light. Wren named it Kindle. It carries us now.');
    if (s.state.vars.quests?.[QUEST]) s.quest(QUEST, null, null, 'done');
    s.field.setRiding(true);
    return null;
  },

  /** The Drift, a year after the Sundering: Kindle finds Wren in the ash. */
  async drift(s) {
    const met = hasMount(s.state);
    s.setFlag('kindle_drift');
    if (s.state.vars.quests?.[QUEST]?.status === 'active') s.quest(QUEST, null, null, 'done'); // took Hesk's tip, never went
    await s.narrate('Something glows in the ash ahead. Low and gold and steady — the only warm color left in the world.');
    s.spawn('kindle', HART_LOOK, 57, 15, 'left');
    await s.pan(54, 15, 1.2);
    await s.move('kindle', [[52, 15]]);
    await s.follow(0.8);
    if (met) {
      await s.say('Wren', 'Kindle?');
      await s.narrate('The Emberhart is thinner than she remembers, and its antlers burn low, like coals at the end of a long night. It has been waiting here. A year, on what is left of Lanternfall.');
      await s.say('Wren', 'You came back to the Lantern. Of course you did.');
      await s.narrate('It presses its head into her shoulder. The embers on its flank brighten, one by one.');
      await s.say('Wren', 'I\'m not going anywhere without you again. I promise.');
      return bond(s, 'On the Drift, in the ash of Lanternfall, Kindle found me. It had waited a year.').then(() => KINDLE.mountUp(s));
    }
    await s.narrate('A hart, made of embers. It walks to her through the ash as if it knows her. Maybe it knows the light she was born under.');
    await s.say('Wren', 'You\'re from the Lantern. Aren\'t you. Mom\'s light.');
    await s.narrate('It lowers its burning antlers until they almost touch her hair. Warm, like a hand.');
    await s.say('Wren', 'Kindle. I\'ll call you Kindle.');
    return bond(s, 'On the Drift, in the ash of Lanternfall, an Emberhart found me — a hart with Lantern-light in its antlers. I named it Kindle.').then(() => KINDLE.mountUp(s));
  },

  mountUp(s) {
    s.remove('kindle');
    s.field.setRiding(true);
  },
};
