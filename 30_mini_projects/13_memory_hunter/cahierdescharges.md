---
stability: intemporel
---

# CAHIER DES CHARGES : MEMORY HUNTER

Temps de lecture ~2 min

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Cinq fuites cachées dans un serveur pourri. C'est la chasse aux Horrors de Garo : chaque fuite est un monstre invisible qui grossit dans l'ombre jusqu'à faire tomber le serveur. Tu traques, tu prouves, tu tues.

## OBJECTIF

Traquer, corriger et documenter 5 fuites mémoire dans un serveur Node volontairement défectueux, preuves à l'appui (heap snapshots).

## CONTRAINTES NON NÉGOCIABLES

- Chaque fuite doit être prouvée par un snapshot avant/après.
- Heap stable après 10 000 requêtes (< +5 MB vs baseline).
- Aucun `setInterval` restant sans `unref`.

## LIVRABLE

`LEAK_REPORT_01.md` à `05.md`, un ADR sur la politique d'éviction, un `POSTMORTEM.md`.

## SÉCURITÉ (gate obligatoire)

Avant de considérer le projet fini, tu dois traiter ces exigences OWASP contextuelles. Un projet qui marche mais qui est vulnérable n'est pas fini.

- Déni de service par épuisement mémoire (OWASP A05) : les fuites elles-mêmes sont un vecteur DoS ; documenter comment un attaquant pourrait les déclencher volontairement (ex : spam d'un endpoint qui ajoute un listener).
- Limites de ressources (OWASP A04 - Insecure Design) : imposer une taille max au cache Map (LRU) pour empêcher une croissance non bornée pilotée par l'utilisateur.

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
