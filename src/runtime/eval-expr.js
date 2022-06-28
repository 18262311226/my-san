import { ExprType } from '../parser/expr-type.js'

/**
 * 计算表达式的值
 *
 * @param {Object} expr 表达式对象
 * @param {Data} data 数据容器对象
 * @param {Component=} owner 所属组件环境
 * @return {*}
 */
export function evalExpr (expr, data, owner) {
    if(expr.value != null){
        return expr.value
    }

    let value

    switch (expr.type) {
        case ExprType.NULL:
            return null
        case ExprType.UNARY:
            value = evalExpr(expr.expr, data, owner)
            switch(expr.operator){
                case 33: //如果是 ！
                    value = !value
                    break
                case 43: //如果是 +
                    value = +value
                    break
                case 45: //如果是 -
                    value = 0 - value
                    break;
            }
            return value
            case ExprType.BINARY:
                value = evalExpr(expr.segs[0], data, owner)
                let rightValue = evalExpr(expr.segs[1], data, owner)
                switch(expr.operator){
                    
                }
                return value
        default:
            break;
    }
}