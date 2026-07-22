---
stability: intemporel
---

# 08 : Smell hunter : chasser le code mort et puant
Temps de lecture ~5 min

Dix odeurs. Dix corrections. Un exercice terrain.

## Le bestiaire

| # | Smell | Signal | Antidote |
|---|-------|--------|----------|
| 1 | Long method (>50 lignes) | Scroll infini | Extract method |
| 2 | God object | Fichier > 500 lignes qui touche à tout | Split par responsabilité |
| 3 | Magic number | `if (x > 42)` sans contexte | Constante nommée |
| 4 | Duplication | Copier-coller ×3 | DRY, mais après le 3e |
| 5 | Feature envy | Méthode qui n'utilise que les données d'une autre classe | Move method |
| 6 | Dead code | `if (false)`, imports jamais utilisés | Delete. Git s'en souvient. |
| 7 | Shotgun surgery | Un changement métier = 15 fichiers touchés | Regrouper la logique |
| 8 | Primitive obsession | `string` pour tout (email, id, url) | Types wrapper |
| 9 | Nested conditionals >3 | Escalier de `if` | Early return / guard clauses |
| 10 | Commented-out code | "au cas où" depuis 2 ans | Delete. Git. S'en. Souvient. |

## Ce que la liste cache

Un smell n'est pas un bug. Certains sont légitimes (ex: duplication contrôlée pour lisibilité). Le smell dit "regarde ici". Il ne dit pas "corrige".

## Mission

Prends `30_mini_projects/10_legacy_dungeon` (ou n'importe quel repo public). Chasse **7 smells** de la liste. Pour chacun : ligne, verdict (corrigé / laissé volontairement), justification en 2 lignes.

Livre `SMELL_HUNT.md`.
