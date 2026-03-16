# Variables & Références

> Bienvenue dans le monde où JS ne t'apprend pas juste à coder, mais à comprendre la vie secrète des variables.

---

## 1. Variable = Référence ?

**Primitives** : `number`, `string`, `boolean`
- Tu copies la **valeur directement**.
- Chaque variable vit de façon **indépendante** : modifier l'une ne touche pas l'autre.

**Objets** : `array`, `object`, `function`
- Tu ne copies pas la maison, tu copies **la clé**.
- Deux variables peuvent pointer sur la **même maison** : si tu modifies l'intérieur via l'une, l'autre le voit aussi.

---

## 2. Pourquoi c'est un piège classique ?

Tu modifies un objet en croyant ne pas toucher l'autre variable : **chaos invisible**.

Cas fréquents :
- Tableaux partagés entre deux scopes
- Objets de configuration mutés par accident
- Backup mal géré qui pointe toujours sur l'original

---

## 3. Conseils

- Savoir **quand cloner** : shallow copy (`[...arr]`, `{...obj}`) vs deep copy (`structuredClone`, `JSON.parse/stringify`)
- Toujours vérifier si tu travailles sur la **vraie référence** ou sur une **copie**
- Visualise mentalement : **la variable = la clé**, **l'objet = la maison**

---

## Exercice : Team Crazy Zombies

### Objectif

Observer concrètement le comportement des références en JavaScript.

### Instructions

1. Crée un tableau `team` contenant **3 zombies**. Chaque zombie est un objet `{ name, hp }`.
2. Crée une variable `backupTeam` qui **pointe sur le même tableau** (pas de copie).
3. Le boss zombie **augmente le `hp` du premier zombie** de `backupTeam` de **+50**.
4. Un virus **met le `hp` du deuxième zombie** de `team` à **0**.
5. Affiche `team` et `backupTeam` — observe le chaos des références.

### Code de départ

```js
let team = [
  { name: "Zombie1", hp: 100 },
  { name: "Zombie2", hp: 100 },
  { name: "Zombie3", hp: 100 },
];
```

### Ce que tu vas découvrir

`backupTeam` et `team` sont la **même référence** : chaque modification via l'une se reflète dans l'autre. Le "backup" n'en est pas un.

---

## Résumé

| Type | Comportement | Exemple |
|------|-------------|---------|
| Primitif | Copie de valeur | `let b = a` → indépendants |
| Objet / Array | Copie de référence | `let b = a` → liés |
| Shallow copy | Nouveau conteneur, mêmes enfants | `[...arr]` |
| Deep copy | Tout est dupliqué | `structuredClone(obj)` |

---

## Référence vs Shallow vs Deep Copy



### `let backupTeam = team` : référence directe

```
team       ──┐
              ├──▶  [ {Z1,hp:100}, {Z2,hp:100}, {Z3,hp:100} ]
backupTeam ──┘
```

`backupTeam[0].hp += 50` → **les deux voient hp:150**. Ce n'est pas une copie, c'est un alias.



### `[...team]` : shallow copy

```
team       ──▶  [ ·──▶{Z1,hp:100}, ·──▶{Z2,hp:100}, ·──▶{Z3,hp:100} ]
                       ↑                ↑                ↑
backupTeam ──▶  [ ·───┘            ·───┘            ·───┘ ]
```

`team.push(Z4)` → backupTeam reste à 3 éléments ✓  
`team[0].hp = 0` → backupTeam[0].hp vaut aussi 0 ✗  
Le tableau est neuf. Les objets dedans sont partagés.

Mais attention: push/pop/splice ajoute un slot dans tab, autretab ne bouge pas.
ex: avec push: 
```
let autretab = [1, 2, 3];
let tab = [...autretab];

tab.push(4);

console.log(tab);      // [1, 2, 3, 4]
console.log(autretab); // [1, 2, 3]  ← intact
```


### `structuredClone(team)` : deep copy

```
team       ──▶  [ {Z1,hp:100}, {Z2,hp:100}, {Z3,hp:100} ]

backupTeam ──▶  [ {Z1,hp:100}, {Z2,hp:100}, {Z3,hp:100} ]
```

Tout est dupliqué. Modifier l'un ne touche pas l'autre. ✓

---

### Récap

```
=               →  même adresse       tableau partagé   objets partagés
[...arr]        →  nouvelle adresse   tableau isolé     objets partagés
structuredClone →  nouvelle adresse   tableau isolé     objets isolés
```

> **Piège :** `JSON.parse(JSON.stringify(x))` fait aussi une deep copy,
> mais détruit les `Date`, `Set`, `Map` et `undefined` en silence.
> Préfère `structuredClone`.

---

### Shallow / Deep Copy selon certains les langages

| Langage | Objets par défaut | Deep copy | Particularité |
|---|---|---|---|
| JavaScript | référence | `structuredClone()` | shallow avec `[...arr]` / `{...obj}` |
| Python | référence | `copy.deepcopy()` | shallow avec `list.copy()` ou `[:]` |
| Java | référence | manuel ou lib | primitives copiées, objets non |
| C# | référence | `Clone()` ou sérialisation | structs copiés par valeur |
| Go | valeur (structs) | natif pour structs | slices et maps restent par référence |
| Rust | valeur si `Copy` | natif si `Clone` | le compilateur interdit le double accès mutable |
| C/C++ | explicite (pointeurs) | `memcpy` ou manuel | tu choisis toi-même à chaque fois |
