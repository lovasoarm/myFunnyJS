// DIP : la classe haute depend d'une interface, pas d'une impl.
class Notifier{constructor(sender){this.s=sender}send(m){return this.s.push(m)}}const fake={q:[],push(m){this.q.push(m);return 'sent'}};const n=new Notifier(fake);console.log(n.send('hi'))
