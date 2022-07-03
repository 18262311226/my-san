import Data from './runtime/data.js'
import { parseExpr } from './parser/parse-Expr.js'
import { ExprType } from './parser/expr-type.js'
import { evalExpr } from './runtime/eval-expr.js'

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
     * 表达式类型枚举
     *
     * @const
     * @type {Object}
     */
    ExprType: ExprType,

    /**
     * 数据类
     *
     * @class
     * @param {Object?} data 初始数据
     * @param {Data?} parent 父级数据对象
     */
    Data: Data,

    /**
     * 计算表达式的值
     *
     * @param {Object} expr 表达式对象
     * @param {Data} data 数据对象
     * @param {Component=} owner 组件对象，用于表达式中filter的执行
     * @return {*}
     */
    evalExpr: evalExpr
}
if(typeof window !== 'undefined') window.san = san
export default san