---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# HASH TABLE ARENA : LES PROBLÈMES CLASSIQUES
Temps de lecture ~9 min

Ces trois patterns reviennent dans tous les entretiens et dans tous les codebases réels. Two Sum, anagrammes, comptage de fréquences : dans les trois cas, la hash table est la différence entre O(n) et O(n²). Reconnaître le pattern, c'est reconnaître quand sortir la hash table.

---

## 1) LE PATTERN : "J'AI DÉJÀ VU CE TRUC"

La hash table excelle dans un cas précis : tu parcours un tableau, et pour chaque élément tu dois savoir si tu l'as déjà rencontré, ou quelle valeur lui est associée.

Sans hash table :
```
Pour chaque élément, cherche dans le reste du tableau.
O(n²). Ça explose sur 10k éléments.
```

Avec hash table :
```
Pour chaque élément, regarde dans la map. O(1) par lookup.
Total : O(n).
```

---

## 2) TWO SUM

Problème : dans un tableau de nombres, trouver les deux indices dont les valeurs additionnées donnent un target.

```js
// O(n²) : brute force naïve
function twoSumSlow(nums, target) {
 for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
   if (nums[i] + nums[j] === target) return [i, j]
  }
 }
 return null
}

// O(n) : avec hash table
function twoSum(nums, target) {
 const seen = new Map() // { valeur : index }

 for (let i = 0; i < nums.length; i++) {
  const complement = target - nums[i]
  // si on a déjà vu le complément, on a notre paire
  if (seen.has(complement)) {
   return [seen.get(complement), i]
  }
  // sinon on mémorise cette valeur et son index
  seen.set(nums[i], i)
 }

 return null
}
```

Trace sur un exemple :

```
nums = [2, 7, 11, 15], target = 9

i=0 : nums[0]=2, complement=7, seen={}   --> 7 absent, seen = {2:0}
i=1 : nums[1]=7, complement=2, seen={2:0}  --> 2 présent ! return [0, 1]
```

Application : les scores de deux joueurs du Ballon d'Or qui totalisent exactement 100 points combinés.

```js
const scores = [45, 89, 32, 55, 67, 78, 11]
twoSum(scores, 100) // --> [1, 5] : scores[1]=89 + scores[5]=78 != 100
           // --> [0, 3] : 45 + 55 = 100 : les deux joueurs
```

---

## 3) ANAGRAMMES

Deux strings sont des anagrammes si elles contiennent exactement les mêmes lettres avec les mêmes fréquences.

```js
function isAnagram(str1, str2) {
 // longueurs différentes : impossible
 if (str1.length !== str2.length) return false

 const freq = new Map()

 // compte les lettres de str1
 for (const char of str1) {
  freq.set(char, (freq.get(char) ?? 0) + 1)
 }

 // soustrait les lettres de str2
 for (const char of str2) {
  if (!freq.has(char)) return false // lettre inconnue
  freq.set(char, freq.get(char) - 1)
  if (freq.get(char) < 0) return false // trop de cette lettre
 }

 return true
}

isAnagram("silent", "listen")  // true
isAnagram("Walter", "Twaler")  // true : même lettres, ordre différent
isAnagram("Naruto", "Sasuke")  // false
```

