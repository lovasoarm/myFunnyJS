---
stability: intemporel
---

# JEST CRASH COURSE : DE ZÉRO À OPÉRATIONNEL
Temps de lecture ~9 min

Jest est le framework de test le plus utilisé en JS.
Pas parce qu'il est parfait : parce qu'il marche, qu'il est rapide, et qu'il a tout intégré : assertions, mocks, coverage, watch mode.

Ce fichier te rend opérationnel. Pas expert Jest, opérationnel.
La doc officielle fait 200 pages. On va couvrir les 20% qui résolvent 80% des situations.

Le contexte : le système de vote du Ballon d'Or. Journalistes du monde entier, votes pondérés, classement en direct. Le code doit tenir. Chaque bug en prod, c'est un scandale public.

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
 vote/
  calculeKDA.js
  calculeKDA.test.js  ← jest le détecte automatiquement
  classement.js
  classement.test.js
```

---

## 2) STRUCTURE D'UN FICHIER DE TEST

```js
// classement.test.js

const { calculerScore } = require('./classement')

describe('calculerScore', () => {
 // describe = grouper les tests d'une même unité

 it('calcule le score pondéré d\'un vote journaliste', () => {
  // it = un test, une phrase qui décrit le comportement
  // un journaliste français vote pour Messi : 10 points → pondération pays × 1.0 → 10
  expect(calculerScore({ points: 10, ponderation: 1.0 })).toBe(10)
 })

 it('applique la pondération correctement', () => {
  // zone de vote avec pondération 0.8 → 10 points → 8 points effectifs
  expect(calculerScore({ points: 10, ponderation: 0.8 })).toBe(8)
 })
})
```

`describe` peut être imbriqué pour organiser des cas complexes.
`it` et `test` sont synonymes : utilise `it` pour les phrases en "il..."

---

## 3) LES MATCHERS : CE QUE JEST SAIT COMPARER

```js
// valeurs primitives
expect(score).toBe(25)       // égalité stricte (===)
expect(score).not.toBe(0)      // négation

// objets et tableaux (comparaison profonde)
expect(joueur).toEqual({ nom: 'Messi', points: 613 })
// toBe échouerait sur les objets (référence différente)

// nombres flottants : le classique 0.1 + 0.2 !== 0.3
expect(0.1 + 0.2).toBeCloseTo(0.3) // jamais toBe avec des flottants

// valeurs d'existence
expect(valeur).toBeDefined()
expect(valeur).toBeNull()
expect(valeur).toBeTruthy()
expect(valeur).toBeFalsy()

// tableaux
expect(classement).toHaveLength(3)
expect(classement).toContain('Messi')

// strings
expect(message).toMatch(/erreur/)  // regex

// erreurs
expect(() => {
 validerVote(null)
}).toThrow('Journaliste requis')
```

Règle simple : `toBe` pour les primitives, `toEqual` pour les objets/arrays.

---

## 4) SETUP ET TEARDOWN

Avant le vote du Ballon d'Or, on prépare la salle. Après le dépouillement, on efface le tableau.
`beforeEach` et `afterEach` font pareil pour les tests.

```js
describe('gestion des votes Ballon d\'Or', () => {
 let votes

 beforeEach(() => {
  // s'exécute avant CHAQUE test : repart d'un classement vide
  votes = [
   { journaliste: 'john', joueur: 'Messi', points: 10 },
   { journaliste: 'jane', joueur: 'Ronaldo', points: 10 }
  ]
 })

 afterEach(() => {
  // s'exécute après CHAQUE test : nettoie les effets de bord
  votes = null
 })

 beforeAll(() => {
  // une seule fois avant tous les tests : connexion DB simulée, etc.
 })

 afterAll(() => {
  // une seule fois après tous les tests
 })

 it('contient 2 votes initiaux', () => {
  expect(votes).toHaveLength(2)
 })

 it('peut ajouter un vote', () => {
  votes.push({ journaliste: 'marc', joueur: 'Vinicius', points: 8 })
  expect(votes).toHaveLength(3)
  // le beforeEach remet votes à 2 pour le test suivant
 })
})
```

---

## 5) TESTER LES FONCTIONS ASYNC

Le calcul du classement final implique des appels async : agrégation, DB, calculs pondérés.
Une seule règle : toujours `await` dans les tests async. Sans ça, Jest peut passer un test cassé.

```js
// RECOMMANDÉ : async/await propre
it('agrège les votes de tous les journalistes', async () => {
 const classement = await aggregerVotes('saison-2025')
 expect(classement[0].joueur).toBe('Messi')
})

