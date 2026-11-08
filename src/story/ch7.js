// CHAPTER 7 — "The Mender of Ash"
// The ruins of Aurenne, one year after the Sundering. Ilse runs the Ember Ward.
// She will not look at Wren. The medicine is in the drowned Undercroft.

import { EQUIPMENT } from '../data/equipment.js';

// ---------------------------------------------------------------------------
// Shared helper (also used by ch8): bring a friend back after the timeskip.
// ---------------------------------------------------------------------------

// Gear a companion scavenged during the lost year. Only replaces worse items.
const SURVIVOR_GEAR = {
  ilse: { weapon: 'starwood_staff', body: 'starweave_robe', head: 'star_diadem' },
  bram: { weapon: 'starsteel_sword', offhand: 'starsteel_aegis', body: 'starsteel_plate', head: 'starsteel_helm' },
  pip: { weapon: 'starsteel_stiletto', body: 'starweave_coat', head: 'starweave_hood' },
};

/** Level, re-look, re-gear and (re)join a companion. */
export async function rejoin(s, id, level, look, quiet = false) {
  const ch = s.state.addCharacter(id);
  ch.setLevel(level);
  s.setLook(id, look);
  s.awaken(id);
  for (const [slot, item] of Object.entries(SURVIVOR_GEAR[id] || {})) {
    const cur = EQUIPMENT[ch.equipment[slot]];
    if (!ch.canEquip(item) || (cur && (cur.tier || 0) >= EQUIPMENT[item].tier)) continue;
    if (cur) s.state.inventory.add(cur.id);
    ch.equipment[slot] = item;
  }
  ch.fullHeal();
  await s.join(id, quiet);
}

/** Make sure a cast member exists (for portraits) and wears their Act II look. */
export function dress(s, id, look) {
  s.state.addCharacter(id);
  s.setLook(id, look);
}

const ILSE_IN = (s) => s.state.party.includes('ilse');

