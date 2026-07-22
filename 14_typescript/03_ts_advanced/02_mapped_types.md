---
stability: perissable_2027
---

# MAPPED TYPES : TRANSFORMER UN TYPE PROPRIÉTÉ PAR PROPRIÉTÉ
Temps de lecture ~10 min

Tu as un type avec 10 propriétés. Tu veux une version readonly de ce type. Une version optionnelle. Une version où chaque valeur est une fonction plutôt qu'une donnée brute. Sans les mapped types, tu réécris tout à la main. Avec les mapped types, tu le génères en une ligne.

C'est le mécanisme derrière `Readonly`, `Partial`, `Required`, `Record` : tous les utility types du fichier 02. Ici on comprend comment ils fonctionnent, et on en crée de nouveaux.

---

## 1) SYNTAXE DE BASE

```ts
// { [K in keyof T]: ... }
// pour chaque clé K de T, génère une propriété

type ReadonlyPlayer = {
 [K in keyof Player]: Player[K];
 // on recopie chaque propriété telle quelle
 // utile pour vérifier la structure:mais ici on ne transforme rien encore
};

// équivalent à Player:pas très utile en soi
// c'est quand on ajoute des modificateurs que ça devient puissant
```

---

## 2) MODIFICATEURS : READONLY ET OPTIONAL

```ts
interface Player {
 id: number;
 name: string;
 goals: number;
}

// ajouter readonly sur toutes les propriétés
type Frozen<T> = {
 readonly [K in keyof T]: T[K];
};

// enlever readonly
type Mutable<T> = {
 -readonly [K in keyof T]: T[K];
 // le - avant readonly l'enlève
};

// rendre optionnel
type Optional<T> = {
 [K in keyof T]?: T[K];
};

// rendre obligatoire (enlever le ?)
type Mandatory<T> = {
 [K in keyof T]-?: T[K];
 // le - avant ? l'enlève
};

// test
type MutablePlayer = Mutable<Frozen<Player>>;
// revient à Player:on a ajouté puis enlevé readonly
```

---

## 3) TRANSFORMER LES VALEURS

```ts
// chaque propriété devient un getter
type Getters<T> = {
 [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Player {
 name: string;
 goals: number;
}

type PlayerGetters = Getters<Player>;
// {
//  getName: () => string
//  getGoals: () => number
// }
```

```ts
// chaque propriété devient un observable (callback pattern)
type Observable<T> = {
 [K in keyof T]: {
  value: T[K];
  subscribe: (callback: (newValue: T[K]) => void) => void;
 };
};

type ObservablePlayer = Observable<Player>;
// {
//  name: { value: string, subscribe: (callback: (v: string) => void) => void }
//  goals: { value: number, subscribe: (callback: (v: number) => void) => void }
// }
```

---

## 4) KEY REMAPPING AVEC `AS`

```ts
// renommer les clés pendant le mapping
type EventHandlers<T> = {
 [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

interface PlayerState {
 name: string;
 goals: number;
 club: string;
}

type PlayerHandlers = EventHandlers<PlayerState>;
// {
//  onNameChange: (value: string) => void
//  onGoalsChange: (value: number) => void
//  onClubChange: (value: string) => void
// }
```

```ts
// filtrer des clés pendant le mapping avec never
type OnlyStringProps<T> = {
 [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
 name: string;
 age: number;
 club: string;
 goals: number;
 nationality: string;
}

type StringProps = OnlyStringProps<Mixed>;
// {
//  name: string
//  club: string
//  nationality: string
// }
// age et goals ont été filtrés (number ne satisfait pas extends string => never)
```

---

## 5) MAPPED TYPES AVEC CONDITIONAL TYPES

Les deux se combinent naturellement. Mapped types itèrent sur les clés. Conditional types décident du type de chaque valeur.

```ts
// transformer les types selon ce qu'ils sont
type Nullable<T> = {
 [K in keyof T]: T[K] | null;
};

type Stringified<T> = {
 [K in keyof T]: T[K] extends number ? string : T[K];
 // les numbers deviennent des strings, le reste reste pareil
};

interface RawStats {
 goals: number;
 assists: number;
 name: string;
 club: string;
}

type DisplayStats = Stringified<RawStats>;
// {
//  goals: string   <- number => string
//  assists: string  <- number => string
//  name: string   <- string => string (inchangé)
//  club: string   <- string => string (inchangé)
// }
```

---

## 6) DEEP MAPPED TYPES

```ts
// DeepReadonly : descend dans tous les objets imbriqués
type DeepReadonly<T> = {
 readonly [K in keyof T]: T[K] extends object
  ? DeepReadonly<T[K]> // si c'est un objet, on descend récursivement
  : T[K]; // sinon on garde tel quel
};

interface TeamConfig {
 name: string;
 coach: {
  name: string;
  tactics: {
   formation: string;
   pressing: boolean;
  };
 };
}

type FrozenTeam = DeepReadonly<TeamConfig>;
// tout est readonly, y compris coach.tactics.formation
```

---

## 7) RECORD REVISITÉ ET PATTERNS AVANCÉS

