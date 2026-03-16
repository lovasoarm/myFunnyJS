# SCOPE ESCAPE ROOM : EXERCICES DE CLOSURE

Bienvenue dans la salle verrouillée du scope. La porte est fermée. Le code est la clé.

**Objectif :** comprendre réellement comment une **closure** fonctionne : c'est-à-dire une fonction qui garde en mémoire les variables de son environnement, même après que la fonction parente soit morte et enterrée.

Ici tu ne codes pas juste. Tu réfléchis :

- Qui garde quoi ?
- Quelle variable vit où ?
- Quelle variable disparaît… ou fait semblant ?

---

## NIVEAU 1 : LE COFFRE SECRET

1. Crée une fonction `createVault(secret)`
2. Stocke `secret` dans une variable locale
3. Retourne une fonction `guess(password)`
4. `guess(password)` doit :
   - comparer `password` avec `secret`
   - afficher `"Access granted"` ou `"Access denied"`
5. Crée **deux coffres différents** avec deux secrets différents
6. Teste-les

```javascript
// Résultat attendu :
const vault1 = createVault("dragon");
const vault2 = createVault("unicorn");

vault1("dragon"); // Access granted
vault1("unicorn"); // Access denied
vault2("unicorn"); // Access granted
```

> **Question :** Pourquoi chaque coffre garde son propre secret ? Où est stocké `secret` après la fin de `createVault` ? _(Indice : `createVault` est morte, mais `secret` survit dans la closure : comme un fantôme utile.)_

---

## NIVEAU 2 : LE PIÈGE DU COMPTEUR

1. Crée une fonction `createLimitedCounter(limit)`
2. À l'intérieur, crée une variable `count = 0`
3. Retourne une fonction qui :
   - incrémente `count`
   - si `count` dépasse `limit` → affiche `"Limit reached"`
   - sinon → affiche la valeur actuelle
4. Crée **deux compteurs avec deux limites différentes**
5. Observe leur comportement indépendant

```javascript
// Résultat attendu :
const counter1 = createLimitedCounter(2);
const counter2 = createLimitedCounter(4);

counter1(); // 1
counter1(); // 2
counter1(); // Limit reached
counter2(); // 1  ← pas de contamination entre les deux
```

> **Question :** Pourquoi les deux compteurs ne partagent **pas** la même variable `count` ? _(Chaque appel à `createLimitedCounter` crée son propre univers parallèle en mémoire.)_

---

## NIVEAU 3 : LA BOUCLE MAUDITE

Lis ce code. Ne le lance pas encore. **Réfléchis d'abord.**

```javascript
for (var i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log("Door number:", i);
  }, 100);
}
```

> **Question :** Pourquoi toutes les portes affichent-elles le même numéro ? _(Indice : `var` n'est pas block-scoped -> toutes les fonctions partagent la même variable `i`. Quand les `setTimeout` s'exécutent, la boucle est déjà terminée et `i` vaut `4`. Toutes les portes s'ouvrent sur la même pièce vide.)_

**Maintenant refais exactement la même chose avec `let` :**

```javascript
for (let i = 1; i <= 3; i++) {
  setTimeout(function () {
    console.log("Door number:", i); // 1, 2, 3
  }, 100);
}
```

> **Question :** Qu'est-ce qui change en mémoire ? `let` est block-scoped : à chaque itération, une **nouvelle variable `i`** est créée. Chaque `setTimeout` capture sa propre copie — chaque porte a enfin son propre numéro.

---

## MISSION FINALE

Explique avec **tes propres mots**, sans copier-coller, sans regarder tes notes :

- C'est quoi une **closure** ?
- C'est quoi le **function scope** (portée fonction) ?
- C'est quoi le **block scope** (portée bloc) ?
- Pourquoi `var` pose problème dans les boucles **async** (code exécuté plus tard) ?

> Ne passe pas au chapitre suivant si tu ne peux pas répondre à ces quatre questions. Le scope, c'est la base de tout. Rater ça, c'est construire une maison sur du sable... qui est aussi en feu.
