#!/usr/bin/env python3
"""A writing pass over the game's text that cannot touch its code.

Every string the player reads — dialogue, narration, thoughts, tips, choices, journal
entries, inspect and sign text, descriptions — is listed as a numbered screenplay.
An editor (a person or a model) answers with replacement text by number, and only
those string literals are rewritten in the source; nothing else in any file changes.

  tools/text_pass.py extract DIR [chunks]   write DIR/index.json and DIR/chunk_NN.txt
  tools/text_pass.py apply DIR              apply DIR/patch_*.jsonl, one JSON object per
                                            line: {"n": 123, "new": "The revised line."}
  tools/text_pass.py check DIR FILE         check one patch file before handing it in
  tools/text_pass.py show DIR [count]       print a sample of before / after pairs

Not listed, on purpose: objectives and quest text (src/data/objectives matches markers
to them by their wording), names of people, places, items and Arts, and anything built
at run time. Replacements are checked before they are applied: markup and {tokens}
must survive, and a line may not grow much. Rejected ones are reported, not applied.
"""
import json
import os
import re
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import voice  # the JS reader and the dialogue extractor  # noqa: E402

ROOT = voice.ROOT
DATA_FILES = [
    'src/data/items.js', 'src/data/skills.js', 'src/data/enemies.js', 'src/data/crests.js', 'src/data/passives.js',
    'src/data/statuses.js', 'src/data/characters.js', 'src/data/links.js', 'src/data/fish.js', 'src/data/mount.js',
    'src/data/waystones.js', 'src/data/difficulty.js', 'src/data/shops.js', 'src/story/chapters.js',
]
CALLS = re.compile(r'\b(?:s\d?|this)\.(system|journal|choice|confirm)\s*\(')
KEYS = re.compile(r'\b(text|desc|lockedText|bio|line|prompt)\s*:\s*(?=[\[\'"`(])')
SPOKEN = ('say', 'think', 'talk', 'npc')
LABEL = {'narrate': '(narration)', 'think': '(thought)', 'system': '(tip)', 'journal': '(journal)', 'choice': '(choice)',
         'confirm': '(choice)', 'prompt': '(prompt)', 'text': '(text)', 'desc': '(description)', 'lockedText': '(locked door)',
         'bio': '(bio)', 'line': '(line)'}


def story_order(rel):
    """Sort files so the screenplay reads roughly in the order it is played."""
    name = os.path.basename(rel)
    m = re.match(r'(?:ch|c)(\d+)', name)
    if m:
        chapter = int(m.group(1))
    elif re.match(r'(prologue|newGame|lanternfall|lf_|fishing)', name):
        chapter = 0
    elif re.match(r'(postgame|pg_)', name):
        chapter = 13
    elif rel.startswith(('src/story', 'src/data/maps', 'src/data/content')):
        chapter = 14  # side quests, the colosseum, the Lost Callings, the mount
    else:
        chapter = 15  # shared data: items, Arts, enemies…
    folder = 0 if rel.startswith('src/story') else 1 if 'maps' in rel else 2
    return (chapter, folder, name)


def spans(src):
    """Where the comments and the string literals are: ([comment spans], [string spans])."""
    comments, strings, i = [], [], 0
    while i < len(src):
        ch = src[i]
        if ch in '\'"`':
            try:
                _, j = voice.read_string(src, i)
            except (ValueError, IndexError):
                j = i + 1  # an apostrophe in a regex literal, say: step over it
            strings.append((i, j))
            i = j
        elif src.startswith('//', i):
            j = src.find('\n', i)
            j = len(src) if j < 0 else j
            comments.append((i, j))
            i = j
        elif src.startswith('/*', i):
            j = src.find('*/', i)
            j = len(src) if j < 0 else j + 2
            comments.append((i, j))
            i = j
        else:
            i += 1
    return comments, strings


