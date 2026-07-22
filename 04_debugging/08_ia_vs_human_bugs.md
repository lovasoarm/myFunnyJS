---
stability: intemporel
---

# BUGS IA vs BUGS HUMAINS : signatures distinctes

-> ~9 min

## POURQUOI CE FICHIER

Un bug humain a une odeur. Un bug IA en a une autre. Confondre les deux, c'est
perdre 3 h à chercher la mauvaise piste. Cette leçon isole les signatures.

## SIGNATURES BUG HUMAIN

- **Incohérence locale visible** : le nom de variable ment, l'indentation dérape,
  le commit dit "fix" mais casse trois autres tests.
- **Erreur d'inattention** : off-by-one, condition inversée, `==` au lieu de `===`.
- **Ignorance de l'API** : appelle `.map` sur une `Map`, oublie que `sort` mute.
- **Signature au debugger** : la stack pointe droit sur la ligne fautive, on
  reproduit en 2 pas.

## SIGNATURES BUG IA

- **Plausibilité totale, faux subtil** : code lisible, tests inventés, appelle
  une méthode qui n'existe pas dans la vraie lib (`array.first()`, `date.plus(1, 'day')`).
- **Cohérence de surface, contradiction de fond** : deux fichiers du même PR
  supposent deux structures de données différentes pour le même objet.
- **Optimisation prématurée qui casse la sémantique** : parallélise une boucle
  qui devait être séquentielle, met en cache un résultat non-idempotent.
- **Nom trop générique** : `processData`, `handleItem` : pas de contexte métier,
  parce que l'IA n'a pas de contexte.
- **Signature au debugger** : la stack pointe sur du code correct ; le bug est
  dans la spec inventée. On ne reproduit pas facilement, on doit relire l'intention.

## PROTOCOLE

1. Lire la stack **et** l'intention avant de fixer.
2. Si l'appel semble parfait mais casse : chercher la lib réelle, pas le
   souvenir de l'IA.
3. Livrer `HYPOTHESES.md` (voir `HYPOTHESES_TEMPLATE.md`) : la trace vaut plus
   que le fix.

## EXERCICE

Prends une PR IA récente. Classe chaque diff en `humain-likely` ou
`ia-likely`. Justifie en 1 phrase par diff. Compare avec un pair.
