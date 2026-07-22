---
stability: perissable_2027
---

# UNION ET INTERSECTION : COMPOSER DES TYPES COMME DES ENSEMBLES
Temps de lecture ~10 min

Un joueur peut être attaquant ou défenseur. Un event peut être un goal ou un carton. Une fonction reçoit une string ou un number. C'est une union : plusieurs types possibles, un seul à la fois.

Un admin est à la fois un shinobi et un staff. Un ninja est à la fois un combattant et un médecin. C'est une intersection : plusieurs types combinés en un seul objet.

Ce sont les deux opérations fondamentales sur les types. Comprendre la différence change comment tu structures tout le reste.

---

## 1) UNION TYPES : L'UN OU L'AUTRE

```ts
// A | B : la valeur est soit de type A, soit de type B
type StringOrNumber = string | number;

function displayStat(value: StringOrNumber): string {
 return String(value);
}

displayStat(42); // OK
displayStat("Messi"); // OK
displayStat(true); // ERREUR : boolean n'est pas dans l'union
```

```ts
// union d'objets : les cas réels
type Goal = {
 type: "goal";
 scorer: string;
 minute: number;
};

type Card = {
 type: "card";
 player: string;
 color: "yellow" | "red";
};

type MatchEvent = Goal | Card;

function processEvent(event: MatchEvent): void {
 // ici TS ne sait pas si c'est un Goal ou un Card
 // event.scorer ne compile pas sans vérification
}
```

---

## 2) INTERSECTION TYPES : LES DEUX EN MÊME TEMPS

```ts
// A & B : la valeur doit avoir TOUTES les propriétés de A ET de B
type Timestamped = {
 createdAt: Date;
 updatedAt: Date;
};

type WithId = {
 id: number;
};

type Player = {
 name: string;
 goals: number;
};

// un joueur complet en DB : toutes les propriétés
type PlayerRecord = Player & WithId & Timestamped;
// {
//  name: string
//  goals: number
//  id: number
//  createdAt: Date
//  updatedAt: Date
// }

const player: PlayerRecord = {
 name: "Mbappé",
 goals: 35,
 id: 1,
 createdAt: new Date(),
 updatedAt: new Date(),
 // oublier une propriété = erreur TS
};
```

```ts
// pattern commun : ajouter des capacités à un type existant
type Logger = {
 log(message: string): void;
};

type Validator = {
 validate(data: unknown): boolean;
};

// un service qui fait les deux
type ValidatingLogger = Logger & Validator;

const service: ValidatingLogger = {
 log: (msg) => console.log(msg),
 validate: (data) => data !== null && data !== undefined,
};
```

---

## 3) DISCRIMINATED UNIONS : LE PATTERN QUI CHANGE TOUT

Une union ordinaire est floue : TS ne sait pas quelle branche tu regardes. Les discriminated unions ajoutent une propriété commune (le discriminant) qui permet à TS de savoir exactement ce qu'il a entre les mains.

```ts
type Loading = {
 status: "loading"; // <- le discriminant
};

type Success<T> = {
 status: "success"; // <- même clé, valeur différente
 data: T;
};

type Error = {
 status: "error";
 message: string;
 code: number;
};

type AsyncState<T> = Loading | Success<T> | Error;

function handlePlayerState(state: AsyncState<Player>): string {
 switch (state.status) {
  case "loading":
   return "Chargement du profil...";
  // ici TS sait que state est Loading:pas de .data disponible

  case "success":
   return `${state.data.name} : ${state.data.goals} buts`;
  // ici TS sait que state est Success<Player>:state.data est disponible et typé

  case "error":
   return `Erreur ${state.code} : ${state.message}`;
  // ici TS sait que state est Error
 }
 // TS vérifie que tous les cas sont couverts:si tu en oublies un, il te le dit
}
```

C'est le pattern le plus puissant de TS pour les états, les events, et les résultats de fetch. Kakashi doit avoir un plan pour chaque type de jutsu adverse : `loading`, `success`, `error`. Aucun cas ignoré.

---

## 4) EXHAUSTIVE CHECKING : NE JAMAIS OUBLIER UN CAS

```ts
type AttackType = "ninjutsu" | "taijutsu" | "genjutsu";

function getDamageMultiplier(attack: AttackType): number {
 switch (attack) {
  case "ninjutsu":
   return 1.5;
  case "taijutsu":
   return 1.2;
  // on a oublié genjutsu
 }
 // TS va se plaindre que la fonction peut retourner undefined
 // mais si le retour est number, il ne compile pas
}
```

```ts
// pattern never pour l'exhaustivité parfaite
function assertNever(value: never): never {
 throw new Error(`Cas non géré : ${JSON.stringify(value)}`);
}

function getDamageMultiplier(attack: AttackType): number {
 switch (attack) {
  case "ninjutsu":
   return 1.5;
  case "taijutsu":
   return 1.2;
  case "genjutsu":
   return 2.0;
  default:
   return assertNever(attack);
  // si tu ajoutes "fuinjutsu" à AttackType sans mettre à jour ce switch
  // TS génère une erreur sur assertNever:il ne peut plus être never
 }
}
```

