---
stability: intemporel
---

# CLEAN CODE BASICS
Temps de lecture ~7 min
Ton code, tu l'écris une fois : tu le relis cent fois.
Le clean code, c'est pas de l'esthétique, c'est de la survie.
En prod, un nom pourri ou une fonction de 80 lignes, c'est une bombe à retardement.
Avantage : debug 10x plus rapide. Inconvénient : ça prend 2 min de plus à l'écriture.

---

## 1) NOMMAGE : LE PREMIER CONTRAT AVEC LE LECTEUR

Un nom, c'est une promesse. Si le nom dit pas la vérité, le lecteur se fait piéger.

```js
// version Sasuke en pleine crise existentielle : aucun indice
const d = 99.9

// version claire : on sait direct ce que c'est
const armorDurationLimitInSeconds = 99.9
```

`d` te dit rien. `armorDurationLimitInSeconds` te dit tout : c'est une durée, c'est une limite, c'est en secondes.

Règle simple : si tu dois ajouter un commentaire pour expliquer un nom, le nom est mauvais.

```js
// mauvais : le commentaire répare le nom pourri
const x = 3 // nombre de tentatives max

// bon : le nom porte l'info, le commentaire devient inutile
const maxRetryAttempts = 3
```

Pour les fonctions : un verbe d'action. `getPlayerStats`, `calculateDamage`, `isArmorBroken`. Si tu hésites entre deux noms, c'est souvent que la fonction fait deux choses.

---

## 2) FONCTIONS COURTES : UNE TÂCHE, UN NOM

Une fonction longue, c'est plusieurs fonctions qui se sont battues et qui ont fusionné comme des Saiyans qui dégénèrent au lieu d'évoluer.

```js
// version monstre : fait 5 trucs à la fois
function processMatch(matchData) {
 const possession = matchData.teamA.passes / (matchData.teamA.passes + matchData.teamB.passes)
 const xg = matchData.shots.reduce((acc, s) => acc + s.xgValue, 0)
 const mvp = matchData.players.sort((a, b) => b.rating - a.rating)[0]
 console.log(`Possession: ${possession}`)
 console.log(`xG: ${xg}`)
 return { possession, xg, mvp }
}
```

Personne ne veut lire ça à 23h pour debugger un bug en prod.

```js
// version découpée : chaque fonction répond à une question précise
function calculatePossession(teamA, teamB) {
 return teamA.passes / (teamA.passes + teamB.passes)
}

function calculateTotalXg(shots) {
 return shots.reduce((acc, shot) => acc + shot.xgValue, 0)
}

function findMvp(players) {
 return players.toSorted((a, b) => b.rating - a.rating)[0]
}

function processMatch(matchData) {
 return {
  possession: calculatePossession(matchData.teamA, matchData.teamB),
  xg: calculateTotalXg(matchData.shots),
  mvp: findMvp(matchData.players)
 }
}
```

```
processMatch --> calculatePossession
      --> calculateTotalXg
      --> findMvp
```

Chaque petit bloc se teste seul, se lit seul, se débugge seul.

Combien de lignes max ? Pas de règle gravée dans la pierre, mais si tu dépasses l'écran sans scroller : c'est louche. Si la fonction a plus de 2-3 niveaux d'indentation imbriqués : c'est louche aussi.

---

## 3) COMMENTAIRES : LE DERNIER RECOURS, PAS LE PREMIER

Un commentaire qui répète le code, c'est du bruit. Pire : quand le code change et que le commentaire reste, il devient un mensonge.

```js
// mauvais : le commentaire répète ce que le code dit déjà
// on incrémente i de 1
i++

// mauvais : commentaire qui va devenir faux dans 2 semaines
// cooldown de 5 secondes
const cooldown = 8
```

Un bon commentaire explique le **pourquoi**, jamais le **quoi**. Le code dit déjà le quoi.

```js
// bon : explique une décision, pas une évidence
// on cap à 99.9s : au-delà, l'armure de Garo se désintègre selon le lore
const ARMOR_LIMIT_SECONDS = 99.9
```

```js
// bon : avertit d'un comportement piège
// attention : ce sort ignore l'esquive, contrairement aux autres jutsus
function castInescapableJutsu(target) {
 return applyDamage(target, FIXED_DAMAGE)
}
```

Risque réel : un commentaire périmé est pire que pas de commentaire, parce qu'il ment avec confiance. Le prochain dev (ou toi en burn-out 6 mois plus tard) va croire ce mensonge.

---

## EXERCICES

## EXO 1 : renomme le bestiaire
Tu reçois ce bloc venu d'un vieux projet Naruto :

```js
function calc(a, b, c) {
 const r = a * b - c
 return r > 0 ? r : 0
}
```

Mission : renomme tout (fonction + paramètres) pour que n'importe quel dev comprenne direct que ça calcule des dégâts (force * multiplicateur - défense), sans qu'aucun dégât ne soit négatif.
(indice : un dégât négatif, ça n'existe pas dans la vraie vie)

## EXO 2 : découpe la fonction monstre
Tu as une fonction `handleVote(vote)` pour le Ballon d'Or qui : vérifie que le votant n'a pas déjà voté, vérifie que le joueur existe, ajoute les points, met à jour le classement, et log le tout dans la console.

Mission : découpe-la en 4-5 fonctions avec un nom clair chacune. Donne juste les signatures (nom + params), pas besoin du code complet.

## EXO 3 : chasse aux commentaires inutiles
Voici un extrait avec 4 commentaires. Identifie ceux qui sont du bruit (à supprimer) et ceux qui expliquent un vrai pourquoi (à garder).

```js
// on déclare la variable score
let score = 0

// si le joueur esquive, on skip les dégâts
// note : Naruto a un bonus d'esquive x2 le vendredi (event spécial)
if (dodged) return

// on ajoute 10 points
score += 10
```

---

## RÉSUMÉ
Un nom honnête vaut mieux que dix commentaires. Une fonction qui fait une seule chose, tu peux la tester, la lire, la jeter sans peur. Le clean code n'est pas joli pour faire joli : c'est ce qui te sauve à 2h du matin quand prod crash et que tu dois comprendre du code en 5 minutes.
