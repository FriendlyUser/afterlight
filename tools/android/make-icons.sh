#!/bin/bash
# Usage: tools/android/make-icons.sh
# Draws the app icon (tools/android/art/icon.html) and writes every size Android needs
# into android/app/src/main/res/mipmap-*, plus store/android/icon-512.png for the Play
# listing. Needs the dev server (python3 -m http.server 8765) and Windows Chrome.
cd "$(dirname "$0")/../.." || exit 1
RUN="af_$$_$RANDOM"
WIN_DIR='C:\Users\Public\af_runs'
mkdir -p /mnt/c/Users/Public/af_runs
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --user-data-dir="$WIN_DIR\\$RUN" \
  --window-size=1280,720 --virtual-time-budget=4000 --dump-dom "http://localhost:8765/tools/android/art/icon.html" 2>/dev/null \
  | python3 -c '
import sys, re, json, base64, html, os
m = re.search(r"<pre id=\"icons\">([^<]*)", sys.stdin.read())
if not m: sys.exit("make-icons: the icon page produced nothing (is the dev server running on 8765?)")
for path, url in json.loads(html.unescape(m.group(1))).items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "wb").write(base64.b64decode(url.split(",", 1)[1]))
    print(path)
'
rm -rf "/mnt/c/Users/Public/af_runs/$RUN"
