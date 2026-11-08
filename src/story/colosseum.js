// THE BELLRING — Aurenne's colosseum (Act I, story chapters 3–4).
// Four cups open as the story goes. Each is a three-round gauntlet: HP and MP carry
// between rounds (the medics patch a quarter back), and a loss costs the cup, never
// the game. A first clear wins the cup's prize; every clear earns Bell Tokens for the
// prize counter. Content (fighters, map, world stop) lives in data/content/colosseum.js.

const ROMAN = ['I', 'II', 'III'];
const PATCH = 0.25; // share of max HP/MP the medics restore between rounds

/** The cups, easiest first. `unlock` is a story flag; each also needs the cup before it. */
export const CUPS = [
  {
    id: 'copper', name: 'Copper Cup', lv: 14, unlock: 'c3_pip_joined', tokens: [10, 3], gold: 800, prize: 'vigor_bangle',
    rounds: ['bc_c1_hounds', 'bc_c1_kells', 'bc_c1_grizzlemaw'],
    calls: [
      'Round one! From the kennels under the east stand — the SAND HOUNDS! They have not been fed. That is a joke. Mostly.',
      'Round two! Brothers in arms, brothers in debt — KELL THE NET and KELL THE FIST!',
      'The final round! He has eaten three gates and a herald — GRIZZLEMAW!',
    ],
  },
  {
    id: 'silver', name: 'Silver Cup', lv: 21, unlock: 'c4a_corvin_joined', tokens: [15, 4], gold: 1500, prize: 'hunters_eye',
    rounds: ['bc_c2_scorpions', 'bc_c2_sereno', 'bc_c2_bull'],
    calls: [
      'Round one! Imported at great expense from the Sunscar — the GLASS SCORPIONS! Do not step on them. They hate that.',
      'Round two! Fastest blade in the Heartland, slowest to pay his tab — SERENO THE SWIFT!',
      'The final round! Forged in the bell foundries from a broken bell and a bad idea — THE IRON BULL!',
    ],
  },
  {
    id: 'gold', name: 'Gold Cup', lv: 28, unlock: 'c4b_mirefen_arrived', tokens: [20, 5], gold: 2500, prize: 'feather_cape',
    rounds: ['bc_c3_lurkers', 'bc_c3_masks', 'bc_c3_matron'],
    calls: [
      'Round one! Dredged from the Fens at tremendous personal risk — the MIRE LURKERS!',
      'Round two! One prays, one curses, neither has ever lost — the MASKS OF DAWN AND DUSK!',
      'The final round! Mother of a thousand, mercy for none — THE SCYTHE MATRON!',
    ],
  },
  {
    id: 'sunsteel', name: 'Sunsteel Cup', lv: 34, unlock: 'c4b_elowen_farewell', tokens: [30, 8], gold: 4000, prize: 'bc_laurel',
    rounds: ['bc_c4_kites', 'bc_c4_phalanx', 'bc_c4_valka'],
    calls: [
      'Round one! They ride the bells\' own echoes — the STORM KITES!',
      'Round two! Three shields, one wall, no gaps — the PHALANX OF AURENNE!',
      'The championship! Forty-one bouts. Forty-one wins. Your champion, and mine — VALKA THE UNDEFEATED!',
    ],
  },
];

/**
 * The prize counter: [item, count, Bell Tokens].
 * @type {Array<[string, number, number]>}
 */
export const PRIZES = [
  ['hi_tonic', 3, 2],
  ['hi_ether', 1, 3],
  ['ember_feather', 1, 3],
  ['crest_tome', 1, 8],
  ['focus_pendant', 1, 10],
  ['power_fruit', 1, 12],
  ['magic_fruit', 1, 12],
  ['guard_fruit', 1, 12],
  ['spirit_fruit', 1, 12],
  ['swift_fruit', 1, 18],
  ['lucky_coin', 1, 25],
];

const cleared = (s, cup) => s.flag(`bc_${cup.id}`);
const tokens = (s) => s.state.vars.bc_tokens || 0;

/** Cups the party may enter now: unlocked by the story, and the one before won. */
export function openCups(st) {
  const out = [];
  for (const cup of CUPS) {
    if (!st.flags[cup.unlock]) break;
    out.push(cup);
    if (!st.flags[`bc_${cup.id}`]) break;
  }
  return out;
}

/** Between rounds the medics restore a share of everyone's HP and MP (the fallen get up at 1). */
function patchUp(st) {
  for (const ch of st.activeMembers()) {
    const s = ch.stats();
    ch.hp = Math.min(s.hp, Math.max(1, ch.hp) + Math.round(s.hp * PATCH));
    ch.mp = Math.min(s.mp, ch.mp + Math.round(s.mp * PATCH));
  }
}

/** Fight a cup's three rounds. Returns true when all three are won. */
export async function runCup(s, cup) {
  for (let i = 0; i < cup.rounds.length; i++) {
    s.sfx('bell');
    await s.say('Ottavio Brass', cup.calls[i]);
    const r = await s.battle(cup.rounds[i], { bg: 'colosseum', loseOk: true, canFlee: false });
    if (r !== 'win') {
      s.heal();
      await s.say('Ottavio Brass', [`Down in round ${ROMAN[i]}! The crowd is on its feet — some of them are cheering.`, 'The medics have you. The cup waits. It always waits. It is a cup.']);
      return false;
    }
    if (i < cup.rounds.length - 1) {
      patchUp(s.state);
      await s.system(`Round ${ROMAN[i]} won. The arena medics patch you up (a quarter of HP and MP).`);
    }
  }
  return true;
}

