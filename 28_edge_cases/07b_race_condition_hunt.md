---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---

# 07b : Race Condition Hunt (bouclier senior)

Temps de lecture ~7 min

> Compagnon senior de `05_race_condition_hunter.md`. Ici on ne se contente pas
> de reproduire : on **instrumente**, on **falsifie**, on **prouve** que la
> race est morte : pas juste "je n'ai pas vu le bug pendant 5 minutes".

## Principe

Une race condition ne se corrige jamais par observation. Elle se corrige par
une **condition de falsification écrite à l'avance** : "je considérerai le bug
mort si et seulement si test T échoue 0 fois sur N runs sous charge C".

---

## 3 cas silencieux à chasser

### Cas 1 : Double clic sur un formulaire de soumission

- Symptôme : deux entrées créées, ou un paiement dupliqué.
- Fenêtre de course : entre le premier `click` et l'idempotency token posé.
- Piège : le bug disparaît en dev (latence < 50 ms) et sort en prod.
- Instrumentation : logger `event.timeStamp` + `requestId` côté client,
  corréler avec `Idempotency-Key` côté serveur.
- Remède candidat : désactiver le bouton **avant** l'`await`, pas après ;
  clé d'idempotence côté serveur (rejet si vue < 60 s).
- Falsification : script qui envoie deux `POST` à < 20 ms d'intervalle,
  1000 fois. Zéro doublon en base = passé.

### Cas 2 : Requête en vol lors du démontage du composant

- Symptôme : `setState` sur un composant démonté, ou données d'une vue N
  qui écrasent la vue N+1.
- Fenêtre de course : entre `fetch()` et le retour de la promesse, l'utilisateur
  a changé de route.
- Instrumentation : `AbortController` par montage + logger le `requestId` et
  le `mountId` ; assertion "un requestId ne peut committer un state que si
  son mountId est encore actif".
- Remède : `AbortController.abort()` dans le cleanup ; ignorer les réponses
  arrivées après démontage.
- Falsification : test qui monte/démonte 500 fois pendant qu'un mock renvoie
  avec délai aléatoire 0-200 ms. Zéro warning React, zéro state écrasé.

### Cas 3 : Cache LRU concurrent

- Symptôme : deux `get(key)` simultanés déclenchent deux `compute(key)`, la
  valeur en cache oscille, un thread lit une valeur stale.
- Fenêtre de course : entre `cache.has(key) === false` et `cache.set(key, v)`.
- Instrumentation : compteur atomique d'appels à `compute()` ; horodatage
  haute résolution ; journal d'ordonnancement (qui a gagné la course).
- Remède : **coalescing** : stocker la `Promise` en vol dans le cache, pas la
  valeur ; les concurrents attendent la même promesse.
- Falsification : 100 workers demandent la même clé simultanément ; `compute()`
  doit avoir été appelé exactement **1** fois.

---

## Boîte à outils d'instrumentation

- `AsyncLocalStorage` (Node) pour propager un `traceId` sans polluer les signatures.
- `performance.now()` haute résolution ; jamais `Date.now()` pour du timing sous 10 ms.
- Journal d'ordonnancement : buffer append-only vidé à la fin ; **jamais** de
  `console.log` synchrone dans la zone chaude (change le timing, masque le bug).
- Chaos léger : injecter `await new Promise(r => setTimeout(r, Math.random()*50))`
  aux points suspects pour élargir la fenêtre.

## Condition de falsification écrite

Avant de dire "c'est corrigé", tu écris **dans le PR** :

```
Bug considéré mort ssi :
  test <chemin> passe 0 échec sur 10 000 runs
  sous charge C = <N> concurrents
  avec délai injecté [0-D] ms
  observé sur <plateforme/CI>
```

Sans ce paragraphe, la review refuse le merge.

## Livrables

- `HYPOTHESES.md` (voir `30_mini_projects/_templates/04_HYPOTHESES_TEMPLATE.md`).
- Script de reproduction (10k itérations minimum).
- Fix + test qui **casse sans le fix**.
- Condition de falsification écrite.
- ADR (`30_mini_projects/_templates/00_ADR_TEMPLATE.md`).
