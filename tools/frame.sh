#!/bin/bash
# Usage: tools/frame.sh "<params>" out.jpg [virtual_ms]
#   e.g. tools/frame.sh "map=port_gale&x=10&y=19&party=ilse,bram&battle=c2_thornes_pair&bg=town" battle.jpg
# Grabs the rendered WebGL frame (3D scene only, no HTML UI) via tests/frame.test.js.
# Use this for battles: plain headless screenshots show the UI over a black canvas.
PARAMS="$1"; OUT="${2:-frame.jpg}"; BUDGET="${3:-60000}"
RUN="af_$$_$RANDOM"
WIN_DIR='C:\Users\Public\af_runs'
mkdir -p /mnt/c/Users/Public/af_runs
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader \
  --user-data-dir="$WIN_DIR\\$RUN" --window-size=1280,720 --virtual-time-budget=$BUDGET \
  --dump-dom "http://localhost:8765/index.html?test=frame&sim=240&dtmax=0.25&$PARAMS" 2>/dev/null \
  | python3 -c "
import sys,re,base64
s=sys.stdin.read()
m=re.search(r'<pre id=\"frame\">data:image/jpeg;base64,([^<]*)<',s)
if m: open(sys.argv[1],'wb').write(base64.b64decode(m.group(1))); print('saved', sys.argv[1])
else: print('frame.sh: no frame captured', file=sys.stderr)
" "$OUT"
rm -rf "/mnt/c/Users/Public/af_runs/$RUN"
