---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# FONCTIONS PURES : MÊME INPUT, MÊME OUTPUT, TOUJOURS
Temps de lecture ~8 min

Une fonction pure c'est un contrat : tu donnes les mêmes arguments, tu obtiens le même résultat.
Toujours. Sans exception. Sans surprise.
C'est le fondement du FP : sans ça, rien de ce qui suit ne tient.

En prod, 80% des bugs viennent de fonctions qui mutent l'état global ou qui dépendent de quelque chose en dehors de leur scope. Une fonction pure ne peut pas faire ça par définition.

---

## 1) CE QU'EST UNE FONCTION PURE

Deux règles. Deux seulement.

**Règle 1 : Déterminisme** : le même input produit toujours le même output.
**Règle 2 : Sans effets de bord** : la fonction ne touche rien en dehors d'elle-même.

```js
// PURE : déterministe, zéro effet de bord
function calculerDegats(force, defense) {
 return Math.max(0, force - defense);
}

// appelle-la 1000 fois avec les mêmes args : tu obtiens 1000 fois le même résultat
calculerDegats(80, 30); // 50, toujours 50
calculerDegats(80, 30); // 50
calculerDegats(80, 30); // 50
```

```js
// IMPURE : dépend de quelque chose externe
let bonusMondial = 10;

function calculerDegatsImpure(force, defense) {
 return Math.max(0, force - defense + bonusMondial); // bonusMondial peut changer
}

bonusMondial = 50;
calculerDegatsImpure(80, 30); // 100 maintenant:même args, résultat différent
```

---

## 2) LES EFFETS DE BORD : CE QU'UNE FONCTION PURE NE FAIT JAMAIS

Un effet de bord c'est n'importe quelle action qui touche le monde en dehors de la fonction.

```js
const joueurs = ["Messi", "Neymar", "Mbappé"];

// EFFET DE BORD : mutation du tableau original
function ajouterJoueurImpure(liste, joueur) {
 liste.push(joueur); // on modifie le tableau qui existe dehors
 return liste;
}

ajouterJoueurImpure(joueurs, "Haaland");
console.log(joueurs); // ["Messi", "Neymar", "Mbappé", "Haaland"]:surprise

// PURE : on crée un nouveau tableau, on ne touche pas l'original
function ajouterJoueurPure(liste, joueur) {
 return [...liste, joueur]; // nouveau tableau, original intact
}

const nouveauxJoueurs = ajouterJoueurPure(joueurs, "Haaland");
console.log(joueurs); // ["Messi", "Neymar", "Mbappé"]:intact
console.log(nouveauxJoueurs); // ["Messi", "Neymar", "Mbappé", "Haaland"]
```

Autres effets de bord courants à éviter dans une fonction pure :

- écrire dans une DB ou un fichier
- faire un appel réseau
- modifier une variable globale
- lire `Date.now()` ou `Math.random()` sans les injecter

---

## 3) POURQUOI C'EST PUISSANT EN PROD

Une fonction pure est :

- **testable** : t'as besoin de zéro mock, zéro setup
- **prévisible** : le bug est dans la fonction ou dans l'argument, pas ailleurs
- **composable** : tu peux la combiner avec n'importe quelle autre (→ voir `03_composition.md`)
- **mémoizable** : même input = même output donc tu peux cacher le résultat

```js
// tester une fonction pure : trivial
test("calculerDegats retourne 50", () => {
 expect(calculerDegats(80, 30)).toBe(50);
});

// tester une fonction impure : galère
test("calculerDegatsImpure retourne 50", () => {
 bonusMondial = 0; // faut reset le state global avant chaque test
 expect(calculerDegatsImpure(80, 30)).toBe(50);
});
// et si quelqu'un oublie le reset ? le test passe ou rate selon l'ordre d'exécution
```

---

## 4) LE CAS QUI CASSE

`Math.random()` et `Date.now()` : les deux ennemis silencieux des fonctions pures.

