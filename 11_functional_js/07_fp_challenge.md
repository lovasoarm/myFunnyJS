---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# FP CHALLENGE : LE PIPELINE QUI PROUVE QUE C'EST PAS QUE THÉORIQUE
Temps de lecture ~8 min

Challenge de synthèse du module 11_functional_js. Pas une leçon, pas un exercice guidé : un système complet à construire seul avec tout ce que tu as appris dans ce module.

T'as appris les pièces séparément : fonctions pures, immutabilité, composition, curry, partial.
Maintenant t'assembles tout ça en un seul système cohérent.

Pas d'exercice jouet. Un vrai pipeline de transformation de données avec des contraintes réelles : données sales en entrée, rapport structuré en sortie, zéro mutation, zéro état global.

---

## LE CONTEXTE : L'ANALYSE DE SAISON DU BALLON D'OR

L'UEFA veut un pipeline d'analyse de candidats pour le Ballon d'Or.
Les données arrivent sales : valeurs manquantes, types incorrects, zones vides.
Le pipeline doit nettoyer, enrichir, filtrer, calculer, et produire un rapport structuré.

Contrainte dure : tout est fonctionnel. Pas de `let` hors des fonctions. Pas de mutation. Pas de `for`. Chaque transformation est une fonction nommée, pure, testable.

---

## LES DONNÉES BRUTES

```js
const donnéesBrutes = [
 { id: "p01", nom: "Messi",  buts: "45", passes: 20, aCL: true, actif: true, salaire: 150 },
 { id: "p02", nom: "Mbappé",  buts: 52,  passes: "15",aCL: false, actif: true, salaire: 180 },
 { id: "p03", nom: "Haaland", buts: 60,  passes: 8,  aCL: true, actif: true, salaire: 200 },
 { id: "p04", nom: "Benzema", buts: null, passes: 12, aCL: true, actif: false, salaire: 120 },
 { id: "p05", nom: "",     buts: 38,  passes: 18, aCL: false, actif: true, salaire: null },
 { id: "p06", nom: "De Bruyne",buts: 22,  passes: 35, aCL: true, actif: true, salaire: 160 },
 { id: "p07", nom: "Salah",  buts: NaN,  passes: 14, aCL: false, actif: true, salaire: 140 }
]
```

---

## MISSION 1 : NETTOYAGE (fonctions pures, zéro mutation)

Écris ces fonctions. Chacune prend une liste, retourne une nouvelle liste.

```js
// 1. filtrerActifs(joueurs)
//  Garde seulement les joueurs avec actif === true

// 2. filtrerDonnéesValides(joueurs)
//  Élimine les joueurs avec :
//  - nom vide ou manquant
//  - buts null, undefined, ou NaN (utilise Number.isFinite)
//  - passes null, undefined, ou NaN

// 3. normaliserTypes(joueurs)
//  Convertit buts et passes en number (ils peuvent arriver en string)
//  Retourne un nouveau tableau avec des objets corrigés
//  Si la conversion échoue ou donne NaN : la valeur reste 0
```

---

## MISSION 2 : ENRICHISSEMENT

```js
// 4. calculerScore(coefficients) -> joueurs -> joueurs avec champ "score"
//  coefficients = { buts: number, passes: number, cl: number }
//  score = buts * coefficients.buts + passes * coefficients.passes + (aCL ? coefficients.cl : 0)
//  Curryfiée : les coefficients se fixent d'abord

// 5. ajouterCategorie(joueurs)
//  Ajoute un champ "categorie" selon le score :
//  score >= 60 : "Ballon d'Or"
//  score >= 40 : "Top 5"
//  score >= 25 : "Nominé"
//  < 25    : "Hors course"

// 6. ajouterRang(joueurs)
//  Ajoute un champ "rang" qui est la position dans le classement (1-based)
//  rang 1 = score le plus élevé
//  Les joueurs doivent déjà être triés par score décroissant
```

---

## MISSION 3 : FORMATAGE

