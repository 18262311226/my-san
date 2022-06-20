import { ExprType } from './expr-type.js'
import { readMultiplicativeExpr } from './read-multiplicative-expr.js'

/**
 * 读取加法表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readAdditiveExpr (walker) {
    let expr = readMultiplicativeExpr(walker)

    while(1){
        walker.goUntil()
        let code = walker.source.charCodeAt(walker.index)

        switch(code){
            case 43: //+
            case 45: //-
                walker.index++

                expr = {
                    type: ExprType.BINARY,
                    operator: code,
                    segs: [
                        expr,
                        readMultiplicativeExpr(walker)
                    ]
                }
                continue
        }

        break;
    }

    return expr
}