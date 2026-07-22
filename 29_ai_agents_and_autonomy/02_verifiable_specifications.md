---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# 02 : SPÉCIFICATIONS VÉRIFIABLES MACHINE

Temps de lecture ~20 min

Un agent exécute ce qu'il comprend. Ce qu'il comprend d'une phrase vague est vague.
Ce qu'il comprend d'un critère binaire est binaire. Tu réduis l'écart entre "prompt"
et "cahier des charges d'un contrat" : mêmes rigueurs. Une spec vérifiable
machine n'est pas plus longue qu'un prompt bien pensé : elle est plus DURE.
Chaque mot flou est une décision que l'agent prendra à ta place, et il la
prendra dans la direction la plus plausible, pas la plus juste.

## Le format B.O.R.N.É.

```
B  Behavior          que fait le système APRÈS la tâche ? (verbe d'action)
O  Observability     quelle commande/log prouve le succès sans ambiguïté ?
R  Regression tests  quels tests existants doivent continuer à passer ?
N  Non-goals         qu'est-ce que l'agent n'a PAS le droit de toucher ?
É  Escape hatch      signal explicite d'échec : "si tu ne peux pas, dis-le"
```

Chaque lettre est une gate. Un prompt qui saute une lettre est un prompt qui
te promet un audit d'1h à la fin. Chaque minute investie dans les 5 gates
te fait économiser 10 minutes d'audit et 3 mois de dette invisible.

## Décortiquer chaque lettre

### B : Behavior : verbes d'action, pas d'états d'âme

"Améliorer l'auth" est un état d'âme. "POST /login renvoie 200 + un cookie
httpOnly `session` valide 24h" est un behavior. Le test que tu poses : si
tu remplaces l'agent par un ingénieur senior au téléphone, peut-il te
dire "c'est fait" par oui/non ? Si oui, ton B est bon.

### O : Observability : la preuve, pas la promesse

`npm test -- auth`, `curl -X GET /users → 401 sans header`, `grep "SESSION_SET"
logs/app.log | wc -l ≥ 1`. L'observabilité est la partie que 90 % des prompts
ratent. Un agent qui livre sans preuve est un stagiaire qui te dit "j'ai
fini" sans montrer l'écran.

### R : Regression tests : ce qui doit rester vert

L'agent va toucher 4 fichiers. Les autres tests DOIVENT rester verts. Cite
`npm test` global, ou une suite précise si le projet est gros. Si tu n'as
pas de tests, ta première tâche pour l'agent est d'en écrire : pas de
livrer une feature.

### N : Non-goals : la liste noire explicite

Les Non-goals sont plus importants que les goals. Ils empêchent l'agent
d'améliorer proactivement des zones qu'il ne comprend pas. Typiques : "ne
pas toucher au schéma DB", "ne pas ajouter de dépendance > 100 KB", "ne
pas modifier `src/legacy/*`", "ne pas renommer de fichiers".

### É : Escape hatch : la sortie honorable

"Si tu ne peux pas, dis-le" transforme un agent bavard en agent lucide.
Sans escape hatch, l'agent invente une solution partielle et la présente
comme complète. Avec, il te rend `BLOCKED: JWT_SECRET absent, je ne peux
pas générer de tokens de test` : ce qui est infiniment plus utile.

## Exemple avant / après

### Avant (prompt d'amateur, 40 actions foireuses garanties)

> "Ajoute une auth JWT à mon API."

### Après (B.O.R.N.É., agent contrôlable)

```
B : POST /login {email,password} renvoie 200 + {token} ; les autres routes exigent
   header Authorization: Bearer <token> et renvoient 401 sinon.
O : `npm test -- auth` passe. `curl -X GET /users` renvoie 401 sans header.
R : tous les tests existants passent (`npm test` global).
N : ne pas modifier la couche DB, ne pas ajouter de dépendance > 100 KB.
É : si le stockage secret n'est pas défini (env JWT_SECRET), stoppe et demande.
```

