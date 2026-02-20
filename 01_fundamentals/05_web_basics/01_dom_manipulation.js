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

append accepte texte + multiple nodes.
appendChild accepte un seul node.

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

---

Empêcher comportement natif :

event.preventDefault();

Sinon un formulaire recharge la page.

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
