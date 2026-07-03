/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */

// MISSION 1 : LE RADAR À JOUEURS
/*Endpoint : https://jsonplaceholder.typicode.com/users
Récupère les utilisateurs
Affiche leurs noms
Affiche combien il y en a
Indice : data.length
*/
async function loadUsers() {
  let response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) return;
  let data = await response.json();
  // forEach : plus lisible qu'un for classique sur un array
  data.forEach((user) => console.log(user.name));
  console.log(`Total : ${data.length} joueurs`);
}
loadUsers();



/*MISSION 2 : FILTRAGE CHAOTIQUE
Avec les mêmes users, trouve ceux dont id > 5. Utilise filter() et affiche seulement leurs noms.
*/
async function filterUser() {
  let response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) return;
  let data = await response.json();
  let filteredId = data.filter((user) => user.id > 5); // condition simple
  filteredId.forEach((user) => console.log(user.name));

  console.log(`Total : ${filteredId.length} joueurs avec id > 5`); // compte les filtrés
}
filterUser();



/*MISSION 3 : TRANSFORMATION CRAZY
Transforme les utilisateurs avec map en cette structure :
{
  heroName: name,
  secretCity: address.city
}
Affiche le nouveau tableau.*/
async function transform() {
  let response = await fetch("https://jsonplaceholder.typicode.com/users");
  if (!response.ok) return;
  let data = await response.json();

  let newObject = data.map((d) => ({
    // Il faut retourner un objet par élément avec => ({ }) : les parenthèses autour des accolades sont obligatoires.
    heroName: d.name,
    secretCity: d.address.city,
  }));
  console.log(newObject);
}
transform();


/*
MISSION 4 : FABRIQUE DE MONSTRES
Envoie un POST avec ce corps :

{
  name: "Blobzilla",
  danger: 9000
}
Affiche la réponse du serveur.
*/
async function monstre() {
  let response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Blobzilla",
      danger: 9000,
    }),
  });

  if (!response.ok) return;

  let data = await response.json();
  console.log(data); // affiche la réponse du serveur
}
monstre();



/*MISSION 5 : CHAOS NETWORK
Teste une URL cassée :
fetch("https://jsonplaceholder.typicode.com/WRONG");
Observe response.ok et response.status. Comprends comment détecter et gérer une erreur réseau proprement.
*/
async function chaos() {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/WRONG");

    console.log(response.ok); //  false : la requête a échoué
    console.log(response.status); //  404 : ressource introuvable

    if (!response.ok) {
      console.log("Erreur HTTP :", response.status); // géré ici, pas dans catch
      return;
    }

    let data = await response.json();
    console.log(data);
  } catch (e) {
    console.log("Erreur réseau :", e); //  uniquement si pas de connexion
  }
}

chaos();

/* ### Le flux complet
URL cassée (404)
fetch() reçoit une réponse quand même
//       ↓
// response.ok     → false
// response.status → 404
//       ↓
// early return 
// catch jamais atteint

// URL inexistante (pas de réseau)
//       ↓
// fetch() ne reçoit rien
//       ↓
// exception lancée
//       ↓
// catch se déclenche 
//Règle simple : try/catch attrape les erreurs réseau. Les erreurs HTTP (404, 500) passent dans le try : c'est response.ok qui les détecte.*/
