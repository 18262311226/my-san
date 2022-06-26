/**
 *
 * @file 字符串源码读取类
 */


/**
 * 字符串源码读取类，用于模板字符串解析过程
 *
 * @class
 * @param {string} source 要读取的字符串
 */
export function Walker (source) {
    this.source = source
    this.len = source.length
    this.index = 0
}

/**
 * 读取下一个字符，返回下一个字符的 code
 *
 * @return {number}
 */
Walker.prototype.nextCode = function () {
    this.index++
    return this.source.charCodeAt(this.index)
}

/**
 * 向前读取字符，直到遇到指定字符再停止
 * 未指定字符时，当遇到第一个非空格、制表符的字符停止
 *
 * @param {number=} charCode 指定字符的code
 * @return {boolean} 当指定字符时，返回是否碰到指定的字符
 */
Walker.prototype.goUntil = function (charCode) {
    let code
    while(this.index < this.len && (code = this.source.charCodeAt(this.index))){
        switch(code){
            case 32: //空格
            case 9: //制表
            case 13: // \r
            case 10: // \n
                this.index++
                break;
            default:
                if(code === charCode){
                    this.index++
                    return 1
                }
                return
        }
    }
}

/**
 * 向前读取符合规则的字符片段，并返回规则匹配结果
 *
 * @param {RegExp} reg 字符片段的正则表达式
 * @param {boolean} isMatchStart 是否必须匹配当前位置
 * @return {Array?}
 */
Walker.prototype.match = function (reg, isMatchStart) {
    reg.lastIndex = this.index

    let match = reg.exec(this.source)
    console.log('match', match)

    if(match && (!isMatchStart || this.index === match.index)){
        this.index = reg.lastIndex
        return match
    }
}