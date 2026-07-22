---
stability: intemporel
---

# RFC simulation : soumets une décision technique
Temps de lecture ~5 min

> **INTEMPOREL** : la capacité à écrire, défendre et amender une RFC survit
> aux frameworks, aux langages et aux tendances managériales.

## Rappel : c'est quoi une RFC ?

*Request For Comments*. Un document court (2-5 pages) qui propose un
changement significatif : nouvelle dépendance, refonte d'un module, migration
d'infra. Publié pour être **commenté avant** l'implémentation.

Différence avec un ADR (`02_adr_writing.md`) :
- RFC = **proposition ouverte au débat**, avant décision.
- ADR = **décision figée**, après débat, pour la mémoire.

## Structure imposée

```md
# RFC XXX : <titre>
- Auteur, date, statut (Draft / Under Review / Accepted / Rejected)
- Contexte (2 §)
- Problème (1 §, précis, mesurable)
- Proposition (schéma + description)
- Alternatives considérées (2 minimum) + pourquoi rejetées
- Impact (perf, sécurité, coûts, DX, migration)
- Risques + plan de mitigation
- Décision demandée (Go / No-Go / More data)
```

## Exercice (obligatoire)

### Round 1 : propose

Choisis un vrai sujet (ex: "Passer de Express à Fastify", "Ajouter Redis",
"Introduire TypeScript strict"). Rédige la RFC selon la structure ci-dessus.
Contrainte : **2 alternatives obligatoires**, une doit être "ne rien faire".

### Round 2 : challenge

Trouve un pair (ou un dev senior sur Discord, Twitter, IRL). Il joue
l'opposant : il doit trouver **3 objections sérieuses**. Note-les.

### Round 3 : amende

Réécris la RFC en intégrant les objections : soit tu les réfutes avec
données, soit tu ajustes la proposition. **Ne les cache pas.**

### Round 4 : décision

Écris la section "Décision demandée" comme si tu la présentais à un CTO :
- 3 chiffres qui appuient,
- 1 risque assumé,
- 1 sortie de secours si ça casse.

## Livrable

- `rfc/001-<titre>.md` (rounds 1 → 3 en `git diff` visibles),
- `DECISION.md` (round 4, 1 page).

## (attention) Ce que l'analogie "documenter c'est perdre du temps" cache

Une RFC bien écrite **remplace** 5 réunions. Le temps investi à l'écrit est
gagné en aval : moins d'ambiguïtés, moins de re-débats, plus rapide à
onboarder les nouveaux.
