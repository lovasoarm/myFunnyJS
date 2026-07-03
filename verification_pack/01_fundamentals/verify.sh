#!/usr/bin/env bash
# Drill de vérification déterministe pour 01_fundamentals
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$DIR/.."
source "$ROOT/_lib/node_gate.sh"
source "$ROOT/_lib/assert.sh"

echo "== [01_fundamentals] =="

# Drill 1 : sanity Node
out=$(node -e "console.log(2+2)")
assert_eq "4" "$out" "sanity node arithmétique"

# Drill 2 : le module existe et contient au moins un grimoire
if ls "$ROOT/../01_fundamentals"/*grimoire*.md >/dev/null 2>&1 || \
   find "$ROOT/../01_fundamentals" -name '*grimoire*.md' | grep -q .; then
  echo "  [OK]   grimoire présent"
else
  echo "  [WARN] pas de grimoire trouvé (module sans synthèse)"
fi

# Drill 3 : présence 00_why
if [ -f "$ROOT/../01_fundamentals/00_why_"*".md" ] || ls "$ROOT/../01_fundamentals/00_why_"*.md >/dev/null 2>&1; then
  echo "  [OK]   00_why présent"
else
  echo "  [FAIL] 00_why manquant"
  exit 1
fi

echo "== [01_fundamentals] OK =="
