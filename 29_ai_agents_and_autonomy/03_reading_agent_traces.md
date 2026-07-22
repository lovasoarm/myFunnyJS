---
stability: periss-2028
last_reviewed: 2026-07
depends_on_vendor: false
---
# 03 : LIRE UNE TRACE D'AGENT COMME UNE STACK TRACE

Temps de lecture ~25 min

40 actions enchaînées, chacune "raisonnable", et le résultat casse la prod. La cause
n'est jamais l'action 39. C'est presque toujours une décision précoce (action 3, 5, 8)
qui a orienté toutes les suivantes vers un chemin cohérent mais faux. Une trace
d'agent, ça se lit comme une stack trace : de haut en bas est trompeur, il
faut apprendre à sauter et à trier.

## Qu'est-ce qu'une trace, exactement

Une trace, c'est le journal ordonné des actions de l'agent :

```
[001] READ src/auth/login.js
[002] READ src/auth/session.js
[003] DECISION: "j'utilise jsonwebtoken plutôt que jose parce que déjà présent"
[004] EDIT src/auth/login.js (+ 24 lignes)
[005] RUN npm test -- auth
[006] READ tests/auth.test.js
...
[039] EDIT tests/auth.test.js (- 3 lignes)  <-- rouge sang
[040] RUN npm test -- auth → PASS
```

Sur 40 lignes, 8 à 12 sont des **décisions** (verbes explicites : "je choisis
de", "puisque X, alors Y", "j'ignore Z parce que…"). Les 30 autres sont des
**actions mécaniques** (lecture, édition, run test). Le tri décisions/actions
est ta première passe.

## Méthode : `bisect` humain

```
1. Skim la trace : combien d'actions, quels fichiers touchés ?
2. Identifie les DÉCISIONS (verbes : "j'ai choisi de", "puisque X, alors Y").
   Les actions mécaniques (edit, run test) ne comptent pas.
3. Pour chaque décision, note : "est-ce que je l'aurais prise ?"
4. La première décision où tu réponds NON = ta cause racine.
5. Toutes les actions suivantes sont contaminées, même si elles compilent.
```

Le "même si elles compilent" est la partie violente. Une action peut être
mécaniquement correcte (le test passe, le code compile) et sémantiquement
fausse (le test qui passe n'est plus le bon test). L'agent, contrairement
à un humain fatigué, n'a aucun mal à écrire 20 actions valides sur une
prémisse pourrie.

## Les 5 motifs de traces contaminées

1. **Choix de dépendance précoce** : l'agent voit `jsonwebtoken` dans le
   `package.json`, il l'utilise, mais ton équipe migre vers `jose`. 40
   actions plus tard, le code est fait mais à contre-courant.
2. **Interprétation d'un test rouge** : l'agent voit un test qui échoue,
   il l'"ajuste" au lieu de corriger le code. Les 20 actions suivantes
   confortent l'ajustement.
3. **Cast d'un type ambigu** : l'agent voit `any` dans TS, il le cast en
   ce qui l'arrange à l'endroit précis, sans remonter à la déclaration.
4. **Interprétation d'un TODO** : l'agent lit `// TODO: fix later`, décide
   que c'est SON fix, et implémente une solution qui n'a jamais été
   discutée par l'équipe.
5. **Cascade de renaming** : l'agent renomme une variable "pour la
   lisibilité", puis toute la trace suivante utilise le nouveau nom, y
   compris dans des fichiers qui ne devaient pas bouger.

## Anti-pattern

Lire la trace linéairement de 1 à 40. Tu vas te faire embarquer par la logique de
l'agent. Lis-la par sauts : lis les décisions, ignore les diffs, puis re-lis les
diffs uniquement à partir de la décision qui pue. Cette lecture par sauts est
un muscle qui se travaille : les 5-10 premières traces te prennent 40 min,
la 20e te prend 8 min.

## Le piège de la "trace lisible"

Une trace bien commentée par l'agent est PLUS dangereuse qu'une trace brute.
Les commentaires de l'agent sont sa propre narration : il te vend son
raisonnement. Un raisonnement narré convaincant peut cacher une décision
racine mauvaise mieux qu'une trace brute. Règle : **lis les diffs avant
les commentaires**. Le code ne ment pas, la narration si.

## La checklist "je remonte à la racine"

Devant une trace suspecte :

- [ ] Combien de décisions dans cette trace ? (attendu : 8-12 sur 40)
- [ ] Ai-je marqué chaque décision par OUI/NON/DOUTE ?
- [ ] La première décision "NON" est-elle documentée dans un ADR de la codebase ?
- [ ] Si non, pourquoi l'agent l'a-t-il prise seul ?
- [ ] Les actions suivant cette décision sont-elles cohérentes avec elle ?
- [ ] Un revert à cette décision fait-il tomber les 30 actions suivantes ? Si oui, c'est bien la racine.

Si tu coches ces 6 cases sur chaque trace de PR agent avant merge, ton
taux de reverts à 30 jours divise par 3.

## Exercice (35 min)

Un dépôt d'exemple `29_ai_agents_and_autonomy/traces_pool/`
contient 3 traces réelles :

- `trace_A.md` : agent qui a "amélioré" une fonction en cassant l'API publique.
- `trace_B.md` : agent qui a corrigé le bug mais désactivé un test.
- `trace_C.md` : agent qui a fait exactement ce qu'on demandait : et c'était mauvais.

Pour chaque trace, identifie la décision-racine et écris 2 lignes de review.
Chronomètre-toi : tu dois viser 10-12 min par trace, pas 30. Si tu dépasses,
c'est que tu lis linéairement.

## Ce qu'il faut noter sur la fiche de review

Pour chaque trace auditée, tiens un fichier `TRACE_REVIEW.md` dans ton dépôt :

```
## Trace agent 2026-07-04 (PR #482)
Décisions repérées : 11 sur 43 actions
Racine identifiée : action 05 : "j'utilise Map<> pour la cache"
   → alors que le projet impose `LRUCache` (règle non écrite, ADR-007)
Contamination : actions 06 à 41 (35 actions dépendantes)
Verdict : revert complet + spec B.O.R.N.É. rewrite (Non-goals a oublié LRUCache)
Coût audit : 14 min
```

Sur 3 mois, ce fichier devient ta bibliothèque personnelle des motifs
d'hallucination cohérente. C'est de l'or brut pour le chapitre 07 et
pour former ton équipe.

## Le pont vers le chapitre 04

Une fois la trace lue et la racine trouvée, tu as deux choix : accepter
avec ajustement, ou refuser. Le refus argumenté est l'objet du chapitre
suivant. Sans lecture correcte de la trace, ton refus est un caprice ;
sans refus argumenté, ta lecture est de la culture inutile.
