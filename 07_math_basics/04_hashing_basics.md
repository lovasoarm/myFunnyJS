---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# HASHING BASICS : L'EMPREINTE QUI NE MENT PAS
Temps de lecture ~10 min

Un hash c'est une fonction qui transforme n'importe quoi en empreinte de taille fixe.
Tu donnes `"Naruto"` : elle retourne `"a3f9c2"`. Tu donnes `"Naruto "` (avec une espace) : elle retourne `"71bd04"`. Complètement différent.

C'est partout : mots de passe, caches, tables de données, intégrité de fichiers, signatures de commits git.
Comprendre les hashes, c'est comprendre pourquoi ton `Map` est O(1), pourquoi bcrypt prend du temps, et pourquoi on ne stocke jamais un mot de passe en clair.

---

## 1) CE QU'UN HASH FAIT VRAIMENT

Trois propriétés fondamentales :

```
entrée quelconque --> [fonction de hachage] --> sortie taille fixe
```

**Déterministe** : même entrée = même sortie, toujours.
**Sens unique** : on ne peut pas retrouver l'entrée depuis la sortie.
**Effet avalanche** : un seul caractère changé = sortie radicalement différente.

```js
// hash naïf : somme des codes ASCII modulo une taille de table
function simpleHash(key, tableSize) {
 let hash = 0
 for (let i = 0; i < key.length; i++) {
  hash += key.charCodeAt(i)
 }
 return hash % tableSize
}

simpleHash("Naruto", 100)  // 63
simpleHash("naruto", 100)  // 63 <- problème : collision avec minuscule !
simpleHash("Sasuke", 100)  // 63 <- re-collision
```

Ce hash est trop simple : trop de collisions. En prod, on utilise des algos comme djb2, MurmurHash ou SHA-256.

---

## 2) LES COLLISIONS : LE VRAI PROBLÈME

Une collision c'est quand deux entrées différentes produisent le même hash.
Dans une hash table, c'est inévitable (pigeonhole principle : si t'as 100 cases et 200 clés, forcément des collisions).
En cryptographie, une collision c'est une catastrophe.

```js
// djb2 : bien mieux que la somme ASCII
function djb2(key) {
 let hash = 5381
 for (let i = 0; i < key.length; i++) {
  // hash * 33 + charCode : formule magique prouvée empiriquement
  hash = ((hash << 5) + hash) ^ key.charCodeAt(i)
  hash = hash >>> 0 // force unsigned 32-bit
 }
 return hash
}

djb2("Naruto")  // 2847392819
djb2("naruto")  // 3291048572 <- complètement différent
djb2("Sasuke")  // 1920384756 <- plus de collision visible
```

**Résoudre les collisions dans une hash table :**

```
Chaining (chaînage)      Open addressing (sondage linéaire)

table[3] --> ["Naruto", 100] table[3] = ["Naruto", 100]
       ["Sasuke", 80]  table[4] = ["Sasuke", 80] <- décalé
       ["Kakashi", 95] table[5] = ["Kakashi", 95] <- décalé
```

Le `Map` natif de JS gère tout ça pour toi. Mais maintenant tu sais pourquoi il existe.

---

## 3) HASH TABLE : LE Map SOUS LE CAPOT

Le `Map` de JS est une hash table. Insertion, lookup, suppression : O(1) amorti.

