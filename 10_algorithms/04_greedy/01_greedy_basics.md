---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# GREEDY : PRENDRE LE MEILLEUR CHOIX LOCAL ET ASSUMER
Temps de lecture ~11 min

L'idée est simple jusqu'à l'excès : à chaque étape, tu prends la meilleure option disponible. Tu ne reviens jamais en arrière. Tu ne vérifies pas si ça tient globalement. Tu fonces.

Parfois c'est optimal. Parfois c'est une catastrophe. La vraie compétence greedy, c'est pas de savoir l'implémenter : c'est de savoir quand le faire confiance et quand ne pas le faire.

En prod, greedy c'est ce qui tourne derrière le scheduling de tasks, la compression Huffman, les algorithmes de spanning tree (réseau de câbles, routing). Pas de la théorie.

---

## 1) L'INTUITION : POURQUOI ÇA MARCHE (PARFOIS)

Greedy fonctionne quand le problème a deux propriétés :

**Sous-structure optimale** : la solution optimale globale contient les solutions optimales de ses sous-problèmes.

**Propriété greedy** : le choix local optimal mène toujours à la solution globale optimale.

Si les deux sont là : greedy est parfait. Plus rapide que DP, plus simple à coder.
Si une des deux manque : greedy donne une solution approchée, jamais garantie optimale.

```
Problème du rendu de monnaie avec pièces [1, 5, 10, 25] :
rendre 41 centimes

greedy : 25 + 10 + 5 + 1 = 4 pièces  OPTIMAL

Problème du rendu de monnaie avec pièces [1, 3, 4] :
rendre 6

greedy : 4 + 1 + 1 = 3 pièces
DP :   3 + 3   = 2 pièces     GREEDY RATE
```

---

## 2) ACTIVITY SELECTION : LE CAS D'ÉCOLE

Tu as N activités, chacune avec un début et une fin. Tu peux en faire une à la fois. Maximise le nombre d'activités complétées.

**Choix greedy :** trier par heure de fin, puis prendre l'activité si elle commence après la fin de la dernière choisie.

**Pourquoi ça marche :** choisir l'activité qui finit le plus tôt libère le maximum de temps pour les suivantes. C'est prouvable par échange : si tu remplaces l'activité qui finit le plus tôt par une autre qui finit plus tard, tu ne gagnes jamais de slot supplémentaire.

```js
function activitySelection(activities) {
 // trier par heure de fin : l'activité qui libère le plus tôt passe devant
 const sorted = [...activities].sort((a, b) => a.end - b.end)

 const selected = [sorted[0]]
 let lastEnd = sorted[0].end

 for (let i = 1; i < sorted.length; i++) {
  const activity = sorted[i]
  // cette activité commence après que la précédente soit finie ?
  if (activity.start >= lastEnd) {
   selected.push(activity)
   lastEnd = activity.end
  }
  // sinon : skip, on continue avec la prochaine
 }

 return selected
}

const activities = [
 { name: "Entraînement Naruto", start: 1, end: 4 },
 { name: "Combat Sasuke", start: 3, end: 5 },
 { name: "Mission C", start: 0, end: 6 },
 { name: "Briefing Kakashi", start: 5, end: 7 },
 { name: "Mission B", start: 3, end: 9 },
 { name: "Repos Hokage", start: 6, end: 10 },
 { name: "Examen Chunin", start: 8, end: 11 },
]

console.log(activitySelection(activities).map(a => a.name))
// ["Entraînement Naruto", "Combat Sasuke", "Briefing Kakashi", "Examen Chunin"]
// => 4 activités, c'est le maximum possible
```

**Trace :**
```
Tri par end : end=4, end=5, end=6, end=7, end=9, end=10, end=11

Prise : end=4 (lastEnd=4)
Skip : start=3, 3 < 4
Skip : start=0, 0 < 4
Prise : start=5 >= 4, end=7 (lastEnd=7)
Skip : start=3, 3 < 7
Skip : start=6, 6 < 7
Prise : start=8 >= 7, end=11 (lastEnd=11)

Résultat : 3 activités... mais l'exemple en haut donne 4 ?
```

