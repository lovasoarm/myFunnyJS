---
perennite: evolutif
stability: moderne
duree_de_vie_estimee: 3-5 ans
raison: Menaces évoluent, principes (least privilege, defense in depth) éternels.
---
> **Statut de pérennité :** intemporel | **évolutif** | périssable
> Statut effectif de ce module : **évolutif**. Intemporel = mécanisme de fond (à mémoriser à vie). Évolutif = pratique métier qui bouge (relire tous les 2-3 ans). Périssable = dépend d'une version/vendor (relire tous les 12-18 mois).

> **CE MODULE RÉUTILISE** : input validation (05_error_handling), HTTP (17_web_concepts). Si un de ces prérequis est flou, retourne le voir avant. Ce module ne les réexplique pas.

# POURQUOI CE MODULE MÉRITE TON TEMPS : SECURITY

> **Durée de vie : 5+ ans.** Barème : intemporel = mécanisme de fond (runtime, mémoire, algo, architecture) ; 5+ ans = pratique métier stable ; 2-3 ans, revenir en 2028 = outils IA / stack en mouvement.

Temps de lecture ~8 min

Tu n'as pas besoin d'être attaqué par un hacker en cagoule dans un sous-sol. Il suffit d'un script automatisé qui scanne le web 24/7 à la recherche de failles connues, et qui tombe sur ton input non sanitisé (nettoyé/validé). Tu ne te fais pas hacker parce que tu es une cible importante. Tu te fais hacker parce que ton code laissait la porte ouverte.

La sécurité n'est pas une feature qu'on ajoute à la fin. C'est une discipline qu'on applique à chaque ligne qui touche à une donnée venant de l'extérieur.

---

## 1) LE PROBLÈME QUE ÇA RÉSOUT

