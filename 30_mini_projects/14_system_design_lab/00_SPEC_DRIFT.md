---
stability: intemporel
---

# SPEC DRIFT : 14_system_design_lab

Temps de lecture ~2 min


## Règle du jeu

À mi-parcours de ce mini-projet, la spec CHANGE. Volontairement. C'est le geste central.

## Contrainte imposée en cours de route

Au moment où tu as terminé la première itération (design + premier code), on t'annonce :

> "On passe de mono-tenant à multi-tenant. Le trafic sera 10x, les données doivent être isolées par client, et la latence P99 doit rester < 200ms."

## Ce que tu dois produire

1. Un **ADR supplémentaire** (`ADR/002_multi_tenant_pivot.md`) qui documente :
  - Le changement de contrainte.
  - Les options considérées (schema-per-tenant, row-level, DB-per-tenant).
  - Le choix retenu et pourquoi.
  - Ce qui casse dans la V1 et le plan de migration.

2. Une entrée dans `POSTMORTEM.md` : ce que tu aurais fait différemment en V1 sachant ça.

3. Un test de non-régression qui prouve que la V2 respecte la P99.

## Pourquoi ce drill

Les specs bougent. Les vraies. Un ingénieur qui rage-quit au premier changement de spec ne
survit pas 6 mois en équipe. Ce drill matérialise la résilience aux specs mouvantes.
