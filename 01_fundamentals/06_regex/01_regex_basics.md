# REGEX : CHERCHER DANS DU TEXTE SANS ÉCRIRE 40 CONDITIONS

Tu as déjà eu ce moment : t'as une chaîne de texte, et tu veux savoir si elle contient un numéro de téléphone. Ou un email. Ou une durée comme "3:45".

La solution naïve : 10 lignes de `if`, `indexOf`, `slice`. Ça marche. Mais c'est fragile et chiant à maintenir.

La regex, c'est une autre approche : tu décris ce que tu cherches. Le moteur JS se charge de trouver.

---

## 1) C'EST QUOI CONCRÈTEMENT

Une regex, c'est un pattern écrit entre deux slashes :

```js
const pattern = /ninja/
```

Ça ne fait rien tout seul. Pour l'utiliser :

```js
const pattern = /ninja/

pattern.test("Naruto est un ninja")   // true
pattern.test("Naruto est un hokage")  // false
```

`.test()` pose une seule question : est-ce que ce pattern existe dans cette chaîne ? Oui ou non.

C'est le point d'entrée. On build là-dessus.

---

## 2) LES FLAGS : CHANGER LE COMPORTEMENT

Par défaut, une regex est sensible à la casse et s'arrête au premier résultat. Les flags changent ça.

```js
/ninja/i   // insensible à la casse : "Ninja", "NINJA", "niNJa" → tous matchent
/ninja/g   // cherche toutes les occurrences, pas juste la première
/ninja/gi  // les deux en même temps
```

Pour l'instant, `i` et `g` suffisent. Le reste vient plus tard.

---

## 3) LES PATTERNS : DÉCRIRE CE QU'ON CHERCHE

Écrire `/ninja/` cherche exactement la suite de caractères "ninja". Mais les regex sont plus puissantes que ça.

**Les raccourcis pour les types de caractères :**

```js
/\d/   // un chiffre : 0 à 9
/\w/   // une lettre, un chiffre, ou un underscore
/\s/   // un espace, une tabulation, un retour à la ligne
```

Le majuscule inverse le sens :

```js
/\D/   // tout sauf un chiffre
/\W/   // tout sauf une lettre/chiffre/underscore
/\S/   // tout sauf un espace
```

**Les quantificateurs : combien de fois ce pattern se répète :**

```js
/\d+/    // un chiffre ou plus  →  "42", "170", "9999" matchent
/\d*/    // zéro chiffre ou plus
/\d?/    // zéro ou un chiffre (optionnel)
/\d{3}/  // exactement 3 chiffres
/\d{2,4}/  // entre 2 et 4 chiffres
```

**Les ancres : où dans la chaîne :**

```js
/^ninja/   // la chaîne commence par "ninja"
/ninja$/   // la chaîne finit par "ninja"
```

**Les classes personnalisées :**

```js
/[aeiou]/    // une voyelle
/[a-z]/      // une lettre minuscule
/[A-Z0-9]/   // une majuscule OU un chiffre
/[^aeiou]/   // n'importe quoi SAUF une voyelle (le ^ dans [] = "pas ça")
```

---

## 4) LES 4 MÉTHODES QU'ON UTILISE VRAIMENT

### `.test()` — est-ce que ça matche ?

```js
/\d+/.test("91 buts")   // true
/\d+/.test("zéro but")  // false
```

Retourne `true` ou `false`. C'est tout.

---

### `.match()` — récupérer ce qui matche

```js
const texte = "Messi a marqué 91 buts en 2012"

texte.match(/\d+/)    // ['91'] — s'arrête au premier
texte.match(/\d+/g)   // ['91', '2012'] — tous, grâce au flag g
```

Sans flag `g` : retourne le premier match avec des infos.
Avec flag `g` : retourne juste un tableau de toutes les valeurs trouvées.

---

### `.replace()` — remplacer ce qui matche

```js
const texte = "Messi a marqué 91 buts en 2012"

texte.replace(/\d+/, 'X')    // "Messi a marqué X buts en 2012"  → premier seulement
texte.replace(/\d+/g, 'X')   // "Messi a marqué X buts en X"     → tous
```

---

### `.split()` — couper autour de ce qui matche

```js
"un, deux,  trois".split(/,\s*/)   // ['un', 'deux', 'trois']
```

Le séparateur peut être un pattern regex, pas juste un caractère fixe. Ici `/,\s*/` = une virgule suivie de zéro espace ou plus.

---

## 5) EXEMPLE RÉALISTE : PARSER UNE ENTRÉE DE SETLIST

