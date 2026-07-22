---
stability: intemporel
---

# REFACTO IN ACTION
Temps de lecture ~8 min
Refactorer, c'est changer la structure du code sans changer son comportement.
Le piège : sans filet de sécurité, "refactorer" devient "réécrire en croisant les doigts".
Avantage : code plus clair, plus testable, plus rapide à faire évoluer. Inconvénient : sans discipline, tu casses tout en silence et tu le découvres en prod.

---

## 1) LA RÈGLE D'OR : NE JAMAIS REFACTORER SANS FILET

Avant de toucher une seule ligne, il faut un filet : des tests qui passent AVANT le refacto, et qui doivent encore passer APRÈS.

```
état initial --> tests verts --> refacto --> tests TOUJOURS verts --> comportement préservé
```

Si tu n'as pas de tests, ta première étape n'est pas de refactorer : c'est d'écrire les tests qui décrivent le comportement actuel, même moche. Tu fige le comportement avant de changer la forme.

```js
// code moche du Walking Dead Protocol, mais qui marche
function checkRations(camp) {
 let total = 0
 for (let i = 0; i < camp.survivors.length; i++) {
  total += camp.survivors[i].rationNeed
 }
 if (camp.foodStock < total) return 'CRITIQUE'
 if (camp.foodStock < total * 1.5) return 'ATTENTION'
 return 'OK'
}
```

```js
// premier réflexe : fige le comportement avec un test, AVANT de toucher au code
test('retourne CRITIQUE quand le stock est insuffisant', () => {
 const camp = { foodStock: 5, survivors: [{ rationNeed: 3 }, { rationNeed: 3 }] }
 expect(checkRations(camp)).toBe('CRITIQUE')
})

test('retourne ATTENTION quand le stock est juste', () => {
 const camp = { foodStock: 8, survivors: [{ rationNeed: 3 }, { rationNeed: 3 }] }
 expect(checkRations(camp)).toBe('ATTENTION')
})

test('retourne OK quand le stock est large', () => {
 const camp = { foodStock: 20, survivors: [{ rationNeed: 3 }, { rationNeed: 3 }] }
 expect(checkRations(camp)).toBe('OK')
})
```

Maintenant tu peux toucher `checkRations` sans peur : si tu casses quelque chose, un test rouge te le dit avant que Rick le découvre à ses dépens.

---

## 2) PETITS PAS : UN REFACTO = UNE TRANSFORMATION

L'erreur classique : ouvrir un fichier pourri et tout réécrire d'un coup. Résultat : impossible de savoir quelle modification a cassé quoi.

La bonne approche : une transformation à la fois, tests verts entre chaque étape.

```js
// étape 0 : code de départ (déjà couvert par les 3 tests au-dessus)
function checkRations(camp) {
 let total = 0
 for (let i = 0; i < camp.survivors.length; i++) {
  total += camp.survivors[i].rationNeed
 }
 if (camp.foodStock < total) return 'CRITIQUE'
 if (camp.foodStock < total * 1.5) return 'ATTENTION'
 return 'OK'
}
```

```js
// étape 1 : extraire le calcul du total (transformation isolée, tests relancés)
function calculateTotalRationNeed(survivors) {
 return survivors.reduce((sum, survivor) => sum + survivor.rationNeed, 0)
}

function checkRations(camp) {
 const total = calculateTotalRationNeed(camp.survivors)
 if (camp.foodStock < total) return 'CRITIQUE'
 if (camp.foodStock < total * 1.5) return 'ATTENTION'
 return 'OK'
}
```

```js
// étape 2 : nommer les seuils magiques (transformation isolée, tests relancés)
const ATTENTION_MULTIPLIER = 1.5

function checkRations(camp) {
 const total = calculateTotalRationNeed(camp.survivors)
 if (camp.foodStock < total) return 'CRITIQUE'
 if (camp.foodStock < total * ATTENTION_MULTIPLIER) return 'ATTENTION'
 return 'OK'
}
```

```js
// étape 3 : extraire la décision dans une fonction dédiée (transformation isolée, tests relancés)
const ATTENTION_MULTIPLIER = 1.5

function getRationStatus(foodStock, totalNeed) {
 if (foodStock < totalNeed) return 'CRITIQUE'
 if (foodStock < totalNeed * ATTENTION_MULTIPLIER) return 'ATTENTION'
 return 'OK'
}

function checkRations(camp) {
 const total = calculateTotalRationNeed(camp.survivors)
 return getRationStatus(camp.foodStock, total)
}
```

