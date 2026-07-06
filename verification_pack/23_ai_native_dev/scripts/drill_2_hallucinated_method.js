// Détecter une méthode Array hallucinée par une IA (n'existe pas dans le runtime).
const calls=['map','flatten','filter','reduce'];
const hallucinated=calls.filter(m=>typeof Array.prototype[m]!=='function');
process.stdout.write(hallucinated.join(','));