---
stability: intemporel
---

# 04 FIRST CLICK REPLAY : le seul test qui prouve que le "nul" n'est pas perdu

Temps de lecture ~4 min. Temps de mise en oeuvre : 30 min chrono + 20 min debrief.

> Toutes les autres verifications (linters, tables des matieres, tests) sont
> internes au projet. Elles peuvent mentir : un curriculum peut etre
> parfaitement coherent pour son auteur et opaque pour un debutant. Le seul
> test qui rend visible ce trou-la, c'est de filmer un vrai nouveau venu qui
> ouvre le repo froid et suit `START_HERE.md`. On mesure ses hesitations, pas
> ses reussites.

## POURQUOI CE PROTOCOLE EXISTE

Le curriculum est ecrit par quelqu'un qui connait deja la reponse. Le
debutant, non. La question centrale du projet (« un nul sera-t-il perdu au
premier click ? ») ne peut se trancher qu'empiriquement, avec un vrai humain
qui ne triche pas. Sans ce drill, la reponse reste une opinion.

## PROTOCOLE (30 min chrono)

### Casting

- Un **debutant reel** : sait allumer un ordi, sait ce qu'est un terminal en
  theorie, n'a **jamais** installe Node, n'a **jamais** ouvert MyFunnyJS.
- Pas ton pote dev. Pas un ex-etudiant en info. Un vrai nul.
- Consentement ecrit pour l'enregistrement (voir modele plus bas).

### Poste de travail

- Machine fraiche ou VM vierge (pas d'IDE preconfigure, pas de Node deja
  installe, pas d'autocompletion sur les fichiers `.md`).
- Ecran + audio enregistres (OBS suffit). Le curseur doit etre visible.
- Le sujet parle en continu, meme quand il hesite : la voix off est la
  donnee principale.

### Consignes au sujet (exactes)

1. « Tu ouvres le dossier `myFunnyJS`. »
2. « Tu decides toi-meme quel fichier lire en premier. »
3. « Tu suis ce fichier a la lettre pendant 30 min. Si tu bloques plus de
   5 secondes, tu le dis a voix haute, tu essaies pareil, tu continues. »
4. Aucune aide, aucune reformulation, aucun regard complice. Tu observes,
   tu chronometres, tu te tais.

### Grille de mesure

Chaque **hesitation superieure a 5 secondes** est un signal a corriger.
Note-la, minutee, dans `first_click_log.md` :

```
mm:ss | localisation (fichier + ligne / paragraphe) | ce que le sujet
       | cherchait sans trouver | hypothese de correction
```

Trois seuils :

- **0 a 2 hesitations** en 30 min : le premier click est propre. Livrable
  atteint.
- **3 a 5** : zones grises identifiees, correction locale suffit.
- **6 et plus** : re-ecrire `START_HERE.md` et/ou `README.md` avant de
  refaire un test. On ne rafistole pas, on repense.

### Fin du drill

A 30:00 chrono exact, arret. Meme si le sujet est en pleine action. Le
protocole ne mesure pas la vitesse d'apprentissage : il mesure ou le
curriculum trahit sa promesse.

## DEBRIEF (20 min)

- Reecoute avec le sujet. Il commente ses hesitations en direct.
- Toi, tu ne te justifies pas. Tu ecris. Un log honnete est un log qui
  contient des phrases genre : « je ne comprends pas pourquoi il me
  demande d'ouvrir ce fichier, je n'ai jamais entendu parler de `.nvmrc` ».
- Chaque hesitation retenue produit une **entree correctionnelle** :
  fichier, ligne, correction proposee, verif que la correction n'introduit
  pas un autre trou.

## LIVRABLES

- `first_click_log.md` (horodate, brut).
- `first_click_diff.md` : la liste des corrections appliquees suite au
  drill, avec commit hash.
- Rappel : le drill se rejoue apres chaque refonte majeure du parcours de
  demarrage (`START_HERE.md`, `README.md`, `00_getting_started/`).

## MODELE DE CONSENTEMENT (a coller dans le log)

```
Je, {prenom nom}, accepte d'etre enregistre (ecran + audio) pendant
30 minutes pour tester la clarte du parcours de demarrage MyFunnyJS.
L'enregistrement ne sera pas publie sans mon accord ecrit ulterieur.
Signe le {date}.
```

## POURQUOI CE FICHIER EST BLOQUANT

Aucun autre test interne au repo ne peut prouver que le premier click
n'est pas cassant. Ce protocole est la contrepartie de la suppression du
dossier `.internal/` : on troque une verification automatique et opaque
contre une verification humaine, chere mais honnete. Si tu ne l'executes
jamais, la question « un nul est-il perdu ? » reste sans reponse, et
« 10/10 » reste une opinion, pas une preuve.
