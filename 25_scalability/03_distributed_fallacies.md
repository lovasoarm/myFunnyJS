---
stability: intemporel
---

# Les 8 sophismes du distribué (fallacies)
Temps de lecture ~5 min

> **INTEMPOREL** : formulés par Peter Deutsch chez Sun en 1994. Toujours vrais
> en 2026. Le seront en 2036. Aucun framework ne les efface.

Chaque sophisme est une **croyance implicite fausse** que ton code trahit
souvent sans que tu le saches.

## Les 8

1. **Le réseau est fiable.** → Il ne l'est pas. Timeouts obligatoires.
2. **La latence est nulle.** → 100 appels séquentiels = 100 × RTT.
3. **La bande passante est infinie.** → Payload matters. Compresse, pagine.
4. **Le réseau est sécurisé.** → Chiffre en transit, jamais de "trust the LAN".
5. **La topologie ne change pas.** → Elle change (scaling, panne, DNS).
6. **Il y a un seul administrateur.** → Il y a N équipes, N horaires.
7. **Le coût de transport est nul.** → Egress cloud = cher (FinOps).
8. **Le réseau est homogène.** → HTTP/1, HTTP/2, gRPC, mobile 3G, edge…

## 5 outils universels

### Idempotence
`POST /transfer` avec `Idempotency-Key: uuid`. Rejouer = même effet.

### Retry avec backoff exponentiel + jitter

```js
async function retry(fn, { max = 5 } = {}) {
 for (let i = 0; i < max; i++) {
  try { return await fn(); }
  catch (e) {
   if (i === max - 1) throw e;
   const wait = Math.min(30_000, (2 ** i) * 100) + Math.random() * 100;
   await new Promise(r => setTimeout(r, wait));
  }
 }
}
```

Le **jitter** évite la "thundering herd" (tout le monde retente à la même ms).

### Timeouts
Aucun appel réseau sans `AbortController` + `signal`. Sans timeout, une
lenteur devient un blocage global.

### Circuit breaker (conceptuel)
Trois états : `closed` (normal) → `open` (on court-circuite après N échecs)
→ `half-open` (on retente un appel de test). Empêche d'écrouler un service
déjà malade.

### Exactly-once = mythe
On atteint **at-least-once** + **idempotence côté receveur** = équivalent
fonctionnel. C'est tout ce que tu auras jamais.

## Exercice de modélisation

Un tir au but est validé pendant un match. Le serveur :
1. écrit le but en DB,
2. appelle le service de stats externes,
3. envoie une notification au coach.

Dessine sur papier :
- Que se passe-t-il si (2) répond après le timeout de l'arbitre vidéo ?
- Que se passe-t-il si (3) réussit mais (1) est rollback (le but n'est plus en DB) ?
- Quelle propriété manque pour rendre le retour au tableau d'affichage "sûr" ?

Réponse : la **transaction sortante** (outbox pattern). Cherche pourquoi,
puis écris ta réponse dans `MODELE.md`.

## (attention) Ce que l'analogie "appel de fonction" cache

Un appel réseau **ressemble** à un appel de fonction (même syntaxe `await`).
Il n'en est pas un : il peut échouer, être dupliqué, arriver hors ordre,
partir sans jamais revenir. Traite-le comme tel.

## Transférable

Ces 8 fallacies sont vraies en Go, Java, Rust, Python. Le vocabulaire "queue,
consumer, backoff" est identique. Le module reste valide sans JS.
