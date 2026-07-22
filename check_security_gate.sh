#!/usr/bin/env bash
# check_security_gate.sh
# Test automatise, cote apprenant, qui prouve que la gate securite est passee
# pour chaque mini-projet (SECURITY_GATE.md rempli, pas juste present).
#
# Usage :
#   ./check_security_gate.sh                 # verifie tous les mini-projets
#   ./check_security_gate.sh 10_legacy_dungeon
#
# Critere binaire : chaque SECURITY_GATE.md doit contenir au moins une case
# cochee "[x]" et NE PAS contenir de "TODO" restants.

set -u
BASE="30_mini_projects"
FAIL=0
TOTAL=0

check_one() {
  local dir="$1"
  local file="$BASE/$dir/SECURITY_GATE.md"
  TOTAL=$((TOTAL+1))
  if [ ! -f "$file" ]; then
    echo "MISS  $dir : SECURITY_GATE.md absent"
    FAIL=$((FAIL+1)); return
  fi
  if ! grep -q "\[x\]" "$file"; then
    echo "FAIL  $dir : aucune case [x] cochee"
    FAIL=$((FAIL+1)); return
  fi
  if grep -qi "TODO" "$file"; then
    echo "WARN  $dir : TODO encore present"
    FAIL=$((FAIL+1)); return
  fi
  echo "OK    $dir"
}

if [ $# -ge 1 ]; then
  check_one "$1"
else
  for d in "$BASE"/*/; do
    name=$(basename "$d")
    case "$name" in _templates) continue;; esac
    check_one "$name"
  done
fi

echo ""
echo "Resultat : $((TOTAL-FAIL))/$TOTAL projets passent la gate."
[ "$FAIL" -eq 0 ]
