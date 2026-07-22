---
stability: intemporel
---

# Drill : Pseudo-Rust
Temps de lecture ~5 min

Objectif P6 : montrer que ta méthode MyFunnyJS survit au changement de langage.


```rust
// pseudo-code
async fn main() {
  spawn(async { println!("A"); });
  println!("B");
  yield_now().await;
  println!("C");
}
```

- Ordre d'affichage attendu ?
- Compare avec `setTimeout(() => log("A"), 0); log("B"); await Promise.resolve(); log("C")` en JS.
- Où sont les micro/macrotasks ici ? Où est le scheduler ?


## Debrief à écrire (obligatoire)

- Qu'est-ce qui a été **identique** à JS ?
- Qu'est-ce qui a été **différent** ?
- Qu'est-ce que tu retiens pour la prochaine fois ?
