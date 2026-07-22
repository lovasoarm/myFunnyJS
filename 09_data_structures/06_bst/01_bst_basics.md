---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# BST : L'ARBRE QUI CHERCHE EN O(log n)
Temps de lecture ~9 min

Un tableau trie ou non. Un hash table trouve en O(1) mais ne trie pas. Le BST fait les deux : chercher, insérer, supprimer en O(log n) : et les données restent ordonnées dans la structure.

Condition : l'arbre doit rester équilibré. Sinon O(log n) dégénère en O(n). C'est le piège principal de cette structure.

---

## 1) LA RÈGLE DU BST

Pour chaque noeud N :
- tout ce qui est à gauche est **strictement inférieur** à N
- tout ce qui est à droite est **strictement supérieur** à N

C'est ça et rien d'autre. Cette règle unique suffit à garantir la recherche dichotomique.

```
Arbre valide :

     8
    /  \
    3   10
   / \   \
   1  6   14
    / \  /
    4  7 13

Pour le noeud 8 :
 gauche (3, 1, 6, 4, 7) --> tous < 8 : OK
 droite (10, 14, 13)  --> tous > 8 : OK

Pour le noeud 3 :
 gauche (1)   --> 1 < 3 : OK
 droite (6, 4, 7) --> tous > 3 : OK
```

---

## 2) NOEUD ET CLASSE BST

```js
class Node {
 constructor(value) {
  this.value = value
  this.left = null  // sous-arbre gauche : valeurs < this.value
  this.right = null  // sous-arbre droit : valeurs > this.value
 }
}

class BST {
 constructor() {
  this.root = null
 }
}
```

---

## 3) INSERT : O(log n)

On descend l'arbre en comparant à chaque noeud. Gauche si inférieur, droite si supérieur. On s'arrête sur un null : c'est là qu'on insère.

```js
insert(value) {
 const newNode = new Node(value)

 // arbre vide : le premier noeud devient la racine
 if (!this.root) {
  this.root = newNode
  return this
 }

 let current = this.root

 while (true) {
  // doublon : on ignore (convention classique du BST)
  if (value === current.value) return this

  if (value < current.value) {
   // aller à gauche
   if (!current.left) {
    current.left = newNode
    return this
   }
   current = current.left
  } else {
   // aller à droite
   if (!current.right) {
    current.right = newNode
    return this
   }
   current = current.right
  }
 }
}
```

