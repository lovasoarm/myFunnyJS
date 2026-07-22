---
perennite: intemporel
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: La méthode scientifique de debug ne dépend d'aucun outil.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : stack trace (01_fundamentals), async & event loop (03_async). Exceptions (05_error_handling anticipé) : tu croiseras `try`/`catch` avant de l'avoir formellement étudié, ce module te donne juste assez pour lire une stack trace, pas pour maîtriser la gestion d'erreur en profondeur. Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# 00 : Pourquoi le debugging

Temps de lecture ~4 min


> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

> Principe universel : un bug n'est pas résolu tant que tu ne peux pas le reproduire à la demande, puis l'expliquer. Vrai en JS, en Rust, en SQL, en réseau, en prod à 3h du matin.

## Le problème que ce module résout

La plupart des devs ne débuggent pas : ils bricolent. Ils changent une ligne au hasard, rechargent, prient, recommencent. Ça marche parfois, par accident, et le vrai bug reste tapi dans l'ombre comme un Horror dans Garo : invisible, patient, prêt à ressortir en production quand un vrai shinobi passe.

Ce module installe une méthode : un bug est un puzzle avec une solution garantie, pas une malédiction.

## Qui souffre quand personne ne sait débugger

- L'équipe : un bug non reproduit revient, encore et encore, et bouffe des sprints entiers.
- Le client : il perd confiance après le troisième "on a corrigé" suivi d'un quatrième incident.
- Toi : tu passes tes nuits à changer des lignes au pif au lieu de dormir.

## Où ça vit dans un vrai système

Le debugging n'est pas une étape après le code : c'est un mode de pensée présent partout. Dans les logs d'une API, dans une stack trace d'un worker qui crash, dans un query plan SQL trop lent, dans un heap snapshot qui gonfle, dans un `git bisect` qui traque le commit fautif. Un ingénieur passe plus de temps à lire du code cassé qu'à écrire du code neuf.

## Ce que ce module attaque frontalement

- La panique face à une stack trace : tu apprends à la lire comme un plan de métro, de la station "erreur" jusqu'à la station "cause".
- Le "je change au hasard jusqu'à ce que ça marche" : remplacé par des hypothèses réfutables.
- Le fix qui masque le vrai bug : soigner le symptôme sans toucher la maladie, c'est mettre un pansement sur une fracture.

## Ce que tu vas installer

1. Lire une stack trace comme un plan de métro : point d'entrée, frames, ligne fautive.
2. Formuler des hypothèses réfutables AVANT de toucher au code, et les consigner dans un `HYPOTHESES.md`.
3. Reproduire un bug de manière déterministe avant de le corriger. Pas de repro, pas de fix.
4. Débugger à l'aveugle : trouver la cause sans même voir la ligne fautive, par élimination.
5. Utiliser les bons outils : breakpoints, `console` structuré, bisection, logs corrélés par id.

## Bugs célèbres : ce que l'histoire enseigne

- Ariane 5 (1996) : une conversion de nombre 64 bits vers 16 bits qui déborde, et une fusée à 370 millions de dollars explose. Leçon : un edge case non testé n'est pas "improbable", il est "pas encore arrivé". Comme une technique interdite : elle tient jusqu'au jour où quelqu'un trouve la faille.
- Knight Capital (2012) : un vieux flag de code mort réactivé par erreur, 440 millions de dollars perdus en 45 minutes. Leçon : le code que tu ne comprends plus est une bombe à retardement. Comme un jutsu interdit oublié dans un parchemin : personne ne sait ce qu'il déclenche.

## Modern / legacy / intemporel

- Moderne : source maps, time-travel debugging, observabilité distribuée avec `trace_id`.
- Legacy : `console.log` partout, et parfois c'est encore la façon la plus rapide.
- Intemporel : la méthode. Reproduire, isoler, formuler une hypothèse, tester une variable à la fois, vérifier. Ça ne périme jamais.

## Prérequis

- Savoir lire une erreur JS de base (module `05_error_handling`).
- Connaître l'event loop pour les bugs async (module `03_async`).
- Un terminal et un debugger Node configurés (voir `00_prereq_check.md`).

## Erreurs classiques de débutant

- Changer plusieurs choses à la fois : quand ça marche, tu ne sais pas laquelle a corrigé.
- Corriger sans reproduire : tu "corriges" un bug qui n'existait peut-être pas.
- Faire confiance à ton intuition plutôt qu'à la preuve : le bug est presque toujours là où tu es sûr qu'il n'est pas.

## Idées reçues à tuer

- "Les bons devs ne font pas de bugs." Faux. Les bons devs les trouvent vite.
- "Il faut être un génie pour débugger." Faux. Il faut une méthode et de la discipline.
- "Le debugger, c'est pour les débutants." Faux. `console.log` en aveugle sur un bug async, ça, c'est amateur.

## Alternatives et compromis

Prévenir plutôt que guérir : tests, types, revue de code réduisent le nombre de bugs, mais n'en éliminent jamais la totalité. Le debugging reste le filet de sécurité ultime. Le compromis : plus tu investis en amont (tests, types), moins tu débugges en aval, mais tu ne descends jamais à zéro.

## À la fin du module

Tu passes de "j'ai peur des bugs" à "un bug est un puzzle avec une solution garantie". Et pour chaque exercice, tu livreras un `HYPOTHESES.md` : la preuve que tu as pensé avant de coder.

---

> Pour tout exercice de debugging : utilise le template [`HYPOTHESES_TEMPLATE.md`](./16_HYPOTHESES_TEMPLATE.md). Pas de correction sans hypothèse écrite.
