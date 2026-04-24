# INTEGRATION REACTOR — QUAND L'ISOLATION NE SUFFIT PLUS

Chaque pièce est testée unitairement. Tout est vert.
Tu branches les pièces ensemble. Ça explose.

C'est ça le problème des unit tests seuls : ils vérifient que chaque pièce fonctionne.
Ils ne vérifient pas que les pièces fonctionnent ensemble.

Les tests d'intégration comblent ce trou.

---

## 1) LA DIFFÉRENCE RÉELLE

```
Unit test       → teste une fonction isolée, toutes les dépendances mockées
Intégration     → teste plusieurs modules ensemble, dépendances réelles (ou quasi-réelles)
```

Un exemple concret avec le système de vote du Ballon d'Or :

```
Module A : validateVote(vote)       → vérifie les règles de vote
Module B : stockeVote(vote)         → persiste en base
Module C : calculClassement(votes)  → agrège et trie

Unit tests :
  - A : valide un vote correct
  - A : rejette un vote invalide
  - B : stocke un vote dans la base (mock de la DB)
  - C : calcule le classement sur un tableau de votes

Test d'intégration :
  - voter → le vote passe par A, B, C dans le bon ordre
  - le classement final reflète les votes stockés
  - une erreur en B ne corrompt pas C
```

Le test d'intégration vérifie les **contrats entre modules** : est-ce que A produit quelque chose que B accepte ? Est-ce que B stocke quelque chose que C peut lire ?

---

## 2) STRUCTURE D'UN TEST D'INTÉGRATION

```js
// vote.integration.test.js

// ici on n'est pas obligé de tout mocker
// on utilise une vraie DB de test, ou un in-memory store
const { validateVote } = require('./validateVote')
const { stockeVote, getVotes } = require('./stockeVote')
const { calculClassement } = require('./calculClassement')

describe('pipeline de vote complet', () => {
  beforeEach(() => {
    // vider le store de test entre les runs
    clearTestStore()
  })

  it('un vote valide finit dans le classement', async () => {
    // ARRANGE
    const vote = { journaliste: 'john-doe', joueur: 'messi', points: 10 }

    // ACT : pipeline complet
    const voteValidé = validateVote(vote)
    await stockeVote(voteValidé)
    const classement = await calculClassement()

    // ASSERT : résultat de bout en bout
    expect(classement[0].nom).toBe('messi')
    expect(classement[0].totalPoints).toBe(10)
  })

  it('un vote invalide ne corrompt pas le classement', async () => {
    const voteInvalide = { journaliste: null, joueur: 'neymar', points: 999 }

    expect(() => validateVote(voteInvalide)).toThrow('Journaliste requis')

    const classement = await calculClassement()
    // aucun vote invalide ne doit être dans le classement
    expect(classement).toHaveLength(0)
  })
})
```

---

## 3) IN-MEMORY VS VRAIE BASE — COMMENT CHOISIR

Pour les tests d'intégration, tu as besoin de quelque chose qui ressemble à la prod sans être la prod.

```
Option 1 : in-memory store
           avantage : ultra rapide, pas de setup
           inconvénient : ne teste pas la vraie DB
           usage : logique d'intégration entre modules JS

Option 2 : vraie DB de test (SQLite, MongoDB in-memory via mongomock)
           avantage : teste vraiment la persistance
           inconvénient : plus lent, setup requis
           usage : quand la couche de persistance est critique

Option 3 : Docker avec une DB réelle
           avantage : identique à la prod
           inconvénient : plus lourd, surtout pour CI/CD
           usage : tests d'intégration complets avant deploy
```

Pour ce curriculum, on utilise un in-memory store simple :

```js
// testStore.js — store en mémoire pour les tests d'intégration
let store = []

module.exports = {
  add: (item) => store.push(item),
  getAll: () => [...store],
  clear: () => { store = [] }
}
```

---

## 4) CE QU'UN TEST D'INTÉGRATION ATTRAPE QUE LE UNIT TEST RATE

```js
// validateVote retourne un vote avec les données normalisées
function validateVote(vote) {
  if (!vote.journaliste) throw new Error('Journaliste requis')
  return {
    ...vote,
    joueur: vote.joueur.toLowerCase().trim() // normalisé
  }
}

// stockeVote attend un champ 'playerId', pas 'joueur'
async function stockeVote(vote) {
  await db.insert({ playerId: vote.playerId, points: vote.points })
  // BUG : vote.playerId n'existe pas, validate retourne vote.joueur
  // unit tests de stockeVote ne le voient pas (vote mocké avec playerId)
  // test d'intégration le voit : playerId est undefined
}
```

Ce genre de mismatch d'interface — A retourne `joueur`, B attend `playerId` — est exactement ce que les unit tests ne peuvent pas attraper. L'intégration le voit immédiatement.

---

## 5) SCOPE ET LIMITES DES TESTS D'INTÉGRATION

Les tests d'intégration **ne remplacent pas** les unit tests.
Ils **s'ajoutent** à la pyramide.

Ce qu'ils testent :
- le contrat entre modules (format de données, erreurs propagées)
- les flux complets à travers plusieurs couches
- les effets de bord qui émergent de la combinaison

Ce qu'ils ne testent pas :
- les edge cases de chaque fonction (ça, c'est le boulot des unit tests)
- la performance (trop de variables en jeu)
- le comportement de l'UI (ça, c'est l'E2E)

---

# EXERCICES

## EXO 1 : brancher deux modules

Tu as ces deux modules :

```js
// module A : formateJoueur
function formateJoueur(raw) {
  return { id: raw._id, nom: raw.name.trim(), buts: raw.goals ?? 0 }
}

// module B : filtreEligibles
function filtreEligibles(joueurs) {
  return joueurs.filter(j => j.buts >= 10)
}
```

Écris le test unitaire pour chacun séparément.
Puis écris un test d'intégration qui vérifie le pipeline `raw → formateJoueur → filtreEligibles`.

Invente des données raw avec des noms padding et des buts variés.

---

## EXO 2 : trouver le mismatch

Ces deux fonctions ont un bug d'interface. Écris le test d'intégration qui le révèle.

```js
function prepareMission(nomMission) {
  return { missionName: nomMission, timestamp: Date.now() }
}

function logueMission(mission) {
  // attend un objet avec un champ 'name', pas 'missionName'
  console.log(`Mission lancée : ${mission.name}`)
  return mission.name !== undefined
}
```

---

# RÉSUMÉ

Les unit tests vérifient que chaque pièce marche. Les tests d'intégration vérifient que les pièces marchent ensemble.
Le mismatch d'interface — A retourne un champ que B n'attend pas — n'est visible qu'en intégration.
In-memory store pour les tests rapides, vraie DB pour les tests de persistance critique.
Les tests d'intégration ne remplacent pas les unit tests : ils les complètent.
