#!/bin/bash
# Usage: tools/console.sh "<url path+query>" [wait_ms]  — prints browser console output
URL="http://localhost:8765/$1"
WAIT="${2:-6000}"
"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --use-angle=swiftshader --enable-unsafe-swiftshader \
  --window-size=1280,720 --virtual-time-budget=$WAIT --enable-logging=stderr --v=0 --dump-dom "$URL" 2>&1 >/dev/null \
  | grep -E "CONSOLE|Uncaught|Error" | sed -E 's/.*CONSOLE\([0-9]+\)\] //' | grep -v "Missing value path" | head -40
