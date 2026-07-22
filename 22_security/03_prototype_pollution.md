---
stability: intemporel
---

# PROTOTYPE POLLUTION
Temps de lecture ~9 min

Il y a des vulnérabilités qui font mal. Et puis il y a prototype pollution : celle qui te sourit pendant que tu codes, et qui te poignarde en prod sans laisser de trace évidente.

Un attaquant envoie un JSON avec une clé `__proto__`. Ton code le parse, le merge dans un objet. Et maintenant tous les objets de ton application ont une propriété qu'ils ne devraient pas avoir. Tous. Sans exception.

---

## 1) LA CHAÎNE PROTOTYPE : LE CONTEXTE

### Le quoi

En JS, chaque objet a un prototype (objet parent dont il hérite les propriétés). Tous les objets littéraux héritent de `Object.prototype`. Ce mécanisme s'appelle la chaîne prototype (prototype chain).

```js
const ninja = { name: 'Naruto', chakra: 9000 };

// ninja n'a pas de méthode toString, mais ça marche quand même
ninja.toString(); // "[object Object]"
// --> JS remonte la chaîne : ninja --> Object.prototype --> trouve toString là

// La chaîne ressemble à ça
ninja.__proto__ === Object.prototype; // true
// --> ninja hérite de toutes les propriétés de Object.prototype
```

### Le risque

Si tu modifies `Object.prototype`, TOUS les objets créés après (et avant) dans ton app en héritent immédiatement.

```js
Object.prototype.isAdmin = true; // hypothèse catastrophique

const user = { name: 'T-Bag' };
user.isAdmin; // true --> T-Bag est admin, il n'a rien fait
// C'est ça, la pollution de prototype
```

---

## 2) L'ATTAQUE : COMMENT UN JSON POLLUE TON APP

### Le vecteur classique : merge récursif

```js
// Fonction de merge (fusion) récursive : pattern très courant dans les codebases
function deepMerge(target, source) {
 for (const key of Object.keys(source)) {
  if (typeof source[key] === 'object' && source[key] !== null) {
   // si la propriété est un objet, on descend récursivement
   if (!target[key]) target[key] = {};
   deepMerge(target[key], source[key]); // récursion sur les objets imbriqués
  } else {
   target[key] = source[key]; // assigne la valeur
  }
 }
 return target;
}

// L'attaquant envoie ce JSON dans le body d'une requête POST
const maliciousInput = JSON.parse('{"__proto__": {"isAdmin": true}}');
// --> maliciousInput.__proto__ est Object.prototype
// --> deepMerge va assigner isAdmin = true sur Object.prototype

const config = {};
deepMerge(config, maliciousInput); // POLLUTION : Object.prototype.isAdmin = true

// Maintenant, partout dans l'app
const user = { name: 'visiteur lambda' };
user.isAdmin; // true --> l'attaquant est admin
```

### Ce que ça peut faire en prod

```js
// Exemple réaliste : vérification de rôle
app.post('/admin/action', (req, res) => {
 const user = getUserFromSession(req.session.id);

 // user.isAdmin est undefined normalement
 // mais après pollution, user.isAdmin hérite de Object.prototype.isAdmin = true
 if (user.isAdmin) {
  performAdminAction(); // exécuté pour tout le monde après la pollution
 }
});

// Exemple avec Express : bypasser la vérification d'authentification
function isAuthenticated(user) {
 return user.authenticated; // true si pollué, même pour un utilisateur non connecté
}
```

```
Impact possible selon le contexte :
- bypass de vérification de rôle
- injection de propriétés dans des objets de configuration
- crash de l'application (DoS : Denial of Service)
- exécution de code arbitraire dans certains cas avancés (template engines, eval)
```

---

## 3) LES FIXES

### Fix 1 : valider les clés avant de les utiliser

```js
function deepMerge(target, source) {
 for (const key of Object.keys(source)) {
  // bloquer les clés dangereuses avant de les traiter
  if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
   continue; // ignorer silencieusement ces clés
  }
  if (typeof source[key] === 'object' && source[key] !== null) {
   if (!target[key]) target[key] = {};
   deepMerge(target[key], source[key]);
  } else {
   target[key] = source[key];
  }
 }
 return target;
}
```

### Fix 2 : Object.create(null) pour les objets de config

```js
// Object.create(null) crée un objet sans prototype
// --> il n'a pas de __proto__, pas de toString, pas d'isAdmin hérité
const safeConfig = Object.create(null);
safeConfig.timeout = 5000;

safeConfig.__proto__; // undefined --> impossible de remonter la chaîne
// --> même si une pollution arrive ailleurs, cet objet n'en hérite pas
```

### Fix 3 : Object.freeze sur Object.prototype

