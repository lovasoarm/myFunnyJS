---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# HASH TABLE : O(1) POUR CHERCHER, SI LE HASH EST BON
Temps de lecture ~9 min

Array : accès par index, pas par valeur. BST : cherche en O(log n). Hash table : cherche en O(1). Pas de miracle : une fonction mathématique convertit ta clé en index. Le problème : deux clés différentes peuvent produire le même index. C'est une collision. Gérer ça proprement, c'est ce qui sépare une hash table qui tient en prod d'une qui plante.

---

## 1) L'IDÉE DE BASE

```
clé (string, number, ...) --> hash function --> index dans un tableau

set("Naruto", 9001)
 "Naruto" --> hash() --> 3 --> tableau[3] = { key: "Naruto", value: 9001 }

get("Naruto")
 "Naruto" --> hash() --> 3 --> return tableau[3].value // 9001
```

La hash function transforme n'importe quelle clé en un entier borné. Toujours le même entier pour la même clé.

---

## 2) UNE HASH FUNCTION SIMPLE

```js
// hash naive sur des strings
function hash(key, tableSize) {
 let total = 0
 const PRIME = 31 // un nombre premier réduit les collisions

 for (let i = 0; i < Math.min(key.length, 100); i++) {
  const charCode = key.charCodeAt(i) - 96 // 'a' = 1, 'b' = 2, ...
  total = (total * PRIME + charCode) % tableSize
 }

 return total
}

hash("Naruto", 10)  // --> 4 (exemple)
hash("Sasuke", 10)  // --> 7
hash("Sakura", 10)  // --> 7 <-- même index : COLLISION
```

Deux propriétés essentielles d'une bonne hash function :
- **déterministe** : même clé → même hash, toujours
- **distribution uniforme** : les hash se répartissent sur tout le tableau, pas concentrés sur 3 cases

Le nombre premier dans le calcul : il améliore la distribution en évitant que des patterns réguliers dans les clés produisent des patterns réguliers dans les hash.

---

## 3) LES COLLISIONS : CHAINING

Quand deux clés hashent au même index, on a deux options classiques : chaining et open addressing. Chaining est le plus simple : chaque case du tableau contient une liste chaînée de paires `(clé, valeur)`.

```js
class HashTable {
 constructor(size = 53) {
  // 53 : nombre premier, bonne taille initiale
  // chaque case commence à null (vide)
  this.table = new Array(size).fill(null).map(() => [])
  this.size = size
 }

 _hash(key) {
  let total = 0
  const PRIME = 31
  for (let i = 0; i < Math.min(key.length, 100); i++) {
   total = (total * PRIME + (key.charCodeAt(i) - 96)) % this.size
  }
  return total
 }

 // insertion ou mise à jour : O(1) amorti
 set(key, value) {
  const idx  = this._hash(key)
  const bucket = this.table[idx]

  // cherche si la clé existe déjà dans le bucket
  const existing = bucket.find(pair => pair[0] === key)
  if (existing) {
   existing[1] = value // update
  } else {
   bucket.push([key, value]) // nouvelle entrée
  }
 }

 // lecture : O(1) amorti, O(n) dans le pire cas (tout dans un seul bucket)
 get(key) {
  const idx = this._hash(key)
  const pair = this.table[idx].find(p => p[0] === key)
  return pair ? pair[1] : undefined
 }

 // suppression : O(1) amorti
 delete(key) {
  const idx  = this._hash(key)
  const bucket = this.table[idx]
  const pairIdx = bucket.findIndex(p => p[0] === key)
  if (pairIdx !== -1) bucket.splice(pairIdx, 1)
 }

 // toutes les clés
 keys() {
  return this.table.flatMap(bucket => bucket.map(pair => pair[0]))
 }

 // toutes les valeurs
 values() {
  return this.table.flatMap(bucket => bucket.map(pair => pair[1]))
 }
}
```

---

## 4) VISUALISER LE CHAINING

```js
const ht = new HashTable(10)

ht.set("Naruto", 9001)
ht.set("Sasuke", 8500)
ht.set("Sakura", 7200) // suppose que hash("Sakura", 10) = hash("Sasuke", 10) = 7

// état interne après les trois insertions :
[
 0: [],
 1: [],
 2: [],
 3: [],
 4: [["Naruto", 9001]],
 5: [],
 6: [],
 7: [["Sasuke", 8500], ["Sakura", 7200]], // bucket avec 2 entrées (collision gérée)
 8: [],
 9: []
]

ht.get("Sakura")
// hash("Sakura") --> 7
// table[7] = [["Sasuke", 8500], ["Sakura", 7200]]
// .find(p => p[0] === "Sakura") --> ["Sakura", 7200]
// return 7200
```

