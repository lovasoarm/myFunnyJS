#!/usr/bin/env bash
# verify.sh : filet de sécurité déterministe
# Usage: bash verify.sh <chemin_vers_ta_solution>
set -e
# --- [3.12] Vérification version Node (>=20) ---
NODE_MAJOR="$(node -p "process.versions.node.split(".")[0]" 2>/dev/null || echo 0)"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node >= 20 requis (détecté: $(node -v 2>/dev/null || echo absent)). Installe Node 20+ avant de lancer les drills."
  exit 1
fi
# --- fin check version ---
SOL="${1:-solution.js}"
if [ ! -f "$SOL" ]; then echo "Fournis ta solution: bash verify.sh path/to/solution.js"; exit 1; fi
PASS=0; FAIL=0
for i in 1 2 3; do
  IN="$(dirname "$0")/inputs/drill_${i}.txt"
  EXP="$(dirname "$0")/expected/drill_${i}.txt"
  OUT="$(node "$SOL" < "$IN" 2>/dev/null || true)"
  if [ "$OUT" = "$(cat "$EXP")" ]; then
    echo "drill $i  ✅"; PASS=$((PASS+1))
  else
    echo "drill $i  ❌"; FAIL=$((FAIL+1))
  fi
done
echo "---"; echo "PASS=$PASS FAIL=$FAIL"
