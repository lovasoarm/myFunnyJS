# EXO [JEUNE IA] : 10_algorithms

Temps de lecture ~2 min


> Tag `[JEUNE IA]` : IA totalement coupee (Copilot/Claude/ChatGPT desactives).
> Duree : 45 min chrono. Auto-verifiable par le `verification_pack` du module.
> Convention MyFunnyJS : le `drill_2` est le niveau intermediaire de chaque `verification_pack`, assez concret pour prouver la comprehension du concept-cle, sans etre un simple exercice de decouverte.

## Consigne
Sans aucune assistance IA, sans autocompletion generative, resous le `drill_2` du `verification_pack` de ce module. Si aucun drill n'existe : redige de memoire un mini-exercice couvrant le concept-cle du module (definition, exemple minimal runnable, un piege classique), puis fais-le tourner via `verify.sh`.

## Critere de reussite (deterministe)
```bash
bash verification_pack/10_algorithms/verify.sh solution.js
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
Reecrire un tri, une recherche binaire ou un parcours de graphe sans IA, c'est verifier que tu peux raisonner sur la complexite au lieu de reciter un pattern. C'est la difference entre passer un test et comprendre pourquoi il passe.
---
stability: intemporel
