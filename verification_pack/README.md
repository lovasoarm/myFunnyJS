# verification_pack/

Filet déterministe. Chaque module qui a une sortie testable a un dossier ici
avec :

- `verify.sh` — exécute les drills, compare sortie/exit-code.
- `inputs/` — entrées attendues.
- `expected/` — sortie(s) de référence.

Toutes les vérifications tournent avec Node ≥ 20 (voir `../NODE_VERSIONS.md`).

## LANCER TOUT

```bash
bash verification_pack/verify_all.sh
```

## STRUCTURE

    verification_pack/
      README.md
      verify_all.sh
      _lib/
        assert.sh          # helpers bash (assert_eq, assert_exit)
        node_gate.sh       # bloque si Node < 20
      <module>/
        verify.sh
        inputs/
        expected/
