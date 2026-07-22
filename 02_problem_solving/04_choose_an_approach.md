---
stability: intemporel
---

# CHOISIR UNE APPROCHE AVANT DE CODER
Temps de lecture ~9 min

Il y a toujours au moins deux façons de résoudre un problème.

La plupart des devs choisissent la première qui leur vient en tête et codent. Si ça marche, ils s'arrêtent là. Deux semaines plus tard, ils se battent contre leur propre code.

Comparer deux approches avant d'en implémenter une seule : c'est ça qui sépare un dev qui subit ses décisions d'un dev qui les fait.

---

## 1) POURQUOI COMPARER AVANT DE CODER

Coder, c'est cher. Pas en temps machine. En temps cerveau.

Une fois que t'as codé une solution, tu es attaché à elle. Psychologiquement. Tu vas défendre tes choix même quand ils sont mauvais. Tu vas refuser de voir les problèmes.

Comparer sur papier (ou en pseudo-code) : ça coûte rien et ça t'évite de t'attacher à quelque chose avant d'avoir réfléchi.

```
Approche A  vs  Approche B
  |         |
avantages     avantages
inconvénients   inconvénients
coût de change  coût de change
  |         |
  +--> décision documentée
```

---

## 2) LES QUATRE DIMENSIONS DE COMPARAISON

Quand tu compares deux approches, tu regardes quatre choses :

**Complexité** : l'approche est-elle compréhensible par quelqu'un qui arrive demain sur le code ?

**Performance** : quelle est la complexité algorithmique ? Est-ce que ça compte pour ce contexte ?

**Couplage** : est-ce que cette approche crée des dépendances qu'on va regretter ?

**Coût de changement** : si les specs changent dans 3 semaines, combien de code on touche ?

```
// Contexte : trouver le joueur avec le plus de buts dans une liste de 50 joueurs

// Approche A : trier la liste et prendre le premier
// O(n log n) -- compréhensible -- mais modifie l'ordre original
joueurs.sort((a, b) => b.buts - a.buts)[0]

// Approche B : un seul passage avec reduce
// O(n) -- plus rapide -- préserve l'ordre -- un peu moins lisible au premier coup d'oeil
joueurs.reduce((meilleur, joueur) =>
 joueur.buts > meilleur.buts ? joueur : meilleur
)

// Décision : sur 50 joueurs, la différence de perf est négligeable
// Approche A gagne sur la lisibilité
// Si la liste fait 1M d'éléments : Approche B sans hésiter
```

La bonne approche dépend du contexte. Il n'y a pas de réponse universelle. Il y a des décisions documentées.

---

## 3) LA TECHNIQUE DU "ET SI"

Avant de choisir, tu te poses une question sur chaque approche :

**Et si les specs changeaient dans le sens le plus probable ?**

```
Contexte : système de routes pour Walter White

Approche A : stocker les routes dans un tableau trié manuellement
Approche B : stocker les routes dans un graphe avec Dijkstra

Et si Walter ajoute une nouvelle ville demain ?
 Approche A : tu retries tout le tableau. Fragile.
 Approche B : tu ajoutes un noeud et ses arêtes. Le reste change pas.

Et si Walter a besoin du chemin le plus sûr ET du chemin le plus rapide ?
 Approche A : tu refactores tout.
 Approche B : tu ajoutes un paramètre de pondération. Le reste tient.

Décision : Approche B. Le surcoût de complexité initiale est justifié par la flexibilité.
```

---

## 4) LES PIÈGES DE LA COMPARAISON

**Le piège de la familiarité** : choisir l'approche qu'on connaît le mieux, pas la meilleure.

```
// T'as l'habitude des tableaux.
// Le problème demande un graphe.
// Tu codes quand même avec un tableau parce que c'est confortable.
// Résultat : 3 fois plus de code pour faire 3 fois moins bien.
```

**Le piège de la suroptimisation** : choisir l'approche la plus performante pour un problème qui s'en fout.

```
// Tu implémentes un Fenwick Tree pour trier 12 éléments.
// Un sort() aurait suffi.
// T'as perdu 4 heures pour gagner 0.001ms sur une opération qui tourne une fois par jour.
```

