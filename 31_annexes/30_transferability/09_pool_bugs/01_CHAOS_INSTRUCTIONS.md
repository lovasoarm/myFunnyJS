---
stability: intemporel
---

# CHAOS INSTRUCTIONS : casser un projet volontairement pour s'entraîner

Temps de lecture ~2 min


Si tu n'as pas de "vrai" bug historique, tu peux fabriquer ton propre terrain
d'entraînement en 15 min. Le but : t'entraîner à lire du code inconnu.

## Protocole

1. Clone un projet que tu ne connais pas (starter Rust, exemple asyncio Python).
2. Fais `git checkout -b sabotage`.
3. Applique **UNE** des 5 mutations ci-dessous, en aveugle (choisi par un tiers).
4. Attends 24h (tu oublieras ce que tu as fait).
5. Redébugge comme si c'était un legacy inconnu.

## Les 5 mutations calibrées

- **M1** : inverser un opérateur (`>` → `<`) dans une fonction non couverte par les tests.
- **M2** : supprimer un `await` sur une fonction async.
- **M3** : passer un `Arc<Mutex<T>>` par valeur au lieu d'une référence (Rust).
- **M4** : capturer une variable de boucle dans une closure (JS/Python) au lieu de la copier.
- **M5** : changer un `==` en `is` (Python, catastrophe sur les entiers > 256).

## Livrable

Un `SABOTAGE_REPORT.md` où tu compares ton hypothèse initiale, le vrai bug, et le
temps qu'il t'a fallu. C'est là que tu vois si ta méthode tient hors terrain connu.
