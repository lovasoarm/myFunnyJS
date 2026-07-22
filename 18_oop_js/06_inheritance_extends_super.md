---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# INHERITANCE EXTENDS/SUPER : ET POURQUOI LES HIÉRARCHIES PROFONDES PIÈGENT
Temps de lecture ~8 min

`extends` chaîne deux prototypes ensemble, exactement comme `Object.create` au fichier 01, mais pour des classes entières. `super` te donne accès au parent. Les deux ensemble sont utiles. Empilés sur 4 ou 5 niveaux, ils deviennent un piège que même l'auteur du code finit par ne plus comprendre.

## 1) `extends` : CHAÎNER DEUX PROTOTYPES

```js
class Ninja {
 constructor(nom) {
  this.nom = nom;
  this.chakra = 100;
 }

 attaquer() {
  return `${this.nom} attaque à mains nues`;
 }
}

class NinjaSensei extends Ninja {
 constructor(nom, technique) {
  super(nom); // appelle le constructor de Ninja avec this
  this.technique = technique;
 }

 enseigner() {
  return `${this.nom} enseigne ${this.technique}`;
 }
}

const kakashi = new NinjaSensei("Kakashi", "Chidori");
kakashi.attaquer(); // héritée de Ninja
kakashi.enseigner(); // propre à NinjaSensei
```

```
kakashi --> NinjaSensei.prototype --> Ninja.prototype --> Object.prototype --> null
```

`extends` pose `Ninja.prototype` comme `[[Prototype]]` de `NinjaSensei.prototype`. C'est la même chaîne que le fichier 01, juste posée automatiquement par la syntaxe `class`.

## 2) `super()` : OBLIGATOIRE AVANT D'UTILISER `this`

```js
class NinjaCasse extends Ninja {
 constructor(nom, technique) {
  this.technique = technique; // ReferenceError : doit appeler super() avant
  super(nom);
 }
}
```

Dans une classe qui `extends`, `this` n'existe pas encore au début du `constructor`. C'est `super()` qui le crée réellement, en déléguant la construction au parent. Oublier `super()`, ou l'appeler après avoir touché `this`, lève une erreur immédiate. C'est une garde imposée par le langage, pas une convention de style.

## 3) `super.methode()` : APPELER LA VERSION DU PARENT DEPUIS L'ENFANT

```js
class NinjaSensei extends Ninja {
 attaquer() {
  const base = super.attaquer(); // version du parent
  return `${base}, puis enchaîne avec ${this.technique}`;
 }
}

const kakashi2 = new NinjaSensei("Kakashi", "Chidori");
kakashi2.attaquer(); // "Kakashi attaque à mains nues, puis enchaîne avec Chidori"
```

L'enfant redéfinit `attaquer`, mais peut quand même utiliser la version du parent comme brique de base, au lieu de la réécrire entièrement. C'est l'usage le plus sain de `super` : étendre sans dupliquer.

## 4) LE VRAI PIÈGE : LA HIÉRARCHIE PROFONDE

```js
class Entite {}
class Combattant extends Entite {}
class Ninja2 extends Combattant {}
class NinjaElite extends Ninja2 {}
class Hokage extends NinjaElite {}

const naruto2 = new Hokage();
```

Cinq niveaux. Maintenant, une question simple : où est définie la méthode `attaquer()` que `naruto2` utilise réellement ? Pour le savoir, il faut remonter `Hokage` --> `NinjaElite` --> `Ninja2` --> `Combattant` --> `Entite`, vérifier à chaque niveau si la méthode est redéfinie ou pas.

```
naruto2.attaquer()
  |
  v
Hokage a "attaquer" ?   cherche...
  |
  v
NinjaElite a "attaquer" ? cherche...
  |
  v
Ninja2 a "attaquer" ?   cherche...
  |
  v
Combattant a "attaquer" ? cherche...
  |
  v
Entite a "attaquer" ?   trouvé, ou pas trouvé, 5 niveaux plus tard
```

