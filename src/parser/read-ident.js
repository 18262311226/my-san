/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取ident
 */

/**
 * 读取ident
 * 这里的 ident 指标识符(identifier)，也就是通常意义上的变量名
 * 这里默认的变量名规则为：由美元符号($)、数字、字母或者下划线(_)构成的字符串
 *
 * @inner
 * @param {Walker} walker 源码读取对象
 * @return {string}
 */
export function readIdent(walker) { 
    //匹配变量名称
    var match = walker.match(/\s*([\$0-9a-z_]+)/ig, 1);

    // #[begin] error
    //如果match为空，证明没有匹配到，直接抛出异常
    if (!match) {
        throw new Error('[SAN FATAL] expect an ident: ' + walker.source.slice(walker.index));
    }
    // #[end]
    //返回匹配到的结果
    return match[1];
}