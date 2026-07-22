---
stability: intemporel
---

# SPEC DRIFT : la specification change en cours de projet
-> ~30 min sur ce fichier + relance du mini-projet

## Le principe

En vrai, une spec ne bouge jamais "avant" que tu commences. Elle bouge
**au milieu**, apres que tu as deja pris des decisions. Ce fichier reproduit
cette experience volontairement, pour t'entrainer a **encaisser un pivot
sans tout jeter**.

## Le pivot impose

Tu as lance le `walking_dead_protocol` avec ces hypotheses initiales :
- traitement synchrone (une horde a la fois) ;
- persistance en JSON local ;
- 1 seul survivant a tracer.

Nouvelle contrainte, imposee au milieu (ex : sprint J+3) :
- 20 hordes en parallele, ordonnancees par priorite ;
- persistance dans un event log append-only ;
- N survivants (N > 100).

## Ce qu'on attend de toi

1. **Ne jette pas ton code**. Lis-le d'abord. Cartographie (voir
   `31_annexes/00_cartographier_codebase_inconnue.md`).
2. **Ecris une ADR** dans `ADR/` : "impact du drift, ce que je garde, ce
   que je jette, pourquoi".
3. **Ecris une hypothese** dans `HYPOTHESES.md` local :
   - "je pense que le passage a l'async cassera X sans toucher Y" ;
   - falsifie en < 2h par un test de repro.
4. **Journalise** dans `TDD_JOURNAL.md` chaque etape du pivot avec
   horodatage et cout mental (echelle 1-5).
5. **POSTMORTEM** en fin de sprint : ce que le pivot t'a appris sur ton
   couplage initial.

## Verdict

Tu passes le drill si :
- tu peux montrer une ADR datee **posterieure** au premier commit ;
- ton code final gere les 20 hordes en < 2x le temps initial ;
- ton POSTMORTEM cite **au moins une decision initiale que le drift a
  revelee dangereuse** (couplage cache, etat global, absence
  d'abstraction I/O).

## Ou l'analogie casse

On appelle ca "drift", comme si la spec derivait passivement. En vrai
quelqu'un l'a change, avec une raison. Demande la **raison** avant
d'attaquer le pivot : parfois le vrai fix est de negocier la contrainte.
