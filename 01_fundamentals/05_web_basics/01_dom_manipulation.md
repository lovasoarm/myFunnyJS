---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# DOM MANIPULATION
Temps de lecture ~9 min

Si tu veux devenir ingénieur frontend, tu dois comprendre une vérité simple :

Le navigateur est une machine. Le DOM est une structure en mémoire. JS est l'outil qui la manipule.

Si tu manipules le DOM sans comprendre sa logique, tu écris du code fragile.

Au programme : structure interne, sélection, mutation, events, performance. Pas de gadgets. Du fond.

---

## 1) LE DOM : STRUCTURE RÉELLE

Quand le navigateur lit ton HTML, il le transforme en **arbre**. Un arbre = nodes reliés entre eux.

```html
<body>
 <div>
  <h1>Hello</h1>
 </div>
</body>
```

Devient :

```
Document
 └── html
   └── body
     └── div
       └── h1
```

Chaque élément est un **node**. Types importants :

```
<p>       ← Element node
├── "Bonjour"  ← Text node
└── class="titre" ← Attribute node
```

Quand tu modifies le DOM, tu modifies cet arbre en mémoire. Comprendre ça change tout.

---

## 2) SÉLECTION : ACCÉDER À LA STRUCTURE

Tu ne peux pas manipuler sans référence.

```javascript
document.querySelector(); // premier match
document.querySelectorAll(); // tous les matchs → NodeList
```

Pourquoi pas `getElementById` ? Parce que `querySelector` est plus universel : un ingénieur pense cohérence d'API.

```javascript
// HTML : <h1>Bonjour</h1>
//    <h1>Monde</h1>

const title = document.querySelector("h1");
console.log(title); // <h1>Bonjour</h1> ← juste le premier

const titles = document.querySelectorAll("h1");
console.log(titles); // NodeList [<h1>Bonjour</h1>, <h1>Monde</h1>] ← tous
```

**Important :** `NodeList ≠ Array`, mais elle a `forEach`.

Si tu veux un vrai array :

```javascript
const items = [...document.querySelectorAll(".item")];
```

Le spread operator clone la NodeList dans un tableau réel : accès à toutes les méthodes d'Array.

---

## 3) LECTURE DU DOM

```javascript
element.textContent; // texte brut
element.innerHTML; // interprète le HTML ("Bonjour <b>Monde</b>")
element.value; // valeur d'un input
```

**Différence critique :**

- `textContent` → texte brut, sûr
- `innerHTML` → interprète HTML → **danger si données utilisateur** (risque XSS = injection de script malveillant)

> Règle simple : utilise `textContent` sauf si tu dois absolument injecter du HTML : et même là, méfie-toi.

---

## 4) MUTATION : MODIFIER LE DOM

**Modifier le texte :**

```javascript
title.textContent = "Nouveau titre";
```

**Modifier un attribut :**

```javascript
element.setAttribute("disabled", true); // ancienne méthode
element.disabled = true; // moderne -> préfère ça
```

**Modifier les classes :**

```javascript
element.classList.add("active");
element.classList.remove("active");
element.classList.toggle("active"); // présente → enlève, absente → ajoute
```

```javascript
// HTML : <div id="menu">Menu</div>
// CSS : .active { background: blue; color: white; }

const menu = document.querySelector("#menu");
menu.classList.add("active");
menu.classList.toggle("active");
```

Pourquoi `classList` plutôt que `style` direct ? **Séparation des responsabilités** : JS gère la logique, CSS gère l'apparence. Un ingénieur ne mélange pas les deux.

---

**Créer et injecter des éléments :**

```javascript
const li = document.createElement("li");
li.textContent = "Item";

parent.appendChild(li); // un seul node
parent.append(li); // moderne -> accepte plusieurs nodes et du texte
```

Différence :

| Méthode    | Accepte           |
| ------------- | ---------------------------- |
| `appendChild` | un seul node         |
| `append`   | plusieurs nodes + texte brut |

```javascript
// append tout en une fois
const liste = document.querySelector("#liste");

const item1 = document.createElement("li");
item1.textContent = "Pommes";

const item2 = document.createElement("li");
item2.textContent = "Lait";

liste.append(item1, item2); // insertion unique
```

```javascript
// Mix node + texte brut
const résumé = document.querySelector("#résumé");

const span = document.createElement("span");
span.textContent = "3 articles";
span.style.fontWeight = "bold";

résumé.append("Score : ", span, " points marqués.");
// → Score : 3 points marqués. (3 en gras)
```

---

## 5) EVENTS : SYSTÈME D'INTERACTION

Un event = un signal. Les plus courants : `click`, `input`, `submit`, `keydown`.

```javascript
element.addEventListener("click", handler);
```

**Toujours séparer logique et structure.** Jamais d'attribut `onclick` dans le HTML :

