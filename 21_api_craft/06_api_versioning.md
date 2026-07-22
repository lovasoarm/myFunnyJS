---
stability: intemporel
---

# VERSIONNER UNE API
Temps de lecture ~9 min

Une API sans versioning c'est une bombe silencieuse.
Tu changes le format d'un endpoint, l'app mobile de l'année dernière crashe.
Tu ne peux plus faire évoluer l'API sans casser les clients existants.
Versionner c'est se donner le droit de changer sans détruire.

---

## 1) POURQUOI VERSIONNER

Une API c'est un contrat avec les clients : "envoie moi X, je te renvoie Y".
Quand tu changes Y, le contrat est rompu. Les clients cassent.

Le versioning sépare les générations de contrats :
- les clients anciens restent sur v1 tant qu'ils ne migrent pas
- les nouveaux clients utilisent v2 directement
- les deux coexistent sans se marcher dessus

```
Changements NON breaking (pas besoin de nouvelle version) :
 --> ajouter un nouveau champ optionnel dans la réponse
 --> ajouter un nouveau endpoint
 --> ajouter un query param optionnel

Changements breaking (nécessitent une nouvelle version) :
 --> renommer ou supprimer un champ existant
 --> changer le type d'un champ (string --> number)
 --> changer la structure d'une réponse
 --> rendre optionnel un champ obligatoire (ou l'inverse)
 --> changer le comportement d'un endpoint existant
```

---

## 2) LES STRATÉGIES DE VERSIONING

**Option A : URL path (la plus répandue)**
```
GET /v1/players
GET /v2/players
```
Avantages : visible, bookmarkable, facile à router.
Inconvénients : pollue l'URL, certains puristes REST considerent que l'URL doit identifier une ressource, pas une version.

**Option B : Header Accept**
```
GET /players
Accept: application/vnd.myfunnyapi.v2+json
```
Avantages : URL propre, REST "pur".
Inconvénients : moins visible, moins facile à tester dans un navigateur.

**Option C : Query param**
```
GET /players?version=2
```
Avantages : simple à implémenter.
Inconvénients : cacheable moins facilement, moins propre.

En pratique : **URL path** est utilisé par 90% des APIs publiques (Twitter, Stripe, GitHub).
C'est ce qu'on implémente.

---

## 3) IMPLÉMENTATION PAR URL PATH

```
src/
 routes/
  v1/
   players.router.js  --> format v1 de la ressource players
   teams.router.js
  v2/
   players.router.js  --> format v2 (champs renommés, nouvelle structure)
   teams.router.js
   stats.router.js   --> nouveau endpoint ajouté en v2
 app.js
```

```js
// routes/v1/players.router.js
import { Router } from 'express'
const router = Router()

// v1 : format legacy
router.get('/', (req, res) => {
 res.json([
  { player_id: 1, player_name: 'Mbappé', nb_goals: 30 } // snake_case, noms verbeux
 ])
})

export default router
```

```js
// routes/v2/players.router.js
import { Router } from 'express'
const router = Router()

// v2 : format modernisé (camelCase, champs renommés, pagination)
router.get('/', (req, res) => {
 const { page = 1, limit = 20 } = req.query

 res.json({
  data: [
   { id: 1, name: 'Mbappé', goals: 30 } // camelCase, noms courts
  ],
  pagination: {
   page: Number(page),
   limit: Number(limit),
   total: 1
  }
 })
})

router.get('/:id/stats', (req, res) => { // nouveau endpoint en v2
 res.json({ playerId: req.params.id, goals: 30, assists: 12, xG: 28.5 })
})

export default router
```

```js
// app.js
import v1Players from './routes/v1/players.router.js'
import v2Players from './routes/v2/players.router.js'

// monte les deux versions en parallèle
app.use('/v1/players', v1Players)
app.use('/v2/players', v2Players)

// ou avec des sous-routeurs par version si le projet grossit
const v1Router = Router()
v1Router.use('/players', v1Players)
app.use('/v1', v1Router)

const v2Router = Router()
v2Router.use('/players', v2Players)
app.use('/v2', v2Router)
```

---

## 4) PARTAGER LA LOGIQUE ENTRE VERSIONS

Dupliquer les handlers est une erreur : quand tu fixes un bug, tu dois le fixer aux deux endroits.
La logique métier reste partagée. Seule la couche de présentation (format de réponse) varie.

```js
// services/players.service.js
// logique métier partagée entre toutes les versions

export function getAllPlayers({ teamFilter } = {}) {
 let result = players
 if (teamFilter) result = result.filter(p => p.team === teamFilter)
 return result
}

export function getPlayerById(id) {
 return players.find(p => p.id === id) ?? null
}
```

