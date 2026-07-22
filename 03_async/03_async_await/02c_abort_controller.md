---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
Temps de lecture ~8 min

Ce fichier sort de la numérotation standard. Il couvre un concept connexe à ce chapitre, non bloquant pour la suite. Lis-le si tu veux aller plus loin sur ce point avant de passer au module suivant.

---

# ABORTCONTROLLER : ANNULER CE QUI NE DOIT PLUS SE TERMINER

Tu lances un fetch. L'utilisateur navigue ailleurs. Le fetch continue quand même, consomme de la bande passante, et si la réponse arrive, ton callback s'exécute sur un composant qui n'existe plus. C'est un memory leak classique, et c'est évitable depuis ES2020 avec `AbortController`.

---

## 1) LE PROBLÈME : LE FETCH QUI NE S'ARRÊTE JAMAIS

```js
// le scénario classique : l'utilisateur cherche un joueur
async function rechercherJoueur(nom) {
 const résultat = await fetch(`/api/joueurs?q=${nom}`)
 const data = await résultat.json()
 afficherRésultats(data)  // si le composant est démonté : crash silencieux
}

// l'utilisateur tape vite
rechercherJoueur('Na')   // fetch 1 : en cours
rechercherJoueur('Nar')   // fetch 2 : en cours
rechercherJoueur('Naru')  // fetch 3 : en cours
// les 3 fetches tournent en parallèle, arrivent dans un ordre imprévisible
// le fetch 2 peut arriver après le fetch 3 et écraser les bons résultats
```

Sans annulation : les requêtes obsolètes arrivent, s'exécutent, et peuvent corrompre l'état.

---

## 2) ABORTCONTROLLER : LA MÉCANIQUE

```
AbortController
  |
  +-- .signal  --> AbortSignal : passé aux opérations à contrôler
  |
  +-- .abort()  --> déclenche l'annulation sur toutes les opérations qui écoutent ce signal
```

```js
const controller = new AbortController()
const signal = controller.signal // l'objet qu'on passe aux opérations

// passer le signal à fetch : fetch l'écoute nativement
const réponse = await fetch('/api/joueurs', { signal })

// annuler depuis n'importe où :
controller.abort() // le fetch est annulé, lance une DOMException 'AbortError'
```

`signal` est l'AbortSignal (signal d'abandon). `fetch` le connaît nativement : dès que `.abort()` est appelé, le fetch en cours est annulé et lance une erreur de type `AbortError`.

---

## 3) PATTERN COMPLET : DEBOUNCE + ABORT

```js
let controller = null

async function rechercherJoueur(nom) {
 // annuler la requête précédente si elle est encore en cours
 if (controller) {
  controller.abort()
 }

 // créer un nouveau controller pour cette requête
 controller = new AbortController()

 try {
  const réponse = await fetch(`/api/joueurs?q=${nom}`, {
   signal: controller.signal
  })
  const data = await réponse.json()
  afficherRésultats(data)
 } catch (err) {
  if (err.name === 'AbortError') {
   // annulation volontaire : ne pas traiter comme une vraie erreur
   return
  }
  // vraie erreur réseau : la propager
  throw err
 }
}

// maintenant si l'utilisateur tape vite :
rechercherJoueur('Na')  // fetch lancé
rechercherJoueur('Nar')  // fetch précédent annulé, nouveau lancé
rechercherJoueur('Naru') // fetch précédent annulé, nouveau lancé
// seule la dernière requête aboutit
```

La distinction `err.name === 'AbortError'` est obligatoire : une annulation volontaire n'est pas une erreur réseau. Si tu l'ignores, ton error handler va traiter toutes les annulations comme des bugs.

---

## 4) TIMEOUT AVEC ABORTCONTROLLER

`AbortController` remplace le pattern manuel de timeout sur fetch :

```js
// avant : simuler un timeout à la main
async function fetchAvecTimeout(url, ms) {
 const promesseFetch = fetch(url)
 const promesseTimeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('timeout')), ms)
 )
 return Promise.race([promesseFetch, promesseTimeout])
 // PROBLÈME : le fetch continue en arrière-plan même si le timeout gagne
}

// avec AbortController : annulation propre
async function fetchAvecTimeout(url, ms) {
 const controller = new AbortController()

 const timeoutId = setTimeout(() => {
  controller.abort()   // annule le fetch après ms millisecondes
 }, ms)

 try {
  const réponse = await fetch(url, { signal: controller.signal })
  clearTimeout(timeoutId) // réponse arrivée à temps : annuler le timeout
  return await réponse.json()
 } catch (err) {
  if (err.name === 'AbortError') {
   throw new Error(`Timeout : pas de réponse après ${ms}ms`)
  }
  throw err
 }
}
```

