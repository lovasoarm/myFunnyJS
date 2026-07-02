#!/usr/bin/env bash
set -e
fail=0
for p in 30_mini_projects/*/; do
  name=$(basename "$p")
  [ "$name" = "_synthesis" ] && continue
  for d in src tests; do
    if [ ! -d "$p$d" ]; then
      echo "MISSING $p$d"; fail=1
    fi
  done
done
[ $fail -eq 1 ] && { echo "verify_project_structure: FAILED"; exit 1; }
echo "verify_project_structure: OK"
