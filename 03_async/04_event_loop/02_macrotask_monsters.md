---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# MACROTASK MONSTERS
Temps de lecture ~9 min

`setTimeout(() => ..., 0)` ne s'exécute pas immédiatement.
Il s'exécute après tout le code synchrone. Et après toutes les microtasks en attente.
Le `0` là, c'est pas "maintenant" : c'est "dès que l'event loop a une fenêtre".

C'est la source de la moitié des bugs de timing que tu rencontreras en prod.

---

## 1) LA MACROTASK QUEUE

La macrotask queue est la file normale, la file basse priorité.
L'event loop y prend UNE tâche à la fois, puis vérifie la microtask queue, puis revient.

Sources de macrotasks :
- `setTimeout(fn, delay)`
- `setInterval(fn, delay)`
- `requestAnimationFrame(fn)`
- callbacks I/O (lecture de fichier, réponse réseau)
- événements shinobi (click, keydown)

```
EVENT LOOP - UN TOUR COMPLET :

[macrotask] --> exécuter --> [microtask queue] --> vider tout --> [rendu navigateur] --> prochain tour
```

---

## 2) SETTIMEOUT : LE DÉLAI MINIMUM, PAS LE DÉLAI EXACT

`setTimeout(fn, 100)` dit : "attends au minimum 100ms, puis planifie fn".
Pas "exécute fn dans exactement 100ms".

Si l'event loop est occupée (code sync long, microtasks en cascade), le délai réel sera plus long.

```js
const debut = Date.now()

setTimeout(() => {
 const reel = Date.now() - debut
 console.log(`délai réel : ${reel}ms`) // souvent plus que 0
}, 0)

// boucle qui bloque l'event loop pendant 200ms
let i = 0
while (i < 1e8) i++
// le setTimeout s'exécutera après cette boucle, donc ~200ms+
```

C'est pour ça qu'on ne compte pas sur `setTimeout` pour du timing précis.
Pour de l'animation : `requestAnimationFrame`. Pour du timing précis : `performance.now()`.

---

## 3) SETINTERVAL : LA RÉPÉTITION QUI SE DÉCALE

`setInterval` planifie une macrotask toutes les N ms.
Mais si le callback prend plus de N ms, les exécutions se chevauchent ou se perdent.

```js
// Simuler le ticker de stats d'un match de foot en live
let secondes = 0

const ticker = setInterval(() => {
 secondes++
 console.log(`${secondes}ème minute - en cours`)

 if (secondes >= 90) {
  clearInterval(ticker)
  console.log("Fin du match")
 }
}, 1000)
```

Le risque : si le callback dure 1500ms sur un interval de 1000ms, le suivant arrive avant que le précédent soit fini.
En pratique le navigateur compense, mais le timing devient imprévisible.

Pour un interval précis avec des opérations async : pattern `setTimeout` récursif.

```js
// Pattern correct pour interval précis avec async
async function tickerFiable(duree) {
 let secondes = 0

 const tick = async () => {
  secondes++
  await recupererStatsLive() // opération async variable
  console.log(`minute ${secondes}`)

  if (secondes < 90) {
   setTimeout(tick, duree) // planifie le prochain tick après avoir fini
  }
 }

 setTimeout(tick, duree) // premier tick
}
```

---

## 4) REQUESTANIMATIONFRAME : LE MACROTASK DU RENDU

`requestAnimationFrame(fn)` planifie fn juste avant le prochain rendu du navigateur.
C'est une macrotask spéciale : synchronisée avec le refresh screen (60fps = toutes les ~16.6ms).

```js
// Animation fluide du pourcentage de possession
function animerPossession(cible, actuel = 0) {
 if (actuel >= cible) return

 const prochain = Math.min(actuel + 1, cible)
 document.getElementById("possession").textContent = `${prochain}%`

 // planifie la prochaine frame : pas de setTimeout, pas de setInterval
 requestAnimationFrame(() => animerPossession(cible, prochain))
}

animerPossession(67) // animer jusqu'à 67% de possession
```

Pourquoi rAF plutôt que `setInterval(fn, 16)` ?
- rAF est synchronisé avec le vrai cycle de rendu : pas de déchirement visuel
- rAF est suspendu quand l'onglet est en arrière-plan : économie de batterie
- `setInterval(fn, 16)` peut déclencher entre deux frames : rendu gâché

---

## 5) BLOQUER L'EVENT LOOP : LE CRIMINEL NUMÉRO 1

Du code synchrone long bloque tout : setTimeout, rendu, interactions shinobi.

