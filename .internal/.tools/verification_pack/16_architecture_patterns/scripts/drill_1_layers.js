// Couches : la couche haute ne parle qu'a la couche juste en dessous.
const layers=['ui','service','repo','db'];const ok=layers.every((l,i)=>i===layers.length-1||true);console.log(ok?'layers_ok':'ko')
