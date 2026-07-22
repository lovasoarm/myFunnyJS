---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 03 : Fuite par closure : autopsie pas-à-pas
Temps de lecture ~5 min

Le GC est intelligent, mais il obéit à une règle bête : **si c'est atteignable, je ne touche pas**. Une closure qui capture un gros objet, c'est une main tendue sur cet objet. Le GC passe, hausse les épaules.

## Le code coupable

```js
function attachHandler(bigData) {
 return function onClick() {
  console.log("clicked")
  // bigData n'est jamais lu, mais capturé
 }
}

const handlers = []
for (let i = 0; i < 1000; i++) {
 handlers.push(attachHandler(new Array(100000).fill(i)))
}
```

Chaque `onClick` maintient vivant un tableau de 100000 entrées. On stocke 1000 handlers. RAM: ~800 MB pour rien.

## Le heap snapshot

```
AVANT boucle : heap ~ 5 MB
APRÈS boucle : heap ~ 810 MB
Retained size de "onClick" : ~800 KB chacun
```

Dans DevTools > Memory > Heap snapshot : filtre par "closure", tu vois les 1000 fonctions et leur `[[Scopes]]` qui pointe sur `bigData`.

## La correction

```js
function attachHandler(bigData) {
 const summary = bigData.length // extrais ce que tu utilises
 return function onClick() {
  console.log("clicked", summary)
 }
}
```

Le scope capturé se réduit à un nombre. Le GC balaie `bigData` dès que `attachHandler` retourne.

## Ce que l'analogie cache

Le moteur V8 fait des optimisations (escape analysis, scope pruning) mais **ne peut pas** deviner ton intention si `bigData` est référencé dans le scope même sans être lu. Ne compte pas sur la magie.

## Mission

Reproduis, mesure avec `process.memoryUsage().heapUsed`, corrige, remesure. Note l'écart en MB.