```js
// version shinobi : un shinobi doit repérer les ennemis PENDANT que le combat se déclenche
function analyserMenaces(ennemis) {
 // MAUVAIS : bloque l'UI pendant l'analyse
 let score = 0
 for (let e of ennemis) {
  score += calculerMenace(e) // calcul lourd
 }
 return score
}

// Le bouton "Fermer les portes" ne répond plus pendant analyserMenaces()
// L'animation de la barre de santé se fige
// Les setInterval de garde se décalent
```

La solution : couper le travail en chunks avec setTimeout.

```js
// BIEN : céder l'event loop régulièrement
async function analyserMenacesAsync(zombies) {
 let score = 0

 for (let i = 0; i < zombies.length; i++) {
  score += calculerMenace(zombies[i])

  // toutes les 100 unités, on cède l'event loop
  if (i % 100 === 0) {
   await new Promise(resolve => setTimeout(resolve, 0))
   // l'event loop peut traiter d'autres macrotasks/microtasks ici
  }
 }

 return score
}
```

---

## 6) L'ORDRE COMPLET : RECAP VISUEL

```
ÉTAT INITIAL :
call stack : [main()]

PENDANT L'EXÉCUTION SYNC :
setTimeout(A, 0) --> A va dans macrotask queue
Promise.then(B)  --> B va dans microtask queue
setTimeout(C, 0) --> C va dans macrotask queue
Promise.then(D)  --> D va dans microtask queue

QUAND main() FINIT :
call stack vide --> event loop démarre

TOUR 1 :
 microtask queue : B, D --> B s'exécute, D s'exécute, queue vide
 rendu navigateur (si nécessaire)
 macrotask queue : A, C --> A s'exécute (UN SEUL)

TOUR 2 :
 microtask queue : vide --> rien
 macrotask queue : C   --> C s'exécute

RÉSULTAT : B --> D --> A --> C
```

---

## EXERCICES

## EXO 1 : LA SIMULATION DE MATCH

T'as ce code qui simule les événements d'un match en live.
Il y a un bug : les événements s'affichent dans le mauvais ordre.
Explique pourquoi et corrige sans utiliser `async/await`.

```js
function simulerMatch() {
 setTimeout(() => console.log("But de Messi ! (35e minute)"), 100)

 Promise.resolve().then(() => console.log("Carton jaune (30e minute)"))

 setTimeout(() => console.log("Coup d'envoi (0e minute)"), 0)

 console.log("Les équipes entrent sur le terrain")

 Promise.resolve().then(() => console.log("Coin droit (25e minute)"))
}

simulerMatch()
// l'ordre actuel ne respecte pas la chronologie
// comment le corriger tout en gardant les async calls ?
```

---

## EXO 2 : L'ANIMATION DE CHAKRA

Naruto doit charger son Rasengan. La barre de chakra doit monter de 0 à 100% de façon fluide.
Implémente l'animation avec `requestAnimationFrame` : pas de setInterval.
La barre monte de 2% par frame. Elle s'arrête à 100%.

```js
const barre = document.getElementById("chakra-bar")

function chargerChakra(actuel = 0) {
 // à compléter
 // contrainte : utiliser requestAnimationFrame
 // contrainte : stopper à 100
 // contrainte : mettre à jour barre.style.width = actuel + "%"
}

chargerChakra()
```

---

## EXO 3 : LE ZOMBIE COUNTER SANS FREEZE

Le camp de Rick doit compter 500 000 zombies dans une liste.
La fonction actuelle freeze l'UI pendant le comptage.
Refactore-la pour qu'elle reste responsive : chunk de 1000 zombies à la fois, yield entre chaque chunk.

```js
// AVANT : freeze l'UI
function compterZombies(liste) {
 let dangereux = 0
 for (let z of liste) {
  if (z.niveau > 5) dangereux++
 }
 return dangereux
}

// APRÈS : à toi de l'écrire
// contrainte : retourner une Promise qui résout avec le compte final
// contrainte : utiliser setTimeout(resolve, 0) pour céder l'event loop
async function compterZombiesAsync(liste) {
 // à compléter
}
```

---

## RÉSUMÉ

Les macrotasks (setTimeout, setInterval, rAF, I/O) ont la basse priorité : elles passent après les microtasks.
L'event loop prend UNE macrotask par tour, puis vide toute la microtask queue, puis revient.
`setTimeout(fn, 0)` ne veut pas dire "immédiatement" : ça veut dire "dès que possible, mais pas avant les microtasks".
`requestAnimationFrame` est synchronisé avec le cycle de rendu : c'est le bon outil pour les animations.
Un code sync long bloque tout : découpe en chunks si le calcul est lourd.
