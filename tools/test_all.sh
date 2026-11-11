#!/bin/bash
# Runs every headless test one at a time and prints a PASS/FAIL line per test.
# Usage: tools/test_all.sh [pattern]   (regex filter on test names)
# Env: SIM=240 renders fewer frames (faster). Safe to edit tools/test.sh mid-run:
# the suite runs from a snapshot of it.
cd "$(dirname "$0")/.."
PATTERN="${1:-.}"
RUNNER=$(mktemp "${TMPDIR:-/tmp}/af_test_XXXX.sh"); cp tools/test.sh "$RUNNER"; trap 'rm -f "$RUNNER"' EXIT
declare -A BUDGET=( [validate]=40000 [systems]=120000 [battle_logic]=120000 [audio]=20000 [balance]=1500000 [c78_balance]=900000 [c78_view]=20000 [fightlog]=60000 [side_reach]=200000 )
for f in tests/*.test.js; do
  name=$(basename "$f" .test.js)
  [[ "$name" =~ $PATTERN ]] || continue
  b=${BUDGET[$name]:-2400000}
  start=$(date +%s)
  out=$(timeout 1200 bash "$RUNNER" "$name" "$b" 2>&1)
  secs=$(( $(date +%s) - start ))
  if echo "$out" | grep -q "| PASS"; then res="PASS"
  else res="FAIL — $(echo "$out" | grep -o 'FAIL[^|]*' | head -1) $(echo "$out" | grep -o 'ok: [^|]*' | tail -1)"; [ -z "$out" ] && res="FAIL — no output (timeout)"; fi
  printf "%-22s %-5ss %s\n" "$name" "$secs" "$res"
  echo "$out" | grep -A8 "^ERRORS:" | grep -v "^ERRORS: none" | head -8 | sed 's/^/      /'
done
