// Hash déterministe djb2 sur 32 bits non signés.
function djb2(s){let h=5381;for(const ch of s){h=(((h<<5)+h)+ch.charCodeAt(0))>>>0;}return h;}
process.stdout.write(String(djb2('thor')));