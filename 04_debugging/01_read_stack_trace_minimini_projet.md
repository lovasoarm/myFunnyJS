## CONTEXTE

Lire une stack trace Next.js, c'est distinguer ton code du code du framework et trouver la première ligne qui t'appartient.

## APPLICATION

- Provoque une erreur réelle : accède à `project.title` sur un projet introuvable par slug.
- Lis la trace complète et surligne la première ligne pointant vers ton propre code (`app/`, `components/`, `lib/`).
- Corrige, puis note en une phrase le raisonnement qui t'a mené à la ligne fautive.

## Vérification

Comment repères-tu, dans une trace de 40 lignes, celle qui t'intéresse ?

##Tu lis une trace sans paniquer

Tu as corrigé une vraie 404 mal gérée sur la route dynamique. Commit le correctif.
