import {
	alphaCodeOf,
	alphaUpperCaseOf,
	isAlpha,
	NON_ALPHA,
} from "./utils/char";
import { ModulusMatrix } from "./utils/math";

type Rotor = [string, string, string];
type Position = [number, number, number];
class EnigmaCipher {
	private rotor: Rotor;
	private position: Position;
	private tick1: number;
	private tick2: number;
	private plugboard: string;

	constructor(
		private readonly rotor1: string,
		private readonly rotor2: string,
		private readonly rotor3: string,
		private readonly position1: number,
		private readonly position2: number,
		private readonly position3: number,
		private readonly pl: string,
		private readonly reflector: string
	) {
		this.rotor = [rotor1, rotor2, rotor3];
		this.position = [position1, position2, position3];
		this.plugboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var source = pl.replace(/\s/g, "");
		for (let i = 0; i < source.length; i += 2) {
			var a = this.plugboard
				.replace(source[i], "0")
				.replace(source[i + 1], "1");
			this.plugboard = a.replace("1", source[i]).replace("0", source[i + 1]);
		}
		this.reflector = reflector;
	}

	encrypt(source: string): string {
		const encrypted = [];
		for (let i = 0; i < source.length; i++) {
			var code = source.charCodeAt(i);
			if (!isAlpha(code)) {
				continue;
			}
			code = this.plugboard.charCodeAt(alphaCodeOf(code) % 26);

			// left to right rotor encrpt
			for (let j = 0; j < 3; j++) {
				code = this.rotor[j].charCodeAt(
					(alphaCodeOf(code) + this.position[j]) % 26
				);
			}

			// reflector
			code = this.reflector.charCodeAt(alphaCodeOf(code));

			//right to left rotor
			for (let j = 2; j >= 0; j--) {
				if (j != 2) {
					code = alphaUpperCaseOf(code % 26);
				}

				code =
					(this.rotor[j].indexOf(String.fromCharCode(code)) -
						this.position[j] +
						26) %
					26;
			}

			// plugboard again
			code = this.plugboard.charCodeAt(code);
			encrypted.push(code);

			this.spinrotor();
		}
		return String.fromCharCode(...encrypted);
	}

	encryptBytes(source: Uint8Array): Uint8Array {
		const sanitizedSource = source.filter(isAlpha);
		const encrypted = [];
		for (let i = 0; i < sanitizedSource.length; i++) {
			var code = sanitizedSource[i];
			if (!isAlpha(code)) {
				continue;
			}
			code = this.plugboard.charCodeAt(alphaCodeOf(code) % 26);

			// left to right rotor encrpt
			for (let j = 0; j < 3; j++) {
				code = this.rotor[j].charCodeAt(
					(alphaCodeOf(code) + this.position[j]) % 26
				);
			}

			// reflector
			code = this.reflector.charCodeAt(alphaCodeOf(code));

			//right to left rotor
			for (let j = 2; j >= 0; j--) {
				if (j != 2) {
					code = alphaUpperCaseOf(code % 26);
				}

				code =
					(this.rotor[j].indexOf(String.fromCharCode(code)) -
						this.position[j] +
						26) %
					26;
			}

			// plugboard again
			code = this.plugboard.charCodeAt(code);
			encrypted.push(code);

			this.spinrotor();
		}
		return new Uint8Array(encrypted);
	}

	decrypt(source: string) {
		return this.encrypt(source);
	}

	decryptBytes(source: Uint8Array): Uint8Array {
		return this.encryptBytes(source);
	}

	/*
    Every letters, the first rotor will make one tick
    Every 26th tick of the first rotor, the second one will make one tick
    Every 26th tick of the second rotor, the third one will make one tick
    */
	spinrotor() {
		this.position[0] = (this.position[0] + 1) % 26;
		this.tick1++;
		if (this.tick1 == 26) {
			this.position[1] = (this.position[1] + 1) % 26;
			this.tick2 += 1;
			this.tick1 = 0;
		}
		if (this.tick2 == 26) {
			this.position[2] = (this.position[2] + 1) % 26;
			this.tick2 = 0;
		}
	}
}
export { EnigmaCipher };
