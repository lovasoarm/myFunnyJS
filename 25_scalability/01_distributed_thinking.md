---
stability: intemporel
---

# Distributed thinking (sans K8s, sans buzz)
Temps de lecture ~5 min

> **Principe universel** : dès que 2 processus se parlent en réseau, tu es en distribué. Tous les problèmes d'après en découlent.

## 5 idées non négociables

### 1. Idempotence
Faire la même opération deux fois == une fois. Sans ça, retry = corruption.
**Exemple** : `POST /transfer` avec `Idempotency-Key`.

### 2. Retry avec backoff
Retry immédiat = tempête. Retry exponentiel + jitter = poli.
```js
await sleep((2 ** attempt * 100) + Math.random() * 100);
```

### 3. Timeout partout
Sans timeout, une lenteur devient un blocage. Toujours borner.

### 4. Exactly-once delivery = mythe
On atteint **at-least-once** + **idempotence côté receveur** = équivalent fonctionnel.

### 5. Modélise l'échange
Dessine : **qui appelle qui, avec quoi, que se passe-t-il si ça échoue à mi-chemin ?**

## Exercice

Un `POST /pay` déclenche : débit A → crédit B → email.
- Que se passe-t-il si l'email échoue ?
- Que se passe-t-il si le crédit échoue ?
- Que se passe-t-il si le client re-clique ?

Écris le protocole (3 hypothèses de panne, 3 remèdes).

## (attention) Ce que "microservices" cache

Le distribué n'est **pas** un choix architectural, c'est une **conséquence**. Évite-le tant que possible.