```ts
// Record<K, V> est un mapped type sur une union
type Record<K extends keyof any, V> = {
 [P in K]: V;
};

// Utile pour créer des maps typées
type Position = "attaquant" | "milieu" | "défenseur" | "gardien";

type PositionConfig = Record<
 Position,
 {
  minPlayers: number;
  maxPlayers: number;
  zone: "offensive" | "defensive" | "middle";
 }
>;

const config: PositionConfig = {
 attaquant: { minPlayers: 1, maxPlayers: 3, zone: "offensive" },
 milieu: { minPlayers: 3, maxPlayers: 5, zone: "middle" },
 défenseur: { minPlayers: 3, maxPlayers: 5, zone: "defensive" },
 gardien: { minPlayers: 1, maxPlayers: 1, zone: "defensive" },
};
```

---

## 8) PATTERN : VALIDATION SCHEMA

```ts
// générer automatiquement un schéma de validation depuis un type
type ValidationSchema<T> = {
 [K in keyof T]: {
  required: boolean;
  validate: (value: T[K]) => boolean;
  errorMessage: string;
 };
};

interface VoteForm {
 playerId: number;
 score: number;
 comment: string;
}

const schema: ValidationSchema<VoteForm> = {
 playerId: {
  required: true,
  validate: (v) => v > 0,
  errorMessage: "L'ID du joueur doit être positif",
 },
 score: {
  required: true,
  validate: (v) => v >= 1 && v <= 10,
  errorMessage: "Le score doit être entre 1 et 10",
 },
 comment: {
  required: false,
  validate: (v) => v.length <= 500,
  errorMessage: "Le commentaire ne peut pas dépasser 500 caractères",
 },
};
// si tu ajoutes un champ à VoteForm sans l'ajouter au schema : erreur TS
```

---

## 9) LE CAS QUI CASSE

```ts
// mapped type sur une union : comportement inattendu
type MappedUnion<T> = {
 [K in keyof T]: T[K];
};

type PlayerOrTeam = Player | Team;

type Result = MappedUnion<PlayerOrTeam>;
// keyof (Player | Team) = propriétés communes seulement
// si Player = { id, name, goals } et Team = { id, name, members }
// keyof (Player | Team) = "id" | "name" uniquement
// goals et members disparaissent
// si tu veux mapper séparément : MappedUnion<Player> | MappedUnion<Team>
```

```ts
// -readonly et -? ne fonctionnent pas si la propriété n'avait pas ces modificateurs
interface Strict {
 name: string; // pas de ?, pas de readonly
}

type Mandatory<T> = { [K in keyof T]-?: T[K] };
type StrictMandatory = Mandatory<Strict>;
// pas d'erreur, mais -? sur une propriété déjà non-optionnelle = no-op
// pas de bug, mais inutile:vérifier avant d'appliquer
```

---

## EXERCICES

## EXO 1 : les getters du dashboard
_~15 min_

Le dashboard de la CL a un état (`MatchState`) avec `score`, `minute`, `possession`, `events`. Génère automatiquement un objet `getters` où chaque propriété devient une fonction `get<PropertyName>()`.

Crée `Getters<T>` avec key remapping et `Capitalize`. Teste que `getters.getScore()` retourne le bon type.

## EXO 2 : le schéma de validation du Ballon d'Or
_~20 min_

Le formulaire de vote a 6 champs. Génère un `ValidationSchema<VoteForm>` qui associe à chaque champ : `required`, `minLength`/`min` selon le type, `errorMessage`.

Utilise un mapped type + conditional type sur le type de la valeur pour différencier les champs string des champs number.

## EXO 3 : la config d'events de Garo
_~20 min_

Chaque type d'event du pipeline Garo (`HorrorSpotted`, `KnightDispatched`, `CombatStarted`, `CombatEnded`) doit avoir une config : `priority` (1-5), `timeout` (ms), `retryable` (boolean), `notifyCouncil` (boolean).

Crée `EventConfig` depuis un type `GaroEventType = "horrorSpotted" | "knightDispatched" | "combatStarted" | "combatEnded"` avec `Record`, et une version `ReadonlyEventConfig` via mapped type.

## EXO 4 : le diff de state
_~25 min_

Dans Walking Dead, on compare deux états du camp pour voir ce qui a changé. `StateDiff<T>` prend un type `T` et génère un type où chaque propriété est `{ before: T[K], after: T[K], changed: boolean }`.

Crée `StateDiff<T>` et une fonction `computeDiff<T>(before: T, after: T): StateDiff<T>` qui remplit la structure.

---

## RÉSUMÉ

`{ [K in keyof T]: ... }` itère sur les clés de T et génère un nouveau type. `readonly`, `?`, et leurs versions avec `-` modifient les modificateurs de chaque propriété. `as` dans le mapping renomme les clés : `as never` filtre des clés. Les conditional types dans le corps du mapping décident du type de chaque valeur selon ce qu'il était. Les mapped types récursifs descendent dans les objets imbriqués. Piège : `keyof (A | B)` ne donne que les propriétés communes : si tu veux tout, mappe les types séparément.
