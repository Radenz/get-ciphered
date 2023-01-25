package cipher

import utils.ModulusMatrix
import utils.NON_ALPHA
import utils.alphaCode
import utils.toAlphaChar

class HillCipher(private val key: ModulusMatrix) {
    private val inverseKey = key.inverse()

    fun encrypt(source: String): String {
        val chunks: List<String> = source.replace(NON_ALPHA, "").chunked(key.rowSize)
        val encryptedChunks = mutableListOf<String>()

        for (chunk in chunks) {
            val chunkMatrix = chunk.toMatrix()
            val encryptedMatrix = key * chunkMatrix
            encryptedMatrix %= 26
            val encryptedChunk = String.fromMatrix(encryptedMatrix)
            encryptedChunks.add(encryptedChunk)
        }

        return encryptedChunks.joinToString("")
    }

    fun decrypt(encrypted: String): String {
        val encryptedChunks: List<String> = encrypted.replace(NON_ALPHA, "").chunked(key.rowSize)
        val sourceChunks = mutableListOf<String>()

        for (chunk in encryptedChunks) {
            val encryptedMatrix = chunk.toMatrix()
            val decryptedMatrix = inverseKey * encryptedMatrix
            decryptedMatrix %= 26
            val sourceChunk = String.fromMatrix(decryptedMatrix)
            sourceChunks.add(sourceChunk)
        }

        return sourceChunks.joinToString("")
    }
}

fun String.toMatrix(): ModulusMatrix {
    val matrix = ModulusMatrix.zeros(length, 1)
    var index = 0
    for (char in this) {
        matrix[index, 0] = char.alphaCode
        index++
    }

    return matrix
}

fun String.Companion.fromMatrix(matrix: ModulusMatrix): String {
    val chars = mutableListOf<Char>()
    for (i in 0 until matrix.rowSize) {
        chars.add(matrix[i, 0].toAlphaChar())
    }

    return chars.joinToString("")
}
