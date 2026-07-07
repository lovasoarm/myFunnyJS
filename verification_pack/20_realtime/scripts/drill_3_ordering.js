// Websocket at-least-once : on dedupe par id.
const msgs=[{id:1},{id:2},{id:1},{id:3}];const seen=new Set();const out=msgs.filter(m=>!seen.has(m.id)&&seen.add(m.id));console.log(out.map(m=>m.id).join(','))
