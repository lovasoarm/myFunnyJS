// La closure JS = la closure Python = la closure Rust (avec &move).
function adder(x){return y=>x+y}console.log(adder(2)(3))
