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
    var conditional = readLogicalORExpr(walker);
    walker.goUntil();

    if (walker.source.charCodeAt(walker.index) === 63) { // ?
        walker.index++;
        var yesExpr = readTertiaryExpr(walker);
        walker.goUntil();

        if (walker.source.charCodeAt(walker.index) === 58) { // :
            walker.index++;
            return {
                type: ExprType.TERTIARY,
                segs: [
                    conditional,
                    yesExpr,
                    readTertiaryExpr(walker)
                ]
            };
        }
    }

    return conditional;
}