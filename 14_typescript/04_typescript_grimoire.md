---
stability: perissable_2027
---

# Page verrouillée
> Rappel : ce grimoire simplifie via analogies. Lire d'abord [`31_annexes/GRIMOIRE_CODE_HONNEUR.md`](../31_annexes/18_GRIMOIRE_CODE_HONNEUR.md).

Temps de lecture ~11 min

> **Interdit de lire cette page avant d'avoir coché la checklist ci-dessous.**
> Un grimoire lu trop tôt donne l'illusion de savoir. C'est le pire piège pédagogique.

## Checklist prérequis

- [ ] J'ai fini **tous** les exercices du module courant.
- [ ] J'ai réussi le `00_prereq_check.md` du module suivant.
- [ ] J'ai écrit **au moins un** de mes propres exemples (pas copié).
- [ ] Je peux réexpliquer les 3 concepts phares du module **sans regarder**.

Si une seule case n'est pas cochée : ferme ce fichier. Reviens plus tard.

---

## TYPESCRIPT GRIMOIRE

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| **Type annotation** | Déclaration explicite du type d'une variable ou d'un paramètre. | `const goals: number = 31` (on dit à TS que goals est un number, pas juste une valeur) | Étiquette sur un casier vestiaire (tu sais ce qu'il y a dedans sans l'ouvrir) / Carte d'identité d'une variable |
| **Type inference** | TS devine le type depuis la valeur assignée : sans annotation. | `const name = "Messi"` (TS infère string tout seul, pas besoin de `name: string`) | Un entraineur qui voit jouer un gamin et sait directement à quel poste il joue / Naruto qui reconnaît un jutsu sans qu'on lui explique |
| **Interface** | Décrit la forme d'un objet : ses propriétés et leurs types. | `interface Player { name: string; goals: number }` (contrat : tout objet Player DOIT avoir name et goals) | Les plans de Michael Scofield : chaque salle a ses contraintes exactes / Le menu d'un restaurant : tu sais ce que tu vas avoir |
| **Type alias** | Donne un nom à n'importe quel type : objet, union, primitive, tuple. | `type Score = number \| string` (Score peut être un number ou une string) / Un surnom pour un joueur : "The GOAT" = Messi, utilisé partout à la place du nom complet / Alias d'un jutsu secret |
| **Union type** | La valeur peut être de l'un ou l'autre des types listés. | `let id: string \| number` (id peut être "abc" ou 42, mais pas true) / Un joueur qui peut jouer ailier ou milieu selon le match / Levi capable de combattre ou de commander |
| **Intersection type** | Combine plusieurs types en un seul qui a toutes leurs propriétés. | `type AdminPlayer = Player & { permissions: string[] }` (un AdminPlayer est Player ET a permissions) | Un Chevalier d'Or qui est guerrier ET sorcier en même temps / Walter White : chimiste ET dealer |
| **Generic** | Paramètre de type : se fixe à l'appel selon la valeur passée. | `function wrap<T>(val: T): { value: T }` (T sera number si on passe 42, string si on passe "Messi") | Un moule à gâteau qui s'adapte à n'importe quel ingrédient / Formation tactique applicable à n'importe quelle équipe |
| **Constraint (extends sur generic)** | Limite ce que T peut être : T doit satisfaire la contrainte. | `function getName<T extends { name: string }>(obj: T): string` (T doit avoir au minimum une propriété name) | Un recruteur qui n'embauche que des devs avec 2 ans d'XP minimum / Tournoi réservé aux ninjas chunin ou plus |
| **Partial\<T\>** | Rend toutes les propriétés de T optionnelles. | `type PlayerDraft = Partial<Player>` (chaque champ du formulaire peut être vide) | Formulaire de brouillon : rien n'est obligatoire pour l'instant / Plan d'évasion en cours d'écriture : tous les détails pas encore fixés |
| **Required\<T\>** | Rend toutes les propriétés de T obligatoires : enlève tous les `?`. | `type FinalPlayer = Required<PlayerDraft>` (le brouillon devient une fiche complète) | Vérification finale avant de lancer l'évasion : tout doit être en place / Naruto après sa formation : aucune lacune |
| **Pick\<T, K\>** | Sélectionne seulement les propriétés K de T. | `type PublicProfile = Pick<Player, "name" \| "goals">` (seulement name et goals : pas salary) / Fiche publique d'un joueur : seulement ce que le public a le droit de voir / Le CV d'un ninja : les missions publiques seulement |
| **Omit\<T, K\>** | Crée un type avec toutes les propriétés de T sauf celles de K. | `type SafePlayer = Omit<Player, "salary" \| "privatePhone">` (tout sauf les données sensibles) / Rapport de mission censuré : les infos classifiées sont retirées / Profil joueur sans les stats salariales |
| **Record\<K, V\>** | Crée un type objet avec des clés de type K et des valeurs de type V. | `type TeamMap = Record<string, Player[]>` (chaque string mappe vers un tableau de joueurs) | Annuaire du camp : chaque nom de ville pointe vers une liste de survivants / Registre des jutsus par type de chakra |
| **Readonly\<T\>** | Rend toutes les propriétés de T non-modifiables. | `type FrozenConfig = Readonly<Config>` (toute tentative d'écriture = erreur TS) | Constitution d'un pays : on peut la lire, jamais l'éditer directement / Jutsu gravé dans la pierre : aucune modification possible |
| **ReturnType\<T\>** | Extrait le type de retour d'une fonction. | `type Stats = ReturnType<typeof getStats>` (TS devine tout seul ce que getStats retourne) | Le rapport de fin de mission : le type de rapport dépend du type de mission / Sortie du scanner de Zod avant de l'avoir lancé |
| **Discriminated union** | Union d'objets avec une propriété commune (le discriminant) qui les distingue. | `type Event = { type: "goal", scorer: string } \| { type: "card", player: string }` (type est le discriminant) / Casiers d'équipes avec un badge de couleur : tu vois la couleur avant d'ouvrir / Hokage de chaque village identifié par son symbole |
| **Type guard** | Vérification runtime qui prouve à TS quel type tu manipules. | `if (typeof x === "string") { x.toUpperCase() }` (dans ce bloc, TS sait que x est string) | Scan à l'entrée d'une zone sécurisée : si tu passes le scan, TS sait qui tu es / Kakashi qui lit les chakras avant d'identifier le ninja |
| **Type predicate** | Fonction qui retourne `value is Type` : TS rétrécit le type si elle retourne true. | `function isPlayer(v: unknown): v is Player { ... }` (si true, TS sait que v est Player dans le bloc if) | Détecteur de menace : si l'alarme sonne, c'est un Horror confirmé / Analyste sécurisée qui certifie l'identité d'un intrus |
| **Assertion function** | Fonction qui lance une erreur si le type est faux : TS intègre l'assertion ensuite. | `function assertPlayer(v: unknown): asserts v is Player { if (!isPlayer(v)) throw new Error(...) }` | Contrôle à la frontière : si ton passeport est faux, tu passes pas : sinon TS te fait confiance / T-Bag bloqué à la sortie |
| **Narrowing** | Rétrécissement du type dans une branche du code après un type guard. | `if (event.type === "goal") { event.scorer }` (event.scorer dispo seulement dans cette branche) | Entonnoir : la liste de suspects passe de "tout le monde" à "ceux qui matchent le profil" / Arc narratif : on élimine les candidats un par un |
| **Conditional type** | Type dont la valeur dépend d'une condition sur un autre type. | `type IsString<T> = T extends string ? "yes" : "no"` (si T est string, le type est "yes") | Ternaire mais pour les types : même logique, niveau méta / Le Sharingan qui analyse le type de chakra avant de décider la riposte |
| **infer** | Mot-clé dans un conditional type pour extraire un type depuis une structure. | `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never` (R capture le type de retour) | Extraction d'un suspect d'une liste via empreintes digitales : infer est les empreintes / Levi qui identifie la technique d'un Titan juste en observant |
| **Mapped type** | Génère un nouveau type en itérant sur les clés d'un type existant. | `type Optional<T> = { [K in keyof T]?: T[K] }` (pour chaque clé K de T, la rend optionnelle) | Photocopier un document en ajoutant un tampon "facultatif" sur chaque ligne / Régime d'entraînement personnalisé : même structure, intensité modulée |
| **keyof** | Extrait l'union des clés d'un type sous forme de type. | `type PlayerKeys = keyof Player` (= "id" \| "name" \ / "goals" si Player a ces 3 champs) / Liste des portes d'un bâtiment : toutes les entrées possibles, rien de plus / Liste des techniques d'un ninja : tout ce qu'il peut faire |
| **typeof (TS)** | Extrait le type d'une valeur existante : version TS du typeof runtime. | `type Config = typeof defaultConfig` (TS génère le type depuis l'objet réel) | Scanner un objet pour générer sa carte d'identité de type / Cloner le schéma de Walter White depuis son labo existant |
| **never** | Type impossible : aucune valeur n'est de type never. Utile pour l'exhaustivité. | `function assertNever(x: never): never { throw new Error(...) }` (si TS laisse une valeur atteindre ce point, il y a un cas non géré) | La case "impossible" dans un plan d'évasion : si tu la touches, le plan est cassé / Zone interdite du village : personne ne doit y arriver |
| **unknown** | Comme any mais sûr : tu dois valider avant d'utiliser. | `const data: unknown = JSON.parse(raw)` (tu dois prouver ce que c'est avant d'y toucher) | Colis anonyme au camp : tu l'ouvres pas avant de l'avoir scanné / Identité inconnue : tu la valides avant de lui donner accès |
| **Declaration merging** | Capacité d'une interface à être étendue par une autre déclaration du même nom. | `interface Window { analytics: Analytics }` (ajoute analytics au type Window global) | Ajouter une pièce à un bâtiment existant sans démolir les murs / Extension de mission en cours : on rajoute un objectif sans réécrire le plan |
| **tsconfig strict** | Mode TS qui active toutes les vérifications strictes en une option. | `"strict": true` dans tsconfig.json (active noImplicitAny, strictNullChecks, etc. : tout d'un coup) | Passer en mode entraînement intensif : tout est contrôlé, rien ne passe / Formation des Anbus : niveau maximal de rigueur, pas de demi-mesure |

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.
