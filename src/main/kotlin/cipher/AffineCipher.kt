package cipher

import utils.*

class AffineCipher(
    private val multiplier: Int,
    private val offset: Int
    ) {

    private val inverseModulus: Int

    init {
        require(gcd(multiplier, 26) == 1)
        inverseModulus = inverseMod(multiplier, 1, 26)
    }

    fun encrypt(source: String): String {
        val encrypted = mutableListOf<Char>()

        for (char in source) {
            val newAlphaCode = (char.alphaCode * multiplier + offset) mod 26
            encrypted.add(newAlphaCode.toAlphaChar())
        }

        return encrypted.joinToString("")
    }

    fun decrypt(encrypted: String): String {
        val source = mutableListOf<Char>()

        for (char in encrypted) {
            val newAlphaCode = ((char.alphaCode - offset) * inverseModulus) mod 26
            source.add(newAlphaCode.toAlphaChar())
        }

        return source.joinToString("")
    }
}