Chaque point où ton code accepte une donnée externe (input utilisateur, paramètre d'URL, header de requête, fichier uploadé) est une porte d'entrée potentielle pour une attaque. Sans discipline de sécurité, ces portes restent ouvertes : un input non échappé permet d'injecter du JavaScript malveillant dans ta page (XSS : Cross-Site Scripting), une requête SQL construite par concaténation de strings permet d'injecter des commandes SQL arbitraires, un mot de passe stocké en clair devient un cadeau immédiat pour quiconque accède à ta base de données.

Ce module couvre les attaques les plus fréquentes et leurs défenses concrètes : XSS et injection SQL (les deux vulnérabilités qui touchent le plus d'applications en prod), CSRF et CORS (deux mécanismes liés à l'origine des requêtes, souvent confondus, mal compris), la pollution de prototype (modifier `Object.prototype` depuis un input utilisateur, ce qui peut casser TOUT le comportement de l'application), les différents modèles d'authentification (OAuth, sessions, JWT), et le hachage sécurisé des mots de passe avec bcrypt.

La checklist OWASP (Open Web Application Security Project : organisation de référence en sécurité web) résume les 10 vulnérabilités les plus fréquentes, et ce module les couvre directement parce que ce sont, statistiquement, les failles qui causent la majorité des incidents de sécurité réels.

---

## 2) QUI SOUFFRE QUAND ÇA MANQUE

Le dev qui construit ses requêtes SQL par concaténation de strings (au lieu d'utiliser des requêtes paramétrées) ouvre la porte à une injection SQL où un attaquant peut littéralement lire, modifier, ou supprimer toute la base de données via un simple champ de formulaire mal protégé. C'est le scénario le plus radical : pas une fuite partielle, la base entière à la merci d'un seul champ mal protégé.

Le dev qui ne sécurise pas ses inputs ouvre la porte à des attaques XSS où un attaquant injecte un script qui s'exécute dans le navigateur d'une autre victime, volant potentiellement des cookies de session ou des données sensibles, sans même que la victime ne s'en rende compte.

L'entreprise entière souffre quand une fuite de données survient : au-delà des dommages techniques, c'est la confiance des utilisateurs, la réputation de la marque, et potentiellement des conséquences légales et financières lourdes, surtout si des données sensibles (mots de passe, informations personnelles) étaient stockées sans protection adéquate.

---

## 3) OÙ ÇA APPARAÎT DANS UN VRAI SYSTÈME

```
champ de texte affiché sans échappement         --> XSS        --> script malveillant exécuté chez la victime
requête SQL construite par concaténation         --> injection SQL   --> accès non autorisé à la DB
mot de passe stocké directement              --> pas de hashing   --> fuite catastrophique en cas de breach
requête cross-origin mal configurée             --> CORS       --> accès non désiré ou bloqué à tort
objet construit depuis un input JSON utilisateur        --> prototype pollution --> comportement global corrompu
```

La sécurité n'est jamais isolée dans un coin du système : elle traverse chaque frontière où une donnée externe entre dans ton application, ce qui veut dire qu'elle concerne potentiellement chaque fichier qui traite une requête utilisateur.

---

## 4) MODERNE, LEGACY, OU INTEMPOREL ?

Les principes fondamentaux (ne jamais faire confiance à une donnée externe, toujours valider et échapper, ne jamais stocker un secret en clair) sont intemporels. Ce qui évolue, c'est la sophistication des attaques et la liste précise des vulnérabilités les plus exploitées, d'où l'importance de suivre une référence vivante comme l'OWASP plutôt qu'une liste figée apprise une seule fois.

---

## 5) CE QUI A CHANGÉ AU FIL DES ANNÉES

Avant, beaucoup de frameworks laissaient les devs gérer eux-mêmes l'échappement des inputs, ce qui menait à des oublis fréquents et des XSS répandus. Les frameworks modernes (React, par exemple) échappent automatiquement le contenu par défaut, ce qui réduit drastiquement la surface d'attaque XSS, sauf quand un dev contourne volontairement cette protection (avec `dangerouslySetInnerHTML` par exemple, dont le nom même est un avertissement explicite).

Le hachage des mots de passe a aussi mûri : des algorithmes plus anciens et plus faibles (MD5, SHA-1 utilisés seuls) ont été remplacés par des algorithmes spécifiquement conçus pour le hachage de mots de passe comme bcrypt ou Argon2, qui intègrent volontairement un coût de calcul élevé pour ralentir les attaques par force brute.

---

## 6) NOYAU DUR DU MÉTIER ?

Prérequis direct et explicite : `22_security`, prérequis `21_api_craft` + `17_web_concepts`. Impossible de sécuriser une API sans déjà savoir la construire correctement et comprendre les mécanismes du web sous-jacents (CORS, headers, authentification). C'est aussi un module central du mini-projet `05_prison_break_api`, où la sécurité n'est pas un bonus mais une condition de survie du système face à des tentatives d'intrusion simulées.

---

## 7) POURQUOI ÇA MÉRITE ENCORE TON TEMPS DANS 5 ANS

Les attaques évoluent, mais le besoin de penser sécurité à chaque frontière de donnée externe ne disparaîtra jamais : c'est même de plus en plus critique à mesure que les systèmes se connectent entre eux et exposent plus de surface d'attaque. Un dev qui pense sécurité par défaut, plutôt qu'en réaction à un incident, reste une ressource rare et précieuse dans n'importe quelle équipe, peu importe la stack technique du moment.

---

## CE QUE TU DOIS RETENIR AVANT D'OUVRIR LE CHAPITRE 01

Chaque donnée externe que ton code accepte est une porte d'entrée potentielle, et la sécurité n'est jamais un détail qu'on rajoute après coup. Ça casse de quatre façons sans cette discipline : XSS, injection SQL, mots de passe en clair, pollution de prototype. Ces principes ne se démodent jamais, même si les attaques précises évoluent.

Maintenant, ouvre `01_xss_injection.md`. Et arrête de faire confiance à n'importe quelle donnée qui vient de l'extérieur.

> Ce module réutilise : l'API craft du module 21 (`21_api_craft`), la gestion d'erreurs du module 05 (`05_error_handling`).

---

## AILLEURS QUE JS

Ce que tu apprends ici n'est pas JS-spécifique :

- **Python / Java / Go / Rust** partagent 90 % de ces mécanismes (allocation
  heap vs stack, contention, backpressure, isolation runtime).
- Le vocabulaire change (`GIL` en Python, `goroutine` en Go, `borrow checker`
  en Rust), le mécanisme sous-jacent reste. Si tu comprends ici, tu portes
  ailleurs en 2 semaines de lecture ciblée.
- Test : explique à quelqu'un qui code Python ce que tu viens d'apprendre.
  Si tu peux, c'est acquis. Sinon, relis.
