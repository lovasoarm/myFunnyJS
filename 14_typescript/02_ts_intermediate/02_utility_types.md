---
stability: perissable_2027
---

# UTILITY TYPES : LES OUTILS QUI TRANSFORMENT TES TYPES SANS LES RÉÉCRIRE
Temps de lecture ~10 min

Tu as un type `Player` avec 12 propriétés. Tu veux un formulaire d'édition où tout est optionnel. Tu veux un résumé public avec seulement 3 champs. Tu veux une version en lecture seule pour l'affichage.

Sans les utility types : tu réécris trois types quasi-identiques à la main. Un jour tu ajoutes un champ à `Player`, tu oublies de l'ajouter aux trois copies. Bug silencieux. Mauvais.

Les utility types de TS transforment des types existants. C'est du méta-typage : des types qui fabriquent d'autres types.

---

## 1) PARTIAL : TOUT DEVIENT OPTIONNEL

```ts
interface Player {
 id: number;
 name: string;
 goals: number;
 club: string;
 nationality: string;
}

// formulaire de mise à jour : on n'envoie que ce qui change
type PlayerUpdate = Partial<Player>;
// équivalent à :
// {
//  id?: number
//  name?: string
//  goals?: number
//  club?: string
//  nationality?: string
// }

function updatePlayer(id: number, changes: Partial<Player>): Player {
 // implementation
}

updatePlayer(1, { goals: 32 }); // OK:seulement goals
updatePlayer(1, { club: "PSG" }); // OK:seulement club
updatePlayer(1, { rating: 99 }); // ERREUR:rating n'existe pas sur Player
```

---

## 2) REQUIRED : TOUT DEVIENT OBLIGATOIRE

```ts
interface DraftPlayer {
 name: string;
 goals?: number;
 club?: string;
}

// version finale où tout doit être renseigné
type ConfirmedPlayer = Required<DraftPlayer>;
// {
//  name: string
//  goals: number   <- plus de ?
//  club: string   <- plus de ?
// }

// utile pour valider qu'une entité est complète avant de la persister
function savePlayer(player: Required<DraftPlayer>): void {
 // on sait que tout est là
}
```

---

## 3) PICK : SÉLECTIONNER DES PROPRIÉTÉS

```ts
interface Player {
 id: number;
 name: string;
 goals: number;
 salary: number; // donnée sensible
 privatePhone: string; // donnée sensible
}

// profil public : seulement ce qu'on affiche
type PublicProfile = Pick<Player, "id" | "name" | "goals">;
// {
//  id: number
//  name: string
//  goals: number
// }

function getPublicProfile(player: Player): PublicProfile {
 return {
  id: player.id,
  name: player.name,
  goals: player.goals,
  // salary et privatePhone ne passent pas:TS le garantit
 };
}
```

---

## 4) OMIT : EXCLURE DES PROPRIÉTÉS

```ts
interface Player {
 id: number;
 name: string;
 goals: number;
 salary: number;
}

// tout sauf l'id (pour la création, avant que la DB génère un id)
type CreatePlayerPayload = Omit<Player, "id">;
// {
//  name: string
//  goals: number
//  salary: number
// }

// tout sauf les données sensibles
type SafePlayer = Omit<Player, "salary">;

// Omit avec plusieurs clés
type MinimalPlayer = Omit<Player, "salary" | "id">;
```

`Pick` et `Omit` sont les deux faces d'une même pièce. Pick dit ce qu'on garde. Omit dit ce qu'on enlève. Pour beaucoup de champs à garder : Omit. Pour peu de champs à garder : Pick.

---

## 5) RECORD : CRÉER UN TYPE DICTIONNAIRE

```ts
// Record<K, V> = un objet dont les clés sont de type K et les valeurs de type V
type ClubRecord = Record<string, Player[]>;

const ligue1: ClubRecord = {
 PSG: [{ id: 1, name: "Mbappé", goals: 35, salary: 1000000 }],
 Lyon: [{ id: 2, name: "Lacazette", goals: 12, salary: 400000 }],
};

// avec des clés union : parfait pour les config strictes
type Position = "attaquant" | "milieu" | "défenseur" | "gardien";
type TeamSheet = Record<Position, Player[]>;

const squad: TeamSheet = {
 attaquant: [],
 milieu: [],
 défenseur: [],
 gardien: [],
 // si tu oublies une position : erreur TS
};
```

```ts
// Record pour les dictionnaires de config
type ChakraType = "feu" | "eau" | "vent" | "terre" | "foudre";
type ChakraDamage = Record<ChakraType, number>;

const damages: ChakraDamage = {
 feu: 100,
 eau: 80,
 vent: 90,
 terre: 70,
 foudre: 120,
};
```

---

## 6) READONLY : GELER UN TYPE

```ts
interface Config {
 apiUrl: string;
 timeout: number;
}

type FrozenConfig = Readonly<Config>;
// {
//  readonly apiUrl: string
//  readonly timeout: number
// }

const config: FrozenConfig = {
 apiUrl: "https://api.myfunnyjs.dev",
 timeout: 5000,
};

config.timeout = 3000; // ERREUR TS : Cannot assign to 'timeout' because it is a read-only property
```

```ts
// ReadonlyArray : même idée pour les tableaux
const rankings: ReadonlyArray<string> = ["Messi", "Haaland", "Mbappé"];
rankings.push("Ronaldo"); // ERREUR : Property 'push' does not exist on type 'readonly string[]'
rankings[0] = "Ronaldo"; // ERREUR : Index signature in type 'readonly string[]' only permits reading
```

