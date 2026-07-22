---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ARITHMÉTIQUE MODULAIRE : LE MODULO QUI TOURNE EN BOUCLE
Temps de lecture ~9 min

`%` est l'opérateur le plus sous-estimé de JS. La plupart des devs l'utilisent pour "vérifier si un nombre est pair". C'est dommage, parce que derrière le modulo se cache la logique qui pilote les cycles, les cooldowns, la pagination, les distributions équilibrées et les systèmes de rotation.

Un modulo ne calcule pas un reste. Il te dit **où tu es dans un cycle**.

---

## 1) CE QUE FAIT VRAIMENT `%`

`a % n` retourne le reste de la division euclidienne de `a` par `n`.

```js
7 % 3; // 1 : 7 = 2*3 + 1
10 % 5; // 0 : 10 = 2*5 + 0
13 % 4; // 1 : 13 = 3*4 + 1
```

**La vraie lecture :** `a % n` te donne ta position dans un cycle de taille `n`.

```
0 % 4 = 0 → position 0
1 % 4 = 1 → position 1
2 % 4 = 2 → position 2
3 % 4 = 3 → position 3
4 % 4 = 0 → retour en position 0 : le cycle recommence
5 % 4 = 1 → position 1 à nouveau
```

Visualisé :

```
index :  0 1 2 3 4 5 6 7 8 9 10 11
% 4  :  0 1 2 3 0 1 2 3 0 1  2  3
      ^-----------^-----------^-----------
      cycle    cycle    cycle
```

---

## 2) LES USAGES RÉELS

### Cycles et rotations

```js
// rotation de guard : 4 gardes, ils tournent en permanence
const gardes = ["Rick", "Daryl", "Michonne", "Glenn"];
const gardeActuel = (tour) => gardes[tour % gardes.length];

gardeActuel(0); // "Rick"
gardeActuel(4); // "Rick":le cycle repart
gardeActuel(7); // "Daryl" (7 % 4 = 3... attends)
// 7 % 4 = 3 => gardes[3] = "Glenn"
// vérifier : 7 = 1*4 + 3 => reste 3. correct.

// tournoi round-robin : match suivant dans un cycle
const equipes = ["PSG", "Real", "Bayern", "City"];
const prochainMatch = (matchActuel) => [
 equipes[matchActuel % equipes.length],
 equipes[(matchActuel + 1) % equipes.length],
];
prochainMatch(3); // ["City", "PSG"]:retour au début
```

### Pagination

```js
// page 0 → items 0, 1, 2, 3, 4
// page 1 → items 5, 6, 7, 8, 9
// page n → items n*taille à (n+1)*taille - 1

const paginer = (items, taille, page) => {
 const debut = page * taille;
 return items.slice(debut, debut + taille);
};

// numéro de page depuis un index
const pageDeIndex = (index, taille) => Math.floor(index / taille);
const positionDansPage = (index, taille) => index % taille;
```

### Cooldowns et timers cycliques

```js
// chakra de Naruto se régénère toutes les 3 actions
const peutUtiliserJutsu = (actionCount) => actionCount % 3 === 0;

// attaque spéciale disponible toutes les 5 secondes
const attaqueDisponible = (secondes) => secondes % 5 === 0;

// alternance pair/impair pour les équipes
const equipeQuiJoue = (tour) => (tour % 2 === 0 ? "domicile" : "exterieur");
```

### Distribution équilibrée

```js
// assigner des joueurs à des équipes de façon équilibrée
const assignerEquipe = (indexJoueur, nombreEquipes) =>
 indexJoueur % nombreEquipes;

// joueurs 0,3,6 => équipe 0
// joueurs 1,4,7 => équipe 1
// joueurs 2,5,8 => équipe 2

// ring buffer : structure de données circulaire
class RingBuffer {
 constructor(taille) {
  this.data = new Array(taille);
  this.taille = taille;
  this.curseur = 0;
 }

 push(valeur) {
  // écrase le plus ancien quand le buffer est plein
  this.data[this.curseur % this.taille] = valeur;
  this.curseur++;
 }
}
```

---

