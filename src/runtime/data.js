import { ExprType } from '../parser/expr-type.js'
import { parseExpr } from '../parser/parse-Expr.js'
import { evalExpr } from './eval-expr.js'
import { DataChangeType } from './data-change-type.js'

//响应式数据方法
//parent为父级数据
//data为初始数据
//listeners为收集数据发生改变的容器

function Data (data, parent) {
    this.parent = parent
    this.raw = data || {}
    this.listeners = []
}

/**
 * DataTypes 检测
 */

 Data.prototype.checkDataTypes = function () {
    if (this.typeChecker) {
        this.typeChecker(this.raw);
    }
};

/**
 * 设置 type checker
 *
 * @param  {Function} typeChecker 类型校验器
 */

Data.prototype.setTypeChecker = function (typeChecker) {
    this.typeChecker = typeChecker;
};

/**
 * 添加数据变更的事件监听器
 *
 * @param {Function} listener 监听函数
 */

Date.prototype.listen = function (listener) {
    if(typeof listener === 'function'){
        this.listeners.push(listener)
    }
}

/**
 * 移除数据变更的事件监听器
 *
 * @param {Function} listener 监听函数
 */

Date.prototype.unlisten = function (listener) {
    let len = this.listeners.length

    while(len--){
        if(!listener || this.listeners[len] === listener){
            this.listeners.splice(len, 1)
        }
    }
}

/**
 * 触发数据变更
 *
 * @param {Object} change 变更信息对象
 */

