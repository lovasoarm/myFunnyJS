---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# REGEX COMBAT : VALIDER DES DONNÉES RÉELLES
Temps de lecture ~9 min

La validation de formulaires, c'est un terrain de guerre. Les shinobis tapent n'importe quoi. Des espaces au début. Des points en trop. Des extensions bizarres. Des numéros avec des tirets, des espaces, des parenthèses.

Ton regex doit tenir. Dans ce fichier, on construit des validateurs réels : pas des exercices académiques. Des patterns que tu vas réutiliser en prod.

---

## 1) GROUPES DE CAPTURE : extraire ce qui compte

Avant d'attaquer la validation, il faut comprendre les groupes de capture : c'est eux qui te donnent accès aux parties matchées.

```js
const texte = "Naruto a 17 ans et Sasuke a 17 ans aussi"

// sans groupes : juste vérifier si ça matche
/\d+/.test(texte)  // true

// avec groupes : capturer la valeur
const match = texte.match(/(\w+) a (\d+) ans/)
// match[0] : "Naruto a 17 ans" : le match complet
// match[1] : "Naruto"      : groupe 1
// match[2] : "17"        : groupe 2
```

Avec le flag `g`, `.match()` retourne toutes les occurrences mais sans les groupes. Pour extraire les groupes sur plusieurs matches, on utilise `.matchAll()` :

```js
const resultats = [...texte.matchAll(/(\w+) a (\d+) ans/g)];
resultats.forEach((m) => {
 console.log(`${m[1]} : ${m[2]} ans`);
});
// Naruto : 17 ans
// Sasuke : 17 ans
```

---

## 2) GROUPES NOMMÉS : lisibilité maximale

Au lieu de `match[1]`, `match[2]`... tu nommes tes groupes.

```js
const date = "2024-04-15";
const match = date.match(/(?<annee>\d{4})-(?<mois>\d{2})-(?<jour>\d{2})/);

console.log(match.groups.annee); // "2024"
console.log(match.groups.mois); // "04"
console.log(match.groups.jour); // "15"
```

`(?<nom>...)` : groupe nommé. Ça se lit mieux, ça casse moins quand tu réorganises le pattern.

---

## 3) VALIDER UN EMAIL

L'email complet selon RFC 5321 est une horreur de 6 000 caractères. Ce qu'on valide en pratique : une forme raisonnable qui couvre 99% des cas réels.

```js
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validerEmail = (email) => {
 if (typeof email !== "string") return false;
 return emailRegex.test(email.trim());
};
```

Décortiqué :

```
^           : commence ici, nulle part ailleurs
[a-zA-Z0-9._%+-]+  : partie locale : lettres, chiffres, et ces symboles, au moins 1 fois
@           : le @ obligatoire
[a-zA-Z0-9.-]+    : domaine : lettres, chiffres, points, tirets
\.          : un point littéral (échappé)
[a-zA-Z]{2,}     : extension : au moins 2 lettres (com, fr, io, dev...)
$           : finit ici
```

```js
validerEmail("naruto@konoha.village"); // true
validerEmail("kakashi.sensei@anbu.jp"); // true
validerEmail("@konoha.com"); // false : partie locale manquante
validerEmail("naruto@"); // false : domaine manquant
validerEmail("naruto@ko noha.com"); // false : espace dans le domaine
```

Limite connue : cette regex accepte `naruto@ko..noha.com` (double point dans le domaine). Pour une validation stricte, il faut plus. Pour un formulaire standard : ça suffit.

---

## 4) VALIDER UNE URL

Les URLs ont plusieurs formes légitimes. On cible le cas courant : HTTP/HTTPS avec domaine et chemin optionnel.

```js
const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

const validerUrl = (url) => {
 if (typeof url !== "string") return false;
 return urlRegex.test(url.trim());
};
```

Décortiqué :

```
^     : début
https?   : "http" ou "https" (le s est optionnel)
:\/\/   : "://" (les slashes sont échappés)
[^\s/$.?#] : premier caractère du domaine : pas un espace ni ces symboles
.     : n'importe quel caractère (au moins un dans le domaine)
[^\s]*   : le reste de l'URL : n'importe quoi sauf un espace
$     : fin
```

```js
validerUrl("https://crazydevs.io"); // true
validerUrl("http://api.konoha.dev/jutsu/list"); // true
validerUrl("ftp://fichier.com"); // false : pas http/https
validerUrl("crazydevs.io"); // false : pas de protocole
validerUrl("https://"); // false : domaine vide
```

---

## 5) VALIDER UN NUMÉRO DE TÉLÉPHONE

