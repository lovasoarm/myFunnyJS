#!/usr/bin/env bash
# verify_changelog_claims.sh : chaque lien du CHANGELOG doit pointer vers un fichier existant.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHANGELOG="$ROOT/CHANGELOG_10_10.md"
[ -f "$CHANGELOG" ] || { echo "CHANGELOG_10_10.md absent"; exit 0; }
BAD=0
DEAD=$(grep -oE "\[[^]]+\]\(\./[^)]+\.md\)" "$CHANGELOG" | sed -E 's/.*\((\.\/[^)]+)\)/\1/' | while read link; do
  target="$ROOT/${link#./}"
  [ -f "$target" ] || echo "LIEN MORT: $link"
done)
if [ -n "$DEAD" ]; then
  echo "$DEAD"
  exit 1
fi
echo "OK : aucun lien mort dans CHANGELOG_10_10."
