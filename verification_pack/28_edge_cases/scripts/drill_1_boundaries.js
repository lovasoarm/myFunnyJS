// Boundaries : 0, 1, MAX, -1, undefined.
function safe(n){return Number.isFinite(n)?n:0}console.log(safe(undefined)+','+safe(1e308)+','+safe(-1))
