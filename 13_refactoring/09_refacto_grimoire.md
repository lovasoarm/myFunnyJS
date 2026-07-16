# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~9 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE DU REFACTORING
Le vocabulaire qui te permet de nommer un problème avant de le réparer.

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Refactoring** | Changer la structure du code sans changer son comportement. | `// avant : if/else en cascade` `// après : objet de lookup` `// le résultat retourné est identique (juste écrit plus proprement)` |Naruto qui s'entraîne | Walking Dead qui réorganise le camp|
| **Code smell** | Signal que le code marche mais cache un problème de structure. | `// 80 lignes dans une fonction` `// = smell : "long method"` `// (ça compile, ça pue quand même)` |Breaking Bad (labo qui fuit) | Garo (armure qui craque)|
| **God class** | Une classe qui fait beaucoup trop de choses à la fois. | `class CampManager {` ` fight() {}` ` cook() {}` ` saveToDisk() {}` `// trois métiers dans une seule classe` `}` |Naruto en mode tout-en-un | Walking Dead (chef qui fait tout)|
| **Feature envy** | Une fonction qui utilise plus les données d'un autre objet que les siennes. | `renderRating(match) {` ` return match.stats.goals * 4` `// la logique devrait vivre dans match, pas ici` `}` |Foot (coach qui joue à la place du joueur) | Naruto (clone qui fait le boulot du vrai)|
| **Long method** | Fonction trop longue qui fait plusieurs choses sans le dire. | `function processAll(data) {` ` // parse` ` // valide` ` // transforme` ` // log` `// 4 jobs en 1 fonction` `}` |Prison Break (plan trop long, trop de variables) | Naruto (mission S-rank sans checkpoint)|
| **Duplication** | Même logique copiée à plusieurs endroits, donc plusieurs sources de vérité. | `// règle écrite ici` `if (years >= 3) {}` `// et encore ici, copiée` `if (years >= 3) {}` `// si la règle change, fallait y penser 2 fois` |Country (refrain copié-collé mal) | Garo (deux Chevaliers avec le même ordre, jamais synchronisés)|
| **Magic number** | Une valeur numérique en dur, sans nom, dont le sens est invisible. | `if (duration > 99.9) {}` `// 99.9 = quoi ? mystère total` `const ARMOR_LIMIT = 99.9` `if (duration > ARMOR_LIMIT) {}` `// maintenant ça raconte une histoire` |Banshee (code secret sans légende) | Foot (numéro de maillot sans nom dessus)|
| **SOLID** | 5 principes (SRP, OCP, LSP, ISP, DIP) pour garder un codebase qui évolue sans tout casser. | `// S : une classe, une responsabilité` `// O : on étend sans réécrire` `// chaque lettre = une question à se poser` |Dragon Ball Z (5 guerriers, 5 rôles précis) | Walking Dead (groupe organisé vs groupe chaotique)|
| **SRP** | Single Responsibility : une classe a une seule raison de changer. | `class Ninja { attack() {} }` `class BattleLogger { log() {} }` `// séparés : changer l'un ne touche pas l'autre` |Naruto (un ninja, une spécialité) | Foot (le gardien ne joue pas attaquant)|
| **OCP** | Open/Closed : on étend le comportement sans modifier le code existant. | `const jutsus = { rasengan: fn1 }` `jutsus.chidori = fn2` `// ajout sans toucher au moteur principal` |Naruto (nouveau jutsu = nouvelle technique, pas une réécriture du ninja) | Trapsoul (nouvelle chanson = nouvelle piste, pas une réécriture de la radio)|
| **LSP** | Liskov : une sous-classe doit pouvoir remplacer sa classe mère sans surprise. | `class Chevalier { fight() {} }` `class ChevalierBronze extends Chevalier {` ` fight() { return 'mode entraînement' }` `// respecte le contrat, comportement adapté` `}` |Garo (tout Chevalier doit pouvoir combattre, même le débutant) | Dragon Ball Z (un Saiyan reste un Saiyan, même faible)|
| **ISP** | Interface Segregation : pas d'interface fourre-tout, chacun dépend que de ce qu'il utilise. | `class Fighter { fight() {} }` `class Cook { cook() {} }` `// Carl n'hérite que de Fighter` `// pas de "negotiate()" qu'il n'utilisera jamais` |Walking Dead (chacun son rôle au camp) | Foot (le kiné ne tire pas les penalties)|
| **DIP** | Dependency Inversion : le code métier dépend d'une abstraction, pas d'un détail technique précis. | `class Plan {` ` constructor(storage) {` `  this.storage = storage` `// storage peut être MySQL OU Redis, Plan s'en fiche` ` }` `}` |Prison Break (le plan ne dépend pas d'un seul outil précis) | Breaking Bad (la formule marche, peu importe le labo)|
| **Pure refactor** | Un refacto qui ne change rien au comportement observable, juste la structure interne. | `// avant : boucle for` `// après : .reduce()` `// même résultat, même input, même output` |Dragon Ball Z (transformation, même puissance de base, nouvelle forme) | Trapsoul (remix, même morceau, nouvel arrangement)|
| **Safety net (filet de tests)** | Tests qui figent le comportement actuel avant de toucher au code. | `test('getTotal sur 2 tracks = 380', () => {` ` expect(pm.getTotal()).toBe(380)` `// si ça casse après refacto, ce test devient rouge` `})` |Prison Break (vérifier le plan avant de creuser) | Naruto (vérifier son équipement ninja avant la mission)|
| **Incremental refactor (petits pas)** | Avancer par transformations isolées, tests verts entre chaque étape. | `// étape 1 : extraire une fonction` `// étape 2 : nommer une constante` `// étape 3 : extraire une classe` `// chaque étape testée séparément` |Naruto (entraînement progressif, pas un combat direct contre Pain) | Walking Dead (sécuriser le camp zone par zone)|
| **DRY** | Don't Repeat Yourself : une seule source de vérité pour chaque règle. | `function isAccredited(j) {` ` return j.years >= 3` `// utilisé partout, défini une seule fois` `}` |Country (une seule version officielle du tube) | Foot (un seul règlement, appliqué partout)|
| **YAGNI** | You Aren't Gonna Need It : ne construis pas une feature "au cas où". | `// pas de système de plugin générique` `// pour 1 seul type de jutsu` `// → tu le feras QUAND t'en auras vraiment besoin` |Dragon Ball Z (pas besoin du Super Saiyan 3 pour battre Raditz) | Prison Break (pas besoin d'un plan B pour un mur déjà ouvert)|
| **KISS** | Keep It Simple, Stupid : la solution la plus simple qui marche est souvent la bonne. | `// 1 ligne avec .filter()` `// au lieu de 15 lignes avec boucles imbriquées` `// même résultat, zéro complexité inutile` |Banshee (plan simple, exécution nette) | Garo (un coup net plutôt qu'une chorégraphie de 10 minutes)|

---

## RÉSUMÉ
Ce grimoire, c'est ton dictionnaire de poche pour les code reviews et les refactos. Quand tu sens qu'un truc cloche mais que tu sais pas le nommer, reviens ici. Nommer le problème (god class, feature envy, magic number...) c'est déjà la moitié du chemin vers la solution.

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