def extract_file(path, rel):
    """Every editable string in one file -> rows sorted by position."""
    src = open(path, encoding='utf-8').read()
    sink = voice.Sink()
    voice.extract(path, rel, sink)
    line_of = lambda i: src.count('\n', 0, i) + 1
    comments, strings = spans(src)
    within = lambda pos, where: any(a <= pos < b for a, b in where)
    code = lambda pos: not within(pos, comments) and not within(pos, strings)  # real code, not a mention of it

    for m in CALLS.finditer(src):
        if not code(m.start()):
            continue
        method = m.group(1)
        tokens, end = voice.tokens_from(src, m.end(), ')')
        if end < 0:
            continue
        source = f'{rel}:{line_of(m.start())}'
        args = [p for _, p in voice.split_top(tokens, {','})]
        if method in ('system', 'journal') and args:
            voice.lines_from(args[0], None, sink, method, source)
        elif method == 'choice' and args:
            voice.lines_from(args[0], None, sink, 'choice', source)
        elif method == 'confirm':
            for arg in args[:3]:
                voice.lines_from(arg, None, sink, 'confirm', source)
    for m in KEYS.finditer(src):
        if not code(m.start()):
            continue
        tokens, _ = voice.tokens_from(src, m.end(), '}')
        value = voice.split_top(tokens, {','})[0][1]
        if value and not any(t[:2] == ('op', '=>') for t in value[:6]):
            voice.lines_from(value, None, sink, m.group(1), f'{rel}:{line_of(m.start())}')

    rows, seen = [], set()
    for (by, text, kind, source), tok in zip(sink.rows, sink.spots):
        if tok is None or len(tok) < 4 or tok[2] in seen or within(tok[2], comments):
            continue
        full = tok[1]
        if not full.endswith(text):
            continue
        if kind not in SPOKEN and kind != 'narrate' and re.fullmatch(r'[\w.:/#-]+', text):
            continue  # an id, a colour, a path: not prose
        seen.add(tok[2])
        rows.append({'file': rel, 'line': line_of(tok[2]), 'start': tok[2], 'end': tok[3], 'kind': kind,
                     'speaker': by or '', 'prefix': full[: len(full) - len(text)], 'text': text})
    rows.sort(key=lambda r: r['start'])
    # Objectives and quest text are matched by their wording elsewhere: never list them.
    protected = [(m.start(), voice.tokens_from(src, m.end(), ')')[1]) for m in re.finditer(r'\.(objective|quest)\s*\(', src)]
    return [r for r in rows if not any(a < r['start'] < b for a, b in protected)]


def collect():
    files = []
    for folder in voice.SOURCES:
        base = os.path.join(ROOT, folder)
        files += [f'{folder}/{n}' for n in os.listdir(base) if n.endswith('.js')]
    files += DATA_FILES
    rows = []
    for rel in sorted(set(files), key=story_order):
        path = os.path.join(ROOT, rel)
        if os.path.exists(path):
            rows += extract_file(path, rel)
    for n, r in enumerate(rows, 1):
        r['n'] = n
    return rows


def screenplay(rows):
    out, last = [], (None, 0)
    for r in rows:
        if r['file'] != last[0]:
            out.append(f"\n===== {r['file']} =====")
        elif r['line'] - last[1] > 14:
            out.append('')  # a gap in the source: usually another scene
        last = (r['file'], r['line'])
        who = f"{r['speaker']}: " if r['speaker'] and r['kind'] in SPOKEN + ('think',) else ''
        label = '(thought) ' if r['kind'] == 'think' else '' if who or r['kind'] in SPOKEN else LABEL.get(r['kind'], f"({r['kind']})") + ' '
        out.append(f"[{r['n']}] {label}{who}{r['text']}".replace('\n', '\\n'))
    return '\n'.join(out).strip() + '\n'


