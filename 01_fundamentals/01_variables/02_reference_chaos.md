---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# LE CHAOS DES RÉFÉRENCES
Temps de lecture ~5 min

> T'as compris la théorie. Maintenant on va voir pourquoi ça explose en prod.

---

## 1. Ce qui se passe vraiment en mémoire

Quand tu fais :

```js
let arr1 = [1, 2, 3];
let arr2 = arr1;
```

JS ne duplique pas le tableau. Il copie **l'adresse mémoire**.

```
arr1 --+
    |--> [ 1, 2, 3 ] (en mémoire, un seul objet)
arr2 --+
```

Donc :

```js
arr2.push(4);
console.log(arr1); // [1, 2, 3, 4] --> arr1 aussi
```

Même adresse = même tableau = même chaos.

---

## 2. Le piège du "backup"

```js
let team = [{ name: "Zombie1", hp: 100 }];
let backupTeam = team; // pas une copie : même adresse

backupTeam[0].hp += 50;
console.log(team[0].hp); // 150 -> ton "backup" a modifié l'original
```

`backupTeam` n'est pas un backup. C'est un **alias**.

---

## 3. Comment copier vraiment : Shallow Copy

Pour créer un **nouveau** tableau ou objet :

```js
let newArr = [...arr1]; // spread operator
let newObj = { ...obj1 }; // idem pour les objets
```

Maintenant `newArr` et `arr1` sont deux tableaux distincts.

```
arr1  --> [ 1, 2, 3 ] (original)
newArr --> [ 1, 2, 3 ] (copie : adresse différente)
```

**Mais attention** : c'est une copie **superficielle**. Si le tableau contient des objets, leurs références internes restent partagées. On appelle ça le **shallow copy**. Le niveau suivant ? `03_mutation_madness.md`.

---

## MISSION : Team Crazy Zombies

### Objectif

Voir concrètement que deux variables peuvent pointer sur le même tableau.

### Instructions

1. Crée un tableau `team` avec 3 zombies `{ name, hp }`.
2. Crée `backupTeam` qui pointe sur **le même tableau** (pas de copie).
3. Le boss booste le `hp` du premier zombie via `backupTeam` de **+50**.
4. Un virus met le `hp` du deuxième zombie via `team` à **0**.
5. Affiche `team` et `backupTeam`.

### Code de départ

```js
let team = [
 { name: "Zombie1", hp: 100 },
 { name: "Zombie2", hp: 100 },
 { name: "Zombie3", hp: 100 },
];
// Ton code ici
```

### Résultat attendu

```
team[0].hp   --> 150  // boosté via backupTeam
team[1].hp   --> 0   // détruit via team
backupTeam[0].hp --> 150 // même référence : même résultat
backupTeam[1].hp --> 0  // idem

team === backupTeam --> true
```

> `backupTeam` et `team` sont le **même tableau**. Le backup n'en est pas un.

---

## RÉSUMÉ

Deux variables qui pointent vers le même objet, c'est un seul objet avec deux noms. Modifier l'un modifie l'autre. Un spread ou un `slice()` copie la surface, pas les objets imbriqués.

La règle à graver : en JS, les objets et les tableaux ne se copient jamais par valeur. Ils se partagent. Si tu veux une vraie copie, tu dois la créer explicitement.
