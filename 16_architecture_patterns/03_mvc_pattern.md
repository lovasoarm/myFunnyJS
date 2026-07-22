---
stability: intemporel
---

# MVC : MODEL, VIEW, CONTROLLER
Temps de lecture ~9 min

Rick Grimes gère Alexandria. Il y a les ressources (Model), ce que les survivants voient sur le tableau d'affichage (View), et les décisions que Rick prend entre les deux (Controller). Si Rick commence à peindre le tableau lui-même ET à gérer les rations ET à décider qui mange quoi, c'est le chaos. MVC, c'est séparer ces trois rôles avant de s'y noyer.

Sans MVC (ou une séparation équivalente), une modification dans l'affichage casse la logique métier. Une règle métier modifie l'UI directement. Les bugs se propagent partout. Impossible de tester quoi que ce soit isolément.

Prérequis : `01_fundamentals` complet, `12_design_patterns` (notamment observer et factory).

---

## 1) LES TROIS RÔLES

```
          survivant clique
             |
             v
       +---------------------+
       |   CONTROLLER   |
       | "Rick qui décide" |
       | - reçoit l'input  |
       | - orchestre la réponse |
       +---------------------+
         /      \
         v       v
  +-------------+    +-----------+
  |  MODEL  |    |  VIEW  |
  | "les faits" |    | "ce qu'on |
  | - données  |    |  voit"  |
  | - logique  |    | - rendu  |
  |  métier  |    | - affichage |
  | - validation|    +-----------+
  +-------------+
```

**Model** : ce qui est vrai. Les données. Les règles de validation. Aucune connaissance de l'interface.

**View** : ce que le survivant voit. Aucune logique métier. Elle reçoit des données et les affiche, point.

**Controller** : le médiateur (intermédiaire). Il reçoit les actions du survivant, interroge ou modifie le Model, et dit à la View quoi afficher. Il ne connaît pas les détails du DOM (structure HTML de la page). Il ne connaît pas les détails du stockage.

---

## 2) IMPLÉMENTATION COMPLÈTE

Contexte : Alexandria a besoin d'un système de gestion des survivants.

```js
// =====================
// MODEL
// =====================
// Le Model ne sait pas qu'une View existe. Il ne sait pas qu'un Controller existe.
// Il fait une seule chose : gérer les données et les règles.

class SurvivorModel {
 #survivors = []; // # = propriété privée native en JS (ES2022)
 #nextId = 1;

 add(name, role) {
  if (!name || typeof name !== "string") {
   throw new TypeError("Nom de survivant invalide"); // règle métier ici, pas dans le controller
  }

  const survivor = {
   id: this.#nextId++,
   name: name.trim(),
   role,
   status: "alive",
   joinedAt: Date.now(),
  };

  this.#survivors.push(survivor);
  return survivor; // retourne le nouveau survivant créé
 }

 remove(id) {
  const index = this.#survivors.findIndex((s) => s.id === id);
  if (index === -1) throw new Error(`Survivant #${id} introuvable`);
  this.#survivors.splice(index, 1);
 }

 getAll() {
  return [...this.#survivors]; // copie défensive:la View ne mutate pas le Model
 }

 findById(id) {
  return this.#survivors.find((s) => s.id === id) ?? null;
 }

 getCount() {
  return this.#survivors.length;
 }
}
```

```js
// =====================
// VIEW
// =====================
// La View ne sait pas d'où viennent les données. Elle reçoit et affiche.
// Toute logique de rendu ici. Zéro logique métier.

class SurvivorView {
 #container; // référence au noeud DOM cible

 constructor(containerId) {
  this.#container = document.getElementById(containerId);
  if (!this.#container)
   throw new Error(`Container #${containerId} introuvable dans le DOM`);
 }

 renderList(survivors) {
  if (survivors.length === 0) {
   this.#container.innerHTML = `<p class="empty">Alexandria est vide. Mauvais signe.</p>`;
   return;
  }

  // la View construit le HTML:le Controller ne touche jamais au DOM directement
  this.#container.innerHTML = survivors
   .map(
    (s) => `
    <div class="survivor" data-id="${s.id}">
     <strong>${s.name}</strong> : ${s.role}
     <button class="remove-btn" data-id="${s.id}">Éliminer</button>
    </div>
   `,
   )
   .join("");
 }

 renderCount(count) {
  const counter = document.getElementById("survivor-count");
  if (counter) counter.textContent = `${count} survivant(s) à Alexandria`;
 }

 showError(message) {
  // la View sait afficher une erreur:elle ne sait pas pourquoi elle est arrivée
  const error = document.getElementById("error-msg");
  if (error) {
   error.textContent = message;
   error.classList.add("visible");
   setTimeout(() => error.classList.remove("visible"), 3000);
  }
 }

 // la View expose ses points d'entrée pour les events:le Controller branche ensuite
 bindAddSurvivor(handler) {
  const form = document.getElementById("add-form");
  form?.addEventListener("submit", (e) => {
   e.preventDefault();
   const name = document.getElementById("name-input")?.value;
   const role = document.getElementById("role-input")?.value;
   handler(name, role); // on passe les données au handler fourni par le Controller
  });
 }

 bindRemoveSurvivor(handler) {
  // délégation d'événement (event delegation) : un seul listener sur le parent
  this.#container.addEventListener("click", (e) => {
   if (e.target.classList.contains("remove-btn")) {
    const id = parseInt(e.target.dataset.id, 10);
    handler(id);
   }
  });
 }
}
```

```js
// =====================
// CONTROLLER
// =====================
// Le Controller orchestre. Il connaît le Model et la View.
// Ni le Model ni la View ne se connaissent entre eux.

