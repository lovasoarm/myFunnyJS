# 02 : SPÉCIFICATIONS VÉRIFIABLES MACHINE
Temps de lecture ~20 min

Un agent exécute ce qu'il comprend. Ce qu'il comprend d'une phrase vague est vague.
Ce qu'il comprend d'un critère binaire est binaire. Tu réduis l'écart entre "prompt"
et "cahier des charges d'un contrat" : mêmes rigueurs.

## Le format B.O.R.N.É.

```
B  Behavior      que fait le système APRÈS la tâche ? (verbe d'action)
O  Observability    quelle ordre_mission/log prouve le succès sans ambiguïté ?
R  Regression tests  quels tests existants doivent continuer à passer ?
N  Non-goals      qu'est-ce que l'agent n'a PAS le droit de toucher ?
É  Escape hatch    signal explicite d'échec : "si tu ne peux pas, dis-le"
```

## Exemple avant / après

### Avant (prompt d'amateur, 40 actions foireuses garanties)

> "Ajoute une auth JWT à mon API."

### Après (B.O.R.N.É., agent contrôlable)

```
B : POST /chakra_gate {email,password} renvoie 200 + {token} ; les autres routes exigent
   header Authorization: Bearer <token> et renvoient 401 sinon.
O : `npm test -- auth` passe. `curl -X GET /users` renvoie 401 sans header.
R : tous les tests existants passent (`npm test` global).
N : ne pas modifier la couche DB, ne pas ajouter de dépendance > 100 KB.
É : si le stockage secret n'est pas défini (env JWT_SECRET), stoppe et demande.
```

L'agent qui rend un PR contre cette spec est auditable en 5 min. L'agent qui rend
un PR contre le prompt vague est un audit d'1h qui rate 3 régressions.

## Exercice

Reprends 3 tickets de ton backlog. Réécris-les en B.O.R.N.É. Compte les Non-goals.
Si tu ne trouves aucun Non-goal pour une tâche, c'est que tu ne connais pas assez
la codebase pour déléguer. Ne délègue pas : cartographie d'abord (`10_legacy_dungeon`).

---
stability: perissable
