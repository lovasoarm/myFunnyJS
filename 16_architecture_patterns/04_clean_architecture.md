---
stability: intemporel
---

# CLEAN ARCHITECTURE : LE DOMAINE AU CENTRE
Temps de lecture ~11 min

L'Armure de Garo ne dépend pas de la marque des bottes que León porte. Elle fonctionne, peu importe le reste. C'est ça la Clean Architecture : le domaine (les règles du métier) ne dépend de rien d'extérieur. Ni de la base de données. Ni du framework. Ni de l'API. Si tu changes de DB demain, le domaine ne bouge pas d'un pixel.

La question que ce pattern répond : comment écrire du code qui survit au changement d'outil ?

Prérequis : `03_mvc_pattern.md`, `12_design_patterns/02_structural/02_adapter_pattern.md`, `13_refactoring/02_solid_principles.md`.

> Ce module s'appuie sur le principe de Responsabilité Unique (SRP) et de découplage (couplage : degré de dépendance entre deux modules).
> La source de vérité pour SRP et couplage est `13_refactoring/02_solid_principles.md`.
> Ici on les applique à l'échelle d'un système entier. On ne les réexplique pas.

> Ce fichier construit directement sur `15_runtime_env`.
> Si tu ne sais pas encore comment Node gère les modules et pourquoi ESM et CJS coexistent :
> fais `15_runtime_env/01_node_vs_browser.md` + `15_runtime_env/03_commonjs_vs_esm.md` avant de continuer.

---

```
+----------------------------------------------+
|     Interface / Controllers       | <- adapte le monde externe au domaine
| +----------------------------------------+ |
| |    Use Cases / Application    | | <- orchestre les règles métier
| | +----------------------------------+ | |
| | |  Domain / Entities (coeur) | | | <- zéro dépendances externes
| | +----------------------------------+ | |
| +----------------------------------------+ |
|     Infrastructure / DB / API     | <- détails techniques, outils
+----------------------------------------------+

Règle unique : les flèches de dépendance pointent toujours vers le centre.
Domain ne connaît pas Infrastructure. Jamais.
Si tu changes de DB, le Domain ne bouge pas d'un pixel.
```

## 1) LE PROBLÈME : LE CODE QUI DÉPEND DE SES OUTILS

```js
// MAUVAIS : la logique métier dépend de la DB (base de données)
const addSurvivor = async (name, role) => {
 // validation mélangée avec du SQL:le métier connaît l'outil
 if (!name) throw new Error("Nom requis");

 const result = await db.query(
  // si tu changes de DB, tu réécrits cette fonction
  "INSERT INTO survivors (name, role) VALUES (?, ?)",
  [name, role],
 );
 return result.rows[0];
};
```

Si tu migres de MySQL vers MongoDB demain, tu modifies la logique métier. Une migration d'infrastructure casse ton domaine. C'est exactement ce que la Clean Architecture interdit.

---

## 2) LES COUCHES : LA RÈGLE DE DÉPENDANCE

```
+--------------------------------------------------+
|  FRAMEWORKS & DRIVERS (Express, MongoDB, React) |
|  +-----------------------------------------+   |
|  |  ADAPTERS (Controllers, Repositories) |   |
|  |  +----------------------------------+ |   |
|  |  |  USE CASES (Application Layer) | |   |
|  |  |  +---------------------------+ | |   |
|  |  |  |  ENTITIES (Domain)    | | |   |
|  |  |  |  règles pures, zéro dep | | |   |
|  |  |  +---------------------------+ | |   |
|  |  +----------------------------------+ |   |
|  +-----------------------------------------+   |
+--------------------------------------------------+

RÈGLE : les flèches de dépendance pointent TOUJOURS vers l'intérieur.
Le domaine ne connaît pas les adapters. Les adapters ne connaissent pas les frameworks.
```

**Entities (domaine)** : les règles métier pures. Aucune dépendance externe. Elles existent même si tu enlèves tout le reste.

