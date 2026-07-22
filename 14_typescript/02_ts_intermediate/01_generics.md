---
stability: perissable_2027
---

# GENERICS : ÉCRIRE UNE FOIS, UTILISER POUR N'IMPORTE QUEL TYPE
Temps de lecture ~10 min

Tu as une fonction qui trie des joueurs de foot. Une autre qui trie des tracks SZA. Une autre qui trie des ninjas. Le code est identique. Seul le type change. Sans les generics, tu copies-colles. Avec les generics, tu écris une fois et c'est fini.

C'est pas de la magie : c'est du paramétrage de type. Comme un paramètre de fonction, mais pour les types.

---

## 1) LE PROBLÈME QUE LES GENERICS RÉSOLVENT

Sans generics, tu as deux options : `any` (qui désactive TS et te protège de rien) ou dupliquer le code (qui te tue à la maintenance).

```ts
// sans generics : version any = TS en mode spectateur
function getFirst(arr: any[]): any {
 return arr[0];
 // TS ne sait pas ce que tu récupères
 // il va pas te dire si tu appelles .toUpperCase() sur un number
}

// résultat : ton editor te ment
const result = getFirst([10, 20, 30]);
result.toUpperCase(); // TS dit ok:runtime dit TypeError
```

```ts
// avec generics : TS suit le type d'entrée jusqu'à la sortie
function getFirst<T>(arr: T[]): T {
 return arr[0];
 // T est une variable de type:elle se fixe à l'appel
}

const score = getFirst([10, 20, 30]); // T = number, score est number
const player = getFirst(["Messi", "Ronaldo"]); // T = string, player est string
score.toUpperCase(); // ERREUR de compilation : parfait, c'est ce qu'on veut
```

---

## 2) SYNTAXE DE BASE

```ts
// une variable de type entre chevrons
function identity<T>(value: T): T {
 return value;
}

// plusieurs variables de type
function pair<A, B>(a: A, b: B): [A, B] {
 return [a, b];
}

// inférence : TS devine T tout seul si possible
const x = identity(42); // T inféré = number
const y = identity("Bryson"); // T inféré = string

// ou tu le précises manuellement si TS n'arrive pas à deviner
const z = identity<boolean>(true);
```

---

## 3) GENERICS SUR LES INTERFACES ET TYPES

```ts
// une interface générique pour une réponse API
interface ApiResponse<T> {
 data: T;
 status: number;
 timestamp: string;
}

// interface pour un joueur de foot
interface Player {
 name: string;
 goals: number;
}

// tu l'utilises avec le bon type
const response: ApiResponse<Player> = {
 data: { name: "Mbappé", goals: 31 },
 status: 200,
 timestamp: "2026-03-15",
};

// et TS sait que response.data.goals est un number
// il te prévient si tu essaies d'accéder à .tracks (qui existe sur un track, pas un player)
```

```ts
// generic pour une pile (stack):on en a parlé en module 09
interface Stack<T> {
 push(item: T): void;
 pop(): T | undefined;
 peek(): T | undefined;
 size: number;
}

class NinjaStack<T> implements Stack<T> {
 private items: T[] = [];

 push(item: T): void {
  this.items.push(item);
 }

 pop(): T | undefined {
  return this.items.pop();
 }

 peek(): T | undefined {
  return this.items[this.items.length - 1];
 }

 get size(): number {
  return this.items.length;
 }
}

const chakraStack = new NinjaStack<number>();
chakraStack.push(100);
chakraStack.push(200);
chakraStack.pop(); // retourne 200:TS sait que c'est un number
```

---

## 4) CONTRAINTES SUR LES GENERICS

Parfois T peut être n'importe quoi, mais toi t'as besoin qu'il ait certaines propriétés. C'est là qu'on ajoute une contrainte avec `extends`.

```ts
// sans contrainte : TS ne sait pas si T a une propriété name
function getPlayerName<T>(player: T): string {
 return player.name; // ERREUR : Property 'name' does not exist on type 'T'
}

// avec contrainte : on dit que T doit avoir au minimum une propriété name
function getPlayerName<T extends { name: string }>(player: T): string {
 return player.name; // OK
}

// ça marche avec n'importe quel objet qui a un name
getPlayerName({ name: "Levi", rank: "capitaine" }); // OK
getPlayerName({ name: "Messi", goals: 31 }); // OK
getPlayerName({ goals: 31 }); // ERREUR : name manque
```

