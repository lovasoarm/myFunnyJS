# FETCH ADVENTURE : MISSIONS RÉSEAU POUR CERVEAU CURIEUX

Bienvenue dans un autre monde du JavaScript.

Jusqu'ici tu manipulais des variables, des tableaux, le DOM. Mais les vraies applications font autre chose.

**Elles parlent à Internet.**

Quand ton app récupère des utilisateurs, des posts, des données météo, des scores : elle fait une **requête HTTP**.

**HTTP** = protocole de communication du web. Ton programme envoie une requête → un serveur répond.

En JavaScript moderne, l'outil pour ça s'appelle **FETCH**.

---

## 1) FETCH : PARLER À UN SERVEUR

```javascript
fetch("https://jsonplaceholder.typicode.com/users");
```

Cette ligne envoie une requête **GET** (GET = demander des données).

Mais `fetch` ne retourne **pas** directement les données. Il retourne une **Promise**.

**Promise** = valeur qui arrivera plus tard.

Pourquoi ? Parce que le réseau prend du temps. JS dit : _"Ok je lance la requête, la réponse arrivera après."_ Et il continue à exécuter le reste du code sans bloquer.

---

## 2) PROMISE — LA VALEUR DU FUTUR

Quand tu fais `fetch(url)`, tu reçois une `Promise<Response>`.

`Response` = objet représentant la réponse du serveur. Pour lire les données :

```javascript
response.json();
```

Pourquoi ? Parce que la plupart des APIs renvoient du **JSON** : un format texte pour transporter des objets.

Exemple complet avec `.then()` :

```javascript
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  });
```

Ce code signifie : envoie la requête → quand la réponse arrive → transforme en JSON → utilise les données.

---

## 3) VERSION MODERNE : ASYNC / AWAIT

Les ingénieurs modernes préfèrent `async/await`. Pourquoi ? Parce que ça ressemble à du code normal — plus de chaîne de `.then()`.

```javascript
async function loadUsers() {
  let response = await fetch("https://jsonplaceholder.typicode.com/users");
  let data = await response.json();
  console.log(data);
}

loadUsers();
```

`await` = attendre la réponse avant de passer à la ligne suivante. Uniquement utilisable dans une fonction `async`.

---

## 4) STRUCTURE D'UNE RÉPONSE

L'objet `Response` expose des propriétés importantes :

```javascript
response.ok; // true si HTTP 200-299, false sinon
response.status; // code HTTP : 200, 404, 500...
response.json(); // transformer la réponse en données JS
```

Exemple propre avec vérification :

```javascript
async function loadUsers() {
  let response = await fetch("https://jsonplaceholder.typicode.com/users");

  if (!response.ok) {
    console.log("Erreur serveur :", response.status);
    return; // sort de la fonction — l'exécution s'arrête ici
  }

  let users = await response.json();
  console.log(users);
}
```

---

## 5) GESTION DES ERREURS : TRY / CATCH / FINALLY

Le réseau peut casser. On protège avec `try/catch`.

```javascript
async function loadUsers() {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/users");
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Réseau cassé :", error);
  }
}
```

Structure complète avec `finally` :

```javascript
try {
  // code qui peut planter
} catch (e) {
  // si ça plante → on arrive ici
} finally {
  // s'exécute TOUJOURS, que ça plante ou pas
}
```

```javascript
async function loadData() {
  console.log("Chargement...");

  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Erreur HTTP : " + response.status);

    let data = await response.json();
    console.log("Données reçues :", data.length, "users");
  } catch (e) {
    console.log("Erreur :", e.message);
  } finally {
    console.log("Chargement terminé."); // s'affiche toujours
  }
}
```

Ce qui s'affiche si tout va bien :

```
Chargement...
Données reçues : 10 users
Chargement terminé.
```

Ce qui s'affiche si erreur :

```
Chargement...
Erreur : Erreur HTTP : 404
Chargement terminé.  ← finally s'exécute quand même
```

**`throw` vs retour silencieux :**

```javascript
// Sans throw : l'erreur passe inaperçue
if (!response.ok) return; // on sort silencieusement

// Avec throw : on force le catch à se déclencher
if (!response.ok) throw new Error("Erreur HTTP : " + response.status);
//                                 ↑ catch(e) reçoit ce message dans e.message
```

| Bloc      | Rôle                                             |
| --------- | ------------------------------------------------ |
| `try`     | code risqué                                      |
| `catch`   | plan B si ça plante                              |
| `finally` | s'exécute **toujours** — spinner, log, nettoyage |
| `throw`   | lancer manuellement une erreur vers le `catch`   |

> `finally` est fait pour les tâches de nettoyage : cacher un spinner de chargement, fermer une connexion base de données, logger la fin d'une opération : peu importe si ça a réussi ou échoué.

---

## 6) POST — ENVOYER DES DONNÉES

`fetch` peut aussi envoyer des données, pas seulement en recevoir :

```javascript
fetch("https://jsonplaceholder.typicode.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Blob",
    power: "CrazyDev",
  }),
});
```

`JSON.stringify` = transformer un objet JS en texte JSON pour le transport.

---

## 7) LA RÈGLE MENTALE

```
Fetch =
1) envoyer requête
2) attendre réponse
3) transformer JSON
4) utiliser données
```

C'est tout. Mais c'est la base de : React apps, mobile apps, dashboards, SaaS, APIs, microservices. Tout.

---

# MISSIONS CRAZYDЕВS

## MISSION 1 : LE RADAR À JOUEURS

Endpoint : `https://jsonplaceholder.typicode.com/users`

1. Récupère les utilisateurs
2. Affiche leurs noms
3. Affiche combien il y en a

_Indice : `data.length`_

---

## MISSION 2 : FILTRAGE CHAOTIQUE

Avec les mêmes users, trouve ceux dont `id > 5`. Utilise `filter()` et affiche seulement leurs noms.

---

## MISSION 3 : TRANSFORMATION CRAZY

Transforme les utilisateurs avec `map` en cette structure :

```javascript
{
  heroName: name,
  secretCity: address.city
}
```

Affiche le nouveau tableau.

---

## MISSION 4 : FABRIQUE DE MONSTRES

Envoie un POST avec ce corps :

```javascript
{
  name: "Blobzilla",
  danger: 9000
}
```

Affiche la réponse du serveur.

---

## MISSION 5 : CHAOS NETWORK

Teste une URL cassée :

```javascript
fetch("https://jsonplaceholder.typicode.com/WRONG");
```

Observe `response.ok` et `response.status`. Comprends comment détecter et gérer une erreur réseau proprement.

---

# RÉSUMÉ

Fetch = communication réseau. Tu envoies une requête. Le serveur répond. Tu transformes la réponse. Tu utilises les données.

Sans fetch : pas d'app moderne. Juste des pages mortes.
