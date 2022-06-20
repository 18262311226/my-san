import { ExprType } from './expr-type.js'
import { readTertiaryExpr } from './read-tertiary-expr.js'
import { readIdent } from './read-ident.js'

/**
 * 读取访问表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readAccessor (walker) {
    let firstSeg = readIdent(walker)

    switch(firstSeg){
        case 'true':
        case 'false':
            return {
                type: ExprType.BOOL,
                value: firstSeg === 'true'
            }
        case 'null':
            return {
                type: ExprType.NULL
            }
    }

    let result = {
        type: ExprType.ACCESSOR,
        paths: [
            {type: ExprType.STRING, value: firstSeg}
        ]
    }

    accessorLoop: while(1){
        switch(walker.source.charCodeAt(walker.index)){
            case 46: // .
                walker.index++
                result.paths.push({
                    type: ExprType.STRING,
                    value: readIdent(walker)
                })
                break;
            case 91: // [
                walker.index++
                result.paths.push(readTertiaryExpr(walker))
                walker.goUntil(93) // ]
                break;
            default:
                break accessorLoop
        }
    }

    return result
}