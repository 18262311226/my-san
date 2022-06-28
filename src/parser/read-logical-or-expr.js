/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取逻辑或表达式
 */
import { ExprType } from './expr-type.js';
import { readLogicalANDExpr } from './read-logical-and-expr.js';

/**
 * 读取逻辑或表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readLogicalORExpr(walker) {
    var expr = readLogicalANDExpr(walker); //从与运算解析开始向下
    walker.goUntil();

    if (walker.source.charCodeAt(walker.index) === 124) { // |
        if (walker.nextCode() === 124) { //如果还是| 则是或运算
            walker.index++;
            //返回二元表达式
            return {
                type: ExprType.BINARY,
                operator: 248,
                segs: [expr, readLogicalORExpr(walker)]
            };
        }

        walker.index--;
    }
    //不是或运算则返回与解析函数返回的结果
    return expr;
}