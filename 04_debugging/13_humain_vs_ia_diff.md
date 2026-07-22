---
stability: intemporel
---

# Humain vs IA : deux patches, un bug, trouve l'auteur
Temps de lecture ~10 min

Deux patches de la même fonction, deux auteurs : un humain junior fatigué, une IA générative confiante. Les deux compilent. Un seul est juste. Ton job : identifier l'auteur par les **tells** (indices révélateurs) avant d'exécuter les tests.

Où l'analogie casse : les tells ci-dessous décrivent des tendances 2025-2026 des IA génératives. Elles évoluent vite : dans 18 mois, certains tells auront disparu, d'autres apparaîtront. Le fond (raisonner avant d'exécuter) survit ; la liste de tells vieillit.

---

## 1) LE BUG

Fonction cible : `moyenne(nombres)` doit retourner la moyenne d'un tableau. Le test qui casse : `moyenne([])` doit retourner `null`, pas `NaN`.

### Patch X

```js
function moyenne(nombres) {
 if (!Array.isArray(nombres) || nombres.length === 0) {
  return null
 }
 const somme = nombres.reduce((acc, n) => acc + n, 0)
 return somme / nombres.length
}
```

### Patch Y

```js
/**
 * Calcule la moyenne d'un tableau de nombres.
 * @param {number[]} nombres - Le tableau d'entrée.
 * @returns {number|null} La moyenne, ou null si le tableau est vide.
 * @throws {TypeError} Si l'entrée n'est pas un tableau.
 */
function moyenne(nombres) {
 // Vérification de l'entrée
 if (!Array.isArray(nombres)) {
  throw new TypeError('nombres doit être un tableau')
 }
 // Cas particulier : tableau vide
 if (nombres.length === 0) {
  return null
 }
 // Calcul de la somme via reduce
 const somme = nombres.reduce((acc, n) => acc + n, 0)
 // Retour de la moyenne arithmétique
 return somme / nombres.length
}
```

---

## 2) LES TELLS À OBSERVER (checklist)

**Tells IA (patch souvent gonflé)** :
- Docstring JSDoc complète, alignée, avec `@throws` alors que le contexte ne l'exige pas.
- Commentaires qui redisent ce que le code fait (`// Calcul de la somme via reduce`).
- Gestion d'un cas non demandé (`TypeError` alors que la consigne ne le mentionne pas).
- Style ultra-régulier, aucune abréviation, jamais de raccourci idiomatique.
- Choix "safe par défaut" partout, même là où on ne l'a pas demandé.

**Tells humain junior fatigué** :
- Une seule garde compacte (`if (!Array.isArray(nombres) || nombres.length === 0)`).
- Pas de commentaire redondant.
- Choix de retour minimal (`return null`) sans exception détaillée.
- Parfois une faute mineure (variable mal nommée, condition en double).

Verdict "type" : **Patch Y = IA**, **Patch X = humain**. Vérifie en lançant les tests : les deux passent ici, mais un recruteur repérerait tout de suite le patch "trop propre pour être vrai".

---

## 3) POURQUOI ÇA IMPORTE

Une IA générative écrit du code **plausible** avant tout. Cette plausibilité :
- ajoute du bruit défensif inutile (surcode) ;
- rassure faussement (le lecteur croit que le code est audité parce qu'il est bien peigné) ;
- masque parfois des erreurs subtiles (une garde qui protège un cas irréel et laisse passer le vrai cas critique).

Un humain junior fatigué écrit un code plus **compact et honnête** : ce qui est là est ce qu'il a compris. Ni plus, ni moins. C'est plus dur à lire mais plus facile à auditer.

L'ingénieur senior lit les deux avec la même méfiance et **prouve** par les tests, pas par l'apparence.

---

## 4) ARÈNE : 3 DIFFS À CLASSER

Sur `04_debugging/humain_vs_ia_diff/`, tu trouveras (à créer par toi si absent, cf. exercice 2) trois paires `patch_A.js` / `patch_B.js` pour trois bugs différents. Ta mission :

1. Classe chaque patch (IA / humain) **avant** de lire les tests.
2. Lance les tests. Note le taux de bonne classification.
3. Écris pour chaque paire les 3 tells qui t'ont fait décider.

---

## EXERCICES

**EXO 1** : Reprends le bug ci-dessus. Réécris **toi-même** Patch X et Patch Y les yeux fermés (IA off), en essayant de reproduire le style IA sur l'un et le style humain sur l'autre. Compare avec les originaux, puis avec la version main d'un pair si tu peux. (25 min)

**EXO 2** : Choisis un bug de `04_debugging/HYPOTHESES_EXEMPLE.md`. Demande à une IA générative un patch (session enregistrée). Note les 3 tells qui te sautent aux yeux, sans réécrire toi-même. (15 min)

**EXO 3** : Rédige une checklist "review de PR humain vs IA" en 10 puces max, à afficher dans `31_annexes/`. (15 min)

---

## RÉSUMÉ

Deux patches valides ne se valent pas : l'un peut cacher un surcodage IA qui trompe l'audit visuel, l'autre peut cacher une garde humaine imprécise. La méthode reste la même : classer par tells, **prouver par tests**, ne jamais confondre "propre" et "correct". C'est le pont explicite entre `10_legacy_dungeon` (code humain incohérent) et `23_ai_native_dev/07_solo_vs_copilot_drill` (code IA plausible mais faux).
