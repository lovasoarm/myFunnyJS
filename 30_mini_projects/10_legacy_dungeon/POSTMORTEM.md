---
stability: intemporel
---

# POSTMORTEM : LEGACY DUNGEON
Temps de lecture ~6 min

> Ce document se remplit après avoir terminé le projet, pas pendant. L'honnêteté compte plus que l'image.

---

## AVANT DE REMPLIR : POURQUOI CE POSTMORTEM EST DIFFÉRENT DES 9 AUTRES

Dans les autres mini-projets, le POSTMORTEM documente ce qui a coincé pendant la CONSTRUCTION d'un système. Ici, il documente ce qui a coincé pendant la COMPRÉHENSION d'un système déjà construit par quelqu'un d'autre. La confusion n'est pas un échec de conception de ta part : c'est la matière première du projet. Si ce document ne contient aucun moment réel de "j'étais complètement paumé", soit le repo choisi était trop simple, soit ce postmortem n'est pas honnête.

---

## CE QUI A COINCÉ

### Le moment où tu t'es senti perdu (obligatoire, au moins un)

(à remplir : décris précisément le moment, pas juste "c'était dur". Exemple de niveau de détail attendu : "Après 40 minutes sur `dispatcher.js`, je ne comprenais toujours pas comment la fonction `resolve` était injectée. J'ai cru à un bug de ma lecture avant de comprendre qu'il s'agissait d'un système de plugin chargé dynamiquement, jamais mentionné dans le README.")

**Résolution** : (comment tu t'en es sorti, ou pas : c'est ok de documenter un point resté flou à la fin)

**Leçon** : (ce que cette confusion t'apprend sur la lecture de code inconnu en général, pas juste sur ce repo précis)

---

### Une convention ou un pattern qui t'a surpris

(à remplir : un nommage inhabituel, une façon de gérer les erreurs différente de ce que t'as appris dans `05_error_handling`, une organisation de fichiers qui ne suit aucun pattern du curriculum)

**Résolution** : (comment t'as fini par accepter ou comprendre cette convention)

**Leçon** : (ce que ça t'apprend sur la diversité des styles de code que tu vas croiser en vrai, au-delà de ce que ce curriculum t'a montré)

---

### Le bug : plus dur ou plus facile à trouver que prévu ?

(à remplir honnêtement : si t'as trouvé le bug en 10 minutes, dis-le. Si t'as mis 3h à comprendre pourquoi ton test ne capturait pas le bon comportement, dis-le aussi)

**Résolution** :

**Leçon** :

---

## CE QUI A VRAIMENT MARCHÉ

(à remplir : qu'est-ce qui, dans la méthode de `27_team_craft/04_navigate_codebase.md`, t'a vraiment fait gagner du temps ? Le grep ciblé ? Les tests comme documentation ? Le fait de NE PAS tout lire linéairement ?)

---

## CE QUE TU FERAIS DIFFÉREMMENT SI TU REFAISAIS CE PROJET SUR UN AUTRE REPO

```
1. (à remplir)
2. (à remplir)
3. (à remplir)
```

---

## CE QUI RESTE FLOU MÊME APRÈS LE PROJET

Cette section n'existe dans aucun autre mini-projet du curriculum, et c'est volontaire. Dans les 9 précédents, le projet est "fini" quand tout fonctionne. Ici, il est possible (normal, même) de finir avec des zones du repo encore incomprises. Documenter honnêtement ce qui reste flou est une compétence professionnelle réelle : savoir dire "je ne sais pas encore comment ça marche, mais je sais où regarder si j'en ai besoin" plutôt que de prétendre une maîtrise totale.

```
(à remplir : liste honnête, sans honte)
```

---

## DÉCISIONS PRISES PENDANT LE PROJET, TENUES OU ABANDONNÉES

| Décision initiale | Tenu ? | Résultat |
|---|---|---|
| Repo choisi : (nom) | (Tenu / Abandonné en cours de route) | (pourquoi) |
| Mot-clé de recherche initial pour cartographier | (Tenu / Changé) | (pourquoi) |
| Bug choisi parmi les issues existantes ou créé soi-même | (Tenu / Changé) | (pourquoi) |
| Limite stricte de 2h sur la cartographie | (Respectée / Dépassée) | (si dépassée, de combien et pourquoi) |


## Protection des données

Si tu mentionnes des données réelles (users, clients, endpoints internes), anonymise-les ou remplace par des noms fictifs. Un post-mortem est destiné à circuler.


---

## PUBLICATION (obligatoire)

- Lien du dépôt public : `https://github.com/<toi>/<projet>`
- Lien du billet de blog (si rédigé) : ...
- Date de publication : ...
- Peer-review reçue de : `@pseudo`

## Comment j'ai encaissé le drift

Section obligatoire si `SPEC_DRIFT_MODE=on` (voir `SPEC_DRIFT_TRIGGERS.md`).
Une ligne par déclencheur activé (J+1, J+3, J+5) avec le coût réel payé.
---

## OWASP PASSE (obligatoire, gate securite)

> Cette section est un **gate**. Un POSTMORTEM sans elle est rejete par le
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
