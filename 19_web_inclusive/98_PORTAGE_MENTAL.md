---
stability: intemporel
scope: portage mental (Pierre 6 : Pensee Transferable)
---

# 98_PORTAGE_MENTAL.md : ce concept en Python / Go / Rust

Module : **19_web_inclusive** : a11y, i18n, inclusion.

Encart obligatoire (Pierre 6 : Pensee Transferable). 3 lignes.
Objectif : prouver que ce que tu viens d'apprendre n'est pas _JS_, c'est
un concept d'ingenierie que tu retrouveras ailleurs.

- **Python** : Python : cote back, meme regles a11y/i18n dans les templates (Jinja) ; `gettext`/`babel` pour i18n ; ARIA reste cote client.
- **Go** : Go : cote serveur, memes regles ; i18n via `golang.org/x/text` ; templates `html/template` echappent par defaut (moins de XSS).
- **Rust** : Rust : templates via `askama`/`tera` avec echappement par defaut ; i18n via `fluent-rs` ; regles a11y identiques cote HTML.

## Auto-test (1 min)

Ferme ce fichier. Ecris de tete, en 3 lignes, comment tu ferais la meme chose
en Python, Go, Rust. Rouvre. Compare. Ce que tu n'as pas su ecrire, c'est ce
qui reste postule sur la Pierre 6 : c'est la ta prochaine micro-lecture.
