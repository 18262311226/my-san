import { ExprType } from './expr-type.js'
import { readTertiaryExpr } from './read-tertiary-expr.js'

/**
 * 读取括号表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readParenthesizedExpr (walker) {
    walker.index++
    let expr = readTertiaryExpr(walker)
    walker.goUntil(41) // )
    expr.parenthesized = true

    return expr
}