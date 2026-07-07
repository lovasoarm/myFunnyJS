// Un index bien pose transforme O(n) en O(log n) pour une lookup.
const rows=Array.from({length:1000},(_,i)=>({id:i,v:i*2}));const byId=new Map(rows.map(r=>[r.id,r]));console.log(byId.get(777).v)
