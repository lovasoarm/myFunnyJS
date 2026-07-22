---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---

# Security Gate Template : OWASP Top 10

> **Gate bloquante**. Un mini-projet ne peut être marqué "publié" tant que
> cette gate n'est pas remplie. Chaque item exige une **preuve** (lien vers
> test, log, config, ligne de code). `N/A` est autorisé mais **doit être
> motivé** en une phrase : un `N/A` non motivé fait échouer la gate.

Voir aussi : `22_security/06_owasp_checklist.md`.

## Métadonnées

- Projet : `<nom du mini-projet>`
- Version évaluée : `<git sha ou tag>`
- Évaluateur : `<toi>`
- Date : `<YYYY-MM-DD>`

## Checklist OWASP Top 10 (2021)

| #   | Catégorie                           | Preuve fournie                          | Statut                            |
| --- | ----------------------------------- | --------------------------------------- | --------------------------------- |
| A01 | Broken Access Control               | `<fichier:ligne / test>`                | [ ] Passé [ ] N/A motivé : `<phrase>` |
| A02 | Cryptographic Failures              | `<config TLS / clé stockée où / algo>`  | [ ] Passé [ ] N/A motivé : `<phrase>` |
| A03 | Injection (SQL / NoSQL / OS / LDAP) | `<test injection + requête paramétrée>` | [ ] Passé [ ] N/A motivé : `<phrase>` |
| A04 | Insecure Design                     | `<ADR menace / threat model>`           | [ ] Passé [ ] N/A motivé : `<phrase>` |
| A05 | Security Misconfiguration           | `<headers, CORS, secrets hors repo>`    | [ ] Passé [ ] N/A motivé : `<phrase>` |
| A06 | Vulnerable & Outdated Components    | `<npm audit / snyk / date de scan>`     | [ ] Passé [ ] N/A motivé : `<phrase>` |
| A07 | Identification & Auth Failures      | `<politique mdp / lockout / MFA>`       | [ ] Passé [ ] N/A motivé : `<phrase>` |
| A08 | Software & Data Integrity Failures  | `<signature deps / CI verrouillée>`     | [ ] Passé [ ] N/A motivé : `<phrase>` |
| A09 | Security Logging & Monitoring       | `<que logue-t-on / alerte sur quoi>`    | [ ] Passé [ ] N/A motivé : `<phrase>` |
| A10 | Server-Side Request Forgery         | `<whitelist / validation URL>`          | [ ] Passé [ ] N/A motivé : `<phrase>` |

## Règle de blocage

- Un seul item sans preuve **ni** motivation → gate **échouée**.
- Un item marqué `N/A` sans phrase de justification → gate **échouée**.
- Une preuve qui pointe vers un fichier inexistant → gate **échouée**.

## Signature

- [ ] Je certifie avoir vérifié chaque item en ouvrant le code, pas de mémoire.

`<nom> : <date>`
