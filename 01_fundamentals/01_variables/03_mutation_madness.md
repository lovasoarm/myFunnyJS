# MUTATION MADNESS — SHALLOW VS DEEP COPY

Bienvenue dans le chaos ultime.

Quand tu fais :

```javascript
let monsters = [
  { name: "Goblin", hp: 100, attack: { dmg: 20, type: "slash" } },
  { name: "Orc", hp: 150, attack: { dmg: 30, type: "smash" } },
];

let shallowMonsters = [...monsters];
```

Tu as copié le tableau, mais **pas les objets à l'intérieur**.

Donc :

```javascript
shallowMonsters[0].attack.dmg += 10;
```

Va **aussi** modifier `monsters[0].attack.dmg`.

---

## MÉMOIRE SIMPLIFIÉE

```
Variable → tableau → objets → objets imbriqués
```

| Type         | Tableau | Objets internes | Objets imbriqués |
| ------------ | ------- | --------------- | ---------------- |
| Shallow copy | nouveau | partagés        | partagés         |
| Deep copy    | nouveau | nouveaux        | nouveaux         |

Si tu ne comprends pas ça, tu vas créer des **bugs invisibles**.

---

## COMMENT FAIRE UNE VRAIE COPIE ?

**Shallow** — copie le tableau uniquement :

```javascript
let shallowMonsters = [...monsters];
```

**Deep manuelle** — copie les objets imbriqués :

```javascript
let deepMonsters = monsters.map((monster) => ({
  ...monster,
  attack: { ...monster.attack },
}));
```

**Deep native** — pour des structures très imbriquées :

```javascript
let deepMonsters = structuredClone(monsters);
```

> `structuredClone` est la méthode moderne recommandée. Elle gère tous les niveaux d'imbrication sans code supplémentaire.

---

## POURQUOI C'EST CRUCIAL ?

- **React / Vue** — le state doit rester immuable
- **Backend** — éviter de modifier un objet partagé par erreur
- **Architecture** — sécurité mémoire
- **Performance** — éviter des mutations surprises

---

# MISSION MUTATION MADNESS

## La Team Chaotique

1. Crée un tableau `monsters` avec 3 monstres :
   ```javascript
   { name, hp, attack: { dmg, type } }
   ```
2. Crée une copie `shallowMonsters` avec le spread operator `[...]`
3. Modifie `dmg` du premier monstre via `shallowMonsters`
4. Affiche `monsters` et `shallowMonsters`
   → Observe le chaos : **les deux tableaux ont changé**

Ensuite :

5. Crée une vraie copie `deepMonsters` avec `map` + spread
6. Modifie `dmg` du deuxième monstre via `deepMonsters`
7. Affiche `monsters` et `deepMonsters`
   → Observe que `monsters` **reste intact**

```javascript
let monsters = [
  { name: "Goblin", hp: 100, attack: { dmg: 20, type: "slash" } },
  { name: "Orc", hp: 150, attack: { dmg: 30, type: "smash" } },
  { name: "Troll", hp: 200, attack: { dmg: 40, type: "crush" } },
];

// Ton code ici
```

> Comprends. Ne regarde pas juste le résultat. Réfléchis à la mémoire.
