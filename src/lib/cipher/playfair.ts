import {
  A,
  alphaUpperCaseOf,
  J,
  j,
  J_REGEX,
  NON_ALPHA,
  toUpperCase,
  X,
  Z,
} from "./utils/char";

type Bigram = [number, number];
type Index = [number, number];

class GridBuilder {
  private readonly flatGrid = [];

  constructor() {}

  append(char: number) {
    if (char == j || char == J) return;
    if (this.has(char)) return;

    this.flatGrid.push(toUpperCase(char));
  }

  has(char: number): boolean {
    return this.flatGrid.includes(toUpperCase(char));
  }

  build(): PlayfairGrid {
    for (let char = A; char <= Z; char++) {
      this.append(char);
    }
    const grid = [];
    let currentRow = [];
    for (let i = 0; i < 25; i++) {
      currentRow.push(this.flatGrid[i]);
      if (i % 5 == 4) {
        grid.push(currentRow);
        currentRow = [];
      }
    }

    return new PlayfairGrid(grid);
  }
}

class PlayfairGrid {
  private static readonly SIZE = 5;

  constructor(private readonly values: number[][]) {}

  private indexOf(char: number): Index {
    for (let i = 0; i < PlayfairGrid.SIZE; i++) {
      const index = this.values[i].indexOf(char);
      if (index != -1) return [i, index];
    }

    return [-1, -1];
  }

  toString(): string {
    let s = "";
    for (let i = 0; i < PlayfairGrid.SIZE; i++) {
      for (let j = 0; j < PlayfairGrid.SIZE; j++) {
        s += `${String.fromCharCode(this.at(i, j))} `;
      }
      s += "\n";
    }
    return s;
  }

  private at(row: number, column: number): number {
    return this.values[row][column];
  }

  private shiftBigram(bigram: Bigram, positive: boolean): Bigram {
    let [firstRow, firstColumn] = this.indexOf(toUpperCase(bigram[0]));
    let [secondRow, secondColumn] = this.indexOf(toUpperCase(bigram[1]));

    if (firstRow === secondRow) {
      firstColumn += positive ? 1 : 4;
      secondColumn += positive ? 1 : 4;
    } else if (firstColumn === secondColumn) {
      firstRow += positive ? 1 : 4;
      secondRow += positive ? 1 : 4;
    } else {
      const tempSecondColumn = firstColumn;
      firstColumn = secondColumn;
      secondColumn = tempSecondColumn;
    }

    firstRow %= 5;
    firstColumn %= 5;
    secondRow %= 5;
    secondColumn %= 5;

    return [this.at(firstRow, firstColumn), this.at(secondRow, secondColumn)];
  }

  encode(bigram: Bigram): Bigram {
    return this.shiftBigram(bigram, true);
  }

  decode(bigram: Bigram): Bigram {
    return this.shiftBigram(bigram, false);
  }
}

class PlayfairCipher {
  private grid: PlayfairGrid;

  constructor(key: string) {
    const keyChars = key.replaceAll(NON_ALPHA, "");
    const gridBuilder = new GridBuilder();
    for (let i = 0; i < keyChars.length; i++) {
      gridBuilder.append(keyChars.charCodeAt(i));
    }

    this.grid = gridBuilder.build();
  }

  encrypt(source: string): string {
    const sourceBigrams = toBigrams(
      source.replaceAll(NON_ALPHA, "").replaceAll(J_REGEX, "I")
    );

    const encryptedBigrams = [];
    for (const bigram of sourceBigrams) {
      const b = this.grid.encode(bigram);
      encryptedBigrams.push(b);
    }

    return bigramsToString(encryptedBigrams);
  }

  decrypt(source: string): string {
    const encrytedBigrams = toBigrams(
      source.replaceAll(NON_ALPHA, "").replaceAll(J_REGEX, "I")
    );

    const sourceBigrams = [];
    for (const bigram of encrytedBigrams) {
      sourceBigrams.push(this.grid.decode(bigram));
    }

    return bigramsToString(sourceBigrams);
  }
}

function toBigrams(text: string): Bigram[] {
  const bigrams = [];
  let i = 0;
  while (i < text.length) {
    const first = text.charCodeAt(i);
    let second = i == text.length - 1 ? X : text.charCodeAt(i + 1);

    if (first == second && first != X) {
      second = X;
      i--;
    }

    bigrams.push([first, second]);
    i += 2;
  }

  return bigrams;
}

function bigramsToString(bigrams: Bigram[]): string {
  return String.fromCharCode(...bigrams.flat());
}

export { PlayfairCipher };
