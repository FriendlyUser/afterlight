# Afterlight — writing style and the line-edit brief

How the game's text should read, and how to revise it without breaking it. For
anyone writing new scenes, and for an editing pass over the old ones
(`tools/text_pass.py`). The story, cast and plot are in `docs/STORY.md`.

## The voice

- **Short lines. Subtext over exposition.** People say less than they mean. Let them
  be funny when it is dark.
- **Specific over general.** "The bed smells of salt and old books", not "the room
  felt familiar". A named thing, a number, a habit.
- **Plain words.** A sixteen-year-old from a fishing island narrates this world. No
  purple, no fantasy-novel thesaurus. The strange things (the Gloam, the Lanterns)
  land harder for being described plainly.
- **Each speaker sounds like themselves** (see *Tone guide for dialogue* in
  `docs/STORY.md`): Wren fast, warm, a little too honest, "okay" when she isn't. Ilse
  dry, precise, lists. Bram big words slightly wrong, heart on sleeve. Sable short,
  literal, no contractions. Pip street slang and bravado with sudden kid moments.
  Corvin a drawl, deflection, endearments. Cassian kind, measured, always reasonable,
  never raises his voice. If two characters could swap a line, one of them has the
  wrong line.
- **Narration is second person or close on Wren, present tense, spare.** One image per
  line. It reports what is seen and heard; it does not explain what to feel.
- **Journal entries are Wren writing to herself:** first person, past tense, short,
  honest, often funnier than she means to be.
- **Tips speak to the player plainly:** what the thing is, then what to do. Bold the
  term being taught with `*asterisks*` once.
- **Descriptions (items, Arts, Supports, enemies) say what the thing does first.**
  Flavor comes second and stays under a dozen words. Numbers and effects must be
  exact.

## Conventions

- American spelling: harbor, color, armor, gray.
- Capitalized terms of the world: Crest, Kindling, Lantern, Keeper, Hierophant, the
  Choir, the Gloam, Afterglow, the Sundering, Remnant, Sun Shard, Art, Support.
- Markup: `*gold highlight*` for a name or term being introduced, `_italic_` for
  stress, sounds, letters and thoughts quoted inside narration, `{red|colored}`.
  Timing tags `{wait=0.4}` `{speed=0.5}` `{shake=0.3}` `{sfx=id}` never show.
  Tokens `{gold}` `{var:x}` `{item:id}` `{name:id}` are filled in by the game.
- An em dash with spaces for a break in thought — like this; no spaces for a cut-off
  line ("You read my—"). An ellipsis is three dots, and opens a line only for a real
  pause.
- A line of dialogue fits the box: aim for under 200 characters, never over 300.
- Stage directions are rare and go in italics in parentheses: `_(quietly)_`.
- Compass points are hyphenated: north-east, south-west.
- "saltglass" the material is lower case; Saltglass the town is capitalized.
- Wren says "Mom". Other children say "Mum"; that is the mainland's word, not a typo.
- Description wording, so one mechanic always reads the same way:
  - Targets: "one foe", "all foes", "random foes", "the party" (not "every foe",
    "everyone", "the whole party").
  - A status as a verb is lower case ("may slow", "may burn", "may stun"); as a noun it
    is capitalized ("may inflict Doom", "Immune to Slow").
  - Turn order: "act again soon" / "act again later"; "pushes the foe's turn back".
  - "heal for N% of the damage"; "pierces N% of DEF"; "STR up", "DEF down", and "up
    sharply" / "down sharply" for two stages; "strips its buffs"; "critical rate +N%";
    "(scales with item power)".
  - Status descriptions are in the third person: "Loses 8% HP each turn."

## The line-edit brief

The writing is already good. **This is a line edit, not a rewrite.** Most lines should
come back untouched. Change a line only when you can name what is wrong with it, and
when your version is clearly better, not just different. If in doubt, leave it.

Fix, in rough order of value:

1. **Unclear directions.** When a line tells the player where to go or what to do,
   it must be findable: a place name, a compass direction, a landmark. Keep every
   such fact exactly; make it easier to see.
2. **Lines that say it twice.** A sentence that restates the one before, narration
   that explains a joke or names a feeling the dialogue already showed, a closing
   line that sums up the scene.
3. **Tics.** A habit is a voice once and a tic the fifth time in a scene: lines
   opening on "...", three-beat endings ("X. Y. Z."), "not X — Y" reversals, a
   question the speaker answers themselves, stacked em dashes, every exchange ending
   on a punchline. Vary some; keep the ones that land.
4. **The wrong voice.** A line any character could have said. Sable using a
   contraction. Cassian losing his temper. Pip sounding thirty.
5. **Over-long lines.** Tighten anything past about 200 characters.
6. **Soft words.** Filler ("just", "really", "very", "a bit", "sort of"), hedges,
   adverbs propping up weak verbs, "suddenly", "seems to", "begins to".
7. **Slips.** Typos, doubled words, punctuation, a British spelling, a world term in
   lower case, a tense or person that wanders in narration.
8. **Descriptions** that hide what the thing does behind a joke, or are vague
   ("a powerful attack"). Keep every number and effect.

Do not:

- change what happens, who knows what, any name, number, place, direction, item,
  price or rule; add facts, lore or new jokes about things not in the scene;
- make lines longer on average, or smooth every rough edge: these are teenagers, a
  fishwife, a pirate;
- touch markup, tags or tokens except to keep them attached to the same words;
- "improve" a deliberately flat, odd or broken line: Sable's literalness, a child's
  grammar, a drunk, a memory that repeats, a villain's calm;
- rewrite a line whose exact words come back later (a refrain such as "One Crest.
  One life.", a callback, a promise quoted again). If you see the same words
  elsewhere in your pages, leave both alone.

Expect to change perhaps one line in six. A chunk where half the lines changed has
been rewritten, not edited.
