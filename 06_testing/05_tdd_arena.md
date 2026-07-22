---
stability: intemporel
---

# TDD ARENA : LE TEST EN PREMIER, TOUJOURS
Temps de lecture ~8 min

La plupart des devs écrivent du code, puis pensent aux tests.
TDD inverse ça : t'écris le test d'abord, le code ensuite.

Au début ça semble bizarre. La cérémonie du Ballon d'Or a ses règles : tu sais d'avance quel comportement le système doit avoir avant d'écrire une seule ligne. Tu définies d'abord ce qui doit arriver, et le code suit. Après trois sessions TDD : t'as du mal à coder autrement.

---

## 1) LE CYCLE RED-GREEN-REFACTOR

```
RED   → écrire un test qui décrit le comportement voulu
      lancer → il échoue (normal : le code n'existe pas encore)

GREEN  → écrire le minimum de code pour que le test passe
      pas d'optimisation, pas de beauté : juste le strict minimum

REFACTOR → nettoyer le code sans casser les tests
      les tests sont verts avant et après le refacto
```

```
 RED ──→ GREEN ──→ REFACTOR
  ↑          │
  └───────────────────┘
     cycle suivant
```

Chaque nouvelle feature : un nouveau cycle. Chaque bug corrigé : commencer par écrire le test qui reproduit le bug avant de le fixer.

---

## 2) UN VRAI CYCLE : PAS À PAS

On va coder le système de vote du Ballon d'Or. Pas tout d'un coup : test par test.

### Cycle 1 : créer un votant

**RED** : le test d'abord :
```js
// ballonDor.test.js
const { creerVotant } = require('./ballonDor')

it('crée un votant avec son pays et son journal', () => {
 const votant = creerVotant('France', 'Jean Dupont', 'L\'Équipe')
 expect(votant.pays).toBe('France')
 expect(votant.nom).toBe('Jean Dupont')
 expect(votant.journal).toBe('L\'Équipe')
 expect(votant.aVoté).toBe(false)
})
```

On lance. Ça échoue. `creerVotant` n'existe pas. **C'est normal. C'est le but.**

**GREEN** : le minimum pour passer :
```js
// ballonDor.js
function creerVotant(pays, nom, journal) {
 return { pays, nom, journal, aVoté: false }
}
module.exports = { creerVotant }
```

On lance. Vert.

**REFACTOR** : rien à nettoyer ici. On passe au cycle suivant.

---

### Cycle 2 : voter

**RED** :
```js
const { creerVotant, voter } = require('./ballonDor')

it('enregistre le vote et marque le votant comme ayant voté', () => {
 const votant = creerVotant('France', 'Jean Dupont', 'L\'Équipe')
 const résultat = voter(votant, 'Messi')
 expect(résultat.choix).toBe('Messi')
 expect(résultat.votant.aVoté).toBe(true)
})
```

**GREEN** :
```js
function voter(votant, joueur) {
 return {
  choix: joueur,
  votant: { ...votant, aVoté: true }
 }
}
```

**REFACTOR** : toujours vert.

---

### Cycle 3 : empêcher de voter deux fois

**RED** :
```js
it('rejette un double vote : un journaliste ne vote qu\'une fois', () => {
 const votant = creerVotant('France', 'Jean Dupont', 'L\'Équipe')
 const votantAyantVoté = voter(votant, 'Messi').votant

 expect(() => voter(votantAyantVoté, 'Vinicius')).toThrow('Votant a déjà voté')
})
```

**GREEN** :
```js
function voter(votant, joueur) {
 if (votant.aVoté) throw new Error('Votant a déjà voté')
 return {
  choix: joueur,
  votant: { ...votant, aVoté: true }
 }
}
```

Tous les tests précédents restent verts. Le nouveau aussi.

---

## 3) CE QUE TDD FORCE À FAIRE BIEN

TDD n'est pas une discipline de test. C'est une discipline de design.

Quand tu écris le test en premier, tu te forces à répondre à ces questions **avant** de coder :
- quelle est l'interface de cette fonction ? (params, retour)
- quel comportement exact est attendu ?
- quels edge cases dois-je gérer ?

```
Dev sans TDD : code → réalise que l'interface est bizarre → refactorise → peut-être teste
Dev avec TDD : pense à l'interface → écrit le test → code → interface propre dès le départ
```

---

## 4) TDD SUR UN BUG

Bug signalé par la FIFA : "un vote est accepté même si le nom du joueur est vide."

**RED** : reproduis le bug d'abord :
```js
it('rejette un vote avec un joueur vide ou null', () => {
 const votant = creerVotant('France', 'Jean', 'L\'Équipe')
 expect(() => voter(votant, '')).toThrow('Joueur requis')
 expect(() => voter(votant, null)).toThrow('Joueur requis')
})
```

Test rouge : confirme que le bug existe.

**GREEN** :
```js
function voter(votant, joueur) {
 if (votant.aVoté) throw new Error('Votant a déjà voté')
 if (!joueur) throw new Error('Joueur requis')
 return {
  choix: joueur,
  votant: { ...votant, aVoté: true }
 }
}
```

Tous les tests sont verts. Le bug ne peut plus revenir : le test est là pour la vie.

---

## 5) TDD N'EST PAS UNE RELIGION

TDD est un outil. Pas un dogme.

Y'a des cas où il aide vraiment :
- logique métier complexe (calculs de pondération du Ballon d'Or, règles de vote)
- algorithmes avec des edge cases nombreux
- refactoring d'une feature existante

Y'a des cas où il aide moins :
- exploration d'une API inconnue (prototyper d'abord, tester après)
- UI très couplée au visuel
- scripts one-shot qui ne vivent pas longtemps

L'objectif n'est pas de faire 100% TDD. L'objectif est de penser "quel comportement j'attends ?" avant "comment je l'implémente ?". TDD force cette habitude.

---

## EXERCICES

## EXO 1 : TDD sur le calcul de classement

Implémente `calculClassement(votes)` en TDD pur.

Contraintes :
- `votes` est un tableau d'objets `{ joueur: string, points: number }`
- retourne un tableau trié par points décroissants
- deux joueurs avec le même total sont à égalité (même rang)
- un tableau vide retourne un tableau vide

Cycle obligatoire : RED → GREEN → REFACTOR pour chaque comportement.

---

## EXO 2 : TDD sur un bug réel du système de vote

Ce code a un bug silencieux. Trouve-le via TDD :
1. écris d'abord le test qui le reproduit (rouge)
2. fixe le code (vert)
3. vérifie que tous les tests précédents sont encore verts

```js
function calculePourcentageVotes(votesJoueur, totalVotes) {
 return (votesJoueur / totalVotes * 100).toFixed(2)
}
// usage attendu : calculePourcentageVotes(3, 10) → "30.00"
// mais que retourne calculePourcentageVotes(0, 0) ?
// et que retourne calculePourcentageVotes(1, 3) ? Comparer avec 0.1 + 0.2...
```

---

## RÉSUMÉ

TDD c'est : RED (test qui échoue) → GREEN (code minimal) → REFACTOR (nettoyer sans casser).
Le test en premier force à penser l'interface avant le code.
Sur les bugs : reproduire le bug par un test avant de le corriger.
TDD n'est pas un dogme : c'est l'outil qu'on sort quand la logique est complexe.
