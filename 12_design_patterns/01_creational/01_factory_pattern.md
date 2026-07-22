---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# FACTORY PATTERN
Temps de lecture ~10 min

T'as jamais remarqué que dans Naruto, le Hokage ne forge pas lui-même chaque ninja ?
Il appelle un système. Le système sait quoi créer selon le rang, le clan, les capacités.
Toi, t'as juste dit "donne-moi un ninja Chunin" : comment il a été fabriqué, t'en sais rien. Et c'est exactement ça, le Factory pattern.

La Factory, c'est déléguer la création d'objets à une fonction ou une classe dédiée.
Tu ne fais pas `new NinjaChunin(params)` partout dans ton code.
Tu appelles une factory, elle t'en retourne un, prêt à l'emploi.

Résultat : ton code ne dépend plus d'une implémentation concrète.
Il dépend d'une interface. Et ça, en prod, ça change tout.

---

## 1) LE PROBLÈME QUE FACTORY RÉSOUT

Sans factory, chaque fois que tu crées un objet, t'es obligé de connaître sa classe exacte.

```js
// sans factory : couplage fort, répétition, fragilité
const leon = new KnightGold({ name: "Leon", armor: "Garo", power: 95 });
const rei = new KnightSilver({ name: "Rei", armor: "Zero", power: 88 });
const kouga = new KnightGold({ name: "Kouga", armor: "Garo", power: 92 });
```

Trois `new` différents. Trois imports différents. Trois endroits à modifier si la structure change.
Si demain `KnightGold` prend un param de plus, tu chasses tous les `new KnightGold` dans tout le codebase.

C'est pas un problème dans un fichier de 50 lignes.
C'est une catastrophe dans un projet de 200 fichiers.

---

## 2) FACTORY FUNCTION : LA VERSION SIMPLE

```js
// la factory : un seul endroit qui sait comment créer un Chevalier
function createKnight(rank, name, armorName, power) {
 // chaque rang a ses propres règles de création
 // l'appelant n'a pas à le savoir

 const baseStats = {
  gold: { maxArmorTime: 99.9, title: "Makai Knight Gold" },
  silver: { maxArmorTime: 99.9, title: "Makai Knight Silver" },
  bronze: { maxArmorTime: 30, title: "Makai Knight Bronze" },
 };

 const rankStats = baseStats[rank];

 if (!rankStats) {
  // fail-fast : un rang inconnu ne passe pas
  throw new Error(
   `Rang inconnu : ${rank}. Leon s'en sortirait mieux que toi.`,
  );
 }

 return {
  name,
  rank,
  armor: armorName,
  power,
  ...rankStats,
  // méthode générée selon le rang : pas exposée dans l'appelant
  summonArmor() {
   console.log(
    `${name} invoque ${armorName} : durée max : ${rankStats.maxArmorTime}s`,
   );
  },
 };
}

// l'appelant ne sait rien de la logique interne
const leon = createKnight("gold", "Leon", "Garo", 95);
const rei = createKnight("silver", "Rei", "Zero", 88);
const kouga = createKnight("gold", "Kouga", "Garo", 92);

leon.summonArmor();
// Leon invoque Garo:durée max : 99.9s
```

Un seul endroit crée des Chevaliers.
Demain tu changes les règles ? Tu touches la factory, pas les 40 endroits qui l'appellent.

---

## 3) FACTORY CLASS : QUAND C'EST PLUS COMPLEXE

Quand la logique de création doit être partagée, configurée, ou mockée dans les tests : on passe à une classe.

```js
class NinjaFactory {
 constructor(village) {
  // la factory est configurée pour un contexte précis
  this.village = village;
  this.createdCount = 0;
 }

 create(name, rank, jutsus = []) {
  this.createdCount++;

  // logique interne : rang valide ? village reconnu ?
  const allowedRanks = ["genin", "chunin", "jonin", "kage"];
  if (!allowedRanks.includes(rank)) {
   throw new Error(`Rang ${rank} n'existe pas au village ${this.village}`);
  }

  // on assemble l'objet : l'appelant ne voit pas cette cuisine
  return {
   id: `${this.village}-${this.createdCount}`,
   name,
   rank,
   village: this.village,
   jutsus,
   chakra: this._baseChakra(rank),
  };
 }

