// CHAPTER 11 — "Seven Wounds" (Act III). The hub: the Halcyon's deck.
// Opening, the helm, shard bookkeeping, milestone scenes (Cassian's visit,
// going home, the eve of Evernoon) and the crew's talk between voyages.

export const SHARDS = [
  { key: 'salt', place: 'Saltglass' },
  { key: 'frost', place: 'Frosthollow' },
  { key: 'mire', place: 'Mirefen' },
  { key: 'thorn', place: 'Thornwood' },
  { key: 'sky', place: 'Skyreach' },
  { key: 'grand', place: 'the Grand Lantern' },
  { key: 'home', place: 'Lanternfall' },
];

export const shardCount = (s) => SHARDS.filter((k) => s.flag(`c11_shard_${k.key}`)).length;
const outerSix = (s) => SHARDS.slice(0, 6).every((k) => s.flag(`c11_shard_${k.key}`));

/** The running main objective, rebuilt from progress. */
export function mainObjective(s) {
  const n = shardCount(s);
  if (n === 7) return 'Talk to Corvin at the helm. Evernoon is waiting.';
  if (s.flag('c11_lf_open')) return 'Go home to Lanternfall. The last Shard is in Mom\'s Lantern.';
  if (outerSix(s)) return 'Six Shards. Return to the Halcyon.';
  const left = SHARDS.slice(0, 6).filter((k) => !s.flag(`c11_shard_${k.key}`) && (k.key !== 'grand' || s.flag('c11_grand_open')));
  return `Recover the Sun Shards (${n}/7): ${left.map((k) => k.place).join(', ')}. Set a course with Corvin at the helm.`;
}

/** Take a Remnant's Sun Shard. */
export async function claimShard(s, key) {
  if (s.flag(`c11_shard_${key}`)) return;
  s.setFlag(`c11_shard_${key}`);
  s.flash('#fff0c0', 0.6);
  s.sfx('holy');
  await s.give('sun_shard');
  const n = shardCount(s);
  await s.system(`Sun Shards: *${n} / 7*`);
  s.objective(mainObjective(s));
}

/** After a Remnant falls: offer the walk back to the ship. */
export async function returnToShip(s) {
  if (!(await s.confirm('Return to the Halcyon?'))) return;
  await s.fadeOut(0.8);
  await s.teleport('halcyon_deck', 12, 8, 'down');
}

/** Stand the rest of the party behind the player for a set-piece scene. */
const STAGE = [['ilse', -1, 1], ['bram', 1, 1], ['sable', -2, 2], ['pip', 0, 2], ['corvin', 2, 2]];
export function stageParty(s, x, y, dir = 'up', skip = []) {
  s.place('player', x, y, dir);
  for (const [id, dx, dy] of STAGE) {
    if (skip.includes(id) || !s.state.characters[id] || !s.field.grid.walkable(x + dx, y + dy)) continue;
    s.spawn(`p_${id}`, s.state.characters[id].lookId, x + dx, y + dy, dir);
  }
}
export function unstage(s) { for (const [id] of STAGE) s.remove(`p_${id}`); }

/** Gangplank exits from every Chapter 11 landing. */
export const gangplank = (x, y, w = 2) => ({ x, y, w, to: 'halcyon_deck', tx: 12, ty: 8, dir: 'down' });

// Party members stand at their posts aboard, in whatever they're wearing now.
const DECK_CREW = [['corvin', 4, 8, 'right', 'helm'], ['bram', 23, 9, 'right'], ['pip', 17, 8, 'down'], ['sable', 2, 9, 'left']];
export const HOLD_CREW = [['ilse', 10, 5, 'up']];
export function spawnCrew(s, crew) {
  for (const [id, x, y, dir, hint] of crew) {
    if (s.field.actors.has(id) || !s.state.characters[id]) continue;
    s.spawn(id, s.state.characters[id].lookId, x, y, dir, {
      name: s.state.characters[id].name, hint: hint === 'helm' ? 'Helm' : undefined, run: (ss) => CH11[`${id}Talk`](ss),
    });
  }
}

