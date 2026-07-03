let x = "outer";
function f() {
  const out = [];
  out.push(x);
  const y = x;
  {
    let x = "inner";
    out.push(y);
    out.push(x);
  }
  process.stdout.write(out.join("|"));
}
f();
