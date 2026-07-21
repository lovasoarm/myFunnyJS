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
> [`00_referentiel/JE_NE_SAIS_PAS_ENCORE.md`](../../00_referentiel/JE_NE_SAIS_PAS_ENCORE.md)
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

## SI TU REFAISAIS CE PROJET DEMAIN

1. (à remplir)
2. (à remplir)
3. (à remplir)

Trois lignes maximum. Pas dix.

---

## SIGNAL DE RÉUSSITE VRAIMENT ATTEINT ?

Coche seulement ce qui est vrai, sans arrondir.

- [ ] `verify.sh` passe (si applicable).
- [ ] Je peux ré-expliquer la décision principale de l'ADR **6 mois après**, sans relire le fichier.
- [ ] La section "ce que tu ne sais pas encore" ci-dessus est **remplie**, pas laissée vide par flemme.
- [ ] Aucun `TODO` bloquant n'a été laissé dans le code livré.

---

## OWASP PASSE (obligatoire, gate securite)

> Cette section est un **gate**. Un POSTMORTEM sans elle est rejete par le
> linter `.internal/scripts/lint_postmortem_owasp.py`. Sans gate obligatoire,
> la securite redevient un module theorique.
>
> Reference : `22_security/06_owasp_checklist.md`.

Pour chaque item OWASP Top 10, coche exactement une case :

- [ ] A01 Broken Access Control : verifie / non verifie / non applicable (justifier)
- [ ] A02 Cryptographic Failures : verifie / non verifie / non applicable (justifier)
- [ ] A03 Injection : verifie / non verifie / non applicable (justifier)
- [ ] A04 Insecure Design : verifie / non verifie / non applicable (justifier)
- [ ] A05 Security Misconfiguration : verifie / non verifie / non applicable (justifier)
- [ ] A06 Vulnerable Components : verifie / non verifie / non applicable (justifier)
- [ ] A07 Identification & Auth Failures : verifie / non verifie / non applicable (justifier)
- [ ] A08 Software & Data Integrity Failures : verifie / non verifie / non applicable (justifier)
- [ ] A09 Security Logging & Monitoring : verifie / non verifie / non applicable (justifier)
- [ ] A10 Server-Side Request Forgery : verifie / non verifie / non applicable (justifier)

> Une case "non applicable" sans justification = gate echoue.