/** @type {import('../types/data').StoryScripts} */
export const CH11 = {
  // ================================================================== opening
  async opening(s) {
    if (s.flag('c11_open')) return;
    s.setFlag('c11_open');
    s.setFlag('act3');
    s.setFlag('sundered');
    for (const c of s.state.allMembers()) c.setLevel(56);
    s.stopMusic(0.5);
    await s.fadeOut(0);
    s.place('player', 12, 8, 'down');
    s.spawn('ilse_o', s.state.characters.ilse.look, 10, 9, 'right');
    s.place('bram', 15, 9, 'left');
    s.place('pip', 13, 10, 'up');
    s.place('sable', 11, 10, 'up');
    await s.wait(0.6);
    await s.narrate([
      'The Halcyon runs dark above the Ruin, every lamp shuttered,',
      'until the Noon Spire is only a white needle far behind — and then not even that.',
    ]);
    await s.chapter(11, 'Seven Wounds');
    s.music('ruin');
    await s.fadeIn(1.2);
    await s.say('Corvin', 'Right. Nobody\'s following us. Or they\'re following very politely.');
    await s.say('Pip', 'Is it over? Tell me it\'s over. I want to lie down on something that isn\'t moving.');
    await s.say('Ilse', 'It isn\'t over. Three things. One: he let us leave. Two: he let us leave because he doesn\'t need us. Three—');
    await s.say('Sable', 'Three: he needs the Shards.');
    s.face('player', 'sable');
    await s.say('Sable', 'He said it to me in the white room. "Then I will need all seven." He was not threatening. He was making a list.');
    await s.say('Bram', 'Seven Shards. The sun broke into seven. So... they fell somewhere?');
    await s.say('Sable', 'They fell home. Each one to its own Lantern. I can hear them. Like seven people humming in other rooms.');
    await s.say('Wren', 'The Lanterns are ruins. The Keepers are—');
    await s.wait(0.5);
    await s.say('Sable', 'Not all the way gone. Something is holding each Shard. What a Keeper was, wound around the light so tight it cannot let go.');
    await s.say('Ilse', 'Like the Penitent was Sir Aldous.');
    await s.emote('bram', '…');
    await s.say('Sable', 'Yes. Remnants.');
    await s.say('Wren', 'So Cassian sends his people to pry the Shards out of whatever\'s left of Tamsin. And Halvard. And Osk.');
    await s.say('Corvin', 'Or somebody gets there first. Somebody with a fast ship and a deeply irresponsible captain.');
    await s.wait(0.4);
    s.face('player', 'left');
    await s.pan(2, 8, 1.4);
    await s.narrate(['Off the stern, far out in the west, a single light burns on the edge of the dark.']);
    await s.say('Wren', '...There\'s a light. In the west.');
    await s.say('Corvin', 'Been there all year. Sailors call it the Widow\'s Lamp. Only Lantern in the world still burning.');
    await s.follow(1.0);
    await s.wait(0.6);
    await s.say('Sable', 'One of the seven voices is there, Wren.');
    await s.say('Wren', 'I know whose voice it is.');
    await s.wait(1.0);
    await s.say('Wren', 'Not yet. We start somewhere else. Okay? Somewhere else.');
    await s.say('Ilse', '...Okay.');
    await s.say('Pip', 'And when we\'ve got all seven? What then?');
    await s.say('Wren', 'Then we go to Evernoon and we— I don\'t know yet. Something better than what he\'s doing.');
    await s.say('Sable', 'That is not a plan.');
    await s.say('Pip', 'It\'s a Wren plan. They work out. Mostly. Eventually. With screaming.');
    await s.say('Corvin', 'Here\'s the actual plan. I fly. You lot do the heroic bits. Come find me at the helm when you\'ve picked a heading — and get some sleep first. All of you. That\'s an order from the only adult on this boat.');
    await s.say('Bram', 'I\'m nineteen.');
    await s.say('Corvin', 'Like I said.');
    s.remove('ilse_o');
    s.place('bram', 23, 9, 'right');
    s.place('pip', 17, 8, 'down');
    s.place('sable', 2, 9, 'left');
    await s.system('The Halcyon is your home in Act III. Talk to *Corvin* at the helm to fly anywhere in the Ruin. Rest in the bunks below decks, trade with *Mags* on deck, and save at the Hearthstone on the forecastle.');
    await s.system('Your companions will have things to say between voyages — and some of them may ask something of you.');
    s.quest('c11_shards', 'Seven Wounds', 'Recover the seven Sun Shards from the Remnants of the Keepers before Cassian does.');
    s.objective(mainObjective(s));
    s.journal('We got away from the Noon Spire. Cassian needs seven Sun Shards to finish Evernoon. Each one is held by what\'s left of a Keeper. We\'re going to get there first. (There\'s a light in the west. I\'m not ready.)');
  },

  /** Deck onEnter: crew to their posts, then at most one milestone scene per boarding. */
  async deckEnter(s) {
    for (const id of ['wren', 'ilse', 'bram', 'sable', 'pip', 'corvin']) {
      if (!s.state.party.includes(id)) await s.join(id, true);
    }
    spawnCrew(s, DECK_CREW);
    if (!s.flag('c11_open')) return CH11.opening(s);
    if (s.flag('c11_storm_now')) return (await import('./ch11_rites.js')).RITES.stormVoyage(s);
    const n = shardCount(s);
    if (n === 7 && !s.flag('c11_eve')) return CH11.eve(s);
    if (outerSix(s) && !s.flag('c11_lf_open')) return CH11.ready(s);
    if (n >= 3 && !s.flag('c11_cassian_visit')) return CH11.cassianVisit(s);
    const { RITES } = await import('./ch11_rites.js');
    if (n >= 2 && !s.flag('c11_reef_open')) return RITES.compass(s);
    if (s.flag('c11_shard_salt') && !s.flag('c11_scrap_open')) return RITES.kiteLetter(s);
    if (s.flag('c11_pip_kite')) return RITES.kiteFlying(s);
    return null;
  },

  // ================================================================== the helm
  async helm(s) {
    if (s.flag('c11_eve')) return CH11.flyToEvernoon(s);
    const n = shardCount(s);
    const lines = [
      'Pick a heading, sparrow. She\'ll get you there. Probably in one piece.',
      n >= 3 ? 'You\'re making Cassian nervous. I can tell. The sky\'s got that tight look.' : 'The Ruin\'s big, and the Halcyon\'s small. I like those odds. Nobody can find us.',
      s.flag('c11_lf_open') ? 'West, then. I\'ll take her in slow.' : 'Where to?',
    ];
    await s.say('Corvin', lines[Math.min(2, Math.floor(n / 3))]);
    const stormwall = s.flag('c11_storm_open') && !s.flag('c11_rite_corvin_done');
    if (stormwall) {
      const i = await s.choice(['Set a course', 'Fly into the Stormwall', 'Not yet'], { cancel: 2 });
      if (i === 2) return null;
      if (i === 1) return (await import('./ch11_rites.js')).RITES.stormwallStart(s);
    }
    return s.worldMap();
  },

  // ================================================================== Cassian, at three Shards
  async cassianVisit(s) {
    if (s.flag('c11_cassian_visit')) return;
    s.setFlag('c11_cassian_visit');
    s.setFlag('c11_grand_open');
    s.stopMusic(1.5);
    s.place('player', 8, 8, 'left');
    s.spawn('ilse_c', s.state.characters.ilse.look, 9, 10, 'left');
    s.place('bram', 10, 7, 'left');
    s.place('pip', 10, 9, 'left');
    s.place('sable', 7, 10, 'left');
    await s.wait(0.6);
    s.flash('#ffffff', 0.8);
    s.sfx('holy');
    s.spawn('cassian_p', 'cassian', 5, 8, 'right');
    await s.wait(0.6);
    s.music('cassian');
    await s.emote('player', '!');
    await s.say('Bram', 'Behind me. All of you, behind me—');
    await s.say('Cassian', 'Please put the sword down, Bram. I\'m not really here. Neither, in a sense, are you. Nothing is anywhere very solid anymore.');
    await s.say('Corvin', 'Get off my boat.');
    await s.say('Cassian', 'Corvin. You look well. You look _sober_, which is new.');
    await s.say('Cassian', 'Wren. Three Shards. I felt each one go out, the way you feel a tooth come loose.');
    await s.say('Wren', 'They were Keepers. They were stuck in the worst moment of their lives, and they were _hurting_.');
    await s.say('Cassian', 'Yes. And you ended them. In Evernoon they would have had their best day instead, every day, forever. I want you to understand the trade you are making on their behalf.');
    await s.say('Wren', 'They didn\'t want your forever. Not one of them asked for it.');
    await s.say('Cassian', 'No one asks for the sun to rise either.');
    s.face('cassian_p', 'sable');
    await s.say('Sable', 'You are not trying to stop the world from hurting. You are trying to stop _you_ from hurting.');
    await s.wait(1.0);
    await s.say('Cassian', '...Lysa used to say things like that. Blunt as a spoon.');
    await s.say('Sable', 'I am not Lysa.');
    await s.say('Cassian', 'No. I\'m told you were very clear about that.');
    s.face('cassian_p', 'player');
    await s.say('Cassian', 'The ward on the Grand Lantern has fallen, now that three of its sisters are dark. Garrick holds it. I would ask you not to hurt him. He has only ever done what I asked of him.');
    await s.say('Bram', 'That\'s the whole problem with him.');
    await s.say('Cassian', 'And Wren.');
    await s.wait(0.8);
    await s.say('Cassian', 'The light in the west. You know whose hands it is in.');
    await s.say('Cassian', 'She has held it for a year so that you could reach the boat. Will you take that from her too?');
    s.flash('#ffffff', 0.5);
    s.remove('cassian_p');
    await s.wait(1.2);
    s.music('ruin');
    await s.say('Corvin', 'Well. I hate him a completely normal amount.');
    s.face('player', 'down');
    await s.say('Ilse', 'Wren. Look at me. He says the true thing in the worst way on purpose. It\'s what he does.');
    await s.say('Wren', 'I\'m okay.');
    await s.say('Ilse', 'You said "okay."');
    await s.say('Wren', '...I know what I said.');
    s.remove('ilse_c');
    s.place('bram', 23, 9, 'right');
    s.place('pip', 17, 8, 'down');
    s.place('sable', 2, 9, 'left');
    await s.system('The *Grand Lantern* of Aurenne can now be reached from the helm.');
    s.objective(mainObjective(s));
    s.journal('Cassian came aboard — not really, a reflection made of Gloam. He says every Shard we take ends what\'s left of a Keeper. He says Mom has held the light for a year. The Grand Lantern is open. Garrick is waiting.');
  },

  // ================================================================== six Shards: going home
  async ready(s) {
    if (s.flag('c11_lf_open')) return;
    s.setFlag('c11_lf_open');
    s.music('sad');
    s.place('player', 3, 9, 'left');
    s.place('sable', 2, 10, 'up');
    s.spawn('ilse_r', s.state.characters.ilse.look, 4, 10, 'up');
    await s.wait(0.5);
    await s.pan(1, 8, 1.2);
    await s.narrate(['Six Shards hum together in the hold. Off the stern, the light in the west burns, steady as a held breath.']);
    await s.follow(0.8);
    await s.say('Wren', 'Six.');
    await s.say('Sable', 'Six. The seventh is singing very quietly. I think it is trying not to wake someone.');
    await s.say('Wren', 'I kept saying "not yet." Like if I didn\'t go, she\'d just... keep being there.');
    await s.say('Ilse', 'I know.');
    await s.say('Wren', 'I\'m not ready, Ilse.');
    await s.say('Ilse', 'You don\'t have to be ready. You just have to go. You taught me that. I hated it.');
    await s.wait(0.6);
    await s.say('Wren', '...Corvin.');
    await s.say('Corvin', 'Heading west, sparrow. I\'ll take her in slow.');
    s.remove('ilse_r');
    s.place('sable', 2, 9, 'left');
    await s.system('*Lanternfall* can now be reached from the helm. Once the seventh Shard is taken, Evernoon will not wait long — finish anything you have left undone first.');
    s.objective(mainObjective(s));
    s.journal('Six Shards. The last one is at home, in Mom\'s Lantern. I told Corvin to head west. I\'m not ready. Ilse says that isn\'t the point.');
  },

  // ================================================================== seven: the eve of Evernoon
  async eve(s) {
    if (s.flag('c11_eve')) return;
    s.setFlag('c11_eve');
    s.music('lanternfall');
    s.place('player', 12, 8, 'down');
    s.spawn('ilse_e', s.state.characters.ilse.look, 10, 9, 'right');
    s.place('bram', 14, 9, 'left');
    s.place('pip', 13, 10, 'up');
    s.place('sable', 11, 10, 'up');
    await s.wait(0.6);
    await s.narrate([
      'For the first time in a year there is no light in the west.',
      'In the hold, seven Shards lie together in a crate stuffed with Pip\'s spare socks. They are singing.',
      'Far in the east, Evernoon burns white — a noon with no evening, waiting.',
    ]);
    await s.say('Pip', 'Seven. We actually did it. I want that on a plaque. "Pip Was Here, And Also Some Other People."');
    await s.say('Bram', 'I\'d go on that plaque.');
    await s.say('Pip', 'In small letters.');
    await s.say('Ilse', 'Wren. How are you?');
    await s.wait(0.8);
    await s.say('Wren', 'Not okay.');
    await s.wait(0.6);
    await s.say('Wren', 'But better than okay, kind of? Is that a thing? She said goodbye. I got to say it back. Most people don\'t.');
    await s.say('Sable', 'It is a thing. I think it is most of what grown-ups are.');
    await s.say('Wren', 'The light\'s still here. Look.');
    s.flash('#ffe8b0', 0.6);
    s.sfx('heal');
    await s.narrate(['In Wren\'s open hand, a small warm light. It does not need a Lantern.']);
    await s.say('Bram', 'What do we do with them? The Shards. When we get there.');
    await s.say('Sable', 'They want to be together. Cassian wants to make them into one moment. I do not think they want to be a moment.');
    await s.say('Wren', 'Then we\'ll ask them what they want to be.');
    s.face('player', 'left');
    await s.say('Corvin', 'Evernoon whenever you\'re ready, sparrow. Not before. Come find me at the helm.');
    s.remove('ilse_e');
    s.place('bram', 23, 9, 'right');
    s.place('pip', 17, 8, 'down');
    s.place('sable', 2, 9, 'left');
    s.quest('c11_shards', null, null, 'done');
    s.objective(mainObjective(s));
    s.journal('Seven Shards. The light in the west is out — it\'s in my hand now. Evernoon is waiting in the east. Corvin says we go when I say.');
  },

  async flyToEvernoon(s) {
    await s.say('Corvin', 'Evernoon. Last chance to turn around and become goat farmers.');
    const i = await s.choice(['Fly to Evernoon (there is no coming back)', 'Set a course elsewhere', 'Not yet'], { cancel: 2 });
    if (i === 1) return s.worldMap();
    if (i === 2) {
      await s.say('Corvin', 'Take your time. The end of the world\'s been waiting a year. It can wait an afternoon.');
      return null;
    }
    s.music('afterlight');
    await s.say('Corvin', 'Everybody hold on to something that isn\'t me.');
    await s.say('Ilse', 'Three things. One: we come back. Two: we all come back. Three—');
    await s.say('Wren', 'Three: if I die, you\'re telling my mother.');
    await s.wait(0.6);
    await s.say('Ilse', '..._Wren._');
    await s.say('Wren', 'Too soon?');
    await s.say('Ilse', 'Way too soon. Three: you don\'t get to die. That\'s three.');
    await s.say('Bram', 'For the record, I am terrified.');
    await s.say('Pip', 'Me too. Is that allowed? I\'m doing it anyway.');
    await s.say('Sable', 'I am also afraid. It is a very crowded feeling.');
    await s.say('Wren', 'Corvin. Let\'s go end a perfect day.');
    s.setFlag('act3_done');
    s.journal('We turned east. Everyone said they were scared. Everyone came anyway.');
    await s.fadeOut(1.5);
    await s.chapter(12, 'Evernoon');
    s.objective('Enter Evernoon. Stop the Vespersong.');
    await s.teleport('evernoon_gate', 20, 40, 'up');
  },

  // ================================================================== crew talk
  async corvinTalk(s) { return CH11.helm(s); },

  async bramTalk(s) {
    const { RITES } = await import('./ch11_rites.js');
    if (s.flag('c11_vigil_offer') && !s.flag('c11_vigil_open')) return RITES.bramAsk(s);
    if (s.flag('c11_rite_bram_done')) {
      return s.say('Bram', s.flag('c11_shard_grand')
        ? ['Sir Bram Kestrel. I keep saying it under my breath. Pip caught me. It was humiliating.', 'Garrick walked out of the Grand Lantern on his own feet. I let him. I think Aldous would have, too.']
        : ['Sir Bram Kestrel. I keep saying it under my breath.', 'Garrick is at the Grand Lantern. I\'m still scared of him. That\'s alright. I\'m scared of lots of things. I go anyway now.']);
    }
    if (s.flag('c11_shard_frost') && !s.flag('c11_vigil_open')) return RITES.bramAsk(s);
    if (s.flag('c11_shard_grand')) return s.say('Bram', ['I beat him. Garrick. On my own, with my own hands, and they were shaking the whole time.', 'I think that\'s the trick. Nobody tells you your hands shake the whole time.']);
    if (s.flag('c11_grand_open')) return s.say('Bram', ['The Grand Lantern. Garrick. I\'ve been dreaming about his voice for a year.', 'Don\'t let me do anything stupid. Or do. I haven\'t decided.']);
    return s.say('Bram', ['I stand up here at the bow because it\'s the first place anything will hit us. Very knightly.', 'Also the wind is nice. Don\'t tell anyone the second part.']);
  },

  async pipTalk(s) {
    const { RITES } = await import('./ch11_rites.js');
    if (s.flag('c11_scrap_open') && !s.flag('c11_rite_pip_done')) {
      return s.say('Pip', ['Scrapfall. Tilly. Corvin knows the way.', 'I\'m fine. I\'m fine. I\'m completely fine, stop looking at me like that.']);
    }
    if (s.flag('c11_rite_pip_done')) return RITES.pipAfter(s);
    if (s.flag('c11_shard_salt')) return s.say('Pip', ['Tamsin said "go be little." Like it\'s a thing you just do.', 'How do you do it? Do you just... sit there? Being little? I don\'t remember how.']);
    return s.say('Pip', ['I climbed the mast. Corvin said not to. That\'s how I knew it\'d be good up there.', 'You can see the whole Ruin. It looks like somebody dropped a plate.']);
  },

  async sableTalk(s) {
    if (s.flag('c11_rite_sable_done')) return s.say('Sable', ['I tied the ribbon in my hair. Then I untied it and tied it on my wrist. Then my hair again.', 'Ilse says this is called "fussing." I like fussing.']);
    if (s.flag('c11_rift_open')) return s.say('Sable', ['Elowen said the girl is waiting under her roots. In the Thornwood, past the crystal trees.', 'I want to go, Wren. I am frightened of her. I want to go anyway. Pip says that means it is important.']);
    if (s.flag('c11_lf_open') && !s.flag('c11_shard_home')) return s.say('Sable', ['The voice in the west is singing very quietly now.', 'It is a lullaby, I think. I do not know the words. You might.']);
    if (s.flag('c11_shard_home')) return s.say('Sable', ['Your mother looked at me as if I were already someone.', 'Not Lysa. Not a Remembrance. Someone. I did not know a look could do that.']);
    return s.say('Sable', ['I watch the west because you will not, yet.', 'Someone should. It is a very lonely light.']);
  },

  async ilseTalk(s) {
    const { RITES } = await import('./ch11_rites.js');
    if (s.flag('c11_ilse_offer') && !s.flag('c11_ilse_rite_open')) return RITES.ilseAsk(s);
    if (s.flag('c11_rite_ilse_done')) return s.say('Ilse', ['I slept nine hours last night. Nine. Bram checked on me twice. He thought I was dead.', 'I\'m going to do it again tonight. Out of spite.']);
    if (s.flag('c11_ilse_rite_open')) return s.say('Ilse', ['The infirmary in Mirefen. The east island, past the boardwalk. The red cord on the door.', 'I\'ll cut it myself.']);
    return s.say('Ilse', [
      'I turned the galley into an infirmary. Corvin objected. Then he cut his hand on a sardine tin and stopped objecting.',
      s.flag('c11_shard_mire') ? 'Osk kept her patients alive for a year after they should have gone. I keep thinking about that. I keep thinking I\'d have done the same.' : 'Eat something. That\'s not advice, that\'s a diagnosis.',
    ]);
  },

  async magsTalk(s) {
    await s.say('Mags', s.flag('c11_mags_met')
      ? 'Back again, duckling? Mags\'s Drift Market: everything here fell off something else.'
      : ['Margery Pennywhistle, purveyor of things that fell off other things. Call me Mags. Your captain owes me money, so I tied my barge to his boat. Now he can\'t run off.', 'Best arrangement I\'ve had in years. Buy something. Help him pay me back.']);
    s.setFlag('c11_mags_met');
    const i = await s.choice(['Fine goods', 'Ship\'s stores', 'Leave'], { cancel: 2 });
    if (i === 0) return s.shop('c11_drift');
    if (i === 1) return s.shop('halcyon');
    return null;
  },

  async nellTalk(s) {
    const { RITES } = await import('./ch11_rites.js');
    if (s.has('c11_edrins_cutlass')) return RITES.reforgeCutlass(s);
    if (s.has('c11_tilly_knife')) return RITES.reforgeKnife(s);
    await s.say('Nell', s.flag('c11_nell_met')
      ? ['If it\'s broken, I can fix it. If it isn\'t broken, give me an hour.', shardCount(s) ? 'Those Sun Shards in the hold run hot enough to forge a star. Bring me anything that needs a second life.' : 'Nothing to forge on, though. The furnace wants something hotter than coal.']
      : ['Nell. Engineer. Don\'t touch the red lever, don\'t touch the blue lever, don\'t touch the lever that isn\'t painted.', 'The Halcyon\'s held together with spite and copper wire. Mostly spite. Mine.']);
    s.setFlag('c11_nell_met');
    return null;
  },

  async bunks(s) {
    await s.say(null, 'Six bunks, three hammocks, one of them Pip\'s. Someone has left a sock on every pillow, possibly as a system.', { style: 'narration' });
    return s.inn(0, 'the Halcyon\'s bunks');
  },

  async sternView(s) {
    if (s.flag('c11_shard_home')) return s.narrate('The west is dark now. It is only the west.');
    if (s.flag('c11_lf_open')) return s.narrate('The light in the west. Close enough now to see that it flickers, the way a hand trembles when it has held something too long.');
    return s.narrate('Far out in the west, a single light. You look at it for exactly one second, then look somewhere else.');
  },
};
