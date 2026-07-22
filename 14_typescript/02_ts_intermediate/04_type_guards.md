---
stability: perissable_2027
---

# TYPE GUARDS : RÉTRÉCIR UN TYPE À RUNTIME
Temps de lecture ~10 min

TS vérifie les types à la compilation. Mais la data arrive à runtime : depuis une API, un formulaire, un fichier JSON. TS ne peut pas deviner ce que l'API t'envoie vraiment.

Les type guards sont les vérifications que tu fais à runtime pour prouver à TS ce que tu as entre les mains. TS lit ces checks et rétrécit le type dans la branche concernée : c'est ce qu'on appelle le narrowing.

C'est le pont entre le monde statique de TS et le monde chaotique du runtime.

---

## 1) TYPEOF : POUR LES PRIMITIFS

```ts
function process(value: string | number | boolean): string {
 if (typeof value === "string") {
  // ici TS sait que value est string
  return value.toUpperCase();
 }

 if (typeof value === "number") {
  // ici TS sait que value est number
  return value.toFixed(2);
 }

 // ici TS sait que value est boolean (les deux autres ont été éliminés)
 return value ? "actif" : "inactif";
}
```

`typeof` fonctionne pour : `string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `function`. Il ne distingue pas les objets entre eux (tout est `"object"`). Pour ça, on utilise autre chose.

---

## 2) INSTANCEOF : POUR LES CLASSES

```ts
class NinjaError extends Error {
 constructor(
  message: string,
  public readonly ninjaName: string,
 ) {
  super(message);
  this.name = "NinjaError";
 }
}

class ChakraError extends Error {
 constructor(
  message: string,
  public readonly chakraLevel: number,
 ) {
  super(message);
  this.name = "ChakraError";
 }
}

function handleError(err: NinjaError | ChakraError | Error): string {
 if (err instanceof NinjaError) {
  // ici TS sait que err est NinjaError
  return `${err.ninjaName} a foiré : ${err.message}`;
 }

 if (err instanceof ChakraError) {
  // ici TS sait que err est ChakraError
  return `Chakra insuffisant (niveau ${err.chakraLevel}) : ${err.message}`;
 }

 // ici TS sait que err est Error de base
 return `Erreur générique : ${err.message}`;
}
```

`instanceof` vérifie si un objet est une instance d'une classe (ou d'une de ses sous-classes). Ça ne marche pas pour les interfaces (elles n'existent plus à runtime).

---

## 3) IN OPERATOR : VÉRIFIER LA PRÉSENCE D'UNE PROPRIÉTÉ

```ts
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

function isGoal(event: MatchEvent): event is Goal {
 return "scorer" in event;
 // si l'objet a une propriété scorer, c'est un Goal
}

function processEvent(event: MatchEvent): void {
 if ("scorer" in event) {
  // TS sait que event est Goal
  console.log(`But de ${event.scorer} à la ${event.minute}e`);
 } else {
  // TS sait que event est Card
  console.log(`Carton ${event.color} pour ${event.player}`);
 }
}
```

---

## 4) TYPE PREDICATES : LES FONCTIONS DE GARDE CUSTOM

Un type predicate est une fonction qui retourne `value is Type`. Si la fonction retourne `true`, TS rétrécit le type dans la branche `if`.

```ts
interface Player {
 id: number;
 name: string;
 goals: number;
}

// sans type predicate
function checkPlayer(value: unknown): boolean {
 return (
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  "name" in value
 );
}

const data: unknown = fetchPlayer();
if (checkPlayer(data)) {
 data.name; // ERREUR : TS sait pas que data est Player:checkPlayer retourne boolean
}
```

```ts
// avec type predicate : value is Player
function isPlayer(value: unknown): value is Player {
 return (
  typeof value === "object" &&
  value !== null &&
  "id" in value &&
  typeof (value as any).id === "number" &&
  "name" in value &&
  typeof (value as any).name === "string" &&
  "goals" in value &&
  typeof (value as any).goals === "number"
 );
}

const data: unknown = fetchPlayer();
if (isPlayer(data)) {
 // ici TS sait que data est Player
 console.log(data.name); // OK
 console.log(data.goals); // OK
}
```

C'est la technique centrale pour valider de la data externe. Chaque endpoint API, chaque JSON parsé, chaque donnée de formulaire passe par un type predicate avant d'être utilisé.

---

## 5) ASSERTION FUNCTIONS : LANCER UNE ERREUR SI LE TYPE EST FAUX

```ts
// asserts value is Player : si la fonction retourne (sans throw), TS sait que value est Player
function assertIsPlayer(value: unknown): asserts value is Player {
 if (!isPlayer(value)) {
  throw new TypeError(`Expected Player, got ${JSON.stringify(value)}`);
 }
}

const data: unknown = fetchPlayer();
assertIsPlayer(data);
// après cette ligne, TS sait que data est Player
// si ça n'en est pas un, l'erreur est lancée avant
console.log(data.name); // OK:TS a intégré l'assertion
```

```ts
// pattern commun : assertNonNull
function assertNonNull<T>(
 value: T | null | undefined,
 message?: string,
): asserts value is T {
 if (value == null) {
  throw new Error(message ?? "Expected non-null value");
 }
}

