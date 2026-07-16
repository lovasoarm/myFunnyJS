// Un agent minimal : {name, args, result}.
const call={name:'add',args:[2,3],result:5};console.log(call.result===call.args.reduce((a,b)=>a+b,0)?'ok':'ko')
