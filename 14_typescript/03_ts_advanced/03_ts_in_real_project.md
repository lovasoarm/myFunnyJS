---
stability: perissable_2027
---

# TS DANS UN VRAI PROJET : CONFIG, MIGRATION, BOUNDARIES, DÉCISIONS
Temps de lecture ~11 min

Les fichiers précédents t'ont montré les features de TS. Ce fichier te montre comment les utiliser ensemble sur un vrai projet : comment configurer `tsconfig.json`, comment migrer du JS progressivement, où tracer les frontières de typage, et quelles décisions prendre face aux compromis réels.

TS en prod n'est pas TS dans un tuto. Les contraintes changent tout.

---

## 1) TSCONFIG.JSON : LES OPTIONS QUI COMPTENT

```json
{
 "compilerOptions": {
  // target : vers quelle version JS TS compile
  "target": "ES2022",
  // ES2022 en 2026 = safe:tu as les features récentes sans polyfills inutiles

  // module : format des modules générés
  "module": "NodeNext",
  // NodeNext = support natif ESM en Node + respect des .mjs / .cjs

  "moduleResolution": "NodeNext",
  // doit matcher module quand tu utilises NodeNext

  // strict : active tout le mode strict d'un coup
  "strict": true,
  // active : strictNullChecks, strictFunctionTypes, noImplicitAny,
  //     strictBindCallApply, strictPropertyInitialization, noImplicitThis

  // strictNullChecks : null et undefined sont des types séparés
  // sans ça : string et string | null sont interchangeables:tu perds 50% de l'intérêt de TS

  // noImplicitAny : TS refuse d'inférer any:tu dois typer explicitement
  // sans ça : TS te laisse glisser vers any silencieusement

  "outDir": "./dist",
  "rootDir": "./src",

  // paths : alias d'import
  "paths": {
   "@/*": ["./src/*"]
  },
  // tu importes "@/utils/player" au lieu de "../../utils/player"

  "declaration": true,
  // génère les .d.ts:nécessaire si tu publies une lib

  "sourceMap": true,
  // sourcemaps pour debugger le TS original depuis le JS compilé

  // recommandé pour les projets Node
  "esModuleInterop": true,
  "forceConsistentCasingInFileNames": true,
  "skipLibCheck": false
  // skipLibCheck: true accélère la compilation mais cache des conflits de types dans les deps
 },
 "include": ["src/**/*"],
 "exclude": ["node_modules", "dist"]
}
```

---

## 2) OPTIONS STRICT : CE QU'ELLES FONT VRAIMENT

```ts
// noImplicitAny en action
function process(data) { ... }
// ERREUR avec noImplicitAny : Parameter 'data' implicitly has an 'any' type.
// TS refuse que tu ignores un type par omission

// strictNullChecks en action
function getPlayer(id: number): Player {
 // si la DB ne trouve rien, on retourne null
 return null // ERREUR : null n'est pas assignable à Player
}

function getPlayer(id: number): Player | null { ... } // correct

// strictPropertyInitialization en action
class PlayerService {
 private cache: Map<number, Player>
 // ERREUR : cache n'est pas initialisé dans le constructeur

 constructor() {
  // si on ne fait pas this.cache = new Map() ici, TS se plaint
  this.cache = new Map() // correct
 }
}
```

---

## 3) MIGRER DU JS VERS TS : LA STRATÉGIE PROGRESSIVE

