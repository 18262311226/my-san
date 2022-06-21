/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取关系判断表达式
 */
import { ExprType } from './expr-type.js';
import { readAdditiveExpr } from './read-additive-expr.js';

/**
 * 读取关系判断表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readRelationalExpr(walker) {
    var expr = readAdditiveExpr(walker);
    walker.goUntil();

    var code = walker.source.charCodeAt(walker.index);
    switch (code) {
        case 60: // <
        case 62: // >
            if (walker.nextCode() === 61) {
                code += 61;
                walker.index++;
            }

            return {
                type: ExprType.BINARY,
                operator: code,
                segs: [expr, readAdditiveExpr(walker)]
            };
    }

    return expr;
}