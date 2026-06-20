# CLASS SYNTAX SUGAR : LA PREUVE QUE CLASS NE RÉINVENTE RIEN

`class` n'est pas un nouveau système. C'est du sucre syntaxique (syntax sugar : une écriture plus agréable qui ne change pas le mécanisme réel) posé sur les fonctions constructeurs et le prototype du fichier 02. Si tu as compris le fichier précédent, ce fichier ne t'apprend aucun nouveau mécanisme : il te montre que c'est le même, écrit différemment.

## 1) LA TRADUCTION DIRECTE

```js
// version "class"
class Ninja {
  constructor(nom, village) {
    this.nom = nom;
    this.village = village;
  }

  presenter() {
    return `${this.nom}, ninja du village ${this.village}`;
  }
}

// version constructeur classique : strictement équivalente en mécanisme
function NinjaOldSchool(nom, village) {
  this.nom = nom;
  this.village = village;
}
NinjaOldSchool.prototype.presenter = function() {
  return `${this.nom}, ninja du village ${this.village}`;
};
```

```js
typeof Ninja; // "function" : une class EST une fonction, sous le capot
Ninja.prototype.presenter; // existe, posée automatiquement par "class"
```

`constructor` devient le corps de la fonction. Chaque méthode déclarée dans `class` est posée automatiquement sur `.prototype`, exactement comme tu le faisais à la main au fichier 02.

## 2) CE QUE `class` AJOUTE VRAIMENT (PAS DU SUCRE, DU COMPORTEMENT EN PLUS)

`class` n'est pas qu'une question d'écriture : trois comportements changent réellement.

```js
Ninja(); // TypeError : Class constructor Ninja cannot be invoked without 'new'
```

Contrairement à une fonction constructeur classique (fichier 02, section 3), une `class` interdit l'appel sans `new`. Le piège du `this` qui devient l'objet global est neutralisé par design.

```js
class Test {
  presenter() { return "salut"; }
}
console.log(Object.keys(Test.prototype)); // []
```

Les méthodes de `class` sont non énumérables (elles n'apparaissent pas dans une boucle `for...in` ou `Object.keys`). Avec l'ancienne syntaxe `Ninja.prototype.presenter = function(){}`, la méthode est énumérable par défaut, ce qui peut polluer une boucle qui parcourt les propriétés d'un objet.

```js
class Zone {
  presenter() {}
}
Zone(); // erreur, vu plus haut

function ZoneOld() {}
ZoneOld(); // fonctionne (mal), aucune erreur
```

Le code à l'intérieur d'une `class` tourne toujours en mode strict (strict mode : version stricte de JS qui interdit certains comportements dangereux), même sans le déclarer explicitement.

## 3) L'ORDRE D'EXÉCUTION CACHÉ DERRIÈRE `class`

```
new Ninja("Naruto", "Konoha")
   |
   v
1. objet vide créé, [[Prototype]] = Ninja.prototype
2. constructor() exécuté avec this = cet objet
3. this retourné automatiquement
```

C'est exactement la séquence du fichier 02. `class` ne retire aucune étape, elle les encapsule pour que tu ne puisses pas les faire dans le désordre ou les oublier.

## 4) L'EXEMPLE QUI CASSE : CROIRE QUE `class` PROTÈGE DE TOUT

```js
class Compte {
  constructor(solde) {
    this.solde = solde;
  }
}

const compte = new Compte(100);
Compte.prototype.solde = -99999; // toujours possible, class ne bloque pas ça

console.log(Object.getPrototypeOf(compte) === Compte.prototype); // true, chaîne identique au fichier 01
```

`class` te protège de l'oubli de `new` et te donne une syntaxe plus propre. Elle ne te protège pas de la mutation du prototype, ni d'aucun des comportements vus aux fichiers 01 et 02. La chaîne de prototypes reste exactement la même chaîne. Le risque réel : penser que `class` = sécurité totale, et négliger la compréhension du mécanisme réel qu'on a vu juste avant.

## TIPS D'ÉVOLUTION

Avant ES6, tout le monde écrivait des fonctions constructeurs à la main, avec toutes les variations de style possibles (certains posaient les méthodes dans le constructeur, d'autres sur le prototype, d'autres avec des helpers maison pour simuler l'héritage). `class` a uniformisé l'écriture pour toute l'industrie, en gardant le moteur identique. Le changement n'est pas un changement de moteur : c'est un changement de discipline imposée par la syntaxe.

## EXERCICES

EXO 1 : preuve par la console :
Écris une `class Garde` avec un `constructor` et une méthode. Affiche `typeof Garde`, `Garde.prototype`, et `Object.getOwnPropertyNames(Garde.prototype)`. Commente chaque résultat pour expliquer ce que `class` a réellement posé en mémoire.

EXO 2 : le crash volontaire :
Écris une `class Sentinelle` puis essaie de l'appeler sans `new`. Capture l'erreur avec un `try/catch`, affiche son message, et explique en commentaire en quoi ce comportement diffère d'une fonction constructeur classique.

EXO 3 : traduire à l'envers :
Prends une `class` de ton choix avec 2 méthodes et un `constructor`, et réécris-la entièrement en syntaxe fonction constructeur + `.prototype`, sans utiliser `class` une seule fois. Le comportement observable doit être identique (sauf l'erreur sans `new`).

## RÉSUMÉ

`class` ne change pas le moteur : elle pose les mêmes briques que le fichier 02, avec une syntaxe imposée et plus stricte. Trois vrais changements de comportement existent : interdiction d'appel sans `new`, méthodes non énumérables, mode strict forcé. Le reste, la chaîne de prototypes, la mutation possible, les pièges de partage, reste identique. Comprendre `class` sans avoir compris le fichier 02 revient à utiliser un mécanisme qu'on ne maîtrise pas vraiment.
