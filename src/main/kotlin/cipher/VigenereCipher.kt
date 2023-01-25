package cipher

import utils.AlphabeticShifter
import utils.VigenereEncoder

// TODO: Handle binary
// TODO: Handle extended (not ignoring non-letters)
open class VigenereCipher(
    protected val matrix: VigenereEncoder,
    protected val key: String
    ) {

    companion object {
        /**
         * Generates a standard [VigenereCipher] for the given [key].
         * Creates an [AlphabeticShifter] with 0 offset internally
         * as the encoder.
         */
        fun standard(key: String): VigenereCipher {
            return VigenereCipher(AlphabeticShifter(offset = 0), key)
        }
    }

    /**
     * Encrypts a given [source] string using this cipher encoder.
     * Ignores non-alphabetic characters by default but can be force
     * to encode all characters using the [ignoreNonLetters] parameter.
     */
    open fun encrypt(source: String, ignoreNonLetters: Boolean = true): String {
        val encrypted = ArrayList<Char>()
        var index = 0

        for (char in source) {
            if (ignoreNonLetters && !char.isLetter()) {
                encrypted.add(char)
                continue
            }

            val keyChar = key[index % key.length]
            encrypted.add(this.matrix.encode(char, keyChar))
            index++
        }

        return encrypted.joinToString("")
    }

    fun encrypt(source: List<Byte>): List<Byte> {
        TODO()
    }

    /**
     * Decrypts a given [encrypted] string using this cipher encoder.
     * Ignores non-alphabetic characters by default but can be force
     * to encode all characters using the [ignoreNonLetters] parameter.
     */
    open fun decrypt(encrypted: String, ignoreNonLetters: Boolean = true): String {
        val source = ArrayList<Char>()
        var index = 0

        for (char in encrypted) {
            if (ignoreNonLetters && !char.isLetter()) {
                source.add(char)
                continue
            }

            val keyChar = key[index % key.length]
            source.add(this.matrix.decode(char, keyChar))
            index++
        }

        return source.joinToString("")
    }

    fun decrypt(source: List<Byte>): List<Byte> {
        TODO()
    }
}
