// CHAPTER 11 — the seven Remnant dungeons: arrivals, puzzles, lore and bosses.

import { claimShard, returnToShip, mainObjective, stageParty, unstage } from './ch11.js';

/** A Starfall Fragment for the Starseer's quest, embedded in a crystal. */
export async function takeStar(s, id) {
  if (s.flag(`c11_star_${id}`)) return;
  s.setFlag(`c11_star_${id}`);
  s.clearBlocker('star');
  s.flash('#d0e8ff', 0.4);
  await s.narrate('Inside the crystal, a splinter of light no longer than a finger. It hums a note too high to hear. When you touch it, the crystal lets it go.');
  await s.give('c11_star_fragment');
  if (!s.flag('c11_orrery_met')) await s.say('Sable', 'It is not a piece of the sun. It is something smaller and farther away. It is lost.');
  else await s.say('Pip', 'Another one for the star lady. She\'d better have biscuits.');
}

/** @type {import('../types/data').StoryScripts} */
export const REM = {
  // ================================================================== SALTGLASS — the Blind Choir
  async sgArrive(s) {
    s.music('desert');
    await s.say('Corvin', 'Saltglass. Used to be the hottest place in Solmere. Now it\'s the hottest place in the sky. Same sand, more falling.');
    await s.say('Pip', 'Tamsin\'s up there.');
    await s.say('Pip', 'She gave me my Crest. Way too early. She said, "I\'ll catch hell for this, little thief, and it\'ll be worth every minute."');
    await s.say('Sable', 'Listen.');
    await s.wait(0.8);
    await s.narrate('Faintly, from the top of the glass steps: a choir, holding one note. It does not breathe. It does not stop.');
    s.objective('Climb the Glass Steps to the Lantern of Saltglass.');
  },

  async sgBell(s, hour) {
    if (s.flag('c11_sg_bells')) return s.narrate('The glass bell hums faintly, still remembering its hour.');
    const notes = {
      morning: 'A bright, clean note, like the first gull of the day.',
      noon: 'A round, full note that hangs in the air and refuses to fall.',
      evening: 'A low note that leans toward the west, the way a tired person leans on a door.',
    };
    await s.narrate(`A bell of fused desert glass. It faces ${hour === 'morning' ? 'east, toward a sunrise that no longer comes' : hour === 'noon' ? 'straight up, at nothing' : 'west, toward the dark'}.`);
    if (!(await s.confirm('Strike the bell?'))) return;
    s.sfx('holy');
    await s.narrate(notes[hour]);
    const rung = (s.vars.c11_bells = [...(s.vars.c11_bells || []), hour]);
    const order = ['morning', 'noon', 'evening'];
    if (rung.some((h, i) => h !== order[i])) {
      s.vars.c11_bells = [];
      s.shake(0.3, 0.8);
      await s.narrate('The bells clash. The whole garden shrieks like a struck window, and the choir in the glass answers.');
      await s.battle('c11_sg_bells', { bg: 'desert' });
      await s.say('Ilse', 'Wrong order. The stone said "as the sun walks." So — where does the sun start?');
      return;
    }
    if (rung.length < 3) return;
    s.setFlag('c11_sg_bells');
    s.vars.c11_bells = [];
    await s.wait(0.4);
    await s.pan(20, 15, 1.0);
    s.flash('#ffffff', 0.4);
    s.clearBlocker('glass_wall');
    s.sfx('burst');
    await s.wait(0.6);
    await s.follow(0.8);
    await s.say('Pip', 'Tamsin taught me that. "The sun walks, little thief. You only have to listen to where it\'s going."');
    await s.say('Bram', 'She taught you about bells?');
    await s.say('Pip', 'She taught me about everything. In about a week. Like she knew she didn\'t have long.');
    s.objective('The glass wall is broken. Go up to the Lantern.');
  },

  async sgBoss(s) {
    if (s.flag('c11_shard_salt')) return;
    stageParty(s, 20, 9, 'up');
    s.stopMusic(1);
    await s.pan(20, 6, 1.2);
    await s.narrate('Before the dead Lantern stand three figures with their eyes bound in white cloth. One note pours out of them. It has been pouring out for a year.');
    await s.say('???', 'Who walks in my Lantern?', { portrait: false });
    await s.say('???', 'I know those feet. Light on the heel, heavy on the toe, always ready to run. Little thief. You\'ve grown.', { portrait: false });
    await s.say('Pip', '...Tamsin?');
    await s.say('Tamsin', 'I gave you a Crest you weren\'t old enough to carry. I heard you grow up too fast, all the way from here. Every step.');
    await s.say('Pip', 'I\'m fine. I\'m— I\'m _fine_.');
    await s.say('Tamsin', 'Liar. You always were a lovely liar.');
    await s.say('Tamsin', 'Stay. Sing with us. If you sing loud enough, you cannot hear the world end. I have not heard it once.');
    await s.say('Sable', 'She is singing so she will not have to listen.');
    await s.say('Wren', 'Tamsin— it already ended. We heard it. We\'re still here.');
    await s.say('Tamsin', 'Then I will sing louder.');
    s.music('boss');
    const r = await s.battle('c11_boss_choir');
    if (r !== 'win') return;
    s.music('sad');
    await s.narrate('The note breaks. In the silence after it, the blindfolds slip, one by one, to the glass.');
    await s.say('Tamsin', 'Ah. It\'s quiet. I had forgotten quiet.');
    s.face('remnant', 'down');
    await s.say('Tamsin', 'Little thief. Come here.');
    await s.say('Pip', '...I\'m here.');
    await s.say('Tamsin', 'Go be little a while longer. That is an order from a Keeper. It is the last one I have, so you had better obey it.');
    await s.say('Pip', 'I don\'t— I don\'t know how anymore.');
    await s.say('Tamsin', 'Nobody does. Practice.');
    s.flash('#fff4d0', 0.8);
    s.remove('remnant'); s.remove('husk1'); s.remove('husk2');
    await s.wait(0.8);
    await claimShard(s, 'salt');
    await s.say('Corvin', 'You alright, kid?');
    await s.say('Pip', 'No. Shut up. Yes. Give me a minute.');
    await s.say('Corvin', 'Take two.');
    unstage(s);
    await s.follow(0.6);
    s.journal('Saltglass. Tamsin was a choir, singing so she wouldn\'t hear the end of the world. She told Pip to go be little. He didn\'t say anything for a long time after.');
    s.music('desert');
    await returnToShip(s);
  },

  // ================================================================== FROSTHOLLOW — the Frozen Penitence
  async fhArrive(s) {
    s.music('snow');
    await s.say('Bram', 'This is where he— the avalanche. Right up there.');
    await s.say('Ilse', 'We saw him go under. He was smiling.');
    await s.say('Corvin', 'Monks. Always smiling at the worst possible moment. It\'s the vow of silence. All the jokes back up.');
    await s.say('Sable', 'He is still up there. He is very cold, and he is apologizing.');
    s.objective('Climb Frosthollow\'s frozen terraces to the Lantern on the peak.');
  },

  async fhBrazier(s, which) {
    const flagName = `c11_fh_brazier_${which}`;
    if (s.flag(flagName)) return s.narrate('The brazier burns steadily. Somewhere below, meltwater runs.');
    await s.narrate('A monastery brazier, packed with oil-black kindling that was never lit. Frost covers it like lace.');
    if (!(await s.confirm('Light the brazier?'))) return;
    if (which === 'e' && !s.flag('c11_fh_golem')) {
      s.shake(0.4, 1.0);
      await s.narrate('The snowbank beside the brazier stands up.');
      const r = await s.battle('c11_fh_golem', { bg: 'snow' });
      if (r !== 'win') return;
      s.setFlag('c11_fh_golem');
    }
    s.setFlag(flagName);
    s.sfx('burst');
    await s.say('Corvin', 'Allow me. Fire\'s the one thing I\'m reliably good at starting.');
    s.flash('#ffb060', 0.4);
    const wall = which === 'w' ? 'ice_a' : 'ice_b';
    const [px, py] = which === 'w' ? [19, 21] : [19, 11];
    await s.pan(px, py, 1.0);
    s.clearBlocker(wall);
    await s.narrate('Heat rolls up the cliff. On the ramp above, the wall of ice sags, weeps, and slides away.');
    await s.follow(0.8);
    s.objective(which === 'w' ? 'The way to the frozen lake is open. Keep climbing.' : 'The way to the peak is open.');
  },

  async fhBoss(s) {
    if (s.flag('c11_shard_frost')) return;
    stageParty(s, 22, 9, 'up');
    s.stopMusic(1);
    await s.pan(22, 6, 1.2);
    await s.narrate('At the Lantern\'s foot, a monk kneels in the snow. Frost has grown over him like a second robe. He does not look up.');
    await s.say('Halvard', 'I should have said it on the first day. "This fork is wrong." Four words.');
    await s.say('Halvard', 'I waited to be certain. Certainty is a luxury for people with time.');
    await s.say('Bram', 'Brother Halvard— you saved us. The avalanche. We\'d all be dead.');
    await s.say('Halvard', 'I buried a mountain on top of my own foolishness. That is not saving. That is _tidying_.');
    await s.say('Halvard', 'Kneel with me, young knight. Penance is warm, once you stop fighting the cold.');
    await s.say('Ilse', 'That isn\'t penance. That\'s freezing to death very slowly and calling it a virtue.');
    await s.wait(0.5);
    await s.say('Bram', '...He\'s been saying sorry to a mountain for a year.');
    await s.say('Wren', 'Bram?');
    await s.say('Bram', 'Nothing. I\'m fine. Let\'s get him up.');
    s.music('boss');
    const r = await s.battle('c11_boss_penitence');
    if (r !== 'win') return;
    s.music('sad');
    await s.narrate('The ice splits down the middle with a sound like a held breath let go.');
    await s.say('Halvard', 'Ah. The young knight.');
    s.face('remnant', 'down');
    await s.say('Halvard', 'You carry the same frost, I think. Guilt keeps a man very still. Always looking back over his shoulder at the thing he did not do.');
    await s.say('Bram', '...Yes.');
    await s.say('Halvard', 'Look forward, boy. It is the only direction that thaws.');
    s.flash('#e8f4ff', 0.8);
    s.remove('remnant');
    await s.wait(0.8);
    await claimShard(s, 'frost');
    await s.say('Bram', 'Look forward.');
    await s.say('Pip', 'You alright?');
    await s.say('Bram', 'There\'s a place near here. In the Greyspine. I... I\'ll tell you on the ship.');
    s.setFlag('c11_vigil_offer');
    unstage(s);
    await s.follow(0.6);
    s.journal('Frosthollow. Brother Halvard was kneeling in the snow, saying sorry for being too slow. He told Bram to look forward. Bram wants to tell us something.');
    s.music('snow');
    await returnToShip(s);
  },

  // ================================================================== MIREFEN — the Mire Mother
  async mfArrive(s) {
    s.music('swamp');
    await s.say('Ilse', 'Gloam-rot. I can smell it already.');
    await s.say('Pip', 'Smells like a sock died.');
    await s.say('Ilse', 'That is exactly what it smells like. Don\'t touch anything. Don\'t touch _me_.');
    await s.say('Sable', 'Someone is singing a lullaby. Very badly. Very tenderly.');
    s.objective('Find a way through the rot to the Lantern of Mirefen.');
  },

  async mfCenser(s) {
    if (s.has('c11_osk_censer') || s.flag('c11_mf_censer')) return s.narrate('Osk\'s herb-shed. The cauldron is cold. Bundles of bitterleaf hang like sleeping bats.');
    s.setFlag('c11_mf_censer');
    await s.narrate('Osk\'s herb-shed: a cold cauldron, bundles of bitterleaf, and a dented brass censer hanging from a hook marked, in neat letters, FOR ROT.');
    await s.give('c11_osk_censer');
    await s.say('Ilse', 'Bitterleaf smoke. Mirefen healers burned it to keep the rot off the wards. It doesn\'t cure anything. It buys time.');
    await s.say('Wren', 'Time\'s good.');
    await s.say('Ilse', 'Time is the only medicine there is. Everything else is a way of buying more of it.');
    s.objective('Burn the rot-blooms off the boardwalks with Osk\'s Censer.');
  },

  async mfRot(s, id) {
    if (!s.has('c11_osk_censer')) {
      await s.narrate('Gloam-rot blooms have grown across the boardwalk in a hedge of violet crystal. They pulse, slowly, like something breathing in its sleep.');
      return s.say('Ilse', 'Don\'t touch it. I mean it, Pip. There\'ll be something in Osk\'s herb-shed for this — every healer keeps rot-smoke.');
    }
    await s.narrate('Ilse lights the censer and swings it, low and steady, the way you would rock a cradle.');
    s.sfx('burst');
    if (id === 'rot_b' && !s.flag('c11_mf_rot_fight')) {
      s.setFlag('c11_mf_rot_fight');
      await s.narrate('The blooms shriek as they shrivel — and the things nesting in them come boiling out.');
      const r = await s.battle('c11_mf_leeches', { bg: 'swamp' });
      if (r !== 'win') return;
    }
    s.clearBlocker(id);
    await s.narrate('The blooms curl and crumble to gray ash.');
    if (id === 'rot_b') s.objective('The Lantern of Mirefen lies ahead.');
  },

  async mfBoss(s) {
    if (s.flag('c11_shard_mire')) return;
    stageParty(s, 20, 8, 'up');
    s.stopMusic(1);
    await s.pan(20, 5, 1.2);
    await s.narrate('Something rises from the swamp before the Lantern: huge, swollen with black water, cradling shapes in its arms the way you hold a sick child.');
    await s.say('Osk', 'Hush, hush. Mother\'s here. Nobody dies in Mirefen. Nobody. Not while I\'m awake.');
    await s.say('Ilse', 'Those are— Wren, those are _patients_.');
    await s.say('Osk', 'Mender. Oh, thank the light. You have the hands. Help me. They need their medicine every hour, and the hours never end.');
    await s.say('Ilse', '...How long have you been awake?');
    await s.say('Osk', 'Since the sun broke. Someone must be.');
    await s.wait(0.8);
    await s.say('Ilse', 'I know.');
    await s.say('Wren', 'Ilse—');
    await s.say('Ilse', 'I _know_, Wren. Let\'s let her sleep.');
    s.music('boss');
    const r = await s.battle('c11_boss_mother');
    if (r !== 'win') return;
    s.music('sad');
    await s.narrate('The black water runs out of her like a fever breaking. What is left is a small, stooped woman in a healer\'s hood, looking at her empty arms.');
    await s.say('Osk', 'Oh. Oh, they\'re sleeping. Look at them. All of them, finally sleeping.');
    await s.say('Osk', 'Thank you, child. I couldn\'t— a Mender can\'t be the one to stop. You understand.');
    await s.say('Ilse', 'I understand.');
    s.face('remnant', 'down');
    await s.say('Osk', 'You have the look. Ward-tired. Listen to an old woman who got it wrong.');
    await s.say('Osk', 'The sick will always be there tomorrow. _You_ must be there too. That means sleeping. That means wanting things. A healer who wants nothing has nothing left to heal with.');
    await s.say('Osk', 'My staff is in the infirmary, on the east island. Red cord on the door. Take it. It never did me any good on a hook.');
    s.flash('#d0ffd8', 0.8);
    s.remove('remnant');
    await s.wait(0.8);
    await claimShard(s, 'mire');
    await s.say('Ilse', '...Her staff.');
    await s.say('Bram', 'You should take it.');
    await s.say('Ilse', 'I\'ll think about it.');
    s.setFlag('c11_ilse_offer');
    unstage(s);
    await s.follow(0.6);
    s.journal('Mirefen. Mother Osk had kept her patients alive for a year after they should have gone. Ilse let her sleep. Osk left Ilse her staff, in the infirmary on the east island. Ilse says she\'ll think about it. (She wants it.)');
    s.music('swamp');
    await returnToShip(s);
  },

  // ================================================================== THORNWOOD — the Withered Bloom
  async twArrive(s) {
    s.music('forest');
    await s.say('Sable', 'This is where Elowen told us about Lysa. The trees were green then.');
    await s.say('Bram', 'Is it me, or are the trees... sad?');
    await s.say('Corvin', 'It isn\'t you. They\'re dying. Trees do sad very well. They\'ve had practice.');
    s.objective('Find a way through the thorns to the Lantern of Thornwood.');
  },

  async twShrine(s) {
    if (s.flag('c11_tw_ember')) return s.narrate('The statue\'s hands are closed now, around nothing, very gently.');
    s.setFlag('c11_tw_ember');
    await s.narrate('A statue of a woman with leaves for hair, hands cupped in front of her. In her palms, a seed that glows like a coal and is not burning.');
    await s.give('c11_ember_seed');
    await s.narrate('As you lift the Ember out, the statue\'s stone fingers close — slowly, slowly — around the space where it was.');
    await s.say('Sable', 'Elowen left it for whoever came. I think she knew the thorns would grow.');
    s.objective('Burn a path through the thorn walls with Elowen\'s Ember.');
  },

  async twThorns(s, id) {
    if (!s.has('c11_ember_seed')) {
      await s.narrate('A wall of black thorns, each as long as a finger. As you reach toward it, the nearest thorns turn, very slightly, to follow your hand.');
      return s.say('Pip', 'Nope. No. Absolutely not. There\'s got to be another way, or a very big knife.');
    }
    await s.narrate('The Ember flares in Wren\'s palm. The thorns remember fire, and draw back from it like a hand from a hot stove.');
    s.sfx('burst');
    s.clearBlocker(id);
  },

  async twRing(s) {
    await s.narrate('A fairy ring of glowing mushrooms. The old stories say: stand in it, and make a wish.');
    await s.say('Pip', 'Stand back. I\'m doing it.');
    await s.wait(1.0);
    await s.say('Pip', '...Okay. Done.');
    await s.say('Bram', 'What did you wish for?');
    await s.say('Ilse', 'Don\'t tell him. If you tell, it doesn\'t come true.');
    await s.wait(0.6);
    await s.say('Pip', 'It wasn\'t gonna come true anyway.');
    await s.say('Sable', 'Then you may as well tell us.');
    await s.say('Pip', 'Nice try.');
  },

  async twBoss(s) {
    if (s.flag('c11_shard_thorn')) return;
    stageParty(s, 20, 10, 'up');
    s.stopMusic(1);
    await s.pan(20, 6, 1.2);
    await s.narrate('In the Lantern court grows a flower the size of a house, petals the color of an old bruise. At its heart stands a tall woman with leaves for hair. The flower turns toward you, the way a face turns toward the sun.');
    await s.say('Elowen', 'Child. Lysa\'s face.');
    await s.wait(0.8);
    await s.say('Elowen', 'No. Not Lysa. You stand differently. Like someone who means to keep standing.');
    await s.say('Sable', 'My name is Sable.');
    await s.say('Elowen', 'I knew a girl once who never got to choose a name for herself. She was ten. I have lived ten thousand summers in this wood, and I would give every one of them to give her one more.');
    await s.say('Elowen', 'Every flower fades. I would not. I drank the forest to stay in bloom. And now I am so very thirsty.');
    await s.say('Ilse', 'She\'s draining the whole wood.');
    await s.say('Sable', 'She is doing what Cassian does. Holding on to summer with both hands. Let us help her let go.');
    s.music('boss');
    const r = await s.battle('c11_boss_bloom');
    if (r !== 'win') return;
    s.music('sad');
    await s.narrate('The great flower folds in on itself, petal by petal, and what is left is a seed the size of a fist, and an old, old woman sitting very tired beside it.');
    await s.say('Elowen', 'There. That is how it is supposed to go. Bloom, fade, seed. I had forgotten the last part.');
    s.face('remnant', 'down');
    await s.say('Elowen', 'Sable. Lysa is not wholly gone. The Gloam keeps what is loved too hard to let go.');
    await s.say('Elowen', 'There is a hollow under my roots, past the crystal trees, where it gathers. If you would meet the girl whose face you wear, she waits there. She has been waiting a long time to give something away.');
    await s.say('Sable', 'Give what away?');
    await s.say('Elowen', 'Ask her. It is hers to give.');
    s.flash('#e0ffd0', 0.8);
    s.remove('remnant');
    await s.wait(0.8);
    await claimShard(s, 'thorn');
    s.setFlag('c11_rift_open');
    s.quest('c11_rite_sable', 'Sable\'s Rite: The Girl Under the Roots', 'Elowen said Lysa waits in the hollow under Thornwood\'s roots, past the crystal trees in the north-west.');
    unstage(s);
    await s.follow(0.6);
    s.journal('Thornwood. Elowen had drunk the whole forest to keep from fading. When she let go, she told Sable that Lysa is waiting under the roots. Sable wants to go. She\'s scared. She wants to go anyway.');
    s.music('forest');
    await returnToShip(s);
  },

  async twHollow(s) {
    await s.narrate('A hollow under the roots of the oldest tree, full of a cold violet dark that moves like water.');
    return s.say('Sable', s.flag('c11_rift_open') ? 'This is the place.' : 'Not yet. Something down there is asleep. We should not wake it for no reason.');
  },

  // ================================================================== SKYREACH — the Storm Herald
  async srArrive(s) {
    s.music('tension');
    await s.say('Corvin', 'Stormcrown. Vasha\'s lot used to fly drakes through this for fun.');
    await s.say('Pip', 'For _fun_?');
    await s.say('Corvin', 'Very strange people. I liked them enormously. They fined me forty crowns once for flying drunk.');
    await s.say('Ilse', 'Were you drunk?');
    await s.say('Corvin', 'I was _celebrating_. There\'s a difference and I will die on that hill.');
    await s.say('Bram', 'There\'s a — ward? Over the bridge to the top. Like a wall made of lightning.');
    await s.say('Corvin', 'Storm-ward. Vasha\'s riders grounded it with rods. Ground the rods, drop the ward.');
    s.objective('Ground Skyreach\'s three lightning rods to drop the storm-ward.');
  },

  async srRod(s, id) {
    const flagName = `c11_sr_${id}`;
    if (s.flag(flagName)) return s.narrate('The rod hums, earthed and quiet. Rain runs off it in a thin silver line.');
    await s.narrate('A lightning rod of black iron, taller than Bram. Its grounding chain has snapped and lies coiled at its foot like a sleeping snake.');
    if (!(await s.confirm('Reconnect the grounding chain?'))) return;
    s.flash('#e0f0ff', 0.4);
    s.sfx('bolt');
    s.shake(0.3, 0.6);
    await s.narrate('The chain snaps taut — and the lightning comes down the rod, and something comes down with it.');
    const r = await s.battle('c11_sr_rod', { bg: 'sky', mood: 'storm' });
    if (r !== 'win') return;
    s.setFlag(flagName);
    const done = ['rod_w', 'rod_e', 'rod_n'].filter((k) => s.flag(`c11_sr_${k}`)).length;
    if (done < 3) {
      await s.narrate(`The rod drinks the storm and goes quiet. (${done}/3 grounded)`);
      return;
    }
    await s.pan(20, 16, 1.2);
    s.clearBlocker('ward');
    s.flash('#ffffff', 0.5);
    await s.narrate('Across the sky, the storm-ward over the crown bridge sputters, flickers, and goes out.');
    await s.follow(0.8);
    s.objective('The storm-ward is down. Climb to the crown.');
  },

  async srBoss(s) {
    if (s.flag('c11_shard_sky')) return;
    stageParty(s, 20, 9, 'up');
    s.stopMusic(1);
    await s.pan(20, 6, 1.2);
    await s.narrate('A woman in a rider\'s coat stands before the dead Lantern with her arms raised to the storm, and the storm comes down to her like a hound to a whistle.');
    await s.say('Vasha', 'HEAR ME! The Hierophant brings the endless noon! Give him your light, as I gave mine! I gave it— I gave mine—');
    await s.say('Vasha', 'I gave it to him. I gave it. I _gave_—');
    await s.wait(0.5);
    s.face('remnant', 'down');
    await s.say('Vasha', '...Ashe. Corvin Ashe.');
    await s.say('Corvin', 'Ardent. You look terrible.');
    await s.say('Vasha', 'You ran from the Stormwall. Everyone saw the Kingfisher burn, and everyone saw you turn tail.');
    await s.wait(1.0);
    await s.say('Corvin', '...Yeah. I did.');
    await s.say('Pip', 'Corvin?');
    await s.say('Corvin', 'Later, kid.');
    s.music('boss');
    const r = await s.battle('c11_boss_herald');
    if (r !== 'win') return;
    s.music('sad');
    await s.narrate('The storm lets go of her all at once, and she sits down on the wet marble like someone who has been standing for a year.');
    await s.say('Vasha', 'I gave it to him. He held my hands and thanked me, and I have never been so certain of anything in my life.');
    await s.say('Wren', 'So did I. I gave him ours. I took it out of my mother\'s Lantern with my own hands.');
    await s.say('Vasha', 'Then we are a pair of fools, girl. Better a fool who stops than a fool who keeps shouting.');
    s.face('remnant', 'right');
    await s.say('Vasha', 'Ashe. Hal Merrow\'s ship is still up there. In the Stormwall, where you left her. No one has dared fly the wall since.');
    await s.say('Corvin', 'Least of all me.');
    await s.say('Vasha', 'Least of all you.');
    s.flash('#e0f0ff', 0.8);
    s.remove('remnant');
    await s.wait(0.8);
    await claimShard(s, 'sky');
    s.setFlag('c11_storm_open');
    s.quest('c11_rite_corvin', 'Corvin\'s Rite: The Stormwall', 'The wreck of the Kingfisher is still inside the Stormwall. Corvin hasn\'t said he\'ll go. Ask him at the helm.');
    await s.say('Pip', 'Corvin. Who\'s Hal?');
    await s.say('Corvin', 'Ask me at the helm sometime. When I\'ve had a drink. Or when I haven\'t. One of those.');
    unstage(s);
    await s.follow(0.6);
    s.journal('Skyreach. Ardent Vasha gave Cassian her light because he asked so kindly. So did I. She told Corvin a ship called the Kingfisher is still inside the Stormwall. Corvin says ask him later.');
    s.music('tension');
    await returnToShip(s);
  },

  // ================================================================== THE GRAND LANTERN — Garrick
  async glArrive(s) {
    s.music('aurenne');
    await s.say('Bram', 'Aurenne. The Cathedral\'s still standing. Mostly.');
    await s.say('Wren', 'Garrick\'s in there.');
    await s.say('Bram', 'I know. I can smell the boot polish from here.');
    await s.say('Ilse', 'Bram. Your hands.');
    await s.say('Bram', 'Shaking. Yes. They do that. Ignore them, they\'re very dramatic.');
    s.objective('Find a way into the Grand Lantern\'s tower.');
  },

  async glBrask(s) {
    if (s.flag('c11_gl_brask')) return s.say('Captain Brask', 'Go on. The Lord-Commander\'s at the top. He\'s always at the top.');
    await s.say('Captain Brask', 'Halt! Who goes— ...Kestrel? Squire Kestrel? The one who froze?');
    await s.say('Bram', 'Yes. Hello, Captain Brask.');
    await s.say('Captain Brask', 'Ha! The Lord-Commander will laugh himself sick.');
    await s.say('Bram', 'He never laughs. It\'s one of the worst things about him.');
    await s.say('Captain Brask', 'Dawnguard! Form up!');
    const r = await s.battle('c11_boss_brask');
    if (r !== 'win') return;
    s.setFlag('c11_gl_brask');
    await s.say('Captain Brask', '...Take it. The seal.');
    await s.give('c11_seal');
    await s.say('Captain Brask', 'I\'ve polished this breastplate every morning for a year, because nobody told me to stop. Tell him I stopped.');
    s.remove('brask');
    s.objective('Use the Commander\'s Seal on the lock-lever in the nave.');
  },

  async glLever(s) {
    if (s.flag('c11_portcullis')) return s.narrate('The lock-lever stands thrown. The choir-screen gate is open.');
    if (!s.has('c11_seal')) return s.narrate('A Dawnguard lock-lever, chained to a signet plate. Without the Commander\'s Seal, it will not move.');
    await s.narrate('The Commander\'s Seal fits the plate. The lever drops with a clang that rolls up the empty nave and out through the missing roof.');
    s.setFlag('c11_portcullis');
    await s.take('c11_seal');
    s.clearBlocker('portcullis');
    s.objective('Climb the Grand Lantern. Garrick is waiting at the top.');
  },

  async glBoss(s) {
    if (s.flag('c11_shard_grand')) return;
    stageParty(s, 10, 11, 'up');
    s.stopMusic(1);
    await s.wait(0.6);
    await s.narrate('The Grand Lantern\'s gallery. The Great Lamp is dark. A man in black plate stands before it, leaning on a greatsword, as if he has been waiting there a long time and could wait a long time more.');
    await s.say('Garrick', 'Kestrel. And the Halloway girl who rang the end of the world.');
    await s.emote('player', '…');
    await s.say('Garrick', 'Don\'t look so wounded. I\'d have done the same at sixteen, if a saint asked me nicely.');
    await s.say('Bram', 'Stand aside, Garrick.');
    await s.say('Garrick', 'Lord-Commander.');
    await s.say('Bram', 'There\'s no Dawnguard anymore. There\'s no _dawn_.');
    await s.say('Garrick', 'There will be a noon. Forever. Cassian will freeze this world, and frozen is better than broken. I have seen broken, boy. I\'m standing in it.');
    await s.say('Wren', 'You don\'t believe in Evernoon.');
    await s.say('Garrick', 'I believe in holding a line. Somebody has to, while the rest of you have feelings about it.');
    s.music('boss');
    const r = await s.battle('c11_boss_garrick');
    if (r !== 'win') return;
    await REM.glDuel(s);
  },

  async glDuel(s) {
    s.music('tension');
    await s.narrate('Garrick goes down on one knee. His men do not get up. After a moment, he laughs, low and ugly.');
    await s.say('Garrick', 'Six against one. Aldous would be proud.');
    await s.say('Garrick', 'No. Venn would be _ashamed_. Face me alone, boy. Finish your knighting trial. The one you ran from.');
    await s.say('Ilse', 'Absolutely not.');
    await s.wait(0.8);
    await s.say('Bram', '...Yes.');
    await s.say('Wren', 'Bram—');
    await s.say('Bram', 'If I don\'t, he\'s right about me. Forever. And I am so tired of forever, Wren.');
    await s.talk({ if: 'c11_rite_bram_done', lines: [
      'Garrick: That blade. That\'s Venn\'s. Where did you—',
      'Bram: Where we buried him.',
    ] });
    unstage(s);
    s.spawn('p_wren_watch', s.state.characters.wren.lookId, 8, 12, 'up');
    const saved = [...s.state.party];
    s.state.party = ['bram'];
    let attempt = 0;
    let r = 'lose';
    while (r !== 'win') {
      s.heal();
      r = await s.battle(attempt === 0 ? 'c11_duel_garrick' : 'c11_duel_weary', { loseOk: true });
      if (r === 'win') break;
      attempt++;
      await s.narrate(attempt === 1 ? 'Bram goes down hard. The gallery is very quiet.' : 'Down again. Blood in his mouth. The floor is cold.');
      await s.say('Garrick', attempt === 1 ? 'There it is. Stay down, Kestrel. You always do.' : 'Stay. Down.');
      await s.wait(1.0);
      await s.narrate('Bram gets up.');
      await s.say('Bram', attempt === 1 ? 'No. I— no. Again.' : 'Again.');
    }
    s.state.party = saved;
    s.heal();
    s.music('sad');
    await s.narrate('Garrick\'s greatsword rings across the marble and spins to a stop at the foot of the dark Lamp. Bram stands over him, breathing like a bellows. His sword hand is shaking so hard the blade chatters.');
    await s.say('Garrick', 'Well? Finish it. That\'s what knights do.');
    await s.wait(1.0);
    await s.say('Bram', 'No.');
    await s.say('Bram', 'Knights stand between. That\'s all it ever was. Aldous didn\'t die for me because I was worth it. He died because that\'s what you _do_. You stand between.');
    await s.say('Bram', 'I\'m not standing between you and anything. So I\'m done.');
    await s.wait(0.8);
    await s.say('Garrick', '...Venn always said you\'d be the best of us. If you lived long enough to stop being afraid.');
    await s.say('Bram', 'I\'m still afraid.');
    await s.say('Garrick', 'Then he was right after all. Damn him.');
    s.remove('p_wren_watch');
    s.shake(0.4, 1.2);
    await s.narrate('Above you, the Great Lamp cracks. From the heart of it, something falls into Garrick\'s cupped, empty hands: a piece of the sun.');
    await s.say('Garrick', 'Take it. I held the line. The line moved.');
    await claimShard(s, 'grand');
    s.shake(0.3, 1.0);
    await s.say('Corvin', 'The tower\'s coming down! Everybody out — that includes you, Lord-Commander.');
    await s.say('Garrick', 'I\'ll walk. I\'ll not be carried out of my own Lantern by a squire.');
    await s.talk({ pick: [
      { if: 'c11_rite_bram_done', lines: [
        'Bram: Knight. Sir Bram Kestrel.',
        'Garrick: Hm. And who dubbed you?',
        'Bram: A deserter.',
        'Garrick: Ha. Of course he did.',
      ] },
      { text: 'Bram: Then walk.' },
    ] });
    s.journal('The Grand Lantern. Bram fought Garrick alone. He went down twice and got up twice. He didn\'t kill him. Garrick gave us the Shard and walked out on his own. Bram\'s hands didn\'t stop shaking for an hour. He says that\'s the trick.');
    s.objective(mainObjective(s));
    await s.fadeOut(1.0);
    await s.teleport('halcyon_deck', 12, 8, 'down');
  },

  async glDrawing(s) {
    await s.narrate('Pressed between two volumes of liturgy: a child\'s drawing. Two stick figures under an enormous yellow sun. The tall one is labeled CASS. The small one is labeled ME.');
    await s.narrate('Underneath, in a grown man\'s careful hand: _Lysa, age 7._');
    await s.say('Sable', '...She drew the sun too big.');
    await s.say('Wren', 'Everybody draws the sun too big when they\'re seven.');
  },

  async glLedger(s) {
    await s.narrate('A Choir ledger. Columns of names from the Undercroft, each with a date and a single word beside it: _Offered._ At the foot of every page, the same initials, in the same careful hand as the drawing: C.L.');
    await s.say('Wren', 'He knew. About Mercy. About the Undercroft. He signed every page.');
    await s.say('Ilse', 'He dismissed her in front of the whole city.');
    await s.say('Wren', 'He\'s always very kind in front of people.');
  },

  // ================================================================== LANTERNFALL — the Keeper's Remnant
  async lfArrive(s) {
    if (s.flag('c11_lf_arrived')) return;
    s.setFlag('c11_lf_arrived');
    s.music('sad');
    stageParty(s, 23, 29, 'up');
    await s.wait(0.6);
    await s.narrate([
      'The Halcyon moors at the end of the old dock. The dock hangs over nothing now.',
      'This is where she stood. This is where she gave you Dad\'s compass, and told you to go.',
    ]);
    s.spawn('echo_ysolde', 'c11_echo_ysolde', 23, 27, 'down');
    s.flash('#c8d8f0', 0.6);
    await s.wait(0.8);
    await s.say('Ysolde', 'Come back to me, little bird.', { speed: 0.6 });
    s.remove('echo_ysolde');
    await s.wait(1.0);
    await s.say('Wren', '...I came back. I\'m late.');
    await s.say('Sable', 'That was not her. That was the island remembering her.');
    await s.say('Ilse', 'The whole island is doing it. Look. The square. The well.');
    await s.say('Bram', 'The Lantern\'s still burning. Up on the bluff.');
    await s.say('Wren', 'She\'s up there.');
    await s.say('Corvin', 'Then we walk up. Nobody\'s in a hurry, sparrow. Not here.');
    unstage(s);
    s.setFlag('c11_lf_mem_dock');
    s.music('lanternfall');
    s.objective('Walk through Lanternfall. The memories here are blocking the way to the Lantern.');
    s.journal('Lanternfall. The dock hangs over nothing. The island is remembering things. It remembered Mom saying "come back to me." I did. A year late.');
  },

  async lfMemoryDone(s) {
    const n = ['dock', 'well', 'home'].filter((k) => s.flag(`c11_lf_mem_${k}`)).length;
    if (n < 3 || s.flag('c11_lf_light_open')) return;
    s.setFlag('c11_lf_light_open');
    await s.wait(0.4);
    s.flash('#fff0c0', 0.6);
    await s.narrate('Up on the bluff, the light in the Lantern\'s doorway thins, like a held breath let out.');
    s.objective('The Lantern is open. Climb the bluff.');
  },

  async lfWell(s) {
    if (s.flag('c11_lf_mem_well')) return s.narrate('The village well. WREN + ILSE + THE SEA. The W is backwards. It always was.');
    s.setFlag('c11_lf_mem_well');
    s.spawn('echo_wren', 'c11_echo_wren', 22, 16, 'up');
    s.spawn('echo_ilse', 'c11_echo_ilse', 24, 16, 'up');
    s.flash('#c8d8f0', 0.5);
    await s.wait(0.6);
    await s.say('Little Ilse', 'You did the W backwards.', { portrait: false });
    await s.say('Little Wren', 'It\'s _stylish_. When I\'m famous everyone\'ll do their W\'s like this.', { portrait: false });
    await s.say('Little Ilse', 'You\'re not going to be famous. You\'re going to be a Keeper like your mum.', { portrait: false });
    await s.say('Little Wren', 'I\'m going to sail to the end of the world and come back with a sea monster.', { portrait: false });
    await s.say('Little Ilse', '...Can I come?', { portrait: false });
    await s.say('Little Wren', 'Obviously. Somebody has to carry the bandages.', { portrait: false });
    await s.wait(0.8);
    await s.say('Ilse', 'We were seven.');
    await s.say('Wren', 'I did come back with a sea monster. Sort of. Brinefang counts.');
    await s.say('Ilse', 'It doesn\'t count, you didn\'t bring it back.');
    s.remove('echo_wren'); s.remove('echo_ilse');
    s.shake(0.3, 0.8);
    await s.narrate('The memory sours at the edges, the way milk turns — and the well vomits up black water, and the water has hands.');
    const r = await s.battle('c11_lf_well', { bg: 'ruin' });
    if (r !== 'win') return;
    await s.say('Ilse', 'For the record, I still have the bandages.');
    await REM.lfMemoryDone(s);
  },

  async lfHome(s) {
    if (s.flag('c11_lf_mem_home')) return;
    s.setFlag('c11_lf_mem_home');
    s.music('sad');
    await s.wait(0.6);
    await s.narrate('Home. The east wall is gone; the sky looks in. Everything else is exactly where it was. Two plates on the table.');
    s.spawn('echo_ysolde', 'c11_echo_ysolde', 6, 5, 'left');
    s.spawn('echo_wren', 'c11_echo_wren', 3, 5, 'right');
    s.flash('#c8d8f0', 0.5);
    await s.wait(0.6);
    await s.say('Ysolde', 'Because the last Halloway who sailed east never came back!', { portrait: false });
    await s.wait(1.0);
    await s.say('Little Wren', '...Dad would have let me go.', { portrait: false });
    await s.wait(1.0);
    await s.say('Ysolde', 'Your father would have gone _with_ you.', { portrait: false, speed: 0.6 });
    s.remove('echo_wren'); s.remove('echo_ysolde');
    await s.wait(1.2);
    await s.think('Wren', 'I left the table. I didn\'t even finish supper. That was the last supper we ever had, and I didn\'t finish it.');
    await s.narrate('Outside, something is scratching at the door. Something that came up out of the sea on a stormy night, a long time ago, and never really left.');
    const r = await s.battle('c11_lf_hound', { bg: 'beach_night' });
    if (r !== 'win') return;
    s.music('lanternfall');
    await s.say('Wren', 'Two plates. She kept setting two plates. For seven years. Even after Dad.');
    await s.say('Wren', 'No. Not for Dad. For me. One for her and one for me.');
    await REM.lfMemoryDone(s);
  },

  async lfGarden(s) {
    await s.narrate('Your mother\'s herb garden. Rosemary gone to ash. Thyme gone to ash.');
    await s.narrate('And the sea-lavender — the one that never flowered in all the years you knew it — is covered in small purple flowers.');
    await s.say('Wren', '...Now? Now you flower?');
    await s.say('Sable', 'Perhaps it was waiting for someone to come home and see.');
  },

  async lfBoss(s) {
    if (s.flag('c11_shard_home')) return;
    stageParty(s, 7, 8, 'up');
    s.stopMusic(1.5);
    await s.wait(0.8);
    await s.pan(7, 4, 1.4);
    await s.narrate([
      'The lamp room of Lanternfall. The light is everywhere — in the walls, in the floor, in the air like warm water.',
      'At the heart of it, with her back to you and her hands lifted to the lamp, a woman in a Keeper\'s robe. Her braid has come undone. The light pours out of her hands and does not stop.',
    ]);
    await s.wait(0.8);
    await s.say('???', 'Wren?', { portrait: false });
    s.face('remnant', 'down');
    await s.wait(0.8);
    await s.say('Ysolde', 'Wren. You\'re late for supper.');
    await s.say('Wren', 'Mom.');
    await s.say('Ysolde', 'Come inside, little bird. It\'s getting dark. It\'s been getting dark for such a long time.');
    await s.say('Wren', 'Mom, you can let go now. The boat got away. We made it. I made it. It\'s been a whole year.');
    await s.say('Ysolde', 'If I let go, the dark comes in.');
    await s.say('Ysolde', 'If I let go, you\'ll leave. You always wanted to leave. You used to toddle to the end of the dock and just _look_.');
    if (s.has('ysolde_lantern')) {
      await s.narrate('In Wren\'s pack, the little brass lantern her mother gave her flares, as if it has recognized someone.');
    }
    await s.say('Ysolde', 'Stay. I\'ll keep the light on. Nothing will take you. Not the sea. Not the Hierophant. Not _time_. You\'ll be sixteen forever, and I will never have to watch you go.');
    await s.wait(0.8);
    await s.say('Sable', 'Wren. That is what he wants. That is Evernoon.');
    await s.say('Wren', 'I know.');
    await s.say('Wren', '...She\'s not wrong, though. That\'s the worst part. Some days it\'s what I\'d want too.');
    await s.say('Ilse', 'Wren.');
    await s.wait(1.0);
    await s.say('Wren', 'But it isn\'t her. My mom never once asked me to stay. Not even at the dock. She wanted to, I _saw_ her want to. She gave me Dad\'s compass and she let me go.');
    await s.say('Wren', 'That\'s who you are, Mom. Not this. I\'m going to get you back to who you are.');
    await s.say('Ysolde', 'Then I will make you stay.');
    s.music('finalboss');
    const r = await s.battle('c11_boss_keeper');
    if (r !== 'win') return;
    await REM.lfFarewell(s);
  },

  async lfFarewell(s) {
    s.stopMusic(2);
    await s.wait(1.0);
    s.flash('#ffffff', 1.0);
    await s.narrate('The light gutters. The shadow that was wound around her peels away like wet paper, and burns, and is gone.');
    s.remove('remnant');
    s.spawn('ysolde_real', 'ysolde', 7, 4, 'down');
    await s.wait(1.2);
    s.music('lanternfall');
    await s.narrate('What is left is a tired woman kneeling on a stone floor, holding a lamp that is still, somehow, alight.');
    await s.say('Ysolde', '...Wren?');
    await s.move('player', [[7, 6]], 1.4);
    await s.say('Ysolde', 'Oh. Look at you. You\'ve grown. You— your _hair_. You cut it yourself, didn\'t you. It\'s terrible.');
    await s.say('Wren', '_(laughing, and not laughing)_ Ilse did the back.');
    await s.say('Ilse', 'I did my best, Keeper. She wouldn\'t hold still.');
    await s.say('Ysolde', 'She never would.');
    await s.wait(0.6);
    await s.say('Ysolde', 'How long?');
    await s.say('Wren', 'A year.');
    await s.say('Ysolde', 'A year. I meant to hold it for a minute. Just until the boat was clear.');
    await s.say('Ysolde', 'Something took hold of me afterwards. It kept saying, _not yet. Not yet. Keep her safe._ I think it was me. I\'m sorry. I think it was only ever me.');
    await s.say('Wren', 'I\'m sorry. I\'m sorry I took the Dawnstone. I\'m sorry about what I said at supper. I\'m sorry I left. I\'m sorry I didn\'t come home sooner—');
    await s.say('Ysolde', 'Wren. Little bird. Breathe.');
    await s.say('Ysolde', 'I knew you would leave from the day you could walk. I wasn\'t angry that you wanted to go. I was angry that I was so afraid of it. Those aren\'t the same thing. It took me sixteen years and the end of the world to see it.');
    if (s.flag('c11_rite_wren_done') || s.has('c11_handlamp')) {
      await s.say('Wren', 'You went out after Dad. That night. I found your hand-lamp, tied to the Gull\'s Return.');
      await s.wait(0.8);
      await s.say('Ysolde', '...You found it.');
      await s.say('Ysolde', 'I left the Lantern dark for two hours. The only two hours in two hundred years. I looked for him until the oil ran out. Then I rowed home, because you were asleep in the house, and someone had to keep the light on for you.');
      await s.say('Wren', 'You never told me. I thought for seven years you didn\'t even try.');
      await s.say('Ysolde', 'I know. I let you think it. It was easier to be the villain than to be the one who wasn\'t enough.');
    } else {
      await s.say('Wren', 'I always thought you could have saved Dad. I thought it for seven years.');
      await s.wait(0.8);
      await s.say('Ysolde', 'I know you did. I tried, Wren. Some day you might find out how hard. Don\'t hate me for not telling you.');
    }
    await s.say('Wren', 'I never hated you. I was just— sixteen.');
    await s.say('Ysolde', 'I remember sixteen. It\'s dreadful. I wouldn\'t do it twice for all the light in the world.');
    await s.wait(0.6);
    s.face('ysolde_real', 'left');
    await s.say('Ysolde', 'Ilse. You kept her alive. I can see you did.');
    await s.say('Ilse', '...Someone had to carry the bandages.');
    s.face('ysolde_real', 'right');
    await s.say('Ysolde', 'Squire Kestrel. Late again.');
    await s.say('Bram', 'Sorry, Keeper.');
    await s.say('Ysolde', 'Don\'t be. You came.');
    await s.say('Ysolde', 'And you have a name now, I think. A real one.');
    await s.say('Sable', 'Sable. Wren gave it to me. I kept it.');
    await s.say('Ysolde', 'Good. Keep it. Keep it the way you\'d keep a promise.');
    await s.say('Pip', 'I\'m Pip. I\'m— a friend. Of hers. I steal things.');
    await s.say('Ysolde', 'Then you\'re welcome in my house, Pip. Don\'t steal the spoons. They were my mother\'s.');
    await s.say('Ysolde', 'Captain.');
    await s.say('Corvin', 'Ma\'am.');
    await s.say('Ysolde', 'Bring them home.');
    await s.say('Corvin', 'They\'re not mine to bring.');
    await s.say('Ysolde', 'They are now.');
    s.face('ysolde_real', 'down');
    await s.wait(0.8);
    await s.say('Ysolde', 'Now. The light.');
    await s.narrate('She holds out the lamp. Inside the brass, where the Dawnstone used to sleep, a piece of the broken sun.');
    await s.say('Ysolde', 'A Keeper\'s light can\'t go out while the Keeper holds it. So I\'m going to stop holding it. And you\'re going to carry it instead.');
    await s.say('Wren', 'I don\'t know how to be a Keeper. I never learned the Lantern. I left before you could teach me.');
    await s.say('Ysolde', 'Oh, Wren. A Keeper isn\'t a lighthouse. A Keeper is someone who keeps a light going for the people still out in the dark. You\'ve been doing it all year. I watched.');
    await s.say('Ysolde', 'Not here. Not this island. Wherever you go.');
    s.flash('#ffe8b0', 1.2);
    s.sfx('revive');
    await s.wait(1.0);
    await s.learnCrest('lanternkeeper');
    await s.system('Wren carries the Lanternkeeper\'s light. The *Lanternkeeper* Crest can now be equipped.');
    await claimShard(s, 'home');
    await s.wait(0.6);
    await s.say('Ysolde', 'There. Oh, that\'s better. My hands were so tired.');
    await s.wait(0.8);
    await s.say('Wren', 'Mom. Don\'t—');
    await s.say('Ysolde', 'I have to, little bird. That\'s the whole point. That\'s what I was too afraid to learn.');
    await s.wait(1.0);
    await s.say('Ysolde', 'Grow up well, my little bird.', { speed: 0.5 });
    await s.wait(1.2);
    await s.say('Wren', 'I\'m trying.');
    await s.say('Ysolde', 'I know. I can tell.');
    s.stopMusic(3);
    s.flash('#ffffff', 1.5);
    s.remove('ysolde_real');
    await s.wait(2.0);
    await s.narrate([
      'And for the first time in a year, the Lantern of Lanternfall goes out.',
      'For a moment there is nothing at all.',
      'Then, in Wren\'s open hand, a small warm light. It does not need a Lantern.',
    ]);
    await s.wait(1.0);
    await s.say('Pip', '...She was nice. Your mum.');
    await s.say('Wren', 'She was terrible. She was the best.');
    await s.say('Ilse', 'Both. She was both.');
    await s.say('Wren', 'Yeah. Both is allowed.');
    unstage(s);
    s.music('lanternfall');
    s.journal('I said goodbye to Mom. A real one, this time. She said a Keeper is someone who keeps a light going for people out in the dark. Then she let go, and the Lantern went out, and the light was in my hand. Grow up well, she said. I\'m trying.');
    s.objective(mainObjective(s));
    await s.fadeOut(2.0);
    await s.teleport('halcyon_deck', 12, 8, 'down');
  },

  async lfLog(s) {
    await s.narrate('The Lantern log of Lanternfall, open on its stand, two hundred years of weather and oil in neat columns. One page is creased, as if it has been opened to many times.');
    await s.narrate('_14th of Harvest. Keeper absent from the lamp, second bell to fourth. Keeper at sea in search of the fishing boat Gull\'s Return, lost with one aboard. — Y.H._');
    await s.narrate('And below it, in a hand that is not quite steady: _Lamp relit at fourth bell. Wren asleep. Did not find him. Do not tell her._');
    if (!s.flag('c11_rite_wren_done')) await s.say('Wren', '...She went out. Keepers never leave the Lantern. She went out after him.');
  },
};
