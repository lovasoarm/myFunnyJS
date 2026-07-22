---
stability: intemporel
---

# MODULE PATTERN : ENCAPSULER, EXPOSER, CACHER
Temps de lecture ~8 min

Tu as un vestiaire de football. Dedans : les maillots, les crampons, les tactiques d'entraînement, les comptes bancaires du club. Tu ne donnes pas les clés à tout le monde. Tu exposes ce qui doit l'être. Tu caches le reste. C'est ça, le Module Pattern.

Sans encapsulation (séparation entre ce qui est public et ce qui est privé), chaque partie de ton codebase peut lire, modifier, ou casser une autre partie. C'est du code spaghetti en puissance. En prod, ça se passe mal.

Prérequis : `01_fundamentals` complet, notamment les closures (01/02_closure_trap.md) et les fonctions (01/03_functions).

---

## 1) LE PROBLÈME SANS MODULE PATTERN

```js
// variables balancées dans le scope global (accessible partout dans le programme)
let clubName = "Barça";
let budget = 500_000_000;
let secretTactics = "4-3-3 contre-attaque";

// n'importe quelle fonction peut lire ET modifier ces données
function anyFunction() {
 budget = 0; // oops:quelqu'un vient de ruiner le club
 secretTactics = ""; // oops:les tactiques fuitent
}
```

Le problème : **couplage (dépendance forte entre deux parties du code) global.**
Quand tout est accessible de partout, rien n'est protégé. Modifier une variable casse une autre fonction, dans un autre fichier, que personne ne relit.

---

## 2) LE MODULE PATTERN : IIFE + CLOSURE

Le Module Pattern classique combine deux mécanismes :

- **IIFE (Immediately Invoked Function Expression : fonction invoquée immédiatement)** : une fonction qui s'exécute toute seule à sa déclaration
- **closure** : les variables internes restent vivantes même après la fin de la fonction

```js
const ClubBarça = (() => {
 // --- PRIVÉ : personne n'y accède directement ---
 let budget = 500_000_000; // le coffre:invisible de l'extérieur
 let secretTactics = "4-3-3 contre-attaque"; // classé confidentiel

 const _validateTransfer = (amount) => {
  // préfixe _ = convention pour "privé, touche pas"
  return amount > 0 && amount <= budget;
 };

 // --- PUBLIC : ce qu'on expose volontairement ---
 return {
  getClubName: () => "FC Barcelona",

  transfer: (playerName, amount) => {
   if (!_validateTransfer(amount)) {
    throw new Error(
     `Transfert refusé : budget insuffisant ou montant invalide`,
    );
   }
   budget -= amount; // mutation contrôlée, uniquement via cette méthode
   return `${playerName} signé pour ${amount}M€`;
  },

  getBudget: () => budget, // lecture autorisée, modification interdite depuis l'extérieur
 };
})(); // les () à la fin : ça s'exécute immédiatement

// ce qui est accessible
console.log(ClubBarça.getClubName()); // "FC Barcelona"
console.log(ClubBarça.transfer("Yamal", 50)); // "Yamal signé pour 50M€"
console.log(ClubBarça.getBudget()); // 499_950_000

// ce qui est bloqué
console.log(ClubBarça.budget); // undefined:le coffre est fermé
console.log(ClubBarça.secretTactics); // undefined:les tactiques restent secrètes
ClubBarça._validateTransfer(100); // undefined:méthode interne, invisible
```

Diagramme :

```
IIFE s'exécute
  |
  +--> variables privées (budget, secretTactics, _validateTransfer)
  |     |
  |     | closure : elles restent en vie
  |     |
  +--> return { getClubName, transfer, getBudget }
          |
          | seuls ces éléments sont accessibles depuis l'extérieur
          v
       ClubBarça.transfer(...)  OK
       ClubBarça.budget     undefined
```

---

## 3) LE MODULE PATTERN AVEC PARAMÈTRES

Même pattern, mais configurable à l'initialisation :

