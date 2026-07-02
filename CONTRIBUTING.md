# CONTRIBUER À MyFunnyJS

Version courante : **v2026.1**

## POLITIQUE DE MISE À JOUR

- **Modules `[PERISSABLE] PÉRISSABLE`** : revue OBLIGATOIRE chaque année (janvier).
- **Modules `[INTEMPOREL]`** : revue tous les 2 ans, ou sur signalement.
- **Mini-projets** : version-lock des dépendances documenté dans chaque `package.json`.

## PROCESSUS DE REVUE ANNUELLE

1. Lister tous les fichiers marqués `[PERISSABLE] PÉRISSABLE : vérifié <YYYY-MM>`.
2. Pour chacun :
   - Vérifier que les API/outils cités sont toujours d'actualité.
   - Mettre à jour la date de vérification.
   - Si obsolète : réécrire OU marquer `[DEPRECATED]` avec lien vers le successeur.
3. Bumper la version dans `README.md` (v2026.1 → v2027.1).
4. Écrire l'entrée dans `CHANGELOG.md`.

## STYLE

Respecter le Code d'Honneur CrazyDevs (voir `INSTRUCTIONS.txt`) :
- Phrases courtes.
- Analogies limitées à une par concept, avec encadré "(attention) Ce que l'analogie cache".
- Structure leçon : accroche → explication → code commenté → risque → exercice.
- Pas de code source JS livré prêt à l'emploi.

## PROPOSER UNE MODIFICATION

PR sur le dépôt, avec :
- Référence audit (le cas échéant).
- Fichiers impactés.
- Justification pédagogique en 3 lignes max.

## Emojis

Seuls les fichiers de navigation (`01_START_HERE.md`, `_recall_*.md`, `_spaced_repetition.md`) peuvent utiliser des emojis fonctionnels comme repères visuels. Tous les autres fichiers de contenu (leçons, grimoires, exercices, cahiers des charges) en sont exempts : on utilise des balises textuelles `[INTEMPOREL]`, `[DECENNIE]`, `(attention)` à la place. Un emoji dans une leçon = revue refusée.
