---
stability: perissable_2027
---

# CONDITIONAL TYPES : DES TYPES QUI DÉPENDENT D'AUTRES TYPES
Temps de lecture ~10 min

> Ce fichier est niveau avancé.
> Prérequis minimum : `01_ts_basics/` complet + `02_ts_intermediate/` complet.
> Si tu découvres TypeScript : reviens ici après avoir utilisé les generics et les utility types
> sur un vrai projet. Ces concepts deviennent évidents après six mois de TS quotidien.
> Avant : ils paraissent absurdes.

`T extends U ? X : Y` : c'est un ternaire, mais pour les types. Si `T` est assignable à `U`, le type résultant est `X`. Sinon c'est `Y`.

C'est l'outil qui permet à TS de faire de l'inférence avancée : le type de sortie d'une fonction peut dépendre du type d'entrée, de manière dynamique et précise. Sans conditional types, les utility types natifs de TS (`ReturnType`, `Awaited`, `NonNullable`) n'existeraient pas.

C'est du TS avancé. Tu peux survivre sans le maîtriser. Tu ne peux pas lire du vrai code TS de prod sans le comprendre.

---

## 1) SYNTAXE DE BASE

```ts
// T extends U ? X : Y
// si T est assignable à U, le type résultant est X
// sinon c'est Y

type IsString<T> = T extends string ? "oui" : "non";

type A = IsString<string>; // "oui"
type B = IsString<number>; // "non"
type C = IsString<"Messi">; // "oui":"Messi" extends string
type D = IsString<42>; // "non"
```

```ts
// cas d'usage réel : NonNullable:extrait le type sans null ni undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type E = NonNullable<string | null>; // string
type F = NonNullable<number | undefined>; // number
type G = NonNullable<null>; // never
```

---

## 2) DISTRIBUTIVITÉ SUR LES UNIONS

Quand `T` est une union et qu'on l'utilise dans un conditional type, TS distribue le conditional sur chaque membre de l'union. C'est automatique et souvent ce qu'on veut.

```ts
type IsArray<T> = T extends any[] ? "array" : "not array";

type H = IsArray<string | number[]>;
// TS distribue :
// string extends any[] ? "array" : "not array" => "not array"
// number[] extends any[] ? "array" : "not array" => "array"
// résultat : "not array" | "array"
```

```ts
// Extract et Exclude sont des conditional types distributifs
type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T;

type Events = "goal" | "card" | "substitution" | "injury";

type CardEvents = Extract<Events, "card" | "injury">;
// "goal" extends "card" | "injury" ? "goal" : never => never
// "card" extends "card" | "injury" ? "card" : never => "card"
// "substitution" extends "card" | "injury" ? "substitution" : never => never
// "injury" extends "card" | "injury" ? "injury" : never => "injury"
// résultat : "card" | "injury"
```

```ts
// désactiver la distributivité avec des tuple brackets
type IsStringNonDistributive<T> = [T] extends [string] ? "oui" : "non";

type I = IsStringNonDistributive<string | number>;
// [string | number] extends [string] ? => non
// résultat : "non"
// (sans les brackets : "oui" | "non":avec : juste "non")
```

---

## 3) INFER : EXTRAIRE UN TYPE DEPUIS UN AUTRE TYPE

`infer` permet de nommer un type à l'intérieur d'un conditional type pour l'utiliser dans la branche then. C'est l'outil qui rend les conditional types vraiment puissants.

```ts
// ReturnType natif TS:réimplémenté pour comprendre
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
// si T est une fonction, R est son type de retour

function getPlayerStats(): { goals: number; assists: number } {
 return { goals: 31, assists: 12 };
}

type Stats = ReturnType<typeof getPlayerStats>;
// { goals: number; assists: number }
```

```ts
// extraire le type d'un tableau
type ArrayElement<T> = T extends (infer E)[] ? E : never;

type J = ArrayElement<string[]>; // string
type K = ArrayElement<Player[]>; // Player
type L = ArrayElement<number>; // never:pas un tableau
```

```ts
// extraire le type d'une Promise
type Awaited<T> = T extends Promise<infer R> ? R : T;

type M = Awaited<Promise<Player>>; // Player
type N = Awaited<Promise<string>>; // string
type O = Awaited<string>; // string (pas une Promise)
```

```ts
// extraire les paramètres d'une fonction
type FirstParameter<T> = T extends (first: infer F, ...rest: any[]) => any
 ? F
 : never;

function vote(playerId: number, score: number, comment?: string): void {}

type P = FirstParameter<typeof vote>; // number
```

---

## 4) CONDITIONAL TYPES IMBRIQUÉS

