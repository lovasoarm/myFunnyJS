---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# COMPOSITION : ASSEMBLER DES FONCTIONS COMME DES LEGO
Temps de lecture ~9 min

Une fonction fait une chose. Une seule.
La composition c'est : prendre ces petites fonctions et les brancher ensemble pour construire quelque chose de plus grand.
Sans récrire. Sans dupliquer. Sans une seule boucle inutile.

C'est le pattern qui rend les grandes codebases lisibles : chaque transformation est nommée, chaque étape est visible, chaque pièce est testable seule.

---

## 1) LE PROBLÈME QUE LA COMPOSITION RÉSOUT

Sans composition, les transformations s'imbriquent et deviennent illisibles.

```js
// Objectif : prendre les stats de joueurs, garder les actifs,
// calculer leur score Ballon d'Or, les trier, prendre le top 3

const joueurs = [
 { nom: "Messi",  buts: 45, passes: 20, actif: true, aCL: true },
 { nom: "Mbappé", buts: 52, passes: 15, actif: true, aCL: false },
 { nom: "Haaland", buts: 60, passes: 8, actif: true, aCL: true },
 { nom: "Benzema", buts: 30, passes: 12, actif: false, aCL: true }
]

// Version imbriquée : illisible
const top3 = joueurs
 .filter(j => j.actif)
 .map(j => ({ ...j, score: j.buts * 0.5 + j.passes * 0.3 + (j.aCL ? 30 : 0) }))
 .sort((a, b) => b.score - a.score)
 .slice(0, 3)

// Version composée : chaque étape a un nom
const filtrerActifs = joueurs => joueurs.filter(j => j.actif)
const calculerScore = joueurs => joueurs.map(j => ({
 ...j,
 score: j.buts * 0.5 + j.passes * 0.3 + (j.aCL ? 30 : 0)
}))
const trierParScore = joueurs => [...joueurs].sort((a, b) => b.score - a.score)
const prendreTop = n => joueurs => joueurs.slice(0, n)

// assemblage lisible comme une phrase
const top3 = prendreTop(3)(trierParScore(calculerScore(filtrerActifs(joueurs))))
```

C'est mieux mais l'ordre de lecture est à l'envers (de droite à gauche). `pipe` et `compose` règlent ça.

---

## 2) `pipe` : DE GAUCHE À DROITE

`pipe` applique des fonctions dans l'ordre : f1 → f2 → f3.
Le résultat de chaque fonction est passé à la suivante.

```js
// implémentation de pipe
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

// même pipeline qu'avant, mais lisible de gauche à droite
const nommerTop3BallonDor = pipe(
 filtrerActifs,
 calculerScore,
 trierParScore,
 prendreTop(3)
)

const résultat = nommerTop3BallonDor(joueurs)
// lit comme une phrase : filtre → calcule → trie → prend le top 3
```

```
joueurs
 │
 ▼ filtrerActifs
[actifs seulement]
 │
 ▼ calculerScore
[actifs + score]
 │
 ▼ trierParScore
[triés par score]
 │
 ▼ prendreTop(3)
[top 3]
```

---

## 3) `compose` : DE DROITE À GAUCHE

`compose` fait la même chose mais dans l'ordre mathématique : la dernière fonction s'applique en premier.
Utile quand tu viens des maths ou de Haskell. En pratique, `pipe` est plus courant.

```js
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

// même résultat que pipe mais ordre inversé dans la déclaration
const nommerTop3 = compose(
 prendreTop(3),  // 4e appliquée
 trierParScore,  // 3e appliquée
 calculerScore,  // 2e appliquée
 filtrerActifs  // 1re appliquée
)
```

`pipe` = ordre naturel (lecture gauche-droite)
`compose` = ordre mathématique (f ∘ g = f(g(x)))

Dans ce module on utilise `pipe` : c'est plus lisible, plus courant en JS.

---

## 4) FONCTIONS UNAIRES : LE PRÉREQUIS DE LA COMPOSITION

Une fonction se compose bien quand elle prend **un seul argument** et retourne **une valeur**.
Si ta fonction prend 2 arguments, elle ne peut pas s'insérer directement dans un `pipe`.

```js
// NE SE COMPOSE PAS : deux arguments
const filtrerParSeuil = (joueurs, seuil) => joueurs.filter(j => j.buts >= seuil)

// SE COMPOSE : curryfiée (une fonction qui retourne une fonction)
const filtrerParSeuil = seuil => joueurs => joueurs.filter(j => j.buts >= seuil)
// ou
const filtrerParSeuil = seuil => joueurs => joueurs.filter(j => j.buts >= seuil)

pipe(
 filtrerActifs,
 filtrerParSeuil(40), // on "fixe" le seuil d'abord, on obtient une fonction unaire
 calculerScore,
 trierParScore,
 prendreTop(3)
)(joueurs)
```

Le currying est couvert en détail dans `04_currying.md`. L'idée ici : pour composer, une fonction = un argument.

---

## 5) UN PIPELINE CONCRET : LE DISPATCH D'ARMURE GARO

