#!/usr/bin/env python3
"""Voice-line tooling for Afterlight. Nothing here generates audio: it lists what
could be voiced and registers the recordings you add.

  tools/voice.py export     voice/lines.csv — every line of dialogue the source
                            states outright, with its id and the file a recording
                            of it should be saved as
  tools/voice.py manifest   rebuild voice/manifest.json from the recordings found
                            under voice/ (and report ones that match no line)
  tools/voice.py check      print the ids of a few sample lines (the same ones
                            tests/lines.test.js checks, so the two stay in step)

A line's id is '<speaker>/<12 hex>': the speaker's name as a folder-safe key, and a
hash of who says it plus the spoken text (timing tags and *markup* removed). The
game derives the same id when the line comes up (src/script/Lines.js → voiceId), so
a file at voice/<id>.ogg plays with no change to any script. See voice/README.md.
"""
import csv
import json
import os
import re
import sys
from collections import Counter

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
VOICE_DIR = os.path.join(ROOT, 'voice')
SOURCES = ['src/story', 'src/data/maps', 'src/data/content']
AUDIO_EXT = ('.ogg', '.mp3', '.m4a', '.wav', '.opus', '.webm', '.flac')

# ---------------------------------------------------------------- ids (mirror src/script/Lines.js)


def spoken_text(text):
    """The words of a line as spoken: no timing tags, no markup, single spaces."""
    t = re.sub(r'\{(?:wait|speed|spd|shake|sfx)(?:=[^}]*)?\}', '', text)
    t = re.sub(r'\{\w+\|(.+?)\}', r'\1', t, flags=re.ASCII)
    t = re.sub(r'[*_]', '', t)
    return re.sub(r'\s+', ' ', t).strip()


def speaker_key(by):
    key = re.sub(r'[^a-z0-9]+', '_', (by or '').lower()).strip('_')
    return key or ('unknown' if by else 'narrator')


def fnv1a(data, seed):
    h = seed
    for b in data:
        h = ((h ^ b) * 0x01000193) & 0xFFFFFFFF
    return h


def voice_id(by, text):
    who = speaker_key(by)
    data = f'{who}|{spoken_text(text)}'.encode('utf-8')
    return f'{who}/{fnv1a(data, 0x811C9DC5):08x}{fnv1a(data, 0x9747B28C):08x}'[: len(who) + 13]


# 'Nana Brisa: text', '???: text', 'Wren (thought): text' in s.talk().
SPEAKER = re.compile(r"^((?:\?\?\?|[A-Z][\w'’-]*)(?: [A-Za-z][\w'’-]*){0,3})(?: \((?:thought|thinks|aside)\))?: (.+)$", re.S | re.ASCII)


def split_speaker(text):
    m = SPEAKER.match(text)
    return (m.group(1), m.group(2)) if m else (None, text)


# ---------------------------------------------------------------- a small JS reader

ESCAPES = {'n': '\n', 't': '\t', 'r': '\r', 'b': '\b', 'f': '\f', 'v': '\v', '0': '\0'}
DYNAMIC = object()  # a value the source doesn't state outright


def read_string(src, i):
    """Read the string literal starting at src[i] (a quote). -> (value | DYNAMIC, end)"""
    quote = src[i]
    out = []
    dynamic = False
    j = i + 1
    while j < len(src):
        ch = src[j]
        if ch == '\\':
            nxt = src[j + 1]
            if nxt == 'u' and src[j + 2] == '{':
                end = src.index('}', j)
                out.append(chr(int(src[j + 3:end], 16)))
                j = end + 1
            elif nxt == 'u':
                out.append(chr(int(src[j + 2:j + 6], 16)))
                j += 6
            elif nxt == 'x':
                out.append(chr(int(src[j + 2:j + 4], 16)))
                j += 4
            elif nxt == '\n':
                j += 2
            else:
                out.append(ESCAPES.get(nxt, nxt))
                j += 2
        elif ch == quote:
            return (DYNAMIC if dynamic else ''.join(out)), j + 1
        elif quote == '`' and ch == '$' and src[j + 1] == '{':
            dynamic = True  # skip the ${…} expression, braces and strings inside it included
            depth, j = 1, j + 2
            while depth:
                if src[j] in '\'"`':
                    _, j = read_string(src, j)
                    continue
                depth += {'{': 1, '}': -1}.get(src[j], 0)
                j += 1
        else:
            out.append(ch)
            j += 1
    raise ValueError('unterminated string')


