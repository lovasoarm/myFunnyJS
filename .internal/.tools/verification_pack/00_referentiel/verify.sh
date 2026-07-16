#!/usr/bin/env bash
# verify.sh : auto-quiz des Six Pierres pour 00_referentiel/
# Non interactif : liste les questions attendues, exit 0 (pédagogique).
set -u

cat <<'EOF'
== 00_referentiel : auto-quiz des Six Pierres ==

Reponds a haute voix (ou par ecrit dans un scratch) AVANT d'ouvrir 00_referentiel.md.

  1. Cite les Six Pierres de MyFunnyJS, dans n'importe quel ordre.
  2. Pour chacune, donne UN symptome concret d'un dev qui ne l'a pas.
  3. Laquelle des Six est ta zone d'ombre actuelle ? Pourquoi ?
  4. Quel module du curriculum couvre en priorite cette zone d'ombre ?
  5. En 15 mots max : quelle difference entre "coder vite" et "coder solide" ?

Ce quiz ne se corrige pas ici (pas de reponses uniques). Il declenche la
lecture active de 00_referentiel.md et de 00_why_<module>.md des modules
correspondants.

Aucune erreur possible : le simple fait de te poser ces questions valide le
prelude. Continue.
EOF
