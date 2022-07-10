import { Component } from './component.js'
import { inherits } from '../utils/inherits.js'

/**
 * 创建组件类
 *
 * @param {Object} proto 组件类的方法表
 * @param {Function=} SuperComponent 父组件类
 * @return {Function}
 */

export function defineComponent (proto, SuperComponent) {
    if(typeof proto === 'function'){
        return
    }

    if(typeof proto !== 'object'){
        throw new Error('[SAN FATAL] defineComponent need a plain object.');
    }

    SuperComponent = SuperComponent || Component

    function ComponentClass (option) {
        SuperComponent.call(this, option)
    }

    ComponentClass.prototype = proto
    inherits(ComponentClass, SuperComponent)

    return ComponentClass
}   