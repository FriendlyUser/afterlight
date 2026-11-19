#!/bin/bash
# Usage: tools/android/store-shots.sh [--preview] [name ...]
#
# Takes the Google Play listing pictures and writes them to store/android/:
#   screenshots/NN-<name>.jpg   1920 x 1080 (16:9), the size Play wants for games;
#                               the same files serve the phone, 7-inch and 10-inch slots
#   feature-graphic.jpg         1024 x 500
# With names, only those shots are retaken; --preview writes small ones to
# store/android/preview/ for choosing scenes. Needs the dev server
# (python3 -m http.server 8765) and Windows Chrome. Three browsers run at a time.
#
# A shot is either a page to open (a save file from saves/ is enough for most scenes)
# or a scene set up by tests/store_shots.test.js.
cd "$(dirname "$0")/../.." || exit 1

SHOTS=(
  "01-title|index.html?touch=1|9000"
  "02-town|index.html?touch=1&load=saves/ch02_01_port_gale.json|9000"
  "03-dialogue|index.html?touch=1&test=store_shots&shot=dialogue|12000"
  "04-battle|index.html?touch=1&test=store_shots&shot=battle|12000"
  "05-city|index.html?touch=1&load=saves/ch03_01_aurenne.json|9000"
  "06-crests|index.html?touch=1&test=store_shots&shot=crests|12000"
  "07-worldmap|index.html?touch=1&test=store_shots&shot=worldmap|12000"
  "08-frontier|index.html?touch=1&load=saves/ch04_10_c4a_frosthollow.json|9000"
)
FEATURE="feature-graphic|index.html?touch=0&test=store_shots&shot=feature|12000"

PREVIEW=0
[[ "$1" == "--preview" ]] && { PREVIEW=1; shift; }
CHROME="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
WIN_DIR='C:\Users\Public\af_runs'
LIN_DIR=/mnt/c/Users/Public/af_runs
mkdir -p "$LIN_DIR" store/android/screenshots store/android/preview

# take <name> <url> <wait_ms> <layout WxH> <scale> <out WxH> <out file>
take() {
  local name="$1" url="$2" wait="$3" layout="$4" scale="$5" out="$6" file="$7" run="af_$$_$RANDOM"
  "$CHROME" --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist \
    --user-data-dir="$WIN_DIR\\$run" --window-size="$layout" --force-device-scale-factor="$scale" --hide-scrollbars \
    --virtual-time-budget="$wait" --run-all-compositor-stages-before-draw --screenshot="$WIN_DIR\\$run.png" \
    "http://localhost:8765/$url" >/dev/null 2>&1
  [[ -s "$LIN_DIR/$run.png" ]] || { echo "store-shots: $name produced no picture" >&2; rm -rf "$LIN_DIR/$run"; return 1; }
  # The page can only read pictures the dev server serves: park the PNG in the repo for a moment.
  local tmp="store/android/.$run.png"
  cp "$LIN_DIR/$run.png" "$tmp"
  "$CHROME" --headless=new --user-data-dir="$WIN_DIR\\$run" --virtual-time-budget=6000 \
    --dump-dom "http://localhost:8765/tools/android/art/to-jpeg.html?src=/$tmp&w=${out%x*}&h=${out#*x}&q=0.93" 2>/dev/null \
    | python3 -c '
import sys, re, base64
m = re.search(r"<pre id=\"jpeg\" data-size=\"([^\"]*)\">([^<]*)", sys.stdin.read())
if not m: sys.exit("store-shots: could not convert " + sys.argv[1])
data = base64.b64decode(m.group(2).split(",", 1)[1])
open(sys.argv[1], "wb").write(data)
print("%s  (%s captured, %d kB)" % (sys.argv[1], m.group(1), len(data) // 1024))
' "$file"
  rm -rf "$tmp" "$LIN_DIR/$run" "$LIN_DIR/$run.png"
}

wanted() { [[ $# -eq 1 ]] && return 0; local n="$1"; shift; for w in "$@"; do [[ "$n" == *"$w"* ]] && return 0; done; return 1; }

jobs_running=0
for spec in "${SHOTS[@]}" "$FEATURE"; do
  IFS='|' read -r name url wait <<< "$spec"
  wanted "$name" "$@" || continue
  if [[ "$name" == feature-graphic ]]; then
    [[ $PREVIEW == 1 ]] && continue
    take "$name" "$url" "$wait" 1024,500 2 1024x500 "store/android/$name.jpg" &
  elif [[ $PREVIEW == 1 ]]; then
    take "$name" "$url" "$wait" 1600,900 0.6 960x540 "store/android/preview/$name.jpg" &
  else
    # A 16:9 phone lays the game out 1600 x 900; at 1.2 device pixels each that is 1920 x 1080.
    take "$name" "$url" "$wait" 1600,900 1.2 1920x1080 "store/android/screenshots/$name.jpg" &
  fi
  jobs_running=$((jobs_running + 1))
  if (( jobs_running >= 3 )); then wait; jobs_running=0; fi
done
wait
