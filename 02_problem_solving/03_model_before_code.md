---
stability: intemporel
---

# MODÉLISER AVANT DE CODER
Temps de lecture ~8 min

Ouvrir l'éditeur en premier, c'est l'erreur numéro un.

Pas parce que coder c'est mal. Parce que quand tu codes sans modèle, tu prends des décisions structurelles en silence, sans t'en rendre compte, et tu t'enfermes dedans. Deux heures plus tard, tout refactorer coûte plus cher que d'avoir réfléchi 15 minutes au départ.

Modéliser, c'est décider de la forme des données et des contrats entre les pièces avant d'écrire une seule fonction.

---

## 1) QU'EST-CE QU'UN MODÈLE

Un modèle, c'est la représentation de ton domaine en structures de données et en contrats.

Pas du code. Pas encore. Juste des formes.

```
Domaine : un tournoi de foot
Entités : Équipe, Joueur, Match, Score, Classement

Équipe   : { id, nom, joueurs: Joueur[] }
Joueur   : { id, nom, poste, equipeId }
Match   : { id, domicile: Équipe, extérieur: Équipe, score: Score, statut }
Score   : { domicile: number, extérieur: number }
Classement : { equipeId, points, goalDifference, joués }
```

Tu peux lire ça à voix haute. Tu peux expliquer ça à quelqu'un qui code pas. Si tu peux pas : le modèle est pas clair.

---

## 2) LES CONTRATS ENTRE LES PIÈCES

Un contrat, c'est la promesse qu'un module fait à ceux qui l'appellent.

```
// Contrat de calculerClassement
// entrée : Match[] -- tous les matchs joués jusqu'ici
// sortie : Classement[] -- trié par points décroissants
// jamais : de mutation sur les matchs en entrée
// jamais : d'effet de bord (pas d'écriture en DB, pas de log)

function calculerClassement(matchs: Match[]): Classement[] {
 // ...
}
```

Le contrat se définit AVANT le corps de la fonction. C'est pas un commentaire décoratif. C'est une décision.

---

## 3) LES TROIS QUESTIONS DU MODÉLISATEUR

Quand tu construis un modèle, tu poses ces trois questions pour chaque entité :

**De quoi cette entité a-t-elle besoin pour exister ?**
Ce sont ses champs obligatoires.

**Qu'est-ce qu'elle ne doit jamais contenir ?**
Ce sont ses invariants : les règles qui ne peuvent jamais être violées.

**Comment est-ce qu'elle change dans le temps ?**
Ce sont ses transitions d'état.

```
Entité : Match

Besoin pour exister : deux équipes, un statut initial
Invariant : score.domicile >= 0 && score.extérieur >= 0
      statut ne peut pas revenir de "terminé" à "en cours"
Transitions : "planifié" --> "en cours" --> "terminé"
       jamais de saut : "planifié" --> "terminé" directement
```

Un modèle sans invariants, c'est un modèle qui laisse entrer des données impossibles. Et des données impossibles produisent des bugs impossibles à tracer.

---

## 4) L'ERREUR : MODÉLISER PAR L'AFFICHAGE

La plupart des devs débutants modélisent par ce qu'ils voient à l'écran.

```
// Mauvais : modélisé par l'UI
Joueur : {
 nomAffiché: string,    // ce que t'affiches
 photoUrl: string,     // ce que t'affiches
 statsFormatées: string,  // "85 buts / 23 passes" -- fusion de deux données
}

// Correct : modélisé par le domaine
Joueur : {
 id: string,
 nom: string,
 stats: { buts: number, passes: number }
}
// l'affichage "85 buts / 23 passes" : c'est le boulot de la couche présentation
```

Si ton modèle change chaque fois que l'UI change : t'as modélisé l'affichage, pas le domaine.

---

## 5) MODÉLISER LES ÉTATS D'UN SYSTÈME

Certains bugs viennent pas d'un calcul faux. Ils viennent d'un état impossible.

Naruto qui lance un jutsu alors que son chakra est à zéro : état impossible.
Un match "terminé" dont le score change encore : état impossible.

La solution : modéliser les états explicitement et les transitions autorisées.

