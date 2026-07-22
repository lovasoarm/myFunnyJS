---
stability: intemporel
---

# GRAPHQL SANS LA MAGIE
Temps de lecture ~9 min

GraphQL résout un problème précis : le client demande exactement ce dont il a besoin.
Pas plus. Pas moins.
En REST, tu fais 3 requêtes pour assembler une vue. En GraphQL, une seule requête.
Mais GraphQL n'est pas une solution universelle : il a ses coûts, ses pièges, ses cas où REST gagne.

---

## 1) LE PROBLÈME QUE GRAPHQL RÉSOUT

En REST, pour afficher la fiche d'un joueur avec son équipe et ses stats de match :
```
GET /players/7     --> { id, name, teamId }
GET /teams/1      --> { id, name, stadium }
GET /players/7/stats  --> { goals, assists, matches }
```

3 requêtes. 3 allers-retours réseau. Souvent du over-fetching (tu reçois des champs dont tu as pas besoin).

En GraphQL, une seule requête :
```graphql
query {
 player(id: "7") {
  name
  team {
   name
   stadium
  }
  stats {
   goals
   assists
  }
 }
}
```

Le client choisit les champs. Le serveur livre exactement ça.

---

## 2) LES TROIS CONCEPTS FONDAMENTAUX

**Schema** : le contrat. Décrit les types disponibles et les opérations possibles.
**Resolver** : la logique. Chaque champ du schema a une fonction qui retourne sa valeur.
**Operation** : ce que le client envoie. `query` pour lire, `mutation` pour écrire, `subscription` pour le temps réel.

```
Client          GraphQL Server
 |               |
 | query { player(id:"7") {  |
 |  name           |
 |  goals          |
 | }}             |
 |----------------------------> |
 |               | schema : Player a name, goals
 |               | resolver : trouve le joueur, retourne name + goals
 | { data: { player: {    |
 |  name: "Mbappé",     |
 |  goals: 30        |
 | }}}            |
 |<---------------------------- |
```

---

## 3) SCHEMA ET RESOLVERS

```js
// schema/typeDefs.js
import { gql } from 'graphql-tag'

export const typeDefs = gql`
 # Type de base : décrit la structure d'un joueur
 type Player {
  id: ID!     # ! = non-nullable : toujours présent
  name: String!
  team: Team    # relation : un Player a une Team (nullable)
  goals: Int!
  assists: Int
 }

 type Team {
  id: ID!
  name: String!
  players: [Player!]! # tableau de Players non-nullable
 }

 # Query : toutes les opérations de lecture
 type Query {
  players: [Player!]!       # liste tous les joueurs
  player(id: ID!): Player     # joueur par id (peut être null si introuvable)
  team(id: ID!): Team
 }

 # Mutation : toutes les opérations d'écriture
 type Mutation {
  createPlayer(input: CreatePlayerInput!): Player!
  updateGoals(id: ID!, goals: Int!): Player
  deletePlayer(id: ID!): Boolean!
 }

 # Input type : structure attendue pour les mutations
 input CreatePlayerInput {
  name: String!
  teamId: ID!
  goals: Int
 }
`
```

```js
// schema/resolvers.js

// données simulées
const players = [
 { id: '1', name: 'Mbappé', teamId: '1', goals: 30, assists: 12 },
 { id: '2', name: 'Haaland', teamId: '2', goals: 27, assists: 8 },
]
const teams = [
 { id: '1', name: 'Real Madrid' },
 { id: '2', name: 'Man City'  },
]

export const resolvers = {
 // resolvers de Query
 Query: {
  // parent : l'objet parent (null pour les top-level queries)
  // args : les arguments passés dans la query
  // context : données partagées (user authentifié, DB connection, etc.)
  players: (parent, args, context) => players,

  player: (parent, { id }, context) => {
   return players.find(p => p.id === id) ?? null
  },

  team: (parent, { id }, context) => {
   return teams.find(t => t.id === id) ?? null
  }
 },

 // resolvers de Mutation
 Mutation: {
  createPlayer: (parent, { input }, context) => {
   const newPlayer = {
    id: String(players.length + 1),
    ...input,
    goals: input.goals ?? 0,
    assists: 0
   }
   players.push(newPlayer)
   return newPlayer
  },

  updateGoals: (parent, { id, goals }, context) => {
   const player = players.find(p => p.id === id)
   if (!player) return null
   player.goals = goals
   return player
  },

  deletePlayer: (parent, { id }, context) => {
   const index = players.findIndex(p => p.id === id)
   if (index === -1) return false
   players.splice(index, 1)
   return true
  }
 },

 // resolvers de champs : quand un Player a un champ complexe (Team)
 Player: {
  // appelé quand le client demande player.team
  // parent = l'objet Player résolu par le resolver Query.player
  team: (parent, args, context) => {
   return teams.find(t => t.id === parent.teamId) ?? null
  }
 },

 // quand une Team demande ses players
 Team: {
  players: (parent, args, context) => {
   return players.filter(p => p.teamId === parent.id)
  }
 }
}
```

