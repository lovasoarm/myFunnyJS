---
stability: intemporel
---

# ADR-003 : Frontières internes du projet

Temps de lecture ~4 min

## Statut

Accepté : 2026-07

## Contexte

[Projet 10_legacy_dungeon] Le projet a un cœur métier et des adaptateurs (I/O, CLI, tests). La frontière détermine
ce qu'un futur mainteneur peut échanger sans casser le reste.

## Options considérées

- **Un seul fichier plat (rapide au début, ingérable à 500 lignes)**
- **Architecture hexagonale complète (over-engineering pour ce périmètre)**
- **Cœur pur + 2 adaptateurs (I/O, présentation) : pragmatique**

## Décision

Cœur pur (fonctions déterministes) + adaptateurs fins pour l'extérieur.

## Conséquences

Tests unitaires sur le cœur sans mock. Adaptateurs testés en intégration légère.

## Ce qu'on abandonne

L'appel direct de l'I/O depuis le cœur : coût = tests deviennent des tests d'intégration lents.

## Signal de révision

Ajout d'un 2e canal de sortie (HTTP en plus du CLI, par ex.).
