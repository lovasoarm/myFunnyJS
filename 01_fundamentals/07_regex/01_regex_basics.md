---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# REGEX : L'ARME QUE PERSONNE N'ENSEIGNE CORRECTEMENT
Temps de lecture ~8 min

Tu reçois une chaîne de caractères. Elle vient d'un formulaire, d'une API, d'un fichier CSV. Tu dois valider, extraire, nettoyer.

Option 1 : une série de `if`, `startsWith`, `includes`, `split`. 20 lignes pour vérifier un email. Fragile. Illisible.

Option 2 : une regex. Une ligne. Soit elle matche, soit elle ne matche pas.

Les regex ont une réputation de truc hermétique. C'est faux. Il y a une grammaire. Une fois que tu lis la grammaire, tu lis les regex. Ce fichier te donne la grammaire.

---

## 1) CRÉER UNE REGEX

Deux syntaxes :

```js
// syntaxe littérale : entre slashes
const pattern = /naruto/

// constructeur : utile quand le pattern est dynamique
const mot = "sasuke"
const pattern2 = new RegExp(mot)  // équivalent à /sasuke/
```

Tester si ça matche :

```js
const texte = "Naruto est le meilleur ninja de Konoha"

/naruto/.test(texte)  // false : sensible à la casse
/Naruto/.test(texte)  // true
```

`.test()` retourne `true` ou `false`. C'est ta validation de base.

---

## 2) LES FLAGS : modifier le comportement

Les flags se placent après le deuxième slash.

```js
/naruto/i  // i : case-insensitive
/naruto/g  // g : global : trouve toutes les occurrences, pas juste la première
/naruto/m  // m : multiline : ^ et $ matchent début/fin de chaque ligne
/naruto/s  // s : dotAll : le point . matche aussi les \n
/naruto/gi  // combinaison : global + case-insensitive
```

```js
const texte = "Naruto, naruto, NARUTO"

texte.match(/naruto/)  // ["naruto"] : une seule occurrence
texte.match(/naruto/gi) // ["Naruto", "naruto", "NARUTO"] : toutes, sans casse
```

Le flag `g` est critique : sans lui, `.match()` s'arrête à la première occurrence.

---

## 3) LES CLASSES DE CARACTÈRES : les briques de base

```js
// caractères spéciaux
\d  // un chiffre : [0-9]
\D  // pas un chiffre
\w  // un mot : [a-zA-Z0-9_]
\W  // pas un mot
\s  // un espace blanc (espace, tab, \n)
\S  // pas un espace blanc

// le point
.   // n'importe quel caractère sauf \n
\.  // un point littéral (le \ échappe le sens spécial)

// classes personnalisées
[abc]  // a OU b OU c
[a-z]  // n'importe quelle minuscule
[A-Z]  // n'importe quelle majuscule
[0-9]  // n'importe quel chiffre : équivalent à \d
[^abc]  // tout SAUF a, b, c : le ^ dans une classe signifie "pas"
```

```js
/\d/.test("3")    // true
/\d/.test("abc")   // false
/[aeiou]/.test("naruto") // true -> il y a des voyelles
/[^aeiou]/.test("aaa")  // false -> que des voyelles, pas de consonnes
```

---

## 4) LES QUANTIFICATEURS : combien de fois ?

```js
?  // 0 ou 1 fois (optionnel)
*  // 0 ou plusieurs fois
+  // 1 ou plusieurs fois (au moins une)
{n} // exactement n fois
{n,} // n fois ou plus
{n,m}// entre n et m fois
```

```js
/colou?r/.test("color")  // true -> le u est optionnel
/colou?r/.test("colour") // true

/\d+/.test("42")  // true -> au moins un chiffre
/\d+/.test("")   // false

/\d{4}/.test("2024")  // true -> exactement 4 chiffres
/\d{4}/.test("24")   // false
/\d{2,4}/.test("242") // true -> entre 2 et 4 chiffres
```

---

## 5) ANCRES : où dans la chaîne ?

```js
^  // début de la chaîne (ou début de ligne avec flag m)
$  // fin de la chaîne (ou fin de ligne avec flag m)
\b  // word boundary -> frontière entre \w et \W
```

