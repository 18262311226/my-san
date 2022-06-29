/**
 * 对象属性拷贝
 *
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @return {Object} 返回目标对象
 */
export function extend (target, source) {
    for(let key in source){
        if(source.hasOwnProperty(key)){
            let value = source[key]

            if(typeof value != 'undefined'){
                target[key] = value
            }
        }
    }

    return target
}