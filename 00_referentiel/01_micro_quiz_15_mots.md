---
stability: intemporel
---

# Micro-quiz : les 15 mots
-> ~10 min

Rejoue ce quiz **apres le bloc 01 -> 07** et **avant d'attaquer 08**.
Si tu rates plus de 3 questions par groupe, retourne au module concerne.

## Groupe A : Runtime et execution (bloc 01 -> 04)

1. **JIT** signifie :
   a) Just-In-Time compilation
   b) Java Interface Toolkit
   c) JSON Iteration Template
   -> reponse en fin de fichier.
2. Le **runtime** JavaScript, c'est :
   a) le langage plus la spec
   b) le langage plus l'environnement qui l'execute (V8, event loop, API host)
   c) la vitesse d'execution
3. Un **microtask** :
   a) une tache OS courte
   b) une tache de la microtask queue exécutée avant le prochain macrotask
   c) un web worker leger
4. L'**event loop** :
   a) une boucle infinie qui polle les evenements DOM
   b) le coordinateur qui prend les taches de la call stack, macrotask queue,
      microtask queue selon des regles precises
   c) un pattern reactif de type RxJS
5. Le **stack trace** :
   a) la trace reseau
   b) la pile d'appels reconstituee au moment d'une erreur
   c) le log des exceptions non gerees

## Groupe B : Types, memoire, structure (bloc 05 -> 07)

6. **GC** (garbage collector) :
   a) supprime les fichiers inutiles du disque
   b) libere la memoire des objets JS plus atteignables depuis les racines
   c) compresse les JSON
7. Une **closure** :
   a) une fonction anonyme
   b) une fonction qui capture les variables de sa portee de definition
   c) une IIFE
8. **Prototype** :
   a) une maquette de design
   b) le lien qu'un objet a vers un autre objet pour heriter de proprietes
   c) un synonyme de classe
9. **Immutabilite** :
   a) une valeur qu'on peut modifier une seule fois
   b) une valeur qu'on ne modifie pas apres creation, les operations
      renvoient une nouvelle valeur
   c) une constante `const`
10. Un **hash** (contexte structures de donnees) :
    a) un tag sur les reseaux sociaux
    b) une empreinte deterministe d'une entree, taille fixe, utilisee
       comme index rapide
    c) un mot de passe chiffre

## Groupe C : Discipline et hygiene (transverse au bloc)

11. **Repro deterministe** :
    a) un test qui passe une fois sur deux
    b) un scenario minimal qui declenche le bug **a chaque execution**
    c) un mocking parfait
12. **Hypothese testable** :
    a) une intuition que tu ecris
    b) une affirmation falsifiable dont on peut prouver la faussete par
       une experience precise
    c) une opinion argumentee
13. **Flaky** :
    a) un dev fatigue
    b) un test dont le resultat depend de conditions non maitrisees
       (timing, ordre, reseau)
    c) un pattern GoF
14. **a11y** signifie :
    a) accessibility (a + 11 lettres + y)
    b) allocation
    c) version 11 alpha
15. **i18n** signifie :
    a) internationalisation (i + 18 lettres + n)
    b) une norme IEEE
    c) un middleware Express

## Reponses

1.a  2.b  3.b  4.b  5.b  6.b  7.b  8.b  9.b  10.b  11.b  12.b  13.b  14.a  15.a

## Verdict

- 13-15 : tu peux entrer dans le bloc 08 -> 14.
- 10-12 : relis `04_debugging/HYPOTHESES_TEMPLATE.md` et le glossaire de
  `START_HERE.md`, refais le quiz.
- < 10 : retour aux 4-5 lecons ou tu as trebuche. Pas de honte, l'illusion
  de savoir coute plus cher.
