// Bug attendu : un compteur qui "oublie" une mise à jour.
// L'utilisateur clique 3 fois rapidement sur "+3", il s'attend à +9,
// il obtient +3 (une seule des trois updates est prise en compte).

import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  function handleTriple() {
    // BUG : trois appels avec la MÊME valeur de count (capturée à l'entrée
    // de la fonction). Les 3 updates écrasent la même valeur.
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={handleTriple}>{count} +3</button>;
}

// FIX (ne le donner qu'après identification) :
// - passer une fonction à setCount : setCount((c) => c + 1)
// - React garantit alors que chaque update utilise la valeur la plus récente.

// Question de debug clé : "sur quelle valeur de count opère chaque setCount ?"
// Si le debugger dit "sur la même", il a trouvé.
