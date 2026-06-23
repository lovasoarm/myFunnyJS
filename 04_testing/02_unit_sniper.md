# UNIT SNIPER : TESTER UNE FONCTION PRÉCISÉMENT

Un fusil à pompe tire dans tous les sens. Il touche, mais il détruit aussi beaucoup de choses utiles.
Un sniper vise une cible précise. Un seul coup. Pas de dégâts collatéraux.

Un unit test c'est un sniper : une fonction, une responsabilité, un test isolé.
Le problème de la plupart des devs qui "testent" : ils tirent à la pompe sans le savoir.

---

## 1) CE QUE "UNITAIRE" VEUT DIRE VRAIMENT

Un test unitaire teste **une seule unité de logique**.
En JS : une fonction, une méthode, un module pur.

Ce qu'il ne fait **pas** :
- appeler une vraie base de données
- faire une vraie requête HTTP
- toucher le filesystem
- dépendre du résultat d'une autre fonction non testée

Si ton test fait ça, c'est un test d'intégration (→ voir `05_integration_reactor.md`).

```js
// PAS un unit test : dépend d'une API externe
async function testGetPlayer() {
  const player = await fetch('/api/players/10') // appel réseau réel
  assert(player.name === 'Messi')
}

// UNIT TEST : la fonction est pure, isolée, prévisible
function formatPlayerName(prenom, nom, numero) {
  return `#${numero} ${prenom.toUpperCase()} ${nom}`
}

// test :
const result = formatPlayerName('lionel', 'messi', 10)
// attendu : "#10 LIONEL messi"
```

---

## 2) ANATOMIE D'UN UNIT TEST : LES 3 PHASES

Tout bon test unitaire suit ce pattern : **AAA : Arrange, Act, Assert**

```js
// ARRANGE : prépare les données
const kills = 15
const assists = 7
const deaths = 3

// ACT : appelle la fonction testée
const score = calculeKDA(kills, assists, deaths)

// ASSERT : vérifie le résultat
expect(score).toBe(12.33) // (15 + 7/2) / 3 arrondi à 2 décimales
```

Simple. Toujours dans cet ordre. Jamais mélangé.

Si ton test fait plusieurs ACT ou plusieurs ASSERT sur des choses différentes : il teste trop de choses à la fois. Coupe-le en deux.

---

## 3) TESTER LES CAS LIMITES : LE VRAI TRAVAIL

Le cas normal, tout le monde le teste. Les edge cases, personne.
C'est pourtant là que les bugs vivent.

```js
function diviseChakra(chakraTotal, nombreNinjas) {
  return chakraTotal / nombreNinjas
}
```

Les tests qu'un dev pressé écrit :
```js
expect(diviseChakra(100, 4)).toBe(25) // normal
```

Les tests qu'un sniper écrit :
```js
expect(diviseChakra(100, 4)).toBe(25)       // cas normal
expect(diviseChakra(0, 4)).toBe(0)           // numerateur zéro
expect(diviseChakra(100, 0)).toBe(Infinity)  // division par zéro → Infinity en JS
expect(diviseChakra(-100, 4)).toBe(-25)      // valeur négative
expect(diviseChakra(1, 3)).toBeCloseTo(0.33) // flottant → pas toBe, mais toBeCloseTo
```

Chaque edge case est un futur bug évité.

---

## 4) CE QU'UN TEST DOIT DOCUMENTER

Un bon test est une documentation vivante.
En lisant le test, tu comprends ce que la fonction est censée faire : même sans regarder son implémentation.

```js
describe('calculeKDA', () => {
  it('retourne le ratio KDA standard', () => {
    expect(calculeKDA(10, 5, 2)).toBe(6.25)
  })

  it('retourne 0 si aucun kill ni assist', () => {
    expect(calculeKDA(0, 0, 5)).toBe(0)
  })

  it('retourne Infinity si deaths est 0', () => {
    expect(calculeKDA(10, 5, 0)).toBe(Infinity)
  })
})
```

`describe` groupe les tests d'une même unité.
`it` décrit le comportement attendu en langage humain.
Si le test échoue et que quelqu'un le lit, il comprend immédiatement ce qui est cassé : pas juste "un test a raté".

---

## 5) ISOLATION : POURQUOI C'EST OBLIGATOIRE

Un test unitaire qui dépend d'un autre test : c'est une bombe à retardement.

```js
// DANGEREUX : test 2 dépend du résultat de test 1
let joueurs = []

it('ajoute un joueur', () => {
  joueurs.push('Levi')
  expect(joueurs).toHaveLength(1)
})

it('supprime un joueur', () => {
  // si test 1 n'a pas tourné, joueurs est vide, ce test explose
  joueurs.pop()
  expect(joueurs).toHaveLength(0)
})
```

```js
// CORRECT : chaque test gère son propre état
it('ajoute un joueur', () => {
  const joueurs = []
  joueurs.push('Levi')
  expect(joueurs).toHaveLength(1)
})

it('supprime un joueur', () => {
  const joueurs = ['Levi']
  joueurs.pop()
  expect(joueurs).toHaveLength(0)
})
```

Règle : un test ne doit jamais supposer qu'un autre a déjà tourné avant lui.

---

# EXERCICES

## EXO 1 : le sniper de Levi

La fonction suivante calcule si un soldat du Corps d'Exploration peut participer à une mission :

```js
function peutParticiper(soldatStats) {
  return soldatStats.stamina > 50 && soldatStats.blessures === 0
}
```

Écris les tests unitaires pour cette fonction en suivant AAA :
- le cas où le soldat peut participer
- le cas où la stamina est trop basse
- le cas où il a des blessures
- le cas où les deux conditions échouent en même temps

---

## EXO 2 : trouver les edge cases

Pour cette fonction :

```js
function trancheNom(nom, longueur) {
  return nom.slice(0, longueur)
}
```

Liste tous les edge cases auxquels tu penses.
Puis écris un test pour chacun.

(Indice : qu'est-ce qui se passe si `longueur` est plus grand que `nom.length` ? Et si c'est négatif ? Et si `nom` est une chaîne vide ?)

---

## EXO 3 : réécrire un mauvais test

Ce test teste trop de choses. Coupe-le en tests unitaires propres :

```js
it('gère un joueur complet', () => {
  const joueur = { nom: 'Eren', kills: 10, deaths: 2 }
  const nomFormaté = formatNom(joueur.nom)
  const kda = calculeKDA(joueur.kills, 0, joueur.deaths)
  const badge = assigneBadge(kda)
  expect(nomFormaté).toBe('EREN')
  expect(kda).toBe(5)
  expect(badge).toBe('gold')
})
```

---

# RÉSUMÉ

Un unit test : une fonction, isolée, avec Arrange-Act-Assert.
Tester le cas normal c'est 20% du travail. Tester les edge cases c'est les 80% restants.
Un bon test documente le comportement attendu : en le lisant tu comprends la fonction.
L'isolation est obligatoire : chaque test gère son propre état, jamais celui d'un autre.
