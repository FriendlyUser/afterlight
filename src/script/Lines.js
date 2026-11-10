// The dialogue line language: conditional lines, branches, choices and speakers as
// data, so a scene can say different things without `if` ladders around every line.
// `s.say`, `s.narrate`, `s.think`, `s.talk` and an NPC's `talk` all take a LineSpec
// (types in src/types/data.d.ts):
//
//   'A plain line.'
//   { text: 'Said only once the flag is set.', if: 'c3_forks' }
//   { by: 'Bram', text: 'Someone else cuts in.', if: 'party:bram' }
//   { if: 'item:tonic>=2 & !c2_cat_done', lines: [ … ] }           a conditional block
//   { pick: [ { if: 'var:c2_scare>=3', lines: [ … ] },             the first branch that
//             { if: 'quest:c2_cat=done', text: '…' },              holds; a branch with no
//             { text: 'Nothing new.' } ] }                         condition is the fallback
//   { ask: 'Stay?', id: 'stay', options: [ { text: 'Stay.', set: 'c12_stayed', lines: [ … ] },
//                                          { text: 'Wake up.' } ] }
//   { set: 'met_marlow' }        { run: async (s) => { … } }       side effects in passing
//   [ …any of the above ]                                           a sequence
//
// Conditions (`if` / `unless`) are a function of the game state, or data:
//   'flag'  '!flag'  'flag=2'            story flags ('flag:chest:map:id' for names with colons)
//   'party:bram'                         is in the party
//   'item:tonic'  'item:tonic>=2'        carries (at least n of) an item
//   'quest:c2_cat'  'quest:c2_cat=done'  quest known / in a given state (active, done)
//   'var:c2_scare>=3'  'var:name=x'      story variables
//   'gold>=100'  'chapter>=3'  'level>=10' (average active-party level)
//   'a & b'  'a | b'  (& binds tighter; no parentheses — nest objects for those)
//   { all: [ … ] }  { any: [ … ] }  { not: … }  [ … ] (all)  true / false
//
// In `s.talk` a string names its speaker: 'Ilse: You\'re late.' (a bare string is
// narration; 'Wren (thought): …' is a thought). Everywhere else a bare string belongs
// to the speaker the call names, and `by` hands a line to someone else.

// ------------------------------------------------------------------ conditions

const OPS = {
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '!=': (a, b) => a != b, // eslint-disable-line eqeqeq
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '=': (a, b) => a == b, // eslint-disable-line eqeqeq
};
const TERM = /^(!?)\s*(?:([a-z]+):)?([\w.:-]+?)\s*(?:(>=|<=|!=|>|<|=)\s*([\w.-]+))?$/;
const parsed = new Map();

/** Average level of the active party (what 'level>=n' compares). */
export function partyLevel(st) {
  const m = st.activeMembers?.() || [];
  return m.length ? Math.floor(m.reduce((sum, c) => sum + c.level, 0) / m.length) : 1;
}

const READERS = {
  flag: (st, key) => st.flags[key],
  party: (st, key) => st.party.includes(key),
  item: (st, key) => st.inventory.count(key),
  var: (st, key) => st.vars[key],
  quest: (st, key) => st.vars.quests?.[key]?.status,
  gold: (st) => st.gold,
  chapter: (st) => st.chapter,
  level: (st) => partyLevel(st),
};

/** 'item:tonic>=2' -> (state) => boolean. Throws on text it can't read. */
function parseTerm(src) {
  const m = TERM.exec(src.trim());
  if (!m) throw new Error(`Lines: can't read condition "${src}"`);
  const [, bang, kind, key, op, raw] = m;
  let read;
  if (kind) {
    if (!READERS[kind] || ['gold', 'chapter', 'level'].includes(kind)) {
      throw new Error(`Lines: unknown condition kind "${kind}:" in "${src}" (a flag whose name has a colon is written "flag:${kind}:${key}")`);
    }
    read = (st) => READERS[kind](st, key);
  } else if (['gold', 'chapter', 'level'].includes(key) && op) {
    read = READERS[key];
  } else {
    read = (st) => READERS.flag(st, key);
  }
  const value = raw === undefined ? undefined : Number.isNaN(Number(raw)) ? raw : Number(raw);
  let test;
  if (op) test = (st) => OPS[op](read(st) ?? (typeof value === 'number' ? 0 : ''), value);
  else if (kind === 'item') test = (st) => read(st) >= 1;
  else test = (st) => !!read(st);
  return bang ? (st) => !test(st) : test;
}

