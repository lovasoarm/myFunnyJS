---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# IMMUTABILITÉ : NE PAS MUTER, CRÉER
Temps de lecture ~9 min

Muter un objet c'est prendre un couteau et modifier directement ce qui existe.
Immutabilité c'est : tu prends l'original, tu crées une copie avec les changements, tu laisses l'original tranquille.

En prod, la mutation cachée est la cause numéro 1 des bugs qui "arrivent d'eux-mêmes". Tu modifies un objet à un endroit, un autre composant qui référence le même objet voit des données corrompues, et t'as aucune idée d'où ça vient.

> Le mécanisme de copie par référence (pourquoi deux variables peuvent pointer vers le même objet) est traité en profondeur dans `08_memory_performance/02_copy_vs_ref/01_shallow_vs_deep.md`.
> Ici on travaille l'immutabilité comme discipline de code. Là-bas on explique le moteur.

---

## 1) LE PROBLÈME DE LA RÉFÉRENCE PARTAGÉE

JS passe les objets et tableaux par référence. Pas par valeur.

```js
const statsNaruto = { chakra: 100, force: 85, vitesse: 70 };

// tu passes l'objet à une fonction
function augmenterForce(stats) {
 stats.force += 20; // mutation directe sur l'original
 return stats;
}

const statsApres = augmenterForce(statsNaruto);

console.log(statsNaruto.force); // 105:l'original est corrompu
console.log(statsApres === statsNaruto); // true:c'est le même objet
```

`statsNaruto` et `statsApres` pointent vers le même objet en mémoire. Y'a pas de copie. La mutation est globale.

```
[statsNaruto] ──────────────┐
               ▼
[statsApres] ──────────> { chakra: 100, force: 105, vitesse: 70 }
```

---

## 2) CRÉER PLUTÔT QUE MUTER : SPREAD OPERATOR

La solution la plus courante : spread.

```js
const statsNaruto = { chakra: 100, force: 85, vitesse: 70 };

function augmenterForce(stats, bonus) {
 return { ...stats, force: stats.force + bonus }; // nouvel objet, original intact
}

const statsApres = augmenterForce(statsNaruto, 20);

console.log(statsNaruto.force); // 85:intact
console.log(statsApres.force); // 105:nouvel objet
console.log(statsApres === statsNaruto); // false:deux objets distincts
```

Pour les tableaux :

```js
const classement = ["Messi", "Haaland", "Mbappé"]

// MUTATION:interdit en FP
classement.push("Bellingham")  // modifie l'original
classement.splice(1, 1)     // modifie l'original
classement.sort(...)       // modifie l'original

// IMMUTABLE:on crée un nouveau tableau
const avecBellingham = [...classement, "Bellingham"]
const sansMessi = classement.filter(j => j !== "Messi")
const triés = [...classement].sort() // sort sur une copie
```

---

## 3) SHALLOW COPY VS DEEP COPY

Spread ne copie qu'un niveau. Si l'objet est imbriqué, les références des sous-objets sont partagées.

```js
const joueur = {
 nom: "Goku",
 stats: { force: 9000, vitesse: 8500 }, // objet imbriqué
};

const copie = { ...joueur };

copie.nom = "Vegeta"; // ok, string = primitif, pas de partage
copie.stats.force = 1; // DANGER : modifie aussi joueur.stats.force

console.log(joueur.stats.force); // 1:corrompu
```

```
joueur     copie
 nom: "Goku"  nom: "Vegeta"
 stats ──────► stats ──────► { force: 1, vitesse: 8500 }
```

Pour les objets imbriqués, il faut soit spread à chaque niveau, soit `structuredClone` :

```js
// spread imbriqué : manuel mais précis
function mettreAJourForce(joueur, nouvelleForce) {
 return {
  ...joueur,
  stats: {
   ...joueur.stats,
   force: nouvelleForce,
  },
 };
}

// structuredClone : deep copy native (Node 17+, navigateurs modernes)
function mettreAJourForceDeep(joueur, nouvelleForce) {
 const copie = structuredClone(joueur);
 copie.stats.force = nouvelleForce;
 return copie;
}

// les deux sont valides:spread est plus lisible sur des objets peu profonds
```

---

## 4) `Object.freeze` : BLOQUER LA MUTATION EN DUR

`Object.freeze` rend un objet non modifiable à l'exécution.

```js
const config = Object.freeze({
 apiUrl: "https://foxriver.prison.com",
 timeout: 5000,
 maxRetries: 3,
});

config.timeout = 9999; // silencieux en mode normal, erreur en strict mode
console.log(config.timeout); // 5000:la mutation n'a pas eu lieu
```

Limite : `freeze` est shallow. Objets imbriqués restent mutables.

```js
const personnage = Object.freeze({
 nom: "Walter White",
 stats: { danger: 100 }, // pas freeze
});

personnage.nom = "Heisenberg"; // ignoré
personnage.stats.danger = 9000; // OK, stats n'est pas freezé

// deep freeze si t'en as vraiment besoin
function deepFreeze(obj) {
 Object.getOwnPropertyNames(obj).forEach((name) => {
  const val = obj[name];
  if (val && typeof val === "object") deepFreeze(val);
 });
 return Object.freeze(obj);
}
```