```js
// IMPURE : résultat différent à chaque appel
function genererCritique(degatsBase) {
 const multiplicateur = Math.random() > 0.7 ? 2 : 1; // non déterministe
 return degatsBase * multiplicateur;
}

// PURE : on injecte le random en paramètre
function genererCritique(degatsBase, facteurAleatoire) {
 const multiplicateur = facteurAleatoire > 0.7 ? 2 : 1;
 return degatsBase * multiplicateur;
}

// l'appelant contrôle le random
genererCritique(50, Math.random());

// en test : tu passes un facteur fixe, résultat prévisible
genererCritique(50, 0.9); // toujours 100
genererCritique(50, 0.5); // toujours 50
```

C'est ça l'injection de dépendance en version FP : repousser l'impureté vers les bords du système, pas la cacher au milieu.

---

## 5) IDENTIFIER UNE FONCTION IMPURE

Checklist rapide. Si ta fonction fait au moins un de ces trucs : elle est impure.

```
lit ou modifie une variable hors de son scope
appelle Math.random() ou Date.now() directement
fait un console.log, une écriture fichier, un fetch
modifie un paramètre objet ou tableau
dépend de this                    (souvent)
```

Ça ne veut pas dire qu'il faut éliminer toutes les fonctions impures. Ça veut dire les isoler : les garder aux extrémités du système, pas au coeur de la logique.

```
[données brutes]
   |
   v
[transformations pures] <-- tout le calcul métier ici
   |
   v
[effets de bord] <-- écriture DB, API call, log : ici seulement
```

---

## EXERCICES

## EXO 1 : le rapport du Ballon d'Or

Tu as cette fonction qui calcule un score de candidature Ballon d'Or :

```js
let saison = 2024;
let bonus = { championsLeague: 30, nombreButs: 0.5 };

function scoreBallonDor(joueur) {
 const scoreBase = joueur.buts * bonus.nombreButs + joueur.passes * 0.3;
 const titreBonus = joueur.aCL ? bonus.championsLeague : 0;
 return scoreBase + titreBonus + (saison - 2020) * 2;
}
```

Identifie tous les problèmes. Réécris-la en fonction pure. Les données externes passent en paramètre.

---

## EXO 2 : le scouting de Rick Grimes

Rick a une liste de survivants. Cette fonction est censée filtrer les combattants :

```js
const survivants = [
 { nom: "Daryl", force: 85, estCombattant: false },
 { nom: "Michonne", force: 92, estCombattant: false },
 { nom: "Carl", force: 40, estCombattant: false },
];

function recruterCombattants(liste) {
 for (let i = 0; i < liste.length; i++) {
  if (liste[i].force >= 70) {
   liste[i].estCombattant = true; // mutation directe
  }
 }
 return liste;
}
```

Réécris-la en pure. L'original `survivants` ne doit pas être modifié.

---

## EXO 3 : le titre trompeur

Ces deux fonctions semblent pures. L'une ne l'est pas vraiment. Trouve laquelle et explique pourquoi.

```js
function calculerXG(tirs) {
 return tirs.reduce((total, tir) => total + tir.probabilite, 0);
}

function trierJoueursParButs(joueurs) {
 return joueurs.sort((a, b) => b.buts - a.buts);
}
```

(Indice : regarde ce que fait `sort` sur le tableau original.)

---

## EXO 4 : l'injection de dépendance

Walter White génère des lots de jutsu. La quantité varie selon un facteur aléatoire :

```js
function genererLot(recette) {
 const facteur = Math.random() * 0.3 + 0.85; // entre 0.85 et 1.15
 return {
  jutsu: recette.nom,
  quantite: Math.round(recette.quantiteBase * facteur),
  timestamp: Date.now(),
 };
}
```

Transforme-la pour qu'elle soit pure. `facteur` et `timestamp` arrivent en paramètre. Écris aussi l'appel correct depuis l'extérieur.

---

## RÉSUMÉ

Une fonction pure : même input = même output, zéro effet de bord.
C'est pas une contrainte stylistique : c'est ce qui rend le code testable, prévisible, et composable.
L'impureté n'est pas interdite, elle est isolée : aux extrémités du système, jamais dans la logique métier.
Injecter les dépendances non déterministes (random, date, réseau) en paramètre : c'est repousser le chaos là où il peut être contrôlé.