 _baseChakra(rank) {
  // méthode privée : personne n'appelle ça de l'extérieur
  const chakraMap = { genin: 100, chunin: 250, jonin: 500, kage: 1000 };
  return chakraMap[rank];
 }
}

const konohaFactory = new NinjaFactory("Konoha");

const naruto = konohaFactory.create("Naruto", "jonin", [
 "rasengan",
 "shadow_clone",
]);
const sakura = konohaFactory.create("Sakura", "jonin", ["medical_ninjutsu"]);

console.log(naruto);
// { id: "Konoha-1", name: "Naruto", rank: "jonin", village: "Konoha", jutsus: [...], chakra: 500 }
```

La factory encapsule les règles métier.
Si les règles changent, c'est dans la factory, nulle part ailleurs.

---

## 4) ABSTRACT FACTORY : FAMILLES D'OBJETS LIÉS

L'Abstract Factory crée des familles entières d'objets compatibles entre eux.
Exemple : un match de Champions League génère des événements différents selon la phase (phase de groupes vs finale).

```js
// chaque "factory" produit une famille cohérente d'objets liés
function createMatchFactory(phase) {
 const factories = {
  group: {
   createMatch: (home, away) => ({
    type: "group",
    home,
    away,
    points: { win: 3, draw: 1, loss: 0 },
    extraTime: false,
   }),
   createStats: () => ({
    track: ["goals", "possession", "shots"],
    xG: true,
    heatmap: false, // pas en phase de groupes
   }),
  },

  final: {
   createMatch: (home, away) => ({
    type: "final",
    home,
    away,
    points: null, // pas de points en finale
    extraTime: true,
    penaltyShootout: true,
   }),
   createStats: () => ({
    track: ["goals", "possession", "shots", "pressures", "duels"],
    xG: true,
    heatmap: true, // tout est tracé en finale
   }),
  },
 };

 if (!factories[phase]) throw new Error(`Phase inconnue : ${phase}`);
 return factories[phase];
}

// l'appelant reçoit une famille complète : match + stats cohérents entre eux
const groupFactory = createMatchFactory("group");
const match = groupFactory.createMatch("PSG", "Man City");
const stats = groupFactory.createStats();

// impossible de mélanger un match de finale avec des stats de groupe
// la factory garantit la cohérence
```

```
createMatchFactory("group")
    |
    +--> createMatch() --> objet match phase de groupes
    |
    +--> createStats() --> stats adaptées aux groupes

createMatchFactory("final")
    |
    +--> createMatch() --> objet match avec prolongations
    |
    +--> createStats() --> stats complètes avec heatmap
```

---

## 5) CAS QUI CASSE

```js
// piège classique : factory qui fait trop
function createEverything(type, ...args) {
 if (type === "ninja") return new Ninja(...args);
 if (type === "horror") return new Horror(...args);
 if (type === "knight") return new Knight(...args);
 if (type === "village") return new Village(...args);
 if (type === "jutsu") return new Jutsu(...args);
 // ... 30 autres cas
}
```

C'est une factory qui viole le SRP : elle crée tout, elle ne spécialise rien.
À chaque nouveau type, tu touches cette fonction. Elle grossit indéfiniment.

Règle : une factory couvre un domaine cohérent. Pas tout le projet.
Si tu te retrouves avec 15 `if/else` dans ta factory : découpe.

```js
// correct : factories spécialisées
const ninjaFactory = createNinjaFactory(village);
const horrorFactory = createHorrorFactory(region);
const knightFactory = createKnightFactory(rank);
```

---

## 6) FACTORY EN TEST : LE VRAI BÉNÉFICE

```js
// en test, tu remplace la factory par une version contrôlée
// sans toucher au code métier qui appelle la factory

