---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# EXPLIQUER L'EVENT LOOP À UN ENFANT DE 5 ANS
Temps de lecture ~4 min

Si tu n'arrives pas à expliquer l'event loop à un enfant de 5 ans, c'est que tu ne l'as pas compris. Feynman, en substance.

Cette leçon n'ajoute pas de contenu technique. Elle t'oblige à en enlever.

---

## LE FORMAT IMPOSÉ

Rédige (dans `03_async/04_event_loop/mon_explication_5_ans.md`) une explication de 5 à 8 lignes, sans un seul mot technique. Interdits : `microtask`, `macrotask`, `queue`, `callback`, `thread`, `promise`, `stack`, `heap`, `synchrone`, `asynchrone`, `scheduler`. Autorisés : tout ce qui parlerait à un enfant qui regarde un dessin animé.

Puis vérifie que ton texte permet à un lecteur naïf de prédire correctement la sortie de :

```js
console.log("A")
setTimeout(() => console.log("B"), 0)
Promise.resolve().then(() => console.log("C"))
console.log("D")
```

Réponse attendue : `A D C B`. Si ton explication ne fait pas tomber le bon ordre, elle est fausse (ou trop vague).

---

## EXEMPLE DE CE QU'ON CHERCHE (à ne PAS copier)

Imagine un cuisinier dans une cuisine. Il a une liste de plats à préparer sur son plan de travail : il les fait un par un, dans l'ordre. Quand quelqu'un lui glisse un mot avec une petite tâche urgente (par exemple : "assaisonne ce plat"), il termine ce qu'il est en train de faire, puis fait toutes les petites tâches urgentes d'un coup. Ensuite seulement il regarde la sonnette de la porte, qui lui signale les commandes à emporter (les plus lentes). Il ne peut jamais faire deux choses en même temps, mais il ne laisse jamais la cuisine vide.

Dans cette histoire : petites tâches urgentes = ce que ton `Promise.then` déclenche. Sonnette = ce que ton `setTimeout` déclenche. Le cuisinier = le thread principal.

---

## POURQUOI CE FORMAT

Un dev qui sait expliquer sans jargon a compris. Un dev qui ne sait qu'expliquer avec le vocabulaire technique a mémorisé. En entretien, la question "explique l'event loop à un enfant" tue plus de candidats que la question "code une queue de microtasks".

---

## LIVRABLE + CRITÈRE

Livrable : `mon_explication_5_ans.md` (5 à 8 lignes, sans mots interdits).
Critère : trois lecteurs non-tech (colocataire, parent, ami) prédisent correctement la sortie du programme ci-dessus après avoir lu ton texte, sans autre indice.

---

Voir aussi : `03_async/04_event_loop/03_event_loop_grimoire.md`, `27_team_craft/13_three_audiences_drill.md`.
