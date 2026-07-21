---
stability: intemporel
---

# SPEC DRIFT VS FLOU STATIQUE
Temps de lecture ~4 min

> W.7 opererationnalise. Ce fichier existe pour que la distinction
> "flou statique vs flou mouvant" ne reste pas une note orale.

## Le flou statique

- La spec est floue **au depart**.
- Elle ne change pas pendant que tu codes.
- Symptome : tu passes 2 h a la clarifier, puis tu implementes tranquille.
- Reflexe : question fermee au PO, ADR courte, on avance.

## Le spec drift (flou mouvant)

- La spec est claire au depart.
- Elle **change en cours de sprint**, parfois plusieurs fois par jour.
- Symptome : tu refais la meme fonction trois fois avec des criteres
  differents. Tu perds pied. Tu deviens agressif en review.
- Reflexe : pas plus de clarification. Il faut un dispositif :
  1. `SPEC_DRIFT_TRIGGERS.md` (voir mini-projet 18) : liste des signaux
     qui declenchent une revalidation systematique de la spec.
  2. Log par commit du "quel etait le critere au moment ou j'ai commite".
  3. Refus des changements silencieux : toute mutation de spec passe par
     un ADR ou elle n'a pas eu lieu.

## Pourquoi ca compte

Un dev qui confond les deux :
- traite un drift comme un flou statique -> il reclarifie sans fin, il
  brule son capital de sympathie et il livre en retard.
- traite un flou statique comme un drift -> il installe de la
  bureaucratie inutile la ou une simple question aurait suffi.

## Ou ca vit dans le curriculum

- Trigger technique : `30_mini_projects/18_human_vs_ai_smell/SPEC_DRIFT_TRIGGERS.md`.
- Mental : ce fichier.
- Communication : `27_team_craft/08_how_to_ask.md`.

## Test binaire

Tu maitrises la distinction si tu peux, en 30 s, dire pour un ticket
donne : "flou statique -> je pose 2 questions" ou "drift -> j'installe
un ADR + un log de spec".