```js
const createClub = (name, initialBudget) => {
 // factory de modules : chaque club a son propre scope privé
 let budget = initialBudget;
 let transfers = []; // historique privé des transferts

 return {
  name,

  sign: (player, fee) => {
   if (fee > budget) throw new Error(`${name} : fonds insuffisants`);
   budget -= fee;
   transfers.push({ player, fee }); // on mutate uniquement en interne
   return `${player} rejoint ${name}`;
  },

  getTransferHistory: () => [...transfers], // copie défensive:on donne une copie, pas la référence
  getBudget: () => budget,
 };
};

const psg = createClub("PSG", 800_000_000);
const om = createClub("OM", 100_000_000);

psg.sign("Mbappé", 180); // "Mbappé rejoint PSG"
om.sign("Payet", 15); // "Payet rejoint OM"

// chaque module a son propre état:ils ne partagent rien
console.log(psg.getBudget()); // 799_999_820
console.log(om.getBudget()); // 99_999_985
```

Chaque appel à `createClub` crée un **scope isolé**. `psg.budget` et `om.budget` ne sont pas la même variable. Elles vivent dans des closures séparées.

---

## 4) ESM : LE MODULE PATTERN NATIF

Avec les modules ES (ESM, disponibles nativement dans les navigateurs modernes et Node.js depuis 2019), l'encapsulation est built-in (intégrée directement dans le langage) :

```js
// club.js
let budget = 500_000_000; // privé : non exporté, inaccessible de l'extérieur

const _validateTransfer = (amount) => amount > 0 && amount <= budget;

export const getClubName = () => "FC Barcelona"; // public : exporté explicitement

export const transfer = (player, amount) => {
 if (!_validateTransfer(amount)) throw new Error("Transfert refusé");
 budget -= amount;
 return `${player} signé`;
};
```

```js
// main.js
import { getClubName, transfer } from "./club.js";

console.log(getClubName()); // "FC Barcelona"
console.log(transfer("Pedri", 80)); // "Pedri signé"

// budget est inaccessible ici:il n'est pas exporté
```

Pas besoin d'IIFE. Le fichier lui-même est le module. Ce qui n'est pas `export` est privé.

---

## 5) LE PIÈGE DE LA RÉFÉRENCE EXPOSÉE

```js
const createTeam = () => {
 const players = ["Ter Stegen", "Araújo", "Pedri"];

 return {
  // DANGER : on retourne la référence directe au tableau
  getPlayersDangerous: () => players,

  // SAFE : on retourne une copie:l'état interne ne peut pas être muté de l'extérieur
  getPlayersSafe: () => [...players],
 };
};

const team = createTeam();

// via la méthode dangereuse
const roster = team.getPlayersDangerous();
roster.push("Hacker FC"); // mutation de l'état interne du module:le tableau original est modifié

// via la méthode safe
const roster2 = team.getPlayersSafe();
roster2.push("Still Hacker"); // ne touche pas au tableau interne:c'est une copie
```

Exposer une référence directe à un objet ou tableau interne, c'est ouvrir une backdoor (porte dérobée) dans ton encapsulation.

---

## EXERCICES

**EXO 1 : Le vestiaire de Naruto**
Le village caché de Konoha a un registre secret de ninjas : leurs chakra levels, leurs jutsus confidentiels, leur statut ANBU (classé top secret). Construis un module `KonohaRegistry` qui expose uniquement `getNinjaCount()`, `recruitNinja(name, rank)`, et `getPublicRoster()`. Les chakra levels et les jutsus ne doivent jamais être accessibles depuis l'extérieur. Teste que toute tentative d'accès direct retourne `undefined`.

**EXO 2 : La supply chain de Walter White**
Walter a un module de gestion de stock. La v1 expose directement `inventory` comme propriété publique. T-Bag a déjà utilisé ça pour modifier le stock sans passer par les validations. Refactorise en Module Pattern : `addStock(item, quantity)`, `removeStock(item, quantity)`, `getInventoryReport()`. Les mutations du stock passent toutes par les validations internes. T-Bag ne touche plus à rien.

**EXO 3 : Le bug de la référence**
Tu as ce module : `const createRoster = () => { const squad = []; return { add: p => squad.push(p), get: () => squad }; }`. Démontre le bug de la référence exposée. Corrige-le. Explique dans un commentaire pourquoi `[...squad]` est la bonne réponse.

---

## RÉSUMÉ

Le Module Pattern, c'est une frontière. Dedans : tout ce qui est interne, mutable, confidentiel. Dehors : une surface d'API (interface de programmation) contrôlée, intentionnelle. Le code qui casse en prod le fait souvent parce que deux parties du système se touchent alors qu'elles ne devraient pas se voir. L'encapsulation coupe ce canal. Avec ESM, tu l'as gratuitement via `export`. Sans ESM, tu le construis avec une closure.