class SurvivorController {
 #model;
 #view;

 constructor(model, view) {
  this.#model = model;
  this.#view = view;

  // le Controller branche les events de la View sur les méthodes du Model
  this.#view.bindAddSurvivor(this.#handleAdd.bind(this));
  this.#view.bindRemoveSurvivor(this.#handleRemove.bind(this));

  // rendu initial
  this.#refresh();
 }

 #handleAdd(name, role) {
  try {
   this.#model.add(name, role); // le Controller délègue la logique au Model
   this.#refresh(); // après modification, on rafraîchit l'affichage
  } catch (error) {
   this.#view.showError(error.message); // erreur du Model → affichée par la View
  }
 }

 #handleRemove(id) {
  try {
   this.#model.remove(id);
   this.#refresh();
  } catch (error) {
   this.#view.showError(error.message);
  }
 }

 #refresh() {
  // le Controller lit le Model et dit à la View quoi afficher
  const survivors = this.#model.getAll();
  this.#view.renderList(survivors);
  this.#view.renderCount(this.#model.getCount());
 }
}
```

```js
// =====================
// INITIALISATION
// =====================

const model = new SurvivorModel();
const view = new SurvivorView("survivors-container");
const controller = new SurvivorController(model, view);

// quelques survivants de départ
model.add("Rick Grimes", "Leader");
model.add("Michonne", "Combat");
model.add("Daryl Dixon", "Scout");
```

---

## 3) FLUX D'UNE ACTION

```
Rick clique "Éliminer" sur Daryl
    |
    v
View.bindRemoveSurvivor détecte le click
    |
    | passe l'id au handler
    v
Controller.#handleRemove(id)
    |
    | délègue au Model
    v
Model.remove(id) : vérifie, supprime, lève une erreur si introuvable
    |
    | succès
    v
Controller.#refresh()
    |
    | lit le Model mis à jour
    v
View.renderList(survivors)  : DOM mis à jour
```

Daryl est éliminé. Alexandria continue. Le cycle se ferme proprement.

---

## 4) LE PIÈGE CLASSIQUE : LE FAT CONTROLLER

```js
// MAUVAIS : toute la logique dans le Controller
class BadController {
 handleAdd(name, role) {
  if (!name) {
   alert("Nom requis");
   return;
  } // validation ici : non
  if (name.length < 2) {
   alert("Trop court");
   return;
  } // encore : non

  // logique de stockage ici : non
  const survivors = JSON.parse(localStorage.getItem("survivors") || "[]");
  survivors.push({ name, role, id: Date.now() });
  localStorage.setItem("survivors", JSON.stringify(survivors));

  // DOM ici : non
  document.getElementById("list").innerHTML += `<li>${name}</li>`;
 }
}
```

Ce Controller fait trois métiers. Si tu changes le stockage (localStorage → API), si tu changes la validation, si tu changes l'UI : tu touches toujours au même fichier. Un changement dans un détail peut casser les deux autres. C'est le **God Controller**, l'anti-pattern (mauvaise pratique récurrente) n°1 en MVC.

Règle : le Controller orchestre, il ne fait rien lui-même.

---

## 5) VARIANTE OBSERVABLE : MODEL QUI NOTIFIE

Au lieu que le Controller appelle `view.render()` manuellement, le Model peut émettre des événements (Observer Pattern de `12_design_patterns`) :

```js
class ReactiveSurvivorModel extends EventTarget {
 // EventTarget : classe native du navigateur qui permet d'émettre/écouter des événements
 #survivors = [];

 add(name, role) {
  const survivor = { id: Date.now(), name, role };
  this.#survivors.push(survivor);
  this.dispatchEvent(new CustomEvent("change", { detail: this.getAll() }));
  // le Model dit "j'ai changé":c'est la View (ou le Controller) qui réagit
 }

 getAll() {
  return [...this.#survivors];
 }
}

// le Controller écoute le Model plutôt que d'appeler refresh() partout
model.addEventListener("change", (e) => {
 view.renderList(e.detail);
});
```

C'est la base de ce que font React, Vue, et Angular : le Model (state) notifie, la View réagit.

---

## EXERCICES

**EXO 1 : Le tableau de bord de la Prison Break**
Michael Scofield a besoin de gérer les sections de Fox River. Chaque section a un nom, un niveau de sécurité (1-5), et un nombre de gardiens. Implémente un MVC complet : `PrisonModel` (CRUD sur les sections + validation du niveau de sécurité), `PrisonView` (affiche la liste, expose les handlers de formulaire), `PrisonController` (orchestre). Le Controller ne doit jamais toucher au DOM directement.

**EXO 2 : Trouve les violations**
Voici un code : le Controller appelle directement `document.querySelector`, fait une validation de longueur de string, et stocke les données dans `localStorage`. Liste toutes les violations de la séparation MVC. Propose une redistribution correcte des responsabilités.

**EXO 3 : Le Model réactif**
Transforme le `SurvivorModel` de la leçon pour qu'il étende `EventTarget`. Le `SurvivorController` ne doit plus appeler `this.#refresh()` : il doit écouter l'événement `"change"` du Model. La View ne change pas.

---

## RÉSUMÉ

MVC ne résout pas tous les problèmes. Il résout un problème précis : qui est responsable de quoi quand le code grossit. Le Model ne voit pas l'UI. La View ne connaît pas les règles métier. Le Controller est le seul à connaître les deux : et il délègue à chacun ce qui lui appartient. Quand un dev touche MVC sans respecter cette frontière, le Controller grossit, avale tout, et un jour personne ne veut plus l'ouvrir.
