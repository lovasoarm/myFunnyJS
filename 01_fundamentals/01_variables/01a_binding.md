---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# 01a : Binding : nommer, c'est déjà décider
Temps de lecture ~5 min

Avant de lancer un Rasengan, faut savoir canaliser ton chakra. Une variable, c'est pas une boîte : c'est un **nom collé sur une valeur**. Ce collage, c'est le *binding*.

## L'idée

```
let ninja = "Naruto"
  ^^^^^  ^^^^^^^^
  nom   valeur en mémoire
```

Le `=` n'est pas "égal". C'est "colle ce nom à cette valeur". Retiens ça, tu viens de sauver 2 ans de bugs.

## Trois moments qui comptent

1. **Déclaration** : tu réserves le nom (`let x`).
2. **Assignation** : tu colles une valeur (`x = 42`).
3. **Lecture** : tu demandes la valeur derrière le nom (`console.log(x)`).

## Risque

Réutiliser un nom qui existe déjà dans un scope parent. Tu crois modifier, tu shadow. On y revient dans `01b`.

## Ce que l'analogie cache

Le chakra Naruto est fini. En JS, la valeur peut être partagée par 10 noms sans se "diviser". Le binding ne consomme rien.

## Mission (5 min)

Écris trois lignes qui déclarent, assignent, puis relisent un nom. Sans copier-coller. Fais-le maintenant.
