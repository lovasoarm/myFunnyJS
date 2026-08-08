## CONTEXTE

Ne jamais modifier les données reçues : c'est ce qui garantit que le filtre d'une rangée n'affecte pas les autres.

## APPLICATION

- Repère toute méthode mutante restante (`sort`, `reverse`, `splice`, `push`) dans `lib/`.
- Remplace-les par leurs équivalents non destructifs.
- Ajoute un test qui vérifie que le catalogue d'origine est inchangé après appel.

## Vérification

Quel test prouve concrètement l'immutabilité d'une fonction ?

## 🎬 Ton catalogue est intouchable

Une classe entière de bugs est éliminée, avec un test qui le prouve. Commit.
