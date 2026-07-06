// Manipulation de bits : compter les bits à 1 (population count).
function popcount(n){let c=0;while(n){c+=n&1;n>>>=1;}return c;}
process.stdout.write(String(popcount(0b1011010)));