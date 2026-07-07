// Hexagonal : port = interface, adapter = impl. On teste le port avec un fake.
function usecase(port,x){return port.multiply(x,2)}const fake={multiply:(a,b)=>a*b};console.log(usecase(fake,21))
