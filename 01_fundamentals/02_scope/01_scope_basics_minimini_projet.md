## CONTEXTE

La portée décide de ce qu'un morceau de code peut voir. Dans Next.js App Router, c'est aussi une question de sécurité : ce qui vit dans la portée d'un Server Component ne doit pas fuiter côté client.

## APPLICATION

- Dans `app/page.tsx`, déclare une constante au niveau module et une autre dans le corps du composant.
- Essaie d'utiliser la seconde dans une fonction déclarée hors du composant : lis l'erreur.
- Range ce qui est réutilisable au niveau module, ce qui dépend du rendu dans le composant.

## Vérification

Quelle question te poses-tu pour décider si une valeur doit vivre au niveau module ou dans le composant ?

## 🎬 Ta page est rangée par portée

Tu viens d'adopter le réflexe qui garde tes fichiers Next.js lisibles quand ils grossissent. Commit cette page.
