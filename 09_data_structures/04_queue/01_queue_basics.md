---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LA QUEUE : LE PREMIER QUI ARRIVE, C'EST LE PREMIER QUI PASSE
Temps de lecture ~9 min

T'as déjà regardé un match et vu les ultras faire la queue pour rentrer dans le stade ?
Le premier en ligne, c'est le premier à entrer. Pas de passe-droit. Pas de favoritisme.
C'est ça une queue : **FIFO : First In, First Out**.

En dev, tu l'utilises partout sans le savoir :
les requêtes HTTP qui attendent leur tour, les jobs asynchrones, les événements du navigateur, le BFS sur un graphe.
Si tu ne maîtrises pas la queue, t'es un dev qui improvise.

---

## 1) LA STRUCTURE : DEUX EXTRÉMITÉS, UNE SEULE DIRECTION

Une queue a deux bouts :

- **tail (arrière)** : là où les éléments rentrent : c'est `enqueue`
- **head (avant)** : là où les éléments sortent : c'est `dequeue`

```
enqueue --> [ D | C | B | A ] --> dequeue
       tail      head
```

Tu rentres par l'arrière. Tu sors par l'avant.
C'est tout.

La confusion classique : croire que `push/shift` sur un tableau c'est suffisant.
C'est fonctionnel. Mais `shift()` est O(n) : il réindexe tout le tableau à chaque appel.
Sur 10 éléments, personne voit la différence. Sur 100k, ton app rame.

---

## 2) IMPLÉMENTATION : LE NOEUD PAR NOEUD

On construit avec des noeuds liés. Chaque noeud pointe vers le suivant.
Enqueue en queue, dequeue en head : les deux sont O(1).

```js
class Node {
 constructor(value) {
  this.value = value;
  this.next = null;
  // juste une boîte avec une valeur et un pointeur vers la prochaine
 }
}

class Queue {
 constructor() {
  this.head = null; // le prochain à sortir
  this.tail = null; // le dernier entré
  this.size = 0;
 }

 enqueue(value) {
  const node = new Node(value);

  if (!this.tail) {
   // queue vide : head et tail pointent vers le seul noeud
   this.head = node;
   this.tail = node;
  } else {
   // on branche le nouveau noeud à la fin, puis on déplace tail
   this.tail.next = node;
   this.tail = node;
  }

  this.size++;
 }

 dequeue() {
  if (!this.head) return null; // queue vide : rien à sortir

  const value = this.head.value;
  this.head = this.head.next; // on avance head d'un cran

  if (!this.head) {
   // si la queue est devenue vide, tail aussi doit être null
   this.tail = null;
  }

  this.size--;
  return value;
 }

 peek() {
  // regarder sans toucher : qui passe en premier ?
  return this.head ? this.head.value : null;
 }

 isEmpty() {
  return this.size === 0;
 }
}
```

Trace d'exécution mentale, étape par étape :

```
new Queue()       => head: null, tail: null, size: 0

enqueue("Naruto")     => head: [Naruto] <-- tail: [Naruto]  size: 1
enqueue("Sakura")    => head: [Naruto] --> [Sakura] <-- tail  size: 2
enqueue("Sasuke")    => head: [Naruto] --> [Sakura] --> [Sasuke] <-- tail  size: 3

peek()         => "Naruto"  (head reste intact)

dequeue()        => retourne "Naruto"
              head: [Sakura] --> [Sasuke] <-- tail  size: 2

dequeue()        => retourne "Sakura"
              head: [Sasuke] <-- tail  size: 1

dequeue()        => retourne "Sasuke"
              head: null, tail: null  size: 0
```

---

## 3) LE PIÈGE : OUBLIER DE NULLIFIER TAIL

Le bug silencieux classique :

```js
dequeue() {
 if (!this.head) return null

 const value = this.head.value
 this.head = this.head.next
 // BUG : si head devient null, tail pointe encore vers l'ancien noeud
 // enqueue() suivant va brancher sur un noeud orphelin
 this.size--
 return value
}
```

Ce que ça donne :

```js
const q = new Queue();
q.enqueue("Walter");
q.dequeue(); // head = null MAIS tail = ancien noeud Walter

q.enqueue("Jesse"); // this.tail.next = Jesse... mais tail pointe vers un fantôme
q.peek(); // null:Jesse a disparu dans le vide
```

Le fix : vérifier si `this.head` est devenu null après le dequeue, et nullifier tail si c'est le cas.
C'est deux lignes. Leur absence casse tout.

---

## 4) QUEUE AVEC TABLEAU : QUAND C'EST ACCEPTABLE

Pour les cas simples où la taille est connue et petite, un tableau suffit.
Mais tu dois savoir ce que tu sacrifies.

