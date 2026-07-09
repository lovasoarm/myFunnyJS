---
stability: intemporel
---

# 03 OBJECTION STORM — défense orale sous objection dynamique

Temps ~35 min chrono + 15 min debrief

## POURQUOI CE DRILL EXISTE

`01_desaccord_cto.md` et `02_mock_interview_async.md` entraînent la défense écrite,
au calme, sans coupure. En vrai, l'objection coupe la parole, tourne, mute en attaque
personnelle. Ce drill simule ça.

## PROTOCOLE — 5 SALVES × 5 OBJECTIONS

Chronomètre visible, non négociable.

- **60 s max par réponse** (au-delà, la réponse ne compte pas).
- **Écart max 90 s entre deux réponses** (au-delà, la salve est rompue).
- **Réponse minimum 40 mots** pour être valide.
- **Livrable : `REPONSES.md`** avec 25 blocs, chacun préfixé par un timestamp ISO 8601.

### Escalade obligatoire (une salve = un ton)

1. **Salve 1 — Poli** : "j'entends, mais est-ce que…"
2. **Salve 2 — Dubitatif** : "tu es sûr ? Ça me paraît fragile."
3. **Salve 3 — Hostile** : "non, ça ne marche pas, tu bricoles."
4. **Salve 4 — Ad hominem technique** : "tu confonds X et Y, c'est un niveau junior."
5. **Salve 5 — Coupure** : "on n'a plus le temps, résume en 20 s ou passe."

Objectif : **ne pas escalader émotionnellement**. Rester factuel salve 5 = drill réussi.

## LIEN AVEC LES ADR (chantier #1)

Chaque ADR d'un projet doit produire **2 objections dans le storm**.
17 projets × 3-6 ADR × 2 objections >> 25 : il y a de quoi faire.

## FORMAT `REPONSES.md`

```
## Salve 1 / Objection 1
2026-07-09T14:03:22Z
[réponse >= 40 mots]

## Salve 1 / Objection 2
2026-07-09T14:04:11Z
[...]
```

## SCORING

Passage automatique via `.tools/verification_pack/31_annexes/objection_storm.sh` :

- 25 timestamps valides ISO 8601 : requis.
- Écart max entre deux timestamps consécutifs : 90 s.
- Chaque réponse : >= 40 mots.
- Score = nombre de réponses valides sur 25.
- **Refus de release si score < 20/25.**

## APRÈS

Debrief 15 min : quelle salve t'a fait décrocher, quelle objection était méritée,
laquelle relevait du théâtre. Note dans `REPONSES.md` un `## Debrief` final.