function runMission(knight, horrorFactory) {
 const horror = horrorFactory.create("Forest Horror", { power: 70 });
 return knight.fight(horror);
}

// en prod
runMission(leon, realHorrorFactory);

// en test : tu injectes une factory qui retourne exactement ce que tu veux
const mockHorrorFactory = {
 create: () => ({ name: "Mock Horror", power: 10, defeated: false }),
};
runMission(leon, mockHorrorFactory);
// le test contrôle exactement ce que la factory produit
```

C'est pour ça que la factory n'est pas juste un pattern de confort.
C'est une décision d'architecture qui rend le code testable.

---

## EXERCICES

## EXO 1 : LA FORGE DE JUTSU

Dans Naruto, chaque type de jutsu (technique) a des mécaniques différentes.
Le Rasengan demande du contrôle de chakra pur, le Chidori demande de la vitesse, le Henge transforme l'apparence.

Crée une `jutsuFactory` qui accepte un type parmi `"rasengan"`, `"chidori"`, `"henge"`, `"kage_bunshin"` et retourne un objet Jutsu avec :

- `name`, `type`, `chakraCost`, `effect`, et une méthode `cast()` qui log une phrase en fonction du type

Si le type est inconnu : throw une erreur avec un message fun.

(indice : commence par un objet de config par type, pas par des if/else en cascade)

---

## EXO 2 : L'USINE À TRACKS

La radio trapsoul de SZA et Bryson Tiller reçoit des tracks de plusieurs labels.
Chaque label a ses propres règles : format audio différent, durée max différente, métadonnées requises différentes.

Crée une `TrackFactory` (classe) qui :

- est instanciée avec un `label` parmi `"rca"`, `"def_jam"`, `"independent"`
- expose une méthode `createTrack(title, artist, durationSec)` qui valide les règles du label et retourne un objet track complet
- throw si la durée dépasse le max du label (`rca: 300s`, `def_jam: 240s`, `independent: 420s`)
- ajoute un `id` unique à chaque track créée

---

## EXO 3 : LA SUPPLY CHAIN DE WALTER

Walter White a trois types de livraisons : `"local"`, `"interstate"`, `"international"`.
Chaque type a ses propres règles de risque, de délai, et de coût.

Utilise l'Abstract Factory : crée une `createDeliveryFactory(type)` qui retourne un objet avec deux méthodes :

- `createDelivery(origin, destination, quantity)` : retourne un objet livraison avec les règles du type
- `createRiskAssessment()` : retourne un objet d'évaluation de risque adapté au type

Teste les trois types. Vérifie qu'un `international` a bien des règles différentes d'un `local`.

---

## EXO 4 : LE PIÈGE DU GOD FACTORY

Voici du code réel (mal écrit) :

```js
function createGameObject(
 type,
 name,
 level,
 team,
 weapon,
 armor,
 speed,
 magic,
 range,
) {
 if (type === "attacker")
  return { name, level, team, weapon, speed, attack: level * 10 };
 if (type === "defender")
  return { name, level, team, armor, defense: level * 8 };
 if (type === "mage")
  return { name, level, team, magic, spell_power: level * 12 };
 if (type === "ranger")
  return { name, level, team, weapon, range, precision: level * 9 };
}
```

Identifie les trois problèmes de ce code.
Réécris-le proprement en utilisant des factories spécialisées.
(pas de bonne réponse unique : justifie tes choix)

---

## RÉSUMÉ

La Factory déplace la responsabilité de création d'objets dans un endroit dédié : ton code appelant ne sait plus comment les objets sont fabriqués, juste ce qu'ils font.
Bénéfice immédiat : couplage faible, logique de création centralisée, testabilité maximale.
La version function convient pour des créations simples. La classe convient quand la factory doit être configurée ou partagée. L'Abstract Factory entre en jeu quand tu crées des familles d'objets qui doivent rester cohérentes entre elles.
Une factory qui fait tout n'est pas une factory : c'est un God Object avec un meilleur nom.
