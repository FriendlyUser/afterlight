#!/bin/bash
# Usage: tools/shot.sh "<url path+query>" [out.png] [wait_ms] [WxH]
# Screenshots the game with headless Windows Chrome. Each run uses its own
# output file and browser profile so parallel runs never collide.
URL="http://localhost:8765/$1"
OUT="${2:-shot.png}"
WAIT="${3:-6000}"
SIZE="${4:-1280,720}"
RUN="af_$$_$RANDOM"
WIN_DIR='C:\Users\Public\af_runs'
mkdir -p /mnt/c/Users/Public/af_runs
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist \
  --user-data-dir="$WIN_DIR\\$RUN" --window-size=$SIZE --virtual-time-budget=$WAIT --run-all-compositor-stages-before-draw \
  --screenshot="$WIN_DIR\\$RUN.png" "$URL" >/dev/null 2>&1
cp "/mnt/c/Users/Public/af_runs/$RUN.png" "$OUT" 2>/dev/null || echo "shot.sh: no screenshot produced" >&2
rm -rf "/mnt/c/Users/Public/af_runs/$RUN" "/mnt/c/Users/Public/af_runs/$RUN.png"