Variante : grouper une liste de mots par anagrammes (problème classique d'entretien).

```js
function groupAnagrams(words) {
 const groups = new Map()

 for (const word of words) {
  // la clé = les lettres du mot triées alphabétiquement
  // tous les anagrammes partagent la même clé triée
  const key = word.toLowerCase().split("").sort().join("")

  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(word)
 }

 return [...groups.values()]
}

groupAnagrams(["listen", "silent", "enlist", "Naruto", "Sasuke", "inlets"])
// [["listen", "silent", "enlist", "inlets"], ["Naruto"], ["Sasuke"]]
```

---

## 4) COMPTAGE DE FRÉQUENCES

Compter les occurrences d'éléments dans une collection. Le pattern de base de toute l'analyse de données.

```js
function frequencyCount(arr) {
 const freq = new Map()
 for (const item of arr) {
  freq.set(item, (freq.get(item) ?? 0) + 1)
 }
 return freq
}
```

Application : analyser une playlist trapsoul pour trouver l'artiste le plus joué.

```js
const plays = [
 "SZA", "Bryson Tiller", "SZA", "Daniel Caesar",
 "Bryson Tiller", "SZA", "H.E.R.", "Daniel Caesar", "SZA"
]

const freq = frequencyCount(plays)
// Map { "SZA": 4, "Bryson Tiller": 2, "Daniel Caesar": 2, "H.E.R.": 1 }

// artiste le plus joué
const topArtist = [...freq.entries()].reduce((a, b) => a[1] > b[1] ? a : b)
// ["SZA", 4]
```

Extension : "two arrays have same frequency" : vérifier si deux tableaux ont les mêmes fréquences d'éléments.

```js
function sameFrequency(arr1, arr2) {
 if (arr1.length !== arr2.length) return false

 const freq1 = frequencyCount(arr1)
 const freq2 = frequencyCount(arr2)

 for (const [key, count] of freq1) {
  if (freq2.get(key) !== count) return false
 }

 return true
}

sameFrequency([1, 2, 2, 3], [3, 1, 2, 2]) // true
sameFrequency([1, 2, 3], [1, 2, 2])     // false
```

---

## 5) LONGEST CONSECUTIVE SEQUENCE

Trouver la séquence de nombres consécutifs la plus longue dans un tableau non trié. O(n) avec hash table, O(n log n) sans.

```js
function longestConsecutive(nums) {
 const numSet = new Set(nums) // O(1) lookup
 let longest = 0

 for (const num of numSet) {
  // ne démarre une séquence que si num-1 n'est pas dans le set
  // (évite de recompter les séquences depuis le milieu)
  if (!numSet.has(num - 1)) {
   let current = num
   let length = 1

   // étend la séquence vers la droite
   while (numSet.has(current + 1)) {
    current++
    length++
   }

   longest = Math.max(longest, length)
  }
 }

 return longest
}

// les numéros de maillot d'une équipe de foot
const jerseys = [100, 4, 200, 1, 3, 2]
longestConsecutive(jerseys) // 4 : la séquence [1, 2, 3, 4]
```

Le trick : en utilisant un Set, chaque nombre n'est visité qu'une ou deux fois au total. Malgré la double boucle apparente, la complexité reste O(n).

---

## 6) LE PIÈGE : OBJET ORDINAIRE VS MAP

En JS, on utilise souvent un objet ordinaire comme hash table. C'est pratique mais risqué.

```js
// avec objet ordinaire
const map = {}
map["constructor"] = "override" // écrase Object.prototype.constructor
map["__proto__"]  = "danger"  // pollution du prototype possible

// avec Map
const safeMap = new Map()
safeMap.set("constructor", "override") // aucun risque : Map ne touche pas au prototype
safeMap.set("__proto__", "safe")
```

Règle simple :
- objet `{}` : uniquement si les clés sont des strings prévisibles et pas des entrées utilisateur
- `Map` : dès que les clés viennent de l'extérieur ou peuvent contenir des noms réservés

Voir `20_security` pour prototype pollution en détail.

---

## EXERCICES

## EXO 1 : Three Sum
_~15 min_


Variante de Two Sum. Dans le tableau de scores d'un tournoi de foot :

```js
const scores = [-4, -1, -1, 0, 1, 2]
```

Trouve tous les triplets uniques dont la somme vaut 0. Résultat attendu : `[[-4, 2, 2], [-1, -1, 2], [-1, 0, 1]]` (exemple fictif selon les valeurs).

(Contrainte : O(n²) est acceptable ici : two pointers + hash pour les doublons. Pas de triplets dupliqués dans le résultat)

---

## EXO 2 : la playlist sans répétition
_~15 min_


Un utilisateur de Trapsoul Radio veut la plus longue sous-séquence de chansons sans artiste répété.

```js
const queue = ["SZA", "Bryson", "SZA", "H.E.R.", "Daniel", "Bryson", "SZA"]
// résultat attendu : 4 (sous-séquence "Bryson, SZA, H.E.R., Daniel"... ajuste selon la logique)
```

Implémente `longestUniqueArtistRun(queue)` avec sliding window + Map. Retourne la longueur maximale et la sous-séquence correspondante.

---

## EXO 3 : les combinaisons d'évasion
_~20 min_


Michael Scofield a besoin de savoir combien de façons il peut atteindre l'étage N d'une prison en montant 1 ou 2 marches à la fois. Utilise la mémoïzation avec une Map pour ne jamais recalculer la même valeur.

```js
function countEscapeRoutes(n, memo = new Map()) {
 // à implémenter
}

countEscapeRoutes(10) // 89
countEscapeRoutes(30) // 1346269
```

Sans mémoïzation : O(2^n). Avec Map : O(n). Démontre la différence avec `performance.now()`.

---

## RÉSUMÉ

Trois patterns à reconnaître immédiatement : chercher un complément (Two Sum), comparer des distributions (anagrammes, sameFrequency), compter les occurrences (fréquences). Dans les trois cas, la hash table transforme un O(n²) en O(n). Utilise `Map` plutôt qu'un objet ordinaire dès que les clés viennent de l'extérieur. La mémoïzation avec Map est un quatrième pattern : stocker les résultats calculés pour éviter de les recalculer.
