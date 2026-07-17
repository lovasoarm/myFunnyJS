---
stability: intemporel
duree_de_vie_estimee: 10+ ans
raison: Protocole indépendant du langage et des outils.
---

# Cartographie 15 min d'une codebase inconnue

Temps de lecture ~5 min

> Tu débarques sur un repo que tu n'as jamais vu. Tu as 15 min pour produire une carte utilisable, pas une lecture exhaustive. Ce fichier te donne le protocole reproductible.

## PROTOCOLE EN 5 ÉTAPES CHRONOMÉTRÉES

### Étape 1 : README (2 min)

Lis le README **en entier** si <200 lignes, sinon les 3 premiers paragraphes + la section install + la section usage. Note dans `MAP.md` :

- Le problème que le repo prétend résoudre.
- La commande pour le lancer localement.
- Les mots-clés techniques qui reviennent.

Si le README ment ou est vide, écris-le dans `MAP.md`. C'est déjà une info.

### Étape 2 : point d'entrée (2 min)

Ouvre `package.json`, section `scripts` et `main`. Ouvre le fichier pointé. Note dans `MAP.md` :

- Le fichier d'entrée exact.
- La fonction ou classe appelée en premier.
- Les 3 imports du fichier d'entrée.

### Étape 3 : arborescence (2 min)

Lance `tree -L 2 -I 'node_modules|dist|build|.git'`. Note dans `MAP.md` :

- Les 5 dossiers les plus gros (au feeling ou via `du -sh`).
- Les 3 fichiers à la racine qui ne sont pas de la config.

Ne descends pas encore dans les sous-dossiers.

### Étape 4 : hot files via git log (5 min)

Lance :

```bash
git log --format=format: --name-only --since=6.months | sort | uniq -c | sort -rn | head -10
```

Les 10 fichiers les plus touchés sur 6 mois. Ce sont les points chauds : les bugs, les évolutions, les gens qui codent dedans. Note dans `MAP.md` :

- Les 3 dossiers représentés (souvent 1-2 dossiers concentrent tout).
- Le fichier n°1 (celui-là, tu iras le lire ensuite).

### Étape 5 : tests (4 min)

Ouvre le dossier `tests/` ou `__tests__/` ou équivalent. Compte le nombre de fichiers de test. Ouvre le test le plus court. Note dans `MAP.md` :

- Combien de tests existent (à la louche).
- Ce que le test le plus court vérifie : ça te dit ce que l'équipe considère comme important à protéger.
- La commande pour lancer les tests.

## LIVRABLE OBLIGATOIRE : MAP.md DE 20 LIGNES MAX

Format fixe :

```markdown
# MAP : <nom-du-repo>

## Objet

<une phrase>

## Point d'entrée

<fichier>::<fonction>

## Zones chaudes

- <dossier/fichier> (X commits/6mois)
- ...

## Tests

<N> fichiers, `<commande>` pour lancer. Ce qui compte : <en une phrase>.

## Ce que je ne comprends pas encore

- <question 1>
- <question 2>
```

**20 lignes max**. Si tu dépasses, tu as lu trop, cartographié pas assez.

## AUTO-ÉVALUATION

Après ces 15 min, tu dois pouvoir répondre à voix haute :

1. Quel problème résout ce repo ?
2. Si je casse un truc, où le remarquerais-je en premier ?
3. Où j'irais lire pour comprendre la feature X ?

Si tu ne peux pas : tu as lu, tu n'as pas cartographié. Recommence en te tenant au protocole.

## POURQUOI CE PROTOCOLE MARCHE

Une codebase inconnue est un espace : tu as besoin d'une carte avant de choisir un chemin. Lire ligne à ligne, c'est marcher les yeux au sol. Ce protocole te force à prendre de la hauteur avant de descendre.
