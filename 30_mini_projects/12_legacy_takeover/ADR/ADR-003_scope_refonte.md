---
stability: intemporel
---

# ADR-003 : périmètre de refonte partielle

## Statut
Accepté : 2026-05

## Contexte

Une fois le bug ciblé corrigé (voir `ADR-001_decision.md`) et le périmètre
du postmortem posé (`ADR-002_postmortem_scope.md`), la question suivante
arrive : le repo garde de la dette bien réelle (utils fourre-tout, doublons
de logique, dépendances obsolètes). Est-ce qu'on la traite maintenant,
et jusqu'où ?

Sans arbitrage explicite, deux dérives classiques :

- refonte totale déguisée en "petit nettoyage" → scope creep, régression
  sur du code qu'on ne comprend pas encore, blocage du fix demandé.
- rien ne bouge → la prochaine reprise sera aussi coûteuse que la nôtre,
  la dette est reconduite en silence.

## Décision

**Refonte partielle, ciblée sur le chemin du bug uniquement.**

- Modules refactorés : ceux effectivement touchés par le fix (et leurs
  dépendances directes si le nom / la signature rend le fix illisible).
- Modules laissés tels quels : tout le reste, y compris les zones sales
  visibles depuis les modules touchés mais pas nécessaires au fix.
- Documentation : les zones aperçues mais non traitées sont listées dans
  `ONBOARDING.md` avec une phrase "pourquoi c'est laissé".

## Critères de décision (par module)

Un module rentre dans le périmètre de refonte si **au moins deux** des
critères suivants sont vrais :

1. il est modifié par le fix.
2. son API publique change (renommage, signature, retour) et casserait
   un consommateur si laissée en l'état.
3. il empêche d'écrire un test de régression lisible.
4. il contient une abstraction fuyante qui rend le fix incompréhensible
   pour un relecteur externe.

Un seul critère ne suffit pas : la tentation est trop forte de justifier
n'importe quelle refonte a posteriori.

## Alternatives écartées

- **Refonte complète du module `utils/`** : hors périmètre de la mission,
  bloquerait le fix pendant des jours, risque de casser des consommateurs
  non identifiés. Écartée.
- **Zéro refonte, fix chirurgical uniquement** : rend le fix illisible
  dans deux modules dont les noms de fonctions mentaient sur ce qu'elles
  faisaient. Écartée au profit d'un renommage minimal.

## Conséquences

- Le PR du fix reste petit et relisible.
- La dette non traitée est **visible et datée** dans `ONBOARDING.md`, pas
  enterrée.
- Le prochain repreneur peut décider en connaissance de cause : soit il
  applique la même règle sur son propre bug, soit il ouvre un chantier
  dédié.

## À toi de compléter

Ce fichier est un template. Rejoue la décision sur **ton** repo réel :

- liste les modules **effectivement** touchés par ton fix.
- pour chaque zone sale aperçue : dis-tu la refactores maintenant, ou tu
  la documentes seulement ? Justifie avec les 4 critères ci-dessus.
- si tu as dérogé à la règle (refonte au-delà du chemin du bug), dis
  pourquoi c'était le bon call ici.
