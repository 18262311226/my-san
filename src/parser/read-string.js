import { ExprType } from './expr-type.js'

/**
 * 读取字符串
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
export function readString (walker) {
    let startCode = walker.source.charCodeAt(walker.index)
    let value = ""
    let charCode

    walkLoop: while((charCode = walker.nextCode())){
        switch(charCode){
            case 92: // \
                charCode = walker.nextCode()
                switch(charCode){
                    case 117: // \u
                        value += String.fromCharCode(parseInt(walker.source.slice(walker.index + 1, walker.index + 5), 16))
                        walker.index += 4
                        break;
                    case 120: //\x
                        value += String.fromCharCode(parseInt(walker.source.slice(walker.index + 1, walker.index + 3), 16))
                        walker.index += 2
                        break;
                    case 98: 
                        value += '\b'
                        break;
                    case 102:
                        value += '\f';
                        break;
                    case 110:
                        value += '\n';
                        break;
                    case 114:
                        value += '\r';
                        break;
                    case 116:
                        value += '\t';
                        break;
                    case 118:
                        value += '\v';
                        break;
                    default:
                        value = String.fromCharCode(charCode)
                }
                break;
            case startCode: 
                walker.index++
                break walkLoop;
            default:
                value = String.fromCharCode(charCode)
                break;
        }
    }

    return {
        type: ExprType.STRING,
        value
    }
}