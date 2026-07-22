---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ARRAY METHODS BATTLE : map vs forEach vs for...of vs reduce
Temps de lecture ~9 min

Tout le monde sait utiliser `map`. Beaucoup confondent `map` et `forEach`. Peu savent quand `reduce` est la bonne réponse. Et presque personne ne pense à `for...of` quand il devrait.

Ces quatre outils font des choses différentes. Choisir le mauvais ça marche quand même : c'est pour ça que l'erreur se propage pendant des mois.

Le match commence.

---

## 1) map : transformer sans muter

`map` prend un tableau, applique une fonction sur chaque élément, et retourne un **nouveau tableau** de même longueur. L'original n'est jamais touché.

```js
const players = [
 { name: "Messi", goals: 36 },
 { name: "Mbappé", goals: 29 },
 { name: "Haaland", goals: 52 },
]

// on veut juste les noms : O(n), nouveau tableau
const names = players.map(p => p.name)
// ["Messi", "Mbappé", "Haaland"]

// on veut appliquer un bonus de 20% sur les goals
const boosted = players.map(p => ({ ...p, goals: Math.round(p.goals * 1.2) }))
// players est intact. boosted est un nouveau tableau.
```

**Règle d'utilisation** : tu veux transformer des données → tu veux un nouveau tableau en sortie → `map`.

**Le piège** :

```js
// erreur classique : utiliser map pour ses effets de bord
players.map(p => console.log(p.name))
// ça marche... mais map crée un tableau de undefined qu'on jette immédiatement
// c'est du gaspillage de mémoire. utilise forEach à la place.
```

---

## 2) forEach : itérer pour les effets de bord

`forEach` parcourt chaque élément et exécute une fonction. Il ne retourne rien. `undefined`. Toujours.

```js
const scores = [88, 72, 95, 61]

// on veut juste afficher les scores
scores.forEach((score, index) => {
 console.log(`Joueur ${index + 1} : ${score} pts`)
})

// forEach est fait pour ça : déclencher un effet à chaque élément
// sauvegarder en DB, logger, envoyer une requête, mettre à jour le DOM
```

**Ce que forEach ne peut pas faire** :

```js
// forEach ne peut pas être interrompu avec break
// tu ne peux pas sortir d'un forEach à mi-parcours

// forEach retourne undefined : tu ne peux pas chaîner
const result = scores.forEach(x => x * 2)
// result === undefined. Fin.
```

---

## 3) for...of : itérer avec contrôle total

`for...of` c'est le retour du for classique, mais propre. Il marche sur tout ce qui est itérable : tableaux, strings, Map, Set, générateurs.

```js
const jutsu = ["Rasengan", "Chidori", "Amaterasu", "Susanoo"]

// interruption possible : break fonctionne
for (const technique of jutsu) {
 if (technique === "Amaterasu") break // on s'arrête là
 console.log(technique)
}
// affiche "Rasengan", "Chidori"

// async/await fonctionne à l'intérieur
async function loadJutsu(list) {
 for (const name of list) {
  const data = await fetchJutsuData(name) // attend vraiment chaque appel
  console.log(data)
 }
}
```

**La différence avec forEach sur l'async** :

```js
const names = ["Naruto", "Sasuke", "Sakura"]

// FAUX : forEach n'attend pas les promises
names.forEach(async name => {
 const data = await fetch(`/api/ninja/${name}`)
 // forEach lance tout en parallèle sans attendre
 // l'ordre des résultats est imprévisible
})

// CORRECT : for...of attend vraiment chaque étape
for (const name of names) {
 const data = await fetch(`/api/ninja/${name}`)
 // séquentiel et prévisible
}
```

---

## 4) reduce : accumuler en une seule passe

`reduce` prend un tableau et le réduit à une seule valeur. Cette valeur peut être un nombre, un objet, un tableau, une string : n'importe quoi.

```js
const matchEvents = [
 { type: "goal", team: "A", minute: 12 },
 { type: "goal", team: "B", minute: 34 },
 { type: "goal", team: "A", minute: 67 },
 { type: "yellow", team: "B", minute: 78 },
 { type: "goal", team: "A", minute: 89 },
]

// compter les buts par équipe en une seule passe
const goals = matchEvents.reduce((acc, event) => {
 if (event.type !== "goal") return acc
 // acc est l'accumulateur : on le met à jour et on le retourne
 acc[event.team] = (acc[event.team] || 0) + 1
 return acc
}, {})

// goals = { A: 3, B: 1 }

// sans reduce, on ferait filter puis forEach : deux passes sur le tableau
// avec reduce : une seule passe
```

