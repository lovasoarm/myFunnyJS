---
stability: intemporel
---

# Connecter ton code à la DB sans te perdre dans l'abstraction
Temps de lecture ~10 min

T'as compris SQL, les modèles, le cache. Reste la vraie question côté code : comment ton JS parle concrètement à la DB. Trois niveaux d'abstraction (driver brut, query builder, ORM), chacun avec un vrai compromis, pas juste une question de goût.

Pourquoi ça compte : choisir un ORM (object-relational mapping) sans comprendre ce qu'il fait derrière, c'est comme Naruto qui utilise le Mode Sage sans comprendre le flux du chakra naturel. Ça semble marcher, jusqu'au moment où ça lâche dans la pire situation possible.

Avantage des abstractions hautes : productivité, moins de boilerplate.
Inconvénient : tu perds en visibilité sur ce qui part vraiment en SQL.

---

## 1) LES TROIS NIVEAUX : DRIVER, QUERY BUILDER, ORM

```
DRIVER BRUT (pg, mysql2)
 --> tu écris le SQL toi-même, le driver transporte juste la requête
 --> contrôle total, verbosité maximale

QUERY BUILDER (Knex, Drizzle en mode builder)
 --> tu construis la requête avec des méthodes JS, ça génère le SQL
 --> bon compromis entre contrôle et confort

ORM (Prisma, Mongoose, Sequelize, Drizzle en mode ORM)
 --> tu manipules des objets JS, l'ORM génère le SQL et fait le mapping
 --> confort maximal, contrôle minimal sur ce qui part vraiment en requête
```

```
TOI écris du JS --> ORM traduit --> SQL généré --> DB exécute --> résultat --> ORM remappe en objets JS
```

Plus tu montes dans l'abstraction, plus tu écris vite, moins tu vois ce qui se passe vraiment. Aucun niveau n'est "le meilleur" : le driver brut pour un script ponctuel ou une requête ultra optimisée à la main, l'ORM pour un CRUD (create, read, update, delete) standard d'appli métier.

---

## 2) DRIVER BRUT : LE SQL, RIEN D'AUTRE

```js
import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// tu écris le SQL, le driver l'envoie, point
const result = await pool.query(
 'SELECT id, ninja_name, rank FROM ninjas WHERE village = $1',
 ['Konoha']
)
console.log(result.rows) // un tableau d'objets JS, un par ligne
```