```js
class SimpleQueue {
 constructor() {
  this.items = [];
 }

 enqueue(value) {
  this.items.push(value); // O(1) amorti
 }

 dequeue() {
  return this.items.shift(); // O(n):réindexe tout le tableau
 }

 peek() {
  return this.items[0] ?? null;
 }

 get size() {
  return this.items.length;
 }
}
```

Règle simple :

- queue de 10-100 éléments, usage ponctuel : tableau ok
- queue de 10k+ éléments ou haute fréquence : linked list obligatoire

---

## 5) LE RING BUFFER : LA QUEUE QUI TOURNE

Quand tu connais la taille max à l'avance, le ring buffer donne du O(1) strict : pas de réallocation, pas de shift, pas de noeuds dynamiques.

L'idée : un tableau fixe avec deux pointeurs (`head`, `tail`) qui avancent en boucle.

```
taille = 5

état initial : [ _, _, _, _, _ ]
         ^head ^tail   (vide)

enqueue("A") : [ A, _, _, _, _ ]
         ^head ^tail avance à 1

enqueue("B") : [ A, B, _, _, _ ]
enqueue("C") : [ A, B, C, _, _ ]

dequeue() :   retourne "A"
        head avance à 1
        [ _, B, C, _, _ ]

enqueue("D") : [ _, B, C, D, _ ]
enqueue("E") : [ _, B, C, D, E ]

enqueue("F") : tail revient à 0
        [ F, B, C, D, E ]  -- la boucle
```

```js
class RingBuffer {
 constructor(capacity) {
  this.capacity = capacity;
  this.buffer = new Array(capacity);
  this.head = 0; // prochain à sortir
  this.tail = 0; // prochain emplacement libre
  this.size = 0;
 }

 enqueue(value) {
  if (this.size === this.capacity) {
   throw new Error("RingBuffer plein : t'as dépassé la limite");
  }

  this.buffer[this.tail] = value;
  this.tail = (this.tail + 1) % this.capacity; // boucle avec modulo
  this.size++;
 }

 dequeue() {
  if (this.size === 0) return null;

  const value = this.buffer[this.head];
  this.buffer[this.head] = undefined; // libérer la référence
  this.head = (this.head + 1) % this.capacity;
  this.size--;
  return value;
 }

 peek() {
  return this.size > 0 ? this.buffer[this.head] : null;
 }
}
```

Cas d'usage parfait : buffer d'events de match en temps réel.
Tu gardes les N derniers events. Les vieux s'écrasent.
Pas de malloc, pas de GC, pas de surprise.

---

## EXERCICES

## EXO 1 : LA FILE D'ENTRÉE DU STADE
_~10 min_


Le stade de la Juventus ouvre les portes. Les supporters arrivent dans l'ordre.
Les supporters VIP arrivent avec un tag `"vip"`. Ils passent en premier, toujours.
Les normaux attendent derrière les VIP déjà en file.

Implémenter une `PriorityQueue` basique avec deux queues internes :
une pour les VIP, une pour les normaux.
`dequeue()` vide la queue VIP en premier, puis la normale.

(Indice : deux instances de `Queue` suffit. Pas besoin de heap ici.)

---

## EXO 2 : LE DISPATCHER DE WALTER WHITE
_~15 min_


Walter a un système de dispatch d'appels radio. Les requêtes arrivent dans une queue.
Chaque requête a un `id`, un `destinataire`, et une `priorite`.

Règles :

- Si la queue dépasse 10 requêtes, les nouvelles sont rejetées avec une erreur `"OverflowError"`
- `processNext()` retire et retourne la prochaine requête à traiter
- `status()` retourne `{ enAttente: N, capaciteRestante: M }`

Utilise le RingBuffer vu plus haut. Adapte-le pour les requêtes.

---

## EXO 3 : LE REPLAY D'UN MATCH
_~12 min_


Tu reçois un stream d'events de match (buts, cartons, remplacements).
Chaque event a un `type`, un `joueur`, et une `minute`.

Implémenter `EventReplay` :

- `record(event)` : enregistre l'event dans une queue de taille max 50 (ring buffer)
- `replayFrom(minute)` : retourne tous les events dont la minute >= `minute`
- `latest(n)` : retourne les `n` derniers events enregistrés

(Indice : `replayFrom` nécessite d'itérer sans dequeue. Ajoute une méthode `toArray()` sur ton ring buffer.)

---

## RÉSUMÉ

Une queue c'est FIFO : le premier entré est le premier sorti.
Linked list pour la queue : enqueue et dequeue en O(1), pas de réindexage.
Tableau pour les cas simples : acceptable, mais `shift()` est O(n) : à surveiller.
Ring buffer quand la taille max est connue : O(1) strict, zéro allocation dynamique.
Le bug classique : oublier de nullifier `tail` quand la queue se vide.
