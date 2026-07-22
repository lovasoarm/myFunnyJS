---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# SUFFIX ARRAY : CHERCHER DANS DES STRINGS COMME UN MOTEUR
Temps de lecture ~10 min

Chercher un pattern dans une string : O(n\*m) avec brute force. O(n+m) avec KMP. Mais si tu dois chercher des milliers de patterns dans la même string longue, recompiler un index à chaque fois est inacceptable. Le Suffix Array construit un index une fois pour toutes, puis répond à chaque requête en O(m log n).

Cas réels : moteurs de recherche full-text, détection de plagiats, bioinformatique (recherche de séquences ADN), autocomplétion.

---

## 1) LE CONCEPT

Un suffix c'est une sous-string qui commence à l'index i et va jusqu'à la fin.

```
string : "banana"

Tous les suffixes :
index 0 : "banana"
index 1 : "anana"
index 2 : "nana"
index 3 : "ana"
index 4 : "na"
index 5 : "a"
```

Un **Suffix Array** c'est le tableau des indices de ces suffixes, triés dans l'ordre lexicographique des suffixes eux-mêmes.

```
Suffixes triés alphabétiquement :
"a"   → index 5
"ana"  → index 3
"anana" → index 1
"banana" → index 0
"na"   → index 4
"nana"  → index 2

Suffix Array : [5, 3, 1, 0, 4, 2]
```

---

## 2) CONSTRUCTION NAÏVE : O(n² log n)

```js
function buildSuffixArrayNaive(str) {
 const n = str.length;
 const indices = Array.from({ length: n }, (_, i) => i);

 // trie les indices selon l'ordre lexicographique des suffixes correspondants
 indices.sort((a, b) => {
  const suffixA = str.slice(a);
  const suffixB = str.slice(b);
  if (suffixA < suffixB) return -1;
  if (suffixA > suffixB) return 1;
  return 0;
 });

 return indices;
}

buildSuffixArrayNaive("banana");
// [5, 3, 1, 0, 4, 2]
```

Problème : `str.slice(a)` crée une nouvelle string à chaque comparaison → O(n) par comparaison, O(n log n) comparaisons → O(n² log n) total. Inutilisable sur des strings de 100k+ caractères.

---

## 3) CONSTRUCTION EFFICACE : O(n log² n)

Algorithme de prefix doubling. Trie d'abord les suffixes par leurs 2 premiers caractères, puis par les 4 premiers, puis 8, etc. À chaque étape, le rang de chaque suffix est connu pour les 2^k premiers caractères.

```js
function buildSuffixArray(str) {
 const n = str.length;
 let sa = Array.from({ length: n }, (_, i) => i); // indices des suffixes
 let rank = str.split("").map((c) => c.charCodeAt(0)); // rang initial = code ASCII

 for (let gap = 1; gap < n; gap *= 2) {
  // compare deux suffixes par leur rang actuel (2*gap premiers caractères)
  const rankCopy = rank.slice();

  sa.sort((a, b) => {
   if (rankCopy[a] !== rankCopy[b]) return rankCopy[a] - rankCopy[b];
   // compare la deuxième moitié : rang du suffix décalé de gap
   const ra = a + gap < n ? rankCopy[a + gap] : -1;
   const rb = b + gap < n ? rankCopy[b + gap] : -1;
   return ra - rb;
  });

  // recalcule les rangs après le tri
  rank[sa[0]] = 0;
  for (let i = 1; i < n; i++) {
   const prev = sa[i - 1];
   const curr = sa[i];
   const prevSecond = prev + gap < n ? rankCopy[prev + gap] : -1;
   const currSecond = curr + gap < n ? rankCopy[curr + gap] : -1;
   rank[curr] =
    rank[prev] +
    (rankCopy[prev] !== rankCopy[curr] || prevSecond !== currSecond
     ? 1
     : 0);
  }

  // si tous les rangs sont uniques : l'ordre est définitif, on peut s'arrêter
  if (rank[sa[n - 1]] === n - 1) break;
 }

 return sa;
}
```

---

## 4) RECHERCHE DE PATTERN : O(m log n)

Une fois le suffix array construit, chercher un pattern c'est une recherche binaire : tous les suffixes qui commencent par le pattern sont contigus dans le tableau trié.

```js
function searchPattern(str, sa, pattern) {
 const m = pattern.length;
 const n = str.length;

 // recherche binaire de la première occurrence
 let lo = 0,
  hi = n - 1;
 let first = -1;

 while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  const suffix = str.slice(sa[mid], sa[mid] + m); // compare seulement les m premiers chars
  if (suffix === pattern) {
   first = mid;
   hi = mid - 1;
  } // continue à gauche
  else if (suffix < pattern) lo = mid + 1;
  else hi = mid - 1;
 }

 if (first === -1) return []; // pattern absent

 // recherche binaire de la dernière occurrence
 lo = first;
 hi = n - 1;
 let last = first;

 while (lo <= hi) {
  const mid = Math.floor((lo + hi) / 2);
  const suffix = str.slice(sa[mid], sa[mid] + m);
  if (suffix === pattern) {
   last = mid;
   lo = mid + 1;
  } // continue à droite
  else if (suffix < pattern) lo = mid + 1;
  else hi = mid - 1;
 }

 // toutes les occurrences sont dans sa[first..last]
 return sa.slice(first, last + 1).sort((a, b) => a - b);
}
```

