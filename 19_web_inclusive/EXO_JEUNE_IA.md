---
stability: intemporel
---

# EXO [JEUNE IA] : 19_web_inclusive

Temps de lecture ~2 min


> Tag `[JEUNE IA]` : IA totalement coupee (Copilot/Claude/ChatGPT desactives).
> Duree : 45 min chrono. Auto-verifiable par le `verification_pack` du module.

## Consigne
Sans aucune assistance IA, sans autocompletion generative, resous le premier `drill` disponible dans `.internal/.tools/verification_pack/19_web_inclusive/`. Si aucun drill n'existe : redige de memoire un mini-exercice couvrant le concept-cle du module (definition, exemple minimal runnable, un piege classique), puis fais-le tourner via `verify.sh`.

## Critere de reussite (deterministe)
```bash
bash .internal/.tools/verification_pack/19_web_inclusive/verify.sh solution.js
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
L'accessibilite ne s'improvise pas au copier-coller d'aria-*. Sans IA, tu es oblige de raisonner sur ce que percoit vraiment un lecteur d'ecran ou un utilisateur clavier.

## Preuve tracable (proof-of-work)

L'auto-évaluation ci-dessus repose sur ton honnêteté. Pour une **preuve horodatée et signée** que tu as vraiment tenu le jeûne IA (chrono, checklist post-drill, SHA256 du code + horaire) :

```bash
bash .internal/.tools/verification_pack/_jeune_ia/run_fasting_drill.sh 45 "drill web_inclusive"
```

Le script chronomètre, refuse la triche silencieuse, et log dans `~/.myfunnyjs/fasting.log`. Utile pour toi-même (regarder ta courbe de progression) et pour un CTO qui te demande une preuve concrète.

---
stability: intemporel

## VERROU LOCK (obligatoire, principe generalise)

> Principe LOCK : interdiction de toucher au clavier tant que tu n'as pas
> ecrit ton plan d'attaque. Le meme verrou que dans le mini-projet 18 et
> dans `04_debugging/HYPOTHESES_*`. Il n'est pas negociable ici non plus.

Avant tout code :
1. Ecris ton `HYPOTHESES.md` (une phrase par hypothese, chaque hypothese
   testable en isolation).
2. Ecris le critere binaire de reussite (une commande, une sortie attendue).
3. Ensuite seulement, tu ouvres l'editeur.

Un exo `[JEUNE IA]` sans ces deux artefacts ecrits **avant** le premier
caractere de code est considere invalide par le `verification_pack`.
