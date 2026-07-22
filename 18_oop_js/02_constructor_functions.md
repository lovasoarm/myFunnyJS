---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# CONSTRUCTOR FUNCTIONS : LA FAÇON OLD SCHOOL AVANT "CLASS"
Temps de lecture ~9 min

Avant 2015, il n'y avait pas de `class` en JS. Pour fabriquer des objets en série avec un comportement partagé, les devs utilisaient des fonctions normales, appelées avec `new`. C'est moche à l'oeil aujourd'hui, mais c'est exactement ce que `class` fait tourner en interne. Si tu sautes ce fichier, le fichier 03 va te sembler magique. Et la magie en code, c'est toujours un mensonge qui cache un mécanisme.

---

## 1) `new` : QUATRE ÉTAPES, PAS UNE MAGIE

Quand tu écris `new MaFonction()`, le moteur fait quatre choses dans l'ordre :

```
1. crée un objet vide       {}
2. lie son [[Prototype]] à MaFonction.prototype
3. exécute MaFonction avec this = ce nouvel objet
4. retourne this (sauf si la fonction retourne déjà un objet explicitement)
```

```js
function Ninja(nom, village) {
 // à ce point, "this" est l'objet vide créé à l'étape 1
 this.nom = nom
 this.village = village
 // pas de return : le moteur retourne this automatiquement (étape 4)
}

// méthode partagée : posée sur Ninja.prototype, pas dans le constructeur
Ninja.prototype.presenter = function() {
 return `${this.nom}, ninja du village ${this.village}`
}

const naruto = new Ninja("Naruto", "Konoha")
naruto.presenter() // "Naruto, ninja du village Konoha"
```

`Ninja.prototype` est l'objet qui sera le prototype (modèle hérité) de toute instance créée avec `new Ninja(...)`. C'est là qu'on pose les méthodes partagées, jamais dans le constructeur.

---

## 2) POURQUOI LES MÉTHODES VONT SUR `.prototype`, PAS DANS LE CONSTRUCTEUR

```js
// MAUVAIS : une nouvelle fonction recréée à chaque instance
function NinjaLourd(nom) {
 this.nom = nom
 this.presenter = function() {   // recréée à CHAQUE new NinjaLourd()
  return `${this.nom} se présente`
 }
}

// BON : une seule fonction partagée par toutes les instances
function NinjaLeger(nom) {
 this.nom = nom
 // pas de méthode ici
}
NinjaLeger.prototype.presenter = function() {
 return `${this.nom} se présente`
}
```

Avec `NinjaLourd`, chaque `new` recrée une fonction `presenter` en mémoire, propre à l'instance. Avec 10 000 ninjas, ça fait 10 000 fonctions identiques en RAM. Avec `NinjaLeger`, une seule fonction existe, partagée via le prototype.

```
NinjaLourd : 10000 instances --> 10000 fonctions presenter en mémoire
NinjaLeger : 10000 instances --> 1 fonction presenter, partagée via prototype
```

C'est la vraie raison d'être du prototype : économiser la mémoire sur le comportement partagé. Sur un front-end avec des composants instanciés en masse, ça compte.

---

## 3) L'OUBLI DE `new` : LE PIÈGE CLASSIQUE

```js
function Ninja(nom) {
 this.nom = nom
}

const sasuke = Ninja("Sasuke") // oubli de "new"

console.log(sasuke)    // undefined : la fonction ne retourne rien
console.log(globalThis.nom) // "Sasuke" en mode non strict : this valait globalThis !
```

Sans `new`, `this` à l'intérieur de la fonction ne vaut pas un nouvel objet. En mode non strict, il vaut l'objet global (`window` dans le navigateur, `globalThis` en Node). Tu viens de poser une propriété `nom` sur l'objet global sans le vouloir.

C'est l'un des bugs historiques les plus sournois de JS : silencieux, global, et qui se manifeste à distance. C'est une des raisons pourquoi `class` interdit purement et simplement l'appel sans `new` : `Ninja()` sans `new` sur une vraie `class` lève une `TypeError` immédiate au lieu de polluer en silence.

Protection possible dans une fonction constructeur :

```js
function Ninja(nom) {
 // garde : si appelé sans new, this n'est pas une instance de Ninja
 if (!(this instanceof Ninja)) {
  throw new Error("Ninja doit être appelé avec new")
 }
 this.nom = nom
}

Ninja("Sasuke")   // Error: Ninja doit être appelé avec new
new Ninja("Sasuke") // OK
```

---

## 4) `instanceof` : VÉRIFIER LA CHAÎNE, PAS LE TYPE

```js
const naruto = new Ninja("Naruto")

naruto instanceof Ninja     // true
naruto instanceof Object     // true aussi : Object.prototype est dans la chaîne
"naruto" instanceof Ninja    // false : une string n'a pas Ninja.prototype dans sa chaîne
```

`instanceof` ne vérifie pas un "type" au sens classique. Il vérifie si `Ninja.prototype` se trouve quelque part dans la chaîne de prototypes de `naruto`. C'est un test sur la chaîne vue au fichier 01, pas un système de types séparé.

Conséquence : `instanceof` peut mentir si `Ninja.prototype` a été remplacé après la création de l'instance (voir section suivante).

---

## 5) L'HÉRITAGE AVEC LES FONCTIONS CONSTRUCTEURS

