#!/bin/bash
# Usage: tools/test.sh <testname> [virtual_ms]  — runs tests/<name>.test.js headlessly.
# Each run gets its own Chrome profile so parallel runs never collide.
# Env: SIM=<n> renders every n-th frame (default 60); EXTRA='only=side_' appends URL params.
NAME="$1"; BUDGET="${2:-120000}"; SIM="${SIM:-60}"; EXTRA="${EXTRA:+&$EXTRA}"
RUN="af_$$_$RANDOM"
WIN_DIR='C:\Users\Public\af_runs'
mkdir -p /mnt/c/Users/Public/af_runs
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader \
  --user-data-dir="$WIN_DIR\\$RUN" --window-size=1280,720 --virtual-time-budget=$BUDGET \
  --dump-dom "http://localhost:8765/index.html?test=$NAME&sim=$SIM&dtmax=0.25$EXTRA" 2>/dev/null \
  | python3 -c "
import sys,re,html
s=sys.stdin.read()
t=re.search('<title>([^<]*)',s)
print('TITLE:', html.unescape(t.group(1))[-1500:] if t else None)
e=re.search('<pre id=\"errlog\"[^>]*>([^<]*)',s)
print('ERRORS:', html.unescape(e.group(1)).strip()[:20000] if e and e.group(1).strip() else 'none')
"
rm -rf "/mnt/c/Users/Public/af_runs/$RUN"