const player = getPlayerOrNull(1);
assertNonNull(player, "Player introuvable");
player.name; // OK:TS sait que player est non-null
```

---

## 6) DISCRIMINATED UNIONS REVISITÉES

On en a parlé dans le fichier précédent. Avec les type guards, le discriminant devient encore plus puissant.

```ts
type AsyncState<T> =
 | { status: "idle" }
 | { status: "loading" }
 | { status: "success"; data: T }
 | { status: "error"; message: string; code: number };

// type predicate sur une discriminated union
function isSuccess<T>(
 state: AsyncState<T>,
): state is Extract<AsyncState<T>, { status: "success" }> {
 return state.status === "success";
}

function getPlayerData(state: AsyncState<Player>): Player | null {
 if (isSuccess(state)) {
  return state.data; // TS sait que state.data existe
 }
 return null;
}
```

---

## 7) VALIDATION DE DATA EXTERNE : LE PATTERN COMPLET

```ts
// réponse API brute = unknown par défaut
interface TrackData {
 id: string;
 title: string;
 artist: string;
 duration: number; // en secondes
}

function isTrackData(value: unknown): value is TrackData {
 if (typeof value !== "object" || value === null) return false;

 const v = value as Record<string, unknown>;

 return (
  typeof v.id === "string" &&
  typeof v.title === "string" &&
  typeof v.artist === "string" &&
  typeof v.duration === "number" &&
  v.duration >= 0
 );
}

async function fetchTrack(id: string): Promise<TrackData> {
 const response = await fetch(`/api/tracks/${id}`);
 const raw: unknown = await response.json();

 if (!isTrackData(raw)) {
  throw new TypeError(
   `API returned invalid TrackData: ${JSON.stringify(raw)}`,
  );
 }

 return raw; // TS sait que c'est TrackData
}
```

---

## 8) LE CAS QUI CASSE

```ts
// type predicate qui ment : TS te fait confiance même si tu te trompes
function isPlayer(value: unknown): value is Player {
 return typeof value === "object" && value !== null;
 // tu vérifies juste que c'est un objet, pas que c'est un Player
}

const data: unknown = { name: "Messi" }; // pas de goals, pas de id
if (isPlayer(data)) {
 // TS pense que c'est un Player
 console.log(data.goals.toFixed(0)); // runtime : TypeError:goals est undefined
}
// règle : un type predicate doit vérifier TOUTES les propriétés du type
```

```ts
// instanceof qui rate sur les erreurs cross-realm
// (iframe, vm.runInContext, worker)
const err = workerResult.error; // une Error créée dans un autre contexte
err instanceof Error; // peut retourner false même si c'est bien une Error
// dans ces cas : vérifier err.name ou err.message directement
```

---

## EXERCICES

## EXO 1 : le validateur de stats de la CL
_~15 min_

L'API de la Ligue des Champions retourne des données brutes (`unknown`). Certaines sont des joueurs, d'autres des équipes, d'autres des matchs.

Écris des type predicates `isPlayer`, `isTeam`, `isMatch` et une fonction `processApiData(data: unknown): string` qui les utilise pour formatter la bonne information.

## EXO 2 : le système d'erreurs de Garo
_~15 min_

Le pipeline de Garo peut lancer : `HorrorEscapeError` (avec `horrorName: string`), `ArmorCollapseError` (avec `secondsElapsed: number`), `KnightDownError` (avec `knightName: string`, `isFatal: boolean`). Toutes étendent `Error`.

Écris un handler `handleGaroError(err: unknown): string` qui utilise `instanceof` pour chaque type d'erreur et retourne un message approprié. Ajoute un fallback pour les erreurs inconnues.

## EXO 3 : la validation du formulaire de vote
_~20 min_

Le formulaire du Ballon d'Or envoie des données qu'on reçoit comme `unknown`. Un vote valide a : `voterId` (string, non vide), `playerId` (number, positif), `score` (number, entre 1 et 10), `comment` (string optionnel).

Écris `isValidVote(data: unknown): data is ValidVote` et `assertValidVote(data: unknown): asserts data is ValidVote`. Gère les edge cases : null, array, string, number.

## EXO 4 : le dispatcher d'events de Walking Dead
_~20 min_

Le camp reçoit des events radio de type inconnu (`unknown`). Un event `AttackEvent` a `{ type: "attack", zombieCount: number, sector: string }`. Un event `SupplyEvent` a `{ type: "supply", items: string[], quantity: number }`. Un event `SurvivorEvent` a `{ type: "survivor", name: string, condition: "healthy" | "injured" | "critical" }`.

Écris les type predicates et un dispatcher `handleRadioEvent(raw: unknown): string` qui valide et traite chaque type.

---

## RÉSUMÉ

`typeof` pour les primitifs. `instanceof` pour les classes. `in` pour la présence d'une propriété. Les type predicates (`value is Type`) permettent des fonctions de validation custom que TS comprend : si elles retournent `true`, TS rétrécit le type. Les assertion functions (`asserts value is Type`) lancent une erreur si la valeur ne correspond pas, et TS intègre l'assertion pour le code qui suit. Le piège critique : un type predicate qui ment laisse TS croire qu'un type est valide alors qu'il ne l'est pas : les bugs arrivent à runtime, là où TS ne peut plus t'aider.
