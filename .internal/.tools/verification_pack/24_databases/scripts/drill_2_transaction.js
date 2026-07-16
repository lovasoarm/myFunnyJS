// Transaction all-or-nothing : simulation.
function tx(ops){const snap=JSON.stringify(state);try{ops.forEach(o=>o());return 'commit'}catch(e){Object.assign(state,JSON.parse(snap));return 'rollback'}}let state={x:0,y:0};tx([()=>state.x=1,()=>state.y=2]);console.log(state.x+','+state.y)
