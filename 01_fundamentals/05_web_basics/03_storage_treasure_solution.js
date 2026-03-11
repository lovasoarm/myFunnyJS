//MISSION 1 — LE TRÉSOR DU JOUEUR
let player = {
  name: "Blob",
  gold: 500,
  level: 3,
};
localStorage.setItem("player", JSON.stringify(player)); //ne retourne rien
let rec = localStorage.getItem("player");
let parse = JSON.parse(rec);
console.log(`Player chargé : ${parse.name} niveau ${parse.level}`);

//MISSION 2 — LE COMPTEUR IMMORTEL
// 1. lire ce qui est déjà stocké
let saved = localStorage.getItem("count");

// 2. convertir en nombre : si rien stocké, démarrer à 0
let count = saved ? Number(saved) : 0;

// 3. augmenter
count++;

// 4. sauvegarder
localStorage.setItem("count", String(count));

console.log("Visite numéro :", count);

/*Ce qui se passe à chaque rechargement :
1er chargement → rien stocké  → count = 0 → count++ → sauvegarde 1
2ème chargement → lit "1"     → count = 1 → count++ → sauvegarde 2
3ème chargement → lit "2"     → count = 2 → count++ → sauvegarde 3
*/

//MISSION 3 — L’INVENTAIRE MAGIQUE
let array = ["épée", "potion", "bouclier"];

// Sauvegarder
localStorage.setItem("array", JSON.stringify(array));
// → stocke : '["épée","potion","bouclier"]'

// Récupérer
let arraySaved = localStorage.getItem("array");
let inventory = JSON.parse(arraySaved);
// → ["épée", "potion", "bouclier"]

inventory.forEach((item) => console.log(`Item : ${item}`));
//Note: JSON.stringify + JSON.parse est toujours la bonne méthode pour stocker des tableaux et objets dans localStorage.

//MISSION 4 — LE BOUTON DE L’OUBLI
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

//MISSION 5 — LE DARK MODE PERSISTANT
/*
HTML:
<button class="btn">Toggle Dark Mode</button>
*/

const b = document.querySelector(".btn");

// 1. Au chargement — appliquer le thème sauvegardé
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark"); //  restaure le thème
}

// 2. Au clic — toggle + sauvegarder l'état réel
b.addEventListener("click", function () {
  document.body.classList.toggle("dark");

  const theme = document.body.classList.contains("dark") ? "dark" : "white";
  localStorage.setItem("theme", theme); // sauvegarde le vrai état
});

/*
Le flux complet :
Page charge
    ↓
localStorage a "dark" ? → ajoute classe dark sur body
    ↓
Clic bouton
    ↓
toggle dark sur body
    ↓
body a la classe dark ? → sauvegarde "dark"
                        → sauvegarde "white"
*/
