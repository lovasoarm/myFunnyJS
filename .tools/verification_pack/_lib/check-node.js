#!/usr/bin/env node
// Refuse de lancer un test si la version majeure de Node ne matche pas .nvmrc.
// Message pedagogique, code de sortie 1 sinon.
const fs = require("fs");
const path = require("path");

function findNvmrc(start) {
  let dir = start;
  for (let i = 0; i < 10; i++) {
    const p = path.join(dir, ".nvmrc");
    if (fs.existsSync(p)) return p;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

const nvmrc = findNvmrc(process.cwd());
if (!nvmrc) {
  console.error("[CHECK_NODE] .nvmrc introuvable. Lance depuis la racine MyFunnyJS.");
  process.exit(1);
}
const expected = fs.readFileSync(nvmrc, "utf8").trim().replace(/^v/, "").split(".")[0];
const actual = process.version.replace(/^v/, "").split(".")[0];
if (expected !== actual) {
  console.error(
    `[CHECK_NODE] Tu es sur Node ${process.version}, ce curriculum attend Node ${expected} (.nvmrc).`
  );
  console.error("  Fix rapide (nvm) : nvm install " + expected + " && nvm use " + expected);
  process.exit(1);
}
