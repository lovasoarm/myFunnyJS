---
stability: perissable
duree_de_vie_estimee: 1-2 ans
raison: Les styles IA évoluent avec les modèles.
---

# 18_human_vs_ai_smell : reconnaître deux styles de bug

Temps de lecture ~30 min

> Même bug fonctionnel. Deux versions du code. L'une écrite à la main un vendredi soir. L'autre suggérée par un modèle IA. Ton job : nommer les 3 pièges spécifiques de chaque style. Pas les mêmes pièges. Pas les mêmes contre-mesures.

## POURQUOI CE MINI-PROJET

Le curriculum traite les deux angles séparément : `10_legacy_dungeon` pour le legacy humain, `23_ai_native_dev/07_faux_positifs_ia.md` pour l'IA. Ici, on les met **côte à côte** sur le même problème. C'est le seul moyen de sentir la différence de texture.

## LE PROBLÈME

Écrire un helper `formatArenaTime(seconds)` qui renvoie `"1h 23m 04s"` ou `"23m 04s"` ou `"04s"` selon la taille de l'entrée. Cas limites : 0, négatif, non entier, gigantesque.

## VERSION HUMAINE (vendredi 19h)

Voir `src/human_version.js`. Écrite vite, marche sur les cas testés, rate le reste.

## VERSION IA (Copilot avec un prompt court)

Voir `src/ai_version.js`. Semble propre, structurée, commentée, casse autrement.

## L'EXERCICE

1. Lis les deux versions **sans exécuter**.
2. Écris `AUDIT.md` avec deux sections :
   - "Pièges style humain" : 3 pièges nommés, avec la ligne exacte et la raison.
   - "Pièges style IA" : 3 pièges nommés, différents des précédents, avec la ligne exacte et la raison.
3. Écris `FIX.md` avec la version corrigée qui passe tous les cas limites.
4. Passe la version corrigée dans les tests fournis (`tests/tests.js`).

## LOCK

Tu ne modifies aucun fichier avant que ton AUDIT.md soit signé (les 6 pièges nommés, chacun avec sa preuve). Sinon, l'exo ne compte pas.

## LIVRABLE ATTENDU

- `AUDIT.md` (6 pièges, 3 par style).
- `FIX.md` (version corrigée avec explication des choix).
- Tests verts.

## POURQUOI CE FORMAT MARCHE

Un piège de style humain se sent : incohérence, court-circuit "je verrai plus tard", magic number oublié. Un piège de style IA se lit : trop propre, trop générique, plausible mais faux sur un edge case que le modèle n'a pas vu. Nommer la différence, c'est apprendre à reviewer les deux avec des lunettes différentes.

---

## REPRODUCTIBILITÉ

Installation canonique : `npm ci` (pas `npm install`). `npm ci` respecte strictement le `package-lock.json` : deux personnes qui clonent obtiennent exactement les mêmes versions. Committe toujours ton `package-lock.json`. Sans lui, un `npm install` 3 mois plus tard installera d'autres versions et tu debug un fantôme.
