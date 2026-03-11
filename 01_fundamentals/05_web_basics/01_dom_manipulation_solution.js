/*
===========================================================
DOM MANIPULATION
===========================================================

Si tu veux devenir ingénieur frontend,
tu dois comprendre une vérité simple :

Le navigateur est une machine.
Le DOM est une structure en mémoire.
JS est l’outil qui la manipule.

Si tu manipules le DOM sans comprendre sa logique,
tu écris du code fragile.

Aujourd’hui :
- Structure interne
- Sélection
- Mutation
- Events
- Performance mentale

Pas de gadgets.
Du fond.

===========================================================
1) LE DOM : STRUCTURE RÉELLE
===========================================================

Quand le navigateur lit ton HTML :

Il le transforme en arbre.

Un arbre = nodes reliés entre eux.

Exemple HTML :

<body>
  <div>
    <h1>Hello</h1>
  </div>
</body>

Devient :

Document
 └── html
     └── body
         └── div
             └── h1

Chaque élément est un NODE.

Types importants :

- Element node
- Text node
- Attribute node

<p>          ← Element node
├── "Bonjour"   ← Text node
└── class="titre" ← Attribute node

Comprendre ça change tout.

Quand tu modifies le DOM,
tu modifies cet arbre en mémoire.

===========================================================
2) SÉLECTION — ACCÉDER À LA STRUCTURE
===========================================================

Tu ne peux pas manipuler sans référence.

Méthodes modernes :

document.querySelector()
document.querySelectorAll()

Pourquoi pas getElementById ?
Parce que querySelector est plus universel.
(ingénieur pense cohérence API)

Exemple :

const title = document.querySelector("h1");

Ça retourne le premier match.

querySelectorAll retourne une NodeList.

exemple: // HTML : <h1>Bonjour</h1>
    //             <h1>Monde</h1>
const title = document.querySelector("h1");
console.log(title); // <h1>Bonjour</h1> ← juste le premier
const titles = document.querySelectorAll("h1");
console.log(titles); // NodeList [<h1>Bonjour</h1>, <h1>Monde</h1>] ← tous

Important :
NodeList ≠ Array
Mais elle a forEach.

Si tu veux un vrai array :

const items = [...document.querySelectorAll(".item")];

Pourquoi ?
Parce que spread operator clone dans un tableau réel.

===========================================================
3) LECTURE DU DOM
===========================================================

Lire contenu :

element.textContent
element.innerHTML ("Bonjour <b>Monde</b>" ← avec les balises)
element.value (input)

Différence critique :

textContent → texte brut
innerHTML → interprète HTML

innerHTML = danger si données user.
(Risque XSS = injection script malveillant)

règle simple :
Utilise textContent sauf si tu DOIS injecter du HTML.

===========================================================
4) MUTATION — MODIFIER LE DOM
===========================================================

Modifier texte :

title.textContent = "Nouveau titre";

Modifier attribut :

element.setAttribute("disabled", true); //ancien

Mais moderne : element.disabled = true;

Modifier classes :

element.classList.add("active");
element.classList.remove("active");
element.classList.toggle("active");

Pourquoi classList > style ?

Parce que séparation des responsabilités.

JS = logique
CSS = apparence

Ingénieur ne mélange pas.

exemple:
// HTML : <div id="menu">Menu</div>
// CSS  : .active { background: blue; color: white; }

const menu = document.querySelector("#menu");

menu.classList.add("active");    // ajoute la classe
menu.classList.remove("active"); // enlève la classe
menu.classList.toggle("active"); // si présente → enlève, sinon → ajoute

---

Créer un élément :

const li = document.createElement("li");
li.textContent = "Item";

Ajouter dans le DOM :

parent.appendChild(li);

Moderne :

parent.append(li);

Différence ?

appendChild accepte un seul node.
append accepte texte + multiple nodes. ex: Tous les autres cas → append (plus flexible)
parent.append(node1, node2, "du texte");

ex:
Le HTML de départ
html<ul id="liste"></ul>
<p id="résumé"></p>
Avec append — tout en une fois
javascriptconst liste = document.querySelector("#liste");

// Créer plusieurs éléments
const item1 = document.createElement("li");
item1.textContent = "🍎 Pommes";

const item2 = document.createElement("li");
item2.textContent = "🥛 Lait";

const item3 = document.createElement("li");
item3.textContent = "🍞 Pain";

// Tout ajouter d'un coup
liste.append(item1, item2, item3);

Résultat dans le DOM :

- 🍎 Pommes
- 🥛 Lait
- 🍞 Pain

ex2:
Mix node + texte brut
javascriptconst résumé = document.querySelector("#résumé");

const span = document.createElement("span");
span.textContent = "3 articles";
span.style.fontWeight = "bold";

// Texte + node + texte, en une seule ligne
résumé.append("Tu as ", span, " dans ton panier.");

Résultat :
Tu as 3 articles dans ton panier.
       ↑ en gras


===========================================================
5) EVENTS — SYSTÈME D’INTERACTION
===========================================================

Le DOM fonctionne par événements.

Un event = signal.

click
input
submit
keydown

Structure :

element.addEventListener("click", handler);

Toujours séparer logique et structure.
Jamais d’attribut onclick dans HTML.

=> À éviter — onclick dans le HTML
ex: html<button onclick="maFonction()">Clique</button>

Pourquoi ?

Séparation des responsabilités.
Maintenabilité.
Testabilité.

---

Event object :

element.addEventListener("click", function(event) {
  console.log(event.target);
});

event.target = élément déclencheur
event.currentTarget = élément attaché

Ingénieur comprend la différence.

ex: 
<div id="parent">
  <button id="enfant">Clique moi</button>
</div>
parent.addEventListener("click", function(event) {
  console.log(event.target);        // <button id="enfant"> ← là où le clic a eu lieu
  console.log(event.currentTarget); // <div id="parent">   ← là où l'écouteur est attaché
});

Empêcher comportement natif :

event.preventDefault();

Sinon un formulaire recharge la page.

ex:
Sans preventDefault :
javascriptform.addEventListener("submit", function(event) {
  console.log("Formulaire soumis !");
  // La page recharge instantanément → le console.log disparaît
});

Avec preventDefault:
javascriptform.addEventListener("submit", function(event) {
  event.preventDefault(); // Stoppe le rechargement

  const valeur = document.querySelector("input").value;
  console.log("Nom saisi :", valeur); // On peut traiter les données
});

===========================================================
6) EVENT BUBBLING — PHÉNOMÈNE FONDAMENTAL
===========================================================

Quand tu cliques un bouton :

L’event remonte dans l’arbre.

button → div → body → document

Ça s’appelle le bubbling.

Pourquoi c’est important ?

Parce que ça permet :

EVENT DELEGATION

Au lieu d’ajouter 100 listeners sur 100 boutons :

Tu mets un listener sur le parent.

parent.addEventListener("click", function(e) {
  if (e.target.matches("button")) {
    console.log("Bouton cliqué");
  }
});

Performance.
Scalabilité.
Propreté.

Ça c’est mentalité ingénieur.

===========================================================
7) PERFORMANCE — LE DOM COÛTE CHER
===========================================================

Chaque modification DOM peut déclencher :

- Reflow (recalcul layout)
- Repaint (redessin)

C’est lent comparé au JS pur.

Mauvais :

for (...) {
  parent.appendChild(newElement);
}

ex:
Le mauvais pattern — insertion en boucle
javascriptconst liste = document.querySelector("ul");

for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;

  liste.appendChild(li); // ← touche le DOM 1000 fois
}
Ce qui se passe :
Iteration 1 → Reflow + Repaint
Iteration 2 → Reflow + Repaint
Iteration 3 → Reflow + Repaint
... × 1000 -> 1000 reflows. Le navigateur souffre.

Meilleur :

Créer un DocumentFragment.
Modifier hors DOM.
Injecter une fois.

const fragment = document.createDocumentFragment();

for (...) {
  const li = document.createElement("li");
  fragment.append(li);
}

parent.append(fragment);

Une seule insertion.
Moins de reflow.

ex:
const liste = document.querySelector("ul");

// Fragment = conteneur léger qui vit en mémoire, pas dans le DOM
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;

  fragment.append(li); // ← touche uniquement la mémoire
}

liste.append(fragment); // ← touche le DOM UNE seule fois

Ce qui se passe :

Iterations 1 à 1000 → travail en mémoire (rapide ⚡)
Insertion finale    → 1 seul Reflow + Repaint

### Visualiser la différence

-> Sans fragment :

[DOM]  ←── li  (reflow)
[DOM]  ←── li  (reflow)
[DOM]  ←── li  (reflow)
... × 1000


-> Avec fragment :

[Mémoire] ←── li
[Mémoire] ←── li
[Mémoire] ←── li
... × 1000
[DOM] ←── fragment entier  (1 seul reflow)

Ce qu'est vraiment un DocumentFragment :
javascriptconst fragment = document.createDocumentFragment();

// C'est un nœud léger — pas de tag HTML, pas de style, pas de layout
// Il sert uniquement de "sac" temporaire pour grouper des éléments

fragment.append(li1, li2, li3);

// Quand tu l'injectes dans le DOM,
// le fragment lui-même disparaît — seuls ses enfants sont insérés
liste.append(fragment);
// → liste contient li1, li2, li3
// → fragment est maintenant vide

===========================================================
8) MENTALITÉ INGÉNIEUR DOM
===========================================================

1) Sélection propre
2) Mutation minimale
3) Séparation logique / style
4) Event delegation si possible
5) Respect performance

Le DOM n’est pas un jouet.
C’est une structure critique.

===========================================================
EXERCICES NIVEAU INGÉNIEUR
===========================================================

EXO 1 — Liste scalable

Créer dynamiquement 1000 <li>.
Optimiser l’insertion.

Indice :
DocumentFragment.

---

EXO 2 — Event Delegation

Créer une liste dynamique.
Un seul event listener doit gérer :

- Click sur item → suppression

Pas 1 listener par item.

---

EXO 3 — Toggle Architecturé

Créer un bouton :

- Toggle classe "dark"
- Pas de manipulation style directe
- Utilise uniquement classList

---

EXO 4 — Form Control

Créer un formulaire.

Contraintes :

- Empêcher submit si input vide
- Afficher message d’erreur via DOM
- Pas d’alert()

Gestion propre du flux.

---

===========================================================
RÉSUMÉ
===========================================================

Le DOM est une structure arborescente en mémoire.
Chaque manipulation a un coût.
Les events suivent un système de propagation.
La propreté du code dépend de la séparation logique / style.

Si tu maîtrises ça,
tu peux construire n’importe quelle interface.

Sinon,
tu bricoles.

Fin de module DOM manipulation.
*/

