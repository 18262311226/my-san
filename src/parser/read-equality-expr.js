import { ExprType } from './expr-type.js'
import { readRelationalExpr } from './read-relational-expr.js'

/**
 * 读取相等比对表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readEqualityExpr (walker) {
    let expr = readRelationalExpr(walker)
    walker.goUntil()

    let code = walker.source.charCodeAt(walker.index)
    switch(code){
        case 61: //=
        case 33: //!
            if(walker.nextCode() === 61){
                code += 61
                if(walker.nextCode() === 61){
                    code += 61
                    walker.index++
                }

                return {
                    type: ExprType.BINARY,
                    operator: code,
                    segs: [
                        expr,
                        readRelationalExpr(walker)
                    ]
                }
            }
            walker.index--
            break;
    }
}