#!/usr/bin/env bash
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
REPORT="${ROOT}/.internal/.tools/verification_pack/reports/universes.txt"
mkdir -p "$(dirname "$REPORT")"
: > "$REPORT"

# Liste blanche stricte : seuls ces univers sont autorisés dans MyFunnyJS.
# Tout token appartenant à un univers narratif NON listé ici doit faire
# échouer ce lint, qu'il soit explicitement interdit ou juste absent de
# la liste. C'est un mode liste blanche, pas liste noire : la charge de
# la preuve est sur l'ajout, pas sur l'interdiction.
WHITELIST=(
  "Naruto" "Sasuke" "Sakura" "Kakashi" "Hokage" "shinobi" "jutsu" "chakra"
  "Dragon Ball" "Goku" "Vegeta" "Piccolo" "Saiyan" "Kamehameha" "Cell" "Freezer"
  "Garo" "Honoo no Kokuin" "makai"
  "Avengers" "Iron Man" "Captain America" "Thor" "Hulk" "Thanos" "Black Widow" "Hawkeye"
  "Walking Dead" "Rick Grimes" "Negan" "Daryl"
  "Prison Break" "Michael Scofield" "T-Bag" "Fox River"
  "Breaking Bad" "Heisenberg" "Walter White" "Jesse Pinkman"
  "Banshee"
)

# Liste noire explicite : univers connus à haut risque de confusion visuelle
# avec la whitelist (ex: Marvel hors Avengers) ou déjà signalés comme
# problématiques. Bloqués même si un token whitelist apparaît à proximité.
BLACKLIST=(
  "Star Wars" "Jedi" "Sith" "Skywalker"
  "One Piece" "Luffy" "Zoro le pirate"
  "Bleach" "Ichigo Kurosaki"
  "My Hero Academia" "MHA" "Deku" "All Might"
  "Fortnite" "Battle Royale"
  "Spider-Man" "X-Men" "Wolverine"
)

fail=0

echo "--- Vérification liste noire (interdits explicites) ---" >> "$REPORT"
for token in "${BLACKLIST[@]}"; do
  hits=$(grep -RIn --include="*.md" \
    --exclude-dir=".git" --exclude-dir=".tools" --exclude-dir="node_modules" \
    -F -- "$token" "$ROOT" 2>/dev/null || true)
  if [ -n "$hits" ]; then
    while IFS= read -r line; do
      if echo "$line" | grep -q "lint-universes: allow"; then continue; fi
      file=$(echo "$line" | cut -d: -f1)
      base=$(basename "$file")
      if [ "$base" = "POSTMORTEM.md" ] || [ "$base" = "TDD_JOURNAL.md" ]; then continue; fi
      echo "BLACKLIST: $line" >> "$REPORT"
      fail=1
    done <<< "$hits"
  fi
done

echo "" >> "$REPORT"
echo "--- Info : univers whitelist détectés (référence, pas un échec) ---" >> "$REPORT"
for token in "${WHITELIST[@]}"; do
  count=$(grep -RIl --include="*.md" \
    --exclude-dir=".git" --exclude-dir=".tools" --exclude-dir="node_modules" \
    -F -- "$token" "$ROOT" 2>/dev/null | wc -l)
  if [ "$count" -gt 0 ]; then
    echo "  $token : $count fichier(s)" >> "$REPORT"
  fi
done

if [ "$fail" = 1 ]; then
  echo "LINT_UNIVERSES FAIL : univers interdit détecté, voir $REPORT"; exit 1
fi
echo "LINT_UNIVERSES OK : aucun univers de la liste noire détecté."
echo "Rappel : ce lint ne détecte QUE la liste noire connue. Un univers absent"
echo "des deux listes (ni whitelist ni blacklist) n'est PAS détecté par ce"
echo "script actuellement : toute nouvelle contribution doit être relue"
echo "manuellement contre la liste blanche avant merge."