La collision n'est pas un bug, c'est un comportement attendu et géré. Un bucket avec 2 entrées fait une recherche linéaire en O(2) : toujours O(1) en pratique.

---

## 5) OPEN ADDRESSING (ALTERNATIVE AU CHAINING)

Au lieu de listes chaînées, on cherche la prochaine case libre (linear probing).

```js
// si table[hash(key)] est occupé par une autre clé
// on essaie table[(hash(key) + 1) % size]
// puis table[(hash(key) + 2) % size]
// etc.

// avantage : meilleure localité cache (tout est dans le même tableau)
// problème : clustering -- les collisions créent des chaînes de cases occupées
//       qui ralentissent toutes les opérations au même endroit
```

En pratique, les impls modernes utilisent Robin Hood hashing ou une variante. Pour ce curriculum, chaining suffit.

---

## 6) LOAD FACTOR ET RESIZE

Le load factor = nombre d'entrées / taille du tableau.

```
load factor 0.1 --> beaucoup d'espace vide, collisions rares, mémoire gaspillée
load factor 0.7 --> bon équilibre
load factor 1.5 --> trop plein, collisions fréquentes, O(1) devient O(n)
```

Les hash tables bien implémentées se redimensionnent automatiquement. Quand le load factor dépasse un seuil (~0.75), on crée un nouveau tableau deux fois plus grand et on réhash toutes les entrées.

```js
_resize() {
 const oldTable = this.table
 this.size = this.size * 2    // double la taille
 this.table = new Array(this.size).fill(null).map(() => [])

 // réhash toutes les entrées dans le nouveau tableau
 for (const bucket of oldTable) {
  for (const [key, value] of bucket) {
   this.set(key, value)
  }
 }
}
```

Le resize coûte O(n) mais c'est amorti sur toutes les insertions : O(1) en moyenne.

---

## 7) CE QU'EST `Map` EN JS

`Map` en JavaScript natif est une hash table optimisée par le moteur. Elle accepte n'importe quel type de clé (pas juste des strings).

```js
const map = new Map()

// clés de n'importe quel type
map.set("name", "Gus Fring")  // string key
map.set(42, "the answer")    // number key
map.set({}, "obj key")     // object key (identité, pas valeur)

map.get("name")  // "Gus Fring"
map.has(42)    // true
map.delete(42)

// itérer
for (const [key, value] of map) {
 console.log(key, value)
}

map.size // 2 (après le delete)
```

En prod, utilise `Map`. Implémente ta propre hash table pour comprendre ce qui se passe en dessous.

---

## EXERCICES

## EXO 1 : le cache des jutsu
_~10 min_


Implémente un `JutsuCache` en utilisant ta HashTable. Les jutsu de Naruto ont un nom (string) et un coût en chakra (number).

Contraintes :
- `cache(name, chakraCost)` : stocke le jutsu
- `getCost(name)` : retourne le coût, ou `"jutsu inconnu"` si absent
- `remove(name)` : supprime un jutsu
- `mostExpensive()` : retourne le nom du jutsu le plus coûteux

Teste avec au moins 6 jutsu. Démontre une collision (deux noms qui hashent au même index).

---

## EXO 2 : compter les occurrences
_~20 min_


Tu as une tracklist d'une playlist trapsoul. Certains artistes apparaissent plusieurs fois.

```js
const playlist = [
 "SZA", "Bryson Tiller", "SZA", "Daniel Caesar",
 "Bryson Tiller", "SZA", "H.E.R.", "Daniel Caesar", "SZA"
]
```

Sans utiliser `.filter` + `.length` : utilise uniquement une HashTable pour compter le nombre d'apparitions de chaque artiste. Affiche les artistes dans l'ordre décroissant d'apparitions.

---

## EXO 3 : détecter le doublon
_~15 min_


T-Bag a essayé de s'infiltrer dans la prison avec deux faux noms. Tu as la liste complète des entrées (certaines en double).

```js
const entries = ["Lincoln", "Michael", "Sucre", "Lincoln", "C-Note", "Michael", "T-Bag"]
```

Implémente `findFirstDuplicate(arr)` avec une HashTable. Retourne le premier élément qui apparaît deux fois. O(n) en temps, O(n) en espace.

---

## RÉSUMÉ

La hash table convertit une clé en index via une hash function, et stocke la valeur à cet index. O(1) en lecture et écriture en moyenne. Les collisions sont inévitables : le chaining les gère avec une liste par bucket. Le load factor mesure le remplissage : au-delà de ~0.75, on redimensionne. En JS, `Map` est la hash table native optimisée pour la prod.
