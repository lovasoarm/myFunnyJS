---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LA CHAÎNE PROTOTYPE DANS SES ZONES SOMBRES
Temps de lecture ~11 min

> **Prérequis :** ce fichier suppose que tu sais ce qu'est un prototype et comment fonctionne l'héritage en JS. Si ce n'est pas encore le cas, le cours complet est dans `18_oop_js/01_prototype_chain_raw.md`. Tu peux quand même lire ce qui suit avec le rappel express ci-dessous, mais le module 18 reste la référence pour les bases.

Ce fichier couvre ce qui arrive quand ce mécanisme est exploité, mal utilisé, ou carrément détourné.
`__proto__`, `hasOwnProperty`, et prototype pollution : trois sujets que 90% des devs ne comprennent pas assez pour les éviter en prod.

---

## 1) RAPPEL EXPRESS : COMMENT FONCTIONNE LA CHAÎNE

Quand tu accèdes à une propriété sur un objet, JS cherche dans cet ordre :

```
objet lui-même
 --> son prototype (__proto__)
  --> le prototype du prototype
   --> ... jusqu'à Object.prototype
    --> null (fin de chaîne)
```

```js
const ninja = { nom: "Naruto", chakra: 1000 };

// ninja n'a pas de méthode toString()
// mais JS remonte la chaîne et trouve Object.prototype.toString
ninja.toString(); // "[object Object]"

// Visualiser la chaîne
console.log(Object.getPrototypeOf(ninja) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null : fin de chaîne
```

---

## 2) `__proto__` : L'ACCÈS DIRECT QUI NE DEVRAIT PAS EXISTER

`__proto__` est une propriété qui expose directement le lien vers le prototype d'un objet. Elle est là depuis les débuts de JS, elle a été standardisée tardivement, et elle pose des problèmes sérieux.

```js
const ninja = { nom: "Naruto" };
const sensei = { village: "Konoha" };

// Modifier le prototype à la volée : faisable, mais catastrophique pour les perfs
ninja.__proto__ = sensei;

console.log(ninja.village); // "Konoha" : hérité de sensei
```

**Pourquoi ne pas utiliser `__proto__` :**

```
1. Modification de prototype à runtime = dés-optimisation du moteur JS
  Le moteur a compilé la structure de l'objet. Tu la changes ? Il recompile.

2. La propriété __proto__ est une propriété accessor sur Object.prototype
  Elle peut être shadowed (masquée) ou supprimée : comportement imprévisible

3. Les objets créés avec Object.create(null) n'ont pas __proto__
  Donc ton code qui compte dessus explose sur ces objets
```

```js
// Alternative correcte : Object.getPrototypeOf et Object.setPrototypeOf
const proto = Object.getPrototypeOf(ninja); // accès en lecture, propre
// Object.setPrototypeOf(ninja, sensei)   // modification, mais à éviter quand même

// Encore mieux : définir le prototype à la création
const ninja = Object.create(sensei);
ninja.nom = "Naruto";
// ninja hérite de sensei, mais le prototype n'est jamais modifié après coup
```

---

## 3) `hasOwnProperty` : PROPRIÉTÉ PROPRE VS HÉRITÉE

`hasOwnProperty` vérifie si une propriété appartient à l'objet lui-même ou si elle vient de la chaîne prototype.

```js
const sensei = { village: "Konoha" };
const ninja = Object.create(sensei);
ninja.nom = "Naruto";

// Qu'est-ce qui appartient à ninja ?
console.log(ninja.hasOwnProperty("nom")); // true : propriété directe
console.log(ninja.hasOwnProperty("village")); // false : héritée de sensei

// Le for...in parcourt aussi les propriétés héritées
for (const key in ninja) {
 console.log(key); // "nom", "village" : les deux
}

// Pour itérer seulement sur les propriétés directes :
for (const key in ninja) {
 if (ninja.hasOwnProperty(key)) {
  console.log(key); // "nom" seulement
 }
}

// Ou simplement :
Object.keys(ninja); // ["nom"] : propriétés propres enumérables
Object.values(ninja); // ["Naruto"]
Object.entries(ninja); // [["nom", "Naruto"]]
```

**Le piège de `hasOwnProperty` :**

```js
// Si un objet a sa propre propriété "hasOwnProperty", ça casse
const malicious = { hasOwnProperty: () => true };
malicious.hasOwnProperty("anything"); // toujours true : la méthode est shadowed

// Fix : appel via Object.prototype directement
Object.prototype.hasOwnProperty.call(malicious, "anything"); // false : correct

// Ou en ES2022 :
Object.hasOwn(malicious, "anything"); // false : plus propre, plus sûr
```

