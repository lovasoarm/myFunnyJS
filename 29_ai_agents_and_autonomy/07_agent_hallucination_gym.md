---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# 07 : AGENT HALLUCINATION GYM
Temps de lecture ~30 min

10 traces d'agent piégées. Ta mission : identifier la décision-racine et proposer
un refus argumenté. Chaque item est présenté brutalement : c'est à toi de sentir
le piège.

---

### Trace 1
Intention : "Ajoute un cache Redis à cette route."
Actions : installe `redis`, ajoute wrapper, ajoute test qui mocke Redis, passe.
Piège : la route est appelée 12 fois par jour. Cache inutile, coût ops en hausse.
Décision-racine : action 1 (installer sans mesurer le besoin).

### Trace 2
Intention : "Ce test est flaky, stabilise-le."
Actions : ajoute `retry(3)` autour du test, passe.
Piège : le test cachait une race condition réelle en prod.
Décision-racine : action 1 (traiter le symptôme).

### Trace 3
Intention : "Migre cette fonction en TypeScript."
Actions : ajoute `any` partout où le type est complexe.
Piège : le TS n'apporte plus de sûreté, juste du bruit.
Décision-racine : action 2 (choisir `any` par facilité).

### Trace 4
Intention : "Corrige la vulnérabilité XSS dans le champ commentaire."
Actions : ajoute `DOMPurify.sanitize()` côté client uniquement.
Piège : côté serveur reste vulnérable, un client custom bypasse.
Décision-racine : action 1 (défense côté client seul).

### Trace 5
Intention : "Ajoute un login OAuth."
Actions : hardcode le client_id dans le repo, l'ajoute au commit.
Piège : le client_id est ok public, mais le client_secret suit à l'action 8.
Décision-racine : action 8 (secret en clair).

### Trace 6
Intention : "Optimise cette requête N+1."
Actions : ajoute un `JOIN` monstre qui ramène 40k lignes à chaque appel.
Piège : la vraie fix était un `IN (...)` avec batching.
Décision-racine : action 2 (choisir JOIN sans mesurer).

### Trace 7
Intention : "Ajoute retry sur les appels HTTP externes."
Actions : `retry(5, backoff exponential)` sur POST.
Piège : POST non idempotent → doubles tributs.
Décision-racine : action 1 (retry sans idempotence).

### Trace 8
Intention : "Supprime le code mort."
Actions : supprime une fonction utilisée par reflection (`obj[name]()`).
Piège : les tests passent, la prod pète en Q4.
Décision-racine : action 4 (confiance aveugle dans "aucun call site trouvé").

### Trace 9
Intention : "Refactor ce fichier de 800 lignes."
Actions : découpe en 12 fichiers de 60 lignes, chacun avec son abstraction.
Piège : la lisibilité globale est pire : couplage temporel invisible.
Décision-racine : action 3 (découpage sans identifier les cohésions réelles).

### Trace 10
Intention : "Ajoute des logs pour débugger ce bug intermittent."
Actions : ajoute 200 `console.log` en prod.
Piège : log spam, coûts CloudWatch × 5, aucune corrélation possible.
Décision-racine : action 1 (log au lieu de trace structurée corrélée).

---

## Livrable

Pour chaque trace, écris 3 lignes dans `MY_ANSWERS.md` :
1. Décision-racine identifiée.
2. Refus argumenté (2 phrases max).
3. Ce que tu proposerais à la place.

Compare ensuite à `SOLUTIONS.md` (fourni séparément, à ne PAS ouvrir avant).

## Exemple qui casse (JS exécutable)

Un mini simulateur d'agent qui hallucine à coup sûr, pour t'entraîner à
détecter la décision-racine sans lire l'humain qui l'a écrite. Lance
plusieurs fois : la trace change, le piège reste.

```js
// hallucination_sim.js
const intents = [
  { intent: "Ajoute un cache Redis à cette route",
    trap:   "installe redis sans mesurer le trafic réel",
    root:   "installation avant mesure" },
  { intent: "Ce test est flaky, stabilise-le",
    trap:   "wrap le test dans retry(3)",
    root:   "symptôme traité, cause ignorée" },
  { intent: "Supprime le code mort",
    trap:   "supprime une fonction appelée par reflection",
    root:   "confiance aveugle dans un grep négatif" },
];

function fakeAgentTrace() {
  const t = intents[Math.floor(Math.random() * intents.length)];
  const actions = [
    `1. lit la route ciblée`,
    `2. ${t.trap}`,
    `3. ajoute un test qui valide la sortie, pas les invariants`,
    `4. commit, push, "ready for review"`,
  ];
  return { intent: t.intent, actions, _rootTruth: t.root };
}

// Ta mission : identifier la décision-racine SANS regarder _rootTruth.
const trace = fakeAgentTrace();
console.log("Intent :", trace.intent);
trace.actions.forEach((a) => console.log(a));

// Auto-vérif après ta réponse
function grade(guess) {
  const ok = trace._rootTruth.toLowerCase()
    .split(" ").filter((w) => w.length > 4)
    .every((w) => guess.toLowerCase().includes(w));
  console.log(ok ? "ok : root capté" : `FAIL : root réel = ${trace._rootTruth}`);
}

grade("l'agent a ajouté un cache sans regarder le trafic"); // exemple
```

Réponds AVANT d'appeler `grade`. C'est le seul moyen de sentir la différence
entre "je vois le piège" et "je le vois après coup".
