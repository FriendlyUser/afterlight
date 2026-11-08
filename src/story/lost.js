// THE LOST CALLINGS — four Crests the Choir struck from its rolls centuries ago
// (data/crests.js, Tier IV; guardians in data/content/lost.js). After the Sundering
// the places they were hidden have cracked open. Someone still remembers each one and
// points the way; at its slab of crest-glass a guardian waits. Beat it, and the
// calling is remembered — the Crest is the party's to swap to, like any other.
// Quests: lost_<crest>. Flags: lost_<crest> once remembered.

import { CRESTS } from '../data/crests.js';

/** @typedef {{ giver: string, intro: string[], quest: string, active: string, after: string[], approach: string, rise: string, won: string, cleared: string, journal: string }} LostCalling */

/** @type {Record<string, LostCalling>} */
export const LOST = {
  tidecaller: {
    giver: 'Grandmother Wend',
    intro: [
      'You\'ve the look of Lanternfall, girl. Salt in the eyes.',
      'My gran was a Tidecaller. You\'ll not have heard of it. The Choir struck it from the rolls when the fishing towns stopped paying tithe — said the sea was a heathen thing to sing to.',
      'Struck it out of the books, but they couldn\'t strike it out of the water. Gran said the last Tidecaller\'s crest-glass went down with the last singer, out past the strait. She\'s still out there, singing. I hear her some nights.',
      'If the sea\'s gone, maybe the song is all that\'s left of it. Go and listen. Take it back, if she\'ll let you.',
    ],
    quest: 'Grandmother Wend in Keelhaven says the last Tidecaller\'s crest-glass lies at the far east end of the Strait That Was, still guarded by its singer.',
    active: 'Past the last bridge, at the very end of the strait. Listen for her.',
    after: ['You found her. I heard it last night — the singing stopped. Thank you for letting her rest.', 'Sing to the sea sometimes. It\'s still listening, wherever it went.'],
    approach: 'A slab of crest-glass, crusted white with old salt, wedged in the rock like a figurehead. Something inside it is singing.',
    rise: 'Water that is not there rises around the glass — and in it, a drowned woman in a Cantor\'s robe, still singing the boats home.',
    won: 'The song ends on a long, low note, like a tide turning. The crest-glass clears, and in it burns a Crest none of you has ever seen: three waves, each over the last.',
    cleared: 'The crest-glass is clear and quiet now. If you listen very hard, it still sounds a little like the sea.',
    journal: 'At the end of the Strait That Was, the Drowned Cantor sang over a lost Crest. We let her finish her song. The Tidecaller calling is ours to carry now.',
  },
  bellwright: {
    giver: 'Founder Hask',
    intro: [
      'Hask. Last of the founders\' guild. Well — last of anything, these days.',
      'Every bell in this city was poured by Bellwrights. That was a calling once, child — a Crest. Then the Choir decided a bell that could call the faithful could call other things too.',
      'They struck the calling from the rolls and walled the guild\'s crest-glass up in the old foundry under the Undercroft, with the Abbot to watch it. The Abbot is a bell. Don\'t ask.',
      'The flood opened the walls. If you\'re going down there anyway... ring it for me. Once. That\'s all I\'ve ever wanted.',
    ],
    quest: 'Founder Hask in the ruins of Aurenne says the Bellwrights\' crest-glass is walled up in the far north-east of the drowned Undercroft, watched by the Bronze Abbot.',
    active: 'North-east corner of the drowned Undercroft, past the old reliquary. You\'ll hear it before you see it.',
    after: ['I heard it. All the way up here, through the ash. First time in four hundred years that bell has rung for anyone but the Choir.', 'Go on, then, Bellwright. Make some noise.'],
    approach: 'A bell of crest-glass, taller than a man, hangs in a cage of rusted chain. Before it, something bronze stirs on its yoke.',
    rise: 'The Bronze Abbot swings down from the dark, ringing with every step it takes.',
    won: 'The Abbot cracks down the middle with a sound like the last bell of evening. The chains fall away. In the glass bell burns a Crest you have never seen: a bell, mid-swing, ringing.',
    cleared: 'The glass bell hangs free now. Touch it, and it hums.',
    journal: 'Under Aurenne we rang the bell the founders hid. Hask heard it. The Bellwright calling is ours now.',
  },
  kitewright: {
    giver: 'Ada Kestrel',
    intro: [
      'Kiteholm flies kites because kites are what we have. But there were folk who flew more than kites, once. Kitewrights.',
      'The Choir struck them out. "Only the sun belongs in the sky." Burned the workshops. One didn\'t burn — it was already too far down to reach.',
      'It\'s in the Underhang. Deep. The south end. With the thing they built to lift it, which never lifted anything but grudges.',
      'If you find their crest-glass, bring the calling back up. Let somebody fly who isn\'t a kite.',
    ],
    quest: 'Ada Kestrel in Kiteholm says the Kitewrights\' last workshop lies at the far south end of the Underhang, guarded by the Scrap Colossus.',
    active: 'South, as deep as the Underhang goes. Mind the lines.',
    after: ['Look at you. A Kitewright. Gaffer Quill is going to be unbearable about this — he always said they\'d come back.', 'Go on. Fall upward.'],
    approach: 'A workshop hangs in the dark, all struts and old canvas, half-swallowed by the rock. At its heart, a slab of crest-glass shaped like a wing.',
    rise: 'Something huge unfolds out of the scrap around the glass, rivets screaming.',
    won: 'The Colossus sags, then sits, almost gently, as if it had only ever wanted to be allowed to stop. The wing-shaped glass clears. In it burns a Crest: a kite on a long line.',
    cleared: 'The wing of crest-glass catches the faint light from above. The Colossus sits beside it, very still, keeping it company.',
    journal: 'Deep in the Underhang we found the Kitewrights\' last workshop, and the Colossus they built to lift it. The Kitewright calling flies again.',
  },
  mnemonist: {
    giver: 'Sexton Mabry',
    intro: [
      'Every flower here is a last word. I keep the book of names that goes with them. Someone must remember them, or what are they for?',
      'There was a calling for this, once. Mnemonists. Keepers of memory. The Choir struck it out when it decided some things were better forgotten.',
      'The last Mnemonist is buried at the heart of the maze. The Choir set something on her grave — an appetite. It eats names. It has eaten so many.',
      'If you can stand before it and still remember who you are, the calling is yours. I would like someone to remember her.',
    ],
    quest: 'Sexton Mabry at the Garden\'s gate says the last Mnemonist lies at the heart of the Garden\'s maze, where the Forgetting guards her grave.',
    active: 'The heart of the maze. Hold on to your name.',
    after: ['You came back with your names. All of them? Good.', '...And hers. I can feel it. Someone remembers her now. That is all a grave is for.'],
    approach: 'A plain stone at the heart of the maze. The name on it has been eaten away. Around it the flowers are silent — and something pale is feeding on the quiet.',
    rise: 'The Forgetting turns toward you, and for a moment you cannot remember your own name. Then Wren says it out loud, and so does everyone else.',
    won: 'The Forgetting comes apart into a thousand small sounds — names, voices, the last words of everyone it ate, rushing back into the flowers. The name on the stone returns: ISOLDE VANE, MNEMONIST. Crest-glass clears in the stone around a Crest like a knot with no end.',
    cleared: 'ISOLDE VANE, MNEMONIST. The flowers around her stone are murmuring again.',
    journal: 'In the Garden That Remembers we stood before the Forgetting and kept our names. The last Mnemonist has hers back, and the calling is ours.',
  },
};