/** 'a & !b | c' -> (state) => boolean (cached). */
function parseCond(src) {
  let fn = parsed.get(src);
  if (!fn) {
    const any = src.split('|').map((part) => part.split('&').map(parseTerm));
    fn = (st) => any.some((all) => all.every((t) => t(st)));
    parsed.set(src, fn);
  }
  return fn;
}

/**
 * Does a condition hold? A missing condition holds.
 * @param {import('../types/data').LineCond | undefined | null} cond
 * @param {import('../state/GameState.js').GameState} st
 * @returns {boolean}
 */
export function testCond(cond, st) {
  if (cond === undefined || cond === null) return true;
  if (typeof cond === 'boolean') return cond;
  if (typeof cond === 'function') return !!cond(st);
  if (typeof cond === 'string') return parseCond(cond)(st);
  if (Array.isArray(cond)) return cond.every((c) => testCond(c, st));
  if ('all' in cond) return cond.all.every((c) => testCond(c, st));
  if ('any' in cond) return cond.any.some((c) => testCond(c, st));
  if ('not' in cond) return !testCond(cond.not, st);
  throw new Error(`Lines: can't read condition ${JSON.stringify(cond)}`);
}

/** `if` holds and `unless` doesn't. */
const applies = (node, st) => testCond(node.if, st) && !(node.unless !== undefined && testCond(node.unless, st));

// ------------------------------------------------------------------ speakers & voice ids

// 'Nana Brisa: text', '???: text', 'Wren (thought): text' — one to four capitalised
// words (or ???), then ': '.
const SPEAKER = /^((?:\?\?\?|[A-Z][\w'’-]*)(?: [A-Za-z][\w'’-]*){0,3})(?: \((thought|thinks|aside)\))?: (.+)$/s;

/** Split a talk-mode string into { by, style, text }; no prefix means narration. */
export function splitSpeaker(str) {
  const m = SPEAKER.exec(str);
  if (!m) return { by: null, style: 'narration', text: str };
  return { by: m[1], style: m[2] ? 'thought' : undefined, text: m[3] };
}

