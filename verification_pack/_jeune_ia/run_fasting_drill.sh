#!/usr/bin/env bash
# Drill "jeune d'IA" : chronometre + log horodate + checklist post-drill.
# Aucune magie : le contrat est declaratif mais TRACE, ce qui empeche
# la triche silencieuse (le log est signe SHA256 du contenu + de l'heure).
set -euo pipefail

MINUTES="${1:-45}"
TASK="${2:-tache non decrite}"
ROOT_MARK=".myfunnyjs"
LOG_DIR="$HOME/$ROOT_MARK"
LOG_FILE="$LOG_DIR/fasting.log"
mkdir -p "$LOG_DIR"

START_ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
START_EPOCH="$(date -u +%s)"
echo ""
echo "===================================================="
echo "  MyFunnyJS : drill jeune d'IA"
echo "===================================================="
echo "  Debut        : $START_ISO"
echo "  Duree cible  : $MINUTES min"
echo "  Tache        : $TASK"
echo ""
echo "REGLES :"
echo "  - aucune fenetre IA ouverte (chat, copilot, cursor)."
echo "  - aucune requete a un LLM (ni web, ni CLI)."
echo "  - documentation officielle et lecture de code OK."
echo "  - si tu triches, tu ne triches personne d'autre que toi."
echo ""
echo "Le compteur demarre a la fin de ce message. Ctrl+C pour abandonner."
echo ""
sleep 2

TARGET_EPOCH=$(( START_EPOCH + MINUTES * 60 ))
while :; do
  NOW=$(date -u +%s)
  REMAIN=$(( TARGET_EPOCH - NOW ))
  if [ "$REMAIN" -le 0 ]; then break; fi
  M=$(( REMAIN / 60 ))
  S=$(( REMAIN % 60 ))
  printf "\r  Restant : %02d:%02d " "$M" "$S"
  sleep 1
done
echo ""
echo ""
echo "  Temps ecoule. Reponds A LA MAIN aux 5 questions."
echo "  (tape 'oui' ou 'non', puis Entree)"
echo ""

ask() {
  local q="$1"
  local a=""
  while [ "$a" != "oui" ] && [ "$a" != "non" ]; do
    printf "  %s : " "$q"
    read -r a || a="non"
    a="$(echo "$a" | tr '[:upper:]' '[:lower:]' | tr -d '[:space:]')"
  done
  echo "$a"
}

Q1=$(ask "Q1 aucune IA n'a ete ouverte pendant le drill")
Q2=$(ask "Q2 aucune requete LLM n'a ete envoyee")
Q3=$(ask "Q3 la tache est terminee ou une hypothese ecrite explique le blocage")
Q4=$(ask "Q4 tu peux expliquer le code produit sans regarder")
Q5=$(ask "Q5 tu as note dans TDD_JOURNAL une chose que tu ne savais pas au debut")

END_ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
DUR=$(( $(date -u +%s) - START_EPOCH ))

RAW="drill|start=$START_ISO|end=$END_ISO|minutes=$MINUTES|dur_s=$DUR|task=$TASK|Q1=$Q1|Q2=$Q2|Q3=$Q3|Q4=$Q4|Q5=$Q5"
if command -v shasum >/dev/null 2>&1; then
  SIG=$(printf '%s' "$RAW" | shasum -a 256 | awk '{print $1}')
elif command -v sha256sum >/dev/null 2>&1; then
  SIG=$(printf '%s' "$RAW" | sha256sum | awk '{print $1}')
else
  SIG="nosig"
fi
echo "$RAW|sig=$SIG" >> "$LOG_FILE"

echo ""
echo "===================================================="
echo "  Drill enregistre dans $LOG_FILE"
echo "  Signature : $SIG"
echo "===================================================="
echo ""
echo "  Prochaine action : reporte les 5 reponses + la signature"
echo "  ci-dessus dans DEPENDENCY_LEDGER.md sous 'Jeunes IA'."
echo ""
