---
stability: periss-2028
---

# trace_C : l'agent qui fait exactement ce qu'on demande, et c'est mauvais

Contexte : ticket = "ajoute un endpoint `GET /users/:id/friends` qui
retourne la liste des amis d'un user, format JSON".

```
[001] READ src/routes/users.js
[002] READ src/models/user.js
[003] READ src/models/friendship.js
[004] DECISION : "friendship est bidirectionnel : je dois joindre les
      deux sens (userA=id OR userB=id)."
[005] EDIT src/routes/users.js (+ 24 lignes, handler GET friends)
[006] RUN npm test → tous verts (aucun test sur ce nouvel endpoint)
[007] DECISION : "ticket dit rien sur pagination, je renvoie tout."
[008] DECISION : "ticket dit rien sur auth, je copie le middleware du
      voisin GET /users/:id (public)."
[009] DECISION : "ticket dit rien sur le format d'un ami : je renvoie
      l'objet user complet (email, phone, addresses inclus)."
[010] RUN curl localhost:3000/users/1/friends → 200 OK, JSON valide
[011] COMMIT "feat: GET /users/:id/friends"
```

Question : le ticket est respecté à la lettre. Les tests passent. Le
endpoint marche. Alors pourquoi ce commit ne devrait jamais partir en
prod ? Trouve 3 problèmes différents, à 3 niveaux différents
(sécurité / perf / vie privée).

Indice : "le ticket ne dit rien sur X" n'est pas une autorisation,
c'est un signal que tu dois aller demander.