```
// Mauvais : un boolean qui porte trop de poids
match.estTerminé = true
// rien n'empêche match.estTerminé = true && match.estEnCours = true en même temps

// Correct : un type discriminant qui rend les états impossibles... impossibles
type StatutMatch =
 | { type: "planifié"; dateKickoff: Date }
 | { type: "enCours"; minuteActuelle: number }
 | { type: "terminé"; scoreFinal: Score }

// maintenant un match ne peut pas être "terminé" et "enCours" en même temps
// le compilateur te protège
```

---

## 6) LE MODÈLE COMME OUTIL DE COMMUNICATION

Un bon modèle se lit comme une histoire.

```
// Ce modèle raconte :
// Un Chevalier d'Or a un nom, une armure, et un statut
// L'armure peut être portée, détruite ou en recharge
// Un Chevalier ne peut combattre que si son armure est "portée"
// Un combat a une durée : si elle dépasse 99.9 secondes, l'armure se détruit

type StatutArmure = "portée" | "détruite" | "enRecharge"

type Chevalier = {
 id: string
 nom: string
 armure: { statut: StatutArmure; tempsRestant: number }
}

type Combat = {
 chevalier: Chevalier
 horror: Horror
 débutAt: number    // timestamp
 duréeMax: 99900    // en ms -- loi immuable des Chevaliers d'Or
}
```

Si quelqu'un lit ce modèle et comprend le domaine sans que tu expliques : c'est un bon modèle.

---

## EXERCICES

## EXO 1 : Modélise le système d'évasion de Michael Scofield

Michael a besoin d'un plan d'évasion pour Fox River. Le système doit gérer :
les prisonniers, les sections de la prison, les gardes, les checkpoints, et le plan d'évasion lui-même.

Modélise chaque entité (champs, invariants, transitions d'état si applicable).
Identifie les contrats entre les pièces.
Identifie deux états impossibles que ton modèle doit rendre impossibles.

---

## EXO 2 : Le modèle cassé de T-Bag

T-Bag a modélisé les prisonniers comme ça :
```
prisonnier = {
 nomComplet: "Theodore Bagwell",
 celluleEtSection: "A-5",   // fusion de deux données distinctes
 statutEtDate: "libéré le 12/03", // fusion statut + date
 dangereux: true
}
```

Identifie les problèmes. Propose un modèle correct avec invariants.

---

## EXO 3 : Les états impossibles du Ballon d'Or

Un vote du Ballon d'Or peut être dans ces états :
"ouvert", "clôturé", "en dépouillement", "résultat publié".

Modélise les transitions autorisées (format `A --> B`).
Identifie deux transitions qui doivent être impossibles.
Implémente le type discriminant qui les rend impossibles en TypeScript.

---


---

## SIGNES QU'IL NE FAUT PAS CODER MAINTENANT

Cinq signaux nets. Si un seul est allumé, tu poses le clavier et tu vas résoudre le signal avant.

1. **La spec est floue** : tu n'arrives pas à écrire en une phrase ce que le code doit produire. Coder maintenant = coder à ta place la spec qui n'existe pas. Tu vas la réécrire trois fois.
2. **Ton hypothèse n'est pas prouvée** : tu supposes que le bug vient de X sans l'avoir vérifié. Coder = fixer un truc qui n'était peut-être pas cassé. Va prouver d'abord.
3. **Il n'y a pas de test qui capture le comportement attendu** : tu vas savoir que tu as fini quand ? Aucun test = aucune fin. Écris le test qui échouera avant.
4. **Il n'y a pas d'ADR (ni de discussion tracée)** : la décision est encore dans la tête de quelqu'un. Coder maintenant = imposer par le fait accompli. Écris l'ADR, poste-la, attends 24h de retour.
5. **Il reste un désaccord non résolu dans l'équipe** : deux collègues ont deux approches. Coder maintenant = provoquer un merge conflict humain à la revue. Résous le désaccord d'abord.

Un dev senior se reconnaît à ce qu'il ne code pas. Un junior code pour se rassurer, un senior s'arrête pour dérisquer.

## RÉSUMÉ

Modéliser avant de coder : c'est décider de la forme des données et des contrats avant que le code existe. Un bon modèle rend les états impossibles... impossibles. Il se lit comme une histoire. Il change quand le domaine change, pas quand l'UI change. Un modèle sans invariants laisse entrer n'importe quoi : et n'importe quoi produit des bugs qu'on comprend pas.