Trace d'une insertion sur l'arbre du score de Messi (Ballon d'Or) :

```
Insertion de [8, 3, 10, 1, 6] dans l'ordre :

insert(8) --> 8 devient racine
insert(3) --> 3 < 8 : gauche de 8
insert(10) --> 10 > 8 : droite de 8
insert(1) --> 1 < 8 : gauche | 1 < 3 : gauche de 3
insert(6) --> 6 < 8 : gauche | 6 > 3 : droite de 3

Résultat :
  8
  / \
 3  10
 / \
1  6
```

---

## 4) SEARCH : O(log n)

Même logique : on descend, on compare, on va à gauche ou à droite.

```js
search(value) {
 let current = this.root

 while (current) {
  if (value === current.value) return current // trouvé
  if (value < current.value) {
   current = current.left  // cherche à gauche
  } else {
   current = current.right // cherche à droite
  }
 }

 return null // pas trouvé
}
```

Chaque comparaison élimine la moitié restante de l'arbre. C'est la recherche binaire appliquée à une structure de données.

```
Chercher 6 dans l'arbre :

   8   --> 6 < 8 : on part à gauche
  / \
  3  10  --> 6 > 3 : on part à droite
 / \
 1  6   --> 6 === 6 : trouvé en 3 comparaisons
```

---

## 5) DELETE : O(log n) : le cas qui pique

Supprimer un noeud dans un BST a trois cas distincts.

```
Cas 1 : le noeud est une feuille (pas d'enfants)
 --> on l'efface simplement

Cas 2 : le noeud a un seul enfant
 --> on remplace le noeud par son enfant

Cas 3 : le noeud a deux enfants
 --> on remplace la valeur du noeud par son successeur in-order
   (le plus petit du sous-arbre droit)
 --> puis on supprime ce successeur
```

```js
delete(value) {
 this.root = this._deleteNode(this.root, value)
}

_deleteNode(node, value) {
 if (!node) return null

 if (value < node.value) {
  // le noeud à supprimer est dans le sous-arbre gauche
  node.left = this._deleteNode(node.left, value)
 } else if (value > node.value) {
  // le noeud à supprimer est dans le sous-arbre droit
  node.right = this._deleteNode(node.right, value)
 } else {
  // on a trouvé le noeud à supprimer

  // Cas 1 : feuille
  if (!node.left && !node.right) return null

  // Cas 2a : seulement un enfant droit
  if (!node.left) return node.right

  // Cas 2b : seulement un enfant gauche
  if (!node.right) return node.left

  // Cas 3 : deux enfants
  // trouver le successeur in-order (minimum du sous-arbre droit)
  const successor = this._findMin(node.right)
  node.value = successor.value
  // supprimer le successeur de sa position originale
  node.right = this._deleteNode(node.right, successor.value)
 }

 return node
}

_findMin(node) {
 // le minimum d'un BST est toujours le plus à gauche
 while (node.left) node = node.left
 return node
}
```

Trace sur le cas 3 : supprimer le noeud 3 :

```
Avant :       Après :
  8          8
  / \         / \
 3  10    -->  4  10
 / \         / \
1  6        1  6
  / \          \
 4  7          7

Successeur de 3 = min du sous-arbre droit de 3 = 4
On remplace 3 par 4, puis on supprime 4 de sa position originale
```

---

## 6) LE PIÈGE : L'ARBRE DÉGÉNÉRÉ

Si tu insères des valeurs déjà triées dans un BST, l'arbre devient une liste chaînée.

```
Insertion de [1, 2, 3, 4, 5] dans l'ordre :

1
 \
 2
  \
  3
   \
   4
    \
    5

Hauteur : O(n)
Recherche : O(n), pas O(log n)
```

Walter White qui insère ses distributeurs par ordre alphabétique : son BST devient une file droite. Dijkstra pleure.

Correction : utiliser un arbre équilibré (AVL, Red-Black Tree). Ce n'est pas couvert dans ce module : voir `10_algorithms` pour les arbres AVL. Pour l'instant, retiens que le BST de base ne se rééquilibre pas.

---

## EXERCICES

## EXO 1 : les joueurs du Ballon d'Or
_~15 min_


Tu as les scores de candidats au Ballon d'Or (nombre de buts + assists) :

```js
const scores = [89, 72, 95, 60, 81, 100, 55, 77]
```

Insère-les dans un BST. Ensuite :
1. Cherche si le score 81 existe
2. Cherche si le score 99 existe
3. Supprime le score 72
4. Vérifie que la structure BST reste valide après la suppression

---

## EXO 2 : le répertoire de personnages de Breaking Bad
_~12 min_


Tu construis un annuaire de personnages trié par nom :

```js
const characters = ["Walter", "Jesse", "Skyler", "Hank", "Mike", "Saul", "Gus"]
```

BST alphabétique (compare les strings). Implémente `search(name)` qui retourne `true/false`. Démontre que l'ordre d'insertion change la forme de l'arbre mais pas les résultats de recherche.

(Contrainte : écris les deux insertions : ordre alphabétique vs ordre de la liste : et montre la différence de hauteur d'arbre)

---

## EXO 3 : le classement live d'un match
_~20 min_


Pendant un match, les joueurs accumulent des points de performance (passes, tacles, tirs). Chaque update insère ou met à jour un joueur dans le BST.

Implémente :
- `insertOrUpdate(playerName, score)` : insère si absent, met à jour si présent
- `findTopK(k)` : retourne les k meilleurs scores (sans convertir en tableau via traversal d'abord)

(Indice pour findTopK : pense au parcours in-order : il donne les valeurs dans l'ordre croissant)

---

## RÉSUMÉ

Le BST stocke les données de façon ordonnée et permet insert, search, delete en O(log n) : si l'arbre reste équilibré. La règle : gauche < noeud < droite, appliquée à chaque noeud. Le delete a trois cas, le troisième (deux enfants) utilise le successeur in-order. Le piège principal : des insertions triées produisent un arbre dégénéré en O(n). En prod, on utilise des variantes auto-équilibrées (AVL, Red-Black).
