[INTEMPOREL]

# HYPOTHESES_exemple.md : Sécurité (bypass d'autorisation)

Exemple rempli. Voir `../04_debugging/_TEMPLATE_HYPOTHESES.md`.

## 1. Hypothèses

- A : le middleware d'auth ne tourne pas sur la route `/admin/*`.
- B : le check de rôle compare des chaînes sensibles à la casse.
- C : le token JWT est vérifié sans contrôle d'`exp` ni d'`aud`.

## 2. Écartement

- B écartée : le check utilise déjà `role === 'admin'` strict.

## 3. Retenue

Hypothèse C : le vérificateur accepte un token expiré si `exp` est absent (défaut permissif).

## 4. Confirmation

- Expérience : forger un token sans `exp`, hit `/admin/reports`.
- Attendu : 401 si fix en place, 200 sinon.
- Observé : 200 avant fix (faille confirmée), 401 après avoir imposé `exp` obligatoire.
- Verdict : confirmée.

## 5. Fix

- Refuser tout token sans `exp`, `iat`, `aud`.
- Test `security_*.test.js` : matrice de tokens malformés qui doivent tous être rejetés.
