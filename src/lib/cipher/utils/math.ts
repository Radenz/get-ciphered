function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

function gcd(a: number, b: number) {
  if (b > a) return gcd(b, a);

  return a % b == 0 ? b : gcd(b, a % b);
}

function inverseMod(multiplier: number, remainder: number, modulus: number) {
  const modulusGcd = gcd(multiplier, modulus);

  if (remainder % multiplier == 0) {
    return remainder / multiplier;
  }

  multiplier /= modulusGcd;
  modulus /= modulusGcd;
  remainder /= modulusGcd;

  multiplier = mod(multiplier, modulus);
  remainder = mod(remainder, modulus);

  const newMultiplier = modulus % multiplier;
  const newModulus = multiplier;
  const newRemainder = mod(-remainder, multiplier);
  const addition = inverseMod(newMultiplier, newRemainder, newModulus);
  const inverse = (addition * modulus + remainder) / multiplier;
  return mod(inverse, modulus);
}

export { mod, gcd, inverseMod };
