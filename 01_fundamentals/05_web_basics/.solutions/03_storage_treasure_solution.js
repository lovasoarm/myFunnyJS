// AVERTISSEMENT : solution de référence. Tu as coché les 4 cases du .solutions/README.md
// avant d'ouvrir ce fichier ? Sinon → ferme, retourne à l'exercice.

/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */

/*MISSION 1 : LE TRÉSOR DU JOUEUR
Crée un objet joueur :
{ name: "Blob", gold: 500, level: 3 }
Sauvegarde-le dans localStorage, récupère-le et affiche :
"Player chargé : Blob niveau 3"
*/
let player = {
  name: "Blob",
  gold: 500,
  level: 3,
};
localStorage.setItem("player", JSON.stringify(player)); //ne retourne rien
let rec = localStorage.getItem("player");
let parse = JSON.parse(rec);
console.log(`Player chargé : ${parse.name} niveau ${parse.level}`);



/*MISSION 2 : LE COMPTEUR IMMORTEL
Crée un compteur qui augmente de +1 à chaque chargement de page.
Étapes :
Lire la valeur dans localStorage
Convertir en nombre
Augmenter de 1
Sauvegarder
Affiche : "Visite numéro : X" */
let saved = localStorage.getItem("count"); // lire ce qui est déjà stocké
let count = saved ? Number(saved) : 0; //convertir en nombre : si rien stocké, démarrer à 0
count++; 
localStorage.setItem("count", String(count));
console.log("Visite numéro :", count);
/*Ce qui se passe à chaque rechargement :
1er chargement → rien stocké  → count = 0 → count++ → sauvegarde 1
2ème chargement → lit "1"     → count = 1 → count++ → sauvegarde 2
3ème chargement → lit "2"     → count = 2 → count++ → sauvegarde 3
*/



/*MISSION 3 : L'INVENTAIRE MAGIQUE
Crée ce tableau :
["épée", "potion", "bouclier"];
Sauvegarde-le dans localStorage. Recharge la page, récupère l'inventaire, affiche chaque item avec forEach().*/
let array = ["épée", "potion", "bouclier"];
localStorage.setItem("array", JSON.stringify(array));// Sauvegarder // → stocke : '["épée","potion","bouclier"]'
let arraySaved = localStorage.getItem("array"); // Récupérer
let inventory = JSON.parse(arraySaved); // → ["épée", "potion", "bouclier"]

inventory.forEach((item) => console.log(`Item : ${item}`));
//Note: JSON.stringify + JSON.parse est toujours la bonne méthode pour stocker des tableaux et objets dans localStorage.



/*MISSION 4 : LE BOUTON DE L'OUBLI
Crée un bouton HTML. Quand on clique : localStorage.clear(). Puis affiche : ""Le trésor a été détruit."" */

/*
HTML:
<button id="btn">Détruire le trésor</button>
<p id="message"></p>
*/
const btn = document.querySelector("#btn");
const message = document.querySelector("#message");

btn.addEventListener("click", function () {
  localStorage.clear();
  message.textContent = "Le trésor a été détruit.";
});



/*MISSION 5 : LE DARK MODE PERSISTANT
Crée un bouton "Toggle Dark Mode". Au clic :

Ajoute ou enlève la classe "dark" sur le body
Sauvegarde l'état dans localStorage
Quand la page recharge, le thème doit rester. (Le mode dark ne disparaît pas juste parce que l'utilisateur a appuyé F5.)

Indice : localStorage.getItem("theme") */

/*
HTML:
<button class="btn">Toggle Dark Mode</button>
*/

const b = document.querySelector(".btn");
//Au chargement : appliquer le thème sauvegardé
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark"); //restaure le thème
}

//Au clic : toggle + sauvegarder l'état réel
b.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  const theme = document.body.classList.contains("dark") ? "dark" : "white"; 
  //1er clic  → dark n'est pas là → il l'ajoute    → DARK
  //2ème clic → dark est là       → il le retire   → WHITE (et ainsi de suite...)
  localStorage.setItem("theme", theme); // sauvegarde le vrai état
});

/*
Le flux complet :
Première visite
    → localStorage vide
    → condition fausse
    → page en WHITE ← défaut

Après avoir cliqué une fois sur dark + rechargé
    → localStorage a "dark"
    → condition vraie
    → page en DARK
*/
