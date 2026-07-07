> HORS CURRICULUM - artefact d'audit, ne pas lire pour apprendre JS.

# DEPENDENCY LEDGER : LE JOURNAL DE TA DÉPENDANCE À L'IA
Temps de lecture ~7 min

> Rempli au fil du curriculum, pas en une fois. Voir `23_ai_native_dev/07_solo_vs_copilot_drill.md` pour le protocole complet avant de remplir quoi que ce soit ici.

Ce fichier vit à la racine, pas dans `23_ai_native_dev/`, parce que ce qu'il mesure traverse tout le curriculum. Tu le rouvres à 4 moments précis : après le bloc 01-06, après le bloc 07-14, après le bloc 15-22, après le bloc 23-29. Quatre entrées, une courbe, pas un instantané.

Chaque entrée suit le même protocole : une tâche calibrée, un round solo chronométré, un round copilot chronométré, une comparaison honnête.

---

## SESSION 1 : APRÈS LE BLOC 01-06 (fondamentaux, problem solving, async, erreurs, debugging, tests)

```
Date :
Tâche calibrée choisie :
Source (mini-projet ou module) :
```

**Round solo**
```
Temps écoulé :
Résultat : (correct / incomplet / buggé)
Ce qui a bloqué (si applicable) :
```

**Round copilot**
```
Temps écoulé :
Ce que l'IA a apporté que t'avais pas :
Ce que t'as dû corriger dans sa sortie :
```

**Lecture du résultat**

CAS identifié (voir `07_solo_vs_copilot_drill.md` section 4) : `A / B / C / D` (entoure ou note le bon)

```
Si CAS B (trou de compétence réel) : concept précis à retravailler :
Module à relire avant la prochaine session :
```

---

## SESSION 2 : APRÈS LE BLOC 07-14 (math, perf mémoire, data structures, algos, FP, patterns, refacto, TS)

```
Date :
Tâche calibrée choisie :
Source (mini-projet ou module) :
```

**Round solo**
```
Temps écoulé :
Résultat : (correct / incomplet / buggé)
Ce qui a bloqué (si applicable) :
```

**Round copilot**
```
Temps écoulé :
Ce que l'IA a apporté que t'avais pas :
Ce que t'as dû corriger dans sa sortie :
```

**Lecture du résultat**

CAS identifié : `A / B / C / D`

```
Si CAS B : concept précis à retravailler :
Module à relire avant la prochaine session :
```

**Comparaison avec la Session 1**
```
Le temps solo a-t-il évolué sur un type de tâche comparable ? (plus rapide / stable / plus lent)
Le CAS identifié est-il le même qu'en Session 1, ou différent ?
```

---

## SESSION 3 : APRÈS LE BLOC 15-22 (runtime, archi, web concepts, a11y, i18n, realtime, API, sécurité)

```
Date :
Tâche calibrée choisie :
Source (mini-projet ou module) :
```

**Round solo**
```
Temps écoulé :
Résultat : (correct / incomplet / buggé)
Ce qui a bloqué (si applicable) :
```

**Round copilot**
```
Temps écoulé :
Ce que l'IA a apporté que t'avais pas :
Ce que t'as dû corriger dans sa sortie :
```

**Lecture du résultat**

CAS identifié : `A / B / C / D`

```
Si CAS B : concept précis à retravailler :
Module à relire avant la prochaine session :
```

**Comparaison avec les sessions précédentes**
```
Tendance sur 3 points de mesure : (autonomie qui monte / stagne / descend)
```

---

## SESSION 4 : APRÈS LE BLOC 23-29 (IA native, databases, scalabilité, observabilité, team craft, edge cases, OOP)

```
Date :
Tâche calibrée choisie :
Source (mini-projet ou module) :
```

**Round solo**
```
Temps écoulé :
Résultat : (correct / incomplet / buggé)
Ce qui a bloqué (si applicable) :
```

**Round copilot**
```
Temps écoulé :
Ce que l'IA a apporté que t'avais pas :
Ce que t'as dû corriger dans sa sortie :
```

**Lecture du résultat**

CAS identifié : `A / B / C / D`

```
Si CAS B : concept précis à retravailler :
Module à relire avant la prochaine session :
```

---

## SYNTHÈSE FINALE (à remplir après la Session 4)

```
Sur les 4 sessions, combien de fois CAS A (sain : juste plus lent) :
Sur les 4 sessions, combien de fois CAS B (trou de compétence réel) :
Sur les 4 sessions, combien de fois CAS C (pas besoin d'IA sur cette tâche) :
Sur les 4 sessions, combien de fois CAS D (l'IA a coûté du temps) :
```

**Ce que cette courbe te dit, honnêtement** :

(à remplir : si CAS B revient à chaque session sur des concepts différents, c'est normal, le curriculum avance. Si CAS B revient sur le MÊME TYPE de concept à plusieurs sessions d'écart, c'est un signal qu'il faut prendre au sérieux : pas juste relire le module, mais comprendre pourquoi la première relecture n'a pas suffi)

**Si tu devais refaire ce ledger dans 6 mois, qu'est-ce que tu changerais dans le protocole ?**

(à remplir)


---

## EXEMPLE REMPLI (à copier au bon endroit)

<!--
| Date    | Module | Tâche            | Ratio IA / moi | Note (0-5) | Décision retenue            |
|------------|--------|-----------------------------|----------------|------------|----------------------------------------|
| 2026-01-14 | 03   | Implémenter debounce    | 40 / 60    | 4     | J'ai gardé mon impl, l'IA a simplifié 2 lignes. |
| 2026-01-20 | 05   | Debug race sur setTimeout  | 10 / 90    | 5     | Hypothèse posée seul, IA a validé.   |
| 2026-02-01 | 08   | Heap snapshot arena     | 0 / 100    | 5     | Fait entièrement seul, IA n'a pas aidé.|
| 2026-02-15 | 14   | Types génériques `pMap`   | 60 / 40    | 2     | Trop dépendant. À refaire seul.    |
-->

## Règle de calcul

- **Ratio IA / moi** : temps où l'IA a artefact du code vs temps où j'ai réfléchi/écrit seul.
- **Note** : 0 = j'ai copié sans comprendre ; 5 = je peux ré-expliquer et refaire seul demain.
- **Trigger** : si sur 5 lignes consécutives le ratio IA > 60 %, refais un `07_solo_vs_copilot_drill.md`.


---

## MINI-PROJETS : DÉPÔTS PUBLIÉS

| # | Projet | Lien dépôt GitHub | POSTMORTEM | Peer-review |
| --- | --- | --- | --- | --- |
| 01 | Rasengan Engine | ... | ... | ... |
| 02 | Garo no Kronika | ... | ... | ... |
| 03 | Walking Dead Protocol | ... | ... | ... |
| 04 | Breaking Cache | ... | ... | ... |
| 05 | Prison Break API | ... | ... | ... |
| 06 | Ultras Dashboard | ... | ... | ... |
| 07 | Ballon d'Or CLI | ... | ... | ... |
| 08 | Trapsoul Radio | ... | ... | ... |
| 09 | Oracle Glitch | ... | ... | ... |
| 10 | Legacy Dungeon | ... | ... | ... |
| 11 | Scheduler | ... | ... | ... |
| 12 | Legacy Takeover | ... | ... | ... |
| 13 | Memory Hunter | ... | ... | ... |
| 14 | System Design Lab | ... | ... | ... |
| 15 | Portage Rasengan multi-langage | ... | ... | ... |

---
stability: intemporel
