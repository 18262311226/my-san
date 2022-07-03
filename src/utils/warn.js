/**
 * 开发时的警告提示
 *
 * @param {string} message 警告信息
 */

export function warn (message) {
    message = "[SAN WARNING] " + message

    if (typeof console === 'object' && console.warn) {
        console.warn(message);
    }else {
        // 防止警告中断调用堆栈
        setTimeout(function () {
            throw new Error(message);
        }, 0);
    }
}