```
"03:45 | Lose Yourself | 170 BPM"
```

On veut extraire la durée et le BPM. Sans regex, t'as besoin de `split`, de `trim`, de vérifications... Avec regex :

```js
const entry = "03:45 | Lose Yourself | 170 BPM"

// La durée : deux groupes de chiffres séparés par un deux-points
const duree = entry.match(/\d{1,2}:\d{2}/)
// ['03:45']

// Le BPM : un nombre suivi de " BPM"
const bpm = entry.match(/(\d+)\s*BPM/)
// ['170 BPM', '170']
// bpm[1] c'est juste le nombre : '170'
// Les parenthèses créent un "groupe capturant" — on y revient dans la leçon suivante
```

Trois lignes. Chacune pose une question précise à la chaîne.

---

## 6) LE RISQUE : UNE REGEX PEUT GELER TON PROGRAMME

C'est contre-intuitif mais réel. Certains patterns mal écrits peuvent prendre une éternité à s'exécuter sur certaines chaînes.

```js
// Ce pattern est dangereux
const dangereux = /^(a+)+$/

dangereux.test("aaaaab")             // rapide
dangereux.test("aaaaaaaaaaaab")      // très lent
dangereux.test("aaaaaaaaaaaaaaaab")  // peut geler Node.js plusieurs secondes
```

Pourquoi ? Le moteur essaie toutes les façons possibles de faire matcher `(a+)+`. Sur une chaîne qui ne matche pas, il n'abandonne qu'après les avoir toutes tentées. Plus la chaîne est longue, plus c'est long — exponentiellement.

La règle à retenir : **méfie-toi des quantificateurs imbriqués** comme `(a+)+` ou `(\w+)*`. Si t'as un doute sur un pattern utilisé en prod, teste-le avec une longue chaîne qui ne matche pas.

---

# EXERCICES

## EXO 1 : Le Scouter de l'Alliance de la Mort

Les logs du système de surveillance de l'Alliance ressemblent à ça :

```
"[14:32] ALERTE — Titan Colossal détecté — Coordonnées : 47"
"[14:33] STATUS — Tout est calme"
"[14:35] ALERTE — Titan Bestial détecté — Coordonnées : 12"
```

Écris une fonction `isAlert(log)` qui retourne `true` si la ligne est une alerte, `false` sinon.

Puis écris `getCoordinate(log)` qui retourne le nombre de coordonnées (`47`, `12`) ou `null` si la ligne n'est pas une alerte.

---

## EXO 2 : Le Validateur de Setlist

Des setlists arrivent depuis différentes sources. Les durées peuvent s'écrire de plusieurs façons :

```js
"3:45"   // valide
"03:45"  // valide
"3:4"    // invalide — les secondes, c'est toujours 2 chiffres
"145"    // invalide — pas de deux-points
"abc"    // invalide
```

Écris une fonction `isValidDuration(str)` qui retourne `true` uniquement pour les formats valides.

Contrainte : une seule ligne de code avec `.test()`.

*(Indice : les minutes peuvent faire 1 ou 2 chiffres, les secondes toujours 2.)*

---

## EXO 3 : L'Extracteur de Stats

Tu reçois des résumés de match dans ce format :

```
"Messi | Buts: 2 | Passes: 1 | Note: 9.5"
"Ronaldo | Buts: 1 | Passes: 0 | Note: 7"
```

Écris une fonction `parseStats(line)` qui retourne :

```js
{ name: "Messi", goals: 2, assists: 1, rating: 9.5 }
```

Contrainte : utilise `.match()`. Si la ligne ne correspond pas au format, retourne `null`.

*(Indice : `.match()` retourne `null` si rien ne matche — pas besoin de try/catch.)*

---

# RÉSUMÉ

Une regex, c'est un pattern qui décrit ce qu'on cherche dans une chaîne. On ne lit pas caractère par caractère, on décrit la forme.

Les quatre méthodes à connaître : `.test()` pour vérifier, `.match()` pour extraire, `.replace()` pour transformer, `.split()` pour découper.

Les quantificateurs (`+`, `*`, `?`, `{n}`) disent combien de fois un caractère peut apparaître. Les ancres (`^`, `$`) disent où dans la chaîne.

Un pattern avec des quantificateurs imbriqués peut bloquer ton programme sur des chaînes longues. C'est un vrai risque en prod.

La leçon suivante : les groupes capturants, l'alternation, et les cas qui piègent même les devs expérimentés.
