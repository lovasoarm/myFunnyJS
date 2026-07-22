---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# CALL, APPLY, BIND : EMPRUNTER UNE FONCTION, FIGER THIS
Temps de lecture ~10 min

Le fichier 04 a montré que `this` dépend du call-site, et que ça casse facilement. `call`, `apply` et `bind` sont les trois outils natifs pour reprendre le contrôle : soit en imposant `this` pour un appel précis, soit en le figeant définitivement.

## 1) `call` : APPELER MAINTENANT, AVEC UN THIS IMPOSÉ

```js
function presenter(village) {
 return `${this.nom}, ninja du village ${village}`;
}

const naruto = { nom: "Naruto" };
const sasuke = { nom: "Sasuke" };

presenter.call(naruto, "Konoha"); // "Naruto, ninja du village Konoha"
presenter.call(sasuke, "Konoha"); // "Sasuke, ninja du village Konoha"
```

`call` exécute la fonction immédiatement, avec `this` forcé au premier argument, et le reste des arguments passés un par un. C'est emprunter une fonction définie ailleurs et l'exécuter avec un objet différent de celui pour qui elle a été écrite.

## 2) `apply` : COMME CALL, MAIS LES ARGUMENTS EN TABLEAU

```js
function combo(technique1, technique2, technique3) {
 return `${this.nom} enchaîne : ${technique1}, ${technique2}, ${technique3}`;
}

const args = ["Rasengan", "Kage Bunshin", "Sennin Mode"];
combo.apply(naruto, args); // "Naruto enchaîne : Rasengan, Kage Bunshin, Sennin Mode"
```

Seule différence avec `call` : les arguments arrivent dans un tableau, pas listés un par un. Utile quand tu reçois déjà une liste d'arguments dynamique (depuis une autre fonction, un `map`, une API).

## 3) `bind` : FIGER THIS POUR TOUJOURS, SANS APPELER MAINTENANT

```js
const presenterNaruto = presenter.bind(naruto);

presenterNaruto("Konoha"); // "Naruto, ninja du village Konoha"

setTimeout(presenterNaruto, 1000, "Konoha"); // marche, this reste figé même différé
```

`bind` ne lance rien tout de suite. Il retourne une nouvelle fonction, avec `this` figé une fois pour toutes. Tu peux la stocker, la passer en callback, la passer à `setTimeout`, le `this` ne se perdra plus jamais, contrairement au piège du fichier 04.

```
call  --> exécute MAINTENANT, this imposé, arguments listés
apply --> exécute MAINTENANT, this imposé, arguments en tableau
bind  --> NE exécute RIEN, retourne une fonction avec this figé pour plus tard
```

## 4) RÉSOUDRE LE BUG DU FICHIER 04 AVEC BIND

```js
class Bouton {
 constructor(nom) {
  this.nom = nom;
  this.onClick = this.onClick.bind(this); // figé une fois, dans le constructor
 }

 onClick() {
  console.log(`${this.nom} cliqué`);
 }
}

const bouton = new Bouton("Activer le Rasengan");
document.querySelector("#btn").addEventListener("click", bouton.onClick); // marche, this figé
```

C'était le pattern standard avant les arrow functions en propriété de classe (vues au fichier 04, option 1). `bind` dans le constructeur reste un classique que tu croises énormément dans du code React en classe ou du code legacy.

## 5) L'EXEMPLE QUI CASSE : BIND SUR UNE ARROW FUNCTION

```js
const fixe = () => {
 return this.nom; // arrow function : this déjà capturé du scope englobant
};

const truc = { nom: "ça ne marchera jamais" };
const tentative = fixe.bind(truc);

tentative(); // this ignore totalement truc, bind n'a aucun effet ici
```

`bind` ne fonctionne que sur les fonctions normales. Une arrow function a déjà son `this` capturé à l'écriture (fichier 04, règle 3), et `call`, `apply`, `bind` n'ont aucun pouvoir pour le changer après coup. Essayer de "bind" une arrow function, c'est tenter de reprogrammer quelque chose qui a déjà été figé ailleurs, et ça ne lève même pas d'erreur : ça échoue en silence, ce qui est pire.

## 6) PARTIAL APPLICATION AVEC BIND : FIGER DES ARGUMENTS EN AVANCE

`bind` ne fige pas que `this`. Il peut aussi figer certains arguments, créant une nouvelle fonction avec moins de paramètres à fournir.

```js
function score(multiplicateur, bonus, nom) {
 return `${nom} : ${this.base * multiplicateur + bonus} pts`
}

const naruto = { base: 100 }

// figer this ET les deux premiers arguments
const scoreKage = score.bind(naruto, 3, 50)
// scoreKage attend maintenant juste un nom

scoreKage("Naruto") // "Naruto : 350 pts" (100 * 3 + 50)
scoreKage("Sasuke") // "Sasuke : 350 pts" (this.base toujours naruto.base)
```

C'est de la partial application (application partielle : fixer une partie des arguments d'une fonction pour créer une version spécialisée). Vu en détail dans `11_functional_js/05_partial_application.md`. `bind` est l'implémentation native en JS, sans bibliothèque.

```
fonction complete : fn(a, b, c)
après bind(ctx, a) : fn(b, c)     // a et this sont figés
```

