import { ExprType } from './expr-type.js'
import { readUnaryExpr } from './read-unary-expr.js'

/**
 * 读取乘法表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readMultiplicativeExpr (walker) {
    let expr = readUnaryExpr(walker)

    while(1){
        walker.goUntil()
        let code = walker.source.charCodeAt(walker.index)

        switch(code){
            case 37: // %
            case 42: // *
            case 47: // /
                walker.index++
                expr = {
                    type: ExprType.BINARY,
                    operator: code,
                    segs: [
                        expr,
                        readUnaryExpr(walker)
                    ]
                }
                continue
        }

        break;
    }

    return expr
}