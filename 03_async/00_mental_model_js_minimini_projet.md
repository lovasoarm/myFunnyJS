## TYPE

Micro-drill

## Niveau

🗸 Intermédiaire

## CONTEXTE

JS est mono-thread avec une file d'attente. Savoir ce qui bloque le rendu explique pourquoi ton splash screen fige ou pourquoi une animation saccade.

## APPLICATION

- Dans un composant client, lance une boucle synchrone de ~500 ms au clic et essaie de scroller pendant : constate le gel.
- Remplace-la par un découpage asynchrone et recommence.
- Note en une phrase ce qui bloque exactement.

## Critère de réussite

- [ ] Dans un composant client, lance une boucle synchrone de ~500 ms au clic et essaie de scroller pendant.
- [ ] Remplace-la par un découpage asynchrone et recommence.
- [ ] Je peux expliquer le résultat obtenu sans relire le cours.

## Vérification

Qu'est-ce qui est réellement bloqué pendant une boucle synchrone : le réseau, le rendu, ou les deux ?

## Preuve à conserver

Après l'expérience, conserve :

- le résultat observé ;
- l'explication ;
- la règle générale que tu en tires ;
- une limite ou une exception connue.

## Ce que tu viens de démontrer

Dans ce scénario, tu as vérifié que : tu as vu ton interface geler à la demande.

Tu sais désormais reconnaître un blocage du thread principal dans le portfolio avant qu'un visiteur ne le subisse.
