---
stability: intemporel
---

# UNIVERS AUTORISÉS DANS MyFunnyJS

Temps de lecture ~3 min

> Le lint tourne en mode liste blanche stricte : tout univers cité dans un
> `.md` du repo qui n'apparaît pas ici fait échouer le lint. La charge de
> la preuve est sur l'ajout, pas sur l'interdiction.

## POURQUOI CE FICHIER EXISTE

Les analogies narratives sont un pilier pédagogique du curriculum : un concept compris vaut mieux que dix définitions mémorisées. Mais chaque univers cité est une propriété intellectuelle sous licence : les citer sans cadre ouvre un risque juridique réel, pas juste esthétique.

Le mode liste blanche coupe la dérive : plus de "je rajoute une petite blague One Piece dans la marge, personne verra". Si un univers n'est pas listé ici, il ne rentre pas.

---

## UNIVERS AUTORISÉS

| Univers                     | Statut                             | Justification                                                                                                        |
| --------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Naruto**                  | Autorisé, usage large               | Univers "de marque" du projet, référence culturelle massivement partagée par le public dev francophone. Fair use pédagogique, pas de reproduction d'œuvre, pas de merchandising. Toute citation est une analogie de mécanisme (chakra = mémoire, kage bunshin = fork, etc.) : pas un extrait, pas une image, pas de nom d'auteur. |
| **Dragon Ball Z**           | Autorisé, usage ciblé              | Même logique : analogie de mécanisme (kamehameha = charge asynchrone, Cell = accumulation d'états). Pas d'image, pas de dialogue reproduit.                                                                                            |
| **Garo : Honoo no Kokuin**  | Autorisé, usage ciblé              | Univers moins mainstream, mais lisible pour le lecteur cible. Analogies armor/makai/horror utilisées pour la persistance d'état, la corruption silencieuse, le poison lent.                                                          |
| **Attack on Titan**         | Autorisé, usage ciblé              | Analogies de siège, de mur, de contrôle de périmètre : utile pour architecture et sécurité. Pas d'image, pas de dialogue.                                                                                                            |
| **Walking Dead**            | Autorisé, usage limité             | AMC, propriété très protégée. Un seul mini-projet nommé (`03_walking_dead_protocol`) + citations isolées. À ne pas étendre : si l'usage explose au-delà, remplacer par un équivalent générique (zombie / apocalypse).                |
| **Prison Break**            | Autorisé, usage limité             | Un mini-projet nommé (`05_prison_break_api`) + citations isolées. Même logique de fair use pédagogique.                                                                                                                              |
| **Breaking Bad**            | Autorisé, usage limité             | AMC, mêmes précautions que Walking Dead. Analogies de contrôle qualité, chaîne d'approvisionnement, refactoring sous pression.                                                                                                       |
| **Banshee**                 | Autorisé, usage marginal            | Usage rare, analogie de dette technique / identité cachée.                                                                                                                                                                          |
| **Football (générique)**    | Autorisé, usage large               | Sport, pas de PI. Analogies tactiques (contre-attaque, pressing haut, milieu de terrain) libres d'usage.                                                                                                                            |
| **Country / Trap Soul / R&B** | Autorisé, usage générique          | Genres musicaux, pas de PI. Analogies de tempo, de couches, de production.                                                                                                                                                          |

---

## UNIVERS INTERDITS (liste noire explicite)

Ces univers ne doivent pas apparaître, même en marge, même en blague :

- **Star Wars** (Jedi, Sith, Skywalker) : Disney, agressif sur la marque.
- **One Piece** (Luffy, Zoro) : Shueisha, marque très active.
- **Bleach** (Ichigo Kurosaki) : Shueisha.
- **My Hero Academia / MHA** (Deku, All Might) : Shueisha.
- **Fortnite** (Battle Royale) : Epic Games.
- **Spider-Man / X-Men / Wolverine** : Marvel/Sony, extrêmement protégé.

Le lint bloque ces tokens même si un token de la whitelist apparaît à proximité.

---

## RÈGLE D'AJOUT

Ajouter un univers ici demande trois vérifications :

1. **L'analogie sert la compréhension**, pas le spectacle. Une analogie qui remplace l'explication technique au lieu de la renforcer est refusée.
2. **Pas de reproduction d'œuvre** : pas d'image, pas de dialogue reproduit, pas de logo, pas de nom d'auteur cité en signature. Uniquement des noms de personnages et des mécaniques narratives, en analogie de mécanismes techniques.
3. **Statut juridique documenté ici** : si tu ajoutes un univers, tu ajoutes une ligne au tableau ci-dessus avec la justification. Sinon le lint tombe.

---

## POUR L'APPRENANT

Tu n'as rien à faire avec ce fichier. Il existe pour que la voix pédagogique reste stable jusqu'en 2028 sans dérive. Continue à lire les modules : les analogies te servent à ancrer les concepts, pas à passer un examen de culture pop.