```js
// 7. trierParScore(joueurs)
//  Retourne un nouveau tableau trié par score décroissant
//  Ne mute pas le tableau original (attention à sort)

// 8. formaterRapport(joueurs)
//  Transforme chaque joueur en entrée de rapport :
//  {
//   rang: 1,
//   nom: "Haaland",
//   categorie: "Ballon d'Or",
//   score: 72.4,
//   details: "60 buts · 8 passes · Champions League "
//  }

// 9. genererSommaire(joueurs)
//  Retourne un objet de synthèse (réduction) :
//  {
//   totalCandidats: number,
//   moyenneScore: number (arrondi à 1 décimale),
//   ballonDorCandidat: string (nom du rang 1),
//   categorieDistribution: { "Ballon d'Or": n, "Top 5": n, "Nominé": n, "Hors course": n }
//  }
```

---

## MISSION 4 : ASSEMBLER LE PIPELINE

```js
// Assemble toutes les fonctions dans un seul pipeline avec pipe.
// Coefficients à utiliser : { buts: 0.6, passes: 0.4, cl: 30 }

// Pipeline attendu :
// filtrerActifs
//  -> filtrerDonnéesValides
//  -> normaliserTypes
//  -> calculerScore({ buts: 0.6, passes: 0.4, cl: 30 })
//  -> trierParScore
//  -> ajouterRang
//  -> ajouterCategorie
//  -> formaterRapport

// const analyserSaison = pipe(...)
// const rapport = analyserSaison(donnéesBrutes)

// En parallèle (pas dans le pipe) :
// const sommaire = genererSommaire(rapport)
```

---

## RÉSULTAT ATTENDU

```js
// rapport (après pipeline) :
[
 { rang: 1, nom: "Haaland",  categorie: "Ballon d'Or", score: 72.4, details: "60 buts · 8 passes · Champions League " },
 { rang: 2, nom: "Mbappé",  categorie: "Top 5",    score: 37.2, details: "52 buts · 15 passes · Champions League " },
 { rang: 3, nom: "De Bruyne", categorie: "Top 5",    score: 40.2, details: "22 buts · 35 passes · Champions League " },
 { rang: 4, nom: "Messi",   categorie: "Ballon d'Or", score: 56.0, details: "45 buts · 20 passes · Champions League " }
 // ordre exact selon ton implémentation du scoring
]

// sommaire :
{
 totalCandidats: 4,
 moyenneScore: ...,
 ballonDorCandidat: "Haaland",
 categorieDistribution: { "Ballon d'Or": 2, "Top 5": 2, "Nominé": 0, "Hors course": 0 }
}
```

---

## MISSION BONUS : TESTER LE PIPELINE

Écris des tests pour chaque fonction individuelle. Un test = une fonction = un comportement.

```js
// Exemples de tests attendus :

// filtrerActifs
test("filtre les joueurs inactifs", () => {
 const entrée = [{ actif: true }, { actif: false }, { actif: true }]
 expect(filtrerActifs(entrée)).toHaveLength(2)
})

// filtrerDonnéesValides
test("filtre les buts NaN", () => { ... })
test("filtre les noms vides", () => { ... })
test("filtre les passes null", () => { ... })

// calculerScore
test("calcule le score sans Champions League", () => { ... })
test("calcule le score avec Champions League", () => { ... })

// normaliserTypes
test("convertit les buts string en number", () => { ... })
test("met 0 si la conversion échoue", () => { ... })
```

---

## CONTRAINTES DE RÉUSSITE

Pour que ce challenge soit réussi à 10/10 :

```
 Aucun let hors des fonctions
 Aucune mutation d'objet ou de tableau existant
 Aucun for/while : uniquement map, filter, reduce
 Chaque fonction est pure (testable sans mock)
 calculerScore est curryfiée (coefficients fixés séparément)
 Le pipeline est assemblé avec pipe
 Les données originales (donnéesBrutes) ne sont pas modifiées après le pipeline
 Les cas edge sont gérés : NaN, null, string à la place de number
```

---

## RÉSUMÉ

Ce challenge n'est pas un exercice de plus : c'est la preuve que le FP est utilisable sur de vraies données sales.
Chaque concept du module s'assemble ici : pure functions pour le nettoyage, immutabilité pour ne rien casser, curry pour les coefficients, pipe pour l'assemblage.
Le résultat : un pipeline qui se teste bout à bout, qui se modifie sans risque, et qui s'étend sans toucher ce qui marche.
C'est ça le FP en prod : pas un style, une architecture.
