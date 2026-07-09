---
stability: intemporel
---

# ADR-002 : critère de succès du fix de fuite

## Statut
Accepté : 2026-05

## Contexte

Un fix de fuite mémoire n'est pas prouvable par « ça a l'air d'aller mieux ».
Il faut un critère chiffré, reproductible, opposable en revue.

## Décision

Critère de succès : **RSS stable à ± 10 % sur une fenêtre de 10 minutes de
trafic simulé équivalent à celui qui a produit la fuite initiale**, mesuré
avec le même harness que celui utilisé pour reproduire la fuite (`fixture/`).

Livrable obligatoire : `LEAK_REPORT.md` avec courbe avant/après en ASCII et
commande exacte de reproduction.

## Alternatives écartées

- **« Le heap dump ne montre plus la classe suspecte »** : nécessaire, pas
  suffisant. Une autre classe peut avoir pris le relais. Écarté seul.
- **Test unitaire sur la fonction fuyante** : ne prouve pas l'absence de
  fuite en régime établi. Complémentaire, pas suffisant.

## Conséquences

- **Positif** : critère chiffré, reproductible par un tiers.
- **Négatif** : demande de garder l'harness de fixture propre et versionné.
