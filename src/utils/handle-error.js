/**
 * @file 处理组件异常
 */

export function handleError (e, component, info) {
    let current = component

    while(current){
        if(typeof current.error === 'function'){
            current.error(e, component, info)
            return
        }

        current = current.parentComponent
    }

    throw e
}