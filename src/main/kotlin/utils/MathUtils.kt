package utils

const val A = 'A'.code

/**
 * Returns the remainder of this number divided
 * by the given [modulus].
 */
infix fun Int.mod(modulus: Int): Int {
    return ((this % modulus) + modulus) % modulus
}

/**
 * Computes the greatest commond divisor of
 * two given number.
 */
fun gcd(a: Int, b: Int): Int {
    require(!(a < 1 || b < 1))

    if (b > a) {
        return gcd(b, a)
    }

    return if (a % b == 0) b else gcd(b, a % b)
}

/**
 * Computes the smallest positive integer k which
 * satisfies the modulus equation
 *      `nk === r (mod m)`
 * where n is the [multiplier], r is the [remainder],
 * and m is the [modulus].
 */
fun inverseMod(multiplier: Int, remainder: Int, modulus: Int): Int {
    val gcd = gcd(multiplier, modulus)
    var multiplier = multiplier
    var remainder = remainder
    var modulus = modulus

    if (remainder % multiplier == 0) {
        return remainder / multiplier
    }

    require(remainder % gcd == 0)
    multiplier /= gcd
    modulus /= gcd
    remainder /= gcd

    multiplier = multiplier mod modulus
    remainder = remainder mod modulus

    val newMultiplier = modulus % multiplier
    val newModulus = multiplier
    val newRemainder = -remainder mod multiplier
    val addition = inverseMod(newMultiplier, newRemainder, newModulus)
    val inverse = (addition * modulus + remainder) / multiplier
    return inverse mod modulus
}

class ModulusMatrix(
    val rowSize: Int,
    val columnSize: Int
    ) {

    private val values = mutableListOf<Int>()

    companion object {
        /**
         * Creates a new [ModulusMatrix] with the given [rowSize]
         * and [columnSize] and initializes the value of every
         * cell with 0.
         */
        fun zeros(rowSize: Int, columnSize: Int): ModulusMatrix {
            val matrix = ModulusMatrix(rowSize, columnSize)
            val size = rowSize * columnSize
            for (i in 0 until size) {
                matrix.values.add(0)
            }
            return matrix
        }
    }

    /**
     * Sets the value of the cell at row [row] and column [column]
     * to [value].
     */
    operator fun set(row: Int, column: Int, value: Int) {
        values[row * columnSize + column] = value
    }

    /**
     * Sets the value of the cell at row [row] and column [column].
     */
    operator fun get(row: Int, column: Int): Int {
        return values[row * columnSize + column]
    }

    /**
     * Returns the result of this matrix multiplied by [other]
     * matrix.
     */
    operator fun times(other: ModulusMatrix): ModulusMatrix {
        val result = zeros(this.rowSize, other.columnSize)
        for (row in 0 until result.rowSize) {
            for (column in 0 until result.columnSize) {
                var cellValue = 0

                for (i in 0 until this.columnSize) {
                    cellValue += this[row, i] * other[i, column]
                }
                result[row, column] = cellValue
            }
        }
        return result
    }

    /**
     * Calculates the value of this matrix multiplied by a
     * given [factor] in place.
     */
    operator fun timesAssign(factor: Int) {
        for (row in 0 until rowSize) {
            for (column in 0 until columnSize) {
                this[row, column] *= factor
            }
        }
    }

    /**
     * Checks whether this matrix is a square matrix or not.
     */
    private fun isSquare(): Boolean {
        return rowSize == columnSize
    }

    /**
     * Calculates the determinant of this matrix.
     */
    fun determinant(): Int {
        require(isSquare())

        if (rowSize == 2) {
            return this[0, 0] * this[1, 1] - this[0, 1] * this[1, 0]
        }

        var determinant = 0

        for (column in 0 until columnSize) {
            var cofactor = this.minor(0, column).determinant()
            cofactor *= this[0, column]
            if (column % 2 == 1) cofactor *= -1
            determinant += cofactor
        }

        return determinant
    }

    /**
     * Returns the minor matrix without row [row] and column
     * [column] of this matrix.
     */
    private fun minor(row: Int, column: Int): ModulusMatrix {
        val minorMatrix = ModulusMatrix(rowSize - 1, columnSize - 1)

        for (i in 0 until rowSize) {
            if (i == row) continue
            for (j in 0 until columnSize) {
                if (j == column) continue
                minorMatrix.values.add(this[i, j])
            }
        }

        return minorMatrix
    }

    /**
     * Calculates the conjugate matrix of this matrix.
     */
    private fun conjugate(): ModulusMatrix {
        require(isSquare())

        val cofactorMatrix = zeros(rowSize, columnSize)

        for (row in 0 until rowSize) {
            for (column in 0 until columnSize) {
                var cellValue = this.minor(row, column).determinant()
                if ((row + column) % 2 == 1) cellValue *= -1
                cofactorMatrix[row, column] = cellValue
            }
        }

        cofactorMatrix.transpose()
        return cofactorMatrix
    }

    /**
     * Transposes this matrix in place.
     */
    private fun transpose() {
        require(isSquare())

        for (row in 0 until rowSize) {
            for (column in 0 until row) {
                val cell = this[row, column]
                this[row, column] = this[column, row]
                this[column, row] = cell
            }
        }
    }

    /**
     * Applies modulus operation to each cell of this matrix
     * with the given [modulus].
     */
    operator fun remAssign(modulus: Int) {
        for (row in 0 until rowSize) {
            for (column in 0 until columnSize) {
                this[row, column] = this[row, column] mod modulus
            }
        }
    }

    /**
     * Calculates the inverse of this matrix with modulus 26.
     */
    fun inverse(): ModulusMatrix {
        require(isSquare())
        val determinant = determinant()
        require(determinant != 0)

        val inverse = conjugate()
        val inverseDeterminant = determinant mod 26

        inverse *= inverseMod(inverseDeterminant, 1, 26)
        inverse %= 26

        return inverse
    }
}