```js
// app.js
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import { typeDefs } from './schema/typeDefs.js'
import { resolvers } from './schema/resolvers.js'

const app = express()
app.use(express.json())

const server = new ApolloServer({ typeDefs, resolvers })
await server.start()

// monte GraphQL sur /graphql
// context : fonction appelée à chaque requête pour injecter les dépendances partagées
app.use('/graphql', expressMiddleware(server, {
 context: async ({ req }) => ({
  user: req.user ?? null // inject l'utilisateur authentifié si dispo
 })
}))

app.listen(3000)
```

---

## 4) QUERIES ET MUTATIONS CÔTÉ CLIENT

```graphql
# Query : lire un joueur avec ses données d'équipe
query GetPlayer($id: ID!) {
 player(id: $id) {
  name
  goals
  team {
   name
  }
 }
}
# variables : { "id": "1" }

# Query : liste filtrée (le schema doit supporter les args de filtre)
query GetAllPlayers {
 players {
  id
  name
  goals
 }
}

# Mutation : créer un joueur
mutation CreatePlayer($input: CreatePlayerInput!) {
 createPlayer(input: $input) {
  id
  name
  goals
 }
}
# variables : { "input": { "name": "Vinicius", "teamId": "1", "goals": 15 } }
```

---

## 5) GRAPHQL VS REST : QUAND CHOISIR QUOI

```
GraphQL gagne quand :
- le client peut demander des formes de données très variées
- plusieurs clients (mobile, web, dashboard) ont des besoins différents
- les relations entre ressources sont complexes
- tu veux réduire le nombre de requêtes réseau

REST gagne quand :
- l'API est simple et stable (CRUD basique)
- tu as besoin de HTTP caching standard
- les clients sont homogènes (un seul type)
- ton équipe ne connaît pas GraphQL
- tu fais des fichiers uploads (GraphQL ne gère pas ça nativement)
```

---

## 6) CE QUI CASSE

**Le problème N+1**
Si tu demandes 100 players avec leur team, GraphQL appelle le resolver `Player.team` 100 fois.
100 requêtes DB au lieu d'une.

```
query { players { name team { name } } }
 --> resolve players : 1 requête DB (100 players)
 --> pour chaque player : resolve Player.team --> 100 requêtes DB
 --> total : 101 requêtes DB
```

Fix : DataLoader (batching de requêtes). Pas couvert ici mais à connaître avant de shipper en prod.

**Queries infiniment profondes**
Un client peut demander `player { team { players { team { players { ... } } } } }`.
Sans protection, ça explose le serveur.
Fix : limiter la profondeur avec `graphql-depth-limit`.

**Exposer le schema en prod**
GraphQL expose l'introspection par défaut : n'importe qui peut voir tous les types.
Désactiver l'introspection en prod si l'API est publique.

---

## EXERCICES

**EXO 1 : Le Conseil des Chevaliers (Garo)**
Modélise le schema GraphQL pour les Chevaliers d'Or.
Chaque chevalier a `id`, `name`, `armorName`, `status` (`"active"`, `"fallen"`, `"corrupted"`).
Implémente `Query.knights`, `Query.knight(id)`, et `Mutation.updateStatus`.
Teste avec une query qui ne demande que `name` et `armorName` sans `status`.

**EXO 2 : Les stats du Ballon d'Or**
L'API doit retourner les joueurs avec leurs stats de saison.
Un joueur a une relation vers ses `seasons: [Season]`.
Chaque `Season` a `year`, `club`, `goals`, `assists`.
Implémente les resolvers de relation.
Teste le cas où le client demande `players { name seasons { year goals } }`.

**EXO 3 : La mutation dangereuse**
Voici une mutation qui a un bug de N+1 :
```js
Mutation: {
 assignPlayersToTeam: async (_, { teamId, playerIds }) => {
  // pour chaque playerId : une requête DB séparée
  const players = await Promise.all(
   playerIds.map(id => db.findPlayer(id))
  )
  // ...
 }
}
```
Propose une version qui batch les requêtes DB en une seule.

---

## RÉSUMÉ

GraphQL = schema + resolvers + opérations (query/mutation/subscription).
Le client choisit exactement les champs qu'il veut. Pas d'over-fetching.
Chaque champ complexe a son propre resolver.
Le problème N+1 est le piège le plus fréquent : surveiller les requêtes DB générées.
REST reste souvent plus simple pour des APIs stables avec un seul type de client.
GraphQL brille quand les formes de données sont variées et les relations complexes.
