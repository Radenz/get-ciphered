import { alphaCodeOf, NON_ALPHA, isAlpha, alphaUpperCaseOf } from "./utils/char";
import { ModulusMatrix } from "./utils/math";

class HillCipher {
	private inverseKey: ModulusMatrix;

	constructor(private readonly key: ModulusMatrix) {
		this.inverseKey = key.inverse();
	}

	encrypt(source: string): string {
		const chunks = source
			.replaceAll(NON_ALPHA, "")
			.match(new RegExp(`.{1,${this.key.rowSize}}`, "g"));
		const encryptedChunks = [];

		for (const chunk of chunks) {
			const chunkMatrix = toMatrix(chunk, this.key.rowSize);
			const encryptedMatrix = this.key.multiply(chunkMatrix);
			encryptedMatrix.mod(26);
			const encryptedChunk = encryptedMatrix.toString();
			encryptedChunks.push(encryptedChunk);
		}

		return encryptedChunks.join("");
	}

	encryptBytes(source: Uint8Array): Uint8Array {
		const chunks = [];
		const sanitizedSource = source.filter(isAlpha);
		for (let i = 0; i < sanitizedSource.length; i += this.key.rowSize) {
			chunks.push(
				sanitizedSource.slice(
					i,
					Math.min(i + this.key.rowSize, sanitizedSource.length)
				)
			);
		}
		const encryptedChunks = [];

		for (const chunk of chunks) {
			const chunkMatrix = toMatrixBytes(chunk, this.key.rowSize);
			console.log(chunkMatrix);
			const encryptedMatrix = this.key.multiply(chunkMatrix);
			encryptedMatrix.mod(26);
			for (let i = 0; i < this.key.rowSize; i++) {
				encryptedChunks.push(alphaUpperCaseOf(encryptedMatrix.get(i, 0)));
			}
		}

		return new Uint8Array(encryptedChunks);
	}

	decrypt(encrypted: string): string {
		const encryptedChunks = encrypted
			.replaceAll(NON_ALPHA, "")
			.match(new RegExp(`.{1,${this.key.rowSize}}`, "g"));
		const chunks = [];

		for (const encryptedChunk of encryptedChunks) {
			const encryptedMatrix = toMatrix(encryptedChunk, this.key.rowSize);
			const chunkMatrix = this.inverseKey.multiply(encryptedMatrix);
			chunkMatrix.mod(26);
			const chunk = chunkMatrix.toString();
			chunks.push(chunk);
		}

		return chunks.join("");
	}

	decryptBytes(source: Uint8Array): Uint8Array {
		const chunks = [];
		const sanitizedSource = source.filter(isAlpha);
		for (let i = 0; i < sanitizedSource.length; i += this.key.rowSize) {
			chunks.push(
				sanitizedSource.slice(
					i,
					Math.min(i + this.key.rowSize, sanitizedSource.length)
				)
			);
		}
		console.log(chunks);
		const decryptedChunks = [];

		for (const chunk of chunks) {
			const decryptedMatrix = toMatrixBytes(chunk, this.key.rowSize);
			const chunkMatrix = this.inverseKey.multiply(decryptedMatrix);
			chunkMatrix.mod(26);
			for (let i = 0; i < this.key.rowSize; i++) {
				decryptedChunks.push(alphaUpperCaseOf(chunkMatrix.get(i, 0)));
			}
		}
		console.log(decryptedChunks);

		return new Uint8Array(decryptedChunks);
	}
}

function toMatrix(chunk: string, length: number): ModulusMatrix {
  const matrix = new ModulusMatrix(length, 1);
  // Padding
  while (chunk.length < length) {
    chunk += "X";
  }
  for (let i = 0; i < length; i++) {
    matrix.set(i, 0, alphaCodeOf(chunk.charCodeAt(i)));
  }
  return matrix;
}

function toMatrixBytes(chunk: Uint8Array, length: number): ModulusMatrix {
	const matrix = new ModulusMatrix(length, 1);
	// Padding
  let chunklength = chunk.length;
	for (let i = 0; i < length; i++) {
		matrix.set(i, 0, 88);
	}
	for (let i = 0; i < length; i++) {

		matrix.set(i, 0, alphaCodeOf(chunk[i]));
  }
	return matrix;
}

export { HillCipher };
