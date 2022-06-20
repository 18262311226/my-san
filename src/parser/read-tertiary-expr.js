import { ExprType } from './expr-type.js'
import { readLogicalOrExpr } from './read-logical-or-expr.js'
/**
 * 读取三元表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */

export function readTertiaryExpr (walker) {
    let conditional = readLogicalOrExpr(walker)
    walker.goUntil()

    if(walker.source.charCodeAt(walker.index) === 63){ //如果是问号？
        walker.index++
        let yesExpr = readTertiaryExpr(walker)
        walker.goUntil()

        if(walker.source.charCodeAt(walker.index) === 58){ //如果是 :
            walker.index++
            return {
                type: ExprType.TERTIARY, //三元表达式
                segs: [
                    conditional,
                    yesExpr,
                    readTertiaryExpr(walker)
                ]
            }
        }
    }

    return conditional
}