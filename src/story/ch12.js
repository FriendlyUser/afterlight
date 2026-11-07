// CHAPTER 12 — "Evernoon" (part 1: the gate, the frozen festival, the night of the spill,
// the Noon Stair and the last camp). The finale lives in ch12_finale.js.

export const PARTY = ['ilse', 'bram', 'sable', 'pip', 'corvin'];
const SHARDS = 7;

const has = (s, id) => s.state.party.includes(id);
const lookOf = (s, id) => s.state.characters[id]?.look || id;

/** Spawn party members as actors for a staged scene: [[id, x, y, dir], ...]. */
export function stageParty(s, spots, opts = {}) {
  for (const [id, x, y, dir] of spots) if (has(s, id)) s.spawn(`p_${id}`, lookOf(s, id), x, y, dir, opts[id] || {});
}
export function clearParty(s) { for (const id of PARTY) s.remove(`p_${id}`); }

/** Make sure the contract state from Chapter 11 holds (all six, seven Shards). */
function ensureArrivalState(s) {
  const level = s.state.characters.wren?.level || 70;
  for (const id of ['wren', ...PARTY]) if (!has(s, id)) s.state.joinParty(id).setLevel(level);
  const n = s.state.inventory.count('sun_shard');
  if (n < SHARDS) s.state.inventory.add('sun_shard', SHARDS - n);
}

const dialsDone = (st) => ['c12_dial_market', 'c12_dial_garden', 'c12_dial_bell'].filter((f) => st.flags[f]).length;

