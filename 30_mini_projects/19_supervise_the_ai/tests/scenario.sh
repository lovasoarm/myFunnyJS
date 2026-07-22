#!/usr/bin/env bash
# tests/scenario.sh
# Squelette a completer par toi (humain). Seule exception au no-code.
# Doit passer sur 3 runs consecutifs sans divergence.
set -euo pipefail

# 1. Preparer inbox/ vide + events.log vide
# 2. Lancer watcher/ en arriere-plan
# 3. Deposer 5 fichiers dans inbox/
# 4. Lancer notifier/, capturer stdout
# 5. kill -9 notifier apres le 2e fichier
# 6. Redemarrer notifier, verifier : ni doublon ni saut
# 7. Rejouer events.log a partir de zero, verifier meme sortie

echo "TODO: scenario a implementer selon le cahier des charges"
exit 1
