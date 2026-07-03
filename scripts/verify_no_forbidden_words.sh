#!/usr/bin/env bash
# verify_no_forbidden_words.sh : Partie B.2 - CI gate
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FORBIDDEN='(utilisateur|produit|commande|paiement|panier|login)s?'
HITS=$(grep -riE "\b${FORBIDDEN}\b" --include="*.md" "$ROOT" \
  | grep -vE "AUDIT_FINAL|verify_no_forbidden_words|CHANGELOG|POSTMORTEM_TEMPLATE|_referentiel/README|archive/legacy_" \
  || true)
if [ -n "$HITS" ]; then
  echo "MOTS INTERDITS DETECTES (Partie B.2) :"
  echo "$HITS"
  exit 1
fi
echo "OK : aucun mot interdit."
