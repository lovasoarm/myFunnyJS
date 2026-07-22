---
stability: intemporel
---

# EXO [JEUNE IA] : 16_architecture_patterns

Temps de lecture ~2 min


> Tag `[JEUNE IA]` : IA totalement coupee (Copilot/Claude/ChatGPT desactives).
> Duree : 45 min chrono. Auto-verifiable par le `verification_pack` du module.
> Convention MyFunnyJS : le `drill_2` est le niveau intermediaire de chaque `verification_pack`, assez concret pour prouver la comprehension du concept-cle, sans etre un simple exercice de decouverte.

## Consigne
Sans aucune assistance IA, sans autocompletion generative, redige de memoire un mini-drill couvrant le concept-cle du module (definition d'une ligne, exemple minimal runnable, un piege classique qui casse). Ecris le critere binaire de reussite (une commande `node solution.js`, une sortie attendue exacte), puis lance-le.

## Critere de reussite (deterministe)
```bash
node solution.js
# doit afficher exactement : drill 2 OK
```
Binaire : soit la sortie matche caractere pour caractere, soit non. Pas de zone grise. Ecris toi-meme le `console.log('drill 2 OK')` final quand ton drill valide toutes ses assertions internes.

## Livrable
- ta `solution.js` (aucun import IA, aucune completion generative acceptee).
- capture d'ecran de ton editeur avec Copilot/IA off.
- ton `HYPOTHESES.md` si tu as bloque > 10 min.
- ton `TDD_JOURNAL.md` optionnel : temps ecoule, blocages, ce que tu as du re-comprendre.

## Auto-evaluation (a cocher honnetement)
- [ ] IA coupee de bout en bout (0 completion, 0 chat).
- [ ] critere binaire passe en < 45 min.
- [ ] Je peux expliquer le concept a un debutant en 3 minutes, sans notes.

## Pourquoi c'est vital
Coder a la main l'inversion de dependance (drill_2_dependency_inversion), c'est prouver que tu tiens la separation domaine/infra. Sans IA, tu ne peux plus cacher un couplage derriere une abstraction cosmetique.

## Preuve tracable (proof-of-work)

L'auto-evaluation ci-dessus repose sur ton honnetete. Pour transformer ca en preuve horodatee : demarre un chrono visible (`date` avant + `date` apres), colle les deux timestamps + un SHA256 de ta solution (`shasum -a 256 solution.js`) dans un fichier `FASTING.md` a cote de la solution. C'est ta ligne de progression : relis-la dans 3 mois pour voir la courbe.

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