//EXO 1 — Liste scalable
const liste = document.querySelector("ul"); // cible dans le DOM
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i + 1}`; // contenu lisible
  li.style.color = "white";
  fragment.append(li);
}
liste.append(fragment); // injection unique

//EXO 2 — Event Delegation
const ul = document.createElement("ul");
document.body.append(ul);

const newfragment = document.createDocumentFragment();
for (let i = 0; i < 5; i++) {
  let l = document.createElement("li");
  l.textContent = `liste ${i}`;
  let b = document.createElement("button");
  b.textContent = `X`;
  l.append(b);
  newfragment.append(l);
}
ul.append(newfragment);
ul.addEventListener("click", function (e) {
  if (e.target.matches("button")) {
    e.target.closest("li").remove();
  }
});
// => mais ici, c'est pas grave si on utilise pas "fragment", c'est juste une ptite liste

// EXO 3 — Toggle Architecturé
const b = document.createElement("button");
document.body.append(b);

b.addEventListener("click", function () {
  document.body.classList.toggle("dark"); // change le background en dark dans css si present
});

// EXO 4 — Form Control
// Créer les éléments
const form = document.createElement("form");

const inputNom = document.createElement("input");
inputNom.placeholder = "Ton nom"; //  placeholder, pas textContent

const inputAge = document.createElement("input");
inputAge.placeholder = "Ton âge"; // appliqué sur inputAge, pas inputNom

const submit = document.createElement("button");
submit.textContent = "Envoyer";
submit.type = "submit";

const erreur = document.createElement("p");
erreur.style.color = "red"; // message d'erreur visible

// Injecter dans le DOM
form.append(inputNom, inputAge, submit, erreur);
document.body.append(form);

// Écouter le submit du formulaire
form.addEventListener("submit", function (e) {
  e.preventDefault(); // stoppe le rechargement

  if (inputNom.value === "" || inputAge.value === "") {
    erreur.textContent = "Tous les champs sont obligatoires.";
    return; //  stoppe l'exécution
  }

  erreur.textContent = ""; // reset l'erreur
  console.log("Nom :", inputNom.value, "| Age :", inputAge.value);
});

// ### Le flux propre
// ```
// Submit déclenché
//        ↓
// preventDefault() → page ne recharge pas
//        ↓
// Champs vides ? → affiche erreur dans le DOM (pas d'alert)
//        ↓
// Tout rempli ?  → traite les données, reset l'erreur