Le format varie par pays. Pour un numéro français (10 chiffres, peut commencer par 0) avec des séparateurs variés :

```js
// accepte : 06 12 34 56 78 / 0612345678 / 06-12-34-56-78 / +33612345678
const telRegex = /^(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}$/;

const validerTel = (tel) => {
 if (typeof tel !== "string") return false;
 return telRegex.test(tel.trim());
};
```

Décortiqué :

```
^         : début
(?:\+33|0)    : groupe non-capturant : "+33" ou "0"
[1-9]       : premier chiffre après l'indicatif : 1 à 9 (pas 0)
(?:[\s.-]?\d{2}) : groupe non-capturant répété 4 fois :
 [\s.-]?     : séparateur optionnel : espace, point, ou tiret
 \d{2}      : exactement 2 chiffres
{4}        : ce groupe se répète 4 fois = 8 chiffres restants
$         : fin
```

```js
validerTel("06 12 34 56 78"); // true
validerTel("0612345678"); // true
validerTel("06-12-34-56-78"); // true
validerTel("+33612345678"); // true
validerTel("123"); // false
validerTel("06 123 45 678"); // false : mauvais groupement
```

---

## 6) LE PIÈGE DES REGEX TROP PERMISSIVES

Une regex qui accepte trop c'est pire que pas de validation.

```js
// mauvais -> accepte presque tout
const emailBof = /\w+@\w+\.\w+/;
emailBof.test("a@b.c"); // true : trop court pour être réel
emailBof.test("test@test.test"); // true mais "test" n'est pas une extension valide

// autre piège : oublier les ancres ^ et $
const emailSansFrontiere = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// accepte : "INJECTION pas-un-email naruto@konoha.com du-texte-après"
// parce que la regex cherche juste si le pattern apparaît quelque part
emailSansFrontiere.test("INJECTION naruto@konoha.com xss"); // true
```

La règle : si tu valides un champ complet, `^` et `$` sont obligatoires.

---

## 7) LOOKAHEAD / LOOKBEHIND : matcher sans consommer

Parfois tu veux vérifier ce qui précède ou suit sans l'inclure dans le match.

```js
// lookahead positif (?=...) : suivi de
// "un mot suivi d'un espace et d'un chiffre"
"Naruto 17 Sasuke 17".match(/\w+(?=\s\d)/g);
// ["Naruto", "Sasuke"] : les mots, sans les chiffres

// lookbehind positif (?<=...) : précédé de
"prix: 42€ bonus: 15€".match(/(?<=:\s)\d+/g);
// ["42", "15"] : les nombres, sans les labels
```

Utile pour extraire une valeur entourée de contexte sans inclure ce contexte dans le résultat.

---

## EXERCICES

## EXO 1 : le validateur de profil ninja

Un formulaire d'inscription pour l'académie de Konoha. Valide les trois champs :

- `username` : 3 à 20 caractères, lettres, chiffres et underscores uniquement
- `email` : format valide
- `telephone` : format FR valide

Écris `validerProfil({ username, email, telephone })` qui retourne :

```js
{
 valide: boolean,
 erreurs: { username?: string, email?: string, telephone?: string }
}
```

Pas de librairie externe. Que des regex.

---

## EXO 2 : l'extracteur de données de match

Tu reçois des chaînes de résultats de matchs :

```
"PSG 3-1 OM | 45+2' : But de Mbappé (pen.) | 67' : But de Hakimi"
```

Extrait avec des groupes nommés :

- les équipes et scores
- les minutes (avec temps additionnel optionnel)
- les buteurs

Résultat attendu : un objet structuré. Utilise `.matchAll()` pour les événements multiples.

---

## EXO 3 : le validateur de config YAML-like

Des configurations arrivent dans ce format texte :

```
host: api.konoha.dev
port: 8080
timeout: 30000
debug: true
```

Valide chaque ligne :

- clé : que des lettres et underscores
- valeur : nombre, booléen, ou URL valide

Retourne les lignes invalides avec leur numéro et la raison.

(Indice : `split("\n")` puis regex sur chaque ligne)

---

## RÉSUMÉ

Les groupes de capture transforment une regex de validateur en extracteur. Les groupes nommés rendent le code lisible six mois après. Les ancres `^` et `$` font la différence entre valider et juste détecter.

Lookahead et lookbehind permettent de conditionner un match sur le contexte sans l'inclure dans le résultat.

La regex parfaite n'existe pas : elle couvre un spectre de cas réels. Connaître ses limites est aussi important que de la connaître.
