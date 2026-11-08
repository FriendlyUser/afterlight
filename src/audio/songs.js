// The Afterlight soundtrack. Melodies are written in 16th-note steps
// ("e5:4" = quarter note, ":8" half, ":16" whole); accompaniment is generated
// from the chord progression and style by the sequencer (see Audio.js).
//
// style: { arp: instrument, arpPattern, arpRate, arpOctave, pad: true|instrument,
//          bass: 'pulse'|'drive'|'walk'|'half', drums: kit name }

export const SONGS = {
  // The main theme — the leitmotif returns, transformed, in 'afterlight'.
  title: {
    bpm: 72, chords: ['Am', 'F', 'C', 'G', 'Am', 'F', 'G', 'E'],
    melody: 'e5:6 d5:2 c5:4 b4:4  c5:6 a4:2 a4:8  g4:4 c5:4 e5:4 g5:4  f5:6 e5:2 d5:8  e5:6 d5:2 c5:4 e5:4  a5:6 g5:2 f5:4 e5:4  d5:4 e5:2 f5:2 g5:4 b4:4  b4:6 c5:2 b4:4 g#4:4',
    inst: { melody: 'flute' },
    style: { arp: 'harp', arpPattern: [0, 1, 2, 3, 4, 3, 2, 1], arpRate: 2, pad: true, bass: 'half' },
  },
  lanternfall: {
    bpm: 96, chords: ['C', 'G', 'Am', 'Em', 'F', 'C', 'Dm', 'G'],
    melody: 'e5:4 g5:4 e5:2 d5:2 c5:4  d5:4 b4:4 g4:8  c5:4 e5:4 a5:4 g5:4  g5:6 e5:2 e5:8  f5:4 a5:4 g5:2 f5:2 e5:4  e5:4 c5:4 g4:8  a4:4 c5:2 d5:2 f5:4 e5:4  d5:8 b4:4 g4:4',
    inst: { melody: 'flute' },
    style: { arp: 'pluck', arpPattern: [0, 2, 1, 2, 0, 2, 1, 2], arpRate: 2, bass: 'pulse', drums: 'soft', pad: true, padVol: 0.5 },
  },
  kindling: {
    bpm: 66, chords: ['C', 'F', 'C', 'G', 'Am', 'F', 'G', 'C'],
    melody: 'e5:8 g5:8  a5:8 c6:8  g5:12 e5:4  d5:16  c5:4 e5:4 a5:8  a5:4 c6:4 f6:8  d6:8 b5:8  c6:16',
    inst: { melody: 'strings' },
    style: { arp: 'bell', arpRate: 4, arpPattern: [0, 1, 2, 3], pad: true, bass: 'half' },
  },
  field: {
    bpm: 116, chords: ['D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A'],
    melody: 'a4:4 d5:4 f#5:6 e5:2  e5:4 c#5:4 a4:8  b4:4 d5:4 f#5:4 b5:4  a5:6 g5:2 f#5:4 d5:4  f#5:4 a5:4 d6:6 c#6:2  b5:4 a5:4 e5:8  g5:4 f#5:4 e5:4 d5:4  e5:8 c#5:4 a4:4',
    inst: { melody: 'brass' },
    style: { arp: 'pluck', arpRate: 2, pad: 'strings', padVol: 0.5, bass: 'walk', drums: 'march' },
  },
  sea: {
    bpm: 104, chords: ['G', 'D', 'Em', 'C', 'G', 'D', 'C', 'D'],
    melody: 'd5:4 g5:4 b5:6 a5:2  a5:4 f#5:4 d5:8  e5:4 g5:4 b5:4 a5:4  g5:6 e5:2 c5:8  b4:4 d5:4 g5:4 b5:4  a5:6 g5:2 f#5:8  e5:4 g5:4 c6:4 b5:4  a5:8 f#5:8',
    inst: { melody: 'flute' },
    style: { arp: 'pluck', arpPattern: [0, 1, 2, 1, 2, 1], arpRate: 2, bass: 'pulse', drums: 'soft', pad: true, padVol: 0.5 },
  },
  forest: {
    bpm: 80, chords: ['Dm', 'Bb', 'C', 'Am', 'Dm', 'Bb', 'Gm', 'A'],
    melody: 'a4:8 f5:4 e5:4  d5:8 r:8  e5:4 g5:4 c6:4 bb5:4  a5:12 r:4  d6:4 c6:4 a5:4 f5:4  g5:6 f5:2 d5:8  bb4:4 d5:4 g5:4 f5:4  e5:8 c#5:8',
    inst: { melody: 'bell' },
    style: { arp: 'harp', arpRate: 4, arpPattern: [0, 2, 1, 3], pad: true, bass: 'half' },
  },
  town: {
    bpm: 118, chords: ['F', 'C', 'Dm', 'Bb', 'F', 'C', 'Bb', 'C'],
    melody: 'c5:2 f5:2 a5:2 f5:2 c6:4 a5:4  g5:2 e5:2 c5:4 g5:4 e5:4  f5:2 d5:2 a4:4 d5:4 f5:4  d5:6 c5:2 bb4:8  a4:2 c5:2 f5:2 a5:2 c6:4 bb5:2 a5:2  g5:4 e5:4 c5:8  d5:4 f5:4 bb5:4 a5:4  g5:8 e5:4 c5:4',
    inst: { melody: 'flute' },
    style: { arp: 'harp', arpRate: 2, bass: 'pulse', drums: 'town' },
  },
  aurenne: {
    bpm: 100, chords: ['C', 'G/B', 'Am', 'Em', 'F', 'C', 'F', 'G'],
    melody: 'c5:4 e5:4 g5:4 c6:4  b5:6 a5:2 g5:8  a5:4 c6:4 e6:4 d6:4  b5:8 g5:8  a5:4 f5:4 c6:4 a5:4  g5:4 e5:4 c5:8  f5:4 a5:4 c6:4 d6:4  d6:8 b5:8',
    inst: { melody: 'strings' },
    style: { arp: 'harp', arpRate: 2, pad: true, padVol: 0.5, bass: 'pulse', drums: 'town' },
  },
  cave: {
    bpm: 66, chords: ['Em', 'C', 'Em', 'B', 'Em', 'Am', 'B7', 'Em'],
    melody: 'e5:8 r:4 b4:4  c5:8 r:8  g5:4 f#5:4 e5:8  d#5:12 r:4  e5:4 r:4 g5:4 b5:4  a5:8 c6:8  b5:4 a5:4 f#5:4 d#5:4  e5:16',
    inst: { melody: 'bell' },
    style: { pad: true, drums: 'heartbeat', bass: 'half' },
  },
  tension: {
    bpm: 92, chords: ['Dm', 'Dm', 'Bb', 'A'],
    melody: 'd5:16 f5:8 e5:8 d5:16 c#5:16',
    inst: { melody: 'brass' },
    style: { arp: 'strings', arpPattern: [0, 0, 0, 0], arpRate: 2, arpOctave: 3, drums: 'timpani', pad: true, padVol: 0.6 },
  },
  battle: {
    bpm: 150, chords: ['Am', 'F', 'G', 'E', 'Am', 'F', 'G', 'E'],
    melody: 'a4:2 a4:2 c5:2 e5:2 a5:4 g5:2 e5:2  f5:4 e5:2 c5:2 a4:8  g4:2 b4:2 d5:2 g5:2 f5:4 e5:2 d5:2  e5:4 g#4:4 b4:4 e5:4  a5:2 a5:2 g5:2 e5:2 c6:4 b5:2 a5:2  c6:4 a5:4 f5:8  g5:2 f5:2 e5:2 d5:2 b4:4 d5:4  e5:8 e4:8',
    inst: { melody: 'lead' },
    style: { arp: 'pluck', arpRate: 1, arpPattern: [0, 1, 2, 1], pad: 'strings', padVol: 0.6, bass: 'drive', drums: 'battle' },
  },
  boss: {
    bpm: 160, chords: ['Dm', 'Bb', 'Gm', 'A', 'Dm', 'Bb', 'C', 'A'],
    melody: 'd5:2 r:2 d5:2 f5:2 a5:4 g5:2 f5:2  bb5:4 a5:4 f5:4 d5:4  g5:2 r:2 g5:2 bb5:2 d6:4 c6:2 bb5:2  a5:8 c#5:4 e5:4  f5:2 e5:2 d5:2 e5:2 f5:2 g5:2 a5:4  bb5:2 a5:2 g5:2 f5:2 d5:8  e5:4 g5:4 c6:4 e6:4  c#6:8 a5:8',
    inst: { melody: 'brass' },
    style: { arp: 'lead', arpRate: 1, arpPattern: [0, 2, 1, 2], arpVol: 0.5, pad: 'strings', padVol: 0.7, bass: 'drive', drums: 'boss' },
  },
  victory: {
    bpm: 132, once: true, chords: ['C', 'F', 'G', 'C'],
    melody: 'c5:2 c5:2 c5:2 c5:4 g4:2 a4:2 c5:2  a4:2 c5:2 f5:4 e5:2 f5:2 a5:4  g5:4 f5:2 e5:2 d5:4 b4:4  c5:8 [c5e5g5]:8',
    inst: { melody: 'brass' },
    style: { pad: true, bass: 'pulse', drums: 'timpani' },
  },
  sad: {
    bpm: 64, chords: ['Am', 'F', 'C', 'G', 'F', 'C', 'Dm', 'E'],
    melody: 'e5:6 d5:2 c5:4 a4:4  f5:6 e5:2 c5:8  g4:4 c5:4 e5:4 d5:4  d5:12 b4:4  a4:4 c5:4 f5:4 e5:4  e5:6 d5:2 c5:8  d5:4 f5:4 a5:4 g5:4  g#5:12 b4:4',
    inst: { melody: 'piano' },
    style: { arp: 'piano', arpRate: 2, arpPattern: [0, 2, 1, 2, 3, 2, 1, 2], arpOctave: 3, arpVol: 0.6, pad: 'strings', padVol: 0.5 },
  },
  cassian: {
    bpm: 70, chords: ['Cmaj7', 'Am7', 'Fmaj7', 'Fm', 'Cmaj7', 'Am7', 'Dm7', 'G7'],
    melody: 'e5:4 g5:4 b5:4 g5:4  c6:8 a5:8  a5:4 f5:4 e5:4 c5:4  ab5:12 g5:4  e5:4 g5:4 b5:4 d6:4  c6:6 b5:2 a5:8  f5:4 a5:4 c6:4 a5:4  g5:12 r:4',
    inst: { melody: 'bell' },
    style: { arp: 'harp', arpRate: 2, arpPattern: [0, 1, 2, 3, 2, 1], pad: 'strings', padVol: 0.6, bass: 'half' },
  },
  ruin: {
    bpm: 84, chords: ['Am', 'Em', 'F', 'C', 'Dm', 'Am', 'E', 'Am'],
    melody: 'c5:6 b4:2 a4:8  g4:4 b4:4 e5:8  f5:6 e5:2 c5:4 a4:4  g4:12 r:4  a4:4 d5:4 f5:4 e5:4  e5:6 c5:2 a4:8  b4:4 d5:4 g#5:4 e5:4  a4:16',
    inst: { melody: 'strings' },
    style: { arp: 'pluck', arpRate: 4, pad: true, padVol: 0.6, bass: 'half', drums: 'soft' },
  },
  desert: {
    bpm: 96, chords: ['Em', 'F', 'Em', 'D', 'Em', 'F', 'G', 'F'],
    melody: 'e5:4 f5:4 g5:2 f5:2 e5:4  f5:4 a5:4 c6:4 a5:4  b5:6 a5:2 g5:4 e5:4  d5:8 f#5:8  e5:2 f5:2 g5:2 a5:2 b5:4 a5:4  c6:4 a5:4 f5:8  g5:4 b5:4 d6:4 b5:4  a5:8 f5:8',
    inst: { melody: 'flute' },
    style: { arp: 'pluck', arpRate: 2, arpPattern: [0, 1, 0, 2], bass: 'pulse', drums: 'town' },
  },
  snow: {
    bpm: 72, chords: ['F#m', 'D', 'A', 'E', 'F#m', 'D', 'Bm', 'C#'],
    melody: 'c#6:8 a5:8  f#5:8 a5:4 d6:4  c#6:4 b5:4 a5:4 e5:4  g#5:12 r:4  a5:4 c#6:4 f#6:4 e6:4  d6:8 a5:8  b5:4 d6:4 f#6:4 d6:4  c#6:16',
    inst: { melody: 'bell' },
    style: { arp: 'harp', arpRate: 4, pad: true, bass: 'half' },
  },
  swamp: {
    bpm: 82, chords: ['Gm', 'Eb', 'F', 'D', 'Gm', 'Eb', 'Cm', 'D'],
    melody: 'd5:6 bb4:2 g4:8  g5:4 f5:4 eb5:8  f5:4 a5:4 c6:4 a5:4  f#5:12 r:4  g5:4 bb5:4 d6:4 c6:4  bb5:6 g5:2 eb5:8  c5:4 eb5:4 g5:4 f5:4  d5:8 f#5:8',
    inst: { melody: 'flute' },
    style: { arp: 'pluck', arpRate: 4, pad: true, bass: 'half', drums: 'soft' },
  },
  gloam: {
    bpm: 76, chords: ['Cm', 'Ab', 'Fm', 'G', 'Cm', 'Ab', 'Db', 'G'],
    melody: 'g5:8 eb5:8  c5:8 ab4:8  f5:4 eb5:4 c5:4 ab4:4  b4:16  c6:6 bb5:2 g5:8  ab5:4 g5:4 eb5:8  f5:4 db5:4 ab4:4 f4:4  g4:8 b4:8',
    inst: { melody: 'bell' },
    style: { pad: true, drums: 'heartbeat', bass: 'half', arp: 'harp', arpRate: 4, arpVol: 0.5 },
  },
  evernoon: {
    // The frozen afternoon: a music-box waltz that never resolves.
    bpm: 84, chords: ['C', 'Caug', 'Am', 'Fm', 'C', 'Caug', 'F', 'Fm'],
    melody: 'g5:4 c6:4 e6:4 g6:4  g#5:8 e6:8  a5:4 c6:4 e6:4 a6:4  ab6:16  g5:4 c6:4 e6:4 g6:4  g#6:8 e6:8  f6:4 c6:4 a5:4 f5:4  ab5:16',
    inst: { melody: 'bell' },
    style: { arp: 'harp', arpRate: 4, pad: true, padVol: 0.6 },
  },
  finalboss: {
    bpm: 170, chords: ['Em', 'C', 'D', 'B', 'Em', 'C', 'Am', 'B'],
    melody: 'e5:2 g5:2 b5:2 e6:2 d6:4 b5:4  c6:4 g5:4 e5:4 g5:4  f#5:2 a5:2 d6:2 f#6:2 e6:4 d6:4  d#6:8 b5:8  e6:2 d6:2 b5:2 g5:2 e5:4 g5:4  c6:4 b5:2 a5:2 g5:8  a5:4 c6:4 e6:4 c6:4  b5:8 d#5:8',
    inst: { melody: 'brass' },
    style: { arp: 'lead', arpRate: 1, arpPattern: [0, 1, 2, 1], arpVol: 0.5, pad: 'strings', padVol: 0.8, bass: 'drive', drums: 'boss' },
  },
  afterlight: {
    // The ending: the title motif, finally in a major key.
    bpm: 80, chords: ['F', 'G', 'Em', 'Am', 'F', 'G', 'C', 'C'],
    melody: 'a5:6 g5:2 f5:4 e5:4  d5:6 e5:2 g5:8  g5:4 b5:4 e6:4 d6:4  c6:12 b5:2 a5:2  a5:6 g5:2 f5:4 a5:4  b5:6 c6:2 d6:8  e6:4 d6:4 c6:4 g5:4  c6:16',
    inst: { melody: 'flute' },
    style: { arp: 'harp', arpRate: 2, arpPattern: [0, 1, 2, 3, 4, 3, 2, 1], pad: 'strings', padVol: 0.7, bass: 'half', drums: 'timpani' },
  },
  inn: {
    bpm: 84, once: true, chords: ['F', 'C', 'F'],
    melody: 'a5:4 c6:4 f5:8  g5:4 e5:4 c5:8  f5:16',
    inst: { melody: 'flute' },
    style: { arp: 'harp', arpRate: 2, pad: true },
  },
  gameover: {
    bpm: 56, chords: ['Am', 'F', 'Dm', 'E'],
    melody: 'e5:8 c5:8  a4:8 c5:8  d5:8 f5:8  e5:16',
    inst: { melody: 'piano' },
    style: { pad: 'strings', padVol: 0.6 },
  },
  airship: {
    // The Halcyon in flight: wind in the rigging, the whole broken sky ahead.
    bpm: 124, chords: ['D', 'G', 'A', 'Bm', 'G', 'D', 'Em', 'A'],
    melody: 'f#5:4 a5:4 d6:6 c#6:2  b5:4 a5:4 g5:8  e5:4 a5:4 c#6:4 e6:4  d6:12 b5:4  b5:4 d6:4 g6:6 f#6:2  f#6:4 e6:4 d6:8  g5:4 b5:4 e6:4 d6:4  c#6:8 a5:8',
    inst: { melody: 'brass' },
    style: { arp: 'pluck', arpRate: 2, arpPattern: [0, 1, 2, 3, 2, 1], pad: 'strings', padVol: 0.6, bass: 'walk', drums: 'march' },
  },
  resolve: {
    // Reunions and decisions: the main theme, quietly finding its feet.
    bpm: 76, chords: ['C', 'G/B', 'Am', 'F', 'C', 'G', 'F', 'G'],
    melody: 'e5:6 d5:2 c5:4 g5:4  g5:8 d5:8  c5:4 e5:4 a5:6 g5:2  f5:12 r:4  e5:4 g5:4 c6:6 b5:2  b5:8 g5:8  a5:4 c6:4 f6:4 e6:4  d6:16',
    inst: { melody: 'piano' },
    style: { arp: 'harp', arpRate: 2, pad: 'strings', padVol: 0.7, bass: 'half' },
  },
  remnant: {
    // The Keepers' Remnants: grief turned into a weapon.
    bpm: 140, chords: ['Em', 'C', 'Am', 'B', 'Em', 'C', 'D', 'B7'],
    melody: 'b5:6 a5:2 g5:4 e5:4  e6:6 d6:2 c6:8  a5:4 c6:4 e6:4 c6:4  d#6:8 b5:8  e6:2 d6:2 b5:2 a5:2 g5:4 e5:4  c6:4 b5:4 a5:4 g5:4  f#5:4 a5:4 d6:4 f#6:4  d#6:8 b5:8',
    inst: { melody: 'strings', melody2: 'brass' },
    melody2: 'e4:16 c4:16 a3:16 b3:16 e4:16 c4:16 d4:16 b3:16', melody2Vol: 0.6,
    style: { arp: 'harp', arpRate: 1, arpPattern: [0, 1, 2, 3], arpVol: 0.5, pad: 'pad', padVol: 0.6, bass: 'drive', drums: 'boss' },
  },
  opening: {
    // The opening movie: the title motif at a gallop, lifting into the major-key
    // phrase the ending finds — the whole story in sixteen bars.
    bpm: 128,
    chords: ['Am', 'F', 'C', 'G', 'Am', 'F', 'G', 'E', 'F', 'G', 'Em', 'Am', 'F', 'G', 'C', 'E'],
    melody: 'e5:6 d5:2 c5:4 b4:4  c5:6 a4:2 a4:8  g4:4 c5:4 e5:4 g5:4  f5:6 e5:2 d5:8  e5:6 d5:2 c5:4 e5:4  a5:6 g5:2 f5:4 e5:4  d5:4 e5:2 f5:2 g5:4 b4:4  b4:6 c5:2 b4:4 g#4:4 '
      + 'a5:6 g5:2 f5:4 e5:4  d5:6 e5:2 g5:8  g5:4 b5:4 e6:4 d6:4  c6:12 b5:2 a5:2  a5:6 g5:2 f5:4 a5:4  b5:6 c6:2 d6:8  e6:4 d6:4 c6:4 g5:4  b5:8 g#5:4 e5:4',
    inst: { melody: 'brass', melody2: 'strings' },
    melody2: 'a3:16 f3:16 g3:16 g3:16 a3:16 a3:16 b3:16 g#3:16  c4:16 b3:16 b3:16 a3:16 a3:16 b3:16 c4:16 g#3:16', melody2Vol: 0.55,
    style: { arp: 'pluck', arpRate: 1, arpPattern: [0, 1, 2, 3, 2, 1], arpVol: 0.6, pad: 'strings', padVol: 0.55, bass: 'drive', drums: 'battle' },
  },
  abyss: {
    // The Gloam beneath the world: before the sun gave things edges.
    bpm: 58, chords: ['Cm', 'Cm', 'Db', 'Db', 'Bbm', 'Bbm', 'G', 'G'],
    melody: 'g5:16 ab5:8 g5:8 f5:16 db5:16 bb4:12 c5:4 b4:16 r:16 r:16',
    inst: { melody: 'bell' },
    style: { pad: true, padVol: 0.9, drums: 'heartbeat', bass: 'half' },
  },
};
