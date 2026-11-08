// Optional content: the Hunters' Lodge bounty board, four optional dungeons
// (Drowned Observatory, Fort Ashwatch, the Hollow Bell, the Garden That
// Remembers) and two hidden bosses. Self-contained: reached by fast travel only.

import { anglerTalk } from './fishing.js';

// ---------------------------------------------------------------------------
// Bounties
// ---------------------------------------------------------------------------

/** Notorious monsters. `act` decides which board posts them. */
export const BOUNTIES = [
  { id: 'bristleback', act: 1, name: 'Bristleback', level: 13, troop: 'side_b_bristleback', where: 'Brackenmoor, north meadow',
    desc: 'A boar the size of a hay cart. Has eaten two fences and a cart. The cart was occupied.', gold: 600, items: [['hi_tonic', 3]] },
  { id: 'lanternjaw', act: 1, name: 'Lanternjaw', level: 15, troop: 'side_b_lanternjaw', where: 'Brackenmoor, the sunk pool',
    desc: 'Something in the moor pool dangles a light at night. Travellers follow it. Travellers stop.', gold: 900, items: [['stone_ranger', 1]] },
  { id: 'gravelgut', act: 1, name: 'Gravelgut', level: 17, troop: 'side_b_gravelgut', where: 'Brackenmoor, the old cairns',
    desc: 'A cairn that got up and walked. It eats the other cairns. Bring a hammer.', gold: 1200, items: [['power_band', 1]] },
  { id: 'pinch', act: 1, name: 'The Pinch', level: 19, troop: 'side_b_pinch', where: 'Drowned Observatory, the causeway',
    desc: 'A crab that holds the causeway at low tide and takes a toll in fingers.', gold: 1500, items: [['frost_ring', 1]] },
  { id: 'mange', act: 1, name: 'Mange', level: 27, troop: 'side_b_mange', where: 'Fort Ashwatch, the east yard',
    desc: 'The fort\'s old war-hound, still on patrol. Nobody told it the war ended. Nobody can get close enough to tell it.', gold: 2500, items: [['hunters_eye', 1]] },
  { id: 'cinderwing', act: 2, name: 'Cinderwing', level: 40, troop: 'side_b_cinderwing', where: 'The Ashen Reach, the high ridge',
    desc: 'A gull that flew through the broken sun and came out burning. It has not stopped.', gold: 4000, items: [['crest_tome', 2]] },
  { id: 'glasshide', act: 2, name: 'Glasshide', level: 42, troop: 'side_b_glasshide', where: 'The Ashen Reach, the glass hollows',
    desc: 'A scorpion that ate a cathedral window. You can see the saints through its back.', gold: 4500, items: [['swift_fruit', 2]] },
  { id: 'gravemouth', act: 2, name: 'Gravemouth', level: 44, troop: 'side_b_gravemouth', where: 'The Ashen Reach, far shard',
    desc: 'It lives in the old burial shard. It speaks with the voices of the people buried there.', gold: 5000, items: [['regen_bangle', 1]] },
  { id: 'choirmother', act: 2, name: 'The Choirmother', level: 46, troop: 'side_b_choirmother', where: 'The Hollow Bell, the inverted nave',
    desc: 'The abbey\'s choir-mistress, still conducting. The choir is gone. She has not noticed.', gold: 5500, items: [['scholars_monocle', 1]] },
  { id: 'thornmaiden', act: 2, name: 'The Thornmaiden', level: 58, troop: 'side_b_thornmaiden', where: 'The Garden That Remembers, the east beds',
    desc: 'A rose-hedge in the shape of a bride. Do not let her hold your hand.', gold: 8000, items: [['thiefs_glove', 1]] },
];

const bflag = (b, k) => `side_b_${b.id}_${k}`;
const forAct = (s) => BOUNTIES.filter((b) => b.act === (s.flag('sundered') ? 2 : 1));

