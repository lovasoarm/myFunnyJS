// Ordre tabindex : ne pas mettre de tabindex positif custom.
const nodes=[{tab:0},{tab:0},{tab:0}];console.log(nodes.every(n=>n.tab===0||n.tab===-1)?'ok':'ko')
