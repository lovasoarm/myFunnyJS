# 01 : AGENTS vs COPILOTES : la ligne de fracture
Temps de lecture ~15 min

```
COPILOTE               AGENT AUTONOME
--------               --------------
1 suggestion à la fois        40 actions d'affilée
tu valides chaque étape        tu valides le résultat global
erreur = ligne visible        erreur = cohérente sur 40 étapes
domaine : autocomplete        domaine : tâche multi-fichiers
coût cognitif : bas          coût cognitif : haut (audit ex-post)
```

## Quand utiliser lequel

| Situation                | Choix             |
|------------------------------------------|--------------------------------|
| Écrire un test unitaire connu      | Copilote            |
| Refactor à 12 fichiers, spec claire   | Agent             |
| Debug production critique        | NI L'UN NI L'AUTRE seul    |
| Générer boilerplate           | Copilote OU agent, indifférent |
| Décision d'architecture         | Toi. Point.          |
| Migration de version majeure (React 18→19) | Agent + audit systématique  |

## La règle d'or 2026-2028

Tu ne délègues à un agent QUE si tu peux écrire, AVANT l'exécution, le test qui
prouvera que le job est fait. Sans test préalable, ton agent devient un stagiaire
qui rend un PDF au lieu du code : il a l'air d'avoir bossé, mais tu ne peux rien
vérifier.

## Exercice (20 min)

Prends une de tes tâches en cours. Écris :
1. La spec en 3 lignes.
2. Le test binaire qui prouvera le succès.
3. Ta décision : copilote / agent / toi seul.

Si tu ne peux pas écrire (2), tu ne peux pas déléguer à un agent. Fais-le toi.
