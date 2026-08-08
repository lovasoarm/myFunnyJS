## CONTEXTE

Timers et animations sont des macrotâches. Le défilement automatique des rangées et le splash « ta-dum » en dépendent : et fuient si on oublie le nettoyage.

## APPLICATION

- Ajoute un défilement automatique de rangée avec un `setInterval` dans un `useEffect`.
- Retourne la fonction de nettoyage qui l'arrête.
- Navigue vers une autre page et reviens plusieurs fois : vérifie dans les logs qu'il n'y a qu'un seul intervalle actif.
- Remplace le timer d'animation par `requestAnimationFrame` et compare la fluidité.

## Vérification

Que se passe-t-il concrètement si tu oublies le nettoyage du `useEffect` ?

## 🎬 Ton auto-scroll tourne sans fuite

Une animation signature qui ne dégrade pas le site au fil de la navigation. Commit.
