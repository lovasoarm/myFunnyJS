/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */

//MISSION 1 : LE PORTAIL DES HÉROS -> Génère une carte HTML pour chaque héros
let heroes = [
  { name: "Blob", level: 5 },
  { name: "Zorg", level: 9 },
  { name: "Neko", level: 3 },
];
let html = "";
heroes.forEach((hero) => {
  html += `
  <p>Hero : ${hero.name}</p>
  <p>Level : ${hero.level}</p>
  `;
});
//document.body.innerHTML = html;



/*MISSION 2 : LA TAVERNE DES ARMES
Crée une fonction createWeaponCard(weapon) qui retourne ce template : "<div class="weapon">Katana - 120 dmg</div>"
Ensuite génère plusieurs armes depuis un tableau.
*/
let createWeaponCard = function (weapon) {
  return `
        <div class="weapon">
            ${weapon.name} - ${weapon.damage} dmg
        </div>
    `;
};
let html2 = "";
html2 += createWeaponCard({ name: "Katana", damage: 120 });
html2 += createWeaponCard({ name: "Dragonov", damage: 1000 });
//document.body.innerHTML = html2;



//MISSION 3 : LA LISTE DES MONSTRES -> "Génère une liste HTML"
let html3 = "<ul>";
let monsters = [
  { name: "Goblin", hp: 30 },
  { name: "Dragon", hp: 500 },
  { name: "Slime", hp: 10 },
];
monsters.forEach((m) => {
  html3 += `<li>${m.name} - ${m.hp}hp</li>`;
});

html3 += "</ul>";
//document.body.innerHTML = html3;
/*Le moteur JS lit et exécute ça dans l'ordre (concaténation séquentielle):
     +html3 = "<ul>" → la variable contient juste "<ul>"
     +Le forEach tourne 3 fois, et à chaque tour il colle un <li> à la fin
     +html3 += "</ul>" → il ferme la chaîne
*/



/*MISSION 4 : LE PORTAIL MAGIQUE
Crée un <input>. Quand l'utilisateur tape un nom, JS crée dynamiquement une carte joueur : Input : "Blob"
→ <div class="player">Blob vient d'entrer dans l'arène</div>
*/
/* dans html:
<input type="text" placeholder="Entrez un nom">
<button>Entrer</button>
<div id="arena"></div>
*/
let btn = document.querySelector("button");
let i = document.querySelector("input");
let arena = document.querySelector("#arena");

btn.addEventListener("click", function () {
  arena.innerHTML += `
        <div class="player">
            ${i.value} vient d'entrer dans l'arène
        </div>
    `;
  i.value = ""; // vide l'input après
});
/* NB: La différence clé :
-document.body.innerHTML += → recrée tout le body à chaque clic
-arena.innerHTML += → modifie seulement la zone cible, le bouton et l'input sont préservés */



/*MISSION 5 : LA MACHINE À CARTES
Crée une fonction renderCards(list) qui prend n'importe quel tableau d'objets et génère automatiquement tout le HTML. (data → template → DOM)
*/
//dans html : <div id="list"></div>
let listes = document.querySelector("#list");

let renderCards = function (list) {
  let html = ""; // accumule d'abord

  list.forEach((l) => {
    html += `
            <div class="card">
                <p>Hero : ${l.name}</p>
                <p>Level : ${l.level}</p>
            </div>
        `;
  });

  listes.innerHTML = html; // injecte UNE seule fois à la fin
};
renderCards([
  { name: "Blob", level: 5 },
  { name: "Zorg", level: 9 },
  { name: "drew", level: 5 },
  { name: "coloss", level: 9 },
]);
