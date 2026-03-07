/*
===========================================================
WEB HELPERS — DOM & EVENTS
===========================================================

Bienvenue dans la vraie vie du développeur frontend.

Quand tu codes pour le web,
tu fais toujours les mêmes choses :

- sélectionner un élément
- écouter un événement
- modifier du contenu
- ajouter une classe
- créer un élément
- supprimer un élément

Donc les ingénieurs créent souvent
des **helpers**.

Helper = petite fonction utilitaire
(une fonction qui simplifie une tâche répétée)

Exemple :

au lieu d’écrire ça 50 fois :

document.querySelector("#button")

on crée un helper :

function $(selector){
  return document.querySelector(selector);
}

et on écrit juste :

$("#button")

C’est plus rapide.
Plus propre.
Plus lisible.

C’est exactement ce que font
les frameworks.

-----------------------------------------------------------
1) HELPER DE SÉLECTION DOM
-----------------------------------------------------------

Le DOM (Document Object Model)
(la structure de la page HTML vue comme un objet JS)

Sélectionner un élément :

document.querySelector()

On crée un helper :

*/
/*
function $(selector) { -> "$" est un nom valide
  return document.querySelector(selector);
}
*/
/*

Utilisation :

$("#title")

-----------------------------------------------------------
2) SÉLECTION MULTIPLE
-----------------------------------------------------------

Pour récupérer plusieurs éléments :

document.querySelectorAll()

Helper :

*/
/*
function $all(selector) {
  return document.querySelectorAll(selector);
}
*/
/*

-----------------------------------------------------------
3) HELPER EVENT LISTENER
-----------------------------------------------------------

Pour écouter un événement :

element.addEventListener()

Exemple classique :

button.addEventListener("click", fn)

On crée un helper :

*/
/*
function on(element, event, callback) {
  element.addEventListener(event, callback);
}
*/
/*

Utilisation :

on($("#btn"), "click", () => {
  console.log("clicked")
})

-----------------------------------------------------------
4) HELPER POUR CRÉER UN ÉLÉMENT
-----------------------------------------------------------

Créer un élément :

document.createElement()

Helper :

*/
/*
function create(tag) {
  return document.createElement(tag);
}
*/
/*

Exemple :

let div = create("div")

-----------------------------------------------------------
5) HELPER POUR AJOUTER AU DOM
-----------------------------------------------------------

appendChild = ajouter un élément dans un autre

*/
/*
function append(parent, child) {
  parent.appendChild(child);
}
*/
/*

-----------------------------------------------------------
6) HELPER POUR TEXTE
-----------------------------------------------------------

textContent
(modifie le texte d’un élément)

*/
/*
function setText(element, text) {
  element.textContent = text;
}
*/
/*

-----------------------------------------------------------
7) HELPER POUR LES CLASSES
-----------------------------------------------------------

classList
(gestion des classes CSS)

*/
/*
function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}
*/
/*

-----------------------------------------------------------
8) HELPER POUR SUPPRIMER
-----------------------------------------------------------

remove()
(supprime un élément du DOM)

*/
/*
function remove(element) {
  element.remove();
}
*/
/*

===========================================================
EXEMPLE COMPLET
===========================================================

*/
/*
let button = create("button");

setText(button, "Spawn Monster");

append(document.body, button);

on(button, "click", () => {
  let monster = create("div");

  setText(monster, "Un slime apparaît");

  addClass(monster, "monster");

  append(document.body, monster);
});
*/
/*

Ce que tu viens de faire :

- créer un bouton
- écouter un événement
- créer un élément
- l’ajouter dans la page

C’est la base du frontend.

-----------------------------------------------------------
POURQUOI LES INGÉNIEURS FONT ÇA
-----------------------------------------------------------

Parce que dans une vraie app :

tu manipules le DOM **des centaines de fois**.

Donc tu crées des helpers pour :

- réduire le code
- éviter les répétitions
- rendre le code lisible

C’est la base de nombreuses librairies.

Exemple historique :

jQuery faisait exactement ça.

$("#button").click(fn)

-----------------------------------------------------------
RÉSUMÉ SIMPLE
-----------------------------------------------------------

Helpers = fonctions utilitaires.

Ils simplifient :

- DOM
- events
- création d’éléments
- manipulation HTML

C’est une **couche d’abstraction**
(une simplification d’un système complexe).

===========================================================
MISSIONS
===========================================================

MISSION 1 — LE BOUTON CHAOS

Crée un bouton :

"Spawn Zombie"

Quand on clique :

un nouveau zombie apparaît
dans la page.

-----------------------------------------------------------

MISSION 2 — L’ARMÉE DES MONSTRES

Crée un bouton :

"Spawn 5 monsters"

Quand on clique :

5 monstres apparaissent.

Utilise une boucle.

-----------------------------------------------------------

MISSION 3 — LE DESTRUCTEUR

Chaque monstre doit avoir un bouton :

"Kill"

Quand on clique :

le monstre disparaît.

-----------------------------------------------------------

MISSION 4 — LE SPAWNER ALÉATOIRE

Crée un tableau :

["Goblin","Slime","Dragon","Ghost"]

À chaque clic :

un monstre aléatoire apparaît.

(Math.random = nombre aléatoire)

-----------------------------------------------------------

MISSION 5 — LE HELPER SUPRÊME

Crée une fonction :

spawnMonster(name)

Elle doit :

- créer un élément
- lui donner un texte
- l’ajouter dans la page

Puis utilise-la pour créer
10 monstres différents.

-----------------------------------------------------------

Si tu comprends ces helpers :

tu comprends
la **mécanique réelle du frontend**.

Les frameworks ne font
que l’automatiser.
*/
