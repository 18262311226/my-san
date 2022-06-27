/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取三元表达式
 */

import { ExprType } from './expr-type.js';
import { readLogicalORExpr } from './read-logical-or-expr.js';

/**
 * 读取三元表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readTertiaryExpr(walker) {
    var conditional = readLogicalORExpr(walker); //进入或运算解析函数
    walker.goUntil(); //下标跳过所有空白，制表符

    //拿到当前字符编码是否是？
    if (walker.source.charCodeAt(walker.index) === 63) { // ?
        walker.index++; //下标继续向前走
        var yesExpr = readTertiaryExpr(walker); //仍然有可能是三元表达式
        walker.goUntil();//跳过所有空白符，制表符
        //拿到当前字符编码是否是 :
        if (walker.source.charCodeAt(walker.index) === 58) { // :
            walker.index++; //下标继续向前走
            //返回三元表达式对象
            return {
                type: ExprType.TERTIARY,
                segs: [
                    conditional,//或运算方法返回的结果
                    yesExpr,
                    readTertiaryExpr(walker)
                ]
            };
        }
    }
    //不是则返回或运算规则入口返回的对象
    return conditional;
}