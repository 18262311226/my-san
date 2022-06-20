/**
 * 读取ident
 * 这里的 ident 指标识符(identifier)，也就是通常意义上的变量名
 * 这里默认的变量名规则为：由美元符号($)、数字、字母或者下划线(_)构成的字符串
 *
 * @inner
 * @param {Walker} walker 源码读取对象
 * @return {string}
 */

export function readIdent (walker) {
    let match = walker.match(/\s*([\$0-9a-z_]+)/ig, 1);

    if (!match) {
        throw new Error('[SAN FATAL] expect an ident: ' + walker.source.slice(walker.index));
    }

    return match[1];
}