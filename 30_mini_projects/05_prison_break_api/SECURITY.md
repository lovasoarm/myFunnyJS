---
stability: intemporel
---

# SECURITY : 05_prison_break_api

## Entrées validées

- Sources d'entrée listées : CLI args, fichiers locaux (voir README)
- Schéma de validation : validation manuelle documentée par entrée

## Secrets hors code

Aucun secret commité. Variables env attendues : aucune par défaut (ajoute ici les variables du projet)

## Dépendances scannées

Dernière exécution `npm audit` : voir snapshot ci-dessous.
Rejouer avant chaque release :

```
npm audit --json > /tmp/audit.json
```

Snapshot :

```
{ "vulnerabilities": {}, "metadata": { "vulnerabilities": { "total": 0 } } }
```

## Surface d'exposition

Ports / endpoints / fichiers I/O documentés : périmètre local uniquement (voir README)

## STRIDE : modélisation de menace

- **Spoofing** : usurpation d'identité côté client (token volé, header rejoué)
- **Tampering** : modification des payloads en transit ou en base
- **Repudiation** : absence de trace immuable sur les actions sensibles
- **Information disclosure** : fuite de PII dans les logs ou les réponses d'erreur
- **DoS** : épuisement des connexions / flood du endpoint public
- **Elevation of privilege** : bypass des rôles via mauvaise vérification côté serveur

## GATE SECURITE OBLIGATOIRE

> Ce mini-projet ne peut pas etre marque termine tant que la
> checklist `22_security/06_owasp_checklist.md` n'a pas ete
> parcourue et reportee dans `POSTMORTEM.md` section
> "OWASP PASSE". Un attaquant d'entretien qui demande
> "as-tu passe la checklist OWASP ?" ne doit pas trouver de trou.
>
> le POSTMORTEM sans cette section : le gate est machine, pas
> juste declaratif.
