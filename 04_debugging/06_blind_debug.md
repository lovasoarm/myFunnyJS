# 05 : Blind Debug
Temps de lecture ~5 min

>  **Principe universel** : un bon debugger raisonne à partir des **symptômes**, pas du code. C'est ce que tu fais quand tu aides un collègue dont tu n'as pas le repo sous les yeux.

## Règle du jeu

- Un binôme (ou l'IA) tient le code.
- **Toi**, tu ne le vois pas.
- Tu poses **des questions** pour localiser le bug.
- Objectif : **nommer la ligne fautive** et le fix, sans ouvrir le fichier.

## 3 scénarios fournis

1. Une fonction `debounce` qui ne debounce pas.
2. Une requête `POST` qui semble arriver deux fois.
3. Un state React qui "oublie" une mise à jour.

## Rubrique de score

- Nombre de questions posées avant identification (moins = mieux).
- Les 3 meilleures questions à réutiliser plus tard.

## (attention) Piège

"Envoie-moi le code" = tu perds. La contrainte fait le muscle.
