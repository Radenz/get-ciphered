package cipher

import utils.AlphabeticShifter

// TODO: Handle binary
class AutoKeyVigenereCipher(
    key: String
    ) : VigenereCipher(AlphabeticShifter(offset = 0), key) {

    override fun encrypt(source: String, ignoreNonLetters: Boolean): String {
        val encrypted = ArrayList<Char>()
        val keySource = source.replace(" ", "")
        var index = 0

        for (char in source) {
            if (!char.isLetter()) {
                encrypted.add(char)
                continue
            }

            val keyChar =  if (index < key.length) key[index] else keySource[index - key.length]
            encrypted.add(this.matrix.encode(char, keyChar))
            index++
        }

        return encrypted.joinToString("")
    }

    override fun decrypt(encrypted: String, ignoreNonLetters: Boolean): String {
        val source = ArrayList<Char>()
        var index = 0

        for (char in encrypted) {
            if (!char.isLetter()) {
                source.add(char)
                continue
            }

            val keyChar =  if (index < key.length) key[index] else source[index - key.length]
            source.add(this.matrix.decode(char, keyChar))
            index++
        }

        return source.joinToString("")
    }
}