---

## 5) PATTERNS D'IMMUTABILITÉ SUR DES STRUCTURES COMPLEXES

Cas réel : mettre à jour un combattant dans une liste sans muter la liste.

```js
const chevaliers = [
 { id: "leon", armure: 100, actif: true },
 { id: "rei", armure: 80, actif: true },
 { id: "kouga", armure: 95, actif: true },
];

// MUTATION:interdit
function blesserChevalier(liste, id, degats) {
 const chevalier = liste.find((c) => c.id === id);
 chevalier.armure -= degats; // mutation de l'objet original
 return liste;
}

// IMMUTABLE:on crée une nouvelle liste avec le chevalier mis à jour
function blesserChevalier(liste, id, degats) {
 return liste.map(
  (c) =>
   c.id === id
    ? { ...c, armure: c.armure - degats } // nouvel objet pour le chevalier ciblé
    : c, // les autres sont réutilisés tels quels
 );
}

const apresAttaque = blesserChevalier(chevaliers, "leon", 30);

console.log(chevaliers[0].armure); // 100:intact
console.log(apresAttaque[0].armure); // 70:nouveau tableau, nouvel objet
```

---

## 6) LE CAS QUI CASSE : SORT ET LES MÉTHODES MUTANTES

Les méthodes JS qui mutent en place : `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`.

```js
function classerParButs(joueurs) {
 return joueurs.sort((a, b) => b.buts - a.buts); // mute l'original
}

const candidats = [
 { nom: "Messi", buts: 45 },
 { nom: "Mbappé", buts: 52 },
 { nom: "Haaland", buts: 60 },
];

const classés = classerParButs(candidats);
console.log(candidats[0].nom); // "Haaland":l'original est réordonné
```

Fix en une ligne :

```js
function classerParButs(joueurs) {
 return [...joueurs].sort((a, b) => b.buts - a.buts); // spread avant sort
}
```

---

## EXERCICES

## EXO 1 : l'inventaire de Rick

```js
const inventaire = {
 nourriture: 45,
 munitions: 120,
 medicaments: 8,
 survivants: [
  { nom: "Daryl", role: "chasseur" },
  { nom: "Michonne", role: "guerrière" },
 ],
};

// Ta mission : écrire 3 fonctions pures
// 1. consommerNourriture(inventaire, quantite) -> nouvel inventaire avec nourriture réduite
// 2. ajouterSurvivant(inventaire, survivant) -> nouvel inventaire avec le survivant ajouté
// 3. changerRole(inventaire, nom, nouveauRole) -> nouvel inventaire avec le rôle mis à jour

// Règle : inventaire original jamais modifié. Vérifie avec ===
```

---

## EXO 2 : le pipeline de match

Tu as des stats de match. Chaque transformation doit retourner un nouvel objet.

```js
const statsMatch = {
 club: "PSG",
 score: 0,
 possession: 50,
 tirs: [],
 joueurs: [],
};

// Écris ces fonctions en immutable :
// marquerBut(stats) -> score + 1
// ajouterTir(stats, tir) -> nouveau tir dans la liste
// mettreAJourPossession(stats, valeur) -> nouvelle possession
// reinitialiser(stats) -> retourne les stats à zéro (score 0, tirs [], possession 50)
```

---

## EXO 3 : freeze partiel

```js
const configAPI = Object.freeze({
 base: "https://api.ballondor.com",
 headers: {
  Authorization: "Bearer token_messi",
  "Content-Type": "application/json",
 },
 retries: 3,
});

// 1. Essaie de modifier configAPI.retries:que se passe-t-il ?
// 2. Essaie de modifier configAPI.headers.Authorization:que se passe-t-il ?
// 3. Explique pourquoi le comportement est différent
// 4. Implémente deepFreeze et applique-le à configAPI
```

---

## EXO 4 : le tournoi de Naruto

```js
const bracket = [
 {
  round: 1,
  combats: [
   { id: "c1", ninja1: "Naruto", ninja2: "Sasuke", gagnant: null },
   { id: "c2", ninja1: "Gaara", ninja2: "Rock Lee", gagnant: null },
  ],
 },
 { round: 2, combats: [] },
];

// Écris declareGagnant(bracket, combatId, gagnant)
// Elle doit retourner un nouveau bracket avec le gagnant mis à jour
// Le bracket original ne doit pas changer
// (Indice : c'est un objet imbriqué à deux niveaux)
```

---

## RÉSUMÉ

En JS, les objets et tableaux se passent par référence : deux variables peuvent pointer vers le même endroit en mémoire.
Muter directement = modifier ce que tout le monde partage : source de bugs invisibles.
La solution : créer, pas modifier. Spread pour les objets plats, spread imbriqué ou `structuredClone` pour les structures profondes.
`Object.freeze` bloque la mutation, mais seulement en surface.
Les méthodes `sort`, `reverse`, `splice` mutent en place : toujours travailler sur une copie.
