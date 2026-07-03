#!/usr/bin/env bash
set -euo pipefail
# --- Verification version Node (>=20) ---
NODE_MAJOR="$(node -p "process.versions.node.split(\".\")[0]" 2>/dev/null || echo 0)"
if [ "$NODE_MAJOR" -lt 20 ]; then
  echo "Node >= 20 requis (detecte: $(node -v 2>/dev/null || echo absent)). Installe Node 20+ avant les drills."
  exit 1
fi
# --- fin check version ---
sol="${1:-solution.js}"
[ -f "$sol" ] || { echo "solution.js manquant"; exit 2; }
got=$(node "$sol" < inputs/drill_1.txt)
diff <(echo "$got") expected/drill_1.txt && echo "drill 1  OK"
