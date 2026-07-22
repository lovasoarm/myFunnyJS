---
stability: intemporel
---

# LEAK_REPORT : <nom du service ou fixture>

Temps de lecture ~2 min


Date : YYYY-MM-DD
Investigateur : <toi>
Durée totale enquête : XX min

## 1) Symptôme observé

- Métrique qui alerte : rss / heapUsed / event loop lag / autre
- Courbe (6 points minimum) :

```
t=10s rss=___MB  heap=___MB
t=20s rss=___MB  heap=___MB
t=30s rss=___MB  heap=___MB
t=40s rss=___MB  heap=___MB
t=50s rss=___MB  heap=___MB
t=60s rss=___MB  heap=___MB
```

## 2) Hypothèse initiale (AVANT le snapshot)

Une phrase. Pas plus. Écrite avant d'ouvrir DevTools.

## 3) Protocole d'investigation

- [ ] `--expose-gc` activé
- [ ] Snapshot A pris à t=___
- [ ] Snapshot B pris à t=___ après gc()
- [ ] Comparison filtrée par Delta décroissant

## 4) Top 3 retainers

| Rang | Objet | # Delta | Size Delta | Retainer path (résumé) |
|------|-------|---------|------------|-------------------------|
| 1  |    |     |      |             |
| 2  |    |     |      |             |
| 3  |    |     |      |             |

## 5) Cause racine

Une phrase. Pointe la ligne coupable (fichier:ligne).

## 6) Fix appliqué

```diff
- ligne d'origine
+ ligne corrigée
```

## 7) Preuve du fix

Courbe rss APRÈS fix, mêmes 6 points :

```
t=10s rss=___MB
...
```

Delta rss(fixed, t=60s) - rss(leaky, t=60s) = ___ MB.

## 8) Ce que j'ai appris (ne pas sauter)

3 lignes. Ce que tu ne referas plus jamais.
