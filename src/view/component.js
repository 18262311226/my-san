/**
 * 组件类
 *
 * @class
 * @param {Object} options 初始化参数
 */

import lifeCycle from "./life-cycle";
import guid from '../utils/guid.js'
import { defineComponent } from "./define-component";
import { preheatANode } from './preheat-a-node.js'
import { parseComponentTemplate } from './parse-component-template'
import { unpackANode } from '../parser/unpack-anode.js'
import { ComponentLoader } from './component-loader.js'

export function Component (options) {
    for(let key in Component.prototype){
        if(this[key] !== Component.prototype[key]){
            warn('\`' + key + '\` is a reserved key of san components. Overriding this property may cause unknown exceptions.');
        }
    }

    options = options || {}

    this.lifeCycle = lifeCycle.start
    this.id = guid++

    if(typeof this.construct === 'function'){
        this.construct(options)
    }

    this.children = []
    this.listeners = []
    this.slotChildren = []
    this.implicitChildren = []

    let clazz = this.constructor

    this.filters = this.filters || clazz.filters || {}
    this.computed = this.computed || clazz.computed || {}
    this.messages = this.messages || clazz.messages || {}

    if(options.transition){
        this.transition = options.transition
    }

    this.owner = options.owner
    this.scope = options.scope
    this.el = options.el

    let parent = options.parent

    if(parent){
        this.parent = parent
        this.parentComponent = options.parent.NodeType === NodeType.CMPT ? parent : parent && this.parentComponent
    }else if(this.owner){
        this.parentComponent = this.owner
        this.scope = this.owner.data
    }

    this.sourceSlotNameProps = []
    this.sourceSlots = {
        name: {}
    }

    // #[begin] devtool
    this._toPhase('beforeCompile');
    // #[end]

    let proto = clazz.prototype

    if(!proto.hasOwnProperty('_cmptReady')){
        proto.components = clazz.components || proto.components || {}
        let components = proto.components

        for(let key in components){
            let cmptClass = components[key]

            if(typeof cmptClass === 'object' && !(cmptClass instanceof ComponentLoader)){
                components[key] = defineComponent(cmptClass)
            }else if(cmptClass === 'self'){
                components[key] = clazz
            }
        }

        proto._cmptReady = 1
    }

    //compile
    if(!proto.hasOwnProperty('aNode')){
        let aPack = clazz.aPack || proto.hasOwnProperty('aPack') && proto.aPack

        if(aPack){
            proto.aPack = unpackANode(aPack)
            clazz.aPack = proto.aPack = null
        }else {
            proto.aNode = parseComponentTemplate(clazz)
        }
    }

    preheatANode(proto.aNode, this)
}