/*
===========================================================
STORAGE TREASURE — LE TRÉSOR DU NAVIGATEUR
===========================================================

Bienvenue dans un coin très important du web.

Ton navigateur peut garder des données.

Même si la page est rechargée.
Même si l’utilisateur ferme le site.

C’est comme un petit coffre-fort.

Deux outils principaux :

1) LocalStorage
2) Cookies

Aujourd’hui on va comprendre surtout LocalStorage.

Pourquoi ?

Parce que c’est simple et utilisé partout.

-----------------------------------------------------------
1) LE PROBLÈME DU WEB NORMAL
-----------------------------------------------------------

Un site web classique oublie tout.

Tu recharges la page :

POUF.

Toutes les variables disparaissent.

Exemple :

let score = 100;

Si tu refresh la page :

score = perdu.

Donc les navigateurs ont inventé :

LOCAL STORAGE.

Un petit disque dur dans ton navigateur.

-----------------------------------------------------------
2) LOCALSTORAGE — LE COFFRE DU NAVIGATEUR
-----------------------------------------------------------

LocalStorage = stockage permanent dans le navigateur.

Permanent veut dire :

- même si tu refresh
- même si tu fermes l’onglet
- même si tu reviens demain

Les données restent.

Mais il y a une règle importante :

LocalStorage stocke UNIQUEMENT des STRINGS
(texte).

Même les nombres deviennent du texte.

-----------------------------------------------------------
3) SAUVEGARDER UN TRÉSOR
-----------------------------------------------------------

Pour sauvegarder :

localStorage.setItem("clé", "valeur");

Exemple :

localStorage.setItem("hero", "Blob");

Maintenant ton navigateur a stocké :

hero → Blob

-----------------------------------------------------------
4) RÉCUPÉRER LE TRÉSOR
-----------------------------------------------------------

Pour lire une donnée :

localStorage.getItem("clé")

Exemple :

let hero = localStorage.getItem("hero");

console.log(hero);

Résultat :

Blob

-----------------------------------------------------------
5) SUPPRIMER UN TRÉSOR
-----------------------------------------------------------

Supprimer un élément :

localStorage.removeItem("clé");

Exemple :

localStorage.removeItem("hero");

Tout supprimer :

localStorage.clear();

Attention :

clear() détruit tout le coffre.

-----------------------------------------------------------
6) PROBLÈME IMPORTANT : LES OBJETS
-----------------------------------------------------------

LocalStorage accepte seulement des strings.

Donc ceci ne marche pas :

let player = {name:"Blob", hp:100};

localStorage.setItem("player", player);

Résultat :

[object Object]

Donc on doit transformer l’objet.

-----------------------------------------------------------
7) JSON — LA MAGIE
-----------------------------------------------------------

JSON.stringify()
(objet → texte)

JSON.parse()
(texte → objet)

Exemple :

let player = {name:"Blob", hp:100};

localStorage.setItem(
  "player",
  JSON.stringify(player) → stocke : '{"name":"Blobzilla","score":9000}'
);

Pour récupérer :

let data = localStorage.getItem("player");

let playerObject = JSON.parse(data);

console.log(playerObject.name);

-----------------------------------------------------------
8) À QUOI ÇA SERT EN VRAI ?
-----------------------------------------------------------

LocalStorage sert pour :

- sauvegarder un thème dark/light
- garder un token login
- stocker un panier e-commerce
- mémoriser préférences utilisateur
- sauvegarder une progression jeu

C’est un mini disque dur du navigateur.

-----------------------------------------------------------
9) COOKIES (VERSION RAPIDE)
-----------------------------------------------------------

Cookies = autre système de stockage.

Différence principale :

Cookies sont envoyés automatiquement
au serveur.

LocalStorage reste seulement dans le navigateur.

Cookies servent souvent pour :

- authentification
- sessions
- tracking

Mais LocalStorage est beaucoup plus simple.

===========================================================
CRAZYDEVS MISSIONS
===========================================================

MISSION 1 — LE TRÉSOR DU JOUEUR

Crée un objet joueur :

{
 name: "Blob",
 gold: 500,
 level: 3
}

Sauvegarde ce joueur dans localStorage.

Ensuite récupère-le et affiche :

"Player chargé : Blob niveau 3"


-----------------------------------------------------------
MISSION 2 — LE COMPTEUR IMMORTEL
-----------------------------------------------------------

Crée un compteur.

Chaque fois que la page charge :

le compteur augmente de +1.

Indice :

1) lire localStorage
2) convertir en nombre
3) augmenter
4) sauvegarder

Affiche :

"Visite numéro : X"


-----------------------------------------------------------
MISSION 3 — L’INVENTAIRE MAGIQUE
-----------------------------------------------------------

Crée un tableau :

["épée","potion","bouclier"]

Sauvegarde-le dans localStorage.

Recharge la page et récupère l’inventaire.

Affiche chaque item avec :

forEach()


-----------------------------------------------------------
MISSION 4 — LE BOUTON DE L’OUBLI
-----------------------------------------------------------

Crée un bouton HTML.

Quand on clique :

localStorage.clear()

Puis affiche :

"Le trésor a été détruit."


-----------------------------------------------------------
MISSION 5 — LE DARK MODE PERSISTANT
-----------------------------------------------------------

Crée un bouton :

"Toggle Dark Mode"

Quand on clique :

1) ajoute ou enlève une classe "dark"
2) sauvegarde l’état dans localStorage

Quand la page recharge :

le thème doit rester.

Indice :

localStorage.getItem("theme")

===========================================================
RÉSUMÉ SIMPLE
===========================================================

LocalStorage = coffre du navigateur.

Tu peux :

setItem → sauvegarder
getItem → lire
removeItem → supprimer
clear → tout effacer

Mais :

LocalStorage = seulement STRING.

Donc objets → JSON.stringify
et récupération → JSON.parse

Si tu maîtrises ça :

tu peux construire
des apps web intelligentes
qui se souviennent de l’utilisateur.
*/
