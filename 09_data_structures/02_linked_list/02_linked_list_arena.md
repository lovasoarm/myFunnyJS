---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LINKED LIST ARENA : INVERSER, DÉTECTER UN CYCLE, TROUVER LE MILIEU
Temps de lecture ~9 min

Les opérations de base c'est bien. Mais les linked lists ont trois problèmes classiques qui reviennent partout : en entretien, en prod, et dans les algorithmes plus complexes.

Ces trois problèmes ont quelque chose en commun : la solution naïve est évidente. La vraie solution utilise des techniques qui semblent magiques jusqu'à ce qu'on comprenne pourquoi elles marchent.

---

## 1) INVERSER UNE LISTE : O(n) en temps, O(1) en mémoire

La version naïve : convertir en tableau, inverser, reconstruire. O(n) en mémoire supplémentaire.

La vraie version : on retourne les pointeurs **sur place**. On a besoin de trois variables : `prev`, `current`, `next`.

```
Avant : null <-- [A] --> [B] --> [C] --> [D] --> null
          head

On veut : null <-- [A] <-- [B] <-- [C] <-- [D]
                      head
```

L'idée : parcourir la liste une fois, et à chaque node, inverser le `next` pour qu'il pointe vers le node précédent.

```js
reverse() {
 let prev = null   // le node "derrière" le curseur
 let current = this.head // le curseur

 // l'ancien head devient le nouveau tail
 this.tail = this.head

 while (current) {
  const next = current.next // on sauvegarde le suivant avant de l'écraser
  current.next = prev    // on inverse le pointeur
  prev = current       // on avance prev
  current = next       // on avance current
 }

 this.head = prev // prev pointe vers le dernier node traité : le nouveau head
}
```

Étape par étape sur `[A] --> [B] --> [C]` :

```
Étape 0 : prev=null, current=A
 next = B
 A.next = null  (A pointe maintenant vers null)
 prev = A
 current = B

Étape 1 : prev=A, current=B
 next = C
 B.next = A   (B pointe maintenant vers A)
 prev = B
 current = C

Étape 2 : prev=B, current=C
 next = null
 C.next = B   (C pointe maintenant vers B)
 prev = C
 current = null

Fin de boucle. head = C.

Résultat : null <-- [A] <-- [B] <-- [C]
                   head
```

---

## 2) DÉTECTER UN CYCLE : L'ALGORITHME DE FLOYD

Une liste avec un cycle ressemble à ça :

```
[A] --> [B] --> [C] --> [D] --> [E]
             ↑     |
             └──────────┘
            (E pointe vers C : cycle)
```

Si tu traverses cette liste avec un `while (current)`, tu boucles infiniment. `current.next` ne sera jamais `null`.

**La détection naïve** : stocker les nodes visités dans un `Set`, vérifier si on revoit le même. O(n) en temps **et** en mémoire.

**L'algorithme de Floyd (tortue et lièvre)** : O(n) en temps, O(1) en mémoire.

Deux pointeurs avancent à des vitesses différentes :
- **slow** : avance d'un node à la fois
- **fast** : avance de deux nodes à la fois

Si un cycle existe, fast rattrapera slow à l'intérieur du cycle.

```js
hasCycle() {
 let slow = this.head
 let fast = this.head

 while (fast && fast.next) {
  slow = slow.next     // avance d'un cran
  fast = fast.next.next   // avance de deux crans

  if (slow === fast) return true // ils se rejoignent : cycle détecté
 }

 return false // fast a atteint null : pas de cycle
}
```

**Pourquoi fast rattrape slow ?**

```
Cycle de longueur C. fast et slow sont dans le cycle.
À chaque tour, fast gagne 1 position sur slow.
Après au plus C tours, l'écart se réduit à 0.
Ils se rencontrent.
```

Ce n'est pas de la magie. C'est de la physique : deux coureurs en rond, le plus rapide double toujours le plus lent.

---

## 3) TROUVER LE MILIEU : DEUX POINTEURS ENCORE

Approche naïve : compter les nodes, diviser par 2, retraverser jusqu'au milieu. O(n) mais deux passes.

Avec deux pointeurs :
- **slow** : avance d'un node
- **fast** : avance de deux nodes

Quand `fast` atteint la fin, `slow` est au milieu. Une seule passe.

```js
findMiddle() {
 let slow = this.head
 let fast = this.head

 while (fast && fast.next) {
  slow = slow.next
  fast = fast.next.next
 }

 return slow // slow est au milieu
}
```

