---
stability: intemporel
---

# HTTP ET REST : LIRE UNE REQUÊTE COMME UN PROFESSIONNEL
Temps de lecture ~10 min

Chaque fois que Michael Scofield envoie un message depuis sa cellule, il suit un protocole.
Format précis, destinataire précis, réponse attendue précise.
HTTP c'est ça : un protocole de communication entre un client et un serveur.

Si tu ne sais pas lire une requête HTTP, tu ne peux pas debugger une API.
Et si tu ne peux pas debugger une API, tu ne peux pas travailler en prod.

---

## 1) CE QU'EST HTTP

HTTP (HyperText Transfer Protocol) : protocole de transfert de données sur le web.
Stateless (sans état) : chaque requête est indépendante : le serveur ne se souvient pas de la précédente.

Le cycle minimal :

```
Client --[REQUEST]--> Serveur --[RESPONSE]--> Client
```

Flux complet avec couches :

```
CLIENT (navigateur / app mobile / autre service)
    |
    | HTTP Request : GET /api/match/stats
    | Headers : Authorization: Bearer <token>, Content-Type: application/json
    v
API SERVER (Express / Node / autre runtime)
    |
    | parse la requête, vérifie l'auth, appelle la logique métier
    v
DATABASE (SQL / NoSQL)  ou  CACHE (Redis)
    |
    | retourne rows ou JSON
    v
API SERVER
    |
    | HTTP Response : 200 OK
    | Body : { "possession": 58, "xG": 1.7, "goals": 2 }
    v
CLIENT

Chaque couche a une responsabilité. Aucune ne court-circuite l'autre.
L'API ne parle jamais directement au client de ce que la DB lui a renvoyé :
elle transforme, valide, formate avant de répondre.
```

Une requête HTTP contient :
```
[MÉTHODE] [URL] HTTP/[VERSION]
[HEADERS]
[BODY facultatif]
```

Une réponse HTTP contient :
```
HTTP/[VERSION] [STATUS CODE] [REASON PHRASE]
[HEADERS]
[BODY facultatif]
```

Exemple concret :

```
Requête :
POST /api/prisoners HTTP/1.1
Host: fox-river.prison.gov
Content-Type: application/json
Authorization: Bearer eyJhbGci...

{"name": "Michael Scofield", "cell": "A5"}

Réponse :
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/prisoners/42

{"id": 42, "name": "Michael Scofield", "status": "incarcerated"}
```

---

## 2) LES MÉTHODES HTTP

```
GET   => lire une ressource, jamais de side effect (effet de bord), idempotent
POST  => créer une ressource, body requis, non idempotent
PUT   => remplacer une ressource complète, idempotent
PATCH  => modifier partiellement une ressource, idempotent
DELETE => supprimer une ressource, idempotent
HEAD  => comme GET mais sans body en réponse (vérifier si une ressource existe)
OPTIONS => demander ce que le serveur accepte (utilisé par CORS)
```

Idempotent (idempotent) : appeler la méthode 1 fois ou 10 fois donne le même résultat côté serveur.
GET sur `/users/1` 10 fois = même résultat. Sûr.
POST sur `/users` 10 fois = 10 utilisateurs créés. Pas idempotent.

```js
// GET : lire sans toucher
// fetch() sans options = GET par défaut
const user = await fetch('/api/users/42').then(r => r.json());

// POST : créer avec un body
const created = await fetch('/api/users', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' }, // dire au serveur ce qu'on envoie
 body: JSON.stringify({ name: 'Lincoln Burrows', cell: 'death-row' }), // sérialiser (convertir en string) les données
}).then(r => r.json());

// PATCH : modifier partiellement (seulement ce qui change)
await fetch('/api/users/42', {
 method: 'PATCH',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ status: 'escaped' }), // on envoie uniquement le champ modifié
});

// DELETE : supprimer
await fetch('/api/users/42', { method: 'DELETE' });
```

---

## 3) LES STATUS CODES

Le code de statut (status code) dit tout sur ce qui s'est passé.
3 chiffres, 5 familles :

```
1xx => Informationnel (rarement vu côté client)
2xx => Succès
3xx => Redirection
4xx => Erreur client (ta faute)
5xx => Erreur serveur (leur faute)
```

Les indispensables :

```
200 OK       => succès standard (GET, PUT, PATCH)
201 Created     => ressource créée (POST)
204 No Content   => succès sans body en réponse (DELETE)
301 Moved Perm.   => redirection permanente (l'URL a changé pour toujours)
302 Found      => redirection temporaire
304 Not Modified  => le cache est à jour, pas besoin de re-télécharger
400 Bad Request   => corps ou paramètres invalides (tu as envoyé n'importe quoi)
401 Unauthorized  => non authentifié (qui es-tu ?)
403 Forbidden    => authentifié mais pas autorisé (je sais qui tu es, t'as pas le droit)
404 Not Found    => ressource inexistante
409 Conflict    => conflit (email déjà pris, par exemple)
422 Unprocessable  => données reçues mais invalides selon les règles métier
429 Too Many Req.  => rate limiting (trop de requêtes en trop peu de temps)
500 Internal Err.  => bug côté serveur (vérifier les logs)
502 Bad Gateway   => le proxy a reçu une réponse invalide du serveur upstream
503 Unavailable   => serveur surchargé ou en maintenance
```

```js
// Gérer les status codes correctement côté client
async function fetchPrisoner(id) {
 const response = await fetch(`/api/prisoners/${id}`);

 // fetch() ne throw (ne lève pas d'erreur) sur les 4xx/5xx : c'est piégeux
 if (response.status === 404) {
  return null; // prisonnier introuvable : cas normal, pas une erreur fatale
 }

 if (response.status === 401) {
  throw new Error('Session expirée : reconnecte-toi'); // rediriger vers login
 }

 if (response.status === 429) {
  throw new Error('Trop de requêtes : attends avant de réessayer');
 }

 if (!response.ok) {
  // response.ok = true si status entre 200 et 299
  throw new Error(`Erreur serveur: ${response.status}`);
 }

 return response.json();
}
```

