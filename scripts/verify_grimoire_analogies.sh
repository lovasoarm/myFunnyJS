#!/usr/bin/env bash
# verify_grimoire_analogies.sh : Partie C.1 - CI gate
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BAD=0
while IFS= read -r file; do
  # Extraire lignes de tableau (commencent par |) contenant " / " ou pas
  while IFS= read -r line; do
    # Ligne de tableau : commence par | et contient au moins 4 |
    pipes=$(echo "$line" | tr -cd '|' | wc -c)
    [ "$pipes" -lt 5 ] && continue
    # Ignorer entete et separateur
    echo "$line" | grep -qE "^\| Terme|^\|---" && continue
    # Derniere cellule = analogies
    ana=$(echo "$line" | awk -F'|' '{print $(NF-1)}' | sed 's/^ *//;s/ *$//')
    [ -z "$ana" ] && continue
    # Compter analogies (separees par " / ")
    count=$(echo "$ana" | awk -F' / ' '{print NF}')
    if [ "$count" != "2" ]; then
      echo "GRIMOIRE non conforme ($count analogies au lieu de 2) : $file"
      echo "  $line"
      BAD=$((BAD+1))
    fi
  done < "$file"
done < <(find "$ROOT" -name "*grimoire*.md" -type f)
if [ "$BAD" -gt 0 ]; then
  echo "TOTAL: $BAD ligne(s) hors format."
  exit 1
fi
echo "OK : toutes les lignes de grimoire ont exactement 2 analogies."
