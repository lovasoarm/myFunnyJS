[← Sommaire TECH-ILA](../README.md)

# Niveau 5 : Transfert vers d'autres écosystèmes (section 8)

---

## 8 : Niveau 5 : Transfert vers d'autres écosystèmes

**Objectif de ce niveau : ne pas repartir de zéro.** Tu ne deviens pas développeur Java. Tu deviens quelqu'un qui peut lire du Java, comprendre l'intention, et reconnaître les mêmes mécanismes.

### 8.0 : La grille de lecture universelle

Devant n'importe quel écosystème backend, pose ces neuf questions. Les réponses te donnent 80 % de la compréhension :

```text
1. Où est le point d'entrée ?
2. Comment une requête arrive-t-elle jusqu'à ma fonction ? (routing)
3. Qui construit mes objets ? (DI ou pas)
4. Où est validée l'entrée ?
5. Comment les erreurs deviennent-elles des réponses HTTP ?
6. Comment parle-t-on à la base ? (ORM, requêtes, migrations)
7. Comment sont gérées la concurrence et l'asynchronie ?
8. Comment teste-t-on ?
9. Comment configure-t-on selon l'environnement ?
```

Imprime-les mentalement. C'est ta clé d'entrée dans toute codebase inconnue, y compris `31_annexes/00_cartographier_codebase_inconnue.md`.

---

### 8.1 : Python

**Tag : NOYAU DURABLE** (le langage, par son omniprésence) · Prérequis : bon niveau JS/TS

**Objectif ici : pas une formation Python complète.** Juste ce qui sert la transférabilité et les projets.

#### Ce que MyFunnyJS permet déjà de comprendre

- `03_async/03_async_await/` : `asyncio` reprend le même modèle ; `gather` ≈ `Promise.all`, avec une gestion d'erreur différente.
- `03_async/03_async_await/02b_generators_yield.md` : générateurs et `yield` existent presque à l'identique.
- `12_design_patterns/02_structural/01_decorator_pattern.md` : un décorateur Python est ce patron, avec une syntaxe native.
- `01_fundamentals/02_scope/02_closure_trap.md` : mêmes closures, une différence brutale : sans `nonlocal`, une affectation crée une variable locale.
- `11_functional_js/01_pure_functions.md` : compréhensions et fonctions pures : la transformation de données se raisonne pareil.

**Ce qui te surprendra en venant de JS :**

| JavaScript                   | Python                                     | Piège                                            |
| ---------------------------- | ------------------------------------------ | ------------------------------------------------ |
| `{}` blocs                   | indentation significative                  | un espace mal placé change la logique            |
| `undefined` et `null`        | `None` seul                                | moins de pièges de coercition (`28_edge_cases/`) |
| prototypes                   | classes réelles, MRO                       | l'héritage multiple existe                       |
| `async/await` sur event loop | `async/await` sur `asyncio`                | **très** proche, même modèle mental              |
| mono-thread par défaut       | threads réels mais GIL                     | le GIL limite le parallélisme CPU                |
| npm                          | pip / uv / poetry, environnements virtuels | l'isolation n'est pas automatique                |
| duck typing                  | duck typing + type hints                   | les hints ne sont pas vérifiés à l'exécution     |

**Ce qui est identique et te fait gagner des semaines :** closures, fonctions de première classe, décorateurs (le même pattern Decorator que `12_design_patterns/`), compréhensions ≈ `map`/`filter`, générateurs et `yield` (`03_async/03_async_await/02b_generators_yield.md`), contexte async.

**Où Python est incontournable :** data, machine learning, scripting système, automatisation, outillage interne, scientifique. Si tu touches à l'IA au-delà de l'appel d'API, tu croiseras Python.

#### FastAPI : **Tag : PROFESSIONNELLE**

Le point d'entrée le plus naturel pour un développeur JS/TS. Async natif, validation par Pydantic (l'équivalent exact de Zod), documentation OpenAPI générée, injection de dépendances par fonction.

```python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel, Field

class IngestBatch(BaseModel):
    stream_id: str
    events: list[str] = Field(min_length=1, max_length=1000)

app = FastAPI()

@app.post("/ingest", status_code=202)
async def ingest(batch: IngestBatch, queue = Depends(get_queue)):
    if not await queue.healthy():
        raise HTTPException(503, "ingest temporairement indisponible")
    await queue.publish(batch.stream_id, batch.events)
    return {"accepted": len(batch.events)}
```

