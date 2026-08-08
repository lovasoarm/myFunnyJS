## CONTEXTE

Une closure capture des variables, pas des valeurs figées : d'où les « stale closures » de React, où un handler lit un state périmé. Ton futur carrousel de projets tombera dedans.

## APPLICATION

- Crée un composant client avec un compteur et un `setInterval` dans un `useEffect` avec tableau de dépendances vide.
- Affiche la valeur lue par l'intervalle : constate qu'elle reste bloquée.
- Corrige avec la forme fonctionnelle de `setState`.
- Note en commentaire ce que la closure avait réellement capturé.

## Vérification

Pourquoi l'intervalle lit-il toujours la même valeur alors que le state, lui, augmente bien ?

##Tu as désamorcé la stale closure

Ce bug précis coûte des heures à la plupart des devs React. Tu l'as vu, reproduit et corrigé avant qu'il n'atteigne ton carrousel Netflix.
