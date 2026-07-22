---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# EXO : partitionne ce backlog entre toi et l'IA (9.5 / 17.5)

Temps de lecture ~2 min


## Contexte
On te livre 10 tickets a implementer en 1 semaine. Tu dois decider ce que tu delegues a l'IA et ce que tu gardes.

## Backlog (extrait)
1. Migrer un endpoint REST vers v2 (breaking).
2. Ajouter un log structure a 3 handlers.
3. Reproduire un data race intermittent en prod.
4. Ecrire un test e2e pour un flow tribut.
5. Renommer 42 variables `foo_bar` en `fooBar`.
6. Choisir entre SQLite / Postgres pour un nouveau service.
7. Ecrire la doc onboarding.
8. Corriger 12 typos dans les README.
9. Debugger une fuite memoire silencieuse.
10. Repondre a un audit de securite.

## Consigne
Produis `PARTITION.md` avec :
- colonne HUMAIN / colonne IA / colonne HUMAIN+IA (revu par toi).
- pour chaque ticket delegue a l'IA : le **critere de controle** (test, oracle, revue, ADR).
- justification en 1 phrase par ticket.

## Regle non negociable
Aucun ticket "haute cause racine" (3, 6, 9, 10) ne peut aller en pur IA. Explique pourquoi.

## Auto-verification
Pair review : demande a un pair de faire la meme partition en aveugle. Comparez. Argumentez les ecarts.