```
étape 0 --> étape 1 --> étape 2 --> étape 3
  tests   tests    tests    tests
  verts   verts    verts    verts
```

À chaque étape, le comportement est identique, mais la structure devient lisible. Si tu casses quelque chose à l'étape 2, tu sais exactement où chercher : c'est forcément dans ce que tu viens de changer.

---

## 3) IDENTIFIER LE POINT D'ENTRÉE DU REFACTO

Sur une grosse codebase comme celle de Walter White (la supply chain), tu ne refactores pas "tout" : tu choisis un point d'entrée précis.

Critères pour choisir :
- code qu'on touche souvent (chaque feature passe par là = chaque bug aussi)
- code sans test (zone à risque)
- code que personne ne comprend (feature envy, god class...)

```js
// avant : DistributionRouter fait tout, personne n'ose y toucher
class DistributionRouter {
 calculateRoute(from, to, riskMap) { /* dijkstra mélangé avec validation et logging */ }
}
```

Le refacto commence pas par "je réécris DistributionRouter". Il commence par : "je teste `calculateRoute` avec 3-4 cas réels (route safe, route à risque, route inexistante), puis j'extrais la validation, puis le logging, puis enfin je peux toucher au coeur de l'algo Dijkstra en confiance."

```
1. couvrir avec des tests
2. extraire la validation (transformation isolée)
3. extraire le logging (transformation isolée)
4. enfin : refacto de l'algo principal, en confiance
```

---

## 4) RISQUE RÉEL : LE REFACTO QUI CHANGE LE COMPORTEMENT EN CACHETTE

Le piège classique : "améliorer" une condition et changer son sens sans le voir.

```js
// avant
function canEnterArmory(survivor) {
 return survivor.trustLevel > 5 && !survivor.isInjured
}

// "refacto" qui semble équivalent... mais qui inverse la logique d'injure
function canEnterArmory(survivor) {
 return survivor.trustLevel > 5 || survivor.isInjured // <- || au lieu de && !
}
```

Sans tests, ce genre de faute de frappe passe en prod. Avec un test `canEnterArmory({ trustLevel: 10, isInjured: true })` qui doit retourner `false`, le bug est détecté à la seconde.

---

## EXERCICES

## EXO 1 : fige le comportement
Voici une fonction du Ballon d'Or :

```js
function getRankLabel(points) {
 if (points >= 500) return 'Légende'
 if (points >= 200) return 'Top 10'
 if (points >= 50) return 'Nominé'
 return 'Non classé'
}
```

Mission : écris 4 tests (un par tranche, plus un cas limite à la frontière entre deux tranches) qui figent le comportement actuel.
(durée cible : 10 minutes)

## EXO 2 : refacto en petits pas
Avec tes tests de l'EXO 1 comme filet, refactore `getRankLabel` pour utiliser un tableau de seuils au lieu d'une suite de `if`, en au moins 2 étapes distinctes (decris chaque étape).
(indice : un tableau `[{ min: 500, label: 'Légende' }, ...]` et un `.find()`)

## EXO 3 : trouve le bug de refacto
Compare ces deux versions d'une fonction qui détermine si une armure de Garo doit se désintégrer :

```js
// avant
function shouldCollapse(fightDuration, armorIntegrity) {
 return fightDuration > 99.9 || armorIntegrity <= 0
}

// après "refacto"
function shouldCollapse(fightDuration, armorIntegrity) {
 return fightDuration >= 99.9 || armorIntegrity < 0
}
```

Mission : identifie les 2 différences de comportement entre les deux versions, et donne un cas concret (valeurs précises) où elles donnent des résultats différents.

---

## RÉSUMÉ
Refactorer sans tests, c'est marcher sur une corde raide sans filet : ça peut marcher, mais le jour où ça tombe, ça fait mal. La méthode : figer le comportement avec des tests, avancer par petites transformations, vérifier les tests à chaque étape. Le code change de forme, jamais de sens. Si le sens change sans que tu l'aies décidé : c'est un bug, pas un refacto.