Visualisation sur `[A] --> [B] --> [C] --> [D] --> [E]` :

```
Start : slow=A, fast=A
Tour 1 : slow=B, fast=C
Tour 2 : slow=C, fast=E (fast.next = null, boucle s'arrête)
Résultat : slow=C (le milieu)
```

Sur une liste paire `[A] --> [B] --> [C] --> [D]` :

```
Start : slow=A, fast=A
Tour 1 : slow=B, fast=C
Tour 2 : slow=C, fast=null (fast.next.next n'existe pas)
     Attends : fast=D, fast.next=null, boucle s'arrête
Résultat : slow=C (le premier des deux du milieu)
```

---

## 4) LES TROIS ENSEMBLE : UN EXEMPLE RÉEL

```js
class Node {
 constructor(value) {
  this.value = value
  this.next = null
 }
}

class LinkedList {
 constructor() {
  this.head = null
  this.tail = null
  this.size = 0
 }

 append(value) {
  const node = new Node(value)
  if (!this.head) { this.head = node; this.tail = node }
  else { this.tail.next = node; this.tail = node }
  this.size++
 }

 reverse() {
  let prev = null
  let current = this.head
  this.tail = this.head
  while (current) {
   const next = current.next
   current.next = prev
   prev = current
   current = next
  }
  this.head = prev
 }

 hasCycle() {
  let slow = this.head
  let fast = this.head
  while (fast && fast.next) {
   slow = slow.next
   fast = fast.next.next
   if (slow === fast) return true
  }
  return false
 }

 findMiddle() {
  let slow = this.head
  let fast = this.head
  while (fast && fast.next) {
   slow = slow.next
   fast = fast.next.next
  }
  return slow
 }

 print() {
  const values = []
  let current = this.head
  let count = 0
  while (current && count < 100) { // garde-fou contre les cycles
   values.push(current.value)
   current = current.next
   count++
  }
  return values.join(" --> ")
 }
}

// test
const arc = new LinkedList()
arc.append("Naruto")
arc.append("Sakura")
arc.append("Sasuke")
arc.append("Kakashi")
arc.append("Tsunade")

console.log(arc.print())
// "Naruto --> Sakura --> Sasuke --> Kakashi --> Tsunade"

console.log(arc.findMiddle().value)
// "Sasuke"

arc.reverse()
console.log(arc.print())
// "Tsunade --> Kakashi --> Sasuke --> Sakura --> Naruto"

console.log(arc.hasCycle())
// false

// créer un cycle manuellement pour tester
arc.tail.next = arc.head.next // Naruto pointe vers Kakashi : cycle
console.log(arc.hasCycle())
// true
```

---

## EXERCICES

## EXO 1 : La liste palindrome
_~20 min_

Écris une fonction `isPalindrome(list)` qui vérifie si les valeurs d'une linked list sont les mêmes dans les deux sens. Contrainte : tu peux utiliser `findMiddle` et `reverse` comme sous-fonctions. Teste sur `[1, 2, 3, 2, 1]` (palindrome) et `[1, 2, 3]` (non palindrome).

## EXO 2 : Supprimer le Nème depuis la fin
_~15 min_

Écris `removeNthFromEnd(n)` qui supprime le Nème node en partant de la fin. Contrainte : une seule passe. Pas de comptage préalable.

(indice : deux pointeurs avec un écart de N nodes entre eux)

## EXO 3 : Le noeud de jonction
_~25 min_

Deux linked lists fusionnent à un certain point et partagent la suite. Trouve le premier node commun sans utiliser de Set.

```
List A : [1] --> [3] --> [5] ──┐
                 +--> [8] --> [10] --> null
List B :    [2] --> [4] ──┘
```

(indice : aligne les deux listes par la fin, puis avance en parallèle)

---

## RÉSUMÉ

Inverser une liste c'est inverser les pointeurs un par un avec trois variables : `prev`, `current`, `next`. O(n) en temps, O(1) en mémoire : pas de copie, pas de tableau intermédiaire. Détecter un cycle c'est Floyd : deux pointeurs à des vitesses différentes se retrouvent toujours dans un cycle. Trouver le milieu c'est le même principe : slow avance d'un pas, fast de deux, quand fast est à la fin slow est au milieu. Ces trois patterns utilisent tous le même outil : **deux pointeurs qui avancent à des rythmes différents**. Reconnaître ce pattern c'est ce qui fait la différence.