```ts
// contrainte avec une interface
interface HasId {
 id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
 return items.find((item) => item.id === id);
}

const ninjas = [
 { id: 1, name: "Naruto", chakra: 1000 },
 { id: 2, name: "Sasuke", chakra: 800 },
];

const found = findById(ninjas, 1); // T = { id: number, name: string, chakra: number }
found?.name; // TS sait que c'est un string
```

---

## 5) GENERICS AVEC PLUSIEURS CONTRAINTES

```ts
// K extends keyof T : K doit être une clé qui existe sur T
// c'est un des patterns les plus utiles en TS
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
 return obj[key];
 // T[K] = le type de la valeur à la clé K dans T
}

const player = { name: "Ronaldo", goals: 450, club: "Al-Nassr" };

const name = getProperty(player, "name"); // string
const goals = getProperty(player, "goals"); // number
getProperty(player, "rating"); // ERREUR : "rating" n'existe pas sur ce type
```

---

## 6) GENERICS SUR LES FONCTIONS UTILITAIRES

```ts
// filter typé : même signature que Array.filter mais plus explicite
function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
 return arr.filter(predicate);
}

// map typé : T en entrée, U en sortie
function transform<T, U>(arr: T[], mapper: (item: T) => U): U[] {
 return arr.map(mapper);
}

const players = [
 { name: "Messi", goals: 31 },
 { name: "Haaland", goals: 28 },
 { name: "Mbappé", goals: 35 },
];

// T = { name: string, goals: number }
const topScorers = filter(players, (p) => p.goals > 29);

// T = { name: string, goals: number }, U = string
const names = transform(players, (p) => p.name);
// names est string[]:TS a suivi la transformation
```

---

## 7) LE CAS QUI CASSE

```ts
// piège : utiliser any comme T
function broken<T>(a: T, b: any): T {
 return b; // TS accepte parce que any est assignable à tout
 // mais en runtime, b peut être n'importe quoi
}

const result = broken<number>("naruto", { goals: 31 });
// TS dit que result est number
// result est en réalité un objet
// bonjour les erreurs runtime introuvables
```

```ts
// piège : assumer que T[] a des méthodes de number
function sum<T>(arr: T[]): number {
 return arr.reduce((acc, val) => acc + val, 0);
 // ERREUR : + n'est pas garanti sur T
}

// correct : contraindre T
function sum<T extends number>(arr: T[]): number {
 return arr.reduce((acc, val) => acc + val, 0);
}
```

---

## EXERCICES

## EXO 1 : le cache générique de Levi
_~15 min_

Le bataillon de Levi a besoin d'un système de cache universel. Il stocke des plans d'attaque (objets), des coordonnées (numbers), des noms de cibles (strings). Le même cache, le même code, des types différents.

Implémente une classe `Cache<T>` avec :

- `set(key: string, value: T): void`
- `get(key: string): T | undefined`
- `has(key: string): boolean`
- `clear(): void`

Contrainte : pas de `any` ou `object` dans l'implémentation.

## EXO 2 : le pipeline de transformation
_~20 min_

Walter White optimise sa supply chain. Il a des données brutes qui passent par plusieurs étapes de transformation.

Écris une fonction `pipe<T, U, V>(input: T, step1: (a: T) => U, step2: (b: U) => V): V` qui chaîne deux transformations.

Test avec :

- step1 : `(player: Player) => player.goals`
- step2 : `(goals: number) => goals > 30 ? "Ballon d'Or" : "Candidat"`

TS doit inférer le type de sortie final sans que tu le précises.

## EXO 3 : le détecteur de propriété
_~20 min_

Le système d'inventaire du camp de Rick Grimes a besoin d'une fonction générique qui extrait plusieurs propriétés d'un objet en une seule fois.

Écris `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>`.

(indice : `Pick<T, K>` est un utility type natif TS : ici tu le réimplémente toi-même avec un generic contraint)

## EXO 4 : le comparateur de la Ligue des Champions
_~25 min_

La Ligue des Champions a besoin de trier n'importe quelle collection par n'importe quelle propriété numérique.

Écris `sortBy<T>(arr: T[], key: keyof T): T[]` avec la contrainte que `T[key]` soit un number.

(indice : `T extends Record<K, number>` peut aider : ou bien une approche avec `as number` après un check runtime)

---

## RÉSUMÉ

Les generics paramètrent les types comme les fonctions paramètrent les valeurs. `T` se fixe à l'appel, TS suit le type d'entrée jusqu'à la sortie. `extends` contraignent ce que T peut être. `keyof T` donne les clés d'un type. Le résultat : du code réutilisable sans perdre la sécurité de typage. Le piège classique : mélanger `any` avec les generics et détruire l'intérêt de l'exercice.
