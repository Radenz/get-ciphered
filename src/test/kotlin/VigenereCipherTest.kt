import cipher.AutoKeyVigenereCipher
import cipher.VigenereCipher
import kotlin.test.Test
import kotlin.test.assertEquals

class VigenereCipherTest {

    @Test
    fun testStandard() {
        val cipher = VigenereCipher.standard("sony")
        assertEquals("LVVQ HZNGF HRVL",cipher.encrypt("this plain text"))
        assertEquals("THISPLAINTEXT",cipher.decrypt("LVVQHZNGFHRVL"))
    }

    @Test
    fun testAutoKey() {
        val cipher = AutoKeyVigenereCipher("INDO")
        assertEquals("VRJOEE VEEGWEFOS MAVJMS", cipher.encrypt("negara penghasil minyak"))
        assertEquals("NEGARAPENGHASILMINYAK", cipher.decrypt("VRJOEEVEEGWEFOSMAVJMS"))
    }
}