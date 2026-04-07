# REGEX BASICS : LIRE DANS LES CHAÎNES SANS DEVENIR FOU

Une regex n'est pas une syntaxe ésotérique. C'est un moteur de recherche embarqué dans JS.
Tu décris un pattern. Le moteur cherche ce pattern dans une chaîne. Il te dit si ça match, où ça match, et quoi ça match.

Le problème : la syntaxe est dense. Une ligne de regex peut faire en 20 caractères ce que 15 lignes de conditions ne feraient pas aussi bien. Mais mal écrite, elle explose silencieusement.

---

## 1) ANATOMIE D'UNE REGEX

Une regex en JS s'écrit entre slashes : `/pattern/flags`

```js
const regex = /ninja/
const regexInsensible = /ninja/i    // flag i : insensible à la casse
const regexGlobale = /ninja/g       // flag g : cherche TOUTES les occurrences, pas juste la première
const regexMultiligne = /ninja/m    // flag m : ^ et $ matchent sur chaque ligne, pas juste le début/fin de la string
```

**Flags essentiels :**

| Flag | Signification | Cas d'usage |
|------|--------------|-------------|
| `i`  | case-insensitive | validation d'email, recherche utilisateur |
| `g`  | global (toutes occurrences) | replace all, match all |
| `m`  | multiline | parsing de blocs de texte ligne par ligne |
| `s`  | dotAll (`.` matche aussi `\n`) | parsing de blocs multi-lignes |

Tu peux combiner : `/ninja/gi` cherche "ninja" partout, sans distinction de casse.

---

## 2) MÉTHODES JS : QUI FAIT QUOI

Deux familles. Les méthodes de `RegExp`, les méthodes de `String`. Le piège : on les confond.

```js
const pattern = /\d+/g
const texte = "Messi a marqué 91 buts en 2012"

// --- MÉTHODES RegExp ---

// .test() : est-ce que ça matche ? retourne boolean
pattern.test(texte)   // true

// .exec() : cherche la prochaine occurrence (avec flag g : stateful, se souvient de sa position)
pattern.exec(texte)   // ['91', index: 18, ...]
pattern.exec(texte)   // ['2012', index: 28, ...]
pattern.exec(texte)   // null : plus rien à trouver

// --- MÉTHODES String ---

// .match() : sans flag g -> comme exec, retourne le premier match + groupes
//            avec flag g  -> retourne un tableau de tous les matches (sans infos de groupes)
texte.match(/\d+/)    // ['91', index: 18, ...]
texte.match(/\d+/g)   // ['91', '2012']

// .matchAll() : retourne un itérateur de tous les matches avec leurs groupes capturants
//               nécessite le flag g
[...texte.matchAll(/\d+/g)]  // [{match}, {match}]

// .replace() : remplace le(s) match(es)
texte.replace(/\d+/, 'X')    // "Messi a marqué X buts en 2012"  (premier seul)
texte.replace(/\d+/g, 'X')   // "Messi a marqué X buts en X"     (tous)

// .split() : coupe la chaîne autour des matches
"un, deux,  trois".split(/,\s*/)  // ['un', 'deux', 'trois']
```

**Le piège de `.exec()` avec le flag `g` :**

```js
const regex = /\d+/g
const texte = "91 buts en 2012"

// regex.lastIndex se met à jour à chaque appel
// si tu réutilises la même instance dans des contextes différents, tu obtiens des résultats incohérents

regex.exec(texte)  // ['91'] — lastIndex = 2
regex.exec(texte)  // ['2012'] — lastIndex = 16
regex.exec(texte)  // null — lastIndex reset à 0

// Solution : utiliser .matchAll() ou recréer la regex à chaque fois
// OU utiliser une boucle explicite avec .exec() en sachant exactement ce qu'on fait
```

---

## 3) LES PATTERNS DE BASE

### Caractères spéciaux

