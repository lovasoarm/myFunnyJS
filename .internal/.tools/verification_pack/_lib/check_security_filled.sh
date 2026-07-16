#!/usr/bin/env bash
# check_security_filled.sh
#
# Vérifie que le SECURITY.md d'un mini-projet a réellement été rempli,
# pas laissé à l'état de template avec ses placeholders par défaut.
# Corrige PC-05 : le gate sécurité était purement déclaratif, aucun
# mécanisme ne forçait son remplissage sérieux avant de considérer un
# mini-projet "conforme".
#
# Usage : ./check_security_filled.sh <chemin_du_mini_projet>
#   ex: ./check_security_filled.sh 30_mini_projects/01_rasengan_engine
#
# Sortie : 0 si le SECURITY.md semble réellement rempli, 1 sinon.

set -uo pipefail

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  echo "Usage: $0 <chemin_du_mini_projet>"
  exit 2
fi

SEC_FILE="${TARGET}/SECURITY.md"
if [ ! -f "$SEC_FILE" ]; then
  echo "FAIL : $SEC_FILE introuvable."
  exit 1
fi

fail=0

# Placeholders du template original, jamais censés survivre en l'état
# dans une soumission "terminée".
PLACEHOLDERS=(
  "ajoute ici les variables du projet"
  "voir snapshot ci-dessous"
)

for p in "${PLACEHOLDERS[@]}"; do
  if grep -qF -- "$p" "$SEC_FILE"; then
    echo "FAIL : placeholder non rempli détecté : \"$p\""
    fail=1
  fi
done

# Le snapshot npm audit par défaut du template est toujours
# exactement { "vulnerabilities": {}, ... "total": 0 }. Si ce snapshot
# exact apparaît, c'est presque certainement un copier-coller jamais
# relancé, pas un vrai audit exécuté sur CE projet précis.
if grep -qF '{ "vulnerabilities": {}, "metadata": { "vulnerabilities": { "total": 0 } } }' "$SEC_FILE"; then
  echo "AVERTISSEMENT : le snapshot npm audit semble être celui du template par défaut."
  echo "  Relance 'npm audit --json' toi-même sur ce projet et colle le vrai résultat."
  fail=1
fi

if [ "$fail" -eq 1 ]; then
  echo ""
  echo "SECURITY.md de $TARGET : NON CONFORME. Remplis-le réellement avant de livrer."
  exit 1
fi

echo "SECURITY.md de $TARGET : OK, semble réellement rempli."
exit 0
