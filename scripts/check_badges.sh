#!/usr/bin/env bash
# Vérifie que chaque .md a un badge temporel en tête.
# Usage: bash scripts/check_badges.sh
set -e
missing=0
while IFS= read -r f; do
  head -3 "$f" | grep -qE '^\s*\[(INTEMPOREL|DÉCENNIE|PÉRISSABLE)' || {
    echo "MISSING BADGE: $f"
    missing=$((missing+1))
  }
done < <(find . -name "*.md" -not -path "./archive/*" -not -path "./node_modules/*")
echo "---"
echo "Missing: $missing"
exit $missing
