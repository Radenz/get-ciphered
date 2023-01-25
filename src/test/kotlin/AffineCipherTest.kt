import cipher.AffineCipher
import kotlin.test.Test
import kotlin.test.assertEquals

class AffineCipherTest {

    @Test
    fun testEncrypt() {
        val cipher = AffineCipher(7, 10)
        assertEquals("CZOLNE", cipher.encrypt("kripto"))
    }

    @Test
    fun testDecrypt() {
        val cipher = AffineCipher(7, 10)
        assertEquals("KRIPTO", cipher.decrypt("CZOLNE"))
    }

}