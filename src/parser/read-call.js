import { ExprType } from './expr-type.js'
import { readTertiaryExpr } from './read-tertiary-expr.js'
import { readAccessor } from './read-accessor.js'
/**
 * 读取调用
 *
 * @param {Walker} walker 源码读取对象
 * @param {Array=} defaultArgs 默认参数
 * @return {Object}
 */

export function readCall (walker, defaultArgs) {
    walker.goUntil()
    let result = readAccessor(walker)

    let args
    if(walker.goUntil(40)){ // )
        args = []

        while(!walker.goUntil(41)){
            args.push(readTertiaryExpr(walker))
            walker.goUntil(44) // ,
        }
    }else if (defaultArgs) {
        args = defaultArgs
    }

    if(args){
        result = {
            type: ExprType.CALL,
            name: result,
            args: args
        }
    }

    return result
}