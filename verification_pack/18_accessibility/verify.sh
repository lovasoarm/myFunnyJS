#!/usr/bin/env bash
# verify.sh : filet de securite deterministe (drills reels)
# Usage: bash verify.sh <chemin_vers_ta_solution.js>
set -e
# --- [3.12] Verification version Node (>=20) ---
NODE_MAJOR="$(node -p "process.versions.node.split(\".\")[0]" 2>/dev/null || echo 0)"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node >= 20 requis (detecte: $(node -v 2>/dev/null || echo absent)). Installe Node 20+ avant les drills."
  exit 1
fi
# --- fin check version ---
SOL="${1:-solution.js}"
if [ ! -f "$SOL" ]; then echo "Fournis ta solution: bash verify.sh path/to/solution.js"; exit 1; fi
HERE="$(cd "$(dirname "$0")" && pwd)"
PASS=0; FAIL=0
for i in 1 2 3; do
  IN="$HERE/inputs/drill_${i}.txt"
  EXP="$HERE/expected/drill_${i}.txt"
  OUT="$(node "$SOL" "$i" < "$IN" 2>/dev/null || true)"
  WANT="$(cat "$EXP")"
  if [ "$OUT" = "$WANT" ]; then
    echo "drill $i  OK"; PASS=$((PASS+1))
  else
    echo "drill $i  FAILED"
    echo "--- attendu ---"; echo "$WANT"
    echo "--- obtenu ---"; echo "$OUT"
    FAIL=$((FAIL+1))
  fi
done
echo "---"; echo "PASS=$PASS FAIL=$FAIL"
[ $FAIL -eq 0 ]