Regarde ce code avec tes yeux de développeur NestJS : validation déclarative, DI, exception transformée en réponse HTTP, handler async. **Ce sont les mêmes idées.** Tu n'apprends pas un framework, tu changes de syntaxe.

**Ce qu'il ne résout pas.** Le GIL sur du CPU intensif (utilise des workers, ou du natif). Le déploiement Python reste plus artisanal que Node.

#### Django : **Tag : CONTEXTUELLE**

À l'opposé : tout est fourni (ORM, admin, auth, migrations, templates). Excellent pour un produit CRUD-lourd avec back-office, où l'interface d'administration générée fait gagner des mois. Coût : très opinionné, tu suis ses conventions ou tu souffres.

**Quand ne pas faire de Python.** Un frontend. Un service temps réel à très haute concurrence quand ton équipe est déjà bonne en Node. Un binaire à distribuer.

> **Exercice : portage.** Prends un service de 150 lignes que tu as écrit en Node (Express ou Nest). Porte-le en FastAPI. Puis écris une page : ce qui a été trivial, ce qui a résisté, ce qui t'a manqué, ce qui était **meilleur** en Python. Le but n'est pas le code, c'est la page.

**Connexion activée.** Async, décorateurs, validation, DI : tu viens de vérifier que ces quatre concepts ne t'appartenaient pas en tant que "trucs JavaScript". Ce sont des idées d'ingénierie. Tu es devenu portable.

---

### 8.2 : Java et Spring Boot

**Tag : CONTEXTUELLE** (mais énorme en banque, assurance, télécom, ERP, secteur public)

**Pourquoi t'y intéresser même si tu ne veux pas en faire.** Une part considérable du code d'entreprise en Europe tourne sur la JVM. Savoir le **lire** ouvre des portes ; refuser de le lire en ferme.

#### Ce que MyFunnyJS permet déjà de comprendre

- `16_architecture_patterns/02_solid_principles.md` : l'inversion de dépendance est exactement ce que fait le conteneur Spring.
- `12_design_patterns/02_structural/01_decorator_pattern.md` : les annotations Spring sont des décorateurs, et l'AOP un proxy.
- `18_oop_js/09_composition_vs_inheritance.md` : le débat est identique en Java, avec des outils plus stricts.
- `01_fundamentals/02_scope/02_closure_trap.md` : Java exige une variable capturée effectivement finale : le langage t'interdit le bug que JavaScript t'autorise.
- `03_async/07_shared_memory_concurrency.md` : de vrais threads, donc de la mémoire partagée : c'est le saut mental principal.

**Java moderne n'est plus le Java de 2005.** Records, `sealed interface`, pattern matching, `var`, `Optional`, streams, threads virtuels (concurrence massive sans callback). Le fossé avec TypeScript s'est réduit.

**Correspondances directes :**

| TypeScript / NestJS            | Java / Spring Boot                        |
| ------------------------------ | ----------------------------------------- |
| interface                      | `interface`, `record`                     |
| union discriminée              | `sealed interface` + pattern matching     |
| génériques                     | génériques (avec effacement de type)      |
| `@Injectable()` + constructeur | `@Component` / `@Service` + constructeur  |
| `@Controller`                  | `@RestController`                         |
| pipe de validation             | Bean Validation (`@Valid`, `@NotNull`)    |
| exception filter               | `@ControllerAdvice` + `@ExceptionHandler` |
| interceptor                    | AOP, filtres, `HandlerInterceptor`        |
| Prisma / TypeORM               | JPA / Hibernate                           |
| `.env`                         | `application.yml` + profils               |

**Ce que Spring ajoute.** Un conteneur d'inversion de contrôle très mature, une auto-configuration puissante, un écosystème complet (sécurité, data, batch, messagerie), et une culture de la stabilité : le code de 2018 compile encore.

**Ce qu'il masque : et qui pique.** L'auto-configuration. Ça marche… jusqu'au jour où ça ne marche pas, et tu dois comprendre pourquoi un bean a été créé, dans quel ordre, avec quel profil. La courbe est raide.

**Ce qu'il ne résout pas.** Les mêmes choses que partout : ton modèle de domaine, ton N+1 Hibernate (le classique absolu : chargement paresseux dans une boucle), tes décisions.

**Le modèle de concurrence change vraiment.** Java a de vrais threads. Beaucoup de code est bloquant, et c'est acceptable parce que le thread coûte peu (surtout avec les threads virtuels). Tu passes d'un monde "un thread, ne bloque jamais" à "beaucoup de threads, bloquer est normal". **C'est le principal saut mental**, et c'est le plus formateur : il te fait comprendre que l'event loop n'était pas une loi de l'univers, juste un choix de conception.

