---
stability: intemporel
---

# CAHIER DES CHARGES : SCHEDULER

Temps de lecture ~2 min

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Tu construis ton propre event loop, comme Rock Lee qui apprend le taijutsu sans ninjutsu : pas de magie du moteur, juste les mains dans la mécanique brute.

## OBJECTIF

Réimplémenter un event loop miniature (files micro/macrotasks) et un `pMap` avec limite de concurrence et annulation par AbortController.

## CONTRAINTES NON NÉGOCIABLES

- Aucun `setTimeout(fn, 0)` pour simuler une microtask : `queueMicrotask` uniquement.
- `pMap` doit préserver l'ordre de sortie même si les mappers finissent dans le désordre.
- Annulation propre : zéro timer qui fuit après un `abort()`.

## LIVRABLE

`mini-loop.js`, `pMap.js`, une suite de tests qui prouve l'ordre micro/macro et la borne de concurrence.

## SÉCURITÉ (gate obligatoire)

Avant de considérer le projet fini, tu dois traiter ces exigences OWASP contextuelles. Un projet qui marche mais qui est vulnérable n'est pas fini.

- Validation d'entrée (OWASP A03 - Injection) : `pMap` doit rejeter proprement un `items` non-itérable ou un `mapper` non-fonction plutôt que crasher avec une stack qui fuit l'implémentation interne.
- Déni de service (OWASP A05 - Misconfiguration) : borner `concurrency` à une valeur max raisonnable pour éviter qu'un appelant lance 1 000 000 de promesses et fasse tomber le process.

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

Un test dans `node solution.js` (auto-verif ecrite par toi) doit prouver ces deux points (ex : lancer le programme avec une entree malformee et verifier qu'il refuse proprement).

## RÔLE DES DOSSIERS (ne skippe pas)

- `src/` : **tu remplis toi-même**. Le dossier est vide exprès : c'est ton livrable. Aucun code fourni.
- `tests/` : **TDD strict : tu écris le test AVANT le code de `src/`**. Rouge → vert → refactor. Si `tests/` est vide en fin de projet, ce projet ne compte pas dans ton portfolio.
- `ADR/` : **au moins 1 décision architecturale documentée** (choix de structure, trade-off, alternative rejetée + pourquoi). Format : Contexte / Décision / Conséquences.
- `POSTMORTEM.md` : **rédigé à la fin, honnête**. Ce qui a foiré, combien de temps t'a coûté chaque blocage, ce que tu referais autrement.
- `TDD_JOURNAL.md` : trace vivante du cycle rouge/vert/refactor.

**Un CTO qui feuillette ton portfolio regarde `src/` ET `tests/` ET `ADR/`. Un `src/` vide sans `tests/` associé = projet non fini, quelle que soit la qualité du reste.**
