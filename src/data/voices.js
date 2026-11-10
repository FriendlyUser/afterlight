// Speaker voices for the typing blips: each character "talks" in their own timbre.
// A profile is { wave, freq (Hz), vol, every (characters per blip), filter (Hz low-pass) }.
// Anyone not listed gets a steady voice derived from their name, so every villager
// sounds like themselves each time. Recorded voice lines (audio/VoiceLines.js)
// replace the blips for the lines that have them.

/** @typedef {{ wave?: OscillatorType, freq: number, vol?: number, every?: number, dur?: number, filter?: number }} Blip */

/** @type {Record<string, Blip>} keyed by the first word of the speaker's name, lower-case */
export const BLIPS = {
  // The party
  wren: { wave: 'triangle', freq: 960, vol: 0.035 },
  ilse: { wave: 'sine', freq: 1120, vol: 0.04 },
  bram: { wave: 'square', freq: 430, vol: 0.02, filter: 2400 },
  sable: { wave: 'sine', freq: 740, vol: 0.04, every: 4 },
  pip: { wave: 'square', freq: 1240, vol: 0.016, every: 2 },
  corvin: { wave: 'sawtooth', freq: 350, vol: 0.016, filter: 1700 },
  // The story's fixed points
  cassian: { wave: 'sine', freq: 300, vol: 0.045, every: 4 },
  ysolde: { wave: 'triangle', freq: 660, vol: 0.035 },
  nana: { wave: 'triangle', freq: 560, vol: 0.035, every: 4 },
  garrick: { wave: 'sawtooth', freq: 260, vol: 0.018, filter: 1400 },
  lysa: { wave: 'sine', freq: 1320, vol: 0.03, every: 4 },
  '???': { wave: 'sine', freq: 400, vol: 0.03, every: 4 },
};

/** @type {Blip} narration and thoughts: soft and unvoiced */
const NARRATION = { wave: 'sine', freq: 520, vol: 0.016, every: 4 };
/** @type {Blip} tips */
const SYSTEM = { wave: 'triangle', freq: 880, vol: 0.02, every: 4 };

const WAVES = /** @type {OscillatorType[]} */ (['triangle', 'sine', 'square']);
const derived = new Map();

/**
 * The blip profile for a speaker (and line style).
 * @param {string | null} speaker
 * @param {string} [style]
 * @returns {Blip}
 */
export function blipFor(speaker, style) {
  if (style === 'system') return SYSTEM;
  if (!speaker || style === 'narration') return NARRATION;
  const key = String(speaker).toLowerCase().split(' ')[0];
  let p = BLIPS[key] || derived.get(speaker);
  if (!p) {
    // A stable voice from the name: 12 pitches across three timbres.
    let h = 0;
    for (const ch of String(speaker)) h = (Math.imul(h, 31) + ch.codePointAt(0)) >>> 0;
    const wave = WAVES[h % 3];
    p = { wave, freq: 480 + ((h >>> 3) % 12) * 60, vol: wave === 'square' ? 0.018 : 0.034 };
    derived.set(speaker, p);
  }
  return style === 'thought' ? { ...p, vol: (p.vol ?? 0.035) * 0.6 } : p;
}