TOKEN = re.compile(r'\s+|//[^\n]*|/\*.*?\*/|(?P<id>[A-Za-z_$][\w$]*|\d[\w.]*)|(?P<op>=>|\?\.|\?\?|&&|\|\||\.\.\.|[=!<>]=+|[-+*/%<>=!&|^~.])|(?P<p>[()\[\]{},:;?])', re.S)


def tokens_from(src, i, closer):
    """Tokens from src[i] up to the bracket that closes the one before src[i]."""
    out = []
    depth = 0
    while i < len(src):
        ch = src[i]
        if ch in '\'"`':
            value, j = read_string(src, i)
            out.append(('str', value, i))
            i = j
            continue
        m = TOKEN.match(src, i)
        if not m:
            i += 1
            continue
        if m.lastgroup == 'p':
            if ch in '([{':
                depth += 1
            elif ch in ')]}':
                if depth == 0:
                    return out, (i if ch == closer else -1)
                depth -= 1
            out.append(('p', ch, i))
        elif m.lastgroup:
            out.append((m.lastgroup, m.group(), i))
        i = m.end()
    return out, -1


PAIRS = {'(': ')', '[': ']', '{': '}'}


def split_top(tokens, seps):
    """Split a token list on top-level separators -> list of (separator_before, tokens)."""
    parts, cur, depth, last = [], [], 0, None
    for t in tokens:
        if t[0] == 'p' and t[1] in PAIRS:
            depth += 1
        elif t[0] == 'p' and t[1] in PAIRS.values():
            depth -= 1
        if depth == 0 and t[0] in ('p', 'op') and t[1] in seps:
            parts.append((last, cur))
            cur, last = [], t[1]
        else:
            cur.append(t)
    parts.append((last, cur))
    return parts


def wrapped(tokens, opener):
    """Is the whole list one bracketed group opened by `opener`?"""
    if len(tokens) < 2 or tokens[0][:2] != ('p', opener) or tokens[-1][:2] != ('p', PAIRS[opener]):
        return False
    depth = 0
    for k, t in enumerate(tokens):
        if t[0] == 'p' and t[1] in PAIRS:
            depth += 1
        elif t[0] == 'p' and t[1] in PAIRS.values():
            depth -= 1
            if depth == 0 and k < len(tokens) - 1:
                return False
    return True


def props(tokens):
    """{ key: value, … } -> { key: value tokens } (spreads and shorthand skipped)."""
    out = {}
    for _, part in split_top(tokens[1:-1], {','}):
        kv = split_top(part, {':'})
        if len(kv) >= 2 and len(kv[0][1]) == 1 and kv[0][1][0][0] in ('id', 'str') and isinstance(kv[0][1][0][1], str):
            out[kv[0][1][0][1]] = part[len(kv[0][1]) + 1:]
    return out


NODE_KEYS = ('text', 'narrate', 'lines', 'pick', 'ask', 'options', 'set', 'run')


class Sink:
    def __init__(self):
        self.rows = []      # (speaker | None, text, kind, source)
        self.dynamic = Counter()

    def line(self, by, text, kind, source):
        if by is DYNAMIC or text is DYNAMIC:
            self.dynamic[source.split(':')[0]] += 1
        elif re.search(r'[^\W_]', spoken_text(text)):  # '...' and other wordless beats have nothing to voice
            self.rows.append((by, text, kind, source))


def literal(tokens):
    """A lone string / null -> its value; anything else -> DYNAMIC."""
    if len(tokens) == 1 and tokens[0][0] == 'str':
        return tokens[0][1]
    if len(tokens) == 1 and tokens[0][:2] == ('id', 'null'):
        return None
    return DYNAMIC


