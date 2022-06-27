/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取调用
 */

import { ExprType } from './expr-type.js';
import { readAccessor } from './read-accessor.js';
import { readTertiaryExpr } from './read-tertiary-expr.js';

/**
 * 读取调用
 *
 * @param {Walker} walker 源码读取对象
 * @param {Array=} defaultArgs 默认参数
 * @return {Object}
 */
export function readCall(walker, defaultArgs) {
    walker.goUntil();//跳过空白符，制表符
    var result = readAccessor(walker);//进入对象访问解析函数，并拿到结果

    var args;
    if (walker.goUntil(40)) { // (
        args = [];

        while (!walker.goUntil(41)) { // )
            args.push(readTertiaryExpr(walker));
            walker.goUntil(44); // ,
        }
    }
    else if (defaultArgs) {
        args = defaultArgs;
    }

    if (args) {
        result = {
            type: ExprType.CALL,
            name: result,
            args: args
        };
    }

    return result;
}