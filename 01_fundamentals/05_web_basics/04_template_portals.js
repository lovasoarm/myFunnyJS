/*
===========================================================
TEMPLATE PORTALS — TEMPLATE STRINGS & DOM TEMPLATING
===========================================================

Aujourd'hui on attaque un truc **fondamental du web moderne** :

générer du HTML avec JavaScript.

Pourquoi ?

Parce que dans une vraie application :

- les données viennent d’une API
- l’utilisateur interagit
- l’interface doit changer

Donc le navigateur doit **créer du HTML dynamiquement**.

C’est exactement ce que font :

React
Vue
Angular
Next

Mais derrière tout ça…

il y a simplement :

JavaScript + Template + DOM.

Aujourd’hui tu vas comprendre **le moteur brut**.

-----------------------------------------------------------
1) TEMPLATE STRING
-----------------------------------------------------------

Avant ES6, pour construire du texte :

let name = "Blob";

let text = "Hello " + name + " bienvenue";

C’était moche.

JavaScript a ajouté :

Template String.

Syntaxe :

`texte ${variable}`

Les `backticks` permettent :

- interpolation (insérer une variable dans du texte)
- multi-lignes

Exemple :

let name = "Blob";

let message = `Hello ${name}`;

console.log(message);

Résultat :

Hello Blob

-----------------------------------------------------------
2) TEMPLATE MULTI-LIGNE
-----------------------------------------------------------

Avant :

let html = "<div><h1>Hello</h1></div>";

Maintenant :

let html = `
<div>
  <h1>Hello</h1>
</div>
`;

Lisibilité x100.

Très utilisé pour générer du HTML.

-----------------------------------------------------------
3) TEMPLATE + OBJETS
-----------------------------------------------------------

Les templates servent souvent
à afficher des données.

Exemple :

let player = {
  name: "Blob",
  hp: 100
};

let html = `
<div class="player">
  <h2>${player.name}</h2>
  <p>HP : ${player.hp}</p>
</div>
`;

console.log(html);

Résultat :

HTML généré dynamiquement.

-----------------------------------------------------------
4) INJECTER DU HTML DANS LE DOM
-----------------------------------------------------------

Maintenant on l’injecte dans la page.

Le DOM (Document Object Model)
(c’est la structure de la page HTML vue comme un objet JS)

Exemple :

document.body.innerHTML = html;

JS vient de **modifier la page web**.

Tu viens littéralement de créer une interface.

-----------------------------------------------------------
5) GÉNÉRER DU HTML AVEC UNE BOUCLE
-----------------------------------------------------------

Les apps web affichent souvent des listes.

Exemple :

let players = [
  {name:"Blob", hp:100},
  {name:"Zorg", hp:80},
  {name:"Kraken", hp:300}
];

let html = "";

players.forEach(player => {

  html += `
  <div class="player">
    <h3>${player.name}</h3>
    <p>HP : ${player.hp}</p>
  </div>
  `;

});

document.body.innerHTML = html;

Résultat :

JS crée plusieurs blocs HTML.

-----------------------------------------------------------
6) TEMPLATE FUNCTION
-----------------------------------------------------------

Les ingénieurs créent souvent
des fonctions de template.

Pourquoi ?

Pour **réutiliser du HTML dynamique**.

Exemple :

function createPlayerCard(player){

  return `
  <div class="player">
    <h2>${player.name}</h2>
    <p>HP : ${player.hp}</p>
  </div>
  `;

}

Utilisation :

let card = createPlayerCard({name:"Blob", hp:100});

document.body.innerHTML = card;

Maintenant tu peux générer
des centaines de cartes facilement.

-----------------------------------------------------------
7) ATTENTION À innerHTML
-----------------------------------------------------------

innerHTML **remplace le contenu**.

document.body.innerHTML = html;

Donc si tu fais ça plusieurs fois,
le DOM est recréé.

Pour ajouter :

document.body.innerHTML += html;

Mais dans les grosses apps
ça devient lent.

C’est pour ça que les frameworks
ont inventé :

Virtual DOM
(diffing DOM, comparaison intelligente)

Mais tout part de **ce principe simple**.

-----------------------------------------------------------
8) POURQUOI LES INGÉNIEURS DOIVENT SAVOIR ÇA
-----------------------------------------------------------

Parce que derrière :

React
Vue
Angular

il y a toujours :

data → template → DOM.

Si tu comprends ça :

tu comprends le moteur du frontend.

===========================================================
CRAZYDEVS MISSIONS
===========================================================

MISSION 1 — LE PORTAIL DES HÉROS

Crée un tableau :

let heroes = [
 {name:"Blob", level:5},
 {name:"Zorg", level:9},
 {name:"Neko", level:3}
];

Objectif :

générer une carte HTML pour chaque héros.

Format attendu :

Hero : Blob
Level : 5


-----------------------------------------------------------
MISSION 2 — LA TAVERNE DES ARMES
-----------------------------------------------------------

Crée une fonction :

createWeaponCard(weapon)

weapon =

{
 name:"Katana",
 damage:120
}

Elle doit retourner un template HTML :

<div class="weapon">
  Katana - 120 dmg
</div>

Ensuite :

génère plusieurs armes.

-----------------------------------------------------------
MISSION 3 — LA LISTE DES MONSTRES
-----------------------------------------------------------

Crée un tableau :

[
 {name:"Goblin", hp:30},
 {name:"Dragon", hp:500},
 {name:"Slime", hp:10}
]

Génère une liste HTML :

<ul>
<li>Goblin - 30hp</li>
</ul>

-----------------------------------------------------------
MISSION 4 — LE PORTAIL MAGIQUE
-----------------------------------------------------------

Crée un input HTML.

Quand l’utilisateur tape un nom :

JS crée dynamiquement une carte joueur.

Exemple :

Input : "Blob"

Résultat :

<div class="player">
Blob vient d’entrer dans l’arène
</div>

-----------------------------------------------------------
MISSION 5 — LA MACHINE À CARTES
-----------------------------------------------------------

Crée une fonction :

renderCards(list)

Elle prend un tableau d’objets.

Elle génère automatiquement
tout le HTML.

Principe :

data → template → DOM

C’est exactement
le moteur des frameworks.

===========================================================
RÉSUMÉ SIMPLE
===========================================================

Template strings :

`Hello ${name}`

Permettent :

- HTML dynamique
- interpolation (insertion de variables)
- multi-ligne

Ensuite :

JS injecte ce HTML dans le DOM.

Et tu viens de comprendre
la base technique
de toutes les interfaces web modernes.
*/
