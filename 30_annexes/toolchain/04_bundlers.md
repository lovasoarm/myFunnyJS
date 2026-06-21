# BUNDLERS : WEBPACK, VITE, ESBUILD, ROLLUP : CHOISIR SANS SUBIR

Le camp a des dizaines de fournitures éparpillées : munitions ici, médicaments là, eau ailleurs. Avant un raid, on regroupe tout en un seul sac, organisé, prêt à partir. Un bundler (empaqueteur) fait pareil avec ton code : des dizaines de fichiers JS éparpillés deviennent un (ou quelques) fichiers prêts pour le navigateur.

---

## 1) POURQUOI UN BUNDLER EXISTE

Ton code en dev ressemble à ça :

```
src/
├── index.js
├── camp/
│   ├── inventaire.js
│   ├── rations.js
│   └── garde.js
└── utils/
    └── format.js
```

```js
// index.js
import { gererInventaire } from './camp/inventaire.js';
import { calculerRations } from './camp/rations.js';
```

Le navigateur PEUT charger des modules ESM (ES Modules) nativement aujourd'hui. Mais à grande échelle, ça pose des problèmes concrets :

```
sans bundler  --> le navigateur fait une requête HTTP PAR fichier importé
                  100 fichiers = 100 requêtes réseau au chargement de la page

avec bundler  --> tout est regroupé en 1 ou quelques fichiers optimisés
                  100 fichiers = 1 requête réseau
```

**Technique :** un bundler construit un graphe de dépendances (qui importe quoi) en partant d'un point d'entrée, puis assemble tout dans un ordre cohérent, en éliminant ce qui n'est jamais utilisé.

**Qui casse en prod sans bundler :** un site avec 200 fichiers JS non bundlés sur une connexion lente. Chaque fichier est une requête séparée, avec sa latence propre. Le temps de chargement explose, le LCP (Largest Contentful Paint, métrique de performance) est catastrophique.

---

## 2) TREE SHAKING : ÉLIMINER LE CODE MORT

```js
// utils/math.js
export function additionner(a, b) { return a + b; }
export function soustraire(a, b) { return a - b; }
export function multiplier(a, b) { return a * b; }

// index.js
import { additionner } from './utils/math.js';
console.log(additionner(2, 3));
// On utilise SEULEMENT additionner
```

```
sans tree shaking --> le bundle final contient additionner, soustraire ET multiplier
avec tree shaking --> le bundle final contient SEULEMENT additionner
```

**Pourquoi ça marche :** le tree shaking (secouer l'arbre pour faire tomber les feuilles mortes) analyse statiquement (sans exécuter le code) quels exports sont réellement importés ailleurs, et supprime le reste du bundle final. Ça fonctionne uniquement avec des imports/exports ESM, écrits de façon analysable statiquement.

**Qui casse le tree shaking :**

```js
// Cette forme EMPÊCHE le tree shaking, le bundler peut pas savoir
// statiquement ce qui sera importé
const moduleName = condition ? './a.js' : './b.js';
import(moduleName); // import dynamique avec variable, imprévisible à l'analyse
```

---

## 3) WEBPACK VS VITE VS ESBUILD : PAS LE MÊME COMBAT

### Webpack : le vétéran complet, mais lent

```
Webpack bundle TOUT, même en dev, avant de servir une seule page.
Sur un gros projet : plusieurs secondes (voire dizaines) avant de voir le premier résultat.
```

### Vite : dev rapide grâce aux modules natifs du navigateur

```
En dev, Vite sert le code QUASI TEL QUEL au navigateur, via ESM natif.
Pas de bundling complet en dev : juste ce qui est demandé, transformé à la volée.
En build (production), Vite utilise Rollup en interne pour optimiser le bundle final.
```

```
démarrage Webpack (gros projet)  --> peut prendre 10-30 secondes
démarrage Vite (même projet)     --> souvent moins d'1 seconde
```

**Technique :** la différence vient de QUAND le travail est fait. Webpack bundle tout AVANT de servir quoi que ce soit. Vite sert les fichiers individuellement en dev (le navigateur gère nativement les imports ESM) et ne bundle vraiment qu'au moment du build final pour la prod.

### esbuild : la vitesse brute, écrit dans un langage compilé

```
esbuild est écrit en Go (langage compilé, pas interprété comme JS)
Résultat : il peut être 10 à 100x plus rapide que des bundlers écrits en JS pur
Souvent utilisé COMME MOTEUR à l'intérieur d'autres outils (Vite l'utilise pour certaines transformations)
```

### Rollup : la précision pour les librairies

```
Rollup excelle pour bundler des LIBRAIRIES (du code destiné à être réutilisé)
Tree shaking historiquement très précis, sortie très propre
C'est le moteur de build interne de Vite pour la production
```

```
TABLEAU DE DÉCISION RAPIDE :

application web classique en 2026     --> Vite (dev rapide + build optimisé via Rollup)
librairie à publier sur npm           --> Rollup directement, sortie plus prévisible
projet legacy déjà sur Webpack        --> reste sur Webpack sauf raison forte de migrer
besoin de vitesse brute en script CLI --> esbuild directement
```

---

## 4) CE QUI A CHANGÉ, ET POURQUOI

```
AVANT (2015-2020) : Webpack dominait sans vraie alternative sérieuse.
                     Configuration lourde, mais c'était le seul jeu en ville.

MAINTENANT (2026) : Vite a pris une bonne partie du terrain pour les apps.
                     Pourquoi : DX (developer experience) largement supérieure en dev,
                     démarrage quasi instantané, hot reload (rechargement à chaud) plus fiable.

Webpack reste utile : projets legacy, besoin de plugins très spécifiques
                       que l'écosystème Webpack a accumulés depuis 10 ans.
```

Le switch s'est fait pour une raison concrète : le temps de feedback (de "je sauvegarde" à "je vois le résultat") est devenu le facteur de productivité numéro un en dev. Un bundler lent, c'est des développeurs qui attendent, qui perdent le fil, qui changent de fenêtre en attendant. Vite a gagné du terrain en attaquant directement ce problème.

---

## EXERCICES

EXO 1 : Le sac qui pèse trop lourd :
Prends un petit projet avec 3-4 fichiers utilitaires dont certaines fonctions exportées ne sont jamais utilisées. Build-le avec un bundler ayant le tree shaking activé, et vérifie dans le fichier de sortie que les fonctions inutilisées ont bien disparu.

EXO 2 : Le import qui sabote tout :
Reproduis volontairement un import dynamique avec une variable (comme l'exemple qui casse le tree shaking plus haut). Observe dans le bundle final que le code "mort" est quand même présent, et explique en une phrase pourquoi le bundler n'a pas pu l'éliminer.

EXO 3 : Le chronomètre du camp :
Si t'as accès à un projet existant sur Webpack (ou crée un petit projet basique sur les deux), chronomètre le temps de démarrage du serveur de dev sur Webpack vs Vite. Note la différence et formule en une phrase la cause technique de cet écart.

---

## RÉSUMÉ

Un bundler regroupe des fichiers épars en un livrable optimisé pour le navigateur, en partant d'un graphe de dépendances. Le tree shaking élimine le code jamais utilisé, mais seulement si les imports/exports sont analysables statiquement. Webpack bundle tout avant de servir, Vite sert en natif pendant le dev et bundle seulement au build final, esbuild mise sur la vitesse brute, Rollup excelle pour les librairies. Le choix dépend du contexte : app web, librairie, ou legacy à maintenir. Pas de meilleur outil dans l'absolu, juste le bon outil pour le bon job.