**Quand ne pas y aller.** Petite équipe, prototype rapide, service simple. Le coût de démarrage et la verbosité sont réels.

> **Exercice de lecture.** Ouvre un projet Spring Boot open source. Sans écrire une ligne, réponds aux neuf questions de la grille [8.0](#80--la-grille-de-lecture-universelle). Deux heures maximum. Tu ne sauras pas écrire du Spring. Tu sauras le lire : et c'est ce qu'on te demandera d'abord.

---

### 8.3 : .NET et C#

**Tag : CONTEXTUELLE** (fort en grande entreprise, secteur public, industrie, jeu vidéo via Unity)

**Pourquoi c'est intéressant pour un développeur TS.** C# et TypeScript ont le même concepteur principal. Beaucoup d'idées de TS viennent de C# : génériques, types nullables, `async/await` (C# l'a eu **avant** JavaScript).

#### Ce que MyFunnyJS permet déjà de comprendre

- `03_async/07_shared_memory_concurrency.md` : en C#, `await` n'implique pas un mono-thread ; la sécurité vis-à-vis de la concurrence redevient ton problème.
- `14_typescript/` : génériques, nullabilité, unions : la parenté avec C# va jusqu'au vocabulaire.
- `16_architecture_patterns/02_solid_principles.md` : la DI intégrée d'ASP.NET Core est le même principe qu'ailleurs.
- `28_edge_cases/02_floating_point.md` : `decimal` existe et sert exactement à ce que tu as déjà vu échouer avec des flottants.

| TypeScript         | C#                                                                       |
| ------------------ | ------------------------------------------------------------------------ |
| `async/await`      | `async/await` (l'original) : mais `Task` s'exécute vraiment en parallèle |
| interface          | `interface`, `record`                                                    |
| union discriminée  | hiérarchie + pattern matching                                            |
| `strictNullChecks` | types de référence nullables                                             |
| LINQ ≈             | `map`/`filter`/`reduce` chaînés                                          |
| DI NestJS          | DI intégrée au framework                                                 |

**ASP.NET Core** est mature, rapide, avec une DI de première classe, une configuration par environnement propre, et Entity Framework Core côté persistance. Le tooling (Visual Studio, Rider) est excellent.

**Le piège de transfert principal.** En C#, `await` n'implique pas un mono-thread. Ton code peut s'exécuter sur plusieurs threads réels : la sécurité vis-à-vis de la concurrence redevient ton problème. Un `Dictionary` partagé sans verrou est une bombe : chose que JavaScript t'avait épargnée. C'est `03_async/07_shared_memory_concurrency.md` qui devient soudain vital.

**Quand ne pas y aller.** Si aucune opportunité de ton marché ne l'exige. C'est le cas typique où on lit la fiche, on comprend le modèle, et on n'investit pas plus loin.

> **Exercice de transfert.** Écris en C# le plus petit programme qui prouve un bug que JavaScript t'avait épargné : incrémente un compteur partagé depuis huit tâches concurrentes, un million d'itérations chacune. Contraintes : lance-le cinq fois et note le total obtenu à chaque exécution, puis corrige avec un verrou ou une opération atomique et mesure le coût de la correction. Réutilise `03_async/07_shared_memory_concurrency.md` : explique en trois lignes pourquoi le même code en JavaScript aurait toujours donné le bon total. Piège réaliste : le résultat sera parfois correct : un bug de concurrence qui passe ne prouve rien, et c'est ce qui le rend dangereux. À observer : la variance des totaux entre exécutions, l'écart de temps avant/après correction, et le comportement avec une seule tâche. Vérification : cinq exécutions consécutives donnent exactement le même total après correction. Extension : réponds aux neuf questions de la grille [8.0](#80--la-grille-de-lecture-universelle) sur un projet ASP.NET Core open source, en deux heures maximum.

---

### 8.4 : Ce que le transfert t'apporte réellement

Après le niveau 5, tu ne dis plus "je suis développeur JavaScript". Tu dis :

> "Je connais les mécanismes. Je travaille principalement en TypeScript. Je peux lire du Python et du Java, et je sais ce qui change entre leurs modèles de concurrence."

Cette phrase est vérifiable en entretien. Elle vaut plus que dix lignes de logos sur un CV.

**Moment Thor.** Tu as compris que "apprendre un nouveau langage" ne veut presque rien dire. Ce qui compte, c'est de savoir quelles questions poser à un écosystème inconnu. Tu en as neuf.

---