Attends : `"Combat Sasuke"` (start=3, end=5) est sélectionné avant `"Briefing Kakashi"` (start=5, end=7). Après Sasuke (lastEnd=5), Kakashi (start=5 >= 5) est sélectionné. Après Kakashi (lastEnd=7), Examen (start=8 >= 7) est sélectionné. Total : 4. La trace confirme.

---

## 3) FRACTIONAL KNAPSACK : GREEDY GAGNE

Tu as un sac de capacité `W`. Des objets avec un poids et une valeur. Tu peux prendre des fractions d'objets. Maximise la valeur totale.

**Choix greedy :** trier par ratio valeur/poids décroissant. Remplir avec l'objet le plus rentable, puis le suivant, etc.

**Pourquoi ça marche :** puisqu'on peut couper les objets, prendre le ratio le plus élevé d'abord est toujours optimal. Aucun regret possible : une fraction d'un objet moins rentable ne peut jamais compenser.

```js
function fractionalKnapsack(capacity, items) {
 // trier par ratio valeur/poids : le plus rentable d'abord
 const sorted = [...items].sort((a, b) =>
  (b.value / b.weight) - (a.value / a.weight)
 )

 let totalValue = 0
 let remaining = capacity

 for (const item of sorted) {
  if (remaining <= 0) break

  if (item.weight <= remaining) {
   // on prend l'objet entier
   totalValue += item.value
   remaining -= item.weight
  } else {
   // on prend la fraction qui rentre
   const fraction = remaining / item.weight
   totalValue += item.value * fraction
   remaining = 0
  }
 }

 return totalValue
}

// Les stocks de Walter White : valeur / poids = rentabilité par kg
const items = [
 { name: "Blue Sky", value: 60, weight: 10 }, // ratio 6
 { name: "Meth basique", value: 100, weight: 20 }, // ratio 5
 { name: "Précurseurs", value: 120, weight: 30 }, // ratio 4
]

console.log(fractionalKnapsack(50, items)) // 240
// Blue Sky complet (10kg, +60) + Meth complet (20kg, +100) + 20/30 des Précurseurs (+80) = 240
```

---

## 4) 0/1 KNAPSACK : GREEDY ÉCHOUE

Même problème, mais on ne peut pas couper les objets. On prend ou on ne prend pas.

```js
// items = [{value: 60, weight: 10}, {value: 100, weight: 20}, {value: 120, weight: 30}]
// capacity = 50

// Greedy (ratio) :
// Blue Sky (60/10=6) : poids 10, restant 40
// Meth basique (100/20=5) : poids 20, restant 20
// Précurseurs (120/30=4) : poids 30 > restant 20, on skip
// Total greedy : 160

// Optimal (DP) :
// Meth basique + Précurseurs : 20+30=50, valeur = 100+120 = 220

// Greedy : 160
// DP : 220
// => greedy rate de 38% sur cet exemple
```

La différence : avec des fractions, le regret n'existe pas. Sans fractions, choisir le ratio le plus élevé peut bloquer une combinaison plus rentable.

---

## 5) JUMP GAME : GREEDY SUR UN TABLEAU

Tableau d'entiers. Chaque valeur = nombre maximum de sauts depuis cette position. Depuis la position 0, peut-on atteindre la dernière position ?

**Choix greedy :** maintenir le `maxReach` : la position maximale qu'on peut atteindre depuis n'importe quelle position visitée jusqu'ici.

```js
function canJump(nums) {
 let maxReach = 0

 for (let i = 0; i < nums.length; i++) {
  // si on ne peut pas atteindre cette position : bloqué
  if (i > maxReach) return false

  // mettre à jour la portée maximale depuis ici
  maxReach = Math.max(maxReach, i + nums[i])
 }

 return true
}

console.log(canJump([2, 3, 1, 1, 4])) // true
console.log(canJump([3, 2, 1, 0, 4])) // false : maxReach stagne à 3, jamais atteint 4
```

