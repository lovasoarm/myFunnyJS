// Invariant : la somme 1..n vaut n*(n+1)/2. On verifie sur n=100.
let s=0;for(let i=1;i<=100;i++)s+=i;console.log(s===100*101/2?'invariant_ok':'invariant_ko')
