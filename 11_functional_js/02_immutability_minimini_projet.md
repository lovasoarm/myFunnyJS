## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## CONTEXTE

Ne jamais modifier les données reçues : c'est ce qui garantit que le filtre d'une rangée n'affecte pas les autres.

## APPLICATION

- Repère toute méthode mutante restante (`sort`, `reverse`, `splice`, `push`) dans `lib/`.
- Remplace-les par leurs équivalents non destructifs.
- Ajoute un test qui vérifie que le catalogue d'origine est inchangé après appel.

## Critère de réussite

- [ ] Repère toute méthode mutante restante (`sort`, `reverse`, `splice`, `push`) dans `lib/`.
- [ ] Remplace-les par leurs équivalents non destructifs.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Quel test prouve concrètement l'immutabilité d'une fonction ?

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton catalogue est intouchable.

Une classe entière de bugs est éliminée, avec un test qui le prouve. Commit.
