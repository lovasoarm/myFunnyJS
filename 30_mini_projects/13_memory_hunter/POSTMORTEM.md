---
stability: intemporel
---

# POSTMORTEM : MEMORY HUNTER

Temps de lecture ~2 min


Rétrospective à froid, une fois le projet livré. Pas de langue de bois : le postmortem sert au prochain toi, pas à ton ego.

## CE QUI S'EST BIEN PASSÉ

(à remplir) : les décisions qui ont tenu.

## CE QUI A CASSÉ

(à remplir) : les bugs, les mauvaises hypothèses, les impasses.

## LA SURPRISE

(à remplir) : le truc que la spec cachait et que tu n'avais pas vu venir.

## CE QUE JE FERAIS DIFFÉREMMENT

(à remplir) : concret, actionnable.

## COMPÉTENCE PROUVÉE

(à remplir) : en une phrase, ce que ce projet prouve que tu sais faire, utilisable en entretien.

## (attention) CE QUE LE PROJET M'A APPRIS SUR MOI

(à remplir) : où j'ai voulu tricher, sauter une étape, demander à l'IA trop tôt.

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
