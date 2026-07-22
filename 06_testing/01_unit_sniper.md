---
stability: intemporel
---

# UNIT SNIPER : TESTER UNE FONCTION PRÉCISÉMENT
Temps de lecture ~8 min

Un fusil à pompe tire dans tous les sens. Il touche, mais il détruit aussi beaucoup de choses utiles.
Un sniper vise une cible précise. Un seul coup. Pas de dégâts collatéraux.

Daryl Dixon est sniper. Il ne vide pas un chargeur sur une horde. Il compte ses carreaux, il vise, et chaque tir doit compter. Un unit test c'est exactement ça : une fonction, une responsabilité, un test isolé. Le problème de la plupart des devs qui "testent" : ils tirent à la pompe sans le savoir.

---

## 1) CE QUE "UNITAIRE" VEUT DIRE VRAIMENT

Un test unitaire teste **une seule unité de logique**.
En JS : une fonction, une méthode, un module pur.

Ce qu'il ne fait **pas** :
- appeler une vraie base de données
- faire une vraie requête HTTP
- toucher le filesystem
- dépendre du résultat d'une autre fonction non testée

Si ton test fait ça, c'est un test d'intégration (voir `04_integration_reactor.md`).

```js
// PAS un unit test : dépend d'une API externe
async function testGetSurvivor() {
 const survivor = await fetch('/api/survivors/rick') // appel réseau réel
 assert(survivor.name === 'Rick')
}

// UNIT TEST : la fonction est pure, isolée, prévisible
function formatSurvivorName(prenom, rang, camp) {
 return `[${rang.toUpperCase()}] ${prenom} · ${camp}`
}

// test :
const result = formatSurvivorName('rick', 'leader', 'Alexandria')
// attendu : "[LEADER] rick · Alexandria"
```

---

## 2) ANATOMIE D'UN UNIT TEST : LES 3 PHASES

Tout bon test unitaire suit ce pattern : **AAA : Arrange, Act, Assert**

```js
// ARRANGE : prépare les données
const nourriture = 48    // rations disponibles au camp
const survivants = 12    // bouches à nourrir
const joursPrevu = 3    // durée de la mission

// ACT : appelle la fonction testée
const rations = calculeRationsJournalieres(nourriture, survivants, joursPrevu)

// ASSERT : vérifie le résultat
expect(rations).toBe(4) // 48 / 12 / 3 = 4 rations par survivant par jour... à peine
```

Simple. Toujours dans cet ordre. Jamais mélangé.

Si ton test fait plusieurs ACT ou plusieurs ASSERT sur des choses différentes : il teste trop de choses à la fois. Coupe-le en deux.

---

## 3) TESTER LES CAS LIMITES : LE VRAI TRAVAIL

Le cas normal, tout le monde le teste. Les edge cases, personne.
C'est pourtant là que les bugs vivent.

```js
function calculeRationsJournalieres(nourriture, survivants, jours) {
 return nourriture / survivants / jours
}
```

Les tests qu'un dev pressé écrit :
```js
expect(calculeRationsJournalieres(48, 12, 3)).toBe(4) // cas normal, journée tranquille
```

Les tests que Daryl écrit avant de partir en mission :
```js
expect(calculeRationsJournalieres(48, 12, 3)).toBe(4)    // cas normal
expect(calculeRationsJournalieres(0, 12, 3)).toBe(0)     // plus de nourriture : 0
expect(calculeRationsJournalieres(48, 0, 3)).toBe(Infinity) // 0 survivant : division par zéro → Infinity
expect(calculeRationsJournalieres(48, 12, 0)).toBe(Infinity) // 0 jours : même problème
expect(calculeRationsJournalieres(1, 3, 1)).toBeCloseTo(0.33) // flottant : pas toBe, mais toBeCloseTo
```

Chaque edge case est un vendredi soir en prod évité.

---

## 4) CE QU'UN TEST DOIT DOCUMENTER

Un bon test est une documentation vivante.
En lisant le test, tu comprends ce que la fonction est censée faire : même sans regarder son implémentation.

