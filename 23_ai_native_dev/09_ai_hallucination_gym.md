---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# 09 : AI Hallucination Gym
Temps de lecture ~5 min

> 10 réponses IA volontairement fausses. Ta mission : les **démonter point par point**.

## Format

Chaque item : (Q utilisateur) → (R IA plausible mais fausse) → (ta démolition).

---

### 1
**Q** : "Comment annuler une Promise en JS natif ?"
**R (IA)** : "Utilise `Promise.cancel()`."
**À toi** : cette méthode n'existe pas. Explique la vraie approche (AbortController).

### 2
**Q** : "`Array.prototype.sort` en JS est-il stable ?"
**R (IA)** : "Non, jamais."
**À toi** : depuis ES2019, stable **par spec**. Prouve-le.

### 3
**Q** : "`typeof NaN` renvoie ?"
**R (IA)** : `"nan"`.
**À toi** : `"number"`. Explique pourquoi c'est cohérent (IEEE 754).

### 4
**Q** : "Comment faire un vrai `sleep` bloquant en Node ?"
**R (IA)** : "`Thread.sleep(1000)`."
**À toi** : n'existe pas en JS. `await new Promise(r => setTimeout(r, 1000))`.

### 5
**Q** : "`===` compare les objets par valeur ?"
**R (IA)** : "Oui."
**À toi** : par **référence**. Prouve avec `{a:1} === {a:1}`.

### 6
**Q** : "En React, `useEffect(() => {}, [])` s'exécute avant le render ?"
**R (IA)** : "Oui."
**À toi** : **après** commit. `useLayoutEffect` est synchrone après DOM mutations.

### 7
**Q** : "SQL `LIMIT` sans `ORDER BY` renvoie toujours les mêmes lignes ?"
**R (IA)** : "Oui."
**À toi** : non garanti. Prouve avec un contre-exemple.

### 8
**Q** : "HTTPS chiffre l'URL ?"
**R (IA)** : "Non, seulement le body."
**À toi** : URL chiffrée (part de la request). Ce qui fuit : SNI (hostname).

### 9
**Q** : "`Object.freeze` gèle profondément ?"
**R (IA)** : "Oui."
**À toi** : shallow. Écris `deepFreeze`.

### 10
**Q** : "Un JWT est chiffré ?"
**R (IA)** : "Oui, c'est sécurisé."
**À toi** : **signé** ≠ **chiffré**. Le payload est en base64, lisible. Prouve.

---

## Livrable

`REBUTTALS.md` avec ta démolition + le lien vers la source officielle (spec / MDN / RFC).
