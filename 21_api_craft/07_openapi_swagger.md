---
stability: intemporel
---

# OPENAPI ET SWAGGER
Temps de lecture ~9 min

Une API non documentée c'est une API que personne ne peut utiliser sans lire ton code.
OpenAPI (anciennement Swagger) c'est le standard pour décrire une API REST : endpoints, paramètres, réponses, schémas d'erreur.
C'est le contrat lisible par les humains ET les machines.

---

## 1) CE QUE C'EST VRAIMENT

OpenAPI Specification (OAS) est un format YAML ou JSON qui décrit une API.
Swagger est l'ensemble des outils qui lisent ce format : UI interactive, générateur de code client, validateur.

Ce que tu obtiens avec une spec OpenAPI :
- une doc interactive (Swagger UI) où les devs peuvent tester les endpoints
- un contrat versionnable dans Git
- des clients SDK générables automatiquement dans n'importe quel langage
- une validation automatique des requêtes/réponses si tu branche un middleware

```
spec.yaml (OpenAPI)
 --> Swagger UI    : doc interactive, testable dans le navigateur
 --> Code generators  : client TypeScript, Python, Go, etc.
 --> Request validator : valide que les requêtes respectent le contrat
 --> Mock server    : serveur fictif pour les devs frontend pendant que le backend est en cours
```

---

## 2) STRUCTURE D'UNE SPEC OPENAPI

```yaml
# openapi: version de la spec
openapi: 3.1.0

info:
 title: MyFunnyAPI - Champions League
 version: 2.0.0
 description: API de gestion des joueurs et équipes Champions League

servers:
 - url: https://api.myfunny.dev/v2
  description: Production
 - url: http://localhost:3000/v2
  description: Développement local

# composants réutilisables : schémas, réponses d'erreur, paramètres
components:
 schemas:
  Player:
   type: object
   required: [id, name, goals]
   properties:
    id:
     type: integer
     example: 7
    name:
     type: string
     example: Mbappé
    team:
     type: string
     example: Real Madrid
    goals:
     type: integer
     minimum: 0
     example: 30
    assists:
     type: integer
     minimum: 0
     example: 12

  CreatePlayerInput:
   type: object
   required: [name, team]
   properties:
    name:
     type: string
     minLength: 2
     example: Vinicius
    team:
     type: string
     example: Real Madrid
    goals:
     type: integer
     minimum: 0
     default: 0

  Error:
   type: object
   required: [error]
   properties:
    error:
     type: object
     required: [code, message, status]
     properties:
      code:
       type: string
       example: PLAYER_NOT_FOUND
      message:
       type: string
       example: joueur 99 introuvable
      status:
       type: integer
       example: 404

 # réponses d'erreur réutilisables sur plusieurs endpoints
 responses:
  NotFound:
   description: Ressource introuvable
   content:
    application/json:
     schema:
      $ref: '#/components/schemas/Error'
  Unauthorized:
   description: Token absent ou invalide
   content:
    application/json:
     schema:
      $ref: '#/components/schemas/Error'

 # schémas d'auth
 securitySchemes:
  bearerAuth:
   type: http
   scheme: bearer
   bearerFormat: JWT

# sécurité globale : tous les endpoints nécessitent un token sauf override
security:
 - bearerAuth: []

paths:
 /players:
  get:
   summary: Liste tous les joueurs
   operationId: listPlayers
   tags: [Players]
   security: [] # override : cet endpoint est public
   parameters:
    - name: team
     in: query
     required: false
     schema:
      type: string
     description: Filtre par équipe
    - name: page
     in: query
     required: false
     schema:
      type: integer
      minimum: 1
      default: 1
    - name: limit
     in: query
     required: false
     schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20
   responses:
    '200':
     description: Liste des joueurs
     content:
      application/json:
       schema:
        type: object
        properties:
         data:
          type: array
          items:
           $ref: '#/components/schemas/Player'
         pagination:
          type: object
          properties:
           page: { type: integer }
           limit: { type: integer }
           total: { type: integer }

  post:
   summary: Crée un nouveau joueur
   operationId: createPlayer
   tags: [Players]
   requestBody:
    required: true
    content:
     application/json:
      schema:
       $ref: '#/components/schemas/CreatePlayerInput'
   responses:
    '201':
     description: Joueur créé
     headers:
      Location:
       schema:
        type: string
       description: URL du nouveau joueur
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/Player'
    '400':
     description: Données invalides
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/Error'
    '401':
     $ref: '#/components/responses/Unauthorized'

 /players/{id}:
  parameters:
   - name: id
    in: path
    required: true
    schema:
     type: integer
    description: ID du joueur

  get:
   summary: Récupère un joueur par son ID
   operationId: getPlayer
   tags: [Players]
   security: []
   responses:
    '200':
     description: Joueur trouvé
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/Player'
    '404':
     $ref: '#/components/responses/NotFound'

  patch:
   summary: Modifie partiellement un joueur
   operationId: updatePlayer
   tags: [Players]
   requestBody:
    required: true
    content:
     application/json:
      schema:
       type: object
       properties:
        name: { type: string }
        team: { type: string }
        goals: { type: integer, minimum: 0 }
   responses:
    '200':
     description: Joueur mis à jour
     content:
      application/json:
       schema:
        $ref: '#/components/schemas/Player'
    '404':
     $ref: '#/components/responses/NotFound'

  delete:
   summary: Supprime un joueur
   operationId: deletePlayer
   tags: [Players]
   responses:
    '204':
     description: Joueur supprimé
    '404':
     $ref: '#/components/responses/NotFound'
```

