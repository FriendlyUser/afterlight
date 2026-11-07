// Every song parses: valid notes, chords, bar lengths. Run: tools/test.sh audio 20000
import { SONGS } from '../src/audio/songs.js';
import { parseLine, parseChord, buildTracks } from '../src/audio/Audio.js';

export async function run(game, h) {
  const errors = [];
  for (const [id, song] of Object.entries(SONGS)) {
    for (const key of ['melody', 'melody2', 'bassLine']) {
      if (!song[key]) continue;
      const notes = parseLine(song[key]);
      if (notes.some((n) => n.notes.some((m) => m === null || Number.isNaN(m)))) errors.push(`${id}.${key}: bad note`);
      const steps = notes.reduce((s, n) => s + n.len, 0);
      const bar = song.chordLen || 16;
      if (song.chords && steps !== song.chords.length * bar) errors.push(`${id}.${key}: ${steps} steps vs ${song.chords.length * bar} for chords`);
    }
    for (const c of song.chords || []) if (!parseChord(c)) errors.push(`${id}: bad chord ${c}`);
    try { buildTracks(song); } catch (e) { errors.push(`${id}: ${e.message}`); }
  }
  h.log(`${Object.keys(SONGS).length} songs checked`);
  if (errors.length) { console.error(errors.join('\n')); throw new Error(`${errors.length} song errors`); }
}
