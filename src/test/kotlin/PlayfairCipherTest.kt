import cipher.PlayfairCipher
import kotlin.test.Test
import kotlin.test.assertEquals

class PlayfairCipherTest {

    @Test
    fun testEncrypt() {
        val cipher = PlayfairCipher("JALAN GANESHA SEPULUH")
        assertEquals("ZBRSFYKUPGLGRKVSNLQV", cipher.encrypt("temui ibu nanti malam"))
    }

    @Test
    fun testDecrypt() {
        val cipher = PlayfairCipher("JALAN GANESHA SEPULUH")
        assertEquals("TEMUIXIBUNANTIMALAMX", cipher.decrypt("ZBRSFYKUPGLGRKVSNLQV"))
    }

}