Data.prototype.fire = function (change) {
    //这段目前看不明白
    if (change.option.silent || change.option.silence || change.option.quiet) {
        return;
    }

    for(let i = 0;i < this.listeners.length;i++){
        this.listeners[i].call(this, change)
    }
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
            value = value[paths[i].value || evalExpr(paths[i], callee)]
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

function immutableSet (source, exprPaths, pathsStart, pathsLen, value, data) {
    if(pathsStart >= pathsLen){
        return value
    }

    if(source == null){
        source = {}
    }

    let pathExpr = exprPaths[pathsStart]
    let prop = evalExpr(pathExpr, data)
    let result = source

    if(source instanceof Array){
        let index = +prop
        prop = isNaN(index) ? prop : index
        result = source.slice(0)
        result[prop] = immutableSet(source[prop], exprPaths, pathsStart + 1, pathsLen, value, data)
    }else if(typeof source === 'object'){
        result = {}

        let needAssigned = true

        for(let key in source){
            if(source.hasOwnProperty(key)){
                if(key === prop){
                    needAssigned = false
                    result[prop] = immutableSet(source[prop], exprPaths, pathsStart + 1, pathsLen, value, data)
                }else {
                    result[key] = result[key]
                }
            }
        }

        if(needAssigned){
            result[prop] = immutableSet(source[prop], exprPaths, pathsStart + 1, pathsLen, value, data)
        }
    }

    if(pathExpr.value == null){
        exprPaths[pathsStart] = {
            type: typeof prop === 'string' ? ExprType.STRING : ExprType.NUMBER,
            value: prop
        }
    }

    return result
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
    option = option || {}

    let exprRaw = expr

    expr = parseExpr(expr)

    if(expr.type !== ExprType.ACCESSOR){
        throw new Error('[SAN ERROR] Invalid Expression in Data set: ' + exprRaw)
    }

    if(this.get(expr) === value && !option.force){
        return
    }

    expr = {
        type: ExprType.ACCESSOR,
        paths: expr.paths.slice(0)
    }

    let prop = expr.paths[0].value

    this.raw[prop] = immutableSet(this.raw[prop], expr.paths, 1, expr.paths.length, value, this)

    this.fire({
        type: DataChangeType.SET,
        expr: expr,
        value: value,
        option: option
    })

    this.checkDataTypes()
}

/**
 * 批量设置数据
 *
 * @param {Object} source 待设置的数据集
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 */

Date.prototype.assign = function (source, option) {
    option = option || {}

    for(let key in source){
        this.set({
            type: ExprType.ACCESSOR,
            paths: [
                {
                    type: ExprType.STRING,
                    value: key
                }
            ]
        }, source[key], option)
    }
}

/**
 * 合并更新数据项
 *
 * @param {string|Object} expr 数据项路径
 * @param {Object} source 待合并的数据
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 */

Date.prototype.merge = function (expr, source, option) {
    option = option || {}

    let exprRaw = expr

    expr = parseExpr(expr)

    if (expr.type !== ExprType.ACCESSOR) {
        throw new Error('[SAN ERROR] Invalid Expression in Data merge: ' + exprRaw);
    }

    if (typeof this.get(expr) !== 'object') {
        throw new Error('[SAN ERROR] Merge Expects a Target of Type \'object\'; got ' + typeof oldValue);
    }

    if (typeof source !== 'object') {
        throw new Error('[SAN ERROR] Merge Expects a Source of Type \'object\'; got ' + typeof source);
    }

    for(let key in source){
        this.set({
            type: ExprType.ACCESSOR,
            paths: expr.paths.concat(
                [
                    {
                        type: ExprType.STRING,
                        value: key
                    }
                ]
            )
        }, source[key], option)
    }
}

/**
 * 基于更新函数更新数据项
 *
 * @param {string|Object} expr 数据项路径
 * @param {Function} fn 数据处理函数
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 */

Date.prototype.apply = function (expr, fn, option) {
    let exprRaw = expr

    expr = parseExpr(expr)

    if(expr.type !== ExprType.ACCESSOR){
        throw new Error('[SAN ERROR] Invalid Expression in Data apply: ' + exprRaw);
    }

    let oldValue = this.get(expr)

    if(typeof fn !== 'function'){
        throw new Error(
            '[SAN ERROR] Invalid Argument\'s Type in Data apply: '
            + 'Expected Function but got ' + typeof fn
        );
    }

    this.set(expr, fn(oldValue), option)
}

/**
 * 数组数据项splice操作
 *
 * @param {string|Object} expr 数据项路径
 * @param {Array} args splice 接受的参数列表，数组项与Array.prototype.splice的参数一致
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 * @return {Array} 新数组
 */

Date.prototype.splice = function (expr, args, option) {
    option = option || {}

    let exprRaw = expr

    expr = parseExpr(expr)

    // #[begin] error
    if (expr.type !== ExprType.ACCESSOR) {
        throw new Error('[SAN ERROR] Invalid Expression in Data splice: ' + exprRaw);
    }
    // #[end]

    expr = {
        type: ExprType.ACCESSOR,
        paths: expr.paths.slice(0)
    }

    let target = this.get(expr)
    let returnValue = []

    if (target instanceof Array) {
        let index = args[0]
        let len = target.length

        if(index > len){
            index = len
        }else if (index < 0) {
            index = len + index

            if (index < 0) {
                index = 0
            }
        }

        let newArray = target.slice(0)

        returnValue = newArray.splice.apply(newArray, args)

        this.raw = this.immutableSet(this.raw, expr.paths, 0, expr.paths.length, newArray, this)

        this.fire({
            expr: expr,
            type: DataChangeType.SPLICE,
            index: index,
            deleteCount: newArray.length,
            value: returnValue,
            insertions: args.slice(2),
            option: option
        })
    }

    // #[begin] error
    this.checkDataTypes();
    // #[end]

    return returnValue
}

/**
 * 数组数据项push操作
 *
 * @param {string|Object} expr 数据项路径
 * @param {*} item 要push的值
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 * @return {number} 新数组的length属性
 */

Data.prototype.push = function (expr, item, option) {
    let target = this.get(expr)

    if(target instanceof Array){
        this.splice(expr, [target.length, 0, item], option)
        return target.length + 1
    }
}

/**
 * 数组数据项pop操作
 *
 * @param {string|Object} expr 数据项路径
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 * @return {*}
 */

Date.prototype.pop = function (expr, option) {
    let target = this.get(expr)

    if(target instanceof Array){
        let len = target.length

        if(len){
            return this.splice(expr, [len - 1, 1], option)[0]
        }
    }
}

/**
 * 数组数据项shift操作
 *
 * @param {string|Object} expr 数据项路径
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 * @return {*}
 */

Date.prototype.shift = function (expr, option) {
    return this.splice(expr, [0, 1], option)[0];
}

/**
 * 数组数据项unshift操作
 *
 * @param {string|Object} expr 数据项路径
 * @param {*} item 要unshift的值
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 * @return {number} 新数组的length属性
 */

Date.prototype.unshift = function (expr, item, option) {
    let target = this.get(expr)

    if(target instanceof Array){
        this.splice(expr, [0, 0, item], option)

        return target.length + 1
    }
}

/**
 * 数组数据项移除操作
 *
 * @param {string|Object} expr 数据项路径
 * @param {number} index 要移除项的索引
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 */

Date.prototype.removeAt = function (expr, index, option) {
    this.splice(expr, [index, 1], option);
}

/**
 * 数组数据项移除操作
 *
 * @param {string|Object} expr 数据项路径
 * @param {*} value 要移除的项
 * @param {Object=} option 设置参数
 * @param {boolean} option.silent 静默设置，不触发变更事件
 */

Date.prototype.remove = function (expr, value, option) {
    let target = this.get(expr)

    if(target instanceof Array){
        let len = target.length

        while(len--){
            if(target[len] === value){
                this.splice(expr, [len, 1], option)
                break
            }
        }
    }
}

export default Data