// si la fonction rejette une Promise :
it('rejette si la saison n\'existe pas', async () => {
 await expect(aggregerVotes('saison-1900')).rejects.toThrow('Saison introuvable')
})
```

Important : sans `async/await`, Jest peut considérer un test comme passé même si la Promise rejette. Le test "passe" et le bug reste invisible.

---

## 6) COVERAGE : VOIR CE QUI N'EST PAS TESTÉ

```bash
npm run test:coverage
```

Jest génère un rapport qui montre :
- quelles lignes ont été exécutées par les tests
- quelles branches (`if/else`) ont été couvertes
- quelles fonctions n'ont jamais été appelées

```
-------------|---------|----------|---------|---------
File     | % Stmts | % Branch | % Funcs | % Lines
-------------|---------|----------|---------|---------
classement.js|  85.71 |  66.67 |   100 |  85.71
```

66.67% sur Branch veut dire qu'une branche `if` ou `else` n'a jamais été testée.
C'est là que vivent les bugs qui surgissent le soir de la cérémonie.

Objectif réaliste : 80% de coverage sur la logique métier.
Ne pas chasser le 100% : certaines lignes sont du glue code qui ne mérite pas de test dédié.

---

## EXERCICES

## EXO 1 : détecter la fraude avant la cérémonie

La FIFA suspecte du vote frauduleux : certains journalistes ont voté deux fois depuis des pays différents avec le même compte. La fonction `detecterFraude(votes, journalisteId)` doit retourner `true` si le journaliste a voté plus d'une fois, `false` sinon.

Tu dois tester :
- un journaliste avec un seul vote : doit retourner `false`
- un journaliste avec deux votes depuis deux pays différents : doit retourner `true`
- un tableau de votes vide : doit retourner `false` sans exploser
- un `journalisteId` à `null` : doit lever une `Error("ID journaliste requis")`, pas silencieusement retourner `false`

Le quatrième cas est le seul qui vérifie vraiment si tu comprends la différence entre "rien ne s'est passé" et "quelque chose d'illégal s'est passé". Ne saute pas ce cas.

(Indice : `expect(() => detecterFraude(votes, null)).toThrow("ID journaliste requis")`)

---

## EXO 2 : la nuit du dépouillement (async)

Le soir de la cérémonie, le classement final se calcule de façon asynchrone : `calculerClassementFinal(annee)` agrège les votes, les pondère selon la zone géographique des journalistes, et retourne un tableau trié.

Tu as cette spec : si l'année n'a pas de votes enregistrés, la fonction doit rejeter avec `"Aucun vote pour cette année"`. Si elle a des votes, le premier élément du classement doit avoir plus de points que le deuxième.

Écris les deux tests. Le deuxième test vérifie une propriété d'ordre, pas une valeur absolue : Messi peut ne pas être premier dans ton jeu de données de test, mais le premier doit toujours dominer le second.

(Indice : `expect(classement[0].points).toBeGreaterThan(classement[1].points)`)

---

## EXO 3 : le bug invisible

Lance coverage sur ce fichier :

```js
function validerVoteJournaliste(vote) {
 if (!vote) return { valide: false, raison: 'vote manquant' }
 if (!vote.journalisteId) return { valide: false, raison: 'id manquant' }
 if (vote.points < 1 || vote.points > 10) return { valide: false, raison: 'points hors limite' }
 if (vote.annee !== 2025) return { valide: false, raison: 'mauvaise annee' }
 return { valide: true }
}
```

Sans toucher à la fonction, écris une suite de tests pour atteindre 100% de branch coverage. Identifie chaque branche, teste chaque cas, et vérifie avec `--coverage` que toutes les branches sont couvertes. Si tu arrives à 100% avec 3 tests, tu as probablement oublié un cas.

---

## RÉSUMÉ

Jest s'installe avec `npm i -D jest` : rien de plus. Il trouve les fichiers `*.test.js` automatiquement.
`describe` groupe, `it` décrit, `expect` vérifie.
`toBe` pour les primitives, `toEqual` pour les objets.
Les fonctions async se testent avec `async/await` : sans ça, Jest peut passer un test cassé.
Le coverage montre les branches non testées : c'est là que vivent les bugs.
