#!/usr/bin/env bash
# check_exo_jeune_ia_universal.sh
# Verifie qu'un EXO_JEUNE_IA.md existe dans chaque module numerote (01 a 29, 31, 32).
# Exceptions justifiees : 00_getting_started et 00_referentiel (preludes),
# 30_mini_projects (portage par les gates specifiques de chaque mini-projet).
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="$DIR/../.."
miss=0
for d in "$REPO"/[0-9][0-9]_*/ ; do
  name="$(basename "$d")"
  case "$name" in
    00_*|30_mini_projects) continue ;;
  esac
  if [ ! -f "$d/EXO_JEUNE_IA.md" ]; then
    echo "  [JEUNE-IA] MISS: $name"
    miss=$((miss+1))
  fi
done
if [ "$miss" -gt 0 ]; then
  echo "[FAIL] EXO_JEUNE_IA.md manquant dans $miss module(s)."
  exit 1
fi
echo "[OK] EXO_JEUNE_IA.md present dans tous les modules pedagogiques."
