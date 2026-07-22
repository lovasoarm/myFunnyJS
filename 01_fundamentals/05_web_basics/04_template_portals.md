---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# TEMPLATE PORTALS : TEMPLATE STRINGS & DOM TEMPLATING
Temps de lecture ~9 min

Aujourd'hui, on attaque un truc **fondamental du web moderne** : générer du HTML avec JavaScript.

Pourquoi ? Parce que dans une vraie application, les données viennent d'une API, l'utilisateur interagit, l'interface doit changer. Le navigateur doit **créer du HTML dynamiquement**.

Pense à une fiche de combattant Dragon Ball : le gabarit (nom, niveau, points de vie) ne change jamais, mais les valeurs changent à chaque combattant (Goku, Vegeta, Piccolo). Le template, c'est le gabarit vide. Les données, c'est ce qui remplit les cases. Le DOM, c'est la fiche affichée à l'écran.

C'est exactement ce que font React, Vue, Angular, Next. Mais derrière tout ça, il y a simplement :

```
JavaScript + Template + DOM
```

Aujourd'hui tu vas comprendre **le moteur brut**.

---

## 1) TEMPLATE STRING

Avant ES6, pour construire du texte :

```javascript
let name = "Blob";
let text = "Hello " + name + " bienvenue"; // moche
```

JavaScript a ajouté les **template strings**.

```javascript
let name = "Blob";
let message = `Hello ${name}`;

console.log(message); // Hello Blob
```

Les backticks ` `` ` permettent :

- **l'interpolation** : insérer une variable directement dans du texte avec `${}`
- **le multi-ligne** : écrire sur plusieurs lignes sans `\n`

---

## 2) TEMPLATE MULTI-LIGNE

```javascript
// Avant
let html = "<div><h1>Hello</h1></div>";

// Maintenant
let html = `
<div>
 <h1>Hello</h1>
</div>
`;
```

Lisibilité x100. Très utilisé pour générer du HTML.

---

## 3) TEMPLATE + OBJETS

Les templates servent souvent à afficher des données :

```javascript
let player = { name: "Blob", hp: 100 };

let html = `
<div class="player">
 <h2>${player.name}</h2>
 <p>HP : ${player.hp}</p>
</div>
`;
```

HTML généré dynamiquement, à partir de données. C'est le cœur du frontend.

---

## 4) INJECTER DU HTML DANS LE DOM

```javascript
document.body.innerHTML = html;
```

JS vient de **modifier la page web**. Tu viens littéralement de créer une interface à partir d'une variable.

---

## 5) GÉNÉRER DU HTML AVEC UNE BOUCLE

Les apps web affichent souvent des listes. On génère le HTML en itérant :

```javascript
let players = [
 { name: "Blob", hp: 100 },
 { name: "Zorg", hp: 80 },
 { name: "Kraken", hp: 300 },
];

let html = "";

players.forEach((player) => {
 html += `
 <div class="player">
  <h3>${player.name}</h3>
  <p>HP : ${player.hp}</p>
 </div>
 `;
});

document.body.innerHTML = html;
```

JS crée plusieurs blocs HTML, les concatène, puis injecte tout en une fois.

---

## 6) TEMPLATE FUNCTION

Les ingénieurs créent des fonctions de template pour **réutiliser du HTML dynamique** :

```javascript
function createPlayerCard(player) {
 return `
 <div class="player">
  <h2>${player.name}</h2>
  <p>HP : ${player.hp}</p>
 </div>
 `;
}

let card = createPlayerCard({ name: "Blob", hp: 100 });
document.body.innerHTML = card;
```

Tu peux maintenant générer des centaines de cartes avec la même fonction. Donner une liste, obtenir une interface. C'est le principe des composants.

---

## 7) ATTENTION À `innerHTML`

`innerHTML` **remplace** tout le contenu :

```javascript
document.body.innerHTML = html; // remplace tout
document.body.innerHTML += html; // ajoute -> mais recrée tout le DOM à chaque fois
```

Dans les grosses apps, recréer le DOM à chaque update devient lent. C'est pour ça que les frameworks ont inventé le **Virtual DOM** : un système de comparaison intelligent qui ne met à jour que ce qui a changé.