export const C12 = {
  // =================================================================== THE GATE
  async arrive(s) {
    if (s.flag('c12_arrived')) return;
    s.setFlag('c12_arrived');
    ensureArrivalState(s);
    s.music('gloam');
    s.place('player', 20, 40, 'up');
    stageParty(s, [['ilse', 18, 39, 'up'], ['bram', 22, 39, 'up'], ['sable', 20, 38, 'up'], ['pip', 17, 38, 'up'], ['corvin', 23, 40, 'up']]);
    await s.wait(0.5);
    await s.narrate([
      'The Noon Spire. The greatest shard of the broken sun, hanging over the abyss where the sea used to be.',
      'At its crown, behind a wall of white stone, it is still the afternoon of a summer festival.',
      'It has been for a year. It has been for forty.',
    ]);
    await s.say('Corvin', 'Halcyon\'s tied off. If this goes sideways, she\'ll drift home on her own. I taught her that. Mostly by doing it myself.');
    await s.say('Pip', 'Real comforting, Cap.');
    await s.say('Corvin', 'Wasn\'t meant to be.');
    await s.say('Ilse', 'Three things. One: we have seven Shards and no idea what they do when you put them together. Two: Cassian wants them. Three: we are carrying them straight to him.');
    await s.say('Wren', 'Four: he\'s waiting for us either way. Better we walk in than he comes out.');
    await s.say('Bram', 'That is either very brave or very stupid. In my experience they are frequently neighbors.');
    await s.move('p_sable', [[20, 36]], 1.4);
    await s.say('Sable', 'I was in there. Inside. In her dress.');
    await s.say('Sable', 'It was warm. Everyone was kind. Nobody was ever going to get older.');
    await s.say('Sable', 'I did not like it. I liked it very much. Both.');
    await s.say('Wren', '...Okay.');
    await s.think('Wren', 'Okay. Okay. The last time I walked toward Cassian, I handed him the end of the world.');
    s.sfx('holy');
    await s.narrate('In Wren\'s satchel, the seven Shards begin to hum. The same note, over and over, like a held breath.');
    await s.say('Corvin', 'Well. That\'s not ominous at all.');
    clearParty(s);
    s.objective('Cross the shard to the golden gate of Evernoon.');
    s.journal('We reached the Noon Spire. Behind the gate it\'s still Cassian\'s summer afternoon. The Shards are humming. I\'m not scared. (I\'m scared.)');
  },

  async openGate(s) {
    if (s.flag('c12_gate_open')) return;
    s.setFlag('c12_gate_open');
    await s.pan(20, 7, 1.2);
    await s.narrate('The arch is sealed with light — not a door, but a single moment, hung across the gap like a curtain.');
    await s.say('Ilse', 'It\'s... a note. Held. Like the Lanterns used to hold the Dawnsong.');
    await s.say('Sable', 'It is the Vespersong. The first note. He never let it finish.');
    await s.say('Wren', 'Then let\'s give it something to listen to.');
    await s.narrate('Wren opens the satchel. The seven Shards rise out of it on their own — and turn — and sing back.');
    s.sfx('holy');
    s.shake(0.25, 1.2);
    await s.flash('#fff8e0', 0.9);
    s.clearBlocker('gate_seal');
    await s.wait(0.6);
    await s.narrate('Then they settle back into the satchel, warm as hands.');
    s.music('cassian');
    await s.say('Cassian', 'Wren.', { portrait: false });
    await s.say('Cassian', 'You brought them. All seven. I knew you would — you always finish what you start. It\'s one of my favorite things about you.', { portrait: false });
    await s.say('Wren', 'Cassian. Where are you?');
    await s.say('Cassian', 'At the top, where I always am. Come in. It\'s a lovely afternoon.', { portrait: false });
    await s.say('Cassian', 'It always is.', { portrait: false });
    await s.say('Pip', '...I hate him so much. He sounds like somebody\'s nice uncle.');
    await s.say('Corvin', 'That\'s the trick, kid. That\'s always been the trick.');
    await s.follow(0.8);
    s.music('gloam');
    s.objective('Enter Evernoon through the golden gate.');
    s.journal('The Shards opened the gate by themselves. Cassian said it\'s a lovely afternoon. It always is.');
  },

  async anselm(s) {
    if (!s.flag('c12_anselm')) {
      s.setFlag('c12_anselm');
      await s.say('Brother Anselm', 'Oh! Real people. With shadows. I\'d almost forgotten what those looked like.');
      await s.say('Brother Anselm', 'I was an acolyte. His acolyte. When he started singing the Dawnsong backwards, I walked out.');
      await s.say('Brother Anselm', 'You can do that, you know. Walk out. Nobody ever tells you.');
      await s.say('Ilse', 'You\'re... a Remembrance?');
      await s.say('Brother Anselm', 'Half of one. I\'m fading at the edges. Out here, past the wall, things are allowed to end. It\'s rather restful.');
      await s.say('Brother Anselm', 'Take this. He gave it to me the day I was Kindled. It keeps the last toll from finding you.');
      await s.give('star_pendant');
      await s.say('Brother Anselm', 'Inside, he\'ll offer you everything you ever lost. He means it. That\'s the dreadful part — he always means it.');
      return;
    }
    return s.say('Brother Anselm', ['The wall keeps the afternoon in. It keeps the evening out.', 'I\'m staying out here, with the evening. I think I\'ve earned an evening.']);
  },

  async mott(s) {
    if (!s.flag('c12_mott_met')) {
      s.setFlag('c12_mott_met');
      await s.say('Mott', 'Customers! Customers on the shard! I knew if I kept the fire going long enough—');
      await s.say('Mott', 'Mott\'s the name. I sold oddments on Lamp Street, before. I think. I wandered out of the festival looking for a privy and couldn\'t find my way back in.');
      await s.say('Mott', 'That was... what year is it?');
      await s.say('Corvin', 'You don\'t want to know, friend.');
      await s.say('Mott', 'Then I won\'t ask! Mott never asks. Mott sells.');
    } else {
      await s.say('Mott', 'Everything a body needs for walking into a god\'s front parlor. Tonics. Feathers. Things that go bang.');
    }
    await s.shop('c12_mott');
  },

  // =================================================================== THE FESTIVAL STREETS
  async streetsIntro(s) {
    if (s.flag('c12_streets_enter')) return;
    s.setFlag('c12_streets_enter');
    s.music('evernoon');
    await s.wait(0.4);
    await s.pan(26, 28, 2.4);
    await s.narrate([
      'Aurenne. Not the ruin, and not the City of Bells you knew — the one before. Forty summers ago.',
      'Bunting. Lemon and honeycake on the air. A thousand people in the middle of a laugh.',
      'Nobody moves. Not quite. They sway a little, the way a held note wavers. Then they sway back.',
    ]);
    await s.follow(1.2);
    await s.say('Bram', 'Are they... alive?');
    await s.say('Ilse', 'Their pulses — no. There\'s nothing to take. They\'re warm, but there\'s nothing to take.');
    await s.say('Sable', 'They are Remembrances. Like me. Made from what he remembers.');
    await s.say('Pip', 'So this is what he wants? Everybody standing around forever? It\'s a party where nobody\'s allowed to go home.');
    await s.say('Corvin', 'Worst kind of party. I\'ve been to a few.');
    await s.say('Herald', 'Welcome, welcome, to the Festival of Long Light! The longest day of the year!');
    await s.wait(1.2);
    await s.say('Herald', 'Welcome, welcome, to the Festival of Long Light! The longest day of the year!');
    await s.say('Wren', 'Okay. That\'s... okay.');
    await s.say('Ilse', 'The cathedral\'s at the top of the avenue. If he\'s anywhere, he\'s up there.');
    s.objective('Head up the avenue to the cathedral steps.');
    s.journal('Evernoon is Aurenne, forty years ago, on the afternoon of a festival. The people here are Remembrances. They sway like a held note.');
  },

  async procession(s) {
    if (s.flag('c12_procession_moved')) return s.narrate('The dancers stand aside, smiling, very still.');
    if (s.flag('c12_dials_known')) {
      return s.narrate(`The dancers wait for a beat that never comes. (Sundials woken: ${dialsDone(s.state)}/3)`);
    }
    s.setFlag('c12_dials_known');
    await s.narrate('Five dancers, linked by ribbons, mid-step across the foot of the cathedral steps. Their skirts are lifted in a turn that never finishes.');
    await s.say('Bram', 'Pardon us. Excuse — pardon — they will not budge. Not rudely. They just... don\'t.');
    await s.say('Corvin', 'Could go round.');
    await s.say('Ilse', 'There is no round. The steps are the only way up. I checked. Twice.');
    await s.say('Pip', 'Could go *over*.');
    await s.narrate('Pip tries. He bounces off a ribbon as if it were an iron bar.');
    await s.say('Pip', '...Could not go over.');
    await s.say('Sable', 'They are waiting for the next beat of the music. The music is waiting for the next minute. The minute is waiting.');
    await s.say('Wren', 'For what?');
    await s.say('Sable', 'For the clocks. In his memory, every square in Aurenne had a sundial. They all say noon.');
    await s.say('Ilse', 'Then we make them say something else.');
    s.objective('Wake the three sundials — in the market (west), the gardens (east) and the bell-tower square (north-west).');
    s.journal('A frozen procession blocks the cathedral. Sable says the minute is waiting for the clocks. We\'re going to make the sundials move.');
  },

  /** key: market | garden | bell */
  async sundial(s, key) {
    const D = DIALS[key];
    const flag = `c12_dial_${key}`;
    if (s.flag(flag)) return s.narrate('The shadow has slipped one minute past noon. It feels like a door left open.');
    if (!s.flag('c12_dials_known')) return s.narrate('A sundial. Its shadow points straight up at noon. It looks as if it has never pointed anywhere else.');
    await s.narrate('The shadow points at noon. Wren lifts her hand, and the Lanternkeeper\'s light gathers in her palm — the light her mother carried every night of her life.');
    await s.say('Wren', 'Come on. One minute. Just give me one.');
    s.sfx('holy');
    await s.flash('#fff4d0', 0.5);
    await s.narrate(D.intro);
    const r = await s.battle(D.troop, { bg: 'evernoon' });
    if (r !== 'win') return;
    s.setFlag(flag);
    s.sfx('holy');
    await s.narrate('The shadow trembles... and slides, a hair\'s breadth, to one minute past noon.');
    for (const [who, line] of D.after) await s.say(who, line);
    const n = dialsDone(s.state);
    if (n >= 3) return C12.processionMoves(s);
    s.objective(`Wake the remaining sundials (${n}/3 woken).`);
    s.journal(D.journal);
  },

  async processionMoves(s) {
    if (s.flag('c12_procession_moved')) return;
    s.setFlag('c12_procession_moved');
    await s.pan(26, 11, 1.6);
    await s.narrate(['Somewhere across the city, a clock remembers how to tick.', 'One. Single. Tick.']);
    s.sfx('holy');
    await s.narrate('The dancers finish their turn. They curtsy to nobody. Then they drift aside, smiling, and go very still again — out of the way.');
    await Promise.all([
      s.move('dancer1', [[24, 12], [22, 12]], 1.6), s.move('dancer2', [[25, 12], [21, 12]], 1.6), s.move('dancer3', [[26, 13], [30, 13]], 1.6),
      s.move('dancer4', [[27, 12], [31, 12]], 1.6), s.move('dancer5', [[28, 12], [32, 12]], 1.6),
    ]);
    await s.follow(1.0);
    await s.say('Ilse', 'Well. That\'s the first thing that\'s happened here in forty years.');
    await s.say('Sable', 'It felt good. Did you feel it? Like a breath let out.');
    s.objective('The procession has parted. Climb the steps and enter the cathedral.');
    s.journal('We woke all three sundials. Time moved one minute in Evernoon, and the procession let us pass.');
  },

  async honeycakes(s) {
    await s.narrate('A bench at the top of the steps. A plate with two honeycakes on it. One half-eaten. One untouched.');
    if (!s.flag('c12_honeycakes')) {
      s.setFlag('c12_honeycakes');
      await s.say('Sable', 'That one is hers. He is still saving it for her.');
      await s.say('Pip', '...I\'m not even hungry. That\'s how you know it\'s bad.');
    }
  },

  // =================================================================== SIDE QUESTS (streets)
  // --- "The First Watch" (Bram): young Squire Aldous Venn.
  async aldous(s) {
    if (s.flag('c12_q_aldous_done')) {
      return s.say('Squire Venn', ['First watch tonight. I\'m— I\'m going to do it scared.', 'Sir. Thank you, sir.']);
    }
    if (s.flag('c12_q_aldous') && s.has('c12_mothers_token')) {
      s.setFlag('c12_q_aldous_done');
      await s.take('c12_mothers_token');
      await s.say('Squire Venn', 'My token! "Come home safe." She scratched that with a hairpin. I\'d have died of shame if I\'d lost it.');
      await s.say('Squire Venn', 'Sir — you\'re a knight, aren\'t you? A real one. You\'ve got the look.');
      await s.wait(0.8);
      await s.say('Bram', '...Yes. I am.');
      await s.say('Squire Venn', 'Were you scared? Your first watch?');
      await s.say('Bram', 'I\'m scared now.');
      await s.say('Squire Venn', '...Oh. Good. I mean — not good. But good.');
      await s.say('Bram', 'Here is what someone very wise once told me. You will be afraid. Do it anyway. That\'s the whole secret. There isn\'t a better one.');
      await s.say('Squire Venn', 'Do it anyway.');
      await s.say('Squire Venn', 'Here. Take this — it\'s my squire\'s badge. Tin. Not worth much. I\'ve got a spare.');
      await s.give('c12_squire_badge');
      await s.narrate('He hasn\'t got a spare. There is a clean, pale square on his surcoat where it was pinned.');
      await s.say('Bram', '_(very quietly)_ He always did that. Gave you the thing and said he had another.');
      s.quest('c12_q_aldous', null, null, 'done');
      s.journal('Bram met Sir Aldous at seventeen, terrified of his first watch. Bram told him what Aldous once told him. He called himself a knight. He didn\'t even stumble over it.');
      return;
    }
    if (s.flag('c12_q_aldous')) return s.say('Squire Venn', 'It\'s a little tin sun. I had it by the fountain, I\'m sure I did...');
    s.setFlag('c12_q_aldous');
    await s.say('Squire Venn', 'H-halt! Who goes— oh. Festival-goers. Sorry. Sorry! First posting.');
    await s.wait(0.6);
    await s.say('Bram', '...');
    await s.say('Ilse', 'Bram? Bram, you\'ve gone white.');
    await s.say('Bram', 'That\'s him. That\'s Sir Aldous. He\'s— he\'s younger than me. Look at him. He\'s a *child*.');
    await s.say('Squire Venn', 'Squire Aldous Venn, Dawnguard. First night watch tonight. On the Lantern plaza. Which is an honor. A large honor. I am large-ly honored.');
    await s.say('Squire Venn', 'Only I\'ve lost my token. Mum gave it me. For luck. I had it by the fountain, and now...');
    await s.say('Bram', 'We\'ll find it. I— we\'ll find it. Squire.');
    s.quest('c12_q_aldous', 'The First Watch', 'Young Squire Aldous Venn lost his mother\'s tin sun token near the festival fountain (south plaza). Find it for him.');
  },

  async fountain(s) {
    if (s.flag('c12_q_aldous') && !s.flag('c12_token_found') && !s.flag('c12_q_aldous_done')) {
      s.setFlag('c12_token_found');
      await s.narrate('Something glints in the fountain\'s basin, under water that has not rippled in forty years.');
      await s.give('c12_mothers_token');
      await s.say('Bram', 'Come home safe. ...Right. Back to the post.');
      return;
    }
    return s.narrate('The fountain\'s spray hangs in the air, every droplet perfectly still. You could count them. Pip tries.');
  },

  // --- "Wind for Tomas" (Pip): a kite that has never flown.
  async tomas(s) {
    if (s.flag('c12_q_kite_done')) return s.say('Tomas', ['It went UP! Did you see? It went all the way up!', 'I think it\'s the first thing that\'s ever gone up here.']);
    if (s.flag('c12_q_kite') && s.has('gale_bomb')) {
      s.setFlag('c12_q_kite_done');
      await s.take('gale_bomb');
      await s.say('Pip', 'Right. Stand back, kid. Hold the string. Tight. Tighter. Don\'t let go no matter what, yeah?');
      await s.say('Tomas', 'Okay!');
      s.sfx('wind');
      s.shake(0.15, 0.8);
      await s.narrate('Pip cracks the Gale Bomb against the cobbles. For one second, in a city where the air has not moved in forty years — there is wind.');
      await s.narrate('The kite leaps out of Tomas\'s hands and goes up, and up, red against the white sky.');
      await s.say('Tomas', 'IT\'S FLYING! IT\'S FLYING!');
      await s.narrate('All around the garden, the frozen festival-goers turn their heads, very slowly, to watch it. One of them laughs. A real laugh. It sounds rusty.');
      await s.say('Pip', '...Huh.');
      await s.say('Corvin', 'You\'re grinning, kid.');
      await s.say('Pip', 'Am not. Shut up. It\'s a good kite, okay? It\'s a really good kite.');
      await s.say('Tomas', 'You can have this! It\'s for running fast. I don\'t need it. I\'ve got a kite to hold.');
      await s.give('haste_anklet');
      s.quest('c12_q_kite', null, null, 'done');
      s.journal('Pip made wind in Evernoon so a kid could fly his kite. He says he wasn\'t grinning. He was grinning.');
      return;
    }
    if (s.flag('c12_q_kite')) return s.say('Tomas', ['There\'s no wind. There\'s never any wind. Do you have any wind?', '(Pip: "A Gale Bomb would do it. That pedlar at the gate sells anything that goes bang.")']);
    s.setFlag('c12_q_kite');
    await s.say('Tomas', 'I\'m going to fly it. I\'m going to fly it any second.');
    await s.say('Tomas', 'I\'ve been going to fly it any second for... for a really long time.');
    await s.say('Pip', 'It\'s \'cause there\'s no wind, genius. Air\'s stuck like everything else.');
    await s.say('Tomas', 'Oh.');
    await s.wait(0.8);
    await s.say('Pip', '...Ugh. Fine. FINE. Don\'t make that face. I\'ll get you some wind.');
    s.quest('c12_q_kite', 'Wind for Tomas', 'A Remembrance boy in the gardens has never been able to fly his kite — the air in Evernoon is frozen. Bring a Gale Bomb (Mott sells them at the gate).');
  },

  // --- "Dead Man's Hand" (Corvin): a gambler who never shows his cards.
  async sel(s) {
    if (s.flag('c12_q_cards_done')) return s.say('Lucky Sel', ['Blank. Forty years, and they were blank.', 'Funny. I feel lighter.']);
    if (!s.flag('c12_q_cards')) {
      s.setFlag('c12_q_cards');
      s.quest('c12_q_cards', 'Dead Man\'s Hand', 'Lucky Sel has held "the best hand of his life" for forty years without playing it. Corvin wants a word.');
    }
    await s.say('Lucky Sel', 'Pull up a chair, friend. I\'m holding the best hand of my life. Been holding it since lunch.');
    await s.say('Corvin', 'Since lunch forty years ago. You never played it?');
    await s.say('Lucky Sel', 'Never had to. As long as I hold it, it\'s the best hand of my life. Play it, and it\'s just a hand.');
    await s.say('Corvin', 'Sparrow, hold my hat. This one\'s personal.');
    const pick = await s.choice(['Raise.', 'Call.', 'Fold.'], { prompt: 'Corvin\'s move:' });
    if (pick === 0) {
      await s.say('Lucky Sel', 'I\'ll see that, and raise forever. Again?');
      await s.say('Corvin', 'Raising\'s just holding with extra steps. Hm.');
      return;
    }
    if (pick === 2) {
      await s.say('Corvin', 'Fold. Old habit. Run when the table gets hot.');
      await s.say('Corvin', '...No. Not this time. Not anymore.');
      return;
    }
    s.setFlag('c12_q_cards_done');
    await s.say('Corvin', 'Call. Show me.');
    await s.say('Lucky Sel', 'Show you? I— well. Nobody\'s ever called.');
    await s.narrate('Sel lays his cards down, one by one. They are blank. All five. Not a mark on them.');
    await s.say('Lucky Sel', '...Huh.');
    await s.say('Corvin', 'That\'s the thing about a hand you never play, friend. It\'s only ever as good as you imagine it.');
    await s.say('Corvin', 'Took me twelve years and a gaggle of children to learn that. You can have it for free.');
    await s.say('Lucky Sel', 'Here. My lucky coin. Turns out I wasn\'t using it.');
    await s.give('lucky_coin');
    s.quest('c12_q_cards', null, null, 'done');
    s.journal('Corvin called a forty-year bluff in a tavern in Evernoon. The cards were blank. He looked happier than I\'ve ever seen him.');
  },

  // --- "Scraped Knee" (Ilse): a hurt that never heals, never hurts.
  async dawe(s) {
    if (s.flag('c12_q_knee_done') && !s.flag('c12_q_knee_paid')) {
      s.setFlag('c12_q_knee_paid');
      await s.say('Mother Dawe', 'She cried! She actually cried, and then she *stopped*. Do you know how long I\'ve waited for her to stop?');
      await s.say('Mother Dawe', 'Please, take this. My mother wore it in the Thornwood. Moss grows back over anything, she used to say.');
      await s.give('regen_bangle');
      await s.say('Ilse', 'That\'s how it\'s supposed to work. It hurts, and then it stops. Nobody here remembers the second part.');
      s.quest('c12_q_knee', null, null, 'done');
      s.journal('Ilse cleaned a scraped knee that had been bleeding, painlessly, for forty years. The girl cried, and then she stopped. Ilse called it the best surgery of her career.');
      return;
    }
    if (s.flag('c12_q_knee_paid')) return s.say('Mother Dawe', 'She\'s off playing again. Falling over, getting up. Isn\'t that marvelous?');
    if (s.flag('c12_q_knee')) return s.say('Mother Dawe', 'Fen\'s by the pond, in the gardens. Please, Doctor.');
    s.setFlag('c12_q_knee');
    await s.say('Mother Dawe', 'Are you a physician? You have the look. The tired look.');
    await s.say('Ilse', '...I\'ve been told.');
    await s.say('Mother Dawe', 'It\'s my Fen. She fell by the pond and skinned her knee, and it — it won\'t stop. It doesn\'t heal. It doesn\'t even hurt her. It just... stays.');
    await s.say('Ilse', 'For how long?');
    await s.say('Mother Dawe', 'Since this afternoon.');
    await s.say('Ilse', 'Of course. Of course it has.');
    s.quest('c12_q_knee', 'Scraped Knee', 'Mother Dawe\'s daughter Fen has a scraped knee that has neither healed nor hurt for forty years. Ilse will look at it (Fen is by the garden pond).');
  },

  async fen(s) {
    if (s.flag('c12_q_knee_done')) return s.say('Fen', ['It stung SO much. Then it didn\'t!', 'I\'m gonna go fall over again!']);
    if (!s.flag('c12_q_knee')) return s.say('Fen', ['I fell down. Look! It\'s all red.', 'It doesn\'t hurt, though. It never hurts.']);
    s.setFlag('c12_q_knee_done');
    await s.say('Fen', 'Are you a doctor? Mum said a doctor might come.');
    await s.say('Ilse', 'I\'m a Mender. Close enough. Let\'s see that knee.');
    await s.say('Ilse', 'Three things. One, this is going to sting. Two, you\'re allowed to cry. Three, it will stop. I promise it will stop.');
    s.sfx('heal');
    await s.narrate('Ilse cleans the scrape and binds it, quick and careful, the way she has a thousand times in the Ember Ward.');
    await s.say('Fen', '...OW! Ow ow OW, that STINGS—');
    await s.wait(1.0);
    await s.say('Fen', '...Oh. It stopped.');
    await s.say('Fen', 'It stopped! It hurt and then it stopped!');
    await s.say('Ilse', 'That\'s how it\'s supposed to go. Go show your mother.');
    await s.say('Wren', 'You\'re smiling.');
    await s.say('Ilse', 'Best surgery of my career. Don\'t tell anyone.');
  },

  // --- "Miss Lysa's Ribbon" (Sable): Lysa's old nurse.
  async hollin(s) {
    if (s.flag('c12_q_ribbon_done')) return s.say('Hollin', ['There. Now you look like yourself.', 'Off you go, love. Don\'t stay out past the lamps.']);
    if (s.flag('c12_q_ribbon') && s.has('c12_festival_ribbon')) {
      s.setFlag('c12_q_ribbon_done');
      await s.take('c12_festival_ribbon');
      await s.say('Hollin', 'There\'s a good girl. Sit. Hold still. Honestly, Miss Lysa, you\'d lose your head if it wasn\'t braided on.');
      await s.narrate('The old nurse ties the gold ribbon into Sable\'s hair with hands that have done it a thousand times. Sable sits very still.');
      await s.say('Sable', 'What was she like? Lysa. When you did this.');
      await s.say('Hollin', 'Wriggly. Full of questions. Where does the sun go, Hollin. Why is the sea salty, Hollin. Why does Cass get to stay up later, Hollin.');
      await s.say('Hollin', 'Frightened of the dark, though she\'d die before she said so. Walked straight at it, every time, to prove she wasn\'t.');
      await s.say('Sable', 'Was she kind?');
      await s.say('Hollin', 'She was ten. She was kind when she remembered to be. Which was most of the time.');
      await s.say('Hollin', 'There. Now you look like yourself.');
      await s.wait(1.0);
      await s.say('Sable', '...Yes. I do.');
      await s.give('ribbon');
      await s.say('Ilse', 'Sable, she thinks you\'re—');
      await s.say('Sable', 'I know what she thinks. I know what I am. It is a nice ribbon. I am keeping it as Sable.');
      s.quest('c12_q_ribbon', null, null, 'done');
      s.journal('Lysa\'s old nurse tied a ribbon in Sable\'s hair and said, "Now you look like yourself." Sable said yes. She meant herself.');
      return;
    }
    if (s.flag('c12_q_ribbon')) return s.say('Hollin', 'The haberdasher\'s stall, in the market. Gold, mind — not that awful pink.');
    s.setFlag('c12_q_ribbon');
    await s.say('Hollin', 'Miss Lysa! Look at the state of you. Where\'s your ribbon got to?');
    await s.say('Sable', 'I am not—');
    await s.wait(0.8);
    await s.say('Sable', '...I do not have a ribbon.');
    await s.say('Hollin', 'Lost it again! Run to the haberdasher\'s stall in the market and fetch another. Gold. Then come here and I\'ll do your hair properly.');
    await s.say('Wren', 'Sable, you don\'t have to—');
    await s.say('Sable', 'I want to. I want to know what it was like. Being her, for one minute. Then I will stop.');
    s.quest('c12_q_ribbon', 'Miss Lysa\'s Ribbon', 'Lysa\'s old nurse Hollin wants to do "Miss Lysa\'s" hair. Fetch a gold ribbon from the haberdasher\'s stall in the market.');
  },

  async haberdasher(s) {
    if (s.flag('c12_q_ribbon') && !s.flag('c12_ribbon_got') && !s.flag('c12_q_ribbon_done')) {
      s.setFlag('c12_ribbon_got');
      await s.say('Haberdasher', 'Gold ribbon for Miss Lysa? Of course, of course. Always gold. She lost the last one in the fountain. And the one before that in a tree.');
      await s.give('c12_festival_ribbon');
      return;
    }
    return s.say('Haberdasher', ['Ribbons! Ribbons for the festival! Every color but grey.', 'Grey\'s for getting old. Nobody here needs grey.']);
  },

  // --- "Lysa's Atlas" (Wren): the bookstall.
  async bookstall(s) {
    if (s.flag('c12_atlas_found')) return s.narrate('The bookstall. Every book on it is brand new. None of them has an ending yet.');
    s.setFlag('c12_atlas_found');
    await s.narrate('A bookstall. Every spine is uncracked. And there, face-up, in green cloth with a gilt sunburst—');
    await s.say('Wren', '_The Sunward Atlas._ He gave me this. The day he came to Lanternfall. Mine\'s salt-stained and falling apart, and this one\'s...');
    await s.narrate('Wren opens it to the flyleaf. The handwriting is a boy\'s — careful, joined-up, pressing too hard.');
    await s.narrate('_For Lysa, who wants to know where the sun goes. Happy festival. — C._');
    await s.wait(1.0);
    await s.say('Wren', '...It was hers. The book he gave me. He bought it for her, and she never got to open it.');
    await s.say('Ilse', 'Wren.');
    await s.say('Wren', 'I\'m keeping it. Not for me. Someone should give it back to him.');
    await s.give('c12_first_atlas');
    s.quest('c12_q_atlas', 'Where the Sun Goes', 'A first edition of The Sunward Atlas, inscribed by a twelve-year-old Cassian to his sister. Give it back to its owner.');
  },

  // =================================================================== THE NIGHT OF THE SPILL
  async memoryIntro(s) {
    if (s.flag('c12_mem_enter')) return;
    s.setFlag('c12_mem_enter');
    s.music('gloam');
    s.place('player', 22, 45, 'up');
    await s.wait(0.6);
    await s.narrate([
      'The cathedral doors close behind you. On the other side, it is night.',
      'The same streets. The same bunting, torn now, dragging in the gutters. Every bell in Aurenne is ringing, and none of them in time.',
    ]);
    await s.say('Ilse', 'It\'s night. Wren, it wasn\'t night a second ago.');
    await s.say('Sable', 'It is the same day. Later. This is the night after the festival.');
    await s.say('Sable', 'This is the night he stopped every clock so that he would never reach it.');
    await s.narrate('Violet light pools in the low places, cold as the bottom of the sea.');
    await s.say('Corvin', 'The Gloam. In Aurenne. Heard the stories, growing up. Never thought I\'d get the tour.');
    await s.say('???', 'LYSA! Lysa, where ARE you?!', { portrait: false });
    s.spawn('boy', 'cassian_young', 22, 34, 'down');
    await s.move('boy', [[22, 42]], 5);
    await s.say('Cass', 'Have you seen my sister? She\'s ten, she\'s got black hair and a white dress and a ribbon, it\'s always coming undone—');
    await s.narrate('A boy of twelve, out of breath. Fair hair. Eyes the exact grey-blue of the Hierophant\'s.');
    await s.say('Wren', '...Cassian?');
    await s.say('Cass', 'How do you know my name? Are you from the Choir? Did Father send you? No — he wouldn\'t, he can\'t leave the Lantern, not tonight—');
    await s.say('Cass', 'She went to see the purple lights. She said they were pretty. I said I\'d come with her and I didn\'t. I was eating honeycake.');
    if (has(s, 'sable')) {
      await s.say('Cass', 'Lysa?! Lysa — oh. No. Sorry. You look — you look just like—');
      await s.say('Sable', 'I know.');
    }
    await s.say('Ilse', '_(quietly)_ He can see us. Wren, he can see us. That shouldn\'t—');
    await s.say('Sable', 'It is his memory. He has always been able to see me.');
    await s.say('Wren', 'We\'ll help you find her. Okay? We\'ll find her.');
    await s.say('Cass', 'Promise?');
    await s.wait(1.0);
    await s.say('Wren', '...I promise.');
    await s.move('boy', [[22, 30]], 5);
    s.remove('boy');
    await s.say('Bram', 'Wren. You know how this ends.');
    await s.say('Wren', 'I know how this ends.');
    await s.say('Wren', 'I promised anyway.');
    s.objective('Follow young Cassian north to the Grand Lantern plaza.');
    s.journal('Inside the cathedral it\'s the night Lysa was lost. Cassian is twelve. I promised him we\'d find her. I know how it ends.');
  },

  async rift(s) {
    if (s.flag('c12_mem_lost')) return;
    await s.fadeOut(0.3);
    s.place('player', 22, 16, 'up');
    s.remove('m_cass');
    s.spawn('boy', 'cassian_young', 18, 17, 'up');
    await s.fadeIn(0.3);
    s.music('tension');
    await s.pan(22, 11, 1.4);
    await s.narrate('In the middle of the plaza, the cobbles have opened like a wound. Violet light pours up out of it.');
    await s.narrate('At its edge stands a girl in a white festival dress, ribbon undone, looking down into the light.');
    await s.say('Lysa', 'It\'s so pretty, Cass. It\'s like the sun, only backwards.');
    await s.move('boy', [[18, 13], [21, 13]], 4.5);
    await s.say('Cass', 'Lysa! Get away from there! Come here, come HERE—');
    await s.say('Lysa', 'Do you think this is where it goes? The sun, at night? I want to see where it goes.');
    await s.say('Wren', 'Lysa — step back. Slowly. Come to me.');
    s.face('m_lysa', 'down');
    await s.say('Lysa', 'Who are you?');
    if (has(s, 'sable')) {
      await s.say('Lysa', '...Oh! You look like me! Cass, look, she looks like me, only older—');
      await s.say('Sable', '_(very quietly)_ Only older.');
    }
    s.shake(0.35, 1.4);
    s.sfx('dark');
    await s.narrate('The light in the wound blinks. Then something behind it opens an eye.');
    await s.narrate('The Gloam — the one night it came into Aurenne. It is very big, and very old, and very hungry.');
    await s.say('Bram', 'Everybody behind me! Wren — "behind me" is not a suggestion — WREN—');
    const r = await s.battle('c12_boss_hungry', { bg: 'gloam' });
    if (r !== 'win') return;
    s.setFlag('c12_mem_lost');
    s.stopMusic(1);
    await s.narrate('The Hungry Dark comes apart like smoke in a wind.');
    await s.say('Ilse', 'We did it. Wren — we did it, she\'s—');
    await s.narrate('And then the memory remembers how it goes.');
    s.shake(0.4, 1.6);
    s.sfx('quake');
    await s.say('Aurel', 'CASSIAN! GET AWAY FROM THE EDGE!', { portrait: false });
    await s.pan(22, 4, 1.4);
    await s.narrate('High above, in the gallery of the Grand Lantern, a man in a Keeper\'s robes holds the great lamp in both hands. Its beam swings down toward the plaza — toward the children—');
    await s.say('Aurel', 'Lysa — hold on, hold on, I can—', { portrait: false });
    await s.narrate('—and stops.');
    await s.narrate('Under the plaza, the Gloam is rising through every drain in the city. If the beam turns down to one small girl, it turns away from a hundred thousand people.');
    await s.say('Aurel', '...I can\'t. Forgive me. I can\'t.', { portrait: false });
    await s.narrate('The light swings up, and out, over the city. The plaza goes dark.');
    s.sfx('dark');
    await s.flash('#1a0e2a', 1.4);
    await s.pan(22, 11, 0.8);
    await s.say('Lysa', 'Cass?');
    s.remove('m_lysa');
    await s.flash('#b080ff', 0.6);
    await s.narrate('When the light comes back, the wound in the cobbles has closed. The girl is gone. Her ribbon lies on the stones.');
    await s.move('player', [[22, 14]], 6);
    await s.say('Wren', 'No— no, no, NO—');
    await s.say('Ilse', 'Wren. Wren, it already happened. It happened forty years ago. We can\'t—');
    await s.say('Wren', 'I PROMISED him—');
    await s.narrate('You can win the fight. You cannot change the memory.');
    s.music('sad');
    await s.move('boy', [[22, 13], [22, 12]], 1.2);
    s.face('boy', 'up');
    await s.say('Cass', 'Lysa?', { speed: 0.6 });
    await s.wait(1.4);
    await s.say('Cass', '...Lysa.', { speed: 0.5 });
    s.remove('boy');
    s.spawn('m_cass_kneel', 'cassian_young', 22, 12, 'up', { name: 'Cass', run: (s2) => C12.understand(s2) });
    await s.follow(0.8);
    s.objective('Talk to young Cassian.');
    s.journal('We beat the thing that came out of the dark. It didn\'t matter. His father chose the city, and Lysa was gone anyway. I promised.');
  },

  async understand(s) {
    if (!s.flag('c12_mem_lost') || s.flag('c12_mem_done')) return;
    s.setFlag('c12_mem_done');
    s.music('sad');
    s.place('player', 22, 14, 'up');
    s.remove('m_aurel');
    s.spawn('m_aurel', 'c12_aurel', 22, 5, 'down', { name: 'Aurel', run: (s2) => C12.aurel(s2) });
    await s.move('m_aurel', [[22, 7], [23, 8], [23, 11]], 1.6);
    s.face('m_aurel', 'left');
    await s.say('Aurel', 'Cassian.');
    await s.say('Cass', 'You chose the Lantern.');
    await s.say('Aurel', 'I chose the city. A hundred thousand people, Cass. Your mother. You.');
    await s.say('Cass', 'She WAS the city! She was — she was the whole—');
    await s.narrate('The Keeper kneels and reaches for his son. The boy flinches away.');
    await s.say('Aurel', '...I will choose it every night for the rest of my life. And every night it will be the wrong choice.');
    await s.narrate('He stays like that, kneeling, with his hand held out, for a long time. The boy does not take it.');
    await s.say('Cassian', '_He tried to hold me. I didn\'t let him. I never let him, after._', { portrait: false });
    await s.say('Cassian', '_He died when I was twenty. I sang at his funeral. I was very good._', { portrait: false });
    await s.move('m_aurel', [[23, 8], [24, 7]], 1.2);
    s.face('m_aurel', 'down');
    await s.say('Wren', 'Hey.');
    await s.say('Cass', 'You said you\'d find her.');
    await s.say('Wren', 'I know.');
    await s.say('Cass', 'You promised.');
    await s.say('Wren', 'I know. I\'m sorry. I\'m so sorry.');
    await s.wait(1.0);
    await s.say('Cass', 'Everyone\'s going to say he was right. A hundred thousand people. They\'ll write it in a book.');
    await s.say('Cass', 'She was afraid of the dark, did you know that? She pretended she wasn\'t. She walked toward it because she was scared of it. That\'s what she was like.');
    await s.say('Wren', 'My dad went out on the sea when I was nine. He didn\'t come back.');
    await s.say('Wren', 'My mom was the Keeper. I always thought — if she\'d turned the light out to sea, instead of keeping it on the rocks — maybe...');
    await s.say('Wren', 'I never asked her. I was too angry to ask. And now I can\'t.');
    await s.wait(0.8);
    await s.say('Cass', 'Does it stop hurting?');
    await s.wait(1.2);
    await s.say('Wren', 'No.');
    await s.say('Wren', 'It gets... smaller. Not the hurt — you get bigger around it. Somebody told me that once. I didn\'t believe her either.');
    await s.say('Cass', 'If I could stop it at the afternoon. Just before. Just the good part, forever. Then nobody would ever have to choose.');
    await s.narrate('There it is. Forty years of the Vespersong, in one sentence, in a twelve-year-old\'s mouth.');
    await s.say('Wren', '...I know. I know you would.');
    await s.say('Wren', 'I almost did too. I gave you — I gave *him* — the Dawnstone. Because I wanted the good part back.');
    if (has(s, 'sable')) {
      s.spawn('p_sable', lookOf(s, 'sable'), 20, 14, 'up');
      await s.move('p_sable', [[20, 13], [21, 13]], 1.4);
      s.face('p_sable', 'right');
      await s.say('Sable', 'Cassian.');
      await s.say('Cass', '...You\'re not her.');
      await s.say('Sable', 'No. I was made from how you remember her. And you remember her laughing. Almost always laughing.');
      await s.say('Sable', 'That is a good way to remember someone. I think she would like it.');
    }
    await s.narrate('The boy looks up for a long moment. Then he wipes his face on his sleeve, the way boys do when they don\'t want anyone to see.');
    await s.say('Cass', 'Go up. He\'s at the top. He\'s always at the top now.');
    await s.say('Cass', 'Tell him — tell him I\'m sorry I was eating honeycake.');
    await s.narrate('And the memory lets him go, like breath fading off a cold window.');
    s.remove('m_cass_kneel');
    s.remove('p_sable');
    s.sfx('holy');
    await s.say('Ilse', 'Wren. Are you—');
    await s.say('Wren', 'Okay. I\'m okay.');
    await s.wait(0.8);
    await s.say('Wren', 'I\'m not okay. Let\'s go.');
    await s.say('Corvin', 'Most honest thing anybody\'s said in this whole city, sparrow.');
    s.objective('The Lantern door has opened. Climb the Grand Lantern.');
    s.journal('I talked to Cassian when he was twelve. He asked if it stops hurting. I told him the truth. He said: tell him I\'m sorry I was eating honeycake.');
  },

  async aurel(s) {
    if (!s.flag('c12_mem_done')) return s.say('Aurel', '...');
    return s.say('Aurel', ['Go up. The door is open.', 'Every night I climb those stairs. Every night I choose. Go on — someone ought to reach the top who isn\'t me.']);
  },

  async lorneJournal(s) {
    await s.narrate([
      'A Keeper\'s logbook, left open on the garden table. Wind readings. Tide tables. The Dawnsong\'s timing, kept to the second.',
      'The last entry is in a shaking hand, dated a year after this night:',
      '_Cassian will not speak to me. I do not blame him. I chose the city. I would choose it again. I will never forgive the man who did._',
    ]);
    if (!s.flag('c12_journal_read')) {
      s.setFlag('c12_journal_read');
      await s.say('Wren', '...Maybe there was a choice. Maybe Mom had one too, the night Dad went out. And maybe it was this.');
      await s.say('Ilse', 'Maybe there wasn\'t. Sometimes there isn\'t one, Wren. Sometimes there\'s just the sea.');
    }
  },

  async youngAldousNight(s) {
    await s.say('Squire Venn', ['S-stay back, everyone! Squire Venn, Dawnguard! I\'m holding the line!', 'I\'m— I\'m scared. I\'m doing it anyway.']);
    if (!s.flag('c12_aldous_night')) {
      s.setFlag('c12_aldous_night');
      await s.say('Bram', '...He\'s shaking like a leaf. And he hasn\'t moved an inch.');
      await s.say('Bram', 'That\'s my knight.');
    }
  },

  // =================================================================== THE NOON STAIR
  async stairIntro(s) {
    if (s.flag('c12_camp') && !s.flag('c12_camp_rested')) return C12.restoreCamp(s);
    if (s.flag('c12_stair_enter')) return;
    s.setFlag('c12_stair_enter');
    s.music('evernoon');
    s.place('player', 18, 41, 'up');
    await s.wait(0.4);
    await s.narrate([
      'Inside the Grand Lantern, it is noon again. It is always noon again.',
      'The stair winds up through white marble — the way a boy of twelve remembered his father\'s tower. Impossibly tall. Impossibly bright.',
    ]);
    await s.say('Cassian', 'You met him. Me. I\'d forgotten I was ever that small.', { portrait: false });
    await s.say('Cassian', 'Come up, Wren. The bells will let you through if you ask them. I left them that way for you.', { portrait: false });
    await s.say('Pip', 'He\'s being NICE again. I\'m gonna be sick on his nice marble.');
    await s.pan(18, 19, 1.6);
    await s.narrate('Above, the way up is barred by a gate of gold. To either side, a bell hangs silent — one in the west gallery, one in the east.');
    await s.follow(1.0);
    s.objective('Ring the bells in the west and east galleries to open the stair.');
    s.journal('The Grand Lantern, as Cassian remembers it. The stair is barred. Two bells.');
  },

  /** side: 'w' | 'e' */
  async bell(s, side) {
    const flag = `c12_bell_${side}`;
    if (s.flag(flag)) return s.narrate('The bell still hums, very faintly, the note it was given.');
    await s.narrate(side === 'w'
      ? 'A bronze bell on a marble post. Before you can touch it, the statues of the gallery turn their heads.'
      : 'A bronze bell above the writing desks. The ink in every well begins to boil, and something steps out of the light.');
    const r = await s.battle(side === 'w' ? 'c12_sentry_w' : 'c12_sentry_e', { bg: 'evernoon' });
    if (r !== 'win') return;
    s.setFlag(flag);
    s.sfx('holy');
    await s.narrate('Wren rings the bell. The note goes up, and up, and up the tower, and doesn\'t come back down.');
    if (s.flag('c12_bell_w') && s.flag('c12_bell_e')) {
      await s.pan(18, 20, 1.4);
      s.clearBlocker('bell_gate');
      await s.narrate('Far above, the golden gate draws back.');
      await s.follow(1.0);
      s.objective('Climb to the top of the Noon Stair.');
      s.journal('We rang both bells. The way up is open.');
    } else {
      s.objective('Ring the other bell to open the stair.');
    }
  },

  async statue(s, who) {
    const S = STATUES[who];
    await s.narrate(S.text);
    if (S.react && !s.flag(`c12_statue_${who}`)) {
      s.setFlag(`c12_statue_${who}`);
      for (const [name, line] of S.react) if (name === 'Wren' || has(s, name.toLowerCase())) await s.say(name, line);
    }
  },

  // ------------------------------------------------------------------- the last camp
  async camp(s) {
    if (s.flag('c12_camp')) return;
    s.setFlag('c12_camp');
    s.music('lanternfall');
    s.place('player', 22, 12, 'up');
    C12.spawnCamp(s);
    await s.wait(0.6);
    await s.say('Corvin', 'Last stop before the top. Old Dawnguard rule: never storm a throne on an empty stomach.');
    await s.say('Ilse', 'That is not a rule.');
    await s.say('Corvin', 'It is now. I\'m making it one. Pip — the bread.');
    await s.say('Pip', 'What bread?');
    await s.say('Corvin', 'The bread in your coat.');
    await s.say('Pip', '...This bread?');
    await s.narrate('They build a fire out of nothing — a broken bench, a banner, a hymnal Corvin swears was already on fire. In Evernoon it is always noon. Nobody mentions that the fire makes it feel like evening.');
    await s.say('Bram', 'Cards? One hand. For morale.');
    await s.say('Ilse', 'You are terrible at cards, Bram.');
    await s.say('Bram', 'Which is why it will be EXCELLENT for everyone else\'s morale.');
    await s.say('Sable', 'What happens after?');
    await s.wait(0.8);
    await s.say('Sable', 'After the top. After him. What happens?');
    await s.narrate('Nobody answers right away. The fire pops.');
    await s.say('Wren', '...I don\'t know. I don\'t think anybody gets to know that part ahead of time.');
    await s.say('Sable', 'Good. I would like to not know it with you.');
    s.objective('Talk with everyone around the fire. When you\'re ready, rest by it.');
    s.journal('We made camp at the top of the stair. Corvin\'s new rule: never storm a throne on an empty stomach. Sable asked what happens after.');
  },

  spawnCamp(s) {
    for (const [id, x, y, dir] of CAMP_SPOTS) {
      if (!has(s, id)) continue;
      s.spawn(`camp_${id}`, lookOf(s, id), x, y, dir, { name: s.state.characters[id].name, run: (s2) => C12.campTalk(s2, id) });
    }
  },

  async restoreCamp(s) {
    if (!s.flag('c12_camp') || s.flag('c12_camp_rested')) return;
    C12.spawnCamp(s);
  },

  async campTalk(s, id) {
    const flag = `c12_camp_${id}`;
    if (s.flag(flag)) return s.say(s.state.characters[id].name, CAMP[id].again);
    s.setFlag(flag);
    await CAMP[id].talk(s);
  },

  async rest(s) {
    if (!s.flag('c12_camp')) return s.narrate('Someone made a fire here, recently. It is still burning. In Evernoon, it would be.');
    if (s.flag('c12_camp_rested')) return s.narrate('The fire is still going. It will be going long after you leave.');
    const left = PARTY.filter((id) => has(s, id) && !s.flag(`c12_camp_${id}`)).length;
    if (left && !(await s.confirm('Rest now? Not everyone has had their say.', 'Rest', 'Not yet'))) return;
    s.setFlag('c12_camp_rested');
    await s.fadeOut(1.2);
    await s.wait(0.6);
    for (const id of PARTY) s.remove(`camp_${id}`);
    s.heal();
    await s.fadeIn(1.0);
    await s.narrate([
      'Nobody sleeps much. Bram loses at cards four times. Pip steals Corvin\'s hat, gives it back, and steals it again. Sable falls asleep against Ilse\'s shoulder, and Ilse lets her.',
      'Wren sits up with the fire.',
    ]);
    await s.think('Wren', 'Mom. I\'m going to finish it. Not for you. Not because I owe it.');
    await s.think('Wren', '...Okay. A little because I owe it.');
    await s.think('Wren', 'Mostly because I want there to be an after.');
    await s.say('Ilse', 'Ready?');
    await s.say('Wren', 'No.');
    await s.say('Ilse', 'Good. Me neither. Let\'s go.');
    s.music('evernoon');
    s.objective('Climb to the Noon Throne.');
    s.journal('We rested. Nobody slept much. I told Mom I\'d finish it. I think she\'d want me to want an after.');
  },
};

