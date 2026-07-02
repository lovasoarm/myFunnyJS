[INTEMPOREL]

#  _recall_10.md : modules 06–10
Temps de lecture ~5 min

> Rappel espacé. Réponds **sans revoir les fichiers**. Note ton score.
> Refais ce fichier **une semaine plus tard**. C'est là que la mémoire tient.

Périmètre : testing, math, memory, data structures, algorithms + toutes les notions plus anciennes qui remontent.

## 10 questions

1. Dessine (sur papier) l'ordre d'exécution de : sync → microtask → macrotask.
2. Un bug non déterministe : quelle est **la première** chose à faire ?
3. Cite un smell de code + le refacto qui le tue.
4. Complexité de recherche dans un BST équilibré vs un array trié ?
5. Ton test passe. Prouve-moi qu'il teste vraiment quelque chose.
6. Fuite mémoire vs high water mark : différence ?
7. Écris (mentalement) une closure qui compte les appels.
8. `throw` vs `Result<T,E>` : trade-off ?
9. Une API idempotente : donne un exemple non trivial.
10. Relis ton **ADR le plus ancien**. Que changerais-tu aujourd'hui ?

## Scoring

- 8+/10 → tu peux avancer.
- 5–7 → relis les modules faibles avant de continuer.
- <5 → refais les `_prereq_check` correspondants.

## Piège à éviter

"J'ai relu, ça me revient" ≠ "je sais". Écris tes réponses **avant** de vérifier.


## Exercice de transfert (obligatoire, P6)

Prends la dernière closure que tu as écrite en JS dans ce bloc. Traduis-la en **pseudo-Python** (ou Rust, Go, au choix). Décris en 3 lignes ce qui change (scoping, GC, syntaxe).

Si tu ne peux pas le faire sans regarder le cours JS, ta compréhension est syntaxique, pas conceptuelle. Refais les leçons de scope avant d'avancer.

## Rituel de doute

Parmi les décisions prises dans les modules précédents (ou dans tes mini-projets), laquelle referais-tu **différemment** aujourd'hui ? Écris-le. Note dans quel ADR ça devrait apparaître.


---

##  EXERCICE DE TRANSFERT

Prends UN concept clé de ce module. Réécris son fonctionnement en pseudo-code, puis dans un autre langage que JS (Python, Go, Rust au choix). But : prouver que ta compréhension n'est pas syntaxique.

Livrable : un fichier `transfert_<concept>.md` dans ton dépôt.


##  REMISE EN CAUSE

**Quelle croyance technique avais-tu il y a quelques modules qui a changé aujourd'hui ?**

Écris-la en 3 lignes. Date-la. Relis-la dans 30 jours.