La migration brutale (tout convertir d'un coup) est risquée. La migration progressive est la vraie approche en prod.

```
PHASE 1 : préparation
├── ajouter tsconfig.json avec allowJs: true, checkJs: false
├── renommer les fichiers critiques de .js à .ts un par un
└── garder les autres en .js : TS les ignore

PHASE 2 : typage de la surface
├── typer les interfaces et types de données d'abord
├── typer les fonctions publiques (APIs internes)
└── laisser any temporairement sur les entrailles

PHASE 3 : élimination des any
├── activer noImplicitAny
├── remplacer les any par de vrais types
└── ajouter les type guards sur les données externes

PHASE 4 : strict complet
└── activer strict: true : corriger ce qui casse
```

```ts
// technique : any temporaire avec TODO
function processLegacyData(data: any): ProcessedData {
 // TODO: typer correctement:ticket #234
 return data as ProcessedData;
}

// au moins tu sais où regarder quand tu reviens dessus
// `grep "TODO: typer" src/` te donne la liste complète
```

---

## 4) BOUNDARIES : OÙ TYPER STRICTEMENT ET OÙ LAISSER DE LA FLEXIBILITÉ

```
Frontières du système (typer avec rigueur maximale) :
├── données entrantes : API, formulaires, fichiers JSON, WebSockets
├── données sortantes : réponses HTTP, données persistées
└── interfaces entre modules

Intérieur du module (typer avec pragmatisme) :
├── variables locales → laisser TS inférer
├── fonctions pures internes → inférence souvent suffisante
└── logique de transformation → se fier aux types d'entrée/sortie
```

```ts
// boundary : réponse API:typer et valider
async function fetchPlayer(id: number): Promise<Player> {
 const res = await fetch(`/api/players/${id}`);
 const raw: unknown = await res.json();

 if (!isPlayer(raw)) {
  throw new TypeError(`Invalid player data: ${JSON.stringify(raw)}`);
 }

 return raw; // TS sait que c'est Player
}

// intérieur : laisser inférer
function computePoints(player: Player) {
 const base = player.goals * 3; // TS infère number
 const bonus = player.assists; // TS infère number
 const total = base + bonus; // TS infère number
 return total; // TS infère number:pas besoin de typer le retour
}
```

---

## 5) DÉCISIONS DIFFICILES EN VRAI PROJET

### Quand utiliser `as` (type assertion)

```ts
// as = "crois-moi TS, je sais ce que je fais"
// c'est un contrat oral:si tu mens, les bugs arrivent à runtime

// acceptable : quand tu viens de valider manuellement
const raw: unknown = JSON.parse(data);
if (isPlayer(raw)) {
 const player = raw; // TS sait déjà:pas besoin de as
}

// acceptable : quand tu construis une valeur progressivement
const partial = {} as Player; // dangereux:aucune garantie que les champs seront remplis
// préférer : const partial: Partial<Player> = {}

// inacceptable : pour faire taire TS sans comprendre pourquoi il se plaint
const score = getScore() as number; // si TS pense que c'est string | number, il a peut-être raison
```

### Quand utiliser `any`

```ts
// jamais en premier réflexe
// parfois inévitable : libs sans types, code legacy, prototypage rapide

// avec unknown plutôt que any quand possible
function processExternal(data: unknown): string {
 // unknown force la validation avant utilisation
 // any laisse tout passer
}

// avec any explicitement commenté
function legacyBridge(data: any): void {
 // any ici : lib externe sans types:attendre @types/libname v3.2
 // issue créée : github.com/.../issues/1234
}
```

### Interfaces vs Types

```ts
// interface : préférable pour les objets et les classes
interface Player {
 name: string;
 goals: number;
}

// type : nécessaire pour les unions, intersections, primitifs, tuples
type EventType = "goal" | "card" | "substitution";
type Coordinate = [number, number];
type PlayerOrTeam = Player | Team;

// les deux peuvent être étendus:différemment
interface AdminPlayer extends Player {
 permissions: string[];
}

type AdminPlayer = Player & { permissions: string[] };

// déclaration merging : seulement avec interface
// utile pour étendre des types de libs externes
interface Window {
 analytics: Analytics; // ajoute analytics à la Window globale
}
```

---

## 6) ORGANISATION DES TYPES DANS UN PROJET

```
src/
├── types/
│  ├── index.ts    <- re-export de tous les types publics
│  ├── player.ts   <- Player, PlayerStats, PlayerUpdate
│  ├── match.ts    <- Match, MatchEvent, MatchResult
│  └── api.ts     <- ApiResponse, ApiError, PaginatedResponse
├── utils/
│  ├── typeGuards.ts <- isPlayer, isMatch, isApiError
│  └── validators.ts <- validatePlayer, validateMatchEvent
└── services/
  └── playerService.ts
```

```ts
// types/api.ts:types partagés pour toutes les réponses API
export interface ApiResponse<T> {
 data: T;
 status: number;
 timestamp: string;
}

export interface ApiError {
 code: string;
 message: string;
 details?: Record<string, string>;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// types/player.ts
export interface Player {
 id: number;
 name: string;
 goals: number;
}

export type CreatePlayerInput = Omit<Player, "id">;
export type UpdatePlayerInput = Partial<Omit<Player, "id">> & { id: number };
export type PublicPlayer = Pick<Player, "id" | "name" | "goals">;
```

---

## 7) DÉCLARATION FILES : TYPER DU JS EXISTANT

```ts
// si une lib n'a pas de types (@types/libname n'existe pas)
// tu crées un fichier .d.ts dans src/types/

// legacy-lib.d.ts
declare module "legacy-football-stats" {
 export interface StatsResult {
  playerName: string;
  totalGoals: number;
  season: string;
 }

 export function fetchStats(playerId: string): Promise<StatsResult>;
 export function formatStats(stats: StatsResult): string;
}

// maintenant tu importes la lib avec des types
import { fetchStats } from "legacy-football-stats";
const result = await fetchStats("messi-1");
result.totalGoals; // TS sait que c'est number
```

---

## 8) LE CAS QUI CASSE EN VRAI PROJET

```ts
// enum en runtime vs const enum
enum Position {
 Attaquant = "attaquant",
 Milieu = "milieu",
 Defenseur = "défenseur",
}
// enum génère du JS à runtime:Position est un objet en mémoire
// peut causer des problèmes en tree-shaking et avec les ESM

// préférer : union de string literals + const object
const Position = {
 Attaquant: "attaquant",
 Milieu: "milieu",
 Defenseur: "défenseur",
} as const;

type Position = (typeof Position)[keyof typeof Position];
// "attaquant" | "milieu" | "défenseur":type union pur, pas de runtime overhead
```

```ts
// type assertion double (le double as)
const evil = unknownValue as unknown as Player;
// contourne toutes les vérifications TS:si tu vois ça dans un codebase, c'est une dette

// structuredClone perd les types
const clone = structuredClone(player);
// clone est typed Player par TS, mais en runtime les méthodes de classe sont perdues
// si Player est une classe avec méthodes : clone.calculateRating() risque de throw
```

---

## EXERCICES

## EXO 1 : la config du projet Trapsoul Radio
_~20 min_

Écris un `tsconfig.json` pour un projet Node.js avec Express + TS. Justifie chaque option que tu mets. Active `strict`. Configure les paths pour `@/` → `src/`. Configure `declaration: true` (le package sera publié en interne).

## EXO 2 : les boundaries du projet Prison Break API
_~20 min_

Le serveur reçoit des corps de requête depuis Express. `req.body` est typé `any` par défaut. Définis les types `CreatePrisonerInput`, `UpdatePrisonerInput`, `PrisonerResponse`. Écris les type guards pour valider `req.body` avant utilisation.

Écris un middleware Express `validateBody<T>(guard: (v: unknown) => v is T)` qui valide et type `req.body`.

## EXO 3 : la migration du camp de Rick
_~25 min_

Le camp a un fichier `inventory.js` avec 200 lignes non typées. Il y a un `Item` (avec `id`, `name`, `quantity`, `category`), un `Inventory` (liste d'items + fonctions de recherche), et des erreurs custom.

Planifie la migration en 3 phases. Écris les types de base, le type guard `isItem`, et montre comment le fichier `.js` peut coexister avec le `.ts` pendant la transition.

## EXO 4 : le type global du projet oracle_glitch
_~25 min_

Le projet `oracle_glitch` utilise Anthropic SDK (qui a des types) + une lib de parsing maison sans types. Crée un fichier `custom-parser.d.ts` qui déclare les types de la lib maison : `parse(raw: string): ParseResult`, `ParseResult` avec `tokens: Token[]`, `errors: string[]`, `Token` avec `type` et `value`.

---

## RÉSUMÉ

`tsconfig.json` : `strict: true` en premier, `target` et `module` selon ton runtime. La migration progressive passe par `allowJs: true`, puis le typage de la surface, puis l'élimination des `any`. Les boundaries du système (API, formulaires, JSON externe) demandent le typage le plus rigoureux. `as` est acceptable après une validation manuelle : inacceptable pour faire taire TS sans comprendre. Les interfaces pour les objets, les types pour les unions et les compositions. Les `.d.ts` pour typer du JS externe sans types. Préfère les unions de string literals aux enums pour éviter le runtime overhead.