Les Chevaliers de la Flamme reçoivent des missions. Chaque mission passe par un pipeline de transformation avant d'être dispatchée.

```js
const missions = [
 { id: "m1", chevalier: "Leon", priorite: 3, zone: "nord", actif: true },
 { id: "m2", chevalier: "Rei",  priorite: 1, zone: "sud", actif: true },
 { id: "m3", chevalier: "Kouga", priorite: 2, zone: "est", actif: false },
 { id: "m4", chevalier: "Leon", priorite: 5, zone: "nord", actif: true }
]

const filtrerActives  = ms => ms.filter(m => m.actif)
const trierParPriorite = ms => [...ms].sort((a, b) => b.priorite - a.priorite)
const formaterDispatch = ms => ms.map(m => ({
 ...m,
 label: `[MISSION ${m.id.toUpperCase()}] ${m.chevalier} → Zone ${m.zone}`
}))
const limiter = n => ms => ms.slice(0, n)

const preparerDispatch = pipe(
 filtrerActives,
 trierParPriorite,
 formaterDispatch,
 limiter(2)
)

console.log(preparerDispatch(missions))
// [
//  { ..., label: "[MISSION M4] Leon → Zone nord" },
//  { ..., label: "[MISSION M1] Leon → Zone nord" }
// ]
```

Chaque fonction est testable seule. Le pipeline est lisible comme une spec.

---

## 6) LE CAS QUI CASSE : FONCTIONS QUI RETOURNENT `undefined`

Si une fonction dans le pipe ne retourne rien (ou retourne `undefined`), tout le pipeline s'effondre.

```js
const loggerEtPasser = données => {
 console.log(données) // oubli du return
}

pipe(
 filtrerActifs,
 loggerEtPasser, // retourne undefined
 calculerScore  // reçoit undefined : TypeError
)(joueurs)
```

Fix :

```js
const loggerEtPasser = données => {
 console.log(données)
 return données // toujours retourner pour continuer le flux
}
```

Ou avec une version générique de tap :

```js
const tap = fn => données => {
 fn(données) // exécute l'effet de bord (log, etc.)
 return données // repassse les données inchangées
}

pipe(
 filtrerActifs,
 tap(console.log), // log sans casser le pipeline
 calculerScore,
 trierParScore
)(joueurs)
```

---

## EXERCICES

## EXO 1 : implémente pipe

Sans regarder l'implémentation ci-dessus, réimplémente `pipe` avec `reduce`.
Teste-la sur un pipeline simple : `pipe(x => x + 1, x => x * 2, x => x - 3)(10)`.
Résultat attendu : `19`.

---

## EXO 2 : le pipeline de match

Walter White a des données de production de lots. Construit un pipeline qui :
1. Filtre les lots avec un rendement > 90%
2. Ajoute un champ `categorie` : "premium" si rendement > 98, "standard" sinon
3. Trie par rendement décroissant
4. Prend les 3 meilleurs
5. Formate en `{ ref: "LOT-01", categorie: "premium", rendement: "99.2%" }`

```js
const lots = [
 { ref: "LOT-01", rendement: 99.2 },
 { ref: "LOT-02", rendement: 87.5 },
 { ref: "LOT-03", rendement: 95.1 },
 { ref: "LOT-04", rendement: 91.8 },
 { ref: "LOT-05", rendement: 99.8 },
 { ref: "LOT-06", rendement: 78.2 }
]
```

---

## EXO 3 : le tap dans le pipeline

Reprends le pipeline de l'EXO 2. Ajoute un `tap` qui logue le nombre de lots après le filtre, sans casser le pipeline.

---

## EXO 4 : pipeline de données de match

Tu as une liste de tirs sur but. Construis un pipeline qui calcule le xG total de l'équipe pour les tirs en 2e mi-temps uniquement.

```js
const tirs = [
 { id: 1, minute: 23, xG: 0.12, joueur: "Mbappé", miTemps: 1 },
 { id: 2, minute: 67, xG: 0.45, joueur: "Haaland", miTemps: 2 },
 { id: 3, minute: 71, xG: 0.08, joueur: "Messi",  miTemps: 2 },
 { id: 4, minute: 38, xG: 0.32, joueur: "Mbappé", miTemps: 1 },
 { id: 5, minute: 89, xG: 0.71, joueur: "Haaland", miTemps: 2 }
]

// Résultat attendu : 1.24 (xG total 2e mi-temps)
// Chaque transformation est une fonction nommée dans le pipe
```

---

## RÉSUMÉ

La composition c'est brancher des petites fonctions ensemble pour en construire de grandes.
`pipe` applique les fonctions dans l'ordre gauche à droite : le plus lisible, le plus courant.
Pour composer, les fonctions doivent être unaires (un argument) : c'est pourquoi currying et composition vont ensemble.
`tap` permet d'insérer des effets de bord (logs) dans un pipeline sans le casser.
Un pipeline bien composé se lit comme une spec : chaque étape est nommée, isolée, testable.
