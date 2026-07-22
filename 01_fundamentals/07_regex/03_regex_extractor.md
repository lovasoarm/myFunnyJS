---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# REGEX EXTRACTOR : CAPTURER, REMPLACER, SPLITTER
Temps de lecture ~9 min

La validation c'est le niveau 1. Le niveau 2 : transformer des données. Parser du texte brut en structures utilisables. Remplacer des patterns de façon chirurgicale. Découper des chaînes sur des frontières complexes.

C'est là que les regex deviennent vraiment utiles. Et là que les gens se brûlent les doigts parce qu'ils ne connaissent pas les méthodes qui vont avec.

---

## 1) L'ARSENAL COMPLET DES MÉTHODES REGEX

```js
// sur les regex
regex.test(str)   // boolean : ça matche ?
regex.exec(str)   // array ou null : le premier match avec groupes

// sur les strings
str.match(regex)  // array ou null : tous les matches (avec /g) ou le premier
str.matchAll(regex) // iterator : tous les matches AVEC les groupes (nécessite /g)
str.replace(regex, remplacement)  // remplace le premier match (ou tous avec /g)
str.replaceAll(str, remplacement) // string uniquement, pas de regex
str.search(regex)  // index du premier match, ou -1
str.split(regex)  // découpe sur le pattern
```

---

## 2) `.exec()` : le match avec mémoire

Quand tu utilises `.exec()` sur une regex avec le flag `g`, elle avance dans la chaîne à chaque appel. Elle se souvient de sa position via `regex.lastIndex`.

```js
const texte = "Naruto a 9000 chakra, Sasuke a 8500 chakra"
const regex = /(\w+) a (\d+) chakra/g

let match
while ((match = regex.exec(texte)) !== null) {
 console.log(`${match[1]} : ${match[2]}`)
}
// Naruto : 9000
// Sasuke : 8500
```

Piège avec `.exec()` stateful :

```js
const regex = /\d+/g
regex.exec("abc 123 def 456") // ["123"] lastIndex = 7
regex.exec("abc 123 def 456") // ["456"] lastIndex = 11
regex.exec("abc 123 def 456") // null   lastIndex = 0 (reset)
regex.exec("abc 123 def 456") // ["123"] ça recommence
```

Si tu réutilises la même regex entre plusieurs chaînes sans reset, `lastIndex` te donnera des résultats incorrects. Toujours créer une nouvelle regex instance, ou reset `regex.lastIndex = 0` manuellement.

---

## 3) `.matchAll()` : le bon outil pour les groupes multiples

`.matchAll()` retourne un iterator. Chaque élément contient le match complet ET les groupes de capture. C'est l'outil pour parser du texte structuré.

```js
const log = `
[2024-04-01 08:23:11] ERROR: chakra insuffisant pour user naruto
[2024-04-01 09:47:33] INFO: connexion réussie pour user sasuke
[2024-04-01 10:15:02] ERROR: jutsu inconnu pour user sakura
`

const regex = /\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\] (\w+): (.+)/g
const matches = [...log.matchAll(regex)]

const erreurs = matches
 .filter(m => m[3] === "ERROR")
 .map(m => ({
  date: m[1],
  heure: m[2],
  message: m[4]
 }))

// [
//  { date: "2024-04-01", heure: "08:23:11", message: "chakra insuffisant pour user naruto" },
//  { date: "2024-04-01", heure: "10:15:02", message: "jutsu inconnu pour user sakura" }
// ]
```

---

## 4) `.replace()` : remplacer avec précision chirurgicale

La version de base :

```js
"Naruto est fort".replace(/fort/, "imbattable")
// "Naruto est imbattable"

"Naruto est fort, Sasuke est fort".replace(/fort/g, "imbattable")
// "Naruto est imbattable, Sasuke est imbattable"
```

Avec des références aux groupes dans le remplacement :

```js
// $1, $2... font référence aux groupes de capture
"Naruto Uzumaki".replace(/(\w+) (\w+)/, "$2 $1")
// "Uzumaki Naruto"

// formater des dates
"2024-04-15".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1")
// "15/04/2024"
```

Avec une fonction de remplacement : la vraie puissance.

```js
const texte = "le xG de Mbappé est 0.73 et le xG de Benzema est 0.81"

// multiplier tous les xG par 100 pour avoir des pourcentages
texte.replace(/\d+\.\d+/g, (match) => {
 return (parseFloat(match) * 100).toFixed(0) + "%"
})
// "le xG de Mbappé est 73% et le xG de Benzema est 81%"
```

La fonction reçoit `(match, ...groupes, offset, chaîneComplète)`. Elle retourne le remplacement.

```js
// capitaliser chaque premier mot d'une phrase
"naruto est fort. sasuke aussi.".replace(/(?<=^|\.)\s*([a-z])/g, (m, lettre) => {
 return m.replace(lettre, lettre.toUpperCase())
})
// "Naruto est fort. Sasuke aussi."
```

---

## 5) `.split()` : découper sur des patterns

`.split()` accepte une regex, pas juste une chaîne.

