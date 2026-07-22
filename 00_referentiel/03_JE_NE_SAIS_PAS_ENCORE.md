---
stability: intemporel
---

# JE NE SAIS PAS ENCORE (mais je sais où regarder)

Temps de lecture ~3 min

> Fichier transversal. Nommé une seule fois ici : à côté du reste du
> référentiel. Cité depuis chaque `POSTMORTEM_TEMPLATE.md` des
> mini-projets et depuis les modules `10_legacy_dungeon` et
> `12_legacy_takeover`. C'est une posture de fond du curriculum, pas
> un réflexe de circonstance.

## LE PRINCIPE

Il y a trois façons de réagir face à une notion qu'on ne maîtrise pas encore :

1. **Bluffer.** Le pire réflexe. En code review, en entretien, en prod à 3h du matin : le bluff finit toujours par tomber, et il te coûte plus que l'ignorance qu'il essayait de cacher.
2. **Paniquer.** "Je ne sais pas donc je suis nul donc j'ai pas ma place." Réflexe classique du débutant. Il dévore l'énergie que tu devrais mettre à comprendre.
3. **Dire : "je ne sais pas encore, mais je sais où regarder si j'en ai besoin."** Le seul des trois qui te fait progresser.

La différence entre le 2 et le 3, c'est **encore**. Un mot. Il transforme un jugement d'identité ("je suis ignorant") en un état temporaire d'un chemin en cours ("je n'ai pas encore rencontré ce sujet, et j'ai les outils pour le rencontrer proprement quand il tombera").

## POURQUOI CE FICHIER EXISTE

Cette compétence est nommée explicitement dans un seul mini-projet (`10_legacy_dungeon/POSTMORTEM.md`). Ça la cantonne à un contexte de legacy, alors qu'elle traverse tout le métier : lire un repo inconnu, débriefer une prod cassée, comparer deux options d'archi, encaisser une question qu'on n'avait pas anticipée en entretien.

Le curriculum promeut ailleurs le "un dev qui lit vite mais faux est plus dangereux qu'un dev lent mais juste". "Je ne sais pas encore" est la version émotionnelle de cette règle : le dev honnête sur son ignorance actuelle est plus fiable que le dev qui simule une maîtrise qu'il n'a pas.

## COMMENT L'UTILISER, CONCRÈTEMENT

Face à un blocage, dis-toi (ou dis à l'équipe) :

```
Je ne sais pas encore comment [X] fonctionne.
Ce que je sais : [ce que tu as compris pour l'instant, même partiel].
Où je vais regarder : [module N du curriculum / doc officielle / commande utile / collègue à interpeller].
Combien de temps je m'accorde avant de revenir avec une hypothèse : [30 min / 2 h / demain].
```

Quatre lignes. C'est la version protocolaire de "je ne sais pas encore". Elle transforme une panique en plan d'action.

## LE PIÈGE INVERSE

"Je ne sais pas encore" n'est pas un badge à afficher pour esquiver. Un dev qui répond "je ne sais pas encore" à **toutes** les questions techniques ne pratique pas l'humilité : il pratique l'évitement. La distinction : le "je ne sais pas encore" honnête est **toujours** suivi d'une piste concrète ("où je regarderais"). Sans piste, c'est du "je ne sais pas" tout court, et il faut le nommer autrement.

---

## OÙ CE PRINCIPE EST APPLIQUÉ AILLEURS DANS LE CURRICULUM

- `10_legacy_dungeon/POSTMORTEM.md` : section dédiée dans le postmortem.
- `12_legacy_takeover/` : posture requise pour aborder un repo hostile sans mépris ni panique.
- `27_team_craft/08_how_to_ask.md` : la version outbound ("demander de l'aide efficacement" est la face active du "je ne sais pas encore").
- `27_team_craft/09_dire_je_ne_sais_pas.md` : version en situation d'équipe.
- Chaque `POSTMORTEM_TEMPLATE.md` des 18 mini-projets : section dédiée à remplir.

---

Si tu retiens une seule idée de ce fichier : **"encore"**. C'est le mot qui te tient debout.
