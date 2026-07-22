---
stability: intemporel
---

# POSTMORTEM : 18_human_vs_ai_smell

## Résumé en une ligne

Quel est le bug racine que j'ai le plus mal vu au départ, et pourquoi ?

## Ce qui a marché

- Méthode :
- Signal utile :

## Ce qui a foiré

- Piège que j'ai raté en première lecture :
- Pourquoi je l'ai raté :

## Différence de texture humain / IA

- Trois marqueurs qui trahissent un bug "humain fatigué" :
- Trois marqueurs qui trahissent un bug "IA plausible" :
- Le piège où les deux styles se rejoignent (rare) :

## Contre-mesures pour la prochaine review

- Checklist mentale style humain :
- Checklist mentale style IA :
- Test réflexe à ajouter d'office sur ce type de helper :

## Coût réel

- Temps total :
- Temps perdu sur la mauvaise hypothèse :
- Temps de la vraie correction :
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
