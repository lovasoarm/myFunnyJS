---
stability: intemporel
---

# CUSTOM ERRORS : LES ERREURS QUI RACONTENT UNE HISTOIRE

Temps de lecture ~6 min


Une `Error` générique c'est comme un carton rouge sans explication : tu sais que c'est mauvais, tu sais pas pourquoi.

Une custom error, c'est le rapport de l'arbitre : qui, quoi, pourquoi, avec les données contextuelles attachées.

En prod, la différence entre `Error: something went wrong` et `ValidationError: le champ "xG" doit être un nombre, reçu "undefined" (joueur: 7, match: 2024-UCL-F)` c'est la différence entre 3 heures de debug et 10 minutes.

---

## 1) ÉTENDRE LA CLASSE ERROR

La base : hériter de `Error` avec `extends`.

```js
class ValidationError extends Error {
 constructor(message) {
  super(message); // passe le message à Error
  this.name = "ValidationError";
  // sans ça, e.name reste "Error":inutile pour le catch sélectif
 }
}

// utilisation
try {
 throw new ValidationError("xG doit être entre 0 et 1");
} catch (e) {
 console.log(e instanceof ValidationError); // true
 console.log(e instanceof Error); // true aussi:héritage
 console.log(e.name); // "ValidationError"
 console.log(e.message); // "xG doit être entre 0 et 1"
 console.log(e.stack); // stack trace complète:toujours là
}
```

Deux règles :

1. `super(message)` obligatoire : sinon le message est vide et la stack trace est cassée
2. `this.name = "NomDeLaClasse"` obligatoire : sinon tu perds le nom en catch

---

## 2) AJOUTER DU CONTEXTE

Une bonne custom error porte les données dont tu as besoin pour comprendre ce qui s'est passé.

```js
class NotFoundError extends Error {
 constructor(ressource, id) {
  super(`${ressource} introuvable : id ${id}`);
  this.name = "NotFoundError";
  this.ressource = ressource; // données structurées attachées
  this.id = id;
  this.code = 404; // code HTTP ou code métier
 }
}

class ValidationError extends Error {
 constructor(champ, valeur, contrainte) {
  super(`Champ invalide "${champ}" : ${contrainte}`);
  this.name = "ValidationError";
  this.champ = champ;
  this.valeur = valeur;
  this.contrainte = contrainte;
  this.code = 400;
 }
}

class AuthError extends Error {
 constructor(action, raison) {
  super(`Action refusée "${action}" : ${raison}`);
  this.name = "AuthError";
  this.action = action;
  this.raison = raison;
  this.code = 403;
 }
}
```

Maintenant dans les logs tu vois ça :

```
ValidationError: Champ invalide "buts" : doit être un entier positif
 champ: "buts"
 valeur: -3
 contrainte: "doit être un entier positif"
 code: 400
```

Plutôt que :

```
Error: invalid input
```

---

## 3) HIÉRARCHIE D'ERREURS

Pour une app réelle, tu construis une hiérarchie. Ça permet du catch par niveau.

Exemple sur une API de stats de foot :

```js
// erreur de base du domaine
class AppError extends Error {
 constructor(message, code) {
  super(message);
  this.name = "AppError";
  this.code = code;
 }
}

// erreurs métier spécifiques
class ValidationError extends AppError {
 constructor(champ, probleme) {
  super(`Validation échouée sur "${champ}" : ${probleme}`, 400);
  this.name = "ValidationError";
  this.champ = champ;
 }
}

class NotFoundError extends AppError {
 constructor(entite, id) {
  super(`${entite} [${id}] introuvable`, 404);
  this.name = "NotFoundError";
  this.entite = entite;
  this.id = id;
 }
}

class DatabaseError extends AppError {
 constructor(operation, details) {
  super(`DB failure pendant "${operation}"`, 500);
  this.name = "DatabaseError";
  this.operation = operation;
  this.details = details;
 }
}
```

Pourquoi cette hiérarchie ?

```js
try {
 // n'importe quelle opération
} catch (e) {
 if (e instanceof ValidationError) {
  // erreur opérateur → retourner 400 avec le message
  return { status: 400, error: e.message, champ: e.champ };
 }
 if (e instanceof NotFoundError) {
  // ressource manquante → 404
  return { status: 404, error: e.message };
 }
 if (e instanceof AppError) {
  // autre erreur métier → utiliser e.code
  return { status: e.code, error: e.message };
 }
 // erreur inattendue → 500 + log complet
 console.error("ERREUR NON GÉRÉE", e);
 return { status: 500, error: "erreur interne" };
}
```

`instanceof` remonte la chaîne de proto : `ValidationError instanceof AppError` retourne `true`. Tu peux donc catcher par niveau de précision.

---

## 4) LE PIÈGE DE STACK TRACE EN HÉRITAGE

En V8 (Node.js / Chrome), si tu n'appelles pas `super()` correctement, ta stack trace pointe au mauvais endroit.

```js
// version fragile
class MauvaisError extends Error {
 constructor(msg) {
  super(msg);
  this.name = "MauvaisError";
  // rien d'autre
 }
}

// version solide:pour Node < 12 ou si tu veux être explicite
class BonneError extends Error {
 constructor(msg) {
  super(msg);
  this.name = "BonneError";
  if (Error.captureStackTrace) {
   // V8 only:capture la stack depuis ce constructeur
   // sans ça la stack inclut les internals du constructeur
   Error.captureStackTrace(this, BonneError);
  }
 }
}
```

