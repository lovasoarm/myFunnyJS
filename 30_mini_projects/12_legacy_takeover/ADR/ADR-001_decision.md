---
stability: intemporel
---

# ADR-001 : reprise vs réécriture du repo hérité

## Statut
Accepté : 2026-05

## Contexte

Le repo repris affiche les symptômes classiques d'une base legacy : couverture
de tests inégale, dépendances obsolètes, dossier `utils/` de 3000 lignes,
noms de variables cryptiques. Un bug ciblé (le seul demandé par le stakeholder)
est reproductible en 2 minutes.

Tentation naturelle : « c'est plus rapide de tout réécrire ». Décision à
poser avant d'écrire une ligne, sous peine de scope creep massif.

## Décision

**Reprise en place**. On ne touche à l'architecture que si elle empêche
matériellement le fix. On corrige le bug ciblé, on ajoute deux tests de
régression (rouge → vert), on documente la dette rencontrée dans
`ONBOARDING.md` sans la corriger.

## Alternatives écartées

- **Réécriture complète** : coûteuse (semaines), casse la compatibilité avec
  les autres consommateurs, non demandée par le stakeholder. Écartée.
- **Grand refactor préparatoire avant fix** : classique piège du dev senior
  qui « en profite pour nettoyer ». Ajoute du risque, retarde le fix, ouvre
  50 questions non résolues. Écarté.
- **Fix + refactor local du fichier touché** : tentant, mais le fichier
  touché est central ; le refactor élargit le blast radius du PR. Reporté :
  possible dans un PR séparé, revue explicite.

## Conséquences

- **Positif** : livraison rapide, historique préservé (git blame lisible),
  risque contenu, revue de PR courte.
- **Négatif** : on hérite de la dette. Consignée dans `ONBOARDING.md` avec
  un ordre de grandeur (« refactor de `utils/` : 3-5 jours, à planifier »).
- **À surveiller** : si le prochain bug touche la même zone, remettre en
  question la décision (règle des trois : au troisième bug dans la même
  zone, refactor obligatoire).

## Signaux de révision

Rouvrir cet ADR si :
- un deuxième bug émerge dans la même fonction dans les 30 jours,
- une nouvelle feature demande de traverser cette zone,
- le fichier touché passe la barre des 500 lignes ou 15 responsabilités.
