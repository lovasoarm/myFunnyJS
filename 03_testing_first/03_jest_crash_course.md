# JEST CRASH COURSE — DE ZÉRO À OPÉRATIONNEL

Jest est le framework de test le plus utilisé en JS.
Pas parce qu'il est parfait : parce qu'il marche, qu'il est rapide, et qu'il a tout intégré — assertions, mocks, coverage, watch mode.

Ce fichier te rend opérationnel. Pas expert Jest, opérationnel.
La doc officielle fait 200 pages. On va couvrir les 20% qui résolvent 80% des situations.

---

## 1) INSTALLER ET CONFIGURER

```bash
npm install --save-dev jest
```

Dans `package.json` :
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

C'est tout. Jest trouve automatiquement les fichiers `*.test.js` ou `*.spec.js`.

Structure recommandée :
```
src/
  calculeKDA.js
  calculeKDA.test.js   ← jest le détecte automatiquement
```

---

## 2) STRUCTURE D'UN FICHIER DE TEST

```js
// calculeKDA.test.js

const { calculeKDA } = require('./calculeKDA')
// ou avec ESM :
// import { calculeKDA } from './calculeKDA.js'

describe('calculeKDA', () => {
  // describe = grouper les tests d'une même unité

  it('calcule le KDA standard', () => {
    // it = un test, une phrase qui décrit le comportement
    expect(calculeKDA(10, 5, 2)).toBe(6.25)
  })

  it('retourne 0 si zéro kill et zéro assist', () => {
    expect(calculeKDA(0, 0, 5)).toBe(0)
  })
})
```

`describe` peut être imbriqué pour organiser des cas complexes.
`it` et `test` sont synonymes — utilise `it` pour les phrases en "il..."

---

## 3) LES MATCHERS — CE QUE JEST SAIT COMPARER

```js
// valeurs primitives
expect(score).toBe(25)              // égalité stricte (===)
expect(score).not.toBe(0)           // négation

// objets et tableaux (comparaison profonde)
expect(joueur).toEqual({ nom: 'Eren', kills: 10 })
// toBe échouerait sur les objets (référence différente)

// nombres flottants
expect(0.1 + 0.2).toBeCloseTo(0.3)  // jamais toBe avec des flottants

// valeurs d'existence
expect(valeur).toBeDefined()
expect(valeur).toBeNull()
expect(valeur).toBeTruthy()
expect(valeur).toBeFalsy()

// tableaux
expect(liste).toHaveLength(3)
expect(liste).toContain('Messi')

// strings
expect(message).toMatch(/erreur/)   // regex

// erreurs
expect(() => {
  fonctionQuiExplose(null)
}).toThrow('message attendu')
```

Règle simple : `toBe` pour les primitives, `toEqual` pour les objets/arrays.

---

## 4) SETUP ET TEARDOWN

Parfois tu as besoin de préparer un contexte avant les tests et de le nettoyer après.

```js
describe('gestion des joueurs', () => {
  let joueurs

  beforeEach(() => {
    // s'exécute avant CHAQUE test
    joueurs = ['Levi', 'Mikasa', 'Armin']
  })

  afterEach(() => {
    // s'exécute après CHAQUE test
    // utile pour nettoyer des effets de bord (timers, mocks...)
    joueurs = null
  })

  beforeAll(() => {
    // s'exécute une seule fois avant tous les tests du describe
    // pour des setups coûteux (connexion DB simulée, etc.)
  })

  afterAll(() => {
    // une seule fois après tous les tests
  })

  it('contient 3 joueurs', () => {
    expect(joueurs).toHaveLength(3)
  })

  it('peut ajouter un joueur', () => {
    joueurs.push('Eren')
    expect(joueurs).toHaveLength(4)
    // le beforeEach remet joueurs à 3 pour le test suivant
  })
})
```

---

## 5) TESTER LES FONCTIONS ASYNC

Deux façons : `async/await` (recommandée) ou les callbacks Jest.

```js
// RECOMMANDÉ : async/await propre
it('charge les stats du joueur', async () => {
  const stats = await chargeStats('messi')
  expect(stats.buts).toBe(700)
})

// si la fonction rejette une Promise :
it('lance une erreur si joueur inconnu', async () => {
  await expect(chargeStats('joueur_inexistant')).rejects.toThrow('Joueur non trouvé')
})
```

Important : sans `async/await`, Jest peut considérer un test comme passé même si la Promise rejette.
→ Toujours `await` les Promises dans les tests. Toujours.

---

## 6) COVERAGE — VOIR CE QUI N'EST PAS TESTÉ

```bash
npm run test:coverage
```

Jest génère un rapport qui montre :
- quelles lignes ont été exécutées par les tests
- quelles branches (`if/else`) ont été couvertes
- quelles fonctions n'ont jamais été appelées

```
----------|---------|----------|---------|---------|
File      | % Stmts | % Branch | % Funcs | % Lines |
----------|---------|----------|---------|---------|
calcule.js|   85.71 |    66.67 |     100 |   85.71 |
```

66.67% sur Branch veut dire qu'une branche `if` ou `else` n'a jamais été testée.
C'est souvent là que le bug se cache.

Objectif réaliste : 80% de coverage sur la logique métier.
Ne pas chasser le 100% : certaines lignes sont du glue code qui ne mérite pas de test dédié.

---

# EXERCICES

## EXO 1 : ton premier vrai test Jest

Crée une fonction `estMVP(stats)` qui retourne `true` si le joueur a plus de 8 buts ET plus de 5 passes décisives.

Écris le fichier test avec :
- le cas MVP
- le cas non-MVP (buts suffisants mais passes insuffisantes)
- le cas non-MVP (inverse)
- le cas où les deux critères échouent

Lance `npm test` et assure-toi que tout passe.

---

## EXO 2 : tester une fonction async

Tu as cette fonction :

```js
async function recupClassement(saison) {
  if (!saison) throw new Error('Saison requise')
  // simule un appel async
  return new Promise(resolve => {
    setTimeout(() => resolve([{ nom: 'Messi', points: 613 }]), 10)
  })
}
```

Écris les tests pour :
- le cas normal : retourne un tableau avec au moins un joueur
- le cas d'erreur : saison null/undefined → doit rejeter avec "Saison requise"

---

## EXO 3 : coverage detective

Lance `npm test -- --coverage` sur tes fichiers du module 01_fundamentals.
Identifie une fonction qui a moins de 80% de coverage sur les branches.
Écris les tests manquants pour couvrir les branches oubliées.

---

# RÉSUMÉ

Jest s'installe en une commande. Il trouve les fichiers `*.test.js` automatiquement.
`describe` groupe, `it` décrit, `expect` vérifie.
`toBe` pour les primitives, `toEqual` pour les objets.
Les fonctions async se testent avec `async/await` — sans ça, Jest peut passer un test cassé.
Le coverage montre les branches non testées : c'est là que vivent les bugs.
