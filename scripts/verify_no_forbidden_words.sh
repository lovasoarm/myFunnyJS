#!/usr/bin/env bash
# verify_no_forbidden_words.sh : Partie B.2 - CI gate
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FORBIDDEN='(utilisateur|produit|commande|paiement|panier|login)s?'
# Exclut audit, changelogs, scripts eux-memes
HITS=$(grep -riE "\b${FORBIDDEN}\b" --include="*.md" "$ROOT" \
  | grep -vE "AUDIT_FINAL|verify_no_forbidden_words|CHANGELOG_10_10|CHANGELOG_Thor_Edition|00_referentiel/README" \
  || true)
if [ -n "$HITS" ]; then
  echo "MOTS INTERDITS DETECTES (Partie B.2) :"
  echo "$HITS"
  exit 1
fi
echo "OK : aucun mot interdit."
