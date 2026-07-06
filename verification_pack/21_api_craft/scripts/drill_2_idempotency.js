// PUT est idempotent (rejouer ne change rien), POST ne l'est pas.
let put={v:0}, post={n:0};
function PUT(){put.v=1;} function POST(){post.n+=1;}
PUT();PUT();POST();POST();
process.stdout.write(`PUT:${put.v} POST:${post.n}`);