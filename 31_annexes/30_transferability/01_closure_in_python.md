---
stability: intemporel
---

# Drill : Python
Temps de lecture ~5 min

Objectif P6 : montrer que ta méthode MyFunnyJS survit au changement de langage.


```python
def make_counters(n):
  return [lambda: i for i in range(n)]

counters = make_counters(3)
print([c() for c in counters])  # ?
```

- Prédis la sortie **avant** de lancer.
- Explique pourquoi, en faisant appel à ta connaissance des closures JS (`var` vs `let`).
- Corrige pour obtenir `[0, 1, 2]`. Pas de bibliothèque externe.

<details>
<summary>Piste (ne clique qu'après avoir essayé)</summary>

Python capture par référence de nom, comme JS `var`. Utilise un default arg pour figer la valeur.
</details>


## Debrief à écrire (obligatoire)

- Qu'est-ce qui a été **identique** à JS ?
- Qu'est-ce qui a été **différent** ?
- Qu'est-ce que tu retiens pour la prochaine fois ?
