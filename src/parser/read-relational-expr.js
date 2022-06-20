import { ExprType } from './expr-type.js'
import { readAdditiveExpr } from './read-additive-expr.js'

/**
 * 读取关系判断表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readRelationalExpr (walker) {
    let expr = readAdditiveExpr(walker)
    walker.goUntil()

    let code = walker.source.charCodeAt(walker.index)
    switch(code){
        case 60: // < 小于号
        case 62: // > 大于号
            if(walker.nextCode() === 61){
                code += 61
                walker.index++
            }

            return {
                type: ExprType.BINARY,
                operator: code,
                segs: [
                    expr,
                    readAdditiveExpr(walker)
                ]
            }
    }

    return expr
}