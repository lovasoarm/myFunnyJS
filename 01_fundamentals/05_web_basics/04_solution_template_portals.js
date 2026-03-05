//MISSION 1 — LE PORTAIL DES HÉROS
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

//MISSION 2 — LA TAVERNE DES ARMES
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

//MISSION 3 — LA LISTE DES MONSTRES
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
/*Rendu correct :
html<ul>
    <li>Goblin - 30hp</li>
    <li>Dragon - 500hp</li>
    <li>Slime - 10hp</li>
</ul> */

//MISSION 4 — LE PORTAIL MAGIQUE
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

//MISSION 5 — LA MACHINE À CARTES
//html : <div id="list"></div>
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
