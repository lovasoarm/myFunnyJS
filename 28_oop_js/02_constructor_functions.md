# CONSTRUCTOR FUNCTIONS : LA FAÇON OLD SCHOOL AVANT "CLASS"

Avant 2015, il n'y avait pas de `class` en JS. Pour fabriquer des objets en série avec un comportement partagé, les devs utilisaient des fonctions normales, appelées avec `new`. C'est moche à l'oeil aujourd'hui, mais c'est exactement ce que `class` fait tourner en interne. Si tu sautes ce fichier, le fichier 03 va te sembler magique. Et la magie en code, c'est toujours un mensonge qui cache un mécanisme.

## 1) `new` : QUATRE ÉTAPES, PAS UNE MAGIE

Quand tu écris `new MaFonction()`, le moteur fait quatre choses dans l'ordre :

```
1. crée un objet vide              {}
2. lie son [[Prototype]] à MaFonction.prototype
3. exécute MaFonction avec this = ce nouvel objet
4. retourne this (sauf si la fonction retourne déjà un objet explicitement)
```

```js
function Ninja(nom, village) {
  this.nom = nom;
  this.village = village;
}

Ninja.prototype.presenter = function() {
  return `${this.nom}, ninja du village ${this.village}`;
};

const naruto = new Ninja("Naruto", "Konoha");
naruto.presenter(); // "Naruto, ninja du village Konoha"
```

`Ninja.prototype` est l'objet qui sera le prototype (modèle hérité) de toute instance créée avec `new Ninja(...)`. C'est là qu'on pose les méthodes partagées, jamais dans le constructeur.

## 2) POURQUOI LES MÉTHODES VONT SUR `.prototype`, PAS DANS LE CONSTRUCTEUR

```js
// MAUVAIS : une nouvelle fonction recréée à chaque instance
function NinjaLourd(nom) {
  this.nom = nom;
  this.presenter = function() {
    return `${this.nom} se présente`;
  };
}

// BON : une seule fonction partagée par toutes les instances
function NinjaLeger(nom) {
  this.nom = nom;
}
NinjaLeger.prototype.presenter = function() {
  return `${this.nom} se présente`;
};
```

Avec `NinjaLourd`, chaque `new` recrée une fonction `presenter` en mémoire, propre à l'instance. Avec 10 000 ninjas, ça fait 10 000 fonctions identiques en RAM. Avec `NinjaLeger`, une seule fonction existe, partagée via le prototype. C'est la vraie raison d'être du prototype : économiser la mémoire sur le comportement partagé.

```
NinjaLourd : 10000 instances --> 10000 fonctions presenter en mémoire
NinjaLeger : 10000 instances --> 1 fonction presenter, partagée via prototype
```

## 3) L'OUBLI DE `new` : LE PIÈGE CLASSIQUE

```js
function Ninja(nom) {
  this.nom = nom;
}

const sasuke = Ninja("Sasuke"); // oubli de "new"

console.log(sasuke);     // undefined : la fonction ne retourne rien
console.log(globalThis.nom); // "Sasuke" en mode non strict : this valait globalThis !
```

Sans `new`, `this` à l'intérieur de la fonction ne vaut pas un nouvel objet. En mode non strict, il vaut l'objet global. Tu viens de poser une propriété `nom` sur l'objet global sans le vouloir. C'est l'un des bugs historiques les plus sournois de JS, et c'est une des raisons pour lesquelles `class` interdit purement et simplement l'appel sans `new` : `Ninja()` sans `new` sur une vraie `class` lève une erreur immédiate au lieu de polluer en silence.

## 4) `instanceof` : VÉRIFIER LA CHAÎNE, PAS LE TYPE

```js
naruto instanceof Ninja; // true
```

`instanceof` ne vérifie pas un "type" au sens classique. Il vérifie si `Ninja.prototype` se trouve quelque part dans la chaîne de prototypes de `naruto`. C'est un test sur la chaîne vue au fichier 01, pas un système de types séparé.

## EXEMPLE QUI CASSE : REMPLACER LE `.prototype` ENTIER

```js
function Ninja(nom) {
  this.nom = nom;
}
Ninja.prototype.presenter = function() {
  return `${this.nom} se présente`;
};

const naruto = new Ninja("Naruto");

Ninja.prototype = {
  presenter() {
    return "présentation générique";
  }
};

naruto.presenter(); // "Naruto se présente" : encore l'ancien prototype !

const sasuke = new Ninja("Sasuke");
sasuke.presenter(); // "présentation générique" : le nouveau prototype
```

`naruto` a été créé quand `Ninja.prototype` pointait vers l'ancien objet. Remplacer `Ninja.prototype` après coup ne change rien pour `naruto`, parce que le lien `[[Prototype]]` de `naruto` a été figé à la création, vers l'ancien objet, pas vers la propriété `Ninja.prototype` elle-même. Seules les instances créées après le remplacement utilisent le nouveau prototype. Résultat : deux instances de la "même" classe avec un comportement différent, et un bug qui dépend de l'ordre d'exécution.

## TIPS D'ÉVOLUTION

Avant ES6 (2015), les fonctions constructeurs étaient la seule façon de faire de l'OOP en JS. Aujourd'hui, on écrit `class` dans tout code neuf : plus lisible, erreurs plus explicites (`new` obligatoire), syntaxe alignée avec les autres langages. Mais comprendre les fonctions constructeurs reste indispensable : tu vas en croiser dans du code legacy, dans certaines libs anciennes, et `class` ne te protège pas de comprendre ce qui se passe si tu ne sais pas ce qu'il y a dessous.

## EXERCICES

EXO 1 : usine à chevaliers :
Écris une fonction constructeur `Chevalier(nom, flamme)` avec une méthode `invoquer()` sur le prototype qui renvoie une phrase utilisant les deux champs. Crée 3 chevaliers et vérifie qu'ils partagent la même fonction `invoquer` en mémoire (indice : compare les deux méthodes avec `===`).

EXO 2 : piège du sans-`new` :
Reproduis volontairement le bug de la section 3 dans un fichier de test, capture ce qui se passe sur `this`, et écris une garde au début de la fonction constructeur qui détecte l'appel sans `new` et lève une erreur explicite (indice : `this instanceof Chevalier`).

EXO 3 : prototype changé en cours de route :
Reproduis le cas de la section "exemple qui casse" avec un constructeur `Horror(nom)`. Crée une instance avant remplacement du prototype, une après, et écris une explication en commentaire de pourquoi elles n'ont pas le même comportement.

## RÉSUMÉ

`new` n'est pas une formule magique : c'est une séquence précise de quatre étapes, et l'oublier change radicalement la valeur de `this`. Les méthodes partagées vivent sur `.prototype`, jamais recréées dans le constructeur, pour économiser la mémoire. `instanceof` teste la présence d'un prototype dans une chaîne, pas un type au sens strict. Remplacer `.prototype` après coup ne touche jamais les instances déjà créées.
