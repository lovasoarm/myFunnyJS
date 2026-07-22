// Bug : un compteur qui incremente trois fois "au meme tick" ne monte que de 1.
// Symptome : bouton clique => count passe de 0 a 1 puis reste a 1, alors qu'on
// attendait 3.

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  function bumpThreeTimes() {
    // Piege : chaque setCount lit la MEME valeur de closure (0), donc le dernier
    // gagne. On croit incrementer 3 fois, on ecrit 3 fois "1".
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={bumpThreeTimes}>{count}</button>;
}

// Fix attendu : utiliser la forme fonctionnelle setCount(c => c + 1)
// qui lit la version fraiche du state a chaque appel.
