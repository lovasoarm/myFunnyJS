---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# ARRAY BASICS : CE QUE CHAQUE OPÉRATION COÛTE VRAIMENT
Temps de lecture ~8 min

Un tableau JS, t'en utilises tous les jours. Mais est-ce que tu sais ce qui se passe en mémoire quand tu fais `splice(0, 1)` ? Ou pourquoi accéder à `arr[999]` est aussi rapide qu'accéder à `arr[0]` ?

Un tableau c'est un bloc continu en mémoire. Chaque index pointe vers un emplacement. C'est pour ça que lire un élément est instantané : O(1). Mais insérer au milieu ? C'est une tout autre histoire.

On apprend pas juste les méthodes. On apprend ce qu'elles coûtent.

---

## 1) LA MÉMOIRE DERRIÈRE LE TABLEAU

Un tableau c'est une séquence d'emplacements contigus en mémoire. L'index, c'est juste un offset depuis le début.

```
index :  0    1    2    3
      ┌───────┬───────┬───────┬───────┐
valeur :  │"Naruto"│"Sasuke"│"Sakura"│"Kakashi"│
      └───────┴───────┴───────┴───────┘
adresse : 0x100  0x108  0x110  0x118
```

Accéder à `arr[2]` = aller directement à `adresse_base + (2 * taille_slot)`.
Pas de recherche. Pas de boucle. Juste un calcul.

```js
const crew = ["Naruto", "Sasuke", "Sakura", "Kakashi"];

// O(1) : accès direct, peu importe la taille du tableau
console.log(crew[0]); // "Naruto"
console.log(crew[3]); // "Kakashi"
```

---

## 2) INDEXING, SLICING, SPREADING : LES COÛTS

### Indexing : O(1)

```js
const scores = [88, 95, 72, 61, 99];

// lire un élément : instantané
const best = scores[4]; // 99

// modifier un élément : aussi instantané
scores[2] = 80; // on écrase directement la case mémoire
```

### Slicing : O(k) où k = taille du slice

`slice` ne modifie pas le tableau original : il crée une **copie** de la portion.

```js
const squad = ["Naruto", "Sakura", "Sasuke", "Kakashi", "Tsunade", "Hokage"];

// copie des éléments 1 à 3 (sans inclure 4)
const recon = squad.slice(1, 4);
// recon = ["Sakura", "Sasuke", "Kakashi"]
// squad est intact

// O(k) : proportionnel au nombre d'éléments copiés
```

### Spreading : O(n)

Le spread `[...arr]` crée une shallow copy complète. Tout le tableau est parcouru.

```js
const original = ["Gai", "Jiraiya", "Tsunade"];

// shallow copy : O(n), recopie chaque référence
const copy = [...original];

copy.push("Orochimaru");
// original n'est pas touché : ["Gai", "Jiraiya", "Tsunade"]
// copy : ["Gai", "Jiraiya", "Tsunade", "Orochimaru"]
```

---

## 3) INSERTION ET SUPPRESSION : L'ENDROIT COMPTE TOUT

C'est là que ça devient intéressant. Insérer à la fin coûte presque rien. Insérer au début coûte cher.

```
Avant :  [ A | B | C | D ]
            ↑
          push("E")
Après :  [ A | B | C | D | E ]  // O(1) : on ajoute juste à la fin
```

```
Avant :  [ A | B | C | D ]
     ↑
    unshift("Z")
Après :  [ Z | A | B | C | D ]
     // O(n) : tout le monde décale d'une case vers la droite
```

```js
const jugadores = ["Messi", "Neymar", "Mbappé"];

// fin du tableau : O(1) amortized
jugadores.push("Benzema");
// ["Messi", "Neymar", "Mbappé", "Benzema"]

// début du tableau : O(n):tout décale
jugadores.unshift("Ronaldo");
// ["Ronaldo", "Messi", "Neymar", "Mbappé", "Benzema"]

// milieu du tableau : O(n):splice recale tout ce qui suit
jugadores.splice(2, 0, "De Bruyne");
// ["Ronaldo", "Messi", "De Bruyne", "Neymar", "Mbappé", "Benzema"]
```

