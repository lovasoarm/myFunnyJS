// Valider une sortie IA contre un schéma minimal (forme + types).
function validate(o){return !!o && typeof o.id==='string' && typeof o.rang==='string' && ['genin','chunin','jonin'].includes(o.rang);}
const good={id:'a1',rang:'jonin'}, bad={id:42,rang:'kage'};
process.stdout.write([validate(good),validate(bad)].join(','));