---

## 3) SWAGGER UI DANS EXPRESS

```js
// app.js
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'

const swaggerDocument = YAML.load('./openapi.yaml')

// monte Swagger UI sur /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
 customSiteTitle: 'MyFunnyAPI Docs',
 swaggerOptions: {
  persistAuthorization: true // garde le token entre les requêtes de test
 }
}))
```

Résultat : `http://localhost:3000/docs` affiche une interface interactive.
Les devs peuvent tester chaque endpoint directement depuis le navigateur, avec leur token.

---

## 4) VALIDATION AUTOMATIQUE AVEC LA SPEC

La spec peut faire plus que documenter : elle peut valider les requêtes entrantes.

```js
import OpenApiValidator from 'express-openapi-validator'

app.use(
 OpenApiValidator.middleware({
  apiSpec: './openapi.yaml',
  validateRequests: true,  // valide les requêtes entrantes contre la spec
  validateResponses: false // activer en dev pour détecter les divergences
 })
)

// les erreurs de validation sont passées au errorHandler global
// format : { status: 400, errors: [{ path, message }] }
```

Avantage : plus besoin de valider manuellement chaque champ dans les handlers.
La spec est la source de vérité. Si la requête ne matche pas, le middleware rejette avant même d'atteindre le handler.

---

## 5) APPROCHE CODE-FIRST : GÉNÉRER LA SPEC DEPUIS LE CODE

Alternative à écrire le YAML à la main : générer la spec depuis des annotations JSDoc.

```js
// players.router.js

/**
 * @openapi
 * /players:
 *  get:
 *   summary: Liste tous les joueurs
 *   tags: [Players]
 *   responses:
 *    200:
 *     description: Liste des joueurs
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Player'
 */
router.get('/', (req, res) => {
 // ...
})
```

```js
// génère la spec depuis les annotations
import swaggerJsdoc from 'swagger-jsdoc'

const spec = swaggerJsdoc({
 definition: {
  openapi: '3.1.0',
  info: { title: 'MyFunnyAPI', version: '2.0.0' },
 },
 apis: ['./routes/**/*.js'] // scanne ces fichiers pour les annotations @openapi
})
```

**Spec-first vs Code-first :**
```
Spec-first --> tu écris le YAML en premier, le code après
       --> le contrat est défini avant l'implémentation
       --> recommandé pour les APIs publiques ou avec plusieurs équipes

Code-first --> tu écris le code, la spec est générée
       --> plus rapide pour prototyper
       --> risque de divergence si on oublie de mettre à jour les annotations
```

---

## 6) CE QUI CASSE

**Spec qui diverge du code réel**
La pire situation : la doc dit que le champ s'appelle `name` mais l'API renvoie `player_name`.
Les clients codent sur la doc et plantent en runtime.
Fix : valider les réponses en dev (`validateResponses: true`) pour détecter les divergences.

**Schémas non réutilisés (`$ref` ignorés)**
Copier-coller le même schema sur 10 endpoints c'est 10 endroits à maintenir.
`$ref: '#/components/schemas/Player'` centralise. Une modification, tout est à jour.

**Pas de documentation des erreurs**
Documenter les `200` mais oublier les `400`, `401`, `404` : le client ne sait pas quoi faire en cas d'erreur.
Chaque endpoint doit documenter au minimum ses cas d'erreur probables.

---

## EXERCICES

**EXO 1 : Le contrat de Fox River**
Écris la spec OpenAPI pour l'API Prison Break.
Ressource : `prisoners` avec `id`, `name`, `cellBlock`, `sentence` (années).
Documente `GET /prisoners`, `GET /prisoners/:id`, `POST /prisoners`, `DELETE /prisoners/:id`.
Utilise des `$ref` pour les schémas et les réponses d'erreur.
Monte Swagger UI sur `/docs`.

**EXO 2 : La spec qui valide**
Intègre `express-openapi-validator` sur l'API players.
`POST /players` : le `name` doit faire au moins 2 caractères, `goals` doit être entre 0 et 500.
Envoie une requête avec `goals: -5` et vérifie que le middleware rejette avec un 400 bien formaté.

**EXO 3 : L'audit de divergence**
Voici une réponse réelle de l'API et ce que dit la spec. Identifie les divergences :

Spec :
```yaml
Player:
 properties:
  id: { type: integer }
  name: { type: string }
  goals: { type: integer }
  team: { type: string }
```

Réponse réelle :
```json
{
 "id": "7",
 "player_name": "Mbappé",
 "goals": 30,
 "teamId": 1
}
```

---

## RÉSUMÉ

OpenAPI c'est le contrat standard pour décrire une API REST : lisible par les humains et les machines.
`$ref` pour réutiliser les schemas : une modification, tout est à jour.
Swagger UI monte une interface de test interactive en quelques lignes.
La validation automatique avec `express-openapi-validator` fait respecter le contrat à l'entrée.
Spec-first pour les APIs publiques. Code-first pour prototyper vite.
La spec qui diverge du code réel c'est pire que pas de spec du tout.
