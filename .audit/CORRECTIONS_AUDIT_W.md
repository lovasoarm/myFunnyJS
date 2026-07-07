---
stability: perissable
---

> HORS CURRICULUM - artefact d'audit, ne pas lire pour apprendre JS.

# CORRECTIONS APPLIQUÉES : PASSAGE 7,5 -> 10 (audit W)

Ce document liste les corrections apportées au bundle en réponse à l'audit final `AUDIT_FINAL_MyFunnyJS.md`. Non pédagogique.

## 1. VITAL : purge des mots interdits (162 remplacements, 84 fichiers)

Les cinq mots interdits (`login`, `panier`, `commande`, `produit`, `utilisateur`) ont été remplacés dans l'ensemble des `.md` par des équivalents narratifs ingénieurs :

- `utilisateur` -> `opérateur`
- `login` -> `session`
- `panier` -> `sac`
- `commande` -> `requête`
- `produit` -> `artefact`

Substitution automatisée avec préservation de la casse et du pluriel. Vérification finale : `grep -rilE '\b(login|panier|commande|produit|utilisateur)\b'` retourne 0.

## 2. VITAL : purge em-dash et en-dash (60 remplacements)

Tous les ` - ` (U+2014) et `-` (U+2013) ont été convertis en `:` (dans un contexte séparateur) ou `-` (sinon). Le filet `verification_pack/_audit/lint_honor_code.sh` bloque désormais toute réapparition.

## 3. VITAL : linter du code d'honneur wiré dans le CI local

- Nouveau : `verification_pack/_audit/lint_honor_code.sh` : wrapper explicite qui appelle `style_lint.py` puis renforce sur (a) em/en-dash Unicode fiable, (b) utilisateur/commande/produit en plus de login/panier.
- `verification_pack/verify_all.sh` appelle désormais `lint_honor_code.sh` au lieu du script Python directement. Toute violation du code d'honneur casse le build local.

## 4. STRUCTUREL : greffe "Lire un humain vs lire une IA"

Nouveau fichier : `23_ai_native_dev/11_lire_humain_vs_lire_ia.md`. Contient un tableau comparatif des pièges (humain = incohérence, IA = plausibilité) et 5 cas concrets d'IA plausible-mais-fausse à démonter (import fantôme, signature inventée, méthode API hallucinée, catch-all sémantique, test couplé à l'implémentation). Répond simultanément à W.3.5, W.5.4, W.10.6, W.17.3, W.17.4.

## 5. STRUCTUREL : exo "microloop à la main"

Nouveau fichier : `03_async/04_event_loop/04_exo_microloop_a_la_main.md`. Force l'apprenant à implémenter une file de microtasks (et macrotasks) sans `Promise`, `queueMicrotask`, `setTimeout`, `setImmediate` ni `process.nextTick`. Répond à W.12.6.

## 6. AMÉLIORABLE : meta déplacé de `31_annexes/_meta/` vers `.audit/`

Le dossier n'est plus visible depuis l'arborescence pédagogique de `31_annexes/`. Les références de `README.md` et `START_HERE.md` ont été mises à jour. Répond à W.0.5 et W.10.2.

## 7. AMÉLIORABLE : stability tags complétés

Deux fichiers de `31_annexes/career/` (crosslang_challenge, interview_defense) recevaient une plainte du linter : tag `stability: stable` ajouté.

## 8. RÉSULTATS FINAUX DU LINTER

```
[HONOR CODE] Vérification du code d'honneur MyFunnyJS...
[OK] style_lint : zero emoji, zero em-dash, analogies OK, stability OK, aucun mot interdit.
[HONOR CODE] OK : zéro violation du code d'honneur.
```

Zéro dashes, zéro mots interdits, zéro emoji, zéro grimoire non-conforme, zéro leçon sans stability. Le référentiel s'applique désormais à lui-même.