En Node moderne (12+), `super()` suffit. `captureStackTrace` c'est le détail qui compte si tu veux des stacks propres dans des outils comme Sentry.

---

## 5) SERIALISER UNE ERREUR POUR LES LOGS

Les objets Error ne se sérialisent pas bien en JSON par défaut :

```js
const e = new ValidationError("buts", "valeur négative");
console.log(JSON.stringify(e));
// "{}" <-- vide. magnifique.
```

Solution : une fonction de sérialisation propre.

```js
function serializerError(e) {
 return {
  name: e.name,
  message: e.message,
  stack: e.stack,
  // propriétés customs
  ...(e.champ && { champ: e.champ }),
  ...(e.code && { code: e.code }),
  ...(e.id && { id: e.id }),
 };
}

// dans ton logger
function logError(e, contexte = {}) {
 console.error(
  JSON.stringify({
   timestamp: new Date().toISOString(),
   ...contexte,
   error: serializerError(e),
  }),
 );
}

logError(new ValidationError("buts", "valeur négative"), {
 joueurId: 7,
 matchId: "UCL-2024-FINAL",
});
```

Output :

```json
{
 "timestamp": "2024-05-25T21:00:00.000Z",
 "joueurId": 7,
 "matchId": "UCL-2024-FINAL",
 "error": {
  "name": "ValidationError",
  "message": "Champ invalide \"buts\" : valeur négative",
  "champ": "buts",
  "code": 400,
  "stack": "ValidationError: ..."
 }
}
```

Ça c'est un log qui raconte une histoire.

---

## 6) EXEMPLE RÉEL : VALIDATION D'UN JUTSU

```js
class JutsuError extends Error {
 constructor(jutsu, ninja, raison) {
  super(`${ninja} ne peut pas lancer ${jutsu} : ${raison}`);
  this.name = "JutsuError";
  this.jutsu = jutsu;
  this.ninja = ninja;
  this.raison = raison;
 }
}

class ChakraInsuffisantError extends JutsuError {
 constructor(ninja, jutsu, chakraActuel, chakraNecessaire) {
  super(
   jutsu,
   ninja,
   `chakra insuffisant (${chakraActuel}/${chakraNecessaire})`,
  );
  this.name = "ChakraInsuffisantError";
  this.chakraActuel = chakraActuel;
  this.chakraNecessaire = chakraNecessaire;
 }
}

function lancerJutsu(ninja, jutsu) {
 if (ninja.chakra < jutsu.coutChakra) {
  throw new ChakraInsuffisantError(
   ninja.nom,
   jutsu.nom,
   ninja.chakra,
   jutsu.coutChakra,
  );
 }
 return { succes: true, degats: jutsu.degats };
}

try {
 lancerJutsu(
  { nom: "Rock Lee", chakra: 5 },
  { nom: "Rasengan", coutChakra: 100, degats: 500 },
 );
} catch (e) {
 if (e instanceof ChakraInsuffisantError) {
  console.log(`Réserve de chakra : ${e.chakraActuel}/${e.chakraNecessaire}`);
  // "Réserve de chakra : 5/100"
 }
 console.log(e.message);
 // "Rock Lee ne peut pas lancer Rasengan : chakra insuffisant (5/100)"
}
```

---

## EXERCICES

## EXO 1 : LE SYSTÈME DE TRANSFERT

Crée trois custom errors pour un système de transfert de joueur :

- `BudgetInsuffisantError(club, budgetDisponible, prixDemande)`
- `JoueurSousContratError(joueur, clubActuel, finContrat)`
- `ClubbingInterditError(joueur, raison)`

Chacune doit avoir : `name`, `message` descriptif, propriétés structurées, `code` HTTP.

Teste en levant chacune et en les catchant sélectivement.

---

## EXO 2 : LA HIÉRARCHIE PRISON BREAK

Michael Scofield a besoin d'erreurs pour son système d'évasion.

Construis la hiérarchie :

- `PrisonBreakError` (base)
 - `PlanCompromisError(section, raison)`
 - `GardeAlertéError(garde, localisation)`
 - `TempsEcoulError(phaseActuelle, tempsRestant)`

Écris une fonction `executerPhase(phase)` qui peut lever n'importe laquelle.
Entoure-la d'un catch qui gère chaque type différemment.

---

## EXO 3 : LE LOG QUI RACONTE

Reprends les erreurs de l'EXO 1. Écris une fonction `logStructure(e, contexteSupplementaire)` qui produit un objet JSON complet avec toutes les propriétés de l'erreur.

Vérifie que `JSON.stringify` produit quelque chose d'utile.

---

## RÉSUMÉ

Une custom error = `extends Error` + `super(message)` + `this.name` + propriétés contextuelles.

La hiérarchie permet le catch par niveau : `instanceof ValidationError` vs `instanceof AppError`.

Les erreurs ne se sérialisent pas seules en JSON : tu construis une fonction de sérialisation explicite.

Un log sans contexte, c'est un rapport de match sans les statistiques : tu sais que ça s'est passé, tu sais pas ce qui s'est passé.
