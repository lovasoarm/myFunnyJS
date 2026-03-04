/*
===========================================================
FETCH ADVENTURE — MISSIONS RÉSEAU POUR CERVEAU CURIEUX
===========================================================

Bienvenue dans un autre monde du JavaScript.

Jusqu’ici tu manipulais :
- des variables
- des tableaux
- le DOM

Mais les vraies applications font autre chose.

Elles parlent à Internet.

Quand ton app récupère :
- des utilisateurs
- des posts
- des images
- des données météo
- des scores

Elle fait une REQUÊTE HTTP.

HTTP (protocole de communication du web)

Ton programme envoie une requête → un serveur répond.

Et en JavaScript moderne, l’outil pour ça s’appelle :

FETCH.

-----------------------------------------------------------
1) FETCH : PARLER À UN SERVEUR
-----------------------------------------------------------

Syntaxe simple :

fetch("URL")

Exemple :

fetch("https://jsonplaceholder.typicode.com/users")

Cette ligne envoie une requête GET
(GET = demander des données).

Mais fetch ne retourne PAS directement les données.

Il retourne une PROMISE
(Promise = valeur qui arrivera plus tard).

Pourquoi ?

Parce que le réseau prend du temps.

Donc JS dit :

"Ok je lance la requête, la réponse arrivera après."

-----------------------------------------------------------
2) PROMISE — LA VALEUR DU FUTUR
-----------------------------------------------------------

Quand tu fais :

fetch(url)

tu reçois :

Promise<Response>

Response = objet représentant la réponse du serveur.

Pour lire les données :

response.json()

Pourquoi ?

Parce que la plupart des APIs renvoient du JSON
(JSON = format texte pour transporter des objets).

Exemple complet :

fetch("https://jsonplaceholder.typicode.com/users")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });

Ce code veut dire :

1) envoie requête
2) quand la réponse arrive
3) transforme en JSON
4) utilise les données

-----------------------------------------------------------
3) VERSION MODERNE : ASYNC / AWAIT
-----------------------------------------------------------

Les ingénieurs modernes préfèrent :

async / await

Pourquoi ?

Parce que ça ressemble à du code normal.

Exemple :

async function loadUsers() {

  let response = await fetch("https://jsonplaceholder.typicode.com/users");

  let data = await response.json();

  console.log(data);

}

loadUsers();

await = attendre la réponse

Mais seulement possible dans une fonction async.

-----------------------------------------------------------
4) STRUCTURE D’UNE RÉPONSE
-----------------------------------------------------------

Quand fetch reçoit une réponse,
tu reçois un objet Response.

Important :

response.ok
(response correcte HTTP)

response.status
(code HTTP : 200, 404, 500)

response.json()
(transformer en données JS)

Exemple propre :

async function loadUsers(){

  let response = await fetch("https://jsonplaceholder.typicode.com/users");

  if(!response.ok){
    console.log("Erreur serveur");
    return; -> sort de la fonction entière, tout s'arrête, l'execution code restant ne continue plus
  }

  let users = await response.json();

  console.log(users);

}

-----------------------------------------------------------
5) GESTION DES ERREURS
-----------------------------------------------------------

Le réseau peut casser.

Donc on protège avec try/catch.

try
(code qui peut échouer)

catch
(gestion erreur)

Exemple :

async function loadUsers(){

  try{

    let response = await fetch("https://jsonplaceholder.typicode.com/users");

    let data = await response.json();

    console.log(data);

  }catch(error){

    console.log("Réseau cassé :", error);

  }

}

-----------------------------------------------------------
6) POST — ENVOYER DES DONNÉES
-----------------------------------------------------------

Fetch peut aussi envoyer des données.

Exemple :

Créer un utilisateur.

fetch("https://jsonplaceholder.typicode.com/users", {

  method: "POST",

  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify({
    name: "Blob",
    power: "CrazyDev"
  })

})

JSON.stringify
(transformer objet JS → texte JSON)

-----------------------------------------------------------
7) LA RÈGLE MENTALE
-----------------------------------------------------------

Fetch =

1) envoyer requête
2) attendre réponse
3) transformer JSON
4) utiliser données

C’est tout.

Mais c’est la base de :

- React apps
- mobile apps
- dashboards
- SaaS
- APIs
- microservices

Tout.

===========================================================
CRAZYDEVS MISSIONS
===========================================================

MISSION 1 — LE RADAR À JOUEURS

Va chercher des joueurs ici :

https://jsonplaceholder.typicode.com/users

Objectif :

1) récupérer les utilisateurs
2) afficher leurs noms
3) afficher combien il y en a

Indice :
data.length


-----------------------------------------------------------
MISSION 2 — FILTRAGE CHAOTIQUE
-----------------------------------------------------------

Toujours avec les users.

Trouve les utilisateurs dont :

id > 5

Utilise :

filter()

Affiche seulement leurs noms.


-----------------------------------------------------------
MISSION 3 — TRANSFORMATION CRAZY
-----------------------------------------------------------

Transforme les utilisateurs avec map.

Structure finale :

{
  heroName: name,
  secretCity: address.city
}

Affiche le nouveau tableau.


-----------------------------------------------------------
MISSION 4 — FABRIQUE DE MONSTRES
-----------------------------------------------------------

Envoie un POST.

Crée un monstre :

{
  name: "Blobzilla",
  danger: 9000
}

Affiche la réponse du serveur.


-----------------------------------------------------------
MISSION 5 — CHAOS NETWORK
-----------------------------------------------------------

Teste une URL cassée.

fetch("https://jsonplaceholder.typicode.com/WRONG")

Observe :

response.ok
response.status

Comprends comment gérer une erreur.

===========================================================
RÉSUMÉ
===========================================================

Fetch = communication réseau.

Tu envoies une requête.
Le serveur répond.
Tu transformes la réponse.
Tu utilises les données.

Sans fetch :

Pas d'app moderne.

Juste des pages mortes.

Fin de l’aventure fetch.
*/

/*
BONUS: TRY/CATCH/finally
try {
  // code qui peut planter
} catch(e) {
  // si ça plante → on arrive ici
} finally {
  // s'exécute TOUJOURS, que ça plante ou pas
}

ex:
async function loadData() {
  console.log("⏳ Chargement...");

  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Erreur HTTP : " + response.status);

    let data = await response.json();
    console.log("Données reçues :", data.length, "users");

  } catch(e) {
    console.log("Erreur :", e.message);

  } finally {
    console.log("Chargement terminé."); // s'affiche toujours
    // idéal pour cacher un spinner, fermer une connexion...
  }
}

loadData();


Ce qui s'affiche si tout va bien :

⏳ Chargement...
 Données reçues : 10 users
 Chargement terminé.

Ce qui s'affiche si erreur :
⏳ Chargement...
Erreur : Erreur HTTP : 404
Chargement terminé.  ← finally s'exécute quand même


// Sans throw — l'erreur passe inaperçue
if (!response.ok) return; // on sort silencieusement

// Avec throw — on force le catch à se déclencher
if (!response.ok) throw new Error("Erreur HTTP : " + response.status);
//                                 ↑ catch(e) reçoit ce message dans e.message

### Résumé

try     → code risqué
catch   → plan B si ça plante
finally → s'exécute TOUJOURS (spinner, log, nettoyage)
throw   → lancer manuellement une erreur vers le catch

Cas d'usage de finally : cacher un spinner de chargement, fermer une connexion base de données, logger la fin d'une opération — peu importe si ça a réussi ou échoué.

  */
