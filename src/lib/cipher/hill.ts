import { alphaCodeOf, NON_ALPHA } from "./utils/char";
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

export { HillCipher };