### Le tableau des coûts

```
Opération      Position   Coût
─────────────────────────────────────────
Lecture / Écriture  n'importe  O(1)
push / pop      fin     O(1) *
unshift / shift   début    O(n)
splice insert    milieu    O(n)
splice delete    milieu    O(n)
indexOf / find    partout   O(n)
slice        n'importe  O(k)

* O(1) amorti : JS agrandit le tableau par blocs, pas case par case
```

---

## 4) LE PIÈGE : TABLEAU ÉPARS (SPARSE ARRAY)

JS te laisse faire ça. Il devrait pas.

```js
const sparse = [];
sparse[100] = "Walter White";

console.log(sparse.length); // 101
console.log(sparse[0]); // undefined

// Le tableau a 101 cases. 100 sont vides.
// forEach, map, filter : ces cases vides sont IGNORÉES
// mais elles occupent de la mémoire

sparse.forEach((x) => console.log(x)); // affiche seulement "Walter White"
```

Un tableau épars c'est un bug qui dort. Ne jamais assigner par index sur un tableau vide.

---

## 5) RECHERCHE DANS UN TABLEAU NON TRIÉ : O(n)

Pas de magie. Si le tableau n'est pas trié, la seule option c'est de regarder chaque élément.

```js
const tracks = ["Codeine Dreaming", "Location", "Frozen", "2 Cups"];

// indexOf : cherche depuis le début, O(n) dans le pire cas
const idx = tracks.indexOf("Frozen"); // 2

// find : pareil, mais avec une condition plus riche
const trap = tracks.find((t) => t.includes("Cup")); // "2 Cups"

// includes : O(n), retourne un booléen
const exists = tracks.includes("Location"); // true
```

Si tu fais ça sur 100k éléments en boucle, c'est O(n²). C'est là que ça tombe.

---

## EXERCICES

## EXO 1 : Roster de l'équipe nationale
_~10 min_


Tu as un tableau de 22 joueurs (formation 4-4-2). Extrais les 11 titulaires sans modifier le tableau d'origine. Puis crée une copie du squad avec un remplaçant en moins à l'index 15. Vérifie que l'original est intact.

Contrainte : utilise `slice` et le spread. Pas de `splice` sur l'original.

## EXO 2 : Le camp de Rick Grimes
_~8 min_


Le camp a une liste de survivants. Un zombie attaque depuis la gauche (index 0). Un nouveau survivant arrive toujours à la fin. Mesure avec `performance.now()` la différence entre 10 000 `unshift` et 10 000 `push` sur un tableau de 1000 éléments. Explique le résultat en une phrase.

(indice : regarde le tableau des coûts ci-dessus : la réponse y est)

## EXO 3 : Le tableau qui ment
_~12 min_


Ce code a un bug silencieux. Trouve-le avant de l'exécuter, explique ce qui se passe, et corrige-le.

```js
function buildDropTable(size) {
 const drops = [];
 drops[size - 1] = "Legendary Sword";
 drops[0] = "Common Stone";
 return drops;
}

const loot = buildDropTable(5);
const rareItems = loot.filter((item) => item !== undefined);
console.log(rareItems.length); // qu'est-ce qui s'affiche ?
```

---

## RÉSUMÉ

Un tableau JS c'est un bloc mémoire continu : lire par index est O(1) car c'est juste un calcul d'adresse. Tout ce qui déplace des éléments (unshift, splice en milieu) coûte O(n) parce que JS doit recaler tout ce qui suit. Slice crée une copie : c'est intentionnel, utilise-le comme tel. Les tableaux épars sont un piège : JS les autorise mais les méthodes comme `forEach` les ignorent silencieusement. Connaître ces coûts c'est la différence entre un code qui scale et un code qui rame à 10k éléments.
