/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取相等比对表达式
 */

import { ExprType } from './expr-type.js';
import { readRelationalExpr } from './read-relational-expr.js';

/**
 * 读取相等比对表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readEqualityExpr(walker) {
    var expr = readRelationalExpr(walker);//从关系表达式解析函数开始，并拿到返回结果
    walker.goUntil();

    var code = walker.source.charCodeAt(walker.index);
    switch (code) {
        case 61: // =
        case 33: // !
            if (walker.nextCode() === 61) {
                code += 61;
                if (walker.nextCode() === 61) {
                    code += 61;
                    walker.index++;
                }
                //返回二元表达式结果
                return {
                    type: ExprType.BINARY,
                    operator: code,
                    segs: [expr, readRelationalExpr(walker)]
                };
            }

            walker.index--;
    }
    //如果不是相等则返回关系表达式函数返回的结果
    return expr;
}