```js
// ce que Map fait internalement (version pédagogique)
class HashTable {
 constructor(size = 53) {
  this.table = new Array(size)
  this.size = size
 }

 _hash(key) {
  let hash = 5381
  for (let i = 0; i < key.length; i++) {
   hash = ((hash << 5) + hash) ^ key.charCodeAt(i)
   hash = hash >>> 0
  }
  return hash % this.size
 }

 set(key, value) {
  const index = this._hash(key)
  // chaining : chaque case est un tableau de paires [clé, valeur]
  if (!this.table[index]) this.table[index] = []
  // on cherche si la clé existe déjà
  const existing = this.table[index].find(([k]) => k === key)
  if (existing) {
   existing[1] = value // mise à jour
  } else {
   this.table[index].push([key, value]) // nouvelle entrée
  }
 }

 get(key) {
  const index = this._hash(key)
  if (!this.table[index]) return undefined
  const pair = this.table[index].find(([k]) => k === key)
  return pair ? pair[1] : undefined
 }
}

const scores = new HashTable()
scores.set("Naruto", 9500)
scores.set("Sasuke", 8800)
scores.get("Naruto") // 9500 en O(1)
```

---

## 4) HASH CRYPTOGRAPHIQUE VS HASH DE STRUCTURE

Deux usages, deux familles, deux exigences complètement différentes.

```
Hash de structure (Map, cache)   Hash cryptographique (bcrypt, SHA-256)
---------------------------------  ------------------------------------
Rapide : priorité performance    Lent : intentionnellement difficile
Collisions tolérées         Collisions = vulnérabilité critique
djb2, MurmurHash, xxHash      SHA-256, bcrypt, Argon2
```

**Pourquoi bcrypt est lent ?**

```js
// bcrypt avec facteur de coût = 12
// chaque incrément de 1 double le temps de calcul
// à cost=12 : ~250ms par hash
// à cost=14 : ~1000ms par hash

// c'est intentionnel : un attaquant qui teste 1M de mots de passe
// prend des années au lieu de quelques secondes

import bcrypt from "bcrypt"

async function hashPassword(password) {
 const salt = await bcrypt.genSalt(12) // 12 rounds = ~250ms
 return bcrypt.hash(password, salt)
}

// stocké en DB : "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeI..."
// l'original "Rasengan123" ne peut jamais être retrouvé depuis ça
```

---

## 5) LE HASHING EN PRATIQUE : LES CAS QUI REVIENNENT

**Cache avec invalidation :**
```js
// hash le contenu pour générer une clé de cache stable
function contentHash(data) {
 const str = JSON.stringify(data)
 let hash = 5381
 for (let i = 0; i < str.length; i++) {
  hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
  hash = hash >>> 0
 }
 return hash.toString(16) // "2f8a4b1c"
}

// si les données changent, le hash change
// si le hash change, le cache est invalidé automatiquement
const key = contentHash({ userId: 42, page: 3 })
cache.set(key, results, TTL_1H)
```

**Déduplication :**
```js
// identifier des documents identiques sans les comparer mot à mot
function dedupeDocuments(docs) {
 const seen = new Map()
 return docs.filter(doc => {
  const hash = contentHash(doc)
  if (seen.has(hash)) return false
  seen.set(hash, true)
  return true
 })
}
```

**Vérification d'intégrité :**
```js
// git fait exactement ça : chaque commit est identifié par son hash
// si quelqu'un modifie un fichier, le hash change, on le détecte
async function verifyFile(content, expectedHash) {
 const encoder = new TextEncoder()
 const data = encoder.encode(content)
 const hashBuffer = await crypto.subtle.digest("SHA-256", data)
 const hashArray = Array.from(new Uint8Array(hashBuffer))
 const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
 return hashHex === expectedHash
}
```

---

## 6) LES PIÈGES SILENCIEUX

**Piège 1 : comparer des hashes avec `==`**
```js
// DANGEREUX
if (userHash == storedHash) { ... }
// JS peut faire de la coercition sur les strings hexadécimales
// utilise === toujours

if (userHash === storedHash) { ... } // correct
```

**Piège 2 : hash d'objets**
```js
const map = new Map()
const key = { id: 1 }
map.set(key, "Naruto")

// ça marche... mais :
map.get({ id: 1 }) // undefined !
// { id: 1 } !== { id: 1 } en JS : deux objets différents en mémoire
// Map compare les références, pas les valeurs

// solution : sérialiser la clé
map.set(JSON.stringify(key), "Naruto")
map.get(JSON.stringify({ id: 1 })) // "Naruto"
```

