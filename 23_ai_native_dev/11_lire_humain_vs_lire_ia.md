---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# LIRE UN HUMAIN VS LIRE UNE IA : LES DEUX PIÈGES À NE PAS CONFONDRE
Temps de lecture ~10 min

> **Prérequis** : avoir fait `07_solo_vs_copilot_drill.md`, `09_ai_hallucination_gym.md`, `10_ambiguous_ai_response.md`.
> **Objectif** : distinguer deux réflexes de lecture radicalement différents. Le code humain ment par incohérence ; le code IA ment par plausibilité. Confondre les deux, c'est se faire tuer par les deux.

---

## 1) POURQUOI ON NE PEUT PAS LES LIRE PAREIL

Un humain fatigué copie/colle, oublie un cas, laisse une variable morte, mélange deux conventions dans le même fichier. Son code trahit son état mental : tu vois les cicatrices. Une IA, elle, génère un texte statistiquement moyen : cohérent en surface, faux en profondeur. Elle n'a ni fatigue ni convention personnelle : elle a une distribution.

Résultat : les indices d'un humain qui a bâclé (variable `tmp2`, commentaire "TODO fix later", indentation cassée) n'existent pas chez l'IA. Et les indices d'une IA qui hallucine (nom d'API qui n'existe pas, signature inventée, `import` fantôme) n'existent pas chez l'humain. Croire qu'on lit "du code" en général, c'est se laisser piéger par les deux.

---

## 2) TABLEAU COMPARATIF DES PIÈGES

| Dimension                | Piège du code humain                                          | Piège du code IA                                                     |
| ------------------------ | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| Symptôme visible         | Incohérence : styles mélangés, cas manqués, dette technique     | Plausibilité : tout paraît propre, aligné, bien nommé                |
| Erreur typique           | Oubli, effet de bord ignoré, cas limite pas traité             | API inventée, signature fausse, comportement halluciné              |
| Ce qui trahit            | Cicatrices dans l'historique, commit "quick fix", commentaires | Fluidité suspecte, pas une seule hésitation, aucun `// FIXME`       |
| Réflexe de lecture       | Comprendre l'intention derrière la maladresse                  | Vérifier chaque nom, chaque signature, chaque import contre la doc  |
| Question à se poser      | "Pourquoi l'auteur a-t-il fait ce compromis ?"                 | "Cette fonction existe-t-elle vraiment ? Cette signature est-elle bonne ?" |
| Test qui casse le piège  | Relire l'historique git + poser la question à l'auteur         | Exécuter, lire les erreurs, ouvrir la doc officielle                 |

---

## 3) CINQ CAS CONCRETS D'IA PLAUSIBLE MAIS FAUSSE À DÉMONTER

Pour chaque cas : (a) lis le code, (b) écris ton diagnostic en 3 lignes, (c) écris la correction. **Ne triche pas en scrollant en bas.**

### CAS 1 : Un import fantôme

```javascript
import { debounceAsync } from "lodash";

const search = debounceAsync(async (query) => {
  const res = await fetch(`/api/search?q=${query}`);
  return res.json();
}, 300);
```

L'IA a fusionné `debounce` (lodash) et l'idée d'async. Résultat : `debounceAsync` n'existe pas dans lodash. `import` réussit silencieusement (tree-shaking sans erreur si le nom n'existe pas dans certaines configs), et `search` devient `undefined`. Le bug tape à l'exécution, pas au parse. **Diagnostic** : nom d'export halluciné. **Correction** : `import { debounce } from "lodash"` puis wrapper l'async à la main.

### CAS 2 : Une signature inventée

```javascript
const rows = await db.query("SELECT * FROM shinobis WHERE village = $1", "konoha", { timeout: 5000 });
```

Les drivers Postgres (`pg`, `postgres`) prennent `(text, values[])`. Passer les paramètres à plat en 3e/4e argument marche dans certains ORM mais pas dans les drivers bas niveau : ici les params sont ignorés ou l'appel échoue silencieusement. L'IA a mélangé deux conventions. **Diagnostic** : signature inventée par interpolation d'ORMs différents. **Correction** : `db.query("... WHERE village = $1", ["konoha"])` et gestion du timeout au niveau du pool.

### CAS 3 : Un comportement d'API halluciné

```javascript
const result = fetch("/api/rasengan").timeout(3000);
```

`fetch` n'expose pas `.timeout()`. L'IA a projeté l'ergonomie d'axios sur fetch. **Diagnostic** : méthode qui n'existe pas dans l'API standard. **Correction** : utiliser `AbortController` avec `setTimeout` pour annuler, ou passer par `AbortSignal.timeout(3000)` (Node 17+, navigateurs récents).

### CAS 4 : Une "bonne pratique" qui casse la sémantique

```javascript
// Suggestion IA : "toujours capturer les erreurs"
async function loadNindo(id) {
  try {
    return await api.loadNindo(id);
  } catch (e) {
    console.log(e);
    return null;
  }
}
```

L'IA applique une règle générique ("toujours try/catch") sans savoir que `loadNindo` est appelée dans un flux qui distingue "aucun résultat" de "erreur réseau". Retourner `null` sur erreur écrase l'information et transforme un incident réseau en absence de donnée. **Diagnostic** : catch-all sémantique. **Correction** : soit propager, soit retourner un `Result<T,E>` explicite, jamais un `null` qui ment.

### CAS 5 : Un test qui teste l'implémentation, pas le contrat

```javascript
test("charge un dossier", async () => {
  const spy = jest.spyOn(db, "query");
  await chargerDossier(42);
  expect(spy).toHaveBeenCalledWith("SELECT * FROM dossiers WHERE id = $1", [42]);
});
```

L'IA a écrit un test qui verrouille la requête SQL exacte. Si demain quelqu'un change la requête (ajoute un `LEFT JOIN`, renomme la colonne), le test casse alors que le contrat métier tient. **Diagnostic** : test couplé à l'implémentation, pas au comportement. **Correction** : appeler `chargerDossier(42)` sur une vraie base de test ou un fake, et vérifier la valeur retournée, pas l'appel SQL.

---

## 4) DRILL

Reprends les 5 cas dans l'ordre. Pour chacun : écris ton diagnostic **avant** de lire le mien. Compte tes bonnes réponses. En dessous de 4/5, refais `09_ai_hallucination_gym.md`.

---

## 5) OÙ L'ANALOGIE CASSE

L'IA n'est pas "un dev débutant" ni "un dev pressé" : elle est une distribution de textes plausibles. Lire son code, c'est vérifier chaque symbole contre la réalité (doc, exécution, types), pas chercher son intention. Lire du code humain, c'est chercher l'intention derrière l'imperfection.
