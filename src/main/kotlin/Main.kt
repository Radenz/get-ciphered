import cipher.asString
import utils.Bigram
import utils.CharMap

fun main(args: Array<String>) {
//    val matrix = CharMap.standardVigenere()
//    println(matrix)
    val a = mutableListOf<Bigram>('A' to 'B', 'C' to 'D')

    println(a.asString())
}