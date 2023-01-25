package utils

typealias Bigram = Pair<Char, Char>

val NON_ALPHA = Regex("[^a-zA-Z]")
val J = Regex("[jJ]")

/**
 * Converts this number to the uppercase alphabet
 * character which corresponds to the index of the
 * character.
 */
fun Int.toAlphaChar(): Char {
    return (this + A).toChar()
}

/**
 * Joins the [Bigram] characters into a 2-length [String].
 */
fun Bigram.asString(): String {
    return "$first$second"
}

/**
 * Returns the alphabetic index of this [Char], assuming
 * this [Char] is an alphabetic letter.
 */
inline val Char.alphaCode: Int get() = when (this) {
    in 'a'..'z' -> this - 'a'
    in 'A'..'Z' -> this - 'A'
    else -> throw IllegalArgumentException("$this is not an alphabetic character")
}

/**
 * Shifts this alphabetic [Char] as far as the given [offset]
 * to the right (increasing order) and wraps around if
 * the resulting character is out of alphabetic bound.
 */
fun Char.shift(offset: Int): Char {
    if (!this.isLetter()) {
        throw IllegalArgumentException("$this cannot be shifted")
    }

    val alphaCode = (this.alphaCode + offset) mod 26
    return alphaCode.toAlphaChar()
}

fun Char.shift(offset: Char): Char {
    if (!this.isLetter()) {
        throw IllegalArgumentException("$this cannot be shifted")
    }

    return this.shift(offset.alphaCode)
}