---

## 4) LES HEADERS ESSENTIELS

Les headers (en-têtes) transportent les métadonnées (informations sur la requête/réponse).

**Headers de requête importants :**

```
Content-Type    => format du body envoyé (application/json, multipart/form-data)
Accept       => format de réponse attendu (application/json)
Authorization   => token d'auth (Bearer <jwt> ou Basic <base64>)
User-Agent     => qui fait la requête (navigateur, app, curl)
Cache-Control   => instructions de cache pour la requête
X-Request-ID    => identifiant unique pour tracer la requête dans les logs
```

**Headers de réponse importants :**

```
Content-Type    => format du body retourné
Cache-Control   => combien de temps mettre en cache
ETag        => fingerprint (empreinte) de la ressource pour validation du cache
Location      => URL de la ressource créée (après un POST 201)
X-Rate-Limit-*   => info sur le rate limiting (combien de requêtes restantes)
Set-Cookie     => définir un cookie côté client
```

```js
// Lire les headers d'une réponse
const response = await fetch('/api/orders/123');

const contentType = response.headers.get('content-type');
// => "application/json; charset=utf-8"

const rateLimit = response.headers.get('x-rate-limit-remaining');
// => "99" (il reste 99 requêtes dans la fenêtre de rate limiting)

const etag = response.headers.get('etag');
// => '"abc123"' (fingerprint pour le cache conditionnel)
```

---

## 5) REST : LES CONVENTIONS

REST (Representational State Transfer) n'est pas un protocole. C'est un ensemble de conventions pour structurer une API HTTP.

**Convention 1 : URLs basées sur les ressources, pas les actions**

```
Mauvais (action dans l'URL) :
GET /getUsers
POST /createUser
POST /deleteUser?id=42

Correct (ressource dans l'URL) :
GET  /users
POST  /users
DELETE /users/42
```

**Convention 2 : Hiérarchie des ressources dans l'URL**

```
GET /prisons/fox-river/prisoners     => tous les prisonniers de Fox River
GET /prisons/fox-river/prisoners/42    => le prisonnier 42 de Fox River
POST /prisons/fox-river/prisoners/42/moves => transférer le prisonnier 42
```

**Convention 3 : Verbes HTTP pour les actions CRUD**

```
Create  => POST  /resources
Read   => GET  /resources ou /resources/:id
Update  => PUT  /resources/:id  (remplacement complet)
Update  => PATCH /resources/:id  (modification partielle)
Delete  => DELETE /resources/:id
```

**Convention 4 : Format d'erreur cohérent**

```js
// Format d'erreur standard : tout le monde comprend ce que c'est
{
 "error": {
  "code": "PRISONER_NOT_FOUND",   // code machine-readable (lisible par le code)
  "message": "Prisoner 42 not found", // message humain lisible
  "details": { "id": 42 },      // infos supplémentaires pour debugger
  "requestId": "req_abc123"      // id de la requête pour tracer dans les logs
 }
}
```

---

## 6) QUERY PARAMS, PATH PARAMS, BODY

Trois façons de passer des données au serveur :

```js
// PATH PARAMS (paramètres dans l'URL) : identifier une ressource spécifique
// GET /prisoners/42
app.get('/prisoners/:id', (req, res) => {
 const { id } = req.params; // => "42"
});

// QUERY PARAMS (paramètres de requête) : filtrer, trier, paginer
// GET /prisoners?status=escaped&sort=name&limit=10&page=2
app.get('/prisoners', (req, res) => {
 const { status, sort, limit, page } = req.query;
 // => status: "escaped", sort: "name", limit: "10", page: "2"
 // Attention : tout est string dans req.query, parser si besoin
 const limitNum = parseInt(limit, 10);
});

// BODY (corps de la requête) : créer ou modifier une ressource
// POST /prisoners
app.post('/prisoners', express.json(), (req, res) => {
 const { name, cell, crime } = req.body; // données JSON parsées automatiquement
});
```

---

## EXERCICES

**EXO 1 : Décoder la requête de Scofield**
Tu reçois cette requête : `PUT /api/prisons/fox-river/sections/A/locks/north-door HTTP/1.1`.
Identifie : la méthode, les ressources hiérarchiques, ce que cette requête est supposée faire.
Écris la réponse de succès correcte (status code, headers minimaux, body).

**EXO 2 : Le gestionnaire de status codes**
Écris une fonction `handleResponse(response)` qui gère proprement les cas suivants :
200, 201, 204, 400, 401, 403, 404, 409, 429, 500.
Chaque case (cas) retourne un objet structuré `{ success, data, error }`.

**EXO 3 : Auditer une API de prison**
On te donne ces routes : `/getAllPrisoners`, `/createNewPrisoner`, `/deletePrisoner?id=5`, `/updatePrisonerStatus`.
Réécris-les en REST propre avec les bonnes méthodes HTTP.
Pour chaque route, indique aussi le status code de succès approprié.

---

## RÉSUMÉ

HTTP c'est le protocole. REST c'est la convention par-dessus.
Savoir lire un status code te dit immédiatement qui a fait l'erreur : le client ou le serveur.
Les headers transportent le contexte : auth, cache, format, trace.
La différence entre 401 et 403 compte : non authentifié vs non autorisé, c'est deux bugs différents.
`fetch()` ne throw pas sur les erreurs HTTP : toujours vérifier `response.ok` ou le status code explicitement.
