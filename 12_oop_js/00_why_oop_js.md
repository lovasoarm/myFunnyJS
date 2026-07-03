# POURQUOI CE MODULE MÉRITE TON TEMPS : OOP EN JS
Temps de lecture ~6 min

## CE QUE TU CROIS SAVOIR

Tu écris déjà des `class` depuis un moment. `extends`, `constructor`, `super()` : tu connais la danse. Tu places des objets, ça marche, tu passes au truc suivant.

Sauf que `class` en JS, c'est une façade. Derrière, il y a un mécanisme complètement différent de l'OOP (programmation orientée objet) que tu trouves en Java ou en C#. JS n'a pas de vraies classes au sens classique. Il a des objets qui pointent vers d'autres objets. Toute la baraque tient sur un seul truc : la chaîne de prototypes (prototype chain : la suite de liens entre objets utilisée pour chercher une propriété).

Si tu ne sais pas ça, tu codes avec une classe que tu ne comprends pas vraiment.

## QUI SOUFFRE QUAND CE SUJET EST IGNORÉ

Le dev qui debug un `this` qui pointe vers `undefined` à 23h alors que la fonction marchait "il y a deux secondes" dans la console.

Le dev qui copie un objet, le modifie, et découvre que l'objet "source" a changé aussi, parce qu'il n'avait jamais compris que `extends` ne clone rien : ça chaîne des références.

Le dev qui empile 5 niveaux d'héritage parce que "ça a l'air propre", et qui six mois plus tard ne sait plus dans quelle classe parente chercher le bug.

Le dev qui pense que `#champPrivé` protège vraiment quelque chose, alors qu'il ne comprend pas ce que ça empêche réellement.

## OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

Tu rencontres ce module partout, même sans le voir :

```
Framework front (composants, classes de base)   --> prototype chain
ORM (mapping objet-relationnel)                  --> classes, héritage de modèles
Erreurs custom (HorrorEscapeError, etc.)         --> extends Error
Librairie tierce mal documentée                  --> tu dois lire son prototype à la main
DevTools, debug d'un bug "this is undefined"     --> call-site, bind
```

Même si tu fais 100% fonctionnel dans ton code à toi, tu consommes du code OOP écrit par d'autres. Node, le DOM, les classes d'erreur natives : tout ça repose sur ce mécanisme. Tu ne peux pas l'éviter, tu peux juste choisir de le comprendre ou de le subir.

## MODERNE, LEGACY OU INTEMPOREL ?

Le prototype : intemporel. C'est le moteur. Il ne bougera pas, parce que toute la syntaxe moderne (`class`) est construite par-dessus, pas à la place.

`class` : moderne, là pour rester. Introduite en ES6 (2015), elle a remplacé l'écriture manuelle avec des fonctions constructeurs dans le code applicatif courant.

Les fonctions constructeurs à la main (`function Truc() {}` + `Truc.prototype.x = ...`) : legacy dans le code neuf, mais tu les croises encore dans du vieux code à maintenir, dans des libs anciennes, ou dans des explications de concours techniques.

Closures pour la privacy : toujours utilisées, mais `#champPrivé` a changé la donne depuis son arrivée stable dans les moteurs modernes.

## CE QUI CHANGE QUAND TU MAÎTRISES ÇA

Avant : tu écris du code OOP en espérant que ça marche.
Après : tu sais pourquoi un objet trouve une méthode, pourquoi `this` change de valeur, pourquoi deux instances ne partagent pas leurs champs mais partagent leurs méthodes, et pourquoi une hiérarchie d'héritage profonde est souvent une mauvaise idée.

Tu deviens capable de lire le code source d'une lib que tu ne connais pas, et de comprendre sa structure d'objets sans paniquer.

## CE QUI CASSE QUAND TU L'IGNORES

```
Tu ignores le prototype  -->  tu ne sais pas où vit une méthode
                          -->  tu la redéfinis par accident
                          -->  bug silencieux, comportement écrasé

Tu ignores this           -->  tu passes une méthode en callback
                          -->  this devient undefined
                          -->  crash en prod sur un cas que la démo ne testait pas

Tu ignores la composition -->  tu empiles les extends
                          -->  changement dans la classe racine
                          -->  tout l'arbre d'héritage explose
```

## CE QU'ON FAIT DANS CE MODULE

On démonte la machine entièrement. D'abord la chaîne de prototypes à la main, sans aucun sucre syntaxique. Ensuite les fonctions constructeurs, la méthode pré-`class`. Puis `class`, pour prouver que c'est juste un wrapper (une enveloppe) sur ce qu'on vient de voir. Puis `this` et ses règles de call-site (point d'appel : l'endroit où la fonction est réellement invoquée). Puis `call`/`apply`/`bind` pour reprendre le contrôle sur `this`. Puis l'héritage et son piège classique. Puis l'encapsulation réelle (`#privé` vs closures). Puis `static`/`get`/`set`. Et on finit sur la vraie question senior : composition ou héritage.

Dix fichiers techniques. Zéro raccourci. À la fin, tu ne récites plus du JS orienté objet : tu sais ce qu'il fait, sous le capot, à chaque ligne.

## AILLEURS QUE JS

En Python, l'objet est un dictionnaire d'attributs et l'héritage suit un MRO (Method Resolution Order), pas une chaîne de prototypes. En Java, les classes sont réelles, pas du sucre. En Rust, pas d'héritage : composition via traits. Le concept (lier comportement et données) est universel ; JS le fait par prototypes là où d'autres le font par classes.