/** The words of a line as spoken: no timing tags, no markup, single spaces. */
export function spokenText(text) {
  return String(text)
    .replace(/\{(?:wait|speed|spd|shake|sfx)(?:=[^}]*)?\}/g, '')
    .replace(/\{\w+\|(.+?)\}/g, '$1')
    .replace(/[*_]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Folder-safe speaker key: 'Nana Brisa' -> 'nana_brisa', none -> 'narrator'. */
export function speakerKey(by) {
  const key = String(by || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return key || (by ? 'unknown' : 'narrator');
}

function fnv1a(bytes, seed) {
  let h = seed >>> 0;
  for (const b of bytes) { h ^= b; h = Math.imul(h, 0x01000193) >>> 0; }
  return h;
}

/**
 * The stable id of a voiced line: '<speaker>/<12 hex>' from who says it and its
 * spoken text. tools/voice.py computes the same ids from the source, so a recording
 * dropped at voice/<id>.ogg plays without touching any script.
 */
export function voiceId(by, text) {
  const who = speakerKey(by);
  const bytes = new TextEncoder().encode(`${who}|${spokenText(text)}`);
  const hex = (n, len) => n.toString(16).padStart(8, '0').slice(0, len);
  return `${who}/${hex(fnv1a(bytes, 0x811c9dc5), 8)}${hex(fnv1a(bytes, 0x9747b28c), 4)}`;
}

// ------------------------------------------------------------------ playing lines

/**
 * @typedef {object} LineEnv
 * @property {string | null} [by]      who speaks bare strings
 * @property {boolean} [talk]          strings name their speaker ('Ilse: …')
 * @property {object} [opts]           dialogue options for every line (style, speed…)
 * @property {Record<string, number>} [results]  picked option per `ask` id
 */

/**
 * Speak a LineSpec through the script context. Conditions are tested when their
 * line comes up, so a `set`, `run` or choice earlier in the spec can steer what
 * follows. Resolves to the picked option index of every `ask` that has an id.
 * @param {import('./ScriptContext.js').ScriptContext} s
 * @param {import('../types/data').LineSpec} spec
 * @param {LineEnv} [env]
 * @returns {Promise<Record<string, number>>}
 */
export async function playLines(s, spec, env = {}) {
  env.results ||= {};
  // No line: lets a sequence hold `cond && 'A line.'`.
  if (spec === undefined || spec === null || spec === false || spec === true) return env.results;
  if (Array.isArray(spec)) {
    for (const part of spec) await playLines(s, part, env);
    return env.results;
  }
  if (typeof spec === 'string' || typeof spec === 'number') {
    if (env.talk) await speakNamed(s, String(spec), env.opts);
    else await speak(s, env.by, String(spec), env.opts);
    return env.results;
  }
  if (typeof spec !== 'object') throw new Error(`Lines: can't speak ${typeof spec} ${String(spec)}`);
  if (!NODE_KEYS.some((k) => k in spec)) console.warn('Lines: a node with nothing to say or do', spec);

  const st = s.state;
  if (!applies(spec, st)) return env.results;
  if (spec.set !== undefined && !spec.ask) setFlags(s, spec.set);
  if (spec.run) await spec.run(s);

  // Who speaks inside this node, and how.
  const { if: _if, unless: _unless, set: _set, run: _run, by, text, narrate, lines, pick, ask, id, options, voice, ...lineOpts } = spec;
  const inner = { ...env, by: by !== undefined ? by : env.by, opts: { ...env.opts, ...lineOpts } };
  if (by !== undefined) inner.talk = false; // an explicit speaker: strings below are theirs

  if (narrate !== undefined) {
    for (const t of [].concat(narrate)) await speak(s, null, t, { style: 'narration', portrait: false, ...inner.opts });
  }
  if (text !== undefined) {
    for (const t of [].concat(text)) {
      if (inner.talk) await speakNamed(s, t, inner.opts, voice);
      else await speak(s, inner.by, t, inner.opts, voice);
    }
  }
  if (lines !== undefined) await playLines(s, lines, inner);
  if (pick) {
    const branch = pick.find((b) => applies(b, st));
    if (branch) {
      const { if: _i, unless: _u, ...rest } = branch;
      await playLines(s, rest, inner);
    }
  }
  if (ask !== undefined) {
    const open = (options || []).filter((o) => applies(o, st));
    if (open.length) {
      const picked = await s.choice(open.map((o) => o.text), { prompt: ask === true ? undefined : ask });
      const chosen = open[picked];
      if (id) env.results[id] = options.indexOf(chosen);
      if (chosen.set !== undefined) setFlags(s, chosen.set);
      if (chosen.run) await chosen.run(s);
      if (chosen.lines !== undefined) await playLines(s, chosen.lines, inner);
    }
  }
  return env.results;
}

const NODE_KEYS = ['text', 'narrate', 'lines', 'pick', 'ask', 'set', 'run'];

/** One line of dialogue, with its voice id. */
function speak(s, by, text, opts = {}, voice) {
  const name = s.name(by);
  return s.ui.dialogue(name, s.fill(text), { ...opts, voice: voice ?? voiceId(name, text) });
}

/** A talk-mode string: 'Ilse: You\'re late.', or narration when it names nobody. */
function speakNamed(s, str, opts = {}, voice) {
  const { by, style, text } = splitSpeaker(str);
  if (!by) return speak(s, null, text, { style: 'narration', portrait: false, ...opts }, voice);
  return speak(s, by, text, style ? { ...opts, style } : opts, voice);
}

/** set: 'flag' | ['a', 'b'] | { flag: value } */
function setFlags(s, set) {
  if (typeof set === 'string') s.setFlag(set);
  else if (Array.isArray(set)) for (const f of set) s.setFlag(f);
  else for (const [f, v] of Object.entries(set)) s.setFlag(f, v);
}
