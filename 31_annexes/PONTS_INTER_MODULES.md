---
stability: intemporel
---

# PONTS INTER-MODULES : choix éditorial

Temps de lecture ~3 min

> Note de structure. Rien à apprendre ici. À lire seulement si tu t'es
> demandé "pourquoi certains modules ont un fichier `99_PONT_*` et pas
> les autres ?"

## LE CHOIX

Cinq transitions entre modules ont un fichier `99_PONT_*.md` dédié :

- `01_fundamentals` → `03_async`
- `03_async` → `08_memory_performance`
- `07_math_basics` → `08_memory_performance`
- `11_functional_js` → `12_design_patterns`
- `28_edge_cases` → `29_ai_agents_and_autonomy`

Les autres transitions n'en ont pas. Ce n'est pas un oubli : c'est un choix assumé.

## POURQUOI PAS UN PONT PARTOUT

Un pont entre chaque module, ça reviendrait à écrire 31 petits fichiers de transition sur 32 modules. Le curriculum deviendrait bavard : 90 % de ces ponts diraient la même chose ("tu viens de finir X, tu vas commencer Y, respire"). Le lecteur les sauterait au bout du deuxième : et à ce moment-là, le mécanisme perd sa force partout, y compris là où il compte vraiment.

## POURQUOI UN PONT ICI, PAS AILLEURS

Les cinq ponts existants marquent des **sauts de nature**, pas des progressions linéaires. On ne passe pas d'un thème à un thème voisin : on change de registre.

- `01 → 03` : de la syntaxe séquentielle à la concurrence. Le mental doit basculer.
- `03 → 08` et `07 → 08` : du monde des opérations au monde des ressources. La mesure remplace l'exécution.
- `11 → 12` : de la manipulation de fonctions à la manipulation de structures d'objets. Deux paradigmes qui cohabitent.
- `28 → 29` : de l'ingénierie humaine à l'ingénierie qui délègue. La responsabilité change de mains.

Les autres transitions (ex : `04_debugging` → `05_error_handling`, `13_refactoring` → `14_typescript`, `22_security` → `23_ai_native_dev`) sont des enchaînements naturels : le sujet évolue, mais la posture reste. Pas besoin d'un sas.

## SI TU RESSENS UN SAUT ABRUPT AILLEURS

Tu n'imagines pas des choses : `13 → 14` (refactoring → typescript) et `22 → 23` (security → AI native dev) sont les deux transitions non-pontées les plus abruptes conceptuellement. Elles restent gérables parce que chaque module ouvre par son propre `00_why_*.md` qui te resitue. Si le saut te freine quand même : relis le `_recall_` du bloc que tu quittes avant de plonger dans le suivant. C'est ce que fait un pont, à peine différemment.

## RÈGLE POUR L'AVENIR (v17 et au-delà)

Un nouveau pont s'ajoute **seulement si** la transition change la nature du travail (paradigme, échelle de temps, type de responsabilité). Pas si elle change juste le sujet. Ça évite la dérive vers 31 ponts creux.

---

Le lecteur pressé n'a rien à faire de cette page. Elle existe pour qu'un lecteur exigeant qui note "seulement 5 ponts, bizarre" sache que c'est délibéré.
