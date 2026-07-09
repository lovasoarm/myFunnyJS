---
stability: intemporel
---

# ADR-001 : pipeline d'événements typé TypeScript avec génériques de bout en bout
Temps de lecture ~6 min

## Statut
Accepté : 2026-01

## Contexte
L'Ultras Dashboard ingère des événements de match en temps réel (possession, xG, passes, alertes) à raison de 200 events par minute. Chaque event traverse plusieurs étapes : réception → validation → enrichissement → stockage → diffusion aux clients. La question d'architecture centrale est : comment typer ce pipeline pour que chaque étape sache exactement ce qu'elle reçoit et ce qu'elle produit, sans avoir à inspecter le contenu à runtime ?

Le projet couvre `14_typescript`, `26_observability`, `25_scalability`. Le système de types est la contrainte centrale : si un event mal formé traverse le pipeline sans être intercepté, les ultras voient des données corrompues en direct pendant un match : pas acceptable.

## Décision
On utilise des génériques TypeScript sur tout le pipeline : `Event<T>`, `Pipeline<Input, Output>`, `Validator<T>`. Chaque étape est une fonction typée qui reçoit un type précis et retourne un type précis. Le compilateur TS (`tsc --noImplicitAny --noEmit`) valide le typage complet avant tout lancement.

```typescript
// Le pipeline est un type, pas juste une convention
type Pipeline<In, Out> = (input: In) => Promise<Out>;

// Chaque étape est typée explicitement
const valider: Pipeline<RawEvent, ValidatedEvent> = async (raw) => { ... };
const enrichir: Pipeline<ValidatedEvent, EnrichedEvent> = async (validated) => { ... };
const diffuser: Pipeline<EnrichedEvent, void> = async (enriched) => { ... };

// Composer ne compile que si les types s'enchaînent correctement
const pipeline = compose(valider, enrichir, diffuser);
//        ^ erreur TS si ValidatedEvent !== input de enrichir
```

## Alternatives considérées

**JavaScript avec JSDoc pour le typage**
- Avantages : pas de compilation, setup plus simple, les types sont documentaires mais pas bloquants
- Limites : le compilateur ne bloque pas un `event.xG` undefined qui traverse tout le pipeline et affiche `NaN` sur le dashboard pendant El Clásico
- Rejeté parce que : ce projet est précisément l'occasion de démontrer que TS bloque au compile time ce que JS laisse passer au runtime : la valeur de TS est nulle si on ne l'utilise pas sur ce genre de pipeline

**TypeScript avec types any/unknown sur les events**
- Avantages : moins de travail à la définition initiale, on type progressivement
- Limites : `any` désactive les checks sur les étapes concernées ; `unknown` oblige des type guards à chaque étape plutôt qu'une signature claire
- Rejeté parce que : la leçon sur les génériques et les utility types (Readonly, Pick, Omit, Record) ne peut être enseignée qu'en les utilisant réellement sur des structures non triviales : un event de match avec 15 champs est exactement le bon terrain d'entraînement

## Conséquences

Gains :
- le compilateur bloque les erreurs de typage avant l'exécution : si `EnrichedEvent` n'a pas le champ `xG`, `tsc` refuse de compiler
- les types servent de documentation vivante : un nouveau contributeur voit exactement ce que chaque étape du pipeline attend en entrée et retourne en sortie
- `Readonly<EnrichedEvent>` garantit que l'étape de diffusion ne mute pas l'event qu'elle transmet : les effets de bord involontaires disparaissent

Sacrifices :
- la phase de définition des interfaces (RawEvent, ValidatedEvent, EnrichedEvent) prend du temps avant de coder la logique : c'est la bonne habitude à prendre, mais elle ralentit le démarrage
- `ts-jest` ajoute une étape de transpilation aux tests : le feedback loop est légèrement plus lent qu'avec du Jest pur JS (compensé par la détection d'erreurs avant même de lancer les tests)

Décisions liées :
- ADR-002 portera sur la stratégie de logging structuré avec correlation IDs : chaque event reçoit un `traceId` unique à l'ingestion, propagé à toutes les étapes pour le distributed tracing
- ADR-003 portera sur la simulation de scale horizontal : plusieurs instances Node avec un message bus en mémoire (vs un vrai Redis pub/sub)