export const BELLRING = {
  /** Ottavio Brass, ringmaster: the cups. */
  async ottavio(s) {
    if (!s.flag('bc_met')) {
      s.setFlag('bc_met');
      await s.say('Ottavio Brass', [
        'Welcome, welcome, WELCOME to the Bellring! Aurenne\'s oldest colosseum! Its loudest! Its only!',
        'I am Ottavio Brass, ringmaster, and I can tell a contender at forty paces. You are contenders. Or very lost.',
      ]);
      await s.say('Pip', 'We\'re contenders. What do contenders win?');
      await s.say('Ottavio Brass', 'Cups! Four of them. Three rounds each, no rest but what my medics give you. Win a cup and the prize is yours — and Bell Tokens, every time you win.');
      await s.say('Bram', 'And if we lose?');
      await s.say('Ottavio Brass', 'Then you lose magnificently, and we patch you up for free. The Bellring has never let a contender die. It is in the charter. Next to the bit about the bell.');
      s.quest('bc_cups', 'The Bellring', 'Win the four cups of Aurenne\'s colosseum: Copper, Silver, Gold — and the Sunsteel Cup, against Valka the Undefeated.');
    }
    const open = openCups(s.state);
    const next = CUPS[open.length];
    const options = [...open.map((c) => `${c.name} (Lv ${c.lv})${cleared(s, c) ? ' ✓' : ''}`), 'How does it work?', 'Not now'];
    const pick = await s.choice(options, { prompt: next && cleared(s, open[open.length - 1]) ? `The ${next.name} opens later in your travels.` : 'Which cup?', cancel: options.length - 1 });
    if (pick === options.length - 2) {
      return s.say('Ottavio Brass', [
        'Three rounds a cup. Your wounds come with you from round to round; my medics give back a quarter between bouts.',
        'Lose and the cup resets — no shame, no fee. Win and the prize is yours, plus Bell Tokens. Win again later and the crowd still pays, a little.',
        'Spend Tokens with my clerk. New cups open as your name grows. Which it will. I am never wrong. I am occasionally early.',
      ]);
    }
    const cup = open[pick];
    if (!cup) return s.say('Ottavio Brass', 'Go on, then. The bell will wait. The bell is very patient. It is a bell.');
    if (!await s.confirm(`Enter the ${cup.name}? Three rounds; HP carries over.`, 'Ring the bell!', 'Not yet')) return null;
    const first = !cleared(s, cup);
    if (!await runCup(s, cup)) return null;
    return BELLRING.crown(s, cup, first);
  },

  /** A cup won: prize on the first clear, Tokens every time. */
  async crown(s, cup, first) {
    s.sfx('bell');
    const earned = cup.tokens[first ? 0 : 1];
    s.state.vars.bc_tokens = tokens(s) + earned;
    if (!first) {
      await s.say('Ottavio Brass', `The ${cup.name}, AGAIN! The crowd knows your names now. They are pronouncing them wrong, but with love.`);
      return s.system(`Received *${earned}* Bell Tokens. (You have ${tokens(s)}.)`);
    }
    s.setFlag(`bc_${cup.id}`);
    if (cup.id === 'sunsteel') {
      await s.say('Valka', 'Forty-one and one. ...Good. I was getting bored of winning. Look after that laurel — it has been mine for nine years.');
      await s.say('Ottavio Brass', 'LADIES! GENTLEMEN! THE BELLRING HAS NEW CHAMPIONS!');
      s.quest('bc_cups', null, null, 'done');
      s.journal('We won the Sunsteel Cup at the Bellring. Valka the Undefeated is now Valka the Defeated Once. She shook our hands like it was a gift.');
    } else {
      await s.say('Ottavio Brass', `The ${cup.name} goes to my contenders! Did I not say? I said. Ask anyone.`);
    }
    await s.give(cup.prize);
    await s.gold(cup.gold);
    await s.system(`Received *${earned}* Bell Tokens. (You have ${tokens(s)}.)`);
    const next = CUPS[CUPS.indexOf(cup) + 1];
    if (next && s.flag(next.unlock)) return s.say('Ottavio Brass', `And the ${next.name} is open to you. Rest first. Or don't. The crowd prefers don't.`);
    return null;
  },

  /** The prize counter: Bell Tokens for goods. */
  async clerk(s) {
    if (!s.flag('bc_met')) return s.say('Prize Clerk', 'Tokens are won in the ring, not bought at the counter. Talk to Mr. Brass. Loudly. He prefers it.');
    for (;;) {
      const options = [...PRIZES.map(([id, n, cost]) => `${s.state.inventory.itemName(id)}${n > 1 ? ` ×${n}` : ''} — ${cost} Tokens`), 'Leave'];
      const pick = await s.choice(options, { prompt: `Bell Tokens: ${tokens(s)}`, cancel: options.length - 1 });
      if (pick === options.length - 1) return s.say('Prize Clerk', 'Come back richer. In Tokens. Gold doesn\'t count here.');
      const [id, n, cost] = PRIZES[pick];
      if (tokens(s) < cost) return s.say('Prize Clerk', `That's ${cost} Tokens. You have ${tokens(s)}. The ring is that way.`);
      s.state.vars.bc_tokens = tokens(s) - cost;
      await s.give(id, n);
    }
  },

  /** A crier by Aurenne's gate points the way. */
  async crier(s) {
    await s.say('Bellring Crier', [
      'Hear ye! The BELLRING is open! Four cups! One champion! Valka the Undefeated, forty-one bouts and never once on her back!',
      'Out the gate and east by the bell foundries — it\'s on any map worth the paper. Tell Ottavio Brass the crier sent you. He won\'t care, but I get a copper.',
    ]);
  },
};
