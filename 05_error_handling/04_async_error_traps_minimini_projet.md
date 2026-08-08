## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## Prérequis

- Connaître `useEffect`

## CONTEXTE

Les pièges classiques : promesse non attendue, rejet non capturé, erreur avalée dans un `useEffect`. Ils passent tous silencieusement en production.

## APPLICATION

- Repère dans ton code un `await` manquant devant un appel asynchrone (ajoute-en un si besoin) et observe le comportement.
- Ajoute un gestionnaire global de rejets non capturés côté client, en journalisant.
- Vérifie qu'une erreur dans un `useEffect` asynchrone est bien attrapée à l'intérieur.

## Critère de réussite

- [ ] Repère dans ton code un `await` manquant devant un appel asynchrone (ajoute-en un si besoin) et observe le comportement.
- [ ] Ajoute un gestionnaire global de rejets non capturés côté client, en journalisant.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Pourquoi un `try/catch` autour d'un `useEffect` synchrone n'attrape-t-il pas l'erreur asynchrone à l'intérieur ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tes erreurs asynchrones ne sont plus silencieuses.

Tu vois désormais ce qui casse, au lieu de le subir. Commit.
