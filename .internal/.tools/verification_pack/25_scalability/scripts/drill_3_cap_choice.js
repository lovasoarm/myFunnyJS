// CP vs AP : sous partition, un systeme CP refuse une ecriture; un AP l'accepte.
function cp(p){return p?'reject':'accept'}function ap(p){return 'accept'}console.log(cp(true)+' '+ap(true))
