# Le Guide que ton prof aurait du te donner le jour 1

---

## Sommaire

1. [C'est quoi un langage de programmation ?](#1-cest-quoi-un-langage-de-programmation)
2. [Les grands types de langages](#2-les-grands-types-de-langages)
3. [Top 10 des langages en 2026](#3-top-10-des-langages-en-2026)
4. [Comment choisir son langage ?](#4-comment-choisir-son-langage)
5. [Debutant ou intermediaire : par ou commencer ?](#5-debutant-ou-intermediaire--par-ou-commencer)
6. [J'ai une idee ou un cahier des charges : je fais quoi exactement ?](#6-jai-une-idee-ou-un-cahier-des-charges--je-fais-quoi-exactement)
7. [Les verites qu'on te dira jamais en cours](#7-les-verites-quon-te-dira-jamais-en-cours)
8. [Les métiers du dev : la carte au trésor que personne t'a donnée](#8-les-metiers-du-dev--la-carte-au-tresor-que-personnequon-t-a-donnee)

---

## 1. C'est quoi un langage de programmation ?

### L'origine : le vrai debut de l'histoire

Avant de parler de Python ou de JavaScript, il faut remonter loin. Tres loin. Genre... 1843.

En **1843**, une femme nommee **Ada Lovelace** ecrit ce qu'on considere aujourd'hui comme le tout
premier algorithme destine a etre execute par une machine. Elle travaillait sur la "Machine
Analytique" de **Charles Babbage** : une machine mecanique geante qui n'a jamais vraiment ete
construite de son vivant. Ada est donc techniquement la premiere programmeuse de l'histoire.
C'est pour ca que le langage **Ada** (utilise encore aujourd'hui dans l'aviation et l'armee) porte
son prenom.

> Tip : Ada Lovelace etait aussi la fille du poete Lord Byron. La programmation et la poesie,
> c'est pas si different finalement.

Mais un "vrai" langage de programmation au sens moderne, ca arrive bien plus tard.

En **1949**, **John Mauchly** cree **Short Code** : le premier langage a ressembler a ce qu'on
connait aujourd'hui. Des instructions lisibles par un humain, pas juste des 0 et des 1.

Puis en **1957**, **John Backus** et son equipe chez IBM inventent **FORTRAN**
(FORmula TRANslation). C'est le premier langage vraiment utilisé massivement, principalement
pour les calculs scientifiques. FORTRAN existe encore en 2026. Oui, vraiment. Les scientifiques
qui simulent des trajectoires de fusees l'utilisent encore.

---

### Mais concretement, un langage c'est quoi ?

Un ordinateur ne comprend qu'une seule chose : des **0 et des 1**. Le binaire. Personne ne code
en binaire (enfin, il y a des gens... on va pas en parler).

```
Le mot "Bonjour" en binaire :
01000010 01101111 01101110 01101010 01101111 01110101 01110010
```

Un langage de programmation, c'est un **intermediaire** entre toi (l'humain) et la machine. Tu
ecris des instructions dans un format que tu comprends, et le langage s'occupe de tout traduire
en langage machine.

```
Illustration : la chaine de traduction

  TOI                LANGAGE               MACHINE
  ----               --------              -------
 "affiche           print("Bonjour")   01000010 01101111...
  Bonjour"               |
  (ta pensee)       (ta syntaxe)        (ce que la puce comprend)
```

C'est exactement comme un traducteur lors d'une conference internationale. Toi tu parles
francais, la machine parle binaire, et le langage de programmation joue le role de l'interprete
entre vous deux.

---

### Frise chronologique : de 1843 a 2026

```
1843 -------- Ada Lovelace ecrit le 1er algo de l'histoire (sur papier)
1949 -------- Short Code : 1er langage lisible par un humain
1957 -------- FORTRAN : 1er langage massivement utilise (IBM)
1958 -------- LISP : ancetre de tous les langages fonctionnels
1959 -------- COBOL : Grace Hopper. Les banques l'utilisent encore
1972 -------- C : Dennis Ritchie. Le pere de presque tout
1983 -------- C++ : C mais avec des objets dedans
1991 -------- Python : Guido van Rossum. Nomme d'apres les Monty Python
1995 -------- Java + JavaScript + PHP : L'ANNEE DU WEB
2009 -------- Go : Google en avait marre que C++ compile trop lentement
2010 -------- Rust : Mozilla en avait marre que C++ plante tout
2014 -------- Swift : Apple remplace Objective-C, enfin lisible
2015 -------- Kotlin : JetBrains commence a tuer Java sur Android
2016 -------- TypeScript : Microsoft rend JavaScript serieux
2022+ ------- Zig, Carbon : nouveaux challengers qui visent C/C++
```

> Anecdote : en 1995, Java, JavaScript et PHP sont tous les trois sortis la meme annee. C'est
> comme si Ferrari, Lamborghini et Bugatti avaient tous sorti leur voiture le meme jour.

---

### Qui a programmé quoi en premier ?

```
PREMIER ALGO DOCUMENTE    : Ada Lovelace (1843)
PREMIER LANGAGE LISIBLE   : John Mauchly avec Short Code (1949)
PREMIER LANGAGE MASSIVEMENT UTILISE : John Backus avec FORTRAN (1957)
PREMIER LANGAGE WEB       : Brendan Eich avec JavaScript (1995, en 10 jours)
```

> Oui, JavaScript a ete cree en **10 jours**. Et ca explique beaucoup de choses.

---

## 2. Les grands types de langages

Il existe plusieurs facons de classer les langages. Voila les principales, avec des analogies
concretes pour que ca rentre vraiment.

---

### Bas niveau vs Haut niveau

**Bas niveau** : tu es tres proche de la machine. Tu controles tout. La memoire, les registres,
les octets. C'est puissant, c'est ultra-rapide. C'est aussi dangereux si tu fais des erreurs.

```
Exemples : Assembleur, C

Analogie :
  Conduire une F1 sans assistance electronique.
  Tu peux aller tres vite. Mais si tu rates une courbe, t'es dans le mur.
```

**Haut niveau** : le langage s'occupe de beaucoup de choses a ta place. La memoire ? Geree
automatiquement. Les types ? Souvent deduits tout seuls. Tu te concentres sur la logique.

```
Exemples : Python, JavaScript, Kotlin, Swift

Analogie :
  Conduire une Tesla avec pilote automatique.
  Tu indiques la destination, la voiture gere le reste.
  Tu peux quand meme tout controler si tu veux, mais t'as pas besoin.
```

> Tip : "bas niveau" et "haut niveau" ne veulent pas dire "mauvais" et "bon". C'est juste le
> niveau d'abstraction. Les deux ont leur place.

---

### Compile vs Interprete vs JIT

C'est la question du "comment ton code devient un vrai programme qui tourne".

```
COMPILE (ex: C, C++, Rust, Go)
:::::::::::::::::::::::::::::::::::::::::::::::::

  Ton code .c  -->  Compilateur  -->  .exe / binaire  -->  Execute
  (lisible)         (traducteur)      (machine pure)        (rapide)

  Avantage  : tres rapide a l'execution
  Inconvenient : tu dois recompiler apres chaque modif

--------------------------------------------------------------------

INTERPRETE (ex: Python, Ruby)
:::::::::::::::::::::::::::::::::::::::::::::::::

  Ton code .py  -->  Interprete  -->  Execute ligne par ligne
  (lisible)          (lit + agit)     (en temps reel)

  Avantage  : flexible, facile a tester
  Inconvenient : un peu plus lent que le compile

--------------------------------------------------------------------

JIT : Just-In-Time (ex: JavaScript V8, Java JVM, Kotlin)
:::::::::::::::::::::::::::::::::::::::::::::::::

  Ton code  -->  Compile AU MOMENT ou tu l'executes  -->  Execute
                 (pas avant, pas ligne par ligne)

  Avantage  : combine vitesse du compile + flexibilite de l'interprete
  C'est ce que fait Chrome quand il execute ton JS
```

> Analogie pour le JIT : t'imagines un chef cuisinier qui prend ta commande et cuisine exactement
> ce dont tu as besoin, juste a temps. Ni trop tot (gache), ni trop tard (froid).

---

### Les paradigmes de programmation

Un paradigme, c'est une philosophie. Une facon de penser ton code. Meme langage, paradigmes
differents = code completement different.

**Imperatif** : tu dis a la machine COMMENT faire les choses, etape par etape.

```javascript
// Imperatif : "voila comment faire"
let total = 0;
for (let i = 0; i < nombres.length; i++) {
  total = total + nombres[i];
}
```

**Fonctionnel** : tu dis a la machine CE QUE tu veux obtenir. Tu travailles avec des fonctions
pures. Pas de modification de variables existantes.

```javascript
// Fonctionnel : "voila ce que je veux"
const total = nombres.reduce((acc, n) => acc + n, 0);
```

**Oriente Objet (POO)** : tu organises ton code autour d'"objets" qui ont des proprietes et
des comportements. C'est la methode la plus repandue en entreprise.

```python
# POO : les donnees et les actions sont dans le meme endroit
class Voiture:
    def __init__(self, marque, vitesse_max):
        self.marque = marque
        self.vitesse_max = vitesse_max

    def presenter(self):
        print(f"Je suis une {self.marque}, je vais jusqu'a {self.vitesse_max} km/h")

ma_voiture = Voiture("Toyota", 180)
ma_voiture.presenter()
# Sortie : Je suis une Toyota, je vais jusqu'a 180 km/h
```

> Tip important : la plupart des langages modernes supportent PLUSIEURS paradigmes. Python est
> imperatif, fonctionnel et oriente objet selon ce que tu choisis de faire. T'as pas a choisir
> un camp.

---

### Front-end vs Back-end vs Full-stack

```
                          L'APPLICATION WEB
          ________________________________________________
         |                                                |
         |   FRONT-END                    BACK-END        |
         |   (ce que tu vois)             (le moteur)     |
         |                                                |
         |   HTML : la structure          Python          |
         |   CSS  : le style              Java            |
         |   JS   : les interactions      PHP             |
         |   TS   : JS mais serieux       Go              |
         |                                Rust            |
         |                                Node.js (JS)    |
         |                                C#              |
         |________________________________________________|
                              |
                              v
                        BASE DE DONNEES
                    (PostgreSQL, MySQL, MongoDB...)
```

**Full-stack** : tu fais les deux. Le dev qui fait le front ET le back.

**JavaScript / TypeScript** est le seul langage que tu peux utiliser partout : navigateur, serveur,
mobile. C'est pour ca qu'il est si dominant.

**Mobile natif** :
```
iOS     : Swift
Android : Kotlin
```

**Mobile cross-platform** (une seule codebase pour iOS + Android) :
```
Flutter      : Dart (pousse par Google, tres solide en 2026)
React Native : JavaScript (le plus ancien, encore tres utilise)
```

---

## 3. Top 10 des langages en 2026

### Le classement

```
 RANG   LANGAGE          PART ESTIMEE   USAGE PRINCIPAL              TENDANCE
 ----   -------          ------------   ---------------              --------
  1     Python           ~30%           IA, data, backend, scripts   Hausse constante
  2     JavaScript       ~23%           Web front + back, mobile     Stable / indispensable
  3     Java             ~15%           Enterprise, Android, backend Stable / legacy fort
  4     TypeScript       ~12%           Web, tout ce que JS fait     Forte hausse
  5     C / C++          ~10%           Systemes, jeux, performance  Stable
  6     Rust             ~8%            Systemes, securite, WASM     Forte hausse
  7     Go               ~7%            Backend, microservices       En hausse
  8     Kotlin           ~6%            Android, backend Spring      Stable/hausse
  9     Swift            ~5%            iOS, macOS                   Stable
  10    C#               ~5%            Jeux Unity, Windows, enterprise Stable
```

*Les pourcentages sont des estimations relatives basees sur plusieurs indices croises, pas des
chiffres officiels absolus. C'est une tendance, pas une loi.*

---

### Portrait de chaque langage du top 10

**1. Python : le roi indiscutable en 2026**

```python
# Python c'est aussi propre que ca
def saluer(nom):
    return f"Bonjour {nom}, bienvenue dans le monde du code"

print(saluer("Prometheus"))
# Sortie : Bonjour Prometheus, bienvenue dans le monde du code
```

Pourquoi il domine : l'IA. ChatGPT, Gemini, tous les modeles d'IA sont entrainés avec Python.
PyTorch, TensorFlow, Hugging Face : tout est en Python. Si tu veux toucher a l'IA en 2026,
t'as pas vraiment le choix.

---

**2. JavaScript : l'incontournable du web**

```javascript
// JavaScript : partout, tout le temps
const devs = ["Alice", "Bob", "Prometheus"];
const message = devs.map(dev => `${dev} code en JS`);
console.log(message);
// ["Alice code en JS", "Bob code en JS", "Prometheus code en JS"]
```

Pourquoi il reste indispensable : c'est le seul langage natif des navigateurs. Tu peux faire
du front, du back avec Node.js, du mobile avec React Native. Un seul langage pour tout.

---

**3. Java : le veterane des grandes boites**

```java
// Java : verbeux mais solide
public class Salutation {
    public static void main(String[] args) {
        String nom = "Prometheus";
        System.out.println("Bonjour " + nom);
    }
}
```

Pourquoi il reste : les grandes banques, assurances, et entreprises ont des millions de lignes
de code Java. On peut pas tout réécrire du jour au lendemain. Java a aussi la JVM qui est
extraordinairement optimisee apres 30 ans.

---

**4. TypeScript : JavaScript qui s'est calmé**

```typescript
// TypeScript : JS avec des types. Beaucoup moins de bugs stupides.
function calculerAge(anneeNaissance: number): number {
    return 2026 - anneeNaissance;
}

const age = calculerAge(2000);  // OK : 26
const bug = calculerAge("2000"); // ERREUR detectee avant meme d'executer
```

En 2026, la majorite des nouveaux projets web professionnel sont en TypeScript, pas JavaScript.
C'est devenu le standard de facto.

---

**5. C / C++ : les anciens qui refusent de mourir**

```c
// C : pas de magie. Tu geres toi-meme ta memoire.
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

Utilises dans le noyau Linux, Windows, macOS. Dans les voitures, les avions, les consoles de jeu.
Partout ou la performance est non-negociable.

---

**6. Rust : le nouveau sherif de la ville**

```rust
// Rust : aussi rapide que C, mais il t'empeche de faire des betises
fn main() {
    let nombres = vec![1, 2, 3, 4, 5];
    let total: i32 = nombres.iter().sum();
    println!("Total : {}", total);
}
// Si tu tentes d'acceder a une case memoire invalide, Rust refuse de compiler.
// En C, ca aurait plante silencieusement en production.
```

Le gouvernement americain et l'Union Europeenne ont officiellement recommande Rust pour les
logiciels critiques en 2024-2025. Microsoft reecrit des parties de Windows en Rust.

---

**7. Go : le langage de la simplicite radicale**

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

Cree par Google pour remplacer C++ dans leurs serveurs internes. Compile ultra-vite, s'execute
ultra-vite. Docker, Kubernetes, Terraform : tous ecrits en Go.

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

Kotlin est maintenant le langage officiel d'Android. JetBrains (les createurs d'IntelliJ IDEA
et de la suite d'IDEs professionnels) le maintiennent activement.

---

**9. Swift : programmer pour Apple, enfin avec plaisir**

```swift
// Swift : propre, moderne, rapide
let devs = ["Alice", "Bob", "Prometheus"]
for dev in devs {
    print("Bonjour \(dev)")
}
```

Objective-C (l'ancien langage d'Apple) etait tellement difficile a lire que les developpeurs
fuyaient le developpement iOS. Swift a tout change en 2014.

---

**10. C# : le polyvalent de Microsoft**

```csharp
// C# : Java-like mais made by Microsoft
var devs = new List<string> {"Alice", "Bob", "Prometheus"};
devs.ForEach(dev => Console.WriteLine($"Bonjour {dev}"));
```

Si tu veux faire des jeux avec Unity, c'est C#. Si tu veux faire des apps Windows, c'est C#.
Dans les grandes boites europeennes, C# est tres present dans les stacks .NET.

---

### Ce qui se passe en dehors du top 10

```
PHP      : peu de gens l'avouent, mais WordPress fait tourner ~43% du web mondial.
           PHP est partout.

Ruby     : decline depuis des annees, mais Ruby on Rails est encore dans des milliers
           de startups.

Dart     : langage de Flutter. Pousse tres fort par Google. En forte progression
           sur le mobile.

Lua      : discret mais present dans TOUS les jeux video. Roblox, WoW, etc.

SQL      : pas vraiment un langage de prog general, mais probablement le langage
           le plus utilise dans le monde professionnel. Tout le monde y touche.

HTML/CSS : oublies des classements parce que techniquement pas des "vrais langages
           de programmation". Mais sans eux, pas de web.

Zig      : challenger de C. Tres jeune, tres prometteur.

Carbon   : challenger de C++. Cree par Google. A surveiller.

COBOL    : personne ne l'apprend. Tout le monde l'utilise sans le savoir.
           Les banques font tourner des systemes critiques en COBOL.
           Les gens qui savent le maintenir sont payes TRES cher.
```

---

## 4. Comment choisir son langage ?

C'est LA question. Et la reponse honnete : ca depend.

Mais "ca depend" tout seul c'est inutile. Voila les vraies questions a se poser, dans l'ordre.

---

### Question 1 : Pour quoi faire ?

Le langage suit le besoin. **Jamais l'inverse.**

```
SI TU VEUX FAIRE...                  CHOISIS...
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Un site web (interface)          :   JavaScript / TypeScript
Une API ou un serveur web        :   Node.js, Python, Go, Java, PHP
Une app mobile iOS               :   Swift
Une app mobile Android           :   Kotlin
Une app mobile iOS + Android     :   Flutter (Dart) ou React Native (JS)
Un jeu video                     :   C# (Unity) / C++ (Unreal) / GDScript (Godot)
De l'IA ou de la data            :   Python (et rien d'autre en 2026)
Des outils systeme / performance :   C, C++, Rust
Des scripts d'automatisation     :   Python, Go, Bash
Des applications d'entreprise    :   Java, C#, Kotlin
Du WebAssembly                   :   Rust, C++
```

---

### Question 2 : Projet perso ou pro ?

**Projet perso** : choisis ce qui te motive. Si Python t'ennuie et que tu kiffes Rust, vas-y.
L'apprentissage sera quand meme utile. La motivation c'est le carburant.

**Projet pro ou startup** : choisis ce qui a le plus grand ecosysteme, le plus de librairies,
et le plus de developpeurs sur le marche (pour recruter plus tard si ca grandit).

> Tip : regarde les offres d'emploi dans ta ville ou ton pays cible. Ce qui est demande
> dans les annonces, c'est ce que tu dois apprendre.

---

### Question 3 : Maintenant ou long terme ?

```
PROTOTYPER VITE (dans les semaines) :   Python, JavaScript
Systemes qui durent 10 ans          :   Java, C#, Rust
Performance critique                :   C, C++, Rust, Go
```

---

### Question 4 : La communaute est grande comment ?

Plus la communaute est grande, plus tu as :

```
- De la documentation (souvent traduite en francais)
- Des librairies et frameworks deja faits (t'as pas a tout reinventer)
- Des reponses sur Stack Overflow (quelqu'un a eu ton probleme avant toi)
- Des offres d'emploi (important quand tu veux bosser)
- Des tutos YouTube gratuits
```

**Classement des communautes en 2026 :**

```
Enorme   :  Python, JavaScript, Java
Grande   :  TypeScript, C#, C/C++, Rust
Moyenne  :  Go, Kotlin, Swift, PHP
Plus petite mais solide : Ruby, Dart, Scala
```

---

### Conseil anti-paralysie

La "paralysie de l'analyse" c'est quand tu passes 3 semaines a comparer des langages au lieu
de coder. C'est l'ennemi numero 1 des debutants.

```
Tu te demandes : Python ou JavaScript ?
                 Flutter ou React Native ?
                 Go ou Rust ?

La vraie reponse : CHOISIS ET COMMENCE.

Tu changeras peut-etre dans 6 mois. C'est pas grave.
Les concepts que tu apprends dans un langage se transfèrent.
```

---

## 5. Debutant ou intermediaire : par ou commencer ?

### Si tu es completement debutant

**Python** est le meilleur point d'entree en 2026. Exemple concret pour comprendre pourquoi.

Meme programme dans trois langages differents : afficher une liste de prenoms.

```python
# Python : tu lis, tu comprends immediatement
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
// Java : le meme resultat, mais beaucoup plus de bruit
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

Ces trois blocs font **exactement la meme chose**. En tant que debutant, tu veux pouvoir
te concentrer sur la logique, pas sur la syntaxe. Python gagne.

**JavaScript** est aussi une excellente option si tu veux aller vers le web. Tu vois les
resultats dans ton navigateur immediatement. C'est tres motivant.

> Conseil : si tu sais pas quoi choisir entre Python et JavaScript, commence par Python.
> Si tu veux faire des sites web rapidement, commence par JavaScript.
> Dans les deux cas, les bases que tu apprends s'appliquent partout.

---

### Le parcours recommande selon ton objectif

```
OBJECTIF : DEV WEB FULL-STACK
:::::::::::::::::::::::::::::::::::::::::
  Debut    -->  HTML + CSS + JavaScript basique
  3 mois   -->  JavaScript (fonctions, objets, fetch/API)
  6 mois   -->  TypeScript + React ou Vue
  1 an     -->  Next.js ou Nuxt + base de donnees (SQL)
  1 an+    -->  Deploiement, Docker, CI/CD
  Resultat :  Dev web junior employable

OBJECTIF : DEV MOBILE
:::::::::::::::::::::::::::::::::::::::::
  Cross-platform :
    Debut    -->  Dart basique
    3 mois   -->  Flutter (widgets, navigation, etat)
    6 mois   -->  Firebase ou Supabase (auth, base de donnees)
    1 an     -->  App publiee sur le Play Store ou l'App Store

  Android natif :
    Debut    -->  Kotlin basique + POO
    3 mois   -->  Jetpack Compose
    6 mois   -->  Architecture MVVM + Retrofit
    1 an     -->  App publiee

OBJECTIF : DATA / IA
:::::::::::::::::::::::::::::::::::::::::
  Debut    -->  Python basique
  3 mois   -->  NumPy + Pandas (manipulation de donnees)
  6 mois   -->  Matplotlib + Seaborn (visualisation)
  1 an     -->  Machine Learning avec scikit-learn
  1 an+    -->  Deep Learning avec PyTorch ou TensorFlow

OBJECTIF : SYSTEMES / PERFORMANCE
:::::::::::::::::::::::::::::::::::::::::
  Debut    -->  C (apprends la gestion memoire, les pointeurs)
  6 mois   -->  C++ ou Rust
  1 an     -->  Architecture bas niveau, OS, compilateurs
```

---

### La regle des deux technologies

Ne cherche pas a tout apprendre en meme temps. En 2026, la regle d'or c'est :

```
Maitrise UN langage + maitrise UN framework ou domaine specifique.

Exemples concrets :
  Python   + FastAPI       -->  Dev backend API
  Python   + PyTorch       -->  IA / Machine Learning
  JS/TS    + React         -->  Dev front-end web
  JS/TS    + Next.js       -->  Dev full-stack web
  Dart     + Flutter       -->  Dev mobile cross-platform
  Kotlin   + Jetpack       -->  Dev Android natif
  C#       + Unity         -->  Dev jeu video
  Go       + (rien)        -->  Backend microservices (Go se suffit souvent)
```

> La profondeur bat la largeur. Un dev qui maitrise vraiment React + TypeScript vaut plus
> qu'un dev qui connait vaguement React, Vue, Angular, Svelte et Solid en meme temps.

---

## 6. J'ai une idee ou un cahier des charges : je fais quoi exactement ?

C'est la section la plus importante. Parce que c'est exactement la situation ou la majorite
des etudiants se perdent. Tu sors de cours, tu sais coder. Et la tu te demandes "mais dans la
vraie vie, je fais quoi exactement ?"

---

### Etape 1 : Definir le type de produit

**Avant de choisir un seul outil ou langage**, tu dois savoir ce que tu construis.

Pose-toi ces questions dans l'ordre :

```
1. C'est quoi le produit ?
   (site web / app mobile / outil interne / jeu / API / script...)

2. Qui va l'utiliser ?
   (grand public / entreprises / toi seul / des developpeurs...)

3. Sur quel appareil ?
   (navigateur / telephone / bureau / serveur / les deux...)

4. Y a-t-il de la donnee a stocker ?
   (oui --> tu as besoin d'une base de donnees)

5. Faut-il se connecter a des services externes ?
   (paiement, GPS, notifications push, emails, SMS...)

6. Y a-t-il des contraintes legales ?
   (sante, finances, donnees personnelles --> RGPD, securite renforcee)
```

Exemple pratique :

```
Idee : "je veux creer une app pour noter et partager des restaurants"

Reponses :
  1. App mobile + site web
  2. Grand public
  3. Telephone principalement
  4. Oui : restaurants, avis, utilisateurs, notes
  5. Oui : GPS (maps), photos, notifications
  6. Donnees personnelles : respecter le RGPD

Conclusion : app mobile (Flutter) + backend API (Node ou Python) + base de donnees
             (PostgreSQL ou Firebase) + service de maps (Google Maps API)
```

---

### Etape 2 : Identifier les contraintes reelles

```
CONTRAINTE          IMPACT SUR LE CHOIX TECH
-----------------------------------------------------------------------------------

Peu de temps         :  Technos que tu connais DEJA. Pas le moment d'apprendre Rust.

Pas de budget        :  Vercel (gratuit), Supabase (gratuit), Firebase (gratuit au debut)

Travail en equipe    :  Ce que tout le monde dans l'equipe sait deja. Pas le moment
                        d'imposer un langage exotique.

Doit durer longtemps :  Java, C#, Rust : stables, maintenus sur le long terme.
                        Evite les frameworks trop jeunes (ils disparaissent vite).

Beaucoup d'utilisateurs potentiels :
                        Pense a la scalabilite. Go et Node.js gèrent bien la charge.
                        Les bases de donnees relationnelles (PostgreSQL) tiennent mieux
                        que certaines bases NoSQL sous haute charge.

Client / projet scolaire :
                        Choisis ce qui te permet de livrer quelque chose qui MARCHE.
                        Un projet simple qui fonctionne vaut 100x mieux qu'un projet
                        complexe qui plante.
```

---

### Etape 3 : Choisir la stack

Une **stack** c'est l'ensemble des technologies que tu vas utiliser. Front + Back + Base de
donnees + Hebergement.

```
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
SITE WEB ou APP WEB : stack moderne debutant-intermediaire
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  Front-end    :  Next.js (React + TypeScript)
  Back-end     :  Inclus dans Next.js via API routes, ou Supabase directement
  Base de donnees : PostgreSQL via Supabase
  Auth         :  Supabase Auth (Google, GitHub, email/password)
  Hebergement  :  Vercel (gratuit pour les petits projets)
  Style        :  Tailwind CSS

Avantages : tout est gratuit au debut, tres bien documente, des milliers de tutos.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
SITE WEB : stack alternative
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  Front-end    :  Vue.js ou SvelteKit
  Back-end     :  Python avec FastAPI
  Base de donnees : PostgreSQL
  Hebergement  :  Railway ou Render
  Style        :  Tailwind CSS

Quand choisir cette stack : si tu connais mieux Python que JavaScript pour le back.

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
APPLICATION MOBILE : cross-platform
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  Langage      :  Dart
  Framework    :  Flutter
  Backend/Auth :  Firebase ou Supabase
  Maps         :  Google Maps Flutter Plugin
  Deploiement  :  Google Play Store + Apple App Store

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
APPLICATION MOBILE : natif Android
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  Langage      :  Kotlin
  UI           :  Jetpack Compose
  Architecture :  MVVM + Clean Architecture
  Backend      :  Firebase ou API REST

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
OUTIL INTERNE ou SCRIPT
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  Python + librairies selon le besoin
  (requests pour les APIs, pandas pour la data, etc.)

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
JEU VIDEO
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

  Plupart des cas    :  Unity + C#
  Gratuit open source:  Godot + GDScript (ou C#)
  AAA / ultra-perf   :  Unreal Engine + C++
```

---

### Etape 4 : Ne pas surarchitecturer

C'est **l'erreur classique** de l'etudiant en info.

```
SCENARIO TYPE :
  Le projet : une application de prise de notes (3 ecrans).
  Ce que l'etudiant fait :
    Semaine 1 : configure Docker + Docker Compose
    Semaine 2 : met en place Kubernetes
    Semaine 3 : architecture microservices avec 4 services separes
    Semaine 4 : pipeline CI/CD sur GitHub Actions
    Semaine 5 : ... il a pas encore une seule note dans l'app

PROBLEME : l'etudiant a construit l'infrastructure d'Amazon pour une app de notes.

LA BONNE APPROCHE :
  Semaine 1 : l'app de notes fonctionne, on peut creer une note et la lire.
  Semaine 2 : on peut modifier et supprimer une note.
  Semaine 3 : authentification.
  Semaine 4 : deploiement simple sur Vercel.
  Plus tard  : si ya 10 000 utilisateurs, la on reflechit a Docker et Kubernetes.
```

> Regle : **commence simple**. Ajoute de la complexite quand le BESOIN apparait vraiment, pas
> avant. Un MVP (Minimum Viable Product) c'est la version la plus simple possible qui resout
> le vrai probleme. Tout le reste vient apres.

---

### Le schema de decision complet

```
                    TU AS UN PROJET
                          |
                          v
          Qu'est-ce que tu construis ?
                          |
        __________________|__________________
       |                  |                  |
      WEB               MOBILE            AUTRE
       |                  |                  |
  interface ?         iOS seul ?         Jeu video ?
       |                  |                  |
      Oui              --> Swift          Unity + C#
       |                  |              Unreal + C++
  Next.js (TS)       Android seul ?      Godot + GDScript
  React / Vue             |
  SvelteKit           --> Kotlin              |
                          |             Script / Outil ?
                      Les deux ?             |
                          |            Python + libs
                      --> Flutter
                       (Dart)               |
                          |           IA / Data ?
                     _____|_____            |
                    |           |      Python UNIQUEMENT
                  API          API     PyTorch / TensorFlow
               incluse       separee   scikit-learn / Pandas
                (Supabase)       |
                             Qui fait le back ?
                                 |
                          ________________
                         |                |
                      JS / TS           Python
                          |                |
                       Node.js          FastAPI
                       Express          Django
                       Fastify          Flask

                          |
                          v
                   BASE DE DONNEES ?
                          |
              ____________|____________
             |                        |
        Donnees relationnelles   Donnees flexibles
        (tableaux + relations)   (documents JSON)
             |                        |
         PostgreSQL               MongoDB
         MySQL                    Firebase Firestore
         SQLite (local)

                          |
                          v
                     HEBERGEMENT ?
                          |
              ____________|____________
             |            |            |
           Vercel       Railway      Render
          (front /      (back /      (back /
          Next.js)      Node/Python)  Node/Python)
           Gratuit      Gratuit       Gratuit
           au debut     au debut      au debut
```

---

### Quand utiliser ce qu'on apprend a l'ecole ?

```
A L'ECOLE tu apprends Python.
DANS LA VRAIE VIE tu l'utilises pour :
  Data science, analyse, visualisation
  Scripts d'automatisation
  APIs et backends
  IA et Machine Learning
  Web scraping
  Tests automatises

A L'ECOLE tu apprends JavaScript.
DANS LA VRAIE VIE tu l'utilises pour :
  Tout ce qui s'affiche dans un navigateur (obligatoire)
  Les applications web full-stack (Next.js, Nuxt)
  Les apps mobiles (React Native)
  Le backend avec Node.js
  Les scripts d'automatisation web

A L'ECOLE tu apprends Java.
DANS LA VRAIE VIE tu l'utilises pour :
  Les grandes entreprises et banques
  Le backend d'applications critiques
  Android (mais Kotlin le remplace)
  Les systemes qui doivent tourner 24/7 sans jamais tomber

A L'ECOLE tu apprends C ou C++.
DANS LA VRAIE VIE tu l'utilises pour :
  Comprendre comment un ordinateur fonctionne vraiment
  Les logiciels ou la performance est critique
  Les jeux video avec Unreal Engine
  Les systemes embarques (arduino, robotique)
  Le trading haute frequence
  Les noyaux de systemes d'exploitation
```

---

### Exemple concret complet : de l'idee a la stack

**Situation** : tu veux creer une plateforme communautaire pour developpeurs. Des profils
utilisateurs, des posts, des likes, une messagerie en temps reel.

**Analyse du projet** :

```
Type de produit     :  Application web (mobile en version 2 peut-etre)
Utilisateurs        :  Des developpeurs : public averti, ils utilisent un navigateur
Fonctionnalites cles:  Auth, profils, posts, likes, messagerie temps reel
Contrainte principale: messagerie en temps reel = besoin de websockets ou de subscriptions
Budget              :  Zero (projet perso / scolaire)
Temps               :  3 mois
```

**Stack choisie** :

```
Front-end        :  Next.js (TypeScript)
Styles           :  Tailwind CSS
Backend          :  Supabase (API auto-generee depuis PostgreSQL)
Auth             :  Supabase Auth
Base de donnees  :  PostgreSQL via Supabase
Temps reel       :  Supabase Realtime (websockets inclus)
Hebergement      :  Vercel (gratuit)
```

**Pourquoi pas quelque chose de plus complexe ?**

```
  Parce que ca suffit.
  Ces outils sont gratuits au debut.
  Ils sont scalables si le projet grandit.
  La doc est excellente.
  Des milliers de tutos existent.
  Tu peux livrer en 3 mois, pas en 3 ans.
```

---

## 7. Les verites qu'on te dira jamais en cours

**Verite 1 : Le meilleur langage c'est celui que tu maitrises vraiment.**

Un dev qui connait JavaScript sur le bout des doigts battra toujours quelqu'un qui connait
vaguement dix langages. La profondeur bat la largeur, toujours.

**Verite 2 : Les langages ne meurent pas vraiment.**

COBOL de 1959 tourne encore dans les banques en 2026. FORTRAN tourne encore dans les labos
scientifiques. Si t'apprends un langage "mort", les concepts que tu apprends restent valides
partout. Mais pour le marche de l'emploi, choisis quelque chose de vivant.

**Verite 3 : Les concepts se transferent.**

```
Si tu maitrises vraiment Python :
  Apprendre Go prend quelques semaines.
  Apprendre Kotlin prend quelques semaines.
  Apprendre Swift prend quelques semaines.

Les boucles, les conditions, les fonctions, les objets, les erreurs :
  c'est pareil partout. La syntaxe change. La logique, non.
```

**Verite 4 : La stack ne fait pas tout.**

```
Applications extraordinaires construites avec des technos "basiques" :
  Instagram au debut : Python + Django. Simple. Efficace.
  Twitter au debut   : Ruby on Rails. Pas tres "cool". Mais ca marchait.
  WhatsApp           : Erlang. Un langage de 1986. 2 milliards d'utilisateurs.

Applications catastrophiques construites avec les technos les plus modernes :
  Il y en a plein. On en parle juste moins parce que personne les connait.

La qualite du code et de l'architecture matter plus que le choix du langage.
```

**Verite 5 : Lire du code des autres est aussi important qu'en ecrire.**

Passe du temps sur GitHub. Lis des projets open source dans ton domaine. Essaie de comprendre
comment les autres ont resolu les memes problemes que toi. C'est comme lire des livres pour
un ecrivain : indispensable.

**Verite 6 : Le syndrome de l'imposteur est universel.**

Meme les devs avec 15 ans d'experience googlelent des trucs basiques tous les jours. Tout le
monde le fait. Personne ne sait tout par coeur. La difference entre un junior et un senior
c'est souvent juste le nombre de fois ou il a resolu le meme type de probleme.

**Verite 7 : Les outils changent. Les fondamentaux, non.**

Les frameworks changent tous les 3 ans. Angular, React, Vue, Svelte, Solid... dans 5 ans
il y en aura d'autres. Mais quelqu'un qui comprend vraiment le DOM, les evenements, l'asynchrone
et les requetes HTTP s'adaptera en quelques semaines a n'importe quel nouveau framework.

> Construis des fondations solides. Le reste vient tout seul.

---

>_Ce sont des tendances, pas des chiffres officiels absolus._
>_Les technos evoluent vite : toujours verifier les sources recentes avant une decision importante._

---
## 8. Les métiers du dev : la carte au trésor que personne t'a donnée

> *"J'apprends à coder comme quelqu'un qui vient de découvrir une porte secrète dans un donjon. Je sais qu'il y a des trésors derrière... mais je veux comprendre : quels sont TOUS les chemins possibles, qui les emprunte, avec quels outils, et lequel me rend riche ou heureux — idéalement les deux ?"*

Ok. T'as appris à coder. Bonne nouvelle : t'as maintenant accès à l'une des industries les plus larges, les plus diverses, et les mieux payées de la planète. Mauvaise nouvelle : y'a tellement de métiers que la plupart des gens ne savent même pas qu'ils existent.

Ce chapitre, c'est le GPS complet. Pas juste "dev frontend vs backend". Vraiment tout.

---

### La carte complète de l'industrie software

```
                    L'INDUSTRIE DU LOGICIEL
    ____________________________________________________________
   |                                                            |
   |  CE QUE LES UTILISATEURS VOIENT    CE QUI FAIT TOURNER    |
   |  (layer produit)                   (layer infrastructure)  |
   |                                                            |
   |  Frontend Dev          Backend Dev      DevOps/SRE         |
   |  Mobile Dev            Data Engineer    Cloud Engineer     |
   |  UI/UX Engineer        API Engineer     Platform Engineer  |
   |                                                            |
   |  CE QUI REND INTELLIGENT           CE QUI PROTEGE TOUT     |
   |  (layer intelligence)              (layer securite)        |
   |                                                            |
   |  ML Engineer           Data Scientist   Security Engineer  |
   |  AI Engineer           Research Eng.    Pentest / Red Team |
   |                                                            |
   |  LES PILIERS TRANSVERSES                                   |
   |                                                            |
   |  Software Engineer     Full-Stack Dev   Tech Lead          |
   |  Software Architect    Engineering Manager    CTO          |
   |____________________________________________________________|
   |                                                            |
   |  SPECIALISATIONS SECTORIELLES                              |
   |  Game Dev  |  Blockchain Dev  |  Embedded Systems Dev      |
   |  Compiler Engineer  |  Graphics Engineer  |  Kernel Dev    |
   |____________________________________________________________|
```

---

### Les métiers du quotidien : ce qu'ils font VRAIMENT

---

#### Frontend Developer

**En une phrase** : il construit tout ce que tu vois et touches dans une interface. Le bouton, la liste, l'animation, le formulaire.

**Une journée type** :
```
09h00  Reunion avec l'equipe design : les maquettes Figma sont pretes
09h30  Implementation d'un nouveau composant React (formulaire de connexion)
11h00  Bug : le layout explose sur mobile Samsung Galaxy S22 -> debogage CSS
12h00  Code review : il relit le code d'un collegue, laisse des commentaires
14h00  Integration d'une API backend : fetch des donnees utilisateur
16h00  Optimisation : reduction du bundle, lazy loading des images
17h30  Deploiement sur la branche de staging pour validation
```

**Technologies typiques** :
```
Obligatoire  :  HTML, CSS, JavaScript, TypeScript
Frameworks   :  React, Vue, Angular, Svelte
Outils       :  Webpack/Vite, Git, npm/yarn, Chrome DevTools
Tests        :  Jest, Vitest, Playwright, Cypress
Styles       :  Tailwind CSS, CSS Modules, Styled Components
Etat global  :  Redux, Zustand, Pinia, Jotai
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

**Compétences clés** : maitrise du DOM et des événements browser, responsive design et accessibilité (WCAG), optimisation des performances (Core Web Vitals), compréhension des API REST et GraphQL, collaboration avec les designers via Figma.

>  **Tip méconnu** : un bon frontend dev en 2026 comprend le réseau. Il sait pourquoi une page charge lentement, ce qu'est un cache HTTP, et comment un CDN fonctionne. Pas juste "faire joli".

---

#### Backend Developer

**En une phrase** : il construit le moteur. La logique métier, les APIs, les bases de données, la sécurité des données.

**Une journée type** :
```
09h00  Review des logs de prod : y'a eu une erreur 500 a 3h du matin
09h30  Debogage : une requete SQL non optimisee qui bloquait toute la base
11h00  Implementation d'un nouvel endpoint : POST /api/v2/orders
13h30  Ecriture des tests unitaires pour la logique de paiement
15h00  Discussion architecture : comment gerer 10x plus de requetes
16h30  Documentation de l'API dans Swagger/OpenAPI
17h30  Code review et merge de deux pull requests
```

**Technologies typiques** :
```
Langages         :  Node.js (JS/TS), Python, Java, Go, C#, PHP, Rust
Frameworks       :  Express, Fastify, FastAPI, Spring Boot, Gin, Laravel
Bases de donnees :  PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch
Outils           :  Docker, Git, Postman, Swagger
Cloud            :  AWS/GCP/Azure (basiques)
```

**Exemple: le quotidien du backend dev :**

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
  // cache le résultat 60s pour pas bruler la base
  // log la requete pour le monitoring
  // gère 14 cas d'erreur differents
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
NATIF                           CROSS-PLATFORM
::::::::::::::::::::::          ::::::::::::::::::::::::
iOS Dev      Android Dev        Flutter Dev   React Native Dev
  Swift        Kotlin             Dart              JS/TS
  SwiftUI      Jetpack Compose    Flutter           RN Components
  Xcode        Android Studio     Pub packages      npm packages
  TestFlight   Firebase Test Lab  Firebase          Firebase
```

**Différences réelles** :

```
CRITERE                  NATIF              CROSS-PLATFORM
::::::::::::             :::::::            ::::::::::::::::
Performance              Maximale           Tres bonne
Acces hardware           Complet            Partiel
Une seule codebase       Non                Oui
Vitesse de dev           Plus lent          Plus rapide
Rendu UI                 100% natif         Quasi-natif (Flutter)
Marche emploi            Large              En forte croissance
```

**Une journée type (Flutter Dev)** :
```
09h00  Fix layout : debordement sur petits ecrans
10h30  Notifications push avec Firebase Cloud Messaging
12h30  Discussion architecture des states (Bloc vs Riverpod)
14h00  Tests sur appareils physiques et simulateurs
15h30  Optimisation : temps de demarrage de 2s -> 0.8s
17h00  Publication beta sur le Play Store via Fastlane
```

---

#### Full-Stack Developer

**En une phrase** : il peut construire le frontend ET le backend. Pas forcément expert dans les deux : mais opérationnel partout.

```
        FULL-STACK DEV
        ____________
       |            |
   Frontend      Backend
   React/TS      Node.js
   Next.js       PostgreSQL
   Tailwind      Supabase
       |____________|
             |
          Deploie lui-meme sur Vercel + Railway
```

**Exemple : la réalité d'un full-stack dans une startup :**

```javascript
// Lundi : "t'es full-stack non ? Tu peux aussi jeter un oeil au DevOps ?"

// Mardi matin
git commit -m "fix: bug critique en prod qui crashait 50% des users"

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
LE MONDE AVANT DEVOPS         LE MONDE AVEC DEVOPS
:::::::::::::::::::           ::::::::::::::::::::
Dev : "mon code marche        Dev + Ops travaillent
  en local, c'est bon"        ensemble depuis le debut
Ops : "ton truc plante        Pipeline CI/CD automatise
  en prod, pas mon            Monitoring en temps reel
  probleme"                   Infrastructure as Code
  -> les deux se detestent    -> les deux se comprennent
```

**Technologies typiques** :
```
Conteneurs      :  Docker, Kubernetes, Helm
CI/CD           :  GitHub Actions, GitLab CI, Jenkins, CircleCI
Cloud           :  AWS, GCP, Azure (expert level)
IaC             :  Terraform, Ansible, Pulumi
Monitoring      :  Prometheus, Grafana, Datadog, PagerDuty
Scripting       :  Bash, Python, Go
```

Ce qu'il fait vraiment : écrire les pipelines de déploiement, configurer les serveurs sans les toucher à la main (Infrastructure as Code), répondre aux alertes de production à 3h du matin (rotation d'astreinte, c'est réel), maintenir 99.99% de disponibilité.

> **SRE** est la version formalisée par Google. Même idée, mais avec plus d'ingénierie et moins de "ops" pur.

---

#### Data Engineer

**En une phrase** : il construit les tuyaux par lesquels les données circulent.

```
DONNEES BRUTES  ->  DATA ENGINEER  ->  DONNEES PROPRES ET ACCESSIBLES
(logs, APIs,        (construit les      (Data Scientists, analystes,
 bases, fichiers)    pipelines ETL)      ML models peuvent travailler)
```

**Technologies typiques** :
```
Langages      :  Python, SQL, Scala
Frameworks    :  Apache Spark, Apache Kafka, dbt, Airflow
Cloud         :  BigQuery, Snowflake, Redshift, AWS S3
Orchestration :  Apache Airflow, Prefect, Dagster
```

> Ne pas confondre avec : Data Scientist (qui analyse les données) ou ML Engineer (qui entraîne des modèles). Le Data Engineer construit l'infrastructure qui rend tout ça possible. Il est le plombier — invisible quand tout va bien, indispensable quand les tuyaux fuient.

---

#### Machine Learning / AI Engineer

**En une phrase** : il entraîne, déploie et maintient des modèles d'intelligence artificielle.

```
ML ENGINEER vs DATA SCIENTIST
::::::::::::::::::::::::::::::::::::::::::::::
Data Scientist  :  explore les donnees, teste des hypotheses,
                   "ca marche sur mon ordi en Jupyter Notebook"
ML Engineer     :  prend le modele et le rend utilisable en production :
                   API rapide, scalable, mise a jour auto,
                   monitoring du modele en temps reel
```

**Technologies typiques** :
```
Langages      :  Python (exclusivement ou presque)
Frameworks ML :  PyTorch, TensorFlow, JAX, scikit-learn
Serving       :  FastAPI, Triton Inference Server, TorchServe
MLOps         :  MLflow, Weights & Biases, DVC, Kubeflow
Cloud ML      :  SageMaker (AWS), Vertex AI (GCP), Azure ML
LLMs/Agents   :  Hugging Face, LangChain, LlamaIndex
```

---

#### Security Engineer

**En une phrase** : il cherche les failles avant que quelqu'un de malveillant les trouve.

```
DEFENSIVE (Blue Team)          OFFENSIVE (Red Team / Pentester)
:::::::::::::::::::            ::::::::::::::::::::::::::::::::::
Construit des defenses         Attaque les systemes de l'entreprise
Audit et hardening             Avec autorisation (pour trouver les failles)
SIEM, IDS/IPS                  Kali Linux, Metasploit, Burp Suite
Reponse aux incidents          CVE, exploits, social engineering
SOC (Security Operations)      Rapport de vulnerabilites
```

Les security engineers sont parmi les mieux payés de l'industrie. La demande explose. L'offre de profils qualifiés reste très faible.

---

### Les rôles d'évolution de carrière

> *"Dans 10 ans, je suis encore en train d'écrire des boucles for dans mon coin ?"*

```
ANNEE 1-3       ANNEE 3-6        ANNEE 6-10       ANNEE 10+
:::::::::       :::::::::        ::::::::::::     ::::::::::::
Junior Dev  ->  Mid-Level Dev -> Senior Dev   ->  Principal / Staff
                                     |
                               Tech Lead
                               (leadership technique)
                                     |
                         ____________|______________
                        |                           |
                 Software Architect          Engineering Manager
                 (decisions techniques)      (gestion d'equipe)
                        |                           |
                        |___________________________|
                                     |
                                    CTO
                             (directeur technique)
                                    ou
                            Freelance / Entrepreneur
```

---

#### Junior Developer (0-2 ans)

```
CE QU'ON ATTEND                      CE QU'ON N'EXIGE PAS ENCORE
::::::::::::::::::::::               :::::::::::::::::::::::::::::::
Livrer des features simples          Concevoir une architecture from scratch
Apprendre vite                       Gerer la dette technique
Ecrire du code lisible et teste      Mentorer d'autres personnes
Ne pas bloquer l'equipe
```

---

#### Mid-Level / Senior Developer (3-8 ans)

La vraie différence entre junior et senior, ce n'est pas le nombre de langages connus.

```
JUNIOR                          SENIOR
::::::::::::::                  :::::::::::::::
"Comment je code ca ?"          "Pourquoi on code ca ?"
Resout les problemes            Anticipe les problemes
Suit les decisions              Influence les decisions
Code d'abord, design ensuite    Design d'abord, code ensuite
Connait les outils              Comprend les trade-offs
Cherche LA meilleure solution   Cherche LA BONNE solution dans CE contexte
```

Un senior sait surtout dire **non** : "non, ce pattern va créer de la dette technique dans 6 mois. Voilà pourquoi et voilà comment faire autrement."

---

#### Software Architect

Il dessine le plan d'ensemble. Comment les systèmes communiquent. Quels patterns utiliser. Comment le système tiendra dans 5 ans.

```
L'ARCHITECTE NE CODE PAS TOUT.
Il decide :
  - Microservices ou monolithe ?
  - Event-driven ou REST ?
  - Quelle base de donnees pour quel cas d'usage ?
  - Comment garantir la resilience si un service tombe ?
  - Comment securiser les echanges entre services ?
Et il doit CONVAINCRE son equipe que ses choix sont les bons.
```

> Les meilleurs architectes continuent de mettre les mains dans le code régulièrement. Sinon ils perdent le contact avec la réalité : et ça se voit vite dans les décisions qu'ils prennent.

---

#### Tech Lead

Rôle hybride : il code toujours, mais il guide aussi l'équipe.

```
RESPONSABILITES TECH LEAD
::::::::::::::::::::::::::::::::::
Technique   :  Architecture des features, code reviews, standards de code,
               choix des outils, performance, securite
Humain      :  Mentorer les juniors, debloquer les collegues,
               coordination avec les PMs, estimation des taches
Relation    :  Interface entre l'equipe technique et les non-techniques
               (CEO, PO, clients)
```

---

#### Engineering Manager

Il a arrêté (ou presque) de coder. Son rôle : faire en sorte que son équipe soit heureuse, productive, et livre bien.

```
ENGINEERING MANAGER  =/=  TECH LEAD
Engineering Manager  :  "Mon job c'est que les gens dans mon equipe evoluent,
                         soient motives et livrent bien. Je m'occupe des 1:1,
                         des recrutements, des conflits, de la roadmap."
Tech Lead            :  "Mon job c'est que les decisions techniques soient
                         les bonnes et que le code soit propre."
Un seul peut faire les deux. Mais c'est epuisant. Les grandes boites separent les roles.
```

---

#### CTO (Chief Technical Officer)

```
CTO STARTUP (5-20 personnes)        CTO SCALE-UP (200+ personnes)
::::::::::::::::::::::::            ::::::::::::::::::::::::::::::
Code encore beaucoup                Code rarement ou jamais
Recrute les premiers ingenieurs     Gere des VP Engineering
Choisit la stack initiale           Definit la vision tech a 3 ans
Parle aux investisseurs             Represente la tech au board
```

---

#### Freelance / Entrepreneur Tech

```
FREELANCE                           ENTREPRENEUR TECH
:::::::::::::                       ::::::::::::::::::::
Clients varies                      Tu construis ton propre produit
Tu fixes tes tarifs                 Tu vises un marche
Flexibilite totale                  Risque financier reel
Revenus variables                   Si ca marche : gros upside
Pas de manager                      Tout repose sur toi au debut
Gestion admin seul                  Potentiellement CTO de ta propre boite
```

Un freelance senior peut facturer des clients européens ou américains à des tarifs occidentaux, depuis n'importe quel pays. C'est l'un des leviers les plus puissants du développement en 2026.

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

#### Web :

Le domaine le plus accessible, le plus vaste, et le plus employant. Des milliers de frameworks. Des millions d'offres dans le monde.

Technologies : HTML, CSS, JS/TS, React, Next.js, Vue, Node.js, PostgreSQL. Ce qui différencie les tops : performance, accessibilité, architecture front, SEO technique. Sous-spécialisations : e-commerce, SaaS, apps temps réel (websockets), PWA.

---

#### Mobile :

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

Technologies : Solidity (Ethereum), Rust (Solana), Go. Le marché suit les cycles crypto. En 2021 c'était le El Dorado. En 2023 ça s'est effondré. En 2024-2026 ça remonte. Risqué comme pari de carrière à long terme.

---

### Comment choisir sa spécialisation intelligemment ?

> *"Si tu entres dans un donjon au hasard, t'as peut-être choisi celui qui donne sur une décharge. Voilà comment choisir le bon couloir."*

```
ETAPE 1 : COUPE CE QUI TE DEPLAIT VRAIMENT
  Tu detestes les maths pousses ?              -> elimine IA/ML et Systemes
  Tu veux voir des resultats visuels vite ?    -> garde Web et Mobile
  Tu adores comprendre "comment ca marche" ?   -> Cloud, Securite, Systemes

ETAPE 2 : CROISE AVEC LE MARCHE LOCAL + REMOTE
  Offres d'emploi dans ta ville ?   -> regarde LinkedIn, Indeed, Upwork
  Travail remote ?                  -> Web, Cloud, IA, Mobile = les plus remote-friendly
  Freelance ?                       -> Web et Mobile = les plus faciles a vendre

ETAPE 3 : EVALUE LA DUREE D'APPRENTISSAGE
  Employable en 6-12 mois ?   -> Web, Mobile (Flutter/RN)
  Employable en 1-2 ans ?     -> Backend fort, DevOps, Data
  Employable en 2-4 ans ?     -> IA/ML, Cybersecurite, Systemes

ETAPE 4 : TESTE AVANT DE T'ENGAGER
  Fais un mini-projet de 2-4 semaines dans chaque specialisation qui t'attire.
  Laquelle te donnait envie de continuer le soir, meme sans obligation ?
  Celle-la, c'est la tienne.
```

---

### Ce qui différencie un dev moyen d'un excellent dev

> *"La plupart des devs savent coder. Les bons devs savent résoudre des problèmes. Les excellents devs savent résoudre les bons problèmes."*

```
DEV MOYEN                              DEV EXCELLENT
::::::::::::::::::                     ::::::::::::::::::::::
Copie/colle sans comprendre            Comprend ce qu'il colle
Connait le langage                     Comprend le systeme
"Est-ce que ca fonctionne ?"           "Est-ce que c'est maintenable ?"
Peur du code des autres                Lit le code des autres avec curiosite
Evite les sujets inconnus              Plonge dans les sujets inconnus
Ne teste que le "happy path"           Teste les edge cases
Reflechit en features                  Reflechit en systemes
```

**Les compétences qui créent la différence :**

**1. Algorithmique et structures de données**
```
Savoir utiliser une liste c'est bien.
Savoir POURQUOI tu choisis une HashMap plutot qu'une liste dans CE cas precis,
c'est autre chose.
Complexite O(n), O(log n), O(1) : ca devient tres concret quand t'as
10 millions d'enregistrements et que la requete prend 12 secondes.
```

**2. Clean Code**

```javascript
// Dev moyen : ca marche, personne sait pourquoi, personne ose y toucher
function f(x, y, z) {
  if (z === 1) return x * 1.1
  if (z === 2) return x * 1.2
  return x + y
}

// Dev excellent : ca se lit comme une phrase
const TAX_RATES = {
  reduced: 1.10,
  standard: 1.20,
}

function calculateTotalPrice(basePrice, shippingCost, taxType) {
  // si le type de taxe existe, on l'applique. sinon, on ajoute juste les frais de port.
  const rate = TAX_RATES[taxType]
  return rate ? basePrice * rate : basePrice + shippingCost
}

// Six mois plus tard, un nouveau dev lit ca et comprend en 10 secondes.
// Avec la version f(x, y, z), il allait pleurer.
```

**3. Design Patterns**

Les patterns sont des solutions documentées à des problèmes récurrents. Savoir quand les appliquer : et surtout quand les éviter te fait passer un cap.

```javascript
// Exemple du pattern Observer : le meme principe que les EventListeners que tu connais
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

bus.on('pizza:commandee', ({ saveur }) => {
  console.log(`Le four se prepare pour une pizza ${saveur}`)
})

bus.on('pizza:commandee', ({ client }) => {
  console.log(`SMS envoye a ${client} : votre pizza est en preparation`)
})

bus.emit('pizza:commandee', { saveur: 'Regina', client: 'Bob' })
// -> Le four se prepare pour une pizza Regina
// -> SMS envoye a Bob : votre pizza est en preparation
// Chaque partie du systeme reagit sans se connaitre. C'est ca le pattern Observer.
```

Les patterns les plus utiles en pratique :
```
Singleton   : une seule instance dans toute l'app (ex: connexion DB)
Observer    : notifier des objets quand un etat change (ex: React re-render)
Factory     : creer des objets sans specifier leur classe exacte
Repository  : couche d'abstraction entre logique metier et base de donnees
Strategy    : changer un algorithme a l'execution sans modifier le code appelant
Adapter     : brancher une interface incompatible sur une autre
```

**4. Compréhension des systèmes**

Un excellent dev comprend ce qui se passe au-delà de son code : comment fonctionne le réseau (TCP/IP, HTTP, DNS), la mémoire (stack vs heap, garbage collector), le système de fichiers, un OS (processus, threads, signaux), une base de données en dessous (B-trees, ACID).

>  **Livre de référence** : *Designing Data-Intensive Applications* de Martin Kleppmann. Si t'en lis un seul dans ta carrière, c'est celui-là.

**5. Architecture logicielle**

```javascript
// Les trois questions d'un dev qui pense architecture

// 1. "Comment ce code va evoluer dans 6 mois ?"
// Si la reponse c'est "on va devoir tout recrire", c'est un signal.

// 2. "Si cette partie tombe en panne, qu'est-ce qui casse autour ?"
// Un systeme bien architecturé a des points de defaillance isoles.
// Un systeme mal architecturé : tout tombe en meme temps.

// 3. "Comment un nouveau dev comprend ce systeme en 30 minutes ?"
// Si t'es le seul a pouvoir expliquer comment ca marche,
// c'est pas de la valeur. C'est un risque.
```

---

### La carrière réaliste sur 10-15 ans

```
ANNEES 1-2 : LE DEBROUSSAILLAGE
  Tu apprends vite mais tu casses aussi vite.
  Chaque semaine tu decouvres que tu ne sais pas quelque chose.
  C'est normal. C'est comme ca pour tout le monde.
  Objectif : livrer de la valeur, apprendre les bases du travail en equipe.
  Erreur classique : vouloir tout apprendre en meme temps -> epuisement.

ANNEES 3-5 : L'AUTONOMIE
  Tu livres sans supervision constante.
  Tu commences a avoir des opinions sur les choix techniques.
  Tu peux concevoir une feature de A a Z.
  Objectif : developper ta specialite et ta reputation.
  Erreur classique : rester en confort zone, eviter les projets complexes.

ANNEES 5-8 : L'IMPACT
  Ton code affecte des equipes entieres.
  Tu mentores des juniors (naturellement, pas encore par obligation).
  Tu vois les patterns des projets qui reussissent ou echouent.
  Objectif : choisir entre technique pure (architect/principal) ou leadership.
  Erreur classique : prendre un role manager parce que "c'est la promotion normale"
                     sans vraiment vouloir gerer des gens.

ANNEES 8-15 : LA FORCE TRANQUILLE
  Tu n'as plus a prouver que tu sais coder.
  Tu resous des problemes organisationnels autant que techniques.
  Tu as un reseau solide dans l'industrie.
  Objectif : impact a grande echelle, ou independance (freelance/startup).
  Erreur classique : se reposer sur ses lauriers, arreter d'apprendre.
```

**Les erreurs à éviter tôt dans la carrière** :

```
ERREUR                                  POURQUOI C'EST GRAVE
::::::::::::::::::::::                  ::::::::::::::::::::::::::::::::::::::::
Ignorer Git (juste "git push")          Tu vas perdre du travail ou bloquer l'equipe
Ne jamais lire le code des autres       Tu reinventes constamment la roue
Eviter les tests unitaires              Ta dette technique explose en 6 mois
Technologie d'abord, probleme apres     Tu suringenieres tout
Aucune documentation                    Le toi de dans 6 mois te deteste
Travailler en silos                     Tu bloques ta propre progression

LA CORRECTION
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
-> Apprends Git en profondeur, pas juste les commandes de base
-> Passe du temps sur des projets open source, lis du code existant
-> Integre les tests des le debut, meme basiques
-> Commence toujours par comprendre le probleme avant de choisir l'outil
-> Documente les decisions importantes au moment ou tu les prends
-> Code review, collaboration, communication : ca compte autant que le code
```

---

### Les compétences qui restent valides toute une vie

> *"Les frameworks meurent. Les langages évoluent. Certaines choses, jamais."*

```
+------------------------------------------------------------------+
|          COMPETENCES FONDAMENTALES UNIVERSELLES                  |
+------------------------------------------------------------------+
|                                                                  |
|  1. PENSEE ALGORITHMIQUE                                         |
|     Decomposer un probleme complexe en sous-problemes simples    |
|     et les resoudre methodiquement.                              |
|     Valide en 1975. Valide en 2026. Valide en 2060.              |
|                                                                  |
|  2. STRUCTURES DE DONNEES                                        |
|     Tableaux, listes liees, arbres, graphes, hash maps.          |
|     Inventees dans les annees 60. N'ont pas change.              |
|     Ne changeront pas.                                           |
|                                                                  |
|  3. RESEAUX ET WEB                                               |
|     HTTP, TCP/IP, DNS, TLS. Comment les donnees voyagent.        |
|     C'est la plomberie de l'internet. Ca dure.                   |
|                                                                  |
|  4. CODE PROPRE                                                  |
|     Nommer correctement, structurer logiquement, commenter       |
|     ce qui n'est pas evident. Un humain qui lit ton code         |
|     doit comprendre sans te demander.                            |
|                                                                  |
|  5. DEBOGAGE SYSTEMATIQUE                                        |
|     Pas juste Google l'erreur. Comprendre POURQUOI ca casse.     |
|     Hypothese -> test -> resultat -> hypothese suivante.         |
|                                                                  |
|  6. BASES DE DONNEES RELATIONNELLES                              |
|     SQL existe depuis 1974. Il sera encore la dans 30 ans.       |
|     Modeliser des donnees, ecrire des requetes efficaces,        |
|     comprendre les transactions ACID.                            |
|                                                                  |
|  7. SECURITE DE BASE                                             |
|     XSS, injection SQL, CSRF, authentification, chiffrement.     |
|     Les vecteurs d'attaque changent. Les principes, non.         |
|                                                                  |
|  8. COMMUNICATION TECHNIQUE                                      |
|     Expliquer une decision technique a quelqu'un qui ne code     |
|     pas. Ecrire un bon README. Donner une bonne code review.     |
|     Presenter une architecture clairement.                       |
|                                                                  |
|  9. APPRENTISSAGE EN CONTINU                                     |
|     Les devs qui prosperent ne savent pas tout.                  |
|     Ils savent apprendre vite. Un nouveau framework en           |
|     2 semaines si les fondations sont solides.                   |
|                                                                  |
|  10. SYSTEMES DISTRIBUES (bases)                                 |
|      Latence, consistance, disponibilite, partitionnement.       |
|      Le theoreme CAP. Ce que veut dire "scalable".               |
|      De plus en plus d'apps tournent sur le cloud.               |
|      Ces concepts s'appliquent partout.                          |
|                                                                  |
+------------------------------------------------------------------+
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
PAYS                 NIVEAU     SALAIRE ANNUEL ($)
::::::::::::         :::::::    ::::::::::::::::::
Etats-Unis           Junior     70 000 –  90 000 $
                     Senior    170 000 – 225 000 $

Europe (FR / DE)     Junior     50 000 –  75 000 $
                     Senior     75 000 – 100 000 $

Royaume-Uni          Senior     90 000 – 100 000 $

Inde                 Junior     10 000 –  15 000 $
                     Senior     20 000 –  55 000 $

Afrique du Sud       Junior     18 000 –  26 000 $
                     Senior     40 000 –  60 000 $

Madagascar           Junior     ~5 400 $ / an (marche local)
(exemple local)      Senior     ~22 000 $ / an (marche local)
                     Realite    souvent 1 300 – 4 000 $ / an sur le terrain
```

> Ces chiffres reflètent le marché **local** de chaque pays. La colonne "remote" ci-dessous est une autre histoire.

---

### Madagascar : la réalité brute

Pris comme exemple concret d'un marché local en pays émergent : parce que le contraste avec le remote est particulièrement parlant.

```
MARCHE LOCAL
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Realite terrain     :  ~110 000 – 333 000 $ eq. / an
                       (ce que beaucoup touchent vraiment : bien moins)

Junior "officiel"   :  ~5 400 $ / an

Senior reconnu      :  ~22 000 $ / an
```

Le même profil, le même ordinateur, les mêmes compétences : mais des revenus sans commune mesure selon le marché visé.

---

### Le vrai levier : le remote

C'est la ligne qui change tout. Un dev qui travaille pour des clients étrangers depuis son pays ne joue plus dans la même catégorie salariale.

```
SALAIRES REMOTE (depuis n'importe quel pays a cout de vie bas)
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Junior remote   :   20 000 –  35 000 $ / an
Mid remote      :   40 000 –  65 000 $ / an
Senior remote   :   70 000 – 100 000 $ / an
```

```
COMPARAISON ILLUSTREE (exemple Madagascar, applicable partout)
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Dev local junior       :    5 400 $ / an
Dev remote junior      :   20 000 $ / an    -> ratio x3,7

Dev local senior       :   22 000 $ / an
Dev remote senior      :   80 000 $ / an    -> ratio x3,6

Dev remote mid         :   40 000 $ / an
vs dev local senior    :   22 000 $ / an    -> ratio x1,8
                           (avec moins d'experience requise)
```

La question n'est donc pas "quel métier choisir". La question est "comment accéder au marché remote ?"

---

### Les stacks qui paient le plus en remote (2026)

```
STACK / SPECIALISATION                    SALAIRE REMOTE MOYEN (global)
::::::::::::::::::::::::::::::            :::::::::::::::::::::::::::::
AI / ML Engineer                          126 000 – 190 000 $ / an
  Python + PyTorch/TF + MLOps

Cloud / DevOps                            121 000 – 180 000 $ / an
  AWS/GCP + Kubernetes + Terraform

Security Engineer                          90 000 – 170 000 $ / an
  reseaux + pentest + SIEM

Full-Stack senior                          90 000 – 165 000 $ / an
  React/TS + Node.js

Backend fort                               85 000 – 160 000 $ / an
  Go / Rust / Java + systemes distribues

Mobile senior                              70 000 – 130 000 $ / an
  Flutter / React Native

Frontend senior                            71 000 – 120 000 $ / an
  React/Next.js + TypeScript + perf
```

> Les certifications cloud (AWS, GCP, Azure) ajoutent en moyenne **20 000 – 40 000 $** au salaire. C'est documenté sur l'ensemble du marché remote 2025-2026 : pas une légende.

---

### Les 10 pays qui recrutent le plus de devs remote

```
RANG   PAYS              REGION            POURQUOI ILS RECRUTENT
::::   ::::              ::::::            ::::::::::::::::::::::::::::::::::::
 1     Etats-Unis         Amerique du Nord  Volume massif de startups et scale-ups.
                                            Manque chronique de devs locaux.
                                            Le remote est le standard depuis 2020.

 2     Allemagne          Europe            Berlin = hub tech europeen.
                                            Forte demande en backend, data, IA.
                                            Moins de devs locaux qu'aux US.

 3     Royaume-Uni        Europe            Fintech, SaaS, medtech.
                                            Remote bien etabli post-pandemic.

 4     Canada             Amerique du Nord  Hubs Toronto et Vancouver.
                                            Timezone proche des US. Tres remote-friendly.

 5     Australie          APAC              Fintech + e-commerce en hausse.
                                            Manque de devs locaux qualifies.

 6     Pays-Bas           Europe            Amsterdam = hub IA et SaaS.
                                            Tres ouverts aux devs internationaux.

 7     France             Europe            Startups (Doctolib, Leboncoin, Datadog).
                                            Remote en forte hausse depuis 2022.

 8     Singapour          APAC              Fintech + gouvernance tech.
                                            Passerelle Asie du Sud-Est.

 9     Suede / Danemark   Europe du Nord    Salaires eleves. Remote bien integre.
                                            Focus fort sur qualite du code.

10     Israel             Moyen-Orient      Tech tres dense. Startups en cybersec, IA.
                                            Recrutent sur le marche global.
```

> Les plateformes pour commencer : **Upwork**, **Toptal**, **Malt** (France/Europe), **LinkedIn**, **Remote.com**, **Arc.dev**. La langue qui ouvre le plus de portes : l'anglais. La deuxième : le français pour l'Europe.

---

### La conclusion :

```
+----------------------------------------------+
|                                              |
|         MEMES COMPETENCES                   |
|                                              |
|   marche local       vs       remote         |
|                                              |
|   salaire de base         x3 a x10           |
|                                              |
|   (le meme dev, le meme ordi, la meme code)  |
|                                              |
+----------------------------------------------+
```

La différence entre ces deux colonnes tient à une seule chose : l'accès au marché.

Et ça se construit. Un portfolio sur GitHub. Un profil LinkedIn en anglais. Une ou deux missions sur Upwork. Une réputation. Ça prend du temps : mais c'est linéaire, pas magique.

```javascript
// La carrière remote, vue comme un algorithme

function construireCarriereRemote(dev) {
  const etapes = [
    "portfolio GitHub avec 3 projets propres et documentés",
    "profil LinkedIn en anglais avec les bons mots-clés",
    "premiere mission Upwork (peu importe le tarif, c'est pour les reviews)",
    "deuxieme mission avec un vrai tarif",
    "reputation construite -> les clients viennent vers toi",
  ]

  for (const etape of etapes) {
    dev.faire(etape)  // pas de raccourci, pas de magie
  }

  return dev.salaire * 3  // minimum
}

// La seule variable : a qui tu factures.
```

> *"Un dev peut gagner 5 000 $ / an. Le même dev, avec les mêmes compétences, peut gagner 80 000 $ / an. La seule variable, c'est à qui il facture."*

> *_Les salaires sont indicatifs et varient selon le pays, l'entreprise et l'expérience.*_
