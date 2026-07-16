// Un dry-run n'ecrit rien. On log seulement l'intention.
const plan=[{op:'delete',path:'/tmp/x'}];console.log('dry:'+plan[0].op)