```js
// Geler Object.prototype : plus aucune modification possible
Object.freeze(Object.prototype);

// Maintenant, même la fonction deepMerge vulnérable ne peut plus polluer
const maliciousInput = JSON.parse('{"__proto__": {"isAdmin": true}}');
const config = {};
deepMerge(config, maliciousInput); // tente de modifier Object.prototype
// --> silencieux en mode non-strict, TypeError en strict mode
// --> dans les deux cas, Object.prototype.isAdmin reste undefined
```

### Fix 4 : structuredClone et JSON parse/stringify pour les merges simples

```js
// Pour cloner un objet profondément sans risque de pollution
const safeClone = (obj) => structuredClone(obj);
// structuredClone (disponible depuis Node 17) sérialise et désérialise proprement
// --> __proto__ n'est pas une propriété propre de l'objet, il n'est pas cloné

// Alternativement, pour nettoyer un input externe avant merge
const sanitize = (input) => JSON.parse(JSON.stringify(input));
// --> JSON.stringify ignore __proto__ (non-enumerable en tant que propriété propre)
// --> JSON.parse recrée un objet clean
```

### Fix 5 : schéma de validation strict sur les inputs

```js
import { z } from 'zod'; // Zod : bibliothèque de validation et typage runtime

const configSchema = z.object({
 timeout: z.number().optional(),
 retries: z.number().optional(),
 // seules ces propriétés sont autorisées
});

app.post('/config', (req, res) => {
 const result = configSchema.safeParse(req.body);
 if (!result.success) {
  return res.status(400).json({ error: 'Config invalide' });
 }
 // result.data ne contient que timeout et retries, jamais __proto__
 applyConfig(result.data);
});
```

---

## 4) DÉTECTER UNE POLLUTION EXISTANTE

```js
// Vérifier si Object.prototype a été pollué
const checkPollution = () => {
 const testObj = {};
 const suspiciousKeys = ['isAdmin', 'role', 'authenticated', 'bypass'];

 for (const key of suspiciousKeys) {
  if (key in testObj) {
   // "in" vérifie aussi la chaîne prototype, contrairement à hasOwnProperty
   console.error(`ALERTE : Object.prototype.${key} pollué = ${testObj[key]}`);
  }
 }
};

// Utiliser hasOwnProperty pour une vérification sûre
const user = getUser(id);
if (Object.prototype.hasOwnProperty.call(user, 'isAdmin') && user.isAdmin) {
 // hasOwnProperty.call(user, 'isAdmin') : vérifie uniquement les propriétés propres de user
 // --> pas les propriétés héritées via la chaîne prototype
 grantAccess();
}
```

---

## EXERCICES

**EXO 1 : L'Oracle pollué**
Le projet Oracle Glitch merge les outputs LLM dans un objet de configuration global avec `deepMerge`. Un utilisateur malveillant a crafté (fabriqué) une réponse LLM contenant `{"__proto__": {"canExecuteCode": true}}`.
Écrire la version sécurisée de `deepMerge` qui bloque la pollution. Ensuite, écrire un test qui vérifie que `Object.prototype.canExecuteCode` reste `undefined` après le merge.
Contrainte : ne pas utiliser de bibliothèque externe, uniquement du JS natif.

**EXO 2 : La détection en prod**
Écrire une fonction `auditPrototype()` qui vérifie si les propriétés `isAdmin`, `role`, `__secret`, `bypass` ont été injectées dans `Object.prototype`. La fonction doit logger une alerte structurée (JSON avec timestamp et la liste des propriétés polluées) et retourner `true` si une pollution est détectée.
Contrainte : utiliser `Object.prototype.hasOwnProperty.call` correctement.

**EXO 3 : La fortification du camp**
Le Walking Dead Protocol utilise cette fonction pour merger les configs de camp (inventaire, sécurité, rations) :
```js
const mergeConfig = (base, override) => ({ ...base, ...override });
```
Mais les configs peuvent être imbriquées sur plusieurs niveaux. Implémenter `safeDeepMerge` qui gère les objets imbriqués sans être vulnérable à la pollution, en combinant `Object.create(null)` pour les objets intermédiaires et la validation des clés.

---

## RÉSUMÉ

Prototype pollution exploite le fait que tous les objets JS partagent le même `Object.prototype`. Modifier ce prototype modifie tous les objets, y compris les vérifications de sécurité. La fix tient en quatre règles : bloquer les clés `__proto__`/`constructor`/`prototype` dans les merges, utiliser `Object.create(null)` pour les objets de config, geler `Object.prototype` au démarrage, et valider strictement tous les inputs externes. La dernière règle est la plus importante : un input qui n'est jamais mergé de façon récursive sans validation ne peut pas polluer.