**Piège 3 : timing attacks sur la comparaison de tokens**
```js
// DANGEREUX : comparison courte-circuitée
if (token === storedToken) { ... }
// un attaquant peut mesurer le temps de réponse
// et deviner caractère par caractère combien de chars sont corrects

// CORRECT : comparison en temps constant (crypto)
import { timingSafeEqual } from "crypto"
const safe = timingSafeEqual(
 Buffer.from(token),
 Buffer.from(storedToken)
)
```

---

## EXERCICES

## EXO 1 : LE JOURNAL DE MISSIONS SANS DOUBLONS

T'as un pipeline qui reçoit des events de complétion de mission ninja. Parfois la même mission arrive deux fois (latence réseau, retry). Tu dois dédupliquer sans stocker tous les events en mémoire.

Implémente une fonction `dedupeCaptures(events)` qui :
- utilise un hash djb2 sur `event.missionId + event.timestamp`
- retourne uniquement les events uniques
- tourne en O(n)

```js
const events = [
 { missionId: "rescue-gaara", timestamp: 1700000000, ninja: "Kakashi" },
 { missionId: "escort-tazuna", timestamp: 1700000001, ninja: "Kakashi" },
 { missionId: "rescue-gaara", timestamp: 1700000000, ninja: "Kakashi" }, // doublon
 { missionId: "hunt-orochimaru", timestamp: 1700000002, ninja: "Kakashi" },
]
// résultat attendu : 3 events (le doublon rescue-gaara éliminé)
```

---

## EXO 2 : LE SYSTÈME DE CACHE DE WALTER WHITE

Walter stocke des formules chimiques. Chaque formule prend 2 secondes à calculer.
Tu dois implémenter un cache memoize qui :
- génère une clé de cache à partir des arguments via djb2
- retourne le résultat en cache si disponible
- recalcule et met en cache sinon
- supporte les arguments multiples (pas juste un string)

```js
function memoize(fn) {
 // ton implémentation
}

const computeFormula = memoize(async (compound, temperature, pressure) => {
 await sleep(2000) // simulation calcul long
 return `${compound}_${temperature}_${pressure}_processed`
})

// premier appel : 2 secondes
await computeFormula("CH3", 200, 1.5)

// deuxième appel identique : instantané
await computeFormula("CH3", 200, 1.5)
```

---

## EXO 3 : DÉTECTION DE TAMPERING

Tu builds un système de logs pour Prison Break. Chaque log a un hash de son contenu.
T-Bag essaie de modifier les logs pour couvrir ses traces.

Implémente `verifyLogChain(logs)` qui :
- vérifie que chaque log n'a pas été modifié (hash du content doit matcher)
- vérifie que les logs forment une chaîne (chaque log contient le hash du précédent)
- retourne `{ valid: boolean, tamperedAt: number | null }`

```js
const logs = [
 { id: 1, content: "T-Bag entered cell block D", hash: "...", prevHash: null },
 { id: 2, content: "T-Bag met with Abruzzi", hash: "...", prevHash: "..." },
 { id: 3, content: "T-Bag accessed the infirmary", hash: "...", prevHash: "..." },
]
// c'est exactement comme ça que la blockchain fonctionne
```

---

## RÉSUMÉ

Un hash transforme n'importe quelle entrée en empreinte de taille fixe : déterministe, sens unique, effet avalanche.
Les collisions sont inévitables dans les hash tables, gérées par chaining ou open addressing, et catastrophiques en cryptographie.
Hash de structure = rapide, collisions tolérées. Hash cryptographique = lent intentionnellement, collisions interdites.
Le `Map` de JS t'offre du O(1) grâce au hashing. bcrypt te protège grâce à sa lenteur.
Les clés objet dans un `Map` se comparent par référence : sérialise-les si tu veux les comparer par valeur.
