# Page verrouillée
Temps de lecture ~11 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE DU PROBLEM SOLVER

Le lexique du dev qui conçoit avant de coder.
Pas des définitions Wikipedia. Des outils.

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Domaine** | L'univers métier du système : les entités, les règles, le vocabulaire. Ce qui existe indépendamment de toute technologie. | `// Domaine : tournoi de foot` `// Entités : Équipe, Match, Score` `// Règle : 3 pts victoire, 1 nul, 0 défaite` | Le tatami où les ninjas s'entraînent (pas le tatami lui-même, ce qui s'y passe) / Le terrain de foot sans les tribunes ni les caméras |
| **Contrat** | La promesse qu'une pièce de code fait à ceux qui l'appellent : ce qu'elle accepte en entrée, ce qu'elle garantit en sortie, ce qu'elle ne fera jamais. | `// entrée : Match[]` `// sortie : Classement[] trié` `// jamais : mutation des matchs en entrée` | La poignée de main entre Goku et Vegeta avant un sparring (les règles du combat) / Les conditions du contrat entre Michael Scofield et son avocat |
| **Couplage** | Le degré de dépendance entre deux modules. Fort couplage : changer A casse B. Faible couplage : A et B évoluent indépendamment. | `// Fort : CombatLoop importe directement Sentry` `// Faible : CombatLoop importe monitoring` `//     monitoring wrapping Sentry` | Naruto et Sasuke enchaînés aux poignets (fort) vs deux Chevaliers d'Or sur des missions séparées (faible) / meme mecanique cote football : le staff repete jusqu'a ce que la tactique tienne sans le tableau |
| **Cohésion** | Le degré d'unité d'un module : est-ce que tout ce qu'il contient sert le même objectif ? Un module cohésif fait une chose et la fait bien. | `// Faible : utils.js avec formatDate(), calculerDegats(), envoyerEmail()` `// Forte : jutsuEngine.js qui ne fait que gérer les jutsus` | Un couteau suisse (faible cohésion, tout mais mal) vs un katana (forte cohésion, une chose, parfaite) / meme mecanique cote football : le staff repete jusqu'a ce que la tactique tienne sans le tableau |
| **Invariant** | Une règle qui ne peut jamais être violée dans ton système. Si elle l'est : l'état est corrompu. | `// Invariant : score >= 0` `if (score < 0) throw new InvalidStateError("score négatif impossible")` | La loi des 99.9 secondes dans Garo (invariant physique de l'armure) / Le code pénal de Fox River (certaines règles ne se négocient pas) |
| **Frontière** | La ligne entre deux modules. Tout ce qui traverse cette ligne doit être explicite : un contrat définit ce qui passe et ce qui ne passe pas. | `// Frontière entre CombatLoop et JutsuEngine` `// seul CombatEvent passe la frontière` `// les détails internes de chaque module restent de leur côté` | La frontière entre Albuquerque et El Paso dans Breaking Bad (ce qui passe est contrôlé) / Les murs de Fox River |
| **Point de variabilité** | Un endroit dans le système où le comportement va probablement changer. À isoler derrière une interface pour limiter l'impact du changement. | `// Point de variabilité : source audio de TrapSoul Radio` `interface AudioSource { getTrack(id): Promise<Track> }` `// aujourd'hui : LocalAudioSource` `// demain : StreamingAudioSource` | La position d'un joueur sur le terrain (peut changer selon la tactique sans changer les règles du foot) / Le rôle d'un ninja selon les missions |
| **Dépendance** | Une relation entre deux modules où l'un a besoin de l'autre pour fonctionner. Les dépendances doivent être explicites, à sens unique, et minimales. | `// CombatLoop dépend de JutsuEngine` `// JutsuEngine dépend de NinjaStats` `// NinjaStats ne dépend de rien : c'est la base` | La chaîne alimentaire dans Walking Dead (les dépendances vont dans un sens, jamais un zombie qui nourrit un humain) / meme mecanique cote football : le staff repete jusqu'a ce que la tactique tienne sans le tableau |
| **Cycle de dépendance** | Quand A dépend de B et B dépend de A. Résultat : impossible de tester ou de modifier l'un sans l'autre. Bombe à retardement garantie. | `// CombatLoop --> JutsuEngine --> CombatLoop` `// résultat : tester JutsuEngine nécessite CombatLoop` `// solution : extraire une troisième pièce indépendante` | Rick Grimes et Negan qui se tiennent en otage mutuellement (aucun peut avancer sans l'autre) / Deux suspects qui se mentent mutuellement dans une enquête |
| **Abstraction** | Cacher les détails d'implémentation derrière une interface simple. Le code qui utilise l'abstraction ne sait pas et n'a pas besoin de savoir comment elle fonctionne en dessous. | `// Abstraction : monitoring.captureError(err)` `// Dessous : peut être Sentry, Datadog, console.error` `// le reste du code s'en fout` | Le volant d'une voiture (tu sais tourner sans savoir comment la direction assistée fonctionne) / Sasuke qui utilise son Sharingan sans comprendre sa génétique |
| **Inversion de dépendance** | Les modules de haut niveau ne dépendent pas des modules de bas niveau. Les deux dépendent d'abstractions. Ça permet de changer l'implémentation sans changer la logique. | `// Sans DIP : CombatLoop --> SentryLogger (concret)` `// Avec DIP : CombatLoop --> Logger (interface)` `//      SentryLogger implements Logger` | Le Conseil de Surveillance qui reçoit des rapports standardisés (peu importe quel Chevalier les envoie) / L'arbitre qui applique les règles peu importe les équipes |
| **Reproduction minimale** | Le plus petit exemple possible qui déclenche un bug. Réduit un problème complexe à sa forme la plus simple pour l'analyser et le corriger. | `// Bug : classement faux sur 500 jurés` `// Reproduction minimale :` `const votes = [{joueur:"A",pts:100},{joueur:"B",pts:80}]` `calculerClassement(votes) // retourne B avant A` | Couper un circuit à son composant défaillant (pas besoin de tout le tableau électrique pour trouver le fusible grillé) / Rejouer le dernier quart d'heure du match pour comprendre le but encaissé |
| **ADR** | Architecture Decision Record. Document court qui trace une décision technique : contexte, options considérées, décision prise, trade-offs acceptés. | `// DÉCISION : Dijkstra pour les routes` `// RAISON  : réseau va évoluer (nouvelles villes)` `// TRADE-OFF : complexité initiale plus haute` | Le journal de bord d'un Chevalier d'Or après une mission (ce qu'il a vu, ce qu'il a décidé, pourquoi) / Les notes tactiques de Walter White avant une livraison |
| **Problème XY** | Demander de l'aide sur Y (une solution supposée) alors que le vrai problème est X. Répondre à Y sans comprendre X artefact une solution au mauvais problème. | `// Demandé : "besoin d'un refresh toutes les 5s"` `// Problème réel : "données pas en temps réel"` `// Solution : WebSocket, pas du polling` | Demander comment courir plus vite pour attraper un bus alors que le vrai problème est d'être en retard (la solution : partir plus tôt) / Michael Scofield qui demande une lime alors que la vraie solution est dans ses tatouages |
| **YAGNI** | You Aren't Gonna Need It. Ne pas coder une feature ou une généralisation avant d'en avoir besoin. S'applique aux features complètes, pas aux points de variabilité évidents. | `// YAGNI : pas de système de tournoi si la spec` `//     parle juste d'un match amical` `// Pas YAGNI : rendre la source audio paramétrable` `//       si deux sources sont déjà en discussion` | Ne pas construire une armée de Titans avant de savoir s'il y a vraiment une guerre (AoT) / Walter White qui ne commande pas 10 tonnes de précurseur avant d'avoir un client |
| **OCP** | Open/Closed Principle. Ouvert à l'extension, fermé à la modification. Ajouter une feature sans modifier le code qui marche déjà. | `// Fermé  : calculerDegats() ne change pas` `// Ouvert : on ajoute un nouveau jutsu dans la map` `const jutsus = { rasengan: ..., chidori: ..., susanoo: ... }` | Un stade de foot : on ajoute des tribunes sans déplacer le terrain / Une playlist : on ajoute des titres sans réenregistrer les existants |
| **Spike** | Une exploration technique courte et jetable pour valider une hypothèse ou une approche avant de s'y engager. Le code d'un spike ne va pas en prod. | `// Spike : tester si WebRTC tient sous 50 connexions simultanées` `// durée : 2h max` `// résultat attendu : oui/non + chiffres` `// code : jeté après` | Un entraînement d'avant-match pour tester une nouvelle tactique sans risquer le résultat réel / Sasuke qui teste un jutsu sur une cible d'entraînement avant de l'utiliser en combat |

---

## LIRE UNE SPEC FLOUE : LE PROTOCOLE EN 5 QUESTIONS

```
1. Qu'est-ce qui se passe actuellement ?   (comportement réel, avec exemple concret)
2. Qu'est-ce qui devrait se passer ?     (comportement attendu, précis)
3. Dans quelles conditions ça se artefact ?  (toujours / parfois / sur certains inputs)
4. C'est quoi l'impact réel ?        (bloquant / contournable / combien d'users)
5. Qu'est-ce qui a changé récemment ?    (déploiement / données / config / trafic)
```

---

## CHOISIR UNE APPROCHE : LES 4 DIMENSIONS

```
Complexité    : compréhensible par quelqu'un qui arrive demain ?
Performance   : O() appropriée pour le volume réel ?
Couplage     : crée-t-elle des dépendances qu'on va regretter ?
Coût de change  : si les specs évoluent, combien de code on touche ?
```

---

## LE TEST D'UNE BONNE DÉCOMPOSITION

```
Test 1 : chaque module peut être décrit en une responsabilité (une phrase)
Test 2 : chaque module peut être testé sans les autres
Test 3 : les dépendances vont dans un seul sens (pas de cycles)
Test 4 : si tu supprimes un module, le reste tient encore
Test 5 : si les specs d'un module changent, un seul module est modifié
```

Si un de ces tests échoue : la décomposition a un problème.

---

## LES 3 NIVEAUX D'UN SYSTÈME BIEN CONÇU

```
Niveau haut  : orchestration
(CombatLoop, Dashboard, CLI)
   |
   v
Niveau moyen : logique métier
(JutsuEngine, NinjaStats, VoteCounter)
   |
   v
Niveau bas  : données et utilitaires
(formules, constantes, helpers purs)

Règle : le code d'un niveau appelle le niveau en dessous
    jamais en sens inverse
    jamais en sautant un niveau
```

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