const questId = (id) => `lost_${id}`;
const title = (id) => `Lost Crest: ${CRESTS[id].name}`;

export const LOST_QUESTS = {
  /** The one who remembers: the lore, the quest, then thanks. */
  async giver(s, id) {
    const L = LOST[id];
    if (s.flag(`lost_${id}`)) return s.say(L.giver, L.after);
    if (s.state.vars.quests?.[questId(id)]?.status === 'active') return s.say(L.giver, L.active);
    await s.say(L.giver, L.intro);
    s.quest(questId(id), title(id), L.quest);
    return null;
  },

  /** The crest-glass: its guardian, then the calling remembered. Works with or without the quest. */
  async shrine(s, id) {
    const L = LOST[id];
    if (s.flag(`lost_${id}`)) return s.narrate(L.cleared);
    await s.narrate(L.approach);
    if (!await s.confirm('Touch the crest-glass?', 'Touch it', 'Not yet')) return null;
    await s.narrate(L.rise);
    const r = await s.battle(`lc_${id}`, { loseOk: true });
    if (r !== 'win') {
      s.heal();
      return s.narrate('When you come to, the glass is quiet again. Whatever guards it is waiting for you to come back.');
    }
    s.setFlag(`lost_${id}`);
    await s.narrate(L.won);
    await s.learnCrest(id);
    s.quest(questId(id), title(id), L.quest, 'done');
    s.journal(L.journal);
    return s.system(`The *${CRESTS[id].name}* is a Lost Calling — set it under *Crests* like any other. ${L.giver} would like to know.`);
  },
};
