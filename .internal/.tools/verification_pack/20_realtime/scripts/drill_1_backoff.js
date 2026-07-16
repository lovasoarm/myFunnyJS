// Backoff exponentiel : 100,200,400,800,1600 (cap 1600).
function b(n){return Math.min(100*2**n,1600)}console.log([0,1,2,3,4,5].map(b).join(','))
