// Mapping domaine -> code HTTP. Un contrat d'API testable.
const map={ok:200,created:201,bad_input:400,unauthorized:401,forbidden:403,not_found:404,conflict:409};
const events=['not_found','forbidden','ok','bad_input','conflict'];
process.stdout.write(events.map(e=>map[e]).join(','));