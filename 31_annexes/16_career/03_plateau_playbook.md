---
stability: intemporel
---

# PLATEAU PLAYBOOK

-> ~5 min pour lire, 1 h à jouer quand tu es coincé

Compétence visée : diagnostiquer un plateau et redémarrer, au lieu d'abandonner. La stagnation est un signal, pas une sentence.

**Seuil unique (identique dans `START_HERE.md`)** : 2 jours sans progrès = tu commences à surveiller ; 7 jours = tu déclenches ce playbook. Ne joue pas avec ces deux chiffres, ils sont calibrés.

## LE PROBLÈME QU'ON RÈGLE

Tu es sur MyFunnyJS depuis 3 mois. Depuis 15 jours, tu as l'impression de patauger : les exercices te prennent le double du temps prévu, tu n'as pas fini un module, tu doutes de tout. C'est le plateau. Il est normal. Il est **méthodiquement franchissable**.

## ARBRE DE DÉCISION (à jouer dans l'ordre)

### Question 1 : "As-tu réellement fait le `00_prereq_check.md` du module courant ?"

- **Non** : reviens-y. 80% des plateaux viennent d'un prérequis manqué. Fin.
- **Oui, il passe** : question 2.
- **Oui, il coince** : reviens 1-2 modules en arrière. Refais le `00_prereq_check.md` de là. Fin.

### Question 2 : "Est-ce un plateau de LECTURE ou de PRATIQUE ?"

- **Lecture** (je ne comprends plus les textes) : fais un `EXO_LECTURE.md` sur un module que tu maîtrisais bien il y a 1 mois. Tu vérifies si le muscle est là. Si oui : c'est le sujet actuel qui coince, pas toi. Si non : recale les 3 modules précédents (2 h chacun, pas plus). Fin.
- **Pratique** (je comprends mais je n'arrive pas à coder) : question 3.

### Question 3 : "Est-ce un plateau de DEBUG ou de CONCEPTION ?"

- **Debug** (mon code plante et je tourne en rond) : ouvre `04_debugging/HYPOTHESES_TEMPLATE.md` et remplis-le au propre. Interdiction absolue de coder tant que le template n'est pas rempli sur 3 hypothèses. 90% du temps, la 2e hypothèse t'a débloqué avant même de coder. Fin.
- **Conception** (je ne sais pas par où commencer) : ouvre `02_problem_solving/04_choose_an_approach.md`, applique Polya, découpe en 5 sous-problèmes. Attaque le plus petit. Fin.

### Question 4 : "As-tu réduit tes sessions à < 30 min sur 3 jours de suite ?"

Si oui : c'est de la fatigue déguisée en plateau. Une semaine off. Vraiment off, pas "je regarde une vidéo React". Fin.

### Question 5 : "As-tu essayé d'expliquer ton blocage à voix haute pendant 3 minutes ?"

- **Non** : fais-le. Enregistre-toi. Réécoute. Le blocage se nomme souvent tout seul. Fin.
- **Oui, ça n'a rien donné** : ouvre un `EXO_JEUNE_IA.md` du module courant. Demande à l'IA de te poser 3 questions socratiques sur ton blocage : pas de te donner la réponse. Cf `node solution.js` (auto-verif ecrite par toi). Fin.

### Question 6 : "Coupe l'IA 48 h"

Tag `[JEUNE IA]` sur ta session : plus de copilote, plus d'auto-complétion agressive, plus de "explique-moi ça". Reforme le raisonnement à la main pendant 48 h. Un plateau vient très souvent d'une IA qui souffle les réponses et émousse le réflexe. Si au bout de 48 h le blocage a bougé (même partiellement), la cause était là. Fin.

## MÉTHODE COMPLÉMENTAIRE : LE JOURNAL PLATEAU

Ouvre un fichier `PLATEAU_JOURNAL.md` à côté de ton `_spaced_repetition.md`. Une ligne par jour de plateau :

```
2026-08-14 | Module en cours : 12_design_patterns | Blocage : Strategy vs State | Action : EXO_LECTURE sur 12_design_patterns/03_behavioral/state_pattern.md
```

Après 5 lignes, tu vois le pattern. Un plateau qui dure > 10 jours sans que la ligne change de rubrique = signal fort qu'il faut reculer de 2 modules.

## CE QUE TU NE FAIS PAS

- Tu ne changes pas de curriculum. Tu ne cherches pas "un meilleur cours". Le suivant aura le même plateau, à la même position.
- Tu ne demandes pas la solution à une IA. Tu demandes des **questions**, pas des **réponses**.
- Tu ne passes pas au module suivant en te disant "je reviendrai". Tu ne reviens jamais.

## QUAND ARRÊTER LE PLAYBOOK

Si après 3 jours de méthode, tu n'as pas progressé d'un cran (un `00_prereq_check.md` passé, une hypothèse validée, un EXO_LECTURE bouclé), il y a une raison réelle : soit un module de fond te manque (recule de 2), soit un contexte externe est en cause (sommeil, charge mentale hors curriculum). Adresse le contexte avant de reprendre.