```js
// routes/v1/players.router.js
import { getAllPlayers } from '../../services/players.service.js'

router.get('/', (req, res) => {
 const data = getAllPlayers()
 // transforme en format v1
 res.json(data.map(p => ({ player_id: p.id, player_name: p.name, nb_goals: p.goals })))
})
```

```js
// routes/v2/players.router.js
import { getAllPlayers } from '../../services/players.service.js'

router.get('/', (req, res) => {
 const data = getAllPlayers()
 // transforme en format v2 (même service, présentation différente)
 res.json({ data: data.map(p => ({ id: p.id, name: p.name, goals: p.goals })) })
})
```

Séparation claire :
```
service --> logique métier, accès data (partagé)
router  --> format de réponse, validation des inputs (par version)
```

---

## 5) DÉPRÉCIATION ET SUNSET

Maintenir v1 et v2 pour toujours c'est une dette. À un moment, v1 doit mourir.
La dépréciation est un processus, pas un acte brutal.

```js
// middleware de dépréciation : avertit le client que v1 est deprecated
function deprecationWarning(version, sunsetDate) {
 return (req, res, next) => {
  // Deprecation header : standard IETF pour indiquer la date de dépréciation
  res.set('Deprecation', `version="${version}"`)
  // Sunset header : date à laquelle l'API sera retirée
  res.set('Sunset', sunsetDate)
  // lien vers la doc de migration
  res.set('Link', '</docs/migration-v2>; rel="successor-version"')
  next()
 }
}

// monte le middleware sur toutes les routes v1
app.use('/v1', deprecationWarning('v1', 'Sat, 31 Dec 2026 23:59:59 GMT'), v1Router)
```

Plan de dépréciation type :
```
Annonce        --> 6 mois avant sunset
Header Deprecation  --> dès l'annonce
Header Sunset     --> dès l'annonce
Monitoring      --> tracker le trafic v1 pour mesurer la migration
Rappels        --> email aux dev qui utilisent encore v1 (via logs API keys)
Sunset        --> v1 renvoie 410 Gone
Suppression      --> 3 mois après sunset, code retiré
```

---

## 6) CE QUI CASSE

**Ajouter un champ obligatoire en v1 sans créer une v2**
Les clients existants qui ne passent pas ce champ commencent à recevoir des 400.
C'est un breaking change. Il mérite une nouvelle version.

**Versionner trop tôt ou trop souvent**
Une API v7 alors que l'API a 2 ans, c'est un signal que les breaking changes ne sont pas réfléchis.
Concevoir le schema avec de la flexibilité dès le départ réduit le besoin de versioning.

**Pas de date de sunset**
Déprécier sans deadline c'est comme dire "on va faire ça un jour".
Une date engage. Ça force les clients à migrer.

---

## EXERCICES

**EXO 1 : La v2 de l'API Fox River**
L'API prison v1 renvoie les détenus en snake_case (`prisoner_id`, `cell_number`).
La v2 adopte camelCase (`id`, `cellNumber`) et ajoute un champ `riskLevel`.
Implémente les deux versions avec un service partagé.
Monte le header `Deprecation` sur v1.

**EXO 2 : Le Ballon d'Or en deux générations**
La v1 de ton API Ballon d'Or renvoie `{ rank, player, country, votes }`.
La v2 restructure : `{ rank, player: { name, nationality }, votes: { total, breakdown } }`.
Implémente les deux. Le service `computeRanking()` est partagé.
Assure-toi qu'un bug fix dans le service corrige les deux versions.

**EXO 3 : L'audit de breaking changes**
Pour chaque changement suivant, dis si c'est breaking ou non-breaking. Justifie.
1. Ajouter le champ optionnel `assists` à la réponse de `GET /players`
2. Renommer `nb_goals` en `goals`
3. Changer le type de `goals` de `string` à `number`
4. Ajouter un endpoint `GET /players/:id/history`
5. Rendre le champ `team` obligatoire dans `POST /players` (il était optionnel)
6. Changer le format de date de `"2024-01-15"` à un timestamp Unix

---

## RÉSUMÉ

Une API c'est un contrat. Versionner c'est honorer les anciens contrats tout en évoluant.
Les breaking changes (champs renommés, types changés, structure modifiée) nécessitent une nouvelle version.
La logique métier reste partagée entre versions : seule la couche de présentation varie.
La dépréciation c'est un processus avec une deadline claire, pas une intention vague.
`Deprecation` et `Sunset` sont les headers standard pour signaler la fin de vie.
