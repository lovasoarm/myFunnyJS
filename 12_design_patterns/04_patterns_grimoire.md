# Page verrouillée
Temps de lecture ~8 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

# GRIMOIRE : DESIGN PATTERNS

Le vocabulaire de tout le module 12. Si un terme te bloque dans une leçon, il est ici.

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Design Pattern | Une solution réutilisable à un problème de structure de code qui revient souvent. | `// pattern = recette, pas copier-coller` (le pattern donne l'idée, pas le code exact à dupliquer) | un combo en jeu de combat appris par tous les joueurs / une formation tactique en foot |
| Factory | Une fonction qui crée des objets sans que l'appelant connaisse les détails de construction. | `const createNinja = (type) => ({ type, hp: 100 })` (on demande un ninja, on reçoit un objet prêt) | une académie ninja qui forme tous les genins / un centre de formation de club qui sort des joueurs prêts |
| Singleton | Un objet créé une seule fois, et toujours le même partout dans l'app. | `const config = Object.freeze({ apiUrl: "..." })` (un seul objet config, jamais recréé) | le Hokage : un seul à la fois, tout le village s'y réfère / l'arbitre central d'un match : une seule décision finale |
| Builder | Construire un objet complexe étape par étape, au lieu d'un constructeur à 12 paramètres. | `new NinjaBuilder().setName("Sasuke").setJutsu("chidori").build()` (on empile les configs avant de build) | monter un deck de cartes carte par carte avant de jouer / composer une équipe de foot poste par poste |
| Decorator | Ajouter du comportement à un objet sans modifier sa structure d'origine. | `const withArmor = (ninja) => ({ ...ninja, defense: ninja.defense + 10 })` (le ninja de base reste intact, on ajoute une couche) | équiper une armure par-dessus le costume de Garo / une option supplémentaire sur un contrat de joueur |
| Adapter | Transformer l'interface d'un objet pour qu'elle soit compatible avec ce qu'on attend. | `const adaptApi = (oldData) => ({ name: oldData.nm, hp: oldData.health })` (on traduit l'ancien format vers le nouveau) | un traducteur entre Naruto et Garo qui ne parlent pas la même langue / un convertisseur de prise électrique US vers EU |
| Proxy | Un objet intermédiaire qui intercepte les accès à un autre objet pour y ajouter de la logique. | `new Proxy(ninja, { get: (t, p) => { console.log(p); return t[p] } })` (chaque lecture passe par un contrôle avant d'arriver) | un garde du corps qui filtre qui peut parler au Hokage / un agent de joueur qui filtre les appels avant qu'ils arrivent au joueur |
| Observer | Un objet (le sujet) notifie automatiquement une liste d'abonnés quand son état change. | `subject.subscribe(fn); subject.notify(data)` (tous les abonnés reçoivent l'event sans le demander) | une alerte Horror reçue par TOUS les Chevaliers en même temps / les commentateurs qui réagissent tous au même but |
| Strategy | Un algorithme interchangeable, choisi à l'exécution, derrière une interface commune. | `const strategies = { rapide: (p) => p * 2 }; strategies[key]` `(power)` (le contexte ne sait pas COMMENT, juste QUI appeler) | choisir sa technique de combat juste avant le coup / un attaquant qui choisit puissance, précision ou lob selon la situation |
| Command | Une action encapsulée dans un objet, avec `execute()` et souvent `undo()`. | `const cmd = { execute: () => {...}, undo: () => {...} }` (l'action est stockable, rejouable, annulable) | Ctrl+Z sur les décisions du camp de Rick / une mission Garo mise en file d'attente avant d'être lancée |
| Encapsulation | Cacher les détails internes d'un objet et n'exposer que ce qui est nécessaire. | `function createCompte() { let solde = 0; return { depot: (n) => solde += n } }` (solde n'est PAS accessible directement de l'extérieur) | le coffre-fort de Walter White : personne ne voit l'intérieur, juste la porte / le vestiaire d'une équipe : l'intérieur reste privé |
| Composition (de patterns) | Combiner plusieurs patterns ensemble pour résoudre un problème complet. | `const ninja = withArmor(createNinja("genin"))` (Factory + Decorator combinés) | une équipe qui mélange plusieurs stratégies selon l'adversaire / un perso Naruto qui combine jutsu de base + équipement + buff |
| Immutabilité (rappel FP) | Ne jamais modifier un objet existant : toujours en créer un nouveau. | `const newState = { ...state, hp: state.hp - 10 }` (state original intact, newState est la nouvelle version) | chaque tour de Rasengan Engine retourne un nouvel état, jamais le même modifié / chaque journée de Walking Dead Protocol est un nouveau rapport, pas une réécriture du précédent |
| Coupling (couplage) | Le degré de dépendance entre deux modules : fort couplage = changer l'un casse l'autre. | `// fort couplage : A importe directement B.interneSecret` (si B change sa structure interne, A casse) | deux ninjas qui ne peuvent combattre que liés par une corde / deux services qui partagent direct leur base de données |
| Interface (au sens pattern) | Le contrat qu'un objet doit respecter : quelles méthodes, quelle signature, sans dire comment elles marchent. | `// toute stratégie doit être : (power) => number` (le contrat, pas l'implémentation) | les règles d'un combo : peu importe le perso, les touches sont les mêmes / le règlement FIFA : peu importe l'équipe, les règles du jeu sont identiques |

---

# RÉSUMÉ

Les patterns créationnels (Factory, Singleton, Builder) répondent à "comment je fabrique mes objets sans bordel". Les structurels (Decorator, Adapter, Proxy) répondent à "comment je connecte ou j'enrichis des objets sans tout réécrire". Les comportementaux (Observer, Strategy, Command) répondent à "comment les objets communiquent et réagissent sans être collés les uns aux autres". Un pattern n'est pas un objectif : si ton code est clair sans pattern, n'en rajoute pas pour faire joli.

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
