# Writing review and line edit (2026-11-10)

Every player-facing string in the game was read and line-edited: 8,912 strings, about
113,500 words. **553 strings changed (6%)**, in 73 files. No scene, fact, name, price or
number was changed on purpose except the continuity fixes listed below.

The brief was `docs/STYLE.md`: a line edit, not a rewrite. Objectives and quest-log text
were left out, because the objective tracker matches on them.

## Verdict

The writing was already good, and the edit confirms it: nineteen lines in twenty came
back untouched. The voices are distinct and hold for the whole game (Ilse's lists,
Bram's "Tactically / Strategically", Sable's literal questions with no contractions,
Cassian's calm). The big scenes needed nothing: the Lantern scene and Ysolde's last
lines, Mercy, Halvard's bell, the Remnants, both endings and the epilogue. Examine text
and the bestiary are specific and funny.

What needed work was small and repeated, which is what a line edit is for.

## What changed

| Part | Covers | Strings | Changed |
|---|---|---|---|
| 1 | Prologue to Thistledown | 913 | 37 |
| 2 | Aurenne, the Undercroft, the road south | 1,171 | 68 |
| 3 | Greyspine, the desert, Mirefen | 1,188 | 72 |
| 4 | Mirefen props, the Sundering, the Shards | 1,045 | 71 |
| 5 | Shards props, ruined Aurenne, Kiteholm | 884 | 47 |
| 6 | The Roost, the Spire, the Halcyon | 1,063 | 58 |
| 7 | The Remnants, Evernoon | 1,189 | 53 |
| 8 | Finale, endings, epilogue, post-game, side quests | 932 | 34 |
| 9 | Item, Art, Support, status and crest descriptions | 527 | 85 |
| | Continuity and markup fixes, last spelling sweep | | 32, some on lines already edited |

By kind: 241 lines of dialogue, 122 of narration, 123 descriptions, 29 signs and examined
things, 19 journal entries, 19 others.

### The recurring problems

- **British spellings in an American-spelled script** (about 120 lines): grey, colour,
  harbour, armour, travelled, labelled, theatre, moustache, "any more". Proper names keep
  their spelling (Greyspine, the Grey Sister).
- **Sable using contractions** (about 20 lines). She never does; it is half of her voice. Where
  her label speaks as Lysa, the contractions are deliberate and stayed.
- **Lines opening on "..."** (about 450 in the script). Most are real pauses. About 70
  were trimmed where two sat back to back, or a stage direction, a scripted wait or the
  narration already gave the pause.
- **Lines that say it twice** (about 50): a sentence restating the one before, narration
  explaining a joke the dialogue was about to make, a journal entry ending on its own
  moral.
- **The same phrase from two mouths** (about 35): one of each pair varied. "Three
  things" stays Ilse's; Fennick no longer borrows it just before the game uses it to
  identify her.
- **Directions without a place** (about 30): a place name, a compass point or a landmark
  added, each checked against the map.
- **Small slips**: past-tense sentences inside present-tense narration, periods outside
  closing quotes, spaced cut-off dashes, `*gold*` markup used for stress (18 lines, now
  italics).

### Examples

| Was | Now |
|---|---|
| Marit's things are under the third one. | Marit's things are under the third one, farthest west. |
| Sluice gates have wheels. Find the wheels. | Sluice gates have wheels. One west, one east. |
| Three are still ticking. | Three are still ticking: west, east, and up in the gallery. |
| …its wick trimmed and waiting, as if someone means to come back. | …its wick trimmed and waiting. |
| …like sparks from a fire. Like fireflies, leaving a jar. | …like fireflies leaving a jar. |
| It is not forgiveness. It is something smaller than that. But it is not nothing. | It is not forgiveness. But it is not nothing. |
| Sable: I don't know. I didn't ask to. | Sable: I do not know. I did not ask to. |
| …the way you find a light switch in your own house | …the way you find the latch of your own door in the dark |
| First Strike: Act sooner at the start of battle; more ambushes. | …; more preemptive strikes. |
| …may blind, and you drink 25% of the harm. | …may blind, and you heal for 25% of the damage. |

### Descriptions

Descriptions got the heaviest pass (16%), nearly all of it consistency, so the same
mechanic reads the same way everywhere. The wording is now recorded in `docs/STYLE.md`:
"all foes", "the party", "may slow" but "may inflict Doom", "act again soon / later",
"heal for N% of the damage", "up / down sharply", "pierces N% of DEF", "critical rate",
"(scales with item power)", and status descriptions in the third person.

One of these fixed a real misreading: First Strike promised "more ambushes", and in
battle "Ambushed!" is what happens when the enemy gets the jump on you.

## Continuity fixed

Each of these contradicted the scene or the map next to it, so they were corrected:

- The brooch journal said Ilse denied crying; in the scene it is Nana.
- Ilse credited Bram with the "unharmed" remark about Thorne; Mags made it.
- The soldiers came to the quarry "a fortnight back" in one line and "last week" in another.
- The Pilgrim Road ran east of Aurenne in one line; everywhere else, and on the map, south.
- The tuning forks: six leave Aurenne (five Keepers and a spare), and five are left after
  Halvard throws his away. Three lines said five, five and seven.
- Fourteen people were rescued from the Undercroft; one list added up to fifteen.
- Bram ties the knot twice in the scene; the journal said three tries.
- Mother Osk's black veins reached her elbow in one line and her shoulder in the next.
- The voices in the night came "down the hill, carried up from the Lantern"; the Lantern
  is up the hill.
- "Miners call it the Foreman": the Roost has scrappers, and the scene and bestiary say so.

## Needs your decision

These were found and **not changed**, because fixing them means choosing a fact.

**Story**

- Pell greets Wren in Keelhaven in chapter 6, and is a long-term Ward patient in Aurenne,
  astonished to see her, in chapter 7.
- Mags introduces herself as a stranger in chapter 11, though she is the Halcyon's
  mechanic from chapter 9; the same passage makes Nell the engineer.
- Corvin's lost years: "eighteen years ago" in the Kingfisher scenes, "twelve" in Evernoon.
- The Spire's shard reads as an eighth piece; later lines say seven, one for each Lantern.
- The Unmoored slid into the abyss, yet salvagers later look at its bones.
- "Everyone who goes in comes out smiling" against "nobody comes out" (the Spire).
- Evernoon "will not wait long", followed by several lines saying take your time.
- Sable's "I do not have a ribbon" contradicts Lysa's ribbon if her Rite is done; Wren's
  "I never asked her... now I can't" ignores the talk with Ysolde.
- Vasha gave Garrick her stone "three weeks ago", but he left Mirefen only days ahead of
  the party.
- Dace watched Bram freeze from "the stands" at "the Trial"; the Vigil is one night alone
  on the pass.
- Four days or two nights since Sable washed up; twenty-two kites or twenty; the Ember
  Ward as a "cathedral" or the Bellwrights' Hall; Keelhaven two bridges east or farther;
  gloam-rot gray or violet.
- Ruddock's barge is west at the Lip and the Benediction is east.
- "Forty" is the game's favorite number: beds, soldiers and years, dozens of times.

**Names used twice**

Rook (three people), Wynn, Quill, Nim, Wick, Marigold, Orrin (Sexton Orrin and Orrin
Vey), Mira (a soldier's daughter and the child at the new Kindling), Doran / Dorran,
Tam / Tamm. Pip's speaker label shows before he is named; Lysa says "Cassian" in the
post-game but "Cass" in Evernoon.

**Voice**

- "Mum" is said by everyone except Wren (15 lines: Wick, Pip, Bram, Squire Venn and
  others); Wren says "Mom". It reads as a mainland habit and was left; say the word and
  it becomes "Mom" throughout.
- "Draught" for medicine was kept as fantasy register (4 lines).

**Descriptions that disagree with the data** (for a balance or data pass, not a wording one)

- Skill descriptions that state no effect, no target or no amount: about 40, mostly enemy skills
  (for example 1337, 1698–1703 and 3488 in the edit's numbering; the full lists are in
  the part 2, 4 and 9 notes).
- "Weaknesses first" on three Arts, where the code picks a weakness only half the time.
- Three effects that read as certain but are a chance; three two-stage stat changes not
  marked "sharply".
- "Start battles Veiled" against "Start battles with Veil (dodge two attacks)".

The numbered notes behind this list are kept outside the repo, in
`/home/david/claude_space/afterlight-text-pass/` (`review_01.md` … `review_09.md`).

## Not tested

Only the typecheck was run after the edit (clean). No test quotes a changed line, but
the full suite has not been run since the dialogue, battle-feel, skip and hint work.
Changed lines also change their voice-line ids; no recordings exist yet, so nothing is
orphaned.

## Doing it again

`python3 tools/text_pass.py extract DIR` writes the script as numbered pages; an editor
writes `{"n", "new"}` lines; `check` validates them and `apply` rewrites only the string
literals. See `docs/STYLE.md` for the brief.
