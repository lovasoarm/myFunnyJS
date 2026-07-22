---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# 01 : AGENTS vs COPILOTES : la ligne de fracture

Temps de lecture ~15 min

Un copilote propose. Un agent exécute. Cette phrase est simple, elle cache la
ligne de fracture la plus violente de ta pratique 2026-2028. Le copilote reste
au niveau du geste : une complétion, une suggestion, une refonte de trois
lignes que tu acceptes ou refuses. L'agent, lui, prend une intention haute
("migre ce module de fetch vers ky", "ajoute l'auth JWT sur ces 8 routes")
et enchaîne 40 actions cohérentes entre elles. La cohérence de la chaîne
est le piège : quand une action foire, les 39 suivantes s'alignent
proprement sur l'erreur. Rien ne clignote.

```
COPILOTE                        AGENT AUTONOME
--------                        --------------
1 suggestion à la fois          40 actions d'affilée
tu valides chaque étape         tu valides le résultat global
erreur = ligne visible          erreur = cohérente sur 40 étapes
domaine : autocomplete          domaine : tâche multi-fichiers
coût cognitif : bas             coût cognitif : haut (audit ex-post)
rollback : Ctrl+Z               rollback : git revert + explication d'équipe
```

## Les 4 axes de décision

Avant de choisir, réponds honnêtement à ces quatre questions. Trois "oui"
minimum pour partir en agent. Sinon copilote, ou toi seul.

1. **Le succès est-il binaire et testable AVANT de lancer ?** Si le succès
   dépend de ton goût, du "c'est mieux comme ça", l'agent n'a rien contre
   quoi se caler. Il te rend un résultat plausible que tu n'auras aucun
   moyen de rejeter mécaniquement.
2. **Le scope est-il fermé ?** "Refactor ces 12 fichiers en pattern
   Repository" est fermé. "Améliore la lisibilité du module auth" est
   ouvert. Un agent sur scope ouvert dérive et gonfle le diff.
3. **Les Non-goals existent-ils ?** Si tu ne sais pas dire ce que l'agent
   n'a PAS le droit de toucher, tu ne connais pas assez la codebase pour
   déléguer. Cartographie d'abord (`30_mini_projects/10_legacy_dungeon`).
4. **L'audit ex-post est-il moins cher que l'exécution manuelle ?** Un
   agent qui te rend 40 actions à auditer prend souvent PLUS de temps qu'un
   toi qui code 20 actions. La délégation gagne quand la tâche est répétitive
   et vérifiable, pas quand elle est complexe et judgment-heavy.

## Quand utiliser lequel

| Situation                                   | Choix                           |
| ------------------------------------------- | ------------------------------- |
| Écrire un test unitaire connu               | Copilote                        |
| Refactor à 12 fichiers, spec claire         | Agent                           |
| Debug production critique                   | NI L'UN NI L'AUTRE seul         |
| Générer boilerplate                         | Copilote OU agent, indifférent  |
| Décision d'architecture                     | Toi. Point.                     |
| Migration de version majeure (React 18→19)  | Agent + audit systématique      |
| Prompt d'engineering sur ton propre système | Toi seul                        |
| Génération de fixtures pour 200 cas de test | Agent                           |
| Diagnostic d'un flaky test                  | Toi seul (l'agent va camoufler) |

## La règle d'or 2026-2028

Tu ne délègues à un agent QUE si tu peux écrire, AVANT l'exécution, le test qui
prouvera que le job est fait. Sans test préalable, ton agent devient un stagiaire
qui rend un PDF au lieu du code : il a l'air d'avoir bossé, mais tu ne peux rien
vérifier. Cette règle est têtue parce qu'elle inverse ton rôle : tu ne prompts
pas plus vite, tu spécifies plus dur. La spec devient le livrable premier,
le code devient un sous-produit.

## Le piège du "gain de vitesse"

Les métriques trompeuses : "j'ai livré une PR en 20 min au lieu d'une heure".
Vrai. Sauf que la PR contient 3 régressions silencieuses que tu paieras 6
mois plus tard, chacune 4h d'enquête. Bilan honnête : -1h aujourd'hui,
+12h dans le trimestre. L'ingénieur qui compte le gain de vitesse sans
compter la dette d'audit est un ingénieur qui te coûte cher.

Le bon indicateur, ce n'est pas la vélocité, c'est le **taux de reverts à
30 jours** sur les PR passées par agent. Si ce taux dépasse celui de tes PR
humaines de plus de 30 %, tu délègues trop.

## Exercice (20 min)

Prends une de tes tâches en cours. Écris :

1. La spec en 3 lignes.
2. Le test binaire qui prouvera le succès (commande shell qui renvoie 0/1).
3. Les 3 Non-goals (fichiers, modules, dépendances à ne pas toucher).
4. Ta décision : copilote / agent / toi seul, et pourquoi en une phrase.

Si tu ne peux pas écrire (2), tu ne peux pas déléguer à un agent. Fais-le toi.
Si tu ne peux pas écrire (3), tu ne connais pas assez la codebase. Fais-le
toi ET note dans ton `POSTMORTEM.md` personnel pourquoi tu ne connaissais pas.

## Ce que ce chapitre installe pour la suite

Les 6 chapitres suivants dérivent tous de cette ligne de fracture :

- ch. 02 : comment écrire une spec qu'un agent ne peut PAS mal interpréter.
- ch. 03 : comment lire ce qu'il a fait sans se faire embarquer par sa logique.
- ch. 04 : comment refuser proprement une trace conforme mais mauvaise.
- ch. 05 : comment l'empêcher techniquement de faire ce qu'il ne doit pas.
- ch. 06 : le grimoire : tous les motifs vus en prod, indexés par nature d'échec.
- ch. 07 : le gym : s'entraîner sur des traces hallucinées avant la vraie prod.

Copilote et agent ne sont pas deux outils ; ce sont deux niveaux de délégation.
Confondre les deux, c'est déléguer un scalpel comme si c'était un stylo.