```ts
// type de sérialisation : string, number, boolean => valeur
//             objet => JSON string
//             fonction => undefined (non sérialisable)
type Serializable<T> = T extends string | number | boolean
 ? T
 : T extends object
  ? string
  : T extends Function
   ? undefined
   : never;

type Q = Serializable<string>; // string
type R = Serializable<Player>; // string (sérialisé en JSON)
type S = Serializable<() => void>; // undefined
```

---

## 5) DEEP READONLY ET AUTRES RÉCURSIFS

```ts
// utility type récursif qui rend tout readonly, même les objets imbriqués
// Partial natif est shallow:DeepReadonly descend dans les niveaux
type DeepReadonly<T> = T extends (infer E)[]
 ? ReadonlyArray<DeepReadonly<E>>
 : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

interface TeamConfig {
 name: string;
 stats: {
  wins: number;
  losses: number;
  players: { id: number; name: string }[];
 };
}

type FrozenTeam = DeepReadonly<TeamConfig>;
// tout est readonly:y compris stats.wins et stats.players[n].name
```

---

## 6) CONDITIONAL TYPES DANS LES OVERLOADS

```ts
// sans conditional types : deux overloads séparés
function wrapValue(value: string): { value: string };
function wrapValue(value: number): { value: number };
function wrapValue(value: any) {
 return { value };
}

// avec conditional types : une seule signature
type Wrapped<T> = T extends string | number ? { value: T } : never;

function wrapValue<T extends string | number>(value: T): Wrapped<T> {
 return { value } as Wrapped<T>;
}

const a = wrapValue("Messi"); // { value: string }
const b = wrapValue(31); // { value: number }
```

---

## 7) LE CAS QUI CASSE

```ts
// conditional type circulaire : TS peut boucler ou donner des résultats inattendus
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
// TS gère ça, mais les types récursifs complexes peuvent ralentir la compilation
// et parfois donner des erreurs "type instantiation is excessively deep"
```

```ts
// infer dans la mauvaise branche
type BadExtract<T> = T extends string ? infer R : R;
// ERREUR : R n'est pas défini dans la branche false
// infer ne fonctionne que dans la branche then (ou else si c'est symétrique)
```

```ts
// distributivité non voulue
type Flatten<T> = T extends any[] ? T[number] : T;

type T = Flatten<string | number[]>;
// string extends any[] ? => non => string
// number[] extends any[] ? => oui => number
// résultat : string | number
// si tu voulais Flatten<string | number[]> = string | number[], c'est pas ça
// utilise [T] extends [any[]] pour désactiver la distribution
```

---

## EXERCICES

## EXO 1 : le type de retour conditionnel
_~15 min_

La Trapsoul Radio retourne des tracks différemment selon le contexte : en `"full"` mode, elle retourne `Track` complet. En `"preview"` mode, elle retourne `Pick<Track, "id" | "title" | "duration">`.

Crée `TrackResponse<T extends "full" | "preview">` en utilisant un conditional type. Écris `fetchTrack<T extends "full" | "preview">(id: string, mode: T): Promise<TrackResponse<T>>`.

## EXO 2 : l'extracteur de type Promise
_~20 min_

Sur le dashboard de la CL, les fonctions retournent des `Promise<T>` et des valeurs synchrones. Tu veux un type `Resolved<T>` qui donne le type unwrappé.

Implémente `Resolved<T>` avec `infer` pour extraire le type d'une Promise (et laisser les valeurs non-Promise telles quelles). Test avec `Resolved<Promise<Player>>`, `Resolved<Promise<string[]>>`, `Resolved<number>`.

## EXO 3 : le sérialiseur de config
_~20 min_

Le système de Breaking Bad stocke des configs qui peuvent être primitives (stockées telles quelles) ou des objets (serialisés en JSON string) ou des fonctions (ignorées avec `never`).

Crée `SerializedConfig<T>` avec des conditional types imbriqués. Test avec tous les cas.

## EXO 4 : le type guard conditionnel
_~25 min_

Dans Walking Dead, les items d'inventaire peuvent être `"weapon"`, `"food"`, `"medical"`, ou `"tool"`. Les weapons ont `damage`. Les foods ont `calories`. Les medicals ont `healAmount`. Les tools ont `durability`.

Crée `ItemData<T extends ItemType>` qui retourne le bon type de données selon T : via conditional type. Écris une fonction `useItem<T extends ItemType>(type: T, data: ItemData<T>): string`.

---

## RÉSUMÉ

`T extends U ? X : Y` : le ternaire des types. Les conditional types se distribuent automatiquement sur les unions (chaque membre est évalué séparément). `infer R` extrait un type depuis la structure de `T` pour l'utiliser dans la branche then. `ReturnType`, `Awaited`, `Extract`, `Exclude`, `NonNullable` sont tous des conditional types sous le capot. Les types récursifs (`DeepReadonly`) combinent mapped types et conditional types. Piège principal : la distributivité non voulue sur les unions : `[T] extends [U]` la désactive si besoin.
