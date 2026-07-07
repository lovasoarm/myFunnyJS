// Race : deux writes concurrentes. La derniere gagne (last-write-wins).
let x=0;const ops=[()=>x=1,()=>x=2];ops.forEach(o=>o());console.log(x)
