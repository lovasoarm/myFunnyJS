# Page verrouillée
Temps de lecture ~11 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

# MATH GRIMOIRE : 05_MATH_BASICS

Les maths qu'un dev croise vraiment. Pas celles d'un manuel de terminale.
Chaque terme ici apparaît dans du vrai code, dans de vraies prods, dans de vrais bugs.

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Opérateur logique AND** | Retourne `true` si les deux opérandes sont vrais. En JS, retourne la première valeur falsy ou la dernière valeur. | `true && "ok"` → `"ok"` / `null && fn()` → `null` | Verrou à deux clés : les deux doivent tourner / Deux gardiens : les deux doivent valider |
| **Opérateur logique OR** | Retourne `true` si au moins un opérande est vrai. En JS, retourne la première valeur truthy ou la dernière. | `null \|\| "défaut"` → `"défaut"` / `"val" \|\| "défaut"` → `"val"` | Porte avec deux entrées : une seule suffit / Sélection du premier candidat disponible |
| **Court-circuit (short-circuit)** | `&&` arrête dès qu'il trouve un falsy. `\|\|` arrête dès qu'il trouve un truthy. La suite n'est pas évaluée. | `user && user.nom` : si `user` est null, `user.nom` n'est jamais lu | Sécurité de Kakashi qui n'ouvre pas le Sharingan si ennemi déjà KO / Fuse électrique : coupe avant que ça brûle |
| **Nullish coalescing `??`** | Retourne le côté droit uniquement si le gauche est `null` ou `undefined`. Contrairement à `\|\|`, laisse passer `0`, `""`, `false`. | `score ?? 0` : si score = 0, retourne 0 (pas le fallback) | Différence entre "absent" et "vide" / Remplaçant qui entre que si le titulaire est blessé, pas juste fatigué |
| **Valeurs falsy** | Les 8 valeurs que JS considère comme `false` dans un contexte booléen : `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. | `if (0)` ne s'exécute pas / `Boolean("")` → `false` | Les 8 disqualifiés du match / Les zéros qui ne comptent pas dans le classement |
| **Lois de De Morgan** | `!(A && B)` est équivalent à `(!A \|\| !B)`. `!(A \|\| B)` est équivalent à `(!A && !B)`. Permet de simplifier les conditions complexes. | `!(estAdmin && estActif)` ↔ `!estAdmin \|\| !estActif` | Inverser "les deux gagnent" = "au moins un perd" / Négation du contrat collectif |
| **Modulo `%`** | Retourne le reste de la division entière. Si `a % n`, le résultat est dans `[0, n-1]` pour des positifs. | `7 % 3` → `1` / `index % tableau.length` → index cyclique | Aiguille d'une horloge : toujours entre 0 et 11 / Rotation de garde : chaque soldat reprend son tour |
| **Arithmétique modulaire** | Système de calcul où les nombres "bouclent" après avoir atteint un modulus. Utilisé pour les cycles, la pagination, les ring buffers. | `(currentPage + 1) % totalPages` → page suivante cyclique | Les heures sur un cadran : après 23h vient 0h / Saisons : après l'automne revient le printemps |
| **Opérateurs bitwise** | Opèrent bit par bit sur la représentation binaire d'un entier 32 bits. `&`, `\|`, `^`, `~`, `<<`, `>>`, `>>>`. | `0b1010 & 0b1100` → `0b1000` (8) | Interrupteurs électriques en parallèle ou en série / Masques de découpe sur une image |
| **Masque de bits (bitmask)** | Un entier utilisé pour tester, activer ou désactiver des bits spécifiques via `&`, `\|`, `^`. Système de flags compacts. | `const ADMIN = 1 << 2` / `perms & ADMIN` → 0 ou 4 | Badge d'accès à étages multiples / Carte perforée : chaque trou = une permission |
| **XOR `^`** | Retourne 1 uniquement si les bits sont différents. Utile pour toggle, swap sans variable temporaire, comparaison. | `a ^= 1` toggle le bit 0 / `a ^ b ^ a` → `b` | Interrupteur va-et-vient : deux switches, comportement inverse / Détective : vrai si exactement l'un des deux ment |
| **Left shift `<<`** | Décale les bits vers la gauche de N positions. Équivaut à multiplier par `2^N`. Plus rapide que `Math.pow`. | `1 << 3` → `8` / `1 << 10` → `1024` | Doubler la mise N fois / Ajouter N zéros à la fin d'un nombre binaire |
| **Fonction de hachage** | Transforme une donnée de taille arbitraire en une valeur de taille fixe. Déterministe, rapide, non réversible. | `hash("Naruto")` → `2847361` (toujours le même) | Empreinte digitale d'un fichier / Code barre : résume l'objet en une suite de chiffres |
| **Collision de hash** | Deux entrées différentes qui produisent le même hash. Inévitable (pigeonhole principle). Les bonnes fonctions les rendent improbables. | `hash("abc") === hash("bca")` (mauvaise fonction) | Deux joueurs avec le même numéro de maillot / Deux suspects avec le même ADN : ça n'arrive pas avec une bonne analyse |
| **Distribution de hash** | Qualité d'une fonction de hash : elle doit répartir uniformément les entrées sur toutes les sorties possibles. | Vérifier avec un histogramme de fréquences | Tirage au sort équitable : chaque numéro a la même chance / Répartition de charge entre serveurs |
| **`Math.random()`** | Retourne un nombre flottant dans `[0, 1)`. Distribution uniforme sur cet intervalle. Pas cryptographiquement sûr. | `Math.floor(Math.random() * 6) + 1` → dé à 6 faces | Roulette avec 100 cases égales / RNG basique d'un jeu vidéo |
| **Distribution uniforme** | Chaque valeur possible a la même probabilité d'apparaître. `Math.random()` en est une approximation pour `[0,1)`. | `Math.floor(Math.random() * n)` → uniforme sur `[0, n-1]` | Chaque joueur a autant de chances d'être sélectionné / Tirage au sort sans favoritisme |
| **Probabilité pondérée (weighted random)** | Chaque option a une probabilité différente. S'implémente avec des seuils cumulés ou des tableaux pondérés. | `[{item:"épée",w:70},{item:"légendaire",w:5}]` + seuil | Gacha avec des taux différents par rareté / Drop rate en RPG : le boss rare lâche rarement son item rare |
| **Seed (graine RNG)** | Valeur initiale d'un générateur pseudo-aléatoire. Même seed → même séquence. Utile pour les tests reproductibles. | `mulberry32(42)` → toujours la même séquence | Recette secrète : même ingrédients → même plat / Niveau généré procéduralement : même seed = même map |
| **Vecteur** | Une quantité avec une direction et une magnitude. Représenté par `{x, y}` en 2D. Différent d'un point : c'est un déplacement. | `{x: 3, y: 4}` magnitude = 5 / représente "bouge de 3 droite, 4 bas" | Flèche sur une carte : longueur = distance, pointe = direction / Shoot de Lewa : force + trajectoire |
| **Normalisation d'un vecteur** | Diviser un vecteur par sa magnitude pour obtenir un vecteur de longueur 1. Donne une direction pure sans la vitesse. | `{x: v.x / mag, y: v.y / mag}` avec `mag = sqrt(x²+y²)` | GPS qui donne la direction sans la distance / Boussole : seulement le cap, pas le kilométrage |
| **Jutsu scalaire (dot product)** | `v1.x * v2.x + v1.y * v2.y`. Retourne un scalaire. Positif = même sens, 0 = perpendiculaire, négatif = sens opposé. | `dotProduct(regard, dirEnnemie)` → l'ennemi est-il dans le FOV ? | Accord entre deux votes : +1 = d'accord, 0 = neutre, -1 = opposés / Phares qui s'alignent ou se croisent |
| **Distance euclidienne** | Distance "à vol d'oiseau" entre deux points. `sqrt((x2-x1)² + (y2-y1)²)`. Pythagore appliqué. | `Math.sqrt(dx*dx + dy*dy)` | Distance GPS entre deux villes / Passe longue en diagonale sur le terrain |
| **Distance Manhattan** | Somme des distances absolues sur chaque axe. `\|x2-x1\| + \|y2-y1\|`. Distance réelle si on ne peut se déplacer qu'en horizontal/vertical. | `Math.abs(dx) + Math.abs(dy)` | Nombre de rues à traverser dans une ville en grille / Déplacements sur un échiquier (sans diagonale) |
| **Distance au carré** | `dx² + dy²` sans `sqrt`. Utilisée pour comparer des distances sans besoin de la valeur exacte. 2x plus rapide. | `if (dist2(A,C) < dist2(B,C))` → A est plus proche | Comparer des poids sans balance précise : le plus lourd reste le plus lourd / Classement sans note exacte |
| **Interpolation linéaire (lerp)** | Calcule une valeur entre `a` et `b` à hauteur de `t` (entre 0 et 1). `a + (b - a) * t`. | `lerp(0, 100, 0.3)` → 30 / `lerp(rouge, bleu, 0.5)` → violet | Fondu entre deux scènes / Caméra qui glisse progressivement vers le joueur |
| **Bounding box** | Rectangle minimal qui englobe un objet. Utilisé comme première approximation pour les tests de collision. Rapide mais imprécis. | `a.x < b.x + b.w && a.x + a.w > b.x && ...` | Emballage carton d'un objet bizarre : si deux cartons ne se touchent pas, les objets non plus / Zone de détection rapide d'un radar |
| **`Math.atan2(y, x)`** | Retourne l'angle (en radians) entre l'axe X positif et le point `(x, y)`. Gère les quatre quadrants. Toujours préférer à `Math.atan`. | `Math.atan2(dy, dx)` → angle vers une cible | Boussole qui sait où est le nord peu importe ta direction / GPS qui calcule le cap sans se perdre en quadrant |
| **Heatmap** | Grille qui agrège des points dans des cellules. Chaque cellule comptabilise combien de points elle contient. | `grille[Math.floor(y/res)][Math.floor(x/res)]++` | Carte de chaleur d'un match : zones de pressing / Analytics UX : quelles zones d'une page cliquent vraiment les shinobis |

---

→ Leçon complète sur les probabilités et le RNG : `05_probability_random.md`
→ Leçon complète sur les opérateurs bitwise et les flags : `03_bit_manipulation.md`
→ Leçon complète sur l'arithmétique modulaire : `02_modular_arithmetic.md`
→ Leçon complète sur les fonctions de hachage : `04_hashing_basics.md`

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.