---

## 4) PROTOTYPE POLLUTION : L'ATTAQUE QUI MODIFIE TOUT

C'est une vraie vulnérabilité de sécurité. Elle apparaît dans les CVEs (Common Vulnerabilities and Exposures : liste publique des failles connues) de bibliothèques JS populaires.

**Le principe :**
Si tu permets à du code externe de modifier `Object.prototype`, toutes les instances de `Object` dans l'application héritent des propriétés injectées.

```js
// Cas simple : une fonction de merge naïve
function merge(cible, source) {
 for (const key in source) {
  cible[key] = source[key]; // aucune vérification sur la clé
 }
 return cible;
}

// Payload d'attaque reçu depuis une API ou un formulaire
const payload = JSON.parse('{"__proto__": {"admin": true}}');

// On merge ce payload dans un objet quelconque
const profilNinja = merge({}, payload);

// Résultat catastrophique
const autreObjet = {};
console.log(autreObjet.admin); // true : Object.prototype est pollué
console.log({}.admin); // true : tous les objets sont affectés
```

Le diagramme :

```
payload.__proto__ = Object.prototype
merge() écrit sur payload.__proto__
       |
       v
Object.prototype.admin = true
       |
       v
TOUS les {} dans l'app ont maintenant admin = true
```

> C'est T-Bag qui injecte son code dans le système de Fox River. Une seule faille dans `merge()`, et il a les droits admin de tout le système.

**Comment ça arrive en prod :**

```js
// Librairie de merge, de clonage profond, ou de parsing de query string
// Si elle itère sur les clés sans vérification :
function deepMerge(cible, source) {
 for (const key in source) {
  if (typeof source[key] === "object") {
   deepMerge(cible[key], source[key]); // récursion sans vérifier si key = "__proto__"
  } else {
   cible[key] = source[key];
  }
 }
}
```

**Les fixes :**

```js
// Fix 1 : vérifier la clé avant d'écrire
function mergeSafe(cible, source) {
 for (const key in source) {
  // Bloquer les clés dangereuses
  if (key === "__proto__" || key === "constructor" || key === "prototype") {
   continue; // on ignore ces clés:jamais de bypass ici
  }
  if (Object.prototype.hasOwnProperty.call(source, key)) {
   cible[key] = source[key];
  }
 }
 return cible;
}

// Fix 2 : utiliser Object.create(null) pour les objets qui stockent des données externes
// Ces objets n'ont PAS de prototype : donc pas de chaîne à polluer
const store = Object.create(null);
store.__proto__ = "attaque"; // c'est juste une propriété normale, pas le prototype
console.log(Object.getPrototypeOf(store)); // null : aucun prototype à polluer

// Fix 3 : Object.freeze sur Object.prototype (radical, mais efficace pour certains cas)
Object.freeze(Object.prototype);
// Toute tentative de modification de Object.prototype échoue silencieusement
// (ou lève une erreur en strict mode)
```

---

## 5) CONSTRUCTOR HIJACKING : DÉTOURNER LE CONSTRUCTEUR

La propriété `constructor` sur un objet pointe vers la fonction qui l'a créé. Elle peut être modifiée.

```js
function Ninja(nom) {
 this.nom = nom;
}

const naruto = new Ninja("Naruto");
console.log(naruto.constructor === Ninja); // true
console.log(naruto.constructor === Object); // false

// Recréer un objet du même type sans connaître sa classe
const kage = new naruto.constructor("Minato"); // new Ninja("Minato")
console.log(kage.nom); // "Minato"
```

Le problème : quand tu redéfinis `prototype`, tu perds `constructor`.

```js
function Ninja(nom) {
 this.nom = nom;
}

// Mauvaise pratique : remplacement total du prototype
Ninja.prototype = {
 attaquer() {
  return `${this.nom} attaque`;
 },
};
// constructor est maintenant Object, pas Ninja
console.log(new Ninja("Naruto").constructor === Ninja); // false
console.log(new Ninja("Naruto").constructor === Object); // true

// Fix : restaurer constructor manuellement
Ninja.prototype = {
 constructor: Ninja, // on restaure le lien
 attaquer() {
  return `${this.nom} attaque`;
 },
};
```

---

## 6) SHADOW DE PROPRIÉTÉ : QUAND L'OBJET MASQUE SON PROTOTYPE

Une propriété directe sur un objet masque la propriété de même nom sur son prototype.

```js
function Ninja() {}
Ninja.prototype.chakra = 100;

const naruto = new Ninja();
console.log(naruto.chakra); // 100 : hérité

naruto.chakra = 9000; // shadow : propriété directe créée sur naruto
console.log(naruto.chakra); // 9000 : propriété directe masque le prototype

delete naruto.chakra; // on supprime la propriété directe
console.log(naruto.chakra); // 100 : le prototype est de nouveau visible
```

