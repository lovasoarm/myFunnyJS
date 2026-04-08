# REGEX : CHERCHER DANS DU TEXTE SANS ÉCRIRE 40 CONDITIONS

T'as une chaîne : `"03:45 | Lose Yourself | 170 BPM"`.
Tu veux extraire la durée et le BPM.

Sans regex, t'écris `split`, `trim`, `parseInt`, des conditions pour gérer les espaces en trop... 15 lignes pour un truc bête.

Avec regex, deux lignes. On y vient. Mais d'abord, comprendre ce que c'est.

---

## 1) UN PATTERN, C'EST UNE DESCRIPTION

Une regex, c'est une description de ce qu'on cherche. On l'écrit entre deux slashes :

```js
const pattern = /ninja/
```

Pour l'utiliser, la méthode la plus simple est `.test()` : elle répond juste oui ou non.

```js
/ninja/.test("Naruto est un ninja")   // true
/ninja/.test("Naruto est un hokage")  // false
```

C'est le point de départ. Maintenant, rendre ce pattern plus expressif.

---

## 2) DÉCRIRE UN TYPE DE CARACTÈRE

Au lieu de chercher exactement "ninja", on peut chercher "n'importe quel chiffre" :

```js
/\d/.test("Messi a 7 ballons d'or")   // true  — il y a au moins un chiffre
/\d/.test("zéro but")                  // false — aucun chiffre
```

`\d` est un raccourci pour "un chiffre de 0 à 9". Il y en a d'autres :

```js
/\w/   // une lettre, un chiffre, ou un underscore
/\s/   // un espace, une tabulation, un retour à la ligne
```

Le majuscule inverse le sens — c'est la même logique partout :

```js
/\D/   // tout SAUF un chiffre
/\W/   // tout SAUF une lettre/chiffre/underscore
/\S/   // tout SAUF un espace
```

---

## 3) DIRE COMBIEN DE FOIS

`/\d/` matche un seul chiffre. Pour matcher un nombre entier, il faut dire "un chiffre ou plus" :

```js
/\d+/.test("91 buts")    // true  — "91" = deux chiffres, + accepte 1 ou plus
/\d+/.test("zéro but")   // false — aucun chiffre
```

Les quantificateurs :

```js
/\d+/    // 1 chiffre ou plus
/\d*/    // 0 chiffre ou plus
/\d?/    // 0 ou 1 chiffre (optionnel)
/\d{3}/  // exactement 3 chiffres
/\d{2,4}/  // entre 2 et 4 chiffres
```

Exemple concret — matcher une durée comme "3:45" ou "03:45" :

```js
// Minutes : 1 ou 2 chiffres. Secondes : exactement 2 chiffres.
/\d{1,2}:\d{2}/.test("3:45")    // true
/\d{1,2}:\d{2}/.test("03:45")   // true
/\d{1,2}:\d{2}/.test("3:4")     // false — secondes trop courtes
/\d{1,2}:\d{2}/.test("abc")     // false
```

---

## 4) DIRE OÙ DANS LA CHAÎNE

Sans ancre, le pattern peut matcher n'importe où dans la chaîne :

```js
/\d{1,2}:\d{2}/.test("durée: 03:45 et autre chose")   // true
```

Avec les ancres `^` et `$`, on force la position :

```js
/^\d{1,2}:\d{2}$/.test("03:45")                          // true  — toute la chaîne est une durée
/^\d{1,2}:\d{2}$/.test("durée: 03:45 et autre chose")    // false — il y a du texte autour
```

`^` = début de chaîne. `$` = fin de chaîne.

---

## 5) DÉFINIR SES PROPRES CLASSES

`\d`, `\w`, `\s` couvrent les cas généraux. Pour quelque chose de précis, on définit une classe entre crochets :

```js
/[aeiou]/    // une voyelle
/[a-z]/      // une lettre minuscule
/[A-Z0-9]/   // une majuscule OU un chiffre
/[^aeiou]/   // n'importe quoi SAUF une voyelle — le ^ dans [] = "pas ça"
```

Exemple : matcher une tonalité musicale comme "Dm", "F#", "Bb" :

```js
/[A-G][#b]?m?/.test("Dm")   // true
/[A-G][#b]?m?/.test("F#")   // true
/[A-G][#b]?m?/.test("Bb")   // true
/[A-G][#b]?m?/.test("X")    // false
```

---

## 6) LES 4 MÉTHODES QU'ON UTILISE VRAIMENT

### `.test()` — est-ce que ça matche ?

```js
/\d+/.test("91 buts")   // true
/\d+/.test("zéro but")  // false
```

Retourne `true` ou `false`. Rien d'autre.

---

### `.match()` — extraire ce qui matche

```js
const texte = "Messi a marqué 91 buts en 2012"

texte.match(/\d+/)    // ['91'] — s'arrête au premier match
texte.match(/\d+/g)   // ['91', '2012'] — tous les matchs grâce au flag g
```

**Ce que tu dois savoir avant d'utiliser `.match()` :**

```js
// Si rien ne matche, .match() retourne null — pas un tableau vide
"zéro but".match(/\d+/)   // null

// Ce bug arrive tout le temps chez les débutants :
const result = "zéro but".match(/\d+/)
result[0]   // TypeError: Cannot read properties of null

// La bonne façon :
const result = "zéro but".match(/\d+/)
if (result) {
  console.log(result[0])   // on accède seulement si ça a matché
}
```

