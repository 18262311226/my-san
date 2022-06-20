import Data from './runtime/data.js'
import { parseExpr } from './parser/parse-Expr.js'

let san = {
    version: '1.0.0',

    /**
         * 解析表达式
         *
         * @param {string} source 源码
         * @return {Object}
         */
     parseExpr: parseExpr,

    /**
     * 数据类
     *
     * @class
     * @param {Object?} data 初始数据
     * @param {Data?} parent 父级数据对象
     */
    Data: Data
}
if(typeof window !== 'undefined') window.san = san
export default san