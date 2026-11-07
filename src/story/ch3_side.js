// CHAPTER 3 — side quests and character moments in Aurenne.
//   The Bell-Ringer's Hammer (Tolliver) · The Chronicle of the Long Night (Quill)
//   Sir Pounce (Dame Orsolya Venn, Bram) · The Baker's Husband (Hettie & Rowan)
//   The Infirmary (Master Ambrose, Ilse) · Pip's Debt (Posy) · Old Squires (Hollis, Bram)
//   The Bell Vault (Dawn Peal puzzle in the ossuary)

import { ringBells } from './ch3_fx.js';

const inParty = (s, id) => s.state.party.includes(id);

export const SIDE = {
  // ================================================================ THE BELL-RINGER'S HAMMER
  async tolliver(s) {
    if (s.flag('c3_hammer_done')) {
      return s.say('Tolliver', ['Hear that? No, you don\'t. Nobody does. That\'s the sound of a bell that\'s ringing _true._', 'Low, high, middle, high. Mind the Dawn Peal, Page. It\'ll get you through doors.']);
    }
    if (s.has('c3_bell_hammer')) return SIDE.tolliverReturn(s);
    if (s.flag('c3_hammer_quest')) {
      return s.say('Tolliver', ['The noon bell\'s still ringing flat. I can hear it. Even _I_ can hear it.', 'Low, high, middle, high. That\'s the Dawn Peal. Never know when you\'ll need it.']);
    }
    s.setFlag('c3_hammer_quest');
    s.setFlag('c3_peal_known');
    await s.say('Tolliver', 'Eh? Speak up. Forty years in a bell tower, I hear one word in three, and I don\'t care for two of them.');
    await s.say('Tolliver', 'You want to know why the noon bell\'s been ringing flat all week? I\'ll tell you why. Gloria\'s gone.');
    await s.say('Wren', 'Gloria?');
    await s.say('Tolliver', 'My _hammer!_ Bronze, cast in the old foundry under the city. Forty years we\'ve rung the noon together, her and me.');
    await s.say('Tolliver', 'Last week, middle of the night, the lights went funny. Purple. And something came up the old bell-pit and took her right off her hook. Down into the dark.');
    await s.say('Bram', 'Something came up a pit. And stole a hammer.');
    await s.say('Tolliver', 'Took her! I know what I saw. A hand made of— well. You\'d not believe me. Nobody does.');
    await s.say('Tolliver', 'The pit runs all the way down to the old foundry, under the Undercroft. If you\'re ever down that way — and you won\'t be, you\'ve got sense — bring her home.');
    await s.say('Tolliver', 'And if you meet a bell that wants ringing properly, you give it the Dawn Peal: _low, high, middle, high._ Wakes low, climbs high, rests between, rises. Every bell in Aurenne knows it.');
    s.quest('c3_gloria', 'The Bell-Ringer\'s Hammer', 'Old Tolliver\'s bronze bell-hammer, Gloria, was dragged down the bell-pit to the old foundry beneath the Undercroft.');
  },

  /** Called when the Wight drops the hammer. */
  hammerFound(s) {
    if (s.flag('c3_hammer_quest')) return;
    s.setFlag('c3_hammer_quest');
    s.quest('c3_gloria', 'The Bell-Ringer\'s Hammer', 'A bronze bell-hammer named GLORIA, found in the old foundry. Pip says it belongs to Old Tolliver, the bell-ringer in the Bell Market.');
  },

  async tolliverReturn(s) {
    s.setFlag('c3_hammer_done');
    await s.take('c3_bell_hammer');
    await s.say('Tolliver', '...Gloria?');
    await s.say('Tolliver', 'GLORIA! Where did you— no. Don\'t tell me. I can smell the foundry on her.');
    await s.say('Tolliver', 'Up the tower with me. Come on, come on — it\'s near enough noon, and the city won\'t mind.');
    await s.fadeOut(0.8);
    ringBells(s, 8, 196, 0.75);
    await s.narrate([
      'Tolliver rings the noon with Gloria.',
      'The great bell sings out over the City of Bells, round and true. Down in the market, people stop and look up, and some of them smile without knowing why.',
    ]);
    if (inParty(s, 'pip')) await s.say('Pip', '...Huh. I always thought the bells were just noise.');
    await s.fadeIn(0.8);
    await s.say('Tolliver', 'Here. Earplugs. Beeswax — made \'em myself. Had a spare pair for forty years. Never once needed the first.');
    await s.give('c3_earplugs');
    s.quest('c3_gloria', null, null, 'done');
    s.journal('We brought Gloria the hammer home, and Old Tolliver rang the noon so true that the whole market looked up.');
  },

  // ================================================================ THE BELL VAULT (ossuary)
  async vaultDoor(s) {
    await s.narrate('A bronze door, green with age, is set into the wall. Carved above it: *THE DAWN WAKES LOW, CLIMBS HIGH, RESTS BETWEEN, AND RISES.*');
    if (s.flag('c3_peal_known')) await s.say('Wren', 'That\'s Tolliver\'s Dawn Peal! Low, high, middle, high.');
    else await s.say('Ilse', 'Three bells over there. Low, middle, high, by the sound of them. It\'s an order.');
  },

  async ringVaultBell(s, note) {
    if (s.flag('c3_vault_open')) return s.narrate('The bell hums faintly, still remembering the peal.');
    const pitch = { low: 131, mid: 196, high: 262 }[note];
    ringBells(s, 1, pitch);
    const seq = (s.vars.c3_peal || []).concat(note).slice(-4);
    s.vars.c3_peal = seq;
    await s.narrate(`The ${note === 'mid' ? 'middle' : note} bell rings out${seq.length > 1 ? ', and the others answer faintly' : ''}.`);
    if (seq.join() !== 'low,high,mid,high') return;
    s.setFlag('c3_vault_open');
    await s.wait(0.6);
    s.clearBlocker('c3_vault_door');
    await s.narrate('Deep in the wall, something answers the peal. The bronze door grinds open.');
    await s.say('Bram', 'A secret door that opens with music. This is the best sewer I have ever been in.');
  },

  // ================================================================ THE CHRONICLE OF THE LONG NIGHT
  async quill(s) {
    if (!s.flag('c3_met')) {
      return s.say('Quill', ['The archives are closed to visitors without the Hierophant\'s leave.', 'No, I cannot be bribed. I have been offered. It was a very good pie, and I still said no.']);
    }
    if (s.flag('c3_pages_done')) {
      return s.say('Quill', ['Whole again. Forty years, and whole again. Mostly.', 'I keep reading the black parts. As if I could read through ink if I only wanted to badly enough.']);
    }
    if (!s.flag('c3_pages_quest')) return SIDE.quillStart(s);
    const n = s.state.inventory.count('c3_chronicle_page');
    if (n >= 4) return SIDE.chronicle(s);
    return s.say('Quill', [`${n} of four. My heart is old, Page, but it is patient.`, 'One misfiled on these shelves, one in the alcove, and two that went down below the city with the careless and the dead.']);
  },

  async quillStart(s) {
    s.setFlag('c3_pages_quest');
    await s.say('Quill', 'The Hierophant\'s guests. He said _all_ of the archives. All. He was quite specific, which he never is.');
    await s.say('Quill', 'You\'re looking for something about the young lady? The one with the... remarkable face?');
    await s.say('Sable', 'I don\'t know what I\'m looking for.');
    await s.say('Quill', 'Then you\'ll fit right in. Nobody here does.');
    await s.say('Quill', 'Here is a puzzle for you, then. The _Chronicle of the Long Night_ — the account of the night the Grand Lantern went dark, forty years ago this autumn.');
    await s.say('Quill', 'It is the one book in this archive I have never seen whole. Four pages missing. Borrowed, torn, lost — one went down into the Undercroft with a careless deacon, they say.');
    await s.say('Quill', 'One\'s misfiled on these very shelves, I\'d wager my spectacles. One\'s in the restricted alcove. I\'ll lift the rope for you. His Holiness said _all._');
    s.sfx('door');
    s.clearBlocker('c3_rope');
    await s.say('Quill', 'Find me all four and I\'ll bind it whole again. I would very much like to read it before I die. I\'m told that\'s soon. I\'ve been told so for twenty years.');
    s.quest('c3_chronicle', 'The Chronicle of the Long Night', 'Brother Quill needs four missing pages: one misfiled in the archives, one in the restricted alcove, and two lost somewhere beneath the city.');
  },

  /** A loose page. */
  async page(s, flag, lines) {
    if (s.flag(flag)) return;
    s.setFlag(flag);
    await s.give('c3_chronicle_page');
    await s.narrate(lines);
    if (!s.flag('c3_pages_quest')) await s.say('Ilse', 'A page from some chronicle. Someone in the Cathedral archives would want this back.');
  },

  async chronicle(s) {
    s.setFlag('c3_pages_done');
    await s.take('c3_chronicle_page', 4);
    await s.say('Quill', 'Four. _Four!_ Give them here, give them— careful— oh, the foxing. Oh, the poor things.');
    await s.fadeOut(0.6);
    await s.narrate('Brother Quill works through the afternoon with paste, thread and a very small knife. Then he reads the Chronicle aloud.');
    await s.fadeIn(0.6);
    await s.say('Quill', '"On the last night of the summer festival, in the four hundredth year of the Choir, the Grand Lantern of Aurenne failed."');
    await s.say('Quill', '"The Gloam came into the city through the dark, as water fills a footprint. Three hundred and twelve souls were taken before dawn."');
    await s.say('Quill', '"The Keeper, Aldric Lorne, was in the lamp-room when the light failed. He might have gone down to the square, where his daughter, {dim|████ █████}, was waiting for him."');
    await s.say('Quill', '"He held the Lantern\'s heart in his own hands until the light caught again. The city lived."');
    await s.say('Quill', '"His son, {dim|███████}, aged twelve, was found at dawn upon the gallery stair, holding nothing. He did not speak for a year."');
    await s.wait(0.8);
    await s.say('Quill', '...Someone has inked out the names. Carefully. Every one.');
    await s.say('Quill', 'Who would do that to a forty-year-old book? The names are the only part of a chronicle that is _true._ Everything else is somebody\'s opinion.');
    await s.say('Sable', 'The girl\'s name was Lysa. It is on a wall, under the city. There was a candle.');
    await s.wait(1.4);
    await s.say('Quill', '...Then someone has been very careful for a very long time.');
    await s.say('Quill', 'Here. For your trouble — and for your eyes, which are better than mine. A scholar\'s monocle; it makes the world give up its lessons a little faster. And a Crest Tome I have been saving for someone who deserved it.');
    await s.give('scholars_monocle');
    await s.give('crest_tome');
    s.quest('c3_chronicle', null, null, 'done');
    s.journal('Brother Quill rebuilt the Chronicle of the Long Night. Forty years ago the Keeper of Aurenne chose his Lantern over his daughter. Someone inked out her name. Her name was Lysa.');
  },

  // ================================================================ SIR POUNCE
  async orsolya(s) {
    if (s.flag('c3_cat_done')) {
      return s.say('Orsolya', ['Sir Pounce sends his regards. He\'s asleep on Aldous\'s good chair. He always did that. Aldous let him.', 'Look after that boy for me.']);
    }
    if (s.has('c3_sir_pounce')) return SIDE.catReturn(s);
    if (s.flag('c3_cat_quest')) return s.say('Orsolya', ['Up on the roofs above the Bell Market, the last time anyone saw him. Very orange. Very large. Very rude.']);
    s.setFlag('c3_cat_quest');
    await s.say('Orsolya', 'Oh — visitors. Forgive me, I\'m not myself today. Sir Pounce has gone up on the rooftops again, and he will not come down.');
    await s.say('Orsolya', 'He\'s very large and very orange. You can\'t miss him, though people do try.');
    if (inParty(s, 'bram')) {
      await s.narrate('Bram has gone still. He is looking at the old armor on its stand by the wall — and the sunburst on the breastplate, notched by some long-ago blade.');
      await s.say('Bram', '...That\'s Sir Aldous\'s armor.');
      await s.say('Orsolya', 'You knew my husband?');
      await s.wait(0.8);
      await s.say('Bram', 'I\'m Bram Kestrel, my lady.');
      await s.wait(1.4);
      await s.say('Orsolya', 'Oh. Oh, my dear boy.');
      await s.say('Bram', 'I should go. I\'m sorry. I\'m— I should go.');
      await s.say('Orsolya', 'Bram. Find my cat. And then come back and drink a cup of tea with an old woman. That\'s all I\'ll ask of you.');
    }
    s.quest('c3_pounce', 'Sir Pounce', 'Dame Orsolya Venn\'s enormous orange cat is somewhere on the rooftops above the Bell Market (climb the crates by the brick warehouse).');
  },

  /** On the rooftops: Sable picks up the cat. */
  async findCat(s) {
    if (s.flag('c3_cat_found')) return;
    s.setFlag('c3_cat_found');
    await s.narrate('An enormous orange cat regards you from the ridge of the thatch with an expression of total contempt.');
    await s.say('Sable', 'Cat.');
    await s.say('Wren', 'Sable, careful, he might—');
    await s.narrate('Sable picks him up. He goes entirely limp and begins to rumble like a distant cart.');
    await s.say('Sable', 'He is very warm. He vibrates.');
    await s.say('Pip', 'That\'s a purr. Have you never— no. You haven\'t, have you.');
    await s.say('Sable', '_Purr._ I will remember that word.');
    s.remove('pounce');
    await s.give('c3_sir_pounce');
    if (!s.flag('c3_cat_quest')) await s.say('Ilse', 'He has a collar. "SIR POUNCE · VENN HOUSE · LANTERN QUARTER." Someone\'s missing him.');
  },

  async catReturn(s) {
    s.setFlag('c3_cat_done');
    await s.take('c3_sir_pounce');
    await s.say('Orsolya', 'Sir Pounce! You ridiculous, ungrateful animal. Come here.');
    await s.say('Sable', 'He was on the long thatch roof. He let me carry him. I learned the word "purr."');
    await s.say('Orsolya', 'Then he\'s taught you more than he\'s ever taught me.');
    if (inParty(s, 'bram')) {
      await s.fadeOut(0.6);
      await s.narrate('There is tea. There are small hard biscuits. There is a long silence that no one hurries.');
      await s.fadeIn(0.6);
      await s.say('Orsolya', 'Aldous wrote to me about you. Every week, the year you trained under him.');
      await s.say('Bram', 'My lady. The trial. He died because I—');
      await s.say('Orsolya', 'He died because he chose to stand where you were standing. That was _his_ choice, Bram Kestrel. Don\'t you dare take it away from him.');
      await s.wait(1.0);
      await s.say('Orsolya', 'He said you were braver than you knew. He was a terrible judge of horses and an excellent one of people.');
      await s.say('Bram', '...He was wrong about me.');
      await s.say('Orsolya', 'Then prove him wrong. Or don\'t. But you\'ll have to live long enough to find out which.');
      await s.say('Orsolya', 'Here. His signet. It\'s no use to anyone in a drawer, and he never meant it for a drawer.');
      await s.give('c3_venn_signet');
      await s.say('Bram', '...It\'s too big for me. I\'ll wear it on a cord.');
      await s.say('Orsolya', 'For now.');
      s.journal('Dame Orsolya Venn — Sir Aldous\'s widow — gave Bram her husband\'s signet. Bram wears it on a cord around his neck and keeps touching it when he thinks nobody\'s looking.');
    } else {
      await s.say('Orsolya', 'Take this, dear. It was my husband\'s. He\'d have liked you — he liked anyone kind to cats.');
      await s.give('c3_venn_signet');
    }
    s.quest('c3_pounce', null, null, 'done');
  },

  // ================================================================ THE BAKER'S HUSBAND
  async hettie(s) {
    if (s.flag('c3_rowan_done')) {
      return s.say('Hettie', ['Honey-bread, fresh! First loaf\'s free for the Page and her friends. Second\'s also free. Third, we\'ll talk.']);
    }
    if (s.flag('c3_mercy_down')) return SIDE.rowanHome(s);
    if (!s.flag('c3_rowan_quest')) {
      s.setFlag('c3_rowan_quest');
      await s.say('Hettie', 'Honey-bread! Seed-loaves! Bell-buns, three a copper— oh. Sorry, loves. I don\'t have the voice for it today.');
      await s.say('Hettie', 'My Rowan used to do the shouting. He went to the almshouse nine days ago — for a bowl of soup and a word with the Sisters. He\'d been low since the oven fire. Couldn\'t lift himself out of it.');
      await s.say('Hettie', 'He never came home. The Sisters say he left the same night. The Watch says men leave their wives every day of the week.');
      await s.say('Hettie', 'Not Rowan. He wouldn\'t even leave a _loaf_ half-eaten.');
      await s.say('Hettie', 'He wears a red scarf. I knitted it. It\'s terrible — dropped stitches all down one side. He wears it every day anyway.');
      s.quest('c3_rowan', 'The Baker\'s Husband', 'Hettie\'s husband Rowan went to the Low Town almshouse nine days ago and never came home. He wears a badly-knitted red scarf.');
      return;
    }
    return s.say('Hettie', ['Red scarf. Dropped stitches down one side. If you see him, tell him the oven\'s fixed. Tell him I\'m not angry. Tell him I\'m a bit angry.']);
  },

  async rowanHome(s) {
    s.setFlag('c3_rowan_done');
    await s.say('Hettie', 'You brought him up out of the dark.');
    await s.say('Rowan', 'I came home with my scarf on backwards and asked for honey-bread like nothing happened.');
    await s.say('Hettie', '...Something happened.');
    await s.say('Rowan', 'Something happened. But I\'m home.');
    await s.say('Hettie', 'Here — his mother\'s bangle. Mossy old thing. She swore it kept her warm through every winter in Low Town, and she had a lot of winters.');
    await s.give('regen_bangle');
    await s.give('hi_tonic', 3);
    if (s.flag('c3_rowan_quest')) s.quest('c3_rowan', null, null, 'done');
    else { s.setFlag('c3_rowan_quest'); s.quest('c3_rowan', 'The Baker\'s Husband', 'Rowan the baker, rescued from the Undercroft.', 'done'); }
  },

  // ================================================================ THE INFIRMARY (Ilse)
  async ambrose(s) {
    if (s.flag('c3_ambrose')) return s.say('Ambrose', ['Mind those hands, Mender. They\'re rarer than you think.']);
    if (!inParty(s, 'ilse')) return s.say('Ambrose', 'The Infirmary, yes. Visiting hours are at dawn and dusk. Please do not bleed on the step.');
    s.setFlag('c3_ambrose');
    await s.say('Ambrose', 'A Mender. Freshly Kindled, too — your knuckles have the glow. Mender\'s hands always look sunburned the first year.');
    await s.say('Ilse', '...They do?');
    await s.say('Ambrose', 'Humor an old surgeon. A man falls from a scaffold. His leg is bent the wrong way and he\'s bleeding from the scalp. What do you do?');
    await s.say('Ilse', 'Three things. One: pressure on the scalp — head wounds bleed like the sea, but they\'re rarely what kills you.');
    await s.say('Ilse', 'Two: splint the leg where it lies. Three: ask him how he fell. Because how he fell tells you what else is broken.');
    await s.wait(1.0);
    await s.say('Ambrose', '...Might I borrow your Mender for a moment, Page?');
    await s.fadeOut(0.5);
    await s.wait(1.2);
    await s.fadeIn(0.5);
    await s.say('Wren', 'What did he want?');
    await s.say('Ilse', 'To see my bandaging.');
    await s.say('Wren', 'And?');
    await s.say('Ilse', 'And it\'s very good bandaging.');
    await s.say('Ambrose', 'A gift for the road. Every Mender should carry a proper staff, and every staff should carry a few of these.');
    await s.give('choir_staff');
    await s.give('panacea', 2);
  },

  // ================================================================ PIP'S DEBT
  async posy(s) {
    if (!s.flag('c3_pip_joined')) {
      return s.say('Posy', ['That was Pip! He\'s the Gutter Prince. He\'s not a prince. He\'s a _gutter._', 'Dawnbells, two a copper! Chew one if you lose your voice!']);
    }
    if (s.flag('c3_posy_paid') || !inParty(s, 'pip')) return s.say('Posy', ['Dawnbells, two a copper! They ring if you shake them. They don\'t, really. But you\'ll want them to.']);
    if (!s.vars.quests?.c3_posy) s.quest('c3_posy', 'Pip\'s Debt', 'Posy the flower-seller says Pip owes her three coppers.');
    await s.say('Posy', 'PIP. Three coppers.');
    await s.say('Pip', 'I don\'t know her.');
    await s.say('Posy', 'Three. Coppers. Since _midsummer._');
    await s.say('Pip', '...Fish-Bird. Can I borrow three coppers?');
    if (!(await s.confirm('Pay Pip\'s debt? (3 gold)', 'Pay it', 'Not today'))) {
      await s.say('Posy', 'I\'ll remember this, Pipkin Tallow. I remember EVERYTHING.');
      return;
    }
    if (s.state.gold < 3) { await s.say('Wren', 'I... don\'t actually have three coppers.'); return; }
    s.setFlag('c3_posy_paid');
    await s.gold(-3, true);
    await s.say('Posy', 'Paid in full! Pleasure doing business. Here — dawnbells, for your trouble. Chew one if you lose your voice.');
    await s.give('echo_herb', 3);
    await s.say('Pip', 'She\'s nice, actually. Don\'t tell her I said that.');
    s.quest('c3_posy', null, null, 'done');
  },

  // ================================================================ OLD SQUIRES (Bram)
  async hollis(s) {
    if (!inParty(s, 'bram')) return s.say('Hollis', 'Dawnguard business, citizen. Move along. Politely.');
    if (s.flag('c3_spar_won')) return s.say('Hollis', ['You didn\'t freeze, Kestrel. I watched. You didn\'t freeze once.', 'Come back when they make you a knight. I\'ll spar you again and lose on purpose.']);
    if (!s.flag('c3_hollis')) {
      s.setFlag('c3_hollis');
      await s.say('Hollis', 'Kestrel?! They told us you were dead. Then they told us you were on some rock in the sea. Then they said that was the same thing.');
      await s.say('Bram', 'Hollis.');
      await s.say('Hollis', 'Did you hear? Varro made knight. And Delphine. Nearly all our year, now. Everyone except—');
      await s.say('Bram', 'Except me.');
      await s.say('Hollis', '...I didn\'t mean it like that.');
      await s.say('Bram', 'I know you didn\'t.');
      await s.say('Hollis', 'Spar with me? For old times. Wooden rules — first to yield. Bring your friends, I\'ll bring Osric. He\'s been dying to hit someone who isn\'t me.');
    }
    if (!(await s.confirm('Spar with Squire Hollis and Osric?', 'Spar', 'Another time'))) return;
    const r = await s.battle('c3_spar', { bg: 'town', loseOk: true, canFlee: false });
    s.heal();
    if (r !== 'win') {
      await s.say('Hollis', 'Ha! Yield accepted. You\'re rusty, Kestrel. Come back when you\'ve shaken the salt out.');
      return;
    }
    s.setFlag('c3_spar_won');
    await s.say('Hollis', '...Yield! I yield. Dawn and daylight, Kestrel. Where did _that_ come from?');
    await s.say('Bram', 'It\'s easier when it doesn\'t matter.');
    await s.say('Hollis', 'Is it?');
    await s.wait(1.0);
    await s.say('Hollis', 'Take my kite-shield. The Quartermaster issued me two by mistake and I\'ve been too scared to give one back.');
    await s.give('steel_kite');
  },

  // ================================================================ THE LABORATORY CELLS
  async rowanCell(s) {
    if (s.flag('c3_mercy_down')) return s.narrate('The cell is empty. A smear of flour on the wall, where someone leaned.');
    await s.narrate('A man in a red scarf sits against the wall of the cell. The scarf has dropped stitches all down one side.');
    await s.say('Rowan', '...Is it supper? She said there\'d be supper.');
    await s.say('Wren', 'Rowan? Hettie\'s Rowan? We\'re getting you out.');
    await s.say('Rowan', 'Hettie. Tell Hettie... I\'m sorry about the bread. I couldn\'t lift it. I couldn\'t lift anything.');
    await s.narrate('The lock on the cell door is a knot of violet light. When Wren touches it, it is cold enough to burn.');
    await s.say('Sable', 'It is a Gloam-seal. It won\'t open while the one who made it is awake.');
    if (!s.flag('c3_rowan_found')) {
      s.setFlag('c3_rowan_found');
      if (s.flag('c3_rowan_quest')) s.quest('c3_rowan', null, 'Rowan is alive, locked in a Gloam-sealed cell in Mercy\'s laboratory. The seal won\'t break while its maker is awake.');
    }
  },

  async childrenPen(s) {
    if (s.flag('c3_mercy_down')) return s.narrate('The pen is empty. Someone has scratched a crown into the wall, very small, with a stone.');
    await s.narrate('Behind the bars, three children sit close together under one grey blanket.');
    await s.say('Nell', 'Pip...?');
    if (inParty(s, 'pip')) {
      await s.say('Pip', 'NELL! Nell, I\'m here, I— this lock, it\'s— _ow!_ It\'s cold, it bit me—');
      await s.say('Nell', 'The singing lady has the key. The singing lady is the key, I think. She went down there. Where it\'s purple.');
      await s.say('Pip', 'Stay put. I mean it this time. I\'m coming back.');
    }
  },
};