def lines_from(tokens, by, sink, kind, source, talk=False, loose=False):
    """Collect the lines an expression in "line position" can say."""
    while wrapped(tokens, '('):
        tokens = tokens[1:-1]
    if not tokens:
        return
    # cond ? a : b — either branch may be spoken; the condition says nothing.
    parts = split_top(tokens, {'?'})
    if len(parts) > 1:
        rest = [t for _, p in parts[1:] for t in p + [('p', '?', 0)]][:-1]
        depth = q = 0
        for k, t in enumerate(rest):
            if t[0] == 'p' and t[1] in PAIRS:
                depth += 1
            elif t[0] == 'p' and t[1] in PAIRS.values():
                depth -= 1
            elif depth == 0 and t[:2] == ('p', '?'):
                q += 1
            elif depth == 0 and t[:2] == ('p', ':'):
                if q == 0:
                    lines_from(rest[:k], by, sink, kind, source, talk, loose)
                    lines_from(rest[k + 1:], by, sink, kind, source, talk, loose)
                    return
                q -= 1
        sink.line(DYNAMIC, DYNAMIC, kind, source)
        return
    for sep in ({'||', '??'}, {'&&'}):
        parts = split_top(tokens, sep)
        if len(parts) > 1:
            for _, p in (parts if '||' in sep else parts[-1:]):
                lines_from(p, by, sink, kind, source, talk, loose)
            return
    if len(tokens) == 1 and tokens[0][0] == 'str':
        text = tokens[0][1]
        if text is not DYNAMIC and talk:
            who, text = split_speaker(text)
            sink.line(who, text, kind if who else 'narrate', source)
        else:
            sink.line(by, text, kind, source)
    elif len(tokens) == 1 and tokens[0][0] == 'id' and tokens[0][1] in ('null', 'undefined', 'false', 'true'):
        pass
    elif wrapped(tokens, '['):
        for _, el in split_top(tokens[1:-1], {','}):
            lines_from(el, by, sink, kind, source, talk, loose)
    elif wrapped(tokens, '{'):
        node = props(tokens)
        if loose and not any(k in node for k in NODE_KEYS):
            for value in node.values():  # a helper's own table, e.g. phased({ before: […], after: […] })
                lines_from(value, by, sink, kind, source, talk, loose)
            return
        if 'by' in node:
            by, talk = literal(node['by']), False
        if 'narrate' in node:
            lines_from(node['narrate'], None, sink, 'narrate', source)
        for key in ('text', 'lines'):
            if key in node:
                lines_from(node[key], by, sink, kind, source, talk, loose)
        if 'pick' in node and wrapped(node['pick'], '['):
            for _, branch in split_top(node['pick'][1:-1], {','}):
                lines_from(branch, by, sink, kind, source, talk, loose)
        if 'options' in node and wrapped(node['options'], '['):
            for _, option in split_top(node['options'][1:-1], {','}):
                if wrapped(option, '{') and 'lines' in props(option):  # an option's own text is a menu label
                    lines_from(props(option)['lines'], by, sink, kind, source, talk, loose)
    elif loose and tokens[0][0] == 'id' and len(tokens) > 2 and tokens[1][:2] == ('p', '(') and wrapped(tokens[1:], '('):
        # talk: helper('Name', lines…) — the first string names the speaker.
        args = [p for _, p in split_top(tokens[2:-1], {','})]
        if args and literal(args[0]) is not DYNAMIC:
            for arg in args[1:]:
                lines_from(arg, literal(args[0]), sink, kind, source, talk, loose)
        else:
            sink.line(DYNAMIC, DYNAMIC, kind, source)
    else:
        sink.line(DYNAMIC, DYNAMIC, kind, source)


CALL = re.compile(r'\b(?:s\d?|this)\.(say|narrate|think|talk)\s*\(')
TALK_KEY = re.compile(r'\btalk:\s*(?=[\[\'"`{a-zA-Z])')
NAME_KEY = re.compile(r"\bname:\s*(['\"])((?:\\.|(?!\1).)*)\1")


def extract(path, rel, sink):
    src = open(path, encoding='utf-8').read()
    line_of = lambda i: src.count('\n', 0, i) + 1

    for m in CALL.finditer(src):
        method = m.group(1)
        tokens, end = tokens_from(src, m.end(), ')')
        source = f'{rel}:{line_of(m.start())}'
        if end < 0:
            sink.line(DYNAMIC, DYNAMIC, method, source)
            continue
        args = [p for _, p in split_top(tokens, {','})]
        if method == 'narrate':
            lines_from(args[0], None, sink, 'narrate', source)
        elif method == 'talk':
            lines_from(args[0], None, sink, 'talk', source, talk=True)
        elif len(args) >= 2:
            lines_from(args[1], literal(args[0]), sink, method, source)

    for m in TALK_KEY.finditer(src):
        tokens, _ = tokens_from(src, m.end(), '}')
        value = split_top(tokens, {','})[0][1]
        if not value or value[0][:2] == ('p', '(') or value[0][:2] == ('id', 'async') or any(t[:2] == ('op', '=>') for t in value[:6]):
            continue  # a script: its s.say() calls are picked up above
        # The NPC's name: the nearest `name:` earlier in the same object.
        depth, k = 0, m.start() - 1
        while k >= 0 and not (src[k] == '{' and depth == 0):
            depth += {'}': 1, '{': -1}.get(src[k], 0)
            k -= 1
        names = NAME_KEY.findall(src[max(k, 0):m.start()])
        by = read_string(names[-1][0] + names[-1][1] + names[-1][0], 0)[0] if names else DYNAMIC
        lines_from(value, by, sink, 'npc', f'{rel}:{line_of(m.start())}', loose=True)