```
SANS Virtual DOM (innerHTML brut)          AVEC Virtual DOM (React et co)
1 seul HP change sur 300 joueurs           1 seul HP change sur 300 joueurs
        |                                          |
        v                                          v
tout le DOM est détruit                    comparaison ancien/nouveau (diff)
        |                                          |
        v                                          v
300 éléments recréés                       1 seul élément texte mis à jour
        |                                          |
        v                                          v
lent, listeners perdus                     rapide, listeners conservés
```

Mais tout part de **ce principe simple**.

---

## 7bis) CE QUI CASSE : LE PIÈGE DU LISTENER FANTÔME

Regarde ce code, il a l'air normal :

```javascript
let btn = document.querySelector(".attack-btn");
btn.addEventListener("click", () => console.log("Goku attaque !"));

// Plus tard, tu rafraîchis la liste des joueurs
document.body.innerHTML += `<div class="player">Vegeta</div>`;

// Tu re-cliques sur le bouton attaque
btn.click(); // ... silence. Rien ne se passe.
```

Ce qui casse : `innerHTML +=` ne "rajoute" pas du HTML, il **détruit et
recrée tout le sous-arbre DOM concerné**, backticks compris. Le bouton que
tu vois à l'écran après l'update n'est **plus le même objet DOM** que
celui sur lequel tu avais posé ton `addEventListener`. L'ancien bouton,
avec son listener attaché, part au garbage collector (vu en détail en
`08_memory_performance`). Le nouveau bouton, visuellement identique, n'a
plus aucun listener : silence total, aucune erreur dans la console, juste
un clic qui ne fait rien.

C'est exactement le genre de bug qui rend fou en debug : le HTML est
correct, le sélecteur est correct, mais l'événement ne se déclenche plus.
La cause n'est jamais où on la cherche en premier.

La leçon : `innerHTML` casse la référence à tout élément DOM qu'il
remplace. Pour du contenu qui change souvent et garde des listeners
(comme un bouton d'action dans une carte de joueur), attache l'event sur
un parent stable et utilise la délégation d'événement, ou ré-attache
explicitement le listener après chaque update.

---

## 8) POURQUOI LES INGÉNIEURS DOIVENT SAVOIR ÇA

Derrière React, Vue, Angular : il y a toujours le même flux.

```
DONNÉES (objet JS)          TEMPLATE (string)              DOM (rendu écran)
{ name: "Goku", hp: 9000 }  `<h2>${name}</h2>              <h2>Goku</h2>
                              <p>HP: ${hp}</p>`     -->     <p>HP: 9000</p>

     data          -->         template          -->           DOM
```

Si tu comprends ça, tu comprends le moteur du frontend. Le reste, c'est du confort.

---

## MISSIONS

## MISSION 1 : LE PORTAIL DES HÉROS

```javascript
let heroes = [
 { name: "Blob", level: 5 },
 { name: "Zorg", level: 9 },
 { name: "Neko", level: 3 },
];
```

Génère une carte HTML pour chaque héros :

```
Hero : Blob
Level : 5
```

---

## MISSION 2 : LA TAVERNE DES ARMES

Crée une fonction `createWeaponCard(weapon)` qui retourne ce template :

```html
<div class="weapon">Katana - 120 dmg</div>
```

Ensuite génère plusieurs armes depuis un tableau.

---

## MISSION 3 : LA LISTE DES MONSTRES

```javascript
[
 { name: "Goblin", hp: 30 },
 { name: "Dragon", hp: 500 },
 { name: "Slime", hp: 10 },
];
```

Génère une liste HTML :

```html
<ul>
 <li>Goblin - 30hp</li>
 ...
</ul>
```

---

## MISSION 4 : LE PORTAIL MAGIQUE

Crée un `<input>`. Quand l'utilisateur tape un nom, JS crée dynamiquement une carte joueur :

```
Input : "Blob"

→ <div class="player">Blob vient d'entrer dans l'arène</div>
```

---

## MISSION 5 : LA MACHINE À CARTES

Crée une fonction `renderCards(list)` qui prend n'importe quel tableau d'objets et génère automatiquement tout le HTML.

```
data → template → DOM
```

C'est exactement le moteur des frameworks. Tu viens de le réinventer.

---

## RÉSUMÉ

```javascript
`Hello ${name}`; // interpolation : variable dans du texte
```

Template strings permettent : HTML dynamique, interpolation, multi-ligne.

JS injecte ensuite ce HTML dans le DOM avec `innerHTML`.

Et tu viens de comprendre la base technique de toutes les interfaces web modernes. Pas mal pour une syntaxe avec des backticks.
