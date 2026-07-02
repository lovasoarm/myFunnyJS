#!/usr/bin/env bash
set -euo pipefail
node -v | grep -Eq 'v(2[0-9]|[3-9][0-9])\.' || { echo "Node >= 20 requis"; exit 2; }
sol="${1:-solution.js}"
[ -f "$sol" ] || { echo "solution.js manquant"; exit 2; }
got=$(node "$sol" < inputs/drill_1.txt)
diff <(echo "$got") expected/drill_1.txt && echo "drill 1  OK"
