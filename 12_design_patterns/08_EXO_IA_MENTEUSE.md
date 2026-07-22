---
stability: intemporel
last_reviewed: 2026-07
depends_on_vendor: false
---
# EXO [IA MENTEUSE] : design_patterns (singleton qui fuit)

Temps de lecture ~2 min


> Tag `[IA MENTEUSE]` : une IA a généré ce code. Il tourne. Il a l'air propre. Il ment.
> Durée : 20 min chrono. Zéro exécution avant d'avoir écrit ta réponse.

## Contexte

Tu demandes à une IA générique d'écrire des tests pour `LabManager` (voir `02_singleton_pattern.md`), le singleton qui gère le labo. Voici ce qu'elle génère :

```js
describe("LabManager", () => {
 it("stocke un lot correctement", () => {
  const lab = new LabManager("Walter White", "Superlab");
  lab.addBatch(99.1, 50);
  expect(lab.batches.length).toBe(1);
 });

 it("démarre avec un labo vide", () => {
  const lab = new LabManager("Jesse Pinkman", "RV");
  expect(lab.batches.length).toBe(0);
 });

 it("garde le bon cook associé", () => {
  const lab = new LabManager("Gustavo", "Los Pollos");
  expect(lab.cook).toBe("Gustavo");
 });
});
```

L'IA t'assure : "ces trois tests sont indépendants, chacun crée sa propre instance de `LabManager` avec des données différentes, donc ils passeront quel que soit l'ordre d'exécution."

## Consigne

Avant de lancer une seule ligne :

1. Prédis lesquels des trois tests passent et lesquels échouent, dans l'ordre où ils sont écrits.
2. Identifie la phrase de l'IA qui est fausse, en te basant sur le fonctionnement réel du `constructor` de `LabManager`.
3. Corrige les tests pour qu'ils soient vraiment indépendants, sans toucher à la classe `LabManager` elle-même.

Ensuite seulement, lance les tests et compare à ta prédiction.

## Piège caché

`LabManager` est un singleton : un seul `new LabManager(...)` compte vraiment, tous les suivants retournent la même instance sans rien écraser (voir la section implémentation du pattern). Le premier test crée le singleton avec Walter White et un lot. Le deuxième test croit créer un labo vide avec Jesse Pinkman, mais récupère en fait l'instance de Walter avec son lot déjà dedans. Le test "indépendant" dépend en réalité de l'ordre d'exécution des tests précédents.

## Preuve à livrer

- ta prédiction écrite AVANT exécution (`prediction.txt`)
- le diff entre ta prédiction et le résultat réel
- ta version corrigée des tests, utilisant `LabManager.reset()` au bon endroit, avec une phrase qui explique pourquoi c'est là et pas ailleurs

## Pourquoi c'est vital

Un singleton qui fuit son état entre tests est un des bugs les plus difficiles à tracer en CI, parce qu'il ne se voit que quand l'ordre des tests change, et un simple `npm test` en local peut sembler tout vert pendant des semaines. Une IA qui génère un test sans connaître le cycle de vie réel de l'objet testé produit un piège à retardement.
