import cipher.HillCipher
import utils.ModulusMatrix
import kotlin.test.Test
import kotlin.test.assertEquals

class HillCipherTest {

    @Test
    fun testEncrypt() {
        val matrix = ModulusMatrix.zeros(3, 3)
        matrix[0, 0] = 17
        matrix[0, 1] = 17
        matrix[0, 2] = 5
        matrix[1, 0] = 21
        matrix[1, 1] = 18
        matrix[1, 2] = 21
        matrix[2, 0] = 2
        matrix[2, 1] = 2
        matrix[2, 2] = 19

        val cipher = HillCipher(matrix)
        assertEquals("LNSHDLEWMTRW", cipher.encrypt("paymoremoney"))
    }

    @Test
    fun testDecrypt() {
        val matrix = ModulusMatrix.zeros(3, 3)
        matrix[0, 0] = 17
        matrix[0, 1] = 17
        matrix[0, 2] = 5
        matrix[1, 0] = 21
        matrix[1, 1] = 18
        matrix[1, 2] = 21
        matrix[2, 0] = 2
        matrix[2, 1] = 2
        matrix[2, 2] = 19

        val cipher = HillCipher(matrix)
        assertEquals("PAYMOREMONEY", cipher.decrypt("LNSHDLEWMTRW"))
    }

}