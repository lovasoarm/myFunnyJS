#!/usr/bin/env bash
# Refuse de lancer les tests du module si le null n'a pas validé la checklist de prereqs.
# Il doit creer un fichier .prereq_ok a la racine du module apres avoir lu 00_prereq_check.md
# (ou 04_patterns_grimoire.md pour le 12). Ferme la faille "checklist purement declarative".
set -e
MODULE_DIR="${1:-.}"
if [ ! -f "$MODULE_DIR/.prereq_ok" ]; then
  echo "[PREREQ_GATE] Fichier '.prereq_ok' absent dans $MODULE_DIR."
  echo "  Lis 00_prereq_check.md (ou la checklist en tete du grimoire du module),"
  echo "  puis cree le fichier a la main :   touch $MODULE_DIR/.prereq_ok"
  echo "  Ce geste est un contrat : tu affirmes avoir valide les prereqs."
  exit 1
fi
