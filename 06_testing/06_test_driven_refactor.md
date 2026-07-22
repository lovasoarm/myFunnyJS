---
stability: intemporel
---

# TEST-DRIVEN REFACTOR : CHANGER TOUT SANS RIEN CASSER
Temps de lecture ~9 min

Refactorer du code sans tests : c'est désamorcer une bombe les yeux bandés.
Tu changes quelque chose. Tu espères que rien d'autre ne casse. Tu vérifies à la main. Tu oublies la moitié des cas.

Refactorer avec des tests : les tests sont ton GPS. Tu refactorises, tu lances, tu vois immédiatement ce que tu as cassé.

---

## 1) LE PRINCIPE : LES TESTS BOUGENT PAS

Quand tu refactorises, une règle absolue : **les tests ne changent pas**.
Si les tests passent avant et après le refacto : t'as gardé le comportement externe. L'implémentation peut changer totalement.

```
Avant refacto :
  vote valide accepté
  double vote rejeté
  joueur vide rejeté
 --> tu refactorises l'implémentation interne

Après refacto :
  vote valide accepté     (toujours)
  double vote rejeté     (toujours)
  joueur vide rejeté     (toujours)
 --> comportement préservé
```

Si un test change pendant un refacto, deux cas : soit le test était mal écrit, soit tu as changé un comportement sans t'en rendre compte. Dans les deux cas : stop et analyse.

---

## 2) ÉCRIRE LES TESTS SUR DU CODE EXISTANT SANS TESTS

La situation classique : tu hérites d'un module spaghetti. Zéro test. Tu dois le refactoriser.

Étape 1 : comprendre le comportement existant (sans le changer)
Étape 2 : écrire les tests qui documentent ce comportement
Étape 3 : refactoriser

```js
// gestionCamp.js:version spaghetti Walking Dead
// Rick a codé ça en pleine attaque zombie. Ça tourne. Personne n'ose y toucher.

function traiterRation(inventaire, personnages) {
 let total = 0;
 for (let i = 0; i < personnages.length; i++) {
  if (personnages[i].statut !== "mort") {
   total += personnages[i].faim > 7 ? 2 : 1;
  }
 }
 if (total > inventaire.rations) {
  inventaire.alerte = true;
  return { ok: false, manque: total - inventaire.rations };
 }
 inventaire.rations -= total;
 return { ok: true };
}
```

Avant de refactoriser : écrire les tests qui capturent le comportement actuel.
Ces tests ne testent pas une belle architecture : ils testent ce que le code fait, ici, maintenant.

```js
// gestionCamp.test.js
describe("traiterRation", () => {
 it("distribue 1 ration par personne standard", () => {
  const inventaire = { rations: 10 };
  const personnages = [
   { statut: "vivant", faim: 3 },
   { statut: "vivant", faim: 5 },
  ];
  const résultat = traiterRation(inventaire, personnages);
  expect(résultat.ok).toBe(true);
  expect(inventaire.rations).toBe(8);
 });

 it("distribue 2 rations si faim > 7", () => {
  const inventaire = { rations: 10 };
  const personnages = [{ statut: "vivant", faim: 9 }];
  traiterRation(inventaire, personnages);
  expect(inventaire.rations).toBe(8);
 });

 it("ignore les morts", () => {
  const inventaire = { rations: 10 };
  const personnages = [
   { statut: "mort", faim: 9 },
   { statut: "vivant", faim: 3 },
  ];
  traiterRation(inventaire, personnages);
  expect(inventaire.rations).toBe(9);
 });

 it("lève une alerte si rations insuffisantes", () => {
  const inventaire = { rations: 1 };
  const personnages = [
   { statut: "vivant", faim: 3 },
   { statut: "vivant", faim: 3 },
  ];
  const résultat = traiterRation(inventaire, personnages);
  expect(résultat.ok).toBe(false);
  expect(résultat.manque).toBe(1);
  expect(inventaire.alerte).toBe(true);
 });
});
```

Tous verts. Maintenant on peut refactoriser en sécurité.

---

## 3) REFACTORISER : AVEC LE FILET

```js
// gestionCamp.js:version refactorisée
// même comportement, code lisible. Rick peut dormir.

function calculerRationsNécessaires(personnages) {
 return personnages
  .filter((p) => p.statut !== "mort")
  .reduce((total, p) => total + (p.faim > 7 ? 2 : 1), 0);
}

function traiterRation(inventaire, personnages) {
 const rationsNécessaires = calculerRationsNécessaires(personnages);

 if (rationsNécessaires > inventaire.rations) {
  inventaire.alerte = true;
  return { ok: false, manque: rationsNécessaires - inventaire.rations };
 }

 inventaire.rations -= rationsNécessaires;
 return { ok: true };
}
```