Avant `class extends`, l'héritage se faisait manuellement. Comprendre ça explique ce que `extends` fait en interne.

```js
function Ninja(nom, village) {
 this.nom = nom
 this.village = village
}
Ninja.prototype.presenter = function() {
 return `${this.nom} de ${this.village}`
}

// Jonin hérite de Ninja
function Jonin(nom, village, specialite) {
 // 1. appeler le constructeur parent avec le bon "this"
 Ninja.call(this, nom, village)
 // .call : exécute Ninja avec "this" = l'instance de Jonin en cours de création
 this.specialite = specialite
}

// 2. lier la chaîne de prototypes
Jonin.prototype = Object.create(Ninja.prototype)
// IMPORTANT : ne pas faire Jonin.prototype = Ninja.prototype (partage de référence)

// 3. corriger le constructeur qui a été écrasé
Jonin.prototype.constructor = Jonin

// 4. ajouter des méthodes propres à Jonin
Jonin.prototype.mission = function() {
 return `${this.nom} : mission de ${this.specialite}`
}

const kakashi = new Jonin("Kakashi", "Konoha", "copie de jutsus")
kakashi.presenter() // "Kakashi de Konoha" : hérité de Ninja
kakashi.mission()  // "Kakashi : mission de copie de jutsus" : propre à Jonin
kakashi instanceof Ninja // true : Ninja.prototype est dans la chaîne
kakashi instanceof Jonin // true
```

C'est exactement ce que `class Jonin extends Ninja` génère en interne, en plus lisible et avec `super` pour remplacer `Ninja.call(this, ...)`.

---

## 6) L'EXEMPLE QUI CASSE : REMPLACER LE `.prototype` ENTIER

```js
function Ninja(nom) {
 this.nom = nom
}
Ninja.prototype.presenter = function() {
 return `${this.nom} se présente`
}

const naruto = new Ninja("Naruto")

// ERREUR : remplacement complet du prototype après création d'une instance
Ninja.prototype = {
 presenter() {
  return "présentation générique"
 }
}

naruto.presenter() // "Naruto se présente" : encore l'ancien prototype !

const sasuke = new Ninja("Sasuke")
sasuke.presenter() // "présentation générique" : le nouveau prototype
```

`naruto` a été créé quand `Ninja.prototype` pointait vers l'ancien objet. Remplacer `Ninja.prototype` après coup ne change rien pour `naruto`, parce que le lien `[[Prototype]]` de `naruto` a été figé à la création, vers l'ancien objet, pas vers la propriété `Ninja.prototype` elle-même.

```
avant remplacement :
naruto.[[Prototype]] --> ancienObjet (presenter : "Naruto se présente")
Ninja.prototype ------> ancienObjet (même référence)

après remplacement :
naruto.[[Prototype]] --> ancienObjet (inchangé pour naruto)
Ninja.prototype ------> nouveauObjet (presenter : "présentation générique")

sasuke.[[Prototype]] --> nouveauObjet (créé APRÈS le remplacement)
```

Résultat : deux instances de la "même" classe avec un comportement différent. Bug dépendant de l'ordre d'exécution : difficile à détecter, douloureux à debugger.

---

## EXERCICES

### EXO 1 : usine à chevaliers de Garo

Écris une fonction constructeur `Chevalier(nom, flamme)` avec une méthode `invoquer()` sur le prototype qui renvoie `"${nom} invoque l'armure : ${flamme}"`. Crée 3 chevaliers et vérifie qu'ils partagent la même fonction `invoquer` en mémoire (indice : compare deux méthodes avec `===` : elles doivent être identiques, pas juste équivalentes).

---

### EXO 2 : piège du sans-`new`

Reproduis volontairement le bug de la section 3 dans un fichier de test :
- appelle `Chevalier("Leon", "flamme d'or")` sans `new`
- capture ce qui se passe sur `this` en mode non strict (regarde `globalThis`)
- écris une garde au début de la fonction constructeur qui détecte l'appel sans `new` et lève une erreur explicite
- vérifie que la garde ne casse pas les appels normaux avec `new`

(Indice : `this instanceof Chevalier` est faux si appelé sans `new`)

---

### EXO 3 : l'héritage à la main

En utilisant uniquement les fonctions constructeurs (pas de `class`, pas de `extends`) :
- crée un constructeur `Horror(nom, zone)` avec une méthode `apparaitre()` sur le prototype
- crée un constructeur `HorrorElite(nom, zone, niveau)` qui hérite de `Horror` via `Ninja.call` + `Object.create`
- ajoute une méthode `niveau()` propre à `HorrorElite`
- vérifie que `horrorElite instanceof Horror` est `true` et que `horrorElite instanceof HorrorElite` est `true`

---

## RÉSUMÉ

`new` n'est pas une formule magique : c'est une séquence précise de quatre étapes, et l'oublier change radicalement la valeur de `this`.
Les méthodes partagées vivent sur `.prototype`, jamais recréées dans le constructeur, pour économiser la mémoire.
L'héritage se fait avec `Enfant.prototype = Object.create(Parent.prototype)` + `Parent.call(this, ...)` : c'est exactement ce que `extends` génère.
`instanceof` teste la présence d'un prototype dans une chaîne, pas un type au sens strict.
Remplacer `.prototype` entièrement après coup ne touche jamais les instances déjà créées.
