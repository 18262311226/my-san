import { readTertiaryExpr } from './read-tertiary-expr.js'
import { Walker } from './walker.js'
/**
 * 解析表达式
 *
 * @param {string} source 源码
 * @return {Object}
 */
export function parseExpr (source) {
    if(!source){
        return
    }

    if(typeof source === 'object' && source.type){
        return source
    }

    return readTertiaryExpr(new Walker(source));
}