# ---------------------------------------------------------------- commands


def collect():
    sink = Sink()
    for folder in SOURCES:
        base = os.path.join(ROOT, folder)
        for name in sorted(os.listdir(base)):
            if name.endswith('.js'):
                extract(os.path.join(base, name), f'{folder}/{name}', sink)
    lines = {}  # id -> row
    clashes = []
    for by, text, kind, source in sink.rows:
        vid = voice_id(by, text)
        prev = lines.get(vid)
        if prev and (speaker_key(prev['speaker']), spoken_text(prev['text'])) != (speaker_key(by), spoken_text(text)):
            clashes.append((vid, prev['source'], source))
        elif prev:
            prev['uses'] += 1
        else:
            lines[vid] = {'id': vid, 'speaker': by or '', 'text': spoken_text(text), 'kind': kind, 'source': source, 'uses': 1}
    return lines, sink, clashes


def cmd_export():
    lines, sink, clashes = collect()
    os.makedirs(VOICE_DIR, exist_ok=True)
    out = os.path.join(VOICE_DIR, 'lines.csv')
    with open(out, 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['id', 'speaker', 'text', 'kind', 'file', 'uses', 'source'])
        for row in sorted(lines.values(), key=lambda r: (r['source'].split(':')[0], int(r['source'].split(':')[1]), r['id'])):
            w.writerow([row['id'], row['speaker'], row['text'], row['kind'], f"voice/{row['id']}.ogg", row['uses'], row['source']])
    speakers = Counter(speaker_key(r['speaker']) for r in lines.values())
    words = sum(len(r['text'].split()) for r in lines.values())
    print(f'{len(lines)} lines ({words} words) from {len(speakers)} speakers -> {os.path.relpath(out, ROOT)}')
    print('most lines: ' + ', '.join(f'{k} {n}' for k, n in speakers.most_common(8)))
    dyn = sum(sink.dynamic.values())
    if dyn:
        print(f'{dyn} lines are built at run time (a template string, a variable): the source does not state their text,')
        print('  so they are not listed. Give such a line a fixed id with { text, voice: "id" } to voice it.')
    for vid, a, b in clashes:
        print(f'ID CLASH {vid}: {a} and {b} — give one of them an explicit voice id')
    return 1 if clashes else 0


def cmd_manifest():
    found = {}
    for folder, _, files in os.walk(VOICE_DIR):
        for name in files:
            stem, ext = os.path.splitext(name)
            if ext.lower() in AUDIO_EXT:
                rel = os.path.relpath(os.path.join(folder, name), VOICE_DIR).replace(os.sep, '/')
                found[rel[: -len(ext)]] = rel
    manifest = {'format': 'afterlight-voice', 'version': 1, 'lines': dict(sorted(found.items()))}
    with open(os.path.join(VOICE_DIR, 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=1, ensure_ascii=False)
        f.write('\n')
    lines, _, _ = collect()
    orphans = sorted(set(found) - set(lines))
    print(f'{len(found)} recordings -> voice/manifest.json ({len(set(found) & set(lines))} of {len(lines)} listed lines voiced)')
    if orphans:
        print(f'{len(orphans)} recordings match no listed line (text edited since? or an explicit voice id):')
        for o in orphans[:20]:
            print(f'  {found[o]}')
    return 0


SAMPLES = [
    ('Wren', 'There — in the pool! Something silver.'),
    ('Nana Brisa', "Oh, you poor duck."),
    (None, 'The Lantern _gutters_.{wait=0.6} For one heartbeat the hall goes dark.'),
    ('???', "I don't have one."),
]


def cmd_check():
    for by, text in SAMPLES:
        print(voice_id(by, text), '|', spoken_text(text))
    return 0


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    run = {'export': cmd_export, 'manifest': cmd_manifest, 'check': cmd_check}.get(cmd)
    if not run:
        print(__doc__)
        sys.exit(2)
    sys.exit(run())
