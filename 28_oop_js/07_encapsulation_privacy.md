# ENCAPSULATION & PRIVACY : CE QU'ON PROTÈGE VRAIMENT

"Privé" en JS n'a jamais voulu dire la même chose qu'en Java. Pendant des années, JS n'avait aucune vraie privacy (encapsulation : cacher l'état interne d'un objet pour qu'il ne soit modifié que par ses propres méthodes), et les devs simulaient ça avec des closures. Aujourd'hui, `#champPrivé` existe vraiment. Les deux méthodes coexistent, et elles ne protègent pas exactement la même chose.

## 1) LE FAUX PRIVÉ : LA CONVENTION `_champ`

```js
class CompteOldSchool {
  constructor(solde) {
    this._solde = solde; // underscore : convention, pas une protection réelle
  }

  retirer(montant) {
    this._solde -= montant;
  }
}

const compte = new CompteOldSchool(100);
compte._solde = 999999; // totalement accessible, l'underscore ne bloque rien
```

Le `_` devant un nom de propriété est une convention visuelle entre devs : "ne touche pas à ça depuis l'extérieur". Le moteur JS ne la fait respecter en rien. N'importe qui avec une référence à l'objet peut lire et écrire `_solde` directement.

## 2) LE VRAI PRIVÉ AVANT `#` : LES CLOSURES

```js
function creerCompte(soldeInitial) {
  let solde = soldeInitial; // capturé par closure, inaccessible de l'extérieur

  return {
    retirer(montant) {
      solde -= montant;
    },
    consulter() {
      return solde;
    }
  };
}

const compte2 = creerCompte(100);
compte2.retirer(30);
compte2.consulter(); // 70
compte2.solde;       // undefined : solde n'a jamais existé sur l'objet retourné
```

La variable `solde` vit dans le scope de `creerCompte`, pas sur l'objet retourné. Aucune façon d'y accéder depuis l'extérieur, même avec `Object.keys` ou `for...in`. C'est une vraie privacy, mais elle a un coût : pas de `class`, pas d'héritage facile, chaque instance recrée ses propres fonctions (le piège mémoire du fichier 02, section 2).

## 3) LE VRAI PRIVÉ AVEC `#` : LES CHAMPS PRIVÉS DE CLASSE

```js
class Compte {
  #solde; // déclaration du champ privé

  constructor(soldeInitial) {
    this.#solde = soldeInitial;
  }

  retirer(montant) {
    this.#solde -= montant;
  }

  consulter() {
    return this.#solde;
  }
}

const compte3 = new Compte(100);
compte3.retirer(30);
compte3.consulter(); // 70
compte3.#solde;       // SyntaxError, même en lecture : inaccessible depuis l'extérieur
```

`#solde` n'est pas une convention : c'est imposé par le moteur JS. Tenter d'y accéder depuis l'extérieur de la classe est une erreur de syntaxe, détectée avant même l'exécution. Contrairement à la closure, le champ privé fonctionne avec l'héritage et reste posé sur le prototype mécanisme de `class`, donc une seule définition de méthode partagée par toutes les instances.

## 4) CLOSURE VS `#` : DEUX OUTILS, DEUX USAGES

```
Closure         -->  privacy par scope, fonctionne partout (objets, modules, factories)
                 -->  coût mémoire si utilisée massivement en factory de classe
                 -->  pas d'héritage naturel

Champ privé #   -->  privacy intégrée à class, vérifiée par le moteur
                 -->  compatible avec l'héritage, économe en mémoire (sur prototype)
                 -->  uniquement disponible à l'intérieur d'une classe
```

## 5) L'EXEMPLE QUI CASSE : CROIRE QUE `#` PROTÈGE DES BUGS LOGIQUES

```js
class CompteBancaire {
  #solde = 0;

  constructor(soldeInitial) {
    this.#solde = soldeInitial;
  }

  retirer(montant) {
    this.#solde -= montant; // aucune vérification : le solde peut devenir négatif
    return this.#solde;
  }
}

const cb = new CompteBancaire(50);
cb.retirer(1000); // -950, et personne ne le voit venir depuis l'extérieur
```

`#solde` est bien inaccessible depuis l'extérieur, donc personne ne peut le manipuler directement. Mais ça ne protège en rien contre une méthode interne mal écrite. L'encapsulation protège l'accès, pas la logique. Le vrai risque de prod ici n'est pas "quelqu'un a triché depuis l'extérieur" : c'est "la méthode interne elle-même ne valide rien".

## TIPS D'ÉVOLUTION

Avant les champs privés (`#`, standardisés et largement supportés depuis 2022), la communauté JS utilisait massivement les closures pour simuler une vraie privacy, au prix d'un style "factory function" qui s'éloignait de `class`. `#` a réconcilié `class` avec une vraie encapsulation native. Les closures restent pertinentes hors contexte de classe : modules, état partagé entre quelques fonctions, factory functions légères.

## EXERCICES

EXO 1 : audit du faux privé :
Crée une `class Coffre` avec `_code` en convention underscore. Depuis l'extérieur, modifie `_code` directement et démontre que rien ne t'arrête. Réécris ensuite la même classe avec `#code`, et prouve que la même tentative lève une erreur.

EXO 2 : closure contre classe :
Implémente un compteur de chakra à la fois en closure (fonction factory) et en `class` avec champ privé `#`. Compare en commentaire les deux approches sur : facilité d'héritage, accès en lecture seule, coût mémoire si on crée 1000 instances.

EXO 3 : la fausse sécurité :
Écris une `class Inventaire` avec `#objets` (un tableau privé) et une méthode `ajouter(objet)` qui ne fait aucune validation. Montre comment un appel `ajouter(null)` ou `ajouter(undefined)` casse silencieusement l'inventaire malgré la privacy du champ.

## RÉSUMÉ

L'underscore `_champ` est une convention sociale entre devs, jamais une protection réelle imposée par le moteur. Les closures offrent une vraie privacy mais sans héritage naturel et avec un coût mémoire en usage massif. Les champs `#` offrent une vraie privacy intégrée à `class`, compatible avec l'héritage et économe en mémoire. Aucun des deux ne protège contre une logique interne mal écrite : l'encapsulation protège l'accès, pas la correction du code qui se trouve derrière.
