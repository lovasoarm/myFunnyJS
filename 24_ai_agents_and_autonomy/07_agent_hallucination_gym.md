[PERISSABLE] PÉRISSABLE : vérifié 2026-07

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
Intention : "Ajoute un chakra_gate OAuth."
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
