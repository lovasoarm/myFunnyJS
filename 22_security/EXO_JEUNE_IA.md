# EXO [JEUNE IA] : 22_security

Temps de lecture ~2 min


> Tag `[JEUNE IA]` : IA totalement coupee (Copilot/Claude/ChatGPT desactives).
> Duree : 45 min chrono. Auto-verifiable par le `verification_pack` du module.
> Convention MyFunnyJS : le `drill_2` est le niveau intermediaire de chaque `verification_pack`, assez concret pour prouver la comprehension du concept-cle, sans etre un simple exercice de decouverte.

## Consigne
Sans aucune assistance IA, sans autocompletion generative, resous le `drill_2` du `verification_pack` de ce module. Si aucun drill n'existe : redige de memoire un mini-exercice couvrant le concept-cle du module (definition, exemple minimal runnable, un piege classique), puis fais-le tourner via `verify.sh`.

## Critere de reussite (deterministe)
```bash
bash .tools/verification_pack/22_security/verify.sh solution.js
# doit afficher : drill 2 OK
```
Binaire : soit `verify.sh` passe, soit non. Pas de zone grise.

## Livrable
- ta `solution.js` (aucun import IA, aucune completion generative acceptee).
- capture d'ecran de ton editeur avec Copilot/IA off.
- ton `HYPOTHESES.md` si tu as bloque > 10 min.
- ton `TDD_JOURNAL.md` optionnel : temps ecoule, blocages, ce que tu as du re-comprendre.

## Auto-evaluation (a cocher honnetement)
- [ ] IA coupee de bout en bout (0 completion, 0 chat).
- [ ] `verify.sh` passe en < 45 min.
- [ ] Je peux expliquer le concept a un debutant en 3 minutes, sans notes.

## Pourquoi c'est vital
Coder a la main un check timing-safe (drill_2_timing_safe), c'est prouver que tu sais pourquoi un `===` sur un token est deja une faille. Sans ce reflexe interiorise, l'IA te generera un code vulnerable par defaut.

## Preuve tracable (proof-of-work)

L'auto-évaluation ci-dessus repose sur ton honnêteté. Pour une **preuve horodatée et signée** que tu as vraiment tenu le jeûne IA (chrono, checklist post-drill, SHA256 du code + horaire) :

```bash
bash .tools/verification_pack/_jeune_ia/run_fasting_drill.sh 45 "drill security"
```

Le script chronomètre, refuse la triche silencieuse, et log dans `~/.myfunnyjs/fasting.log`. Utile pour toi-même (regarder ta courbe de progression) et pour un CTO qui te demande une preuve concrète.

---
stability: stable