/** @type {import('../types/data').StoryScripts} */
export const CH7 = {
  // =========================================================================
  // Arrival
  // =========================================================================
  async opening(s) {
    if (s.flag('c7_arrived')) return;
    s.setFlag('c7_arrived');
    dress(s, 'ilse', 'ilse_ruin');
    await s.fadeOut(0);
    s.music('ruin');
    s.place('player', 20, 41, 'up');
    await s.pan(23, 9, 0.1);
    await s.fadeIn(2.0);
    await s.narrate([
      'A year ago, Aurenne had four hundred bells. Every hour they argued about what time it was.',
      'Now it is always the same time. Always this bruised, burning dusk.',
      'And no bells ring.',
    ]);
    await s.wait(0.6);
    await s.think('Wren', 'The Grand Lantern. It\'s cracked straight down the middle, like an egg somebody dropped.');
    await s.think('Wren', 'He stood up there and sang the world to pieces. And I handed him the last piece.');
    await s.follow(1.4);
    await s.move('player', [[20, 38]], 2.2);
    s.place('sorrel', 21, 33, 'down');
    await s.move('sorrel', [[20, 34], [20, 36]], 3.2);
    await s.say('Sorrel', 'Stop there. Hands.');
    await s.say('Wren', 'My—?');
    await s.say('Sorrel', 'Palms, then backs. Sleeves up. I\'m looking for violet under the skin.');
    await s.emote('player', '…');
    await s.wait(0.6);
    await s.say('Sorrel', 'Clean. Lucky you. Name?');
    await s.wait(0.8);
    await s.say('Wren', '...Wren.');
    await s.say('Sorrel', 'Just Wren?');
    await s.say('Wren', 'Just Wren.');
    await s.say('Sorrel', 'Fine, Just Wren. Rules. Water\'s rationed — the well in Ash Square, one bucket a family. Anyone who shows violet goes to the Ward. And nobody goes into the Undercroft.');
    await s.say('Wren', 'What\'s in the Undercroft?');
    await s.say('Sorrel', 'Water. And singing.');
    await s.say('Wren', 'Who\'s in charge here?');
    await s.say('Sorrel', 'Nobody\'s in charge. The Ward Mother keeps people breathing. These days that\'s the same thing.');
    await s.say('Sorrel', 'Came in off a boat from the west, a year back. Nothing but a Mender\'s Crest and a temper. Sixteen, if she was a day. Name of Marrow.');
    await s.wait(0.4);
    await s.emote('player', '!');
    await s.say('Wren', '...Ilse? Ilse Marrow?');
    await s.say('Sorrel', 'You know her?');
    await s.wait(1.0);
    await s.say('Wren', 'I used to.');
    await s.say('Sorrel', 'The Ember Ward\'s the old Bellwrights\' Hall, east side. If you\'ve got hands that lift, she\'ll use them. If you\'ve got questions, she won\'t.');
    await s.move('sorrel', [[20, 34], [19, 33]], 2.4);
    s.face('sorrel', 'down');
    s.objective('Find Ilse at the Ember Ward (the old Bellwrights\' Hall, east side of the ruins).');
    s.journal('Aurenne is ash. The bells are silent. And Ilse is alive. She runs a hospital here — and I have no idea what I\'m going to say to her.');
  },

  // =========================================================================
  // The Ember Ward
  // =========================================================================
  async wardFirst(s) {
    if (!s.flag('c7_arrived') || s.flag('c7_met_ilse')) return;
    s.setFlag('c7_met_ilse');
    s.music('sad');
    s.place('ilse', 5, 5, 'up');
    await s.wait(0.6);
    await s.narrate('Forty beds in a hall built for casting bells. Every one of them full.');
    await s.move('player', [[9, 8], [7, 7], [7, 6]], 2.4);
    s.face('player', 'left');
    await s.say('Ilse', 'Wash your hands at the basin. Then tell me where it hurts.');
    await s.wait(0.5);
    await s.say('Wren', 'Ilse.');
    await s.wait(1.4);
    await s.narrate('Her hands stop moving. Only for a moment.');
    await s.say('Ilse', '...Basin\'s by the door.');
    await s.say('Wren', 'Ilse, it\'s me. It\'s Wren. I looked for you — after — I didn\'t know if anybody—');
    await s.say('Ilse', 'I know who it is.');
    await s.say('Ilse', 'Noll. Bed six needs his dressing changed. Bed nine needs a priest. We haven\'t got one, so she needs you to hold her hand.');
    await s.say('Noll', 'Yes, Ward Mother.');
    await s.say('Wren', 'Can we talk? Please. Just for a—');
    await s.say('Ilse', 'Three things.');
    await s.say('Ilse', 'One. This is a hospital, and you are standing in the only clean aisle. Two. I have forty-one patients, and none of them is you.');
    await s.wait(1.0);
    await s.say('Wren', '...And three?');
    await s.say('Ilse', 'Three is none of your business.');
    await s.move('ilse', [[5, 7], [8, 7], [8, 4], [10, 4], [10, 3]], 3.2);
    s.face('ilse', 'up');
    await s.wait(0.8);
    await s.think('Wren', 'She didn\'t look at me. Not once.');
    await s.move('noll', [[7, 7]], 2);
    s.face('noll', 'player');
    s.face('player', 'down');
    await s.say('Noll', '_(whispering)_ She\'s not like that.');
    await s.say('Noll', '...She is exactly like that. But not usually at _people_.');
    await s.say('Noll', 'I\'m Noll. I\'m the Ward\'s apprentice. Well — I\'m the Ward\'s everything-else.');
    await s.say('Wren', 'What\'s wrong with them? All of them?');
    await s.say('Noll', 'Gloam-rot. It gets in through cuts. Turns the blood violet, then it turns _you_ violet, and then you get very quiet.');
    await s.say('Noll', 'We had sunsalt — the Choir\'s old remedy. Holds the rot back for a season. We\'re down to two phials. Forty-one patients.');
    await s.say('Wren', 'Where does sunsalt come from?');
    await s.say('Noll', 'The Choir apothecary made it. Under the Cathedral. In the Undercroft.');
    await s.say('Wren', 'Then somebody goes down and gets more.');
    await s.say('Noll', 'Somebody did. Three somebodies. Their names are on the wall by the door.');
    await s.wait(0.6);
    await s.say('Noll', 'If you want to help — really help — we\'re out of water. The well\'s in Ash Square. Sorrel\'s strict, but she won\'t say no to the Ward.');
    s.objective('Fetch water for the Ember Ward from the well in Ash Square.');
    s.journal('Ilse wouldn\'t look at me. Forty-one patients with Gloam-rot, and the medicine is somewhere under the Cathedral. I can at least carry water.');
  },

  async ilseTalk(s) {
    if (s.flag('c7_water_got') && !s.flag('c7_water_done')) return s.say('Ilse', 'Noll takes the water. Not me. I\'m busy.');
    const lines = ['If you\'re not bleeding, you\'re in the way.', '...', 'Basin. Door. Either one.', 'Noll knows where everything is. Ask Noll.'];
    const n = s.vars.c7_ilse_snub = (s.vars.c7_ilse_snub || 0) + 1;
    return s.say('Ilse', lines[(n - 1) % lines.length]);
  },

  async noll(s) {
    if (s.flag('c7_water_got') && !s.flag('c7_water_done')) return CH7.crisis(s);
    if (s.flag('c7_returned')) {
      return s.say('Noll', ['Pell\'s asked for his breakfast _twice_. Ward Mother says that\'s the best symptom there is.', 'Thank you. Both of you. I mean — all of you. Whoever\'s counting.']);
    }
    if (s.flag('c7_ilse_joined')) return s.say('Noll', ['I can hold the Ward. I can. I\'ve watched her do it for a year.', 'Just... come back. Both of you. She\'d hate it if I cried in front of the patients.']);
    if (!s.flag('c7_q_rounds')) {
      s.setFlag('c7_q_rounds');
      await s.say('Noll', 'Water first. And if you\'ve got time after... there\'s Bette. She lost Captain Buttons — her doll — and she won\'t sleep without him.');
      await s.say('Noll', 'And Old Aurel in bed eleven wants somebody to read to him. The rot took his eyes, not his ears.');
      s.quest('c7_q_doll', 'Captain Buttons', 'Bette, a child in the Ember Ward, lost her rag doll somewhere in the ruins.');
      s.quest('c7_q_aurel', 'The Blind Archivist', 'Old Aurel in the Ember Ward wants someone to read to him.');
      return;
    }
    return s.say('Noll', 'The well\'s in the middle of Ash Square. Tell Sorrel it\'s for the Ward.');
  },

  async well(s) {
    if (s.flag('c7_met_ilse') && !s.flag('c7_water_got')) {
      s.setFlag('c7_water_got');
      await s.narrate('You lower the bucket. It takes a long time to reach anything.');
      await s.give('c7_water');
      s.objective('Bring the water back to Noll at the Ember Ward.');
      return;
    }
    return s.narrate(s.flag('c7_water_got')
      ? 'The rationed well. Someone has scratched a tally into the stone: one mark per bucket, a year of marks.'
      : 'The rationed well. A chain and a bucket, and a long way down to water that tastes faintly of bells.');
  },

  /** Water delivered — then Pell's rot turns. Ilse decides to go below. */
  async crisis(s) {
    s.setFlag('c7_water_done');
    await s.take('c7_water');
    await s.say('Noll', 'You actually did it! Sorrel usually makes people fill out a form she invented.');
    await s.say('Noll', 'Ward Mother says... "thank you." She said to say it exactly like that.');
    await s.say('Noll', 'Then she said "don\'t tell her I said it." I think I wasn\'t supposed to tell you that part either.');
    await s.wait(0.6);
    s.stopMusic(0.5);
    await s.say('???', 'Ward Mother— _Ward Mother_—!', { portrait: false });
    s.shake(0.1, 0.4);
    s.music('tension');
    s.face('player', 'left');
    await s.pan(5, 4, 0.6);
    await s.move('ilse', [[10, 4], [8, 4], [6, 5], [5, 5]], 5.5);
    s.face('ilse', 'up');
    await s.say('Ilse', 'Pell. Pell, look at me. Breathe. In through the nose—');
    await s.narrate('The boy in bed four is shaking. Violet runs under his skin like ink in water.');
    await s.wait(0.4);
    await s.think('Wren', 'Pell. Little Pell from Lanternfall. Who wanted to be a Vanguard when he grew up.');
    await s.say('Ilse', 'Noll. The phial. The last one.');
    await s.say('Noll', 'But that\'s the—');
    await s.say('Ilse', '_Noll._');
    await s.move('noll', [[7, 5], [6, 5]], 4);
    s.sfx('heal');
    s.flash('#ffe0a0', 0.5);
    await s.wait(1.2);
    await s.narrate('The violet slows. Stops. Retreats, a little, the way the tide retreats: to gather itself.');
    await s.say('Ilse', '...That buys him a week. Maybe less.');
    await s.follow(0.6);
    await s.say('Ilse', 'Noll. Get my coat.');
    await s.say('Noll', 'Ward Mother, no. You made the rule. Nobody goes down there—');
    await s.say('Ilse', 'I made the rule. I said nobody _else_.');
    await s.move('player', [[7, 6], [6, 6]], 3);
    s.face('player', 'left');
    await s.say('Wren', 'I\'m coming with you.');
    s.face('ilse', 'down');
    await s.say('Ilse', 'No.');
    await s.say('Wren', 'You patch, I go first. That\'s how it always worked. The tide caves. The black rocks. Every time.');
    await s.say('Ilse', 'Every time you went first, Wren, I ended up patching _you_.');
    await s.say('Wren', 'Then you know I\'m good at being patched.');
    await s.wait(1.6);
    await s.narrate('Ilse looks at the boy in bed four. At the forty other beds. At the wall of names by the door. At everything in the Ward except Wren.');
    await s.say('Ilse', '...For the patients.');
    s.face('ilse', 'up');
    await s.say('Ilse', 'Not for you.');
    s.music('ruin');
    s.remove('ilse');
    await rejoin(s, 'ilse', 40, 'ilse_ruin');
    s.setFlag('c7_ilse_joined');
    await s.say('Noll', 'I\'ll hold the Ward. I can hold the Ward.');
    await s.say('Ilse', 'You can. Beds two and thirty get water every hour. Don\'t let Old Aurel talk you into reading him the whole hymnal.');
    await s.say('Ilse', 'The Undercroft gate is in the Bellfounders\' Quarter — the sunken court on the west side. Sorrel bricked it up after the third team didn\'t come back.');
    s.objective('Go to the Undercroft gate in the Bellfounders\' Quarter (west side of the ruins).');
    s.journal('Pell is here. Pell from home. The rot nearly took him and Ilse used the last of the medicine. We\'re going into the Undercroft — "for the patients, not for you." I\'ll take it.');
  },

  /** Ilse's party commentary when inspecting the wall of names. */
  async wallOfNames(s) {
    await s.narrate('Names, chalked on the old bell-casting wall. Dozens. Some neat, some shaking. The newest three have no dates: DORAN. MAGS. LITTLE COBB.');
    if (s.flag('c7_tags_returned')) return s.narrate('Three tin tags hang on a nail beneath the newest names. Someone has polished them.');
    if (ILSE_IN(s)) await s.say('Ilse', 'I write them. Every one. My handwriting\'s getting worse.');
    return null;
  },

  // =========================================================================
  // The Undercroft gate
  // =========================================================================
  async gateRubble(s) {
    if (s.flag('c7_stair_open')) return;
    return s.narrate(['Rubble, packed tight under the old arch. Someone has chalked across it in big letters:', 'NOBODY. NOT EVEN YOU, MARROW.']);
  },

  async stairOpen(s) {
    if (!s.flag('c7_ilse_joined') || s.flag('c7_stair_open')) return;
    s.setFlag('c7_stair_open');
    s.place('sorrel', 12, 22, 'left');
    s.spawn('ilse_s', 'ilse_ruin', 8, 22, 'up');
    s.place('player', 7, 22, 'up');
    await s.wait(0.4);
    await s.say('Sorrel', 'Ward Mother. You know the rule.');
    s.face('ilse_s', 'right');
    await s.say('Ilse', 'I wrote the rule, Sorrel.');
    await s.move('sorrel', [[10, 22], [9, 22]], 3);
    await s.say('Sorrel', 'Then you know why I bricked it. Three good people. Mags could carry a door on her back.');
    await s.say('Ilse', 'And Pell has a week. Move the rubble.');
    await s.wait(1.0);
    await s.say('Sorrel', '...You\'re the only one who knows how to keep them breathing. You know that? If you don\'t come back, nobody does.');
    await s.say('Ilse', 'Noll does. I taught him.');
    await s.say('Sorrel', 'Noll is thirteen.');
    await s.say('Ilse', 'So was I, once. It didn\'t last.');
    await s.wait(0.8);
    s.face('sorrel', 'player');
    await s.say('Sorrel', 'You. Just Wren. You go first down there, hear me? She\'s worth ten of anybody in this city.');
    await s.say('Wren', 'I know. I\'ve always known.');
    await s.wait(0.4);
    s.face('ilse_s', 'up');
    await s.move('sorrel', [[9, 21], [8, 20]], 2.5);
    s.face('sorrel', 'up');
    s.shake(0.2, 0.8);
    s.clearBlocker('c7_rubble');
    await s.wait(0.8);
    await s.say('Sorrel', 'If you\'re not back by the dark bell—');
    await s.wait(0.6);
    await s.say('Sorrel', '...There aren\'t any bells. If you\'re not back, I\'m sealing it again.');
    await s.say('Ilse', 'Good.');
    s.place('sorrel', 19, 33, 'down');
    s.remove('ilse_s');
    s.objective('Descend into the Drowned Undercroft and find the Choir\'s sunsalt stores.');
    s.journal('Sorrel opened the Undercroft for Ilse. Not for me. That\'s fair. Everybody here would follow Ilse into the dark. I have to earn it.');
  },

  // =========================================================================
  // The Drowned Undercroft
  // =========================================================================
  async ucEntry(s) {
    s.spawn('ilse_s', 'ilse_ruin', 24, 36, 'up');
    await s.say('Ilse', 'Two rules. One: we don\'t split up. Two: if I say we turn back, we turn back.');
    await s.say('Wren', 'And three?');
    await s.say('Ilse', 'There isn\'t a three.');
    await s.say('Wren', 'There\'s always a three.');
    await s.wait(0.8);
    await s.say('Ilse', '...Not anymore.');
    await s.narrate('Somewhere far below, under the slap of water, something is singing. Not words. Just a note, held and held and held.');
    s.remove('ilse_s');
  },

  async ucGuard(s) {
    await s.say('Ilse', 'Your guard drops when you swing. The left side. It did a year ago, too.');
    await s.say('Wren', 'You remember that?');
    await s.say('Ilse', 'I remember where I had to put the stitches.');
  },

  async ucTags(s) {
    if (s.flag('c7_tags')) return s.narrate('A shallow alcove where three people sheltered. They are not here anymore.');
    s.setFlag('c7_tags');
    await s.narrate('An alcove of stacked bones — and, among the old ones, three new packs. A rope. A lantern, long dead. Three tin tags on cords.');
    await s.give('c7_tags');
    await s.say('Ilse', '_(very quietly)_ Doran. Mags. Little Cobb.');
    await s.say('Ilse', 'Cobb was fifteen. He wanted to be a Mender. He used to watch me stitch and count the knots out loud.');
    await s.wait(0.8);
    await s.say('Wren', 'We\'ll take them home.');
    await s.say('Ilse', 'They don\'t have homes. That\'s why they were in my Ward.');
    await s.say('Ilse', '...We\'ll take them home.');
    s.quest('c7_q_tags', 'Three Tin Tags', 'The third sunsalt team died in the Ossuary. Bring their tags back to Sorrel at the gate.');
  },

  async ucLab(s) {
    s.spawn('ilse_s', 'ilse_ruin', 34, 24, 'right');
    await s.say('Wren', 'Cages. Notes. Cauldrons... This was a laboratory.');
    await s.say('Ilse', 'Sister Mercy\'s. Before the end, people from the Undercroft went missing. Everybody knew. Nobody looked.');
    await s.say('Ilse', 'We looked. Remember? A year ago. We were so proud of ourselves for stopping her.');
    await s.wait(0.6);
    await s.say('Wren', 'We did stop her.');
    await s.say('Ilse', 'We stopped _her_. We didn\'t stop the man who signed her orders.');
    await s.wait(1.0);
    await s.say('Wren', '...Neither did I. I helped him.');
    await s.wait(1.2);
    await s.say('Ilse', 'I know. I was there.');
    s.remove('ilse_s');
  },

  async labNotes(s, n) {
    const notes = [
      ['A ledger in Mercy\'s cramped hand:', '"Subject 7 held its shape three days. On the second day it asked for its mother. It did not have one. I wrote one down for it, so it would stop asking."'],
      ['A loose page, pinned under a scalpel:', '"The Gloam keeps everything it is given — every face, every voice. One need only _remember hard enough_ to draw the shape back out. Grief is the needle. Love is the thread."'],
      ['A letter, unsent:', '"Holiness — my work is crude beside yours. You speak of _her_ as though she were already home. Let me see her. Let me see what perfect looks like." There is no reply.'],
    ];
    await s.narrate(notes[n]);
    if (n === 2 && ILSE_IN(s) && !s.flag('c7_note_her')) {
      s.setFlag('c7_note_her');
      await s.say('Ilse', '"Her." Who\'s "her"?');
      await s.think('Wren', 'A black-haired girl, washed up on the rocks, who didn\'t have a name. Who said: don\'t let him find me.');
      await s.say('Wren', '...I don\'t know.');
      await s.say('Ilse', 'You\'re lying. You always touch your ear when you lie.');
      await s.say('Wren', 'I don\'t _know_, Ilse. I\'m afraid of what I think.');
    }
  },

  async wheel(s, side) {
    const key = `c7_wheel_${side}`;
    if (s.flag(key)) return s.narrate('The sluice wheel is turned as far as it will go. Water roars somewhere behind the walls.');
    await s.narrate('A great iron sluice-wheel, crusted with rust. A plate reads: NAVE GATE — BOTH WHEELS TO RAISE.');
    if (!await s.confirm('Turn the wheel?')) return;
    s.setFlag(key);
    s.shake(0.2, 1.0);
    s.sfx('rumble');
    await s.narrate('It groans. It shrieks. It turns.');
    if (s.flag('c7_wheel_w') && s.flag('c7_wheel_e')) {
      s.setFlag('c7_gate_open');
      await s.wait(0.4);
      s.shake(0.35, 1.4);
      await s.narrate('Far off, in the Nave, iron grinds against stone — and the sluice gate rises.');
      if (ILSE_IN(s)) await s.say('Ilse', 'That\'s both. The gate north of the Nave should be open now.');
      s.objective('The Nave gate is open. Go north through the Nave.');
    } else {
      if (ILSE_IN(s)) await s.say('Ilse', 'One. The plate said both wheels. The other one must be across the Nave.');
      s.objective('Turn the second sluice wheel to raise the Nave gate.');
    }
  },

  async gateCheck(s) {
    if (s.flag('c7_gate_open')) return;
    await s.narrate('An iron sluice gate bars the way north. Two chains run from it into the walls — west and east.');
    if (ILSE_IN(s)) await s.say('Ilse', 'Sluice gates have wheels. Find the wheels.');
  },

  async secretWall(s) {
    if (s.flag('c7_secret_open')) return;
    await s.narrate('The masonry here is newer than the rest — and cracked straight through. Cold air breathes out of the seams.');
    if (!await s.confirm('Put your shoulder into it?')) return;
    s.setFlag('c7_secret_open');
    s.shake(0.25, 0.8);
    s.clearBlocker('c7_cracked_wall');
    await s.narrate('The wall gives way into a forgotten niche. Somebody hid something here, a long time ago.');
  },

  async chapel(s) {
    if (s.flag('c7_chapel_talk')) return;
    s.setFlag('c7_chapel_talk');
    s.spawn('ilse_s', 'ilse_ruin', 20, 8, 'down');
    s.place('player', 22, 8, 'left');
    s.music('sad');
    await s.narrate('A little chapel, above the waterline. Dry. Almost warm. The kind of place you only find when you have stopped looking.');
    await s.say('Ilse', 'We rest here. Five minutes. That\'s an order from your Mender.');
    await s.wait(0.8);
    await s.narrate('Ilse takes something from her coat pocket and turns it over and over in her fingers. A silver gull, missing the tip of one wing.');
    await s.say('Wren', 'That\'s Nana\'s brooch.');
    await s.say('Ilse', 'She pressed it into my hand at the dock. With the sky coming apart over us. I said, "Nana, get in the boat."');
    await s.say('Ilse', 'She said the Doyle children were still up the hill. And she went back for them.');
    await s.wait(1.4);
    await s.say('Ilse', 'The square went first. I watched it go.');
    await s.wait(1.0);
    await s.say('Wren', 'Ilse. I—');
    await s.say('Ilse', 'Don\'t.');
    await s.say('Ilse', 'If you say sorry, I\'ll have to decide what to do with it. And I am too tired to decide anything.');
    await s.wait(1.2);
    await s.say('Wren', '...Okay.');
    await s.say('Ilse', 'She always went back for people. Her whole life. Every sick neighbor, every stray. I thought that was what good people do. Go back. Never keep anything for yourself.');
    await s.say('Ilse', 'I\'ve been very good for a year, Wren. I\'ve been _so_ good.');
    await s.wait(1.0);
    await s.say('Ilse', 'Five minutes are up.');
    s.remove('ilse_s');
    s.music('cave');
    s.objective('Descend the stair below the chapel to find the source of the singing.');
    s.journal('Nana Brisa went back up the hill for the Doyle children. Ilse watched the square fall. She still has the gull brooch. She asked me not to say sorry, so I didn\'t. It\'s still there, in my mouth, like a stone.');
  },

  // =========================================================================
  // The Cistern of Bells
  // =========================================================================
  async cisternArrive(s) {
    if (s.flag('c7_cistern_seen')) return;
    s.setFlag('c7_cistern_seen');
    await s.pan(20, 8, 1.6);
    await s.narrate('A cistern the size of a cathedral, flooded to the ribs. Bells — dozens of them — lie half-drowned in the black water.');
    await s.say('Ilse', 'Listen.');
    await s.wait(1.0);
    await s.say('Wren', 'It\'s... a hymn. I know it. I _know_ it. It\'s the Dawnsong.');
    await s.say('Ilse', 'No. It\'s the Dawnsong backwards.');
    await s.follow(1.0);
    s.objective('Follow the singing to the Choir Loft at the north end of the cistern.');
  },

  async choirBoss(s) {
    if (s.flag('c7_choir_done')) return;
    s.stopMusic(1);
    s.spawn('precentor', 'c7_precentor', 20, 4, 'down');
    s.spawn('chor1', 'c7_drowned', 17, 5, 'down');
    s.spawn('chor2', 'c7_drowned', 23, 5, 'down');
    s.spawn('ilse_s', 'ilse_ruin', 21, 9, 'up');
    s.place('player', 19, 9, 'up');
    await s.pan(20, 5, 1.2);
    await s.narrate('Robed figures stand in a ring at the Choir Loft, waist-deep in nothing, mouths open on a single note. Water runs out of their sleeves. They have been singing for a year.');
    await s.say('Drowned Precentor', '...hold it... _hold_ it... the Hierophant said hold the note until noon...');
    await s.say('Wren', 'It\'s over. There isn\'t going to be a noon. The song didn\'t work.');
    s.face('precentor', 'player');
    await s.wait(0.8);
    await s.say('Drowned Precentor', 'The song _always_ works, child. You simply have not been singing long enough.');
    await s.say('Ilse', 'Wren. Behind it — the iron door. "APOTHECARIUM." That\'s the vault.');
    await s.say('Drowned Precentor', 'Choir. A new verse. _Together._');
    const r = await s.battle('c7_boss_choir', { bg: 'undercroft' });
    if (r !== 'win') return;
    s.setFlag('c7_choir_done');
    s.remove('chor1');
    s.remove('chor2');
    s.music('sad');
    await s.narrate('The note breaks. For the first time in a year, the cistern is silent — except for water, finding its level.');
    await s.say('Drowned Precentor', '...is it noon...? It has been so long... my throat...');
    await s.say('Ilse', 'You can stop now. Nobody needs you to hold it anymore.');
    await s.wait(0.8);
    await s.say('Drowned Precentor', '...thank you, Sister.');
    s.remove('precentor');
    s.flash('#a0c0ff', 0.6);
    await s.wait(0.6);
    s.clearBlocker('c7_vault_grate');
    await s.say('Wren', 'You called him "you." Not "it."');
    await s.say('Ilse', 'He was a patient. He just didn\'t have a bed.');
    s.remove('ilse_s');
    s.objective('Open the Apothecary Vault east of the Choir Loft.');
  },

  async vault(s) {
    if (s.flag('c7_sunsalt')) return;
    s.setFlag('c7_sunsalt');
    s.spawn('ilse_s', 'ilse_ruin', 32, 5, 'up');
    await s.narrate('Shelves. Crates. Racks of little stoppered phials, each one glowing like a coal kept under ash.');
    await s.give('c7_sunsalt');
    await s.say('Ilse', 'That\'s... that\'s enough for a year. For everyone. For _everyone_—');
    await s.narrate('Ilse laughs — once, sharp and bright, like something breaking — and then stops herself, as if she\'s been caught at something.');
    await s.say('Wren', 'You\'re allowed to laugh.');
    await s.say('Ilse', 'I know what I\'m allowed. Let\'s go. Pell has a week and we\'ve used two days of it.');
    s.remove('ilse_s');
    s.objective('Bring the sunsalt back to the Ember Ward.');
    s.journal('We found the vault. Enough sunsalt for a year. Ilse laughed. It was the best sound I\'ve heard since the world ended.');
  },

  // =========================================================================
  // Return, and the thaw
  // =========================================================================
  async returnWard(s) {
    if (!s.flag('c7_sunsalt') || s.flag('c7_returned')) return;
    s.setFlag('c7_returned');
    s.music('sad');
    s.spawn('ilse_s', 'ilse_ruin', 5, 5, 'up');
    s.place('player', 7, 6, 'left');
    await s.wait(0.4);
    await s.take('c7_sunsalt');
    s.sfx('heal');
    s.flash('#ffe0a0', 0.6);
    await s.narrate('One phial. Then another, for bed two, and bed thirty, and every bed after. The Ward smells of hot salt and morning.');
    await s.wait(1.0);
    await s.say('Pell', '...Ilse?');
    await s.say('Ilse', 'I\'m here. Don\'t sit up.');
    await s.say('Pell', 'Is that... is that _Wren_? Wren Halloway?');
    s.face('pell', 'player');
    await s.say('Wren', 'Hi, Pell.');
    await s.say('Pell', 'Are you still a Vanguard? Did you bring your sword?');
    await s.say('Wren', '...I brought it.');
    await s.say('Pell', 'Can I hold it?');
    await s.wait(1.0);
    await s.say('Wren', 'When you\'re better. Just the handle.');
    await s.say('Pell', 'Just the handle.', { speed: 0.6 });
    await s.wait(1.0);
    s.face('ilse_s', 'player');
    await s.narrate('For the first time since Wren walked into the Ward, Ilse looks at her.');
    await s.wait(1.4);
    await s.narrate('Then she looks away.');
    await s.fadeOut(1.6);
    s.remove('ilse_s');
    s.setFlag('c7_night');
    s.journal('Pell asked if he could hold my sword. Just the handle — like he did the day before the Kindling. Ilse looked at me. Just for a second.');
    await s.teleport('ruined_aurenne', 34, 17, 'right');
  },

  async thaw(s) {
    if (!s.flag('c7_night') || s.flag('c7_thaw')) return;
    s.setFlag('c7_thaw');
    s.music('afterlight');
    s.spawn('ilse_s', 'ilse_ruin', 36, 17, 'down');
    await s.wait(0.8);
    await s.narrate('Later. The Ward is sleeping — really sleeping, for the first time in months. Ilse sits on the steps with her coat around her knees.');
    await s.move('player', [[35, 17]], 1.4);
    s.face('player', 'right');
    await s.say('Wren', 'Can I sit?');
    await s.say('Ilse', 'It\'s a step. I don\'t own it.');
    await s.wait(1.0);
    await s.say('Ilse', 'Noll asked me what I wanted for my birthday. I\'m seventeen next month.');
    await s.say('Ilse', 'I didn\'t have an answer. I\'ve had a list for everything my whole life. What to pack. What to say. What Nana needed. What the patients need.');
    await s.say('Ilse', 'I don\'t have a list for me.');
    await s.wait(0.8);
    await s.say('Wren', 'Start one.');
    await s.say('Ilse', 'Don\'t.');
    await s.say('Wren', 'One thing. Something you want. Not something somebody needs.');
    await s.wait(2.0);
    await s.say('Ilse', '...I want to know if Bram is alive.');
    await s.wait(0.6);
    await s.say('Ilse', 'And Pip. And Sable.');
    await s.say('Ilse', 'There. That\'s a list. Happy?');
    await s.say('Wren', 'Fenna — the scrap-trader in Ash Square — says there\'s a sellsword up at Kiteholm. Big. Blond. Drinks like a drain. Terrible at cards.');
    await s.wait(0.8);
    await s.say('Ilse', '...That\'s either Bram, or a very specific disaster.');
    await s.say('Wren', 'And a boy with an eyepatch who runs a gang of orphans. Talks like a pirate.');
    await s.wait(0.8);
    await s.say('Ilse', '_Pip._');
    s.spawn('noll_s', 'noll', 36, 15, 'down');
    await s.move('noll_s', [[36, 16]], 2);
    await s.say('Noll', 'The Ward ran before you got here, Ward Mother. It can run for a week while you\'re gone.');
    s.face('ilse_s', 'up');
    await s.say('Ilse', 'That\'s not true.');
    await s.say('Noll', 'It\'s a kind lie. You taught me those.');
    await s.move('noll_s', [[36, 15]], 2);
    s.remove('noll_s');
    await s.wait(1.0);
    s.face('ilse_s', 'left');
    await s.say('Ilse', 'I\'m not forgiving you, Wren.');
    await s.say('Wren', 'I know.');
    await s.say('Ilse', 'And I\'m not going to Kiteholm for you.');
    await s.say('Wren', 'I know.');
    await s.wait(1.2);
    await s.say('Ilse', '...I\'m going because I want to.');
    await s.wait(0.8);
    await s.say('Ilse', 'Write that down somewhere. It might not happen again.');
    s.remove('ilse_s');
    s.setFlag('c7_night', false);
    s.objective('When you are ready, ask Fenna the scrap-trader in Ash Square for passage to Kiteholm.');
    s.journal('Ilse said she wants something. For herself. She wants to find Bram and Pip — and she said it was because she wants to, not because anybody needs her to. I wrote it down, like she said.');
  },

  // =========================================================================
  // Departure (end of chapter)
  // =========================================================================
  async fenna(s) {
    if (s.flag('c7_thaw')) {
      await s.say('Fenna', 'Kiteholm, is it? My glider-barge goes up on the next ember-wind. You\'ll hate it. Everyone hates it. Then they never leave.');
      if (!await s.confirm('Leave for Kiteholm now? (You can return to Aurenne later by the world map.)', 'Let\'s go', 'Not yet')) {
        return s.say('Fenna', 'Wind\'ll keep. Wind always keeps.');
      }
      return CH7.departure(s);
    }
    if (s.flag('c7_met_ilse')) {
      return s.say('Fenna', ['Fenna Gale, scrap-and-sundry, out of Kiteholm. I haul sunsalt down when there\'s sunsalt, and bad news up when there isn\'t.', 'Kiteholm? Shanty town on a wind-shard, held together with kite-string and spite. There\'s a boy up there with one eye runs twenty orphans like a pirate fleet.', 'And a big blond sellsword guards the Scrap Baron. Drinks like a drain. Loses at cards to children. Cries, sometimes, at the coat rack.']);
    }
    return s.say('Fenna', 'Scrap-trader. Sunsalt when I\'ve got it. Today I haven\'t.');
  },

  async departure(s) {
    if (s.flag('c7_done')) return;
    s.setFlag('c7_done');
    await s.say('Ilse', 'Noll has a list. Sorrel has a list. Pell has the handle of your sword on a promise.');
    await s.say('Wren', 'And you?');
    await s.say('Ilse', 'I have a list too. It has three names on it.');
    await s.fadeOut(1.5);
    s.journal('We left Aurenne on Fenna\'s glider-barge, riding the ember-wind up toward Kiteholm. Ilse watched the Ward until it was too small to see.');
    await s.chapter(8, 'Children of the Wreck');
    s.objective('Explore Kiteholm and look for Pip and Bram.');
    await s.teleport('kiteholm', 4, 20, 'right');
  },

  // =========================================================================
  // Side quests
  // =========================================================================

  // ---- Captain Buttons (Bette's doll)
  async bette(s) {
    if (s.flag('c7_doll_done')) return s.say('Bette', ['Captain Buttons says thank you. He says it with his button face.', 'He\'s been on a big adventure. He won\'t tell me about it. He\'s very brave.']);
    if (s.has('c7_doll')) {
      s.setFlag('c7_doll_done');
      await s.take('c7_doll');
      await s.say('Bette', 'CAPTAIN BUTTONS!');
      await s.say('Bette', 'Where was he? Was he scared? Did he cry?');
      await s.say('Wren', 'He was in the garden, keeping some old soldiers company. He didn\'t cry once.');
      await s.say('Bette', 'He\'s very brave. He gets it from me.');
      await s.say('Bette\'s Mother', 'Here — it\'s not much. My husband wore it. He\'d want it to keep somebody alive.');
      await s.give('regen_bangle');
      s.quest('c7_q_doll', null, null, 'done');
      return;
    }
    return s.say('Bette', ['Captain Buttons is lost.', 'He has two buttons for eyes but one fell off so he can only see half the way home.']);
  },

  // ---- The Blind Archivist (Old Aurel)
  async aurel(s) {
    if (s.flag('c7_aurel_done')) return s.say('Old Aurel', ['Come back and read to me again sometime. Not the hymnal. Anything with a happy ending. I\'ve earned one.']);
    if (!s.flag('c7_q_rounds')) return s.say('Old Aurel', 'Forty years I kept the Choir\'s archive. Now I keep bed eleven. A smaller collection.');
    s.setFlag('c7_aurel_done');
    await s.say('Old Aurel', 'A reader! Under the pillow — the hymnal. Page with the ribbon. My favorite. Humor an old man.');
    await s.narrate(['_"Of the Seven Lanterns, and the Song that Wakes the Sun."_', '_"Seven voices raise the dawn. Should seven voices sing it backward, all at once, the day shall be held — as a breath is held — and never let go."_', '_"This the Choir forbids, for a breath held forever is not a breath. It is a drowning."_']);
    await s.wait(0.8);
    await s.say('Old Aurel', 'Lovely, isn\'t it? I read it to the Hierophant once, when he was a boy. He cried. I thought it was the poetry.');
    await s.wait(0.8);
    await s.think('Wren', 'A breath held forever is a drowning. He knew. He read it as a boy and he knew.');
    if (ILSE_IN(s)) await s.say('Ilse', '_(quietly)_ Wren. Breathe.');
    await s.say('Old Aurel', 'Take this, reader. An archivist\'s workbook. Knowledge is for spending.');
    await s.give('crest_tome');
    s.quest('c7_q_aurel', null, null, 'done');
    s.journal('Old Aurel had me read the forbidden verse: a breath held forever is a drowning. He read it to Cassian when Cassian was a boy.');
  },

  // ---- Flowers for the Fallen (Hollis the gardener) — also holds Captain Buttons
  async hollis(s) {
    if (s.has('c7_letters') && !s.flag('c7_letter_hollis')) {
      s.setFlag('c7_letter_hollis');
      await s.say('Hollis', 'Post? For me? Nobody\'s written me in— oh. Oh, it\'s from _me_.');
      await s.say('Hollis', 'I used to post myself reminders at the Cathedral. "Prune the south roses before the frost." Dated the day before.');
      await s.wait(0.8);
      await s.say('Hollis', '...Well. Consider me reminded.');
      return;
    }
    if (!s.flag('c7_hollis_met')) {
      s.setFlag('c7_hollis_met');
      await s.say('Hollis', 'Mind the graves, miss. They\'re new. Everything here is new except me.');
      await s.say('Hollis', 'I was the Cathedral\'s gardener. Forty years of roses. Now there\'s nothing to grow but names.');
      await s.say('Hollis', 'If I had seeds — anything that\'ll take in ash — I\'d give them flowers. The Choir kept dawnmoss for their medicines. Down below, I\'d wager. Where nobody goes.');
      s.quest('c7_q_seeds', 'Flowers for the Fallen', 'Hollis the gardener wants seeds that will grow in ash. The Choir kept dawnmoss below the city.');
    }
    if (s.flag('c7_q_rounds') && !s.flag('c7_doll_done') && !s.has('c7_doll') && !s.flag('c7_doll_found')) {
      s.setFlag('c7_doll_found');
      await s.say('Wren', 'You haven\'t seen a rag doll, have you? Button eyes? One button?');
      await s.say('Hollis', 'Him? I found him on Corporal Dray\'s grave. Thought he was an offering. Been keeping him out of the ash.');
      await s.say('Hollis', 'He\'s been good company. Doesn\'t talk back.');
      await s.give('c7_doll');
      return;
    }
    if (s.has('c7_seeds')) {
      s.setFlag('c7_seeds_done');
      await s.take('c7_seeds');
      await s.say('Hollis', 'Dawnmoss! Oh, you clever thing. It grows in anything — ash, rubble, sorrow. It\'s practically a weed. The best things are.');
      await s.fadeOut(0.8);
      await s.wait(0.6);
      await s.fadeIn(0.8);
      await s.say('Hollis', 'There. They\'ll be up in a week. Gold, like a little dawn on every grave.');
      await s.say('Hollis', 'Take these. I won\'t be needing them; I\'ve got all the seed I want now.');
      await s.give('vigor_seed', 2);
      s.quest('c7_q_seeds', null, null, 'done');
      return;
    }
    if (s.flag('c7_seeds_done')) return s.say('Hollis', 'Little green shoots already. Don\'t tell anyone. They\'ll want to name them after the Hierophant, and I won\'t have it.');
    return s.say('Hollis', 'Dawnmoss, from below. If you\'re ever down there and the singing doesn\'t get you.');
  },

  // ---- The Last Bell (Osric the bellringer)
  async osric(s) {
    if (s.flag('c7_bell_rung')) return s.say('Osric', ['Did you see them? Every face in the city, turned up.', 'Ring it again tomorrow, I think. And the day after. A city needs to know what time it is, even if the answer is always "dusk".']);
    if (s.has('c7_bell_clapper')) return CH7.ringBell(s);
    if (!s.flag('c7_q_bell')) {
      s.setFlag('c7_q_bell');
      await s.say('Osric', 'Four hundred bells. I rang the Bellwrights\' Tenor for thirty-one years. Hear that tower? Still standing. One bell left in it.');
      await s.say('Osric', 'Its clapper came loose in the Sundering. Fell clean through the floor of the Quarter, down into the Undercroft. I heard it go — _BONG, bong, bong_ — all the way down.');
      await s.say('Osric', 'If anyone ever goes down there and comes back up, bring me my clapper. I\'d like this city to hear a bell before I die.');
      s.quest('c7_q_bell', 'The Last Bell', 'Osric the bellringer\'s clapper fell into the depths of the Undercroft. Find it.');
      return;
    }
    return s.say('Osric', 'The clapper fell all the way down. Past the old halls, past the Nave. Somewhere the water\'s deepest.');
  },

  async ringBell(s) {
    s.setFlag('c7_bell_rung');
    await s.take('c7_bell_clapper');
    await s.say('Osric', 'That\'s it. That\'s _her_. Bruised, but she\'s whole.');
    await s.say('Osric', 'Stand back, girl. Ears covered. I\'ve waited a year for this.');
    await s.fadeOut(0.6);
    await s.wait(0.8);
    await s.fadeIn(0.6);
    await s.pan(5, 10, 1.0);
    s.shake(0.12, 2.5);
    s.sfx('holy');
    s.flash('#fff0c0', 0.4);
    await s.narrate('_BONG._');
    s.sfx('holy');
    await s.narrate('The note rolls out over the ash and the broken towers and the cracked Lantern, and keeps going, out past the edge of the shard, into the abyss.');
    s.music('aurenne');
    await s.narrate('All over the ruins, people stop. A woman at the well. Sorrel at the gate. A child at the soup pot. Every face in Aurenne turns up toward the sound.');
    await s.follow(1.0);
    await s.say('Osric', '...There. Now the city knows what time it is.');
    await s.say('Wren', 'What time is it?');
    await s.say('Osric', 'Time to get on with it.');
    await s.give('ember_heart');
    s.quest('c7_q_bell', null, null, 'done');
    s.journal('Osric rang the last bell in Aurenne. Everybody looked up. I think some of them had forgotten they could.');
  },

  // ---- Dead Letters (Petra the postwoman)
  async petra(s) {
    if (s.flag('c7_letters_done')) return s.say('Petra', ['Mail\'s light today. Mail\'s light every day. But I walk the route.', 'Somebody has to believe there\'s a tomorrow to deliver to.']);
    if (s.flag('c7_letters_given')) {
      const done = ['c7_letter_sorrel', 'c7_letter_hollis', 'c7_letter_lantern'].filter((f) => s.flag(f)).length;
      if (done < 3) return s.say('Petra', `${3 - done} still to go. Sorrel at the gate, Hollis in the garden, and the one for the Cathedral — leave it at the Lantern. Somebody up there used to answer.`);
      s.setFlag('c7_letters_done');
      await s.take('c7_letters');
      await s.say('Petra', 'All delivered? Then my route\'s done for the first time in a year. You\'ve no idea how that feels.');
      await s.say('Petra', 'There\'s one more. It\'s been in my bag since the day before. I couldn\'t deliver it. Wrong place, you see. Lanternfall.');
      await s.say('Petra', 'It\'s addressed to a "Wren Halloway". Choir seal. Never opened.');
      await s.wait(1.0);
      await s.say('Wren', '...That\'s me.');
      await s.say('Petra', 'I thought it might be. You read like a Halloway. Sorry. It\'s a postwoman\'s instinct.');
      await s.give('c7_cassian_letter');
      await s.narrate(['_My dear restless heart —_', '_If this reaches you, the song is sung, and you are reading by a light that never moves. I hope it is a good light. I hope your father is beside you, and that he has not aged a day._', '_You will understand, now, why I could not let the good days end. One day you will thank me. Until then — I have kept a place for you._', '_— C._']);
      await s.wait(1.2);
      if (ILSE_IN(s)) {
        await s.say('Ilse', '...Burn it.');
        await s.say('Wren', 'No. I\'m keeping it.');
        await s.say('Ilse', 'Why?');
        await s.say('Wren', 'So I remember what it sounds like when he\'s being kind.');
      } else {
        await s.think('Wren', 'I\'m keeping it. So I remember what it sounds like when he\'s being kind.');
      }
      await s.say('Petra', 'And this is for your trouble. A postwoman\'s good-luck coin. It never brought me any, but it might be shy.');
      await s.give('lucky_coin');
      s.quest('c7_q_letters', null, null, 'done');
      s.journal('Petra had a letter for me — from Cassian, written the day before the Last Sunset. "I have kept a place for you." I\'m keeping it. I need to remember.');
      return;
    }
    s.setFlag('c7_letters_given');
    await s.say('Petra', 'Post! Royal Aurenne Post, est. four hundred years ago, disestablished one year ago, still delivering.');
    await s.say('Petra', 'I\'ve three letters I can\'t walk to — my knees and the rubble aren\'t on speaking terms. One for Sorrel at the gate. One for old Hollis in the garden. And one for "the Cathedral of Dawn."');
    await s.say('Petra', 'The Cathedral\'s a hole now, but leave it at the foot of the Lantern. Somebody up there used to answer.');
    await s.give('c7_letters');
    s.quest('c7_q_letters', 'Dead Letters', 'Deliver Petra\'s letters: Sorrel at the gate, Hollis in the garden, and the Cathedral (the foot of the Grand Lantern).');
  },

  async lanternBase(s) {
    if (s.has('c7_letters') && !s.flag('c7_letter_lantern')) {
      s.setFlag('c7_letter_lantern');
      await s.narrate(['You leave Petra\'s letter at the foot of the Grand Lantern, weighted with a stone.', 'It is addressed: "To Whoever Is Still Listening."']);
      return;
    }
    await s.narrate(['The Grand Lantern of Aurenne. A crack runs from the lamp-room to the foundation, wide enough to put your arm in.', 'The glass up top is dark. Not dim. _Dark_ — like an eye that has seen something it cannot stop seeing.']);
    if (ILSE_IN(s) && !s.flag('c7_lantern_ilse')) {
      s.setFlag('c7_lantern_ilse');
      await s.say('Ilse', 'People come up here to spit on it. Sorrel stopped them at first. Then she stopped stopping them.');
      await s.say('Wren', 'Do you?');
      await s.say('Ilse', 'I don\'t have time to hate a building, Wren.');
    }
    return null;
  },

  // ---- Sorrel: gate warden, tags, bounty
  async sorrel(s) {
    if (s.has('c7_letters') && !s.flag('c7_letter_sorrel')) {
      s.setFlag('c7_letter_sorrel');
      await s.say('Sorrel', 'A letter? For me? ...It\'s from my sister. Posted the day before.');
      await s.wait(1.0);
      await s.say('Sorrel', 'She says the plums are early this year.');
      await s.say('Sorrel', '...Go on. I\'m on duty.');
      return;
    }
    if (s.has('c7_tags')) {
      s.setFlag('c7_tags_returned');
      await s.take('c7_tags');
      await s.say('Sorrel', 'Doran. Mags. Little Cobb.');
      await s.wait(1.0);
      await s.say('Sorrel', 'I bricked up that gate so nobody else would go. And now I\'ve got their tags in my hand, and it doesn\'t feel like I did anything right.');
      if (ILSE_IN(s)) await s.say('Ilse', 'You did. You kept forty people from following them. That\'s the job, Sorrel. It never feels like anything.');
      await s.say('Sorrel', 'I\'ll hang them on the Ward wall. Under their names. Here — Mags would\'ve wanted somebody strong to have this.');
      await s.give('guard_fruit', 2);
      s.quest('c7_q_tags', null, null, 'done');
      return;
    }
    if (s.flag('c7_clapper_dead') && !s.flag('c7_bounty_paid')) {
      s.setFlag('c7_bounty_paid');
      await s.say('Sorrel', 'The thing in the Reliquary? _Dead?_ The thing that ate the second team\'s mule?');
      await s.say('Sorrel', 'Bounty\'s yours. Every coin of it. The whole city chipped in, and believe me, nobody had coins to chip.');
      await s.gold(2500);
      await s.give('hunters_eye');
      s.quest('c7_q_bounty', null, null, 'done');
      return;
    }
    if (s.flag('c7_ilse_joined') && !s.flag('c7_q_bounty_on')) {
      s.setFlag('c7_q_bounty_on');
      await s.say('Sorrel', 'If you two are really going down... the board\'s got one bounty on it. Something nests in the old Reliquary, north-east of the Nave. Tolls like a bell when it breathes.');
      await s.say('Sorrel', 'The second team called it _Old Clapper_. Right before it ate their mule. Kill it and the city pays.');
      s.quest('c7_q_bounty', 'Old Clapper', 'Something that tolls like a bell nests in the Undercroft\'s north-east Reliquary. Slay it for the city\'s bounty.');
      return;
    }
    if (s.flag('c7_returned')) return s.say('Sorrel', ['The Ward Mother came back. Came back _with_ something, for once.', 'You go first, she patches. Hm. Maybe you\'re not so "just" after all, Just Wren.']);
    return s.say('Sorrel', ['Hands clean, mouths shut, eyes open. That\'s Aurenne now.', 'And nobody goes in the Undercroft.']);
  },

  async oldClapper(s) {
    if (!s.flag('c7_q_bounty_on') || s.flag('c7_clapper_dead')) return;
    await s.pan(39, 6, 0.8);
    await s.narrate('Something uncoils in the shallows of the Reliquary — scaled, rust-red, its belly swollen around a shape that is unmistakably a bell.');
    await s.narrate('It breathes in. Deep inside it, something tolls.');
    await s.follow(0.5);
    if (ILSE_IN(s)) await s.say('Ilse', 'It swallowed a bell. It _swallowed a bell_. How is it alive?');
    await s.say('Wren', 'Spite, mostly. I can relate.');
    const r = await s.battle('c7_boss_clapper', { bg: 'undercroft' });
    if (r !== 'win') return;
    s.setFlag('c7_clapper_dead');
    s.quest('c7_q_bounty', 'Old Clapper', 'Old Clapper is slain. Tell Sorrel at the gate.'); // a side quest: leave the main objective alone
    await s.narrate('Old Clapper rolls over in the water with one last, muffled _bong_.');
  },
};
