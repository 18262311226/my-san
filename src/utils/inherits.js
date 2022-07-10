/**
 * 构建类之间的继承关系
 *
 * @param {Function} subClass 子类函数
 * @param {Function} superClass 父类函数
 */

import { extend } from './extend.js'

export function inherits (subClass, superClass) {
    let subClassProto = subClass.prototype
    let F = new Function()
    F.prototype = superClass.prototype
    subClass.prototype = new F()
    subClass.prototype.constructor = subClass
    extend(subClass.prototype, subClassProto)
}