function status(s, b) {
  if (s.flag(bflag(b, 'claimed'))) return 'claimed';
  if (s.flag(bflag(b, 'slain'))) return 'slain';
  if (s.flag(bflag(b, 'taken'))) return 'taken';
  return 'open';
}

/** The bounty board: pay out finished hunts, then post / show one bounty. */
export async function bountyBoard(s, clerk) {
  const list = forAct(s);
  for (const b of list.filter((x) => status(s, x) === 'slain')) {
    s.setFlag(bflag(b, 'claimed'));
    s.quest(`side_b_${b.id}`, null, null, 'done');
    await s.say(clerk, `${b.name}. Confirmed. The Lodge thanks you — here's what was posted.`);
    await s.gold(b.gold);
    for (const [item, n] of b.items) await s.give(item, n);
  }
  await checkHiddenUnlock(s, clerk);
  const labels = list.map((b) => {
    const tag = { open: '', taken: ' {blue|[hunting]}', claimed: ' {dim|[done]}' }[status(s, b)] ?? '';
    return `${b.name} — Lv ${b.level}${tag}`;
  });
  const i = await s.choice([...labels, 'Leave the board'], { prompt: 'The bounty board', cancel: list.length });
  if (i >= list.length) return;
  const b = list[i];
  const st = status(s, b);
  if (st === 'claimed') {
    await s.say(clerk, `${b.name}'s already paid out. Its pelt's on the wall. Well. Its something's on the wall.`);
  } else if (st === 'taken') {
    await s.say(clerk, `${b.name}: ${b.where}. It's still out there.`);
  } else {
    await s.say(clerk, [`*${b.name}* (Lv ${b.level}) — ${b.where}.`, b.desc, `Pays ${b.gold} gold and something extra.`]);
    if (await s.confirm('Take the bounty?', 'Take it', 'Not yet')) {
      s.setFlag(bflag(b, 'taken'));
      s.quest(`side_b_${b.id}`, `Bounty: ${b.name}`, `Hunt ${b.name} — ${b.where}. Return to the bounty board for the reward.`);
    }
  }
}

/** When every bounty of an act is claimed, the clerk reveals that act's hidden hunt. */
async function checkHiddenUnlock(s, clerk) {
  const act2 = s.flag('sundered');
  const all = forAct(s).every((b) => s.flag(bflag(b, 'claimed')));
  if (!all) return;
  if (!act2 && !s.flag('side_hollow_open')) {
    s.setFlag('side_hollow_open');
    await s.say(clerk, [
      'That\'s every bounty on the board. Nobody\'s cleared it since the old man died.',
      'The old man. Harrow — he founded this Lodge. Something killed him in a hollow south of the moor. We never posted it. We never had anyone good enough.',
      'You might be. I\'ve marked the Hollow on your map. Don\'t make me take your names off the wall.',
    ]);
    s.quest('side_hollow', 'Harrow\'s Hollow', 'Something killed the Lodge\'s founder. The Hollow is marked on the world map.');
  } else if (act2 && !s.flag('side_nadir_open')) {
    s.setFlag('side_nadir_open');
    await s.say(clerk, [
      'Every bounty. In a world like this. You know what that makes you? A reason for people to keep going.',
      'There\'s one more. Not on any board. Up past the wounds, where the sky is darkest, something black hangs that isn\'t a wound.',
      'The old hunters called it the Black Star. I\'ve marked the way. Be what you\'ve been.',
    ]);
    s.quest('side_nadir', 'The Black Star', 'Above the seven wounds hangs a dark star. The way is marked on the world map.');
  }
}

