#!/bin/bash
# Usage: tools/make_saves.sh [-j N] [test ...]
# Plays the story tests headlessly with ?savepoints and turns what they pass through
# into save files in saves/ (one per chapter start, first arrival in each outdoor
# area, and where each test ends), plus saves/README.md listing them. With no tests
# named, runs the whole story line from the prologue to the post-game. N tests at a
# time (default 3; more than 3 headless Chromes can stall WSL).
# Needs the dev server: python3 -m http.server 8765 in the project root.
cd "$(dirname "$0")/.."
JOBS=3
if [ "$1" = "-j" ]; then JOBS=$2; shift 2; fi
TESTS=("$@")
if [ ${#TESTS[@]} -eq 0 ]; then
  TESTS=(prologue ch2 ch2b ch3 ch4a ch4a_caverns ch4a_mountain ch4a_finale ch4b ch4b_verdance ch4b_sky ch4b_sky2
    ch5 ch6 ch7 ch8 ch9a ch9b ch9c ch10a ch10b ch11 ch11b ch11c ch11d ch12 postgame)
fi
mkdir -p saves/raw /mnt/c/Users/Public/af_runs

one() {
  local t=$1 run="af_$$_${RANDOM}_$1"
  local win='C:\Users\Public\af_runs'
  "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader \
    --user-data-dir="$win\\$run" --window-size=1280,720 --virtual-time-budget=2400000 \
    --dump-dom "http://localhost:8765/index.html?test=$t&sim=240&dtmax=0.25&savepoints=1" 2>/dev/null \
    | python3 -c "
import sys, re, html, json
s = sys.stdin.read()
t = re.search('<title>([^<]*)', s)
status = 'PASS' if t and '| PASS' in t.group(1) else 'FAIL'
m = re.search(r'<pre id=\"savepoints\">([^<]*)</pre>', s)
points = json.loads(html.unescape(m.group(1))) if m else []
json.dump(points, open('saves/raw/$t.json', 'w'))
print(f'$t: {status}, {len(points)} save points')
"
  rm -rf "/mnt/c/Users/Public/af_runs/$run"
}
export -f one
printf "%s\n" "${TESTS[@]}" | xargs -P "$JOBS" -I{} bash -c 'one {}'
python3 tools/make_saves.py
