---
stability: intemporel
---

# Répétition espacée : calendrier explicite sur les six pierres

> Tu apprends une fois, tu oublies vite. La répétition espacée est le
> seul mécanisme éprouvé pour rendre le savoir durable sans y passer
> ta vie. Ce fichier fournit le calendrier et les mini-quiz.

## Les six pierres du curriculum

Rappel court (voir `02_competences.md` pour la version longue) :

1. **Fondamentaux JS** : syntaxe, types, portée, closures
2. **Async** : promises, async/await, event loop
3. **Structures de données & algo** : complexité, patterns classiques
4. **Debugging & tests** : reproduction, isolation, TDD
5. **Architecture & design** : patterns, tradeoffs, découpage
6. **Système & réseau** : HTTP, DB, cache, scalabilité

## Calendrier de rappel par pierre (J+1 / J+7 / J+21 / J+60)

Après avoir **terminé** le module d'une pierre (grimoire lu, tous les
exercices faits), programme dans ton agenda 4 rappels :

| Échéance | Durée cible | Format                                                      |
| -------- | ----------- | ----------------------------------------------------------- |
| **J+1**  | 10 min      | Mini-quiz de rappel (voir template ci-dessous)              |
| **J+7**  | 20 min      | Re-lire le grimoire + refaire **1** exo au hasard           |
| **J+21** | 30 min      | Expliquer 3 concepts phares à voix haute, sans notes        |
| **J+60** | 45 min      | Refaire le `00_prereq_check.md` du module comme un débutant |

Si tu rates un rappel : ne le remonte pas dans la file, décale d'une
semaine et note-le dans `PLATEAU_JOURNAL.md`. Deux rappels ratés
d'affilée sur une même pierre → tu es en train d'oublier, priorise.

## Template de mini-quiz de rappel (J+1 et J+21)

Copier dans un fichier `retention/<pierre>_J+<n>.md` :

```
# Rappel <pierre> : J+<n>

## Questions (à répondre à voix haute AVANT de lire les indices)

1. [définition]  Cite la définition en 1 phrase de : ___________
2. [code]        Écris en 3 lignes un exemple de : ___________
3. [tradeoff]    Cite un cas où tu N'utiliserais PAS : ___________
4. [analogie]    Explique à un non-dev : ___________
5. [debug]       Quel symptôme te fait suspecter : ___________

## Auto-notation

- 5/5 : passe au rappel suivant
- 3-4/5 : re-lis les concepts ratés, refais le quiz dans 3 jours
- <3/5 : le module n'est pas ancré, retourne au grimoire
```

## Pierres actives (à maintenir à jour)

| Pierre       | Dernière révision | Prochain rappel | Note dernier quiz |
| ------------ | ----------------- | --------------- | ----------------- |
| Fondamentaux | à remplir         | à remplir       | à remplir         |
| Async        | à remplir         | à remplir       | à remplir         |
| DS & algo    | à remplir         | à remplir       | à remplir         |
| Debug & test | à remplir         | à remplir       | à remplir         |
| Archi        | à remplir         | à remplir       | à remplir         |
| Système      | à remplir         | à remplir       | à remplir         |

Ce tableau est ta **seule** source de vérité de ta rétention. Tiens-le à
jour, sinon tu retombes dans l'illusion de savoir.

## Pourquoi ce fichier existe

Sans répétition espacée, tu re-fais les mêmes bugs 6 mois plus tard sans
te souvenir de la solution. La charte du curriculum insiste sur
l'intemporel vs le périssable : la répétition espacée est ce qui rend
l'intemporel effectivement durable **dans ta tête**, pas juste dans les
fichiers.
