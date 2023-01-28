import { alphaCodeOf, alphaUpperCaseOf, isAlpha } from "./utils/char";
import { inverseMod, mod } from "./utils/math";

class AffineCipher {
	private inverseModulus: number;
  private inverseModulusBytes: number;
	constructor(
		private readonly multiplier: number,
		private readonly offset: number
	) {
		this.inverseModulus = inverseMod(multiplier, 1, 26);
    this.inverseModulusBytes = inverseMod(multiplier, 1, 256);
	}

	encryptBytes(source: Uint8Array): Uint8Array {
		const encrypted = [];
		for (let i = 0; i < source.length; i++) {
			const char = source[i];
			const newAlphaCode = mod(
				char * this.multiplier + this.offset,
				256
			);
			encrypted.push(newAlphaCode);
		}

		return new Uint8Array(encrypted);
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

	decryptBytes(source: Uint8Array): Uint8Array {
		const decrypted = [];
		for (let i = 0; i < source.length; i++) {
			const char = source[i];
			const newAlphaCode = mod(
				(char - this.offset) * this.inverseModulusBytes,
				256
			);
			decrypted.push(newAlphaCode);
		}

		return new Uint8Array(decrypted);
  }
}

export { AffineCipher };
