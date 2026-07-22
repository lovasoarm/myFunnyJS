---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LINKED LIST : POINTER VERS LE SUIVANT, PAS VERS L'INDEX
Temps de lecture ~9 min

Un tableau stocke tout en blocs contigus. C'est pour ça qu'il est rapide à lire par index. Mais si tu veux insérer un élément au milieu, tout le monde décale.

Une linked list fait le contraire. Les éléments peuvent être n'importe où en mémoire. Chaque élément connaît juste son voisin. Insérer en milieu de liste : O(1) une fois qu'on est au bon endroit. Lire par index : O(n), il faut traverser depuis le début.

C'est un compromis différent. Pas meilleur. Pas moins bon. Différent.

---

## 1) LE NODE : L'UNITÉ DE BASE

Chaque élément d'une linked list est un **Node**. Un node contient deux choses :
- une **valeur**
- une **référence vers le node suivant**

```js
// la structure la plus simple possible
class Node {
 constructor(value) {
  this.value = value // la donnée
  this.next = null  // le pointeur vers le suivant
 }
}
```

Visuellement :

```
Node A       Node B       Node C
┌─────────┬──────┐ ┌─────────┬──────┐ ┌─────────┬──────┐
│ "Naruto" │ ●───┼─>│ "Sasuke" │ ●───┼─>│ "Sakura" │ null │
└─────────┴──────┘ └─────────┴──────┘ └─────────┴──────┘
```

Chaque node ne sait pas où il est. Il sait juste qui vient après lui.

---

## 2) LA LINKED LIST : HEAD ET TAIL

La liste connaît deux choses : son premier élément (**head**) et son dernier (**tail**). C'est tout. Aucun index. Aucun compteur de position.

```js
class LinkedList {
 constructor() {
  this.head = null // premier node
  this.tail = null // dernier node
  this.size = 0   // optionnel mais utile
 }
}
```

```
head                 tail
 ↓                   ↓
[Naruto] --> [Sasuke] --> [Sakura] --> [Kakashi] --> null
```

Pour atteindre Sakura, il faut partir de `head` et suivre les pointeurs. Pas de raccourci.

---

## 3) APPEND : AJOUTER À LA FIN : O(1)

```js
append(value) {
 const node = new Node(value)

 if (!this.head) {
  // liste vide : head et tail pointent vers le même node
  this.head = node
  this.tail = node
 } else {
  // le dernier node pointe vers le nouveau
  this.tail.next = node
  // tail devient le nouveau node
  this.tail = node
 }

 this.size++
}
```

```
Avant : [Naruto] --> [Sasuke] --> null
            ↑
           tail

append("Sakura")

Après : [Naruto] --> [Sasuke] --> [Sakura] --> null
                 ↑
                 tail
```

O(1) car on a une référence directe vers `tail`. Pas de traversal.

---

## 4) PREPEND : AJOUTER AU DÉBUT : O(1)

```js
prepend(value) {
 const node = new Node(value)

 if (!this.head) {
  this.head = node
  this.tail = node
 } else {
  // le nouveau node pointe vers l'ancien head
  node.next = this.head
  // head devient le nouveau node
  this.head = node
 }

 this.size++
}
```

```
Avant : [Sasuke] --> [Sakura] --> null
      ↑
     head

prepend("Naruto")

Après : [Naruto] --> [Sasuke] --> [Sakura] --> null
      ↑
      head
```

Comparer avec `unshift` sur un tableau : O(1) ici vs O(n) pour un tableau. C'est le premier avantage concret de la linked list.

---

## 5) DELETE : SUPPRIMER UN NODE : O(n)

Pour supprimer, il faut d'abord trouver le node. Et pour le trouver, il faut traverser depuis `head`. Une fois trouvé, on redirige le pointeur du node précédent.

```js
delete(value) {
 if (!this.head) return null

 // cas spécial : supprimer le head
 if (this.head.value === value) {
  this.head = this.head.next
  if (!this.head) this.tail = null // liste vide après suppression
  this.size--
  return
 }

 // traverser pour trouver le node précédent
 let current = this.head
 while (current.next) {
  if (current.next.value === value) {
   // on saute le node à supprimer
   if (current.next === this.tail) {
    this.tail = current // mise à jour du tail si nécessaire
   }
   current.next = current.next.next
   this.size--
   return
  }
  current = current.next
 }
}
```

