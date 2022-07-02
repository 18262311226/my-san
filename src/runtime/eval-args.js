import { evalExpr } from './eval-expr.js'

/**
 * 为函数调用计算参数数组的值
 *
 * @param {Array} args 参数表达式列表
 * @param {Data} data 数据环境
 * @param {Component} owner 组件环境
 * @return {Array}
 */
export function evalArgs (args, data, owner) {
    let result = []

    for(let i = 0;i < args.length;i++){
        result.push(evalExpr(args[i], data, owner))
    }

    return result
}