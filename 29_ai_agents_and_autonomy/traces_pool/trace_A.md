---
stability: periss-2028
---

# trace_A : l'agent qui "améliore" et casse l'API publique

Contexte : ticket = "optimise `formatUserName(user)` dans `src/format.js`,
elle est lente sur 10k appels".

```
[001] READ src/format.js
[002] READ src/format.test.js
[003] DECISION : "la fonction accepte {firstName, lastName}. Je vais
      accepter aussi une string simple pour simplifier les call sites."
[004] EDIT src/format.js (+ 6 lignes, signature élargie)
[005] READ src/api/users.js
[006] READ src/api/profile.js
[007] READ src/emails/welcome.js
[008] DECISION : "les 3 call sites passent tous un objet, aucun ne passe
      de string. Mais autant préparer le futur."
[009] EDIT src/format.js (+ 2 lignes, cache Map par user.id)
[010] RUN npm test → PASS (0 test couvre la string en entrée)
[011] RUN benchmark : 10k appels : 42ms → 3ms
[012] COMMIT "perf: cache formatUserName + accepte string"
```

Question : la première décision où tu réponds NON, c'est laquelle ?
Indice : le ticket parlait de perf. Pas d'élargir un contrat public.

Cherche aussi : quelle propriété du cache va casser en prod que les
tests ne voient pas ? (indice : `user.id` unique, `firstName` mutable).