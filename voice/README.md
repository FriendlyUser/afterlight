# Voice lines (optional)

Afterlight ships with no recorded dialogue: characters "speak" in typing blips, each
in their own timbre (`src/data/voices.js`). This folder is where recordings go if you
ever want them. Nothing in the game generates speech; it only plays files it finds here.

## How a line finds its recording

Every line of dialogue has a stable id, `<speaker>/<12 hex>`, made from who says it and
its spoken text (timing tags like `{wait=0.4}` and `*markup*` don't count). When a line
comes up, the game looks its id up in `voice/manifest.json` and, if it is listed, plays
that file instead of the blips. The music ducks under the voice, a new line cuts the
previous one off, and with **Settings → Auto-Advance Text** on, the scene moves along
as each recording ends. **Settings → Voice Volume** appears once a pack is installed.

## Adding recordings

1. `python3 tools/voice.py export` writes `voice/lines.csv`: every line the scripts
   state outright (about 7,000 lines, 88,000 words), with columns
   `id, speaker, text, kind, file, uses, source`. `file` is where that line's recording
   belongs, e.g. `voice/wren/16a51049c75d.ogg`.
2. Record or generate audio for the lines you want (any subset works) and save each
   as its `file`. `.ogg`, `.mp3`, `.m4a`, `.wav`, `.opus`, `.webm` and `.flac` are accepted;
   what plays depends on the browser (Ogg Vorbis and MP3 are safe everywhere current).
3. `python3 tools/voice.py manifest` rebuilds `voice/manifest.json` from the files
   present and reports any that match no line.

`npm run build` copies the manifest and the recordings into `dist/voice/`.

The CSV is the natural input for a batch job against a text-to-speech service: one
request per row (`speaker` picks the voice, `text` is what to say), saved to `file`.

## Things to know

- **Editing a line changes its id**, and its old recording stops matching
  (`tools/voice.py manifest` lists such orphans). To pin a recording to a line whatever
  its text, give the line an explicit id: `{ text: '…', voice: 'wren/kindling_oath' }`,
  and save the file as `voice/wren/kindling_oath.ogg`.
- **Lines built at run time are not in the CSV** (about 114: template strings with
  `${…}`, lines held in variables). Use `{gold}`, `{var:name}`, `{item:id}` and
  `{name:id}` in a plain string instead of a template string to keep the text fixed, or
  give the line an explicit `voice` id.
- Wordless beats (`...`) and choice-menu options are never voiced. Battle barks (boss
  taunts shown in the battle message bar) are not routed through this yet.
- The same words by the same speaker share one recording wherever they appear
  (`uses` in the CSV).
- Narration is the speaker `narrator`; a speaker shown as `???` is `unknown`.
