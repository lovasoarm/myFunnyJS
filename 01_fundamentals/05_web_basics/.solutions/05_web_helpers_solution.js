// AVERTISSEMENT : solution de référence. Tu as coché les 4 cases du .solutions/README.md
// avant d'ouvrir ce fichier ? Sinon → ferme, retourne à l'exercice.

/* STOP.
   As-tu fini l'exercice sans regarder ?
   As-tu écrit ton propre exemple ?
   Peux-tu réexpliquer sans regarder ce fichier ?
   Si non, ferme ce fichier maintenant. */

function create(elt) {
  return document.createElement(elt);
}
function append(parent, element) {
  parent.appendChild(element);
}
function addTitle(parent, content) {
  parent.textContent = content;
}
function on(cible, event, callback) {
  cible.addEventListener(event, callback);
}
function remove(element) {
  element.remove();
}


//MISSION 1 : LE BOUTON CHAOS -> Crée un bouton "Spawn Zombie". Quand on clique, un nouveau zombie apparaît dans la page.
let button = create("button");
addTitle(button, "Spawn Zombie");
append(document.body, button);

on(button, "click", () => {
  let p = create("p"); // nouveau p créé à chaque clic
  addTitle(p, "grrr un zombie apparaît !");
  append(document.body, p);
});



//MISSION 2 : L’ARMÉE DES MONSTRES -> Crée un bouton "Spawn 5 monsters". Quand on clique, 5 monstres apparaissent. Utilise une boucle.
let button2 = create("button");
addTitle(button2, "Spawn 5 monsters");
append(document.body, button2);

on(button2, "click", () => {
  for (let i = 0; i < 5; i++) {
    // boucle à l'intérieur du clic
    let p = create("p");
    addTitle(p, "grrr un zombie apparaît !");
    append(document.body, p);
  }
});



//MISSION 3 : LE DESTRUCTEUR -> Chaque monstre doit avoir un bouton "Kill". Quand on clique dessus, le monstre disparaît.
let button3 = create("button");
addTitle(button3, "Spawn monsters with kill");
append(document.body, button3);

on(button3, "click", () => {
  for (let i = 0; i < 5; i++) {
    let p = create("p");
    let kill = create("button");
    addTitle(kill, "kill");

    addTitle(p, "🧟 un zombie apparaît !");
    append(p, kill); // kill est DANS p (lié au zombie)
    append(document.body, p); // p (avec kill dedans) ajouté au body

    on(kill, "click", () => {
      // kill supprime son propre zombie
      p.remove();
    });
  }
});



//MISSION 4 : LE SPAWNER ALÉATOIRE -> À chaque clic, un monstre aléatoire du tableau apparaît.
let monsters = ["Goblin", "Slime", "Dragon", "Ghost"];

function randomItem(tab) {
  return tab[Math.floor(Math.random() * tab.length)];
}
let button4 = create("button");
addTitle(button4, "random monster");
append(document.body, button4);

on(button4, "click", () => {
  let p = create("p");
  addTitle(p, randomItem(monsters));
  append(document.body, p);
});



//MISSION 5 : LE HELPER SUPRÊME -> Crée une fonction spawnMonster(name) qui crée un élément, lui donne un texte, et l'ajoute dans la page. Utilise-la pour spawner 10 monstres différents.
function spawnMonster(name) {
  let elt = create("p");
  addTitle(elt, `grrrr ${name}`);
  append(document.body, elt);
}
const allMonsters = [
  "Art the Clown",
  "Leatherface",
  "Dracula",
  "Frankenstein",
  "La Momie",
  "Le Loup-Garou",
  "Freddy Krueger",
  "Jason Voorhees",
  "Michael Myers",
  "Pennywise",
];
allMonsters.forEach((name) => spawnMonster(name));
