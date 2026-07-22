---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ENCAPSULATION & PRIVACY : CE QU'ON PROTÈGE VRAIMENT
Temps de lecture ~10 min

"Privé" en JS n'a jamais voulu dire la même chose qu'en Java. Pendant des années, JS n'avait aucune vraie privacy (encapsulation : cacher l'état interne d'un objet pour qu'il ne soit modifié que par ses propres méthodes), et les devs simulaient ça avec des closures. Aujourd'hui, `#champPrivé` existe vraiment. Les deux méthodes coexistent, et elles ne protègent pas exactement la même chose.

Pense à l'armure de Garo : de l'extérieur, tu vois le Chevalier se battre. Tu ne vois jamais le mécanisme interne qui active les Makai Senki, ni comment l'armure calcule le compte à rebours des 99,9 secondes. C'est caché, et c'est voulu. Tu n'as pas besoin de savoir comment ça marche dedans pour utiliser l'armure de l'extérieur. Si tu pouvais trafiquer le compteur à la main, l'armure perdrait tout son sens.

---

## 1) LE FAUX PRIVÉ : LA CONVENTION `_champ`

```js
class GuerrierOldSchool {
 constructor(chakra) {
  this._chakra = chakra; // underscore : convention, pas une protection réelle
 }

 utiliserJutsu(cout) {
  this._chakra -= cout;
 }
}

const naruto = new GuerrierOldSchool(1000);
naruto._chakra = 999999; // totalement accessible, l'underscore ne bloque rien
```

Le `_` devant un nom de propriété est une convention visuelle entre devs : "ne touche pas à ça depuis l'extérieur". Le moteur JS ne la fait respecter en rien. N'importe qui avec une référence à l'objet peut lire et écrire `_chakra` directement.

**Pourquoi ça a survécu si longtemps malgré tout :** avant 2022, JS n'avait aucune syntaxe native pour la privacy dans une `class`. L'underscore était le seul signal disponible : faible, mais mieux que rien. Tu le croiseras encore massivement dans du code legacy.

---

## 2) LE VRAI PRIVÉ AVANT `#` : LES CLOSURES

```js
function creerGuerrier(chakraInitial) {
 let chakra = chakraInitial; // capturé par closure, inaccessible de l'extérieur

 return {
  utiliserJutsu(cout) {
   chakra -= cout;
  },
  getChakra() {
   return chakra;
  }
 };
}

const sasuke = creerGuerrier(800);
sasuke.utiliserJutsu(300);
sasuke.getChakra(); // 500
sasuke.chakra;    // undefined : chakra n'a jamais existé sur l'objet retourné
```

La variable `chakra` vit dans le scope de `creerGuerrier`, pas sur l'objet retourné. Aucune façon d'y accéder depuis l'extérieur, même avec `Object.keys` ou `for...in`. C'est une vraie privacy, mais elle a un coût : pas de `class`, pas d'héritage facile, chaque instance recrée ses propres fonctions (le piège mémoire du fichier 02, section 2).

---

## 3) LE VRAI PRIVÉ AVEC `#` : LES CHAMPS PRIVÉS DE CLASSE

```js
class Guerrier {
 #chakra; // déclaration du champ privé

 constructor(chakraInitial) {
  this.#chakra = chakraInitial;
 }

 utiliserJutsu(cout) {
  this.#chakra -= cout;
 }

 getChakra() {
  return this.#chakra;
 }
}

const kakashi = new Guerrier(700);
kakashi.utiliserJutsu(200);
kakashi.getChakra(); // 500
kakashi.#chakra;    // SyntaxError, même en lecture : inaccessible depuis l'extérieur
```

`#chakra` n'est pas une convention : c'est imposé par le moteur JS. Tenter d'y accéder depuis l'extérieur de la classe est une erreur de syntaxe, détectée avant même l'exécution. Contrairement à la closure, le champ privé fonctionne avec l'héritage et reste posé sur le prototype mécanisme de `class`, donc une seule définition de méthode partagée par toutes les instances.