Le pourquoi tu choisirais ça : tu veux une requête précise, optimisée, sans qu'une couche d'abstraction décide à ta place comment la construire. Le risque : tu dois TOUT gérer toi-même, requêtes paramétrées (pour éviter l'injection SQL, vu dans `01_sql_basics`), gestion des connexions, mapping des types.

---

## 3) QUERY BUILDER : DU JS QUI DEVIENT DU SQL LISIBLE

```js
import { db } from './db'

// Drizzle (exemple représentatif d'un query builder moderne)
const activeNinjas = await db
 .select({ id: ninjas.id, name: ninjas.ninja_name, rank: ninjas.rank })
 .from(ninjas)
 .where(eq(ninjas.village, 'Konoha'))
 .orderBy(desc(ninjas.chakra_level))
 .limit(20)
```

Le pourquoi : tu gardes une trace claire de ce qui va être généré en SQL (chaque méthode correspond presque 1:1 à une clause SQL), tout en profitant de l'autocomplétion TypeScript et de la sécurité contre l'injection (les valeurs sont automatiquement paramétrées).

```
.select(...)  --> SELECT ...
.from(...)   --> FROM ...
.where(...)  --> WHERE ...
.orderBy(...) --> ORDER BY ...
.limit(...)  --> LIMIT ...
```

C'est le compromis le plus sain pour la majorité des projets : tu vois ce que tu construis, tu gardes la sécurité de typage, tu n'écris pas de SQL en string brute partout.

---

## 4) ORM : LE CONFORT QUI PEUT CACHER UN PIÈGE

```js
// Prisma : tu manipules des relations comme des objets JS imbriqués
const ninja = await prisma.ninja.findUnique({
 where: { id: 1 },
 include: { missions: true } // récupère aussi les missions liées
})

console.log(ninja.missions) // un tableau de missions, déjà mappé en objets JS
```

Le pourquoi c'est puissant : `include` fait le `JOIN` (ou plusieurs requêtes optimisées) pour toi, le mapping objet est automatique, le typage TypeScript est généré depuis ton schéma. Tu écris 4 lignes pour ce qui prendrait 15 lignes en SQL brut + mapping manuel.

Le piège classique, le problème N+1 (vu aussi en algo de complexité dans `08_memory_performance/03_complexity`) :

```js
// exemple qui casse : ça a l'air innocent
const allNinjas = await prisma.ninja.findMany() // 1 requête, récupère 1000 ninjas

for (const ninja of allNinjas) {
 const missions = await prisma.mission.findMany({ where: { ninjaId: ninja.id } })
 // 1 requête PAR NINJA --> 1000 requêtes supplémentaires
}
// Total : 1001 requêtes pour ce qui devrait en prendre 1 ou 2
```

```
SANS include (le piège) :
1 requête ninjas --> boucle --> 1000 requêtes missions (une par ninja)
Total : 1001 requêtes. C'est le "N+1 problem".

AVEC include (la solution) :
const allNinjas = await prisma.ninja.findMany({ include: { missions: true } })
1 ou 2 requêtes optimisées, peu importe le nombre de ninjas
```

Le risque réel : ce bug ne se voit JAMAIS en dev avec 5 ninjas de test. Il explose en prod avec 10 000 ninjas, où ta page de classement met 30 secondes à charger parce qu'elle fait 10 001 requêtes DB séquentielles. C'est exactement le problème de Banshee : tout semble sous contrôle au niveau local, la réalité de l'ampleur arrive toujours trop tard.

---

## 5) MIGRATIONS : VERSIONNER TON SCHÉMA COMME TON CODE

```
Sans migrations :
dev A change le schéma en local --> dev B ne sait pas --> prod a un 3e schéma différent
chaos total, personne ne sait quelle DB a quelle structure

Avec migrations :
chaque changement de schéma = un fichier versionné, daté, exécutable dans l'ordre
toutes les DB (dev, staging, prod) appliquent les mêmes migrations dans le même ordre
```

```js
// Exemple Prisma : tu modifies le schéma déclaratif
model Ninja {
 id     Int  @id @default(autoincrement())
 ninja_name String
 rank    String
 kekkei_genkai String? // nouveau champ ajouté
}

// puis tu génères la migration : prisma migrate dev --name add_kekkei_genkai
// ça crée un fichier SQL horodaté qui ajoute la colonne, versionné dans git
```

Le pourquoi : ton schéma de DB est aussi important que ton code, donc il doit suivre la même discipline (vu dans `27_team_craft` pour la rigueur d'équipe) : versionné, reviewé, appliqué dans un ordre connu, jamais modifié à la main directement en prod.

---

## 6) POOL DE CONNEXIONS : NE PAS OUVRIR UNE CONNEXION PAR REQUÊTE

```js
// Mauvais : une nouvelle connexion TCP à chaque requête, coûteux
async function getNinja(id) {
 const client = new Client({ connectionString: process.env.DATABASE_URL })
 await client.connect() // coût de connexion à CHAQUE appel
 const result = await client.query('SELECT * FROM ninjas WHERE id = $1', [id])
 await client.end()
 return result.rows[0]
}

// Bon : un pool, réutilisé, qui gère un nombre limité de connexions ouvertes
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 })

async function getNinja(id) {
 const result = await pool.query('SELECT * FROM ninjas WHERE id = $1', [id])
 return result.rows[0]
}
```

Le pourquoi : ouvrir une connexion TCP (et l'authentification qui va avec) coûte plusieurs millisecondes, et une DB a une limite stricte de connexions simultanées (souvent 100-500 selon la config). Si chaque requête HTTP ouvre sa propre connexion DB sans jamais la réutiliser, tu peux saturer cette limite en quelques secondes sous charge, et la DB refuse les nouvelles connexions : panne totale.

---

## TIPS D'ÉVOLUTION TECHNIQUE

Avant, Sequelize et TypeORM dominaient le game ORM en JS, avec un typage TS souvent approximatif (généré à moitié, ou décoré à la main). Maintenant, Prisma et Drizzle ont changé la donne en générant un typage TypeScript complet et fiable directement depuis le schéma de DB, ce qui élimine une classe entière de bugs runtime ("cette colonne n'existe pas, mais TS ne le savait pas"). Le switch existe pour la sécurité de typage et la DX (developer experience), pas par mode : un dev qui démarre un projet en 2026 a peu de raisons de choisir un ORM sans typage généré automatiquement.

---

## EXERCICES

**EXO 1 : Chasse au N+1**
On te donne ce code : récupérer 50 ninjas de rang Jonin, puis pour chacun, requêter séparément ses 3 dernières missions. Réécris-le en évitant le problème N+1, avec la syntaxe ORM de ton choix (Prisma `include`, ou un `JOIN` SQL direct). (15 minutes)

**EXO 2 : Le bon niveau d'abstraction**
Pour chacun de ces cas, choisis driver brut, query builder, ou ORM, et justifie : (a) un script ponctuel d'import de données de 10 000 ninjas depuis un CSV legacy, (b) le CRUD standard du système de gestion de missions d'un village, (c) un rapport analytics complexe sur l'efficacité des équipes par type de mission sur 5 ans de données. (15 minutes)

**EXO 3 : Le pool qui sature**
Ton serveur a un pool de 10 connexions max. Tu reçois 200 requêtes HTTP simultanées qui interrogent toutes la DB. Explique ce qui se passe concrètement (file d'attente ? erreur ? timeout ?) et propose une stratégie pour éviter que ça plante en cascade. (15 minutes)

---

## RÉSUMÉ

Driver brut, query builder, et ORM ne sont pas trois façons de faire la même chose : c'est un curseur entre contrôle et confort que tu ajustes selon le contexte. Le danger principal de l'ORM n'est pas l'ORM lui-même, c'est d'oublier qu'il génère du SQL réel derrière chaque ligne JS confortable, et que le problème N+1 attend patiemment que ta base de données grossisse pour se révéler. Migrations versionnées et pool de connexions ne sont pas des options : c'est l'hygiène minimale pour qu'une DB tienne en prod.
