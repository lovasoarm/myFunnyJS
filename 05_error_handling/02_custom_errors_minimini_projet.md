## CONTEXTE

Une erreur typée porte du sens : `ProjectNotFoundError` se traite autrement qu'une panne réseau, et permet une vraie 404.

## APPLICATION

- Crée `lib/errors.js` avec une classe d'erreur métier pour un projet introuvable.
- Lance-la depuis `getProjectBySlug`.
- Sur la route dynamique, attrape-la et déclenche la 404 native de Next.

## Vérification

Qu'apporte une classe d'erreur dédiée par rapport à un simple message texte ?

##Ta 404 projet est correcte

Une URL inexistante rend maintenant une vraie page 404, bonne pour l'utilisateur et pour le SEO. Commit.
