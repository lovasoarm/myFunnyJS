#!/usr/bin/env bash
# Vérifie que chaque .solutions/ contient un README verrou, et RIEN d'autre.
# Politique CrazyDevs : pas de solution.js planquée derrière un README.
# Le vrai verrou, c'est l'absence du fichier. L'apprenant code sa propre correction.
set -e
fail=0
while IFS= read -r d; do
  if [ ! -f "$d/README.md" ] || ! grep -q "VERROU" "$d/README.md"; then
    echo "MISSING README verrou: $d"; fail=1
  fi
  extra=$(find "$d" -type f -not -name "README.md")
  if [ -n "$extra" ]; then
    echo "FICHIER INTERDIT dans .solutions/ (README only) :"
    echo "$extra"
    fail=1
  fi
done < <(find . -type d -name .solutions -not -path "./archive/*")
if [ $fail -eq 1 ]; then
  echo "verify_solutions_lock: FAILED"; exit 1
fi
echo "verify_solutions_lock: OK"
