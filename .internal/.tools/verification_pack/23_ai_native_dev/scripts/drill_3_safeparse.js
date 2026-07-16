// safeParse : renvoie success au lieu de lever. Gestion d'erreur propre.
function safeParse(v){const ok=Number.isInteger(v)&&v>=0;return ok?{success:true,data:v}:{success:false};}
process.stdout.write([safeParse(-1).success,safeParse(7).success].join(','));