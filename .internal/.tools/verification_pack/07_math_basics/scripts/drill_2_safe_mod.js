// Arithmétique modulaire sûre : le % de JS garde le signe du dividende.
// Un vrai modulo mathématique reste positif. -7 mod 3 doit valoir 2, pas -1.
function mod(a,m){return ((a%m)+m)%m;}
process.stdout.write(String(mod(-7,3)));