---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# STATIC, GETTERS, SETTERS : LOGIQUE CACHÉE DERRIÈRE UNE SYNTAXE D'ATTRIBUT
Temps de lecture ~8 min

`static` pose une propriété ou méthode sur la classe elle-même, pas sur ses instances. `get`/`set` font ressembler un appel de méthode à un simple accès de propriété. Les trois sont des outils discrets, mais mal compris, ils cachent de la vraie logique derrière une syntaxe qui a l'air d'un simple champ.

## 1) `static` : APPARTIENT À LA CLASSE, PAS À L'INSTANCE

```js
class Ninja {
 static villageOrigine = "Konoha"; // sur la classe, pas sur chaque instance

 static creerGenin(nom) {
  return new Ninja(nom, Ninja.villageOrigine);
 }

 constructor(nom, village) {
  this.nom = nom;
  this.village = village;
 }
}

Ninja.villageOrigine;    // "Konoha", accessible sans instance
const naruto = Ninja.creerGenin("Naruto");
naruto.villageOrigine;    // undefined : static n'existe pas sur l'instance
```

```
Ninja (la classe)
 |-- static villageOrigine
 |-- static creerGenin()
 |
 v
naruto (une instance)
 |-- nom
 |-- village
 (pas de villageOrigine ici, ce n'est pas hérité par les instances)
```

`static` sert pour tout ce qui concerne la classe en tant que concept, pas une instance précise : compteurs globaux, factory methods (méthode qui fabrique des instances selon une logique précise), constantes liées au type.

## 2) `get` : UNE MÉTHODE QUI SE LIT COMME UNE PROPRIÉTÉ

```js
class Ninja2 {
 constructor(chakraActuel, chakraMax) {
  this._chakraActuel = chakraActuel;
  this._chakraMax = chakraMax;
 }

 get pourcentageChakra() {
  return Math.round((this._chakraActuel / this._chakraMax) * 100);
 }
}

const n = new Ninja2(40, 100);
n.pourcentageChakra; // 40, pas n.pourcentageChakra() : pas de parenthèses !
```

Sans `get`, il faudrait écrire `n.pourcentageChakra()`, une méthode classique. Avec `get`, l'appel ressemble à une simple lecture de propriété, mais une vraie fonction tourne derrière à chaque accès. Le risque caché : un dev qui lit `n.pourcentageChakra` dans une boucle pense lire un champ statique, alors qu'un calcul (potentiellement coûteux) s'exécute à chaque fois.

## 3) `set` : UNE MÉTHODE QUI SE LIT COMME UNE AFFECTATION

```js
class Ninja3 {
 constructor(chakraMax) {
  this._chakraActuel = 0;
  this._chakraMax = chakraMax;
 }

 set chakraActuel(valeur) {
  if (valeur < 0) {
   this._chakraActuel = 0;
  } else if (valeur > this._chakraMax) {
   this._chakraActuel = this._chakraMax;
  } else {
   this._chakraActuel = valeur;
  }
 }

 get chakraActuel() {
  return this._chakraActuel;
 }
}

const n2 = new Ninja3(100);
n2.chakraActuel = 150; // appelle le set, pas une affectation brute
n2.chakraActuel;    // 100, plafonné par la logique du set
```

`n2.chakraActuel = 150` a l'air d'une simple affectation. En réalité, ça déclenche la méthode `set`, qui applique une règle de validation avant de toucher au vrai champ interne `_chakraActuel`. C'est l'usage le plus sain de `set` : transformer une affectation en porte de contrôle, sans changer la syntaxe utilisée par celui qui appelle.

## 4) L'EXEMPLE QUI CASSE : OUBLIER QUE GET/SET COÛTENT UN VRAI CALCUL

```js
class Armee {
 constructor(soldats) {
  this.soldats = soldats; // tableau de milliers de soldats
 }

 get puissanceTotale() {
  console.log("recalcul de la puissance totale"); // pour voir l'effet
  return this.soldats.reduce((total, s) => total + s.puissance, 0);
 }
}

const armee = new Armee(unTableauDeMilleSoldats);

if (armee.puissanceTotale > 1000 && armee.puissanceTotale < 5000) {
 // "recalcul de la puissance totale" logué DEUX fois : deux accès, deux recalculs complets
}
```

Le code a l'air de lire une simple propriété deux fois. En réalité, deux recalculs complets sur potentiellement des milliers d'éléments se déclenchent, parce que `get` n'est pas un cache : c'est une fonction qui s'exécute à chaque accès. Le vrai risque de prod : du code qui semble inoffensif ("c'est juste une lecture de propriété") mais qui multiplie silencieusement des calculs coûteux à chaque relecture.

## 5) `static get`/`static set` : LA COMBINAISON DES DEUX RÈGLES

```js
class Configuration {
 static #instance;

 static get instance() {
  if (!Configuration.#instance) {
   Configuration.#instance = new Configuration();
  }
  return Configuration.#instance;
 }
}

Configuration.instance; // crée l'instance unique au premier appel, la réutilise après
```

`static get` combine les deux règles : une propriété qui se lit sans parenthèses, mais directement sur la classe, pas sur une instance. C'est le mécanisme exact derrière le pattern Singleton (vu dans le module design patterns), où `#instance` est un champ privé static qui garde l'unique instance créée.

## TIPS D'ÉVOLUTION

`static` existe depuis ES6. Les `get`/`set` aussi. Ce qui a changé avec le temps, c'est l'usage : au début, beaucoup de devs les utilisaient pour "faire propre", sans vraie logique de validation derrière. Aujourd'hui, la convention senior, c'est de ne poser un `get`/`set` que s'il y a une vraie raison (calcul dérivé, validation, contrôle d'accès). Si un `get` se contente de retourner le champ sans rien faire de plus, une propriété publique classique suffit, et évite de faire croire qu'il y a une logique cachée là où il n'y en a pas.

## EXERCICES

EXO 1 : factory statique :
Crée une `class Survivant` avec une méthode `static creerArme(nom)` qui retourne directement une instance préconfigurée de `Survivant` armée. Compare avec un appel classique `new Survivant(...)` et explique en commentaire l'intérêt de passer par une factory method statique ici.

EXO 2 : le garde-fou caché :
Crée une `class Reservoir` avec un champ privé `#niveau` et un `set niveau(valeur)` qui empêche de dépasser une capacité maximale ou de descendre sous zéro. Prouve avec 3 tests manuels (valeur négative, valeur excessive, valeur normale) que la règle s'applique systématiquement.

EXO 3 : chasse au recalcul caché :
Reproduis le cas de la section 4 avec un `get` qui logge à chaque appel. Compte combien de fois il se déclenche dans un petit script qui le lit 3 fois dans des conditions différentes. Propose en commentaire une solution pour éviter les recalculs inutiles (indice : stocker le résultat dans une variable locale avant les comparaisons).

## RÉSUMÉ

`static` pose une propriété ou méthode sur la classe elle-même, jamais héritée automatiquement par les instances, utile pour les factory methods et les constantes liées au type. `get`/`set` transforment un appel de méthode en syntaxe de propriété, ce qui permet de valider une affectation ou de calculer une valeur dérivée sans changer la façon dont on lit ou écrit depuis l'extérieur. Le vrai danger : un `get` n'est jamais un cache, il recalcule à chaque accès, et l'oublier peut multiplier des calculs coûteux en silence.
