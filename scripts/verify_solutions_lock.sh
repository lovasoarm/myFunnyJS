#!/usr/bin/env bash
# Vérifie que chaque .solutions/ contient un README verrou et que chaque .js commence par le bloc STOP.
set -e
fail=0
while IFS= read -r d; do
  if [ ! -f "$d/README.md" ] || ! grep -q "VERROU" "$d/README.md"; then
    echo "MISSING README verrou: $d"; fail=1
  fi
  for f in "$d"/*.js; do
    [ -f "$f" ] || continue
    if ! head -1 "$f" | grep -q "STOP"; then
      echo "MISSING STOP header: $f"; fail=1
    fi
  done
done < <(find . -type d -name .solutions -not -path "./archive/*")
if [ $fail -eq 1 ]; then
  echo "verify_solutions_lock: FAILED"; exit 1
fi
echo "verify_solutions_lock: OK"
