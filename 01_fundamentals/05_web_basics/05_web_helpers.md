---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# WEB HELPERS : DOM & EVENTS
Temps de lecture ~6 min

Bienvenue dans la vraie vie du développeur frontend.

Quand tu codes pour le web, tu fais toujours les mêmes choses : sélectionner un élément, écouter un événement, modifier du contenu, ajouter une classe, créer un élément, supprimer un élément.

Donc les ingénieurs créent des **helpers**.

**Helper** = petite fonction utilitaire qui simplifie une tâche répétée.

Au lieu d'écrire ça 50 fois :

```javascript
document.querySelector("#button");
```

On crée un helper une fois :

```javascript
function $(selector) {
 return document.querySelector(selector);
}
```

Et on écrit juste `$("#button")`. Plus rapide. Plus propre. Plus lisible. C'est exactement ce que font les frameworks : ils ont juste eu la flemme d'écrire `querySelector` autant de fois que toi.

---

## LES HELPERS

**Sélection unique :**

```javascript
function $(selector) {
 // "$" est un nom valide en JS
 return document.querySelector(selector);
}

$("#title"); // premier élément correspondant
```

**Sélection multiple :**

```javascript
function $all(selector) {
 return document.querySelectorAll(selector);
}

$all(".card"); // NodeList de tous les éléments correspondants
```

**Écouter un événement :**

```javascript
function on(element, event, callback) {
 element.addEventListener(event, callback);
}

on($("#btn"), "click", () => {
 console.log("clicked");
});
```

**Créer un élément :**

```javascript
function create(tag) {
 return document.createElement(tag);
}

let div = create("div");
```

**Ajouter dans le DOM :**

```javascript
function append(parent, child) {
 parent.appendChild(child);
}
```

**Modifier le texte :**

```javascript
function setText(element, text) {
 element.textContent = text;
}
```

**Gérer les classes CSS :**

```javascript
function addClass(element, className) {
 element.classList.add(className);
}

function removeClass(element, className) {
 element.classList.remove(className);
}
```

**Supprimer un élément :**

```javascript
function remove(element) {
 element.remove();
}
```

---

## EXEMPLE COMPLET

```javascript
let button = create("button");
setText(button, "Spawn Monster");
append(document.body, button);

on(button, "click", () => {
 let monster = create("div");
 setText(monster, "Un slime apparaît");
 addClass(monster, "monster");
 append(document.body, monster);
});
```

En quelques lignes : un bouton est créé, un événement est écouté, un élément est généré et injecté dans la page. C'est la base du frontend : sans framework, sans magie.

---

## POURQUOI LES INGÉNIEURS FONT ÇA

Dans une vraie app, tu manipules le DOM **des centaines de fois**. Les helpers permettent de réduire le code, d'éviter les répétitions et de rendre la logique lisible.

C'est la base de nombreuses librairies. Exemple historique : **jQuery** faisait exactement ça.

```javascript
$("#button").click(fn); // jQuery, 2006 : pionnier du helper DOM
```

Les helpers sont une **couche d'abstraction** : une simplification d'un système complexe. Tu caches la complexité derrière un nom qui dit ce qu'il fait.

---

## MISSIONS

## MISSION 1 : LE BOUTON CHAOS

Crée un bouton `"Spawn Zombie"`. Quand on clique, un nouveau zombie apparaît dans la page.

---

## MISSION 2 : L'ARMÉE DES MONSTRES

Crée un bouton `"Spawn 5 monsters"`. Quand on clique, 5 monstres apparaissent. Utilise une boucle.

---

## MISSION 3 : LE DESTRUCTEUR

Chaque monstre doit avoir un bouton `"Kill"`. Quand on clique dessus, le monstre disparaît.

---

## MISSION 4 : LE SPAWNER ALÉATOIRE

```javascript
["Goblin", "Slime", "Dragon", "Ghost"];
```

À chaque clic, un monstre aléatoire du tableau apparaît.

_Indice : `Math.random()`_

---

## MISSION 5 : LE HELPER SUPRÊME

Crée une fonction `spawnMonster(name)` qui crée un élément, lui donne un texte, et l'ajoute dans la page. Utilise-la pour spawner 10 monstres différents.

---

> Si tu comprends ces helpers, tu comprends la **mécanique réelle du frontend**. Les frameworks ne font que l'automatiser. Toi, tu sais ce qui se passe en dessous.

---

## RÉSUMÉ

`debounce` retarde l'exécution jusqu'à ce que l'utilisateur arrête de déclencher l'événement. `throttle` impose un délai minimum entre deux exécutions. Les deux servent à contrôler la fréquence des appels coûteux sur des événements haute fréquence.

`deepClone` via `structuredClone()` duplique un objet entier, structure imbriquée incluse. C'est la solution native : plus besoin de JSON.parse/stringify.

Ces helpers ne sont pas des luxes. Ils font partie du kit de survie de tout dev frontend qui comprend ce qui se passe sous le capot des frameworks.
