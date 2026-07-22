---
stability: intemporel
---

# _EXEMPLE_HYPOTHESES.md (cas reel)

Temps de lecture ~2 min


## Contexte
- symptome : la RAM du process node passe de 80 Mo a 900 Mo en 20 min sous charge.
- environnement : Node 20.11, prod-like, 100 req/s.
- reproductible : oui, `autocannon -c 50 -d 300` reproduit a 100 %.

## Hypothese 1 : fuite via listener non retire
- enonce : chaque req attache un listener a un EventEmitter global jamais retire.
- test : `emitter.listenerCount('req')` apres 1000 req.
- resultat : 1000 listeners.
- verdict : VRAIE.

## Hypothese 2 : cache LRU sans borne
- enonce : le cache `Map` interne n'a pas de limite.
- test : `cache.size` apres 5 min.
- resultat : 42 entrees stables.
- verdict : FAUSSE.

## Cause racine confirmee
- preuve : heap snapshot montre les 1000 closures referencees par l'emitter.
- correctif : `emitter.once` ou `off()` en fin de req.
- non-regression : test unitaire `assert(emitter.listenerCount('req') === 0)` apres 100 req simulees.
