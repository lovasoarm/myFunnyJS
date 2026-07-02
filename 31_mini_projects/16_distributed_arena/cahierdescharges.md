[INTEMPOREL]

# CAHIER DES CHARGES : DISTRIBUTED ARENA

## C'EST QUOI CE PROJET, CONCRÈTEMENT

N processus Node qui se parlent en local et survivent au chaos. C'est l'arène du Ballon d'Or : onze joueurs coordonnés, un blessé (kill -9), et le score final doit rester juste malgré tout.

## OBJECTIF

Construire un compteur distribué (coordinateur + workers) et prouver, métriques à l'appui, qu'il survit à race condition, timeout, panne partielle et retry non idempotent.

## CONTRAINTES NON NÉGOCIABLES

- Pas de Kubernetes ni de cloud : tout en local, N processus Node.
- Le total final doit être correct OU honnêtement dégradé (mesuré).
- Retry rendu idempotent explicitement.

## LIVRABLE

`coordinator.js`, `worker.js`, `chaos.js`, `verify.js`, rapport de chaos, `POSTMORTEM.md`.

## SÉCURITÉ (gate obligatoire)

Avant de considérer le projet fini, tu dois traiter ces exigences OWASP contextuelles. Un projet qui marche mais qui est vulnérable n'est pas fini.

- Intégrité des incréments (OWASP A08) : chaque incrément porte un id unique vérifié côté coordinateur pour empêcher un rejeu malveillant de gonfler le total.
- Autorisation inter-process (OWASP A01 - Broken Access Control) : un worker ne doit pouvoir écrire que ses propres incréments, pas réécrire le total global directement.

Pour chaque exigence : écris dans `SECURITY.md` la menace, ta contre-mesure, et le test qui la prouve. Le `verification_pack` de ce projet contient un test de sécurité qui doit passer.

## AUTO-ÉVALUATION

- [ ] Livrable complet et fonctionnel
- [ ] Contraintes respectées et vérifiées
- [ ] Section Sécurité traitée et testée
- [ ] ADR rédigé et relu
- [ ] POSTMORTEM honnête écrit

---

## Securite (gate obligatoire, Partie I)

- **Exigence 1** : aucune donnee sensible (secret, token, cle) dans le code source ni dans les logs. Utiliser variables d'environnement + `.env.example` versionne (jamais `.env`).
- **Exigence 2** : toute entree externe (STDIN, fichier, HTTP, CLI) est validee AVANT usage (type, longueur, format). En cas d'invalidite : erreur explicite, jamais un crash silencieux.

Un test dans `verification_pack/<projet>/verify.sh` doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).