Le shadow avec `Object.defineProperty` peut rendre une propriété non-énumérable, non-configurable, ou non-modifiable : et ça interagit avec la chaîne prototype de façon non intuitive :

```js
const proto = {};
Object.defineProperty(proto, "niveau", {
 value: 1,
 writable: false, // lecture seule sur le prototype
});

const objet = Object.create(proto);

// Tentative d'écriture sur l'objet : ça rate silencieusement (ou lève en strict mode)
objet.niveau = 99;
console.log(objet.niveau); // 1 : la propriété n'a pas été shadowée
// Parce que writable: false sur le prototype bloque aussi le shadow
```

---

## CAS QUI CASSENT

```js
// 1. JSON.parse et __proto__
const data = JSON.parse('{"__proto__": {"polluted": true}}');
// Depuis ES2015, JSON.parse ne pollue PAS le prototype
// __proto__ ici est traité comme une clé normale
// Mais si tu passes data dans une fonction de merge naïve : pollution

// 2. Objet sans prototype ne répond pas à hasOwnProperty
const bare = Object.create(null);
bare.nom = "Walter";
bare.hasOwnProperty("nom"); // TypeError : pas de prototype, pas de méthode
// Fix :
Object.prototype.hasOwnProperty.call(bare, "nom"); // true
Object.hasOwn(bare, "nom"); // true

// 3. for...in sur un prototype pollué
Object.prototype.debug = true; // pollution simulée

const stats = { buts: 10 };
for (const key in stats) {
 console.log(key); // "buts", "debug" : debug vient de Object.prototype
}
// Fix : toujours filtrer avec hasOwn ou Object.keys dans les for...in critiques

// 4. instanceof et prototype modifié à la volée
function Chevalier() {}
const garo = new Chevalier();

Chevalier.prototype = {}; // prototype modifié après coup

console.log(garo instanceof Chevalier); // false : le lien est cassé
// instanceof vérifie si Chevalier.prototype est dans la chaîne de garo
// Mais on l'a remplacé, donc ce n'est plus le cas
```

---

## EXERCICES

**EXO 1 : la cartographie de la chaîne**
Crée trois objets liés par prototype (`village` → `ninja` → `clone`) avec `Object.create`. Pour chaque objet, liste manuellement toutes ses propriétés : celles qui lui appartiennent en direct et celles qu'il hérite. Utilise `Object.hasOwn`, `Object.keys`, et `for...in` pour produire trois résultats différents sur le même objet et explique pourquoi ils diffèrent.

**EXO 2 : détecter la pollution**
Tu reçois des payloads JSON d'une API tierce. Certains contiennent `__proto__`, `constructor`, ou `prototype` comme clés. Écris une fonction `sanitizeInput(obj)` qui parcourt récursivement un objet et supprime toutes les clés dangereuses avant tout traitement. Teste-la contre un payload d'attaque réel et vérifie que `Object.prototype` reste intact après traitement.

**EXO 3 : le merge défensif de Walter White**
Walter doit merger des configurations de laboratoire reçues depuis des sources non fiables. La v1 de son `deepMerge` est vulnérable à la pollution. Réécris-la de façon à ce qu'elle rejette toute tentative de modifier `__proto__`, `constructor`, ou `prototype`, log une alerte quand une tentative est détectée, et fonctionne correctement sur des objets imbriqués légitimes.

**EXO 4 : l'héritage du clan Ackerman**
Modélise une hiérarchie prototype : `Titan` → `TitanColossal` → `BertHoover`. Chaque niveau ajoute des propriétés. Implémente une fonction `getOwnStats(objet)` qui retourne uniquement les propriétés directes d'un objet (pas les héritées). Implémente aussi `getFullStats(objet)` qui retourne toutes les propriétés avec l'indication de leur niveau dans la chaîne. Sans utiliser de classes ES6 : prototype pur.

---

## RÉSUMÉ

La chaîne prototype est le mécanisme central de l'héritage en JS. Dans ses zones sombres : `__proto__` modifie les prototypes à runtime et détruit les optimisations moteur, `hasOwnProperty` peut être shadowed et doit être appelé via `Object.prototype` ou `Object.hasOwn` pour être fiable, et la pollution de prototype est une vraie vulnérabilité qui passe par les fonctions de merge naïves. Les fix sont simples : `Object.create(null)` pour les stores de données, `Object.hasOwn` à la place de `hasOwnProperty`, et validation des clés dans tout code qui merge des objets venant de l'extérieur.