**Le reduce qui regroupe** :

```js
const tracks = [
 { title: "Location", genre: "trapsoul" },
 { title: "Frozen", genre: "rnb" },
 { title: "Codeine Dreaming", genre: "trapsoul" },
 { title: "Beautiful", genre: "country" },
 { title: "Die A Happy Man", genre: "country" },
]

// grouper par genre
const byGenre = tracks.reduce((acc, track) => {
 if (!acc[track.genre]) acc[track.genre] = []
 acc[track.genre].push(track.title)
 return acc
}, {})

// byGenre = {
//  trapsoul: ["Location", "Codeine Dreaming"],
//  rnb: ["Frozen"],
//  country: ["Beautiful", "Die A Happy Man"]
// }
```

**Le piège du reduce illisible** :

```js
// reduce est puissant mais peut devenir incompréhensible
// si la logique est simple, map + filter est souvent plus clair

// trop complexe pour ce que ça fait :
const total = arr.reduce((a, b) => a + b, 0)

// c'est juste une somme. Autant le nommer ou utiliser une boucle.
```

---

## 5) LE MATCH : QUAND UTILISER QUOI

```
Situation                    Méthode
──────────────────────────────────────────────────────────────────
Transformer chaque élément, même longueur    map
Effet de bord sur chaque élément (log, save)   forEach
Besoin de break ou d'async séquentiel      for...of
Réduire à une valeur (somme, objet, groupby)   reduce
Besoin d'index ET de break            for...of avec entries()
Vérifier si un élément existe          some / find
Vérifier si tous les éléments valident      every
Filtrer                     filter
```

---

## 6) LES CHAÎNES : PUISSANTES ET COÛTEUSES

```js
const survivors = [
 { name: "Rick", alive: true, kills: 34 },
 { name: "Carl", alive: true, kills: 12 },
 { name: "Lori", alive: false, kills: 3 },
 { name: "Daryl", alive: true, kills: 89 },
 { name: "Shane", alive: false, kills: 21 },
]

// chaîne filter + map : deux passes sur le tableau
const topAlive = survivors
 .filter(s => s.alive)      // passe 1 : crée un nouveau tableau
 .map(s => s.name.toUpperCase()) // passe 2 : crée encore un tableau

// avec reduce : une seule passe
const topAliveOptimized = survivors.reduce((acc, s) => {
 if (s.alive) acc.push(s.name.toUpperCase())
 return acc
}, [])

// sur 20 survivants la différence est nulle
// sur 200k éléments en prod : la chaîne coûte 2x plus de mémoire et de temps
```

---

## EXERCICES

## EXO 1 : Stats de match
_~15 min_

Tu as un tableau d'événements de match (buts, passes, cartons). Avec une seule passe sur le tableau, calcule : le nombre de buts total, le nombre de cartons rouges, et le nom du premier buteur. Pas de filtre chaîné. Un seul `reduce`.

## EXO 2 : Le bug async
_~10 min_

Ce code est cassé. Trouve le bug avant de l'exécuter, explique pourquoi les résultats sont dans le mauvais ordre, et corrige avec `for...of`.

```js
async function loadEpisodes(ids) {
 const results = []
 ids.forEach(async id => {
  const ep = await fetchEpisode(id)
  results.push(ep.title)
 })
 return results
}

const episodes = await loadEpisodes([3, 1, 2])
console.log(episodes) // qu'est-ce qui s'affiche vraiment ?
```

## EXO 3 : Ballon d'Or groupby
_~20 min_

Tu as un tableau de 30 joueurs avec `{ name, country, position, votes }`. Groupe-les par `position` avec un seul `reduce`. Le résultat doit être `{ "Forward": [...], "Midfielder": [...], ... }`. Chaque groupe trié par votes décroissants.

---

## RÉSUMÉ

`map` transforme : même longueur, nouveau tableau, jamais de mutation. `forEach` déclenche des effets : log, sauvegarde, DOM. Pas de retour. `for...of` donne le contrôle total : `break`, `continue`, `async/await` séquentiel. `reduce` accumule en une passe : grouper, sommer, restructurer. Le choix de la méthode n'est pas qu'une question de style : c'est une question de coût mémoire, de lisibilité, et de comportement async. Choisir `forEach` avec `async/await` c'est casser le séquencement sans le voir.
