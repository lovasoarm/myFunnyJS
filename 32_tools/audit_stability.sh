#!/usr/bin/env bash
# 32_tools/audit_stability.sh
# Verifie que tout 00_why_*.md et tout *grimoire*.md commence par un
# frontmatter YAML contenant "stability: intemporel|evolutif|perissable".
# Spec : .internal/README.md, section "Regle stability".
set -euo pipefail

ROOT="${1:-.}"
fail=0

echo "# Rapport audit stability"
echo

FILES=$(find "$ROOT" \( -name "00_why_*.md" -o -iname "*grimoire*.md" \) -type f 2>/dev/null || true)

for f in $FILES; do
  # frontmatter doit etre dans les 6 premieres lignes
  # Accepte : intemporel | evolutif | perissable | stable | moderne
  # + variantes datees "perissable_YYYY" ou "periss-YYYY"
  if head -10 "$f" | grep -qE '^stability:[[:space:]]+(intemporel|evolutif|perissable|stable|moderne|perissable_[0-9]{4}|periss-[0-9]{4})[[:space:]]*$'; then
    echo "- [OK]   $f"
  else
    echo "- [FAIL] $f : tag stability manquant ou invalide"
    fail=$((fail+1))
  fi
done

echo
if [ "$fail" -gt 0 ]; then
  echo "Total en derive : $fail fichier(s)."
  exit 1
fi
echo "Tous les fichiers concernes ont un tag stability valide."
