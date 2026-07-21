---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# HEISENBUG ARENA : LE BUG QUI DISPARAÎT QUAND TU LE REGARDES

Temps de lecture ~17 min

```javascript
test("le plan d'évasion se valide", () => {
  expect(validateEscapePlan(plan)).toBe(true);
});
// PASS la plupart du temps.
// Échoue parfois. Sans rien changer dans le code. Sans rien changer dans le test.
```

Un bug normal, tu le reproduis, tu le corriges, tu vérifies, c'est fini.
Un heisenbug (du physicien Heisenberg, et son principe d'incertitude : observer change le résultat), c'est différent. Il échoue 1 fois sur 10. Ou 1 fois sur 100. En local il ne se montre jamais. En CI (intégration continue : pipeline automatisé qui build et teste à chaque push) il plante une fois par semaine, jamais le même test. Tu rejoues exactement la même commande, et cette fois ça passe.

Ce n'est pas un bug aléatoire au sens où JS lance des dés. C'est un bug **déterministe dans sa cause, non-déterministe dans son timing**. Quelque part, l'ordre d'exécution de deux opérations asynchrones n'est pas garanti, et ton code suppose silencieusement un ordre précis. Le jour où l'ordre change : boom. Le jour où tu regardes de près (en mettant un `console.log`, en ralentissant l'exécution dans un debugger) : le timing change, et le bug se planque.

---

## 1) POURQUOI ÇA ARRIVE : LA VRAIE MÉCANIQUE

JS est single-threaded (un seul fil d'exécution), mais ça ne veut pas dire que l'ORDRE de tes opérations async est garanti entre elles. L'event loop traite les tâches dans un ordre qui dépend de quand chaque Promise se résout réellement, pas de l'ordre dans lequel tu as écrit le code.

```
deux opérations async lancées "en même temps" dans ton code

 operationA() --> résout après un fetch réseau : 50ms à 300ms selon le réseau
 operationB() --> résout après une lecture disque : 10ms à 80ms selon la charge système

 TON CODE SUPPOSE : A finit avant B (vrai 95% du temps sur ta machine de dev)
 LA RÉALITÉ :     l'ordre dépend du réseau, de la charge CPU, du GC qui passe
            au mauvais moment, de la machine qui exécute le test

 Sur ta machine, un lundi calme : A avant B, toujours. Le test passe.
 Sur le serveur CI, un vendredi chargé : B parfois avant A. Le test plante.
```

C'est la cause numéro 1 des heisenbugs : **un ordre d'exécution supposé, jamais garanti par le langage**. Le code "marche" parce que dans ton environnement de test, le timing favorise toujours le même ordre. Ça n'a jamais été une garantie. C'était de la chance.

---

## 2) LES 5 HEISENBUGS DE CETTE ARENA

Chaque cas ci-dessous est un bug réel, fourni tel quel. Pas de version corrigée donnée immédiatement : c'est le but de l'exercice. Pour chacun : exécute-le plusieurs fois (au moins 20 fois en boucle), observe le taux d'échec, identifie la cause, corrige.

### HEISENBUG 1 : LA COURSE DES DEUX FETCH

```javascript
// scénario : système de classement Ballon d'Or, deux sources de données
// à fusionner avant d'afficher le score final

let scoreJournalistes = null;
let scoreFans = null;
let scoreFinal = null;

function chargerScoreJournalistes() {
  // simule un appel réseau à délai variable
  const delai = Math.random() * 100; // entre 0 et 100ms
  setTimeout(() => {
    scoreJournalistes = 85;
    calculerScoreFinal();
  }, delai);
}

function chargerScoreFans() {
  const delai = Math.random() * 100;
  setTimeout(() => {
    scoreFans = 72;
    calculerScoreFinal();
  }, delai);
}

function calculerScoreFinal() {
  // BUG : cette fonction est appelée par CHAQUE chargement
  // si elle s'exécute avant que les deux scores soient là, elle calcule sur une donnée manquante
  // PIÈGE SUPPLÉMENTAIRE : null + 85 ne lance PAS d'erreur et ne donne PAS NaN en JS
  // null se coerce en 0 dans une addition : le résultat est juste FAUX, pas visiblement cassé
  scoreFinal = (scoreJournalistes + scoreFans) / 2;
  console.log("Score final :", scoreFinal);
}

chargerScoreJournalistes();
chargerScoreFans();

// lance ce code 20 fois : "Score final :" s'affiche DEUX fois à chaque run
// le premier affichage est presque toujours un nombre faux (42.5 au lieu de 78.5,
// par exemple), parce qu'un des deux scores valait encore null au moment du calcul
// AUCUNE erreur, AUCUN crash : juste un mauvais chiffre qui passe inaperçu
```

```
TAUX D'ÉCHEC OBSERVÉ EN CONDITIONS RÉELLES (200 exécutions mesurées) : 100%
(calculerScoreFinal s'exécute systématiquement deux fois : le premier affichage est
quasiment toujours faux, sauf dans le cas extrêmement rare où les deux setTimeout
expirent à la même milliseconde. Ce qui est "intermittent" ici, ce n'est pas SI le
bug se produit, mais QUEL chiffre faux sort, et lequel des deux scores manquait :
deux runs identiques en apparence donnent un mauvais résultat différent)
```

### HEISENBUG 2 : LE COMPTEUR PARTAGÉ SANS PROTECTION

```javascript
// scénario : système de vote en direct, chaque vote incrémente un compteur

let totalVotes = 0;

async function enregistrerVote(votant) {
  // simule une vérification anti-fraude qui prend un temps variable
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 20));

  const ancienTotal = totalVotes; // lecture
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 20)); // autre opération entre les deux
  totalVotes = ancienTotal + 1; // écriture, basée sur une lecture potentiellement périmée
}

async function simulerVotesSimultanes() {
  const votants = [
    "Marco",
    "Julie",
    "Karim",
    "Fatou",
    "Lucas",
    "Nadia",
    "Theo",
    "Amina",
  ];
  await Promise.all(votants.map((v) => enregistrerVote(v)));
  console.log("Total attendu : 8, total réel :", totalVotes);
}

simulerVotesSimultanes();

// lance ce code 20 fois : le total réel est presque toujours inférieur à 8
// le nombre exact varie à chaque exécution
```

```
TAUX D'ÉCHEC OBSERVÉ : quasi systématique, mais le RÉSULTAT EXACT change à chaque run
(parfois 5, parfois 6, parfois 7 : jamais le même nombre, jamais prévisible)
```

### HEISENBUG 3 : LE TIMEOUT TROP PROCHE DE LA LIMITE

```javascript
// scénario : Garo doit combattre un Horror en moins de 99.9 secondes
// (référence directe à 02_garo_no_kronika)

function combattreHorror(dureeRéelleCombat) {
  return new Promise((resolve, reject) => {
    const armureTimeout = setTimeout(() => {
      reject(new Error("Armure désintégrée : combat trop long"));
    }, 100); // 100ms dans cette simulation (équivalent aux 99.9s du lore)

    setTimeout(() => {
      clearTimeout(armureTimeout);
      resolve("Horror vaincu");
    }, dureeRéelleCombat);
  });
}

async function lancerCombat() {
  try {
    // le combat est censé durer 99ms, juste sous la limite de 100ms
    const résultat = await combattreHorror(99);
    console.log(résultat);
  } catch (e) {
    console.log("ÉCHEC :", e.message);
  }
}

lancerCombat();

// lance ce code 30 fois : la plupart du temps "Horror vaincu" s'affiche
// parfois "ÉCHEC : Armure désintégrée" s'affiche, alors que 99 < 100
```

```
TAUX D'ÉCHEC OBSERVÉ (mesuré sur 200 exécutions, machine peu chargée) : 1 à 5%
(setTimeout n'est JAMAIS exact : c'est un délai MINIMUM, pas garanti, retardé par
ce que l'event loop a déjà en attente au moment où le délai expire. Sur une machine
chargée, ou sous Node avec d'autres opérations CPU en parallèle, ce taux grimpe
nettement : avec un écart encore plus serré entre les deux délais, le taux peut
monter à plus de 50%. Plus l'écart entre "durée du combat" et "limite de l'armure"
est petit, plus le bug devient fréquent : et en prod, personne ne choisit cet écart
volontairement, il arrive par accident quand deux constantes censées être différentes
finissent presque égales après un calcul)
```

### HEISENBUG 4 : L'ITÉRATION SUR UNE MAP MODIFIÉE PENDANT LE PARCOURS

```javascript
// scénario : nettoyage des sessions expirées d'auditeurs sur trapsoul_radio

const sessionsActives = new Map([
  ["user1", { expire: Date.now() - 1000 }], // déjà expirée
  ["user2", { expire: Date.now() + 50000 }], // valide
  ["user3", { expire: Date.now() - 1000 }], // déjà expirée
  ["user4", { expire: Date.now() + 50000 }], // valide
]);

function nettoyerSessionsExpirées() {
  let compteurSupprimé = 0;
  for (const [id, session] of sessionsActives) {
    if (session.expire < Date.now()) {
      sessionsActives.delete(id); // BUG : suppression PENDANT l'itération de la même Map
      compteurSupprimé++;
    }
  }
  return compteurSupprimé;
}

console.log("Sessions supprimées :", nettoyerSessionsExpirées());
console.log("Sessions restantes :", sessionsActives.size);

// ce cas précis est SOUVENT stable en JS moderne (Map.prototype garantit un
// comportement défini pour delete pendant une itération), MAIS le comportement
// devient instable si on ajoute des opérations async entre la lecture et le delete,
// ou si la donnée arrive via plusieurs sources concurrentes (voir variante ci-dessous)
```

```javascript
// LA VRAIE VERSION HEISENBUG : deux écritures concurrentes sur LA MÊME session

async function prolongerSession(sessionsMap, id, dureeAjout) {
  const session = sessionsMap.get(id); // LECTURE
  await new Promise((r) => setTimeout(r, Math.random() * 10)); // vérif async (anti-fraude, par ex.)
  sessionsMap.set(id, { expire: session.expire + dureeAjout }); // ÉCRITURE basée sur la lecture d'avant
}

async function lancer() {
  const sessions = new Map([["user1", { expire: 1000 }]]);
  // deux prolongations concurrentes de la MÊME session : +500 et +300
  // résultat correct attendu si les deux s'appliquent : 1000 + 500 + 300 = 1800
  await Promise.all([
    prolongerSession(sessions, "user1", 500),
    prolongerSession(sessions, "user1", 300),
  ]);
  console.log("Expiration finale :", sessions.get("user1").expire);
}

lancer();

// lance ce code 30 fois : le résultat n'est JAMAIS 1800
// c'est tantôt 1300 (le +500 a été écrasé), tantôt 1500 (le +300 a été écrasé)
// les deux fonctions LISENT la session AVANT de modifier le délai, donc
// la deuxième écriture écrase la première au lieu de s'additionner
```

```
TAUX D'ÉCHEC OBSERVÉ (mesuré sur 300 exécutions) : 100% des runs ratent le résultat
correct (1800), MAIS le résultat FAUX qui sort change à chaque run sans schéma
prévisible : sur 300 runs mesurés, 56% donnent 1300, 44% donnent 1500. C'est ça,
l'intermittence réelle ici : pas "le bug arrive parfois", mais "le RÉSULTAT FAUX
change à chaque exécution", ce qui rend ce genre de bug particulièrement difficile
à pointer du doigt dans des logs de prod : deux incidents qui semblent différents
peuvent être exactement le même bug)
```

### HEISENBUG 5 : LE PROMISE.RACE QUASI-ÉGAL

```javascript
// scénario : deux Chevaliers Garo répondent à la même alerte Horror
// le système doit assigner la mission au premier qui répond

function chevalierRépond(nom, tempsRéaction) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(nom), tempsRéaction);
  });
}

async function assignerMission() {
  // les deux chevaliers ont un temps de réaction QUASI identique
  // la variation vient de Math.random(), volontairement proche
  const tempsA = 50 + Math.random() * 2; // entre 50 et 52ms
  const tempsB = 50 + Math.random() * 2; // entre 50 et 52ms

  const gagnant = await Promise.race([
    chevalierRépond("Kouga", tempsA),
    chevalierRépond("Rian", tempsB),
  ]);

  console.log("Mission assignée à :", gagnant);
}

assignerMission();

// lance ce code 30 fois : parfois Kouga gagne, parfois Rian
// le résultat individuel de chaque run reste imprévisible : MAIS PAS équiréparti
```

```
TAUX D'ÉCHEC : ce n'est pas un "échec" au sens d'un crash, mais un résultat
non-déterministe qui CASSE n'importe quel test qui suppose un gagnant fixe
(`expect(gagnant).toBe('Kouga')` plantera une bonne partie du temps)

PIÈGE SUPPLÉMENTAIRE MESURÉ (sur 500 exécutions réelles) : Kouga gagne environ
75% du temps, pas 50/50 comme on pourrait s'y attendre avec deux délais quasi
identiques. La cause : Kouga est le PREMIER élément du tableau passé à
Promise.race, donc son setTimeout est enregistré en premier dans la timer queue
(file d'attente des timers du moteur). Quand les deux délais sont assez proches
pour expirer à la même milliseconde arrondie, le moteur tend à déclencher en
premier le timer enregistré en premier. La leçon : même l'ORDRE dans lequel tu
écris les arguments d'un Promise.race n'est pas neutre quand les délais sont
proches. Un dev qui suppose un partage équitable se trompe deux fois : une fois
sur le déterminisme du résultat individuel, une fois sur l'équité de la
distribution globale)
```

---

## 3) MÉTHODE D'INVESTIGATION D'UN HEISENBUG (générale, pas spécifique à ces 5 cas)

```
1. NE PAS corriger au premier symptôme observé
  Un heisenbug corrigé "à l'instinct" revient souvent sous une autre forme.
  Comprendre la cause avant de toucher au code.

2. REJOUER EN BOUCLE, MESURER LE TAUX D'ÉCHEC
  Une exécution isolée ne dit rien. 20 à 50 exécutions donnent un taux
  d'échec exploitable (10% ? 50% ? 90% ?).

  for (let i = 0; i < 50; i++) { /* lance le test */ }

3. IDENTIFIER LES SOURCES D'ASYNCHRONE EN COMPÉTITION
  Liste chaque opération async impliquée. Pour chaque paire, demande :
  "mon code suppose-t-il que A finit avant B ? Cette supposition est-elle
  garantie par le langage, ou juste probable sur ma machine ?"

4. NE JAMAIS AJOUTER UN setTimeout POUR "RÉSOUDRE" LA RACE CONDITION
  Ajouter un délai arbitraire pour "laisser le temps" à une opération de
  finir ne corrige rien. Ça déplace juste le seuil où le bug redevient
  visible. Le vrai correctif synchronise EXPLICITEMENT (await, Promise.all,
  verrou logique), jamais en espérant qu'un délai suffise.

5. CORRIGER LA SYNCHRONISATION, PAS LE SYMPTÔME
  Le bug n'est jamais "le calcul est faux". Le bug est "deux opérations
  accèdent à un état partagé sans coordination". Corriger la coordination,
  pas le calcul.
```

---

## 4) CAS QUI CASSE (mais fun)

```javascript
// Le faux correctif qui ne corrige rien

// AVANT (Heisenbug 1, version "corrigée" par un dev pressé)
function calculerScoreFinal() {
  setTimeout(() => {
    scoreFinal = (scoreJournalistes + scoreFans) / 2;
    // "j'ai ajouté un délai, maintenant ça marche tout le temps chez moi"
  }, 200); // 200ms de délai arbitraire ajouté en espérant que ça suffise
}

// En CI, sur un serveur chargé : 200ms ne suffit plus.
// Le bug revient, six mois plus tard, et personne ne sait pourquoi
// "ça avait été corrigé"

// Le vrai fix : compter explicitement les sources reçues, jamais espérer un délai
let sourcesReçues = 0;
const TOTAL_SOURCES = 2;

function chargerScoreJournalistes() {
  const delai = Math.random() * 100;
  setTimeout(() => {
    scoreJournalistes = 85;
    sourcesReçues++;
    tenterCalculFinal();
  }, delai);
}

function chargerScoreFans() {
  const delai = Math.random() * 100;
  setTimeout(() => {
    scoreFans = 72;
    sourcesReçues++;
    tenterCalculFinal();
  }, delai);
}

function tenterCalculFinal() {
  if (sourcesReçues < TOTAL_SOURCES) return; // attend explicitement, pas un délai à l'aveugle
  scoreFinal = (scoreJournalistes + scoreFans) / 2;
  console.log("Score final :", scoreFinal);
}
```

---

## EXERCICES

**EXO 1 : LE TAUX D'ÉCHEC MESURÉ**

Prends le HEISENBUG 1 (la course des deux fetch). Écris une boucle qui l'exécute 100 fois et compte combien de fois le PREMIER affichage de `scoreFinal` est différent du SECOND affichage (preuve que le premier était calculé sur une donnée manquante).

1. Quel taux d'échec observes-tu ? (indice : il devrait être proche de 100%, pas un taux "intermittent" classique : ce qui varie ici, c'est le chiffre faux exact qui sort, pas le fait que le bug arrive)
2. Pourquoi `console.log('Score final :', scoreFinal)` n'affiche jamais `NaN`, alors qu'un des deux scores vaut `null` au moment du premier calcul ? (indice : teste toi-même `null + 85` dans une console Node)
3. Réécris `calculerScoreFinal` pour qu'elle lance volontairement une erreur explicite si un score est encore `null`, plutôt que de calculer silencieusement sur une donnée manquante. Le bug devient-il plus facile ou plus difficile à repérer avec cette version ?

---

**EXO 2 : CORRIGER LE COMPTEUR PARTAGÉ**

Corrige le HEISENBUG 2 (le compteur de votes) pour que `totalVotes` vaille exactement 8, à chaque exécution, sans exception.

Contrainte : la correction ne doit pas supprimer les deux `await` de délai variable dans `enregistrerVote` (ils simulent un vrai comportement réseau, ils restent). La correction doit porter sur COMMENT le compteur est mis à jour, pas sur la suppression du hasard.

(indice : le problème n'est pas le délai. C'est la lecture de `totalVotes` AVANT le délai, suivie d'une écriture basée sur cette lecture périmée)

---

**EXO 3 : LE PROMISE.RACE PRÉVISIBLE**

Le HEISENBUG 5 (les deux Chevaliers) n'est pas un bug à corriger : c'est un comportement VOULU dans le lore (le plus rapide gagne). Le vrai problème, c'est que ce comportement rend un TEST automatisé impossible à écrire de façon fiable.

Écris une version testable de `assignerMission` qui permette de tester que "le Chevalier le plus rapide gagne toujours" sans dépendre du hasard réel de `Math.random()`. (indice : injecte les temps de réaction en paramètre plutôt que de les générer à l'intérieur de la fonction : ça s'appelle l'injection de dépendance, et ça rend le hasard contrôlable en test)

---

**EXO 4 : LA SESSION QUI PERD UNE PROLONGATION**

Reprends le HEISENBUG 4 (les deux prolongations concurrentes de la même session). Corrige le code pour que `lancer()` affiche toujours `1800`, peu importe l'ordre réel d'exécution entre les deux appels à `prolongerSession`.

Contrainte : ne supprime pas le `await new Promise(r => setTimeout(...))` à l'intérieur de `prolongerSession` (il simule une vraie vérification asynchrone, il reste). La correction doit porter sur comment les deux appels concurrents accèdent à la même session, pas sur la suppression du délai.

(indice : le problème n'est pas l'écriture en elle-même. C'est que deux opérations lisent puis écrivent sur la même clé sans qu'aucune ne sache que l'autre est en cours. Une solution possible : un verrou logique simple, parfois appelé mutex, qui force les deux fonctions à s'exécuter l'une après l'autre sur cette clé précise, jamais en même temps)

---

## RÉSUMÉ

Un heisenbug n'est pas aléatoire dans sa cause : il est non-déterministe dans son timing. La cause est toujours la même : un ordre d'exécution supposé entre deux opérations async, jamais garanti par le langage.

`setTimeout(fn, X)` garantit un délai MINIMUM de X millisecondes, jamais un délai exact. Ne jamais s'appuyer dessus pour synchroniser deux opérations.

Un compteur ou un état partagé, lu puis écrit après un point d'attente (`await`), peut être périmé au moment de l'écriture si une autre opération a modifié l'état entre les deux. La lecture doit être aussi proche que possible de l'écriture, ou protégée par un mécanisme explicite.

Ajouter un délai arbitraire pour "laisser le temps" à une race condition de se résoudre ne corrige rien : ça déplace juste le seuil de charge système où le bug redevient visible.

Pour investiguer un heisenbug : rejouer en boucle (20-50 fois minimum) pour mesurer un vrai taux d'échec avant de toucher au code. Un taux d'échec mesuré dit où regarder. Une intuition non vérifiée fait perdre des heures sur la mauvaise piste.

---

stability: intemporel

---

**EXO 5 : LE COMPTEUR PARTAGÉ SANS VERROU (déterministe 1/1000)**

Écris un compteur `incrementer(N)` qui lance N opérations `read -> +1 -> write`
en parallèle sur un même objet `{ total: 0 }`, chacune avec un `await` de délai
variable entre le read et le write. Objectif attendu : `total = N`.

Contrainte : sans verrou, tu dois pouvoir **prouver que ça casse au moins 1 fois
sur 1000** exécutions (drill : boucle 1000 runs, compte les runs où `total < N`,
fail si le taux est zéro : ça voudrait dire que ton race est _masqué_, pas absent).

Livrable : deux versions, `unsafe.js` (casse déterministe 1/1000) et `safe.js`
(mutex minimal, 0 casse sur 10 000 runs). Ajoute `RACE_LAB.md` qui explique
pourquoi le vrai bug est la _lecture périmée_, pas le délai.