/** Trigger handler for a bounty target's lair. */
export function bountyLair(id) {
  const b = BOUNTIES.find((x) => x.id === id);
  return {
    cond: (st) => st.flags[bflag(b, 'taken')] && !st.flags[bflag(b, 'slain')],
    run: async (s) => {
      s.shake(0.2, 0.5);
      await s.system(`*${b.name}* blocks the way!`);
      const r = await s.battle(b.troop, { boss: true, music: 'boss' });
      if (r !== 'win') return;
      s.setFlag(bflag(b, 'slain'));
      s.quest(`side_b_${b.id}`, null, `${b.name} is slain. Claim the reward at the bounty board.`);
      await s.system(`${b.name} is slain! Return to the bounty board to claim the reward.`);
    },
  };
}

// ---------------------------------------------------------------------------
// The Hunters' Lodge
// ---------------------------------------------------------------------------

// Script factories for the side-quest maps (each returns a script).

/** A bell-nave chime's script. Chimes:  a (low), b (high), c (middle). Correct order a → b → c. */
export function chime(id) {
  return async (s) => {
    const tone = { a: 'low', b: 'high', c: 'middle' }[id];
    s.sfx('song');
    const seq = (s.vars.side_chimes = (s.vars.side_chimes || '') + id);
    await s.narrate(`The ${tone} chime rings out through the inverted nave.`);
    if (s.flag('side_bell_open')) return;
    if (!'abc'.startsWith(seq)) {
      s.vars.side_chimes = '';
      await s.narrate('The chord sours. The tones fade. Something below sighs.');
      return;
    }
    if (seq === 'abc') {
      s.setFlag('side_bell_open');
      s.flash('#fff4d0', 0.5);
      for (const id2 of ['nave_seal_a', 'nave_seal_b', 'nave_seal_c']) s.clearBlocker(id2);
      await s.narrate('The three tones become one. Far below, the great bell answers — and the way down opens.');
    }
  };
}

/** A white flower's last words (the Garden of Last Words). */
export function flower(text) { return async (s) => s.narrate(['The white flower turns toward you and, in a voice that is not a voice:', `_"${text}"_`]); }

