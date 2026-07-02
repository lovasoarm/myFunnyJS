[INTEMPOREL]

# HYPOTHESES_exemple.md : Edge cases (race condition sur double clic)

Exemple rempli. Voir `../04_debugging/_TEMPLATE_HYPOTHESES.md`.

## 1. Hypothèses

- A : double clic déclenche deux `POST /transfer` en parallèle, débit x2.
- B : le backend est idempotent mais le front ne bloque pas le bouton.
- C : l'API renvoie 200 même si la deuxième requête est un doublon.

## 2. Écartement

- B partiel : bouton désactivé après click, mais seulement après le retour réseau (fenêtre 200 ms exploitable).

## 3. Retenue

Hypothèse A : entre le clic et le disable, un second clic humain ou synthétique passe.

## 4. Confirmation

- Expérience : simuler 2 clics à 50 ms d'écart dans Playwright, vérifier le nombre de POST dans le journal.
- Attendu : 1 POST si fix, 2 sinon.
- Observé : 2 POST avant fix, 1 après ajout d'`Idempotency-Key` + disable synchrone.
- Verdict : confirmée.

## 5. Fix

- Disable synchrone dès `onClick`.
- `Idempotency-Key` (UUID par intention) exigé côté serveur.
- Test `race_double_click.test.js` qui simule N clics rapides.
