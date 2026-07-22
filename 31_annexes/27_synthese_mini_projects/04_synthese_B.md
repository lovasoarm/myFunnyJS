---
stability: intemporel
---

# SYNTHÈSE B : OPTIMISER LA CHAÎNE DE DISTRIBUTION DE WALTER
Temps de lecture ~6 min

> Couvre : `08_memory_performance` + `09_data_structures` + `10_algorithms` + `11_functional_js`
> Durée cible : 100 à 160 minutes
> Le math_basics (05) est mobilisé en transverse, pas comme bloc séparé.

---

## LE CONTEXTE

Walter White a maintenant 12 distributeurs actifs sur 4 villes. Chaque ville a un niveau de risque qui change en temps réel (descente de police probable, concurrence locale, surveillance). Il veut un système qui calcule, à chaque mise à jour de risque, la meilleure route de livraison sans jamais recalculer tout le réseau depuis zéro.

Le problème de Walter, c'est pas de coder un Dijkstra. N'importe qui sait taper `npm install dijkstra-algorithm`. Le problème, c'est de savoir QUAND son réseau devient assez gros pour que ça compte, et de le construire de façon à pas exploser la mémoire à chaque update.

---

## CE QUE TU DOIS LIVRER

```
src/
├── reseauDistribution.js  le graphe et sa construction
├── routeFinder.js     le calcul de meilleure route
└── stockOptimizer.js    l'optimisation du stock par route (knapsack)

tests/
└── reseauDistribution.test.js
```

---

## CONTRAINTES TECHNIQUES PRÉCISES

**Du module 09 (data structures) :**
Le réseau de distribution est un graphe orienté pondéré. Le poids de chaque arête (route) doit changer dynamiquement selon le niveau de risque de la ville de destination, sans reconstruire le graphe entier à chaque update.
(indice : qu'est-ce qui distingue une structure qu'on reconstruit d'une structure qu'on met à jour ?)

**Du module 10 (algorithms) :**
Dijkstra pour trouver la route la plus sûre entre deux villes. Mais attention : Walter veut aussi pouvoir dire "donne-moi la route la plus sûre PARMI les 3 plus rapides", pas juste la plus sûre tout court. Ça veut dire combiner deux critères, pas juste appliquer l'algo de base tel quel.
Le knapsack (sac à dos) pour `stockOptimizer.js` : étant donné une capacité de transport limitée par route, quel mix de jutsus maximise la valeur transportée sans dépasser la capacité.

**Du module 11 (functional js) :**
Tout le pipeline de calcul (de la mise à jour du risque jusqu'à la route finale recommandée) doit être composé avec des fonctions pures chaînées, pas une suite d'instructions impératives avec des variables intermédiaires réassignées. Utilise `pipe` ou `compose`.
(indice : si tu te retrouves à écrire `let resultat = ...` puis `resultat = autreChose(resultat)` trois fois de suite, t'es en train de coder impératif avec un vernis fonctionnel)

**Du module 08 (memory performance), le vrai coeur de cette synthèse :**
Avant de livrer, tu dois profiler ton calcul de route sur un réseau simulé de 500 villes (pas 4, 500, pour forcer la mesure réelle) avec `performance.now()`. Tu dois pouvoir répondre à : ton calcul de route est en quel ordre de grandeur (Big O) ? Et est-ce que ta structure de graphe provoque des copies inutiles à chaque update de risque ?

Mobilise aussi le module 07 (math) : le calcul de risque combiné (probabilité de descente x probabilité de concurrence) doit utiliser une vraie formule de probabilité combinée, pas juste une moyenne approximative.

---

## CE QUI SE PASSE SI TU ZAPPES UNE CONTRAINTE

Si tu reconstruis le graphe entier à chaque update de risque : sur 4 villes ça se voit pas. Sur 500, ton système devient inutilisable en production, et c'est exactement le genre de décision qui semblait anodine au début et qui coûte une réécriture complète 6 mois plus tard.

Si tu codes le pipeline en impératif avec des `let` réassignés partout : ça marche, mais tu perds la capacité de tester chaque étape isolément, et le jour où Walter veut ajouter un critère de calcul, tu dois rouvrir toute la fonction au lieu d'insérer une étape dans le pipe.

---

## CHECKLIST AVANT DE VALIDER

```
[ ] Le poids des arêtes se met à jour sans reconstruction complète du graphe
[ ] Dijkstra combine 2 critères (sécurité + rapidité), pas un seul
[ ] Le knapsack respecte une capacité de transport stricte
[ ] Le pipeline de calcul est composé avec pipe/compose, zéro let réassigné en chaîne
[ ] Un profiling réel existe sur 500 villes simulées, avec un ordre de grandeur Big O affirmé
[ ] Le calcul de risque combiné utilise une vraie formule de probabilité, pas une moyenne
```

Si ton profiling te dit O(n²) sur un truc qui devrait être O(n log n) : c'est pas la fin du monde, mais c'est un signal que ta structure de données du module 09 a un problème de fond, pas juste un détail d'implémentation.

---

> **Rappel `DEPENDENCY_LEDGER`** : avant de clore ce bloc, ouvre `DEPENDENCY_LEDGER.md` à la racine et ajoute une ligne par outil IA utilisé (quoi, quand, pourquoi, combien de temps gagné/perdu). Silence = drift.