---

## 5) NARROWING AVEC LES UNIONS

Quand tu as une union, TS a besoin qu'on lui prouve quelle branche on regarde avant de donner accès aux propriétés spécifiques.

```ts
type StringOrNumber = string | number;

function double(value: StringOrNumber): StringOrNumber {
 // ici value peut être string ou number
 // value * 2 ne compile pas : * n'est pas défini sur string

 if (typeof value === "number") {
  // ici TS sait que value est number
  return value * 2;
 }

 // ici TS sait que value est string (typeof number est éliminé)
 return value.repeat(2);
}
```

```ts
// narrowing avec instanceof pour les classes
type MatchError = new Error("but refusé")
type NetworkError = new Error("connexion perdue")

function handleError(err: Error): string {
 if (err instanceof TypeError) {
  return `Erreur de type : ${err.message}`
 }
 return `Erreur générique : ${err.message}`
}
```

---

## 6) UNION VS INTERSECTION : DIAGRAMME MENTAL

```
  Union A | B          Intersection A & B
  ─────────────          ─────────────────────
  valeur est A OU B       valeur est A ET B

  propriétés disponibles     propriétés disponibles
  = seulement celles communes   = TOUTES (A + B fusionnés)
  à A et B

  A = { name: string }      A = { name: string }
  B = { goals: number }      B = { goals: number }
  A | B :             A & B :
   → name? (pas sûr)        → name: string (toujours là)
   → goals? (pas sûr)       → goals: number (toujours là)
```

```ts
type A = { name: string; x: number };
type B = { goals: number; x: string };

type U = A | B;
// x est number | string (intersection des types de x)
// name et goals ne sont pas accessibles sans narrowing

type I = A & B;
// x est number & string = never (impossible d'être les deux)
// TS va probablement rejeter ça en pratique
// attention aux intersections de types primitifs incompatibles
```

---

## 7) LE CAS QUI CASSE

```ts
// union avec objet sans discriminant : TS perd le contexte
type AdminUser = { name: string; permissions: string[] };
type RegularUser = { name: string; preferences: string[] };

type User = AdminUser | RegularUser;

function getAdmin(user: User): string[] {
 return user.permissions;
 // ERREUR : permissions n'existe pas forcément sur User
 // TS ne sait pas si c'est un AdminUser ou RegularUser
}

// fix : ajouter un discriminant
type AdminUser = { role: "admin"; name: string; permissions: string[] };
type RegularUser = { role: "user"; name: string; preferences: string[] };

function getAdmin(user: User): string[] | null {
 if (user.role === "admin") {
  return user.permissions; // TS sait que c'est AdminUser
 }
 return null;
}
```

---

## EXERCICES

## EXO 1 : le pipeline d'events de la CL
_~10 min_

La Ligue des Champions a des events : `Goal`, `Card`, `Substitution`, `Injury`. Chacun a un `type` (discriminant), un `minute`, et des propriétés spécifiques.

Définis les 4 types, crée l'union `CLEvent`, et écris `formatEvent(event: CLEvent): string` qui retourne une description selon le type. Ajoute `assertNever` pour garantir l'exhaustivité.

## EXO 2 : l'état du fetch des stats
_~15 min_

Tu fetch les stats d'un joueur depuis une API. L'état peut être `idle`, `loading`, `success`, `error`. En `success`, tu as les données. En `error`, un message et un code.

Modélise `FetchState<T>` comme une discriminated union. Écris `renderState<T>(state: FetchState<T>, render: (data: T) => string): string` qui gère tous les cas.

## EXO 3 : le personnage hybride de Garo
_~20 min_

Dans Garo, certains personnages sont à la fois des guerriers et des sorciers. Un guerrier a `strength` et `weapon`. Un sorcier a `mana` et `spells[]`. Un Chevalier d'Or est les deux.

Crée les types `Warrior`, `Sorcerer`, et `GoldenKnight = Warrior & Sorcerer`. Écris une fonction `powerLevel(char: Warrior | Sorcerer | GoldenKnight): number` qui calcule le niveau selon ce que le personnage est.

## EXO 4 : le système de log de Breaking Bad
_~20 min_

Le réseau de Walter a 3 types de logs : `SupplyLog` (cargaison, quantité, warehouse), `DeliveryLog` (destination, courrier, heure), `AlertLog` (niveau de menace, raison, action prise).

Crée l'union `OperationLog`, écris `logToString(log: OperationLog): string`, et assure-toi que si un 4ème type de log est ajouté sans que `logToString` soit mis à jour, TS génère une erreur de compilation.

---

## RÉSUMÉ

`A | B` : la valeur est l'un ou l'autre : seules les propriétés communes sont accessibles sans narrowing. `A & B` : la valeur est les deux à la fois : toutes les propriétés sont disponibles. Le discriminant transforme une union floue en union précise que TS peut analyser sans ambiguïté. `assertNever` garantit que tous les cas d'une union sont couverts : si tu ajoutes un cas sans mettre à jour le switch, ça ne compile pas. Les intersections de primitifs incompatibles (`number & string`) donnent `never`.
