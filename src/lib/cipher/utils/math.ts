import { alphaUpperCaseOf } from "./char";

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

class ModulusMatrix {
  private readonly values: number[][] = [];

  constructor(readonly rowSize: number, private readonly columnSize: number) {
    for (let i = 0; i < rowSize; i++) {
      const row: number[] = [];
      for (let j = 0; j < columnSize; j++) {
        row.push(0);
      }
      this.values.push(row);
    }
  }

  static fromSquare(matrix: number[][]): ModulusMatrix {
    const modulusMatrix = new ModulusMatrix(matrix.length, matrix.length);
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        modulusMatrix.set(i, j, matrix[i][j]);
      }
    }
    return modulusMatrix;
  }

  toString(): string {
    let codeArray = this.values.flat().map((char) => alphaUpperCaseOf(char));
    return String.fromCharCode(...codeArray);
  }

  set(row: number, column: number, value: number) {
    this.values[row][column] = value;
  }

  get(row: number, column: number): number {
    return this.values[row][column];
  }

  multiply(other: ModulusMatrix): ModulusMatrix {
    const result = new ModulusMatrix(this.rowSize, other.columnSize);
    for (let row = 0; row < result.rowSize; row++) {
      for (let column = 0; column < result.columnSize; column++) {
        let cellValue = 0;
        for (let i = 0; i < this.columnSize; i++) {
          cellValue += this.get(row, i) * other.get(i, column);
        }
        result.set(row, column, cellValue);
      }
    }
    return result;
  }

  scale(factor: number) {
    for (let row = 0; row < this.rowSize; row++) {
      for (let column = 0; column < this.columnSize; column++) {
        const cellValue = this.get(row, column);
        this.set(row, column, cellValue * factor);
      }
    }
  }

  determinant(): number {
    if (this.rowSize == 2) {
      const a = this.get(0, 0);
      const b = this.get(0, 1);
      const c = this.get(1, 0);
      const d = this.get(1, 1);
      return a * d - b * c;
    }

    let det = 0;

    for (let column = 0; column < this.columnSize; column++) {
      let cofactor = this.minor(0, column).determinant();
      cofactor *= this.get(0, column);
      if (column % 2 == 1) cofactor *= -1;
      det += cofactor;
    }

    return det;
  }

  private minor(row: number, column: number): ModulusMatrix {
    const minorMatrix = new ModulusMatrix(
      this.rowSize - 1,
      this.columnSize - 1
    );

    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        minorMatrix.set(i, j, this.get(i, j));
      }
      for (let j = column + 1; j < this.columnSize; j++) {
        minorMatrix.set(i, j - 1, this.get(i, j));
      }
    }

    for (let i = row + 1; i < this.rowSize; i++) {
      for (let j = 0; j < column; j++) {
        minorMatrix.set(i - 1, j, this.get(i, j));
      }
      for (let j = column + 1; j < this.columnSize; j++) {
        minorMatrix.set(i - 1, j - 1, this.get(i, j));
      }
    }

    return minorMatrix;
  }

  private conjugate(): ModulusMatrix {
    const cofactorMatrix = new ModulusMatrix(this.rowSize, this.columnSize);

    for (let row = 0; row < this.rowSize; row++) {
      for (let column = 0; column < this.columnSize; column++) {
        let cellValue = this.minor(row, column).determinant();
        if ((row + column) % 2 == 1) cellValue *= -1;
        cofactorMatrix.set(row, column, cellValue);
      }
    }

    cofactorMatrix.transpose();
    return cofactorMatrix;
  }

  private transpose() {
    for (let row = 0; row < this.rowSize; row++) {
      for (let column = 0; column < row; column++) {
        const a = this.get(row, column);
        const b = this.get(column, row);
        this.set(row, column, b);
        this.set(column, row, a);
      }
    }
  }

  mod(modulus: number) {
    for (let row = 0; row < this.rowSize; row++) {
      for (let column = 0; column < this.columnSize; column++) {
        this.set(row, column, mod(this.get(row, column), 26));
      }
    }
  }

  inverse() {
    const det = this.determinant();
    const inverse = this.conjugate();
    const inverseDet = mod(det, 26);
    inverse.scale(inverseMod(inverseDet, 1, 26));
    inverse.mod(26);

    return inverse;
  }
}

export { mod, gcd, inverseMod, ModulusMatrix };
