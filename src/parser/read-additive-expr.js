/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取加法表达式
 */

import { ExprType } from './expr-type.js';
import { readMultiplicativeExpr } from './read-multiplicative-expr.js';


/**
 * 读取加法表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readAdditiveExpr(walker) {
    var expr = readMultiplicativeExpr(walker);//从乘除取余开始，并拿到返回结果

    while (1) {//这个循环有点多余，不知道啥意思，也只循环一次
        walker.goUntil();
        var code = walker.source.charCodeAt(walker.index);

        switch (code) {
            case 43: // +
            case 45: // -
                walker.index++;
                expr = {
                    type: ExprType.BINARY,
                    operator: code,
                    segs: [expr, readMultiplicativeExpr(walker)]
                };
                continue;
        }

        break;
    }
    //不是加减则返回乘除函数结果
    return expr;
}