def cmd_extract(out_dir, chunks=6):
    rows = collect()
    os.makedirs(out_dir, exist_ok=True)
    words = [len(r['text'].split()) for r in rows]
    target = sum(words) / chunks
    # Cut at file boundaries where possible, so a chapter stays with one editor.
    groups, cur, acc = [], [], 0
    for i, r in enumerate(rows):
        boundary = cur and r['file'] != cur[-1]['file']
        if boundary and acc >= target * 0.92 and len(groups) < chunks - 1:
            groups.append(cur)
            cur, acc = [], 0
        cur.append(r)
        acc += words[i]
    groups.append(cur)
    for k, g in enumerate(groups, 1):
        for r in g:
            r['chunk'] = k
        with open(os.path.join(out_dir, f'chunk_{k:02d}.txt'), 'w', encoding='utf-8') as f:
            f.write(screenplay(g))
        files = sorted({r['file'] for r in g}, key=story_order)
        print(f"chunk_{k:02d}: lines {g[0]['n']}–{g[-1]['n']} ({len(g)} strings, {sum(len(r['text'].split()) for r in g)} words) "
              f"{os.path.basename(files[0])} … {os.path.basename(files[-1])}")
    with open(os.path.join(out_dir, 'index.json'), 'w', encoding='utf-8') as f:
        json.dump(rows, f, ensure_ascii=False)
    kinds = Counter(r['kind'] for r in rows)
    print(f"{len(rows)} strings, {sum(words)} words: " + ', '.join(f'{k} {n}' for k, n in kinds.most_common()))
    return 0


# ---------------------------------------------------------------- applying replacements

BRACES = re.compile(r'\{[^{}]*\}')


def brace_tokens(text):
    """{gold}, {wait=0.4} and so on must survive exactly; {red|words} must keep its colour."""
    return Counter(t if '|' not in t else t.split('|')[0] + '|' for t in BRACES.findall(text))


def problem(row, new):
    old = row['text']
    if not isinstance(new, str) or not new.strip():
        return 'empty'
    if '${' in new or '`' in new:
        return 'template syntax'
    if ('\n' in new) != ('\n' in old):
        return 'line breaks changed'
    if new[:1].isspace() != old[:1].isspace() or new[-1:].isspace() != old[-1:].isspace():
        return 'leading or trailing space changed'
    if brace_tokens(new) != brace_tokens(old):
        return 'a {token} was added, lost or altered'
    for mark in '*_':
        if new.count(mark) % 2:
            return f'unbalanced {mark} markup'
    limit = max(len(old) + 40, int(len(old) * 1.35), 60)
    if len(new) > limit:
        return f'too long ({len(new)} characters; limit {limit})'
    if row['kind'] in SPOKEN + ('narrate', 'think', 'system') and len(new) > 300:
        return 'longer than a dialogue box holds (300)'
    if row['prefix'] == '' and row['kind'] == 'talk' and voice.split_speaker(new)[0]:
        return 'now reads as "Speaker: text"'
    return None


def js_literal(text, quote):
    out = text.replace('\\', '\\\\').replace('\n', '\\n').replace(quote, '\\' + quote)
    if quote == '`':
        out = out.replace('${', '\\${')
    return quote + out + quote


def load_patches(out_dir):
    patches = {}
    for name in sorted(os.listdir(out_dir)):
        if not (name.startswith('patch_') and name.endswith('.jsonl')):
            continue
        for k, line in enumerate(open(os.path.join(out_dir, name), encoding='utf-8'), 1):
            line = line.strip()
            if not line:
                continue
            try:
                p = json.loads(line)
                patches[int(p['n'])] = (p['new'], name)
            except (ValueError, KeyError, TypeError):
                print(f'{name}:{k}: not a {{"n", "new"}} object — skipped')
    return patches


