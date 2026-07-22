---
stability: intemporel
---

# CAHIER DES CHARGES : LEGACY TAKEOVER

Temps de lecture ~2 min

## C'EST QUOI CE PROJET, CONCRÈTEMENT

Reprendre un repo abandonné, c'est arriver à Fox River après l'évasion : le plan est sur les murs, mais la moitié des couloirs sont effondrés. Tu ne réécris pas la prison, tu la comprends d'abord.

## OBJECTIF

Reprendre un petit repo Node.js OSS abandonné (>24 mois, <=3000 LOC), le faire tourner, reproduire un bug, le corriger sans casser le reste.

## CONTRAINTES NON NÉGOCIABLES

- Interdiction de réécrire from scratch : tu adaptes l'existant.
- Aucun patch avant reproduction locale du bug (`REPRO.md` obligatoire).
- Chaque changement documenté dans `ONBOARDING.md` et couvert par un test.

## LIVRABLE

Fork avec bug corrigé, `ONBOARDING.md`, `REPRO.md`, PR propre avec message expliquant le pourquoi.

## SÉCURITÉ (gate obligatoire)

Avant de considérer le projet fini, tu dois traiter ces exigences OWASP contextuelles. Un projet qui marche mais qui est vulnérable n'est pas fini.

- Audit de dépendances (OWASP A06 - Vulnerable Components) : lancer `npm audit`, documenter les CVE trouvées dans `ONBOARDING.md`, patcher ou justifier chaque vulnérabilité laissée.
- Secrets (OWASP A07) : vérifier qu'aucune clé/API token n'est committée dans l'historique du repo repris avant de le publier.

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
