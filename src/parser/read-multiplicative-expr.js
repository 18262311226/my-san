/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取乘法表达式
 */
import { ExprType } from './expr-type.js';
import { readUnaryExpr } from './read-unary-expr.js';

/**
 * 读取乘法表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readMultiplicativeExpr(walker) {
    var expr = readUnaryExpr(walker);

    while (1) {
        walker.goUntil();

        var code = walker.source.charCodeAt(walker.index);
        switch (code) {
            case 37: // %
            case 42: // *
            case 47: // /
                walker.index++;
                expr = {
                    type: ExprType.BINARY,
                    operator: code,
                    segs: [expr, readUnaryExpr(walker)]
                };
                continue;
        }

        break;
    }

    return expr;
}