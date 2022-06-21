/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取括号表达式
 */

import { readTertiaryExpr } from './read-tertiary-expr.js';

/**
 * 读取括号表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readParenthesizedExpr(walker) {
    walker.index++;
    var expr = readTertiaryExpr(walker);
    walker.goUntil(41); // )

    expr.parenthesized = true;
    return expr;
}