/** @type {import('../types/data').StoryScripts} */
export const SIDE = {
  async lodgeArrive(s) {
    if (s.flag('side_lodge_seen')) return;
    s.setFlag('side_lodge_seen');
    await s.narrate(['Antlers over the door. Smoke from the chimney. Somewhere inside, a woman is shouting at a ledger.']);
  },

  async adelind(s) {
    if (!s.flag('side_adelind_met')) {
      s.setFlag('side_adelind_met');
      await s.say('Adelind', [
        'Welcome to the Hunters\' Lodge. I\'m Adelind; I keep the board, the books and the peace, in that order.',
        'People post bounties for monsters that are too much for a village. You hunt them, you bring proof, you get paid. Proof is the monster not being there anymore.',
        'Wipe your boots.',
      ]);
    }
    await bountyBoard(s, 'Adelind');
  },

  async hesper(s) {
    if (!s.flag('side_hesper_met')) {
      s.setFlag('side_hesper_met');
      await s.say('Hesper', [
        'Lodge is open. Mostly. The roof\'s over there now.',
        'I was Adelind\'s apprentice. She went down with the north wing when the sky broke. Kept the books dry, though. She\'d want me to say that.',
        'The board still works. Monsters are worse. People need them gone more than ever.',
      ]);
      if (s.flag('side_adelind_met')) await s.say('Hesper', 'Oh — I know your face. You hunted for her. She used to say you never wiped your boots.');
    }
    await bountyBoard(s, 'Hesper');
  },

  angler: (s) => anglerTalk(s, 'Old Sill'),

  // -------------------------------------------------------------------------
  // The Drowned Observatory
  // -------------------------------------------------------------------------

  async observatoryArrive(s) {
    if (s.flag('side_obs_seen')) return;
    s.setFlag('side_obs_seen');
    await s.narrate(['At low tide a causeway rises out of the bay, and at its end a dome — half-sunk, green with weed, older than any Lantern.']);
    await s.say('Ilse', 'That\'s not on any map I\'ve read.');
    await s.say('Wren', 'Then we\'re about to read a new one.');
  },

  async lens(s) {
    if (s.flag('side_obs_lens')) return s.narrate('The great lens throws a bar of light up the stair. The way is open.');
    await s.narrate(['A great lens on a brass arm, crusted with salt. Beyond the gallery, the stairway is sealed by a curtain of pale crystal.']);
    if (!(await s.confirm('Turn the lens toward the stair?', 'Turn it', 'Leave it'))) return;
    s.setFlag('side_obs_lens');
    s.flash('#fff4d0', 0.5);
    s.sfx('holy');
    s.clearBlocker('obs_seal');
    await s.narrate('Sunlight bends through the glass and strikes the crystal. It sings — one clear note — and shatters.');
    await s.say('Sable', 'That note. It is the one the Lanterns sing. But backwards.');
  },

  async orrery(s) {
    if (s.flag('side_obs_boss')) return s.narrate('The orrery is still now. Seven brass suns, and one empty socket in the middle.');
    await s.narrate(['A vast brass orrery fills the dome: seven small suns on seven arms, circling an empty socket.', 'Carved around the rim: _WHAT IS SUNG FORWARD CAN BE SUNG BACK. WE MEASURED IT. WE CHOSE NOT TO._']);
    await s.say('Wren', '"We chose not to." Who\'s we?');
    s.shake(0.2, 0.8);
    await s.system('The orrery\'s keeper wakes!');
    const r = await s.battle('side_boss_orrery', { boss: true, bg: 'temple', music: 'boss' });
    if (r !== 'win') return;
    s.setFlag('side_obs_boss');
    await s.narrate(['In the empty socket you find a book of measurements, written by the very first Keepers.', 'The last page: _Seven voices hold the sun. Any one of them could stop it. That is why there must always be seven._']);
    s.journal('There was an observatory under the bay older than the Lanterns. The first Keepers knew the Dawnsong could be sung backwards. They chose not to.');
  },

  // -------------------------------------------------------------------------
  // Fort Ashwatch
  // -------------------------------------------------------------------------

  async ashwatchArrive(s) {
    if (s.flag('side_ash_seen')) return;
    s.setFlag('side_ash_seen');
    await s.narrate(['Fort Ashwatch: an old Dawnguard frontier fort, abandoned for twenty years. The banners are rags. The gate is open.']);
    if (s.state.party.includes('bram')) {
      await s.say('Bram', 'Ashwatch. Sir Aldous held this fort before he was my mentor. He said it was the coldest place he ever loved.');
    }
  },

  async graves(s) {
    await s.narrate(['A row of soldiers\' graves, each marked with a Dawnguard sunburst. The newest is twenty years old.', 'Someone has been leaving wildflowers. Recently.']);
  },

  async aldousOffice(s) {
    if (s.flag('side_ash_letter')) return s.narrate('Sir Aldous\'s old office. The desk is empty now.');
    s.setFlag('side_ash_letter');
    await s.narrate(['A commander\'s office, frozen in the moment it was left. In the desk, an unsent letter, sealed, addressed in a square hand:', '_To my squire, whoever he turns out to be._']);
    await s.give('side_aldous_letter');
    if (s.state.party.includes('bram')) {
      await s.say('Bram', '...That\'s his handwriting.');
      await s.say('Bram', 'He wrote it before he ever met me. "Whoever he turns out to be."');
      await s.narrate(['_If you are reading this, you are my squire, and you have just frozen in front of something terrible, and you think you are a coward._', '_I froze my first time too. In this fort. A man died covering for me. I have never told anyone._', '_Courage is not the part where you are not afraid. It is the part after. — A.V._']);
      await s.wait(1);
      await s.say('Bram', '...', { speed: 0.4 });
      await s.say('Ilse', 'Bram?');
      await s.say('Bram', 'I\'m fine. There\'s dust. In the fort. It\'s a very dusty fort.');
      s.journal('In Fort Ashwatch we found a letter Sir Aldous wrote to his future squire. Bram says the fort is very dusty.');
    }
  },

  async ironDuke(s) {
    if (s.flag('side_ash_duke')) return;
    await s.narrate('An empty suit of commander\'s armor stands guard over the stairs. As you approach, it draws its sword.');
    const r = await s.battle('side_boss_duke', { boss: true, bg: 'temple', music: 'boss' });
    if (r !== 'win') return;
    s.setFlag('side_ash_duke');
    await s.narrate('The armor kneels, slowly, as if relieved. The way to the signal tower is clear.');
  },

  async brazier(s) {
    if (s.flag('side_ash_fire')) return s.narrate('The signal fire burns. Somewhere far off, you imagine, someone sees it.');
    if (!(await s.confirm('Light the old signal fire?', 'Light it', 'Leave it'))) return;
    s.setFlag('side_ash_fire');
    s.sfx('fire');
    s.flash('#ffb060', 0.6);
    await s.narrate(['The signal fire catches on the first try, as if it has been waiting twenty years for someone to bother.', 'From the ashes beneath the grate you pull a commander\'s ring, warm as a hand.']);
    await s.give('side_ashwatch_ring');
  },

  // -------------------------------------------------------------------------
  // Hidden hunt I — Harrow's Hollow
  // -------------------------------------------------------------------------

  async bane(s) {
    if (s.flag('side_bane_done')) return s.narrate('The hollow is quiet. Wildflowers have started growing where the old man fell.');
    await s.narrate(['Bones, old and new. A hunter\'s horn, cracked. And in the dark at the back of the hollow, something that has been waiting a long time for someone worth eating.']);
    s.music('boss');
    const r = await s.battle('side_hidden_bane', { boss: true, bg: 'forest', music: 'boss' });
    if (r !== 'win') return;
    s.setFlag('side_bane_done');
    s.quest('side_hollow', null, null, 'done');
    await s.narrate('Among the bones, Harrow\'s horn — still sound enough to blow. And a fang the length of your forearm.');
    await s.give('side_harrow_fang');
    await s.give('phoenix_charm');
    await s.gold(5000);
  },

  // -------------------------------------------------------------------------
  // The Hollow Bell
  // -------------------------------------------------------------------------

  async bellArrive(s) {
    if (s.flag('side_bell_seen')) return;
    s.setFlag('side_bell_seen');
    await s.narrate(['A shard of the old world, and beneath it, hanging by its roots like a seed-pod, the bell-tower of the Abbey of Hours — upside-down.', 'Every few minutes, the bell inside it rings. No one is pulling the rope.']);
  },

  async sexton(s) {
    if (s.flag('side_bell_open')) return s.say('Sexton Orrin', 'The bell remembers the order now. Go on down to her. Go gently.');
    await s.say('Sexton Orrin', [
      'You came down the tower? Upside down? Ha. Welcome to the Hollow Bell. I\'m the sexton. I was the sexton. I am still, I think, the sexton.',
      'There are three chimes in this nave. The bell below won\'t let anyone pass until they\'re rung in the old order. The order we rang for weddings.',
      '"Low for the promise, high for the joy, and the middle for every day after."',
    ]);
    s.setFlag('side_bell_riddle');
  },


  async agathe(s) {
    if (s.flag('side_bell_done')) return s.say('Agathe', 'It\'s quiet. I didn\'t know it could be quiet. Thank you.');
    await s.say('Agathe', [
      'Oh! People. Real ones. You\'re all the right way up.',
      'I\'m Agathe. I ring the bell. I was ringing it when the sky broke, and the tower fell, and I just... kept ringing. In case anyone was still coming to the wedding.',
      'I can\'t stop. The bell won\'t let me. It thinks if it stops, everyone will be gone for real.',
    ]);
    await s.say('Wren', 'Maybe they are. Maybe it\'s alright to let it be quiet.');
    await s.say('Agathe', '...Will you ask it? It won\'t listen to me.');
  },

  async hollowBell(s) {
    if (s.flag('side_bell_done')) return;
    await SIDE.agathe(s);
    s.shake(0.3, 0.8);
    const r = await s.battle('side_boss_bell', { boss: true, bg: 'temple', music: 'boss' });
    if (r !== 'win') return;
    s.setFlag('side_bell_done');
    await s.narrate(['The bell rings once more — softly, the way you ring a bell at the end of something — and goes still.', 'Agathe sits down for the first time in a year, and laughs, and cries, and presses something cold into Wren\'s hand.']);
    await s.give('agathes_bell');
    s.journal('In the upside-down tower of the Hollow Bell a girl named Agathe had been ringing for a wedding that would never come. We helped the bell be quiet.');
  },

  // -------------------------------------------------------------------------
  // The Garden That Remembers
  // -------------------------------------------------------------------------

  async gardenArrive(s) {
    if (s.flag('side_garden_seen')) return;
    s.setFlag('side_garden_seen');
    await s.narrate(['After the Sundering, white flowers began to grow on a cemetery shard. When the wind moves them, they speak.', 'They say the last thing someone said before they died.']);
  },


  async gardener(s) {
    if (s.flag('side_garden_done')) return s.say('The White Gardener', 'The heart is quiet. Let them grow. Let them say what they need to.');
    await s.say('The White Gardener', [
      'Mind the beds. Everyone in them was loved by someone.',
      'I don\'t plant them. They come up on their own, a flower for every last word nobody was there to hear. I only keep the paths clear.',
      'At the heart there\'s a bloom that won\'t stop growing. It wants to hold every word ever spoken. It\'s strangling the others.',
    ]);
    if (s.state.party.includes('wren')) {
      await s.say('The White Gardener', '...You. Lantern-girl. There\'s a flower in the heart that turns toward you when you walk past. I think it\'s been waiting.');
    }
  },

  async lastBloom(s) {
    if (s.flag('side_garden_done')) return;
    await s.narrate('At the heart of the garden, a single bloom the size of a house, petals overlapping like a thousand mouths, all of them whispering at once.');
    const r = await s.battle('side_boss_bloom', { boss: true, bg: 'verdance', music: 'remnant' });
    if (r !== 'win') return;
    s.setFlag('side_garden_done');
    s.music('sad');
    await s.narrate(['As the great bloom withers, the voices untangle, one by one, into silence.', 'One small white flower is left at the heart. It turns toward Wren.']);
    await s.narrate('_"Grow up well, my little bird."_', { speed: 0.5 });
    await s.wait(1.2);
    await s.say('Wren', '...I\'m trying, Mom.', { speed: 0.6 });
    await s.narrate('Tangled in the roots, where the flower grew: a locket, small and tarnished. Inside, a tiny painting of three people.');
    await s.give('ysoldes_locket');
    s.journal('In the Garden That Remembers, a flower said Mom\'s last words. I found her locket in its roots. There are three of us in the painting.');
  },

  // -------------------------------------------------------------------------
  // Hidden hunt II — the Black Star
  // -------------------------------------------------------------------------

  async blackStar(s) {
    if (s.flag('side_star_done')) return s.narrate('Where the Black Star hung there is only sky now — bruised, broken, and yours.');
    await s.narrate(['Above the seven wounds, the sky goes the wrong kind of dark.', 'The Black Star does not shine. It takes. Light bends toward it and does not come back.']);
    const r = await s.battle('side_hidden_star', { boss: true, bg: 'gloam', music: 'finalboss' });
    if (r !== 'win') return;
    s.setFlag('side_star_done');
    s.quest('side_nadir', null, null, 'done');
    await s.narrate('The Black Star collapses into a single cold shard, small enough to hold. It hums a note below hearing.');
    await s.give('black_star_shard');
    await s.give('ribbon');
    await s.give('crest_tome', 3);
  },
};
