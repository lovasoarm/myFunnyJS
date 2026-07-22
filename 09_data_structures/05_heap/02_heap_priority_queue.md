---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# PRIORITY QUEUE : LES URGENCES PASSENT DEVANT
Temps de lecture ~9 min

Un tableau trié c'est lent. Une simple queue c'est aveugle. Une priority queue c'est les deux ensemble : O(log n) à l'insertion, O(log n) à l'extraction, et le plus urgent sort toujours en premier.

Cas réels : Dijkstra, schedulers de tâches, systèmes d'alerte, files hospitalières. Dès que "traiter dans l'ordre d'importance" est un besoin, la priority queue est la bonne structure.

---

## 1) CE QU'EST UNE PRIORITY QUEUE

C'est un heap avec une interface propre.

Tu ne dis plus "insère 42 à l'index 3". Tu dis "insère cette tâche avec priorité 8". La structure gère le reste. L'extraction sort toujours l'élément de priorité maximale (ou minimale, selon le type de heap).

```
enqueue(item, priority) --> insère et réorganise en O(log n)
dequeue()        --> extrait la priorité max/min en O(log n)
peek()          --> lit sans extraire en O(1)
```

Diagramme : queue de missions de Naruto

```
priorité haute [MISSION S : détruire Akatsuki]
        [MISSION A : escorter Kazekage]
        [MISSION B : sécuriser le pont]
priorité basse [MISSION C : livrer un colis]

dequeue() --> sort toujours la mission S
```

---

## 2) IMPLÉMENTER UNE PRIORITY QUEUE SUR UN MAX-HEAP

On part du heap du fichier précédent. On wrap avec une interface claire.

```js
class PriorityQueue {
 constructor() {
  // chaque noeud : { value, priority }
  this.heap = []
 }

 // taille actuelle
 size() {
  return this.heap.length
 }

 isEmpty() {
  return this.heap.length === 0
 }

 // lire le max sans l'extraire
 peek() {
  return this.heap[0] ?? null
 }

 // indices parent / enfants
 _parentIdx(i)   { return Math.floor((i - 1) / 2) }
 _leftChildIdx(i)  { return 2 * i + 1 }
 _rightChildIdx(i) { return 2 * i + 2 }

 _swap(i, j) {
  ;[this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
 }

 // remonter après insertion
 _bubbleUp(idx) {
  while (idx > 0) {
   const parent = this._parentIdx(idx)
   if (this.heap[parent].priority >= this.heap[idx].priority) break
   this._swap(parent, idx)
   idx = parent
  }
 }

 // descendre après extraction
 _sinkDown(idx) {
  const n = this.heap.length

  while (true) {
   const left = this._leftChildIdx(idx)
   const right = this._rightChildIdx(idx)
   let largest = idx

   if (left < n && this.heap[left].priority > this.heap[largest].priority) {
    largest = left
   }
   if (right < n && this.heap[right].priority > this.heap[largest].priority) {
    largest = right
   }

   if (largest === idx) break
   this._swap(idx, largest)
   idx = largest
  }
 }

 // insertion : O(log n)
 enqueue(value, priority) {
  this.heap.push({ value, priority })
  this._bubbleUp(this.heap.length - 1)
 }

 // extraction du max : O(log n)
 dequeue() {
  if (this.isEmpty()) return null

  const max = this.heap[0]
  const last = this.heap.pop()

  // si le heap n'est pas vide après le pop, on replace la racine
  if (this.heap.length > 0) {
   this.heap[0] = last
   this._sinkDown(0)
  }

  return max
 }
}
```

---

## 3) EN ACTION : SCHEDULER DE MISSIONS NINJA

```js
const pq = new PriorityQueue()

// les missions arrivent dans le désordre
pq.enqueue("Livrer un colis à Konoha",  1)
pq.enqueue("Escorter le Kazekage",    7)
pq.enqueue("Détruire l'Akatsuki",     10)
pq.enqueue("Sécuriser le pont du Pays des Vagues", 5)
pq.enqueue("Capturer le voleur du village", 3)

// Naruto traite toujours la plus urgente d'abord
while (!pq.isEmpty()) {
 const mission = pq.dequeue()
 console.log(`[Priorité ${mission.priority}] ${mission.value}`)
}

// Sortie garantie :
// [Priorité 10] Détruire l'Akatsuki
// [Priorité 7] Escorter le Kazekage
// [Priorité 5] Sécuriser le pont du Pays des Vagues
// [Priorité 3] Capturer le voleur du village
// [Priorité 1] Livrer un colis à Konoha
```

L'ordre d'insertion ne compte pas. Seule la priorité compte.

---

## 4) PRIORITY QUEUE AVEC ÉGALITÉ DE PRIORITÉ

Deux missions au même niveau : que se passe-t-il ?

