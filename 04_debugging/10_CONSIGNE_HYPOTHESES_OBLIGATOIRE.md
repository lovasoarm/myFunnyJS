---
stability: intemporel
---

# CONSIGNE : HYPOTHESES.md OBLIGATOIRE

Temps de lecture ~2 min


> Application generale de la Partie O du referentiel.
> Tout EXO du module `04_debugging` (et tout EXO tagge `[HYP]` ailleurs) livre un `HYPOTHESES.md`.

## Format minimal (copie/colle)

```md
# HYPOTHESES.md

## Contexte
- symptome observe :
- environnement :
- ce que je peux reproduire deterministe :

## Hypothese 1
- enonce :
- test qui la falsifie :
- resultat du test :
- verdict : VRAIE / FAUSSE / INDECISE

## Hypothese 2
...

## Cause racine confirmee
- preuve reproductible :
- correctif applique :
- test de non-regression ajoute :
```

## Regle non negociable
Aucun fix commite sans `HYPOTHESES.md` a jour. Un fix sans hypothese ecrite = coup de chance, pas competence.

## Exemple rempli
Voir `_EXEMPLE_HYPOTHESES.md` a cote (cas reel : fuite memoire par closure).
