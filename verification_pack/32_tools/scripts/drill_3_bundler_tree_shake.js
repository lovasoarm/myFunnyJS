// Tree shaking retire les exports non importes. Symbole simple.
const used=['a','c'];const all=['a','b','c'];const shipped=all.filter(x=>used.includes(x));console.log(shipped.join(','))
