## TYPE

Micro-drill

## Niveau

🗸 Avancé

## Prérequis

- Connaître `useEffect`

## CONTEXTE

Les timers et les callbacks d'animation sont planifiés par le navigateur selon des mécanismes différents. Comprendre leur cycle d'exécution aide à éviter les animations et timers mal nettoyés. Le défilement automatique des rangées et le splash « ta-dum » en dépendent : et fuient si on oublie le nettoyage.

## APPLICATION

- Ajoute un défilement automatique de rangée avec un `setInterval` dans un `useEffect`.
- Retourne la fonction de nettoyage qui l'arrête.
- Navigue vers une autre page et reviens plusieurs fois : vérifie dans les logs qu'il n'y a qu'un seul intervalle actif.
- Remplace le timer d'animation par `requestAnimationFrame` et compare la fluidité.

## Critère de réussite

- [ ] Ajoute un défilement automatique de rangée avec un `setInterval` dans un `useEffect`.
- [ ] Retourne la fonction de nettoyage qui l'arrête.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Que se passe-t-il concrètement si tu oublies le nettoyage du `useEffect` ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : ton auto-scroll libère son timer au démontage dans ce scénario.

Une animation signature qui ne dégrade pas le site au fil de la navigation. Commit.
