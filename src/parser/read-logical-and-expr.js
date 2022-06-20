import { ExprType } from './expr-type.js'
import { readEqualityExpr } from './read-equality-expr.js'

/**
 * 读取逻辑与表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readLogicalAndExpr(walker){
    let expr = readEqualityExpr(walker)
    walker.goUntil()

    if(walker.source.charCodeAt(walker.index) === 38){
        if(walker.nextCode() === 38){
            walker.index++

            return {
                type: ExprType.BINARY,
                operator: 76,
                segs: [
                    expr,
                    readLogicalAndExpr(walker)
                ]
            }
        }

        walker.index--
    }

    return expr
}