```js
/^Naruto/.test("Naruto est fort")  // true -> commence par Naruto
/^Naruto/.test("Fort comme Naruto") // false -> ne commence pas par Naruto

/ninja$/.test("il est ninja")  // true -> finit par ninja
/ninja$/.test("ninja débutant") // false

// sans ancres
/\d+/.test("abc123def")  // true -> trouve les chiffres n'importe où
// avec ancres
/^\d+$/.test("abc123def") // false -> la chaîne entière ne doit être que des chiffres
/^\d+$/.test("123456")  // true
```

Le combo `^...$` est essentiel pour la validation : il force la regex à s'appliquer à toute la chaîne, pas juste à une partie.

---

## 6) LE PIÈGE : `.match()` peut retourner `null`

C'est le bug le plus courant avec les regex.

```js
const texte = "pas de chiffres ici"

const resultat = texte.match(/\d+/)
// resultat vaut null : pas de match

// si tu fais ça sans vérifier :
console.log(resultat[0])  // TypeError: Cannot read properties of null
```

Toujours vérifier avant d'utiliser le résultat :

```js
const resultat = texte.match(/\d+/)
if (resultat) {
 console.log(resultat[0])
} else {
 console.log("aucun chiffre trouvé")
}

// ou avec le optional chaining
console.log(texte.match(/\d+/)?.[0] ?? "rien trouvé")
```

Si tu oublies ce check une fois en prod, t'as un crash silencieux sur un cas limite. Mémorise-le maintenant.

---

## 7) ALTERNANCE ET GROUPES : choisir et regrouper

```js
|  // OU logique
()  // groupe : isole une partie du pattern
(?:) // groupe non-capturant : groupe sans stocker dans les résultats
```

```js
/Naruto|Sasuke|Sakura/.test("Sasuke est fort")  // true

// groupes pour regrouper des quantificateurs
/(?:na)+/.test("nanana")  // true : "na" répété
```

---

## EXERCICES

## EXO 1 : le validateur de codes ninja
Un code ninja est valide si :
- commence par 2 lettres majuscules (le village)
- suivi d'un tiret
- suivi de exactement 4 chiffres

Exemples valides : `KO-1234`, `SU-9999`
Exemples invalides : `ko-1234`, `KON-123`, `KO-12345`

Écris la regex et une fonction `validerCode(code)` qui retourne `true` ou `false`.

---

## EXO 2 : le scanner de discours du Roi Géant
Un texte issu d'une déclaration officielle. Tu dois vérifier s'il contient :
- au moins un mot en majuscules de 3+ caractères (genre "TITANS", "LIBERTÉ")
- au moins un nombre à 4 chiffres (une année ou un décompte)

Écris deux regex distinctes et une fonction `analyserDiscours(texte)` qui retourne un objet `{ crieDesMotsCles: boolean, mentionneUnNombre: boolean }`.

(Ne retourne jamais `null` sans gérer le cas : utilise `?.` ou une vérification explicite)

---

## EXO 3 : le nettoyeur de setlist
Tu reçois une chaîne qui représente une setlist de concert (trapsoul). Format inconsistant :
```
"1. Money - Drake \n2.Nights-Frank Ocean\n 3. CRANES IN THE SKY - Solange"
```

Écris une regex qui trouve tous les titres de chansons (le texte entre le tiret et la fin de la ligne, nettoyé des espaces). Résultat attendu : `["Drake", "Frank Ocean", "Solange"]` (les artistes dans ce cas).

(Indice : `\s*` pour les espaces optionnels, `.trim()` après match)

---

## RÉSUMÉ

Une regex est une description de pattern, pas de la magie noire.

Les classes (`\d`, `\w`, `[a-z]`) définissent quels caractères accepter. Les quantificateurs (`+`, `*`, `{n}`) définissent combien de fois. Les ancres (`^`, `$`) définissent où dans la chaîne. Les flags (`i`, `g`) modifient le comportement global.

`.test()` retourne un booléen. `.match()` retourne un tableau ou `null` : toujours vérifier avant d'utiliser.
