#!/usr/bin/env bash
# 32_tools/audit_grimoire_analogies.sh
# Corrige le point 2/6 de la revue : chaque ligne d'un tableau markdown
# situee dans un fichier *grimoire*.md doit contenir au minimum 2 analogies.
# Heuristique : une ligne de tableau (contient au moins 4 pipes '|') hors
# ligne d'entete et hors separateur doit contenir au moins 2 marqueurs
# d'analogie (mots-cles "comme", "tel que", "pareil a", "similaire",
# "cf.", "cf ", "~=", "=>", "->", "≈").
set -euo pipefail

ROOT="${1:-.}"
MIN_ANALOGIES=2

FILES=$(find "$ROOT" -type f -iname "*grimoire*.md" 2>/dev/null || true)

fail=0
echo "# Rapport analogies grimoires (min $MIN_ANALOGIES par ligne de tableau)"
echo

for f in $FILES; do
  awk -v FN="$f" -v MIN="$MIN_ANALOGIES" '
    BEGIN { inhdr = 0 }
    /^[[:space:]]*\|[[:space:]]*[-:]+[[:space:]]*\|/ { inhdr = 1; next }   # separateur ---
    /^[[:space:]]*\|/ {
      if (inhdr == 0) { next }                                             # header au-dessus du separateur
      line = $0
      n = 0
      pat[1] = "comme"; pat[2] = "tel que"; pat[3] = "pareil"; pat[4] = "similaire"
      pat[5] = "cf\\."; pat[6] = "~="; pat[7] = "=>"; pat[8] = "->"
      pat[9] = "≈"; pat[10] = "analogie"
      for (i = 1; i <= 10; i++) {
        c = gsub(pat[i], pat[i], line)
        n += c
      }
      if (n < MIN) {
        printf("- [FAIL] %s:%d  analogies=%d\n", FN, NR, n)
        exit_code = 1
      }
    }
    END { exit exit_code+0 }
  ' "$f" || fail=$((fail+1))
done

echo
if [ "$fail" -gt 0 ]; then
  echo "Total fichiers en derive : $fail."
  exit 1
fi
echo "Toutes les lignes de tableau des grimoires ont >= $MIN_ANALOGIES analogies."
