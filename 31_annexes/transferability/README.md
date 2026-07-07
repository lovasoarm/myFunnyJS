---
stability: stable
---

# Transferability : same idea, other language

Temps de lecture ~5 min

Ces exercices existent pour **prouver** (à toi-même) que tu as appris des
**concepts**, pas de la syntaxe JS.

Règle : tu n'as pas le droit de dire « je sais faire ça » avant d'avoir
livré l'exercice équivalent hors JS.

## Comment ça marche

1. Choisis un exercice JS que tu as réussi dans le curriculum.
2. Ré-implémente-le dans un langage que tu ne pratiques pas au quotidien
   (Python, Go, Rust, Elixir, Bash pur, peu importe pourvu que ce ne soit
   pas JS/TS).
3. Compare : mêmes entrées, mêmes sorties, mêmes cas limites.

## Grille d'évaluation (auto-notation)

Note-toi honnêtement de 0 à 5 sur chaque axe :

| Axe | 0 | 3 | 5 |
|---|---|---|---|
| **Parité fonctionnelle** | La sortie diffère | Certains cas limites ratés | Byte-à-byte identique |
| **Idiomatique** | Traduction ligne à ligne du JS | Quelques adaptations | Utilise les vraies conventions du langage cible |
| **Test** | Aucun test | Tests happy path | Tests cas limites + tests de propriété |
| **Documentation** | Aucune | README minimal | Explique les choix propres au langage |
| **Temps** | > 3× le temps JS | ~2× | ≤ 1,5× |

Score minimal pour valider : **15/25**.

## Exercices recommandés pour commencer

- Un pipeline FP du module 11 (map/filter/reduce composés).
- L'algorithme LRU du module 08 ou du mini-projet 13.
- Un mini-serveur HTTP du module 20 ou 21.

## Piège fréquent

Réécrire mot-à-mot le JS en Python donne l'illusion du transfert. Le vrai
transfert se voit à ce que tu utilises `enumerate` en Python plutôt que
`for (let i = 0; i < arr.length; i++)`. Si ton code Python ressemble à du
JS déguisé, tu n'as pas transféré : tu as translittéré.
