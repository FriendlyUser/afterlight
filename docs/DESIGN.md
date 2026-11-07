# Afterlight — Game Design

## Pillars
1. **A story about growing up** at the end of the world (see `STORY.md`). Every system
   echoes it: the Crest system is literally "you are not just one thing."
2. **2D-HD presentation**: pixel-art characters as lit billboards in miniature 3D
   dioramas, with bloom, tilt-shift depth of field, dynamic lights and weather.
3. **Tactical, readable battles**: you always see who acts next, what a foe is weak to
   (once discovered), and how close it is to Breaking.
4. **Customization with meaning**: 24 Crests, two at a time, plus Supports that persist
   across Crests — builds, not just levels.

## Exploration
- Free 8-way movement on tile maps with terraces, ramps, water, and occluding props that
  fade when you walk behind them. Run with Shift; switch the visible leader with Q/E.
- Random encounters with a visible danger orb; encounter rate is adjustable.
- Hearthstones heal and save; autosave on every map change; fast travel via the world map.
- Interactions: NPCs with portraits, chests, signs, inspect points (environmental lore),
  blockers (gates/rubble opened by story), fishing spots.

## Battle
- **Timeline (CTB):** each combatant's Action Value comes from Speed; quick Arts (delay
  < 1) return your turn sooner, heavy Arts later. Haste/Slow/Stasis/Quicken bend it.
- **Poise & Break:** each foe has a Poise shield. Hits matching a weakness (9 damage
  types: slash, pierce, blunt, fire, ice, bolt, wind, light, dark) chip it. At 0 the foe
  Breaks: it loses its next turn, is pushed back on the timeline and takes +50% damage.
- **Afterglow:** a shared 3-segment gauge filled by weakness hits, Breaks, crits and
  taking damage. Spend it on **Surge** (1–3 levels: +50% power per level and extra Poise
  damage) or **Link Arts** — duo/trio techniques between specific companions.
- Commands: Attack, primary Crest Arts, secondary Crest Arts, Items, Link Arts, Guard,
  Swap (bring in a reserve member), Flee. Auto-battle (F), battle speed and difficulty
  (Story/Normal/Hard) options.
- Personal skills: Wren *Resolve*, Ilse *Triage*, Bram *Bulwark*, Sable *Gloamtouch*,
  Pip *Pilfer*, Corvin *Gambit*.
- Status effects: poison, burn, sleep, silence, blind, stun, slow, charm, doom, berserk,
  haste, regen, protect, shell, reraise, veil, taunt, marked; stat stages ±3.

## Crests (classes)
- **Tier I — Callings:** Vanguard, Warden, Ranger, Rogue, Mender, Arcanist, Pugilist, Cantor.
- **Tier II — Braided** (need two Tier-I Crests at rank 5): Dawnknight, Runeblade,
  Nightblade, Sage, Beastcaller, Alchemist, Skylancer, Timewright, Duskdancer, Berserker.
- **Tier III — Legends** (story/post-game): Lanternkeeper, Gloamweaver, Starseer,
  Gambler, Sunforged, Afterlight.
- Each Crest has 10 ranks (CP from battle) alternating Arts and Supports, stat
  multipliers, weapon/armor proficiencies and a battle costume.
- Equip a **primary** (stats + Arts + gear rules) and a **secondary** (its Arts).
- **Supports** learned anywhere can be equipped with any Crest, within a point budget
  that grows with level. Mastering a Crest permanently grants +1% to all stats.

## Progression & economy
- Levels 1–99; enemy stats scale on a shared curve so chapters can be tuned per-enemy
  with multipliers. Reserve members earn half EXP/CP.
- Gear tiers 1–8 across the story plus unique ultimate weapons from character Rites.
- Shops per town; Crest Stones unlock base Crests for the whole party.
- Side activities: side quests (Journal log), fishing (16 species, angler rewards),
  bestiary completion, arena and the 30-floor Gloam Abyss in the post-game.

## Technical notes
- No build step, no external assets; everything (sprites, tiles, monsters, music, SFX)
  is generated at runtime.
- Content is data: ASCII-layer maps painted by `tools/mapkit.py`, scenes as async
  scripts against a small API, enemies/troops/bosses as tables plus AI scripts.
- Headless test harness drives scripted playthroughs, validates every cross-reference,
  exercises every skill, and simulates battles for balance.
