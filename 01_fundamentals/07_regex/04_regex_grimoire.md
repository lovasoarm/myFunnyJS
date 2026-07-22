---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../../31_annexes/GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~9 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## GRIMOIRE DES REGEX

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Regex** | Pattern de texte qui décrit une forme à reconnaître ou extraire dans une chaîne. | `/\d+/` matche un ou plusieurs chiffres | un détecteur d'empreintes / un jutsu de reconnaissance qui cherche une signature précise |
| **Littéral regex** | Définir une regex directement entre slashes. Analysée à la compilation, plus rapide. | `/pattern/flags` | écrire un jutsu directement dans le parchemin / graver une règle dans la pierre |
| **RegExp()** | Constructeur pour créer une regex depuis une chaîne dynamique. Utile quand le pattern n'est pas connu à l'avance. | `new RegExp(variable, "gi")` | forger une arme sur commande / adapter le jutsu selon la cible |
| **Flag `i`** | Case-insensitive. La regex ignore la différence minuscule/majuscule. | `/naruto/i` matche "Naruto", "NARUTO", "naruto" | chercher sans se soucier des accents d'un nom / reconnaître un ninja en civil comme en uniforme |
| **Flag `g`** | Global. Trouve toutes les occurrences, pas seulement la première. | `"aaa".match(/a/g)` → `["a","a","a"]` | scanner tout le village, pas juste l'entrée / relire tout le rapport, pas juste le titre |
| **Flag `m`** | Multiline. `^` et `$` matchent chaque début/fin de ligne, pas juste la chaîne entière. | `/^\d/m` matche le premier chiffre de chaque ligne | inspecter chaque étage d'un bâtiment / relire chaque fiche ninja séparément |
| **`\d`** | Classe de caractère : un chiffre entre 0 et 9. Équivalent à `[0-9]`. | `/\d+/` matche "42" | un chiffre dans le registre du village / un numéro de bib dans une course |
| **`\w`** | Classe de caractère : un caractère de mot : lettres, chiffres, underscore. Équivalent à `[a-zA-Z0-9_]`. | `/\w+/` matche "naruto_123" | un caractère d'identifiant / une lettre dans un nom de code ninja |
| **`\s`** | Classe de caractère : un espace blanc : espace, tab, saut de ligne. | `/\s+/` matche des espaces multiples | un silence dans un discours / une pause entre deux jutsu |
| **`.` (point)** | N'importe quel caractère sauf le saut de ligne `\n` (sauf avec flag `s`). | `/n.ruto/` matche "naruto" ou "n3ruto" | un joker / "peu importe qui" dans une liste |
| **`^` et `$`** | Ancres : `^` = début de chaîne, `$` = fin de chaîne. Forcent le pattern à couvrir toute la chaîne avec `^...$`. | `/^\d+$/` valide que toute la chaîne est des chiffres | les gardes à l'entrée ET à la sortie du village / vérifier qu'un rapport commence ET finit correctement |
| **`+`** | Quantificateur : 1 ou plusieurs fois. La chose doit apparaître au moins une fois. | `/\d+/` matche "1", "42", "9999" | au moins un ninja dans l'équipe / pas de mission si l'équipe est vide |
| **`*`** | Quantificateur : 0 ou plusieurs fois. La chose peut ne pas apparaître. | `/\d*/` matche "", "0", "123" | une équipe qui peut être vide / un champ optionnel dans un formulaire |
| **`?`** | Quantificateur : 0 ou 1 fois. Rend une partie du pattern optionnelle. | `/colou?r/` matche "color" et "colour" | une armure optionnelle / un "s" de pluriel qui peut ou non être là |
| **`{n,m}`** | Quantificateur : entre n et m fois. | `/\d{4}/` exactement 4 chiffres, `/\d{2,4}/` de 2 à 4 | entre 2 et 4 ninjas dans une équipe / un code entre 4 et 6 caractères |
| **Groupe `()`** | Regroupe une partie du pattern. Capture le contenu dans `match[1]`, `match[2]`, etc. | `"2024-04".match(/(\d{4})-(\d{2})/)` → `match[1]` = "2024" | un groupe de ninjas identifié / isoler la partie importante d'un rapport |
| **Groupe nommé `(?<nom>)`** | Groupe capturant avec un nom. Accessible via `match.groups.nom`. | `/(?<annee>\d{4})/` puis `match.groups.annee` | donner un nom de code à chaque équipe / nommer chaque case d'un formulaire |
| **Groupe non-capturant `(?:)`** | Regroupe sans capturer dans les résultats. Pour les quantificateurs ou l'alternance sans stocker. | `/(?:na)+/` matche "nanana" sans stocker | coordonner un groupe sans le répertorier / regrouper pour l'ordre sans créer un dossier |
| **Alternance `\|`** | OU logique entre deux patterns. | `/chat\ / chien/` matche "chat" ou "chien" / choisir entre deux techniques / soit Naruto soit Sasuke sur la mission |
| **Classe `[abc]`** | Un seul caractère parmi ceux listés. | `/[aeiou]/` matche une voyelle | une liste blanche de caractères autorisés / les ninjas de la liste de recrutement |
| **Classe négative `[^abc]`** | Un seul caractère absent de la liste. | `/[^aeiou]/` matche une consonne | une liste noire / tout sauf les ninjas du village ennemi |
| **`.test()`** | Méthode regex : retourne `true` si le pattern est trouvé, `false` sinon. | `/\d+/.test("abc")` → `false` | le détecteur qui répond oui ou non / test de compétence : reçu ou recalé |
| **`.match()`** | Méthode string : retourne le(s) match(es) dans un tableau, ou `null` si rien trouvé. Toujours vérifier `null` avant d'utiliser. | `"abc123".match(/\d+/)` → `["123"]` | récolter les preuves trouvées / retourner les éléments filtrés d'un rapport |
| **`.matchAll()`** | Méthode string : retourne un iterator de tous les matches avec leurs groupes. Nécessite le flag `g`. | `[..."abc".matchAll(/./g)]` | scanner tout le texte et collecter chaque indice avec son contexte / inspecter chaque ligne d'un log avec ses détails |
| **`.replace()`** | Méthode string : remplace le(s) match(es). Accepte une chaîne ou une fonction comme remplacement. | `"ab".replace(/a/, "x")` → `"xb"` | effacer et réécrire une partie du parchemin / corriger une erreur dans un rapport |
| **`.split()`** | Méthode string : découpe la chaîne sur le pattern. | `"a,b,,c".split(/,+/)` → `["a","b","c"]` | couper le parchemin aux points de rupture / séparer une liste par ses délimiteurs |
| **Lookahead `(?=...)`** | Assertion positive : matche si suivi du pattern, sans consommer les caractères. | `/\d+(?=€)/` matche "42" dans "42€" sans inclure le "€" | vérifier ce qui suit une signature sans la lire / confirmer la présence d'un garde avant d'entrer |
| **Lookbehind `(?<=...)`** | Assertion positive : matche si précédé du pattern, sans consommer les caractères. | `/(?<=prix:\s)\d+/` matche le nombre après "prix: " | vérifier l'origine avant de lire le message / n'écouter que si c'est un Hokage qui parle |
| **ReDoS** | Backtracking catastrophique : certains patterns + certaines chaînes provoquent une explosion du temps d'exécution. Risque de sécurité en prod. | `/^(a+)+$/` sur "aaaab" peut bloquer le thread | un piège à ninja qui se referme lentement / une boucle infinie qui mange le CPU |
| **`lastIndex`** | Propriété d'une regex avec flag `g` : indique où reprendre le prochain `.exec()`. Peut causer des bugs si la même regex est réutilisée. | `regex.lastIndex = 0` pour reset manuellement | le signet d'un inspecteur qui reprend où il s'est arrêté / la mémoire de position d'un jutsu de recherche |

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.