---

## 7) EXTRACT ET EXCLUDE : FILTRER DES UNIONS

```ts
type AllEvents = "goal" | "assist" | "yellowCard" | "redCard" | "substitution";

// Extract : garder seulement ce qui matche
type CriticalEvents = Extract<AllEvents, "goal" | "redCard">;
// "goal" | "redCard"

// Exclude : enlever ce qui matche
type NonCardEvents = Exclude<AllEvents, "yellowCard" | "redCard">;
// "goal" | "assist" | "substitution"
```

---

## 8) RETURNTTYPE ET PARAMETERS : INTROSPECTION DE FONCTIONS

```ts
function getPlayerStats(id: number, season: string) {
 return {
  goals: 31,
  assists: 12,
  rating: 8.5,
 };
}

// extraire le type de retour sans le réécrire
type Stats = ReturnType<typeof getPlayerStats>;
// { goals: number, assists: number, rating: number }

// extraire le type des paramètres
type GetStatsParams = Parameters<typeof getPlayerStats>;
// [id: number, season: string]

// utile quand tu veux wrapper une fonction existante
function cachedGetPlayerStats(
 ...args: Parameters<typeof getPlayerStats>
): ReturnType<typeof getPlayerStats> {
 // check cache, appelle getPlayerStats, retourne
}
```

---

## 9) COMBINER LES UTILITY TYPES

```ts
interface FullPlayerProfile {
 id: number;
 name: string;
 goals: number;
 salary: number;
 privatePhone: string;
 createdAt: Date;
 updatedAt: Date;
}

// payload pour créer un joueur : sans id ni dates (générés côté serveur), sans données sensibles
type CreatePlayerInput = Omit<
 FullPlayerProfile,
 "id" | "salary" | "privatePhone" | "createdAt" | "updatedAt"
>;
// { name: string, goals: number }

// payload de mise à jour : tout optionnel sauf l'id
type UpdatePlayerInput = Partial<Omit<FullPlayerProfile, "id">> & {
 id: number;
};
// { id: number, name?: string, goals?: number, ... }

// version publique readonly
type PublicPlayerView = Readonly<
 Pick<FullPlayerProfile, "id" | "name" | "goals">
>;
```

---

## 10) LE CAS QUI CASSE

```ts
// Partial ne descend pas en profondeur (shallow)
interface Team {
 name: string;
 stats: {
  wins: number;
  losses: number;
 };
}

type PartialTeam = Partial<Team>;
// {
//  name?: string
//  stats?: {     <- stats devient optionnel
//   wins: number   <- mais wins reste REQUIRED à l'intérieur
//   losses: number  <- idem
//  }
// }

const t: PartialTeam = {
 stats: { wins: 5 }, // ERREUR : losses manque:Partial n'a pas touché au nested object
};

// si tu veux un Partial profond, il faut le faire à la main ou utiliser une lib
type DeepPartial<T> = {
 [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
// (mapped types:prochain fichier)
```

---

## EXERCICES

## EXO 1 : le formulaire d'évasion de Michael Scofield
_~15 min_

Michael a un plan d'évasion avec 8 champs obligatoires. Le formulaire de saisie ne demande que `name`, `targetSection`, et `exitPoint`. Le draft peut avoir n'importe quelle combinaison. La version finale est en lecture seule une fois validée.

Définis :

- `EscapePlan` : le type complet (8+ propriétés)
- `EscapeFormInput` : seulement les 3 champs du formulaire
- `EscapeDraft` : toutes les propriétés optionnelles
- `FinalPlan` : version readonly

## EXO 2 : le classement du Ballon d'Or
_~20 min_

Le vote du Ballon d'Or a des joueurs avec `id`, `name`, `nationality`, `goals`, `assists`, `votesReceived`, `salary`. Le classement public affiche seulement `name`, `nationality`, `votesReceived`. L'admin voit tout.

Crée les types `PublicRanking` et `AdminView` en utilisant les utility types : sans réécrire les propriétés manuellement.

## EXO 3 : le cache de Trapsoul Radio
_~15 min_

La radio a des tracks avec `id`, `title`, `artist`, `duration`, `fileUrl`, `licenseKey`, `uploadedBy`. Le cache public ne stocke jamais `fileUrl` ni `licenseKey`. Le cache admin stocke tout en readonly.

Modélise les deux types de cache et une fonction `getCachedTrack<T>(id: string): T | undefined` générique sur le type de cache.

## EXO 4 : le dispatcher du camp de Rick
_~20 min_

Le camp a des événements de type `"attack" | "scavenge" | "rest" | "medical" | "guard"`. Chaque événement a une priorité (number) et un responsable (string).

- Crée `EventPriorityMap` avec `Record`
- Crée `CriticalEvents` qui exclut `"rest"` et `"scavenge"` avec `Exclude`
- Crée `EventLog` qui est un `Record<CriticalEvents, { count: number, lastOccurred: Date }>`

---

## RÉSUMÉ

`Partial` rend tout optionnel. `Required` rend tout obligatoire. `Pick` garde certaines clés. `Omit` en supprime. `Record` crée des dictionnaires typés. `Readonly` bloque la mutation au niveau des types. `Extract`/`Exclude` filtrent les unions. `ReturnType`/`Parameters` introspectent les fonctions. Ils se combinent : `Readonly<Pick<T, K>>`, `Partial<Omit<T, "id">>`. Le piège : `Partial` est shallow : il ne descend pas dans les objets imbriqués.
