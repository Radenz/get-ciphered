import {
  alphaCodeOf,
  alphaUpperCaseOf,
  alphaLowerCaseOf,
  isAlpha,
} from "./utils/char";
import { gcd, inverseMod, mod } from "./utils/math";

class AffineCipher {
  private inverseModulus: number;
  private inverseModulusBytes: number;
  constructor(
    private readonly multiplier: number,
    private readonly offset: number
  ) {
    this.inverseModulus =
      gcd(26, multiplier) == 1 || multiplier == 0
        ? inverseMod(multiplier, 1, 26)
        : 0;
  }

  encryptBytes(source: Uint8Array): Uint8Array {
    const sanitizedSource = source.filter(isAlpha);
    const encrypted = [];

    for (let i = 0; i < sanitizedSource.length; i++) {
      const char = sanitizedSource[i];
      const newAlphaCode = mod(
        alphaCodeOf(char) * this.multiplier + Number(this.offset),
        26
      );
      encrypted.push(alphaUpperCaseOf(newAlphaCode));
    }

    return new Uint8Array(encrypted);
  }

  encrypt(source: string): string {
    const encrypted = [];

    for (let i = 0; i < source.length; i++) {
      const char = source.charCodeAt(i);
      if (!isAlpha(char)) {
        continue;
      }
      const newAlphaCode = mod(
        alphaCodeOf(char) * this.multiplier + Number(this.offset),
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
      if (!isAlpha(char)) {
        continue;
      }
      const newAlphaCode = mod(
        (alphaCodeOf(char) - this.offset) * this.inverseModulus,
        26
      );
      source.push(alphaUpperCaseOf(newAlphaCode));
    }

    return String.fromCharCode(...source);
  }

  decryptBytes(source: Uint8Array): Uint8Array {
    const decrypted = [];
    const sanitizedSource = source.filter(isAlpha);
    for (let i = 0; i < sanitizedSource.length; i++) {
      const char = sanitizedSource[i];
      const newAlphaCode = mod(
        (alphaCodeOf(char) - this.offset) * this.inverseModulus,
        26
      );
      decrypted.push(alphaUpperCaseOf(newAlphaCode));
    }

    return new Uint8Array(decrypted);
  }

  canDecrypt(): boolean {
    return this.inverseModulus !== 0;
  }
}

export { AffineCipher };
