---
stability: intemporel
---

# POSTMORTEM : {nom du mini-projet}
Temps de lecture ~5 min

> Ce document se remplit **après** avoir terminé le projet, pas pendant.
> L'honnêteté compte plus que l'image. Un POSTMORTEM qui dit "tout s'est
> super bien passé, aucun blocage" est presque toujours un POSTMORTEM
> non rempli. Si tu as vraiment rien à raconter, le projet était sous ton
> niveau.

---

## CE QUI A COINCÉ

### Le moment où tu t'es planté (obligatoire, au moins un)

Décris **précisément** le moment. Pas "c'était dur" : le fichier, l'heure approximative, ce que tu croyais faire vs ce qui se passait vraiment.

**Résolution** : comment tu t'en es sorti, ou pas (c'est OK d'assumer un point resté flou à la fin).

**Leçon** : ce que ça t'apprend sur le sujet en général, pas juste sur ce projet.

---

### Une décision que tu prendrais différemment aujourd'hui

Une seule. La plus douloureuse. Pas trois pour diluer.

**Ce que tu avais fait** :

**Ce que tu ferais maintenant** :

**Pourquoi tu ne l'avais pas fait à l'époque** (contexte, contrainte, ignorance : sois honnête sur la vraie raison).

---

## CE QUE TU NE SAIS PAS ENCORE (mais tu sais où regarder)

> Cette section est un marqueur de maturité, pas de faiblesse. Voir
> [`00_referentiel/JE_NE_SAIS_PAS_ENCORE.md`](../../00_referentiel/03_JE_NE_SAIS_PAS_ENCORE.md)
> pour le pourquoi. Résumé : "je ne sais pas encore, mais je sais où
> regarder si j'en ai besoin" bat "je fais semblant". Toujours.

Liste 1 à 3 points du projet que tu n'as pas complètement maîtrisés, avec **où tu irais chercher** si le sujet remontait demain :

- Point flou : ...
  - Où je regarderais : (module N du curriculum / doc officielle X / commande `Y --help`)
- Point flou : ...
  - Où je regarderais : ...

Si cette section est vide, deux options : soit tu as vraiment tout compris (rare et suspect), soit tu ne t'es pas assez frotté aux parties inconfortables. Retourne relire tes commits douloureux et sois honnête.

---

## CE QUI A VRAIMENT MARCHÉ

Une technique, une méthode, un réflexe qui t'a fait gagner du temps. Nomme-la, dis pourquoi elle a marché **sur ce projet précis**.

---

## GATE SECURITE (OWASP) : OBLIGATOIRE POUR CLORE LE PROJET

Un mini-projet non securise n'est pas un mini-projet livre. Cette checklist
s'applique aux **17 mini-projets** du parcours. Complete `SECURITY.md` du
projet **avant** de considerer ce POSTMORTEM comme fini. Coche chaque ligne
avec un statut : `OK` / `NA (justifie)` / `TODO (bloquant)`.

### OWASP Top 10 (2021) applique au projet

| # | Categorie OWASP | Question a te poser sur CE projet | Statut |
|---|---|---|---|
| A01 | Broken Access Control | Ai-je des endpoints/commandes qui devraient etre restreints ? Comment je le prouve ? |  |
| A02 | Cryptographic Failures | Y a-t-il des donnees sensibles en transit ou au repos ? Chiffrees comment ? |  |
| A03 | Injection | Toutes les entrees externes sont-elles validees / parametrees (SQL, shell, HTML, regex) ? |  |
| A04 | Insecure Design | Ai-je pense a la surface d'attaque **avant** d'ecrire le code ? (voir `cahierdescharges.md`) |  |
| A05 | Security Misconfiguration | Valeurs par defaut, headers, CORS, verbose errors en prod : lesquelles restent ouvertes ? |  |
| A06 | Vulnerable Components | `npm audit` propre ? Snapshot commite dans `SECURITY.md` ? |  |
| A07 | Auth Failures | Si le projet a de l'auth : timing attacks, bruteforce, secrets forts ? |  |
| A08 | Software / Data Integrity | Signatures, verif d'integrite, source des deps : ou est le risque de tampering ? |  |
| A09 | Logging & Monitoring | Ai-je un log minimal des erreurs et acces sensibles ? |  |
| A10 | SSRF | Le projet fait-il des requetes vers des URL fournies par l'utilisateur ? Whitelist / timeout / no-metadata ? |  |

### Regle de cloture

- **0 ligne TODO** : projet livrable.
- **Toute ligne TODO restante** : projet **non livrable**. Meme si les tests passent.
  Meme si le portfolio est pret. Un post-mortem qui laisse un TODO OWASP est un
  aveu que le projet n'est pas fini.
- **Toute ligne NA** doit tenir en une phrase de justification honnete (« pas
  d'entree utilisateur externe », « projet local, pas de reseau », etc.).

### Reference

- `22_security/` pour la theorie.
- `00_getting_started/05_devsec_perso.md` pour l'hygiene minimale.
- `SECURITY.md` du projet pour la version detaillee (celui-ci est le miroir
  de cloture).