```
Avant : [Naruto] --> [Sasuke] --> [Sakura] --> [Kakashi] --> null

delete("Sakura")

      ┌────────────────────────┐
      ↓            │ (ancien pointeur de Sasuke supprimé)
[Naruto] --> [Sasuke] ───────────────> [Kakashi] --> null
```

---

## 6) TRAVERSAL : PARCOURIR TOUTE LA LISTE : O(n)

```js
print() {
 const values = []
 let current = this.head

 // tant qu'il y a un node suivant, on avance
 while (current) {
  values.push(current.value)
  current = current.next
 }

 return values.join(" --> ")
}
```

---

## 7) LA LINKED LIST COMPLÈTE

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
  if (!this.head) {
   this.head = node
   this.tail = node
  } else {
   this.tail.next = node
   this.tail = node
  }
  this.size++
 }

 prepend(value) {
  const node = new Node(value)
  if (!this.head) {
   this.head = node
   this.tail = node
  } else {
   node.next = this.head
   this.head = node
  }
  this.size++
 }

 delete(value) {
  if (!this.head) return
  if (this.head.value === value) {
   this.head = this.head.next
   if (!this.head) this.tail = null
   this.size--
   return
  }
  let current = this.head
  while (current.next) {
   if (current.next.value === value) {
    if (current.next === this.tail) this.tail = current
    current.next = current.next.next
    this.size--
    return
   }
   current = current.next
  }
 }

 print() {
  const values = []
  let current = this.head
  while (current) {
   values.push(current.value)
   current = current.next
  }
  return values.join(" --> ")
 }
}

// utilisation
const crew = new LinkedList()
crew.append("Sasuke")
crew.append("Sakura")
crew.prepend("Naruto")
crew.append("Kakashi")

console.log(crew.print()) // "Naruto --> Sasuke --> Sakura --> Kakashi"
crew.delete("Sakura")
console.log(crew.print()) // "Naruto --> Sasuke --> Kakashi"
console.log(crew.size)   // 3
```

---

## 8) TABLEAU vs LINKED LIST : LE VRAI COMPARATIF

```
Opération     Tableau  Linked List  Raison
──────────────────────────────────────────────────────────
Accès par index  O(1)    O(n)      tableau = adresse directe
Insertion début  O(n)    O(1)      liste = juste un pointeur
Insertion fin   O(1)*   O(1)      les deux ont tail
Insertion milieu  O(n)    O(n)**     les deux doivent trouver la position
Suppression début O(n)    O(1)      liste = juste déplacer head
Recherche     O(n)    O(n)      les deux traversent

* O(1) amorti pour le tableau
** O(n) pour trouver le node, O(1) pour faire le lien
```

**Quand linked list > tableau** : insertions / suppressions fréquentes en tête de liste, ou quand la taille est très dynamique et qu'on veut éviter les réallocations mémoire.

**Quand tableau > linked list** : accès par index fréquent, itération avec index, algorithmes qui lisent les données.

---

## EXERCICES

## EXO 1 : La queue des survivants
_~15 min_

Rick Grimes gère l'ordre de garde du camp. Les survivants sont dans une linked list. Implémente `insertAt(index, value)` qui insère un survivant à une position précise. Gère les cas : position 0, position fin, et position hors limites.

## EXO 2 : Le détective de la liste
_~10 min_

Écris une méthode `get(index)` qui retourne la valeur à un index donné. Si l'index est négatif ou trop grand, retourne `null`. Pas d'accès direct comme un tableau : tu dois traverser.

## EXO 3 : Compte à rebours
_~20 min_

Écris une méthode `toArray()` qui convertit la linked list en tableau JS. Puis l'inverse : une fonction statique `fromArray(arr)` qui construit une LinkedList depuis un tableau. Les deux doivent respecter l'ordre original.

---

## RÉSUMÉ

Une linked list c'est une chaîne de nodes, chacun pointant vers le suivant. Pas d'index, pas de blocs contigus. `head` et `tail` sont les deux seules entrées. Insérer en tête ou en queue est O(1) : on manipule juste des pointeurs. Lire par position est O(n) : on traverse depuis `head`. C'est un compromis inverse du tableau : rapide pour modifier, lent pour accéder. La vraie compétence c'est de savoir lequel choisir selon le problème.
