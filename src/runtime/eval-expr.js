import { ExprType } from '../parser/expr-type.js'
import { extend } from '../utils/extend.js'

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
        case ExprType.UNARY://一元表达式
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
            case ExprType.BINARY: //二元表达式
                value = evalExpr(expr.segs[0], data, owner)
                let rightValue = evalExpr(expr.segs[1], data, owner)
                switch(expr.operator){
                    case 37:
                        value = value % rightValue
                        break;
                    case 43:
                        value = value + rightValue
                        break;
                    case 45:
                        value = value - rightValue
                        break;
                    case 42:
                        value = value * rightValue
                        break;
                    case 47:
                        value = value / rightValue
                        break;
                    case 60:
                        value = value < rightValue
                        break;
                    case 62:
                        value = value > rightValue
                        break;
                    case 76:
                        value = value && rightValue
                        break;
                    case 94:
                        value = value != rightValue
                        break;
                    case 121:
                        value = value <= rightValue
                        break;
                    case 122:
                        value = value == rightValue
                        break;
                    case 123:
                        value = value >= rightValue
                        break;
                    case 155:
                        value = value !== rightValue
                        break;
                    case 183:
                        value = value === rightValue
                        break;
                    case 248:
                        value = value || rightValue
                        break;
                }
 
                return value
            case ExprType.TERTIARY:
                return evalExpr(expr.segs[evalExpr(expr.segs[0], data, owner) ? 1 : 2], data, owner)
            case ExprType.ARRAY:
                value = []

                for(let i = 0;i < expr.items.length;i++){
                    let item = expr.items[i]
                    let itemValue = evalExpr(item.expr, data, owner)

                    if(item.spread){
                        itemValue && (value = value.concat(itemValue))
                    }else {
                        value.push(itemValue)
                    }
                }

                return value
            case ExprType.OBJECT:
                value = {}

                for(let i = 0;i < expr.items.length;i++){
                    let item = expr.items[i]
                    let itemValue = evalExpr(item.expr, data, owner)

                    if(item.spread){
                        itemValue && extend(value, itemValue)
                    }else {
                        value[evalExpr(item.name, data, owner)] = itemValue
                    }
                }

                return value
        default:
            break;
    }
}