// ===================================================================== data tables

const DIALS = {
  market: {
    troop: 'c12_boss_parade',
    intro: 'Across the square, a painted dancer turns on her toes — and keeps turning, faster and faster, toward you.',
    after: [['Pip', 'She just wanted to sit down. Forty years in dancing shoes. I\'d be mad too.'], ['Ilse', 'That is the most sympathy you have ever shown anyone, Pip.']],
    journal: 'The market sundial moved one minute. Its guardian was a dancer who never got to stop dancing.',
  },
  garden: {
    troop: 'c12_boss_kite',
    intro: 'A red kite drops out of the windless sky. Its string trails down to nobody.',
    after: [['Corvin', 'A kite that never comes down. Somebody\'s kid flew that. Somebody\'s kid never got to reel it in.'], ['Wren', '...His.']],
    journal: 'The garden sundial moved one minute. Its guardian was a kite that never came down.',
  },
  bell: {
    troop: 'c12_boss_bell',
    intro: 'High in the tower, the bell that should have rung one o\'clock swings back — and comes for you.',
    after: [['Bram', 'Bells should not be permitted to fight. It\'s unchivalrous.'], ['Ilse', 'Bram, you were hit by a bell.'], ['Bram', 'Exactly my point.']],
    journal: 'The bell-tower sundial moved one minute. Its guardian was the bell that should have rung one o\'clock.',
  },
};