**Le piège du "ça marche"** : garder une approche juste parce qu'elle produit le bon résultat.

```
// L'approche A fonctionne.
// Mais elle fait 4 appels réseau là où l'Approche B en fait 1.
// En local : invisible. En prod avec 10k users : catastrophe.
```

---

## 5) DOCUMENTER SA DÉCISION

Une décision non documentée est une décision qui va être remise en question indéfiniment.

Le format minimal : trois lignes.

```
// DÉCISION : Approche B (graphe + Dijkstra) pour le système de routes
// RAISON  : les specs vont évoluer (nouvelles villes, nouveaux critères de pondération)
// TRADE-OFF : complexité initiale plus haute, mais coût de changement divisé par 3
```

Si la décision est importante : elle mérite un ADR (Architecture Decision Record).
Le module `27_team_craft` couvre les ADR en détail.

---

## 6) EXEMPLE COMPLET : SYSTÈME DE NOTIFICATIONS DU CONSEIL DE SURVEILLANCE

**Contexte** : dans `garo_no_kronika`, le Conseil reçoit des notifications de combat. Deux Chevaliers peuvent combattre simultanément.

```
Approche A : callbacks chaînés
// simple à comprendre au premier coup d'oeil
// devient illisible avec 3 combats simultanés
// gestion d'erreurs catastrophique : si un combat crash, les autres s'arrêtent

notifierCombat(chevalier1, (résultat1) => {
 notifierCombat(chevalier2, (résultat2) => {
  // bienvenue en callback hell
 })
})

// ---

Approche B : Promise.allSettled
// tous les combats en parallèle
// chaque résultat (succès ou échec) est traité indépendamment
// un combat qui crash n'affecte pas les autres

const résultats = await Promise.allSettled([
 notifierCombat(chevalier1),
 notifierCombat(chevalier2)
])
résultats.forEach(r => r.status === "fulfilled"
 ? logSuccès(r.value)
 : logEchec(r.reason)
)

// DÉCISION : Approche B
// RAISON  : indépendance des combats, gestion d'erreur propre par défaut
// TRADE-OFF : légèrement moins lisible pour quelqu'un qui découvre les Promises
```

---

## EXERCICES

## EXO 1 : Dijkstra vs Tableau pour Walter White

Walter doit trouver la route la plus sûre entre deux villes parmi un réseau de 8 villes.

Propose deux approches. Pour chaque approche : complexité, lisibilité, coût de changement.
Documente ta décision finale en 3 lignes.

*(indice : pense au "et si Walter ajoute une 9ème ville la semaine prochaine ?")*

---

## EXO 2 : Stockage des votes du Ballon d'Or

Les votes arrivent en temps réel. À la fin, on veut le top 10.

Approche A : stocker dans un tableau et trier à la fin.
Approche B : utiliser un heap de taille 10 mis à jour à chaque vote.

Compare sur : complexité O(), mémoire utilisée, lisibilité, coût de changement.
Quel contexte justifie A ? Quel contexte justifie B ?

---

## EXO 3 : Le dépiégeage d'un dev junior

Un dev junior de l'équipe de Rick a codé un système de gestion d'inventaire avec une approche qui "fonctionne". Tu lis le code et tu vois deux problèmes potentiels.

Voici le code :
```js
// rechercher un item dans l'inventaire de 5000 éléments
function trouverItem(inventaire, nom) {
 return inventaire.find(item => item.nom === nom)
}

// cette fonction est appelée 200 fois par seconde lors d'une attaque de zombies
```

Identifie le problème de performance. Propose une approche alternative. Documente la décision.

---

## RÉSUMÉ

Comparer avant de coder : c'est pas de la procrastination, c'est de la discipline. Tu regardes complexité, performance, couplage, et coût de changement. Tu utilises le "et si" pour voir comment chaque approche tient face aux évolutions probables. Tu documentes ta décision : trois lignes minimum. Pas pour toi. Pour le dev qui arrive dans 6 mois et se demande pourquoi t'as fait ce choix.
