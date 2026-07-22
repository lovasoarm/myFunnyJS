// scenario_3_react_stale_state.jsx : un state React "oublie" une update.
// Symptome cote debugger aveugle : "je clique 3 fois vite, le compteur ne bouge
// que de 1". Le tenant du code voit le fichier, le debugger non.

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    // Bug : on lit `count` capture par la closure au moment du render.
    // Trois clics rapides = trois handlers qui voient tous count === 0
    // et posent tous setCount(1). Fix : forme fonctionnelle setCount(c => c + 1).
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {count}
    </button>
  );
}
