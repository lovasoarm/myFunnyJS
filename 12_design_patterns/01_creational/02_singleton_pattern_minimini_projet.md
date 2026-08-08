## CONTEXTE

Un module ESM est déjà un singleton : l'index slug → projet ne doit être construit qu'une fois, pas à chaque rendu.

## APPLICATION

- Vérifie que ta `Map` d'index est bien créée au niveau module et non dans une fonction appelée à chaque requête.
- Ajoute un log de construction et compte combien de fois il apparaît en navigation.
- Note pourquoi une classe Singleton explicite serait ici inutile.

## Vérification

Pourquoi un module ESM suffit-il là où d'autres langages imposent un pattern Singleton ?

## 🎬 Ton index est construit une seule fois

Tu as compris un pattern et su ne pas le sur-implémenter : c'est le vrai signe de maîtrise.
