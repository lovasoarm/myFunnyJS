---
stability: intemporel
---

# ADR-XXX : {titre court}

Temps de lecture ~4 min

## Statut

Proposé : {AAAA-MM}

## Contexte

Décris la situation, les forces en présence, ce qui pousse à décider maintenant.
Sans contexte, la décision se lira plus tard comme un caprice.

## Options considérées

- **Option A** : description + raisons pour + raisons contre.
- **Option B** : idem.
- **Option C** : idem.

## Grille chiffrée (optionnel mais recommandé dès qu'une décision engage plusieurs semaines)

La prose au-dessus dit **pourquoi**. Cette grille dit **combien**. Les deux se complètent : la grille sans prose est mécanique, la prose sans grille est bavarde.

Choisis 3 à 5 critères qui comptent pour **cette** décision précise (pas une checklist générique). Exemples typiques : latence estimée p95, coût infra mensuel, temps de migration en jours-dev, nombre de fichiers impactés, risque de régression, courbe d'apprentissage pour l'équipe. Pondère chaque critère (poids 1 à 3 : 1 = confort, 2 = important, 3 = bloquant). Score chaque option de 1 à 5 sur chaque critère.

| Critère (poids)          | Option A | Option B | Option C |
| ------------------------ | -------- | -------- | -------- |
| Ex : latence p95 (3)     | 4        | 2        | 5        |
| Ex : coût mensuel (2)    | 3        | 5        | 2        |
| Ex : temps migration (2) | 2        | 4        | 3        |
| **Total pondéré**        | **20**   | **20**   | **25**   |

> Le total ne décide pas à ta place : il éclaire. Si la grille sort un vainqueur qui heurte ton intuition, c'est un signal : soit tu as raté un critère, soit ton intuition trompe. Explicite l'arbitrage juste en dessous, dans la section **Décision**.

## Décision

L'option retenue, formulée en une phrase active.
Puis 3-5 lignes qui explicitent le "pourquoi maintenant".

## Conséquences

Positives comme négatives. Ce qu'on gagne, ce qu'on paie, ce qui devient plus dur.

## Ce qu'on abandonne

Les options rejetées, et surtout ce que leur abandon coûte concrètement.
Sans cette section, la décision paraît gratuite.

## Signal de révision

L'événement observable qui rendra cette décision périmée (métrique, échelle, contexte
métier qui change). Sans signal, l'ADR devient une relique.
