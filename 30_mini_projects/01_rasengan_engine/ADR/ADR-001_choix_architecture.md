---
stability: intemporel
---


# ADR-001 : architecture fonctionnelle pure sans classe ni mutation d'état
Temps de lecture ~5 min

## Statut

Accepté : 2026-01

## Contexte

Le Rasengan Engine simule des combats entre ninjas. Chaque tour produit un nouvel état de combat : stats modifiées, jutsus en cooldown, esquives résolues, dégâts calculés. Le moteur doit pouvoir être testé tour par tour, de façon reproductible. Deux approches s'affrontent dès le début du projet : modéliser chaque ninja comme un objet mutable (OOP classique) ou traiter chaque état de combat comme une valeur immutable retournée par des fonctions pures (programmation fonctionnelle).

Le périmètre est clair : pas de réseau, pas de base de données, pas d'UI. Du calcul pur. Ce contexte favorise une architecture sans effets de bord (modification d'état externe à la fonction).

## Décision

On utilise une architecture 100% fonctionnelle. Chaque fonction de combat prend un état de combat en entrée et retourne un nouvel état. Aucune mutation directe sur les objets ninja ou combat. Les jutsus sont des fonctions interchangeables (Strategy pattern fonctionnel). Les ninjas sont créés via des factory functions, pas des classes.

```

État tour N --> résoudreAttaque(état, jutsu) --> État tour N+1

             |

          fonction pure :

          même entrée = même sortie

          zéro effet de bord

```

## Alternatives considérées

**Modélisation OOP avec classes mutables**

- Avantages : `ninja.takeDamage(50)` se lit naturellement, correspond à l'intuition d'un objet "vivant"

- Limites : les tests deviennent fragiles dès qu'on mute l'état entre deux assertions : le ninja après le tour 1 n'est plus dans son état initial, chaque test doit reconstruire l'état de zéro

- Rejeté parce que : les tests unitaires par tour deviennent des cas de setup lourd ; la reproductibilité est compromise ; et ce projet est précisément l'occasion d'apprendre à penser fonctionnel sur un vrai système de combat

**Architecture hybride : classes avec méthodes pures**

- Avantages : garde la lisibilité OOP pour la représentation du ninja, mais les calculs de combat restent des fonctions

- Limites : la frontière entre ce qui mute et ce qui ne mute pas devient floue ; le bénéfice pédagogique de l'immutabilité totale est dilué

- Rejeté parce que : l'objectif pédagogique de ce module est de démontrer qu'un système complet peut fonctionner sans mutation : un hybride brouille ce message

## Conséquences

Gains :

- chaque tour de combat est une transformation testable indépendamment, sans setup complexe

- `Object.freeze` sur les états garantit que personne n'introduit une mutation accidentelle par la suite

- composition de `pipe(résoudreAttaque, appliquerCooldown, calculerEsquive)` lisible et extensible

Sacrifices :

- les spread successifs (`{ ...état, chakra: état.chakra - coût }`) créent plus d'objets en mémoire qu'une mutation directe : acceptable sur ce périmètre, problématique sur 100k itérations avec de gros objets

- la lisibilité peut surprendre un dev habitué à l'OOP : `const newState = appliquerDégâts(state, 50)` est moins intuitif que `ninja.takeDamage(50)` pour un lecteur qui ne connaît pas le style fonctionnel

Décisions liées :

- ADR-002 portera sur le choix de l'algorithme de résolution des esquives (probabiliste vs déterministe selon le seed)

- si le moteur doit un jour gérer des états persistés (sauvegarde de partie), l'immutabilité facilite la sérialisation : l'état est déjà une valeur pure, pas un graphe d'objets circulaires

