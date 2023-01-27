import { alphaCodeOf, alphaUpperCaseOf } from "./utils/char";
import { inverseMod, mod } from "./utils/math";

class AffineCipher {
  private inverseModulus: number;

  constructor(
    private readonly multiplier: number,
    private readonly offset: number
  ) {
    this.inverseModulus = inverseMod(multiplier, 1, 26);
  }

  encrypt(source: string): string {
    const encrypted = [];

    for (let i = 0; i < source.length; i++) {
      const char = source.charCodeAt(i);
      const newAlphaCode = mod(
        alphaCodeOf(char) * this.multiplier + this.offset,
        26
      );
      encrypted.push(alphaUpperCaseOf(newAlphaCode));
    }

    return String.fromCharCode(...encrypted);
  }

  decrypt(encrypted: string): string {
    const source = [];

    for (let i = 0; i < encrypted.length; i++) {
      const char = encrypted.charCodeAt(i);
      const newAlphaCode = mod(
        (alphaCodeOf(char) - this.offset) * this.inverseModulus,
        26
      );
      source.push(alphaUpperCaseOf(newAlphaCode));
    }

    return String.fromCharCode(...source);
  }
}

export { AffineCipher };
