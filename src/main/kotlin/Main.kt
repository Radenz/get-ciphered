import cipher.HillCipher
import cipher.asString
import utils.*
import java.io.File

fun main(args: Array<String>) {

//
//    for ((i, char) in ('A'..'Z').withIndex()) {
//        if (i % 5 == 0 && i != 0) println()
//        print("$char = ${char.alphaCode}  ")
//        if (char.alphaCode < 10) print(" ")
//    }
//    println()
//
//    println(inverseMod(15, 22, 26))
//    val matrix = ModulusMatrix.zeros(3, 3)
//    matrix[0, 0] = 6
//    matrix[0, 1] = 24
//    matrix[0, 2] = 1
//    matrix[1, 0] = 13
//    matrix[1, 1] = 16
//    matrix[1, 2] = 10
//    matrix[2, 0] = 20
//    matrix[2, 1] = 17
//    matrix[2, 2] = 15
//    val cipher = HillCipher(matrix)
//    val source = File("hill.txt").readText()
//    println(cipher.decrypt(source))

    /**
     * Read file to string
     */
//    val str = File("k.txt").readText().replace(Regex("(\r?\n)+"), "")

    /**
     * Replace individual letter
     */
//    val new = str.replace("H", "u")
//        .replace("E", "m")
//        .replace("S", "k")
//        .replace("R", "y")
//        .replace("M", "j")
//        .replace("O", "b")
//        .replace("G", "p")
//        .replace("I", "x")
//        .replace("T", "q")
//        .replace("D", "z")

    /**
     * Write string to file
     */
//    File("res5.txt").writeText(new)

//    val l = mutableSetOf<Char>()
//    for (c in str) {
//        if (c.isLetter() && c.isLowerCase() && !l.contains(c)) {
//            print(c)
//            l.add(c)
//        }
//    }

    /**
     * String to n-grams
     */
//    val map = str.ngrams(4)
//

    /**
     * Print n-gram frequencies
     */
//    var i = 0
//    for (entry in map) {
//        print("${entry.key}: ${entry.value}  ")
//        if (entry.value < 100) print(" ")
//        if (entry.value < 10) print(" ")
//        i++
//        if (i % 5 == 0) println()
//    }
//
//    var k = -4
//    while (k != -1) {
//        k = str.indexOf("RBFW", k + 4)
//        println(k)
//    }
}

fun String.ngrams(n: Int): Map<String, Int> {
    val map = mutableMapOf<String, Int>()

    for (i in indices) {
        if ((i + n) !in indices) continue
        val ngram = this.subSequence(i, i + n).toString()
        map[ngram] = map[ngram]?.plus(1) ?: 1
    }

    return map.toList().filter { (_, value) -> value > 3 }.sortedBy{ (_, value) -> -value }.toMap()
}