```js
// découper sur un ou plusieurs espaces
"Naruto Sasuke  Sakura".split(/\s+/)
// ["Naruto", "Sasuke", "Sakura"]

// découper sur des virgules avec espaces optionnels
"Naruto, Sasuke ,Sakura,Kakashi".split(/\s*,\s*/)
// ["Naruto", "Sasuke", "Sakura", "Kakashi"]

// découper sur des séparateurs multiples
"tags: action|aventure|anime|combat".split(/[|:]/)
// ["tags", " action", "aventure", "anime", "combat"]
```

Conserver les séparateurs dans le résultat avec un groupe de capture :

```js
"Naruto. Sasuke! Sakura?".split(/([.!?])/)
// ["Naruto", ".", " Sasuke", "!", " Sakura", "?", ""]
// les séparateurs sont inclus quand ils sont dans un groupe de capture
```

---

## 6) PARSER DU TEXTE BRUT : le cas réel

Une setlist de concert dans un format chaotique. On en fait un tableau d'objets.

```js
const setlist = `
 1. Money Trees - Kendrick Lamar  [4:37]
 2. Cranes in the Sky- Solange[4:40]
 3. Location - Khalid [3:50]
`

const ligneRegex = /^\s*\d+\.\s*(.+?)\s*-\s*(.+?)\s*\[(\d+:\d+)\]\s*$/gm

const tracks = [...setlist.matchAll(ligneRegex)].map(m => ({
 titre: m[1].trim(),
 artiste: m[2].trim(),
 duree: m[3]
}))

// [
//  { titre: "Money Trees", artiste: "Kendrick Lamar", duree: "4:37" },
//  { titre: "Cranes in the Sky", artiste: "Solange", duree: "4:40" },
//  { titre: "Location", artiste: "Khalid", duree: "3:50" }
// ]
```

Le flag `m` est essentiel ici : sans lui, `^` et `$` ne matchent que le début/fin de toute la chaîne, pas de chaque ligne.

---

## 7) LE PIÈGE : backtracking catastrophique

Certaines regex sur certaines chaînes peuvent tourner pendant des secondes (ou bloquer le thread).

```js
// regex naïve : plusieurs quantificateurs greedys imbriqués
const regexDangereuse = /^(a+)+$/

// sur une chaîne qui ne matche pas :
regexDangereuse.test("aaaaaaaaaaaaaaaaaaaab")
// le moteur essaie toutes les combinaisons possibles de groupes
// peut prendre des secondes ou des minutes selon la longueur
```

C'est le ReDoS (Regular Expression Denial of Service). En prod sur une API publique : un attaquant envoie une chaîne calculée pour déclencher ce comportement.

Règles pour l'éviter :
- pas de groupes quantifiés imbriqués sur les mêmes caractères : `(a+)+`, `(\w*)*`
- utiliser des groupes non-capturants `(?:)` quand tu n'as pas besoin du groupe
- tester les performances sur des chaînes longues avant de déployer

---

## EXERCICES

## EXO 1 : le parser de logs de mission ninja
Des logs de mission d'un escadron de Konoha arrivent en texte brut :

```
[ALERTE] 14:23:07 | ennemi géant détecté | Zone: Nord | Menace: 60
[NEUTRE] 14:25:11 | Mouvement inhabituel | Zone: Est | Menace: N/A
[ALERTE] 15:01:33 | ennemi cuirassé détecté | Zone: Ouest | Menace: 15
```

Parse chaque ligne alerte en un objet `{ heure, type, zone, menace }`. Ignore les lignes NEUTRE. Utilise des groupes nommés.

---

## EXO 2 : le formateur de statistiques de match
Tu reçois du texte provenant d'un vieux système :

```
"mbappe:goals=28,assists=12,xg=24.7|benzema:goals=15,assists=8,xg=14.2|griezmann:goals=10,assists=15,xg=11.3"
```

Parse ça en un tableau d'objets joueur avec leurs stats. Utilise `.split()` sur le `|`, puis `.matchAll()` pour les stats de chaque joueur.

Bonus : remplace le champ `xg` par `xgPct` en multipliant par 100 et arrondissant à l'entier.

---

## EXO 3 : le cleaner de setlist générative
Une IA génère des setlists mais avec des formats incohérents (majuscules aléatoires, espaces en trop, numérotation variée).

Ta fonction `normaliserSetlist(texte)` doit :
1. Extraire tous les titres et artistes
2. Mettre les titres en Title Case (première lettre de chaque mot en majuscule)
3. Normaliser les artistes : trimmer, un seul espace entre les mots
4. Retourner un tableau d'objets `{ position, titre, artiste }`

Teste sur au moins 3 formats d'entrée différents.

---

## RÉSUMÉ

`.matchAll()` pour extraire plusieurs groupes sur plusieurs matches. `.replace()` avec une fonction pour des transformations complexes. `.split()` avec des regex pour des séparateurs non-triviaux.

Le backtracking catastrophique est un vrai risque en prod. Les quantificateurs imbriqués sur les mêmes caractères sont dangereux.

La regex n'est pas la fin du traitement : c'est le début. Elle extrait les parties. Le code JS transforme, valide, restructure. Les deux travaillent ensemble.
