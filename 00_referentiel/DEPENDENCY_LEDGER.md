---
stability: intemporel
---

# DEPENDENCY_LEDGER (modele de reference)

-> ~3 min de lecture, puis tu copies ce fichier a la racine de ton propre repo.

## POURQUOI CE FICHIER

Une regle non mesuree reste une croyance. "Je n'abuse pas de l'IA" est une croyance. Une entree datee dans un ledger, c'est une preuve. Ce ledger sert a une chose : rendre visible, chaque semaine, la part reelle de ton code que tu n'aurais pas su ecrire seul. Sans ce chiffre, tu ne sais pas si tu progresses ou si tu t'atrophies.

## COMMENT L'UTILISER

Copie ce fichier a la racine de ton propre repo (pas dans MyFunnyJS, dans **ton** projet). Chaque fin de semaine : une entree. Cinq lignes suffisent. Relire trois mois plus tard doit te dire si la courbe monte, descend, ou stagne.

## FORMAT D'UNE ENTREE

```
## Semaine du 2026-08-10

- Temps de code total : 8h
- Temps avec IA active (Copilot on, chat ouvert) : 5h
- Lignes ecrites sans IA : ~120
- Lignes ecrites avec IA (accept sans reflechir) : ~40
- Lignes ecrites avec IA (accept apres relecture ligne a ligne) : ~90
- Ratio dependance : (40 / 250) = 16% de code non-consciemment ecrit
- Temps de LECTURE de code non-ecrit par toi (legacy, deps, PR d'autres) : 5h30
- Temps d'ECRITURE de code (par toi, IA ou pas) : 2h30
- Ratio lecture/ecriture : 5h30 / 2h30 = 2.2x
- Ce que je n'aurais pas su faire seul : "regex de parsing du header HTTP" -> a re-comprendre lundi
- Verdict honnete : je glisse sur les regex, je dois faire un drill sans IA cette semaine
```

## SEUILS D'ALERTE : DEPENDANCE IA

- **< 10 %** de code non-consciemment ecrit : tu tiens le controle. Continue.
- **10-25 %** : zone normale, mais surveille les patterns recurrents (toujours les memes trucs que tu ne comprends pas ?).
- **> 25 %** deux semaines de suite : declenche un `EXO_JEUNE_IA.md` du module concerne. Coupure IA obligatoire jusqu'a ce que tu saches refaire seul ce que tu as accepte sans comprendre.

## SEUILS D'ALERTE : RATIO LECTURE / ECRITURE

Regle de metier : un ingenieur senior lit environ **10x plus de code qu'il n'en ecrit**. Sans mesure, cette regle reste un slogan. Ici on la chiffre.

- **Ratio >= 5x** : tu es dans la posture d'ingenieur. Tu comprends avant d'ajouter. Continue.
- **Ratio 2x a 5x** : zone d'apprenti. Normale au debut du parcours (modules 01 a 10). Passe volontairement plus de temps sur `10_legacy_dungeon`, `12_legacy_takeover`, `31_annexes/23_reading/`.
- **Ratio < 2x deux semaines de suite** : tu ecris plus que tu ne lis. Tu construis sur du sable. Impose-toi une semaine « lecture seule » : un module `EXO_LECTURE.md`, un vrai repo open-source ouvert et annote.
- **Ratio < 1x (tu ecris plus que tu ne lis)** : arret. C'est le profil de l'imposteur assiste par IA. Ferme l'editeur, ouvre du code des autres jusqu'a inverser la balance.

Ces seuils ne sont pas dogmatiques : ce sont des declencheurs de reflexion, pas des couperets. Le seul chiffre malhonnete est celui qu'on ne mesure pas.

## PIEGE CLASSIQUE

Tu vas etre tente de tricher a la baisse (sur la dependance IA) ou a la hausse (sur le temps de lecture). Le ledger ne sert pas a faire joli, il sert a t'attraper toi-meme. Un ledger honnete a 30 % de dependance IA et 1.5x de ratio lecture vaut mille fois plus qu'un ledger malhonnete a 5 % et 12x.

## RESUME

Cinq minutes par semaine. Deux chiffres (dependance IA + ratio lecture/ecriture). Une phrase de verdict. C'est tout. La discipline ne se mesure pas dans l'intention, elle se mesure dans la trace ecrite.
