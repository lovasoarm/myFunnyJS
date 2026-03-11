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

## 3. Conseils d'ingénieur

- Savoir **quand cloner** : shallow copy (`[...arr]`, `{...obj}`) vs deep copy (`structuredClone`, `JSON.parse/stringify`)
- Toujours vérifier si tu travailles sur la **vraie référence** ou sur une **copie**
- Visualise mentalement : **la variable = la clé**, **l'objet = la maison**

---

## Exercice — Team Crazy Zombies

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
