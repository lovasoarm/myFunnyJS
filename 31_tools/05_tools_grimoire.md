# TOOLS GRIMOIRE

L'établi complet. Les 4 gadgets maison construits dans ce module, leur rôle exact, et quand piocher lequel. Pas un résumé : la référence complète que tu rouvres à chaque mini-projet.

---

| Terme | Définition | Code | Analogies |
|-------|------------|------|-----------|
| Logger structuré | Outil qui enregistre des événements avec horodatage, niveau de gravité, et contexte, en format exploitable | `logger.error("echec", { secteur: "nord" })` | un carnet de bord d'expédition daté et classé / une boîte noire d'avion qui enregistre tout |
| Niveau de log | Hiérarchie de gravité (debug, info, warn, error) qui permet de filtrer le bruit selon le contexte | `creerLogger("warn")` ignore debug et info | un tri par priorité du courrier / un système de feux d'alerte à plusieurs paliers |
| Contexte (log) | Données additionnelles jointes à un log, qui transforment un message vague en indice complet | `{ frequence: 145.5, tentative: 3 }` | les détails d'un rapport d'incident, pas juste "un truc a cassé" / la scène de crime complète, pas juste la victime |
| Benchmark | Mesure comparative de performance entre deux implémentations, sur plusieurs itérations | `comparer([{nom, fn}, {nom, fn}])` | une course chronométrée entre deux coureurs, pas une impression visuelle / un crash-test répété, pas une observation unique |
| Warmup | Exécutions préliminaires avant la vraie mesure, pour laisser le moteur JS s'optimiser (JIT) | boucle de 10 appels avant le vrai chronométrage | s'échauffer avant une course pour ne pas fausser le chrono / faire chauffer un moteur avant de mesurer sa vitesse réelle |
| performance.now() | Fonction native qui retourne un timestamp précis en millisecondes, pour mesurer des durées | `const debut = performance.now()` | un chronomètre de précision, pas une horloge murale / un radar de vitesse, pas un calendrier |
| Facteur comparatif | Rapport entre deux mesures de benchmark, plus lisible qu'une différence brute en millisecondes | `dureeMoyenne_ms / plusRapide.dureeMoyenne_ms` | "deux fois plus loin" plutôt que "200 mètres de plus" / une note relative plutôt qu'un score brut isolé |
| Assertion | Vérifie qu'une hypothèse sur l'état du code est vraie, plante immédiatement sinon avec le contexte exact | `assert(stock >= 0, "stock invalide", { stock })` | un garde-fou qui arrête tout si une règle est violée / un détecteur de fumée qui sonne à la première trace, pas après l'incendie |
| Inspecteur d'état | Affiche un snapshot figé et complet d'une donnée à un instant précis, sans casser le flux du code | `inspecter("avant rotation", etat)` | une photo prise à un instant T, pas une description floue de mémoire / un arrêt sur image dans une vidéo |
| structuredClone | Fonction native qui fait une copie profonde d'un objet, indépendante de l'original | `const snapshot = structuredClone(donnees)` | un duplicata figé d'un document, qui ne bouge plus si l'original change / un moulage qui garde la forme exacte du moment |
| Traceur | Enregistre une suite d'étapes d'exécution avec timestamp et données, pour reconstituer un chemin complet | `creerTraceur()` puis `tracer(nom, donnees)` | les empreintes de pas laissées sur un sentier / le journal de vol d'un avion, étape par étape |
| Scaffolder | Génère automatiquement une structure de fichiers et dossiers répétitive, pour éliminer l'erreur manuelle | `genererMiniProjet("10_nouveau_projet")` | un moule qui produit toujours la même forme exacte / un patron de couture réutilisable |
| process.argv | Tableau contenant les arguments passés en ligne de commande à un script Node | `process.argv[2]` = premier argument réel | la liste des instructions données à l'entrée d'un guichet / les ingrédients passés à une recette via la commande |
| Code de sortie (exit code) | Valeur numérique qu'un script renvoie au shell pour signaler succès (0) ou échec (autre) | `process.exit(1)` | un pouce levé ou baissé à la fin d'une mission / un voyant vert ou rouge sur un tableau de bord |

---

## CE QUE LE GRIMOIRE NE TE DIT PAS EN UNE LIGNE

**Sur le logger :** la tentation, c'est de logger PARTOUT, à chaque ligne. Résiste. Un logger qui croule sous des milliers de logs `info` redondants devient aussi inutile qu'aucun logger du tout. Logge ce qui raconte une décision ou un événement, pas chaque ligne exécutée.

**Sur le benchmark :** un facteur comparatif élevé ("3x plus rapide") sur une différence absolue minuscule (0.001ms) ne veut souvent rien dire en pratique. Toujours se demander : cette fonction tourne combien de fois réellement dans mon usage, avant de décider que l'optimisation vaut le coup.

**Sur le debug toolkit :** assertions, inspecteur et traceur sont complémentaires au débogueur intégré de l'éditeur (vu dans le module toolchain), pas des remplaçants. Le débogueur excelle en exploration interactive locale. Les outils maison excellent pour laisser une trace exploitable même sans débogueur attaché (tests automatisés, environnements distants).

**Sur le scaffolder :** vérifier l'existence avant de créer n'est pas une option, c'est ce qui empêche d'écraser silencieusement du contenu déjà rempli. Un scaffolder sans cette protection est plus dangereux qu'utile.

---

## CE QUI BOUGERA, CE QUI RESTERA

```
BOUGERA (probablement) :
- tu remplaceras sans doute ces outils maison par des libs matures en vrai projet de prod
  (Winston ou Pino pour le logger, Tinybench pour le benchmark, des frameworks CLI comme
  Commander ou Yargs pour le scaffolder)

RESTERA :
- le besoin de structurer un log avec niveau et contexte, peu importe l'outil derrière
- le besoin de mesurer avant d'optimiser, avec warmup et plusieurs itérations
- le besoin de vérifier des hypothèses plutôt que d'observer des valeurs à l'aveugle
- le besoin d'automatiser une structure répétitive plutôt que de la recréer à la main
```

Ces 4 outils, c'est le marteau que tu construis pour comprendre comment un marteau fonctionne. Le jour où tu utilises une lib de prod plus complète, tu sauras exactement ce qu'elle fait sous le capot, parce que t'auras déjà construit une version simplifiée toi-même, ici, dans cet atelier.
