import { ExprType } from './expr-type.js'
import { readLogicalAndExpr } from './read-logical-and-expr.js'

/**
 * 读取逻辑或表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readLogicalOrExpr (walker) {
    let expr = readLogicalAndExpr(walker)
    walker.goUntil()

    if(walker.source.charCodeAt(walker.index) === 124){ //匹配逻辑或
        if(walker.nextCode() === 124){ //条件成立，继续判断是否还是 |
            walker.index++

            return {
                type: ExprType.BINARY,
                operator: 248,
                segs: [
                    expr,
                    readLogicalOrExpr(walker)
                ]
            }
        }

        //不是则后退一步
        walker.index--
    }

    return expr
}