## 7) `apply` AVEC DES TABLEAUX D'ARGUMENTS DYNAMIQUES

`apply` brille dans un cas précis : quand tu as une liste d'arguments dans un tableau et tu dois les passer à une fonction qui les attend en arguments séparés.

```js
// Math.max attend des arguments séparés : Math.max(1, 4, 2, 8)
// Problème : tu as un tableau dynamique de scores
const scores = [42, 7, 95, 13, 88]

// AVANT spread (ES5 et avant) : seul moyen était apply
Math.max.apply(null, scores) // 95 : null = this (Math.max ignore this)

// AUJOURD'HUI avec spread : plus lisible, même résultat
Math.max(...scores) // 95
```

`apply` est largement remplacé par le spread `...` en 2026. Mais tu le croiseras dans tout code avant 2015, et dans certains contextes où le tableau est dynamique et inconnu à l'avance. Le comprendre permet de lire du code legacy sans chercher.

```
call  --> fn.call(ctx, arg1, arg2)    // arguments listés un par un
apply --> fn.apply(ctx, [arg1, arg2])   // arguments dans un tableau
spread --> fn.call(ctx, ...[arg1, arg2])  // spread = apply moderne
```

## 8) L'EXEMPLE QUI CASSE : DOUBLE BIND

```js
const naruto = { nom: "Naruto" }
const sasuke = { nom: "Sasuke" }

function cri() { return this.nom }

const criNaruto = cri.bind(naruto)
const criSasuke = criNaruto.bind(sasuke) // tenter de rebind une fonction déjà bindée

criSasuke() // "Naruto" : bind ne peut pas être écrasé
```

Une fois `bind` appliqué, la fonction retournée a son `this` figé de façon permanente. Tenter de `bind` à nouveau cette fonction ne change rien : le deuxième `bind` est ignoré en silence. Même `call` et `apply` ne peuvent pas passer outre un `bind` déjà posé.

```
criNaruto = cri.bind(naruto)    // this figé sur naruto
criSasuke = criNaruto.bind(sasuke) // bind ignoré : this reste naruto
criSasuke.call(sasuke)       // call ignoré aussi : this reste naruto
```

Le risque en prod : t'as une méthode déjà bindée quelque part (dans un constructor, dans un HOC React), tu essaies de la réutiliser avec un autre contexte, et elle se comporte différemment de ce que tu attends. Pas d'erreur, juste un `this` inattendu.

Avant les arrow functions, `bind` dans le constructeur ou `var self = this` étaient les deux seules options pour garder un `this` stable dans un callback. Aujourd'hui, les arrow functions couvrent la majorité des cas simples. Mais `call`/`apply` restent irremplaçables pour "emprunter" une méthode définie sur un autre objet ou un autre prototype sans dupliquer le code, et `bind` reste utile dès que tu veux figer `this` ET certains arguments à l'avance (partial application : fixer une partie des arguments d'une fonction pour en créer une nouvelle, vue dans le module fonctionnel).

## EXERCICES

**EXO 1 : emprunt de technique**
Écris une méthode `attaquer(cible)` sur un objet `naruto`. Utilise `call` pour exécuter cette méthode avec `this` pointant vers un objet `sasuke` qui n'a jamais eu cette méthode. Le résultat doit utiliser les données de `sasuke`. (10 minutes)

**EXO 2 : combo figé**
Crée une fonction `lancerCombo(t1, t2)` qui utilise `this.nom`. Utilise `bind` pour créer une version figée sur un ninja précis, stocke-la dans une variable, et appelle-la 3 fois avec des techniques différentes sans jamais re-préciser `this`. (10 minutes)

**EXO 3 : le piège de la double tentative**
Reproduis volontairement le cas "bind sur une arrow function" de la section 5. Constate que `bind` n'a aucun effet, et écris en commentaire la raison technique exacte de cet échec silencieux. (10 minutes)

**EXO 4 : partial application**
Écris une fonction `evaluer(difficulte, expRequise, nom)` qui retourne un score. Utilise `bind` pour créer deux variantes spécialisées : `evaluerMission` (difficulté D fixée à 3) et `evaluerExamen` (difficulté fixée à 8). Appelle chaque variante sans passer la difficulté. (15 minutes)

**EXO 5 : double bind**
Crée une fonction `rang()` bindée sur un objet `jounin`. Essaie de la rebinder sur un objet `genin`. Constate le résultat, et écris en commentaire pourquoi le deuxième `bind` est ignoré et ce que ça implique pour le code qui réutilise des méthodes déjà bindées. (10 minutes)

## RÉSUMÉ

`call` et `apply` exécutent une fonction immédiatement avec un `this` imposé : seule la forme des arguments diffère (listés vs tableau). `apply` est largement remplacé par le spread `...` en 2026, mais reste présent dans tout code legacy. `bind` ne lance rien : il retourne une nouvelle fonction avec `this` figé pour de bon, et peut aussi figer des arguments en avance (partial application). Une fois bindée, une fonction ne peut plus être re-bindée : le deuxième `bind` ou un `call` sur une fonction déjà bindée sont ignorés en silence. Aucun des trois n'a d'effet sur une arrow function, parce que son `this` est capturé à l'écriture, pas à l'appel.
