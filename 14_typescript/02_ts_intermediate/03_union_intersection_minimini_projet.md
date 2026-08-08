## CONTEXTE

Les unions modélisent des états finis : le statut d'un projet n'est pas une `string` libre, c'est une liste fermée.

## APPLICATION

- Remplace le type de `status` par l'union littérale `ProjectStatus` des statuts réels du catalogue.
- Fais de même pour `category` avec `ProjectCategory`.
- Constate l'erreur quand tu écris un statut mal orthographié.

## Vérification

Qu'est-ce qu'une union littérale t'apporte qu'un `string` ne donnera jamais ?

## 🎬 Tes statuts sont infalsifiables

Une faute de frappe dans les données devient impossible. Commit.