Par défaut, le heap ne garantit rien entre deux éléments de même priorité. Si l'ordre d'arrivée compte (FIFO à priorité égale), tu ajoutes un timestamp comme critère secondaire.

```js
class StablePriorityQueue {
 constructor() {
  this.heap = []
  this.insertionOrder = 0
 }

 enqueue(value, priority) {
  // à priorité égale, le plus ancien sort d'abord
  // on inverse l'ordre d'insertion pour que le plus petit = le plus ancien
  this.heap.push({ value, priority, seq: this.insertionOrder++ })
  this._bubbleUp(this.heap.length - 1)
 }

 _compare(a, b) {
  // priorité plus haute gagne
  if (a.priority !== b.priority) return a.priority > b.priority
  // à égalité : le plus ancien gagne (seq plus petit = arrivé avant)
  return a.seq < b.seq
 }

 // ... reste identique mais _bubbleUp/_sinkDown utilisent _compare
}
```

Cas réel : un hôpital triage. Deux patients en état critique arrivent. Même priorité médicale : le premier arrivé passe en premier.

---

## 5) MIN-HEAP PRIORITY QUEUE

Pour Dijkstra et les algos de chemin minimal, tu veux extraire le coût le plus faible. Même structure, une seule inversion de comparaison.

```js
// dans _bubbleUp : remplace >= par <=
// dans _sinkDown : remplace > par <

// exemple : distances dans un graphe de distribution de Walter White
const distances = new MinPriorityQueue()
distances.enqueue("Albuquerque", 0)  // point de départ
distances.enqueue("Santa Fe",  45)
distances.enqueue("Roswell",  120)
distances.enqueue("El Paso",   95)

distances.dequeue() // --> { value: "Albuquerque", priority: 0 }
distances.dequeue() // --> { value: "Santa Fe", priority: 45 }
// Dijkstra traite toujours le noeud le plus proche d'abord
```

---

## 6) COMPLEXITÉ

```
enqueue  --> O(log n) : bubble up au pire jusqu'à la racine
dequeue  --> O(log n) : sink down au pire jusqu'à une feuille
peek    --> O(1)   : juste lire heap[0]
build   --> O(n)   : heapify sur un tableau existant
```

Comparaison avec d'autres structures pour "traiter par priorité" :

```
Tableau trié    --> insertion O(n)  / extraction O(1)
Tableau non trié  --> insertion O(1)  / extraction O(n)
Priority Queue   --> insertion O(log n) / extraction O(log n)
```

La priority queue gagne dès que tu as beaucoup d'insertions ET de défilages intercalés.

---

## EXERCICES

## EXO 1 : la salle de triage de l'hôpital de Konoha
_~20 min_


L'hôpital ninja reçoit des blessés après la bataille de Pain. Chaque blessé a un niveau de gravité de 1 (contusion légère) à 10 (urgence vitale). Tsunade traite toujours le plus grave en premier.

Implémente un système qui :
- prend en entrée un tableau de `{ nom, gravité }` dans le désordre
- traite chaque blessé dans l'ordre de priorité
- affiche l'ordre de traitement

(Contrainte : utilise uniquement PriorityQueue, pas de `.sort()`)

---

## EXO 2 : le scheduler de tâches de Saul Goodman
_~15 min_


Saul a une liste de tâches juridiques avec des deadlines et des priorités. Deux règles :
- une tâche de priorité haute passe avant une basse, peu importe la deadline
- à priorité égale, la deadline la plus proche passe en premier

Implémente une `LegalPriorityQueue` qui respecte ces deux règles. La méthode `dequeue()` doit toujours retourner la bonne tâche.

(Indice : le critère de comparaison devient composite : `priority` d'abord, `deadline` ensuite)

---

## EXO 3 : Dijkstra sur un réseau de métro
_~25 min_


Tu as un graphe de 5 stations de métro représenté en adjacency list avec des poids (temps de trajet en minutes). Utilise une MinPriorityQueue pour implémenter Dijkstra et trouver le chemin le plus rapide depuis la station A vers toutes les autres.

```js
const metro = {
 A: [{ station: "B", temps: 4 }, { station: "C", temps: 2 }],
 B: [{ station: "C", temps: 1 }, { station: "D", temps: 5 }],
 C: [{ station: "B", temps: 1 }, { station: "D", temps: 8 }, { station: "E", temps: 10 }],
 D: [{ station: "E", temps: 2 }],
 E: []
}
```

Résultat attendu : distances minimales depuis A vers chaque station.

---

## RÉSUMÉ

Une priority queue c'est un heap avec une interface métier. Enqueue avec une priorité, dequeue en ordre garanti. O(log n) dans les deux sens. À priorité égale, ajoute un critère secondaire (timestamp, deadline) pour stabiliser. La version min-heap est le moteur de Dijkstra : indispensable dans le module 10_algorithms.
