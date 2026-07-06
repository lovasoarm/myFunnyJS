# TYPESCRIPT ADVANCED GRIMOIRE

Le plan détaillé de Fox River, version compilateur. Tout ce qu'un dev doit avoir en tête sur les déclarations de types externes, la config du compilateur, et la migration JS vers TS. Pas un résumé : la référence complète du module.

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Declaration file (.d.ts) | Fichier qui décrit la forme d'un code existant, sans l'implémenter, jamais exécuté | `declare function f(x: number): string;` | la légende d'une carte, pas le territoire / un plan d'architecte, pas le bâtiment |
| declare | Mot-clé qui dit à TS "fais-moi confiance, ça existe au runtime, voici juste sa forme" | `declare class RadioCrypte { ... }` | un témoignage qu'on accepte sans vérifier soi-même / une carte d'identité qu'on ne questionne pas |
| @types/* | Paquets npm communautaires (DefinitelyTyped) qui fournissent des types pour des libs JS sans types natifs | `npm install --save-dev @types/lodash` | une traduction officielle d'un texte original / un manuel d'instructions ajouté après coup |
| declare module (boîte noire) | Déclare qu'un module existe sans préciser sa forme interne, tout devient implicitement any | `declare module 'lib-sans-types';` | un colis accepté sans l'ouvrir / une salle sur le plan, sans savoir ce qu'il y a dedans |
| declare global | Étend une interface globale existante (comme Window) via la fusion de déclarations | `declare global { interface Window {...} }` | ajouter une annotation sur une carte officielle déjà imprimée / un avenant à un contrat existant |
| tsconfig.json | Fichier de configuration qui pilote la sortie du compilateur et la rigueur de vérification | `{ "compilerOptions": { "strict": true } }` | le règlement intérieur du plan d'évasion / les statuts d'une organisation |
| target | Option qui détermine la version de JS générée par la compilation | `"target": "ES2022"` | la langue d'arrivée d'une traduction / le format de sortie d'un fichier exporté |
| module | Option qui détermine le système de modules utilisé dans le JS compilé | `"module": "NodeNext"` | le protocole de communication choisi entre équipes / le format d'emballage du colis livré |
| strict | Interrupteur qui active plusieurs vérifications rigoureuses en une fois | `"strict": true` | activer toutes les alarmes de sécurité d'un coup / un contrôle de sécurité renforcé |
| strictNullChecks | Sous-option de strict qui force à gérer explicitement null et undefined | partie de `"strict": true` | vérifier qu'une pièce est vide avant d'y entrer / ne jamais supposer qu'une case est remplie |
| noImplicitAny | Sous-option de strict qui interdit les types any non déclarés explicitement | partie de `"strict": true` | interdire les zones d'ombre non identifiées sur le plan / refuser les inconnues non signalées |
| allowJs | Autorise des fichiers .js à coexister dans un projet TypeScript | `"allowJs": true` | laisser une porte ouverte pendant la transition / un sas de décompression entre deux états |
| checkJs | Applique la vérification de type TypeScript même sur des fichiers .js, via JSDoc | `"checkJs": true` | inspecter une zone sans la rénover encore / un contrôle qualité sur l'existant, sans tout reconstruire |
| JSDoc (typage) | Annotations de type écrites en commentaires, lues par TS dans les fichiers .js | `/** @param {number} x */` | des notes manuscrites en marge d'un vieux plan / des indices laissés sans réécrire le document |
| paths / baseUrl | Définit des alias d'import pour raccourcir des chemins relatifs complexes | `"@utils/*": ["utils/*"]` | un nom de code court pour une route complexe / un raccourci sur une carte au lieu du chemin détaillé |
| declaration (compilerOptions) | Génère automatiquement les fichiers .d.ts correspondant à ton code TS, pour les consommateurs externes | `"declaration": true` | publier le plan en même temps que le bâtiment construit / fournir la notice avec le produit |
| Migration progressive | Stratégie de conversion JS vers TS fichier par fichier, jamais en un seul bloc | ordre : feuilles du graphe de dépendances d'abord | évacuer un bâtiment étage par étage / un plan d'évasion en plusieurs phases vérifiées |
| Feuille (graphe de dépendances) | Fichier sans dépendance interne vers d'autres fichiers du projet, point de départ idéal pour migrer | `utils.ts` qui n'importe aucun autre fichier du projet | le premier maillon d'une chaîne, sans rien en amont / la première pièce libérée dans un plan d'évasion |

---

## CE QUE LE GRIMOIRE NE TE DIT PAS EN UNE LIGNE

**Sur les .d.ts :** un fichier de déclaration qui ment sur la vraie signature d'une fonction JS, c'est pire que pas de types du tout. Sans types, tu restes prudent. Avec des types faux, tu fais une confiance aveugle à un mensonge. Vérifie toujours qu'un `.d.ts` que tu écris colle exactement au comportement réel du JS sous-jacent, surtout sur les cas limites (valeurs nulles, erreurs possibles).

**Sur tsconfig.json :** y a pas de config universelle parfaite. Un projet greenfield, un projet en migration, et une librairie publiée ont des besoins de configuration complètement différents. Copier-coller une config sans comprendre chaque option, c'est hériter des choix de quelqu'un d'autre sans savoir ce que tu perds ou gagnes.

**Sur la migration :** la tentation de tout réécrire d'un coup revient toujours, surtout sous pression. Résiste. Une migration qui avance fichier par fichier, des feuilles vers la racine, avec une strictness qui se renforce progressivement, c'est plus lent au début mais infiniment plus fiable. Le projet reste fonctionnel à chaque étape, contrairement à un big bang qui le laisse instable pendant des semaines.

---

## CE QUI BOUGERA, CE QUI RESTERA

```
BOUGERA (probablement) :
- les options précises ajoutées ou dépréciées dans tsconfig au fil des versions TS
- les outils pour générer automatiquement des .d.ts à partir de JS (ils s'améliorent)
- la popularité de DefinitelyTyped face à d'autres solutions de typage communautaire

RESTERA :
- le besoin de décrire la forme d'un code externe sans le réécrire (.d.ts)
- le besoin de contrôler la rigueur du compilateur selon la maturité du projet
- le besoin d'une stratégie progressive pour migrer du code legacy, peu importe le langage cible
```

Retiens le PRINCIPE de chaque mécanisme, pas la liste exhaustive des options de tsconfig par coeur. Le jour où une nouvelle option apparaît dans une nouvelle version de TypeScript, tu sauras directement si c'est une option de sortie (comme `target`) ou une option de vérification (comme `strict`), parce que t'auras compris la distinction, pas juste mémorisé une liste.

---

## OÙ L'ANALOGIE CASSE

Rappel Partie B.2 : toute analogie de ce grimoire simplifie un mécanisme.
Quand tu dois **décider** (fix, refactor, ADR), retourne au mécanisme réel,
pas à l'image. L'analogie sert à comprendre vite ; elle ment toujours un peu.

---
stability: intemporel
