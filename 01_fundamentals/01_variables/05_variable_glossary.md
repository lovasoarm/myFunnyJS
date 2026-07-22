---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# VARIABLE GRIMOIRE : LES MOTS QUE TU DOIS MAÎTRISER
Temps de lecture ~5 min

> Ce module, c'est la mémoire. Si tu ne comprends pas ces termes, tu ne comprends pas ce que JS fait avec tes données.

---

| Terme | Définition | Code | Analogies |
|---|---|---|---|
| Variable | Conteneur qui stocke une valeur en mémoire : un nom attaché à une adresse | `let score = 42;` | Une boîte avec une étiquette / Un tiroir avec un post-it collé dessus |
| Primitive | Valeur simple stockée directement (`number`, `string`, `boolean`, `null`, `undefined`, `symbol`, `bigint`) : copiée par valeur | `let a = 10; let b = a; b = 99; // a reste 10` | Un billet de banque que tu tiens dans la main / Un chiffre écrit sur un papier : tu le copies, les deux sont indépendants |
| Object | Structure complexe : la variable stocke une référence, pas la valeur directement | `let obj = { hp: 100 }; let copy = obj; copy.hp = 0; // obj.hp aussi` | Un ticket de vestiaire : tu as l'adresse, pas l'objet / Un lien vers un Google Doc : le fichier est ailleurs |
| Reference | Adresse mémoire vers laquelle pointe une variable objet | `let a = {}; let b = a; console.log(a === b); // true` | Les coordonnées GPS d'une maison / Le numéro de chambre dans un hôtel |
| Mutation | Modifier le contenu d'un objet existant : toutes les références vers cet objet voient le changement | `let arr = [1,2]; let b = arr; b.push(3); // arr aussi` | Repeindre la maison : tout le monde qui a l'adresse voit le changement / Modifier un Google Doc partagé : la mise à jour est pour tout le monde |
| Shallow Copy | Copie de la première couche seulement : les objets imbriqués restent partagés | `let copy = [...arr]; // tableau nouveau, objets internes partagés` | Photocopier la couverture d'un livre, pas les pages / Dupliquer un dossier sans copier les fichiers qu'il contient |
| Deep Copy | Copie complète de toute la structure, tous les niveaux imbriqués inclus | `let deep = structuredClone(obj);` | Imprimer l'intégralité du livre, page par page / Cloner une clé USB avec tout son contenu |