```js
describe('calculeRationsJournalieres', () => {
 it('retourne les rations correctes pour un camp normal', () => {
  expect(calculeRationsJournalieres(48, 12, 3)).toBe(4)
 })

 it('retourne 0 si le camp est vide de nourriture', () => {
  expect(calculeRationsJournalieres(0, 12, 3)).toBe(0)
 })

 it('retourne Infinity si personne à nourrir (division par zéro)', () => {
  expect(calculeRationsJournalieres(48, 0, 3)).toBe(Infinity)
 })
})
```

`describe` groupe les tests d'une même unité.
`it` décrit le comportement attendu en langage humain.
Si le test échoue et que quelqu'un le lit, il comprend immédiatement ce qui est cassé : pas juste "un test a raté".

---

## 5) ISOLATION : POURQUOI C'EST OBLIGATOIRE

Un test unitaire qui dépend d'un autre test : c'est une bombe à retardement. Si quelqu'un s'incruste dans le camp entre les deux tests, tout s'effondre.

```js
// DANGEREUX : test 2 dépend du résultat de test 1
let survivants = []

it('ajoute un survivant au camp', () => {
 survivants.push('Carol')
 expect(survivants).toHaveLength(1)
})

it('retire un survivant du camp', () => {
 // si test 1 n'a pas tourné, survivants est vide, ce test explose
 survivants.pop()
 expect(survivants).toHaveLength(0)
})
```

```js
// CORRECT : chaque test gère son propre état
it('ajoute un survivant au camp', () => {
 const survivants = []
 survivants.push('Carol')
 expect(survivants).toHaveLength(1)
})

it('retire un survivant du camp', () => {
 const survivants = ['Carol']
 survivants.pop()
 expect(survivants).toHaveLength(0)
})
```

Règle : un test ne doit jamais supposer qu'un autre a déjà tourné avant lui.

---

## EXERCICES

## EXO 1 : le sniper de Daryl

La fonction suivante vérifie si un survivant peut partir en mission de reconnaissance :

```js
function peutPartirEnMission(survivant) {
 return survivant.stamina > 60 && survivant.blessures === 0 && survivant.munitions > 0
}
```

Écris les tests unitaires pour cette fonction en suivant AAA :
- le cas où le survivant peut partir
- le cas où la stamina est trop basse
- le cas où il a des blessures
- le cas où les munitions sont épuisées
- le cas où les trois conditions échouent en même temps

---

## EXO 2 : trouver les edge cases

Pour cette fonction de calcul de menace du camp :

```js
function niveauMenace(zombiesDetectes, distancePérimètre) {
 return zombiesDetectes / distancePérimètre
}
```

Liste tous les edge cases auxquels tu penses.
Puis écris un test pour chacun.

(Indice : que se passe-t-il si `distancePérimètre` est 0 ? Et si les deux sont 0 ? Et si les valeurs sont négatives ?)

---

## EXO 3 : réécrire un mauvais test

Ce test teste trop de choses à la fois. Coupe-le en tests unitaires propres :

```js
it('gère un survivant complet', () => {
 const survivant = { nom: 'Michonne', kills: 40, blessures: 0 }
 const nomFormaté = formatNom(survivant.nom)
 const efficacite = calculeEfficacite(survivant.kills, survivant.blessures)
 const rang = attribueRang(efficacite)
 expect(nomFormaté).toBe('MICHONNE')
 expect(efficacite).toBe(40)
 expect(rang).toBe('elite')
})
```

---

## RÉSUMÉ

Un unit test : une fonction, isolée, avec Arrange-Act-Assert.
Tester le cas normal c'est 20% du travail. Tester les edge cases c'est les 80% restants.
Un bon test documente le comportement attendu : en le lisant tu comprends la fonction.
L'isolation est obligatoire : chaque test gère son propre état, jamais celui d'un autre.


> Complément à l'analogie Daryl Dixon : un test unitaire est aussi une **documentation de contrat exécutable**. Ce que le test décrit, c'est ce que le code PROMET. Casse le contrat → casse le test.