const STATUES = {
  fisher: { text: 'A fisherman, mid-cast. The plaque reads: TO BE RETURNED.' },
  aldous: {
    text: 'A Dawnguard knight with a kind, tired face. The plaque reads: SIR ALDOUS VENN — TO BE RETURNED.',
    react: [['Bram', '...He\'d hate this. Standing still. He fidgeted. He couldn\'t sit through a sermon without whittling something.']],
  },
  tamsin: {
    text: 'A blind woman with her eyes closed, smiling at something no one else can see. TAMSIN OF SALTGLASS — TO BE RETURNED. Someone has scratched underneath, very small: SHE WOULD NOT HAVE WANTED THIS.',
    react: [['Pip', 'She wouldn\'t have. She\'d have smacked him with her stick.']],
  },
  edrin: {
    text: 'A man in a fisherman\'s cap, with Wren\'s chin and Wren\'s crooked smile. EDRIN HALLOWAY — TO BE RETURNED.',
    react: [['Wren', '...Dad.'], ['Wren', 'It\'s a good likeness. He always looked like he was about to say something funny.']],
  },
  ysolde: {
    text: 'A woman in a Keeper\'s robes, braid over one shoulder. The marble is new; the dust has not settled on it yet. YSOLDE HALLOWAY — TO BE RETURNED.',
    react: [['Wren', 'He made her a statue. He made her a STATUE.'], ['Ilse', 'Wren—'], ['Wren', 'I\'m fine. I\'m — let\'s ring the bell.']],
  },
  lysa: {
    text: 'A girl of ten, mid-laugh, ribbon flying. The plaque has been carved and re-carved so many times the letters are deep as wounds. It says only: FIRST.',
    react: [['Sable', 'He made her laughing. Of course he did.']],
  },
  letters: {
    text: 'Letters. Thousands of them, from every corner of Solmere, every one answered and filed. "Dear Hierophant, my son is sick." "Dear Hierophant, the Lantern in our village has gone dim."',
  },
  wren_letters: {
    text: 'A shelf labelled HALLOWAY, W. Every letter you ever wrote him, pressed flat. Beside each, a note in his hand: "Restless. Like L." "Asks where the sun goes. Like L." "Wants to leave the island. Like L."',
    react: [['Wren', 'He wasn\'t writing to me. He was writing to her.'], ['Ilse', 'He was writing to both of you. That\'s worse.']],
  },
  drafts: { text: 'A shelf labelled VESPERSONG — DRAFTS. Forty years of music. The earliest pages are in a boy\'s handwriting, with the notes drawn as little suns.' },
  unsent: {
    text: 'An unfinished letter on the desk: "Dear Wren — By the time you read this, the sun will have stopped, and you will never have to lose anyone again. I\'m sorry it had to be your mother\'s Dawnstone. I\'m sorry for—" Nothing more. The ink has dried on the nib.',
    react: [['Corvin', 'Didn\'t finish the sorry. Man never could.']],
  },
};

