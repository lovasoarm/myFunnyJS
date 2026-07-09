---
stability: intemporel
---

# SECURITY : 14_system_design_lab

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
