import {
  alphaCodeOf,
  alphaUpperCaseOf,
  isAlpha,
  NON_ALPHA,
} from "./utils/char";
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
  constructor(
    protected matrix: VigenereEncoder,
    protected key: string,
    protected ignoreNonLetters: boolean = true
  ) {}

  protected static readonly STANDARD_ENCODER = new AlphaShifter();
  protected static readonly BYTE_ENCODER = new ByteShifter();

  static standard(key: string): VigenereCipher {
    return new VigenereCipher(VigenereCipher.STANDARD_ENCODER, key);
  }

  static extended(key: string): VigenereCipher {
    return new VigenereCipher(VigenereCipher.BYTE_ENCODER, key, false);
  }

  static autoKey(key: string): VigenereCipher {
    return new AutoKeyVigenereCipher(key);
  }

  setKey(key: string) {
    this.key = key;
  }

  encryptString(source: string): string {
    const encrypted = [];
    let index = 0;

    for (let i = 0; i < source.length; i++) {
      const char = source.charCodeAt(i);
      if (this.ignoreNonLetters && !isAlpha(char)) {
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
      if (this.ignoreNonLetters && !isAlpha(char)) {
        continue;
      }
      const keyByte = this.key.charCodeAt(index % this.key.length);
      encrypted.push(this.matrix.encode(char, keyByte));
      index++;
    }

    return new Uint8Array(encrypted);
  }

  decryptString(encrypted: string): string {
    const source = [];
    let index = 0;

    for (let i = 0; i < encrypted.length; i++) {
      const char = encrypted.charCodeAt(i);
      if (this.ignoreNonLetters && !isAlpha(char)) {
        continue;
      }

      const keyChar = this.key.charCodeAt(index % this.key.length);
      source.push(this.matrix.decode(char, keyChar));
      index++;
    }

    return String.fromCharCode(...source);
  }

  decryptBytes(encrypted: Uint8Array): Uint8Array {
    const source = [];
    let index = 0;

    for (let i = 0; i < encrypted.length; i++) {
      const char = encrypted[i];
      if (this.ignoreNonLetters && !isAlpha(char)) {
        continue;
      }
      const keyByte = this.key.charCodeAt(index % this.key.length);
      source.push(this.matrix.decode(char, keyByte));
      index++;
    }

    return new Uint8Array(source);
  }
}

class AutoKeyVigenereCipher extends VigenereCipher {
  constructor(key: string) {
    super(VigenereCipher.STANDARD_ENCODER, key);
  }

  override encryptString(source: string): string {
    const sanitizedSource = source.replaceAll(NON_ALPHA, "");
    const encrypted = [];
    let index = 0;

    for (let i = 0; i < sanitizedSource.length; i++) {
      const char = sanitizedSource.charCodeAt(i);
      const keyChar =
        index < this.key.length
          ? this.key.charCodeAt(index)
          : sanitizedSource.charCodeAt(index - this.key.length);
      encrypted.push(this.matrix.encode(char, keyChar));
      index++;
    }

    return String.fromCharCode(...encrypted);
  }

  override decryptString(encrypted: string): string {
    const sanitizedEncrypted = encrypted.replaceAll(NON_ALPHA, "");
    const source = [];
    let index = 0;

    for (let i = 0; i < sanitizedEncrypted.length; i++) {
      const char = sanitizedEncrypted.charCodeAt(i);
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

  override encryptBytes(source: Uint8Array): Uint8Array {
    const sanitizedSource = source.filter(isAlpha);
    const encrypted = [];
    let index = 0;

    for (let i = 0; i < sanitizedSource.length; i++) {
      const char = sanitizedSource[i];
      if (this.ignoreNonLetters && !isAlpha(char)) {
        continue;
      }
      const keyByte =
        index < this.key.length
          ? this.key.charCodeAt(index % this.key.length)
          : sanitizedSource[index - this.key.length];
      encrypted.push(this.matrix.encode(char, keyByte));
      index++;
    }

    return new Uint8Array(encrypted);
  }

  override decryptBytes(encrypted: Uint8Array): Uint8Array {
    const sanitizedEncrypted = encrypted.filter(isAlpha);
    const source = [];
    let index = 0;

    for (let i = 0; i < sanitizedEncrypted.length; i++) {
      const char = sanitizedEncrypted[i];
      if (this.ignoreNonLetters && !isAlpha(char)) {
        continue;
      }
      const keyByte =
        index < this.key.length
          ? this.key.charCodeAt(index % this.key.length)
          : source[index - this.key.length];
      source.push(this.matrix.decode(char, keyByte));
      index++;
    }

    return new Uint8Array(source);
  }
}

export { VigenereCipher, type VigenereEncoder };
