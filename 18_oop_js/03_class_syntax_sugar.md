---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# CLASS SYNTAX SUGAR : LA PREUVE QUE CLASS NE RÉINVENTE RIEN
Temps de lecture ~10 min

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
NinjaOldSchool.prototype.presenter = function () {
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
 presenter() {
  return "salut";
 }
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

## 5) CLASS FIELDS : L'EXTENSION QUI CHANGE LE JEU (ES2022)

ES2022 a ajouté les class fields : la propriété déclarée directement dans la classe, sans passer par le `constructor`.

```js
// AVANT ES2022 : toutes les propriétés passaient par le constructor
class NinjaOld {
 constructor(nom) {
  this.nom = nom;
  this.chakra = 100; // propriété initialisée dans le constructor
  this.missions = []; // tableau partagé... ou pas ? (on y revient)
 }
}

// AVEC ES2022 : class fields, posées directement dans la classe
class Ninja {
 chakra = 100; // chaque instance a SA PROPRE valeur chakra = 100
 missions = []; // chaque instance a son PROPRE tableau (pas partagé)
 #secret = "clé secrète"; // # : champ privé, inaccessible de l'extérieur

 constructor(nom) {
  this.nom = nom; // le constructor ne gère plus que les params dynamiques
 }

 révéler() {
  return this.#secret; // accessible uniquement ici
 }
}

const n1 = new Ninja("Naruto");
const n2 = new Ninja("Sasuke");

n1.missions.push("Mission A");
console.log(n2.missions); // [] : tableau indépendant, pas le même objet

console.log(n1.#secret); // SyntaxError : champ privé inaccessible de l'extérieur
```

**Le piège classique résolu** : avant les class fields, si tu mettais `this.missions = []` dans le prototype (par accident ou par habitude), TOUTES les instances partageaient le MÊME tableau. Avec `missions = []` en class field, chaque instance obtient son propre tableau à la création. Plus de partage accidentel.

```
Avec prototype partagé (bug classique) :  Avec class field (correct) :

NinjaOld.prototype.missions = []      Ninja.prototype N'A PAS missions
    |                     |
n1.__proto__ --> missions (partagé)     n1  --> missions (propre)
n2.__proto__ --> missions (partagé)     n2  --> missions (propre)

n1.missions.push("A")            n1.missions.push("A")
n2.missions // ["A"] : oups         n2.missions // [] : correct
```

## 6) LA DIFFÉRENCE AVEC TYPESCRIPT

TypeScript ajoute des annotations au-dessus des class fields ES2022, mais le mécanisme runtime reste le même.

```js
// TypeScript
class Ninja {
 nom: string        // annotation de type : n'existe pas au runtime
 readonly village: string // readonly TS : erreur de compilation si réassigné
 #chakra = 100       // champ privé JS : vrai runtime, visible dans les erreurs JS

 constructor(nom: string, village: string) {
  this.nom = nom
  this.village = village
 }
}

// JavaScript compilé (ce qui s'exécute vraiment)
class Ninja {
 #chakra = 100       // le seul qui survit : c'est du JS réel
 constructor(nom, village) {
  this.nom = nom
  this.village = village
 }
}
```

`readonly` en TS n'existe que dans le compilateur. Il disparaît à la compilation. `#chakra` en JS existe vraiment au runtime : le moteur JS le connaît, il apparaît dans les stack traces, et il est vraiment inaccessible de l'extérieur.

La règle : TypeScript ajoute des garanties **à la compilation**. JavaScript `#private` ajoute des garanties **au runtime**. Les deux ne sont pas interchangeables. En `18_oop_js/07_encapsulation_privacy`, on explore ça en détail.

## TIPS D'ÉVOLUTION

Avant ES6, tout le monde écrivait des fonctions constructeurs à la main, avec toutes les variations de style possibles (certains posaient les méthodes dans le constructeur, d'autres sur le prototype, d'autres avec des helpers maison pour simuler l'héritage). `class` a uniformisé l'écriture pour toute l'industrie, en gardant le moteur identique.

ES2022 a ajouté les class fields (y compris `#private`). Avant ça, la "privacy" se simulait avec des closures, des WeakMap, ou une convention `_propriété` (pas du tout privée, juste une convention). Les vrais champs privés `#` sont maintenant standard, et c'est ce que tu verras dans tout code moderne.

## EXERCICES

**EXO 1 : l'architecte devant le junior**

Un junior de l'équipe affirme : "les classes c'est juste une autre façon d'écrire les fonctions constructeurs, c'est exactement pareil, j'utilise ce que je veux".

Tu dois lui prouver qu'il a tort sur trois points précis : le comportement sans `new`, l'énumérabilité des méthodes, et le mode strict.

Écris le code qui démontre chaque différence, et pour chaque cas note en commentaire : quel est le vrai risque en prod si on l'ignore ? (15 minutes)

---

**EXO 2 : diagnostiquer le bug silencieux**

Une feature a été livrée en prod. Les tests passent. Mais un shinobi signale que son historique de missions est partagé avec les autres shinobis de l'équipe.

```js
class Ninja {
 constructor(nom) {
  this.nom = nom;
 }
}
Ninja.prototype.missions = []; // posé à la main sur le prototype

const n1 = new Ninja("Naruto");
const n2 = new Ninja("Sasuke");
n1.missions.push("Mission C");
console.log(n2.missions); // ['Mission C']:bug en prod
```

Ta mission :

- Explique exactement pourquoi ce bug existe (chaîne prototype + référence partagée).
- Corrige le bug en utilisant les class fields ES2022.
- Prouve que la correction fonctionne en montrant que `n2.missions` est bien vide après le push sur `n1`.
- Explique pourquoi `class` ne protège pas automatiquement contre ça si tu oublies les class fields. (15 minutes)

---

**EXO 3 : choisir la bonne protection**

Le tech lead te demande de choisir entre deux approches pour protéger la propriété `niveau` d'un Chevalier Garo :

```js
// Option A : champ privé JS
class Chevalier {
 #niveau = 1
 getNiveau() { return this.#niveau }
}

// Option B : readonly TypeScript
class Chevalier {
 readonly niveau: number = 1
}
```

Ton tech lead veut une réponse claire avec justification. Écris un programme qui :

- Tente de modifier `niveau` depuis l'extérieur sur les deux versions.
- Note exactement à quel moment chaque protection intervient (runtime vs compilation).
- Conclut quel choix est plus sûr en production, et dans quel cas l'autre reste utile.

(20 minutes)

## RÉSUMÉ

`class` ne change pas le moteur : elle pose les mêmes briques que le fichier 02, avec une syntaxe imposée et plus stricte. Trois vrais changements de comportement : interdiction d'appel sans `new`, méthodes non énumérables, mode strict forcé. ES2022 a ajouté les class fields : chaque instance obtient sa propre valeur plutôt que de partager une référence sur le prototype, ce qui supprime un bug classique avec les tableaux et objets. Les champs `#privés` sont une vraie garantie runtime, contrairement au `readonly` TypeScript qui disparaît à la compilation. Comprendre `class` sans avoir compris le fichier 02 revient à utiliser un mécanisme qu'on ne maîtrise pas vraiment.
