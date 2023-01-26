import { alphaCodeOf, alphaUpperCaseOf, isAlpha } from "./utils/char";
import { mod } from "./utils/math";

interface VigenereEncoder {
  encode(char: number, key: number): number;
  decode(char: number, key: number): number;
}

class AlphaShifter implements VigenereEncoder {
  constructor() {}
  encode(char: number, key: number): number {
    return alphaUpperCaseOf(mod(alphaCodeOf(char) + alphaCodeOf(key), 26));
  }

  decode(char: number, key: number): number {
    return alphaUpperCaseOf(mod(alphaCodeOf(char) - alphaCodeOf(key), 26));
  }
}

class ByteShifter implements VigenereEncoder {
  constructor() {}

  encode(byte: number, key: number): number {
    return mod(byte + key, 256);
  }

  decode(byte: number, key: number): number {
    return mod(byte - key, 256);
  }
}

class VigenereCipher {
  constructor(protected matrix: VigenereEncoder, protected key: string) {}

  protected static readonly STANDARD_ENCODER = new AlphaShifter();
  protected static readonly BYTE_ENCODER = new ByteShifter();

  static standard(key: string): VigenereCipher {
    return new VigenereCipher(VigenereCipher.STANDARD_ENCODER, key);
  }

  static extended(key: string): VigenereCipher {
    return new VigenereCipher(VigenereCipher.BYTE_ENCODER, key);
  }

  static autoKey(key: string): VigenereCipher {
    return new AutoKeyVigenereCipher(key);
  }

  setKey(key: string) {
    this.key = key;
  }

  encryptString(source: string, ignoreNonLetters: boolean = true): string {
    const encrypted = [];
    let index = 0;

    for (let i = 0; i < source.length; i++) {
      const char = source.charCodeAt(i);
      if (ignoreNonLetters && !isAlpha(char)) {
        encrypted.push(char);
        continue;
      }

      const keyChar = this.key.charCodeAt(index % this.key.length);
      encrypted.push(this.matrix.encode(char, keyChar));
      index++;
    }

    return String.fromCharCode(...encrypted);
  }

  encryptBytes(source: Uint8Array): Uint8Array {
    const encrypted = [];
    let index = 0;

    for (let i = 0; i < source.length; i++) {
      const char = source[i];
      const keyByte = this.key.charCodeAt(index % this.key.length);
      encrypted.push(this.matrix.encode(char, keyByte));
      index++;
    }

    return new Uint8Array(encrypted);
  }

  decryptString(encrypted: string, ignoreNonLetters: boolean = true): string {
    const source = [];
    let index = 0;

    for (let i = 0; i < encrypted.length; i++) {
      const char = encrypted.charCodeAt(i);
      if (ignoreNonLetters && !isAlpha(char)) {
        source.push(char);
        continue;
      }

      const keyChar = this.key.charCodeAt(index % this.key.length);
      source.push(this.matrix.decode(char, keyChar));
      index++;
    }

    return String.fromCharCode(...source);
  }

  decryptBytes(source: Uint8Array): Uint8Array {
    const encrypted = [];
    let index = 0;

    for (let i = 0; i < source.length; i++) {
      const char = source[i];
      const keyByte = this.key.charCodeAt(index % this.key.length);
      encrypted.push(this.matrix.decode(char, keyByte));
      index++;
    }

    return new Uint8Array(encrypted);
  }
}

class AutoKeyVigenereCipher extends VigenereCipher {
  constructor(key: string) {
    super(VigenereCipher.STANDARD_ENCODER, key);
  }

  override encryptString(
    source: string,
    ignoreNonLetters: boolean = true
  ): string {
    const encrypted = [];
    const keySource = source.replaceAll(/[^A-Za-z]/g, "");
    let index = 0;

    for (let i = 0; i < source.length; i++) {
      const char = source.charCodeAt(i);
      if (!isAlpha(char)) {
        continue;
      }

      const keyChar =
        index < this.key.length
          ? this.key.charCodeAt(index)
          : keySource.charCodeAt(index - this.key.length);
      encrypted.push(this.matrix.encode(char, keyChar));
      index++;
    }

    return String.fromCharCode(...encrypted);
  }

  override decryptString(
    encrypted: string,
    ignoreNonLetters: boolean = true
  ): string {
    const source = [];
    let index = 0;

    for (let i = 0; i < encrypted.length; i++) {
      const char = encrypted.charCodeAt(i);
      if (!isAlpha(char)) {
        continue;
      }

      const keyChar =
        index < this.key.length
          ? this.key.charCodeAt(index)
          : source[index - this.key.length];

      source.push(this.matrix.decode(char, keyChar));
      index++;
    }

    return String.fromCharCode(...source);
  }
}

export { VigenereCipher, type VigenereEncoder };
