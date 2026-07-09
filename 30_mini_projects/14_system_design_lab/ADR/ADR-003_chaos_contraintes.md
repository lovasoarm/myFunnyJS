---
stability: intemporel
---

# ADR-003 : bascule sous contraintes chaos

## Statut
À compléter par l'apprenant.

## Contexte

Le design initial (voir `ADR-001_decision.md` pour le choix Redis vs
RabbitMQ, `ADR-002_idempotence.md` pour la stratégie d'idempotence) a été
posé sous des hypothèses stables : latence bornée, débit connu, panne
isolée. La VARIANTE CHAOS du README (section obligatoire) casse au moins
deux de ces hypothèses en cours de route : pic 10× brutal + coupure
réseau intermittente entre les deux services.

Ce document capture l'arbitrage sous ce nouveau régime : ce qui tient,
ce qui plie, ce qu'on sacrifie explicitement, et pourquoi.

## Décision

**À écrire par toi.** Trois questions à trancher, une réponse par
question, une phrase de justification chacune :

1. **Retry & backoff** : est-ce que la stratégie initiale (retry N fois,
   backoff exponentiel) survit au pic 10× sans amplifier la panne ?
   Sinon, qu'est-ce que tu changes (cap, jitter, circuit breaker) ?
2. **Idempotence** : la clé d'idempotence tient-elle sous coupure
   réseau intermittente (double émission côté producteur, ordre altéré) ?
   Que sacrifies-tu si non : exactly-once, at-least-once, ordering ?
3. **Backpressure** : le service consommateur peut-il refuser du travail
   proprement, ou est-ce qu'il tombe sous la charge ? Où mets-tu la
   limite (queue bornée, rejet 429, dégradation) ?

## Trade-off assumé

Une seule phrase, ferme : "sous chaos, je préserve X, j'abandonne Y,
parce que Z". Sans "peut-être", sans "dans l'idéal". C'est l'arbitrage
d'un ingénieur, pas une liste d'options.

## Alternatives écartées

Une par alternative sérieusement envisagée, une raison objective par
alternative. Pas de "trop compliqué" : dis pourquoi c'était compliqué
et pourquoi ça ne valait pas le coût ici.

## Conséquences

- Ce qui change dans le code par rapport au design nominal.
- Ce qui devient observable (nouvelles métriques, logs, alertes) et
  pourquoi ces signaux-là et pas d'autres.
- Ce que le prochain incident va probablement révéler comme angle mort
  résiduel.

## À toi de compléter

Ce template est volontairement vide sur les décisions : la valeur
pédagogique est dans **ton** arbitrage sous chaos, pas dans le mien.
Contrairement à ADR-001 et ADR-002 qui sont fournis comme références, ce
document est un livrable d'exercice.