const CAMP_SPOTS = [['ilse', 20, 9, 'right'], ['bram', 24, 9, 'left'], ['sable', 20, 11, 'right'], ['pip', 23, 8, 'down'], ['corvin', 25, 11, 'left']];

const CAMP = {
  ilse: {
    again: 'Three things: eat something, sleep a little, and don\'t die tomorrow. Physician\'s orders.',
    async talk(s) {
      await s.say('Ilse', 'Three things.');
      await s.say('Wren', 'Of course.');
      await s.say('Ilse', 'One. When we were six, you told me you\'d leave the island one day, and I\'d stay and be a boring herbalist, and you\'d send me postcards. I cried for a week.');
      await s.say('Wren', 'I didn\'t know that.');
      await s.say('Ilse', 'You weren\'t supposed to. Two. When you gave him the Dawnstone, I wanted you to hurt as much as everyone else did. For a whole year I wanted that.');
      await s.say('Wren', '...I know.');
      await s.wait(0.8);
      await s.say('Ilse', 'Three. I stopped. Not because you deserved it. Because I deserved to put it down. It was heavy, Wren. I carried it everywhere. I couldn\'t hold anything else.');
      await s.say('Wren', 'What do you want to hold instead?');
      await s.say('Ilse', 'A hospital. A real one, with windows. A day off. And I want to be bad at something, on purpose. Painting. Or the fiddle.');
      await s.say('Wren', 'You\'d be terrible at the fiddle.');
      await s.say('Ilse', 'I know. Isn\'t it wonderful?');
      await s.say('Ilse', 'The light said Mender and I said yes, because it was expected. Now I\'d say yes anyway. That\'s the difference. That\'s the whole difference.');
    },
  },
  bram: {
    again: 'If I freeze tomorrow, kick me. Gently. Then less gently.',
    async talk(s) {
      await s.say('Bram', 'Wren. May I confess something? It\'s not dignified.');
      await s.say('Wren', 'When has that ever stopped you?');
      await s.say('Bram', 'Fair. I\'m scared. Not ordinary scared — bone-scared. The kind I had at my knighting trial, when I froze, and Sir Aldous...');
      await s.say('Bram', 'I always thought the brave ones didn\'t feel it. I thought there was a sort of valve. A spiritual cork. And I was born without one.');
      if (s.flag('c12_q_aldous_done')) {
        await s.say('Bram', 'Then I met him. Down there. Seventeen and shaking like a wet dog, and holding his spear anyway.');
        await s.say('Bram', 'He wasn\'t born with a cork either. Nobody is. You just stand in the right place while you\'re scared. That\'s all it ever was.');
      } else {
        await s.say('Bram', 'But I remember now — before every tourney, he\'d go very quiet and rub his thumb on his sword-hilt till it shone. I thought it was for luck.');
        await s.say('Bram', 'It wasn\'t luck. He was scared. He did it anyway. That\'s all it ever was.');
      }
      await s.say('Wren', 'So you\'re going to be scared tomorrow.');
      await s.say('Bram', 'Magnificently. I shall be the most frightened man ever to stand in front of a god. And I shall stand there.');
      await s.say('Bram', 'Someone should carve that on my tomb. Not soon. Ideally never.');
    },
  },
  sable: {
    again: 'Tomorrow is my birthday. I am practicing being older. How am I doing?',
    async talk(s) {
      await s.say('Sable', 'Ilse measured me. Against the galley door on the Halcyon.');
      await s.say('Wren', 'And?');
      await s.say('Sable', 'Half an inch. Since the Kindling, I have grown half an inch.');
      await s.say('Sable', 'In Evernoon I would be sixteen forever. Never older. Never anything.');
      await s.say('Sable', 'I want the other halves. All of the inches. I want grey hair. Corvin has some. He says it is terrible. I think it is the best thing I have ever seen.');
      await s.say('Wren', 'Don\'t tell him that.');
      await s.say('Sable', 'I told him. He went very quiet and gave me his hat.');
      await s.wait(0.8);
      await s.say('Sable', 'I do not have a birthday. Lysa had one, in spring. I do not want hers.');
      await s.say('Wren', 'Then pick one.');
      await s.say('Sable', 'Tomorrow.');
      await s.say('Sable', 'If there is a tomorrow, that is my birthday. And if there is not... then I had a very short life, and it was mine.');
      await s.say('Wren', 'There\'s going to be a tomorrow, Sable.');
      await s.say('Sable', 'Then you owe me a present.');
    },
  },
  pip: {
    again: 'If you tell anyone I said "it was great," I\'m stealing your boots. Both of \'em. While you\'re wearing \'em.',
    async talk(s) {
      await s.say('Pip', 'Don\'t make it a whole thing.');
      await s.say('Wren', 'I didn\'t say anything.');
      await s.say('Pip', 'You were gonna. You\'ve got your whole-thing face on.');
      await s.wait(0.8);
      await s.say('Pip', '...Back in Kiteholm I had twenty kids. I was the oldest. I was ELEVEN. I did the cooking, and the stealing, and the telling-them-it\'d-be-fine.');
      await s.say('Pip', 'I don\'t know how to stop. Being the oldest. Corvin keeps doing stuff FOR me. Ilse cut my hair. Bram carries me to my hammock when I fall asleep on deck, like a sack of flour.');
      await s.say('Wren', 'And?');
      await s.say('Pip', 'And I LIKED it, okay? It was GREAT. I\'m gonna be so embarrassed about this later.');
      await s.say('Pip', 'When this is done... can I still be on the crew? Even if I\'m, like, twelve? Just twelve? Doing twelve stuff?');
      await s.say('Wren', 'Pip. You can be twelve as long as you want.');
      await s.say('Pip', '...Just a year\'s fine. Then thirteen. Then I\'ll see.');
      await s.say('Pip', 'Don\'t tell Corvin I said any of this. He\'ll do the hair-ruffle thing.');
    },
  },
  corvin: {
    again: 'Watch is mine tonight. Strange feeling, staying put. I could get used to it.',
    async talk(s) {
      await s.say('Corvin', 'Pull up a crate, sparrow. The good crate. I\'ve been saving it.');
      await s.say('Corvin', 'Want to know something funny? Every bone in my body\'s been telling me to run since the desert. Loud. Persistent. Very good arguments.');
      await s.say('Corvin', 'And I keep not listening. Twelve years I listened to nothing but that voice. Turns out it\'s a lot less convincing when there\'s somebody to stay for.');
      await s.say('Wren', 'You owed Cassian your life. You said so once.');
      await s.say('Corvin', 'Pulled me out of a burning barracks when I was nineteen. Never asked for anything back.');
      await s.say('Corvin', 'Until he asked for everything. Funny how that goes.');
      await s.wait(0.8);
      await s.say('Corvin', 'You kids went and made me into somebody\'s — I don\'t know. Uncle. Bad uncle. The one who teaches you cards and gets you tipsy at weddings.');
      await s.say('Wren', 'Corvin.');
      await s.say('Corvin', 'Mm?');
      await s.say('Wren', 'You\'re not our uncle.');
      await s.wait(1.0);
      await s.say('Corvin', '...Don\'t. Don\'t say it, sparrow. I\'ll cry, and then Pip\'ll steal my handkerchief, and then where will I be.');
      await s.say('Corvin', 'Go on. Get some rest. I\'ll keep watch. Somebody has to, and I\'ve finally got the knack of it.');
    },
  },
};
