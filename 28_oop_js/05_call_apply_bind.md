# CALL, APPLY, BIND : EMPRUNTER UNE FONCTION, FIGER THIS

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
call   -->  exécute MAINTENANT, this imposé, arguments listés
apply  -->  exécute MAINTENANT, this imposé, arguments en tableau
bind   -->  NE exécute RIEN, retourne une fonction avec this figé pour plus tard
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

## TIPS D'ÉVOLUTION

Avant les arrow functions, `bind` dans le constructeur ou `var self = this` étaient les deux seules options pour garder un `this` stable dans un callback. Aujourd'hui, les arrow functions couvrent la majorité des cas simples. Mais `call`/`apply` restent irremplaçables pour "emprunter" une méthode définie sur un autre objet ou un autre prototype sans dupliquer le code, et `bind` reste utile dès que tu veux figer `this` ET certains arguments à l'avance (partial application : fixer une partie des arguments d'une fonction pour en créer une nouvelle, vue dans le module fonctionnel).

## EXERCICES

EXO 1 : emprunt de technique :
Écris une méthode `attaquer(cible)` sur un objet `naruto`. Utilise `call` pour exécuter cette méthode avec `this` pointant vers un objet `sasuke` qui n'a jamais eu cette méthode. Le résultat doit utiliser les données de `sasuke`.

EXO 2 : combo figé :
Crée une fonction `lancerCombo(t1, t2)` qui utilise `this.nom`. Utilise `bind` pour créer une version figée sur un ninja précis, stocke-la dans une variable, et appelle-la 3 fois avec des techniques différentes sans jamais re-préciser `this`.

EXO 3 : le piège de la double tentative :
Reproduis volontairement le cas "bind sur une arrow function" de la section 5. Constate que `bind` n'a aucun effet, et écris en commentaire la raison technique exacte de cet échec silencieux.

## RÉSUMÉ

`call` et `apply` exécutent une fonction immédiatement avec un `this` imposé, seule la forme des arguments diffère. `bind` ne lance rien : il retourne une nouvelle fonction avec `this` figé pour de bon, utile pour les callbacks et les événements. Aucun des trois n'a d'effet sur une arrow function, parce que son `this` est déjà capturé à l'écriture, pas à l'appel.