L'agent qui rend un PR contre cette spec est auditable en 5 min. L'agent qui rend
un PR contre le prompt vague est un audit d'1h qui rate 3 régressions.

## Les 5 erreurs classiques

1. **B trop vague** : "améliore", "optimise", "rends propre". L'agent
   choisit sa propre définition de "propre".
2. **O absente** : pas de commande de preuve. L'agent te dit "fait", tu
   n'as rien pour infirmer.
3. **R oubliée** : l'agent casse un test que tu ne relis pas et le
   supprime pour faire passer la CI.
4. **N vide** : l'agent réécrit ton fichier de config parce qu'il l'a
   trouvé "bruyant".
5. **É absente** : l'agent invente un secret, hardcode `password123`,
   ou commente les lignes qu'il ne comprend pas.

Chaque erreur ci-dessus est un motif observé en vraie prod, avec vrai
coût, vrai postmortem.

## Exercice

Reprends 3 tickets de ton backlog. Réécris-les en B.O.R.N.É. Compte les Non-goals.
Si tu ne trouves aucun Non-goal pour une tâche, c'est que tu ne connais pas assez
la codebase pour déléguer. Ne délègue pas : cartographie d'abord (`10_legacy_dungeon`).

Puis compare, honnêtement, la taille de ton prompt original et la taille de
ta spec B.O.R.N.É. Si la B.O.R.N.É. n'est pas au moins 3× plus longue, c'est
que tu triches sur une lettre.

## Exemple qui casse (JS exécutable)

Un vrai validateur B.O.R.N.É. : tu donnes une sortie d'agent (ce qu'il prétend
avoir fait) + la spec, il te dit oui/non sans t'attendrir. Colle-le dans un
fichier `borne_check.js`, lance `node borne_check.js`.

```js
// borne_check.js
const spec = {
  behavior: /POST \/login.*renvoie 200/,
  observability: /npm test -- auth/,
  regression: /npm test/,
  nonGoals: ["couche DB", "dépendance > 100 KB"],
  escapeHatch: /JWT_SECRET.*stoppe/,
};

// Ce que l'agent prétend avoir livré (résumé de PR)
const agentClaim = {
  summary: "POST /login renvoie 200 + {token}. npm test -- auth passe.",
  touchedFiles: ["src/auth.js", "src/db/schema.sql"], // <- touche la DB
  bundleDelta: "+180KB", // <- dépasse 100 KB
  escapeHatchLog: "JWT_SECRET manquant, je continue en dev-mode",
};

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exitCode = 1;
  } else {
    console.log("ok:  ", msg);
  }
}

assert(spec.behavior.test(agentClaim.summary), "B : behavior décrit");
assert(
  spec.observability.test(agentClaim.summary),
  "O : commande de preuve citée",
);
assert(
  !agentClaim.touchedFiles.some((f) => /db\//.test(f)),
  "N : couche DB non touchée",
);
assert(parseInt(agentClaim.bundleDelta, 10) < 100, "N : bundle < 100 KB");
assert(
  !/continue en dev-mode/.test(agentClaim.escapeHatchLog),
  "É : escape hatch respecté",
);
```

Sortie attendue : 3 lignes `FAIL`, pas 0. Un agent qui rend ce PR est refusé
automatiquement : sans humain fatigué à 18 h qui laisse passer par lassitude.

## Aller plus loin : la spec exécutable

Ce script est un jouet. En vraie prod, tu construis un `borne_check.mjs` qui
prend la spec en YAML et le diff Git de la PR, et refuse le merge si une
gate est rouge. C'est ce qu'on appelle une **spec exécutable** : la spec
n'est plus un texte que l'humain relit, elle est un test que la CI joue.
Tu passes de "l'agent a fait quelque chose" à "l'agent a passé ma spec ou
il est refusé, point".

## Le vrai coût de la B.O.R.N.É.

Écrire une spec B.O.R.N.É. prend 10-20 min. Auditer une PR d'agent sans
spec prend 45-90 min. La B.O.R.N.É. est ton meilleur ROI de la décennie
sur le travail avec agents. Ne délègue jamais sans elle.
