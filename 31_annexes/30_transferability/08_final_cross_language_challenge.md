---
stability: intemporel
---

# ÉPREUVE FINALE : DEBUG CROSS-LANGUAGE + ADR COMPARATIF EN 4H
Temps de lecture ~240 min

Le boss final de la transférabilité. Tu ne codes rien de neuf : tu déboggues du code
inconnu dans deux langages que tu n'utilises pas au quotidien, PUIS tu écris un ADR
qui compare les trois écosystèmes (JS, Python, Rust) sur un même axe.

Cette épreuve est **obligatoire** pour obtenir le label MyFunnyJS. Sans elle, tu ne
peux pas prouver que ta pensée survit à un changement de langage.

---

## PARTIE 1 : DEBUG PYTHON (60 min chrono)

Tu reçois un dépôt Python avec **2 bugs** (1 logique + 1 concurrency asyncio).
Livrable `RAPPORT_PY.md` :
- Diagnostic (3 lignes) par bug.
- Patch minimal.
- Test qui prouve le fix (`pytest -k <nom>` doit passer).
- Le concept CrazyDevs (parmi les 6 pierres) qui t'a servi.

## PARTIE 2 : DEBUG RUST (60 min chrono)

Dépôt Rust avec **2 bugs** (1 borrow checker + 1 logique concurrence via `Arc<Mutex<>>`).
Même format de livrable : `RAPPORT_RS.md`.

## PARTIE 3 : ADR COMPARATIF (120 min chrono)

Choisis UN concept parmi :

1. Gestion des erreurs (exceptions JS/Python vs `Result<T,E>` Rust)
2. Concurrence (event loop JS vs asyncio Python vs tokio Rust)
3. Ownership et mutation (références partagées JS vs GIL Python vs borrow checker Rust)

Rédige `ADR-CROSS-LANG.md` structuré :

```
Contexte   : le problème réel à résoudre
Options   : approche JS | approche Python | approche Rust
Trade-offs  : coût cognitif, perf, sûreté, ergonomie, écosystème
Décision   : quel langage tu choisirais POUR CE PROBLÈME et pourquoi
Contrepoint : dans quel cas tu changerais d'avis
```

---

## GRILLE DE VALIDATION (auto-évaluation honnête, 10 points)

- [ ] 2/2 bugs Python trouvés en < 60 min              (2 pts)
- [ ] 2/2 bugs Rust trouvés en < 60 min               (2 pts)
- [ ] Chaque diagnostic tient en 3 lignes, sans jargon inutile    (1 pt)
- [ ] ADR cite 3+ trade-offs mesurables (pas d'opinions)       (2 pts)
- [ ] Contrepoint réel (pas symbolique)               (1 pt)
- [ ] Concept CrazyDevs correctement identifié pour chaque bug    (1 pt)
- [ ] Tu peux défendre l'ADR 20 min face à un pair (simulation)   (1 pt)

**Seuil de validation : 8/10.** En dessous, tu recommences avec un autre triplet
de bugs (voir `pool_bugs/` dans ce dossier).

---

## (attention) CE QUE L'ÉPREUVE MESURE VRAIMENT

Pas ta maîtrise de Python ou Rust. Ta capacité à :
1. Lire du code sans peur, ignorer la syntaxe, voir la structure.
2. Reconnaître les patterns universels (état partagé, effet de bord, invariant).
3. Écrire une décision qui tient debout dans 6 mois, indépendamment du langage.

C'est ça, être irremplaçable par une IA générique en 2026 comme en 2031.

---

## POUR TROUVER LES DÉPÔTS-CIBLES

Trois candidats calibrés (ni triviaux, ni gigantesques) sont listés dans
`pool_bugs/CANDIDATS.md`. Choisis-en un par langage. Si tu utilises un dépôt
non-listé, note-le et justifie en 2 lignes dans le rapport.