**Détail qui surprend tout le monde une fois :** un champ `#` n'existe même pas en tant que clé sur l'objet pour `in` ou `Object.hasOwn`. Ce n'est pas juste "protégé", c'est invisible structurellement.

```js
console.log('chakra' in kakashi); // false, même pas une question de valeur
console.log(Object.keys(kakashi)); // [] : le champ privé n'apparaît jamais
```

---

## 4) LES MÉTHODES PRIVÉES : PAS QUE LES DONNÉES

`#` ne se limite pas aux champs. Tu peux aussi cacher des méthodes entières : la logique interne qu'aucune classe externe ne devrait jamais appeler directement.

```js
class ArmureGaro {
 #chakraRestant = 100;
 #activee = false;

 // méthode privée : la logique d'activation interne, jamais exposée
 #verifierConditions() {
  return this.#chakraRestant > 10 && !this.#activee;
 }

 activer() {
  if (!this.#verifierConditions()) {
   throw new Error("Conditions non réunies : l'armure refuse de s'activer");
  }
  this.#activee = true;
  return "Armure activée. Compte à rebours : 99.9 secondes.";
 }
}

const armure = new ArmureGaro();
console.log(armure.activer());    // OK
armure.#verifierConditions();     // SyntaxError : méthode invisible depuis l'extérieur
```

L'avantage réel : `#verifierConditions` peut changer complètement de logique interne (nouvelle règle, nouveau seuil) sans jamais casser le code qui utilise `ArmureGaro` depuis l'extérieur. Personne d'extérieur n'a de lien vers cette méthode : tu es libre de la réécrire entièrement.

---

## 5) GETTERS/SETTERS PRIVÉS ET STATIC PRIVÉ

`#` se combine avec `get`/`set` pour contrôler précisément comment une valeur interne est lue ou modifiée, et avec `static` pour du privé partagé par la classe entière (pas par instance).

```js
class CompteurDeCombat {
 static #totalCombats = 0; // privé ET partagé par toutes les instances
 #degatsInfliges = 0;

 enregistrerCoup(degats) {
  this.#degatsInfliges += degats;
  CompteurDeCombat.#totalCombats++;
 }

 get degats() {
  return this.#degatsInfliges; // lecture contrôlée, pas d'accès direct au champ
 }

 set degats(valeur) {
  if (valeur < 0) throw new RangeError("Les dégâts ne peuvent pas être négatifs");
  this.#degatsInfliges = valeur;
 }

 static get totalCombats() {
  return CompteurDeCombat.#totalCombats;
 }
}

const combat1 = new CompteurDeCombat();
combat1.enregistrerCoup(50);
combat1.degats = 80;     // passe par le setter, valide la valeur
console.log(combat1.degats); // 80
console.log(CompteurDeCombat.totalCombats); // 1, partagé, invisible de l'extérieur sauf via le getter statique
```

Le `set degats` montre la vraie valeur de l'encapsulation ici : tu peux exposer une écriture qui ressemble à une simple affectation (`combat1.degats = 80`), tout en validant silencieusement derrière. Sans `#`, n'importe qui pourrait écrire `combat1.degatsInfliges = -9999` directement.

---

## 6) CLOSURE VS `#` : DEUX OUTILS, DEUX USAGES

```
Closure     --> privacy par scope, fonctionne partout (objets, modules, factories)
         --> coût mémoire si utilisée massivement en factory de classe
         --> pas d'héritage naturel

Champ privé #  --> privacy intégrée à class, vérifiée par le moteur
         --> compatible avec l'héritage, économe en mémoire (sur prototype)
         --> uniquement disponible à l'intérieur d'une classe
```

Cas concret où tu choisis l'un plutôt que l'autre : si tu construis un système avec des sous-classes (`Guerrier` → `Hokage` → `SeptiemeHokage`), `#` gagne, parce que la closure ne transmet pas d'état privé à travers `extends` proprement. Si tu écris un module simple sans hiérarchie de classes, la closure reste légitime, plus légère, et plus ancienne donc plus largement comprise par toute équipe.

---

