---
perennite: intemporel
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Pure functions, immutabilité, composition : paradigme durable.
---
> **Statut de pérennité :** **intemporel** | évolutif | périssable
> Statut effectif de ce module : **intemporel**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : fonctions higher-order (01_fundamentals), immutabilité (01_fundamentals). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : FUNCTIONAL JS

> **Durée de vie : intemporel.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.
Temps de lecture ~7 min

Tu as déjà passé une heure à chercher pourquoi une donnée changeait toute seule, sans qu'aucune ligne de ton code ne semble la toucher directement. Le vrai coupable, presque toujours : une mutation cachée, un objet partagé entre deux fonctions qui se modifient l'une l'autre sans le savoir.

La programmation fonctionnelle ne te demande pas de devenir mathématicien. Elle te demande une seule chose : arrête de muter l'état (state) en silence, et ton code devient prévisible.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Le bug le plus difficile à tracer en JS n'est pas une erreur de syntaxe : c'est une mutation d'objet partagé. Deux fonctions reçoivent la même référence vers le même objet, l'une le modifie, et l'autre se retrouve avec une donnée différente de celle qu'elle attendait, sans qu'aucune erreur ne soit levée. Le bug se manifeste loin de sa cause réelle, ce qui rend le debugging infernal.

La programmation fonctionnelle (FP : functional programming) attaque ce problème à la racine avec deux règles simples : une fonction pure retourne toujours le même résultat pour les mêmes arguments, sans jamais modifier quoi que ce soit en dehors d'elle-même ; et l'immutabilité (immutability) interdit de muter une donnée existante : on en crée une nouvelle à chaque changement.

Avec ces deux règles respectées, un bug devient traçable : si une fonction est pure, le bug ne peut venir que de ses arguments d'entrée, jamais d'un effet de bord caché ailleurs dans le code. Tu réduis l'espace de recherche du bug de "partout dans l'app" à "cette fonction précise, avec ces arguments précis".

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui mute tout sans discipline crée des bugs fantômes : une fonction censée juste "lire" une donnée la modifie en passant, et une autre partie de l'app, complètement déconnectée, en subit les conséquences trois écrans plus loin. Dans `01_rasengan_engine`, si les stats de chakra d'un ninja sont mutées directement au lieu de produire un nouvel état à chaque tour, deux jutsus exécutés en parallèle peuvent lire des valeurs incohérentes sans qu'aucune erreur ne prévienne. Le combat calcule des dégâts faux. Silencieusement.

Sur des apps avec gestion d'état complexe (state management), l'absence de rigueur fonctionnelle transforme chaque feature en risque : ajouter un nouveau composant qui lit un état partagé peut casser silencieusement un composant existant qui dépendait de ce même état restant intact.

Les tests aussi en pâtissent directement : une fonction qui mute ses arguments ou qui dépend d'un état externe est quasiment impossible à tester de façon fiable, parce que le résultat dépend du contexte d'exécution, pas seulement des arguments passés.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
state d'une UI (React, Vue, vanilla JS)    --> mutation directe  --> bug de rendu impossible à tracer
transformation de liste de données       --> map/filter/reduce --> pipeline sans effet de bord
configuration partagée entre modules      --> immutabilité    --> aucun module ne corrompt les autres
fonction de calcul réutilisée partout      --> fonction pure   --> testable isolément, sans piège
construction de comportements combinables    --> composition    --> fonctions assemblées en pipeline
```

Le pattern fonctionnel n'est pas une lubie académique : c'est la base de la gestion d'état dans des bibliothèques modernes. Redux, par exemple, repose entièrement sur l'immutabilité. Et `map`, `filter`, `reduce` sont devenus les outils par défaut pour transformer des données en JS moderne pour exactement cette raison.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Le paradigme fonctionnel est intemporel, mais son adoption massive en JS est plus récente, portée par la complexité grandissante des apps front-end et le besoin de prévisibilité dans la gestion d'état.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, le JS courant mutait allègrement : on modifiait des objets et des tableaux directement, sans trop se poser de questions, parce que les apps étaient plus simples et les bugs de mutation moins fréquents à petite échelle. Avec la montée des SPA (single page applications) complexes et des frameworks réactifs, la mutation incontrôlée est passée de "bonne pratique optionnelle" à quasi-standard de la gestion d'état moderne.

Le spread operator (`...`) et les méthodes comme `Object.freeze` ont rendu l'immutabilité beaucoup plus simple à appliquer qu'avant, où il fallait cloner manuellement chaque objet avec des boucles ou des bibliothèques externes.

---

## 6) NOYAU DUR DU MÉTIER ?

Indirectement essentiel : `11_functional_js` dépend de `01_fundamentals/03_functions`, et devient à son tour le prérequis direct de `12_design_patterns`. Beaucoup de design patterns modernes (Strategy, par exemple) s'appuient sur des fonctions traitées comme des valeurs interchangeables, ce qui est un réflexe purement fonctionnel.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Plus les apps deviennent complexes, plus la prévisibilité devient précieuse. Une fonction pure reste une fonction pure peu importe le framework qui l'entoure. Apprendre à coder sans effets de bord cachés, c'est apprendre à écrire du code que n'importe quel dev : toi inclus, six mois plus tard : peut comprendre sans reconstruire tout le contexte d'exécution dans sa tête.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

La mutation incontrôlée est la source silencieuse de la majorité des bugs difficiles à tracer en JS. Ce module te donne les outils pour l'éliminer : fonctions pures, immutabilité, composition. Sans cette discipline, ton code fonctionne jusqu'à ce qu'il ne fonctionne plus : sans que personne ne sache pourquoi.

Maintenant, ouvre `01_pure_functions.md`. Et arrête de laisser tes fonctions changer des choses dans ton dos.

## AILLEURS QUE JS

En Python, `map`/`filter`/`functools.reduce` et les compréhensions offrent le même style ; les fonctions sont des objets de première classe. En Haskell, la pureté et l'immutabilité sont la norme, pas une discipline optionnelle. En Rust, les itérateurs paresseux (`iter().map().filter().collect()`) poussent la composition encore plus loin. Le concept (transformer sans muter) traverse les langages.