```html
<!-- À éviter -->
<button onclick="maFonction()">Clique</button>
```

Pourquoi ? Séparation des responsabilités, maintenabilité, testabilité. Le HTML n'est pas là pour contenir de la logique.

---

**L'objet `event` :**

```javascript
element.addEventListener("click", function (event) {
 console.log(event.target); // élément où le clic a eu lieu
 console.log(event.currentTarget); // élément où l'écouteur est attaché
});
```

```html
<div id="parent">
 <button id="enfant">Clique moi</button>
</div>
```

```javascript
parent.addEventListener("click", function (event) {
 console.log(event.target); // <button id="enfant"> ← là où le clic a eu lieu
 console.log(event.currentTarget); // <div id="parent">  ← là où l'écouteur est attaché
});
```

---

**Empêcher le comportement natif :**

```javascript
// Sans preventDefault : la page recharge, le console.log disparaît
form.addEventListener("submit", function (event) {
 console.log("Formulaire soumis !");
});

// Avec preventDefault : on garde le contrôle (Tu peux récupérer les données, les valider, les envoyer via fetch... tout ce que tu veux, à ta façon.)
form.addEventListener("submit", function (event) {
 event.preventDefault();
 const valeur = document.querySelector("input").value;
 console.log("Nom saisi :", valeur);
});
```

---

## 6) EVENT BUBBLING : PHÉNOMÈNE FONDAMENTAL

Quand tu cliques un bouton, l'event **remonte dans l'arbre** :

```
button → div → body → document
```

Ça s'appelle le **bubbling**. Et c'est ce qui rend possible l'**event delegation** (tu attaches un seul écouteur sur un parent).

Au lieu d'ajouter 100 listeners sur 100 boutons, tu mets **un seul listener sur le parent** :

```javascript
parent.addEventListener("click", function (e) {
 if (e.target.matches("button")) {
  console.log("Bouton cliqué :", e.target.textContent);
 }
});
```

Performance. Scalabilité. Propreté. Ça, c'est la mentalité ingénieur.

---

## 7) PERFORMANCE : LE DOM COÛTE CHER

Chaque modification DOM peut déclencher un **reflow** (recalcul du layout) et un **repaint** (redessin). C'est lent comparé au JS pur.

**Mauvais : insertion en boucle :**

```javascript
const liste = document.querySelector("ul");

for (let i = 0; i < 1000; i++) {
 const li = document.createElement("li");
 li.textContent = `Item ${i}`;
 liste.appendChild(li); // touche le DOM 1000 fois → 1000 reflows
}
```

**Bon : DocumentFragment :**

```javascript
const liste = document.querySelector("ul");
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
 const li = document.createElement("li");
 li.textContent = `Item ${i}`;
 fragment.append(li); // travail en mémoire uniquement
}

liste.append(fragment); // touche le DOM UNE seule fois → 1 reflow
```

Visualisation :

```
Sans fragment :
[DOM] ←── li (reflow)
[DOM] ←── li (reflow)
... × 1000

Avec fragment :
[Mémoire] ←── li
[Mémoire] ←── li
... × 1000
[DOM] ←── fragment entier (1 seul reflow)
```

> `DocumentFragment` est un nœud léger sans tag HTML, sans style, sans layout. Il sert de sac temporaire. Quand tu l'injectes dans le DOM, le fragment lui-même disparaît : seuls ses enfants sont insérés.

---

## 8) MENTALITÉ INGÉNIEUR DOM

1. Sélection propre
2. Mutation minimale
3. Séparation logique / style
4. Event delegation si possible
5. Respect de la performance

Le DOM n'est pas un jouet. C'est une structure critique.

---

## EXERCICES

## EXO 1 : Liste Scalable

Crée dynamiquement 1000 `<li>` et optimise l'insertion.

_Indice : `DocumentFragment`._

---

## EXO 2 : Event Delegation

Crée une liste dynamique. Un **seul** event listener doit gérer le clic sur n'importe quel item pour le supprimer.

Pas un listener par item. Un seul. Sur le parent.

---

## EXO 3 : Toggle Architecturé

Crée un bouton qui toggle la classe `"dark"` sur le body. Contrainte : pas de manipulation `style` directe : uniquement `classList`.

---

## EXO 4 : Form Control

Crée un formulaire avec ces contraintes :

- Empêcher le submit si l'input est vide
- Afficher un message d'erreur via le DOM
- Pas d'`alert()`

Gestion propre du flux.

---

## RÉSUMÉ

Le DOM est une structure arborescente en mémoire. Chaque manipulation a un coût. Les events suivent un système de propagation. La propreté du code dépend de la séparation logique / style.

Si tu maîtrises ça, tu peux construire n'importe quelle interface.

Sinon, tu bricoles.
