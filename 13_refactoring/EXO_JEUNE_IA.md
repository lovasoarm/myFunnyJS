# EXO [JEUNE IA] : 13_refactoring

Temps de lecture ~2 min


> Tag `[JEUNE IA]` : IA totalement coupee (Copilot/Claude/ChatGPT desactives).
> Duree : 45 min chrono. Auto-verifiable par le `verification_pack` du module.

## Consigne
Sans aucune assistance IA, sans autocompletion generative, resous le premier `drill` disponible dans `.tools/verification_pack/13_refactoring/`. Si aucun drill n'existe : redige de memoire un mini-exercice couvrant le concept-cle du module (definition, exemple minimal runnable, un piege classique), puis fais-le tourner via `verify.sh`.

## Critere de reussite (deterministe)
```bash
bash .tools/verification_pack/13_refactoring/verify.sh solution.js
# doit sortir avec code 0 et afficher "OK"
```
Binaire : soit `verify.sh` passe, soit non. Pas de zone grise.

## Preuve a livrer
- ta `solution.js` (aucun import IA, aucune completion generative acceptee).
- capture d'ecran de ton editeur avec Copilot/IA off.
- ton `HYPOTHESES.md` si tu as bloque > 10 min.
- ton `TDD_JOURNAL.md` optionnel : temps ecoule, blocages, ce que tu as du re-comprendre.

## Auto-evaluation (a cocher honnetement)
- [ ] IA coupee de bout en bout (0 completion, 0 chat).
- [ ] `verify.sh` passe en < 45 min.
- [ ] Je peux expliquer le concept a un debutant en 3 minutes, sans notes.

## Pourquoi c'est vital
Refactorer, c'est nommer un code smell avant de le corriger. L'IA sait reecrire ; elle ne sait pas dire pourquoi le code de depart etait mauvais. Ce jeune IA te force a faire l'audit avant l'action.

## Preuve tracable (proof-of-work)

L'auto-évaluation ci-dessus repose sur ton honnêteté. Pour une **preuve horodatée et signée** que tu as vraiment tenu le jeûne IA (chrono, checklist post-drill, SHA256 du code + horaire) :

```bash
bash .tools/verification_pack/_jeune_ia/run_fasting_drill.sh 45 "drill refactoring"
```

Le script chronomètre, refuse la triche silencieuse, et log dans `~/.myfunnyjs/fasting.log`. Utile pour toi-même (regarder ta courbe de progression) et pour un CTO qui te demande une preuve concrète.

---
stability: intemporel
