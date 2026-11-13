"""Turn the save points the story tests passed through (saves/raw/<test>.json, from
tools/make_saves.sh) into named save files in saves/ and an index, saves/README.md.

Keeps, in story order: every chapter start, the first arrival in each outdoor area of a
chapter, and where each test ends, one file per (chapter, area). Names sort in play
order: ch05_02_c5_tidecaves.json is the second save point of Chapter 5; pg_ files are
the post-game.
"""
import itertools
import json
import os
import re

ROOT = os.path.join(os.path.dirname(__file__), '..')
RAW = os.path.join(ROOT, 'saves', 'raw')
OUT = os.path.join(ROOT, 'saves')

STORY = ['prologue', 'ch2', 'ch2b', 'ch3', 'ch4a', 'ch4a_caverns', 'ch4a_mountain', 'ch4a_finale', 'ch4b',
         'ch4b_verdance', 'ch4b_sky', 'ch4b_sky2', 'ch5', 'ch6', 'ch7', 'ch8', 'ch9a', 'ch9b', 'ch9c', 'ch10a',
         'ch10b', 'ch11', 'ch11b', 'ch11c', 'ch11d', 'ch12', 'postgame']
CHAPTERS = {0: 'The Eve of Kindling', 1: 'The Kindling', 2: 'The Wider World', 3: 'City of Bells',
            4: 'The Pilgrim Road', 5: 'The Last Sunset', 6: 'Afterlight', 7: 'The Mender of Ash',
            8: 'Children of the Wreck', 9: 'The Halcyon', 10: 'Lysa', 11: 'Seven Wounds', 12: 'Evernoon'}
WHY = {'chapter': 'Chapter start', 'arrival': 'Arrived', 'end': 'End of test segment'}
MARKUP = re.compile(r'\*([^*]+)\*|_([^_]+)_|\{[a-z]+=[^}]*\}')


# The top of each chapter's level range (its content pack's header) plus two: some story
# tests over-level the party so auto-battle can't fail; a save shouldn't.
LEVEL_CAP = {0: 3, 1: 6, 2: 13, 3: 18, 4: 35, 5: 37, 6: 41, 7: 45, 8: 49, 9: 52, 10: 58, 11: 72, 12: 82}


def cap_levels(rec, ch, postgame):
    """Bring over-leveled characters down to the chapter's cap, at full HP and MP."""
    cap = None if postgame else LEVEL_CAP.get(ch)
    if cap is None:
        return
    for c in rec['data']['characters'].values():
        if c.get('level', 1) > cap:
            c['level'], c['exp'] = cap, 0
            c.pop('hp', None)  # missing HP/MP load as full (Character's constructor)
            c.pop('mp', None)
    party = rec['data']['party']
    if party:
        rec['summary']['level'] = rec['data']['characters'][party[0]]['level']


def test_chapter(test):
    """The chapter a story test plays: ch4a_caverns -> 4, prologue -> 0, postgame -> 12."""
    if test == 'prologue':
        return 0
    m = re.match(r'ch(\d+)', test)
    return int(m.group(1)) if m else 12


def plain(text):
    return MARKUP.sub(lambda m: m.group(1) or m.group(2) or '', text or '').replace('|', '/')


def main():
    for f in os.listdir(OUT):
        if f.endswith('.json'):
            os.remove(os.path.join(OUT, f))
    tests = [t for t in STORY if os.path.exists(os.path.join(RAW, f'{t}.json'))]
    tests += sorted(f[:-5] for f in os.listdir(RAW) if f.endswith('.json') and f[:-5] not in STORY)
    candidates = []
    for test in tests:
        for rec in json.load(open(os.path.join(RAW, f'{test}.json'))):
            p, flags = rec['point'], rec['data']['flags']
            if test == 'postgame' and not (flags.get('gameClear') or flags.get('act3')):
                continue  # captured before the test set up the post-game
            if test != 'prologue' and rec['summary'].get('level', 1) <= 1 and rec['summary'].get('party') == ['wren']:
                continue  # a new game's first room, before the test set up its chapter
            # Tests that start mid-story set up the state but not the chapter number:
            # a save gets the chapter its test plays, as a real save there would have.
            ch = max(p['chapter'], test_chapter(test))
            p['chapter'] = rec['data']['chapter'] = rec['summary']['chapter'] = ch
            section = 'pg' if test == 'postgame' else f'ch{ch:02d}'
            cap_levels(rec, ch, test == 'postgame')
            # A test's tail runs into the next chapter with its own party build (often
            # over-leveled for its fights): prefer the next chapter's own test there.
            own = test == 'postgame' or test_chapter(test) == ch
            candidates.append((section, p['map'], own, rec))
    own_keys = {(sec, m) for sec, m, own, _ in candidates if own}
    seen, kept = set(), []
    for section, mapid, own, rec in candidates:
        key = (section, mapid)
        if key in seen or (not own and key in own_keys):
            continue
        seen.add(key)
        kept.append((section, rec))
    order = {}
    for i, (section, _rec) in enumerate(kept):
        order.setdefault(section, i)
    kept.sort(key=lambda sr: order[sr[0]])  # chapters in story order, saves in play order within
    count = {}
    rows = []
    for section, rec in kept:
        p, s = rec['point'], rec['summary']
        count[section] = count.get(section, 0) + 1
        name = f"{section}_{count[section]:02d}_{p['map']}.json"
        with open(os.path.join(OUT, name), 'w') as fh:
            json.dump(rec, fh)
        party = ', '.join(x.capitalize() for x in s.get('party', []))
        rows.append((section, name, p.get('place') or p['map'], WHY.get(p['reason'], p['reason']), f"{party} (Lv {s.get('level', '?')})", plain(p.get('objective')), p['test']))
    lines = [
        '# Save points',
        '',
        'Save files at chapter starts and on arriving in each area, made by playing the story',
        'tests (`tools/make_saves.sh`; rerun it after story changes). They use default settings',
        '(Normal difficulty).',
        '',
        '**Open one directly:** with the dev server running (`python3 -m http.server 8765` in the',
        'project root), go to `http://localhost:8765/?load=saves/<file>`, for example',
        '`http://localhost:8765/?load=saves/ch05_01_lf_sunset.json`.',
        '',
        '**Or import it:** in the game, Load (or Save) → pick a slot → press **F** → Import, and',
        'choose the file. Then load that slot.',
        '',
        'The party, items and flags are what the story tests set up and played through, so they',
        'match a real playthrough closely but not exactly (side quests done along the way may differ).',
        "Levels are capped at the top of each chapter's intended range (plus two).",
        '',
    ]
    for section, group in itertools.groupby(rows, key=lambda r: r[0]):
        title = 'Post-game' if section == 'pg' else f'Chapter {int(section[2:])}: {CHAPTERS.get(int(section[2:]), "")}'
        lines += [f'## {title}', '', '| File | Where | When | Party | Objective |', '|---|---|---|---|---|']
        for _, name, place, why, party, objective, _test in group:
            lines.append(f'| [{name}]({name}) | {place} | {why} | {party} | {objective} |')
        lines.append('')
    with open(os.path.join(OUT, 'README.md'), 'w') as fh:
        fh.write('\n'.join(lines))
    print(f'{len(rows)} save files in saves/ (see saves/README.md)')


if __name__ == '__main__':
    main()