---

## 5) EN ACTION : RECHERCHE DANS UN TEXTE

Rechercher des patterns dans les paroles d'une chanson trapsoul.

```js
const lyrics =
 "aint nobody gonna love you like i love you baby nobody like nobody";

const sa = buildSuffixArray(lyrics);

// chercher "nobody"
const positions = searchPattern(lyrics, sa, "nobody");
// [29, 49, 58] : trois occurrences, aux positions 29, 49 et 58

// chercher "love"
searchPattern(lyrics, sa, "love");
// [20, 40] : deux occurrences

// chercher "like"
searchPattern(lyrics, sa, "like");
// [12, 52]

// le suffix array est construit une fois
// chaque recherche suivante est O(m log n):indépendante de la longueur du texte
```

---

## 6) LCP ARRAY : LONGEST COMMON PREFIX

Le LCP array (tableau du plus long préfixe commun) est souvent construit en même temps que le suffix array. `lcp[i]` = longueur du plus long préfixe commun entre `sa[i]` et `sa[i-1]`.

```js
function buildLCPArray(str, sa) {
 const n = str.length;
 const lcp = new Array(n).fill(0);
 const rank = new Array(n).fill(0);

 // rang inverse : rank[sa[i]] = i
 for (let i = 0; i < n; i++) rank[sa[i]] = i;

 let h = 0; // longueur du LCP courant

 for (let i = 0; i < n; i++) {
  if (rank[i] > 0) {
   const j = sa[rank[i] - 1]; // suffix précédent dans l'ordre trié
   while (i + h < n && j + h < n && str[i + h] === str[j + h]) h++;
   lcp[rank[i]] = h;
   if (h > 0) h--; // le LCP du prochain suffix est au moins h-1
  }
 }

 return lcp;
}

buildLCPArray("banana", [5, 3, 1, 0, 4, 2]);
// [0, 1, 3, 0, 0, 2]
// sa[1]="ana" et sa[0]="a" partagent 1 caractère
// sa[2]="anana" et sa[1]="ana" partagent 3 caractères "ana"
```

Le LCP array permet de trouver la plus longue sous-string répétée, de compter les sous-strings distinctes, et d'optimiser la recherche de pattern.

---

## 7) COMPLEXITÉ GLOBALE

```
Construction naïve  : O(n² log n) en temps, O(n) en espace
Construction efficace : O(n log² n) en temps, O(n) en espace
SA-IS (optimal)    : O(n)     : hors scope
Recherche de pattern : O(m log n)  après construction
LCP array       : O(n)     après suffix array
```

---

## EXERCICES

## EXO 1 : autocomplétion des jutsu
_~25 min_


Naruto a une liste de 20 jutsu. Il tape les premiers caractères et veut l'autocomplétion.

```js
const jutsu =
 "rasengan rasenshuriken shadow clone great ball rasengan chidori chidori blade";
```

Construis le suffix array sur ce corpus. Implémente `autocomplete(prefix)` : retourne tous les mots qui commencent par `prefix`. Utilise la recherche binaire sur le suffix array.

---

## EXO 2 : détection de plagiat
_~20 min_


Deux joueurs ont soumis leurs analyses de match. Tu veux savoir si l'un a copié sur l'autre.

```js
const analyse1 = "messi controle le jeu par sa vision et sa technique de balle";
const analyse2 =
 "la technique de balle et la vision du jeu de messi sont uniques";
```

Construis un suffix array sur la concaténation `analyse1 + "#" + analyse2` (le `#` est un séparateur qui n'apparaît pas dans le texte). Trouve la plus longue sous-string commune entre les deux analyses. Utilise le LCP array.

---

## EXO 3 : compression LZ77
_~25 min_


LZ77 (base de gzip) cherche la plus longue correspondance dans une fenêtre glissante. Implémente une version simplifiée :

Pour chaque position `i` dans la string, trouve la plus longue correspondance dans `str[0..i-1]` en utilisant le suffix array + LCP. Retourne la liste des `(offset, longueur)` ou `(caractère)` pour les positions sans correspondance.

Teste sur `"abracadabra"` et `"aaabaaab"`.

---

## RÉSUMÉ

Le Suffix Array trie les indices des suffixes d'une string. Une fois construit, chercher un pattern prend O(m log n) via recherche binaire : contre O(n\*m) en brute force. Construction naïve en O(n² log n), prefix doubling en O(n log² n). Le LCP array complète la structure pour les requêtes sur les préfixes communs. Idéal quand un même corpus est interrogé par de nombreux patterns différents : construire l'index une fois, chercher des milliers de fois.