Plus la chaîne est longue, plus un changement dans `Entite` (le sommet) a un effet en cascade imprévisible sur tous les niveaux du dessous. Un dev qui modifie `Combattant` ne sait pas toujours qui hérite de quoi 3 niveaux plus bas. C'est exactement le risque réel que vos propres mini-projets pointent ailleurs dans le curriculum (refactoring, SOLID) : le couplage fort entre classes empilées.

## 5) L'EXEMPLE QUI CASSE : LE CHANGEMENT EN CASCADE

```js
class Entite {
 constructor() {
  this.vivant = true;
 }
}

class Combattant extends Entite {
 constructor() {
  super();
  this.pv = 100;
 }
}

// six mois plus tard, quelqu'un "corrige" Entite :
class Entite {
 constructor(nom) {
  this.nom = nom; // ajout d'un paramètre obligatoire dans l'esprit du dev
  this.vivant = true;
 }
}

// Combattant n'a jamais été mis à jour :
const test = new Combattant();
console.log(test.nom); // undefined, et personne n'a pensé à vérifier ici
```

Modifier la classe au sommet de la hiérarchie a un effet sur toutes les classes filles, sans qu'elles soient forcément revues. Plus la hiérarchie est profonde, plus ce risque grandit, et c'est précisément l'argument qui mène au fichier 09 : composition vs héritage.

## TIPS D'ÉVOLUTION

Avant `class`, l'héritage se simulait à la main avec `Object.create(Parent.prototype)` posé sur `Enfant.prototype`, et un appel manuel du constructeur parent via `Parent.call(this, ...)`. C'était fonctionnel mais verbeux et source d'erreurs d'ordre. `extends`/`super` ont rendu la syntaxe fiable. Le vrai changement de terrain n'est pas la syntaxe : c'est la prise de conscience progressive, dans l'industrie, qu'empiler l'héritage profond est souvent une mauvaise idée d'architecture, peu importe à quel point la syntaxe le rend facile à écrire.

## EXERCICES

EXO 1 : la chaîne du clan :
Crée `Ninja` avec `nom` et `attaquer()`, puis `NinjaSensei extends Ninja` qui ajoute `enseigner()`. Vérifie avec `instanceof` qu'une instance de `NinjaSensei` est aussi une instance de `Ninja`. Explique pourquoi en commentaire, en te servant de la chaîne vue au fichier 01.

EXO 2 : étendre sans dupliquer :
Sur l'exemple de la section 3, ajoute un troisième niveau `NinjaSenseiLegendaire extends NinjaSensei` qui utilise `super.attaquer()` pour construire sa propre version, sans recopier le texte de la méthode parente.

EXO 3 : le coût caché de la profondeur :
L'équipe a une hiérarchie à 4 niveaux : `Survivant` --> `Combattant` --> `ChefDeGroupe` --> `Leader`. Rick veut modifier la logique de `attaquer()` dans `Combattant` pour gérer un nouveau type de menace.

Ta mission : ne pas construire la hiérarchie pour la construire:construis-la pour identifier le problème.

Implémente les 4 niveaux. Chaque niveau ajoute ou surcharge quelque chose. Puis réponds en commentaire : si tu changes `Combattant.attaquer()`, quels niveaux peuvent silencieusement casser ? Combien de classes dois-tu ouvrir pour savoir ? Propose une alternative concrète (composition, hook method, ou autre) qui évite cette fragilité en cascade.

## RÉSUMÉ

`extends` chaîne deux prototypes de classe exactement comme `Object.create` chaîne deux objets. `super()` doit être appelé avant tout accès à `this` dans un constructeur enfant, et `super.methode()` permet d'étendre une méthode parente sans la dupliquer. Le vrai risque n'est pas la syntaxe, qui est fiable : c'est la profondeur. Plus une hiérarchie s'empile, plus un changement au sommet devient dangereux et difficile à tracer pour tous les niveaux du dessous.
