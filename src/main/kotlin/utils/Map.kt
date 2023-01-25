package utils

interface VigenereEncoder {
    fun encode(char: Char, key: Char): Char
    fun decode(char: Char, key: Char): Char
}

interface PlayfairGrid {
    fun encode(bigram: Bigram): Bigram
    fun decode(bigram: Bigram): Bigram
}

class AlphabeticShifter(private val offset: Int): VigenereEncoder {
    override fun encode(char: Char, key: Char): Char {
        return ((char.alphaCode + offset + key.alphaCode) mod 26).toAlphaChar()
    }

    override fun decode(char: Char, key: Char): Char {
        return ((char.alphaCode - offset - key.alphaCode) mod 26).toAlphaChar()
    }
}

class ByteShifter(private val offset: Int): VigenereEncoder {
    override fun encode(char: Char, key: Char): Char {
        return ((char.alphaCode + offset) mod 256).toChar()
    }

    override fun decode(char: Char, key: Char): Char {
        return ((char.alphaCode - offset) mod 256).toChar()
    }
}

class CharMap private constructor(private val size: Int): VigenereEncoder, PlayfairGrid {
    private val values: MutableList<MutableList<Char>> = mutableListOf()

    companion object Factory {
        fun standardVigenere(): CharMap {
            val matrix = uninitialized(26)
            for (i in 0..25) {
                val plainChar = i.toAlphaChar()
                for (j in 0..25) {
                    matrix.values[i][j] = plainChar.shift(j)
                }
            }
            return matrix
        }

        private fun uninitialized(size: Int): CharMap {
            val matrix = CharMap(26)
            for (i in 0 until size) {
                for (j in 0 until size) {
                    matrix.values[i].add('X')
                }
            }
            return matrix
        }
    }

    init {
        for (i in 0 until size) {
            val row = mutableListOf<Char>()
            values.add(row)
        }
    }

    constructor(values: MutableList<MutableList<Char>>): this(values.size) {
        for (i in 0 until size) {
            for (j in 0 until size) {
                this.values[i].add(values[i][j])
            }
        }
    }

    override fun toString(): String {
        var string = ""
        for (i in 0 until size) {
            for (j in 0 until size) {
                string += "${this.values[i][j]} "
            }
            string += "\n"
        }
        return string
    }

    /**
     * Retrieves the character stored in cell located
     * at the pair of row and column represented by
     * [index].
     */
    private fun at(index: Pair<Int, Int>): Char {
        return this.values[index.first][index.second]
    }

    /**
     * Returns the index of [char] within the [CharMap].
     * Returns the pair (-1, -1) if [char] is not found.
     */
    private fun indexOf(char: Char): Pair<Int, Int> {
        for (i in 0 until size) {
            val index = this.values[i].indexOf(char)
            if (index != -1) {
                return i to index
            }
        }

        return -1 to -1
    }

    /**
     * Encodes the character [char] using the given [key].
     * This shifts [char] right side in alphabetical order
     * as far as the index of [key] in the alphabet.
     * For example, `encode('J', 'C')` returns `'L'` because
     * `'C'` has the index 2 in the alphabet and 2 letters
     * after `'J'` is `'L'`.
     */
    override fun encode(char: Char, key: Char): Char {
        return this.values[key.alphaCode][char.alphaCode]
    }

    /**
     * Decodes the character [char] using the given [key].
     * This shifts [char] left side in alphabetical order
     * as far as the index of [key] in the alphabet.
     * For example, `encode('L', 'C')` returns `'J'` because
     * `'C'` has the index 2 in the alphabet and 2 letters
     * before `'L'` is `'J'`.
     */
    override fun decode(char: Char, key: Char): Char {
        val row = this.values[key.alphaCode]
        val index = row.indexOf(char)

        return index.toAlphaChar()
    }

    /**
     * Encodes the given [Bigram] using playfair cipher algorithm,
     * assuming this [CharMap] is a valid playfair cipher grid.
     */
    override fun encode(bigram: Bigram): Bigram {
        return this.shiftBigram(bigram, positive = true)
    }

    /**
     * Decodes the given [Bigram] using playfair cipher algorithm,
     * assuming this [CharMap] is a valid playfair cipher grid.
     */
    override fun decode(bigram: Bigram): Bigram {
        return this.shiftBigram(bigram, positive = false)
    }

    /**
     * Shifts the given [Bigram] either to the [positive] side
     * or negative side depending on the context, where
     * [positive] side is used to encrypt the [Bigram] and
     * negative is used to decrypt the [Bigram].
     * The [Bigram] is shifted according to playfair cipher algorithm.
     */
    private fun shiftBigram(bigram: Bigram, positive: Boolean): Bigram {
        val firstIndex = this.indexOf(bigram.first.uppercaseChar())
        val secondIndex = this.indexOf(bigram.second.uppercaseChar())

        var firstRow = firstIndex.first
        var firstColumn = firstIndex.second
        var secondRow = secondIndex.first
        var secondColumn = secondIndex.second

        when (true) {
            firstRow == secondRow -> {
                firstColumn += if (positive) 1 else 4
                secondColumn += if (positive) 1 else 4
            }
            firstColumn == secondColumn -> {
                firstRow += if (positive) 1 else 4
                secondRow += if (positive) 1 else 4
            }
            else -> {
                val tempSecondColumn = firstColumn
                firstColumn = secondColumn
                secondColumn = tempSecondColumn
            }
        }

        firstRow %= 5
        firstColumn %= 5
        secondRow %= 5
        secondColumn %= 5

        return this.at(firstRow to firstColumn) to this.at(secondRow to secondColumn)
    }
}