On lance les tests. Tout vert. Le refacto est valide.
`calculerRationsNécessaires` est maintenant extraite et testable séparément.

---

## 4) STRATÉGIE : DÉCOUPER LE REFACTO EN PETITS COMMITS

Un refacto qui dure 4 heures sans commit intermédiaire : c'est une catastrophe en attente.
Si quelque chose casse au milieu et que tu ne sais plus où tu en es, tu reparts de zéro.

```
Commit 1 : écrire les tests sur le code existant (sans changer le code)
Commit 2 : extraire calculerRationsNécessaires (tests toujours verts)
Commit 3 : renommer les variables (tests toujours verts)
Commit 4 : simplifier le if (tests toujours verts)
```

Chaque commit est un checkpoint. Si quelque chose casse entre deux commits : tu sais exactement quelle étape a introduit le problème.

---

## 5) LE REFACTO QUI DOIT CHANGER DES TESTS

Parfois le refacto change l'interface publique d'un module.
Exemple : tu renommes un paramètre, tu changes le format de retour.

Dans ce cas, les tests doivent changer aussi. Mais c'est un changement conscient, pas accidentel.

```
Comportement préservé  --> tests ne changent pas
Interface modifiée intentionnellement --> tests se mettent à jour, on sait pourquoi
```

La différence : dans le premier cas, les tests sont un garde-fou.
Dans le second, les tests sont une documentation qui s'adapte.

---

## EXERCICES

## EXO 1 : le camp tombe, le code pas

Daryl a laissé un module de rotation des gardes dans l'état suivant.
Le camp tourne dessus depuis 3 semaines. Personne n'a de tests. T-Dog vient de signaler un bug : parfois un poste reste sans garde. Tu dois refactoriser sans introduire de régression.

```js
function planifierGardes(gardes, postes) {
 const plan = {};
 for (let i = 0; i < postes.length; i++) {
  const g = gardes[i % gardes.length];
  if (g && g.disponible !== false) {
   plan[postes[i]] = g.nom;
  }
 }
 return plan;
}
```

Étape 1 : déduis le comportement exact du code (y compris les cas limites).
Étape 2 : écris les tests qui documentent ce comportement. Tous verts avant de toucher le code.
Étape 3 : refactorise pour que le module soit lisible et testable séparément.
Étape 4 : si tu trouves un comportement suspect (un garde "indisponible" laisse le poste vide sans signal), documente-le dans un test explicite, mais ne le corrige pas encore : correction = nouveau commit, après le refacto.

(Indice : concentre-toi sur les cas `gardes.length < postes.length` et `disponible === false`)

---

## EXO 2 : le classement Ballon d'Or en chirurgie

Cette fonction tourne en production chez un média sportif depuis 2 ans. Elle agrège les votes de 173 journalistes et publie le classement en direct. Zéro test. Un nouveau développeur a proposé de la "simplifier". Tu dois l'empêcher de toucher quoi que ce soit avant que des tests existent.

```js
function publierClassement(votes, joueurs) {
 const totaux = {};
 for (const v of votes) {
  if (!joueurs.find((j) => j.id === v.joueurId)) continue;
  totaux[v.joueurId] = (totaux[v.joueurId] || 0) + v.points;
 }
 const classement = Object.entries(totaux)
  .sort((a, b) => b[1] - a[1])
  .map(([id, points], i) => ({
   rang: i + 1,
   joueur: joueurs.find((j) => j.id === Number(id)).nom,
   points,
  }));
 return { classement, vainqueur: classement[0]?.joueur ?? null };
}
```

Étape 1 : écris les tests qui couvrent tous les comportements observables, y compris les cas limites : vote pour un joueur inexistant, liste de votes vide, ex-aequo.
Étape 2 : extrait `agrégerVotes(votes, joueurs)` et `formaterClassement(totaux, joueurs)` en fonctions séparées.
Étape 3 : ajoute des tests unitaires sur les fonctions extraites.
Le classement final doit être identique avant et après le refacto.

---

## RÉSUMÉ

Refactoriser sans tests : espoir. Avec tests : certitude.
Avant de refactoriser du code sans tests : écrire les tests d'abord, tout vert, puis refactoriser.
Les tests ne bougent pas pendant un refacto : si un test change, c'est un changement de comportement, pas un refacto.
Petits commits : chaque étape du refacto est vérifiable et réversible.


> Complément à l'analogie Daryl Dixon : un test unitaire est aussi une **documentation de contrat exécutable**. Ce que le test décrit, c'est ce que le code PROMET. Casse le contrat → casse le test.
