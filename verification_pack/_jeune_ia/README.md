---
stability: stable
---

# Drill jeune d'IA : proof-of-work objectif

Ce dossier transforme la discipline "je code sans IA pendant N minutes"
en preuve tracable :

- `run_fasting_drill.sh <minutes> "<tache>"` : lance un chrono, force une
  checklist de fin, ecrit un log signe SHA-256 dans `~/.myfunnyjs/fasting.log`.
- La signature (contenu + horodatage UTC) permet de detecter
  a posteriori toute reponse riposte modifiee a la main dans le log.
- Recopiez signature + date dans `DEPENDENCY_LEDGER.md` a la racine du
  curriculum pour materialiser vos 4 checkpoints.

Usage :

```
bash verification_pack/_jeune_ia/run_fasting_drill.sh 45 "implementer LRU cache"
```

Reference pedagogique : `23_ai_native_dev/07_solo_vs_copilot_drill.md`
et `23_ai_native_dev/08_partition_drill.md`.