def cmd_apply(out_dir):
    rows = {r['n']: r for r in json.load(open(os.path.join(out_dir, 'index.json'), encoding='utf-8'))}
    patches = load_patches(out_dir)
    by_file, rejected, same = {}, [], 0
    for n, (new, name) in sorted(patches.items()):
        row = rows.get(n)
        if not row:
            rejected.append((n, name, 'no such line'))
        elif new == row['text']:
            same += 1
        elif problem(row, new):
            rejected.append((n, name, problem(row, new)))
        else:
            by_file.setdefault(row['file'], []).append((row, new))
    applied = 0
    for rel, edits in by_file.items():
        path = os.path.join(ROOT, rel)
        src = open(path, encoding='utf-8').read()
        for row, new in sorted(edits, key=lambda e: -e[0]['start']):
            literal = src[row['start']:row['end']]
            if voice.read_string(literal, 0)[0] != row['prefix'] + row['text']:
                rejected.append((row['n'], rel, 'the source changed since extract'))
                continue
            src = src[:row['start']] + js_literal(row['prefix'] + new, literal[0]) + src[row['end']:]
            applied += 1
        open(path, 'w', encoding='utf-8').write(src)
    print(f'{applied} strings rewritten in {len(by_file)} files; {same} unchanged; {len(rejected)} rejected')
    for n, where, why in rejected:
        print(f'  [{n}] {where}: {why}')
    with open(os.path.join(out_dir, 'applied.json'), 'w', encoding='utf-8') as f:
        json.dump({'applied': applied, 'rejected': rejected}, f, ensure_ascii=False, indent=1)
    return 0


def cmd_check(out_dir, name):
    """Would every replacement in one patch file be accepted? How much of its chunk changed?"""
    rows = {r['n']: r for r in json.load(open(os.path.join(out_dir, 'index.json'), encoding='utf-8'))}
    bad = changed = 0
    chunks = Counter()
    for k, line in enumerate(open(os.path.join(out_dir, name), encoding='utf-8'), 1):
        if not line.strip():
            continue
        try:
            p = json.loads(line)
            n, new = int(p['n']), p['new']
        except (ValueError, KeyError, TypeError):
            print(f'line {k}: not a {{"n": number, "new": "text"}} object')
            bad += 1
            continue
        row = rows.get(n)
        why = 'no such line number' if not row else None if new == row['text'] else problem(row, new)
        if why:
            print(f'[{n}] rejected: {why}')
            bad += 1
        elif new != row['text']:
            changed += 1
            chunks[row['chunk']] += 1
    for chunk, c in sorted(chunks.items()):
        total = sum(1 for r in rows.values() if r['chunk'] == chunk)
        print(f'chunk {chunk}: {c} of {total} strings changed ({100 * c / total:.0f}%)')
    print(f'{changed} acceptable replacements, {bad} rejected')
    return 1 if bad else 0


def cmd_show(out_dir, count=40):
    rows = {r['n']: r for r in json.load(open(os.path.join(out_dir, 'index.json'), encoding='utf-8'))}
    patches = [(n, new) for n, (new, _) in sorted(load_patches(out_dir).items()) if n in rows and new != rows[n]['text']]
    step = max(1, len(patches) // count)
    for n, new in patches[::step][:count]:
        r = rows[n]
        print(f"[{n}] {r['speaker'] or r['kind']}\n  - {r['text']}\n  + {new}{'   !! ' + problem(r, new) if problem(r, new) else ''}")
    print(f'{len(patches)} changed of {len(rows)} strings ({100 * len(patches) / len(rows):.0f}%)')
    return 0


if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) >= 2 and args[0] == 'extract':
        sys.exit(cmd_extract(args[1], int(args[2]) if len(args) > 2 else 6))
    if len(args) == 2 and args[0] == 'apply':
        sys.exit(cmd_apply(args[1]))
    if len(args) == 3 and args[0] == 'check':
        sys.exit(cmd_check(args[1], args[2]))
    if len(args) >= 2 and args[0] == 'show':
        sys.exit(cmd_show(args[1], int(args[2]) if len(args) > 2 else 40))
    print(__doc__)
    sys.exit(2)