La différence avec `Promise.race` : avec `Promise.race` le fetch continue à consommer des ressources en arrière-plan même après le timeout. `AbortController` annule vraiment le fetch.

---

## 5) SIGNAL.ABORTED ET SIGNAL SUR D'AUTRES OPÉRATIONS

```js
const controller = new AbortController()

// vérifier si le signal est déjà aborted (annulé)
console.log(controller.signal.aborted) // false

controller.abort()

console.log(controller.signal.aborted) // true

// écouter l'événement d'annulation manuellement
controller.signal.addEventListener('abort', () => {
 console.log('annulé, raison :', controller.signal.reason)
})
controller.abort('utilisateur a navigué ailleurs')
// affiche : "annulé, raison : utilisateur a navigué ailleurs"

// abort() avec raison (ES2022)
controller.abort(new Error('timeout dépassé')) // la raison peut être une Error
```

`signal.aborted` est utile pour vérifier l'état avant une longue opération : si le signal est déjà aborted, inutile de la démarrer.

---

## 6) L'EXEMPLE QUI CASSE : RÉUTILISER UN CONTROLLER APRÈS ABORT

```js
const controller = new AbortController()

controller.abort() // annulé

// ERREUR : tenter de réutiliser le même controller pour une nouvelle requête
const réponse = await fetch('/api/data', { signal: controller.signal })
// le signal est déjà aborted : le fetch est annulé IMMÉDIATEMENT, avant même de commencer

// CORRECT : créer un nouveau controller pour chaque requête
const controller2 = new AbortController()
const réponse2 = await fetch('/api/data', { signal: controller2.signal })
```

Un `AbortController` est à usage unique. Une fois `.abort()` appelé, son signal reste `aborted: true` pour toujours. Pour une nouvelle requête, il faut un nouveau controller.

---

## EXERCICES

## EXO 1 : la recherche live sans spam

Le moteur de recherche du dashboard Champions League envoie une requête à chaque frappe de clavier. Sans AbortController : si l'utilisateur tape "Mbappé" en 300ms, 6 requêtes partent, arrivent dans un ordre aléatoire, et le résultat final peut être celui de "M" plutôt que "Mbappé".

Implémente une fonction `rechercheJoueur(nom)` qui :
- Annule automatiquement la requête précédente avant d'en lancer une nouvelle.
- Ignore silencieusement les AbortError.
- Propage les vraies erreurs réseau.
- Retourne `null` si la requête est annulée avant de se terminer.

Teste que si tu appelles `rechercheJoueur('M')` puis immédiatement `rechercheJoueur('Mbappé')`, seule la deuxième requête aboutit.

---

## EXO 2 : le fetch avec deadline de Michael Scofield

Michael a 5 secondes pour récupérer le plan de la section C avant que le gardien ne revienne. Si la réponse ne revient pas dans les 5 secondes : annuler, ne pas attendre, passer au plan B.

Implémente `fetchAvecDeadline(url, secondes)` :
- Utilise `AbortController` pour un timeout propre (pas `Promise.race` seul).
- Si le timeout s'écoule : throw une `DeadlineError` avec le message `"délai dépassé : ${secondes}s"`.
- Si la requête réussit avant le timeout : retourner les données et s'assurer que le timer est bien annulé (pas de fuite).
- Si la requête échoue pour une vraie erreur réseau : propager cette erreur, pas une DeadlineError.

---

## RÉSUMÉ

`AbortController` permet d'annuler des opérations asynchrones : fetch, mais aussi n'importe quoi qui accepte un `AbortSignal`.
Un `AbortController` est à usage unique : une fois `.abort()` appelé, son signal reste aborted. Créer un nouveau controller par requête.
Toujours distinguer `AbortError` (annulation volontaire) des vraies erreurs réseau.
`signal.aborted` permet de vérifier l'état avant de démarrer une opération longue.
`setTimeout + controller.abort()` est plus propre que `Promise.race` pour les timeouts : la requête est vraiment annulée, pas juste ignorée.
