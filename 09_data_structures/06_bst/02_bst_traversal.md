---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# BST TRAVERSAL : LIRE L'ARBRE DANS LE BON SENS
Temps de lecture ~8 min

Un BST contient les données. Un traversal les extrait dans un ordre précis. Trois ordres de parcours en profondeur, un en largeur. Chacun a un cas d'usage distinct. Confondre inorder et preorder sur un problème réel : résultat garanti faux.

---

## 1) LES QUATRE TRAVERSALS

```
Arbre de référence :

     8
    /  \
    3   10
   / \   \
   1  6   14
    / \  /
    4  7 13
```

```
In-order  (gauche --> noeud --> droite) : 1, 3, 4, 6, 7, 8, 10, 13, 14
Pre-order (noeud --> gauche --> droite) : 8, 3, 1, 6, 4, 7, 10, 14, 13
Post-order (gauche --> droite --> noeud) : 1, 4, 7, 6, 3, 13, 14, 10, 8
BFS    (niveau par niveau)      : 8, 3, 10, 1, 6, 14, 4, 7, 13
```

---

## 2) IN-ORDER : LES DONNÉES DANS L'ORDRE

Gauche d'abord, puis le noeud, puis droite. Sur un BST valide, ça produit toujours une séquence triée.

```js
inOrder(node = this.root, result = []) {
 if (!node) return result
 this.inOrder(node.left, result)  // descend à gauche
 result.push(node.value)      // visite le noeud au retour
 this.inOrder(node.right, result) // descend à droite
 return result
}

// sur notre arbre : [1, 3, 4, 6, 7, 8, 10, 13, 14]
// une liste triée : propre, gratuit, O(n)
```

Cas d'usage : extraire les valeurs triées depuis un BST. Les scores du Ballon d'Or dans l'ordre croissant : inOrder. Le classement live pendant un match : inOrder.

---

## 3) PRE-ORDER : LE NOEUD AVANT SES ENFANTS

Noeud d'abord, puis gauche, puis droite. L'arbre est visité "de haut en bas".

```js
preOrder(node = this.root, result = []) {
 if (!node) return result
 result.push(node.value)       // visite le noeud en premier
 this.preOrder(node.left, result)   // puis toute la gauche
 this.preOrder(node.right, result)  // puis toute la droite
 return result
}

// sur notre arbre : [8, 3, 1, 6, 4, 7, 10, 14, 13]
```

Cas d'usage : sérialiser un BST. Si tu veux sauvegarder l'arbre et le reconstruire à l'identique (même forme, même racine), preOrder est le seul traversal qui préserve la structure.

```js
// sérialiser
const serialized = bst.preOrder() // [8, 3, 1, 6, 4, 7, 10, 14, 13]

// reconstruire
const newBst = new BST()
serialized.forEach(val => newBst.insert(val))
// l'arbre reconstruit a exactement la même forme
```

Avec inOrder tu obtiendrais [1, 3, 4, 6, 7, 8, 10, 13, 14] : insérer dans cet ordre produit un arbre dégénéré.

---

## 4) POST-ORDER : LES ENFANTS AVANT LE NOEUD

Gauche d'abord, puis droite, puis le noeud. L'arbre est visité "de bas en haut".

```js
postOrder(node = this.root, result = []) {
 if (!node) return result
 this.postOrder(node.left, result)  // toute la gauche
 this.postOrder(node.right, result) // toute la droite
 result.push(node.value)       // noeud en dernier
 return result
}

// sur notre arbre : [1, 4, 7, 6, 3, 13, 14, 10, 8]
```

Cas d'usage : supprimer ou évaluer un arbre de bas en haut. Un arbre d'expression mathématique (les opérateurs sont des noeuds, les valeurs sont des feuilles) : postOrder évalue les feuilles avant les opérateurs. Gus Fring qui démantèle son réseau proprement : les sous-traitants partent avant les chefs.

---

## 5) BFS : NIVEAU PAR NIVEAU

Les trois précédents sont des DFS (Depth-First Search). BFS va niveau par niveau avec une queue.

