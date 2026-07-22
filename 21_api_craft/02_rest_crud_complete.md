---
stability: intemporel
---

# REST CRUD COMPLET
Temps de lecture ~9 min

REST c'est pas une technologie, c'est une convention.
Une convention sur comment nommer les routes, quels verbes utiliser, quels status codes renvoyer.
Le problème : tout le monde dit "je fais du REST" mais personne ne fait la même chose.
Ce fichier pose les règles claires. Une fois comprises, elles s'appliquent à n'importe quelle ressource.

---

## 1) REST : LES RÈGLES QUI COMPTENT VRAIMENT

REST (Representational State Transfer : transfert d'état représentatif) repose sur quelques contraintes.
Celles qui impactent le quotidien :

**Sans état (stateless)** : chaque requête porte tout ce dont le serveur a besoin.
Pas de session serveur. Pas de "je me souviens de ta requête précédente".

**Ressources et URIs** : une URI identifie une ressource, pas une action.
```
MAUVAIS    => POST /getPlayer, POST /deletePlayer, GET /createMatch
CORRECT    => GET /players/7, DELETE /players/7, POST /matches
```

**Verbes HTTP = opérations** :
```
GET   --> lire (sans modifier)
POST  --> créer
PUT   --> remplacer complètement
PATCH  --> modifier partiellement
DELETE --> supprimer
```

---

## 2) LES 5 OPÉRATIONS CRUD SUR UNE RESSOURCE

Ressource d'exemple : les joueurs Champions League.

```js
import { Router } from 'express'

const router = Router()

// base de données simulée en mémoire
let players = [
 { id: 1, name: 'Mbappé', team: 'Real Madrid', goals: 30 },
 { id: 2, name: 'Haaland', team: 'Man City',  goals: 27 },
]
let nextId = 3 // compteur d'id auto-incrémenté

// -------------------------------------------------------
// GET /players
// Récupère tous les joueurs (avec filtre optionnel par team)
// -------------------------------------------------------
router.get('/', (req, res) => {
 const { team } = req.query

 // si query param team fourni : filtre, sinon renvoie tout
 const result = team
  ? players.filter(p => p.team.toLowerCase() === team.toLowerCase())
  : players

 res.json(result) // 200 implicite
})

// -------------------------------------------------------
// GET /players/:id
// Récupère un joueur par son id
// -------------------------------------------------------
router.get('/:id', (req, res) => {
 const id = Number(req.params.id) // req.params.id est toujours une string
 const player = players.find(p => p.id === id)

 if (!player) {
  // 404 : la ressource n'existe pas
  return res.status(404).json({ error: `joueur ${id} introuvable` })
 }

 res.json(player)
})

// -------------------------------------------------------
// POST /players
// Crée un nouveau joueur
// -------------------------------------------------------
router.post('/', (req, res) => {
 const { name, team, goals } = req.body

 // validation minimale : les champs obligatoires
 if (!name || !team) {
  // 400 : le client a envoyé une requête invalide
  return res.status(400).json({ error: 'name et team sont requis' })
 }

 const newPlayer = {
  id: nextId++, // id auto-incrémenté
  name,
  team,
  goals: goals ?? 0 // goals optionnel, 0 par défaut
 }

 players.push(newPlayer)

 // 201 Created : la ressource a été créée
 // Location header : indique où trouver la nouvelle ressource
 res.status(201)
  .set('Location', `/players/${newPlayer.id}`)
  .json(newPlayer)
})

// -------------------------------------------------------
// PUT /players/:id
// Remplace COMPLÈTEMENT un joueur (tous les champs requis)
// -------------------------------------------------------
router.put('/:id', (req, res) => {
 const id = Number(req.params.id)
 const index = players.findIndex(p => p.id === id)

 if (index === -1) {
  return res.status(404).json({ error: `joueur ${id} introuvable` })
 }

 const { name, team, goals } = req.body

 // PUT = remplacement total : tous les champs sont requis
 if (!name || !team || goals === undefined) {
  return res.status(400).json({ error: 'PUT requiert name, team et goals' })
 }

 // remplace l'objet entier, conserve l'id
 players[index] = { id, name, team, goals }

 res.json(players[index])
})

// -------------------------------------------------------
// PATCH /players/:id
// Modifie PARTIELLEMENT un joueur (seuls les champs envoyés changent)
// -------------------------------------------------------
router.patch('/:id', (req, res) => {
 const id = Number(req.params.id)
 const player = players.find(p => p.id === id)

 if (!player) {
  return res.status(404).json({ error: `joueur ${id} introuvable` })
 }

 // spread : garde les anciens champs, écrase seulement ceux envoyés
 const updated = { ...player, ...req.body, id } // id ne peut pas être modifié
 players = players.map(p => p.id === id ? updated : p)

 res.json(updated)
})

// -------------------------------------------------------
// DELETE /players/:id
// Supprime un joueur
// -------------------------------------------------------
router.delete('/:id', (req, res) => {
 const id = Number(req.params.id)
 const index = players.findIndex(p => p.id === id)

 if (index === -1) {
  return res.status(404).json({ error: `joueur ${id} introuvable` })
 }

 players.splice(index, 1) // supprime 1 élément à l'index trouvé

 // 204 No Content : succès, rien à renvoyer
 res.status(204).send()
})

export default router
```

---

## 3) STATUS CODES : CEUX QUI COMPTENT

```
200 OK       --> lecture réussie, mise à jour réussie
201 Created     --> ressource créée (POST réussi)
204 No Content   --> succès mais rien à renvoyer (DELETE)
400 Bad Request   --> le client a mal formulé sa requête
401 Unauthorized  --> pas authentifié (token absent ou invalide)
403 Forbidden    --> authentifié mais pas autorisé
404 Not Found    --> la ressource n'existe pas
409 Conflict    --> conflit de données (doublon, version outdated)
422 Unprocessable  --> données bien formées mais sémantiquement invalides
500 Internal Server --> l'API a planté (bug non géré)
```

La règle : le status code raconte l'histoire sans que le client ait besoin de lire le body.
Un `200` avec `{ error: "not found" }` dans le body c'est du mensonge.

---

## 4) PUT VS PATCH : LA DIFFÉRENCE QUI COMPTE

```
PUT  --> remplace TOUT l'objet. Si tu oublies un champ, il disparaît.
PATCH --> modifie SEULEMENT les champs envoyés. Le reste est intact.
```

Exemple concret :
```js
// État actuel : { id: 1, name: 'Mbappé', team: 'Real Madrid', goals: 30 }

// PUT avec { name: 'Mbappé', team: 'PSG' } (goals oublié)
// résultat : { id: 1, name: 'Mbappé', team: 'PSG', goals: undefined }
// goals est PERDU

// PATCH avec { team: 'PSG' }
// résultat : { id: 1, name: 'Mbappé', team: 'PSG', goals: 30 }
// goals est CONSERVÉ
```

En pratique : PATCH est utilisé 95% du temps pour les updates.
PUT a du sens pour remplacer un fichier ou une config entière.

---

## 5) CE QUI CASSE

**Comparer des strings à des numbers pour les ids**
```js
// BUG : req.params.id est '7' (string), players contient { id: 7 } (number)
const player = players.find(p => p.id === req.params.id) // undefined toujours
// FIX
const player = players.find(p => p.id === Number(req.params.id))
```

**PATCH qui laisse passer l'écrasement de l'id**
```js
// BUG : si le client envoie { id: 99, team: 'PSG' }, l'id change
const updated = { ...player, ...req.body }
// FIX : force l'id original
const updated = { ...player, ...req.body, id: player.id }
```

**Renvoyer une liste vide comme un 404**
Une liste vide c'est une liste vide, pas une erreur. `GET /players?team=juventus` avec 0 résultats : `200` avec `[]`.
`404` c'est pour "cette URL n'existe pas", pas "cette requête n'a rien trouvé".

---

## EXERCICES

**EXO 1 : Le roster de l'académie ninja**
L'Armée d'Exploration a besoin d'un CRUD complet sur ses membres.
Chaque membre a `id`, `name`, `rank`, et `kills` (titans éliminés).
Implémente les 5 opérations. Contraintes :
- `POST` refuse un membre sans `name` et `rank`
- `PATCH` ne permet pas de modifier l'`id`
- `DELETE` renvoie 404 si le membre n'existe pas

**EXO 2 : L'inventaire de Rick Grimes**
L'inventaire du camp a des ressources : `food`, `ammo`, `medical`.
Chaque ressource a `id`, `type`, `quantity`, `location`.
Ajoute un endpoint `PATCH /inventory/:id/consume` qui décrémente la `quantity` d'une valeur donnée dans le body.
Si la `quantity` passerait en dessous de 0 : renvoie un 409 avec un message explicite.

**EXO 3 : Le classement Ballon d'Or**
Tu gères un classement de joueurs avec `rank`, `name`, `points`, `nationality`.
Implémente `GET /ranking` avec tri par `points` décroissant.
Ajoute un query param `nationality` pour filtrer.
Si `nationality` est fourni mais ne matche aucun joueur : `200` avec `[]`, jamais `404`.

---

## RÉSUMÉ

REST c'est une convention sur les noms de routes et les verbes HTTP.
GET lit. POST crée. PUT remplace. PATCH modifie. DELETE supprime.
Les status codes racontent l'histoire : ne jamais mentir avec un `200` sur une erreur.
PUT remplace tout. PATCH touche seulement ce qu'on lui envoie.
L'id en URL c'est toujours une string : la convertir avant de comparer.
