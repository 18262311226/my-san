import { parseExpr } from '../parser/parse-Expr.js'
//响应式数据方法
//parent为父级数据
//data为初始数据
//listeners为收集数据发生改变的容器
function Data (data, parent) {
    this.parent = parent
    this.raw = data || {}
    this.listeners = []
}

//该方法为获取数据
/**
 * 获取数据项
 *
 * @param {string|Object?} expr 数据项路径
 * @param {Data?} callee 当前数据获取的调用环境
 * @return {*}
 */
Data.prototype.get = function (expr, callee) {
    let value = this.raw
    //判断第一个参数有没有传，没传直接返回整个数据
    if(!expr){
        return value
    }
    //不是对象我们需要对他进行处理，得到数据路径
    if(typeof expr !== 'object'){
        expr = parseExpr(expr)
    }

    let paths = expr.paths
    callee = callee || this

    //拿解析到的数据路径的第一个key，到原始数据中去找对应的key
    value = value[paths[0].value]
    if(typeof value === 'undefined' && this.parent){
        value = this.parent.get(expr, callee)
    }else{
        for(let i = 1,l = paths.length;value !== null && i < l;i++){
            value = value[paths[i].value]
        }
    }

    return value
}

/**
 * 数据对象变更操作
 *
 * @inner
 * @param {Object|Array} source 要变更的源数据
 * @param {Array} exprPaths 属性路径
 * @param {number} pathsStart 当前处理的属性路径指针位置
 * @param {number} pathsLen 属性路径长度
 * @param {*} value 变更属性值
 * @param {Data} data 对应的Data对象
 * @return {*} 变更后的新数据
 */
Data.prototype.immutableSet = function (source, exprPaths, pathsStart, pathsLen, value, data) {

}

//改变数据
/**
 * 设置数据项
 *
 * @param {string|Object} expr 数据项路径
 * @param {*} value 数据值
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 */
Data.prototype.set = function (expr, value, option) {

}

export default Data