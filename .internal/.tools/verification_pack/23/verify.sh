#!/usr/bin/env bash
# verify.sh - correction cachée de 23_ai_native_dev/07_faux_positifs_ia.md
# Ne pas ouvrir avant d'avoir tenté l'exercice.
set -e
case "${1:-}" in
  faux_positifs)
    cat <<'EOF'
Correction attendue par snippet (résumé, la version longue est dans commentaires ci-dessous) :

Snippet 1 : (a) race condition si deux appels concurrents sur même id : promise dupliquée ;
           (b) cache sans borne : fuite mémoire à long run ; (c) pas d'invalidation TTL.
Snippet 2 : (a) SHA-256 sans salt : rainbow tables ; (b) pas de coût réglable : bruteforce facile ;
           (c) hash pur : deux mêmes passwords -> même hash côté base. -> bcrypt/scrypt/argon2.
Snippet 3 : (a) Map non-partagée entre workers/instances : contournable ;
           (b) filter+push non-atomique : sous-comptage sous charge ; (c) map illimitée -> fuite.
Snippet 4 : (a) une seule mesure : bruit énorme ; (b) pas de warmup V8 : premier appel plus lent ;
           (c) `console.time` a une résolution ms, insuffisante ici. -> `performance.now()` + boucle.
Snippet 5 : (a) `readFileSync` sans encoding : renvoie Buffer, `JSON.parse` marche par chance ;
           (b) chemin relatif au CWD du process, pas au fichier ; (c) crash silencieux si JSON invalide.
EOF
    ;;
  *)
    echo "Usage: $0 faux_positifs"
    exit 1
    ;;
esac
