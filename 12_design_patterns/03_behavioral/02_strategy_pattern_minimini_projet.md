## CONTEXTE

Une stratégie = un algorithme interchangeable. Le tri du catalogue (par année, par note, par titre) est un cas d'école.

## APPLICATION

- Définis un objet de stratégies de tri, clé → fonction de comparaison.
- Branche un sélecteur d'ordre sur la page « Tous les projets ».
- Ajoute une nouvelle stratégie sans modifier le composant.

## Vérification

Qu'est-ce que ce pattern t'évite d'écrire à chaque nouveau critère de tri ?

## 🎬 Ton catalogue se trie à la demande

Une vraie fonctionnalité utilisateur, extensible sans toucher l'UI. Commit.