**Trace sur `[3, 2, 1, 0, 4]` :**
```
i=0 : maxReach = max(0, 0+3) = 3
i=1 : maxReach = max(3, 1+2) = 3
i=2 : maxReach = max(3, 2+1) = 3
i=3 : maxReach = max(3, 3+0) = 3
i=4 : 4 > maxReach(3) => return false
```

---

## 6) QUAND GREEDY ÉCHOUE : LA FRONTIÈRE

```
Problème du rendu de monnaie avec pièces non standard [1, 3, 4], rendre 6 :
Greedy : 4 + 1 + 1 = 3 pièces
DP :   3 + 3   = 2 pièces

0/1 Knapsack (vu ci-dessus)

Problème du voyageur de commerce (TSP) :
Greedy (plus proche voisin) donne souvent 20-25% de plus que l'optimal.
C'est NP-difficile : aucun algo polynomial ne garantit l'optimal.

Shortest path avec arêtes négatives :
Greedy échoue : Bellman-Ford ou SPFA sont nécessaires.
```

La règle : si le problème a une **dépendance entre les choix** qui rend un choix local sous-optimal globalement, greedy rate. DP ou backtracking prennent le relais.

---

## EXERCICES

## EXO 1 : LE PLANNING DES CHEVALIERS DE GARO
_~15 min_


Cinq Chevaliers de la Flamme. Chacun peut prendre une mission par nuit. Les missions ont des horaires de début et de fin. Objectif : affecter le maximum de missions au total (tous Chevaliers confondus).

```js
const missions = [
 { id: "M1", start: 0, end: 3 },
 { id: "M2", start: 1, end: 4 },
 { id: "M3", start: 3, end: 6 },
 { id: "M4", start: 2, end: 5 },
 { id: "M5", start: 5, end: 8 },
 { id: "M6", start: 6, end: 9 },
]
```

Implémenter `assignMissions(missions, knightCount)`. Retourner un objet `{ knight1: [...], knight2: [...], ... }` avec le maximum de missions assignées.

(indice : trie par heure de fin. Pour chaque mission, cherche un Chevalier libre)

---

## EXO 2 : LA SUPPLY CHAIN DE WALTER
_~20 min_


Walter a des livraisons à faire. Chaque livraison a un bénéfice et un poids. Le véhicule peut transporter `W` kg. Les livraisons sont divisibles (on peut livrer une fraction). Maximiser le bénéfice total.

Implémenter `optimizeDelivery(capacity, deliveries)` avec le fractional knapsack. Retourner le bénéfice total et la liste des fractions prises.

---

## EXO 3 : FUITE DE FOX RIVER
_~20 min_


Michael Scofield doit traverser des couloirs de la prison. Chaque cellule du couloir a un nombre : le nombre de pas maximum qu'il peut faire depuis là. Peut-il atteindre la sortie (dernière position) ?

```js
// couloirs[i] = nombre de pas max depuis i
const corridors = [2, 3, 0, 1, 4] // true
const blocked = [3, 2, 1, 0, 4]  // false
```

Implémenter `canEscape(corridor)` avec l'approche greedy `maxReach`.

---

## EXO 4 : PIÈGE GREEDY
_~25 min_


Montrer par l'exemple que greedy échoue sur ce problème de pièces.

```js
const coins = [1, 3, 4]
const amount = 6
// greedy : 4 + 1 + 1 = 3 pièces
// optimal : 3 + 3 = 2 pièces
```

Implémenter `greedyCoins(coins, amount)` qui utilise greedy, et `dpCoins(coins, amount)` qui utilise DP. Comparer les deux résultats. Trouver 3 autres valeurs d'`amount` où greedy échoue avec ces pièces.

---

## RÉSUMÉ

Greedy, c'est rapide et élégant quand le problème a la propriété greedy : le choix local optimal = choix global optimal. Activity selection, fractional knapsack, jump game : greedy est parfait là-dessus. Dès qu'il y a des dépendances entre les choix (0/1 knapsack, rendu de monnaie avec pièces non standard), greedy rate silencieusement. Le signe que greedy ne suffira pas : quand un bon choix maintenant peut bloquer une meilleure combinaison plus tard.