## 7) L'EXEMPLE QUI CASSE : CROIRE QUE `#` PROTÈGE DES BUGS LOGIQUES

```js
class CompteChakra {
 #chakra = 0;

 constructor(chakraInitial) {
  this.#chakra = chakraInitial;
 }

 consommer(montant) {
  this.#chakra -= montant; // aucune vérification : le chakra peut devenir négatif
  return this.#chakra;
 }
}

const naruto = new CompteChakra(50);
naruto.consommer(1000); // -950, et personne ne le voit venir depuis l'extérieur
```

`#chakra` est bien inaccessible depuis l'extérieur, donc personne ne peut le manipuler directement. Mais ça ne protège en rien contre une méthode interne mal écrite. L'encapsulation protège l'accès, pas la logique. Le vrai risque de prod ici n'est pas "quelqu'un a triché depuis l'extérieur" : c'est "la méthode interne elle-même ne valide rien".

**Second piège classique : `#` casse silencieusement avec certains outils.**

```js
class Sensei {
 #nom = "Kakashi";
}

const k = new Sensei();
console.log(JSON.stringify(k)); // {} : les champs privés sont invisibles à la sérialisation
console.log(structuredClone(k)); // copie un objet vide de fonctionnalités attendues si mal géré
```

Si ton API doit renvoyer `nom` en JSON, un champ `#nom` tout seul ne suffit jamais : il te faut une méthode publique ou un getter qui l'expose volontairement. La privacy totale et la sérialisation sont en tension permanente, et c'est voulu.

---

## TIPS D'ÉVOLUTION

Avant les champs privés (`#`, standardisés et largement supportés depuis 2022), la communauté JS utilisait massivement les closures pour simuler une vraie privacy, au prix d'un style "factory function" qui s'éloignait de `class`. `#` a réconcilié `class` avec une vraie encapsulation native, méthodes incluses. Les closures restent pertinentes hors contexte de classe : modules, état partagé entre quelques fonctions, factory functions légères (voir `01_fundamentals/05_web_basics/06_module_factory.md`). En 2026, le réflexe par défaut dans du code `class` neuf : `#` pour tout ce qui doit rester interne, point.

---

## EXERCICES

**EXO 1 : audit du faux privé**
Crée une `class Coffre` avec `_code` en convention underscore. Depuis l'extérieur, modifie `_code` directement et démontre que rien ne t'arrête. Réécris ensuite la même classe avec `#code`, et prouve que la même tentative lève une erreur.

**EXO 2 : l'armure qui se protège elle-même**
Implémente `class ArmureGaro` avec un champ privé `#integrite` (commence à 100), une méthode privée `#estCritique()` qui retourne `true` sous 20, et une méthode publique `subirDegats(montant)` qui refuse de descendre sous 0 et déclenche un message d'alerte différent si `#estCritique()` devient vrai après le coup.

**EXO 3 : closure contre classe**
Implémente un compteur de chakra à la fois en closure (fonction factory) et en `class` avec champ privé `#`. Compare en commentaire les deux approches sur : facilité d'héritage, accès en lecture seule, coût mémoire si on crée 1000 instances.

**EXO 4 : la fausse sécurité**
Écris une `class Inventaire` avec `#objets` (un tableau privé) et une méthode `ajouter(objet)` qui ne fait aucune validation. Montre comment un appel `ajouter(null)` ou `ajouter(undefined)` casse silencieusement l'inventaire malgré la privacy du champ. Corrige ensuite la méthode pour qu'elle valide réellement.

---

## RÉSUMÉ

L'underscore `_champ` est une convention sociale entre devs, jamais une protection réelle imposée par le moteur. Les closures offrent une vraie privacy mais sans héritage naturel et avec un coût mémoire en usage massif. Les champs et méthodes `#` offrent une vraie privacy intégrée à `class`, compatible avec l'héritage, combinable avec `get`/`set`/`static`, et invisible même pour `Object.keys` ou `JSON.stringify`. Aucun des deux ne protège contre une logique interne mal écrite : l'encapsulation protège l'accès, pas la correction du code qui se trouve derrière.
