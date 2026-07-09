---
stability: intemporel
---

# SECURITY : 12_legacy_takeover

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


## STRIDE — modélisation de menace

- **Spoofing** : usurpation d'identité côté client (token volé, header rejoué)
- **Tampering** : modification des payloads en transit ou en base
- **Repudiation** : absence de trace immuable sur les actions sensibles
- **Information disclosure** : fuite de PII dans les logs ou les réponses d'erreur
- **DoS** : épuisement des connexions / flood du endpoint public
- **Elevation of privilege** : bypass des rôles via mauvaise vérification côté serveur