```js
bfs() {
 if (!this.root) return []

 const result = []
 const queue = [this.root]

 while (queue.length > 0) {
  const current = queue.shift()  // prend le premier de la file
  result.push(current.value)

  // enfile les enfants pour le prochain niveau
  if (current.left) queue.push(current.left)
  if (current.right) queue.push(current.right)
 }

 return result
}

// sur notre arbre : [8, 3, 10, 1, 6, 14, 4, 7, 13]
// niveau 0 : 8
// niveau 1 : 3, 10
// niveau 2 : 1, 6, 14
// niveau 3 : 4, 7, 13
```

Cas d'usage : trouver le chemin le plus court dans un arbre (nombre minimal de noeuds à traverser). Comparer deux arbres niveau par niveau. Afficher un organigramme.

---

## 6) VERSION ITÉRATIVE DE L'IN-ORDER

La récursion c'est élégant. Mais sur un arbre profond, elle peut stackoverflow. La version itérative utilise une stack explicite.

```js
inOrderIterative() {
 const result = []
 const stack = []
 let current = this.root

 while (current || stack.length > 0) {
  // descend tout à gauche
  while (current) {
   stack.push(current)
   current = current.left
  }

  // remonte : visite le noeud, puis part à droite
  current = stack.pop()
  result.push(current.value)
  current = current.right
 }

 return result
}
```

Même résultat que la version récursive. Zéro risque de call stack overflow sur un arbre de 100k noeuds.

---

## 7) RÉCAPITULATIF VISUEL

```
     8
    /  \
    3   10
   / \   \
   1  6   14
    / \  /
    4  7 13

In-order  (trié)    : 1 3 4 6 7 8 10 13 14
Pre-order (forme)    : 8 3 1 6 4 7 10 14 13
Post-order (bas en haut) : 1 4 7 6 3 13 14 10 8
BFS    (niveaux)   : 8 3 10 1 6 14 4 7 13
```

---

## EXERCICES

## EXO 1 : reconstruire depuis le néant
_~10 min_


Tu as reçu deux listes qui représentent le même arbre :

```js
const preorder = [5, 3, 2, 4, 8, 7, 9]
const inorder = [2, 3, 4, 5, 7, 8, 9]
```

Sans reconstruire l'arbre en mémoire, détermine :
1. Quelle est la racine de l'arbre ?
2. Quels noeuds sont dans le sous-arbre gauche ?
3. Quels noeuds sont dans le sous-arbre droit ?

(Indice : preorder[0] est toujours la racine, et sa position dans inorder sépare gauche et droite)

---

## EXO 2 : les stats du match en temps réel
_~15 min_


Un BST contient les performances des joueurs (score entre 0 et 100) pendant un match de Champions League. À la mi-temps, l'entraîneur veut :

1. La liste complète des scores dans l'ordre croissant (inOrder)
2. Une copie de l'arbre à sauvegarder pour l'analyse d'après-match (preOrder puis reconstruire)
3. Le chemin depuis la racine jusqu'au joueur avec le score 73

Implémente les trois. Pour le troisième, un simple DFS qui trace le chemin suffit.

---

## EXO 3 : la symétrie de l'arbre
_~20 min_


Naruto et Sasuke ont chacun un BST de leurs jutsu triés par puissance. Pour vérifier qu'ils ont exactement les mêmes capacités (pas le même arbre, les mêmes valeurs), tu dois comparer les deux arbres.

Implémente `isSameValues(bst1, bst2)` : retourne `true` si les deux BST contiennent exactement les mêmes valeurs (même ensemble, peu importe la forme de l'arbre).

(Contrainte : utilise le traversal le plus adapté : lequel garantit un résultat comparable entre deux arbres de formes différentes ?)

---

## RÉSUMÉ

Quatre traversals, quatre cas d'usage : inOrder pour extraire les données triées, preOrder pour sérialiser la structure, postOrder pour traiter les feuilles avant les racines, BFS pour parcourir niveau par niveau. In-order est le plus utilisé sur un BST. Pre-order est indispensable pour serialiser et reconstruire à l'identique. Préfère la version itérative sur des arbres de grande taille pour éviter le stack overflow.
