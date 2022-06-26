/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取访问表达式
 */

import { ExprType } from './expr-type.js';
import { readIdent } from './read-ident.js';
import { readTertiaryExpr } from './read-tertiary-expr.js';

/**
 * 读取访问表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readAccessor(walker) {
    var firstSeg = readIdent(walker);//读取到变量名
    switch (firstSeg) {
        case 'true':
        case 'false':
            return {
                type: ExprType.BOOL,
                value: firstSeg === 'true'
            };
        case 'null':
            return {
                type: ExprType.NULL
            };
    }

    //如果上面没有走到上面的switch，就直接反回是个对变量的访问，paths就是路径，存储的就是一个类型为字符串，值是变量名
    //let obj = {
    //  name:'liu',
    //  age: 18,
    //  child: {
    //      name: 'xliu'
    //  }
    //}
    // child.name 第一次匹配到value为child
    var result = {
        type: ExprType.ACCESSOR,
        paths: [
            {type: ExprType.STRING, value: firstSeg}
        ]
    };

    /* eslint-disable no-constant-condition */
    accessorLoop: while (1) {
    /* eslint-enable no-constant-condition */
        //正则表达式匹配完之后lastIndex之后自动跳到下一个
        switch (walker.source.charCodeAt(walker.index)) {
            case 46: // . 如果匹配到点，就说明是对象访问的方式
                walker.index++; //跳到下一个

                // ident as string
                //继续看是否是对象访问方式
                result.paths.push({
                    type: ExprType.STRING,
                    value: readIdent(walker)
                });
                break;
            //如果是中括号，则先看内容是否为三元表达式
            case 91: // [
                walker.index++;
                result.paths.push(readTertiaryExpr(walker));
                walker.goUntil(93); // ]  跳过右中括号
                break;

            default:
                break accessorLoop;
        }
    }

    return result;
}