---

### `.replace()` — remplacer ce qui matche

```js
const texte = "Messi a marqué 91 buts en 2012"

texte.replace(/\d+/, 'X')    // "Messi a marqué X buts en 2012"  — premier seulement
texte.replace(/\d+/g, 'X')   // "Messi a marqué X buts en X"     — tous
```

---

### `.split()` — couper autour de ce qui matche

```js
// Le séparateur peut être un pattern, pas juste un caractère fixe
"un, deux,  trois".split(/,\s*/)   // ['un', 'deux', 'trois']
// ,\s* = une virgule suivie de zéro espace ou plus — gère les espaces irréguliers
```

---

## 7) LES FLAGS

Deux flags à connaître maintenant :

```js
/ninja/i   // insensible à la casse : "Ninja", "NINJA", "niNJa" → tous matchent
/ninja/g   // cherche toutes les occurrences, pas juste la première
/ninja/gi  // les deux en même temps
```

Le flag `g` change le comportement de `.match()` — c'est ce qu'on a vu en section 6.

---

## 8) ASSEMBLER TOUT ÇA : L'EXEMPLE DE LA SETLIST

```js
const entry = "03:45 | Lose Yourself | 170 BPM"

// Extraire la durée
const duree = entry.match(/\d{1,2}:\d{2}/)
// ['03:45'] — duree[0] = '03:45'

// Extraire le BPM
const bpm = entry.match(/(\d+)\s*BPM/)
// ['170 BPM', '170'] — bpm[1] = '170'
// Les parenthèses créent un groupe capturant : on isole juste le nombre
// C'est quoi exactement les groupes capturants ? Leçon suivante.

// Extraire la tonalité si elle est présente
const tonalite = entry.match(/[A-G][#b]?m?$/)
// null — pas de tonalité dans cet exemple
// Pas de crash grâce au if(result) vu en section 6
```

---

## 9) LE RISQUE : UNE REGEX PEUT GELER TON PROGRAMME

Certains patterns peuvent prendre une éternité sur certaines chaînes.

```js
const dangereux = /^(a+)+$/

dangereux.test("aaaaab")             // rapide
dangereux.test("aaaaaaaaaaaab")      // lent
dangereux.test("aaaaaaaaaaaaaaaab")  // peut geler Node.js plusieurs secondes
```

Le moteur essaie toutes les façons possibles de faire matcher `(a+)+`. Sur une chaîne qui ne matche pas, il les essaie toutes avant d'abandonner. Plus la chaîne est longue, plus c'est long — exponentiellement.

La règle : **méfie-toi des quantificateurs imbriqués** comme `(a+)+` ou `(\w+)*`. En prod, teste toujours un pattern suspect avec une longue chaîne qui ne matche pas.

---

# EXERCICES

## EXO 1 : Le Scouter de l'Alliance de la Mort

Les logs du système de surveillance ressemblent à ça :

```
"[14:32] ALERTE — Titan Colossal détecté — Coordonnées : 47"
"[14:33] STATUS — Tout est calme"
"[14:35] ALERTE — Titan Bestial détecté — Coordonnées : 12"
```

Écris `isAlert(log)` qui retourne `true` si la ligne est une alerte.

Puis écris `getCoordinate(log)` qui retourne le nombre de coordonnées (`47`, `12`) ou `null` si la ligne n'est pas une alerte.

Contrainte : `getCoordinate` ne doit jamais crasher, même sur une chaîne vide.

---

## EXO 2 : Le Validateur de Setlist

Des durées arrivent depuis différentes sources :

```js
"3:45"   // valide
"03:45"  // valide
"3:4"    // invalide
"145"    // invalide
"abc"    // invalide
```

Écris `isValidDuration(str)` qui retourne `true` uniquement pour les formats valides.

Contrainte : une seule ligne de code avec `.test()`. La fonction doit rejeter les chaînes qui ont du texte autour de la durée.

---

## EXO 3 : L'Extracteur de Stats

Tu reçois des résumés de match :

```
"Messi | Buts: 2 | Passes: 1 | Note: 9.5"
"Ronaldo | Buts: 1 | Passes: 0 | Note: 7"
```

Écris `parseStats(line)` qui retourne :

```js
{ name: "Messi", goals: 2, assists: 1, rating: 9.5 }
```

Si la ligne ne correspond pas au format attendu : retourne `null`. Pas de crash.

---

# RÉSUMÉ

Une regex décrit la forme de ce qu'on cherche. On ne lit pas caractère par caractère, on décrit le pattern.

Le cycle à retenir : `\d` décrit un type, `+` dit combien de fois, `^$` dit où, `[]` permet des classes sur mesure.

Les quatre méthodes : `.test()` pour vérifier, `.match()` pour extraire, `.replace()` pour transformer, `.split()` pour découper.

`.match()` retourne `null` si rien ne matche. Toujours vérifier avant d'accéder au résultat.

Les quantificateurs imbriqués peuvent geler ton programme. C'est un vrai risque en prod.

La leçon suivante : les groupes capturants, l'alternation, et les cas qui piègent même les devs expérimentés.
