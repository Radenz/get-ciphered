package cipher

import utils.*

private class GridBuilder {
    private val flatGrid = mutableListOf<Char>()

    companion object {
        private const val ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }

    fun append(char: Char) {
        if (char == 'j' || char == 'J') return
        if (flatGrid.contains(char)) return
        flatGrid.add(char.uppercaseChar())
    }

    fun build(): PlayfairGrid {
        for (char in ALPHABET) {
            append(char)
        }

        val grid = mutableListOf<MutableList<Char>>()
        var currentRow = mutableListOf<Char>()

        for (i in 0..24) {
            currentRow.add(flatGrid[i])

            if (i % 5 == 4) {
                grid.add(currentRow)
                currentRow = mutableListOf()
            }
        }

        return CharMap(grid)
    }
}

fun String.toBigramArray(): List<Bigram> {
    val bigrams = mutableListOf<Bigram>()
    var i = 0

    while (i < length) {
        val first = this[i]
        var second = if (i == length - 1) 'X' else this[i + 1]

        if (first == second && first != 'X') {
            second = 'X'
            i--
        }

        bigrams.add(first to second)
        i += 2
    }

    return bigrams
}

fun List<Bigram>.asString(): String {
    return this.joinToString("") { it.asString() }
}

class PlayfairCipher(key: String) {
    private val grid: PlayfairGrid

    init {
        val keyChars = key.replace(NON_ALPHA, "")
        val gridBuilder = GridBuilder()

        for (keyChar in keyChars) {
            gridBuilder.append(keyChar)
        }

        grid = gridBuilder.build()
    }

    /**
     * Encrypts the given [source] string using this
     * [PlayfairCipher] grid.
     */
    fun encrypt(source: String): String {
        val sourceBigrams = source
            .replace(NON_ALPHA, "")
            .replace(J, "I")
            .toBigramArray()
        val encryptedBigrams = mutableListOf<Bigram>()

        for (bigram in sourceBigrams) {
            encryptedBigrams.add(grid.encode(bigram))
        }

        return encryptedBigrams.asString()
    }

    /**
     * Decrypts the given [encrypted] string using this
     * [PlayfairCipher] grid.
     */
    fun decrypt(encrypted: String): String {
        val encryptedBigrams = encrypted
            .replace(NON_ALPHA, "")
            .replace(J, "I")
            .toBigramArray()
        val sourceBigrams = mutableListOf<Bigram>()

        for (bigram in encryptedBigrams) {
            sourceBigrams.add(grid.decode(bigram))
        }

        return sourceBigrams.asString()
    }
}
