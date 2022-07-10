/**
 * @file 生命周期类
 */
 function lifeCycleOwnIs(name) {
    return this[name];
}

/**
 * 节点生命周期信息
 *
 * @inner
 * @type {Object}
 */

let lifeCycle = {
    start: {
        is: lifeCycleOwnIs
    },

    compiled: {
        is: lifeCycleOwnIs,
        compiled: true
    },

    inited: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true
    },

    created: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true,
        created: true
    },

    attached: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true,
        created: true,
        attached: true
    },

    detached: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true,
        created: true,
        detached: true
    },

    leaving: {
        is: lifeCycleOwnIs,
        compiled: true,
        inited: true,
        created: true,
        attached: true,
        leaving: true
    },

    disposed: {
        is: lifeCycleOwnIs,
        disposed: true
    }
}

export default lifeCycle