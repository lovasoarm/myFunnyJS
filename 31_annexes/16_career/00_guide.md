---
stability: intemporel
---

# Le Guide que ton prof aurait dû te donner le jour 1

Temps de lecture ~100 min (guide dense, ~3000 lignes : fractionne en 3-4 sessions, un chapitre à la fois, pas d'une traite)


---

## Sommaire

1. [C'est quoi un langage de programmation ?](#1-cest-quoi-un-langage-de-programmation)
2. [Les grands types de langages](#2-les-grands-types-de-langages)
3. [Top 10 des langages en 2026](#3-top-10-des-langages-en-2026)
4. [Comment choisir son langage ?](#4-comment-choisir-son-langage)
5. [Débutant ou intermédiaire : par où commencer ?](#5-débutant-ou-intermédiaire--par-où-commencer)
6. [J'ai une idée ou un cahier des charges : je fais quoi exactement ?](#6-jai-une-idée-ou-un-cahier-des-charges--je-fais-quoi-exactement)
7. [Les vérités qu'on te dira jamais en cours](#7-les-vérités-quon-te-dira-jamais-en-cours)
8. [Les métiers du dev : la carte au trésor que personne t'a donnée](#8-les-métiers-du-dev--la-carte-au-trésor-que-personne-ta-donnée)
9. [Ce que ça vaut vraiment : salaires et le levier remote](#9-ce-que-ça-vaut-vraiment--salaires-et-le-levier-remote)
10. [BONUS : L'IA, le vrai métier, et les erreurs qui tuent les carrières](#10-bonus--lia-le-vrai-métier-et-les-erreurs-qui-tuent-les-carrières)
11. [Conclusion](#11-conclusion)

---

## 1. C'est quoi un langage de programmation ?

### L'origine : le vrai début de l'histoire

Avant de parler de Python ou de JavaScript, il faut remonter loin. Très loin. Genre... 1843.

En **1843**, une femme nommée **Ada Lovelace** écrit ce qu'on considère aujourd'hui comme le tout premier algorithme destiné à être exécuté par une machine. Elle travaillait sur la "Machine Analytique" de **Charles Babbage** : une machine mécanique géante qui n'a jamais vraiment été construite de son vivant. Ada est donc techniquement la première programmeuse de l'histoire.

C'est pour ça que le langage **Ada** (utilisé encore aujourd'hui dans l'aviation et l'armée) porte son prénom.

Byron était son père. L'histoire de la programmation, c'est de la poésie appliquée dès le départ.

Mais un "vrai" langage de programmation au sens moderne, ça arrive bien plus tard.

En **1949**, **John Mauchly** crée **Short Code** : le premier langage à ressembler à ce qu'on connaît aujourd'hui. Des instructions lisibles par un humain, pas juste des 0 et des 1.

Puis en **1957**, **John Backus** et son équipe chez IBM inventent **FORTRAN** (FORmula TRANslation). C'est le premier langage vraiment utilisé massivement, principalement pour les calculs scientifiques. FORTRAN existe encore en 2026. Oui, vraiment. Les scientifiques qui simulent des trajectoires de fusées l'utilisent encore.

---

### Mais concrètement, un langage c'est quoi ?

Un ordinateur ne comprend qu'une seule chose : des **0 et des 1**. Le binaire. Personne ne code en binaire (enfin, il y a des gens... on va pas en parler).

```
Le mot "Bonjour" en binaire :
01000010 01101111 01101110 01101010 01101111 01110101 01110010
```

Un langage de programmation, c'est un **intermédiaire** entre toi (l'humain) et la machine. Tu écris des instructions dans un format que tu comprends, et le langage s'occupe de tout traduire en langage machine.

```
Illustration : la chaîne de traduction

 TOI        LANGAGE        MACHINE
 ----        --------       -------
 "affiche      print("Bonjour")  01000010 01101111...
 Bonjour"        |
 (ta pensée)    (ta syntaxe)    (ce que la puce comprend)
```

C'est exactement comme un traducteur lors d'une conférence internationale. Toi tu parles français, la machine parle binaire, et le langage de programmation joue le rôle de l'interprète entre vous deux.

---

### Frise chronologique : de 1843 à 2026

```
1843 -------- Ada Lovelace écrit le 1er algo de l'histoire (sur papier)
1949 -------- Short Code : 1er langage lisible par un humain
1957 -------- FORTRAN : 1er langage massivement utilisé (IBM)
1958 -------- LISP : ancêtre de tous les langages fonctionnels
1959 -------- COBOL : Grace Hopper. Les banques l'utilisent encore
1972 -------- C : Dennis Ritchie. Le père de presque tout
1983 -------- C++ : C mais avec des objets dedans
1991 -------- Python : Guido van Rossum. Nommé d'après les Monty Python
1995 -------- Java + JavaScript + PHP : L'ANNÉE DU WEB
2009 -------- Go : Google en avait marre que C++ compile trop lentement
2010 -------- Rust : Mozilla en avait marre que C++ plante tout
2014 -------- Swift : Apple remplace Objective-C, enfin lisible
2015 -------- Kotlin : JetBrains commence à tuer Java sur Android
2016 -------- TypeScript : Microsoft rend JavaScript sérieux
2022+ ------- Zig, Carbon : nouveaux challengers qui visent C/C++
```

En 1995, Java, JavaScript et PHP sont sortis la même année. Ferrari, Lamborghini et Bugatti le même jour : aucun des trois n'a gagné définitivement, mais chacun a dominé son terrain.

---

### Qui a programmé quoi en premier ?

```
PREMIER ALGO DOCUMENTÉ       : Ada Lovelace (1843)
PREMIER LANGAGE LISIBLE       : John Mauchly avec Short Code (1949)
PREMIER LANGAGE MASSIVEMENT UTILISÉ : John Backus avec FORTRAN (1957)
PREMIER LANGAGE WEB         : Brendan Eich avec JavaScript (1995, en 10 jours)
```

JavaScript a été créé en 10 jours. Ça explique beaucoup de choses.

---

## 2. Les grands types de langages

Il existe plusieurs façons de classer les langages. Voilà les principales, avec des analogies concrètes pour que ça rentre vraiment.

---

### Bas niveau vs Haut niveau

**Bas niveau** : tu es très proche de la machine. Tu contrôles tout. La mémoire, les registres, les octets. C'est puissant, c'est ultra-rapide. C'est aussi dangereux si tu fais des erreurs.

```
Exemples : Assembleur, C

Analogie :
 Conduire une F1 sans assistance électronique.
 Tu peux aller très vite. Mais si tu rates une courbe, t'es dans le mur.
```

**Haut niveau** : le langage s'occupe de beaucoup de choses à ta place. La mémoire ? Gérée automatiquement. Les types ? Souvent déduits tout seuls. Tu te concentres sur la logique.

```
Exemples : Python, JavaScript, Kotlin, Swift

Analogie :
 Conduire une Tesla avec pilote automatique.
 Tu indiques la destination, la voiture gère le reste.
 Tu peux quand même tout contrôler si tu veux, mais t'as pas besoin.
```

"Bas niveau" et "haut niveau" ne veulent pas dire "mauvais" et "bon" : c'est juste le degré d'abstraction. Les deux ont leur place selon le contexte.

---

### Compilé vs Interprété vs JIT

C'est la question du "comment ton code devient un vrai programme qui tourne".

```
COMPILÉ (ex: C, C++, Rust, Go)
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 Ton code .c --> Compilateur --> .exe / binaire --> Exécuté
 (lisible)     (traducteur)   (machine pure)    (rapide)

 Avantage   : très rapide à l'exécution
 Inconvénient : tu dois recompiler après chaque modif

INTERPRÉTÉ (ex: Python, Ruby)
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 Ton code .py --> Interprète --> Exécuté ligne par ligne
 (lisible)     (lit + agit)   (en temps réel)

 Avantage   : flexible, facile à tester
 Inconvénient : un peu plus lent que le compilé

JIT : Just-In-Time (ex: JavaScript V8, Java JVM, Kotlin)
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 Ton code --> Compilé AU MOMENT où tu l'exécutes --> Exécuté
         (pas avant, pas ligne par ligne)

 Avantage : combine vitesse du compilé + flexibilité de l'interprété
 C'est ce que fait Chrome quand il exécute ton JS
```

> **Analogie pour le JIT :** t'imagines un chef cuisinier qui prend ta commande et cuisine exactement ce dont tu as besoin, juste à temps. Ni trop tôt (gâché), ni trop tard (froid).

---

### Les paradigmes de programmation

Un paradigme, c'est une philosophie. Une façon de penser ton code. Même langage, paradigmes différents = code complètement différent.

**Impératif** : tu dis à la machine COMMENT faire les choses, étape par étape.

```javascript
// Impératif : "voilà comment faire"
let total = 0;
for (let i = 0; i < nombres.length; i++) {
 total = total + nombres[i];
}
```

**Fonctionnel** : tu dis à la machine CE QUE tu veux obtenir. Tu travailles avec des fonctions pures. Pas de modification de variables existantes.

```javascript
// Fonctionnel : "voilà ce que je veux"
const total = nombres.reduce((acc, n) => acc + n, 0);
```

**Orienté Objet (POO)** : tu organises ton code autour d'"objets" qui ont des propriétés et des comportements. C'est la méthode la plus répandue en entreprise.

```python
# POO : les données et les actions sont dans le même endroit
class Voiture:
  def __init__(self, marque, vitesse_max):
    self.marque = marque
    self.vitesse_max = vitesse_max

  def presenter(self):
    print(f"Je suis une {self.marque}, je vais jusqu'à {self.vitesse_max} km/h")

ma_voiture = Voiture("Toyota", 180)
ma_voiture.presenter()
# Sortie : Je suis une Toyota, je vais jusqu'à 180 km/h
```

La plupart des langages modernes supportent plusieurs paradigmes. Python est impératif, fonctionnel et orienté objet selon ce que tu fais : t'as pas à choisir un camp.

---

### Front-end vs Back-end vs Full-stack

```
             L'APPLICATION WEB
     ________________________________________________
     |                        |
     |  FRONT-END          BACK-END    |
     |  (ce que tu vois)       (le moteur)   |
     |                        |
     |  HTML : la structure     Python     |
     |  CSS : le style       Java      |
     |  JS  : les interactions   PHP       |
     |  TS  : JS mais sérieux    Go       |
     |                Rust      |
     |                Node.js (JS)  |
     |                C#       |
     |________________________________________________|
               |
               v
            BASE DE DONNÉES
          (PostgreSQL, MySQL, MongoDB...)
```

**Full-stack** : tu fais les deux. Le dev qui fait le front ET le back.

**JavaScript / TypeScript** est le seul langage que tu peux utiliser partout : navigateur, serveur, mobile. C'est pour ça qu'il est si dominant.

**Mobile natif** :

```
iOS   : Swift
Android : Kotlin
```

**Mobile cross-platform** (une seule codebase pour iOS + Android) :

```
Flutter   : Dart (poussé par Google, très solide en 2026)
React Native : JavaScript (le plus ancien, encore très utilisé)
```

---

## 3. Top 10 des langages en 2026

### Le classement

```
RANG  LANGAGE   PART ESTIMÉE  USAGE PRINCIPAL        TENDANCE
----  -------   ------------  ---------------        --------
 1   Python      ~30%    IA, data, backend, scripts   Hausse constante
 2   JavaScript    ~23%    Web front + back, mobile    Stable / indispensable
 3   Java       ~15%    Enterprise, Android, backend  Stable / legacy fort
 4   TypeScript    ~12%    Web, tout ce que JS fait    Forte hausse
 5   C / C++     ~10%    Systèmes, jeux, performance  Stable
 6   Rust       ~8%    Systèmes, sécurité, WASM    Forte hausse
 7   Go        ~7%    Backend, microservices     En hausse
 8   Kotlin      ~6%    Android, backend Spring    Stable / hausse
 9   Swift       ~5%    iOS, macOS           Stable
10   C#        ~5%    Jeux Unity, Windows, enterprise Stable
```

*Les pourcentages sont des estimations relatives basées sur plusieurs indices croisés, pas des chiffres officiels absolus. C'est une tendance, pas une loi.*

---

### Portrait de chaque langage du top 10

**1. Python : le roi indiscutable en 2026**

```python
# Python c'est aussi propre que ça
def saluer(nom):
  return f"Bonjour {nom}, bienvenue dans le monde du code"

print(saluer("Prometheus"))
# Sortie : Bonjour Prometheus, bienvenue dans le monde du code
```

Pourquoi il domine : l'IA. ChatGPT, Gemini, tous les modèles d'IA sont entraînés avec Python. PyTorch, TensorFlow, Hugging Face : tout est en Python. Si tu veux toucher à l'IA en 2026, t'as pas vraiment le choix.

---

**2. JavaScript : l'incontournable du web**

```javascript
// JavaScript : partout, tout le temps
const devs = ["Alice", "Bob", "Prometheus"];
const message = devs.map(dev => `${dev} code en JS`);
console.log(message);
// ["Alice code en JS", "Bob code en JS", "Prometheus code en JS"]
```

Pourquoi il reste indispensable : c'est le seul langage natif des navigateurs. Tu peux faire du front, du back avec Node.js, du mobile avec React Native. Un seul langage pour tout.

---

**3. Java : le vétéran des grandes boîtes**

```java
// Java : verbeux mais solide
public class Salutation {
  public static void main(String[] args) {
    String nom = "Prometheus";
    System.out.println("Bonjour " + nom);
  }
}
```

Pourquoi il reste : les grandes banques, assurances, et entreprises ont des millions de lignes de code Java. On peut pas tout réécrire du jour au lendemain. Java a aussi la JVM qui est extraordinairement optimisée après 30 ans.

---

**4. TypeScript : JavaScript qui s'est calmé**

```typescript
// TypeScript : JS avec des types. Beaucoup moins de bugs stupides.
function calculerAge(anneeNaissance: number): number {
  return 2026 - anneeNaissance;
}

const age = calculerAge(2000);  // OK : 26
const bug = calculerAge("2000"); // ERREUR détectée avant même d'exécuter
```

En 2026, la majorité des nouveaux projets web professionnels sont en TypeScript, pas JavaScript. C'est devenu le standard de facto.

---

**5. C / C++ : les anciens qui refusent de mourir**

```c
// C : pas de magie. Tu gères toi-même ta mémoire.
#include <stdio.h>

int main() {
  int nombres[5] = {1, 2, 3, 4, 5};
  int total = 0;
  for (int i = 0; i < 5; i++) {
    total += nombres[i];
  }
  printf("Total : %d\n", total);
  return 0;
}
```

Utilisés dans le noyau Linux, Windows, macOS. Dans les voitures, les avions, les consoles de jeu. Partout où la performance est non-négociable.

---

**6. Rust : le nouveau shérif de la ville**

```rust
// Rust : aussi rapide que C, mais il t'empêche de faire des bêtises
fn main() {
  let nombres = vec![1, 2, 3, 4, 5];
  let total: i32 = nombres.iter().sum();
  println!("Total : {}", total);
}
// Si tu tentes d'accéder à une case mémoire invalide, Rust refuse de compiler.
// En C, ça aurait planté silencieusement en production.
```

Le gouvernement américain et l'Union Européenne ont officiellement recommandé Rust pour les logiciels critiques en 2024-2025. Microsoft réécrit des parties de Windows en Rust.

---

**7. Go : le langage de la simplicité radicale**

```go
// Go : minimaliste par design
package main

import "fmt"

func main() {
  prenoms := []string{"Alice", "Bob", "Prometheus"}
  for _, prenom := range prenoms {
    fmt.Printf("Bonjour %s\n", prenom)
  }
}
```

Créé par Google pour remplacer C++ dans leurs serveurs internes. Compile ultra-vite, s'exécute ultra-vite. Docker, Kubernetes, Terraform : tous écrits en Go.

---

**8. Kotlin : Java mais supportable**

```kotlin
// Kotlin : Java sans la verbosité
data class Developpeur(val nom: String, val langage: String)

fun main() {
  val dev = Developpeur("Prometheus", "Kotlin")
  println("${dev.nom} code en ${dev.langage}")
  // Prometheus code en Kotlin
}
```

Kotlin est maintenant le langage officiel d'Android. JetBrains (les créateurs d'IntelliJ IDEA et de la suite d'IDEs professionnels) le maintiennent activement.

---

**9. Swift : programmer pour Apple, enfin avec plaisir**

```swift
// Swift : propre, moderne, rapide
let devs = ["Alice", "Bob", "Prometheus"]
for dev in devs {
  print("Bonjour \(dev)")
}
```

Objective-C (l'ancien langage d'Apple) était tellement difficile à lire que les développeurs fuyaient le développement iOS. Swift a tout changé en 2014.

---

**10. C# : le polyvalent de Microsoft**

```csharp
// C# : Java-like mais made by Microsoft
var devs = new List<string> {"Alice", "Bob", "Prometheus"};
devs.ForEach(dev => Console.WriteLine($"Bonjour {dev}"));
```

Si tu veux faire des jeux avec Unity, c'est C#. Si tu veux faire des apps Windows, c'est C#. Dans les grandes boîtes européennes, C# est très présent dans les stacks .NET.

---

### Ce qui se passe en dehors du top 10

```
PHP  : peu de gens l'avouent, mais WordPress fait tourner ~43% du web mondial.
     PHP est partout.

Ruby  : décline depuis des années, mais Ruby on Rails est encore dans des milliers
     de startups.

Dart  : langage de Flutter. Poussé très fort par Google. En forte progression
     sur le mobile.

Lua  : discret mais présent dans TOUS les jeux vidéo. Roblox, WoW, etc.

SQL  : pas vraiment un langage de prog général, mais probablement le langage
     le plus utilisé dans le monde professionnel. Tout le monde y touche.

HTML/CSS : oubliés des classements parce que techniquement pas des "vrais langages
      de programmation". Mais sans eux, pas de web.

Zig  : challenger de C. Très jeune, très prometteur.

Carbon : challenger de C++. Créé par Google. À surveiller.

COBOL : personne ne l'apprend. Tout le monde l'utilise sans le savoir.
     Les banques font tourner des systèmes critiques en COBOL.
     Les gens qui savent le maintenir sont payés TRÈS cher.
```

---

## 4. Comment choisir son langage ?

C'est LA question. Et la réponse honnête : ça dépend.

Mais "ça dépend" tout seul c'est inutile. Voilà les vraies questions à se poser, dans l'ordre.

---

### Question 1 : Pour quoi faire ?

Le langage suit le besoin. **Jamais l'inverse.**

```
SI TU VEUX FAIRE...          CHOISIS...
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Un site web (interface)      :  JavaScript / TypeScript
Une API ou un serveur web     :  Node.js, Python, Go, Java, PHP
Une app mobile iOS        :  Swift
Une app mobile Android      :  Kotlin
Une app mobile iOS + Android   :  Flutter (Dart) ou React Native (JS)
Un jeu vidéo           :  C# (Unity) / C++ (Unreal) / GDScript (Godot)
De l'IA ou de la data       :  Python (et rien d'autre en 2026)
Des outils système / performance :  C, C++, Rust
Des scripts d'automatisation   :  Python, Go, Bash
Des applications d'entreprise   :  Java, C#, Kotlin
Du WebAssembly          :  Rust, C++ (calculs lourds -> jeux 3D, physique, photoshop en ligne, figma, etc.)
```

---

### Question 2 : Projet perso ou pro ?

**Projet perso** : fais ce qui te fait vibrer. Si un langage t'ennuie et qu'un autre te donne envie de coder le soir en grignotant des chips, prends celui qui te fait kiffer. La motivation, c'est ton carburant. Tout ce que tu apprends se retransformera plus tard.

> Exemple : Python te gave mais Rust te fait rêver ? Vas-y. Tu vas quand même apprendre des concepts qui te serviront ailleurs. La motivation c'est le turbo pour ton cerveau.

**Projet pro / startup** : mise sur ce qui a la plus grosse communauté, le plus de librairies et de devs autour. Comme ça, si ton projet cartonne, tu pourras recruter ou trouver des solutions rapidement.

> **Astuce :** check les offres d'emploi dans ta ville ou ton pays cible. Ce qui est demandé là, c'est ce que tu dois apprendre pour être un pro du marché.

---

### Question 3 : Maintenant ou long terme ?

```
PROTOTYPER VITE (dans les semaines) : Langage rapide, qui te fait pas chier
                    avec la mémoire ou les compilations.
                    Tu veux voir ton code vivre tout de suite.
                    (Ex: Python, JavaScript)

Systèmes qui durent 10 ans      : Langage solide, énorme communauté,
                    utilisé par des entreprises depuis des
                    décennies, pas de risque qu'il disparaisse.
                    (Ex: Java, C#, Rust)

Performance critique         : Langage qui te laisse contrôler chaque
                    octet. Plus compliqué à gérer, mais plus
                    rapide et précis.
                    (Ex: C, C++, Rust, Go)
```

---

### Question 4 : La communauté est grande comment ?

Plus la communauté est grande, plus tu as :

```
- De la documentation (souvent traduite en français)
- Des librairies et frameworks déjà faits (t'as pas à tout réinventer)
- Des réponses sur Stack Overflow (quelqu'un a eu ton problème avant toi)
- Des offres d'emploi (important quand tu veux bosser)
- Des tutos YouTube gratuits
```

**Classement des communautés en 2026 :**

```
Énorme          : Python, JavaScript, Java
Grande          : TypeScript, C#, C/C++, Rust
Moyenne         : Go, Kotlin, Swift, PHP
Plus petite mais solide : Ruby, Dart, Scala
```

---

### Conseil anti-paralysie

La "paralysie de l'analyse" c'est quand tu passes 3 semaines à comparer des langages au lieu de coder. C'est l'ennemi numéro 1 des débutants.

```
Tu te demandes : Python ou JavaScript ?
         Flutter ou React Native ?
         Go ou Rust ?

La vraie réponse : CHOISIS ET COMMENCE.
Tu changeras peut-être dans 6 mois. C'est pas grave.
Les concepts que tu apprends dans un langage se transfèrent.
```

---

## 5. Débutant ou intermédiaire : par où commencer ?

### Si tu es complètement débutant

Commence par un langage **simple à lire et à comprendre**, pour que ton cerveau se concentre sur la logique, pas sur la syntaxe.

Exemples:

- **Python** : super lisible, rapide à écrire, tu vois tout de suite ce que ton code fait.
- **JavaScript** : si tu veux te lancer sur le web, voir le résultat direct dans le navigateur, c'est motivant et fun.

> Astuce : Commence par Python si tu sais pas, c'est le point d'entrée le plus smooth. Mais si ton rêve c'est de créer des sites web ou des applis front, JS est ton ami. Les concepts que tu apprends (variables, boucles, fonctions) se réutilisent partout, peu importe le langage.

```python
# Python : tu lis, tu comprends immédiatement
prenoms = ["Alice", "Bob", "Prometheus"]
for prenom in prenoms:
  print(f"Bonjour {prenom}")
```

```javascript
// JavaScript : presque aussi lisible
const prenoms = ["Alice", "Bob", "Prometheus"];
prenoms.forEach(prenom => console.log(`Bonjour ${prenom}`));
```

```java
// Java : le même résultat, mais beaucoup plus de bruit
import java.util.Arrays;
import java.util.List;

public class Main {
  public static void main(String[] args) {
    List<String> prenoms = Arrays.asList("Alice", "Bob", "Prometheus");
    for (String prenom : prenoms) {
      System.out.println("Bonjour " + prenom);
    }
  }
}
```

Ces trois programmes font la même chose. Mais en tant que débutant, tu veux comprendre la logique avant de te noyer dans le code. Python ou JS te donnent cette super-puissance.

---

### Le parcours recommandé selon ton objectif

```
OBJECTIF : DEV WEB FULL-STACK
:::::::::::::::::::::::::::::::::::::::::
 Début  --> HTML + CSS + JavaScript basique
 3 mois  --> JavaScript (fonctions, objets, fetch/API)
 6 mois  --> TypeScript + React ou Vue
 1 an   --> Next.js ou Nuxt + DB (SQL ou NoSQL)
 1 an+  --> Déploiement, Docker, CI/CD
 Résultat :  Dev web junior employable

OBJECTIF : DEV MOBILE
:::::::::::::::::::::::::::::::::::::::::
 Cross-platform :
  Début  --> Dart basique
  3 mois  --> Flutter (ou React Native)
  6 mois  --> Firebase / Supabase
  1 an   --> App sur Play Store / App Store

 Android natif :
  Début  --> Kotlin basique + POO
  3 mois  --> Jetpack Compose
  6 mois  --> MVVM + Retrofit
  1 an   --> App publiée

OBJECTIF : DATA / IA
:::::::::::::::::::::::::::::::::::::::::
 Début  --> Python basique
 3 mois  --> NumPy + Pandas
 6 mois  --> Matplotlib + Seaborn
 1 an   --> Machine Learning avec scikit-learn
 1 an+  --> Deep Learning (PyTorch ou TensorFlow)

OBJECTIF : SYSTÈMES / PERFORMANCE
:::::::::::::::::::::::::::::::::::::::::
 Début  --> C (mémoire, pointeurs)
 6 mois  --> C++ ou Rust
 1 an   --> Architecture bas niveau, OS, compilateurs
```

> Choisis ton parcours comme un RPG : chaque étape = un niveau, chaque skill = une arme ou un sort pour ton futur métier.

---

### La règle des deux technologies

Ne cherche pas à tout apprendre en même temps. En 2026, la règle d'or c'est :

```
Maîtrise UN langage + maîtrise UN framework ou domaine spécifique.

Exemples concrets :
 Python  + FastAPI  --> Dev backend API
 Python  + PyTorch  --> IA / Machine Learning
 JS/TS  + React   --> Dev front-end web
 JS/TS  + Next.js  --> Dev full-stack web
 Dart   + Flutter  --> Dev mobile cross-platform
 Kotlin  + Jetpack  --> Dev Android natif
 C#    + Unity   --> Dev jeu vidéo
 Go    + (rien)   --> Backend microservices (Go se suffit souvent)
```

> La profondeur bat la largeur. Un dev qui maîtrise vraiment React + TypeScript vaut plus qu'un dev qui connaît vaguement React, Vue, Angular, Svelte et Solid en même temps.

---

## 6. J'ai une idée ou un cahier des charges : je fais quoi exactement ?

C'est la section la plus importante. Parce que c'est exactement la situation où la majorité des étudiants se perdent. Tu sors de cours, tu sais coder. Et là tu te demandes "mais dans la vraie vie, je fais quoi exactement ?"

---

### Étape 1 : Définir le type de produit

**Avant de choisir un seul outil ou langage**, tu dois savoir ce que tu construis.

Pose-toi ces questions dans l'ordre :

```
1. C'est quoi l'produit ?
  (site web / app mobile / outil interne / jeu / API / script...)

2. Qui va l'utiliser ?
  (grand public / entreprises / toi seul / des développeurs...)

3. Sur quel appareil ?
  (navigateur / téléphone / bureau / serveur / les deux...)

4. Y a-t-il de la donnée à stocker ?
  (oui --> tu as besoin d'une base de données)

5. Faut-il se connecter à des services externes ?
  (tribut, GPS, notifications push, emails, SMS...)

6. Y a-t-il des contraintes légales ?
  (santé, finances, données personnelles --> RGPD, sécurité renforcée)
```

Exemple pratique :

```
Idée : "je veux créer une app pour noter et partager des restaurants"

Réponses :
 1. App mobile + site web
 2. Grand public
 3. Téléphone principalement
 4. Oui : restaurants, avis, utilisateurs, notes
 5. Oui : GPS (maps), photos, notifications
 6. Données personnelles : respecter le RGPD

Conclusion : app mobile (Flutter) + backend API (Node ou Python)
       + base de données (PostgreSQL ou Firebase)
       + service de maps (Google Maps API)
```

---

### Étape 2 : Identifier les contraintes réelles

```
CONTRAINTE          IMPACT SUR LE CHOIX TECH
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Peu de temps        : Technos que tu connais DÉJÀ.
               Pas le moment d'apprendre Rust.

Pas de budget       : Vercel (gratuit), Supabase (gratuit),
               Firebase (gratuit au début).

Travail en équipe     : Ce que tout le monde dans l'équipe sait déjà.
               Pas le moment d'imposer un langage exotique.

Doit durer longtemps    : Java, C#, Rust : stables, maintenus sur le long terme.
               Évite les frameworks trop jeunes (ils disparaissent vite).

Beaucoup d'utilisateurs  : Pense à la scalabilité. Go et Node.js gèrent bien la
potentiels          charge. PostgreSQL tient mieux que certaines bases
               NoSQL sous haute charge.

Client / projet scolaire  : Choisis ce qui te permet de livrer quelque chose qui MARCHE.
               Un projet simple qui fonctionne vaut 100x mieux qu'un
               projet complexe qui plante.
```

---

### Étape 3 : Choisir la stack

Une **stack** c'est l'ensemble des technologies que tu vas utiliser. Front + Back + Base de données + Hébergement.

```
SITE WEB ou APP WEB : stack moderne débutant-intermédiaire suggérée
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 Front-end    : Next.js (React + TypeScript)
 Back-end     : Inclus dans Next.js via API routes, ou Supabase directement
 Base de données : PostgreSQL via Supabase
 Auth       : Supabase Auth (Google, GitHub, email/password)
 Hébergement   : Vercel (gratuit pour les petits projets)
 Style      : Tailwind CSS

 Alternatives front : Vue.js + Nuxt, SvelteKit, Astro
 Alternatives back  : Express.js, FastAPI en Python, NestJS
 Alternatives DB   : MySQL, MongoDB, Firebase Firestore
 Alternatives auth  : Firebase Auth, Auth.js, Clerk
 Alternatives héberg : Netlify, Railway, Render, Firebase Hosting
 Alternatives style : Bootstrap, Shadcn/ui, Chakra UI

 Avantages : tout est gratuit au début, très bien documenté, des milliers de tutos.

APPLICATION MOBILE : cross-platform
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 Langage   : Dart
 Framework  : Flutter
 Backend/Auth : Firebase ou Supabase
 Maps     : Google Maps Flutter Plugin
 Déploiement : Google Play Store + Apple App Store

 Alternatives langage  : JavaScript/TypeScript, Kotlin Multiplatform
 Alternatives framework : React Native, Expo, Ionic
 Alternatives backend  : Appwrite, PocketBase, ton propre serveur
 Alternatives maps    : Mapbox, OpenStreetMap via flutter_map
 Alternatives déploi   : APK direct pour Android, TestFlight pour bêtas iOS

APPLICATION MOBILE : natif Android
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 Langage   : Kotlin
 UI      : Jetpack Compose
 Architecture : MVVM + Clean Architecture
 Backend   : Firebase ou API REST

 Alternatives langage : Java, Flutter/Dart si tu veux iOS aussi
 Alternatives UI    : XML Views classique, Flutter Widgets
 Alternatives archi  : MVI, MVP pour les projets plus simples
 Alternatives backend : Supabase, Appwrite, ton propre serveur Express

OUTIL INTERNE ou SCRIPT
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 Python + librairies selon le besoin
 (requests pour les APIs, pandas pour la data, etc.)

 Alternatives : Node.js, Bash pour les scripts simples, Go pour la perf

JEU VIDÉO
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 Plupart des cas   : Unity + C#
 Gratuit open source : Godot + GDScript (ou C#)
 AAA / ultra-perf  : Unreal Engine + C++

 Alternatives Godot : Pygame en Python pour débuter
 Alternatives Unreal : CryEngine, custom engine si t'es fou
```

---

### Étape 4 : Ne pas surarchitecturer

C'est **l'erreur classique** de l'étudiant en info.

```
SCÉNARIO TYPE :
 Le projet : une application de prise de notes (3 écrans).

 Ce que l'étudiant fait :
  Semaine 1 : configure Docker + Docker Compose
  Semaine 2 : met en place Kubernetes
  Semaine 3 : architecture microservices avec 4 services séparés
  Semaine 4 : pipeline CI/CD sur GitHub Actions
  Semaine 5 : ... il n'a pas encore une seule note dans l'app

 PROBLÈME : l'étudiant a construit l'infrastructure d'Amazon pour une app de notes.

LA BONNE APPROCHE :
 Semaine 1 : l'app de notes fonctionne, on peut créer une note et la lire.
 Semaine 2 : on peut modifier et supprimer une note.
 Semaine 3 : authentification.
 Semaine 4 : déploiement simple sur Vercel.
 Plus tard : si ya 10 000 utilisateurs, là on réfléchit à Docker et Kubernetes.
```

> **Docker** = une boîte magique qui emballe ton app pour qu'elle tourne partout pareil. **Compose** = plusieurs boîtes qui se parlent. **Kubernetes** = un chef d'orchestre qui gère des milliers de boîtes Docker en même temps. Utilisé par Google, Netflix. **Microservices** = au lieu d'une seule app, tu découpes en mini-apps qui communiquent. Amazon a des centaines de microservices. **CI/CD** = un robot qui teste et déploie ton code automatiquement à chaque push.

> **Règle : commence simple.** Ajoute de la complexité quand le BESOIN apparaît vraiment, pas avant. Un MVP (Minimum Viable Product) c'est la version la plus simple possible qui résout le vrai problème. Tout le reste vient après.

---

### Le schéma de décision complet

```
            TU AS UN PROJET
               |
               v
        Qu'est-ce que tu construis ?
               |
       _______________|_______________
       |        |       |
      WEB       MOBILE     AUTRE
       |        |       |
    interface ?    iOS seul ?  Jeu vidéo ?
       |        |       |
      Oui      --> Swift   Unity + C#
       |        |     Unreal + C++
    Next.js (TS)   Android seul ? Godot + GDScript
    React / Vue      |       |
    SvelteKit     --> Kotlin  Script / Outil ?
               |       |
             Les deux ?  Python + libs
               |       |
             --> Flutter  IA / Data ?
              (Dart)      |
               |     Python SEUL
             _____|_____  PyTorch / TF
            |      | scikit-learn
            API     API
          incluse    séparée
          (Supabase)    |
                Qui fait le back ?
                   |
                ______|______
               |       |
              JS / TS    Python
               |       |
              Node.js    FastAPI
              Express    Django
              Fastify    Flask
               |
               v
            BASE DE DONNÉES ?
               |
          __________|__________
          |           |
     Données relationnelles  Données flexibles
     (tableaux + relations)  (documents JSON)
          |           |
        PostgreSQL       MongoDB
        MySQL         Firebase Firestore
        SQLite (local)
               |
               v
             HÉBERGEMENT ?
               |
          __________|__________
          |     |     |
         Vercel   Railway  Render
        (front /  (back /  (back /
        Next.js)  Node/Py)  Node/Py)
         Gratuit  Gratuit  Gratuit
         au début  au début  au début
```

---

### Quand utiliser ce qu'on apprend à l'école ?

```
À L'ÉCOLE tu apprends Python.
DANS LA VRAIE VIE tu l'utilises pour :
 Data science, analyse, visualisation
 Scripts d'automatisation
 APIs et backends
 IA et Machine Learning
 Web scraping (extraire automatiquement des données depuis un site web)
 Tests automatisés

À L'ÉCOLE tu apprends JavaScript.
DANS LA VRAIE VIE tu l'utilises pour :
 Tout ce qui s'affiche dans un navigateur (obligatoire)
 Les applications web full-stack (Next.js, Nuxt)
 Les apps mobiles (React Native)
 Le backend avec Node.js
 Les scripts d'automatisation web

À L'ÉCOLE tu apprends Java.
DANS LA VRAIE VIE tu l'utilises pour :
 Les grandes entreprises et banques
 Le backend d'applications critiques
 Android (mais Kotlin le remplace)
 Les systèmes qui doivent tourner 24/7 sans jamais tomber

À L'ÉCOLE tu apprends C ou C++.
DANS LA VRAIE VIE tu l'utilises pour :
 Comprendre comment un ordinateur fonctionne vraiment
 Les logiciels où la performance est critique
 Les jeux vidéo avec Unreal Engine
 Les systèmes embarqués (arduino, robotique)
 Le trading haute fréquence
 Les noyaux de systèmes d'exploitation
```

---

### Exemple concret complet : de l'idée à la stack

**Situation** : tu veux créer une plateforme communautaire pour développeurs. Des profils utilisateurs, des posts, des likes, une messagerie en temps réel.

**Analyse du projet** :

```
Type de produit   : Application web (mobile en version 2 peut-être)
Utilisateurs     : Des développeurs : public averti, ils utilisent un navigateur
Fonctionnalités clés : Auth, profils, posts, likes, messagerie temps réel
Contrainte principale: messagerie en temps réel = besoin de websockets ou subscriptions
Budget        : Zéro (projet perso / scolaire)
Temps        : 3 mois
```

**Stack choisie** :

```
Front-end    : Next.js (TypeScript)
Styles      : Tailwind CSS
Backend     : Supabase (API auto-générée depuis PostgreSQL)
Auth       : Supabase Auth
Base de données : PostgreSQL via Supabase
Temps réel    : Supabase Realtime (websockets inclus)
Hébergement   : Vercel (gratuit)
```

**Pourquoi pas quelque chose de plus complexe ?**

```
Parce que ça suffit. Ces outils sont gratuits au début. Ils sont scalables si le
projet grandit. La doc est excellente. Des milliers de tutos existent.
Tu peux livrer en 3 mois, pas en 3 ans.
```

---

## 7. Les vérités qu'on te dira jamais en cours

**Vérité 1 : Le meilleur langage c'est celui que tu maîtrises vraiment.**

Un dev qui connaît JavaScript sur le bout des doigts battra toujours quelqu'un qui connaît vaguement dix langages. La profondeur bat la largeur, toujours.

**Vérité 2 : Les langages ne meurent pas vraiment.**

COBOL de 1959 tourne encore dans les banques en 2026. FORTRAN tourne encore dans les labos scientifiques. Si t'apprends un langage "mort", les concepts que tu apprends restent valides partout. Mais pour le marché de l'emploi, choisis quelque chose de vivant.

**Vérité 3 : Les concepts se transfèrent.**

```
Si tu maîtrises vraiment Python :
 Apprendre Go prend quelques semaines.
 Apprendre Kotlin prend quelques semaines.
 Apprendre Swift prend quelques semaines.

Les boucles, les conditions, les fonctions, les objets, les erreurs :
 c'est pareil partout. La syntaxe change. La logique, non.
```

**Vérité 4 : La stack ne fait pas tout.**

```
Applications extraordinaires construites avec des technos "basiques" :
 Instagram au début : Python + Django. Simple. Efficace.
 Twitter au début  : Ruby on Rails. Pas très "cool". Mais ça marchait.
 WhatsApp      : Erlang. Un langage de 1986. 2 milliards d'utilisateurs.

Applications catastrophiques construites avec les technos les plus modernes :
 Il y en a plein. On en parle juste moins parce que personne les connaît.

La qualité du code et de l'architecture comptent plus que le choix du langage.
```

**Vérité 5 : Lire du code des autres est aussi important qu'en écrire.**

Passe du temps sur GitHub. Lis des projets open source dans ton domaine. Essaie de comprendre comment les autres ont résolu les mêmes problèmes que toi. C'est comme lire des livres pour un écrivain : indispensable.

**Vérité 6 : Le syndrome de l'imposteur est universel.**

Même les devs avec 15 ans d'expérience googlèrent des trucs basiques tous les jours. Tout le monde le fait. Personne ne sait tout par cœur. La différence entre un junior et un senior c'est souvent juste le nombre de fois où il a résolu le même type de problème.

**Vérité 7 : Les outils changent. Les fondamentaux, non.**

Les frameworks changent tous les 3 ans. Angular, React, Vue, Svelte, Solid... dans 5 ans il y en aura d'autres. Mais quelqu'un qui comprend vraiment le DOM, les événements, l'asynchrone et les requêtes HTTP s'adaptera en quelques semaines à n'importe quel nouveau framework.

> Construis des fondations solides. Le reste vient tout seul.

---

> *Ces informations sont des tendances, pas des chiffres officiels absolus.*
> *Les technos évoluent vite : toujours vérifier les sources récentes avant une décision importante.*

---

## 8. Les métiers du dev : la carte au trésor que personne t'a donnée

> *"J'apprends à coder comme quelqu'un qui vient de découvrir une porte secrète dans un donjon. Je sais qu'il y a des trésors derrière... mais je veux comprendre : Quels sont TOUS les chemins possibles, qui les emprunte, avec quels outils, et lequel me rend riche ou heureux : idéalement les deux ?"*

Ok. T'as appris à coder. Bonne nouvelle : t'as maintenant accès à l'une des industries les plus larges, les plus diverses, et les mieux payées de la planète. Mauvaise nouvelle : Y'a tellement de métiers que la plupart des gens ne savent même pas qu'ils existent.

Ce chapitre, c'est le GPS complet. Pas juste "dev frontend vs backend". Vraiment tout.

---

### La carte complète de l'industrie software

```
          L'INDUSTRIE DU LOGICIEL
  ____________________________________________________________
  |                              |
  | CE QUE LES SHINOBIS VOIENT  CE QUI FAIT TOURNER  |
  | (layer produit)          (layer infrastructure) |
  |                              |
  | Frontend Dev     Backend Dev   DevOps/SRE     |
  | Mobile Dev      Data Engineer  Cloud Engineer   |
  | UI/UX Engineer    API Engineer   Platform Engineer |
  |                              |
  | CE QUI REND INTELLIGENT      CE QUI PROTÈGE TOUT   |
  | (layer intelligence)       (layer sécurité)    |
  |                              |
  | ML Engineer      Data Scientist  Security Engineer |
  | AI Engineer      Research Eng.  Pentest / Red Team |
  |                              |
  | LES PILIERS TRANSVERSES                  |
  |                              |
  | Software Engineer   Full-Stack Dev  Tech Lead     |
  | Software Architect  Engineering Manager  CTO     |
  |____________________________________________________________|
  |                              |
  | SPÉCIALISATIONS SECTORIELLES               |
  | Game Dev | Blockchain Dev | Embedded Systems Dev   |
  | Compiler Engineer | Graphics Engineer | Kernel Dev  |
  |____________________________________________________________|
```

---

### Les métiers du quotidien : ce qu'ils font VRAIMENT

---

#### Frontend Developer

**En une phrase** : il construit tout ce que tu vois et touches dans une interface. Le bouton, la liste, l'animation, le formulaire.

**Une journée type** :

```
09h00 Réunion avec l'équipe design : les maquettes Figma sont prêtes
09h30 Implémentation d'un nouveau composant React (formulaire de connexion)
11h00 Bug : le layout explose sur mobile Samsung Galaxy S22 -> débogage CSS
12h00 Code review : il relit le code d'un collègue, laisse des commentaires
14h00 Intégration d'une API backend : fetch des données utilisateur
16h00 Optimisation : réduction du bundle, lazy loading des images
    (bundle = fichiers JS/CSS regroupés pour que la page charge vite)
17h30 Déploiement sur la branche de staging pour validation
    (dev -> staging -> production : les utilisateurs voient la version finale)
```

**Technologies typiques** :

```
Obligatoire : HTML, CSS, JavaScript, TypeScript
Frameworks  : React, Vue, Angular, Svelte
Outils    : Webpack/Vite, Git, npm/yarn, Chrome DevTools
Tests    : Jest, Vitest, Playwright, Cypress
Styles    : Tailwind CSS, CSS Modules, Styled Components
État global : Redux, Zustand, Pinia, Jotai
```

**Exemple : ce qu'un vrai frontend dev rencontre tous les jours :**

```javascript
// Ce que le designer a livré dans Figma
// "c'est juste un bouton centré, simple"

// Ce que le frontend dev a eu à gérer en vrai
const Button = ({ label, onClick, isLoading, isDisabled, variant, size, icon }) => {
 // 47 lignes plus tard...
 // fonctionne sur Chrome, Firefox, Safari, et le Nokia 3310 du client
 return <button>...</button>
}
// Le client voit le résultat : "ouais mais il est pas assez rond"
```

**Compétences clés** : maîtrise du DOM et des événements browser, responsive design et accessibilité (WCAG : règles pour rendre ton site utilisable par tout le monde, y compris les personnes handicapées), optimisation des performances (Core Web Vitals : métriques Google pour mesurer la performance ressentie par l'utilisateur), compréhension des API REST et GraphQL, collaboration avec les designers via Figma.

Un bon frontend dev en 2026 comprend le réseau : pourquoi une page charge lentement, ce qu'est un cache HTTP, comment un CDN (réseau de serveurs répartis dans le monde qui stockent des copies de tes fichiers statiques) fonctionne. Sans CDN, un utilisateur à Tokyo télécharge tes images depuis Paris : lent. Avec CDN : depuis Tokyo : rapide. Pas juste "faire joli".

---

#### Backend Developer

**En une phrase** : il construit le moteur. La logique métier, les APIs, les bases de données, la sécurité des données.

**Une journée type** :

```
09h00 Review des logs de prod : y'a eu une erreur 500 à 3h du matin
09h30 Débogage : une requête SQL non optimisée qui bloquait toute la base
11h00 Implémentation d'un nouvel endpoint : POST /api/v2/orders
    (GET = tu lis une page / POST = tu envoies des données, il se passe quelque chose)
13h30 Écriture des tests unitaires pour la logique de tribut
15h00 Discussion architecture : comment gérer 10x plus de requêtes
16h30 Documentation de l'API dans Swagger/OpenAPI
    (outil qui génère automatiquement une documentation interactive de ton API)
17h30 Code review et merge de deux pull requests
```

**Technologies typiques** :

```
Langages     : Node.js (JS/TS), Python, Java, Go, C#, PHP, Rust
Frameworks    : Express, Fastify, FastAPI, Spring Boot, Gin, Laravel
Bases de données : PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
Outils      : Docker, Git, Postman, Swagger
Cloud      : AWS/GCP/Azure (basiques)
```

**Exemple : le quotidien du backend dev :**

```javascript
// Ce que le frontend pense que l'API fait
fetch('/api/user/42')
// -> renvoie les données de l'utilisateur, boom, done

// Ce que le backend dev a réellement écrit
app.get('/api/user/:id', async (req, res) => {
 // vérifie que t'es authentifié
 // vérifie que t'as le droit de voir CET utilisateur (pas juste n'importe lequel)
 // sanitize l'id (quelqu'un a déjà envoyé "42; DROP TABLE users;")
 // requête DB avec retry si connexion timeout
 // cache le résultat 60s pour pas brûler la base
 // log la requête pour le monitoring (surveiller ton app en temps réel)
 // gère 14 cas d'erreur différents
 // renvoie les données
 // et si c'est vendredi soir : prie pour que rien ne casse le weekend
})
```

**Compétences clés** : conception de bases de données (schémas, indexation, migrations), sécurité (authentification, JWT, OAuth2, HTTPS), design d'API (REST, GraphQL, gRPC), performance et scalabilité, logging et monitoring en production.

---

#### Mobile Developer

**En une phrase** : il construit les apps qu'on passe 4h par jour à utiliser.

Il se subdivise en deux sous-métiers distincts :

```
     NATIF            CROSS-PLATFORM
::::::::::::::::::::::      ::::::::::::::::::::::::
 iOS Dev   Android Dev    Flutter Dev    React Native Dev
 Swift    Kotlin       Dart       JS/TS
 SwiftUI   Jetpack Compose  Flutter      RN Components
 Xcode    Android Studio   Pub packages   npm packages
 TestFlight  Firebase Test Lab Firebase     Firebase
```

**Différences réelles** :

```
CRITÈRE         NATIF       CROSS-PLATFORM
::::::::::::       :::::::      ::::::::::::::::
Performance       Maximale      Très bonne
Accès hardware      Complet      Partiel
Une seule codebase    Non        Oui
Vitesse de dev      Plus lent     Plus rapide
Rendu UI         100% natif     Quasi-natif (Flutter)
Marché emploi      Large       En forte croissance
```

**Une journée type (Flutter Dev)** :

```
09h00 Fix layout : débordement sur petits écrans
10h30 Notifications push avec Firebase Cloud Messaging
12h30 Discussion architecture des states (Bloc vs Riverpod)
14h00 Tests sur appareils physiques et simulateurs
15h30 Optimisation : temps de démarrage de 2s -> 0.8s
17h00 Publication beta sur le Play Store via Fastlane
```

---

#### Full-Stack Developer

**En une phrase** : il peut construire le frontend ET le backend. Pas forcément expert dans les deux : mais opérationnel partout.

```
               FULL-STACK DEV
               ____________
               |      |
             Frontend   Backend
             React/TS   Node.js
             Next.js    PostgreSQL
             Tailwind   Supabase
               |____________|
                  |
          Déploie lui-même sur Vercel + Railway
```

**Exemple : la réalité d'un full-stack dans une startup :**

```javascript
// Lundi : "t'es full-stack non ? Tu peux aussi jeter un oeil au DevOps ?"

// Mardi matin
git commit -m "fix: bug critique en prod qui crashait 50% des utilisateurs"

// Mardi après-midi
git commit -m "feat: nouvelle page d'accueil avec animations"

// Mercredi
git commit -m "fix: j'avais cassé la base de données avec les animations"

// Vendredi
git commit -m "docs: README mis à jour (enfin)"
// -> spoiler : le README n'a jamais été mis à jour
```

La plupart des full-stacks ont une "main hand". Ils font les deux, mais sont vraiment experts dans un seul côté. Dans les startups, c'est le profil le plus recherché : il livre vite. Dans les grandes boîtes, on lui demande souvent de choisir un camp. C'est parfaitement normal.

---

#### Software Engineer

**En une phrase** : titre généraliste, rôle qui varie énormément selon le contexte.

Dans la Silicon Valley et les grandes tech companies, **Software Engineer** est le titre de base pour tous les devs. Chez Google, Meta, Stripe : tout le monde est "SWE".

Ce qui le distingue d'un simple dev : il pense systèmes et non juste features, il se préoccupe de la maintenabilité à long terme, il connaît les patterns et les structures de données, il fait passer ses solutions à l'échelle.

---

#### DevOps / SRE (Site Reliability Engineer)

**En une phrase** : il s'assure que ce que les devs ont construit tourne en production, que ça scale, et que ça tombe pas.

```
LE MONDE AVANT DEVOPS     LE MONDE AVEC DEVOPS
:::::::::::::::::::      ::::::::::::::::::::
Dev : "mon code marche    Dev + Ops travaillent
 en local, c'est bon"    ensemble depuis le début
Ops : "ton truc plante    Pipeline CI/CD automatisé
 en prod, pas mon      Monitoring en temps réel
 problème"          Infrastructure as Code
 -> les deux se détestent  -> les deux se comprennent
```

**Technologies typiques** :

```
Conteneurs : Docker, Kubernetes, Helm
CI/CD    : GitHub Actions, GitLab CI, Jenkins, CircleCI
Cloud    : AWS, GCP, Azure (expert level)
IaC     : Terraform, Ansible, Pulumi
Monitoring : Prometheus, Grafana, Datadog, PagerDuty
Scripting  : Bash, Python, Go
```

Ce qu'il fait vraiment : écrire les pipelines de déploiement, configurer les serveurs sans les toucher à la main (Infrastructure as Code), répondre aux alertes de production à 3h du matin (rotation d'astreinte, c'est réel), maintenir 99.99% de disponibilité.

> **SRE** est la version formalisée par Google. Même idée, mais avec plus d'ingénierie et moins de "ops" pur.

---

#### Data Engineer

**En une phrase** : il construit les tuyaux par lesquels les données circulent.

```
DONNÉES BRUTES --> DATA ENGINEER --> DONNÉES PROPRES ET ACCESSIBLES
(logs, APIs,     (construit les    (Data Scientists, analystes,
 bases, fichiers)   pipelines ETL)    ML models peuvent travailler)
```

**Technologies typiques** :

```
Langages   : Python, SQL, Scala
Frameworks  : Apache Spark, Apache Kafka, dbt, Airflow
Cloud     : BigQuery, Snowflake, Redshift, AWS S3
Orchestration : Apache Airflow, Prefect, Dagster
```

> Ne pas confondre avec : Data Scientist (qui analyse les données) ou ML Engineer (qui entraîne des modèles). Le Data Engineer construit l'infrastructure qui rend tout ça possible. Il est le plombier : invisible quand tout va bien, indispensable quand les tuyaux fuient.

---

#### Machine Learning / AI Engineer

**En une phrase** : il entraîne, déploie et maintient des modèles d'intelligence artificielle.

```
ML ENGINEER vs DATA SCIENTIST
::::::::::::::::::::::::::::::::::::::::::::::
Data Scientist : explore les données, teste des hypothèses,
          "ça marche sur mon ordi en Jupyter Notebook"

ML Engineer   : prend le modèle et le rend utilisable en production :
          API rapide, scalable, mise à jour auto,
          monitoring du modèle en temps réel
```

**Technologies typiques** :

```
Langages   : Python (exclusivement ou presque)
Frameworks ML : PyTorch, TensorFlow, JAX, scikit-learn
Serving    : FastAPI, Triton Inference Server, TorchServe
MLOps     : MLflow, Weights & Biases, DVC, Kubeflow
Cloud ML   : SageMaker (AWS), Vertex AI (GCP), Azure ML
LLMs/Agents  : Hugging Face, LangChain, LlamaIndex
```

---

#### Security Engineer

**En une phrase** : il cherche les failles avant que quelqu'un de malveillant les trouve.

```
DÉFENSIVE (Blue Team)     OFFENSIVE (Red Team / Pentester)
:::::::::::::::::::      ::::::::::::::::::::::::::::::::::
Construit des défenses     Attaque les systèmes de l'entreprise
Audit et hardening       Avec autorisation (pour trouver les failles)
SIEM, IDS/IPS         Kali Linux, Metasploit, Burp Suite
Réponse aux incidents     CVE, exploits, social engineering
SOC (Security Operations)   Rapport de vulnérabilités
```

Les security engineers sont parmi les mieux payés de l'industrie. La demande explose. L'offre de profils qualifiés reste très faible.

---

### Exemple avec une application : Amorya

Une app de rencontre où les utilisateurs créent un profil, matchent, et discutent. Chaque swipe, chaque message génère des données. Ces données, quelqu'un doit les collecter, les lire, les protéger, et les déployer.

#### Le workflow

```
              AMORYA
          Application mobile et web
               |
         l'utilisateur swipe, matche, envoie des messages
               |
               v
            DEV WEB / MOBILE
        Construit l'app. Chaque action
        est enregistrée en base de données.
               |
       données brutes : swipes, matchs, messages, connexions
               |
               v
            DATA ENGINEER
        Collecte tout ce que l'app produit.
        Nettoie, organise, rend les données utilisables.
               |
          ___________|___________
         |            |
         v            v
      DATA ANALYST      DATA SCIENTIST
     Lit ce qui s'est passé. Prédit ce qui va se passer.
     "Les matchs arrivent    "Ces deux profils ont 87%
     surtout le dimanche."   de compatibilité."
     Rapport pour        Améliore l'algorithme
     l'équipe produit.     de suggestion.
         |            |
         |___________|___________|
               |
               v
            DEV WEB / MOBILE
        Affiche les meilleurs profils en premier.
        Intègre les nouvelles fonctionnalités.
               |
               v
              DEVOPS
        Déploie la mise à jour sans coupure.
        Surveille que les serveurs tiennent.
               |
               v
           SECURITY ENGINEER
          Surveille en permanence.
         Bloque les faux profils, protège
        les données personnelles des utilisateurs.
```

#### Résumé

| Rôle | Responsabilité |
|---|---|
| Dev Web / Mobile | Construit ce que l'utilisateur voit et utilise |
| Data Engineer | Collecte et prépare les données |
| Data Analyst | Explique ce qui s'est passé |
| Data Scientist | Prédit ce qui va se passer |
| DevOps | Déploie et maintient l'app en ligne |
| Security Engineer | Protège l'app et ses utilisateurs |

---

### Les rôles d'évolution de carrière

> *"Dans 10 ans, je suis encore en train d'écrire des boucles for dans mon coin ?"*

```
ANNÉE 1-3    ANNÉE 3-6    ANNÉE 6-10    ANNÉE 10+
:::::::::    :::::::::    ::::::::::::   ::::::::::::
Junior Dev -> Mid-Level Dev -> Senior Dev  -> Principal / Staff
                   |
                Tech Lead
                (leadership technique)
                   |
             ____________|______________
            |              |
         Software Architect     Engineering Manager
         (décisions techniques)   (gestion d'équipe)
            |              |
            |___________________________|
                   |
                  CTO
               (directeur technique)
                  ou
              Freelance / Entrepreneur
```

---

#### WORKFLOW avec un exemple : "Meme Mashup Generator"

> *Tu uploads des images ou du texte -> l'app combine tout aléatoirement -> MEME WTF généré.*

---

#### Vue d'ensemble

```
             [ SHINOBI ]
                |
          drag & drop image + texte
                |
                v
            [ Next.js Frontend ]
                |
             POST /api/upload
                |
                v
             [ API Route ]
                |
          _____________|______________
         |              |
         v              v
    [ Supabase Storage ]    [ Meme Engine (Node.js) ]
    (stocke l'image uploadée)        |
               _________________|_________________
               |                  |
               v                  v
           [ Supabase DB ]          [ Sharp (lib) ]
           (pioche une phrase        (colle texte +
           WTF aléatoire)          filtre sur image)
               |                  |
               |_________________|_________________|
                        |
                        v
                  [ Meme PNG généré ]
                        |
                 [ Supabase Storage ]
                 (sauvegarde le meme final)
                        |
                     URL publique
                        |
                        v
               [ Frontend -- affiche le meme ]
                        |
                 _____________|_____________
                 |              |
              [ Télécharger ]       [ Partager ]
```

---

#### La stack : exemple d'outils

```
OUTIL       RÔLE DANS LE PROJET           ALTERNATIVE SI CA SCALE
::::::::::::::::  ::::::::::::::::::::::::::::::::::::::: :::::::::::::::::::::::
Next.js      Le site + les routes API, tout en un  Séparer front (React) /
                              back (Express)

Supabase Storage  Stocker les images uploadées et     S3 (Amazon) si tu dépasses
          les memes générés            1GB/mois

Supabase DB    Sauvegarder les phrases WTF,      PlanetScale, Railway, Neon
          l'historique des memes générés

Sharp       Coller le texte sur l'image côté    Canvas API (si tu fais ça
          serveur (rapide, léger)         dans le navigateur)

Vercel       Héberger le projet, déploiement     Railway, Render, VPS perso
          automatique depuis GitHub
```

---

#### Le MEME Engine en détail

```
              [ INPUT ]
                |
          _____________|_____________
         |              |
      Image uploadée       Texte de l'utilisateur
      (photo de chat)      ("moi un lundi")
         |              |
         |____________|______________|
                |
                v
            [ Randomisation ]
                |
         _____________|_____________
         |       |       |
         v       v       v
     flip horizontal filtre random phrase random
     (40% de chance) neon/glitch  depuis Supabase DB
             /flou/sépia  (si texte vide)
         |       |       |
         |_____________|_____________|
                |
                v
          [ Sharp : composition ]
                |
         _____________|_____________
         |       |       |
         v       v       v
     redimensionne  écrit le texte applique
     en 800x600    en blanc +   le filtre
             contour noir  choisi
         |       |       |
         |_____________|_____________|
                |
                v
          [ OUTPUT : meme.png ]
                |
          affichage en < 2 sec
```

---

### Qui fait quoi dans la vraie vie ?

#### Junior Dev *(0-2 ans)*

Il code les pièces simples. Il apprend.

```
CE QU'IL FAIT SUR CE PROJET
-------------------------------------------------------------
- Intègre le composant drag & drop (React Dropzone)
- Appelle l'API /api/generate et affiche le meme retourné
- Connecte le bouton "Télécharger" au lien Supabase Storage

CE QU'ON NE LUI DEMANDE PAS ENCORE
-------------------------------------------------------------
- Concevoir le Meme Engine from scratch
- Choisir entre Supabase Storage et S3
- Gérer la sécurité des uploads (validation MIME, taille max)
```

---

#### Mid-Level Dev *(3-5 ans)*

Il comprend le pourquoi, pas juste le comment.

```
JUNIOR                MID-LEVEL
::::::::::::::::::::::::::      ::::::::::::::::::::::::::::::::
"Comment j'envoie l'image      "Pourquoi on envoie l'image côté
 côté serveur ?"           serveur et pas côté client ?
                    -> parce que Sharp ne tourne pas
                     dans le navigateur, et Canvas
                     est trop lent sur mobile"

"Je copie l'exemple Sharp       "Je lis la doc Sharp pour comprendre
 de la doc"              le pipeline et je choisis les
                    bonnes options"

Résout le bug de l'image       Anticipe que les PNG transparents
 qui s'affiche mal           vont poser problème avec le filtre
                    sépia -> il gère ça avant que ça arrive
```

---

#### Senior Dev *(6-8 ans)*

Il dit **non** quand il le faut.

> *"Non, on ne génère pas le meme à chaque clic de l'utilisateur : si 500 personnes cliquent en même temps, le serveur tombe. On met en place une queue de jobs (Bull + Redis) : les memes se génèrent dans l'ordre, l'utilisateur voit un spinner. Voilà pourquoi, voilà comment."*

```
              CE QU'IL APPORTE SUR CE PROJET
             ::::::::::::::::::::::::::::::::::::
               Design du pipeline complet
              (queue ou génération synchrone ?)
                     |
               ____________|____________
              |             |
           Sécurité uploads       Perf Sharp
         validation MIME stricte,   Sharp recrée son instance
         taille max, rate limiting   à chaque requête -> il
                        l'initialise une seule fois
                        au démarrage
              |             |
              |_________________________|
                     |
                  Code reviews
             repère que le junior oublie de gérer
             les erreurs d'upload (que se passe-t-il
             si Supabase est down ?)
```

---

#### Tech Lead *(Senior qui guide l'équipe)*

Il code encore, mais il passe du temps à débloquer les autres.

```
TECHNIQUE               HUMAIN
:::::::::::::::::::::::::::::     ::::::::::::::::::::::::::::::
Choisit Sharp plutôt que Canvas    Explique au junior pourquoi son
 après avoir testé les deux      composant React re-render 10x

Définit la structure des dossiers   Fait le lien avec le PM :
 (features/, lib/, api/)       "non, le filtre animé GIF est
                    possible mais ça triple le temps
Pose les règles de code review     de génération / on le fait en v2"
 (toute PR doit avoir des tests
 sur le Meme Engine)
```

---

#### Software Architect *(Décisions d'ensemble)*

Il ne code pas le MEME Engine. Il décide comment il s'intègre dans le système.

```
          SES QUESTIONS SUR CE PROJET
     ::::::::::::::::::::::::::::::::::::::::::::::::
      Monolithe ou microservice pour la génération ?
                 |
          _____________|______________
          |              |
        Monolithe Next.js      Microservice séparé
        plus simple à déployer   si le Meme Engine tourne
        sur Vercel, parfait     sur un serveur plus puissant
        pour débuter        (génération intensive = CPU élevé)

      Supabase Storage ou S3 pour stocker les memes ?
                 |
          _____________|______________
          |              |
        Supabase             S3
        gratuit jusqu'à 1 GB,      pas de limite, moins cher
        intégration facile,       à grande échelle, mais
        parfait sous 10 000       plus de config
        memes/mois

      Comment éviter que le stockage explose ?
      -> job CRON : les memes non téléchargés depuis 7 jours
       sont supprimés automatiquement
```

> Les microservices : c'est uniquement côté backend/serveur.

---

#### Engineering Manager *(Management, pas code)*

```
CE QU'IL FAIT             CE QU'IL NE FAIT PAS
::::::::::::::::::::::::::::::::    ::::::::::::::::::::::::::::::
S'assure que le junior monte      Choisir entre Sharp et Canvas
 en compétence (1:1 réguliers)
                    Faire du code review
Gère le recrutement si le projet
 grandit               Concevoir le Meme Engine

Protège l'équipe des demandes
 irréalistes ("le meme en 0.1s
 c'est pas possible, voilà pourquoi")
```

---

#### CTO (le boss de la partie tech)

```
STARTUP (projet early-stage)      SI MEME MASHUP DEVIENT VIRAL
:::::::::::::::::::::::::::::     :::::::::::::::::::::::::::::::::
Code encore (il a tout construit)   Code rarement
Choisit la stack initiale       Définit la vision tech à 2 ans
 (Next.js + Supabase + Vercel)     (passer sur S3 ? ouvrir une API
Recrute le premier dev         publique pour les créateurs ?)
Parle aux premiers utilisateurs        Surveille les coûts d'infra
```

---

#### Freelance / Entrepreneur

```
FREELANCE               ENTREPRENEUR (tu construis Meme Mashup)
:::::::::::::::::::::         ::::::::::::::::::::::::::::::::::::::::
Un client te paie pour         Tu construis l'produit, tu vises les
 construire ce type d'app        créateurs de contenu TikTok / Instagram
Tu choisis la stack, tu livres     Tu es dev + PM + support en même temps
Tu factures à l'heure ou au projet   Si ça devient viral -> gros upside
 (tarifs occidentaux depuis      Si ça flop -> t'as quand même appris
  Madagascar, c'est le levier 2026)   Next.js, Supabase et Sharp en vrai
```

---

### Résumé : qui touche à quoi sur ce projet

```
RÔLE        SUR MEME MASHUP GENERATOR
::::::::::::::::  ::::::::::::::::::::::::::::::::::::::::::::::::::
Junior Dev     Composants UI, appels API, bouton télécharger
Mid-Level Dev   Meme Engine, intégration Sharp + Supabase
Senior Dev     Pipeline complet, sécurité uploads, perf, reviews
Tech Lead     Archi des features + mentoring + lien avec le PM
Software Architect Monolithe vs microservice, Supabase vs S3, scalabilité
Eng. Manager    Équipe, recrutement, roadmap, protection des devs
CTO        Stack initiale, vision, si nécessaire premiers commits
Freelance     Livre la feature demandée, seul ou en mission courte
Entrepreneur    Tout. Le produit, les utilisateurs, les coûts, la survie.
```

---

> *"Dans 10 ans, je suis encore en train d'écrire des boucles for dans mon coin ?"*
> Peut-être. Mais si tu sais **pourquoi** tu les écris, **pour qui**, et **quels compromis** tu fais,
> tu n'es plus junior. Tu décides où tu vas.

---

### Les grandes spécialisations : dans quel donjon tu veux aller ?

| Spécialisation | Difficulté | Marché | Salaire | Tendance |
|---|---|---|---|---|
| Web | Moyenne | Mondial | Bon | Stable |
| Mobile | Moyenne | Mondial | Bon | Hausse |
| Cloud / DevOps | Élevée | Mondial | Très bon | Forte hausse |
| IA / ML | Très élevée | Mondial | Excellent | Explosion |
| Data Engineering | Élevée | Mondial | Très bon | Forte hausse |
| Cybersécurité | Très élevée | Mondial | Excellent | Explosion |
| Jeux vidéo | Élevée | Concentré | Correct | Stable |
| Blockchain | Élevée | Volatile | Bon | Instable |
| Systèmes / Kernel | Très élevée | Niche | Excellent | Stable (rare) |

---

#### Web

Le domaine le plus accessible, le plus vaste, et le plus employant. Des milliers de frameworks. Des millions d'offres dans le monde.

Technologies : HTML, CSS, JS/TS, React, Next.js, Vue, Node.js, PostgreSQL. Ce qui différencie les tops : performance, accessibilité, architecture front, SEO technique. Sous-spécialisations : e-commerce, SaaS, apps temps réel (websockets), PWA (Progressive Web App : une app web qui se comporte comme une app mobile native, sans passer par l'App Store).

---

#### Mobile

La majorité des gens utilisent leur téléphone plus que leur PC. C'est un marché énorme.

Technologies : Flutter/Dart, React Native/JS, Swift, Kotlin. Ce qui différencie les tops : performances natives, animations fluides (60fps), gestion de la batterie, offline-first. En 2026, Flutter continue sa progression : les apps cross-platform sont de plus en plus indiscernables des apps natives.

---

#### Cloud / DevOps

L'infrastructure est devenue un produit software. Plus personne n'achète des serveurs physiques.

Technologies : AWS/GCP/Azure, Kubernetes, Terraform, Docker, CI/CD. Ce qui différencie les tops : comprendre les coûts cloud (ça peut ruiner une startup), la résilience, la sécurité infra. Certifications qui valent quelque chose : AWS Solutions Architect, GCP Professional, CKA (Certified Kubernetes Administrator).

---

#### IA / Machine Learning

Le champ le plus en feu de 2026. La demande dépasse massivement l'offre de profils qualifiés.

Technologies : Python, PyTorch, TensorFlow, Hugging Face, LangChain. Ce qui différencie les tops : maths (algèbre linéaire, stats, calcul), compréhension théorique des architectures. Les vrais postes ML demandent souvent un Master ou un PhD. Mais les postes "AI Engineer" (qui utilisent des APIs et déploient des modèles existants) sont accessibles sans.

---

#### Cybersécurité

Le marché manque cruellement de profils. Toutes les entreprises ont besoin de sécurité. Peu de gens savent vraiment faire.

Technologies : Kali Linux, Metasploit, Burp Suite, Wireshark, Python, Bash. Ce qui différencie les tops : curiosité maniaque, connaître le système en profondeur (réseau, OS, code bas niveau), éthique. Certifications : CEH, OSCP (difficile mais très valorisée), CISSP, CompTIA Security+.

---

#### Jeux Vidéo

L'industrie qui fait rêver. Mais attention aux réalités.

Technologies : Unity + C#, Unreal Engine + C++, Godot + GDScript/C#. Ce qui différencie les tops : maths 3D (matrices, quaternions, vecteurs), optimisation (chaque milliseconde compte), shaders, physics. Salaires souvent plus bas que dans le web/cloud. Passion obligatoire. Crunch culture dans certains studios. Le jeu indépendant explose : un dev solo avec Unity peut sortir un jeu sur Steam.

---

#### Blockchain

Technologies : Solidity (Ethereum), Rust (Solana), Go. Le marché suit les cycles crypto. En 2021 c'était l'El Dorado. En 2023 ça s'est effondré. En 2024-2026 ça remonte. Risqué comme pari de carrière à long terme.

---

### Comment choisir sa spécialisation intelligemment ?

> *"Si tu entres dans un donjon au hasard, t'as peut-être choisi celui qui donne sur une décharge. Voilà comment choisir le bon couloir."*

```
ÉTAPE 1 : COUPE CE QUI TE DÉPLAÎT VRAIMENT
 Tu détestes les maths poussés ?       -> élimine IA/ML et Systèmes
 Tu veux voir des résultats visuels vite ?  -> garde Web et Mobile
 Tu adores comprendre "comment ça marche" ?  -> Cloud, Sécurité, Systèmes

ÉTAPE 2 : CROISE AVEC LE MARCHÉ LOCAL + REMOTE
 Offres d'emploi dans ta ville ?  -> regarde LinkedIn, Indeed, Upwork
 Travail remote ?         -> Web, Cloud, IA, Mobile = les plus remote-friendly
 Freelance ?            -> Web et Mobile = les plus faciles à vendre

ÉTAPE 3 : ÉVALUE LA DURÉE D'APPRENTISSAGE
 Employable en 6-12 mois ?  -> Web, Mobile
 Employable en 1-2 ans ?   -> Backend fort, DevOps, Data
 Employable en 2-4 ans ?   -> IA/ML, Cybersécurité, Systèmes

ÉTAPE 4 : TESTE AVANT DE T'ENGAGER
 Fais un mini-projet de 2-4 semaines dans chaque spécialisation qui t'attire.
 Laquelle te donnait envie de continuer le soir, même sans obligation ?
 Celle-là, c'est la tienne.
```

---

### Ce qui différencie un dev moyen d'un excellent dev

> *"La plupart des devs savent coder. Les bons devs savent résoudre des problèmes. Les excellents devs savent résoudre les bons problèmes."*

**1. Algorithmique et structures de données**

```
- Savoir utiliser une liste c'est bien. Savoir POURQUOI tu choisis une HashMap
 plutôt qu'une liste dans CE cas précis, c'est autre chose.
- Complexité O(n), O(log n), O(1) : ça devient très concret quand t'as 10 millions
 d'enregistrements et que la requête prend 12 secondes.
```

**2. Clean Code**

```javascript
// Dev moyen : ça marche, personne sait pourquoi, personne ose y toucher
function f(x, y, z) {
 if (z === 1) return x * 1.1
 if (z === 2) return x * 1.2
 return x + y
}

// Dev excellent : ça se lit comme une phrase
const TAX_RATES = {
 reduced: 1.10,
 standard: 1.20,
}

function calculateTotalPrice(basePrice, shippingCost, taxType) {
 // si le type de taxe existe, on l'applique. sinon, on ajoute juste les frais de port.
 const rate = TAX_RATES[taxType]
 return rate ? basePrice * rate : basePrice + shippingCost
}

// Six mois plus tard, un nouveau dev lit ça et comprend en 10 secondes.
// Avec la version f(x, y, z), il allait pleurer.
```

**3. Design Patterns**

Les patterns sont des solutions documentées à des problèmes récurrents. Savoir quand les appliquer et surtout quand les éviter : te fait passer un cap.

```javascript
// Exemple du pattern Observer : le même principe que les EventListeners
// ou que le state management dans React
class EventBus {
 constructor() {
  this.listeners = {}
 }

 on(event, callback) {
  if (!this.listeners[event]) this.listeners[event] = []
  this.listeners[event].push(callback)
 }

 emit(event, data) {
  (this.listeners[event] || []).forEach(cb => cb(data))
 }
}

const bus = new EventBus()

bus.on('pizza:titane', ({ saveur }) => {
 console.log(`Le four se prépare pour une pizza ${saveur}`)
})

bus.on('pizza:titane', ({ client }) => {
 console.log(`SMS envoyé à ${client} : votre pizza est en préparation`)
})

bus.emit('pizza:titane', { saveur: 'Regina', client: 'Bob' })
// -> Le four se prépare pour une pizza Regina
// -> SMS envoyé à Bob : votre pizza est en préparation

// Chaque partie du système réagit sans se connaître. C'est ça le pattern Observer.
```

Les patterns les plus utiles en pratique :

```
Singleton  : une seule instance dans toute l'app (ex: connexion DB)
       "comme le wifi de la maison : y'en a un, tout le monde partage"

Observer  : notifier des objets quand un état change (ex: React re-render)
       "comme un groupe WhatsApp : quelqu'un envoie, tout le monde reçoit"

Factory   : créer des objets sans spécifier leur classe exacte
       "comme un distributeur automatique : t'appuies sur B3, tu sais pas qui l'a fabriqué"

Repository : couche d'abstraction entre logique métier et base de données
       "comme googler quelque chose : t'sais pas où est l'info, tu demandes juste"

Strategy  : changer un algorithme à l'exécution sans modifier le code appelant
       "comme choisir entre Uber et le bus : toi t'as juste dit 'amène-moi là-bas'"

Adapter   : brancher une interface incompatible sur une autre
       "comme un adaptateur jack 3.5 -> USB-C : les deux veulent juste jouer de la musique"
```

#### Anti-patterns classiques

| Anti-pattern | C'est quoi | Conséquence |
|---|---|---|
| **Requêtes séquentielles indépendantes** | Tu lances deux requêtes l'une après l'autre alors qu'elles ont aucun lien | 200ms au lieu de 100ms. Multiplie par 10M req/jour et pleure |
| **God Object** | Une classe / un fichier qui fait absolument tout | 3000 lignes, personne n'ose toucher, le fichier a sa propre légende urbaine |
| **Hardcoding** | Des valeurs magiques collées directement dans le code au lieu de variables ou configs | Le client veut changer une valeur. Tu cherches dans 47 fichiers. Tu souffres |
| **Callback Hell** | Des fonctions imbriquées les unes dans les autres à l'infini | Code illisible, debugging cauchemardesque, tes collègues te détestent |
| **Avaler les erreurs** | `catch (e) {}` : l'erreur est capturée et immédiatement ignorée | Le bug existe. T'en sais rien. L'utilisateur, lui, il sait. Depuis 3 semaines |
| **Optimisation prématurée** | T'optimises pour des problèmes que t'as pas encore | 3 semaines de boulot pour 12 utilisateurs. Le vrai goulot d'étranglement était ailleurs |
| **Copier-coller au lieu d'abstraire** | Le même bloc de 30 lignes existe en 6 endroits dans le codebase | Tu corriges le bug dans 3 endroits. Les 3 autres attendent leur tour patiemment |
| **Tout mettre dans le front** | Logique métier, validation, calcul de prix : tout dans le client JS | N'importe qui ouvre DevTools, modifie les variables, achète à 0€ |
| **Ne jamais committer** | "Je commit quand c'est fini" : spoiler : c'est jamais fini | Le laptop meurt. 3 semaines de travail partent à la poubelle |
| **Dépendances circulaires** | Le module A importe B, B importe A, personne sait qui démarre en premier | Erreurs cryptiques au runtime, build qui plante sans raison claire |

> **Requêtes séquentielles** : faire un `await fetchUser()` puis `await fetchOrders()` alors que les deux peuvent partir en même temps avec `Promise.all` : comme aller chercher ta pizza ET ta boisson en deux voyages alors que t'as deux mains.

> **God Object** : `UserManager.js` qui gère l'auth, les emails, les tributs, les rapports et accessoirement ton karma : comme un employé qui est à la fois caissier, cuisinier, livreur et comptable. Il est partout. Il est nulle part. Il démissionne.

> **Hardcoding** : `if (currency === "EUR")` écrit en dur partout. Le client veut ajouter le dollar, bonne chance : comme tatouer ton numéro de téléphone sur ton front. Tu déménages. Problème.

> **Callback Hell** : `getData(fn(a) { getMore(a, fn(b) { save(b, fn(c) { ... }) }) })` : des poupées russes, mais chaque poupée contient une tâche urgente et une mauvaise surprise.

> **Avaler les erreurs** : un try/catch vide sur un appel API critique. L'appel plante, l'app continue comme si de rien n'était, les données sont corrompues : comme recevoir une lettre d'huissier, la mettre à la poubelle sans lire, et s'étonner que la police débarque.

> **Tout mettre dans le front** : calculer le prix final côté React et envoyer juste le total au serveur sans vérification : comme confier à l'acheteur le soin d'écrire lui-même le prix sur le ticket de caisse.

---

**4. Compréhension des systèmes**

Un excellent dev comprend ce qui se passe au-delà de son code : comment fonctionne le réseau (TCP/IP, HTTP, DNS : ex : une requête fetch passe par DNS pour résoudre le domaine, TCP pour établir la connexion, HTTP pour transporter les données), la mémoire (stack vs heap, garbage collector), le système de fichiers, un OS (processus, threads, signaux), une base de données en dessous (B-trees, ACID : ex : un index sur user_id utilise un B-tree pour trouver la ligne en O(log n) au lieu de scanner toute la table).

> **Livre de référence :** *Designing Data-Intensive Applications* de Martin Kleppmann. Si t'en lis un seul dans ta carrière, c'est celui-là.

**5. Architecture logicielle : "l'art de prendre des décisions structurelles aujourd'hui pour ne pas les regretter demain"**

```javascript
// Les trois questions d'un dev qui pense architecture

// 1. "Comment ce code va évoluer dans 6 mois ?"
// Si la réponse c'est "on va devoir tout réécrire", c'est un signal.
// (ex: t'as hardcodé la langue en "fr" partout et le client veut l'anglais : bonne chance!)

// 2. "Si cette partie tombe en panne, qu'est-ce qui casse autour ?"
// Un système bien architecturé a des points de défaillance isolés.
// Un système mal architecturé : tout tombe en même temps.
// (ex: le service de notif email plante et somehow le tribut marche plus : classique)

// 3. "Comment un nouveau dev comprend ce système en 30 minutes ?"
// Si t'es le seul à pouvoir expliquer comment ça marche,
// c'est pas de la valeur. C'est un risque.
// (ex: t'es en vacances, ton tel sonne, c'est le CTO : t'aurais dû écrire de la doc)
```

---

### La carrière réaliste sur 10-15 ans

```
ANNÉES 1-2 : LE DÉBROUSSAILLAGE
 Tu apprends vite mais tu casses aussi vite.
 Chaque semaine tu découvres que tu ne sais pas quelque chose.
 C'est normal. C'est comme ça pour tout le monde.
 Objectif : livrer de la valeur, apprendre les bases du travail en équipe.
 Erreur classique : vouloir tout apprendre en même temps -> épuisement.

ANNÉES 3-5 : L'AUTONOMIE
 Tu livres sans supervision constante.
 Tu commences à avoir des opinions sur les choix techniques.
 Tu peux concevoir une feature de A à Z.
 Objectif : développer ta spécialité et ta réputation.
 Erreur classique : rester en zone de confort, éviter les projets complexes.

ANNÉES 5-8 : L'IMPACT
 Ton code affecte des équipes entières.
 Tu mentores des juniors (naturellement, pas encore par obligation).
 Tu vois les patterns des projets qui réussissent ou échouent.
 Objectif : choisir entre technique pure (architect/principal) ou leadership.
 Erreur classique : prendre un rôle manager parce que "c'est la promotion normale"
 sans vraiment vouloir gérer des gens.

ANNÉES 8-15 : LA FORCE TRANQUILLE
 Tu n'as plus à prouver que tu sais coder.
 Tu résous des problèmes organisationnels autant que techniques.
 Tu as un réseau solide dans l'industrie.
 Objectif : impact à grande échelle, ou indépendance (freelance/startup).
 Erreur classique : se reposer sur ses lauriers, arrêter d'apprendre.
```

---

### Le tableau de synthèse final

| Métier | Difficulté d'accès | Salaire global | Remote | Stabilité |
|---|---|---|---|---|
| Frontend Dev | Moyenne | Bon | Très fort | Solide |
| Backend Dev | Moyenne | Bon | Très fort | Solide |
| Full-Stack Dev | Moyenne | Bon | Très fort | Solide |
| Mobile Dev | Moyenne | Bon | Fort | Solide |
| DevOps / SRE | Élevée | Très bon | Très fort | Excellent |
| Data Engineer | Élevée | Très bon | Très fort | Excellent |
| ML / AI Engineer | Très élevée | Excellent | Très fort | Excellent |
| Security Engineer | Très élevée | Excellent | Fort | Excellent |
| Game Dev | Élevée | Correct | Faible | Moyen |
| Software Architect | Très élevée | Excellent | Fort | Excellent |

*Estimations basées sur les tendances du marché global 2026. Les salaires varient énormément selon le pays, l'entreprise et l'expérience.*

---

> Il n'y a pas de "bon" métier dans le développement. Il y a des métiers qui correspondent à ce que tu es. Si t'aimes voir les choses apparaître à l'écran : frontend. Si t'aimes comprendre comment les systèmes fonctionnent : backend ou DevOps. Si t'aimes les maths et l'optimisation : IA/ML. Si t'aimes l'adversaire et le défi : sécurité. Le reste, c'est une question de chemin et de temps.
>
> *"Le meilleur métier dev c'est celui dans lequel tu n'as pas l'impression de travailler... jusqu'au vendredi soir où t'es encore là à déboguer à 23h parce que tu peux pas t'arrêter."*

---

## 9. Ce que ça vaut vraiment : salaires et le levier remote

> *"Ok, je sais ce que je veux faire. Maintenant la question que tout le monde pense mais que personne n'ose poser en cours : ça paie combien ?"*

Réponse honnête : ça dépend de trois choses : le métier, le niveau, et surtout **à qui tu vends tes compétences**. C'est ce dernier point qui fait toute la différence.

---

### Salaires des développeurs dans le monde (2026)

```
PAYS         NIVEAU   SALAIRE ANNUEL ($)
::::::::::::     :::::::  ::::::::::::::::::
États-Unis      Junior   70 000 : 90 000 $
           Senior  170 000 : 225 000 $

Europe (FR / DE)   Junior   50 000 : 75 000 $
           Senior   75 000 : 100 000 $

Royaume-Uni     Senior   90 000 : 100 000 $

Inde         Junior   10 000 : 15 000 $
           Senior   20 000 : 55 000 $

Afrique du Sud    Junior   18 000 : 26 000 $
           Senior   40 000 : 60 000 $

Madagascar      Junior   ~5 400 $ / an (marché local)
(exemple local)   Senior   ~22 000 $ / an (marché local)
           Réalité  souvent 1 300 : 4 000 $ / an sur le terrain
```

> Ces chiffres reflètent le marché **local** de chaque pays. La colonne "remote" ci-dessous est une autre histoire.

---

### Madagascar : la réalité brute

Pris comme exemple concret d'un marché local en pays émergent : parce que le contraste avec le remote est particulièrement parlant.

```
MARCHÉ LOCAL
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Junior "officiel"  : ~5 400 $ / an
Senior reconnu   : ~22 000 $ / an
Réalité terrain   : souvent bien moins pour beaucoup
```

Le même profil, le même ordinateur, les mêmes compétences : mais des revenus sans commune mesure selon le marché visé.

---

### Le vrai levier : le remote

C'est la ligne qui change tout. Un dev qui travaille pour des clients étrangers depuis son pays ne joue plus dans la même catégorie salariale.

```
SALAIRES REMOTE (depuis n'importe quel pays à coût de vie bas)
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Junior remote  :  20 000 : 35 000 $ / an
Mid remote   :  40 000 : 65 000 $ / an
Senior remote  :  70 000 : 100 000 $ / an
```

```
COMPARAISON ILLUSTRÉE (exemple Madagascar, applicable partout)
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Dev local junior    :  5 400 $ / an
Dev remote junior   :  20 000 $ / an  -> ratio x3,7

Dev local senior    :  22 000 $ / an
Dev remote senior   :  80 000 $ / an  -> ratio x3,6

Dev remote mid     :  40 000 $ / an
vs dev local senior  :  22 000 $ / an  -> ratio x1,8
              (avec moins d'expérience requise)
```

La question n'est donc pas "quel métier choisir". La question est "comment accéder au marché remote ?"

---

### Les stacks qui paient le plus en remote (2026)

```
STACK / SPÉCIALISATION          SALAIRE REMOTE MOYEN (global)
::::::::::::::::::::::::::        :::::::::::::::::::::::::::::
AI / ML Engineer             126 000 : 190 000 $ / an
 Python + PyTorch/TF + MLOps

Cloud / DevOps              121 000 : 180 000 $ / an
 AWS/GCP + Kubernetes + Terraform

Security Engineer             90 000 : 170 000 $ / an
 réseaux + pentest + SIEM

Full-Stack senior             90 000 : 165 000 $ / an
 React/TS + Node.js

Backend fort               85 000 : 160 000 $ / an
 Go / Rust / Java + systèmes distribués

Mobile senior               70 000 : 130 000 $ / an
 Flutter / React Native

Frontend senior              71 000 : 120 000 $ / an
 React/Next.js + TypeScript + perf
```

> Les certifications cloud (AWS, GCP, Azure) ajoutent en moyenne **20 000 : 40 000 $** au salaire. C'est documenté sur l'ensemble du marché remote 2025-2026 : pas une légende.

---

### Les 10 pays qui recrutent le plus de devs remote

```
RANG  PAYS       RÉGION      POURQUOI ILS RECRUTENT
::::  ::::       ::::::      ::::::::::::::::::::::::::::::::::::
 1   États-Unis    Amérique du Nord Volume massif de startups et scale-ups.
                     Manque chronique de devs locaux.
                     Le remote est le standard depuis 2020.

 2   Allemagne     Europe      Berlin = hub tech européen.
                     Forte demande en backend, data, IA.

 3   Royaume-Uni    Europe      Fintech, SaaS, medtech.
                     Remote bien établi post-pandemic.

 4   Canada      Amérique du Nord Hubs Toronto et Vancouver.
                     Timezone proche des US. Très remote-friendly.

 5   Australie     APAC       Fintech + e-commerce en hausse.
                     Manque de devs locaux qualifiés.

 6   Pays-Bas     Europe      Amsterdam = hub IA et SaaS.
                     Très ouverts aux devs internationaux.

 7   France      Europe      Startups (Doctolib, Leboncoin, Datadog).
                     Remote en forte hausse depuis 2022.

 8   Singapour     APAC       Fintech + gouvernance tech.
                     Passerelle Asie du Sud-Est.

 9   Suède / Danemark Europe du Nord  Salaires élevés. Remote bien intégré.
                     Focus fort sur qualité du code.

10   Israël      Moyen-Orient   Tech très dense. Startups en cybersec, IA.
                     Recrutent sur le marché global.
```

> Les plateformes pour commencer : **Upwork**, **Toptal**, **Malt** (France/Europe), **LinkedIn**, **Remote.com**, **Arc.dev**. La langue qui ouvre le plus de portes : l'anglais. La deuxième : le français pour l'Europe.

---

### La conclusion salaires

```
+----------------------------------------------+
|                       |
|       MÊMES COMPÉTENCES        |
|                       |
|  marché local    vs    remote     |
|                       |
|  salaire de base      x3 à x10    |
|                       |
|  (le même dev, le même ordi, le même code) |
|                       |
+----------------------------------------------+
```

La différence entre ces deux colonnes tient à une seule chose : l'accès au marché. Et ça se construit. Un portfolio sur GitHub. Un profil LinkedIn en anglais. Une ou deux missions sur Upwork. Une réputation. Ça prend du temps : mais c'est linéaire, pas magique.

```javascript
// La carrière remote, vue comme un algorithme
function construireCarriereRemote(dev) {
 const etapes = [
  "portfolio GitHub avec 3 projets propres et documentés",
  "profil LinkedIn en anglais avec les bons mots-clés",
  "première mission Upwork (peu importe le tarif, c'est pour les reviews)",
  "deuxième mission avec un vrai tarif",
  "réputation construite -> les clients viennent vers toi",
 ]

 for (const etape of etapes) {
  dev.faire(etape) // pas de raccourci, pas de magie
 }

 return dev.salaire * 3 // minimum
}
// La seule variable : à qui tu factures.
```

> *"Un dev peut gagner 5 000 $ / an. Le même dev, avec les mêmes compétences, peut gagner 80 000 $ / an. La seule variable, c'est à qui il facture."*
>
> *Les salaires sont indicatifs et varient selon le pays, l'entreprise et l'expérience.*

---

## 10. BONUS : L'IA, le vrai métier, et les erreurs qui tuent les carrières

### L'IA en 2026 : Ce qui se passe vraiment

#### Le contexte en chiffres bruts

```
 Netflix  -> 3,5 ans pour atteindre 1 million d'utilisateurs
 Instagram -> 2,5 mois
 TikTok   -> 9 mois
 ChatGPT  -> 72 heures

 Aucun produit dans l'histoire n'a grandi aussi vite.
 Et les devs sont en première ligne.
```

#### Sous le capot : c'est quoi vraiment

```
CE QUE LES GENS CROIENT       CE QUE C'EST VRAIMENT
::::::::::::::::::::::::       :::::::::::::::::::::::::::::::::::::
"Une IA qui pense"      -->  Un modèle statistique ultra-massif
"Ça remplace les humains"   -->  Un très bon outil qui se trompe encore
"C'est magique"        -->  Des matrices, du calcul, des GPUs qui surchauffent
"Ça invente des trucs"    -->  Ça recombine ce qu'il a absorbé à l'entraînement
"Ça comprend le contexte"   -->  Ça prédit le token suivant. Encore. Encore. Encore.
```

Un LLM prédit le mot suivant. Encore et encore. C'est le principe. C'est "juste ça" qui cache une ingénierie monstrueuse : mais c'est le principe.

Exemple concret :

```
"La capitale de la France est..."

Le modèle a vu des milliards de textes où cette phrase se terminait par "Paris".
Donc statistiquement, "Paris" est le choix le plus probable : pas parce qu'il
"sait" que Paris est la capitale, mais parce qu'il a appris que ces mots se
suivent très souvent. Il ne raisonne pas, il complète des patterns.
```

#### Les grandes familles d'IA

```
TEXTE / CODE       IMAGES / VIDÉO       ACTION
::::::::::::       ::::::::::::::       :::::::::::
LLM            Diffusion Models      Agents IA
 |             |              |
 +-> génère du texte    +-> image depuis texte   +-> le LLM peut agir
 +-> répond, explique   +-> Midjourney, DALL-E   +-> cherche sur le web
 +-> code, refactor    +-> Stable Diffusion    +-> lance du code
 +-> GPT-4o, Claude,    +-> Sora (vidéo)      +-> appelle des APIs
   Gemini, Llama 3    +-> PyTorch en coulisses  +-> frontière 2025-2026
```

Les **modèles de code** (Copilot, Cursor) sont des LLMs spécialisés. Ils vivent dans ton IDE. Pendant que tu lis ça, ils attendent.

---

### Ce que l'IA change pour un dev

```
AVANT (2019)               APRÈS (2026)
::::::::::::               ::::::::::::
Tu googles l'erreur         -->  Tu colles l'erreur dans le chat
Tu lis Stack Overflow        -->  Tu as une explication sur mesure
Tu écris le boilerplate à la main  -->  Tu génères la structure en 10s
Tu cherches la syntaxe exacte    -->  "comment faire X en Rust ?"
Tu documentes à la fin (jamais)   -->  Tu génères la doc depuis le code
Tu bloques 2h sur un bug bête    -->  Tu identifies la cause en 5 min
Tu réinventes la roue        -->  Tu pars d'une base solide générée
```

#### Ce que l'IA peut PAS faire à ta place

```javascript
// L'IA génère ça en 3 secondes
async function fetchUserOrders(userId) {
 const user  = await db.users.findById(userId)
 const orders = await db.orders.findByUserId(userId)
 return { user, orders }
}

// L'IA peut PAS savoir :
//  -> si ça tient à 10M de requêtes
//  -> si ta DB est déjà sous charge
//  -> que deux requêtes séquentielles ici = bombe à retardement
//  -> ce que ton client veut vraiment dire par "rapide"
//  -> si t'as besoin d'un cache, d'un index, ou d'un refacto complet
//  -> ce que le reste de ton codebase fait en parallèle

// Un bon dev utilise l'IA pour la vitesse et garde son cerveau pour les décisions
```

---

### Tips IA 2026

#### Tip 1 : contexte = qualité

```
Tu donnes peu de contexte  ->  output générique inutilisable
Tu donnes du contexte précis ->  output quasi-production-ready

MAUVAIS : "Fais-moi un hook React"

BON :   "Crée un hook React TypeScript useDebounce(value, delay) qui retarde
      la mise à jour d'une valeur. Usage : formulaire de recherche avec
      appel API. Pas de lib externe. Nettoie le timeout au unmount."
```

#### Tip 2 : le format magique pour tout prompt technique

```
[CONTEXTE]  qui tu es, quel projet, quelle techno, ton niveau
[OBJECTIF]  ce que tu veux exactement, pas "aide-moi"
[CONTRAINTE] ce que tu veux PAS (pas de lib X, pas de classe, max N lignes)
[EXEMPLE]   montre le format attendu en sortie si tu peux

Applique ça : ton taux de prompts utiles passe de 40% à 85%.
```

#### Tip 3 : parle-lui comme à un dev senior

```
Au lieu de : "Comment je fais pour que mon app soit rapide ?"

Dis :    "Mon API Node.js/Express répond en 800ms en moyenne sur un endpoint
       qui lit 3 tables PostgreSQL. Les tables sont indexées sur les FKs.
       Où je regarde en premier pour optimiser ?"

L'IA te sort un diagnostic ciblé au lieu d'un cours magistral de 40 pages.
```

#### Tip 4 : utilise-la pour apprendre, pas juste copier

```javascript
// MAUVAIS : tu colles le code. Ça marche. Tu passes à autre chose.

// BON : tu colles le code, puis tu demandes
// "Explique-moi chaque ligne de ce que tu viens de générer.
// Dis-moi ce qui pourrait mal tourner en prod."

// Dans 6 mois : le premier dev copie encore.
// Le second comprend pourquoi son code marche.
```

#### Tip 5 : l'IA comme rubber duck dopée

```
Problème bloquant depuis 1h ?
Écris à l'IA :
 "Je vais t'expliquer mon problème. Ne réponds pas encore.
  Juste écoute et dis-moi si tu vois quelque chose d'étrange."

Souvent, en formulant le problème pour l'expliquer,
tu trouves toi-même la réponse avant qu'elle réponde.
C'est le rubber duck debugging version IA. Ça marche vraiment.
```

#### Tip 6 : l'hallucination : le bug invisible

```javascript
// Tu demandes : "Comment utiliser .flatDeep() en JavaScript ?"
// L'IA répond avec une confiance absolue :
const result = [1, [2, [3]]].flatDeep(2) // -> [1, 2, 3]
// "flatDeep() prend un paramètre de profondeur..."

// PROBLÈME : flatDeep() n'existe pas.
// La vraie méthode : .flat(depth)
// L'IA a inventé un nom plausible. Elle n'en sait rien.
// Elle dit ce qui est statistiquement probable. Pas ce qui est vrai.

// RÈGLE : toujours vérifier dans la doc officielle.
// Surtout pour les méthodes de libs, les APIs, les versions récentes.
```

```
L'IA génère          TOI
  |              |
  |  "voilà la solution"  |
  |-------------------------->|
                |
             vérifie dans la doc
             teste dans la console
             comprends avant d'intégrer
                |
             merge seulement après
```

Mindset : stagiaire ultra-rapide qui a tout lu sur internet mais qui invente des réponses pour pas avoir l'air de pas savoir. Ton boulot : valider. Toujours.

---

### L'IA et le marché : Sans bullshit

```
LA PEUR               LA RÉALITÉ 2026
:::::::               :::::::::::::::
"L'IA va prendre mon job" --> La demande de devs a augmenté.
                Les devs qui utilisent l'IA livrent 2-3x plus vite.
                Ce sont eux qu'on recrute. Pas les autres.

"Plus besoin d'apprendre" --> L'IA génère du code.
                Quelqu'un doit le comprendre, valider, déployer,
                déboguer quand ça plante à 3h du matin.
                Ce quelqu'un : c'est toi.

"Le no-code remplace tout" --> Le no-code a élargi le marché.
                Plus de gens font des apps simples.
                Les devs gèrent la complexité que le no-code
                ne peut pas toucher.
```

```
dev sans IA  ----------->  x1 en productivité
dev avec IA  ----------->  x3 en productivité (mêmes compétences de base)

ignorer l'IA en 2026 = refuser la calculatrice en 1985
L'outil a changé. Le métier de fond, non.
```

---

### Le vrai métier de dev : Pas le film, la réalité

#### Ce qu'on t'a vendu vs ce que c'est vraiment

```
LE FILM                LA RÉALITÉ
:::::::                :::::::::::::::::::::::::::::::::
Du code propre toute la journée --> 60% de réunions, emails, PR reviews
Des projets passionnants     --> Surtout du legacy et des bugs incompréhensibles
Des choix technos excitants   --> "On reste sur jQuery, le client veut pas changer"
Résoudre des puzzles élégants  --> Déboguer un truc qui marchait la semaine dernière
Travailler seul dans ton coin  --> Communication constante avec des non-devs
```

Et pourtant : c'est l'un des meilleurs métiers du monde en 2026. Pas malgré ça. Avec ça.

---

#### Les vrais piliers du métier

```
             LE MÉTIER DE DEV
                 |
     _____________________|_____________________
     |       |       |       |
   TECHNIQUE    COMM     JUGEMENT   APPRENTISSAGE
     |       |       |       |
  Coder proprement Écrire    Choisir entre  Apprendre en
  Déboguer     des PR    10 solutions  continu sans
  Architecturer   claires.   correctes.   se noyer.
  Tester      Expliquer  Dire non    Filtrer le bruit
  Déployer     à des    quand faut
           non-devs   le dire
```

La plupart des devs pensent que le métier c'est la colonne "TECHNIQUE". Les bons savent que les quatre colonnes comptent autant. (Le mec qui code comme un dieu mais qui répond jamais aux mails, arrive en retard à toutes les réunions, et refuse d'expliquer ses choix : il se fait virer avant le stagiaire sympa qui code en jQuery.)

---

#### Les types de journées selon la séniorité

```
JUNIOR           MID-LEVEL        SENIOR
::::::           :::::::::        ::::::
"Comment je fais ça ?"   "Voilà comment faire"  "Devrait-on faire ça ?"

Suit les specs       Améliore les specs.    Questionne les specs.

Résout son ticket     Voit l'impact des     Anticipe les problèmes
              tickets sur le reste.   avant qu'ils arrivent.

Cherche de l'aide     Aide les autres      Crée un environnement où
              en passant.        tout le monde peut avancer.

Peur de casser en prod   Respecte la prod     Sait comment ne pas casser
                           et comment réparer vite
```

La vraie différence entre junior et senior ? Pas le nombre de langages connus. La capacité à voir ce qui va mal **avant** que ça arrive.

---

#### Ce que personne te dit sur le code review

```
LA PR REVIEW c'est pas juste "ça marche ou ça marche pas"

Un bon reviewer regarde :
 -> Le code fait-il ce qu'il dit faire ?
 -> Est-ce maintenable dans 6 mois par quelqu'un d'autre ?
 -> Y a-t-il des edge cases non gérés ?
 -> Est-ce que ça introduit de la dette technique ?
 -> Est-ce que la nomenclature est cohérente avec le reste ?
 -> Les tests couvrent-ils les cas critiques ?

Un bon reviewed (toi quand tu soumets) :
 -> Décrit ce que fait la PR en 2-3 lignes
 -> Indique ce qu'il a testé et comment
 -> Signale les zones d'incertitude ("pas sûr de cette approche")
 -> Garde les PR petites (< 400 lignes de préférence)

Une PR de 2000 lignes = personne la review vraiment. Elle est mergée avec un
"LGTM" (Looks Good To Me) et des bugs en prod 3 jours après.
```

---

#### Les compétences invisibles qui font la différence

**1. Lire du code que t'as pas écrit**

```
La majorité du temps d'un dev expérimenté : comprendre du code existant,
pas en écrire du nouveau.

Ouvre des projets open source dans ton domaine.
Lis le code. Essaie de comprendre sans lancer.
Pose des questions au code. Pourquoi ce choix ?

C'est l'exercice le plus sous-estimé qui existe.
```

**2. Estimer le temps de manière honnête**

```
Junior : "3 jours" -> prend 3 semaines

Mid  : "1 semaine" -> prend 10 jours, avec des risques bien identifiés

Senior : "Je peux donner un chiffre après avoir découpé en sous-tâches.
     Voilà les incertitudes : [liste].
     La fourchette réaliste est X-Y."

Le senior qui dit "2 à 4 semaines selon si l'API tierce est stable" a l'air
moins impressionnant que le junior qui dit "3 jours" avec confiance :
jusqu'au jour de la deadline.

Savoir dire "je sais pas encore" c'est une compétence. Pas un aveu de faiblesse.
```

**3. Écrire pour les humains d'abord**

```javascript
// Ce code "marche"
function f(a, b, c) {
 return c ? a * (c === 1 ? 1.1 : 1.2) : a + b
}

// Ce code vit longtemps
const TAX = { reduced: 1.10, standard: 1.20 }

function calculateFinalPrice(basePrice, shipping, taxType) {
 const rate = TAX[taxType]
 return rate
  ? basePrice * rate
  : basePrice + shipping
}

// Dans 6 mois, un dev (peut-être toi) ouvre ce fichier.
// Lequel il comprend en 5 secondes ?
// Écris toujours pour ce dev-là.
```

**4. Savoir quand ne PAS coder**

```
Un bon dev n'ajoute pas de code quand c'est pas nécessaire.
Chaque ligne de code = dette future.
Chaque fonction = chose à maintenir, tester, documenter.

Avant de coder : est-ce qu'une lib existante fait ça ?
         est-ce qu'une config suffit ?
         est-ce que le besoin est vraiment réel ?

Le meilleur code c'est souvent le code qu'on n'a pas écrit.
```

---

### Les erreurs qui tuent les carrières

#### Erreurs techniques

```
ERREUR               POURQUOI C'EST GRAVE
::::::               ::::::::::::::::::::
Ignorer Git (juste "git push") -> Tu perds du travail, tu bloques l'équipe,
                  tu écrases le code d'un collègue.
                  Git c'est pas optionnel.

Jamais de tests         -> 6 mois plus tard, t'oses plus toucher au code.
                  Chaque modif casse quelque chose.
                  La dette technique devient incontrôlable.

Variables nommées n'importe   -> data, temp, result, x, toto. 6 mois plus tard,
comment               même toi tu comprends plus.

Aucune gestion d'erreur     -> L'app plante silencieusement. Tu sais pas où,
                  ni pourquoi, ni pour qui.

Copier-coller sans comprendre  -> Tu copies aussi les bugs. Et t'as aucune idée
                  comment les corriger.

Surarchitecturer trop tôt    -> Microservices + Kubernetes pour une app de 50
                  utilisateurs. 3 mois perdus. Aucune feature livrée.
```

#### Erreurs de carrière

```
ERREUR               POURQUOI C'EST GRAVE
::::::               ::::::::::::::::::::
Rester en zone de confort    -> T'apprends plus. Dans 3 ans t'es obsolète.

Éviter les projets complexes  -> La croissance vient exactement de là.
                  Les projets confortables ne font pas progresser.

Manager parce que "promotion"  -> Dev senior -> Manager : c'est un métier différent.
                  Si tu le veux pas vraiment, tu seras malheureux
                  et mauvais. Les deux en même temps.

Jamais documenter        -> Le toi de dans 6 mois te détestera.
                  Tes collègues aussi. Personne n'ose le dire.

Travailler en silos       -> Tu bloques ta progression. Les meilleurs
                  apprentissages viennent des autres, pas de toi.

Ne jamais négocier       -> Les salaires ne s'ajustent pas automatiquement.
                  Personne ne vient te proposer une augmentation.
                  C'est toi qui demandes, ou ça n'arrive pas.
```

#### L'erreur mentale la plus répandue

```
"Je lirai la doc quand j'en aurai besoin"

Résultat :
 -> t'utilises 20% des fonctionnalités de chaque outil
 -> tu réinventes des choses qui existent depuis 5 ans
 -> tu rates des optimisations évidentes pour qui connaît l'outil

Consacre 30 min par semaine à lire de la doc, des changelogs,
des release notes des outils que t'utilises tous les jours.
Dans 1 an, t'es l'expert de l'équipe sur ces outils.
Personne d'autre ne le fait.
```

---

### Les compétences fondamentales qui durent toute une vie

Les frameworks meurent. Les langages évoluent. Ces choses, jamais.

```
+------------------------------------------------------------------+
|     LES 8 PILIERS INTEMPORELS                |
+------------------------------------------------------------------+
|                                 |
| 1. PENSÉE ALGORITHMIQUE                     |
|   Décomposer un problème complexe en sous-problèmes simples.  |
|   Valide en 1975. Valide en 2026. Valide en 2060.       |
|                                 |
| 2. STRUCTURES DE DONNÉES                    |
|   Tableaux, hash maps, arbres, graphes.            |
|   Savoir POURQUOI tu choisis l'une plutôt qu'une autre.    |
|   Inventées dans les années 60. N'ont pas changé.       |
|                                 |
| 3. RÉSEAUX ET WEB                        |
|   HTTP, TCP/IP, DNS, TLS, WebSockets.             |
|   Comment les données voyagent. C'est la plomberie d'internet. |
|                                 |
| 4. DÉBOGAGE SYSTÉMATIQUE                    |
|   Pas juste googler l'erreur. Comprendre POURQUOI ça casse.  |
|   Hypothèse -> test -> résultat -> hypothèse suivante.     |
|                                 |
| 5. BASES DE DONNÉES RELATIONNELLES               |
|   SQL existe depuis 1974. Il sera là dans 30 ans.       |
|   Modéliser, écrire des requêtes efficaces, comprendre ACID.  |
|                                 |
| 6. SÉCURITÉ DE BASE                       |
|   XSS, injection SQL, CSRF, auth, chiffrement.         |
|   Les vecteurs changent. Les principes, non.          |
|                                 |
| 7. COMMUNICATION TECHNIQUE                   |
|   Expliquer une décision technique à quelqu'un qui ne code pas.|
|   Écrire un bon README. Donner une bonne code review.     |
|                                 |
| 8. APPRENDRE EN CONTINU                     |
|   Les devs qui prospèrent ne savent pas tout.         |
|   Ils savent apprendre vite. Un nouveau framework en 2 semaines |
|   si les fondations sont solides.               |
|                                 |
+------------------------------------------------------------------+
```

---

### Le mindset final

```javascript
const leDevDe2026 = {
 // IA
 utiliseLIA      : true,  // outil, pas cerveau de remplacement
 valideceQuIlGenere  : true,  // jamais copier-coller aveuglément
 promptAvecContexte  : true,  // garbage in, garbage out

 // Technique
 construitLesBases  : true,  // algo, systèmes, réseau : l'IA aide pas là-dessus
 litLaDoc       : true,  // pas juste quand ça plante
 testeSonCode     : true,  // pas "ça marche sur ma machine"

 // Métier
 communiqueBien    : true,  // le code seul ne suffit pas
 estimeProprement   : true,  // honnêteté > optimisme
 ditNonSiNecessaire  : true,  // une feature inutile bien codée reste inutile

 // Carrière
 resteCurieux     : true,  // tout change vite, faut suivre
 saitLAnglais     : true,  // accès au marché remote = x3 sur le salaire
 construitEnPublic  : true,  // GitHub, portfolio, réputation : ça se construit tôt
}

// La seule chose que l'IA peut pas faire à ta place :
// comprendre ton problème. Vraiment le comprendre.
// Poser les bonnes questions. Voir ce qui manque.
// Décider ce qui compte.
//
// Et ça, c'est toujours ton boulot.
```

---

```
DEV MOYEN               DEV QUI DURE
::::::::::               :::::::::::::::::::::::::::
Copie sans comprendre       -> Comprend ce qu'il colle
Connaît le langage         -> Comprend le système
"Est-ce que ça fonctionne ?"    -> "Est-ce que c'est maintenable ?"
Peur du code des autres      -> Lit le code des autres avec curiosité
Évite les sujets inconnus     -> Plonge dedans
Pense en features         -> Pense en systèmes
Cherche LA meilleure solution   -> Cherche LA BONNE solution dans CE contexte
Attend qu'on lui dise quoi faire  -> Voit ce qui manque et le fait
```

---

> *"L'IA c'est le meilleur pair programmer que t'auras jamais.*
> *Rapide, disponible, patient, jamais de mauvaise humeur.*
> *Mais il a besoin de toi pour savoir ce qu'il fait vraiment.*
> *C'est toi le dev. Lui c'est l'outil."*

---

## 11. Conclusion

Tu as maintenant entre les mains ce que ce guide promettait : une carte. Pas une formule magique, pas un raccourci, une carte.

Elle couvre les fondations (les langages, leur histoire, leur logique), les choix (comment décider sans se paralyser), les métiers (qui fait vraiment quoi dans l'industrie), le marché (ce que ça vaut, et comment accéder aux bons marchés), et les principes qui durent (ceux qu'aucun framework ne va remplacer dans 3 ans).

---

### Ce que tu dois retenir

```
1. LE LANGAGE N'EST PAS LE PROBLÈME
  Le meilleur langage c'est celui que tu maîtrises.
  Les concepts voyagent. La syntaxe change. La logique, non.

2. LA STACK NE FAIT PAS TOUT
  Des apps extraordinaires ont été construites avec des outils "ordinaires".
  La qualité du code et de la réflexion comptent plus que les outils choisis.

3. LA PROFONDEUR BAT LA LARGEUR
  Un expert React/TypeScript vaut plus que quelqu'un qui connaît
  vaguement cinq frameworks. Choisis une direction. Creuse.

4. LE REMOTE EST UN LEVIER RÉEL
  Mêmes compétences, marché différent = salaire multiplié par 3 à 10.
  Ça se construit : portfolio, profil, réputation, premières missions.

5. L'IA EST UN OUTIL, PAS UN CERVEAU DE REMPLACEMENT
  Utilise-la pour aller vite. Garde ton cerveau pour les décisions.
  Valide toujours. Comprends avant d'intégrer.

6. LES FONDAMENTAUX DURENT
  Algorithmique, structures de données, réseaux, bases de données, sécurité.
  Les frameworks changent tous les 3 ans.
  Ces 8 piliers resteront valides en 2060.

7. LE MÉTIER C'EST AUSSI DE LA COMMUNICATION
  Technique, comm, jugement, apprentissage continu : quatre colonnes, pas une.
  Ceux qui n'en voient qu'une deviennent des devs moyens qui stagnent.
```

---

### La suite, c'est quoi ?

Ce guide t'a donné le contexte. Maintenant c'est toi qui construis.

```
SI TU DÉMARRES     ->  Choisis UN langage. Lance UN projet. Finis-le.

SI TU ES INTERMÉDIAIRE ->  Approfondis ta spécialisation.
               Lis du code open source. Contribue.

SI TU VISES LE REMOTE ->  3 projets propres sur GitHub.
               Profil LinkedIn en anglais.
               Première mission, peu importe le tarif.

DANS TOUS LES CAS   ->  Construis les fondamentaux.
               Ils ne t'abandonneront jamais.
```

---

La différence entre ceux qui réussissent dans ce métier et ceux qui abandonnent n'est pas le talent. C'est la régularité. Une heure par jour, tous les jours, pendant deux ans : tu es employable. Pendant cinq ans : tu es crédible. Pendant dix ans : tu décides où tu vas.

> *"Le code que tu écris aujourd'hui, tu t'en souviendras plus dans 3 ans.*
> *Ce que tu comprends aujourd'hui, personne ne peut te le prendre."*

---

*Ces informations sont des tendances basées sur l'état du marché en 2026. Les technos évoluent vite : toujours vérifier les sources récentes avant une décision importante.*

---

## Et maintenant ?

Ce guide t'a posé le décor : c'est quoi le métier, comment il a évolué, où il va.

La suite logique :

```
../../00_referentiel/where_you_stand.md  ->  les 4 axes sur lesquels tu vas progresser (juste un coup d'oeil, pas une lecture complète)
README.md        ->  la roadmap des 32 modules, dans l'ordre
01_fundamentals/     ->  le premier module, le vrai départ
```

Ouvre `../../00_referentiel/where_you_stand.md`, puis `README.md` pour la ROADMAP, et lance-toi dans
`01_fundamentals/00_why_fundamentals.md`.