**Use Cases (cas d'usage)** : les actions que l'application peut faire. Ils orchestrent les entities. Ils définissent des interfaces (contrats) pour ce dont ils ont besoin.

**Adapters** : convertissent les données du monde extérieur vers le format que le domaine attend : et vice-versa.

**Frameworks & Drivers** : Express, MongoDB, React. Ils sont aux bords. Remplaçables.

Le schéma précédent montre la structure statique (qui peut dépendre de qui). Mais une vraie requête HTTP, elle, traverse ces couches dans un ordre précis, à l'exécution :

```
requête HTTP entrante
 --> FRAMEWORK (Express reçoit la requête brute)
  --> ADAPTER : Controller (traduit HTTP en appel de use case)
   --> USE CASE (orchestre, appelle les entities, appelle le repository via son port)
    --> ENTITY (applique les règles métier pures : valide, calcule, décide)
   <-- USE CASE (retourne un résultat au controller)
  <-- ADAPTER : Controller (traduit le résultat en réponse HTTP)
 <-- FRAMEWORK (Express envoie la réponse)
réponse HTTP sortante
```

Remarque le mouvement : ça descend vers le domaine (`-->`), puis ça remonte (`<--`). Le domaine ne sait jamais qu'Express existe. Il reçoit des arguments simples, il retourne des résultats simples. Tout ce qui parle HTTP, SQL, ou JSON reste à l'extérieur de cette flèche descendante.

---

## 3) IMPLÉMENTATION : PRISON BREAK API

Contexte : Fox River. Des prisonniers. Des plans d'évasion. Une API.

```js
// =====================
// COUCHE 1 : ENTITIES (domaine pur)
// Aucun import. Aucune dépendance. Ce sont les règles qui définissent ce qu'est un prisonnier.
// =====================

class Prisoner {
 constructor({ id, name, blockId, escapeRisk }) {
  if (!name || typeof name !== "string")
   throw new TypeError("Nom de prisonnier invalide");
  if (escapeRisk < 0 || escapeRisk > 10)
   throw new RangeError("Risque d'évasion entre 0 et 10");

  this.id = id;
  this.name = name;
  this.blockId = blockId;
  this.escapeRisk = escapeRisk;
  this.status = "incarcerated";
 }

 isHighRisk() {
  return this.escapeRisk >= 8; // règle métier pure : aucun outil externe n'entre ici
 }

 transfer(newBlockId) {
  if (this.status !== "incarcerated") {
   throw new Error(
    `${this.name} ne peut pas être transféré : statut : ${this.status}`,
   );
  }
  return new Prisoner({ ...this, blockId: newBlockId }); // immuabilité : on retourne une nouvelle entity
 }
}

class EscapePlan {
 constructor({ id, createdBy, route, riskLevel }) {
  if (!Array.isArray(route) || route.length < 2) {
   throw new Error("Un plan d'évasion nécessite au moins 2 étapes");
  }
  this.id = id;
  this.createdBy = createdBy;
  this.route = route;
  this.riskLevel = riskLevel;
  this.status = "draft";
 }

 activate() {
  if (this.riskLevel > 7)
   throw new Error("Plan trop risqué : Michael doit revoir ça");
  return { ...this, status: "active" };
 }
}
```

```js
// =====================
// COUCHE 2 : USE CASES (ce que l'application peut faire)
// Le use case définit un port (interface) pour le stockage:il ne sait pas comment c'est stocké
// =====================

// PORT : contrat que l'adapter devra respecter
// En JS pur, c'est une convention. En TypeScript, c'est une interface.
//
// interface PrisonerRepository {
//  save(prisoner: Prisoner): Promise<Prisoner>
//  findById(id: string): Promise<Prisoner | null>
//  findAll(): Promise<Prisoner[]>
// }

class AddPrisonerUseCase {
 // le use case reçoit son repository par injection de dépendance (dependency injection)
 // il ne sait pas si c'est MongoDB, Postgres, ou un tableau en mémoire
 constructor(prisonerRepository) {
  this.repo = prisonerRepository;
 }

 async execute({ name, blockId, escapeRisk }) {
  // la validation métier vient de l'entity:le use case orchestre
  const prisoner = new Prisoner({
   id: crypto.randomUUID(),
   name,
   blockId,
   escapeRisk,
  });

  const saved = await this.repo.save(prisoner);

  // logique post-save : appartient au use case, pas à l'entity ni à l'adapter
  if (prisoner.isHighRisk()) {
   console.warn(
    `ALERTE SÉCURITÉ : ${prisoner.name} : risque niveau ${prisoner.escapeRisk}`,
   );
  }

  return saved;
 }
}

class GetHighRiskPrisonersUseCase {
 constructor(prisonerRepository) {
  this.repo = prisonerRepository;
 }

 async execute() {
  const all = await this.repo.findAll();
  // filtrage métier dans le use case:pas dans le controller, pas dans la DB
  return all.filter((p) => p.isHighRisk());
 }
}
```

```js
// =====================
// COUCHE 3 : ADAPTERS:Repository en mémoire (pour les tests, le dev)
// =====================

class InMemoryPrisonerRepository {
 // adapte l'interface du port à un stockage en mémoire
 #store = new Map();

 async save(prisoner) {
  this.#store.set(prisoner.id, prisoner);
  return prisoner;
 }

 async findById(id) {
  return this.#store.get(id) ?? null;
 }

 async findAll() {
  return Array.from(this.#store.values());
 }
}

// Adapter MongoDB:même interface, autre implémentation
class MongoPrisonerRepository {
 constructor(collection) {
  this.collection = collection; // connexion MongoDB injectée
 }

 async save(prisoner) {
  await this.collection.insertOne(prisoner);
  return prisoner;
 }

 async findById(id) {
  return this.collection.findOne({ id }) ?? null;
 }

 async findAll() {
  return this.collection.find({}).toArray();
 }
}
```

```js
// =====================
// COUCHE 3 : ADAPTERS:Controller Express
// =====================

class PrisonerController {
 constructor(addUseCase, getHighRiskUseCase) {
  this.addUseCase = addUseCase;
  this.getHighRiskUseCase = getHighRiskUseCase;
 }

 // le controller traduit HTTP → use case → HTTP
 async handleAdd(req, res) {
  try {
   const prisoner = await this.addUseCase.execute(req.body);
   res.status(201).json(prisoner);
  } catch (error) {
   // erreur de domaine → réponse HTTP appropriée
   if (error instanceof TypeError || error instanceof RangeError) {
    return res.status(400).json({ error: error.message });
   }
   res.status(500).json({ error: "Erreur interne" });
  }
 }

 async handleGetHighRisk(req, res) {
  const prisoners = await this.getHighRiskUseCase.execute();
  res.json(prisoners);
 }
}
```

```js
// =====================
// COUCHE 4 : FRAMEWORKS & DRIVERS:Composition root (point d'entrée unique)
// C'est ICI qu'on branche tout ensemble. Nulle part ailleurs.
// =====================

import express from "express";

const app = express();
app.use(express.json());

// choix du repository : changer cette ligne = changer toute l'infrastructure
// const repo = new MongoPrisonerRepository(mongoCollection)
const repo = new InMemoryPrisonerRepository(); // pour le dev local

const addUseCase = new AddPrisonerUseCase(repo);
const highRiskUseCase = new GetHighRiskPrisonersUseCase(repo);
const prisonerController = new PrisonerController(addUseCase, highRiskUseCase);

app.post("/prisoners", (req, res) => prisonerController.handleAdd(req, res));
app.get("/prisoners/risks", (req, res) =>
 prisonerController.handleGetHighRisk(req, res),
);

app.listen(3000);
```

---

## 4) POURQUOI LES TESTS DEVIENNENT SIMPLES

```js
// tester un use case sans aucun framework, aucune DB, aucun Express
// c'est ça la promesse de la Clean Architecture

describe("AddPrisonerUseCase", () => {
 it("refuse un prisonnier avec un risque > 10", async () => {
  const repo = new InMemoryPrisonerRepository();
  const useCase = new AddPrisonerUseCase(repo);

  await expect(
   useCase.execute({ name: "T-Bag", blockId: "B2", escapeRisk: 11 }),
  ).rejects.toThrow(RangeError);
 });

 it("sauvegarde un prisonnier valide", async () => {
  const repo = new InMemoryPrisonerRepository();
  const useCase = new AddPrisonerUseCase(repo);

  const result = await useCase.execute({
   name: "Michael Scofield",
   blockId: "A1",
   escapeRisk: 9,
  });
  expect(result.name).toBe("Michael Scofield");
 });
});
```

Aucun serveur. Aucune vraie DB. Tests instantanés. La logique métier est isolée.

---

## EXERCICES

**EXO 1 : L'entity Jutsu**
Crée une entity `Jutsu` pour le moteur de Naruto. Règles : un jutsu a un nom, un type (ninjutsu/taijutsu/genjutsu), un coût chakra (entre 5 et 500), et un niveau de puissance (1 à 10). La méthode `canCast(currentChakra)` retourne true/false. Zéro import, zéro dépendance externe.

**EXO 2 : Swap d'infrastructure**
Tu as un `InMemoryPrisonerRepository`. Écris un `LocalStoragePrisonerRepository` qui respecte le même contrat (save, findById, findAll) mais persiste dans `localStorage`. Montre que les use cases n'ont pas besoin d'être modifiés pour fonctionner avec le nouveau repository.

**EXO 3 : La règle des couches**
On te montre ce code : un use case qui importe `express` et appelle `res.json()` directement. Identifie la violation, explique pourquoi c'est grave, et refactorise proprement.

---

## RÉSUMÉ

La Clean Architecture impose une seule règle vraiment importante : les dépendances pointent vers l'intérieur. Le domaine ne connaît rien d'extérieur. Les use cases définissent des contrats. Les adapters remplissent ces contrats. Les frameworks vivent aux bords et peuvent être échangés sans toucher au domaine. Résultat : des tests rapides, un code qui survit aux migrations d'infra, et un domaine lisible par n'importe qui sans connaître l'outil du moment.