## 3) LE PIÈGE AVEC LES NOMBRES NÉGATIFS

En JS, `%` peut retourner un nombre négatif si l'opérande gauche est négatif. Ce n'est pas un bug JS : c'est le comportement standard de C. Mais ça casse les cycles.

```js
(-1 % 4) - // -1 en JS :pas 3 comme en maths
 (5 % 3); // -2 en JS :pas 1

// pour un vrai modulo positif :
const mod = (a, n) => ((a % n) + n) % n;

mod(-1, 4); // 3 :correct pour les cycles
mod(-5, 3); // 1 :correct
mod(7, 3); // 1 :fonctionne aussi sur les positifs
```

**Quand utiliser `mod` vs `%` :**

- indices, cycles, positions → utilise `mod` pour être safe
- vérification pair/impair sur des positifs → `%` suffit

---

## 4) MODULO ET HASHING (INTRO)

Le modulo est la dernière étape de beaucoup de fonctions de hash : ramener une valeur potentiellement énorme dans une plage fixe.

```js
// distribuer des clés dans un tableau de taille fixe
const TAILLE_TABLE = 16;

const indexHash = (valeurHash) => valeurHash % TAILLE_TABLE;
// si valeurHash = 273 => 273 % 16 = 1
// si valeurHash = 289 => 289 % 16 = 1 :collision ! (même index)
// le hash parfait n'existe pas : le modulo amplifie les collisions

// c'est la base des hash tables:module 09_data_structures creuse ça
```

---

## 5) ARITHMÉTIQUE MODULAIRE AVANCÉE : CONGRUENCES

Deux nombres sont **congrus modulo n** s'ils ont le même reste.

```js
// 7 ≡ 3 (mod 4) car 7 % 4 = 3 % 4 = 3
const congruents = (a, b, n) => a % n === b % n;

congruents(7, 3, 4); // true
congruents(13, 1, 4); // true (13 % 4 = 1, 1 % 4 = 1)
```

Utilité en pratique :

```js
// même jour de la semaine que dans n jours
const jourSemaine = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
const dansNJours = (jourActuel, n) => jourSemaine[(jourActuel + n) % 7];

// le Ballon d'Or se vote en décembre : quel mois dans 20 mois ?
const moisSuivant = (moisActuel, n) => (moisActuel + n) % 12;
// moisActuel = 11 (décembre), n = 20
// (11 + 20) % 12 = 31 % 12 = 7 => août
```

---

## EXERCICES

## EXO 1 : Le système de cooldown de Naruto

Naruto a 4 jutsus. Chaque jutsu a un cooldown en nombre de tours :

- Rasengan : cooldown 3
- Rasengan Géant : cooldown 5
- Rasenshuriken : cooldown 7
- Sage Mode : cooldown 10

Écrire `jutsuDisponible(nomJutsu, tourActuel, dernierUsage)` qui retourne `true` si le jutsu est disponible.

Puis écrire `prochainDisponible(nomJutsu, tourActuel, dernierUsage)` qui retourne dans combien de tours il sera dispo.

---

## EXO 2 : Distribution des matchs de Ligue des Champions

16 équipes, format round-robin. À chaque journée, chaque équipe joue contre une autre. Écrire une fonction qui génère le planning complet des 15 journées sans qu'une équipe joue deux fois contre la même.

(indice : algorithme de round-robin avec modulo sur les indices)

---

## EXO 3 : Ring buffer pour les replays

Dans un jeu de foot, les 10 dernières actions sont gardées en mémoire pour le replay. Implémenter un `ReplayBuffer` de taille fixe 10 avec `push(action)` et `getAll()` qui retourne les actions dans l'ordre chronologique.

---

## RÉSUMÉ

Le modulo calcule une position dans un cycle. C'est son vrai rôle : pas juste pair/impair. Les cycles, la pagination, les cooldowns, les distributions équilibrées, les ring buffers : tout ça repose sur `a % n`. Attention aux négatifs : utilise `((a % n) + n) % n` pour un modulo toujours positif. Et retiens que le modulo est la base des hash tables : ramener une valeur dans une plage, c'est toujours `hash % taille`.