```js
// Quantificateurs
/a+/    // a une fois ou plus
/a*/    // a zéro fois ou plus
/a?/    // a zéro ou une fois (optionnel)
/a{3}/  // a exactement 3 fois
/a{2,5}/  // a entre 2 et 5 fois

// Classes de caractères
/\d/   // chiffre : [0-9]
/\D/   // pas un chiffre
/\w/   // mot : [a-zA-Z0-9_]
/\W/   // pas un mot
/\s/   // espace, tab, newline
/\S/   // pas un espace

// Ancres
/^ninja/    // "ninja" en début de chaîne
/ninja$/    // "ninja" en fin de chaîne
/\bninja\b/ // "ninja" comme mot entier (word boundary)

// Le point
/./    // n'importe quel caractère SAUF \n
/[\s\S]/ // vraiment n'importe quel caractère, newline inclus
```

### Classes personnalisées

```js
/[aeiou]/    // une voyelle
/[^aeiou]/   // pas une voyelle (^ dans [] = négation)
/[a-z]/      // minuscule
/[A-Z0-9]/   // majuscule OU chiffre
```

---

## 4) EXEMPLE RÉALISTE : VALIDATION D'EMAIL

Trois niveaux. Le minimal, le réaliste, celui qui casse.

```js
// Niveau 1 : minimal — juste vérifier qu'il y a un @ et un point quelque part après
const emailMinimal = /\S+@\S+\.\S+/
emailMinimal.test("messi@barca.com")     // true
emailMinimal.test("pas-un-email")         // false

// Niveau 2 : réaliste — pattern standard pour la majorité des cas
const emailRealiste = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
emailRealiste.test("messi@barca.com")        // true
emailRealiste.test("messi+copa@barca.com")   // true
emailRealiste.test("@barca.com")             // false

// Niveau 3 : celui qui casse
const emailCasse = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

emailCasse.test("messi@barca.museum")   // true  — TLD de 6 chars : ok
emailCasse.test("messi@büro.de")        // false — unicode dans le domaine : échoue
                                         // mais büro.de est un email valide

// La vraie leçon : aucune regex ne valide parfaitement un email
// Le standard RFC 5321 autorise des choses qu'on n'imaginerait pas
// En prod, tu valides la structure basique PUIS tu envoies un email de confirmation
// C'est la confirmation qui valide vraiment
```

---

## 5) EXEMPLE RÉALISTE : NETTOYAGE ET EXTRACTION

```js
const setlistEntry = "03:45 | Lose Yourself | Eminem | BPM: 170 | Dm"

// Extraire la durée
const dureeMatch = setlistEntry.match(/^(\d{2}):(\d{2})/)
// ['03:45', '03', '45', index: 0, ...]
// dureeMatch[1] = '03' (minutes), dureeMatch[2] = '45' (secondes)

// Extraire le BPM
const bpmMatch = setlistEntry.match(/BPM:\s*(\d+)/)
// bpmMatch[1] = '170'

// Extraire la tonalité (lettre + optionnellement m/M/# ou b)
const tonaliteMatch = setlistEntry.match(/\|\s*([A-G][#b]?m?)\s*$/)
// tonaliteMatch[1] = 'Dm'

// Transformer : remplacer le séparateur pour un export CSV
const csv = setlistEntry.replace(/\s*\|\s*/g, ',')
// "03:45,Lose Yourself,Eminem,BPM: 170,Dm"

// Couper sur le séparateur pour avoir un tableau
const parts = setlistEntry.split(/\s*\|\s*/)
// ['03:45', 'Lose Yourself', 'Eminem', 'BPM: 170', 'Dm']
```

---

## 6) LE RISQUE RÉEL : CATASTROPHIC BACKTRACKING

Une regex mal écrite peut bloquer le thread JS.

