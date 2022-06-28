/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取逻辑与表达式
 */
import { ExprType } from './expr-type.js';
import { readEqualityExpr } from './read-equality-expr.js';

/**
 * 读取逻辑与表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readLogicalANDExpr(walker) {
    var expr = readEqualityExpr(walker);//从相等解析入口开始，并拿到返回结果
    walker.goUntil();

    if (walker.source.charCodeAt(walker.index) === 38) { // &
        if (walker.nextCode() === 38) {
            walker.index++;
            //返回二元表达式
            return {
                type: ExprType.BINARY,
                operator: 76,
                segs: [expr, readLogicalANDExpr(walker)]
            };
        }

        walker.index--;
    }
    //不是与运算则返回相等解析函数返回的结果
    return expr;
}