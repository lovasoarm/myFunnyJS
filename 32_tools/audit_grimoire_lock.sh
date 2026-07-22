#!/usr/bin/env bash
# 32_tools/audit_grimoire_lock.sh
# Corrige le point 4/6 de la revue : verrouillage grimoire <-> solutions.
# Voir .internal/audit_grimoire_solutions_lock.md pour la specification.
set -euo pipefail

ROOT="${1:-.}"

GRIMOIRES=$(find "$ROOT" -type f \( -iname "*grimoire*.md" -o -iname "*honneur*.md" -o -iname "*GRIMOIRE*.md" \) 2>/dev/null || true)
MINI_PROJECTS=$(find "$ROOT/30_mini_projects" -mindepth 2 -maxdepth 2 -name "README.md" 2>/dev/null || true)

fail=0
echo "# Rapport de verrouillage grimoire <-> solutions"
echo
if [ -z "$MINI_PROJECTS" ]; then
  echo "- (aucun mini-projet trouve sous 30_mini_projects/)"
  exit 0
fi

for mp in $MINI_PROJECTS; do
  dir=$(dirname "$mp")
  refs=0
  for g in $GRIMOIRES; do
    name=$(basename "$g")
    if grep -RqF "$name" "$dir" 2>/dev/null; then
      refs=$((refs+1))
    fi
  done
  if [ "$refs" -eq 0 ]; then
    echo "- [FAIL] $dir : aucun grimoire reference"
    fail=$((fail+1))
  else
    echo "- [OK]   $dir : $refs grimoire(s) reference(s)"
  fi
done

echo
if [ "$fail" -gt 0 ]; then
  echo "Total en derive : $fail mini-projet(s)."
  exit 1
fi
echo "Aucune derive detectee."
