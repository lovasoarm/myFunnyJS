---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# FUNCTION FACTORY : USINE À FONCTIONS
Temps de lecture ~5 min

On va créer des fonctions **qui fabriquent d'autres fonctions**. C'est comme une usine à clones : mais version JS, sans les implications éthiques.

---

## 1) QU'EST-CE QU'UNE FUNCTION FACTORY ?

Une function factory est une **fonction qui retourne une autre fonction**. Elle permet de créer plein de fonctions similaires sans réécrire le même code à la main.

```javascript
function makePlayer(name, hp) {
 return function attack() {
  console.log(`${name} attaque avec ${hp} hp!`);
 };
}

let bobyAttack = makePlayer("Boby", 100);
let elonAttack = makePlayer("Elon", 200);

bobyAttack(); // Boby attaque avec 100 hp!
elonAttack(); // Elon attaque avec 200 hp!
```

Chaque appel à `makePlayer` crée une **nouvelle fonction indépendante**, avec ses propres valeurs de `name` et `hp` verrouillées dedans.

---

## 2) POURQUOI C'EST PUISSANT ?

- Chaque fonction garde **sa propre mémoire** grâce à la closure
- Tu fabriques des fonctions **sur mesure** sans copier-coller
- Ton scope global reste propre : pas de dizaines de fonctions redondantes qui traînent
- Pattern utilisé partout : factories, builders, event listeners, middleware...

> C'est la différence entre faire 10 sandwichs à la main et avoir une machine qui les fait pour toi : à la demande, avec les ingrédients que tu choisis.

---

## 3) TERMES TECHNIQUES

**Closure** : une fonction qui se souvient des variables de son environnement parent, même après que celui-ci ait terminé son exécution.

**Factory** : une fonction qui produit d'autres fonctions (ou objets) à la demande, selon les paramètres qu'on lui passe.

```
makePlayer("Boby", 100) → nouvelle fonction avec "Boby" et 100 verrouillés
makePlayer("Elon", 200) → nouvelle fonction avec "Elon" et 200 verrouillés
```

Ces deux fonctions **ne se connaissent pas**. Modifier l'une ne touche pas l'autre.

---

## MISSION FACTORY

## La Team Factory

1. Crée une fonction `makeWeapon(name, damage)` qui retourne une fonction `useWeapon()` affichant :
  ```
  "NomDeLArme attaque avec X points de dégâts"
  ```
2. Crée 2 armes avec `makeWeapon` et teste leurs attaques

3. Fais tourner l'usine : crée un tableau de données d'armes et utilise `map` pour générer un tableau de fonctions

  ```javascript
  let weaponData = [
   { name: "Épée", damage: 50 },
   { name: "Arc", damage: 30 },
   { name: "Hache", damage: 70 },
  ];

  // Utilise map pour créer un tableau de fonctions useWeapon
  ```

4. Teste toutes les armes en boucle et observe comment chaque fonction garde son propre `name` et `damage`

```javascript
// Ton code ici
```

> Chaque fonction créée est un **clone indépendant**. Même mémoire parente, univers séparés. La factory a fait son travail : maintenant les clones vivent leur vie.

---

## RÉSUMÉ

Une factory (usine) est une fonction qui retourne une autre fonction. Chaque appel à la factory crée une closure indépendante : son propre environnement mémoire, ses propres valeurs capturées.

C'est la base des currying, des middlewares, des configurations dynamiques. Une factory + une closure = un comportement paramétrable sans objet ni classe.

Si tu veux des fonctions avec des comportements différents basés sur le même template : utilise une factory.
