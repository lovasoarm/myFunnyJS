---
stability: intemporel
---

# ADR-001 : pourquoi ce code est ce qu'il est
Temps de lecture ~7 min

## Statut

À remplir par toi : `Brouillon` pendant l'investigation, `Rempli` une fois fini.

## Comment utiliser ce template

Ce n'est pas un ADR que tu écris en train de coder. C'est un ADR que tu écris en train de LIRE le code de quelqu'un d'autre, après coup. La structure (Contexte / Décision / Alternatives / Conséquences) reste la même que pour tes propres ADR des 9 autres mini-projets. Ce qui change : tu ne connais pas le contexte, tu le DÉDUIS d'indices visibles dans le code.

Indices à chercher avant de remplir :
```
- date des premiers commits du fichier concerné (git log --follow <fichier>)
- présence ou absence de TypeScript à cette époque-là du projet
- commentaires qui ont survécu, même obsolètes : ils datent souvent une intention
- noms de fonctions ou de variables qui trahissent une convention d'une autre époque
- la doc officielle du projet, le CHANGELOG.md s'il existe : parfois la décision
 y est carrément expliquée, et c'est une victoire de l'avoir trouvée
```

Remplace tout ce qui suit par TON repo, TA décision identifiée. Ce qui est écrit ci-dessous est un exemple rempli pour te montrer le niveau attendu, basé sur un cas réel et public : pas une commande à copier-coller, un modèle de raisonnement.

---

## EXEMPLE REMPLI (à titre d'illustration : remplace tout par ton propre repo)

## ADR-001 : pourquoi Express gère encore les erreurs avec un callback `next(err)` plutôt qu'avec des exceptions natives async/await

## Statut

Décision identifiée par lecture rétrospective : 2026.
(la décision originale du projet Express remonte à bien avant cette date : c'est précisément le sujet de cette ADR)

## Contexte

En lisant `lib/router/route.js` du dépôt Express, je repère que toute la gestion d'erreur du framework passe par un appel explicite `next(err)`, pas par des `throw` capturés via `try/catch` autour d'`await`. N'importe quel handler de route qui lève une exception dans une fonction `async` sans l'attraper lui-même : Express ne la voit pas. Elle finit en `UnhandledPromiseRejection`, pas en réponse HTTP 500 propre.

Indices qui permettent de dater cette décision :
- la syntaxe `async/await` n'existe en JS natif que depuis ES2017 (Node 7.6+)
- les fondations du routeur Express remontent à une époque où Node ne supportait que les callbacks et les Promises manuelles
- le code montre un pattern de callback error-first (`function(err, req, res, next)`) cohérent avec les conventions Node pré-2017, pas avec un style moderne

## Décision (déduite, pas la mienne)

Express a fait le choix de garder un système de gestion d'erreur basé sur un callback explicite `next(err)`, plutôt que de migrer vers une capture automatique des erreurs async. Ce choix n'a pas été révisé en profondeur même après l'arrivée d'async/await dans l'écosystème Node, parce que changer ce mécanisme casserait la compatibilité avec des millions de middlewares déjà écrits dans l'ancien style.

## Alternatives qu'ils auraient pu prendre (déduites du contexte, pas confirmées par les auteurs)

1. **Réécrire le système de gestion d'erreur pour wrapper automatiquement chaque handler async** : viable techniquement, mais casserait la compatibilité avec l'écosystème de middlewares existants qui dépendent du pattern `next(err)` actuel.
2. **Sortir une version majeure avec breaking change assumé** : Express a une base d'utilisateurs en production sur des millions de projets. Une v5 qui change ce mécanisme fondamental obligerait une migration manuelle massive.
3. **Documenter le piège plutôt que le corriger** (ce qui semble être l'approche réelle) : la documentation officielle d'Express explique explicitement qu'il faut wrapper ses handlers async ou utiliser un middleware tiers pour capturer les erreurs automatiquement.

## Conséquences

Positives (pour l'époque où la décision a été prise) :
- compatibilité totale avec l'immense écosystème de middlewares Express déjà écrits
- pas de breaking change qui forcerait une migration douloureuse pour des millions de projets en production
- le mécanisme reste simple à comprendre une fois qu'on le connaît : un seul pattern, pas de magie cachée

Négatives (visibles aujourd'hui, en 2026, avec du recul) :
- un développeur qui découvre Express aujourd'hui s'attend à ce qu'un `throw` dans une fonction `async` soit capturé automatiquement, comme c'est le cas dans la plupart des frameworks plus récents
- ce piège est une source connue de bugs en production : une erreur async non wrappée plante silencieusement au lieu de renvoyer une réponse HTTP propre
- la solution officielle (wrapper manuel ou middleware tiers) ajoute une couche de boilerplate (code répétitif) que les frameworks plus jeunes ont évité en concevant ce mécanisme dès le départ avec async/await en tête

## Si cette décision était prise aujourd'hui, avec les outils de 2026 ?

Non, probablement pas de la même façon. Un framework conçu en 2026 partirait directement d'async/await comme modèle natif de gestion des erreurs, pas comme une extension ajoutée après coup à un système de callbacks. Le compromis "compatibilité avec l'historique" qui justifiait ce choix en a fait une dette technique visible : à un moment, le coût de la rétrocompatibilité dépasse les avantages, mais Express ne peut quasiment jamais traverser ce seuil sans casser une partie massive de son écosystème.

C'est exactement ce que `27_team_craft/02_adr_writing.md` enseigne sur les conséquences négatives d'une ADR : elles ne sont pas une erreur de jugement au moment où la décision a été prise. Elles sont le prix qu'on accepte de payer plus tard pour un bénéfice obtenu plus tôt.

---

## TON ADR (remplace tout ci-dessus par ton repo et ta décision)

## Contexte

(à remplir)

## Décision (déduite, pas la tienne)

(à remplir)

## Alternatives qu'ils auraient pu prendre (déduites)

(à remplir)

## Conséquences

Positives :
(à remplir)

Négatives :
(à remplir)

## Si cette décision était prise aujourd'hui, avec les outils de 2026 ?

(à remplir)
