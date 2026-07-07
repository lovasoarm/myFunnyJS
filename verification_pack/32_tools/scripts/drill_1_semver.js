// SemVer : MAJOR.MINOR.PATCH. Un breaking change bump MAJOR.
function bump(v,kind){const[a,b,c]=v.split('.').map(Number);if(kind==='major')return`${a+1}.0.0`;if(kind==='minor')return`${a}.${b+1}.0`;return`${a}.${b}.${c+1}`}console.log(bump('1.2.3','major'))
