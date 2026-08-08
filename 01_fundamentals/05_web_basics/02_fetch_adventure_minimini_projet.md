## CONTEXTE

Même un portfolio statique récupère des données : compteur GitHub, derniers commits de MyFunnyJS. Dans l'App Router, `fetch` s'écrit côté serveur, dans le composant.

## APPLICATION

- Dans un Server Component, fais un `fetch` vers l'API publique GitHub à partir du champ `github` de ton projet MyFunnyJS.
- Affiche le nombre d'étoiles et la date du dernier push.
- Gère explicitement le cas où la requête échoue : le reste de la page doit rester affiché.

## Vérification

Pourquoi ce `fetch` est-il fait côté serveur et pas dans un `useEffect` ?

## 🎬 Ton portfolio parle à GitHub

La carte MyFunnyJS affiche désormais une donnée vivante. C'est le genre de détail qu'un recruteur remarque. Commit.
