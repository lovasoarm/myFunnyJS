## CONTEXTE

Une promesse qui traîne bloque un écran. `Promise.race` permet de poser un délai maximal sur l'appel GitHub du portfolio.

## APPLICATION

- Écris un helper `withTimeout(promise, ms)` basé sur `Promise.race`.
- Applique-le à ton fetch GitHub avec 2 secondes.
- Vérifie que la page s'affiche même si l'API ne répond pas (simule avec une URL injoignable).

## Vérification

Que devient la promesse perdante de la course, et pourquoi est-ce important de le savoir ?

##Ton appel GitHub ne peut plus bloquer la page

Le portfolio reste rapide même quand un service tiers rame. Commit `withTimeout`.