```js
// Pattern dangereux : quantificateurs imbriqués sur des groupes qui se chevauchent
const dangereux = /^(a+)+$/

// Sur une chaîne comme "aaaaaaaaab", le moteur essaie toutes les combinaisons
// de découpage possibles avant de conclure que ça ne matche pas
// Complexité : exponentielle

dangereux.test("aaaaaaaaab")       // peut prendre des secondes, voire geler Node.js
dangereux.test("aaaaaaaaaaaaaab")  // timeout quasi certain

// C'est un vecteur d'attaque réel : ReDoS (Regular Expression Denial of Service)
// Un utilisateur peut envoyer une chaîne qui paralyse ton serveur

// Solution : éviter les quantificateurs imbriqués sur des groupes similaires
// Tester tes regex sur des inputs pathologiques avant de les mettre en prod
// Utiliser des outils comme safe-regex ou validator.js pour les validations critiques
```

---

# EXERCICES

## EXO 1 : Le Scouter de Kaijus

Le système de surveillance détecte des Kaijus dans des logs. Chaque log ressemble à :
```
[2024-03-15 14:32:01] KAIJU DETECTED | Name: Godzilla | Category: 4 | Threat: EXTREME
[2024-03-15 14:33:45] SYSTEM OK | Status: nominal
[2024-03-15 14:35:22] KAIJU DETECTED | Name: King Ghidorah | Category: 5 | Threat: EXTINCTION
```

Écris une fonction `parseKaijuLogs(logs)` qui :
1. filtre uniquement les lignes de détection de Kaiju
2. extrait pour chaque ligne : timestamp, nom, catégorie, niveau de menace
3. retourne un tableau d'objets `{ timestamp, name, category, threat }`

Contrainte : une seule regex pour l'extraction (pas une regex par champ).

*(Indice : les groupes capturants, c'est fait pour ça. `/regex avec (groupe1) et (groupe2)/`)*

---

## EXO 2 : Le Validateur de Setlist

Une setlist mal formatée arrive depuis une API externe. Chaque entrée peut être :
```
"3:45 - Lose Yourself - 170bpm"
"4:12 - God's Plan - 86 BPM"
"2:58-HUMBLE.-92BPM"
"5:00 - Bohemian Rhapsody"      // pas de BPM
"invalid entry"
```

Écris une fonction `parseSetlistEntry(entry)` qui retourne :
```js
{ duration: "3:45", title: "Lose Yourself", bpm: 170 } // ou bpm: null si absent
// null si l'entrée est invalide (pas de durée valide, pas de titre)
```

Contrainte : la fonction doit être robuste. Une entrée invalide ne doit jamais lever d'exception.

*(Indice : `String.prototype.match()` retourne `null` si rien n'est trouvé. C'est gérable.)*

---

## EXO 3 : L'Escape Room du Prototype Chain

Tu reçois du code JS en chaîne de caractères (output d'un linter maison). Il peut contenir des accès dangereux au prototype :

```js
const dangerousCode = `
  obj.__proto__.isAdmin = true;
  user["__proto__"]["polluted"] = true;
  Object.setPrototypeOf(target, malicious);
`
```

Écris une fonction `detectPrototypePollution(code)` qui retourne un tableau de toutes les lignes suspectes et le type d'attaque détectée (`__proto__`, `setPrototypeOf`, ou `constructor.prototype`).

Contrainte : ignorer les lignes qui sont des commentaires (commençant par `//` après trim).

*(Indice : `.matchAll()` avec le flag `g`, et itérer sur les résultats.)*

---

# RÉSUMÉ

Une regex est stateful quand elle a le flag `g` : `.exec()` se souvient de sa position. Oublie ça et tu débugues pendant une heure.

Les méthodes ne s'utilisent pas au hasard : `.test()` pour tester, `.match()` sans `g` pour capturer des groupes, `.match()` avec `g` pour récupérer tous les matches bruts, `.matchAll()` quand tu veux les deux.

La validation d'email parfaite n'existe pas en regex. En prod, tu valides la forme, tu confirmes par envoi.

Le catastrophic backtracking est réel et c'est un vecteur d'attaque. Tout quantificateur imbriqué sur un groupe similaire est suspect.

La regex n'est pas la bonne solution pour parser du HTML, du JSON, ou du Markdown — un parser dédié existe pour ça, utilise-le.
