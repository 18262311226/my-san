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
    var expr = readAdditiveExpr(walker); //从加减解析函数开始，并拿到返回值结果
    walker.goUntil();//index跳过所有空白，制表符

    var code = walker.source.charCodeAt(walker.index);//拿到当前字符编码
    switch (code) {
        case 60: // <
        case 62: // >
            if (walker.nextCode() === 61) { //如果是等于号
                code += 61; //字符编码加上等于号编码
                walker.index++;
            }
            //无论是大于还是小于有没有等于号都返回关系表达式
            return {
                type: ExprType.BINARY,
                operator: code,
                segs: [expr, readAdditiveExpr(walker)]
            };
    }
    //不是关系表达式则返回加减函数返回的结果
    return expr;
}