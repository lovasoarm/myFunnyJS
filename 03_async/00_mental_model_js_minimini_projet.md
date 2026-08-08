## CONTEXTE

JS est mono-thread avec une file d'attente. Savoir ce qui bloque le rendu explique pourquoi ton splash screen fige ou pourquoi une animation saccade.

## APPLICATION

- Dans un composant client, lance une boucle synchrone de ~500 ms au clic et essaie de scroller pendant : constate le gel.
- Remplace-la par un découpage asynchrone et recommence.
- Note en une phrase ce qui bloque exactement.

## Vérification

Qu'est-ce qui est réellement bloqué pendant une boucle synchrone : le réseau, le rendu, ou les deux ?

##Tu as vu ton interface geler à la demande

Tu sais désormais reconnaître un blocage du thread principal dans le portfolio avant qu'un visiteur ne le subisse.
