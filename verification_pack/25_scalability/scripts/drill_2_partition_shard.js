// Sharding par hash modulo : la meme cle atterrit sur le meme shard.
function h(k){let s=0;for(const c of k)s=(s*31+c.charCodeAt(0))|0;return Math.abs(s)%4}console.log(h('rick')===h('rick')?'stable':'ko')
