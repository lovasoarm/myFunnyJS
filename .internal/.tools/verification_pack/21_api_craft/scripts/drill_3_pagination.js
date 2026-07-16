// Pagination offset/limit : page 2, taille 3, sur 1..10.
const all=Array.from({length:10},(_,i)=>i+1);
function page(arr,p,size){const o=(p-1)*size;return arr.slice(o,o+size);}
process.stdout.write(page(all,2,3).join(','));